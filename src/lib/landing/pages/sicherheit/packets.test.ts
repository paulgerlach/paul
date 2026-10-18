import { describe, expect, it } from "vitest";
import { DOTS, SERVER } from "./map";
import {
	arcTable,
	ease,
	nextMessage,
	opacity,
	pointAtLength,
	quadPoint,
	type Curve,
} from "./packets";

const line: Curve = {
	p0: { x: 0, y: 0 },
	c: { x: 50, y: 0 },
	p1: { x: 100, y: 0 },
};
const curves: Curve[] = DOTS.map((d) => ({ p0: d, c: d.c, p1: SERVER }));

describe("quadPoint", () => {
	it("starts and ends at the end points", () => {
		expect(quadPoint(curves[0], 0)).toEqual({ x: DOTS[0].x, y: DOTS[0].y });
		expect(quadPoint(curves[0], 1)).toEqual(SERVER);
	});
});

describe("pointAtLength", () => {
	it("walks a straight curve evenly", () => {
		const t = arcTable(line);
		expect(t[t.length - 1]).toBeCloseTo(100);
		expect(pointAtLength(line, t, 0).x).toBeCloseTo(0);
		expect(pointAtLength(line, t, 0.5).x).toBeCloseTo(50);
		expect(pointAtLength(line, t, 0.25).x).toBeCloseTo(25);
		expect(pointAtLength(line, t, 1).x).toBeCloseTo(100);
	});

	it("covers equal distances in equal steps on a bent curve", () => {
		// The dot in the north-east bends the most.
		const curve = curves[0];
		const t = arcTable(curve, 256);
		const fine = t[t.length - 1];
		const table = arcTable(curve);
		const pts = [0, 0.25, 0.5, 0.75, 1].map((s) =>
			pointAtLength(curve, table, s),
		);
		for (let i = 1; i < pts.length; i++) {
			const d = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
			expect(Math.abs(d - fine / 4)).toBeLessThan(0.5);
		}
	});

	it("clamps outside 0–1", () => {
		const t = arcTable(line);
		expect(pointAtLength(line, t, -1).x).toBeCloseTo(0);
		expect(pointAtLength(line, t, 2).x).toBeCloseTo(100);
	});
});

describe("ease and opacity", () => {
	it("eases in and out symmetrically", () => {
		expect(ease(0)).toBe(0);
		expect(ease(0.5)).toBe(0.5);
		expect(ease(1)).toBe(1);
		expect(ease(0.2) + ease(0.8)).toBeCloseTo(1);
	});

	it("fades at both ends", () => {
		expect(opacity(0)).toBe(0);
		expect(opacity(0.05)).toBeCloseTo(0.5);
		expect(opacity(0.5)).toBe(1);
		expect(opacity(0.95)).toBeCloseTo(0.5);
		expect(opacity(1)).toBe(0);
	});
});

it("cycles the log messages", () => {
	expect(nextMessage(0, 4)).toBe(1);
	expect(nextMessage(3, 4)).toBe(0);
});
