# Phase 3: Interactions

Same rules as the other landing pages: runes and the existing attachments, no new dependencies, timers only in the browser and cleaned up, `prefersReducedMotion()` means the end state (02 §2.2).

## 3.1 Shared

- `reveal()` on `<main>` (threshold 0.15), the design's `.rv`.
- In-page anchors (`#wechsel`, `#start`) scroll as on the other pages (the landing layout's `scroll-padding`); "Demo buchen" etc. focus the closing form (`focusSignup`).

## 3.2 The unit slider (`#sg-js` "Einheiten-Regler")

Pure `sg/units.ts`, tested:

- `toUnits(v)`: slider value 0–1000 → units on a log scale with 1.000 in the middle: `t = v / 1000`; `t ≤ .5` → `10 · 100^(t/.5)`, else `1000 · 20^((t−.5)/.5)`; rounded to 100 from 1.000, to 10 from 100, else to 1.
- `toValue(u)`: the inverse, rounded to a slider step (4800 → 762).
- `LARGE_FROM = 1000`, `isLarge(u)`; `formatUnits(u)`: German thousands, "+" from 20.000.

`UnitCalc`: the value is `$state` (start `toValue(start)`), the figure, the track's fill (`--p`, the design's `paintRange`: ink up to the thumb), the cards and `aria-valuetext` (`"4.800 Einheiten"`) are `$derived`. The hidden card is `inert` (the design leaves it focusable). Crossing into "Ab 1.000" by the visitor's input fires the confetti once per visit from the card's tag (not on load, not with reduced motion).

## 3.3 Confetti (`#pg-common`'s `PG.confetti`)

`sg/confetti.ts`: on first use, a fixed full-viewport canvas (`aria-hidden`, `pointer-events: none`, z-index 60) on `<body>`; the shared `burst` with 120 pieces from the origin element's centre (`/schnittstellen`'s options). Removed on teardown. Nothing with reduced motion.

## 3.4 The counters

- "1.000+": `countUp` (1400 ms, German format) when it scrolls into view.
- Meter (fr1): on pointer enter, "1.650" counts from 85 % to 100 % in 800 ms (the design's hover re-read); not with reduced motion.
- Billing (fr2): `enterView`: below the fold it starts at "0 / 24", "Wird erstellt …", and when in view counts one per 90 ms after 500 ms, then "Fertig für alle Einheiten".

## 3.5 The problem picker

`selected: number[]` in `$state`, newest first (the design's `unshift`); a click toggles (`aria-pressed`, `.on`); the answers, the count ("1 Grund" / "{n} Gründe für den Wechsel") and the footer are derived. From the third choice the confetti fires once from the count.

## 3.6 Loops (`loopInView`)

- **Monthly values (fr3)**, 8.6 s, threshold 0.4: reset (classes off, values 0, bars 0) → at 50 ms the rows come in and count to their values (700 ms, 150 ms apart; WE 07 to its Vormonat 131) → 1.7 s WE 07 counts 131 → 318, turns orange, "Über Vormonat" → 3.0 s the cursor "Verwaltung" glides to its flag → 4.25 s the flag lights → 4.55 s the toast "Zur Prüfung markiert" → 7.8 s the cursor leaves. The cursor's target is measured from the flag's box at each pass (and on resize).
- **Hub (fr4)**, every 2.2 s, first after 0.9 s, threshold 0.25: the hub pulses, a dot flies to the next tile (scaled to the tile's width), which lights with its line 650 ms later. Leaving the view unlights every tile.
- **Rollout (fr5)**, 15 s, first after 1.8 s, threshold 0.25: back to the start state, then Am Stadtpark 7 fills (1.8 s), turns "Fertig" (4.5 s), Hofstraße 21 "Montage läuft" at 40 % (5.6 s), full (8.3 s), "Fertig" and "Alle 4 Liegenschaften fertig" (11 s). Changed labels flip in.
- **Steps' sweep**, 7 s, threshold 0.2: a light dot runs along the line (3.2 s) and pings each step as it passes.

## 3.7 One-time entrances (`enterView`)

- Feature rows: below the fold each row's tile starts hidden (the design's state before `.in`) and plays its entrance when the row comes into view.
- Steps: below the fold the steps start unlit; in view they light one by one (250 ms + 950 ms each, the line growing), the last turns done 700 ms later. The sweep only runs once the intro is done.
