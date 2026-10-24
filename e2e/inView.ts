import type { Locator } from "@playwright/test";

/**
 * Scrolls `target` into view and waits until an IntersectionObserver has seen
 * it. The page's own observers (`loopInView`, `enterView` …) were created
 * earlier, so theirs have run by then. Their callbacks arrive with the
 * browser's rendering, not with Playwright's fake clock, so a test that
 * advances the clock right after scrolling races them.
 */
export async function scrollIn(target: Locator, threshold = 0.15) {
	await target.scrollIntoViewIfNeeded();
	await target.evaluate(
		(el, t) =>
			new Promise<void>((resolve) => {
				const observer = new IntersectionObserver(
					([entry]) => {
						if (entry.intersectionRatio < t) return;
						observer.disconnect();
						resolve();
					},
					{ threshold: t },
				);
				observer.observe(el);
			}),
		threshold,
	);
}
