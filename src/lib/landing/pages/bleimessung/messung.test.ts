import { describe, expect, it } from "vitest";
import { answer, progress } from "./check";
import { check, messung } from "./content";
import { daysSinceDeadline, thousands } from "./deadline";
import { pointer, verdict } from "./messung";

describe("the example measurement", () => {
	it("judges a value against both limits", () => {
		expect(verdict(2)).toBe("ok");
		expect(verdict(4.9)).toBe("ok");
		expect(verdict(5)).toBe("warn");
		expect(verdict(7)).toBe("warn");
		expect(verdict(10)).toBe("bad");
		expect(verdict(18)).toBe("bad");
	});

	it("places the pointer on the 0–20 µg/l scale", () => {
		expect(pointer(0)).toBe(0);
		expect(pointer(7)).toBe(35);
		expect(pointer(18)).toBe(90);
		expect(pointer(30)).toBe(100);
	});

	it("has one example per verdict", () => {
		expect(messung.examples.map((e) => verdict(e.value))).toEqual([
			"ok",
			"warn",
			"bad",
		]);
	});
});

describe("the check", () => {
	it("ends early for newer buildings and renewed pipes", () => {
		expect(answer(0, "neu")).toEqual({ kind: "result", result: "new" });
		expect(answer(0, "alt")).toEqual({ kind: "question", index: 1 });
		expect(answer(1, "ja")).toEqual({ kind: "result", result: "renov" });
		expect(answer(1, "nein")).toEqual({ kind: "question", index: 2 });
	});

	it("asks about known lead pipes last", () => {
		expect(answer(2, "ja")).toEqual({ kind: "result", result: "lead" });
		expect(answer(2, "nein")).toEqual({ kind: "result", result: "check" });
	});

	it("has a result for every key and answers for every value", () => {
		const keys = check.results.map((r) => r.key).sort();
		expect(keys).toEqual(["check", "lead", "new", "renov"]);
		for (const [i, q] of check.questions.entries())
			for (const a of q.answers) {
				const step = answer(i, a.value);
				if (step.kind === "result") expect(keys).toContain(step.result);
			}
	});

	it("fills the bar as the design", () => {
		expect(progress({ kind: "question", index: 0 })).toBe(0);
		expect(progress({ kind: "question", index: 2 })).toBe(50);
		expect(progress({ kind: "result", result: "lead" })).toBe(100);
	});
});

describe("the days since the deadline", () => {
	const at = (iso: string) => new Date(iso).getTime();

	it("counts calendar days in Berlin from 12.1.2026", () => {
		expect(daysSinceDeadline(at("2026-01-11T12:00:00+01:00"))).toBe(0);
		expect(daysSinceDeadline(at("2026-01-12T00:30:00+01:00"))).toBe(0);
		expect(daysSinceDeadline(at("2026-01-13T00:30:00+01:00"))).toBe(1);
		expect(daysSinceDeadline(at("2026-11-10T12:00:00+01:00"))).toBe(302);
	});

	it("writes thousands with a dot", () => {
		expect(thousands(1234)).toBe("1.234");
	});
});
