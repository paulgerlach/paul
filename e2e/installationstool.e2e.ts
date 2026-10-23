import { expect, test, type Locator, type Page } from "@playwright/test";

// No form on this page: its "Demo buchen" lead to /demo.

const PATH = "/plattform/installationstool";

async function hrefs(links: Locator) {
	return (await links.evaluateAll((els) =>
		els.map((el) => el.getAttribute("href")),
	)) as string[];
}

/** Waits for hydration, so the loops are attached. */
const gotoHydrated = (page: Page) =>
	page.goto(PATH, { waitUntil: "networkidle" });

const listItems = (page: Page) => page.locator("figure.mid .li");
const pills = (page: Page) => page.locator("figure.mid .st");
const camera = (page: Page) => page.locator(".it-ph .cam");
/** The camera's state classes, without Svelte's scoping class. */
const cameraState = async (page: Page) =>
	((await camera(page).getAttribute("class")) ?? "")
		.split(/\s+/)
		.filter((c) => c !== "cam" && !c.startsWith("svelte-"))
		.join(" ");
const DONE = "s2 s3 t1 t2";

test("renders with its own layout, SEO tags and FAQ data", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^Heidi Installationstool/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(
		page.getByRole("heading", {
			level: 1,
			name: "Das Heidi Installationstool für Installateure",
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
		/\/plattform\/installationstool$/,
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
	// The host followed by the path, exactly.
	expect(sitemap).not.toMatch(
		/<loc>https?:\/\/[^/]+\/plattform\/installationstool<\/loc>/,
	);
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

test("the footer leads here and every internal link resolves", async ({
	page,
	request,
}) => {
	await page.goto(PATH);
	await expect(
		page.locator("footer").getByRole("link", { name: "Installationstool" }),
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

test("the pages that waited for it link here", async ({ page }) => {
	await page.goto("/partner/installationspartner");
	await expect(
		page.locator("#faq a.more", { hasText: "Mehr zum Installationstool" }),
	).toHaveAttribute("href", PATH);
	await page.goto("/vorgehen");
	await expect(
		page.locator("main a", {
			hasText: "Digitaler Zwilling, zwei Fotos pro Zähler",
		}),
	).toHaveAttribute("href", PATH);
	await page.goto("/neuigkeiten");
	await expect(
		page.locator("main a.card", {
			hasText: "Installationstool: Ein Termin in der Wohnung",
		}),
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
	await expect(
		page.locator("section[aria-labelledby=it-h1]"),
	).not.toHaveAttribute("id", "start");
	// The hero, four rows, the first card and the trust block
	const demo = page.locator("main a", { hasText: /Demo buchen/i });
	expect(await demo.count()).toBeGreaterThanOrEqual(7);
	for (const href of await hrefs(demo)) expect(href).toBe("/demo");
	await expect(page.locator("a.ctab")).toHaveAttribute("href", "/demo");
	await expect(
		page.locator("nav.top").getByRole("link", { name: "Demo buchen" }),
	).toHaveAttribute("href", "/demo");

	await expect(
		page.locator("section[aria-labelledby=it-h1] a", {
			hasText: /Mehr erfahren/i,
		}),
	).toHaveAttribute("href", "#inhalt");
	await expect(page.locator("#inhalt")).toHaveCount(1);
	const faqLinks = page.locator("#inhalt a", { hasText: /Häufige Fragen/i });
	await expect(faqLinks).toHaveCount(4);
	for (const href of await hrefs(faqLinks)) expect(href).toBe("#faq");
	await expect(page.locator("#faq")).toHaveCount(1);

	await expect(
		page.locator("main a", { hasText: /^Partner werden$/i }),
	).toHaveAttribute("href", "/partner/installationspartner");
	// Inside closed answers, so not in the accessibility tree yet.
	await expect(
		page.locator("#faq a.more", { hasText: "Installationspartner werden" }),
	).toHaveAttribute("href", "/partner/installationspartner");
	await expect(
		page.locator("#faq a.more", { hasText: "Mehr zu Sicherheit" }),
	).toHaveAttribute("href", "/sicherheit");

	// A "Demo buchen" opens the booking page.
	await page
		.locator("section[aria-labelledby=it-h1] a", { hasText: /Demo buchen/i })
		.click();
	await expect(page).toHaveURL(/\/demo$/);
});

test.describe("without JavaScript", () => {
	test.use({ javaScriptEnabled: false });

	test("every block is in its end state", async ({ page }) => {
		await page.goto(PATH);
		await expect(pills(page)).toHaveText([
			"Digitalisiert",
			"Digitalisiert",
			"Digitalisiert",
			"Fertig",
		]);
		await expect(page.locator("figure.mid .li.ok")).toHaveCount(4);
		await expect(page.locator("#inhalt .phone.s2")).toHaveCount(1);
		expect(await cameraState(page)).toBe(DONE);
		await expect(camera(page).locator(".ok")).toHaveText(
			"2. OG links digitalisiert",
		);
		await expect(page.locator("#inhalt li.done")).toHaveCount(8);
		await expect(page.locator("#inhalt li.now")).toHaveText(/4\. OG li/);
		await expect(page.locator(".bill.good .sum b")).toHaveText("einer");
		await expect(page.locator(".bw span.on")).toHaveText("Digitaler Zwilling");
		await expect(page.locator("section.final a.dcta")).toHaveAttribute(
			"href",
			"/demo",
		);
	});
});

test.describe("with reduced motion", () => {
	test.use({ reducedMotion: "reduce" });

	test("every block shows its end state and stays", async ({ page }) => {
		await page.clock.install();
		await gotoHydrated(page);
		await page.clock.runFor(10_000);
		await expect(page.locator("figure.mid .li.ok")).toHaveCount(4);
		await camera(page).scrollIntoViewIfNeeded();
		await page.clock.runFor(10_000);
		expect(await cameraState(page)).toBe(DONE);
		await page.locator(".bill").scrollIntoViewIfNeeded();
		await page.clock.runFor(7000);
		await expect(page.locator(".bill.good")).toHaveCount(1);
		await page.locator(".bw").scrollIntoViewIfNeeded();
		await page.clock.runFor(5000);
		await expect(page.locator(".bw span.on")).toHaveText("Digitaler Zwilling");
	});
});

test("the hero list replays after its first interval", async ({ page }) => {
	await page.clock.install();
	await gotoHydrated(page);
	await expect(page.locator("figure.mid .li.ok")).toHaveCount(4);
	const firstClass = () => listItems(page).first().getAttribute("class");
	// The installed clock also runs in real time, so step towards the
	// first replay (9 s): amber again, with the first status.
	await page.clock.runFor(6000);
	await expect
		.poll(async () => {
			await page.clock.runFor(400);
			return firstClass();
		})
		.not.toMatch(/\bok\b/);
	await expect(pills(page).first()).toHaveText("Wird fotografiert");
	await page.clock.runFor(1500);
	await expect(listItems(page).first()).toHaveClass(/\bok\b/);
	await expect(pills(page).first()).toHaveText("Digitalisiert");
	await page.clock.runFor(2500);
	await expect(page.locator("figure.mid .li.ok")).toHaveCount(4);
});

test("the camera takes both photos in view and stops done", async ({
	page,
}) => {
	await page.clock.install();
	await gotoHydrated(page);
	expect(await cameraState(page)).toBe(DONE);
	await camera(page).scrollIntoViewIfNeeded();
	// A pass starts on entering: empty, then the old meter in focus.
	await expect.poll(() => cameraState(page)).toBe("");
	await page.clock.runFor(800);
	await expect.poll(() => cameraState(page)).toMatch(/\bfx\b/);
	await page.clock.runFor(2000);
	await expect.poll(() => cameraState(page)).toMatch(/\bs2\b.*\bt1\b/);
	await page.clock.runFor(2000);
	await expect.poll(() => cameraState(page)).toBe(DONE);
	await expect(camera(page).locator(".ok")).toHaveCSS("opacity", "1");

	// A new pass, cut short by leaving: it stops in the end state.
	await page.clock.runFor(5000);
	await expect.poll(() => cameraState(page)).not.toBe(DONE);
	await page.locator("section.final").scrollIntoViewIfNeeded();
	await expect.poll(() => cameraState(page)).toBe(DONE);
	await page.clock.runFor(10_000);
	expect(await cameraState(page)).toBe(DONE);
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
