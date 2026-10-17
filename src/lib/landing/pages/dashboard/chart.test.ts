import { describe, expect, it } from "vitest";
import {
	areaPath,
	expand,
	formatNumber,
	niceScale,
	slotX,
	smoothPath,
	stepCurve,
	toPoints,
} from "./chart";

describe("niceScale", () => {
	it("rounds up to a nice step", () => {
		expect(niceScale(284 * 1.08)).toEqual({
			max: 400,
			step: 100,
			ticks: [0, 100, 200, 300, 400],
		});
		expect(niceScale(110)).toMatchObject({ max: 125, step: 25 });
		expect(niceScale(2.6)).toMatchObject({ max: 3, step: 0.5 });
	});

	it("ends the ticks at the maximum", () => {
		for (const max of [0.7, 13.9, 99, 104_000]) {
			const scale = niceScale(max);
			expect(scale.ticks.at(-1)).toBe(scale.max);
			expect(scale.max).toBeGreaterThanOrEqual(max);
		}
	});

	it("survives 0", () => {
		expect(niceScale(0).max).toBeGreaterThan(0);
	});
});

describe("paths", () => {
	it("draws two points as one curve", () => {
		expect(
			smoothPath([
				[0, 100],
				[100, 0],
			]),
		).toBe("M0 100 C16.67 83.33 83.33 16.67 100 0");
	});

	it("draws one segment per pair of points", () => {
		const d = smoothPath(toPoints([1, 2, 3, 4, 5], 5));
		expect(d.match(/C/g)).toHaveLength(4);
	});

	it("closes the area to the baseline", () => {
		const points = toPoints([1, 2], 2);
		expect(areaPath(points)).toBe(`${smoothPath(points)} L75 100 L25 100 Z`);
	});

	it("centres points in their slots", () => {
		expect(slotX(0, 4)).toBe(12.5);
		expect(toPoints([0, 10], 10)).toEqual([
			[25, 100],
			[75, 0],
		]);
	});

	it("spreads the closing curve over the width", () => {
		expect(stepCurve([10, 20], 100)).toBe(
			"M0 10.0 C50.0 10.0 50.0 20.0 100.0 20.0",
		);
	});
});

describe("expand", () => {
	it("keeps monthly values", () => {
		expect(expand([1, 2], "m", 3)).toEqual([1, 2]);
	});

	it("makes 4 weeks or 7 days per month", () => {
		expect(expand([10, 20, 30], "w", 4)).toHaveLength(12);
		expect(expand([10, 20, 30], "d", 4)).toHaveLength(21);
	});

	it("keeps roughly the month's total", () => {
		const weeks = expand([100, 100], "w", 1);
		const first = weeks.slice(0, 4).reduce((a, b) => a + b, 0);
		expect(first).toBeGreaterThan(80);
		expect(first).toBeLessThan(120);
	});
});

describe("formatNumber", () => {
	it("formats as the design", () => {
		expect(formatNumber(0)).toBe("0");
		expect(formatNumber(1234.4)).toBe("1.234");
		expect(formatNumber(12.4)).toBe("12");
		expect(formatNumber(1.54)).toBe("1,5");
	});
});
