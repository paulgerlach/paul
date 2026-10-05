/**
 * Every city page (and the Germany page) must be a standalone landing page
 * with its own title, description, H1, local introduction and internal
 * links (plan: new-landing-page-plan, README core requirement and §6.2).
 */
import { describe, expect, it } from "vitest";
import germany from "$lib/landing/pages/messdienstanbieter/content";
import germanyData from "$lib/landing/pages/messdienstanbieter/germany-map";
import {
	cityHint,
	FALLBACK_HINTS,
	germanList,
	germanyMap,
} from "$lib/landing/pages/messdienstanbieter/map";
import {
	districtId,
	type RegionContent,
} from "$lib/landing/sections/region/types";
import { CITIES, isCitySlug, LIVE_CITIES } from "./index";

const modules = import.meta.glob<{ default: RegionContent }>(
	["./*.ts", "!./index.ts", "!./*-map.ts", "!./*.test.ts"],
	{ eager: true },
);
const bySlug = Object.fromEntries(
	Object.entries(modules).map(([path, m]) => [
		path.replace(/^\.\/(.+)\.ts$/, "$1"),
		m.default,
	]),
);
const cities = CITIES.map((c) => ({ entry: c, content: bySlug[c.slug] }));
const pages: [string, RegionContent][] = [
	...cities.map((c): [string, RegionContent] => [c.entry.slug, c.content]),
	["germany", germany],
];

/**
 * Design ledes that name neither the city nor one of its map districts: a
 * Stadtteil that isn't on the map, or no place at all. For the content owner
 * to confirm or rewrite (go-live gate, plan §6.4).
 */
const LEDE_WITHOUT_MAP_PLACE = [
	"berlin",
	"muenchen",
	"koeln",
	"frankfurt",
	"duesseldorf",
	"hannover",
];

describe("city index", () => {
	it("has a content module for every city, and no module without one", () => {
		for (const { entry, content } of cities) {
			expect(content, entry.slug).toBeDefined();
			expect(content.slug).toBe(entry.slug);
			expect(content.name).toBe(entry.name);
		}
		expect(Object.keys(bySlug).sort()).toEqual(
			CITIES.map((c) => c.slug).sort(),
		);
	});

	it("uses ASCII slugs", () => {
		for (const c of CITIES) expect(c.slug).toMatch(/^[a-z]+$/);
		expect(isCitySlug("berlin")).toBe(true);
		expect(isCitySlug("hamburg")).toBe(false);
	});
});

describe.each(pages)("%s", (slug, page) => {
	const place = slug === "germany" ? "Deutschland" : page.name;

	it("has its own SEO title and description", () => {
		expect(page.seo.title.length).toBeGreaterThanOrEqual(30);
		expect(page.seo.title.length).toBeLessThanOrEqual(60);
		expect(page.seo.title).toContain(place);
		expect(page.seo.description.length).toBeGreaterThanOrEqual(120);
		expect(page.seo.description.length).toBeLessThanOrEqual(160);
		expect(page.seo.description).toContain(place);
		expect(page.seo.ogTitle).toBe(page.hero.title);
	});

	it("names its place in the H1 and the lede", () => {
		expect(page.hero.title).toContain(place);
		if (LEDE_WITHOUT_MAP_PLACE.includes(slug)) return;
		const places =
			slug === "germany"
				? CITIES.map((c) => c.name)
				: [page.name, ...page.map.districts.map((d) => d.name)];
		expect(places.some((p) => page.hero.lede.includes(p))).toBe(true);
	});

	it("links to 2–4 other existing cities (none on the Germany page)", () => {
		const { nearby } = page.links;
		if (slug === "germany") return expect(nearby).toEqual([]);
		expect(nearby.length).toBeGreaterThanOrEqual(2);
		expect(nearby.length).toBeLessThanOrEqual(4);
		expect(new Set(nearby).size).toBe(nearby.length);
		for (const n of nearby) {
			expect(isCitySlug(n)).toBe(true);
			expect(n).not.toBe(slug);
		}
	});

	it("has a consistent map", () => {
		const ids = page.map.districts.map(districtId);
		expect(new Set(ids).size).toBe(ids.length);
		expect(ids).toContain(page.map.defaultDistrict);
		for (const d of page.map.districts) {
			expect(d.stock, d.name).not.toBe("");
			expect(d.hint, d.name).not.toBe("");
		}
		expect(page.map.viewBox).toMatch(/^-?[\d.]+ -?[\d.]+ [\d.]+ [\d.]+$/);
	});

	it("has 5 FAQ items, the last linking to the prices", () => {
		expect(page.faq).toHaveLength(5);
		expect(page.faq[4].answer).toContain('<a href="/preise">');
	});

	it("shows 12 different customer logos", () => {
		expect(new Set(page.logoStrip.logos).size).toBe(12);
	});
});

