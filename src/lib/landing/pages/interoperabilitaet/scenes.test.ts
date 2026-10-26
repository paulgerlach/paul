import { describe, expect, it } from "vitest";
import { merge } from "./content";
import {
	addReading,
	cubicPoint,
	DECODER,
	keysTimes,
	lawTimes,
	MERGE_CURVES,
	mergeSequence,
	mergeTimes,
	pointAtShare,
	pulse,
	READING,
	readingAt,
	spoke,
	telegram,
	wire,
	type Cubic,
} from "./scenes";

const line: Cubic = [
	{ x: 0, y: 0 },
	{ x: 10, y: 0 },
	{ x: 20, y: 0 },
	{ x: 30, y: 0 },
];

describe("curves", () => {
	it("starts and ends a cubic at its end points", () => {
		expect(cubicPoint(MERGE_CURVES[0], 0)).toEqual({ x: 152, y: 44 });
		expect(cubicPoint(MERGE_CURVES[0], 1)).toEqual({ x: 280, y: 112 });
	});

	it("finds the point at a share of the length", () => {
		expect(pointAtShare(line, 0.5).x).toBeCloseTo(15, 5);
		expect(pointAtShare(line, 2)).toEqual({ x: 30, y: 0 });
		expect(pointAtShare(line, -1)).toEqual({ x: 0, y: 0 });
	});

	it("wires a device to its row side by side, and to the dashboard's top when stacked", () => {
		const device = { l: 0, t: 0, r: 100, b: 40 };
		const row = { l: 200, t: 100, r: 400, b: 140 };
		const dash = { l: 200, t: 50, r: 400, b: 300 };
		const side = wire(device, row, dash, false, 0);
		expect(side[0]).toEqual({ x: 100, y: 20 });
		expect(side[3]).toEqual({ x: 200, y: 120 });
		const stacked = wire(device, row, dash, true, 3);
		expect(stacked[0]).toEqual({ x: 50, y: 40 });
		expect(stacked[3].y).toBe(50);
		expect(stacked[3].x).toBeCloseTo(200 + 200 * 0.85, 5);
	});
});

describe("timelines", () => {
	it("fills a group in five packets", () => {
		let count = 0;
		for (let i = 0; i < 5; i++) count = addReading(count, 48);
		expect(count).toBe(48);
		expect(addReading(5, 6)).toBe(6);
	});

	it("decodes five telegrams in a 10.1 s pass", () => {
		expect(DECODER.every).toBe(10100);
		expect(telegram(() => 0)).toBe(Array(14).fill("00").join(" "));
	});

	it("reads five devices in an 8.8 s pass", () => {
		expect(READING.every).toBe(8800);
		expect(readingAt(4)).toEqual({ start: 4620, done: 5440 });
	});

	it("sends card 2's packets round robin, six devices each", () => {
		const seq = mergeSequence(merge.sources, merge.step);
		expect(seq.join("")).toBe("ABCABCABCABABABAA");
		const { at, every } = mergeTimes(seq, "C");
		expect(at[0]).toBe(500);
		expect(at[3]).toBe(500 + 330 + 330 + 260);
		expect(every).toBe(10100);
	});

	it("times card 3's scan and card 4's keys as the design", () => {
		const law = lawTimes(3);
		expect(law.reach(0)).toBe(750);
		expect(law.connect).toBe(3960);
		expect(law.every).toBe(8860);
		const keys = keysTimes(3);
		expect(keys.stack).toBe(6240);
		expect(keys.every).toBe(11640);
	});

	it("places the orb's systems on its spokes and alternates the pulses", () => {
		expect(spoke(0, 8)).toEqual({ x: 200, y: 56 });
		expect(spoke(2, 8)).toEqual({ x: 344, y: 200 });
		expect(pulse(0, 8)).toEqual({ system: 0, out: true });
		expect(pulse(9, 8)).toEqual({ system: 1, out: false });
	});
});
