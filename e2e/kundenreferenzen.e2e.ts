import { expect, test } from "@playwright/test";
import { expectGated, GATED_ROBOTS } from "./launch";

// /kunden/referenzen: the customer references. No form, nothing is sent.

const PATH = "/kunden/referenzen";

test("renders with its own layout and SEO tags", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle("Kundenreferenzen | Heidi");
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(page.locator("h1")).toHaveText(
		"Was Verwaltungen über Heidi sagen.",
	);
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		GATED_ROBOTS,
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		/\/kunden\/referenzen$/,
	);
});

test("is in the sitemap once launched", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	expectGated(sitemap).toContain("/kunden/referenzen</loc>");
});

test("the footer's and the nav's Kundenreferenzen lead here", async ({
	page,
}) => {
	await page.goto("/");
	await expect(
		page.locator("footer").getByRole("link", { name: "Kunden", exact: true }),
	).toHaveAttribute("href", PATH);
	await expect(
		page
			.getByRole("navigation", { name: "Hauptnavigation" })
			.locator(`a[href="${PATH}"]`)
			.first(),
	).toBeAttached();
});

test("shows the logos, the three cases and the CTAs", async ({ page }) => {
	await page.goto(PATH);
	const main = page.locator("main");
	await expect(main.locator(".wall img")).toHaveCount(12);
	await expect(main.locator("#stimmen article")).toHaveCount(3);
	await expect(
		main.getByRole("link", { name: "Alle Stimmen lesen" }),
	).toHaveAttribute("href", "#stimmen");
	for (const link of await main
		.getByRole("link", { name: /^Demo buchen/ })
		.all())
		await expect(link).toHaveAttribute("href", "/demo");
});

test("the carousel moves with its arrows and dots", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.goto(PATH);
	const carousel = page.getByRole("region", { name: "Kundenstimmen" });
	const count = carousel.locator(".cnt");
	await expect(count).toHaveText("1 / 3");
	await carousel.getByRole("button", { name: "Nächste Stimme" }).click();
	await expect(count).toHaveText("2 / 3");
	await expect(carousel.locator("figure.on")).toContainText("Fabian Höhne");
	await carousel.getByRole("button", { name: "Vorherige Stimme" }).click();
	await carousel.getByRole("button", { name: "Vorherige Stimme" }).click();
	await expect(count).toHaveText("3 / 3");
	await carousel.getByRole("button", { name: "Stimme 1" }).click();
	await expect(count).toHaveText("1 / 3");
	await expect(
		carousel.getByRole("button", { name: "Stimme 1" }),
	).toHaveAttribute("aria-current", "true");
});

test("the carousel moves on by itself with motion", async ({ page }) => {
	await page.clock.install();
	await page.goto(PATH);
	const count = page.locator(".cnt");
	await expect(count).toHaveText("1 / 3");
	await page.mouse.move(0, 0);
	await page.clock.runFor(7100);
	await expect(count).toHaveText("2 / 3");
});

test("the city search filters the tiles", async ({ page }) => {
	await page.goto(PATH);
	const tiles = page.locator("a.city:visible");
	await expect(tiles).toHaveCount(27);
	await expect(page.locator('a.city[href="/messdienst/berlin"]')).toBeVisible();
	await expect(page.locator('a.city[href="/"]')).toHaveText(/Ganz Deutschland/);

	const search = page.getByRole("searchbox", { name: "Stadt suchen" });
	await search.fill("muen");
	await expect(tiles).toHaveText([/München/, /Münster/]);
	await search.fill("Atlantis");
	await expect(tiles).toHaveCount(0);
	await expect(page.locator("main [role=status]")).toContainText(
		"Keine eigene Seite für diese Stadt.",
	);
	await search.fill("");
	await expect(tiles).toHaveCount(27);
});
