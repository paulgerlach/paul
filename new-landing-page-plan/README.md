# Landing pages `/messdienstanbieter` and `/messdienstanbieter/[city]`: plan

A family of landing pages that target meter-service searches ("Messdienstanbieter Berlin", "Messdienstanbieter Deutschland"): one page for **all of Germany** at `/messdienstanbieter` and one page **per city** at `/messdienstanbieter/<city>`. Berlin comes first, then the Germany page and the 20 other cities whose designs exist. Like `/messdienstwechsel`, these pages live in the `(landing-page)` route group, with the landing header and footer, the Geist font and `tokens.css`.

- **Design reference (Berlin):** https://claude.ai/artifact/FxQX9JtVueXdSSvCBRoEoW ("Heidi Berlin"). It is one HTML file: about 1,100 lines of CSS (the same tokens and base primitives as the `/messdienstwechsel` design), 4 vanilla scripts, and embedded images and video.
- **Germany design:** https://claude.ai/artifact/ParAyztPNrjpUJLvWqfEyG ("Heidi Deutschland", the "Ganz Deutschland" link in the footer). **The same 13 sections and markup as the city designs.** Only the content differs (nationwide copy, the example property "Bahnhofstraße 12"), and so does the map: the 16 Bundesländer plus 25 clickable city dots that open the city pages. Details in [08-germany-page.md](08-germany-page.md).
- **Other cities:** linked from the Berlin design's footer. 21 of the 24 links can be read; Hamburg, Nürnberg and Münster can't (not found or not shared) and are skipped for now. Inventory in [07-other-cities.md](07-other-cities.md).
- **Previous plan:** the `/messdienstwechsel` plan used to live in this folder. It is in git history (last version at `65470139`). Its open go-live gate moved to [06-qa-and-cutover.md §6.5](06-qa-and-cutover.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-structure-and-refactor.md](01-structure-and-refactor.md) | New `$lib/landing` layout (`pages/<landing>/sections/…`), move the `/messdienstwechsel` sections, extract the shared sections, shared signup server code. `/messdienstwechsel` must not change visibly | M |
| 2 | [02-route-and-content.md](02-route-and-content.md) | City route, `city` param matcher, the `RegionContent` model, Berlin content, SEO, sitemap, assets | M |
| 3 | [03-sections.md](03-sections.md) | The 13 sections of the template (shared by the city and Germany pages), with static markup | L |
| 4 | [04-interactions.md](04-interactions.md) | Hero loop, map, billing button with confetti, count-ups, uVI phone, portfolio browser, the three trio demos | L |
| 5 | [05-signup-form.md](05-signup-form.md) | Hero and final signup: reuse of the `/messdienstwechsel` form with a per-page lead source | S |
| 6 | [06-qa-and-cutover.md](06-qa-and-cutover.md) | Checks, tests, go-live gate for these pages, and the carried-over `/messdienstwechsel` gate | S |
| 7 | [07-other-cities.md](07-other-cities.md) | The 20 other cities: extraction script, content modules, the 3 map variants, photos, rollout in batches | L |
| 8 | [08-germany-page.md](08-germany-page.md) | `/messdienstanbieter`: route, content, the Bundesländer map with links to the city pages | S |

Do phase 1 on its own and check that `/messdienstwechsel` looks and works exactly as before. Then phases 2 and 3 give a static, design-matched Berlin page, and phases 4 and 5 add the behaviour. Phases 7 and 8 start once Berlin is complete, because the template must be finished first. Phase 8 can run in parallel with phase 7 (it uses the same extraction script), but its city dots only link to cities that are live.

## Target structure (the "landing page → section" path)

