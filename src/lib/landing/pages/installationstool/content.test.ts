import { describe, expect, it } from "vitest";
import { testimonial, testimonials } from "$lib/landing/data/testimonials";
import { KPI as PARTNER_KPI } from "$lib/landing/pages/installationspartner/content";
import { ICON_NAMES } from "$lib/landing/sections/uv/icons";
import * as routes from "$lib/routes";
import * as content from "./content";

const {
	audience,
	bill,
	calendar,
	camera,
	closing,
	faq,
	hero,
	KPI,
	list,
	numbers,
	phone,
	quotes,
	rotator,
	rows,
} = content;

/** Every string in a value, deeply. */
function strings(value: unknown): string[] {
	if (typeof value === "string") return [value];
	if (Array.isArray(value)) return value.flatMap(strings);
	if (value && typeof value === "object")
		return Object.values(value).flatMap(strings);
	return [];
}

/** Every `href` in a value, deeply. */
function hrefs(value: unknown): string[] {
	if (Array.isArray(value)) return value.flatMap(hrefs);
	if (value && typeof value === "object")
		return Object.entries(value).flatMap(([key, v]) =>
			key === "href" && typeof v === "string" ? [v] : hrefs(v),
		);
	return [];
}

const routeValues = new Set<string>(
	Object.values(routes).filter((v) => typeof v === "string"),
);
const ANCHORS = ["#start", "#inhalt", "#faq"];

/** The design's quotes, word for word. */
const DESIGN_QUOTES = {
	werne:
		"„Die Ablesungen und Verbrauchserfassungen laufen reibungslos und pünktlich ab – sowohl für uns als Hausverwaltung als auch für unsere Mieter.“",
	vitolus:
		"„Mit Heidi Systems erfassen wir den Verbrauch vollautomatisch – das spart Aufwand und schafft Transparenz für uns und unsere Bewohner.“",
	gerhard:
		"„Heidi hat uns bei der Sanierung einer Gewerbefläche durch die Installation einer zuverlässigen Verbrauchserfassung optimal unterstützt.“",
};

describe("installationstool content", () => {
	it("has the design's H1 and word", () => {
		expect(hero.srTitle).toBe("Das Heidi Installationstool für Installateure");
		expect(hero.word).toBe("Installationstool");
	});

	it("lists three flats and the handover protocol", () => {
		expect(list.entries.map((e) => e.title)).toEqual([
			"EG links",
			"EG rechts",
			"1. OG links",
			"Übergabeprotokoll",
		]);
		expect(list.entries.map((e) => e.after)).toEqual([
			"Digitalisiert",
			"Digitalisiert",
			"Digitalisiert",
			"Fertig",
		]);
		for (const entry of [...list.entries, ...list.nav])
			expect(ICON_NAMES).toContain(entry.icon);
	});

	it("has four rows with the design's tiles and tones", () => {
		expect(rows.items.map((r) => r.tag)).toEqual([
			"Ein Link",
			"Zwei Fotos",
			"Digitaler Zwilling",
			"Einmal",
		]);
		expect(rows.items.map((r) => r.tile)).toEqual([
			"phone",
			"camera",
			"calendar",
			"bill",
		]);
		expect(rows.items.map((r) => r.tone)).toEqual([
			"ink",
			"ink",
			"mint",
			"mint",
		]);
		for (const row of rows.items) expect(row.paragraphs).toHaveLength(2);
	});

	it("fills the tiles with the design's example", () => {
		expect(phone.title).toBe("Neuer Auftrag: Lindenallee 12");
		expect(phone.comparisons).toEqual(["Alle Zähler angelegt · Beispiel"]);
		expect(camera.labels).toHaveLength(2);
		expect(calendar.months).toEqual([
			"EG li",
			"EG re",
			"1. OG li",
			"1. OG re",
			"2. OG li",
			"2. OG re",
			"3. OG li",
			"3. OG re",
			"4. OG li",
			"4. OG re",
			"DG li",
			"DG re",
		]);
		expect(calendar.current).toBe(8);
		expect(bill.rows.filter((r) => r.kind === "cut")).toHaveLength(2);
		expect(bill.rows.filter((r) => r.kind === "ok")).toHaveLength(2);
	});

	it("rotates four phrases", () => {
		expect(rotator.phrases).toHaveLength(4);
		expect(rotator.phrases.at(-1)).toBe("Übergabeprotokoll");
	});

	it("has five figures that count to their values", () => {
		const figures = [numbers.first, ...numbers.rest];
		expect(figures).toHaveLength(5);
		for (const figure of figures)
			if (figure.count !== undefined)
				expect(figure.count).toBe(Number(figure.value));
		expect(figures.at(-1)?.compact).toBe(true);
		expect(figures.at(-1)?.count).toBeUndefined();
	});

	it("uses the confirmed KPIs of /partner/installationspartner", () => {
		expect(KPI).toEqual(PARTNER_KPI);
		expect(numbers.rest.map((f) => f.value)).toContain(String(KPI.notice));
		expect(numbers.rest.map((f) => f.value)).toContain(KPI.window);
	});

	it("has two audience cards: the demo and the partner programme", () => {
		expect(audience.cards.map((c) => c.cta.href)).toEqual([
			routes.ROUTE_DEMO_BUCHEN,
			routes.ROUTE_INSTALLATIONSPARTNER,
		]);
	});

	it("quotes the shared testimonials word for word", () => {
		const keys = new Set(testimonials.map((t) => t.key));
		expect(quotes.keys).toEqual(["gerhard", "werne", "vitolus"]);
		for (const key of quotes.keys) {
			expect(keys.has(key)).toBe(true);
			expect(testimonial(key).quote).toBe(DESIGN_QUOTES[key]);
		}
	});

	it("has six FAQ items, the last two with a link", () => {
		expect(faq.items).toHaveLength(6);
		expect(faq.items.map((i) => i.more?.href)).toEqual([
			undefined,
			undefined,
			undefined,
			undefined,
			routes.ROUTE_INSTALLATIONSPARTNER,
			routes.ROUTE_SICHERHEIT,
		]);
	});

	it("sends every demo CTA to the booking page", () => {
		expect(hero.primary.href).toBe(routes.ROUTE_DEMO_BUCHEN);
		expect(rows.primary.href).toBe(routes.ROUTE_DEMO_BUCHEN);
		expect(closing.button).toEqual({
			text: "Live Demo buchen",
			sub: "Mit Ihrem Ansprechpartner",
			href: routes.ROUTE_DEMO_BUCHEN,
		});
	});

	it("links only to routes and anchors on the page", () => {
		for (const href of hrefs(content)) {
			if (href.startsWith("#")) expect(ANCHORS).toContain(href);
			else expect(routeValues.has(href), href).toBe(true);
		}
	});

	it("has no empty, padded or doubled-space text", () => {
		for (const text of strings(content)) {
			expect(text.trim(), JSON.stringify(text)).toBe(text);
			expect(text).not.toBe("");
			expect(text).not.toMatch(/ {2}/);
		}
	});
});
