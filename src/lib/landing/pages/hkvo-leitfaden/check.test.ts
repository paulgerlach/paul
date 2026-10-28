import { describe, expect, it } from "vitest";
import { type Answers, openText, outcome, ringDash, score } from "./check";
import { check } from "./content";

const qs = check.questions;
const allYes: Answers = {
	erf: true,
	fern: true,
	uvi: true,
	vert: true,
	frist: true,
};

describe("score", () => {
	it("counts the Ja answers", () => {
		expect(score({})).toBe(0);
		expect(score({ erf: true, fern: false, uvi: true })).toBe(2);
		expect(score(allYes)).toBe(5);
	});
});

describe("outcome", () => {
	it("asks for answers while nothing is answered", () => {
		expect(outcome(qs, {})).toEqual({ kind: "hint" });
	});

	it("shows the risks as soon as one answer is Nein", () => {
		expect(outcome(qs, { fern: false })).toEqual({
			kind: "risks",
			risks: [{ risk: "Ab 2027: Kürzungsrecht 3 %", law: "§ 5" }],
		});
	});

	it("lists the risks in question order, also with open questions", () => {
		const result = outcome(qs, { frist: false, erf: false, uvi: true });
		expect(result).toEqual({
			kind: "risks",
			risks: [
				{ risk: "Kürzungsrecht bis 15 %", law: "§ 4" },
				{ risk: "Nachzahlung entfällt", law: "§ 556 BGB" },
			],
		});
	});

	it("counts the open questions while every answer is Ja", () => {
		expect(outcome(qs, { erf: true })).toEqual({ kind: "open", left: 4 });
		expect(outcome(qs, { ...allYes, vert: undefined })).toEqual({
			kind: "open",
			left: 1,
		});
	});

	it("is ok when all five are Ja", () => {
		expect(outcome(qs, allYes)).toEqual({ kind: "ok" });
	});
});

describe("ringDash", () => {
	it("fills a fifth per Ja", () => {
		expect(ringDash(0, 5)).toBe("0 100");
		expect(ringDash(2, 5)).toBe("40 100");
		expect(ringDash(5, 5)).toBe("100 100");
		expect(ringDash(0, 0)).toBe("0 100");
	});
});

describe("openText", () => {
	it("uses the singular for one question", () => {
		expect(openText(1)).toBe("Noch 1 Frage offen.");
		expect(openText(4)).toBe("Noch 4 Fragen offen.");
	});
});
