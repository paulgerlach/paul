import { expect, test, type Locator, type Page } from "@playwright/test";
import { GATED_ROBOTS, expectGated } from "./launch.ts";

// The signup test saves a lead, so it needs a database with the `leads` table.
// Webhooks go to the local sink from playwright.config.ts.

const PATH = "/kunden/private-vermieter";
const WEBHOOK_EVENTS = "http://127.0.0.1:4199/events";

const testEmail = (name: string) =>
	`e2e-pv-${name}-${Date.now()}-${Math.round(Math.random() * 1e6)}@example.com`;

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

/** Waits for hydration, so the scroll listeners are attached. */
const gotoHydrated = (page: Page) =>
	page.goto(PATH, { waitUntil: "networkidle" });

/** Scrolls to `p` (0–1) of a tall section's scroll range. */
async function scrollThrough(page: Page, selector: string, p: number) {
	await page.evaluate(
		({ selector, p }) => {
			const s = document.querySelector<HTMLElement>(selector);
			if (!s) return;
			const top = s.getBoundingClientRect().top + scrollY;
			scrollTo(0, top + (s.offsetHeight - innerHeight) * p);
		},
		{ selector, p },
	);
}

const caption = (page: Page) => page.locator("section.scene .c.on b");
const currentStep = (page: Page) => page.locator("section.flow li.on button");

test("renders with its own layout and SEO tags", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^Messdienst für private Vermieter:/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(
		page.getByRole("heading", {
			level: 1,
			name: "Ihre Wohnungen. Unser Messdienst. Ihre Ruhe.",
		}),
	).toBeVisible();
	await expect(page.locator("#header")).toHaveCount(0);
	// noindex until LAUNCHED (its go-live gate), with a self-canonical
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		GATED_ROBOTS,
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		/\/kunden\/private-vermieter$/,
	);
	const jsonLd = page.locator('script[type="application/ld+json"]');
	await expect(jsonLd).toHaveCount(1);
	const faq = JSON.parse((await jsonLd.textContent()) ?? "{}");
	expect(faq["@type"]).toBe("FAQPage");
	expect(faq.mainEntity).toHaveLength(6);
});

