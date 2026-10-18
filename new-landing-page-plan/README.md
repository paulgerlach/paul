# Page `/verbrauchsinformation` ("Verbrauchsinformation (uVI)"): plan

A new dark page on the unterjährige Verbrauchsinformation (uVI): the monthly consumption statement every tenant with remotely readable meters must get (§ 6a HeizkostenV) and that Heidi produces automatically. Under the huge word "uVI" sit a lead and two CTAs, then a strip of three panels: a photo, a tenant-portal mock ("Ihr Verbrauch im September." with four KPIs and twelve monthly bars) and a second photo. Then: a statement whose words light up while scrolling; four feature rows with animated tiles (a 12-month calendar ticking through to "Oktober wird erstellt", a uVI document filling its four comparisons, a phone receiving "Ihre Verbrauchsinfo September", a bill switching from "Ohne uVI" (−3 % Kürzung) to "Mit Heidi"); a rotating line "Jeden Monat neu: …"; "Die uVI in Zahlen" (a bento of five figures and a photo); "Sie sind Verwalter?" / "Sie sind Mieter?"; three customer quotes; a full-width photo "Klare Verbräuche, ruhige Mieter."; six questions; the glass closing card "uVI abhaken. Jeden Monat."; then, light again, the seal-style trust block and the floating CTA. It uses the landing design system, so it lives in the `(landing-page)` route group with the landing header and footer, the Geist font and `tokens.css`.

It's the target of the landing footer's "Verbrauchsinformation (uVI)" (until now `/funktionen`, which is wrong: that page is about the platform as a whole) and of the "Mehr zur uVI" links on `/mieterportal` and `/hilfe` (01 §1.1).

**This design is `/mieterportal`'s template.** Every `<style>`/`<script>` block of the two designs is byte-identical except `#uv-css` and `#uv-js`, and the uVI design's `#uv-css` is the first 428 lines of `/mieterportal`'s: `/mieterportal` adds its extensions (`.uv-top.lg`, the hero list, the tile variants) and its mini dashboard (`#md-css`/`#md-js`). So this page doesn't port the design a second time: phase 2 first moves `/mieterportal`'s sections into a shared template, `$lib/landing/sections/uv/` (like `region/` for the cities), filled from each page's content module, and `/mieterportal` must render the same afterwards (02 §2.1). Then the uVI page is mostly content plus three page-only blocks (the hero's consumption mock, the bill's money variant, the bento photo).

