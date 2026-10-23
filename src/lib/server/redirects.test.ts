import { describe, expect, it } from "vitest";
import { REDIRECTS, redirectFor, withQuery } from "./redirects";

describe("redirectFor", () => {
	it("maps every old URL", () => {
		expect(redirectFor("/preise")).toEqual({
			to: "/messdienst-wechseln#start",
			status: 301,
		});
		expect(redirectFor("/geraete")).toEqual({
			to: "/funkzaehler",
			status: 301,
		});
		expect(redirectFor("/datenschutzhinweise")).toEqual({
			to: "/datenschutz",
			status: 301,
		});
		expect(Object.keys(REDIRECTS)).toHaveLength(3);
	});

	it("ignores one trailing slash", () => {
		expect(redirectFor("/preise/")).toEqual(REDIRECTS["/preise"]);
		expect(redirectFor("/preise//")).toBeNull();
	});

	it("leaves every other path alone", () => {
		for (const path of [
			"/blog",
			"/preview",
			"/preview/blog/x",
			// The home page (the Germany hub) since the new URLs
			"/",
			// A page again (2026-10-21), no longer redirected
			"/kontakt",
			"/preise/x",
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
