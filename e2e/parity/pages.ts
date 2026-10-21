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

// /funktionen is a new design (not a port), so it has no Next
// visual baseline; the smoke run still checks it.
export const VISUAL_PAGES = PAGES.filter((path) => path !== "/funktionen");

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
