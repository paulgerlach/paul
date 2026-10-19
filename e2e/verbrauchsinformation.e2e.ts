import { expect, test, type Locator, type Page } from "@playwright/test";

// The signup test saves a lead, so it needs a database with the `leads` table.
// Webhooks go to the local sink from playwright.config.ts.

const PATH = "/verbrauchsinformation";
const WEBHOOK_EVENTS = "http://127.0.0.1:4199/events";

const testEmail = (name: string) =>
	`e2e-vi-${name}-${Date.now()}-${Math.round(Math.random() * 1e6)}@example.com`;

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

/** Waits for hydration, so the loops are attached. */
const gotoHydrated = (page: Page) =>
	page.goto(PATH, { waitUntil: "networkidle" });

const billSum = (page: Page) => page.locator(".bill .sum b");
const calendarNote = (page: Page) => page.locator(".tile .note span").last();

test("renders with its own layout, SEO tags and FAQ data", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^uVI:/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(
		page.getByRole("heading", {
			level: 1,
			name: "uVI: Unterjährige Verbrauchsinformation mit Heidi",
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
		/\/verbrauchsinformation$/,
	);

	const jsonLd = await page
		.locator('script[type="application/ld+json"]')
		.textContent();
	const faq = JSON.parse(jsonLd ?? "{}");
	expect(faq["@type"]).toBe("FAQPage");
	expect(faq.mainEntity).toHaveLength(6);
});

test("is not in the sitemap yet", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	expect(sitemap).not.toContain(`${PATH}</loc>`);
});

