# Phase 2: The template's new variants and the sections

## 2.1 The shared `uv` template grows (one commit, before any section of this page)

This design is the `uv` template with content the two built pages didn't have. What it draws that `uv/` can't render yet, and how it's added. Every change is opt-in through content, so `/mieterportal` and `/verbrauchsinformation` keep rendering the same:

| Change | Design | How |
|---|---|---|
| `uv/ListMock.svelte` (moved) | `.uv-app` with `.uv-mh.sp`, `h3.l`, `.uv-ms.l`, `.uv-ls` / `.uv-li` (the "App-Liste im Hero" rules) | `/mieterportal`'s `PortalMock` is this list. It moves into `uv/` and takes its content as props: `label`, `brand`, `nav`, `navFoot`, `head`, `tag`, `title`, `sub`, `entries: ListEntry[]` (`{ icon, title, sub, before, after }`, the type moves from `/mieterportal`'s content to `uv/types.ts`), `every` (9000). The loop and its first pass after a full interval stay. `pages/mieterportal/sections/PortalMock.svelte` becomes a wrapper passing `portal` (its `greeting` → `title`). The title stays a `<p>` as `/mieterportal` built it (the app is `aria-hidden`) |
| Icon `building` | `M4 17V4h8v13M12 8h4v9M2 17h16M7 7h2M7 10h2M7 13h2` | Added to `uv/icons.ts` / `Icon.svelte` (the list's tiles and the "Liegenschaften" nav item) |
| `Doc` check rows | `.uv-dr.ck` (label in ink, a 20 px green circle with the tick), `.uv-dr.ck.v` (a short value in its place) | `DocTile.rows` becomes `DocRow[]` with `DocRow = { label; value; share }` (a bar row, as today) `\| { label; value?: string }` (a check row: the tick, or the value). Told apart by `"share" in row`; the rows come in one by one either way. The tick is drawn in ink, as the design's SVG strokes it (the result line's tick is ink already) |
| `Phone` appointment rows | `.uv-ev` (three rows "Wohnung / Geräte / Dauer" under the chip), no `.uv-mini` | `PhoneTile.bars` becomes optional (no bars → no `.mini`), new optional `details: { label, value }[]` rendered as `.ev` after the chips. The 7 s loop is the same (the figure block appears at 1.8 s; the bars grow only if there are any) |
| `Bill` text values | `.uv-bl b.t` (13 px) on a row that shows on both sides ("Liegenschaften 24") | In the text variant (`sum` with `before`/`after`) every row value is 13 px: today only `cut` values are (`/mieterportal` has no `base` rows, `/verbrauchsinformation` is the money variant and keeps 14 px) |
| `uv/deadlineFigure.ts` | the bento's `.dt` "31.12.2026" figure | Moved from `/verbrauchsinformation`'s `content.ts` (01 §1.3); that page's `figures(now)` uses it, unchanged in output. Four pages show the figure (this one, the uVI page, the two siblings) |
| `Calendar` | `data-l` labels "WE 01" … instead of months | No code change: `months` are the cells' labels and `long` is optional. Its type comment says "cells" now |

Check before committing (README, Risks): `e2e/mieterportal.e2e.ts` and `e2e/verbrauchsinformation.e2e.ts` pass; screenshots of both pages at 1440 and 375 px with reduced motion match the ones taken before; their SSR HTML differs only in Svelte's scoping classes (strip `svelte-xxxx` and diff). Watch the `.lp :is(h1…h4)` heading reset in `tokens.css` (nothing here adds a heading).

Not added, though the CSS has them: the grid's `.tag` and `.pl` cells, the bill's `.xa` / `.xb` rows (one row set per side, used by the Mietverwaltung design), the KPI boxes are the uVI page's own. The sibling pages add what they draw (04 §4.3).

## 2.2 Sections

Static markup and the design's CSS, every block in its end state (what reduced motion shows). Section ids and labels as in the design (`hv-h1`, `inhalt`, `hv-num-h`, `hv-q-h`, `faq`), except the `#start` anchor, which moves from the hero to the closing card (README, Signup). Every text from `content.ts`; the `figures` and `faq` from `load`.

