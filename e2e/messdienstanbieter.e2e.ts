import { expect, test, type Locator, type Page } from "@playwright/test";
import postgres from "postgres";
import { CITIES } from "../src/lib/landing/pages/messdienstanbieter-city/cities/index.ts";

// The smoke checks run on every city page and the Germany page; the form and
// interaction tests on Berlin only, because the template is the same.
// Signups need the local Postgres with the `leads` table, and the server's
// KITCHEN_SINK=1 (playwright.config.ts) lifts the per-IP signup limit, which
// the /messdienstwechsel tests would use up otherwise.

const SITE_URL = "https://heidisystems.com";
const HUB = "/messdienstanbieter";
const BERLIN = `${HUB}/berlin`;
const WEBHOOK_EVENTS = "http://127.0.0.1:4199/events";

const PAGES = [
	...CITIES.map((c) => ({
		path: `${HUB}/${c.slug}`,
		name: c.name,
		live: c.live,
	})),
	{ path: HUB, name: "Deutschland", live: true },
];
const LIVE_PATHS = CITIES.filter((c) => c.live).map((c) => `${HUB}/${c.slug}`);
const NOT_LIVE_PATHS = CITIES.filter((c) => !c.live).map(
	(c) => `${HUB}/${c.slug}`,
);

const testEmail = (name: string) =>
	`e2e-${name}-${Date.now()}-${Math.round(Math.random() * 1e6)}@example.com`;

/** Opens `path` with the clock 10 s behind, so the form passes the timing check. */
async function gotoBackdated(page: Page, path: string) {
	await page.clock.install({ time: Date.now() - 10_000 });
	await page.goto(path);
}

async function webhookFor(page: Page, email: string) {
	const events: { email: string }[] = await (
		await page.request.get(WEBHOOK_EVENTS)
	).json();
	return events.find((event) => event.email === email);
}

/** The `source` of the stored lead, if the local database is reachable. */
async function leadSource(email: string) {
	try {
		process.loadEnvFile();
	} catch {
		// no .env; rely on the environment
	}
	if (!process.env.DATABASE_URL) return undefined;
	const sql = postgres(process.env.DATABASE_URL, { max: 1 });
	try {
		const rows = await sql`select source from leads where email = ${email}`;
		return rows[0]?.source as string | undefined;
	} finally {
		await sql.end();
	}
}

const hrefs = (scope: Locator) =>
	scope.evaluateAll((els) => [
		...new Set(els.map((el) => el.getAttribute("href") ?? "")),
	]);

for (const p of PAGES) {
	test(`${p.path} is its own landing page`, async ({ page }) => {
		const problems: string[] = [];
		page.on("console", (m) => {
			if (m.type() === "error" || /hydration/i.test(m.text()))
				problems.push(m.text());
		});
		const response = await page.goto(p.path);
		expect(response?.status()).toBe(200);
		expect(response?.headers()["cache-control"]).toContain("s-maxage=60");

		await expect(page.locator("h1")).toHaveCount(1);
		await expect(page.locator("h1")).toContainText(p.name);
		await expect(page.locator("#header")).toHaveCount(0);

		const url = SITE_URL + p.path;
		await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
			"href",
			url,
		);
		await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
			"content",
			url,
		);
		await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
			"content",
			p.live ? "index, follow" : "noindex",
		);

		const types = await page
			.locator('script[type="application/ld+json"]')
			.evaluateAll((els) =>
				els.map((el) => JSON.parse(el.textContent ?? "{}")["@type"]),
			);
		expect(types).toEqual(expect.arrayContaining(["FAQPage", "Service"]));

		// The map starts on its default district
		await expect(page.locator(".bm-n")).not.toBeEmpty();
		await expect(page.locator(".bz.on")).toHaveCount(1);
		expect(problems).toEqual([]);
	});
}

test("no horizontal page scroll at 375px on any page", async ({ page }) => {
	await page.setViewportSize({ width: 375, height: 800 });
	for (const p of PAGES) {
		await page.goto(p.path);
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - window.innerWidth,
		);
		expect(overflow, p.path).toBeLessThanOrEqual(0);
	}
});

test("unknown cities 404, and a trailing slash redirects", async ({ page }) => {
	expect((await page.goto(`${HUB}/foo`))?.status()).toBe(404);
	expect((await page.goto(`${HUB}/potsdam`))?.status()).toBe(404);
	const response = await page.goto(`${BERLIN}/`);
	expect(response?.status()).toBe(200);
	expect(new URL(page.url()).pathname).toBe(BERLIN);
});

