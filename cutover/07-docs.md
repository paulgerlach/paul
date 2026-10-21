# Phase 7: docs

The repo's docs describe two sites side by side. After this work there's one.

## `CLAUDE.md`

- [ ] Intro and "Current state": the site is the landing pages plus the blog, the Fragebogen and the legal pages, all in `(base)` with the landing header and footer; `/` redirects to `/messdienstanbieter` (307), `/preise` / `/geraete` / `/kontakt` 301 (`$lib/server/redirects.ts`, `hooks.server.ts`). Add a dated bullet ("Site cutover (2026-10-…)") naming the commit of this plan (the commit that deletes `cutover/`, see below).
- [ ] Every page paragraph that says "noindex and out of the sitemap until the cutover": keep the meaning, add once (in the indexing bullet) that it's `LAUNCHED` in `$lib/landing/launch.ts` now, not per page.
- [ ] Paragraphs that mention removed things: the `/funktionen` bullet ("replaced the ported `(base)/funktionen` page (its old-only components … stay until go-live)") → they're deleted; "`/kitchen-sink` renders every shared component" → removed, `KITCHEN_SINK=1` only raises e2e rate limits; the porting/parity rules (visual run, `layout-diff.ts`, `VISUAL_PAGES` exclusions, 375 / 768 / 992 / 1200 / 1640 widths) → only copy parity of the kept pages remains; "Shared header/footer link data lives in modules (`Header/navGroups.ts`, `Footer/footerLinks.ts`)" → `$lib/landing/navLinks.ts`, `$lib/landing/footerLinks.ts`, `$lib/company.ts`; the "landing footer … exceptions" sentence collapses (there's only one footer).
- [ ] Layout section: the new route tree (`(base)/+layout*`, `(landing)/`, `(site)/` with `[[preview=preview]]/blog`), `$lib/components/` with what remains, `$lib/company.ts`, `$lib/server/redirects.ts`, `$lib/landing/launch.ts`.
- [ ] Conventions: "SEO: New public pages go into `sitemap.xml`" → into `SITE_PAGES` (the test enforces it); "Caching: the `(base)` and `(landing-page)` layouts set cache-control" → the `(base)` layout; "Pages without Prismic content live outside `[[preview=preview]]`" stays true; landing styling note: the `(site)` pages' content sits outside `.lp`, the header/footer in `display: contents` wrappers.
- [ ] "Building a new landing page" (`ongoing-tasks/README.md` and wherever `CLAUDE.md` repeats it): routes go into `src/routes/(base)/(landing)/`, add to `SITE_PAGES`, no `VISUAL_PAGES` step.

## `ongoing-tasks/`

- [ ] `cutover.md` §1/§2: drop the manual QA items that only concerned removed pages (Swipers other than the legal pages' reviews, the home's Lottie/videos, the contact form); add "the site restructure (`cutover/`, done)". §3 step 5 becomes "set `LAUNCHED = true` in `$lib/landing/launch.ts`" (plus the per-city flags if 4.1 kept them). Step 6: no `layout-diff.ts` / visual run; the smoke run and the redirect checks. §3 step 7: add the redirect checks of [08-qa.md](08-qa.md) to the post-deploy checks; remove "contact" from "Each site form submits once on prod". §5: add the follow-ups this work found (404 page with the landing chrome, Prismic posts that link dropped URLs, the Funkzähler and Kontakt pages as redirect targets once built, `/api/contact`).
- [ ] `known-issues.md`: KI-07, KI-29, KI-34 notes (phase 4.5, 6.1); KIs whose page is gone: mark "page removed in the site cutover", don't delete them (the code may still cite IDs; grep `KI-` in `src/`).
- [ ] `go-live-gates.md`: gates that list "CTA targets" pointing at `/kontakt`, `/preise`, `/geraete`: update to the new targets.
- [ ] `README.md`: the decisions table gains the site cutover decisions from [README.md](README.md#decisions-made-with-the-user-2026-10-21).

## Finish

- [ ] Delete this folder (`git rm -r cutover`) in the last commit, "Record the site cutover", and name that commit's parent in `CLAUDE.md` as where the plan lives in git history (the repo's convention for finished plans).
