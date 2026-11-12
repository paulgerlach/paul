import { describe, expect, it } from "vitest";
import { barWidth, PIPE_LENGTHS, SAMPLES, verdict } from "./befund";
import { answer, progress } from "./check";
import { check } from "./content";

describe("the Prüfpflicht-Check", () => {
	it("ends early on the exemptions", () => {
		expect(answer(0, "nein")).toEqual({ kind: "result", result: "dez" });
		expect(answer(1, "k")).toEqual({ kind: "result", result: "efh" });
		expect(answer(2, "nein")).toEqual({ kind: "result", result: "self" });
		expect(answer(3, "nein")).toEqual({ kind: "result", result: "nodu" });
	});

	it("moves on otherwise", () => {
		expect(answer(0, "ja")).toEqual({ kind: "question", index: 1 });
		expect(answer(1, "g")).toEqual({ kind: "question", index: 2 });
		expect(answer(2, "ja")).toEqual({ kind: "question", index: 3 });
		expect(answer(3, "ja")).toEqual({ kind: "question", index: 4 });
	});

	it("decides on the last question", () => {
		expect(answer(4, "ja")).toEqual({ kind: "result", result: "must" });
		expect(answer(4, "u")).toEqual({ kind: "result", result: "maybe" });
		expect(answer(4, "nein")).toEqual({ kind: "result", result: "small" });
	});

	it("has a result for every outcome and every answer's value", () => {
		const keys = check.results.map((r) => r.key);
		for (const r of ["must", "maybe", "small", "dez", "efh", "self", "nodu"])
			expect(keys).toContain(r);
		check.questions.forEach((q, i) => {
			for (const a of q.answers) {
				const step = answer(i, a.value);
				if (step.kind === "result") expect(keys).toContain(step.result);
			}
		});
	});

	it("fills the bar per question and at the result", () => {
		expect(progress({ kind: "question", index: 0 }, 5)).toBe(0);
		expect(progress({ kind: "question", index: 2 }, 5)).toBe(40);
		expect(progress({ kind: "result", result: "must" }, 5)).toBe(100);
	});
});

describe("the example lab result", () => {
	it("has one value per sampling point", () => {
		expect(SAMPLES.ok).toHaveLength(4);
		expect(SAMPLES.tmw).toHaveLength(4);
		expect(PIPE_LENGTHS).toHaveLength(4);
	});

	it("flags the threshold", () => {
		expect(verdict(SAMPLES.ok)).toBe("ok");
		expect(verdict(SAMPLES.tmw)).toBe("bad");
		expect(verdict([100])).toBe("bad");
		expect(verdict([99])).toBe("ok");
	});

	it("caps the bars", () => {
		expect(barWidth(40)).toBe(20);
		expect(barWidth(230)).toBe(100);
	});
});
