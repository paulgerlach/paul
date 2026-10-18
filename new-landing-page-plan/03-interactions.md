# Phase 3: Interactions

The rules match the other landing pages: runes and the existing attachments, no new dependencies, timers and observers only in the browser and cleaned up on teardown. `prefersReducedMotion()` means: no auto-switch, no staggered statuses, no confetti, no loops, no tweens; the switch, the sliders and the FAQ still work, instantly.

## 3.1 Reveal and anchors

- `reveal()` on `<main>` as on `/sicherheit`, for every `.rv` (threshold 0.15).
- The design scrolls `#` links smoothly with a 72 px offset (`#pg-common`). Here that's the landing pages' existing anchor behaviour (`scroll-margin-top` on the targets): check that `#doppelpflege` and `#start` land below the sticky header, and that "Demo buchen" focuses the closing form's e-mail field (`focusSignup`).

## 3.2 The hero switch (`Stage`)

`stage.svelte.ts`: a class with `$state` fields, provided per page through `setStage()` / `getStage()` (context, like `DashboardDemo`), so each visit starts fresh and nothing leaks between SSR requests.

```ts
type Mode = "two" | "one";
type Status = "man" | "pending" | "ok";

class Stage {
	mode = $state<Mode>("two");
	statuses = $state<Status[]>(["man", "man", "man"]);
	chosen = false; // the visitor used the switch (plain field)
	celebrated = false;
	#timers: ReturnType<typeof setTimeout>[] = [];

	set(mode: Mode, opts: { reduced: boolean; onLast?: () => void }) { … }
	autoSwitch(reduced: boolean) { … } // once, 3.4 s after first in view
	destroy() { … } // clears every timer
}
```

The design's `setMode` (`#si-js`), step by step:

- **"two":** clear the timers; every status `man` ("Manuell nachtragen", amber); steps "4 / Handgriffe je Liegenschaft: einloggen, exportieren, weiterleiten, abtippen".
- **"one":** clear the timers; every status `pending` ("…", no colour); steps "0 / Handgriffe: Die Daten liegen direkt in Ihrer Software"; then status *i* turns `ok` ("Synchronisiert", green, the `si-pop` scale) at 700 + 550 × *i* ms (0 ms under reduced motion). When the last one turns `ok` and the confetti hasn't played yet this visit, `burst()` (`$lib/landing/confetti.ts`) from the ERP list over the stage (the `#pg-common` burst: 120 pieces, about 4.6 s; pass the options that match it, or the default burst if the difference doesn't show). `burst` already does nothing under reduced motion; its stop function goes into the cleanup.
- The `Segmented` `bind:value` drives `stage.set(…)` through its change (an `onchange`-style callback or a setter on `mode`, **not** an `$effect` that syncs state). A visitor's choice sets `chosen`.
- **Auto-switch:** an `inView` attachment (`$lib/landing/attachments/inView.ts`) on the figure, once: unless reduced motion, 3.4 s later, if `mode` is still "two", `chosen` is false and the confetti hasn't played, switch to "one" (as if the second button were pressed, but without setting `chosen`). Leaving the view before then cancels it; coming back starts the 3.4 s again (the design fires once on first view and never cancels: ours is the same once the timer has fired).
- The CSS reacts to `data-mode`: the portal fades to the "Heidi · synchronisiert" face, the hand fades out, the fill line grows (`scaleX`, `scaleY` ≤ 640 px), the ERP card's border turns `--accent-deep`, the number box turns `--accent`.
- **The wire's loops** (CSS): in "two" the two packets travel portal → hand → ERP (`si-carry`, 3.2 s, the second 1.6 s later); in "one" three dots run along the fill line (`si-run`, 1.8 s, 0.6 s apart). The design starts them on `.in` and never stops them; here a `wire-on` class is set and removed by `loopInView` on the stage, so they only run while in view and in a visible tab. Reduced motion: no packets or dots (`animation: none; opacity: 0`, the design's rule).
- Screen readers: the steps line is `aria-live="polite"` (it changes only when the mode does, not per status); the statuses aren't announced; the wire and the portal's Heidi face are `aria-hidden`.

## 3.3 The calculator

- Four `$state` values from the content defaults; `doppelpflege(inputs)` through `$derived`. Each output text and each slider's `--p` (`(value − min) / (max − min) × 100 %`) are derived too.
- The big hours and the cost **tween** from the last shown value to the new one in 350 ms with the design's easing (`#pg-common`'s `tween`: ease-out cubic, `1 − (1 − p)³`); the cost rounds each frame to 10 € (01 §1.3). One `requestAnimationFrame` per figure; a new input cancels the running frame and starts from the value on screen. The tween is a side effect of the derived target (an `$effect` that only animates the displayed text and returns the frame's cancel), not state syncing. Under reduced motion the text jumps.
- The days line and the cells change at once (the design's); the cells' colour has a 0.3 s transition.
- Keyboard: native range inputs (arrows, Page Up/Down, Home/End). The `<output>`s are tied to their inputs with `for`; the result card is not `aria-live` (it would speak on every arrow press); `/selbstabrechnung`'s calculator is the model, check how it announces and match it.
- Without JS: the server's default result; the sliders move but nothing recalculates (as on `/selbstabrechnung` and `/upgrade-now`).

## 3.4 The data path

- `loopInView` on the path: every 900 ms the next node gets `lit` (`translateY(-3px)`, `--accent-deep` border), the others lose it, in order Funkzähler → Fernablesung → Heidi → Ihr ERP / CRM → again. Leaving the view or a hidden tab stops it; the server state is no node lit.
- The links' dots (`si-lk`, 2.4 s, 0.8 s and 1.6 s offsets; vertical `si-lkv` ≤ 860 px) run while the same attachment's `on` class is set.
- Reduced motion: every node lit at once (the design's), no dots.

## 3.5 Shared sections

All shared, nothing page-specific: `SectionHead`'s pill, `Testimonials`, the `Faq`'s own disclosure, the `SignupForm`, `TrustSeals`' entrance and seal sequence, `FloatingCta`'s hide-while-`final`-card-in-view.
