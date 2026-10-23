import { expect, test, type Locator, type Page } from "@playwright/test";

// No form on this page: its "Demo buchen" lead to /demo.

const PATH = "/kunden/wohnungsunternehmen";

async function hrefs(links: Locator) {
	return (await links.evaluateAll((els) =>
		els.map((el) => el.getAttribute("href")),
	)) as string[];
}

/** Waits for hydration, so the loops are attached. */
const gotoHydrated = (page: Page) =>
	page.goto(PATH, { waitUntil: "networkidle" });

const slider = (page: Page) =>
	page.getByRole("slider", { name: "Anzahl Einheiten" });
const figure = (page: Page) => page.locator(".calc .out b");
const billing = (page: Page) => page.locator("#fr2 em");
const outlier = (page: Page) => page.locator("#fr3 .li.sp");
const rolloutCount = (page: Page) => page.locator("#fr5 .c");

test("renders with its own layout and SEO tags", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^Messdienst für Wohnungsunternehmen:/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(
		page.getByRole("heading", {
			level: 1,
			name: "Große Bestände. Strukturiert umgestellt.",
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
		/\/kunden\/wohnungsunternehmen$/,
	);
	const jsonLd = page.locator('script[type="application/ld+json"]');
	await expect(jsonLd).toHaveCount(1);
	const faq = JSON.parse((await jsonLd.textContent()) ?? "{}");
	expect(faq["@type"]).toBe("FAQPage");
	expect(faq.mainEntity).toHaveLength(4);
});

test("is not in the sitemap yet", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	expect(sitemap).not.toContain("/kunden/wohnungsunternehmen</loc>");
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

test("the footer link, the tabs and the internal links resolve", async ({
	page,
	request,
}) => {
	await page.goto(PATH);
	expect(
		await hrefs(page.locator("footer a", { hasText: /^Wohnungsunternehmen$/ })),
	).toEqual([PATH]);
	const tabs = page.getByRole("navigation", { name: "Zielgruppen" });
	expect(await hrefs(tabs.locator("a"))).toEqual([
		"/kunden/hausverwaltung",
		"/kunden/mietverwaltung",
		"/kunden/weg-verwaltung",
		PATH,
		"/kunden/asset-manager",
	]);
	await expect(tabs.locator('a[aria-current="page"]')).toHaveText(
		"Wohnungsunternehmen",
	);
	const links = new Set([
		...(await hrefs(page.locator('footer a[href^="/"]'))),
		...(await hrefs(page.locator('main a[href^="/"]'))),
	]);
	for (const href of links) {
		const response = await request.get(href);
		expect(response.status(), href).toBe(200);
	}
});

test("every CTA leads to the booking page; pending links are hidden", async ({
	page,
}) => {
	await page.goto(PATH);
	await expect(page.locator("section.final a.dcta")).toHaveAttribute(
		"href",
		"/demo",
	);
	for (const text of ["Demo buchen", "Angebot anfragen"]) {
		const links = page.locator("main a", { hasText: text });
		expect(await links.count(), text).toBeGreaterThanOrEqual(1);
		for (const href of await hrefs(links)) expect(href).toBe("/demo");
	}
	await expect(
		page.locator("main a", { hasText: "Unzufrieden mit Ihrem Messdienst?" }),
	).toHaveAttribute("href", "#wechsel");
	await expect(page.locator("section#wechsel")).toHaveCount(1);
	await expect(
		page.locator("main a", { hasText: "Portfolio kostenlos prüfen" }),
	).toHaveAttribute("href", "/portfolio-check");
	await expect(
		page.locator("main a", { hasText: "Muster-Kündigung herunterladen" }),
	).toHaveAttribute("href", "/messdienst-wechseln/muster-kuendigung");
	await expect(
		page.locator("main a", { hasText: "Messdienstanbieter vergleichen" }),
	).toHaveAttribute("href", "/messdienst-vergleich");
	await expect(
		page.locator("main a", { hasText: "Bisherige Abrechnung prüfen" }),
	).toHaveAttribute("href", "/heizkostenabrechnung-pruefen");
});

test.describe("without JS", () => {
	test.use({ javaScriptEnabled: false });

	test("every block shows its end state", async ({ page }) => {
		await page.goto(PATH);
		await expect(figure(page)).toHaveText("4.800");
		await expect(page.locator(".calc")).toHaveClass(/\bbig\b/);
		await expect(page.locator(".k .n b")).toHaveText("1.000");
		await expect(billing(page)).toHaveText("24 / 24");
		await expect(outlier(page).locator(".v b")).toHaveText("318");
		await expect(outlier(page).locator(".w")).toBeVisible();
		await expect(rolloutCount(page)).toHaveText(
			"2 von 4 Liegenschaften fertig",
		);
		await expect(page.locator(".steps li.on.done")).toHaveCount(4);
		await expect(page.locator("section.final a.dcta")).toHaveAttribute(
			"href",
			"/demo",
		);
	});
});

test("the slider switches the offer and celebrates once", async ({ page }) => {
	await gotoHydrated(page);
	await expect(slider(page)).toHaveAttribute(
		"aria-valuetext",
		"4.800 Einheiten",
	);
	await slider(page).fill("300");
	await expect(figure(page)).toHaveText("160");
	await expect(page.locator(".calc")).not.toHaveClass(/\bbig\b/);
	await slider(page).fill("500");
	await expect(figure(page)).toHaveText("1.000");
	await expect(page.locator(".calc")).toHaveClass(/\bbig\b/);
	await expect(page.locator("body > canvas")).toHaveCount(1);
	await slider(page).fill("1000");
	await expect(figure(page)).toHaveText("20.000+");
	await slider(page).fill("0");
	await expect(figure(page)).toHaveText("10");
	await slider(page).press("End");
	await expect(slider(page)).toHaveAttribute(
		"aria-valuetext",
		"20.000+ Einheiten",
	);
});

test("the problem picker answers, newest first", async ({ page }) => {
	await gotoHydrated(page);
	const group = page.getByRole("group", {
		name: "Probleme mit dem bisherigen Messdienst",
	});
	const answers = page.locator("#wechsel .pr li b");
	await expect(
		page.getByText("Wählen Sie links, was Sie stört."),
	).toBeVisible();
	await group.getByRole("button", { name: "Abrechnung kommt spät" }).click();
	await expect(answers).toHaveText(["Abrechnung per Klick"]);
	await expect(page.getByText("1 Grund für den Wechsel")).toBeVisible();
	await group.getByRole("button", { name: "Niemand ist erreichbar" }).click();
	await expect(answers).toHaveText([
		"Fester Ansprechpartner",
		"Abrechnung per Klick",
	]);
	await group.getByRole("button", { name: "Vertrag läuft noch Jahre" }).click();
	await expect(page.getByText("3 Gründe für den Wechsel")).toBeVisible();
	await expect(page.locator("body > canvas")).toHaveCount(1);
	const first = group.getByRole("button", { name: "Abrechnung kommt spät" });
	await expect(first).toHaveAttribute("aria-pressed", "true");
	await first.click();
	await expect(first).toHaveAttribute("aria-pressed", "false");
	await expect(answers).toHaveCount(2);
	await expect(
		page.locator("#wechsel a", { hasText: "Wechsel besprechen" }),
	).toHaveAttribute("href", "/demo");
});

test("the tiles play when they come into view", async ({ page }) => {
	await page.clock.install();
	await gotoHydrated(page);
	// Below the fold, the Abrechnung waits at 0.
	await expect(billing(page)).toHaveText("0 / 24");
	await page.locator("#fr2").scrollIntoViewIfNeeded();
	await page.clock.runFor(500 + 24 * 90 + 100);
	await expect(billing(page)).toHaveText("24 / 24");

	await page.locator("#fr3").scrollIntoViewIfNeeded();
	await page.clock.runFor(100);
	await expect(page.locator("#fr3 .list")).not.toHaveClass(/\bs2\b/);
	await page.clock.runFor(4700);
	await expect(page.locator("#fr3 .list")).toHaveClass(/\bs5\b/);
	await expect(outlier(page).locator(".v b")).toHaveText("318");

	await page.locator("#fr4").scrollIntoViewIfNeeded();
	await page.clock.runFor(900 + 700);
	await expect(page.locator("#fr4 .t.on")).toHaveText(/Ihr ERP/);
	await page.clock.runFor(2200);
	await expect(page.locator("#fr4 .t.on")).toHaveText(/Ihr CRM/);

	await page.locator("#fr5").scrollIntoViewIfNeeded();
	await page.clock.runFor(1800 + 11_100);
	await expect(rolloutCount(page)).toHaveText("Alle 4 Liegenschaften fertig");
	await page.clock.runFor(4000);
	await expect(rolloutCount(page)).toHaveText("2 von 4 Liegenschaften fertig");
});

test("the steps light up one by one", async ({ page }) => {
	await page.clock.install();
	await gotoHydrated(page);
	const on = page.locator(".steps li.on");
	await expect(on).toHaveCount(0);
	await page.locator(".steps").scrollIntoViewIfNeeded();
	await page.clock.runFor(300);
	await expect(on).toHaveCount(1);
	await page.clock.runFor(3 * 950 + 800);
	await expect(page.locator(".steps li.done")).toHaveCount(4);
});

test.describe("with reduced motion", () => {
	test.use({ reducedMotion: "reduce" });

	test("nothing moves: every block stays in its end state", async ({
		page,
	}) => {
		await page.clock.install();
		await gotoHydrated(page);
		await page.locator("#fr3").scrollIntoViewIfNeeded();
		await page.clock.runFor(5000);
		await expect(billing(page)).toHaveText("24 / 24");
		await expect(page.locator("#fr3 .list")).not.toHaveClass(/\bs3\b/);
		await expect(page.locator("#fr4 .t.on")).toHaveCount(0);
		await expect(page.locator(".steps li.on.done")).toHaveCount(4);
		await slider(page).fill("300");
		await slider(page).fill("600");
		await expect(page.locator("body > canvas")).toHaveCount(0);
	});
});
