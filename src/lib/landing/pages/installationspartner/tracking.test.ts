import { describe, expect, it } from "vitest";
import { tracking } from "./content";
import {
	countLabel,
	markerAt,
	PASS_MS,
	RESTING_STEP,
	TRACKING_STEPS,
	UNIT_POSITIONS,
} from "./tracking";

describe("tracking", () => {
	it("has a position for every flat in the drawing", () => {
		expect(UNIT_POSITIONS).toHaveLength(tracking.units.length);
		for (const [x, y] of UNIT_POSITIONS) {
			expect(x).toBeGreaterThan(0);
			expect(x).toBeLessThan(300);
			expect(y).toBeGreaterThan(0);
			expect(y).toBeLessThan(214);
		}
	});

	it("draws the marker right of the flat's anchor", () => {
		expect(markerAt(5)).toEqual([214, 103]);
	});

	it("orders the steps in time, within one pass", () => {
		const times = TRACKING_STEPS.map((s) => s.at);
		expect(times[0]).toBe(0);
		expect([...times].sort((a, b) => a - b)).toEqual(times);
		expect(times.at(-1)).toBeLessThan(PASS_MS);
	});

	it("moves the fitter one flat at a time up to the tenant's", () => {
		let last = TRACKING_STEPS[0];
		for (const step of TRACKING_STEPS.slice(1)) {
			expect(step.current - last.current).toBeGreaterThanOrEqual(0);
			expect(step.current - last.current).toBeLessThanOrEqual(1);
			expect(step.done).toBe(step.current);
			last = step;
		}
		const final = TRACKING_STEPS.at(-1)!;
		expect(final.current).toBe(tracking.units.length - 1);
		expect(final.count).toBeNull();
		expect(final.here).toBe(true);
	});

	it("counts the flats before the tenant's", () => {
		for (const step of TRACKING_STEPS.filter((s) => s.count !== null))
			expect(step.count).toBe(tracking.units.length - 1 - step.current);
	});

	it("rests with two flats to go and the push shown", () => {
		expect(RESTING_STEP).toMatchObject({ current: 5, count: 2, push: true });
	});

	it("labels the count", () => {
		expect(countLabel(3, tracking.count)).toBe("Wohnungen vor Ihnen");
		expect(countLabel(1, tracking.count)).toBe("Wohnung vor Ihnen");
		expect(countLabel(null, tracking.count)).toBe("Ihr Monteur ist bei Ihnen");
	});
});
