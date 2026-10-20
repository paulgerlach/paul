import { expect, test, type Locator, type Page } from "@playwright/test";

// Both forms' inquiries go to the local webhook sink from playwright.config.ts;
// no database needed. The sink answers 500 for emails at @sink-fails.example.

const PATH = "/partnerschaften";
const WEBHOOK_EVENTS = "http://127.0.0.1:4199/events";
const KONTAKT = "#kontakt";

const testEmail = (name: string, domain = "example.com") =>
	`e2e-ps-${name}-${Date.now()}-${Math.round(Math.random() * 1e6)}@${domain}`;

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

/** Waits for hydration, so the loops are attached. */
const gotoHydrated = (page: Page) =>
	page.goto(PATH, { waitUntil: "networkidle" });

/** With JS: 10 s behind, so the form's render time passes the timing check. */
async function gotoForm(page: Page) {
	await page.clock.install({ time: Date.now() - 10_000 });
	await gotoHydrated(page);
	return page.locator("#kontakt form");
}

async function fillValid(form: Locator, email: string) {
	await form.locator('input[name="company"]').fill("Muster Software GmbH");
	await form.locator('input[name="name"]').fill("Erika Musterfrau");
	await form.locator('input[name="email"]').fill(email);
	await form.locator('select[name="kind"]').selectOption("Softwareanbieter");
	await form.locator('input[name="consent"]').check();
}

const submit = (form: Locator) =>
	form.getByRole("button", { name: /Partnerschaft anfragen/ }).click();

/** The first audience card with the form "Anbindung anfragen". */
const card = (page: Page) => page.locator("#anbindung");

async function fillCard(form: Locator, email: string) {
	await form.locator('input[name="company"]').fill("Muster Software GmbH");
	await form.locator('input[name="name"]').fill("Erika Musterfrau");
	await form.locator('input[name="email"]').fill(email);
	await form.locator('select[name="software"]').selectOption("CRM");
	await form.locator('input[name="consent"]').check();
}

const submitCard = (form: Locator) =>
	form.getByRole("button", { name: /Anfrage senden/ }).click();

const listItems = (page: Page) => page.locator("figure.mid .li");
const pills = (page: Page) => page.locator("figure.mid .st");
const phone = (page: Page) => page.locator(".tile .phone");
const billSum = (page: Page) => page.locator(".bill .sum b");
const gridNote = (page: Page) => page.locator(".tile .note span").last();
const video = (page: Page) => page.locator("section.end video");
const paused = (page: Page) => video(page).evaluate((v) => v.paused);

test("renders with its own layout, SEO tags and FAQ data", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(
		/^Partnerschaften: Mit Heidi zusammenarbeiten/,
	);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(
		page.getByRole("heading", {
			level: 1,
			name: "Partnerschaften mit Heidi Systems",
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
		/\/partnerschaften$/,
	);

	const jsonLd = await page
		.locator('script[type="application/ld+json"]')
		.textContent();
	const faq = JSON.parse(jsonLd ?? "{}");
	expect(faq["@type"]).toBe("FAQPage");
	expect(faq.mainEntity).toHaveLength(5);
});

test("is not in the sitemap yet", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	// The host followed by the path, exactly.
	expect(sitemap).not.toMatch(/<loc>https?:\/\/[^/]+\/partnerschaften<\/loc>/);
});

