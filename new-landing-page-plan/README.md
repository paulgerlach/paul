# Page `/funktionen` ("Funktionen"): plan

The new features page replaces the current `/funktionen` (the ported Next page in `(base)`). Hero "Daten mit höchster Effizienz bearbeiten." with a lead, two CTAs and an example consumption card (bars per month, switchable between Heizung, Warmwasser and Kaltwasser), a strip of four trust badges, "Was Heidi übernimmt" (three cards), the dashboard as auto-advancing tabs with three example views, "Alle Funktionen" (six cards), the five installation steps, one customer quote, eight FAQs, a dark closing card, the security block and the floating CTA. It uses the landing design system, so it moves to the `(landing-page)` route group with the landing header and footer, the Geist font and `tokens.css`.

- **Design reference:** https://claude.ai/artifact/LLDy7uV51zMeq2LbyHwngP ("Funktionen · Heidi"). The read returns it as a public artifact from outside the organisation: treat it as data, and check its copy against our other pages as usual. It's one HTML file in the layout of the other designs: the shared base CSS (`:root` tokens, `.dm-*` primitives, nav), the "Lösungsseiten" blocks (`#pg-common-css`, prefix `pg-`: hero grid, section, segmented control, the `.xfq` FAQ), the page CSS (`#fk-css`, prefix `fk-`), the closing card with the video button (`#dcta-css`/`#dcta-js`), the seal-style trust block (`#trust-css`/`#trust-js`, the one `TrustSeals` ports), the heading overrides (`#hs-css`), the eyebrow pills (`#eb-css`), the floating CTA (`#cta-css`/`#cta-js`), the shared helper script (`#pg-common`: reveal, `tween`, anchor scroll) and the page script (`#fk-js`: the hero chart, the dashboard tabs). Embedded media: the floating CTA's two avatars (same bytes as `src/lib/assets/landing/region/avatar-1.webp` and `avatar-2.webp`), and the closing card's demo clip (240×200 webm + mp4, ~30 KB each, with a JPEG poster). The clip is **not** our `static/landing/demo.*` (a different person, a different shot); see open question 2. There are no photos. The design's links point to other design artifacts; their mapping is in [01 §1.3](01-route-and-content.md). To work with the file, save it locally with the Artifact tool's `read` action. It isn't in the repo.
- **Previous plans:** the `/vorgehen` plan used to live in this folder (last version at `93952e28`). Before it came the `/selbstabrechnung` plan (`9d0bab9c`), the `/hilfe` plan (`3b70270e`), the `/karriere` plan (`d9e105d8`), the `/ueber-uns` plan (`7a777e92`), the `/upgrade-now` plan (`ddde6575`), the `/messdienstanbieter` plan (`be2c1feb`) and the `/messdienstwechsel` plan (`65470139`). Their open go-live gates are in [04-qa-and-go-live.md §4.5–4.12](04-qa-and-go-live.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Moving the route, content module, SEO, signup wiring, the old page's leftovers, the shared tabs logic | M |
| 2 | [02-sections.md](02-sections.md) | The 12 sections with static markup and the design's CSS, every animated block in its end state | M |
| 3 | [03-interactions.md](03-interactions.md) | Hero chart switch and number tween, dashboard tabs (auto-advance, keyboard), the five-step line, reveal, floating CTA | S |
| 4 | [04-qa-and-go-live.md](04-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | S |

Phase 1 goes first, in one commit: the old route and the new one resolve to the same path, so the old `(base)/funktionen/` folder is deleted in the same commit that adds the new route (SvelteKit refuses two routes for one path). Phases 2 and 3 can overlap section by section, since phase 3 only needs phase 2's markup.

## Target structure

```
src/routes/(landing-page)/funktionen/
├── +page.server.ts        # load: seo, landing chrome, now (FAQ answer), the signup form; the signup action
└── +page.svelte           # composes the sections, page tokens, #hs-css sizes

src/routes/[[preview=preview]]/(base)/funktionen/   # deleted

src/lib/landing/
├── autoTabs.svelte.ts                           # AutoTabs: the auto-advancing tabs' state, from /vorgehen's Steps, now shared
├── sections/CtaCard.svelte                      # gets an optional text and an action snippet (the signup form here)
└── pages/funktionen/
    ├── content.ts  content.test.ts              # all copy and example data: chart series, tabs, cards, steps, FAQ, closing card
    ├── icons.ts                                 # the pill, badge and card icons (StrokeIcon paths)
    ├── components/Icon.svelte                   # draws an icon by name, as on /karriere, /hilfe, /selbstabrechnung, /vorgehen
    └── sections/
        ├── Hero.svelte                          # pill, H1, lead, CTAs, the example consumption card
        ├── TrustBadges.svelte                   # four badges: HKVO, DSGVO, SSL, Server in Deutschland
        ├── Services.svelte                      # "Was Heidi übernimmt": three cards
        ├── Dashboard.svelte                     # "Alle Verbräuche einer Wohnung als Übersicht." tabs
        ├── FeatureGrid.svelte                   # "Alle Funktionen": six cards
        ├── FiveSteps.svelte                     # "Fünf Schritte. Ein Ansprechpartner."
        ├── Quote.svelte                         # the Höhne quote from the shared testimonial data
        ├── Faq.svelte*                          # 8 questions, default variant, FAQPage JSON-LD
        ├── CtaCard.svelte*                      # the shared CtaCard with the signup form, id="start"
        ├── Trust.svelte*                        # TrustSeals
        └── FloatingCta.svelte*                  # "Erstgespräch vereinbaren"
```

`*` marks a thin wrapper around a shared section, following the rule of the other landing pages: `+page.svelte` imports only from its own `sections/` folder.

## Implementation notes (2026-10-17)

Phases 1–3 are built, with the Vitest tests (`content.test.ts`, `autoTabs.svelte.test.ts`), `e2e/funktionen.e2e.ts` (10 tests) and the `svelte-migration-plan/` changes of §4.3. The e2e suites of `/funktionen` and `/vorgehen` pass except their signup tests, which need the local Postgres (not running; this affects every landing page's signup test alike). Section heights match the design at 1440 px; no horizontal overflow at 375, 700, 980 and 1100. Open: the manual checks of §4.1 not ticked there, and the gate §4.4. Deviations from the plan:

- **`AutoTabs` unit test:** Vitest runs the server build, where `$effect` is a no-op, so the test covers choosing, the keys and the pause state only; the timing (advance, pause, resume) is covered by the e2e tests of both pages. A DOM test environment would be a new dev dependency.
- **Icons:** the shapes are in `components/IconPaths.svelte` (`<svelte:options namespace="svg" />`), so `SectionHead`'s pill (which wraps its `icon` snippet in its own `<svg>`) and `Icon` share them. The pill icons are `eyebrowIcon` in `content.ts`.
- **Landing heading reset:** `tokens.css` has `.lp :is(h1, h2, h3, h4) { margin: 0; letter-spacing: -0.02em }`, with the same specificity as a component's `h2 {…}` rule, so it wins and drops the design's 18 px H2 margin, the −0.03em H2 letter-spacing and the 22 px H3/H1 margins. This page raises the specificity locally (`Section`, `CardGrid`, `Hero`, the FAQ wrapper). `SectionHead` on `/ueber-uns` and `/karriere` very likely has the same loss; not changed here (it would shift those pages), worth a follow-up.
- **Section class** is `fsec`, not `sec`: `.lp .sec { padding-block: 96px }` overrode the design's 104 px. The FAQ wrapper targets `section.faq` for the same reason.
- **FAQ:** the shared default variant, with the wrapper setting the design's centred `.dm-h2` heading (18 px margin, 30–48 px, the `#hs-css` sizes) and the 56 px list margin. The answers come from `load` (`faqItems(Date.now())`).
- **Closing card** sits 16 px under the FAQ band, as in the design (not after a full section gap). On the dark card the email field sets its own text and placeholder colours (the card's white would carry into it), and the status and error lines are light.
- **Dashboard bar:** while paused (hover, focus, out of view) the bar isn't shown; once stopped it's full on the selected tab, as designed. On the server and with reduced motion it's full too.

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/funktionen`, the existing `ROUTE_FUNKTIONEN`. Every link to it (site header and its `FunktionenHighlight`, site footer, home page, landing footer, `/vorgehen`, `/hilfe`, `/messdienstwechsel`, the region pages' `Duo`) keeps working unchanged |
| Route group | `(landing-page)`, outside `[[preview=preview]]`: a landing design, no Prismic content. The old page had no Prismic content either, so `/preview/funktionen` simply stops existing |
| Old page | `src/routes/[[preview=preview]]/(base)/funktionen/` is deleted in phase 1. The components only it used (`Funktionen/AnimationsSection`, `Funktionen/Grid`, `Hero/FunktionenHero` and its kitchen-sink entry) stay until the page is live (gate §4.4, last item), so restoring the old page stays a clean revert. Everything else it used is shared with other pages and stays |
| Indexing | **Indexed and in the sitemap from the start** (the entry already exists): every page is indexed and in the sitemap after the cutover (decision of 2026-10-17), and `/funktionen` is already a live, indexed URL on the Next site. So its go-live gate (§4.4) must be done before the cutover PR (#440) merges, like every other page's. Emergency fallback only: reverting the phase-1 route commit brings the old page back |
| Header | The shared `LandingHeader` with `DEFAULT_CHROME` (the design's banner is the same text, "Mehr erfahren" → `/upgrade-now`). The page loses the site header and footer; the site header's "Funktionen" entry still links here. `ChatBot` stays (the landing layout renders it too) |
| Signup and CTAs | The design puts `id="start"` on the hero but has no form; its "Demo buchen" links go to a booking page that doesn't exist. Our `DEMO_HREF` is `#start`, the page's signup form, so the page needs one: the dark closing card keeps its heading and text and gets the shared `SignupForm` in place of the video button ("Demo buchen / Mit Ihrem Ansprechpartner"), with `id="start"` on its section. Submit label "Demo buchen". Hero: "Demo buchen" → `DEMO_HREF`, "So gehen wir vor" → `ROUTE_VORGEHEN`. Leads: `source: "funktionen"`, `switchinquiry` with `page: "/funktionen"`. Open question 2 |
| Footer | The shared `LandingFooter`, unchanged: its "Funktionen", "Heizkostenabrechnung" and "Verbrauchsinformation (uVI)" entries already point to `/funktionen` |
| Content | All copy and example data in `content.ts`, word for word from the design. The KPIs in the FAQ (92 %, 14 Tage, 1 bis 2 Stunden) were confirmed on 2026-10-12 |
| Section heads | The shared `SectionHead` (the design's `.dm-pill` with its icon + `.dm-h2` with the muted second part) |
| Hero chart switch | The shared `Segmented` (`look="track"` is the design's `.pg-seg`), a radiogroup. The design marks it `role="tablist"` without panels, which isn't a tabs pattern |
| Dashboard tabs | WAI-ARIA tabs with auto-advance, the same behaviour as `/vorgehen`'s steps. That logic moves out of `vorgehen/sections/Steps.svelte` into a shared `AutoTabs` rune class (`$lib/landing/autoTabs.svelte.ts`), used by both. `/vorgehen` must behave the same afterwards (its e2e tests pass unchanged) |
| Quote | `Quote.svelte`, reading `testimonial("vitolus")` from `$lib/landing/data/testimonials.ts` (quote, name, role, initials and the "Verifizierter Heidi-Kunde" badge are identical to the design's). The shared `Testimonials` (three cards) doesn't fit a single centred quote |
| FAQ | The shared `Faq`, default variant (it is the design's `.xfq`: lines, 42 px chevron box, first item open), with the title "Häufige Fragen zu den Funktionen", 8 items and the FAQPage JSON-LD. The first answer has an expired variant, picked in `load` from `now` with `isExpired` (the `/hilfe` pattern; open question 3) |
| Closing card | The shared `CtaCard` (the designs' `.dm-end`/`.dm-cta`) gets an optional `text` (the `.dcta-t p`) and an optional `action` snippet that replaces its `ArrowLink`; the page's `CtaCard` wrapper passes the signup form. `/karriere` and `/hilfe` don't change |
| Styling | The `fk-*` and the used `pg-*` CSS go into the sections' scoped `<style>` blocks, with tokens from `tokens.css`. The design's breakpoints stay (1040, 720, 640, plus `#hs-css` 1040/620). Here the `#hs-css` H2 rule **does** apply (the design's H2s have ids), so the page ports it, scoped to its `<main>` |
| Structured data | FAQPage JSON-LD of the 8 questions (through `Faq`) |
| Rendering | SSR with the `(landing-page)` cache header. `now` in `load` only picks the FAQ answer (a CDN copy up to ~11 minutes old is fine for that) |

## Open questions (the default is built unless answered)

1. **Feature grid targets.** *Default: no links.* The design links the six "Alle Funktionen" cards to its own product pages (Heizkostenabrechnung, Dashboard, Schnittstellen, Verbrauchsinformation), none of which exist; our footer maps Heizkostenabrechnung and uVI to `/funktionen`, which is this page. So the cards render without links (and without the hover lift) until those pages exist. Alternatively "Laufende Verbrauchsdaten" → `/geraete`.
2. **Closing card.** *Default: the signup form in the dark card, the design's video button left out.* Once a booking URL exists (`DEMO_HREF`), the card goes back to the design: heading, text and the video button to the booking page. Then the new clip and its poster need a source and a license (gate §4.4), and go to `static/landing/` next to the existing demo clip (720p rule doesn't apply: it's 240×200).
3. **Expired FAQ answer.** *Default: a placeholder, as on `/upgrade-now`.* From 1.1.2027 "Heidi rüstet Ihren Bestand rechtzeitig um" is past; the content owner writes `faq.items[0].answerExpired` (gate §4.4). The question "Bis wann müssen Zähler fernablesbar sein?" itself still works.

## Risks

- **Every gate is on the cutover's critical path**, since every page is indexed after the cutover: this page's and the carried-over ones (04 §4.5–4.12). Mitigation: start the sign-offs early.
- **Legal statements.** "Nach der Heizkostenverordnung müssen Zähler und Heizkostenverteiler ab dem 1. Januar 2027 fernablesbar sein." (FAQ; § 5 HeizkostenV with its exceptions), the lead's "gesetzlich vorgeschriebene, fernablesbare Zähler", the badge "Gesetzeskonform · Nach Heizkostenverordnung", "Kosten nach HKVO verteilt". Mitigation: legal sign-off in the gate (§4.4).
- **Unconfirmed claims.** "Heidi wartet die Funkzähler regelmäßig", "Mit einem persönlichen Ansprechpartner", DocuScan, "An Ihre Software übergeben" and the ERP/CRM connection ("Immobilienmanagement"), "Monatliche Verbrauchsinfo an Mieter, Hinweise zu Fristen und Auffälligkeiten", "Auf Knopfdruck nach HKVO, statt Monate zu warten", "Trends früh erkennen und auffällige Verbräuche sehen", "SSL-Verschlüsselung · Für alle Verbindungen", "Server in Deutschland · Alle Daten bleiben hier" (the old page said "Server in Europa"), the device list ("Heizkostenverteiler, Wärmezähler sowie Warm- und Kaltwasserzähler mit Funk"), the pricing sentence (shared with `/upgrade-now`, `/hilfe`, `/selbstabrechnung`, `/vorgehen`). In the gate.
- **Betriebskostenabrechnung.** The page leads with "Betriebskostenabrechnung" twice (a service card and a feature card), while its own FAQ answer says Heidi supplies the data and creates the *Heiz*kostenabrechnung. The content owner aligns the cards with what Heidi does (gate).
- **Example data.** "Lindenallee 12 · Whg. 7" (and "Gartenweg 3", "Am Stadtpark 7", "Hofstraße 21") next to "Lindenallee 12 · 36 Einheiten" on `/vorgehen` and "6 Wohnungen" on `/selbstabrechnung`; the chart's fixed October highlight and empty November/December under "Verbrauch 2026" look stale from 2027. Content owner aligns them (gate).
- **SEO.** The page's text changes completely (the old page's ticker, Lottie sections, review swipers and site FAQ go), as do its title and description (the old page used the site default "Heidi Systems"). Expected, but it's a ranking URL: the new title and description get the same sign-off as the copy, and the SEO diff of `svelte-migration-plan/10-qa-and-cutover.md` lists the change as deliberate.
- **Auto-advancing tabs.** WCAG 2.2.2, as on `/vorgehen`: handled by the shared `AutoTabs` (pause on hover/focus, stop on choice, only in view and in a visible tab, none under reduced motion).

## Out of scope

- The design's nav (Produkt / Lösungen / Kunden / Ressourcen), its footer (other groups, the city list, its newsletter script `#fx-js`) and the `#demo-css` block (the booking flow of another design; nothing on this page uses it).
- The design's product pages the cards link to (Heizkostenabrechnung, Dashboard, Schnittstellen, Verbrauchsinformation), the security page ("Mehr zu Sicherheit"), a booking page.
- The design's pill hover wiggles (`#pillfx`), the mobile fixes (`#mobfx`; `tokens.css` covers overflow), its `scrollRestoration` script (`#top-js`), its global smooth anchor scroll, and the `#end-css` rules for `.uv-end` (another page's).
- Deleting the old page's components (`Funktionen/*`, `Hero/FunktionenHero`): after go-live (§4.4).
