/**
 * The hero's efficiency scale (the design's `cls()` and `setScale()` in
 * #ea-js), pure: the class of a value in kWh/(m²·a) and the marker's place
 * on the bar of nine equal cells.
 */

/** Upper limits of A+ … G; H is everything above 250. */
export const CLASS_LIMITS = [30, 50, 75, 100, 130, 160, 200, 250] as const;
/** The upper end the design gives H for the marker's place. */
const H_UPPER = 300;
const CELLS = CLASS_LIMITS.length + 1;

/** 0 (A+) to 8 (H). */
export function scaleClass(value: number): number {
	const i = CLASS_LIMITS.findIndex((limit) => value < limit);
	return i === -1 ? CELLS - 1 : i;
}

/** The marker's `left` in percent of the bar: its class plus its share of it. */
export function markerLeft(value: number): number {
	const c = scaleClass(value);
	const lower = c === 0 ? 0 : CLASS_LIMITS[c - 1];
	const upper = c < CLASS_LIMITS.length ? CLASS_LIMITS[c] : H_UPPER;
	const share = (value - lower) / (upper - lower);
	return Math.min(100, Math.max(0, ((c + share) / CELLS) * 100));
}

/** "118", in German format without decimals. */
export const formatKwh = (value: number) =>
	Math.round(value).toLocaleString("de-DE");
