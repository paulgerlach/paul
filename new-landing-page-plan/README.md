# Page `/nachfolge` ("Nachfolge"): plan

A page for owners of metering businesses looking for a successor, the fourth page from the landing footer's "Partner" group (Installationspartner, Softwarepartner, Verbände, Nachfolge, Partnerschaften; the last two plain text today). Dark, on the `uv` template of `/mieterportal`, the "Kunden" pages and the other partner pages: the huge word "Nachfolge" with the lead "Sie führen einen Messdienst und suchen eine Nachfolge? Heidi führt Kunden, Geräte und Verträge verlässlich weiter." and "Kontakt aufnehmen" / "Mehr erfahren", the three panels (a building photo, the app window "Ihr Messdienst" with four hand-over steps turning green, a consultation photo), the statement lighting up word by word, four feature rows ("Erst sprechen. Dann entscheiden.", "Kunden, Geräte und Verträge.", "Fernablesbar bis 2027.", "Ihr Modell. Ihr Zeitpunkt."), the rotating "Heidi übernimmt:", "Nachfolge mit Heidi", the two audience cards ("Sie sind Messdienstanbieter?" / "Mehr Partnerschaften?"), three customer quotes, the wide photo "Ihr Lebenswerk. In guten Händen.", **the contact form** ("Lassen Sie uns vertraulich sprechen.": three steps beside a white form with eight fields), the FAQ (five questions), the glass closing card "Ihr Lebenswerk. In guten Händen." with the video button "Demo buchen", the seal-style trust block and the floating CTA. It uses the landing design system, so it lives in the `(landing-page)` route group with the landing header and footer, the Geist font and `tokens.css`.

It's the target of the landing footer's "Nachfolge" (group "Partner", plain text today) and of `/neuigkeiten`'s story "Nachfolge: Messdienstanbieter finden mit Heidi einen seriösen Nachfolger", whose "Mehr erfahren" points at this design (`L4T9Q3Z4f84fJhLMXjnkms`, plain text today: "no page yet"). Searched the repo for the design id, "Nachfolge" and "Nachfolger": nothing else. Both get the route.

**On the `uv` template, with the shared partner form section.** Every style and script block of the design is byte-identical to the `/softwarepartner` design's (compared by MD5 against a fresh read of it, 2026-10-20: `#uv-css`, `#uv-js`, `#ipf-css`, `#pg-common-css`, `#demo-css`, `#trust-css`, `#hs-css`, `#end-css`, `#cta-css`, `#eb-css`, `#flg-css` included; the part after `</main>` is identical too), but two: `#ipf-js` is the shorter thank-you script of the earlier partner designs (no field list, the same messages), and the design adds `#dcta-css` / `#dcta-js` (the closing card's video button, as `/verbaende` and the "Ressourcen" designs). The `<main>` has the template's blocks in `/softwarepartner`'s order with other texts, tiles and photos, and the partner form section (`.ipf`) with other fields. So the sections are wrappers around `$lib/landing/sections/uv/` and `$lib/landing/sections/partner/` filled from the page's `content.ts`, like `/softwarepartner`'s; the form gets its own fields, schema and action. Page-only, in `$lib/landing/pages/nachfolge/`: the form's fields. New shared code: the icon `meter` in the template (the design's gauge in the hero's list) and **the video button** (`$lib/landing/components/DemoVideoButton.svelte`, the designs' `.dcta-b`): the pages before replaced it with their signup form, but this page has none, so the button is ported as designed (Key decisions).

