# Page `/partnerschaften` ("Partnerschaften"): plan

A page for anyone who wants to work with Heidi (software vendors, installation companies, associations, metering businesses), the fifth and last page from the landing footer's "Partner" group (Installationspartner, Softwarepartner, Verbände, Nachfolge, Partnerschaften; the last one plain text today). Dark, on the `uv` template of `/mieterportal`, the "Kunden" pages and the other partner pages: the huge word "Partnerschaften" with the lead "Sie haben ein Produkt, ein Netzwerk oder eine Idee, die zu Heidi passt? Lassen Sie uns zusammenarbeiten." and "Kontakt aufnehmen" / "Mehr erfahren", the three panels (a facade, the app window "Gemeinsam mit Heidi" with four partner kinds turning green, a consultation photo), the statement lighting up word by word, four feature rows ("Eine Anbindung. Alle Kunden.", "Regional stark. Bundesweit vernetzt.", "Verbände und Messdienste.", "Partnerschaft auf Augenhöhe."), the rotating "Partner bei Heidi:", "Partnerschaften in Zahlen", the two audience cards ("Sie sind Softwareanbieter?" **with a small inquiry form "Anbindung anfragen" in place of the photo** / "Sie sind Installationsbetrieb?"), three customer quotes, the wide photo "Gemeinsam bauen wir den Messdienst von morgen.", **the contact form** ("Lassen Sie uns über Zusammenarbeit reden.": three steps beside a white form with six fields), the FAQ (five questions), the glass closing card "Lassen Sie uns zusammenarbeiten." with the video button "Demo buchen", the seal-style trust block and the floating CTA. It uses the landing design system, so it lives in the `(landing-page)` route group with the landing header and footer, the Geist font and `tokens.css`.

It's the target of the landing footer's "Partnerschaften" (group "Partner", plain text today), of `/nachfolge`'s second audience card "Mehr Partnerschaften?" ("Zu den Partnerschaften", hidden today) and of `/neuigkeiten`'s story "Partnerschaften: Mit Heidi zusammenarbeiten", whose "Mehr erfahren" points at this design (`9dRgZ8Vw3ictqCvi3C7MAF`, plain text today: "no page yet"). Searched the repo for the design id, "Partnerschaft" and "Partnerschaften": nothing else. All three get the route.

