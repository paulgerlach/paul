import { expect, test, type Page } from "@playwright/test";
import { scrollIn } from "./inView";

// No form on this page: its "Demo buchen" lead to /demo.

const PATH = "/funktionen";

/** Waits for hydration, so clicks reach the components. */
const gotoHydrated = (page: Page) =>
	page.goto(PATH, { waitUntil: "networkidle" });

const selectedTab = (page: Page) =>
	page.locator('[role="tab"][aria-selected="true"]');

test("renders indexed with its own layout, SEO tags and FAQ data", async ({
	page,
}) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^Funktionen:/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(page.locator("#header")).toHaveCount(0);
	// Indexed from the start (plan README, Indexing)
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		"index, follow",
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		/\/funktionen$/,
	);

	const jsonLd = await page
		.locator('script[type="application/ld+json"]')
		.textContent();
	const faq = JSON.parse(jsonLd ?? "{}");
	expect(faq["@type"]).toBe("FAQPage");
	expect(faq.mainEntity).toHaveLength(7);
});

test("is in the sitemap", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	expect(sitemap).toContain("/funktionen</loc>");
});

test("the preview prefix no longer serves it", async ({ request }) => {
	expect((await request.get("/preview/funktionen")).status()).toBe(404);
});

test("has no horizontal overflow at 375 px", async ({ page }) => {
	await page.setViewportSize({ width: 375, height: 812 });
	await page.goto(PATH);
	const overflow = await page.evaluate(
		() => document.documentElement.scrollWidth - window.innerWidth,
	);
	expect(overflow).toBeLessThanOrEqual(0);
});

test("every Demo buchen leads to the booking page, the hero has no #start", async ({
	page,
}) => {
	await page.goto(PATH);
	await expect(page.locator("section.final a.dcta")).toHaveAttribute(
		"href",
		"/demo",
	);
	await expect(
		page.locator("section[aria-labelledby=fk-h1]"),
	).not.toHaveAttribute("id", "start");
	const links = page.locator("main a", { hasText: "Demo buchen" });
	expect(await links.count()).toBeGreaterThanOrEqual(1);
	for (const href of await links.evaluateAll((els) =>
		els.map((el) => el.getAttribute("href")),
	))
		expect(href).toBe("/demo");
	await expect(
		page.getByRole("link", { name: "So gehen wir vor" }),
	).toHaveAttribute("href", "/vorgehen");
});

test("the nine function cards link their pages where they exist", async ({
	page,
}) => {
	await page.goto(PATH);
	const grid = page.locator("section[aria-labelledby=fk-features-h]");
	await expect(grid.locator("h3")).toHaveCount(9);
	for (const [name, href] of [
		["Funkablesung", "/geraete"],
		["Dashboard", "/plattform/dashboard"],
		["Auswertung", "/plattform/auswertung"],
		["Verbrauchsinformation", "/plattform/verbrauchsinformation"],
		["Mieterportal", "/plattform/mieterportal"],
		["Schnittstellen", "/plattform/schnittstellen"],
		["DocuScan", "/heizkostenabrechnung"],
		["Heizkostenabrechnung", "/heizkostenabrechnung"],
	])
		await expect(
			grid.locator("a", { has: page.locator("h3", { hasText: name }) }),
		).toHaveAttribute("href", href);
});

test.describe("with reduced motion", () => {
	test.use({ reducedMotion: "reduce" });

	test("the role tabs select by click and keyboard", async ({ page }) => {
		await gotoHydrated(page);
		await expect(selectedTab(page)).toHaveText("Verwaltung");
		await expect(page.locator("#fk-role-panel-0")).not.toHaveAttribute("inert");
		await expect(page.locator("#fk-role-panel-1")).toHaveAttribute("inert");

		await page.getByRole("tab", { name: "Mieter" }).click();
		await expect(selectedTab(page)).toHaveText("Mieter");
		await expect(page.locator("#fk-role-panel-1")).toContainText(
			"Kein Ablesetermin",
		);

		await page.keyboard.press("ArrowRight");
		await expect(selectedTab(page)).toHaveText("Eigentümer");
		await expect(selectedTab(page)).toBeFocused();
		await page.keyboard.press("Home");
		await expect(selectedTab(page)).toHaveText("Verwaltung");
	});

	test("the role tabs don't advance, the DocuScan demo stays done", async ({
		page,
	}) => {
		await page.clock.install();
		await gotoHydrated(page);
		await page.locator("#fk-roles-h").scrollIntoViewIfNeeded();
		await page.clock.runFor(13_000);
		await expect(selectedTab(page)).toHaveText("Verwaltung");
		await page.locator("#fk-docuscan-h").scrollIntoViewIfNeeded();
		await page.clock.runFor(6_000);
		await expect(page.locator(".ds-out")).toContainText("Erdgas, 412.600 kWh");
		await expect(page.locator(".ds-out")).toContainText(
			"In die Abrechnung übernommen",
		);
	});
});

test("the role tabs advance by themselves while in view", async ({ page }) => {
	await page.clock.install();
	await gotoHydrated(page);
	await page.mouse.move(0, 0);
	await scrollIn(page.locator(".fr"), 0.35);
	await page.clock.runFor(6_600);
	await expect(selectedTab(page)).toHaveText("Mieter");
});

test("the DocuScan demo reads the next invoice", async ({ page }) => {
	await page.clock.install();
	await gotoHydrated(page);
	await scrollIn(page.locator(".ds"), 0.35);
	// The first pass replays the first invoice, the second shows the next.
	await page.clock.runFor(5_720 + 3_500);
	await expect(page.locator(".ds-q span")).toHaveText("Rechnung 2 von 4");
	await expect(page.locator(".ds-out")).toContainText(
		"Allgemeinstrom, 8.420 kWh",
	);
});
