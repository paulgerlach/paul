# Page `/karriere` ("Karriere"): plan

The careers page of Heidi Systems. It opens with a dark hero ("Bauen Sie mit uns den Messdienst von morgen.") next to an animated "Ein Tag bei Heidi" feed. Then come four reasons to join, the four areas (Engineering, Operations, Kundenservice, Vertrieb) as switchable panels, the open positions as expandable cards (one job today, Frontend Engineer, plus the open application), the three-step hiring process, an application form, a "Mehr über Heidi erfahren?" card linking to `/ueber-uns`, and the partner cards. It uses the landing design system, so it lives in the `(landing-page)` route group with the landing header and footer, the Geist font and `tokens.css`. Once phase 1 is done, the landing footer's "Karriere" entry (plain text today) and the three career links on `/ueber-uns` (LinkedIn today, via `CAREERS_HREF`) link here.

- **Design reference:** https://claude.ai/artifact/QjHMhzF3c7Mhbuik5Ndzy8 ("Karriere · Heidi"). It's one HTML file, laid out like the "Über uns" design: the shared base CSS (`:root` tokens, `.dm-*` primitives, nav), the "Lösungsseiten" blocks (`#pg-common-css`, prefix `pg-`, including the dark `.pg-hero.ink` and the segmented control `.pg-seg`), the page CSS (`#kr-css`, prefix `kr-`, ~110 lines), the card-style trust block (`#trust-css`), the shared helper script (`#pg-common`: reveal, onShow, seg, confetti) and the page script (`#kr-js`, ~50 lines: feed, areas, role preselection, form). The only embedded images are the 3 partner logos, which the Trust section already has. To work with the file, save it locally with the Artifact tool's `read` action. It isn't in the repo.
- **Previous plans:** the `/ueber-uns` plan used to live in this folder (last version at `7a777e92`). Before it came the `/upgrade-now` plan (`ddde6575`), the `/messdienstanbieter` plan (`be2c1feb`) and the `/messdienstwechsel` plan (`65470139`). Their open go-live gates are in [04-qa-and-go-live.md §4.5–4.8](04-qa-and-go-live.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Route, content module, SEO, the application form's schema and action, the `jobapplication` webhook, switching the career links and the footer entry, the shared segmented control | M |
| 2 | [02-sections.md](02-sections.md) | The 8 sections with static markup and the design's CSS | M |
| 3 | [03-interactions.md](03-interactions.md) | The hero feed, the area switcher, choosing the role from any "bewerben" link, the form's client behaviour and success state, reveal on scroll | M |
| 4 | [04-qa-and-go-live.md](04-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | S |

Phase 1 goes first, in one commit. Once the footer entry and `CAREERS_HREF` point to `/karriere`, the e2e check "internal links resolve" needs the route, and `e2e/ueber-uns.e2e.ts` checks the career links. Phases 2 and 3 can overlap, since phase 3 only needs phase 2's markup.

## Target structure

```
src/routes/(landing-page)/karriere/
├── +page.server.ts        # load: seo, landing chrome, the application form; the form action
└── +page.svelte           # sets the application context, composes the sections

src/lib/forms/
└── application.ts  application.test.ts         # zod schema, German messages, role ids (shared client/server)

src/lib/server/
├── application.ts                               # the action: spam pipeline → jobapplication webhook
└── webhooks.ts                                  # + "jobapplication", + a send that reports failure

src/lib/landing/
├── chrome.ts                                    # + ctaHref
├── cta.ts                                       # CAREERS_HREF = ROUTE_KARRIERE, + CAREERS_JOBS_HREF
├── components/
│   ├── Segmented.svelte                         (moved out of upgrade-now/sections/RiskCalculator.svelte)
│   └── icons/StrokeIcon.svelte                  (moved from pages/ueber-uns/components/)
└── pages/karriere/
    ├── content.ts  content.test.ts              # all copy: hero, feed events, reasons, areas, jobs, process, form, more card
    ├── application.svelte.ts                    # Application context: the chosen role, apply(roleId)
    ├── components/ApplyLink.svelte              # <a href="#bewerben"> that preselects a role
    └── sections/
        ├── Hero.svelte                          # dark hero: text + CTAs
        ├── DayFeed.svelte                       # "Ein Tag bei Heidi" ticker (hero right column)
        ├── Reasons.svelte                       # "Warum Heidi": 4 cards, first dark
        ├── Areas.svelte                         # segmented control + area panel
        ├── Jobs.svelte                          # id="stellen", <details> per job + open application
        ├── Process.svelte                       # 3 steps
        ├── Apply.svelte                         # id="bewerben": text column + ApplicationForm
        ├── ApplicationForm.svelte               # the form, errors, success overlay
        ├── MoreAbout.svelte                     # dark "Mehr über Heidi erfahren?" card → /ueber-uns
        └── Trust.svelte*                        # TrustCards with "Mehr über Heidi" → /ueber-uns
```

`*` marks a thin wrapper around the shared section, following the rule of the other landing pages: `+page.svelte` imports only from its own `sections/` folder.

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/karriere` as `ROUTE_KARRIERE` in `$lib/routes.ts` (German, matches the footer label) |
| Route group | `(landing-page)`, outside `[[preview=preview]]`, because the design is a landing design and there's no Prismic content |
| Header | The shared `LandingHeader` with `DEFAULT_CHROME`'s banner. The design's nav CTA "Bestand prüfen" → `#start` lands on the careers hero, which is useless for a customer, so `LandingChrome` gets an optional `ctaHref` and this page sends the CTA to `ROUTE_MESSDIENSTWECHSEL` (its hero form is `#start` there). The hero gets no `id="start"` (open question 6) |
| Footer | The shared `LandingFooter`. `companyLinks` "Karriere" gets `href: ROUTE_KARRIERE` |
| Career links | `CAREERS_HREF` becomes `ROUTE_KARRIERE`, which switches `/ueber-uns`'s "Karriere bei Heidi" and "Zur Karriereseite". "Offene Stellen" gets the new `CAREERS_JOBS_HREF` (`/karriere#stellen`). They're internal now, so the `target="_blank" rel="noopener"` added for LinkedIn goes |
| Styling | The `kr-*` and `pg-*` CSS goes into the sections' scoped `<style>` blocks, with tokens from `tokens.css`. The design's breakpoints stay: 1040, 760 and 640 for the page, 1040 for the hero grid from `#pg-common-css`, and 820 for the trust cards |
| Reuse | `SectionHead`, `ArrowLink` (`inv` on the dark hero and card, `ink` elsewhere), `TrustCards` with `more`, `confetti.ts`, the `reveal`/`inView` attachments, `icons/Check.svelte`. The segmented control is the second use of `/upgrade-now`'s `.seg`, so it moves to `$lib/landing/components/Segmented.svelte` instead of being copied (phase 1.6) |
| Jobs | Jobs live in `content.ts` (`jobs[]` plus the fixed open application), and every count and option is derived from that list: the area panel's "1 offene Stelle · ansehen", the form's `<select>`, and the server's allowed role ids. Opening or closing a position is a one-file change. No Prismic custom type before the cutover, because the repo is shared with Next (open question 5) |
| Application form | A SvelteKit form action with superforms + zod (`$lib/forms/application.ts`) that works without JS. Fields as designed: role, name, email, optional link, a few sentences. The spam pipeline matches the other forms: honeypot → timing → zod → gibberish (name, message) → rate limit, and a bot gets a silent success |
| Where applications go | A new Make.com event `jobapplication` on `MAKE_WEBHOOK_UNIFIED` (role id and title, name, email, link, message, page), which Make forwards to the hiring inbox. **Nothing is stored in our database**: applicants aren't leads, and not keeping the data means no retention rules on our side. Unlike the lead webhooks, a failed send isn't swallowed: the visitor sees an error with a fallback address (open question 2) |
| Privacy | A short notice under the submit button links to `ROUTE_DATENSCHUTZHINWEISE`. There's no consent checkbox, because processing an application doesn't rest on consent. The wording and an applicant section in the privacy notice are a gate item (§4.4, open question 3). Server logs never contain the name, link or message, and the `jobapplication` log line leaves out the email too |
| Role choice | Every "bewerben" link (job cards, area panel, hero "Initiativ bewerben") is an `ApplyLink`: a plain `#bewerben` anchor that, with JS, also sets the role in the page's `Application` context, smooth-scrolls and focuses the name field. The `<select>` binds to that context. Without JS, the anchor just scrolls and the select keeps its default (the first job) |
| No JS | Everything renders its final state on the server: the feed's first 4 events, Engineering's area panel, the job cards (native `<details>`, collapsed), and the form. The form posts and comes back with errors or the success state. Only the area switcher needs JS |
| Hero feed | Decorative, labelled "Beispiel". It adds an event every 2.6 s, but only while it's in view and the tab is visible. It has a pause button (auto-updating content, WCAG 2.2.2), and there's no ticker and no blinking dot with reduced motion. It isn't `aria-live` |
| Indexing | `noindex` + self-canonical and out of the sitemap until the go-live gate (§4.4), like the other new landing pages. `JobPosting` structured data is left out until jobs have the fields Google requires (open question 5) |
| Rendering | SSR with the `(landing-page)` cache header. The page could be prerendered, but the form action and the CDN cache make that pointless; it follows the other landing pages |

## Open questions (the default is built unless answered)

1. **Slug.** *Default: `/karriere`.* `/jobs` is the alternative. Decide before go-live.
2. **Application routing.** *Default: the Make.com `jobapplication` event, forwarded to a hiring inbox.* Business has to name that inbox and the fallback address shown on errors (`jobs@heidisystems.com` is a placeholder in `content.ts`, marked `data-placeholder` in dev). If an applicant tracking system (Personio, Join …) is planned, its postings replace the form and the job cards link out, and the plan's form work shrinks to a link per job.
3. **Privacy notice.** *Default: an information line under the button (draft: "Wie wir mit Ihren Daten umgehen, lesen Sie in den Datenschutzhinweisen."), with the final text from legal. Not a consent line.* The privacy notice needs an applicant section (purpose, retention, Make.com as processor) before go-live.
4. **CV upload.** *Default: none*, as designed ("Link zu LinkedIn, GitHub oder Portfolio genügt"). A file upload would mean storing files and a different retention story; only add it if hiring asks.
5. **Managing jobs.** *Default: `content.ts`.* After the cutover, a Prismic `job` custom type (or an ATS feed) would let non-developers post jobs; then `JobPosting` JSON-LD (`datePosted`, `validThrough`, `employmentType`, `hiringOrganization`, `jobLocation`) can come with it.
6. **Header CTA.** *Default: "Bestand prüfen" → `/messdienstwechsel`.* Alternatives: hide the CTA on this page, or replace it with "Offene Stellen" → `#stellen` (a `ctaLabel` change, since `ctaHref` exists after phase 1).
7. **Discoverability.** *Default: the landing footer and `/ueber-uns` link here.* After the cutover, the site footer could link here too (a deliberate deviation from Next, to be listed in `scripts/layout-diff.ts`).

## Risks

- **Personal data.** Applications carry names, emails, links and free text. Mitigation: no storage on our side, no PII in logs, the Make.com scenario as the only processor (it needs a data processing agreement, which is part of the gate), and HTTPS only.
- **Stale postings.** A closed position that's still listed costs applicants and reputation. Mitigation: an owner for the job list is named in the gate, and the job count isn't written anywhere else (it's derived).
- **Lost applications.** `sendWebhookEvent` swallows errors by design. Mitigation: the strict send of phase 1.4, an error with the fallback address, an e2e test against a failing sink, and a manual end-to-end test into the real inbox before go-live.
- **Unconfirmed claims.** "Ein kleines Team in Berlin", "Funkzähler, Montage, Dashboard und Abrechnung gehören bei uns zusammen", the feed's examples ("Funkzähler in 24 Wohnungen installiert", "Monatlich an alle Mieter") and the three process steps describe the company. They're in the gate (§4.4).
- **Spam.** It's a public form with a free-text field. Mitigation: the shared pipeline, with its own rate-limit key (`apply:<ip>`, 3 per 10 minutes).

## Out of scope

- The design's nav (Produkt / Lösungen / Kunden / Ressourcen with "bald" pages).
- A CV upload, an applicant confirmation email (Make.com can send one), job detail pages per position, and `JobPosting` JSON-LD (open question 5).
- Team photos, benefits, salary ranges (not in the design).
