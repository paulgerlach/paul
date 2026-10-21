import { expect, test, type Locator, type Page } from "@playwright/test";

// The signup test saves a lead, so it needs a database with the `leads` table.
// Webhooks go to the local sink from playwright.config.ts.

const PATH = "/energieausweis";
const WEBHOOK_EVENTS = "http://127.0.0.1:4199/events";

const testEmail = (name: string) =>
	`e2e-ea-${name}-${Date.now()}-${Math.round(Math.random() * 1e6)}@example.com`;

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

/** Waits for hydration, so the page's handlers run. */
const gotoHydrated = (page: Page) =>
	page.goto(PATH, { waitUntil: "networkidle" });

const wizard = (page: Page) =>
	page.getByRole("group", { name: "Ausweis-Check" });

/** Clicks the answers in order. */
async function answer(page: Page, labels: string[]) {
	for (const label of labels)
		await wizard(page)
			.getByRole("button", { name: label, exact: true })
			.click();
}

const offerCards = (page: Page) => page.locator("#produkte article");

test("renders with its own layout and SEO tags", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^Energieausweis online beantragen:/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(page.locator("h1")).toHaveText(
		"Der Energieausweis für Ihre Liegenschaft. Einfach online beantragen.",
	);
	await expect(page.locator("#header")).toHaveCount(0);
	// noindex until the go-live gate (plan §4.4), with a self-canonical
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		"noindex",
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		/\/energieausweis$/,
	);
});

