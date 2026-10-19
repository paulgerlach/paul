import { describe, expect, it } from "vitest";
import { testimonial, testimonials } from "$lib/landing/data/testimonials";
import * as routes from "$lib/routes";
import * as wohnungsunternehmen from "$lib/landing/pages/wohnungsunternehmen/content";
import * as content from "./content";

const {
	benefits,
	calc,
	faq,
	features,
	hero,
	large,
	pain,
	quotes,
	steps,
	tabs,
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
const ANCHORS = ["#start", `#${content.PAIN_ID}`];

/** The design's quotes, word for word. */
const DESIGN_QUOTES = {
	werne:
		"„Die Ablesungen und Verbrauchserfassungen laufen reibungslos und pünktlich ab – sowohl für uns als Hausverwaltung als auch für unsere Mieter.“",
	gerhard:
		"„Heidi hat uns bei der Sanierung einer Gewerbefläche durch die Installation einer zuverlässigen Verbrauchserfassung optimal unterstützt.“",
};

describe("asset-manager content", () => {
	it("has the design's H1", () => {
		expect(`${hero.h1} ${hero.h1Accent}`).toBe(
			"Verbräuche im ganzen Portfolio. Auf einen Blick.",
		);
	});

	it("links only to routes and anchors on the page", () => {
		for (const href of hrefs(content)) {
			if (href.startsWith("#")) expect(ANCHORS).toContain(href);
			else expect(routeValues, href).toContain(href);
		}
	});

	it("has no empty text; only split headings and runs of a paragraph touch spaces", () => {
		const headings = new Set(
			[large.h2, pain.h2, benefits.h2, steps.h2].map((h) => h.text),
		);
		const runs = new Set(strings(features.hub.text));
		for (const s of strings(content)) {
			expect(s.trim()).not.toBe("");
			if (runs.has(s)) continue;
			if (headings.has(s)) expect(s).toBe(`${s.trim()} `);
			else expect(s).toBe(s.trim());
		}
	});

	it("puts non-breaking spaces between figures and their units", () => {
		for (const s of strings(content)) {
			expect(s).not.toMatch(/\d (%|Tage|Stunden|Einheiten)/);
		}
	});

	it("has five customer tabs, each linking its segment page", () => {
		expect(tabs.items).toHaveLength(5);
		const current = tabs.items.filter((t) => "current" in t && t.current);
		expect(current).toHaveLength(1);
		expect(current[0].href).toBe(routes.ROUTE_ASSET_MANAGER);
		expect(tabs.items.map((t) => t.href)).toEqual([
			routes.ROUTE_HAUSVERWALTUNG,
			routes.ROUTE_MIETVERWALTUNG,
			routes.ROUTE_WEG_VERWALTUNG,
			routes.ROUTE_WOHNUNGSUNTERNEHMEN,
			routes.ROUTE_ASSET_MANAGER,
		]);
	});

	it("answers each of the eight problems", () => {
		expect(pain.items).toHaveLength(8);
		expect(new Set(pain.items.map((i) => i.problem)).size).toBe(8);
		expect(new Set(pain.items.map((i) => i.title)).size).toBe(8);
		expect(pain.count.many).toContain("{n}");
	});

	it("hides the links whose pages don't exist yet", () => {
		expect(large.secondary?.href).toBe(routes.ROUTE_PORTFOLIO_CHECKER);
		// The Muster-Kündigung and the Messdienstanbieter-Vergleich have pages.
		expect(pain.links.map((link) => link.href)).toEqual([
			routes.ROUTE_MUSTER_KUENDIGUNG,
			routes.ROUTE_MESSDIENSTANBIETER_VERGLEICH,
			undefined,
		]);
	});

	it("has four benefits, the first dark, and four steps", () => {
		expect(benefits.items).toHaveLength(4);
		expect(benefits.items.filter((b) => b.dark)).toEqual([benefits.items[0]]);
		expect(steps.items).toHaveLength(4);
	});

	it("keeps the tiles' example data consistent", () => {
		expect(features.billing.tile.total).toBe(24);

		const { rows, max } = features.monthly.tile;
		expect(rows.filter((r) => r.outlier)).toHaveLength(1);
		for (const r of rows) {
			expect(r.value).toBeLessThanOrEqual(max);
			if (r.outlier) expect(r.value).toBeGreaterThan(r.previous);
		}

		const rollout = features.rollout.tile;
		expect(rollout.rows).toHaveLength(4);
		expect(rollout.rows.filter((r) => r.done)).toHaveLength(2);
		for (const change of rollout.timeline) {
			expect(rollout.rows[change.row].name).toBe(change.name);
			expect(change.at).toBeLessThan(rollout.every);
		}
		// The loop ends with every property done.
		const last = new Map(rollout.timeline.map((c) => [c.row, c]));
		rollout.rows.forEach((row, i) =>
			expect(last.get(i)?.done ?? row.done).toBe(true),
		);
	});

	it("uses the same figures as the other pages", () => {
		const all = strings(content).join("\n");
		expect(all).toContain("92 % der Installationen");
		expect(all).toContain("14 Tage vorher");
		expect(all).toContain("1 bis 2 Stunden");
	});

	it("starts the calculator above the large-stock threshold", () => {
		expect(calc.start).toBe(12000);
		expect(calc.large.tag).toBe("Ab 1.000\u00a0Einheiten");
	});

	it("uses the design's quotes, word for word", () => {
		const keys = testimonials.map((t) => t.key);
		expect(quotes.keys).toEqual(["gerhard", "werne"]);
		for (const key of quotes.keys) {
			expect(keys).toContain(key);
			expect(testimonial(key).quote).toBe(
				DESIGN_QUOTES[key as keyof typeof DESIGN_QUOTES],
			);
		}
	});

	it("has four questions", () => {
		expect(faq.items).toHaveLength(4);
	});

	it("shares the template's texts with /wohnungsunternehmen", () => {
		for (const key of [
			"logos",
			"large",
			"pain",
			"features",
			"steps",
			"closing",
		] as const)
			expect(content[key], key).toEqual(wohnungsunternehmen[key]);
		expect({ ...calc, start: 0 }).toEqual({
			...wohnungsunternehmen.calc,
			start: 0,
		});
		expect(faq.items.slice(2)).toEqual(wohnungsunternehmen.faq.items.slice(2));
		const plain = (t: { current?: boolean }) => ({ ...t, current: undefined });
		expect(tabs.items.map(plain)).toEqual(
			wohnungsunternehmen.tabs.items.map(plain),
		);
	});
});
