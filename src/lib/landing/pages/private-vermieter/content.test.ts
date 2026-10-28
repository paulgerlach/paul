import { describe, expect, it } from "vitest";
import { testimonial } from "$lib/landing/data/testimonials";
import * as routes from "$lib/routes";
import * as content from "./content";

const { benefits, compare, faq, flow, hero, quotes, scene, stats } = content;

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
const ANCHORS = ["#start", `#${content.FLOW_ID}`, `#${content.FAQ_ID}`];

/** The design's quotes, word for word. */
const DESIGN_QUOTES = {
	werne:
		"„Die Ablesungen und Verbrauchserfassungen laufen reibungslos und pünktlich ab – sowohl für uns als Hausverwaltung als auch für unsere Mieter.“",
	vitolus:
		"„Mit Heidi Systems erfassen wir den Verbrauch vollautomatisch – das spart Aufwand und schafft Transparenz für uns und unsere Bewohner.“",
	gerhard:
		"„Heidi hat uns bei der Sanierung einer Gewerbefläche durch die Installation einer zuverlässigen Verbrauchserfassung optimal unterstützt.“",
};

describe("private-vermieter content", () => {
	it("has the design's H1", () => {
		expect([...hero.h1, hero.h1Accent].join(" ")).toBe(
			"Ihre Wohnungen. Unser Messdienst. Ihre Ruhe.",
		);
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

	it("puts non-breaking spaces between figures and their units", () => {
		for (const s of strings(content))
			expect(s).not.toMatch(
				/\d (%|Tage|Stunden|Einheiten|Wohnungen|Wohneinheiten|m³|kWh|Dezember)\b/,
			);
	});

	it("has three of each in the scene", () => {
		expect(scene.captions).toHaveLength(3);
		expect(scene.points).toHaveLength(3);
		expect(scene.tags).toHaveLength(3);
		expect(scene.info).toHaveLength(3);
		scene.info.forEach((entry, i) => {
			expect(scene.points[i]).toMatch(/: mehr erfahren$/);
			expect(entry.points).toHaveLength(3);
		});
	});

	it("has three figures, five steps with five panels, six advantages", () => {
		expect(stats.items).toHaveLength(3);
		expect(flow.steps).toHaveLength(5);
		expect(flow.panels).toHaveLength(5);
		// The first and the fourth panel are named after their step.
		expect(flow.panels[0].title).toBe(flow.steps[0].label);
		expect(flow.panels[3].title).toMatch(flow.steps[3].label);
		expect(benefits.items).toHaveLength(6);
	});

	it("keeps the mock-ups' example data consistent", () => {
		const [montage, , info, billing] = flow.panels;
		expect(montage.sub).toBe("Musterstraße 5 · 6 Wohnungen");
		expect(montage.rows[2].note).toBe("4 von 6");
		expect(info.rows[0].text).toBe("6 von 6 Mietern informiert");
		expect(info.bars).toHaveLength(6);
		expect(billing.ok).toBe("6 Abrechnungen fertig");
	});

	it("compares eight rows, Heidi with a yes in each", () => {
		expect(compare.columns).toHaveLength(3);
		expect(compare.rows).toHaveLength(8);
		for (const row of compare.rows) expect(row.values[2]).toBe("yes");
	});

	it("uses the design's quotes, word for word, with the company only", () => {
		expect(quotes.items.map((q) => q.key)).toEqual([
			"werne",
			"vitolus",
			"gerhard",
		]);
		for (const q of quotes.items) {
			const t = testimonial(q.key);
			expect(t.quote).toBe(DESIGN_QUOTES[q.key]);
			expect(t.role.endsWith(q.company)).toBe(true);
		}
	});

	it("uses the same figures as the other pages", () => {
		const all = strings(content).join("\n");
		expect(all).toContain("92 % der Montagen");
		expect(all).toContain("14 Tage vorher");
		expect(all).toContain("1 bis 2 Stunden");
	});

	it("has six questions, the last with its uVI link", () => {
		expect(faq.items).toHaveLength(6);
		expect(faq.items[5].more?.href).toBe(routes.ROUTE_VERBRAUCHSINFORMATION);
	});
});