for (const width of [375, 320])
	test(`has no horizontal overflow at ${width} px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 812 });
		await page.goto(PATH);
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - window.innerWidth,
		);
		expect(overflow).toBeLessThanOrEqual(0);
	});

test("the uVI links lead here and every internal link resolves", async ({
	page,
	request,
}) => {
	await page.goto(PATH);
	await expect(
		page
			.locator("footer")
			.getByRole("link", { name: "Verbrauchsinformation (uVI)" }),
	).toHaveAttribute("href", PATH);
	const links = new Set([
		...(await hrefs(page.locator('footer a[href^="/"]'))),
		...(await hrefs(page.locator('main a[href^="/"]'))),
	]);
	for (const href of links) {
		const response = await request.get(href);
		expect(response.status(), href).toBe(200);
	}

	await page.goto("/hilfe");
	// Inside a closed answer, so not in the accessibility tree yet.
	await expect(
		page.locator("a.more", { hasText: "Mehr zur uVI" }),
	).toHaveAttribute("href", PATH);
});

test("CTAs lead to the closing card's form, the rows, the FAQ and the portal", async ({
	page,
}) => {
	await page.goto(PATH);
	await expect(
		page.locator("section.final#start input[name=email]"),
	).toHaveCount(1);
	await expect(
		page.locator("section[aria-labelledby=vi-h1]"),
	).not.toHaveAttribute("id", "start");
	const demo = page.locator("main a", { hasText: /Demo buchen/i });
	expect(await demo.count()).toBeGreaterThanOrEqual(5);
	for (const href of await hrefs(demo)) expect(href).toBe("#start");

	await expect(
		page.locator("section[aria-labelledby=vi-h1] a", {
			hasText: /Mehr erfahren/i,
		}),
	).toHaveAttribute("href", "#inhalt");
	await expect(page.locator("#inhalt")).toHaveCount(1);
	const faqLinks = page.locator("#inhalt a", { hasText: /Häufige Fragen/i });
	await expect(faqLinks).toHaveCount(3);
	for (const href of await hrefs(faqLinks)) expect(href).toBe("#faq");
	await expect(page.locator("#faq")).toHaveCount(1);

	await expect(
		page.locator("#inhalt a", { hasText: /Zum Mieterportal/i }),
	).toHaveAttribute("href", "/mieterportal");
	await expect(
		page.locator("#inhalt p a", { hasText: "Mieterportal" }),
	).toHaveAttribute("href", "/mieterportal");
	await expect(
		page.locator("#faq .ans a", { hasText: "Mieterportal" }),
	).toHaveAttribute("href", "/mieterportal");
	await expect(
		page.locator("#faq a.more", { hasText: "Jetzt noch umrüsten" }),
	).toHaveAttribute("href", "/upgrade-now");
	// The Verwalter card leads to /hausverwaltung, the Mieter card to the checker.
	await expect(
		page.getByRole("link", { name: "Erfahren Sie mehr" }),
	).toHaveAttribute("href", "/hausverwaltung");
	await expect(
		page.getByRole("link", { name: "Zur Heizkosten-Prüfung" }),
	).toHaveAttribute("href", "/heizkostenabrechnung-pruefen");
});

test.describe("without JavaScript", () => {
	test.use({ javaScriptEnabled: false });

	test("every block is in its end state", async ({ page }) => {
		await page.goto(PATH);
		const mock = page.locator("figure.mid");
		await expect(mock.locator(".kpis > div")).toHaveCount(4);
		await expect(mock.locator(".bars i")).toHaveCount(12);
		await expect(calendarNote(page)).toHaveText("Oktober wird erstellt");
		await expect(page.locator(".doc .dr.on")).toHaveCount(4);
		await expect(page.locator(".doc.ok")).toHaveCount(1);
		await expect(page.locator(".bill.good")).toHaveCount(1);
		await expect(billSum(page)).toHaveText(/^1\.240,00\s€$/);
		await expect(page.locator(".bento .fig b").last()).toHaveText("0");
		await expect(page.locator("section.final form")).toHaveCount(1);
	});
});

test.describe("with reduced motion", () => {
	test.use({ reducedMotion: "reduce" });

	test("every block shows its end state and stays", async ({ page }) => {
		await page.clock.install();
		await gotoHydrated(page);
		await page.locator(".bill").scrollIntoViewIfNeeded();
		await page.clock.runFor(8000);
		await expect(billSum(page)).toHaveText(/^1\.240,00\s€$/);
		await expect(calendarNote(page)).toHaveText("Oktober wird erstellt");
		await page.locator(".bw").scrollIntoViewIfNeeded();
		await page.clock.runFor(5000);
		await expect(page.locator(".bw span.on")).toHaveText(
			"Ihr Verbrauch in kWh",
		);
	});
});

test("the hero mock stays as rendered when it's on screen at load", async ({
	page,
}) => {
	await page.clock.install();
	await gotoHydrated(page);
	await page.clock.runFor(2000);
	const mock = page.locator("figure.mid");
	await expect(mock.locator(".kpis.go")).toHaveCount(1);
	await expect(mock.locator(".bars i").last()).toHaveAttribute(
		"style",
		"height: 69%;",
	);
});

test("the tiles and the rotator loop while in view", async ({ page }) => {
	await page.clock.install();
	await gotoHydrated(page);

	await page.locator(".cal").scrollIntoViewIfNeeded();
	await page.clock.runFor(400);
	await expect(calendarNote(page)).toHaveText("Januar bereitgestellt");
	await page.clock.runFor(3600);
	await expect(calendarNote(page)).toHaveText("Oktober wird erstellt");

	await page.locator(".bill").scrollIntoViewIfNeeded();
	await page.clock.runFor(200);
	await expect(billSum(page)).toHaveText(/^1\.202,80\s€$/);
	await page.clock.runFor(2500);
	await expect(page.locator(".bill.good")).toHaveCount(1);
	await page.clock.runFor(1000);
	await expect(billSum(page)).toHaveText(/^1\.240,00\s€$/);

	await page.locator(".bw").scrollIntoViewIfNeeded();
	await page.clock.runFor(200);
	await expect(page.locator(".bw span.on")).toHaveText("Ihr Verbrauch in kWh");
	await page.clock.runFor(2400);
	await expect(page.locator(".bw span.on")).toHaveText(
		"Vergleich zum Vormonat",
	);

	// Out of view, the bill doesn't start a new pass.
	await page.locator("section.final").scrollIntoViewIfNeeded();
	await page.clock.runFor(8000);
	await expect(billSum(page)).toHaveText(/^1\.240,00\s€$/);
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
