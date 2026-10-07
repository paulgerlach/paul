/**
 * The page's single "now". Starts at the server's render time (so hydration
 * matches the SSR markup) and ticks once a second in the browser, aligned to
 * the full second, until the deadline passes. Provided per page via context.
 */
import { getContext, setContext } from "svelte";
import { DEADLINE, isExpired, startOfBerlinDay } from "./deadline";

export class DeadlineClock {
	/** Changes every second; only the countdown should read it. */
	now = $state(0);
	/** 00:00 Berlin of today: changes once a day, so day-based values don't recompute every second. */
	today = $derived(startOfBerlinDay(this.now));
	expired = $derived(isExpired(this.now));

	#timer: ReturnType<typeof setTimeout> | undefined;

	constructor(serverNow: number) {
		this.now = serverNow;
	}

	/** Starts ticking from the browser's time. Returns the cleanup. */
	start() {
		const tick = () => {
			this.now = Date.now();
			if (this.now >= DEADLINE) return;
			this.#timer = setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
		};
		tick();
		return () => clearTimeout(this.#timer);
	}
}

const KEY = Symbol("deadline-clock");

export function setDeadlineClock(serverNow: number) {
	return setContext(KEY, new DeadlineClock(serverNow));
}

export function getDeadlineClock() {
	return getContext<DeadlineClock>(KEY);
}
