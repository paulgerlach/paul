import { describe, expect, it } from "vitest";
import {
	addMonths,
	addYears,
	billing,
	calibration,
	contract,
	day,
	daysBadge,
	daysBetween,
	defaults,
	formatDate,
	milestoneBadge,
	parseIso,
	timelineAnchor,
	todayOf,
	toIso,
} from "./fristen";

/** 19.10.2026, the day the design was compared. */
const TODAY = day(2026, 9, 19);
const f = formatDate;

describe("calendar days", () => {
	it("reads the Berlin date of an instant", () => {
		// 23:30 UTC on 18 October is already the 19th in Berlin (CEST).
		expect(todayOf(Date.UTC(2026, 9, 18, 22, 30))).toBe(TODAY);
		expect(todayOf(Date.UTC(2026, 9, 18, 21, 30))).toBe(day(2026, 9, 18));
	});

	it("parses and prints input values", () => {
		expect(parseIso("2018-01-01")).toBe(day(2018, 0, 1));
		expect(toIso(day(2018, 0, 1))).toBe("2018-01-01");
		expect(parseIso("")).toBeNull();
		expect(parseIso("2018-02-31")).toBeNull();
		expect(parseIso(undefined)).toBeNull();
		expect(f(day(2027, 8, 30))).toBe("30.09.2027");
	});

	it("clamps the day to the target month", () => {
		expect(f(addMonths(day(2026, 0, 31), 1))).toBe("28.02.2026");
		expect(f(addYears(day(2024, 1, 29), 1))).toBe("28.02.2025");
		expect(f(addMonths(day(2028, 11, 31), -3))).toBe("30.09.2028");
	});

	it("counts days across a DST change", () => {
		expect(daysBetween(day(2026, 2, 28), day(2026, 2, 30))).toBe(2);
		expect(daysBetween(TODAY, day(2026, 11, 31))).toBe(73);
	});

	it("derives the design's defaults from today", () => {
		expect(defaults(TODAY)).toEqual({
			contractStart: "2018-01-01",
			calibrationYear: 2022,
			periodEnd: "2025-12-31",
		});
	});
});

describe("contract", () => {
	const input = { start: day(2018, 0, 1), term: 10, renewal: 1, notice: 3 };

	it("gives the design's example", () => {
		const r = contract(input, TODAY);
		expect(f(r.cancelBy)).toBe("30.09.2027");
		expect(f(r.end)).toBe("31.12.2027");
		expect(r.days).toBe(346);
		expect(r.progress).toBeCloseTo(346 / 438);
	});

	it("renews while the cancel day has passed", () => {
		// The first end 31.12.2026 needed a cancellation by 30.09.2026.
		const r = contract({ ...input, start: day(2017, 0, 1), term: 10 }, TODAY);
		expect(f(r.end)).toBe("31.12.2027");
		expect(f(r.cancelBy)).toBe("30.09.2027");
		const two = contract(
			{ start: day(2017, 0, 1), term: 10, renewal: 2, notice: 6 },
			TODAY,
		);
		expect(f(two.end)).toBe("31.12.2028");
		expect(f(two.cancelBy)).toBe("30.06.2028");
	});

	it("keeps today's cancel day", () => {
		const r = contract(
			{ start: day(2017, 0, 20), term: 10, renewal: 1, notice: 3 },
			TODAY,
		);
		expect(f(r.cancelBy)).toBe("19.10.2026");
		expect(r.days).toBe(0);
		expect(r.progress).toBe(0);
	});

	it("stops after 60 renewals", () => {
		const r = contract(
			{ start: day(1800, 0, 1), term: 1, renewal: 1, notice: 1 },
			TODAY,
		);
		expect(new Date(r.end).getUTCFullYear()).toBe(1860);
		expect(r.days).toBeLessThan(0);
		expect(r.progress).toBe(0);
	});
});

describe("calibration and billing", () => {
	it("ends with the calendar year", () => {
		const r = calibration(2022, 6);
		expect(r && f(r.end)).toBe("31.12.2028");
		expect(r && f(r.plan)).toBe("30.09.2028");
		expect(calibration(2022, 5)?.end).toBe(day(2027, 11, 31));
	});

	it("ignores years the design ignores", () => {
		expect(calibration(null, 6)).toBeNull();
		expect(calibration(0, 6)).toBeNull();
		expect(calibration(1899, 6)).toBeNull();
	});

	it("gives the billing deadline and the objections", () => {
		const r = billing(day(2025, 11, 31), null);
		expect(f(r.deadline)).toBe("31.12.2026");
		expect(r.objections).toBeNull();
		expect(billing(day(2025, 11, 31), day(2026, 2, 15)).objections).toBe(
			day(2027, 2, 15),
		);
	});
});

describe("badges", () => {
	it("says how many days are left", () => {
		expect(daysBadge(346, 60)).toEqual({
			text: "noch 346\u00a0Tage",
			tone: "ok",
		});
		expect(daysBadge(1234, 60).text).toBe("noch 1.234\u00a0Tage");
		expect(daysBadge(59, 60).tone).toBe("warn");
		expect(daysBadge(60, 60).tone).toBe("ok");
		expect(daysBadge(1, 60).text).toBe("noch 1\u00a0Tag");
		expect(daysBadge(0, 60)).toEqual({ text: "heute", tone: "warn" });
		expect(daysBadge(-1, 60)).toEqual({
			text: "seit 1\u00a0Tag vorbei",
			tone: "late",
		});
		expect(daysBadge(-3, 60).text).toBe("seit 3\u00a0Tagen vorbei");
	});

	it("marks milestones as in force", () => {
		expect(milestoneBadge(day(2023, 0, 1), TODAY)).toBe("gilt");
		expect(milestoneBadge(day(2026, 11, 31), TODAY)).toBe("in 73\u00a0Tagen");
		expect(milestoneBadge(day(2026, 9, 20), TODAY)).toBe("in 1\u00a0Tag");
		expect(milestoneBadge(TODAY, TODAY)).toBe("heute");
	});

	it("shifts the timeline label near the ends", () => {
		expect(timelineAnchor(0.1)).toBe(12);
		expect(timelineAnchor(0.5)).toBe(50);
		expect(timelineAnchor(0.79)).toBe(50);
		expect(timelineAnchor(0.9)).toBe(88);
	});
});
