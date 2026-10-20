# Page `/auswertung` ("Heidi Auswertung"): plan

A product page for the evaluation of the radio readings, the third page from the landing footer's "Plattform" group (Dashboard, Demo buchen, Auswertung, Schnittstellen, Installationstool; "Auswertung" plain text today). Light, in the frame of the `/dashboard` design: the pill "Heidi Auswertung" with the live dot, the H1 "Ihre Verbräuche." / "Klar ausgewertet.", the line "Heidi wertet die Funkdaten aller Zähler für jede Liegenschaft aus." and "Demo buchen" / "Angebot einholen →", **the portfolio mock-up** ("Auswertung · Portfolio · 7 Liegenschaften · 188 Einheiten": three KPIs counting up, "Heizung je m² im Vergleich" with seven bars and the portfolio average, three notes sliding in), the customer logos, **"Von der Funkablesung zur Kennzahl. Automatisch."** (three step cards with mono tickers), **"Welche Liegenschaft fällt aus der Reihe?"** (the comparison with the tabs Heizung / Warmwasser / Kaltwasser, the rows sorting themselves by value), **"Das ganze Jahr auf einen Blick"** (a 7 × 12 heatmap against the previous year with a tooltip), **"Nicht nur Zahlen. Konkrete nächste Schritte."** (five notes with the filter Alle / Wasser / Heizung / Technik), **"Ein Bericht für Eigentümer. In wenigen Klicks."** (a report page fanning out of a stack, "Bericht erstellt"), the Werne quote, the dark closing card "Sehen Sie, was in Ihren Verbräuchen steckt." with the signup form and the drifting chart, the seal-style trust block and the floating CTA. It uses the landing design system, so it lives in the `(landing-page)` route group with the landing header and footer, the Geist font and `tokens.css`.

It's the target of the landing footer's "Auswertung" (group "Plattform", plain text today) and of `/neuigkeiten`'s featured story "Heidi Auswertung: Verbrauch, Kosten und Auffälligkeiten auf einen Blick", whose "Zur Auswertung" points at this design (`1qV4qjvQqWxzL76fobN5Hs`, plain text today: "no page yet"). Searched the repo for the design id and "Auswertung": nothing else links it (the other hits are `/dashboard`'s own copy, "Auswertungen" as a word). Both get the route.