for (const width of [375, 320])
	test(`has no horizontal overflow at ${width} px, also with both forms' marks`, async ({
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
		await expect(form.locator(".bad")).toHaveCount(5);
		await submitCard(card(page).locator("form"));
		await expect(card(page).locator(".err")).toHaveCount(5);
		expect(await overflow()).toBeLessThanOrEqual(0);
	});

test("the footer, /neuigkeiten and /nachfolge lead here, every internal link resolves", async ({
	page,
	request,
}) => {
	await page.goto("/neuigkeiten");
	await expect(
		page.locator("a.card", { hasText: /^.*Partnerschaften: Mit Heidi/ }),
	).toHaveAttribute("href", PATH);
	await page.goto("/nachfolge");
	await expect(
		page.locator("main a", { hasText: "Zu den Partnerschaften" }),
	).toHaveAttribute("href", PATH);

	await page.goto(PATH);
	await expect(
		page.locator("footer").getByRole("link", { name: "Partnerschaften" }),
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

test("CTAs lead to the contact form, the rows, the FAQ and the partner pages", async ({
	page,
}) => {
	await page.goto(PATH);
	// No signup form on this page.
	await expect(page.locator("#start")).toHaveCount(0);
	await expect(page.locator("#kontakt form")).toHaveCount(1);
	await expect(page.locator("#anbindung form")).toHaveCount(1);

	await expect(
		page.locator("main a", { hasText: /Kontakt aufnehmen/i }),
	).toHaveAttribute("href", KONTAKT);
	const ask = page.locator("main a", { hasText: /Partnerschaft anfragen/i });
	// Four rows.
	await expect(ask).toHaveCount(4);
	for (const href of await hrefs(ask)) expect(href).toBe(KONTAKT);
	await expect(
		page.locator("main a", { hasText: /Mehr erfahren/i }),
	).toHaveAttribute("href", "#inhalt");
	await expect(page.locator("#inhalt")).toHaveCount(1);

	const faqLinks = page.locator("#inhalt a", { hasText: /Häufige Fragen/i });
	await expect(faqLinks).toHaveCount(4);
	for (const href of await hrefs(faqLinks)) expect(href).toBe("#faq");
	await expect(page.locator("#faq")).toHaveCount(1);

	const link = (scope: string, text: string) =>
		page.locator(`${scope} a`, { hasText: text });
	await expect(
		link("#inhalt", "Mehr für Installationsbetriebe"),
	).toHaveAttribute("href", "/installationspartner");
	await expect(link("#inhalt", "Mehr zur Nachfolge")).toHaveAttribute(
		"href",
		"/nachfolge",
	);
	await expect(link("#inhalt", "Heidi API")).toHaveAttribute(
		"href",
		"/api-dokumentation",
	);
	await expect(link("#faq", "API-Dokumentation")).toHaveAttribute(
		"href",
		"/api-dokumentation",
	);
	await expect(link("section.who", "Softwarepartner werden")).toHaveAttribute(
		"href",
		"/softwarepartner",
	);
	await expect(
		link("section.who", "Installationspartner werden"),
	).toHaveAttribute("href", "/installationspartner");
	await expect(link("#faq", "Softwarepartner")).toHaveAttribute(
		"href",
		"/softwarepartner",
	);
	await expect(link("#faq", "Nachfolge")).toHaveAttribute("href", "/nachfolge");
	await expect(link("#faq", "Mehr zu Sicherheit")).toHaveAttribute(
		"href",
		"/sicherheit",
	);

	// The design's demo CTAs lead to the page's own form.
	await expect(
		page.locator("section.end a", { hasText: "Demo buchen" }),
	).toHaveAttribute("href", KONTAKT);
	await expect(
		page.locator("section.trust a", { hasText: "Demo buchen" }),
	).toHaveAttribute("href", KONTAKT);
	await expect(page.locator("a.ctab")).toHaveAttribute("href", KONTAKT);
	await expect(
		page.locator("nav.top").getByRole("link", { name: "Bestand prüfen" }),
	).toHaveAttribute("href", "/messdienstwechsel");
});

test.describe("without JavaScript", () => {
	test.use({ javaScriptEnabled: false });

	test("every block is in its end state", async ({ page }) => {
		await page.goto(PATH);
		await expect(pills(page)).toHaveText([
			"Verbunden",
			"Zertifiziert",
			"Vernetzt",
			"Vereinbart",
		]);
		await expect(page.locator(".doc.ok .dr.on")).toHaveCount(4);
		await expect(phone(page)).toHaveClass(/\bs2\b/);
		await expect(phone(page)).toContainText("12 Wohnungen");
		await expect(page.locator(".cal li")).toHaveCount(9);
		await expect(page.locator(".cal li.done")).toHaveCount(8);
		await expect(page.locator(".cal li.now")).toHaveText(
			/Ihre Idee\s*im Gespräch/,
		);
		await expect(gridNote(page)).toHaveText("Ihre Idee im Gespräch");
		await expect(billSum(page)).toHaveText("gering");
		await expect(page.locator("section.num .fig b")).toHaveText([
			"VDIV",
			"DEUMESS",
			"bved",
			"15.000+",
			"DE",
		]);
		await expect(video(page)).toHaveAttribute("poster", /.+/);
		await expect(page.locator("#anbindung form")).toBeVisible();
	});

	test("the form posts: errors first, then the thanks", async ({ browser }) => {
		// Without smooth scrolling to #kontakt, so the fields hold still.
		const context = await browser.newContext({
			javaScriptEnabled: false,
			reducedMotion: "reduce",
		});
		const page = await context.newPage();
		await page.goto(PATH);
		// The timing check runs first and uses the server's render time.
		await page.waitForTimeout(3100);
		await submit(page.locator("#kontakt form"));
		await expect(page).toHaveURL(/#kontakt$/);
		const form = page.locator("#kontakt form");
		await expect(form.getByRole("alert")).toHaveText(
			"Bitte füllen Sie die markierten Felder aus.",
		);
		await expect(form.locator("[aria-invalid=true]")).toHaveCount(5);

		const email = testEmail("nojs");
		await fillValid(form, email);
		await form.locator('select[name="kind"]').selectOption("Sonstiges");
		// Enter submits too; a click fights the site's smooth scrolling here.
		await form.locator('input[name="company"]').press("Enter");
		await expect(page.locator("#kontakt form").getByRole("status")).toHaveText(
			"Danke, Erika Musterfrau! Wir melden uns bei Ihnen.",
		);
		await expect
			.poll(() => webhookFor(page, email))
			.toMatchObject({
				event_type: "partnershipinquiry",
				kind: "Sonstiges",
			});
		await context.close();
	});

	test("the card form posts: errors first, then the thank-you panel", async ({
		browser,
	}) => {
		const context = await browser.newContext({
			javaScriptEnabled: false,
			reducedMotion: "reduce",
		});
		const page = await context.newPage();
		await page.goto(PATH);
		await page.waitForTimeout(3100);
		await submitCard(card(page).locator("form"));
		await expect(page).toHaveURL(/#anbindung$/);
		await expect(card(page).getByRole("alert")).toHaveText(
			"Bitte füllen Sie die markierten Felder aus.",
		);
		await expect(card(page).locator("[aria-invalid=true]")).toHaveCount(5);
		// The contact form stays as it was.
		await expect(page.locator("#kontakt .bad")).toHaveCount(0);

		const email = testEmail("card-nojs");
		await fillCard(card(page).locator("form"), email);
		await card(page).locator('input[name="company"]').press("Enter");
		await expect(card(page).getByRole("status")).toContainText(
			"Danke für Ihre Anfrage.",
		);
		await expect
			.poll(() => webhookFor(page, email))
			.toMatchObject({ event_type: "connectioninquiry", software: "CRM" });
		await context.close();
	});
});

test.describe("with reduced motion", () => {
	test.use({ reducedMotion: "reduce" });

	test("every block shows its end state and stays, the video never plays", async ({
		page,
	}) => {
		await page.clock.install();
		await gotoHydrated(page);
		await page.clock.runFor(10_000);
		await expect(pills(page).first()).toHaveText("Verbunden");
		await expect(page.locator("figure.mid .li.ok")).toHaveCount(4);
		await page.locator(".cal").scrollIntoViewIfNeeded();
		await page.clock.runFor(8000);
		await expect(page.locator(".cal li.done")).toHaveCount(8);
		await page.locator(".bill").scrollIntoViewIfNeeded();
		await page.clock.runFor(8000);
		await expect(billSum(page)).toHaveText("gering");
		await video(page).scrollIntoViewIfNeeded();
		await page.waitForTimeout(500);
		expect(await paused(page)).toBe(true);
	});
});

test("the hero list replays after its first interval", async ({ page }) => {
	await page.clock.install();
	await gotoHydrated(page);
	await expect(page.locator("figure.mid .li.ok")).toHaveCount(4);
	const firstClass = () => listItems(page).first().getAttribute("class");
	// The installed clock also runs in real time, so step towards the
	// first replay (9 s): amber again, with the first status.
	await page.clock.runFor(6000);
	await expect
		.poll(async () => {
			await page.clock.runFor(400);
			return firstClass();
		})
		.not.toMatch(/\bok\b/);
	await expect(pills(page).first()).toHaveText("In Abstimmung");
	await page.clock.runFor(1500);
	await expect(listItems(page).first()).toHaveClass(/\bok\b/);
	await expect(pills(page).first()).toHaveText("Verbunden");
	await page.clock.runFor(2500);
	await expect(page.locator("figure.mid .li.ok")).toHaveCount(4);
});

test("the tiles loop while in view", async ({ page }) => {
	await page.clock.install();
	await gotoHydrated(page);

	await phone(page).scrollIntoViewIfNeeded();
	await page.clock.runFor(100);
	await expect(phone(page)).not.toHaveClass(/\bs1\b/);
	await page.clock.runFor(1900);
	await expect(phone(page)).toHaveClass(/\bs2\b/);

	await page.locator(".cal").scrollIntoViewIfNeeded();
	await page.clock.runFor(400);
	await expect(page.locator(".cal li.done")).toHaveCount(1);
	await expect(gridNote(page)).toHaveText("VDIV dabei");
	await page.clock.runFor(3100);
	await expect(page.locator(".cal li.done")).toHaveCount(8);
	await expect(gridNote(page)).toHaveText("Ihre Idee im Gespräch");

	await page.locator(".bill").scrollIntoViewIfNeeded();
	await page.clock.runFor(200);
	await expect(billSum(page)).toHaveText("hoch");
	await page.clock.runFor(2600);
	await expect(billSum(page)).toHaveText("gering");
});

test("the closing card's video plays only while in view", async ({ page }) => {
	await gotoHydrated(page);
	expect(await paused(page)).toBe(true);
	await video(page).scrollIntoViewIfNeeded();
	await expect.poll(() => paused(page)).toBe(false);
	await page.evaluate(() => window.scrollTo(0, 0));
	await expect.poll(() => paused(page)).toBe(true);
});

test.describe("the contact form", () => {
	test("marks the missing fields after a submit", async ({ page }) => {
		const form = await gotoForm(page);
		await expect(form.getByRole("alert")).toHaveText("");
		await submit(form);
		await expect(form.getByRole("alert")).toHaveText(
			"Bitte füllen Sie die markierten Felder aus.",
		);
		await expect(form.locator(".bad")).toHaveCount(5);
		await expect(form.locator('select[name="kind"]')).toHaveAttribute(
			"aria-invalid",
			"true",
		);
		// The optional fields aren't marked.
		for (const field of ['input[name="phone"]', 'textarea[name="message"]'])
			await expect(form.locator(field)).not.toHaveAttribute("aria-invalid");
	});

	test("marks a phone number that isn't one", async ({ page }) => {
		const form = await gotoForm(page);
		await fillValid(form, testEmail("phone"));
		await form.locator('input[name="phone"]').fill("ruf mich an");
		await submit(form);
		await expect(form.locator(".bad")).toHaveCount(1);
		await expect(form.locator('input[name="phone"]')).toHaveAttribute(
			"aria-invalid",
			"true",
		);
	});

	test("sends the inquiry and empties the form", async ({ page }) => {
		const form = await gotoForm(page);
		const email = testEmail("ok");
		await fillValid(form, email);
		await form.locator('input[name="phone"]').fill("+49 30 1234567");
		await form
			.locator('select[name="kind"]')
			.selectOption("Verband oder Netzwerk");
		await form
			.locator('textarea[name="message"]')
			.fill("Wir möchten zusammenarbeiten.");
		await submit(form);
		await expect(form.getByRole("status")).toHaveText(
			"Danke, Erika Musterfrau! Wir melden uns bei Ihnen.",
		);
		await expect(form.locator('input[name="email"]')).toHaveValue("");

		await expect
			.poll(() => webhookFor(page, email))
			.toMatchObject({
				event_type: "partnershipinquiry",
				company: "Muster Software GmbH",
				name: "Erika Musterfrau",
				phone: "+49 30 1234567",
				kind: "Verband oder Netzwerk",
				message: "Wir möchten zusammenarbeiten.",
				page: PATH,
			});
		const sent = (await webhookFor(page, email)) as Record<string, unknown>;
		expect(sent).not.toHaveProperty("_t");
		expect(sent).not.toHaveProperty("website");
		expect(sent).not.toHaveProperty("consent");
	});

	test("sends without the optional fields", async ({ page }) => {
		const form = await gotoForm(page);
		const email = testEmail("minimal");
		await fillValid(form, email);
		await submit(form);
		await expect(form.getByRole("status")).toContainText("Danke");
		await expect.poll(() => webhookFor(page, email)).toBeDefined();
		const sent = (await webhookFor(page, email)) as Record<string, unknown>;
		for (const key of ["phone", "message"])
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
		await expect(form.getByRole("status")).toContainText("Danke");
		await page.waitForTimeout(500);
		expect(await webhookFor(page, email)).toBeUndefined();
	});

	test("shows the phone number when sending fails, keeping the values", async ({
		page,
	}) => {
		const form = await gotoForm(page);
		const email = testEmail("fail", "sink-fails.example");
		await fillValid(form, email);
		await submit(form);
		const alert = form.getByRole("alert");
		await expect(alert).toContainText("Das hat gerade nicht geklappt.");
		await expect(alert.getByRole("link")).toHaveAttribute(
			"href",
			"tel:+493052001352",
		);
		await expect(form.locator('input[name="email"]')).toHaveValue(email);
	});
});

test.describe("the card form", () => {
	test("marks the missing fields and focuses the first", async ({ page }) => {
		await gotoForm(page);
		const form = card(page).locator("form");
		await expect(form).toHaveAccessibleName("Anfrage Softwarepartner");
		await submitCard(form);
		await expect(form.getByRole("alert")).toHaveText(
			"Bitte füllen Sie die markierten Felder aus.",
		);
		await expect(form.locator(".err")).toHaveCount(5);
		await expect(form.locator('input[name="company"]')).toBeFocused();
		await expect(form.locator('textarea[name="message"]')).not.toHaveAttribute(
			"aria-invalid",
		);
		// The contact form isn't touched.
		await expect(page.locator("#kontakt .bad")).toHaveCount(0);
	});

	test("sends the inquiry and shows the thank-you panel", async ({ page }) => {
		await gotoForm(page);
		const form = card(page).locator("form");
		const email = testEmail("card");
		await fillCard(form, email);
		await form
			.locator('textarea[name="message"]')
			.fill("Verbräuche und Dokumente");
		await submitCard(form);
		const done = card(page).getByRole("status");
		await expect(done).toContainText("Danke für Ihre Anfrage.");
		await expect(done).toContainText(
			"Ihr persönlicher Ansprechpartner meldet sich bei Ihnen.",
		);
		await expect(done).toBeFocused();
		await expect(card(page).locator("form")).toHaveCount(0);
		// The contact form stays empty and quiet.
		await expect(page.locator("#kontakt form").getByRole("status")).toHaveCount(
			0,
		);

		await expect
			.poll(() => webhookFor(page, email))
			.toMatchObject({
				event_type: "connectioninquiry",
				company: "Muster Software GmbH",
				name: "Erika Musterfrau",
				software: "CRM",
				message: "Verbräuche und Dokumente",
				page: PATH,
			});
		const sent = (await webhookFor(page, email)) as Record<string, unknown>;
		for (const key of ["_t", "website", "consent", "phone"])
			expect(sent).not.toHaveProperty(key);
	});

	test("shows the phone number when sending fails, keeping the values", async ({
		page,
	}) => {
		await gotoForm(page);
		const form = card(page).locator("form");
		const email = testEmail("card-fail", "sink-fails.example");
		await fillCard(form, email);
		await submitCard(form);
		const alert = form.getByRole("alert");
		await expect(alert).toContainText("Das hat gerade nicht geklappt.");
		await expect(alert.getByRole("link")).toHaveAttribute(
			"href",
			"tel:+493052001352",
		);
		await expect(form.locator('input[name="email"]')).toHaveValue(email);
	});
});

test("no console errors or hydration warnings", async ({ page }) => {
	const problems: string[] = [];
	page.on("console", (message) => {
		if (["error", "warning"].includes(message.type()))
			problems.push(message.text());
	});
	page.on("pageerror", (error) => problems.push(String(error)));
	await gotoHydrated(page);
	for (const selector of [
		".doc",
		".phone",
		"#anbindung",
		".cal",
		".bill",
		"#kontakt",
		"#faq",
		"section.end",
	]) {
		await page.locator(selector).first().scrollIntoViewIfNeeded();
		await page.waitForTimeout(300);
	}
	expect(problems).toEqual([]);
});
