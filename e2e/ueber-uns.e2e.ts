import { expect, test, type Page } from "@playwright/test";

// No form on this page: its "Demo buchen" lead to /demo.
//
// The server renders with its real time; the page's clock takes over from the
// browser's on mount, so `page.clock` at a fixed time checks the client side.

const PATH = "/ueber-uns";

/** A Berlin wall-clock time as an instant (+01:00 in winter, +02:00 in summer). */
const berlin = (iso: string) => new Date(iso);
const OCT_12 = berlin("2026-10-12T12:00:00+02:00");
const DEC_31_NOON = berlin("2026-12-31T12:00:00+01:00");
const JAN_1_AFTER = berlin("2027-01-01T00:00:05+01:00");

async function gotoAt(page: Page, path: string, time: Date) {
	await page.clock.install({ time });
	await page.goto(path);
}

test("renders with its own layout and SEO tags", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^Über uns/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(page.locator("#header")).toHaveCount(0);
	// noindex until the go-live gate (plan §4.7), with a self-canonical
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		"noindex",
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		/\/ueber-uns$/,
	);
});

test("redirects the trailing slash", async ({ page }) => {
	await page.goto(`${PATH}/`);
	expect(new URL(page.url()).pathname).toBe(PATH);
});

test("has no horizontal overflow at 375 px", async ({ page }) => {
	await page.setViewportSize({ width: 375, height: 800 });
	await page.goto(PATH);
	const overflow = await page.evaluate(
		() =>
			document.documentElement.scrollWidth -
			document.documentElement.clientWidth,
	);
	expect(overflow).toBe(0);
});

test("the landing footer links here", async ({ page }) => {
	await page.goto("/messdienst-wechseln");
	await expect(
		page.locator("footer").getByRole("link", { name: "Über uns" }),
	).toHaveAttribute("href", PATH);
	// …and so does the trust block there
	await expect(
		page.locator(".trust").getByRole("link", { name: /Mehr über Heidi/ }),
	).toHaveAttribute("href", PATH);
});

test.describe("deadline card", () => {
	test.use({ reducedMotion: "reduce" });
	const card = (page: Page) => page.locator(".cd");

	test("12.10.2026: the same day count as /fernablesung-umruesten", async ({
		page,
	}) => {
		await gotoAt(page, PATH, OCT_12);
		await expect(card(page)).toContainText("80Tage");
		await gotoAt(page, "/fernablesung-umruesten", OCT_12);
		await expect(page.getByText("Noch 80 Tage").first()).toBeVisible();
	});

	test("31.12.2026: the last-day text", async ({ page }) => {
		await gotoAt(page, PATH, DEC_31_NOON);
		await expect(card(page)).toContainText("Letzter Tag");
		await expect(card(page)).not.toContainText("Tage");
	});

	test("1.1.2027: the expired texts", async ({ page }) => {
		await gotoAt(page, PATH, JAN_1_AFTER);
		await expect(card(page)).toContainText("Seit 1.1.2027 Pflicht");
		await expect(card(page)).not.toContainText("Bis zur Fernablesepflicht");
		await expect(page.getByText(/^Seit dem 1\.\sJanuar 2027/)).toBeVisible();
		await expect(card(page).locator(".bar i")).toHaveAttribute(
			"style",
			/width: 100%/,
		);
	});
});

test("principles: a button switches the panel", async ({ page }) => {
	await page.goto(PATH);
	const buttons = page.locator(".val button");
	await expect(buttons.nth(0)).toHaveAttribute("aria-pressed", "true");
	await buttons.nth(2).click();
	await expect(buttons.nth(2)).toHaveAttribute("aria-pressed", "true");
	await expect(buttons.nth(0)).toHaveAttribute("aria-pressed", "false");
	await expect(page.locator("#gs-panel")).toContainText(
		"Verbräuche gehören nicht in Aktenordner.",
	);
});

test.describe("service checklist", () => {
	const items = (page: Page) => page.locator(".stack li");
	const row = (page: Page) => page.locator(".stack .one");

	test.describe("with reduced motion", () => {
		test.use({ reducedMotion: "reduce" });

		test("shows everything at once, without replay", async ({ page }) => {
			await page.goto(PATH);
			await expect(items(page)).toHaveCount(5);
			for (const item of await items(page).all())
				await expect(item).toHaveCSS("opacity", "1");
			await expect(row(page)).toHaveCSS("opacity", "1");
			await expect(
				page.getByRole("button", { name: "Animation wiederholen" }),
			).toHaveCount(0);
		});
	});

	test("animates to the final state", async ({ page }) => {
		await page.goto(PATH);
		await expect(page.locator(".stack")).toHaveClass(/play/);
		await expect(row(page)).toHaveCSS("opacity", "1", { timeout: 5_000 });
		await expect(items(page).last()).toHaveCSS("opacity", "1");
		await page.getByRole("button", { name: "Animation wiederholen" }).click();
		await expect(row(page)).toHaveCSS("opacity", "1", { timeout: 5_000 });
	});
});

test.describe("CTAs", () => {
	test("the hero's and the header's Demo buchen open the booking page", async ({
		page,
	}) => {
		await page.goto(PATH);
		await expect(
			page.locator(".hero").getByRole("link", { name: /Demo buchen/ }),
		).toHaveAttribute("href", "/demo");
		await expect(page.locator("section.final a.dcta")).toHaveAttribute(
			"href",
			"/demo",
		);
		await page
			.locator("nav.top")
			.getByRole("link", { name: "Demo buchen" })
			.click();
		await expect(page).toHaveURL(/\/demo$/);
	});

	test("Kundenstimmen lesen scrolls to the testimonials", async ({ page }) => {
		await page.goto(PATH);
		await page.getByRole("link", { name: /Kundenstimmen lesen/ }).click();
		await expect(page).toHaveURL(/#stimmen$/);
		await expect(page.locator("#stimmen")).toBeInViewport();
	});

	test("career links go to /karriere in the same tab", async ({ page }) => {
		await page.goto(PATH);
		const main = page.locator("main");
		for (const [name, href] of [
			["Karriere bei Heidi", "/karriere"],
			["Offene Stellen", "/karriere#stellen"],
			["Zur Karriereseite", "/karriere"],
		]) {
			const link = main.getByRole("link", { name });
			await expect(link).toHaveAttribute("href", href);
			await expect(link).not.toHaveAttribute("target");
			await expect(link).not.toHaveAttribute("rel");
		}
	});
});

test.describe("without JavaScript", () => {
	test.use({ javaScriptEnabled: false });

	test("renders the final state from the server", async ({ page }) => {
		await page.goto(PATH);
		await expect(page.locator(".cd b")).toHaveText(/^\d+$/);
		await expect(page.locator("#gs-panel")).toContainText(
			"Ein Messdienst darf keine Projektarbeit sein.",
		);
		await expect(page.locator(".stack .one")).toHaveCSS("opacity", "1");
		await expect(page.locator(".nums b").first()).toContainText("92");
	});
});
