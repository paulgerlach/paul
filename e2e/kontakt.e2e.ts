import { expect, test, type Locator, type Page } from "@playwright/test";
import { GATED_ROBOTS, expectGated } from "./launch.ts";

// Contact messages go to the local webhook sink from playwright.config.ts;
// no database needed. The sink answers 500 for emails at @sink-fails.example.

const PATH = "/kontakt";
const WEBHOOK_EVENTS = "http://127.0.0.1:4199/events";
const BOOKING = "/demo";

const testEmail = (name: string, domain = "example.com") =>
	`e2e-kt-${name}-${Date.now()}-${Math.round(Math.random() * 1e6)}@${domain}`;

async function webhookFor(page: Page, email: string) {
	const events: { email: string }[] = await (
		await page.request.get(WEBHOOK_EVENTS)
	).json();
	return events.find((event) => event.email === email);
}

async function hrefs(links: Locator) {
	return (await links.evaluateAll((els) =>
		els.map((el) => el.getAttribute("href")),
	)) as string[];
}

/** With JS: 10 s behind, so the form's render time passes the timing check. */
async function gotoForm(page: Page) {
	await page.clock.install({ time: Date.now() - 10_000 });
	await page.goto(PATH, { waitUntil: "networkidle" });
	return page.locator("#schreiben form");
}

async function fillValid(form: Locator, email: string) {
	await form.locator('input[name="firstName"]').fill("Erika");
	await form.locator('input[name="lastName"]').fill("Musterfrau");
	await form.locator('input[name="email"]').fill(email);
	await form
		.locator('textarea[name="message"]')
		.fill("Wir möchten ein Angebot für unseren Bestand.");
	await form.locator('input[name="consent"]').check({ force: true });
}

const submit = (form: Locator) =>
	form.getByRole("button", { name: /Nachricht senden/ }).click();

const done = (page: Page) => page.locator("#schreiben .done");

test("renders with its own layout, SEO tags and FAQ data", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^Kontakt: Sprechen Sie mit uns/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(page.locator("h1")).toHaveText(
		"Sprechen Sie mit uns.Persönlich und direkt.",
	);
	// noindex until LAUNCHED (its go-live gate), with a self-canonical
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		GATED_ROBOTS,
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		/\/kontakt$/,
	);
	const jsonLd = await page
		.locator('script[type="application/ld+json"]')
		.textContent();
	expect(JSON.parse(jsonLd ?? "{}")).toMatchObject({
		"@type": "FAQPage",
		mainEntity: { length: 4 },
	});
	// Every answer starts closed, as in the design.
	await expect(page.locator("#faq details[open]")).toHaveCount(0);
});

test("is a page, no longer a redirect, and in the sitemap once launched", async ({
	request,
}) => {
	const response = await request.get(PATH, { maxRedirects: 0 });
	expect(response.status()).toBe(200);
	const sitemap = await (await request.get("/sitemap.xml")).text();
	expectGated(sitemap).toMatch(/<loc>https?:\/\/[^/]+\/kontakt<\/loc>/);
});

for (const width of [375, 320])
	test(`has no horizontal overflow at ${width} px, also with the form's marks`, async ({
		page,
	}) => {
		await page.setViewportSize({ width, height: 812 });
		const form = await gotoForm(page);
		const overflow = () =>
			page.evaluate(
				() => document.documentElement.scrollWidth - window.innerWidth,
			);
		expect(await overflow()).toBeLessThanOrEqual(0);
		await submit(form);
		await expect(form.locator(".fd.err, .cb.err")).toHaveCount(5);
		expect(await overflow()).toBeLessThanOrEqual(0);
	});

test("the footer and the nav lead here, every internal link resolves", async ({
	page,
	request,
}) => {
	await page.goto(PATH);
	const footer = page.locator("footer");
	await expect(footer.getByRole("link", { name: "Kontakt" })).toHaveAttribute(
		"href",
		PATH,
	);
	// Between "Sicherheit" and "API-Dokumentation".
	const texts = await footer.locator("a").allTextContents();
	const at = texts.indexOf("Kontakt");
	expect(texts.slice(at - 1, at + 2)).toEqual([
		"Sicherheit",
		"Kontakt",
		"API-Dokumentation",
	]);
	expect(await hrefs(page.locator(`nav.top a[href="${PATH}"]`))).toContain(
		PATH,
	);

	const links = new Set([
		...(await hrefs(page.locator('footer a[href^="/"]'))),
		...(await hrefs(page.locator('main a[href^="/"]'))),
	]);
	for (const href of links) {
		const response = await request.get(href);
		expect(response.status(), href).toBe(200);
	}
});

