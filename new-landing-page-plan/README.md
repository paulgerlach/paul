# Landing page `/upgrade-now` ("Jetzt noch umrüsten"): plan

A landing page about the **retrofit obligation of the Heizkostenverordnung**: every Heizkostenverteiler, Wärme- and Warmwasserzähler must be remotely readable by **31.12.2026**, otherwise tenants may cut their heating-cost share by 3 % per billing period. The page counts down to the deadline, shows what waiting costs, and leads to a Heidi retrofit request. Like the other landing pages it lives in the `(landing-page)` route group, with the landing header and footer, the Geist font and `tokens.css`. The landing footer's new "Produkt" group links to it ("Jetzt noch umrüsten", already built).

- **Design reference:** https://claude.ai/artifact/Jp8tqY82m7FZqMnWU4z9x9 ("Jetzt noch umrüsten · Heidi"). One HTML file: the shared base CSS of the landing designs (`:root` tokens, `.dm-*` primitives, nav), about 250 lines of page CSS (`#umr-css`, prefix `um-`), one page script (`#umr-js`, ~130 lines) and embedded images (the 12 customer logos, the 3 partner logos).
- **Previous plan:** the `/messdienstanbieter` (city and Germany pages) plan used to live in this folder, and before it the `/messdienstwechsel` plan. Both are in git history (last versions at `be2c1feb` and `65470139`). Their open go-live gates moved to [05-qa-and-go-live.md §5.5 and §5.6](05-qa-and-go-live.md).

## Time pressure

