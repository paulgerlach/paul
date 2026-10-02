# Phase 10: QA & Cutover

## 10.1 Automated parity checks

**Playwright smoke suite** (`web/tests/`), run against both apps through a `BASE_URL` env var:
- Every sitemap URL returns 200 and has a non-empty `<h1>`/`<main>`. There are no console errors and no hydration warnings.
- Unknown URL → 404 page. `/blog/does-not-exist` → 404.
- Navigation: header links, mobile menu (375px), footer links.
- Forms: contact (valid, invalid, honeypot), newsletter, Fragebogen (both flows), with network requests intercepted and payloads asserted.
- Chat: open the widget, send an AI message (mock `/api/chat` with a fixture stream), and run the Slack flow with mocked endpoints.

**Visual regression:**
```ts
for (const path of SITEMAP) for (const width of [375, 768, 992, 1200, 1640]) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(BASE_URL + path); await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot(`${slug(path)}-${width}.png`, { fullPage: true, maxDiffPixelRatio: 0.01, animations: 'disabled', mask: [page.locator('.swiper, [data-lottie], video')] });
}
```
Generate the baseline screenshots from the **Next** app (`BASE_URL=http://localhost:3000 --update-snapshots`), then run against Svelte. **Exclude `/messdienstwechsel`** from this loop: Next has no such page, so there's no baseline. It gets its own Svelte-generated snapshots once the design is signed off.

**SEO diff:** re-run the phase 2.6 head-snapshot script against Svelte and `diff -r seo-baseline seo-svelte`. The only allowed differences are the deliberate fixes (robots path, blog titles, verification tag) and the new `/messdienstwechsel` page, which isn't in `seo-baseline/`.

**Unit tests (vitest):** `isGibberish`, rate limiter, `formatDate`, `isWithinBusinessHours`, `Questionnaire` class (flow branching, step bounds, increment/decrement floors).

## 10.2 Manual QA checklist
- [ ] Safari iOS, Chrome Android, desktop Chrome/Firefox/Safari
- [ ] Swipers: touch swipe, autoplay, pagination dots, arrows
- [ ] Lottie animations start when scrolled into view
- [ ] Review videos play
- [ ] Prismic preview from the dashboard
- [ ] Slack chat against the real workspace (staging channel)
- [ ] Make.com scenarios receive contactform / newsletter / newinquiry events
- [ ] Leads row appears in Postgres

## 10.3 Performance budget
Run Lighthouse (mobile) on `/`, `/funktionen`, `/blog`, `/blog/<post>`, `/fragebogen` for both apps. Targets:
- Performance and SEO ≥ the Next scores. CLS ≤ 0.05. LCP not worse.
- Total JS on `/` lower than Next. Expect a large drop, since React, React Query and Zustand runtimes go away.

## 10.4 Cutover

1. **Freeze** content-structure changes in Prismic (slice models) for the cutover window.
2. **Promote** in a single PR on a `feat/sveltekit` branch:
   ```bash
   git rm -r src/app src/components src/hooks src/store src/actions src/slices public \
             next.config.ts next-env.d.ts postcss.config.mjs .eslintrc eslint.config.mjs \
             components.json cypress cypress.config.ts tsconfig.tsbuildinfo README_NEXT.md \
             .agents skills-lock.json
   git mv web/* web/.* .   # then resolve package.json / tsconfig / .gitignore / bun.lock
   ```
   Remove `.next/`, update `.gitignore` (`.svelte-kit/`, `.vercel/`), update `README.md` (dev command `bun dev` → `vite dev`), and remove the React-specific agent skills (`.agents/skills/vercel-*`, `skills-lock.json`) or replace them with Svelte ones.
3. **Vercel project settings:** framework preset → SvelteKit, root directory → `/`, output auto-detected. Copy env vars and rename `NEXT_PUBLIC_PRISMIC_ENVIRONMENT` → `PUBLIC_PRISMIC_ENVIRONMENT`. Make sure AI Gateway access is enabled.
4. **Prismic dashboard:** preview URL → `https://heidisystems.com/api/preview`. Remove or replace the revalidate webhook (phase 5.3). Push slice models from the Svelte Slice Machine.
5. **Deploy to a preview URL, rerun the full Playwright suite plus the visual diff against production Next, then promote to production.**
6. **Post-deploy checks (first hour):** Search Console has no spike in 404s or coverage errors. Vercel logs are free of 5xx. Each form submits once on prod. The `/messdienstwechsel` signup creates a lead and its `switchinquiry` webhook reaches Make.com. The chat works.

## 10.4a Known issues fixed in this phase
Details are in [known-issues.md](known-issues.md). Tick them there as well.

- [ ] **KI-26** (Low): Stale shadcn `components.json` (removed by the `git rm` in step 2)
- [ ] **KI-27** (Low): React-specific agent skills in `.agents/` (removed in step 2)
- [ ] Final sweep: every item in `known-issues.md` is ticked before production promote

## 10.5 Rollback
The previous Next deployment stays in Vercel's deployment history. Rollback is "Promote to Production" on the last Next deployment, which takes seconds. Keep the env var names backward-compatible during the first week: set **both** `NEXT_PUBLIC_PRISMIC_ENVIRONMENT` and `PUBLIC_PRISMIC_ENVIRONMENT`, so a rollback needs no config change. Don't change the Prismic preview URL path, so it stays valid for both.

## 10.6 After cutover
- Delete the second Vercel project created in phase 1.
- Remove `/api/contact` if the form action fully replaces it and nothing external uses it.
- Write a `CLAUDE.md` / contributor notes describing the Svelte conventions (`patterns.md` is a good start).
