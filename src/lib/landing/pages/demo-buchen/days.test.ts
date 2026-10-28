import { describe, expect, it } from "vitest";
import { nextWeekdays } from "./days";

const keys = (now: number) => nextWeekdays(now).map((d) => d.iso);

describe("nextWeekdays", () => {
	it("starts tomorrow and skips the weekend", () => {
		// Wednesday, 21.10.2026, noon in Berlin.
		expect(keys(Date.UTC(2026, 9, 21, 10))).toEqual([
			"2026-10-22",
			"2026-10-23",
			"2026-10-26",
			"2026-10-27",
			"2026-10-28",
		]);
	});

	it("from a Friday or a weekend begins on Monday", () => {
		const monday = "2026-10-26";
		expect(keys(Date.UTC(2026, 9, 23, 10))[0]).toBe(monday);
		expect(keys(Date.UTC(2026, 9, 24, 10))[0]).toBe(monday);
		expect(keys(Date.UTC(2026, 9, 25, 10))[0]).toBe(monday);
	});

	it("counts from the Berlin date, not UTC", () => {
		// 22:30 UTC on Thursday 22.10. is already Friday in Berlin (CEST).
		expect(keys(Date.UTC(2026, 9, 22, 22, 30))[0]).toBe("2026-10-26");
		expect(keys(Date.UTC(2026, 9, 22, 21, 30))[0]).toBe("2026-10-23");
	});

	it("crosses months and years", () => {
		const days = nextWeekdays(Date.UTC(2026, 11, 30, 10));
		expect(days.map((d) => d.iso)).toEqual([
			"2026-12-31",
			"2027-01-01",
			"2027-01-04",
			"2027-01-05",
			"2027-01-06",
		]);
		expect(days[1]).toEqual({
			iso: "2027-01-01",
			weekday: "Fr",
			day: 1,
			month: "1.",
		});
	});
});
