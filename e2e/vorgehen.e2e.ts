import { expect, test, type Page } from "@playwright/test";
import { GATED_ROBOTS } from "./launch.ts";
import { daysUntilObligation } from "../src/lib/landing/deadline/deadline.ts";

// The signup test saves a lead, so it needs a database with the `leads` table.
// Webhooks go to the local sink from playwright.config.ts.

const PATH = "/vorgehen";
const WEBHOOK_EVENTS = "http://127.0.0.1:4199/events";

const testEmail = (name: string) =>
	`e2e-vg-${name}-${Date.now()}-${Math.round(Math.random() * 1e6)}@example.com`;

async function webhookFor(page: Page, email: string) {
	const events: { email: string }[] = await (
		await page.request.get(WEBHOOK_EVENTS)
	).json();
	return events.find((event) => event.email === email);
}

/** Waits for hydration, so clicks reach the components. */
const gotoHydrated = (page: Page) =>
	page.goto(PATH, { waitUntil: "networkidle" });

const selectedTab = (page: Page) =>
	page.locator('[role="tab"][aria-selected="true"]');

test("renders with its own layout, SEO tags and FAQ data", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^So geht Heidi vor/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(page.locator("#header")).toHaveCount(0);
	// noindex until LAUNCHED (its go-live gate), with a self-canonical
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		GATED_ROBOTS,
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		/\/vorgehen$/,
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

test("the landing footer lists Vorgehen and Funktionen first", async ({
	page,
}) => {
	await page.goto("/selbstabrechnung");
	const produkt = page
		.locator("footer h4", { hasText: "Produkt" })
		.locator("xpath=..");
	const first = produkt.locator("li a").nth(0);
	const second = produkt.locator("li a").nth(1);
	await expect(first).toHaveText("Vorgehen");
	await expect(first).toHaveAttribute("href", PATH);
	await expect(second).toHaveText("Funktionen");
	await expect(second).toHaveAttribute("href", "/funktionen");
});

test("the data answer and the trust block link to /sicherheit", async ({
	page,
}) => {
	await page.goto(PATH);
	await expect(
		page.locator("#faq a.more", { hasText: "Mehr zu Sicherheit" }),
	).toHaveAttribute("href", "/sicherheit");
	await expect(
		page.locator("section.trust a", { hasText: "Mehr zu Sicherheit" }),
	).toHaveAttribute("href", "/sicherheit");
});

test("the remote-reading block links to the HKVO-Leitfaden", async ({
	page,
}) => {
	await page.goto(PATH);
	await expect(
		page.getByRole("link", { name: "Zum HKVO-Leitfaden" }),
	).toHaveAttribute("href", "/heizkostenverordnung");
});

test("every CTA leads to the contact card's form, the hero has no #start", async ({
	page,
}) => {
	await page.goto(PATH);
	await expect(
		page.locator("section.final#start input[name=email]"),
	).toHaveCount(1);
	await expect(
		page.locator("section[aria-labelledby=vg-h1]"),
	).not.toHaveAttribute("id", "start");
	for (const [name, target] of [
		["Angebot einholen", "#start"],
		["Demo buchen", "/demo"],
	]) {
		const links = page.locator("main a", { hasText: name });
		expect(await links.count(), name).toBeGreaterThanOrEqual(1);
		for (const href of await links.evaluateAll((els) =>
			els.map((el) => el.getAttribute("href")),
		))
			expect(href, name).toBe(target);
	}
});

test("Angebot einholen focuses the signup email", async ({ page }) => {
	await gotoHydrated(page);
	await page
		.locator("section[aria-labelledby=vg-h1]")
		.getByRole("link", { name: "Angebot einholen" })
		.click();
	await expect(page.locator("#start input[name=email]")).toBeFocused();
});

test("the day count is the days to 1.1.2027", async ({ page }) => {
	await page.goto(PATH);
	const days = daysUntilObligation(Date.now());
	const count = page.locator(".count b");
	if (days > 0) await expect(count).toHaveText(String(days));
	else await expect(count).toHaveCount(0);
});

test("the comparison is a table with readable marks", async ({ page }) => {
	await page.goto(PATH);
	const table = page.getByRole("table", {
		name: "Vergleich: Heidi und klassische Ablesung",
	});
	await expect(table.getByRole("columnheader")).toHaveText([
		"Mit Heidi",
		"Klassisch",
	]);
	await expect(table.getByRole("rowheader")).toHaveCount(7);
	const row = table.getByRole("row", {
		name: /Monatliche Verbrauchsinformation/,
	});
	await expect(row.getByRole("cell")).toHaveText([/^ja$/, /nein$/]);
});

test.describe("step tabs", () => {
	test.use({ reducedMotion: "reduce" });

	test("select by click and keyboard", async ({ page }) => {
		await gotoHydrated(page);
		await expect(selectedTab(page)).toHaveText(/Bedarfsanalyse/);
		await expect(page.locator("#vg-panel-0")).not.toHaveAttribute("inert");
		await expect(page.locator("#vg-panel-1")).toHaveAttribute("inert");

		await page
			.getByRole("tab", { name: /Installation der Funktechnik/ })
			.click();
		await expect(selectedTab(page)).toHaveText(/Installation/);
		await expect(page.locator("#vg-panel-1")).not.toHaveAttribute("inert");
		await expect(page.locator(".pic.on .chip")).toContainText(
			"Montage Di, 10:00 bis 11:30",
		);

		await page.keyboard.press("ArrowDown");
		await expect(selectedTab(page)).toHaveText(/Verbrauchsanalyse/);
		await expect(selectedTab(page)).toBeFocused();
		await page.keyboard.press("Home");
		await expect(selectedTab(page)).toHaveText(/Bedarfsanalyse/);
	});

	test("don't advance with reduced motion", async ({ page }) => {
		await page.clock.install();
		await gotoHydrated(page);
		await page.locator("#vg-steps-h").scrollIntoViewIfNeeded();
		await page.clock.runFor(13_000);
		await expect(selectedTab(page)).toHaveText(/Bedarfsanalyse/);
	});
});

test("the step tabs advance by themselves while in view", async ({ page }) => {
	await page.clock.install();
	await gotoHydrated(page);
	await page.mouse.move(0, 0);
	await page.locator(".tabs").scrollIntoViewIfNeeded();
	await expect(page.locator(".pics .bar")).toBeVisible();
	await page.clock.runFor(6_100);
	await expect(selectedTab(page)).toHaveText(/Installation/);
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
