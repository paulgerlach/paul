/**
 * Date logic of /upgrade-now: everything that depends on "now", computed in
 * Europe/Berlin. Pure functions, no DOM and no `Date.now()`: every function
 * takes `now` (ms), so SSR and hydration render the same values from the
 * single `now` that `load` passes down.
 */

/** 31.12.2026, 24:00 in Berlin (= 1.1.2027, 00:00 CET). */
export const DEADLINE = Date.UTC(2026, 11, 31, 23, 0, 0);
export const DEADLINE_YEAR = 2026;

const DAY = 86_400_000;

/** Nationwide holidays of 2026 (regional ones aren't counted), key `M-D`. */
export const HOLIDAYS_2026: Record<string, string> = {
	"1-1": "Neujahr",
	"4-3": "Karfreitag",
	"4-6": "Ostermontag",
	"5-1": "Tag der Arbeit",
	"5-14": "Christi Himmelfahrt",
	"5-25": "Pfingstmontag",
	"10-3": "Tag der Deutschen Einheit",
	"12-25": "1. Weihnachtstag",
	"12-26": "2. Weihnachtstag",
};

export const MONTHS = [
	"Januar",
	"Februar",
	"März",
	"April",
	"Mai",
	"Juni",
	"Juli",
	"August",
	"September",
	"Oktober",
	"November",
	"Dezember",
];
const MONTHS_SHORT = [
	"Jan",
	"Feb",
	"Mär",
	"Apr",
	"Mai",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Okt",
	"Nov",
	"Dez",
];
const NUM = [
	"null",
	"einen",
	"zwei",
	"drei",
	"vier",
	"fünf",
	"sechs",
	"sieben",
	"acht",
	"neun",
	"zehn",
	"elf",
	"zwölf",
];

const berlinFormat = new Intl.DateTimeFormat("en-US", {
	timeZone: "Europe/Berlin",
	year: "numeric",
	month: "numeric",
	day: "numeric",
	hour: "numeric",
	minute: "numeric",
	second: "numeric",
	hourCycle: "h23",
});

type BerlinDate = {
	year: number;
	/** 0–11 */
	month: number;
	day: number;
};

function berlinWallClock(ms: number) {
	const parts: Record<string, number> = {};
	for (const { type, value } of berlinFormat.formatToParts(ms)) {
		if (type !== "literal") parts[type] = Number(value);
	}
	return parts;
}

/** The calendar date in Berlin at `ms`. */
export function berlinDate(ms: number): BerlinDate {
	const p = berlinWallClock(ms);
	return { year: p.year, month: p.month - 1, day: p.day };
}

/** Berlin's UTC offset at `ms`, in ms (1 h in winter, 2 h in summer). */
function berlinOffset(ms: number) {
	const p = berlinWallClock(ms);
	const wall = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
	return wall - Math.floor(ms / 1000) * 1000;
}

/** The instant of 00:00 Berlin time on the given date. */
export function berlinMidnight(year: number, month: number, day: number) {
	const utc = Date.UTC(year, month, day);
	// German DST switches at 2–3 am, so the offset an hour before is the right one.
	return utc - berlinOffset(utc - 3_600_000);
}

/** 00:00 Berlin time of the day `now` falls on. Changes once a day. */
export function startOfBerlinDay(now: number) {
	const { year, month, day } = berlinDate(now);
	return berlinMidnight(year, month, day);
}

/** Whole calendar days from date `a` to date `b` (time zone independent). */
function dayDiff(a: BerlinDate, b: BerlinDate) {
	return Math.round(
		(Date.UTC(b.year, b.month, b.day) - Date.UTC(a.year, a.month, a.day)) / DAY,
	);
}

export const isExpired = (now: number) => now >= DEADLINE;

/** Time left for the countdown; all zero once expired. */
export function remaining(now: number) {
	let s = Math.floor(Math.max(0, DEADLINE - now) / 1000);
	const days = Math.floor(s / 86_400);
	s -= days * 86_400;
	const hours = Math.floor(s / 3600);
	s -= hours * 3600;
	const minutes = Math.floor(s / 60);
	return {
		days,
		hours,
		minutes,
		seconds: s - minutes * 60,
		expired: isExpired(now),
	};
}

/**
 * Calendar days from today (Berlin) to 31.12.2026: 0 on the last day,
 * -1 once the deadline has passed.
 */
export function daysLeft(now: number) {
	if (isExpired(now)) return -1;
	return Math.max(
		0,
		dayDiff(berlinDate(now), { year: DEADLINE_YEAR, month: 11, day: 31 }),
	);
}

/** "Noch 85 Tage", "Noch 1 Tag", "Letzter Tag", "Frist abgelaufen". */
export function daysLeftText(now: number) {
	const d = daysLeft(now);
	if (d < 0) return "Frist abgelaufen";
	if (d === 0) return "Letzter Tag";
	return `Noch ${d} ${d === 1 ? "Tag" : "Tage"}`;
}

/**
 * The hero's "Nur noch … bis zur Umrüstpflicht": "knapp drei Monate",
 * "gut zwei Monate", "einen Monat", "45 Tage", "1 Tag", "heute".
 * Empty once expired (the hero shows its expired H1 then).
 */
