import { describe, expect, it } from "vitest";
import {
	budgetSeries,
	budgetShare,
	budgetSoFar,
	ganttColumnPhase,
	ganttColumns,
	ganttRows,
	initials,
	isRiskHigh,
	riskAverage,
	riskLabels,
	riskProperties,
	RISK_MAX,
} from "./data";

describe("gantt data", () => {
	it("has a phase for every column", () => {
		expect(ganttColumnPhase).toHaveLength(ganttColumns.length);
	});

	it("keeps every bar within W1–laufend", () => {
		for (const row of ganttRows) {
			expect(row.from).toBeGreaterThanOrEqual(1);
			expect(row.to).toBeLessThanOrEqual(ganttColumns.length);
			expect(row.from).toBeLessThanOrEqual(row.to);
		}
	});
});

describe("budget data", () => {
	it("has 12 months per series", () => {
		for (const series of Object.values(budgetSeries))
			expect(series.values).toHaveLength(12);
	});

	it("sums the actual months and the share of the year", () => {
		const values = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0, 0];
		expect(budgetSoFar(values)).toBe(90);
		expect(budgetShare(values)).toBe(90);
	});
});

describe("risk data", () => {
	it("computes the rounded average", () => {
		expect(riskAverage).toBe(119); // (168 + 121 + 104 + 84) / 4 = 119.25
	});

	it("highlights only values more than 15 % above the average", () => {
		expect(riskProperties.filter((p) => isRiskHigh(p.value))).toHaveLength(1);
		expect(isRiskHigh(riskProperties[0].value)).toBe(true);
	});

	it("fits every bar into the chart and has a label for it", () => {
		expect(riskLabels).toHaveLength(riskProperties.length);
		for (const p of riskProperties)
			expect(p.value).toBeLessThanOrEqual(RISK_MAX);
	});
});

describe("initials", () => {
	it("takes up to two capitals", () => {
		expect(initials("M. Krüger")).toBe("MK");
		expect(initials("Familie Hoffmann")).toBe("FH");
		expect(initials("Hofstraße 21")).toBe("H");
	});
});
