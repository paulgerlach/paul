import { describe, expect, it } from "vitest";
import { testimonial } from "$lib/landing/data/testimonials";
import * as installer from "$lib/landing/pages/installationspartner/content";
import { ICON_NAMES } from "$lib/landing/sections/uv/icons";
import * as routes from "$lib/routes";
import * as content from "./content";

const {
	apply,
	audience,
	bill,
	calendar,
	closing,
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

const routeValues = new Set(
	Object.values(routes).filter((v) => typeof v === "string"),
);
const ANCHORS = ["#bewerben", "#faq"];

/** The design's quotes, word for word. */
const DESIGN_QUOTES = {
	vitolus:
		"„Mit Heidi Systems erfassen wir den Verbrauch vollautomatisch – das spart Aufwand und schafft Transparenz für uns und unsere Bewohner.“",
	werne:
		"„Die Ablesungen und Verbrauchserfassungen laufen reibungslos und pünktlich ab – sowohl für uns als Hausverwaltung als auch für unsere Mieter.“",
	gerhard:
		"„Heidi hat uns bei der Sanierung einer Gewerbefläche durch die Installation einer zuverlässigen Verbrauchserfassung optimal unterstützt.“",
};

describe("softwarepartner content", () => {
	it("has the design's H1 and word", () => {
		expect(hero.srTitle).toBe("Softwarepartner von Heidi Systems");
		expect(hero.word).toBe("Softwarepartner");
		expect(hero.wordSize).toBe("clamp(34px, 8.6vw, 130px)");
	});

	it("links only to routes, anchors on the page and /messdienstwechsel's form", () => {
		for (const href of hrefs(content)) {
			if (href.startsWith("#")) expect(ANCHORS).toContain(href);
			else if (href.startsWith("tel:"))
				expect(href).toBe(apply.sendError.phoneHref);
			else expect(routeValues, href).toContain(href);
		}
		expect(content.MANAGER_SIGNUP_HREF).toBe("/messdienstwechsel#start");
		expect(`#${content.APPLY_ID}`).toBe(hero.primary.href);
	});

	it("keeps the API documentation hidden until its page exists", () => {
		expect(hero.secondary).toEqual({
			text: "API-Dokumentation",
			href: routes.ROUTE_API_DOKUMENTATION,
		});
	});

	it("has no empty, untrimmed or doubled-space text", () => {
		for (const s of strings(content)) {
			expect(s.trim()).not.toBe("");
			expect(s).toBe(s.trim());
			expect(s).not.toMatch(/ {2}/);
		}
	});

	it("lists four transfers in the hero's app, each changing its status", () => {
		expect(list.entries).toHaveLength(4);
		for (const entry of list.entries) {
			expect(entry.before).not.toBe(entry.after);
			expect(ICON_NAMES).toContain(entry.icon);
		}
		expect(list.nav).toHaveLength(3);
	});

	it("has four rows, each with its own tile, a two-line title and two paragraphs", () => {
		expect(rows.items).toHaveLength(4);
		expect(new Set(rows.items.map((r) => r.tag)).size).toBe(4);
		expect(new Set(rows.items.map((r) => r.tile)).size).toBe(4);
		for (const row of rows.items) {
			expect(row.title).toHaveLength(2);
			expect(row.paragraphs).toHaveLength(2);
		}
		expect(rows.primary.href).toBe("#bewerben");
	});

	it("compares typing values off PDFs with the data set", () => {
		expect(bill.rows.filter((r) => r.kind === "cut")).toHaveLength(2);
		expect(bill.rows.filter((r) => r.kind === "ok")).toHaveLength(2);
		expect(bill.sum).toEqual({
			label: "Doppelte Pflege",
			before: "ja",
			after: "nein",
		});
	});

	it("delivers twelve months, October in progress", () => {
		expect(calendar.months).toHaveLength(12);
		expect(calendar.months[calendar.current]).toBe("Okt");
		expect(calendar.noteDoing).toBe("{x} wird übertragen");
	});

	it("checks three points and the access", () => {
		expect(doc.rows).toHaveLength(4);
		expect(doc.rows.filter((r) => "value" in r)).toEqual([
			{ label: "Zugriff", value: "Nur berechtigt" },
		]);
	});

	it("shows four transfers on the phone, the last one in progress", () => {
		expect(phone.transfers).toHaveLength(4);
		expect(phone.transfers.map((t) => t.state)).toEqual([
			"ok",
			"ok",
			"ok",
			"cur",
		]);
	});

	it("rotates four phrases and shows five figures", () => {
		expect(rotator.phrases).toHaveLength(4);
		expect([numbers.first, ...numbers.rest]).toHaveLength(5);
		expect(numbers.rest.filter((f) => f.count)).toHaveLength(1);
		expect(numbers.rest.filter((f) => f.compact).map((f) => f.value)).toEqual([
			"DE",
			"DSGVO",
		]);
	});

	it("gives both audience cards a target", () => {
		expect(audience.cards).toHaveLength(2);
		expect(audience.cards.map((c) => c.cta.href)).toEqual([
			"#bewerben",
			routes.ROUTE_SCHNITTSTELLEN,
		]);
	});

	it("quotes the shared testimonials word for word", () => {
		expect(quotes.keys).toEqual(["vitolus", "werne", "gerhard"]);
		for (const key of quotes.keys)
			expect(testimonial(key).quote).toBe(DESIGN_QUOTES[key]);
	});

	it("has four FAQ items, the data answer linking /sicherheit", () => {
		expect(faq.items).toHaveLength(4);
		expect(faq.items[2].more).toEqual({
			text: "Mehr zu Sicherheit",
			href: routes.ROUTE_SICHERHEIT,
		});
	});

	it("has three steps and the form's texts, as /installationspartner's", () => {
		expect(apply.steps).toHaveLength(3);
		expect(apply.success("Max")).toBe(installer.apply.success("Max"));
		for (const key of ["submit", "sending", "missing", "sendError"] as const)
			expect(apply[key]).toEqual(installer.apply[key]);
		expect(apply.fields.consent).toBe(installer.apply.fields.consent);
		expect(apply.steps[0]).toEqual(installer.apply.steps[0]);
		expect(closing.cta.href).toBe("#bewerben");
	});
});
