# Phase 3: Interactions

Same rules as the other landing pages: runes and the existing attachments, no new dependencies, listeners only in the browser and removed on teardown, `prefersReducedMotion()` means the end state.

## 3.1 Shared

- `reveal()` on `<main>`; the anchors `#vergleich` ("Vergleich starten ↓"), `#kosten` ("Zum Kostenrechner →") and `#start` (the hero's "Demo buchen", "Mit Heidi vergleichen", "Heidi-Angebot für diesen Bestand", the trust block's "Demo buchen" and the floating CTA lead to the closing form and focus its e-mail field). Sections get `scroll-margin-top: 72px` (the design's offset).

## 3.2 The hero's preview

- CSS only: each tick tile pops in (`scale(0)` and transparent → full, .35 s `cubic-bezier(.3,1.6,.5,1)`, opacity .3 s) at 300 ms + i × 260 ms, "8 / 8" fades in (.4 s) at 1.6 s, all with a `both` fill so the server's HTML is the end state once they've run. The design starts them when the card shows (`onShow`), which in the hero is at load.

## 3.3 Step 1: the criteria and the score

- State in `Criteria.svelte`: `answers = $state<Answer[]>(8 × null)`.
- A toggle button sets the row's answer through `toggle()` (the same one again clears it), `aria-pressed` follows, the row's border class (`y`, `n`, `u`) follows.
- `$derived`: the tally ("<yes> / 8", the bar's width yes / 8 with its .6 s transition), `verdict(answers)` (a polite live region), `gaps(answers)`.
- The list "Hier liegt Heidi vorn" re-renders with its entrance on every pick (`{#key}` on a pick counter, as the design rewrites it on every click); hidden while there's no gap.
- Heidi's bar: `enterView` on the card (threshold .15): below the fold with motion it starts at 0 and grows to 100 % (1.2 s) on first view; otherwise full.

## 3.4 Step 2: the calculator

- The six fields are `$state` strings (no `name`, no form), `oninput` recomputes `costs()`.
- The legend's three amounts and the stack's widths follow at once (the stack's .5 s transition).
- The figure (two decimals), the year and the six years tween from the shown value to the new one (450 ms, `tweenNumber`; a new input cancels the running tween and starts from where it is).
- `enterView` on the result card: below the fold with motion the three figures are set to 0 and count up on first view (450 ms, as the design's `onShow(cost)`).

## 3.5 CSS only

- The tooltip on hover and focus; the toggles' hover; the questions' lift; the pills' icon on hover (`#pillfx`: 1.12 and `--ok` on the light pills); the `bk-next` arrow (4 px) and press; the ghost buttons' border; the FAQ's plus.
- With reduced motion: nothing moves (the landing reset).
