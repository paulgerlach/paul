import { expect, test, type Locator, type Page } from "@playwright/test";

// Succession inquiries go to the local webhook sink from playwright.config.ts;
// no database needed. The sink answers 500 for emails at @sink-fails.example.

const PATH = "/nachfolge";
const WEBHOOK_EVENTS = "http://127.0.0.1:4199/events";
const KONTAKT = "#kontakt";

const testEmail = (name: string, domain = "example.com") =>
	`e2e-nf-${name}-${Date.now()}-${Math.round(Math.random() * 1e6)}@${domain}`;

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
	await form.locator('input[name="company"]').fill("Muster Messdienst GmbH");
	await form.locator('input[name="name"]').fill("Erika Musterfrau");
	await form.locator('input[name="email"]').fill(email);
	await form.locator('input[name="consent"]').check();
}

const submit = (form: Locator) =>
	form.getByRole("button", { name: /Gespräch anfragen/ }).click();

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
	await expect(page).toHaveTitle(/^Nachfolge für Messdienstanbieter/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(
		page.getByRole("heading", {
			level: 1,
			name: "Nachfolge für Messdienstanbieter mit Heidi",
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
		/\/nachfolge$/,
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
	expect(sitemap).not.toMatch(/<loc>https?:\/\/[^/]+\/nachfolge<\/loc>/);
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
		await expect(form.locator(".bad")).toHaveCount(4);
		expect(await overflow()).toBeLessThanOrEqual(0);
	});

test("the footer and /neuigkeiten lead here, every internal link resolves", async ({
	page,
	request,
}) => {
	await page.goto("/neuigkeiten");
	await expect(
		page.locator("a.card", { hasText: /^.*Nachfolge: Messdienstanbieter/ }),
	).toHaveAttribute("href", PATH);

	await page.goto(PATH);
	await expect(
		page.locator("footer").getByRole("link", { name: "Nachfolge" }),
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

test("CTAs lead to the contact form, the rows, the FAQ and /sicherheit", async ({
	page,
}) => {
	await page.goto(PATH);
	// No signup form on this page.
	await expect(page.locator("#start")).toHaveCount(0);
	await expect(page.locator("#kontakt form")).toHaveCount(1);

	await expect(
		page.locator("main a", { hasText: /Kontakt aufnehmen/i }),
	).toHaveAttribute("href", KONTAKT);
	const talk = page.locator("main a", { hasText: /Gespräch anfragen/i });
	// Four rows and the first audience card.
	await expect(talk).toHaveCount(5);
	for (const href of await hrefs(talk)) expect(href).toBe(KONTAKT);
	await expect(
		page.locator("main a", { hasText: /Mehr erfahren/i }),
	).toHaveAttribute("href", "#inhalt");
	await expect(page.locator("#inhalt")).toHaveCount(1);

	const faqLinks = page.locator("#inhalt a", { hasText: /Häufige Fragen/i });
	await expect(faqLinks).toHaveCount(4);
	for (const href of await hrefs(faqLinks)) expect(href).toBe("#faq");
	await expect(page.locator("#faq")).toHaveCount(1);

	await expect(page.getByText("Mehr Partnerschaften?")).toBeVisible();
	await expect(
		page.locator("main a", { hasText: /Zu den Partnerschaften/i }),
	).toHaveAttribute("href", "/partnerschaften");
	await expect(
		page.locator("#faq a", { hasText: "Mehr zu Sicherheit" }),
	).toHaveAttribute("href", "/sicherheit");

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
			"Übergeben",
			"Übernommen",
			"Geklärt",
			"Weitergeführt",
		]);
		await expect(phone(page)).toHaveClass(/\bs2\b/);
		await expect(phone(page)).toContainText("Persönlich");
		await expect(page.locator(".doc.ok .dr.on")).toHaveCount(4);
		await expect(page.locator(".cal li")).toHaveCount(9);
		await expect(page.locator(".cal li.done")).toHaveCount(6);
		await expect(page.locator(".cal li.now")).toHaveText(
			/Liegensch\. 7\s*in Planung/,
		);
		await expect(gridNote(page)).toHaveText("Liegensch. 7 in Planung");
		await expect(billSum(page)).toHaveText("in guten Händen");
		await expect(page.locator("section.num .fig b")).toHaveText([
			"1:1",
			"15.000+",
			"DE",
			"1.1.2027",
			"Diskret",
		]);
		await expect(video(page)).toHaveAttribute("poster", /.+/);
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
		await expect(form.locator("[aria-invalid=true]")).toHaveCount(4);

		const email = testEmail("nojs");
		await fillValid(form, email);
		await form.locator('select[name="timeframe"]').selectOption("noch offen");
		// Enter submits too; a click fights the site's smooth scrolling here.
		await form.locator('input[name="company"]').press("Enter");
		await expect(page.locator("#kontakt form").getByRole("status")).toHaveText(
			"Danke, Erika Musterfrau! Wir melden uns bei Ihnen.",
		);
		await expect
			.poll(() => webhookFor(page, email))
			.toMatchObject({
				event_type: "successioninquiry",
				timeframe: "noch offen",
			});
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
		await expect(pills(page).first()).toHaveText("Übergeben");
		await expect(page.locator("figure.mid .li.ok")).toHaveCount(4);
		await page.locator(".cal").scrollIntoViewIfNeeded();
		await page.clock.runFor(8000);
		await expect(page.locator(".cal li.done")).toHaveCount(6);
		await page.locator(".bill").scrollIntoViewIfNeeded();
		await page.clock.runFor(8000);
		await expect(billSum(page)).toHaveText("in guten Händen");
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
	await expect(pills(page).first()).toHaveText("In Vorbereitung");
	await page.clock.runFor(1500);
	await expect(listItems(page).first()).toHaveClass(/\bok\b/);
	await expect(pills(page).first()).toHaveText("Übergeben");
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
	await expect(gridNote(page)).toHaveText("Liegensch. 1 umgerüstet");
	await page.clock.runFor(2400);
	await expect(page.locator(".cal li.done")).toHaveCount(6);
	await expect(gridNote(page)).toHaveText("Liegensch. 7 in Planung");

	await page.locator(".bill").scrollIntoViewIfNeeded();
	await page.clock.runFor(200);
	await expect(billSum(page)).toHaveText("offen");
	await page.clock.runFor(2600);
	await expect(billSum(page)).toHaveText("in guten Händen");
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
		await expect(form.locator(".bad")).toHaveCount(4);
		await expect(form.locator('input[name="company"]')).toHaveAttribute(
			"aria-invalid",
			"true",
		);
		// The optional fields aren't marked.
		for (const field of [
			'input[name="phone"]',
			'select[name="properties"]',
			'select[name="timeframe"]',
			'textarea[name="message"]',
		])
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
		await form.locator('select[name="properties"]').selectOption("100 bis 500");
		await form
			.locator('select[name="timeframe"]')
			.selectOption("in 1 bis 2 Jahren");
		await form
			.locator('textarea[name="message"]')
			.fill("Wir suchen eine Nachfolge für unsere Kunden.");
		await submit(form);
		await expect(form.getByRole("status")).toHaveText(
			"Danke, Erika Musterfrau! Wir melden uns bei Ihnen.",
		);
		await expect(form.locator('input[name="email"]')).toHaveValue("");

		await expect
			.poll(() => webhookFor(page, email))
			.toMatchObject({
				event_type: "successioninquiry",
				company: "Muster Messdienst GmbH",
				name: "Erika Musterfrau",
				phone: "+49 30 1234567",
				properties: "100 bis 500",
				timeframe: "in 1 bis 2 Jahren",
				message: "Wir suchen eine Nachfolge für unsere Kunden.",
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
		for (const key of ["phone", "properties", "timeframe", "message"])
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

test("no console errors or hydration warnings", async ({ page }) => {
	const problems: string[] = [];
	page.on("console", (message) => {
		if (["error", "warning"].includes(message.type()))
			problems.push(message.text());
	});
	page.on("pageerror", (error) => problems.push(String(error)));
	await gotoHydrated(page);
	for (const selector of [
		".phone",
		".doc",
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
