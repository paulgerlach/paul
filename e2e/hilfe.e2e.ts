import { expect, test, type Locator, type Page } from "@playwright/test";

// Votes go to the local webhook sink from playwright.config.ts; no database
// needed. A vote has no email, so each test votes on its own question and
// counts that question's events.

const PATH = "/hilfe";
const WEBHOOK_EVENTS = "http://127.0.0.1:4199/events";

type FeedbackEvent = {
	event_type: string;
	question?: string;
	vote?: string;
	page?: string;
	email?: string;
};

async function votesFor(page: Page, question: string) {
	const events: FeedbackEvent[] = await (
		await page.request.get(WEBHOOK_EVENTS)
	).json();
	return events.filter(
		(event) =>
			event.event_type === "helpfeedback" && event.question === question,
	);
}

async function hrefs(links: Locator) {
	return (await links.evaluateAll((els) =>
		els.map((el) => el.getAttribute("href")),
	)) as string[];
}

const questions = (page: Page) => page.locator("details.q:not([hidden])");
const searchField = (page: Page) =>
	page.getByRole("searchbox", { name: "Hilfe-Center durchsuchen" });

/** Waits for hydration, so typing reaches the live search. */
const gotoHydrated = (page: Page, path = PATH) =>
	page.goto(path, { waitUntil: "networkidle" });

test("renders with its own layout and SEO tags", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^Hilfe-Center/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(page.locator("#header")).toHaveCount(0);
	// noindex until the go-live gate (plan §4.5), with a self-canonical
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		"noindex",
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		/\/hilfe$/,
	);
	await expect(questions(page)).toHaveCount(22);

	const jsonLd = await page
		.locator('script[type="application/ld+json"]')
		.textContent();
	const faq = JSON.parse(jsonLd ?? "{}");
	expect(faq["@type"]).toBe("FAQPage");
	expect(faq.mainEntity).toHaveLength(22);
});

