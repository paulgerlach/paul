# Page `/installationspartner` ("Installationspartner"): plan

A page for installation companies, the first page from the landing footer's "Partner" group (Installationspartner, Softwarepartner, Verbände, Nachfolge, Partnerschaften; all plain text today). Dark, on the `uv` template of `/mieterportal` and the "Kunden" pages: the huge word "Installationspartner" with the lead and "Partner werden" / "Mehr erfahren", the three panels (a facade photo, the "Heidi Installationstool" app window with four entries turning green, a fitter photo), the statement lighting up word by word, five feature rows ("Geschult. Zertifiziert.", "Jede Wohnung. Auf dem Handy.", "Alter Zähler raus. Neuer rein. Mit Foto.", "Noch zwei Wohnungen. Dann klingelt es.", "Ordnungsgemäß übergeben."), the rotating "Heidi übernimmt für Ihr Team:", "Installation in Zahlen", the two audience cards ("Sie sind Installationsbetrieb?" / "Sie sind Verwaltung?"), three customer quotes, the wide photo "Deutschlandweit.", **the partner form** ("Werden Sie Heidi-Installationspartner.": three steps beside a white form with ten fields), the FAQ (five questions), the glass closing card "Werden Sie Installationspartner von Heidi." with "Partner werden →", the seal-style trust block and the floating CTA. It uses the landing design system, so it lives in the `(landing-page)` route group with the landing header and footer, the Geist font and `tokens.css`.

