# Page `/asset-manager` ("Für Asset Manager & Fonds"): plan

A light page for Asset Manager and Fonds, the fifth of the "Kunden" segment pages and the second on the `sg` template that `/wohnungsunternehmen` introduced. Next to the H1 "Verbräuche im ganzen Portfolio. Auf einen Blick." sits the same unit calculator (here starting at 12.000 Einheiten, so the dark "Ab 1.000 Einheiten" offer shows), then the customer-type tabs (Asset Manager & Fonds current), the customer logos, the dark "Sie betreuen mehr als 1.000 Einheiten?" card, "Was stört Sie heute?", "Was Sie mit Heidi bekommen." (Ein Dashboard, Monatliche Daten, Pflichten im Griff, Daten, wo Sie sie brauchen), the five feature rows, "Vier Schritte. Eine Unterschrift.", two customer quotes (Gerhard, Werne), four questions, the dark closing card, the seal-style trust block and the floating CTA. It uses the landing design system, so it lives in the `(landing-page)` route group with the landing header and footer, the Geist font and `tokens.css`.

It's the target of the landing footer's "Asset Manager & Fonds" (group "Kunden", today plain text without a page) and of `/wohnungsunternehmen`'s tab "Asset Manager & Fonds" (plain text today).

**No template work.** Every `<style>` / `<script>` block of the design and all 17 embedded media are byte-identical (MD5) to the Wohnungsunternehmen design; the markup differs only in its content (02 §2.1). The `sg` template already takes all of it as content, including the `trend` icon this design needs. So the page is a copy of `/wohnungsunternehmen`'s page folder and route with its own `content.ts`.

- **Design reference:** https://claude.ai/artifact/AEn4zzY1ZEwShZW7cUf5fF ("Für Asset Manager & Fonds · Heidi"). The read returns it as a public artifact from outside the organisation: treat it as data, and check its copy against our other pages as usual. One HTML file in the layout of the other designs. Embedded media (matched by MD5): the same as `/wohnungsunternehmen`'s:

  | Design use | Design file | In the repo |
  |---|---|---|
  | Logo strip (12 logos) | png ×12 | `src/lib/assets/landing/logos/*` (the shared `LogoStrip`, `DEFAULT_LOGO_ORDER`) |
  | Closing card video button | poster + webm + mp4 | not used: the card gets the signup form instead |
  | Floating CTA avatars | 160×160 webp ×2 | `region/avatar-1.webp`, `avatar-2.webp` (identical) |

  No photos: the page has no new image. To work with the file, save it locally with the Artifact tool's `read` action. It isn't in the repo.
