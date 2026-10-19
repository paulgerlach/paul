# Page `/heizkostenabrechnung-pruefen` ("Heizkostenabrechnungs-Checker"): plan

A light tool page for tenants, the ninth page from the landing footer's "Ressourcen" group (after the blog, `/neuigkeiten`, `/fristenrechner`, `/hkvo-leitfaden`, `/einsparrechner`, `/presse`, `/muster-kuendigung`, `/energieausweis` and `/portfolio-checker`). The hero ("Heizkostenabrechnung jetzt überprüfen." with the pill "Für Mieter · kostenlos", the lead, three ticks and the "2 von 3" note with "Zu den Zahlen ↓") holds the check card: two tabs ("Hochladen", "Werte eingeben"); the upload pane (a drop zone for a PDF or photo of the bill with thumbnails, then a guided four-step flow: the receipt date, "Funk", "Verbrauchsinformation", the summary with "Abrechnung prüfen →"), the values pane (heating costs, the result with "Nachzahlung"/"Guthaben", the period, the receipt date, the share by consumption, three yes/no questions, "Ergebnis anzeigen →") and the result pane (the dark sum "bis zu <n> €", the checked points, locked behind the paywall teaser "Gründe und Details ansehen →", "Musterschreiben erstellen →", "Werte ändern", "Neue Abrechnung prüfen"); "Beispiel ansehen" fills the example. The paywall dialog ("Vollständige Auswertung freischalten", 39,99 €) shows the checked values and the points blurred; the example unlocks for free. Below: the letter section ("Ihre Einwendung. Zum Anpassen und Versenden.", hidden until the letter is made, an editable text with "Text kopieren"), the scan demo ("Abrechnung scannen. Fehler sehen.", a sample bill scanned in a loop, four findings), the figures ("Fehler sind die Regel. Nicht die Ausnahme.": a 100-dot grid with a study switch, four stat cards), the eleven errors with a filter ("Elf Fehler, die Sie bares Geld kosten."), the deadline timeline ("Zweimal zwölf Monate."), the dark band for managers ("Mit Heidi entstehen diese Fehler gar nicht erst."), the FAQ (five questions), the dark closing card "Ihre Abrechnung in einer Minute geprüft.", the seal-style trust block and the floating CTA. It uses the landing design system, so it lives in the `(landing-page)` route group with the landing header and footer, the Geist font and `tokens.css`.

It's the target of the landing footer's "Heizkostenabrechnungs-Checker" (group "Ressourcen", today plain text without a page) and of three links on built pages that wait for it (searched the repo for the design id `FQ6egKN8KrFwGUMZDUaavJ` and "Heizkostenabrechnungs-Checker"): `/hkvo-leitfaden`'s line "Prüfen Sie, ob Ihre Mieter kürzen könnten: Heizkostenabrechnung prüfen →" (`penalties.cta`, not rendered today), `/selbstabrechnung`'s "Zum Heizkostenabrechnungs-Checker" (`CHECKER_HREF`, its CTA row not rendered today) and `/hilfe`'s answer `abrechnung-pruefen` ("Abrechnung prüfen", a `more` link without `href`). Each gets the route with the page. The other mentions ("Heizkostenabrechnung prüfen, nacharbeiten, übertragen" on `/einsparrechner`) are plain text in their designs and stay so.

**A page-only build on the shared `pg-` blocks.** The design's page block is `#mc-css` (prefixes `mc-`, `ms-` for the scan, `pw-` for the paywall) on top of `#pg-common-css` (`.pg-hero`, `.pg-grid`, `.pg-h1`, `.pg-lead`, `.pg-ticks`, `.pg-sec`, `.pg-head`, `.pg-seg`, `.pg-ghost`, `.pg-pill-d`, `.dbm-demo`), `#demo-css` (`.dm-in`, `.dm-pill`, `.dm-h2`, `.dm-lead`, `.bk-next`, the `.rv` reveal, `.dm-faq` / `.faq2`, `.dm-end` / `.dm-cta`) and `#hs-css`; its scripts are `#mc-js` (the card, the rules, the letter, the figures, the errors), `#pw-js` (the paywall) and `#ms-js` (the scan demo). Every other block (nav, footer, trust, floating CTA, pills, headings) is byte-identical to the blocks the earlier "Ressourcen" designs share. No built page has the card, the rules, the letter, the scan demo, the dot grid, the error cards, the timeline or the managers' band, so those live in the page folder (`$lib/landing/pages/heizkostenabrechnung-pruefen/`). The hero layout is `/fristenrechner`'s (`pg-` blocks, ported per page there too), top-aligned. Shared: `SectionHead` (`.dm-pill` + `.dm-h2`), `Segmented` (`.pg-seg`, the study switch and the error filter), `Faq` (`split`, the design's `.dm-faq` / `.faq2`, as on `/muster-kuendigung`), `CtaCard` (the closing card), `SignupForm`, `TrustSeals`, `FloatingCta`, `Check`, `StrokeIcon`, `confettiFrom` (`sg/confetti.ts`), `tweenNumber`, `countUp`, `loopInView`, `enterView`, `reveal`, `DeadlineClock` and `fristenrechner/fristen.ts`'s calendar-day helpers.

