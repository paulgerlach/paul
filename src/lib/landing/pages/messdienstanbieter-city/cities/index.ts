/**
 * The city pages at /messdienstanbieter/<slug>, in the designs' footer order.
 * Tiny on purpose: the `city` param matcher bundles it into the client router.
 * The sitemap, the footer "Städte" group and the Germany map read it too.
 *
 * Adding a city = an entry here + `<slug>.ts` and `<slug>-map.ts` next to it
 * + its photos (plan, phase 7). A city with `live: false` renders with
 * `noindex` for review and is left out of the sitemap, footer and map.
 */
export type CityEntry = {
	slug: string;
	name: string;
	/** Bundesland, for the Germany map. */
	state: string;
	live: boolean;
};

export const CITIES = [] as const satisfies readonly CityEntry[];

export type CitySlug = (typeof CITIES)[number]["slug"];

export const isCitySlug = (s: string): s is CitySlug =>
	CITIES.some((c: CityEntry) => c.slug === s);

export const LIVE_CITIES: readonly CityEntry[] = CITIES.filter(
	(c: CityEntry) => c.live,
);
