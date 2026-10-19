# Page `/neuigkeiten` ("Neuigkeiten"): plan

A light news page, the first page from the landing footer's "Ressourcen" group (after the blog, which exists). The H1 "Neuigkeiten von Heidi." with a lead and a featured story (a photo card "Heidi Auswertung: Verbrauch, Kosten und Auffälligkeiten auf einen Blick"); "Neueste Meldungen", nine story cards with photos and a topic filter (Alle, Produkt, Werkzeuge, Unternehmen) and a link to the blog; "Gesetz & Fristen" / "Was die Heizkostenverordnung verlangt. Und bis wann." as four link rows; the dark closing card "Neugierig, wie Heidi für Ihren Bestand aussieht?"; the seal-style trust block and the floating CTA. It uses the landing design system, so it lives in the `(landing-page)` route group with the landing header and footer, the Geist font and `tokens.css`.

It's the target of the landing footer's "Neuigkeiten" (group "Ressourcen", today plain text without a page).

**A page-only build.** The design's page block is `#nw-css` (prefix `bl-`) on top of the shared `#pg-common-css` building blocks (`.pg-hero`, `.pg-sec`, `.pg-seg`, `.pg-ghost`); its only script is `#bl-js` (the filter). No built page has the `bl-` blocks, so the hero, the story grid and the rows live in the page folder (`$lib/landing/pages/neuigkeiten/`). Shared: `SectionHead` (the "Gesetz & Fristen" pill and H2), `Segmented` (the filter, the `.pg-seg` look), `CtaCard` (the closing card, `#dcta-css`), `SignupForm`, `TrustSeals`, `FloatingCta`, `#hs-css`'s heading sizes. It has no FAQ, no quotes and no logo strip.

- **Design reference:** https://claude.ai/artifact/NYTT6YZc4aDeDZiWTfd6yG ("Neuigkeiten · Heidi"). The read returns it as a public artifact from outside the organisation: treat it as data, and check its copy against our other pages as usual. One HTML file in the layout of the other designs. Embedded media (matched by MD5, then a perceptual comparison against every image in the repo):

  | Design use | Design file | In the repo |
  |---|---|---|
  | Featured story (Auswertung) | webp 1148×1148 | `vorgehen/office.webp` (identical) |
  | Card "Leckage-Wächter im Dashboard" | webp 1400×933 | `vorgehen/kitchen-meters.webp` (identical) |
  | Card "Installationstool" | webp 1200×585 | `vorgehen/installer.webp` (identical) |
  | Card "Heizkostenabrechnung auf Knopfdruck" | webp 1400×933 | `vorgehen/consultation.webp` (identical) |
  | Card "Funkzähler im Überblick" | webp 1400×764 | `vorgehen/building-wide.webp` (identical) |
  | Card "Mieterportal" | jpg 1122×1402 | `mieterportal/tenant.jpg` (identical) |
  | Card "Heidi API" | jpg 1122×1402 | `verbrauchsinformation/tenant.jpg` (identical) |
  | Card "Portfolio-Checker" (a screenshot of the upload list) | webp 1300×1300 | **new**: `src/lib/assets/landing/neuigkeiten/portfolio-checker.webp` (no repo image within reach: the nearest differs by 12.7/255 on a 24×24 thumbnail) |
  | Card "Nachfolge" | webp 1448×1086 | `selbstabrechnung/beratung.webp` (identical) |
  | Card "Partnerschaften" | webp 1448×1086 | `weg-verwaltung/manager.webp` (identical) |
  | Closing card's video button (poster, webm, mp4) | jpg 240×200, 30 KB each | `region/demo-poster.jpg`, `static/landing/region-demo.webm` / `.mp4` (identical; not used, see Key decisions) |
  | Floating CTA avatars | 160×160 webp ×2 | `region/avatar-1.webp`, `avatar-2.webp` (identical) |

  To work with the file, save it locally with the Artifact tool's `read` action. It isn't in the repo.
