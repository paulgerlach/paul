# Page `/messdienstanbieter-vergleich` ("Messdienstanbieter-Vergleich"): plan

A tool page for managers, the tenth and last page from the landing footer's "Ressourcen" group (after the blog, `/neuigkeiten`, `/fristenrechner`, `/hkvo-leitfaden`, `/einsparrechner`, `/presse`, `/muster-kuendigung`, `/energieausweis`, `/portfolio-checker` and `/heizkostenabrechnung-pruefen`). The dark hero ("Wie gut ist Ihr Messdienst wirklich?" with the pill "Messdienstanbieter-Vergleich", the lead, "Vergleich starten ↓" and "Demo buchen →", three ticks) holds a preview card: five criteria in two columns "Ihr Anbieter" / "Heidi", the question marks on the left, Heidi's ticks popping in one by one, then "Ergebnis ? / 8 · 8 / 8". Below: the customer logos, step 1 ("Was leistet Ihr Anbieter? Kreuzen Sie an.": eight criteria, each with "Ja" / "Nein" / "?" for the visitor's provider and Heidi's tick, beside the dark sticky score card with two bars, the verdict, the list "Hier liegt Heidi vorn" and "Mit Heidi vergleichen →"), step 2 ("Was zahlen Sie heute pro Wohnung?": six number fields in two groups, the dark result card with the cost per flat and year counting, a stacked bar with its legend, the totals per year and over six years with a tooltip, "Heidi-Angebot für diesen Bestand →", the note), the six questions to ask ("Sechs Fragen, bevor Sie unterschreiben."), the dark switching band ("Wechseln, ohne aufs Vertragsende zu warten." with three figures), two customer quotes, the FAQ (four questions), the dark closing card "Vergleichen Sie mit Ihrem eigenen Bestand.", the seal-style trust block and the floating CTA. It uses the landing design system, so it lives in the `(landing-page)` route group with the landing header and footer, the Geist font and `tokens.css`.

It's the target of the landing footer's "Messdienstanbieter-Vergleich" (group "Ressourcen", today plain text without a page) and of the links on built pages that wait for it (searched the repo for the design id `Tms67Y5GnupQ4MPsxm8ux6`, "Messdienstanbieter-Vergleich", "vergleichen" and "Anbieter im Vergleich"; the saved designs of the other pages link it only from their nav and footer): the `.sg-links` row's "Messdienstanbieter vergleichen" on `/wohnungsunternehmen` and `/asset-manager` (`pain.links`, without `href` today; the `/wohnungsunternehmen` design, read on 2026-10-19, links this design there). Both get the route with the page. The row's third link, "Bisherige Abrechnung prüfen", points at the `/heizkostenabrechnung-pruefen` design in the same read and still has no `href`: not this page's link, so it's left as it is and noted in the gate (§4.4).

