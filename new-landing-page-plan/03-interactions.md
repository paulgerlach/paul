# Phase 3: Interactions

Same rules as the other landing pages: runes and the existing attachments, no new dependencies, listeners only in the browser and removed on teardown, `prefersReducedMotion()` means the end state.

## 3.1 Shared

- `reveal()` on `<main>`; the anchors `#check` and `#produkte` (72 px scroll margin) and `#start` (the nav CTA, the four "Jetzt anfragen", the trust block's "Demo buchen" and the floating CTA lead to the closing form and focus its e-mail field).

## 3.2 `#ea-js`

- **The scale (`setScale(k, anim)`):** `ScaleCard` holds the chosen type (`$state`, "v") and the shown figure (`$state`, 118). The marker's `left`, the current class and the dimmed cells are `$derived` from the chosen type's value through `scale.ts`; the marker slides by its CSS transition (`left` 1.1 s `cubic-bezier(.2,.8,.2,1)`). A click on a type sets it and tweens the figure from the shown one to the new value (`tweenNumber`, 900 ms; the running tween cancelled first and on teardown).
- **The first show (`PG.onShow(#ea-card)` + 300 ms):** with motion allowed, on mount the card goes to the design's start state (the marker at 0 without a transition, the figure "0", no cell current or dimmed) and `inView` (once) starts the play 300 ms after it shows: the marker slides to 118, the figure counts from 0. The timer is cleared on teardown. With reduced motion or no JS the server's end state stays.
- **The check (`show()`, `next()`, `result()`):** the answers are buttons; a click stores the answer and asks `check.ts` for the next step. A question shows "Frage n von 4", the bar at (n − 1) / 4, its title, hint, the answers with their letters, and "Zurück" from question 2 on (one question back; the stored answers stay, as the design's). A result shows "Ergebnis", the full bar, its badge, title, text and offers. On "free" the confetti bursts from the badge (`confettiFrom`, stopped on teardown). The question block is `{#key}`ed on the step so the `ea-in` entrance (`.4 s`, from 16 px right) plays for each question, the result's (`.45 s`) when it shows. After a click the new question's heading (`tabindex="-1"`) or the result's heading takes the focus (`preventScroll`). The card is `aria-live="polite"` as in the design.
- **"Passende Angebote ansehen ↓" (`#ea-go`):** a link to `#produkte` (the browser scrolls); its click sets the page's filter through the `onpick` callback: "all" after "free", "b" otherwise (`filterFor`).
- **"Neu starten" (`#ea-again`):** clears the answers and shows question 1.
- **The offer filter (`PG.seg` + `filt()`):** `Segmented` bound to the page's filter (`bind:value`): the arrow keys move the choice. Each card's `.off` and `.hl` are derived from the filter and its type.
- **The bars (`.ea-heidi.in`):** `enterView` on the card: below the fold on load and with motion, `prepare` takes the card's `.in` away (bars at 0, the box hidden), `play` puts it back when the card comes into view (threshold .15, the design's reveal threshold).

## 3.3 CSS only

- The pills' icon on hover (`#pillfx`: 1.12 and `--ok`), the ghost buttons' border, the `bk-next` arrow (4 px) and press, the type buttons' and answers' hover and chosen states, the scale cells' current and dimmed states, the offers' 3 px lift, the filter's transitions, the bar's width transition, the FAQ's plus.
- With reduced motion: nothing moves (the landing reset).
