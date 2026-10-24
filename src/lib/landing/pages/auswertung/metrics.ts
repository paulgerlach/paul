/**
 * The math of /plattform/auswertung's mock-up, comparison, heatmap and notes, as the
 * design's `#aw2-js` does it. Pure, so the server renders every block in its
 * end state and the browser derives the same values.
 */
import type { Hint, HintFilter } from "./content";

const NB = " ";
const MINUS = "−";

export function average(values: number[]): number {
	return values.reduce((a, b) => a + b, 0) / values.length;
}

/** The bars' full width: the maximum with some headroom (1.1 in the mock-up, 1.08 in the comparison). */
export function scaleMax(values: number[], headroom: number): number {
	return Math.max(...values) * headroom;
}

/** `value` as a share of `max`, in %. */
export function share(value: number, max: number): number {
	return (value / max) * 100;
}

/** Each value's rank, highest first (ties keep their order). */
export function ranks(values: number[]): number[] {
	const order = values.map((_, i) => i).sort((a, b) => values[b] - values[a]);
	return values.map((_, i) => order.indexOf(i));
}

/** Rounded deviation from the average in %. */
export function deviation(value: number, avg: number): number {
	return Math.round((value / avg - 1) * 100);
}

/** "+28 %", "−21 %", "±0 %". */
export function signedPercent(value: number): string {
	const sign = value > 0 ? "+" : value < 0 ? MINUS : "±";
	return `${sign}${Math.abs(value)}${NB}%`;
}

/** The heatmap's five colours, from far below the previous year to far above. */
export const HEAT_SCALE = [
	"#3E9A57",
	"#8AD68F",
	"#E7ECE9",
	"#F2C79B",
	"#D9622B",
];

export function heatColor(value: number): string {
	if (value <= -10) return HEAT_SCALE[0];
	if (value <= -4) return HEAT_SCALE[1];
	if (value < 4) return HEAT_SCALE[2];
	if (value < 12) return HEAT_SCALE[3];
	return HEAT_SCALE[4];
}

export function heatTip(value: number): string {
	return `${signedPercent(value)} zum Vorjahr`;
}

export function filterHints(items: Hint[], filter: HintFilter): Hint[] {
	return filter === "all" ? items : items.filter((h) => h.kind === filter);
}
