# Phase 3: Interactions

Same rules as the other landing pages: runes and the existing attachments, no new dependencies, listeners only in the browser and removed on teardown, `prefersReducedMotion()` means the end state.

## 3.1 Shared

- `reveal()` on `<main>`; the anchor `#start` as on the other pages (the nav CTA, the floating CTA and the result card's button lead to the closing form and focus its e-mail field).

## 3.2 The calculator (`#es-js`)

The design reads every slider on each `input`, writes the outputs and the slider's `--p`, recomputes, tweens the five figures (1.4 s the first time the calculator shows, 0.45 s after that, from the last values), sets the bar widths and the two lines. Here:

- **Inputs:** `values = $state(defaults)`, each slider `bind:value` (a number), its `<output>` and `aria-valuetext` the formatted value with unit, its fill `style:--p` from the value's position in its range. `on = $state({ fern: false, uvi: false })`; each toggle flips its key, `aria-pressed` follows.
- **Result:** `$derived(savings(values, count(on)))` (`savings.ts`). The bar widths and the two lines read the result directly (the bars' 0.6 s width transition is CSS).
- **Counting figures:** the total, the two euro figures, the working days and the per-unit figure on screen are `$state` that follow the result through `tweenNumber` (`$lib/landing/motion.ts`, ease-out cubic): an `$effect` on the result starts the tweens from the shown values (450 ms) and cancels them on the next change and on teardown. The server and the first browser render show the end values.
- **First view (`PG.onShow`):** `inView({ threshold: 0.15, once: true })` on the calculator: on enter, the shown figures count from 0 to the result over 1.4 s and the bars grow from 0 (their width is held at 0 for one frame, then the CSS transition runs). Nothing with reduced motion (`tweenNumber` sets the end value).
- **Confetti:** the first time both toggles are on (the design's `best`, once per visit), `confettiFrom(totalElement)`; the returned stop runs on teardown. Nothing with reduced motion.
- **Status line:** an `sr-only` `role="status"` paragraph with the result's text (README, Live region), derived from the result, not from the counting figures.

## 3.3 CSS only

- The pills' icons scale to 1.12 and turn `--ok` on hover (`#pillfx`); the toggles darken their border on hover; `.bk-next.inv` turns white and its arrow moves 4 px; the FAQ toggles turn.
- With reduced motion: nothing moves (the landing reset).
