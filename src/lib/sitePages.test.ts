import { describe, expect, it } from "vitest";
import { SITE_PAGES } from "./sitePages";

// Every page route under (base) is in SITE_PAGES once, so a new page can't be
// left out of the sitemap. Not in it on purpose: the city pages (LIVE_CITIES),
// the blog posts (Prismic) and /fragebogen (noindex, KI-38).
const NOT_LISTED = ["/messdienst/[city=city]", "/blog/[uid]", "/fragebogen"];

// "(base)" can't be in the pattern: parentheses are glob syntax.
const routes = Object.keys(import.meta.glob("/src/routes/**/+page.svelte"))
	.filter((file) => file.startsWith("/src/routes/(base)/"))
	.map(
		(file) =>
			file
				.replace(/^\/src\/routes/, "")
				.replace(/\/\+page\.svelte$/, "")
				// Route groups and the optional preview segment aren't in the URL.
				.replace(/\/\([^)]+\)|\/\[\[[^\]]+\]\]/g, "") || "/",
	);

describe("SITE_PAGES", () => {
	it("lists every page route once", () => {
		const paths = SITE_PAGES.map((p) => p.path);
		expect(new Set(paths).size).toBe(paths.length);
		expect([...paths, ...NOT_LISTED].sort()).toEqual([...routes].sort());
	});

	it("keeps only the pages that are live today ungated", () => {
		expect(SITE_PAGES.filter((p) => !p.gated).map((p) => p.path)).toEqual([
			"/",
			"/messdienst-wechseln",
			"/funktionen",
			"/preise",
			"/blog",
			"/impressum",
			"/datenschutzhinweise",
		]);
	});
});