test("the footer lists every city and the hub", async ({ page }) => {
	await page.goto(BERLIN);
	const links = await hrefs(page.locator("footer .cities a"));
	expect(links).toEqual([...CITIES.map((c) => `${HUB}/${c.slug}`), HUB]);
});

test("the nav links to the same pages as the site's", async ({ page }) => {
	await page.goto("/");
	const site = new Set(await hrefs(page.locator("#header a[href]")));
	await page.goto(BERLIN);
	const landing = await hrefs(page.locator("nav.top a[href]"));
	// Landing-only: the logo links home, the CTA goes to the signup.
	expect(
		landing.filter((h) => !site.has(h) && !["/", "#start"].includes(h)),
	).toEqual([]);
});

test("internal links resolve; page content never leads to a city that isn't live", async ({
	page,
}) => {
	const all = new Set<string>();
	for (const p of PAGES) {
		await page.goto(p.path);
		// The map's dots and nearby links only name live cities; the footer
		// lists every city page.
		for (const href of await hrefs(page.locator('main a[href^="/"]'))) {
			expect(NOT_LIVE_PATHS, `${p.path} → ${href}`).not.toContain(href);
			all.add(href);
		}
		for (const href of await hrefs(page.locator('footer a[href^="/"]')))
			all.add(href);
	}
	for (const href of all) {
		const response = await page.request.get(href);
		expect(response.status(), href).toBe(200);
	}
});

test.describe("signup", () => {
	for (const placement of ["hero", "final"] as const) {
		test(`Berlin ${placement} form stores the lead with the city`, async ({
			page,
		}) => {
			await gotoBackdated(page, BERLIN);
			const email = testEmail(`berlin-${placement}`);
			const box = page.locator(`.signup-box.${placement}`);
			await expect(box.locator("button[type=submit]")).toHaveText(
				"Bestand kostenlos prüfen",
			);
			await box.locator('input[name="email"]').fill(email);
			await box.locator("button[type=submit]").click();

			await expect(box.locator(".status")).toHaveText(
				"Danke! Wir melden uns innerhalb eines Werktags.",
			);
			await expect
				.poll(() => webhookFor(page, email))
				.toMatchObject({
					event_type: "switchinquiry",
					placement,
					page: BERLIN,
					city: "berlin",
				});
			const source = await leadSource(email);
			if (source !== undefined)
				expect(source).toBe("messdienstanbieter-berlin");
		});
	}

	test("the Germany signup has its own source and no city", async ({
		page,
	}) => {
		await gotoBackdated(page, HUB);
		const email = testEmail("germany");
		const hero = page.locator(".signup-box.hero");
		await hero.locator('input[name="email"]').fill(email);
		await hero.locator("button[type=submit]").click();

		await expect(hero.locator(".status")).toContainText("Danke!");
		await expect
			.poll(() => webhookFor(page, email))
			.toMatchObject({ page: HUB });
		expect(await webhookFor(page, email)).not.toHaveProperty("city");
		const source = await leadSource(email);
		if (source !== undefined) expect(source).toBe("messdienstanbieter");
	});

	test("an invalid email shows the error; a filled honeypot stores nothing", async ({
		page,
	}) => {
		await gotoBackdated(page, BERLIN);
		const hero = page.locator(".signup-box.hero");
		await hero
			.locator("form")
			.evaluate((form: HTMLFormElement) => (form.noValidate = true));
		await hero.locator('input[name="email"]').fill("not-an-email@");
		await hero.locator("button[type=submit]").click();
		await expect(hero.getByRole("alert")).toHaveText(
			"Bitte eine gültige E-Mail-Adresse eingeben",
		);

		const email = testEmail("honeypot");
		const final = page.locator(".signup-box.final");
		await final.locator('input[name="website"]').fill("spam", { force: true });
		await final.locator('input[name="email"]').fill(email);
		await final.locator("button[type=submit]").click();
		await expect(final.locator(".status")).toContainText("Danke!");
		expect(await webhookFor(page, email)).toBeUndefined();
	});

	test.describe("without JavaScript", () => {
		test.use({ javaScriptEnabled: false });

		test("posts the form and shows the message", async ({ page }) => {
			await page.goto(BERLIN);
			await page.waitForTimeout(3_100); // the server's "too fast" check
			const email = testEmail("berlin-nojs");
			const hero = page.locator(".signup-box.hero");
			await hero.locator('input[name="email"]').fill(email);
			await hero.locator("button[type=submit]").click();
			await expect(page.locator(".signup-box.hero .status")).toHaveText(
				"Danke! Wir melden uns innerhalb eines Werktags.",
			);
			expect(await webhookFor(page, email)).toMatchObject({ city: "berlin" });
		});
	});
});

