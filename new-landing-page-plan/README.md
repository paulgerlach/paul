# Page `/hausverwaltung` ("Für Hausverwaltungen"): plan

A new dark page for Hausverwaltungen, the first of the "Kunden" segment pages (Hausverwaltung, Mietverwaltung, WEG-Verwaltung …). Under the huge word "Hausverwaltung" sit a lead ("Zähler, Ablesung und Heizkosten­abrechnung für Ihre Mietobjekte. Aus einer Hand.") and two CTAs, then a strip of three panels: a photo, a dashboard mock ("Ihre Liegenschaften." with four buildings whose status turns from "Ablesung läuft" to "Abrechnung fertig") and a second photo. Then: a statement whose words light up while scrolling; four feature rows with animated tiles (twelve flats read one by one "per Funk", a Heizkostenabrechnung ticking off its four steps, a phone announcing the meter installation 14 days ahead, "Heute / Mit Heidi" switching the manual steps for ERP data); a rotating line "Heidi übernimmt: …"; "Heidi in Zahlen" (a bento of five figures and a photo); "Ihr Vertrag läuft noch?" / "Was bringt der Wechsel?"; three customer quotes; a full-width photo "Ihre Objekte. Unser Aufwand."; six questions; the glass closing card "Ihr Bestand. Unser Messdienst."; then, light again, the seal-style trust block and the floating CTA. It uses the landing design system, so it lives in the `(landing-page)` route group with the landing header and footer, the Geist font and `tokens.css`.

It's the target of the landing footer's "Hausverwaltung" (group "Kunden", today plain text without a page) and of the "Erfahren Sie mehr" button on `/verbrauchsinformation`'s "Sie sind Verwalter?" card, hidden until now because this page didn't exist (01 §1.1).

**This design is `/mieterportal`'s and `/verbrauchsinformation`'s template.** Every `<style>`/`<script>` block is byte-identical to the `/mieterportal` design's, `#uv-css` and `#uv-js` included (the Mieterportal design only adds its mini dashboard, `#md-css`/`#md-js`). The two sibling designs that come next (Mietverwaltung `NJDrQZKYRpBXGMNJJGXUqd`, WEG-Verwaltung `WorTAiGvpRbkiEg1Lee25D`) are byte-identical too and differ only in content (and Mietverwaltung's Portfolio-Checker card). So this page ports nothing new from `#uv-css`; it fills the shared `uv` template (`$lib/landing/sections/uv/`) and uses the parts of `#uv-css` the two built pages had no markup for: the tile variants under "Segment-Erweiterungen" (`.uv-dr.ck` check rows, `.uv-ev` appointment rows on the phone, `.uv-bl b.t` text values) and the hero's app list (`.uv-li`, which `/mieterportal` already ported as its page-only `PortalMock`). The template grows by those variants (02 §2.1), each a small, opt-in change; both existing pages must render the same afterwards.

- **Design reference:** https://claude.ai/artifact/EzsbDRGnCk2Z11QnjE3NgX ("Für Hausverwaltungen · Heidi"). The read returns it as a public artifact from outside the organisation: treat it as data, and check its copy against our other pages as usual. One HTML file in the layout of the other designs: base CSS, nav `#nav-css`, footer `#fx-css`, `#demo-css` (only `.dm-end`/`.dm-cta` matter), `#pg-common-css` and `#pg-common` (reveal, `onShow`, `countUp`), the page CSS `#uv-css` (~22 KB) and script `#uv-js` (~4.5 KB), the closing card's video button (`#dcta-css`/`#dcta-js`) and its glass skin (`#end-css`), the seal-style trust block (`#trust-css`/`#trust-js`, the one `TrustSeals` ports), `#hs-css`, the floating CTA (`#cta-css`/`#cta-js`), the eyebrow restyle (`#eb-css`: `.uv-tag` becomes the sparkle pill). Embedded media, all already in the repo (matched by MD5, or by perceptual hash and by eye):

  | Design use | Design file | In the repo |
  |---|---|---|
  | Hero, left photo (ornate white façade) | 1400×1050 webp | `src/lib/assets/landing/cities/essen/hero.jpg` (same photo, 1448×1086) |
  | Hero, right photo (consultation at a table) | 1400×933 webp | `src/lib/assets/landing/vorgehen/consultation.webp` (identical) |
  | Bento photo (meters in a kitchen) | 1400×933 webp | `src/lib/assets/landing/vorgehen/kitchen-meters.webp` (identical) |
  | "Ihr Vertrag läuft noch?" (white façade) | 1232×928 webp | `src/lib/assets/landing/mieterportal/facade-white.webp` (identical) |
  | "Was bringt der Wechsel?" (Berlin façade with balconies) | 1400×933 webp | `src/lib/assets/landing/cities/berlin/references.jpg` (same photo, 1700×1133) |
  | "Ihre Objekte. Unser Aufwand." (building) | 1400×788 webp | `src/lib/assets/landing/mieterportal/building.webp` (identical) |
  | Closing card video button | 240×200 poster + webm + mp4 | not used: the card gets the signup form instead (as on `/verbrauchsinformation`) |
  | Floating CTA avatars | 160×160 webp ×2 | `region/avatar-1.webp`, `avatar-2.webp` (identical) |

  The design's links point to other design artifacts; their mapping is in [01 §1.5](01-route-and-content.md). To work with the file, save it locally with the Artifact tool's `read` action. It isn't in the repo.
