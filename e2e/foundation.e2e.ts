import { expect, test } from "@playwright/test";
import { expectGated } from "./launch.ts";

test("a page serves an optimized image", async ({ page }) => {
	await page.goto("/");
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
	).toHaveAttribute("href", "/");
});

test("/fragebogen is noindex, not disallowed in robots.txt", async ({
	page,
	request,
}) => {
	const body = await (await request.get("/robots.txt")).text();
	expect(body).not.toContain("/fragebogen");
	expect(body).toContain("Sitemap: https://heidisystems.com/sitemap.xml");
	await page.goto("/fragebogen");
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		"noindex",
	);
});

test("/preise and /blog have their own title", async ({ page }) => {
	for (const path of ["/preise", "/blog"]) {
		await page.goto(path);
		await expect(page).not.toHaveTitle("Heidi Systems");
	}
});

test("every page has a share image", async ({ page }) => {
	await page.goto("/impressum");
	await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
		"content",
		"https://heidisystems.com/og-image.png",
	);
});

test("sitemap.xml lists the site's pages and blog posts", async ({
	request,
}) => {
	const body = await (await request.get("/sitemap.xml")).text();
	for (const path of [
		"/",
		"/messdienst-wechseln",
		"/funktionen",
		"/preise",
		"/blog",
		"/impressum",
		"/datenschutzhinweise",
	])
		expect(body).toContain(`<loc>https://heidisystems.com${path}</loc>`);
	// Blog posts from Prismic (KI-05).
	expect(body).toMatch(/<loc>https:\/\/heidisystems\.com\/blog\/[^<]+<\/loc>/);
	// /geraete is behind its go-live gate, and no entry without a path.
	expectGated(body).toContain("<loc>https://heidisystems.com/geraete</loc>");
	expect(body).not.toContain("<loc>https://heidisystems.com</loc>");
	expect(body).not.toMatch(
		/<loc>https:\/\/heidisystems\.com\/preise<\/loc>\n<lastmod>/,
	);
});