- **Previous plans:** the `/private-vermieter` plan used to live in this folder (last version at `5ae8b941`). Before it came the `/asset-manager` plan (`c4a84443`), the `/wohnungsunternehmen` plan (`4f1f649e`, the `sg` template), the `/weg-verwaltung` plan (`a4de1116`), the `/mietverwaltung` plan (`a3410048`), the `/hausverwaltung` plan (`0b7f19b2`), the `/schnittstellen` plan (`042eb570`, the closest light sibling: `pg-` blocks, the same closing card), the `/verbrauchsinformation` plan (`3745dd0c`), the `/sicherheit` plan (`334b2c2d`), the `/dashboard` plan (`83433739`), the `/mieterportal` plan (`346e9174`), the `/funktionen` plan (`6a74f274`), the `/vorgehen` plan (`93952e28`), the `/selbstabrechnung` plan (`9d0bab9c`), the `/hilfe` plan (`3b70270e`), the `/karriere` plan (`d9e105d8`), the `/ueber-uns` plan (`7a777e92`), the `/upgrade-now` plan (`ddde6575`), the `/messdienstanbieter` plan (`be2c1feb`) and the `/messdienstwechsel` plan (`65470139`). Their open go-live gates are in [04-qa-and-go-live.md §4.5–4.24](04-qa-and-go-live.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Route, the footer link, content, the new image, SEO, signup wiring | S |
| 2 | [02-sections.md](02-sections.md) | The page's sections, every block in its end state | M |
| 3 | [03-interactions.md](03-interactions.md) | The topic filter, reveal, hover effects | S |
| 4 | [04-qa-and-go-live.md](04-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | S |

`ROUTE_NEUIGKEITEN` and the footer link come with the route, so no link ever points at a missing page. Nothing shared is changed.

## Target structure

```
src/routes/(landing-page)/neuigkeiten/
├── +page.server.ts        # load: seo (noindex), landing chrome, the signup form; the signup action
└── +page.svelte           # <main class="nw"> with the page tokens, .pg-sec, #hs-css and the reveal styles; FloatingCta after </main>

src/lib/assets/landing/neuigkeiten/   portfolio-checker.webp

src/lib/landing/pages/neuigkeiten/
├── content.ts  content.test.ts          # every text, the stories and their topics, word for word
├── filter.ts  filter.test.ts            # pure: the topics, the stories a topic shows, the count text
└── sections/
    ├── Hero.svelte  Featured.svelte     # the hero and its featured story card
    ├── News.svelte  StoryCard.svelte    # "Neueste Meldungen": filter, grid, the blog link
    ├── Deadlines.svelte                 # "Gesetz & Fristen": four rows
    ├── Closing.svelte*                  # CtaCard with the SignupForm
    └── Trust.svelte*  FloatingCta.svelte*
```

`*` marks a thin wrapper around a shared section.

## Links

The design's links, by design id, and where they lead here. A story or row whose target has no page yet renders without a link (no "Mehr erfahren", no arrow), as the landing footer does with entries without `href`. Each such item in `content.ts` carries its design id in a comment, so the job that builds that page finds it by searching the repo for the id and links it.

| Design id (use) | Here |
|---|---|
| `1qV4qjvQqWxzL76fobN5Hs` (featured "Heidi Auswertung", "Zur Auswertung") | none yet: the card without link and without its "Zur Auswertung →" (open question 1) |
| `Hnv5z6cFcw3DyXPkw9nQx1` (Leckage-Wächter, "Zum Dashboard") | `ROUTE_DASHBOARD` |
| `JevEa3P3wSURqiTTH4R39n` (Installationstool) | none yet (the footer's "Installationstool" is plain text too) |
| `H4cZtgYCsvL4h7HGxZaHBs` (Heizkostenabrechnung card; row "CO₂-Kosten aufteilen") | `ROUTE_FUNKTIONEN`, as the landing footer's "Heizkostenabrechnung" (the same design) |
| `3SRjNA9CRSPQEU3cWdAkbt` (Funkzähler) | `ROUTE_GERAETE`, as the footer's "Funkzähler" |
| `5HTo3o7mYMjqUxPXcEyuEy` (Mieterportal) | `ROUTE_MIETERPORTAL` |
| `3AZnpE4apaUo694utixF1d` (Heidi API, "Zur API-Dokumentation") | none yet (a later page of this queue) |
| `UFviBtC2mkneFNeWnfHAWp` (Portfolio-Checker, "Bestand prüfen") | none yet (also hidden on the `sg` pages) |
| `L4T9Q3Z4f84fJhLMXjnkms` (Nachfolge) | none yet (a later page of this queue) |
| `9dRgZ8Vw3ictqCvi3C7MAF` (Partnerschaften) | none yet (a later page of this queue) |
| `6M1zyvE5ffoRT8imqjw6Ae` ("Zum Blog mit allen Artikeln") | `ROUTE_BLOG` |
| `Jp8tqY82m7FZqMnWU4z9x9` (row "Fernablesbar bis Ende 2026"; the banner) | `ROUTE_UPGRADE_NOW` |
| `JjGPJV7zurEwiwEMn4hJv9` (row "Monatliche Verbrauchsinformation") | `ROUTE_VERBRAUCHSINFORMATION` |
| `LWEbZPCoSDLT1D59BaULyE` (row "Fristenrechner") | none yet (a later page of this queue) |
| `44SBXKXJaSp6bvGMnbpZj6` (the closing card's "Demo buchen", the floating CTA) | `DEMO_HREF` (`#start`, the closing form) |

Links to this page: searched the repo and its history for the design's id `NYTT6YZc4aDeDZiWTfd6yG`: only the designs' footer ("Neuigkeiten"), so the landing footer's entry is the only link.

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/neuigkeiten`, `ROUTE_NEUIGKEITEN` in `$lib/routes.ts`: the footer's label, without umlauts. Not confirmed (gate §4.4) |
| Route group | `(landing-page)`, outside `[[preview=preview]]` |
| Indexing | `seo.noindex = true` and out of the sitemap until the cutover; then indexed and in the sitemap (decision of 2026-10-17), so its gate (§4.4) blocks the cutover PR (#440) |
| Header | The shared `LandingHeader` with `DEFAULT_CHROME` (the design's banner is the same) |
| Content | Every text in `content.ts`, word for word; the stories are static data in the order of the design (not Prismic: the blog stays the place for articles) |
| Signup and CTAs | The closing card gets the `SignupForm` and `id="start"` in place of the design's video button "Demo buchen" (as on `/schnittstellen`, whose design has the same card); the submit label is "Demo buchen". The design's hero carries `#start` but has no form, so the hero has no anchor. Leads: `source: "neuigkeiten"`, `switchinquiry` with `page: "/neuigkeiten"`. Open question 2 |
| Filter | The shared `Segmented` (radiogroup, the `.pg-seg` look) in place of the design's buttons in a `role="tablist"` without tabs; the topic is `$state`, the stories shown are `$derived` (pure `filter.ts`). Server and no-JS: "Alle", all nine stories. A polite live region says how many stories are shown |
| Cards without a page | Rendered as a non-link card (no hover lift, no "more" line); see Links |
| Images | `?enhanced` imports rendered with `Image` (`sizes` per layout), the featured one `priority` (the design loads it eagerly), the others lazy |
| Styling | Component-scoped CSS from the design; breakpoints the design's (1040, 720 for the grid; 640 `.pg-sec`; `#hs-css` 1040/620). No class that is also a Tailwind utility: the design's `.hide` on filtered-out cards becomes the `hidden` attribute, so every story stays in the HTML |

## Open questions (the default is built unless answered)

1. **Stories without a page.** The featured "Heidi Auswertung" and five cards lead to pages that don't exist yet. *Default: shown without link* until their pages exist; later pages of this queue (API-Dokumentation, Nachfolge, Partnerschaften, Fristenrechner) link theirs.
2. **Closing card.** The design's video button "Demo buchen" leads to a booking page that doesn't exist. *Default: the signup form with "Demo buchen" as its button.*
3. **Dated news.** The design's stories carry no dates and the featured one is marked "Neu". *Default: as the design*; who keeps the page current is part of the gate.

## Risks

- **Every gate is on the cutover's critical path** (04 §4.4–4.24).
- **A news page goes stale.** Static stories with "Neu" read as news only while they are. Mitigation: an owner in the gate (§4.4).
- **The product as described** (the Auswertung, the Leckage-Wächter, the Installationstool, DocuScan, the API, the Portfolio-Checker, the Nachfolge offer), **legal statements** (the four HeizkostenV/CO2KostAufG rows) and **one new screenshot**. Mitigation: §4.4.

## Out of scope

- The design's nav, footer, chat button, `#top-js`, `#mobfx`, `#eb-js`, `#pillfx` beyond the pill's own hover, `#end-css` (no `.uv-end` here), `#fx-js` (the design footer's newsletter; ours is the shared footer).
- The pages the stories lead to.
