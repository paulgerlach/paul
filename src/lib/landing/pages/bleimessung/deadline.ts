/**
 * The days since the § 17 TrinkwV deadline (the design's
 * `data-since="2026-01-12"`), pure: calendar days to the Berlin day of
 * `now`, 0 before it (as the design).
 */
import {
	day,
	daysBetween,
	todayOf,
} from "$lib/landing/pages/fristenrechner/fristen";

/** 12.1.2026: lead pipes had to be removed or shut off. */
export const LEAD_DEADLINE = day(2026, 0, 12);

export const daysSinceDeadline = (now: number): number =>
	Math.max(0, daysBetween(LEAD_DEADLINE, todayOf(now)));

/** The design's fmt(): thousands with a dot. */
export const thousands = (n: number): string =>
	String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
