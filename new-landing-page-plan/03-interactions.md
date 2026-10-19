# Phase 3: Interactions

Same rules as the other landing pages: runes and the existing attachments, no new dependencies, timers only in the browser and cleared on teardown, `prefersReducedMotion()` means the end state. The design has no page-only script (`#ipf-js` is the form, `#uv-js` the template), so every interaction is the template's or the form's.

## 3.1 Shared

- `reveal()` on `<main>`; the anchors `#bewerben` and `#faq` (sections get `scroll-margin-top: 72px`, the design's offset). The template's loops as on `/installationspartner`: the hero's list (9 s, first pass after a full interval), the statement's words on scroll, `Bill` (6.4 s), `Calendar` (7.6 s), `Doc` (7 s), `Phone` (7 s: the notification drops in at .5 s, the screen with the list at 1.8 s), the rotator (2.3 s), the figures counting once ("12" and "1"; "0", "DE" and "DSGVO" don't count).

## 3.2 The form

- `superForm` with `zod4Client(softwarePartnerInquirySchema)`, `validationMethod: "submit-only"`, `resetForm: true` (on success). `_t` is re-stamped on mount (the page is CDN-cached).
- After a submit with errors: the invalid fields get `.bad` and `aria-invalid` with `aria-describedby` on the message line, the line says "Bitte füllen Sie die markierten Felder aus." (`role="alert"`); a field's error clears with the next submit, as the design. Telefon only gets a mark when it's given and not a number.
- While sending: the button disabled, the line "Wird gesendet …". Success: the green line "Danke, <Name>! Wir melden uns bei Ihnen." (`role="status"`), the form empty. A failed send: the error line with the phone number as a `tel:` link, the values kept.
- Without JS: the native post to `#bewerben`; the response renders the same lines.

## 3.3 CSS only

- The buttons' hover and press (`.uv-btn`, the form button), the chips' checked state, the fields' focus ring, the FAQ's plus; the eyebrows (`#eb-css`).
- With reduced motion: nothing moves (the landing reset).
