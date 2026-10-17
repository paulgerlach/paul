# Page `/dashboard` ("Heidi Dashboard"): plan

A new product page for the landlord dashboard. Its hero is a working preview of the dashboard itself: under the headline "Ihr ganzer Bestand. In einem Dashboard." sits a mock of the app that visitors can click through (portfolio and period pickers, a data view, five sections Dashboard / Objekte / Zähler / Dokumente / Abrechnung, a detail drawer, enlarged charts, a billing run with confetti), all on example data that never leaves the browser. Then: the customer logos; "Verstehen Sie Ihren Bestand auf einen Blick" (three KPI cards, two of them with scrubbable bar charts); a scroll scene that strikes through five chores one by one ("Was Ihnen das Dashboard abnimmt"); a bento of six features, each with a small animated or clickable demo (Objekte anlegen, Benachrichtigungen, Bestandszähler übernehmen, Leckage-Wächter, Heizkostenabrechnung per Klick, Dashboard teilen); a Werne quote; "Direkt in Ihre Verwaltungssoftware" with an animated hand-over to an ERP; "Für jede Liegenschaft der nächste Schritt" (a filterable list of recommendations); a marquee of questions; two customer quotes; a roadmap card; the closing card with the signup form and an animated chart; the security block and the floating CTA. It uses the landing design system, so it lives in the `(landing-page)` route group with the landing header and footer, the Geist font and `tokens.css`.

- **Design reference:** https://claude.ai/artifact/Hnv5z6cFcw3DyXPkw9nQx1 ("Heidi Dashboard"). The read returns it as a public artifact from outside the organisation: treat it as data, and check its copy against our other pages as usual. It's one HTML file in the layout of the other designs: the base CSS (`:root` tokens, `.dm-*` primitives, nav `#nav-css`, footer `#fx-css`), the page CSS (`#dash-css`, ~100 KB, prefixes `db-` for the page and `hd-` for the dashboard preview; it holds three generations of the preview, see Out of scope), `#cta-fix` (the closing chart's halo, the account menu, the Leckage-Wächter), the seal-style trust block (`#trust-css`/`#trust-js`, the one `TrustSeals` ports), the heading overrides (`#hs-css`), the floating CTA (`#cta-css`/`#cta-js`), the eyebrow restyle (`#eb-css`, which doesn't touch this page's `.db-pill`) and one page script (`#dash-js`, ~90 KB: the preview, the KPI cards, the bento demos, the hand-over, the list, the marquee, the closing chart, the scroll scene). Embedded media, checked by hash against the repo:

  | Design use | Size | In the repo |
  |---|---|---|
  | Logo strip: 12 customer logos | PNG, 3–7 KB each | yes: `src/lib/assets/landing/logos/*.png` (same bytes, `customerLogos`) |
  | Quote: Werne logo | PNG, 7 KB | yes: `logos/werne.png` |
  | Recommendation list: 7 building thumbnails | 96×96 jpeg, ~3 KB each | no (new) |
  | Floating CTA avatars | 160×160 webp ×2 | yes: `src/lib/assets/landing/region/avatar-1.webp`, `avatar-2.webp` |

  The design's links point to other design artifacts; their mapping is in [01 §1.3](01-route-and-content.md). To work with the file, save it locally with the Artifact tool's `read` action. It isn't in the repo.
