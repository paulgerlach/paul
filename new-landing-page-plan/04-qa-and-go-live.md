# Phase 4: QA, tests and go-live

## 4.1 Checks

- [x] `bun run dev` → `http://localhost:5173/ueber-uns`
- [ ] Visual match with the design at 1440, 1100, 980, 700 and 375 px. Load Geist into the saved design file for the comparison. Expected differences: the site nav and footer, the form in the final CTA, the dropped links (README, "Links without a page")
- [x] The pages touched by the moves of §1.4 unchanged: `/upgrade-now`, `/messdienstwechsel` (trust cards, now with the `/ueber-uns` link), `/messdienstanbieter`, `/messdienstanbieter/berlin`
- [ ] Chrome, Safari and Firefox on desktop; iOS Safari through `bun run dev --host`
- [ ] Keyboard-only: banner link, CTAs, replay button, the 4 principle buttons, team links, the form
- [ ] Reduced-motion emulation: checklist and "Ein Partner" shown at once, no confetti, no count-up, bar at its width, no panel animation, no replay button
- [ ] JS disabled: final state everywhere, principle 01 open, the day count server-rendered, the form submits
- [x] Browser in UTC and America/New_York shows the same day count as Europe/Berlin and as `/upgrade-now`
- [ ] Lighthouse (mobile) on `bun run build && bun run preview`, then on the Vercel preview: Performance ≥ 90, Accessibility ≥ 95, CLS ≤ 0.05
- [x] No hydration warnings or console errors

## 4.2 Tests

- **Vitest:** `retrofitProgress` cases in `deadline.test.ts` (also with `TZ=UTC` and `TZ=America/New_York`); `content.test.ts` (4 principles with 3 points each, 5 services, 4 numbers, no empty strings, no `XX`).
- **Playwright `e2e/ueber-uns.e2e.ts`:**
  - 200, one `<h1>`, no site `#header`, `noindex` with a self-canonical without a trailing slash, no horizontal overflow at 375 px.
  - Nav/footer link parity with `/`, via the helper of `e2e/messdienstwechsel.e2e.ts` (add `/ueber-uns` to its `landingOnly` list). The landing footer's "Über uns" resolves.
  - With `page.clock` at 12.10.2026 12:00 Berlin: the card shows 80 (same as `/upgrade-now`); at 31.12.2026: last-day text; at 1.1.2027 00:00:05 Berlin: the expired texts.
  - Principles: clicking 03 sets `aria-pressed` and shows its text; without JS, 01's text is in the HTML.
  - Checklist: with reduced motion all 5 items and the row visible immediately; without, they end visible after ~3 s.
  - CTAs: "Demo buchen" (hero) and the header's "Bestand prüfen" scroll to `#start` and focus the email field; "Kundenstimmen lesen" scrolls to `#stimmen`; career links have `CAREERS_HREF` and `rel="noopener"`.
  - Signup: valid (lead with `source = "ueber-uns"`, webhook with `page: "/ueber-uns"`), invalid, honeypot. Needs the local Postgres.

## 4.3 Changes to `svelte-migration-plan/`

1. `00-inventory.md`, "New pages (no Next counterpart)": add `/ueber-uns` → `src/routes/(landing-page)/ueber-uns/+page.svelte`.
2. `10-qa-and-cutover.md`: exclude it from the Next-baseline visual loop, list it as an allowed addition in the SEO diff, add "an `/ueber-uns` signup creates a lead with `source = ueber-uns`" to the post-deploy checks.

## 4.4 Go-live gate: `/ueber-uns`

The page goes live with the cutover. Until every item is done it keeps `seo.noindex = true` and stays out of the sitemap (the footer link stays, for review):

- [ ] Company claims confirmed: free installation ("0 € Installationskosten", "Kostenlos"), "Ein fester Ansprechpartner", "Wechsel auch bei laufendem Vertrag" / "unabhängig vom Vertragsende", "Kündigung beim bisherigen Anbieter per Vollmacht", "Daten direkt in Ihrem ERP- oder CRM-System", "Monatliche Verbrauchsinfo automatisch an alle Mieter", "Kunden in ganz Deutschland", the team paragraph (own development, installation partners). (92 %, 14 Tage, 1–2 h: confirmed 2026-10-12.)
- [ ] Paul Gerlach's card: "Gründer und Geschäftsführer" confirmed; initials or a licensed photo (open question 4)
- [ ] Careers target decided (open question 2), or the teaser hidden
- [ ] Permission to show the 12 customer logos and the Werne and Gerhard quotes (shared with the gates below)
- [ ] Page copy, SEO title and description signed off by the content owner; the expired texts written
- [ ] Slug decided (open question 1)
- [ ] Make.com `switchinquiry` route live and able to tell `/ueber-uns` leads apart (open question 6)
- [ ] Then: remove `noindex`, add the sitemap entry

