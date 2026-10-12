import { expect, test, type Locator, type Page } from "@playwright/test";

// Applications go to the local webhook sink from playwright.config.ts; no
// database needed. The sink answers 500 for emails at @sink-fails.example.

const PATH = "/karriere";
const WEBHOOK_EVENTS = "http://127.0.0.1:4199/events";
const FE_LABEL = "Frontend Engineer (SvelteKit, TypeScript)";

const testEmail = (name: string, domain = "example.com") =>
	`e2e-kr-${name}-${Date.now()}-${Math.round(Math.random() * 1e6)}@${domain}`;

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
	await page.goto(PATH);
	return page.locator("#bewerben form");
}

async function fill(
	form: Locator,
	fields: { name?: string; email?: string; link?: string; message?: string },
) {
	if (fields.name !== undefined)
		await form.locator('input[name="name"]').fill(fields.name);
	if (fields.email !== undefined)
		await form.locator('input[name="email"]').fill(fields.email);
	if (fields.link !== undefined)
		await form.locator('input[name="link"]').fill(fields.link);
	if (fields.message !== undefined)
		await form.locator('textarea[name="message"]').fill(fields.message);
}

const submit = (form: Locator) =>
	form.getByRole("button", { name: /Bewerbung absenden/ }).click();

test("renders with its own layout and SEO tags", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^Karriere/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(page.locator("#header")).toHaveCount(0);
	// noindex until the go-live gate (plan §4.4), with a self-canonical
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		"noindex",
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		/\/karriere$/,
	);
});

test("has no horizontal overflow at 375 px", async ({ page }) => {
	await page.setViewportSize({ width: 375, height: 812 });
	await page.goto(PATH);
	const overflow = await page.evaluate(
		() => document.documentElement.scrollWidth - window.innerWidth,
	);
	expect(overflow).toBe(0);
});

test("the nav links to the same pages as the site's", async ({ page }) => {
	await page.goto("/");
	const site = new Set(await hrefs(page.locator("#header a[href]")));

	await page.goto(PATH);
	const landing = new Set(await hrefs(page.locator("nav.top a[href]")));

	// Landing-only: the logo links home, the CTA goes to /messdienstwechsel.
	const landingOnly = ["/", "/messdienstwechsel"];
	const siteOnly = ["/fragebogen"];
	expect(
		[...landing].filter((h) => !site.has(h) && !landingOnly.includes(h)),
	).toEqual([]);
	expect(
		[...site].filter((h) => !landing.has(h) && !siteOnly.includes(h)),
	).toEqual([]);
});

test("the header CTA goes to /messdienstwechsel", async ({ page }) => {
	await page.goto(PATH);
	await expect(
		page.locator("nav.top").getByRole("link", { name: "Bestand prüfen" }),
	).toHaveAttribute("href", "/messdienstwechsel");
});

test("the footer's Karriere link and internal links resolve", async ({
	page,
	request,
}) => {
	await page.goto(PATH);
	await expect(
		page.locator("footer").getByRole("link", { name: "Karriere" }),
	).toHaveAttribute("href", PATH);
	const links = new Set(await hrefs(page.locator('footer a[href^="/"]')));
	for (const href of links) {
		const response = await request.get(href);
		expect(response.status(), href).toBe(200);
	}
});

