import { describe, expect, it } from "vitest";
import {
	formatDecimal,
	formatNumber,
} from "$lib/landing/pages/upgrade-now/calculator";
import { doppelpflege, roundCost } from "./doppelpflege";

describe("doppelpflege", () => {
	it("gives the design's result for its defaults", () => {
		const r = doppelpflege({ l: 40, u: 4, m: 20, s: 45 });
		expect(formatNumber(r.hours)).toBe("53");
		expect(formatDecimal(r.days, 1)).toBe("6,7");
		expect(formatNumber(r.cost)).toBe("2.400");
		expect(r.lit).toBe(7);
	});

	it("handles the minimum", () => {
		const r = doppelpflege({ l: 1, u: 1, m: 5, s: 20 });
		expect(formatNumber(r.hours)).toBe("0");
		expect(r.lit).toBe(0);
		expect(r.cost).toBe(0);
	});

	it("caps the day grid at the maximum", () => {
		const r = doppelpflege({ l: 300, u: 24, m: 90, s: 120 });
		expect(r.hours).toBe(10_800);
		expect(r.days).toBe(1_350);
		expect(r.cost).toBe(1_296_000);
		expect(r.lit).toBe(60);
		expect(formatNumber(r.hours)).toBe("10.800");
		expect(formatDecimal(r.days, 1)).toBe("1.350,0");
	});

	it("rounds the cost to 10 €", () => {
		expect(roundCost(2405)).toBe(2410);
		expect(roundCost(2404.9)).toBe(2400);
	});
});
