import { expect, test, type Page } from "@playwright/test";
import { expectGated, GATED_ROBOTS } from "./launch";

// /legionellenpruefung: no form; the lab result card and the check are
// example data and send nothing.

const PATH = "/legionellenpruefung";

/** Waits for hydration, so the page's handlers run. */
const gotoHydrated = (page: Page) =>
	page.goto(PATH, { waitUntil: "networkidle" });

const wizard = (page: Page) =>
	page.getByRole("group", { name: "Check: Bin ich prüfpflichtig?" });
const card = (page: Page) =>
	page.getByRole("group", { name: "Illustration eines Legionellen-Befunds" });

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
		"Legionellenprüfung nach Trinkwasserverordnung | Heidi",
	);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(page.locator("h1")).toContainText(
		"Fristgerecht und dokumentiert.",
	);
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		GATED_ROBOTS,
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		/\/legionellenpruefung$/,
	);
});

test("is in the sitemap once launched", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	expectGated(sitemap).toContain("/legionellenpruefung</loc>");
});

test("the footer's and the nav's Legionellenprüfung lead here", async ({
	page,
}) => {
	await page.goto("/");
	await expect(
		page
			.locator("footer")
			.getByRole("link", { name: "Legionellenprüfung", exact: true }),
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
		main.getByRole("link", { name: /^Bin ich prüfpflichtig\?/ }),
	).toHaveAttribute("href", "#check");
	await expect(
		main.getByRole("link", { name: /^So läuft die Prüfung ab/ }).first(),
	).toHaveAttribute("href", "#ablauf");
	await expect(
		main.getByRole("link", { name: /^Prüfung beauftragen/ }),
	).toHaveAttribute("href", "/kontakt");
	await expect(
		main.getByRole("link", { name: /^Prüfung anfragen/ }),
	).toHaveAttribute("href", "/kontakt");
	await expect(
		main.getByRole("link", { name: /^Im Self-Service anfragen/ }),
	).toHaveAttribute("href", "/self-service");
	const list = main.getByRole("list", { name: "Leistungen von Heidi" });
	await expect(list.getByRole("link")).toHaveCount(5);
	await expect(list.getByRole("link", { name: "Bleimessung" })).toHaveAttribute(
		"href",
		"/bleimessung",
	);
	await expect(
		list.getByRole("link", { name: "Hydraulischer Abgleich" }),
	).toHaveAttribute("href", "/hydraulischer-abgleich");
	await expect(list.locator('[aria-current="page"]')).toContainText(
		"Legionellenprüfung",
	);
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
	await expect(w).toContainText("Frage 1 von 5");
	await expect(w.getByRole("button", { name: "Zurück" })).toHaveCount(0);

	await answer(page, ["Nein, dezentral in jeder Wohnung"]);
	await expect(w).toContainText("Ergebnis");
	await expect(w.locator(".rk")).toHaveText("Keine Pflicht");
	await expect(w.locator("h3")).toHaveText("Voraussichtlich keine Prüfpflicht");
	await expect(w.locator("h3")).toBeFocused();

	await w.getByRole("button", { name: "Neu starten" }).click();
	await answer(page, ["Ja, zentrale Anlage", "1 oder 2 Wohnungen"]);
	await expect(w.locator("h3")).toHaveText("Keine Prüfpflicht");

	await w.getByRole("button", { name: "Neu starten" }).click();
	await answer(page, ["Ja, zentrale Anlage", "3 oder mehr Wohnungen"]);
	await expect(w).toContainText("Frage 3 von 5");
	await w.getByRole("button", { name: "Zurück" }).click();
	await expect(w).toContainText("Frage 2 von 5");
	await answer(page, ["3 oder mehr Wohnungen", "Ja", "Ja", "Ja"]);
	await expect(w.locator(".rk")).toHaveText("Pflicht");
	await expect(w.locator("h3")).toHaveText("Prüfpflichtig");
	await expect(
		w.getByRole("link", { name: /So läuft die Prüfung ab/ }),
	).toHaveAttribute("href", "#ablauf");
});

test("the example buttons switch the result without a request", async ({
	page,
}) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await gotoHydrated(page);
	const requests: string[] = [];
	page.on("request", (r) => {
		if (["fetch", "xhr"].includes(r.resourceType())) requests.push(r.url());
	});
	const c = card(page);
	await expect(c.locator(".st")).toHaveText("Maßnahmenwert erreicht");
	await expect(c.locator(".pt .v")).toHaveText(["40", "9", "230", "86"]);
	await c.getByRole("button", { name: /^Unauffällig/ }).click();
	await expect(c.getByRole("button", { name: /^Unauffällig/ })).toHaveAttribute(
		"aria-pressed",
		"true",
	);
	await expect(c.locator(".st")).toHaveText("Unauffällig");
	await expect(c.locator(".pt .v")).toHaveText(["3", "0", "12", "6"]);
	await expect(c).toContainText(
		"Alle Proben unter dem technischen Maßnahmenwert",
	);
	expect(requests).toEqual([]);
});

test("the sampling plays and ends in the evaluation", async ({ page }) => {
	await page.clock.install();
	await gotoHydrated(page);
	const c = card(page);
	await page.clock.runFor(1000);
	await expect(c.locator(".st")).toHaveText("Probenahme");
	await expect(
		c.getByRole("button", { name: "Ablauf ansehen" }),
	).toBeDisabled();
	await page.clock.runFor(10_000);
	await expect(c.locator(".st")).toHaveText("Im Labor");
	await page.clock.runFor(8_000);
	await expect(c.locator(".st")).toHaveText("Maßnahmenwert erreicht");
	await expect(c.locator(".pt .v")).toHaveText(["40", "9", "230", "86"]);
	await expect(c.getByRole("button", { name: "Ablauf ansehen" })).toBeEnabled();
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

	test("the end states read, the check and the buttons are hidden", async ({
		page,
	}) => {
		await page.goto(PATH);
		const c = card(page);
		await expect(c.locator(".st")).toHaveText("Maßnahmenwert erreicht");
		await expect(c.locator(".pt .v")).toHaveText(["40", "9", "230", "86"]);
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
		await expect(card(page).locator(".st")).toHaveText(
			"Maßnahmenwert erreicht",
		);
	});
});