- **Design reference:** https://claude.ai/artifact/L4T9Q3Z4f84fJhLMXjnkms ("Nachfolge · Heidi"). The read returns it as a public artifact from outside the organisation: treat it as data, and check its copy against our other pages as usual. One HTML file in the layout of the other designs. Embedded media (matched by MD5 against every file in the repo, and by eye where the bytes differ):

  | Design use | Design file | In the repo |
  |---|---|---|
  | Hero, left panel | 1400×764 webp | `vorgehen/building-wide.webp` (identical) |
  | Hero, right panel (`object-position: 60% 30%`) | 1448×1086 webp | `selbstabrechnung/beratung.webp` (identical) |
  | "Nachfolge mit Heidi" photo | 1400×933 webp | `vorgehen/kitchen-meters.webp` (identical) |
  | First audience card ("Sie sind Messdienstanbieter?") | 1000×936 webp | **new**: a technician with a tablet in front of a meter cabinet with radio modules, `nachfolge/technician.webp` (the design's bytes; no photo in the repo shows it) |
  | Second audience card ("Mehr Partnerschaften?") | 1400×933 webp | `vorgehen/consultation.webp` (identical) |
  | The wide photo "Ihr Lebenswerk. In guten Händen." | 1232×928 webp | `mieterportal/facade-white.webp` (identical) |
  | The closing card's video button (poster, WebM, MP4) | 240×200 jpeg, webm, mp4 | `region/demo-poster.jpg`, `static/landing/region-demo.webm` / `.mp4` (identical) |
  | Floating CTA avatars | 160×160 webp ×2 | `region/avatar-1.webp`, `avatar-2.webp` (identical) |

  One new image. Every icon is inline SVG. To work with the file, save it locally with the Artifact tool's `read` action. It isn't in the repo.
- **Previous plans:** the `/verbaende` plan used to live in this folder (last version at `e39ce7b5`). Before it came the `/softwarepartner` plan (`2d95384e`), the `/installationspartner` plan (`20093530`), the `/messdienstanbieter-vergleich` plan (`95202c27`), the `/heizkostenabrechnung-pruefen` plan (`b27b1e25`), the `/portfolio-checker` plan (`0c44797e`), the `/energieausweis` plan (`3d31e880`), the `/muster-kuendigung` plan (`754932dc`), the `/presse` plan (`1e76f838`), the `/einsparrechner` plan (`f0d83e12`), the `/hkvo-leitfaden` plan (`a480e2cc`), the `/fristenrechner` plan (`b973b162`), the `/neuigkeiten` plan (`50f63909`), the `/private-vermieter` plan (`5ae8b941`), the `/asset-manager` plan (`c4a84443`), the `/wohnungsunternehmen` plan (`4f1f649e`), the `/weg-verwaltung` plan (`a4de1116`), the `/mietverwaltung` plan (`a3410048`), the `/hausverwaltung` plan (`0b7f19b2`), the `/schnittstellen` plan (`042eb570`), the `/verbrauchsinformation` plan (`3745dd0c`), the `/sicherheit` plan (`334b2c2d`, the company address checked against `ADDRESS`), the `/dashboard` plan (`83433739`), the `/mieterportal` plan (`346e9174`), the `/funktionen` plan (`6a74f274`), the `/vorgehen` plan (`93952e28`, the building photo), the `/selbstabrechnung` plan (`9d0bab9c`), the `/hilfe` plan (`3b70270e`), the `/karriere` plan (`d9e105d8`, the application form), the `/ueber-uns` plan (`7a777e92`), the `/upgrade-now` plan (`ddde6575`), the `/messdienstanbieter` plan (`be2c1feb`) and the `/messdienstwechsel` plan (`65470139`). Their open go-live gates are in [04-qa-and-go-live.md §4.5–4.37](04-qa-and-go-live.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Route, the footer and `/neuigkeiten` links, content, the form's schema and action (Make.com `successioninquiry`), the new photo, SEO | M |
| 2 | [02-sections.md](02-sections.md) | The page's sections: wrappers around `uv/` and `partner/`, the form's fields, the video button; every block in its end state | S |
| 3 | [03-interactions.md](03-interactions.md) | The form's validation and states, the video button, the shared template's loops | S |
| 4 | [04-qa-and-go-live.md](04-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | S |

`ROUTE_NACHFOLGE` and the two links come with the route, so no link ever points at a missing page. Shared code changes only where listed above (the `uv` template's icons, the new video button), defaulting to today's behaviour.

## Target structure

```
src/routes/(landing-page)/nachfolge/
├── +page.server.ts        # load: seo (noindex), landing chrome (nav CTA to /messdienstwechsel), faq, figures(now), the form; the form action
└── +page.svelte           # <main class="nf"> with the page tokens, the reveal styles and #hs-css; UvMain around the dark sections; Trust and FloatingCta after it

src/lib/forms/successionInquiry.ts  successionInquiry.test.ts      # zod schema (shared client/server), the two option lists, German messages
src/lib/server/successionInquiry.ts  successionInquiry.test.ts     # emptySuccessionForm(), handleSuccessionInquiry(): honeypot → timing → zod → gibberish → rate limit → Make.com `successioninquiry`

src/lib/landing/components/DemoVideoButton.svelte   # the designs' video button (.dcta-b): poster, video playing while in view, label and sub-label, arrow

src/lib/assets/landing/nachfolge/
└── technician.webp        # the first audience card (new)

src/lib/landing/pages/nachfolge/
├── content.ts  content.test.ts          # every text of the page, the example data of the mocks and tiles, the form's labels and messages, word for word; figures(now)
└── sections/
    ├── Hero.svelte*  Statement.svelte*  Rows.svelte*  Rotator.svelte*  Numbers.svelte*
    ├── Audience.svelte*  Quotes.svelte*  Picture.svelte*
    ├── Apply.svelte*                    # #kontakt: partner/Apply with SuccessionForm
    ├── SuccessionForm.svelte            # the fields in partner/FormFrame (superforms, works without JS)
    └── Faq.svelte*  Closing.svelte*  Trust.svelte*  FloatingCta.svelte*
```

`*` marks a thin wrapper around a shared section.

## Links

The design's links, by design id, and where they lead here. An element whose target has no page yet isn't rendered (a CTA) or is plain text, as on the other pages.

| Design id (use) | Here |
|---|---|
| `#kontakt` (the hero's "Kontakt aufnehmen", every row's and the first card's "Gespräch anfragen") | the form section |
| `#inhalt` (the hero's "Mehr erfahren") | the rows |
| `#faq` (every row's "Häufige Fragen") | the FAQ |
| `#start` (the design's hero) | none: the hero has no form, and this page has no signup form (as `/softwarepartner`) |
| `44SBXKXJaSp6bvGMnbpZj6` (the closing card's video button "Demo buchen", the trust block's "Demo buchen", the floating CTA "Erstgespräch vereinbaren") | `#kontakt`, the page's own form (open question 1); the shared header's nav CTA "Bestand prüfen" → `/messdienstwechsel` |
| `9dRgZ8Vw3ictqCvi3C7MAF` (the second card's "Zu den Partnerschaften") | none yet: not rendered (the card's `cta` without `href`), as `/neuigkeiten`'s story and the footer's "Partnerschaften" |
| `Sb54rDQd5WS2r82skPe7UQ` (FAQ 5's "Mehr zu Sicherheit", the trust block's "Mehr zu Sicherheit") | `ROUTE_SICHERHEIT` (the FAQ's `more`, `TrustSeals`) |
| `Jp8tqY82m7FZqMnWU4z9x9` (the banner) | `ROUTE_UPGRADE_NOW` through `DEFAULT_CHROME` |

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/nachfolge`, `ROUTE_NACHFOLGE` in `$lib/routes.ts`: the footer's label, lower-case, as `/softwarepartner` and `/verbaende`. Not confirmed (gate §4.4) |
| Route group | `(landing-page)`, outside `[[preview=preview]]` |
| Indexing | `seo.noindex = true` and out of the sitemap until the cutover; then indexed and in the sitemap (decision of 2026-10-17), so its gate (§4.4) blocks the cutover PR (#440) |
| Header | The shared `LandingHeader` with `DEFAULT_CHROME` (the design's banner is the same). The page has no signup form, so the nav CTA "Bestand prüfen" leads to `/messdienstwechsel`, as on the other partner pages |
| Template | The `uv` template (`UvMain`, `Hero` `lg`, `ListMock`, `Statement`, `Rows` with `Phone`, `Doc`, `Calendar`, `Bill`, `Rotator`, `Numbers`, `Audience`, `Quotes`, `Picture`, `Faq`), filled from `content.ts` like `/softwarepartner`. The template's addition (the icon `meter`) changes nothing on the other `uv` pages |
| The hero word | "Nachfolge" in `clamp(34px, 8.6vw, 130px)` (the design's `#ipf-css` rule, the same as the other partner pages'), through `Hero`'s `wordSize` |
| The hero's app window | `ListMock` with the design's four entries: "Kundenbeziehungen" (`users`, "In Vorbereitung" → "Übergeben"), "Geräte und Zähler" (`meter`, "Wird geprüft" → "Übernommen"), "Laufende Verträge" (`doc`, "Wird geprüft" → "Geklärt"), "Abrechnungen" (`check`, "Wird erstellt" → "Weitergeführt") |
| Row 1's phone | `uv/Phone` with its figure (the notification "Erstgespräch vereinbart", then "Ihr Ansprechpartner" / "Persönlich" with one chip), on the ink tile |
| Row 3's grid | `uv/Calendar` with nine cells "Liegensch. 1" … "Liegensch. 9" (the template's three columns), the seventh current: six "umgerüstet", "in Planung", two "offen"; the note "Liegensch. 7 in Planung" |
| The "1.1.2027" figure | Picked in `load` with `now` (`figures(now)`), as the segment pages' deadline figure: the design's "Ab dann müssen alle Zähler fernablesbar sein" until the deadline, then the shared placeholder `DEADLINE_FIGURE.expired` ("Seitdem …"; gate §4.4) |
| The form section | The shared `partner/Apply` and `partner/FormFrame` (`#ipf-css` is the same block on all three partner designs), with this page's fields, schema and action |
| The form | A SvelteKit form action with `sveltekit-superforms` + zod (`$lib/forms/successionInquiry.ts`), working without JS, posting to `#kontakt`. Fields as the design: Unternehmen, Ihr Name, E-Mail and the consent required; Telefon (checked only when given), Betreute Liegenschaften, Gewünschter Zeitraum (both selects optional, as the design's) and Nachricht optional. The design only shows a thank-you and sends nothing; here a valid inquiry goes to Make.com as the new event `successioninquiry` through `sendWebhookEventOrThrow`, like the other partner forms: nothing is stored in our database and nothing personal is logged. Spam pipeline as there (honeypot → timing `_t`, re-stamped on mount → zod → gibberish → rate limit, 3 per 10 min per IP with its own counter, 50 under `KITCHEN_SINK`); a bot gets the success answer. Errors after the first submit with the design's one line "Bitte füllen Sie die markierten Felder aus."; success "Danke, <Name>! Wir melden uns bei Ihnen."; a failed send keeps the values and shows `PHONE`. Open question 2 |
| Why a new event | The fields differ from the other partner forms (business size, time frame), and the inquiries go to someone else (the management, confidentially). One event per form keeps each Make.com route simple |
| No signup form | The design's three "Demo buchen" / "Erstgespräch vereinbaren" lead to the demo-booking design. This page is for owners of metering businesses, not for managers, and its own form is the "Erstgespräch" ("Ihr persönlicher Ansprechpartner meldet sich bei Ihnen."), so they lead to `#kontakt`: the closing card's video button, the trust block (`TrustSeals` `demoHref`) and the floating CTA (`FloatingCta` `href`; hidden while the closing card is on screen, `final`). Open question 1 |
| Closing card | The shared `CtaCard`, `tone="glass"`, `final`, the title and the text, with the new shared `DemoVideoButton` ("Demo buchen", "Mit Ihrem Ansprechpartner", the region demo video) as its `action` |
| The video button | Shared in `$lib/landing/components/` (the block is the same in every design that has it): the poster server-rendered, the video (`muted loop playsinline`, `preload="metadata"`) plays while at least 30 % of it is on screen and pauses off screen (`inView`), never under reduced motion; the hover growth and the "Live" badge in CSS. Only this page uses it today |
| Second audience card | "Mehr Partnerschaften?" with its text and photo; "Zu den Partnerschaften" (the "Partnerschaften" design, no page) isn't rendered, as `uv/Audience` does for a `cta` without `href` |
| Quotes | The shared testimonials `werne`, `vitolus`, `gerhard` (word for word the shared texts) under "Verlässlicher Messdienst." / "Unsere Kunden sagen es selbst." |
| FAQ | The `uv` FAQ (shared `Faq`, dark, all closed) with its FAQPage JSON-LD; FAQ 5's "Mehr zu Sicherheit" → `/sicherheit` |
| Figures | `Numbers` with "1:1", the photo, "15.000+", "DE", "1.1.2027" and "Diskret", all compact (the design's `.dt`); none counts |
| Styling | Component-scoped CSS from the design; breakpoints the design's (`#ipf-css` 900 px, the template's 980/620 px, `#hs-css` 1040/620 px, `#dcta-css` 640 px). No class that is also a Tailwind utility |

## Open questions (the default is built unless answered)

1. **The demo CTAs.** The design sends the closing card's "Demo buchen", the trust block's "Demo buchen" and the floating CTA "Erstgespräch vereinbaren" to the demo-booking design, which has no page. *Default: the page's own form (`#kontakt`), since the page's visitors are metering businesses, and the nav CTA to `/messdienstwechsel`.* Alternative: `/messdienstwechsel#start`, as on `/softwarepartner`, if those CTAs should stay with the managers.
2. **Where succession inquiries go.** The design's form sends nothing yet. *Default: Make.com `successioninquiry` with every field and `page`, for a route the business sets up (who reads them confidentially, who answers "Ihr persönlicher Ansprechpartner meldet sich bei Ihnen.").* Until the route exists, Make.com receives the events on the unified webhook like the others.
3. **The new photo.** The technician looks like a generated or staged scene. *Default: used as designed, `alt=""` (decorative).* A licence or a real photo before the cutover.

## Risks

- **Every gate is on the cutover's critical path** (04 §4.4–4.37).
- **A business offer in public.** "Heidi führt Kunden, Geräte und Verträge verlässlich weiter", "Heidi übernimmt bestehende Zähler und wertet sie aus", "Ob einzelne Kundenbeziehungen, die Verträge oder der ganze Betrieb" describe acquisitions; a competitor's owner reads them as an offer. Mitigation: management sign-off in §4.4, `noindex` until then.
- **Confidential inquiries.** Owners tell us they want to sell before their customers or staff know. Mitigation: nothing stored here, nothing personal logged (the log lines carry the business size only), the consent required (the design's text), the route's owner and its confidentiality in §4.4.
- **The deadline's date.** The page says "1.1.2027" and "bis 2027" where the other pages name 31.12.2026. Mitigation: legal check and the expired texts in §4.4; the figure already switches with `now`.

## Out of scope

- The design's nav, footer, chat button, `#top-js`, `#mobfx`, `#eb-js`, `#pillfx` beyond the eyebrows, `#fx-js` (the design footer's newsletter; ours is the shared footer), `#pg-common-css` / `#demo-css` beyond the blocks the template uses.
- Storing inquiries, the demo-booking page, the "Partnerschaften" page.
