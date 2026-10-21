import { expect, test, type Page } from "@playwright/test";

// The site cutover: old URLs redirect, and the kept old pages (blog,
// Fragebogen) render inside the landing header and footer. The legal pages
// are landing pages now (legal.e2e.ts).

const WEBHOOK_EVENTS = "http://127.0.0.1:4199/events";

const KEPT_PAGES = ["/blog", "/blog/weg-hausverwaltung-excel", "/fragebogen"];

/** Console errors, warnings (hydration) and page errors from now on. */
function collectProblems(page: Page) {
	const problems: string[] = [];
	page.on("console", (message) => {
		if (["error", "warning"].includes(message.type()))
			problems.push(message.text());
	});
	page.on("pageerror", (error) => problems.push(String(error)));
	return problems;
}

test.describe("redirects", () => {
	for (const [path, status, location] of [
		["/", 307, "/messdienstanbieter"],
		["/preise", 301, "/messdienstwechsel#start"],
		["/preise/", 301, "/messdienstwechsel#start"],
		["/geraete", 301, "/funkzaehler"],
		["/preise/?utm_source=x", 301, "/messdienstwechsel?utm_source=x#start"],
		["/geraete?a=1&b=2", 301, "/funkzaehler?a=1&b=2"],
	] as const)
		test(`${path} → ${location}`, async ({ request }) => {
			const response = await request.get(path, { maxRedirects: 0 });
			expect(response.status()).toBe(status);
			expect(response.headers().location).toBe(location);
			expect(response.headers()["cache-control"]).toBe(
				"s-maxage=3600, stale-while-revalidate=86400",
			);
		});

	test("the home lands on /messdienstanbieter", async ({ page }) => {
		const response = await page.goto("/");
		expect(response?.status()).toBe(200);
		await expect(page).toHaveURL(/\/messdienstanbieter$/);
		await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
			"href",
			"https://heidisystems.com/messdienstanbieter",
		);
	});

	test("the removed pages are gone", async ({ request }) => {
		expect((await request.get("/kitchen-sink")).status()).toBe(404);
		// /kontakt is a page again (2026-10-21), not a redirect.
		expect((await request.get("/kontakt", { maxRedirects: 0 })).status()).toBe(
			200,
		);
		// Only the blog sits under the preview segment now.
		expect((await request.get("/preview/fragebogen")).status()).toBe(404);
	});
});

test.describe("kept pages", () => {
	for (const path of KEPT_PAGES)
		test(`${path} has the landing header and footer`, async ({ page }) => {
			const problems = collectProblems(page);
			const response = await page.goto(path, { waitUntil: "networkidle" });
			expect(response?.status()).toBe(200);
			await expect(page.locator("nav.top")).toHaveCount(1);
			await expect(page.locator("footer")).toHaveCount(1);
			await expect(page.locator("footer .legal-links a")).toHaveText([
				"Impressum",
				"Datenschutz",
				"AGB",
			]);
			// The content sits outside .lp, so it keeps its own styles.
			await expect(page.locator("main")).toHaveCount(1);
			expect(
				await page.locator("main").evaluate((el) => !!el.closest(".lp")),
			).toBe(false);
			expect(problems).toEqual([]);
		});

	test("the content keeps Exo 2, the chrome is Geist", async ({ page }) => {
		await page.goto("/blog");
		expect(
			await page
				.locator("main h1")
				.evaluate((h) => getComputedStyle(h).fontFamily),
		).toContain("Exo 2");
		expect(
			await page
				.locator("nav.top")
				.evaluate((n) => getComputedStyle(n).fontFamily),
		).toContain("Geist");
	});

	test("the nav sticks while scrolling", async ({ page }) => {
		await page.goto("/blog");
		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
		await expect
			.poll(async () => (await page.locator("nav.top").boundingBox())?.y)
			.toBeLessThan(2);
	});

	test("Demo buchen goes to the signup form on /messdienstwechsel", async ({
		page,
	}) => {
		await page.goto("/blog");
		await expect(
			page.locator("nav.top").getByRole("link", { name: "Demo buchen" }),
		).toHaveAttribute("href", "/messdienstwechsel#start");
		await expect(
			page.locator("footer").getByRole("link", { name: "Demo buchen" }),
		).toHaveAttribute("href", "/messdienstwechsel#start");
	});

	test("the mobile menu opens and closes at 375 px", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 812 });
		await page.goto("/blog", { waitUntil: "networkidle" });
		const menu = page.locator("#lp-menu");
		await expect(menu).toBeHidden();
		await page.getByRole("button", { name: "Menü öffnen" }).click();
		await expect(menu).toBeVisible();
		await page.keyboard.press("Escape");
		await expect(menu).toBeHidden();
	});
});

test("the Fragebogen sends an inquiry", async ({ page }) => {
	const problems = collectProblems(page);
	const email = `fragebogen-${Date.now()}@example.com`;
	await page.goto("/fragebogen", { waitUntil: "networkidle" });

	// A picked card moves on after 300 ms, so wait for each next step.
	await page.locator("label", { hasText: "Hausverwaltung" }).click();
	await page.locator("label", { hasText: "1-50 Immobilien" }).click();
	await expect(page.getByText("Anzahl der Wohnungen")).toBeVisible();
	// The three Under50 questions are optional.
	const progress = page.locator(".steps-progress .bg-green");
	for (let i = 0; i < 3; i++) {
		const before = await progress.count();
		await page.getByRole("button", { name: "Überspringen" }).click();
		await expect(progress).toHaveCount(before + 1);
	}

	await page.locator("#first_name").fill("Erika");
	await page.locator("#last_name").fill("Mustermann");
	await page.locator("#phone").fill("030 1234567");
	await page.locator("#email").fill(email);
	await page.locator("#form_confirm").check();
	await page.getByRole("button", { name: "Bestätigen" }).click();

	await expect(page.getByRole("heading", { level: 1 })).toHaveText(
		"Anfrage erfolgreich versendet",
	);
	const events: { email: string; event?: string }[] = await (
		await page.request.get(WEBHOOK_EVENTS)
	).json();
	expect(events.find((e) => e.email === email)).toBeTruthy();
	expect(problems).toEqual([]);
});
