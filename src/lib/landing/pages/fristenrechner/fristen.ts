/**
 * The Fristenrechner's date math (the design's `#fr-js`), pure. Dates are
 * calendar days as UTC-midnight milliseconds (`Day`), so no time zone or DST
 * enters the math; "today" is the Berlin calendar date of the page's
 * `DeadlineClock`, passed in by the caller.
 */
import { berlinDate } from "$lib/landing/deadline/deadline";

/** A calendar day: 00:00 UTC of that date, in ms. */
export type Day = number;

const DAY = 86_400_000;

export const day = (year: number, month: number, date: number): Day =>
	Date.UTC(year, month, date);

/** The Berlin calendar date of the instant `ms` (e.g. the clock's `today`). */
export function todayOf(ms: number): Day {
	const { year, month, day: date } = berlinDate(ms);
	return day(year, month, date);
}

/** "2027-09-30" → Day; `null` for anything else (an empty or partial input). */
export function parseIso(value: string | null | undefined): Day | null {
	const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? "");
	if (!m) return null;
	const [y, mo, d] = [Number(m[1]), Number(m[2]) - 1, Number(m[3])];
	const t = day(y, mo, d);
	const back = new Date(t);
	// Reject dates the input can't hold (31 February).
	if (back.getUTCMonth() !== mo || back.getUTCDate() !== d) return null;
	return t;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Day → "2027-09-30", the value of an `<input type="date">`. */
export function toIso(t: Day): string {
	const d = new Date(t);
	return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

/** Day → "30.09.2027". */
export function formatDate(t: Day): string {
	const d = new Date(t);
	return `${pad(d.getUTCDate())}.${pad(d.getUTCMonth() + 1)}.${d.getUTCFullYear()}`;
}

export const addDays = (t: Day, n: number): Day => t + n * DAY;

/** `n` months later (or earlier), the day clamped to the target month's length. */
export function addMonths(t: Day, n: number): Day {
	const d = new Date(t);
	const first = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1));
	const last = new Date(
		Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0),
	).getUTCDate();
	return day(
		first.getUTCFullYear(),
		first.getUTCMonth(),
		Math.min(d.getUTCDate(), last),
	);
}

export const addYears = (t: Day, n: number): Day => addMonths(t, 12 * n);

/** Whole days from `from` to `to` (negative when `to` lies before). */
export const daysBetween = (from: Day, to: Day): number =>
	Math.round((to - from) / DAY);

/** The design's starting values for "today". */
export function defaults(today: Day) {
	const year = new Date(today).getUTCFullYear();
	return {
		/** Vertragsbeginn: 1 January, eight years back. */
		contractStart: toIso(day(year - 8, 0, 1)),
		/** Jahr der Eichung: four years back. */
		calibrationYear: year - 4,
		/** Ende des Abrechnungszeitraums: 31 December of last year. */
		periodEnd: toIso(day(year - 1, 11, 31)),
	};
}

export type ContractInput = {
	start: Day;
	/** Erstlaufzeit, years. */
	term: number;
	/** Verlängerung danach, years. */
	renewal: number;
	/** Kündigungsfrist, months. */
	notice: number;
};

/** The last day a cancellation must arrive for the contract to end on `end`. */
const cancelDay = (end: Day, notice: number) =>
	addDays(addMonths(addDays(end, 1), -notice), -1);

/**
 * The contract's next possible end and the last day to cancel for it: the
 * first end is the start plus the term, minus a day; while its cancel day has
 * passed, the contract renews (at most 60 times, as the design).
 */
export function contract(input: ContractInput, today: Day) {
	let end = addDays(addYears(input.start, input.term), -1);
	let cancelBy = cancelDay(end, input.notice);
	for (let k = 0; cancelBy < today && k < 60; k++) {
		end = addDays(addYears(addDays(end, 1), input.renewal), -1);
		cancelBy = cancelDay(end, input.notice);
	}
	const days = daysBetween(today, cancelBy);
	const total = Math.max(1, daysBetween(today, end));
	return {
		cancelBy,
		end,
		days,
		/** The cancel day's place between today and the end, 0–1 (the timeline). */
		progress: Math.max(0, Math.min(1, days / total)),
	};
}

/**
 * When a meter's calibration runs out: at the end of the calendar year
 * `years` after the year of calibration; plan the swap three months before.
 * `null` for a year the design ignores (empty or before 1900).
 */
export function calibration(year: number | null, years: number) {
	if (!year || year < 1900) return null;
	const end = day(year + years, 11, 31);
	return { end, plan: addMonths(end, -3) };
}

/**
 * The billing deadline (a year after the period's end) and, given the day the
 * bill reached the tenant, the last day for objections (a year after that).
 */
export function billing(periodEnd: Day, received: Day | null) {
	return {
		deadline: addYears(periodEnd, 1),
		objections: received === null ? null : addYears(received, 1),
	};
}

export type BadgeTone = "ok" | "warn" | "late";

const NB = "\u00a0";
const de = (n: number) => n.toLocaleString("de-DE");
const days = (n: number, one: string, many: string) =>
	`${de(n)}${NB}${n === 1 ? one : many}`;

/**
 * The badge next to a result: "noch 346 Tage", "heute", "seit 3 Tagen vorbei";
 * amber below `warnAt` days, red once passed.
 */
export function daysBadge(n: number, warnAt: number) {
	if (n < 0)
		return {
			text: `seit ${days(-n, "Tag", "Tagen")} vorbei`,
			tone: "late" as BadgeTone,
		};
	return {
		text: n === 0 ? "heute" : `noch ${days(n, "Tag", "Tage")}`,
		tone: (n < warnAt ? "warn" : "ok") as BadgeTone,
	};
}

/** A milestone's badge: "gilt" once its day has passed, "heute", "in 73 Tagen". */
export function milestoneBadge(date: Day, today: Day) {
	const n = daysBetween(today, date);
	if (n < 0) return "gilt";
	if (n === 0) return "heute";
	return `in ${days(n, "Tag", "Tagen")}`;
}

/** How far the timeline's "Kündigung" label shifts left of its point, in %. */
export const timelineAnchor = (progress: number) =>
	progress > 0.85 ? 88 : progress < 0.15 ? 12 : 50;