| # | Section | Design | Notes |
|---|---|---|---|
| 1 | `Hero` | `.uv-hero`, `.uv-top.lg`, `.uv-peek` | `uv/Hero` with `size="lg"`: the word "Hausverwaltung" on its own line at `clamp(40px, 11.4vw, 172px)` (`nowrap`; ≤ 620 px `clamp(34px, 11.6vw, 80px)`), `aria-hidden`, the H1's text is `srTitle`; lead and CTAs side by side below it (stacked ≤ 980 px). The peek strip: the two photos and `ListMock` |
| 1a | `ListMock` | `#uv-app`, `.uv-main`, `.uv-ls` | "24 Objekte" + "Beispieldaten", "Ihre Liegenschaften.", "Heizperiode 2025 · alle Objekte", four entries with the building icon and the status pill (end state "Abrechnung fertig", green). ≤ 620 px: no sidebar, no icon tiles. A `sr-only` list gives the four entries with their final status |
| 2 | `Statement` | `.uv-stm`, `#uv-say` | `uv/Statement` |
| 3 | `Rows` | `.uv-rows#inhalt`, `.uv-row` ×4 | `uv/Rows` with the four tiles: `Calendar` (mint, the twelve units), `Doc` (stone, check rows), `Phone` (ink, appointment), `Bill` (mint, text values). One column ≤ 980 px, tiles `min-height: 440px` |
| 3a | `Calendar` | `.uv-cal`, `.uv-calnote` | Twelve cells "WE 01" … "WE 12": eleven "per Funk" with the green tick, WE 12 dark "wird abgelesen" with the spinning ring; the note "WE 12 wird abgelesen" |
| 3b | `Doc` | `.uv-doc`, `.uv-dr.ck`, `.uv-dok` | Title, sub, four check rows, "Abrechnung fertig" |
| 3c | `Phone` | `.uv-phone`, `.uv-nt`, `.uv-pv`, `.uv-ev` | Bell notification "Montage Ihrer Funkzähler", "Ihr Termin" / "Do, 9 bis 11 Uhr", the chip "14 Tage vorher angekündigt", three appointment rows |
| 3d | `Bill` | `.uv-bill`, `.uv-bl b.t` | "Heute / Mit Heidi"; end state "Mit Heidi": the two ok rows with ticks, "Liegenschaften 24", "Doppelte Pflege nein" |
| 4 | `Rotator` | `.uv-blur` | `uv/Rotator` (its section class stays `rot`, not `blur`: Tailwind utility) |
| 5 | `Numbers` | `.uv-num`, `.uv-bento` | `uv/Numbers` with the photo second (`mediaKind="photo"`). Three columns, two ≤ 980 px, one ≤ 620 px; "1–2 h" and "31.12.2026" compact; 92, 14 and 1 counted |
| 6 | `Audience` | `.uv-who`, `.uv-card` ×2 | `uv/Audience`, no buttons for now (open question 3); the two cards' H2s keep the design's size (no `#hs-css`, they have no id) |
| 7 | `Quotes` | `.uv-q` | `uv/Quotes`, heading centred (as on the built pages) |
| 8 | `Picture` | `.uv-pic`, `.uv-big` | `uv/Picture` |
| 9 | `Faq` | `.uv-faq#faq`, `.uv-fl` | `uv/Faq` (`tone="dark"`, `openFirst={false}`, heading left), `items` from `load`. Answer 3's inline link styled as the design's `.uv-fl a` (lime, underlined): check the shared dark FAQ's `.ans a` matches |
| 10 | `CtaCard` | `.dm-end.uv-end`, `.dm-cta` | The shared `CtaCard` `tone="glass"`, `sectionId="start"`, `final`, with `SignupForm` (`placement="final"`, `inputId="email-bottom"`, `submitLabel` "Demo buchen"), like `/verbrauchsinformation`'s wrapper |
| 11 | `Trust` | `.trust` | `TrustSeals` (light, outside `UvMain`) |
| — | `FloatingCta` | `.ctab` | The shared one, "Erstgespräch vereinbaren" (after `</main>`) |

Checks per section: the design's widths (1440, 1100, 980, 700, 375) and the breakpoints above; no horizontal overflow at 320 px (the word "Hausverwaltung" at its minimum size, `nowrap`; the peek strip's negative margins; the list's long status "Abrechnung fertig" next to an ellipsed name; the grid's "wird abgelesen" in a 3-column cell; the doc's "Kosten aus Ihren Rechnungen übernommen"; the phone's "Do, 9 bis 11 Uhr" at 28 px; the rotator's longest phrase "Verbrauchsinfo für Mieter").
