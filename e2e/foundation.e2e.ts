import { expect, test } from "@playwright/test";

test("a page serves an optimized image", async ({ page }) => {
	await page.goto("/messdienstanbieter");
	// Image.svelte serves enhanced-img's WebP variant (phase 4).
	await expect(page.locator('img[src$=".webp"]').first()).toBeAttached();
});

test("unknown URL renders the 404 page with noindex", async ({ page }) => {
	const response = await page.goto("/does-not-exist");
	expect(response?.status()).toBe(404);
	await expect(page.getByRole("heading")).toHaveText("Seite nicht gefunden");
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		"noindex",
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
	await expect(
		page.getByRole("link", { name: "Zur Startseite" }),
	).toHaveAttribute("href", "/messdienstanbieter");
});

test("robots.txt disallows /fragebogen", async ({ request }) => {
	const body = await (await request.get("/robots.txt")).text();
	expect(body).toContain("Disallow: /fragebogen\n");
	expect(body).toContain("Sitemap: https://heidisystems.com/sitemap.xml");
});

test("sitemap.xml lists the site's pages and blog posts", async ({
	request,
}) => {
	const body = await (await request.get("/sitemap.xml")).text();
	for (const path of [
		"/messdienstanbieter",
		"/messdienstwechsel",
		"/funktionen",
		"/blog",
		"/impressum",
		"/datenschutzhinweise",
	])
		expect(body).toContain(`<loc>https://heidisystems.com${path}</loc>`);
	// Blog posts from Prismic (KI-05).
	expect(body).toMatch(/<loc>https:\/\/heidisystems\.com\/blog\/[^<]+<\/loc>/);
	// The dropped pages redirect, and / is no page.
	for (const path of ["/preise", "/geraete", "/kontakt", ""])
		expect(body).not.toContain(`<loc>https://heidisystems.com${path}</loc>`);
});
