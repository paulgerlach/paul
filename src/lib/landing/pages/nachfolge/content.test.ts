import { describe, expect, it } from "vitest";
import { testimonial } from "$lib/landing/data/testimonials";
import { DEADLINE } from "$lib/landing/deadline/deadline";
import * as software from "$lib/landing/pages/softwarepartner/content";
import { DEADLINE_FIGURE } from "$lib/landing/sections/uv/deadlineFigure";
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

describe("nachfolge content", () => {
	it("has the design's H1 and word", () => {
		expect(hero.srTitle).toBe("Nachfolge für Messdienstanbieter mit Heidi");
		expect(hero.word).toBe("Nachfolge");
		expect(hero.wordSize).toBe(software.hero.wordSize);
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

	it("has no empty, untrimmed or doubled-space text", () => {
		for (const s of strings({ ...content, figures: figures(0) })) {
			expect(s.trim()).not.toBe("");
			expect(s).toBe(s.trim());
			expect(s).not.toMatch(/ {2}/);
		}
	});

	it("lists four hand-over steps in the hero's app, each changing its status", () => {
		expect(list.entries).toHaveLength(4);
		for (const entry of list.entries) {
			expect(entry.before).not.toBe(entry.after);
			expect(ICON_NAMES).toContain(entry.icon);
		}
		expect(list.nav).toHaveLength(3);
	});

	it("rotates the list's four items", () => {
		expect(rotator.phrases).toEqual(list.entries.map((e) => e.title));
	});

	it("has four rows, each with its own tile, a two-line title and two paragraphs", () => {
		expect(rows.items).toHaveLength(4);
		expect(new Set(rows.items.map((r) => r.tag)).size).toBe(4);
		expect(rows.items.map((r) => r.tile)).toEqual([
			"phone",
			"doc",
			"calendar",
			"bill",
		]);
		for (const row of rows.items) {
			expect(row.title).toHaveLength(2);
			expect(row.paragraphs).toHaveLength(2);
		}
		expect(rows.primary).toEqual({
			text: "Gespräch anfragen",
			href: "#kontakt",
		});
	});

	it("shows the contact person on the phone", () => {
		expect(phone.value).toBe("Persönlich");
		expect(phone.comparisons).toEqual(["Ein fester Kontakt von Anfang an"]);
	});

	it("checks the four parts of the hand-over", () => {
		expect(doc.rows).toHaveLength(4);
		expect(doc.rows.every((r) => !("value" in r))).toBe(true);
	});

	it("retrofits nine properties, the seventh being planned", () => {
		expect(calendar.months).toHaveLength(9);
		expect(calendar.months[0]).toBe("Liegensch. 1");
		expect(calendar.months[calendar.current]).toBe("Liegensch. 7");
		expect(calendar.noteDoing?.replace("{x}", "Liegensch. 7")).toBe(
			"Liegensch. 7 in Planung",
		);
	});

	it("compares no successor with Heidi", () => {
		expect(bill.rows.filter((r) => r.kind === "cut")).toHaveLength(2);
		expect(bill.rows.filter((r) => r.kind === "ok")).toHaveLength(2);
		expect(bill.sum).toEqual({
			label: "Ihr Lebenswerk",
			before: "offen",
			after: "in guten Händen",
		});
	});

	it("shows five figures, none counting, the deadline's for the day", () => {
		const before = figures(DEADLINE - 1);
		const after = figures(DEADLINE);
		expect([numbers.first, ...before]).toHaveLength(5);
		for (const f of [numbers.first, ...before]) {
			expect(f.count).toBeUndefined();
			expect(f.compact).toBe(true);
		}
		expect(before.map((f) => f.value)).toEqual([
			"15.000+",
			"DE",
			"1.1.2027",
			"Diskret",
		]);
		expect(before[2].text).toBe("Ab dann müssen alle Zähler fernablesbar sein");
		expect(after[2]).toEqual(DEADLINE_FIGURE.expired);
		expect(after.filter((f) => f !== after[2])).toEqual(
			before.filter((f) => f !== before[2]),
		);
	});

	it("leads the first audience card to the form and hides the second card's button", () => {
		expect(audience.cards).toHaveLength(2);
		expect(audience.cards.map((c) => c.cta)).toEqual([
			{ text: "Gespräch anfragen", href: "#kontakt" },
			{ text: "Zu den Partnerschaften" },
		]);
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

	it("has three steps and the form's texts, as /softwarepartner's", () => {
		expect(apply.steps).toHaveLength(3);
		expect(apply.success("Max")).toBe(software.apply.success("Max"));
		for (const key of ["sending", "missing", "sendError"] as const)
			expect(apply[key]).toEqual(software.apply[key]);
		for (const key of ["company", "email", "phone", "consent"] as const)
			expect(apply.fields[key]).toEqual(software.apply.fields[key]);
		expect(apply.steps[0].title).toBe(software.apply.steps[0].title);
		expect(apply.submit).toBe(rows.primary.text);
	});
});
