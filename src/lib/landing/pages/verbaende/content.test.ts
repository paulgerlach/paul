import { describe, expect, it } from "vitest";
import { testimonial, testimonials } from "$lib/landing/data/testimonials";
import { ICON_NAMES } from "$lib/landing/sections/uv/icons";
import * as routes from "$lib/routes";
import * as content from "./content";

const {
	audience,
	closing,
	doc,
	faq,
	hero,
	list,
	logos,
	numbers,
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

describe("verbaende content", () => {
	it("has the design's H1 and word", () => {
		expect(hero.srTitle).toBe("Heidi Systems in den Verbänden der Branche");
		expect(hero.word).toBe("Verbände");
	});

	it("lists the three associations and data protection, each with one status", () => {
		expect(list.entries.map((e) => e.title)).toEqual([
			"VDIV",
			"DEUMESS",
			"bved",
			"Datenschutz",
		]);
		for (const entry of [...list.entries, ...list.nav])
			expect(ICON_NAMES).toContain(entry.icon);
		for (const entry of list.entries) expect(entry.before).toBe(entry.after);
	});

	it("has four rows: three logo cards and the document", () => {
		expect(rows.items).toHaveLength(4);
		expect(new Set(rows.items.map((r) => r.tag)).size).toBe(4);
		expect(rows.items.map((r) => r.tile)).toEqual([
			"vdiv",
			"deumess",
			"bved",
			"doc",
		]);
		for (const row of rows.items) {
			expect(row.paragraphs).toHaveLength(2);
			expect(row.tone).toBe("stone");
		}
		for (const key of ["vdiv", "deumess", "bved"] as const)
			expect(logos[key]).toBeTruthy();
		expect(doc.rows).toHaveLength(3);
		expect(doc.result).toBe("DSGVO-konform");
	});

	it("repeats each association's line in the list and on its card", () => {
		const subs = list.entries.slice(0, 3).map((e) => e.sub);
		expect(subs).toEqual([logos.vdiv, logos.deumess, logos.bved]);
		// The FAQ's answers name the same associations.
		expect(faq.items[2].answer).toContain(logos.deumess);
		expect(faq.items[3].answer).toContain(logos.bved);
	});

	it("rotates the three associations", () => {
		expect(rotator.phrases).toEqual(["VDIV", "DEUMESS", "bved"]);
		for (const phrase of rotator.phrases) {
			expect(hero.lead).toContain(phrase);
			expect(faq.items[0].answer).toContain(phrase);
		}
	});

	it("has five figures, the first counting to its value", () => {
		expect([numbers.first, ...numbers.rest]).toHaveLength(5);
		expect(numbers.first.count).toBe(Number(numbers.first.value));
		expect(numbers.first.count).toBe(rotator.phrases.length);
		for (const figure of numbers.rest) {
			expect(figure.count).toBeUndefined();
			expect(figure.compact).toBe(true);
		}
	});

	it("has two audience cards with a target each", () => {
		expect(audience.cards).toHaveLength(2);
		for (const card of audience.cards) expect(card.cta.href).toBeTruthy();
	});

	it("quotes the shared testimonials word for word", () => {
		const keys = new Set(testimonials.map((t) => t.key));
		for (const key of quotes.keys) {
			expect(keys.has(key)).toBe(true);
			expect(testimonial(key).quote).toBe(DESIGN_QUOTES[key]);
		}
	});

	it("has five FAQ items, the last linking to /sicherheit", () => {
		expect(faq.items).toHaveLength(5);
		expect(faq.items[4].more?.href).toBe(routes.ROUTE_SICHERHEIT);
	});

	it("sends every demo CTA to the booking page", () => {
		expect(hero.primary.href).toBe(routes.ROUTE_DEMO_BUCHEN);
		expect(rows.primary.href).toBe(routes.ROUTE_DEMO_BUCHEN);
		expect(audience.cards[1].cta.href).toBe(routes.ROUTE_DEMO_BUCHEN);
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
