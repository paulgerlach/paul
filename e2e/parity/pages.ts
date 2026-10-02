import type { Page } from "@playwright/test";

// Every sitemap URL both apps serve, plus one blog post and the questionnaire.
// /messdienstwechsel is Svelte-only, so it has no Next baseline (plan 10.1).
export const PAGES = [
	"/",
	"/funktionen",
	"/preise",
	"/geraete",
	"/kontakt",
	"/blog",
	"/blog/wasserzaehler-mit-fernablesung",
	"/impressum",
	"/datenschutzhinweise",
	"/fragebogen",
];

export const WIDTHS = [375, 768, 992, 1200, 1640];

export const slug = (path: string) =>
	path === "/" ? "home" : path.slice(1).replaceAll("/", "_");

// Brings lazy images and in-view Lottie triggers into play, then returns to the top.
export async function settle(page: Page) {
	await page.evaluate(async () => {
		for (let y = 0; y < document.body.scrollHeight; y += 400) {
			window.scrollTo(0, y);
			await new Promise((r) => setTimeout(r, 50));
		}
		window.scrollTo(0, 0);
	});
	await page.waitForLoadState("networkidle");
	await page.evaluate(() => document.fonts.ready);
}