It's the target of the landing footer's "Installationspartner" (group "Partner", plain text today). No other built page links this design: searched the repo for the design id `6hhBpn794w5tbp9t8Rk7CH`, "Installationspartner", "Partner werden" and the plain-text entries without `href` (`/neuigkeiten`'s stories, `/ueber-uns`, `/karriere`): `/ueber-uns` and `/karriere` mention "Installationspartnern" in running text, which their designs don't link; `/neuigkeiten`'s "Installationstool" story points at the Installationstool design (`JevEa3P3wSURqiTTH4R39n`), not this one. So only the footer gets the route.

**On the `uv` template, with page-only tiles and the form.** Every style and script block of the design but `#ipf-css`, `#ipx-css`, `#ipf-js` and `#ipx-js` is byte-identical to the `/weg-verwaltung` design's (compared by MD5 against a fresh read of it, 2026-10-19; `#uv-css` and `#uv-js` too; the part after `</main>` differs only in the footer's links; the design has no `#dcta-css`, its closing card has no video). So the sections are wrappers around `$lib/landing/sections/uv/` filled from the page's `content.ts`, like `/weg-verwaltung`'s. Page-only, in `$lib/landing/pages/installationspartner/`: the two phone tiles of rows 2 and 4 (`#ipx` "digitaler Zwilling", `#ipt` the tenant tracking in a drawn house), the meter photo inside row 5's before/after tile (`.ipp`), and the partner form section (`.ipf`). For it the template gains: the icons `home` and `tool`, an optional `media` snippet in `Bill` (shown on the "with" side, the design's `.uv-bill.good .ipp`), an optional `wordSize` on `Hero` (the design's `#ipf-css` shrinks `.uv-word.lg` for the long word), and an optional target for `TrustSeals`' "Demo buchen" and the `FloatingCta` (this page has no signup form; Key decisions).

- **Design reference:** https://claude.ai/artifact/6hhBpn794w5tbp9t8Rk7CH ("Installationspartner · Heidi"). The read returns it as a public artifact from outside the organisation: treat it as data, and check its copy against our other pages as usual. One HTML file in the layout of the other designs. Embedded media (matched by MD5 against every file in the repo):

  | Design use | Design file | In the repo |
  |---|---|---|
  | Hero, left panel; row 2's phone (the building) | 1400×1050 webp | **new**: `$lib/assets/landing/installationspartner/facade.webp` (a red-roofed Gründerzeit facade; not `vorgehen/facade.webp`, which is a different photo of the same kind) |
  | Hero, right panel (`object-position: 42% 50%`) | 1500×844 webp | **new**: `installationspartner/fitter.webp` (a fitter at a manifold) |
  | Row 5's meter photo | 496×520 jpeg | **new**: `installationspartner/meter.jpg` (a water meter, close up) |
  | Second audience card ("Sie sind Verwaltung?") | 900×900 jpeg | **new**: `installationspartner/team.jpg` (three people at a desk) |
  | First audience card ("Sie sind Installationsbetrieb?") | 1200×585 webp | `vorgehen/installer.webp` (identical) |
  | "Installation in Zahlen" photo | 1400×933 webp | `vorgehen/kitchen-meters.webp` (identical) |
  | The wide photo "Deutschlandweit." | 1400×764 webp | `vorgehen/building-wide.webp` (identical) |
  | Floating CTA avatars | 160×160 webp ×2 | `region/avatar-1.webp`, `avatar-2.webp` (identical) |

  Every icon is inline SVG. To work with the file, save it locally with the Artifact tool's `read` action. It isn't in the repo.
- **Previous plans:** the `/messdienstanbieter-vergleich` plan used to live in this folder (last version at `95202c27`). Before it came the `/heizkostenabrechnung-pruefen` plan (`b27b1e25`), the `/portfolio-checker` plan (`0c44797e`), the `/energieausweis` plan (`3d31e880`), the `/muster-kuendigung` plan (`754932dc`), the `/presse` plan (`1e76f838`), the `/einsparrechner` plan (`f0d83e12`), the `/hkvo-leitfaden` plan (`a480e2cc`), the `/fristenrechner` plan (`b973b162`), the `/neuigkeiten` plan (`50f63909`), the `/private-vermieter` plan (`5ae8b941`), the `/asset-manager` plan (`c4a84443`), the `/wohnungsunternehmen` plan (`4f1f649e`), the `/weg-verwaltung` plan (`a4de1116`), the `/mietverwaltung` plan (`a3410048`), the `/hausverwaltung` plan (`0b7f19b2`), the `/schnittstellen` plan (`042eb570`), the `/verbrauchsinformation` plan (`3745dd0c`), the `/sicherheit` plan (`334b2c2d`, the company address checked against `ADDRESS`), the `/dashboard` plan (`83433739`), the `/mieterportal` plan (`346e9174`), the `/funktionen` plan (`6a74f274`), the `/vorgehen` plan (`93952e28`, the building photo), the `/selbstabrechnung` plan (`9d0bab9c`), the `/hilfe` plan (`3b70270e`), the `/karriere` plan (`d9e105d8`, the application form this page's form follows), the `/ueber-uns` plan (`7a777e92`), the `/upgrade-now` plan (`ddde6575`), the `/messdienstanbieter` plan (`be2c1feb`) and the `/messdienstwechsel` plan (`65470139`). Their open go-live gates are in [04-qa-and-go-live.md §4.5–4.34](04-qa-and-go-live.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Route, the footer link, content, the form's schema and action (Make.com `partnerinquiry`), the tracking scene as pure code, the four photos, SEO | M |
| 2 | [02-sections.md](02-sections.md) | The page's sections: wrappers around `uv/`, the two phone tiles, the meter photo, the form section; every block in its end state | M |
| 3 | [03-interactions.md](03-interactions.md) | The phone tiles' loops, the meter photo's flash, the form's validation and states, the shared template's loops | S |
| 4 | [04-qa-and-go-live.md](04-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | S |

`ROUTE_INSTALLATIONSPARTNER` and the footer link come with the route, so no link ever points at a missing page. Shared code changes only where listed above (the `uv` template's icons, `Bill`, `Hero`; `TrustSeals` and `FloatingCta` get an optional target), each defaulting to today's behaviour.

## Target structure

```
src/routes/(landing-page)/installationspartner/
├── +page.server.ts        # load: seo (noindex), landing chrome (nav CTA to /messdienstwechsel), faq, the partner form; the form action
└── +page.svelte           # <main class="ip"> with the page tokens, the reveal styles and #hs-css; UvMain around the dark sections; Trust and FloatingCta after it

src/lib/forms/partnerInquiry.ts  partnerInquiry.test.ts      # zod schema (shared client/server), the crew sizes, trades and experience options, German messages
src/lib/server/partnerInquiry.ts  partnerInquiry.test.ts     # emptyPartnerForm(), handlePartnerInquiry(): honeypot → timing → zod → gibberish → rate limit → Make.com `partnerinquiry`

src/lib/assets/landing/installationspartner/  facade.webp  fitter.webp  meter.jpg  team.jpg

src/lib/landing/pages/installationspartner/
├── content.ts  content.test.ts          # every text of the page, the example data of the mocks and tiles, the form's labels and messages, word for word
├── tracking.ts  tracking.test.ts        # pure: the tracking scene's steps (the design's #ipx-js "Tracking im Haus")
└── sections/
    ├── Hero.svelte*  Statement.svelte*  Rows.svelte*  Rotator.svelte*  Numbers.svelte*
    ├── TwinPhone.svelte                 # row 2: the building screen, then the flat list (#ipx)
    ├── TrackingPhone.svelte             # row 4: the push, the drawn house, the progress card (#ipt)
    ├── MeterPhoto.svelte                # row 5: the photo in the before/after tile (.ipp)
    ├── Audience.svelte*  Quotes.svelte*  Picture.svelte*
    ├── Apply.svelte                     # #bewerben: the steps and the form (.ipf)
    ├── PartnerForm.svelte               # the form (superforms, works without JS)
    └── Faq.svelte*  Closing.svelte*  Trust.svelte*  FloatingCta.svelte*
```

`*` marks a thin wrapper around a shared section.

## Links

The design's links, by design id, and where they lead here. An element whose target has no page yet isn't rendered (a CTA) or is plain text, as on the other pages.

| Design id (use) | Here |
|---|---|
| `#bewerben` (the hero's and every row's "Partner werden", the first card's "Jetzt Partner werden", the closing card's "Partner werden →") | the form section |
| `#inhalt` ("Mehr erfahren") | the rows (`uv/Rows`) |
| `#faq` (every row's "Häufige Fragen") | the FAQ |
| `#start` (the design's hero) | none: the hero has no form, and this page has no signup form (see Key decisions) |
| `5BrUg7VjVK4QEhd7DiaSfj` (the second card's "So gehen wir vor") | `ROUTE_VORGEHEN` |
| `JevEa3P3wSURqiTTH4R39n` (FAQ 3's "Mehr zum Installationstool") | none yet: a `more` link without `href` (not rendered), as `/neuigkeiten`'s story |
| `44SBXKXJaSp6bvGMnbpZj6` (the trust block's "Demo buchen", the floating CTA "Erstgespräch vereinbaren") | `/messdienstwechsel#start` (open question 1); the shared header's nav CTA "Bestand prüfen" → `/messdienstwechsel` |
| `Jp8tqY82m7FZqMnWU4z9x9` (the banner) | `ROUTE_UPGRADE_NOW` through `DEFAULT_CHROME` |
| `Sb54rDQd5WS2r82skPe7UQ` (the trust block's "Mehr zu Sicherheit") | `ROUTE_SICHERHEIT` (`TrustSeals`) |

## Implementation notes (2026-10-20)

Phases 1–4 are built: the plan (`4068dd3a`), the route, content, the form's schema and action, the pure `tracking.ts`, the photos, the template's additions and the footer link (`8f478aec`), the sections with their interactions and the form (`d654af2f`), and `e2e/installationspartner.e2e.ts` (17 tests). Compared with the design section by section at 1440, 1100, 980, 700, 375 and 320 px (dev server, reduced motion, after scrolling through both pages): every section has the design's height to the pixel at every width, the five tiles' screenshots at 1440, 980 and 375 px match the design's, and the hero and the form match by eye (the form also with its marks after an empty submit). (The trust block measured 3–5 px short now and then on this page and on `/weg-verwaltung` alike, and matched on a rerun: a timing effect of the measurement, not a difference.) No overflow at 320 and 375 px; no console errors or hydration warnings. Full suites: check, lint, 741 unit tests, 475 e2e tests passed. Open: the manual checks of §4.1 not ticked there, and the gate §4.4. Deviations from the plan and the design:

- **Phases 2 and 3 are one commit:** the loops, the form's states and the meter photo are part of their sections.
- **`components/PhoneFrame.svelte`:** the white phone and its status bar, shared by the two phone tiles (the design repeats the frame's CSS for `.ipx` and `.ipt`).
- **The form's browser defaults:** Tailwind's preflight zeroes the legend's padding, the checkbox's margins and sets `small` to 80 %; the form sets the browser's values back (`padding: 0 2px`, `3px 3px 3px 4px`, `smaller`), so the consent wraps where the design's does. As in the design, "(optional)" is a row of its own under "Nachricht" (the label is a grid).
- **Invalid fields:** the red border beats the focus colour (the design's `!important`); the consent box, whose border the browser doesn't draw, gets a red outline so its mark is visible. Superforms focuses the first invalid field after a submit (the design focuses nothing).
- **Local Postgres:** none was running; a throwaway `postgres:18-alpine` on 127.0.0.1:54322 with the roles `anon`, `authenticated` and `service_role` before `drizzle-kit push`, stopped afterwards.

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/installationspartner`, `ROUTE_INSTALLATIONSPARTNER` in `$lib/routes.ts`: the footer's label, lower-case, no umlauts. Not confirmed (gate §4.4) |
| Route group | `(landing-page)`, outside `[[preview=preview]]` |
| Indexing | `seo.noindex = true` and out of the sitemap until the cutover; then indexed and in the sitemap (decision of 2026-10-17), so its gate (§4.4) blocks the cutover PR (#440) |
| Header | The shared `LandingHeader` with `DEFAULT_CHROME` (the design's banner is the same). The page has no signup form, so the nav CTA "Bestand prüfen" leads to `/messdienstwechsel`, as on `/karriere` and `/hilfe` |
| Template | The `uv` template (`UvMain`, `Hero` `lg`, `ListMock`, `Statement`, `Rows` with `Doc`, `Calendar`, `Bill`, `Rotator`, `Numbers`, `Audience`, `Quotes`, `Picture`, `Faq`), filled from `content.ts` like `/weg-verwaltung`. The template's additions (icons `home` and `tool`, `Bill`'s `media`, `Hero`'s `wordSize`) are optional and change nothing on the five other `uv` pages |
| The hero word | "Installationspartner" in `clamp(34px, 8.6vw, 130px)` (the design's `#ipf-css` rule, which wins over `uv-css` at every width), through `Hero`'s `wordSize` |
| The phone tiles | Page-only components with the design's markup and CSS (`#ipx-css`), hidden from screen readers like every tile. Server-rendered in the design's reduced-motion state (row 2: the flat list; row 4: WE 05 done, the fitter at WE 06, "2 Wohnungen vor Ihnen", the push shown); with motion they loop through `loopInView` (threshold .3) while in view: row 2 every 10.5 s, row 4 every 12.5 s. Row 4's steps are data in the pure `tracking.ts` |
| The meter photo | `MeterPhoto` in `Bill`'s new `media` snippet, which gets the tile's side: on "Mit Heidi" (the server's state) it opens with the photo, the shutter flash, the frame and the tick line, as the design's `.uv-bill.good .ipp` |
| The form | A SvelteKit form action with `sveltekit-superforms` + zod (`$lib/forms/partnerInquiry.ts`), working without JS, posting to `#bewerben`. The design only shows a thank-you and sends nothing ("Die Online-Übermittlung schalten wir gerade frei …"); here a valid inquiry goes to Make.com as the new event `partnerinquiry` through `sendWebhookEventOrThrow`, like `/karriere`'s applications: nothing is stored in our database and nothing personal is logged. Spam pipeline as the contact form (honeypot → timing `_t`, re-stamped on mount → zod → gibberish → rate limit, 3 per 10 min per IP, 50 under `KITCHEN_SINK`); a bot gets the success answer. Errors show after the first submit, as the design: the invalid fields get the red border (`.bad`, `aria-invalid`) and the message line says "Bitte füllen Sie die markierten Felder aus." (`role="alert"`). Success: "Danke, <Name>! Wir melden uns bei Ihnen." in the green line (`role="status"`), the form resets. A failed send keeps the values and shows the phone number (`PHONE`, `+49 30 52001352`, the number the design names). Open question 2 |
| No signup form | The design has no manager signup: its "Demo buchen" links (the trust block, the floating CTA, the design's nav) lead to the booking page. Here they lead to `/messdienstwechsel#start` (open question 1), through a new optional target on `TrustSeals` (`demoHref`) and `FloatingCta` (`href`). The floating CTA hides while the closing card is on screen (`final`) |
| Closing card | The shared `CtaCard`, `tone="glass"` (the design's `#end-css`), the title and the light `ArrowLink` "Partner werden" → `#bewerben`; no text, no form |
| Quotes | The shared testimonials `werne`, `vitolus`, `gerhard` (word for word the shared texts) under "Saubere Installation." / "Unsere Kunden sagen es selbst." |
| FAQ | The `uv` FAQ (shared `Faq`, dark, all closed) with its FAQPage JSON-LD; FAQ 3's "Mehr zum Installationstool" waits for its page (`more` without `href`) |
| Figures | `Numbers` with "14 Tage" (counts), the photo, "1–2 h", "92 %" (counts), "2" (counts), "0 Klemmbretter" (no count, as the design's `to > 0`). 14 Tage and 1–2 h are the KPIs confirmed on 2026-10-12, as `KPI` on the other `uv` pages |
| Styling | Component-scoped CSS from the design; breakpoints the design's (`#ipf-css` 900 px, `#ipx-css` 640 px, the template's 980/620 px, `#hs-css` 1040/620 px). No class that is also a Tailwind utility (the design's `.ipf-ok` label becomes `.consent`, `.ipp-ok` → `.done`; `.ok`/`.err` on the message line are fine) |

## Open questions (the default is built unless answered)

1. **The managers' CTAs.** The page is for installers; the design keeps the managers' "Demo buchen" (trust block, floating CTA), which on every other page lead to that page's signup form. *Default: `/messdienstwechsel#start` (its signup form); the nav CTA to `/messdienstwechsel`, as on `/karriere`.* Alternatives: the floating CTA to `#bewerben` ("Erstgespräch vereinbaren" fits an installer too), or a booking page once it exists (`DEMO_HREF`).
2. **Where partner inquiries go.** The design's form sends nothing yet. *Default: Make.com `partnerinquiry` with every field and `page`, for a route the business sets up (which inbox, who answers "Wir melden uns bei Ihnen.").* Until the route exists, Make.com receives the events on the unified webhook like the others.
3. **The phone number** in the design's thank-you ("Bis dahin erreichen Sie uns direkt unter +49 30 52001352."). *Default: shown only when sending fails, as `PHONE` from the site header (the Impressum's number).*

## Risks

- **Every gate is on the cutover's critical path** (04 §4.4–4.34).
- **Personal data in a new form.** Company, name, e-mail, phone and region of a person go to Make.com. Mitigation: nothing stored here, nothing personal logged (the log lines carry the crew size only), the consent checkbox required (the design's text), a privacy sign-off in §4.4; `noindex` until then.
- **Claims to installers.** "Wir schulen Ihr Team", "stellen das Installationstool", "planen die Einsätze in Ihrer Region", "zertifiziert", "eigene Flotte" describe a partner programme. Mitigation: product and operations sign-off in §4.4.

## Out of scope

- The design's nav, footer, chat button, `#top-js`, `#mobfx`, `#eb-js`, `#pillfx` beyond the eyebrows, `#fx-js` (the design footer's newsletter; ours is the shared footer), `#pg-common-css` / `#demo-css` beyond the blocks the template uses.
- Storing inquiries, a partner login, the Installationstool page (its own design, `JevEa3P3wSURqiTTH4R39n`), the other "Partner" pages.
