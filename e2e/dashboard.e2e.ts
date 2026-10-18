import { expect, test, type Locator, type Page } from "@playwright/test";

// The signup test saves a lead, so it needs a database with the `leads` table.
// Webhooks go to the local sink from playwright.config.ts.

const PATH = "/dashboard";
const WEBHOOK_EVENTS = "http://127.0.0.1:4199/events";

const testEmail = (name: string) =>
	`e2e-db-${name}-${Date.now()}-${Math.round(Math.random() * 1e6)}@example.com`;

async function webhookFor(page: Page, email: string) {
	const events: { email: string }[] = await (
		await page.request.get(WEBHOOK_EVENTS)
	).json();
	return events.find((event) => event.email === email);
}

async function hrefs(links: Locator) {
	return (await links.evaluateAll((els) =>
		els.map((el) => el.getAttribute("href")),
	)) as string[];
}

/** Waits for hydration, so the preview and the loops are attached. */
const gotoHydrated = (page: Page) =>
	page.goto(PATH, { waitUntil: "networkidle" });

const preview = (page: Page) => page.locator("section.app");

test("renders with its own layout and SEO tags", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^Heidi Dashboard:/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(
		page.getByRole("heading", {
			level: 1,
			name: "Ihr ganzer Bestand. In einem Dashboard.",
		}),
	).toBeVisible();
	await expect(page.locator("#header")).toHaveCount(0);
	// noindex until the go-live gate (plan §4.4), with a self-canonical
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		"noindex",
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		/\/dashboard$/,
	);
	await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(
		0,
	);
});

test("is not in the sitemap yet", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	expect(sitemap).not.toContain("/dashboard</loc>");
});

test("has no horizontal overflow at 375 px", async ({ page }) => {
	await page.setViewportSize({ width: 375, height: 812 });
	await gotoHydrated(page);
	const overflow = await page.evaluate(
		() => document.documentElement.scrollWidth - window.innerWidth,
	);
	expect(overflow).toBeLessThanOrEqual(0);
});

test("the footer's Dashboard link and internal links resolve", async ({
	page,
	request,
}) => {
	await page.goto(PATH);
	await expect(
		page.locator("footer").getByRole("link", { name: "Dashboard" }),
	).toHaveAttribute("href", PATH);
	const links = new Set([
		...(await hrefs(page.locator('footer a[href^="/"]'))),
		...(await hrefs(page.locator('main a[href^="/"]'))),
	]);
	for (const href of links) {
		const response = await request.get(href);
		expect(response.status(), href).toBe(200);
	}
});

test("/hilfe's answers link here", async ({ page }) => {
	await page.goto("/hilfe");
	expect(
		await hrefs(page.locator("main a", { hasText: "Dashboard ansehen" })),
	).toEqual([PATH, PATH]);
});

test("every CTA leads to the closing card's form", async ({ page }) => {
	await page.goto(PATH);
	await expect(
		page.locator("section.final#start input[name=email]"),
	).toHaveCount(1);
	await expect(
		page.locator("section[aria-labelledby=db-h1]"),
	).not.toHaveAttribute("id", "start");
	const ctas = page.locator("main a", {
		hasText:
			/Demo buchen|Bestand kostenlos prüfen|Anbindung besprechen|Feedback geben/,
	});
	expect(await ctas.count()).toBeGreaterThanOrEqual(5);
	for (const href of await hrefs(ctas)) expect(href).toBe("#start");
	await expect(page.getByText("Lieber direkt eine Demo buchen")).toHaveCount(0);
});

test("the server renders the preview's Overview", async ({ page }) => {
	await page.goto(PATH);
	const app = preview(page);
	await expect(app.locator(".grid > section")).toHaveCount(8);
	await expect(app.locator(".co2 b")).toHaveText("11,3");
	await expect(app.getByText("740 Heizkostenverteiler")).toBeVisible();
	await expect(
		app.getByRole("tab", { name: "Dashboard" }).first(),
	).toHaveAttribute("aria-selected", "true");
});

