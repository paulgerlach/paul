import { expect, test, type Page } from "@playwright/test";

const swiperState = (page: Page, selector: string) =>
	page
		.locator(selector)
		.first()
		.evaluate((el) => {
			const s = (el as HTMLElement & { swiper?: import("swiper").default })
				.swiper;
			return { initialized: !!s?.initialized, realIndex: s?.realIndex ?? -1 };
		});

test.describe("kitchen sink", () => {
	test("renders without console errors", async ({ page }) => {
		const problems: string[] = [];
		page.on("pageerror", (e) => problems.push(e.message));
		page.on("console", (m) => {
			// Swiper's loop warning also appears on the Next site (KI-29).
			if (m.type() === "error" && !m.text().includes("Loop Warning"))
				problems.push(m.text());
		});
		await page.goto("/kitchen-sink", { waitUntil: "networkidle" });
		expect(problems).toEqual([]);
	});

	test("every swiper initializes", async ({ page }) => {
		await page.goto("/kitchen-sink", { waitUntil: "networkidle" });
		const count = await page.evaluate(
			() =>
				[
					...document.querySelectorAll<HTMLElement & { swiper?: unknown }>(
						".swiper",
					),
				]
					// PersonSwiper keeps an outer non-swiper `.swiper` wrapper (as in Next).
					.filter((el) =>
						el.querySelector(":scope > .swiper-wrapper:not(.swiper)"),
					)
					.filter((el) => !el.swiper).length,
		);
		expect(count).toBe(0);
	});

	test("NumberedSwiper keeps its paired swipers in sync", async ({ page }) => {
		await page.goto("/kitchen-sink", { waitUntil: "networkidle" });
		const root = page.getByTestId("numbered-swiper");
		await root
			.locator(
				".numbered-item-swiper-pagination-first-first .swiper-pagination-bullet",
			)
			.nth(2)
			.click();
		await expect
			.poll(() =>
				root
					.locator(".numbered-item-swiper--first")
					.evaluateAll((els) =>
						els.map(
							(el) =>
								(el as HTMLElement & { swiper: { activeIndex: number } }).swiper
									.activeIndex,
						),
					),
			)
			.toEqual([2, 2]);
	});

	test("ChartSwiper paginates by name", async ({ page }) => {
		await page.goto("/kitchen-sink", { waitUntil: "networkidle" });
		const bullets = page.locator(".chart-swiper .custom-bullet");
		await expect(bullets).toHaveText([
			"Dashboard",
			"Analyse",
			"Betriebskosten",
		]);
		await bullets.nth(2).click();
		await expect
			.poll(() => swiperState(page, ".chart-swiper"))
			.toMatchObject({ realIndex: 2 });
	});

	test("FAQ answers stay in the HTML and toggle open", async ({ page }) => {
		await page.goto("/kitchen-sink", { waitUntil: "networkidle" });
		const answers = page.locator(".faq-answer-content");
		await expect(answers).toHaveCount(12);
		await expect(answers.first()).toBeHidden();
		await page.locator(".faq-answer-header").first().click();
		await expect(answers.first()).toBeVisible();
	});
});

test.describe("header", () => {
	test("nav blog teaser is server-rendered (KI-07)", async ({ request }) => {
		const html = await (await request.get("/")).text();
		expect(html).toContain("Unsere Blog Artikel");
		expect(html).toMatch(/href="\/blog\/[^"]+"/);
	});

	test("mobile menu opens, locks scrolling and closes", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 800 });
		await page.goto("/");
		const html = page.locator("html");
		await page.getByRole("button", { name: "Menü öffnen" }).click();
		await expect(html).toHaveClass(/_lock/);
		await page.getByRole("button", { name: "✕" }).click();
		await expect(html).not.toHaveClass(/_lock/);
	});
});
