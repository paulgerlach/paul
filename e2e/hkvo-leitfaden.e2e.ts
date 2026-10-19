import { expect, test, type Locator, type Page } from "@playwright/test";

// The signup test saves a lead, so it needs a database with the `leads` table.
// Webhooks go to the local sink from playwright.config.ts.

const PATH = "/hkvo-leitfaden";
const WEBHOOK_EVENTS = "http://127.0.0.1:4199/events";

const testEmail = (name: string) =>
	`e2e-lf-${name}-${Date.now()}-${Math.round(Math.random() * 1e6)}@example.com`;

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

/** Waits for hydration, so the check and the table of contents run. */
const gotoHydrated = (page: Page) =>
	page.goto(PATH, { waitUntil: "networkidle" });

const checkCard = (page: Page) =>
	page.getByRole("group", { name: "Schnell-Check Heizkostenverordnung" });
const question = (page: Page, name: RegExp) =>
	checkCard(page).getByRole("group", { name });
const answer = (page: Page, name: RegExp, value: "Ja" | "Nein") =>
	question(page, name).getByRole("button", { name: value }).click();
const result = (page: Page) => checkCard(page).getByRole("status");

test("renders with its own layout and SEO tags", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^HKVO-Leitfaden:/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(
		page.getByRole("heading", {
			level: 1,
			name: "Die Heizkostenverordnung. Einfach erklärt.",
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
		/\/hkvo-leitfaden$/,
	);
	const jsonLd = await page
		.locator('script[type="application/ld+json"]')
		.allTextContents();
	const faq = jsonLd
		.map((t) => JSON.parse(t))
		.find((d) => d["@type"] === "FAQPage");
	expect(faq.mainEntity).toHaveLength(5);
});

test("is not in the sitemap yet", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	expect(sitemap).not.toContain("/hkvo-leitfaden</loc>");
});

