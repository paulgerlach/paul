import { expect, test, type Locator, type Page } from "@playwright/test";
import { GATED_ROBOTS, expectGated } from "./launch.ts";

// No form on this page: its "Demo buchen" lead to /demo. A download is
// reported to the local webhook sink from playwright.config.ts.

const PATH = "/presse";
const WEBHOOK_EVENTS = "http://127.0.0.1:4199/events";

type DownloadEvent = { event_type: string; file?: string; page?: string };

async function downloadEvents(page: Page, file: string) {
	const events: DownloadEvent[] = await (
		await page.request.get(WEBHOOK_EVENTS)
	).json();
	return events.filter(
		(event) => event.event_type === "pressdownload" && event.file === file,
	);
}
const BOILERPLATE_START =
	"Die Heidi Systems GmbH mit Sitz in Berlin ist ein digitaler Messdienst";

async function hrefs(links: Locator) {
	return (await links.evaluateAll((els) =>
		els.map((el) => el.getAttribute("href")),
	)) as string[];
}

/** Waits for hydration, so the page's handlers run. */
const gotoHydrated = (page: Page) =>
	page.goto(PATH, { waitUntil: "networkidle" });

const kit = (page: Page) => page.locator("#pr-kit");
const copyButton = (page: Page) =>
	page.getByRole("button", { name: /Text kopieren|Kopiert/ });

test("renders with its own layout and SEO tags", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^Presse:/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(page.locator("h1")).toHaveText(/^Hallo,\s*Presse\.$/);
	await expect(page.locator("#header")).toHaveCount(0);
	// noindex until LAUNCHED (its go-live gate), with a self-canonical
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		GATED_ROBOTS,
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		/\/presse$/,
	);
});

