import { describe, expect, it } from "vitest";
import { testimonials } from "$lib/landing/data/testimonials";
import { DEADLINE } from "$lib/landing/deadline/deadline";
import * as routes from "$lib/routes";
import * as content from "./content";

const { chart, dashboard, faq, faqItems, features, KPI, quote, steps } =
	content;

/** Every string in a value, deeply. */
function strings(value: unknown): string[] {
	if (typeof value === "string") return [value];
	if (Array.isArray(value)) return value.flatMap(strings);
	if (value && typeof value === "object")
		return Object.values(value).flatMap(strings);
	return [];
}

const routeValues = new Set(
	Object.values(routes).filter((v) => typeof v === "string"),
);

describe("funktionen content", () => {
	it("has no empty strings or XX placeholders", () => {
		for (const s of strings(content)) {
			expect(s.trim()).not.toBe("");
			expect(s).not.toMatch(/\bXX\b/);
		}
	});

	it("has twelve months per series and a value at the current month", () => {
		expect(chart.current).toBeGreaterThanOrEqual(0);
		expect(chart.current).toBeLessThan(12);
		for (const series of chart.series) {
			expect(series.values).toHaveLength(12);
			expect(series.values[chart.current]).toBeGreaterThan(0);
		}
	});

	it("has three dashboard tabs with usage shares in range", () => {
		expect(dashboard.tabs).toHaveLength(3);
		for (const row of dashboard.usage.rows) {
			expect(row.share).toBeGreaterThan(0);
			expect(row.share).toBeLessThanOrEqual(100);
		}
	});

	it("links the features only to known routes", () => {
		expect(features.items).toHaveLength(6);
		for (const f of features.items)
			if (f.href !== undefined) expect(routeValues).toContain(f.href);
	});

	it("has five steps and a known quote", () => {
		expect(steps.items).toHaveLength(5);
		expect(testimonials.map((t) => t.key)).toContain(quote.key);
	});

	it("swaps only the first FAQ answer at the deadline", () => {
		expect(faq.items).toHaveLength(8);
		const before = faqItems(DEADLINE - 1);
		const after = faqItems(DEADLINE);
		expect(before.map((i) => i.answer)).toEqual(faq.items.map((i) => i.answer));
		expect(after[0].answer).not.toBe(before[0].answer);
		expect(after.slice(1)).toEqual(before.slice(1));
	});

	it("uses the confirmed KPIs", () => {
		const install = faq.items[3].answer;
		for (const kpi of Object.values(KPI)) expect(install).toContain(kpi);
		expect(steps.items[1].text).toContain(KPI.notice);
	});
});
