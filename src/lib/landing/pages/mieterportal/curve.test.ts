import { describe, expect, it } from "vitest";
import { curvePath } from "./curve";

describe("curvePath", () => {
	it("draws a flat series as a horizontal line", () => {
		const { line, dot } = curvePath([50, 50, 50], 100);
		expect(line).toBe("M0,50 C50,50 50,50 100,50 C150,50 150,50 200,50");
		expect(dot).toEqual({ left: 100, top: 50 });
	});

	it("maps 0 to the bottom and max to the top", () => {
		const { line, dot } = curvePath([0, 400], 400);
		expect(line).toBe("M0,100 C100,100 100,0 200,0");
		expect(dot).toEqual({ left: 100, top: 0 });
	});

	it("closes the area to the bottom edge", () => {
		const { line, area } = curvePath([1, 2, 3], 3);
		expect(area).toBe(`${line} L200,100 L0,100 Z`);
	});
});
