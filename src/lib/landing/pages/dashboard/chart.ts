/**
 * Chart geometry for /dashboard, without DOM access: the server and the
 * browser draw the same paths. Plots live in a 0–100 box (an SVG with
 * `preserveAspectRatio="none"`); labels and markers are positioned in percent
 * of the same box (plan README, Charts).
 */

export type Point = [x: number, y: number];
export type Granularity = "d" | "w" | "m";

/** `de-DE` with exactly `digits` decimals. */
export function de(value: number, digits = 0): string {
	return value.toLocaleString("de-DE", {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits,
	});
}

/** The design's `fmtN`: grouped from 1.000, one decimal below 10. */
export function formatNumber(value: number): string {
	if (value === 0) return "0";
	if (value >= 1000) return de(Math.round(value));
	return de(value, value < 10 ? 1 : 0);
}

/**
 * A round axis maximum above `max` and its step (the design's `nice()`:
 * steps of 0.25, 0.5, 1 or 2 × 10ⁿ), with the ticks from 0 to the maximum.
 */
export function niceScale(max: number): {
	max: number;
	step: number;
	ticks: number[];
} {
	const m = Math.max(max, 1e-6);
	const p = 10 ** Math.floor(Math.log10(m));
	const s = m / p;
	const factor = s <= 1.5 ? 0.25 : s <= 3 ? 0.5 : s <= 6 ? 1 : 2;
	const step = factor * p;
	const top = Math.ceil(m / step - 1e-9) * step;
	const count = Math.round(top / step);
	const ticks = Array.from({ length: count + 1 }, (_, i) =>
		Number((i * step).toPrecision(12)),
	);
	return { max: Number(top.toPrecision(12)), step, ticks };
}

/** Centre of slot `i` of `n`, in percent (bars and points sit mid-slot). */
export function slotX(i: number, n: number): number {
	return ((i + 0.5) / n) * 100;
}

/** A value's height in percent from the top, for an axis from 0 to `max`. */
export function valueY(value: number, max: number): number {
	return (1 - value / max) * 100;
}

/** Values as points in the 0–100 box, one per slot. */
export function toPoints(values: number[], max: number): Point[] {
	return values.map((v, i) => [slotX(i, values.length), valueY(v, max)]);
}

const f = (n: number) => Number(n.toFixed(2));

/** The design's `smooth()`: Catmull-Rom through the points, as Béziers. */
export function smoothPath(points: Point[]): string {
	if (points.length === 0) return "";
	let d = `M${f(points[0][0])} ${f(points[0][1])}`;
	for (let i = 0; i < points.length - 1; i++) {
		const p0 = points[i - 1] ?? points[i];
		const p1 = points[i];
		const p2 = points[i + 1];
		const p3 = points[i + 2] ?? p2;
		d +=
			` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)}` +
			` ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)}` +
			` ${f(p2[0])} ${f(p2[1])}`;
	}
	return d;
}

/** The smooth line closed down to `baseline`, for the area under it. */
export function areaPath(points: Point[], baseline = 100): string {
	if (points.length === 0) return "";
	const first = points[0][0];
	const last = points[points.length - 1][0];
	return `${smoothPath(points)} L${f(last)} ${baseline} L${f(first)} ${baseline} Z`;
}

/**
 * The closing chart's curve (the design's other `smooth()`): points spread
 * over `width` with horizontal tangents, `values` already in SVG y units.
 */
export function stepCurve(values: number[], width: number): string {
	const x = (i: number) => (i * width) / (values.length - 1);
	let d = `M0 ${values[0].toFixed(1)}`;
	for (let i = 1; i < values.length; i++) {
		const mid = ((x(i - 1) + x(i)) / 2).toFixed(1);
		d += ` C${mid} ${values[i - 1].toFixed(1)} ${mid} ${values[i].toFixed(1)} ${x(i).toFixed(1)} ${values[i].toFixed(1)}`;
	}
	return d;
}

/**
 * Monthly values spread over weeks (4 per month) or days (7), as the design's
 * `expand()`: each part a share of the month leaning towards the next one,
 * with a small wobble. Monthly values come back unchanged.
 */
export function expand(
	values: number[],
	granularity: Granularity,
	seed: number,
): number[] {
	if (granularity === "m") return values.slice();
	const n = granularity === "w" ? 4 : 7;
	const out: number[] = [];
	values.forEach((x, i) => {
		const next = values[Math.min(values.length - 1, i + 1)];
		for (let j = 0; j < n; j++) {
			const t = j / n;
			const wobble = 1 + Math.sin((i * n + j) * 1.7 + seed) * 0.18;
			out.push(Math.max(0, ((x + (next - x) * t * 0.4) / n) * wobble));
		}
	});
	return out;
}
