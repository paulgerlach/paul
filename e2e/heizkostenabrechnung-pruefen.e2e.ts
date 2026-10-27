import { expect, test, type Locator, type Page } from "@playwright/test";
import { GATED_ROBOTS, expectGated } from "./launch.ts";

// No form on this page: its "Demo buchen" lead to /demo.

const PATH = "/heizkostenabrechnung-pruefen";
/** 19.10.2026, noon in Berlin: the example's dates are fixed by it. */
const TODAY = new Date("2026-10-19T10:00:00Z");

async function hrefs(links: Locator) {
	return (await links.evaluateAll((els) =>
		els.map((el) => el.getAttribute("href")),
	)) as string[];
}

/** Waits for hydration, so the card's handlers run. */
const gotoHydrated = (page: Page) =>
	page.goto(PATH, { waitUntil: "networkidle" });

/** With the browser's date fixed to TODAY (timers keep running). */
async function gotoOnDay(page: Page) {
	await page.clock.setFixedTime(TODAY);
	await gotoHydrated(page);
}

const card = (page: Page) => page.locator("#checker .card");
const button = (scope: Page | Locator, name: string | RegExp) =>
	scope.getByRole("button", { name, exact: typeof name === "string" });
const figure = (page: Page) => card(page).locator(".big b");
const dialog = (page: Page) => page.getByRole("dialog");

/** "Beispiel ansehen", then the result after the upload and the scan (5.6 s). */
async function showExample(page: Page) {
	await button(page, "Beispiel ansehen").click();
	await expect(figure(page)).toBeVisible({ timeout: 10_000 });
}

const PDF = {
	name: "Abrechnung_2024.pdf",
	mimeType: "application/pdf",
	buffer: Buffer.from("%PDF-1.4"),
};
/** A 1×1 PNG. */
const PNG = {
	name: "Seite2.png",
	mimeType: "image/png",
	buffer: Buffer.from(
		"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
		"base64",
	),
};
const TXT = {
	name: "notiz.txt",
	mimeType: "text/plain",
	buffer: Buffer.from("x"),
};

test("renders with its own layout and SEO tags", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^Heizkostenabrechnung prüfen:/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(page.locator("h1")).toHaveText(
		"Heizkosten­abrechnung jetzt überprüfen.",
	);
	await expect(page.locator("#header")).toHaveCount(0);
	// noindex until LAUNCHED (its go-live gate), with a self-canonical
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		GATED_ROBOTS,
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		/\/heizkostenabrechnung-pruefen$/,
	);
	// The letter section only exists once a letter is made.
	await expect(page.locator("#schreiben")).toHaveCount(0);
});

test("is in the sitemap once launched", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	// Exact: the blog has a post /blog/heizkostenabrechnung-pruefen.
	expectGated(sitemap).toMatch(
		/<loc>https?:\/\/[^/<]+\/heizkostenabrechnung-pruefen<\/loc>/,
	);
});

for (const width of [375, 320]) {
	test(`has no horizontal overflow at ${width} px, also with the result and the letter`, async ({
		page,
	}) => {
		await page.setViewportSize({ width, height: 812 });
		await gotoHydrated(page);
		const overflow = () =>
			page.evaluate(
				() => document.documentElement.scrollWidth - window.innerWidth,
			);
		expect(await overflow()).toBeLessThanOrEqual(0);
		await showExample(page);
		expect(await overflow()).toBeLessThanOrEqual(0);
		await button(page, /Musterschreiben erstellen/).click();
		await expect(page.locator("#schreiben")).toBeVisible();
		expect(await overflow()).toBeLessThanOrEqual(0);
		// The paywall, over a result for own values
		await button(page, "Neue Abrechnung prüfen").click();
		await page.getByRole("tab", { name: "Werte eingeben" }).click();
		await button(page, /Ergebnis anzeigen/).click();
		await button(page, /Gründe und Details ansehen/).click();
		await expect(dialog(page)).toBeVisible();
		expect(await overflow()).toBeLessThanOrEqual(0);
	});
}