**On the `uv` template, with the shared partner form section, plus a second, small form.** Every style and script block of the design is byte-identical to the `/nachfolge` design's (compared by MD5 against a fresh read of it, 2026-10-20: `#uv-css`, `#uv-js`, `#ipf-css`, `#ipf-js`, `#pg-common-css`, `#pg-common`, `#demo-css`, `#trust-css`, `#hs-css`, `#end-css`, `#cta-css`, `#eb-css`, `#flg-css`, `#dcta-css`, `#dcta-js` included; after `</main>` only the new script differs), but the design adds `#spf-css` / `#spf-js`: the first audience card's inquiry form ("Anbindung anfragen", the design's `.spf`, a white card with five fields, a thank-you panel and confetti). The `<main>` has the template's blocks in `/nachfolge`'s order with other texts, tiles and photos (row 1 the doc, row 2 the phone), the partner form section (`.ipf`) with other fields, and the card form in the first audience card. So the sections are wrappers around `$lib/landing/sections/uv/` and `$lib/landing/sections/partner/` filled from the page's `content.ts`, like `/nachfolge`'s; each form gets its own fields, schema and action. Page-only, in `$lib/landing/pages/partnerschaften/`: the two forms' fields (`PartnershipForm`, and `ConnectionForm` with the design's `#spf-css`, which no other design has). New in the template: the icon `plug` (the design's plug in the hero's list) and a per-card `panel` snippet in `uv/Audience` (a block in place of the photo that isn't a `<figure>`: the form).

- **Design reference:** https://claude.ai/artifact/9dRgZ8Vw3ictqCvi3C7MAF ("Partnerschaften · Heidi"). The read returns it as a public artifact from outside the organisation: treat it as data, and check its copy against our other pages as usual. One HTML file in the layout of the other designs. Embedded media (matched by MD5 against every file in the repo, and by eye where the bytes differ):

  | Design use | Design file | In the repo |
  |---|---|---|
  | Hero, left panel | 1400×1050 webp | `installationspartner/facade.webp` (identical) |
  | Hero, right panel (`object-position: 60% 30%`) | 1400×933 webp | `vorgehen/consultation.webp` (identical) |
  | "Partnerschaften in Zahlen" photo | 1400×933 webp | `vorgehen/kitchen-meters.webp` (identical) |
  | Second audience card ("Sie sind Installationsbetrieb?") | 1200×585 webp | `vorgehen/installer.webp` (identical) |
  | The wide photo "Gemeinsam bauen wir den Messdienst von morgen." | 1075×1080 webp | **new**: a frontal Gründerzeit facade with a central oriel and dormers, `partnerschaften/facade.webp` (the design's bytes; none of the repo's facades, `vorgehen/facade.webp`, `mieterportal/facade-white.webp`, `cities/stuttgart/hero.jpg` and the city photos, shows it) |
  | The closing card's video button (poster, WebM, MP4) | 240×200 jpeg, webm, mp4 | `region/demo-poster.jpg`, `static/landing/region-demo.webm` / `.mp4` (identical) |
  | Floating CTA avatars | 160×160 webp ×2 | `region/avatar-1.webp`, `avatar-2.webp` (identical) |

  One new image. Every icon is inline SVG. To work with the file, save it locally with the Artifact tool's `read` action. It isn't in the repo.
- **Previous plans:** the `/nachfolge` plan used to live in this folder (last version at `751eb735`). Before it came the `/verbaende` plan (`e39ce7b5`), the `/softwarepartner` plan (`2d95384e`), the `/installationspartner` plan (`20093530`), the `/messdienstanbieter-vergleich` plan (`95202c27`), the `/heizkostenabrechnung-pruefen` plan (`b27b1e25`), the `/portfolio-checker` plan (`0c44797e`), the `/energieausweis` plan (`3d31e880`), the `/muster-kuendigung` plan (`754932dc`), the `/presse` plan (`1e76f838`), the `/einsparrechner` plan (`f0d83e12`), the `/hkvo-leitfaden` plan (`a480e2cc`), the `/fristenrechner` plan (`b973b162`), the `/neuigkeiten` plan (`50f63909`), the `/private-vermieter` plan (`5ae8b941`), the `/asset-manager` plan (`c4a84443`), the `/wohnungsunternehmen` plan (`4f1f649e`), the `/weg-verwaltung` plan (`a4de1116`), the `/mietverwaltung` plan (`a3410048`), the `/hausverwaltung` plan (`0b7f19b2`), the `/schnittstellen` plan (`042eb570`), the `/verbrauchsinformation` plan (`3745dd0c`), the `/sicherheit` plan (`334b2c2d`, the company address checked against `ADDRESS`), the `/dashboard` plan (`83433739`), the `/mieterportal` plan (`346e9174`), the `/funktionen` plan (`6a74f274`), the `/vorgehen` plan (`93952e28`, the building photo), the `/selbstabrechnung` plan (`9d0bab9c`), the `/hilfe` plan (`3b70270e`), the `/karriere` plan (`d9e105d8`, the application form), the `/ueber-uns` plan (`7a777e92`), the `/upgrade-now` plan (`ddde6575`), the `/messdienstanbieter` plan (`be2c1feb`) and the `/messdienstwechsel` plan (`65470139`). Their open go-live gates are in [04-qa-and-go-live.md §4.5–4.38](04-qa-and-go-live.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Route, the footer, `/nachfolge` and `/neuigkeiten` links, content, the two forms' schemas and actions (Make.com `partnershipinquiry`, `connectioninquiry`), the new photo, SEO | M |
| 2 | [02-sections.md](02-sections.md) | The page's sections: wrappers around `uv/` and `partner/`, the two forms' fields, the audience card's panel; every block in its end state | S |
| 3 | [03-interactions.md](03-interactions.md) | The two forms' validation and states (the card form's thank-you panel and confetti), the video button, the shared template's loops | S |
| 4 | [04-qa-and-go-live.md](04-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | S |

`ROUTE_PARTNERSCHAFTEN` and the three links come with the route, so no link ever points at a missing page. Shared code changes only where listed above (the `uv` template's icon and `Audience`'s `panel`), defaulting to today's behaviour.

## Target structure

```
src/routes/(landing-page)/partnerschaften/
├── +page.server.ts        # load: seo (noindex), landing chrome (nav CTA to /messdienstwechsel), faq, the two forms; the actions `partnership` and `connection`
└── +page.svelte           # <main class="ps"> with the page tokens, the reveal styles and #hs-css; UvMain around the dark sections; Trust and FloatingCta after it

src/lib/forms/partnershipInquiry.ts  partnershipInquiry.test.ts    # the contact form: zod schema (shared client/server), the kinds of partnership, German messages
src/lib/forms/connectionInquiry.ts   connectionInquiry.test.ts     # the card form: zod schema, the kinds of software, German messages
src/lib/server/partnershipInquiry.ts partnershipInquiry.test.ts    # emptyPartnershipForm(), handlePartnershipInquiry(): honeypot → timing → zod → gibberish → rate limit → Make.com `partnershipinquiry`
src/lib/server/connectionInquiry.ts  connectionInquiry.test.ts     # emptyConnectionForm(), handleConnectionInquiry(): the same pipeline → Make.com `connectioninquiry`

src/lib/assets/landing/partnerschaften/
└── facade.webp            # the wide photo (new)

src/lib/landing/pages/partnerschaften/
├── content.ts  content.test.ts          # every text of the page, the example data of the mocks and tiles, the forms' labels and messages, word for word
└── sections/
    ├── Hero.svelte*  Statement.svelte*  Rows.svelte*  Rotator.svelte*  Numbers.svelte*
    ├── Audience.svelte*                 # uv/Audience; the first card's panel is ConnectionForm
    ├── ConnectionForm.svelte            # "Anbindung anfragen" (the design's .spf): fields, message line, thank-you panel with confetti (superforms, works without JS)
    ├── Quotes.svelte*  Picture.svelte*
    ├── Apply.svelte*                    # #kontakt: partner/Apply with PartnershipForm
    ├── PartnershipForm.svelte           # the fields in partner/FormFrame (superforms, works without JS)
    └── Faq.svelte*  Closing.svelte*  Trust.svelte*  FloatingCta.svelte*
```

`*` marks a thin wrapper around a shared section.

## Links

The design's links, by design id, and where they lead here. An element whose target has no page yet isn't rendered (a CTA) or is plain text, as on the other pages.

| Design id (use) | Here |
|---|---|
| `#kontakt` (the hero's "Kontakt aufnehmen", every row's "Partnerschaft anfragen") | the form section |
| `#inhalt` (the hero's "Mehr erfahren") | the rows |
| `#faq` (every row's "Häufige Fragen") | the FAQ |
| `#start` (the design's hero) | none: the hero has no form, and this page has no signup form (as `/nachfolge`) |
| `3AZnpE4apaUo694utixF1d` (row 1's "Heidi API", FAQ 3's "API-Dokumentation") | none yet: plain text, as `/softwarepartner`'s hidden "API-Dokumentation" |
| `6hhBpn794w5tbp9t8Rk7CH` (row 2's "Mehr für Installationsbetriebe", the second card's "Installationspartner werden") | `ROUTE_INSTALLATIONSPARTNER` |
| `L4T9Q3Z4f84fJhLMXjnkms` (row 3's "Mehr zur Nachfolge", FAQ 4's "Nachfolge") | `ROUTE_NACHFOLGE` |
| `Fc97HY7KUdBR38T6vPtjeY` (the first card's "Softwarepartner werden", FAQ 3's "Softwarepartner") | `ROUTE_SOFTWAREPARTNER` |
| `44SBXKXJaSp6bvGMnbpZj6` (the closing card's video button "Demo buchen", the trust block's "Demo buchen", the floating CTA "Erstgespräch vereinbaren") | `#kontakt`, the page's own form, as on `/nachfolge` (open question 1); the shared header's nav CTA "Bestand prüfen" → `/messdienstwechsel` |
| `Sb54rDQd5WS2r82skPe7UQ` (FAQ 5's "Mehr zu Sicherheit", the trust block's "Mehr zu Sicherheit") | `ROUTE_SICHERHEIT` (the FAQ's `more`, `TrustSeals`) |
| `Jp8tqY82m7FZqMnWU4z9x9` (the banner) | `ROUTE_UPGRADE_NOW` through `DEFAULT_CHROME` |

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/partnerschaften`, `ROUTE_PARTNERSCHAFTEN` in `$lib/routes.ts`: the footer's label, lower-case, as `/verbaende` and `/nachfolge`. Not confirmed (gate §4.4) |
| Route group | `(landing-page)`, outside `[[preview=preview]]` |
| Indexing | `seo.noindex = true` and out of the sitemap until the cutover; then indexed and in the sitemap (decision of 2026-10-17), so its gate (§4.4) blocks the cutover PR (#440) |
| Header | The shared `LandingHeader` with `DEFAULT_CHROME` (the design's banner is the same). The page has no signup form, so the nav CTA "Bestand prüfen" leads to `/messdienstwechsel`, as on the other partner pages |
| Template | The `uv` template (`UvMain`, `Hero` `lg`, `ListMock`, `Statement`, `Rows` with `Doc`, `Phone`, `Calendar`, `Bill`, `Rotator`, `Numbers`, `Audience`, `Quotes`, `Picture`, `Faq`), filled from `content.ts` like `/nachfolge`. The template's additions (the icon `plug`, `Audience`'s `panel`) change nothing on the other `uv` pages |
| The hero word | "Partnerschaften" in `clamp(34px, 8.6vw, 130px)` (the design's `#ipf-css` rule, the same as the other partner pages'), through `Hero`'s `wordSize` |
| The hero's app window | `ListMock` with the design's four entries: "Softwareanbieter" (`plug`, "In Abstimmung" → "Verbunden"), "Installationsbetriebe" (`tool`, "In Schulung" → "Zertifiziert"), "Verbände und Netzwerke" (`users`, "Im Austausch" → "Vernetzt"), "Messdienstanbieter" (`building`, "Im Gespräch" → "Vereinbart") |
| Row 1's doc | `uv/Doc` "Schnittstelle" with three check rows and the value row "Standard: bved", the result "Verbunden", on the stone tile |
| Row 2's phone | `uv/Phone` with its figure (the notification "Neuer Auftrag in Ihrer Region", then "Digitaler Zwilling" / "12 Wohnungen" with one chip), on the ink tile |
| Row 3's grid | `uv/Calendar` with nine cells "VDIV", "DEUMESS", "bved", "Software", "Installation", "Messdienst", "Verwaltung", "Verband", "Ihre Idee" (the template's three columns), the ninth current: eight "dabei", "Ihre Idee" "im Gespräch"; the note "Ihre Idee im Gespräch" |
| No deadline figure | Unlike `/nachfolge`, the bento has none ("VDIV", the photo, "DEUMESS", "bved", "15.000+", "DE"), so `load` passes no `now` and no text expires (only the shared banner names the deadline) |
| The contact form | The shared `partner/Apply` and `partner/FormFrame` (`#ipf-css` is the same block on all partner designs), with this page's fields, schema and action. A SvelteKit form action (`?/partnership`) with `sveltekit-superforms` + zod (`$lib/forms/partnershipInquiry.ts`), working without JS, posting to `#kontakt`. Fields as the design: Unternehmen, Ihr Name, E-Mail, Art der Partnerschaft (select) and the consent required; Telefon (checked only when given) and Nachricht optional. The design only shows a thank-you and sends nothing; here a valid inquiry goes to Make.com as the new event `partnershipinquiry` through `sendWebhookEventOrThrow`, like the other partner forms: nothing is stored in our database and nothing personal is logged. Spam pipeline as there (honeypot → timing `_t`, re-stamped on mount → zod → gibberish → rate limit, 3 per 10 min per IP with its own counter, 50 under `KITCHEN_SINK`); a bot gets the success answer. Errors after the first submit with the design's one line "Bitte füllen Sie die markierten Felder aus."; success "Danke, <Name>! Wir melden uns bei Ihnen." (as `/nachfolge`, in place of the design's "Die Online-Übermittlung schalten wir gerade frei …"); a failed send keeps the values and shows `PHONE`. Open question 2 |
| The card form | "Anbindung anfragen" in the first audience card (the design's `.spf`, `#spf-css` / `#spf-js`), page-only (`ConnectionForm`), in `uv/Audience`'s new per-card `panel` (a `<div>`, not the photo's `<figure>`). Its own action (`?/connection`), schema (`$lib/forms/connectionInquiry.ts`: Unternehmen, Ihr Name, E-Mail, Ihre Software (select) and the consent required, Nachricht optional) and event `connectioninquiry`, the same spam pipeline with its own counter; superforms ids `partnership` / `connection` keep the two forms apart. Errors: the design's red fields and consent and its line "Bitte füllen Sie die markierten Felder aus."; success: the design's thank-you panel in place of the form ("Danke für Ihre Anfrage." / "Ihr persönlicher Ansprechpartner meldet sich bei Ihnen.", the green tick) with the design's confetti from the tick (`sg/confetti.ts`'s `confettiFrom`, the design's `PG.confetti`); a failed send keeps the values and shows `PHONE` in its line. Without JS it posts to `#anbindung` (the card) and the response renders the panel or the marks. Open question 3 |
| Why two new events | The fields differ from each other and from `/softwarepartner`'s (no product, no customer count), and the general inquiries go to whoever triages partnerships, the card's to whoever answers software vendors. One event per form keeps each Make.com route simple |
| No signup form | The design's three "Demo buchen" / "Erstgespräch vereinbaren" lead to the demo-booking design. This page is for partners, not for managers, and its own form is the first conversation ("Wir melden uns persönlich."), so they lead to `#kontakt`, as on `/nachfolge`: the closing card's video button, the trust block (`TrustSeals` `demoHref`) and the floating CTA (`FloatingCta` `href`; hidden while the closing card is on screen, `final`). Open question 1 |
| Closing card | The shared `CtaCard`, `tone="glass"`, `final`, the title and the text, with the shared `DemoVideoButton` ("Demo buchen", "Mit Ihrem Ansprechpartner", the region demo video) as its `action`, as `/nachfolge` |
| Audience cards | "Sie sind Softwareanbieter?" with "Softwarepartner werden" → `/softwarepartner` and the card form; "Sie sind Installationsbetrieb?" with "Installationspartner werden" → `/installationspartner` and its photo |
| Links in the copy | Row 2's "Mehr für Installationsbetriebe" → `/installationspartner`, row 3's "Mehr zur Nachfolge" and FAQ 4's "Nachfolge" → `/nachfolge`, FAQ 3's "Softwarepartner" → `/softwarepartner`; "Heidi API" (row 1) and "API-Dokumentation" (FAQ 3) plain text until that page exists |
| Quotes | The shared testimonials `werne`, `vitolus`, `gerhard` (word for word the shared texts) under "Gemeinsam besser." / "Unsere Kunden sagen es selbst." |
| FAQ | The `uv` FAQ (shared `Faq`, dark, all closed) with its FAQPage JSON-LD; answers with inline links as the other pages' (`<a>` in `answer`); FAQ 5's "Mehr zu Sicherheit" → `/sicherheit` |
| Figures | `Numbers` with "VDIV", the photo, "DEUMESS", "bved", "15.000+" and "DE", all compact (the design's `.dt`); none counts |
| Styling | Component-scoped CSS from the design; breakpoints the design's (`#ipf-css` 900 px, `#spf-css` 560 px, the template's 980/620 px, `#hs-css` 1040/620 px, `#dcta-css` 640 px). No class that is also a Tailwind utility |

## Open questions (the default is built unless answered)

1. **The demo CTAs.** The design sends the closing card's "Demo buchen", the trust block's "Demo buchen" and the floating CTA "Erstgespräch vereinbaren" to the demo-booking design, which has no page. *Default: the page's own form (`#kontakt`), since the page's visitors are partners, as on `/nachfolge`, and the nav CTA to `/messdienstwechsel`.* Alternative: `/messdienstwechsel#start`, as on `/softwarepartner`.
2. **Where partnership inquiries go.** The design's form sends nothing yet. *Default: Make.com `partnershipinquiry` with every field and `page`, for a route the business sets up (who triages them, who answers "Wir melden uns persönlich.").* Until the route exists, Make.com receives the events on the unified webhook like the others.
3. **The card form.** A second form for software vendors, beside the page's own and `/softwarepartner`'s. *Default: built as designed, sending `connectioninquiry` (company, name, software, message, page).* Alternatives: send it as `softwarepartnerinquiry` (its route already reaches whoever answers software vendors, but the fields differ), or drop the form and keep only "Softwarepartner werden".
4. **The new photo.** The facade looks like a stock or archive photo. *Default: used as designed, `alt=""` (decorative).* A licence or another photo before the cutover.

## Risks

- **Every gate is on the cutover's critical path** (04 §4.4–4.38).
- **Partnerships in public.** "Heidi ist Kooperationspartner Bund des VDIV und im Verband DEUMESS vernetzt.", "Installationsbetriebe werden zertifizierte Heidi-Partner. Wir schulen Ihr Team, stellen das Installationstool und planen die Einsätze in Ihrer Region.", "Webservices nach bved-Standard" and the hero's list name programmes and memberships other pages make claims about too. Mitigation: aligned with `/verbaende` (§4.6), `/installationspartner` (§4.8), `/softwarepartner` (§4.7) and `/nachfolge` (§4.5) in §4.4; `noindex` until then.
- **Two forms on one page.** Two actions, two schemas, two superforms on one page could answer into the wrong form. Mitigation: named actions, distinct superforms ids, the e2e tests send both forms and check that only the sent one changes.

## Out of scope

- The design's nav, footer, chat button, `#top-js`, `#mobfx`, `#eb-js`, `#pillfx` beyond the eyebrows, `#fx-js` (the design footer's newsletter; ours is the shared footer), `#pg-common-css` / `#demo-css` / `#pg-common` beyond the blocks the template and the confetti use.
- Storing inquiries, the demo-booking page, the API documentation page.
