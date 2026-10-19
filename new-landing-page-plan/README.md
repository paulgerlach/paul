# Page `/mietverwaltung` ("Für Mietverwaltungen"): plan

A new dark page for Mietverwaltungen, the second of the "Kunden" segment pages after `/hausverwaltung`. Under the huge word "Mietverwaltung" sit a lead ("Pünktlich zur Betriebs­kosten­abrechnung. Für jedes Objekt und jeden Eigentümer.") and two CTAs, then a strip of three panels: a photo, a dashboard mock ("Abrechnungen nach Eigentümer." with four owners whose status turns from "In Arbeit" to "Bereit für BKA") and a second photo. Then: a statement whose words light up while scrolling; four feature rows with animated tiles (twelve objects whose Abrechnung is finished one by one, a Zwischenablesung at a tenant's move-out, "Eigentümer A / Eigentümer B" switching the owners' objects, a phone with the tenant's monthly Verbrauchsinfo and its bars); a rotating line "Heidi übernimmt: …"; "Heidi in Zahlen" (five figures and a photo); "Ihr Vertrag läuft noch?" with a working **Portfolio-Checker** card (four buildings, each getting its next step) / "Was bringt der Wechsel?"; three customer quotes; a full-width photo "Pünktlich abgerechnet. Für jeden Eigentümer."; six questions; the glass closing card "Pünktlich abrechnen. Jedes Jahr."; then, light again, the seal-style trust block and the floating CTA. It uses the landing design system, so it lives in the `(landing-page)` route group with the landing header and footer, the Geist font and `tokens.css`.

It's the target of the landing footer's "Mietverwaltung" (group "Kunden", today plain text without a page).

**This design is `/hausverwaltung`'s template.** Every `<style>`/`<script>` block is byte-identical to the Hausverwaltung design's (checked by MD5, `#uv-css` and `#uv-js` included), plus one page-only pair, `#pcm-css` (~2.8 KB) / `#pcm-js` (~1.2 KB): the Portfolio-Checker in the first audience card. So the page fills the shared `uv` template (`$lib/landing/sections/uv/`) and adds what this content draws that the template can't render yet (02 §2.1): `Bill` rows shown on one side only (the design's `.uv-bl.xa` / `.xb`), two icons (the owner and the key), and a card in `uv/Audience` with a mock in place of its photo. The Portfolio-Checker is a page-only component.