test("is not in the sitemap yet", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	expect(sitemap).not.toContain("/energieausweis</loc>");
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

test("the footer and the internal links lead here and on", async ({
	page,
	request,
}) => {
	await page.goto(PATH);
	expect(
		await hrefs(page.locator("footer a", { hasText: /^Energieausweis$/ })),
	).toEqual([PATH]);
	const links = new Set([
		...(await hrefs(page.locator('footer a[href^="/"]'))),
		...(await hrefs(page.locator('main a[href^="/"]'))),
	]);
	for (const href of links) {
		const response = await request.get(href);
		expect(response.status(), href).toBe(200);
	}
});

test("the CTAs lead to the check, the offers, the closing form and the dashboard", async ({
	page,
}) => {
	await gotoHydrated(page);
	await expect(
		page.getByRole("link", { name: /Welchen Ausweis brauche ich/ }),
	).toHaveAttribute("href", "#check");
	await expect(page.locator("section#check")).toHaveCount(1);
	await expect(
		page.getByRole("link", { name: /Preise ansehen/ }),
	).toHaveAttribute("href", "#produkte");
	await expect(page.locator("section#produkte")).toHaveCount(1);
	await expect(
		page.getByRole("link", { name: /Zum Dashboard/ }),
	).toHaveAttribute("href", "/dashboard");
	await expect(
		page.locator("section.final#start input[name=email]"),
	).toHaveCount(1);
	await expect(page.locator("a.ctab")).toHaveAttribute("href", "#start");
	const order = offerCards(page).getByRole("link", { name: /Jetzt bestellen/ });
	expect(await hrefs(order)).toEqual([
		"https://heidi.energieausweis48.de/verbrauchsausweis?servicelevel=selfservice",
		"https://heidi.energieausweis48.de/bedarfsausweis?servicelevel=selfservice",
		"https://heidi.energieausweis48.de/bedarfsausweis?servicelevel=videoservice",
		"https://heidi.energieausweis48.de/bedarfsausweis?servicelevel=fullservice",
	]);
	for (const link of await order.all())
		await expect(link).toHaveAttribute("target", "_blank");
});

test("the scale moves between the two examples", async ({ page }) => {
	await gotoHydrated(page);
	const card = page.getByRole("group", {
		name: "Illustration einer Energieeffizienzskala",
	});
	const figure = card.locator(".mark b");
	await expect(figure).toHaveText("118");
	await expect(card.locator(".sr-only")).toHaveText(
		"118 kWh/(m²·a), Effizienzklasse D",
	);
	await expect(card.locator(".bar i.cur")).toHaveText("D");
	await card.getByRole("button", { name: /^Bedarfsausweis/ }).click();
	await expect(figure).toHaveText("142");
	await expect(card.locator(".bar i.cur")).toHaveText("E");
	await expect(
		card.getByRole("button", { name: /^Bedarfsausweis/ }),
	).toHaveAttribute("aria-pressed", "true");
	await card.getByRole("button", { name: /^Verbrauchsausweis/ }).click();
	await expect(figure).toHaveText("118");
});

test("the check leads to each result", async ({ page }) => {
	await gotoHydrated(page);
	const w = wizard(page);
	await expect(w).toContainText("Frage 1 von 4");
	await expect(w.getByRole("button", { name: "Zurück" })).toHaveCount(0);

	await answer(page, ["Ja, Neubau"]);
	await expect(w).toContainText("Ergebnis");
	await expect(w.locator(".rk")).toHaveText("Pflicht");
	await expect(w.locator("h3")).toHaveText("Bedarfsausweis");
	await expect(w.locator(".pick > div")).toHaveCount(3);

	await w.getByRole("button", { name: "Neu starten" }).click();
	await expect(w).toContainText("Frage 1 von 4");
	await answer(page, ["Nein, Bestandsgebäude", "1 bis 4 Wohnungen"]);
	await expect(w).toContainText("Frage 3 von 4");
	await w.getByRole("button", { name: "Zurück" }).click();
	await expect(w).toContainText("Frage 2 von 4");
	await expect(w.locator("h3")).toBeFocused();
	await answer(page, [
		"1 bis 4 Wohnungen",
		"Ja, vor dem 1.11.1977",
		"Weiß nicht",
	]);
	await expect(w.locator("h3")).toHaveText("Voraussichtlich Bedarfsausweis");

	await w.getByRole("button", { name: "Neu starten" }).click();
	await answer(page, ["Nein, Bestandsgebäude", "5 oder mehr Wohnungen"]);
	await expect(w.locator(".rk")).toHaveText("Wahlfreiheit");
	await expect(w.locator("h3")).toHaveText("Sie haben die Wahl");
	await expect(w.locator(".pick > div")).toHaveCount(4);
	await expect(w.locator(".pick > div").first()).toContainText(
		/Verbrauchsausweis\s*ab 69,95/,
	);
});

test("the check's result and the filter pick the offers", async ({ page }) => {
	await gotoHydrated(page);
	const filter = page.getByRole("radiogroup", { name: "Angebote filtern" });
	await expect(filter.getByRole("radio", { name: "Alle" })).toHaveAttribute(
		"aria-checked",
		"true",
	);
	await expect(page.locator("#produkte article.off")).toHaveCount(0);

	await answer(page, [
		"Nein, Bestandsgebäude",
		"1 bis 4 Wohnungen",
		"Ja, vor dem 1.11.1977",
		"Nein",
	]);
	await expect(wizard(page).locator("h3")).toHaveText("Bedarfsausweis");
	await wizard(page)
		.getByRole("link", { name: /Passende Angebote ansehen/ })
		.click();
	await expect(page).toHaveURL(/#produkte$/);
	await expect(
		filter.getByRole("radio", { name: "Bedarfsausweis" }),
	).toHaveAttribute("aria-checked", "true");
	await expect(offerCards(page).nth(0)).toHaveClass(/\boff\b/);
	await expect(offerCards(page).nth(1)).toHaveClass(/\bhl\b/);

	await filter.getByRole("radio", { name: "Verbrauchsausweis" }).click();
	await expect(offerCards(page).nth(0)).toHaveClass(/\bhl\b/);
	await expect(offerCards(page).nth(2)).toHaveClass(/\boff\b/);
	await filter.getByRole("radio", { name: "Alle" }).click();
	for (let i = 0; i < 4; i++)
		await expect(offerCards(page).nth(i)).not.toHaveClass(/\b(off|hl)\b/);
});

test("the comparison reads as a table", async ({ page }) => {
	await page.goto(PATH);
	const table = page.getByRole("table", {
		name: "Verbrauchsausweis und Bedarfsausweis im Vergleich",
	});
	await expect(table.getByRole("row")).toHaveCount(6);
	await expect(table.getByRole("rowheader")).toHaveText([
		"Grundlage",
		"Benötigte Daten",
		"Pflicht für",
		"Preis",
		"Gültigkeit",
	]);
});

test("the bars grow when the card scrolls into view", async ({ page }) => {
	await gotoHydrated(page);
	const card = page.locator("section[aria-labelledby=ea-hd-h] .card");
	await expect(card).not.toHaveClass(/\bin\b/);
	await card.scrollIntoViewIfNeeded();
	await expect(card).toHaveClass(/\bin\b/);
});

test("hydrates without console errors or warnings", async ({ page }) => {
	const messages: string[] = [];
	page.on("console", (message) => {
		if (["error", "warning"].includes(message.type()))
			messages.push(message.text());
	});
	page.on("pageerror", (error) => messages.push(error.message));
	await gotoHydrated(page);
	await page.mouse.wheel(0, 4000);
	await page.waitForTimeout(800);
	expect(messages).toEqual([]);
});

test.describe("without JS", () => {
	test.use({ javaScriptEnabled: false });

	test("the end states read, the check is hidden", async ({ page }) => {
		await page.goto(PATH);
		await expect(page.locator(".mark b")).toHaveText("118");
		await expect(page.locator(".bar i.cur")).toHaveText("D");
		await expect(wizard(page)).toBeHidden();
		await expect(
			page.getByRole("radiogroup", { name: "Angebote filtern" }),
		).toBeHidden();
		await expect(offerCards(page)).toHaveCount(4);
		await expect(
			page.locator("section[aria-labelledby=ea-hd-h] .card"),
		).toHaveClass(/\bin\b/);
		await expect(page.locator("section#start form")).toHaveAttribute(
			"method",
			/post/i,
		);
	});
});

test.describe("with reduced motion", () => {
	test.use({ reducedMotion: "reduce" });

	test("nothing waits or moves", async ({ page }) => {
		await gotoHydrated(page);
		await expect(page.locator("main .rv-wait")).toHaveCount(0);
		await expect(page.locator(".mark b")).toHaveText("118");
		await expect(
			page.locator("section[aria-labelledby=ea-hd-h] .card"),
		).toHaveClass(/\bin\b/);
	});
});

test("signup stores the lead and sends the webhook with the page", async ({
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
