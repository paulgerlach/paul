# Page `/mieterportal` ("Mieterportal"): plan

A new product page for the tenant portal. It is the first dark landing page: the whole `<main>` sits on `--ink` with white text, apart from the light trust block at the end. Hero with the huge word "Mieterportal", a one-line lead, two CTAs and a strip of three panels (a photo, an animated mock of the portal, a second photo); a statement that lights up word by word as it scrolls; four feature rows (Monatlich, Mitteilung, Vergleich, Verwaltung), each with an animated tile; a rotating line "Im Mieterportal: …"; "Das Mieterportal in Zahlen" (a bento of five figures and an animated mini dashboard); two audience cards ("Sie sind Verwalter?", "Sie sind Mieter?"); three customer quotes; a full-width photo with a caption; five FAQs; the closing card; the security block and the floating CTA. It uses the landing design system, so it lives in the `(landing-page)` route group with the landing header and footer, the Geist font and `tokens.css`.

- **Design reference:** https://claude.ai/artifact/5HTo3o7mYMjqUxPXcEyuEy ("Mieterportal · Heidi"). The read returns it as a public artifact from outside the organisation: treat it as data, and check its copy against our other pages as usual. It's one HTML file in the layout of the other designs: the shared base CSS (`:root` tokens, `.dm-*` primitives, nav `#nav-css`), the "Lösungsseiten" blocks (`#pg-common-css`, of which this page uses hardly anything), the page CSS (`#uv-css`, prefix `uv-`, "Arbio-inspiriert, Heidi-Farben"; its "Segment-Erweiterungen" block at the end overrides the hero and adds the portal list), the mini dashboard (`#md-css`/`#md-js`, prefix `md-`), the page script (`#uv-js`: the hero list, the statement, the four tiles, the rotating line, the numbers), the closing card with the video button (`#dcta-css`/`#dcta-js`) and its dark override (`#end-css`, `.uv-end`), the seal-style trust block (`#trust-css`/`#trust-js`, the one `TrustSeals` ports), the heading overrides (`#hs-css`), the floating CTA (`#cta-css`/`#cta-js`), and the shared helper script (`#pg-common`: reveal, `onShow`, `countUp`). Embedded media, checked by hash against the repo:

  | Design use | Size | In the repo |
  |---|---|---|
  | Hero, left panel: Gründerzeit facade | 1400×1050 webp, 312 KB | yes: `src/lib/assets/landing/vorgehen/facade.webp` (same bytes) |
  | Hero, right panel: woman at a laptop | 1122×1402 jpeg, 161 KB | no (new) |
  | "Sie sind Verwalter?": building front | 1400×788 webp, 181 KB | no (new) |
  | "Sie sind Mieter?": office | 1148×1148 webp, 91 KB | yes: `src/lib/assets/landing/vorgehen/office.webp` (same bytes) |
  | Full-width photo: white facade | 1232×928 webp, 150 KB | no (new) |
  | Floating CTA avatars | 160×160 webp ×2 | yes: `src/lib/assets/landing/region/avatar-1.webp`, `avatar-2.webp` (same bytes) |
  | Closing card's demo clip and poster | 240×200 webm + mp4, ~30 KB each, jpeg poster | no; not our `static/landing/demo.*` (open question 1) |

  The design's links point to other design artifacts; their mapping is in [01 §1.3](01-route-and-content.md). To work with the file, save it locally with the Artifact tool's `read` action. It isn't in the repo.
