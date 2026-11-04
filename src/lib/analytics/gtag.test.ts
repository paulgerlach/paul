import { describe, expect, it } from "vitest";
import { isNewPage, isTracked } from "./gtag";

describe("isTracked", () => {
	it("tracks the site's pages", () => {
		for (const path of [
			"/",
			"/blog",
			"/blog/abc",
			"/preise",
			"/self-service",
			"/previewx",
		])
			expect(isTracked(path)).toBe(true);
	});

	it("skips previews and the sales-only result pages", () => {
		for (const path of [
			"/preview",
			"/preview/blog/abc",
			"/self-service-result/abcDEF0123456789abcdef",
		])
			expect(isTracked(path)).toBe(false);
	});
});

describe("isNewPage", () => {
	const url = (path: string) => new URL(path, "https://heidisystems.com");

	it("counts the first page and every other path or query", () => {
		expect(isNewPage(null, url("/"))).toBe(true);
		expect(isNewPage(url("/"), url("/preise"))).toBe(true);
		expect(isNewPage(url("/hilfe"), url("/hilfe?q=frist"))).toBe(true);
	});

	it("skips anchors and reloads of the same URL", () => {
		expect(isNewPage(url("/preise"), url("/preise#anfrage"))).toBe(false);
		expect(isNewPage(url("/preise"), url("/preise"))).toBe(false);
	});
});
