import { expect, test, type Locator, type Page } from "@playwright/test";

// The signup test saves a lead, so it needs a database with the `leads` table.
// Webhooks go to the local sink from playwright.config.ts.

const PATH = "/einsparrechner";
const WEBHOOK_EVENTS = "http://127.0.0.1:4199/events";

const testEmail = (name: string) =>
	`e2e-es-${name}-${Date.now()}-${Math.round(Math.random() * 1e6)}@example.com`;

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

/** Waits for hydration, so the calculator runs. */
const gotoHydrated = (page: Page) =>
	page.goto(PATH, { waitUntil: "networkidle" });

const calc = (page: Page) => page.locator("#rechner");
const total = (page: Page) => calc(page).locator(".total");
const toggle = (page: Page, name: RegExp) =>
	calc(page).getByRole("button", { name });
/** The figures with plain spaces. */
const text = (l: Locator) =>
	l.evaluate((el) => (el.textContent ?? "").replaceAll(" ", " ").trim());

test("renders with its own layout and SEO tags", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^Einsparrechner:/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(
		page.getByRole("heading", {
			level: 1,
			name: "Was der Wechsel Ihrem Bestand bringt.",
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
		/\/einsparrechner$/,
	);
	const jsonLd = await page
		.locator('script[type="application/ld+json"]')
		.allTextContents();
	const faq = jsonLd
		.map((t) => JSON.parse(t))
		.find((d) => d["@type"] === "FAQPage");
	expect(faq.mainEntity).toHaveLength(4);
});

test("is not in the sitemap yet", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	expect(sitemap).not.toContain("/einsparrechner</loc>");
});

