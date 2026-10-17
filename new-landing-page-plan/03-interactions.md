# Phase 3: Interactions

The rules match the other landing pages: runes and the existing attachments, no new dependencies, timers and observers only in the browser and cleaned up on teardown. `prefersReducedMotion()` means the end state, no loops, no tweens. Loops run only while their block is in view and the tab is visible.

## 3.1 Hero chart

State in `Hero`: `series` (`$state`, `"hz"` first, bound to `Segmented`) and `shown` (`$state`, the KPI number on screen).

- **Switching:** a new `series` sets the bar heights (`--h` per bar, CSS transition `height .7s cubic-bezier(.2,.8,.2,1)`) and tweens the KPI from 0 to the new value over 900 ms with `tweenNumber` (`$lib/landing/motion.ts`), as the design does. Unit and delta change at once. The tween runs from an `$effect` on `series` that skips its first run (the server's value is already shown) and returns the tween's cancel function, so a fast second click cancels the first tween.
- **On load:** no animation. The design counts up from 0 and grows the bars when the card comes into view, but the hero is in view on load, so that would flash the server's "131" and bars to 0 first. The rendered end state stays.
- **Formatting:** `toLocaleString("de-DE")` with the series' `decimals` on every frame, so "2,1" never shows as "2.1" or "2,0999".
- **Keyboard:** `Segmented` brings the arrows, Home and End.
- **Reduced motion:** `tweenNumber` sets the value at once; the bar transition is `none` (the design's media query).
- **Screen reader:** the radiogroup announces the choice; the KPI isn't a live region (the visible number changes on the visitor's own action, and the hidden month list changes with it).

## 3.2 Dashboard tabs

The shared `AutoTabs` (phase 1.5) with `count: 3`, `intervalMs: 6000`, `threshold: 0.15`, attached to the tabs block.

- **Behaviour** (as on `/vorgehen`): auto-advance every 6 s once in view, pausing on hover, on focus inside, out of view and in a hidden tab; a resume gets the full 6 s; a click or arrow key stops it for good. Keyboard: vertical tabs, ↑/↓ (and ←/→), Home/End, automatic activation, roving `tabindex`.
- **Progress bar:** the active tab's `<i>` runs the design's 6 s `fkBar` width animation while auto-advance runs, restarted through a `{#key}` on the timer counter (as on `/vorgehen`). Once stopped, the design shows the active tab's bar full (`.fk-tl.stop button.on i { width: 100% }`): keep that, so the bar marks the selected tab. While paused it's empty. Reduced motion: full, no animation (the design's media query).
- **Panel transitions** (CSS on `.on`): panels fade and rise 8 px (0.45 s); panel 1's bars grow to `--w` (0.9 s); panel 3's ticks slide in 0.25 s apart and the result chip pops in after 1 s. The server renders panel 1 with full bars. A panel that becomes active plays its entry again (the transitions are on `.on`, so they run on every switch, as in the design). Reduced motion: no transitions.
- **No JS:** panel 1 is shown, the others are in the HTML but `inert` and invisible, as on `/vorgehen`.

## 3.3 Five steps

The server renders the list with `.in` (line full, circles accent). On mount, if the list is still below the viewport's bottom edge and motion is allowed, `.in` is removed and set again by `inView({ once: true })` when it scrolls in, which plays the design's line (2.4 s) and the circles one after another. If the list is already visible on mount, it stays as rendered. Same approach as `/vorgehen`'s wide image (`js-zoom`).

## 3.4 Reveal, links and the rest

- `{@attach reveal()}` on `<main>` with the design's reveal (`.rv`, threshold 0.15, `opacity`/`translateY` over 0.7 s), the same styles as `/vorgehen`'s `+page.svelte`.
- Card hovers (lift, shadow, border), buttons' hover and `:active` scale 0.98, the arrow nudging 4 px: CSS only.
- "Demo buchen" links are plain anchors to `#start`; `scroll-margin-top: 72px` on the closing card gives the design's offset, and `tokens.css` already turns off smooth scrolling under reduced motion. The design's global anchor-scroll script isn't ported.
- FAQ: the shared `Faq`'s behaviour (native `<details>`, first open, the chevron rotating).
- `FloatingCta`, `TrustSeals`, `SignupForm` bring their own behaviour (unchanged).
- The closing card's video (`#dcta-js`: play in view, pause out of view) isn't ported while the video button is left out (README, open question 2). When it comes back, `playOnView` in `$lib/landing/attachments/` likely covers it.
