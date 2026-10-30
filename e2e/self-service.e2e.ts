import { expect, test, type Page } from "@playwright/test";
import { LAUNCHED } from "./launch.ts";

// The offer is stored in the local Supabase stack (playwright.config.ts) and
// its link goes to the local webhook sink, which answers 500 for emails at
// @sink-fails.example. The first "Weiter" of a visit is reported there too.

const PATH = "/self-service";
const WEBHOOK_EVENTS = "http://127.0.0.1:4199/events";

const testEmail = (name: string, domain = "example.com") =>
	`e2e-ss-${name}-${Date.now()}-${Math.round(Math.random() * 1e6)}@${domain}`;

type OfferEvent = {
	event_type: string;
	email: string;
	stage: string;
	offer_number: string;
	first_name: string;
	last_name: string;
	result_url: string;
};

async function eventsFor(page: Page, email: string) {
	const events: OfferEvent[] = await (
		await page.request.get(WEBHOOK_EVENTS)
	).json();
	return events.filter((event) => event.email === email);
}

type StartEvent = { event_type: string; step?: string; bill?: string };

async function startEvents(page: Page) {
	const events: StartEvent[] = await (
		await page.request.get(WEBHOOK_EVENTS)
	).json();
	return events.filter((event) => event.event_type === "selfservicestart");
}

/** 10 s behind, so the wizard's start passes the timing check. */
async function gotoCheck(page: Page) {
	await page.clock.install({ time: Date.now() - 10_000 });
	await page.goto(PATH, { waitUntil: "networkidle" });
	return page.locator("#check");
}

const PDF = {
	name: "abrechnung-2025.pdf",
	mimeType: "application/pdf",
	buffer: Buffer.from("%PDF-1.4\n%%EOF\n"),
};

/**
 * The short way: no bill (or one PDF with `bill`), no list, 6 new cold water
 * meters, 6 flats.
 */
async function toOffer(page: Page, email: string, bill = false) {
	const check = await gotoCheck(page);
	const title = check.locator("#ss-t");
	const next = () => check.locator(".ss-go").click();
	const card = (name: string | RegExp) =>
		check.locator(".ss-body").getByRole("button", { name }).first();

	await next();
	await expect(check.getByRole("alert")).toHaveText(
		"Bitte wählen Sie eine Antwort.",
	);
	if (bill) {
		await card(/^Ja, ich habe eine Heizkostenabrechnung/).click();
		await check.locator('input[type="file"]').setInputFiles(PDF);
		await check.getByLabel("Anmerkung (optional)").fill("Abrechnung 2025");
	} else await card(/^Nein, es liegt keine/).click();
	await expect(check.getByRole("alert")).toHaveText("");
	await next();
	await card(/^Nein, habe ich nicht/).click();
	await next();
	await card(/^Nein, es müssen Zähler/).click();
	await next();
	await card(/^Kaltwasserzähler/).click();
	await next();
	await expect(title).toHaveText("Heizung und gewünschte Leistungen");
	await card(/^Funkzähler, Fernauslesung und Heizkostenabrechnung/).click();
	await card(/^Mieten/).click();
	await next();
	await check.getByLabel("Anzahl der Wohn- und Gewerbeeinheiten").fill("6");
	await expect(check.locator(".u-gw")).toContainText(
		"Für 6 Einheiten planen wir vorläufig 1 Funk-Gateway.",
	);
	await next();
	await expect(title).toHaveText("Kaltwasserzähler bestimmen");
	await check.getByLabel("Wie viele baugleiche Geräte?").fill("6");
	await card(/^Kein Einbauplatz/).click();
	await next();
	await expect(check.getByRole("alert")).toHaveText(
		"Bitte ergänzen Sie: Absperrventil vorhanden?.",
	);
	await card(/^Ja\s*Vor und hinter/).click();
	await next();
	await expect(title).toHaveText("Montage");
	await check.getByRole("button", { name: "Überspringen" }).click();
	await expect(title).toHaveText("Weitere Leistungen");
	await check.getByRole("button", { name: "Überspringen" }).click();
	await expect(title).toHaveText("Ihre Kontaktdaten");
	await check.getByLabel("Vorname*").fill("Erika");
	await check.getByLabel("Nachname*").fill("Musterfrau");
	await check.getByLabel("E-Mail-Adresse*").fill(email);
	await check.locator(".cb input").check({ force: true });
	await next();
	await expect(title).toHaveText("Ihr persönlicher Zählercheck");
	// 6 × 27 rent, 6 × 5 service, 6 × 27,50 billing, 1 × 39 gateway.
	await expect(check.locator(".ss-tile.ink b")).toHaveText("396,00 €");
	await next();
	await check.getByLabel("Straße und Hausnummer*").fill("Hauptstraße 12");
	await check.getByLabel("PLZ*").fill("10115");
	await check.getByLabel("Ort*").fill("Berlin");
	await next();
	await expect(title).toHaveText("Ihr Angebot");
	// Two documents: Gerätemiete und Service (4 pages), Heizkostenabrechnung (3).
	await expect(check.locator(".dp-doc")).toHaveText([
		/Dokument 1 von 2\s*Gerätemiete und Service/,
		/Dokument 2 von 2\s*Heizkostenabrechnung/,
	]);
	await expect(check.locator(".dp-pg")).toHaveCount(7);
	await expect(check.locator(".ss-nx li.cur")).toHaveText(
		"3Angebot per E-Mail erhalten",
	);
	return check;
}

