# Phase 3: Interactions

Rules as on the other landing pages: runes and the existing attachments, no new dependencies, timers and observers only in the browser and cleaned up, `prefersReducedMotion()` renders the end state, the server markup is the end state (no-JS and above-the-fold content never flash or stay hidden).

## 3.1 Service checklist (hero)

Design: on view, the 5 items light up one after another (300 ms + 420 ms each: opacity .35 → 1, the check circle fills `--accent` and the check pops), then the "Ein Partner" row slides in and confetti bursts from it inside the card. A replay button restarts it.

- CSS keyframe animations on `.play` (the `playOnView` pattern of `tokens.css`'s `.a-*`): each `li` gets `animation: item-on .45s both` with `animation-delay: calc(300ms + var(--i) * 420ms)`, keyframes from the dimmed/unchecked state to the final one; the check `svg` and `em` background likewise; the "Ein Partner" row after `300 + 5 × 420 + 250` ms. Without `.play` the styles are the final state.
- `{@attach playOnView()}` on the card starts it once when visible. Confetti: `confetti.ts` with the card as host and the row as origin, fired on the row's `animationstart` (so it stays in sync with replays), skipped with reduced motion.
- Replay button: rendered only after mount (`mounted` flag set in `onMount`) and hidden with reduced motion; it calls the same `replay()` (export it from `playOnView.ts`).
- The design's `merge` class (`.ub-list li.merge`) is unused by the script; don't port it.

## 3.2 Deadline card (mission)

- `const clock = getDeadlineClock()`; `days = $derived(daysLeft(clock.today))`, `progress = $derived(retrofitProgress(clock.today))`, `expired = $derived(clock.expired)`.
- The number counts up from 0 with `countUp({ to: days, duration: 1200 })` on view; SSR and no-JS show `days`. The bar's width is `progress`, animated by the design's 1.6 s width transition once in view (start at 0 only after mount and when below the fold; above it render the final width).
- `days === 0` (31.12.): the card shows "Letzter Tag" (`daysLeftText`'s wording) instead of "0 Tage". Expired: the card shows `mission.expired` (placeholder, e.g. "Seit 1.1.2027 Pflicht") with a full bar and no number; the lead switches to `leadExpired`. Never `Date.now()` in the component.

## 3.3 Principles

- `let active = $state(0)`; buttons set it; `aria-pressed={i === active}` (the design sets `role="tab"` in a helper it doesn't call for this block, and `aria-pressed` in the page script; use `aria-pressed` buttons, not a tablist without arrow-key handling).
- The panel is `{#key active}` with the design's `ub-in` keyframe (6 px rise, .4 s) on the paragraph and list; none with reduced motion. Its `min-height: 150px` keeps the layout from jumping.
- The design builds the panel with `innerHTML`; we render from `content.principles[active]`.

## 3.4 Numbers

`countUp({ to })` on the 92 and 14 tiles (1200 ms, on view, no hover replay). "1–2" and "0" are static text (counting 0 → 0 is pointless).

## 3.5 Reveal on scroll

`{@attach reveal(".rv")}` on `<main>` (or per section, as `/upgrade-now` does) with the design's `.rv` transition styles; the trust cards keep `TrustCards`' own reveal. Smooth scrolling for `#` links: the design's 72 px offset is already `scroll-margin-top` in the shared sections; give `#stimmen` and `#start` the same.
