import type { Attachment } from "svelte/attachments";
import { prefersReducedMotion } from "$lib/landing/motion";

/**
 * A one-time entrance for a block the server renders in its end state: on
 * mount, if the block is still below the fold and motion is allowed,
 * `prepare` puts it in its start state, and `play` runs when it scrolls into
 * view. Already on screen, reduced motion or no JS: it stays as rendered.
 * `play` may return a cleanup (cancel its timers), called on teardown.
 */
export function enterView({
	prepare,
	play,
	threshold = 0.18,
}: {
	prepare: () => void;
	play: () => (() => void) | void;
	threshold?: number;
}): Attachment<HTMLElement> {
	return (el) => {
		if (prefersReducedMotion()) return;
		if (el.getBoundingClientRect().top < window.innerHeight) return;
		prepare();
		let cleanup: (() => void) | void;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				observer.disconnect();
				cleanup = play();
			},
			{ threshold },
		);
		observer.observe(el);
		return () => {
			observer.disconnect();
			cleanup?.();
		};
	};
}
