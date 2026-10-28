/**
 * The hero switch's state (plan 03 §3.2), the design's `setMode` in `#si-js`:
 * "two" marks every ERP entry "Manuell nachtragen"; "one" marks them "…" and
 * then "Synchronisiert" one by one, 700 + 550 × i ms apart (all at once with
 * reduced motion), and the last one calls `onSynced` once per visit (the
 * confetti). Created per component instance, so nothing is shared between
 * SSR requests. Timers only start from browser events.
 */
import type { Mode } from "./content";

export type Status = "man" | "pending" | "ok";

export const SYNC_FIRST_MS = 700;
export const SYNC_STEP_MS = 550;
/** The auto-switch fires this long after the stage first comes into view. */
export const AUTO_SWITCH_MS = 3400;

export class Stage {
	#mode = $state<Mode>("two");
	statuses = $state<Status[]>([]);
	/** The visitor used the switch: no auto-switch any more. Plain field. */
	chosen = false;
	/** The confetti played (once per visit). Plain field. */
	celebrated = false;
	/** Called when the last entry turns "Synchronisiert" the first time. */
	onSynced?: () => void;
	#reduced: () => boolean;
	#timers: ReturnType<typeof setTimeout>[] = [];

	constructor(count: number, reduced: () => boolean = () => false) {
		this.statuses = Array.from({ length: count }, () => "man");
		this.#reduced = reduced;
	}

	/** The switch's value; setting it is the visitor's choice. */
	get mode() {
		return this.#mode;
	}
	set mode(mode: Mode) {
		this.chosen = true;
		this.set(mode);
	}

	set(mode: Mode) {
		this.#clear();
		this.#mode = mode;
		if (mode === "two") {
			this.statuses = this.statuses.map(() => "man");
			return;
		}
		const reduced = this.#reduced();
		this.statuses = this.statuses.map(() => (reduced ? "ok" : "pending"));
		if (reduced) return;
		const last = this.statuses.length - 1;
		for (let i = 0; i <= last; i++) {
			this.#timers.push(
				setTimeout(
					() => {
						this.statuses[i] = "ok";
						if (i === last && !this.celebrated) {
							this.celebrated = true;
							this.onSynced?.();
						}
					},
					SYNC_FIRST_MS + i * SYNC_STEP_MS,
				),
			);
		}
	}

	/** The design's one-time switch to "Mit Heidi", unless the visitor chose first. */
	autoSwitch() {
		if (this.chosen || this.celebrated || this.#mode !== "two") return;
		this.set("one");
	}

	destroy() {
		this.#clear();
	}

	#clear() {
		this.#timers.forEach(clearTimeout);
		this.#timers = [];
	}
}