test("renders the page without errors", async ({ page }) => {
	const errors: string[] = [];
	page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
	await page.goto(PATH, { waitUntil: "networkidle" });
	await expect(page.locator("h1")).toContainText("Ihr Zählerbedarf.");
	await expect(page.locator("#check #ss-t")).toHaveText(
		"Liegt eine Heizkostenabrechnung vor?",
	);
	await expect(
		page.locator('meta[name="robots"][content*="noindex"]'),
	).toHaveCount(LAUNCHED ? 0 : 1);
	expect(errors).toEqual([]);
});

test("makes the offer and sends it on request", async ({ page }) => {
	const email = testEmail("ok");
	const check = await toOffer(page, email);

	await expect
		.poll(async () => (await eventsFor(page, email)).map((e) => e.stage))
		.toEqual(["created"]);
	await check
		.getByRole("button", { name: /Angebot per E-Mail erhalten/ })
		.click();
	await expect(check.locator("#ss-t")).toHaveText("Vielen Dank, Erika.");
	await expect(check.locator(".ss-conf h3")).toHaveText(
		"Ihr Angebot ist unterwegs.",
	);

	// Make.com hears of the offer once: the request sends nothing more.
	const events = await eventsFor(page, email);
	expect(events.map((e) => e.stage)).toEqual(["created"]);
	const [created] = events;
	expect(created).toMatchObject({
		event_type: "selfserviceoffer",
		first_name: "Erika",
		last_name: "Musterfrau",
		installer: "Selbst oder eigener Hausinstallateur (bevorzugt)",
		price_per_year: "396,00 €",
	});
	expect(created.offer_number).toMatch(/^\d{4}-AN\d{6}$/);
	// One stored offer, one link: /self-service-result/<22 characters>.
	expect(created.result_url).toMatch(
		/^http:\/\/localhost:4173\/self-service-result\/[A-Za-z0-9]{22}$/,
	);

	const res = await page.goto(created.result_url);
	expect(res?.headers()["cache-control"]).toBe("private, no-store");
	expect(res?.headers()["x-robots-tag"]).toBe("noindex, nofollow");
	await expect(page.locator("h1")).toHaveText(
		`Angebot ${created.offer_number}`,
	);
	await expect(page.getByText(/^Per E-Mail angefordert/)).toBeVisible();
	const row = (q: string) =>
		page
			.locator("dl > div")
			.filter({ has: page.getByText(q, { exact: true }) });
	await expect(row("Wie viele baugleiche Geräte?").locator("dd")).toHaveText(
		"6",
	);
	await expect(row("Ort").first().locator("dd")).toHaveText("Berlin");
	await expect(row("Pro Jahr (netto)").locator("dd")).toHaveText("396,00 €");
});

