# Phase 2: Sections

Static markup and CSS of every section, ported from the design with its class names shortened to the component's scope (the `hc-` / `pg-` prefixes are dropped where the scope makes them unique). Icons: the design's inline stroke SVGs use `StrokeIcon` (the six topic icons and the search glass in `pages/hilfe/icons.ts`). Every revealable element keeps the design's `rv` class for phase 3. Everything here is the server render for both `/hilfe` and `/hilfe?q=…`: it reads the `HelpSearch` context, so phase 3 only adds the browser side.

| # | Section | Design | Implementation |
|---|---|---|---|
| 1 | `Hero` | `.hc-hero`, centred, `padding: 72px 0 40px`, `.pg-h1` `clamp(38px,4.8vw,64px)` (with `#hs-css`: 48–68 px from 621 to 1040, 36–48 px below 620) | Light pill with the question icon, H1 with `<em>` in `--ok`, lead, `SearchBox`, `Popular`. No `id="start"` (README, Header) |
| 1a | `SearchBox` | `.hc-search` white field, 640 px, 16 px radius, green focus ring | `<form role="search" method="get" action="/hilfe">` around the glass icon, `<input type="search" name="q" id="hc-q" value={search.query} aria-label=… autocomplete="off" enterkeyhint="search">`, the `<kbd>/</kbd>` hint (`aria-hidden`, hidden at 560 and on `(hover: none)`) and a visually hidden submit button. `aria-keyshortcuts="/"` on the input |
| 1b | `Popular` | `.hc-pops` pills | "Häufig gesucht:" + 4 `<a class="pop" href="#q-<id>">` with the question text. Links, not the design's buttons, so they work without JS (3.3) |
| 2 | `Topics` | `.hc-cats` 3 columns (2 at 900, 1 at 560), white cards with icon tile, title, sub, green "n Artikel" | 6 `<a href="#c-<id>">` cards. The icon tile turns dark with the accent icon on hover (`(hover: hover)` only). The count is the topic's total, not the search's |
| 3 | `Articles` | `.hc-main` grid `220px / 1fr`, 48 px gap, one column at 900 | `Toc` + the list column: the result line, 6 `TopicSection`s, `NoResults` |
| 3a | `Toc` | `.hc-toc` sticky at `top: 96px`, "Themen" label, links with a green left border when active; hidden at 900 | `<nav aria-label="Themen">` with 6 `<a href="#c-<id>">`. The active one gets `.on` and `aria-current="location"` (3.5). Server render: none active |
| 3b | result line | `.hc-res` `aria-live="polite"` | `<p class="res" aria-live="polite">{resultsText}</p>`, empty without a query. Server render with `?q=`: the text is there |
| 3c | `TopicSection` | `.hc-sec` (`scroll-margin-top: 96px`), heading row with icon tile + H2 | `<section id="c-<id>" aria-labelledby="c-<id>-h" hidden={no visible question}>`. H2 `clamp(22px,2vw,28px)`, not the `#hs-css` override (README, Styling) |
| 3d | `Question` | `<details class="hc-q">`, white card, the `+` circle that turns into `−` on a dark fill when open | `<details id="q-<id>" hidden={!match} open={search.open.has(id)}>` (`ontoggle` keeps `search.open` in sync, 3.4). `<summary>`: the question as highlight segments (`<mark>` for hits) + the circle `<i aria-hidden>`. Body: `<p>` answer, then the `more` link (`.more`, green, `→`) when it has an `href`, then `Feedback`. `scroll-margin-top: 96px` |
| 3e | `Feedback` | `.hc-fb` "War das hilfreich?" + Ja / Nein pills, "Danke für Ihr Feedback!" | `<form method="POST" action="?/feedback#q-<id>">` with a hidden `question` and two `<button name="vote" value="yes|no">`. After a vote, the thanks replaces the buttons (`role="status"`). One shared superform for all 22 (3.6) |
| 3f | `NoResults` | `.hc-none` dashed card | "Keine passende Antwort gefunden." (`<b>`, not a heading), text, `ArrowLink ink` "Kontakt aufnehmen" → `/kontakt`. Rendered when a query has 0 results |
| 4 | `EndCta` | `.dm-end` / `.dm-cta` dark card | `CtaCard` (phase 1.7), `id="hc-end-h"`, "Frage nicht dabei? …" + `ArrowLink inv` "Gespräch vereinbaren" → `/kontakt` |
| 5 | `Trust` | `.trust` cards | Shared `TrustCards` with `more: { text: "Mehr über Heidi", href: ROUTE_UEBER_UNS }` |

Notes:

- Section order and backgrounds follow the design: hero, topics, articles and the dark card sit on the page background (`--paper`, no section borders; cards are white on it), then trust (`#F6F7F6`).
- Headings: one `<h1>`, one `<h2>` per topic, the end card's and the trust heading. The topic cards are links with `<b>`, not headings, as in the design (the topic H2s follow right after).
- The `hidden` attribute on topics and questions needs the design's `[hidden] { display: none }` rules, because `display: flex`/`block` on the components would beat the UA style.
- The design's `.flash` class (set on a popular question) has no CSS. We define it: a 1.2 s background fade from `#F2FAF3` on the card, none with reduced motion.
- The `summary` keeps the design's hidden marker (`list-style: none` and `::-webkit-details-marker`), and the `+` circle is decorative; the native `<details>` semantics carry open/closed.
- Answers are long German sentences; `max-width: 70ch` on the paragraph as designed. Check the summary at 375 px: the question wraps, the circle stays `flex: none`.
- The `.hc-cat` hover lift and the `.hc-q[open]` shadow only with `(hover: hover)` / no reduced motion for the transitions.
