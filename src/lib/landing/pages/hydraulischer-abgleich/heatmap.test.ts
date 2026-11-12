import { describe, expect, it } from "vitest";
import { answer, progress } from "./check";
import { check } from "./content";
import { daysUntilInspection, thousands } from "./deadline";
import {
	AFTER,
	BEFORE,
	color,
	de1,
	flowOpacity,
	LOADS,
	PRESETS,
	spread,
	tone,
} from "./heatmap";

describe("the heat map", () => {
	it("colours the rooms as the design", () => {
		expect(color(16)).toBe("rgb(111,168,214)");
		expect(color(21)).toBe("rgb(138,214,143)");
		expect(color(30)).toBe("rgb(232,135,90)");
		expect(color(19)).toBe("rgb(125,191,179)");
	});

	it("has five floors in every list", () => {
		for (const list of [
			BEFORE.temps,
			BEFORE.flows,
			AFTER.temps,
			AFTER.flows,
			LOADS,
			PRESETS,
		])
			expect(list).toHaveLength(5);
	});

	it("gives the spread and the tones", () => {
		expect(de1(spread(BEFORE.temps))).toBe("6,6");
		expect(de1(spread(AFTER.temps))).toBe("0,2");
		expect(BEFORE.temps.map(tone)).toEqual(["cold", "cold", "", "", "hot"]);
		expect(AFTER.temps.map(tone)).toEqual(["", "", "", "", ""]);
		expect(flowOpacity(2)).toBe(1);
		expect(flowOpacity(0.5)).toBeCloseTo(0.55);
	});
});

describe("the check", () => {
	it("ends early on the exemptions", () => {
		expect(answer(0, "alt")).toEqual({ kind: "result", result: "old" });
		expect(answer(1, "k")).toEqual({ kind: "result", result: "small" });
		expect(answer(2, "nein")).toEqual({ kind: "result", result: "nowater" });
	});

	it("leads to the duty", () => {
		expect(answer(0, "ja")).toEqual({ kind: "question", index: 1 });
		expect(answer(1, "g")).toEqual({ kind: "question", index: 2 });
		expect(answer(2, "ja")).toEqual({ kind: "result", result: "must" });
	});

	it("knows every result and answer", () => {
		const keys = check.results.map((r) => r.key);
		check.questions.forEach((q, i) =>
			q.answers.forEach((a) => {
				const step = answer(i, a.value);
				if (step.kind === "result") expect(keys).toContain(step.result);
			}),
		);
	});

	it("fills the bar as the design", () => {
		expect(progress({ kind: "question", index: 0 })).toBe(0);
		expect(progress({ kind: "question", index: 2 })).toBe(50);
		expect(progress({ kind: "result", result: "must" })).toBe(100);
	});
});

describe("the § 60b countdown", () => {
	it("counts calendar days in Berlin and stops at 0", () => {
		// 23:30 UTC on 10.11.2026 is 00:30 on 11.11. in Berlin.
		expect(daysUntilInspection(Date.UTC(2026, 10, 10, 23, 30))).toBe(323);
		expect(daysUntilInspection(Date.UTC(2026, 10, 10, 12))).toBe(324);
		expect(daysUntilInspection(Date.UTC(2027, 8, 30, 12))).toBe(0);
		expect(daysUntilInspection(Date.UTC(2028, 0, 1))).toBe(0);
	});

	it("writes thousands with a dot", () => {
		expect(thousands(1234)).toBe("1.234");
		expect(thousands(324)).toBe("324");
	});
});
