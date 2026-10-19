# Phase 2: The sections

## 2.1 The page

Wrappers in `$lib/landing/pages/installationspartner/sections/`, as `/weg-verwaltung`'s. The page's `<main class="ip">` holds the design's page tokens for the white mock-ups (`--bg`, `--hair`), the reveal transition and `#hs-css`'s heading sizes for the section H2s with an id (not the rows', the audience cards' and the closing card's, which have ids only for `aria-labelledby`), as `/weg-verwaltung`'s page does. `UvMain` wraps sections 1–11 (dark); the trust block stays light after it.

| # | Section | Design | Component | Notes |
|---|---|---|---|---|
| 1 | Hero | `.uv-hero` (`.uv-top.lg`) | `Hero` → `uv/Hero` `lg` + `uv/ListMock` | `wordSize` "clamp(34px, 8.6vw, 130px)"; photos `facade.webp` (25vw) and `fitter.webp` (35vw, `object-position: 42% 50%`); the app window with the new `tool` and `home` icons |
| 2 | Statement | `.uv-stm` | `Statement` → `uv/Statement` | |
| 3 | Rows | `.uv-rows#inhalt` | `Rows` → `uv/Rows` | Five rows: `Doc` (stone), `TwinPhone` (ink), `Calendar` (mint), `TrackingPhone` (ink), `Bill` with `MeterPhoto` (mint) |
| 3a | Row 2's phone | `.ipx` | `TwinPhone` | White phone (`min(300px, 82%)`, 30 px radius, 14/14/0 px, 470 px tall, the design's double ring and shadow), at the tile's bottom (`align-self: flex-end`, `top: calc(clamp(20px, 4vw, 52px) + 40px)`), `min(280px, 90%)` at 640 px. The status bar (11.5 px 600, "9:41" / "Heidi"); the viewport (`calc(100% - 34px)`, clipped) with two screens on top of each other (`position: absolute; inset: 0`, transform/opacity .6 s `cubic-bezier(.65,0,.35,1)`). Screen a: the photo (150 px, 16 px radius, `#E9EEEB`, the image scaled 1.08 → 1 over 2.6 s on `a`) with the badge "Liegenschaft" (10.5 px 600 on 92 % white, round), "Lindenallee 12" (17 px 600, 12 px above), the sub (11.5 px muted), the three facts (`#F3F5F4`, 10 px radius, 8/10 px; 11 px muted / 12.5 px 600; fading up .4 s, the 2nd and 3rd .15 / .3 s later), the dark button "Wohnungen ansehen →" (12.5 px 600, 11 px radius, the arrow lime; pressed: .95 and `#2C4740`), the cursor (20 px, from 30/30 px below right, .7 s). Screen b (104 % to the right until `b`; then screen a slides 30 % left and fades): "‹ Lindenallee 12" (11.5 px 600 `#3E9A57`), the note card (`#EEF6EF`, 14 px radius; the dark 30 px tile with the lime bell), the four units (`.ip-u`: white, hairline, 10 px radius, 8/10 px; 12 px 600 / 10.5 px muted; the badge 11 px 700 round: ✓ on `#3E9A57`, "1/2" on lime with the lime ring for the current one, none for the open one; fading up .35 s at .45/.6/.75/.9 s) |
| 3b | Row 4's phone | `.ipt` | `TrackingPhone` | The same phone (overflow hidden). The push (absolute, 12 px in, 36 px from the top, 96 % white, 16 px radius, the shadow; the dark tile with the white Heidi mark; 11.5 px / 12 px, "2 Wohnungen" 700) slides down from −130 % (.55 s) when on. The house (`.ipt-map.ipb`: 200 px, 16 px radius, `#EEF2EF`; a 300×214 SVG: the roof, the wall, the floor labels, eight unit boxes 84×34 with their labels and a tick circle, the dashed "Ihre WE" box for WE 08 with its dark pin, the green marker with the person, the ground line). Done units: `#E6F5E7` with the tick; the current one: `#EEF6EF` with a 2 px lime border; the marker moves .9 s `cubic-bezier(.65,0,.35,1)`. The card (−18 px over the house, white, 18 px radius, hairline): the heading 15 px 600 centred, the sub 11 px muted, the four steps on a 4 px track (the fill `#3E9A57`, .8 s), each a 22 px circle (filled green with a white tick when on), 9.5 px labels; the count (`#EEF6EF`, 12 px radius: 24 px 600 tabular green number popping, 12 px 600 label). The tag "Beispiel" (9.5 px 600, at 212 px from the top, right) |
| 3c | Row 5's photo | `.ipp` | `MeterPhoto` in `Bill`'s `media` | Collapsed (`max-height: 0`, transparent) on "Klemmbrett"; on "Heidi-Tool" 130 px, 4/0/10 px margins: the 96 px photo (12 px radius, scaled 1.15 → 1 over .9 s after .25 s), the white flash (.7 s after .35 s), the lime frame (1.2 s), "WE 03 · Neuzähler" (11.5 px muted), "Foto aufgenommen" (14 px), the green tick line fading in after 1.1 s |
| 4 | Rotator | `.uv-blur` | `Rotator` → `uv/Rotator` | |
| 5 | Numbers | `.uv-num` | `Numbers` → `uv/Numbers` | "Installation in Zahlen", the photo `kitchen-meters.webp` second |
| 6 | Audience | `.uv-who` | `Audience` → `uv/Audience` | `installer.webp`, `team.jpg` |
| 7 | Quotes | `.uv-q` | `Quotes` → `uv/Quotes` | |
| 8 | Picture | `.uv-pic` | `Picture` → `uv/Picture` | `building-wide.webp` |
| 9 | Form | `.ipf#bewerben` | `Apply` + `PartnerForm` | Ink (`#1E322D`), white, 110 px (72 px at 900 px). Two columns `minmax(0,.9fr) minmax(0,1.1fr)`, gap `clamp(32px, 6vw, 88px)`, top-aligned (one at 900 px). Left: the pill (18 % white border, round, 6/14 px, 14 px 80 % white), H2 (`clamp(34px, 4vw, 56px)` 500 −.04em 1.04, 22 px above; `#hs-css` below 1040 px), the text (72 % white, `clamp(16px, 1.4vw, 18px)` 1.55, 18 px above, max 46ch), the steps (`ol`, 34 px above, 18 px gap: a 40 px lime circle with the ink number 600, the title 16 px 600, the line 14 px 60 % white). Right: the white form (22 px radius, `clamp(20px, 3vw, 34px)`, 16 px gap): rows of two fields (14 px gap; one column at 900 px); labels 13.5 px 600 with 6 px gap; fields 15 px, `#DCE2DF` border, 10 px radius, 11/12 px, focus `#3E9A57` with the 35 % lime ring, invalid `#C2410C`; the two fieldsets with their legends (13.5 px 600, 8 px below) and the chip labels (round, hairline, 8/14 px, 500; checked: `#3E9A57` border on `#EEF8EF`, `accent-color: #3E9A57`); the textarea (3 rows); the consent (flex, 10 px gap, 400 `#5B6B66` 1.45); the button (ink, white, 16 px 600, 12 px radius, 15/22 px, the arrow; `#2c4640` on hover; .6 opacity while sending); the message line (14.5 px 1.5 `#5B6B66`, min 1em; success `#245F33` on `#E6F5E7`, 12 px radius, 12/14 px; error `#8A3A10`) |
| 10 | FAQ | `.uv-faq#faq` | `Faq` → `uv/Faq` | Five questions |
| 11 | Closing | `.dm-end.uv-end` | `Closing` → shared `CtaCard` | `tone="glass"`, `final`, the title, `cta` "Partner werden" → `#bewerben` |
| 12 | Trust | `.trust` | `Trust` → shared `TrustSeals` | `demoHref` `/messdienstwechsel#start` |
| — | Floating CTA | `.ctab` | `FloatingCta` → shared `FloatingCta` | `href` `/messdienstwechsel#start` |

