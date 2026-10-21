import { expect, test, type Locator, type Page } from "@playwright/test";

// The signup test saves a lead, so it needs a database with the `leads` table.
// Webhooks go to the local sink from playwright.config.ts.

const PATH = "/funkzaehler";
const WEBHOOK_EVENTS = "http://127.0.0.1:4199/events";

const testEmail = (name: string) =>
	`e2e-fz-${name}-${Date.now()}-${Math.round(Math.random() * 1e6)}@example.com`;

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

/** Waits for hydration, so the loops and the tabs are attached. */
const gotoHydrated = (page: Page) =>
	page.goto(PATH, { waitUntil: "networkidle" });

const gallery = (page: Page) => page.locator("#geraete");
const tabs = (page: Page) => gallery(page).getByRole("tab");
const selected = (page: Page) =>
	gallery(page).locator("[role=tab][aria-selected=true]");
const shownPanel = (page: Page) => gallery(page).locator(".gd-p.on");

test("renders with its own layout, SEO tags and FAQ data", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^Funkzähler/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(
		page.getByRole("heading", {
			level: 1,
			name: "Funkzähler von Heidi: Heizkostenverteiler, Wasserzähler und Rauchwarnmelder",
		}),
	).toBeVisible();
	// noindex until the go-live gate (§2), with a self-canonical
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		"noindex",
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		/\/funkzaehler$/,
	);

	const jsonLd = await page
		.locator('script[type="application/ld+json"]')
		.textContent();
	const faq = JSON.parse(jsonLd ?? "{}");
	expect(faq["@type"]).toBe("FAQPage");
	expect(faq.mainEntity).toHaveLength(6);
});

test("is not in the sitemap yet", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	expect(sitemap).not.toMatch(/<loc>https?:\/\/[^/]+\/funkzaehler<\/loc>/);
});

