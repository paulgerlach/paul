import { describe, expect, it } from "vitest";
import { isGibberish } from "./contact";

describe("isGibberish", () => {
	it.each(["wyichtvxKjBGMhTz", "mKfLTlwpwMchpAQpq", "xkcd qwrtz pfvbn"])(
		"flags %s",
		(text) => expect(isGibberish(text)).toBe(true),
	);

	it("flags long text without spaces even with vowels", () => {
		expect(isGibberish("HalloIchHabeEineFrageZuIhrem")).toBe(true);
	});

	it.each([
		"Max Mustermann",
		"Jürgen Müller",
		"Guten Tag, ich hätte gerne ein Angebot für 12 Wohnungen.",
		"François Dubois",
	])("accepts %s", (text) => expect(isGibberish(text)).toBe(false));

	it("doesn't judge text with fewer than 5 letters", () => {
		expect(isGibberish("Xkcd")).toBe(false);
		expect(isGibberish("12345 !!")).toBe(false);
	});
});