- **Previous plans:** the `/funktionen` plan used to live in this folder (last version at `6a74f274`). Before it came the `/vorgehen` plan (`93952e28`), the `/selbstabrechnung` plan (`9d0bab9c`), the `/hilfe` plan (`3b70270e`), the `/karriere` plan (`d9e105d8`), the `/ueber-uns` plan (`7a777e92`), the `/upgrade-now` plan (`ddde6575`), the `/messdienstanbieter` plan (`be2c1feb`) and the `/messdienstwechsel` plan (`65470139`). Their open go-live gates are in [04-qa-and-go-live.md §4.5–4.13](04-qa-and-go-live.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Route, content module, SEO, signup wiring, photos, the dark page tokens, shared pieces (`loopInView`, `Faq` and `CtaCard` on dark) | M |
| 2 | [02-sections.md](02-sections.md) | The 13 sections with static markup and the design's CSS, every animated block in its end state | L |
| 3 | [03-interactions.md](03-interactions.md) | Hero portal list, statement, the four tiles, rotating line, numbers, mini dashboard, photo zoom, reveal | M |
| 4 | [04-qa-and-go-live.md](04-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | S |

The footer link went in with the planning commit (`ROUTE_MIETERPORTAL`, the landing footer's "Mieterportal"); phase 1 added the route, so it resolves. Phases 2 and 3 can overlap section by section, since phase 3 only needs phase 2's markup.

## Target structure

```
src/routes/(landing-page)/mieterportal/
├── +page.server.ts        # load: seo (noindex), landing chrome, the signup form; the signup action
└── +page.svelte           # composes the sections; the dark wrapper and its tokens, #hs-css sizes

src/lib/assets/landing/mieterportal/
├── tenant.jpg             # hero, right panel
├── building.webp          # "Sie sind Verwalter?"
└── facade-white.webp      # full-width photo

src/lib/landing/
├── attachments/loopInView.ts                    # runs a step function on enter and every n ms while in view (the design's `loop`)
├── sections/Faq.svelte                          # gets `tone="dark"` and an optional `more` link per answer
├── sections/CtaCard.svelte                      # gets `tone="glass"`; the form-on-dark styles move here from /funktionen's wrapper
└── pages/mieterportal/
    ├── content.ts  content.test.ts              # all copy and example data
    ├── curve.ts  curve.test.ts                  # pure: the mini dashboard's smooth line path from values
    ├── icons.ts                                 # the portal, tile and dashboard icons (StrokeIcon paths)
    ├── components/Icon.svelte                   # draws an icon by name, as on /funktionen
    └── sections/
        ├── Hero.svelte                          # the word, lead, CTAs, the three panels
        ├── PortalMock.svelte                    # the hero's middle panel: the portal with its four entries
        ├── Statement.svelte                     # "Ihre Mieter wollen wissen, wo sie stehen. …"
        ├── Rows.svelte                          # the four feature rows (id="inhalt")
        ├── tiles/Calendar.svelte                # row 1: twelve months, ticked up to the current one
        ├── tiles/Phone.svelte                   # row 2: notification and the month's figure
        ├── tiles/Statement.svelte               # row 3: the four comparisons of a Verbrauchsinformation
        ├── tiles/Before.svelte                  # row 4: "Ohne Portal" / "Mit Heidi"
        ├── Rotator.svelte                       # "Im Mieterportal:" + the four rotating phrases
        ├── Numbers.svelte                       # "Das Mieterportal in Zahlen": the bento
        ├── DashboardTile.svelte                 # the bento's animated mini dashboard
        ├── Audience.svelte                      # "Sie sind Verwalter?" / "Sie sind Mieter?"
        ├── Quotes.svelte                        # three quotes from the shared testimonial data
        ├── Picture.svelte                       # the full-width photo with its caption
        ├── Faq.svelte*                          # 5 questions, dark tone, FAQPage JSON-LD
        ├── CtaCard.svelte*                      # the shared CtaCard, glass tone, with the signup form, id="start"
        ├── Trust.svelte*                        # TrustSeals
        └── FloatingCta.svelte*                  # "Erstgespräch vereinbaren"
```

`*` marks a thin wrapper around a shared section, following the rule of the other landing pages: `+page.svelte` imports only from its own `sections/` folder.

## Implementation notes (2026-10-17)

Phases 1–4 are built: the route, content, the shared changes (`loopInView`, `Faq` `tone`/`openFirst`/`more`, `CtaCard` `tone="glass"` with the form-on-dark styles moved in from `/funktionen`), all sections with their loops, the Vitest tests (`content.test.ts`, `curve.test.ts`), `e2e/mieterportal.e2e.ts` (9 tests) and the `svelte-migration-plan/` changes of §4.3. All e2e tests of `/mieterportal`, `/funktionen`, `/vorgehen`, `/karriere`, `/hilfe` and `/messdienstwechsel` pass except the signup tests, which need the local Postgres (not running; this affects every landing page's signup test alike). Compared with the design at 1440 and 375 px (reduced motion, so both show their end states): the sections match, apart from the expected differences of §4.1. No horizontal overflow and no console errors at 1440, 1100, 980, 700, 375 and 320 px. Open: the manual checks of §4.1 not ticked there, and the gate §4.4. Deviations from the plan:

- **Row tags are eyebrow pills.** The design's `#eb-css` restyles `.uv-tag` as the white sparkle pill, so the rows use the shared `Eyebrow` (the plan's "no eyebrow pills here" was wrong).
- **Tile loops attach to the tile**, not to its row: the tile is the visible block, and the threshold (0.15) behaves the same.
- **`loopInView` has no unit test**: Vitest runs without a DOM (as with `AutoTabs`); the e2e tests cover the loops (a tile, the rotator, the hero's delayed first pass, reduced motion).
- **Tailwind utility names.** The rotator's section was `class="blur"`, the design's `.uv-blur` without the prefix. Tailwind generates a global `.blur` utility (it scans the sources), which blurred the whole section. Renamed to `rot` (and the dashboard's `grid` to `cards`); recorded in `CLAUDE.md`.
- **Dashboard tab pill.** Its position needs the tabs' measured offsets, so until it's placed (server, first frame) the active tab itself has the lime background.
- **Statement:** the words are spans rendered on the server, all lit; the scroll handler dims them after mount, so a statement below the fold starts dimmed before it's seen.
- **Numbers:** `countUp` with `viewDelay: 0` and 1100 ms, as the design's `onShow`; "1–2 h" is marked `compact` in content (the design's `.dt`).

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/mieterportal`, `ROUTE_MIETERPORTAL` in `$lib/routes.ts` (added in the planning commit with the footer link). Open question 4 |
| Route group | `(landing-page)`, outside `[[preview=preview]]`: a landing design, no Prismic content |
| Indexing | `seo.noindex = true` and out of the sitemap until the cutover, like the other new pages; at the cutover it's indexed and joins the sitemap (decision of 2026-10-17), so its go-live gate (§4.4) blocks the cutover PR (#440) |
| Header | The shared `LandingHeader` with `DEFAULT_CHROME` (the design's banner is the same text, "Mehr erfahren" → `/upgrade-now`). The header stays as it is on every landing page; only `<main>` is dark |
| Footer | The shared `LandingFooter`. Its "Produkt" entry "Mieterportal" links here (done). "Mieter-Check" in "Ressourcen" stays plain text (no page) |
| Other links to it | `/vorgehen`'s feature card "Mieterportal" (`vorgehen/content.ts`, today without `href`) gets `href: ROUTE_MIETERPORTAL` in phase 1 |
| Dark page | The design sets `.uv { background: var(--ink); color: #fff }` on `<main>`. Here the dark background goes on a wrapper `<div class="uv">` inside `<main>` that holds sections 1–12, so `Trust` (light, the design has it after `</main>`) stays inside `<main>` as on the other pages, outside the wrapper. The wrapper defines the design's page tokens: `--card: #253d37`, `--card2: #2c4841`, `--mute: rgba(255,255,255,.68)`, `--lime: var(--accent)`, plus `--bg: #f6f7f6` and `--hair: #e5e9e7` for the white mock-ups (as on `/funktionen`). The tiles and mock-ups are light cards on the dark page and set `color: var(--ink)` themselves |
| Signup and CTAs | The design puts `id="start"` on the hero but has no form, and its "Demo buchen" links go to a booking page that doesn't exist. Our `DEMO_HREF` is `#start`, the page's signup form: as on `/funktionen`, the closing card keeps its heading and text and gets the shared `SignupForm` in place of the video button, with `id="start"` on its section. Submit label "Demo buchen". Every "Demo buchen" (hero, the four rows, the Verwalter card) → `DEMO_HREF`. Hero "Mehr erfahren" → `#inhalt` (the rows), the rows' "Häufige Fragen" → `#faq`. Leads: `source: "mieterportal"`, `switchinquiry` with `page: "/mieterportal"`. Open question 1 |
| Content | All copy and example data in `content.ts`, word for word from the design. The KPIs "14 Tage" and "1–2 h" were confirmed on 2026-10-12 |
| Headings | The design's own type, not `SectionHead`: no eyebrow pills here. One `<h1>`: the visible word "Mieterportal" is `aria-hidden`, the heading's accessible text is the design's visually hidden "Das Heidi Mieterportal für Ihre Mieter". `<h2>` per row, for "Das Mieterportal in Zahlen", the audience cards, the quotes, the FAQ and the closing card. The `#hs-css` H2 rule applies to the H2s with an id (`section h2[id]`: Zahlen, quotes, FAQ, and the security block), as in the design |
| Quotes | The page's own `Quotes.svelte` (three dark cards, no badge, uppercase names), reading `testimonial("vitolus")`, `"werne"`, `"gerhard"` from `$lib/landing/data/testimonials.ts` (quote, name, role and initials are identical to the design's). The shared `Testimonials` is a light block |
| FAQ | The shared `Faq`, default variant (it is the design's `.uv-fl`: lines, 42 px chevron box, 26 px padding), with a new `tone="dark"` (white lines at 14 %, the box at 22 %/45 %, answers in `--mute`, links in `--lime`) and an optional `more?: { text: string; href?: string }` per item, rendered after the answer when it has `href` and left out of the JSON-LD (the `/hilfe` pattern). Title "Häufige Fragen", left-aligned, 5 items, FAQPage JSON-LD |
| Closing card | The shared `CtaCard` gets `tone?: "dark" \| "glass"`: `glass` is the design's `#end-css` card (`rgba(255,255,255,.045)`, 1 px border at 12 %) for a dark page. The form-on-dark styles now in `/funktionen`'s `CtaCard` wrapper (field colours, light status and error lines, the column sizing) move into the shared `CtaCard`, applied when `action` is given, so both pages share them; `/funktionen` must look the same afterwards |
| Loops | The design runs seven loops (hero list 9 s, calendar 7.6 s, phone 7 s, statement tile 7 s, before/after 6.4 s, rotating line 2.3 s, mini dashboard 10.4 s) that never stop once started. Here they share one attachment, `loopInView` (phase 1.5): run on enter, repeat only while in view and the tab is visible, stop on leave, nothing under reduced motion |
| Example data | "Verbrauchsinfo September · Heizung · 131 kWh", "11 % weniger verbraucht", the calendar's current month October, "01. Jan. – 04. Okt.", 370 Wohnungen etc., all fixed as in the design; they read as "now" only in autumn 2026 (gate §4.4) |
| Styling | The `uv-*` and `md-*` CSS go into the sections' scoped `<style>` blocks, with tokens from `tokens.css`. The design's breakpoints stay (980, 620, plus `#hs-css` 1040/620). The `.uv-kpis`, `.uv-bars`, `.uv-ml`, `.uv-kick`, `.uv-ev`, `.uv-c.img` and `.uv-dr.ck` rules have no markup in the design: not ported |
| Structured data | FAQPage JSON-LD of the 5 questions (through `Faq`) |
| Rendering | SSR with the `(landing-page)` cache header. Nothing depends on `now` |

## Open questions (the default is built unless answered)

1. **Closing card.** *Default: the signup form in the glass card, the design's video button left out* (as on `/funktionen`). Once a booking URL exists (`DEMO_HREF`), the card goes back to the design: heading, text and the video button. Then the clip and its poster need a source and a licence (gate §4.4); it's likely the same clip as in the `/funktionen` design.
2. **"Zum Mieter-Check".** *Default: the Mieter card renders without its button* until a Mieter-Check page exists (the footer's "Mieter-Check" and `/hilfe`'s answer are plain text for the same reason). Alternatives: link to `/hilfe?q=Mieter-Check` (the answer that describes it), or drop the Mieter card.
3. **Tenants as an audience.** The page speaks to landlords and managers ("Ihre Mieter", "Ihr Team"), but one card speaks to tenants and promises a possible "Kürzung" (against Heidi's own customers' bills). *Default: built as designed*; marketing confirms the card belongs on this page (gate).
4. **Slug.** *Default: `/mieterportal`.* `/nutzerportal` would match the "Heidi Nutzerportal" naming on `/selbstabrechnung`'s sample statement; decide one name for the product (gate).

## Risks

- **Every gate is on the cutover's critical path**, since every page is indexed after the cutover: this page's and the carried-over ones (04 §4.5–4.13). Mitigation: start the sign-offs early.
- **The product as described.** The page describes a tenant portal with navigation (Verbrauch, Dokumente, Mitteilungen), push notifications ("bekommen Ihre Mieter eine Mitteilung", "9:41 · Heidi"), installation appointments in the portal ("Montage Funkzähler · Do, 9 bis 11 Uhr", "Montagetermine"), monthly comparisons, and "0 Handgriffe für Ihr Team". The landlord platform lives at `platform.heidisystems.com`; whether its tenant side does all of this today needs product confirmation (gate). Mitigation: the claims are listed in §4.4.
- **Legal statements.** "Mit allem, was die Heizkostenverordnung verlangt", "So, wie es § 6a HeizkostenV verlangt", "Alle Pflichtangaben enthalten", "12 × Verbrauchsinformationen pro Jahr und Wohnung", "Seit 2022 müssen Mieter mit fernablesbaren Zählern monatlich informiert werden", "Den Verbrauch des letzten Monats in Kilowattstunden und den Vergleich mit Vormonat, Vorjahresmonat und einem Durchschnittsnutzer", "Erfüllen wir damit die Pflicht …? Ja.", and the tenant card's "Kürzung" (§ 12 HeizkostenV). Mitigation: legal sign-off in the gate.
- **Animation load.** Seven loops, a scroll listener and a scaled mock-up on one page. Mitigation: loops only in view and in a visible tab, the scroll handler throttled to one `requestAnimationFrame`, everything server-rendered in its end state, nothing under reduced motion; Lighthouse in §4.1.
- **Contrast.** White text on `--ink` passes; check `--mute` (68 % white) at 16 px, the dimmed statement words (22 % white, decorative while scrolling; the server and reduced motion render them white), and the lime links in the FAQ.
- **The hero word.** "Mieterportal" at up to 172 px with `white-space: nowrap`: check for horizontal overflow at 375 px (`clamp(34px, 11.6vw, 80px)` below 620) and at 621–980 (`clamp(40px, 11.4vw, 172px)`).

## Out of scope

- The design's nav (Produkt / Lösungen / Plattform / Kunden / Ressourcen), its footer (other groups, the city list, its newsletter script `#fx-js`) and the `#demo-css` block (the booking flow of another design).
- The pages the design links to: a booking page, the Mieter-Check, the uVI page (our footer maps uVI to `/funktionen`), the security page ("Mehr zu Sicherheit").
- The design's eyebrow pill script and hover wiggles (`#eb-js`, `#pillfx`; this page has no pills), the mobile fixes (`#mobfx`; `tokens.css` covers overflow), its `scrollRestoration` script (`#top-js`), its global smooth anchor scroll.
