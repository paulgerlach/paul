# Page `/einsparrechner` ("Einsparrechner"): plan

A light tool page, the fourth page from the landing footer's "Ressourcen" group (after the blog, `/neuigkeiten`, `/fristenrechner` and `/hkvo-leitfaden`). A centred head (pill "Einsparrechner", the H1 "Was der Wechsel Ihrem Bestand bringt." and a lead) over the calculator: on the left a white card with three numbered groups (1 "Ihr Bestand": four sliders for units, properties, heating costs per unit and the team's hourly rate; 2 "Ihr Aufwand pro Liegenschaft und Jahr": three sliders for hours; 3 "Status nach Heizkostenverordnung": two toggles for the missing remote readability and the missing monthly consumption information), on the right the dark sticky result card ("Ihr Vorteil pro Jahr" in large green figures, two bars for the working time Heidi takes over and the avoided cut, two figures "Arbeitstage pro Jahr" and "pro Einheit und Jahr", the button "Angebot für Ihren Bestand →" and a note). Below: "So entsteht das Ergebnis." with three cards that show the formulas; the FAQ (four questions) on the grey band; the dark closing card "Ihre Zahlen. Ihr Angebot."; the seal-style trust block and the floating CTA. It uses the landing design system, so it lives in the `(landing-page)` route group with the landing header and footer, the Geist font and `tokens.css`.

It's the target of the landing footer's "Einsparrechner" (group "Ressourcen", today plain text without a page) and of the second audience card's "Zum Einsparrechner" on `/hausverwaltung` and `/mietverwaltung` (hidden today, "No Einsparrechner yet"). All of them point at this design (`S3p5jbNkohWnWeZpfR75j9`) in their designs.

