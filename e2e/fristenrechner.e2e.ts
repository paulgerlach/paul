import { expect, test, type Locator, type Page } from "@playwright/test";

// No form on this page: its "Demo buchen" lead to /demo.

const PATH = "/fristenrechner";
/** The browser's "today" for the calculator tests: 19.10.2026 in Berlin. */
const TODAY = new Date("2026-10-19T10:00:00+02:00");
const NB = "\u00a0";

async function hrefs(links: Locator) {
	return (await links.evaluateAll((els) =>
		els.map((el) => el.getAttribute("href")),
	)) as string[];
}

/** Waits for hydration, so the calculator and the clock run. */
const gotoHydrated = (page: Page) =>
	page.goto(PATH, { waitUntil: "networkidle" });

/** With the browser's date fixed to TODAY (the server renders the real one). */
async function gotoOnDay(page: Page) {
	await page.clock.setFixedTime(TODAY);
	await gotoHydrated(page);
}

const pane = (page: Page, name: string) => page.getByRole("tabpanel", { name });
const big = (p: Locator) => p.locator(".big b");
const badge = (p: Locator) => p.locator(".days");
const row = (p: Locator) => p.locator(".row b");

test("renders with its own layout and SEO tags", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^Fristenrechner Messdienst:/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(
		page.getByRole("heading", {
			level: 1,
			name: "Jede Frist im Messdienst. Auf den Tag genau.",
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
		/\/fristenrechner$/,
	);
	const jsonLd = await page
		.locator('script[type="application/ld+json"]')
		.allTextContents();
	const faq = jsonLd
		.map((t) => JSON.parse(t))
		.find((d) => d["@type"] === "FAQPage");
	expect(faq.mainEntity).toHaveLength(5);
});

test("is not in the sitemap yet", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	expect(sitemap).not.toContain("/fristenrechner</loc>");
});

