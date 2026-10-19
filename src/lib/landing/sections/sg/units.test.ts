import { describe, expect, it } from "vitest";
import {
	formatUnits,
	isLarge,
	LARGE_FROM,
	SLIDER_MAX,
	toUnits,
	toValue,
} from "./units";

describe("sg units", () => {
	it("spans 10 to 20.000 with 1.000 in the middle", () => {
		expect(toUnits(0)).toBe(10);
		expect(toUnits(SLIDER_MAX / 2)).toBe(LARGE_FROM);
		expect(toUnits(SLIDER_MAX)).toBe(20000);
	});

	it("rounds to 100 from 1.000, to 10 from 100", () => {
		for (let v = 0; v <= SLIDER_MAX; v++) {
			const u = toUnits(v);
			if (u >= 1000) expect(u % 100).toBe(0);
			else if (u >= 100) expect(u % 10).toBe(0);
			expect(Number.isInteger(u)).toBe(true);
		}
	});

	it("never goes down as the slider goes up", () => {
		for (let v = 1; v <= SLIDER_MAX; v++)
			expect(toUnits(v)).toBeGreaterThanOrEqual(toUnits(v - 1));
	});

	it("maps the designs' starts to a slider step and back", () => {
		expect(toValue(4800)).toBe(762);
		expect(toUnits(toValue(4800))).toBe(4800);
		expect(toUnits(toValue(12000))).toBe(12000);
		expect(toValue(10)).toBe(0);
		expect(toValue(1000)).toBe(500);
		expect(toValue(20000)).toBe(SLIDER_MAX);
		expect(toValue(99999)).toBe(SLIDER_MAX);
	});

	it("shows the large offer from 1.000", () => {
		expect(isLarge(990)).toBe(false);
		expect(isLarge(1000)).toBe(true);
	});

	it("formats German thousands and the scale's end", () => {
		expect(formatUnits(4800)).toBe("4.800");
		expect(formatUnits(320)).toBe("320");
		expect(formatUnits(20000)).toBe("20.000+");
	});
});