test.describe("hero feed", () => {
	const items = (page: Page) => page.locator('[aria-label*="Ein Tag"] li');

	test("renders 4 events on the server", async ({ request }) => {
		const html = await (await request.get(PATH)).text();
		const feed = html.slice(html.indexOf("Ein Tag bei Heidi"));
		expect(feed.slice(0, feed.indexOf("</ul>")).match(/<li/g)).toHaveLength(4);
	});

	test("adds events and keeps 5 at most", async ({ page }) => {
		await page.goto(PATH);
		const first = await items(page).first().textContent();
		await expect
			.poll(() => items(page).first().textContent(), { timeout: 8000 })
			.not.toBe(first);
		await page.waitForTimeout(6000);
		expect(await items(page).count()).toBeLessThanOrEqual(5);
	});

	test("stops with the pause button", async ({ page }) => {
		await page.goto(PATH);
		await page.getByRole("button", { name: "Animation anhalten" }).click();
		// Hovering pauses too; move away so only the button holds it.
		await page.mouse.move(0, 0);
		await expect(
			page.getByRole("button", { name: "Animation anhalten" }),
		).toHaveAttribute("aria-pressed", "true");
		const before = await items(page).allTextContents();
		await page.waitForTimeout(3500);
		expect(await items(page).allTextContents()).toEqual(before);
	});

	test("doesn't move with reduced motion", async ({ page }) => {
		await page.emulateMedia({ reducedMotion: "reduce" });
		await page.goto(PATH);
		await expect(
			page.getByRole("button", { name: "Animation anhalten" }),
		).toHaveCount(0);
		const before = await items(page).allTextContents();
		await page.waitForTimeout(3500);
		expect(await items(page).allTextContents()).toEqual(before);
	});
});

test.describe("areas", () => {
	test("switches the panel", async ({ page }) => {
		await page.goto(PATH);
		const group = page.getByRole("radiogroup", { name: "Bereich" });
		await group.getByRole("radio", { name: "Operations" }).click();
		await expect(
			group.getByRole("radio", { name: "Operations" }),
		).toHaveAttribute("aria-checked", "true");
		const panel = page.locator('[aria-labelledby="br-h"] h3');
		await expect(panel).toHaveText("Operations");
		await expect(page.getByText("Initiativbewerbung willkommen")).toBeVisible();
	});

	test("moves with the arrow keys", async ({ page }) => {
		await page.goto(PATH);
		const group = page.getByRole("radiogroup", { name: "Bereich" });
		await group.getByRole("radio", { name: "Engineering" }).focus();
		await page.keyboard.press("ArrowRight");
		await expect(
			group.getByRole("radio", { name: "Operations" }),
		).toBeFocused();
		await expect(page.locator('[aria-labelledby="br-h"] h3')).toHaveText(
			"Operations",
		);
		await page.keyboard.press("ArrowLeft");
		await page.keyboard.press("ArrowLeft");
		await expect(group.getByRole("radio", { name: "Vertrieb" })).toBeFocused();
	});
});

test.describe("choosing a role", () => {
	test("a job's apply link selects it and focuses the name field", async ({
		page,
	}) => {
		await page.goto(PATH);
		await page
			.locator("#stellen summary", { hasText: "Frontend Engineer" })
			.click();
		await expect(page.getByText("Was Sie bauen")).toBeVisible();
		await expect(page.getByText("Was Sie mitbringen")).toBeVisible();
		// Choose the other role first, so the link visibly changes it.
		await page.locator('select[name="role"]').selectOption("initiative");
		await page.getByRole("link", { name: /Auf diese Stelle bewerben/ }).click();
		await expect(page.locator('select[name="role"]')).toHaveValue(
			"frontend-engineer",
		);
		await expect(page.locator('input[name="name"]')).toBeFocused();
	});

	test("the hero's Initiativ bewerben selects the open application", async ({
		page,
	}) => {
		await page.goto(PATH);
		await page
			.locator('section[aria-labelledby="kr-h1"]')
			.getByRole("link", { name: /Initiativ bewerben/ })
			.click();
		await expect(page.locator('select[name="role"]')).toHaveValue("initiative");
		await expect(page.locator('input[name="name"]')).toBeFocused();
	});
});