test("the preview filters, opens its drawer and returns focus", async ({
	page,
}) => {
	await gotoHydrated(page);
	const app = preview(page);
	await app.getByRole("button", { name: /Mein Portfolio/ }).click();
	await app.getByRole("button", { name: /^Gartenweg 3/ }).click();
	await expect(app.locator(".sel-t small").first()).toHaveText(
		"Gartenweg 3 · 12 Wohnungen",
	);
	await expect(app.getByText("24 Heizkostenverteiler")).toBeVisible();
	await app.getByRole("button", { name: "Filter entfernen" }).click();

	const row = app.getByRole("button", { name: /740 Heizkostenverteiler/ });
	await row.click();
	await expect(app.getByRole("dialog")).toContainText("Alle 740 in Ordnung");
	await page.keyboard.press("Escape");
	await expect(app.getByRole("dialog")).toHaveCount(0);
	await expect(row).toBeFocused();

	await app.getByRole("tab", { name: "Zähler" }).first().click();
	await app.getByRole("button", { name: "Wärmemengenzähler" }).click();
	await expect(app.getByText("7 Zähler im Auszug")).toBeVisible();
});

test("the preview's billing run adds a document, nothing is sent", async ({
	page,
}) => {
	await gotoHydrated(page);
	const requests: string[] = [];
	page.on("request", (request) => requests.push(request.url()));
	const app = preview(page);
	await app.getByRole("tab", { name: "Abrechnung" }).first().click();
	await app.getByRole("button", { name: /Abrechnung erstellen/ }).click();
	await expect(app.getByText("24 Einzelabrechnungen erstellt")).toBeVisible();
	await app.getByRole("button", { name: "In Dokumenten ansehen" }).click();
	await expect(app.locator(".doc").first()).toContainText("neu");

	await app.getByRole("button", { name: "Dashboard teilen" }).click();
	await app.getByLabel("E-Mail-Adresse").fill("kollegin@example.com");
	await app.getByRole("button", { name: "Einladen" }).click();
	await expect(app.locator(".sh-l")).toContainText("kollegin@example.com");
	// Only the lazily loaded view modules may be fetched, never data.
	expect(
		requests.filter((url) => !/\.(js|ts|svelte|css)(\?|$)|\/@/.test(url)),
	).toEqual([]);
});

test("the KPI chart picks months by keyboard", async ({ page }) => {
	await gotoHydrated(page);
	const card = page.locator(".kc").nth(1);
	await card.getByRole("group", { name: /Kosten je Monat/ }).focus();
	await page.keyboard.press("ArrowRight");
	await expect(card.locator(".cap")).toHaveText("Gesamtkosten Januar");
	await page.keyboard.press("Escape");
	await expect(card.locator(".cap")).toHaveText("Gesamtkosten 2025");
});

test("the recommendations filter and search", async ({ page }) => {
	await gotoHydrated(page);
	const list = page.locator(".pl");
	await list.locator(".f button", { hasText: "Vertrag kündigen" }).click();
	await expect(list.locator(".r:not([hidden])")).toHaveCount(3);
	await list.getByRole("searchbox").fill("garten");
	await expect(list.locator(".r:not([hidden])")).toHaveCount(1);
});

test.describe("with reduced motion", () => {
	test.use({ reducedMotion: "reduce" });

	test("every block shows its end state and stays", async ({ page }) => {
		await page.clock.install();
		await gotoHydrated(page);
		await expect(page.locator("#strike")).not.toHaveClass(/scene/);
		await expect(page.locator(".lkw")).toHaveClass(/alert/);
		await expect(page.locator(".pl .done")).toContainText(
			"7 Liegenschaften geprüft",
		);
		await page.locator(".sx").scrollIntoViewIfNeeded();
		await page.clock.runFor(4000);
		await expect(page.locator(".sx .c b")).toHaveText("14");
		await expect(page.locator("span.co2")).toHaveText("11,3");
		await expect(page.locator(".mq-sec .pause")).toHaveCount(0);
	});
});

test("the loops run while in view", async ({ page }) => {
	await page.clock.install();
	await gotoHydrated(page);
	await expect(page.locator("#strike")).toHaveClass(/scene/);

	await page.locator(".ins").scrollIntoViewIfNeeded();
	await expect(page.locator(".ins .c.p0 b")).toHaveText("Mieter eingezogen");
	await page.clock.runFor(2700);
	await expect(page.locator(".ins .c.p0 b")).toHaveText(/höherer Verbrauch/);

	await page.locator(".sx").scrollIntoViewIfNeeded();
	await page.clock.runFor(2200);
	await expect(page.locator(".sx .c b")).toHaveText("15");
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
