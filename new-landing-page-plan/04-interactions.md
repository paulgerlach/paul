# Phase 4: Interactions and animation

The design wires everything with 4 vanilla scripts (`getElementById`, `innerHTML`, `setTimeout` chains). Each behaviour moves into the component that owns its markup, with runes for state and attachments for DOM behaviour. No new dependencies.

**Global rules (as on `/messdienstwechsel`):**
- Every animation checks `prefersReducedMotion()`. With reduced motion, the end state is rendered, nothing loops or counts, and there's no confetti. Click demos still work, but they jump straight to their end state (the design's `sl()` shortens delays to 80 ms; use 0).
- Timers, rAF loops and observers exist only in the browser and are cleaned up on teardown. Loops pause while their section is off-screen (`inView`).
- Text that changes on interaction is set from `$state`, never with `{@html}`.

## 4.1 Reused and new helpers

| Helper | Used by |
|---|---|
| `inView` (existing) | hero loop, KPI count-up, loops pausing |
| `countUp` (existing, `trigger: 'view' \| 'hover'`) | `AllInOne` card counters (hover, with the design's per-card delay and duration: 100/1200 ms, card 4 500/1100 ms), `LocalService` KPIs (view, 1500 ms, once, threshold 0.5) |
| `playOnView` (existing) | the CSS entry animations (`.pop`, `.mbar`, …) where the design uses keyframes |
| `confetti.ts` (phase 1) | `OneClickBilling`, `TrioBilling` |
| `tweenNumber(from, to, ms, onFrame)` (new, small, in `motion.ts`) | ease-out cubic number tween used by `UviPhone` (320 ms) and `PortfolioBrowser` (450 ms). `countUp` counts from 0, so it doesn't fit these |

## 4.2 Per-section behaviour

| Section | Behaviour (from the design) | Implementation |
|---|---|---|
| `HeroPhotoStack` | Every 8 s: cards replay their entrance; card 3 shows a spinner and "Bestandszähler werden übernommen … / Ablesewerte werden importiert", after 2.6 s it shows the check and "Bestandszähler übernommen / Abrechnung läuft ab sofort über Heidi" | `phase = $state<'loading' \| 'done'>('done')` plus a `play` key to restart the CSS animation. A timer chain in `$effect`, started/stopped by `inView`. The stack is `aria-hidden`, so no live region |
| `DemoCard` | Video plays on hover, focus, touch; pauses on leave/blur | already done in phase 1 (extracted) |
| `AllInOne` | Counters count up on card hover; reset to the final value on leave. Bars/pops animate on view | `countUp` hover trigger on each card; `playOnView` for the rest |
| `RegionMap` | Hover, focus or click on a district selects it: highlight, info panel (name, typical stock, hint, CTA city name). Starts with `defaultDistrict` | `selected = $state(city.map.defaultDistrict)` and `$derived` district data. Keyboard: Enter/Space select (focus already selects, as in the design). Arrow keys are not needed: Tab order follows the paths |
| `RegionMap` (Germany) | Bundesländer select like districts. City dots also select on hover/focus ("Eigene Landingpage für Hausverwaltungen in …"), and **open the city page** on click or Enter | Dots with `href` render inside an SVG `<a href>` (a real link: middle-click, "open in new tab" and crawlers work), not the design's `window.open(…, "_top")`. Focus and hover select; the link's own click navigates |
| `OneClickBilling` | Click: button disabled "Wird erstellt …", bar fills 24 steps × 70 ms, status "Einheit n von 24 abgerechnet", then "✓ 24 Abrechnungen erstellt und an Ihre Software übergeben", button "Noch einmal ansehen", confetti from the button over the card (canvas 80 px larger on each side) | `n = $state(0)`, `running = $state(false)`, an interval in a click handler, cleared on teardown. Status in `aria-live="polite"`: announce only the start and the final text, not every step (put the step counter in an `aria-hidden` element) |
| `LocalService` | KPIs count up from 0 when the row is half visible, once | `countUp({ trigger: 'view' })` per number (the "1–2 h" KPI has two counters) |
| `UviPhone` | Month tabs (Apr–Sep); hover or click selects; moving over the chart selects the nearest month. Shows month name, value (tweened), delta vs. previous year (`up` class when positive), and moves the vertical line and dot. Starts at the last month | `active = $state(last)`; `$derived` delta, `x`/`y` positions (same formulas as the design: `x = 14 + i·272/(n−1)`, `y = 10 + (1 − v/max)·62`). Tabs: `role="tablist"`/`tab`, `aria-selected`, arrow-key navigation. Values formatted `38,40 €` via `Intl.NumberFormat("de-DE", { minimumFractionDigits: 2 })`. Pointer move on the chart: `onpointermove` with `getBoundingClientRect()` |
| `PortfolioBrowser` | Tabs switch the property: counters tween to the new values, the split bar's flex-grow changes, the matching table body fades in. Hovering a counter or its bar segment highlights the pair (`hf`/`hb` classes) | `tab = $state<'all' \| …>('all')`, `hover = $state<'f' \| 'b' \| null>(null)`. Table bodies via `{#key tab}` for the fade-in. Tabs as above |
| `TrioBilling` | Click: fill 24 steps × 60 ms with "Einheit n von 24", then "24 Abrechnungen erstellt", check icon, confetti. Clicking again resets ("Nochmal klicken zum Zurücksetzen") | `status = $state<'idle' \| 'run' \| 'done'>('idle')`, `n = $state(0)` |
| `TrioSignature` | Click "Eine Unterschrift": the text steps through "Kündigung per Vollmacht", "Montage geplant", "Mieter informiert", "Abrechnung eingerichtet" (520 ms each) and ends at "Heidi übernimmt alles"; the pen turns into a check. Clicking again resets to "Bereit für den Wechsel" | `step = $state(-1)`, `status`. The text swap animation via `{#key text}`. Timeouts collected and cleared on teardown |
| `TrioTenantAccess` | Click "Zugang an Mieter senden": "Sendet …", then stages s1 (350 ms), s2 (1000 ms), s3 (1650 ms): chip "Zugang per E-Mail versendet", Wohnung 07 "Zugang aktiviert", uVI September "142 kWh · −12 % ggü. August". A click anywhere on the visual after s3 resets | `stage = $state(0)`. The reset click is on the visual container: give it a real reset `<button>` overlaying it (or make the hint "Klicken zum Zurücksetzen" the button) instead of a click handler on a `div` |
| `LandingHeader` | dropdowns, burger | unchanged (shared) |
| `Faq` | native `<details>` | unchanged (shared) |

## Done when

- Every behaviour works with the mouse, the keyboard (Tab, Enter/Space, arrow keys on tablists) and touch.
- With `prefers-reduced-motion: reduce` nothing moves, the counters show their final values, the click demos jump to the end state, and there's no confetti.
- No console errors. Navigating to `/preise` and back doesn't leave timers or rAF loops running (temporary `console.count` or the Performance panel).