## 4.5 Carried over: `/upgrade-now` go-live gate

Unchanged from the `/upgrade-now` plan (`ddde6575`, §5.4; its open questions are quoted here). Until every item is done the page keeps `seo.noindex = true` and stays out of the sitemap:

- [ ] Legal statements checked against the HeizkostenV: the four dates, § 5 Abs. 2/3, § 6a, § 12 Abs. 1, the 3 % and +15 % cuts and that they add up, the WEG note, all 7 FAQ answers, the calculator note
- [ ] KPIs confirmed: free installation, "Abgerechnet wird pro tatsächlich installiertem Zähler, dazu eine Abrechnungspauschale" (92 %, 14 days, 1–2 h: confirmed 2026-10-12)
- [ ] "Wechsel inklusive: … kündigen mit Ihrer Vollmacht oder übernehmen bestehende Verträge" and "direkt in Ihre ERP- und CRM-Systeme" confirmed by sales
- [ ] Permission to show the 12 customer logos and the 3 testimonials
- [ ] Page copy, SEO title and description signed off by the content owner
- [ ] The expired-state copy (`hero.expired`, `deadlines.h2Expired`, `calculator.switchLabelExpired`, the step's `timingExpired`, `finalCta.titleExpired`; placeholders today) written and signed off
- [ ] Slug decided: `/upgrade-now` is English on a German site; a German slug (`/jetzt-umruesten`, `/umruestpflicht`) costs one constant now and a redirect later
- [ ] Make.com `switchinquiry` route live and able to tell `/upgrade-now` leads apart (`page: "/upgrade-now"`)
- [ ] Then: remove `noindex`, add the sitemap entry

Its risk stays: if the cutover slips past December, decide then whether the page is still worth launching.

## 4.6 Carried over: city pages and the Germany page

The pages go live with the cutover. Each city is gated on its own: a city whose items aren't done gets `live: false` in `cities/index.ts`, which sets `noindex` and keeps it out of the sitemap and off the Germany map (the page itself still renders, for review, and the footer "Städte" group links it). Items marked *(all)* apply to every city once; the rest are per city, tracked in the status table of the city plan (`be2c1feb`, `07-other-cities.md` §7.6: all 25 cities generated and reviewed, only Berlin live, no business column ticked yet; Gera was added on 2026-10-12 as the 26th, generated the same way and not yet reviewed). Phase references below (7.2, 8.3) are to that plan:

- [x] *(all)* KPIs confirmed: 92 % at the first appointment, 14 days' notice, 1–2 h window (confirmed by business 2026-10-12)
- [ ] Berlin: "Heidi sitzt in Berlin" confirmed. Every city: the fixed contact person, and the map headline's on-site claims (e.g. "Wir sind vor Ort"), confirmed
- [ ] *(all)* Permission to show the 12 customer logos, the Werne logo in the references, and the "Landeshauptstadt München" logo on the München page
- [ ] *(all)* References copy and roles signed off by the content owner (also covers the testimonials on `/upgrade-now` and `/ueber-uns`)
- [ ] Page copy, the page's own SEO title and meta description, and its nearby-city links signed off by the content owner (per city)
- [ ] Hero photo and references photo licensed for use (the designs embed them; their source is unknown). 2 photos per page, 44 in total (21 cities + Germany)
- [ ] Germany: "In allen 16 Bundesländern" / "Von Flensburg bis Garmisch" (installers available nationwide) confirmed, and the generated "Eigene Seiten" hints plus their fallbacks signed off (phase 8.3)
- [ ] *(all)* FAQ "Nein" answers fixed or confirmed by the content owner (phase 7.2)
- [ ] *(all)* Static dates (timeline 2026–2030, "Di, 14.10.", "Abrechnungszeitraum 2026", banner "Ab 1.1.2027") still make sense on the go-live date
- [ ] *(all)* Make.com `switchinquiry` route live (shared with `/messdienstwechsel`)

## 4.7 Carried over: `/messdienstwechsel` go-live gate

Unchanged since the `/messdienstwechsel` plan (`65470139`). Before the cutover PR is merged, these must be resolved; otherwise set `seo.noindex = true` on `/messdienstwechsel` and remove it from the sitemap:

- [x] Real KPI numbers instead of `XX` (92 %, 14 Tage, 1–2 h; confirmed by business 2026-10-12)
- [ ] Approved testimonial photo, name and company
- [ ] Permission to show the 12 customer logos (the "Über 200" claim was dropped by the design update of 2026-10-12)
- [ ] The real demo video
- [ ] The Make.com `switchinquiry` route is live
