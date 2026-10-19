import { describe, expect, it } from "vitest";
import { answer, filterFor, progress, resultOffers, type Step } from "./check";
import { check, offers } from "./content";

/** Runs a list of answers from question 1 and returns the last step. */
function run(values: string[]): Step {
	let step: Step = { kind: "question", index: 0 };
	for (const value of values) {
		if (step.kind !== "question") throw new Error("answered after a result");
		step = answer(step.index, value);
	}
	return step;
}

const result = (key: string) => ({ kind: "result", result: key });

describe("answer", () => {
	it("ends at once for a Neubau", () => {
		expect(run(["ja"])).toEqual(result("new"));
	});

	it("gives free choice from five flats", () => {
		expect(run(["nein", "g"])).toEqual(result("free"));
	});

	it("gives free choice for a Bauantrag after 1.11.1977", () => {
		expect(run(["nein", "k", "nein"])).toEqual(result("free"));
	});

	it("decides by the WSchV 1977 at the last question", () => {
		expect(run(["nein", "k", "ja", "ja"])).toEqual(result("free"));
		expect(run(["nein", "k", "ja", "nein"])).toEqual(result("must"));
		expect(run(["nein", "k", "ja", "u"])).toEqual(result("maybe"));
	});

	it("moves on otherwise", () => {
		expect(run(["nein"])).toEqual({ kind: "question", index: 1 });
		expect(run(["nein", "k"])).toEqual({ kind: "question", index: 2 });
		expect(run(["nein", "k", "ja"])).toEqual({ kind: "question", index: 3 });
	});

	it("knows every answer of the content", () => {
		const values = check.questions.flatMap((q) =>
			q.answers.map((a) => a.value),
		);
		expect(new Set(values)).toEqual(new Set(["ja", "nein", "k", "g", "u"]));
	});
});

describe("progress", () => {
	it("counts the questions done", () => {
		expect(progress({ kind: "question", index: 0 }, 4)).toBe(0);
		expect(progress({ kind: "question", index: 3 }, 4)).toBe(75);
		expect(progress({ kind: "result", result: "must" }, 4)).toBe(100);
	});
});

describe("resultOffers and filterFor", () => {
	it("lists every offer on free choice", () => {
		expect(resultOffers("free", offers.items)).toHaveLength(4);
		expect(filterFor("free")).toBe("all");
	});

	it("lists the Bedarfsausweise otherwise", () => {
		for (const key of ["new", "must", "maybe"] as const) {
			expect(resultOffers(key, offers.items).map((o) => o.title)).toEqual([
				"Bedarfsausweis",
				"Bedarfsausweis Video",
				"Bedarfsausweis vor Ort",
			]);
			expect(filterFor(key)).toBe("b");
		}
	});
});
