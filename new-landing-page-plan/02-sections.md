# Phase 2: The sections

## 2.1 The page

Page-only components in `$lib/landing/pages/einsparrechner/`. The page's `<main class="es">` holds the design's `.dm` tokens (`--bg`, `--hair`), `.pg-sec` (104 px, 72 px at 640 px and below, the top hairline, `.alt` grey), the reveal transition and `#hs-css`'s heading sizes, as `/hkvo-leitfaden`'s page does.

| # | Section | Design | Component | Notes |
|---|---|---|---|---|
| 1 | Hero | `.pg-hero` | `Hero` + `Calculator` | Grey (`--bg`), 72/88 px (44/60 at 640 px), bottom hairline. The centred head (`.pg-head.c`, max 760 px): the white pill (`.dm-pill`, the euro icon, `#pillfx` hover), H1 (`.pg-h1` 38–64 px, accent `--ok`), the lead (`.pg-lead` 16–19 px, muted, centred, max 640 px) |
| 1a | Calculator | `.es-calc#rechner` | `Calculator` | Two columns (1.25fr / 1fr, 18 px gap, 48 px below the head, top-aligned; one column at 900 px). **Input card** (`.es-in`, white, hairline, 22 px radius, 8/26 px padding, the long soft shadow; 4/18 px at 560 px): three groups (`.es-grp`, 22 px padding, hairline between): the H2 (16 px, 600, −.01em) with its number in a 24 px light-green circle (12 px bold `#2F7A3C`); group 2's sub (13 px muted); the sliders (`.es-sl`, 16 px apart): the label (14 px `#3E4D49`) and the value with its unit right (600, ink, tabular, no wrap; at 560 px under the label), the range input (6 px track, the green `--accent-deep` fill up to `--p`, the 22 px white thumb with the ink ring). Group 3's two toggles (`.es-tg`, two columns, one at 560 px): white cards (14 px radius, 12 px padding) with an 18 px check box, the title (13.5 px, 600) and the note (12 px muted); pressed: light orange (`#FBF3EF`, border `#F2C9B8`), the box `#A8431A` with a white tick. **Result card** (`.es-out`, ink, white text, 22 px radius, 28 px padding, sticky at 96 px; static at 900 px, 22 px padding at 560 px): "Ihr Vorteil pro Jahr" (13 px, 65 % white), the total (40–56 px, 500, `--accent`, tabular, "N €"), the two bars under a faint hairline (16 px apart: the dot, the label 13.5 px, the euro figure 15 px 600 right; the 6 px track with the fill in `--accent` / `#F2B79E`, 0.6 s width transition; the line below 12 px, 55 % white), two figure tiles (`.es-kpi`, 6 % white, 14 px radius: 22 px 600 figure, 12 px label), the button (`.bk-next.inv`: `--accent` on ink, full width, white on hover, the arrow moves), the note (12 px, 50 % white) |
| 2 | Method | `.pg-sec` | `Method` | White, the centred head (`.pg-head.c`): the pill with the calculator icon, H2 (`.dm-h2.c`, 30–48 px). Three cards (`.es-how`, 14 px gaps, 48 px below; one column at 900 px): white, hairline, 18 px radius, 24 px padding; the 40 px light-green icon tile (`#2F7A3C`, 20 px icons: clock, warning, tick), H3 17 px 600 (14 px above), text 15 px muted (fills the card), the formula (`code`, Geist not mono, 13 px, `#F6F7F6`, 10 px radius, 9/12 px padding) at the bottom |
| 3 | FAQ | `.pg-sec.alt` with `.xfq` | `Faq` → shared `Faq` | The grey band with the top hairline, the centred H2 (`.dm-h2 c`), the list 1100 px wide, 56 px below; first answer open; the toggles white; FAQ 4's link in `--ok`, 600 |
| 4 | Closing | `.dm-end` (110 px top padding) | `Closing` → shared `CtaCard` | `id="start"`, `final`, the text under the heading (`#dcta-css`), the `SignupForm` in place of the video button |
| 5 | Trust | `.trust` | shared `TrustSeals` | |
| — | Floating CTA | `.ctab` | shared `FloatingCta` | |

Icons: the design's 20×20 stroke icons (euro, calculator, clock, warning, tick) as `StrokeIcon` paths.

## 2.2 End states (server, no JS, reduced motion)

- The calculator: the defaults (README, Math): "240 WE", "12", "1.000 € / Jahr", "45 € / h", "4 h", "3 h", "6 h"; both toggles off; the total "7.020 €", the time bar full ("7.020 €", "156 Stunden pro Jahr"), the risk bar empty ("0 €", "Kein Risiko ausgewählt"), "20" working days, "29 €" per unit. Without JS the sliders move but nothing follows (as `/schnittstellen`).
- Every `.rv` block shown (the reveal only hides blocks below the fold, in the browser).
- With reduced motion: no counting, no bar transition, no confetti, no pill hover movement (the landing reset turns off transitions and animations; `tweenNumber` and `confettiFrom` check).

Overflow checks at 320 px: the H1, the slider labels with their values (at 560 px stacked), the toggles (one column), the total ("14.400 €" and larger: up to 3.000 WE × 3.000 € × 6 % + 300 × 70 h × 120 € = 540.000 + 2.520.000 €, "3.060.000 €"), the figure tiles, the formula chips, the closing form.
