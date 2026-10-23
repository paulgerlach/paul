import { expect, test, type Locator, type Page } from "@playwright/test";

// No form on this page: its "Demo buchen" lead to /demo.

const PATH = "/sicherheit";

async function hrefs(links: Locator) {
	return (await links.evaluateAll((els) =>
		els.map((el) => el.getAttribute("href")),
	)) as string[];
}

/** Waits for hydration, so the loops are attached. */
const gotoHydrated = (page: Page) =>
	page.goto(PATH, { waitUntil: "networkidle" });

const packets = (page: Page) => page.locator(".map .pk circle");

test("renders with its own layout and SEO tags", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^Sicherheit & Datenschutz:/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(
		page.getByRole("heading", {
			level: 1,
			name: "Ihre Daten bleiben in Deutschland.",
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
		/\/sicherheit$/,
	);
	const jsonLd = page.locator('script[type="application/ld+json"]');
	await expect(jsonLd).toHaveCount(1);
	const faq = JSON.parse((await jsonLd.textContent()) ?? "{}");
	expect(faq["@type"]).toBe("FAQPage");
	expect(faq.mainEntity).toHaveLength(5);
});

test("is not in the sitemap yet", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	expect(sitemap).not.toContain("/sicherheit</loc>");
});

test("has no horizontal overflow at 375 px", async ({ page }) => {
	await page.setViewportSize({ width: 375, height: 812 });
	await gotoHydrated(page);
	const overflow = await page.evaluate(
		() => document.documentElement.scrollWidth - window.innerWidth,
	);
	expect(overflow).toBeLessThanOrEqual(0);
});

test("the footer's Sicherheit link and internal links resolve", async ({
	page,
	request,
}) => {
	await page.goto(PATH);
	expect(
		await hrefs(page.locator("footer a", { hasText: /^Sicherheit$/ })),
	).toEqual([PATH]);
	const links = new Set([
		...(await hrefs(page.locator('footer a[href^="/"]'))),
		...(await hrefs(page.locator('main a[href^="/"]'))),
	]);
	for (const href of links) {
		const response = await request.get(href);
		expect(response.status(), href).toBe(200);
	}
	// The trust block doesn't link to the page it's on.
	await expect(page.getByText("Mehr zu Sicherheit")).toHaveCount(0);
});

test("other pages link here", async ({ page }) => {
	await page.goto("/hilfe");
	await expect(
		page.locator("main a", { hasText: "Sicherheit & Datenschutz" }),
	).toHaveAttribute("href", PATH);
	await page.goto("/messdienst/berlin");
	await expect(
		page.locator("section.trust a", { hasText: "Mehr zu Sicherheit" }),
	).toHaveAttribute("href", PATH);
});

test("every CTA leads to the booking page", async ({ page }) => {
	await page.goto(PATH);
	await expect(page.locator("section.final a.dcta")).toHaveAttribute(
		"href",
		"/demo",
	);
	await expect(
		page.locator("section[aria-labelledby=sc-h1]"),
	).not.toHaveAttribute("id", "start");
	const demo = page.locator("main a", { hasText: "Demo buchen" });
	expect(await demo.count()).toBeGreaterThanOrEqual(2);
	for (const href of await hrefs(demo)) expect(href).toBe("/demo");
	await expect(
		page.locator("main a", { hasText: "Welche Daten wo liegen" }),
	).toHaveAttribute("href", "#daten");
	await expect(page.locator("section#daten")).toHaveCount(1);
});

test.describe("without JS", () => {
	test.use({ javaScriptEnabled: false });

	test("every block is in its end state, the rows open natively", async ({
		page,
	}) => {
		await page.goto(PATH);
		await expect(page.locator(".map .st")).toHaveCount(16);
		await expect(page.locator(".map .cc")).toHaveCount(14);
		await expect(page.locator(".flow .nd.on")).toHaveCount(6);
		await expect(page.locator(".tb")).toHaveClass(/\bin\b/);
		const rows = page.locator(".tb details");
		await expect(rows).toHaveCount(6);
		for (const open of await rows.evaluateAll((els) =>
			els.map((el) => (el as HTMLDetailsElement).open),
		))
			expect(open).toBe(false);
		await rows.nth(2).locator("summary").click();
		await expect(rows.nth(2).locator(".d")).toBeVisible();
		await expect(page.locator("section.final a.dcta")).toHaveAttribute(
			"href",
			"/demo",
		);
	});
});

test("table rows open by click and keyboard, several at once", async ({
	page,
}) => {
	await gotoHydrated(page);
	const rows = page.locator(".tb details");
	await rows.nth(0).locator("summary").click();
	await expect(rows.nth(0).locator(".d")).toBeVisible();
	await rows.nth(1).locator("summary").focus();
	await page.keyboard.press("Enter");
	await expect(rows.nth(1).locator(".d")).toHaveText(
		/Adressen, Einheiten und Zählerzuordnung/,
	);
	await expect(rows.nth(0).locator(".d")).toBeVisible();
	await rows.nth(0).locator("summary").click();
	await expect(rows.nth(0).locator(".d")).toBeHidden();
});

test.describe("with reduced motion", () => {
	test.use({ reducedMotion: "reduce" });

	test("no packet travels and every block stays lit", async ({ page }) => {
		await page.clock.install();
		await gotoHydrated(page);
		await page.clock.runFor(3000);
		await expect(packets(page)).toHaveCount(0);
		await page.locator(".flow").scrollIntoViewIfNeeded();
		await expect(page.locator(".flow .nd.on")).toHaveCount(6);
	});
});

test("packets travel while the map is in view", async ({ page }) => {
	await page.clock.install();
	await gotoHydrated(page);
	const log = page.locator(".map .log span");
	await expect(log).toHaveText("Zählerstand übertragen");
	await page.clock.runFor(2000);
	await expect(packets(page)).not.toHaveCount(0);
	await page.clock.runFor(4500);
	await expect(log).not.toHaveText("Zählerstand übertragen");

	await page.locator("#daten").scrollIntoViewIfNeeded();
	await page.clock.runFor(5000);
	await expect(packets(page)).toHaveCount(0);
});

test("the data path lights up step by step", async ({ page }) => {
	await page.clock.install();
	await gotoHydrated(page);
	await expect(page.locator(".flow .nd.on")).toHaveCount(0);
	await page.locator(".flow").scrollIntoViewIfNeeded();
	await page.clock.runFor(100);
	await expect(page.locator(".flow .nd.on")).toHaveCount(1);
	await page.clock.runFor(3500);
	await expect(page.locator(".flow .nd.on")).toHaveCount(6);
});