for (const width of [375, 320]) {
	test(`has no horizontal overflow at ${width} px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 812 });
		await gotoHydrated(page);
		for (const tab of ["Vertrag", "Eichfrist", "Abrechnung"]) {
			await page.getByRole("tab", { name: tab }).click();
			const overflow = await page.evaluate(
				() => document.documentElement.scrollWidth - window.innerWidth,
			);
			expect(overflow, tab).toBeLessThanOrEqual(0);
		}
	});
}

test("the footer's Fristenrechner link and internal links resolve", async ({
	page,
	request,
}) => {
	await page.goto(PATH);
	expect(
		await hrefs(page.locator("footer a", { hasText: /^Fristenrechner$/ })),
	).toEqual([PATH]);
	const links = new Set([
		...(await hrefs(page.locator('footer a[href^="/"]'))),
		...(await hrefs(page.locator('main a[href^="/"]'))),
	]);
	expect(links).toContain("/messdienst-wechseln");
	for (const href of links) {
		const response = await request.get(href);
		expect(response.status(), href).toBe(200);
	}
});

test("the CTAs lead to the calculator, the dates and the booking page", async ({
	page,
}) => {
	await page.goto(PATH);
	await expect(
		page.locator("main a", { hasText: "Frist berechnen" }),
	).toHaveAttribute("href", "#rechner");
	await expect(
		page.locator("main a", { hasText: "Wichtige Stichtage" }),
	).toHaveAttribute("href", "#stichtage");
	await expect(page.locator("#rechner")).toHaveCount(1);
	await expect(page.locator("section#stichtage")).toHaveCount(1);
	await expect(page.locator("section.final a.dcta")).toHaveAttribute(
		"href",
		"/demo",
	);
	await expect(
		page.locator("section[aria-labelledby=fr-h1]"),
	).not.toHaveAttribute("id", "start");
	await expect(page.locator("a.ctab")).toHaveAttribute("href", "/demo");
	// Both CTAs in their design's look: the Portfolio-Checker dark, the
	// Muster-Kündigung light.
	const checker = page.locator("main a", { hasText: "Zum Portfolio-Checker" });
	await expect(checker).toHaveAttribute("href", "/portfolio-check");
	await expect(checker).toHaveClass(/\bbk\b/);
	const template = page.locator("main a", { hasText: "Muster-Kündigung" });
	await expect(template).toHaveAttribute(
		"href",
		"/messdienst-wechseln/muster-kuendigung",
	);
	await expect(template).toHaveClass(/\bghost\b/);
});

test("the contract pane computes the last day to cancel", async ({ page }) => {
	await gotoOnDay(page);
	const p = pane(page, "Vertrag");
	await expect(p).toBeVisible();
	await expect(big(p)).toHaveText("30.09.2027");
	await expect(badge(p)).toHaveText(`noch 346${NB}Tage`);
	await expect(row(p)).toHaveText("31.12.2027");

	await p.getByLabel("Kündigungsfrist").selectOption({ label: "12 Monate" });
	await expect(big(p)).toHaveText("31.12.2026");
	await expect(badge(p)).toHaveText(`noch 73${NB}Tage`);

	// Cancel day already passed: the contract renews by a year.
	await p.getByLabel("Kündigungsfrist").selectOption({ label: "3 Monate" });
	await p.getByLabel("Vertragsbeginn").fill("2016-12-01");
	await expect(big(p)).toHaveText("31.08.2027");
	await expect(row(p)).toHaveText("30.11.2027");

	// Under 60 days: amber.
	await p.getByLabel("Vertragsbeginn").fill("2017-02-01");
	await expect(big(p)).toHaveText("31.10.2026");
	await expect(badge(p)).toHaveText(`noch 12${NB}Tage`);
	await expect(badge(p)).toHaveClass(/warn/);
	await expect(p.locator(".tl .k")).toHaveAttribute("style", /left: \d/);

	await expect(
		p.getByRole("link", { name: /So funktioniert/ }),
	).toHaveAttribute("href", "/messdienst-wechseln");
});

test("the calibration and billing panes", async ({ page }) => {
	await gotoOnDay(page);
	await page.getByRole("tab", { name: "Eichfrist" }).click();
	const e = pane(page, "Eichfrist");
	await expect(e).toBeVisible();
	await expect(pane(page, "Vertrag")).toBeHidden();
	await expect(big(e)).toHaveText("31.12.2028");
	await expect(row(e)).toHaveText("30.09.2028");
	await e.getByLabel("Zählerart").selectOption({ index: 1 });
	await expect(big(e)).toHaveText("31.12.2027");
	await expect(badge(e)).toHaveText(`noch 438${NB}Tage`);
	await e.getByLabel("Zählerart").selectOption({ index: 0 });
	await e.getByLabel("Jahr der Eichung").fill("2020");
	await expect(big(e)).toHaveText("31.12.2026");
	await expect(badge(e)).toHaveClass(/warn/);
	// An empty year keeps the last result.
	await e.getByLabel("Jahr der Eichung").fill("");
	await expect(big(e)).toHaveText("31.12.2026");

	await page.getByRole("tab", { name: "Abrechnung" }).click();
	const a = pane(page, "Abrechnung");
	await expect(big(a)).toHaveText("31.12.2026");
	await expect(badge(a)).toHaveText(`noch 73${NB}Tage`);
	await expect(row(a)).toHaveText("12 Monate nach Erhalt");
	await a.getByLabel("Abrechnung beim Mieter am").fill("2026-03-15");
	await expect(row(a)).toHaveText("15.03.2027");
	await a.getByLabel("Ende des Abrechnungszeitraums").fill("2024-12-31");
	await expect(big(a)).toHaveText("31.12.2025");
	await expect(badge(a)).toHaveText(`seit 292${NB}Tagen vorbei`);
	await expect(badge(a)).toHaveClass(/late/);

	// The values stay when switching back.
	await page.getByRole("tab", { name: "Eichfrist" }).click();
	await expect(big(e)).toHaveText("31.12.2026");
});

test("the tabs work with the keyboard", async ({ page }) => {
	await gotoHydrated(page);
	await page.getByRole("tab", { name: "Vertrag" }).focus();
	await page.keyboard.press("ArrowRight");
	await expect(page.getByRole("tab", { name: "Eichfrist" })).toBeFocused();
	await expect(page.getByRole("tab", { name: "Eichfrist" })).toHaveAttribute(
		"aria-selected",
		"true",
	);
	await expect(pane(page, "Eichfrist")).toBeVisible();
	await page.keyboard.press("End");
	await expect(pane(page, "Abrechnung")).toBeVisible();
	await page.keyboard.press("ArrowRight");
	await expect(pane(page, "Vertrag")).toBeVisible();
	await page.keyboard.press("ArrowLeft");
	await page.keyboard.press("Home");
	await expect(page.getByRole("tab", { name: "Vertrag" })).toBeFocused();
});

test("the milestones' badges count to their day", async ({ page }) => {
	await gotoOnDay(page);
	await expect(page.locator("#stichtage article .sb")).toHaveText([
		"gilt",
		"gilt",
		"gilt",
		`in 73${NB}Tagen`,
	]);
	await expect(page.locator("#stichtage article.hot")).toContainText(
		"31. Dezember 2026",
	);
});

test("hydrates without console errors or warnings", async ({ page }) => {
	const messages: string[] = [];
	page.on("console", (message) => {
		if (["error", "warning"].includes(message.type()))
			messages.push(message.text());
	});
	page.on("pageerror", (error) => messages.push(error.message));
	await gotoOnDay(page);
	await page.getByRole("tab", { name: "Abrechnung" }).click();
	await expect(pane(page, "Abrechnung")).toBeVisible();
	await page.locator("main summary").nth(1).click();
	expect(messages).toEqual([]);
});

test.describe("without JS", () => {
	test.use({ javaScriptEnabled: false });

	test("every pane shows its result, the closing button its target", async ({
		page,
	}) => {
		await page.goto(PATH);
		await expect(page.getByRole("tablist")).toBeHidden();
		for (const name of ["Vertrag", "Eichfrist", "Abrechnung"]) {
			const p = page.locator(
				`#fr-pane-${{ Vertrag: "vertrag", Eichfrist: "eich", Abrechnung: "abr" }[name]}`,
			);
			await expect(p, name).toBeVisible();
			await expect(big(p), name).toHaveText(/^\d\d\.\d\d\.\d{4}$/);
		}
		await expect(page.locator("#stichtage .sb").first()).toHaveText("gilt");
		await expect(page.locator("section.final a.dcta")).toHaveAttribute(
			"href",
			"/demo",
		);
	});
});

test.describe("with reduced motion", () => {
	test.use({ reducedMotion: "reduce" });

	test("nothing waits to be revealed or moves", async ({ page }) => {
		await gotoOnDay(page);
		await expect(page.locator("main .rv-wait")).toHaveCount(0);
		const p = pane(page, "Vertrag");
		await p.getByLabel("Kündigungsfrist").selectOption({ label: "12 Monate" });
		await expect(big(p)).toHaveText("31.12.2026");
		const animation = await big(p).evaluate(
			(el) => getComputedStyle(el).animationName,
		);
		expect(animation).toBe("none");
	});
});
