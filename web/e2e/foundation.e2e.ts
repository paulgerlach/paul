import { expect, test } from "@playwright/test";

test("home page renders with SEO tags and an enhanced image", async ({
	page,
}) => {
	const response = await page.goto("/");
	expect(response?.status()).toBe(200);
	await expect(page).toHaveTitle("Heidi Systems");
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		"https://heidisystems.com",
	);
	await expect(
		page.locator('picture source[type="image/avif"]').first(),
	).toBeAttached();
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

test("sitemap.xml lists the static pages", async ({ request }) => {
	const body = await (await request.get("/sitemap.xml")).text();
	expect(body.match(/<url>/g)).toHaveLength(8);
});