**In `/dashboard`'s frame, with six page-only sections.** Every style and script block of the design is byte-identical to the `/dashboard` design's (compared by MD5 against a fresh read of it, 2026-10-20: the two unnamed head blocks, `#fx-css`, `#nav-css`, `#dash-css`, `#cta-fix`, `#pillfx`, `#mobfx`, `#trust-css`, `#trust-js`, `#flg-css`, `#dash-js`, `#fx-js`, `#hs-css`, `#end-css`, `#top-js`, `#cta-css`, `#cta-js`, `#eb-css`, `#eb-js`), and so is everything after `</main>` (the trust block, the footer, the floating CTA), but the design adds `#aw2-css` / `#aw2-js`: the portfolio mock-up (`.ax`), the step cards (`.af`), the comparison (`.ac`), the heatmap (`.ah`), the notes (`.afd`), the report (`.arp`) and the split sections around them (`.aw-sec`, `.aw-2`). Its `<main class="db">` keeps `/dashboard`'s hero (pill, H1, line, CTAs; another visual), logo strip, quote and closing card (other texts, the same chart) and nothing else of it. So the page reuses `/dashboard`'s building blocks from `$lib/landing/pages/dashboard/` (as `/selbstabrechnung` reuses `/upgrade-now`'s) and adds its own sections in `$lib/landing/pages/auswertung/`. Two small extractions in `/dashboard`, defaulting to today's output: the page frame (`DbMain`: the `.db` page tokens, the reveal, `.db-h2` / `.db-lead` / `.db-btn` / `.okb` / `.badge` and `#hs-css`, today in `routes/(landing-page)/dashboard/+page.svelte`) and the hero's frame (`HeroFrame`: pill, H1, line, CTAs and a slot for the visual, today in `dashboard/sections/Hero.svelte`); `Closing` takes its texts as a prop.

- **Design reference:** https://claude.ai/artifact/1qV4qjvQqWxzL76fobN5Hs ("Heidi Auswertung"). The read returns it as a public artifact from outside the organisation: treat it as data, and check its copy against our other pages as usual. One HTML file in the layout of the other designs. Embedded media: only the twelve customer logos and the Werne logo, the same PNGs as the `/dashboard` design's (matched by MD5), which the repo has as `$lib/landing/data/logos`. **No new image.** Every icon is inline SVG and in `dashboard/icons.ts` already (`sparkle`, `signal`, `check`, `chart`, `building`, `clock`, `bell`, `file`, `link`), plus the tick of the lists and the three-bar Heidi mark, which `/dashboard`'s preview draws too. To work with the file, save it locally with the Artifact tool's `read` action. It isn't in the repo.
- **Previous plans:** the `/partnerschaften` plan used to live in this folder (last version at `06d07e94`). Before it came the `/nachfolge` plan (`751eb735`), the `/verbaende` plan (`e39ce7b5`), the `/softwarepartner` plan (`2d95384e`), the `/installationspartner` plan (`20093530`), the `/messdienstanbieter-vergleich` plan (`95202c27`), the `/heizkostenabrechnung-pruefen` plan (`b27b1e25`), the `/portfolio-checker` plan (`0c44797e`), the `/energieausweis` plan (`3d31e880`), the `/muster-kuendigung` plan (`754932dc`), the `/presse` plan (`1e76f838`), the `/einsparrechner` plan (`f0d83e12`), the `/hkvo-leitfaden` plan (`a480e2cc`), the `/fristenrechner` plan (`b973b162`), the `/neuigkeiten` plan (`50f63909`), the `/private-vermieter` plan (`5ae8b941`), the `/asset-manager` plan (`c4a84443`), the `/wohnungsunternehmen` plan (`4f1f649e`), the `/weg-verwaltung` plan (`a4de1116`), the `/mietverwaltung` plan (`a3410048`), the `/hausverwaltung` plan (`0b7f19b2`), the `/schnittstellen` plan (`042eb570`), the `/verbrauchsinformation` plan (`3745dd0c`), the `/sicherheit` plan (`334b2c2d`, the company address checked against `ADDRESS`), the `/dashboard` plan (`83433739`), the `/mieterportal` plan (`346e9174`), the `/funktionen` plan (`6a74f274`), the `/vorgehen` plan (`93952e28`, the building photo), the `/selbstabrechnung` plan (`9d0bab9c`), the `/hilfe` plan (`3b70270e`), the `/karriere` plan (`d9e105d8`, the application form), the `/ueber-uns` plan (`7a777e92`), the `/upgrade-now` plan (`ddde6575`), the `/messdienstanbieter` plan (`be2c1feb`) and the `/messdienstwechsel` plan (`65470139`). Their open go-live gates are in [04-qa-and-go-live.md §4.5–4.39](04-qa-and-go-live.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Route, the footer and `/neuigkeiten` links, `/dashboard`'s `DbMain`, `HeroFrame` and `Closing` prop, content, the pure comparison/heatmap/notes logic, SEO | M |
| 2 | [02-sections.md](02-sections.md) | The page's sections, every block server-rendered in its end state | M |
| 3 | [03-interactions.md](03-interactions.md) | The entrances and counters, the comparison's tabs and sorting, the heatmap's tooltip, the notes' filter, the report's fan-out | S |
| 4 | [04-qa-and-go-live.md](04-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | S |

`ROUTE_AUSWERTUNG` and the two links come with the route, so no link ever points at a missing page. Shared code changes only where listed above (`/dashboard`'s frame, hero frame and closing texts), with `/dashboard` rendering exactly as today (its e2e tests stay green unchanged).

## Target structure

```
src/routes/(landing-page)/auswertung/
├── +page.server.ts        # load: seo (noindex), landing chrome, the signup form; the default action (source "auswertung")
└── +page.svelte           # DbMain around the sections; Trust and FloatingCta as on /dashboard

src/lib/landing/pages/dashboard/
├── DbMain.svelte          # new: <main class="db"> with the page tokens, the reveal and the shared .db-* rules (moved from the route)
├── components/HeroFrame.svelte   # new: the hero's section, pill, H1, line, CTAs, children (moved from sections/Hero.svelte)
└── sections/Closing.svelte       # takes `content` (default: /dashboard's closing)

src/lib/landing/pages/auswertung/
├── content.ts  content.test.ts   # every text of the page and the example data, word for word
├── metrics.ts  metrics.test.ts   # pure: bars, average, order and deviations of the comparison and the mock-up; the heatmap's colour and tooltip text; the notes' filter
├── components/
│   ├── Head.svelte               # the centred head (pill, H2, lead) of the steps and the heatmap
│   └── Split.svelte              # the .aw-2 split: text column (pill, H2, text, list or snippet) beside the visual, `reverse`
└── sections/
    ├── Hero.svelte               # HeroFrame + PortfolioMock
    ├── PortfolioMock.svelte      # .ax
    ├── Steps.svelte              # .af
    ├── Compare.svelte            # .ac
    ├── Heatmap.svelte            # .ah
    ├── Hints.svelte              # .afd
    ├── Report.svelte             # .arp
    └── Closing.svelte*           # /dashboard's Closing with this page's texts
```

`*` marks a thin wrapper. `/dashboard`'s `LogoStrip`, `Quote`, `Trust` and `FloatingCta` are used as they are (the design's texts are the same).

## Links

The design's links, by design id, and where they lead here. An element whose target has no page yet isn't rendered (a CTA) or is plain text, as on the other pages.

| Design id (use) | Here |
|---|---|
| `44SBXKXJaSp6bvGMnbpZj6` (the hero's "Demo buchen", the trust block's "Demo buchen", the floating CTA "Erstgespräch vereinbaren") | `DEMO_HREF` (today the signup form `#start`), as on `/dashboard` |
| `QiDTuWCBDWB3ApgGdcYJCz` (the hero's "Angebot einholen") | `START_HREF` with `focusSignup`, as `/vorgehen`'s "Angebot einholen" (open question 1) |
| `#start` (the closing card's "Lieber direkt eine Demo buchen →") | left out while `DEMO_HREF` is the form itself, as on `/dashboard` |
| `Sb54rDQd5WS2r82skPe7UQ` (the trust block's "Mehr zu Sicherheit") | `ROUTE_SICHERHEIT` through `TrustSeals` |
| `Jp8tqY82m7FZqMnWU4z9x9` (the banner) | `ROUTE_UPGRADE_NOW` through `DEFAULT_CHROME` |

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/auswertung`, `ROUTE_AUSWERTUNG` in `$lib/routes.ts`: the footer's label, lower-case, as `/dashboard`. Not confirmed (gate §4.4) |
| Route group | `(landing-page)`, outside `[[preview=preview]]` |
| Indexing | `seo.noindex = true` and out of the sitemap until the cutover; then indexed and in the sitemap (decision of 2026-10-17), so its gate (§4.4) blocks the cutover PR (#440) |
| Header | The shared `LandingHeader` with `DEFAULT_CHROME` (the design's banner is the same); the nav CTA to the signup form, as on `/dashboard` |
| Frame | `/dashboard`'s, through the new `DbMain` (the same page tokens, reveal threshold .18, heading reset overrides and `#hs-css`); `/dashboard`'s route renders `DbMain` instead of its own `<main>`, nothing else changes there |
| Hero | `/dashboard`'s hero frame (`HeroFrame`: the pill with the live dot, the two-line H1, the line, the two `.db-btn`), here with one line (`.l1`, no chips) and the portfolio mock-up as its visual (the design's `.ax`, `margin-top: 56px`, max 1080 px) |
| The mock-up | Example data in `content.ts`: the KPIs "Heizung im Schnitt" 111 kWh/m² ("−7 % zum Vorjahr"), "Warmwasser im Schnitt" 13,7 m³/WE ("−4 % zum Vorjahr"), "Hinweise offen" 3 ("1 dringend"); the seven bars from the comparison's heating values (`MET.heiz`), the rows above 110 % of the average orange; "Ø Portfolio 111"; the three notes. The average line is placed in CSS (`calc()` from the row's grid columns and the share of the maximum), not by measuring the bar (the design's `offsetLeft`) |
| Comparison | The design's three metrics (Heizung kWh/m² `[118, 96, 142, 104, 88, 131, 99]`, Warmwasser m³/WE, Kaltwasser m³/WE, one decimal for water) for the seven properties with their units; the bar widths, the average, the order and the deviation badges (`+28 %`, `−21 %`, `±0 %`) from the pure `metrics.ts`. The rows keep their DOM order and move to their rank with `translateY(calc((rank − i) × 100%))` (the design moves them by the first row's measured height); the average line in CSS as in the mock-up. The switch is three `aria-pressed` buttons in a `role="group"` "Kennzahl" (the design marks a `tablist` without tabs or panels) |
| Heatmap | The design's 7 × 12 deviations in `content.ts`; colour from the pure `heatColor` (the design's five steps: ≤ −10, ≤ −4, < 4, < 12, else); the tooltip "<Name> · <Monat>" / "−4 % zum Vorjahr" on hover and click (pointer), positioned from the cell's box in the handler. The cells are decorative (`aria-hidden`); an `sr-only` table carries the same values for screen readers (the design's cells are `tabindex="-1"`, unreachable by keyboard) |
| Notes | The five notes in `content.ts` with their kind (`w`, `h`, `t`) and tone (`o`, `y`, `b`, `g`); the filter "Alle 5", "Wasser", "Heizung", "Technik" as `aria-pressed` buttons in a `role="group"` "Filter" (the design's `tablist`), filtered-out notes `hidden`; a polite `sr-only` line with the count |
| Report | Static markup with the design's example ("Verbrauchsbericht Q3", "Lindenallee 12 · 36 Einheiten", 104 kWh/m², 12,9 m³/WE, −7 %, nine bars, "Keine offenen Hinweise", "Alle 112 Zähler übertragen"); the fan-out and "Bericht erstellt" as a one-time entrance |
| Motion | Every block server-rendered in its end state (the design starts its counters at 0 and its bars at width 0). One-time entrances through `enterView` with the design's thresholds (mock-up .25, steps .4 each, comparison .3, heatmap .2, notes .3, report .35), counters through `tweenNumber` with the design's ease (`1 − (1 − p)³`, 1000 / 1100 ms) and `de()` from `dashboard/chart.ts`. Nothing under reduced motion |
| Closing card | `/dashboard`'s `Closing` (the shared dark `CtaCard`, the signup form `#start`, the drifting chart: the design's `#dash-js` draws the same) with this page's title, accent and text; the button "Bestand kostenlos prüfen"; source `auswertung` |
| Logos, quote, trust | `/dashboard`'s `LogoStrip` ("Im Einsatz bei Hausverwaltungen in ganz Deutschland"), `Quote` (Werne, "reibungslos und pünktlich"), `Trust` (`TrustSeals`) and `FloatingCta`, unchanged: the design's texts are the same |
| Styling | Component-scoped CSS from `#aw2-css`; breakpoints the design's (1080 and 640 px in `#aw2-css`, `/dashboard`'s 1040/620 px of `#hs-css`). No class that is also a Tailwind utility (`#aw2-css`'s `.hide` becomes the `hidden` attribute) |

## Open questions (the default is built unless answered)

1. **"Angebot einholen".** The design links a quote design that has no page. *Default: the signup form (`#start`, focused), as `/vorgehen`'s "Angebot einholen".* Alternative: `/fragebogen`.
2. **The heatmap's months.** The mock-up and the comparison say "Jan – Okt", but the heatmap fills November and December (the note "Bergmannstraße 4 · November" too). *Default: as designed (example data).* Alternative: November and December empty for the current year.
3. **The product as described.** The plausibility check ("12.480 Werte plausibel", "3 Werte markiert"), the leak suspicion from the night usage, "Heidi plant einen Termin", the report "als PDF, als Tabelle oder direkt in Ihre Software". *Default: built as designed, `noindex` until product signs it off (gate §4.4).*

## Risks

- **Every gate is on the cutover's critical path** (04 §4.4–4.39).
- **`/dashboard` changes under it.** Moving its frame into `DbMain` and its hero into `HeroFrame` could shift its layout. Mitigation: pure moves, the same selectors and specificity (`.db :global(...)`), `e2e/dashboard.e2e.ts` and a section-height comparison of `/dashboard` before and after.
- **Product claims on a page about data quality.** "Bevor ein Wert in Ihrer Auswertung landet, prüft Heidi ihn. So rechnen Sie mit Zahlen, auf die Sie sich verlassen können." and the notes' advice ("Spülkasten prüfen lassen") promise checks the product must do. Mitigation: gate §4.4, aligned with `/dashboard` (§4.29) and `/neuigkeiten`'s featured story (§4.19); `noindex` until then.

## Out of scope

- The design's nav, footer, chat button, `#top-js`, `#mobfx`, `#eb-js`, `#pillfx` beyond the pills, `#fx-js` (the design footer's newsletter; ours is the shared footer), `#dash-css` / `#dash-js` beyond the blocks `/dashboard` already ports.
- A real evaluation, a report download, the quote page.
