import { expect, test, type Locator } from "@playwright/test";

// /preise: the landing design that replaced the old site's page. Indexed from
// the start (it replaces a live URL). No form, nothing is sent.

const PATH = "/preise";

async function hrefs(links: Locator) {
	return (await links.evaluateAll((els) =>
		els.map((el) => el.getAttribute("href")),
	)) as string[];
}

test("renders with its own layout, SEO tags and FAQ data", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle(/^Preise:/);
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(page.locator("h1")).toHaveText(
		"Sie zahlen pro verbautem Gerät. Und reichen es an die Mieter weiter.",
	);
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		"index, follow",
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		/\/preise$/,
	);
	const jsonLd = await page
		.locator('script[type="application/ld+json"]')
		.textContent();
	expect(JSON.parse(jsonLd ?? "{}")).toMatchObject({
		"@type": "FAQPage",
		mainEntity: { length: 6 },
	});
	await expect(page.locator("#faq details[open]")).toHaveCount(0);
});

test("is in the sitemap", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	expect(sitemap).toContain("/preise</loc>");
});

test("the CTAs lead to the request, the contracts and the ways to an offer", async ({
	page,
}) => {
	await page.goto(PATH);
	const main = page.locator("main");
	await expect(
		main.getByRole("link", { name: /Preise anfragen/ }).first(),
	).toHaveAttribute("href", "#anfrage");
	await expect(
		main.getByRole("link", { name: "So rechnen wir ab" }),
	).toHaveAttribute("href", "#preise");
	expect(await hrefs(page.locator("#anfrage a"))).toEqual([
		"/self-service",
		"/kontakt",
		"/demo",
	]);
	await expect(
		page.locator("#preise").getByRole("link", { name: "Selbstabrechnung" }),
	).toHaveAttribute("href", "/selbstabrechnung");
	await expect(
		page.locator("section.end").getByRole("link", { name: /Preise anfragen/ }),
	).toHaveAttribute("href", "#anfrage");
	// The design's Interoperabilität page doesn't exist yet.
	await expect(page.getByText("Mehr zur Interoperabilität")).toHaveCount(0);
});

for (const width of [375, 320]) {
	test(`has no horizontal overflow at ${width} px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 812 });
		await page.goto(PATH, { waitUntil: "networkidle" });
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - window.innerWidth,
		);
		expect(overflow).toBeLessThanOrEqual(0);
	});
}

test("the bill's line flows while in view", async ({ page }) => {
	await page.goto(PATH, { waitUntil: "networkidle" });
	const flow = page.locator(".flow");
	await expect(flow).toHaveClass(/\brun\b/);
	await page.mouse.wheel(0, 3000);
	await expect(flow).not.toHaveClass(/\brun\b/);
});

test("hydrates without console errors or warnings", async ({ page }) => {
	const messages: string[] = [];
	page.on("console", (message) => {
		if (["error", "warning"].includes(message.type()))
			messages.push(message.text());
	});
	page.on("pageerror", (error) => messages.push(error.message));
	await page.goto(PATH, { waitUntil: "networkidle" });
	await page.mouse.wheel(0, 4000);
	await page.waitForTimeout(800);
	expect(messages).toEqual([]);
});

test.describe("with reduced motion", () => {
	test.use({ reducedMotion: "reduce" });

	test("the bill is finished and still", async ({ page }) => {
		await page.goto(PATH, { waitUntil: "networkidle" });
		await expect(page.locator(".bill .bl")).toHaveCount(6);
		await expect(page.locator(".flow")).not.toHaveClass(/\brun\b/);
	});
});
