# Phase 3: Interactions

Same rules as the other landing pages: runes and the existing attachments, no new dependencies, listeners only in the browser and removed on teardown, `prefersReducedMotion()` means the end state.

## 3.1 Shared

- `reveal()` on `<main>`; the anchor `#start` as on the other pages (the nav CTA and the floating CTA lead to the closing form and focus its e-mail field). The hero's two CTAs and article 09's link jump to `#leitfaden` / `#kuerzung` (smooth through app.css, below the sticky header through `scroll-margin-top`).

## 3.2 The Schnell-Check (`upd()` in `#lf-js`)

The design sets `data-a` on the row from the clicked button and rebuilds the result's HTML. Here: `let answers = $state<Record<Key, boolean | undefined>>({})`; each button sets its row's answer (`aria-pressed` follows). Derived from `answers` through `check.ts`: the score, the ring's `stroke-dasharray` (0.6 s transition), the "N/5" text, the result (`{#if}` over the outcome's kind, inside a `role="status"` region). The risk box's link goes to `#start` with `focusSignup`.

- **Confetti:** after a click that leaves every answer "Ja", `confettiFrom(scoreElement)` (the design bursts from `#lf-sc`); the returned stop runs before the next burst and on teardown. Nothing with reduced motion.
- A second click on the chosen answer keeps it (as the design); there's no "unanswer".

## 3.3 The table of contents (`spy()` in `#lf-js`)

One passive `scroll` listener and a `resize` listener on `window` (an attachment on the guide section, removed on teardown), throttled to one `requestAnimationFrame`; on each frame it reads the nine articles' and the body's `getBoundingClientRect()` and sets `active` (`activeIndex`, line = 30 % of `innerHeight`) and `progress` (`readProgress`) as `$state`. It runs once on mount, so a reload in the middle of the page marks the right article. The links are plain anchors (the articles' `scroll-margin-top: 90px`); `aria-current="true"` on the active one. The bar's width moves over 0.2 s (none with reduced motion).

## 3.4 CSS only

- The pill's icon scales to 1.12 and turns `--ok` on hover (`#pillfx`); `.pg-ghost`'s border darkens; the TOC links turn grey; the check's buttons darken their border; `.bk-next` as the shared button; the FAQ toggles turn.
- With reduced motion: nothing moves (the landing reset).
