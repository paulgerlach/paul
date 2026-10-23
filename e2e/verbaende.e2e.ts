import { expect, test, type Locator, type Page } from "@playwright/test";
import { GATED_ROBOTS, expectGated } from "./launch.ts";

// No form on this page: its "Demo buchen" lead to /demo.

const PATH = "/partner/verbaende";

async function hrefs(links: Locator) {
	return (await links.evaluateAll((els) =>
		els.map((el) => el.getAttribute("href")),
	)) as string[];
}

/** Waits for hydration, so the loops and entrances are attached. */
const gotoHydrated = (page: Page) =>
	page.goto(PATH, { waitUntil: "networkidle" });

const listItems = (page: Page) => page.locator("figure.mid .li");
const pills = (page: Page) => page.locator("figure.mid .st");
const logoCards = (page: Page) => page.locator("#inhalt .tile .card");

test("renders with its own layout, SEO tags and FAQ data", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^Heidi Systems in den Verbänden/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(
		page.getByRole("heading", {
			level: 1,
			name: "Heidi Systems in den Verbänden der Branche",
		}),
	).toBeVisible();
	await expect(page.locator("#header")).toHaveCount(0);
	// noindex until LAUNCHED (its go-live gate), with a self-canonical
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		GATED_ROBOTS,
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		/\/partner\/verbaende$/,
	);

	const jsonLd = await page
		.locator('script[type="application/ld+json"]')
		.textContent();
	const faq = JSON.parse(jsonLd ?? "{}");
	expect(faq["@type"]).toBe("FAQPage");
	expect(faq.mainEntity).toHaveLength(5);
});

