# Phase 2: The sections

## 2.1 The page

Page-only components in `$lib/landing/pages/presse/`. The page's `<main class="pr">` holds the design's `.dm` tokens (`--bg`, `--hair`), the reveal transition and `#hs-css`'s heading sizes (the H1 and every section H2 with an id, not the closing card's), as `/einsparrechner`'s page does. Every section is white; the wrap is the shared `.wrap` (`.dm-in`: 1240 px, the `clamp(16px, 4vw, 40px)` gutter).

| # | Section | Design | Component | Notes |
|---|---|---|---|---|
| 1 | Hero | `.pr-hero` | `Hero` | 72/64 px (44/40 at 560 px). H1 (`.pr-word`, `data-hs`): `clamp(64px, 13vw, 200px)`, 400, −.06em, line-height .88, "Hallo," / line break / "Presse." in `--ok`. The lead (`.pr-lead`): max 640 px, pushed right (`margin: 48px 0 0 auto`; left-aligned under the H1 at 900 px), `clamp(17px, 1.4vw, 20px)`, 1.55, `#3E4D49`. Both `.rv` |
| 2 | Contact + Media Kit | `.pr-sec.pt0` `.pr-two` | `Contact` + `MediaKit` | No top padding, 56 px below. Two columns, 16 px gap (one at 900 px). Each card (`.pr-card`, `.rv`): `#F2F4F3`, 22 px radius, 30 px padding (22 at 560 px), a column, min 360 px high (none at 900 px). The tag (`.pr-tag`: `--accent` on ink, 6 px radius, 4/9 px, 11.5 px 600 caps .08em), H2 (`clamp(24px, 2.3vw, 32px)`, 400, −.03em, 1.1, 18 px above; no id), text (15.5 px muted, max 42ch, 12 px above). **Contact**: at the bottom (`.pr-foot`, `margin-top: auto`, 24 px above) the label "Presseanfragen" (12.5 px 600 caps .06em muted) over the address (`.pr-mail`: 17 px 500, underlined by a 1 px border), 20 px below, then the dark `ArrowLink` "Gespräch vereinbaren →" (18 px above). **Media Kit** (`#pr-kit`): four rows (`.pr-dl`, 8 px apart, 22 px above): white, 12 px radius, 12/14 px padding, a transparent border (`#C9D2CE` on hover), the title (14.5 px 600) over the note (12 px muted), the 16 px download icon right (moves 2 px down on hover; `--ok` once saved), pressed `scale(.99)`; the message line (`.pr-msg`, 13 px muted, min 18 px, 10 px above) |
| 3 | Name | `.pr-sec` | `Name` | 56 px. H2 (`.pr-h`: `clamp(30px, 3.4vw, 46px)`, 400, −.035em, 1.05; `#pr-nh`). The dark card (`.pr-name`, `.rv`, 36 px above): ink, white, 26 px radius, `clamp(28px, 4vw, 56px)` padding, two columns 1.3fr / .7fr with a `clamp(24px, 5vw, 80px)` gap, centred (one column at 900 px). Left: the big line (`.pr-big`, `clamp(32px, 4vw, 58px)`, −.04em, 1.05; "Hei" and "di" in `--accent`), the text (`clamp(16px, 1.3vw, 18px)`, 70 % white, max 52ch, 22 px above). Right (`.pr-mark`, centred; left at 900 px): the mark (`min(130px, 40%)` wide, 90 px at 900 px, `--accent`, `overflow: visible`) |
| 4 | Facts | `.pr-sec` | `Facts` | H2 `#pr-fh`. Six tiles (`.pr-facts`, three columns, 14 px gap, 36 px above; two at 900 px, one at 560 px): `#F2F4F3`, 18 px radius, 22/24 px padding, min 170 px, a column: the label (11.5 px caps .08em `--faint` 600), the value (`clamp(22px, 2vw, 28px)`, 500, −.025em, tabular, 10 px above), the text at the bottom (14.5 px muted, 1.45, 14 px above). Each tile `.rv` |
| 5 | Boilerplate | `.pr-sec` | `Boilerplate` | The block (`.pr-bp`, `.rv`): hairlines above and below, 36 px padding. The head (`.pr-bph`): H2 `#pr-bh` and the copy button right (wraps): 13.5 px 600, hairline, white, 10 px radius, 9/13 px padding, the 15 px copy icon; hover `#C9D2CE`; copied `#EEF6EF` / `#CFE3D3` / `#2F7A3C`. The paragraph (`#pr-bt`): `clamp(17px, 1.5vw, 21px)`, 1.6, `#3E4D49`, max 70ch, 22 px above |
| 6 | Press contact | `.pr-sec` | `PressContact` | The dark card (`.pr-pc`, `.rv`): ink, white, 26 px radius, `clamp(24px, 4vw, 48px)` padding, two columns 1.2fr / .8fr, a `clamp(24px, 5vw, 72px)` gap, centred (one at 900 px). Left: the tag (`.pr-tag.d`: 18 % green on ink, `--accent` text), H2 `#pr-ch` (`clamp(28px, 3vw, 42px)`, 400, −.035em, 1.08, 18 px above), the address (16 px, 70 % white, 18/26 px margins), the light `ArrowLink` "E-Mail senden →" (18 px above). Right: the photo (18 px radius, 4:3, cover; zooms to 1.03 over 1.2 s while the card is hovered) |
| 7 | Closing | `.dm-end` | `Closing` → shared `CtaCard` | `id="start"`, `final`, the text under the heading (`#dcta-css`), the `SignupForm` in place of the video button. The design's `.dm-end` padding (0 / 110 px) is `CtaCard`'s own |
| 8 | Trust | `.trust` | shared `TrustSeals` | |
| — | Floating CTA | `.ctab` | shared `FloatingCta` | |

Icons: the design's 20×20 stroke icons (download, copy) as `StrokeIcon` paths (stroke 1.6).

## 2.2 End states (server, no JS, reduced motion)

- The mark grown (the server renders `.go`), no glow.
- The facts at their values ("92 %", "14 Tage").
- The download rows are links: without JS they download as usual; no message.
- The copy button hidden without JS (`@media (scripting: none)`).
- Every `.rv` block shown (the reveal only hides blocks below the fold, in the browser).
- With reduced motion: no counting, no growth, no glow, no hover movement (the landing reset turns off transitions and animations; `countUp` and the mark check).

Overflow checks at 320 px: the giant H1 (36–48 px there through `#hs-css`), the address link (17 px, "presse@heidisystems.com" is 210 px wide), the download rows, the big line "Heizungen digitalisieren." (`clamp(32px, …)`: "digitalisieren." at 32 px is ~230 px), "VDIV · DEUMESS · bved", the boilerplate head (the button wraps under the H2), the closing form.
