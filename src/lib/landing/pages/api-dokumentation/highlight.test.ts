import { describe, expect, it } from "vitest";
import { consumption, quickStart } from "./content";
import { jsonTokens } from "./highlight";

const answer = consumption.endpoints[0].answer!.code;
const join = (code: string) =>
	jsonTokens(code)
		.map((t) => t.text)
		.join("");
const marked = (code: string, kind: "k" | "s") =>
	jsonTokens(code)
		.filter((t) => t.kind === kind)
		.map((t) => t.text);

describe("jsonTokens", () => {
	it("joins back to the code", () => {
		expect(join(answer)).toBe(answer);
		expect(join(quickStart.sample.code)).toBe(quickStart.sample.code);
		expect(join('{ "a": "b", "c": [ "d" ] }')).toBe(
			'{ "a": "b", "c": [ "d" ] }',
		);
	});

	it("marks the answer's keys and string values", () => {
		expect(marked(answer, "k")).toEqual([
			'"billingunit"',
			'"reference"',
			'"mscnumber"',
			'"pmnumber"',
			'"periods"',
			'"period"',
			'"update"',
		]);
		expect(marked(answer, "s")).toEqual([
			'"123456789"',
			'"XY-12345-00"',
			'"2021-06"',
			'"2022-05-09T09:04:55.772Z"',
		]);
	});

	it("leaves keys of objects and arrays and strings in arrays as they are", () => {
		expect(jsonTokens('{ "a": { "b": [ "c" ] } }')).toEqual([
			{ text: "{ " },
			{ text: '"a"', kind: "k" },
			{ text: ": { " },
			{ text: '"b"', kind: "k" },
			{ text: ': [ "c" ] } }' },
		]);
	});

	it("doesn't colour code that isn't JSON", () => {
		expect(jsonTokens(quickStart.sample.code)).toEqual([
			{ text: quickStart.sample.code },
		]);
		expect(jsonTokens('"a": "b"')).toEqual([{ text: '"a": "b"' }]);
	});
});
