import { scrollIn } from "./inView.ts";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { GATED_ROBOTS, expectGated } from "./launch.ts";

// No form on this page: its "Demo buchen" lead to /demo.

const PATH = "/plattform/verbrauchsinformation";

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
	// noindex until LAUNCHED (its go-live gate), with a self-canonical
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		GATED_ROBOTS,
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		/\/plattform\/verbrauchsinformation$/,
	);

	const jsonLd = await page
		.locator('script[type="application/ld+json"]')
		.textContent();
	const faq = JSON.parse(jsonLd ?? "{}");
	expect(faq["@type"]).toBe("FAQPage");
	expect(faq.mainEntity).toHaveLength(6);
});

test("is in the sitemap once launched", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	expectGated(sitemap).toContain(`${PATH}</loc>`);
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

test("CTAs lead to the booking page, the rows, the FAQ and the portal", async ({
	page,
}) => {
	await page.goto(PATH);
	await expect(page.locator("section.final a.dcta")).toHaveAttribute(
		"href",
		"/demo",
	);
	await expect(
		page.locator("section[aria-labelledby=vi-h1]"),
	).not.toHaveAttribute("id", "start");
	const demo = page.locator("main a", { hasText: /Demo buchen/i });
	expect(await demo.count()).toBeGreaterThanOrEqual(5);
	for (const href of await hrefs(demo)) expect(href).toBe("/demo");

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
	).toHaveAttribute("href", "/plattform/mieterportal");
	await expect(
		page.locator("#inhalt p a", { hasText: "Mieterportal" }),
	).toHaveAttribute("href", "/plattform/mieterportal");
	await expect(
		page.locator("#faq .ans a", { hasText: "Mieterportal" }),
	).toHaveAttribute("href", "/plattform/mieterportal");
	await expect(
		page.locator("#faq a.more", { hasText: "Jetzt noch umrüsten" }),
	).toHaveAttribute("href", "/fernablesung-umruesten");
	// The Verwalter card leads to /kunden/hausverwaltung, the Mieter card to the checker.
	await expect(
		page.getByRole("link", { name: "Erfahren Sie mehr" }),
	).toHaveAttribute("href", "/kunden/hausverwaltung");
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
		await expect(page.locator("section.final a.dcta")).toHaveAttribute(
			"href",
			"/demo",
		);
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

	await scrollIn(page.locator(".cal"));
	await page.clock.runFor(400);
	await expect(calendarNote(page)).toHaveText("Januar bereitgestellt");
	await page.clock.runFor(3600);
	await expect(calendarNote(page)).toHaveText("Oktober wird erstellt");

	await scrollIn(page.locator(".bill"));
	await page.clock.runFor(200);
	await expect(billSum(page)).toHaveText(/^1\.202,80\s€$/);
	await page.clock.runFor(2500);
	await expect(page.locator(".bill.good")).toHaveCount(1);
	await page.clock.runFor(1000);
	await expect(billSum(page)).toHaveText(/^1\.240,00\s€$/);

	await scrollIn(page.locator(".bw"));
	await page.clock.runFor(200);
	await expect(page.locator(".bw span.on")).toHaveText("Ihr Verbrauch in kWh");
	await page.clock.runFor(2400);
	await expect(page.locator(".bw span.on")).toHaveText(
		"Vergleich zum Vormonat",
	);

	// Out of view, the bill doesn't start a new pass.
	await scrollIn(page.locator("section.final"));
	await page.clock.runFor(8000);
	await expect(billSum(page)).toHaveText(/^1\.240,00\s€$/);
});
