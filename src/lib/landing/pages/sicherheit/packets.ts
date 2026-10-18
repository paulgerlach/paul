/**
 * The hero map's data packets (plan 01 §1.5), without the DOM: the design
 * moves them with `getTotalLength()` / `getPointAtLength()`; here the point
 * at a share of the curve's length comes from a small lookup table.
 */
import type { Point } from "./map";

export type Curve = { p0: Point; c: Point; p1: Point };

/** The point on a quadratic Bézier at parameter `t` (0–1). */
export function quadPoint({ p0, c, p1 }: Curve, t: number): Point {
	const u = 1 - t;
	return {
		x: u * u * p0.x + 2 * u * t * c.x + t * t * p1.x,
		y: u * u * p0.y + 2 * u * t * c.y + t * t * p1.y,
	};
}

/** Cumulative lengths at `n + 1` evenly spaced parameters (0 … total). */
export function arcTable(curve: Curve, n = 32): number[] {
	const table = [0];
	let prev = curve.p0;
	for (let i = 1; i <= n; i++) {
		const pt = quadPoint(curve, i / n);
		table.push(table[i - 1] + Math.hypot(pt.x - prev.x, pt.y - prev.y));
		prev = pt;
	}
	return table;
}

/** The point at share `s` (0–1) of the curve's length. */
export function pointAtLength(curve: Curve, table: number[], s: number): Point {
	const n = table.length - 1;
	const target = Math.min(1, Math.max(0, s)) * table[n];
	let i = 1;
	while (i < n && table[i] < target) i++;
	const span = table[i] - table[i - 1];
	const k = span > 0 ? (target - table[i - 1]) / span : 0;
	return quadPoint(curve, (i - 1 + k) / n);
}

/** The design's ease-in-out (quadratic). */
export const ease = (p: number) =>
	p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;

/** Fades in over the first and out over the last tenth of the way. */
export const opacity = (p: number) =>
	p < 0.1 ? p * 10 : p > 0.9 ? (1 - p) * 10 : 1;

/** Index of the log message after `i` of `n`. */
export const nextMessage = (i: number, n: number) => (i + 1) % n;
