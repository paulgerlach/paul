import { expect, test, type Locator, type Page } from "@playwright/test";

// The signup test saves a lead, so it needs a database with the `leads` table.
// Webhooks go to the local sink from playwright.config.ts.

const PATH = "/schnittstellen";
const WEBHOOK_EVENTS = "http://127.0.0.1:4199/events";

const testEmail = (name: string) =>
	`e2e-si-${name}-${Date.now()}-${Math.round(Math.random() * 1e6)}@example.com`;

async function webhookFor(page: Page, email: string) {
	const events: { email: string }[] = await (
		await page.request.get(WEBHOOK_EVENTS)
	).json();
	return events.find((event) => event.email === email);
}

async function hrefs(links: Locator) {
	return (await links.evaluateAll((els) =>
		els.map((el) => el.getAttribute("href")),
	)) as string[];
}

/** Waits for hydration, so the loops are attached. */
const gotoHydrated = (page: Page) =>
	page.goto(PATH, { waitUntil: "networkidle" });

const stage = (page: Page) => page.locator("figure.stage");
const statuses = (page: Page) => page.locator("figure.stage .erp-l em");

test("renders with its own layout and SEO tags", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^Schnittstellen zu ERP und CRM:/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(
		page.getByRole("heading", {
			level: 1,
			name: "Eine Plattform pflegen. Nicht zwei.",
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
		/\/schnittstellen$/,
	);
	const jsonLd = page.locator('script[type="application/ld+json"]');
	await expect(jsonLd).toHaveCount(1);
	const faq = JSON.parse((await jsonLd.textContent()) ?? "{}");
	expect(faq["@type"]).toBe("FAQPage");
	expect(faq.mainEntity).toHaveLength(5);
});

test("is not in the sitemap yet", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	expect(sitemap).not.toContain("/schnittstellen</loc>");
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

test("the footer's Schnittstellen link and internal links resolve", async ({
	page,
	request,
}) => {
	await page.goto(PATH);
	expect(
		await hrefs(page.locator("footer a", { hasText: /^Schnittstellen$/ })),
	).toEqual([PATH]);
	const links = new Set([
		...(await hrefs(page.locator('footer a[href^="/"]'))),
		...(await hrefs(page.locator('main a[href^="/"]'))),
	]);
	for (const href of links) {
		const response = await request.get(href);
		expect(response.status(), href).toBe(200);
	}
});

test("/funktionen's Immobilienmanagement card links here", async ({ page }) => {
	await page.goto("/funktionen");
	await expect(
		page.locator("main a", { hasText: "Immobilienmanagement" }),
	).toHaveAttribute("href", PATH);
});

test("every CTA leads to the closing card's form", async ({ page }) => {
	await page.goto(PATH);
	await expect(
		page.locator("section.final#start input[name=email]"),
	).toHaveCount(1);
	await expect(
		page.locator("section[aria-labelledby=si-h1]"),
	).not.toHaveAttribute("id", "start");
	const demo = page.locator("main a", { hasText: "Demo buchen" });
	expect(await demo.count()).toBeGreaterThanOrEqual(2);
	for (const href of await hrefs(demo)) expect(href).toBe("#start");
	await expect(
		page.locator("main a", { hasText: "Doppelpflege berechnen" }),
	).toHaveAttribute("href", "#doppelpflege");
	await expect(page.locator("section#doppelpflege")).toHaveCount(1);
});

test.describe("without JS", () => {
	test.use({ javaScriptEnabled: false });

	test("the stage shows two platforms and the calculator its defaults", async ({
		page,
	}) => {
		await page.goto(PATH);
		await expect(stage(page)).toHaveAttribute("data-mode", "two");
		await expect(statuses(page)).toHaveText([
			"Manuell nachtragen",
			"Manuell nachtragen",
			"Manuell nachtragen",
		]);
		const result = page.locator("#doppelpflege");
		await expect(result.locator(".big span")).toHaveText("53");
		await expect(result.locator(".days")).toContainText("6,7");
		await expect(result.locator(".cost b")).toHaveText("2.400 €");
		await expect(result.locator(".hrs i.on")).toHaveCount(7);
		await expect(page.locator("section#start form")).toHaveAttribute(
			"method",
			/post/i,
		);
	});
});

test("the switch syncs the ERP entries and goes back", async ({ page }) => {
	await page.clock.install();
	await gotoHydrated(page);
	await page.getByRole("radio", { name: "Mit Heidi" }).click();
	await expect(stage(page)).toHaveAttribute("data-mode", "one");
	await expect(page.locator(".steps b")).toHaveText("0");
	await page.clock.runFor(2000);
	await expect(statuses(page)).toHaveText([
		"Synchronisiert",
		"Synchronisiert",
		"Synchronisiert",
	]);
	await page.getByRole("radio", { name: "Zwei Plattformen" }).click();
	await expect(statuses(page)).toHaveText([
		"Manuell nachtragen",
		"Manuell nachtragen",
		"Manuell nachtragen",
	]);
	// The visitor chose: no auto-switch any more.
	await page.clock.runFor(5000);
	await expect(stage(page)).toHaveAttribute("data-mode", "two");
});

test("the stage switches to Heidi by itself once in view", async ({ page }) => {
	await page.clock.install();
	await gotoHydrated(page);
	await expect(stage(page)).toHaveAttribute("data-mode", "two");
	await page.clock.runFor(4000);
	await expect(stage(page)).toHaveAttribute("data-mode", "one");
});

test("the calculator follows its sliders", async ({ page }) => {
	await gotoHydrated(page);
	const calc = page.locator("#doppelpflege");
	for (const [id, value] of [
		["l", "300"],
		["u", "24"],
		["m", "90"],
		["s", "120"],
	])
		await calc.locator(`#r-${id}`).fill(value);
	await expect(calc.locator("output[for=r-m]")).toHaveText("90 Min.");
	await expect(calc.locator(".big span")).toHaveText("10.800");
	await expect(calc.locator(".days")).toContainText("1.350,0");
	await expect(calc.locator(".cost b")).toHaveText("1.296.000 €");
	await expect(calc.locator(".hrs i.on")).toHaveCount(60);
});

test("the data path lights up step by step", async ({ page }) => {
	await page.clock.install();
	await gotoHydrated(page);
	const lit = page.locator(".path .node.lit");
	await expect(lit).toHaveCount(0);
	await page.locator(".path").scrollIntoViewIfNeeded();
	await page.clock.runFor(100);
	await expect(lit).toHaveCount(1);
	await expect(lit).toHaveText(/Funkzähler/);
	await page.clock.runFor(900);
	await expect(lit).toHaveText(/Fernablesung/);
});

test.describe("with reduced motion", () => {
	test.use({ reducedMotion: "reduce" });

	test("nothing switches by itself and every step is lit", async ({ page }) => {
		await page.clock.install();
		await gotoHydrated(page);
		await page.clock.runFor(5000);
		await expect(stage(page)).toHaveAttribute("data-mode", "two");
		await expect(stage(page)).not.toHaveClass(/wire-on/);
		await page.getByRole("radio", { name: "Mit Heidi" }).click();
		await expect(statuses(page)).toHaveText([
			"Synchronisiert",
			"Synchronisiert",
			"Synchronisiert",
		]);
		await page.locator(".path").scrollIntoViewIfNeeded();
		await expect(page.locator(".path .node.lit")).toHaveCount(4);
	});
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
