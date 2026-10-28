import { describe, expect, it } from "vitest";
import {
	aimX,
	coverX,
	ease,
	flowStep,
	progress,
	sceneState,
	seg,
} from "./scene";

describe("private-vermieter scene", () => {
	it("eases and segments", () => {
		expect(ease(0)).toBe(0);
		expect(ease(0.5)).toBe(0.5);
		expect(ease(1)).toBe(1);
		expect(seg(0.2, 0.1, 0.3)).toBeCloseTo(0.5);
		expect(seg(0, 0.1, 0.3)).toBe(0);
		expect(seg(1, 0.1, 0.3)).toBe(1);
	});

	it("measures the progress through a tall section", () => {
		expect(progress(0, 3000, 900)).toBe(0);
		expect(progress(-1050, 3000, 900)).toBe(0.5);
		expect(progress(-5000, 3000, 900)).toBe(1);
		// A section no taller than the viewport is done.
		expect(progress(0, 600, 900)).toBe(1);
	});

	it("starts with the flat in a narrow frame and the first caption", () => {
		expect(sceneState(0)).toMatchObject({
			frameWidth: 88,
			frameRadius: 28,
			roomScale: 1,
			roomBlur: 0,
			roomOpacity: 1,
			meterOpacity: 0,
			caption: 0,
			signals: false,
			tags: 0,
		});
	});

	it("ends on the meters with the last caption, the signals and every tag", () => {
		expect(sceneState(1)).toMatchObject({
			frameWidth: 100,
			frameRadius: 16,
			roomOpacity: 0,
			meterOpacity: 1,
			meterScale: 1.7,
			meterBlur: 0,
			caption: 2,
			signals: true,
			tags: 3,
		});
		expect(sceneState(1).roomScale).toBeCloseTo(2.35);
	});

	it("changes captions, signals and tags at the design's thresholds", () => {
		expect(sceneState(0.32).caption).toBe(0);
		expect(sceneState(0.34).caption).toBe(1);
		expect(sceneState(0.63).caption).toBe(2);
		expect(sceneState(0.69).signals).toBe(true);
		expect(sceneState(0.75).tags).toBe(1);
		expect(sceneState(0.81).tags).toBe(2);
	});

	it("aims a point into the middle of the frame", () => {
		const layer = { left: -100, width: 1200, frame: 1000 };
		// 0.81 of the photo sits at 872 px, past 66 %: shift it left.
		expect(aimX(layer, 0.81)).toBeCloseTo(660 - 872);
		expect(aimX(layer, 0.5)).toBe(0);
	});

	it("never uncovers the frame", () => {
		const layer = { left: -100, width: 1200, frame: 1000 };
		for (const s of [1, 1.5, 2.35])
			for (const tx of [-2000, -200, 0, 200, 2000]) {
				const x = coverX(layer, 0.81, s, tx);
				const ox = layer.left + 0.81 * layer.width;
				const leftEdge = ox + (layer.left - ox) * s + x;
				const rightEdge = ox + (layer.left + layer.width - ox) * s + x;
				expect(leftEdge).toBeLessThanOrEqual(0.001);
				expect(rightEdge).toBeGreaterThanOrEqual(layer.frame - 0.001);
			}
	});

	it("splits the flow into five steps", () => {
		expect(flowStep(0)).toEqual({ step: 0, fill: 0 });
		expect(flowStep(0.5).step).toBe(2);
		expect(flowStep(0.5).fill).toBeCloseTo(0.5);
		expect(flowStep(1).step).toBe(4);
	});
});
