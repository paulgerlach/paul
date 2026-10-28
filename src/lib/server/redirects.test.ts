import { describe, expect, it } from "vitest";
import { REDIRECTS, redirectFor, withQuery } from "./redirects";

describe("redirectFor", () => {
	it("redirects no old URL: each is a page again", () => {
		expect(Object.keys(REDIRECTS)).toHaveLength(0);
		for (const path of ["/preise", "/geraete", "/datenschutzhinweise"])
			expect(redirectFor(path)).toBeNull();
	});

	it("leaves every other path alone", () => {
		for (const path of [
			"/blog",
			"/preview",
			"/preview/blog/x",
			"/",
			"/kontakt",
			"/preise/",
			"/toString",
			"/constructor",
		])
			expect(redirectFor(path)).toBeNull();
	});
});

describe("withQuery", () => {
	it("keeps the query string before the fragment", () => {
		expect(withQuery("/messdienst-wechseln#start", "?x=1")).toBe(
			"/messdienst-wechseln?x=1#start",
		);
		expect(withQuery("/funktionen", "?utm_source=a&b=2")).toBe(
			"/funktionen?utm_source=a&b=2",
		);
	});

	it("adds nothing without a query string", () => {
		expect(withQuery("/messdienst-wechseln#start", "")).toBe(
			"/messdienst-wechseln#start",
		);
	});
});