```
src/routes/(landing-page)/
├── messdienstwechsel/                     # unchanged route
└── messdienstanbieter/
    ├── +page.server.ts  +page.ts  +page.svelte    # Germany page (phase 8)
    └── [city=city]/
        ├── +page.server.ts                # forms + action
        ├── +page.ts                       # loads the city content module, seo
        └── +page.svelte                   # composes the sections

src/lib/landing/
├── tokens.css  motion.ts  cta.ts  confetti.ts(new)
├── attachments/                           # inView, playOnView, countUp, equalHeights
├── components/                            # shared building blocks, not sections:
│   ├── LandingHeader / LandingNavGroup / LandingFooter
│   ├── SignupForm.svelte  DemoCard.svelte(new)
│   └── icons/
├── sections/                              # shared section implementations (prop-driven)
│   ├── LogoStrip.svelte  Faq.svelte  FinalCta.svelte          # used by every landing page
│   └── region/                            # the 13-section template of the city and Germany pages
│       ├── types.ts                       # RegionContent, RegionMap
│       ├── Hero, HeroPhotoStack, NoWait, AllInOne, RegionMap, OneClickBilling, LocalService,
│       ├── Duo, UviPhone, PortfolioBrowser, Trio, TrioBilling, TrioSignature, TrioTenantAccess,
│       └── References, Trust
├── data/
│   └── logos.ts                           # customerLogos (used by all pages)
└── pages/
    ├── messdienstwechsel/
    │   ├── data.ts  data.test.ts
    │   └── sections/                      # Hero, HeroCard, LogoStrip*, Steps, OldVsNewWay, Rollout,
    │                                      # Service, Automation, Insights, BudgetChart, RiskChart,
    │                                      # TestimonialBanner, Faq*, FinalCta*
    ├── messdienstanbieter-city/
    │   ├── cities/index.ts                # slugs, names, `live`, Bundesland (used by the matcher, footer, Germany map)
    │   ├── cities/<slug>.ts               # all copy and data of one city (berlin.ts, muenchen.ts, …)
    │   ├── cities/<slug>-map.ts           # that city's district map
    │   └── sections/                      # 13 wrappers: Hero*, LogoStrip*, NoWait*, AllInOne*, Map*,
    │                                      # OneClickBilling*, LocalService*, Duo*, Trio*, References*,
    │                                      # Faq*, FinalCta*, Trust*
    └── messdienstanbieter/                # the Germany page
        ├── content.ts                     # all copy and data of the Germany page
        ├── germany-map.ts                 # Bundesländer + city dot positions
        └── sections/                      # the same 13 wrappers
```

`*` = a thin wrapper around the shared component in `$lib/landing/sections/` or `$lib/landing/sections/region/`. Every page has **every** section as its own file under `pages/<landing>/sections/`, even when the section is shared. So the page's `+page.svelte` imports only from its own `sections/` folder, and you can always go landing page → section file → shared implementation.

The city and Germany pages share all 13 sections, so their implementations live in `sections/region/` rather than inside one page's folder (a page importing another page's sections would hide the dependency). Widgets that belong to one section (`HeroPhotoStack`, `UviPhone`, `TrioBilling` …) sit next to their section; `/messdienstwechsel` keeps its own widgets (`HeroCard`, `BudgetChart` …) in its page folder, because nothing else uses them.

## Core requirement: every city page is a real standalone landing page

Every city page (and the Germany page) is treated as **its own landing page**, not as a variant of a template with a swapped city name. Each page has its own:

| Item | Where it comes from | How it's enforced |
|---|---|---|
| **Page title** | `seo.title` in the content module, written per city. The designs have none (only "Heidi Berlin"), so these are new copy | Required field; Vitest: unique across all pages, 30–60 characters, contains the city name |
| **Meta description** | `seo.description`, written per city (new copy, as above) | Required; Vitest: unique, 120–160 characters, contains the city name |
| **H1** | `hero.title` from the city's design ("Messdienst wechseln in Köln. Ohne Aufwand.") | Required; Vitest: unique across pages; e2e: exactly one `<h1>` per page |
| **Local introduction** | `hero.lede` plus the city-specific section intros from the design (districts, local building types) | Required; Vitest: unique, and the lede names the city or one of its districts |
| **Internal links** | Per city: links to the Germany hub, to nearby live cities, and to the relevant site pages (§ below) | Required `links` field (phase 2.4); e2e: every internal link resolves with 200, none points to a non-live city |
| **City-specific copy** | Every section's copy is per city (phase 7.2: 30–70 % text similarity to Berlin after removing the city name) | Vitest: no two pages share a section intro word for word; the extraction script reports similarity per section for the PR |
| **Self-referencing canonical** | `<Seo>` builds it from the page's own path: `https://heidisystems.com/messdienstanbieter/<slug>` | e2e: canonical and `og:url` equal the page's own URL on every city; never the Germany page, never another city. A non-live city keeps its own canonical (with `noindex`) |

