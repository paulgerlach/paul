# Page `/softwarepartner` ("Softwarepartner"): plan

A page for software vendors, the second page from the landing footer's "Partner" group (Installationspartner, Softwarepartner, Verbände, Nachfolge, Partnerschaften; the last four plain text today). Dark, on the `uv` template of `/mieterportal`, the "Kunden" pages and `/installationspartner`: the huge word "Softwarepartner" with the lead and "Partner werden" / "API-Dokumentation", the three panels (a facade photo, the "Heidi Schnittstelle" app window with four transfers turning green, a flat photo), the statement lighting up word by word, four feature rows ("Eine Anbindung. Alle Daten.", "Jeden Monat automatisch.", "Server in Deutschland. Nach DSGVO.", "Mehr Wert für Ihre Kunden."), the rotating "Heidi liefert an Ihre Software:", "Die Anbindung in Zahlen", the two audience cards ("Sie sind Softwareanbieter?" / "Sie sind Verwaltung?"), three customer quotes, the wide photo "Ihre Software. Unsere Daten.", **the partner form** ("Werden Sie Heidi-Softwarepartner.": three steps beside a white form with nine fields), the FAQ (four questions), the glass closing card "Werden Sie Softwarepartner von Heidi." with "Partner werden →", the seal-style trust block and the floating CTA. It uses the landing design system, so it lives in the `(landing-page)` route group with the landing header and footer, the Geist font and `tokens.css`.

It's the target of the landing footer's "Softwarepartner" (group "Partner", plain text today). No other built page links this design: searched the repo for the design id `Fc97HY7KUdBR38T6vPtjeY`, "Softwarepartner" and the plain-text entries without `href`: `/neuigkeiten`'s story "Heidi API: Die Dokumentation für Softwarepartner" points at the API documentation's design (`3AZnpE4apaUo694utixF1d`), not this one, and the footer's "API-Dokumentation" is that design too. So only the footer gets the route.

