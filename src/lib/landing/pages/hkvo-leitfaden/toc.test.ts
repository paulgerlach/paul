import { describe, expect, it } from "vitest";
import { activeIndex, readProgress } from "./toc";

describe("activeIndex", () => {
	it("marks the first article when no top is above the line", () => {
		expect(activeIndex([400, 900, 1400], 270)).toBe(0);
		expect(activeIndex([], 270)).toBe(0);
	});

	it("marks the last article whose top passed the line", () => {
		expect(activeIndex([-800, -200, 100, 700], 270)).toBe(2);
		expect(activeIndex([-1400, -900, -400], 270)).toBe(2);
	});

	it("doesn't count a top exactly on the line", () => {
		expect(activeIndex([-100, 270, 800], 270)).toBe(0);
	});
});

describe("readProgress", () => {
	it("is 0 before the body and 1 after it", () => {
		expect(readProgress(500, 4000, 270)).toBe(0);
		expect(readProgress(-5000, 4000, 270)).toBe(1);
	});

	it("is the share of the body above the line", () => {
		expect(readProgress(-1730, 4000, 270)).toBe(0.5);
	});

	it("is 0 for an empty body", () => {
		expect(readProgress(-100, 0, 270)).toBe(0);
	});
});
