import { describe, expect, it } from "vitest";
import { CAMERA_END, CAMERA_EVERY, CAMERA_START, CAMERA_STEPS } from "./camera";

describe("camera timeline", () => {
	it("runs in time order within one pass", () => {
		const times = CAMERA_STEPS.map((s) => s.at);
		expect(times).toEqual([...times].sort((a, b) => a - b));
		expect(new Set(times).size).toBe(times.length);
		expect(times[0]).toBeGreaterThan(0);
		expect(times.at(-1)).toBeLessThan(CAMERA_EVERY);
	});

	it("starts empty and ends done", () => {
		expect(CAMERA_START).toEqual({
			photo: 1,
			focus: false,
			flash: false,
			thumbs: 0,
		});
		expect(CAMERA_STEPS.at(-1)?.state).toEqual(CAMERA_END);
		expect(CAMERA_END).toEqual({
			photo: 3,
			focus: false,
			flash: false,
			thumbs: 2,
		});
	});

	it("only flashes in focus, taking a thumbnail each time", () => {
		const flashes = CAMERA_STEPS.filter((s) => s.state.flash);
		expect(flashes).toHaveLength(2);
		for (const s of flashes) expect(s.state.focus).toBe(true);
		expect(flashes.map((s) => s.state.thumbs)).toEqual([1, 2]);
	});

	it("never goes back within a pass", () => {
		let prev = CAMERA_START;
		for (const { state } of CAMERA_STEPS) {
			expect(state.photo).toBeGreaterThanOrEqual(prev.photo);
			expect(state.thumbs).toBeGreaterThanOrEqual(prev.thumbs);
			prev = state;
		}
	});
});
