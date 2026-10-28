import { expect, test } from "@playwright/test";

// These run against the live Prismic repository (read-only).

test("blog list filters by ?tag", async ({ page }) => {
	await page.goto("/blog");
	const cards = page.locator("main .grid > a");
	const all = await cards.count();
	expect(all).toBeGreaterThan(0);

	await page.locator("main a", { hasText: /^Produkt$/ }).click();
	await expect(page).toHaveURL(/\?tag=Produkt$/);
	await expect(page.locator("main a[aria-current=page]")).toHaveText("Produkt");
	await expect(cards).not.toHaveCount(all);

	await page.locator("main a", { hasText: /^Alle$/ }).click();
	await expect(page).toHaveURL(/\/blog$/);
	await expect(cards).toHaveCount(all);
});

test("blog post uses its meta title and resolves document links", async ({
	page,
}) => {
	const response = await page.goto("/blog/weg-hausverwaltung-excel");
	expect(response?.status()).toBe(200);
	await expect(page).not.toHaveTitle("Heidi Systems"); // KI-12
	await expect(page.locator("main#content.relative")).toBeAttached(); // KI-13
	// Rich-text links to other posts (empty href in Next, KI-10).
	await expect(
		page.locator('.richTextBlock a[href="/blog/funkzaehler"]').first(),
	).toBeAttached();
});

test("unknown blog post is a 404", async ({ page }) => {
	const response = await page.goto("/blog/does-not-exist");
	expect(response?.status()).toBe(404);
});

test("preview URLs are private, noindex and load the Prismic toolbar", async ({
	page,
}) => {
	const published = await page.goto("/blog/weg-hausverwaltung-excel");
	expect(published?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(
		page.locator('script[src*="prismic.io/prismic.js"]'),
	).toHaveCount(0);

	const preview = await page.goto("/preview/blog/weg-hausverwaltung-excel");
	expect(preview?.headers()["cache-control"]).toBe("private, no-store");
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		"noindex",
	);
	await expect(
		page.locator('script[src*="prismic.io/prismic.js"]'),
	).toBeAttached();
});

test("slice simulator route exists and is noindex", async ({ page }) => {
	const response = await page.goto("/slice-simulator");
	expect(response?.status()).toBe(200);
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		"noindex",
	);
});
