# Cutover: Next.js → SvelteKit

What is left before the SvelteKit app replaces the Next deployment in production. The full migration plan (phases 0–10, the inventory, the React → Svelte cheat sheet, the QA results) is in git history at `6138407c` (`svelte-migration-plan/`).

## 1. State

- The SvelteKit app is built and lives at the repo root on `feat/migration` (PR #440, open); `main` still holds the Next app until #440 merges. Production is the Next deployment.
- Automated QA on the Vercel preview passed (2026-10-03): all 246 sitemap URLs 200, unknown pages and posts 404, CDN caching works, `<head>` tags equal to the local build, smoke suite 11/11, Lighthouse at or above Next on most pages. Layout diff against production Next: 34/50 exact, the other 16 explained (the deliberate fixes in the `scripts/layout-diff.ts` header, Next still loading at capture time, `InstallFaq`'s autoplay at 375 px).
- The new landing pages have no Next baseline: they're out of the visual parity loop (`VISUAL_PAGES` in `e2e/parity/pages.ts`) and the only allowed additions in the SEO diff. `/funktionen` is a new design, not a port: out of the visual loop and `layout-diff.ts`; its title, description and content differ on purpose. Every new page must be in that exclusion list.

## 2. Blocking the cutover

- [ ] Every go-live gate in [go-live-gates.md](go-live-gates.md) (§4.4–4.41), including the `/messdienstwechsel` and city pages' gates
- [ ] Every item in [known-issues.md](known-issues.md) ticked: **KI-34** (placeholder phone `+49-30-555-12345` in the home JSON-LD, the Impressum lists `+49 30 52001352`; needs business confirmation, then set it in `$lib/components/Home/structuredData.ts`; the region pages' `ServiceJsonLd` leaves the phone out until then) and **KI-36** (copy typos ported verbatim; needs the content owner's sign-off)
- [ ] The Fragebogen defaults (`questionnaireDefaults` in `$lib/fragebogen/schema.ts`, copied from what Next actually submitted) confirmed by the business owner
- [ ] Manual QA:
  - [ ] Safari iOS, Chrome Android, desktop Chrome/Firefox/Safari
  - [ ] Swipers: touch swipe, autoplay, pagination dots, arrows
  - [ ] Lottie animations start when scrolled into view
  - [ ] Review videos play
  - [ ] Prismic preview from the dashboard
  - [ ] Slack chat against the real workspace (staging channel)
  - [ ] Make.com scenarios receive contactform / newsletter / newinquiry events
  - [ ] A leads row appears in Postgres

Not blocking, still open from the migration: a Playwright test of the Slack chat with a mocked clock (polling, the 5-minute timeout; verified by hand only).

## 3. Cutover steps

1. **Freeze** content-structure changes in Prismic (slice models) for the cutover window. Slice Machine models aren't pushed before then: the Prismic repo is shared with the live Next site.
2. ~~Promote the Svelte app to the repo root~~ (done in `bd0bf304`; Next code, `components.json` and the React agent skills removed, KI-26/27).
3. **Vercel project settings:** framework preset → SvelteKit, root directory → `/`, output auto-detected. Copy env vars and set `PUBLIC_PRISMIC_ENVIRONMENT` next to `NEXT_PUBLIC_PRISMIC_ENVIRONMENT` (keep both for the first week, see Rollback). AI Gateway access enabled.
4. **Prismic dashboard:** preview URL → `https://heidisystems.com/api/preview`. Remove the revalidate webhook (there's no revalidate endpoint; pages are SSR with `s-maxage=60, stale-while-revalidate=600`). Push the slice models from the Svelte Slice Machine.
5. **New landing pages:** remove `noindex`, add every page to `src/routes/sitemap.xml/+server.ts`, set every city `live: true` (the last item of each gate).
6. **Deploy to a preview URL,** rerun the full Playwright suite and the parity checks against production Next (`bunx playwright test -c playwright.parity.config.ts`, `scripts/layout-diff.ts`), then promote to production.
7. **Post-deploy checks (first hour):**
   - Search Console shows no spike in 404s or coverage errors; Vercel logs are free of 5xx.
   - Each site form submits once on prod (contact, newsletter, Fragebogen); the chat works.
   - Signups: a signup on `/messdienstwechsel` and on every landing page with the signup form creates a `leads` row with the page's `source` (the city pages: `messdienstanbieter-<slug>`, and the webhook carries `city`) and its `switchinquiry` webhook reaches Make.com with the page's `page`.
   - The other Make.com routes arrive with their owners: `jobapplication` (`/karriere`, hiring inbox), `helpfeedback` (`/hilfe`, feedback sheet), `partnerinquiry` (`/installationspartner`), `softwarepartnerinquiry` (`/softwarepartner`), `successioninquiry` (`/nachfolge`, confidential), `partnershipinquiry` and `connectioninquiry` (`/partnerschaften`).

## 4. Rollback

The last Next deployment stays in Vercel's deployment history; rollback is "Promote to Production" on it, which takes seconds. During the first week keep env var names backward-compatible (both `NEXT_PUBLIC_PRISMIC_ENVIRONMENT` and `PUBLIC_PRISMIC_ENVIRONMENT`) and don't change the Prismic preview URL path, so a rollback needs no config change.

## 5. After cutover

- Delete the second Vercel project created for the migration preview (phase 1).
- Remove `/api/contact` once the form action fully replaces it and nothing external uses it.
- Upgrade Swiper past 11 (pinned because ~100 rules in `app.css` target Swiper 11 markup).
- `/funktionen`: delete the old-only components (`Funktionen/*`, `Hero/FunktionenHero`) kept so its route commit could be reverted; give it Svelte-generated visual snapshots once its design is signed off; re-measure its Lighthouse score.
- Revisit Kit 3 once `@prismicio/svelte`, `sveltekit-superforms` and `@slicemachine/adapter-sveltekit` support it.
- The follow-ups the gates list "for after the cutover" (e.g. `/hilfe`'s Prismic type, `/ueber-uns` in the site header/footer, a booking URL for `DEMO_HREF`).
