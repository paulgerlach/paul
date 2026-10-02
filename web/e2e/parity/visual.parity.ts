import { expect, test } from "@playwright/test";
import { PAGES, WIDTHS, settle, slug } from "./pages";

// The nav link to /messdienstwechsel is new in Svelte; hide it so the rest of
// the nav lines up with the Next baseline.
const HIDE_NEW = `a[href="/messdienstwechsel"] { display: none !important; }`;

for (const path of PAGES)
	for (const width of WIDTHS)
		test(`${path} @ ${width}`, async ({ page }) => {
			await page.setViewportSize({ width, height: 900 });
			await page.goto(path, { waitUntil: "networkidle" });
			await page.addStyleTag({ content: HIDE_NEW });
			await settle(page);
			await expect(page).toHaveScreenshot(`${slug(path)}-${width}.png`, {
				fullPage: true,
				mask: [
					page.locator(
						".swiper, [data-lottie], video, .ticker, [class*='marquee']",
					),
				],
			});
		});
