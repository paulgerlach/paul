import { describe, expect, it } from "vitest";
import { testimonial } from "$lib/landing/data/testimonials";
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
	quotes,
	rotator,
	rows,
	tracking,
	twin,
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
const ANCHORS = ["#bewerben", "#inhalt", "#faq"];

/** The design's quotes, word for word. */
const DESIGN_QUOTES = {
	werne:
		"„Die Ablesungen und Verbrauchserfassungen laufen reibungslos und pünktlich ab – sowohl für uns als Hausverwaltung als auch für unsere Mieter.“",
	vitolus:
		"„Mit Heidi Systems erfassen wir den Verbrauch vollautomatisch – das spart Aufwand und schafft Transparenz für uns und unsere Bewohner.“",
	gerhard:
		"„Heidi hat uns bei der Sanierung einer Gewerbefläche durch die Installation einer zuverlässigen Verbrauchserfassung optimal unterstützt.“",
};

describe("installationspartner content", () => {
	it("has the design's H1 and word", () => {
		expect(hero.srTitle).toBe("Installationspartner von Heidi Systems");
		expect(hero.word).toBe("Installationspartner");
		expect(hero.wordSize).toBe("clamp(34px, 8.6vw, 130px)");
	});

	it("links only to routes and anchors on the page", () => {
		for (const href of hrefs(content)) {
			if (href.startsWith("#")) expect(ANCHORS).toContain(href);
			else if (href.startsWith("tel:"))
				expect(href).toBe(apply.sendError.phoneHref);
			else expect(routeValues, href).toContain(href);
		}
		expect(`#${content.APPLY_ID}`).toBe(hero.primary.href);
	});

	it("has no empty, untrimmed or doubled-space text", () => {
		for (const s of strings(content)) {
			// The push's parts run around its bold "2 Wohnungen".
			if (s === tracking.push.before || s === tracking.push.after) continue;
			expect(s.trim()).not.toBe("");
			expect(s).toBe(s.trim());
			expect(s).not.toMatch(/ {2}/);
		}
		const push = `${tracking.push.before}${tracking.push.strong}${tracking.push.after}`;
		expect(push).toBe("Ihr Monteur ist noch 2 Wohnungen von Ihnen entfernt.");
	});

	it("lists four entries in the hero's app, each changing its status", () => {
		expect(list.entries).toHaveLength(4);
		for (const entry of list.entries)
			expect(entry.before).not.toBe(entry.after);
		expect(list.nav).toHaveLength(3);
	});

	it("has five rows, each with its own tile, a two-line title and two paragraphs", () => {
		expect(rows.items).toHaveLength(5);
		expect(new Set(rows.items.map((r) => r.tag)).size).toBe(5);
		expect(new Set(rows.items.map((r) => r.tile)).size).toBe(5);
		for (const row of rows.items) {
			expect(row.title).toHaveLength(2);
			expect(row.paragraphs).toHaveLength(2);
		}
		expect(rows.primary.href).toBe("#bewerben");
	});

	it("certifies with three checks and the region", () => {
		expect(doc.rows).toHaveLength(4);
		expect(doc.rows.filter((r) => "value" in r)).toEqual([
			{ label: "Einsatzgebiet", value: "Region Nord" },
		]);
	});

	it("shows four flats on the phone, one being photographed", () => {
		expect(twin.units).toHaveLength(4);
		expect(twin.units.filter((u) => u.state === "cur")).toHaveLength(1);
		expect(
			twin.units.filter((u) => u.state === "open")[0].badge,
		).toBeUndefined();
		expect(twin.facts).toHaveLength(3);
	});

	it("documents twelve flats, the tenth in progress", () => {
		expect(calendar.months).toHaveLength(12);
		expect(calendar.months[0]).toBe("WE 01");
		expect(calendar.current).toBe(9);
	});

	it("tracks eight flats on four floors", () => {
		expect(tracking.units).toHaveLength(8);
		expect(tracking.floors).toHaveLength(4);
		expect(tracking.steps).toHaveLength(4);
		expect(tracking.sub.startsWith(`${tracking.units.at(-1)} · `)).toBe(true);
	});

	it("compares the clipboard with the tool", () => {
		expect(bill.rows.filter((r) => r.kind === "cut")).toHaveLength(2);
		expect(bill.rows.filter((r) => r.kind === "ok")).toHaveLength(2);
		expect(bill.sum).toEqual({
			label: "Nacharbeit im Büro",
			before: "Stunden",
			after: "keine",
		});
	});

	it("rotates four phrases and shows five figures", () => {
		expect(rotator.phrases).toHaveLength(4);
		expect([numbers.first, ...numbers.rest]).toHaveLength(5);
		expect(numbers.rest.at(-1)).toEqual({ value: "0", text: "Klemmbretter" });
	});

	it("gives both audience cards a target", () => {
		expect(audience.cards).toHaveLength(2);
		expect(audience.cards.map((c) => c.cta.href)).toEqual([
			"#bewerben",
			routes.ROUTE_VORGEHEN,
		]);
	});

	it("quotes the shared testimonials word for word", () => {
		for (const key of quotes.keys)
			expect(testimonial(key).quote).toBe(DESIGN_QUOTES[key]);
	});

	it("has five FAQ items, the Installationstool link waiting for its page", () => {
		expect(faq.items).toHaveLength(5);
		expect(faq.items[2].more).toEqual({
			text: "Mehr zum Installationstool",
			href: routes.ROUTE_INSTALLATIONSTOOL,
		});
	});

	it("has three steps and the form's texts", () => {
		expect(apply.steps).toHaveLength(3);
		expect(apply.success("Max")).toBe("Danke, Max! Wir melden uns bei Ihnen.");
		expect(apply.sendError.phone).toBe("+49 30 80098852");
		expect(closing.cta.href).toBe("#bewerben");
	});
});
