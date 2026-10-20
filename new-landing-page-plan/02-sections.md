# Phase 2: The sections

## 2.1 The page

`+page.svelte` renders `<main id="content" class="ad" {@attach reveal()}>` with the page tokens (`--bg: #f6f7f6`, `--hair: #e5e9e7`, `--mono`), the reveal's `.rv` rules and `#hs-css` (the H1 and `section h2[id]`, i.e. the trust block's, between 621 and 1040 px and below) as `/fristenrechner`'s route, around the sections; then `FloatingCta`. Sections in `$lib/landing/pages/api-dokumentation/sections/`.

| # | Section | Design | Component | Notes |
|---|---|---|---|---|
| 1 | Hero | `.pg-hero.ad-hero` | `Hero` | `/fristenrechner`'s hero layout (`.pg-grid`: text left, max 560 px visual right; one column below 1040 px, gap 40 px as `#ad-css`); pill, H1 (`data-hs`), lead, "Schnellstart →" (`.bk-next`, 14 × 20 px padding), "Softwarepartner werden" (`.pg-ghost`), the ticks (`.okb` with the dark tick); the CTAs stacked and centred below 640 px |
| 1a | Terminal | `.ad-term` | `Terminal` | Dark (`#1E322D`, 20 px radius, the design's shadow); the top bar with three dots and the mono title; `pre` 13.5 px / 1.75 (11.5 px and 18 px padding below 640 px), `white-space: pre`, `overflow: hidden`; the method badge, the value and status in `#8AD68F`, comments 45 % white, keys `#B9E6BC`; the status line's 10 / 8 px margins. `aria-hidden` |
| 2 | Documentation | `.ad-doc` | `Docs` | Padding 72 / 112 px (48 / 80 px below 640 px); the grid 220 px + the column, gap 64 px; one column below 1040 px |
| 2a | Contents | `.ad-side` | `Sidebar` | Sticky at 96 px, max height `100vh − 120px`, scrolls; group labels 12.5 px; links 14.5 px, 7 × 12 px, 9 px radius, hover and current `#EEF1EF`. Below 1040 px: static, one row of bordered white chips scrolling sideways, no group labels |
| 2b | Note | `.ad-note` | in `Docs` | Green box (`#F2F8F2`, border `#D6ECD7`, 14 px radius), the info icon, "Entwurf." bold |
| 3 | Überblick | `.ad-sec` | `Overview` | The roles (`1fr 64px 1fr`, the moving line between them; one column with a vertical line below 640 px), the four service cards (two columns, one below 640 px; mono name, the version top right, hover lift) |
| 4 | Schnellstart | `.ad-sec#schnellstart` | `QuickStart` | The numbered steps (30 px dark circles), the cURL block |
| 5 | Authentifizierung | `.ad-sec#auth` | `Auth` | The text with inline code, the table |
| 6 | Basis-URL | `.ad-sec#basis` | `BaseUrl` | The code block with the yellow "Platzhalter" badge, the dotted list |
| 7 | Verbrauchsdaten | `.ad-sec#verbrauch` | `Consumption` + two `Endpoint` | The H2 with the version badge (`.ad-sh`); each endpoint a pale card (`#FBFCFB`, 18 px radius, 16 px padding below 640 px) with the green `GET` and the path (`word-break: break-all`), the text, the tables, the answer block (`200` badge) |
| 8 | Nutzerwechsel | `.ad-sec#wechsel` | `UserChange` | The direction "Ihre Software → Heidi" with its moving line, the small line |
| 9 | Dokumente | `.ad-sec#dokumente` | `Documents` | The list, the small line |
| 10 | Datenaustausch | `.ad-sec#datei` | `FileExchange` | Two paragraphs |
| 11 | Statuscodes | `.ad-sec#status` | `StatusCodes` | The table with the mono code badges (green 200, red 500 / 503) |
| 12 | Versionen | `.ad-sec#versionen` | `Versions` | The table, the source line with the external link and its icon |
| 13 | Zugang anfragen | `.ad-sec.ad-cta#zugang` | `Access` | The dark card (22 px radius, 40 px padding, 28 px below 640 px; text left, the two buttons stacked right, one column below 640 px): the accent `.bk-next.inv` "Erstgespräch vereinbaren →" and the outlined "Softwarepartner werden" |
| 14 | Trust | `.trust` | `Trust` → `TrustSeals` | `demoHref` `/messdienstwechsel#start` |
| — | Floating CTA | `.ctab` | `FloatingCta` → the shared one | `href` `/messdienstwechsel#start` |

The articles share `Article` (`.ad-sec`: `padding-top: 56px`, `scroll-margin-top: 90px`, a hairline and 8 px between two articles; H2 `clamp(26px, 2.6vw, 34px)`, −.03em, 500; the paragraphs 16.5 px / 1.65, 68ch, muted; `.ad-sm` 14.5 px), `CodeBlock`, `DocTable` (frame with hairline and 14 px radius, `overflow: auto`, the table `min-width: 520px`, head `#F6F7F6` 13 px, cells 12 × 16 px) and `Rich` (inline code `#EEF1EF`, 6 px radius, `.88em`, `nowrap`). The H2s get the landing heading reset's override through a more specific selector (`.ad-sec h2`, README "Implementation notes" of the other pages), and `!important` only where the design has it (`.ad-sm`, `.ad-src`, the closing card's padding and margin).

## 2.2 Shared changes

None beyond 01 §1.1 (the links' content). `TrustSeals` and `FloatingCta` already take `demoHref` / `href`.

## 2.3 End states (server, no JS, reduced motion)

- The terminal's nine lines shown (the CSS animation ends there; with reduced motion none runs).
- The moving lines: still, the bar at its start (the CSS animation runs only once `inView` sets `.run`, so without JS and with reduced motion it stands).
- The JSON samples coloured; the first link of the table of contents current; "Kopieren" hidden without JS.
- Every `.rv` block shown without JS (the reveal adds its wait class only in the browser).

Overflow checks at 320 px: the terminal (`overflow: hidden`, as designed: the long first line is cut), the chips row (scrolls inside itself), the endpoint paths (break), the code blocks and tables (scroll inside their frames), the closing card.
