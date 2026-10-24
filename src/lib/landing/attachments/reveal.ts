import type { Attachment } from "svelte/attachments";
import { prefersReducedMotion } from "../motion";

/**
 * Reveal on scroll (the designs' `.rv` → `.in`): on mount, every `selector`
 * element inside the host that is still below the viewport gets the class
 * `rv-wait` (hidden) and `rv-anim` (the transition), both styled by the page.
 * It loses `rv-wait` when it scrolls into view, and `rv-anim` once revealed,
 * so the element's own transitions apply again. Elements already on screen, no-JS visitors and reduced motion see
 * the content as rendered, so nothing flashes or stays hidden.
 */
export function reveal(
	selector = ".rv",
	{ threshold = 0.15 } = {},
): Attachment<HTMLElement> {
	return (host) => {
		if (prefersReducedMotion()) return;
		const timers = new Set<ReturnType<typeof setTimeout>>();
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					const el = entry.target;
					el.classList.remove("rv-wait");
					observer.unobserve(el);
					const timer = setTimeout(() => {
						el.classList.remove("rv-anim");
						timers.delete(timer);
					}, 800);
					timers.add(timer);
				}
			},
			{ threshold },
		);
		for (const el of host.querySelectorAll(selector)) {
			if (el.getBoundingClientRect().top < window.innerHeight) continue;
			el.classList.add("rv-wait", "rv-anim");
			observer.observe(el);
		}
		return () => {
			observer.disconnect();
			for (const timer of timers) clearTimeout(timer);
			for (const el of host.querySelectorAll(".rv-anim"))
				el.classList.remove("rv-wait", "rv-anim");
		};
	};
}