test("uploads the files and shows them on the result", async ({ page }) => {
	const email = testEmail("files");
	const check = await toOffer(page, email, true);
	await check
		.getByRole("button", { name: /Angebot per E-Mail erhalten/ })
		.click();
	await expect(check.locator(".ss-conf h3")).toHaveText(
		"Ihr Angebot ist unterwegs.",
	);
	const [created] = await eventsFor(page, email);

	await page.goto(created.result_url);
	const bill = page
		.locator("dl > div")
		.filter({ has: page.getByText("Abrechnung hochladen", { exact: true }) });
	const link = bill.getByRole("link", { name: /abrechnung-2025\.pdf/ });
	await expect(link).toBeVisible();
	const file = await page.request.get((await link.getAttribute("href"))!);
	expect(file.status()).toBe(200);
	expect((await file.body()).toString()).toBe(PDF.buffer.toString());
	await expect(
		page
			.locator("dl > div")
			.filter({ has: page.getByText("Anmerkung", { exact: true }) })
			.locator("dd"),
	).toHaveText("Abrechnung 2025");
});

test("answers 404 for an unknown result", async ({ page }) => {
	const res = await page.goto("/self-service-result/AAAAAAAAAAAAAAAAAAAAAA");
	expect(res?.status()).toBe(404);
});

test("names the mailbox when sending fails", async ({ page }) => {
	const check = await toOffer(page, testEmail("fail", "sink-fails.example"));
	await check
		.getByRole("button", { name: /Angebot per E-Mail erhalten/ })
		.click();
	await expect(check.locator(".ss-msg.err")).toContainText(
		"vertrieb@heidisystems.com",
	);
	await expect(check.locator("#ss-t")).toHaveText("Ihr Angebot");
});

test("reports the first Weiter once", async ({ page }) => {
	const check = await gotoCheck(page);
	const starts: string[] = [];
	page.on("request", (request) => {
		if (new URL(request.url()).pathname === "/api/self-service-start")
			starts.push(request.postData() ?? "");
	});
	// Blocked by the step's check: not a start yet.
	await check.locator(".ss-go").click();
	await expect(check.getByRole("alert")).toHaveText(
		"Bitte wählen Sie eine Antwort.",
	);
	const before = (await startEvents(page)).length;
	await check.getByRole("button", { name: /^Nein, es liegt keine/ }).click();
	await check.locator(".ss-go").click();
	await expect(check.locator("#ss-t")).toHaveText(
		"Haben Sie eine Geräteliste?",
	);
	await check.getByRole("button", { name: /^Nein, habe ich nicht/ }).click();
	await check.locator(".ss-go").click();
	await expect(check.locator("#ss-t")).not.toHaveText(
		"Haben Sie eine Geräteliste?",
	);
	expect(starts).toEqual(['{"step":"abr","bill":"nein"}']);
	// Parallel runs report too, so count up from before.
	await expect
		.poll(async () => (await startEvents(page)).length)
		.toBeGreaterThan(before);
	const [event] = await startEvents(page);
	expect(event).toEqual({
		event_type: "selfservicestart",
		timestamp: expect.any(String),
		step: "abr",
		bill: "nein",
		page: "/self-service",
	});
});

test("offers to resume a started check", async ({ page }) => {
	const check = await gotoCheck(page);
	await check.getByRole("button", { name: /^Nein, es liegt keine/ }).click();
	await check.locator(".ss-go").click();
	await expect(check.locator("#ss-t")).toHaveText(
		"Haben Sie eine Geräteliste?",
	);
	await page.reload({ waitUntil: "networkidle" });
	await check.getByRole("button", { name: "Fortsetzen" }).click();
	await expect(check.locator("#ss-t")).toHaveText(
		"Haben Sie eine Geräteliste?",
	);
});
