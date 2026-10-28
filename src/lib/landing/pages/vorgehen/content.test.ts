import { describe, expect, it } from "vitest";
import { testimonials } from "$lib/landing/data/testimonials";
import * as routes from "$lib/routes";
import * as content from "./content";
import { ICON_NAMES } from "./icons";

const { comparison, faq, features, journey, KPI, quotes, split, stats, steps } =
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

describe("vorgehen content", () => {
	it("has no empty strings or XX placeholders", () => {
		for (const s of strings(content)) {
			expect(s.trim()).not.toBe("");
			expect(s).not.toMatch(/\bXX\b/);
		}
	});

	it("has three steps, the first two with chips, and an interval each", () => {
		expect(steps.items).toHaveLength(3);
		expect(steps.intervalMs).toHaveLength(3);
		for (const step of steps.items.slice(0, 2)) {
			expect(step.chip?.title).toBeTruthy();
			expect(step.chip?.sub).toBeTruthy();
		}
		// Step 3 shows the dashboard demo instead of a photo.
		expect(steps.items[2].chip).toBeUndefined();
	});

	it("has eleven stations in three phases, linked only to known routes", () => {
		expect(journey.stations).toHaveLength(11);
		expect(journey.phases.reduce((n, p) => n + p.count, 0)).toBe(11);
		let i = 0;
		for (const phase of journey.phases)
			for (let k = 0; k < phase.count; k++)
				expect(journey.stations[i++].phase).toBe(phase.name);
		for (const s of journey.stations)
			if (s.link?.href !== undefined)
				expect(routeValues).toContain(s.link.href);
	});

	it("splits the work into three steps and eight tasks", () => {
		expect(split.you.steps).toHaveLength(3);
		expect(split.heidi.tasks).toHaveLength(8);
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
		expect(journey.stations[4].text).toContain(KPI.notice);
		expect(journey.stations[4].text).toContain(KPI.window);
		expect(journey.stations[5].text).toContain(KPI.firstVisit);
		const answers = faq.items.map((i) => i.answer).join(" ");
		for (const kpi of Object.values(KPI)) expect(answers).toContain(kpi);
	});
});
