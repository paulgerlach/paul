import { describe, expect, it } from "vitest";
import { BASE, METERS, OBJECTS, PERIODS, PREV, rnd, TOTAL_UNITS } from "./data";

describe("dashboard preview data", () => {
	it("adds the objects up to 370 units", () => {
		expect(OBJECTS.reduce((s, o) => s + o.units, 0)).toBe(TOTAL_UNITS);
	});

	it("generates unique meter ids", () => {
		const ids = METERS.map((m) => m.id);
		expect(new Set(ids).size).toBe(ids.length);
		// up to eight units × 4 meters, plus one WMZ per object
		expect(METERS).toHaveLength(7 * (8 * 4 + 1));
	});

	it("has a deterministic PRNG in [0, 1)", () => {
		const a = [1, 2, 3.5, 700].map(rnd);
		expect([1, 2, 3.5, 700].map(rnd)).toEqual(a);
		for (const v of a) {
			expect(v).toBeGreaterThanOrEqual(0);
			expect(v).toBeLessThan(1);
		}
		expect(new Set(a).size).toBe(4);
	});

	it("has twelve months per series and three periods", () => {
		for (const values of [...Object.values(BASE), ...Object.values(PREV)])
			expect(values).toHaveLength(12);
		expect(PERIODS.map((p) => p.months[1] - p.months[0])).toEqual([10, 3, 12]);
	});
});
