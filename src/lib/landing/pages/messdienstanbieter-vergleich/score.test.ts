import { describe, expect, it } from "vitest";
import { type Answer, gaps, tally, toggle, verdict } from "./score";

const none: Answer[] = Array(8).fill(null);
const all = (a: Answer): Answer[] => Array(8).fill(a);

describe("the score", () => {
	it("picks an answer and clears it on a second click", () => {
		expect(toggle(null, "y")).toBe("y");
		expect(toggle("y", "y")).toBeNull();
		expect(toggle("y", "n")).toBe("n");
	});

	it("counts the answers", () => {
		expect(tally(["y", "y", "n", "u", null, null, null, null])).toEqual({
			yes: 2,
			no: 1,
			unsure: 1,
			answered: 4,
		});
	});

	it("has the design's verdicts", () => {
		expect(verdict(none)).toBe(
			"Kreuzen Sie links an, was Ihr Anbieter heute leistet.",
		);
		expect(verdict(["y", "y", "y", "y", "y", "y", "y", null])).toBe(
			"1 Kriterium noch offen.",
		);
		expect(verdict(["y", "n", "u", "y", "y", null, null, null])).toBe(
			"3 Kriterien noch offen.",
		);
		expect(verdict(all("y"))).toBe(
			"Ihr Anbieter erfüllt alle acht Kriterien. Dann lohnt der Blick auf die Kosten pro Wohnung.",
		);
		expect(verdict(["y", "y", "y", "y", "y", "y", "y", "n"])).toBe(
			"Heidi liegt bei 1 Kriterium vorn.",
		);
		expect(verdict(["y", "n", "u", "y", "y", "n", "u", "n"])).toBe(
			"Heidi liegt bei 5 Kriterien vorn.",
		);
		expect(verdict(all("u"))).toBe("Heidi liegt bei 8 Kriterien vorn.");
	});

	it("lists every Nein and ? in order, marking the unclear ones", () => {
		expect(gaps(none)).toEqual([]);
		expect(gaps(["y", "u", null, "n", "y", "n", null, "u"])).toEqual([
			{ index: 1, unsure: true },
			{ index: 3, unsure: false },
			{ index: 5, unsure: false },
			{ index: 7, unsure: true },
		]);
	});
});
