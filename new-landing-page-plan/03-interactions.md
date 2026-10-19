# Phase 3: Interactions

Same rules as the other landing pages: runes and the existing attachments, no new dependencies, listeners only in the browser and removed on teardown, `prefersReducedMotion()` means the end state.

## 3.1 Shared

- `reveal()` on `<main>`; the anchor `#start` as on the other pages (the nav CTA, the floating CTA and "Gespräch vereinbaren →" lead to the closing form and focus its e-mail field).

## 3.2 `#pr-js`

- **Downloads:** each row is `<a href="/landing/presse/<file>" download="<file>">`; its `onclick` (no `preventDefault`: the browser downloads) sets `saved = file` and adds `.ok` to the row (a `$state` set), and the message line (`aria-live="polite"`) reads "Gespeichert: <file>". The design clears the line before each click; here the next click replaces it.
- **Copy button:** `onclick`: `navigator.clipboard.writeText(boilerplate.text)`; when the API is missing or rejects, select the paragraph's contents (`Range`, `getSelection()`) and `document.execCommand("copy")` (the design's fallback; the selection stays). On success `copied = true` for 2.2 s (a timer cleared on the next click and on teardown): the button turns green, its label "Kopiert", an `sr-only` `role="status"` reads "Text kopiert". Without JS the button is hidden.
- **The mark (`PG.onShow(#pr-name)` → `.go`, after 1.3 s `.warm`):** one attachment on the card. Reduced motion: nothing (grown, no glow). Below the fold at mount: `grown = false` (the bars at `scaleY(.15)`, 20 % opacity), and an `IntersectionObserver` (threshold .15, once) sets `grown = true` (the CSS transition: .9 s, the second and third bar .15 / .3 s later) and after 1.3 s `settled = true`. On screen at mount: `settled = true` at once. The glow class is `settled && visible`, `visible` from `inView` (threshold 0), so the 3.2 s `drop-shadow` loop runs only while the card is in view. The timer and observers end on teardown.
- **Facts (`PG.countUp(n, value, 1100)` on show):** `countUp({ to, duration: 1100, viewDelay: 0, threshold: 0.15 })` on the "92" and "14" spans (German formatting is plain for these integers). The server renders the values.

## 3.3 CSS only

- The download rows' border and icon on hover, the press scale; the copy button's border on hover; the `ArrowLink` hover (the arrow moves 4 px); the press photo's 1.03 zoom on the card's hover (1.2 s).
- With reduced motion: nothing moves (the landing reset; the design's own `@media (prefers-reduced-motion)` block for the mark).
