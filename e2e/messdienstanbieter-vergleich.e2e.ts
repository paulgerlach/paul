import { expect, test, type Locator, type Page } from "@playwright/test";
import { GATED_ROBOTS, expectGated } from "./launch.ts";

const PATH = "/messdienst-vergleich";
async function hrefs(links: Locator) {
	return (await links.evaluateAll((els) =>
		els.map((el) => el.getAttribute("href")),
	)) as string[];
}

/** Waits for hydration, so the page's handlers run. */
const gotoHydrated = (page: Page) =>
	page.goto(PATH, { waitUntil: "networkidle" });

const step1 = (page: Page) => page.locator("section#vergleich");
const score = (page: Page) => step1(page).locator("aside.score");
const step2 = (page: Page) => page.locator("section#kosten");
const result = (page: Page) => step2(page).locator(".cout");

/** The toggle group of a criterion. */
const toggles = (page: Page, title: string) =>
	step1(page).getByRole("group", { name: `${title} bei Ihrem Anbieter` });

async function pick(page: Page, title: string, label: string) {
	await toggles(page, title)
		.getByRole("button", { name: label, exact: true })
		.click();
}

const TITLES = [
	"Fernablesung per Funk",
	"Alles aus einer Hand",
	"Monatliche Verbrauchsinfo",
	"Abrechnung per Klick",
	"Dashboard für alle Objekte",
	"Direkt in Ihrem ERP",
	"Klare Preise",
	"Feste Ansprechperson",
];

test("renders with its own layout and SEO tags", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^Messdienstanbieter-Vergleich:/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(page.locator("h1")).toHaveText(
		"Wie gut ist Ihr Messdienst wirklich?",
	);
	await expect(page.locator("#header")).toHaveCount(0);
	// noindex until LAUNCHED (its go-live gate), with a self-canonical
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		GATED_ROBOTS,
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		/\/messdienst-vergleich$/,
	);
});

test("is in the sitemap once launched", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	expectGated(sitemap).toContain("/messdienst-vergleich</loc>");
});

