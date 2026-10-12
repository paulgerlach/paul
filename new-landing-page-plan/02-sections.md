# Phase 2: Sections

Static markup and CSS of every section, ported from the design with its class names shortened to the component's scope (the `kr-` / `pg-` prefixes are dropped where the scope makes them unique). Icons: the design's inline 20×20 stroke SVGs use `StrokeIcon` (move it from `pages/ueber-uns/components/` to `$lib/landing/components/icons/` now that a second page needs it). The check marks use `icons/Check.svelte`. Every revealable element keeps the design's `rv` class for phase 3.

| # | Section | Design | Implementation |
|---|---|---|---|
| 1 | `Hero` | `.pg-hero.ink` dark, two-column grid (`minmax(0,1fr) minmax(0,560px)`, 64 px gap), H1 `clamp(38px,4.6vw,62px)` | Dark pill, H1 with `<em>` in `--accent`, lead, CTAs: `ArrowLink inv` "Offene Stellen ↓" (`#stellen`) + ghost `ApplyLink` "Initiativ bewerben →" (role `initiative`). Right column: `DayFeed`. One column at 1040 px. No `id="start"` (README, Header) |
| 1a | `DayFeed` | `.kr-feed` translucent card, `min-height: 380px` (340 at 640) | Header: blinking dot + "Ein Tag bei Heidi", "Beispiel" badge (`.dbm-demo`), the pause button (after mount, see 3.1). `<ul>` of white event rows: icon tile, title, sub, area badge (`eng`/`ops`/`cs`/`sales` colours). Server markup = the first 4 events, newest first (`EV[3]…EV[0]`), as the design's start |
| 2 | `Reasons` | `.kr-why` 4 cards, first dark | `SectionHead`, 4 `<article>`s with icon tile, H3, text. 2 columns at 1040, 1 at 640. Hover lift only with `(hover: hover)` |
| 3 | `Areas` | `.pg-sec.alt`, `.kr-br-top` (head left, control right) + `.kr-area` panel `.9fr/1.1fr` | `SectionHead` + `Segmented` ("Bereich"). The panel: H3, text, the count link (`#stellen` or an `ApplyLink`), and a `<ul>` of 3 points with icon tiles. One column at 760. The control scrolls horizontally at 640 (`overflow-x: auto` on its wrapper, never the page) |
| 4 | `Jobs` | `#stellen`, `.kr-jobs` of `<details class="kr-job">` | One `<details>` per job + the open application. `<summary>`: title + sub, tags (area label, "Berlin" with the house icon), the `+` circle (rotates 45° when open). Body: two columns "Was Sie bauen" / "Was Sie mitbringen" (`.one` for the open application's paragraph) and an `ApplyLink` styled as `bk-next`. At 760: tags under the title, one column |
| 5 | `Process` | `.pg-sec.alt`, `.kr-steps` 3 cards | `SectionHead center`, `<ol>` of 3 cards with the green number circle. 1 column at 760 |
| 6 | `Apply` | `#bewerben`, `.kr-bw` `.85fr/1.15fr`, 64 px gap | Left: `SectionHead`, lead, the 2 ticks. Right: `ApplicationForm`. One column at 1040 (36 px gap) |
| 6a | `ApplicationForm` | `.kr-form` grey card | `use:enhance` superform. `<select name="role">` (options from `jobs.list` + initiative, label = `formLabel`), name + email side by side (`.kr-2`, stacked at 640), link with "optional", textarea. The one-line error `<p role="alert">` (3.4), the submit `bk-next`, the privacy line, honeypot + `_t` as in `SignupForm`. The `.kr-ok` overlay (`role="status"`), rendered when the form message is a success |
| 7 | `MoreAbout` | `.dm-end` with the dark `.dm-cta` card | H2 "Mehr über Heidi erfahren?" + `ArrowLink inv` "Über uns" → `ROUTE_UEBER_UNS`. No form. Reuse the `/ueber-uns` `Careers` card styles if they match the design's `.dm-cta` (compare; otherwise page-local) |
| 8 | `Trust` | `.trust` cards | Shared `TrustCards` with `more: { text: "Mehr über Heidi", href: ROUTE_UEBER_UNS }` |

Notes:

- Section order and backgrounds follow the design: hero (`--ink`), reasons (white), areas (`alt`), jobs (white), process (`alt`), apply (white), the dark card, trust (`#F6F7F6`).
- Headings: one `<h1>`. Every section has `aria-labelledby` on its H2 with the design's ids (`kr-h1`, `wh-h`, `br-h`, `st-h`, `pz-h`, `bw-h`, `trust-h`). The dark card gets `aria-labelledby` too (the design has none).
- Form labels wrap their inputs as in the design. Inputs get `name`s, `autocomplete` (`name`, `email`, `url`) and `aria-invalid` + `aria-describedby` pointing to the error line when a field is wrong (the design only colours the border `.bad`).
- Text the design truncates with `text-overflow: ellipsis` (the feed's subs) must fit at 375 px. Check it, and let it wrap below 640 px instead of cutting German text.
- `#stellen` and `#bewerben` get `scroll-margin-top: 72px`.
