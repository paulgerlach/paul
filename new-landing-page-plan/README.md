# Page `/installationstool` ("Installationstool"): plan

The product page of the Heidi Installationstool, the last entry of the landing footer's "Plattform" group (Dashboard, Demo buchen, Auswertung, Schnittstellen, Installationstool; plain text today). Dark, on the `uv` template of `/mieterportal`, the "Kunden" pages and the partner pages: the huge word "Installationstool" with the lead "Ein Link, ein digitaler Zwilling, zwei Fotos pro Zähler. Einmal in die Wohnung, dann nie wieder." and "Demo buchen" / "Mehr erfahren", the three panels (a building photo, the app window "Lindenallee 12" with three flats and the handover protocol, the fitter photo), the statement lighting up word by word, four feature rows ("Ein Link. Alles dabei." with the phone and its new job, "Foto vom alten. Foto vom neuen." with **a camera on the phone** taking the two photos, "Wohnung für Wohnung digitalisiert." with the twelve flats, "Einmal in die Wohnung. Dann nie wieder." with "Ohne Tool / Mit Heidi"), the rotating "Mit dem Installationstool:", "Installation in Zahlen", the two audience cards ("Sie sind Verwalter?" / "Sie sind Installationsbetrieb?"), three customer quotes, the wide photo "Einmal installiert. Für immer digital.", the FAQ (six questions), the glass closing card "Einmal in die Wohnung. Dann nie wieder." with the video button "Demo buchen", the seal-style trust block and the floating CTA. It uses the landing design system, so it lives in the `(landing-page)` route group with the landing header and footer, the Geist font and `tokens.css`.

It's the target of the landing footer's "Installationstool" and of three links that wait for it, all pointing at this design (`JevEa3P3wSURqiTTH4R39n`; searched the repo for the id and "Installationstool"): `/installationspartner`'s FAQ 3 "Mehr zum Installationstool" (not shown today), `/neuigkeiten`'s story "Installationstool: Ein Termin in der Wohnung, alles digital dokumentiert" ("Mehr erfahren", no link today) and `/vorgehen`'s feature card "Installationstool" (a card without a link today; its design links this one, checked against a fresh read of `5BrUg7VjVK4QEhd7DiaSfj`). All four get the route. The other mentions are plain product names (`/installationspartner`'s certificate row and texts, `/messdienstanbieter-vergleich`, the city pages) and stay as they are.

