import { expect, test, type Locator, type Page } from "@playwright/test";

// The signup tests save leads, so they need a database with the `leads` table
// (`bunx drizzle-kit push` on a fresh local DB). Webhooks go to the local sink
// from playwright.config.ts. Three tests send valid signups, which is exactly
// the action's rate limit per IP (3 in 10 minutes) for one server run.

const PATH = "/messdienstwechsel";
const WEBHOOK_EVENTS = "http://127.0.0.1:4199/events";

/** A fresh address per test, so parallel tests can find their own webhook. */
const testEmail = (name: string) =>
	`e2e-${name}-${Date.now()}-${Math.round(Math.random() * 1e6)}@example.com`;

/**
 * Opens the page with its clock 10 s behind, so the form's render time is old
 * enough for the server's "submitted too fast" check. Time flows normally.
 */
async function gotoBackdated(page: Page) {
	await page.clock.install({ time: Date.now() - 10_000 });
	await page.goto(PATH);
}

async function webhookFor(page: Page, email: string) {
	const events: { email: string }[] = await (
		await page.request.get(WEBHOOK_EVENTS)
	).json();
	return events.find((event) => event.email === email);
}

/** Every link target in `scope`, without duplicates. */
const hrefs = (scope: Locator) =>
	scope.evaluateAll((els) => [
		...new Set(els.map((el) => el.getAttribute("href") ?? "")),
	]);

test("renders with its own layout, SEO tags and FAQ data", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle("Messdienstleister wechseln | Heidi Systems");
	await expect(page.locator("h1")).toHaveCount(1);
	// The site header and footer are not rendered.
	await expect(page.locator("#header")).toHaveCount(0);
	await expect(page.locator("footer")).toHaveCount(1);

	const jsonLd = await page
		.locator('script[type="application/ld+json"]')
		.textContent();
	const faq = JSON.parse(jsonLd ?? "{}");
	expect(faq["@type"]).toBe("FAQPage");
	expect(faq.mainEntity).toHaveLength(8);
});

test("nav and footer link to the same pages as the site's", async ({
	page,
}) => {
	await page.goto("/");
	const site = new Set([
		...(await hrefs(page.locator("#header a[href]"))),
		...(await hrefs(page.locator("footer a[href]"))),
	]);

	await page.goto(PATH);
	const landing = new Set([
		...(await hrefs(page.locator("nav.top a[href]"))),
		...(await hrefs(page.locator("footer a[href]"))),
	]);

	// Landing-only: the logo links home, the CTAs go to the page's own anchors.
	const landingOnly = ["/", "#start", "#faq"];
	// Site-only: the "Angebot einholen" CTA.
	const siteOnly = ["/fragebogen"];

	expect(
		[...landing].filter((h) => !site.has(h) && !landingOnly.includes(h)),
	).toEqual([]);
	expect(
		[...site].filter((h) => !landing.has(h) && !siteOnly.includes(h)),
	).toEqual([]);
});

test.describe("signup", () => {
	test("shows the validation error on the form that was used", async ({
		page,
	}) => {
		await page.goto(PATH);
		const final = page.locator(".signup-box.final");
		// Skip the browser's own type="email" check to reach the form's.
		await final
			.locator("form")
			.evaluate((form: HTMLFormElement) => (form.noValidate = true));
		await final.locator('input[name="email"]').fill("not-an-email@");
		await final.locator("button[type=submit]").click();

		await expect(final.getByRole("alert")).toHaveText(
			"Bitte eine gültige E-Mail-Adresse eingeben",
		);
		await expect(
			page.locator(".signup-box.hero").getByRole("alert"),
		).toHaveCount(0);
	});

	test("answers a filled honeypot with success but stores nothing", async ({
		page,
	}) => {
		await gotoBackdated(page);
		const email = testEmail("honeypot");
		const hero = page.locator(".signup-box.hero");
		// Hidden from people, so skip the visibility check, as a bot would
		await hero.locator('input[name="website"]').fill("spam", { force: true });
		await hero.locator('input[name="email"]').fill(email);
		await hero.locator("button[type=submit]").click();

		await expect(hero.locator(".status")).toContainText("Danke!");
		expect(await webhookFor(page, email)).toBeUndefined();
	});

	for (const placement of ["hero", "final"] as const) {
		test(`${placement} form stores the lead and sends the webhook`, async ({
			page,
		}) => {
			await gotoBackdated(page);
			const email = testEmail(placement);
			const box = page.locator(`.signup-box.${placement}`);
			await box.locator('input[name="email"]').fill(email);
			await box.locator("button[type=submit]").click();

			await expect(box.locator(".status")).toHaveText(
				"Danke! Wir melden uns innerhalb eines Werktags.",
			);
			await expect(box.locator("button[type=submit]")).toHaveText(
				"Wir melden uns",
			);
			await expect(box.locator('input[name="email"]')).toBeDisabled();

			await expect
				.poll(() => webhookFor(page, email))
				.toMatchObject({
					event_type: "switchinquiry",
					placement,
					page: PATH,
				});
		});
	}

	test.describe("without JavaScript", () => {
		test.use({ javaScriptEnabled: false });

		test("posts the form and shows the message", async ({ page }) => {
			await page.goto(PATH);
			const email = testEmail("nojs");
			const hero = page.locator(".signup-box.hero");
			// The render time can't be backdated without JS, so wait out the
			// server's "submitted too fast" check instead.
			await page.waitForTimeout(3_100);
			await hero.locator('input[name="email"]').fill(email);
			await hero.locator("button[type=submit]").click();

			// A full page load with the action's message rendered by the server
			await expect(page.locator(".signup-box.hero .status")).toHaveText(
				"Danke! Wir melden uns innerhalb eines Werktags.",
			);
			expect(await webhookFor(page, email)).toMatchObject({
				event_type: "switchinquiry",
				placement: "hero",
			});
		});
	});
});

