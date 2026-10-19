import { describe, expect, it } from "vitest";
import { costs, euro, formatDe, parseField } from "./cost";

const start = { we: 120, hkv: 5, wz: 2, phkv: 8, pwz: 12, pabr: 25 };

describe("the calculator", () => {
	it("reads fields as the design does", () => {
		expect(parseField("8")).toBe(8);
		expect(parseField("12,5")).toBe(12.5);
		expect(parseField("8.5")).toBe(8.5);
		expect(parseField("")).toBe(0);
		expect(parseField("abc")).toBe(0);
		expect(parseField("-3")).toBe(0);
		expect(parseField("1e3")).toBe(1000);
	});

	it("computes the design's start values", () => {
		const c = costs(start);
		expect([c.allocators, c.water, c.billing]).toEqual([40, 24, 25]);
		expect(c.perFlat).toBe(89);
		expect(c.perYear).toBe(10680);
		expect(c.sixYears).toBe(64080);
		expect(c.shares.map((s) => Math.round(s * 10) / 10)).toEqual([
			44.9, 27, 28.1,
		]);
	});

	it("handles a decimal rent, zero flats and zero cost", () => {
		expect(costs({ ...start, phkv: parseField("8,5") }).perFlat).toBe(91.5);
		expect(costs({ ...start, we: 0 }).perYear).toBe(0);
		const zero = costs({ we: 10, hkv: 0, wz: 0, phkv: 8, pwz: 12, pabr: 0 });
		expect(zero.perFlat).toBe(0);
		expect(zero.shares).toEqual([0, 0, 0]);
	});

	it("formats like the design", () => {
		expect(formatDe(89, 2)).toBe("89,00");
		expect(formatDe(10680)).toBe("10.680");
		expect(formatDe(91.456, 2)).toBe("91,46");
		expect(euro(64080)).toBe("64.080 €");
		expect(euro(40, 2)).toBe("40,00 €");
	});
});
