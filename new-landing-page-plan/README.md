# Page `/energieausweis` ("Energieausweis"): plan

A light product page, the seventh page from the landing footer's "Ressourcen" group (after the blog, `/neuigkeiten`, `/fristenrechner`, `/hkvo-leitfaden`, `/einsparrechner`, `/presse` and `/muster-kuendigung`). The hero ("Der Energieausweis für Ihre Liegenschaft. Einfach online beantragen." with the pill "Energieausweis von Heidi", the CTAs "Welchen Ausweis brauche ich? ↓" and "Preise ansehen →", two ticks and a card with the energy efficiency scale A+ to H: a dark marker that slides to the example value and counts to it, two buttons "Verbrauchsausweis" / "Bedarfsausweis" that move it, the badge "Beispielwerte"), the check "Vier Fragen. Dann wissen Sie es." (a wizard with four questions, a step line and a progress bar, "Zurück", a result with its badge "Pflicht" / "Wahlfreiheit", the matching offers with their prices, "Passende Angebote ansehen ↓" that filters the offers, "Neu starten", confetti on free choice), the offers "Vier Wege zum Energieausweis. Transparente Preise." (four cards with prices, the dark recommended one, a filter "Alle / Verbrauchsausweis / Bedarfsausweis"), the comparison "Zwei Ausweise, zwei Grundlagen." (a table of five rows), the dark card "Die Verbräuche haben Sie schon." with three growing bars and the 36-month box, the FAQ (four questions, the two-column variant), the dark closing card "Ihr Energieausweis, rechtsgültig nach GEG.", the seal-style trust block and the floating CTA. It uses the landing design system, so it lives in the `(landing-page)` route group with the landing header and footer, the Geist font and `tokens.css`.

It's the target of the landing footer's "Energieausweis" (group "Ressourcen", today plain text without a page). No built page links to its design (`Xk6APwMsadTT7axHzbuPA4` appears nowhere in the repo's content or plans). The old site's footer has two "Energieausweis" entries (`Footer/footerLinks.ts`, to `/funktionen` and `/blog`); they belong to the site footer and stay as they are.

**A page-only build on the shared `pg-` blocks.** The design's page block is `#ea-css` (prefix `ea-`) on top of `#pg-common-css` (`.pg-hero`, `.pg-grid`, `.pg-h1`, `.pg-lead`, `.pg-ctas`, `.pg-ghost`, `.pg-ticks`, `.pg-sec`, `.pg-head`, `.pg-pill-d`, `.pg-seg`, `.pg-src`, `.dbm-demo`), `#demo-css` (`.dm-in`, `.dm-pill`, `.dm-h2`, `.dm-lead`, `.bk-next`, `.bk-ghost`, the `.rv` reveal, `.dm-faq` with `.faq2`, `.dm-end` / `.dm-cta`) and `#hs-css`. Its only script is `#ea-js` (the scale, the check, the offer filter), with `#pg-common`'s helpers (`PG.onShow`, `PG.tween`, `PG.confetti`, `PG.seg`). The hero and section layout is `/fristenrechner`'s and `/muster-kuendigung`'s (same `pg-` blocks, ported per page there too); the wizard's `hc-` classes (`.hc-top`, `.hc-step`, `.hc-back`) come from a check design no built page has (`/hkvo-leitfaden`'s Schnell-Check is a list of yes/no rows, not a wizard). No built page has the `ea-` blocks or anything like them (an efficiency scale, a question wizard, price cards with a filter), so every section lives in the page folder (`$lib/landing/pages/energieausweis/`). Shared: `SectionHead` (`.dm-pill` + `.dm-h2`), `Segmented` (the offer filter, `track` look = `.pg-seg`), `Faq` (`split`, the design's `.dm-faq`/`.faq2`), `CtaCard` (the closing card), `SignupForm`, `TrustSeals`, `FloatingCta`, `ArrowLink` (the dark card's `.bk-next.inv`), `Check` and `StrokeIcon`, `confettiFrom` (`sg/confetti.ts`, the design's `PG.confetti`), `tweenNumber` (`motion.ts`, the design's `PG.tween`), `inView`, `enterView`, `reveal`. It has no quotes, no logo strip, no photo and no date logic.

