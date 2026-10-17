import { describe, expect, it } from "vitest";
import { DEMO_HREF, START_HREF } from "$lib/landing/cta";
import {
	testimonial,
	testimonials as all,
} from "$lib/landing/data/testimonials";
import * as routes from "$lib/routes";
import * as content from "./content";
import { RECOMMENDATION_KINDS } from "./recommendations";

const {
	billingRun,
	features,
	hero,
	kpis,
	leak,
	questions,
	quote,
	recommendations,
	testimonials,
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
		return Object.entries(value).flatMap(([k, v]) =>
			k === "href" && typeof v === "string" ? [v] : hrefs(v),
		);
	return [];
}

const allowed = new Set([
	DEMO_HREF,
	START_HREF,
	...Object.values(routes).filter((v) => typeof v === "string"),
]);

describe("dashboard content", () => {
	it("has no empty strings or XX placeholders", () => {
		for (const s of strings(content)) {
			expect(s.trim()).not.toBe("");
			expect(s).not.toMatch(/\bXX\b/);
		}
	});

	it("links only to the form or to routes", () => {
		const found = hrefs(content);
		expect(found.length).toBeGreaterThan(3);
		for (const href of found) expect(allowed).toContain(href);
	});

	it("has three chips and a twelve-month sparkline", () => {
		expect(Object.keys(hero.chips)).toHaveLength(3);
		expect(kpis.usage.spark).toHaveLength(12);
	});

	it("lays the bento out in rows of 7 + 5", () => {
		expect(features.cards).toHaveLength(6);
		const sizes = features.cards.map((c) => c.size);
		for (let i = 0; i < sizes.length; i += 2)
			expect(sizes[i] + sizes[i + 1]).toBe(12);
	});

	it("flags exactly the leak days far above the baseline", () => {
		expect(leak.values).toHaveLength(14);
		const high = leak.values
			.map((v, i) => (v > leak.baseline * 1.4 ? i + 1 : 0))
			.filter(Boolean);
		expect(high).toEqual(leak.flagged);
	});

	it("bills 54 units", () => {
		const units = billingRun.properties.reduce((s, p) => s + p.units, 0);
		expect(billingRun.toast).toContain(String(units));
	});

	it("has seven recommendations, each kind explained", () => {
		expect(recommendations.rows).toHaveLength(7);
		expect(new Set(recommendations.rows.map((r) => r.photo)).size).toBe(7);
		for (const kind of RECOMMENDATION_KINDS) {
			expect(recommendations.info[kind].steps).toHaveLength(3);
			expect(recommendations.filters[kind]).toBeTruthy();
		}
	});

	it("has three question rows of four", () => {
		expect(questions.rows).toHaveLength(3);
		for (const row of questions.rows) expect(row.items).toHaveLength(4);
	});

	it("uses existing quotes, the Werne one with its emphasis", () => {
		const keys = new Set(all.map((t) => t.key));
		for (const key of testimonials.keys) expect(keys).toContain(key);
		expect(testimonial(quote.testimonial).quote).toContain(quote.emphasis);
	});
});
