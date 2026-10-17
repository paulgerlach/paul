# Phase 3: Interactions

The rules match the other landing pages: runes and the existing attachments, no new dependencies, timers and observers only in the browser and cleaned up on teardown. `prefersReducedMotion()` means the end state, no loops, no counting, no confetti. Loops (the data-path pulse, the statement keys, the hero's auto-run) run only while their block is in view and the tab is visible (`document.visibilityState`), unlike the design's intervals, which never stop.

## 3.1 Hero billing demo

A small state machine in `BillingDemo` (`phase: "idle" | "loading" | "ready" | "making" | "done"`, `$state`), started by `inView({ once: true })` 400 ms after the card is in view:

- **loading:** status "Daten kommen" (blinking dot), the meter count counts 1 → 18 at 60–120 ms per step (the design's random jitter is fine; it's in the browser only), then the three checks tick one after the other (550 ms apart).
- **ready:** status "Bereit", the button is enabled with the pulse ring, hint "Alle Daten vollständig. Jetzt erstellen." After 2.6 s without a click, it runs "making" by itself, **quietly** (no confetti), as the design does.
- **making:** label "Wird erstellt …", a 160 ms press state; after 700 ms the stage swaps to the result list, rows fade in 120 ms apart.
- **done:** status "Erstellt", label "Erneut ansehen", hint "6 Abrechnungen · Beispieldaten", the toast shows for 3.8 s; on a click (not the auto-run), `burst()` from `$lib/landing/confetti.ts` from the toast. "Erneut ansehen" resets to ready and runs "making" again after 350 ms.

Hydration: the card is above the fold, so the server renders `idle` (0/18, "Daten kommen", button disabled) and the sequence starts right after hydration; rendering the end state on the server would flash back to 0/18 on every load. Without JS the card stays at "Daten kommen", an honest still of an example card (it carries "Beispieldaten"). With reduced motion, `onMount` sets `ready` at once (one text swap, no motion) and a click goes straight to done (no delays, no toast timer races). All timeouts live in one list that is cleared on teardown and on reset; `busy` is a plain `let`, not state.

## 3.2 Task split

`Segmented` binds `mode`. Both lists are `$derived` from `modes[mode]`; a task that changed columns gets the design's `moved` animation (keyed `{#each}` by task key; the previous mode is a plain `let` read in the derivation of `moved`, not an `$effect`). Other items get the staggered `sa-in` (50 ms × index) only on the first reveal, not on every toggle. The `abr` sub switches with the mode. The note is `aria-live="polite"`, so "Vollservice: …" is announced once per change. Reduced motion: no animations.

## 3.3 Calculator

- `costs` and `share` are `$state`, bound to the two sliders (`bind:value` with numbers); `result = $derived(distribute(…))`. Outputs, split, per-row bars and totals follow on `input`.
- Tweening: the design tweens each row total and the sum over 350 ms. Use one rAF tween per displayed number, written as a small helper in the component (from the last shown value to the new target, ease-out cubic), cancelled when a new target comes in and on teardown. The `<output>`s and the split figures change instantly, as designed. Reduced motion: no tween.
- The bars animate their width with a CSS transition (none under reduced motion).
- No live region on the table (a slider drag would flood it); the `<output>` elements are associated with their inputs, so screen readers read the value on change through the slider's `aria-valuetext` ("24.000 €", "70 %"), set from the formatted value.

## 3.4 Data path

Once in view, every 1 s the next station gets `.lit` (border in `--accent-deep`, lifted 3 px), cycling; the dot runs along the line with the design's `sa-run` keyframes. The interval starts on enter and stops on leave (`inView` without `once`) and in a hidden tab. Reduced motion: all stations lit, no dot animation.

## 3.5 Sample statement keys

- When the paper is 25 % in view: the paper's entrance (from the design's tilt/opacity transition), then after 900 ms the keys cycle 1 → 4 every 2.6 s; the active key gets `.on`, the matching `[data-k]` region of the paper `.hl` (a 3 px accent ring).
- Hovering a key shows its region and pauses the cycle; leaving resumes it. For keyboard and touch, each key is a `<button type="button" aria-pressed>` inside its `<li>` (the design's keys are hover-only `<li>`s): focus or a tap selects it and pauses the cycle, blur resumes it. `aria-controls` is not needed: the highlight is visual, the key's own text says what it points to.
- Reduced motion: no entrance, no cycle; hover/focus/tap still highlight.

## 3.6 Reveal, links and the rest

- `{@attach reveal()}` on `<main>` with the design's `.rv` transition styles, the same as `/hilfe`. The AllMeters cards (`.kx-big`, `.kx-three figure`) also get `.in` on show for their inner animations (`kx-run` sync line, `kx-tap` cursor on the "Abrechnung erstellen" chip, the meter rows fading in); none of these loop forever off-screen: they're CSS animations on elements that are only `.in` once shown, and `animation-play-state: paused` outside the viewport isn't worth the code for three small loops (check the Lighthouse CPU numbers in §4.1; if they suffer, pause them with `inView`).
- "Kostenverteilung ausprobieren ↓" and the "Demo buchen" links are plain anchors; `scroll-margin-top` on `#rechner` and `#start` gives the design's 72 px offset, and `tokens.css` already turns off smooth scrolling under reduced motion. The design's global anchor-scroll script isn't ported.
- `FloatingCta`, `People`, `TrustSeals`, `Faq` bring their own behaviour (unchanged).
