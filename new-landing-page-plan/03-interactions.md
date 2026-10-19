# Phase 3: Interactions

Same rules as the other landing pages: runes and the existing attachments, no new dependencies, listeners only in the browser and removed on teardown, `prefersReducedMotion()` means the end state.

## 3.1 Shared

- `reveal()` on `<main>`; anchors (`#so`, `#faq`, `#start`) as on the other pages.
- `--top` is the landing header's height (`nav.top`), measured on mount and on resize.

## 3.2 The scroll scene (`#pv-js` "Scroll-Szene")

Pure `scene.ts`, tested: `sceneState(p)` for the progress `p` (0–1, the scene's scroll through its height) returns the frame's width (88 → 100 %) and radius (28 → 16 px), the room's zoom (1 → 2.35), blur and opacity, the meter's opacity, zoom and blur, the caption (0 / 1 / 2 at 0.33 and 0.62), the signals (from 0.68) and tags (0.74, 0.8, 0.86); `coverX(…)` the layers' horizontal offset that keeps the image covering the frame, aimed at its focus point (the design's `cov` and `dxFor`); `ease`.

`Scene`: one passive scroll and resize listener, work in `requestAnimationFrame`, styles set on the layers directly (no reactive state per frame); the caption, signals and tags are `$state` that changes only at the thresholds. States:

- **Server, before hydration, with JS and motion:** the start state (`p = 0`), the full 340 vh, so nothing jumps when the script takes over.
- **No JS** (`@media (scripting: none)`) **and reduced motion:** the design's reduced-motion state: the section short, the frame 70 vh at full width, the meter photo, the last caption, signals and tags shown.

The info card: a point or tag click (or hover on a hovering pointer) opens it beside the point, kept inside the frame; "×", Escape, a click outside and scrolling back out of the signals close it. Focus stays on the trigger; the card is `role="dialog"` with its title.

## 3.3 The flow

Above 900 px the step and its line's fill follow the scroll (`flowStep(p)`: `p · 5`); a click scrolls to the step's middle. At 900 px and below the section is short, a click shows the step and restarts a 4.2 s auto-advance (`loopInView`; none with reduced motion). The text under the steps fades out and in (150 ms).

## 3.4 One-time and loops

- The comparison's marks pop in with the design's delays when the table comes into view (`enterView`).
- The marquee is CSS (70 s, paused on hover, none with reduced motion), running only while in view (`loopInView` toggles a class).