describe("pages are not copies of each other", () => {
	const unique = (pick: (p: RegionContent) => string) => {
		const values = pages.map(([, p]) => pick(p));
		expect(new Set(values).size).toBe(values.length);
	};
	// The designs reuse some section intros between cities (the AllInOne and
	// NoWait texts, for example); these are the ones each design writes anew.
	it("has unique titles, descriptions, H1s and ledes", () => {
		unique((p) => p.seo.title);
		unique((p) => p.seo.description);
		unique((p) => p.hero.title);
		unique((p) => p.hero.lede);
	});
	it("has unique map headlines, service intros and final CTAs", () => {
		unique((p) => p.map.title);
		unique((p) => p.service.text);
		unique((p) => p.final.title);
		unique((p) => p.faq[4].answer);
	});
});

describe("Germany map", () => {
	const berlin = CITIES.find((c) => c.slug === "berlin")!;
	const leipzig = CITIES.find((c) => c.slug === "leipzig")!;
	const dresden = CITIES.find((c) => c.slug === "dresden")!;

	it("joins names the German way", () => {
		expect(germanList(["A"])).toBe("A");
		expect(germanList(["A", "B"])).toBe("A und B");
		expect(germanList(["A", "B", "C"])).toBe("A, B und C");
	});

	it("builds the state hints from the given cities", () => {
		expect(cityHint("Berlin", [berlin], "Unser Team sitzt hier.")).toBe(
			"Eigene Seite: Berlin. Unser Team sitzt hier.",
		);
		expect(cityHint("Sachsen", [leipzig, dresden])).toBe(
			"Eigene Seiten: Leipzig und Dresden.",
		);
		expect(cityHint("Sachsen", [berlin])).toBeUndefined();
	});

	it("has a dot position for every city and a fallback for every city state", () => {
		for (const c of CITIES)
			expect(germanyData.cityDots[c.slug], c.slug).toBeDefined();
		for (const s of germanyData.states)
			if ("cityHint" in s) expect(FALLBACK_HINTS[s.name], s.name).toBeTruthy();
	});

	it("links only to live cities", () => {
		const map = germanyMap(germanyData);
		const links = map.districts.filter((d) => d.href).map((d) => d.href);
		expect(links).toEqual(
			LIVE_CITIES.filter((c) => germanyData.cityDots[c.slug]).map(
				(c) => `/messdienstanbieter/${c.slug}`,
			),
		);
	});

	it("lists all of a state's cities once they're live", () => {
		const map = germanyMap(germanyData, CITIES);
		const nrw = map.districts.find((d) => d.name === "Nordrhein-Westfalen")!;
		expect(nrw.hint).toBe(
			"Eigene Seiten: Köln, Düsseldorf, Dortmund, Essen, Duisburg, Bochum, Wuppertal, Bielefeld, Bonn und Mönchengladbach.",
		);
		expect(map.districts.filter((d) => d.href)).toHaveLength(CITIES.length);
	});
});
