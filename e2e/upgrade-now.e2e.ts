import { expect, test, type Page } from "@playwright/test";

// The signup tests save leads, so they need a database with the `leads` table.
// Webhooks go to the local sink from playwright.config.ts.
//
// The server renders with its real time; the page's clock takes over from the
// browser's on mount. So `page.clock` at a fixed time checks the client side,
// and the switch from the server's values is part of every test.

const PATH = "/upgrade-now";
const WEBHOOK_EVENTS = "http://127.0.0.1:4199/events";

/** A Berlin wall-clock time as an instant (+01:00 in winter, +02:00 in summer). */
const berlin = (iso: string) => new Date(iso);
const OCT_7 = berlin("2026-10-07T12:00:00+02:00");
const DEC_31_NOON = berlin("2026-12-31T12:00:00+01:00");
const JAN_1_AFTER = berlin("2027-01-01T00:00:05+01:00");
const DEC_31_BEFORE = berlin("2026-12-31T23:59:57+01:00");

const testEmail = (name: string) =>
	`e2e-un-${name}-${Date.now()}-${Math.round(Math.random() * 1e6)}@example.com`;

async function gotoAt(page: Page, time: Date) {
	await page.clock.install({ time });
	await page.goto(PATH);
}

async function webhookFor(page: Page, email: string) {
	const events: { email: string }[] = await (
		await page.request.get(WEBHOOK_EVENTS)
	).json();
	return events.find((event) => event.email === email);
}

test("renders with its own layout, SEO tags and FAQ data", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^Umrüstpflicht 2026/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(page.locator("#header")).toHaveCount(0);
	// noindex until the go-live gate (plan §5.4), with a self-canonical
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		"noindex",
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		/\/upgrade-now$/,
	);
	// The banner's "Mehr erfahren" goes to the calculator here
	await expect(
		page.locator(".banner").getByRole("link", { name: "Mehr erfahren" }),
	).toHaveAttribute("href", "#risiko");

	const jsonLd = await page
		.locator('script[type="application/ld+json"]')
		.textContent();
	const faq = JSON.parse(jsonLd ?? "{}");
	expect(faq["@type"]).toBe("FAQPage");
	expect(faq.mainEntity).toHaveLength(7);
});

test("redirects the trailing slash", async ({ page }) => {
	await page.goto(`${PATH}/`);
	expect(new URL(page.url()).pathname).toBe(PATH);
});

test("has no horizontal overflow at 375 px", async ({ page }) => {
	await page.setViewportSize({ width: 375, height: 800 });
	await gotoAt(page, OCT_7);
	const overflow = await page.evaluate(
		() =>
			document.documentElement.scrollWidth -
			document.documentElement.clientWidth,
	);
	expect(overflow).toBe(0);
});

test.describe("deadline clock", () => {
	test("7.10.2026: countdown, texts, calendar and KPIs", async ({ page }) => {
		await gotoAt(page, OCT_7);
		const timer = page.getByRole("timer");
		await expect(timer).toContainText("85");
		await expect(page.locator("h1")).toHaveText(
			"Nur noch knapp drei Monate bis zur Umrüstpflicht.",
		);
		await expect(page.getByText("Noch 85 Tage").first()).toBeVisible();
		const calendars = page.locator(".time").getByRole("group");
		await expect(calendars).toHaveCount(3);
		await expect(calendars.first()).toContainText("Oktober 2026");
		await expect(page.getByLabel("7. Oktober 2026, Heute")).toHaveCount(1);
		const kpis = page.locator(".kpis b");
		await expect(kpis).toHaveText(["61", "12", "2"]);
	});

	test("31.12.2026 noon: the last day, not expired", async ({ page }) => {
		await gotoAt(page, DEC_31_NOON);
		await expect(page.locator("h1")).toHaveText(
			"Nur noch heute bis zur Umrüstpflicht.",
		);
		await expect(page.getByRole("timer")).toBeVisible();
		await expect(page.getByText("Letzter Tag").first()).toBeVisible();
		await expect(page.getByText("Frist abgelaufen")).toHaveCount(0);
	});

	test("1.1.2027: the expired state", async ({ page }) => {
		await gotoAt(page, JAN_1_AFTER);
		await expectExpired(page);
	});

	test("switches to the expired state at the deadline", async ({ page }) => {
		await gotoAt(page, DEC_31_BEFORE);
		await expect(page.getByRole("timer")).toBeVisible();
		await page.clock.runFor(5_000);
		await expectExpired(page);
	});
});

