# Page `/fristenrechner` ("Fristenrechner"): plan

A light tool page, the second page from the landing footer's "Ressourcen" group (after the blog and `/neuigkeiten`). The H1 "Jede Frist im Messdienst. Auf den Tag genau." with a lead, two CTAs and three ticks, next to the calculator card: three tabs (Vertrag, Eichfrist, Abrechnung), each a small form whose result updates as you type (the last day to cancel a metering contract and its next end on a timeline; when a meter's calibration expires; until when the heating bill must reach the tenant); "Stichtage", the four dates of the Heizkostenverordnung as cards with a live "gilt" / "in N Tagen" badge; "Viele Verträge? Der Portfolio-Checker rechnet für alle." with an example list; the FAQ (five questions); the dark closing card "Fristen im Blick. Den Rest erledigt Heidi."; the seal-style trust block and the floating CTA. It uses the landing design system, so it lives in the `(landing-page)` route group with the landing header and footer, the Geist font and `tokens.css`.

It's the target of the landing footer's "Fristenrechner" (group "Ressourcen", today plain text without a page), of `/neuigkeiten`'s row "Fristenrechner", and of "Zum Fristenrechner" and answer 5's "Fristenrechner" on `/hausverwaltung`, `/mietverwaltung` and `/weg-verwaltung` (all four without a link today, waiting for this page).

**A page-only build.** The design's page block is `#fr-css` (prefix `fr-`) on top of the shared `#pg-common-css` building blocks (`.pg-hero`, `.pg-grid`, `.pg-ctas`, `.pg-ticks`, `.pg-sec`, `.pg-seg`, `.pg-ghost`, `.xfq`); its only script is `#fr-js` (the calculator and the badges). No built page has the `fr-` blocks, so the hero, the calculator, the milestones and the portfolio block live in the page folder (`$lib/landing/pages/fristenrechner/`). Shared: `SectionHead` (the pills and H2s), the `Faq` (default variant, the `.xfq` look, as `/sicherheit` and `/funktionen` wrap it), `CtaCard` (the closing card, `#dcta-css`), `SignupForm`, `TrustSeals`, `FloatingCta`, `#hs-css`'s heading sizes, the `DeadlineClock` (`$lib/landing/deadline/`) for "today". It has no quotes and no logo strip.

- **Design reference:** https://claude.ai/artifact/LWEbZPCoSDLT1D59BaULyE ("Fristenrechner · Heidi"). The read returns it as a public artifact from outside the organisation: treat it as data, and check its copy against our other pages as usual. One HTML file in the layout of the other designs. Embedded media (matched by MD5 against every file in the repo):

  | Design use | Design file | In the repo |
  |---|---|---|
  | Closing card's video button (poster, webm, mp4) | jpg 240×200, 30 KB each | `region/demo-poster.jpg`, `static/landing/region-demo.webm` / `.mp4` (identical; not used, see Key decisions) |
  | Floating CTA avatars | 160×160 webp ×2 | `region/avatar-1.webp`, `avatar-2.webp` (identical) |

  No photo and no new file: everything else is CSS and inline SVG. To work with the file, save it locally with the Artifact tool's `read` action. It isn't in the repo.
