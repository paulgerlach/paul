# Phase 6: tests and tooling

Fix the tests the restructure breaks (in the phase that breaks them), add tests that keep the new structure from regressing, retire the Next parity tooling that has no target any more.

Done 2026-10-21. Full `bun run test:e2e`: 593 passed, 6 failed, the same 6 that fail on `feat/landing-pages` (`2c988932`): the tile/rotator loop tests of `/asset-manager`, `/wohnungsunternehmen`, `/hausverwaltung`, `/mietverwaltung`, `/verbrauchsinformation`, `/weg-verwaltung`. Three "hydrates without console errors" tests broke with the new nav (its mobile menu's `summary` came first) and are scoped to `main`. The signup specs ran against a throwaway Postgres container (the repo has no DB tooling). `links.test.ts` lives in `$lib/landing/`, the routes test is `$lib/sitePages.test.ts`.

## 6.1 Existing e2e specs

- [x] `e2e/foundation.e2e.ts`
  - "home page renders with SEO tags and an optimized image": replace with "the home redirects to /messdienstanbieter" (307, `location`; `page.goto("/")` lands on `/messdienstanbieter` with its canonical). The optimized-image check (`img[src$=".webp"]`) moves to a landing page or the blog.
  - "unknown URL renders the 404 page with noindex": stays; add that "Zur Startseite" links `/messdienstanbieter`.
  - "robots.txt …": stays.
  - "sitemap.xml lists the static pages and blog posts": assert `/messdienstanbieter`, `/messdienstwechsel`, `/funktionen`, `/blog`, `/impressum`, `/datenschutzhinweise`, a post; assert `/preise`, `/geraete`, `/kontakt` and the bare `https://heidisystems.com</loc>` are **absent**.
- [x] `e2e/shared-components.e2e.ts`: every test runs on `/kitchen-sink` or the old header. Delete the kitchen-sink tests (swipers, `NumberedSwiper`, `ChartSwiper`, FAQ, KI-29), the KI-07 teaser test and the old mobile-menu test. If `ReviewsSwiper` (still on the legal pages) had a test here, move it to `site.e2e.ts` against `/impressum`. Delete the file if nothing is left. KI-07 and KI-29 in `ongoing-tasks/known-issues.md`: note "page removed in the site cutover" (KI-29's fix stays in the `swiper` attachment, which `ReviewsSwiper` still uses).
- [x] `e2e/hilfe.e2e.ts:129`: expects `/kontakt`; now `/messdienstwechsel#start`.
- [x] `e2e/neuigkeiten.e2e.ts:95`: lists `/geraete` among the story links; the Funkzähler story has no link now.
- [x] `e2e/blog.e2e.ts`: stays as is; it covers the preview cache header that phase 1.3 moved.
- [x] Every landing spec: run them all once after phase 1 (`bun run test:e2e`). They shouldn't change; a failure means the layout move changed the landing DOM.

## 6.2 New e2e: `e2e/site.e2e.ts`

- [x] Redirects (phase 2): each map row with `request.get(path, { maxRedirects: 0 })` → status + `location`; `/preise/?utm_source=x` → `/messdienstwechsel?utm_source=x#start`.
- [x] For `/blog`, a post, `/fragebogen`, `/impressum`, `/datenschutzhinweise`: 200, the landing nav (`nav.top`) and footer (the legal line with Impressum · Datenschutz · AGB) are present, the old header/footer markup is not, no console errors or hydration warnings (collect `page.on("console")`, as other specs do).
- [x] Sticky header on a kept page: scroll `/impressum` to the bottom, `nav.top`'s bounding box `y` is ≤ the banner height (it stuck).
- [x] Kept pages' content is not Geist: `getComputedStyle(h1).fontFamily` on `/impressum` contains `Exo 2`.
- [x] The nav's "Demo buchen" on `/blog` goes to `/messdienstwechsel#start` (phase 1.5).
- [x] Mobile menu of the landing header at 375 px on `/blog` opens and closes (if no landing spec covers the menu already; check `messdienstwechsel.e2e.ts` first).
- [x] Fragebogen still works: step through to the submit step and submit against the webhook sink (copy the flow from wherever the parity smoke or older tests drove it; check `git log -S "fragebogen" -- e2e` for a removed spec).

## 6.3 New unit tests

- [x] `src/lib/server/redirects.test.ts` (phase 2.3).
- [x] `src/lib/landing/links.test.ts`: collect every `href` in `navLinks.ts`, `footerLinks.ts`, `company.ts`, every `src/lib/landing/pages/*/content.ts` (import with `import.meta.glob(..., { eager: true })`, walk the exports recursively for `href` strings and `<a href="…">` inside strings) and fail on `/`, `/preise`, `/geraete`, `/kontakt`, `/#…`. Also fail on an internal href (`/…`) that isn't a known route (`ROUTE_*`, `cityRoute`, `/blog/…`, `/messdienstwechsel#…`, files under `static/`), so a typo or a future dropped page shows up.
- [x] `src/routes/sitemap.xml/pages.test.ts` (or next to `SITE_PAGES`): the route folders under `src/routes/(base)/(landing)` and `(base)/(site)` (via `import.meta.glob("/src/routes/(base)/**/+page.svelte")`) map one to one to `SITE_PAGES` plus `/fragebogen`, `/blog/[uid]`, the city route.

## 6.4 Parity tooling

The Next site is the baseline only for the copy of the kept pages now.

- [x] `e2e/parity/pages.ts`: `PAGES` becomes the new site's URL list (import `SITE_PAGES`, plus a city, a blog post, `/fragebogen`). The smoke run (`smoke.parity.ts`) stays: it's the "every URL 200 on the preview" check of phase 8. Check what else `smoke.parity.ts` asserts (SEO tags against `seo-baseline/`?) and keep that only for `/blog`, the post, `/fragebogen`, `/impressum`, `/datenschutzhinweise`.
- [x] Delete `e2e/parity/visual.parity.ts`, `e2e/parity/__screenshots__/`, `VISUAL_PAGES`, `WIDTHS` if only the visual run used them, and `scripts/layout-diff.ts`. Remove them from `.prettierignore` if listed.
- [x] `seo-baseline/`: delete `home.txt`, `preise.txt`, `geraete.txt`, `kontakt.txt`, `funktionen.txt`; keep the rest while the smoke run compares against them.
- [x] `scripts/compare-endpoints.ts` (webhook payload parity) stays: the Fragebogen, newsletter and chat endpoints still have to send what Next sent.
- [x] `playwright.parity.config.ts`: drop the visual project if it has one.

## 6.5 CI

`.github/workflows/web.yml` runs `check`, `lint`, `build` and the React-import grep; nothing references removed files. Unit tests aren't in CI today; leave that as is unless the user asks.
