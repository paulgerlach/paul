import { expect, test } from "@playwright/test";
import { PAGES } from "./pages";
import { passVercelProtection } from "./vercelBypass";

test.beforeEach(({ context, baseURL }) =>
	passVercelProtection(context, baseURL!),
);

for (const path of PAGES)
	test(`${path} renders without errors`, async ({ page }) => {
		const problems: string[] = [];
		page.on("pageerror", (e) => problems.push(e.message));
		page.on("console", (m) => {
			// Swiper's loop warning is a known issue on both apps (KI-29).
			if (m.type() === "error" && !m.text().includes("Loop Warning"))
				problems.push(m.text());
			if (/hydrat/i.test(m.text())) problems.push(m.text());
		});
		const response = await page.goto(path, { waitUntil: "networkidle" });
		expect(response?.status()).toBe(200);
		await expect(page.locator("main").first()).not.toBeEmpty();
		// The Fragebogen wizard has no <h1> in either app.
		if (path !== "/fragebogen")
			expect(await page.locator("h1").first().innerText()).not.toBe("");
		expect(problems).toEqual([]);
	});

test("unknown URLs are 404s", async ({ page }) => {
	expect((await page.goto("/does-not-exist"))?.status()).toBe(404);
	expect((await page.goto("/blog/does-not-exist"))?.status()).toBe(404);
});