test.describe("interactions", () => {
	// Click demos jump to their end state, so the tests don't wait for them.
	test.use({ reducedMotion: "reduce" });

	test.beforeEach(async ({ page }) => {
		await page.goto(BERLIN);
	});

	test("focusing a district fills the info panel", async ({ page }) => {
		await expect(page.locator(".bm-n")).toHaveText("Pankow");
		await page.getByRole("button", { name: "Mitte", exact: true }).focus();
		await expect(page.locator(".bm-n")).toHaveText("Mitte");
		await expect(page.locator(".bm-cta")).toContainText(
			"Bestand in Mitte prüfen",
		);
		await expect(
			page.getByRole("button", { name: "Mitte", exact: true }),
		).toHaveAttribute("aria-pressed", "true");
	});

	test("phone month tabs work with the mouse and the arrow keys", async ({
		page,
	}) => {
		const tabs = page.getByRole("tablist", { name: "Monat wählen" });
		await expect(page.locator(".ph-k")).toHaveText("Heizkosten im September");
		await tabs.getByRole("tab", { name: "April" }).click();
		await expect(page.locator(".ph-k")).toHaveText("Heizkosten im April");
		await expect(page.locator(".ph-v")).toContainText("64,20 €");
		await page.keyboard.press("ArrowRight");
		await expect(page.locator(".ph-k")).toHaveText("Heizkosten im Mai");
		await expect(tabs.getByRole("tab", { name: "Mai" })).toBeFocused();
	});

	test("portfolio tabs switch the table", async ({ page }) => {
		const tabs = page.getByRole("tablist", { name: "Liegenschaft wählen" });
		await tabs.getByRole("tab", { name: "Kastanienallee 12" }).click();
		await expect(page.locator(".bw-tbl tbody")).toContainText("uVI September");
		await expect(page.locator(".bw-k.b b")).toHaveText("96");
	});

	test("the billing demo ends in its result", async ({ page }) => {
		await page.locator(".hk-btn").click();
		await expect(page.locator(".hk-status")).toContainText(
			"24 Abrechnungen erstellt und an Ihre Software übergeben",
		);
		await expect(page.locator(".hk-btn")).toHaveText("Noch einmal ansehen");
	});

	test("the trio demos run and reset", async ({ page }) => {
		const billing = page.locator(".t1 .t-btn");
		await billing.click();
		await expect(billing).toContainText("24 Abrechnungen erstellt");
		await billing.click();
		await expect(billing).toContainText("Abrechnung erstellen");

		await page.getByRole("button", { name: "Eine Unterschrift" }).click();
		await expect(page.locator(".t2-txt")).toHaveText("Heidi übernimmt alles");

		await page.getByRole("button", { name: "Zugang an Mieter senden" }).click();
		await expect(page.locator(".t3-3 small")).toHaveText(
			"142 kWh · −12 % ggü. August",
		);
		await page
			.getByRole("button", { name: "Klicken zum Zurücksetzen" })
			.click();
		await expect(page.locator(".t3-3 small")).toHaveText("Wartet auf Zugang");
	});

	test("the city links to the hub and to its live neighbours", async ({
		page,
	}) => {
		await expect(page.locator(".bm-links .hub")).toHaveAttribute("href", HUB);
		const nearby = await hrefs(page.locator(".bm-links p a"));
		for (const href of nearby) expect(LIVE_PATHS).toContain(href);
	});
});

test.describe("Germany map", () => {
	test("has a link dot for exactly the live cities", async ({ page }) => {
		await page.goto(HUB);
		const dots = await hrefs(page.locator(".bm-map svg a"));
		expect(dots.sort()).toEqual([...LIVE_PATHS].sort());
		await expect(page.locator(".bm-links .hub")).toHaveCount(0);
	});

	test("a focused state shows its hint, a dot opens its city", async ({
		page,
	}) => {
		await page.goto(HUB);
		await page.getByRole("button", { name: "Berlin", exact: true }).focus();
		await expect(page.locator(".bm-h")).toContainText("Eigene Seite: Berlin.");
		await page.getByRole("button", { name: "Bayern" }).focus();
		await expect(page.locator(".bm-n")).toHaveText("Bayern");
		await page.locator(`.bm-map a[href="${BERLIN}"]`).focus();
		await expect(page.locator(".bm-h")).toContainText(
			"um die Seite für Berlin zu öffnen",
		);
		await page.keyboard.press("Enter");
		await expect(page).toHaveURL(new RegExp(`${BERLIN}$`));
	});
});
