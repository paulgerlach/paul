# Page `/portfolio-checker` ("Portfolio-Checker"): plan

A light tool page, the eighth page from the landing footer's "Ressourcen" group (after the blog, `/neuigkeiten`, `/fristenrechner`, `/hkvo-leitfaden`, `/einsparrechner`, `/presse`, `/muster-kuendigung` and `/energieausweis`). The hero ("Vertragsunterlagen hochladen. Heidi liest den Rest." with the pill "Portfolio-Checker", the lead, three ticks and the step line "1 Hochladen · 2 Prüfen · 3 Analysieren · 4 Extrahieren") holds the tool: a drop zone for contract files ("Vertragsunterlagen hier ablegen", a file picker), "Mit Beispielunterlagen testen", the file list with a four-step status per file, "Unterlagen prüfen" and the note "Ihre Dateien bleiben in Ihrem Browser.". A run checks every file one after the other (a scan line, spinners, ticks, a warning) and opens the evaluation below the hero ("Die wichtigsten Daten aus Ihren Unterlagen."): with the five example files four figures (documents, properties, the next notice date as a dark card with confetti, the high-priority hints), three properties with their contract dates and a recommendation chip whose details open on hover or click, "Als CSV herunterladen" and "Mit eigenem Bestand auswerten →"; with the visitor's own files a panel "<n> von <m> Dokumenten sind bereit für die Auswertung." (format and size checked, nothing read or sent) with "Auswertung anfragen →" and "Beispielauswertung ansehen". Then the documents it reads ("So, wie sie bei Ihnen liegen. Auch als Scan.", six cards), the three steps ("Prüfen, analysieren, extrahieren.", with a looping demo of each step), the extracted fields ("Die Daten, die Sie sonst zusammensuchen.", eight cards), the per-property list ("Für jede Liegenschaft der nächste Schritt.": `/dashboard`'s list with filters, search, the check run and the recommendation popovers), the two follow-ups ("Übernehmen oder kündigen? Beides geht mit Heidi.", a light and a dark card), the Werne quote, the FAQ (six questions, the first open), the dark closing card "Ihre Verträge. Endlich übersichtlich.", the seal-style trust block and the floating CTA. It uses the landing design system, so it lives in the `(landing-page)` route group with the landing header and footer, the Geist font and `tokens.css`.

It's the target of the landing footer's "Portfolio-Checker" (group "Ressourcen", today plain text without a page) and of six links on built pages that wait for it (searched the repo for the design id `UFviBtC2mkneFNeWnfHAWp` and "Portfolio-Checker"): `/fristenrechner`'s "Zum Portfolio-Checker", `/muster-kuendigung`'s "Vertragsenden prüfen", the `/neuigkeiten` story "Portfolio-Checker: Vertragsenden im ganzen Bestand prüfen" ("Bestand prüfen"), `/hilfe`'s answer `vertragsende` ("Portfolio-Checker"), and "Portfolio kostenlos prüfen" on `/wohnungsunternehmen` and `/asset-manager`. Each gets the route with the page. The other mentions ("Der Portfolio-Checker erfasst …" on `/messdienstwechsel`, `/mietverwaltung`'s audience mock, FAQ texts) are plain text in their designs and stay so.

