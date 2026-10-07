# Phase 5: QA, tests and go-live

## 5.1 Checks

- [x] `bun run dev` → `http://localhost:5173/upgrade-now`
- [ ] Visual match with the design at 1440, 1100, 980, 700 and 375 px (the design's widths). Load Geist into the saved design file for the comparison, as for the city pages. Expected differences: the site nav and footer, the form in the final CTA (phase 4.3)
- [ ] The other landing pages unchanged after the shared-code changes of phase 2.3 (`/messdienstwechsel`, `/messdienstanbieter`, `/messdienstanbieter/berlin` at the same widths)
- [ ] Chrome, Safari and Firefox on desktop; iOS Safari through `bun run dev --host`
- [ ] Keyboard-only: banner link, CTAs, both sliders (arrow keys), the segment buttons, the switch, FAQ, the form
- [ ] Reduced-motion emulation: final numbers immediately, no countdown slide, no confetti, no wave loop
- [ ] JS disabled: every number server-rendered and plausible, the form submits
- [ ] Time zone (unit tests pass with `TZ=UTC` and `TZ=America/New_York`; browser check open): the browser in UTC and in America/New_York shows the same days and calendar as in Europe/Berlin
- [ ] Lighthouse (mobile) on `bun run build && bun run preview`, then on the Vercel preview: Performance ≥ 90, Accessibility ≥ 95, CLS ≤ 0.05. The countdown and the year band must not shift the layout when the client takes over
- [ ] No hydration warnings or console errors

## 5.2 Tests

- **Vitest:** `deadline.test.ts` and `calculator.test.ts` (phase 3); a content check in the style of `messdienstwechsel/data.test.ts` (FAQ count, no empty strings, no `XX` placeholders).
- **Playwright `e2e/upgrade-now.e2e.ts`:**
  - 200, one `<h1>`, no site `#header`, canonical without a trailing slash, `FAQPage` JSON-LD with 7 questions, no horizontal overflow at 375 px.
  - Nav/footer link parity with `/`, reusing the helper of `e2e/messdienstwechsel.e2e.ts` (whose `landingOnly` list already contains `/upgrade-now`).
  - With `page.clock` at fixed times: 7.10.2026 (countdown, "knapp drei Monate", 3 calendar months, the KPI numbers), 31.12.2026 12:00 Berlin (last-day wording, not "abgelaufen"), 1.1.2027 00:00:05 Berlin (expired state of §3.2), and a run that crosses the deadline while the page is open.
  - Calculator: defaults show 3.600 € (120 × 1000 € × 3 %); 50 % halves it; the switch turns it to 0 and shows the safe texts (reduced motion emulated, so the tween is instant).
  - Signup: valid (lead with `source = "upgrade-now"`, webhook with `page`), invalid, honeypot. The rate limit is already raised under `KITCHEN_SINK=1`.
  - Each CTA of §4.1 scrolls to the form and focuses the email field.

## 5.3 Changes to `svelte-migration-plan/`

1. `00-inventory.md`, "New pages (no Next counterpart)": add `/upgrade-now` → `src/routes/(landing-page)/upgrade-now/+page.svelte`.
2. `10-qa-and-cutover.md`: exclude it from the Next-baseline visual loop, list it as an allowed addition in the SEO diff, and add "an `/upgrade-now` signup creates a lead with `source = upgrade-now`" to the post-deploy checks.

## 5.4 Go-live gate: `/upgrade-now`

The page goes live with the cutover. Until every item is done it keeps `seo.noindex = true` and stays out of the sitemap (the footer link stays, so it can be reviewed). Start the business items now (README, "Time pressure"):

- [ ] Legal statements checked against the HeizkostenV: the four dates, § 5 Abs. 2/3, § 6a, § 12 Abs. 1, the 3 % and +15 % cuts and that they add up, the WEG note, all 7 FAQ answers, the calculator note
- [ ] KPIs confirmed: 92 % at the first appointment, 14 days' notice, 1–2 h window, free installation, "Abgerechnet wird pro tatsächlich installiertem Zähler, dazu eine Abrechnungspauschale" (the same claims as on the city pages)
- [ ] "Wechsel inklusive: … kündigen mit Ihrer Vollmacht oder übernehmen bestehende Verträge" and "direkt in Ihre ERP- und CRM-Systeme" confirmed by sales
- [ ] Permission to show the 12 customer logos and the 3 testimonials (shared with the city gate below)
- [ ] Page copy, SEO title and description signed off by the content owner
- [ ] The expired-state copy (open question 3) written and signed off
- [ ] Slug decided (open question 1)
- [ ] Make.com `switchinquiry` route live and able to tell `/upgrade-now` leads apart (open question 4)
- [ ] Then: remove `noindex`, add the sitemap entry (phase 1.3)

## 5.5 Carried over: city pages and the Germany page

The pages go live with the cutover. Each city is gated on its own: a city whose items aren't done gets `live: false` in `cities/index.ts`, which sets `noindex` and keeps it out of the sitemap and off the Germany map (the page itself still renders, for review, and the footer "Städte" group links it). Items marked *(all)* apply to every city once; the rest are per city, tracked in the status table of the previous plan (`be2c1feb`, `07-other-cities.md` §7.6: all 25 cities generated and reviewed, only Berlin live, no business column ticked yet). Phase references below (7.2, 8.3) are to that plan. The items are copied unchanged from its §6.4:

- [ ] *(all)* KPIs confirmed: 92 % at the first appointment, 14 days' notice, 1–2 h window (also in the AllInOne text and the FAQ)
- [ ] Berlin: "Heidi sitzt in Berlin" confirmed. Every city: the fixed contact person, and the map headline's on-site claims (e.g. "Wir sind vor Ort"), confirmed
- [ ] *(all)* Permission to show the 12 customer logos, the Werne logo in the references, and the "Landeshauptstadt München" logo on the München page
- [ ] *(all)* References copy and roles signed off by the content owner (previous plan's open question 6; also covers this page's testimonials)
- [ ] Page copy, the page's own SEO title and meta description, and its nearby-city links signed off by the content owner (per city: the copy differs in every section)
- [ ] Hero photo and references photo licensed for use (the designs embed them; their source is unknown). 2 photos per page, 44 in total (21 cities + Germany)
- [ ] Germany: "In allen 16 Bundesländern" / "Von Flensburg bis Garmisch" (installers available nationwide) confirmed, and the generated "Eigene Seiten" hints plus their fallbacks signed off (phase 8.3)
- [ ] *(all)* FAQ "Nein" answers fixed or confirmed by the content owner (phase 7.2)
- [ ] *(all)* Static dates (timeline 2026–2030, "Di, 14.10.", "Abrechnungszeitraum 2026", banner "Ab 1.1.2027") still make sense on the go-live date
- [ ] *(all)* Make.com `switchinquiry` route live (shared with `/messdienstwechsel`)

## 5.6 Carried over: `/messdienstwechsel` go-live gate

Unchanged since the `/messdienstwechsel` plan (`65470139`). Before the cutover PR is merged, these must be resolved; otherwise set `seo.noindex = true` on `/messdienstwechsel` and remove it from the sitemap:

- [ ] Real KPI numbers instead of `XX`
- [ ] Approved testimonial photo, name and company
- [ ] Permission to show the 12 customer logos, and the "Über 200" claim confirmed
- [ ] The real demo video
- [ ] The Make.com `switchinquiry` route is live
