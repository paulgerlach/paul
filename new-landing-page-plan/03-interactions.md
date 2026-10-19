# Phase 3: Interactions

Same rules as the other landing pages: runes and the existing attachments, no new dependencies, timers only in the browser and cleared on teardown, `prefersReducedMotion()` means the end state. The design's only page-only script is `#spf-js` (the card form); `#ipf-js` is the contact form, `#uv-js` the template, `#dcta-js` the video button, so every other interaction is the template's, the form's or the video button's.

## 3.1 Shared

- `reveal()` on `<main>`; the anchors `#kontakt`, `#inhalt`, `#faq` and `#anbindung` (sections get `scroll-margin-top: 72px`, the design's offset). The template's loops as on `/nachfolge`: the hero's list (9 s, first pass after a full interval), the statement's words on scroll, `Doc` (7 s), `Phone` (7 s: the notification drops in, then the figure), `Calendar` (7.6 s: the nine cells tick through to the ninth), `Bill` (6.4 s), the rotator (2.3 s). No figure counts (every one is the design's `.dt`).
- The video button as on `/nachfolge` (plays while 30 % of it is on screen, never with reduced motion).

## 3.2 The contact form (`#kontakt`)

- `superForm` with `zod4Client(partnershipInquirySchema)`, `validationMethod: "submit-only"`, `resetForm: true` (on success). `_t` is re-stamped on mount (the page is CDN-cached). Posts to `?/partnership#kontakt`.
- After a submit with errors: the invalid fields get `.bad` and `aria-invalid` with `aria-describedby` on the message line, the line says "Bitte füllen Sie die markierten Felder aus." (`role="alert"`); a field's error clears with the next submit, as the design. Telefon only gets a mark when it's given and not a number.
- While sending: the button disabled, the line "Wird gesendet …". Success: the green line "Danke, <Name>! Wir melden uns bei Ihnen." (`role="status"`), the form empty. A failed send: the error line with the phone number as a `tel:` link, the values kept.
- Without JS: the native post to `#kontakt`; the response renders the same lines.

## 3.3 The card form (`#anbindung`)

- `superForm` with `zod4Client(connectionInquirySchema)`, `validationMethod: "submit-only"`, its own id `connection`. `_t` re-stamped on mount. Posts to `?/connection#anbindung`.
- After a submit with errors (the design's `#spf-js`): the invalid fields' labels get `.err` (red border and background), the consent's label turns red, `aria-invalid` and `aria-describedby` on the fields, the line "Bitte füllen Sie die markierten Felder aus."; the first invalid field gets the focus, as the design.
- While sending: the button disabled, the line "Wird gesendet …". Success: the form gives way to the thank-you panel (focusable, focused so screen readers hear it), and confetti bursts from its tick once (`confettiFrom`, the design's `PG.confetti`; nothing with reduced motion; stopped on teardown). A failed send: the line with the phone number, the values kept.
- Without JS: the native post to `#anbindung`; the response renders the panel or the marks.

## 3.4 CSS only

- The buttons' hover and press (`.uv-btn`, both form buttons: the card's ink button to `#2A443D` on hover and `scale(.98)` when pressed), the fields' focus, the FAQ's plus; the video button's growth, badge and arrow on hover; the eyebrows (`#eb-css`).
- With reduced motion: nothing moves (the landing reset; the video frame's transition and the badge's blink off, as `#dcta-css`).
