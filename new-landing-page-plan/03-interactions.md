# Phase 3: Interactions

Same rules as the other landing pages: runes and the existing attachments, no new dependencies, timers and listeners only in the browser and cleared on teardown, `prefersReducedMotion()` means the end state. The design's page-only script is `#ad-js`; its `#pg-common` adds the reveal (ours: `reveal`) and smooth anchor scrolling (ours: `app.css`).

## 3.1 The terminal

- CSS only: each line `animation: ad-line .5s ease both` (from `opacity: 0; translateY(4px)`), with the design's delays plus its 250 ms start (line 1 .25 s, 2 .6 s, 3 1.35 s, 4 1.6 s, 5 1.75 s, 6 1.9 s, 7 2.05 s, 8 2.2 s, 9 2.35 s). `@media (prefers-reduced-motion: reduce)`: no animation. Plays on load (the hero is the first screen); the server's HTML is the end state.

## 3.2 The moving lines

- `FlowLine`: the design's `adflow` (2.6 s, `cubic-bezier(.5, 0, .5, 1)`, endless; `adflowv` for the vertical line below 640 px), `animation-play-state: paused` until `inView` (threshold 0) adds `.run`, paused again when it leaves. Nothing with reduced motion (the attachment returns early, and the CSS has `animation: none` under the media query).

## 3.3 The table of contents

- `Sidebar` holds `$state` current (0). One passive `scroll` listener on the window (`<svelte:window>`), throttled to one animation frame, reads the articles' tops (`getBoundingClientRect().top`, ids from `content.ts`) and sets current through `activeIndex(tops, 160)` (the design's `y + 40` with `y = 120`); also once on mount (a reload mid-page).
- The current link gets `.on` and `aria-current="location"`. Below 1040 px the chip row doesn't follow (as designed).
- A click is a plain anchor jump (smooth through `app.css`, instant with reduced motion through `tokens.css`); the article's `scroll-margin-top: 90px` keeps its H2 below the header. The URL gets the hash (the design prevents it; keeping it lets a reader share a section).

## 3.4 "Kopieren"

- `CodeBlock` copies its code's text (the `code` element's `textContent`, so the highlighted JSON copies as plain text): `navigator.clipboard.writeText`, else (or on rejection) the design's fixed, transparent textarea with `execCommand("copy")`, as `/presse`'s `Boilerplate`. Then "Kopiert" with `.ok` for 1.6 s (the timer cleared on teardown and on a second click), and the page's polite `sr-only` line says "Code kopiert".
- Hidden without JS (`@media (scripting: none)`).

## 3.5 CSS only

- The `.bk-next` / `.pg-ghost` / `.ad-ghost` hovers, the service cards' lift, the table of contents' hover, the pill icon (`#pillfx`).
- With reduced motion nothing moves (the landing reset; `#ad-css`'s media query).
