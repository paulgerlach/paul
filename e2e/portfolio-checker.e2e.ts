import { readFile } from "node:fs/promises";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { GATED_ROBOTS, expectGated } from "./launch.ts";

// The signup test saves a lead, so it needs a database with the `leads` table.
// Webhooks go to the local sink from playwright.config.ts, also the counts of
// "Unterlagen prüfen".

const PATH = "/portfolio-check";
const WEBHOOK_EVENTS = "http://127.0.0.1:4199/events";
/** 19.10.2026, noon in Berlin: the example's dates are fixed by it. */
const TODAY = new Date("2026-10-19T10:00:00Z");

const testEmail = (name: string) =>
	`e2e-pc-${name}-${Date.now()}-${Math.round(Math.random() * 1e6)}@example.com`;

async function webhookFor(page: Page, email: string) {
	const events: { email: string }[] = await (
		await page.request.get(WEBHOOK_EVENTS)
	).json();
	return events.find((event) => event.email === email);
}

type RunEvent = { event_type: string; mode?: string };

async function runEvents(page: Page, mode: string) {
	const events: RunEvent[] = await (
		await page.request.get(WEBHOOK_EVENTS)
	).json();
	return events.filter(
		(event) => event.event_type === "portfoliocheckrun" && event.mode === mode,
	);
}

async function hrefs(links: Locator) {
	return (await links.evaluateAll((els) =>
		els.map((el) => el.getAttribute("href")),
	)) as string[];
}

/** Waits for hydration, so the tool's handlers run. */
const gotoHydrated = (page: Page) =>
	page.goto(PATH, { waitUntil: "networkidle" });

/** With the browser's date fixed to TODAY (timers keep running). */
async function gotoOnDay(page: Page) {
	await page.clock.setFixedTime(TODAY);
	await gotoHydrated(page);
}

const tool = (page: Page) => page.locator("#checker");
const files = (page: Page) => tool(page).locator("li");
const result = (page: Page) => page.locator("section#auswertung");
const exampleButton = (page: Page) =>
	page.getByRole("button", { name: "Mit Beispielunterlagen testen" });

/** Own files: a PDF and a .docx (pickable, but not supported). */
const OWN = [
	{
		name: "Vertrag_Hofweg.pdf",
		mimeType: "application/pdf",
		buffer: Buffer.from("%PDF-1.4"),
	},
	{
		name: "Nachtrag.docx",
		mimeType:
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		buffer: Buffer.from("x"),
	},
];

test("renders with its own layout and SEO tags", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^Portfolio-Checker:/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(page.locator("h1")).toHaveText(
		"Vertragsunterlagen hochladen. Heidi liest den Rest.",
	);
	await expect(page.locator("#header")).toHaveCount(0);
	// noindex until LAUNCHED (its go-live gate), with a self-canonical
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		GATED_ROBOTS,
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		/\/portfolio-check$/,
	);
	// The result only exists after a run.
	await expect(result(page)).toHaveCount(0);
});

test("is in the sitemap once launched", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	expectGated(sitemap).toContain("/portfolio-check</loc>");
});

for (const width of [375, 320]) {
	test(`has no horizontal overflow at ${width} px, also with the evaluation`, async ({
		page,
	}) => {
		await page.setViewportSize({ width, height: 812 });
		await gotoHydrated(page);
		const overflow = () =>
			page.evaluate(
				() => document.documentElement.scrollWidth - window.innerWidth,
			);
		expect(await overflow()).toBeLessThanOrEqual(0);
		await exampleButton(page).click();
		await expect(result(page)).toBeVisible({ timeout: 15_000 });
		expect(await overflow()).toBeLessThanOrEqual(0);
	});
}

test("the footer and the other pages lead here, the internal links on", async ({
	page,
	request,
}) => {
	await page.goto(PATH);
	expect(
		await hrefs(page.locator("footer a", { hasText: /^Portfolio-Checker$/ })),
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
		["/fristenrechner", "Zum Portfolio-Checker"],
		["/messdienst-wechseln/muster-kuendigung", "Vertragsenden prüfen"],
		["/neuigkeiten", "Bestand prüfen"],
		["/kunden/wohnungsunternehmen", "Portfolio kostenlos prüfen"],
		["/kunden/asset-manager", "Portfolio kostenlos prüfen"],
	]) {
		await page.goto(path);
		await expect(
			page.locator("main a", { hasText: text }).first(),
			path,
		).toHaveAttribute("href", PATH);
	}
	await page.goto("/hilfe");
	expect(
		await hrefs(page.locator("main a", { hasText: "Portfolio-Checker" })),
	).toContain(PATH);
});

test("the request CTAs lead to the closing form", async ({ page }) => {
	await gotoHydrated(page);
	await expect(
		page.locator("nav.top").getByRole("link", { name: "Demo buchen" }),
	).toHaveAttribute("href", "/demo");
	await expect(tool(page)).toHaveCount(1);
	await expect(
		page.locator("section.final#start input[name=email]"),
	).toHaveCount(1);
	await expect(page.locator("a.ctab")).toHaveAttribute("href", "/demo");
	await exampleButton(page).click();
	await expect(result(page)).toBeVisible({ timeout: 15_000 });
	const cta = result(page).getByRole("link", {
		name: /Mit eigenem Bestand auswerten/,
	});
	await expect(cta).toHaveAttribute("href", "/demo");
});