## 2.2 Template changes

- `uv/icons.ts` + `uv/Icon.svelte`: `home` (the design's house) and `tool` (the wrench).
- `uv/Hero.svelte`: optional `wordSize` (a CSS length) set on the word as `font-size`; without it the template's sizes.
- `uv/tiles/Bill.svelte`: optional `media: Snippet<[boolean]>` rendered after the segmented control, given `good` (the "with" side).
- `TrustSeals.svelte`: optional `demoHref` (default `DEMO_HREF`); `FloatingCta.svelte`: optional `href` (default `DEMO_HREF`). `focusSignup` only when the target is `#start`.

## 2.3 End states (server, no JS, reduced motion)

- The hero's list finished (every status green), the statement lit, the rotator's first phrase.
- Row 1 every check and the result; row 2 the flat list (screen b, every unit shown); row 3 WE 01–09 "dokumentiert", WE 10 "wird erfasst", WE 11–12 "offen", the note "WE 10 wird erfasst"; row 4 the resting step (five done, the marker at WE 06, "2 Wohnungen vor Ihnen", the push shown, "Bestätigt" and "Im Haus" on); row 5 "Heidi-Tool" with the meter photo, the two ticks and "keine".
- The figures at their values; every `.rv` block shown (the reveal only hides blocks below the fold, in the browser).
- The form empty, no message. Without JS it posts and the response renders the errors or the success line at `#bewerben`.
- With reduced motion: no loop, slide, flash, count or entrance (the landing reset turns off transitions and animations; `loopInView` doesn't start).

Overflow checks at 320 px: the hero word (34 px, `nowrap`, inside the hero's `overflow: hidden`), the panels (only the app window below 620 px), the rows' tiles and phones (`min(280px, 90%)`), the house drawing (scales with its SVG), the form (one column, the chips wrapping), the closing card.