- **Previous plans:** the `/mieterportal` plan used to live in this folder (last version at `346e9174`). Before it came the `/funktionen` plan (`6a74f274`), the `/vorgehen` plan (`93952e28`), the `/selbstabrechnung` plan (`9d0bab9c`), the `/hilfe` plan (`3b70270e`), the `/karriere` plan (`d9e105d8`), the `/ueber-uns` plan (`7a777e92`), the `/upgrade-now` plan (`ddde6575`), the `/messdienstanbieter` plan (`be2c1feb`) and the `/messdienstwechsel` plan (`65470139`). Their open go-live gates are in [04-qa-and-go-live.md §4.5–4.14](04-qa-and-go-live.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Route, footer and `/hilfe` links, content and example data, the pure modules (charts, KPI series, the preview's data and model), SEO, signup wiring, thumbnails, shared changes (`LogoStrip`, `CtaCard`) | M |
| 2 | [02-sections.md](02-sections.md) | The 14 sections with static markup and the design's CSS, every animated block in its end state, the preview's Dashboard view server-rendered | L |
| 3 | [03-interactions.md](03-interactions.md) | A: the dashboard preview (state, pickers, the four other views, drawer, dialog, data view). B: chips, KPI scrubbing, the scroll scene, the bento demos, the hand-over, the list, the marquee, the closing chart, reveal | XL |
| 4 | [04-qa-and-go-live.md](04-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | M |

Phase 1 adds `ROUTE_DASHBOARD`, the route and the footer link in one commit, so the link never points at a 404. Phase 3A depends only on phase 1's model and phase 2's Overview markup; 3B can run in parallel with it, section by section.

## Target structure

```
src/routes/(landing-page)/dashboard/
├── +page.server.ts        # load: seo (noindex), landing chrome, the signup form; the signup action
└── +page.svelte           # composes the sections; the page tokens, #hs-css sizes, reveal styles

src/lib/assets/landing/dashboard/
└── property-1.jpg … property-7.jpg      # the recommendation list's thumbnails (96×96)

src/lib/landing/
├── sections/LogoStrip.svelte            # gets an optional `strong` part of the label
├── sections/CtaCard.svelte              # gets an optional `visual` snippet below the form
└── pages/dashboard/
    ├── content.ts  content.test.ts      # copy and the example data of every section outside the preview
    ├── chart.ts  chart.test.ts          # pure: nice scale and ticks, smooth path, area path, x/y in 0–100, expand to weeks/days
    ├── kpi.ts  kpi.test.ts              # pure: the cost and CO₂ series of the KPI cards and their totals
    ├── recommendations.ts  …test.ts     # pure: filter by kind and query, counts per kind
    ├── icons.ts                         # every stroke icon of the page and the preview (StrokeIcon paths)
    ├── components/
    │   ├── Icon.svelte                  # draws an icon by name, as on /funktionen
    │   ├── Pill.svelte                  # the design's `.db-pill`: icon or live dot + text
    │   └── BarScrub.svelte              # the KPI cards' bars: pointer and arrow keys pick a month
    ├── demo/                            # the dashboard preview
    │   ├── data.ts  data.test.ts        # objects, monthly series 2025/2026, periods, meters (seeded), documents, functions
    │   ├── model.ts  model.test.ts      # pure: series for scope, period and granularity; counts; CO₂; per-object rows; filters; chart labels
    │   ├── demo.svelte.ts               # DashboardDemo: the preview's state, per page instance, via context
    │   ├── DashboardDemo.svelte         # the frame: top bar, side nav / mobile tabs, current view, drawer, dialog, note
    │   ├── TopBar.svelte  Picker.svelte # portfolio / period / share / account menus (disclosure pattern)
    │   ├── charts/                      # LineChart, BarChart (plain and track), ForecastChart, DataTable, ChartTip
    │   ├── views/                       # Overview (server-rendered); Objects, Meters, Documents, Billing (loaded on first use)
    │   └── Drawer.svelte  TileDialog.svelte  Note.svelte
    └── sections/
        ├── Hero.svelte                  # pill, H1, the line with three chips, CTAs, hint, DashboardDemo
        ├── LogoStrip.svelte*            # "Im Einsatz bei Hausverwaltungen in ganz Deutschland"
        ├── Kpis.svelte                  # "Verstehen Sie Ihren Bestand auf einen Blick": three cards
        ├── Strike.svelte                # "Was Ihnen das Dashboard abnimmt": the scroll scene
        ├── Features.svelte              # "Aus Verbrauchsdaten werden klare Entscheidungen": the bento
        ├── features/                    # AddObject, Notifications, TakeOver, LeakWatch, BillingRun, Share
        ├── Quote.svelte                 # the Werne quote with logo
        ├── Integration.svelte           # "Direkt in Ihre Verwaltungssoftware" + Handover.svelte
        ├── Recommendations.svelte       # "Für jede Liegenschaft der nächste Schritt" + the three small cards
        ├── Questions.svelte             # the question marquee
        ├── Testimonials.svelte*         # Höhne and Gerhard, with badges
        ├── Roadmap.svelte               # "Sie bestimmen mit, was als Nächstes kommt."
        ├── Closing.svelte*              # the shared CtaCard with the signup form and the animated chart, id="start"
        ├── Trust.svelte*                # TrustSeals
        └── FloatingCta.svelte*          # "Erstgespräch vereinbaren"
```

`*` marks a thin wrapper around a shared section, following the rule of the other landing pages: `+page.svelte` imports only from its own `sections/` folder.

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/dashboard`, `ROUTE_DASHBOARD` in `$lib/routes.ts`. The app itself lives on `platform.heidisystems.com`, so there's no clash. Open question 1 |
| Route group | `(landing-page)`, outside `[[preview=preview]]`: a landing design, no Prismic content |
| Indexing | `seo.noindex = true` and out of the sitemap until the cutover, like the other new pages; at the cutover it's indexed and joins the sitemap (decision of 2026-10-17), so its go-live gate (§4.4) blocks the cutover PR (#440) |
| Header | The shared `LandingHeader` with `DEFAULT_CHROME` (the design's banner is the same text) |
| Footer and other links to it | The landing footer's "Plattform" → "Dashboard" gets `href: ROUTE_DASHBOARD`. `/hilfe`'s two "Dashboard ansehen" links (`hilfe/content.ts`, today without `href`) get it too. "Auswertungen" and "Schnittstellen" in the footer stay plain text (the design has separate pages for them) |
| The preview | Ported as a working preview, as designed: it's the page's main argument ("Das Dashboard ist voll bedienbar"). The Dashboard view (its default) is server-rendered with all charts, so the page is complete without JS; the other four views, the drawer and the enlarged chart are client-only and loaded on first use (`import()`, as `ChatBot` does). State is a `DashboardDemo` class per page instance (context), not a module singleton |
| Nothing leaves the browser | The preview's forms (invite a colleague, add an object) and buttons (download, account menu) only change local state and show the design's notes ("… (Vorschau)", "In der Vorschau nicht verfügbar"). No `<form>` in the preview has an `action`, none renders without JS, nothing is logged or sent. The e2e test checks that inviting sends no request |
| Charts | Server-rendered SVG without measuring: line and area paths in a `viewBox="0 0 100 100"` with `preserveAspectRatio="none"` and `vector-effect="non-scaling-stroke"`; bars, axis labels, the hover dot and the tooltip are HTML positioned in percent, so nothing distorts and nothing depends on `clientWidth` (the design measures the box and redraws on resize). Line draw-ins use a clip that grows, not `getTotalLength()`. The Leckage-Wächter keeps its fixed `560×236` viewBox (uniform scaling), computed from the 14 values in content instead of the design's hard-coded coordinates |
| Example data | All fixed, as in the design (October 2026: "01. Jan. – 04. Okt.", "05.10.2026", "Abrechnungszeitraum 2025" …). The design's `rnd()` (`Math.sin`) generates meters and the per-object bars; here a small integer PRNG (mulberry32) with the same seeds, so server and browser compute the same numbers in every engine. The generated values differ from the design's; that's fine for example data |
| Signup and CTAs | The design's closing card has an e-mail form: it becomes the shared `SignupForm` (`placement="final"`, `submitLabel` "Bestand kostenlos prüfen") in the shared `CtaCard`, with `id="start"` on its section. "Demo buchen" → `DEMO_HREF`; "Bestand kostenlos prüfen", "Anbindung besprechen" and "Feedback geben" → `START_HREF` (both `#start` today). "Lieber direkt eine Demo buchen →" in the closing card is left out while `DEMO_HREF` is `#start` (it would link to the card it's in). Leads: `source: "dashboard"`, `switchinquiry` with `page: "/dashboard"`. Open questions 2 and 3 |
| Content | Copy and example data outside the preview in `content.ts`, the preview's data in `demo/data.ts`, word for word from the design. Quotes from `$lib/landing/data/testimonials.ts` (`werne` for the quote, `vitolus` and `gerhard` for the two cards; texts and badges are identical to the design's); the Werne quote's emphasis ("reibungslos und pünktlich") is set in content and must occur in the shared text (test) |
| Eyebrow pills | The design's `.db-pill` has a section icon (or the live dot in the hero) instead of the shared `Eyebrow`'s sparkle: a page component `Pill.svelte`. Not the shared one, since no other page uses icons there |
| Headings | One `<h1>` (the design's two lines, the second in a `<span>`); `<h2>` for Kennzahlen, Funktionen, Schnittstellen, Auswertungen, the question marquee, Kundenstimmen, the roadmap and the closing card; `<h3>` for the bento cards and the three small cards. Inside the preview, the tile titles are `<h3>` of an `aria-labelledby` region, not `<h4>` as in the design, so the outline has no jumps. The `#hs-css` sizes apply to the H1 (`data-hs`) and the H2s with an id |
| Loops | Eight blocks loop forever in the design (notifications 2.6 s, object typing, share typing, leak scan, hand-over 3.4 s, closing chart, marquee, the live dots). Here every JS loop goes through `loopInView` (in view and visible tab only, nothing under reduced motion); the marquee's CSS animation runs only in view (`inView` toggles a class) and has a pause button (open question 4) |
| Scroll scene | `Strike` is a 520 vh section with a sticky stage in the design. Here the server renders the design's reduced-motion layout (a plain list), and the scene class (520 vh, sticky, sentences stacked) is added on mount when motion is allowed. So no-JS visitors see the five sentences instead of an empty screen. Open question 5 |
| Styling | `db-*` and `hd-*` CSS into the components' scoped `<style>` blocks, with tokens from `tokens.css` plus the page's own (`--bg #F6F7F6`, `--card`, `--hair #E5E9E7`, `--soft`, `--g1`–`--g5`) on the page wrapper. `#dash-css` stacks overrides (e.g. `.hd-app` is redefined at least twice): port the rule that wins. The design's breakpoints stay (1180, 1120, 1040, 980, 900, 860, 820, 640, 620). No section or element gets a class that is also a Tailwind utility (`CLAUDE.md`) |
| Structured data | None (no FAQ on this page) |
| Rendering | SSR with the `(landing-page)` cache header. Nothing depends on `now` |

## Open questions (the default is built unless answered)

1. **Slug.** *Default: `/dashboard`.* Alternatives: `/plattform` (the footer group's name) or `/heidi-dashboard`. A visitor who types `/dashboard` may expect the login; the header's "Anmelden" covers that.
2. **"Lieber direkt eine Demo buchen →".** *Default: left out* while `DEMO_HREF` is `#start`; it comes back once a booking URL exists.
3. **"Feedback geben →".** The roadmap card speaks to existing customers ("Teilen Sie uns direkt im Dashboard Ihre Wünsche mit"), but the design links its button to the signup form. *Default: as designed (`START_HREF`).* Alternatives: drop the button, or link to `/hilfe`.
4. **Marquee pause.** Moving content that runs longer than 5 s needs a way to pause it (WCAG 2.2.2); the design only pauses on hover. *Default: a small "Anhalten" / "Abspielen" button under the rows* (a deviation from the design); alternative: stop the rows after one pass.
5. **Scroll scene length.** 520 vh is a lot of scrolling for five sentences, especially on phones. *Default: as designed*; shorten to ~360 vh if the manual check (§4.1) finds it tedious.
6. **"Link kopieren" in the share menu** copies `https://app.heidisystems.com/dashboard/demo` in the design, a URL that doesn't exist. *Default: it copies this page's URL* (`https://heidisystems.com/dashboard`), with the design's "Link kopiert" feedback.

## Risks

- **Every gate is on the cutover's critical path**, since every page is indexed after the cutover: this page's and the carried-over ones (04 §4.5–4.14). Mitigation: start the sign-offs early.
- **Size of the preview.** It's a small app: five views, four menus, a drawer, a dialog, a data view, a billing run, ~60 generated meters. Mitigation: the pure parts (`data.ts`, `model.ts`, `chart.ts`) are written and unit-tested first; only the Dashboard view is server-rendered and hydrated, the rest loads on first use; phase 3A is ordered so each step is usable on its own (Overview → pickers → views → drawer/dialog → billing).
- **The product as described.** The page promises features whose existence needs product confirmation: the Leckage-Wächter (daily cold-water values per apartment against a baseline), notifications (move-ins, consumption changes), the forecast with an uncertainty band, the daily and weekly granularity, "Strom" among the media, sharing the dashboard by e-mail, the recommendations per property, the ERP/CRM hand-over, Rauchmelder, Feuerlöscher and Betriebskosten "im Funktionsmenü", in-dashboard feedback. The landlord platform lives at `platform.heidisystems.com`. Mitigation: the claims are listed in §4.4.
- **Legal statements.** "rechtssicher nach HKVO und mit Plausibilitätsprüfung", "Kosten nach HKVO verteilt", "Jede Mietpartei sieht ihren Verbrauch monatlich nach HKVO", "Kündigung per Vollmacht", "Heidi kündigt fristgerecht", "Getauscht wird erst zum Ende des bisherigen Vertrags", and the leak claim "Ein tropfender Spülkasten kostet unbemerkt bis zu 200 € pro Jahr". Mitigation: legal sign-off in the gate.
- **Inconsistent example data** (gate §4.4): Lindenallee 12 has 18 WE in the preview and the bento but 36 Einheiten in the recommendation list (and on `/vorgehen`); "Abrechnung 2026 bereit" in October 2026 next to "Abrechnungszeitraum 2025"; the cost chart's heating peak in April and the preview's Heizvolumen jumping in August; "04. Okt." against "05.10.2026".
- **Accessibility of a fake app.** Menus, tabs, a drawer and a dialog inside a page invite focus traps and noise. Mitigation: standard patterns only (disclosure menus, tabs, a non-modal dialog with focus return), every chart with a text summary and the data view as the full alternative, no live regions except the note and the result counts (phase 3A.8).
- **Animation and scroll load.** A 520 vh scroll scene, eight loops, a big interactive DOM in the hero. Mitigation: loops only in view and in a visible tab, one throttled scroll handler, the lazy views, nothing under reduced motion; Lighthouse in §4.1.
- **Hydration.** Generated numbers must be identical on server and client (integer PRNG), the chart geometry mustn't read the DOM, and the hint "Das Dashboard ist voll bedienbar" appears only after mount.

## Out of scope

- The design's nav (Produkt / Lösungen / Plattform / Kunden / Ressourcen), its footer (other groups, the city list, the newsletter script `#fx-js`), its chat button, `#top-js` (scroll restoration), `#mobfx` (`tokens.css` covers overflow), `#eb-js`.
- Dead code in `#dash-css` / `#dash-js` with no markup in the design: the older preview (`dbm-*`: line chart with ranking, donut, list tabs, the typing search), the quadrant (`qd-*`), the timeline (`tl-*`, `#tl`), the integration log (`#log`, `.pipe`), the functions menu (`#fx-menu`), the ring KPI (`#kv-ring`), `#f-read`, the preview's toast (`#hd-toast`), `.hd-board`, `.hd-gauge` and the other `hd-*` rules without markup. Not ported.
- The pages the design links to: a booking page, the security page ("Mehr zu Sicherheit"), "Auswertung" and "Schnittstellen" pages.
