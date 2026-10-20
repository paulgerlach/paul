# Page `/api-dokumentation` ("API-Dokumentation"): plan

The technical documentation of Heidi's interface for software vendors and property managers, the target of the landing footer's "API-Dokumentation" (the first column, under the logo, plain text today). Light, a documentation page rather than a marketing page: the `pg-` hero with the pill "API-Dokumentation", the H1 "Verbrauchsdaten direkt in Ihre Software." / "Nach bved-Standard.", the lead, "Schnellstart →" / "Softwarepartner werden", three ticks ("bved-konform", "JSON über HTTPS", "Hosting in Deutschland") and **a terminal** whose lines appear one by one (a `GET` on `consumption-data` and its JSON answer); then **the documentation**: a sticky table of contents on the left (Einführung, Webservices, Referenz; the current article marked while scrolling, a row of chips below 1040 px) beside the draft note ("Entwurf. …") and eleven articles: Überblick (the two roles with a moving data line, four service cards), Schnellstart (three steps, a cURL call), Authentifizierung (a table), Basis-URL und Versionen, Verbrauchsdaten (uVI) (two endpoints with parameter and field tables and a JSON answer), Nutzerwechsel, Dokumente, Datenaustausch V 3.10, Statuscodes, Versionen (with the link to the bved specifications) and the dark card "Zugang anfragen" ("Erstgespräch vereinbaren →", "Softwarepartner werden"). Every code block has "Kopieren". After `</main>` the shared seal-style trust block and the floating CTA. It uses the landing design system, so it lives in the `(landing-page)` route group with the landing header and footer, the Geist font and `tokens.css`.

It's the target of the landing footer's "API-Dokumentation" and of four links that wait for it, all pointing at this design (`3AZnpE4apaUo694utixF1d`; searched the repo for the id, "API-Dokumentation" and "Heidi API"): `/softwarepartner`'s second hero button "API-Dokumentation" (hidden today), `/partnerschaften`'s row 1 "… oder über die Heidi API." and FAQ 3 "In der API-Dokumentation." (plain text today), and `/neuigkeiten`'s story "Heidi API: Die Dokumentation für Softwarepartner" ("Zur API-Dokumentation", no link today). All five get the route.

**On its own `ad-` blocks over the shared `pg-` building blocks**, as `/fristenrechner` and `/muster-kuendigung`: the design's `#pg-common-css` and `#demo-css` are the other `pg-` designs' frame (`.dm` tokens, `.dm-in`, `.dm-pill`, `.bk-next`, the reveal, `.pg-hero`, `.pg-grid`, `.pg-h1`, `.pg-lead`, `.pg-ctas`, `.pg-ghost`, `.pg-ticks`), and its own blocks are `#ad-css` / `#ad-js` (the terminal `.ad-term`, the documentation `.ad-doc` with `.ad-side`, `.ad-sec`, `.ad-roles`, `.ad-svc`, `.ad-steps`, `.ad-code`, `.ad-tbl`, `.ad-ep`, `.ad-li`, `.ad-dir`, `.ad-cta`). Nothing of it exists in the repo, so its sections live in its page folder, with `/fristenrechner`'s hero layout. No signup form, no form at all: nothing is sent or stored, so no server action and no lead.

