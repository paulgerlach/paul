# Page `/hkvo-leitfaden` ("HKVO-Leitfaden"): plan

A light guide page, the third page from the landing footer's "Ressourcen" group (after the blog, `/neuigkeiten` and `/fristenrechner`). The H1 "Die Heizkostenverordnung. Einfach erklärt." with a lead, two CTAs and three ticks, next to the "Schnell-Check" card: five yes/no questions (§ 4, § 5, § 6a, § 7, § 556 BGB) with a score ring "N/5" and a result below them (a hint, the open questions, the possible risks with a link, or "Alles erfüllt" with confetti); the guide itself, nine numbered articles (scope, metering duty, remote readability, cost split, allocable costs, monthly consumption information, mandatory billing details, CO₂ split, penalties) next to a sticky table of contents that marks the article being read and fills a progress bar; "Wann Mieter kürzen dürfen." with three cards (15 %, 3 %, 3 %); the FAQ (five questions); the dark closing card "HKVO-konform. Ohne Mehraufwand."; the seal-style trust block and the floating CTA. It uses the landing design system, so it lives in the `(landing-page)` route group with the landing header and footer, the Geist font and `tokens.css`.

It's the target of the landing footer's "HKVO-Leitfaden" (group "Ressourcen", today plain text without a page) and of `/vorgehen`'s "Zum HKVO-Leitfaden →" (the `RemoteDuty` block; `HKVO_GUIDE_HREF` is `undefined` today, so the link isn't rendered). Both point at this design (`SJbSeTYRqntQxpZQ8RVNf7`) in their designs.

**A page-only build.** The design's page block is `#lf-css` (prefix `lf-`) on top of the shared `#pg-common-css` building blocks (`.pg-hero`, `.pg-grid`, `.pg-ctas`, `.pg-ticks`, `.pg-sec`, `.pg-head`, `.pg-ghost`, `.xfq`); its only script is `#lf-js` (the check and the table of contents). No built page has the `lf-` blocks, so the hero with the check, the guide and the penalty cards live in the page folder (`$lib/landing/pages/hkvo-leitfaden/`). Shared: `SectionHead` (the penalty block's pill and H2), the `Faq` (default variant, the `.xfq` look, as `/fristenrechner` wraps it), `CtaCard` (the closing card, `#dcta-css`), `SignupForm`, `TrustSeals`, `FloatingCta`, `#hs-css`'s heading sizes, `confettiFrom` (`sg/confetti.ts`, the design's `PG.confetti`). The hero's layout and CTAs are `/fristenrechner`'s (the same `pg-` blocks), copied into the page folder as that page did. It has no quotes, no logo strip and no date logic.

- **Design reference:** https://claude.ai/artifact/SJbSeTYRqntQxpZQ8RVNf7 ("HKVO-Leitfaden · Heidi"). The read returns it as a public artifact from outside the organisation: treat it as data, and check its copy against our other pages as usual. One HTML file in the layout of the other designs. Embedded media (matched by MD5 against every file in the repo):

  | Design use | Design file | In the repo |
  |---|---|---|
  | Closing card's video button (poster, webm, mp4) | jpg 240×200, 30 KB each | `region/demo-poster.jpg`, `static/landing/region-demo.webm` / `.mp4` (identical; not used, see Key decisions) |
  | Floating CTA avatars | 160×160 webp ×2 | `region/avatar-1.webp`, `avatar-2.webp` (identical) |

  No photo and no new file: everything else is CSS and inline SVG. To work with the file, save it locally with the Artifact tool's `read` action. It isn't in the repo.
