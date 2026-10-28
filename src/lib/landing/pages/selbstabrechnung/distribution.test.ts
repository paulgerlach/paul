import { describe, expect, it } from "vitest";
import { calculator } from "./content";
import { clampStep, distribute } from "./distribution";

const run = (costs: number, sharePercent: number) =>
	distribute({ costs, sharePercent, flats: calculator.flats });

describe("distribute", () => {
	it("gives the design's split at the defaults", () => {
		const d = run(24000, 70);
		expect(d.base).toBeCloseTo(7200);
		expect(d.consumption).toBeCloseTo(16800);
		expect(d.perM2).toBeCloseTo(16);
		// The design's static markup says 2,80; its own data gives 2,40.
		expect(d.perUnit).toBeCloseTo(2.4);
		expect(d.totalArea).toBe(450);
		expect(d.totalUnits).toBe(7000);
	});

	it("splits evenly at 50 %", () => {
		const d = run(24000, 50);
		expect(d.base).toBeCloseTo(12000);
		expect(d.consumption).toBeCloseTo(12000);
	});

	it("rows add up to the costs", () => {
		for (const [costs, share] of [
			[24000, 70],
			[6000, 50],
			[80000, 65],
			[12345, 55],
		]) {
			const d = run(costs, share);
			const sum = d.rows.reduce((s, r) => s + r.total, 0);
			expect(sum).toBeCloseTo(costs, 2);
			expect(d.max).toBe(Math.max(...d.rows.map((r) => r.total)));
		}
	});

	it("doesn't round", () => {
		expect(run(24100, 65).rows[0].total % 1).not.toBe(0);
	});

	it("survives empty flats", () => {
		const d = distribute({ costs: 1000, sharePercent: 70, flats: [] });
		expect(d.perM2).toBe(0);
		expect(d.max).toBe(0);
	});
});

describe("clampStep", () => {
	const { share, costs } = calculator;
	it("snaps to the step and range", () => {
		expect(clampStep(47, share)).toBe(50);
		expect(clampStep(68, share)).toBe(70);
		expect(clampStep(62, share)).toBe(60);
		expect(clampStep(99, share)).toBe(70);
		expect(clampStep(24260, costs)).toBe(24500);
		expect(clampStep(Number.NaN, costs)).toBe(6000);
	});
});
