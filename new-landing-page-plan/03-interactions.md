# Phase 3: Interactions

Same rules as the other landing pages: runes and the existing attachments, no new dependencies, listeners only in the browser and removed on teardown, `prefersReducedMotion()` means the end state.

## 3.1 Shared

- `reveal()` on `<main>`; the anchor `#start` as on the other pages (the nav CTA "Bestand prüfen" and the floating CTA lead to the closing form and focus its e-mail field). The hero's two CTAs jump to `#rechner` and `#stichtage` (smooth through app.css, 72 px below the sticky header through `scroll-margin-top`).
- The page's `DeadlineClock`: `setDeadlineClock(data.now)` in the page, `clock.start()` on mount (its cleanup on teardown). Every date reads `clock.today`; it changes once a day, so the results don't recompute every second.

## 3.2 The tabs (`PG.seg` in `#fr-js`)

The design toggles `.on` and `aria-selected` on the buttons and `hidden` on the panes. Here: `let tab = $state<Tab>("vertrag")`; tabs with `role="tab"`, `aria-selected`, `aria-controls`, roving `tabindex`; arrow keys (with wrap), Home and End move the choice and focus; the panes are `role="tabpanel"` with `aria-labelledby` and `hidden` when inactive. The pane fades in (`frin`, 0.3 s) when shown.

## 3.3 The three calculators (`calcV`, `calcE`, `calcA`)

The design recomputes on `input` and `change` of every field. Here every field is bound to `$state` in its pane (dates as ISO strings, the selects as numbers) and the results are `$derived` from them and `clock.today` through `fristen.ts`:

- **Vertrag:** the cancel day (big), its badge (warn below 60 days), the next end, the timeline (fill width and label position = `progress`, the label shifted by `timelineAnchor`, the ring under it at the same share). The fill and the label move over 0.8 s.
- **Eichfrist:** the expiry (big), its badge (warn below 180 days), "Austausch einplanen bis".
- **Abrechnung:** the deadline (big), its badge (warn below 60 days), "Einwendungen des Mieters möglich bis": the date a year after the optional receipt, else "12 Monate nach Erhalt".
- An empty or invalid date and a year below 1900 keep the last result (the design returns early); that last valid value is kept in the field's input handler, not through an effect.
- **Pop:** when a big date changes, it re-enters with the `frpop` animation (0.45 s): a `{#key}` around it, with the animation only after hydration (the server's value doesn't pop).

## 3.4 The milestones' badges

`milestoneBadge(date, clock.today)` per card: "gilt" or "in N Tagen". Server-rendered for the server's day; the clock corrects it after hydration if the day differs.

## 3.5 CSS only

- The pill's icon scales to 1.12 and turns `--ok` on hover (`#pillfx`); `.pg-ghost`'s border darkens; `.bk-next` as the shared button; the FAQ toggles turn.
- With reduced motion: nothing moves (the landing reset).
