import { readFile } from "node:fs/promises";
import { readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { landingNav } from "../src/lib/landing/navLinks.ts";

// No signup form on this page: every "Demo buchen" leads to /demo. The
// footer's newsletter sends its webhook to the local sink from
// playwright.config.ts. The landing nav and footer are tested here.

const PATH = "/messdienst-wechseln";
const WEBHOOK_EVENTS = "http://127.0.0.1:4199/events";

/** A fresh address per test, so parallel tests can find their own webhook. */
const testEmail = (name: string) =>
	`e2e-${name}-${Date.now()}-${Math.round(Math.random() * 1e6)}@example.com`;

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
	expect(faq.mainEntity).toHaveLength(5);
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

test.describe("interactions", () => {
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
});

const vollmachtPreview = (page: Page) =>
	page.getByRole("document", { name: "Vorschau der Vollmacht" });

test.describe("planner", () => {
	test("shows the start plan and follows the inputs", async ({ page }) => {
		await page.clock.setFixedTime(new Date("2026-10-27T10:00:00+01:00"));
		await gotoHydrated(page);
		const planner = page.locator("#planer");
		const by = planner.locator(".k").first();
		await expect(by.locator("b")).toHaveText("30.09.2028");
		await expect(by.locator("em")).toHaveText("noch 704 Tage");
		await expect(planner.locator(".k").nth(2).locator("b")).toHaveText(
			"Dezember 2028",
		);

		await planner.getByLabel("Monat").selectOption({ label: "Juni" });
		await planner.getByLabel("Jahr").selectOption("2027");
		await planner.getByRole("radio", { name: "12 Monate" }).click();
		// Due 30.06.2026: missed, so a year later.
		await expect(by.locator("b")).toHaveText("30.06.2027");
		await expect(by.locator("em")).toHaveText(
			"Frist verpasst: Laufzeit verlängert sich meist um 12 Monate",
		);
		await expect(planner.locator(".msg")).toContainText(
			"kündigt Heidi bis 30.06.2027, und zum Vertragsende im Juni 2028 tauschen",
		);
	});

	test("the hero's second button leads to it", async ({ page }) => {
		await page.goto(PATH);
		await expect(
			page.getByRole("link", { name: "Wechsel planen" }),
		).toHaveAttribute("href", "#planer");
		await expect(page.locator("#planer")).toHaveCount(1);
	});
});

test.describe("Vollmacht", () => {
	test("the preview follows the form", async ({ page }) => {
		await gotoHydrated(page);
		const sheet = vollmachtPreview(page);
		await expect(sheet).toContainText(
			"[Name der Verwaltung oder des Eigentümers]",
		);
		await page
			.getByLabel("Hausverwaltung oder Eigentümer")
			.fill("Muster Hausverwaltung GmbH");
		await page.getByLabel("PLZ und Ort").fill("10115 Berlin");
		await page
			.getByLabel("Name des Messdienstleisters")
			.fill("Alt-Messdienst AG");
		await page
			.getByLabel(/^Liegenschaften/)
			.fill("Lindenallee 12, 10115 Berlin\nAhornweg 3, 10117 Berlin");
		await expect(sheet).toContainText("Muster Hausverwaltung GmbH");
		await expect(sheet).toContainText("für die folgenden Liegenschaften");
		await expect(sheet).toContainText("• Ahornweg 3, 10117 Berlin");
		await expect(sheet).toContainText(/Berlin, \d\d\.\d\d\.\d{4}/);

		const power = "Fragen zu Miete, Kauf und Abbau";
		await expect(sheet).toContainText(power);
		await page.getByLabel(/Geräte abstimmen/).uncheck();
		await expect(sheet).not.toContainText(power);
		await expect(sheet).toContainText(
			"Daten zum Stichtag anzufordern und entgegenzunehmen.",
		);
	});

	test("downloads Word and PDF without sending anything", async ({ page }) => {
		await gotoHydrated(page);
		const requests: string[] = [];
		page.on("request", (request) => {
			// The writers load as same-origin modules and images load as the
			// page scrolls; anything else (a send, another host) counts.
			if (request.url().startsWith("blob:")) return;
			const sameOrigin =
				new URL(request.url()).origin === new URL(page.url()).origin;
			if (sameOrigin && request.method() === "GET") return;
			requests.push(`${request.method()} ${request.url()}`);
		});
		await page.getByLabel("Hausverwaltung oder Eigentümer").fill("Muster GmbH");
		const section = page.locator("#vollmacht");
		const status = section.getByRole("status");

		const [docx] = await Promise.all([
			page.waitForEvent("download"),
			section.getByRole("button", { name: "Word herunterladen" }).click(),
		]);
		expect(docx.suggestedFilename()).toBe(
			"Vollmacht-Messdienstwechsel-Muster-GmbH.docx",
		);
		const zip = await readFile((await docx.path())!);
		expect(zip.subarray(0, 2).toString()).toBe("PK");
		expect(zip.toString("utf8")).toContain(
			"Vollmacht zum Wechsel des Messdienstes",
		);
		await expect(status).toHaveText(
			"Download gestartet: Vollmacht-Messdienstwechsel-Muster-GmbH.docx",
		);

		const [pdf] = await Promise.all([
			page.waitForEvent("download"),
			section.getByRole("button", { name: "PDF", exact: true }).click(),
		]);
		const bytes = await readFile((await pdf.path())!);
		expect(bytes.subarray(0, 8).toString()).toBe("%PDF-1.4");
		expect(bytes.toString("latin1")).toContain("/F2 14 Tf");
		expect(requests).toEqual([]);
	});
});

test("the closing card, the rows and the cards lead to their pages", async ({
	page,
}) => {
	await page.goto(PATH);
	await expect(
		page.getByRole("link", { name: "Zum Portfolio-Checker" }),
	).toHaveAttribute("href", "/portfolio-check");
	await expect(
		page.getByRole("link", { name: "Zur Muster-Kündigung" }),
	).toHaveAttribute("href", "/messdienst-wechseln/muster-kuendigung");
	const demo = page
		.locator("#content")
		.getByRole("link", { name: /Demo buchen/ });
	expect(await demo.count()).toBeGreaterThan(4);
	expect(await hrefs(demo)).toEqual(["/demo"]);
	await expect(page.locator("#content form[method]")).toHaveCount(0);
});

test("hydrates without console errors or warnings", async ({ page }) => {
	const messages: string[] = [];
	page.on("console", (message) => {
		if (["error", "warning"].includes(message.type()))
			messages.push(message.text());
	});
	page.on("pageerror", (error) => messages.push(error.message));
	await gotoHydrated(page);
	await page.mouse.wheel(0, 9000);
	await page.waitForTimeout(800);
	expect(messages).toEqual([]);
});

test.describe("without JS", () => {
	test.use({ javaScriptEnabled: false });

	test("the planner shows its start plan, the Vollmacht its template", async ({
		page,
	}) => {
		await page.goto(PATH);
		await expect(page.locator("#planer .in")).toBeHidden();
		await expect(page.locator("#planer .k").first().locator("b")).toHaveText(
			/\d\d\.09\.\d{4}/,
		);
		await expect(vollmachtPreview(page)).toContainText("[Vor- und Nachname]");
		await expect(
			page.getByRole("button", { name: "Word herunterladen" }),
		).toBeHidden();
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
