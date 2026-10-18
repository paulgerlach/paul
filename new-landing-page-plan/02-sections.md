# Phase 2: The shared template and the sections

## 2.1 The shared `uv` template (`/mieterportal` moves onto it)

One commit, before any uVI section: `/mieterportal`'s sections move to `$lib/landing/sections/uv/` and take their content as props instead of importing `../content`. Each `pages/mieterportal/sections/*.svelte` becomes a thin wrapper that passes its content (the page-only `PortalMock`, `DashboardTile`, `components/` and `curve.ts` stay where they are). The CSS moves with the markup; nothing is restyled.

| Shared component | From `/mieterportal` | Props (content shapes move to a `uv/types.ts`) |
|---|---|---|
| `UvMain` | the `.uv` wrapper and the `.uv :global(.uv-btn…)` rules in `mieterportal/+page.svelte` | `children`; sets `--card`, `--card2`, `--mute`, `--lime`, `--bg`, `--hair`, the button styles and the focus colour. Each page keeps its reveal styles and `#hs-css` rules |
| `Hero` | `sections/Hero.svelte` | `srTitle`, `word`, `lead`, `primary`, `secondary`, `size: "md" \| "lg"` (`lg` = `/mieterportal`'s `.uv-top.lg`: word on its own line, lead and CTAs side by side; `md` = the base `.uv-top`: word left, lead and CTAs right, aligned to the bottom), `left`/`right` photos with an optional `objectPosition`, `mock: Snippet` |
| `AppFrame` | the `.app` / `.side` part of `PortalMock` | `label` (the figure's `aria-label`), `brand`, `nav: { icon, text }[]` with an `icon` snippet (each page has its own `Icon`), `navFoot`, `children` (the `.main` part) |
| `Statement` | `sections/Statement.svelte` | `label`, `text` |
| `Rows` | `sections/Rows.svelte` | `label`, `items: Row[]`, `primary`, `secondary`, `tile: Snippet<[Row]>` (the page maps its tiles; the shared tiles below cover both pages). `Row` gains `secondary?` (per-row override) and paragraphs as `string \| Inline[]` with `Inline = string \| { text, href }` |
| `tiles/Calendar` | `tiles/Calendar.svelte` | `months`, `long?` (names for the note; default `months`), `current`, `done`, `doing`, `open`, `noteDone`, `noteDoing` |
| `tiles/Doc` | `tiles/Statement.svelte` (renamed: it's the uVI document) | `title`, `sub`, `rows: { label, value, share }[]`, `result` |
| `tiles/Phone` | `tiles/Phone.svelte` | `time`, `app`, `title`, `sub`, `label`, `value`, `comparisons: string[]` (was one `comparison`), `bars`, `max?` (default: the largest bar × 1.05, `/mieterportal`'s scale; the uVI page passes 190, the design's) and the bell icon as a snippet |
| `tiles/Bill` | `tiles/Before.svelte` (renamed) | `without`, `with`, `rows: { kind: "base" \| "cut" \| "ok", label, value? }[]` (`base` shows in both states, `cut` only "without", `ok` only "with"; an `ok` row without `value` shows the round tick), `sum: { label } & ({ before: string; after: string } \| { from: number; to: number })` (text swap or tween, 03 §3.3) |
| `Rotator` | `sections/Rotator.svelte` | `label`, `lead`, `phrases`, `intervalMs` |
| `Numbers` | `sections/Numbers.svelte` | `h2`, `first: Figure`, `rest: Figure[]`, `media: Snippet` (second cell: `/mieterportal`'s `DashboardTile`, here a photo) |
| `Audience` | `sections/Audience.svelte` | `label`, `cards: { title, text, cta: { text, href? }, image: Picture, objectPosition? }[]` |
| `Quotes` | `sections/Quotes.svelte` | `h2: [string, string]`, `keys` |
| `Picture` | `sections/Picture.svelte` | `label`, `caption: [string, string]`, `photo: Picture` |

`/mieterportal`'s `content.ts` types follow (`TileKind` "statement" → "doc", "before" → "bill"; `before.cut`/`before.ok` become `rows` with `kind`; `phone.comparison` → `comparisons`). Its `content.test.ts` changes with the shapes only.

Check before committing (README, Risks): `e2e/mieterportal.e2e.ts` passes unchanged; screenshots at 1440 and 375 px with reduced motion match the ones taken before; the SSR HTML of `/mieterportal` differs only in Svelte's `svelte-xxxx` scoping classes (strip them and diff). Watch the `.lp :is(h1…h4)` heading reset in `tokens.css`: a rule that was specific enough inside the page's component must stay as specific in the shared one.

## 2.2 Sections

Static markup and the design's CSS, every block in its end state (what reduced motion shows). Section ids and labels as in the design (`uv-h1`, `inhalt`, `uv-nh`, `uv-qh`, `faq`, `uv-fh`), except the `#start` anchor, which moves from the hero to the closing card (README, Signup). Every text from `content.ts`; the `figures` and `faq` from `load`.

| # | Section | Design | Notes |
|---|---|---|---|
| 1 | `Hero` | `.uv-hero`, `.uv-top`, `.uv-peek` | `uv/Hero` with `size="md"`: the word "uVI" at `clamp(132px, 25vw, 360px)` (`aria-hidden`, the H1's text is `srTitle`), the lead, the two CTAs. The peek strip (`.24fr 1fr .62fr`, bleeding past the page edges by `clamp(40px, 8vw, 140px)`): the two photos and `ConsumptionMock`. ≤ 980 px: one column on top, the photo columns shrink to `.12fr`; ≤ 620 px: only the mock, `min-height: 440px` |
| 1a | `ConsumptionMock` | `#uv-app`, `.uv-main`, `.uv-kpis`, `.uv-bars`, `.uv-ml` | `AppFrame` (sidebar ≥ 621 px) around: the "Beispieldaten" tag, the `<h3>` "Ihr Verbrauch im September.", the sub line, four KPI boxes (the first tinted `#EEF6EF`; two columns ≤ 620 px), 12 bars (`height` in % of `barMax`, the last `--ok`), the month labels. The figure is `aria-label`led; the app is `aria-hidden` and a `sr-only` sentence gives the four KPIs ("Letzter Monat 131 kWh, …"). New CSS (not ported for `/mieterportal`): `.uv-kpis`, `.uv-bars`, `.uv-ml`, the centred `h3` and `.uv-ms` |
| 2 | `Statement` | `.uv-stm`, `#uv-say` | `uv/Statement` |
| 3 | `Rows` | `.uv-rows#inhalt`, `.uv-row` ×4 | `uv/Rows` with the four tiles: `Calendar` (mint), `Doc` (stone), `Phone` (ink), `Bill` (mint). Row 3: the inline link in the first paragraph (`.uv-txt p a`, lime, underlined) and its own secondary button. One column ≤ 980 px, tiles `min-height: 440px` |
| 3a | `Bill` (money) | `.uv-bill`, `.uv-bl.cut`, `.uv-bl.ok`, `.uv-bl.sum` | Rows: base "Heizkosten, Ihr Anteil 1.240,00 €", cut "−37,20 €" in `#B4472E` ("Ohne uVI" only), ok with the round tick ("Mit Heidi" only), sum "Abgerechnet" at 18 px. End state "Mit Heidi", sum "1.240,00 €" (`tabular-nums`) |
| 3b | `Phone` | `.uv-phone`, `.uv-cmp` | Two chips in a wrapping row |
| 4 | `Rotator` | `.uv-blur` | `uv/Rotator` (its section class stays `rot`, not `blur`: Tailwind utility) |
| 5 | `Numbers` | `.uv-num`, `.uv-bento` | `uv/Numbers`; the second cell is the photo (`.uv-c.img`: no padding, `object-fit: cover`, absolutely filling the card). Three columns, two ≤ 980 px, one ≤ 620 px; "31.12.2026" (or its expired text) `compact`; 0 isn't counted |
| 6 | `Audience` | `.uv-who`, `.uv-card` ×2 | `uv/Audience`, no buttons for now (open question 3); the two cards' H2s keep the design's size (no `#hs-css`, they have no id) |
| 7 | `Quotes` | `.uv-q` | `uv/Quotes` |
| 8 | `Picture` | `.uv-pic`, `.uv-big` | `uv/Picture` |
| 9 | `Faq` | `.uv-faq#faq`, `.uv-fl` | The shared `Faq`, `tone="dark"`, `openFirst={false}`, title left-aligned as on `/mieterportal`, `items` from `load`. The section carries `id="faq"` (the rows' "Häufige Fragen") |
| 10 | `CtaCard` | `.dm-end.uv-end`, `.dm-cta` | The shared `CtaCard` `tone="glass"`, `sectionId="start"`, `final`, with `SignupForm` (`placement="final"`, `inputId="email-bottom"`, `submitLabel` "Demo buchen"), like `/mieterportal`'s wrapper |
| 11 | `Trust` | `.trust` | `TrustSeals` (light, outside `UvMain`) |
| — | `FloatingCta` | `.ctab` | The shared one, "Erstgespräch vereinbaren" (after `</main>`) |

Checks per section: the design's widths (1440, 1100, 980, 700, 375) and the breakpoints above; no horizontal overflow at 320 px (the word "uVI" at 132 px minimum, the peek strip's negative margins, the KPI boxes' "Vorjahresmonat", the calendar note, the bill's long cut label, the rotator's longest phrase "Vergleich zum Vorjahresmonat").