test("the example run checks five files and shows the evaluation for the day", async ({
	page,
}) => {
	await gotoOnDay(page);
	await exampleButton(page).click();
	await expect(files(page)).toHaveCount(5);
	// The scan has a warning; nothing can be removed from the example.
	await expect(
		files(page).last().getByText("Seite 2 unscharf, Werte geprüft"),
	).toBeVisible({ timeout: 15_000 });
	await expect(
		tool(page).getByRole("button", { name: /Entfernen/ }),
	).toHaveCount(0);
	await expect(result(page)).toBeVisible({ timeout: 15_000 });
	await expect(files(page).locator("i.on")).toHaveCount(19);
	await expect(files(page).locator("i.wn")).toHaveCount(1);
	await expect(result(page).locator("h2")).toBeFocused();

	const kpis = result(page).locator(".kpis > div");
	await expect(kpis).toHaveText([
		"Dokumente geprüft5",
		"Liegenschaften erkannt3",
		"Nächste Kündigungsfrist31.03.2027Am Markt 7 · in 163 Tagen",
		"Handlungsbedarf2Hinweise mit hoher Priorität",
	]);
	const rows = result(page).locator(".cards li.r");
	await expect(rows).toHaveCount(3);
	await expect(rows.nth(0)).toContainText("Laufzeit bis 31.12.2027");
	await expect(rows.nth(0)).toContainText("Kündigung bis 30.09.2027");
	await expect(rows.nth(1)).toContainText("Kündigung bis 30.06.2027");
	await expect(rows.nth(2)).toContainText("Kündigung bis 31.03.2027");

	// A chip opens its details by click (and hover/focus).
	const chip = rows.nth(1).getByRole("button", { name: /Vertrag kündigen/ });
	const pop = page.locator("#pc-pop-1");
	await expect(pop).toBeHidden();
	await chip.click();
	await expect(chip).toHaveAttribute("aria-expanded", "true");
	await expect(pop).toBeVisible();
	await expect(pop).toContainText("Vertrag kündigen · Parkstraße 4");
	await expect(pop).toContainText(
		"Kündigungsfrist zum 31.12.2026 verpasst: Der Vertrag verlängert sich bis 31.12.2027.",
	);
	await expect(pop).toContainText(
		"Geräte nicht fernablesbar: Nachrüstung bis 31.12.2026 vorgeschrieben.",
	);
});

test("the CSV holds the example evaluation", async ({ page }) => {
	await gotoOnDay(page);
	await exampleButton(page).click();
	const csvButton = result(page).getByRole("button", {
		name: "Als CSV herunterladen",
	});
	await expect(csvButton).toBeVisible({ timeout: 15_000 });
	const [download] = await Promise.all([
		page.waitForEvent("download"),
		csvButton.click(),
	]);
	expect(download.suggestedFilename()).toBe("Heidi-Portfolio-Beispiel.csv");
	const text = await readFile((await download.path())!, "utf8");
	const lines = text.replace(/^\uFEFF/, "").split("\n");
	expect(lines).toHaveLength(4);
	expect(lines[0]).toMatch(/^"Liegenschaft";"Anbieter";"Vertragsnummer";/);
	expect(lines[3]).toContain('"Am Markt 7";"Messdienst C"');
	await expect(result(page).locator(".msg")).toHaveText(
		"Gespeichert: Heidi-Portfolio-Beispiel.csv",
	);
});

