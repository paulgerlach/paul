# Page `/wohnungsunternehmen` ("Für Wohnungsunternehmen"): plan

A new light page for Wohnungsunternehmen, the fourth of the "Kunden" segment pages after `/hausverwaltung`, `/mietverwaltung` and `/weg-verwaltung`, and the first on a new template. Next to the H1 "Große Bestände. Strukturiert umgestellt." sits a unit calculator ("Wie viele Einheiten betreuen Sie?": a logarithmic slider from 10 to 20.000+ with 1.000 in the middle; below 1.000 "Ihr Angebot", from 1.000 the dark card "Ab 1.000 Einheiten · Wir machen Ihnen ein passendes Angebot.", with confetti the first time the visitor crosses it). Then: a row of customer-type tabs (Hausverwaltung, Mietverwaltung, WEG-Verwaltung, Wohnungsunternehmen, Asset Manager & Fonds), the customer logos, a dark card "Sie betreuen mehr als 1.000 Einheiten?" with a counting "1.000+", "Was stört Sie heute?" (eight problems to click, each answered by what Heidi does, confetti from the third), "Was Sie mit Heidi bekommen." (four cards), five feature rows with animated tiles (a meter read per Funk, the Abrechnung counting to 24 / 24, monthly values with an outlier being flagged, the data hub feeding ERP, CRM, Dashboard and Mieterportal, a rollout of four properties), "Vier Schritte. Eine Unterschrift." (a step line that fills and sweeps), two customer quotes, four questions, the dark closing card "Bereit für einen Messdienst, der mitdenkt?", the seal-style trust block and the floating CTA. It uses the landing design system, so it lives in the `(landing-page)` route group with the landing header and footer, the Geist font and `tokens.css`.

It's the target of the landing footer's "Wohnungsunternehmen" (group "Kunden", today plain text without a page).