test.describe("interactions", () => {
	test("Gantt shows the row's tooltip on keyboard focus", async ({ page }) => {
		await page.goto(PATH);
		const bar = page.getByRole("button", { name: "Installation, Woche 5–7" });
		await bar.focus();
		const tooltip = page.getByRole("tooltip");
		await expect(tooltip).toContainText("Montage durch zertifizierte");
		await expect(bar).toHaveAttribute("aria-describedby", "gtip");

		await page.keyboard.press("Escape");
		await expect(tooltip).toHaveCount(0);
	});

	test("budget tabs switch the series", async ({ page }) => {
		await page.goto(PATH);
		const tabs = page.getByRole("tablist", { name: "Kostenart" });
		const heizung = tabs.getByRole("tab", { name: /Heizung/ });
		const warmwasser = tabs.getByRole("tab", { name: /Warmwasser/ });
		await expect(heizung).toHaveAttribute("aria-selected", "true");
		await expect(heizung).toContainText("bisher 26.250 €");

		await warmwasser.click();
		await expect(warmwasser).toHaveAttribute("aria-selected", "true");
		await expect(
			page.getByRole("group", { name: "Monatliche Kosten Warmwasser" }),
		).toBeVisible();
		await expect(page.locator(".bring b")).toHaveText("73 %");

		await page.keyboard.press("ArrowRight");
		await expect(tabs.getByRole("tab", { name: /Kaltwasser/ })).toHaveAttribute(
			"aria-selected",
			"true",
		);
		await expect(tabs.getByRole("tab", { name: /Kaltwasser/ })).toBeFocused();
	});

	test("risk bar focus changes the tag text", async ({ page }) => {
		await page.goto(PATH);
		const tag = page.locator(".risk .tag");
		await expect(tag).toContainText("28 % der Einheiten in Gartenweg 3");

		await page
			.getByRole("button", { name: "Hofstraße 21: 104 kWh pro m²" })
			.focus();
		await expect(tag).toContainText(
			"Hofstraße 21 liegt 13 % unter dem Schnitt",
		);
	});

	test("nav dropdown opens on keyboard focus and closes on Escape", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 1440, height: 900 });
		await page.goto(PATH);
		const group = page.locator("[data-nav-group]").first();
		const panel = group.locator(".panel");
		await expect(panel).toBeHidden();

		await group.getByRole("link", { name: "Geräte" }).focus();
		await expect(panel).toBeVisible();
		await page.keyboard.press("Escape");
		await expect(panel).toBeHidden();
	});

	test("burger menu opens the nav with accordions", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 812 });
		await page.goto(PATH);
		const burger = page.getByRole("button", { name: "Menü öffnen" });
		await burger.click();

		const menu = page.locator("#lp-menu");
		await expect(menu).toBeVisible();
		await expect(page.locator("html")).toHaveClass(/_lock/);

		const geraete = menu.getByRole("button", { name: "Geräte" });
		await geraete.click();
		await expect(geraete).toHaveAttribute("aria-expanded", "true");
		await expect(
			menu.getByRole("link", { name: "Heizungszähler" }),
		).toBeVisible();

		await page.keyboard.press("Escape");
		await expect(menu).toHaveCount(0);
		await expect(page.locator("html")).not.toHaveClass(/_lock/);
	});

	test("reduced motion shows every old-way tile without animating", async ({
		page,
	}) => {
		await page.emulateMedia({ reducedMotion: "reduce" });
		await page.goto(PATH);
		const oldway = page.locator(".oldway");
		await oldway.scrollIntoViewIfNeeded();
		await expect(oldway).not.toHaveClass(/\banim\b/);
		await expect(oldway.locator(".tile.in")).toHaveCount(12);
	});
});

for (const width of [375, 560, 700, 980]) {
	test(`no horizontal page scroll at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 900 });
		await page.goto(PATH);
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - window.innerWidth,
		);
		expect(overflow).toBeLessThanOrEqual(0);
	});
}
