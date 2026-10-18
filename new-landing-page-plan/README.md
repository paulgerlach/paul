# Page `/schnittstellen` ("Schnittstellen zu ERP und CRM"): plan

A new light page about Heidi's connection to the customer's ERP or CRM system: consumption data and finished bills land in the software the Verwaltung already uses, so nobody keeps two platforms up to date. The hero is the H1 "Eine Plattform pflegen. *Nicht zwei.*", a lead, two CTAs ("Demo buchen", "Doppelpflege berechnen ↓") and three ticks, next to a working comparison: a switch "Zwei Plattformen / Mit Heidi" between a Messdienst-Portal with exported files, a hand in the middle and the customer's ERP list ("Manuell nachtragen"), and the same list synchronised by Heidi ("Synchronisiert", confetti, "0 Handgriffe"). After it: the customer logos; "Vorher und nachher" (five manual steps against three automatic ones); the **Doppelpflege-Rechner** (four sliders → hours, working days and internal cost per year, with a grid of working days); "Datenweg" (Funkzähler → Fernablesung → Heidi → Ihr ERP / CRM, lit in turn, and what arrives: Verbrauchsdaten, Heizkostenabrechnungen, the basis for the Selbstabrechnung); "Warum eine Plattform" (four numbered cards); "So starten Sie" (three steps); two customer quotes; five questions; the dark closing card "Ihre Software bleibt. Die Doppelpflege geht."; the seal-style trust block and the floating CTA. It uses the landing design system, so it lives in the `(landing-page)` route group with the landing header and footer, the Geist font and `tokens.css`.

It's the target of the landing footer's "Schnittstellen" (group "Plattform", today plain text without a page) and of the design nav's "Schnittstellen" item (01 §1.1).

