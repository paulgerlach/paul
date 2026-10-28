import { expect, test, type Page } from "@playwright/test";
import { GATED_ROBOTS } from "./launch.ts";
import { daysUntilObligation } from "../src/lib/landing/deadline/deadline.ts";

const PATH = "/vorgehen";

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

test("the hero and the contact card offer the questionnaire and the demo, no form", async ({
	page,
}) => {
	await page.goto(PATH);
	await expect(page.locator("main form")).toHaveCount(0);
	await expect(page.locator("section[aria-labelledby=vg-h1]")).toHaveAttribute(
		"id",
		"start",
	);
	for (const section of ["section[aria-labelledby=vg-h1]", "section.final"]) {
		const box = page.locator(section);
		await expect(
			box.getByRole("link", { name: "Angebot einholen" }),
		).toHaveAttribute("href", "/fragebogen");
		await expect(
			box.getByRole("link", { name: "Demo buchen" }),
		).toHaveAttribute("href", "/demo");
		await expect(box.locator("a video")).toHaveCount(1);
	}
});

test("the journey lists eleven stations and links the built pages", async ({
	page,
	request,
}) => {
	await page.goto(PATH);
	const journey = page.locator("#ablauf");
	await expect(journey.locator("article")).toHaveCount(11);
	await expect(journey.locator("nav a")).toHaveCount(11);
	await expect(journey.locator('nav a[aria-current="location"]')).toHaveText(
		/Portfolio-Check/,
	);
	// No page for the Vollmacht-Vorlage yet: its link isn't rendered.
	await expect(
		journey.getByRole("link", { name: /Vollmacht-Vorlage/ }),
	).toHaveCount(0);
	const hrefs = await journey
		.locator("article a")
		.evaluateAll((els) => els.map((el) => el.getAttribute("href") ?? ""));
	expect(hrefs).toHaveLength(9);
	for (const href of hrefs) {
		const response = await request.get(href);
		expect(response.status(), href).toBe(200);
	}
});

test("the journey's nav follows the scroll", async ({ page }) => {
	await gotoHydrated(page);
	await page.locator("#ablauf nav a", { hasText: "Fotodokumentation" }).click();
	await expect(
		page.locator('#ablauf nav a[aria-current="location"]'),
	).toHaveText(/Fotodokumentation/);
	await expect(page).toHaveURL(new RegExp(`${PATH}$`));
});

test("Heidi's part counts up to eight tasks in view", async ({ page }) => {
	await gotoHydrated(page);
	const heidi = page.locator(".heidi");
	await expect(heidi.locator("li")).toHaveCount(8);
	// Below the fold it waits at 0 and counts once it scrolls in.
	await expect(heidi.locator(".big")).toHaveText("0 Aufgaben");
	await heidi.scrollIntoViewIfNeeded();
	await expect(heidi.locator(".big")).toHaveText("8 Aufgaben");
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

	test("step 3 shows the dashboard demo in its end state", async ({ page }) => {
		await gotoHydrated(page);
		await page.getByRole("tab", { name: /Verbrauchsanalyse/ }).click();
		const demo = page.locator(".pic.on .vd");
		await expect(demo).toHaveClass(/s-done/);
		await expect(demo.locator(".k b").first()).toHaveText(/^551/);
		await expect(demo.locator(".toast")).toContainText(
			"Heizkostenabrechnung erstellt",
		);
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
	await expect(page.locator(".pics .bar i")).toBeVisible();
	await page.clock.runFor(6_100);
	await expect(selectedTab(page)).toHaveText(/Installation/);
});
