# Phase 4: QA, tests and go-live

## 4.1 Checks

- [ ] `bun run dev` → `http://localhost:5173/hilfe`
- [ ] Visual match with the design at 1440, 1100, 980, 700 and 375 px. Load Geist into the saved design file for the comparison. Expected differences: the site nav and footer, the header CTA target, answers without a `more` link (README, Links in answers), the visually hidden search button
- [ ] `/karriere` unchanged after the `CtaCard` move (375 and 1440 px); `/messdienstwechsel` and `/upgrade-now` FAQ JSON-LD byte-identical after the `faqJsonLd` move; the landing footer on every landing page ("Hilfe-Center" linked)
- [ ] Search: "lauft", "Kündigung", "uvi", "mieter termin", "1.000", a query with no result, Escape, the `/` shortcut (and that `/` still types in the footer's newsletter field)
- [ ] Chrome, Safari and Firefox on desktop; iOS Safari through `bun run dev --host` (the search keyboard's "Suchen" key, `<details>`, the sticky list is hidden)
- [ ] Keyboard-only: banner link, search, popular links, topic cards, the topic list, every `<summary>` (Enter/Space), the answer links, Ja/Nein, the empty state's link, the end card
- [ ] Screen reader (VoiceOver): the result count is announced once after typing, not per key; highlighted questions read as one sentence; the thanks after a vote is announced
- [ ] Reduced-motion emulation: instant scrolling (popular, topic cards, deep links), no flash, no card transitions
- [ ] JS disabled: the whole list renders; `?q=uvi` via the form shows the filtered list, the result line and the opened cards; popular and topic links jump; a vote posts and comes back thanked at its card
- [ ] Deep links: `/hilfe#q-installation-kosten` opens that card; `/hilfe?q=xyz#q-uvi` shows the question anyway
- [ ] A vote reaches the Make.com scenario's sheet (on the Vercel preview, after §4.4's feedback item)
- [ ] Lighthouse (mobile) on `bun run build && bun run preview`, then on the Vercel preview: Performance ≥ 90, Accessibility ≥ 95, CLS ≤ 0.05
- [ ] No hydration warnings or console errors, also on `/hilfe?q=…` (server and client must agree on the query)

## 4.2 Tests

- **Vitest:** `search.test.ts` (phase 1.5), `content.test.ts` (phase 1.3), `helpFeedback.test.ts` (schema and action, phase 1.6), and a `faqJsonLd` test (escaping of `<`, one entry per item).
- **Playwright `e2e/hilfe.e2e.ts`:**
  - 200, one `<h1>`, no site `#header`, `noindex` with a self-canonical without a trailing slash, the canonical of `/hilfe?q=uvi` is `/hilfe`, no horizontal overflow at 375 px, FAQPage JSON-LD with 22 entries.
  - Nav/footer link parity with `/`, via the helper of `e2e/messdienstwechsel.e2e.ts` (add `/hilfe` to its `landingOnly` list). The landing footer's "Hilfe-Center" resolves; the header CTA goes to `/messdienstwechsel`.
  - Search: typing "lauft" leaves 1 question with "läuft" highlighted in a `<mark>`, the result line says "1 Ergebnis für „lauft“" and the card is open; topics without a match are hidden; "xyz" shows the empty state with its `/kontakt` link; Escape restores all 22; the URL gets `?q=` and loses it.
  - Server search: `/hilfe?q=uvi` without JS has the filtered list and the result line in the HTML.
  - `/` focuses the search from the page body but not from the newsletter field.
  - Popular: "Was kostet die Installation?" opens `#q-installation-kosten` and it's in the viewport. Topic card "Für Mieter" opens its first question. A `#q-…` deep link opens its card.
  - Feedback, against the local webhook sink: "Ja" shows the thanks and sends one `helpfeedback` payload (`question`, `vote: "yes"`, `page: "/hilfe"`, no email); without JS (`javaScriptEnabled: false`) the post comes back with the thanks at that card; a forged unknown id shows the thanks and sends nothing. No database needed.

## 4.3 Changes to `svelte-migration-plan/`

1. `00-inventory.md`, "New pages (no Next counterpart)": add `/hilfe` → `src/routes/(landing-page)/hilfe/+page.svelte`.
2. `10-qa-and-cutover.md`: exclude it from the Next-baseline visual loop, list it as an allowed addition in the SEO diff, and add "a `/hilfe` vote arrives in the feedback sheet" to the post-deploy checks.

## 4.4 Go-live gate: `/hilfe`

The page goes live with the cutover. Until every item is done it keeps `seo.noindex = true` and stays out of the sitemap (the footer link stays, for review). After go-live, `?q=` URLs stay `noindex`:

- [ ] Legal statements checked: the 31.12.2026 retrofit deadline, § 6a HeizkostenV (monthly uVI for remotely readable meters), the 3 % cut under § 12 HeizkostenV, "spätestens zwölf Monate … danach kann keine Nachzahlung mehr verlangt werden" (§ 556 Abs. 3 BGB and its exception), "nach DSGVO und BDSG"
- [ ] Company claims confirmed: "ab zwei Wohneinheiten", "mehr als 1.000 Einheiten … individuelles Angebot", Kündigung per Vollmacht and the template, DocuScan, the Selbstabrechnung product, ERP/CRM connection, the dashboard's features, "speichert alle Daten auf Servern in Deutschland", installation free with billing per installed meter plus Abrechnungspauschale (shared with §4.7). (92 %, 14 Tage, 1–2 h: confirmed 2026-10-12.)
- [ ] The expired answer of `fernablesbar-frist` written and signed off
- [ ] Feedback routing live: the Make.com `helpfeedback` route writes to a sheet, and someone reads it (open question 2); or the vote is removed
- [ ] An owner named for the answers (they state law and prices; a wrong one is worse than none)
- [ ] Page copy, SEO title and description signed off by the content owner
- [ ] Slug decided (open question 1)
- [ ] Then: remove `noindex` (keep it for `?q=`), add the sitemap entry

## 4.5 Carried over: `/karriere` go-live gate

From the `/karriere` plan (`d9e105d8`, §4.4; its open questions are quoted here). The page goes live with the cutover. Until every item is done it keeps `seo.noindex = true` and stays out of the sitemap (the footer and `/ueber-uns` links stay, for review):

- [ ] The Frontend Engineer position confirmed open, its texts approved by the hiring owner, and an owner named for keeping the job list current
- [ ] Open checks from its §4.1 (none ticked when the plan left this folder): visual match with the design at 1440, 1100, 980, 700 and 375 px; Chrome, Safari, Firefox and iOS Safari; keyboard-only; VoiceOver (the feed isn't announced per tick); reduced-motion emulation; JS disabled; the feed stops off-screen and in a background tab; Lighthouse (mobile) Performance ≥ 90, Accessibility ≥ 95, CLS ≤ 0.05
- [ ] Company claims confirmed: "Ein kleines Team in Berlin", "Funkzähler, Montage, Dashboard und Abrechnung gehören bei uns zusammen", the area texts (own installation partners, fixed contact for Verwaltungen, HKVO billing), the feed's examples, and the three process steps as the real process
- [ ] Application routing live: the Make.com `jobapplication` route forwards to the hiring inbox; inbox and fallback address decided (`jobs@heidisystems.com` in `content.ts` is a placeholder; an applicant tracking system would replace the form); a test application received end to end
- [ ] Privacy: the applicant section in the Datenschutzhinweise (purpose, retention, Make.com as processor with a data processing agreement) and the line under the form, signed off by legal (the line is a draft, not a consent line)
- [ ] Page copy, SEO title and description signed off by the content owner
- [ ] Slug decided: `/karriere` by default, `/jobs` is the alternative
- [ ] Then: remove `noindex`, add the sitemap entry

## 4.6 Carried over: `/ueber-uns` go-live gate

From the `/ueber-uns` plan (`7a777e92`, §4.4; its open questions are quoted here). Until every item is done the page keeps `seo.noindex = true` and stays out of the sitemap (the footer link stays, for review):

- [ ] Open checks from its §4.1: visual match with the design at 1440, 1100, 980, 700 and 375 px; Chrome, Safari, Firefox and iOS Safari; keyboard-only (banner link, CTAs, replay button, the 4 principle buttons, team links, the form); reduced-motion emulation; JS disabled; Lighthouse (mobile) Performance ≥ 90, Accessibility ≥ 95, CLS ≤ 0.05
- [ ] Company claims confirmed: free installation ("0 € Installationskosten", "Kostenlos"), "Ein fester Ansprechpartner", "Wechsel auch bei laufendem Vertrag" / "unabhängig vom Vertragsende", "Kündigung beim bisherigen Anbieter per Vollmacht", "Daten direkt in Ihrem ERP- oder CRM-System", "Monatliche Verbrauchsinfo automatisch an alle Mieter", "Kunden in ganz Deutschland", the team paragraph (own development, installation partners). (92 %, 14 Tage, 1–2 h: confirmed 2026-10-12.)
- [ ] Paul Gerlach's card: "Gründer und Geschäftsführer" confirmed (the Impressum only says "Vertreten durch: Paul Gerlach"); initials or a licensed photo (96 px round)
- [ ] Careers target: `/karriere` (§4.5) goes live at the same time, or `CAREERS_HREF` falls back to LinkedIn, or the careers teaser and the two career links are hidden (`content.careers.show`)
- [ ] Gerhard's badge: "Verifizierter Gewerbekunde" (`data/testimonials.ts`) or the design's "Verifizierter Heidi-Kunde", settled with the references sign-off (§4.8)
- [ ] Permission to show the 12 customer logos and the Werne and Gerhard quotes (shared with the gates below)
- [ ] Page copy, SEO title and description signed off by the content owner; the expired texts (`mission.leadExpired`, `mission.expired`) written
- [ ] Slug decided: `/ueber-uns` by default, `/unternehmen` or `/about` are the alternatives
- [ ] Final CTA: the shared signup form stays, unless a booking URL exists by then (`DEMO_HREF` switches all demo CTAs, and the design's dark card can come back without a form)
- [ ] Make.com `switchinquiry` route live and able to tell `/ueber-uns` leads apart (`page: "/ueber-uns"`)
- [ ] Then: remove `noindex`, add the sitemap entry

Its discoverability question stays open for after the cutover: the site footer and header could link to it too (a deliberate deviation from Next, to be listed in `scripts/layout-diff.ts`).

## 4.7 Carried over: `/upgrade-now` go-live gate

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

## 4.8 Carried over: city pages and the Germany page

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

## 4.9 Carried over: `/messdienstwechsel` go-live gate

Unchanged since the `/messdienstwechsel` plan (`65470139`). Before the cutover PR is merged, these must be resolved; otherwise set `seo.noindex = true` on `/messdienstwechsel` and remove it from the sitemap:

- [x] Real KPI numbers instead of `XX` (92 %, 14 Tage, 1–2 h; confirmed by business 2026-10-12)
- [ ] Approved testimonial photo, name and company
- [ ] Permission to show the 12 customer logos (the "Über 200" claim was dropped by the design update of 2026-10-12)
- [ ] The real demo video
- [ ] The Make.com `switchinquiry` route is live
