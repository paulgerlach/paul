import { describe, expect, it } from "vitest";
import { testimonial, testimonials } from "$lib/landing/data/testimonials";
import * as routes from "$lib/routes";
import * as content from "./content";

const {
	audience,
	bill,
	calendar,
	check,
	closing,
	dashboard,
	decoder,
	faq,
	hero,
	hub,
	keys,
	law,
	merge,
	numbers,
	orb,
	quotes,
	reading,
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
const ANCHORS = ["#inhalt", "#faq", "#recht"];

/** The design's quotes, word for word. */
const DESIGN_QUOTES = {
	werne:
		"„Die Ablesungen und Verbrauchserfassungen laufen reibungslos und pünktlich ab – sowohl für uns als Hausverwaltung als auch für unsere Mieter.“",
	vitolus:
		"„Mit Heidi Systems erfassen wir den Verbrauch vollautomatisch – das spart Aufwand und schafft Transparenz für uns und unsere Bewohner.“",
	gerhard:
		"„Heidi hat uns bei der Sanierung einer Gewerbefläche durch die Installation einer zuverlässigen Verbrauchserfassung optimal unterstützt.“",
};

describe("interoperabilitaet content", () => {
	it("has the design's H1 and its two lines", () => {
		expect(hero.srTitle).toBe(
			"Ein Dashboard. Jeder Hersteller. Zähler-Interoperabilität: Heidi liest Zähler jedes Herstellers aus und erstellt die Abrechnung",
		);
		expect(hero.word).toEqual(["Ein Dashboard.", "Jeder Hersteller."]);
	});

	it("fills the hub's dashboard to the building's 102 devices", () => {
		expect(hub.groups.map((g) => g.total)).toEqual([48, 24, 24, 6]);
		expect(hub.groups.reduce((a, g) => a + g.total, 0)).toBe(102);
		expect(hub.devices).toHaveLength(7);
		for (const device of hub.devices)
			expect(hub.groups[device.group]).toBeDefined();
		// Every group gets packets from a device.
		expect(new Set(hub.devices.map((d) => d.group)).size).toBe(4);
	});

	it("has four rows with the design's tiles and tones", () => {
		expect(rows.items.map((r) => r.tag)).toEqual([
			"Herstellerunabhängig",
			"Bestand übernehmen",
			"Prüfung",
			"Abrechnung",
		]);
		expect(rows.items.map((r) => r.tile)).toEqual([
			"decoder",
			"bill",
			"check",
			"calendar",
		]);
		expect(rows.items.map((r) => r.tone)).toEqual([
			"stone",
			"mint",
			"stone",
			"mint",
		]);
		for (const row of rows.items) expect(row.paragraphs).toHaveLength(2);
	});

	it("fills the tiles with the design's example", () => {
		expect(decoder.rows).toHaveLength(5);
		expect(bill.rows.filter((r) => r.kind === "cut")).toHaveLength(2);
		expect(bill.sum).toMatchObject({
			before: "für jedes Gerät",
			after: "keine",
		});
		expect(check.groups.map((g) => g.count)).toEqual([
			"48 Geräte",
			"24 Geräte",
			"24 Geräte",
			"6 Geräte",
		]);
		// The check's groups are the hub's.
		expect(check.groups.map((g) => g.name)).toEqual(
			hub.groups.map((g) => g.name),
		);
		expect(calendar.months).toHaveLength(9);
		expect(calendar.current).toBe(7);
	});

	it("rotates the four device groups", () => {
		expect(rotator.phrases).toEqual([
			"Heizkostenverteiler",
			"Wärmezähler",
			"Warmwasserzähler",
			"Kaltwasserzähler",
		]);
	});

	it("has five figures; the counting one counts to its value", () => {
		const figures = [numbers.first, ...numbers.rest];
		expect(figures.map((f) => f.value)).toEqual([
			"1",
			"0",
			"HKVO",
			"bved",
			"DE",
		]);
		for (const figure of figures)
			if (figure.count !== undefined)
				expect(figure.count).toBe(Number(figure.value));
	});

	it("puts eight systems around the orb", () => {
		expect(orb.systems.map((s) => s.name)).toEqual([
			"ERP",
			"CRM",
			"Buchhaltung",
			"bved",
			"Mieterportal",
			"Dokumente",
			"Rechnungen",
			"Kalender",
		]);
	});

	it("has the four dashboard cards with their scenes' data", () => {
		expect(Object.values(dashboard.cards).map((c) => c.href)).toEqual([
			routes.ROUTE_DASHBOARD,
			routes.ROUTE_DASHBOARD,
			"#recht",
			routes.ROUTE_MESSDIENSTWECHSEL,
		]);
		expect(reading.rows).toHaveLength(5);
		for (const row of reading.rows)
			expect(row.value.toFixed(row.decimals)).toBe(String(row.value));
		// Every source sends whole packets.
		for (const source of merge.sources)
			expect(source.total % merge.step).toBe(0);
		expect(keys.services).toHaveLength(3);
	});

	it("has the timeline with the next deadline marked and the passed ones counted", () => {
		expect(law.timeline.map((s) => s.date)).toEqual([
			"1. Dez. 2021",
			"1. Dez. 2022",
			"31. Dez. 2026",
			"31. Dez. 2031",
		]);
		expect(law.timeline.findIndex((s) => s.badge)).toBe(law.passed);
		expect(law.cards).toHaveLength(4);
	});

	it("quotes the shared testimonials word for word", () => {
		const known = new Set(testimonials.map((t) => t.key));
		expect(quotes.keys).toEqual(["werne", "vitolus", "gerhard"]);
		for (const key of quotes.keys) {
			expect(known.has(key)).toBe(true);
			expect(testimonial(key).quote).toBe(DESIGN_QUOTES[key]);
		}
	});

	it("has eight FAQ items, four with a link", () => {
		expect(faq.items).toHaveLength(8);
		expect(faq.items.map((i) => i.more?.href)).toEqual([
			undefined,
			undefined,
			routes.ROUTE_MESSDIENSTWECHSEL,
			"#recht",
			routes.ROUTE_UPGRADE_NOW,
			undefined,
			undefined,
			routes.ROUTE_SICHERHEIT,
		]);
	});

	it("sends every demo CTA to the booking page", () => {
		expect(hero.primary.href).toBe(routes.ROUTE_DEMO_BUCHEN);
		expect(rows.primary.href).toBe(routes.ROUTE_DEMO_BUCHEN);
		expect(audience.stock.cta.href).toBe(routes.ROUTE_DEMO_BUCHEN);
		expect(audience.software.cta.href).toBe(routes.ROUTE_API_DOKUMENTATION);
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
