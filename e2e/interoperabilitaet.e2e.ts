import { expect, test, type Locator, type Page } from "@playwright/test";
import { scrollIn } from "./inView.ts";
import { GATED_ROBOTS, expectGated } from "./launch.ts";

// No form on this page: its "Demo buchen" lead to /demo.

const PATH = "/geraete/herstellerunabhaengig";

async function hrefs(links: Locator) {
	return (await links.evaluateAll((els) =>
		els.map((el) => el.getAttribute("href")),
	)) as string[];
}

/** Waits for hydration, so the loops are attached. */
const gotoHydrated = (page: Page) =>
	page.goto(PATH, { waitUntil: "networkidle" });

const hub = (page: Page) => page.locator("figure.iphub");
const hubCount = (page: Page) => hub(page).locator(".cnt b");

test("renders with its own layout, SEO tags and FAQ data", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(
		"Funkzähler aller Hersteller auslesen | Heidi",
	);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(
		page.getByRole("heading", {
			level: 1,
			name: "Ein Dashboard. Jeder Hersteller. Zähler-Interoperabilität: Heidi liest Zähler jedes Herstellers aus und erstellt die Abrechnung",
		}),
	).toBeVisible();
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		GATED_ROBOTS,
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		/\/geraete\/herstellerunabhaengig$/,
	);
	const faq = JSON.parse(
		(await page.locator('script[type="application/ld+json"]').textContent()) ??
			"{}",
	);
	expect(faq["@type"]).toBe("FAQPage");
	expect(faq.mainEntity).toHaveLength(8);
});

test("is in the sitemap once launched", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	expectGated(sitemap).toMatch(
		/<loc>https?:\/\/[^/]+\/geraete\/herstellerunabhaengig<\/loc>/,
	);
});

for (const width of [375, 320])
	test(`has no horizontal overflow at ${width} px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 812 });
		await gotoHydrated(page);
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - window.innerWidth,
		);
		expect(overflow).toBeLessThanOrEqual(0);
	});

test("the footer, the nav and /preise lead here and every internal link resolves", async ({
	page,
	request,
}) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto(PATH);
	await expect(
		page.locator("footer").getByRole("link", { name: "Herstellerunabhängig" }),
	).toHaveAttribute("href", PATH);
	await expect(
		page.locator(".nv-links a[aria-current=page]", {
			hasText: "Herstellerunabhängig",
		}),
	).toHaveAttribute("href", PATH);
	const links = new Set([
		...(await hrefs(page.locator('footer a[href^="/"]'))),
		...(await hrefs(page.locator('main a[href^="/"]'))),
	]);
	for (const href of links) {
		const response = await request.get(href);
		expect(response.status(), href).toBe(200);
	}
	await page.goto("/preise");
	await expect(
		page.locator("#faq a", { hasText: "Mehr zur Interoperabilität" }),
	).toHaveAttribute("href", PATH);
});

test("CTAs lead to the booking page, the rows, the FAQ and the linked pages", async ({
	page,
}) => {
	await page.goto(PATH);
	await expect(page.locator("section.final a.dcta")).toHaveAttribute(
		"href",
		"/demo",
	);
	// The hero, four rows and the trust block
	const demo = page.locator("main a", { hasText: /Demo buchen/i });
	expect(await demo.count()).toBeGreaterThanOrEqual(6);
	for (const href of await hrefs(demo)) expect(href).toBe("/demo");
	await expect(
		page.locator("main a", { hasText: /^Bestand prüfen lassen$/i }),
	).toHaveAttribute("href", "/demo");
	await expect(
		page.locator("main a", { hasText: /^Zur API-Dokumentation$/i }),
	).toHaveAttribute("href", "/api");
	await expect(
		page.locator("section[aria-labelledby=iop-h1] a", {
			hasText: /Mehr erfahren/i,
		}),
	).toHaveAttribute("href", "#inhalt");
	const faqLinks = page.locator("#inhalt a", { hasText: /Häufige Fragen/i });
	await expect(faqLinks).toHaveCount(4);
	for (const href of await hrefs(faqLinks)) expect(href).toBe("#faq");

	expect(
		await hrefs(page.locator("section[aria-labelledby=iop-ds-h] article a")),
	).toEqual([
		"/plattform/dashboard",
		"/plattform/dashboard",
		"#recht",
		"/messdienst-wechseln",
	]);
	expect(await hrefs(page.locator("#recht a"))).toEqual([
		"/heizkostenverordnung",
		"/fernablesung-umruesten",
	]);
	for (const [text, href] of [
		["Mehr zum Wechsel", "/messdienst-wechseln"],
		["Zum rechtlichen Rahmen", "#recht"],
		["Jetzt noch umrüsten", "/fernablesung-umruesten"],
		["Mehr zu Sicherheit", "/sicherheit"],
	])
		await expect(
			page.locator("#faq a.more", { hasText: text }),
		).toHaveAttribute("href", href);
});

test("the hub draws its wires and, in view, refills the dashboard", async ({
	page,
}) => {
	await page.clock.install();
	await gotoHydrated(page);
	await expect(hub(page).locator(".paths path")).toHaveCount(4);
	await expect(hubCount(page)).toHaveText("102");
	await scrollIn(hub(page));
	// Holds full, starts again from 0, then the packets fill it up.
	await page.clock.runFor(3300);
	await expect(hubCount(page)).toHaveText("0");
	await page.clock.runFor(3000);
	await expect(hubCount(page)).not.toHaveText("0");
});

test.describe("without JavaScript", () => {
	test.use({ javaScriptEnabled: false });

	test("every block is in its end state", async ({ page }) => {
		await page.goto(PATH);
		await expect(hubCount(page)).toHaveText("102");
		await expect(hub(page).locator(".rk")).toHaveCount(4);
		await expect(page.locator("#inhalt .dec.done .dr.dn")).toHaveCount(5);
		await expect(page.locator("#inhalt .chk.done li.ok")).toHaveCount(3);
		await expect(page.locator("#inhalt li.now")).toHaveText(/3\. OG re/);
		await expect(page.locator(".bill.good .sum b")).toHaveText("keine");
		await expect(page.locator(".mgs .big")).toHaveText("102");
		await expect(page.locator(".lw.io.st .cl.on")).toHaveCount(3);
		await expect(page.locator(".k.st.mg")).toHaveCount(1);
		await expect(page.locator("#recht .tl.in")).toHaveCount(1);
	});
});

test.describe("with reduced motion", () => {
	test.use({ reducedMotion: "reduce" });

	test("the hub stays full", async ({ page }) => {
		await page.clock.install();
		await gotoHydrated(page);
		await scrollIn(hub(page));
		await page.clock.runFor(8000);
		await expect(hubCount(page)).toHaveText("102");
		await expect(hub(page).locator(".pk-dots circle")).toHaveCount(0);
	});
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
