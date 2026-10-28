import { describe, expect, it } from "vitest";
import { hints, metrics } from "./content";
import {
	average,
	deviation,
	filterHints,
	heatColor,
	heatTip,
	HEAT_SCALE,
	ranks,
	scaleMax,
	share,
	signedPercent,
} from "./metrics";

const heat = metrics.heiz.values;

describe("/plattform/auswertung metrics", () => {
	it("averages the heating values to 111", () => {
		expect(average(heat)).toBeCloseTo(111.14, 2);
		expect(average(metrics.ww.values)).toBeCloseTo(13.71, 2);
		expect(average(metrics.kw.values)).toBeCloseTo(31.39, 2);
	});

	it("scales the bars to the maximum with headroom", () => {
		expect(scaleMax(heat, 1.1)).toBeCloseTo(156.2);
		expect(share(78.1, 156.2)).toBeCloseTo(50);
	});

	it("ranks the properties highest first", () => {
		// Bergmannstraße 4 (142) first, Mühlenstraße 18 (88) last.
		expect(ranks(heat)).toEqual([2, 5, 0, 3, 6, 1, 4]);
		expect(ranks([1, 2, 2])).toEqual([2, 0, 1]);
	});

	it("names the deviation with its sign", () => {
		expect(deviation(142, average(heat))).toBe(28);
		expect(deviation(88, average(heat))).toBe(-21);
		expect(signedPercent(28)).toBe("+28 %");
		expect(signedPercent(-21)).toBe("−21 %");
		expect(signedPercent(0)).toBe("±0 %");
	});

	it("colours the heatmap in five steps", () => {
		expect(heatColor(-10)).toBe(HEAT_SCALE[0]);
		expect(heatColor(-9)).toBe(HEAT_SCALE[1]);
		expect(heatColor(-4)).toBe(HEAT_SCALE[1]);
		expect(heatColor(-3)).toBe(HEAT_SCALE[2]);
		expect(heatColor(3)).toBe(HEAT_SCALE[2]);
		expect(heatColor(4)).toBe(HEAT_SCALE[3]);
		expect(heatColor(11)).toBe(HEAT_SCALE[3]);
		expect(heatColor(12)).toBe(HEAT_SCALE[4]);
		expect(heatTip(-4)).toBe("−4 % zum Vorjahr");
		expect(heatTip(7)).toBe("+7 % zum Vorjahr");
	});

	it("filters the notes by kind", () => {
		const count = (f: Parameters<typeof filterHints>[1]) =>
			filterHints(hints.items, f).length;
		expect([count("all"), count("w"), count("h"), count("t")]).toEqual([
			5, 2, 2, 1,
		]);
	});
});