test("is in the sitemap once launched", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	// The host followed by the path, exactly.
	expectGated(sitemap).toMatch(
		/<loc>https?:\/\/[^/]+\/partner\/verbaende<\/loc>/,
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
		page.locator("footer").getByRole("link", { name: "Verbände" }),
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

test("CTAs lead to the booking page, the rows, the FAQ and the linked pages", async ({
	page,
}) => {
	await page.goto(PATH);
	await expect(page.locator("section.final a.dcta")).toHaveAttribute(
		"href",
		"/demo",
	);
	await expect(
		page.locator("section[aria-labelledby=vb-h1]"),
	).not.toHaveAttribute("id", "start");
	// The hero, four rows, the second card and the trust block
	const demo = page.locator("main a", { hasText: /Demo buchen/i });
	expect(await demo.count()).toBeGreaterThanOrEqual(7);
	for (const href of await hrefs(demo)) expect(href).toBe("/demo");
	await expect(
		page.locator("nav.top").getByRole("link", { name: "Demo buchen" }),
	).toHaveAttribute("href", "/demo");

	await expect(
		page.locator("section[aria-labelledby=vb-h1] a", {
			hasText: /Mehr erfahren/i,
		}),
	).toHaveAttribute("href", "#inhalt");
	await expect(page.locator("#inhalt")).toHaveCount(1);
	const faqLinks = page.locator("#inhalt a", { hasText: /Häufige Fragen/i });
	await expect(faqLinks).toHaveCount(4);
	for (const href of await hrefs(faqLinks)) expect(href).toBe("#faq");
	await expect(page.locator("#faq")).toHaveCount(1);

	await expect(
		page.locator("main a", { hasText: "Zur Presseseite" }),
	).toHaveAttribute("href", "/presse");
	// Inside a closed answer, so not in the accessibility tree yet.
	await expect(
		page.locator("#faq a.more", { hasText: "Mehr zu Sicherheit" }),
	).toHaveAttribute("href", "/sicherheit");

	// A "Demo buchen" opens the booking page.
	await page
		.locator("section[aria-labelledby=vb-h1] a", { hasText: /Demo buchen/i })
		.click();
	await expect(page).toHaveURL(/\/demo$/);
});

test.describe("without JavaScript", () => {
	test.use({ javaScriptEnabled: false });

	test("every block is in its end state", async ({ page }) => {
		await page.goto(PATH);
		await expect(pills(page)).toHaveText([
			"Partner",
			"Vernetzt",
			"Vernetzt",
			"Konform",
		]);
		await expect(page.locator("figure.mid .li.ok")).toHaveCount(4);
		await expect(logoCards(page)).toHaveCount(3);
		await expect(logoCards(page)).toHaveText([
			"Kooperationspartner Bund",
			"Verband unabhängiger Messdienstleister",
			"Energie- und Wasserdatenmanagement",
		]);
		await expect(page.locator("#inhalt .tile .card.wait")).toHaveCount(0);
		await expect(page.locator(".doc .dr.on")).toHaveCount(3);
		await expect(page.locator(".doc.ok")).toHaveCount(1);
		await expect(page.locator(".bw span.on")).toHaveText("VDIV");
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
		// Below the fold, yet never hidden.
		await expect(page.locator("#inhalt .tile .card.wait")).toHaveCount(0);
		await logoCards(page).first().scrollIntoViewIfNeeded();
		await expect(logoCards(page).first()).toHaveCSS("opacity", "1");
		await page.locator(".doc").scrollIntoViewIfNeeded();
		await page.clock.runFor(8000);
		await expect(page.locator(".doc.ok")).toHaveCount(1);
		await page.locator(".bw").scrollIntoViewIfNeeded();
		await page.clock.runFor(5000);
		await expect(page.locator(".bw span.on")).toHaveText("VDIV");
	});
});

test("the hero list replays after its first interval", async ({ page }) => {
	await page.clock.install();
	await gotoHydrated(page);
	await expect(page.locator("figure.mid .li.ok")).toHaveCount(4);
	const firstClass = () => listItems(page).first().getAttribute("class");
	// The installed clock also runs in real time, so step towards the
	// first replay (9 s): amber again, with the same text.
	await page.clock.runFor(6000);
	await expect
		.poll(async () => {
			await page.clock.runFor(400);
			return firstClass();
		})
		.not.toMatch(/\bok\b/);
	await expect(pills(page).first()).toHaveText("Partner");
	await page.clock.runFor(1500);
	await expect(listItems(page).first()).toHaveClass(/\bok\b/);
	await page.clock.runFor(2500);
	await expect(page.locator("figure.mid .li.ok")).toHaveCount(4);
});

test("the logo cards rise in once in view", async ({ page }) => {
	await gotoHydrated(page);
	// Below the fold after hydration: waiting in their start state.
	await expect(page.locator("#inhalt .tile .card.wait")).toHaveCount(3);
	const first = logoCards(page).first();
	await first.scrollIntoViewIfNeeded();
	await expect(first).not.toHaveClass(/\bwait\b/);
	await expect(first).toHaveCSS("opacity", "1");
	// Still waiting further down.
	await expect(logoCards(page).last()).toHaveClass(/\bwait\b/);
	// Once only: back up and down again, it stays shown.
	await page.evaluate(() => window.scrollTo(0, 0));
	await first.scrollIntoViewIfNeeded();
	await expect(first).not.toHaveClass(/\bwait\b/);
});

test("the document and the rotator loop while in view", async ({ page }) => {
	await page.clock.install();
	await gotoHydrated(page);

	await page.locator(".doc").scrollIntoViewIfNeeded();
	await page.clock.runFor(200);
	await expect(page.locator(".doc.ok")).toHaveCount(0);
	await page.clock.runFor(2500);
	await expect(page.locator(".doc .dr.on")).toHaveCount(3);
	await expect(page.locator(".doc.ok")).toHaveCount(1);

	await page.locator(".bw").scrollIntoViewIfNeeded();
	await page.clock.runFor(200);
	await expect(page.locator(".bw span.on")).toHaveText("VDIV");
	await page.clock.runFor(2400);
	await expect(page.locator(".bw span.on")).toHaveText("DEUMESS");
	await page.clock.runFor(2300);
	await expect(page.locator(".bw span.on")).toHaveText("bved");

	// Out of view, the document doesn't start a new pass.
	await page.locator("section.final").scrollIntoViewIfNeeded();
	await page.clock.runFor(8000);
	await expect(page.locator(".doc.ok")).toHaveCount(1);
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
