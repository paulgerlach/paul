# Phase 3: Interactions

The rules match the other landing pages: runes and the existing attachments, no new dependencies, timers and observers only in the browser and cleaned up on teardown. `prefersReducedMotion()` means the end state: no entrances, no loops, no counting, no tween; the FAQ still opens and closes. Most of it comes with the shared `uv` components (02 §2.1), which already behave like this on `/mieterportal`.

## 3.1 Reveal and the hero mock

- `reveal()` on `<main>` as on `/mieterportal`, for every `.rv` (threshold 0.15). The design's smooth scrolling for `#` links is the landing pages' existing anchor behaviour: check that `#inhalt`, `#faq` and `#start` land below the sticky header.
- **The mock's entrance** (`ConsumptionMock`): the design adds `.go` on view (the four KPI boxes fade up, 120 ms apart) and grows the 12 bars from 4 % to their height, 250 ms + 60 ms × i. Here through `enterView` (`$lib/landing/attachments/enterView.ts`): `prepare` drops `.go` and sets every bar to 4 %, `play` adds `.go` and sets the heights on the design's schedule; the cleanup clears the timers. The hero is on screen at load, so in practice the mock keeps its server state (open question 4); it plays when the page is restored scrolled down and the hero comes into view later. Nothing loops here (unlike `/mieterportal`'s hero list).

## 3.2 Statement, rotator, numbers, picture

All shared, unchanged from `/mieterportal`:

- **Statement:** the words light up with the scroll position (`(vh × 0.82 − top) / (height + vh × 0.3)`), dimming again scrolling back; every word lit on the server and under reduced motion.
- **Rotator:** `loopInView`, every 2.3 s the next phrase sharpens in and the previous one blurs upward; the first pass keeps the server's first phrase. A `sr-only` list holds all four phrases.
- **Numbers:** `countUp` on 12, 3 and 3 (1100 ms, `viewDelay: 0`); 0 and the date aren't counted.
- **Picture:** the slight zoom-out once in view, only if it was below the fold on load.

## 3.3 The four tiles

Each tile's loop attaches to the tile itself through `loopInView` (in view and in a visible tab only; on leave the timers are cleared; the server state is the end state). Timings are the design's:

| Tile | Every | One pass |
|---|---|---|
| `Calendar` | 7.6 s | every month back to "offen"; months 0 … `current` step in 380 ms apart from 300 ms: before `current` "bereitgestellt" (green tick), `current` "wird erstellt" (dark, spinning ring, `scale(1.04)`); the note follows: "September bereitgestellt", then "Oktober wird erstellt" |
| `Doc` | 7 s | rows hidden, then in one by one 520 ms apart (bars fill to their width), then "Alle Pflichtangaben enthalten" 500 ms after the last |
| `Phone` | 7 s | empty; the notification drops in at 500 ms; at 1.8 s the figure and chips appear and the ten bars grow 60 ms apart |
| `Bill` | 6.4 s | starts on "Ohne uVI" (thumb left, the cut row shown, sum "1.202,80 €"); at 2.6 s the thumb slides to "Mit Heidi", the cut row folds away, the tick row unfolds, and the sum counts from 1.202,80 to 1.240,00 € in 700 ms |

**The bill's tween** is new in the shared `Bill` (the `/mieterportal` variant only swaps text): when `sum` has `from`/`to`, one `requestAnimationFrame` loop interpolates with the design's easing (`#pg-common`'s `tween`: ease-out cubic, `1 − (1 − p)³`) and writes `Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })` + " €". The loop's cleanup cancels the frame. The tile is `aria-hidden` as a whole (it illustrates the row's text), so nothing is announced.

The calendar's spinning ring and the note's pulsing dot are CSS loops, off under reduced motion as in the design.

## 3.4 FAQ, closing, trust, floating CTA

All shared: the `Faq`'s own disclosure, the `SignupForm`, `TrustSeals`' entrance and seal sequence, `FloatingCta`'s hide-while-`final`-card-in-view. Nothing page-specific.
