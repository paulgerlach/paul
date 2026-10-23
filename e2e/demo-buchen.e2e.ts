import { expect, test, type Locator, type Page } from "@playwright/test";
import { GATED_ROBOTS, expectGated } from "./launch.ts";

// No form on this page: the booking happens in Google Calendar, in a new tab.

const PATH = "/demo";
const CALENDAR = "https://calendar.app.google/SoRA89i76t4W28tNA";

async function hrefs(links: Locator) {
	return (await links.evaluateAll((els) =>
		els.map((el) => el.getAttribute("href")),
	)) as string[];
}

/** Waits for hydration, so the page's handlers run. */
const gotoHydrated = (page: Page) =>
	page.goto(PATH, { waitUntil: "networkidle" });

const card = (page: Page) =>
	page.getByRole("group", { name: "Demo-Termin buchen" });
const days = (page: Page) => card(page).locator(".days a");

test("renders with its own layout and SEO tags", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^Demo buchen:/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(page.locator("h1")).toHaveText(
		"Sehen Sie Heidi mit Ihrem eigenen Bestand.",
	);
	// noindex until LAUNCHED (its go-live gate), with a self-canonical
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		GATED_ROBOTS,
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		/\/demo$/,
	);
});

test("is in the sitemap once launched", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	expectGated(sitemap).toContain("/demo</loc>");
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

test("the booking card opens the calendar in a new tab", async ({ page }) => {
	await page.clock.setFixedTime(new Date("2026-10-21T10:00:00Z"));
	await gotoHydrated(page);
	await expect(days(page)).toHaveCount(5);
	// The five weekdays after Wednesday, 21.10.2026.
	await expect(days(page).locator("b")).toHaveText([
		"22",
		"23",
		"26",
		"27",
		"28",
	]);
	await expect(days(page).first()).toContainText("Do");
	const links = card(page).locator("a");
	expect(new Set(await hrefs(links))).toEqual(new Set([CALENDAR]));
	for (const target of await links.evaluateAll((els) =>
		els.map((el) => el.getAttribute("target")),
	))
		expect(target).toBe("_blank");
	await expect(
		card(page).getByRole("link", { name: /Freie Termine ansehen/ }),
	).toBeVisible();
});

test("every Demo buchen and the closing button lead back to the card", async ({
	page,
}) => {
	await gotoHydrated(page);
	await expect(
		page.locator("nav.top").getByRole("link", { name: "Demo buchen" }),
	).toHaveAttribute("href", "#start");
	await expect(
		page.locator("section.trust a", { hasText: "Demo buchen" }),
	).toHaveAttribute("href", "#start");
	await expect(page.locator("a.ctab")).toHaveCount(0);
	await expect(
		page.locator("footer").getByRole("link", { name: "Demo buchen" }),
	).toHaveAttribute("href", "#start");

	await page.getByRole("link", { name: /Jetzt Termin wählen/ }).click();
	await expect(card(page)).toBeInViewport();
	await expect(card(page)).toHaveClass(/flash/);
	await expect(page).toHaveURL(new RegExp(`${PATH}$`));
});

test("the checklist ticks off and counts", async ({ page }) => {
	await gotoHydrated(page);
	const items = page.locator(".prep button");
	const status = page.locator(".prep-s");
	await expect(items).toHaveCount(4);
	await expect(status).toHaveText("0 von 4 abgehakt");
	await items.nth(1).click();
	await expect(items.nth(1)).toHaveAttribute("aria-pressed", "true");
	await expect(status).toHaveText("1 von 4 abgehakt");
	for (const i of [0, 2, 3]) await items.nth(i).click();
	await expect(status).toHaveText("Alles bereit. Wir freuen uns auf Sie.");
	await items.nth(1).click();
	await expect(items.nth(1)).toHaveAttribute("aria-pressed", "false");
	await expect(status).toHaveText("3 von 4 abgehakt");
});

test("the quotes, the FAQ and the logos are the design's", async ({ page }) => {
	await page.goto(PATH);
	await expect(page.locator("section.tm figcaption b")).toHaveText([
		"Fabian Höhne",
		"Klaus Gerhard",
	]);
	await expect(page.locator(".hero figcaption b")).toHaveText("Gotthard Werne");
	await expect(page.locator("#faq summary")).toHaveText([
		"Kostet die Demo etwas?",
		"Müssen wir bis zum Vertragsende warten?",
		"Wie setzen sich die Kosten zusammen?",
		"Wer sollte bei der Demo dabei sein?",
	]);
	await expect(page.locator("section.logos img")).toHaveCount(12);
});

test("other pages' Demo buchen lead here", async ({ page }) => {
	for (const path of ["/messdienst-wechseln", "/kontakt", "/blog"]) {
		await page.goto(path);
		await expect(
			page.locator("nav.top").getByRole("link", { name: "Demo buchen" }),
			path,
		).toHaveAttribute("href", PATH);
	}
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

	test("the card shows its days and the calendar link", async ({ page }) => {
		await page.goto(PATH);
		await expect(days(page)).toHaveCount(5);
		await expect(
			card(page).getByRole("link", { name: /Freie Termine ansehen/ }),
		).toHaveAttribute("href", CALENDAR);
		await expect(page.locator(".prep-s")).toBeHidden();
	});
});
