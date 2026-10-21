import { describe, expect, it } from "vitest";
import { REDIRECTS, redirectFor, withQuery } from "./redirects";

describe("redirectFor", () => {
	it("maps every old URL", () => {
		expect(redirectFor("/")).toEqual({
			to: "/messdienstanbieter",
			status: 307,
		});
		expect(redirectFor("/preise")).toEqual({
			to: "/messdienstwechsel#start",
			status: 301,
		});
		expect(redirectFor("/geraete")).toEqual({ to: "/funktionen", status: 301 });
		expect(redirectFor("/kontakt")).toEqual({
			to: "/messdienstwechsel#start",
			status: 301,
		});
		expect(Object.keys(REDIRECTS)).toHaveLength(4);
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
			"/messdienstanbieter",
			"/preise/x",
			"/toString",
			"/constructor",
		])
			expect(redirectFor(path)).toBeNull();
	});
});

describe("withQuery", () => {
	it("keeps the query string before the fragment", () => {
		expect(withQuery("/messdienstwechsel#start", "?x=1")).toBe(
			"/messdienstwechsel?x=1#start",
		);
		expect(withQuery("/funktionen", "?utm_source=a&b=2")).toBe(
			"/funktionen?utm_source=a&b=2",
		);
	});

	it("adds nothing without a query string", () => {
		expect(withQuery("/messdienstwechsel#start", "")).toBe(
			"/messdienstwechsel#start",
		);
	});
});
