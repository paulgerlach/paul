import { describe, expect, it } from "vitest";
import { DOCUMENTS, METERS, OBJECTS, PERIODS } from "./data";
import {
	chartValues,
	co2,
	describeChart,
	documentsFor,
	metersFor,
	perObject,
	pointLabel,
	series,
	tileSummary,
	typeCounts,
	type ChartState,
} from "./model";

const state = (over: Partial<ChartState> = {}): ChartState => ({
	scope: null,
	period: PERIODS[0],
	granularity: "m",
	objects: OBJECTS,
	...over,
});

describe("dashboard preview model", () => {
	it("counts the devices of the whole portfolio and of one object", () => {
		expect(typeCounts(OBJECTS, null)).toEqual({
			hkv: 740,
			ww: 370,
			kw: 370,
			wmz: 7,
		});
		expect(typeCounts(OBJECTS, "gw")).toEqual({
			hkv: 24,
			ww: 12,
			kw: 12,
			wmz: 1,
		});
	});

	it("slices the series to the period", () => {
		expect(series("kalt", state()).values).toHaveLength(10);
		expect(series("kalt", state({ period: PERIODS[1] })).labels).toEqual([
			"Jul",
			"Aug",
			"Sep",
		]);
		expect(series("kalt", state({ period: PERIODS[2] })).values).toHaveLength(
			12,
		);
	});

	it("scales a scoped series down to the object's share", () => {
		const all = series("warm", state()).values[0];
		const one = series("warm", state({ scope: "gw" })).values[0];
		expect(one).toBeLessThan(all / 10);
	});

	it("spreads to weeks and days", () => {
		expect(chartValues("kalt", state({ granularity: "w" }))).toHaveLength(40);
		expect(chartValues("kalt", state({ granularity: "d" }))).toHaveLength(70);
	});

	it("gives the CO₂ per period", () => {
		expect(co2(state()).value).toBe(11.3);
		expect(co2(state({ period: PERIODS[2] }))).toEqual({
			value: 13.9,
			sub: "im Jahr 2025",
		});
	});

	it("lists the five largest objects, or the floors of one", () => {
		const all = perObject(state());
		expect(all.rows.map((r) => r.name).slice(0, 2)).toEqual([
			"Wohnpark Am Kanal",
			"Schillerhöfe",
		]);
		expect(all.rows.every((r) => r.object)).toBe(true);
		const one = perObject(state({ scope: "gw" }));
		expect(one.title).toBe("Verbrauch pro Wohneinheit");
		expect(one.rows[0].name).toBe("EG li. Gartenweg");
	});

	it("names points per granularity", () => {
		expect(pointLabel(2, ["Jan", "Feb", "Mär"], state())).toBe("Mär 2026");
		expect(
			pointLabel(0, ["Jul"], state({ granularity: "w", period: PERIODS[1] })),
		).toBe("KW 27");
		expect(pointLabel(8, ["Jan", "Feb"], state({ granularity: "d" }))).toBe(
			"Feb, Tag 2",
		);
	});

	it("summarises a tile with the change to the year before", () => {
		const summary = tileSummary("kalt", state());
		expect(summary.sum).toBe(1760);
		expect(summary.mean).toBe(176);
		expect(summary.delta).toBeCloseTo(((1760 - 1643) / 1643) * 100, 6);
		expect(tileSummary("kalt", state({ period: PERIODS[2] })).delta).toBeNull();
	});

	it("filters meters and documents", () => {
		expect(metersFor(METERS, OBJECTS, "wmz", null, "")).toHaveLength(7);
		expect(metersFor(METERS, OBJECTS, "all", "gw", "")).toHaveLength(33);
		expect(metersFor(METERS, OBJECTS, "all", null, "garten").length).toBe(33);
		expect(documentsFor(DOCUMENTS, "uvi", null)).toHaveLength(2);
		expect(documentsFor(DOCUMENTS, "all", "bm")).toHaveLength(1);
	});

	it("describes a chart", () => {
		expect(
			describeChart("Kaltwasser", "m³", [28, 284], ["Jan", "Okt"], state()),
		).toBe(
			"Kaltwasser, Jan bis Okt 2026, monatlich: 28 bis 284 m³, zuletzt 284 m³",
		);
	});
});