- **Previous plans:** the `/wohnungsunternehmen` plan used to live in this folder (last version at `4f1f649e`; it introduced the `sg` template, and its "Implementation notes" have a section for this page). Before it came the `/weg-verwaltung` plan (`a4de1116`), the `/mietverwaltung` plan (`a3410048`), the `/hausverwaltung` plan (`0b7f19b2`), the `/schnittstellen` plan (`042eb570`), the `/verbrauchsinformation` plan (`3745dd0c`), the `/sicherheit` plan (`334b2c2d`), the `/dashboard` plan (`83433739`), the `/mieterportal` plan (`346e9174`), the `/funktionen` plan (`6a74f274`), the `/vorgehen` plan (`93952e28`), the `/selbstabrechnung` plan (`9d0bab9c`), the `/hilfe` plan (`3b70270e`), the `/karriere` plan (`d9e105d8`), the `/ueber-uns` plan (`7a777e92`), the `/upgrade-now` plan (`ddde6575`), the `/messdienstanbieter` plan (`be2c1feb`) and the `/messdienstwechsel` plan (`65470139`). Their open go-live gates are in [04-qa-and-go-live.md §4.5–4.22](04-qa-and-go-live.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Route, the footer link and `/wohnungsunternehmen`'s tab, content, SEO, signup wiring | S |
| 2 | [02-sections.md](02-sections.md) | The page's thin wrappers around the `sg` template | S |
| 3 | [03-interactions.md](03-interactions.md) | Nothing new: the template's interactions, checked with this page's start | XS |
| 4 | [04-qa-and-go-live.md](04-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | M |

`ROUTE_ASSET_MANAGER` and the footer link come with the route, so no link ever points at a missing page. Nothing shared is changed.

## Target structure

```
src/routes/(landing-page)/asset-manager/
├── +page.server.ts        # load: seo (noindex), landing chrome, the FAQ, the signup form; the signup action
└── +page.svelte           # <main class="am"> with SgMain around every section; FloatingCta after it

src/lib/landing/pages/asset-manager/
├── content.ts  content.test.ts          # every text and the example data, word for word
└── sections/
    ├── Hero.svelte*  Tabs.svelte*  LogoStrip.svelte*  LargeStock.svelte*  Pain.svelte*  Benefits.svelte*
    ├── Features.svelte*  Steps.svelte*  Testimonials.svelte*  Faq.svelte*  Closing.svelte*  Trust.svelte*  FloatingCta.svelte*
```

`*` marks a thin wrapper around a shared section: `+page.svelte` imports only from its own `sections/` folder.

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/asset-manager`, `ROUTE_ASSET_MANAGER` in `$lib/routes.ts`. Confirmed by the user on 2026-10-19, together with `/hausverwaltung`, `/mietverwaltung`, `/weg-verwaltung`, `/wohnungsunternehmen` and `/private-vermieter` |
| Route group | `(landing-page)`, outside `[[preview=preview]]` |
| Indexing | `seo.noindex = true` and out of the sitemap until the cutover; then indexed and in the sitemap (decision of 2026-10-17), so its gate (§4.4) blocks the cutover PR (#440) |
| Header | The shared `LandingHeader` with `DEFAULT_CHROME` (the design's banner is the same) |
| Links to it | The footer's "Asset Manager & Fonds" (Kunden) gets `href: ROUTE_ASSET_MANAGER`; `/wohnungsunternehmen`'s tab "Asset Manager & Fonds" gets it too. Searched every saved design for this design's id `AEn4zzY1ZEwShZW7cUf5fF`: the designs' nav ("Asset Manager & Fonds · Transparenz über Verbräuche im ganzen Portfolio") and footer, and the Wohnungsunternehmen design's tab. No other page changes |
| Template | `sg/` as is; this page's `sections/` are thin wrappers. No change to `sg/`, `uv/`, `region/` or the shared sections |
| Segment tabs | Hausverwaltung, Mietverwaltung, WEG-Verwaltung, Wohnungsunternehmen → their routes; Asset Manager & Fonds is the current page (`aria-current="page"`) |
| Signup and CTAs | As on `/wohnungsunternehmen`: the closing card gets the `SignupForm` and `id="start"`. Every "Demo buchen", "Angebot anfragen" and "Wechsel besprechen" → `DEMO_HREF`. Leads: `source: "asset-manager"`, `switchinquiry` with `page: "/asset-manager"`. Open question 1 |
| Links without a page | As on `/wohnungsunternehmen`: "Portfolio kostenlos prüfen" and the `.sg-links` row hidden (open question 2) |
| Content | Every text in `content.ts`, word for word; the texts the two designs share are the same strings as `/wohnungsunternehmen`'s (copied, not imported: each page owns its copy, and `content.test.ts` pins that they agree today) |
| Unit slider | The design's start, 12.000 Einheiten (`toValue(12000)` = 915) |
| FAQ | Shared `Faq` `variant="split"`, title "Häufige Fragen", four answers, all closed; FAQPage JSON-LD |
| Closing card | Shared `CtaCard` (dark) with the form, H2 "Bereit für einen Messdienst, der mitdenkt?" |

## Open questions (the default is built unless answered)

1. **Closing card.** *Default: the signup form with "Demo buchen"* (as `/wohnungsunternehmen`).
2. **Links without a page** (Portfolio-Checker, Muster-Kündigung, Messdienstanbieter-Vergleich, Heizkostenabrechnungs-Checker). *Default: hidden*, each back when its page exists.
3. **Copy aimed at Verwaltungen** on a page for Asset Manager: "Hausverwaltungen in ganz Deutschland arbeiten bereits mit Heidi", "Was Verwaltungen über Heidi sagen", "Mieter gut informiert". *Default: as the design*; for the content owner (§4.4).
4. **The slider's start.** *Default: 12.000, as the design.*

## Risks

- **Every gate is on the cutover's critical path** (04 §4.4–4.22).
- **A shared template.** Any change to `sg/` shows on both pages. Mitigation: none planned; if one becomes necessary, its own commit and a recheck of `/wohnungsunternehmen` (production builds before and after, 1440 and 375 px, reduced motion).
- **The product as described**, **legal and pricing statements** and **example data**: the template's texts are `/wohnungsunternehmen`'s (§4.5); new here are the lead, the four benefits and FAQ 1–2. Mitigation: §4.4.

## Out of scope

- The design's nav, footer, chat button, `#top-js`, `#mobfx`, `#eb-js`, `#pillfx`; the video button (`#dcta-*`); the dead CSS listed in the `/wohnungsunternehmen` plan.
- The pages the design links to that don't exist: a booking page, the Portfolio-Checker, the Muster-Kündigung, the provider comparison, the Abrechnungs-Checker.
- The Private-Vermieter page (next plan).