test("is in the sitemap once launched", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	expectGated(sitemap).toContain("/presse</loc>");
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

test("the footer link, the internal links and the downloads resolve", async ({
	page,
	request,
}) => {
	await page.goto(PATH);
	expect(
		await hrefs(page.locator("footer a", { hasText: /^Presse$/ })),
	).toEqual([PATH]);
	const links = new Set([
		...(await hrefs(page.locator('footer a[href^="/"]'))),
		...(await hrefs(page.locator('main a[href^="/"]'))),
	]);
	for (const href of links) {
		const response = await request.get(href);
		expect(response.status(), href).toBe(200);
	}
	const downloads = kit(page).locator("a[download]");
	await expect(downloads).toHaveCount(4);
	const types: Record<string, RegExp> = {
		"Heidi-Logo-dunkel.svg": /image\/svg\+xml/,
		"Heidi-Logo-hell.svg": /image\/svg\+xml/,
		"Heidi-Bildmarke.svg": /image\/svg\+xml/,
		"Heidi-Systems-Unternehmensprofil.txt": /text\/plain/,
	};
	for (const link of await downloads.all()) {
		const file = (await link.getAttribute("download")) ?? "";
		expect(await link.getAttribute("href")).toBe(`/landing/presse/${file}`);
		const response = await request.get(`/landing/presse/${file}`);
		expect(response.status(), file).toBe(200);
		expect(response.headers()["content-type"], file).toMatch(types[file]);
	}
	const profile = await (
		await request.get("/landing/presse/Heidi-Systems-Unternehmensprofil.txt")
	).text();
	expect(profile).toContain(BOILERPLATE_START);
});

test("the CTAs lead to the booking page, the mail links to the press", async ({
	page,
}) => {
	await gotoHydrated(page);
	await expect(page.locator("section.final a.dcta")).toHaveAttribute(
		"href",
		"/demo",
	);
	await expect(
		page.locator("section[aria-labelledby=pr-h1]"),
	).not.toHaveAttribute("id", "start");
	await expect(page.locator("a.ctab")).toHaveAttribute("href", "/demo");
	const mail = "mailto:presse@heidisystems.com";
	await expect(
		page.getByRole("link", { name: "presse@heidisystems.com" }),
	).toHaveAttribute("href", mail);
	await expect(
		page.getByRole("link", { name: "E-Mail senden" }),
	).toHaveAttribute("href", mail);
	const talk = page.getByRole("link", { name: "Gespräch vereinbaren" });
	await expect(talk).toHaveAttribute("href", "/demo");
});

test("a download saves its file, says so and is reported", async ({ page }) => {
	await gotoHydrated(page);
	const file = "Heidi-Systems-Unternehmensprofil.txt";
	const before = (await downloadEvents(page, file)).length;
	const row = kit(page).getByRole("link", { name: /Unternehmensprofil/ });
	const [download] = await Promise.all([
		page.waitForEvent("download"),
		row.click(),
	]);
	expect(download.suggestedFilename()).toBe(
		"Heidi-Systems-Unternehmensprofil.txt",
	);
	await expect(row).toHaveClass(/\bok\b/);
	await expect(kit(page).locator(".msg")).toHaveText(
		"Gespeichert: Heidi-Systems-Unternehmensprofil.txt",
	);
	// Parallel runs report the same file, so count up from before.
	await expect
		.poll(async () => (await downloadEvents(page, file)).length)
		.toBeGreaterThan(before);
	const [event] = await downloadEvents(page, file);
	expect(event).toEqual({
		event_type: "pressdownload",
		timestamp: expect.any(String),
		file,
		page: "/presse",
	});
});

test("copies the boilerplate", async ({ page, context, browserName }) => {
	test.skip(browserName !== "chromium", "clipboard permissions");
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	await gotoHydrated(page);
	const button = copyButton(page);
	await expect(button).toHaveText("Text kopieren");
	await button.click();
	await expect(button).toHaveText("Kopiert");
	await expect(button).toHaveClass(/\bok\b/);
	await expect(
		page.getByRole("status").filter({ hasText: "Text kopiert" }),
	).toHaveCount(1);
	const clipboard = await page.evaluate(() => navigator.clipboard.readText());
	expect(clipboard.startsWith(BOILERPLATE_START)).toBe(true);
	expect(clipboard).toBe(
		(await page.locator("#pr-bt, .bp .bt").first().textContent())?.trim(),
	);
	// Back after 2.2 s
	await expect(button).toHaveText("Text kopieren", { timeout: 4000 });
});

test("the facts count to their values, the mark grows and glows", async ({
	page,
}) => {
	await gotoHydrated(page);
	const name = page.locator("#pr-name");
	await name.scrollIntoViewIfNeeded();
	await expect(name).toHaveClass(/\bgo\b/);
	await expect(name).toHaveClass(/\bwarm\b/, { timeout: 4000 });
	const counted = page.locator(".facts .n");
	await counted.first().scrollIntoViewIfNeeded();
	await expect(counted).toHaveText(["92", "14"], { timeout: 4000 });
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

	test("everything reads, the copy button is hidden", async ({ page }) => {
		await page.goto(PATH);
		await expect(page.locator(".facts .n")).toHaveText(["92", "14"]);
		await expect(page.locator("#pr-name")).toHaveClass(/\bgo\b/);
		await expect(copyButton(page)).toBeHidden();
		await expect(kit(page).locator("a[download]")).toHaveCount(4);
		await expect(page.locator("section.final a.dcta")).toHaveAttribute(
			"href",
			"/demo",
		);
	});
});

test.describe("with reduced motion", () => {
	test.use({ reducedMotion: "reduce" });

	test("nothing waits, the mark is grown and doesn't glow", async ({
		page,
	}) => {
		await gotoHydrated(page);
		await expect(page.locator("main .rv-wait")).toHaveCount(0);
		const name = page.locator("#pr-name");
		await name.scrollIntoViewIfNeeded();
		await expect(name).toHaveClass(/\bgo\b/);
		await page.waitForTimeout(1600);
		await expect(name).not.toHaveClass(/\bwarm\b/);
		await expect(page.locator(".facts .n")).toHaveText(["92", "14"]);
	});
});
