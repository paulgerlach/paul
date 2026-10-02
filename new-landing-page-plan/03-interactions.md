# Phase 3: Interactions and animation

The design wires everything with one vanilla script that uses `getElementById` and `innerHTML`. Port each behaviour into the component that owns its markup, using runes for state and attachments for DOM behaviour (see `svelte-migration-plan/patterns.md`). No new dependencies.

**Global rule:** every animation checks `prefers-reduced-motion`. With reduced motion, elements render in their end state, and nothing loops or counts. Put one shared helper in `$lib/landing/motion.ts` (`prefersReducedMotion()`, browser-only).

## 3.1 Reusable attachments (`$lib/landing/attachments/`)

| Attachment | Replaces in design | Behaviour |
|---|---|---|
| `inView({ threshold, once })` | `IntersectionObserver` setup repeated across the script | Calls `onEnter`/`onLeave` handlers. Disconnects on cleanup |
| `playOnView({ loop?: ms })` | `[data-anim]` + `.play` class + `data-loop` replay | Adds `.play` when the element is visible. If `loop` is set, it restarts the animation every `loop` ms while the element is visible (remove the class, force a reflow, add it back). The CSS keyframes (`a-up`, `a-pop`, … with a `--d` delay) stay in CSS as they are |
| `countUp({ to, duration: 1400, trigger: 'view' \| 'hover' })` | `[data-count]` + the hover counter in "Pflichten ohne Aufwand" | `requestAnimationFrame` with an ease-out cubic, as in the design. On `mouseleave` it resets to the final value |
| `equalHeights(selector)` | `equalize()` on resize | Sets the same `min-height` on headings in a row so the paragraphs line up. Uses `ResizeObserver` instead of the window `resize` event. Turns off below the stacking breakpoint |

## 3.2 Per-section behaviour

| Section | Behaviour | Implementation |
|---|---|---|
| Hero card | Every 6 s the status goes to "Heidi prüft den Vertrag" (spinner, last check pending), then after 2.2 s back to "Wechsel freigegeben" (check) | `let reviewing = $state(false)` with an interval in `$effect` that is cleared on teardown. It only runs while the card is in view (`inView`), so a background tab doesn't keep timers. The status text is in an `aria-live="polite"` region, **or** the card stays `aria-hidden` (pick the second, because it's decoration) |
| Demo card | The video plays on hover, focus or touch, and pauses on leave or blur | `onmouseenter`/`onfocus`/`ontouchstart` call `video.play().catch(() => {})`. Use `bind:this` for the video |
| Old way | Tiles pop in one by one, every 650 ms after 400 ms. They hold for 3.5 s, fade out, and the cycle repeats. It starts at 25 % visibility | A `visibleCount = $state(0)` driven by a timer chain in `$effect`, started by `inView`. Each tile gets `class:in={i < visibleCount}`. Clear all timers on teardown. With reduced motion, all tiles are shown |
| Heidi way (phone) | Bubble lines animate in and replay every 10 s | `playOnView({ loop: 10000 })` |
| Service chat | Question, then typing dots, then the answer. Replays every 9 s | `playOnView({ loop: 9000 })` |
| Automation doc / clarify | Flag and warnings pop in | `playOnView()` |
| "Pflichten ohne Aufwand" | 212 counts up on view and again on hover | `countUp({ to: 212, trigger: 'view' })` plus a hover trigger on the card |
| Rollout Gantt | Hovering, focusing or clicking a row highlights it, dims the others, and positions a tooltip near the bar (title, week, kind label, bullet list, milestone). Clicking the same row again hides it. Leaving or blurring hides it. The tooltip moves when the Gantt scrolls horizontally | `activeRow = $state<number \| null>(null)`. The tooltip is a single element rendered from `ganttRows[activeRow]`, positioned in an `$effect` from the bar's `getBoundingClientRect()` relative to the card, and re-run on the scroll event. The tooltip has `role="tooltip"`, and the active bar gets `aria-describedby` |
| Budget chart | Tabs switch the series (Heizung, Warmwasser, Kaltwasser). Bars are scaled to the series max. Bars after month 9 (September, `NOW = 9`) are "plan" style. Each tab shows the sum so far ("bisher 12.345 €"). The ring percentage animates. Hovering, focusing or clicking a bar shows a tooltip with the month and the € amount | `series = $state<'hz' \| 'ww' \| 'kw'>('hz')` with `$derived` heights and sums. Use `Intl.NumberFormat('de-DE')` for the € values. Bars are `<button>`s with `aria-label="März: 5.100 €"`. Tabs use `role="tablist"`/`tab` and `aria-selected`, with arrow-key navigation |
| Risk chart | 4 bars (168/121/104/84 kWh/m², max 190) and an average line at Ø 119. A bar more than 15 % above the average is highlighted. Hovering, focusing or clicking a bar changes the tag text, the action link and the highlighted label, and shows a tooltip ("7 von 25 Einheiten"). Leaving resets to bar 0 | `active = $state(0)` and `$derived` average and heights. The data is in `data.ts` |
| FAQ | Native `<details>` | Nothing to add. Optional: animate the height with the `::details-content` CSS transition where the browser supports it |
| Header | Dropdowns (hover and focus-within on desktop, accordion on mobile) and the burger menu | See phase 1.3. Reuse the `menu` singleton and `clickOutside`. Esc closes an open dropdown or the menu |

## 3.3 Performance notes
- Timers and observers are only created in the browser (`$effect` and attachments don't run during SSR). Every one of them is cleaned up on teardown, so client-side navigation away from the page leaves nothing running.
- Loops pause when their section is off-screen. The design keeps `setInterval`s running and only skips the replay. Here, clear the interval on `onLeave` and restart it on `onEnter`.
- Animate only `transform` and `opacity` where the design allows it. The design animates `width` in the progress bars (`a-w`, `a-growx`). Keep that (it's cheap at this size), but check that CLS stays 0.

## Done when
- Every behaviour above works with the mouse, the keyboard (Tab, Enter, arrow keys on tabs) and touch.
- With `prefers-reduced-motion: reduce` (Chrome DevTools rendering emulation) nothing moves and all content is visible.
- No console errors. Navigating from `/messdienstwechsel` to `/preise` and back doesn't duplicate timers (check with the Performance panel or a temporary `console.count`).