for (const width of [375, 320])
	test(`has no horizontal overflow at ${width} px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 812 });
		await page.goto(PATH);
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - window.innerWidth,
		);
		expect(overflow).toBeLessThanOrEqual(0);
	});

test("the footer and the nav lead here and every internal link resolves", async ({
	page,
	request,
}) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto(PATH);
	await expect(
		page.locator("footer").getByRole("link", { name: "Funkzähler" }),
	).toHaveAttribute("href", PATH);
	await expect(
		page.locator(".nv-links a[aria-current=page]", { hasText: "Funkzähler" }),
	).toHaveAttribute("href", PATH);
	const links = new Set([
		...(await hrefs(page.locator('footer a[href^="/"]'))),
		...(await hrefs(page.locator('main a[href^="/"]'))),
	]);
	for (const href of links) {
		const response = await request.get(href);
		expect(response.status(), href).toBe(200);
	}
});

test("the pages that waited for it link here, and /geraete redirects here", async ({
	page,
	request,
}) => {
	await page.goto("/vorgehen");
	await expect(
		page.locator("main a", { hasText: "Digitale Funkablesung" }),
	).toHaveAttribute("href", PATH);
	await page.goto("/neuigkeiten");
	await expect(
		page.locator("main a.card", { hasText: "Funkzähler im Überblick" }),
	).toHaveAttribute("href", PATH);
	const response = await request.get("/geraete", { maxRedirects: 0 });
	expect(response.status()).toBe(301);
	expect(response.headers().location).toBe(PATH);
});

test("CTAs lead to the closing card's form, the rows, the FAQ and the linked pages", async ({
	page,
}) => {
	await page.goto(PATH);
	await expect(
		page.locator("section.final#start input[name=email]"),
	).toHaveCount(1);
	// The hero, four rows, the first card and the trust block
	const demo = page.locator("main a", { hasText: /Demo buchen/i });
	expect(await demo.count()).toBeGreaterThanOrEqual(7);
	for (const href of await hrefs(demo)) expect(href).toBe("#start");
	await expect(page.locator("a.ctab")).toHaveAttribute("href", "#start");

	await expect(
		page.locator("section[aria-labelledby=fz-h1] a", {
			hasText: /Mehr erfahren/i,
		}),
	).toHaveAttribute("href", "#inhalt");
	const faqLinks = page.locator("#inhalt a", { hasText: /Häufige Fragen/i });
	await expect(faqLinks).toHaveCount(4);
	for (const href of await hrefs(faqLinks)) expect(href).toBe("#faq");

	await expect(
		page.locator("main a", { hasText: /^Zum Installationstool$/i }),
	).toHaveAttribute("href", "/installationstool");
	for (const [text, href] of [
		["Jetzt noch umrüsten", "/upgrade-now"],
		["Mehr zum Wechsel", "/messdienstwechsel"],
		["Mehr zu Sicherheit", "/sicherheit"],
	])
		await expect(
			page.locator("#faq a.more", { hasText: text }),
		).toHaveAttribute("href", href);

	await page
		.locator("section[aria-labelledby=fz-h1] a", { hasText: /Demo buchen/i })
		.click();
	await expect(page.locator("#email-bottom")).toBeFocused();
});

test("the device tabs: click, keys, and the stage follows", async ({
	page,
}) => {
	await gotoHydrated(page);
	await expect(tabs(page)).toHaveCount(6);
	await expect(selected(page)).toHaveText(/Heizkostenverteiler/);
	await expect(shownPanel(page).locator("h3")).toHaveText(
		"Heizkostenverteiler",
	);
	await tabs(page).filter({ hasText: "Rauchwarnmelder" }).click();
	await expect(selected(page)).toHaveText(/Rauchwarnmelder/);
	await expect(shownPanel(page).locator("h3")).toHaveText("Rauchwarnmelder");
	await expect(shownPanel(page)).toHaveAttribute("role", "tabpanel");
	await page.keyboard.press("ArrowDown");
	await expect(selected(page)).toHaveText(/Funk-Gateway/);
	await expect(selected(page)).toBeFocused();
	await page.keyboard.press("Home");
	await expect(selected(page)).toHaveText(/Heizkostenverteiler/);
	// Only the shown panel is visible.
	await expect(gallery(page).locator(".gd-p:visible")).toHaveCount(1);
});

test("the device tabs advance every 6 s in view and stop when chosen", async ({
	page,
}) => {
	await page.clock.install();
	await gotoHydrated(page);
	await page.clock.runFor(10_000);
	// Out of view: still the first.
	await expect(selected(page)).toHaveText(/Heizkostenverteiler/);
	await gallery(page).locator(".gd-st").scrollIntoViewIfNeeded();
	await page.mouse.move(0, 0);
	await expect(gallery(page).locator(".gd-pr")).toHaveCount(1);
	await page.clock.runFor(6100);
	await expect(selected(page)).toHaveText(/Wärmemengenzähler/);
	await tabs(page).filter({ hasText: "Kaltwasserzähler" }).click();
	await page.mouse.move(0, 0);
	await expect(gallery(page).locator(".gd-pr")).toHaveCount(0);
	await page.clock.runFor(13_000);
	await expect(selected(page)).toHaveText(/Kaltwasserzähler/);
});

test.describe("without JavaScript", () => {
	test.use({ javaScriptEnabled: false });

	test("every block is in its end state", async ({ page }) => {
		await page.goto(PATH);
		await expect(page.locator("figure.mid .st")).toHaveText([
			"Empfangen",
			"Empfangen",
			"Empfangen",
			"Bereit",
		]);
		await expect(selected(page)).toHaveText(/Heizkostenverteiler/);
		await expect(gallery(page).locator(".gd-p:visible")).toHaveCount(1);
		await expect(page.locator("#inhalt .doc.ok")).toHaveCount(1);
		await expect(page.locator("#inhalt .phone.s2")).toHaveCount(1);
		await expect(page.locator("#inhalt li.done")).toHaveCount(6);
		await expect(page.locator("#inhalt li.now")).toHaveText(/3\. OG li/);
		await expect(page.locator(".bill.good .sum b")).toHaveText("keine");
		await expect(page.locator(".bw span.on")).toHaveText("Heizkostenverteiler");
		await expect(page.locator("section.final form")).toHaveCount(1);
	});
});

test.describe("with reduced motion", () => {
	test.use({ reducedMotion: "reduce" });

	test("the device tabs don't advance", async ({ page }) => {
		await page.clock.install();
		await gotoHydrated(page);
		await gallery(page).locator(".gd-st").scrollIntoViewIfNeeded();
		await page.clock.runFor(15_000);
		await expect(selected(page)).toHaveText(/Heizkostenverteiler/);
		await expect(gallery(page).locator(".gd-pr")).toHaveCount(0);
	});
});

test("signup stores the lead and sends the webhook with the page", async ({
	page,
}) => {
	const errors: string[] = [];
	page.on("console", (msg) => {
		if (msg.type() === "error") errors.push(msg.text());
	});
	page.on("pageerror", (error) => errors.push(error.message));
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
	expect(errors).toEqual([]);
});

test("loads without console errors", async ({ page }) => {
	const errors: string[] = [];
	page.on("console", (msg) => {
		if (msg.type() === "error" || msg.type() === "warning")
			errors.push(msg.text());
	});
	page.on("pageerror", (error) => errors.push(error.message));
	await gotoHydrated(page);
	await page.evaluate(async () => {
		for (let y = 0; y < document.body.scrollHeight; y += 600) {
			window.scrollTo(0, y);
			await new Promise((r) => setTimeout(r, 40));
		}
	});
	expect(errors).toEqual([]);
});
