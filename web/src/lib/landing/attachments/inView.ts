import type { Attachment } from "svelte/attachments";

type Options = {
	/** Share of the element that must be visible, 0–1. */
	threshold?: number;
	/** Stop observing after the first enter. */
	once?: boolean;
	onEnter?: () => void;
	onLeave?: () => void;
};

/** Calls `onEnter`/`onLeave` as the element scrolls in and out of view. */
export function inView({
	threshold = 0,
	once = false,
	onEnter,
	onLeave,
}: Options): Attachment<HTMLElement> {
	return (el) => {
		let inside = false;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting === inside) return;
				inside = entry.isIntersecting;
				if (inside) {
					onEnter?.();
					if (once) observer.disconnect();
				} else {
					onLeave?.();
				}
			},
			{ threshold },
		);
		observer.observe(el);
		return () => observer.disconnect();
	};
}