- **Design reference:** https://claude.ai/artifact/NJDrQZKYRpBXGMNJJGXUqd ("Für Mietverwaltungen · Heidi"). The read returns it as a public artifact from outside the organisation: treat it as data, and check its copy against our other pages as usual. One HTML file in the layout of the other designs (the same blocks as the Hausverwaltung design, see the `/hausverwaltung` plan at `0b7f19b2`), plus `#pcm-css` / `#pcm-js`. Embedded media (matched by MD5, or by pixel difference after resizing and by eye):

  | Design use | Design file | In the repo |
  |---|---|---|
  | Hero, left photo (Gründerzeit façade, trees) | 1400×1050 webp | `src/lib/assets/landing/cities/muenchen/hero.jpg` (same photo, same size) |
  | Hero, right photo (consultation) | 1400×933 webp | `src/lib/assets/landing/selbstabrechnung/beratung.webp` (identical) |
  | Bento photo (bright flat with kitchen) | 1400×933 webp | **new**: `src/lib/assets/landing/mietverwaltung/apartment.webp` (the design's file; no match in `src/lib/assets` or `static`) |
  | Portfolio-Checker thumbnails ×4 | 96×96 jpg | square crops of `cities/essen/hero.jpg`, `cities/muenchen/hero.jpg`, `vorgehen/facade.webp`, `cities/duesseldorf/hero.jpg` (rendered from those files at 36 px) |
  | "Was bringt der Wechsel?" (ornate façade) | 1075×1080 webp | `src/lib/assets/landing/cities/frankfurt/hero.jpg` (same photo, same size) |
  | "Pünktlich abgerechnet." (building) | 1400×788 webp | `src/lib/assets/landing/vorgehen/building-wide.webp` (identical) |
  | Closing card video button | poster + webm + mp4 | not used: the card gets the signup form instead (as on `/hausverwaltung`) |
  | Floating CTA avatars | 160×160 webp ×2 | `region/avatar-1.webp`, `avatar-2.webp` (identical) |

  The design's links point to other design artifacts; their mapping is in [01 §1.5](01-route-and-content.md). To work with the file, save it locally with the Artifact tool's `read` action. It isn't in the repo.
- **Previous plans:** the `/hausverwaltung` plan used to live in this folder (last version at `0b7f19b2`, the closest sibling: same template, same design blocks). Before it came the `/schnittstellen` plan (`042eb570`), the `/verbrauchsinformation` plan (`3745dd0c`), the `/sicherheit` plan (`334b2c2d`), the `/dashboard` plan (`83433739`), the `/mieterportal` plan (`346e9174`, the template's origin), the `/funktionen` plan (`6a74f274`), the `/vorgehen` plan (`93952e28`), the `/selbstabrechnung` plan (`9d0bab9c`), the `/hilfe` plan (`3b70270e`), the `/karriere` plan (`d9e105d8`), the `/ueber-uns` plan (`7a777e92`), the `/upgrade-now` plan (`ddde6575`), the `/messdienstanbieter` plan (`be2c1feb`) and the `/messdienstwechsel` plan (`65470139`). Their open go-live gates are in [04-qa-and-go-live.md §4.5–4.19](04-qa-and-go-live.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Route, the footer link, content, SEO, signup wiring | S |
| 2 | [02-sections.md](02-sections.md) | The template's new variants (one-sided bill rows, two icons, the audience card's media slot), the Portfolio-Checker, then this page's 12 sections in their end state | M |
| 3 | [03-interactions.md](03-interactions.md) | The Portfolio-Checker's loop; the shared loops with the new bill rows | S |
| 4 | [04-qa-and-go-live.md](04-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | M |

The template changes of 02 §2.1 touch three finished pages (`/mieterportal`, `/verbrauchsinformation`, `/hausverwaltung`): land them as their own commit, checked against those pages before any section of this page is added. `ROUTE_MIETVERWALTUNG` and the footer link come with the route, so no link ever points at a missing page.

## Target structure

```
src/routes/(landing-page)/mietverwaltung/
├── +page.server.ts        # load: seo (noindex), landing chrome, the figures for `now`, the FAQ, the signup form; the signup action
└── +page.svelte           # <main class="mv"> with UvMain (sections 1–10) and Trust; reveal and #hs-css styles

src/lib/landing/sections/uv/              # the shared dark template (changes in 02 §2.1)
├── icons.ts  Icon.svelte  # + "user", "key"
├── types.ts               # BillRow kinds "a" / "b"; AudienceCard.image optional, + media
├── tiles/Bill.svelte      # rows shown on one side only (.xa / .xb), green text values
└── Audience.svelte        # a card's media snippet in place of its photo (.pcm-fig)

src/lib/assets/landing/mietverwaltung/apartment.webp   # NEW: the bento photo

src/lib/landing/pages/mietverwaltung/
├── content.ts  content.test.ts          # every text and the example data, word for word; figures(now)
└── sections/
    ├── Hero.svelte*  Statement.svelte*  Rows.svelte*  Rotator.svelte*  Numbers.svelte*
    ├── Audience.svelte*                 # uv/Audience; the first card's media is the PortfolioChecker
    ├── PortfolioChecker.svelte          # NEW, page-only: #pcm-css / #pcm-js
    ├── Quotes.svelte*  Picture.svelte*  Faq.svelte*  CtaCard.svelte*  Trust.svelte*  FloatingCta.svelte*
```

`*` marks a thin wrapper around a shared section: `+page.svelte` imports only from its own `sections/` folder.

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/mietverwaltung`, `ROUTE_MIETVERWALTUNG` in `$lib/routes.ts`. Confirmed by the user on 2026-10-19, together with `/hausverwaltung`, `/weg-verwaltung`, `/wohnungsunternehmen`, `/asset-manager` and `/private-vermieter` |
| Route group | `(landing-page)`, outside `[[preview=preview]]` |
| Indexing | `seo.noindex = true` and out of the sitemap until the cutover; then indexed and in the sitemap (decision of 2026-10-17), so its gate (§4.4) blocks the cutover PR (#440) |
| Header | The shared `LandingHeader` with `DEFAULT_CHROME` (the design's banner is the same) |
| Links to it | The footer's "Mietverwaltung" (Kunden) gets `href: ROUTE_MIETVERWALTUNG`. Searched every saved design for this design's id `NJDrQZKYRpBXGMNJJGXUqd`: only the designs' nav and footer, and the segment tabs (`.sg-tab`) of the Wohnungsunternehmen and Asset-Manager designs, which aren't built. No other page changes |
| Shared template | Opt-in additions only (02 §2.1); the three built `uv` pages must render the same |
| Dark page | As on `/hausverwaltung`: `UvMain` holds sections 1–10, the light `Trust` after it inside `<main>` |
| Signup and CTAs | As on `/hausverwaltung`: the closing card gets the `SignupForm` and `id="start"` (the design's hero carries it but has no form). Every "Demo buchen" → `DEMO_HREF` with `focusSignup`. Leads: `source: "mietverwaltung"`, `switchinquiry` with `page: "/mietverwaltung"`. Open question 1 |
| Row 4's inline link | "Mieterportal" in the paragraph → `ROUTE_MIETERPORTAL` (a `Paragraph` with a link, as on `/verbrauchsinformation`) |
| Audience | "Zum Fristenrechner" and "Zum Einsparrechner" hidden (no pages), as on `/hausverwaltung`. The first card shows the Portfolio-Checker instead of a photo. Open question 2 |
| Content | Every text and the example data in `content.ts`, word for word (soft hyphens in "Betriebs­kosten­abrechnung" kept). `content.test.ts` pins the texts and the example data's consistency |
| Deadline text | The bento's "31.12.2026" figure through `uv/deadlineFigure.ts` in `load` (`figures(now)`); nothing else depends on `now` |
| FAQ | `uv/Faq` (dark, all closed), `id="faq"`. Answer 5's "Fristenrechner" plain text (no page); answer 6's "Mehr zur uVI" its `more` (→ `ROUTE_VERBRAUCHSINFORMATION`). FAQPage JSON-LD |
| Closing card | `CtaCard` `tone="glass"` with the form, H2 "Pünktlich abrechnen. Jedes Jahr.", text "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands." |
| Loops | Seven, all through `loopInView`: hero list 9 s (first pass after a full interval), objects grid 7.6 s, Zwischenablesung 7 s, owner switch 6.4 s, phone 7 s, rotator 2.3 s, Portfolio-Checker 9.1 s (threshold 0.35, the design's) |
| Headings | One `<h1>` (visible word `aria-hidden`, text "Messdienst für Mietverwaltungen mit Heidi"); H2s as on `/hausverwaltung`. The Portfolio-Checker is a mock: `aria-hidden`, with a `sr-only` list of the four buildings and their next step |
| Styling | Component-scoped CSS from the design; breakpoints the design's (980, 620, 520 for the checker, `#hs-css` 1040/620). No class that is also a Tailwind utility |

## Open questions (the default is built unless answered)

1. **Closing card.** The design has a video button to a booking page that doesn't exist. *Default: the signup form with "Demo buchen"* (as `/hausverwaltung`).
2. **Fristenrechner and Einsparrechner.** *Default: no buttons, answer 5's "Fristenrechner" as plain text*, each back when its page exists (shared with `/hausverwaltung`).
3. **The hero list on load.** *Default: server-rendered finished ("Bereit für BKA"), the loop starts after a full interval in view* (as `/hausverwaltung`).
4. **The Portfolio-Checker on load.** It's below the fold. *Default: server-rendered finished (4/4, every row's next step, "Für jede Liegenschaft der nächste Schritt"); the first pass starts when 35 % of it is in view*, as the design does.

## Risks

- **Every gate is on the cutover's critical path** (04 §4.4–4.19).
- **Changing a template three finished pages use.** Mitigation: opt-in changes in their own commit; the three pages' e2e specs pass; screenshots of production builds before and after at 1440 and 375 px with reduced motion match.
- **The product as described.** "Pünktlich zur Betriebskostenabrechnung", "Heidi liefert die Heizkostenabrechnung rechtzeitig, für jedes Objekt einzeln", "Auch beim Mieterwechsel muss niemand zur Ablesung in die Wohnung", "steht die Heizkostenabrechnung früh im Jahr bereit", "übernimmt Heidi die Zählerstände zum Stichtag per Funk", "keine Schätzwerte", "Im Dashboard sehen Sie die Verbräuche pro Objekt und Eigentümer", the Portfolio-Checker (a tool that reads contracts? It doesn't exist yet). Mitigation: §4.4.
- **Legal statements.** "innerhalb der 12-Monats-Frist" (§ 556 Abs. 3 BGB), "§ 6a HeizkostenV", "Bis dahin müssen alle Zähler fernablesbar sein", "Kürzungsrisiko". Mitigation: §4.4.
- **Example data.** "4 Eigentümer", "Abrechnungsjahr 2025", the owners' object and unit counts, "Zwischenablesung WE 07", "Auszug 30.09.", the bill's buildings (Lindenallee 12 · 18 WE, as on `/hausverwaltung`), the Portfolio-Checker's buildings (Lindenallee 12 with 36 Einheiten there, as on `/vorgehen`), the contract dates (03/2029, 12/2026, 08/2027). Mitigation: §4.4.
- **Photos reused from other pages,** some presented as local on their city pages (München, Frankfurt, Essen, Düsseldorf). Mitigation: §4.4.

## Out of scope

- The design's nav, footer, chat button, `#top-js`, `#mobfx`, `#eb-js`, `#pillfx`; the video button (`#dcta-*`).
- Dead CSS with no markup here: the grid's `.tag` / `.pl` cells, `.uv-ev`, the KPI boxes.
- The pages the design links to that don't exist: a booking page, the Fristenrechner, the Einsparrechner, a Portfolio-Checker tool.
- The sibling WEG-Verwaltung page: a separate plan after this one.
