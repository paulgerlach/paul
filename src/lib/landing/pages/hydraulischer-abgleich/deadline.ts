/**
 * The days left until the § 60b GModG deadline (the design's
 * `data-until="2027-09-30"`), pure: calendar days from the Berlin day of
 * `now`, 0 on the day and after it (as the design).
 */
import {
	day,
	daysBetween,
	todayOf,
} from "$lib/landing/pages/fristenrechner/fristen";

/** 30.9.2027: Heizungsprüfung for systems installed before October 2009. */
export const INSPECTION_DEADLINE = day(2027, 8, 30);

export const daysUntilInspection = (now: number): number =>
	Math.max(0, daysBetween(todayOf(now), INSPECTION_DEADLINE));

/** The design's fmt(): thousands with a dot. */
export const thousands = (n: number): string =>
	String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
