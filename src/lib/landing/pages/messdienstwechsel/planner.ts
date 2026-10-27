/**
 * The switch planner's math (the design's `#awp-js`), pure. Dates are
 * calendar days as UTC-midnight milliseconds (the Fristenrechner's `Day`);
 * "today" is the Berlin calendar date of the page's `DeadlineClock`, passed
 * in by the caller.
 */
import { MONTHS } from "$lib/landing/deadline/deadline";
import {
	day,
	daysBetween,
	formatDate,
	type Day,
} from "$lib/landing/pages/fristenrechner/fristen";

export type PlanInput = {
	/** The month the contract ends in, 0–11. */
	month: number;
	year: number;
	/** The notice period in months. */
	notice: number;
};

/** The last day of `t`'s month a year later. */
const sameMonthNextYear = (t: Day) => {
	const d = new Date(t);
	return day(d.getUTCFullYear() + 1, d.getUTCMonth() + 1, 0);
};

/** "Dezember 2028" */
export const monthYear = (t: Day) => {
	const d = new Date(t);
	return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

/** The years the select offers: this one and the next `count − 1`. */
export const yearOptions = (today: Day, count: number) => {
	const first = new Date(today).getUTCFullYear();
	return Array.from({ length: count }, (_, i) => first + i);
};

export function plan({ month, year, notice }: PlanInput, today: Day) {
	// The contract ends on its month's last day; notice is due by the last day
	// of the month `notice` months before.
	let end = day(year, month + 1, 0);
	let by = day(year, month - notice + 1, 0);
	// Missed (the design: before now, so today counts as missed): the contract
	// runs a year longer.
	const late = by <= today;
	if (late) {
		by = sameMonthNextYear(by);
		end = sameMonthNextYear(end);
	}

	// The timeline runs from 1 January of this year to 1 January two years
	// after the end, at least four years.
	const thisYear = new Date(today).getUTCFullYear();
	const from = day(thisYear, 0, 1);
	const to = day(
		Math.max(new Date(end).getUTCFullYear() + 2, thisYear + 4),
		0,
		1,
	);
	const at = (t: Day) =>
		Math.max(0, Math.min(100, ((t - from) / (to - from)) * 100));

	return {
		late,
		by: formatDate(by),
		daysLeft: daysBetween(today, by),
		mount: monthYear(end),
		/** Positions on the timeline, in %. */
		timeline: { now: at(today), by: at(by), end: at(end) },
	};
}

export type Plan = ReturnType<typeof plan>;
