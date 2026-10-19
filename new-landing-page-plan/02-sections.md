# Phase 2: The sections

## 2.1 The page

Wrappers in `$lib/landing/pages/verbaende/sections/`, as `/weg-verwaltung`'s. The page's `<main class="vb">` holds the design's page tokens for the white mock-ups (`--bg`, `--hair`), the reveal transition and `#hs-css`'s heading sizes for the section H2s with an id (not the rows', the audience cards' and the closing card's), as `/weg-verwaltung`'s page does. `UvMain` wraps sections 1–10 (dark); the trust block stays light after it.

| # | Section | Design | Component | Notes |
|---|---|---|---|---|
| 1 | Hero | `.uv-hero` (`.uv-top.lg`) | `Hero` → `uv/Hero` `lg` + `uv/ListMock` | Photos `vorgehen/facade.webp` (25vw) and `verbaende/booth.webp` (35vw, no object position); "Demo buchen" → `#start`, "Mehr erfahren" → `#inhalt`; the app window with the new `check` icon |
| 2 | Statement | `.uv-stm` | `Statement` → `uv/Statement` | |
| 3 | Rows | `.uv-rows#inhalt` | `Rows` → `uv/Rows` | Four stone rows: `LogoTile` ×3, `Doc` |
| 3a | Rows 1–3's tile | `.vb-lg` in `.uv-tile.t-stone` | `LogoTile` | A white card (20 px radius, 44/40/30 px padding, `min(78%, 360px)` wide, the shadow `0 20px 40px -30px rgba(30,50,45,.35)`), a centred grid with 22 px gap: the logo (`max-width` 220 px, `max-height` 84 px, auto size) and the line (13.5 px 600 `#5B6B66`, centred) |
| 4 | Rotator | `.uv-blur` | `Rotator` → `uv/Rotator` | Three phrases |
| 5 | Numbers | `.uv-num` | `Numbers` → `uv/Numbers` | "Heidi auf einen Blick", the photo `kitchen-meters.webp` second |
| 6 | Audience | `.uv-who` | `Audience` → `uv/Audience` | `verbaende/conference.webp`, `mieterportal/building.webp` |
| 7 | Quotes | `.uv-q` | `Quotes` → `uv/Quotes` | |
| 8 | Picture | `.uv-pic` | `Picture` → `uv/Picture` | `vorgehen/building-wide.webp` |
| 9 | FAQ | `.uv-faq#faq` | `Faq` → `uv/Faq` | Five questions; FAQ 5's "Mehr zu Sicherheit" |
| 10 | Closing | `.dm-end.uv-end` with `#dcta-css` | `CtaCard` → shared `CtaCard` + `SignupForm` | `tone="glass"`, `final`, `sectionId="start"`, the title and the text; the signup form (`placement="final"`, `inputId="email-bottom"`, "Demo buchen") in place of the video button |
| 11 | Trust | `.trust` | `Trust` → shared `TrustSeals` | default `demoHref` (`#start`) |
| — | Floating CTA | `.ctab` | `FloatingCta` → shared `FloatingCta` | default `href` (`#start`), hidden while the closing card is on screen |

## 2.2 Template changes

- `uv/icons.ts` + `uv/Icon.svelte`: `check` (the design's tick, `M5 10.5l3.2 3L15 7`).

## 2.3 End states (server, no JS, reduced motion)

- The hero's list finished (every pill green), the statement lit, the rotator's first phrase ("VDIV").
- Rows 1–3 the logo cards shown; row 4 every check and the result.
- The figures at their values; every `.rv` block shown (the reveal only hides blocks below the fold, in the browser).
- The signup form empty, no message. Without JS it posts and the response renders the error or the success line in the card.
- With reduced motion: no loop, slide, count or entrance (the landing reset turns off transitions and animations; `loopInView` and `enterView` don't start).

Overflow checks at 320 px: the hero word (`nowrap`, inside the hero's `overflow: hidden`), the panels (only the app window below 620 px), the logo cards (the DEUMESS logo is the widest: 538×128 scaled to at most 220 px, inside `min(78%, 360px)`), the closing card with the form.
