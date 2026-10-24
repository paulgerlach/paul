import { readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { landingNav } from "../src/lib/landing/navLinks.ts";

// The signup tests save leads, so they need a database with the `leads` table
// (`bunx drizzle-kit push` on a fresh local DB). Webhooks go to the local sink
// from playwright.config.ts. The action's per-IP limit (3 in 10 minutes,
// shared by all landing pages) is raised on the e2e server (KITCHEN_SINK=1).

const PATH = "/messdienst-wechseln";
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

/** Waits until the page is interactive. */
const gotoHydrated = (page: Page) =>
	page.goto(PATH, { waitUntil: "networkidle" });

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

const NAV_ITEMS = landingNav.flatMap((g) => g.columns.flatMap((c) => c.items));

/** The paths of the static pages under a route group, nested ones included. */
function pagePaths(group: string): string[] {
	return readdirSync(group, { recursive: true, encoding: "utf8" })
		.filter((file) => file.endsWith("+page.svelte") && !file.includes("["))
		.map((file) => `/${relative(group, join(group, file, ".."))}`)
		.map((path) => (path === "/" ? path : path.replace(/\/$/, "")));
}

test("the nav links only to landing pages, the blog and the questionnaire", async ({
	page,
	request,
}) => {
	const allowed = [
		...pagePaths("src/routes/(base)/(landing)"),
		"/blog",
		"/fragebogen",
	];

	for (const path of [PATH, "/messdienst/berlin", "/karriere"]) {
		await page.goto(path);
		const internal = (await hrefs(page.locator("nav.top a[href]"))).filter(
			(h) => !h.startsWith("#") && !h.startsWith("https://platform."),
		);
		expect(
			internal.filter((h) => !allowed.includes(h.split("#")[0])),
			path,
		).toEqual([]);
		for (const href of internal) {
			expect((await request.get(href)).status(), href).toBe(200);
		}
	}
	await expect(
		page.locator("nav.top").getByRole("link", { name: "Angebot einholen" }),
	).toHaveAttribute("href", "/fragebogen");
	await expect(
		page.locator("nav.top").getByRole("link", { name: "Anmelden" }),
	).toHaveAttribute("href", "https://platform.heidisystems.com/");
});

// The footer is the landing design's own (not the site's); every internal
// link in it must resolve.
test("the footer's internal links resolve", async ({ page, request }) => {
	await page.goto(PATH);
	const links = new Set(await hrefs(page.locator('footer a[href^="/"]')));
	for (const href of links) {
		const response = await request.get(href);
		expect(response.status(), href).toBe(200);
	}
});

test.describe("footer newsletter", () => {
	test("rejects an invalid address, then thanks and sends the event", async ({
		page,
	}) => {
		await page.goto(PATH);
		const form = page.locator("footer .f-form");
		await form.getByLabel("E-Mail-Adresse").fill("not-an-email");
		await form.getByRole("button", { name: "Los geht’s" }).click();
		await expect(form).toHaveClass(/err/);
		await expect(page.locator("#f-mail-err")).toHaveText(
			"Bitte geben Sie eine gültige E-Mail-Adresse ein.",
		);

		const email = testEmail("newsletter");
		await form.getByLabel("E-Mail-Adresse").fill(email);
		await form.getByRole("button", { name: "Los geht’s" }).click();
		await expect(page.locator("footer .f-ok")).toHaveText(
			"Danke! Wir halten Sie auf dem Laufenden.",
		);
		await expect.poll(() => webhookFor(page, email)).toBeTruthy();
	});

	test.describe("without JS", () => {
		test.use({ javaScriptEnabled: false });

		test("posts the form and returns to the page", async ({ page }) => {
			await page.goto(PATH);
			const email = testEmail("newsletter-nojs");
			const form = page.locator("footer .f-form");
			await form.getByLabel("E-Mail-Adresse").fill(email);
			await form.getByLabel("E-Mail-Adresse").press("Enter");
			await expect(page).toHaveURL(PATH);
			await expect.poll(() => webhookFor(page, email)).toBeTruthy();
		});
	});
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

	test("nav dropdown opens on keyboard focus and click, closes on Escape", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 1440, height: 900 });
		await gotoHydrated(page);
		const group = page.locator(".nv-dd").first();
		const panel = group.locator(".nv-panel");
		await expect(panel).toBeHidden();

		const button = group.getByRole("button", { name: "Produkt" });
		await button.focus();
		await expect(panel).toBeVisible();
		await page.keyboard.press("Escape");
		await expect(panel).toBeHidden();

		await page.mouse.move(0, 600);
		await button.click();
		await expect(button).toHaveAttribute("aria-expanded", "true");
		await expect(panel.getByRole("link", { name: /Vorgehen/ })).toBeVisible();
		await page.mouse.click(700, 700);
		await expect(button).toHaveAttribute("aria-expanded", "false");
	});

	test("nav marks the current page and hides entries without a page", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 1440, height: 900 });
		await page.goto(PATH);
		const current = page.locator(".nv-links a[aria-current=page]");
		await expect(current).toHaveCount(1);
		await expect(current).toHaveAttribute("href", PATH);
		await expect(current).toHaveClass(/cur/);
		// Each entry's title is its own element; an entry without a page has none.
		const titles = await page.locator(".nv-links .nv-t").allTextContents();
		for (const item of NAV_ITEMS.filter((i) => !i.href && !i.soon))
			expect(titles.map((t) => t.trim())).not.toContain(item.title);
		await expect(page.locator(".nv-links .soon")).toHaveCount(
			NAV_ITEMS.filter((i) => i.soon).length,
		);
	});

	test("burger menu opens the nav with accordions", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 812 });
		await gotoHydrated(page);
		const menu = page.locator("#lp-menu");
		await expect(menu).toBeHidden();
		await page.getByRole("button", { name: "Menü öffnen" }).click();
		await expect(menu).toBeVisible();
		await expect(
			page.getByRole("button", { name: "Menü schließen" }),
		).toHaveAttribute("aria-expanded", "true");

		// The group with the current page starts open.
		const loesungen = menu.locator("details", { hasText: "Lösungen" });
		await expect(loesungen).toHaveAttribute("open", "");
		const kunden = menu.locator("summary", { hasText: "Kunden" });
		await kunden.click();
		await expect(
			menu.getByRole("link", { name: /Hausverwaltung/ }),
		).toBeVisible();

		await page.keyboard.press("Escape");
		await expect(menu).toBeHidden();
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
