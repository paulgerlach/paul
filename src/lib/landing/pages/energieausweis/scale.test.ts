import { describe, expect, it } from "vitest";
import { formatKwh, markerLeft, scaleClass } from "./scale";

describe("scaleClass", () => {
	it("follows the design's limits", () => {
		expect(scaleClass(0)).toBe(0);
		expect(scaleClass(29)).toBe(0);
		expect(scaleClass(30)).toBe(1);
		expect(scaleClass(118)).toBe(4);
		expect(scaleClass(142)).toBe(5);
		expect(scaleClass(249)).toBe(7);
		expect(scaleClass(250)).toBe(8);
		expect(scaleClass(1000)).toBe(8);
	});
});

describe("markerLeft", () => {
	it("places the examples as the design", () => {
		expect(markerLeft(118)).toBeCloseTo(51.11, 2);
		expect(markerLeft(142)).toBeCloseTo(60, 6);
	});

	it("stays on the bar", () => {
		expect(markerLeft(0)).toBe(0);
		expect(markerLeft(275)).toBeCloseTo((8.5 / 9) * 100, 6);
		expect(markerLeft(400)).toBe(100);
	});
});

describe("formatKwh", () => {
	it("writes German integers", () => {
		expect(formatKwh(118)).toBe("118");
		expect(formatKwh(117.6)).toBe("118");
		expect(formatKwh(1234)).toBe("1.234");
	});
});