- **Previous plans:** the `/fristenrechner` plan used to live in this folder (last version at `b973b162`). Before it came the `/neuigkeiten` plan (`50f63909`), the `/private-vermieter` plan (`5ae8b941`), the `/asset-manager` plan (`c4a84443`), the `/wohnungsunternehmen` plan (`4f1f649e`, the `sg` template and `confettiFrom`), the `/weg-verwaltung` plan (`a4de1116`), the `/mietverwaltung` plan (`a3410048`), the `/hausverwaltung` plan (`0b7f19b2`), the `/schnittstellen` plan (`042eb570`), the `/verbrauchsinformation` plan (`3745dd0c`), the `/sicherheit` plan (`334b2c2d`), the `/dashboard` plan (`83433739`), the `/mieterportal` plan (`346e9174`), the `/funktionen` plan (`6a74f274`), the `/vorgehen` plan (`93952e28`, the "Zum HKVO-Leitfaden" link), the `/selbstabrechnung` plan (`9d0bab9c`), the `/hilfe` plan (`3b70270e`), the `/karriere` plan (`d9e105d8`), the `/ueber-uns` plan (`7a777e92`), the `/upgrade-now` plan (`ddde6575`), the `/messdienstanbieter` plan (`be2c1feb`) and the `/messdienstwechsel` plan (`65470139`). Their open go-live gates are in [04-qa-and-go-live.md §4.5–4.26](04-qa-and-go-live.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Route, the links to the page, content, the pure check and table-of-contents math, SEO, signup wiring | S |
| 2 | [02-sections.md](02-sections.md) | The page's sections, every block in its end state | M |
| 3 | [03-interactions.md](03-interactions.md) | The check (answers, ring, result, confetti), the table of contents (active article, progress), reveal, hover effects | S |
| 4 | [04-qa-and-go-live.md](04-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | S |

`ROUTE_HKVO_LEITFADEN` and every link to it come with the route, so no link ever points at a missing page. Shared code changes only where other pages link here (`/vorgehen`'s content module and the footer).

## Target structure

```
src/routes/(landing-page)/hkvo-leitfaden/
├── +page.server.ts        # load: seo (noindex), landing chrome, the signup form; the signup action
└── +page.svelte           # <main class="lf"> with the page tokens, .pg-sec, #hs-css and the reveal styles; FloatingCta after </main>

src/lib/landing/pages/hkvo-leitfaden/
├── content.ts  content.test.ts          # every text, the five questions, the nine articles, the three penalties, the FAQ, word for word
├── check.ts  check.test.ts              # pure: the check's score and result for a set of answers
├── toc.ts  toc.test.ts                  # pure: the active article and the reading progress from box positions
└── sections/
    ├── Hero.svelte                      # pill, H1, lead, CTAs, ticks + Check
    ├── Check.svelte                     # "Schnell-Check": ring, five questions, result
    ├── Guide.svelte                     # #leitfaden: the table of contents + the nine articles
    ├── Penalties.svelte                 # #kuerzung: "Wann Mieter kürzen dürfen." + three cards
    ├── Faq.svelte*  Closing.svelte*
    └── Trust.svelte*  FloatingCta.svelte*
```

`*` marks a thin wrapper around a shared section.

## Links

The design's links, by design id, and where they lead here. An element whose target has no page yet isn't rendered (a CTA) or is plain text, as on the other pages; each carries its design id in a comment in `content.ts`, so the job that builds that page finds it.

| Design id (use) | Here |
|---|---|
| `#leitfaden`, `#kuerzung` (the hero's "Leitfaden lesen ↓", "Kürzungsrechte ↓"; article 09's "Zur Übersicht der Kürzungsrechte ↓") | the same anchors on this page |
| `#s-geltung` … `#s-kuerzung-kurz` (the table of contents) | the same anchors on this page |
| `44SBXKXJaSp6bvGMnbpZj6` (the check's "Mit Heidi alle Punkte erfüllen →", the closing card's "Demo buchen", the floating CTA) | `DEMO_HREF` (`#start`, the closing form) |
| `FQ6egKN8KrFwGUMZDUaavJ` (the penalty block's "Heizkostenabrechnung prüfen →", the "Heizkostenabrechnungs-Checker" design) | none yet: the whole line ("Prüfen Sie, ob Ihre Mieter kürzen könnten: …") hidden until that page exists (a later page of this queue) |
| `Jp8tqY82m7FZqMnWU4z9x9` (FAQ 2's "Jetzt noch umrüsten →", the banner) | `ROUTE_UPGRADE_NOW` (FAQ 2 as the answer's `more` link; the banner through `DEFAULT_CHROME`) |
| `5HTo3o7mYMjqUxPXcEyuEy` (FAQ 3's "Heidi Mieterportal") | `ROUTE_MIETERPORTAL`, an `<a>` inside the answer |

Links to this page: the repo names the guide in the footer's "HKVO-Leitfaden" and in `/vorgehen`'s `HKVO_GUIDE_HREF` ("Zum HKVO-Leitfaden"); `/vorgehen`'s design links it to `SJbSeTYRqntQxpZQ8RVNf7` (checked in its design, 2026-10-19). Both get the link with the route (01 §1.1). No other content module names the guide.

## Implementation notes (2026-10-19)

Phases 1–4 are built: the plan (`31c3855f`), the route, content, the pure check and table-of-contents logic and the links from the footer and `/vorgehen` (`253926bc`), the sections with the check and the table of contents (`b6450918`), and `e2e/hkvo-leitfaden.e2e.ts` (13 tests). Compared with the design section by section at 1440, 1100, 980, 700 and 375 px (production build, reduced motion, Geist loaded into the saved design): the hero with the check, the guide (the table of contents and all nine articles) and the FAQ have the design's height at every width and match it by eye, as does the check's risk state (the same clicks in both, 787 px at 375 px); the differences are the planned ones: the penalty block without its "Heizkostenabrechnung prüfen" line (52 px shorter, 76 px at 375 px where the line wraps), and the closing card holds the signup form (its height +50 / +50 / −14 / +42 px at 1100 / 980 / 700 / 375 px, as on `/fristenrechner`). No overflow at 320 and 375 px (also with the risk box open); no console errors or hydration warnings. Full suites: check, lint, 581 unit tests, 359 e2e tests passed. Two earlier full e2e runs each had one unrelated timing failure under load (`/mieterportal`'s "hero list replays", then `blog.e2e.ts`'s tag filter), both green in the next run; unchanged. Open: the manual checks of §4.1 not ticked there, and the gate §4.4. Deviations from the plan:

- **Phases 2 and 3 are one commit:** the check's answers and the table of contents' scroll spy are part of their sections.
- **The design's paragraphs have no bottom margin** (its base CSS sets `p{margin:0}`), while its lists keep theirs: the risk list keeps the browser's `1em` margins, 40 px padding and bullets.
- **`.lf-ring` is `.dial` here:** `ring` is a Tailwind utility (a box-shadow ring), so the class drew a frame around the score.
- **The check card is a labelled group** ("Schnell-Check Heizkostenverordnung"), each question a group with its two `aria-pressed` buttons; the score ring is an image named "N von 5 mit Ja".
- **Local Postgres:** none was running; a throwaway `postgres:18-alpine` on 127.0.0.1:54322 with the roles `anon`, `authenticated` and `service_role` before `drizzle-kit push`, stopped afterwards.

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/hkvo-leitfaden`, `ROUTE_HKVO_LEITFADEN` in `$lib/routes.ts`: the footer's label, lower case, no umlaut. Not confirmed (gate §4.4) |
| Route group | `(landing-page)`, outside `[[preview=preview]]` |
| Indexing | `seo.noindex = true` and out of the sitemap until the cutover; then indexed and in the sitemap (decision of 2026-10-17), so its gate (§4.4) blocks the cutover PR (#440) |
| Header | The shared `LandingHeader` with `DEFAULT_CHROME` (the design's banner is the same) |
| Content | Every text in `content.ts`, word for word (the design has no non-breaking spaces; the H1 keeps its soft hyphen "Heizkosten­verordnung") |
| Schnell-Check | Five questions, each a `role="group"` labelled by its question with two buttons "Ja" / "Nein" (`aria-pressed`, the design's colours). The answers are `$state`; score, ring and result `$derived` through the pure `check.ts`. The result is a polite live region. The server renders the unanswered state (0/5, the hint). Without JS the questions read as a checklist: the buttons, the ring and the hint are hidden (`@media (scripting: none)`), since nothing could answer them |
| Check result texts | The design's, with the singular fixed: "Noch 1 Frage offen." (the design: "Noch 1 Fragen offen."). The risk lines are the question's risk and its paragraph in brackets, e.g. "Kürzungsrecht bis 15 % (§ 4)" |
| Confetti | The design's `PG.confetti` from the score on every answer that leaves all five at "Ja" (the design fires on each such click): the shared `confettiFrom` (`sg/confetti.ts`), nothing with reduced motion; a running burst stops on teardown |
| Table of contents | Nine links to the articles; the article whose top passed 30 % of the viewport height is `on` (`aria-current="true"`), the progress bar fills with the share of the guide's body above that line (both pure in `toc.ts`, read from one passive scroll listener per animation frame and on resize). The server renders the first link `on` and the bar empty, as the design's first `spy()` at the top. Sticky at 96 px above 900 px; below, a static card in two columns (one at 560 px) without the bar |
| Anchor jumps | The articles get `scroll-margin-top: 90px` (the design's TOC offset, overriding its 96 px), `#leitfaden` and `#kuerzung` 72 px (the design's `PG` offset); app.css scrolls smoothly, the landing reset makes it instant with reduced motion. No click handler |
| Signup and CTAs | The closing card gets the `SignupForm` and `id="start"` in place of the design's video button "Demo buchen" (as on `/fristenrechner`); the submit label is "Demo buchen". The design's hero carries `#start` but has no form, so the hero has no anchor. The check's risk link "Mit Heidi alle Punkte erfüllen →" leads to `#start` and focuses the e-mail field (`focusSignup`). Leads: `source: "hkvo-leitfaden"`, `switchinquiry` with `page: "/hkvo-leitfaden"`. Open question 2 |
| Penalty block | Pill "§ 12 HeizkostenV" (warning icon), H2, the three cards; the line with "Heizkostenabrechnung prüfen →" hidden until the checker page exists (open question 1) |
| FAQ | The shared `Faq` (default variant, first answer open, FAQPage JSON-LD) on the white band with the design's centred heading; links in `--ok`, 600 (`.xfq .ans a`) |
| Styling | Component-scoped CSS from the design; breakpoints the design's (1040 `.pg-grid`; 900 and 560 `lf-`; 640 `.pg-sec`/`.pg-hero`; `#hs-css` 1040/620). No class that is also a Tailwind utility |

## Open questions (the default is built unless answered)

1. **CTA without a page.** "Heizkostenabrechnung prüfen →" leads to the Heizkostenabrechnungs-Checker, which doesn't exist yet. *Default: the line hidden* until that page exists (its job links it).
2. **Closing card.** The design's video button "Demo buchen" leads to a booking page that doesn't exist. *Default: the signup form with "Demo buchen" as its button.*
3. **After the deadline.** Article 03 ("Bestehende Geräte müssen bis zum 31. Dezember 2026 nachgerüstet oder ersetzt werden"), the question "Sind alle Geräte fernablesbar?" with its risk "Ab 2027: Kürzungsrecht 3 %" and FAQ 2 ("Was passiert, wenn meine Zähler Ende 2026 nicht fernablesbar sind?") speak of the future. *Default: as the design;* the texts are part of the gate.

## Risks

- **Every gate is on the cutover's critical path** (04 §4.4–4.26).
- **Legal statements in a guide.** The whole page restates the Heizkostenverordnung, § 556 BGB and the CO2KostAufG with paragraph numbers, and the check tells a visitor what they risk ("Kürzungsrecht bis 15 %", "Abrechnung angreifbar", "Nachzahlung entfällt"). A few statements need a careful look: article 05 lists "Anmietung … der Erfassungsgeräte" and "Verwendung der Geräte einschließlich Eichung" under § 7 Abs. 2 (heating costs), article 07 cites "§ 6a Abs. 3" for the billing details, the 70 % rule's conditions in article 04 (§ 7 Abs. 1 S. 2), the § 11 exceptions, the 3 % for missing billing details. Mitigation: FAQ 5 ("Ersetzt der Leitfaden eine Rechtsberatung? Nein …") stays; legal sign-off in §4.4; align with `/fristenrechner` (§4.5), `/upgrade-now` (§4.24) and `/verbrauchsinformation` (§4.14).
- **The table of contents on a long page.** The scroll listener is passive and reads nine boxes once per frame; nothing runs when the page doesn't scroll.

## Out of scope

- The design's nav, footer, chat button, `#top-js`, `#mobfx`, `#eb-js`, `#pillfx` beyond the pill's own hover, `#end-css`, `#fx-js` (the design footer's newsletter; ours is the shared footer), `#demo-css` beyond `.bk-next`, `PG.countUp` / `tween` / `seg` / `paintRange` (unused by this page), the design's own smooth anchor scrolling (see Key decisions).
- A print view or a PDF of the guide.
- The page the hidden CTA leads to.