test("the footer and the other pages lead here, the internal links on", async ({
	page,
	request,
}) => {
	await page.goto(PATH);
	expect(
		await hrefs(
			page.locator("footer a", { hasText: /^Heizkostenabrechnungs-Checker$/ }),
		),
	).toEqual([PATH]);
	const links = new Set([
		...(await hrefs(page.locator('footer a[href^="/"]'))),
		...(await hrefs(page.locator('main a[href^="/"]'))),
	]);
	for (const href of links) {
		const response = await request.get(href);
		expect(response.status(), href).toBe(200);
	}
	for (const [path, text] of [
		["/heizkostenverordnung", "Heizkostenabrechnung prüfen"],
		["/selbstabrechnung", "Zum Heizkostenabrechnungs-Checker"],
		["/hilfe", "Abrechnung prüfen"],
		["/hilfe", "Zum Heizkostenabrechnungs-Checker"],
		["/plattform/mieterportal", "Zum Heizkostenabrechnungs-Checker"],
		["/plattform/verbrauchsinformation", "Zur Heizkosten-Prüfung"],
	]) {
		await page.goto(path);
		expect(
			await hrefs(page.locator("main a", { hasText: text })),
			`${path}: ${text}`,
		).toContain(PATH);
	}
});

test("the CTAs lead to the card, the figures, /heizkostenabrechnung and the booking page", async ({
	page,
}) => {
	await gotoHydrated(page);
	await expect(
		page.getByRole("link", { name: "Zu den Zahlen ↓" }),
	).toHaveAttribute("href", "#zahlen");
	await expect(page.locator("section#zahlen")).toHaveCount(1);
	await expect(
		page.getByRole("link", { name: /Eigene Abrechnung prüfen/ }),
	).toHaveAttribute("href", "#checker");
	await expect(page.locator("section#checker")).toHaveCount(1);
	await expect(
		page.getByRole("link", { name: /Heizkostenabrechnung mit Heidi/ }),
	).toHaveAttribute("href", "/heizkostenabrechnung");
	await expect(page.locator("section.final a.bk-next")).toHaveAttribute(
		"href",
		"#checker",
	);
	await expect(page.locator("a.ctab")).toHaveAttribute("href", "/demo");
	const demo = page
		.locator("main section")
		.filter({ hasText: "Mit Heidi entstehen diese Fehler" })
		.getByRole("link", { name: "Demo buchen" });
	await expect(demo).toHaveAttribute("href", "/demo");
});

test("the example: the upload, the scan, the sum, the points and the letter", async ({
	page,
}) => {
	await gotoOnDay(page);
	await button(page, "Beispiel ansehen").click();
	// The file card flies into the drop zone, then the scan ticks off.
	await expect(card(page).locator(".fly b")).toHaveText(
		"Heizkostenabrechnung_2024.pdf",
	);
	await expect(card(page).locator(".fly small")).toHaveText(
		"Hochgeladen · 2 Seiten",
	);
	const steps = card(page).locator(".steps li");
	await expect(steps).toHaveCount(3);
	await expect(steps.nth(2)).toHaveClass(/\bon\b/);
	await expect(card(page).locator(".tag")).toHaveText("Beispiel", {
		timeout: 10_000,
	});
	await expect(card(page).locator(".rh small")).toHaveText(
		"Mögliche Ersparnis",
	);
	await expect(figure(page)).toHaveText("310");
	await expect(card(page).locator(".rh p")).toHaveText(
		"Die Beträge überschneiden sich, deshalb zählt der höhere. 3 Punkte sprechen für Sie. Erstellen Sie jetzt Ihr Musterschreiben.",
	);
	// The example isn't locked: the points instead of the teaser.
	await expect(card(page).locator(".tz")).toHaveCount(0);
	const lines = card(page).locator(".lines li");
	await expect(lines).toHaveCount(6);
	await expect(lines.first()).toContainText("Abrechnung zu spät zugestellt");
	await expect(lines.first().locator(".amt")).toHaveText("310 €");
	await expect(lines.nth(4)).toContainText(
		"Einwendungen möglich bis 20.01.2027",
	);
	await button(page, /Musterschreiben erstellen/).click();
	const letter = page.locator("#schreiben textarea");
	await expect(letter).toBeVisible();
	await expect(letter).toHaveValue(
		/die mir am 20\.01\.2026 zugegangen ist, folgende Einwendungen:/,
	);
	await expect(letter).toHaveValue(
		/Ich mache daher einen Betrag von 310 € geltend\./,
	);
	// A new result hides the letter again.
	await button(page, "Werte ändern").click();
	await button(page, /Ergebnis anzeigen/).click();
	await expect(page.locator("#schreiben")).toHaveCount(0);
});

