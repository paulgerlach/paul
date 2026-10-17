# Phase 3: Interactions

The rules match the other landing pages: runes and the existing attachments, no new dependencies, timers and observers only in the browser and cleaned up on teardown. `prefersReducedMotion()` means the end state, no loops, no zoom. Loops run only while their block is in view and the tab is visible (`document.visibilityState`), unlike the design's timers.

## 3.1 Step tabs

State in `Steps`: `active` (`$state`, 0–2) and `auto` (`$state`, true until the visitor takes over).

- **Selecting:** a click on a tab sets `active` and `auto = false` for good (the design's `user = true`). Keyboard per the WAI-ARIA tabs pattern, vertical: ↑/↓ (and ←/→) move focus and select (automatic activation, since the panels are already rendered), Home/End jump to the first/last; only the active tab has `tabindex="0"`. Any keyboard selection also sets `auto = false`.
- **Auto-advance:** once the block is 35 % in view (`inView`, the design's threshold), `active` advances every `steps.intervalMs` (6 s), wrapping to 0, while `auto` is true. It pauses while the pointer is over the block or focus is inside it (`pointerenter`/`pointerleave`, `focusin`/`focusout`), when the block leaves the view and in a hidden tab, and resumes from the current step. One `setTimeout` at a time, cleared on every change and on teardown; the remaining time isn't kept across a pause (a resumed step gets the full 6 s, and the bar restarts with it).
- **Progress bar:** `.ar-bar i` runs the design's 6 s `arbar` width animation while auto-advance runs, in step with the timer. It restarts through a `{#key}` on a counter that goes up with every new timer (step change or resume), not with the design's reflow trick. While paused it's empty, and once `auto` is false it isn't rendered.
- **Transitions:** texts fade and rise 6 px (0.4 s), pictures cross-fade (0.7 s) and the active picture eases from `scale(1.05)` to 1 over 6 s, the chip slides in 0.25 s after its picture. All are CSS on the `.on` class.
- **Reduced motion:** no auto-advance and no bar (`auto` starts false), no zoom, no fades (instant swap). The tabs still work.
- **No JS:** step 1 is shown (server render), the other texts are in the HTML but `inert` and invisible. Accepted as on `/selbstabrechnung`'s task toggle; the headings and the FAQ carry the process too.

The screen reader hears the tab change through the tab's `aria-selected` and the panel it controls; there's no live region (auto-advance must not talk every 6 s).

## 3.2 Wide image

Once the figure is in view (`inView({ once: true })`), it gets `.in` and the photo eases from `scale(1.04)` to none over 1.6 s. The server renders it without the scale (end state); the scale is applied only by a `.js-zoom` class set on mount when the figure is still below the viewport's bottom edge, so a visitor who loads the page with the image already visible doesn't see it jump. Reduced motion: nothing.

The caption's dot pulses with the design's `arp` keyframes (2.4 s, infinite, CSS only); `animation: none` under reduced motion. It's a single tiny compositor animation; no in-view pausing.

## 3.3 Day count

`RemoteDuty` shows `daysUntilObligation(clock.now)`. The clock starts at the server's `now` and ticks in the browser (the shared `DeadlineClock`), so the number is right after hydration and changes at Berlin midnight. No count-up animation (the design writes the number directly). Hydration: the server and the first client render use the same `now`, so there's no mismatch warning; the corrected value comes one tick later.

## 3.4 Reveal, links and the rest

- `{@attach reveal()}` on `<main>` with the design's reveal (`.rv`, threshold 0.15, `opacity`/`translateY(16px)` over 0.7 s), the same styles as `/selbstabrechnung`'s `+page.svelte`.
- Feature cards: hover background `--soft2` and a 2 px lift (CSS); buttons: the design's hover and `:active` scale 0.98.
- "Angebot einholen" and "Demo buchen" are plain anchors to `#start`; `scroll-margin-top: 72px` on the contact card gives the design's offset, and `tokens.css` already turns off smooth scrolling under reduced motion. The design's global anchor-scroll script isn't ported.
- FAQ: the shared `Faq`'s behaviour (native `<details>`, the `::details-content` transition), the plus turning into a minus on `[open]`.
- `FloatingCta`, `TrustSeals`, `SignupForm` bring their own behaviour (unchanged). `FloatingCta` hides while `section.final` (the contact card) is in view.
