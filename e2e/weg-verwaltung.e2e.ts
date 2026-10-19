import { expect, test, type Locator, type Page } from "@playwright/test";

// The signup test saves a lead, so it needs a database with the `leads` table.
// Webhooks go to the local sink from playwright.config.ts.

const PATH = "/weg-verwaltung";
const WEBHOOK_EVENTS = "http://127.0.0.1:4199/events";

const testEmail = (name: string) =>
	`e2e-wv-${name}-${Date.now()}-${Math.round(Math.random() * 1e6)}@example.com`;

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

const pills = (page: Page) => page.locator("figure.mid .st");
const billSum = (page: Page) => page.locator(".bill .sum b");
const gridNote = (page: Page) => page.locator(".tile .note span").last();
const gridCells = (page: Page) => page.locator(".cal li");

test("renders with its own layout, SEO tags and FAQ data", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^Heizkostenabrechnung für WEG-Verwaltungen/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(
		page.getByRole("heading", {
			level: 1,
			name: "Heizkostenabrechnung für WEG-Verwaltungen mit Heidi",
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
		/\/weg-verwaltung$/,
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
	// The host followed by the path, exactly.
	expect(sitemap).not.toMatch(/<loc>https?:\/\/[^/]+\/weg-verwaltung<\/loc>/);
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

test("the footer leads here and every internal link resolves", async ({
	page,
	request,
}) => {
	await page.goto(PATH);
	await expect(
		page.locator("footer").getByRole("link", { name: "WEG-Verwaltung" }),
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

test("CTAs lead to the closing card's form, the rows, the FAQ and the linked pages", async ({
	page,
}) => {
	await page.goto(PATH);
	await expect(
		page.locator("section.final#start input[name=email]"),
	).toHaveCount(1);
	await expect(
		page.locator("section[aria-labelledby=wv-h1]"),
	).not.toHaveAttribute("id", "start");
	const demo = page.locator("main a", { hasText: /Demo buchen/i });
	expect(await demo.count()).toBeGreaterThanOrEqual(5);
	for (const href of await hrefs(demo)) expect(href).toBe("#start");

	await expect(
		page.locator("section[aria-labelledby=wv-h1] a", {
			hasText: /Mehr erfahren/i,
		}),
	).toHaveAttribute("href", "#inhalt");
	await expect(page.locator("#inhalt")).toHaveCount(1);
	const faqLinks = page.locator("#inhalt a", { hasText: /Häufige Fragen/i });
	await expect(faqLinks).toHaveCount(4);
	for (const href of await hrefs(faqLinks)) expect(href).toBe("#faq");
	await expect(page.locator("#faq")).toHaveCount(1);

	// Inside closed answers, so not in the accessibility tree yet.
	await expect(
		page.locator("#faq a.more", { hasText: "Mehr zur uVI" }),
	).toHaveAttribute("href", "/verbrauchsinformation");
	// No Fristenrechner or Muster-Kündigung yet (plan README, open question 2).
	await expect(page.getByText("Zum Fristenrechner")).toHaveCount(0);
	await expect(page.getByText("Zur Muster-Kündigung")).toHaveCount(0);
	// Answers 1 and 5 name the Fristenrechner as plain text.
	await expect(page.locator("#faq .ans a:not(.more)")).toHaveCount(0);
});

test.describe("without JavaScript", () => {
	test.use({ javaScriptEnabled: false });

	test("every block is in its end state", async ({ page }) => {
		await page.goto(PATH);
		await expect(pills(page)).toHaveText(Array(4).fill("Vor ETV fertig"));
		await expect(gridNote(page)).toHaveText("Dez: Heidi übernimmt");
		await expect(gridCells(page)).toHaveCount(12);
		await expect(page.locator(".cal li.done")).toHaveCount(11);
		await expect(page.locator(".cal li.done.milestone")).toHaveText([
			/Mai\s*ETV/,
			/Sep\s*Kündigung/,
		]);
		await expect(page.locator(".cal li.now.milestone")).toHaveText(
			/Dez\s*Vertragsende/,
		);
		// Placeholders carry no label.
		await expect(page.locator(".cal li.blank em")).toHaveText(
			Array(9).fill(""),
		);
		await expect(page.locator(".doc .dr.on")).toHaveCount(4);
		await expect(page.locator(".doc .dr.chk.on")).toHaveCount(2);
		await expect(page.locator(".doc.ok")).toHaveCount(1);
		await expect(page.locator(".phone .mini i")).toHaveCount(10);
		await expect(page.locator(".phone .ev")).toHaveCount(0);
		await expect(page.locator(".bill.good")).toHaveCount(1);
		await expect(billSum(page)).toHaveText("eine Unterschrift");
		await expect(page.locator("section.final form")).toHaveCount(1);
	});
});

test.describe("with reduced motion", () => {
	test.use({ reducedMotion: "reduce" });

	test("every block shows its end state and stays", async ({ page }) => {
		await page.clock.install();
		await gotoHydrated(page);
		await page.clock.runFor(10_000);
		await expect(pills(page).first()).toHaveText("Vor ETV fertig");
		await page.locator(".bill").scrollIntoViewIfNeeded();
		await page.clock.runFor(8000);
		await expect(billSum(page)).toHaveText("eine Unterschrift");
		await expect(gridNote(page)).toHaveText("Dez: Heidi übernimmt");
		await expect(page.locator(".cal li.done")).toHaveCount(11);
		await page.locator(".bw").scrollIntoViewIfNeeded();
		await page.clock.runFor(5000);
		await expect(page.locator(".bw span.on")).toHaveText(
			"Kündigung per Vollmacht",
		);
	});
});

test("the hero list replays after its first interval", async ({ page }) => {
	await page.clock.install();
	await gotoHydrated(page);
	await expect(pills(page).first()).toHaveText("Vor ETV fertig");
	await page.clock.runFor(9100);
	await expect(pills(page).first()).toHaveText("Abrechnung offen");
	await page.clock.runFor(1500);
	await expect(pills(page).first()).toHaveText("Vor ETV fertig");
});

test("the tiles and the rotator loop while in view", async ({ page }) => {
	await page.clock.install();
	await gotoHydrated(page);

	await page.locator(".cal").scrollIntoViewIfNeeded();
	await page.clock.runFor(400);
	// January is done; a placeholder leaves the last pass's note.
	await expect(page.locator(".cal li.done")).toHaveCount(1);
	await expect(gridNote(page)).toHaveText("Dez: Heidi übernimmt");
	await page.clock.runFor(1600);
	await expect(gridNote(page)).toHaveText("Mai: ETV beschließt den Wechsel");
	await expect(page.locator(".cal li.done.milestone")).toHaveCount(1);
	await page.clock.runFor(1600);
	await expect(gridNote(page)).toHaveText("Sep: Heidi kündigt per Vollmacht");
	await page.clock.runFor(1200);
	await expect(gridNote(page)).toHaveText("Dez: Heidi übernimmt");
	await expect(page.locator(".cal li.now")).toHaveText(/Vertragsende/);

	await page.locator(".bill").scrollIntoViewIfNeeded();
	await page.clock.runFor(200);
	await expect(billSum(page)).toHaveText("hoch");
	await page.clock.runFor(2600);
	await expect(page.locator(".bill.good")).toHaveCount(1);
	await expect(billSum(page)).toHaveText("eine Unterschrift");

	await page.locator(".bw").scrollIntoViewIfNeeded();
	await page.clock.runFor(200);
	await expect(page.locator(".bw span.on")).toHaveText(
		"Kündigung per Vollmacht",
	);
	await page.clock.runFor(2400);
	await expect(page.locator(".bw span.on")).toHaveText("Montage und Ablesung");

	// Out of view, the bill doesn't start a new pass.
	await page.locator("section.final").scrollIntoViewIfNeeded();
	await page.clock.runFor(8000);
	await expect(billSum(page)).toHaveText("eine Unterschrift");
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
