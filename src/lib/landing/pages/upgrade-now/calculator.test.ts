import { describe, expect, it } from "vitest";
import {
	DEFAULT_UNIT_INDEX,
	formatNumber,
	risk,
	UNIT_STOPS,
} from "./calculator";

describe("UNIT_STOPS", () => {
	it("has the design's stops", () => {
		expect(UNIT_STOPS.slice(0, 3)).toEqual([2, 3, 4]);
		expect(UNIT_STOPS).toContain(19);
		expect(UNIT_STOPS).toContain(95);
		expect(UNIT_STOPS).not.toContain(97);
		expect(UNIT_STOPS).toContain(490);
		expect(UNIT_STOPS).not.toContain(495);
		expect(UNIT_STOPS.at(-1)).toBe(2000);
		expect(UNIT_STOPS.length).toBe(18 + 16 + 40 + 31);
		expect(UNIT_STOPS[DEFAULT_UNIT_INDEX]).toBe(120);
	});
});

describe("risk", () => {
	const defaults = {
		units: 120,
		costPerUnit: 1000,
		share: 1,
		retrofitted: false,
	};

	it("is 3 % of the affected heating costs", () => {
		expect(risk(defaults)).toEqual({ base: 120_000, cut: 3600, perUnit: 30 });
	});

	it("scales with the share", () => {
		expect(risk({ ...defaults, share: 0.5 }).cut).toBe(1800);
		expect(risk({ ...defaults, share: 0.5 }).perUnit).toBe(30);
	});

	it("is zero when retrofitted", () => {
		expect(risk({ ...defaults, retrofitted: true })).toEqual({
			base: 120_000,
			cut: 0,
			perUnit: 0,
		});
	});
});

describe("formatNumber", () => {
	it("rounds and groups like de-DE", () => {
		expect(formatNumber(3600)).toBe("3.600");
		expect(formatNumber(1234567.6)).toBe("1.234.568");
		expect(formatNumber(0)).toBe("0");
	});
});
