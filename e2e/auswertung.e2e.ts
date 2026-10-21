import { expect, test, type Locator, type Page } from "@playwright/test";

// The signup test saves a lead, so it needs a database with the `leads` table.
// Webhooks go to the local sink from playwright.config.ts.

const PATH = "/auswertung";
const WEBHOOK_EVENTS = "http://127.0.0.1:4199/events";

const testEmail = (name: string) =>
	`e2e-aw-${name}-${Date.now()}-${Math.round(Math.random() * 1e6)}@example.com`;

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

/** Waits for hydration, so the entrances and handlers are attached. */
const gotoHydrated = (page: Page) =>
	page.goto(PATH, { waitUntil: "networkidle" });

/** The comparison's rows as shown, top to bottom: "name value badge". */
const shownOrder = (page: Page) =>
	page.locator(".ac-r").evaluateAll((rows) =>
		rows
			.map((r) => ({
				top: r.getBoundingClientRect().top,
				text: [".ac-n b", ".ac-v", ".ac-t"]
					.map((s) => r.querySelector(s)!.textContent)
					.join(" "),
			}))
			.sort((a, b) => a.top - b.top)
			.map((r) => r.text),
	);

test("renders with its own layout and SEO tags", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^Heidi Auswertung:/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(
		page.getByRole("heading", {
			level: 1,
			name: "Ihre Verbräuche. Klar ausgewertet.",
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
		/\/auswertung$/,
	);
	await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(
		0,
	);
});

test("is not in the sitemap yet", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	expect(sitemap).not.toContain("/auswertung</loc>");
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

test("the footer's Auswertung link and internal links resolve", async ({
	page,
	request,
}) => {
	await page.goto(PATH);
	await expect(
		page.locator("footer").getByRole("link", { name: "Auswertung" }),
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

test("/neuigkeiten's featured story links here", async ({ page }) => {
	await page.goto("/neuigkeiten");
	await expect(page.locator("a.feat")).toHaveAttribute("href", PATH);
	await expect(page.locator("a.feat")).toContainText("Zur Auswertung");
});

test("every CTA leads to the closing card's form", async ({ page }) => {
	await page.goto(PATH);
	await expect(
		page.locator("section.final#start input[name=email]"),
	).toHaveCount(1);
	const ctas = page.locator("main a", {
		hasText: /Angebot einholen/,
	});
	expect(await ctas.count()).toBeGreaterThanOrEqual(1);
	for (const href of await hrefs(ctas)) expect(href).toBe("#start");
	const demo = page.locator("main a", { hasText: "Demo buchen" });
	expect(await demo.count()).toBeGreaterThanOrEqual(1);
	for (const href of await hrefs(demo)) expect(href).toBe("/demo-buchen");
	await expect(page.getByText("Lieber direkt eine Demo buchen")).toHaveCount(0);
	await expect(
		page.locator("main a", { hasText: "Mehr zu Sicherheit" }),
	).toHaveAttribute("href", "/sicherheit");
});

test.describe("without JS", () => {
	test.use({ javaScriptEnabled: false });

	test("the server renders every block in its end state", async ({ page }) => {
		await page.goto(PATH);
		await expect(page.locator(".ax")).toHaveClass(/\bin\b/);
		await expect(page.locator(".ax-k b > span")).toHaveText([
			"111",
			"13,7",
			"3",
		]);
		await expect(page.locator(".ax-v")).toHaveText([
			"118",
			"96",
			"142",
			"104",
			"88",
			"131",
			"99",
		]);
		await expect(page.locator(".ax-h")).toContainText("Ø Portfolio 111");
		await expect(page.locator(".ax-r.hi .ax-n")).toHaveText([
			"Bergmannstraße 4",
			"Schillerhöfe",
		]);
		expect(
			await page
				.locator(".ax-b i")
				.first()
				.evaluate((i) => (i as HTMLElement).style.width),
		).not.toBe("0%");
		for (const sel of [".af-c", ".ah", ".afd", ".arp"])
			for (const el of await page.locator(sel).all())
				await expect(el).toHaveClass(/\bin\b/);
		expect((await shownOrder(page))[0]).toBe("Bergmannstraße 4 142 +28\u00a0%");
		await expect(page.locator(".ac-avg")).toHaveText("Ø 111");
		await expect(page.locator(".ah-r i")).toHaveCount(84);
		await expect(page.locator(".afd-i:visible")).toHaveCount(5);
		await expect(
			page.getByRole("button", { name: "Heizung", pressed: true }),
		).toHaveCount(1);
		// The heatmap's values for screen readers
		await expect(page.locator(".ah table tbody tr")).toHaveCount(7);
		await expect(
			page.locator(".ah table tbody tr").nth(2).locator("td").nth(10),
		).toHaveText("+24\u00a0% zum Vorjahr");
	});
});

test("the switch re-sorts the comparison", async ({ page }) => {
	await gotoHydrated(page);
	const card = page.locator(".ac");
	await card.scrollIntoViewIfNeeded();
	await card.getByRole("button", { name: "Warmwasser" }).click();
	await expect(
		card.getByRole("button", { name: "Warmwasser" }),
	).toHaveAttribute("aria-pressed", "true");
	await expect(card.locator(".ac-u")).toHaveText("m³/WE · Jan – Okt");
	await expect(card.locator(".ac-avg")).toHaveText("Ø 13,7");
	await expect(card.locator("[aria-live]")).toHaveText(
		"Höchster Wert: Bergmannstraße 4, 17,6 m³/WE",
	);
	await expect
		.poll(async () => (await shownOrder(page)).at(-1))
		.toBe("Mühlenstraße 18 10,4 −24\u00a0%");
	await card.getByRole("button", { name: "Kaltwasser" }).click();
	await expect(card.locator(".ac-avg")).toHaveText("Ø 31,4");
});

test("the heatmap's tooltip shows a cell's value", async ({ page }) => {
	await gotoHydrated(page);
	await page.locator(".ah").scrollIntoViewIfNeeded();
	const tip = page.locator(".ah-tip");
	await page.locator('.ah-r i[data-r="2"][data-j="10"]').hover();
	await expect(tip).toHaveClass(/\bon\b/);
	await expect(tip).toHaveText("Bergmannstraße 4 · Nov+24\u00a0% zum Vorjahr");
	await page.locator("#ah-h").hover();
	await expect(tip).not.toHaveClass(/\bon\b/);
});

test("the notes filter by kind", async ({ page }) => {
	await gotoHydrated(page);
	const card = page.locator(".afd");
	await card.scrollIntoViewIfNeeded();
	for (const [name, n] of [
		["Wasser", 2],
		["Heizung", 2],
		["Technik", 1],
		["Alle 5", 5],
	] as const) {
		await card.getByRole("button", { name }).click();
		await expect(card.getByRole("button", { name })).toHaveAttribute(
			"aria-pressed",
			"true",
		);
		await expect(card.locator(".afd-i:visible")).toHaveCount(n);
	}
	await expect(card.locator("[aria-live]")).toHaveText("5 Hinweise");
});

test("the mock-up counts up when it scrolls into view", async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 500 });
	await gotoHydrated(page);
	await expect(page.locator(".ax")).not.toHaveClass(/\bin\b/);
	await expect(page.locator(".ax-k b > span").first()).toHaveText("0");
	await page.locator(".ax").scrollIntoViewIfNeeded();
	await expect(page.locator(".ax")).toHaveClass(/\bin\b/);
	await expect(page.locator(".ax-k b > span")).toHaveText(["111", "13,7", "3"]);
	await expect(page.locator(".ax-v").nth(2)).toHaveText("142");
});

test.describe("with reduced motion", () => {
	test.use({ reducedMotion: "reduce" });

	test("every block shows its end state", async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 500 });
		await gotoHydrated(page);
		for (const sel of [".ax", ".af-c", ".ac", ".ah", ".afd", ".arp"])
			for (const el of await page.locator(sel).all())
				await expect(el).not.toHaveClass(/rv-wait/);
		await expect(page.locator(".ax")).toHaveClass(/\bin\b/);
		await expect(page.locator(".ax-k b > span")).toHaveText([
			"111",
			"13,7",
			"3",
		]);
		await expect(page.locator(".arp")).toHaveClass(/\bin\b/);
		expect(
			await page
				.locator(".ac-b i")
				.first()
				.evaluate((i) => (i as HTMLElement).style.width),
		).not.toBe("0%");
	});
});

test("has no console errors", async ({ page }) => {
	const errors: string[] = [];
	page.on("console", (m) => {
		if (m.type() === "error" || m.type() === "warning") errors.push(m.text());
	});
	page.on("pageerror", (e) => errors.push(String(e)));
	await gotoHydrated(page);
	for (const sel of [".ac", ".ah", ".afd", ".arp", "#start"])
		await page.locator(sel).first().scrollIntoViewIfNeeded();
	expect(errors).toEqual([]);
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
