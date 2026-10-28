import { describe, expect, it } from "vitest";
import { matchesCity, normalize } from "./search";

describe("normalize", () => {
	it("lowercases and spells umlauts out", () => {
		expect(normalize("Düsseldorf")).toBe("duesseldorf");
		expect(normalize("MÖNCHENGLADBACH")).toBe("moenchengladbach");
		expect(normalize("Straße")).toBe("strasse");
	});
});

describe("matchesCity", () => {
	it("matches every name for an empty or blank query", () => {
		expect(matchesCity("Berlin", "")).toBe(true);
		expect(matchesCity("Berlin", "   ")).toBe(true);
	});

	it("matches a part of the name in any case", () => {
		expect(matchesCity("Frankfurt", "furt")).toBe(true);
		expect(matchesCity("Frankfurt", "FRANK")).toBe(true);
		expect(matchesCity("Frankfurt", "Berlin")).toBe(false);
	});

	it("finds umlaut names with or without the umlaut", () => {
		expect(matchesCity("München", "münchen")).toBe(true);
		expect(matchesCity("München", "muenchen")).toBe(true);
		expect(matchesCity("Köln", " koeln ")).toBe(true);
	});
});