test("the CTAs lead to the form, the mailboxes and the booking", async ({
	page,
}) => {
	await page.goto(PATH, { waitUntil: "networkidle" });
	const main = page.locator("main");
	await expect(
		main
			.locator(".hv a")
			.evaluateAll((els) => els.map((el) => el.getAttribute("href"))),
	).resolves.toEqual([
		"mailto:vertrieb@heidisystems.com",
		"mailto:info@heidisystems.com",
		"mailto:presse@heidisystems.com",
	]);
	for (const name of [
		"Termin buchen",
		"Demo buchen →",
		"Buchen Sie einen Termin",
	])
		await expect(main.getByRole("link", { name, exact: true })).toHaveAttribute(
			"href",
			BOOKING,
		);
	await expect(page.locator("section.end a")).toHaveAttribute("href", BOOKING);
	// The nav's "Demo buchen" too.
	await expect(
		page.locator("nav.top").getByRole("link", { name: "Demo buchen" }),
	).toHaveAttribute("href", BOOKING);
	await expect(
		main.getByRole("link", { name: "Selbst erfassen im Self-Service →" }),
	).toHaveAttribute("href", "/self-service");

	await main.getByRole("link", { name: /Nachricht schreiben/ }).click();
	await expect(page).toHaveURL(/#schreiben$/);
	await expect(
		page.locator('#schreiben input[name="firstName"]'),
	).toBeFocused();
});

test.describe("the contact form", () => {
	test("marks the missing fields after a submit", async ({ page }) => {
		const form = await gotoForm(page);
		await expect(form.getByRole("alert")).toHaveText("");
		await submit(form);
		await expect(form.getByRole("alert")).toHaveText(
			"Bitte füllen Sie die markierten Felder aus.",
		);
		for (const name of ["firstName", "lastName", "email"])
			await expect(form.locator(`input[name="${name}"]`)).toHaveAttribute(
				"aria-invalid",
				"true",
			);
		await expect(form.locator('textarea[name="message"]')).toHaveAttribute(
			"aria-invalid",
			"true",
		);
		for (const name of ["phone", "company", "units"])
			await expect(form.locator(`input[name="${name}"]`)).not.toHaveAttribute(
				"aria-invalid",
			);
	});

	test("asks for the consent when only that is missing", async ({ page }) => {
		const form = await gotoForm(page);
		await fillValid(form, testEmail("consent"));
		await form.locator('input[name="consent"]').uncheck({ force: true });
		await submit(form);
		await expect(form.getByRole("alert")).toHaveText(
			"Bitte bestätigen Sie die Einwilligung.",
		);
		await expect(form.locator(".cb.err")).toHaveCount(1);
	});

	test("sends the message, shows the thanks and starts over", async ({
		page,
	}) => {
		const form = await gotoForm(page);
		const email = testEmail("ok");
		await form.getByText("Presse", { exact: true }).click();
		await fillValid(form, email);
		await form.locator('input[name="phone"]').fill("030 1234567");
		await form.locator('input[name="company"]').fill("Muster GmbH");
		await form.locator('input[name="units"]').fill("120");
		await submit(form);

		await expect(done(page)).toContainText(
			`Danke, Erika. Ihre Nachricht ist bei unserem Team angekommen. Wir melden uns bei Ihnen unter ${email} oder telefonisch.`,
		);
		await expect(
			done(page).getByRole("heading", { name: "Nachricht gesendet." }),
		).toBeFocused();
		const mailto = await done(page)
			.getByRole("link", { name: "Zusätzlich per E-Mail senden" })
			.getAttribute("href");
		expect(mailto).toMatch(/^mailto:presse@heidisystems\.com\?subject=/);
		expect(decodeURIComponent(mailto ?? "")).toContain("Presse · Muster GmbH");

		await expect
			.poll(() => webhookFor(page, email))
			.toMatchObject({
				event_type: "contactinquiry",
				topic: "Presse",
				mailbox: "presse",
				first_name: "Erika",
				last_name: "Musterfrau",
				phone: "030 1234567",
				company: "Muster GmbH",
				units: 120,
				message: "Wir möchten ein Angebot für unseren Bestand.",
				page: PATH,
			});
		const sent = (await webhookFor(page, email)) as Record<string, unknown>;
		for (const key of ["_t", "website", "consent"])
			expect(sent).not.toHaveProperty(key);

		await done(page)
			.getByRole("button", { name: "Weitere Nachricht schreiben" })
			.click();
		await expect(form.locator('input[name="firstName"]')).toBeFocused();
		await expect(form.locator('input[name="email"]')).toHaveValue("");
		await expect(form.locator('input[name="topic"]:checked')).toHaveValue(
			"Angebot anfragen",
		);
	});

	test("sends without the optional fields", async ({ page }) => {
		const form = await gotoForm(page);
		const email = testEmail("minimal");
		await fillValid(form, email);
		await submit(form);
		await expect(done(page)).toContainText(`unter ${email}.`);
		await expect.poll(() => webhookFor(page, email)).toBeDefined();
		const sent = (await webhookFor(page, email)) as Record<string, unknown>;
		expect(sent).toMatchObject({
			topic: "Angebot anfragen",
			mailbox: "vertrieb",
		});
		for (const key of ["phone", "company", "units"])
			expect(sent).not.toHaveProperty(key);
	});

	test("answers a filled honeypot with the thanks but sends nothing", async ({
		page,
	}) => {
		const form = await gotoForm(page);
		const email = testEmail("honeypot");
		await form.locator('input[name="website"]').fill("spam", { force: true });
		await fillValid(form, email);
		await submit(form);
		await expect(done(page)).toBeVisible();
		await page.waitForTimeout(500);
		expect(await webhookFor(page, email)).toBeUndefined();
	});

	test("offers the topic's mailbox when sending fails, keeping the values", async ({
		page,
	}) => {
		const form = await gotoForm(page);
		const email = testEmail("fail", "sink-fails.example");
		await form.getByText("Ich bin Kunde", { exact: true }).click();
		await fillValid(form, email);
		await submit(form);
		const alert = form.getByRole("alert");
		await expect(alert).toContainText("Das hat gerade nicht geklappt.");
		await expect(alert.getByRole("link")).toHaveText("info@heidisystems.com");
		await expect(alert.getByRole("link")).toHaveAttribute(
			"href",
			/^mailto:info@heidisystems\.com\?subject=/,
		);
		await expect(form.locator('input[name="email"]')).toHaveValue(email);
	});
});

test.describe("without JavaScript", () => {
	test("the form posts: errors first, then the thanks", async ({ browser }) => {
		// Without smooth scrolling to #schreiben, so the fields hold still.
		const context = await browser.newContext({
			javaScriptEnabled: false,
			reducedMotion: "reduce",
		});
		const page = await context.newPage();
		await page.goto(PATH);
		// The timing check runs first and uses the server's render time.
		await page.waitForTimeout(3100);
		await submit(page.locator("#schreiben form"));
		await expect(page).toHaveURL(/#schreiben$/);
		const form = page.locator("#schreiben form");
		await expect(form.getByRole("alert")).toHaveText(
			"Bitte füllen Sie die markierten Felder aus.",
		);
		await expect(form.locator("[aria-invalid=true]")).toHaveCount(5);

		const email = testEmail("nojs");
		await form.getByText("Partnerschaft", { exact: true }).click();
		await fillValid(form, email);
		// Enter submits too; a click fights the site's smooth scrolling here.
		await form.locator('input[name="email"]').press("Enter");
		await expect(done(page)).toContainText("Danke, Erika.");
		// "Weitere Nachricht schreiben" needs JS.
		await expect(
			done(page).getByRole("button", { name: "Weitere Nachricht schreiben" }),
		).toBeHidden();
		await expect
			.poll(() => webhookFor(page, email))
			.toMatchObject({
				event_type: "contactinquiry",
				topic: "Partnerschaft",
				mailbox: "vertrieb",
			});
		await context.close();
	});
});

test("no console errors or hydration warnings", async ({ page }) => {
	const problems: string[] = [];
	page.on("console", (message) => {
		if (["error", "warning"].includes(message.type()))
			problems.push(message.text());
	});
	page.on("pageerror", (error) => problems.push(String(error)));
	await page.goto(PATH, { waitUntil: "networkidle" });
	for (const selector of ["#schreiben", "#faq", "section.end"]) {
		await page.locator(selector).first().scrollIntoViewIfNeeded();
		await page.waitForTimeout(300);
	}
	expect(problems).toEqual([]);
});
