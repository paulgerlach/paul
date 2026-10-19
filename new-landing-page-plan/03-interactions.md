# Phase 3: Interactions

Same rules as the other landing pages: runes and the existing attachments, no new dependencies, timers only in the browser and cleaned up, `prefersReducedMotion()` means the end state. Everything except the Portfolio-Checker comes with the shared `uv` components.

## 3.1 Shared

- `reveal()` on `<main>` (threshold 0.15); the hero list's 9 s loop ("In Arbeit" → "Bereit für BKA", 1400 + 700 × i ms, first pass after a full interval); statement, rotator (2.3 s), count-up (92, 14, 1), the picture's zoom.
- Tiles through `loopInView`: grid 7.6 s (Objekt 1 … 11 "fertig", the note "Objekt 1: Abrechnung fertig" …, then Objekt 12 "wird erstellt"); doc 7 s (rows one by one 520 ms apart, then "Bereit für die Abrechnung"); bill 6.4 s (starts on "Eigentümer A" with its two objects and "2", at 2.6 s the thumb slides to "Eigentümer B", A's rows fold away, "Am Markt 7" unfolds, the sum turns "1"; "Verbrauchsinfo monatlich aktiv" stays); phone 7 s (notification at 500 ms, figure and bars from 1.8 s).

## 3.2 The Portfolio-Checker (`#pcm-js`)

Through `loopInView` with `threshold: 0.35` and `every: 9100` (the design's 1300 + 4 × 900 + 4200 ms): each pass resets (rows hidden, count 0, bar 0, status "Verträge werden geprüft …", spinners), the rows fade in (staggered 0.1 s by CSS) on the next frame, then row i turns done at 1300 + 900 × i ms (spinner out, pill in with the design's spring, count and bar follow); with the last, the status becomes "Für jede Liegenschaft der nächste Schritt". Server and reduced motion: the finished state. The design runs once on first view and loops forever; ours stops off-screen like every loop.
