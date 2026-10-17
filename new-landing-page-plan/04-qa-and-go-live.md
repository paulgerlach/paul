# Phase 4: QA, tests and go-live

## 4.1 Checks

- [ ] `bun run dev` → `http://localhost:5173/vorgehen`
- [ ] Visual match with the design at 1440, 1100, 980, 700 and 375 px. Load Geist into the saved design file for the comparison. Expected differences: the site nav and footer, the contact card with the signup form instead of its two buttons (README, Signup), the missing "Zum HKVO-Leitfaden" and "Mehr zu Sicherheit" links, the three feature cards without a link, the comparison as `<table>`, the steps' text box sized to the longest text
- [ ] The landing footer on every landing page: "Vorgehen" and "Funktionen" linked, first in "Produkt"
- [ ] Step tabs: auto-advance only once in view; hover and focus pause it; a click or arrow key stops it for good; Home/End; leaving the view and a background tab pause it; the bar restarts in step with the timer
- [ ] Day count: the number matches `daysUntilObligation` for today (Berlin); with the system clock set to 31.12.2026 23:59:50 Berlin, it turns into the expired state without a reload
- [ ] Chrome, Safari and Firefox on desktop; iOS Safari through `bun run dev --host` (the tabs by tap, the comparison at 375 px, the floating CTA)
- [ ] Keyboard-only: banner link, hero CTAs, the tabs, the feature cards, FAQ, the signup form, the floating CTA
- [ ] Screen reader (VoiceOver): the tabs announced as tabs with their selected state, no announcement on auto-advance; the comparison table with caption, column and row headers, "ja"/"nein"
- [ ] Reduced-motion emulation: no auto-advance or bar, no image zoom, no pulsing dot, instant tab swaps
- [ ] JS disabled: every section readable (step 1 shown), the day count from the server, the signup form posts
- [ ] A signup reaches the `leads` table with `source = "vorgehen"` and the sink with `page: "/vorgehen"`
- [ ] Lighthouse (mobile) on `bun run build && bun run preview`, then on the Vercel preview: Performance ≥ 90 (the wide image is the LCP candidate: `priority`, AVIF via `?enhanced`), Accessibility ≥ 95, CLS ≤ 0.05
- [ ] No hydration warnings or console errors

## 4.2 Tests

- **Vitest:** `content.test.ts` (phase 1.3), `daysUntilObligation` in `deadline.test.ts` (phase 1.4).
- **Playwright `e2e/vorgehen.e2e.ts`:**
  - 200, one `<h1>`, no site `#header`, `noindex` with a self-canonical without a trailing slash, no horizontal overflow at 375 px (the comparison table), FAQPage JSON-LD with 5 entries.
  - Nav/footer link parity with `/`, via the helper of `e2e/messdienstwechsel.e2e.ts`. The footer's "Vorgehen" and "Funktionen" resolve.
  - Every "Angebot einholen", "Demo buchen" and the header CTA go to `#start`, which is the contact card's form; the hero has no `id="start"`.
  - Tabs with `reducedMotion: "reduce"`: step 1 selected on load; clicking step 2 shows its text and chip and sets `aria-selected`; ArrowDown from step 2 selects step 3, Home selects step 1. Without reduced motion: after ~6.5 s in view, step 2 is selected (one slow test; use `page.clock` if it keeps the timers deterministic).
  - The day count is a positive integer (or the expired state), and equals the server's value for the request date.
  - Signup against the local Postgres and webhook sink, as in `e2e/selbstabrechnung.e2e.ts`: `source` and `page` as in §4.1.

## 4.3 Changes to `svelte-migration-plan/`

1. `00-inventory.md`, "New pages (no Next counterpart)": add `/vorgehen` → `src/routes/(landing-page)/vorgehen/+page.svelte`.
2. `10-qa-and-cutover.md`: exclude it from the Next-baseline visual loop, list it as an allowed addition in the SEO diff, and add "a `/vorgehen` signup arrives with its `source`" to the post-deploy checks.

## 4.4 Go-live gate: `/vorgehen`

The page goes live with the cutover. Until every item is done it keeps `seo.noindex = true` and stays out of the sitemap (the footer link stays, for review):

