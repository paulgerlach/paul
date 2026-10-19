# Phase 3: Interactions

Same rules as the other landing pages: runes and the existing attachments, no new dependencies, timers only in the browser and cleared on teardown, `prefersReducedMotion()` means the end state. The design has no page-only script (`#vb-css` is a style block; `#dcta-js` plays the video button the signup form replaces), so every interaction is the template's, the logo cards' entrance or the signup form's.

## 3.1 Shared

- `reveal()` on `<main>`; the anchors `#start`, `#inhalt` and `#faq` (sections get `scroll-margin-top: 72px`, the design's offset). The template's loops as on `/weg-verwaltung`: the hero's list (9 s, first pass after a full interval; the pills turn from amber to green, the texts stay), the statement's words on scroll, `Doc` (7 s), the rotator (2.3 s), "3" counting once ("Bund", "DE", "DSGVO" and "Berlin" don't count).

## 3.2 The logo cards

- The design's `.uv-row.in .vb-lg`: the card fades in and rises 10 px (`opacity .8s`, `transform .8s cubic-bezier(.2,.8,.2,1)`) once its row is shown. Here through `enterView` on the card: server-rendered shown; in the browser, a card still below the fold is put in its start state and plays when it comes into view (threshold .18); already on screen, with reduced motion or without JS it stays as rendered. Once only, as the design (the row's `in` never goes away).

## 3.3 The signup form

- The shared `SignupForm` in the closing card, as on `/weg-verwaltung`: `focusSignup` on every `#start` link, the success line "Danke! Wir melden uns innerhalb eines Werktags.", the inline error; without JS the native post.

## 3.4 CSS only

- The buttons' hover and press (`.uv-btn`), the FAQ's plus; the eyebrows (`#eb-css`).
- With reduced motion: nothing moves (the landing reset).