**Internal links per city** (the designs only link to on-page anchors, so this is a small addition to them):
- **To the hub:** the Germany page, from the footer "Städte" group (all pages) and from a "Messdienst in ganz Deutschland →" link in the map section.
- **To nearby cities:** a short line under the map info panel, "Auch in der Nähe: Düsseldorf, Duisburg, Essen", built from `links.nearby` (2–4 slugs, only live cities rendered). Plus the full "Städte" list in the footer.
- **To the site:** the duo cards' "Mehr erfahren" links go to real pages instead of `#faq` / `#start` (uVI → `/funktionen`, portfolio → `/funktionen`), and the FAQ pricing answer links to `/preise`. These targets are the same for every city; the nearby cities are what makes each page's link set its own.
- This is a deliberate deviation from the designs. Show the designer the "Auch in der Nähe" line before batch A (phase 7.6).

## Key decisions

| Topic | Decision |
|---|---|
| One template | The city pages and the Germany page are **one set of 13 section components**, filled from a **content module** that implements `RegionContent`: `cities/<slug>.ts` per city, and `pages/messdienstanbieter/content.ts` for Germany. **Confirmed by the 22 readable designs** (21 cities + Germany): they all have the same sections, markup and scripts, and the same nav, footer, references copy, partner logos and KPIs. What differs is data: the copy of every section, the example property, the map, the two photos and the logo order (phase 7.2). If a future design really differs in layout, that page gets its own section components |
| Allowed cities | A param matcher, `src/params/city.ts`, accepts only the slugs in `cities/index.ts` (`berlin` first, then the phase 7 cities as each one is finished). Unknown cities 404 through SvelteKit routing, with no load code. The index is tiny, because the matcher also runs in the browser |
| Loading content | `+page.ts` (universal load) imports the content module lazily (`import.meta.glob` for cities, a dynamic `import()` for Germany). Each page's content is its own JS chunk, and the large map data isn't serialized into the page's `data` payload a second time. `+page.server.ts` provides only the superforms and the action, and `+page.ts` merges its `data` |
| URLs | `/messdienstanbieter` and `/messdienstanbieter/berlin`. The site uses SvelteKit's default `trailingSlash: "never"`, so trailing-slash URLs redirect. Canonical, sitemap and links use the form without the slash |
| Header | The shared `LandingHeader`, with the **site's nav items** (the same decision as `/messdienstwechsel`). New props: `bannerText` ("Ab 1.1.2027 … Wir prüfen Ihren Berliner Bestand.") and `ctaLabel` ("Bestand prüfen"). See open question 1 |
| Footer | The shared `LandingFooter`. The design's "Städte" column becomes a new group fed from `cities/index.ts`: **only live city pages**, in the design's footer order, then "Ganz Deutschland" → `/messdienstanbieter`. Missing cities (Hamburg …) don't appear until they exist. It is shown on all landing pages. See open question 2 |
| Map | One `RegionMap` component for both: city districts (3 variants, phase 7.3) and the Bundesländer. City dots on the Germany map are **links** to the city pages, generated from the live entries in `cities/index.ts`, so they never point to a page that doesn't exist (phase 8) |
| Styling | The same as `/messdienstwechsel`: the design CSS is ported into scoped `<style>` blocks, tokens come from `tokens.css` (the `:root` is identical), and the design's breakpoints stay as they are (1240/1180/1100/1080/980/860/760/700/640/560/520) |
| Shared with `/messdienstwechsel` | LogoStrip, FAQ, FinalCta, SignupForm, DemoCard, the banner and `.easy` checks have **identical CSS** in both design families, so they are extracted and prop-driven |
| Interactivity | Runes and the existing attachments. The two confetti bursts share `confetti.ts` (canvas, no dependency). All motion respects `prefersReducedMotion()` |
| Form | The same `switchInquiry` schema and action as `/messdienstwechsel`, extracted into `$lib/server/switchSignup.ts`. Lead `source = "messdienstanbieter-<slug>"` (Germany: `"messdienstanbieter"`), webhook event `switchinquiry` with `page` and, on city pages, `city` in the payload. Button text "Bestand kostenlos prüfen" |
| Demo CTAs | "Demo buchen" and the demo card link to `#start`, as on `/messdienstwechsel`, because there's no booking URL. One constant (`DEMO_HREF` in `cta.ts`) switches every demo CTA at once when a URL exists |
| Dates in the visuals | The timeline (2026–2030, "Heute" marker) and the appointment dates ("Di, 14.10.", "Fr, 16.10." …) stay static, as in the designs. They are reviewed with the copy at the start of 2027 (go-live gate) |
| Copy errors in the designs | Fixed only with the content owner's sign-off, like KI-36 on the site. Found so far: the "can we switch before the contract ends?" FAQ answer starts with "Nein" in 9 designs although the question was reworded (phase 7.2) |
| Rendering | SSR with the `(landing-page)` cache header, not prerendered (form action and blog dropdown). Outside `[[preview=preview]]`: no Prismic content |

