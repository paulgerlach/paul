# Phase 3: Interactions

The rules match the other landing pages: runes and the existing attachments, no new dependencies, timers and observers only in the browser and cleaned up on teardown. `prefersReducedMotion()` means the end state: no entrances, no loops, no counting; the FAQ still opens and closes. Almost everything comes with the shared `uv` components (02 §2.1), which already behave like this on `/mieterportal` and `/verbrauchsinformation`; this phase is mostly checking that the new variants loop like the old ones.

## 3.1 Reveal and the hero list

- `reveal()` on `<main>` as on the two built pages, for every `.rv` (threshold 0.15). The design's smooth scrolling for `#` links is the landing pages' existing anchor behaviour: check that `#inhalt`, `#faq` and `#start` land below the sticky header.
- **The list's loop** (`uv/ListMock`, moved from `/mieterportal` unchanged): every 9 s in view, the four statuses go back to "Ablesung läuft" (amber) and turn "Abrechnung fertig" (green) one by one, 1400 + 700 × i ms. The first pass waits a full interval, so the hero, on screen at load, doesn't flash from its server state (open question 4). The design's one-time fade-in of the entries (`#uv-app.go .uv-li`) isn't ported, as on `/mieterportal`.

## 3.2 Statement, rotator, numbers, picture

All shared, unchanged:

- **Statement:** the words light up with the scroll position, dimming again scrolling back; every word lit on the server and under reduced motion.
- **Rotator:** `loopInView`, every 2.3 s the next phrase sharpens in and the previous one blurs upward; the first pass keeps the server's first phrase. A `sr-only` list holds all four phrases.
- **Numbers:** `countUp` on 92, 14 and 1 (1100 ms, `viewDelay: 0`); "1–2 h" and the date aren't counted.
- **Picture:** the slight zoom-out once in view, only if it was below the fold on load.

## 3.3 The four tiles

Each tile's loop attaches to the tile itself through `loopInView` (in view and in a visible tab only; on leave the timers are cleared; the server state is the end state). Timings are the design's, the same as on the built pages:

| Tile | Every | One pass |
|---|---|---|
| `Calendar` | 7.6 s | every cell back to "offen"; WE 01 … WE 12 step 380 ms apart from 300 ms: WE 01–11 "per Funk" (green tick), WE 12 "wird abgelesen" (dark, spinning ring, `scale(1.04)`); the note follows: "WE 01 abgelesen" … "WE 11 abgelesen", then "WE 12 wird abgelesen" |
| `Doc` | 7 s | rows hidden, then in one by one 520 ms apart (check rows: the tick comes with the row; no bar fills), then "Abrechnung fertig" 500 ms after the last |
| `Phone` | 7 s | empty; the notification drops in at 500 ms; at 1.8 s the figure block appears (value, chip, the three appointment rows); no bars to grow |
| `Bill` | 6.4 s | starts on "Heute" (thumb left, the two "manuell" rows shown, sum "ja"); at 2.6 s the thumb slides to "Mit Heidi", those rows fold away, the two tick rows unfold, the sum turns "nein"; "Liegenschaften 24" stays throughout |

The grid's spinning ring and the note's pulsing dot are CSS loops, off under reduced motion as in the design.

## 3.4 FAQ, closing, trust, floating CTA

All shared: the `Faq`'s own disclosure, the `SignupForm`, `TrustSeals`' entrance and seal sequence, `FloatingCta`'s hide-while-`final`-card-in-view. Nothing page-specific.
