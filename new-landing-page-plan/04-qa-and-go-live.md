# Phase 4: QA, tests and go-live

Every page is indexed and in the sitemap after the cutover (decision of 2026-10-17). So every go-live gate below, this page's and the carried-over ones, must be done before the cutover PR (#440) merges; the `noindex` the new pages carry today only lasts until then.

## 4.1 Checks

- [x] `bun run dev` → `http://localhost:5173/verbrauchsinformation`: the page, with the landing header and footer; the footer's "Verbrauchsinformation (uVI)" lands here from every landing page; "Mehr zur uVI" on `/mieterportal` and `/hilfe` lands here; the city template's uVI card too, if changed (01 §1.1) (2026-10-18: the city template's uVI card stays as it is: in the Berlin design it links to `#faq`)
- [x] `/mieterportal` unchanged after the template move (02 §2.1): screenshots at 1440 and 375 px with reduced motion, the SSR HTML without scoping classes, its loops (hero list, four tiles, rotator, mini dashboard) as before (2026-10-18: screenshots pixel-identical, the HTML differs only in classes and Svelte's markers, e2e passes)
- [ ] Visual match with the design at 1440, 1100, 980, 700 and 375 px. Load Geist into the saved design file for the comparison. Expected differences: the site nav and footer, the closing card's signup form instead of the video button, no buttons on the audience cards, the hero mock in its end state on load, the right hero photo's crop (square source). Compared at 1440 and 375 px section by section (2026-10-18): every section has the design's height except the audience cards (no buttons) and the closing card (form); 1100, 980 and 700 px still to compare
- [x] No horizontal overflow at any width from 320 to 1640 px (the hero word and peek strip, the KPI boxes, the calendar note, the bill, the rotator) (1440, 1100, 980, 700, 375, 320 checked in dev, 375 and 320 in e2e)
- [ ] Hero mock: in its end state on load; when the page is restored scrolled down, the KPIs fade in and the bars grow once as the hero comes into view. On load: checked (e2e); the restored-scroll entrance still to check by hand
- [ ] Statement: words light up while scrolling down and dim scrolling back; all lit with reduced motion and without JS
- [x] Tiles: each loops only while in view (calendar 7.6 s, document 7 s, phone 7 s, bill 6.4 s), stops off-screen and in a background tab, restarts cleanly on return; the bill's sum counts 1.202,80 → 1.240,00 € and lands exactly on "1.240,00 €" (calendar and bill in e2e, with the clock)
- [x] Rotator: changes every 2.3 s only in view; the first phrase stays on the first pass
- [ ] Numbers: 12, 3 and 3 count up once; "31.12.2026" doesn't; with `now` set after 31.12.2026 (a `load` override in dev) the bento and answer 5 show their expired texts
- [ ] Every "Demo buchen" scrolls to the closing card below the sticky header and focuses its e-mail field; "Mehr erfahren" → the rows, "Häufige Fragen" → the FAQ; the inline and button links to `/mieterportal` and "Jetzt noch umrüsten" work
- [ ] Chrome, Safari and Firefox on desktop; iOS Safari through `bun run dev --host` (the loops, the peek strip, the floating CTA)
- [ ] Keyboard-only through the whole page: banner link, hero CTAs, row CTAs and the inline link, the FAQ, the signup form, the trust block's button, the floating CTA; the focus ring visible on dark (`--accent`)
- [ ] Screen reader (VoiceOver): the H1 "uVI: Unterjährige Verbrauchsinformation mit Heidi" (not "uVI"); the mock as one labelled figure with its KPI sentence; the tiles silent; the rotator's list; the FAQ; no announcements from the loops
- [x] Reduced-motion emulation: every block in its end state, no entrance, loop, count or tween; the CSS loops (calendar ring, note dot) still
- [x] JS disabled: every section readable in its end state, the FAQ opens natively, the signup form posts
- [x] A signup reaches the `leads` table with `source = "verbrauchsinformation"` and the sink with `page: "/verbrauchsinformation"`
- [ ] Lighthouse (mobile) on `bun run build && bun run preview`, then on the Vercel preview: Performance ≥ 90, Accessibility ≥ 95, CLS ≤ 0.05 (compare with `/mieterportal`, the same template). Local preview (2026-10-18): Performance 75 (`/mieterportal` 74–77 on the same run; LCP is the hero word, render delay from the font), Accessibility 95 (the mock's "Beispieldaten" tag and month labels in the design's `--faint` on white, and the shared footer's `<h4>`), CLS 0, TBT ≤ 20 ms; the Vercel preview run is open
- [x] No hydration warnings or console errors (at 1440, 1100, 980, 700, 375 and 320 px, in dev) (`/verbrauchsinformation`, `/mieterportal` and `/hilfe`; a dev server left running while the sections moved showed a stale hydration error on `/mieterportal`, gone after a restart and never in the build)

## 4.2 Tests

- **Vitest:** `content.test.ts` (01 §1.2), including `faqItems(now)` and `figures(now)` on both sides of `DEADLINE`. `mieterportal/content.test.ts` passes with the new shapes; `hilfe/content.test.ts` with the new `href`.
- **Playwright `e2e/verbrauchsinformation.e2e.ts`:**
  - 200, one `<h1>` with the accessible name "uVI: Unterjährige Verbrauchsinformation mit Heidi", no site `#header`, `noindex`, a self-canonical without a trailing slash, **not** in `sitemap.xml`, no horizontal overflow at 375 px, one FAQPage JSON-LD with the six questions.
  - The footer's "Verbrauchsinformation (uVI)" goes here; `/mieterportal`'s and `/hilfe`'s "Mehr zur uVI" too; every internal link in the footer and in `main` resolves (200).
  - Every "Demo buchen" and the header CTA go to `#start`, which is the closing card's form; the hero has no `id="start"`; "Mehr erfahren" → `#inhalt`; "Häufige Fragen" → `#faq`.
  - Without JS: the mock with four KPIs and 12 bars, four rows with their tiles in the end state (calendar note "Oktober wird erstellt", "Alle Pflichtangaben enthalten", the bill on "Mit Heidi" with "1.240,00 €"), the closing form posting.
  - With `reducedMotion: "reduce"`: the tiles don't change after 8 s in view.
  - Without reduced motion (with `page.clock`): the calendar note changes within ~1 s of the tile coming into view; the bill shows "1.202,80 €" and then "1.240,00 €"; nothing changes while scrolled out of view.
  - Signup against the local Postgres and webhook sink, as in `e2e/mieterportal.e2e.ts`: `source` and `page` as in §4.1.
- **Other specs:** `e2e/mieterportal.e2e.ts` passes unchanged after the template move (and expects "Mehr zur uVI" → `/verbrauchsinformation` if it checks it); the footer-link tests of every landing page pass; the city specs if `Duo` changed.

## 4.3 Changes to `svelte-migration-plan/` and `CLAUDE.md`

1. `00-inventory.md`: a `/verbrauchsinformation` row (new landing page, `noindex` until its go-live gate, this plan).
2. `10-qa-and-cutover.md`: exclude `/verbrauchsinformation` from the Next-baseline visual loop and list it with the new pages in the SEO diff; add "a `/verbrauchsinformation` signup arrives with its `source`" to the post-deploy checks; the `/funktionen` gate is §4.8 now (done in the planning commit).
3. `CLAUDE.md`: a `/verbrauchsinformation` paragraph (planned now; rewritten once built, with the shared `uv` template next to `region/` in the layout tree); the gate numbers of the other pages moved up by one (done in the planning commit).

All three done (2026-10-18).

## 4.4 Go-live gate: `/verbrauchsinformation`

The page goes live with the cutover. Every item must be done before the cutover, when it loses `noindex` and joins the sitemap (every page is indexed after the cutover); until then it keeps `seo.noindex = true` and stays out of the sitemap (the footer and FAQ links stay, for review):

- [ ] Legal sign-off of every statement (README, Risks): "Seit 2022 müssen Mieter mit fernablesbaren Zählern jeden Monat über ihren Verbrauch informiert werden", "Seit dem 1. Januar 2022 müssen Gebäudeeigentümer ihre Mieter monatlich informieren, sobald fernablesbare Zähler oder Heizkostenverteiler verbaut sind (§ 6a HeizkostenV)", the required content ("in Kilowattstunden", Vormonat, Vorjahresmonat "soweit Daten vorliegen", "Durchschnittsnutzer derselben Nutzerkategorie"), "Alles drin, was § 6a verlangt", "dürfen Mieter ihren Anteil an den Heizkosten um 3 % kürzen (§ 12 HeizkostenV)", "Das gilt auch, wenn keine fernablesbaren Geräte verbaut sind, obwohl es Pflicht wäre", "Kein Kürzungsrecht. Keine Diskussion.", "In der Abrechnung gibt es dafür keinen Abzug", "Rechtssicher", "Bestehende Geräte müssen bis zum 31. Dezember 2026 nachgerüstet oder ersetzt werden", "Bis dahin müssen alle Zähler fernablesbar sein", "rechnet nach HKVO ab", "steht Ihnen eventuell eine Kürzung zu". If copy changes, the same sentences on `/hilfe`, `/mieterportal` and `/upgrade-now` change with it
- [ ] The product as described: the uVI monthly and "für jede Wohnung", delivered in the Mieterportal with a notification, "per Funk", "Ohne Termin", "Mit Heidi ist jede Information dokumentiert", "Ihr Team hat damit keine Arbeit" / "0 Handgriffe für Ihr Team", "hält Ihnen die Mieterfragen vom Tisch"; align with `/mieterportal`'s product item (§4.7)
- [ ] Example data signed off and made consistent: the mock's bars (October to September, 96 kWh in August), "Ihr Verbrauch im September", 131 / 96 / 148 / 142 kWh, "11 % unter Vorjahresmonat", "8 % unter Durchschnitt", the calendar at "Oktober wird erstellt", the bill's 1.240,00 € and −37,20 €, "Wohnung 2. OG links"; they read as "now" only in autumn 2026: update or make relative for 2027
- [ ] The expired texts written (bento figure, answer 5; 01 §1.3)
- [ ] Photos: the new hero photo `verbrauchsinformation/tenant.jpg` licensed for use; the reuse of `vorgehen/building-wide.webp`, `cities/leipzig/references.jpg`, `cities/koeln/hero.jpg`, `cities/gera/references.jpg` and `region/contact.webp` on a generic page accepted (licences: §4.8 for `vorgehen/`, §4.15 for the city and region photos)
- [ ] Permission to show the Höhne, Werne and Gerhard quotes (shared with the gates below)
- [ ] Security block statements: covered by the region pages' item in §4.15 (same `TrustSeals`)
- [ ] The CTA targets decided: the closing card (open question 2); the audience cards' buttons (open question 3); FAQ answer 6's inline link (open question 5)
- [ ] Page copy, SEO title and description signed off by the content owner
- [ ] Slug decided: `/verbrauchsinformation` by default (open question 1)
- [ ] Make.com `switchinquiry` route live and able to tell `/verbrauchsinformation` leads apart (`page: "/verbrauchsinformation"`)
- [ ] At the cutover: remove `noindex`, add the sitemap entry

## 4.5 Carried over: `/sicherheit` go-live gate

From the `/sicherheit` plan (`334b2c2d`, §4.4; its open questions are quoted here). The page goes live with the cutover. Every item must be done before the cutover, when it loses `noindex` and joins the sitemap (every page is indexed after the cutover); until then it keeps `seo.noindex = true` and stays out of the sitemap (the footer, trust block and FAQ links stay, for review):

- [ ] Open checks from its §4.1 (built and tested; e2e `e2e/sicherheit.e2e.ts`, 12 tests): visual match with the design at 1100, 980 and 700 px (1440 and 375 px done; expected differences: the site nav and footer, the closing card's signup form instead of the single button, the trust block without "Mehr zu Sicherheit", the table rows as disclosures, the table's location text in `#2f7a3c`); the principles' icons playing once in turn on view and looping on hover; "Welche Daten wo liegen ↓" and every "Demo buchen" landing below the sticky header, "Demo buchen" focusing the closing form; Chrome, Safari, Firefox and iOS Safari; keyboard-only; VoiceOver (the map as one image with its label, the data path as a list, the table rows as disclosures with "Speicherort: Deutschland", no announcements from the packet loop); Lighthouse (mobile) on the Vercel preview: Performance ≥ 90 (local preview 79–88), Accessibility ≥ 95, CLS ≤ 0.05
- [ ] Data-protection and legal sign-off of every statement, with the subprocessor list from the DPA (AV-Vertrag) at hand (README, Risks): "Heidi verarbeitet und speichert alle Daten nach deutschen Vorgaben, auf Servern in Deutschland", "Das gilt für die Daten Ihrer Verwaltung genauso wie für die Daten Ihrer Mieter", "Alle Daten liegen auf Servern in Deutschland", "Das gilt für alle Daten: Verbräuche, Stammdaten, Mieterdaten, Rechnungen und Abrechnungen", "Gespeichert und verarbeitet wird in Deutschland", "Nur was für Ablesung, Verbrauchsinformation und Heizkostenabrechnung nötig ist", "nach der Datenschutz-Grundverordnung (DSGVO) und dem Bundesdatenschutzgesetz (BDSG)", "Mieterdaten … nach § 6a HeizkostenV", the map's "Speicherort Deutschland"; true for hosting, backups, DocuScan's OCR, e-mail delivery, the gateways' transfer path and support tools; whether "alle Daten" needs scoping, given that this site's forms and chat go through Make.com, Slack, the AI gateway and Vercel. If copy changes, the same sentences on `/mieterportal`, `/vorgehen`, `/hilfe` and in `TrustSeals` change with it
- [ ] Company claims confirmed: "Unternehmen aus Berlin", "Ihr Vertragspartner ist die Heidi Systems GmbH, Monbijouplatz 4, 10178 Berlin", "Vertrag und Ansprechpartner in Deutschland"
- [ ] The product as described: a gateway in every building ("Gateway im Haus"), "Rechnungen aus DocuScan" (Brennstoff, Betriebsstrom, Wartung), "Auf Wunsch übergibt Heidi sie an Ihre Verwaltungssoftware", the dashboard as "Zugang Ihres Teams", the log messages ("Verbrauchsinformation erstellt", "Rechnung gespeichert", "Abrechnung gespeichert")
- [ ] Security block statements: covered by the region pages' item in §4.15 (same `TrustSeals`); this page shows them as its own partner section, so settle the "DSGVO" seal there first
- [ ] The CTA targets decided: the closing card (its open question 3: the signup form with "Demo buchen", or back to the design's single button once a booking URL exists); "Mehr zu Sicherheit" on this page (its open question 2: hidden, or linked to `#daten`); one or both footer entries "Sicherheit" (its open question 5)
- [ ] Page copy, SEO title and description signed off by the content owner
- [ ] Slug decided: `/sicherheit` by default (its open question 1: alternatives `/datensicherheit`, `/sicherheit-datenschutz`)
- [ ] Make.com `switchinquiry` route live and able to tell `/sicherheit` leads apart (`page: "/sicherheit"`)
- [ ] At the cutover: remove `noindex`, add the sitemap entry

## 4.6 Carried over: `/dashboard` go-live gate

From the `/dashboard` plan (`83433739`, §4.4; its open questions are quoted here). The page goes live with the cutover. Every item must be done before the cutover, when it loses `noindex` and joins the sitemap (every page is indexed after the cutover); until then it keeps `seo.noindex = true` and stays out of the sitemap (the footer and `/hilfe` links stay, for review):

- [ ] Open checks from its §4.1 (the automated tests are done, except the signup e2e test against a running local Postgres, which wasn't run): visual match with the design at 1440, 1100, 980, 700 and 375 px (expected differences: the site nav and footer, the closing card without "Lieber direkt eine Demo buchen", the marquee's pause button, the "Datenansicht" switch below 820 px, the generated example values; the "Mehr zu Sicherheit" link now exists); the preview by keyboard (tabs, menus, drawer and dialog take and return focus, Escape closes the top-most layer only, the data view); the KPI cards (bars grow once, month picking by pointer and arrow keys with the right values, "11,3" counting once); the scroll scene (in order both ways, no jank on a mid-range phone, no JS shows the list); the bento demos, the hand-over, the marquee and the closing chart running only in view, with no step after leaving; Chrome, Safari, Firefox and iOS Safari; keyboard-only; VoiceOver (the preview as a labelled region, the KPI announcements, the scroll scene as a list, no loop announcements); a signup reaching `leads` and the sink; Lighthouse (mobile) Performance ≥ 90, Accessibility ≥ 95, CLS ≤ 0.05
- [ ] The product confirmed as described, feature by feature: the views Dashboard / Objekte / Zähler / Dokumente / Abrechnung; daily, weekly and monthly values; the eight tiles, including the Verbrauchsprognose with its uncertainty band and the CO₂ Einsparung (and how it's computed); "Strom" among the media; notifications (move-ins, consumption changes, transfers); the Leckage-Wächter; taking over existing meters into the same dashboard; billing per click with a plausibility check; sharing the dashboard with colleagues by e-mail; the recommendations per property; the ERP/CRM hand-over; Betriebskosten, Rauchmelder and Feuerlöscher "im Funktionsmenü"; feedback "direkt im Dashboard"; the preview as a fair picture of the real app on `platform.heidisystems.com`
- [ ] Legal statements checked: "rechtssicher nach HKVO und mit Plausibilitätsprüfung", "Kosten nach HKVO verteilt", "Jede Mietpartei sieht ihren Verbrauch monatlich nach HKVO, mit Vergleich zum Vorjahr", "Die monatliche uVI nach HKVO für alle Mietparteien", "Kündigung per Vollmacht", "Heidi kündigt fristgerecht", "Getauscht wird erst zum Ende des bisherigen Vertrags" against "Heidi übernimmt die Zähler sofort" (and `/vorgehen`'s "egal wie lange Ihr aktueller Vertrag noch läuft"), "Ein tropfender Spülkasten kostet unbemerkt bis zu 200 € pro Jahr"
- [ ] Company claims confirmed: "Im Einsatz bei Hausverwaltungen in ganz Deutschland", "automatisch aus den Funkwerten erfasst", "Mieter werden 14 Tage vor der Montage informiert" (KPI, confirmed 2026-10-12), "ohne Export und ohne Abtippen"
- [ ] Example data signed off and made consistent: Lindenallee 12 (18 WE in the preview and the bento, 36 Einheiten in the list and on `/vorgehen`); "Abrechnung 2026 bereit" in October 2026 next to "Abrechnungszeitraum 2025" and "Heizkostenabrechnung 2025"; the cost chart's heating peak in April and the preview's Heizvolumen jumping in August; "01. Jan. – 04. Okt." against "05.10.2026"; "Heizkosten 2026 · Beispiel" 18.420 €; the generated meter values; the IDs "WE PL12VH3DGr" / "WE SH39LF10Gl"; all read as current only in autumn 2026: update or make relative for 2027
- [ ] The seven building thumbnails licensed for use (`src/lib/assets/landing/dashboard/`); the avatars are covered by §4.15
- [ ] Permission to show the 12 customer logos, the Werne logo with its quote, and the Höhne and Gerhard quotes with their badges (shared with the gates below)
- [ ] Security block statements: covered by the region pages' item in §4.15 (same `TrustSeals`)
- [ ] The CTA targets decided: "Feedback geben" (its open question 3: as designed to `START_HREF`, or drop the button, or link to `/hilfe`); "Lieber direkt eine Demo buchen" back if a booking URL exists by then (its open question 2)
- [ ] Page copy, SEO title and description signed off by the content owner
- [ ] Slug decided: `/dashboard` by default (its open question 1: alternatives `/plattform`, `/heidi-dashboard`)
- [ ] Make.com `switchinquiry` route live and able to tell `/dashboard` leads apart (`page: "/dashboard"`)
- [ ] At the cutover: remove `noindex`, add the sitemap entry

## 4.7 Carried over: `/mieterportal` go-live gate

From the `/mieterportal` plan (`346e9174`, §4.4; its open questions are quoted here). The page goes live with the cutover. Every item must be done before the cutover, when it loses `noindex` and joins the sitemap (every page is indexed after the cutover); until then it keeps `seo.noindex = true` and stays out of the sitemap (the footer and `/vorgehen` links stay, for review):

- [ ] Open checks from its §4.1 (the automated tests are done, except the signup e2e test against a running local Postgres, which wasn't run): visual match with the design at 1440, 1100, 980, 700 and 375 px; the hero list (finished state on load, then the 9 s loop only in view); the statement lighting up and dimming with the scroll; the four tiles, the rotator and the mini dashboard looping only in view, with no step after leaving; 12, 3 and 14 counting once; the big photo's zoom once; Chrome, Safari, Firefox and iOS Safari; keyboard-only (focus rings visible on dark); VoiceOver (the H1 as "Das Heidi Mieterportal für Ihre Mieter", the portal mock as one figure, the rotator's phrases once, the mini dashboard as one image, no loop announcements); JS disabled; contrast on dark (`--mute` text, the lime links, the form's status and error lines, the focus rings); a signup reaching `leads` and the sink; Lighthouse (mobile) Performance ≥ 90, Accessibility ≥ 95, CLS ≤ 0.05
- [ ] The product confirmed as described: the tenant portal with Verbrauch, Dokumente and Mitteilungen; notifications to tenants when a new Verbrauchsinformation is ready; installation appointments with a time window in the portal; the comparisons with Vormonat, Vorjahresmonat and Durchschnittsnutzer; "Für Ihr Team entsteht dabei keine Arbeit" / "0 Handgriffe" / "Ihr Team muss nichts tun"; "Fragen, die sonst bei Ihrem Team landen, beantwortet das Portal"; one product name (Mieterportal or Nutzerportal; its open question: `/nutzerportal` would match "Heidi Nutzerportal" on `/selbstabrechnung`'s sample statement)
- [ ] Legal statements checked: "Mit allem, was die Heizkostenverordnung verlangt", "So, wie es § 6a HeizkostenV verlangt", "Alle Pflichtangaben enthalten", "12 × Verbrauchsinformationen pro Jahr und Wohnung", "Seit 2022 müssen Mieter mit fernablesbaren Zählern monatlich informiert werden", the FAQ's "in Kilowattstunden" (heating; hot water is billed in m³ elsewhere on the site), "Erfüllen wir damit die Pflicht …? Ja.", the tenant card's "steht Ihnen eventuell eine Kürzung zu" (§ 12 HeizkostenV)
- [ ] Company claims confirmed: "Heidi liest die Funkzähler aus der Ferne ab", "Ohne Termin in der Wohnung", "Auf Servern in Deutschland, verarbeitet nach DSGVO und BDSG", the mini dashboard as the real dashboard (370 Wohnungen, the meter counts, "Dashboard teilen"; align with `/dashboard`, §4.6). (14 Tage, 1–2 h: confirmed 2026-10-12.)
- [ ] Example data signed off: "Verbrauchsinfo September" / "131 kWh" / "11 % weniger" (the phone's "11 % unter Vorjahresmonat" against the statement tile's 131 vs. 148, which is 11.5 %), the calendar's current month October, "01. Jan. – 04. Okt.", "Wohnung 2. OG links", "Do, 9 bis 11 Uhr" (a 2 h window, matching "1–2 h"); all read as current only in autumn 2026: update or make relative for 2027
- [ ] Photos licensed for use (3 new ones in `src/lib/assets/landing/mieterportal/`; `facade.webp` and `office.webp` are covered by §4.9, the avatars by §4.15); the woman at the laptop isn't presented as a real tenant or customer
- [ ] The tenant card decided (its open questions: "Zum Mieter-Check" renders without its button until a Mieter-Check page exists, alternatively `/hilfe?q=Mieter-Check` or dropping the card; and whether a card that speaks to tenants and promises a "Kürzung" belongs on a page for landlords)
- [ ] Permission to show the Höhne, Werne and Gerhard quotes without a badge (shared with the gates below)
- [ ] Security block statements: covered by the region pages' item in §4.15 (same `TrustSeals`)
- [ ] Page copy, SEO title and description signed off by the content owner
- [ ] Slug decided: `/mieterportal` by default (see the product name above)
- [ ] Make.com `switchinquiry` route live and able to tell `/mieterportal` leads apart (`page: "/mieterportal"`)
- [ ] If a booking URL exists by then: the closing card's video button back, with the clip and poster licensed (its default: the signup form in the glass card)
- [ ] At the cutover: remove `noindex`, add the sitemap entry

## 4.8 Carried over: `/funktionen` go-live gate

From the `/funktionen` plan (`6a74f274`, §4.4; its open questions are quoted here). The page is indexed and in the sitemap from the start (it replaced the live `/funktionen` of the Next site), so every item must be done before the cutover PR (#440) merges; as an emergency fallback only, reverting its route commit (`b96c1cd3`) ships the old page:

- [ ] Open checks from its §4.1 (the automated tests are done, except the signup e2e test against a running local Postgres, which wasn't run): visual match with the design at 1440, 1100, 980, 700 and 375 px; the hero chart by mouse and keyboard (a fast double switch ends on the right number, "2,1" / "3,4" with a comma throughout the tween); the dashboard tabs (auto-advance only in view, hover and focus pause, a click or key stops it and leaves the bar full, Home/End, background tab, panel 3 replaying); the five steps' line playing once; Chrome, Safari, Firefox and iOS Safari; keyboard-only; VoiceOver (the radiogroup "Sparte", the hidden month values, the tabs, the numbered steps); reduced-motion emulation; JS disabled; a signup reaching `leads` and the sink; every internal link to `/funktionen` still landing there; Lighthouse (mobile) Performance ≥ 90, Accessibility ≥ 95, CLS ≤ 0.05; no hydration warnings at 980, 700 and 375 px
- [ ] Legal statements checked: the FAQ's "Nach der Heizkostenverordnung müssen Zähler und Heizkostenverteiler ab dem 1. Januar 2027 fernablesbar sein" (§ 5 HeizkostenV and its exceptions), the lead's "gesetzlich vorgeschriebene, fernablesbare Zähler", the badge "Gesetzeskonform · Nach Heizkostenverordnung" (the old page said "§ 229 Artikel 3"), "Kosten nach HKVO verteilt", "Auf Knopfdruck nach HKVO"
- [ ] Company claims confirmed: regular maintenance by Heidi, "Mit einem persönlichen Ansprechpartner", DocuScan, the ERP/CRM connection ("Immobilienmanagement", "An Ihre Software übergeben", "Die Daten übergeben wir direkt an Ihr ERP- oder CRM-System"), monthly consumption info to tenants and "Hinweise zu Fristen und Auffälligkeiten" (align with `/mieterportal`'s product item, §4.7), the dashboard's analysis ("Trends früh erkennen", per Liegenschaft and Einheit), "SSL-Verschlüsselung · Für alle Verbindungen", "Server in Deutschland · Alle Daten bleiben hier" (the old page said "Server in Europa"), the device list, the pricing sentence (shared with §4.9, §4.10, §4.11 and §4.14). (92 %, 14 Tage, 1–2 h: confirmed 2026-10-12.)
- [ ] "Betriebskostenabrechnung" as a service and a feature card aligned with the FAQ answer (Heidi supplies the data and creates the Heizkostenabrechnung)
- [ ] Example data signed off: the chart's apartment and values, the October highlight and empty November/December under "Verbrauch 2026" (fine until the end of 2026; update or make relative for 2027), "Whg. 7 · September" in the dashboard with the hero's October values, the four Liegenschaften, and "Lindenallee 12" aligned with `/vorgehen` and `/selbstabrechnung`
- [ ] The expired answer (`faq.items[0].answerExpired`) written and signed off (its open question: from 1.1.2027 "Heidi rüstet Ihren Bestand rechtzeitig um" is past; a placeholder today)
- [ ] Feature card targets decided (its default: the six "Alle Funktionen" cards without links, since the design's product pages don't exist; alternatively "Laufende Verbrauchsdaten" → `/geraete`; "Benachrichtigungen" could now go to `/mieterportal`, and "Dashboard" to `/dashboard`)
- [ ] Permission to show the Höhne quote with the "Verifizierter Heidi-Kunde" badge (shared with the gates below)
- [ ] Security block statements: covered by the region pages' item in §4.15 (same `TrustSeals`)
- [ ] Page copy, SEO title and description signed off by the content owner (a ranking URL: also compare with the old page's search terms in Search Console)
- [ ] Make.com `switchinquiry` route live and able to tell `/funktionen` leads apart (`page: "/funktionen"`)
- [ ] After go-live: delete `Funktionen/AnimationsSection.svelte`, `Funktionen/Grid.svelte`, `Hero/FunktionenHero.svelte` and its kitchen-sink entry, and whatever only they used (check `Animation_10`: `FunktionenHighlight` and `InstallFaq` use it too)
- [ ] If a booking URL exists by then: the closing card's video button back, with the clip and poster licensed (its default: the signup form in the dark card)

## 4.9 Carried over: `/vorgehen` go-live gate

From the `/vorgehen` plan (`93952e28`, §4.4; its open questions are quoted here). The page goes live with the cutover. Every item must be done before the cutover, when it loses `noindex` and joins the sitemap (every page is indexed after the cutover); until then it keeps `seo.noindex = true` and stays out of the sitemap (the footer link stays, for review):

- [ ] Open checks from its §4.1 (the automated tests are done, except the signup e2e test against a running local Postgres, which wasn't run): visual match with the design at 1440, 1100, 980, 700 and 375 px; the step tabs (auto-advance only in view, hover and focus pause, a click or key stops it, Home/End, background tab, the bar in step with the timer); the day count against `daysUntilObligation` and its switch to the expired state at 31.12.2026 23:59:50 Berlin; Chrome, Safari, Firefox and iOS Safari; keyboard-only; VoiceOver (tabs, the comparison table's caption and headers, "ja"/"nein"); reduced-motion emulation; JS disabled; a signup reaching `leads` and the sink; Lighthouse (mobile) Performance ≥ 90, Accessibility ≥ 95, CLS ≤ 0.05
- [ ] Legal statements checked: "Die EU-Energieeffizienzrichtlinie und die Heizkostenverordnung verlangen, dass Zähler und Heizkostenverteiler ab dem 1. Januar 2027 aus der Ferne ablesbar sind" (§ 5 HeizkostenV applies to installed devices with exceptions; the page states it without them), "Bis 2027 muss jeder Zähler fernablesbar sein", and the comparison with "Klassisch" ("oft 6 bis 9 Monate", "regelmäßig" Ablesetermine, no uVI, no contact person: comparative advertising, as the region pages' provider comparison in §4.15)
- [ ] Company claims confirmed: "Heidi übernimmt bestehende Zähler und wertet sie aus, egal wie lange Ihr aktueller Vertrag noch läuft" and "Wechsel ohne Warten aufs Vertragsende", "Heidi prüft Bestand und Verträge", "Unsere Monteure", "einen festen Ansprechpartner", DocuScan, the Installationstool ("Digitaler Zwilling, zwei Fotos pro Zähler, sauberes Übergabeprotokoll"), "Ab 1.000 Einheiten … individuelles Angebot", the pricing sentence (shared with §4.8, §4.10, §4.11 and §4.14), "Auf Servern in Deutschland, verarbeitet nach DSGVO und BDSG", "3-in-1". (92 %, 14 Tage, 1–2 h: confirmed 2026-10-12.)
- [ ] Photos licensed for use (7 new ones in `src/lib/assets/landing/vorgehen/`, plus the shared contact photo and avatars of §4.15); the "Heidi"-branded devices in `kitchen-meters.webp` show real Heidi hardware or are replaced; `dashboard.webp` matches the real dashboard
- [ ] Example data aligned with `/selbstabrechnung` and `/funktionen` ("Lindenallee 12 · 36 Einheiten" here, "6 Wohnungen" there, "Whg. 7" on `/funktionen`)
- [ ] The expired texts (`remoteDuty.h2Expired`, `remoteDuty.textExpired`) written and signed off (its open question: from 1.1.2027 the H2 "Bis 2027 muss jeder Zähler fernablesbar sein." and "Heidi rüstet Ihren Bestand rechtzeitig um" are past tense; placeholders today)
- [ ] Feature card targets confirmed (its default: Digitale Funkablesung → `/geraete`, Dokumenten-Management and Heizkostenabrechnung → `/funktionen`, the other three without a link) and the "Angebot einholen" target decided (its default: the signup form; alternatively both "Angebot einholen" buttons go to `/fragebogen` and only "Demo buchen" stays on the form)
- [ ] Permission to show the Werne, Höhne and Gerhard quotes without the "Verifiziert" badge (shared with the gates below)
- [ ] Security block statements: covered by the region pages' item in §4.15 (same `TrustSeals`)
- [ ] Page copy, SEO title and description signed off by the content owner
- [ ] Slug decided: `/vorgehen` by default, `/so-funktioniert-heidi` or `/ablauf` are the alternatives
- [ ] Make.com `switchinquiry` route live and able to tell `/vorgehen` leads apart (`page: "/vorgehen"`)
- [ ] At the cutover: remove `noindex`, add the sitemap entry

Its open question on Geist Mono (the font as designed, ~30 KB, or the system monospace stack) stays open; the font is built.

## 4.10 Carried over: `/selbstabrechnung` go-live gate

From the `/selbstabrechnung` plan (`9d0bab9c`, §4.4; its open questions are quoted here). The page goes live with the cutover. Every item must be done before the cutover, when it loses `noindex` and joins the sitemap (every page is indexed after the cutover); until then it keeps `seo.noindex = true` and stays out of the sitemap (the footer and `/hilfe` links stay, for review):

- [ ] Open checks from its §4.1 (the automated tests are done, except the signup e2e test against a running local Postgres, which wasn't run): visual match with the design at 1440, 1100, 980, 700 and 375 px; the region pages unchanged after the `People` / `TrustSeals` / `FloatingCta` move; the hero demo sequence (auto-run without confetti, a click with confetti, "Erneut ansehen", leaving the tab mid-sequence); the calculator at min/max and by keyboard; Chrome, Safari, Firefox and iOS Safari; keyboard-only; VoiceOver (demo status and toast once each, the mode note once per toggle, slider values as "24.000 €" / "70 %"); reduced-motion emulation; JS disabled; the loops stop off-screen and in a background tab; a signup reaching `leads` and the sink; Lighthouse (mobile) Performance ≥ 90, Accessibility ≥ 95, CLS ≤ 0.05
- [ ] Legal statements checked: 50–70 % by consumption for heating and hot water (§§ 7, 8 HeizkostenV), "Pflicht sind 70 %, wenn …" with its three conditions (§ 7 Abs. 1 S. 2), "Sonst dürfen Mieter um 15 % kürzen" (§ 12 Abs. 1), the twelve months (§ 556 Abs. 3 BGB, leaving out the exception, as on `/hilfe`), the § 6a contents "seit 2022", the CO₂ split "seit 2023" (CO2KostAufG), the calculator note
- [ ] Company claims confirmed: integration "in bestehende ERP- und CRM-Systeme" and "Muss ich meine Software wechseln? Nein.", the uVI sent by Heidi also when the customer bills itself, the Vollservice "per Klick, direkt im Dashboard" (its open question 3: otherwise the toggle goes), "Mit Ankündigung 14 Tage vorher" (KPI, confirmed 2026-10-12), "Ein fester Ansprechpartner, der Ihre Liegenschaften kennt", the pricing sentence (shared with §4.8, §4.9, §4.11 and §4.14) and the "kostenlosen Portfolio-Check" (no page; reword or link once it exists)
- [ ] Example data consistent: the meter count (hero "18 Zähler", meter list 12 + 1 + 6 + 6 = 25 under "18 von 18"), the calculator's six flats and the computed 2,40 €/Einheit (the design's static text said 2,80 €), the hero results; signed off by the content owner
- [ ] Sample statement: letterhead (Heidi or neutral), sender address spelling ("Monbijouplatz 4" in the design, "Monbijoupl. 4" in ours), and that it reflects Heidi's real statement (portal login, "Heidi Nutzerportal" naming, the notes)
- [ ] The people photo licensed for use, presented as a Heidi adviser (shared with the region photos in §4.15)
- [ ] Permission to show the 12 customer logos and the Höhne and Werne quotes (shared with the gates below)
- [ ] Security block statements: covered by the region pages' item in §4.15 (same `TrustSeals`)
- [ ] Page copy, SEO title and description signed off by the content owner
- [ ] Slug decided: `/selbstabrechnung` by default, `/heizkostenabrechnung-selbst-erstellen` targets the search phrase better
- [ ] Make.com `switchinquiry` route live and able to tell `/selbstabrechnung` leads apart (`page: "/selbstabrechnung"`)
- [ ] At the cutover: remove `noindex`, add the sitemap entry

Its open questions for after the cutover stay: the closing card goes back to the design's plain dark card once a booking URL exists (`DEMO_HREF`), and the Heizkostenabrechnungs-Checker row and "Mehr zu Sicherheit" come back once those pages exist.

## 4.11 Carried over: `/hilfe` go-live gate

From the `/hilfe` plan (`3b70270e`, §4.4; its open questions are quoted here). The page goes live with the cutover. Every item must be done before the cutover, when it loses `noindex` and joins the sitemap (every page is indexed after the cutover); until then it keeps `seo.noindex = true` and stays out of the sitemap (the footer link stays, for review). After go-live, `?q=` URLs stay `noindex`:

- [ ] Open checks from its §4.1 (the automated tests are done): visual match with the design at 1440, 1100, 980, 700 and 375 px; Chrome, Safari, Firefox and iOS Safari; keyboard-only; VoiceOver (the result count is announced once after typing, the thanks after a vote); reduced-motion emulation; JS disabled (`?q=` via the form, a vote posts); a vote reaching the Make.com sheet; Lighthouse (mobile) Performance ≥ 90, Accessibility ≥ 95, CLS ≤ 0.05
- [ ] Legal statements checked: the 31.12.2026 retrofit deadline, § 6a HeizkostenV (monthly uVI for remotely readable meters), the 3 % cut under § 12 HeizkostenV, "spätestens zwölf Monate … danach kann keine Nachzahlung mehr verlangt werden" (§ 556 Abs. 3 BGB and its exception), "nach DSGVO und BDSG"
- [ ] Company claims confirmed: "ab zwei Wohneinheiten", "mehr als 1.000 Einheiten … individuelles Angebot", Kündigung per Vollmacht and the template, DocuScan, the Selbstabrechnung product (§4.10), ERP/CRM connection, the dashboard's features, "speichert alle Daten auf Servern in Deutschland", installation free with billing per installed meter plus Abrechnungspauschale (shared with §4.14). (92 %, 14 Tage, 1–2 h: confirmed 2026-10-12.)
- [ ] The expired answer of `fernablesbar-frist` written and signed off
- [ ] Feedback routing live: the Make.com `helpfeedback` route writes to a sheet, and someone reads it; or the vote is removed (its open question: alternatives are dropping the vote or a "Nein" follow-up with a text field)
- [ ] An owner named for the answers (they state law and prices; a wrong one is worse than none)
- [ ] Page copy, SEO title and description signed off by the content owner
- [ ] Slug decided: `/hilfe` by default, `/hilfe-center` or `/faq` are the alternatives
- [ ] At the cutover: remove `noindex` (keep it for `?q=`), add the sitemap entry

Its open questions for after the cutover stay: a Prismic `help_article` type instead of `content.ts`, the site footer's "FAQ" pointing here instead of `/blog` (a deliberate deviation from Next, to be listed in `scripts/layout-diff.ts`), and "Gespräch vereinbaren" going to `DEMO_HREF` once a booking URL exists.

## 4.12 Carried over: `/karriere` go-live gate

From the `/karriere` plan (`d9e105d8`, §4.4; its open questions are quoted here). The page goes live with the cutover. Every item must be done before the cutover, when it loses `noindex` and joins the sitemap (every page is indexed after the cutover); until then it keeps `seo.noindex = true` and stays out of the sitemap (the footer and `/ueber-uns` links stay, for review):

- [ ] The Frontend Engineer position confirmed open, its texts approved by the hiring owner, and an owner named for keeping the job list current
- [ ] Open checks from its §4.1 (none ticked when the plan left this folder): visual match with the design at 1440, 1100, 980, 700 and 375 px; Chrome, Safari, Firefox and iOS Safari; keyboard-only; VoiceOver (the feed isn't announced per tick); reduced-motion emulation; JS disabled; the feed stops off-screen and in a background tab; Lighthouse (mobile) Performance ≥ 90, Accessibility ≥ 95, CLS ≤ 0.05
- [ ] Company claims confirmed: "Ein kleines Team in Berlin", "Funkzähler, Montage, Dashboard und Abrechnung gehören bei uns zusammen", the area texts (own installation partners, fixed contact for Verwaltungen, HKVO billing), the feed's examples, and the three process steps as the real process
- [ ] Application routing live: the Make.com `jobapplication` route forwards to the hiring inbox; inbox and fallback address decided (`jobs@heidisystems.com` in `content.ts` is a placeholder; an applicant tracking system would replace the form); a test application received end to end
- [ ] Privacy: the applicant section in the Datenschutzhinweise (purpose, retention, Make.com as processor with a data processing agreement) and the line under the form, signed off by legal (the line is a draft, not a consent line)
- [ ] Page copy, SEO title and description signed off by the content owner
- [ ] Slug decided: `/karriere` by default, `/jobs` is the alternative
- [ ] At the cutover: remove `noindex`, add the sitemap entry

## 4.13 Carried over: `/ueber-uns` go-live gate

From the `/ueber-uns` plan (`7a777e92`, §4.4; its open questions are quoted here). Every item must be done before the cutover, when the page loses `noindex` and joins the sitemap (every page is indexed after the cutover); until then it keeps `seo.noindex = true` and stays out of the sitemap (the footer link stays, for review):

- [ ] Open checks from its §4.1: visual match with the design at 1440, 1100, 980, 700 and 375 px; Chrome, Safari, Firefox and iOS Safari; keyboard-only (banner link, CTAs, replay button, the 4 principle buttons, team links, the form); reduced-motion emulation; JS disabled; Lighthouse (mobile) Performance ≥ 90, Accessibility ≥ 95, CLS ≤ 0.05
- [ ] Company claims confirmed: free installation ("0 € Installationskosten", "Kostenlos"), "Ein fester Ansprechpartner", "Wechsel auch bei laufendem Vertrag" / "unabhängig vom Vertragsende", "Kündigung beim bisherigen Anbieter per Vollmacht", "Daten direkt in Ihrem ERP- oder CRM-System", "Monatliche Verbrauchsinfo automatisch an alle Mieter", "Kunden in ganz Deutschland", the team paragraph (own development, installation partners). (92 %, 14 Tage, 1–2 h: confirmed 2026-10-12.)
- [ ] Paul Gerlach's card: "Gründer und Geschäftsführer" confirmed (the Impressum only says "Vertreten durch: Paul Gerlach"); initials or a licensed photo (96 px round)
- [ ] Careers target: `/karriere` (§4.12) goes live at the same time, or `CAREERS_HREF` falls back to LinkedIn, or the careers teaser and the two career links are hidden (`content.careers.show`)
- [ ] Gerhard's badge: "Verifizierter Gewerbekunde" (`data/testimonials.ts`) or the design's "Verifizierter Heidi-Kunde", settled with the references sign-off (§4.15)
- [ ] Permission to show the 12 customer logos and the Werne and Gerhard quotes (shared with the gates below)
- [ ] Page copy, SEO title and description signed off by the content owner; the expired texts (`mission.leadExpired`, `mission.expired`) written
- [ ] Slug decided: `/ueber-uns` by default, `/unternehmen` or `/about` are the alternatives
- [ ] Final CTA: the shared signup form stays, unless a booking URL exists by then (`DEMO_HREF` switches all demo CTAs, and the design's dark card can come back without a form)
- [ ] Make.com `switchinquiry` route live and able to tell `/ueber-uns` leads apart (`page: "/ueber-uns"`)
- [ ] At the cutover: remove `noindex`, add the sitemap entry

Its discoverability question stays open for after the cutover: the site footer and header could link to it too (a deliberate deviation from Next, to be listed in `scripts/layout-diff.ts`).

## 4.14 Carried over: `/upgrade-now` go-live gate

Unchanged from the `/upgrade-now` plan (`ddde6575`, §5.4; its open questions are quoted here). Every item must be done before the cutover, when the page loses `noindex` and joins the sitemap (every page is indexed after the cutover); until then it keeps `seo.noindex = true` and stays out of the sitemap:

- [ ] Legal statements checked against the HeizkostenV: the four dates, § 5 Abs. 2/3, § 6a, § 12 Abs. 1, the 3 % and +15 % cuts and that they add up, the WEG note, all 7 FAQ answers, the calculator note
- [ ] KPIs confirmed: free installation, "Abgerechnet wird pro tatsächlich installiertem Zähler, dazu eine Abrechnungspauschale" (92 %, 14 days, 1–2 h: confirmed 2026-10-12)
- [ ] "Wechsel inklusive: … kündigen mit Ihrer Vollmacht oder übernehmen bestehende Verträge" and "direkt in Ihre ERP- und CRM-Systeme" confirmed by sales
- [ ] Permission to show the 12 customer logos and the 3 testimonials
- [ ] Page copy, SEO title and description signed off by the content owner
- [ ] The expired-state copy (`hero.expired`, `deadlines.h2Expired`, `calculator.switchLabelExpired`, the step's `timingExpired`, `finalCta.titleExpired`; placeholders today) written and signed off
- [ ] Slug decided: `/upgrade-now` is English on a German site; a German slug (`/jetzt-umruesten`, `/umruestpflicht`) costs one constant now and a redirect later
- [ ] Make.com `switchinquiry` route live and able to tell `/upgrade-now` leads apart (`page: "/upgrade-now"`)
- [ ] At the cutover: remove `noindex`, add the sitemap entry

Its risk stays: if the cutover slips past December, decide then whether the page is still worth launching.

## 4.15 Carried over: city pages and the Germany page

The pages go live with the cutover, all of them indexed: every city gets `live: true` in `cities/index.ts` then (in the sitemap and on the Germany map), so every item below must be done for every city before the cutover. Until then, cities other than Berlin keep `live: false` (`noindex`, still rendered for review, linked from the footer "Städte" group). Items marked *(all)* apply to every city once; the rest are per city, tracked in the status table of the city plan (`be2c1feb`, `07-other-cities.md` §7.6: all 25 cities generated and reviewed, only Berlin live, no business column ticked yet; Gera was added on 2026-10-12 as the 26th, generated the same way and not yet reviewed). Phase references below (7.2, 8.3) are to that plan:

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

## 4.16 Carried over: `/messdienstwechsel` go-live gate

Unchanged since the `/messdienstwechsel` plan (`65470139`). It is already indexed and in the sitemap; these must be resolved before the cutover PR is merged:

- [x] Real KPI numbers instead of `XX` (92 %, 14 Tage, 1–2 h; confirmed by business 2026-10-12)
- [ ] Approved testimonial photo, name and company
- [ ] Permission to show the 12 customer logos (the "Über 200" claim was dropped by the design update of 2026-10-12)
- [ ] The real demo video
- [ ] The Make.com `switchinquiry` route is live
