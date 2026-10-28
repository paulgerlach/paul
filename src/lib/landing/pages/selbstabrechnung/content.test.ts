import { describe, expect, it } from "vitest";
import * as content from "./content";
import {
	allMeters,
	calculator,
	demo,
	faq,
	taskSplit,
	tasks,
	type TaskKey,
} from "./content";

/** Every string in a value, deeply. */
function strings(value: unknown): string[] {
	if (typeof value === "string") return [value];
	if (Array.isArray(value)) return value.flatMap(strings);
	if (value && typeof value === "object")
		return Object.values(value).flatMap(strings);
	return [];
}

describe("content", () => {
	it("has no empty strings or placeholders", () => {
		for (const s of strings(content)) {
			expect(s.trim()).not.toBe("");
			expect(s).not.toMatch(/\bXX\b/);
		}
	});

	it("puts every task in exactly one column per mode", () => {
		const keys = Object.keys(tasks) as TaskKey[];
		for (const mode of Object.values(taskSplit.modes)) {
			const all = [...mode.heidi, ...mode.you];
			expect(new Set(all).size).toBe(all.length);
			expect([...all].sort()).toEqual([...keys].sort());
		}
	});

	it("keeps the hero demo consistent", () => {
		expect(demo.results).toHaveLength(demo.building.flats);
		expect(demo.subline).toContain(`${demo.building.meters} Zähler`);
		expect(allMeters.big.status).toBe(
			`${demo.building.meters} von ${demo.building.meters} ausgelesen`,
		);
	});

	it("builds the calculator's head from its flats", () => {
		const area = calculator.flats.reduce((s, f) => s + f.area, 0);
		expect(area).toBe(450);
		expect(calculator.tableTitle).toBe("Beispielhaus · 6 Wohnungen · 450 m²");
	});

	it("has slider defaults on their steps", () => {
		for (const r of [calculator.costs, calculator.share]) {
			expect((r.default - r.min) % r.step).toBe(0);
			expect(r.default).toBeGreaterThanOrEqual(r.min);
			expect(r.default).toBeLessThanOrEqual(r.max);
		}
	});

	it("has the five FAQ questions", () => {
		expect(faq.items).toHaveLength(5);
	});

	it("counts tasks in German", () => {
		expect(content.tasksText(1)).toBe("1 Aufgabe");
		expect(content.tasksText(5)).toBe("5 Aufgaben");
	});
});