for (const width of [375, 320]) {
	test(`has no horizontal overflow at ${width} px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 812 });
		await gotoHydrated(page);
		await answer(page, /fernablesbar/, "Nein");
		await answer(page, /12 Monaten/, "Nein");
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - window.innerWidth,
		);
		expect(overflow).toBeLessThanOrEqual(0);
	});
}

test("the footer, /vorgehen and the internal links resolve", async ({
	page,
	request,
}) => {
	await page.goto(PATH);
	expect(
		await hrefs(page.locator("footer a", { hasText: /^HKVO-Leitfaden$/ })),
	).toEqual([PATH]);
	const links = new Set([
		...(await hrefs(page.locator('footer a[href^="/"]'))),
		...(await hrefs(page.locator('main a[href^="/"]'))),
	]);
	expect(links).toContain("/upgrade-now");
	expect(links).toContain("/mieterportal");
	for (const href of links) {
		const response = await request.get(href);
		expect(response.status(), href).toBe(200);
	}
	await page.goto("/vorgehen");
	await page.getByRole("link", { name: "Zum HKVO-Leitfaden" }).click();
	await expect(page).toHaveURL(new RegExp(`${PATH}$`));
});

test("the CTAs lead to the guide, the penalties and the closing form", async ({
	page,
}) => {
	await page.goto(PATH);
	await expect(
		page.locator("main a", { hasText: "Leitfaden lesen" }),
	).toHaveAttribute("href", "#leitfaden");
	await expect(
		page.getByRole("link", { name: "Kürzungsrechte", exact: true }),
	).toHaveAttribute("href", "#kuerzung");
	await expect(
		page.locator("#s-kuerzung-kurz a", { hasText: "Zur Übersicht" }),
	).toHaveAttribute("href", "#kuerzung");
	await expect(page.locator("section#leitfaden")).toHaveCount(1);
	await expect(page.locator("section#kuerzung")).toHaveCount(1);
	await expect(
		page.locator("section.final#start input[name=email]"),
	).toHaveCount(1);
	await expect(
		page.locator("section[aria-labelledby=lf-h1]"),
	).not.toHaveAttribute("id", "start");
	await expect(page.locator("a.ctab")).toHaveAttribute("href", "#start");
	// The line to the Heizkostenabrechnungs-Checker.
	await expect(
		page.locator("#kuerzung a", { hasText: "Heizkostenabrechnung prüfen" }),
	).toHaveAttribute("href", "/heizkostenabrechnung-pruefen");
	await expect(page.locator("#kuerzung article")).toHaveCount(3);
});

test("the check scores the answers and shows the result", async ({ page }) => {
	await gotoHydrated(page);
	const score = checkCard(page).getByRole("img");
	await expect(score).toHaveAccessibleName("0 von 5 mit Ja");
	await expect(result(page)).toHaveText(
		"Beantworten Sie die Fragen mit Ja oder Nein.",
	);

	await answer(page, /jeder Wohnung/, "Ja");
	await expect(result(page)).toHaveText("Noch 4 Fragen offen.");
	await expect(
		question(page, /jeder Wohnung/).getByRole("button", { name: "Ja" }),
	).toHaveAttribute("aria-pressed", "true");

	// A "Nein" shows its risk; the risks keep the questions' order.
	await answer(page, /12 Monaten/, "Nein");
	await answer(page, /fernablesbar/, "Nein");
	const risks = result(page).getByRole("listitem");
	await expect(risks).toHaveText([
		"Ab 2027: Kürzungsrecht 3 % (§ 5)",
		"Nachzahlung entfällt (§ 556 BGB)",
	]);
	await expect(score).toHaveAccessibleName("1 von 5 mit Ja");

	// Changing the answers to "Ja" leaves one question open (singular).
	await answer(page, /fernablesbar/, "Ja");
	await answer(page, /12 Monaten/, "Ja");
	await answer(page, /Verbrauchsinfo/, "Ja");
	await expect(result(page)).toHaveText("Noch 1 Frage offen.");
	await expect(
		question(page, /fernablesbar/).getByRole("button", { name: "Nein" }),
	).toHaveAttribute("aria-pressed", "false");

	await answer(page, /50 bis 70/, "Ja");
	await expect(result(page)).toHaveText(
		"Alles erfüllt. Ihr Bestand ist HKVO-konform aufgestellt.",
	);
	await expect(score).toHaveAccessibleName("5 von 5 mit Ja");
	await expect(checkCard(page).locator("circle.fg")).toHaveCSS(
		"stroke-dasharray",
		/^100(px)?,? 100(px)?$/,
	);
});

test("the risk link leads to the closing form and focuses it", async ({
	page,
}) => {
	await gotoHydrated(page);
	await answer(page, /Verbrauchsinfo/, "Nein");
	const link = result(page).getByRole("link", {
		name: "Mit Heidi alle Punkte erfüllen →",
	});
	await expect(link).toHaveAttribute("href", "#start");
	await link.click();
	await expect(page.locator("#start input[name=email]")).toBeFocused();
});

test("the table of contents follows the reading", async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await gotoHydrated(page);
	const toc = page.getByRole("navigation", { name: "Inhalt" });
	await expect(toc.getByRole("link")).toHaveCount(9);
	const current = toc.locator('a[aria-current="true"]');
	await expect(current).toHaveText("01Für wen gilt die Heizkostenverordnung?");
	await expect(toc.locator(".prog i")).toHaveAttribute("style", /width: 0%/);

	await toc.getByRole("link", { name: /CO₂-Kosten aufteilen/ }).click();
	await expect(page).toHaveURL(/#s-co2$/);
	await expect(current).toHaveText("08CO₂-Kosten aufteilen");
	// The article lands below the sticky header.
	const top = await page
		.locator("#s-co2")
		.evaluate((el) => el.getBoundingClientRect().top);
	expect(top).toBeGreaterThan(60);
	const width = await toc
		.locator(".prog i")
		.evaluate((el) => parseFloat(el.style.width));
	expect(width).toBeGreaterThan(50);
	expect(width).toBeLessThan(100);
	// It stays in view while reading (sticky).
	await expect(toc).toBeInViewport();
});

test("hydrates without console errors or warnings", async ({ page }) => {
	const messages: string[] = [];
	page.on("console", (message) => {
		if (["error", "warning"].includes(message.type()))
			messages.push(message.text());
	});
	page.on("pageerror", (error) => messages.push(error.message));
	await gotoHydrated(page);
	await answer(page, /jeder Wohnung/, "Nein");
	await page.locator("summary").nth(1).click();
	await page.mouse.wheel(0, 3000);
	await page.waitForTimeout(300);
	expect(messages).toEqual([]);
});

test.describe("without JS", () => {
	test.use({ javaScriptEnabled: false });

	test("the questions read as a list, the guide and the form work", async ({
		page,
	}) => {
		await page.goto(PATH);
		const card = page.locator("section[aria-labelledby=lf-h1] .card");
		await expect(
			card.getByText("Sind alle Geräte fernablesbar?"),
		).toBeVisible();
		await expect(card.locator("button").first()).toBeHidden();
		await expect(card.getByRole("status")).toBeHidden();
		await expect(page.locator("#s-geltung")).toBeVisible();
		await expect(page.locator(".toc a").first()).toHaveAttribute(
			"aria-current",
			"true",
		);
		await expect(page.locator("section#start form")).toHaveAttribute(
			"method",
			/post/i,
		);
	});
});

test.describe("with reduced motion", () => {
	test.use({ reducedMotion: "reduce" });

	test("nothing waits to be revealed, no confetti", async ({ page }) => {
		await gotoHydrated(page);
		await expect(page.locator("main .rv-wait")).toHaveCount(0);
		for (const q of [
			/jeder Wohnung/,
			/fernablesbar/,
			/Verbrauchsinfo/,
			/50 bis 70/,
			/12 Monaten/,
		])
			await answer(page, q, "Ja");
		await expect(result(page)).toContainText("Alles erfüllt");
		await expect(page.locator("body > canvas")).toHaveCount(0);
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