## Implementation notes (2026-10-05)

Phases 1–8 are built on `feat/landing-pages` (phase 1 on its own in `38701efa`). All 22 readable cities and the Germany page render; only Berlin is `live`, the others carry `noindex` (with a self-referencing canonical, `seo.keepCanonical`) until their go-live items (§6.4) are done. Defaults of the open questions below are what's built.

**Deviations from the plan, and why**
- **Content model (§2.4).** The analysis of all 23 designs showed that the phone values, the portfolio counts and table rows, the billing card figures and the hero card's "24 WE" are the same everywhere, so they stay in the components; only the addresses vary. `example` instead also holds what does vary: the AllInOne unit count (differs from the hero's 24), the appointment date, the tenant avatars and the second portfolio address. Card H3s that never vary are in the components. The map's copy is in `<slug>.ts`, its geometry in `<slug>-map.ts` (`MapGeometry`).
- **Berlin was generated by `scripts/extract-city.ts`** like every other city, not written by hand first. Instead of a diff against a hand-made module, it was checked against its design: every section has the design's height at all six widths.
- **Map frame.** The Berlin and München designs predate the later designs' map frame (legend space, 600 px height cap). The script detects this and sets `map.style.legacyFrame`, so both keep their own design.
- **SEO proposals** for Berlin and Germany exceeded the plan's own length limits (title 30–60, description 120–160) and were shortened. All titles, descriptions and nearby links are proposals for sign-off.
- **Uniqueness tests.** The designs reuse some section intros between cities (e.g. 9 variants of the NoWait text for 23 pages), so `cities.test.ts` enforces uniqueness only on what each design writes anew (title, description, H1, lede, map headline, service intro, final CTA, pricing answer).
- **Signup rate limit.** Raised to 50 per IP when `KITCHEN_SINK=1` (the e2e server), because both landing suites send more than 3 valid signups.
- **Germany map dots** get a transparent 12-unit hit circle, so they stay tappable on phones.

