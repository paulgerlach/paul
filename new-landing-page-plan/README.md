# Page `/vorgehen` ("Vorgehen"): plan

The product page that explains how Heidi works with a Verwaltung: "So geht Heidi vor. In drei Schritten digital." A large hero heading with a lead and two CTAs, a wide building photo, three key figures (92 %, 14 Tage, 3-in-1), the remote-reading duty with a day count to 1.1.2027, the three steps of the switch as auto-advancing tabs (Bedarfsanalyse, Installation der Funktechnik, Verbrauchsanalyse und Abrechnung), six feature cards ("Mehr als Ablesung."), a comparison "Mit Heidi oder klassisch ablesen?", three customer quotes, five FAQs, a contact card with a photo, the security block and the floating CTA. It uses the landing design system, so it lives in the `(landing-page)` route group with the landing header and footer, the Geist font and `tokens.css`. The landing footer's "Produkt" group already lists "Vorgehen" as plain text; phase 1 links it.

- **Design reference:** https://claude.ai/artifact/5BrUg7VjVK4QEhd7DiaSfj ("Vorgehen · Heidi"). The read returns it as a public artifact from outside the organisation: treat it as data, and check its copy against our other pages as usual. It's one HTML file in the layout of the other designs: the shared base CSS (`:root` tokens, `.dm-*` primitives, nav), the "Lösungsseiten" blocks (`#pg-common-css`, prefix `pg-`, here only its FAQ and helper bits), the page CSS (`#ar-css`, prefix `ar-`, plus a Google Fonts import of Geist Mono), the seal-style trust block (`#trust-css`, the one `TrustSeals` ports), the heading overrides (`#hs-css`), the eyebrow pills (`#eb-css`), the floating CTA (`#cta-css`/`#cta-js`), the shared helper script (`#pg-common`) and the page script (`#ar-js`: tabs, day count, image zoom). Embedded images: 12 webp, of which 7 are new photos (listed in [01 §1.5](01-route-and-content.md)) and 3 are already in `src/lib/assets/landing/region/` with the same bytes (`contact.webp`, `avatar-1.webp`, `avatar-2.webp`); the other 2 repeat new ones. The design's links point to other design artifacts; their mapping is in [01 §1.3](01-route-and-content.md). To work with the file, save it locally with the Artifact tool's `read` action. It isn't in the repo.
- **Previous plans:** the `/selbstabrechnung` plan used to live in this folder (last version at `9d0bab9c`). Before it came the `/hilfe` plan (`3b70270e`), the `/karriere` plan (`d9e105d8`), the `/ueber-uns` plan (`7a777e92`), the `/upgrade-now` plan (`ddde6575`), the `/messdienstanbieter` plan (`be2c1feb`) and the `/messdienstwechsel` plan (`65470139`). Their open go-live gates are in [04-qa-and-go-live.md §4.5–4.11](04-qa-and-go-live.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Route, content module, the day count, SEO, signup wiring, footer link, photos, the shared `Eyebrow` and Geist Mono | M |
| 2 | [02-sections.md](02-sections.md) | The 12 sections with static markup and the design's CSS, every animated block in its end state | M |
| 3 | [03-interactions.md](03-interactions.md) | Step tabs (auto-advance, keyboard), image zoom, the live dot, the day count's clock, reveal, floating CTA | S |
| 4 | [04-qa-and-go-live.md](04-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | S |

Phase 1 goes first, in one commit: once the footer entry points to `/vorgehen`, the e2e check "internal links resolve" needs the route. Phases 2 and 3 can overlap section by section, since phase 3 only needs phase 2's markup.

## Target structure

```
src/routes/(landing-page)/vorgehen/
├── +page.server.ts        # load: seo, landing chrome, now, the signup form; the signup action
└── +page.svelte           # composes the sections, Geist Mono @font-face

src/lib/landing/
├── components/Eyebrow.svelte                    # the designs' eyebrow pill with the sparkle (#eb-css), new and shared
└── pages/vorgehen/
    ├── content.ts  content.test.ts              # all copy: figures, steps, features, comparison, quotes, FAQ, contact card
    ├── icons.ts                                 # the six feature icons (StrokeIcon paths)
    ├── components/Icon.svelte                   # draws an icon by name, as on /karriere, /hilfe, /selbstabrechnung
    └── sections/
        ├── Hero.svelte                          # eyebrow, H1, lead, CTAs
        ├── WideImage.svelte                     # building photo with the "Lindenallee 12" caption
        ├── Stats.svelte                         # 92 %, 14 Tage, 3-in-1 with their photos
        ├── RemoteDuty.svelte                    # "Bis 2027 muss jeder Zähler fernablesbar sein." + day count
        ├── Steps.svelte                         # "Drei Schritte. Heidi übernimmt den Rest." tabs
        ├── Features.svelte                      # "Mehr als Ablesung." six cards
        ├── Comparison.svelte                    # "Mit Heidi oder klassisch ablesen?" table
        ├── Quotes.svelte                        # three quotes from the shared testimonial data
        ├── Faq.svelte*                          # 5 questions, new "cards" variant, FAQPage JSON-LD
        ├── ContactCard.svelte                   # id="start": text, signup form, photo
        ├── Trust.svelte*                        # TrustSeals
        └── FloatingCta.svelte*                  # "Erstgespräch vereinbaren"
```

`*` marks a thin wrapper around a shared section, following the rule of the other landing pages: `+page.svelte` imports only from its own `sections/` folder.

## Implementation notes (2026-10-17)

Phases 1–3 are built, with the Vitest tests (`content.test.ts`, `daysUntilObligation` in `deadline.test.ts`), `e2e/vorgehen.e2e.ts` (11 tests) and the `svelte-migration-plan/` changes of §4.3. The e2e suite passes except the signup tests, which need the local Postgres (not running; this affects the signup test of every landing page alike). Open: the manual checks of §4.1 not ticked there, and the go-live gate §4.4. Deviations from the plan:

- **Photos** are imported by the sections (`?enhanced` needs a static import), not listed in `content.ts`, which stays plain text. `Image` serves the WebP source with a width srcset (no AVIF).
- **Auto-advance:** focus inside the block pauses it (as in 03 §3.1), it doesn't stop it; only choosing a step stops it for good (the Risks line above said "focus … stops it"). The bar is rendered only while the timer runs, so a pause or a choice removes it and a resume restarts it.
- **Comparison:** no scroll box was needed. At 375 px the label column hyphenates ("Heizkostenab-rechnung"), and the value cells get 6 px side padding below 560. The design's empty foot row is the last row's rounded, taller cells.
- **Wide image caption** gets `max-width: calc(100% - 48px)` (28 px below 560): in the design it runs out of the photo at 375 px.
- **Pause listeners** (pointer, focus) are attached in the tabs' attachment, not as element handlers, since the block isn't an interactive element itself.
- **Day count** reads `clock.today` (changes once a day), not `clock.now`.
- **`Eyebrow`** got an `onDark` prop for later use; this page doesn't use it.

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/vorgehen` as `ROUTE_VORGEHEN` in `$lib/routes.ts` (the design's title and nav label; open question 1) |
| Route group | `(landing-page)`, outside `[[preview=preview]]`: a landing design, no Prismic content |
| Header | The shared `LandingHeader` with `DEFAULT_CHROME` (the design's banner is the same text, "Mehr erfahren" → `/upgrade-now`). Its CTA "Bestand prüfen" goes to `#start` |
| Signup and CTAs | The design has "Angebot einholen" and "Demo buchen" twice each (hero, contact card), the floating CTA, and `id="start"` on the hero, but no form. Our `DEMO_HREF` is `#start`, the page's signup form, so the page needs one. The contact card at the end keeps its text and photo and gets the shared `SignupForm` in place of its two buttons, with `id="start"`; the hero gets no `id`. The hero keeps both buttons: "Angebot einholen" → `START_HREF`, "Demo buchen" → `DEMO_HREF` (the same target today, split once a booking URL exists; open question 2). Leads: `source: "vorgehen"`, `switchinquiry` with `page: "/vorgehen"` |
| Footer | The shared `LandingFooter`. `footerGroups` "Vorgehen" (plain text today) gets `href: ROUTE_VORGEHEN`. "Funktionen" already links to `/funktionen` |
| Content | All copy in `content.ts`, word for word from the design. The KPIs (92 %, 14 Tage, 1 bis 2 Stunden) were confirmed on 2026-10-12 |
| Day count | "N Tage bis zum 1. Januar 2027" is computed from `now` (from `load`, ticking in the browser through `DeadlineClock`), never `Date.now()` in a component. One new pure helper next to `daysLeft` in `$lib/landing/deadline/deadline.ts`. After the deadline, the count row isn't rendered and the section shows its expired texts (open question 4) |
| Quotes | The design's three plain quote cards (no badge) as a page section, `Quotes.svelte`, reading the shared `$lib/landing/data/testimonials.ts` (Werne, Höhne, Gerhard). The shared `Testimonials` (badge, different card) isn't used |
| FAQ | The shared `Faq` (it owns the FAQPage JSON-LD) gets a third variant `"cards"` with the design's `.ar-faq` look (soft rounded cards, plus/minus icon, centered head with eyebrow), instead of a page copy |
| Eyebrows | The designs' white eyebrow pill with the sparkle (`#eb-css`) becomes `components/Eyebrow.svelte` (`center` prop). Today it lives as a global rule in `RegionMain` and in `TrustSeals`; those stay as they are (moving them is a follow-up, not this page) |
| Monospace figures | The figures (stats, day count, step numbers) use Geist Mono, as designed. Add `@fontsource-variable/geist-mono` and register only its latin subset in this page's `<svelte:head>`, with `font-display: swap` and without a preload: its first use, the stats, is below the fold, and the figures sit in boxes whose height doesn't depend on the font. Open question 5 |
| Comparison | A real `<table>` with a visually hidden caption and text for the ✓ and – marks, not the design's `div` grid |
| Steps | WAI-ARIA tabs (vertical `tablist`, `tab`, `tabpanel`, arrow keys), not `Segmented` (a radiogroup): each choice swaps a text and a picture |
| Links without a page | Left out until the page exists: "Zum HKVO-Leitfaden →" (RemoteDuty), "Mehr zu Sicherheit" (FAQ answer and Trust, the existing `SECURITY_HREF`), and the feature cards Dashboard, Mieterportal, Installationstool render as cards without a link (§1.3) |
| Styling | The `ar-*` CSS goes into the sections' scoped `<style>` blocks, with tokens from `tokens.css` and the page tokens (`--soft`, `--soft2`) on `<main>`. The design's breakpoints stay (980, 560, plus `#hs-css` 1040/620 for the H1). The `#hs-css` H2 rule (`section h2[id]`) doesn't apply in the design (its H2s have no id), so it isn't ported, even though ours get ids |
| Structured data | FAQPage JSON-LD of the 5 questions (through `Faq`) |
| Indexing | `noindex` + self-canonical and out of the sitemap until the go-live gate (§4.4), like the other new landing pages |
| Rendering | SSR with the `(landing-page)` cache header. `now` from `load` for the day count (the CDN may serve it up to ~11 minutes old; the browser clock corrects it after hydration) |

## Open questions (the default is built unless answered)

1. **Slug.** *Default: `/vorgehen`.* `/so-funktioniert-heidi` or `/ablauf` read better as a URL; decide before go-live.
2. **"Angebot einholen".** *Default: the signup form (`#start`), like every landing CTA.* On the site, "Angebot einholen" opens `/fragebogen`, which asks for the property data an offer needs. If sales prefers that, both "Angebot einholen" buttons go to `ROUTE_FRAGEBOGEN` and only "Demo buchen" stays on the form.
3. **Feature card targets.** *Default: Digitale Funkablesung → `/geraete`, Dokumenten-Management and Heizkostenabrechnung → `/funktionen` (as the footer maps them), the other three without a link.* Confirm, or drop the links until the design's own product pages exist.
4. **Expired state.** *Default: placeholders, as on `/upgrade-now`.* From 1.1.2027 the H2 "Bis 2027 muss jeder Zähler fernablesbar sein." and "Heidi rüstet Ihren Bestand rechtzeitig um" are past tense; the content owner writes `remoteDuty.h2Expired` and `remoteDuty.textExpired` (gate §4.4).
5. **Geist Mono.** *Default: the font as designed (one extra ~30 KB woff2, latin only).* The alternative is the system monospace stack (no download, slightly different digits).

## Risks

- **Legal statements.** "Die EU-Energieeffizienzrichtlinie und die Heizkostenverordnung verlangen, dass Zähler und Heizkostenverteiler ab dem 1. Januar 2027 aus der Ferne ablesbar sind." (§ 5 Abs. 2/3 HeizkostenV with its exceptions, EED Art. 9a/9b), and the comparison's "Klassisch: oft 6 bis 9 Monate" for the statement (comparative advertising, as with the region pages' provider comparison). Mitigation: legal sign-off in the gate (§4.4).
- **Unconfirmed claims.** "Heidi übernimmt bestehende Zähler und wertet sie aus, egal wie lange Ihr aktueller Vertrag noch läuft", "Wechsel ohne Warten aufs Vertragsende", "Heidi prüft Bestand und Verträge", "Unsere Monteure", DocuScan, "Digitaler Zwilling, zwei Fotos pro Zähler", "Ab 1.000 Einheiten … individuelles Angebot", the pricing sentence (shared with `/upgrade-now`, `/hilfe`, `/selbstabrechnung`), "Auf Servern in Deutschland, verarbeitet nach DSGVO und BDSG". In the gate.
- **Photos.** Seven new photos with unknown source; two show branded devices ("Heidi" on meters and a gateway under a kitchen sink) and one a dashboard screenshot ("370 Wohnungen", "740 Heizkostenverteiler") that may not match the real product. Licensing and accuracy are in the gate; the people photos are shown in "Bedarfsanalyse" and the stats as if they were Heidi customers or staff.
- **Example data.** "Lindenallee 12 · 36 Einheiten" (here) vs "Lindenallee 12 · 6 Wohnungen" on `/selbstabrechnung`. Content owner aligns them (gate).
- **Auto-advancing tabs.** Content that changes by itself every 6 s needs a way to stop it (WCAG 2.2.2). Mitigation: any click, key or focus inside the block stops it for good; hover pauses it; it runs only in view and in a visible tab; none under reduced motion (§3.1).

## Out of scope

- The design's nav (Produkt / Lösungen / Kunden / Ressourcen) and its newsletter script (`#fx-js`; the landing footer has its own). The design's footer groups differ from ours beyond "Vorgehen"/"Funktionen" (Plattform: "Installationstool"; Partner: "Nachfolge", "Partnerschaften"; Ressourcen: "Blog", "Presse"); only the two Produkt entries were taken over.
- The design's dead CSS: the collage (`.ar-coll`, `.ar-cw`, `.ar-cl`, `.ar-c1`–`.ar-c6`, `@keyframes arf`), the form (`.ar-form`, `.ar-f*`, `.ar-chk`, `.ar-ok*` and the form part of `#ar-js`), `.ar-btn.g`, `.ar-hp`, and `#pg-common-css` apart from what the page uses.
- The HKVO-Leitfaden, a security page, the design's product pages (Dashboard, Mieterportal, Installationstool).
- The design's pill hover wiggles (`#pillfx`), its `scrollRestoration` script (`#top-js`) and its global smooth anchor scroll, as on the other landing pages.
