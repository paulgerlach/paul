import { expect, test, type Page } from "@playwright/test";

// The offer goes to the local webhook sink from playwright.config.ts; the sink
// answers 500 for emails at @sink-fails.example.

const PATH = "/self-service";
const WEBHOOK_EVENTS = "http://127.0.0.1:4199/events";

const testEmail = (name: string, domain = "example.com") =>
	`e2e-ss-${name}-${Date.now()}-${Math.round(Math.random() * 1e6)}@${domain}`;

type OfferEvent = {
	event_type: string;
	email: string;
	stage: string;
	offer_number: string;
	property: string;
	units: number;
	yearly_net: number;
	text: string;
};

async function eventsFor(page: Page, email: string) {
	const events: OfferEvent[] = await (
		await page.request.get(WEBHOOK_EVENTS)
	).json();
	return events.filter((event) => event.email === email);
}

/** 10 s behind, so the wizard's start passes the timing check. */
async function gotoCheck(page: Page) {
	await page.clock.install({ time: Date.now() - 10_000 });
	await page.goto(PATH, { waitUntil: "networkidle" });
	return page.locator("#check");
}

/** The short way: no bill, no list, 6 new cold water meters, 6 flats. */
async function toOffer(page: Page, email: string) {
	const check = await gotoCheck(page);
	const title = check.locator("#ss-t");
	const next = () => check.locator(".ss-go").click();
	const card = (name: string | RegExp) =>
		check.locator(".ss-body").getByRole("button", { name }).first();

	await next();
	await expect(check.getByRole("alert")).toHaveText(
		"Bitte wählen Sie eine Antwort.",
	);
	await card(/^Nein, es liegt keine/).click();
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
	await expect(check.locator(".dp-pg")).toHaveCount(4);
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
	).toHaveCount(1);
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

	const events = await eventsFor(page, email);
	expect(events.map((e) => e.stage)).toEqual(["created", "requested"]);
	const requested = events[1];
	expect(requested).toMatchObject({
		event_type: "selfserviceoffer",
		property: "Hauptstraße 12, 10115 Berlin",
		units: 6,
		yearly_net: 396,
	});
	expect(requested.offer_number).toMatch(/^\d{4}-AN\d{6}$/);
	expect(requested.text).toContain("Geräte: 6 × Kaltwasserzähler");
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