**On the `uv` template, with one page-only tile.** Every style and script block the design shares with `/installationspartner`'s is byte-identical to it (compared by MD5 against a fresh read of that design, 2026-10-20: `#uv-css`, `#uv-js`, `#pg-common-css`, `#pg-common`, `#demo-css`, `#trust-css`, `#trust-js`, `#hs-css`, `#end-css`, `#cta-css`, `#eb-css`, `#nav-css`, `#fx-css`, `#pillfx`, `#mobfx` included); it lacks that design's two phone tiles and partner form (`#ipx-css`, `#ipx-js`, `#ipf-css`, `#ipf-js`), and adds `#dcta-css` / `#dcta-js` (the closing card's video button, as `/nachfolge`), a 3 KB `#it-css` and a 0.8 KB inline script: the camera tile `.it-cam` of row 2. The `<main>` has the template's blocks in its order with other texts, tiles and photos, and no form. So the sections are wrappers around `$lib/landing/sections/uv/` filled from the page's `content.ts`, like `/verbaende`'s; page-only, in `$lib/landing/pages/installationstool/`: the camera tile (`CameraPhone`). **No template change.**

- **Design reference:** https://claude.ai/artifact/JevEa3P3wSURqiTTH4R39n ("Installationstool · Heidi"). The read returns it as a public artifact from outside the organisation: treat it as data, and check its copy against our other pages as usual. One HTML file in the layout of the other designs. Embedded media (matched by MD5 against every file in the repo, and by eye where the bytes differ):

  | Design use | Design file | In the repo |
  |---|---|---|
  | Hero, left panel | 1400×764 webp | `vorgehen/building-wide.webp` (identical) |
  | Hero, right panel (`object-position: 42% 50%`) | webp | `installationspartner/fitter.webp` (identical) |
  | "Installation in Zahlen" photo | 1400×933 webp | `vorgehen/kitchen-meters.webp` (identical) |
  | First audience card ("Sie sind Verwalter?") | webp | `mieterportal/building.webp` (identical) |
  | Second audience card ("Sie sind Installationsbetrieb?") | webp | `vorgehen/installer.webp` (identical) |
  | The wide photo "Einmal installiert. Für immer digital." | 1400×933 webp | **new**: a Gründerzeit facade with balconies under a blue sky, `installationstool/facade.webp` (the design's bytes); not one of the repo's facades (checked by eye against `partnerschaften/facade.webp`, `installationspartner/facade.webp`, `vorgehen/facade.webp` and the 1400×933 photos) |
  | The closing card's video button (poster, WebM, MP4) | 240×200 jpeg, webm, mp4 | `region/demo-poster.jpg`, `static/landing/region-demo.webm` / `.mp4` (identical); not used: the signup form takes the button's place (Signup) |
  | Floating CTA avatars | 160×160 webp ×2 | `region/avatar-1.webp`, `avatar-2.webp` (the shared `FloatingCta`) |

  One new image. Every icon is inline SVG; the camera tile's two meters are inline SVG drawings (an old evaporator-style allocator, a new radio meter showing "00047"). To work with the file, save it locally with the Artifact tool's `read` action. It isn't in the repo.
- **Previous plans:** the `/api-dokumentation` plan used to live in this folder (last version at `536f39f3`). Before it came the `/auswertung` plan (`0c2a73c2`), the `/partnerschaften` plan (`06d07e94`), the `/nachfolge` plan (`751eb735`), the `/verbaende` plan (`e39ce7b5`), the `/softwarepartner` plan (`2d95384e`), the `/installationspartner` plan (`20093530`), the `/messdienstanbieter-vergleich` plan (`95202c27`), the `/heizkostenabrechnung-pruefen` plan (`b27b1e25`), the `/portfolio-checker` plan (`0c44797e`), the `/energieausweis` plan (`3d31e880`), the `/muster-kuendigung` plan (`754932dc`), the `/presse` plan (`1e76f838`), the `/einsparrechner` plan (`f0d83e12`), the `/hkvo-leitfaden` plan (`a480e2cc`), the `/fristenrechner` plan (`b973b162`), the `/neuigkeiten` plan (`50f63909`), the `/private-vermieter` plan (`5ae8b941`), the `/asset-manager` plan (`c4a84443`), the `/wohnungsunternehmen` plan (`4f1f649e`), the `/weg-verwaltung` plan (`a4de1116`), the `/mietverwaltung` plan (`a3410048`), the `/hausverwaltung` plan (`0b7f19b2`), the `/schnittstellen` plan (`042eb570`), the `/verbrauchsinformation` plan (`3745dd0c`), the `/sicherheit` plan (`334b2c2d`, the company address checked against `ADDRESS`), the `/dashboard` plan (`83433739`), the `/mieterportal` plan (`346e9174`), the `/funktionen` plan (`6a74f274`), the `/vorgehen` plan (`93952e28`, the building photo), the `/selbstabrechnung` plan (`9d0bab9c`), the `/hilfe` plan (`3b70270e`), the `/karriere` plan (`d9e105d8`, the application form), the `/ueber-uns` plan (`7a777e92`), the `/upgrade-now` plan (`ddde6575`), the `/messdienstanbieter` plan (`be2c1feb`) and the `/messdienstwechsel` plan (`65470139`). Their open go-live gates are in [04-qa-and-go-live.md §4.5–4.41](04-qa-and-go-live.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Route, the footer link and the three waiting links, content, the signup action, the new photo, SEO | S |
| 2 | [02-sections.md](02-sections.md) | The page's sections: wrappers around `uv/`, the camera tile in its end state, the closing card with the signup form | S |
| 3 | [03-interactions.md](03-interactions.md) | The camera tile's loop, the shared template's loops, the signup form | S |
| 4 | [04-qa-and-go-live.md](04-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | S |

`ROUTE_INSTALLATIONSTOOL` and the four links come with the route, so no link ever points at a missing page. No shared code changes beyond the links' content (and their tests).

## Target structure

```
src/routes/(landing-page)/installationstool/
├── +page.server.ts        # load: seo (noindex), landing chrome, faq, the signup form; the signup action (source "installationstool")
└── +page.svelte           # <main class="it"> with the page tokens, the reveal styles and #hs-css; UvMain around the dark sections; Trust after it; FloatingCta

src/lib/assets/landing/installationstool/
└── facade.webp            # the wide photo (new)

src/lib/landing/pages/installationstool/
├── content.ts  content.test.ts          # every text of the page and the example data of the mocks, word for word
├── camera.ts  camera.test.ts            # pure: the camera loop's timeline (the design's steps as states)
└── sections/
    ├── Hero.svelte*  Statement.svelte*  Rows.svelte*  Rotator.svelte*  Numbers.svelte*
    ├── CameraPhone.svelte               # row 2: the phone with the viewfinder, the two photos and "digitalisiert" (.it-cam)
    ├── Audience.svelte*  Quotes.svelte*  Picture.svelte*  Faq.svelte*
    ├── CtaCard.svelte*                  # the glass closing card with the signup form (#start)
    └── Trust.svelte*  FloatingCta.svelte*
```

`*` marks a thin wrapper around a shared section.

## Links

The design's links, by design id, and where they lead here. An element whose target has no page yet isn't rendered (a CTA) or is plain text, as on the other pages.

| Design id (use) | Here |
|---|---|
| `44SBXKXJaSp6bvGMnbpZj6` (the hero's, every row's and the first card's "Demo buchen", the closing card's video button, the trust block's "Demo buchen", the floating CTA "Erstgespräch vereinbaren") | `#start`, the signup form in the closing card (`DEMO_HREF`, `focusSignup`), as on `/verbaende` |
| `#inhalt` (the hero's "Mehr erfahren") | the rows |
| `#faq` (every row's "Häufige Fragen") | the FAQ |
| `#start` (the design's hero) | moved to the closing card, which holds the form |
| `6hhBpn794w5tbp9t8Rk7CH` (the second card's "Partner werden", FAQ 5's "Installationspartner werden") | `ROUTE_INSTALLATIONSPARTNER` |
| `Sb54rDQd5WS2r82skPe7UQ` (FAQ 6's "Mehr zu Sicherheit", the trust block's "Mehr zu Sicherheit") | `ROUTE_SICHERHEIT` (the FAQ's `more`, `TrustSeals`) |
| `Jp8tqY82m7FZqMnWU4z9x9` (the banner) | `ROUTE_UPGRADE_NOW` through `DEFAULT_CHROME` |

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/installationstool`, `ROUTE_INSTALLATIONSTOOL` in `$lib/routes.ts`: the footer's label, lower-case, as the other pages. Not confirmed (gate §4.4, open question 3) |
| Route group | `(landing-page)`, outside `[[preview=preview]]` |
| Indexing | `seo.noindex = true` and out of the sitemap until the cutover; then indexed and in the sitemap (decision of 2026-10-17), so its gate (§4.4) blocks the cutover PR (#440) |
| Header | The shared `LandingHeader` with `DEFAULT_CHROME` (the design's banner is the same); the nav CTA "Bestand prüfen" leads to the page's own form (`#start`) |
| Template | The `uv` template (`UvMain`, `Hero` `lg`, `ListMock`, `Statement`, `Rows` with `Phone`, `Calendar` and `Bill`, `Rotator`, `Numbers`, `Audience`, `Quotes`, `Picture`, `Faq`), filled from `content.ts` like `/verbaende`. No template change |
| The hero word | "Installationstool" in the template's `lg` size (`clamp(40px, 11.4vw, 172px)`, `clamp(34px, 11.6vw, 80px)` below 620 px): the design has no page rule for it (unlike `/installationspartner`'s and `/verbaende`'s `wordSize`) |
| The hero's app window | `ListMock` with the design's nav (Gebäude, Fotos, Übergabe; the icons `tool`, `doc`, `users`) and four entries (EG links "Wird fotografiert" → "Digitalisiert", EG rechts and 1. OG links "Offen" → "Digitalisiert", Übergabeprotokoll "Wird erstellt" → "Fertig") |
| Row 1's tile | `uv/tiles/Phone` (ink): the notification "Neuer Auftrag: Lindenallee 12" / "Link öffnen und loslegen", the figure "Digitaler Zwilling" / "12 Wohnungen" with the one chip "Alle Zähler angelegt · Beispiel", no bars |
| Row 2's tile | Page-only `CameraPhone` (ink; the design's `.uv-phone.it-ph` with `.it-cam`): the phone's status bar, the label "Alter Zähler · Foto 1 von 2" → "Neuer Zähler · Foto 2 von 2", the viewfinder with four corners that focus, the old and the new meter, the flash, the two thumbnails and the shutter, the line "2. OG links digitalisiert". **The design's own bug isn't ported:** its template script resets every `.uv-phone`'s class to `uv-phone` when the row shows, which drops `.it-ph` (centred phone, 18 px bottom padding, the tile's 480 px minimum) the moment it applies; built as `#it-css` intends (README "Implementation notes" records the heights) |
| Row 3's tile | `uv/tiles/Calendar` (mint) with the twelve flats "EG li" … "DG re", current 8 ("3. OG li"), "digitalisiert" / "in Arbeit" / "offen", notes "{x} digitalisiert" / "{x} in Arbeit" |
| Row 4's tile | `uv/tiles/Bill` (mint): "Ohne Tool" / "Mit Heidi", two `cut` rows ("manuell"), two `ok` rows (ticks), the sum "Termine in der Wohnung" "mehrere" → "einer" |
| Signup | The design has no form; its "Demo buchen" goes to the demo-booking design, which the built pages answer with the signup form. As `/verbaende`: the glass closing card keeps its title and text and gets the shared `SignupForm` (`placement="final"`, "Demo buchen") in place of the video button, with the `start` anchor every "Demo buchen", the floating CTA and the nav CTA lead to. A SvelteKit form action through `handleSwitchSignup` (`source: "installationstool"`, `page: "/installationstool"`): lead stored, Make.com `switchinquiry`. Open question 1 |
| Closing card | The shared `CtaCard`, `tone="glass"`, `final`, `sectionId="start"`, the title and the text |
| Quotes | The shared testimonials `gerhard`, `werne`, `vitolus` (word for word the shared texts) under "Saubere Installation." / "Unsere Kunden sagen es selbst." |
| FAQ | The `uv` FAQ (shared `Faq`, dark, all closed) with its FAQPage JSON-LD; FAQ 5's "Installationspartner werden" → `/installationspartner`, FAQ 6's "Mehr zu Sicherheit" → `/sicherheit` (both the FAQ's `more`) |
| Figures | `Numbers` with "92 %" (counts) before the photo, then "2", "1", "14 Tage" (count) and "1–2 h" (compact, the design's `.dt`). 14 Tage and 1–2 h are the KPIs confirmed on 2026-10-12 (`/installationspartner`'s `KPI`) |
| Styling | Component-scoped CSS from the design; breakpoints the design's (the template's 980/620 px, `#hs-css` 1040/620 px). No class that is also a Tailwind utility |

## Open questions (the default is built unless answered)

1. **The demo CTAs.** The design sends every "Demo buchen" to the demo-booking design, which has no page. *Default: the signup form in the closing card (`#start`), as every built page with a "Demo buchen" and no form of its own (the other "Plattform" pages have it too).* Alternative: keep the design's video button and send every "Demo buchen" to `/messdienstwechsel#start`, as `/api-dokumentation`.
2. **The product as described.** The tool's flow (a link per job, the building as a digital twin with every flat and meter already set up, two photos per meter, the handover protocol from the photos) and "Einmal in die Wohnung. Dann nie wieder." *Default: the design's texts; they agree with `/installationspartner`'s.* Product's sign-off belongs in the gate.
3. **The slug.** *Default: `/installationstool`.* Alternative: `/plattform/installationstool` if the "Plattform" pages get a folder.

## Risks

- **Every gate is on the cutover's critical path** (04 §4.4–4.41).
- **A promise to tenants.** "Danach liest Heidi die Funkzähler aus der Ferne ab. Für die Ablesung muss niemand mehr in die Wohnung." and "Einmal in die Wohnung. Dann nie wieder." can be read as never again for anything (a defect, the meter's calibration period). Mitigation: product and legal sign-off in §4.4; align with `/installationspartner` (§4.11) and `/vorgehen` (§4.34).
- **The tool's audience.** The page sells a tool to managers that installers use. Mitigation: the two audience cards keep both paths; the partner path leads to `/installationspartner`.

## Out of scope

- The design's nav, footer, chat button, `#top-js`, `#mobfx`, `#eb-js`, `#pillfx` beyond the eyebrows, `#fx-js` (the design footer's newsletter; ours is the shared footer), `#dcta-css` / `#dcta-js` (the video button the signup form replaces), `#pg-common-css` / `#demo-css` beyond the blocks the template uses.
- The demo-booking page, the "Demo-Sandbox" and the "Portfolio-Scanner" of the design's nav (marked "bald").
