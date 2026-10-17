import type { Attachment } from "svelte/attachments";
import { prefersReducedMotion } from "../motion";

/**
 * Counts the element's text up from 0 to `to` with an ease-out curve: when it
 * scrolls into view (unless `onView` is false), and again each time the
 * pointer enters `hoverTarget` (an ancestor selector, e.g. the surrounding
 * card). On leave the final value is shown at once.
 */
export function countUp({
	to,
	duration = 1400,
	hoverTarget,
	hoverDelay = 100,
	onView = true,
	viewDelay = 300,
	threshold = 0.35,
}: {
	to: number;
	duration?: number;
	hoverTarget?: string;
	/** Delay before counting on hover, ms. */
	hoverDelay?: number;
	onView?: boolean;
	/** Delay before counting on view, ms. */
	viewDelay?: number;
	/** Share of the element that must be visible to count on view. */
	threshold?: number;
}): Attachment<HTMLElement> {
	return (el) => {
		if (prefersReducedMotion()) return;
		let frame = 0;

		const run = (delay: number) => {
			cancelAnimationFrame(frame);
			const start = performance.now() + delay;
			const tick = (now: number) => {
				const k = Math.min(1, Math.max(0, (now - start) / duration));
				el.textContent = String(Math.round(to * (1 - (1 - k) ** 3)));
				if (k < 1) frame = requestAnimationFrame(tick);
			};
			frame = requestAnimationFrame(tick);
		};
		const finish = () => {
			cancelAnimationFrame(frame);
			el.textContent = String(to);
		};

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				run(viewDelay);
				observer.disconnect();
			},
			{ threshold },
		);
		if (onView) observer.observe(el);

		const host = hoverTarget ? el.closest<HTMLElement>(hoverTarget) : null;
		const onEnter = () => run(hoverDelay);
		host?.addEventListener("mouseenter", onEnter);
		host?.addEventListener("mouseleave", finish);

		return () => {
			observer.disconnect();
			cancelAnimationFrame(frame);
			host?.removeEventListener("mouseenter", onEnter);
			host?.removeEventListener("mouseleave", finish);
		};
	};
}
