import { describe, expect, it } from "vitest";
import { testimonial, testimonials } from "$lib/landing/data/testimonials";
import { ICON_NAMES } from "$lib/landing/sections/uv/icons";
import * as routes from "$lib/routes";
import * as content from "./content";

const {
	audience,
	bill,
	calendar,
	closing,
	devices,
	doc,
	faq,
	hero,
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

describe("funkzaehler content", () => {
	it("has the design's H1 and word", () => {
		expect(hero.srTitle).toBe(
			"Funkzähler von Heidi: Heizkostenverteiler, Wasserzähler und Rauchwarnmelder",
		);
		expect(hero.word).toBe("Funkzähler");
	});

	it("lists four device groups with known icons", () => {
		expect(list.entries.map((e) => e.title)).toEqual([
			"Heizkostenverteiler",
			"Warmwasserzähler",
			"Kaltwasserzähler",
			"Rauchwarnmelder",
		]);
		expect(list.entries.map((e) => e.after)).toEqual([
			"Empfangen",
			"Empfangen",
			"Empfangen",
			"Bereit",
		]);
		for (const entry of [...list.entries, ...list.nav])
			expect(ICON_NAMES).toContain(entry.icon);
	});

	it("shows six devices, each with three points", () => {
		expect(devices.items.map((d) => d.name)).toEqual([
			"Heizkostenverteiler",
			"Wärmemengenzähler",
			"Kaltwasserzähler",
			"Warmwasserzähler",
			"Rauchwarnmelder",
			"Funk-Gateway",
		]);
		expect(devices.items.map((d) => d.category)).toEqual([
			"Heizung",
			"Heizung",
			"Wasser",
			"Wasser",
			"Sicherheit",
			"Übertragung",
		]);
		expect(new Set(devices.items.map((d) => d.key)).size).toBe(6);
		for (const device of devices.items)
			expect(new Set(device.points).size).toBe(3);
		expect(devices.h2).toBe("Sechs Geräte. Ein System.");
	});

	it("has four rows with the design's tiles and tones", () => {
		expect(rows.items.map((r) => r.tag)).toEqual([
			"Heizung",
			"Wasser",
			"Rauchwarnmelder",
			"Fernablesung",
		]);
		expect(rows.items.map((r) => r.tile)).toEqual([
			"doc",
			"phone",
			"calendar",
			"bill",
		]);
		expect(rows.items.map((r) => r.tone)).toEqual([
			"stone",
			"ink",
			"mint",
			"mint",
		]);
		// The first H2 is one line, with the design's soft hyphen.
		expect(rows.items[0].title).toEqual([
			"Heizkosten­verteiler und Wärmezähler.",
		]);
		for (const row of rows.items) expect(row.paragraphs).toHaveLength(2);
	});

	it("fills the tiles with the design's example", () => {
		expect(doc.rows).toHaveLength(4);
		expect(doc.rows.at(-1)).toEqual({ label: "Manipulationsschutz aktiv" });
		expect(phone.value).toBe("380 l");
		expect(phone.bars).toHaveLength(10);
		expect(Math.max(...phone.bars)).toBe(phone.bars.at(-1));
		expect(calendar.months).toHaveLength(9);
		expect(calendar.months.at(-1)).toBe("DG");
		expect(calendar.current).toBe(6);
		expect(bill.rows.filter((r) => r.kind === "cut")).toHaveLength(2);
		expect(bill.rows.filter((r) => r.kind === "ok")).toHaveLength(2);
		expect(bill.sum).toMatchObject({ before: "jedes Jahr", after: "keine" });
	});

	it("rotates the four device groups", () => {
		expect(rotator.phrases).toEqual([
			"Heizkostenverteiler",
			"Wärmezähler",
			"Warm- und Kaltwasserzähler",
			"Rauchwarnmelder",
		]);
	});

	it("has five figures; the counting one counts to its value", () => {
		const figures = [numbers.first, ...numbers.rest];
		expect(figures.map((f) => f.value)).toEqual([
			"15.000+",
			"IP68",
			"10",
			"0",
			"1.1.2027",
		]);
		for (const figure of figures)
			if (figure.count !== undefined)
				expect(figure.count).toBe(Number(figure.value));
	});

	it("has two audience cards: the demo and the Installationstool", () => {
		expect(audience.cards.map((c) => c.cta.href)).toEqual([
			"#start",
			routes.ROUTE_INSTALLATIONSTOOL,
		]);
	});

	it("quotes the shared testimonials word for word", () => {
		const keys = new Set(testimonials.map((t) => t.key));
		expect(quotes.keys).toEqual(["werne", "vitolus", "gerhard"]);
		for (const key of quotes.keys) {
			expect(keys.has(key)).toBe(true);
			expect(testimonial(key).quote).toBe(DESIGN_QUOTES[key]);
		}
	});

	it("has six FAQ items, three with a link", () => {
		expect(faq.items).toHaveLength(6);
		expect(faq.items.map((i) => i.more?.href)).toEqual([
			undefined,
			undefined,
			routes.ROUTE_UPGRADE_NOW,
			routes.ROUTE_MESSDIENSTWECHSEL,
			undefined,
			routes.ROUTE_SICHERHEIT,
		]);
	});

	it("sends every demo CTA to the closing card's form", () => {
		expect(hero.primary.href).toBe("#start");
		expect(rows.primary.href).toBe("#start");
		expect(audience.cards[0].cta.href).toBe("#start");
		expect(closing.submitLabel).toBe("Demo buchen");
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
