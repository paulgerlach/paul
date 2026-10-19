# Phase 3: Interactions

Same rules as the other landing pages: runes and the existing attachments, no new dependencies, listeners only in the browser and removed on teardown, `prefersReducedMotion()` means the end state.

## 3.1 Shared

- `reveal()` on `<main>`; the anchors `#checker` ("Eigene Abrechnung prüfen →"), `#zahlen` ("Zu den Zahlen ↓") and `#start` (the band's and the trust block's "Demo buchen" and the floating CTA lead to the closing form and focus its e-mail field). Sections get `scroll-margin-top: 72px` (the design's offset).

## 3.2 `#mc-js`: the card

State lives in `BillCheck` (`check.svelte.ts`, the page's context): the pane (`up`, `man`, `res`), the files, the flow's step, the answers (`co2`, `remote`, `uvi`: "?" at first; the sign), the values pane's fields (bound strings), `demo`, the example's `found`, the shown result, the lock, the letter.

- **Tabs:** "Hochladen" and "Werte eingeben" switch the pane (`role="tab"`, `aria-selected`; on the result pane neither is selected).
- **Files** (`add()`): the input's `change` and the drop zone's `drop` add JPG, PNG, WebP and PDF files; any other file shows "Bitte ein PDF oder ein Foto (JPG, PNG) hochladen." (the accepted ones are still added). `dragenter` / `dragover` set `.over` (`preventDefault`), `dragleave` / `drop` clear it. The input is cleared after each pick. An image gets a local preview (`URL.createObjectURL`, revoked when it's removed, on reset and on teardown); a PDF shows "PDF". "×" removes a file. Nothing is read or sent.
- **The flow** (shown with the first file, from step 1): "Schritt <step + 2> von 5" and the bar at (step + 2) / 5. Step 1: the date enables "Weiter →" and is copied to the values pane's "Erhalten am"; "Weiß ich nicht" clears it and goes on. Steps 2 and 3: an answer sets it (in both panes) and moves on after 280 ms (if still on that step). Step 4: the summary (the file names, the date or "nicht angegeben", the two answers; "Ändern" goes back to steps 1–3) and "Abrechnung prüfen →" takes the focus. "← Zurück" from step 2. The step's first field takes the focus (`preventScroll`) from step 2 on. Removing the last file hides the flow; the next file starts it at step 1 again.
- **"Abrechnung prüfen →":** the values pane with the note "Die automatische Erkennung ist in dieser Ansicht nicht verfügbar. …" (README: there's no reading here).
- **"Ergebnis anzeigen →"** (`compute`): `evaluate(values, today)` for the clock's Berlin day; the result pane; the figure counts from 0 (900 ms, `tweenNumber`; the share in % when there are no heating costs); with a sum or a share, confetti from the figure 500 ms later (`confettiFrom`, stopped on teardown); the letter section hidden; the lock as below.
- **"Beispiel ansehen":** `demo` on, the example's values for the day (the "Beispiel" tag), straight to the result.
- **"Werte ändern":** the values pane, the fields kept. **"Neue Abrechnung prüfen":** every file, field and answer reset (the sign "Nachzahlung"), the letter section hidden, the upload pane.

## 3.3 `#pw-js`: the paywall

- The result is locked unless unlocked: the points and "Musterschreiben erstellen" hidden, the teaser shown with its count. A result for own values after an unlocked example locks again.
- **"Gründe und Details ansehen →"** opens the dialog (`showModal()`): the document's rows from the values (the uploaded image when there is one), the points, "<n> Punkte"; locked: the grid blurred under the glass card. The example shows "Beispiel kostenlos freischalten" (it takes the focus), own values the disabled "Zahlung wird gerade eingerichtet" (with `PAY_HREF` set: the link "Jetzt für 39,99 € freischalten →" in a new window and the wait note on click). "×", the backdrop and Escape close it; the focus returns to the opener.
- **"Beispiel kostenlos freischalten":** unlocks (the glass fades, the grid sharpens, confetti from the points), and the result pane shows the points and the letter button.

## 3.4 The letter

- **"Musterschreiben erstellen →":** `letterText(result)` into the textarea, the section shown and scrolled to (72 px above its top, smooth unless reduced motion). The text stays editable.
- **"Text kopieren":** selects the text, tries `document.execCommand("copy")` and `navigator.clipboard.writeText`; the label reads "Kopiert" (or "Text markiert, bitte mit Strg+C kopieren") for 2.4 s.

## 3.5 `#ms-js`: the scan loop

With motion only, through `loopInView` (threshold .3, every 10.4 s). A pass resets the block (no row marked, no finding, "0", the empty bar, "Abrechnung wird gelesen …", the footer hidden), measures the sheet's height and each marked row's middle, then runs one `requestAnimationFrame` loop for 5.2 s: the beam's position eases in and out over the sheet, the bar follows the time, each row is marked as the beam passes its middle (its finding slides in, the count rises); at the end the beam goes, the status reads "4 Auffälligkeiten in dieser Abrechnung" and the footer fades in. The cleanup (leaving the view, the next pass, teardown) cancels the frame and restores the finished state.

## 3.6 The figures and the errors

- **Studies:** the switch sets the study; the figure tweens from the shown value to the study's (900 ms), dot i takes the new state at i × 8 ms (one `requestAnimationFrame` loop), text and source switch at once. With reduced motion everything at once. On first view below the fold (`enterView`, threshold .15): from 0 and no dots to "Verbraucherzentralen".
- **Stats:** `countUp` on "60" and "565" (1.2 s, ease-out cubic).
- **Error filter:** the cards of the kind (`{#key}` on the filter, so each change plays the entrance 40 ms apart).
- **Timeline:** `enterView` empties the bar below the fold and fills it on first view (1.6 s transition).

## 3.7 CSS only

- The pills' icon on hover (`#pillfx`: 1.12 and `--ok`), the drop zone's hover, the tabs, the yes/no buttons, the `bk-next` arrow (4 px) and press, the ghost buttons' border, the pay and example buttons, the FAQ's plus.
- With reduced motion: nothing moves (the landing reset).
