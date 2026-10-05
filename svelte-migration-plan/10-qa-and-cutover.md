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

### Results (2026-10-02, Next prod `:3000` vs Svelte `vite preview` `:4173`)

- **Sitemap:** all 245 URLs (9 pages + 236 posts) return 200 on Svelte.
- **SEO diff:** clean. The only differences are the planned fixes: per-path canonical/`og:url`/hreflang (KI-28), no verification placeholder (KI-03), blog post titles (KI-12), `robots.txt` (KI-01), and the 404 page is `noindex` with no canonical.
- **Smoke** (`playwright.parity.config.ts`): every page is 200 with no console errors or hydration warnings; unknown URLs return 404. `/fragebogen` has no `<h1>` in either app.
- **Visual:** pixel screenshots turned out too noisy to gate on. They also flag image recompression, Lottie frames, Next's client-side blog loading, and lazy images caught mid-load. **`web/scripts/layout-diff.ts`** compares the box of every text element once the page has fully loaded. It matches at all 5 widths on `/`, `/funktionen`, `/preise`, `/geraete`, `/kontakt`, the blog post, `/datenschutzhinweise` and `/fragebogen`. The remaining differences are deliberate and listed in the script header: Impressum spacing (JSX dropped the spaces, so Next overflows at 375px), the `h-ful` typo in `AnimationsSection`, and the blog tag filters being links. Against Next *prod*, off-screen lazy content (Lotties, the last blog images) sometimes hasn't loaded at capture time. Re-check any flagged diff before treating it as real.
- **Header @992/1200:** the phone number is hidden between `large` and `megalarge` to make room for the "Anbieterwechsel" link (commit `37a3e73c`). This is deliberate.
- **Unit tests:** `isGibberish`, rate limiter, `formatDate`, `isWithinBusinessHours`, `Questionnaire`. 36 pass.
- **e2e:** 32/35 pass. The 3 `/messdienstwechsel` signup tests need the local Postgres (`127.0.0.1:54322`), which wasn't running.

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

### Results (2026-10-02, local, Lighthouse 12 mobile)

| Page | Next perf / SEO | Svelte perf / SEO | Next LCP / CLS | Svelte LCP / CLS | JS transferred Next → Svelte |
|---|---|---|---|---|---|
| `/` | 64 / 100 | 90 / 100 | 8.4 s / 0.127 | 3.2 s / 0.011 | 677 → 253 KB |
| `/funktionen` | 90–94 / 100 | 83 / 100 | 3.0–3.5 s / 0.004 | 4.2 s / 0 | 502 → 152 KB |
| `/blog` | 62 / 100 | 83 / 100 | 6.5 s / 0.088 | 3.1 s / 0.001 | 241 → 47 KB |
| `/blog/<post>` | 77 / 100 | 89 / 100 | 3.5 s / 0.119 | 2.9 s / 0.001 | 498 → 119 KB |
| `/fragebogen` | 93 / 100 | 96 / 69 | 3.2 s / 0 | 2.7 s / 0 | 483 → 95 KB |

- `/fragebogen` SEO 69 is the KI-01 fix: `robots.txt` now really disallows it. Expected.
- Home CLS 0.138 → 0.011: `LazyLottie` takes a `size` and renders a same-sized placeholder `<svg>` until lottie-web's SVG replaces it (hero `Animation_2`). The same shift exists on Next (0.127).
- `Image` with `priority` now emits `<link rel="preload" as="image">`, as `next/image` does.
- **`/funktionen` is below Next locally.** Next prerenders it (TTFB ≈ 5 ms). Svelte server-renders every request because the layout loads the nav's blog teaser from Prismic (TTFB ≈ 0.75 s locally, ≈ 1.6–1.9 s under Lighthouse). Lighthouse's simulation also queues the hero image behind ~22 `modulepreload`s over HTTP/1.1. In production the CDN (`s-maxage=60, stale-while-revalidate=600`) serves cached HTML, and Vercel uses HTTP/2. **Re-measure on the Vercel preview (10.4 step 5).** `kit.output.bundleStrategy: "single"` was tried: 93 / LCP 2.6 s, but 1 MB of JS on every page. Rejected.

### Results on the Vercel preview (2026-10-03, PR #440 vs live heidisystems.com)

Both sides are behind Vercel's CDN, so TTFB is equal (~870 ms under Lighthouse throttling). The parity tools reach a protected preview with `VERCEL_AUTOMATION_BYPASS_SECRET` in `.env` (see `e2e/parity/vercelBypass.ts`).

- **Sitemap:** all 246 URLs are 200. Unknown pages and posts are 404. CDN caching works (`x-vercel-cache` STALE → HIT).
- **SEO tags and smoke suite:** the `<head>` tags are identical to the local build. The smoke suite passes 11/11.
- **Layout diff vs production Next:** 34/50 exact. All 16 other cases are explained:
  - the deliberate fixes listed in `scripts/layout-diff.ts`
  - Next still loading at capture time (client-side blog list, off-screen Lotties)
  - `InstallFaq`'s 5 s autoplay landing on a different step at 375 px
- **Lighthouse mobile:**

  | Page | Next perf / LCP | Svelte perf / LCP |
  |---|---|---|
  | `/` | 80–92 / 1.7–3.7 s | 95–96 / 2.7 s |
  | `/funktionen` | 99 / 1.7–1.9 s | 94–98 / 2.2–2.8 s |
  | `/blog` | 87–93 / 2.1–2.5 s | 95 / 2.9 s |
  | `/blog/<post>` | 87–88 / 2.9 s | 92–94 / 3.0–3.1 s |
  | `/fragebogen` | 100 / 1.6 s | 99 / 1.8 s |

  - Preview SEO shows 69 because Vercel sends `x-robots-tag: noindex` on preview domains. This doesn't apply to production.
  - Blog images now come straight from `images.prismic.io` (Next proxied them through `/_next/image`). Pages that use them preconnect to it, which cut `/blog` LCP from 3.4 s to 2.9 s. The remaining gap is the larger card image (750 px AVIF, 39 KB vs Next's 23 KB).

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

- [x] **KI-26** (Low): Stale shadcn `components.json` (removed by the `git rm` in step 2)
- [x] **KI-27** (Low): React-specific agent skills in `.agents/` (removed in step 2)
- [ ] Final sweep: every item in `known-issues.md` is ticked before production promote

## 10.5 Rollback
The previous Next deployment stays in Vercel's deployment history. Rollback is "Promote to Production" on the last Next deployment, which takes seconds. Keep the env var names backward-compatible during the first week: set **both** `NEXT_PUBLIC_PRISMIC_ENVIRONMENT` and `PUBLIC_PRISMIC_ENVIRONMENT`, so a rollback needs no config change. Don't change the Prismic preview URL path, so it stays valid for both.

## 10.6 After cutover
- Delete the second Vercel project created in phase 1.
- Remove `/api/contact` if the form action fully replaces it and nothing external uses it.
- Write a `CLAUDE.md` / contributor notes describing the Svelte conventions. Done: [`CLAUDE.md`](../CLAUDE.md) (2026-10-05).
