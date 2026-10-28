import { describe, expect, it } from "vitest";
import { topics } from "./content";
import {
	highlight,
	matches,
	normalize,
	readQuery,
	search,
	terms,
} from "./search";

const hits = (text: string, query: string) =>
	highlight(text, terms(query))
		.filter((segment) => segment.hit)
		.map((segment) => segment.text);

describe("normalize and terms", () => {
	it("folds case, diacritics and ß", () => {
		expect(normalize("Läuft Straße ÜBER")).toBe("lauft strasse uber");
	});

	it("ignores one-letter words and duplicates", () => {
		expect(terms("  a uVI z  UVI ")).toEqual(["uvi"]);
	});

	it("reads ?q= trimmed and capped", () => {
		expect(readQuery(new URL("http://x/hilfe"))).toBe("");
		expect(readQuery(new URL("http://x/hilfe?q=%20uvi%20"))).toBe("uvi");
		expect(
			readQuery(new URL(`http://x/hilfe?q=${"a".repeat(300)}`)),
		).toHaveLength(100);
	});
});

describe("search", () => {
	it("finds everything without a query", () => {
		const result = search(topics, " a ");
		expect(result.count).toBe(22);
		expect(result.autoOpen).toBe(false);
	});

	it('finds "läuft" for "lauft"', () => {
		const result = search(topics, "lauft");
		expect([...result.ids]).toEqual(["laufender-vertrag"]);
		expect(result.autoOpen).toBe(true);
	});

	it('finds "Straße" for "strasse"', () => {
		const question = { question: "Wo ist die Straße?", answer: "" };
		expect(matches(question, "", terms("strasse"))).toBe(true);
	});

	it("matches uVI in any case", () => {
		expect(search(topics, "uVI").count).toBe(search(topics, "UVI").count);
		expect(search(topics, "uvi").count).toBeGreaterThan(0);
	});

	it("needs every word to match", () => {
		const both = search(topics, "mieter termin");
		const one = search(topics, "mieter");
		expect(both.count).toBeGreaterThan(0);
		expect(both.count).toBeLessThan(one.count);
	});

	it("counts the topic title", () => {
		const result = search(topics, "für mieter");
		const tenants = topics.find((topic) => topic.id === "mieter")!;
		for (const question of tenants.questions)
			expect(result.ids.has(question.id)).toBe(true);
	});

	it("opens 1–3 results only", () => {
		expect(search(topics, "xyz")).toMatchObject({ count: 0, autoOpen: false });
		expect(search(topics, "uvi").autoOpen).toBe(
			search(topics, "uvi").count <= 3,
		);
	});
});

describe("highlight", () => {
	it("marks a whole word regardless of diacritics", () => {
		expect(hits("Wer kündigt? Kündigung!", "kundigung")).toEqual(["Kündigung"]);
	});

	it("maps positions back after ß → ss", () => {
		expect(hits("Große Straße", "strasse")).toEqual(["Straße"]);
		expect(hits("Große Straße", "grosse")).toEqual(["Große"]);
	});

	it("merges overlapping and adjacent terms", () => {
		expect(hits("Verbrauchsinformation", "verbrauch brauchs info")).toEqual([
			"Verbrauchsinfo",
		]);
	});

	it("marks every occurrence", () => {
		expect(hits("uVI oder UVI", "uvi")).toEqual(["uVI", "UVI"]);
	});

	it("returns the text unmarked without a match or terms", () => {
		expect(highlight("Kündigung", terms("xyz"))).toEqual([
			{ text: "Kündigung", hit: false },
		]);
		expect(highlight("Kündigung", [])).toEqual([
			{ text: "Kündigung", hit: false },
		]);
	});

	it("keeps the text intact", () => {
		const text = "Was ist die unterjährige Verbrauchsinformation (uVI)?";
		const segments = highlight(text, terms("jahrige uvi"));
		expect(segments.map((segment) => segment.text).join("")).toBe(text);
	});
});
