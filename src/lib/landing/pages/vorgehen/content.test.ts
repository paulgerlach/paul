import { describe, expect, it } from "vitest";
import { testimonials } from "$lib/landing/data/testimonials";
import * as routes from "$lib/routes";
import * as content from "./content";
import { ICON_NAMES } from "./icons";

const { comparison, faq, features, KPI, quotes, stats, steps } = content;

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

describe("vorgehen content", () => {
	it("has no empty strings or XX placeholders", () => {
		for (const s of strings(content)) {
			expect(s.trim()).not.toBe("");
			expect(s).not.toMatch(/\bXX\b/);
		}
	});

	it("has three steps with chips", () => {
		expect(steps.items).toHaveLength(3);
		for (const step of steps.items) {
			expect(step.chip.title).toBeTruthy();
			expect(step.chip.sub).toBeTruthy();
		}
	});

	it("links the features only to known routes", () => {
		expect(features.items).toHaveLength(6);
		for (const f of features.items) {
			expect(ICON_NAMES).toContain(f.icon);
			if (f.href !== undefined) expect(routeValues).toContain(f.href);
		}
	});

	it("fills every comparison cell", () => {
		for (const row of comparison.rows) {
			expect(row.heidi).not.toBe("");
			expect(row.classic).not.toBe("");
		}
	});

	it("uses existing quotes", () => {
		const keys = testimonials.map((t) => t.key);
		for (const key of quotes.keys) expect(keys).toContain(key);
	});

	it("has five FAQ entries", () => {
		expect(faq.items).toHaveLength(5);
	});

	it("states the confirmed KPIs the same way everywhere", () => {
		expect(stats[0].figure).toBe(KPI.firstVisit);
		expect(stats[1].figure).toBe(KPI.notice);
		expect(steps.items[1].text).toContain(KPI.firstVisit);
		expect(steps.items[1].text).toContain(KPI.notice);
		expect(steps.items[1].text).toContain(KPI.window);
		const answers = faq.items.map((i) => i.answer).join(" ");
		for (const kpi of Object.values(KPI)) expect(answers).toContain(kpi);
	});
});
