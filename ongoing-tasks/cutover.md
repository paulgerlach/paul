# Cutover: Next.js → SvelteKit

What is left before the SvelteKit app replaces the Next deployment in production. The full migration plan (phases 0–10, the inventory, the React → Svelte cheat sheet, the QA results) is in git history at `6138407c` (`svelte-migration-plan/`).

## 1. State

- The SvelteKit app is built and lives at the repo root on `feat/migration` (PR #440, open); `main` still holds the Next app until #440 merges. Production is the Next deployment.
- Automated QA on the Vercel preview passed (2026-10-03): all 246 sitemap URLs 200, unknown pages and posts 404, CDN caching works, `<head>` tags equal to the local build, smoke suite 11/11, Lighthouse at or above Next on most pages. Layout diff against production Next: 34/50 exact, the other 16 explained (the deliberate fixes in the `scripts/layout-diff.ts` header, Next still loading at capture time, `InstallFaq`'s autoplay at 375 px).
- **Site restructure (done 2026-10-21, plan in git history, see `CLAUDE.md`):** the landing pages are the whole site in `(base)/(landing)`; of the ported Next pages only the blog and the Fragebogen stay, in `(base)/(site)` with the landing header and footer; the legal pages (`/impressum`, `/datenschutzhinweise`, `/agb`) are landing pages built from new designs (gate §1). `/` is the Germany hub since the new URLs (2026-10-23; it was a 307); `/preise`, `/geraete` and `/datenschutzhinweise` 301ed until 2026-10-23 and are pages again (the old `/preise` restored, replaced by its landing design on 2026-10-24 (gate §3), the Funkzähler page and the Datenschutzerklärung moved to the old URLs; `REDIRECTS` is empty); `/kontakt` redirected too until its design was built (2026-10-21, gate §7). The visual parity run and `scripts/layout-diff.ts` are retired (every page's chrome changed); Next stays the baseline only for the copy of the kept pages.

## 2. Blocking the cutover

- [ ] Every go-live gate in [go-live-gates.md](go-live-gates.md) (§1–45), including the `/messdienst-wechseln` and city pages' gates: signed off by the business on 2026-10-23; what that couldn't close is in its "Still open after the business sign-off"
- [x] Every item in [known-issues.md](known-issues.md) ticked: KI-34 (fixed 2026-10-24: +49 30 80098852 in `PHONE` and the JSON-LD); KI-36 (the ported copy typos) went with the old legal pages
- [ ] The Fragebogen defaults (`questionnaireDefaults` in `$lib/fragebogen/schema.ts`, copied from what Next actually submitted) confirmed by the business owner
- [ ] Manual QA:
  - [ ] Safari iOS, Chrome Android, desktop Chrome/Firefox/Safari
  - [ ] The Fragebogen's Lottie animations on its final step
  - [ ] Prismic preview from the dashboard
  - [ ] Slack chat against the real workspace (staging channel)
  - [ ] Make.com scenarios receive newsletter / newinquiry events
  - [ ] A leads row appears in Postgres

Not blocking, still open from the migration: a Playwright test of the Slack chat with a mocked clock (polling, the 5-minute timeout; verified by hand only).

## 3. Cutover steps

1. **Freeze** content-structure changes in Prismic (slice models) for the cutover window. Slice Machine models aren't pushed before then: the Prismic repo is shared with the live Next site.
2. ~~Promote the Svelte app to the repo root~~ (done in `bd0bf304`; Next code, `components.json` and the React agent skills removed, KI-26/27).
3. **Vercel project settings:** framework preset → SvelteKit, root directory → `/`, output auto-detected. Copy env vars and set `PUBLIC_PRISMIC_ENVIRONMENT` next to `NEXT_PUBLIC_PRISMIC_ENVIRONMENT` (keep both for the first week, see Rollback). AI Gateway access enabled.
4. **Prismic dashboard:** preview URL → `https://heidisystems.com/api/preview`. Remove the revalidate webhook (there's no revalidate endpoint; pages are SSR with `s-maxage=60, stale-while-revalidate=600`). Push the slice models from the Svelte Slice Machine.
5. ~~**New landing pages:** set `LAUNCHED = true` in `$lib/landing/launch.ts`~~ (done 2026-10-23, ahead of the cutover, for the SEO review of the preview). It removes every gated page's `noindex`, adds them to the sitemap (`SITE_PAGES`) and makes every city live; the per-city `live` flags can then go.
6. **Deploy to a preview URL,** rerun the full Playwright suite and the smoke run (`BASE_URL=<preview> bunx playwright test -c playwright.parity.config.ts`), check the old URLs (`curl -sI` for `/datenschutzhinweise`, `/preise`, `/geraete?x=1`: 200, no redirect), then promote to production.
7. **Post-deploy checks (first hour):**
   - Search Console shows no spike in 404s or coverage errors; Vercel logs are free of 5xx.
   - `/datenschutzhinweise`, `/preise` and `/geraete` answer 200 on prod as on the preview, `/` answers 200; `/kontakt` answers 200.
   - Each site form submits once on prod (newsletter, Fragebogen); the chat works.
   - Signups: a signup on `/messdienst-wechseln` and on every landing page with the signup form creates a `leads` row with the page's `source` (the city pages: `messdienstanbieter-<slug>`, and the webhook carries `city`) and its `switchinquiry` webhook reaches Make.com with the page's `page`.
   - The other Make.com routes arrive with their owners: `jobapplication` (`/karriere`, hiring inbox), `helpfeedback` (`/hilfe`, feedback sheet), `partnerinquiry` (`/partner/installationspartner`), `softwarepartnerinquiry` (`/partner/softwarepartner`), `successioninquiry` (`/partner/nachfolge`, confidential), `partnershipinquiry` and `connectioninquiry` (`/partner`), `contactinquiry` (`/kontakt`, per topic to the vertrieb, info or presse mailbox; send one real test message per mailbox), `selfserviceoffer` (`/self-service`, both stages, to sales, who send the offer PDF).

## 4. Rollback

The last Next deployment stays in Vercel's deployment history; rollback is "Promote to Production" on it, which takes seconds. During the first week keep env var names backward-compatible (both `NEXT_PUBLIC_PRISMIC_ENVIRONMENT` and `PUBLIC_PRISMIC_ENVIRONMENT`) and don't change the Prismic preview URL path, so a rollback needs no config change.

## 5. After cutover

- Delete the second Vercel project created for the migration preview (phase 1).
- Remove `/api/contact` once the form action fully replaces it and nothing external uses it.
- `/funktionen`: re-measure its Lighthouse score.
- The 404 page (`src/routes/+error.svelte`) still renders without the landing header and footer; give it the landing chrome.
- Revisit Kit 3 once `@prismicio/svelte`, `sveltekit-superforms` and `@slicemachine/adapter-sveltekit` support it.
- Prismic content (for the content owner; found 2026-10-21): 21 blog posts link the old home as an absolute URL (`https://heidisystems.com/` or `https://www.heidisystems.com/`), which now is the Germany hub `/`: abrechnungsdienstleister, abrechnungsdienstleister-heidi-systems, api-schnittstelle-hausverwaltung, betriebskostenabrechnung, betriebskostenabrechnung-frist, funkzaehler, funkzaehler-pflicht, funkzaehler-wasser, hausverwaltung-berlin, hausverwaltung-in-der-naehe, heidi-systems-funkablesung, heizkostenabrechnung-firma, heizkostenabrechnung-formel, heizkostenabrechnung-pruefen, heizkostenverteiler, kosten-hausverwaltung, messdienstanbieter-heidi-systems, miete-rauchwarnmelder-umlagefaehig, weg-hausverwaltung-kosten, weg-hausverwaltung-software, zaehlerwechsel. `/blog/funkzaehler-pflicht` also links `https://www.heidisystems.com/geraete` (the Funkzähler page). Repoint them in Prismic to the page each means.
- The follow-ups the gates list "for after the cutover" (e.g. `/hilfe`'s Prismic type, a booking URL for `DEMO_HREF`).
