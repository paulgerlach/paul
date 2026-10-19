# Phase 2: The sections

## 2.1 The page

Page-only components in `$lib/landing/pages/fristenrechner/`. The page's `<main class="fr">` holds the design's `.dm` tokens (`--bg`, `--hair`), `.pg-sec` (104 px, 72 px at 640 px and below, the top hairline, `.alt` grey), the reveal transition and `#hs-css`'s heading sizes, as `/neuigkeiten`'s page does.

| # | Section | Design | Component | Notes |
|---|---|---|---|---|
| 1 | Hero | `.pg-hero` | `Hero` + `Calculator` | Grey (`--bg`), 72/88 px (44/60 at 640 px), bottom hairline; `.pg-grid` (1fr and up to 560 px, 64 px gap; one column at 1040 px, 44 px gap). Pill with the calendar icon (`#pillfx` hover), H1 (`.pg-h1` 38–64 px, accent `--ok`), lead (52 ch), the CTAs (`.bk-next` dark and `.pg-ghost`, both with ↓; stacked and centred at 640 px), the ticks (`.pg-ticks` with the green `.okb` circles) |
| 1a | Calculator | `.fr-card#rechner` | `Calculator`, the three panes, `Result` | White card, 22 px radius, 22 px padding (16 at 560 px), the long soft shadow. Tabs full width (`.pg-seg`, each tab `flex: 1`; 12.5 px at 560 px). Each pane: a 2-column grid of labelled fields (44 px high, green focus ring; one column at 560 px); the result box (`#F6F7F6`, 14 px radius): the small label, the big date (28–38 px, tabular figures) with the days badge (green / amber `warn` / red `late`), the row below a hairline; on Vertrag the timeline (6 px bar, filled to the cancel day, the "Kündigung" label with its ring above the fill's end, "Heute" and "Vertragsende" under the ends); the hint (13 px, link in `--ok`). The note under the panes (11.5 px, `--faint`). `scroll-margin-top: 72px` |
| 2 | Milestones | `.pg-sec#stichtage` | `Milestones` | `SectionHead` centred (pill with the clock icon, H2 with the muted second part); four cards in a row (two at 900 px, one at 560 px), 14 px gaps: date, H3 17 px, text, the law in `--faint` at the bottom, the badge top right; the last card dark (`hot`, the badge in `--accent`). `scroll-margin-top: 72px` |
| 3 | Portfolio | `.pg-sec.alt` | `Portfolio` | Two columns (one at 900 px, 36 px gap). `SectionHead` (pill with the building icon), the text (17 px, 46 ch); the example list: a white card of four rows (name, line, the status chip: dark "Übernehmen", amber "Kündigen", green "Abrechnen"), "Beispieldaten" hanging over the bottom edge. `aria-hidden` like the design, with the rows as a `sr-only` list |
| 4 | FAQ | `.pg-sec` with `.xfq` | `Faq` → shared `Faq` | White band with the top hairline, the centred H2 (`.dm-h2 c`), the list 1100 px wide, 56 px below; first answer open; the toggles white |
| 5 | Closing | `.dm-end` | `Closing` → shared `CtaCard` | `id="start"`, `final`, the text under the heading (`#dcta-css`), the `SignupForm` in place of the video button |
| 6 | Trust | `.trust` | shared `TrustSeals` | |
| — | Floating CTA | `.ctab` | shared `FloatingCta` | |

Icons: the design's 20×20 stroke icons (calendar, clock, building) as paths in `SectionHead`'s `icon` snippet or the hero's pill.

## 2.2 End states (server, no JS, reduced motion)

- The calculator: "Vertrag" chosen; every pane's result computed for the defaults and today (the server's `now`), the timeline's fill and label in place; without JS the tabs are hidden and the three panes stack.
- The milestones' badges for today.
- Every `.rv` block shown (the reveal only hides blocks below the fold, in the browser).
- With reduced motion: no pane fade, no pop, no timeline transition, no pill hover movement (the landing reset turns off transitions and animations).

Overflow checks at 320 px: the H1, the tabs (three in 288 px), the date inputs, the timeline's labels at both ends, the milestone cards, the list's chips, the closing form.