async function expectExpired(page: Page) {
	await expect(page.getByRole("timer")).toHaveCount(0);
	await expect(page.locator("h1")).not.toContainText("Nur noch");
	await expect(page.getByText("Die Frist ist abgelaufen.")).toBeVisible();
	await expect(page.getByText("Seit 1. Januar 2027")).toBeVisible();
	await expect(page.locator(".tl .badge")).toHaveText("Frist abgelaufen");
	await expect(page.locator(".time").getByRole("group")).toHaveCount(0);
	// The calculator stays
	await expect(page.locator("#risiko")).toBeVisible();
}

test.describe("risk calculator", () => {
	test.use({ reducedMotion: "reduce" });

	test("computes the cut and the retrofitted case", async ({ page }) => {
		await gotoAt(page, OCT_7);
		const calc = page.locator("#risiko");
		const amount = calc.getByTestId("risk-amount");
		await expect(amount).toHaveText("3.600");

		await calc.getByRole("radio", { name: "50 %" }).click();
		await expect(amount).toHaveText("1.800");
		await expect(calc.getByRole("radio", { name: "50 %" })).toHaveAttribute(
			"aria-checked",
			"true",
		);

		await calc.getByText("Vor dem 31.12. mit Heidi umgerüstet").click();
		await expect(amount).toHaveText("0");
		await expect(calc).toContainText("Rechtzeitig fernablesbar");

		// Arrow keys move the units slider over its stops (120 → 130)
		await calc.getByRole("slider", { name: "Wohneinheiten" }).focus();
		await page.keyboard.press("ArrowRight");
		await expect(calc.locator("output").first()).toHaveText("130");
	});
});

test.describe("CTAs", () => {
	const ctas = [
		[
			"hero",
			(p: Page) =>
				p.locator(".hero").getByRole("link", { name: /Umrüstung anfragen/ }),
		],
		[
			"calculator",
			(p: Page) =>
				p.locator("#risiko").getByRole("link", { name: /Kürzung vermeiden/ }),
		],
		[
			"header",
			(p: Page) =>
				p.locator("nav.top").getByRole("link", { name: "Bestand prüfen" }),
		],
	] as const;

	for (const [name, cta] of ctas) {
		test(`${name} CTA focuses the signup email`, async ({ page }) => {
			await page.goto(PATH);
			await cta(page).click();
			await expect(page.locator("#start input[name=email]")).toBeFocused();
		});
	}
});

test.describe("signup", () => {
	test("stores the lead and sends the webhook with the page", async ({
		page,
	}) => {
		// 10 s behind, so the form's render time passes the timing check
		await page.clock.install({ time: Date.now() - 10_000 });
		await page.goto(PATH);
		const email = testEmail("final");
		const box = page.locator(".signup-box.final");
		await box.locator('input[name="email"]').fill(email);
		await box.locator("button[type=submit]").click();

		await expect(box.locator(".status")).toHaveText(
			"Danke! Wir melden uns innerhalb eines Werktags.",
		);
		await expect
			.poll(() => webhookFor(page, email))
			.toMatchObject({
				event_type: "switchinquiry",
				placement: "final",
				page: PATH,
			});
	});

	test("shows the validation error inline", async ({ page }) => {
		await page.goto(PATH);
		const box = page.locator(".signup-box.final");
		await box
			.locator("form")
			.evaluate((form: HTMLFormElement) => (form.noValidate = true));
		await box.locator('input[name="email"]').fill("not-an-email@");
		await box.locator("button[type=submit]").click();
		await expect(box.getByRole("alert")).toHaveText(
			"Bitte eine gültige E-Mail-Adresse eingeben",
		);
	});

	test("answers a filled honeypot with success but sends nothing", async ({
		page,
	}) => {
		await page.clock.install({ time: Date.now() - 10_000 });
		await page.goto(PATH);
		const email = testEmail("honeypot");
		const box = page.locator(".signup-box.final");
		await box.locator('input[name="website"]').fill("spam", { force: true });
		await box.locator('input[name="email"]').fill(email);
		await box.locator("button[type=submit]").click();
		await expect(box.locator(".status")).toContainText("Danke!");
		expect(await webhookFor(page, email)).toBeUndefined();
	});
});

test.describe("without JavaScript", () => {
	test.use({ javaScriptEnabled: false });

	test("renders every number from the server", async ({ page }) => {
		await page.goto(PATH);
		await expect(page.locator("h1")).toContainText("bis zur Umrüstpflicht.");
		await expect(page.getByRole("timer")).toBeVisible();
		await expect(page.locator(".kpis b").first()).not.toHaveText("–");
		await expect(page.getByTestId("risk-amount")).toHaveText("3.600");
	});
});
