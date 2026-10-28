import { describe, expect, it } from "vitest";
import {
	amountLabel,
	formatAmount,
	isAmount,
	isDate,
	parseAmount,
} from "./docuscan";

describe("parseAmount", () => {
	it("reads German and plain notation", () => {
		expect(parseAmount("4.371,89")).toBe(4371.89);
		expect(parseAmount("312,40 €")).toBe(312.4);
		expect(parseAmount("4371.89")).toBe(4371.89);
		expect(parseAmount("1.234")).toBe(1234);
		expect(parseAmount("1.234.567")).toBe(1234567);
	});
	it("is NaN for nothing readable", () => {
		expect(parseAmount("")).toBeNaN();
		expect(parseAmount(" € ")).toBeNaN();
		expect(parseAmount("abc")).toBeNaN();
	});
});

describe("formatAmount and amountLabel", () => {
	it("writes German amounts", () => {
		expect(formatAmount(4684.29)).toBe("4.684,29");
		expect(formatAmount(12)).toBe("12,00");
		expect(amountLabel("4371,89")).toBe("4.371,89 €");
		expect(amountLabel("x")).toBe("– €");
	});
});

describe("isAmount", () => {
	it("needs a positive amount", () => {
		expect(isAmount("312,40")).toBe(true);
		expect(isAmount("0")).toBe(false);
		expect(isAmount("-5")).toBe(false);
		expect(isAmount("")).toBe(false);
	});
});

describe("isDate", () => {
	it("accepts real dates as tt.mm.jjjj", () => {
		expect(isDate("12.12.2026")).toBe(true);
		expect(isDate(" 1.2.2026 ")).toBe(true);
		expect(isDate("29.02.2028")).toBe(true);
	});
	it("rejects impossible or malformed dates", () => {
		expect(isDate("31.04.2026")).toBe(false);
		expect(isDate("29.02.2026")).toBe(false);
		expect(isDate("2026-12-12")).toBe(false);
		expect(isDate("")).toBe(false);
	});
});
