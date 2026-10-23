import { expect, test, type Locator, type Page } from "@playwright/test";

// No form on this page: its "Demo buchen" lead to /demo.

const PATH = "/plattform/mieterportal";

async function hrefs(links: Locator) {
	return (await links.evaluateAll((els) =>
		els.map((el) => el.getAttribute("href")),
	)) as string[];
}

/** Waits for hydration, so the loops are attached. */
const gotoHydrated = (page: Page) =>
	page.goto(PATH, { waitUntil: "networkidle" });

const pills = (page: Page) => page.locator("figure.mid .st");
const beforeSum = (page: Page) => page.locator(".bill .sum b");

test("renders with its own layout, SEO tags and FAQ data", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^Mieterportal:/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(
		page.getByRole("heading", {
			level: 1,
			name: "Das Heidi Mieterportal für Ihre Mieter",
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
		/\/plattform\/mieterportal$/,
	);

	const jsonLd = await page
		.locator('script[type="application/ld+json"]')
		.textContent();
	const faq = JSON.parse(jsonLd ?? "{}");
	expect(faq["@type"]).toBe("FAQPage");
	expect(faq.mainEntity).toHaveLength(5);
});

test("is not in the sitemap yet", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	expect(sitemap).not.toContain("/plattform/mieterportal</loc>");
});

test("has no horizontal overflow at 375 px", async ({ page }) => {
	await page.setViewportSize({ width: 375, height: 812 });
	await page.goto(PATH);
	const overflow = await page.evaluate(
		() => document.documentElement.scrollWidth - window.innerWidth,
	);
	expect(overflow).toBeLessThanOrEqual(0);
});

test("the footer's Mieterportal link and internal links resolve", async ({
	page,
	request,
}) => {
	await page.goto(PATH);
	await expect(
		page.locator("footer").getByRole("link", { name: "Mieterportal" }),
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

test("CTAs lead to the booking page, the rows and the FAQ", async ({
	page,
}) => {
	await page.goto(PATH);
	await expect(page.locator("section.final a.dcta")).toHaveAttribute(
		"href",
		"/demo",
	);
	await expect(
		page.locator("section[aria-labelledby=mp-h1]"),
	).not.toHaveAttribute("id", "start");
	const demo = page.locator("main a", { hasText: /Demo buchen/i });
	expect(await demo.count()).toBeGreaterThanOrEqual(6);
	for (const href of await hrefs(demo)) expect(href).toBe("/demo");

	await expect(
		page.locator("section[aria-labelledby=mp-h1] a", {
			hasText: /Mehr erfahren/i,
		}),
	).toHaveAttribute("href", "#inhalt");
	await expect(page.locator("#inhalt")).toHaveCount(1);
	for (const href of await hrefs(
		page.locator("#inhalt a", { hasText: /Häufige Fragen/i }),
	))
		expect(href).toBe("#faq");
	// Inside a closed answer, so not in the accessibility tree yet.
	await expect(
		page.locator("#faq a.more", { hasText: "Mehr zur uVI" }),
	).toHaveAttribute("href", "/plattform/verbrauchsinformation");
	await expect(
		page.getByRole("link", { name: "Zum Heizkostenabrechnungs-Checker" }),
	).toHaveAttribute("href", "/heizkostenabrechnung-pruefen");
	await expect(
		page.locator("#faq a.more", { hasText: "Mehr zu Sicherheit" }),
	).toHaveAttribute("href", "/sicherheit");
	await expect(
		page.locator("section.trust a", { hasText: "Mehr zu Sicherheit" }),
	).toHaveAttribute("href", "/sicherheit");
});

test.describe("with reduced motion", () => {
	test.use({ reducedMotion: "reduce" });

	test("every block shows its end state and stays", async ({ page }) => {
		await page.clock.install();
		await gotoHydrated(page);
		await expect(pills(page)).toHaveText([
			"Bereitgestellt",
			"Termin steht",
			"Aktuell",
			"Bereitgestellt",
		]);
		await expect(beforeSum(page)).toHaveText("weniger");
		const figures = page.locator(".bento .fig b");
		await expect(figures.nth(0)).toHaveText("12×");
		await page.locator(".bento").scrollIntoViewIfNeeded();
		await page.clock.runFor(3000);
		await expect(figures.nth(1)).toHaveText("3");
		await expect(figures.nth(2)).toHaveText("14Tage");
		await expect(beforeSum(page)).toHaveText("weniger");
		await expect(pills(page).first()).toHaveText("Bereitgestellt");
		await expect(page.locator(".bw span.on")).toHaveText(
			"Verbrauch jeden Monat",
		);
	});
});

test("the tiles and the rotator loop while in view", async ({ page }) => {
	await page.clock.install();
	await gotoHydrated(page);
	const bill = page.locator(".bill");
	await bill.scrollIntoViewIfNeeded();
	await page.clock.runFor(200);
	await expect(beforeSum(page)).toHaveText("viele");
	await page.clock.runFor(2700);
	await expect(beforeSum(page)).toHaveText("weniger");

	await page.locator(".bw").scrollIntoViewIfNeeded();
	await page.clock.runFor(200);
	await expect(page.locator(".bw span.on")).toHaveText("Verbrauch jeden Monat");
	await page.clock.runFor(2400);
	await expect(page.locator(".bw span.on")).toHaveText("Vergleich zum Vorjahr");
});

test("the hero list replays after its first interval", async ({ page }) => {
	await page.clock.install();
	await gotoHydrated(page);
	await expect(pills(page).first()).toHaveText("Bereitgestellt");
	// The installed clock also runs in real time, so step towards the first
	// replay (9 s).
	await page.clock.runFor(6000);
	await expect
		.poll(async () => {
			await page.clock.runFor(400);
			return pills(page).first().textContent();
		})
		.toBe("Neu");
	await page.clock.runFor(1500);
	await expect(pills(page).first()).toHaveText("Bereitgestellt");
});
