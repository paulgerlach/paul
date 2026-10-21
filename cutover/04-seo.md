# Phase 4: SEO

Sitemap, robots, the defaults and the home JSON-LD for the new site, plus one switch for the go-live indexing so the cutover's last step is a one-line change.

## Today

- Indexed and in the sitemap: `/funktionen`, `/messdienstwechsel`, `/messdienstanbieter`, the `live: true` cities (Berlin), and the old pages (`/`, `/preise`, `/geraete`, `/kontakt`, `/blog` + posts, `/impressum`, `/datenschutzhinweise`).
- Every other landing page and city: `noindex` (each page's `+page.server.ts` returns `seo: { noindex: true, … }`; 36 pages) and out of the sitemap, until its go-live gate (`ongoing-tasks/go-live-gates.md`). The decision of 2026-10-17: at the cutover every page is indexed.
- `$lib/components/Home/structuredData.ts`: the home's Organization + LocalBusiness JSON-LD, with the placeholder phone (KI-34).

## Steps

- [ ] **4.1 One indexing switch.** Add `src/lib/landing/launch.ts`:
  ```ts
  /**
   * False until the cutover: the pages behind a go-live gate render noindex and
   * stay out of the sitemap. Set to true as the last cutover step
   * (ongoing-tasks/cutover.md §3), once every gate in go-live-gates.md is done.
   */
  export const LAUNCHED = false;
  ```
  Replace each page's `noindex: true` with `noindex: !LAUNCHED` (36 `+page.server.ts` files; check each one's `seo` object, a few also set `keepCanonical`). The cities: `cities/index.ts` derives `LIVE_CITIES` from `live` flags; make it `LAUNCHED || city.live` so the switch also covers them, and keep the per-city flags for now (Berlin). Don't flip `LAUNCHED` in this work.
- [ ] **4.2 A list of the site's pages.** Add `SITE_PAGES` (path, `changefreq`, `priority`, `gated: boolean`) next to the `ROUTE_*` constants or in `sitemap.xml/+server.ts`. Every route under `(base)` must be in it once (phase 6 adds a test that compares it with the route folders, so a new landing page can't be forgotten). Priorities: `/messdienstanbieter` 1.0, `/messdienstwechsel` and `/funktionen` 0.9, the other product/segment pages 0.8, resources 0.7, cities 0.8, `/blog` 0.7, posts 0.6, company/partner pages 0.6, `/impressum` and `/datenschutzhinweise` 0.3. `/fragebogen` isn't in it (disallowed in robots).
- [ ] **4.3 `sitemap.xml/+server.ts`**: drop `""`, `/preise`, `/geraete`, `/kontakt`; list `SITE_PAGES` filtered by `!gated || LAUNCHED`, the cities from `LIVE_CITIES`, the blog posts as today. Before the launch the output is today's minus the four dropped URLs; after the launch it lists everything. Update `e2e/foundation.e2e.ts`'s sitemap test (it checks `/preise`) in phase 6.
- [ ] **4.4 `robots.txt`**: unchanged rules (`/api/`, `/fragebogen`, `/preview/`, `/slice-simulator`). Nothing to disallow for the dropped pages: they redirect.
- [ ] **4.5 Home JSON-LD.** It lived only on the old home. Move the Organization block to `/messdienstanbieter` (the new home), rendered the way the region pages render `ServiceJsonLd` (`$lib/landing/sections/region/ServiceJsonLd.svelte`; a `<svelte:head>` script with `<` escaped is the existing pattern, `structuredDataScript`). Keep `@id` `${SITE_URL}/#organization` so references stay stable; `url` stays `SITE_URL`. Leave the `telephone` out until KI-34 is answered (as `ServiceJsonLd` does) and drop the LocalBusiness block if `ServiceJsonLd` already emits an equivalent business on that page (check; never two conflicting businesses on one page). Update KI-34 in `ongoing-tasks/known-issues.md`: it's now about the Organization's and `ServiceJsonLd`'s phone, no longer the home page.
- [ ] **4.6 Defaults.** `$lib/seo/site.ts`: `DEFAULT_TITLE` / `DEFAULT_DESCRIPTION` / `KEYWORDS` describe the old site ("Fernablesbare Funkzähler …"). Every landing page sets its own title and description, so the defaults now only reach the blog list, the Fragebogen, the legal pages and errors. Keep the values (they're live copy) but fix the comments that name the `(base)` / `(service)` layouts. Check that `/impressum`, `/datenschutzhinweise` and `/fragebogen` still render the same `<title>`/description as in `seo-baseline/*.txt` (copy parity for kept pages).
- [ ] **4.7 Canonical of `/`.** `/` never renders now, so nothing emits `https://heidisystems.com` as a canonical. `/messdienstanbieter`'s canonical stays `https://heidisystems.com/messdienstanbieter`. hreflang (`Seo.svelte`): check it doesn't hard-code the root URL anywhere.
- [ ] **4.8** `bun run check && bun run build && bun run test:unit`; `curl localhost:4173/sitemap.xml` after `bun run preview` and compare with the current production sitemap (expected: the four dropped URLs gone, nothing else changed while `LAUNCHED` is false).
