import { describe, expect, it } from "vitest";
import {
	berlinDate,
	berlinMidnight,
	calendarMonths,
	DEADLINE,
	daysLeft,
	daysLeftText,
	isExpired,
	monthsText,
	remaining,
	startOfBerlinDay,
	yearProgress,
} from "./deadline";

// Berlin is UTC+2 until 25.10.2026, UTC+1 after.
const OCT_7_NOON = Date.UTC(2026, 9, 7, 10); // 7.10.2026 12:00 Berlin
const DEC_1_0030 = Date.UTC(2026, 10, 30, 23, 30); // 1.12.2026 00:30 Berlin
const DEC_31_NOON = Date.UTC(2026, 11, 31, 11); // 31.12.2026 12:00 Berlin
const DEC_31_LAST_SECOND = Date.UTC(2026, 11, 31, 22, 59, 59);
const JAN_1_MIDNIGHT = Date.UTC(2026, 11, 31, 23); // 1.1.2027 00:00 Berlin
const FEB_1_2027 = Date.UTC(2027, 1, 1, 9);

describe("Berlin dates", () => {
	it("is 1.1.2027 00:00 Berlin at the deadline", () => {
		expect(DEADLINE).toBe(JAN_1_MIDNIGHT);
		expect(berlinMidnight(2027, 0, 1)).toBe(DEADLINE);
	});

	it("takes the date from Berlin, not UTC", () => {
		// 30.11. 23:30 UTC is already the 1st of December in Berlin
		expect(berlinDate(DEC_1_0030)).toEqual({ year: 2026, month: 11, day: 1 });
	});

	it("handles both summer and winter time", () => {
		expect(berlinMidnight(2026, 9, 7)).toBe(Date.UTC(2026, 9, 6, 22));
		expect(berlinMidnight(2026, 11, 1)).toBe(Date.UTC(2026, 10, 30, 23));
		expect(startOfBerlinDay(DEC_1_0030)).toBe(Date.UTC(2026, 10, 30, 23));
	});
});

describe("7.10.2026", () => {
	it("counts down", () => {
		expect(remaining(OCT_7_NOON)).toEqual({
			// 85 days and 12 h, plus the hour gained when summer time ends
			days: 85,
			hours: 13,
			minutes: 0,
			seconds: 0,
			expired: false,
		});
	});

	it("has the texts of the design", () => {
		expect(daysLeft(OCT_7_NOON)).toBe(85);
		expect(daysLeftText(OCT_7_NOON)).toBe("Noch 85 Tage");
		expect(monthsText(OCT_7_NOON)).toBe("knapp drei Monate");
	});

	it("fills the year band", () => {
		const y = yearProgress(OCT_7_NOON);
		expect(y.months.map((m) => m.state)).toEqual([
			...Array(9).fill("past"),
			"cur",
			"left",
			"left",
		]);
		expect(y.months[9].fill).toBeCloseTo(6.5 / 31, 2);
		expect(y.percent).toBe(77);
		expect(y.progressText).toBe("2026 ist zu 77\u00a0% vorbei");
		expect(y.windowText).toBe(
			"Oktober, November und Dezember: Ihr letztes Zeitfenster",
		);
	});

	it("builds the calendar from October", () => {
		const c = calendarMonths(OCT_7_NOON);
		expect(c.months.map((m) => m.name)).toEqual([
			"Oktober",
			"November",
			"Dezember",
		]);
		// Counted by hand: Oct 7–30 = 18, Nov = 21, Dec without 25.12. = 22
		expect(c.months.map((m) => m.workdays)).toEqual([18, 21, 22]);
		expect(c.workdays).toBe(61);
		expect(c.holidays).toBe(2);
		expect(c.weeks).toBe(12);

		const [oct] = c.months;
		expect(oct.offset).toBe(3); // 1.10.2026 is a Thursday
		const today = oct.days.filter((d) => d.today);
		expect(today.map((d) => d.day)).toEqual([7]);
		expect(today[0].title).toBe("Heute");
		expect(today[0].label).toBe("7. Oktober 2026, Heute");
		expect(oct.days[2].holiday).toBe("Tag der Deutschen Einheit");
		expect(oct.days[2].past).toBe(true);

		const dec31 = c.months[2].days[30];
		expect(dec31.deadline).toBe(true);
		expect(dec31.title).toBe("Frist: 31.12.2026");
	});
});

describe("around midnight in winter", () => {
	it("is already December in Berlin at 30.11. 23:30 UTC", () => {
		const c = calendarMonths(DEC_1_0030);
		expect(c.months.map((m) => m.name)).toEqual(["Dezember"]);
		expect(c.months[0].days[0].today).toBe(true);
		expect(daysLeft(DEC_1_0030)).toBe(30);
		expect(monthsText(DEC_1_0030)).toBe("30 Tage");
		expect(yearProgress(DEC_1_0030).windowText).toBe(
			"Nur noch der Dezember bis zur Frist",
		);
	});
});

describe("the last day", () => {
	it("says 'heute', not 'abgelaufen'", () => {
		for (const now of [DEC_31_NOON, DEC_31_LAST_SECOND]) {
			expect(isExpired(now)).toBe(false);
			expect(daysLeft(now)).toBe(0);
			expect(daysLeftText(now)).toBe("Letzter Tag");
			expect(monthsText(now)).toBe("heute");
		}
		expect(remaining(DEC_31_LAST_SECOND)).toMatchObject({
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 1,
		});
		const c = calendarMonths(DEC_31_NOON);
		expect(c.workdays).toBe(1);
		expect(c.weeks).toBe(0);
	});
});

describe("after the deadline", () => {
	for (const now of [JAN_1_MIDNIGHT, FEB_1_2027]) {
		it(`is expired at ${new Date(now).toISOString()}`, () => {
			expect(isExpired(now)).toBe(true);
			expect(remaining(now)).toEqual({
				days: 0,
				hours: 0,
				minutes: 0,
				seconds: 0,
				expired: true,
			});
			expect(daysLeftText(now)).toBe("Frist abgelaufen");
			expect(monthsText(now)).toBe("");
			expect(yearProgress(now).windowText).toBe("Die Frist ist abgelaufen");
			expect(yearProgress(now).months.every((m) => m.state === "past")).toBe(
				true,
			);
		});
	}
});

describe("monthsText", () => {
	const at = (days: number) => DEADLINE - days * 86_400_000 - 3_600_000;
	it.each([
		[400, "zwölf Monate"],
		[355, "zwölf Monate"],
		[350, "gut elf Monate"],
		[340, "elf Monate"],
		[62, "zwei Monate"],
		[50, "knapp zwei Monate"],
		[48, "gut einen Monat"],
		[45, "45 Tage"],
		[1, "1 Tag"],
	])("%i days → %s", (days, text) => {
		expect(monthsText(at(days))).toBe(text);
	});
});