test("own files are checked by name and size only, only the counts are sent", async ({
	page,
}) => {
	await gotoHydrated(page);
	const before = (await runEvents(page, "own")).length;
	const requests: string[] = [];
	const reports: (string | null)[] = [];
	page.on("request", (request) => {
		if (new URL(request.url()).pathname === "/api/portfolio-check-run")
			reports.push(request.postData());
		else requests.push(request.url());
	});
	await tool(page).locator("input[type=file]").setInputFiles(OWN);
	await expect(files(page)).toHaveCount(2);
	await expect(tool(page).getByText("2 Dokumente")).toBeVisible();
	await expect(files(page).first()).toContainText("1 KB");
	await page.getByRole("button", { name: "Unterlagen prüfen" }).click();
	await expect(result(page)).toBeVisible({ timeout: 15_000 });
	await expect(files(page).first()).toContainText("PDF-Dokument");
	await expect(files(page).last()).toContainText("Format nicht unterstützt");
	await expect(files(page).locator("i.lk")).toHaveCount(4);
	await expect(result(page).locator(".own h3")).toHaveText(
		"1 von 2 Dokumenten sind bereit für die Auswertung.",
	);
	await expect(result(page).locator(".own li em")).toHaveText([
		"bereit",
		"prüfen",
	]);
	// Neither KPIs, the example tag nor the CSV for own files.
	await expect(result(page).locator(".kpis > div")).toHaveCount(0);
	await expect(
		result(page).getByRole("button", { name: "Als CSV herunterladen" }),
	).toHaveCount(0);
	await expect(
		result(page).getByRole("link", { name: /Auswertung anfragen/ }),
	).toHaveAttribute("href", "/demo");
	expect(requests).toEqual([]);
	// Only the counts, never a name.
	expect(reports).toEqual(['{"mode":"own","files":2,"ready":1}']);
	// Parallel runs report too, so count up from before.
	await expect
		.poll(async () => (await runEvents(page, "own")).length)
		.toBeGreaterThan(before);
	const sent = (await runEvents(page, "own")).filter((event) =>
		JSON.stringify(event).includes('"files":2,"ready":1'),
	);
	expect(sent[0]).toEqual({
		event_type: "portfoliocheckrun",
		timestamp: expect.any(String),
		mode: "own",
		files: 2,
		ready: 1,
		page: PATH,
	});

	// × removes a file; the example replaces the own files.
	await tool(page)
		.getByRole("button", { name: "Entfernen: Nachtrag.docx" })
		.click();
	await expect(files(page)).toHaveCount(1);
	await result(page)
		.getByRole("button", { name: "Beispielauswertung ansehen" })
		.click();
	await expect(files(page)).toHaveCount(5);
	await expect(result(page).locator(".kpis > div")).toHaveCount(4, {
		timeout: 15_000,
	});
});

test("the steps' loop plays in view and ends in the end state", async ({
	page,
}) => {
	await gotoHydrated(page);
	const how = page.locator("section[aria-labelledby=how-h] ol");
	const date = how.locator(".kv b").first();
	await expect(date).toHaveText("30.09.");
	await how.scrollIntoViewIfNeeded();
	await expect(how).toHaveClass(/\banim\b/);
	await expect(date).toHaveText("--.--.");
	await expect(how.locator("li.act")).toHaveCount(1);
	await expect(date).toHaveText("30.09.", { timeout: 10_000 });
	await expect(how.locator(".kv b").last()).toHaveText("72");
});

test("the list filters and searches the properties", async ({ page }) => {
	await gotoHydrated(page);
	const list = page.locator("section[aria-labelledby=rep-h] .pl");
	await list.scrollIntoViewIfNeeded();
	await expect(list.getByText("7 Liegenschaften geprüft")).toBeVisible({
		timeout: 10_000,
	});
	const visibleRows = list.locator("li.r:visible");
	await list
		.getByRole("button", { name: /^Vertrag kündigen/ })
		.first()
		.click();
	await expect(visibleRows).toHaveCount(3);
	await list.getByRole("button", { name: /^Alle/ }).click();
	await list
		.getByRole("searchbox", { name: "Liegenschaft suchen" })
		.fill("garten");
	await expect(visibleRows).toHaveCount(1);
	await expect(visibleRows).toContainText("Gartenweg 3");
});

test("hydrates without console errors or warnings", async ({ page }) => {
	const messages: string[] = [];
	page.on("console", (message) => {
		if (["error", "warning"].includes(message.type()))
			messages.push(message.text());
	});
	page.on("pageerror", (error) => messages.push(error.message));
	await gotoHydrated(page);
	await exampleButton(page).click();
	await expect(result(page)).toBeVisible({ timeout: 15_000 });
	await page.mouse.wheel(0, 6000);
	await page.waitForTimeout(800);
	expect(messages).toEqual([]);
});

test.describe("without JS", () => {
	test.use({ javaScriptEnabled: false });

	test("the end states read, the example button is hidden", async ({
		page,
	}) => {
		await page.goto(PATH);
		await expect(tool(page).locator("input[type=file]")).toHaveCount(1);
		await expect(exampleButton(page)).toBeHidden();
		await expect(
			page.locator("section[aria-labelledby=how-h] .kv b").first(),
		).toHaveText("30.09.");
		await expect(page.getByText("7 Liegenschaften geprüft")).toBeVisible();
		await expect(page.locator("section#start form")).toHaveAttribute(
			"method",
			/post/i,
		);
	});
});

test.describe("with reduced motion", () => {
	test.use({ reducedMotion: "reduce" });

	test("nothing waits or moves, the run is instant", async ({ page }) => {
		await gotoHydrated(page);
		await expect(page.locator("main .rv-wait")).toHaveCount(0);
		const how = page.locator("section[aria-labelledby=how-h] ol");
		await how.scrollIntoViewIfNeeded();
		await page.waitForTimeout(1000);
		await expect(how).not.toHaveClass(/\banim\b/);
		await expect(how.locator(".kv b").first()).toHaveText("30.09.");
		await page.locator("#checker").scrollIntoViewIfNeeded();
		await exampleButton(page).click();
		await expect(result(page)).toBeVisible({ timeout: 2_000 });
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
			source: "portfolio-checker",
		});
});
