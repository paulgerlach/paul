# Phase 3: Interactions

Same rules as the other landing pages: runes and the existing attachments, no new dependencies, timers only in the browser and cleared on teardown, `prefersReducedMotion()` means the end state. The design's only page-only script is `#aw2-js`; the reveal, the closing chart, the logo strip, the trust block and the floating CTA are `/dashboard`'s.

## 3.1 Entrances

Every entrance goes through `enterView` (only below the fold, only with motion; `prepare` sets the start state, `play` the end):

- **Mock-up** (threshold .25): bars from 0 to their widths (`1s` ease with the design's per-row delay `.2s + i × .08s`), the values and the three KPIs count from 0 through `tweenNumber` (1000 ms rows, 1100 ms KPIs, `de()` with the KPI's decimals), the average line fades in after 1.1 s, the notes slide in from the right one after the other (`1.3s + i × .35s`).
- **Steps** (each card at .4): the two tickers rise in (`.35s + i × .35s`, the second .25 s later).
- **Comparison** (.3): the bars grow from 0 to the heating values; the rows already sorted.
- **Heatmap** (.2): the cells scale in row by row (`j × .04s + r × .05s`).
- **Notes** (.3): the notes rise in (`.2s + i × .15s`).
- **Report** (.35): the back pages fan out (.7 s, .3 s delay), the bars grow (`.4s + i × .06s`), "Bericht erstellt" rises in after 1.5 s.

## 3.2 The comparison's switch

- `$state` metric (`heiz`), everything else `$derived` through `metrics.ts`: the unit line, each row's width, value (`de()` with the metric's decimals), badge, high mark and rank, the average line's position and text "Ø 111" / "Ø 13,7" / "Ø 31,4".
- A click sets the metric and its button `aria-pressed`; the rows slide to their new ranks (`transform .5s`), the bars and the average line move (`.7s`). An `sr-only` polite line names the new order's first row ("Höchster Wert: Bergmannstraße 4, 142 kWh/m²").

## 3.3 The heatmap's tooltip

- Pointer only, as the design: `pointerenter` and `click` on a cell show the tooltip above the cell (its box against the card's, plus the card's `scrollLeft`; measured in the handler), `pointerleave` hides it. The hovered cell gets the ring (`.on`). The tooltip is `aria-hidden`; the values are in the `sr-only` table.

## 3.4 The notes' filter

- `$state` filter (`all`), the visible notes `$derived` through `filterHints`; filtered-out notes get `hidden`. The chip's button `aria-pressed`; the polite `sr-only` line "{n} Hinweise".

## 3.5 CSS only

- The `.db-btn` hovers, the pill icons, the heatmap cell's ring on hover, the switch's and chips' pressed look.
- With reduced motion: nothing moves (the landing reset; `#aw2-css`'s `transition: none` for the six blocks).