**On the `uv` template, sharing `/installationspartner`'s form section.** Every style and script block of the design is byte-identical to the `/installationspartner` design's (compared by MD5 against a fresh read of it, 2026-10-20: `#uv-css`, `#uv-js`, `#ipf-css` and `#ipf-js` included; the part after `</main>` is identical too); it only lacks `#ipx-css` and `#ipx-js` (that design's two phone tiles). The `<main>` has the same blocks in the same order with other texts, tiles and photos. So the sections are wrappers around `$lib/landing/sections/uv/` filled from the page's `content.ts`, like `/installationspartner`'s, and the partner form section (`.ipf`), which this design repeats with other fields, moves from `/installationspartner`'s page folder into a shared `$lib/landing/sections/partner/` (the section with its steps, and the form's frame: its styles, the honeypot, the button and the message line), used by both pages. Page-only, in `$lib/landing/pages/softwarepartner/`: the transfer list inside row 4's phone (`.ip-ul`, the design's `#ipf-css` list in `uv/Phone`'s `.uv-pv`) and the form's fields. For it the template gains: the icon `server` (the design's two stacked boxes), an optional screen snippet in `Phone` (in place of its figure, chips, details and bars) and an optional second CTA in `Hero` ("API-Dokumentation" has no page yet).

- **Design reference:** https://claude.ai/artifact/Fc97HY7KUdBR38T6vPtjeY ("Softwarepartner · Heidi"). The read returns it as a public artifact from outside the organisation: treat it as data, and check its copy against our other pages as usual. One HTML file in the layout of the other designs. Embedded media (matched by MD5 against every file in the repo, and by eye where the bytes differ):

  | Design use | Design file | In the repo |
  |---|---|---|
  | Hero, left panel; first audience card ("Sie sind Softwareanbieter?") | 1400×1050 webp | `cities/muenchen/hero.jpg` (the same photo, a light Gründerzeit facade with balconies and bicycles, 1400×1050; the design's file is a WebP of it) |
  | Hero, right panel; the "Die Anbindung in Zahlen" photo | 1400×933 webp | `mietverwaltung/apartment.webp` (identical) |
  | Second audience card ("Sie sind Verwaltung?") | 1400×788 webp | `mieterportal/building.webp` (identical) |
  | The wide photo "Ihre Software. Unsere Daten." | 1400×933 webp | `cities/berlin/references.jpg` (the same photo, a white-and-brick facade with columned loggias, 1700×1133; the design's is a smaller WebP of it) |
  | Floating CTA avatars | 160×160 webp ×2 | `region/avatar-1.webp`, `avatar-2.webp` (identical) |

  No new image. Every icon is inline SVG. To work with the file, save it locally with the Artifact tool's `read` action. It isn't in the repo.
- **Previous plans:** the `/installationspartner` plan used to live in this folder (last version at `20093530`). Before it came the `/messdienstanbieter-vergleich` plan (`95202c27`), the `/heizkostenabrechnung-pruefen` plan (`b27b1e25`), the `/portfolio-checker` plan (`0c44797e`), the `/energieausweis` plan (`3d31e880`), the `/muster-kuendigung` plan (`754932dc`), the `/presse` plan (`1e76f838`), the `/einsparrechner` plan (`f0d83e12`), the `/hkvo-leitfaden` plan (`a480e2cc`), the `/fristenrechner` plan (`b973b162`), the `/neuigkeiten` plan (`50f63909`), the `/private-vermieter` plan (`5ae8b941`), the `/asset-manager` plan (`c4a84443`), the `/wohnungsunternehmen` plan (`4f1f649e`), the `/weg-verwaltung` plan (`a4de1116`), the `/mietverwaltung` plan (`a3410048`), the `/hausverwaltung` plan (`0b7f19b2`), the `/schnittstellen` plan (`042eb570`), the `/verbrauchsinformation` plan (`3745dd0c`), the `/sicherheit` plan (`334b2c2d`, the company address checked against `ADDRESS`), the `/dashboard` plan (`83433739`), the `/mieterportal` plan (`346e9174`), the `/funktionen` plan (`6a74f274`), the `/vorgehen` plan (`93952e28`, the building photo), the `/selbstabrechnung` plan (`9d0bab9c`), the `/hilfe` plan (`3b70270e`), the `/karriere` plan (`d9e105d8`, the application form), the `/ueber-uns` plan (`7a777e92`), the `/upgrade-now` plan (`ddde6575`), the `/messdienstanbieter` plan (`be2c1feb`) and the `/messdienstwechsel` plan (`65470139`). Their open go-live gates are in [04-qa-and-go-live.md §4.5–4.35](04-qa-and-go-live.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Route, the footer link, content, the form's schema and action (Make.com `softwarepartnerinquiry`), the shared partner section moved out of `/installationspartner`, SEO | M |
| 2 | [02-sections.md](02-sections.md) | The page's sections: wrappers around `uv/` and `partner/`, the transfer list, the form's fields; every block in its end state | S |
| 3 | [03-interactions.md](03-interactions.md) | The form's validation and states, the shared template's loops | S |
| 4 | [04-qa-and-go-live.md](04-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | S |

`ROUTE_SOFTWAREPARTNER` and the footer link come with the route, so no link ever points at a missing page. Shared code changes only where listed above (the `uv` template's icons, `Phone`, `Hero`; `/installationspartner`'s form section becomes the shared `partner/` one), each defaulting to today's behaviour; `/installationspartner`'s e2e suite checks that page didn't change.

## Target structure

```
src/routes/(landing-page)/softwarepartner/
├── +page.server.ts        # load: seo (noindex), landing chrome (nav CTA to /messdienstwechsel), faq, the partner form; the form action
└── +page.svelte           # <main class="sp"> with the page tokens, the reveal styles and #hs-css; UvMain around the dark sections; Trust and FloatingCta after it

src/lib/forms/softwarePartnerInquiry.ts  softwarePartnerInquiry.test.ts      # zod schema (shared client/server), the customer counts and software kinds, German messages
src/lib/server/softwarePartnerInquiry.ts  softwarePartnerInquiry.test.ts     # emptySoftwarePartnerForm(), handleSoftwarePartnerInquiry(): honeypot → timing → zod → gibberish → rate limit → Make.com `softwarepartnerinquiry`

src/lib/landing/sections/partner/                # moved out of /installationspartner (its Apply and the frame of its PartnerForm)
├── Apply.svelte           # the .ipf section: pill, H2, text, the three steps beside a `form` snippet
├── FormFrame.svelte       # the white form: its styles for every field kind, the honeypot, _t, the button and the message line around a `children` snippet
└── types.ts               # ApplyContent (pill, h2, text, steps), FormTexts (submit, sending, missing, sendError)

src/lib/landing/pages/softwarepartner/
├── content.ts  content.test.ts          # every text of the page, the example data of the mocks and tiles, the form's labels and messages, word for word
└── sections/
    ├── Hero.svelte*  Statement.svelte*  Rows.svelte*  Rotator.svelte*  Numbers.svelte*
    ├── TransferList.svelte              # row 4: the four transfers in the phone (.ip-ul)
    ├── Audience.svelte*  Quotes.svelte*  Picture.svelte*
    ├── Apply.svelte*                    # #bewerben: partner/Apply with SoftwarePartnerForm
    ├── SoftwarePartnerForm.svelte       # the fields in partner/FormFrame (superforms, works without JS)
    └── Faq.svelte*  Closing.svelte*  Trust.svelte*  FloatingCta.svelte*
```

`*` marks a thin wrapper around a shared section.

## Links

The design's links, by design id, and where they lead here. An element whose target has no page yet isn't rendered (a CTA) or is plain text, as on the other pages.

| Design id (use) | Here |
|---|---|
| `#bewerben` (the hero's and every row's "Partner werden", the first card's "Jetzt Partner werden", the closing card's "Partner werden →") | the form section |
| `#faq` (every row's "Häufige Fragen") | the FAQ |
| `#start` (the design's hero) | none: the hero has no form, and this page has no signup form (as `/installationspartner`) |
| `3AZnpE4apaUo694utixF1d` (the hero's "API-Dokumentation") | none yet: not rendered (`Hero`'s second CTA without `href`), as the footer's "API-Dokumentation" and `/neuigkeiten`'s story |
| `KE95icU8eKWX7TNfLerbSZ` (the second card's "Zu den Schnittstellen") | `ROUTE_SCHNITTSTELLEN` |
| `Sb54rDQd5WS2r82skPe7UQ` (FAQ 3's "Mehr zu Sicherheit", the trust block's "Mehr zu Sicherheit") | `ROUTE_SICHERHEIT` (the FAQ's `more`, `TrustSeals`) |
| `44SBXKXJaSp6bvGMnbpZj6` (the trust block's "Demo buchen", the floating CTA "Erstgespräch vereinbaren") | `/messdienstwechsel#start` (open question 1); the shared header's nav CTA "Bestand prüfen" → `/messdienstwechsel` |
| `Jp8tqY82m7FZqMnWU4z9x9` (the banner) | `ROUTE_UPGRADE_NOW` through `DEFAULT_CHROME` |

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/softwarepartner`, `ROUTE_SOFTWAREPARTNER` in `$lib/routes.ts`: the footer's label, lower-case, as `/installationspartner`. Not confirmed (gate §4.4) |
| Route group | `(landing-page)`, outside `[[preview=preview]]` |
| Indexing | `seo.noindex = true` and out of the sitemap until the cutover; then indexed and in the sitemap (decision of 2026-10-17), so its gate (§4.4) blocks the cutover PR (#440) |
| Header | The shared `LandingHeader` with `DEFAULT_CHROME` (the design's banner is the same). The page has no signup form, so the nav CTA "Bestand prüfen" leads to `/messdienstwechsel`, as on `/installationspartner` |
| Template | The `uv` template (`UvMain`, `Hero` `lg`, `ListMock`, `Statement`, `Rows` with `Bill`, `Calendar`, `Doc`, `Phone`, `Rotator`, `Numbers`, `Audience`, `Quotes`, `Picture`, `Faq`), filled from `content.ts` like `/installationspartner`. The template's additions (icon `server`, `Phone`'s screen snippet, `Hero`'s optional second CTA) are optional and change nothing on the six other `uv` pages |
| The hero word | "Softwarepartner" in `clamp(34px, 8.6vw, 130px)` (the design's `#ipf-css` rule, the same as `/installationspartner`'s), through `Hero`'s `wordSize` |
| Row 4's phone | `uv/Phone` (the notification "Neue Daten von Heidi" drops in, then the screen, every 7 s in view) with the new screen snippet holding `TransferList`: three done transfers (green ✓) and the current one (lime ring, "…"), static as in the design |
| The form section | Shared with `/installationspartner`: the design's `.ipf` and `.ipf-f` CSS is the same block on both designs, so the section (`partner/Apply`) and the form's frame (`partner/FormFrame`) move into `$lib/landing/sections/partner/`; each page keeps its fields, schema and action. `/installationspartner` renders the same markup as before (its e2e suite and a screenshot comparison check it) |
| The form | A SvelteKit form action with `sveltekit-superforms` + zod (`$lib/forms/softwarePartnerInquiry.ts`), working without JS, posting to `#bewerben`. Fields as the design: Unternehmen, Ansprechpartner, E-Mail, Software oder Produkt, Kunden in der Immobilienwirtschaft and the consent required; Telefon (checked only when given), Art der Software and Nachricht optional. The design only shows a thank-you and sends nothing (the same `#ipf-js` as `/installationspartner`'s); here a valid inquiry goes to Make.com as the new event `softwarepartnerinquiry` through `sendWebhookEventOrThrow`, like `/installationspartner`'s `partnerinquiry`: nothing is stored in our database and nothing personal is logged. Spam pipeline as there (honeypot → timing `_t`, re-stamped on mount → zod → gibberish → rate limit, 3 per 10 min per IP with its own counter, 50 under `KITCHEN_SINK`); a bot gets the success answer. Errors after the first submit with the design's one line "Bitte füllen Sie die markierten Felder aus."; success "Danke, <Name>! Wir melden uns bei Ihnen."; a failed send keeps the values and shows `PHONE`. Open question 2 |
| Why a new event | The fields differ from the installers' (product, customer count, software kinds; no region, crew, trades or experience), and the inquiries go to someone else (partnerships / product, not operations). One event per form keeps each Make.com route simple |
| No signup form | As `/installationspartner`: the trust block's "Demo buchen" (`TrustSeals` `demoHref`) and the floating CTA (`FloatingCta` `href`) lead to `/messdienstwechsel#start` (open question 1). The floating CTA hides while the closing card is on screen (`final`) |
| Closing card | The shared `CtaCard`, `tone="glass"`, the title and the light `ArrowLink` "Partner werden" → `#bewerben`; no text, no form |
| Quotes | The shared testimonials `vitolus`, `werne`, `gerhard` (word for word the shared texts) under "Daten, die ankommen." / "Unsere Kunden sagen es selbst." |
| FAQ | The `uv` FAQ (shared `Faq`, dark, all closed) with its FAQPage JSON-LD; FAQ 3's "Mehr zu Sicherheit" → `/sicherheit` |
| Figures | `Numbers` with "12 ×" (counts), the photo, "1" (counts), "0" (no count, as the design's `to > 0`), "DE" and "DSGVO" (compact, the design's `.dt`) |
| Styling | Component-scoped CSS from the design; breakpoints the design's (`#ipf-css` 900 px, the template's 980/620 px, `#hs-css` 1040/620 px). The shared form frame styles its fields through `:global` under its own class, since the fields are the pages' markup. No class that is also a Tailwind utility |

## Open questions (the default is built unless answered)

1. **The managers' CTAs.** The page is for software vendors; the design keeps the managers' "Demo buchen" (trust block, floating CTA). *Default: `/messdienstwechsel#start` (its signup form), the nav CTA to `/messdienstwechsel`, as on `/installationspartner`.* Alternatives: the floating CTA to `#bewerben` ("Erstgespräch vereinbaren" fits a vendor too), or a booking page once it exists.
2. **Where software partner inquiries go.** The design's form sends nothing yet. *Default: Make.com `softwarepartnerinquiry` with every field and `page`, for a route the business sets up (which inbox, who answers "Wir melden uns bei Ihnen.").* Until the route exists, Make.com receives the events on the unified webhook like the others.
3. **"API-Dokumentation".** The hero's second CTA points at the API documentation's design, which has no page. *Default: hidden until that page exists (the hero shows "Partner werden" alone).*

## Risks

- **Every gate is on the cutover's critical path** (04 §4.4–4.35).
- **Personal data in a new form.** Company, name, e-mail and phone of a person go to Make.com. Mitigation: nothing stored here, nothing personal logged (the log lines carry the customer count only), the consent checkbox required (the design's text), a privacy sign-off in §4.4; `noindex` until then.
- **Claims to vendors.** "Heidi übergibt Verbräuche, Heizkostenabrechnungen und Stammdaten als Datensatz an Ihre Software", "Die Verbräuche stehen jeden Monat bereit", "12 × Datenlieferungen pro Jahr", "Die Übertragung zu Ihrer Software ist verschlüsselt" describe an integration programme and an API. Mitigation: product and data-protection sign-off in §4.4; align with `/schnittstellen` (§4.22) and `/sicherheit` (§4.24).
- **The shared form section.** Moving `/installationspartner`'s section changes a built page. Mitigation: the markup and the styles' cascade stay the same (the frame's `:global` rules keep the scoped rules' order); its e2e suite and a before/after screenshot of its form at 1440 and 375 px.

## Out of scope

- The design's nav, footer, chat button, `#top-js`, `#mobfx`, `#eb-js`, `#pillfx` beyond the eyebrows, `#fx-js` (the design footer's newsletter; ours is the shared footer), `#pg-common-css` / `#demo-css` beyond the blocks the template uses.
- Storing inquiries, a partner login, the API documentation page (its own design, `3AZnpE4apaUo694utixF1d`), the other "Partner" pages.