for (const width of [375, 320]) {
	test(`has no horizontal overflow at ${width} px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 812 });
		await gotoHydrated(page);
		for (const title of TITLES) await pick(page, title, "?");
		await step2(page)
			.getByRole("button", { name: /Eichfrist/ })
			.focus();
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - window.innerWidth,
		);
		expect(overflow).toBeLessThanOrEqual(0);
	});
}

test("the footer and the segment pages link here; the internal links resolve", async ({
	page,
	request,
}) => {
	await page.goto(PATH);
	expect(
		await hrefs(
			page.locator("footer a", { hasText: /^Messdienstanbieter-Vergleich$/ }),
		),
	).toEqual([PATH]);
	for (const other of [
		"/kunden/wohnungsunternehmen",
		"/kunden/asset-manager",
	]) {
		await page.goto(other);
		await expect(
			page.locator("main a", { hasText: "Messdienstanbieter vergleichen" }),
		).toHaveAttribute("href", PATH);
	}
	await page.goto(PATH);
	const links = new Set([
		...(await hrefs(page.locator('footer a[href^="/"]'))),
		...(await hrefs(page.locator('main a[href^="/"]'))),
	]);
	for (const href of links) {
		const response = await request.get(href);
		expect(response.status(), href).toBe(200);
	}
});

test("the CTAs lead to the steps, the signup form and the other pages", async ({
	page,
}) => {
	await gotoHydrated(page);
	await expect(
		page.getByRole("link", { name: /Vergleich starten/ }),
	).toHaveAttribute("href", "#vergleich");
	await expect(
		page.getByRole("link", { name: /Zum Kostenrechner/ }),
	).toHaveAttribute("href", "#kosten");
	await expect(
		page.getByRole("link", { name: /So funktioniert der Wechsel/ }),
	).toHaveAttribute("href", "/messdienst-wechseln");
	await expect(
		page.getByRole("link", { name: /Zur Umrüstpflicht/ }),
	).toHaveAttribute("href", "/fernablesung-umruesten");
	await expect(page.locator("main form")).toHaveCount(0);
	await expect(page.locator("section.final a.dcta")).toHaveAttribute(
		"href",
		"/demo",
	);
	await expect(page.locator("a.ctab")).toHaveAttribute("href", "/demo");
	const offers = page.locator("main a", {
		hasText:
			/^(Demo buchen|Mit Heidi vergleichen|Heidi-Angebot für diesen Bestand)/,
	});
	expect(await offers.count()).toBeGreaterThanOrEqual(4);
	expect(new Set(await hrefs(offers))).toEqual(new Set(["/demo"]));
});

test("picking scores the provider against Heidi", async ({ page }) => {
	await gotoHydrated(page);
	const s = score(page);
	await pick(page, TITLES[0], "Ja");
	await expect(
		toggles(page, TITLES[0]).getByRole("button", { name: "Ja" }),
	).toHaveAttribute("aria-pressed", "true");
	await expect(s.locator(".you b")).toHaveText("1 / 8");
	await expect(s.locator(".verdict")).toHaveText("7 Kriterien noch offen.");
	await pick(page, TITLES[1], "Nein");
	await pick(page, TITLES[2], "?");
	await expect(s.locator(".gl")).toHaveText("Hier liegt Heidi vorn");
	await expect(s.locator(".gaps div")).toHaveText([
		TITLES[1],
		`${TITLES[2]}bei Ihnen unklar`,
	]);
	// A second click clears the pick.
	await pick(page, TITLES[1], "Nein");
	await expect(
		toggles(page, TITLES[1]).getByRole("button", { name: "Nein" }),
	).toHaveAttribute("aria-pressed", "false");
	await expect(s.locator(".gaps div")).toHaveCount(1);
	for (const title of TITLES) {
		const yes = toggles(page, title).getByRole("button", { name: "Ja" });
		if ((await yes.getAttribute("aria-pressed")) !== "true") await yes.click();
	}
	await expect(s.locator(".you b")).toHaveText("8 / 8");
	await expect(s.locator(".verdict")).toHaveText(
		"Ihr Anbieter erfüllt alle acht Kriterien. Dann lohnt der Blick auf die Kosten pro Wohnung.",
	);
	await expect(s.locator(".gaps div")).toHaveCount(0);
	await pick(page, TITLES[7], "Nein");
	await expect(s.locator(".verdict")).toHaveText(
		"Heidi liegt bei 1 Kriterium vorn.",
	);
});

test("Heidi's bar and the costs count up when they scroll into view", async ({
	page,
}) => {
	await gotoHydrated(page);
	const heidi = score(page).locator(".h .bar i");
	expect(await heidi.evaluate((el) => el.style.width)).toBe("0%");
	await score(page).scrollIntoViewIfNeeded();
	await expect.poll(() => heidi.evaluate((el) => el.style.width)).toBe("100%");
	await expect(result(page).locator(".on b")).toHaveText("0,00");
	await result(page).scrollIntoViewIfNeeded();
	await expect(result(page).locator(".on b")).toHaveText("89,00");
});

test("typing recalculates the costs; nothing leaves the page", async ({
	page,
}) => {
	await gotoHydrated(page);
	const requests: string[] = [];
	page.on("request", (request) => {
		if (/^https?:/.test(request.url())) requests.push(request.url());
	});
	await result(page).scrollIntoViewIfNeeded();
	await expect(result(page).locator(".on b")).toHaveText("89,00");
	await step2(page).getByLabel("Wohnungen", { exact: true }).fill("200");
	await expect(result(page).locator(".tot b").first()).toHaveText("17.800 €");
	await step2(page).getByLabel("Miete je Heizkostenverteiler").fill("8,5");
	await expect(result(page).locator(".on b")).toHaveText("91,50");
	await expect(result(page).locator(".leg b").first()).toHaveText("42,50 €");
	await step2(page).getByLabel("Ablesung und Abrechnung je Wohnung").fill("");
	await expect(result(page).locator(".on b")).toHaveText("66,50");
	await expect(result(page).locator(".tot b")).toHaveText([
		"13.300 €",
		"79.800 €",
	]);
	await pick(page, TITLES[0], "Ja");
	expect(requests).toEqual([]);
});

test("the tooltip shows on focus and names its button", async ({ page }) => {
	await gotoHydrated(page);
	const tip = step2(page).getByRole("button", {
		name: "6 Jahre = Eichfrist für Wasser- und Wärmezähler",
	});
	const bubble = tip.getByRole("tooltip");
	await expect(bubble).toHaveCSS("opacity", "0");
	await tip.focus();
	await expect(bubble).toHaveCSS("opacity", "1");
});

test("hydrates without console errors or warnings", async ({ page }) => {
	const messages: string[] = [];
	page.on("console", (message) => {
		if (["error", "warning"].includes(message.type()))
			messages.push(message.text());
	});
	page.on("pageerror", (error) => messages.push(error.message));
	await gotoHydrated(page);
	await page.mouse.wheel(0, 4000);
	await page.waitForTimeout(800);
	expect(messages).toEqual([]);
});

test.describe("without JS", () => {
	test.use({ javaScriptEnabled: false });

	test("the server renders every end state", async ({ page }) => {
		await page.goto(PATH);
		const peek = page.locator(".peek");
		await expect(peek).toHaveAttribute("aria-hidden", "true");
		await expect(peek.locator(".pr")).toHaveCount(5);
		await expect(peek.locator(".pf b.y")).toHaveText("8 / 8");
		await expect(step1(page).locator(".c")).toHaveCount(8);
		await expect(score(page).locator(".you b")).toHaveText("0 / 8");
		await expect(score(page).locator(".verdict")).toHaveText(
			"Kreuzen Sie links an, was Ihr Anbieter heute leistet.",
		);
		await expect(result(page).locator(".on b")).toHaveText("89,00");
		await expect(result(page).locator(".leg b")).toHaveText([
			"40,00 €",
			"24,00 €",
			"25,00 €",
		]);
		await expect(result(page).locator(".tot b")).toHaveText([
			"10.680 €",
			"64.080 €",
		]);
	});

	test("the end states read, the toggles are hidden", async ({ page }) => {
		await page.goto(PATH);
		await expect(step1(page).locator(".c")).toHaveCount(8);
		await expect(toggles(page, TITLES[0])).toBeHidden();
		await expect(score(page).locator(".you")).toBeHidden();
		await expect(score(page).locator(".h b")).toHaveText("8 / 8");
		await expect(result(page).locator(".on b")).toHaveText("89,00");
	});
});

test.describe("with reduced motion", () => {
	test.use({ reducedMotion: "reduce" });

	test("nothing waits or moves", async ({ page }) => {
		await gotoHydrated(page);
		await expect(page.locator("main .rv-wait")).toHaveCount(0);
		expect(
			await score(page)
				.locator(".h .bar i")
				.evaluate((el) => el.style.width),
		).toBe("100%");
		await expect(result(page).locator(".on b")).toHaveText("89,00");
		await expect(page.locator(".peek .pr i.y").first()).toHaveCSS(
			"animation-name",
			"none",
		);
	});
});
