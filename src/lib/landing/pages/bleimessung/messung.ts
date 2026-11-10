/**
 * The hero card's example measurement (the design's #pb-js), pure: the
 * verdict for a lead value and the pointer's place on the 0–20 µg/l scale.
 */

/** Below 5 µg/l (the limit from 12.1.2028), below 10 (today's limit), above. */
export type Verdict = "ok" | "warn" | "bad";

/** The limit from 12.1.2028 and today's, in µg/l. */
export const LIMIT_2028 = 5;
export const LIMIT_TODAY = 10;
/** The scale's end, in µg/l. */
export const SCALE_MAX = 20;

export function verdict(value: number): Verdict {
	if (value < LIMIT_2028) return "ok";
	return value < LIMIT_TODAY ? "warn" : "bad";
}

/** The pointer's place in percent of the scale, at most its end. */
export const pointer = (value: number): number =>
	Math.min(100, (value / SCALE_MAX) * 100);
