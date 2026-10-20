# Phase 2: The sections

## 2.1 The page

`+page.svelte` renders `<main id="content" class="it" {@attach reveal()}>` with the page tokens (`--bg: #f6f7f6`, `--hair: #e5e9e7`), the reveal's `.rv` rules and `#hs-css` (`section:not(.end):not(.rows):not(.who) h2[id]` between 621 and 1040 px and below), as `/verbaende`'s route; `UvMain` around the dark sections; `Trust` after it; then `FloatingCta`. Sections in `$lib/landing/pages/installationstool/sections/`.

| # | Section | Design | Component | Notes |
|---|---|---|---|---|
| 1 | Hero | `.uv-hero` | `Hero` → `uv/Hero` `lg` + `uv/ListMock` | Photos `vorgehen/building-wide.webp` (25vw) and `installationspartner/fitter.webp` (35vw, `objectPosition` "42% 50%"); id `it-h1` |
| 2 | Statement | `.uv-stm` | `Statement` → `uv/Statement` | |
| 3 | Rows | `.uv-rows#inhalt` | `Rows` → `uv/Rows` | `idPrefix` `it-row`; tiles: `uv/tiles/Phone`, `CameraPhone`, `uv/tiles/Calendar`, `uv/tiles/Bill` |
| 3a | Camera | `.uv-phone.it-ph` + `.it-cam` | `CameraPhone` | See 2.2 |
| 4 | Rotator | `.uv-blur` | `Rotator` → `uv/Rotator` | |
| 5 | Figures | `.uv-num` | `Numbers` → `uv/Numbers` `mediaKind="photo"` | `vorgehen/kitchen-meters.webp`; id `it-num-h` |
| 6 | Audience | `.uv-who` | `Audience` → `uv/Audience` | `idPrefix` `it-who`; `mieterportal/building.webp`, `vorgehen/installer.webp` |
| 7 | Quotes | `.uv-q` | `Quotes` → `uv/Quotes` | id `it-q-h` |
| 8 | Picture | `.uv-pic` | `Picture` → `uv/Picture` | the new `installationstool/facade.webp` |
| 9 | FAQ | `.uv-faq#faq` | `Faq` → `uv/Faq` | |
| 10 | Closing | `.dm-end.uv-end` | `CtaCard` → the shared `CtaCard` `tone="glass"` | `sectionId="start"`, id `it-closing-h`, `SignupForm` `placement="final"`, `inputId="email-bottom"`, "Demo buchen" |
| 11 | Trust | `.trust` | `Trust` → `TrustSeals` | defaults (`#start`, `/sicherheit`) |
| — | Floating CTA | `.ctab` | `FloatingCta` → the shared one | default `#start` |

## 2.2 `CameraPhone`

The design's `#it-css` as component-scoped CSS, on a phone frame of its own (the template's `.uv-phone` box: `width: min(300px, 82%)`, white, 30 px radius, padding `14px 14px 18px`, the two rings and the shadow, centred in the tile with `top: 0`; the status bar "9:41" / "Heidi"); the tile gets the design's `min-height: 480px` through `:has()` on a wrapper class (the tile is `uv/Rows`'s, so the rule is `:global(.tile:has(.cam))` or the template's tile class, whichever `Rows` renders).

- The label: two lines stacked in a 20 px box; the first leaves upward, the second comes up (`.4s`).
- The viewfinder (170 px, `#EEF1EF`, 16 px radius): four 22 px corners (2.5 px ink border, 55 % opacity) that move 18 / 10 px inward and turn green (`#3E8E46`) on focus; the old meter, then the new one, 150 px tall, sliding up through the centre; the white flash (`.45s` fade).
- The strip: the two 44 px thumbnails (each meter at 36 px, scaling in with the design's overshoot curve) and the 44 px shutter, pressed to `.88` on flash.
- The done line: the green tick and "2. OG links digitalisiert", rising in when done.
- `aria-hidden` (as every tile; the row's text says it). The SVG drawings are inline, as designed, in the component (no image files).
- **Server-rendered in its end state** (`CAMERA_END`: the new meter, both thumbnails, the done line), as the design's reduced-motion state.

## 2.3 End states (server, no JS, reduced motion)

- The hero's list finished ("Digitalisiert" ×3, "Fertig"); the statement lit; row 1's notification and figure in; row 2's camera done; row 3's flats ticked up to "4. OG li" "in Arbeit"; row 4 "Mit Heidi" with "einer"; the rotator's first phrase; the figures at their values; every `.rv` block shown without JS.

Overflow checks at 320 px: the hero word (`nowrap`, the template's `lg` size), the camera phone (its width is relative), the twelve-cell grid, the closing card's form.
