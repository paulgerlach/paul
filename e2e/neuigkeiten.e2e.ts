import { expect, test, type Locator, type Page } from "@playwright/test";

// The signup test saves a lead, so it needs a database with the `leads` table.
// Webhooks go to the local sink from playwright.config.ts.

const PATH = "/neuigkeiten";
const WEBHOOK_EVENTS = "http://127.0.0.1:4199/events";

const testEmail = (name: string) =>
	`e2e-nw-${name}-${Date.now()}-${Math.round(Math.random() * 1e6)}@example.com`;

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

/** Waits for hydration, so the filter works. */
const gotoHydrated = (page: Page) =>
	page.goto(PATH, { waitUntil: "networkidle" });

const news = (page: Page) => page.locator("section[aria-labelledby=nw-news-h]");
const visibleCards = (page: Page) => news(page).locator(".card:visible");

test("renders with its own layout and SEO tags", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^Neuigkeiten von Heidi:/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(
		page.getByRole("heading", { level: 1, name: "Neuigkeiten von Heidi." }),
	).toBeVisible();
	await expect(page.locator("#header")).toHaveCount(0);
	// noindex until the go-live gate (plan §4.4), with a self-canonical
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		"noindex",
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		/\/neuigkeiten$/,
	);
});

test("is not in the sitemap yet", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	expect(sitemap).not.toContain("/neuigkeiten</loc>");
});

for (const width of [375, 320]) {
	test(`has no horizontal overflow at ${width} px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 812 });
		await gotoHydrated(page);
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - window.innerWidth,
		);
		expect(overflow).toBeLessThanOrEqual(0);
	});
}

test("the footer's Neuigkeiten link and internal links resolve", async ({
	page,
	request,
}) => {
	await page.goto(PATH);
	expect(
		await hrefs(page.locator("footer a", { hasText: /^Neuigkeiten$/ })),
	).toEqual([PATH]);
	const links = new Set([
		...(await hrefs(page.locator('footer a[href^="/"]'))),
		...(await hrefs(page.locator('main a[href^="/"]'))),
	]);
	for (const href of links) {
		const response = await request.get(href);
		expect(response.status(), href).toBe(200);
	}
});

test("stories and rows link only where a page exists", async ({ page }) => {
	await page.goto(PATH);
	await expect(page.locator(".feat")).toHaveCount(1);
	await expect(page.locator("a.feat")).toHaveAttribute("href", "/auswertung");
	expect(await hrefs(news(page).locator("a.card"))).toEqual([
		"/dashboard",
		"/installationstool",
		"/funktionen",
		"/funkzaehler",
		"/mieterportal",
		"/api-dokumentation",
		"/portfolio-checker",
		"/nachfolge",
		"/partnerschaften",
	]);
	await expect(news(page).locator(".card")).toHaveCount(9);
	await expect(
		page.locator("main a", { hasText: "Zum Blog mit allen Artikeln" }),
	).toHaveAttribute("href", "/blog");
	expect(
		await hrefs(page.locator("section[aria-labelledby=nw-rg-h] a.row")),
	).toEqual([
		"/upgrade-now",
		"/verbrauchsinformation",
		"/funktionen",
		"/fristenrechner",
	]);
});

test("every CTA leads to the closing card's form", async ({ page }) => {
	await page.goto(PATH);
	await expect(
		page.locator("section.final#start input[name=email]"),
	).toHaveCount(1);
	await expect(
		page.locator("section[aria-labelledby=nw-h1]"),
	).not.toHaveAttribute("id", "start");
	await expect(page.locator("a.ctab")).toHaveAttribute("href", "#start");
});

test("the filter shows the stories of a topic", async ({ page }) => {
	await gotoHydrated(page);
	const filter = page.getByRole("radiogroup", { name: "Thema filtern" });
	await expect(visibleCards(page)).toHaveCount(9);
	for (const [topic, n] of [
		["Produkt", 6],
		["Werkzeuge", 1],
		["Unternehmen", 2],
		["Alle", 9],
	] as const) {
		await filter.getByRole("radio", { name: topic }).click();
		await expect(filter.getByRole("radio", { name: topic })).toHaveAttribute(
			"aria-checked",
			"true",
		);
		await expect(visibleCards(page)).toHaveCount(n);
		await expect(news(page).locator("[aria-live]")).toHaveText(
			n === 1 ? "1\u00a0Meldung" : `${n}\u00a0Meldungen`,
		);
	}
	await expect(visibleCards(page).first()).toContainText("Leckage-Wächter");
});

test("hydrates without console errors or warnings", async ({ page }) => {
	const messages: string[] = [];
	page.on("console", (message) => {
		if (["error", "warning"].includes(message.type()))
			messages.push(message.text());
	});
	page.on("pageerror", (error) => messages.push(error.message));
	await gotoHydrated(page);
	await page.getByRole("radio", { name: "Unternehmen" }).click();
	await expect(visibleCards(page)).toHaveCount(2);
	expect(messages).toEqual([]);
});

test("the filter works with the keyboard", async ({ page }) => {
	await gotoHydrated(page);
	const filter = page.getByRole("radiogroup", { name: "Thema filtern" });
	await filter.getByRole("radio", { name: "Alle" }).focus();
	await page.keyboard.press("ArrowRight");
	await page.keyboard.press("ArrowRight");
	await expect(filter.getByRole("radio", { name: "Werkzeuge" })).toBeFocused();
	await expect(visibleCards(page)).toHaveCount(1);
	await expect(visibleCards(page)).toContainText("Portfolio-Checker");
	await page.keyboard.press("End");
	await expect(visibleCards(page)).toHaveCount(2);
});

test.describe("without JS", () => {
	test.use({ javaScriptEnabled: false });

	test("every story shows and the form posts", async ({ page }) => {
		await page.goto(PATH);
		await expect(visibleCards(page)).toHaveCount(9);
		await expect(page.getByRole("radio", { name: "Alle" })).toHaveAttribute(
			"aria-checked",
			"true",
		);
		await expect(page.locator("section#start form")).toHaveAttribute(
			"method",
			/post/i,
		);
	});
});

test.describe("with reduced motion", () => {
	test.use({ reducedMotion: "reduce" });

	test("nothing waits to be revealed", async ({ page }) => {
		await gotoHydrated(page);
		await expect(page.locator("main .rv-wait")).toHaveCount(0);
		await page.locator(".row").first().hover();
		const transform = await page
			.locator("a.row")
			.first()
			.evaluate((el) => getComputedStyle(el).transform);
		expect(transform).toBe("none");
	});
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
