import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import * as company from "$lib/company";
import * as footerLinks from "$lib/landing/footerLinks";
import * as navLinks from "$lib/landing/navLinks";
import { CITIES } from "$lib/landing/pages/messdienstanbieter-city/cities";
import * as routes from "$lib/routes";
import { REDIRECTS } from "$lib/server/redirects";

// Every href in the landing link data and the pages' content. None may point
// at a page the site cutover removed (they only redirect) or at a route that
// doesn't exist.

const contents = import.meta.glob("/src/lib/landing/pages/*/content.ts", {
	eager: true,
});

/** Values of `href` / `…Href` keys, and `<a href>` inside strings. */
function collect(
	value: unknown,
	out: string[],
	key = "",
	seen = new Set<unknown>(),
) {
	if (typeof value === "string") {
		if (/href$/i.test(key)) out.push(value);
		for (const m of value.matchAll(/href="([^"]*)"/g)) out.push(m[1]);
		return;
	}
	if (!value || typeof value !== "object" || seen.has(value)) return;
	seen.add(value);
	for (const [k, v] of Object.entries(value))
		collect(v, out, Array.isArray(value) ? key : k, seen);
}

const sources: Record<string, unknown> = {
	"navLinks.ts": navLinks,
	"footerLinks.ts": footerLinks,
	"company.ts": company,
	...contents,
};

const pages = new Set([
	...Object.values(routes).filter((v) => typeof v === "string"),
	...CITIES.map((c) => routes.cityRoute(c.slug)),
]);
const redirected = new Set(Object.keys(REDIRECTS));

function problem(href: string): string | null {
	if (!href.startsWith("/")) return null; // anchors, mailto:, https://…
	const path = href.split(/[?#]/)[0];
	if (redirected.has(path)) return "a removed page";
	if (pages.has(path) || path.startsWith(`${routes.ROUTE_BLOG}/`)) return null;
	if (existsSync(`static${path}`)) return null;
	return "no such route";
}

describe("internal links", () => {
	it("finds the hrefs", () => {
		const all: string[] = [];
		collect(sources, all);
		expect(all.length).toBeGreaterThan(200);
		expect(Object.keys(contents).length).toBeGreaterThan(30);
	});

	for (const [name, source] of Object.entries(sources))
		it(`${name} links only existing pages`, () => {
			const hrefs: string[] = [];
			collect(source, hrefs);
			const bad = hrefs
				.map((href) => [href, problem(href)])
				.filter(([, why]) => why);
			expect(bad).toEqual([]);
		});
});
