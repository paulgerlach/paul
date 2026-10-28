import { describe, expect, it } from "vitest";
import { currentLine, strikeFrame, strikeTime } from "./strike";

const N = 6;

describe("strike scene", () => {
	it("maps progress to time", () => {
		expect(strikeTime(0, N)).toBe(0);
		expect(strikeTime(1, N)).toBeCloseTo(5.4);
		expect(strikeTime(2, N)).toBeCloseTo(5.4);
	});

	it("shows the first line at the start, the others waiting below", () => {
		expect(strikeFrame(0, 0, N, 50, 50)).toMatchObject({
			opacity: 1,
			y: 0,
			strike: 0,
		});
		expect(strikeFrame(1, 0, N, 50, 50)).toMatchObject({ opacity: 0, y: 68 });
	});

	it("strikes a line through while it stays", () => {
		expect(strikeFrame(0, 0.475, N, 50, 50).strike).toBeCloseTo(0.5);
		expect(strikeFrame(0, 0.7, N, 50, 50).strike).toBe(1);
	});

	it("moves a struck line up and fades it", () => {
		const f = strikeFrame(0, 1, N, 50, 50);
		expect(f).toMatchObject({ y: -78, strike: 1, faded: true });
		expect(f.opacity).toBeCloseTo(0.38);
		expect(strikeFrame(0, 2, N, 50, 50).opacity).toBe(0);
	});

	it("never strikes the final line", () => {
		expect(strikeFrame(N - 1, 5.4, N, 50, 50)).toMatchObject({
			opacity: 1,
			strike: 0,
		});
	});

	it("names the current line", () => {
		expect(currentLine(0, N)).toBe(0);
		expect(currentLine(0.95, N)).toBe(1);
		expect(currentLine(5.4, N)).toBe(5);
	});
});
