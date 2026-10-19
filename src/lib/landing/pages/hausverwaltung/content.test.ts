import { describe, expect, it } from "vitest";
import { testimonial, testimonials } from "$lib/landing/data/testimonials";
import { DEADLINE } from "$lib/landing/deadline/deadline";
import * as routes from "$lib/routes";
import * as content from "./content";

const {
	KPI,
	bill,
	calendar,
	doc,
	faq,
	figures,
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

/** Every `href` in a value, deeply (also inside FAQ answers). */
function hrefs(value: unknown): string[] {
	if (typeof value === "string")
		return [...value.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
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
const ANCHORS = ["#inhalt", "#faq", "#start"];

/** The design's quotes, word for word. */
const DESIGN_QUOTES = {
	werne:
		"„Die Ablesungen und Verbrauchserfassungen laufen reibungslos und pünktlich ab – sowohl für uns als Hausverwaltung als auch für unsere Mieter.“",
	vitolus:
		"„Mit Heidi Systems erfassen wir den Verbrauch vollautomatisch – das spart Aufwand und schafft Transparenz für uns und unsere Bewohner.“",
	gerhard:
		"„Heidi hat uns bei der Sanierung einer Gewerbefläche durch die Installation einer zuverlässigen Verbrauchserfassung optimal unterstützt.“",
};

describe("hausverwaltung content", () => {
	it("has the design's H1 and word", () => {
		expect(hero.srTitle).toBe("Messdienst für Hausverwaltungen mit Heidi");
		expect(hero.word).toBe("Hausverwaltung");
	});

	it("links only to routes and anchors on the page", () => {
		for (const href of hrefs(content)) {
			if (href.startsWith("#")) expect(ANCHORS).toContain(href);
			else expect(routeValues, href).toContain(href);
		}
	});

	it("has no empty or untrimmed text", () => {
		for (const s of strings(content)) {
			expect(s.trim()).not.toBe("");
			expect(s).toBe(s.trim());
		}
	});

	it("has four rows, each with a two-line title and two paragraphs", () => {
		expect(rows.items).toHaveLength(4);
		expect(new Set(rows.items.map((r) => r.tile)).size).toBe(4);
		for (const row of rows.items) {
			expect(row.title).toHaveLength(2);
			expect(row.paragraphs).toHaveLength(2);
		}
	});

	it("shows four of the 24 buildings, the same count as the bill", () => {
		expect(list.entries).toHaveLength(4);
		expect(list.head).toBe("24 Objekte");
		const count = bill.rows.find((r) => r.label === "Liegenschaften");
		expect(list.head).toBe(`${count?.value} Objekte`);
		for (const entry of list.entries)
			expect(entry.before).not.toBe(entry.after);
	});

	it("bills the list's first building with its unit count", () => {
		const [first] = list.entries;
		const units = first.sub.split(" ")[0];
		expect(doc.sub).toBe(`${first.title} · ${units} Einheiten · Beispiel`);
		expect(doc.rows).toHaveLength(4);
		for (const row of doc.rows) expect(row).not.toHaveProperty("share");
	});

	it("reads twelve units, the last one in progress", () => {
		expect(calendar.months).toHaveLength(12);
		expect(calendar.months[0]).toBe("WE 01");
		expect(calendar.months[11]).toBe("WE 12");
		expect(calendar.current).toBe(calendar.months.length - 1);
	});

	it("announces the installation as the row and the figures say", () => {
		expect(rows.items[2].paragraphs[0]).toContain(`${KPI.notice} Tage vorher`);
		expect(rows.items[2].paragraphs[0]).toContain("1 bis 2 Stunden");
		expect(phone.sub).toContain("1 bis 2 Stunden");
		expect(phone.details.at(-1)?.value).toBe("1 bis 2 Stunden");
		expect(figures(0).map((f) => f.value)).toEqual(
			expect.arrayContaining([String(KPI.notice), KPI.window]),
		);
		expect(phone).not.toHaveProperty("bars");
	});

	it("switches every manual row for one done by Heidi", () => {
		const kinds = bill.rows.map((r) => r.kind);
		expect(kinds.filter((k) => k === "cut")).toHaveLength(2);
		expect(kinds.filter((k) => k === "ok")).toHaveLength(2);
		expect(kinds.lastIndexOf("cut")).toBeLessThan(kinds.indexOf("ok"));
		expect(bill.sum).toEqual({
			label: "Doppelte Pflege",
			before: "ja",
			after: "nein",
		});
	});

	it("has four rotating phrases", () => {
		expect(rotator.phrases).toHaveLength(4);
	});

	it("counts only figures whose value is the count", () => {
		for (const f of [numbers.first, ...figures(0), ...figures(DEADLINE)])
			if (f.count !== undefined) expect(f.value).toBe(String(f.count));
	});

	it("uses the design's quotes, word for word", () => {
		const keys = testimonials.map((t) => t.key);
		expect(quotes.keys).toEqual(["werne", "vitolus", "gerhard"]);
		for (const key of quotes.keys) {
			expect(keys).toContain(key);
			expect(testimonial(key).quote).toBe(DESIGN_QUOTES[key]);
		}
	});

	it("has six questions", () => {
		expect(faq.items).toHaveLength(6);
		for (const item of faq.items) expect(item.answer.trim()).not.toBe("");
	});

	it("switches the deadline figure at the deadline", () => {
		const before = DEADLINE - 1;
		expect(figures(before)).toHaveLength(4);
		expect(figures(before).at(-1)?.value).toBe("31.12.2026");
		expect(figures(DEADLINE).map((f) => f.value)).not.toContain("31.12.2026");
	});
});