test("a search URL keeps the canonical /hilfe", async ({ page }) => {
	await page.goto(`${PATH}?q=uvi`);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		/\/hilfe$/,
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

test("the footer's Hilfe-Center link and internal links resolve", async ({
	page,
	request,
}) => {
	await page.goto(PATH);
	await expect(
		page.locator("footer").getByRole("link", { name: "Hilfe-Center" }),
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

test.describe("search", () => {
	test("filters, marks and opens as you type", async ({ page }) => {
		await gotoHydrated(page);
		await searchField(page).fill("lauft");

		await expect(questions(page)).toHaveCount(1);
		const card = questions(page).first();
		await expect(card).toHaveAttribute("id", "q-laufender-vertrag");
		await expect(card).toHaveAttribute("open", "");
		await expect(card.locator("mark")).toHaveText("läuft");
		await expect(page.locator(".res")).toHaveText("1 Ergebnis für „lauft“");
		// Topics without a match are hidden.
		await expect(page.locator("section[id^='c-']:not([hidden])")).toHaveCount(
			1,
		);
		await expect(page).toHaveURL(/\?q=lauft$/);
	});

	test("shows the empty state and restores the list with Escape", async ({
		page,
	}) => {
		await gotoHydrated(page);
		await searchField(page).fill("xyz");
		await expect(questions(page)).toHaveCount(0);
		await expect(
			page.getByRole("link", { name: /Kontakt aufnehmen/ }),
		).toHaveAttribute("href", "/messdienstwechsel#start");
		await expect(page).toHaveURL(/\?q=xyz$/);

		await searchField(page).press("Escape");
		await expect(questions(page)).toHaveCount(22);
		await expect(page.locator(".res")).toHaveText("");
		await expect(page).toHaveURL(/\/hilfe$/);
	});

	test("works on the server without JS", async ({ browser }) => {
		const context = await browser.newContext({ javaScriptEnabled: false });
		const page = await context.newPage();
		await page.goto(PATH);
		await searchField(page).fill("lauft");
		await searchField(page).press("Enter");
		await expect(page).toHaveURL(/\?q=lauft$/);
		await expect(questions(page)).toHaveCount(1);
		await expect(page.locator(".res")).toHaveText("1 Ergebnis für „lauft“");
		await expect(questions(page).first()).toHaveAttribute("open", "");
		await context.close();
	});

	test("/ focuses the search, but not from another field", async ({ page }) => {
		await gotoHydrated(page);
		await page.locator("body").press("/");
		await expect(searchField(page)).toBeFocused();

		const newsletter = page.locator('footer input[type="email"]');
		await newsletter.fill("a");
		await newsletter.press("/");
		await expect(newsletter).toBeFocused();
		await expect(newsletter).toHaveValue("a/");
	});
});

test.describe("navigation", () => {
	test("a popular question opens its card in view", async ({ page }) => {
		await gotoHydrated(page);
		await page
			.locator(".pops")
			.getByRole("link", { name: "Was kostet die Installation?" })
			.click();
		const card = page.locator("#q-installation-kosten");
		await expect(card).toHaveAttribute("open", "");
		await expect(card).toBeInViewport();
		await expect(page).toHaveURL(/#q-installation-kosten$/);
	});

	test("a topic card opens its first question", async ({ page }) => {
		await gotoHydrated(page);
		await page.locator("a.cat", { hasText: "Für Mieter" }).click();
		await expect(page.locator("#q-mieter-verbrauch")).toHaveAttribute(
			"open",
			"",
		);
		await expect(page.locator("#c-mieter")).toBeInViewport();
	});

	test("a deep link opens its card, even past a search", async ({ page }) => {
		await page.goto(`${PATH}?q=xyz#q-uvi`);
		const card = page.locator("#q-uvi");
		await expect(card).toHaveAttribute("open", "");
		await expect(card).toBeInViewport();
		await expect(page).toHaveURL(/\/hilfe#q-uvi$/);
	});
});

test.describe("feedback", () => {
	test("a vote thanks and sends one event without an email", async ({
		page,
	}) => {
		await gotoHydrated(page);
		const before = (await votesFor(page, "dashboard")).length;
		const card = page.locator("#q-dashboard");
		await card.locator("summary").click();
		await card.getByRole("button", { name: "Ja" }).click();
		await expect(card.getByRole("status")).toHaveText(
			"Danke für Ihr Feedback!",
		);
		await expect(card.getByRole("button", { name: "Ja" })).toHaveCount(0);

		await expect
			.poll(async () => (await votesFor(page, "dashboard")).length)
			.toBe(before + 1);
		const event = (await votesFor(page, "dashboard")).at(-1)!;
		expect(event).toMatchObject({ vote: "yes", page: "/hilfe" });
		expect(event).not.toHaveProperty("email");
	});

	test("a vote without JS comes back thanked at its card", async ({
		browser,
	}) => {
		const context = await browser.newContext({ javaScriptEnabled: false });
		const page = await context.newPage();
		await page.goto(PATH);
		const before = (await votesFor(page, "monteure")).length;
		const card = page.locator("#q-monteure");
		await card.locator("summary").click();
		await card.getByRole("button", { name: "Nein" }).click();

		await expect(page).toHaveURL(/#q-monteure$/);
		const after = page.locator("#q-monteure");
		await expect(after).toHaveAttribute("open", "");
		await expect(after.getByRole("status")).toHaveText(
			"Danke für Ihr Feedback!",
		);
		expect((await votesFor(page, "monteure")).at(-1)).toMatchObject({
			vote: "no",
		});
		expect((await votesFor(page, "monteure")).length).toBe(before + 1);
		await context.close();
	});

	test("a forged id is thanked and sends nothing", async ({ page }) => {
		const before = (await votesFor(page, "gibt-es-nicht")).length;
		const response = await page.request.post(`${PATH}?/feedback`, {
			form: { question: "gibt-es-nicht", vote: "yes" },
			// SvelteKit's CSRF check wants a same-origin form post.
			headers: { origin: "http://localhost:4173" },
		});
		expect(response.status()).toBe(200);
		expect((await votesFor(page, "gibt-es-nicht")).length).toBe(before);
	});
});
