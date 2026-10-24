/**
 * The booking card's "Die nächsten Werktage" (the design's `#demo-js`), pure:
 * the next five weekdays after today, Monday to Friday, on Berlin calendar
 * days. "Today" is the instant of the page's `DeadlineClock`, passed in by the
 * caller, so the server renders the days for its date and the browser's clock
 * takes over on mount.
 */
import { berlinDate } from "$lib/landing/deadline/deadline";

const WEEKDAYS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

export type Weekday = {
	/** "2026-10-22", the key and the `datetime`. */
	iso: string;
	/** "Do" */
	weekday: string;
	/** 22 */
	day: number;
	/** "10." */
	month: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

/** The `count` weekdays after the Berlin date of `now` (holidays included, as in the design). */
export function nextWeekdays(now: number, count = 5): Weekday[] {
	const { year, month, day } = berlinDate(now);
	const days: Weekday[] = [];
	for (let i = 1; days.length < count; i++) {
		const d = new Date(Date.UTC(year, month, day + i));
		const w = d.getUTCDay();
		if (w === 0 || w === 6) continue;
		days.push({
			iso: `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`,
			weekday: WEEKDAYS[w],
			day: d.getUTCDate(),
			month: `${d.getUTCMonth() + 1}.`,
		});
	}
	return days;
}
