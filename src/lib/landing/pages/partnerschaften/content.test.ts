import { describe, expect, it } from "vitest";
import { testimonial } from "$lib/landing/data/testimonials";
import * as nachfolge from "$lib/landing/pages/nachfolge/content";
import { ICON_NAMES } from "$lib/landing/sections/uv/icons";
import * as routes from "$lib/routes";
import * as content from "./content";

const {
	apply,
	audience,
	bill,
	calendar,
	closing,
	connection,
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
const ANCHORS = ["#kontakt", "#inhalt", "#faq"];

/** The design's quotes, word for word. */
const DESIGN_QUOTES = {
	werne:
		"„Die Ablesungen und Verbrauchserfassungen laufen reibungslos und pünktlich ab – sowohl für uns als Hausverwaltung als auch für unsere Mieter.“",
	vitolus:
		"„Mit Heidi Systems erfassen wir den Verbrauch vollautomatisch – das spart Aufwand und schafft Transparenz für uns und unsere Bewohner.“",
	gerhard:
		"„Heidi hat uns bei der Sanierung einer Gewerbefläche durch die Installation einer zuverlässigen Verbrauchserfassung optimal unterstützt.“",
};

describe("partnerschaften content", () => {
	it("has the design's H1 and word", () => {
		expect(hero.srTitle).toBe("Partnerschaften mit Heidi Systems");
		expect(hero.word).toBe("Partnerschaften");
		expect(hero.wordSize).toBe(nachfolge.hero.wordSize);
	});

	it("links only to routes and anchors on the page", () => {
		for (const href of hrefs(content)) {
			if (href.startsWith("#")) expect(ANCHORS).toContain(href);
			else if (href.startsWith("tel:"))
				expect(href).toBe(apply.sendError.phoneHref);
			else expect(routeValues, href).toContain(href);
		}
		expect(content.KONTAKT_HREF).toBe("#kontakt");
		expect(hero.primary.href).toBe(content.KONTAKT_HREF);
		expect(hero.secondary.href).toBe("#inhalt");
		expect(closing.button.href).toBe(content.KONTAKT_HREF);
	});

	it("links FAQ answers only to routes", () => {
		const inline = faq.items.flatMap((item) =>
			[...item.answer.matchAll(/href="([^"]*)"/g)].map((m) => m[1]),
		);
		expect(inline).toEqual([
			routes.ROUTE_API_DOKUMENTATION,
			routes.ROUTE_SOFTWAREPARTNER,
			routes.ROUTE_NACHFOLGE,
		]);
	});

	it("has no empty, untrimmed or doubled-space text", () => {
		// A run of text before a link keeps its space; the paragraph as a whole is checked.
		const paragraphs = rows.items.flatMap((r) =>
			r.paragraphs.map((p) => strings(p).join("")),
		);
		const rest = strings({
			...content,
			rows: {
				...rows,
				items: rows.items.map((r) => ({ ...r, paragraphs: null })),
			},
		});
		for (const s of [...rest, ...paragraphs]) {
			expect(s.trim()).not.toBe("");
			expect(s).toBe(s.trim());
			expect(s).not.toMatch(/ {2}/);
		}
	});

	it("lists four kinds of partner in the hero's app, each changing its status", () => {
		expect(list.entries).toHaveLength(4);
		for (const entry of list.entries) {
			expect(entry.before).not.toBe(entry.after);
			expect(ICON_NAMES).toContain(entry.icon);
		}
		expect(list.nav).toHaveLength(3);
	});

	it("rotates four kinds of partner", () => {
		expect(rotator.phrases).toEqual([
			"Softwareanbieter",
			"Installationsbetriebe",
			"Verbände",
			"Messdienstanbieter",
		]);
	});

	it("has four rows, each with its own tile, a two-line title and two paragraphs", () => {
		expect(rows.items).toHaveLength(4);
		expect(new Set(rows.items.map((r) => r.tag)).size).toBe(4);
		expect(rows.items.map((r) => r.tile)).toEqual([
			"doc",
			"phone",
			"calendar",
			"bill",
		]);
		for (const row of rows.items) {
			expect(row.title).toHaveLength(2);
			expect(row.paragraphs).toHaveLength(2);
		}
		expect(rows.primary).toEqual({
			text: "Partnerschaft anfragen",
			href: "#kontakt",
		});
		expect(rows.items[0].paragraphs[1]).toEqual([
			"Nach bved-Standard oder über die ",
			{ text: "Heidi API", href: routes.ROUTE_API_DOKUMENTATION },
			".",
		]);
		expect(hrefs(rows.items[1])).toEqual([routes.ROUTE_INSTALLATIONSPARTNER]);
		expect(hrefs(rows.items[2])).toEqual([routes.ROUTE_NACHFOLGE]);
	});

	it("checks three deliveries and names the standard", () => {
		expect(doc.rows).toHaveLength(4);
		expect(doc.rows.filter((r) => "value" in r)).toEqual([
			{ label: "Standard", value: "bved" },
		]);
	});

	it("shows the installation job on the phone", () => {
		expect(phone.value).toBe("12 Wohnungen");
		expect(phone.comparisons).toEqual(["Alle Zähler angelegt · Beispiel"]);
	});

	it("has nine partners in the grid, the visitor's idea current", () => {
		expect(calendar.months).toHaveLength(9);
		expect(new Set(calendar.months).size).toBe(9);
		expect(calendar.current).toBe(calendar.months.length - 1);
		expect(calendar.months[calendar.current]).toBe("Ihre Idee");
		expect(calendar.noteDoing?.replace("{x}", "Ihre Idee")).toBe(
			"Ihre Idee im Gespräch",
		);
	});

	it("compares going alone with Heidi", () => {
		expect(bill.rows.filter((r) => r.kind === "cut")).toHaveLength(2);
		expect(bill.rows.filter((r) => r.kind === "ok")).toHaveLength(2);
		expect(bill.sum).toEqual({
			label: "Aufwand",
			before: "hoch",
			after: "gering",
		});
	});

	it("shows five figures around the photo, none counting", () => {
		const all = [numbers.first, ...numbers.rest];
		expect(all.map((f) => f.value)).toEqual([
			"VDIV",
			"DEUMESS",
			"bved",
			"15.000+",
			"DE",
		]);
		for (const f of all) {
			expect(f.count).toBeUndefined();
			expect(f.compact).toBe(true);
		}
	});

	it("leads the audience cards to the two partner pages", () => {
		expect(audience.software.cta).toEqual({
			text: "Softwarepartner werden",
			href: routes.ROUTE_SOFTWAREPARTNER,
		});
		expect(audience.installer.cta).toEqual({
			text: "Installationspartner werden",
			href: routes.ROUTE_INSTALLATIONSPARTNER,
		});
	});

	it("quotes the shared testimonials word for word", () => {
		expect(quotes.keys).toEqual(["werne", "vitolus", "gerhard"]);
		for (const key of quotes.keys)
			expect(testimonial(key).quote).toBe(DESIGN_QUOTES[key]);
	});

	it("has five FAQ items, the data answer linking /sicherheit", () => {
		expect(faq.items).toHaveLength(5);
		expect(faq.items[4].more).toEqual({
			text: "Mehr zu Sicherheit",
			href: routes.ROUTE_SICHERHEIT,
		});
	});

	it("has three steps and the form's texts, as /nachfolge's", () => {
		expect(apply.steps).toHaveLength(3);
		expect(apply.success("Max")).toBe(nachfolge.apply.success("Max"));
		for (const key of ["sending", "missing", "sendError"] as const)
			expect(apply[key]).toEqual(nachfolge.apply[key]);
		for (const key of ["company", "name", "email", "phone", "consent"] as const)
			expect(apply.fields[key]).toEqual(nachfolge.apply.fields[key]);
		expect(apply.steps[0].title).toBe(nachfolge.apply.steps[0].title);
		expect(apply.submit).toBe(rows.primary.text);
	});

	it("gives the card form the contact form's shared texts", () => {
		for (const key of ["sending", "missing", "sendError"] as const)
			expect(connection[key]).toEqual(apply[key]);
		for (const key of ["company", "name", "email", "consent"] as const)
			expect(connection.fields[key]).toEqual(apply.fields[key]);
		expect(content.CONNECTION_ID).toBe("anbindung");
	});
});
