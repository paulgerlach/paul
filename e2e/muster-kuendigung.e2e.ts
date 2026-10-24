import { readFile } from "node:fs/promises";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { GATED_ROBOTS, expectGated } from "./launch.ts";

// No form on this page: its "Demo buchen" lead to /demo.

const PATH = "/messdienst-wechseln/muster-kuendigung";

async function hrefs(links: Locator) {
	return (await links.evaluateAll((els) =>
		els.map((el) => el.getAttribute("href")),
	)) as string[];
}

/** Waits for hydration, so the page's handlers run. */
const gotoHydrated = (page: Page) =>
	page.goto(PATH, { waitUntil: "networkidle" });

const preview = (page: Page) =>
	page.getByRole("document", { name: "Vorschau der Kündigung" });

async function fillForm(page: Page) {
	await page
		.getByLabel("Hausverwaltung oder Eigentümer")
		.fill("Muster Hausverwaltung GmbH");
	await page.getByLabel("PLZ und Ort").fill("10115 Berlin");
	await page
		.getByLabel("Name des Messdienstleisters")
		.fill("Alt-Messdienst AG");
	await page
		.getByLabel(/^Liegenschaften/)
		.fill("Lindenallee 12, 10115 Berlin\nAhornweg 3, 10117 Berlin");
}

test("renders with its own layout and SEO tags", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^Muster-Kündigung Messdienst:/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(page.locator("h1")).toHaveText(
		"Messdienst kündigen. In zwei Minuten.",
	);
	await expect(page.locator("#header")).toHaveCount(0);
	// noindex until LAUNCHED (its go-live gate), with a self-canonical
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		GATED_ROBOTS,
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		/\/messdienst-wechseln\/muster-kuendigung$/,
	);
});

