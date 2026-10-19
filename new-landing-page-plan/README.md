# Page `/verbaende` ("Verbände"): plan

A page about Heidi's association memberships, the third page from the landing footer's "Partner" group (Installationspartner, Softwarepartner, Verbände, Nachfolge, Partnerschaften; the last two plain text today). Dark, on the `uv` template of `/mieterportal`, the "Kunden" pages and the two partner pages: the huge word "Verbände" with the lead "Heidi ist Kooperationspartner des VDIV und in den Verbänden DEUMESS und bved vernetzt." and "Demo buchen" / "Mehr erfahren", the three panels (a facade photo, the app window "Gut vernetzt." with the three associations and data protection, a trade-fair photo), the statement lighting up word by word, four feature rows (VDIV, DEUMESS and bved, each with the association's logo on a white card, and "Sicher nach DSGVO." with the data-processing document), the rotating "Heidi ist vernetzt mit:", "Heidi auf einen Blick", the two audience cards ("Sie sind ein Verband?" / "Sie sind Verwaltung?"), three customer quotes, the wide photo "Gut vernetzt. Sicher aufgestellt.", the FAQ (five questions), the glass closing card "Ein verlässlicher Partner für Ihren Messdienst." with the video button "Demo buchen", the seal-style trust block and the floating CTA. It uses the landing design system, so it lives in the `(landing-page)` route group with the landing header and footer, the Geist font and `tokens.css`.

It's the target of the landing footer's "Verbände" (group "Partner", plain text today). No other built page links this design: searched the repo for the design id `MepMnY7x3BPBVcsTh8nH8U`, "Verbände", "VDIV", "DEUMESS", "bved" and the plain-text entries without `href`: `/presse`'s fact "VDIV · DEUMESS · bved", the shared `Trust`, `TrustCards` and `TrustSeals` name the associations as plain text, as their designs do. So only the footer gets the route.

**On the `uv` template, with one page-only tile.** Every style and script block the design shares with `/softwarepartner`'s is byte-identical to it (compared by MD5 against a fresh read of that design, 2026-10-20: `#uv-css`, `#uv-js`, `#pg-common-css`, `#demo-css`, `#trust-css`, `#hs-css`, `#end-css`, `#cta-css`, `#eb-css` included; the part after `</main>` is identical too); it lacks that design's partner form (`#ipf-css`, `#ipf-js`) and adds `#dcta-css` / `#dcta-js` (the closing card's video button, as the "Ressourcen" designs) and a 530-byte `#vb-css`: the logo card `.vb-lg` (and the hero word's `lg` size, the template's own). The `<main>` has the template's blocks in its order with other texts, tiles and photos, and no form. So the sections are wrappers around `$lib/landing/sections/uv/` filled from the page's `content.ts`, like `/weg-verwaltung`'s; page-only, in `$lib/landing/pages/verbaende/`: the logo tile of rows 1–3 (`LogoTile`). For it the template gains the icon `check` (the design's tick in the hero's list).

- **Design reference:** https://claude.ai/artifact/MepMnY7x3BPBVcsTh8nH8U ("Verbände · Heidi"). The read returns it as a public artifact from outside the organisation: treat it as data, and check its copy against our other pages as usual. One HTML file in the layout of the other designs. Embedded media (matched by MD5 against every file in the repo, and by eye where the bytes differ):

  | Design use | Design file | In the repo |
  |---|---|---|
  | Hero, left panel | 1400×1050 webp | `vorgehen/facade.webp` (identical) |
  | Hero, right panel | 1681×936 webp | **new**: a trade-fair booth ("Digitaler Messdienstanbieter", two conversations, meters on a counter), `verbaende/booth.webp` (the design's bytes) |
  | Row 1's logo | 299×128 webp | `partners/vdiv.webp` (identical) |
  | Row 2's logo | 538×128 webp | `partners/deumess.webp` (identical) |
  | Row 3's logo | 233×128 webp | `partners/bved.webp` (identical) |
  | "Heidi auf einen Blick" photo | 1400×933 webp | `vorgehen/kitchen-meters.webp` (identical) |
  | First audience card ("Sie sind ein Verband?") | 1681×936 webp | **new**: an association's conference (a banner "Verband für die Wohnungswirtschaft", a panel on stage), `verbaende/conference.webp` (the design's bytes) |
  | Second audience card ("Sie sind Verwaltung?") | 1400×788 webp | `mieterportal/building.webp` (identical) |
  | The wide photo "Gut vernetzt. Sicher aufgestellt." | 1400×764 webp | `vorgehen/building-wide.webp` (identical) |
  | The closing card's video button (poster, WebM, MP4) | 240×200 jpeg, webm, mp4 | `region/demo-poster.jpg`, `static/landing/region-demo.webm` / `.mp4` (identical); not used: the signup form takes the button's place (Signup) |
  | Floating CTA avatars | 160×160 webp ×2 | `region/avatar-1.webp`, `avatar-2.webp` (identical) |

  Two new images. Every icon is inline SVG. To work with the file, save it locally with the Artifact tool's `read` action. It isn't in the repo.
- **Previous plans:** the `/softwarepartner` plan used to live in this folder (last version at `2d95384e`). Before it came the `/installationspartner` plan (`20093530`), the `/messdienstanbieter-vergleich` plan (`95202c27`), the `/heizkostenabrechnung-pruefen` plan (`b27b1e25`), the `/portfolio-checker` plan (`0c44797e`), the `/energieausweis` plan (`3d31e880`), the `/muster-kuendigung` plan (`754932dc`), the `/presse` plan (`1e76f838`), the `/einsparrechner` plan (`f0d83e12`), the `/hkvo-leitfaden` plan (`a480e2cc`), the `/fristenrechner` plan (`b973b162`), the `/neuigkeiten` plan (`50f63909`), the `/private-vermieter` plan (`5ae8b941`), the `/asset-manager` plan (`c4a84443`), the `/wohnungsunternehmen` plan (`4f1f649e`), the `/weg-verwaltung` plan (`a4de1116`), the `/mietverwaltung` plan (`a3410048`), the `/hausverwaltung` plan (`0b7f19b2`), the `/schnittstellen` plan (`042eb570`), the `/verbrauchsinformation` plan (`3745dd0c`), the `/sicherheit` plan (`334b2c2d`, the company address checked against `ADDRESS`), the `/dashboard` plan (`83433739`), the `/mieterportal` plan (`346e9174`), the `/funktionen` plan (`6a74f274`), the `/vorgehen` plan (`93952e28`, the building photo), the `/selbstabrechnung` plan (`9d0bab9c`), the `/hilfe` plan (`3b70270e`), the `/karriere` plan (`d9e105d8`, the application form), the `/ueber-uns` plan (`7a777e92`), the `/upgrade-now` plan (`ddde6575`), the `/messdienstanbieter` plan (`be2c1feb`) and the `/messdienstwechsel` plan (`65470139`). Their open go-live gates are in [04-qa-and-go-live.md §4.5–4.36](04-qa-and-go-live.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Route, the footer link, content, the signup action, the two new photos, SEO | S |
| 2 | [02-sections.md](02-sections.md) | The page's sections: wrappers around `uv/`, the logo tile, the closing card with the signup form; every block in its end state | S |
| 3 | [03-interactions.md](03-interactions.md) | The logo cards' entrance, the shared template's loops, the signup form | S |
| 4 | [04-qa-and-go-live.md](04-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | S |

`ROUTE_VERBAENDE` and the footer link come with the route, so no link ever points at a missing page. Shared code changes only where listed above (the `uv` template's icons), defaulting to today's behaviour.

## Target structure

```
src/routes/(landing-page)/verbaende/
├── +page.server.ts        # load: seo (noindex), landing chrome, faq, the signup form; the signup action (source "verbaende")
└── +page.svelte           # <main class="vb"> with the page tokens, the reveal styles and #hs-css; UvMain around the dark sections; Trust after it; FloatingCta

src/lib/assets/landing/verbaende/
├── booth.webp             # the hero's right panel (new)
└── conference.webp        # the first audience card (new)

src/lib/landing/pages/verbaende/
├── content.ts  content.test.ts          # every text of the page and the example data of the mocks, word for word
└── sections/
    ├── Hero.svelte*  Statement.svelte*  Rows.svelte*  Rotator.svelte*  Numbers.svelte*
    ├── LogoTile.svelte                  # rows 1–3: the association's logo on a white card with its line (.vb-lg)
    ├── Audience.svelte*  Quotes.svelte*  Picture.svelte*  Faq.svelte*
    ├── CtaCard.svelte*                  # the glass closing card with the signup form (#start)
    └── Trust.svelte*  FloatingCta.svelte*
```

`*` marks a thin wrapper around a shared section.

## Links

The design's links, by design id, and where they lead here. An element whose target has no page yet isn't rendered (a CTA) or is plain text, as on the other pages.

| Design id (use) | Here |
|---|---|
| `44SBXKXJaSp6bvGMnbpZj6` (the hero's, every row's and the second card's "Demo buchen", the closing card's video button, the trust block's "Demo buchen", the floating CTA "Erstgespräch vereinbaren") | `#start`, the signup form in the closing card (`DEMO_HREF`, `focusSignup`), as on `/weg-verwaltung` |
| `#inhalt` (the hero's "Mehr erfahren") | the rows |
| `#faq` (every row's "Häufige Fragen") | the FAQ |
| `#start` (the design's hero) | moved to the closing card, which holds the form |
| `2HKfqpmyVhcXiJWmoomtHP` (the first card's "Zur Presseseite") | `ROUTE_PRESSE` |
| `Sb54rDQd5WS2r82skPe7UQ` (FAQ 5's "Mehr zu Sicherheit", the trust block's "Mehr zu Sicherheit") | `ROUTE_SICHERHEIT` (the FAQ's `more`, `TrustSeals`) |
| `Jp8tqY82m7FZqMnWU4z9x9` (the banner) | `ROUTE_UPGRADE_NOW` through `DEFAULT_CHROME` |

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/verbaende`, `ROUTE_VERBAENDE` in `$lib/routes.ts`: the footer's label, lower-case, the umlaut written out (CLAUDE.md: no umlauts in names), as `/muster-kuendigung`. Not confirmed (gate §4.4) |
| Route group | `(landing-page)`, outside `[[preview=preview]]` |
| Indexing | `seo.noindex = true` and out of the sitemap until the cutover; then indexed and in the sitemap (decision of 2026-10-17), so its gate (§4.4) blocks the cutover PR (#440) |
| Header | The shared `LandingHeader` with `DEFAULT_CHROME` (the design's banner is the same); the nav CTA "Bestand prüfen" leads to the page's own form (`#start`) |
| Template | The `uv` template (`UvMain`, `Hero` `lg`, `ListMock`, `Statement`, `Rows` with `Doc`, `Rotator`, `Numbers`, `Audience`, `Quotes`, `Picture`, `Faq`), filled from `content.ts` like `/weg-verwaltung`. The template's addition (the icon `check`) changes nothing on the other `uv` pages |
| The hero word | "Verbände" in the template's `lg` size (`#vb-css` repeats the template's `clamp(40px, 11.4vw, 172px)`), no `wordSize` |
| The hero's app window | `ListMock` with the design's four entries (VDIV, DEUMESS, bved, Datenschutz). Their statuses are the same before and after ("Partner", "Vernetzt", "Vernetzt", "Konform"): the design's loop only turns the pills from amber to green, and so does `ListMock` |
| Rows 1–3's tile | Page-only `LogoTile` (the design's `.vb-lg`): the logo (`partners/*.webp`, the same files `TrustCards` shows) on a white card with the line under it, on the stone tile. Server-rendered shown; it rises in once when its row comes into view (`enterView`) |
| Row 4's tile | `uv/tiles/Doc` with three check rows and the result "DSGVO-konform" |
| Signup | The design has no form; its "Demo buchen" goes to the demo-booking design, which the built pages answer with the signup form. As `/weg-verwaltung`: the glass closing card keeps its title and text and gets the shared `SignupForm` (`placement="final"`, "Demo buchen") in place of the video button, with the `start` anchor every "Demo buchen", the floating CTA and the nav CTA lead to. A SvelteKit form action through `handleSwitchSignup` (`source: "verbaende"`, `page: "/verbaende"`): lead stored, Make.com `switchinquiry`. Open question 1 |
| Closing card | The shared `CtaCard`, `tone="glass"`, `final`, `sectionId="start"`, the title and the text |
| Quotes | The shared testimonials `werne`, `vitolus`, `gerhard` (word for word the shared texts) under "Verlässlich." / "Unsere Kunden sagen es selbst." |
| FAQ | The `uv` FAQ (shared `Faq`, dark, all closed) with its FAQPage JSON-LD; FAQ 5's "Mehr zu Sicherheit" → `/sicherheit` |
| Figures | `Numbers` with "3" (counts), the photo, "Bund", "DE", "DSGVO" and "Berlin" (compact, the design's `.dt`) |
| Styling | Component-scoped CSS from the design; breakpoints the design's (the template's 980/620 px, `#hs-css` 1040/620 px). No class that is also a Tailwind utility |

## Open questions (the default is built unless answered)

1. **The demo CTAs.** The design sends every "Demo buchen" to the demo-booking design, which has no page. *Default: the signup form in the closing card (`#start`), as every built page with a "Demo buchen" and no form of its own.* Alternative: `/messdienstwechsel#start`, as the partner pages, if associations shouldn't land in the managers' lead list.
2. **The association descriptions and logos.** "Kooperationspartner Bund" (VDIV), "Verband unabhängiger Messdienstleister" (DEUMESS), "Bundesverband für Energie- und Wasserdatenmanagement" (bved) and the three logos. *Default: the design's texts (they match `TrustCards` and `/presse`) and the repo's logo files.* Each association's own wording and its permission to show the logo on a page about it belong in the gate.
3. **The two new photos.** The booth and the conference look like generated or staged scenes (the conference's banner names a "Verband für die Wohnungswirtschaft", which isn't one of the three). *Default: used as designed, `alt=""` (decorative).* A licence or a real photo of Heidi at a VDIV event before the cutover.

## Risks

- **Every gate is on the cutover's critical path** (04 §4.4–4.36).
- **Claims about third parties.** "Kooperationspartner des VDIV auf Bundesebene", "vernetzt in DEUMESS und bved" and the descriptions of three real associations, with their logos. Mitigation: the membership status confirmed in writing, each association's description and logo use approved (gate §4.4); align with `/presse` (§4.12), `/ueber-uns` (§4.33) and the trust blocks (§4.35).
- **The new photos imply an event.** A booth with Heidi's claims and an association conference read as documentary. Mitigation: licence and sign-off in §4.4, or real photos.

## Out of scope

- The design's nav, footer, chat button, `#top-js`, `#mobfx`, `#eb-js`, `#pillfx` beyond the eyebrows, `#fx-js` (the design footer's newsletter; ours is the shared footer), `#dcta-css` / `#dcta-js` (the video button the signup form replaces), `#pg-common-css` / `#demo-css` beyond the blocks the template uses.
- The demo-booking page, the "Nachfolge" and "Partnerschaften" pages.
