# Phase 2: The sections

## 2.1 The page

Wrappers in `$lib/landing/pages/partnerschaften/sections/`, as `/nachfolge`'s. The page's `<main class="ps">` holds the design's page tokens for the white mock-ups (`--bg`, `--hair`), the reveal transition and `#hs-css`'s heading sizes for the section H2s with an id (not the rows', the audience cards' and the closing card's), as `/nachfolge`'s page does. `UvMain` wraps sections 1–11 (dark); the trust block stays light after it.

| # | Section | Design | Component | Notes |
|---|---|---|---|---|
| 1 | Hero | `.uv-hero` (`.uv-top.lg`) | `Hero` → `uv/Hero` `lg` + `uv/ListMock` | `wordSize` "clamp(34px, 8.6vw, 130px)"; photos `installationspartner/facade.webp` (25vw) and `vorgehen/consultation.webp` (35vw, `object-position: 60% 30%`); "Kontakt aufnehmen" → `#kontakt`, "Mehr erfahren" → `#inhalt`; the app window with the new `plug` icon |
| 2 | Statement | `.uv-stm` | `Statement` → `uv/Statement` | |
| 3 | Rows | `.uv-rows#inhalt` | `Rows` → `uv/Rows` | Four rows: `Doc` (stone), `Phone` (ink), `Calendar` with nine cells (mint), `Bill` (mint); links in rows 2 and 3 |
| 4 | Rotator | `.uv-blur` | `Rotator` → `uv/Rotator` | Four phrases |
| 5 | Numbers | `.uv-num` | `Numbers` → `uv/Numbers` | "Partnerschaften in Zahlen", the photo `kitchen-meters.webp` second; five figures around it |
| 6 | Audience | `.uv-who` | `Audience` → `uv/Audience` | The first card's `panel` is `ConnectionForm`; the second card's photo `vorgehen/installer.webp` |
| 6a | The card form | `.spf-w` / `.spf` / `.spf-done` (`#spf-css`) | `ConnectionForm` (page-only) | The white card (20 px radius, 22 px padding, the design's shadow); the head (18 px 600 / 13 px grey); Unternehmen / Ihr Name in two columns (one below 560 px), E-Mail, Ihre Software (select), Nachricht (2 rows, the placeholder), the consent (12.5 px, `accent-color` ink), the ink button "Anfrage senden →" (12 px radius, 15 px 600), the message line (12.5 px, red); the fields on `#F6F7F6` with a `#E1E6E3` border, white with an ink border on focus, red on error. The thank-you panel: the 52 px green circle with the tick, "Danke für Ihre Anfrage." (20 px 600), the text (15 px, 30ch, line-height 1.5 from the card) |
| 7 | Quotes | `.uv-q` | `Quotes` → `uv/Quotes` | |
| 8 | Picture | `.uv-pic` | `Picture` → `uv/Picture` | `partnerschaften/facade.webp` (new) |
| 9 | Form | `.ipf#kontakt` | `Apply` → `partner/Apply` + `PartnershipForm` in `partner/FormFrame` | The section and the frame exactly as `/nachfolge`'s. The fields: Unternehmen / Ihr Name, E-Mail / Telefon, Art der Partnerschaft (select, alone in a two-column row: half the width, as the design), Nachricht (optional, three rows), the consent; the button "Partnerschaft anfragen →" |
| 10 | FAQ | `.uv-faq#faq` | `Faq` → `uv/Faq` | Five questions; links in FAQ 3 and 4, FAQ 5's "Mehr zu Sicherheit" |
| 11 | Closing | `.dm-end.uv-end` with `#dcta-css` | `Closing` → shared `CtaCard` + `DemoVideoButton` | `tone="glass"`, `final`, the title and the text; the video button as its `action` → `#kontakt` |
| 12 | Trust | `.trust` | `Trust` → shared `TrustSeals` | `demoHref` `#kontakt` |
| — | Floating CTA | `.ctab` | `FloatingCta` → shared `FloatingCta` | `href` `#kontakt`, hidden while the closing card is on screen |

## 2.2 Template and shared changes

- `uv/icons.ts` + `uv/Icon.svelte`: `plug` (the design's plug: `M7 2.5v4M13 2.5v4M5 6.5h10v3a5 5 0 0 1-10 0zM10 14.5v3`).
- `uv/types.ts` `AudienceCard` + `uv/Audience.svelte`: an optional `panel` snippet, rendered in a plain `<div class="panel">` in place of the photo (the design's `.spf-w` sits directly in the card, no `<figure>`). Cards with `image` or `media` render as today.

## 2.3 End states (server, no JS, reduced motion)

- The hero's list finished (every status green: "Verbunden", "Zertifiziert", "Vernetzt", "Vereinbart"), the statement lit, the rotator's first phrase ("Softwareanbieter").
- Row 1 every check, "bved" and the result "Verbunden"; row 2 the notification and the figure; row 3 "VDIV" … "Verband" "dabei", "Ihre Idee" "im Gespräch", the note "Ihre Idee im Gespräch"; row 4 "Mit Heidi" with the two ticks and "gering".
- The figures at their values; every `.rv` block shown (the reveal only hides blocks below the fold, in the browser).
- The video button with its poster, the video paused.
- Both forms empty, no message. Without JS they post and the response renders the marks, the success line (`#kontakt`) or the thank-you panel (`#anbindung`).
- With reduced motion: no loop, slide, count, video or confetti (the landing reset turns off transitions and animations; `loopInView` doesn't start; the button never plays; `confettiFrom` does nothing).

Overflow checks at 320 px: the hero word (34 px, `nowrap`, inside the hero's `overflow: hidden`), the panels (only the app window below 620 px), the rows' tiles (the grid's "DEUMESS" and "Installation" in three columns, the bill's long rows), the card form (one column below 560 px), the contact form (one column), the closing card with the full-width button.
