# Page `/ueber-uns` ("Über uns"): plan

The company page of Heidi Systems: who Heidi is (a Berlin PropTech that runs the whole Messdienst for Hausverwaltungen), the mission (every meter remotely readable by 1.1.2027), four principles, the service KPIs, the founder, two customer quotes, a careers teaser and a closing CTA. It uses the landing design system, so it lives in the `(landing-page)` route group with the landing header and footer, the Geist font and `tokens.css`. The landing footer's "Über uns" entry (plain text today) links to it once phase 1 is done.

- **Design reference:** https://claude.ai/artifact/TYGNNySnjJfz1jcwJbUMbT ("Über uns · Heidi"). One HTML file: the shared base CSS of the landing designs (`:root` tokens, `.dm-*` primitives, nav), the "Lösungsseiten" building blocks (`#pg-common-css`, prefix `pg-`, ~40 lines), the page CSS (`#ub-css`, prefix `ub-`, ~85 lines), the card-style trust block (`#trust-css`), a shared helper script (`#pg-common`: reveal, count-up, confetti, smooth anchors) and the page script (`#ub-js`, ~35 lines). Embedded images: the 12 customer logos and the 3 partner logos, all already in `$lib/landing/data/logos.ts` and the Trust section. Save it locally with the Artifact tool's `read` action; it isn't in the repo.
- **Previous plans:** the `/upgrade-now` plan used to live in this folder (last version at `ddde6575`), before it the `/messdienstanbieter` plan (`be2c1feb`) and the `/messdienstwechsel` plan (`65470139`). Their open go-live gates moved to [04-qa-and-go-live.md §4.5–4.7](04-qa-and-go-live.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Route, content module, SEO, footer link, the signup form; moving the pieces the page shares with `/upgrade-now` and `/messdienstwechsel` | S |
| 2 | [02-sections.md](02-sections.md) | The 10 sections with static markup and the design's CSS | M |
| 3 | [03-interactions.md](03-interactions.md) | Hero checklist animation + confetti, the deadline card, the principle tabs, count-ups, reveal on scroll | M |
| 4 | [04-qa-and-go-live.md](04-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | S |

Phase 1 goes first and on its own: once the footer entry links to `/ueber-uns`, the `messdienstanbieter` e2e check "internal links resolve" needs the route. Phases 2 and 3 can overlap (3 needs the markup of 2).

## Target structure

```
src/routes/(landing-page)/ueber-uns/
├── +page.server.ts        # load: seo, landing chrome, `now`, the signup form; the form action
└── +page.svelte           # sets the deadline clock, composes the sections

src/lib/landing/
├── deadline/                                    (moved from pages/upgrade-now/, phase 1.4)
│   ├── deadline.ts  deadline.test.ts            # + retrofitProgress(now)
│   └── clock.svelte.ts
├── components/
│   ├── SectionHead.svelte  ArrowLink.svelte     (moved from pages/upgrade-now/components/)
├── sections/
│   ├── TrustCards.svelte                        (moved from pages/messdienstwechsel/sections/Trust.svelte)
│   └── Testimonials.svelte                      # + optional `id`
└── pages/ueber-uns/
    ├── content.ts  content.test.ts              # all copy: hero, services, mission, principles, KPIs, team, careers, CTA
    └── sections/
        ├── Hero.svelte                          # text + CTAs + ticks
        ├── ServiceStack.svelte                  # "Was Heidi übernimmt" checklist card (hero right column)
        ├── LogoStrip.svelte*
        ├── Mission.svelte                       # text + DeadlineCard
        ├── DeadlineCard.svelte                  # "Bis zur Fernablesepflicht … Tage" + progress bar
        ├── Principles.svelte                    # 4 tabs + detail panel
        ├── Numbers.svelte                       # 4 KPI tiles
        ├── Team.svelte                          # founder card + text + links
        ├── Testimonials.svelte*                 # Werne + Gerhard
        ├── Careers.svelte                       # dark "Wir wachsen" teaser
        ├── FinalCta.svelte*                     # id="start", the signup form
        └── Trust.svelte*                        # TrustCards without the "Mehr über Heidi" link
```

`*` = a thin wrapper around the shared section, the same rule as the other landing pages: `+page.svelte` imports only from its own `sections/` folder.

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/ueber-uns` (German, no umlaut, the usual spelling of German sites), as `ROUTE_UEBER_UNS` in `$lib/routes.ts` |
| Route group | `(landing-page)`, outside `[[preview=preview]]`: the design is a landing design (Geist, `dm-*` tokens, landing nav/footer) and there's no Prismic content |
| Header | The shared `LandingHeader` with `DEFAULT_CHROME` (the design's banner text and "Mehr erfahren" → `/upgrade-now` are exactly that). Nav CTA "Bestand prüfen" → `#start` |
| Footer | The shared `LandingFooter`; `companyLinks` "Über uns" gets `href: ROUTE_UEBER_UNS`. The site (`(base)`) header/footer stay as they are until the cutover (Next parity; open question 5) |
| Styling | The `ub-*` and `pg-*` CSS goes into the sections' scoped `<style>` blocks; tokens from `tokens.css`. The design's breakpoints stay (1040, 640 for the page; 820 for the trust cards). The `pg-*` blocks are page-local for now; extract them when a second "Lösungsseite" design arrives |
| Reuse | LogoStrip, Testimonials, FinalCta, the trust cards, `SectionHead`/`ArrowLink`, the deadline module and clock, `confetti.ts`, the `reveal`/`countUp`/`playOnView` attachments. Shared pieces move to `$lib/landing/` instead of being copied (phase 1.4) |
| Deadline | The mission card uses `daysLeft()` from the shared deadline module (Europe/Berlin, `now` from `load`, the `DeadlineClock` takes over in the browser). It shows the same number as `/upgrade-now` ("Noch 80 Tage" on 12.10.2026), not the design's `ceil((1.1.2027 − now) / day)` in browser time, which is one higher for most of the day. The bar is the elapsed share from 1.1.2022 to the deadline, a new tested `retrofitProgress(now)` |
| After the deadline | The card and the mission lead switch to an expired text (phase 3.2); the rest of the page is timeless. Copy is a placeholder until the content owner writes it |
| Form and CTAs | The design has no form: "Demo buchen" goes to a booking design, "Bestand prüfen" to the hero. As on `/upgrade-now`: the final CTA gets the shared `SignupForm` (`id="start"`, button "Demo buchen"), lead `source = "ueber-uns"`, and every demo/start CTA scrolls there and focuses the email field (`DEMO_HREF`, `focusSignup()`). The hero has no `id="start"` |
| Careers | There's no careers page. The three career links ("Karriere bei Heidi", "Offene Stellen", "Zur Karriereseite") go to one constant `CAREERS_HREF` in `cta.ts`, by default the LinkedIn company page from `Footer/footerLinks.ts` (external, `rel="noopener"`), so a real careers URL is a one-line change (open question 2) |
| Links without a page | "Kundenstimmen lesen" → `#stimmen` (this page's testimonials). The principle panels' "Dashboard ansehen" and "Zum Portfolio-Checker" are dropped until those pages exist (`link?` in the content stays). The trust block's "Mehr über Heidi" is dropped here (it points to this page); on `/messdienstwechsel` it now links to `/ueber-uns` instead of `/` |
| No JS | Every section renders its final state on the server: all services ticked, "Ein Partner für alles" shown, the day count and bar filled, the KPIs at their values, principle 01 open. The principle buttons need JS to switch; the form works without it |
| Indexing | `noindex` + self-canonical and out of the sitemap until the go-live gate (§4.4), like the other new landing pages |
| Rendering | SSR with the `(landing-page)` cache header, not prerendered (the day count depends on the request time) |

## Implementation notes (2026-10-12)

Phases 1–3 are built; phase 4's tests are written (`e2e/ueber-uns.e2e.ts`, `content.test.ts`, `retrofitProgress` in `deadline.test.ts`). Open in §4.1: the visual comparison at all five widths, Safari/Firefox/iOS, keyboard-only, Lighthouse. The signup e2e tests need the `leads` table in the local Postgres. Deviations from the plan:

- `ArrowLink` got an `ink` prop: the hero's "Demo buchen" is the design's dark `bk-next`, not the green `.inv`.
- The career links open in a new tab (`target="_blank" rel="noopener"`), since `CAREERS_HREF` is external.
- The founder card's "Berlin" pill keeps the design's house icon instead of `icons/Pin.svelte`.
- Gerhard's badge comes from `data/testimonials.ts` ("Verifizierter Gewerbekunde"); the design says "Verifizierter Heidi-Kunde". Settle with the references sign-off (§4.6).
- The checklist starts 300 ms after it comes into view (the plan's timing); the design waits another 300 ms before `play()`.
- `SplitHeading` moved to `$lib/landing/types.ts`.

## Open questions (the default is built unless answered)

1. **Slug.** *Default: `/ueber-uns`.* `/unternehmen` or `/about` are the alternatives; decide before go-live.
2. **Careers target.** *Default: the LinkedIn company page.* A real careers page or job-board URL (Personio, Join …) replaces it via `CAREERS_HREF`. If there are no open positions at go-live, hide the careers teaser and the two career links (one flag in `content.ts`).
3. **The final CTA.** The design ends with a dark card "Lernen Sie Heidi kennen." and a "Demo buchen" button; we render the shared centred signup block with that title (the same deviation as on `/upgrade-now`). *Default: the form. If a booking URL exists by then, `DEMO_HREF` switches all demo CTAs and the design's dark card can come back without a form.*
4. **Founder card.** The design shows initials ("PG") instead of a photo. *Default: initials. A licensed portrait can replace them (`Image`, 96 px round); "Gründer und Geschäftsführer" needs confirmation (the Impressum only says "Vertreten durch: Paul Gerlach").*
5. **Discoverability.** *Default: only the landing footer links here.* After the cutover, the site footer and the header could link to it too (a deliberate deviation from Next, to be listed in `scripts/layout-diff.ts`).
6. **Lead routing.** *Default: the existing `switchinquiry` Make.com event with `page: "/ueber-uns"`.*

## Risks

- **Unconfirmed claims.** "0 € Installationskosten", "Mieter 14 Tage vorher informiert", "Ein fester Ansprechpartner", "Wechsel auch bei laufendem Vertrag", "Daten direkt in Ihrem ERP- oder CRM-System", "Kündigung … per Vollmacht", "Unser Team in Berlin entwickelt Zähler-Anbindung, Dashboard und Abrechnung selbst" and "Installationspartner" are company statements. 92 %, 14 Tage and 1–2 h were confirmed on 2026-10-12; the rest is in the gate (§4.4).
- **Time-dependent copy.** "Ab dem 1. Januar 2027 müssen …" and the day count go stale on 1.1.2027. Mitigation: the expired state of phase 3.2, driven by the shared clock.
- **Hero animation flash.** The checklist is above the fold; if the animation's start state were the server markup, no-JS visitors would see dimmed items, and if the reset ran after hydration, JS visitors would see a tick → untick flash. Mitigation: CSS keyframe animations started by `.play` (the `playOnView` pattern), with the final state as the default style (phase 3.1).

## Out of scope

- The design's nav (Produkt / Lösungen / Kunden / Ressourcen with "bald" pages).
- The pages the design links to (Karriere, Kundenreferenzen, Dashboard, Portfolio-Checker, Demo buchen).
- A team section with more people, a timeline or press logos (not in the design).
