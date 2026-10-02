import type { AnimationItem } from "lottie-web";
import type { Attachment } from "svelte/attachments";

/**
 * Plays a Lottie animation inside the element (replaces `lottie-react`).
 * Loads the player and the animation JSON only once the element is within
 * 200px of the viewport, unless `eager` is set.
 */
export function lottie(
	load: () => Promise<unknown>,
	eager = false,
): Attachment<HTMLElement> {
	return (el) => {
		let anim: AnimationItem | undefined;
		let cancelled = false;

		const start = async () => {
			const [{ default: lottieWeb }, animationData] = await Promise.all([
				import("lottie-web/build/player/lottie_light"),
				load(),
			]);
			if (cancelled) return;
			anim = lottieWeb.loadAnimation({
				container: el,
				renderer: "svg",
				loop: true,
				autoplay: true,
				animationData,
			});
		};

		let observer: IntersectionObserver | undefined;
		if (eager) {
			start();
		} else {
			observer = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting) {
						observer?.disconnect();
						start();
					}
				},
				{ rootMargin: "200px" },
			);
			observer.observe(el);
		}

		return () => {
			cancelled = true;
			observer?.disconnect();
			anim?.destroy();
		};
	};
}
