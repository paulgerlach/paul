import { expect, test, type Page } from "@playwright/test";

// The legal pages (/impressum, /datenschutzhinweise, /agb): one template,
// three texts. /impressum and /datenschutzhinweise replace live URLs and stay
// indexed; /agb is new and noindex until its go-live gate.

const PAGES = [
	{
		path: "/impressum",
		title: /^Impressum \|/,
		h1: "Impressum",
		articles: 9,
		indexed: true,
		last: { name: /Urheberrecht/, id: "s-urheber" },
	},
	{
		path: "/datenschutzhinweise",
		title: /^Datenschutzerklärung \|/,
		h1: "Datenschutzerklärung",
		articles: 11,
		indexed: true,
		last: { name: /Stand dieser Erklärung/, id: "s-stand" },
	},
	{
		path: "/agb",
		title: /^Allgemeine Geschäftsbedingungen \(AGB\) \|/,
		h1: "Allgemeine Geschäftsbedingungen",
		articles: 5,
		indexed: false,
		last: { name: /Teil C/, id: "s-gm-c" },
	},
];

/** Waits for hydration, so the table of contents follows the scroll. */
const gotoHydrated = (page: Page, path: string) =>
	page.goto(path, { waitUntil: "networkidle" });

for (const legal of PAGES)
	test.describe(legal.path, () => {
		test("renders with the landing layout and its SEO tags", async ({
			page,
		}) => {
			const response = await page.goto(legal.path);
			expect(response?.status()).toBe(200);
			expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
			await expect(page).toHaveTitle(legal.title);
			await expect(page.locator("h1")).toHaveCount(1);
			// The H1's soft hyphen isn't part of its name.
			await expect(page.getByRole("heading", { level: 1 })).toHaveText(
				legal.h1.replace(/(?<=Datenschutz|Geschäfts)/, "­"),
			);
			// Inside .lp now: the landing font, not the old pages' Exo 2.
			expect(
				await page
					.locator("main h1")
					.evaluate((h) => getComputedStyle(h).fontFamily),
			).toContain("Geist");
			await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
				"content",
				legal.indexed ? "index, follow" : "noindex",
			);
			await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
				"href",
				`https://heidisystems.com${legal.path}`,
			);
			await expect(page.locator("main article")).toHaveCount(legal.articles);
		});

		test("the table of contents follows the reading", async ({ page }) => {
			await page.setViewportSize({ width: 1440, height: 900 });
			await gotoHydrated(page, legal.path);
			const toc = page.getByRole("navigation", { name: "Inhalt" });
			await expect(toc.getByRole("link")).toHaveCount(legal.articles);
			const current = toc.locator('a[aria-current="location"]');
			await expect(current).toHaveCount(1);
			await expect(current).toHaveAttribute("href", /^#s-/);
			await expect(toc.locator(".prog i")).toHaveAttribute(
				"style",
				/width: 0%/,
			);

			await toc.getByRole("link", { name: legal.last.name }).click();
			await expect(page).toHaveURL(new RegExp(`#${legal.last.id}$`));
			await expect(current).toHaveAttribute("href", `#${legal.last.id}`);
			// The article lands below the sticky header.
			const top = await page
				.locator(`#${legal.last.id}`)
				.evaluate((el) => el.getBoundingClientRect().top);
			expect(top).toBeGreaterThan(60);
			await expect(toc).toBeInViewport();
		});

		test("has no horizontal overflow at 320 px and no console problems", async ({
			page,
		}) => {
			const problems: string[] = [];
			page.on("console", (message) => {
				if (["error", "warning"].includes(message.type()))
					problems.push(message.text());
			});
			page.on("pageerror", (error) => problems.push(error.message));
			await page.setViewportSize({ width: 320, height: 812 });
			await gotoHydrated(page, legal.path);
			await page.mouse.wheel(0, 4000);
			await page.waitForTimeout(300);
			const overflow = await page.evaluate(
				() => document.documentElement.scrollWidth - window.innerWidth,
			);
			expect(overflow).toBeLessThanOrEqual(0);
			expect(problems).toEqual([]);
		});
	});

test("the sitemap lists the indexed legal pages only", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	expect(sitemap).toContain("/impressum</loc>");
	expect(sitemap).toContain("/datenschutzhinweise</loc>");
	expect(sitemap).not.toContain("/agb</loc>");
});

test("the footer's legal line links the three pages", async ({ page }) => {
	await page.goto("/messdienstanbieter");
	const links = page.locator("footer .legal-links a");
	await expect(links).toHaveText(["Impressum", "Datenschutz", "AGB"]);
	expect(
		await links.evaluateAll((els) => els.map((a) => a.getAttribute("href"))),
	).toEqual(["/impressum", "/datenschutzhinweise", "/agb"]);
});

test("Demo buchen goes to /demo-buchen", async ({ page }) => {
	await page.goto("/agb");
	for (const scope of ["nav.top", "main"])
		await expect(
			page.locator(scope).getByRole("link", { name: "Demo buchen" }).first(),
		).toHaveAttribute("href", "/demo-buchen");
});

test("the Impressum names the provider and its register entry", async ({
	page,
}) => {
	await page.goto("/impressum");
	const main = page.locator("main");
	await expect(main.locator("#s-anbieter")).toContainText(
		"Heidi Systems GmbHMonbijouplatz 410178 Berlin",
	);
	await expect(main.locator("#s-register")).toContainText("HRB 259535 B");
	await expect(main.locator("#s-ust")).toContainText("DE365219727");
	await expect(
		main.getByRole("link", { name: "info@heidisystems.com" }),
	).toHaveAttribute("href", "mailto:info@heidisystems.com");
});

test.describe("without JS", () => {
	test.use({ javaScriptEnabled: false });

	test("every article is readable and the first entry is current", async ({
		page,
	}) => {
		await page.goto("/agb");
		await expect(page.locator("#s-gm-c")).toBeVisible();
		await expect(page.locator(".toc a").first()).toHaveAttribute(
			"aria-current",
			"location",
		);
	});
});