test("is in the sitemap once launched", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	expectGated(sitemap).toContain("/kunden/private-vermieter</loc>");
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

test("the footer links every customer page, and internal links resolve", async ({
	page,
	request,
}) => {
	await page.goto(PATH);
	const segments = {
		Hausverwaltung: "/kunden/hausverwaltung",
		Mietverwaltung: "/kunden/mietverwaltung",
		"WEG-Verwaltung": "/kunden/weg-verwaltung",
		Wohnungsunternehmen: "/kunden/wohnungsunternehmen",
		"Private Vermieter": PATH,
		"Asset Manager & Fonds": "/kunden/asset-manager",
	};
	for (const [text, href] of Object.entries(segments))
		expect(
			await hrefs(
				page.locator("footer a", { hasText: new RegExp(`^${text}$`) }),
			),
			text,
		).toEqual([href]);
	const links = new Set([
		...(await hrefs(page.locator('footer a[href^="/"]'))),
		...(await hrefs(page.locator('main a[href^="/"]'))),
	]);
	for (const href of links) {
		const response = await request.get(href);
		expect(response.status(), href).toBe(200);
	}
});

test("the CTAs lead to the closing card's form and the anchors", async ({
	page,
}) => {
	await page.goto(PATH);
	await expect(
		page.locator("section.final#start input[name=email]"),
	).toHaveCount(1);
	await expect(
		page.locator("main a", { hasText: "Angebot anfragen" }),
	).toHaveAttribute("href", "/demo");
	await expect(
		page.locator("main a", { hasText: "So funktioniert’s" }),
	).toHaveAttribute("href", "#so");
	await expect(page.locator("section#so")).toHaveCount(1);
	await expect(
		page.locator("main a", { hasText: "Häufige Fragen" }),
	).toHaveAttribute("href", "#faq");
	await expect(page.locator("section#faq")).toHaveCount(1);
	await expect(
		page.locator("main a", { hasText: "Mehr zur uVI" }),
	).toHaveAttribute("href", "/plattform/verbrauchsinformation");
});

test.describe("without JS", () => {
	test.use({ javaScriptEnabled: false });

	test("the scene is short and in its end state, the flow at step 1", async ({
		page,
	}) => {
		await page.goto(PATH);
		const scene = page.locator("section.scene");
		const height = await scene.evaluate((el) => el.offsetHeight);
		expect(height).toBeLessThan(page.viewportSize()!.height);
		await expect(page.getByText("Abgelesen per Funk.")).toBeVisible();
		await expect(page.locator("section.scene .tag").first()).toHaveCSS(
			"opacity",
			"1",
		);
		await expect(currentStep(page)).toContainText("Montage");
		await expect(page.locator("section#start form")).toHaveAttribute(
			"method",
			/post/i,
		);
	});
});

test("the scene follows the scroll and its tags open the info card", async ({
	page,
}) => {
	await gotoHydrated(page);
	await expect(caption(page)).toHaveText("Ihr Mehrfamilienhaus.");
	// The tags are faded out (opacity) until the end of the scene.
	await expect(page.locator("section.scene")).not.toHaveClass(/\bt1\b/);
	await scrollThrough(page, "section.scene", 0.5);
	await expect(caption(page)).toHaveText("Ein Blick hinter die Küchenfront.");
	await scrollThrough(page, "section.scene", 1);
	await expect(caption(page)).toHaveText("Abgelesen per Funk.");
	await expect(page.locator("section.scene")).toHaveClass(/\bt3\b/);
	const gateway = page.getByRole("button", {
		name: "Funk-Gateway",
		exact: true,
	});
	await expect(gateway).toBeVisible();
	await gateway.click();
	const card = page.getByRole("dialog", { name: "Funk-Gateway" });
	await expect(card).toBeVisible();
	await expect(card).toContainText("Sammelt alle Zähler eines Hauses");
	await page.keyboard.press("Escape");
	await expect(card).toBeHidden();
	await page
		.getByRole("button", { name: "Wärmezähler: mehr erfahren" })
		.click();
	await expect(
		page.getByRole("dialog", { name: "Funk-Wärmezähler" }),
	).toBeVisible();
	await page.getByRole("button", { name: "Schließen" }).click();
	await expect(page.getByRole("dialog")).toBeHidden();
});

test("the flow's step follows the scroll and a click", async ({ page }) => {
	await gotoHydrated(page);
	await scrollThrough(page, "section.flow", 0.5);
	await expect(currentStep(page)).toContainText("Monatliche Verbrauchsinfo");
	await expect(page.locator("section.flow .fd")).toContainText(
		"Verbrauchsinformation nach §",
	);
	await page.getByRole("button", { name: /Fragen Ihrer Mieter/ }).click();
	await expect(currentStep(page)).toContainText("Fragen Ihrer Mieter");
});

test("on small screens the flow advances by itself once in view", async ({
	page,
}) => {
	await page.setViewportSize({ width: 375, height: 812 });
	await page.clock.install();
	await gotoHydrated(page);
	await expect(currentStep(page)).toContainText("Montage");
	await page.locator("section.flow").scrollIntoViewIfNeeded();
	await page.clock.runFor(4300);
	await expect(currentStep(page)).toContainText("Ablesung per Funk");
	await page.getByRole("button", { name: /Heizkostenabrechnung/ }).click();
	await expect(currentStep(page)).toContainText("Heizkostenabrechnung");
});

test.describe("with reduced motion", () => {
	test.use({ reducedMotion: "reduce" });

	test("the scene is short and finished; nothing runs", async ({ page }) => {
		await page.clock.install();
		await gotoHydrated(page);
		const height = await page
			.locator("section.scene")
			.evaluate((el) => el.offsetHeight);
		expect(height).toBeLessThan(page.viewportSize()!.height);
		await expect(caption(page)).toHaveText("Abgelesen per Funk.");
		await page.locator("section.q").scrollIntoViewIfNeeded();
		await page.clock.runFor(5000);
		await expect(page.locator("section.q .mt")).not.toHaveClass(/\brun\b/);
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
			source: "private-vermieter",
		});
});
