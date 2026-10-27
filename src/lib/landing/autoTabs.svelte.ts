import { inView } from "./attachments/inView";
import { prefersReducedMotion } from "./motion";

/** What can pause auto-advance. */
export type PauseReason = "view" | "hover" | "focus" | "hidden";

type Options = {
	count: number;
	/** One interval for every tab, or one per tab. */
	intervalMs: number | readonly number[];
	/** Share of the block that must be visible before it advances. */
	threshold?: number;
	/** Id of tab `i`, to move focus on arrow keys. */
	tabId: (i: number) => string;
};

/**
 * WAI-ARIA tabs that advance by themselves (/vorgehen's steps, /funktionen's
 * roles): every `intervalMs` (of the current tab) while the block is in view, the browser tab
 * is visible and the pointer and focus are outside the block; a pause restarts
 * the tab's full interval. Choosing a tab stops it for good. None on the server
 * and with reduced motion. Create it during component init (it owns an effect)
 * and attach `attach` to the block.
 */
export class AutoTabs {
	active = $state(0);
	/** Until the visitor chooses a tab (off on the server and with reduced motion). */
	auto = $state(false);
	#paused = $state<Record<PauseReason, boolean>>({
		view: true,
		hover: false,
		focus: false,
		hidden: false,
	});
	readonly running = $derived(
		this.auto && !Object.values(this.#paused).some(Boolean),
	);

	readonly #count: number;
	readonly #threshold: number;
	readonly #tabId: (i: number) => string;
	readonly #interval: number | readonly number[];

	constructor({ count, intervalMs, threshold = 0.35, tabId }: Options) {
		this.#count = count;
		this.#threshold = threshold;
		this.#tabId = tabId;
		this.#interval = intervalMs;

		// One timer at a time; a new tab or a resume starts a fresh interval.
		$effect(() => {
			if (!this.running) return;
			const from = this.active;
			const timer = setTimeout(
				() => (this.active = (from + 1) % this.#count),
				this.intervalOf(from),
			);
			return () => clearTimeout(timer);
		});
	}

	/** Interval of tab `i`, ms. */
	intervalOf(i: number) {
		return typeof this.#interval === "number"
			? this.#interval
			: this.#interval[i];
	}

	/** Turns auto-advance on (the attachment does, unless motion is reduced). */
	arm() {
		this.auto = true;
	}

	pause(reason: PauseReason, on: boolean) {
		this.#paused[reason] = on;
	}

	/** Arms auto-advance and tracks what pauses it. */
	attach = (el: HTMLElement) => {
		if (!prefersReducedMotion()) this.arm();
		const stopView = inView({
			threshold: this.#threshold,
			onEnter: () => this.pause("view", false),
			onLeave: () => this.pause("view", true),
		})(el);
		const onVisibility = () =>
			this.pause("hidden", document.visibilityState === "hidden");
		const on = {
			pointerenter: () => this.pause("hover", true),
			pointerleave: () => this.pause("hover", false),
			focusin: () => this.pause("focus", true),
			focusout: (e: Event) => {
				const to = (e as FocusEvent).relatedTarget as Node | null;
				if (!el.contains(to)) this.pause("focus", false);
			},
		};
		for (const [type, fn] of Object.entries(on)) el.addEventListener(type, fn);
		document.addEventListener("visibilitychange", onVisibility);
		onVisibility();
		return () => {
			stopView?.();
			for (const [type, fn] of Object.entries(on))
				el.removeEventListener(type, fn);
			document.removeEventListener("visibilitychange", onVisibility);
		};
	};

	/** A tab chosen by the visitor. */
	select = (i: number, focus = false) => {
		this.auto = false;
		this.active = (i + this.#count) % this.#count;
		if (focus) document.getElementById(this.#tabId(this.active))?.focus();
	};

	/** The vertical tabs' keys, for the tablist's `onkeydown`. */
	onkeydown = (e: KeyboardEvent) => {
		const next: Record<string, number> = {
			ArrowDown: this.active + 1,
			ArrowRight: this.active + 1,
			ArrowUp: this.active - 1,
			ArrowLeft: this.active - 1,
			Home: 0,
			End: this.#count - 1,
		};
		if (!(e.key in next)) return;
		e.preventDefault();
		this.select(next[e.key], true);
	};
}
