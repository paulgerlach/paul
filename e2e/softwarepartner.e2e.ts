import { expect, test, type Locator, type Page } from "@playwright/test";

// Partner inquiries go to the local webhook sink from playwright.config.ts;
// no database needed. The sink answers 500 for emails at @sink-fails.example.

const PATH = "/softwarepartner";
const WEBHOOK_EVENTS = "http://127.0.0.1:4199/events";
const MANAGER_SIGNUP = "/messdienstwechsel#start";

const testEmail = (name: string, domain = "example.com") =>
	`e2e-sp-${name}-${Date.now()}-${Math.round(Math.random() * 1e6)}@${domain}`;

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
	return page.locator("#bewerben form");
}

async function fillValid(form: Locator, email: string) {
	await form.locator('input[name="company"]').fill("Muster Software GmbH");
	await form.locator('input[name="name"]').fill("Erika Musterfrau");
	await form.locator('input[name="email"]').fill(email);
	await form.locator('input[name="product"]').fill("Muster ERP");
	await form.locator('select[name="customers"]').selectOption("50 bis 250");
	await form.locator('input[name="consent"]').check();
}

const submit = (form: Locator) =>
	form.getByRole("button", { name: /Als Partner melden/ }).click();

const pills = (page: Page) => page.locator("figure.mid .st");
const phone = (page: Page) => page.locator(".tile .phone");
const billSum = (page: Page) => page.locator(".bill .sum b");

test("renders with its own layout, SEO tags and FAQ data", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^Softwarepartner werden/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(
		page.getByRole("heading", {
			level: 1,
			name: "Softwarepartner von Heidi Systems",
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
		/\/softwarepartner$/,
	);

	const jsonLd = await page
		.locator('script[type="application/ld+json"]')
		.textContent();
	const faq = JSON.parse(jsonLd ?? "{}");
	expect(faq["@type"]).toBe("FAQPage");
	expect(faq.mainEntity).toHaveLength(4);
});

test("is not in the sitemap yet", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	// The host followed by the path, exactly.
	expect(sitemap).not.toMatch(/<loc>https?:\/\/[^/]+\/softwarepartner<\/loc>/);
});