- **Previous plans:** the `/schnittstellen` plan used to live in this folder (last version at `042eb570`). Before it came the `/verbrauchsinformation` plan (`3745dd0c`, the closest sibling: same template), the `/sicherheit` plan (`334b2c2d`), the `/dashboard` plan (`83433739`), the `/mieterportal` plan (`346e9174`, the template's origin), the `/funktionen` plan (`6a74f274`), the `/vorgehen` plan (`93952e28`), the `/selbstabrechnung` plan (`9d0bab9c`), the `/hilfe` plan (`3b70270e`), the `/karriere` plan (`d9e105d8`), the `/ueber-uns` plan (`7a777e92`), the `/upgrade-now` plan (`ddde6575`), the `/messdienstanbieter` plan (`be2c1feb`) and the `/messdienstwechsel` plan (`65470139`). Their open go-live gates are in [04-qa-and-go-live.md §4.5–4.18](04-qa-and-go-live.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Route, the footer and the other links to it, content, the deadline-dependent figure, SEO, signup wiring | S |
| 2 | [02-sections.md](02-sections.md) | The template's new variants (the hero list moved into `uv/`, check rows, appointment rows, text values, the shared deadline figure), then this page's 12 sections in their end state | M |
| 3 | [03-interactions.md](03-interactions.md) | The hero list's loop, the tiles' loops with the new variants, statement, rotator, numbers, reveal | S |
| 4 | [04-qa-and-go-live.md](04-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | M |

`ROUTE_HAUSVERWALTUNG` and the footer link come with the route in phase 1, so no link ever points at a missing page. The template changes of phase 2 §2.1 touch two finished pages: land them as their own commit, checked against `/mieterportal` and `/verbrauchsinformation` before any section of this page is added.

## Target structure

```
src/routes/(landing-page)/hausverwaltung/
├── +page.server.ts        # load: seo (noindex), landing chrome, the figures for `now`, the FAQ, the signup form; the signup action
└── +page.svelte           # <main class="hv"> with UvMain (sections 1–10) and Trust; the page's #hs-css and reveal styles

src/lib/landing/sections/uv/              # the shared dark template (changes in 02 §2.1)
├── ListMock.svelte        # NEW (moved): the app list with statuses, was /mieterportal's PortalMock
├── deadlineFigure.ts      # NEW: the bento's "31.12.2026" figure and its expired text for `now` (was in /verbrauchsinformation's content)
├── icons.ts  Icon.svelte  # + "building"
├── types.ts               # + ListEntry, DocRow (bar | check), PhoneTile.details, optional PhoneTile.bars
└── tiles/Doc.svelte  tiles/Phone.svelte  tiles/Bill.svelte   # check rows, appointment rows, 13 px text values

src/lib/landing/pages/mieterportal/sections/PortalMock.svelte   # becomes a thin wrapper around uv/ListMock

src/lib/landing/pages/hausverwaltung/
├── content.ts  content.test.ts          # every text and the example data, word for word; figures(now)
└── sections/
    ├── Hero.svelte*                     # uv/Hero size="lg" with the word "Hausverwaltung" and ListMock
    ├── Statement.svelte*  Rows.svelte*  Rotator.svelte*
    ├── Numbers.svelte*                  # uv/Numbers with the bento photo
    ├── Audience.svelte*  Quotes.svelte*  Picture.svelte*
    ├── Faq.svelte*                      # uv/Faq
    ├── CtaCard.svelte*                  # shared CtaCard tone="glass" with the SignupForm, id="start"
    ├── Trust.svelte*                    # TrustSeals
    └── FloatingCta.svelte*              # "Erstgespräch vereinbaren"
```

`*` marks a thin wrapper around a shared section, following the rule of the other landing pages: `+page.svelte` imports only from its own `sections/` folder. The page has no page-only component: everything it needs is in the template, which is what the two sibling pages will fill next.

## Implementation notes (2026-10-19)

Phases 1–4 are built: the plan (`1e372598`), the template's new variants (`d3471da0`), the route, content and links (`faf65552`), two template fixes found while comparing (`6cfc76c8`), the sections (`da7d9c90`), and `e2e/hausverwaltung.e2e.ts` (11 tests, stable over three repeats). The whole e2e suite passes (257 of 257 once the sitemap assertion was fixed, see below; signup tests included, against a throwaway Postgres container on :54322 with the `leads` table from `drizzle-kit push`). Compared with the design section by section at 1440, 1100, 980, 700 and 375 px: every section has the design's height except the expected ones (the closing card's form; the audience cards without buttons, 47 px each at ≤ 980 px). No overflow, hydration warnings or console errors at 375–1440 px (dev). Lighthouse not run yet. Open: the manual checks of §4.1 not ticked there, and the gate §4.4. Deviations from the plan:

- **The template commit came before the route commit.** The content uses the new shapes (`ListEntry`, check rows, `details`), so the shared types and tiles had to exist first; the route still came with the footer link in one commit.
- **Two template fixes, visible on the built pages** (`6cfc76c8`): at ≤ 980 px `uv/Hero`'s base-size line height (0.8) also overrode the `lg` word's 0.86, unlike the design (`.uv-word.lg` wins there); `/mieterportal`'s hero is 2–7 px taller now, as its design. The phone's notification title is `font-weight: 600` (the designs load Geist only up to 600, so their `<b>` renders at 600; ours at 700 wrapped "Montage Ihrer Funkzähler"), and its figure lost the `tabular-nums` no design sets ("Do, 9 bis 11 Uhr" wrapped). Before these fixes the template commit was checked as planned: `/mieterportal` and `/verbrauchsinformation` pixel-identical at 1440 and 375 px (production builds, reduced motion), SSR HTML equal apart from whitespace, timestamps and build hashes, their e2e specs passing.
- **`/verbrauchsinformation`'s "Erfahren Sie mehr" shows now** (→ this page), so its audience section is 47 px taller at ≤ 980 px; its e2e spec asserts the link.
- **Check-row class.** The design's `.uv-dr.ck` is `.dr.chk` in `Doc`: `.ck` is already the result line's tick circle there.
- **Dev-mode screenshots aren't stable for comparisons.** After a dev-server restart, `/mieterportal` at 375 px differed in unrelated places (the signup button, the trust pill's colour): CSS order in dev. Compare production builds (`bun run build && bun run preview`, or a worktree of the previous commit).
- **The sitemap test** matches the host plus the path: blog posts such as `funkzaehler-hausverwaltung` also end in "hausverwaltung</loc>".

### For the sibling pages (Mietverwaltung `NJDrQZKYRpBXGMNJJGXUqd`, WEG-Verwaltung `WorTAiGvpRbkiEg1Lee25D`)

Both designs are byte-identical to this one in every `<style>`/`<script>` block; only the content differs. Copy `pages/hausverwaltung/` (content, test, the thin wrappers, the route) and fill it. What's already in the template: `ListMock` (their hero lists: "4 Eigentümer" with "In Arbeit" → "Bereit für BKA", etc.; add an icon to `uv/icons.ts` if theirs differs), the units/objects grid (`Calendar` with any cell labels), `Doc` check rows *and* value rows (`{ label, value }` without `share` = the design's `.ck.v`, e.g. "Auszug 30.09."), `Phone` with bars or `details`, `Bill` text values, `deadlineFigure(now)`, `Numbers`, `Audience` (buttons hidden without `href`), `Quotes`, `Picture`, `uv/Faq`. Not yet in the template, add them there (opt-in, then recheck `/mieterportal`, `/verbrauchsinformation` and this page):

- **`Bill` with one row set per side** (`.uv-bl.xa` shows only on side a, `.xb` only on side b, green text values; Mietverwaltung's "Eigentümer A / Eigentümer B" tile, sum "2" → "1"). Today a row is `base` (both sides), `cut` (side a) or `ok` (side b, a tick or a value in ink): add kinds `a` / `b` with the design's colours.
- **The grid's `.tag` / `.pl` cells** (lime "tag" cells, placeholder cells without a tick), if a sibling draws them: check the markup's `class` on the `<span>`s.
- **Mietverwaltung's Portfolio-Checker** (`.pcm`, its own CSS and script, four buildings with thumbnails) sits in the first audience card instead of the photo: `uv/Audience` needs a `media` snippet per card (or the page wraps that card itself).
- Their FAQ answers mention "Fristenrechner" / "Portfolio-Checker" too: plain text until those pages exist, as here. The deadline figure, the quotes and the photos (check by MD5 against `src/lib/assets/`, most are the same files) are shared.
- The rows' count and tile order differ (Mietverwaltung: grid, doc with value rows, owner bill, phone with bars): the `Rows` snippet maps any kind, and `Row.tile` is free text.

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/hausverwaltung`, `ROUTE_HAUSVERWALTUNG` in `$lib/routes.ts` (phase 1). The footer's word, singular like the footer entry, short. Open question 1 |
| Route group | `(landing-page)`, outside `[[preview=preview]]`: a landing design, no Prismic content |
| Indexing | `seo.noindex = true` and out of the sitemap until the cutover, like the other new pages; at the cutover it's indexed and joins the sitemap (decision of 2026-10-17), so its go-live gate (§4.4) blocks the cutover PR (#440) |
| Header | The shared `LandingHeader` with `DEFAULT_CHROME` (the design's banner is the same text, "Mehr erfahren" → `/upgrade-now`) |
| Links to it | The footer's "Hausverwaltung" (Kunden) gets `href: ROUTE_HAUSVERWALTUNG`. Searched every saved design for this design's id `EzsbDRGnCk2Z11QnjE3NgX`: apart from the designs' nav and footer, only `/verbrauchsinformation`'s "Sie sind Verwalter?" card links here ("Erfahren Sie mehr", hidden there until now): it gets `href: ROUTE_HAUSVERWALTUNG` and its button shows (01 §1.1) |
| Shared template | Fill `uv/` and extend it where this design draws something the built pages didn't: the hero list moves from `/mieterportal` into `uv/ListMock` (three segment pages and `/mieterportal` use it), `Doc` gets check rows (a tick, or a short value in its place: the design's `.ck` / `.ck.v`), `Phone` gets appointment rows and optional bars, `Bill` gets the design's 13 px text values on rows shown on both sides, the bento's deadline figure moves into `uv/deadlineFigure.ts` (four pages show it). Every change is opt-in through content; `/mieterportal` and `/verbrauchsinformation` render the same (checked by their e2e specs and screenshots before/after, 02 §2.1) |
| Dark page | As on `/verbrauchsinformation`: `UvMain` is a dark wrapper inside `<main>` holding sections 1–10, the light `Trust` sits after it inside `<main>` (the design has it after `</main>`) |
| Signup and CTAs | As on `/verbrauchsinformation`: the design's hero carries `id="start"` but has no form; our `DEMO_HREF` is `#start`, so the closing card gets the shared `SignupForm` in place of the video button and carries `id="start"`. Submit label "Demo buchen". Every "Demo buchen" (hero, four rows) → `DEMO_HREF` with `focusSignup`. Hero "Mehr erfahren" → `#inhalt`, the rows' "Häufige Fragen" → `#faq`. Leads: `source: "hausverwaltung"`, `switchinquiry` with `page: "/hausverwaltung"`. Open question 2 |
| Audience buttons | The shared rule: a card's button shows only when its target exists. "Zum Fristenrechner" and "Zum Einsparrechner" have no page (both are plain text in the footer's "Ressourcen"), so both cards show no button for now. Open question 3 |
| Content | Every text and the example data in `content.ts`, word for word from the design (soft hyphens in "Heizkosten­abrechnung" kept). `content.test.ts` pins the H1, the four rows, the six questions and that the example data agree with each other (01 §1.2) |
| Deadline text | One text is wrong after 31.12.2026: the bento figure "31.12.2026 / Bis dahin müssen alle Zähler fernablesbar sein", the same figure as on `/verbrauchsinformation` (and the two sibling designs). It moves to `uv/deadlineFigure.ts` with its `expired` placeholder and is chosen in `load` through `isExpired(now)`. Nothing else depends on `now`; components never call `Date.now()` |
| FAQ | The shared `Faq` through `uv/Faq` (dark, all closed, heading left), `id="faq"`. Answer 3's "Schnittstellen" sits inside the sentence: an `<a>` to `ROUTE_SCHNITTSTELLEN` in the answer (as `/verbrauchsinformation`'s answer 6). Answer 5's "Fristenrechner" has no page: plain text (open question 3). Answer 6's trailing "Mehr zur uVI" is its `more` (→ `ROUTE_VERBRAUCHSINFORMATION`). FAQPage JSON-LD of the six questions |
| Closing card | The shared `CtaCard` `tone="glass"` (the design's `#end-css`) with the form, H2 "Ihr Bestand. Unser Messdienst.", text "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands." |
| Loops | Six, all through `loopInView` (only in view and in a visible tab, nothing under reduced motion): hero list 9 s (first pass after a full interval, as on `/mieterportal`), units grid 7.6 s, Abrechnung 7 s, phone 7 s, "Heute / Mit Heidi" 6.4 s, rotator 2.3 s. The design starts them once and never stops them |
| One-time entrances | The figures' count-up (92, 14, 1), the picture's zoom: the shared `Numbers` / `Picture`. The design also fades the hero list in on first view; the hero is on screen at load, so it's server-rendered in its end state without that entrance (as on `/mieterportal`) |
| Headings | One `<h1>`: the visible word "Hausverwaltung" is `aria-hidden`, the accessible text is the design's hidden "Messdienst für Hausverwaltungen mit Heidi". `<h2>` per row, for "Heidi in Zahlen", the two audience cards, the quotes, the FAQ and the closing card, then the trust block's. The mock's "Ihre Liegenschaften." stays a `<p>` as on `/mieterportal` (the app is `aria-hidden`). The `#hs-css` sizes apply to the H2s with an id (Zahlen, quotes, FAQ, trust), as on the two built pages |
| Styling | The CSS lives with the shared components; the variants' CSS comes from the design's "Segment-Erweiterungen" block. Breakpoints stay the design's (980, 620, plus `#hs-css` 1040/620). No class that is also a Tailwind utility (`CLAUDE.md`) |
| Rendering | SSR with the `(landing-page)` cache header. `now` only picks the deadline figure in `load` |

## Open questions (the default is built unless answered)

1. **Slug.** *Default: `/hausverwaltung`.* Alternatives: `/hausverwaltungen` (plural, the design's title "Für Hausverwaltungen"), `/messdienst-hausverwaltung` (the H1's words, for search). Decide together with the sibling slugs (`/mietverwaltung`, `/weg-verwaltung`) so the segment pages read alike.
2. **Closing card.** The design has a video button "Demo buchen / Mit Ihrem Ansprechpartner" to a booking page that doesn't exist. *Default: the signup form with the button "Demo buchen"* (as `/verbrauchsinformation`, `/mieterportal`, `/dashboard`). Once a booking URL exists, the card can go back to the video button.
3. **The Fristenrechner and the Einsparrechner.** The audience cards' buttons ("Zum Fristenrechner", "Zum Einsparrechner") and answer 5's inline "Fristenrechner" point at tools that don't exist. *Default: no buttons, answer 5 as plain text*, each back when its page exists. Alternatives: "Zum Fristenrechner" → `/messdienstwechsel` (the switch page, which explains the notice periods), "Zum Einsparrechner" → `/schnittstellen#doppelpflege` (a calculator, but of another saving), or `DEMO_HREF` for both.
4. **The hero list on load.** The design fades the four entries in and turns their statuses on first view. *Default: server-rendered finished ("Abrechnung fertig"), the 9 s loop starts after a full interval in view* (`/mieterportal`'s rule: no flash on hydration, LCP unaffected). Alternative: start on "Ablesung läuft" and play once after hydration.

## Risks

- **Every gate is on the cutover's critical path**, since every page is indexed after the cutover: this page's and the carried-over ones (04 §4.5–4.18). Mitigation: start the sign-offs early.
- **Changing a template two finished pages use.** The new variants and the moved hero list can change `/mieterportal` or `/verbrauchsinformation` unnoticed (class names, scoped CSS order, the heading reset's specificity, `loopInView` timing). Mitigation: its own commit; both pages' e2e specs pass unchanged (apart from the uVI audience button, which is meant to appear); screenshots at 1440 and 375 px with reduced motion before and after match; their SSR HTML differs only in Svelte's scoping classes.
- **The product as described.** "Zähler, Ablesung und Heizkostenabrechnung … Aus einer Hand", "Heidi verbaut Funkzähler und liest jede Wohnung aus der Ferne ab", "keine fehlenden Werte", "entsteht die Abrechnung nach HKVO für jede Einheit per Klick", "Kosten aus Ihren Rechnungen übernommen", "CO₂-Kostenaufteilung", "Heidi kündigt die Montage 14 Tage vorher an, mit einem Zeitfenster von 1 bis 2 Stunden", "Danach bekommen Ihre Mieter jeden Monat ihre Verbrauchsinfo", "Verbrauchsdaten und Abrechnungen landen direkt in Ihrem ERP- oder CRM-System", "Abrechnung als Datensatz", "Heidi übernimmt Ihre bestehenden Zähler sofort", "wertet sie sofort aus". Mitigation: listed in §4.4; align with the same promises on `/schnittstellen` (§4.5), `/verbrauchsinformation` (§4.6), `/mieterportal` (§4.9), `/messdienstwechsel` (§4.18).
- **Company claims and pricing.** "92 % der Montagen gelingen beim ersten Termin", "14 Tage", "1–2 h", "1 fester Ansprechpartner für Ihren ganzen Bestand" (the 14 days and 1–2 h confirmed on 2026-10-12, the 92 % is also on `/vorgehen` and `/funktionen`); "Abgerechnet wird pro tatsächlich installiertem Zähler plus Abrechnungspauschale. Ab 1.000 Einheiten erstellen wir ein Angebot für Ihren Bestand" (the 1.000-unit threshold appears nowhere else). Mitigation: §4.4.
- **Legal statements.** "Abrechnung nach HKVO", "so wie es § 6a HeizkostenV verlangt", "Bis dahin müssen alle Zähler fernablesbar sein", "Kürzungsrisiko". Mitigation: legal sign-off in §4.4, together with the same sentences on `/verbrauchsinformation` (§4.6).
- **Example data.** "24 Objekte", "Heizperiode 2025", the four buildings with their unit counts (Lindenallee 12 has 18 units here, as on `/dashboard`'s preview, but 36 on `/vorgehen` and `/dashboard`'s list), "Heizkostenabrechnung 2025 · Lindenallee 12 · 18 Einheiten", "WE 01–12", "Do, 9 bis 11 Uhr", "2. OG links". They read as current only until the 2026 bills (gate §4.4).
- **Photos reused from other pages.** All six photos already appear elsewhere (`/vorgehen`, `/mieterportal`, the Essen and Berlin city pages); the Essen hero and the Berlin references photo are presented there as local. Their licences are in the gates of those pages; the content owner should accept the reuse (gate §4.4).

## Out of scope

- The design's nav (Produkt / Lösungen / Kostenlose Checks / Plattform / Kunden / Ressourcen / Unternehmen & Partner, "Anmelden", "Angebot einholen"), its footer (other groups, the city list, the newsletter script `#fx-js`), its chat button, `#top-js`, `#mobfx` (`tokens.css` covers overflow), `#eb-js`, `#pillfx`.
- The closing card's video button (`#dcta-css`/`#dcta-js`, the poster and the videos): replaced by the form (open question 2).
- Dead code with no markup on this page: most of `#demo-css`, `#pg-common-css` (`.pg-*` isn't used here), `#pg-common`'s `seg`, `paintRange`, `confetti`, `tween`; in `#uv-css` the KPI boxes and bars (`/verbrauchsinformation`'s mock), `.uv-kick`, the grid's `.tag` / `.pl` cells and the bill's `.xa` / `.xb` rows (used by the sibling designs: their pages add them, see 04 §4.3), `.uv-mini` (no bars on this phone).
- The pages the design links to that don't exist: a booking page, the Fristenrechner, the Einsparrechner.
- The sibling pages Mietverwaltung and WEG-Verwaltung: separate plans after this one.