**For the content owner (before go-live)**
- FAQ answers that start with "Nein" although the question doesn't ask "Müssen …": Bochum, Bremen, Dortmund, Düsseldorf, Duisburg, Karlsruhe, Mönchengladbach, Stuttgart, Germany. Imported as designed.
- Ledes that name neither the city nor a district on its map: Berlin, München, Köln (no place) and Frankfurt, Düsseldorf, Hannover (a Stadtteil that isn't on the map). Listed in `cities.test.ts` (`LEDE_WITHOUT_MAP_PLACE`).
- The Germany map's fallback hints for states without a live city page (`FALLBACK_HINTS` in `pages/messdienstanbieter/map.ts`, new copy).
- The "Auch in der Nähe" line and "Messdienst in ganz Deutschland →" under the map info panel (designer review, see core requirement).

**Not done here:** Safari/Firefox/iOS and the manual keyboard walkthrough (the e2e covers keyboard on the map and tablists), Lighthouse on the Vercel preview (local numbers in §6.1), and every business item of §6.4 and §6.5.

**Re-running the extraction.** The designs aren't in the repo. Save one with the Artifact tool's `read` action and run `bun scripts/extract-city.ts <design.html> <slug>` (or `--germany`). Hand-written `seo` and `links` blocks are kept.

## Open questions (the default is built unless answered)

1. **Nav.** The designs have their own nav (Produkt, Lösungen, Kunden, Ressourcen, with links to future pages marked "bald"; right side Anmelden, Demo buchen, Bestand prüfen). *Default: the site nav, as on `/messdienstwechsel`, and only the CTA label changes. If the new nav is wanted, it becomes a separate task for all landing pages (and maybe the site header), not part of these pages.*
2. **Footer "Städte".** *Default: add the group to the landing footer only, listing live cities and "Ganz Deutschland". Adding it to the site footer is good for internal links, but it changes the live site and needs its own decision.*
3. ~~Other cities.~~ *Answered: yes, they follow the Berlin layout (all 21 readable designs checked). Every city design has a map, so `map` is required.*
4. **Duplicate billing demo.** Every design shows "Abrechnung erstellen" with progress and confetti twice: in the dark section (`OneClickBilling`) and in the first trio card (`TrioBilling`). *Default: build both, as designed, and flag it to the designer.*
5. **Lead source and Make.com.** *Default: `source = "messdienstanbieter-<slug>"` / `"messdienstanbieter"` and the existing `switchinquiry` event with `city`. Sales needs the Make.com `switchinquiry` route anyway (already in the `/messdienstwechsel` gate); it can branch on `city`.*
6. **References copy.** The quotes exist on the site (`PersonSwiper`), but the designs write "Geschäftsführer & Gesellschafter, Vitolus GmbH" where the site has "Geschäftsführer, Vitolus". *Default: the design's wording; the content owner confirms it in the gate.*
7. **Missing designs.** Hamburg, Nürnberg and Münster can't be read. *Default: skipped. They are added with the phase 7 script once the links work, without code changes. Their dots on the Germany map stay hidden until then.*
8. **Germany map hints that list city pages.** Some Bundesland hints name the city pages in that state ("Eigene Seiten: München, Nürnberg und Augsburg."), including the missing ones. *Default: generate that sentence from the live cities in the state; when a state has none, use the state's fallback hint (phase 8.3), which the content owner signs off.*

## Risks

- **Doorway pages.** Search engines treat many near-identical city pages as doorway pages. Each city must have real local content (districts, local examples, local references or team facts), not only a swapped city name. The content model makes that content required. The designs already do this: apart from the shared parts above, the copy of each section differs from Berlin's in wording, not only in the city name (eyebrows, headings, bullets, FAQ answers). The Germany page links to every city page and back, which gives the set a clear hub.
- **Unconfirmed claims.** The KPIs (92 %, 14 Tage, 1–2 h), "Heidi sitzt in Berlin", "In allen 16 Bundesländern", the fixed contact person, and the customer logos all need business confirmation before go-live (gate in phase 6).

## Out of scope

- The designs' new nav and the "bald" pages it links to (Fristenrechner, Portfolio-Scanner …).
- Hamburg, Nürnberg and Münster until their designs can be read.
- A/B testing and analytics events.