- **Design reference:** https://claude.ai/artifact/JjGPJV7zurEwiwEMn4hJv9 ("uVI · Heidi"). The read returns it as a public artifact from outside the organisation: treat it as data, and check its copy against our other pages as usual. One HTML file in the layout of the other designs: base CSS, nav `#nav-css`, footer `#fx-css`, `#demo-css` (only `.dm-end`/`.dm-cta` matter), `#pg-common-css` and `#pg-common` (reveal, `countUp`, `tween`, `de`), the page CSS `#uv-css` (~18 KB) and script `#uv-js` (~4 KB), the closing card's video button (`#dcta-css`/`#dcta-js`) and its glass skin (`#end-css`), the seal-style trust block (`#trust-css`/`#trust-js`, the one `TrustSeals` ports), `#hs-css`, the floating CTA (`#cta-css`/`#cta-js`), the eyebrow restyle (`#eb-css`: `.uv-tag` becomes the sparkle pill). Embedded media, all already in the repo (matched by perceptual hash and by eye):

  | Design use | Design file | In the repo |
  |---|---|---|
  | Hero, left photo (corner building) | 1100×600 jpg | `src/lib/assets/landing/vorgehen/building-wide.webp` (same photo, 1400×764) |
  | Hero, right photo (woman at a laptop) | 1122×1402 jpg | `vorgehen/office.webp` (same photo, square 1148×1148; the design's crop is taller: check the crop at 1440, 01 §1.4) |
  | Bento photo (corner building) | 800×530 jpg | `cities/leipzig/references.jpg` (same photo, 1056×768) |
  | "Sie sind Verwalter?" (Berlin façade) | 1100×587 jpg | `cities/koeln/hero.jpg` (identical) |
  | "Sie sind Mieter?" (smiling woman) | 720×710 jpg | `region/contact.webp` (same photo, 640×736) |
  | "Klare Verbräuche, ruhige Mieter." (façade) | 717×507 jpg | `cities/gera/references.jpg` (same photo, 717×615) |
  | Closing card video button | 240×200 poster + 30 KB webm | not used: the card gets the signup form instead (as on `/mieterportal`) |
  | Floating CTA avatars | 160×160 webp ×2 | `region/avatar-1.webp`, `avatar-2.webp` (identical) |

  The design's links point to other design artifacts; their mapping is in [01 §1.5](01-route-and-content.md). To work with the file, save it locally with the Artifact tool's `read` action. It isn't in the repo.
- **Previous plans:** the `/sicherheit` plan used to live in this folder (last version at `334b2c2d`). Before it came the `/dashboard` plan (`83433739`), the `/mieterportal` plan (`346e9174`, the template this page shares), the `/funktionen` plan (`6a74f274`), the `/vorgehen` plan (`93952e28`), the `/selbstabrechnung` plan (`9d0bab9c`), the `/hilfe` plan (`3b70270e`), the `/karriere` plan (`d9e105d8`), the `/ueber-uns` plan (`7a777e92`), the `/upgrade-now` plan (`ddde6575`), the `/messdienstanbieter` plan (`be2c1feb`) and the `/messdienstwechsel` plan (`65470139`). Their open go-live gates are in [04-qa-and-go-live.md §4.5–4.16](04-qa-and-go-live.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Route, the footer and the other uVI links, content, the deadline-dependent texts, SEO, signup wiring | S |
| 2 | [02-sections.md](02-sections.md) | The shared `uv` template (moving `/mieterportal` onto it, no visual change), then this page's 13 sections in their end state | M |
| 3 | [03-interactions.md](03-interactions.md) | The hero mock's entrance, the four tiles' loops, the bill's tween, statement, rotator, numbers, reveal | S |
| 4 | [04-qa-and-go-live.md](04-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | M |

Done in the planning commit: `ROUTE_VERBRAUCHSINFORMATION` in `$lib/routes.ts` and the footer's "Verbrauchsinformation (uVI)" pointing at it (it pointed at `/funktionen`). Until phase 1 adds the route, that one footer link 404s, and the e2e tests that resolve every footer link fail on it; phase 1 is the first thing to build. Phase 2 §2.1 is a refactor of a finished page: land it as its own commit, checked against `/mieterportal` before any uVI section is added.

## Target structure

```
src/routes/(landing-page)/verbrauchsinformation/
├── +page.server.ts        # load: seo (noindex), landing chrome, FAQ and figures for `now`, the signup form; the signup action
└── +page.svelte           # <main class="vi"> with UvMain (sections 1–12) and Trust; the page's #hs-css and reveal styles

src/lib/landing/sections/uv/              # NEW: the dark template, moved out of pages/mieterportal/sections/
├── UvMain.svelte          # the dark wrapper: page tokens (--card, --card2, --mute, --lime, --bg, --hair), .uv-btn, focus colour
├── Hero.svelte            # .uv-hero: the word (size md | lg), lead, CTAs, the peek strip (two photos + a `mock` snippet)
├── AppFrame.svelte        # the white app with its sidebar (logo, nav, foot) around a `children` snippet
├── Statement.svelte       # words lighting up on scroll
├── Rows.svelte            # feature rows: Eyebrow tag, two-line H2, paragraphs (with inline links), CTAs, a tile
├── tiles/Calendar.svelte  # 12 months ticking to the current one
├── tiles/Doc.svelte       # a Verbrauchsinformation with four bars and the check (was mieterportal's tiles/Statement)
├── tiles/Phone.svelte     # notification, figure, comparison chips, mini bars
├── tiles/Bill.svelte      # "without / with" switch: rows fold, sum swaps or tweens (was mieterportal's tiles/Before)
├── Rotator.svelte         # "lead: phrase" with blur hand-over
├── Numbers.svelte         # "… in Zahlen": figures with a `media` snippet in the second cell
├── Audience.svelte        # "Sie sind Verwalter?" / "Sie sind Mieter?"
├── Quotes.svelte          # three dark testimonial cards
└── Picture.svelte         # the full-width photo with its caption

src/lib/landing/pages/mieterportal/sections/   # become thin wrappers passing content (PortalMock, DashboardTile stay page-only)

src/lib/landing/pages/verbrauchsinformation/
├── content.ts  content.test.ts          # every text and the example data, word for word; the expired variants
├── icons.ts                             # the page's stroke icons (sidebar nav, the bell, the tick)
├── components/Icon.svelte
└── sections/
    ├── Hero.svelte*                     # uv/Hero with the word "uVI" and ConsumptionMock
    ├── ConsumptionMock.svelte           # AppFrame + "Ihr Verbrauch im September.", four KPIs, 12 bars, month labels
    ├── Statement.svelte*  Rows.svelte*  Rotator.svelte*
    ├── Numbers.svelte*                  # uv/Numbers with the bento photo
    ├── Audience.svelte*  Quotes.svelte*  Picture.svelte*
    ├── Faq.svelte*                      # shared Faq, tone="dark", openFirst={false}, id="faq"
    ├── CtaCard.svelte*                  # shared CtaCard tone="glass" with the SignupForm, id="start"
    ├── Trust.svelte*                    # TrustSeals
    └── FloatingCta.svelte*              # "Erstgespräch vereinbaren"
```

`*` marks a thin wrapper around a shared section, following the rule of the other landing pages: `+page.svelte` imports only from its own `sections/` folder.

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/verbrauchsinformation`, `ROUTE_VERBRAUCHSINFORMATION` in `$lib/routes.ts` (added in the planning commit). The German word people search for, readable, and not an abbreviation. Open question 1 |
| Route group | `(landing-page)`, outside `[[preview=preview]]`: a landing design, no Prismic content |
| Indexing | `seo.noindex = true` and out of the sitemap until the cutover, like the other new pages; at the cutover it's indexed and joins the sitemap (decision of 2026-10-17), so its go-live gate (§4.4) blocks the cutover PR (#440) |
| Header | The shared `LandingHeader` with `DEFAULT_CHROME` (the design's banner is the same text, "Mehr erfahren" → `/upgrade-now`) |
| Links to it | The footer's "Verbrauchsinformation (uVI)" (done). Phase 1: "Mehr zur uVI" on `/mieterportal` (FAQ) and `/hilfe` (answer `uvi`), both `ROUTE_FUNKTIONEN` today and pointing at this page in the `/mieterportal` design; the city template's uVI card "Mehr erfahren" (`region/Duo.svelte`, today `ROUTE_FUNKTIONEN`; check the saved city design's target first). `/funktionen`'s "Benachrichtigungen" card (design target: uVI) stays without `href` until that page's open question 1 is answered. Details in 01 §1.1 |
| Shared template | `/mieterportal`'s sections move to `$lib/landing/sections/uv/` and take their content as props; both pages wrap them. `/mieterportal`'s HTML and look stay the same (checked by its e2e spec and a screenshot diff before/after, 02 §2.1). Page-only: `PortalMock`, `DashboardTile`, `curve.ts` (mieterportal), `ConsumptionMock` (here) |
| Dark page | As on `/mieterportal`: `UvMain` is a dark wrapper inside `<main>` holding sections 1–12, and the light `Trust` sits after it inside `<main>` (the design has it after `</main>`) |
| Signup and CTAs | As on `/mieterportal`: the design's hero carries `id="start"` but has no form; our `DEMO_HREF` is `#start`, so the closing card gets the shared `SignupForm` in place of the video button and carries `id="start"`. Submit label "Demo buchen". Every "Demo buchen" (hero, four rows) → `DEMO_HREF` with `focusSignup`. Hero "Mehr erfahren" → `#inhalt`, the rows' "Häufige Fragen" → `#faq`, row 3's "Zum Mieterportal" and its inline "Mieterportal" → `ROUTE_MIETERPORTAL`. Leads: `source: "verbrauchsinformation"`, `switchinquiry` with `page: "/verbrauchsinformation"`. Open question 2 |
| Audience buttons | The shared rule: a card's button shows only when its target exists. "Erfahren Sie mehr" (design: the Hausverwaltung page) and "Zum Mieter-Check" have no page, so both cards show no button for now. Open question 3 |
| Content | Every text and the example data in `content.ts`, word for word from the design (soft hyphen in "Verbrauchs­information" kept). `content.test.ts` pins the H1, the four rows, the six questions and that the example data agree with each other (01 §1.2) |
| Deadline texts | Two texts are wrong after 31.12.2026: the bento figure "31.12.2026 / Bis dahin müssen alle Zähler fernablesbar sein" and the answer "Meine Zähler sind noch nicht fernablesbar. Was nun?". Both get an `expired` variant, chosen in `load` through `isExpired(now)` (`$lib/landing/deadline/deadline.ts`), as `/funktionen`'s `faqItems(now)` does. The expired texts are placeholders until the content owner writes them (gate §4.4). Nothing else depends on `now`; components never call `Date.now()` |
| FAQ | The shared `Faq`, default variant, `tone="dark"`, `openFirst={false}` (every `<details>` in the design is closed), title "Häufige Fragen" left-aligned, `id="faq"`. Answer 5's link "Jetzt noch umrüsten" is its `more` (→ `ROUTE_UPGRADE_NOW`); answer 6's "Mieterportal" sits inside the sentence, so it's an `<a>` in the answer (`FaqItem.answer` allows it; the JSON-LD gets the text). FAQPage JSON-LD of the six questions |
| Closing card | The shared `CtaCard` `tone="glass"` (the design's `#end-css`) with the form, H2 "uVI abhaken. Jeden Monat.", text "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands." |
| Loops | Five loops, all through `loopInView` (only in view and in a visible tab, nothing under reduced motion): calendar 7.6 s, document 7 s, phone 7 s, bill 6.4 s, rotator 2.3 s. The design starts them once and never stops them |
| One-time entrances | The hero mock's KPIs and bars, the figures' count-up (12, 3, 3), the picture's zoom: through `enterView` / `countUp` / the shared `Picture` as on `/mieterportal`. The hero is on screen at load, so its mock keeps its server state there (03 §3.1) |
| Headings | One `<h1>`: the visible word "uVI" is `aria-hidden`, the accessible text is the design's hidden "uVI: Unterjährige Verbrauchsinformation mit Heidi". `<h2>` per row, for "Die uVI in Zahlen", the two audience cards, the quotes, the FAQ and the closing card, then the trust block's. `<h3>` in the mock ("Ihr Verbrauch im September.") as designed. The `#hs-css` sizes apply to the H2s with an id (Zahlen, quotes, FAQ, trust), as on `/mieterportal` |
| Styling | The CSS lives with the shared components (moved, not copied). This page adds what `/mieterportal` didn't port because its design had no markup for it: `.uv-kpis`, `.uv-bars`, `.uv-ml` (the mock), `.uv-c.img` (the bento photo), the bill's money rows (`.uv-bl.cut`/`.ok` with a value), the phone's second chip. Breakpoints stay the design's (980, 620, plus `#hs-css` 1040/620). No class that is also a Tailwind utility (`CLAUDE.md`) |
| Rendering | SSR with the `(landing-page)` cache header. `now` only picks the two deadline texts in `load` |

## Open questions (the default is built unless answered)

1. **Slug.** *Default: `/verbrauchsinformation`.* Alternatives: `/uvi` (short, matches the footer's abbreviation), `/unterjaehrige-verbrauchsinformation` (the full term, long).
2. **Closing card.** The design has a video button "Demo buchen / Mit Ihrem Ansprechpartner" to a booking page that doesn't exist. *Default: the signup form with the button "Demo buchen"* (as `/mieterportal`, `/funktionen`, `/dashboard`). Once a booking URL exists, the card can go back to the video button.
3. **The audience cards' buttons.** *Default: none* (no Hausverwaltung page, no Mieter-Check). Alternatives: "Erfahren Sie mehr" → `/funktionen` or `DEMO_HREF`; bring each back when its page exists.
4. **The hero mock on load.** The design grows the bars and fades in the KPIs on load. *Default: server-rendered in the end state, no entrance while on screen at load* (the `enterView` rule of `/dashboard` and `/sicherheit`: no flash on hydration, LCP unaffected). Alternative: play it once after hydration.
5. **FAQ answer 6's inline link.** *Default: the design's inline "Mieterportal" link inside the answer.* Alternative: plain text with a `more` link "Zum Mieterportal".

## Risks

- **Every gate is on the cutover's critical path**, since every page is indexed after the cutover: this page's and the carried-over ones (04 §4.5–4.16). Mitigation: start the sign-offs early.
- **Refactoring a finished page.** Moving `/mieterportal` onto the shared template can change it unnoticed (class names, scoped CSS order, the heading reset's specificity, `loopInView` timing). Mitigation: its own commit; screenshots of `/mieterportal` at 1440 and 375 px (reduced motion, so the end state) before and after must match, its e2e spec passes unchanged, and its SSR HTML is diffed (only Svelte's scoping hashes may change). If that turns out costly, the fallback is copying the sections into this page's folder, at the price of ~1,500 duplicated lines.
- **Legal statements are the page.** "Seit 2022 müssen Mieter mit fernablesbaren Zählern jeden Monat über ihren Verbrauch informiert werden", "Pflicht (§ 6a HeizkostenV)", "dürfen Mieter ihren Anteil an den Heizkosten um 3 % kürzen (§ 12 HeizkostenV)", "Das gilt auch, wenn keine fernablesbaren Geräte verbaut sind, obwohl es Pflicht wäre", the required content (kWh, Vormonat, Vorjahresmonat "soweit Daten vorliegen", Durchschnittsnutzer "derselben Nutzerkategorie"), "Bestehende Geräte müssen bis zum 31. Dezember 2026 nachgerüstet oder ersetzt werden", "In der Abrechnung gibt es dafür keinen Abzug", "Kein Kürzungsrecht. Keine Diskussion.", "Alles drin, was § 6a verlangt". The page makes them its headline, so they must hold exactly (e.g. whether the 3 % applies to the uVI duty or only to the retrofit duty, and "rechtssicher" as a promise). Mitigation: legal sign-off in §4.4, together with the same sentences on `/hilfe`, `/mieterportal`, `/upgrade-now`.
- **The product as described.** Monthly uVI "für jede Wohnung", delivered in the Mieterportal with a notification ("Ihre Verbrauchsinfo September · Jetzt im Mieterportal ansehen"), "Ohne Termin", "Mit Heidi ist jede Information dokumentiert", "0 Handgriffe für Ihr Team". Mitigation: listed in §4.4; align with `/mieterportal`'s product item (§4.7).
- **Example data.** The mock's twelve bars run October to September with 96 kWh heating in August and 14 kWh in July; September 131 kWh, "11 % unter Vorjahresmonat" (148), "8 % unter Durchschnitt" (142); the calendar's current month October; the bill's 1.240,00 € share and −37,20 €. They read as "now" only in autumn 2026 (gate §4.4).
- **Photos reused from the city pages.** Four of the six photos are city-page photos (`koeln/hero.jpg`, `leipzig/references.jpg`, `gera/references.jpg`) or the region contact photo; the same building then appears on a city page as "local" and here as generic. Their licences are already in the city gate (§4.15); the content owner should accept the reuse (gate §4.4).

## Out of scope

- The design's nav (Produkt / Lösungen / Plattform / Kunden / Ressourcen), its footer (other groups, the city list, the newsletter script `#fx-js`), its chat button, `#top-js`, `#mobfx` (`tokens.css` covers overflow), `#eb-js`.
- The closing card's video button (`#dcta-css`/`#dcta-js`, the poster and the webm): replaced by the form (open question 2).
- Dead code with no markup on this page: most of `#demo-css`, `#pg-common-css` (`.pg-*` isn't used here), `#pg-common`'s `seg`, `paintRange`, `confetti`, `#pillfx`.
- The pages the design links to that don't exist: a booking page, the Hausverwaltung page, the Mieter-Check.
- A uVI sample PDF or a live uVI for a real flat: not in the design.