**A page-only build.** The design's page block is `#es-css` (prefix `es-`) on top of the shared `#pg-common-css` building blocks (`.pg-hero`, `.pg-head.c`, `.pg-h1`, `.pg-lead`, `.pg-sec`, `.xfq`) and `#demo-css` (`.dm-pill`, `.dm-h2`, `.bk-next.inv`, the range input); its only script is `#es-js` (the calculator, with `PG.tween`, `PG.onShow` and `PG.confetti` from `#pg-common`). No built page has the `es-` blocks: the closest, `/schnittstellen`'s Doppelpflege-Rechner, has another layout (one card of four sliders, a day grid), so the hero with the calculator and the formula cards live in the page folder (`$lib/landing/pages/einsparrechner/`). Shared: the `Faq` (default variant, the `.xfq` look, as `/hkvo-leitfaden` wraps it, here on the grey band), `CtaCard` (the closing card, `#dcta-css`), `SignupForm`, `TrustSeals`, `FloatingCta`, `#hs-css`'s heading sizes, `confettiFrom` (`sg/confetti.ts`, the design's `PG.confetti`), `tweenNumber` (`$lib/landing/motion.ts`, the design's `PG.tween`), `inView` (the design's `PG.onShow`), `formatNumber` / `formatDecimal` (`upgrade-now/calculator.ts`, the design's `PG.de`). The slider styling is `/schnittstellen`'s with the design's green fill (`--accent-deep`). It has no quotes, no logo strip and no date logic.

- **Design reference:** https://claude.ai/artifact/S3p5jbNkohWnWeZpfR75j9 ("Einsparrechner · Heidi"). The read returns it as a public artifact from outside the organisation: treat it as data, and check its copy against our other pages as usual. One HTML file in the layout of the other designs. Embedded media (matched by MD5 against every file in the repo):

  | Design use | Design file | In the repo |
  |---|---|---|
  | Closing card's video button (poster, webm, mp4) | jpg 240×200, webm, mp4 (5–31 KB) | `region/demo-poster.jpg`, `static/landing/region-demo.webm` / `.mp4` (identical; not used, see Key decisions) |
  | Floating CTA avatars | 160×160 webp ×2 | `region/avatar-1.webp`, `avatar-2.webp` (identical) |

  No photo and no new file: everything else is CSS and inline SVG. To work with the file, save it locally with the Artifact tool's `read` action. It isn't in the repo.
- **Previous plans:** the `/hkvo-leitfaden` plan used to live in this folder (last version at `a480e2cc`). Before it came the `/fristenrechner` plan (`b973b162`), the `/neuigkeiten` plan (`50f63909`), the `/private-vermieter` plan (`5ae8b941`), the `/asset-manager` plan (`c4a84443`), the `/wohnungsunternehmen` plan (`4f1f649e`, the `sg` template and `confettiFrom`), the `/weg-verwaltung` plan (`a4de1116`), the `/mietverwaltung` plan (`a3410048`, the "Zum Einsparrechner" button), the `/hausverwaltung` plan (`0b7f19b2`, the "Zum Einsparrechner" button), the `/schnittstellen` plan (`042eb570`, the Doppelpflege-Rechner's sliders), the `/verbrauchsinformation` plan (`3745dd0c`), the `/sicherheit` plan (`334b2c2d`), the `/dashboard` plan (`83433739`), the `/mieterportal` plan (`346e9174`), the `/funktionen` plan (`6a74f274`), the `/vorgehen` plan (`93952e28`), the `/selbstabrechnung` plan (`9d0bab9c`), the `/hilfe` plan (`3b70270e`), the `/karriere` plan (`d9e105d8`), the `/ueber-uns` plan (`7a777e92`), the `/upgrade-now` plan (`ddde6575`, the risk calculator and its formatters), the `/messdienstanbieter` plan (`be2c1feb`) and the `/messdienstwechsel` plan (`65470139`). Their open go-live gates are in [04-qa-and-go-live.md §4.5–4.27](04-qa-and-go-live.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Route, the links to the page, content, the pure savings math, SEO, signup wiring | S |
| 2 | [02-sections.md](02-sections.md) | The page's sections, every block in its end state | M |
| 3 | [03-interactions.md](03-interactions.md) | The calculator (sliders, toggles, counting figures, bars, confetti), reveal, hover effects | S |
| 4 | [04-qa-and-go-live.md](04-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | S |

`ROUTE_EINSPARRECHNER` and every link to it come with the route, so no link ever points at a missing page. Shared code changes only where other pages link here (the content modules of `/hausverwaltung` and `/mietverwaltung`, and the footer).

## Target structure

```
src/routes/(landing-page)/einsparrechner/
├── +page.server.ts        # load: seo (noindex), landing chrome, the signup form; the signup action
└── +page.svelte           # <main class="es"> with the page tokens, .pg-sec, #hs-css and the reveal styles; FloatingCta after </main>

src/lib/landing/pages/einsparrechner/
├── content.ts  content.test.ts          # every text, the seven sliders, the two toggles, the three formula cards, the FAQ, word for word
├── savings.ts  savings.test.ts          # pure: hours, the time and risk figures, total, working days, per unit, bar widths, the result's texts
└── sections/
    ├── Hero.svelte                      # pill, H1, lead + Calculator
    ├── Calculator.svelte                # #rechner: the input card (three groups) + the result card
    ├── Method.svelte                    # "So entsteht das Ergebnis." + three cards
    ├── Faq.svelte*  Closing.svelte*
    └── Trust.svelte*  FloatingCta.svelte*
```

`*` marks a thin wrapper around a shared section.

## Links

The design's links, by design id, and where they lead here. An element whose target has no page yet isn't rendered (a CTA) or is plain text, as on the other pages; each carries its design id in a comment in `content.ts`, so the job that builds that page finds it.

| Design id (use) | Here |
|---|---|
| `44SBXKXJaSp6bvGMnbpZj6` (the result card's "Angebot für Ihren Bestand →", the closing card's "Demo buchen", the floating CTA) | `DEMO_HREF` (`#start`, the closing form); the result card's button focuses the e-mail field (`focusSignup`) |
| `LWEbZPCoSDLT1D59BaULyE` (FAQ 4's "Kündigungsfrist berechnen →") | `ROUTE_FRISTENRECHNER`, as the answer's `more` link |
| `Jp8tqY82m7FZqMnWU4z9x9` (the banner) | `ROUTE_UPGRADE_NOW` (`DEFAULT_CHROME`) |

The design has no in-page anchor links (its hero carries `#start` and the calculator `#rechner`; `#rechner` stays as the calculator's id).

Links to this page: the repo's history names the design's id `S3p5jbNkohWnWeZpfR75j9` for the footer's "Einsparrechner" and the second audience card's "Zum Einsparrechner" on `/hausverwaltung` and `/mietverwaltung` (their plans `1e372598`, `9fc4130e`). All of them get the link with the route (01 §1.1). No other content module names the Einsparrechner.

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/einsparrechner`, `ROUTE_EINSPARRECHNER` in `$lib/routes.ts`: the footer's label, lower case. Not confirmed (gate §4.4) |
| Route group | `(landing-page)`, outside `[[preview=preview]]` |
| Indexing | `seo.noindex = true` and out of the sitemap until the cutover; then indexed and in the sitemap (decision of 2026-10-17), so its gate (§4.4) blocks the cutover PR (#440) |
| Header | The shared `LandingHeader` with `DEFAULT_CHROME` (the design's banner is the same) |
| Content | Every text in `content.ts`, word for word. Non-breaking spaces only between a computed figure and its unit (as `/schnittstellen`) |
| Math | The design's `calc()` in the pure `savings.ts`: hours = (a1 + a2 + a3) × Liegenschaften; time € = hours × Stundensatz; risk € = Einheiten × Heizkosten × 3 % × the number of toggles on; total = time € + risk €; working days = hours / 8; per unit = total / Einheiten; the bars' widths relative to the larger figure (at least 1 €). The design's defaults (240 WE, 12 Liegenschaften, 1.000 €, 45 €/h; 4 / 3 / 6 h; no toggle) give 156 hours, 7.020 €, 0 €, 20 working days (19,5 rounded, as the design's `de()`), 29 € per unit |
| Figures | Whole euros and days with German grouping (`formatNumber`); slider values and the hours with one decimal only when they have one (the design's `de(n, n % 1 ? 1 : 0)`: "4,5 h", "156 Stunden pro Jahr") |
| Server state | The result for the defaults, every figure and both bars at their end values, so the page reads correctly without JS (the sliders and toggles need JS, as on `/schnittstellen`, `/selbstabrechnung` and `/upgrade-now`). The design starts every figure at 0 and counts up when the calculator first shows; here the server renders the end values and the browser counts from 0 once the calculator comes into view (see 03) |
| Toggles | Two buttons with `aria-pressed`, the design's check boxes; each click flips its toggle (the design's) |
| Live region | The design marks the whole result card `aria-live="polite"`, which would announce every counting frame. Here the counting figures sit in the card as plain text and an `sr-only` status line announces the result once per change ("Ihr Vorteil pro Jahr: 7.020 €, davon 7.020 € Arbeitszeit und 0 € vermiedenes Kürzungsrisiko") |
| Confetti | The design's `PG.confetti` from the total the first time both toggles are on (once per visit, `best`): the shared `confettiFrom` (`sg/confetti.ts`), nothing with reduced motion; a running burst stops on teardown |
| Signup and CTAs | The closing card gets the `SignupForm` and `id="start"` in place of the design's video button "Demo buchen" (as on `/fristenrechner` and `/hkvo-leitfaden`); the submit label is "Demo buchen". The design's hero carries `#start` but has no form, so the hero has no anchor. The result card's "Angebot für Ihren Bestand →" leads to `#start` and focuses the e-mail field. Leads: `source: "einsparrechner"`, `switchinquiry` with `page: "/einsparrechner"`. Open question 1 |
| Calculator inputs in the lead | The signup sends only the e-mail, as everywhere; the calculator's values aren't sent. Open question 2 |
| FAQ | The shared `Faq` (default variant, first answer open, FAQPage JSON-LD) on the grey band (`.pg-sec.alt`) with the design's centred heading; FAQ 4's link as `more` in `--ok`, 600 (`.xfq .ans a`) |
| Closing | The design gives its `.dm-end` 110 px top padding after the grey FAQ band; the wrapper sets it |
| Styling | Component-scoped CSS from the design; breakpoints the design's (900 and 560 `es-`; 640 `.pg-sec`/`.pg-hero`; `#hs-css` 1040/620). No class that is also a Tailwind utility |

## Open questions (the default is built unless answered)

1. **Closing card.** The design's video button "Demo buchen" leads to a booking page that doesn't exist. *Default: the signup form with "Demo buchen" as its button.*
2. **The calculator's values in the lead.** "Angebot für Ihren Bestand" suggests the offer uses the visitor's numbers. *Default: only the e-mail is sent* (the shared signup); sending the values would change the `switchinquiry` payload and the Make.com route.
3. **After the deadline.** The toggle "Zähler noch nicht fernablesbar" says "Ab 2027: Kürzungsrecht 3 %". *Default: as the design;* the text is part of the gate.

## Risks

- **Every gate is on the cutover's critical path** (04 §4.4–4.27).
- **Money figures from a tool.** The result reads as a yearly "Vorteil" in euros: the hours the visitor enters valued at their rate, plus 3 % of all heating costs per toggle (6 % with both). The design's notes say "ohne Heidi-Kosten", "Beispielwerte" and FAQ 1 says so; whether the two cuts add up, whether 3 % of every unit's costs is the right base (§ 12 Abs. 1 HeizkostenV: the tenant's share), and whether the avoided cut counts as the Verwaltung's benefit (it's the owner's) need a legal and product look. Mitigation: the note and FAQ 1 stay; sign-off in §4.4; align with `/upgrade-now`'s risk calculator (§4.25) and `/hkvo-leitfaden` (§4.5).
- **Counting on load.** The calculator is above the fold, so the count-up runs right after hydration: the server's end values show for a moment, then the figures count from 0 (as `countUp` does elsewhere). With reduced motion nothing counts.

## Out of scope

- The design's nav, footer, chat button, `#top-js`, `#mobfx`, `#eb-js`, `#pillfx` beyond the pills' own hover, `#end-css`, `#fx-js` (the design footer's newsletter; ours is the shared footer), `#demo-css` beyond `.dm-pill`, `.dm-h2`, `.bk-next` and the range input, `PG.countUp` / `seg` / `paintRange` (unused by this page), the design's own smooth anchor scrolling (app.css scrolls smoothly; `#start` has the shared offset).
- A shareable link with the visitor's numbers, a PDF of the result.
