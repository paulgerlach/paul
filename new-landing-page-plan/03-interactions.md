# Phase 3: Interactions

The rules match the other landing pages: runes and the existing attachments, no new dependencies, timers and observers only in the browser and cleaned up on teardown. `prefersReducedMotion()` means the end state: no packets, no pings, no sequences, no CSS loops; the table rows and the FAQ still open and close, just without the slide. One-time entrances go through `enterView` (01 §1.6); the one loop goes through `loopInView`.

## 3.1 Reveal

`reveal()` on `<main>` as on the other pages, for every `.rv` (the design's `#pg-common` observer, threshold 0.15). The design's smooth scrolling for `#` links with a 72 px offset is the landing pages' existing anchor behaviour (`scroll-margin-top` / `scroll-behavior` in `tokens.css`): check that `#daten` and `#start` land below the sticky header.

## 3.2 The map

`DataMap.svelte`:

- **Entrance:** `enterView` on the map: `prepare` removes `.in` (the states drop to transparent), `play` adds it (`scst`, 1.2 s). On screen at load (the hero usually is), it stays as rendered.
- **Packets:** `loopInView` on the map. Its `run` schedules `send()` after 900 ms, then again every 900–1800 ms (`Math.random`, browser only), and returns a cleanup that clears the timeout and every running packet. `send()`:
  1. picks a random dot `i`, adds the packet to a `$state` list `{ id, i, x, y, opacity }` (rendered as `<circle r="2.6">` in `.pk`), and replays the dot's `.ping` (remove, reflow, add; or a key on the ring so Svelte re-creates it).
  2. runs one `requestAnimationFrame` loop for all live packets (not one per packet): duration 2600–3800 ms each, position `pointAtLength(table[i], curve[i], ease(p))`, `opacity(p)`; the arc tables are computed once per curve on mount.
  3. on arrival removes the packet, replays the server's `.hit`, fades the log line out, swaps it to `nextMessage` after 250 ms, fades it in.
  The design checks `document.hidden` before sending; `loopInView` already stops the loop in a background tab. Nothing is announced (the log is `aria-hidden`).
- Packets live in component state, not in DOM nodes created by hand, so Svelte owns the markup and teardown leaves nothing behind.

## 3.3 Principles

`enterView` on `.sc-3`: `play` adds `.play` to each card in turn (300 ms + 700 ms × i) and removes it after 1.8 s; the cleanup clears the timers. `prepare` does nothing (the end state is the icon at rest). Hover keeps its CSS loops, off under reduced motion.

## 3.4 The data path

`enterView` on `.sc-flow`: `prepare` turns every node and line off; `play` runs the design's sequence `[[0], [line 0], [1], [line 1], [2], [line 2], [3, 4, 5]]` in 550 ms steps, each node getting `on` and a 400 ms `pulse`. State: `lit = $state(new Set<string>())` and `pulsing`, read by the classes; the cleanup clears the step timer. Already on screen, reduced motion or no JS: everything on, as rendered.

## 3.5 The table

- **Entrance:** `enterView` on `.sc-tb`: `prepare` removes `.in` (the location checks scale to 0), `play` adds it; the per-row `transition-delay` (0.15 s + 0.12 s × i) is set inline from the index.
- **Rows:** native `<details>`; the slide uses `slideToggle` (`$lib/attachments/`) the way the shared `Faq` does, so a click animates the detail's height (0.35 s) and the chevron turns (`details[open]`). Several rows can be open at once, as in the design. Under reduced motion the row opens instantly.

## 3.6 FAQ, closing, trust, floating CTA

All shared: the `Faq`'s own disclosure, the `SignupForm`, `TrustSeals`' entrance and seal sequence, `FloatingCta`'s hide-while-`final`-card-in-view. Nothing page-specific.
