# Phase 2: The sections

## 2.1 The page

`+page.svelte` renders `DbMain` (the frame, 1.2) around the sections, then `FloatingCta`, as `/dashboard`. Sections in `$lib/landing/pages/auswertung/sections/`; `/dashboard`'s are imported from `$lib/landing/pages/dashboard/sections/`.

| # | Section | Design | Component | Notes |
|---|---|---|---|---|
| 1 | Hero | `.db-hero` | `Hero` → `HeroFrame` + `PortfolioMock` | The line alone (`.l1`); "Demo buchen" (`.db-btn.w`, the square), "Angebot einholen →" (`.db-btn.k`) |
| 1a | Mock-up | `.ax` (`#aw2-css`) | `PortfolioMock` | The white window (20 px radius, the design's shadow, 13 px text): the top bar (the Heidi mark on `--g1`, title and sub, the chip and the tag hidden below 1080 px, "Report exportieren" hidden below 640 px); the body in three columns (200 px KPIs, the chart, 250 px notes), one column below 1080 px with the KPIs in three columns (one below 640 px). The chart: seven rows (120 px name, bar, 40 px value; 100 / 34 px below 640 px), the dashed average line, the two high rows in `--g4`. The notes with their round badges. `role="group"` with the design's `aria-label` |
| 2 | Logos | `.db-logos` | `/dashboard`'s `LogoStrip` | |
| 3 | Steps | `.aw-sec` + `.af` | `Steps` (`Head` + three `.af-c`) | The centred head; three cards (one column below 1080 px): the mono number, the icon tile (`--g1`, lime icon), H3 20 px 500, the text, the two mono tickers (the second of card 2 orange) |
| 4 | Comparison | `.aw-sec` + `.aw-2` + `.ac` | `Compare` (`Split` + the card) | Text left, card right (one column below 1080 px). The card: the switch, the unit line "kWh/m² · Jan – Okt"; seven rows (150 px name with units, bar, 52 px value, 54 px badge; 110 / 44 px and no badge below 640 px), the average line with "Ø 111" below it; the legend and "Beispieldaten" |
| 5 | Heatmap | `.aw-sec` + `.ah` | `Heatmap` (`Head` + the grid) | The white card scrolls sideways below 720 px content width (`overflow-x: auto`, the grid's `min-width: 720px`, as the design); the month row, seven rows (150 px name, twelve 34 px cells); the legend with the five colours; the tooltip; the `sr-only` table |
| 6 | Notes | `.aw-sec` + `.aw-2.rev` + `.afd` | `Hints` (`Split` `reverse` + the card) | Card left, text right (text first below 1080 px). The card: "Hinweise", the four chips, five notes (the coloured strip, place, title, text, the action pill; the action below the text below 640 px) |
| 7 | Report | `.aw-sec` + `.aw-2` + `.arp` | `Report` (`Split` + the stack) | Text left with the three format pills; the stack (440 px high, 400 px below 640 px): two back pages fanned out ±5°, the document, the badge "Bericht erstellt" |
| 8 | Quote | `.db-quote` | `/dashboard`'s `Quote` | |
| 9 | Closing | `.db-end` | `Closing` → `/dashboard`'s `Closing` with `content` | The signup form `#start` |
| 10 | Trust | `.trust` | `/dashboard`'s `Trust` | |
| — | Floating CTA | `.ctab` | `/dashboard`'s `FloatingCta` | |

The section wrappers: `Split` holds `.aw-sec`'s padding (`clamp(80px, 9vw, 120px) 0`), the grid `minmax(0, .9fr) minmax(0, 1.1fr)` (reversed `1.1fr .9fr`), the gap `clamp(32px, 5vw, 72px)`, the text column (`Pill` with icon, `.db-h2` left-aligned, `.aw-p` 17 px / 1.6 / 46ch, `.aw-ul` with the lime ticks) and a `visual` snippet; `Head` the centred `.db-c` head. Both sections are `.sec`, so `DbMain`'s borders between sections, the H2 sizes and `#hs-css` apply as on `/dashboard`.

## 2.2 Shared changes

Only those of 01 §1.2 (`DbMain`, `HeroFrame`, `Closing`'s `content`). No change to `$lib/landing/sections/`.

## 2.3 End states (server, no JS, reduced motion)

- The mock-up: the KPIs at 111, 13,7 and 3; every bar at its width, the values at 118 … 99, the average line shown, the three notes in place.
- The steps' tickers shown; the comparison on "Heizung", sorted (Bergmannstraße 4 first, Mühlenstraße 18 last), the bars at their widths, the badges and "Ø 111"; the heatmap's cells coloured and full size; the notes all five, "Alle 5" pressed; the report fanned out with "Bericht erstellt"; every `.rv` block shown.
- The closing chart drawn (as on `/dashboard`).
- Without JS the switch and the filter do nothing (their buttons stay, "Heizung" and "Alle" pressed, as the server renders them) and the heatmap has no tooltip; the `sr-only` table carries the values.

Overflow checks at 320 px: the mock-up (one column, the top bar with only the mark and the title), the comparison's rows (110 px names with ellipsis), the heatmap (scrolls inside its card, the page doesn't), the notes' chips (wrap), the report stack (`min(340px, 86%)`).