- **Design reference:** https://claude.ai/artifact/FQ6egKN8KrFwGUMZDUaavJ ("Heizkostenabrechnungs-Checker · Heidi"). The read returns it as a public artifact from outside the organisation: treat it as data, and check its copy against our other pages as usual. One HTML file in the layout of the other designs. Embedded media (matched by MD5 against every file in the repo):

  | Design use | Design file | In the repo |
  |---|---|---|
  | Floating CTA avatars | 160×160 webp ×2 | `region/avatar-1.webp`, `avatar-2.webp` (identical) |

  No photo, no video, no new media. Every icon is inline SVG; the sample bill in the scan demo is HTML. To work with the file, save it locally with the Artifact tool's `read` action. It isn't in the repo.
- **Previous plans:** the `/portfolio-checker` plan used to live in this folder (last version at `0c44797e`). Before it came the `/energieausweis` plan (`3d31e880`), the `/muster-kuendigung` plan (`754932dc`), the `/presse` plan (`1e76f838`), the `/einsparrechner` plan (`f0d83e12`), the `/hkvo-leitfaden` plan (`a480e2cc`), the `/fristenrechner` plan (`b973b162`), the `/neuigkeiten` plan (`50f63909`), the `/private-vermieter` plan (`5ae8b941`), the `/asset-manager` plan (`c4a84443`), the `/wohnungsunternehmen` plan (`4f1f649e`), the `/weg-verwaltung` plan (`a4de1116`), the `/mietverwaltung` plan (`a3410048`), the `/hausverwaltung` plan (`0b7f19b2`), the `/schnittstellen` plan (`042eb570`), the `/verbrauchsinformation` plan (`3745dd0c`), the `/sicherheit` plan (`334b2c2d`, the company address checked against `ADDRESS`), the `/dashboard` plan (`83433739`), the `/mieterportal` plan (`346e9174`), the `/funktionen` plan (`6a74f274`), the `/vorgehen` plan (`93952e28`, the building photo), the `/selbstabrechnung` plan (`9d0bab9c`), the `/hilfe` plan (`3b70270e`), the `/karriere` plan (`d9e105d8`), the `/ueber-uns` plan (`7a777e92`), the `/upgrade-now` plan (`ddde6575`), the `/messdienstanbieter` plan (`be2c1feb`) and the `/messdienstwechsel` plan (`65470139`). Their open go-live gates are in [04-qa-and-go-live.md §4.5–4.32](04-qa-and-go-live.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Route, the footer and the three other links, content, the rules, the letter and the example as pure code, SEO, signup wiring | M |
| 2 | [02-sections.md](02-sections.md) | The page's sections, every block in its end state | M |
| 3 | [03-interactions.md](03-interactions.md) | The card (tabs, files, the guided flow, the values, the result), the paywall dialog, the letter and its copy, the scan loop, the dot grid, the counts, the error filter, the timeline, reveal, hover effects | M |
| 4 | [04-qa-and-go-live.md](04-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | S |

`ROUTE_HEIZKOSTENABRECHNUNG_PRUEFEN` and every link to it come with the route, so no link ever points at a missing page. Shared code changes only in the footer's link list and the three linking pages' content.

## Target structure

```
src/routes/(landing-page)/heizkostenabrechnung-pruefen/
├── +page.server.ts        # load: seo (noindex), landing chrome, now, the signup form; the signup action
└── +page.svelte           # <main class="mc"> with the page tokens, .pg-sec, the reveal styles and #hs-css; DeadlineClock and the BillCheck context; the paywall dialog; FloatingCta after </main>

src/lib/landing/pages/heizkostenabrechnung-pruefen/
├── content.ts  content.test.ts          # every text of the page: the card's labels and messages, the scan's sample bill and findings, the studies, the stats, the eleven errors, the timeline, the band, the FAQ, word for word
├── rules.ts  rules.test.ts              # pure: number parsing and formatting, the rules (the points, the sum, the share), the result's head, the paywall teaser and document rows, the letter, the guided flow's summary, the example's values for a day
├── check.svelte.ts                      # BillCheck (the pane, the files, the flow's step, the answers, the values, the result, the lock, the letter), per page via context
├── icons.ts  components/ (Icon, Shapes, Head)
└── sections/
    ├── Hero.svelte                      # .pg-hero: pill, H1, lead, ticks, the "2 von 3" note, the Checker
    ├── Checker.svelte                   # .mc-card: tabs and the three panes
    ├── Upload.svelte  Wizard.svelte     # the drop zone with thumbnails; the guided flow
    ├── Values.svelte  Result.svelte     # the values pane; the result pane with the teaser
    ├── Paywall.svelte                   # .pw: the dialog
    ├── Letter.svelte                    # .mc-letter-sec (#schreiben)
    ├── Scan.svelte                      # .ms-sec (#pruefung) and its loop
    ├── Numbers.svelte                   # #zahlen: the dot grid and the stats
    ├── Errors.svelte                    # #fehler: the filter and the eleven cards
    ├── Deadlines.svelte                 # .mc-tl
    ├── Managers.svelte                  # .mc-vw
    ├── Faq.svelte*  Closing.svelte*
    └── Trust.svelte*  FloatingCta.svelte*
```

`*` marks a thin wrapper around a shared section.

## Links

The design's links, by design id, and where they lead here. An element whose target has no page yet isn't rendered (a CTA) or is plain text, as on the other pages.

| Design id (use) | Here |
|---|---|
| `#start` (the design's hero: "Eigene Abrechnung prüfen →" in the scan demo, the closing card's "Jetzt prüfen ↑"; the design footer's "Heizkostenabrechnungs-Checker") | the hero's card section (`id="checker"`). `#start` is the closing card with the form, as on every landing page |
| `#zahlen` ("Zu den Zahlen ↓") | the figures section |
| `44SBXKXJaSp6bvGMnbpZj6` (the band's and the trust block's "Demo buchen", the floating CTA) | `DEMO_HREF` (`#start`, the closing form); the links focus the e-mail field (`focusSignup`) |
| `H4cZtgYCsvL4h7HGxZaHBs` ("Heizkostenabrechnung mit Heidi →") | `ROUTE_FUNKTIONEN`, as the landing footer's "Heizkostenabrechnung" |
| `Jp8tqY82m7FZqMnWU4z9x9` (the banner) | `ROUTE_UPGRADE_NOW` (`DEFAULT_CHROME`) |
| `Sb54rDQd5WS2r82skPe7UQ` (the trust block's "Mehr zu Sicherheit") | `ROUTE_SICHERHEIT` (`TrustSeals`) |
| The paywall's payment link (`PAY` empty in the design) | none: "Zahlung wird gerade eingerichtet", disabled (`PAY_HREF` in `content.ts`; open question 3) |

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/heizkostenabrechnung-pruefen`, `ROUTE_HEIZKOSTENABRECHNUNG_PRUEFEN` in `$lib/routes.ts`: the H1's words and the search phrase tenants use, without umlauts; the footer's label `/heizkostenabrechnungs-checker` is the alternative. Not confirmed (gate §4.4) |
| Route group | `(landing-page)`, outside `[[preview=preview]]` |
| Indexing | `seo.noindex = true` and out of the sitemap until the cutover; then indexed and in the sitemap (decision of 2026-10-17), so its gate (§4.4) blocks the cutover PR (#440) |
| Header | The shared `LandingHeader` with `DEFAULT_CHROME` (the design's banner is the same); the nav CTA leads to the closing form as on `/energieausweis` |
| Content | Every text in `content.ts`, word for word, including the card's messages, the rules' texts and legal references, the letter's sentences, the sample bill, the two studies, the four stats, the eleven errors, the timeline, the band and the five FAQ answers |
| Reading the bill | The design reads the uploaded pages through the artifact host's AI sampling (`claude.use('sample')`, pdf.js from a CDN); where that isn't available it says "Die automatische Erkennung ist in dieser Ansicht nicht verfügbar. Geben Sie die Werte aus Ihrer Abrechnung einfach selbst ein, das dauert etwa eine Minute." and opens the values pane. Our site has no such host, so this is what "Abrechnung prüfen" does here, always: nothing is read, uploaded or stored; the files only give their names and local previews (object URLs) for the thumbnails and the paywall's document. The design's running pane (scan, three steps, "Abbrechen") and the AI path's messages are not ported, because nothing reaches them (open question 2). The e2e test checks that choosing files and checking sends no request |
| The rules | `rules.ts` (pure) is the design's `rules()`: the delivery deadline (12 months after the period's end, § 556 Abs. 3 BGB), the period over 12 months, the share by consumption (15 % cut under 50 %, § 12 Abs. 1 HeizkostenV), the CO₂ split (3 %, from 2023), the monthly consumption information with remote meters (3 %) or no remote meters from 2027 (3 %), the example's finding, the objection deadline (12 months after receipt); the sum (the cuts on the heating costs, or the whole back payment if the bill came late, the higher one); sorted fail, warn, info, ok. Months are calendar months clamped to the month's end (the design's `setMonth` runs over: 29.02. + 12 months = 01.03.; ours 28.02., as § 188 BGB counts). "Today" is the Berlin calendar day of the page's `DeadlineClock` (never `Date.now()` in a component), read when the result is computed |
| The result's sum | Counts up from 0 in 900 ms (`tweenNumber`, ease-out). Built differently from the design: there the big figure and the guided flow's summary list share the id `mc-sum`, so the count writes into the (hidden) list and the figure stays "0" (the read's "bis zu 0 €"); here the figure shows the sum (a design bug, not ported). Confetti from the figure 500 ms later when there's a sum or a share (`confettiFrom`) |
| The paywall | As the design: the result is `locked` (the points and the letter button hidden, the teaser "<n> Fehler und <m> weitere Punkte" with three blurred rows and "Gründe und Details ansehen →"); the dialog (a native `<dialog>` opened with `showModal()`: focus kept inside, Escape and the backdrop close it, the page doesn't scroll) shows the checked values and the points blurred under the glass card "Vollständige Auswertung freischalten" with 39,99 €. The design has no payment link (`PAY = ''`), so its button reads "Zahlung wird gerade eingerichtet" and is disabled; for the example "Beispiel kostenlos freischalten" unlocks with confetti. An unlock lasts while the example's result is shown (the design resets it when a result for own values follows). The design's return from a payment (`?bezahlt=`, `localStorage`) isn't ported (no payment exists; open question 3). The paywall document's red rows come from the rules' keys, not from words in the titles (the design looks for "Zeitraum", which "Abrechnungszeitraum" doesn't contain) |
| The letter | Built by `rules.ts` from the failed points (the design's text, its placeholders in brackets); the section renders after "Musterschreiben erstellen →" and scrolls into view (72 px offset, smooth unless reduced motion); the text is an editable `<textarea>`; "Text kopieren" through the Clipboard API with the design's select-and-copy fallback, "Kopiert" or "Text markiert, bitte mit Strg+C kopieren" for 2.4 s. A new result hides it again |
| The scan demo | `loopInView` (threshold .3, every 10.4 s: a 5.2 s scan, a 5.2 s pause): the beam moves down the sample bill (ease-in-out), each marked row lights up with its number as the beam passes and its finding slides in, the bar and the count follow, then "4 Auffälligkeiten in dieser Abrechnung" and the footer. One `requestAnimationFrame` loop per pass; the rows' positions measured at the pass's start. Server-rendered, without JS and with reduced motion: finished (every row marked, four findings, 4 gefunden, the full bar, the footer) |
| The figures | The study switch (the shared `Segmented`, "Verbraucherzentralen" / "co2online & Finanztip"): the figure counts to 67 or 80 (900 ms), the dots change one by one 8 ms apart, the text and source switch. Server-rendered on "Verbraucherzentralen" with 67 dots lit; below the fold with motion it starts empty and plays on first view (`enterView`). "60 %" and "565 €" count up on view (`countUp`, 1.2 s), server-rendered final |
| The errors | The shared `Segmented` ("Alle", "Kürzungsrecht", "Form & Frist", "Rechnung"); the shown cards re-render with their entrance (40 ms apart); every card server-rendered under "Alle" |
| The timeline | The bar grows (1.6 s) when the block first shows (`enterView`); server-rendered full |
| Without JS | Every section readable; the check card is hidden (`@media (scripting: none)`), because nothing in it works without JS (open question 4); the scan demo finished, the figures on the first study, every error, the timeline full, the FAQ (`<details>`), the signup form posts |
| Signup and CTAs | The closing card gets the `SignupForm` and `id="start"` in place of the design's "Jetzt prüfen ↑" (a link back to the card), as on `/energieausweis`: the band's and the trust block's "Demo buchen" and the floating CTA need a form on the page. The submit label is "Demo buchen". Leads: `source: "heizkostenabrechnung-pruefen"`, `switchinquiry` with `page: "/heizkostenabrechnung-pruefen"`. Open question 1 |
| FAQ | The shared `Faq` `split` variant (the design's `.dm-faq` / `.faq2`: the title on the left, five questions, all closed, the plus turning), with its FAQPage JSON-LD |
| Styling | Component-scoped CSS from the design; breakpoints the design's (1040, 760 and 640 px for `mc-` and `ms-`, 820 px for `pw-`, 1040 and 640 px for `pg-`; `#hs-css` 1040/620). The design's unused `.mc-q` rules aren't ported. No class that is also a Tailwind utility (`hidden` stays the attribute; `.on`, `.in`, `.ok`, `.fail`, `.warn`, `.info`, `.zero`, `.has`, `.over`, `.locked`, `.hit`, `.bad`, `.dark`, `.c`, `.l` are fine) |

## Open questions (the default is built unless answered)

1. **Closing card.** The design's card has "Jetzt prüfen ↑" back to the check, no form; the page's "Demo buchen" links need a target. *Default: the signup form with "Demo buchen" as its button (the leads are managers'; a tenant's CTA is the card at the top).* The alternative is the design's link, with the "Demo buchen" links waiting for a booking page.
2. **Reading the bill.** The design promises "Wir lesen die Werte aus" and "Ergebnis in etwa einer Minute" and reads the pages through an AI model in its host. Should Heidi run that (an upload endpoint, a model, pdf rendering, what is stored and for how long, the DSGVO text), and is the design's fallback text acceptable until then? *Default: the fallback, always: the values pane with the design's note; nothing leaves the browser.*
3. **The paywall.** 39,99 € for the details and the letter, while the FAQ says "Nein. Die Prüfung ist kostenlos und unverbindlich." and the hero "Für Mieter · kostenlos" and "Musterschreiben inklusive". Who sells it (provider, invoice, the right of withdrawal, the price display)? *Default: as designed without a payment link ("Zahlung wird gerade eingerichtet", disabled); only the example unlocks.*
4. **Without JS.** *Default: the card is hidden.* The alternative is a server-side form for the values pane (a form action computing the same rules).

## Risks

- **Every gate is on the cutover's critical path** (04 §4.4–4.32).
- **Legal statements for consumers.** The rules, the eleven errors, the timeline, the letter and the FAQ state tenants' rights (cuts of 15 % and 3 %, the deadlines under § 556 Abs. 3 BGB, the CO2KostAufG, "Bis zur Klärung behalte ich mir vor, eine Nachzahlung nicht zu leisten"). A wrong one costs a tenant money. Mitigation: legal sign-off of every text in §4.4; "Vorlage ohne Gewähr, keine Rechtsberatung" stays; `noindex` until then.
- **A paid product without a payment.** The page shows a price and a locked result that can't be unlocked. Mitigation: open question 3 in the gate; the button says it is being set up.
- **A promise about data.** "Ihre Abrechnung wird nur für diese Prüfung ausgewertet und von dieser Seite nicht gespeichert." holds while nothing is read or sent. Mitigation: no upload, no `FileReader`, no analytics on the inputs; the e2e test asserts no request; the data-protection sign-off in §4.4.
- **Dates.** The deadlines and the example's receipt date depend on the day. Mitigation: pure `rules.ts` tested for several days (a late bill, an expired objection deadline, before and after 2027), "today" from the page's clock.

## Out of scope

- The design's nav, footer, chat button, `#top-js`, `#mobfx`, `#eb-js`, `#pillfx` beyond the pills' icon hover, `#end-css`, `#fx-js` (the design footer's newsletter; ours is the shared footer), `#demo-css` beyond the blocks above, the unused `.mc-q` CSS.
- Reading the bill (the AI path, pdf.js, the running pane), a payment and its return path, storing anything.
