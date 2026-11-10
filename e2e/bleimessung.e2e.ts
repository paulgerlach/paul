import { expect, test, type Page } from "@playwright/test";
import { expectGated, GATED_ROBOTS } from "./launch";

// /bleimessung: no form; the example measurement and the check are example
// data and send nothing.

const PATH = "/bleimessung";

/** Waits for hydration, so the page's handlers run. */
const gotoHydrated = (page: Page) =>
	page.goto(PATH, { waitUntil: "networkidle" });

const wizard = (page: Page) =>
	page.getByRole("group", { name: "Check: Muss ich handeln?" });
const card = (page: Page) =>
	page.getByRole("group", { name: "Illustration einer Bleimessung" });

/** Clicks the answers in order. */
async function answer(page: Page, labels: string[]) {
	for (const label of labels)
		await wizard(page)
			.getByRole("button", { name: label, exact: true })
			.click();
}

test("renders with its own layout and SEO tags", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(
		"Bleimessung im Trinkwasser nach TrinkwV | Heidi",
	);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(page.locator("h1")).toContainText("Messen statt vermuten.");
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		GATED_ROBOTS,
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		/\/bleimessung$/,
	);
});

test("is in the sitemap once launched", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	expectGated(sitemap).toContain("/bleimessung</loc>");
});

test("the footer's and the nav's Bleimessung lead here", async ({ page }) => {
	await page.goto("/");
	await expect(
		page
			.locator("footer")
			.getByRole("link", { name: "Bleimessung", exact: true }),
	).toHaveAttribute("href", PATH);
	await expect(
		page
			.getByRole("navigation", { name: "Hauptnavigation" })
			.locator(`a[href="${PATH}"]`)
			.first(),
	).toBeAttached();
});

test("the CTAs lead to the check, the rules, /kontakt and /self-service", async ({
	page,
}) => {
	await page.goto(PATH);
	const main = page.locator("main");
	await expect(
		main.getByRole("link", { name: /^Muss ich handeln\?/ }),
	).toHaveAttribute("href", "#check");
	await expect(
		main.getByRole("link", { name: /^Was gilt/ }).first(),
	).toHaveAttribute("href", "#pflichten");
	const requests = main.getByRole("link", { name: /^Bleimessung anfragen/ });
	await expect(requests).toHaveCount(2);
	for (const link of await requests.all())
		await expect(link).toHaveAttribute("href", "/kontakt");
	await expect(
		main.getByRole("link", { name: /^Im Self-Service anfragen/ }),
	).toHaveAttribute("href", "/self-service");
	const list = main.getByRole("list", { name: "Leistungen von Heidi" });
	await expect(list.getByRole("link")).toHaveCount(5);
	await expect(
		list.getByRole("link", { name: "Hydraulischer Abgleich" }),
	).toHaveAttribute("href", "/hydraulischer-abgleich");
	await expect(list.locator('[aria-current="page"]')).toContainText(
		"Bleimessung",
	);
});

test("the first card counts the days since 12.1.2026", async ({ page }) => {
	await page.clock.setFixedTime(new Date("2026-11-10T12:00:00+01:00"));
	await page.emulateMedia({ reducedMotion: "reduce" });
	await gotoHydrated(page);
	const figure = page
		.locator(".ur")
		.getByText(/^\d[\d.]* Tage$/)
		.first();
	await figure.scrollIntoViewIfNeeded();
	await expect(figure).toHaveText("302 Tage");
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

test("the check leads to each result", async ({ page }) => {
	await gotoHydrated(page);
	const w = wizard(page);
	await w.scrollIntoViewIfNeeded();
	await expect(w).toContainText("Frage 1");

	await answer(page, ["Nein, danach"]);
	await expect(w.locator(".rk")).toHaveText("Geringes Risiko");
	await expect(w.locator("h3")).toHaveText("Bleileitungen unwahrscheinlich");
	await expect(w.locator("h3")).toBeFocused();

	await w.getByRole("button", { name: "Neu starten" }).click();
	await answer(page, ["Ja, vor 1973", "Nein oder nicht sicher"]);
	await expect(w).toContainText("Frage 3");
	await answer(page, ["Nein oder nicht sicher"]);
	await expect(w.locator(".rk")).toHaveText("Empfehlung");
	await expect(w.locator("h3")).toHaveText("Bleimessung empfohlen");

	await w.getByRole("button", { name: "Neu starten" }).click();
	await answer(page, ["Ja, vor 1973", "Nein oder nicht sicher", "Ja"]);
	await expect(w.locator(".rk")).toHaveText("Pflicht");
	await expect(w.locator("h3")).toHaveText(
		"Bleileitungen müssen entfernt werden",
	);
	await expect(w.getByRole("link", { name: /Was gilt/ })).toHaveAttribute(
		"href",
		"#pflichten",
	);
});

test("the measurement plays to its result, without a request", async ({
	page,
}) => {
	await page.clock.install();
	await gotoHydrated(page);
	const requests: string[] = [];
	page.on("request", (r) => {
		if (["fetch", "xhr"].includes(r.resourceType())) requests.push(r.url());
	});
	const c = card(page);
	await page.clock.runFor(1000);
	await expect(c.locator(".st")).toHaveText("Probenahme");
	await page.clock.runFor(4000);
	await expect(c.locator(".st")).toHaveText("Im Labor");
	await page.clock.runFor(4000);
	await expect(c.locator(".st")).toHaveText("Ab 2028 zu hoch");
	await expect(c.locator(".num b")).toContainText("7");

	await c.getByRole("button", { name: /18 µg\/l/ }).click();
	await page.clock.runFor(2000);
	await expect(c.locator(".st")).toHaveText("Grenzwert überschritten");
	await expect(c.getByRole("button", { name: /18 µg\/l/ })).toHaveAttribute(
		"aria-pressed",
		"true",
	);
	expect(requests).toEqual([]);
});

test("hydrates without console errors or warnings", async ({ page }) => {
	const messages: string[] = [];
	page.on("console", (message) => {
		if (["error", "warning"].includes(message.type()))
			messages.push(message.text());
	});
	page.on("pageerror", (error) => messages.push(error.message));
	await gotoHydrated(page);
	await page.mouse.wheel(0, 6000);
	await page.waitForTimeout(800);
	expect(messages).toEqual([]);
});

test.describe("without JS", () => {
	test.use({ javaScriptEnabled: false });

	test("the result reads, the check, examples and replay are hidden", async ({
		page,
	}) => {
		await page.goto(PATH);
		const c = card(page);
		await expect(c.locator(".st")).toHaveText("Ab 2028 zu hoch");
		await expect(c.locator(".num b")).toContainText("7");
		await expect(c.locator(".replay")).toBeHidden();
		await expect(c.locator(".types")).toBeHidden();
		await expect(wizard(page)).toBeHidden();
		await expect(page.locator("#pflichten dt")).toHaveCount(6);
	});
});

test.describe("with reduced motion", () => {
	test.use({ reducedMotion: "reduce" });

	test("nothing waits or moves", async ({ page }) => {
		await gotoHydrated(page);
		await page.waitForTimeout(1500);
		await expect(page.locator("main .rv-wait")).toHaveCount(0);
		await expect(card(page).locator(".st")).toHaveText("Ab 2028 zu hoch");
	});
});
