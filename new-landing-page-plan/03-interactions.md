# Phase 3: Interactions

Same rules as the other landing pages: runes and the existing attachments, no new dependencies, listeners only in the browser and removed on teardown, `prefersReducedMotion()` means the end state.

## 3.1 Shared

- `reveal()` on `<main>`; the anchors `#checker` (the nav CTA) and `#start` ("Mit eigenem Bestand auswerten →", "Auswertung anfragen →", the trust block's "Demo buchen" and the floating CTA lead to the closing form and focus its e-mail field).

## 3.2 `#pc-js`: the tool

- **Adding files** (`add()`): the input's `change` and the drop zone's `drop` add the chosen files (name, size, kind, `isAccepted`) as own files; files from the example are replaced first. The input is cleared after each pick, so the same file can be picked again. `dragenter` / `dragover` set the drop zone's `.ov` (and `preventDefault`), `dragleave` / `drop` clear it. The × removes an own file (not while running). Only names and sizes are read.
- **The example** (`#pc-ex`): not while running; replaces the list with the five example files and starts the run at once.
- **The run** (`go()`): `busy` on, the run button disabled, the shown result removed. For each file in turn: the row's scan line and the second dot spinning, 550 ms; an example file then gets its type tag and "<n> Seiten, lesbar" (or the warning chip and the warning dot for the scan), the third dot spins 450 ms, the fourth 380 ms, both done; an own file gets its format tag (or "Datei zu groß" / "Format nicht unterstützt" with the warning dot) and the last two dots locked. With reduced motion every wait is 0 ms. Then `busy` off and the result shows (`show()`). The waits are timers of `PortfolioCheck`, cleared on teardown; the run stops there.
- **The result** (`show()`): the evaluation for the clock's Berlin day (`exampleEvaluation(today)`, `kpis`), or the own-files panel; the section scrolls into view 250 ms later (0 with reduced motion; 90 px above its top, smooth unless reduced motion) and its heading takes the focus (`preventScroll`). With the example and motion: every 120 ms, at most 67 times, check whether the dark KPI is fully on screen (below 60 px); then after 250 ms `confettiFrom` it. The timers and the confetti stop on teardown.
- **"Beispielauswertung ansehen"** (`#pc-ex2`): starts the example and scrolls back to the tool (100 px above it).
- **The overview's chips:** a click toggles the row's popover (`aria-expanded`); hover and focus-within show it too (CSS).
- **"Als CSV herunterladen"** (`#pc-csv`): `toCsv` of the shown evaluation as a `text/csv;charset=utf-8` Blob, saved through a temporary `<a download>` (revoked after 1.5 s); "Gespeichert: Heidi-Portfolio-Beispiel.csv", or "Der Download ist hier gerade nicht möglich." on an error.

## 3.3 `#pc-how-js`: the steps' loop

With motion only, through `loopInView` (every 10.5 s, threshold .35): the pass hides every chip and zeroes the figures ("--.--." and "0"), then lights card 1 (200 ms) and shows its three chips 550 ms apart from 500 ms (the warning chip shakes), card 2 at 2.6 s ("Vertrag 2021" at 2.9 s, "+ Nachtrag 2023" sliding in at 3.5 s, both pulsing at 4.2 s, "Laufzeit bis 2027" at 4.7 s), card 3 at 5.6 s ("Kündigung bis" at 5.9 s, its value typed in place of "--.--." every 110 ms; "Geräte" at 6.6 s, its value counting to 72 in 900 ms, ease-out cubic, `requestAnimationFrame`), no card lit at 8.2 s. The cleanup (leaving the view, the next pass, teardown) cancels the timers and the frame and restores the end state: every chip shown, the final figures. The `anim` class (chips hidden until shown) is set on mount with motion only, so the server and reduced motion show every chip.

## 3.4 The list (the inline script, shared `NextSteps`)

- **The check run** (`run()` on first view, threshold .2): `enterView` on the card: below the fold on load and with motion, `prepare` empties it (no row in, no row checked, the counts 0, "Bestand wird geprüft …"), `play` brings row i in at i × 140 ms (scan look) and checks it at 700 + i × 420 ms (the chip pops in, the counts rise); with the last "7 Liegenschaften geprüft" with the green tick.
- **Filters and search** (`apply()`): the filter buttons (`aria-pressed`) and the search field (`input`, trimmed, lower case, part of the name) hide the other rows; the `sr-only` line says how many show.
- **The popovers:** a click toggles a row's popover; hover and focus-within show it (CSS), its three steps sliding in one after the other.

## 3.5 CSS only

- The pills' icon on hover (`#pillfx`: 1.12 and `--ok`), the drop zone's hover (border, ground, the tile 3 px up), the example button's hover, the documents' tile turn, the ghost buttons' border, the `bk-next` arrow (4 px) and press, the list rows' thumbnail zoom, the chips' lift, the FAQ's chevron.
- With reduced motion: nothing moves (the landing reset).