**A page-only build on the shared `pg-` blocks.** The design's page block is `#mv-css` / `#mv-js` (prefix `mv-`) on top of `#pg-common-css` (`.pg-hero.ink`, `.pg-grid`, `.pg-h1`, `.pg-lead`, `.pg-pill-d`, `.pg-ctas`, `.pg-ghost`, `.pg-ticks`, `.pg-sec`, `.pg-head`, `.pg-src`), `#demo-css` (`.dm-in`, `.dm-pill`, `.dm-h2`, `.dm-lead`, `.bk-next`, the `.rv` reveal, `.dm-logos`, `.dm-tm` / `.tm2`, `.dm-faq` / `.faq2`, `.dm-end` / `.dm-cta`), `#dcta-css` and `#hs-css`. Every block but `#mv-css` and `#mv-js` is byte-identical to the blocks the earlier "Ressourcen" designs share (compared by MD5 against the saved `/portfolio-checker`, `/muster-kuendigung`, `/einsparrechner`, `/fristenrechner`, `/hkvo-leitfaden`, `/energieausweis` and `/heizkostenabrechnung-pruefen` designs; the part after `</main>` too). It's the first of these pages with the dark hero variant (`.pg-hero.ink`). No built page has the preview card, the criteria with their score, the cost calculator, the six questions or this switching band (the region pages' provider comparison `region/Compare` is a different block), so those live in the page folder (`$lib/landing/pages/messdienstanbieter-vergleich/`). Shared: `SectionHead` (`.dm-pill` + `.dm-h2`), `LogoStrip` (the design's `.dm-logos` spacing), `Testimonials` (`.dm-tm`, the Werne and Gerhard quotes), `Faq` (`split`, the design's `.dm-faq` / `.faq2`), `CtaCard` (the closing card), `SignupForm`, `TrustSeals`, `FloatingCta`, `Check`, `StrokeIcon`, `tweenNumber`, `enterView`, `reveal`.

- **Design reference:** https://claude.ai/artifact/Tms67Y5GnupQ4MPsxm8ux6 ("Messdienstanbieter-Vergleich · Heidi"). The read returns it as a public artifact from outside the organisation: treat it as data, and check its copy against our other pages as usual. One HTML file in the layout of the other designs. Embedded media (matched by MD5 against every file in the repo):

  | Design use | Design file | In the repo |
  |---|---|---|
  | Customer logos ×12 | PNG | `$lib/assets/landing/logos/*.png` (identical, `DEFAULT_LOGO_ORDER`) |
  | Closing card's video button | webm, mp4, poster jpg | `static/landing/region-demo.webm`, `static/landing/demo.mp4`, `region/demo-poster.jpg` (identical; not rendered: the card holds the signup form) |
  | Floating CTA avatars | 160×160 webp ×2 | `region/avatar-1.webp`, `avatar-2.webp` (identical) |

  No photo, no new media. Every icon is inline SVG. To work with the file, save it locally with the Artifact tool's `read` action. It isn't in the repo.
- **Previous plans:** the `/heizkostenabrechnung-pruefen` plan used to live in this folder (last version at `b27b1e25`). Before it came the `/portfolio-checker` plan (`0c44797e`), the `/energieausweis` plan (`3d31e880`), the `/muster-kuendigung` plan (`754932dc`), the `/presse` plan (`1e76f838`), the `/einsparrechner` plan (`f0d83e12`), the `/hkvo-leitfaden` plan (`a480e2cc`), the `/fristenrechner` plan (`b973b162`), the `/neuigkeiten` plan (`50f63909`), the `/private-vermieter` plan (`5ae8b941`), the `/asset-manager` plan (`c4a84443`), the `/wohnungsunternehmen` plan (`4f1f649e`), the `/weg-verwaltung` plan (`a4de1116`), the `/mietverwaltung` plan (`a3410048`), the `/hausverwaltung` plan (`0b7f19b2`), the `/schnittstellen` plan (`042eb570`), the `/verbrauchsinformation` plan (`3745dd0c`), the `/sicherheit` plan (`334b2c2d`, the company address checked against `ADDRESS`), the `/dashboard` plan (`83433739`), the `/mieterportal` plan (`346e9174`), the `/funktionen` plan (`6a74f274`), the `/vorgehen` plan (`93952e28`, the building photo), the `/selbstabrechnung` plan (`9d0bab9c`), the `/hilfe` plan (`3b70270e`), the `/karriere` plan (`d9e105d8`), the `/ueber-uns` plan (`7a777e92`), the `/upgrade-now` plan (`ddde6575`), the `/messdienstanbieter` plan (`be2c1feb`) and the `/messdienstwechsel` plan (`65470139`). Their open go-live gates are in [04-qa-and-go-live.md §4.5–4.33](04-qa-and-go-live.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Route, the footer and the other pages' links, content, the score and the cost calculation as pure code, SEO, signup wiring | S |
| 2 | [02-sections.md](02-sections.md) | The page's sections, every block in its end state | M |
| 3 | [03-interactions.md](03-interactions.md) | The preview's ticks, the criteria toggles and the score, the calculator and its counts, the tooltip, reveal, hover effects | S |
| 4 | [04-qa-and-go-live.md](04-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | S |

`ROUTE_MESSDIENSTANBIETER_VERGLEICH` and every link to it come with the route, so no link ever points at a missing page. Shared code changes only in the footer's link list and the linking pages' content.

## Target structure

```
src/routes/(landing-page)/messdienstanbieter-vergleich/
├── +page.server.ts        # load: seo (noindex), landing chrome, the signup form; the signup action
└── +page.svelte           # <main class="mv"> with the page tokens, .pg-sec, the reveal styles, .bk-next, .pg-ghost and #hs-css; FloatingCta after </main>

src/lib/landing/pages/messdienstanbieter-vergleich/
├── content.ts  content.test.ts          # every text of the page: the hero and its preview, the eight criteria, the score's texts, the calculator's fields and labels, the six questions, the band, the quotes' keys, the FAQ, word for word
├── score.ts  score.test.ts              # pure: the counts, the verdict, the gaps (the design's score())
├── cost.ts  cost.test.ts                # pure: number parsing, the costs per flat, year and six years, the stack's shares, formatting (the design's num() / cost() / de())
├── icons.ts  components/ (Icon, Shapes, Head)
└── sections/
    ├── Hero.svelte                      # .pg-hero.ink: pill, H1, lead, CTAs, ticks, the preview (.mv-peek)
    ├── LogoStrip.svelte*                # .dm-logos
    ├── Criteria.svelte                  # #vergleich: .mv-crit and the score card .mv-score
    ├── Costs.svelte                     # #kosten: .mv-cin and the result card .mv-cout
    ├── Tips.svelte                      # .mv-tips
    ├── Switch.svelte                    # .mv-sw
    ├── Testimonials.svelte*  Faq.svelte*  Closing.svelte*
    └── Trust.svelte*  FloatingCta.svelte*
```

`*` marks a thin wrapper around a shared section.

## Links

The design's links, by design id, and where they lead here. An element whose target has no page yet isn't rendered (a CTA) or is plain text, as on the other pages.

| Design id (use) | Here |
|---|---|
| `#start` (the design's hero) | none: the hero has no form. `#start` is the closing card with the form, as on every landing page |
| `#vergleich` ("Vergleich starten ↓") | the step 1 section |
| `#kosten` (the fourth question's "Zum Kostenrechner →") | the step 2 section |
| `44SBXKXJaSp6bvGMnbpZj6` (the hero's "Demo buchen →", "Mit Heidi vergleichen →", "Heidi-Angebot für diesen Bestand →", the trust block's "Demo buchen", the closing card's video button, the floating CTA) | `DEMO_HREF` (`#start`, the closing form); the links focus the e-mail field (`focusSignup`) |
| `JMrh8PhRG78mcMBK2LDkbS` ("So funktioniert der Wechsel →", "Heidi Anbieterwechsel") | `ROUTE_MESSDIENSTWECHSEL`, as on `/muster-kuendigung` |
| `Jp8tqY82m7FZqMnWU4z9x9` (the second question's "Zur Umrüstpflicht →", the banner) | `ROUTE_UPGRADE_NOW` (the banner through `DEFAULT_CHROME`) |
| `Sb54rDQd5WS2r82skPe7UQ` (the trust block's "Mehr zu Sicherheit") | `ROUTE_SICHERHEIT` (`TrustSeals`) |
| The first question's "Der Portfolio-Checker von Heidi" | plain text, as in the design |

## Implementation notes (2026-10-19)

Phases 1–4 are built: the plan (`f62001f3`), the route, content, the pure `score.ts` and `cost.ts` and the links (`0bf819ff`), the sections with their interactions (`8a8a5a38`), and `e2e/messdienstanbieter-vergleich.e2e.ts` (15 tests). Compared with the design section by section at 1440, 1100, 980, 700, 375 and 320 px (production preview, reduced motion, after scrolling through both pages): every section has the design's height to the pixel at every width and matches it by eye; the one difference is the planned one: the closing card holds the signup form (0 / 0 / +50 / −14 / +42 / +31 px). Step 1 with picks (a mix with the list, all "Ja") and step 2 with other values were compared the same way. No overflow at 320 and 375 px, also with every criterion picked and the tooltip shown; no console errors or hydration warnings (production and dev). Full suites: check, lint, 705 unit tests, 458 e2e tests passed. Open: the manual checks of §4.1 not ticked there, and the gate §4.4. Deviations from the plan and the design:

- **Phases 2 and 3 are one commit:** the preview's ticks, the toggles, the score, the counts and the tooltip are part of their sections.
- **Toggle buttons, not radios:** each criterion's "Ja" / "Nein" / "?" are `aria-pressed` buttons in a named `role="group"`, because a second click clears the pick (the design's `role="radio"` promises arrow keys and no clearing). Only the verdict is a live region (the design makes the whole score card `aria-live`).
- **The tooltip is a button** labelled by its own text (`aria-labelledby`, the bubble `role="tooltip"`), so it's focusable with a role; the design's `span` with `tabindex="0"` has neither.
- **Shared blocks in the design's spacing:** the logo strip's wrapper sets `.dm-logos` (72/64 px, a hairline, the 17 px muted label, the row 32 px below), the quotes' wrapper restores the `.dm-h2` 18 px top margin (the landing heading reset takes it) and keeps the two cards side by side down to 640 px (the shared row stacks at 1040).
- **Specificity:** the page's shared `.bk-next.inv` rule sets `margin-top: 0` at (0,2,0), so a section's own margin on it needs a more specific selector (`.sw .cta`, `.cout .cta`, `.score .cta`).
- **Local Postgres:** none was running; a throwaway `postgres:18-alpine` on 127.0.0.1:54322 with the roles `anon`, `authenticated` and `service_role` before `drizzle-kit push`, stopped afterwards.

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/messdienstanbieter-vergleich`, `ROUTE_MESSDIENSTANBIETER_VERGLEICH` in `$lib/routes.ts`: the footer's label and the design's pill, lower-case, without umlauts. A separate top-level route, so it doesn't collide with `/messdienstanbieter/[city=city]`. Not confirmed (gate §4.4) |
| Route group | `(landing-page)`, outside `[[preview=preview]]` |
| Indexing | `seo.noindex = true` and out of the sitemap until the cutover; then indexed and in the sitemap (decision of 2026-10-17), so its gate (§4.4) blocks the cutover PR (#440) |
| Header | The shared `LandingHeader` with `DEFAULT_CHROME` (the design's banner is the same); the nav CTA leads to the closing form as on `/energieausweis` |
| Content | Every text in `content.ts`, word for word, including the eight criteria (the design builds them in `#mv-js`), the score's verdicts, the calculator's labels and start values, the six questions, the band's figures and the four FAQ answers |
| The preview | `aria-hidden` like the design. Server-rendered finished (five ticks, "8 / 8"); the ticks pop in 300 ms + 260 ms apart and "8 / 8" fades in at 1.6 s through CSS animations with a `both` fill from the first paint (the hero is on screen at load, where the design's `onShow` fires at once), as `/muster-kuendigung`'s hero badges. With reduced motion: no animation |
| The criteria | Rendered on the server (the design fills `#mv-crit` by script). Each row's "Ja" / "Nein" / "?" are toggle buttons (`aria-pressed`, in a `role="group"` named "<Kriterium> bei Ihrem Anbieter"): a click picks, a second click on the same one clears, as in the design. The design marks them `role="radio"` in a `radiogroup`, which promises arrow keys and no clearing; toggle buttons say what they do. The row's border follows the pick |
| The score | `score.ts` (pure): "Ihr Anbieter" counts the "Ja" (the bar at y / 8, its .6 s transition), the verdict (the design's four texts), the list "Hier liegt Heidi vorn" with every "Nein" and "?" ("bei Ihnen unklar" for "?"), re-rendered with its entrance on every pick (`{#key}`). Heidi's bar grows to 100 % (1.2 s) the first time the card shows (`enterView`); server-rendered full. Only the verdict is a live region (the design makes the whole card `aria-live`, which would read both bars and the list on every click) |
| The calculator | `cost.ts` (pure) is the design's `cost()`: per flat = allocators × their rent + water meters × their rent + the reading and billing fee; per year × flats; over six years × 6. Fields parse as the design's `num()` (a comma as the decimal point, anything not finite or negative counts as 0). The figures tween from the shown value to the new one (450 ms, `tweenNumber`, ease-out), the stack's three shares and the legend follow at once. Server-rendered with the design's start values (120 flats, 5 allocators, 2 water meters, 8 €, 12 €, 25 €): 89,00 € per flat, 10.680 € a year, 64.080 € over six years. Below the fold with motion the figures start at 0 and count up the first time the card shows (`enterView`), as the design's `onShow` |
| The tooltip | "6 Jahre = Eichfrist für Wasser- und Wärmezähler" on hover and focus of the info icon (`tabindex="0"`, CSS only as in the design), with `aria-describedby` so it's read |
| Without JS | Every section readable; the criteria's toggles and the score's "Ihr Anbieter" row and verdict are hidden (`@media (scripting: none)`), because they need a pick; the calculator shows its start values' result (its fields can't recalculate; open question 2); the FAQ (`<details>`), the signup form posts |
| Signup and CTAs | The closing card gets the `SignupForm` and `id="start"` in place of the design's video button "Demo buchen", as on `/muster-kuendigung` and `/heizkostenabrechnung-pruefen`: the page's five "Demo buchen" / offer links need a form on the page. The submit label is "Demo buchen". Leads: `source: "messdienstanbieter-vergleich"`, `switchinquiry` with `page: "/messdienstanbieter-vergleich"`. Open question 1 |
| Quotes | The shared `Testimonials` with the design's title "Was Verwaltungen über Heidi sagen" and the keys `werne`, `gerhard` (word for word the shared texts) |
| FAQ | The shared `Faq` `split` variant (the design's `.dm-faq` / `.faq2`: the title on the left, four questions, all closed, the plus turning), with its FAQPage JSON-LD |
| Styling | Component-scoped CSS from the design; breakpoints the design's (1040, 700 and 640 px for `mv-`, 1040 and 640 px for `pg-`; `#hs-css` 1040/620). No class that is also a Tailwind utility (`.on`, `.y`, `.n`, `.u`, `.q`, `.h`, `.done`, `.a`, `.b`, `.c` are fine; the design's `.mv-tip` becomes `.tip`, not `hidden`/`grid`/`blur`) |

## Open questions (the default is built unless answered)

1. **Closing card.** The design's card has the video button "Demo buchen" (a booking page that doesn't exist); the page's other "Demo buchen" links need a target. *Default: the signup form with "Demo buchen" as its button, as on the other pages.* The alternative is the design's video button once a booking URL exists (`DEMO_HREF`).
2. **Without JS.** *Default: the toggles hidden, the calculator shows the start values' result.* The alternative is a GET form for the calculator, computed in `load` from the query.
3. **The comparison's claims.** Heidi is shown as meeting all eight criteria ("8 / 8"), including "Direkt in Ihrem ERP", "Klare Preise" and "Feste Ansprechperson". *Default: as designed; the claims are in the gate (§4.4).*

## Risks

- **Every gate is on the cutover's critical path** (04 §4.4–4.33).
- **A comparison with competitors.** The page invites managers to score their provider against Heidi, with Heidi at 8 / 8. Comparative advertising (§ 6 UWG) needs verifiable, matching criteria. Mitigation: no competitor is named, the visitor scores their own provider (the FAQ's "Warum stehen hier keine anderen Anbieter mit Preisen?"); legal sign-off in §4.4; `noindex` until then.
- **A promise about data.** "Keine Daten gespeichert" and "Ihre Angaben bleiben in Ihrem Browser." hold while nothing is sent. Mitigation: the picks and fields are plain `$state` without `name` or a form; no analytics on them; the e2e test asserts no request on picking and typing.
- **A dated statement.** The second question's "Bis 31.12.2026 müssen … fernablesbar sein" reads as "now" only until the deadline. Mitigation: the expired text decided in §4.4.

## Out of scope

- The design's nav, footer, chat button, `#top-js`, `#mobfx`, `#eb-js`, `#pillfx` beyond the pills' icon hover, `#end-css`, `#fx-js` (the design footer's newsletter; ours is the shared footer), `#dcta-js` (the closing card's video), `#demo-css` and `#pg-common-css` beyond the blocks above (`.pg-seg`, `.pg-card`, `.dbm-demo`, `canvas.cf`, `.xfq`, `seg()`, `paintRange()`, `confetti()` aren't used by this page).
- Storing a comparison, a PDF of the result, a booking page.