test.describe("application form", () => {
	test("an empty submit shows the combined error and sends nothing", async ({
		page,
	}) => {
		const form = await gotoForm(page);
		await submit(form);
		await expect(form.getByRole("alert")).toHaveText(
			"Bitte ergänzen Sie Ihren Namen und eine gültige E-Mail-Adresse.",
		);
		await expect(form.locator('input[name="name"]')).toHaveAttribute(
			"aria-invalid",
			"true",
		);
	});

	test("an invalid link gets its own sentence", async ({ page }) => {
		const form = await gotoForm(page);
		await fill(form, {
			name: "Max Mustermann",
			email: testEmail("link"),
			link: "github.com/max",
		});
		await submit(form);
		await expect(form.getByRole("alert")).toHaveText(
			"Bitte geben Sie einen vollständigen Link an (https://…).",
		);
	});

	test("sends the application and shows the success state", async ({
		page,
	}) => {
		const form = await gotoForm(page);
		const email = testEmail("ok");
		await fill(form, {
			name: "Max Mustermann",
			email,
			link: "https://github.com/max",
			message: "Ich baue gerne Oberflächen.",
		});
		await submit(form);
		const status = form.getByRole("status");
		await expect(status).toContainText("Danke für Ihre Bewerbung!");
		await expect(status).toContainText(`„${FE_LABEL}“`);
		await expect(status.getByText("Danke für Ihre Bewerbung!")).toBeFocused();

		await expect
			.poll(() => webhookFor(page, email))
			.toMatchObject({
				event_type: "jobapplication",
				role: "frontend-engineer",
				role_title: FE_LABEL,
				name: "Max Mustermann",
				link: "https://github.com/max",
				message: "Ich baue gerne Oberflächen.",
				page: PATH,
			});
		const sent = (await webhookFor(page, email)) as Record<string, unknown>;
		expect(sent).not.toHaveProperty("_t");
		expect(sent).not.toHaveProperty("website");

		// "Weitere Bewerbung" resets the form in place
		await status.getByRole("link", { name: "Weitere Bewerbung" }).click();
		await expect(form.getByRole("status")).toHaveCount(0);
		await expect(form.locator('input[name="name"]')).toHaveValue("");
		await expect(form.locator('input[name="name"]')).toBeFocused();
	});

	test("answers a filled honeypot with success but sends nothing", async ({
		page,
	}) => {
		const form = await gotoForm(page);
		const email = testEmail("honeypot");
		await form.locator('input[name="website"]').fill("spam", { force: true });
		await fill(form, { name: "Max Mustermann", email });
		await submit(form);
		await expect(form.getByRole("status")).toContainText("Danke");
		await page.waitForTimeout(500);
		expect(await webhookFor(page, email)).toBeUndefined();
	});

	test("shows the fallback address when sending fails, keeping the values", async ({
		page,
	}) => {
		const form = await gotoForm(page);
		const email = testEmail("fail", "sink-fails.example");
		await fill(form, { name: "Max Mustermann", email });
		await submit(form);
		const alert = form.getByRole("alert");
		await expect(alert).toContainText("konnte gerade nicht gesendet werden");
		await expect(alert.getByRole("link")).toHaveAttribute(
			"href",
			"mailto:jobs@heidisystems.com",
		);
		await expect(form.locator('input[name="email"]')).toHaveValue(email);
	});
});

test.describe("without JS", () => {
	test.use({ javaScriptEnabled: false });

	test("renders Engineering's panel and posts the form", async ({ page }) => {
		await page.goto(PATH);
		await expect(page.locator('[aria-labelledby="br-h"] h3')).toHaveText(
			"Engineering",
		);
		const form = page.locator("#bewerben form");

		// The timing check runs first and uses the server's render time.
		await page.waitForTimeout(3100);

		// Invalid: the response shows the errors at #bewerben
		await submit(form);
		await expect(page).toHaveURL(/#bewerben$/);
		await expect(page.locator("#bewerben form").getByRole("alert")).toHaveText(
			"Bitte ergänzen Sie Ihren Namen und eine gültige E-Mail-Adresse.",
		);

		// Valid (the posted render time is still the first page's)
		const email = testEmail("nojs");
		await fill(page.locator("#bewerben form"), {
			name: "Max Mustermann",
			email,
		});
		await page
			.locator('#bewerben select[name="role"]')
			.selectOption("initiative");
		// Enter submits too; a click fights the site's smooth scrolling here.
		await page.locator('#bewerben input[name="email"]').press("Enter");
		await expect(
			page.locator("#bewerben form").getByRole("status"),
		).toContainText("„Initiativbewerbung“");
		await expect
			.poll(() => webhookFor(page, email))
			.toMatchObject({ event_type: "jobapplication", role: "initiative" });
	});
});
