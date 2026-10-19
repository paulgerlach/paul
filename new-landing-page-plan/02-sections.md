# Phase 2: The sections

## 2.1 The page

Page-only components in `$lib/landing/pages/neuigkeiten/`. The page's `<main class="nw">` holds the design's `.dm` tokens (`--bg`, `--hair`), `.pg-sec` (104 px, 72 px at 640 px and below, the top hairline, `.alt` grey), the reveal transition and `#hs-css`'s heading sizes, as `/schnittstellen`'s page does.

| # | Section | Design | Component | Notes |
|---|---|---|---|---|
| 1 | Hero | `.pg-hero.bl-hero` | `Hero` + `Featured` | Grey (`--bg`), 72/88 px (44/60 at 640 px), bottom hairline. Pill with the sparkle (`.dm-pill`, its icon scales and turns green on hover: `#pillfx`), H1 (`.pg-h1`, accent `--ok`), lead (60 ch). The featured story: a white card, photo 16:10 on the left (1.15fr), badge "Neu" + topic, H2 26–38 px, text, "more" line; one column at 1040 px |
| 2 | News | `.pg-sec` | `News` + `StoryCard` | H2 (`.dm-h2`) and the filter (`Segmented`, `track`) in one row (`.bl-top`, wraps); a 3 / 2 / 1-column grid (1040, 720 px), 24 px gaps; each card a photo 16:10, the topic chip, H3 19 px, the "more" line at the bottom; the blog link as a `.pg-ghost` button, centred. At 720 px and below the filter scrolls sideways |
| 3 | Deadlines | `.pg-sec.alt` | `Deadlines` | `SectionHead` (pill with the calendar icon, H2 with the muted second part); four white rows in two columns (one at 720 px): a green icon tile, title and text, the arrow |
| 4 | Closing | `.dm-end` | `Closing` → shared `CtaCard` | `id="start"`, `final`, the text under the heading (`#dcta-css`), the `SignupForm` in place of the video button |
| 5 | Trust | `.trust` | shared `TrustSeals` | |
| — | Floating CTA | `.ctab` | shared `FloatingCta` | |

Icons: the design's 20×20 stroke icons (sparkle, calendar, the four rows' wifi, document, calculator, clock) as paths in the components, drawn through `StrokeIcon` or `SectionHead`'s `icon` snippet.

## 2.2 End states (server, no JS, reduced motion)

- Filter: "Alle" chosen, all nine stories shown.
- Every `.rv` block shown (the reveal only hides blocks below the fold, in the browser).
- Hover effects are CSS only; with reduced motion the photos don't zoom and the cards don't lift.

Overflow checks at 320 px: the H1, the filter (scrolls inside itself), the featured card, the rows' long titles, the closing form.