for (const width of [375, 320])
	test(`has no horizontal overflow at ${width} px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 812 });
		await page.goto(PATH);
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - window.innerWidth,
		);
		expect(overflow).toBeLessThanOrEqual(0);
	});

test("the footer leads here and every internal link resolves", async ({
	page,
	request,
}) => {
	await page.goto(PATH);
	await expect(
		page.locator("footer").getByRole("link", { name: "Softwarepartner" }),
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

test("CTAs lead to the partner form, the FAQ and the linked pages", async ({
	page,
}) => {
	await page.goto(PATH);
	// No signup form on this page.
	await expect(page.locator("#start")).toHaveCount(0);
	await expect(page.locator("#bewerben form")).toHaveCount(1);

	const partner = page.locator("main a", { hasText: /Partner werden/i });
	// The hero, four rows, the first audience card, the closing card.
	await expect(partner).toHaveCount(7);
	for (const href of await hrefs(partner)) expect(href).toBe("#bewerben");

	// "API-Dokumentation" waits for its page.
	await expect(
		page.locator("main a", { hasText: /API-Dokumentation/i }),
	).toHaveCount(0);
	const faqLinks = page.locator("#inhalt a", { hasText: /Häufige Fragen/i });
	await expect(faqLinks).toHaveCount(4);
	for (const href of await hrefs(faqLinks)) expect(href).toBe("#faq");
	await expect(page.locator("#faq")).toHaveCount(1);

	await expect(
		page.locator("main a", { hasText: "Zu den Schnittstellen" }),
	).toHaveAttribute("href", "/schnittstellen");
	await expect(
		page.locator("#faq a", { hasText: "Mehr zu Sicherheit" }),
	).toHaveAttribute("href", "/sicherheit");
	// The managers' CTAs lead to /messdienstwechsel's signup.
	await expect(
		page.locator("section.trust a", { hasText: "Demo buchen" }),
	).toHaveAttribute("href", MANAGER_SIGNUP);
	await expect(page.locator("a.ctab")).toHaveAttribute("href", MANAGER_SIGNUP);
	await expect(
		page.locator("nav.top").getByRole("link", { name: "Bestand prüfen" }),
	).toHaveAttribute("href", "/messdienstwechsel");
});

test.describe("without JavaScript", () => {
	test.use({ javaScriptEnabled: false });

	test("every block is in its end state", async ({ page }) => {
		await page.goto(PATH);
		await expect(pills(page)).toHaveText([
			"Übertragen",
			"Übergeben",
			"Aktuell",
			"Bereit",
		]);
		await expect(billSum(page)).toHaveText("nein");
		await expect(page.locator(".cal li.done")).toHaveCount(9);
		await expect(page.locator(".cal li.now")).toHaveText(
			/Okt\s*wird übertragen/,
		);
		await expect(page.locator(".tile .note span").last()).toHaveText(
			"Okt wird übertragen",
		);
		await expect(page.locator(".doc.ok .dr.on")).toHaveCount(4);
		await expect(phone(page)).toHaveClass(/\bs2\b/);
		const transfers = phone(page).locator(".item");
		await expect(transfers).toHaveCount(4);
		await expect(phone(page).locator(".item.ok em")).toHaveText([
			"✓",
			"✓",
			"✓",
		]);
		await expect(phone(page).locator(".item.cur")).toHaveText(
			/Verbräuche Oktober\s*Wird übertragen\s*…/,
		);
	});

	test("the form posts: errors first, then the thanks", async ({ browser }) => {
		// Without smooth scrolling to #bewerben, so the fields hold still.
		const context = await browser.newContext({
			javaScriptEnabled: false,
			reducedMotion: "reduce",
		});
		const page = await context.newPage();
		await page.goto(PATH);
		// The timing check runs first and uses the server's render time.
		await page.waitForTimeout(3100);
		await submit(page.locator("#bewerben form"));
		await expect(page).toHaveURL(/#bewerben$/);
		const form = page.locator("#bewerben form");
		await expect(form.getByRole("alert")).toHaveText(
			"Bitte füllen Sie die markierten Felder aus.",
		);
		await expect(form.locator("[aria-invalid=true]")).toHaveCount(6);

		const email = testEmail("nojs");
		await fillValid(form, email);
		await form.locator('input[name="kinds"][value="CRM"]').check();
		// Enter submits too; a click fights the site's smooth scrolling here.
		await form.locator('input[name="product"]').press("Enter");
		await expect(page.locator("#bewerben form").getByRole("status")).toHaveText(
			"Danke, Erika Musterfrau! Wir melden uns bei Ihnen.",
		);
		await expect
			.poll(() => webhookFor(page, email))
			.toMatchObject({
				event_type: "softwarepartnerinquiry",
				kinds: ["CRM"],
			});
		await context.close();
	});
});

test.describe("with reduced motion", () => {
	test.use({ reducedMotion: "reduce" });

	test("every block shows its end state and stays", async ({ page }) => {
		await page.clock.install();
		await gotoHydrated(page);
		await page.clock.runFor(10_000);
		await expect(pills(page).first()).toHaveText("Übertragen");
		await page.locator(".bill").scrollIntoViewIfNeeded();
		await page.clock.runFor(8000);
		await expect(billSum(page)).toHaveText("nein");
		await phone(page).scrollIntoViewIfNeeded();
		await page.clock.runFor(8000);
		await expect(phone(page)).toHaveClass(/\bs2\b/);
	});
});

test("row 4's phone drops the notification in, then the transfers", async ({
	page,
}) => {
	await page.clock.install();
	await gotoHydrated(page);
	await phone(page).scrollIntoViewIfNeeded();
	await page.clock.runFor(100);
	await expect(phone(page)).not.toHaveClass(/\bs1\b/);
	await page.clock.runFor(500);
	await expect(phone(page)).toHaveClass(/\bs1\b/);
	await expect(phone(page)).not.toHaveClass(/\bs2\b/);
	await page.clock.runFor(1300);
	await expect(phone(page)).toHaveClass(/\bs2\b/);
	await expect(phone(page).locator(".item")).toHaveCount(4);
});

test("row 1 turns to the data set", async ({ page }) => {
	await page.clock.install();
	await gotoHydrated(page);
	await page.locator(".bill").scrollIntoViewIfNeeded();
	await page.clock.runFor(200);
	await expect(billSum(page)).toHaveText("ja");
	await page.clock.runFor(2600);
	await expect(billSum(page)).toHaveText("nein");
});

test.describe("the partner form", () => {
	test("marks the missing fields after a submit", async ({ page }) => {
		const form = await gotoForm(page);
		await expect(form.getByRole("alert")).toHaveText("");
		await submit(form);
		await expect(form.getByRole("alert")).toHaveText(
			"Bitte füllen Sie die markierten Felder aus.",
		);
		await expect(form.locator(".bad")).toHaveCount(6);
		await expect(form.locator('input[name="product"]')).toHaveAttribute(
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
		await form.locator('input[name="kinds"][value="ERP"]').check();
		await form.locator('input[name="kinds"][value="Abrechnung"]').check();
		await form
			.locator('textarea[name="message"]')
			.fill("Wir möchten Verbräuche importieren.");
		await submit(form);
		await expect(form.getByRole("status")).toHaveText(
			"Danke, Erika Musterfrau! Wir melden uns bei Ihnen.",
		);
		await expect(form.locator('input[name="email"]')).toHaveValue("");

		await expect
			.poll(() => webhookFor(page, email))
			.toMatchObject({
				event_type: "softwarepartnerinquiry",
				company: "Muster Software GmbH",
				name: "Erika Musterfrau",
				phone: "+49 30 1234567",
				product: "Muster ERP",
				customers: "50 bis 250",
				kinds: ["ERP", "Abrechnung"],
				message: "Wir möchten Verbräuche importieren.",
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
		expect(sent).not.toHaveProperty("phone");
		expect(sent).not.toHaveProperty("message");
		expect(sent.kinds).toEqual([]);
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
		".bill",
		".cal",
		".doc",
		".phone",
		"#bewerben",
		"#faq",
	]) {
		await page.locator(selector).first().scrollIntoViewIfNeeded();
		await page.waitForTimeout(300);
	}
	expect(problems).toEqual([]);
});
