# Phase 3: Interactions

Same rules as the other landing pages: runes and the existing attachments, no new dependencies, listeners only in the browser and removed on teardown, `prefersReducedMotion()` means the end state.

## 3.1 Shared

- `reveal()` on `<main>`; the anchors `#vorlage` (the hero's "Kündigung erstellen ↓", 72 px scroll margin) and `#start` (the nav CTA, the floating CTA and "Demo buchen →" lead to the closing form and focus its e-mail field).
- The page's `DeadlineClock` (`setDeadlineClock(data.now)`, started on mount) gives the letter's date: `germanDay(clock.today)`, so the date turns over at Berlin midnight in an open tab.

## 3.2 `#kd-js`

- **Live preview (`render()` on `input` / `change`):** the fields are one `$state` object bound to the inputs (`bind:value`), the clauses one bound to the checkboxes (`bind:checked`), the term the `Segmented` value; the letter is `$derived(buildLetter(…))`, the preview renders it (no `{@html}`: segments as text, placeholders as `<span class="ph">`), the plain text for copying is `$derived(plainText(letter))`. No effect.
- **Date switch (`.kd-term`):** `Segmented` (`role="radiogroup"` "Kündigungstermin", roving tabindex, arrow keys; the design sets `aria-checked` only after a click). "Zu einem Datum" shows the date field (`{#if}`; its value is kept in the state when it hides); the letter says "zum [Datum]" until a date is set.
- **Word and PDF (`save(kind, btn)`):** on click the button is disabled and its label reads "Wird erstellt …", the status is cleared; `await import("../docx")` / `import("../pdf")` builds the bytes from the current letter, a `Blob` (`application/vnd.openxmlformats-officedocument.wordprocessingml.document` / `application/pdf`) goes behind an object URL, a temporary `<a download="Kuendigung-….docx">` is clicked and removed, the URL revoked after 1.5 s (the timer cleared on teardown). Then the status "Download gestartet: <Datei>" and `confettiFrom(button)`. On an error the error text (`.err`). The button and its label come back in any case.
- **Text kopieren:** `navigator.clipboard.writeText(plainText)`; when that's missing or refused, a hidden `<textarea>` with `execCommand("copy")` (the design's way, which it tries first). Success: the label "Kopiert" for 2 s (a timer cleared on the next click and on teardown). Failure: "Kopieren nicht möglich. Markieren Sie den Text in der Vorschau." as an error.
- **Checklist:** each card toggles its `aria-pressed` state (`$state` array); the bar's width and the count are `$derived`. The click handler writes the line: "n von 4 geprüft", or, the first time all four are ticked, "Alles geprüft. Bereit zum Versand." with `confettiFrom(card)`; later clicks write the count again and never burst again (as the design's `done`).
- **The hero's letter (`PG.onShow(.kd-hv)` → `.in`):** CSS only (README, Key decisions): `kd-draw` (the path's `stroke-dashoffset` 1 → 0, 2.2 s from 0.6 s, `both`), the badges' pop (opacity and 10 px, `cubic-bezier(.3, 1.4, .5, 1)`, 0.5 s from 2.4 / 2.6 s, `both`) and the float (`kd-float` 6 s, infinite). `inView` on the visual sets `.off` while it's out of view, which pauses the float (`animation-play-state`).

## 3.3 CSS only

- The pills' icon on hover (`#pillfx`: 1.12 and `--ok`), the ghost buttons' border, the `bk-next` arrow (4 px) and press, the inputs' focus ring, the clauses' checked state, the checklist cards' 2 px lift and the tick's pop, the bar's width transition, the FAQ's plus.
- With reduced motion: nothing moves (the landing reset; the design's own `@media (prefers-reduced-motion)` block for the sheet and the signature).
