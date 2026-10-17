# Phase 3: Interactions

The rules match the other landing pages: runes and the existing attachments, no new dependencies, timers and observers only in the browser and cleaned up on teardown. `prefersReducedMotion()` means the end state, no loops, no counting. Loops run only while their block is in view and the tab is visible; they go through `loopInView` (phase 1.5), whose `run` resets its block to the start state and schedules the steps, and returns a cleanup that clears them.

A loop's first `run` resets a block that the server rendered in its end state. For blocks below the fold that's invisible. For the hero (in view on load), see 3.1.

## 3.1 Hero portal list

`loopInView` on `PortalMock`, every 9000 ms. A run: the entries fade in (0.5 s, 0.1 s apart) with their "before" pill (amber), then turn to "after" (green) one by one at 1.4 s + 0.7 s × i. State: `$state` per entry (`ok: boolean`) and a `go` flag in the component.

- **On load:** the design starts with the list hidden and plays it in. Here the server's end state is shown first; the first run starts after a 9 s delay (`loopInView`'s `delay` option, or the component skips the first call), so the page doesn't flash from finished to empty on load. From then on it loops as designed.
- **Reduced motion:** the end state, no loop.
- **Screen reader:** the mock is `aria-hidden`; the hidden list states the final statuses (phase 2, 1a). No live region.

## 3.2 Statement

The words light up with scroll progress: `p = (0.82 · vh − top) / (height + 0.3 · vh)`, clamped to 0–1, and the first `round(p · n)` words get `on`. One passive `scroll` and `resize` listener (`<svelte:window>`), throttled to one `requestAnimationFrame`, that writes a `$state` count only when it changes; the class list derives from it.

- **Server and no JS:** every word `on` (phase 2). On mount, when motion is allowed, the count is computed at once, so a statement below the fold starts dimmed before it's seen.
- **Reduced motion:** no listener, all white (the design's media query does the same).

## 3.3 The four tiles

Each tile's loop is attached to its row (`<article>`), as in the design (`loop(row, …)`), threshold 0.15:

| Tile | Every | One run |
|---|---|---|
| Calendar | 7600 ms | All months "offen"; then month k (0…current) at 300 + 380·k ms turns `done` "bereit" (k < current) or `now` "wird erstellt" (k = current); the note follows the last changed month ("Sep bereitgestellt" … "Okt wird erstellt") |
| Phone | 7000 ms | Reset (no `s1`/`s2`, bars at 6 %); `s1` (notification in) at 500 ms; `s2` (notification green, figure in) at 1800 ms, the bars growing 60 ms apart |
| Statement | 7000 ms | Rows off and no check; from 120 ms the rows come in 520 ms apart (bars filling to `--w`); the check line 500 ms after the last |
| Before | 6400 ms | "Ohne Portal" (thumb left, the two red rows, "viele"); at 2600 ms "Mit Heidi" (thumb slides, the red rows collapse, the ticks appear, "weniger") |

State lives in each tile component (`$state`), classes derive from it; the run function only sets state and timeouts. The tiles are `aria-hidden`, so nothing is announced. Reduced motion: the server's end state, and the calendar's spin and pulse are off (CSS).

## 3.4 Rotator

`loopInView` on the section, every 2300 ms: the next phrase becomes `on`, the previous one `prev`, the others neither (CSS transitions of 0.8 s for opacity, blur, transform). The index is `$state`. The first run keeps phrase 1 `on` (the server's state), so the first visible change is to phrase 2. Reduced motion: phrase 1 only, `transition: none` (the design's). The visible stack is `aria-hidden`; the hidden list holds all four.

## 3.5 Numbers

`countUp` (`$lib/landing/attachments/countUp.ts`) on "12", "3" and "14": from 0 to the value over 1100 ms when the card comes into view, once (as the design: `onShow`, not a loop); "1–2 h" and "0" don't count. The server renders the final values; `countUp` already handles reduced motion and the `de-DE` format.

## 3.6 Mini dashboard

- **Scale:** a `ResizeObserver` on the tile (instead of the design's window `resize`) sets `s = clamp(0.6, tileHeight / 340, 1.25)`, the inner width `tileWidth / s` and `transform: scale(s)`; the pill's `left`/`width` follow the active tab's `offsetLeft`/`offsetWidth`. Runs once on mount, also under reduced motion (it's layout, not motion).
- **Loop:** `loopInView`, every 10400 ms. A run: reset (no `go`, rows and the status head not `ok`, toast hidden), tab "Wöchentlich", at 500 ms "Monatlich" (the pill slides), at 1000 ms `go` (lines draw, bars grow; the bars' staggered `transition-delay` is in content order), status rows `ok` at 1500 + 550·i ms, the status head 150 ms after the last, the toast 600 ms after the last, and at 9600 ms the fade-out before the next run.
- **Reduced motion:** the end state (`go`, all `ok`, toast shown, "Monatlich"), no loop.
- The tile is `role="img"` with its label; nothing inside is announced.

## 3.7 Reveal, the photo and the rest

- `{@attach reveal()}` on `<main>` with the design's reveal (`.rv`, threshold 0.15, `opacity`/`translateY` over 0.7 s), the same styles as `/funktionen`.
- `Picture`: on mount, if the figure is still below the viewport's bottom edge and motion is allowed, `.in` is removed and set again by `inView({ once: true })` when it scrolls in, which plays the 1.8 s zoom-out. Already visible on mount: stays as rendered. Same approach as `/vorgehen`'s `WideImage` (`js-zoom`).
- The audience photos' hover zoom, the buttons' hover colours and `:active` scale 0.98: CSS only.
- Anchors (`#start`, `#inhalt`, `#faq`) are plain links with `scroll-margin-top: 72px` on their targets; `tokens.css` already turns off smooth scrolling under reduced motion. The design's global anchor-scroll script isn't ported.
- FAQ: the shared `Faq`'s behaviour (native `<details>`, the chevron rotating), with `openFirst={false}`: the design's `.uv-fl` opens none.
- `FloatingCta`, `TrustSeals`, `SignupForm` bring their own behaviour (unchanged).
- The closing card's video (`#dcta-js`) isn't ported while the video button is left out (README, open question 1).
