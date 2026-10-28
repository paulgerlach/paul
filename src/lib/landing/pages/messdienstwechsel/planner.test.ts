import { describe, expect, it } from "vitest";
import { day } from "$lib/landing/pages/fristenrechner/fristen";
import { monthYear, plan, yearOptions } from "./planner";

const TODAY = day(2026, 9, 27); // 27.10.2026

describe("plan", () => {
	it("gives the design's start: December two years on, three months' notice", () => {
		const p = plan({ month: 11, year: 2028, notice: 3 }, TODAY);
		expect(p.late).toBe(false);
		expect(p.by).toBe("30.09.2028");
		expect(p.mount).toBe("Dezember 2028");
		expect(p.daysLeft).toBe(704);
	});

	it("dates the notice to the last day of the month `notice` months before the end", () => {
		expect(plan({ month: 1, year: 2028, notice: 6 }, TODAY).by).toBe(
			"31.08.2027",
		);
		expect(plan({ month: 5, year: 2028, notice: 12 }, TODAY).by).toBe(
			"30.06.2027",
		);
	});

	it("moves a missed notice and the end a year on", () => {
		const p = plan({ month: 11, year: 2026, notice: 3 }, TODAY);
		expect(p.late).toBe(true);
		expect(p.by).toBe("30.09.2027");
		expect(p.mount).toBe("Dezember 2027");
	});

	it("counts a notice due today as missed, as the design does", () => {
		const p = plan({ month: 0, year: 2027, notice: 3 }, day(2026, 9, 31));
		expect(p.late).toBe(true);
	});

	it("places today, the notice and the end on the timeline", () => {
		const { timeline } = plan({ month: 11, year: 2028, notice: 3 }, TODAY);
		// 1.1.2026 to 1.1.2030
		const span = day(2030, 0, 1) - day(2026, 0, 1);
		expect(timeline.now).toBeCloseTo(((TODAY - day(2026, 0, 1)) / span) * 100);
		expect(timeline.end).toBeCloseTo(
			((day(2028, 11, 31) - day(2026, 0, 1)) / span) * 100,
		);
		expect(timeline.by).toBeLessThan(timeline.end);
	});

	it("runs the timeline to 1 January two years after a late end", () => {
		const { timeline } = plan({ month: 11, year: 2032, notice: 3 }, TODAY);
		const span = day(2034, 0, 1) - day(2026, 0, 1);
		expect(timeline.end).toBeCloseTo(
			((day(2032, 11, 31) - day(2026, 0, 1)) / span) * 100,
		);
	});
});

describe("yearOptions", () => {
	it("offers this year and the next six", () => {
		expect(yearOptions(TODAY, 7)).toEqual([
			2026, 2027, 2028, 2029, 2030, 2031, 2032,
		]);
	});
});

describe("monthYear", () => {
	it("names the month in German", () => {
		expect(monthYear(day(2027, 2, 31))).toBe("März 2027");
	});
});
