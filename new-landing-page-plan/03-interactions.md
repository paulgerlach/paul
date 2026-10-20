# Phase 3: Interactions

Same rules as the other landing pages: runes and the existing attachments, no new dependencies, timers and listeners only in the browser and cleared on teardown, `prefersReducedMotion()` means the end state. The design's page-only script is the inline camera loop; the rest is `#uv-js` (the template has it) and `#dcta-js` (the video button, replaced by the form).

## 3.1 The camera

- `CameraPhone` holds `$state` for the current `CameraState` (`CAMERA_END` on the server). A pass resets it to the empty state and sets each step of `CAMERA_STEPS` on its own timer; the cleanup clears them.
- Through `loopInView({ run, every: CAMERA_EVERY, threshold: 0.4 })`: the design starts the loop once at 40 % in view and lets it run forever; here it only runs while in view and in a visible tab (as every `uv` loop), and each stop leaves the end state (`loopInView`'s contract; the design's 9.5 s rhythm stays).
- Reduced motion: nothing runs (`loopInView` returns early), the end state stays; the CSS transitions are off under the media query (`#it-css`).

## 3.2 The template's loops

Unchanged and shared: the hero list (9 s), the statement's words on scroll, the phone (7 s), the twelve flats (7.6 s), "Ohne Tool / Mit Heidi" (6.4 s), the rotator (2.3 s), the figures counting once. All of them are `uv/` components with their own tests.

## 3.3 The signup form

The shared `SignupForm` in the closing card (`#start`): every "Demo buchen" (the hero, the rows, the first audience card, the trust block, the floating CTA, the nav CTA) scrolls to it and focuses the e-mail field through `focusSignup`, as on `/verbaende`. Works without JS (the form action).