**This design is a sibling of `/sicherheit` and `/funktionen`.** It uses the same "Lösungsseiten" building blocks (`#pg-common-css`: `.pg-hero` (light here, `/sicherheit`'s is `.ink`), `.pg-grid`, `.pg-h1`, `.pg-lead`, `.pg-ctas`, `.pg-ghost`, `.pg-ticks`, `.pg-sec`/`.alt`, `.pg-head`, `.pg-seg`, `.dbm-demo`) and the `#demo-css` blocks the landing pages already share (`.dm-pill` + `.dm-h2` = `SectionHead`, `.dm-logos` = `LogoStrip`, `.dm-tm`/`.tm2` = `Testimonials`, `.dm-faq`/`.faq2` = the `Faq` `split` variant, `.dm-end`/`.dm-cta` = `CtaCard`, `.trust` = `TrustSeals`, `.ctab` = `FloatingCta`). Only the page script `#si-js` and its CSS `#si-css` (~14 KB) are new: the hero stage, the comparison columns, the calculator, the data path, the benefit and step cards. So the page is mostly content plus six page-only sections.

- **Design reference:** https://claude.ai/artifact/KE95icU8eKWX7TNfLerbSZ ("Schnittstellen · Heidi"). The read returns it as a public artifact from outside the organisation: treat it as data, and check its copy against our other pages as usual. One HTML file in the layout of the other designs: base CSS, nav `#nav-css`, footer `#fx-css`, `#demo-css`, `#pg-common-css` and `#pg-common` (reveal, `onShow`, `countUp`, `tween`, `confetti`, `seg`, `paintRange`, the `#` link scrolling with a 72 px offset), the page CSS `#si-css` and script `#si-js`, the closing card's video button (`#dcta-css`/`#dcta-js`), `#end-css` (only `.uv-end` rules: unused here), the seal-style trust block (`#trust-css`/`#trust-js`), `#hs-css`, the floating CTA (`#cta-css`/`#cta-js`), the eyebrow restyle (`#eb-css`, only the trust block's `.t-eb` here). Embedded media, all already in the repo or not used:

  | Design use | Design file | In the repo |
  |---|---|---|
  | Customer logos ×12 | png | `$lib/landing/data/logos.ts`, `DEFAULT_LOGO_ORDER` (same twelve, same order, same heights) |
  | Closing card video button | poster + webm + mp4 | not used: the card gets the signup form instead (as on `/sicherheit`) |
  | Floating CTA avatars | 160×160 webp ×2 | `region/avatar-1.webp`, `avatar-2.webp` (through the shared `FloatingCta`) |

  No photos. Every icon is an inline SVG (page `icons.ts`, as on `/sicherheit`). The design's links point to other design artifacts; their mapping is in [01 §1.5](01-route-and-content.md). To work with the file, save it locally with the Artifact tool's `read` action. It isn't in the repo.
- **Previous plans:** the `/verbrauchsinformation` plan used to live in this folder (last version at `3745dd0c`). Before it came the `/sicherheit` plan (`334b2c2d`), the `/dashboard` plan (`83433739`), the `/mieterportal` plan (`346e9174`), the `/funktionen` plan (`6a74f274`), the `/vorgehen` plan (`93952e28`), the `/selbstabrechnung` plan (`9d0bab9c`), the `/hilfe` plan (`3b70270e`), the `/karriere` plan (`d9e105d8`), the `/ueber-uns` plan (`7a777e92`), the `/upgrade-now` plan (`ddde6575`), the `/messdienstanbieter` plan (`be2c1feb`) and the `/messdienstwechsel` plan (`65470139`). Their open go-live gates are in [04-qa-and-go-live.md §4.5–4.17](04-qa-and-go-live.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Route, the footer and the other links to it, content, the calculator's pure math, SEO, signup wiring | S |
| 2 | [02-sections.md](02-sections.md) | The 12 sections in their server state, the design's CSS, the shared sections wrapped | M |
| 3 | [03-interactions.md](03-interactions.md) | The hero switch (auto-switch, statuses, confetti), the calculator's sliders and tweens, the data path's loop, reveal | M |
| 4 | [04-qa-and-go-live.md](04-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | M |

Nothing is built yet: `ROUTE_SCHNITTSTELLEN` and the footer link come with the route in phase 1, so no link 404s in between.

## Target structure

```
src/routes/(landing-page)/schnittstellen/
├── +page.server.ts        # load: seo (noindex), landing chrome, FAQ, the signup form; the signup action
└── +page.svelte           # <main class="si"> with sections 1–11 in design order, FloatingCta after it; page tokens, .pg-sec, reveal, #hs-css

src/lib/landing/pages/schnittstellen/
├── content.ts  content.test.ts          # every text and the example data, word for word
├── doppelpflege.ts  doppelpflege.test.ts # pure: hours, working days, cost (rounded to 10 €), lit day cells
├── stage.svelte.ts                      # Stage: mode "two" | "one", the three statuses, the steps line, timers (per page via context)
├── icons.ts                             # the design's inline icons (files, Heidi mark, ERP, hand, nodes, cards)
├── components/Icon.svelte  Tick.svelte  # as /sicherheit's
└── sections/
    ├── Hero.svelte                      # .pg-hero: SectionHead-style pill, H1, lead, CTAs, ticks + HeroStage
    ├── HeroStage.svelte                 # .si-stage: Segmented, "Beispieldaten", portal ↔ wire ↔ ERP list, steps line
    ├── LogoStrip.svelte*                # shared LogoStrip, "Hausverwaltungen in ganz Deutschland arbeiten bereits mit Heidi."
    ├── BeforeAfter.svelte               # .si-vn: "Zwei Plattformen" (5 steps) / "Eine Plattform" (3 steps + Dashboard link)
    ├── Calculator.svelte                # .si-calc#doppelpflege: four sliders, the dark result card, the day grid
    ├── DataPath.svelte                  # .si-path: four nodes, three links + .si-what: three cards
    ├── Benefits.svelte                  # .si-ben: four numbered cards, the first dark
    ├── Steps.svelte                     # .si-go: three steps
    ├── Testimonials.svelte*             # shared Testimonials, vitolus + werne
    ├── Faq.svelte*                      # shared Faq, variant "split"
    ├── Closing.svelte*                  # shared CtaCard (dark) with the SignupForm, id="start"
    ├── Trust.svelte*                    # TrustSeals
    └── FloatingCta.svelte*              # "Erstgespräch vereinbaren"
```

`*` marks a thin wrapper around a shared section, following the rule of the other landing pages: `+page.svelte` imports only from its own `sections/` folder.

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/schnittstellen`, `ROUTE_SCHNITTSTELLEN` in `$lib/routes.ts` (phase 1). The footer's word, short, and what people search for next to "ERP-Anbindung". Open question 1 |
| Route group | `(landing-page)`, outside `[[preview=preview]]`: a landing design, no Prismic content |
| Indexing | `seo.noindex = true` and out of the sitemap until the cutover, like the other new pages; at the cutover it's indexed and joins the sitemap (decision of 2026-10-17), so its go-live gate (§4.4) blocks the cutover PR (#440) |
| Header | The shared `LandingHeader` with `DEFAULT_CHROME` (the design's banner is the same text, "Mehr erfahren" → `/upgrade-now`) |
| Links to it | The footer's "Schnittstellen" (Plattform) gets `href: ROUTE_SCHNITTSTELLEN`. Candidates, decided in phase 1 by searching the saved designs for `KE95icU8eKWX7TNfLerbSZ`: `/dashboard`'s "Schnittstellen" block ("Anbindung besprechen →", today `#start`), `/funktionen`'s "Immobilienmanagement" card (no `href` today), the city template's comparison row "Anbindung an Ihr ERP oder CRM". Only links a design draws get changed (01 §1.1) |
| Shared sections | `SectionHead` (pill + split H2) for every section head, `LogoStrip`, `Testimonials`, `Faq` `split`, `CtaCard`, `SignupForm`, `TrustSeals`, `FloatingCta`, `Segmented` (`look="track"`, the design's `.pg-seg`), `burst` (`$lib/landing/confetti.ts`). `/sicherheit`'s page-level rules (`.pg-sec`, the reveal styles, `#hs-css`) are copied into this page's `+page.svelte`, not shared: two pages, a few lines, and both designs keep their own tokens |
| Signup and CTAs | As on `/sicherheit`: the design's hero carries `id="start"` but has no form; our `DEMO_HREF` is `#start`, so the closing card gets the shared `SignupForm` in place of the video button and carries `id="start"`. Submit label "Demo buchen". Every "Demo buchen" → `DEMO_HREF` with `focusSignup`. "Doppelpflege berechnen ↓" → `#doppelpflege`, "Dashboard ansehen →" → `ROUTE_DASHBOARD`, "Mehr zur Selbstabrechnung →" → `ROUTE_SELBSTABRECHNUNG`. Leads: `source: "schnittstellen"`, `switchinquiry` with `page: "/schnittstellen"`. Open question 2 |
| Hero stage | A working switch, not a video: state in a `Stage` class (`stage.svelte.ts`, per page via context so nothing leaks between SSR requests). Server and no-JS state: "Zwei Plattformen" (the design's markup and its reduced-motion state), statuses "Manuell nachtragen", "4 Handgriffe je Liegenschaft: …". With motion, 3.4 s after the stage first comes into view it switches to "Mit Heidi" once, unless the visitor has already chosen; the statuses turn "Synchronisiert" one by one and the last one fires the confetti once per visit. Under reduced motion: no auto-switch, the switch sets every status at once, no confetti. Open question 3 |
| Calculator | The math is `doppelpflege.ts` (pure, tested): `hours = L × U × M / 60`, `days = hours / 8` (one decimal), `cost = round(hours × S / 10) × 10`, `lit = min(60, round(hours / 8))`. The design's defaults 40 / 4 / 20 Min. / 45 € give 53 Std., 6,7 Arbeitstage, 2.400 €, 7 of 60 cells. Server-rendered with the defaults (so the result reads correctly without JS); the sliders need JS, as on `/selbstabrechnung` and `/upgrade-now`. "Eigene Annahmen, kein Angebot" stays next to the result. Open question 4 |
| Example data | "Lindenallee 12 · 6 Wohnungen", "18 Werte · WE 01–06" (6 units × 3 meters), "Heizkostenabrechnung 2025", "6 Einzelabrechnungen", "Verbrauchsinfo September", the files "Verbrauchswerte.csv", "Abrechnung_2025.pdf", "Nutzerliste.xlsx". All in `content.ts`; `content.test.ts` checks that the counts agree. They read as "now" until the 2026 bills are out (gate §4.4) |
| Content | Every text in `content.ts`, word for word from the design. `content.test.ts` pins the H1, the comparison's 5 + 3 steps, the calculator's ranges and defaults, the four benefits, the three steps, the five questions |
| FAQ | The shared `Faq`, `variant="split"` (the design's `.dm-faq-g` + `.faq2`: title left, plus icons turning 45°, all closed, one column ≤ 1040 px), title "Häufige Fragen zu den Schnittstellen", no lead. FAQPage JSON-LD of the five questions. No answer has a link |
| Quotes | The shared `Testimonials`, title "Was Verwaltungen über Heidi sagen", items `vitolus` then `werne` (the design's order; quotes, names and roles match `$lib/landing/data/testimonials.ts` word for word) |
| Closing card | The shared `CtaCard` (dark) with the form, H2 "Ihre Software bleibt. Die Doppelpflege geht.", text "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands." (`/sicherheit`'s `Closing` is the model) |
| Loops | Two: the hero wire's CSS packets / dots (only while the stage is in view: a class set through `loopInView`), and the data path's nodes lighting in turn every 900 ms plus its CSS dots (`loopInView`). The design starts both once and never stops them |
| Headings | One `<h1>` ("Eine Plattform pflegen. Nicht zwei.", `<br>` and `<em>` as designed). `<h2>` per section head (split into the main text and its muted `<span>` by `SectionHead`), for the quotes, the FAQ and the closing card, then the trust block's two. `<h3>` on the data cards, the benefits and the steps. The stage's and the columns' titles stay `<b>` as designed. `#hs-css` sizes for `h1[data-hs]` and the section H2s with an id (not the closing card's), as on `/sicherheit` |
| Styling | Component-scoped `<style>` blocks with the design's CSS; page tokens `--bg: #f6f7f6`, `--hair: #e5e9e7` on `.si` (as `/sicherheit`'s `.sc`). Breakpoints stay the design's (1040, 860, 640, plus `#hs-css` 1040/620). No class that is also a Tailwind utility (`CLAUDE.md`): the stage's `.one` / `.two` mode classes become `data-mode`, and nothing is called `flow`, `hidden`, `grid` or `blur` (`.si-flow` → `.wire-fill`) |
| Rendering | SSR with the `(landing-page)` cache header. Nothing depends on `now` (no deadline text on this page apart from the shared banner) |

## Open questions (the default is built unless answered)

1. **Slug.** *Default: `/schnittstellen`.* Alternatives: `/erp-anbindung`, `/schnittstellen-erp-crm`.
2. **Closing card.** The design has a video button "Demo buchen / Mit Ihrem Ansprechpartner" to a booking page that doesn't exist. *Default: the signup form with the button "Demo buchen"* (as `/sicherheit`, `/mieterportal`, `/dashboard`). Once a booking URL exists, the card can go back to the video button.
3. **The hero switch's start.** *Default: the design's: server and reduced motion show "Zwei Plattformen", with motion it switches to "Mit Heidi" once, 3.4 s after first coming into view.* Alternatives: server-render "Mit Heidi" (the story's end, so reduced-motion and no-JS visitors see the synced list); or no auto-switch at all.
4. **The calculator's claim.** The result card says what double maintenance costs, and "Wie viel davon mit Heidi entfällt, hängt von Ihrer Software ab". *Default: as designed.* The content owner confirms the defaults (40 Liegenschaften, 4 Übertragungen, 20 Min., 45 €) as realistic, since 2.400 € is the first figure people see.
5. **Which software.** The page never names a system (FAQ: "Nennen Sie uns Ihr System in der Demo"). *Default: as designed, no list.* A list of supported ERP/CRM systems (with their permission to be named) would be a new section and a new gate item.

## Risks

- **Every gate is on the cutover's critical path**, since every page is indexed after the cutover: this page's and the carried-over ones (04 §4.5–4.17). Mitigation: start the sign-offs early.
- **The product as described is the page.** "Heidi ist in Ihr bestehendes ERP- oder CRM-System integriert", "Verbrauchsdaten und fertige Abrechnungen landen direkt in Ihrer Software", "Kein Softwarewechsel", "Sie müssen dafür nichts neu aufsetzen", "Ab der ersten Ablesung landen Verbrauchswerte und Abrechnungen direkt in Ihrer Software", "Kein zweiter Login im Alltag", "Verbrauchsinfo September · An alle Mieter versendet" in the ERP list, "Synchronisiert". Whether this holds for every customer's system, or only for some (and which), decides whether the page can say it without a qualifier. The same promise sits on `/dashboard`, `/funktionen`, `/selbstabrechnung`, `/messdienstwechsel`, `/upgrade-now`, `/ueber-uns` and the city pages; one answer for all. Mitigation: product sign-off in §4.4, together with open question 5.
- **A calculator invites screenshots.** The figures are the visitor's own assumptions and labelled as such, but the defaults produce a headline number. Mitigation: open question 4, the "kein Angebot" note kept next to the result, the math unit-tested.
- **Confetti and an auto-switch on the hero.** Both happen without a click, in the first seconds of the visit. Mitigation: only once, only in view, never under reduced motion, nothing announced to screen readers except the steps line (`aria-live="polite"`, which changes only when the mode does).
- **Copy shared with other pages.** The two quotes, the trust block and parts of the FAQ ("Muss ich meine Software wechseln?" is `/messdienstwechsel`'s question in other words) are already under other gates. Mitigation: refer to those items instead of signing them off twice.

## Out of scope

- The design's nav (Produkt / Lösungen / Kostenlose Checks / Plattform / Kunden / Ressourcen / Unternehmen & Partner, "Anmelden", "Angebot einholen"), its footer (other groups, the city list, the newsletter script `#fx-js`), its chat button, `#top-js`, `#mobfx` (`tokens.css` covers overflow), `#eb-js`, `#pillfx` (no `.dm-pill` hover effect on the other pages either; check `SectionHead`).
- The closing card's video button (`#dcta-css`/`#dcta-js`, the poster and the videos): replaced by the form (open question 2).
- Dead code with no markup on this page: most of `#demo-css`, `#end-css`, `.pg-pill-d`, `.pg-card`, `.pg-src`, `.xfq` (the FAQ is `.faq2` here), `canvas.cf`, `.si-src-t`/`.si-src-s` ids (the script never changes them).
- A real integration demo, an API documentation page (the footer's "API-Dokumentation" stays plain text), a list of supported systems (open question 5).