- [ ] Legal statements checked: "Die EU-Energieeffizienzrichtlinie und die Heizkostenverordnung verlangen, dass Zähler und Heizkostenverteiler ab dem 1. Januar 2027 aus der Ferne ablesbar sind" (§ 5 HeizkostenV applies to installed devices with exceptions; the page states it without them), "Bis 2027 muss jeder Zähler fernablesbar sein", and the comparison with "Klassisch" ("oft 6 bis 9 Monate", "regelmäßig" Ablesetermine, no uVI, no contact person: comparative advertising, as the region pages' provider comparison in §4.10)
- [ ] Company claims confirmed: "Heidi übernimmt bestehende Zähler und wertet sie aus, egal wie lange Ihr aktueller Vertrag noch läuft" and "Wechsel ohne Warten aufs Vertragsende", "Heidi prüft Bestand und Verträge", "Unsere Monteure", "einen festen Ansprechpartner", DocuScan, the Installationstool ("Digitaler Zwilling, zwei Fotos pro Zähler, sauberes Übergabeprotokoll"), "Ab 1.000 Einheiten … individuelles Angebot", the pricing sentence (shared with §4.5, §4.6 and §4.9), "Auf Servern in Deutschland, verarbeitet nach DSGVO und BDSG", "3-in-1". (92 %, 14 Tage, 1–2 h: confirmed 2026-10-12.)
- [ ] Photos licensed for use (7 new ones in `src/lib/assets/landing/vorgehen/`, plus the shared contact photo and avatars of §4.10); the "Heidi"-branded devices in `kitchen-meters.webp` show real Heidi hardware or are replaced; `dashboard.webp` matches the real dashboard
- [ ] Example data aligned with `/selbstabrechnung` ("Lindenallee 12 · 36 Einheiten" here, "6 Wohnungen" there)
- [ ] The expired texts (`remoteDuty.h2Expired`, `remoteDuty.textExpired`) written and signed off (open question 4)
- [ ] Feature card targets confirmed (open question 3) and the "Angebot einholen" target decided (open question 2)
- [ ] Permission to show the Werne, Höhne and Gerhard quotes without the "Verifiziert" badge (shared with the gates below)
- [ ] Security block statements: covered by the region pages' item in §4.10 (same `TrustSeals`)
- [ ] Page copy, SEO title and description signed off by the content owner
- [ ] Slug decided (open question 1)
- [ ] Make.com `switchinquiry` route live and able to tell `/vorgehen` leads apart (`page: "/vorgehen"`)
- [ ] Then: remove `noindex`, add the sitemap entry

## 4.5 Carried over: `/selbstabrechnung` go-live gate

From the `/selbstabrechnung` plan (`9d0bab9c`, §4.4; its open questions are quoted here). The page goes live with the cutover. Until every item is done it keeps `seo.noindex = true` and stays out of the sitemap (the footer and `/hilfe` links stay, for review):

- [ ] Open checks from its §4.1 (the automated tests are done, except the signup e2e test against a running local Postgres, which wasn't run): visual match with the design at 1440, 1100, 980, 700 and 375 px; the region pages unchanged after the `People` / `TrustSeals` / `FloatingCta` move; the hero demo sequence (auto-run without confetti, a click with confetti, "Erneut ansehen", leaving the tab mid-sequence); the calculator at min/max and by keyboard; Chrome, Safari, Firefox and iOS Safari; keyboard-only; VoiceOver (demo status and toast once each, the mode note once per toggle, slider values as "24.000 €" / "70 %"); reduced-motion emulation; JS disabled; the loops stop off-screen and in a background tab; a signup reaching `leads` and the sink; Lighthouse (mobile) Performance ≥ 90, Accessibility ≥ 95, CLS ≤ 0.05
- [ ] Legal statements checked: 50–70 % by consumption for heating and hot water (§§ 7, 8 HeizkostenV), "Pflicht sind 70 %, wenn …" with its three conditions (§ 7 Abs. 1 S. 2), "Sonst dürfen Mieter um 15 % kürzen" (§ 12 Abs. 1), the twelve months (§ 556 Abs. 3 BGB, leaving out the exception, as on `/hilfe`), the § 6a contents "seit 2022", the CO₂ split "seit 2023" (CO2KostAufG), the calculator note
- [ ] Company claims confirmed: integration "in bestehende ERP- und CRM-Systeme" and "Muss ich meine Software wechseln? Nein.", the uVI sent by Heidi also when the customer bills itself, the Vollservice "per Klick, direkt im Dashboard" (its open question 3: otherwise the toggle goes), "Mit Ankündigung 14 Tage vorher" (KPI, confirmed 2026-10-12), "Ein fester Ansprechpartner, der Ihre Liegenschaften kennt", the pricing sentence (shared with §4.4, §4.6 and §4.9) and the "kostenlosen Portfolio-Check" (no page; reword or link once it exists)
- [ ] Example data consistent: the meter count (hero "18 Zähler", meter list 12 + 1 + 6 + 6 = 25 under "18 von 18"), the calculator's six flats and the computed 2,40 €/Einheit (the design's static text said 2,80 €), the hero results; signed off by the content owner
- [ ] Sample statement: letterhead (Heidi or neutral), sender address spelling ("Monbijouplatz 4" in the design, "Monbijoupl. 4" in ours), and that it reflects Heidi's real statement (portal login, "Heidi Nutzerportal" naming, the notes)
- [ ] The people photo licensed for use, presented as a Heidi adviser (shared with the region photos in §4.10)
- [ ] Permission to show the 12 customer logos and the Höhne and Werne quotes (shared with the gates below)
- [ ] Security block statements: covered by the region pages' item in §4.10 (same `TrustSeals`)
- [ ] Page copy, SEO title and description signed off by the content owner
- [ ] Slug decided: `/selbstabrechnung` by default, `/heizkostenabrechnung-selbst-erstellen` targets the search phrase better
- [ ] Make.com `switchinquiry` route live and able to tell `/selbstabrechnung` leads apart (`page: "/selbstabrechnung"`)
- [ ] Then: remove `noindex`, add the sitemap entry

Its open questions for after the cutover stay: the closing card goes back to the design's plain dark card once a booking URL exists (`DEMO_HREF`), and the Heizkostenabrechnungs-Checker row and "Mehr zu Sicherheit" come back once those pages exist.

## 4.6 Carried over: `/hilfe` go-live gate

From the `/hilfe` plan (`3b70270e`, §4.4; its open questions are quoted here). The page goes live with the cutover. Until every item is done it keeps `seo.noindex = true` and stays out of the sitemap (the footer link stays, for review). After go-live, `?q=` URLs stay `noindex`:

- [ ] Open checks from its §4.1 (the automated tests are done): visual match with the design at 1440, 1100, 980, 700 and 375 px; Chrome, Safari, Firefox and iOS Safari; keyboard-only; VoiceOver (the result count is announced once after typing, the thanks after a vote); reduced-motion emulation; JS disabled (`?q=` via the form, a vote posts); a vote reaching the Make.com sheet; Lighthouse (mobile) Performance ≥ 90, Accessibility ≥ 95, CLS ≤ 0.05
- [ ] Legal statements checked: the 31.12.2026 retrofit deadline, § 6a HeizkostenV (monthly uVI for remotely readable meters), the 3 % cut under § 12 HeizkostenV, "spätestens zwölf Monate … danach kann keine Nachzahlung mehr verlangt werden" (§ 556 Abs. 3 BGB and its exception), "nach DSGVO und BDSG"
- [ ] Company claims confirmed: "ab zwei Wohneinheiten", "mehr als 1.000 Einheiten … individuelles Angebot", Kündigung per Vollmacht and the template, DocuScan, the Selbstabrechnung product (§4.5), ERP/CRM connection, the dashboard's features, "speichert alle Daten auf Servern in Deutschland", installation free with billing per installed meter plus Abrechnungspauschale (shared with §4.9). (92 %, 14 Tage, 1–2 h: confirmed 2026-10-12.)
- [ ] The expired answer of `fernablesbar-frist` written and signed off
- [ ] Feedback routing live: the Make.com `helpfeedback` route writes to a sheet, and someone reads it; or the vote is removed (its open question: alternatives are dropping the vote or a "Nein" follow-up with a text field)
- [ ] An owner named for the answers (they state law and prices; a wrong one is worse than none)
- [ ] Page copy, SEO title and description signed off by the content owner
- [ ] Slug decided: `/hilfe` by default, `/hilfe-center` or `/faq` are the alternatives
- [ ] Then: remove `noindex` (keep it for `?q=`), add the sitemap entry

Its open questions for after the cutover stay: a Prismic `help_article` type instead of `content.ts`, the site footer's "FAQ" pointing here instead of `/blog` (a deliberate deviation from Next, to be listed in `scripts/layout-diff.ts`), and "Gespräch vereinbaren" going to `DEMO_HREF` once a booking URL exists.

## 4.7 Carried over: `/karriere` go-live gate

From the `/karriere` plan (`d9e105d8`, §4.4; its open questions are quoted here). The page goes live with the cutover. Until every item is done it keeps `seo.noindex = true` and stays out of the sitemap (the footer and `/ueber-uns` links stay, for review):

- [ ] The Frontend Engineer position confirmed open, its texts approved by the hiring owner, and an owner named for keeping the job list current
- [ ] Open checks from its §4.1 (none ticked when the plan left this folder): visual match with the design at 1440, 1100, 980, 700 and 375 px; Chrome, Safari, Firefox and iOS Safari; keyboard-only; VoiceOver (the feed isn't announced per tick); reduced-motion emulation; JS disabled; the feed stops off-screen and in a background tab; Lighthouse (mobile) Performance ≥ 90, Accessibility ≥ 95, CLS ≤ 0.05
- [ ] Company claims confirmed: "Ein kleines Team in Berlin", "Funkzähler, Montage, Dashboard und Abrechnung gehören bei uns zusammen", the area texts (own installation partners, fixed contact for Verwaltungen, HKVO billing), the feed's examples, and the three process steps as the real process
- [ ] Application routing live: the Make.com `jobapplication` route forwards to the hiring inbox; inbox and fallback address decided (`jobs@heidisystems.com` in `content.ts` is a placeholder; an applicant tracking system would replace the form); a test application received end to end
- [ ] Privacy: the applicant section in the Datenschutzhinweise (purpose, retention, Make.com as processor with a data processing agreement) and the line under the form, signed off by legal (the line is a draft, not a consent line)
- [ ] Page copy, SEO title and description signed off by the content owner
- [ ] Slug decided: `/karriere` by default, `/jobs` is the alternative
- [ ] Then: remove `noindex`, add the sitemap entry

## 4.8 Carried over: `/ueber-uns` go-live gate

From the `/ueber-uns` plan (`7a777e92`, §4.4; its open questions are quoted here). Until every item is done the page keeps `seo.noindex = true` and stays out of the sitemap (the footer link stays, for review):

- [ ] Open checks from its §4.1: visual match with the design at 1440, 1100, 980, 700 and 375 px; Chrome, Safari, Firefox and iOS Safari; keyboard-only (banner link, CTAs, replay button, the 4 principle buttons, team links, the form); reduced-motion emulation; JS disabled; Lighthouse (mobile) Performance ≥ 90, Accessibility ≥ 95, CLS ≤ 0.05
- [ ] Company claims confirmed: free installation ("0 € Installationskosten", "Kostenlos"), "Ein fester Ansprechpartner", "Wechsel auch bei laufendem Vertrag" / "unabhängig vom Vertragsende", "Kündigung beim bisherigen Anbieter per Vollmacht", "Daten direkt in Ihrem ERP- oder CRM-System", "Monatliche Verbrauchsinfo automatisch an alle Mieter", "Kunden in ganz Deutschland", the team paragraph (own development, installation partners). (92 %, 14 Tage, 1–2 h: confirmed 2026-10-12.)
- [ ] Paul Gerlach's card: "Gründer und Geschäftsführer" confirmed (the Impressum only says "Vertreten durch: Paul Gerlach"); initials or a licensed photo (96 px round)
- [ ] Careers target: `/karriere` (§4.7) goes live at the same time, or `CAREERS_HREF` falls back to LinkedIn, or the careers teaser and the two career links are hidden (`content.careers.show`)
- [ ] Gerhard's badge: "Verifizierter Gewerbekunde" (`data/testimonials.ts`) or the design's "Verifizierter Heidi-Kunde", settled with the references sign-off (§4.10)
- [ ] Permission to show the 12 customer logos and the Werne and Gerhard quotes (shared with the gates below)
- [ ] Page copy, SEO title and description signed off by the content owner; the expired texts (`mission.leadExpired`, `mission.expired`) written
- [ ] Slug decided: `/ueber-uns` by default, `/unternehmen` or `/about` are the alternatives
- [ ] Final CTA: the shared signup form stays, unless a booking URL exists by then (`DEMO_HREF` switches all demo CTAs, and the design's dark card can come back without a form)
- [ ] Make.com `switchinquiry` route live and able to tell `/ueber-uns` leads apart (`page: "/ueber-uns"`)
- [ ] Then: remove `noindex`, add the sitemap entry

Its discoverability question stays open for after the cutover: the site footer and header could link to it too (a deliberate deviation from Next, to be listed in `scripts/layout-diff.ts`).

## 4.9 Carried over: `/upgrade-now` go-live gate

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

## 4.10 Carried over: city pages and the Germany page

The pages go live with the cutover. Each city is gated on its own: a city whose items aren't done gets `live: false` in `cities/index.ts`, which sets `noindex` and keeps it out of the sitemap and off the Germany map (the page itself still renders, for review, and the footer "Städte" group links it). Items marked *(all)* apply to every city once; the rest are per city, tracked in the status table of the city plan (`be2c1feb`, `07-other-cities.md` §7.6: all 25 cities generated and reviewed, only Berlin live, no business column ticked yet; Gera was added on 2026-10-12 as the 26th, generated the same way and not yet reviewed). Phase references below (7.2, 8.3) are to that plan:

- [x] *(all)* KPIs confirmed: 92 % at the first appointment, 14 days' notice, 1–2 h window (confirmed by business 2026-10-12)
- [ ] Berlin: "Heidi sitzt in Berlin" confirmed. Every city: the fixed contact person, and the map headline's on-site claims (e.g. "Wir sind vor Ort"), confirmed
- [ ] *(all)* Permission to show the 12 customer logos, the Werne logo in the references, and the "Landeshauptstadt München" logo on the München page
- [ ] *(all)* References copy and roles signed off by the content owner (also covers the testimonials on `/upgrade-now` and `/ueber-uns`)
- [ ] Page copy, the page's own SEO title and meta description, and its nearby-city links signed off by the content owner (per city)
- [ ] Hero, references and "Menschen statt Hotline" photos licensed for use (the designs embed them; their source is unknown). 3 photos per page (27 pages), plus the shared ones in `src/lib/assets/landing/region/` (the contact person in "Vier gute Gründe", the two avatars of the floating "Erstgespräch vereinbaren" bar). The people photos are presented as Heidi staff ("Ihre persönliche Ansprechpartnerin"): real team photos, or approval to use these
- [ ] *(all)* Provider comparison ("Große haben Größe …", `Compare.svelte`) signed off by legal: it rates "Großer Messdienst" and "Lokaler Messdienst" per criterion (comparative advertising), including the "Sicher erfüllt" scores
- [ ] *(all)* Security block (`TrustSeals.svelte`): the VDIV, DEUMESS, DSGVO/BDSG and "Server in Deutschland" statements confirmed. Its "Mehr zu Sicherheit" link and the comparison's "Anbieter im Detail" link are left out until those pages exist (`SECURITY_HREF`, `DETAIL_HREF`)
- [ ] Germany: "In allen 16 Bundesländern" / "Von Flensburg bis Garmisch" (installers available nationwide) confirmed, and the generated "Eigene Seiten" hints plus their fallbacks signed off (phase 8.3)
- [ ] *(all)* FAQ "Nein" answers fixed or confirmed by the content owner (phase 7.2)
- [ ] *(all)* Static dates (timeline 2026–2030 and its tooltip, "Di, 14.10.", "Abrechnungszeitraum 2026", banner "Ab 1.1.2027") still make sense on the go-live date
- [ ] *(all)* Make.com `switchinquiry` route live (shared with `/messdienstwechsel`)

## 4.11 Carried over: `/messdienstwechsel` go-live gate

Unchanged since the `/messdienstwechsel` plan (`65470139`). Before the cutover PR is merged, these must be resolved; otherwise set `seo.noindex = true` on `/messdienstwechsel` and remove it from the sitemap:

- [x] Real KPI numbers instead of `XX` (92 %, 14 Tage, 1–2 h; confirmed by business 2026-10-12)
- [ ] Approved testimonial photo, name and company
- [ ] Permission to show the 12 customer logos (the "Über 200" claim was dropped by the design update of 2026-10-12)
- [ ] The real demo video
- [ ] The Make.com `switchinquiry` route is live
