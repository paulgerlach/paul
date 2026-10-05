# Phase 6: QA, tests and go-live

## 6.1 Before the localhost demo

- [x] `bun run dev` → `http://localhost:5173/messdienstanbieter/berlin`
- [x] Visual match with the design at 1440, 1100, 980, 700, 560 and 375 px (compared with the design, not Next: Next has no such page). Section heights equal the design's at all six widths, with Geist loaded into the design file; the only differences are the site nav/footer and the added map links (+48 px)
- [x] `/messdienstwechsel` still matches its pre-refactor screenshots (phase 1): pixel-identical at 1440/1100/980/700/375
- [ ] Chrome, Safari and Firefox on desktop; iOS Safari through `bun run dev --host`
- [ ] Keyboard-only walkthrough: nav, burger, both forms, map districts, billing buttons, phone tabs, portfolio tabs, trio buttons, FAQ
- [x] Reduced-motion emulation (e2e `interactions` run with it)
- [ ] Lighthouse (mobile) on `bun run build && bun run preview`: Performance ≥ 90, Accessibility ≥ 95, CLS ≤ 0.05. The hero photo is the LCP element and must be preloaded (`priority`)
  - Local result (2026-10-05, Lighthouse 12 mobile, `bun run preview`): Berlin 84 / a11y 96 / CLS 0, Germany 82 / 96 / 0; `/messdienstwechsel` 87 / 92 under the same conditions. LCP (4.2 s simulated) is the hero lede, not the photo; locally TTFB is ~650 ms because the layout fetches the nav's blog teaser from Prismic (the same caveat as in the migration's phase 10 QA). Re-measure on the Vercel preview. Possible win for all landing pages: the root layout preloads Exo 2 (41 KB), which they don't use. The contrast findings are the design's eyebrow/grey tokens, as on `/messdienstwechsel`
- [x] No hydration warnings or console errors (e2e checks every page)
- [x] `/messdienstanbieter/foo` returns 404 and `/messdienstanbieter/berlin/` redirects (`/messdienstanbieter` is the Germany page now)
- [ ] For the phase 7 cities: the per-city checks in §7.5
- [ ] For the Germany page: the checks in §8.6

## 6.2 Tests

- **Playwright `e2e/messdienstanbieter.e2e.ts`.** The smoke checks (status, h1, canonical, map default district, no overflow at 375 px) loop over **all** `CITIES`. The form and interaction tests run on Berlin only, because the template is the same for every city:
  - 200, one `<h1>`, no site `#header`, canonical without a trailing slash, an unknown city 404s.
  - Link parity of the landing nav with `/` (the same check as the `/messdienstwechsel` test; reuse its helper).
  - The footer "Städte" group lists exactly the live cities.
  - Both forms: valid (lead with the city source, webhook with `city`), invalid, honeypot. Mind the shared rate limit with the `/messdienstwechsel` signup tests (3 valid signups per IP per server run): use a separate IP header if the tests use one, or keep the total of valid signups across both files at 3, or raise the limit under `KITCHEN_SINK=1`.
  - Map: focusing a district updates the info panel. Phone: a tab click changes the month text. Portfolio: a tab click switches the table. Billing: a click ends in the final status text (with reduced motion emulated, so it's instant).
  - At 375 px: `document.documentElement.scrollWidth <= innerWidth`.
- **Germany page:** the same smoke checks on `/messdienstanbieter`, plus: the map shows a dot (a link) for exactly the live cities, each link resolves with 200, a focused state shows its hint, and the signup stores `source = "messdienstanbieter"`.
- **Standalone-page checks (README core requirement)**, over all content modules (Vitest) and all `CITIES` + Germany (e2e): titles, descriptions, H1s and ledes are unique across pages; title 30–60 and description 120–160 characters, both containing the city name; exactly one `<h1>`; canonical and `og:url` equal the page's own URL; every internal link resolves with 200 and none points to a non-live city; no two pages share a section intro word for word.
- **Vitest:** the city content checks from phase 2.4, and the `/messdienstwechsel` `data.test.ts` still passes after its move.

## 6.3 Changes to `svelte-migration-plan/`

1. `00-inventory.md`, "New pages (no Next counterpart)": add `/messdienstanbieter` → `src/routes/(landing-page)/messdienstanbieter/+page.svelte` and `/messdienstanbieter/[city]` → `src/routes/(landing-page)/messdienstanbieter/[city=city]/+page.svelte`.
2. `10-qa-and-cutover.md`: exclude the city pages from the Next-baseline visual loop, list them as allowed additions in the SEO diff, and add "a city-page signup creates a lead with the city source" to the post-deploy checks.

## 6.4 Go-live gate: city pages and the Germany page

The pages go live with the cutover. Each city is gated on its own: a city whose items aren't done gets `live: false` in `cities/index.ts`, which sets `noindex` and keeps it out of the sitemap and the footer "Städte" group (the page itself still renders, for review). Items marked *(all)* apply to every city once; the rest are per city, tracked in the table in [07-other-cities.md §7.6](07-other-cities.md):

- [ ] *(all)* KPIs confirmed: 92 % at the first appointment, 14 days' notice, 1–2 h window (also in the AllInOne text and the FAQ)
- [ ] Berlin: "Heidi sitzt in Berlin" confirmed. Every city: the fixed contact person, and the map headline's on-site claims (e.g. "Wir sind vor Ort"), confirmed
- [ ] *(all)* Permission to show the 12 customer logos, the Werne logo in the references, and the "Landeshauptstadt München" logo on the München page
- [ ] *(all)* References copy and roles signed off by the content owner (open question 6)
- [ ] Page copy, the page's own SEO title and meta description, and its nearby-city links signed off by the content owner (per city: the copy differs in every section)
- [ ] Hero photo and references photo licensed for use (the designs embed them; their source is unknown). 2 photos per page, 44 in total (21 cities + Germany)
- [ ] Germany: "In allen 16 Bundesländern" / "Von Flensburg bis Garmisch" (installers available nationwide) confirmed, and the generated "Eigene Seiten" hints plus their fallbacks signed off (phase 8.3)
- [ ] *(all)* FAQ "Nein" answers fixed or confirmed by the content owner (phase 7.2)
- [ ] *(all)* Static dates (timeline 2026–2030, "Di, 14.10.", "Abrechnungszeitraum 2026", banner "Ab 1.1.2027") still make sense on the go-live date
- [ ] *(all)* Make.com `switchinquiry` route live (shared with `/messdienstwechsel`)

## 6.5 Carried over: `/messdienstwechsel` go-live gate

Unchanged from the previous plan. Before the cutover PR is merged, these must be resolved; otherwise set `seo.noindex = true` on `/messdienstwechsel` and remove it from the sitemap:

- [ ] Real KPI numbers instead of `XX`
- [ ] Approved testimonial photo, name and company
- [ ] Permission to show the 12 customer logos, and the "Über 200" claim confirmed
- [ ] The real demo video
- [ ] The Make.com `switchinquiry` route is live
