# Phase 4: QA, tests and go-live

## 4.1 Checks

- [ ] `bun run dev` → `http://localhost:5173/karriere`
- [ ] Visual match with the design at 1440, 1100, 980, 700 and 375 px. Load Geist into the saved design file for the comparison. Expected differences: the site nav and footer, the header CTA target, the feed's pause button, the privacy line under the submit button, and the field-level error states
- [ ] The pages touched by phase 1 are unchanged: `/upgrade-now` (the segmented control in the risk calculator), `/ueber-uns` (career links now internal, same tab), the landing footer on every landing page ("Karriere" linked)
- [ ] Chrome, Safari and Firefox on desktop; iOS Safari through `bun run dev --host` (the `<select>`, `<details>` and the keyboard covering the form)
- [ ] Keyboard-only: banner link, CTAs, the feed's pause button, the segmented control (arrow keys), every job `<summary>` (Enter/Space), the apply links (focus lands in the name field), the form, the success overlay and "Weitere Bewerbung"
- [ ] Screen reader (VoiceOver): the feed isn't announced on every tick; area changes, form errors and the success state are
- [ ] Reduced-motion emulation: no ticker, no blinking dot, no pause button, no panel animation, no confetti, instant scroll
- [ ] JS disabled: 4 feed items, Engineering's panel, the job cards open and close, the apply links scroll, the form posts and shows errors / the success state at `#bewerben`
- [ ] The feed stops ticking off-screen and in a background tab (Performance panel: no timer callbacks)
- [ ] A real submission reaches the hiring inbox through the Make.com scenario (on the Vercel preview, after §4.4's routing item)
- [ ] Lighthouse (mobile) on `bun run build && bun run preview`, then on the Vercel preview: Performance ≥ 90, Accessibility ≥ 95, CLS ≤ 0.05
- [ ] No hydration warnings or console errors

## 4.2 Tests

- **Vitest:** `application.test.ts` (schema and action, phase 1.4); `content.test.ts` (4 reasons, 4 areas with 3 points each, 7 feed events with a known icon and area, every job with 3 + 3 points, `jobs.list` + `initiative` = `ROLE_IDS`, no empty strings, no `XX`); `Segmented` arrow-key behaviour if it's new.
- **Playwright `e2e/karriere.e2e.ts`:**
  - 200, one `<h1>`, no site `#header`, `noindex` with a self-canonical without a trailing slash, no horizontal overflow at 375 px.
  - Nav/footer link parity with `/`, via the helper of `e2e/messdienstwechsel.e2e.ts` (add `/karriere` to its `landingOnly` list). The landing footer's "Karriere" resolves; the header CTA goes to `/messdienstwechsel`.
  - Feed: 4 items in the server HTML; after ~6 s with JS there are 5 at most and the top one changed; with reduced motion nothing changes; the pause button stops it.
  - Areas: choosing "Operations" shows its title and the "Initiativbewerbung willkommen" link; without JS, Engineering's text is in the HTML.
  - Jobs: the Frontend Engineer card opens and shows both lists; its apply link selects that role in the form and focuses the name field; the hero's "Initiativ bewerben" selects "Initiativbewerbung".
  - Form, against the local webhook sink: empty submit shows the combined sentence and no request is sent; a valid submit shows the success text with the role and sends one `jobapplication` payload (role, name, email, link, message, page `/karriere`, no `_t`/`website`); an invalid link; the honeypot (success, nothing sent); the sink answering 500 shows the error with the fallback address and keeps the values; without JS (`javaScriptEnabled: false`) valid and invalid posts. No database needed.
  - `e2e/ueber-uns.e2e.ts`: career links point to `/karriere` and `/karriere#stellen`, same tab.

## 4.3 Changes to `svelte-migration-plan/`

1. `00-inventory.md`, "New pages (no Next counterpart)": add `/karriere` → `src/routes/(landing-page)/karriere/+page.svelte`.
2. `10-qa-and-cutover.md`: exclude it from the Next-baseline visual loop, list it as an allowed addition in the SEO diff, and add "a `/karriere` application arrives in the hiring inbox" to the post-deploy checks.

## 4.4 Go-live gate: `/karriere`

The page goes live with the cutover. Until every item is done it keeps `seo.noindex = true` and stays out of the sitemap (the footer and `/ueber-uns` links stay, for review):

- [ ] The Frontend Engineer position confirmed open, its texts approved by the hiring owner, and an owner named for keeping the job list current
- [ ] Company claims confirmed: "Ein kleines Team in Berlin", "Funkzähler, Montage, Dashboard und Abrechnung gehören bei uns zusammen", the area texts (own installation partners, fixed contact for Verwaltungen, HKVO billing), the feed's examples, and the three process steps as the real process
- [ ] Application routing live: the Make.com `jobapplication` route forwards to the hiring inbox; inbox and fallback address decided (open question 2); a test application received end to end
- [ ] Privacy: the applicant section in the Datenschutzhinweise (purpose, retention, Make.com as processor with a data processing agreement) and the line under the form, signed off by legal (open question 3)
- [ ] Page copy, SEO title and description signed off by the content owner
- [ ] Slug decided (open question 1)
- [ ] Then: remove `noindex`, add the sitemap entry

## 4.5 Carried over: `/ueber-uns` go-live gate

From the `/ueber-uns` plan (`7a777e92`, §4.4; its open questions are quoted here). Until every item is done the page keeps `seo.noindex = true` and stays out of the sitemap (the footer link stays, for review):

- [ ] Open checks from its §4.1: visual match with the design at 1440, 1100, 980, 700 and 375 px; Chrome, Safari, Firefox and iOS Safari; keyboard-only (banner link, CTAs, replay button, the 4 principle buttons, team links, the form); reduced-motion emulation; JS disabled; Lighthouse (mobile) Performance ≥ 90, Accessibility ≥ 95, CLS ≤ 0.05
- [ ] Company claims confirmed: free installation ("0 € Installationskosten", "Kostenlos"), "Ein fester Ansprechpartner", "Wechsel auch bei laufendem Vertrag" / "unabhängig vom Vertragsende", "Kündigung beim bisherigen Anbieter per Vollmacht", "Daten direkt in Ihrem ERP- oder CRM-System", "Monatliche Verbrauchsinfo automatisch an alle Mieter", "Kunden in ganz Deutschland", the team paragraph (own development, installation partners). (92 %, 14 Tage, 1–2 h: confirmed 2026-10-12.)
- [ ] Paul Gerlach's card: "Gründer und Geschäftsführer" confirmed (the Impressum only says "Vertreten durch: Paul Gerlach"); initials or a licensed photo (96 px round)
- [ ] Careers target: `/karriere` (this plan) goes live at the same time, or `CAREERS_HREF` falls back to LinkedIn, or the careers teaser and the two career links are hidden (`content.careers.show`)
- [ ] Gerhard's badge: "Verifizierter Gewerbekunde" (`data/testimonials.ts`) or the design's "Verifizierter Heidi-Kunde", settled with the references sign-off (§4.7)
- [ ] Permission to show the 12 customer logos and the Werne and Gerhard quotes (shared with the gates below)
- [ ] Page copy, SEO title and description signed off by the content owner; the expired texts (`mission.leadExpired`, `mission.expired`) written
- [ ] Slug decided: `/ueber-uns` by default, `/unternehmen` or `/about` are the alternatives
- [ ] Final CTA: the shared signup form stays, unless a booking URL exists by then (`DEMO_HREF` switches all demo CTAs, and the design's dark card can come back without a form)
- [ ] Make.com `switchinquiry` route live and able to tell `/ueber-uns` leads apart (`page: "/ueber-uns"`)
- [ ] Then: remove `noindex`, add the sitemap entry

Its discoverability question stays open for after the cutover: the site footer and header could link to it too (a deliberate deviation from Next, to be listed in `scripts/layout-diff.ts`).

## 4.6 Carried over: `/upgrade-now` go-live gate

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

## 4.7 Carried over: city pages and the Germany page

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

## 4.8 Carried over: `/messdienstwechsel` go-live gate

Unchanged since the `/messdienstwechsel` plan (`65470139`). Before the cutover PR is merged, these must be resolved; otherwise set `seo.noindex = true` on `/messdienstwechsel` and remove it from the sitemap:

- [x] Real KPI numbers instead of `XX` (92 %, 14 Tage, 1–2 h; confirmed by business 2026-10-12)
- [ ] Approved testimonial photo, name and company
- [ ] Permission to show the 12 customer logos (the "Über 200" claim was dropped by the design update of 2026-10-12)
- [ ] The real demo video
- [ ] The Make.com `switchinquiry` route is live