**A page-only build on the shared `pg-` blocks, plus `/dashboard`'s list.** The design's page block is `#pc-css` (prefix `pc-`) on top of `#pg-common-css` (`.pg-hero`, `.pg-grid`, `.pg-h1`, `.pg-lead`, `.pg-ticks`, `.pg-sec`, `.pg-head`, `.pg-ghost`, `.dbm-demo`, the `.xfq` FAQ), `#demo-css` (`.dm-in`, `.dm-pill`, `.dm-h2`, `.dm-lead`, `.bk-next`, the `.rv` reveal, `.dm-end` / `.dm-cta`) and `#hs-css`. Its scripts are `#pc-js` (the tool, the evaluation, the CSV), `#pc-how-js` (the steps' loop) and an inline script marked "Naechster Schritt je Liegenschaft (aus Dashboard)" with the `.pl` CSS under the same comment: the list `/dashboard`'s `Recommendations` already ports, with the same seven rows, three explanations and seven thumbnails (the same files, by MD5). So that list moves out of `/dashboard` into a shared section (`$lib/landing/sections/NextSteps.svelte`, its data and pure filter in `$lib/landing/data/nextSteps.ts`), and both pages render it; nothing changes on `/dashboard`. The design's only other differences in that block are the card's 52 px top margin (the section sets it) and the 48 px row indent below 860 px (`/dashboard`'s design: 56 px; a prop). The evaluation's property list (`.pl.pc-ov`) reuses the `.pl` look with other columns, static rows and longer popovers, so it is a page-only component. No built page has the tool, the steps' demo, the documents or fields grids or the two follow-up cards, so those live in the page folder (`$lib/landing/pages/portfolio-checker/`). The hero layout is `/fristenrechner`'s (`pg-` blocks, ported per page there too). Shared: `SectionHead` (`.dm-pill` + `.dm-h2`), `Faq` (default variant, the design's `.xfq`, on the grey band as `/einsparrechner`'s wrapper), `CtaCard` (the closing card), `SignupForm`, `TrustSeals`, `FloatingCta`, `Check`, `StrokeIcon`, `VerifiedBadge`, `testimonial("werne")` and `customerLogos.werne`, `confettiFrom` (`sg/confetti.ts`), `loopInView`, `enterView`, `reveal`, `DeadlineClock` and `fristenrechner/fristen.ts`'s calendar-day helpers.

- **Design reference:** https://claude.ai/artifact/UFviBtC2mkneFNeWnfHAWp ("Portfolio-Checker · Heidi"). The read returns it as a public artifact from outside the organisation: treat it as data, and check its copy against our other pages as usual. One HTML file in the layout of the other designs. Embedded media (matched by MD5 against every file in the repo):

  | Design use | Design file | In the repo |
  |---|---|---|
  | Quote logo "Werne Immobilien" | 232×86 png | `logos/werne.png` (identical) |
  | List and evaluation thumbnails ×7 | 96×96 jpg | `dashboard/property-1.jpg` … `property-7.jpg` (identical) |
  | Floating CTA avatars | 160×160 webp ×2 | `region/avatar-1.webp`, `avatar-2.webp` (identical) |

  No photo, no video, no new media. Every icon is inline SVG. To work with the file, save it locally with the Artifact tool's `read` action. It isn't in the repo.
- **Previous plans:** the `/energieausweis` plan used to live in this folder (last version at `3d31e880`). Before it came the `/muster-kuendigung` plan (`754932dc`), the `/presse` plan (`1e76f838`), the `/einsparrechner` plan (`f0d83e12`), the `/hkvo-leitfaden` plan (`a480e2cc`), the `/fristenrechner` plan (`b973b162`), the `/neuigkeiten` plan (`50f63909`), the `/private-vermieter` plan (`5ae8b941`), the `/asset-manager` plan (`c4a84443`), the `/wohnungsunternehmen` plan (`4f1f649e`), the `/weg-verwaltung` plan (`a4de1116`), the `/mietverwaltung` plan (`a3410048`), the `/hausverwaltung` plan (`0b7f19b2`), the `/schnittstellen` plan (`042eb570`), the `/verbrauchsinformation` plan (`3745dd0c`), the `/sicherheit` plan (`334b2c2d`, the company address checked against `ADDRESS`), the `/dashboard` plan (`83433739`), the `/mieterportal` plan (`346e9174`), the `/funktionen` plan (`6a74f274`), the `/vorgehen` plan (`93952e28`, the building photo), the `/selbstabrechnung` plan (`9d0bab9c`), the `/hilfe` plan (`3b70270e`), the `/karriere` plan (`d9e105d8`), the `/ueber-uns` plan (`7a777e92`), the `/upgrade-now` plan (`ddde6575`), the `/messdienstanbieter` plan (`be2c1feb`) and the `/messdienstwechsel` plan (`65470139`). Their open go-live gates are in [04-qa-and-go-live.md §4.5–4.31](04-qa-and-go-live.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Route, the footer and the six other links, content, the checker's logic and the example evaluation as pure code, the shared list's move out of `/dashboard`, SEO, signup wiring | M |
| 2 | [02-sections.md](02-sections.md) | The page's sections, every block in its end state | M |
| 3 | [03-interactions.md](03-interactions.md) | The tool's run, the evaluation, the CSV, the popovers, the steps' loop, the list's check run, filters and search, reveal, hover effects | M |
| 4 | [04-qa-and-go-live.md](04-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | S |

`ROUTE_PORTFOLIO_CHECKER` and every link to it come with the route, so no link ever points at a missing page. Shared code changes in the footer's link list, the moved list (no visible change on `/dashboard`) and the six linking pages' content.

## Target structure

```
src/routes/(landing-page)/portfolio-checker/
├── +page.server.ts        # load: seo (noindex), landing chrome, now, the signup form; the signup action
└── +page.svelte           # <main class="pc"> with the page tokens, .pg-sec, the reveal styles and #hs-css; DeadlineClock and the PortfolioCheck context; FloatingCta after </main>

src/lib/landing/data/
└── nextSteps.ts  nextSteps.test.ts      # MOVED from /dashboard: the list's rows, explanations and labels; filterNextSteps / countByKind (pure)

src/lib/landing/sections/
└── NextSteps.svelte                     # MOVED from /dashboard's Recommendations: the .pl card (filters, search, rows, popovers, footer, the check run)

src/lib/landing/pages/portfolio-checker/
├── content.ts  content.test.ts          # every text of the page, the example files, the documents, steps, fields, follow-ups, FAQ, word for word
├── checker.ts  checker.test.ts          # pure: file kind, acceptance, size; the contract terms rolled forward; the example evaluation for a day; the KPIs; the CSV
├── check.svelte.ts                      # PortfolioCheck (the files, the run, the result), per page via context
├── icons.ts  components/Icon.svelte     # the design's 20×20 line icons by name
└── sections/
    ├── Hero.svelte                      # .pg-hero: pill, H1, lead, ticks, the step line, the Tool
    ├── Tool.svelte                      # .pc-tool: drop zone, example button, file list, action row, privacy note
    ├── Result.svelte                    # .pc-res-sec: head, KPIs, Overview or the own-files panel, CSV, CTA, message
    ├── Overview.svelte                  # .pl.pc-ov: the three example properties with their recommendation
    ├── Documents.svelte                 # .pc-docs
    ├── How.svelte                       # .pc-how and its loop
    ├── Fields.svelte                    # .pc-fx
    ├── NextSteps.svelte*                # head + the shared NextSteps
    ├── Decision.svelte                  # .pc-dec
    ├── Quote.svelte                     # .pc-quote
    ├── Faq.svelte*  Closing.svelte*
    └── Trust.svelte*  FloatingCta.svelte*
```

`*` marks a thin wrapper around a shared section. `/dashboard`'s `Recommendations.svelte` keeps its head and its three cards and renders the shared `NextSteps`; `dashboard/recommendations.ts` and its test move to `data/nextSteps.ts`.

## Links

The design's links, by design id, and where they lead here. An element whose target has no page yet isn't rendered (a CTA) or is plain text, as on the other pages.

| Design id (use) | Here |
|---|---|
| `#start` (the design's hero and tool; the design footer's "Portfolio-Checker") | the hero's tool (`id="checker"`); the nav CTA "Bestand prüfen" leads there (`ctaHref: "#checker"`), as in the design, where it lands on the hero. `#start` is the closing card with the form, as on every landing page |
| `44SBXKXJaSp6bvGMnbpZj6` ("Mit eigenem Bestand auswerten →", "Auswertung anfragen →", "Portfolio prüfen lassen →", the trust block's "Demo buchen", the floating CTA) | `DEMO_HREF` (`#start`, the closing form); the links focus the e-mail field (`focusSignup`) |
| `Jp8tqY82m7FZqMnWU4z9x9` (the banner) | `ROUTE_UPGRADE_NOW` (`DEFAULT_CHROME`) |
| `Sb54rDQd5WS2r82skPe7UQ` (the trust block's "Mehr zu Sicherheit") | `ROUTE_SICHERHEIT` (`TrustSeals`) |

## Implementation notes (2026-10-19)

Phases 1–4 are built: the plan (`5cc03551`), the route, content, the pure `checker.ts`, `PortfolioCheck`, the shared list's move and the seven links (`70aa8d5a`), the sections with their interactions, and `e2e/portfolio-checker.e2e.ts` (15 tests). Compared with the design section by section at 1440, 1100, 980, 700, 375 and 320 px (dev server, reduced motion, also after the example run and after a run with own files): every section has the design's height to the pixel at every width and matches it by eye (the hero, the tool's list after the run, the evaluation with its popovers, the steps, the list with a popover); the one difference is the planned one: the closing card holds the signup form (0 / 0 / +90 / +7 / +71 / +71 px at 1440 / 1100 / 980 / 700 / 375 / 320 px; the shared `CtaCard` puts the form under the heading below 1040 px). No overflow at 320 and 375 px, also with the evaluation; no console errors or hydration warnings. Full suites: check, lint, 670 unit tests, 428 e2e tests passed. Open: the manual checks of §4.1 not ticked there, and the gate §4.4. Deviations from the plan:

- **Phases 2 and 3 are one commit:** the run, the loop and the popovers are part of their sections.
- **The follow-ups' ticks:** ink on the light card, as the design draws them (its SVGs hard-code ink, so its CSS colour never applies); on the dark card, where that ink tick vanishes, the accent the design's CSS asks for.
- **No adding files while a check runs** (the tool's `add` is ignored then): the design lets a pick during the run replace the list under the running loop.
- **`NextSteps` on `/dashboard`:** the search field gets the browser's default input padding both designs rely on (Tailwind's preflight zeroes it; +2 px on `/dashboard`), the chips' icons the designs' stroke widths (1.8 / 1.7). `/dashboard` keeps its 56 px row indent below 860 px, though its design, like this one, says 48 px (a finding for `/dashboard`, not changed here).
- **Headings:** the landing heading reset also takes `SectionHead`'s −.03em letter-spacing; the page's `Head` restores it with the 18 px margin.
- **Local Postgres:** none was running; a throwaway `postgres:18-alpine` on 127.0.0.1:54322 with the roles `anon`, `authenticated` and `service_role` before `drizzle-kit push`, stopped afterwards.

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/portfolio-checker`, `ROUTE_PORTFOLIO_CHECKER` in `$lib/routes.ts`: the footer's label, already German usage on the other pages. Not confirmed (gate §4.4) |
| Route group | `(landing-page)`, outside `[[preview=preview]]` |
| Indexing | `seo.noindex = true` and out of the sitemap until the cutover; then indexed and in the sitemap (decision of 2026-10-17), so its gate (§4.4) blocks the cutover PR (#440) |
| Header | The shared `LandingHeader` with `DEFAULT_CHROME` (the design's banner is the same) and `ctaHref: "#checker"`: the design's nav CTA lands on the tool |
| Content | Every text in `content.ts`, word for word, including the five example files, the twelve fields of the three example properties, their hints and recommendations, the six documents, the three steps and their chips, the eight fields, the two follow-ups and the six FAQ answers. The list's texts are `/dashboard`'s (identical in both designs), now shared in `data/nextSteps.ts` |
| Nothing leaves the browser | The tool reads only a chosen file's name and size (for the list, the format check and the 25 MB limit); it never reads the content, uploads or stores anything, so "Ihre Dateien bleiben in Ihrem Browser." holds. The e2e test checks that choosing files and running the check sends no request |
| The example evaluation | `checker.ts` (pure) is the design's `props()` for a calendar day: the three contracts (Lindenallee 12 ends 31.12. next year with 3 months' notice; Parkstraße 4 ended 31.12. this year with 6 months; Am Markt 7 ends 30.06. next year with 3 months), each rolled forward by its 12-month renewal until its notice date isn't past (the design's `next()`), the dates "Vertragsbeginn" and "Nächste Eichfrist" from the year, the hints with their day counts, the 1.1.2027 hint in its two variants (the design's expired text), the recommendations, the KPIs (5 documents, 3 properties, the earliest notice date with its property and day count, the number of red hints) and the CSV. "Today" is the Berlin calendar day of the page's `DeadlineClock` (never `Date.now()` in a component); the run reads it when it ends |
| The run | `PortfolioCheck` (`check.svelte.ts`) holds the files, the mode (`example` or `own`), `busy` and the shown result; `Tool` and `Result` read it through the page's context. Each file's four status dots, scan line and tags are its state; the steps wait the design's 550 / 450 / 380 ms (0 with reduced motion), own files stop after the format check with the last two dots locked. Its timers are cleared on teardown |
| The result's arrival | Shown below the hero once a run ends (client-only state, never server-rendered), scrolled into view 250 ms later (90 px offset, smooth unless reduced motion), its heading focused (`preventScroll`, our addition for keyboard and screen reader). With the example the dark KPI bursts confetti once it is fully on screen (the design polls for 8 s; here at most 67 tries of 120 ms) |
| The evaluation's popovers | As `/dashboard`'s list: the chip is a button that toggles its popover (`aria-expanded`, `aria-controls`); hover and focus show it too (the design's CSS), so touch and keyboard reach the details |
| The CSV | Built by `checker.ts` (BOM, `;`, every value quoted, the design's columns), saved through a Blob link as "Heidi-Portfolio-Beispiel.csv" (the design's `claude.use('downloads')` path is the artifact host's, not ours); "Gespeichert: <Datei>" or "Der Download ist hier gerade nicht möglich." in the polite line |
| The steps' loop | `loopInView` (10.5 s, threshold .35, the design's): the step cards light up one after the other, their chips appear, "Vertrag 2021" and "+ Nachtrag 2023" merge, "30.09." types itself and "72" counts. Server-rendered and with reduced motion: every chip shown, the figures final, no card lit. Leaving the view cancels the pass and restores that end state (the design's stop at the end of a pass) |
| The list | The shared `NextSteps` as on `/dashboard`: server-rendered checked with every count; below the fold with motion, `enterView` starts the design's check run (rows in every 140 ms, checked from 700 ms every 420 ms). Filters are `aria-pressed` buttons (the design's `role="tablist"` has no tab panels) |
| Without JS | The hero and every section readable; the tool's drop zone stays a native file picker, the example button is hidden (`@media (scripting: none)`), so nothing promises a result that can't come. The list shows checked, every row; the FAQ works (`<details>`); the signup form posts |
| Signup and CTAs | The closing card gets the `SignupForm` and `id="start"` in place of the design's "Portfolio prüfen lassen →" (a link to a booking page that doesn't exist); the submit label is "Portfolio prüfen lassen". Leads: `source: "portfolio-checker"`, `switchinquiry` with `page: "/portfolio-checker"`. Open question 1 |
| FAQ | The shared `Faq` default variant (the design's `.xfq`: the centred title, six questions, the first open, the chevron turning), on the grey band through the page's wrapper as `/einsparrechner`'s, with its FAQPage JSON-LD |
| Quote | `testimonial("werne")` (the quote, name and role are the shared data's, word for word) with `customerLogos.werne` and `VerifiedBadge`: the design's `.pc-quote` (centred, max 860 px, the logo 34 px high) |
| Styling | Component-scoped CSS from the design; breakpoints the design's (980 and 560 px for `pc-`, 860 px for the lists, 1040 and 640 px for `pg-`; `#hs-css` 1040/620). The design's unused `.pc-c`, `.pc-ch`, `.pc-src`, `.pc-cb`, `.pc-kv`, `.pc-hints`, `.pc-hint` rules (an older result card the script no longer draws) aren't ported. No class that is also a Tailwind utility (the design's `.hide` becomes `hidden`, the attribute; `.on`, `.ok`, `.in`, `.scan`, `.act`, `.ov`, `.lk`, `.wn`, `.run` are fine) |

## Open questions (the default is built unless answered)

1. **Closing card.** The design's card has only "Portfolio prüfen lassen →" to a booking page that doesn't exist. *Default: the signup form with "Portfolio prüfen lassen" as its button.*
2. **The product.** The page says Heidi reads contracts, scans included ("Heidi prüft jedes Dokument, analysiert Laufzeiten und Fristen und zieht die wichtigsten Daten heraus"), but the tool only analyses the example; own files get a format check and the offer of an evaluation by request. Is that the product (a request-based evaluation by Heidi's team or an AI), and who answers "Auswertung anfragen"? *Default: as designed, the requests reach the closing form; the gate (§4.4) blocks the page until product signs it off.*
3. **Without JS.** *Default: the drop zone stays (a native picker), the example button is hidden.* The alternative is to hide the whole tool card.

## Risks

- **Every gate is on the cutover's critical path** (04 §4.4–4.31).
- **A promise about data.** "Ihre Dateien bleiben in Ihrem Browser." and "Ihre Dateien haben dafür Ihren Browser noch nicht verlassen." are only true while the page reads nothing but names and sizes. Mitigation: no `FileReader`, no upload, no analytics on the input; the e2e test asserts no request on choosing and checking files; the data-protection sign-off in §4.4.
- **The product as described.** The hero, the steps and the FAQ describe a contract reader that the page can't show with real files. Mitigation: product sign-off in §4.4; `noindex` until then.
- **Example data with dates.** The example's notice dates, day counts and the 1.1.2027 hint change with the day. Mitigation: pure `checker.ts` tested for several days (before and after 1.1.2027, a rolled contract), "today" from the page's clock.
- **The moved list.** `/dashboard` renders the shared `NextSteps` now. Mitigation: no visible change (its indent stays 56 px), its e2e tests run unchanged.

## Out of scope

- The design's nav, footer, chat button, `#top-js`, `#mobfx`, `#eb-js`, `#pillfx` beyond the pills' icon hover, `#end-css`, `#fx-js` (the design footer's newsletter; ours is the shared footer), `#demo-css` beyond the blocks above, the dead `pc-c` / `pc-kv` / `pc-hints` CSS, `window._pcData` / `window.PLIMG` (component state here), the design's `claude.use('downloads')`.
- Reading, uploading or storing the visitor's files; a real contract analysis.
