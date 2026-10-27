import { expect, test } from "@playwright/test";
import { expectGated, GATED_ROBOTS } from "./launch";

// /heizkostenabrechnung: the heating cost statement. No form; the DocuScan
// demo and the cards are example data and send nothing.

const PATH = "/heizkostenabrechnung";

test("renders with its own layout and SEO tags", async ({ page }) => {
	const response = await page.goto(PATH);
	expect(response?.status()).toBe(200);
	expect(response?.headers()["cache-control"]).toContain("s-maxage=60");
	await expect(page).toHaveTitle("Heizkostenabrechnung auf Knopfdruck | Heidi");
	await expect(page.locator("h1")).toHaveCount(1);
	await expect(page.locator("h1")).toContainText("Nicht in 6 bis 9 Monaten.");
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		GATED_ROBOTS,
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		/\/heizkostenabrechnung$/,
	);
});

test("is in the sitemap once launched", async ({ request }) => {
	const sitemap = await (await request.get("/sitemap.xml")).text();
	expectGated(sitemap).toContain("/heizkostenabrechnung</loc>");
});

test("the footer's and the nav's Heizkostenabrechnung lead here", async ({
	page,
}) => {
	await page.goto("/");
	await expect(
		page
			.locator("footer")
			.getByRole("link", { name: "Heizkostenabrechnung", exact: true }),
	).toHaveAttribute("href", PATH);
	await expect(
		page
			.getByRole("navigation", { name: "Hauptnavigation" })
			.locator(`a[href="${PATH}"]`)
			.first(),
	).toBeAttached();
});

test("the CTAs lead to /demo and the DocuScan demo", async ({ page }) => {
	await page.goto(PATH);
	const main = page.locator("main");
	await expect(
		main.getByRole("link", { name: /^DocuScan ausprobieren/ }),
	).toHaveAttribute("href", "#scan");
	for (const link of await main
		.getByRole("link", { name: /^Demo buchen/ })
		.all())
		await expect(link).toHaveAttribute("href", "/demo");
	// In a closed answer: no role until it opens.
	await expect(
		main.locator("a", { hasText: "Zur Selbstabrechnung" }),
	).toHaveAttribute("href", "/selbstabrechnung");
});

test("DocuScan checks the fields and saves without a request", async ({
	page,
}) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.goto(PATH);
	const requests: string[] = [];
	page.on("request", (r) => {
		if (["fetch", "xhr"].includes(r.resourceType())) requests.push(r.url());
	});
	const scan = page.locator("#scan");
	const amount = scan.locator("#ds-gas-amount");
	await expect(amount).toHaveValue("4.371,89");

	// An invalid amount: "Speichern" opens its card and focuses it.
	await amount.fill("");
	await scan.getByRole("button", { name: /Betriebsstrom/ }).click();
	await expect(amount).toBeHidden();
	await scan.getByRole("button", { name: /^Speichern/ }).click();
	await expect(amount).toBeFocused();
	await expect(amount).toHaveAttribute("aria-invalid", "true");

	await amount.fill("100");
	await amount.blur();
	await expect(amount).toHaveValue("100,00");
	await expect(
		scan.getByRole("button", { name: /Brennstoff \(Gas\)/ }),
	).toContainText("100,00 €");
	await scan.getByRole("button", { name: /^Speichern/ }).click();
	await expect(scan.getByRole("status")).toContainText(
		"2 Kostenarten übernommen · 412,40 €",
	);

	// "Nein" asks for the period.
	await scan.getByRole("button", { name: "Nein", exact: true }).click();
	await expect(scan.locator("#ds-gas-period")).toBeFocused();
	await expect(scan).toContainText("Leistungszeitraum selbst eingeben");

	// "Neu scannen" starts over.
	await scan.getByRole("button", { name: "Neu scannen" }).click();
	await expect(amount).toHaveValue("4.371,89");
	expect(requests).toEqual([]);
});

test("the cards work by click", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.goto(PATH);
	const section = page.locator("section", {
		has: page.getByRole("heading", {
			name: "Von Anfang bis Ende automatisiert",
		}),
	});
	await section.getByRole("button", { name: "Zählerstände abrufen" }).click();
	await expect(section).toContainText("36 von 36 empfangen");
	await expect(
		section.getByRole("button", { name: "Erneut abrufen" }),
	).toBeVisible();
	await section.getByRole("button", { name: /Wartung/ }).click();
	await expect(section).toContainText("3 zugeordnet");
	await section.getByRole("button", { name: "Abrechnungen erstellen" }).click();
	await expect(
		section.getByRole("button", { name: "36 Abrechnungen erstellt ✓" }),
	).toBeVisible();
});
