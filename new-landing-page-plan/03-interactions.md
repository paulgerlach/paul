# Phase 3: Interactions

Same rules as the other landing pages: runes and the existing attachments, no new dependencies, timers only in the browser and cleaned up, `prefersReducedMotion()` means the end state. Everything comes with the shared `uv` components; the only new behaviour is the grid's placeholders and milestones.

## 3.1 Shared

- `reveal()` on `<main>` (threshold 0.15); the hero list's 9 s loop ("Abrechnung offen" → "Vor ETV fertig", 1400 + 700 × i ms, first pass after a full interval); statement, rotator (2.3 s), count-up (92, 14, 1), the picture's zoom.
- Tiles through `loopInView`: bill 6.4 s (starts on "Ohne Heidi" with "Sie" twice and "hoch", at 2.6 s the thumb slides to "Mit Heidi", the manual rows fold away, "Vollmacht unterschreiben" and "Kündigung, Montage, Information · Heidi" unfold, the sum turns "eine Unterschrift"); doc 7 s (rows one by one 520 ms apart, the two bars fill, then "Rechtzeitig vor der ETV"); phone 7 s (notification at 500 ms, figure and bars from 1.8 s).

## 3.2 The year grid (`#uv-js`'s grid step with `.pl` / `.tag`)

7.6 s through `loopInView`, as on the other pages: each pass resets (placeholders without label, milestones "offen"), then month k turns done at 300 + 380 × k ms; Jan–Apr tick without a label and leave the note alone (it still says "Dez: Heidi übernimmt" from the last pass), Mai turns lime with "ETV" and the note "Mai: ETV beschließt den Wechsel", Sep "Kündigung" / "Sep: Heidi kündigt per Vollmacht", and Dez becomes the current cell with "Vertragsende" and "Dez: Heidi übernimmt". Server and reduced motion: the end state.