test("own values: the share in %, then the amount, the payment not set up", async ({
	page,
}) => {
	await gotoOnDay(page);
	await page.getByRole("tab", { name: "Werte eingeben" }).click();
	await expect(
		page.getByRole("tab", { name: "Werte eingeben" }),
	).toHaveAttribute("aria-selected", "true");
	await card(page).locator("select").selectOption("0");
	await button(page, /Ergebnis anzeigen/).click();
	await expect(card(page).locator(".rh small")).toHaveText("Kürzung möglich");
	await expect(figure(page)).toHaveText("15");
	await expect(card(page).locator(".big i")).toHaveText("%");
	await expect(card(page).locator(".tag")).toHaveCount(0);

	await button(page, "Werte ändern").click();
	await card(page).getByPlaceholder("z. B. 1.240").fill("1.000");
	await button(page, /Ergebnis anzeigen/).click();
	await expect(figure(page)).toHaveText("150");
	await expect(card(page).locator(".big i")).toHaveText("€");

	await button(page, /Gründe und Details ansehen/).click();
	await expect(dialog(page)).toHaveAccessibleName(
		"Heizkostenabrechnung geprüft",
	);
	const pay = button(dialog(page), "Zahlung wird gerade eingerichtet");
	await expect(pay).toBeDisabled();
	await expect(
		button(dialog(page), "Beispiel kostenlos freischalten"),
	).toHaveCount(0);
	await page.keyboard.press("Escape");
	await expect(dialog(page)).toBeHidden();
});

test("files start the flow; checking opens the values, nothing is sent", async ({
	page,
}) => {
	await gotoHydrated(page);
	const requests: string[] = [];
	page.on("request", (request) => {
		if (/^https?:/.test(request.url())) requests.push(request.url());
	});
	const input = card(page).locator("input[type=file]");
	await input.setInputFiles([PDF, PNG]);
	await expect(card(page).locator("figure")).toHaveCount(2);
	await expect(card(page).locator("figure img")).toHaveCount(1);
	await expect(card(page).locator(".drop b")).toHaveText(
		"Weitere Seite hinzufügen",
	);
	await expect(card(page).locator(".wh span")).toHaveText("Schritt 2 von 5");
	await input.setInputFiles(TXT);
	await expect(card(page).getByRole("alert")).toHaveText(
		"Bitte ein PDF oder ein Foto (JPG, PNG) hochladen.",
	);
	await button(card(page), "Entfernen: Seite2.png").click();
	await expect(card(page).locator("figure")).toHaveCount(1);

	await expect(button(card(page), "Weiter →")).toBeDisabled();
	await card(page).locator(".wz input[type=date]").fill("2026-02-10");
	await button(card(page), "Weiter →").click();
	await expect(card(page).locator(".wh span")).toHaveText("Schritt 3 von 5");
	await button(card(page), "Ja").click();
	await expect(card(page).locator(".wh span")).toHaveText("Schritt 4 von 5");
	await button(card(page), "Nein").click();
	await expect(card(page).locator(".wt")).toHaveText("Alles bereit");
	await expect(card(page).locator(".sum li")).toHaveText([
		/Abrechnung\s*Abrechnung_2024\.pdf/,
		/Erhalten am\s*10\.02\.2026/,
		/Funkablesung\s*Ja/,
		/Monatliche Verbrauchsinfo\s*Nein/,
	]);
	await expect(button(card(page), /Abrechnung prüfen/)).toBeFocused();
	await button(card(page), /Abrechnung prüfen/).click();
	await expect(card(page).locator(".note")).toHaveText(
		/^Die automatische Erkennung ist in dieser Ansicht nicht verfügbar\./,
	);
	// The flow's answers and date carried over.
	await expect(card(page).locator("input[type=date]").nth(2)).toHaveValue(
		"2026-02-10",
	);
	await expect(
		card(page)
			.getByRole("group", { name: "Zähler per Funk abgelesen?" })
			.getByRole("button", { name: "Ja" }),
	).toHaveAttribute("aria-pressed", "true");
	expect(requests).toEqual([]);

	await button(card(page), /Ergebnis anzeigen/).click();
	await button(card(page), "Neue Abrechnung prüfen").click();
	await expect(card(page).locator("figure")).toHaveCount(0);
	await expect(card(page).locator(".drop b")).toHaveText(
		"Abrechnung hierher ziehen",
	);
});

