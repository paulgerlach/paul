# Phase 3: Interactions

Same rules as the other landing pages: runes and the existing attachments, no new dependencies, timers only in the browser and cleared on teardown, `prefersReducedMotion()` means the end state.

## 3.1 Shared

- `reveal()` on `<main>`; the anchors `#bewerben`, `#inhalt` and `#faq` (sections get `scroll-margin-top: 72px`, the design's offset). The template's loops as on `/weg-verwaltung`: the hero's list (9 s, first pass after a full interval), the statement's words on scroll, `Doc` (7 s), `Calendar` (7.6 s), `Bill` (6.4 s), the rotator (2.3 s), the figures counting once.

## 3.2 Row 2: the building and its flats (`TwinPhone`)

- `loopInView` (threshold .3, every 10.5 s). A pass: the classes reset to none (screen a, the photo scaled, the facts hidden; the screens slide back with their transition, as the design), then `a` at 300 ms (the photo settles, the facts fade up), `go` at 2.6 s (the cursor moves in), `tap` at 3.3 s (the button presses), at 3.55 s `tap` and `go` off and `b` on (screen b slides in, the units fade up one by one).
- State: one `$state` set of flags; the server's (and reduced motion's) is `a b`.

## 3.3 Row 4: the tenant tracking (`TrackingPhone`)

- `loopInView` (threshold .3, every 12.5 s). A pass applies `TRACKING_STEPS` from `tracking.ts` at their times: which units are done, where the marker is, the count and its label, the heading, the bar's width, "Bei Ihnen", the push. Each count change replays the number's pop (a `{#key}` on the step).
- The marker is an SVG `<g>` moved with a CSS `transform` (`translate(<x>px, <y>px)`, .9 s), and the same `transform` attribute for browsers without CSS transforms on SVG.
- Server and reduced motion: `RESTING_STEP`.

## 3.4 Row 5: the meter photo

- CSS only, driven by `Bill`'s side: when the tile turns to "Heidi-Tool" the block opens (.5 s), the photo settles, the flash and the frame play once, the tick line fades in; on "Klemmbrett" it folds away.

## 3.5 The form

- `superForm` with `zod4Client(partnerInquirySchema)`, `validationMethod: "submit-only"`, `resetForm: true` (on success). `_t` is re-stamped on mount (the page is CDN-cached).
- After a submit with errors: the invalid fields get `.bad` and `aria-invalid` with `aria-describedby` on the message line, the line says "Bitte füllen Sie die markierten Felder aus." (`role="alert"`); a field's error clears with the next submit, as the design.
- While sending: the button disabled, the line "Wird gesendet …". Success: the green line "Danke, <Name>! Wir melden uns bei Ihnen." (`role="status"`), the form empty. A failed send: the error line with the phone number as a `tel:` link, the values kept.
- Without JS: the native post to `#bewerben`; the response renders the same lines.

## 3.6 CSS only

- The buttons' hover and press (`.uv-btn`, the form button), the chips' checked state, the fields' focus ring, the FAQ's plus; the eyebrows (`#eb-css`).
- With reduced motion: nothing moves (the landing reset, and `#ipx-css`'s own `transition: none` on the screens and the push).