The page is about a deadline **12 weeks away** (today is 2026-10-07). It only does its job before 31.12.2026, and it can only go live with the SvelteKit cutover (PR #440), because production still runs the Next app. So:

- Build it as the next landing task, and keep it small: reuse the shared sections, no new dependencies.
- Its go-live gate (§5.4) is mostly legal and business sign-off. Start those requests **now**, in parallel with the build.
- It needs a defined state for **after** the deadline (§3.2), because the page will still be online on 1.1.2027.

## Implementation notes (2026-10-07)

Phases 1–4 are built, phase 5's automated tests are written; the manual checks of §5.1 and the go-live gate §5.4 are open.

- **Built as planned:** route with `noindex` + self-canonical (not in the sitemap), `bannerHref: "#risiko"`, header CTA "Bestand prüfen"; `content.ts`; `deadline.ts` (Europe/Berlin, tested also with `TZ=UTC` and `TZ=America/New_York`); `calculator.ts`; `DeadlineClock` (`clock.svelte.ts`, context per page). Sections read `clock.today` (changes once a day) for every day-based value and `clock.now` only in the countdown.
- **Shared code:** `Faq` got `lead` and `variant="split"` (the design's two-column FAQ, plus icons, all closed); `FinalCta` got `id`, `kicker` and an optional `sub`; `Trust` moved to `sections/`; quotes moved to `data/testimonials.ts` (`References` reads them, new `sections/Testimonials.svelte`); `confetti.ts` has options with the old values as defaults; new `attachments/reveal.ts` (reveal on scroll, hides only elements below the fold at mount, so no-JS and above-the-fold content never flash).
- **CTAs:** `focusSignup()` now focuses `#start input[name=email]` instead of a fixed id, so it works for the hero form of the other pages and for this page's final form (`id="start"`). No other page changed behaviour.
- **Design bugs fixed** (tell the designer): the last day said "Frist abgelaufen"/"null Tage" (now "Letzter Tag" / "Nur noch heute"); `moText` read past "zwölf" (clamped); the year band's "letztes Zeitfenster" months now come from the current Berlin month instead of the elapsed share of the year; calendar "today" uses Berlin, not the browser's time zone.
- **Deviations from the design:** the final CTA is the shared centred block with the signup form instead of the dark two-column card (§4.3), its kicker restyled for the light background; the logo strip uses the shared `LogoStrip` look (88/40 px padding, 19 px text instead of 72/64 px and 17 px muted). Show both to the designer.
- **Expired-state copy** (`hero.expired`, `deadlines.h2Expired`, `calculator.switchLabelExpired`, the step's `timingExpired`, `finalCta.titleExpired`) are placeholders, marked `data-placeholder` in dev (open question 3).
- **Tests:** `deadline.test.ts`, `calculator.test.ts`, `e2e/upgrade-now.e2e.ts` (SEO, 375 px overflow, the four clock scenarios incl. crossing the deadline, calculator, CTAs, signup, no-JS). The signup test that stores a lead needs the local Postgres (`127.0.0.1:54322`); it wasn't running on 2026-10-07, so that test (and the 4 lead tests of `messdienstanbieter.e2e.ts`) failed with `ECONNREFUSED`. Everything else passed.

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Route skeleton (so the footer link resolves), content module, SEO, sitemap, header banner | S |
| 2 | [02-sections.md](02-sections.md) | The 11 sections with static markup, CSS ported from the design; reuse of the shared sections | M |
| 3 | [03-deadline-and-interactions.md](03-deadline-and-interactions.md) | The deadline clock (time zone, SSR/hydration, after-deadline state), countdown, year band, calendar, count-ups, risk calculator with confetti | L |
| 4 | [04-cta-and-signup.md](04-cta-and-signup.md) | CTA targets and the signup form with its own lead source | S |
| 5 | [05-qa-and-go-live.md](05-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | S |

Phase 1 goes first and on its own: until the route exists, the footer link 404s and the `messdienstanbieter` e2e check "internal links resolve" fails. Phases 2 and 3 can overlap (3 needs the markup of 2); phase 4 is small and can come any time after 2.

## Target structure

```
src/routes/(landing-page)/upgrade-now/
├── +page.server.ts        # load: seo, landing chrome, `now`, the signup form; the form action
└── +page.svelte           # composes the sections

src/lib/landing/
├── sections/
│   ├── LogoStrip.svelte  Faq.svelte  FinalCta.svelte      # shared, small prop additions (phase 2)
│   ├── Testimonials.svelte(new)                         # 3 verified-customer cards (also used by region/References)
│   └── Trust.svelte(moved from region/)                 # partner logos, now used by two page families
├── data/
│   ├── logos.ts
│   └── testimonials.ts(new)                             # the quotes, shared with region/References
└── pages/upgrade-now/
    ├── content.ts                                       # all copy: hero, deadlines, cards, steps, bento, FAQ, final CTA
    ├── deadline.ts  deadline.test.ts                    # pure date logic (Europe/Berlin), no DOM
    ├── calculator.ts  calculator.test.ts                # the risk formula and slider stops
    └── sections/
        ├── Hero.svelte  Countdown.svelte  YearBand.svelte
        ├── LogoStrip.svelte*
        ├── Deadlines.svelte                             # "Vier Fristen" timeline
        ├── Consequences.svelte                          # the 3 % / 12× / +15 % cards and the WEG note
        ├── RiskCalculator.svelte                        # #risiko
        ├── TimeWindow.svelte  MonthCalendar.svelte  Steps.svelte
        ├── WhyHeidi.svelte                              # bento with the radio-wave visual
        ├── Testimonials.svelte*
        ├── Faq.svelte*
        ├── FinalCta.svelte*
        └── Trust.svelte*
```

`*` = a thin wrapper around the shared section, the same rule as the other landing pages: `+page.svelte` imports only from its own `sections/` folder.

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/upgrade-now`, as requested, as `ROUTE_UPGRADE_NOW` in `$lib/routes.ts` (already added). See open question 1 |
| Header | The shared `LandingHeader` with the site nav, as on the other landing pages. The design's banner text is the same as `DEFAULT_CHROME`, but its "Mehr erfahren" link goes to `#risiko`: add an optional `bannerHref` to `LandingChrome` (default `#faq`) |
| Footer | The shared `LandingFooter` (done: "Produkt" → "Jetzt noch umrüsten"; "Geräte", "Standorte", "Rechtliches" removed). The design's own footer columns (Plattform, Partner, Ressourcen …) are not ported, the same decision as for the design nav |
| Styling | The design's `um-*` CSS goes into the sections' scoped `<style>` blocks; tokens from `tokens.css` (same `:root`). The design's breakpoints stay as they are (1240/1180/1100/1080/1040/980/760/700/640/560/520) |
| Reuse | LogoStrip, Faq, FinalCta, Trust, the testimonial cards and `confetti.ts` exist already with the same design CSS (`.dm-*`, `tm-*`, `trust`). They get small prop additions instead of copies (phase 2) |
| Dates | All date logic in one pure module, `deadline.ts`, computed in **Europe/Berlin** (the server runs in UTC, the design uses the browser's local time). The deadline is `2027-01-01T00:00:00+01:00`. SSR renders the state at the request time passed from `load`, the browser takes over on mount (phase 3) |
| After the deadline | The page switches to an "expired" state instead of counting to zero forever (phase 3.2). The copy for it needs the content owner (open question 3) |
| Interactivity | Runes, the existing attachments (`inView`, `countUp`) and `tweenNumber`/`prefersReducedMotion` from `motion.ts`. Without JS the page shows the server-rendered numbers and a working calculator default; nothing important is client-only |
| Form | The shared `SignupForm` with the `switchInquiry` schema and `handleSwitchSignup`, lead `source = "upgrade-now"`, in the final CTA. All "Umrüstung anfragen" / "Bestand prüfen" CTAs lead there (phase 4, open question 2) |
| Legal copy | Every legal statement (dates, §§, 3 %, 15 %, WEG note, FAQ) is signed off by someone who checks it against the HeizkostenV before go-live. Until then it's imported as designed |
| Rendering | SSR with the `(landing-page)` cache header (`s-maxage=60, stale-while-revalidate=600`), not prerendered. A cached page can be up to ~11 minutes old; the client clock corrects every number on mount |

## Open questions (the default is built unless answered)

1. **Slug.** `/upgrade-now` is English on a German site, and the search terms are German ("Umrüstpflicht", "fernablesbar 2026"). *Default: `/upgrade-now` as requested. A German slug (`/jetzt-umruesten`, `/umruestpflicht`) costs one constant now and a redirect later; decide before go-live, not after.*
2. **Where the CTAs go.** The design has no form: "Umrüstung anfragen" and "Kürzung vermeiden" link to a "Demo buchen" design, "Bestand prüfen" to the hero (`#start`), which has no form. *Default: the final CTA section gets the shared signup form (button "Umrüstung anfragen"), every CTA scrolls there and focuses the email field. If a booking URL exists by then, `DEMO_HREF` switches the demo CTAs.*
3. **After 31.12.2026.** The design only swaps one hero line ("Die Frist ist abgelaufen. … Umrüsten lohnt sich trotzdem sofort.") and would show "Nur noch null Tage bis zur Umrüstpflicht". *Default: the expired state in §3.2 (new H1, no countdown, no calendar, the timeline marks the deadline as passed, the calculator stays). The content owner writes the H1 and lede; review the whole page in January.*
4. **Lead routing.** *Default: the existing `switchinquiry` Make.com event with `page: "/upgrade-now"`, so sales can branch on it. A separate event (e.g. `upgradeinquiry`) needs a new Make.com scenario.*
5. **Discoverability.** The footer link is the only way in. *Default: that's all for now. Candidates once the page is live: the landing banner on the other pages ("Ab 1.1.2027 … fernablesbar sein") could link here instead of `#faq`, and a site blog post about the Heizkostenverordnung.*
6. **Testimonial wording.** The design shows three quotes (Werne, Vitolus, Gerhard) with the same wording as the city pages' references. *Default: one shared data module; the content owner's sign-off for the references (already in the city gate) covers this page too.*

## Risks

- **Short shelf life.** If the cutover slips past December, the page never goes live in its main form. Mitigation: build it now, keep the expired state ready, and decide in December whether it's still worth launching.
- **Legal claims.** The page states legal consequences (§ 12 Abs. 1, § 6a, § 5 Abs. 3 HeizkostenV) and does arithmetic with them. A wrong claim is a liability. Mitigation: legal sign-off in the gate, the design's "Keine Rechtsberatung" notes stay.
- **Time-dependent rendering.** Countdown, calendar and year band depend on "now" and the time zone. Done naively (local `new Date()` in components), they cause hydration mismatches and off-by-one days around midnight. Mitigation: one pure, tested module and a single `now` passed from `load` (phase 3).
- **Unconfirmed KPIs.** "92 % der Montagen beim ersten Termin", "14 Tage vorher", "1–2 Stunden", "Installation kostenlos" are the same claims as on the city pages and need the same confirmation.

## Out of scope

- The design's nav (Produkt / Lösungen / Kunden / Ressourcen with "bald" pages) and its footer columns.
- The pages the design links to (Portfolio-Checker, Selbstabrechnung, Demo buchen …).
- A/B tests and analytics events.
