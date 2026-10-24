import type { Attachment } from "svelte/attachments";
import { prefersReducedMotion } from "../motion";

type Cleanup = (() => void) | void;

type Options = {
	/**
	 * One pass of the animation: resets its block and schedules the steps.
	 * Returns a cleanup that cancels the pending steps.
	 */
	run: () => Cleanup;
	/** Interval between passes, ms. */
	every: number;
	/** Share of the element that must be visible, 0–1. */
	threshold?: number;
	/**
	 * Wait before the first pass, ms (only on the first enter): for a block
	 * that's in view on load and already shows its end state.
	 */
	delay?: number;
};

/**
 * Runs `run` when the element scrolls into view and again every `every` ms
 * while it stays in view and the tab is visible (the designs' `loop`, but
 * stopping off-screen). Leaving the view or hiding the tab stops the loop and
 * cancels the pass's pending steps; the next enter starts over. With reduced
 * motion nothing runs, so the server's end state stays.
 */
export function loopInView({
	run,
	every,
	threshold = 0.15,
	delay = 0,
}: Options): Attachment<HTMLElement> {
	return (el) => {
		if (prefersReducedMotion()) return;
		let inside = false;
		let first = true;
		let timer: ReturnType<typeof setTimeout> | undefined;
		let cleanup: Cleanup;

		const stop = () => {
			clearTimeout(timer);
			timer = undefined;
			cleanup?.();
			cleanup = undefined;
		};
		const pass = () => {
			cleanup?.();
			cleanup = run();
			timer = setTimeout(pass, every);
		};
		const start = () => {
			if (timer !== undefined || !inside || document.hidden) return;
			const wait = first ? delay : 0;
			first = false;
			timer = setTimeout(pass, wait);
		};

		const observer = new IntersectionObserver(
			([entry]) => {
				inside = entry.isIntersecting;
				if (inside) start();
				else stop();
			},
			{ threshold },
		);
		observer.observe(el);
		const onVisibility = () => (document.hidden ? stop() : start());
		document.addEventListener("visibilitychange", onVisibility);

		return () => {
			observer.disconnect();
			document.removeEventListener("visibilitychange", onVisibility);
			stop();
		};
	};
}