for (const width of [375, 320]) {
	test(`has no horizontal overflow at ${width} px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 812 });
		await gotoHydrated(page);
		// The largest figures: every slider at its maximum, both toggles on.
		for (const input of await calc(page).locator("input[type=range]").all())
			await input.fill((await input.getAttribute("max")) ?? "");
		await toggle(page, /fernablesbar/).click();
		await toggle(page, /Verbrauchsinfo/).click();
		await expect(total(page)).toHaveText(/^3\.060\.000\s€$/);
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - window.innerWidth,
		);
		expect(overflow).toBeLessThanOrEqual(0);
	});
}

test("the footer, the segment pages and the internal links resolve", async ({
	page,
	request,
}) => {
	await page.goto(PATH);
	expect(
		await hrefs(page.locator("footer a", { hasText: /^Einsparrechner$/ })),
	).toEqual([PATH]);
	const links = new Set([
		...(await hrefs(page.locator('footer a[href^="/"]'))),
		...(await hrefs(page.locator('main a[href^="/"]'))),
	]);
	expect(links).toContain("/fristenrechner");
	for (const href of links) {
		const response = await request.get(href);
		expect(response.status(), href).toBe(200);
	}
	for (const segment of ["/hausverwaltung", "/mietverwaltung"]) {
		await page.goto(segment);
		await page.getByRole("link", { name: "Zum Einsparrechner" }).click();
		await expect(page).toHaveURL(new RegExp(`${PATH}$`));
	}
});

test("the CTAs lead to the closing form", async ({ page }) => {
	await page.goto(PATH);
	await expect(
		page.locator("section.final#start input[name=email]"),
	).toHaveCount(1);
	await expect(
		page.locator("section[aria-labelledby=es-h1]"),
	).not.toHaveAttribute("id", "start");
	await expect(page.locator("a.ctab")).toHaveAttribute("href", "#start");
	await expect(
		page.locator("#faq a.more", { hasText: "Kündigungsfrist berechnen" }),
	).toHaveAttribute("href", "/fristenrechner");
});

test("the calculator shows the design's example and follows the inputs", async ({
	page,
}) => {
	await gotoHydrated(page);
	await expect(total(page)).toHaveText(/^7\.020\s€$/);
	const out = calc(page).locator(".out");
	expect(await text(out.locator(".bar small").first())).toBe(
		"156 Stunden pro Jahr",
	);
	expect(await text(out.locator(".bar small").last())).toBe(
		"Kein Risiko ausgewählt",
	);
	expect(await text(out.locator(".kpi b").first())).toBe("20");
	expect(await text(out.locator(".kpi b").last())).toBe("29 €");
	await expect(
		calc(page).getByRole("slider", { name: "Wohneinheiten" }),
	).toHaveAttribute("aria-valuetext", /^240\sWE$/);

	// Half hours show their decimal; the hours follow.
	const reading = calc(page).getByRole("slider", {
		name: "Ablesetermine koordinieren und Mieter informieren",
	});
	await reading.fill("4.5");
	await expect(calc(page).locator("output[for=es-a1]")).toHaveText(/^4,5\sh$/);
	await expect(out.locator(".bar small").first()).toHaveText(
		/^162\sStunden pro Jahr$/,
	);
	await expect(total(page)).toHaveText(/^7\.290\s€$/);

	// Each toggle adds 3 % of the heating costs.
	const fern = toggle(page, /fernablesbar/);
	await fern.click();
	await expect(fern).toHaveAttribute("aria-pressed", "true");
	await expect(total(page)).toHaveText(/^14\.490\s€$/);
	await toggle(page, /Verbrauchsinfo/).click();
	await expect(total(page)).toHaveText(/^21\.690\s€$/);
	await expect(out.locator(".bar small").last()).toHaveText(
		/^2\s×\s3\s%\sKürzungsrecht auf 240\.000\s€\sHeizkosten$/,
	);
	await expect(out.getByRole("status")).toHaveText(
		/Ihr Vorteil pro Jahr: 21\.690\s€/,
	);
	// The first time both are on: confetti.
	await expect(page.locator("body > canvas")).toHaveCount(1);
	await fern.click();
	await expect(fern).toHaveAttribute("aria-pressed", "false");
	await expect(total(page)).toHaveText(/^14\.490\s€$/);
});

test("the result's button leads to the closing form and focuses it", async ({
	page,
}) => {
	await gotoHydrated(page);
	const link = calc(page).getByRole("link", {
		name: "Angebot für Ihren Bestand",
	});
	await expect(link).toHaveAttribute("href", "#start");
	await link.click();
	await expect(page.locator("#start input[name=email]")).toBeFocused();
});

test("hydrates without console errors or warnings", async ({ page }) => {
	const messages: string[] = [];
	page.on("console", (message) => {
		if (["error", "warning"].includes(message.type()))
			messages.push(message.text());
	});
	page.on("pageerror", (error) => messages.push(error.message));
	await gotoHydrated(page);
	await calc(page).getByRole("slider", { name: "Liegenschaften" }).fill("40");
	await toggle(page, /Verbrauchsinfo/).click();
	await page.locator("summary").nth(1).click();
	await page.mouse.wheel(0, 3000);
	await page.waitForTimeout(600);
	expect(messages).toEqual([]);
});

test.describe("without JS", () => {
	test.use({ javaScriptEnabled: false });

	test("the example's result and the form are there", async ({ page }) => {
		await page.goto(PATH);
		await expect(total(page)).toHaveText(/^7\.020\s€$/);
		await expect(calc(page).locator(".bar em i").first()).toHaveAttribute(
			"style",
			/width: 100%/,
		);
		await expect(page.locator("section#start form")).toHaveAttribute(
			"method",
			/post/i,
		);
	});
});

test.describe("with reduced motion", () => {
	test.use({ reducedMotion: "reduce" });

	test("nothing waits or counts, no confetti", async ({ page }) => {
		await gotoHydrated(page);
		await expect(page.locator("main .rv-wait")).toHaveCount(0);
		await expect(total(page)).toHaveText(/^7\.020\s€$/);
		await toggle(page, /fernablesbar/).click();
		// No tween: the new total at once.
		expect(await text(total(page))).toBe("14.220 €");
		await toggle(page, /Verbrauchsinfo/).click();
		await expect(total(page)).toHaveText(/^21\.420\s€$/);
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