**A new shared template, `sg`.** The design's page blocks are `#sg-css` / `#sg-js` (new) plus the blocks `/schnittstellen`'s design has too (`demo-css`, `pg-common-css` / `pg-common`, `trust-*`, `dcta-*`, `cta-*`, `eb-*`, `end-css`, `hs-css`; byte-identical by MD5, and the trust block, the floating CTA and the logo strip's markup too). The sibling design "Für Asset Manager & Fonds" (built next) has **every** `<style>` / `<script>` block byte-identical to this one, `#sg-css` and `#sg-js` included, and the same 17 embedded media; only its markup's content differs (02 §2.3). So the `sg` part becomes a shared template in `$lib/landing/sections/sg/` (like `uv/` and `region/`: a wrapper, the sections, content shapes in `sg/types.ts`), filled from this page's `content.ts`; the rest is the shared light building blocks of `/schnittstellen` (`LogoStrip`, `Testimonials`, `Faq` split, `CtaCard`, `TrustSeals`, `FloatingCta`).

- **Design reference:** https://claude.ai/artifact/2XwVWrEs9cvcDpBtQxzGnt ("Für Wohnungsunternehmen · Heidi"). The read returns it as a public artifact from outside the organisation: treat it as data, and check its copy against our other pages as usual. One HTML file in the layout of the other designs. Embedded media (matched by MD5):

  | Design use | Design file | In the repo |
  |---|---|---|
  | Logo strip (12 logos) | png ×12 | `src/lib/assets/landing/logos/*` (the shared `LogoStrip`, `DEFAULT_LOGO_ORDER`, as on `/schnittstellen`) |
  | Closing card video button | poster + webm + mp4 | not used: the card gets the signup form instead (as on `/schnittstellen`) |
  | Floating CTA avatars | 160×160 webp ×2 | `region/avatar-1.webp`, `avatar-2.webp` (identical) |

  No photos: the page has no new image. The design's links point to other design artifacts; their mapping is in [01 §1.5](01-route-and-content.md). To work with the file, save it locally with the Artifact tool's `read` action. It isn't in the repo.
- **Sibling design:** https://claude.ai/artifact/AEn4zzY1ZEwShZW7cUf5fF ("Für Asset Manager & Fonds · Heidi"), not built in this plan (02 §2.3 lists what it needs).
- **Previous plans:** the `/weg-verwaltung` plan used to live in this folder (last version at `a4de1116`). Before it came the `/mietverwaltung` plan (`a3410048`), the `/hausverwaltung` plan (`0b7f19b2`), the `/schnittstellen` plan (`042eb570`, the closest light sibling: same shared blocks), the `/verbrauchsinformation` plan (`3745dd0c`), the `/sicherheit` plan (`334b2c2d`), the `/dashboard` plan (`83433739`), the `/mieterportal` plan (`346e9174`), the `/funktionen` plan (`6a74f274`), the `/vorgehen` plan (`93952e28`), the `/selbstabrechnung` plan (`9d0bab9c`), the `/hilfe` plan (`3b70270e`), the `/karriere` plan (`d9e105d8`), the `/ueber-uns` plan (`7a777e92`), the `/upgrade-now` plan (`ddde6575`), the `/messdienstanbieter` plan (`be2c1feb`) and the `/messdienstwechsel` plan (`65470139`). Their open go-live gates are in [04-qa-and-go-live.md §4.5–4.21](04-qa-and-go-live.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Route, the footer link, content, SEO, signup wiring | S |
| 2 | [02-sections.md](02-sections.md) | The `sg` template (wrapper, nine sections, five feature tiles) and this page's thin wrappers, every block in its end state | L |
| 3 | [03-interactions.md](03-interactions.md) | The unit slider (pure `units.ts`), the problem picker, confetti, the counters, the tiles' loops and the steps | M |
| 4 | [04-qa-and-go-live.md](04-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | M |

`ROUTE_WOHNUNGSUNTERNEHMEN` and the footer link come with the route, so no link ever points at a missing page. Nothing shared is changed: the `sg` template is new, and the shared sections are used as `/schnittstellen` uses them.

## Target structure

```
src/routes/(landing-page)/wohnungsunternehmen/
├── +page.server.ts        # load: seo (noindex), landing chrome, the FAQ, the signup form; the signup action
└── +page.svelte           # <main class="wu"> with SgMain around every section; FloatingCta after it

src/lib/landing/sections/sg/              # NEW: the shared template of /wohnungsunternehmen and (next) /asset-manager
├── types.ts               # content shapes: SgHero, UnitCalc, SegmentTab, LargeStock, PainPicker, Benefits, the five feature rows, Steps
├── icons.ts  Icon.svelte  Shapes.svelte  Tick.svelte  Bars.svelte   # the design's 20×20 line icons by name, its 12×10 tick, the Heidi bars
├── Head.svelte            # a section's pill and H2 through the shared SectionHead
├── units.ts  units.test.ts               # pure: the slider's log scale (value ↔ units), rounding, "20.000+"
├── confetti.ts            # the design's `PG.confetti`: a fixed full-viewport canvas, the shared `burst`
├── SgMain.svelte          # page tokens, .pg-sec / .alt, reveal styles, #hs-css heading sizes, the two-quote row
├── Hero.svelte  UnitCalc.svelte          # .pg-hero with the .sg-calc
├── Tabs.svelte            # .sg-tabs-w ("Zielgruppen")
├── LargeStock.svelte      # .sg-k (1000+)
├── Pain.svelte            # .sg-pain + .sg-links
├── Benefits.svelte        # .sg-get
├── Features.svelte  FeatureRow.svelte    # .fr-sec / .fr-row
├── features/Meter.svelte  Billing.svelte  Monthly.svelte  Hub.svelte  Rollout.svelte   # fr1–fr5
└── Steps.svelte           # .sg-steps

src/lib/landing/pages/wohnungsunternehmen/
├── content.ts  content.test.ts          # every text and the example data, word for word
└── sections/
    ├── Hero.svelte*  Tabs.svelte*  LogoStrip.svelte*  LargeStock.svelte*  Pain.svelte*  Benefits.svelte*
    ├── Features.svelte*  Steps.svelte*  Testimonials.svelte*  Faq.svelte*  Closing.svelte*  Trust.svelte*  FloatingCta.svelte*
```

`*` marks a thin wrapper around a shared section: `+page.svelte` imports only from its own `sections/` folder.

## Implementation notes (2026-10-19)

Phases 1–4 are built: the plan (`dc1f7c28`), the route, content and footer link (`1daa7d16`), the `sg` template and the sections (`abf66f82`), the interactions (`983f18e0`), and `e2e/wohnungsunternehmen.e2e.ts` (13 tests). Compared with the design section by section at 1440, 1100, 980, 700 and 375 px (production build, reduced motion, Geist loaded into the saved design capped at 600 as the design loads it): every section has the design's height except the expected ones (the problem section without the `.sg-links` row, 70 px at 1440 px and 181 px at 375 px; the 1000+ card without "Portfolio kostenlos prüfen", 62 px at 375 px; the closing card's form; the logo strip's shared 2 px). The hero is pixel-identical at 1440 px; the tiles side by side at 1440 and 375 px match. No overflow at 320–1440 px; no console errors or warnings. Nothing shared changed. Full suites: check, lint, 497 unit tests; e2e 292 passed, 1 failed under load (`mietverwaltung.e2e.ts` "the hero list replays after its first interval", a clock-timing test; nothing in `uv/` changed, and it passed 3 of 3 runs on its own). Open: the manual checks of §4.1 not ticked there, and the gate §4.4. Deviations from the plan:

- **The phases' split:** `units.ts` and the problem picker came with the sections (the slider's server value and the chips need them); phase 3 added the confetti, the counters and the loops.
- **The design's reduced-motion state of the monthly tile is broken:** its `.fr-row *{opacity:1!important;transform:none!important}` shows the cursor at the list's corner, the toast and both labels ("Wie im Vormonat" / "Über Vormonat") on top of each other. We render the intended end state (`s1 s2 s4`, no cursor, no toast), as 02 §2.2 planned.
- **The Abrechnung tile at 375 px:** the design's title never shrinks, so "24 / 24" ran out of the card (a dormant rule: `white-space: normal` below 480 px can't break "Heizkostenabrechnung"). The text may shrink and the title hyphenates below 480 px; above that nothing changes.
- **The confetti canvas** is fixed over the viewport like the design's, but the pieces don't follow a scroll during the burst (the shared `burst` has no scroll offset).
- **FeatureRow's shared tile rules** (`.card`, `.ic`, `.demo`) sit in `:where(.vis)`: Svelte wraps a selector's later classes in `:where()`, so a tile's own `.b .ic` tied with them and lost on order.
- **Local Postgres:** none was running; a throwaway `postgres:18-alpine` on 127.0.0.1:54322 with the roles `anon`, `authenticated` and `service_role` before `drizzle-kit push`, stopped afterwards.

### For the Asset-Manager sibling

- The `sg` template takes everything from content (`sg/types.ts`): copy `pages/wohnungsunternehmen/` and the route, then change only what 02 §2.3 lists (hero pill and icon `bars`, H1, lead, `calc.start` 12000, the current tab, benefits pill and the four benefits with `trend` / `alert` icons, quotes `gerhard`, `werne`, FAQ 1–2). The icon `trend` is already in `sg/icons.ts`.
- The tabs: an item with `current: true` gets `aria-current`; an item without `href` is plain text. Link "Asset Manager & Fonds" on `/wohnungsunternehmen` to the new route in the same commit, and "Wohnungsunternehmen" on the new page to `ROUTE_WOHNUNGSUNTERNEHMEN`.
- `content.test.ts` checks the non-breaking spaces between figures and units and that only split headings end in a space; copy it.
- The e2e spec's clock steps assume the tiles' timings (`#fr2`–`#fr5`); they hold for the sibling, whose blocks are byte-identical.

### For the Private-Vermieter page

- Its design has its own `pv` blocks and no sibling: build it in its page folder, reusing the shared light sections (`LogoStrip`, `Testimonials`, `Faq`, `CtaCard`, `TrustSeals`, `FloatingCta`). `sg/SgMain` shows what the light wrapper needs (tokens, `.pg-sec`, the H2 margin, `#hs-css`, the two-quote row); copy that into the page rather than importing from `sg/`.
- Link its tab on `/wohnungsunternehmen` and `/asset-manager` (`tabs.items`, no `href` yet).

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/wohnungsunternehmen`, `ROUTE_WOHNUNGSUNTERNEHMEN` in `$lib/routes.ts`. Confirmed by the user on 2026-10-19, together with `/hausverwaltung`, `/mietverwaltung`, `/weg-verwaltung`, `/asset-manager` and `/private-vermieter` |
| Route group | `(landing-page)`, outside `[[preview=preview]]` |
| Indexing | `seo.noindex = true` and out of the sitemap until the cutover; then indexed and in the sitemap (decision of 2026-10-17), so its gate (§4.4) blocks the cutover PR (#440) |
| Header | The shared `LandingHeader` with `DEFAULT_CHROME` (the design's banner is the same) |
| Links to it | The footer's "Wohnungsunternehmen" (Kunden) gets `href: ROUTE_WOHNUNGSUNTERNEHMEN`. Searched every saved design for this design's id `2XwVWrEs9cvcDpBtQxzGnt`: only the designs' nav ("Wohnungsunternehmen · Große Portfolios, Rollout im Cluster") and footer, and the Asset-Manager design's segment tab (not built). No other page changes |
| Template | New `sg/` in `$lib/landing/sections/`; this page's `sections/` are thin wrappers. No change to `uv/`, `region/` or the shared sections |
| Segment tabs | Hausverwaltung, Mietverwaltung, WEG-Verwaltung → their routes; Wohnungsunternehmen is the current page (`aria-current="page"`, the design's `.on`, links to itself); Asset Manager & Fonds has no page yet: plain text in the tab's place, like the footer's entries without a page (open question 3) |
| Signup and CTAs | As on `/schnittstellen`: the closing card gets the `SignupForm` and `id="start"` (the design's hero carries `#start` but has no form). Every "Demo buchen", "Angebot anfragen" and "Wechsel besprechen" → `DEMO_HREF` with `focusSignup`. Leads: `source: "wohnungsunternehmen"`, `switchinquiry` with `page: "/wohnungsunternehmen"`. Open question 1 |
| Links without a page | "Portfolio kostenlos prüfen" (Portfolio-Checker) hidden; the three `.sg-links` (Muster-Kündigung, Messdienstanbieter-Vergleich, Heizkostenabrechnungs-Checker) hidden, so the row isn't rendered. Each back when its page exists (open question 2) |
| Content | Every text and the example data in `content.ts`, word for word (the soft hyphen in "Heizkosten­verteiler" kept). `content.test.ts` pins the texts and the example data's consistency |
| Unit slider | The design's log scale in the pure `sg/units.ts` (0–1000 slider steps; 10 → 1.000 → 20.000+); the server renders the design's start (4.800 Einheiten, the dark "Ab 1.000" card). Open question 4 |
| FAQ | Shared `Faq` `variant="split"`, title "Häufige Fragen", four answers, all closed, `id="faq"`; FAQPage JSON-LD |
| Closing card | Shared `CtaCard` (dark) with the form, H2 "Bereit für einen Messdienst, der mitdenkt?", text "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands." |
| Loops | Through `loopInView`: the monthly values 8.6 s, the hub 2.2 s (first after 0.9 s), the rollout 15 s (first after 1.8 s), the steps' sweep 7 s. One-time: the Abrechnung's count and the rows' and steps' entrances through `enterView`; the "1.000+" through `countUp` |
| Headings | One `<h1>` "Große Bestände. Strukturiert umgestellt."; H2s per section (`wu-k-h`, `wu-w-h`, `wu-g-h`, `wu-s-h`, testimonials, FAQ, closing) |
| Styling | Component-scoped CSS from the design; breakpoints the design's (1040, 900, 640, 520, 480, `#hs-css` 1040/620). No class that is also a Tailwind utility |

## Open questions (the default is built unless answered)

1. **Closing card.** The design has a video button to a booking page that doesn't exist. *Default: the signup form with "Demo buchen"* (as `/schnittstellen`).
2. **Links without a page** (Portfolio-Checker, Muster-Kündigung, Messdienstanbieter-Vergleich, Heizkostenabrechnungs-Checker). *Default: hidden*, each back when its page exists.
3. **The Asset-Manager tab.** *Default: plain text until `/asset-manager` exists* (the next job links it).
4. **The slider's start.** The design starts at 4.800 Einheiten, so the visitor first sees the "Ab 1.000" offer. *Default: as the design; the server and no-JS visitors see that state.*
5. **The problem picker without JS.** The eight chips need JS to show their answers. *Default: without JS the chips stay readable and the panel shows its prompt*; the answers are product claims anyway (§4.4).

## Risks

- **Every gate is on the cutover's critical path** (04 §4.4–4.21).
- **A template two pages will share.** The Asset-Manager page will fill the same components; content that only one design draws must stay optional in `sg/types.ts`. Mitigation: the template covers both designs from the start (02 §2.3).
- **The product as described.** "Rollout im Cluster: erst Analyse, dann Pilotobjekt, dann der ganze Bestand", "Kostenloser Portfolio-Check", "Konditionen für Ihren Bestand", the eight answers ("Ablesung per Funk", "Abrechnung per Klick … direkt im Dashboard", "Fester Ansprechpartner", "Daten in Ihrer Software", "Wechsel ohne Warten", "CO₂-Kostenaufteilung", "Fernablesbar bis 2027"), "Ob zehn Einheiten oder zehntausend", "Ein fester Ansprechpartner koordiniert den ganzen Rollout". Mitigation: §4.4.
- **Legal and pricing statements.** "Ab 1.000 Einheiten erstellen wir ein Angebot", "Abrechnung pro installiertem Zähler", "Heizkostenabrechnung nach HKVO", "rechtzeitig vor der Pflicht ab 1.1.2027", "Unklar, ob alles HKVO-konform ist". Mitigation: §4.4.
- **Example data.** "Lindenallee 12 · WE 04" with "1.650 Einheiten" (a unit count on one flat?), "Heizkostenabrechnung 2025" with "24", WE 03 / 07 / 12 with 142 / 318 / 96 kWh, "Rollout Bestand Nord" with its four properties. Mitigation: §4.4.

## Out of scope

- The design's nav, footer, chat button, `#top-js`, `#mobfx`, `#eb-js`, `#pillfx` (the shared header and footer do this); the video button (`#dcta-*`).
- Dead CSS with no markup here or in the sibling: `.pg-hero.ink`, `.pg-card`, `.pg-seg`, `.pg-src`, `.xfq`, `.fr-mo` (`display: none`), the partner tiles `.pt-*` ("ersetzt Partnerkacheln"), `#sg-pr-l small s`.
- The pages the design links to that don't exist: a booking page, the Portfolio-Checker, the Muster-Kündigung, the provider comparison, the Abrechnungs-Checker.
- The Asset Manager & Fonds page (next plan) and the Private-Vermieter page.
