# Phase 3: Interactions

Same rules as the other landing pages: runes and the existing attachments, no new dependencies, listeners only in the browser and removed on teardown, `prefersReducedMotion()` means the end state.

## 3.1 Shared

- `reveal()` on `<main>`; the anchor `#start` as on the other pages (the nav CTA "Bestand prüfen" and the floating CTA lead to the closing form and focus its e-mail field).

## 3.2 The topic filter (`#bl-js`)

The design toggles `.on` on the buttons and `.hide` on every card whose `data-t` isn't the chosen topic ("Alle" shows all). Here: `let topic = $state<Topic>("all")` bound to `Segmented` (radiogroup: click, arrow keys, Home, End); each card gets `hidden={!shows(topic, story)}`; a visually hidden `aria-live="polite"` line says `countText(n)` after a change. No animation (the design has none: `display: none`).

## 3.3 CSS only

- The featured card lifts 3 px with a shadow on hover; its photo and the cards' photos zoom to 1.04 over 1.4 s; the arrows move 3 px. Only on cards that are links.
- The rows move 3 px right and their border turns green on hover.
- The pill's icon scales to 1.12 and turns `--ok` on hover (`#pillfx`).
- With reduced motion: no zoom, no lift, no movement.
