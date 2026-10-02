import { expect, test } from "@playwright/test";

test("home page renders with SEO tags and an optimized image", async ({
	page,
}) => {
	const response = await page.goto("/");
	expect(response?.status()).toBe(200);
	await expect(page).toHaveTitle("Heidi Systems");
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		"https://heidisystems.com",
	);
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
});

test("robots.txt disallows /fragebogen", async ({ request }) => {
	const body = await (await request.get("/robots.txt")).text();
	expect(body).toContain("Disallow: /fragebogen\n");
	expect(body).toContain("Sitemap: https://heidisystems.com/sitemap.xml");
});

test("sitemap.xml lists the static pages and blog posts", async ({
	request,
}) => {
	const body = await (await request.get("/sitemap.xml")).text();
	expect(body).toContain("<loc>https://heidisystems.com/preise</loc>");
	// Blog posts from Prismic (KI-05).
	expect(body).toMatch(/<loc>https:\/\/heidisystems\.com\/blog\/[^<]+<\/loc>/);
	expect(body.match(/<url>/g)!.length).toBeGreaterThan(8);
});
