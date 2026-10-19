# Phase 2: The sections

## 2.1 The page

Wrappers in `$lib/landing/pages/softwarepartner/sections/`, as `/installationspartner`'s. The page's `<main class="sp">` holds the design's page tokens for the white mock-ups (`--bg`, `--hair`), the reveal transition and `#hs-css`'s heading sizes for the section H2s with an id (not the rows', the audience cards' and the closing card's), as `/installationspartner`'s page does. `UvMain` wraps sections 1–11 (dark); the trust block stays light after it.

| # | Section | Design | Component | Notes |
|---|---|---|---|---|
| 1 | Hero | `.uv-hero` (`.uv-top.lg`) | `Hero` → `uv/Hero` `lg` + `uv/ListMock` | `wordSize` "clamp(34px, 8.6vw, 130px)"; photos `muenchen/hero.jpg` (25vw) and `apartment.webp` (35vw, no object position); only "Partner werden" (open question 3); the app window with the new `server` icon |
| 2 | Statement | `.uv-stm` | `Statement` → `uv/Statement` | |
| 3 | Rows | `.uv-rows#inhalt` | `Rows` → `uv/Rows` | Four rows: `Bill` (mint), `Calendar` (mint), `Doc` (stone), `Phone` with `TransferList` (ink) |
| 3a | Row 4's list | `.ip-ul` in `.uv-pv` | `TransferList` in `Phone`'s `screen` | A left-aligned grid, 6 px gap. Each transfer (`.ip-u`): a grid `minmax(0,1fr) auto`, 2/8 px gap, white, `#E5E9E7` border, 10 px radius, 8/10 px, ink text; the title 12 px 600, the line 10.5 px `#7A8783` 1.3; the badge in the second column over both rows (11 px 700, min 26 px wide, 22 px tall, round, 0/6 px): done ✓ white on `#3E9A57`; the current one "…" ink on `#8AD68F` with the `#8AD68F` border and a 3 px lime ring (30 %) |
| 4 | Rotator | `.uv-blur` | `Rotator` → `uv/Rotator` | |
| 5 | Numbers | `.uv-num` | `Numbers` → `uv/Numbers` | "Die Anbindung in Zahlen", the photo `apartment.webp` second |
| 6 | Audience | `.uv-who` | `Audience` → `uv/Audience` | `muenchen/hero.jpg`, `mieterportal/building.webp` |
| 7 | Quotes | `.uv-q` | `Quotes` → `uv/Quotes` | |
| 8 | Picture | `.uv-pic` | `Picture` → `uv/Picture` | `berlin/references.jpg` |
| 9 | Form | `.ipf#bewerben` | `Apply` → `partner/Apply` + `SoftwarePartnerForm` in `partner/FormFrame` | The section and the frame exactly as `/installationspartner`'s (its 02 §2.1 row 9, now shared). The fields: Unternehmen / Ansprechpartner, E-Mail / Telefon, Software oder Produkt (placeholder) / Kunden in der Immobilienwirtschaft (select), the fieldset "Art der Software" with five chips, Nachricht (optional, three rows), the consent |
| 10 | FAQ | `.uv-faq#faq` | `Faq` → `uv/Faq` | Four questions; FAQ 3's "Mehr zu Sicherheit" |
| 11 | Closing | `.dm-end.uv-end` | `Closing` → shared `CtaCard` | `tone="glass"`, `final`, the title, `cta` "Partner werden" → `#bewerben` |
| 12 | Trust | `.trust` | `Trust` → shared `TrustSeals` | `demoHref` `/messdienstwechsel#start` |
| — | Floating CTA | `.ctab` | `FloatingCta` → shared `FloatingCta` | `href` `/messdienstwechsel#start` |

## 2.2 Template changes

- `uv/icons.ts` + `uv/Icon.svelte`: `server` (the design's two stacked boxes with a dot each: `rect` 3/3.5 14×5 r1.5, `rect` 3/11.5 14×5 r1.5, `M6 6h.01M6 14h.01`).
- `uv/Hero.svelte`: `secondary` with an optional `href`; without it the second CTA isn't rendered.
- `uv/tiles/Phone.svelte`: an optional `screen` snippet rendered in the `.pv` card in place of the label, the figure, the chips, the details and the bars; `label`, `value` and `comparisons` optional in `PhoneTile` (required by the pages that show the figure, as today).
- `$lib/landing/sections/partner/` (01 §1.4).

## 2.3 End states (server, no JS, reduced motion)

- The hero's list finished (every status green), the statement lit, the rotator's first phrase.
- Row 1 "Mit Heidi" with the two ticks and "nein"; row 2 Jan–Sep "übertragen", Okt "wird übertragen", Nov–Dez "offen", the note "Okt wird übertragen"; row 3 every check and the result; row 4 the notification and the list shown.
- The figures at their values; every `.rv` block shown (the reveal only hides blocks below the fold, in the browser).
- The form empty, no message. Without JS it posts and the response renders the errors or the success line at `#bewerben`.
- With reduced motion: no loop, slide, count or entrance (the landing reset turns off transitions and animations; `loopInView` doesn't start).

Overflow checks at 320 px: the hero word (34 px, `nowrap`, inside the hero's `overflow: hidden`), the panels (only the app window below 620 px), the rows' tiles and the phone, the form (one column, the chips wrapping), the closing card.
