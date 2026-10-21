import { expect, test, type Locator, type Page } from "@playwright/test";

// No form on this page: nothing is stored or sent.

const PATH = "/api-dokumentation";
const DEMO = "/demo-buchen";
const ARTICLES = [
	"ueberblick",
	"schnellstart",
	"auth",
	"basis",
	"verbrauch",
	"wechsel",
	"dokumente",
	"datei",
	"status",
	"versionen",
	"zugang",
];

async function hrefs(links: Locator) {
	return (await links.evaluateAll((els) =>
		els.map((el) => el.getAttribute("href")),
	)) as string[];
}

/** Waits for hydration, so the scroll spy and the copy buttons run. */
const gotoHydrated = (page: Page) =>
	page.goto(PATH, { waitUntil: "networkidle" });

const toc = (page: Page) =>
	page.getByRole("navigation", { name: "Inhalt der Dokumentation" });
const current = (page: Page) => toc(page).locator('a[aria-current="location"]');

test("renders with its own layout and SEO tags", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^API-Dokumentation: /);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(
		page.getByRole("heading", {
			level: 1,
			name: "Verbrauchsdaten direkt in Ihre Software. Nach bved-Standard.",
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
		/\/api-dokumentation$/,
	);
});

test("is not in the sitemap yet", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	expect(sitemap).not.toContain("/api-dokumentation</loc>");
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

test("the footer leads here and every internal link resolves", async ({
	page,
	request,
}) => {
	await page.goto(PATH);
	await expect(
		page.locator("footer").getByRole("link", { name: "API-Dokumentation" }),
	).toHaveAttribute("href", PATH);
	const links = new Set([
		...(await hrefs(page.locator('footer a[href^="/"]'))),
		...(await hrefs(page.locator('main a[href^="/"]'))),
	]);
	expect(links).toContain("/softwarepartner");
	for (const href of links) {
		const response = await request.get(href.split("#")[0]);
		expect(response.status(), href).toBe(200);
	}
});

test("the pages that waited for it link here", async ({ page }) => {
	await page.goto("/softwarepartner");
	await expect(
		page.locator("main a", { hasText: "API-Dokumentation" }),
	).toHaveAttribute("href", PATH);
	await page.goto("/partnerschaften");
	await expect(
		page.locator("main a", { hasText: "Heidi API" }),
	).toHaveAttribute("href", PATH);
	await expect(
		page.locator("#faq a", { hasText: "API-Dokumentation" }),
	).toHaveAttribute("href", PATH);
	await page.goto("/neuigkeiten");
	await expect(
		page.locator("main a", { hasText: "Heidi API: Die Dokumentation" }),
	).toHaveAttribute("href", PATH);
});

test("the CTAs lead to the quick start, the partner page and /demo-buchen", async ({
	page,
}) => {
	await page.goto(PATH);
	// No form on this page, and the hero isn't `#start` (the design's).
	await expect(page.locator("#start")).toHaveCount(0);
	await expect(page.locator("main form")).toHaveCount(0);
	await expect(
		page.locator("main a", { hasText: "Schnellstart" }).first(),
	).toHaveAttribute("href", "#schnellstart");
	const partner = page.locator("main a", { hasText: "Softwarepartner werden" });
	await expect(partner).toHaveCount(2);
	for (const href of await hrefs(partner))
		expect(href).toBe("/softwarepartner");
	await expect(
		page.locator("#zugang a", { hasText: "Erstgespräch vereinbaren" }),
	).toHaveAttribute("href", DEMO);
	await expect(
		page.locator("section.trust a", { hasText: "Demo buchen" }),
	).toHaveAttribute("href", DEMO);
	await expect(
		page.locator("section.trust a", { hasText: "Mehr zu Sicherheit" }),
	).toHaveAttribute("href", "/sicherheit");
	await expect(page.locator("a.ctab")).toHaveAttribute("href", DEMO);
	await expect(
		page.locator("nav.top").getByRole("link", { name: "Demo buchen" }),
	).toHaveAttribute("href", DEMO);
	const bved = page.locator("main a", { hasText: "bved-Spezifikationen" });
	await expect(bved).toHaveAttribute(
		"href",
		"https://bved.info/datenaustauschalt/spezifikationen/",
	);
	await expect(bved).toHaveAttribute("target", "_blank");
	await expect(bved).toHaveAttribute("rel", "noopener noreferrer");
	// The service cards lead to their articles.
	expect(await hrefs(page.locator("#ueberblick a"))).toEqual([
		"#verbrauch",
		"#wechsel",
		"#dokumente",
		"#datei",
	]);
});

test("the table of contents lists the articles and follows the reading", async ({
	page,
}) => {
	await gotoHydrated(page);
	expect(await hrefs(toc(page).locator("a"))).toEqual(
		ARTICLES.map((id) => `#${id}`),
	);
	for (const id of ARTICLES)
		await expect(page.locator(`#${id}`)).toHaveCount(1);
	await expect(current(page)).toHaveText("Überblick");
	await page.evaluate(() =>
		document.getElementById("status")!.scrollIntoView(),
	);
	await expect(current(page)).toHaveText("Statuscodes");
	await toc(page).getByRole("link", { name: "Authentifizierung" }).click();
	await expect(page).toHaveURL(/#auth$/);
	await expect(current(page)).toHaveText("Authentifizierung");
});

test("the server colours the JSON and renders the tables", async ({ page }) => {
	await page.goto(PATH);
	const answer = page.locator("#ep-periods pre code");
	await expect(answer.locator(".k").first()).toHaveText('"billingunit"');
	await expect(answer.locator(".s").first()).toHaveText('"123456789"');
	// The cURL sample isn't JSON: no colours.
	await expect(page.locator("#schnellstart pre code span")).toHaveCount(0);
	await expect(
		page
			.getByRole("region", { name: "Tabelle: Statuscodes" })
			.locator("tbody tr"),
	).toHaveCount(7);
	await expect(
		page
			.getByRole("region", { name: "Tabelle: Versionen" })
			.locator("tbody tr"),
	).toHaveCount(5);
	await expect(page.locator("pre[tabindex='0']")).toHaveCount(3);
});

test.describe("Kopieren", () => {
	test.use({ permissions: ["clipboard-read", "clipboard-write"] });

	test("copies the plain code", async ({ page }) => {
		await gotoHydrated(page);
		const block = page.locator("#ep-periods");
		const button = block.locator("button.cp");
		await expect(button).toHaveText("Kopieren");
		await button.click();
		await expect(button).toHaveText("Kopiert");
		await expect(block.getByRole("status")).toHaveText("Code kopiert");
		const copied = await page.evaluate(() => navigator.clipboard.readText());
		expect(JSON.parse(copied).billingunit.reference.mscnumber).toBe(
			"123456789",
		);
		expect(copied).not.toContain("<span");
		await expect(button).toHaveText("Kopieren", { timeout: 3000 });
	});
});

test.describe("without JavaScript", () => {
	test.use({ javaScriptEnabled: false });

	test("every block is readable and Kopieren is hidden", async ({ page }) => {
		await page.goto(PATH);
		await expect(page.locator(".term .tl").last()).toBeVisible();
		await expect(page.locator(".rv").first()).toBeVisible();
		await expect(page.locator(".cp").first()).toBeHidden();
		await expect(current(page)).toHaveText("Überblick");
		await expect(page.locator("#ep-periods pre code .k").first()).toHaveText(
			'"billingunit"',
		);
	});
});

test.describe("with reduced motion", () => {
	test.use({ reducedMotion: "reduce" });

	test("nothing appears or moves", async ({ page }) => {
		await gotoHydrated(page);
		const animations = await page.evaluate(() =>
			[...document.querySelectorAll(".term .tl, .flow i")].map(
				(el) => getComputedStyle(el).animationName,
			),
		);
		expect(animations.length).toBe(11);
		for (const name of animations) expect(name).toBe("none");
		await expect(page.locator(".term .tl").first()).toHaveCSS("opacity", "1");
	});
});

test("the terminal's lines appear and the data lines move only in view", async ({
	page,
}) => {
	await gotoHydrated(page);
	await expect(page.locator(".term .tl").last()).toHaveCSS("opacity", "1", {
		timeout: 5000,
	});
	const state = () =>
		page.evaluate(() =>
			[...document.querySelectorAll(".flow i")].map(
				(el) => getComputedStyle(el).animationPlayState,
			),
		);
	expect(await state()).toEqual(["paused", "paused"]);
	await page.evaluate(() =>
		document.getElementById("ueberblick")!.scrollIntoView(),
	);
	await expect.poll(async () => (await state())[0]).toBe("running");
});

test("no console errors or hydration warnings", async ({ page }) => {
	const problems: string[] = [];
	page.on("console", (message) => {
		if (["error", "warning"].includes(message.type()))
			problems.push(message.text());
	});
	page.on("pageerror", (error) => problems.push(String(error)));
	await gotoHydrated(page);
	for (const id of ARTICLES) {
		await page.locator(`#${id}`).scrollIntoViewIfNeeded();
		await page.waitForTimeout(100);
	}
	await page.locator("section.trust").scrollIntoViewIfNeeded();
	expect(problems).toEqual([]);
});
