import { expect, test, type Page } from "@playwright/test";

// The signup test saves a lead, so it needs a database with the `leads` table.
// Webhooks go to the local sink from playwright.config.ts.

const PATH = "/funktionen";
const WEBHOOK_EVENTS = "http://127.0.0.1:4199/events";

const testEmail = (name: string) =>
	`e2e-fk-${name}-${Date.now()}-${Math.round(Math.random() * 1e6)}@example.com`;

async function webhookFor(page: Page, email: string) {
	const events: { email: string }[] = await (
		await page.request.get(WEBHOOK_EVENTS)
	).json();
	return events.find((event) => event.email === email);
}

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
	expect(faq.mainEntity).toHaveLength(8);
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

test("every Demo buchen leads to the closing card's form, the hero has no #start", async ({
	page,
}) => {
	await page.goto(PATH);
	await expect(
		page.locator("section.final#start input[name=email]"),
	).toHaveCount(1);
	await expect(
		page.locator("section[aria-labelledby=fk-h1]"),
	).not.toHaveAttribute("id", "start");
	const links = page.locator("main a", { hasText: "Demo buchen" });
	expect(await links.count()).toBeGreaterThanOrEqual(1);
	for (const href of await links.evaluateAll((els) =>
		els.map((el) => el.getAttribute("href")),
	))
		expect(href).toBe("#start");
	await expect(
		page.getByRole("link", { name: "So gehen wir vor" }),
	).toHaveAttribute("href", "/vorgehen");
});

test.describe("with reduced motion", () => {
	test.use({ reducedMotion: "reduce" });

	test("the chart switches series", async ({ page }) => {
		await gotoHydrated(page);
		const kpi = page.locator(".kpi");
		await expect(kpi.locator("b")).toHaveText("131");
		await expect(kpi.locator("span")).toHaveText("kWh");
		const warm = page.getByRole("radio", { name: "Warmwasser" });
		await warm.click();
		await expect(warm).toHaveAttribute("aria-checked", "true");
		await expect(kpi.locator("b")).toHaveText("2,1");
		await expect(kpi.locator("span")).toHaveText("m³");
	});

	test("the dashboard tabs select by click and keyboard", async ({ page }) => {
		await gotoHydrated(page);
		await expect(selectedTab(page)).toHaveText(/Ihr Verbrauch/);
		await expect(page.locator("#fk-panel-0")).not.toHaveAttribute("inert");
		await expect(page.locator("#fk-panel-1")).toHaveAttribute("inert");

		await page.getByRole("tab", { name: /Datenbasierte Analyse/ }).click();
		await expect(selectedTab(page)).toHaveText(/Datenbasierte Analyse/);
		await expect(page.locator("#fk-panel-1")).toContainText(
			"Auffällig: Strang prüfen",
		);

		await page.keyboard.press("ArrowDown");
		await expect(selectedTab(page)).toHaveText(/Betriebskostenabrechnung/);
		await expect(selectedTab(page)).toBeFocused();
		await page.keyboard.press("Home");
		await expect(selectedTab(page)).toHaveText(/Ihr Verbrauch/);
	});

	test("the dashboard tabs don't advance", async ({ page }) => {
		await page.clock.install();
		await gotoHydrated(page);
		await page.locator("#fk-dashboard-h").scrollIntoViewIfNeeded();
		await page.clock.runFor(13_000);
		await expect(selectedTab(page)).toHaveText(/Ihr Verbrauch/);
	});
});

test("the dashboard tabs advance by themselves while in view", async ({
	page,
}) => {
	await page.clock.install();
	await gotoHydrated(page);
	await page.mouse.move(0, 0);
	await page.locator(".tabs").scrollIntoViewIfNeeded();
	await expect(page.locator(".bar.run")).toBeVisible();
	await page.clock.runFor(6_100);
	await expect(selectedTab(page)).toHaveText(/Datenbasierte Analyse/);
});

test("signup stores the lead and sends the webhook with the page", async ({
	page,
}) => {
	// 10 s behind, so the form's render time passes the timing check
	await page.clock.install({ time: Date.now() - 10_000 });
	await page.goto(PATH);
	const email = testEmail("final");
	const box = page.locator(".signup-box.final");
	await box.locator('input[name="email"]').fill(email);
	await box.locator("button[type=submit]").click();

	await expect(box.locator(".status")).toHaveText(
		"Danke! Wir melden uns innerhalb eines Werktags.",
	);
	await expect
		.poll(() => webhookFor(page, email))
		.toMatchObject({
			event_type: "switchinquiry",
			placement: "final",
			page: PATH,
		});
});
