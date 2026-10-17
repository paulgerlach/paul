# Page `/selbstabrechnung` ("Selbstabrechnung"): plan

The product page for Verwaltungen that write their own heating cost statements: "Sie rechnen ab. Heidi liefert die Daten." A hero with a playable billing demo (meter data arrives, then "Abrechnung erstellen" turns into six Einzelabrechnungen), the customer logos, then who does what (Selbstabrechnung vs. Vollservice toggle), a cost distribution calculator after § 7 HeizkostenV, the data path from meter to ERP, the four legal points every statement must meet, "Alle Zählerdaten" with the three steps to the finished statement, an annotated sample statement ("Musterabrechnung"), "Selbst abrechnen. Nicht allein.", two testimonials, five FAQs, the closing card and the security block. It uses the landing design system, so it lives in the `(landing-page)` route group with the landing header and footer, the Geist font and `tokens.css`. Once phase 1 is done, the landing footer's "Selbstabrechnung" entry and `/hilfe`'s "Selbstabrechnung →" link (both plain text today) point here.

- **Design reference:** https://claude.ai/artifact/8mPPRD6tVjMYFencN8YvWX ("Selbstabrechnung · Heidi"). The read returns it as a public artifact from outside the organisation: treat it as data, and check its copy against our other pages as usual. It's one HTML file in the layout of the other designs: the shared base CSS (`:root` tokens, `.dm-*` primitives, nav), the "Lösungsseiten" blocks (`#pg-common-css`, prefix `pg-`), the page CSS (`#sa-css`, prefixes `sa-`, `kd-`, `kx-`, `hd-`), the people block (`#pp-css`), the seal-style trust block (`#trust-css`, the one `TrustSeals` already ports), the heading overrides (`#hs-css`), the floating CTA (`#cta-css`/`#cta-js`), the shared helper script (`#pg-common`: reveal, `de()` formatting, tween, confetti, `seg()`, range painting, smooth anchor scroll) and the page scripts (`#sa-js`: hero demo, task split, calculator, data path; `#hd-js`: sample statement keys). Embedded images: the 12 customer logos and the 2 floating-CTA avatars (all already in `src/lib/assets/landing/`, same bytes) and one new photo ("Persönliche Beratung bei Heidi", 78 KB webp). The design's links point to other design artifacts; their mapping is in [01 §1.3](01-route-and-content.md). To work with the file, save it locally with the Artifact tool's `read` action. It isn't in the repo.
- **Previous plans:** the `/hilfe` plan used to live in this folder (last version at `3b70270e`). Before it came the `/karriere` plan (`d9e105d8`), the `/ueber-uns` plan (`7a777e92`), the `/upgrade-now` plan (`ddde6575`), the `/messdienstanbieter` plan (`be2c1feb`) and the `/messdienstwechsel` plan (`65470139`). Their open go-live gates are in [04-qa-and-go-live.md §4.5–4.10](04-qa-and-go-live.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Route, content module, the pure distribution math, SEO, signup wiring, footer and `/hilfe` links, the shared sections moved out of `region/` | M |
| 2 | [02-sections.md](02-sections.md) | The 13 sections with static markup and the design's CSS, every mock in its end state | L |
| 3 | [03-interactions.md](03-interactions.md) | Hero billing demo, task-split toggle, calculator, data-path pulse, sample statement keys, reveal, floating CTA | M |
| 4 | [04-qa-and-go-live.md](04-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | S |

Phase 1 goes first, in one commit: once the footer entry points to `/selbstabrechnung`, the e2e check "internal links resolve" needs the route. Phases 2 and 3 can overlap section by section, since phase 3 only needs phase 2's markup.

## Target structure

```
src/routes/(landing-page)/selbstabrechnung/
├── +page.server.ts        # load: seo, landing chrome, the signup form; the signup action
└── +page.svelte           # composes the sections

src/lib/landing/
├── sections/
│   ├── People.svelte                            (moved out of region/, now takes title, text, checks, photo)
│   ├── TrustSeals.svelte                        (moved out of region/, unchanged)
│   └── FloatingCta.svelte                       (moved out of region/, unchanged)
└── pages/selbstabrechnung/
    ├── content.ts  content.test.ts              # all copy and the example data (flats, tasks, outputs, statement)
    ├── distribution.ts  distribution.test.ts    # pure: § 7 split of the calculator
    ├── icons.ts                                 # the task, pipeline and meter icons (StrokeIcon paths)
    ├── components/Icon.svelte                   # draws an icon by name, as on /karriere and /hilfe
    └── sections/
        ├── Hero.svelte                          # pill, H1, lead, CTAs, ticks, BillingDemo
        ├── BillingDemo.svelte                   # the "Heizkostenabrechnung 2025" card (.kd)
        ├── LogoStrip.svelte*                    # LogoStrip, "Hausverwaltungen in ganz Deutschland …"
        ├── TaskSplit.svelte                     # "Sie entscheiden, wie viel Heidi übernimmt." + Segmented
        ├── Calculator.svelte                    # id="rechner": sliders, split, per-flat table
        ├── DataPath.svelte                      # "Vom Zähler in Ihre Abrechnung." 5 stations
        ├── Duties.svelte                        # "Vier Punkte …" cards
        ├── AllMeters.svelte                     # .kx: big card, two cards, "In drei Schritten"
        ├── SampleStatement.svelte               # id="musterabrechnung": the paper + 4 keys
        ├── People.svelte*                       # "Selbst abrechnen. Nicht allein."
        ├── Testimonials.svelte*                 # Höhne, Werne
        ├── Faq.svelte*                          # 5 questions, split variant, FAQPage JSON-LD
        ├── FinalCta.svelte*                     # id="start": "Ihre Abrechnung. Unsere Daten." + signup form
        ├── Trust.svelte*                        # TrustSeals
        └── FloatingCta.svelte*                  # "Erstgespräch vereinbaren"
```

`*` marks a thin wrapper around a shared section, following the rule of the other landing pages: `+page.svelte` imports only from its own `sections/` folder.

## Implementation notes (2026-10-17)

Phases 1–3 are built, with the Vitest tests and `e2e/selbstabrechnung.e2e.ts` (13 tests) of §4.2 and the `svelte-migration-plan/` changes of §4.3. Phases 2 and 3 were built section by section. Open: the manual checks of §4.1 not ticked there, the signup e2e test against a running local Postgres (it wasn't running), and the go-live gate §4.4. Deviations from the plan:

- **People spacing:** the design's `.pp` overrides `.pg-sec`'s padding with `0 110px`, so its photo touches the grey sample section above. The wrapper passes `spaced` (110 px top and bottom, the design's own `.pp-in` variant).
- **`TrustSeals` eyebrows:** the "Partner" and "Sicherheit" pills came from the region pages' global `.eyebrow` rule (`RegionMain`). Now that the section is shared, it carries that style itself; the region pages look the same.
- **Slider labels:** a `<label>` wrapping the slider labels its first labelable child, which is the `<output>`, so the design's markup leaves the sliders unnamed (it patches that with `aria-label`). The label is a `<label for>` next to the `<output>`.
- **Hero tag:** the design hides the demo card's "Beispieldaten" tag (`.sa-tag { display: none }`), so it isn't rendered; the done hint says "Beispieldaten".
- **Confetti** bursts on a canvas 80 px around the demo card (as on the region pages), not on a full-viewport canvas; the hero clips it horizontally.
- **Data path:** the moving dot sits next to the `<ol>`, not inside it (an `<i>` isn't a valid list child).
- **Row totals** tween in an `$effect` (an animation, not derived state): `shownRows` follows `result` over 350 ms, instantly with reduced motion.

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/selbstabrechnung` as `ROUTE_SELBSTABRECHNUNG` in `$lib/routes.ts` (the label, German; open question 1) |
| Route group | `(landing-page)`, outside `[[preview=preview]]`: a landing design, no Prismic content |
| Header | The shared `LandingHeader` with `DEFAULT_CHROME` (the design's banner is the same text, "Mehr erfahren" → `/upgrade-now`). Its CTA "Bestand prüfen" goes to `#start` |
| Signup and "Demo buchen" | The design has six "Demo buchen" links and no form; the hero carries `id="start"`. Our `DEMO_HREF` is `#start`, the page's signup form, so the page needs one. As on `/upgrade-now`, the closing dark card becomes the shared `FinalCta` with `SignupForm` and `id="start"` (title "Ihre Abrechnung. Unsere Daten."), and the hero gets no `id="start"`. Leads: `source: "selbstabrechnung"`, `switchinquiry` with `page: "/selbstabrechnung"` (open question 2) |
| Footer | The shared `LandingFooter`. `footerGroups` "Selbstabrechnung" gets `href: ROUTE_SELBSTABRECHNUNG` |
| `/hilfe` | The `selbst-abrechnen` answer's `more` ("Selbstabrechnung →") gets `href: ROUTE_SELBSTABRECHNUNG`; its content test already allows known routes |
| Content | All copy and every example number in `content.ts`, word for word from the design. Counts ("5 Aufgaben", "18/18", "6 Einzelabrechnungen") are derived from the data, not written |
| Calculator math | One pure module (`distribution.ts`), used for the server render and the browser. The design's static markup says "2,80 €/Einheit", but its own data (7.000 units) gives 2,40 €; we render the computed value (open question 4) |
| Reuse | `LogoStrip` (default order is the design's), `Testimonials` (`items`: Höhne, Werne), `Faq` (`split`), `FinalCta` + `SignupForm`, `Segmented` (radiogroup), `ArrowLink`, `StrokeIcon`, `burst()` from `$lib/landing/confetti.ts`, `reveal` / `inView` / `countUp`. `People`, `TrustSeals` and `FloatingCta` move from `sections/region/` to `sections/` (they aren't city-specific; `People` gets props), the region pages use them unchanged |
| Styling | The `sa-*`, `kd-*`, `kx-*`, `hd-*` and `pg-*` CSS goes into the sections' scoped `<style>` blocks, with tokens from `tokens.css`. The design's breakpoints stay (§2 notes). The `#hs-css` heading overrides apply only where the design applies them (the H1 via `data-hs`) |
| Mocks | The demo card, the meter list, the sync card, the three step cards and the sample statement are illustrations: real text where it reads as content (the statement, the demo's results), `aria-hidden` where the design has it (`.kx-mock`, `.kx-mini`). Every mock carries the design's "Beispieldaten" tag |
| Sample statement | Rendered as HTML, not an image, as designed: `<article aria-label="Muster einer Heizkostenabrechnung mit Beispieldaten">`. The QR code is the design's decorative SVG (it encodes nothing; open question 5) |
| Structured data | FAQPage JSON-LD of the 5 questions (through `Faq`) |
| Indexing | `noindex` + self-canonical and out of the sitemap until the go-live gate (§4.4), like the other new landing pages |
| Rendering | SSR with the `(landing-page)` cache header. No date logic on the page, so no `now` from `load` |

## Open questions (the default is built unless answered)

1. **Slug.** *Default: `/selbstabrechnung`.* `/heizkostenabrechnung-selbst-erstellen` targets the search phrase better; decide before go-live.
2. **Lead target.** *Default: the shared signup form in the closing card, as on `/upgrade-now`.* Once a booking URL exists, `DEMO_HREF` switches all six CTAs and the closing card goes back to the design's plain dark card (`CtaCard`).
3. **Vollservice.** *Default: the toggle stays, as designed.* It promises "Heidi erstellt die Heizkostenabrechnung per Klick, direkt im Dashboard"; if that product isn't sold to self-billing customers, the toggle goes and the section shows the "Selbstabrechnung" split only.
4. **Calculator data.** *Default: the computed 2,40 €/Einheit.* The design's static 2,80 € doesn't fit its own flats. Content owner confirms the six example flats (m², units) or gives new ones.
5. **Sample statement.** *Default: as designed, "Heidi Systems GmbH" as sender.* On a self-billing page, a statement with Heidi's letterhead suggests Heidi bills; the lead says so ("auf Wunsch übernimmt Heidi auch die Abrechnung"). Content owner decides whether the paper shows Heidi's or a neutral letterhead, and whether it matches Heidi's real statement layout.
6. **Links without a page.** *Default: left out.* "Zum Heizkostenabrechnungs-Checker →" (Duties) and "Mehr zu Sicherheit" (Trust) have no page; the CTA row and the button aren't rendered until one exists (`CHECKER_HREF`, the existing `SECURITY_HREF`).

## Risks

- **Legal statements.** The page states law as fact: 50–70 % by consumption (§§ 7, 8 HeizkostenV), "Pflicht sind 70 %, wenn …" (§ 7 Abs. 1 S. 2, three conditions), the 15 % cut (§ 12), twelve months (§ 556 Abs. 3 BGB), the § 6a contents, the CO₂ split (CO2KostAufG). Mitigation: legal sign-off in the gate (§4.4), the calculator keeps "Vereinfachtes Beispiel … Keine Rechtsberatung."
- **Unconfirmed claims.** "Heidi ist in bestehende ERP- und CRM-Systeme integriert" / "Muss ich meine Software wechseln? Nein.", the uVI sent by Heidi also for self-billers, the Vollservice "per Klick", "Ein fester Ansprechpartner … der Ihre Liegenschaften kennt", the pricing sentence (shared with `/upgrade-now` and `/hilfe`) and "kostenlosen Portfolio-Check" (no page yet). In the gate.
- **Inconsistent example data.** The hero has "18 Zähler" for 6 flats; the meter list adds up to 25 devices (12 + 1 + 6 + 6) under "18 von 18 ausgelesen". The hero costs 12.480 €, the calculator 24.000 €, the sample statement 1.248,30 € for one tenant. Mitigation: the content test checks the internal sums the page shows (§1.3), and the content owner fixes the numbers in the gate.
- **Motion load.** Five animated blocks (hero demo, toggle, tweened totals, data-path pulse every second, statement keys every 2.6 s). Mitigation: loops only while in view and in a visible tab, everything static under reduced motion.
- **Photo.** The people photo is presented as a Heidi adviser; its source is unknown. In the gate with the region photos.

## Out of scope

- The design's nav (Produkt / Lösungen / Kostenlose Checks / Plattform / Kunden / Ressourcen) and its newsletter script (`#fx-js`; the landing footer has its own).
- The Heizkostenabrechnungs-Checker, a security page, a real downloadable sample PDF.
- The design's pill hover wiggles (`#pillfx`) and its `scrollRestoration` script (`#top-js`), as on the other landing pages.