test("is in the sitemap once launched", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	expectGated(sitemap).toContain(
		"/messdienst-wechseln/muster-kuendigung</loc>",
	);
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

test("the footer, the other pages and the internal links lead here", async ({
	page,
	request,
}) => {
	await page.goto(PATH);
	expect(
		await hrefs(page.locator("footer a", { hasText: /^Muster-Kündigung$/ })),
	).toEqual([PATH]);
	const links = new Set([
		...(await hrefs(page.locator('footer a[href^="/"]'))),
		...(await hrefs(page.locator('main a[href^="/"]'))),
	]);
	for (const href of links) {
		const response = await request.get(href);
		expect(response.status(), href).toBe(200);
	}
	for (const [path, text] of [
		["/fristenrechner", "Muster-Kündigung"],
		["/kunden/weg-verwaltung", "Zur Muster-Kündigung"],
		["/kunden/wohnungsunternehmen", "Muster-Kündigung herunterladen"],
		["/kunden/asset-manager", "Muster-Kündigung herunterladen"],
	]) {
		await page.goto(path);
		expect(
			await hrefs(page.locator("main a", { hasText: text })),
			path,
		).toContain(PATH);
	}
	await page.goto("/hilfe");
	await expect(
		page.locator("#q-kuendigung a", { hasText: "Muster-Kündigung" }),
	).toHaveAttribute("href", PATH);
});

test("the CTAs lead to the generator, the booking page and the switch page", async ({
	page,
}) => {
	await gotoHydrated(page);
	await expect(
		page.getByRole("link", { name: /Kündigung erstellen/ }),
	).toHaveAttribute("href", "#vorlage");
	await expect(page.locator("section#vorlage")).toHaveCount(1);
	await expect(
		page.getByRole("link", { name: /Heidi kündigt für Sie/ }),
	).toHaveAttribute("href", "/messdienst-wechseln");
	await expect(page.locator("section.final a.dcta")).toHaveAttribute(
		"href",
		"/demo",
	);
	await expect(page.locator("a.ctab")).toHaveAttribute("href", "/demo");
	await expect(
		page.locator("main a", { hasText: "Vertragsenden prüfen" }),
	).toHaveAttribute("href", "/portfolio-check");
	const demo = page.locator("section[aria-labelledby=mk-hu-h] a", {
		hasText: /^Demo buchen/,
	});
	await expect(demo).toHaveAttribute("href", "/demo");
});

test("the preview follows the form", async ({ page }) => {
	await gotoHydrated(page);
	await expect(preview(page)).toContainText("[Name der Verwaltung]");
	await expect(preview(page)).toContainText(
		"die oben genannte Liegenschaft fristgerecht zum nächstmöglichen Zeitpunkt.",
	);
	await fillForm(page);
	await expect(preview(page)).toContainText("Muster Hausverwaltung GmbH");
	await expect(preview(page)).toContainText(/Berlin, \d\d\.\d\d\.\d{4}/);
	await expect(preview(page)).toContainText("Liegenschaften:");
	await expect(preview(page)).toContainText("Ahornweg 3, 10117 Berlin");

	await page.getByRole("radio", { name: "Zu einem Datum" }).click();
	await expect(preview(page)).toContainText(
		"die oben genannten Liegenschaften zum [Datum].",
	);
	await page.getByLabel("Kündigen zum").fill("2027-12-31");
	await expect(preview(page)).toContainText("zum 31.12.2027.");

	const clause = "Bitte bestätigen Sie uns den Eingang dieser Kündigung";
	await expect(preview(page)).toContainText(clause);
	await page.getByLabel(/Vertragsende bestätigen lassen/).uncheck();
	await expect(preview(page)).not.toContainText(clause);
	await page.getByLabel(/Im Auftrag der Eigentümer/).check();
	await expect(preview(page)).toContainText(
		"Wir handeln als Verwaltung im Namen und im Auftrag der Eigentümer.",
	);
});

test("downloads Word and PDF without sending anything", async ({ page }) => {
	await gotoHydrated(page);
	const requests: string[] = [];
	page.on("request", (request) => {
		const url = new URL(request.url());
		// The writers load as same-origin modules; everything else counts.
		if (request.url().startsWith("blob:")) return;
		if (
			request.resourceType() === "script" &&
			url.origin === new URL(page.url()).origin
		)
			return;
		requests.push(request.url());
	});
	await fillForm(page);
	const status = page.getByRole("status").filter({ hasText: "Download" });

	const [docx] = await Promise.all([
		page.waitForEvent("download"),
		page.getByRole("button", { name: "Word herunterladen" }).click(),
	]);
	expect(docx.suggestedFilename()).toBe("Kuendigung-Alt-Messdienst-AG.docx");
	const zip = await readFile((await docx.path())!);
	expect(zip.subarray(0, 2).toString()).toBe("PK");
	expect(zip.toString("utf8")).toContain("word/document.xml");
	expect(zip.toString("utf8")).toContain("Muster Hausverwaltung GmbH");
	await expect(status).toHaveText(
		"Download gestartet: Kuendigung-Alt-Messdienst-AG.docx",
	);

	const [pdf] = await Promise.all([
		page.waitForEvent("download"),
		page.getByRole("button", { name: "PDF", exact: true }).click(),
	]);
	expect(pdf.suggestedFilename()).toBe("Kuendigung-Alt-Messdienst-AG.pdf");
	const bytes = await readFile((await pdf.path())!);
	expect(bytes.subarray(0, 8).toString()).toBe("%PDF-1.4");
	expect(bytes.toString("latin1")).toContain("(Alt-Messdienst AG) Tj");
	await expect(status).toHaveText(
		"Download gestartet: Kuendigung-Alt-Messdienst-AG.pdf",
	);
	expect(requests).toEqual([]);
});

test("copies the letter", async ({ page, context, browserName }) => {
	test.skip(browserName !== "chromium", "clipboard permissions");
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	await gotoHydrated(page);
	await fillForm(page);
	const button = page.getByRole("button", { name: /Text kopieren|Kopiert/ });
	await button.click();
	await expect(button).toHaveText("Kopiert");
	const clipboard = await page.evaluate(() => navigator.clipboard.readText());
	expect(
		clipboard.startsWith(
			"Muster Hausverwaltung GmbH\n[Straße, Hausnummer]\n10115 Berlin\n\nAlt-Messdienst AG",
		),
	).toBe(true);
	expect(clipboard).toContain("Mit freundlichen Grüßen");
	// Back after 2 s
	await expect(button).toHaveText("Text kopieren", { timeout: 4000 });
});

test("the checklist counts and finishes", async ({ page }) => {
	await gotoHydrated(page);
	const cards = page.locator("section[aria-labelledby=mk-ck-h] button");
	await expect(cards).toHaveCount(4);
	const line = page.getByText(/von 4 geprüft|Alles geprüft/);
	await expect(line).toHaveText("0 von 4 geprüft");
	await cards.nth(0).click();
	await expect(cards.nth(0)).toHaveAttribute("aria-pressed", "true");
	await expect(line).toHaveText("1 von 4 geprüft");
	for (const i of [1, 2, 3]) await cards.nth(i).click();
	await expect(line).toHaveText("Alles geprüft. Bereit zum Versand.");
	await cards.nth(3).click();
	await expect(line).toHaveText("3 von 4 geprüft");
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

	test("the template reads, the buttons are hidden", async ({ page }) => {
		await page.goto(PATH);
		await expect(preview(page)).toContainText("[Name der Verwaltung]");
		await expect(preview(page)).toContainText(/\[Ort\], \d\d\.\d\d\.\d{4}/);
		await expect(
			page.getByRole("button", { name: "Word herunterladen" }),
		).toBeHidden();
		await expect(
			page.getByRole("button", { name: "Text kopieren" }),
		).toBeHidden();
		await expect(page.locator(".sig path")).toBeVisible();
		await expect(page.locator("section.final a.dcta")).toHaveAttribute(
			"href",
			"/demo",
		);
	});
});

test.describe("with reduced motion", () => {
	test.use({ reducedMotion: "reduce" });

	test("nothing waits or moves", async ({ page }) => {
		await gotoHydrated(page);
		await expect(page.locator("main .rv-wait")).toHaveCount(0);
		const animation = await page
			.locator(".sig path")
			.evaluate((el) => getComputedStyle(el).animationName);
		expect(animation).toBe("none");
		await expect(page.getByText("DOCX", { exact: true })).toHaveCSS(
			"opacity",
			"1",
		);
	});
});