test("the figures switch the study, the errors filter", async ({ page }) => {
	await gotoHydrated(page);
	const numbers = page.locator("#zahlen");
	await numbers.scrollIntoViewIfNeeded();
	await expect(numbers.locator(".dbig b")).toHaveText("67");
	await numbers.getByRole("radio", { name: "co2online & Finanztip" }).click();
	await expect(numbers.locator(".dbig b")).toHaveText("80");
	await expect(numbers.locator(".dots i.on")).toHaveCount(80);
	await expect(numbers.locator(".src")).toHaveText(
		"Quelle: Stichprobe von co2online und Finanztip (2019)",
	);
	const errors = page.locator("#fehler");
	await expect(errors.locator("article")).toHaveCount(11);
	await errors.getByRole("radio", { name: "Kürzungsrecht" }).click();
	await expect(errors.locator("article")).toHaveCount(3);
	await expect(errors.locator("article .en")).toHaveText(["01", "03", "04"]);
	await errors.getByRole("radio", { name: "Rechnung" }).click();
	await expect(errors.locator("article")).toHaveCount(6);
});

test("the scan loop plays in view and ends in its finished state", async ({
	page,
}) => {
	await gotoHydrated(page);
	const scan = page.locator("#pruefung");
	await expect(scan.locator(".cnt b")).toHaveText("4");
	await scan.locator(".ms-grid").scrollIntoViewIfNeeded();
	// A pass starts from nothing.
	await expect(scan.locator(".rh small")).toHaveText(
		"Abrechnung wird gelesen …",
	);
	await expect(scan.locator(".rh small")).toHaveText(
		"4 Auffälligkeiten in dieser Abrechnung",
		{ timeout: 10_000 },
	);
	await expect(scan.locator(".it.in")).toHaveCount(4);
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

	test("the end states read, the card is hidden", async ({ page }) => {
		await page.goto(PATH);
		await expect(card(page)).toBeHidden();
		await expect(page.locator("#pruefung .cnt b")).toHaveText("4");
		await expect(page.locator("#pruefung .it.in")).toHaveCount(4);
		await expect(page.locator("#zahlen .dbig b")).toHaveText("67");
		await expect(page.locator("#zahlen .dots i.on")).toHaveCount(67);
		await expect(page.locator("#fehler article")).toHaveCount(11);
		await expect(page.locator("section.final a.bk-next")).toHaveAttribute(
			"href",
			"#checker",
		);
	});
});

test.describe("with reduced motion", () => {
	test.use({ reducedMotion: "reduce" });

	test("nothing waits or moves", async ({ page }) => {
		await gotoHydrated(page);
		await expect(page.locator("main .rv-wait")).toHaveCount(0);
		await page.locator("#pruefung .ms-grid").scrollIntoViewIfNeeded();
		await expect(page.locator("#pruefung .cnt b")).toHaveText("4");
		await button(page, "Beispiel ansehen").click();
		await expect(figure(page)).toHaveText(/^\d/);
		await expect(page.locator("#zahlen .dots i.on")).toHaveCount(67);
	});
});
