/* eslint-disable svelte/prefer-svelte-reactivity -- Dates are replaced, never mutated; the Sets are deliberately non-reactive */
import { isWithinBusinessHours } from "./businessHours";
import type { SlackMessage } from "./types";

type Status = "ready" | "sending" | "waiting_for_human" | "fetching_messages";

const OUT_OF_OFFICE_TEXT =
	"Vielen Dank für Ihre Nachricht. Unser Team ist derzeit außerhalb der Geschäftszeiten (Mo-Fr 08:00-20:00 Uhr). Ihr Anliegen wurde erfasst und wird am nächsten Werktag ab 08:00 Uhr priorisiert bearbeitet.";

const NO_REPLY_TIMEOUT = 300_000;

type ApiMessage = Omit<SlackMessage, "timestamp"> & { timestamp: string };

async function fetchThread(threadTs: string): Promise<SlackMessage[]> {
	try {
		const res = await fetch("/api/chat/slack/messages", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ threadTs }),
		});
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const { messages }: { messages: ApiMessage[] } = await res.json();
		return messages.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
	} catch (error) {
		console.error("Error fetching Slack thread:", error);
		return [];
	}
}

/**
 * Slack live chat for one visitor. Exactly one instance exists per widget
 * (shared through context), so there is exactly one polling loop (KI-19).
 */
export class SlackChat {
	messages = $state<SlackMessage[]>([]);
	status = $state<Status>("ready");
	input = $state("");
	threadTs = $state<string | undefined>();
	now = $state(new Date());
	isOutOfOffice = $derived(!isWithinBusinessHours(this.now));
	/** Set while the panel is open; polling pauses otherwise. */
	active = $state(false);

	#lastSentTs: string | null = null;
	#oooAdded = new Set<string>();
	#inFlight = false;
	#visible = $state(true);
	#fast = $derived(this.status === "waiting_for_human");
	#destroy: () => void;
	#storageKey: string;

	constructor(userId?: string) {
		this.#storageKey = `slack_thread_${userId ?? "visitor"}`;

		this.#destroy = $effect.root(() => {
			// Office-hours clock
			$effect(() => {
				const t = setInterval(() => (this.now = new Date()), 60_000);
				return () => clearInterval(t);
			});

			$effect(() => {
				const onVisibility = () =>
					(this.#visible = document.visibilityState === "visible");
				onVisibility();
				document.addEventListener("visibilitychange", onVisibility);
				return () =>
					document.removeEventListener("visibilitychange", onVisibility);
			});

			// Polling depends only on the thread, the waiting flag and visibility,
			// never on the per-tick fetch state (KI-20)
			$effect(() => {
				const ts = this.threadTs;
				if (!ts || !this.active || !this.#visible) return;
				const t = setInterval(() => this.#poll(ts), this.#fast ? 1000 : 2000);
				return () => clearInterval(t);
			});
		});
	}

	/** Restores the visitor's thread from localStorage. Client only. */
	async restore() {
		const stored = localStorage.getItem(this.#storageKey);
		if (!stored) return;
		this.threadTs = stored;
		this.status = "fetching_messages";
		this.messages = await fetchThread(stored);
		this.status = "ready";
	}

	async send(text: string) {
		if (!text.trim()) return;

		// Bot-posted messages are the visitor's own, so the optimistic copy uses
		// the same role. It is replaced once polling returns the Slack copy.
		this.messages.push({ role: "assistant", text, timestamp: new Date() });
		this.input = "";
		this.status = "sending";

		try {
			const res = await fetch("/api/chat/slack/send", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					message: text,
					threadTs: this.threadTs ?? null,
				}),
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const { ts, messageTs }: { ts: string; messageTs: string } =
				await res.json();

			this.#lastSentTs = messageTs;
			if (!this.threadTs) {
				this.threadTs = ts;
				localStorage.setItem(this.#storageKey, ts);
			}
			this.status = "waiting_for_human";

			// Reads the live status when it fires (KI-21)
			setTimeout(() => {
				if (this.status === "waiting_for_human") this.status = "ready";
			}, NO_REPLY_TIMEOUT);
		} catch (error) {
			console.error("Error sending Slack message:", error);
			this.status = "ready";
		}
	}

	/** Forgets the visitor's thread (KI-23). */
	reset() {
		localStorage.removeItem(this.#storageKey);
		this.threadTs = undefined;
		this.messages = [];
		this.status = "ready";
		this.#lastSentTs = null;
	}

	destroy() {
		this.#destroy();
	}

	async #poll(ts: string) {
		if (this.#inFlight) return;
		this.#inFlight = true;
		try {
			const fetched = await fetchThread(ts);
			if (ts !== this.threadTs) return;

			const existing = new Set(this.messages.map((m) => m.id));
			const toAdd = fetched.filter((m) => !existing.has(m.id));
			if (toAdd.length === 0) return;

			// Drop optimistic copies that Slack has now confirmed
			for (const m of toAdd) {
				if (m.role !== "assistant") continue;
				const i = this.messages.findIndex(
					(p) => !p.id && p.text.trim() === m.text.trim(),
				);
				if (i !== -1) this.messages.splice(i, 1);
			}
			this.messages.push(...toAdd);

			if (
				this.isOutOfOffice &&
				!this.#oooAdded.has(ts) &&
				toAdd.some((m) => m.role === "assistant")
			) {
				this.#oooAdded.add(ts);
				this.messages.push({
					id: `ooo-${Date.now()}`,
					role: "human_reply",
					text: OUT_OF_OFFICE_TEXT,
					timestamp: new Date(),
				});
			}

			if (this.status === "waiting_for_human") {
				const sentAt = this.#lastSentTs ? Number(this.#lastSentTs) * 1000 : 0;
				if (
					toAdd.some(
						(m) => m.role === "human_reply" && m.timestamp.getTime() > sentAt,
					)
				) {
					this.status = "ready";
				}
			}
		} finally {
			this.#inFlight = false;
		}
	}
}