export function monthsText(now: number) {
	const d = daysLeft(now);
	if (d < 0) return "";
	if (d === 0) return "heute";
	if (d <= 45) return `${d} ${d === 1 ? "Tag" : "Tage"}`;
	const m = d / 30.44;
	const f = Math.floor(m);
	const r = m - f;
	// The design reads NUM[f + 1], which runs past "zwölf" beyond ~11.5 months.
	if (f >= 12 || (f === 11 && r >= 0.6)) return "zwölf Monate";
	const months = (n: number) => (n === 1 ? "einen Monat" : `${NUM[n]} Monate`);
	if (r >= 0.6) return `knapp ${NUM[f + 1]} Monate`;
	if (r <= 0.2) return months(f);
	return `gut ${months(f)}`;
}

export type YearMonth = {
	label: string;
	/** Elapsed share of the month, 0–1. */
	fill: number;
	state: "past" | "cur" | "left";
	/** December, the deadline month. */
	deadline: boolean;
};

/** The hero's year band: 12 months of 2026 and how much of each has passed. */
export function yearProgress(now: number) {
	const yearStart = berlinMidnight(DEADLINE_YEAR, 0, 1);
	const share = (a: number, b: number) =>
		Math.min(1, Math.max(0, (now - a) / (b - a)));
	const months: YearMonth[] = MONTHS_SHORT.map((label, i) => {
		const fill = share(
			berlinMidnight(DEADLINE_YEAR, i, 1),
			berlinMidnight(DEADLINE_YEAR, i + 1, 1),
		);
		return {
			label,
			fill,
			state: fill >= 1 ? "past" : fill > 0 ? "cur" : "left",
			deadline: i === 11,
		};
	});
	const pct = share(yearStart, DEADLINE);

	const { year, month } = berlinDate(now);
	const first = year < DEADLINE_YEAR ? 0 : month;
	const rest = MONTHS.slice(first);
	let window: string;
	if (pct >= 1 || year > DEADLINE_YEAR) window = "Die Frist ist abgelaufen";
	else if (rest.length <= 1) window = "Nur noch der Dezember bis zur Frist";
	else
		window = `${rest.slice(0, -1).join(", ")} und ${rest.at(-1)}: Ihr letztes Zeitfenster`;

	return {
		months,
		percent: Math.round(pct * 100),
		progressText: `${DEADLINE_YEAR} ist zu ${Math.round(pct * 100)}\u00a0% vorbei`,
		windowText: window,
	};
}

export type CalendarDay = {
	day: number;
	weekend: boolean;
	past: boolean;
	today: boolean;
	deadline: boolean;
	/** Holiday name. */
	holiday?: string;
	/** "Heute", the holiday or "Frist: 31.12.2026". */
	title?: string;
	/** Accessible name, e.g. "7. Oktober 2026, Heute". */
	label: string;
	/** Running index over all cells, for the pop-in stagger. */
	index: number;
};

export type CalendarMonth = {
	/** 0–11 */
	month: number;
	name: string;
	/** Empty cells before the 1st (weeks start on Monday). */
	offset: number;
	days: CalendarDay[];
	/** Working days left in this month, today included. */
	workdays: number;
};

/**
 * The months from the current Berlin month to December 2026 with their day
 * cells, and the totals for the KPIs (working days and nationwide holidays
 * left, today included; full weeks until 1.1.2027).
 */
export function calendarMonths(now: number) {
	const today = berlinDate(now);
	const Y = DEADLINE_YEAR;
	const startMonth = today.year < Y ? 0 : today.year > Y ? 11 : today.month;
	const cmp = (m: number, d: number) =>
		dayDiff(today, { year: Y, month: m, day: d });

	let workdays = 0;
	let holidays = 0;
	let index = 0;
	const months: CalendarMonth[] = [];
	for (let m = startMonth; m < 12; m++) {
		const length = new Date(Date.UTC(Y, m + 1, 0)).getUTCDate();
		const days: CalendarDay[] = [];
		let monthWorkdays = 0;
		for (let d = 1; d <= length; d++) {
			const dow = new Date(Date.UTC(Y, m, d)).getUTCDay();
			const weekend = dow === 0 || dow === 6;
			const holiday = HOLIDAYS_2026[`${m + 1}-${d}`];
			const diff = cmp(m, d);
			const past = diff < 0;
			const isToday = diff === 0;
			const deadline = m === 11 && d === 31;
			if (!past) {
				if (holiday) holidays++;
				if (!weekend && !holiday) {
					workdays++;
					monthWorkdays++;
				}
			}
			const title = deadline
				? "Frist: 31.12.2026"
				: isToday
					? "Heute"
					: holiday;
			days.push({
				day: d,
				weekend,
				past,
				today: isToday,
				deadline,
				holiday,
				title,
				label: `${d}. ${MONTHS[m]} ${Y}${title ? `, ${title}` : ""}`,
				index: index++,
			});
		}
		months.push({
			month: m,
			name: MONTHS[m],
			offset: (new Date(Date.UTC(Y, m, 1)).getUTCDay() + 6) % 7,
			days,
			workdays: monthWorkdays,
		});
	}

	const toNewYear = dayDiff(today, { year: Y + 1, month: 0, day: 1 });
	return {
		months,
		workdays,
		weeks: Math.floor(Math.max(0, toNewYear) / 7),
		holidays,
	};
}