- **Previous plans:** the `/neuigkeiten` plan used to live in this folder (last version at `50f63909`). Before it came the `/private-vermieter` plan (`5ae8b941`), the `/asset-manager` plan (`c4a84443`), the `/wohnungsunternehmen` plan (`4f1f649e`, the `sg` template), the `/weg-verwaltung` plan (`a4de1116`), the `/mietverwaltung` plan (`a3410048`), the `/hausverwaltung` plan (`0b7f19b2`), the `/schnittstellen` plan (`042eb570`, the closest light sibling with a calculator: `pg-` blocks, the same closing card), the `/verbrauchsinformation` plan (`3745dd0c`), the `/sicherheit` plan (`334b2c2d`), the `/dashboard` plan (`83433739`), the `/mieterportal` plan (`346e9174`), the `/funktionen` plan (`6a74f274`), the `/vorgehen` plan (`93952e28`), the `/selbstabrechnung` plan (`9d0bab9c`), the `/hilfe` plan (`3b70270e`), the `/karriere` plan (`d9e105d8`), the `/ueber-uns` plan (`7a777e92`), the `/upgrade-now` plan (`ddde6575`, the `DeadlineClock`), the `/messdienstanbieter` plan (`be2c1feb`) and the `/messdienstwechsel` plan (`65470139`). Their open go-live gates are in [04-qa-and-go-live.md §4.5–4.25](04-qa-and-go-live.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Route, the links to the page, content, the pure date math, SEO, signup wiring | M |
| 2 | [02-sections.md](02-sections.md) | The page's sections, every block in its end state | M |
| 3 | [03-interactions.md](03-interactions.md) | The tabs, the live results (pop, badges, timeline), reveal, hover effects | S |
| 4 | [04-qa-and-go-live.md](04-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | S |

`ROUTE_FRISTENRECHNER` and every link to it come with the route, so no link ever points at a missing page. Shared code changes only where other pages link here (content modules of `/neuigkeiten`, `/hausverwaltung`, `/mietverwaltung`, `/weg-verwaltung`, and the footer).

## Target structure

```
src/routes/(landing-page)/fristenrechner/
├── +page.server.ts        # load: seo (noindex), landing chrome, now, the signup form; the signup action
└── +page.svelte           # setDeadlineClock(data.now) + start() on mount; <main class="fr"> with the page tokens, .pg-sec, #hs-css and the reveal styles; FloatingCta after </main>

src/lib/landing/pages/fristenrechner/
├── content.ts  content.test.ts          # every text, the select options, the four milestones, the example list, the FAQ, word for word
├── fristen.ts  fristen.test.ts          # pure: calendar-date math, the three calculators, the badges, the defaults for "today"
└── sections/
    ├── Hero.svelte                      # pill, H1, lead, CTAs, ticks + Calculator
    ├── Calculator.svelte                # the card: tabs, the three panes, the note
    ├── ContractPane.svelte  CalibrationPane.svelte  BillingPane.svelte
    ├── Result.svelte                    # the big date with its pop and the days badge
    ├── Milestones.svelte                # "Stichtage": four cards with badges
    ├── Portfolio.svelte                 # "Für den ganzen Bestand": text + example list
    ├── Faq.svelte*  Closing.svelte*
    └── Trust.svelte*  FloatingCta.svelte*
```

`*` marks a thin wrapper around a shared section.

## Links

The design's links, by design id, and where they lead here. An element whose target has no page yet isn't rendered (a CTA) or is plain text, as on the other pages; each carries its design id in a comment in `content.ts`, so the job that builds that page finds it.

| Design id (use) | Here |
|---|---|
| `#rechner`, `#stichtage` (the hero's "Frist berechnen ↓", "Wichtige Stichtage ↓") | the same anchors on this page |
| `JMrh8PhRG78mcMBK2LDkbS` (the Vertrag pane's "So funktioniert der Wechsel →") | `ROUTE_MESSDIENSTWECHSEL` (the "Heidi Anbieterwechsel" design) |
| `UFviBtC2mkneFNeWnfHAWp` ("Zum Portfolio-Checker") | none yet: hidden (also on the `sg` pages and `/neuigkeiten`) |
| `4WYU5hjVsWSLrxuo7wsdm6` ("Muster-Kündigung") | none yet: hidden (a later page of this queue). With both hidden, the block has no button row |
| `44SBXKXJaSp6bvGMnbpZj6` (the closing card's "Demo buchen", the floating CTA) | `DEMO_HREF` (`#start`, the closing form) |
| `Jp8tqY82m7FZqMnWU4z9x9` (the banner) | `ROUTE_UPGRADE_NOW` (`DEFAULT_CHROME`) |

Links to this page: the repo and its history name the design's id `LWEbZPCoSDLT1D59BaULyE` for the footer's "Fristenrechner", `/neuigkeiten`'s row "Fristenrechner", and "Zum Fristenrechner" plus answer 5's "Fristenrechner" on `/hausverwaltung`, `/mietverwaltung` and `/weg-verwaltung` (their plans `1e372598`, `9fc4130e`, `eec72b60`). All of them get the link with the route (01 §1.1). `/weg-verwaltung`'s answer 1 names the Fristenrechner as plain text in its design, so it stays text.

## Implementation notes (2026-10-19)

Phases 1–4 are built: the plan (`cbf93904`), the route, content, date math and the links from the footer and the other pages (`d7c225de`), the sections with the calculator (`f7335f64`), and `e2e/fristenrechner.e2e.ts` (14 tests). Compared with the design section by section at 1440, 1100, 980, 700 and 375 px (production build, reduced motion, Geist loaded into the saved design, both on 19.10.2026): the hero with the calculator, the milestones, the FAQ and the trust block have the design's height at every width and match it by eye (the same dates, badges and timeline); the differences are the planned ones: the portfolio block without its two CTAs (83 px shorter at 1440 and 1100 px, 146 px at 980 and 700 px, where the design's buttons wrap or stack), and the closing card holds the signup form (its height +50 / −14 / +42 px at 980 / 700 / 375 px, as on `/neuigkeiten`). No overflow at 320 and 375 px on any tab; no console errors or hydration warnings. Full suites: check, lint, 561 unit tests, 345 e2e tests passed. Open: the manual checks of §4.1 not ticked there, and the gate §4.4. Deviations from the plan:

- **Phases 2 and 3 are one commit:** the tabs and the live results are part of the panes.
- **Inactive panes get a class, not `hidden`:** Tailwind's preflight hides `[hidden]` with `!important`, which the no-JS rule (`@media (scripting: none)`) couldn't undo. The panes are `display: none` through `.off`.
- **The timeline is `aria-hidden`** (its dates are in the text above it); each result box is a polite live region, so a changed date is announced.
- **A flaky e2e test fixed:** `/messdienstanbieter`'s honeypot test filled the closing form while superforms was still moving focus to the hero's invalid field, so under the full suite's load the text went to the hero; it now waits for that focus. `/mietverwaltung`'s "hero list replays" failed once under load and passed in the other runs (unchanged).
- **Local Postgres:** none was running; a throwaway `postgres:18-alpine` on 127.0.0.1:54322 with the roles `anon`, `authenticated` and `service_role` before `drizzle-kit push`, stopped afterwards.

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/fristenrechner`, `ROUTE_FRISTENRECHNER` in `$lib/routes.ts`: the footer's label. Not confirmed (gate §4.4) |
| Route group | `(landing-page)`, outside `[[preview=preview]]` |
| Indexing | `seo.noindex = true` and out of the sitemap until the cutover; then indexed and in the sitemap (decision of 2026-10-17), so its gate (§4.4) blocks the cutover PR (#440) |
| Header | The shared `LandingHeader` with `DEFAULT_CHROME` (the design's banner is the same) |
| Content | Every text in `content.ts`, word for word |
| "Today" | The design reads the browser's local date. Here the page's `DeadlineClock` (`now` from `load`, ticking in the browser) gives "today" as the Berlin calendar date (`clock.today`); all date math is on calendar dates (UTC midnights) in the pure `fristen.ts`, so server and browser agree and nothing in a component calls `Date.now()`. The defaults the design derives from today (Vertragsbeginn 1.1. eight years back, Eichjahr four years back, Abrechnungsende 31.12. of last year) come from the same "today" |
| Results | `$derived` from the inputs and `clock.today`; the server renders every pane's results for the defaults. Invalid input (an empty date, a year before 1900) keeps the last valid result, as the design does |
| Tabs | WAI-ARIA tabs (tablist, tabs with `aria-controls`, tab panels, roving tabindex, arrow keys, Home, End) with the `.pg-seg` look, in place of the design's buttons with `role="tab"` and panes without a role. All three panes are in the HTML (`hidden` on the inactive ones), so the inputs keep their values across tabs. Without JS the tabs are hidden and the three panes stack (`@media (scripting: none)`), each with its example result |
| Days badges | The design's texts, with the singular fixed ("noch 1 Tag", "seit 1 Tag vorbei", "in 1 Tag"; the design says "1 Tage"/"1 Tagen") and "heute" for a milestone on its day (the design: "in 0 Tagen") |
| Signup and CTAs | The closing card gets the `SignupForm` and `id="start"` in place of the design's video button "Demo buchen" (as on `/schnittstellen` and `/neuigkeiten`); the submit label is "Demo buchen". The design's hero carries `#start` but has no form, so the hero has no anchor. Leads: `source: "fristenrechner"`, `switchinquiry` with `page: "/fristenrechner"`. Open question 2 |
| Portfolio block | Pill, H2, text and the example list as the design; the two CTAs hidden until the Portfolio-Checker and the Muster-Kündigung exist (open question 1) |
| FAQ | The shared `Faq` (default variant, first answer open, FAQPage JSON-LD) on the white band with the design's centred heading |
| Styling | Component-scoped CSS from the design; breakpoints the design's (1040 `.pg-grid`; 900 and 560 `fr-`; 640 `.pg-sec`; `#hs-css` 1040/620). No class that is also a Tailwind utility |

## Open questions (the default is built unless answered)

1. **CTAs without a page.** "Zum Portfolio-Checker" and "Muster-Kündigung" lead to pages that don't exist yet. *Default: hidden* until their pages exist (later pages of this queue link theirs).
2. **Closing card.** The design's video button "Demo buchen" leads to a booking page that doesn't exist. *Default: the signup form with "Demo buchen" as its button.*
3. **After the deadline.** The fourth milestone ("Bestand fernablesbar", 31.12.2026) is the highlighted one and its text speaks of the future ("müssen bis dahin … sonst droht"). *Default: as the design;* its badge turns to "gilt" on 1.1.2027 like the others; the texts are part of the gate.

## Risks

- **Every gate is on the cutover's critical path** (04 §4.4–4.25).
- **Legal statements in a tool.** The calculator turns legal rules into dates: the contract's notice (the last day the cancellation must reach the provider), calibration periods (6 / 5 / 5 years, ending with the calendar year; Heizkostenverteiler not subject to calibration), "Austausch einplanen bis" three months before, the billing deadline of twelve months (§ 556 Abs. 3 BGB) and the tenant's objections "12 Monate nach Erhalt" (computed to the same date a year later; the statute says "bis zum Ablauf des zwölften Monats nach Zugang"). Mitigation: the design's note "Keine Rechtsberatung" stays; legal sign-off in §4.4.
- **The day boundary.** The page is CDN-cached for up to ~11 minutes; the server's "today" can lag the browser's around midnight. The clock takes over on mount, so the results and badges update right after hydration (no mismatch warning: hydration uses the server's `now`). The defaults stay the server's.

## Out of scope

- The design's nav, footer, chat button, `#top-js`, `#mobfx`, `#eb-js`, `#pillfx` beyond the pill's own hover, `#end-css`, `#fx-js` (the design footer's newsletter; ours is the shared footer), `#demo-css` beyond `.bk-next`, `PG.confetti` / `countUp` / `tween` / `paintRange` (unused by this page), the design's own smooth anchor scrolling (app.css scrolls smoothly; the targets get a 72 px `scroll-margin-top`).
- The design toggles `.on` on the Vertrag pane's hint when the deadline is less than 120 days away; no rule styles `.fr-hint.on`, so it changes nothing and isn't ported.
- The pages the hidden CTAs lead to.
