import { describe, expect, it } from "vitest";
import { testimonial, testimonials } from "$lib/landing/data/testimonials";
import { DEADLINE } from "$lib/landing/deadline/deadline";
import * as routes from "$lib/routes";
import * as content from "./content";

const {
	KPI,
	bill,
	calendar,
	checker,
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
	vitolus:
		"„Mit Heidi Systems erfassen wir den Verbrauch vollautomatisch – das spart Aufwand und schafft Transparenz für uns und unsere Bewohner.“",
	werne:
		"„Die Ablesungen und Verbrauchserfassungen laufen reibungslos und pünktlich ab – sowohl für uns als Hausverwaltung als auch für unsere Mieter.“",
	gerhard:
		"„Heidi hat uns bei der Sanierung einer Gewerbefläche durch die Installation einer zuverlässigen Verbrauchserfassung optimal unterstützt.“",
};

/** The leading number of a text ("3 Objekte · 28 Einheiten" → 3). */
const lead = (s: string) => Number(s.split(" ")[0]);

describe("mietverwaltung content", () => {
	it("has the design's H1 and word", () => {
		expect(hero.srTitle).toBe("Messdienst für Mietverwaltungen mit Heidi");
		expect(hero.word).toBe("Mietverwaltung");
	});

	it("links only to routes and anchors on the page", () => {
		const all = hrefs(content);
		expect(all).toContain(routes.ROUTE_MIETERPORTAL);
		for (const href of all) {
			if (href.startsWith("#")) expect(ANCHORS).toContain(href);
			else expect(routeValues, href).toContain(href);
		}
	});

	it("has no empty or untrimmed text", () => {
		for (const s of strings(content)) {
			expect(s.trim()).not.toBe("");
			// Runs around an inline link may end or start with a space.
			if (!/^[ .]|[ ]$/.test(s)) expect(s).toBe(s.trim());
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

	it("lists the four owners of its head", () => {
		expect(list.entries).toHaveLength(4);
		expect(list.head).toBe(`${list.entries.length} Eigentümer`);
		for (const entry of list.entries) {
			expect(entry.before).toBe("In Arbeit");
			expect(entry.after).toBe("Bereit für BKA");
		}
	});

	it("switches between the owners' objects as the list counts them", () => {
		const [a, b] = list.entries;
		expect(bill.without).toBe(a.title);
		expect(bill.with).toBe(b.title);
		const sideA = bill.rows.filter((r) => r.kind === "a");
		const sideB = bill.rows.filter((r) => r.kind === "b");
		expect(bill.sum).toMatchObject({
			before: String(sideA.length),
			after: String(sideB.length),
		});
		// Eigentümer B: "1 Objekt · 6 Einheiten" is "Am Markt 7 · 6 WE".
		expect(lead(b.sub)).toBe(sideB.length);
		expect(b.sub.split(" · ")[1]).toBe(
			`${parseInt(sideB[0].label.split(" · ")[1])} Einheiten`,
		);
		// Eigentümer A has more objects than the tile shows, never fewer.
		expect(lead(a.sub)).toBeGreaterThanOrEqual(sideA.length);
	});

	it("finishes twelve objects, the last one in progress", () => {
		expect(calendar.months).toHaveLength(12);
		expect(calendar.months[0]).toBe("Objekt 1");
		expect(calendar.months[11]).toBe("Objekt 12");
		expect(calendar.current).toBe(calendar.months.length - 1);
	});

	it("reads the meters at the move-out, values before the check", () => {
		expect(doc.rows).toHaveLength(4);
		for (const row of doc.rows) expect(row).not.toHaveProperty("share");
		expect(doc.rows.slice(0, 3).every((r) => "value" in r)).toBe(true);
		expect(doc.rows[3]).not.toHaveProperty("value");
	});

	it("shows the tenant's bars on the phone, the last one the figure", () => {
		expect(phone.bars).toHaveLength(10);
		expect(phone.value).toBe(`${phone.bars.at(-1)}\u00a0kWh`);
		expect(phone).not.toHaveProperty("details");
	});

	it("checks four buildings, each with a next step", () => {
		expect(checker.rows).toHaveLength(4);
		expect(new Set(checker.rows.map((r) => r.name)).size).toBe(4);
		expect(new Set(checker.rows.map((r) => r.photo)).size).toBe(4);
		for (const row of checker.rows) expect(row.action).not.toBe("");
	});

	it("has four rotating phrases", () => {
		expect(rotator.phrases).toHaveLength(4);
	});

	it("counts only figures whose value is the count", () => {
		for (const f of [numbers.first, ...figures(0), ...figures(DEADLINE)])
			if (f.count !== undefined) expect(f.value).toBe(String(f.count));
		expect(figures(0).map((f) => f.value)).toEqual(
			expect.arrayContaining([String(KPI.notice), KPI.window]),
		);
	});

	it("uses the design's quotes, word for word", () => {
		const keys = testimonials.map((t) => t.key);
		expect(quotes.keys).toEqual(["vitolus", "werne", "gerhard"]);
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