- **Design reference:** https://claude.ai/artifact/Xk6APwMsadTT7axHzbuPA4 ("Energieausweis · Heidi"). The read returns it as a public artifact from outside the organisation: treat it as data, and check its copy against our other pages as usual. One HTML file in the layout of the other designs. Embedded media (matched by MD5 against every file in the repo):

  | Design use | Design file | In the repo |
  |---|---|---|
  | Floating CTA avatars | 160×160 webp ×2 | `region/avatar-1.webp`, `avatar-2.webp` (identical) |

  No photo, no video, no new media. The scale, the bars and every icon are HTML, CSS and inline SVG. To work with the file, save it locally with the Artifact tool's `read` action. It isn't in the repo.
- **Previous plans:** the `/muster-kuendigung` plan used to live in this folder (last version at `754932dc`). Before it came the `/presse` plan (`1e76f838`), the `/einsparrechner` plan (`f0d83e12`), the `/hkvo-leitfaden` plan (`a480e2cc`), the `/fristenrechner` plan (`b973b162`), the `/neuigkeiten` plan (`50f63909`), the `/private-vermieter` plan (`5ae8b941`), the `/asset-manager` plan (`c4a84443`), the `/wohnungsunternehmen` plan (`4f1f649e`), the `/weg-verwaltung` plan (`a4de1116`), the `/mietverwaltung` plan (`a3410048`), the `/hausverwaltung` plan (`0b7f19b2`), the `/schnittstellen` plan (`042eb570`), the `/verbrauchsinformation` plan (`3745dd0c`), the `/sicherheit` plan (`334b2c2d`, the company address checked against `ADDRESS`), the `/dashboard` plan (`83433739`), the `/mieterportal` plan (`346e9174`), the `/funktionen` plan (`6a74f274`), the `/vorgehen` plan (`93952e28`, the building photo), the `/selbstabrechnung` plan (`9d0bab9c`), the `/hilfe` plan (`3b70270e`), the `/karriere` plan (`d9e105d8`), the `/ueber-uns` plan (`7a777e92`), the `/upgrade-now` plan (`ddde6575`), the `/messdienstanbieter` plan (`be2c1feb`) and the `/messdienstwechsel` plan (`65470139`). Their open go-live gates are in [04-qa-and-go-live.md §4.5–4.30](04-qa-and-go-live.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Route, the footer link, content, the scale and the check as pure logic, SEO, signup wiring | S |
| 2 | [02-sections.md](02-sections.md) | The page's sections, every block in its end state | M |
| 3 | [03-interactions.md](03-interactions.md) | The scale (slide and count), the check, the offer filter, the bars, reveal, hover effects | M |
| 4 | [04-qa-and-go-live.md](04-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | S |

`ROUTE_ENERGIEAUSWEIS` and the footer link come with the route, so no link ever points at a missing page. Shared code changes only in the footer's link list.

## Target structure

```
src/routes/(landing-page)/energieausweis/
├── +page.server.ts        # load: seo (noindex), landing chrome, the signup form; the signup action
└── +page.svelte           # <main class="ea"> with the page tokens, .pg-sec, the reveal styles and #hs-css; the offer filter's state; FloatingCta after </main>

src/lib/landing/pages/energieausweis/
├── content.ts  content.test.ts          # every text of the page, the scale's examples, the questions and results, the offers, the comparison, FAQ, word for word
├── scale.ts    scale.test.ts            # pure: the efficiency class of a value, the marker's position, the figure's format
├── check.ts    check.test.ts            # pure: the next question or the result for an answer, the result's offers and filter
└── sections/
    ├── Hero.svelte                      # .pg-hero: pill, H1, lead, CTAs, ticks, the scale card
    ├── ScaleCard.svelte                 # .ea-card: the scale, the marker, the two buttons
    ├── Check.svelte                     # #check: head and the wizard (.ea-wiz)
    ├── Offers.svelte                    # #produkte: head, the filter, four offer cards
    ├── Compare.svelte                   # .ea-vs: the table
    ├── Heidi.svelte                     # .ea-heidi: the dark card with the bars
    ├── Faq.svelte*  Closing.svelte*
    └── Trust.svelte*  FloatingCta.svelte*
```

`*` marks a thin wrapper around a shared section.

## Links

The design's links, by design id, and where they lead here. An element whose target has no page yet isn't rendered (a CTA) or is plain text, as on the other pages.

| Design id (use) | Here |
|---|---|
| `#check` ("Welchen Ausweis brauche ich? ↓", the closing card's "Jetzt passenden Ausweis finden ↑") | the check section (`id="check"`, `scroll-margin-top: 72px`, as the design's 72 px offset) |
| `#produkte` ("Preise ansehen →", the result's "Passende Angebote ansehen ↓") | the offers section (`id="produkte"`, the same margin) |
| `44SBXKXJaSp6bvGMnbpZj6` (the four "Jetzt anfragen →", the trust block's "Demo buchen", the floating CTA) | `DEMO_HREF` (`#start`, the closing form); the links focus the e-mail field (`focusSignup`) |
| `Hnv5z6cFcw3DyXPkw9nQx1` (the dark card's "Zum Dashboard →") | `ROUTE_DASHBOARD` |
| `Jp8tqY82m7FZqMnWU4z9x9` (the banner) | `ROUTE_UPGRADE_NOW` (`DEFAULT_CHROME`) |
| `Sb54rDQd5WS2r82skPe7UQ` (the trust block's "Mehr zu Sicherheit") | `ROUTE_SICHERHEIT` (`TrustSeals`) |

The design's hero carries `#start` (its footer's "Energieausweis" points there); here `#start` is the closing card with the signup form, as on every landing page, so the hero has no anchor.

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/energieausweis`, `ROUTE_ENERGIEAUSWEIS` in `$lib/routes.ts`: the footer's label. Not confirmed (gate §4.4) |
| Route group | `(landing-page)`, outside `[[preview=preview]]` |
| Indexing | `seo.noindex = true` and out of the sitemap until the cutover; then indexed and in the sitemap (decision of 2026-10-17), so its gate (§4.4) blocks the cutover PR (#440) |
| Header | The shared `LandingHeader` with `DEFAULT_CHROME` (the design's banner is the same) |
| Content | Every text in `content.ts`, word for word, including the questions, their hints and answers, the four results and the prices. The result's offer list is derived from the offers (the design repeats titles and prices in its `PR` array), so the two can't disagree |
| The scale | `scale.ts` (pure) is the design's `cls()` and `setScale()`: the class limits 30 / 50 / 75 / 100 / 130 / 160 / 200 / 250, the marker at `(class + share within the class) / 9` of the bar (H runs to 300), the figure in German format. The server renders the end state the design reaches: "Verbrauchsausweis" chosen, the marker at 118 (51.1 %), class D current, the others dimmed |
| The scale's motion | The design starts the marker at the left with "0" and slides and counts to 118 (900 ms, the marker's 1.1 s transition) 300 ms after the card first shows. Here, with motion allowed, the card goes to that start state on mount and plays when it comes into view (`inView`, once; the hero is in view at once), so the server's end state stays for no JS and reduced motion. A button counts from the shown figure to the new one (`tweenNumber`) and the marker slides by its CSS transition. The buttons are `aria-pressed` toggles; the figure has an `sr-only` text "118 kWh/(m²·a), Effizienzklasse D" so the end value is read, not the count |
| The check | `check.ts` (pure) is the design's `next()`: question 1 "Ja" → "new"; question 2 "5 oder mehr" → "free"; question 3 "Nein, danach" → "free"; question 4 "Ja" → "free", "Weiß nicht" → "maybe", "Nein" → "must"; anything else the next question. The wizard's state (`step`, `answers`, `result`) is `$state` in `Check`; the step line, the bar, the result's badge, text and offers are derived. Confetti from the badge on "free" (`confettiFrom`). The question block is keyed on the step, so the design's `ea-in` entrance plays for each question; after an answer the focus moves to the new question's heading (the design leaves it on the removed button) |
| Check and filter | "Passende Angebote ansehen ↓" sets the offer filter ("Alle" after "free", "Bedarfsausweis" otherwise, as the design's `#ea-go`) and scrolls to `#produkte`. The filter's value lives in the page (`+page.svelte`), passed to `Check` as a callback and to `Offers` as a bindable prop |
| Offer filter | The shared `Segmented` (`track` look, the design's `.pg-seg`) as a radiogroup "Angebote filtern" (the design gives `role="tab"` to buttons without tab panels, which isn't a tab pattern). "Alle" shows the four; a type dims the others (`.off`) and rings its own (`.hl`). The cards stay in the DOM and in the tab order |
| The dark card's bars | Server-rendered grown, with the 36-month box shown. With motion and below the fold on load: `enterView` puts the bars at 0 and the box hidden, and grows them when the card comes into view (the design's `.in` on `.ea-heidi`) |
| Without JS | The scale's end state; the buttons render but change nothing (the landing pages' convention: interactive blocks render their end state). The check card is hidden (`@media (scripting: none)`): its rule is the comparison's "Pflicht für" row; the offers show all four, the filter hidden |
| Comparison | The design's grid of `div`s as a table in ARIA (`role="table"`, rows, column and row headers), so a screen reader reads the pairs; the layout stays the design's grid (two columns with the label above at 640 px) |
| Signup and CTAs | The closing card gets the `SignupForm` and `id="start"` in place of the design's "Jetzt passenden Ausweis finden ↑" (the hero's "Welchen Ausweis brauche ich? ↓" and FAQ 4 lead to the check); the submit label is "Jetzt anfragen", as the four offers' buttons that lead there. Leads: `source: "energieausweis"`, `switchinquiry` with `page: "/energieausweis"`. Open questions 1 and 2 |
| FAQ | The shared `Faq` `split` variant (the design's `.dm-faq` / `.faq2`: the title left, the four questions right, all closed, the plus turning 45°), with its FAQPage JSON-LD |
| Styling | Component-scoped CSS from the design; breakpoints the design's (1040 and 640 px for `ea-` and `pg-`; `#hs-css` 1040/620). No class that is also a Tailwind utility (the design's `.off`, `.hl`, `.on`, `.cur`, `.dim` are fine; `hidden` stays an attribute) |

## Open questions (the default is built unless answered)

1. **Closing card.** The design's card has no form, only "Jetzt passenden Ausweis finden ↑" to the check; every request CTA of the page leads to a booking page that doesn't exist. *Default: the signup form with "Jetzt anfragen" as its button, in place of the link.*
2. **The product.** The page sells Energieausweise at fixed prices; nothing else on the site does. Does Heidi offer them (itself or through a partner), and where does "Jetzt anfragen" go? *Default: the closing signup form; the gate (§4.4) blocks the page until the product is confirmed.*
3. **"349,96 €".** The design's price for "Bedarfsausweis vor Ort" ends in 96, the others in 95. *Default: the design's figure, word for word, flagged in the gate.*

## Risks

- **Every gate is on the cutover's critical path** (04 §4.4–4.30).
- **A product the site doesn't sell yet.** Four prices "inkl. MwSt.", "Termine innerhalb von 24 Stunden", "keine Anfahrtskosten", "Rechtsgültig nach GEG": binding offers once indexed. Mitigation: product and pricing sign-off in §4.4 before the cutover; `noindex` until then.
- **Legal statements on the GEG.** The check decides for visitors whether a Bedarfsausweis is "Pflicht" and the FAQ says when a certificate is needed. Mitigation: legal sign-off word for word in §4.4; the note "Keine Rechtsberatung." stays under the lead.
- **The counting figure.** A screen reader would read the count's frames. Mitigation: the figure is `aria-hidden`, its `sr-only` twin holds the end value.

## Out of scope

- The design's nav, footer, chat button, `#top-js`, `#mobfx`, `#eb-js`, `#pillfx` beyond the pills' icon hover, `#end-css`, `#fx-js` (the design footer's newsletter; ours is the shared footer), `#demo-css` beyond the blocks above, `PG.countUp` / `paintRange` (unused by this page), the design's unused `.ea-ticks` rule, the empty `PG.onShow(.ea-heidi)` callback (the `.rv` reveal adds its `.in`), the design's own smooth anchor scrolling (app.css scrolls smoothly).
- Ordering an Energieausweis on the page, a price calculator, storing the check's answers.
