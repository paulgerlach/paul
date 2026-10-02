import type { Attachment } from "svelte/attachments";
import { prefersReducedMotion } from "../motion";

/** Restarts the CSS animations under `el` by toggling `.play`. */
function replay(el: HTMLElement) {
	el.classList.remove("play");
	void el.offsetWidth; // force a reflow, so the animations start over
	el.classList.add("play");
}

/**
 * Adds `.play` when the element becomes visible, which starts the `.a-*`
 * animations of its children (tokens.css). With `loop`, they restart every
 * `loop` ms while the element stays visible. With reduced motion nothing is
 * added, and the children stay in their final state.
 */
export function playOnView({
	loop,
	threshold = 0.35,
}: { loop?: number; threshold?: number } = {}): Attachment<HTMLElement> {
	return (el) => {
		if (prefersReducedMotion()) return;
		let timer: ReturnType<typeof setInterval> | undefined;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					replay(el);
					if (!loop) observer.disconnect();
					else timer ??= setInterval(() => replay(el), loop);
				} else if (timer) {
					clearInterval(timer);
					timer = undefined;
				}
			},
			{ threshold },
		);
		observer.observe(el);
		return () => {
			observer.disconnect();
			clearInterval(timer);
		};
	};
}
