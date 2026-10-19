# Phase 3: Interactions

Same rules as the other landing pages: runes and the existing attachments, no new dependencies, timers only in the browser and cleared on teardown, `prefersReducedMotion()` means the end state. The design has no page-only script (`#ipf-js` is the form, `#uv-js` the template, `#dcta-js` the video button), so every interaction is the template's, the form's or the video button's.

## 3.1 Shared

- `reveal()` on `<main>`; the anchors `#kontakt`, `#inhalt` and `#faq` (sections get `scroll-margin-top: 72px`, the design's offset). The template's loops as on `/softwarepartner`: the hero's list (9 s, first pass after a full interval), the statement's words on scroll, `Phone` (7 s: the notification drops in, then the figure), `Doc` (7 s), `Calendar` (7.6 s: the nine cells tick through to the seventh), `Bill` (6.4 s), the rotator (2.3 s). No figure counts (every one is the design's `.dt`).

## 3.2 The form

- `superForm` with `zod4Client(successionInquirySchema)`, `validationMethod: "submit-only"`, `resetForm: true` (on success). `_t` is re-stamped on mount (the page is CDN-cached).
- After a submit with errors: the invalid fields get `.bad` and `aria-invalid` with `aria-describedby` on the message line, the line says "Bitte füllen Sie die markierten Felder aus." (`role="alert"`); a field's error clears with the next submit, as the design. Telefon only gets a mark when it's given and not a number; the selects never do.
- While sending: the button disabled, the line "Wird gesendet …". Success: the green line "Danke, <Name>! Wir melden uns bei Ihnen." (`role="status"`), the form empty. A failed send: the error line with the phone number as a `tel:` link, the values kept.
- Without JS: the native post to `#kontakt`; the response renders the same lines.

## 3.3 The video button

- The design's `#dcta-js`: the video plays while at least 30 % of it is on screen and pauses when it leaves (`inView`, threshold .3); a refused `play()` keeps the poster. Nothing with reduced motion (checked when the attachment starts). The design's fallback without `IntersectionObserver` isn't needed (every supported browser has it).

## 3.4 CSS only

- The buttons' hover and press (`.uv-btn`, the form button), the fields' focus ring, the FAQ's plus; the video button's growth, badge and arrow on hover; the eyebrows (`#eb-css`).
- With reduced motion: nothing moves (the landing reset; the video frame's transition and the badge's blink off, as `#dcta-css`).
