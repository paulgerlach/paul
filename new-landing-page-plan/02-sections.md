# Phase 2: The sections

## 2.1 The page

Wrappers in `$lib/landing/pages/nachfolge/sections/`, as `/softwarepartner`'s. The page's `<main class="nf">` holds the design's page tokens for the white mock-ups (`--bg`, `--hair`), the reveal transition and `#hs-css`'s heading sizes for the section H2s with an id (not the rows', the audience cards' and the closing card's), as `/softwarepartner`'s page does. `UvMain` wraps sections 1–11 (dark); the trust block stays light after it.

| # | Section | Design | Component | Notes |
|---|---|---|---|---|
| 1 | Hero | `.uv-hero` (`.uv-top.lg`) | `Hero` → `uv/Hero` `lg` + `uv/ListMock` | `wordSize` "clamp(34px, 8.6vw, 130px)"; photos `vorgehen/building-wide.webp` (25vw) and `selbstabrechnung/beratung.webp` (35vw, `object-position: 60% 30%`); "Kontakt aufnehmen" → `#kontakt`, "Mehr erfahren" → `#inhalt`; the app window with the new `meter` icon |
| 2 | Statement | `.uv-stm` | `Statement` → `uv/Statement` | |
| 3 | Rows | `.uv-rows#inhalt` | `Rows` → `uv/Rows` | Four rows: `Phone` (ink), `Doc` (stone), `Calendar` with nine cells (mint), `Bill` (mint) |
| 4 | Rotator | `.uv-blur` | `Rotator` → `uv/Rotator` | Four phrases |
| 5 | Numbers | `.uv-num` | `Numbers` → `uv/Numbers` | "Nachfolge mit Heidi", the photo `kitchen-meters.webp` second; `data.figures` after it |
| 6 | Audience | `.uv-who` | `Audience` → `uv/Audience` | `nachfolge/technician.webp`, `vorgehen/consultation.webp`; the second card without its button |
| 7 | Quotes | `.uv-q` | `Quotes` → `uv/Quotes` | |
| 8 | Picture | `.uv-pic` | `Picture` → `uv/Picture` | `mieterportal/facade-white.webp` |
| 9 | Form | `.ipf#kontakt` | `Apply` → `partner/Apply` + `SuccessionForm` in `partner/FormFrame` | The section and the frame exactly as `/softwarepartner`'s. The fields: Unternehmen / Ihr Name, E-Mail / Telefon, Betreute Liegenschaften (select) / Gewünschter Zeitraum (select), Nachricht (optional, three rows), the consent; the button "Gespräch anfragen →" |
| 10 | FAQ | `.uv-faq#faq` | `Faq` → `uv/Faq` | Five questions; FAQ 5's "Mehr zu Sicherheit" |
| 11 | Closing | `.dm-end.uv-end` with `#dcta-css` | `Closing` → shared `CtaCard` + `DemoVideoButton` | `tone="glass"`, `final`, the title and the text; the video button as its `action` → `#kontakt` |
| 11a | The video button | `.dcta-b` | `DemoVideoButton` (shared, new) | An accent link (16 px radius, 8/22/8/8 px, 17 px 600, 16 px gap): the 84×64 video frame (10 px radius, `#1E322D`, an inset hairline; 168×126 and 12 px radius on hover, .5 s), the "Live" badge (hover only, the dot blinking 1.6 s), the label with its 13 px sub-label at 70 %, the arrow moving 4 px on hover; the green glow on hover; full width below 640 px |
| 12 | Trust | `.trust` | `Trust` → shared `TrustSeals` | `demoHref` `#kontakt` |
| — | Floating CTA | `.ctab` | `FloatingCta` → shared `FloatingCta` | `href` `#kontakt`, hidden while the closing card is on screen |

## 2.2 Template and shared changes

- `uv/icons.ts` + `uv/Icon.svelte`: `meter` (the design's gauge: `circle` 10/10 r7, `M10 10l3-3M6.5 13.5h7`).
- `$lib/landing/components/DemoVideoButton.svelte` (props `href`, `label`, `sub`, `video` with `webm`, `mp4`, `poster`; the region demo by default). `CtaCard` already gives a card with `text` the `#dcta-css` spacing.

## 2.3 End states (server, no JS, reduced motion)

- The hero's list finished (every status green: "Übergeben", "Übernommen", "Geklärt", "Weitergeführt"), the statement lit, the rotator's first phrase ("Kundenbeziehungen").
- Row 1 the notification and the figure; row 2 every check and the result; row 3 "Liegensch. 1"–"6" "umgerüstet", "Liegensch. 7" "in Planung", "8"–"9" "offen", the note "Liegensch. 7 in Planung"; row 4 "Mit Heidi" with the two ticks and "in guten Händen".
- The figures at their values; every `.rv` block shown (the reveal only hides blocks below the fold, in the browser).
- The video button with its poster, the video paused.
- The form empty, no message. Without JS it posts and the response renders the marks or the success line at `#kontakt`.
- With reduced motion: no loop, slide, count or video (the landing reset turns off transitions and animations; `loopInView` doesn't start; the button never plays).

Overflow checks at 320 px: the hero word (34 px, `nowrap`, inside the hero's `overflow: hidden`), the panels (only the app window below 620 px), the rows' tiles (the grid's "Liegensch. 1" in three columns, the bill's long rows), the form (one column), the closing card with the full-width button.
