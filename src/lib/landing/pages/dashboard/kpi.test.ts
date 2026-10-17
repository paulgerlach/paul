import { describe, expect, it } from "vitest";
import { co2, costs, MONTHS_LONG, MONTHS_SHORT } from "./kpi";

describe("kpi", () => {
	it("sums the costs to the card's totals", () => {
		expect(costs.heat).toHaveLength(12);
		expect(costs.heatTotal).toBeCloseTo(6.72, 6);
		expect(costs.allTotal).toBeCloseTo(12.48, 6);
	});

	it("gives March as the check in plan §4.1", () => {
		expect(costs.all[2].toFixed(2)).toBe("1.47");
	});

	it("accumulates the CO₂ to 11,3 t over nine months", () => {
		expect(co2.monthly).toHaveLength(9);
		expect(co2.cumulative).toHaveLength(9);
		expect(co2.total).toBe(11.3);
	});

	it("names twelve months", () => {
		expect(MONTHS_SHORT).toHaveLength(12);
		expect(MONTHS_LONG).toHaveLength(12);
	});
});
