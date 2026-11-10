import { expect, test, type Page } from "@playwright/test";
import { expectGated, GATED_ROBOTS } from "./launch";

// /hydraulischer-abgleich: no form; the heat map and the check are example
// data and send nothing.

const PATH = "/hydraulischer-abgleich";

/** Waits for hydration, so the page's handlers run. */
const gotoHydrated = (page: Page) =>
	page.goto(PATH, { waitUntil: "networkidle" });

const wizard = (page: Page) =>
	page.getByRole("group", { name: "Check: Bin ich verpflichtet?" });
const card = (page: Page) =>
	page.getByRole("group", {
		name: "Illustration eines Gebäudes vor und nach dem hydraulischen Abgleich",
	});

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
		"Hydraulischer Abgleich nach § 60c GModG | Heidi",
	);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(page.locator("h1")).toContainText("Der hydraulische Abgleich.");
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		GATED_ROBOTS,
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		/\/hydraulischer-abgleich$/,
	);
});

test("is in the sitemap once launched", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	expectGated(sitemap).toContain("/hydraulischer-abgleich</loc>");
});

test("the footer's and the nav's Hydraulischer Abgleich lead here", async ({
	page,
}) => {
	await page.goto("/");
	await expect(
		page
			.locator("footer")
			.getByRole("link", { name: "Hydraulischer Abgleich", exact: true }),
	).toHaveAttribute("href", PATH);
	await expect(
		page
			.getByRole("navigation", { name: "Hauptnavigation" })
			.locator(`a[href="${PATH}"]`)
			.first(),
	).toBeAttached();
});

test("the CTAs lead to the check, the steps, /kontakt and /self-service", async ({
	page,
}) => {
	await page.goto(PATH);
	const main = page.locator("main");
	await expect(
		main.getByRole("link", { name: /^Bin ich verpflichtet\?/ }),
	).toHaveAttribute("href", "#check");
	await expect(
		main.getByRole("link", { name: /^So läuft der Abgleich ab/ }).first(),
	).toHaveAttribute("href", "#ablauf");
	const requests = main.getByRole("link", { name: /^Abgleich anfragen/ });
	await expect(requests).toHaveCount(2);
	for (const link of await requests.all())
		await expect(link).toHaveAttribute("href", "/kontakt");
	await expect(
		main.getByRole("link", { name: /^Im Self-Service anfragen/ }),
	).toHaveAttribute("href", "/self-service");
	const list = main.getByRole("list", { name: "Leistungen von Heidi" });
	await expect(list.getByRole("link")).toHaveCount(4);
	await expect(
		list.getByRole("link", { name: "Legionellenprüfung" }),
	).toHaveAttribute("href", "/legionellenpruefung");
	await expect(list.locator('[aria-current="page"]')).toContainText(
		"Hydraulischer Abgleich",
	);
});

test("the countdown names the days to 30.9.2027", async ({ page }) => {
	await page.clock.setFixedTime(new Date("2026-11-10T12:00:00+01:00"));
	await page.emulateMedia({ reducedMotion: "reduce" });
	await gotoHydrated(page);
	const figure = page
		.locator(".ur")
		.getByText(/^\d[\d.]* Tage$/)
		.first();
	await figure.scrollIntoViewIfNeeded();
	await expect(figure).toHaveText("324 Tage");
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
	await expect(w.getByRole("button", { name: "Zurück" })).toHaveCount(0);

	await answer(page, ["Nein, die Anlage ist älter"]);
	await expect(w).toContainText("Ergebnis");
	await expect(w.locator(".rk")).toHaveText("Empfehlung");
	await expect(w.locator("h3")).toHaveText(
		"Keine Pflicht nach § 60c, aber Heizungsprüfung beachten",
	);
	await expect(w.locator("h3")).toBeFocused();

	await w.getByRole("button", { name: "Neu starten" }).click();
	await answer(page, ["Ja", "Bis zu 5"]);
	await expect(w.locator(".rk")).toHaveText("Keine Pflicht");

	await w.getByRole("button", { name: "Neu starten" }).click();
	await answer(page, ["Ja", "6 oder mehr"]);
	await expect(w).toContainText("Frage 3");
	await w.getByRole("button", { name: "Zurück" }).click();
	await expect(w).toContainText("Frage 2");
	await answer(page, ["6 oder mehr", "Ja"]);
	await expect(w.locator(".rk")).toHaveText("Pflicht");
	await expect(w.locator("h3")).toHaveText(
		"Hydraulischer Abgleich ist Pflicht",
	);
	await expect(
		w.getByRole("link", { name: /So läuft der Abgleich ab/ }),
	).toHaveAttribute("href", "#ablauf");
});

test("the balancing plays and ends balanced, without a request", async ({
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
	await expect(c.locator(".st")).toHaveText("Vorher");
	await expect(c).toContainText("70 °C");
	await expect(c).toContainText("Stufe 3");
	await page.clock.runFor(3000);
	await expect(c.locator(".st")).toHaveText("Heizlast");
	await page.clock.runFor(4000);
	await expect(c.locator(".st")).toHaveText("Einstellung");
	await page.clock.runFor(10_000);
	await expect(c.locator(".st")).toHaveText("Abgeglichen");
	await expect(c).toContainText("Stufe 2");
	await expect(c).toContainText(
		"Gleichmäßig warm bei niedrigerer Vorlauftemperatur",
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

	test("the end states read, the check and the replay are hidden", async ({
		page,
	}) => {
		await page.goto(PATH);
		const c = card(page);
		await expect(c.locator(".st")).toHaveText("Abgeglichen");
		await expect(c).toContainText("55 °C");
		await expect(c.locator(".replay")).toBeHidden();
		await expect(wizard(page)).toBeHidden();
		await expect(page.locator("#pflichten dt")).toHaveCount(7);
	});
});

test.describe("with reduced motion", () => {
	test.use({ reducedMotion: "reduce" });

	test("nothing waits or moves", async ({ page }) => {
		await gotoHydrated(page);
		await page.waitForTimeout(1500);
		await expect(page.locator("main .rv-wait")).toHaveCount(0);
		await expect(card(page).locator(".st")).toHaveText("Abgeglichen");
	});
});