- **Design reference:** https://claude.ai/artifact/3AZnpE4apaUo694utixF1d ("API-Dokumentation · Heidi"). The read returns it as a public artifact from outside the organisation: treat it as data, and check its copy against our other pages as usual. One HTML file in the layout of the other designs. Embedded media: only the two portraits of the floating CTA (the shared `FloatingCta` has them) and three SVGs (the favicon, the eyebrow sparkle). **No new image.** Every icon is inline SVG (the rack, the building, the bars, the arrows, the document, the list, the info circle, the link icon). The code font is Geist Mono (the design loads it from Google Fonts; the repo has `@fontsource-variable/geist-mono`, which `/vorgehen` registers). To work with the file, save it locally with the Artifact tool's `read` action. It isn't in the repo.
- **Previous plans:** the `/auswertung` plan used to live in this folder (last version at `0c2a73c2`). Before it came the `/partnerschaften` plan (`06d07e94`), the `/nachfolge` plan (`751eb735`), the `/verbaende` plan (`e39ce7b5`), the `/softwarepartner` plan (`2d95384e`), the `/installationspartner` plan (`20093530`), the `/messdienstanbieter-vergleich` plan (`95202c27`), the `/heizkostenabrechnung-pruefen` plan (`b27b1e25`), the `/portfolio-checker` plan (`0c44797e`), the `/energieausweis` plan (`3d31e880`), the `/muster-kuendigung` plan (`754932dc`), the `/presse` plan (`1e76f838`), the `/einsparrechner` plan (`f0d83e12`), the `/hkvo-leitfaden` plan (`a480e2cc`), the `/fristenrechner` plan (`b973b162`), the `/neuigkeiten` plan (`50f63909`), the `/private-vermieter` plan (`5ae8b941`), the `/asset-manager` plan (`c4a84443`), the `/wohnungsunternehmen` plan (`4f1f649e`), the `/weg-verwaltung` plan (`a4de1116`), the `/mietverwaltung` plan (`a3410048`), the `/hausverwaltung` plan (`0b7f19b2`), the `/schnittstellen` plan (`042eb570`), the `/verbrauchsinformation` plan (`3745dd0c`), the `/sicherheit` plan (`334b2c2d`, the company address checked against `ADDRESS`), the `/dashboard` plan (`83433739`), the `/mieterportal` plan (`346e9174`), the `/funktionen` plan (`6a74f274`), the `/vorgehen` plan (`93952e28`, the building photo), the `/selbstabrechnung` plan (`9d0bab9c`), the `/hilfe` plan (`3b70270e`), the `/karriere` plan (`d9e105d8`, the application form), the `/ueber-uns` plan (`7a777e92`), the `/upgrade-now` plan (`ddde6575`), the `/messdienstanbieter` plan (`be2c1feb`) and the `/messdienstwechsel` plan (`65470139`). Their open go-live gates are in [04-qa-and-go-live.md §4.5–4.40](04-qa-and-go-live.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Route, the footer link and the four waiting links, content, the pure JSON highlighting, SEO, the code font | M |
| 2 | [02-sections.md](02-sections.md) | The page's sections, every block server-rendered in its end state | M |
| 3 | [03-interactions.md](03-interactions.md) | The terminal's lines, the moving data lines, the table of contents' scroll spy, "Kopieren" | S |
| 4 | [04-qa-and-go-live.md](04-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | S |

`ROUTE_API_DOKUMENTATION` and the five links come with the route, so no link ever points at a missing page. No shared code changes beyond the links' content (and their tests).

## Target structure

```
src/routes/(landing-page)/api-dokumentation/
├── +page.server.ts        # load: seo (noindex), landing chrome (nav CTA to /messdienstwechsel). No action
└── +page.svelte           # <main class="ad"> with the page tokens, the reveal, #hs-css, the Geist Mono face; Hero, Docs, Trust; FloatingCta

src/lib/landing/pages/api-dokumentation/
├── content.ts  content.test.ts       # every text of the page, the code samples and the tables, word for word
├── highlight.ts  highlight.test.ts   # pure: the design's JSON colouring as tokens (keys, string values)
├── icons.ts                          # the design's inline icons as path data
├── components/
│   ├── Icon.svelte                   # StrokeIcon with a name from icons.ts
│   ├── Rich.svelte                   # a text with inline code and bold runs
│   ├── Article.svelte                # .ad-sec: id, H2, the optional version badge (.ad-sh), children
│   ├── CodeBlock.svelte              # .ad-code: head (label, badge), "Kopieren", the code (highlighted when JSON)
│   ├── DocTable.svelte               # .ad-tbl: the scrolling frame, the head row, rows as children
│   └── FlowLine.svelte               # the moving data line (.ad-flow / .ad-dir i), horizontal or vertical
└── sections/
    ├── Hero.svelte                   # pg-hero: pill, H1, lead, CTAs, ticks, Terminal
    ├── Terminal.svelte               # .ad-term
    ├── Docs.svelte                   # .ad-doc: the grid, Sidebar, the note, the eleven articles
    ├── Sidebar.svelte                # .ad-side with the scroll spy
    ├── Overview.svelte  QuickStart.svelte  Auth.svelte  BaseUrl.svelte
    ├── Consumption.svelte  Endpoint.svelte  UserChange.svelte  Documents.svelte  FileExchange.svelte
    ├── StatusCodes.svelte  Versions.svelte  Access.svelte
    ├── Trust.svelte*                 # TrustSeals, "Demo buchen" → /messdienstwechsel#start
    └── FloatingCta.svelte*           # the shared FloatingCta → /messdienstwechsel#start
```

`*` marks a thin wrapper.

## Links

The design's links, by design id, and where they lead here. An element whose target has no page yet isn't rendered (a CTA) or is plain text, as on the other pages.

| Design id (use) | Here |
|---|---|
| `#schnellstart` (the hero's "Schnellstart →"), the table of contents' eleven anchors, the service cards (`#verbrauch`, `#wechsel`, `#dokumente`, `#datei`) | the articles' ids, as designed |
| `Fc97HY7KUdBR38T6vPtjeY` (the hero's and the closing card's "Softwarepartner werden") | `ROUTE_SOFTWAREPARTNER` |
| `44SBXKXJaSp6bvGMnbpZj6` (the closing card's "Erstgespräch vereinbaren", the trust block's "Demo buchen", the floating CTA "Erstgespräch vereinbaren") | `/messdienstwechsel#start`, as `/softwarepartner`'s (`MANAGER_SIGNUP_HREF`): this page has no signup form (open question 1) |
| `https://bved.info/datenaustauschalt/spezifikationen/` ("bved-Spezifikationen") | as designed, new tab, `rel="noopener noreferrer"` |
| `Sb54rDQd5WS2r82skPe7UQ` (the trust block's "Mehr zu Sicherheit") | `ROUTE_SICHERHEIT` through `TrustSeals` |
| `Jp8tqY82m7FZqMnWU4z9x9` (the banner) | `ROUTE_UPGRADE_NOW` through `DEFAULT_CHROME` |
| The nav CTA (the design's "Demo buchen" / "Angebot einholen") | `/messdienstwechsel` through `ctaHref`, as on `/softwarepartner` |

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/api-dokumentation`, `ROUTE_API_DOKUMENTATION` in `$lib/routes.ts`: the footer's label, lower-case, as the other pages. Not under `/api/` (the endpoints, `Disallow: /api/` in `robots.txt`; the trailing slash keeps `/api-dokumentation` crawlable). Not confirmed (gate §4.4, open question 3) |
| Route group | `(landing-page)`, outside `[[preview=preview]]` |
| Indexing | `seo.noindex = true` and out of the sitemap until the cutover; then indexed and in the sitemap (decision of 2026-10-17), so its gate (§4.4) blocks the cutover PR (#440) |
| Header | The shared `LandingHeader` with `DEFAULT_CHROME` (the design's banner is the same) and `ctaHref: ROUTE_MESSDIENSTWECHSEL`: no signup form here |
| Frame | `pg-`: `/fristenrechner`'s page tokens (`--bg`, `--hair`), the reveal (`.rv`), `#hs-css` for the H1 and the trust block's H2; plus `--mono` for the code. The design's hero has `id="start"` (the `pg-` designs' leftover): dropped, `#start` means a signup form on our pages |
| Hero | `/fristenrechner`'s hero layout (pill with the rack icon, H1 with the `em` accent, lead, the dark `.bk-next` "Schnellstart →" and the ghost "Softwarepartner werden", the ticks) with the terminal as its visual; the ticks keep the list's bottom margin as on `/fristenrechner` |
| Terminal | Static markup from `content.ts` (lines as tokens: method, path, value, comment, status, key, string), `aria-hidden` (the same call is in the documentation as text). The design shows its lines on a class 250 ms after the hero shows; here CSS animations with a `both` fill and the design's delays, so it plays on load without JS and the server's HTML is the end state (`/messdienstanbieter-vergleich`'s preview card) |
| Documentation | One `<section class="ad-doc" aria-label="Dokumentation">`; the table of contents a `<nav aria-label="Inhalt der Dokumentation">` with its three group labels as `<p>`; each article an `<article id>` with an H2 without id (as designed, so `#hs-css`'s `section h2[id]` leaves them alone). The order and ids from `content.ts` (`ueberblick`, `schnellstart`, `auth`, `basis`, `verbrauch`, `wechsel`, `dokumente`, `datei`, `status`, `versionen`, `zugang`), the table of contents generated from the same list |
| Code | `<pre><code>` with the design's texts; JSON coloured on the server through the pure `highlight.ts` (the design does it in the browser with `innerHTML`; here tokens rendered as `<span class="k">` / `<span class="s">`, no `{@html}`). The scrolling `pre` and the table frames get `tabindex="0"` and a name (keyboard scrolling) |
| Tables | Native tables in `DocTable` (the design's `min-width: 520px` inside a scrolling frame); inline code, "Pflicht" and the status badges from `content.ts` |
| "Kopieren" | Copies the block's code: Clipboard API, the design's hidden-textarea fallback (as `/presse`), "Kopiert" for 1.6 s; a polite `sr-only` line; hidden without JS (`@media (scripting: none)`) |
| Scroll spy | The design's rule (the last article whose top is above 160 px) through `activeIndex` from `$lib/landing/pages/hkvo-leitfaden/toc.ts`; one passive scroll listener; the current link `aria-current="location"` and `.on`; the server marks the first. The links are plain anchors (`app.css` scrolls smoothly, `scroll-margin-top: 90px` as designed) |
| Moving lines | The roles' line and the "Ihre Software → Heidi" line: the design's endless CSS animation, running only while in view (`inView`), none with reduced motion |
| Closing card | The design's dark `.ad-cta` inside the documentation's column, not the shared `CtaCard` (no form, another layout) |
| Trust, floating CTA | The shared `TrustSeals` (`demoHref`) and `FloatingCta` (`href`) to `/messdienstwechsel#start`, as `/softwarepartner` |
| Styling | Component-scoped CSS from `#pg-common-css` and `#ad-css`; breakpoints the design's (1040 and 640 px). No class that is also a Tailwind utility |

## Open questions (the default is built unless answered)

1. **"Erstgespräch vereinbaren" in "Zugang anfragen".** The design links the demo booking; the page is for software vendors and has no signup form. *Default: `/messdienstwechsel#start`, as `/softwarepartner`'s trust block and floating CTA.* Alternative: `/softwarepartner#bewerben` (its partner form).
2. **A draft documentation on a public page.** The design says "Entwurf.", the base URL is a placeholder (`api.heidisystems.example`, marked "Platzhalter"), and three articles say "Endpunkte und Feldschema folgen in der finalen Fassung". *Default: built as designed, `noindex` until engineering confirms the API and either the real values replace the placeholders or the page goes live as a declared draft (gate §4.4).*
3. **The slug.** *Default: `/api-dokumentation`.* Alternatives: `/entwickler`, `/api-docs`.

## Risks

- **Every gate is on the cutover's critical path** (04 §4.4–4.40).
- **A technical promise.** The page names concrete web services, versions, endpoints, authentication and status codes that Heidi doesn't necessarily offer yet ("Diese Dokumentation beschreibt die geplante Heidi-Schnittstelle"). A software vendor might build against it. Mitigation: the draft note stays, gate §4.4 (engineering sign-off of every endpoint, version and status code), `noindex` until then; aligned with `/softwarepartner` (§4.9), `/schnittstellen` (§4.27) and `/partnerschaften` (§4.6).
- **Third-party facts.** The bved's versions, the history of consumption-data ("ging aus der ARGE HeiWaKo hervor"), "Der E-Satz … wird vom bved nicht weiterentwickelt". Mitigation: checked against the bved's published specifications (gate §4.4).

## Out of scope

- The design's nav, footer, chat button, `#top-js`, `#mobfx`, `#eb-js`, `#fx-js` (the design footer's newsletter; ours is the shared footer), the rest of `#pg-common` (`countUp`, `tween`, `confetti`, `seg`, `paintRange`: unused here), its anchor-scrolling (`app.css` does it).
- A real API, an OpenAPI file, a sandbox, the full field schemas ("folgen in der finalen Fassung").
