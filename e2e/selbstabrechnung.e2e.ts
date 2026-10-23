import { expect, test, type Page } from "@playwright/test";

// No form on this page: its "Demo buchen" lead to /demo.

const PATH = "/selbstabrechnung";

/** Waits for hydration, so clicks reach the components. */
const gotoHydrated = (page: Page) =>
	page.goto(PATH, { waitUntil: "networkidle" });

test("renders with its own layout, SEO tags and FAQ data", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^Heizkostenabrechnung selbst erstellen/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(page.locator("#header")).toHaveCount(0);
	// noindex until the go-live gate (plan §4.4), with a self-canonical
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		"noindex",
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		/\/selbstabrechnung$/,
	);

	const jsonLd = await page
		.locator('script[type="application/ld+json"]')
		.textContent();
	const faq = JSON.parse(jsonLd ?? "{}");
	expect(faq["@type"]).toBe("FAQPage");
	expect(faq.mainEntity).toHaveLength(5);
});

test("has no horizontal overflow at 375 px", async ({ page }) => {
	await page.setViewportSize({ width: 375, height: 812 });
	await page.goto(PATH);
	const overflow = await page.evaluate(
		() => document.documentElement.scrollWidth - window.innerWidth,
	);
	expect(overflow).toBeLessThanOrEqual(0);
});

test("is linked from the landing footer and /hilfe", async ({ page }) => {
	await page.goto("/hilfe");
	await expect(
		page.locator(`footer a[href="${PATH}"]`, { hasText: "Selbstabrechnung" }),
	).toHaveCount(1);
	await expect(
		page.locator(`#q-selbst-abrechnen a[href="${PATH}"]`),
	).toHaveCount(1);
});

test("every Demo CTA leads to the booking page, the hero has no #start", async ({
	page,
}) => {
	await page.goto(PATH);
	await expect(page.locator("section.final a.dcta")).toHaveAttribute(
		"href",
		"/demo",
	);
	await expect(
		page.locator("section[aria-labelledby=sa-h1]"),
	).not.toHaveAttribute("id", "start");
	const demos = page.locator("main a", { hasText: "Demo buchen" });
	expect(await demos.count()).toBeGreaterThanOrEqual(3);
	for (const href of await demos.evaluateAll((els) =>
		els.map((el) => el.getAttribute("href")),
	))
		expect(href).toBe("/demo");
	await expect(
		page.locator("nav.top").getByRole("link", { name: "Demo buchen" }),
	).toHaveAttribute("href", "/demo");
});

test("the hero CTA opens the booking page", async ({ page }) => {
	await gotoHydrated(page);
	await page
		.locator("section[aria-labelledby=sa-h1]")
		.getByRole("link", { name: "Demo buchen" })
		.click();
	await expect(page).toHaveURL(/\/demo$/);
});

test.describe("hero demo", () => {
	test("starts at 'Daten kommen' on the server", async ({ browser }) => {
		const context = await browser.newContext({ javaScriptEnabled: false });
		const page = await context.newPage();
		await page.goto(PATH);
		const card = page.getByRole("group", {
			name: "Beispiel: Heizkostenabrechnung auf Knopfdruck",
		});
		await expect(card.getByRole("status").first()).toHaveText("Daten kommen");
		await expect(card.getByRole("button")).toBeDisabled();
		await context.close();
	});

	test.describe("with reduced motion", () => {
		test.use({ reducedMotion: "reduce" });

		test("is ready at once, a click shows the six statements", async ({
			page,
		}) => {
			await gotoHydrated(page);
			const card = page.getByRole("group", {
				name: "Beispiel: Heizkostenabrechnung auf Knopfdruck",
			});
			const button = card.getByRole("button", { name: "Abrechnung erstellen" });
			await expect(button).toBeEnabled();
			await button.click();
			await expect(card.locator(".out li")).toHaveCount(6);
			await expect(
				card.getByText("6 Einzelabrechnungen erstellt"),
			).toBeVisible();
			await expect(card.getByRole("button")).toHaveText("Erneut ansehen");
		});
	});

	test("runs by itself and ends with the statements", async ({ page }) => {
		await gotoHydrated(page);
		const card = page.getByRole("group", {
			name: "Beispiel: Heizkostenabrechnung auf Knopfdruck",
		});
		await expect(card.locator(".n i")).toHaveText("18", { timeout: 6000 });
		await expect(card.getByRole("button")).toHaveText("Erneut ansehen", {
			timeout: 10_000,
		});
		await expect(card.locator(".out li.in")).toHaveCount(6);
	});
});

test("the task toggle moves the billing to Heidi", async ({ page }) => {
	await gotoHydrated(page);
	const section = page.locator("section[aria-labelledby=who-h]");
	const heidi = section.locator(".col.heidi");
	await expect(heidi.locator("small").first()).toHaveText("5 Aufgaben");
	await section.getByRole("radio", { name: "Vollservice" }).click();
	await expect(heidi.locator(".ch small")).toHaveText("6 Aufgaben");
	await expect(section.locator(".col.you .ch small")).toHaveText("3 Aufgaben");
	await expect(heidi).toContainText("Heizkostenabrechnung erstellen");
	await expect(heidi).toContainText("Per Klick, direkt im Dashboard");
	await expect(section.locator(".note")).toHaveText(/^Vollservice:/);
});

test.describe("calculator", () => {
	test.use({ reducedMotion: "reduce" });

	test("renders the defaults on the server", async ({ browser }) => {
		const context = await browser.newContext({ javaScriptEnabled: false });
		const page = await context.newPage();
		await page.goto(PATH);
		const calc = page.locator("#rechner");
		await expect(calc.locator(".split")).toContainText("7.200");
		await expect(calc.locator(".split")).toContainText("16.800");
		await expect(calc.locator(".split")).toContainText("2,40");
		await expect(calc.locator("tfoot .tot")).toHaveText("24.000 €");
		await context.close();
	});

	test("follows both sliders", async ({ page }) => {
		await gotoHydrated(page);
		const calc = page.locator("#rechner");
		await calc.getByRole("slider", { name: /^Verbrauchsanteil/ }).fill("50");
		await expect(calc.locator(".split b").first()).toHaveText("12.000 €");
		await expect(calc.locator(".split b").last()).toHaveText("12.000 €");
		await calc
			.getByRole("slider", { name: /^Heizkosten des Gebäudes/ })
			.fill("80000");
		await expect(calc.locator("tfoot .tot")).toHaveText("80.000 €");
		await expect(
			calc.getByRole("table", { name: "Verteilung je Wohnung" }),
		).toBeVisible();
	});
});

test("a focused statement key highlights its part of the sample", async ({
	page,
}) => {
	await gotoHydrated(page);
	const section = page.locator("#musterabrechnung");
	await section.getByRole("button", { name: /Gesamtbetrag ganz oben/ }).focus();
	await expect(section.locator(".sum")).toHaveClass(/\bhl\b/);
	await expect(
		section.getByRole("button", { name: /Gesamtbetrag ganz oben/ }),
	).toHaveAttribute("aria-pressed", "true");
});
