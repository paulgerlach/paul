# CLAUDE.md

Marketing site for Heidi Systems (heidisystems.com): SvelteKit 2, Svelte 5 (runes), Tailwind v4, Prismic, Vercel. Copy is German.

## Current state (2026-10-05)

- **Marketing only.** The landlord/tenant platform, admin dashboard and Supabase auth moved to a separate app at `platform.heidisystems.com`. Don't add auth or dashboard code here. `supabase/` only remains for the local Postgres used by the leads table.
- **Next.js → SvelteKit migration is built but not live.** Phases 1–10 are done on `feat/migration` (PR #440, open). The SvelteKit app was promoted from `web/` to the repo root (`bd0bf304`), so `main` still holds the Next app until #440 merges. Production is still the Next deployment.
  - Preview QA done (2026-10-03): all 246 sitemap URLs 200, SEO diff clean, smoke suite green, Lighthouse at or above Next on most pages. Results in `svelte-migration-plan/10-qa-and-cutover.md`.
  - Still open before/at cutover: the manual QA checklist (§10.2), the Vercel/Prismic dashboard steps (§10.4 steps 3–4), and the two unticked known issues: **KI-34** (placeholder phone in home JSON-LD, needs business confirmation) and **KI-36** (copy typos, need content-owner sign-off). Fragebogen defaults in `$lib/fragebogen/schema.ts` also still need business confirmation.
- **`/messdienstwechsel` landing page** (branch `feat/landing-pages`, plan in git history at `65470139`) is built: route group `(landing-page)`, own header/footer, signup form → `leads` table + `switchinquiry` Make.com event. Its go-live gate (now `new-landing-page-plan/04-qa-and-go-live.md` §4.14) is open: testimonial, customer logos, demo video and the Make.com route are still placeholders (KPIs confirmed 2026-10-12). It must be resolved before the cutover.
- **City landing pages `/messdienstanbieter/[city]` and the Germany hub `/messdienstanbieter`** (same branch, plan in git history at `be2c1feb`, status in its README "Implementation notes") are built: one 16-section template in `$lib/landing/sections/region/` (wrapped in `RegionMain`: the design's eyebrow pills, heading sizes and the floating CTA), filled per page from a content module. The designs were re-imported on 2026-10-17 (new: "Vier gute Gründe", the provider comparison, "Menschen statt Hotline", the security/seal trust block, the Vollmacht signature demo, the timeline tooltip, new hero photos). 26 cities exist (every city in the designs' footer; Gera, added 2026-10-12, isn't in the Germany design, so its map dot is hand-placed in `EXTRA_CITY_DOTS`, `messdienstanbieter/map.ts`); only `live: true` cities in `cities/index.ts` are indexed, in the sitemap and on the Germany map (Berlin so far); the footer "Städte" group links every city. The others render with `noindex` for review until the cutover, when every city goes live. Their go-live gate (`new-landing-page-plan/04-qa-and-go-live.md` §4.13: KPIs, logos, photos, copy/SEO sign-off, the FAQ "Nein" answers, the provider comparison, the security claims) is open.
- **`/upgrade-now` landing page ("Jetzt noch umrüsten", Heizkostenverordnung retrofit deadline 31.12.2026)** is built (plan in git history at `ddde6575`), `noindex` and out of the sitemap until the cutover; its go-live gate must be done by then (now `new-landing-page-plan/04-qa-and-go-live.md` §4.12: legal sign-off, KPIs, expired-state copy, slug). All date logic is in `$lib/landing/deadline/deadline.ts` (Europe/Berlin, pure, takes `now`); sections read the per-page `DeadlineClock` (`$lib/landing/deadline/clock.svelte.ts`), which starts at the `now` from `load` and ticks in the browser. Never call `Date.now()` in its components (same for `/ueber-uns`).
- **`/ueber-uns` ("Über uns")** (plan in git history at `7a777e92`, design https://claude.ai/artifact/TYGNNySnjJfz1jcwJbUMbT) is built, `noindex` and out of the sitemap until the cutover; its go-live gate must be done by then (`new-landing-page-plan/04-qa-and-go-live.md` §4.11: company claims, founder role, careers target, copy/SEO sign-off, expired texts, slug). The landing footer's "Über uns" and `/messdienstwechsel`'s "Mehr über Heidi" link to it. Career links use `CAREERS_HREF` / `CAREERS_JOBS_HREF` (`$lib/landing/cta.ts`, `/karriere`).
- **`/karriere` ("Karriere")** (plan in git history at `d9e105d8`, design https://claude.ai/artifact/QjHMhzF3c7Mhbuik5Ndzy8) is built, `noindex` and out of the sitemap until the cutover; its go-live gate must be done by then (`new-landing-page-plan/04-qa-and-go-live.md` §4.10: jobs and their owner, company claims, application routing and the hiring inbox, privacy text, copy/SEO sign-off, slug). Jobs live in its `content.ts` (`jobs.list`, ids also in `ROLE_IDS`, `$lib/forms/application.ts`); counts and form options derive from it. The application form → Make.com `jobapplication` via `sendWebhookEventOrThrow` (a failed send shows the fallback address); nothing is stored and nothing personal is logged. Its nav CTA goes to `/messdienstwechsel` (`LandingChrome.ctaHref`). The e2e webhook sink answers 500 for emails at `@sink-fails.example`.
- **`/hilfe` ("Hilfe-Center")** (plan in git history at `3b70270e`, design https://claude.ai/artifact/SqREeUtRo8jL153iMHcKyC) is built, `noindex` and out of the sitemap until the cutover; its go-live gate must be done by then (now `new-landing-page-plan/04-qa-and-go-live.md` §4.9: legal statements, company claims, the expired deadline answer, the feedback sheet and its owner, copy/SEO sign-off, slug). The 22 answers live in its `content.ts` (`topics`; plain text, a `more` link without `href` renders nothing until its page exists). The search (`search.ts`, pure) runs in `load` for `?q=` (no JS) and live in the browser through the `HelpSearch` context; `?q=` URLs stay `noindex` with the canonical `/hilfe`. "War das hilfreich?" → Make.com `helpfeedback` (question id, vote, page; no email); every vote, even an invalid or rate-limited one, gets the thanks. The landing footer's "Hilfe-Center" links here.
- **`/selbstabrechnung` ("Selbstabrechnung")** (plan in git history at `9d0bab9c`, design https://claude.ai/artifact/8mPPRD6tVjMYFencN8YvWX) is built, `noindex` and out of the sitemap until the cutover; its go-live gate must be done by then (now `new-landing-page-plan/04-qa-and-go-live.md` §4.8: legal statements, company claims, example data, sample statement, photo, copy/SEO sign-off, slug). Copy and example data live in its `content.ts`; the calculator math is `distribution.ts` (pure). It has no form in the design, so its closing card is the shared `FinalCta` with the signup form (`#start`, `source: "selbstabrechnung"`). The landing footer's "Selbstabrechnung" and `/hilfe`'s answer link to it.
- **`/vorgehen` ("Vorgehen")** (plan in git history at `93952e28`, design https://claude.ai/artifact/5BrUg7VjVK4QEhd7DiaSfj) is built, `noindex` and out of the sitemap until the cutover; its go-live gate must be done by then (now `new-landing-page-plan/04-qa-and-go-live.md` §4.7: legal statements, company claims, photos, example data, expired texts, feature targets, copy/SEO sign-off, slug). Copy lives in its `content.ts` (KPIs in `KPI`). The day count to 1.1.2027 is `daysUntilObligation` read through the page's `DeadlineClock` (never `Date.now()` in its components). The step tabs are WAI-ARIA tabs that auto-advance only in view. Its signup form sits in the closing contact card (`#start`, `source: "vorgehen"`). Figures use Geist Mono (`@fontsource-variable/geist-mono`, registered by the page only). The landing footer's "Vorgehen" links here; "Funktionen" next to it links to the site's `/funktionen`.
- **New `/funktionen` ("Funktionen")** (plan in git history at `6a74f274`, design https://claude.ai/artifact/LLDy7uV51zMeq2LbyHwngP) is built and replaced the ported `(base)/funktionen` page (its old-only components `Funktionen/*` and `Hero/FunktionenHero` stay until go-live, so the route commit can be reverted). It stays indexed and in the sitemap (it replaces a live URL); its go-live gate is §4.6 there. Copy and example data live in its `content.ts` (FAQ answers through `faqItems(now)` in `load`). The dashboard tabs and `/vorgehen`'s steps share `$lib/landing/autoTabs.svelte.ts` (`AutoTabs`). The landing heading reset in `tokens.css` (`.lp :is(h1…h4)`) beats a component's plain `h2 {…}` margin and letter-spacing at equal specificity; use a more specific selector (README "Implementation notes"). It's out of the parity visual run (`VISUAL_PAGES`) and `layout-diff.ts`.
- **`/mieterportal` ("Mieterportal")** (plan in git history at `346e9174`, design https://claude.ai/artifact/5HTo3o7mYMjqUxPXcEyuEy) is built, `noindex` and out of the sitemap until the cutover; its go-live gate must be done by then (now `new-landing-page-plan/04-qa-and-go-live.md` §4.5: the product as described, legal statements, company claims, example data, photos, the tenant card, copy/SEO sign-off, slug). The first dark landing page: sections 1–10 sit in a dark wrapper inside `<main>` (page tokens `--card`, `--card2`, `--mute`, `--lime`), the security block stays light. Copy and example data live in its `content.ts`; the mini dashboard's lines come from `curve.ts` (pure). Its seven looping animations go through `loopInView` (`$lib/landing/attachments/`: only in view and in a visible tab, nothing under reduced motion); every block is server-rendered in its end state. The signup form sits in the closing card (`CtaCard` `tone="glass"`, `#start`, `source: "mieterportal"`); the FAQ is the shared `Faq` with `tone="dark"`, `openFirst={false}` and `more` links. The landing footer's "Mieterportal" and `/vorgehen`'s feature card link here. Don't give a section a class that is also a Tailwind utility (`blur`, `grid`, `hidden` …): Tailwind generates it globally and it applies.
- **`/dashboard` ("Heidi Dashboard") is planned, not built** (plan in `new-landing-page-plan/`, design https://claude.ai/artifact/Hnv5z6cFcw3DyXPkw9nQx1): a product page whose hero is a working preview of the dashboard on example data (five views, menus, drawer, billing run; nothing leaves the browser), plus KPI cards, a scroll scene, a feature bento, the ERP hand-over, a recommendation list and the signup in the closing card. Phase 1 adds `ROUTE_DASHBOARD`, the route, the landing footer's "Dashboard" link and `/hilfe`'s "Dashboard ansehen" links together. `noindex` and out of the sitemap until the cutover; its go-live gate is §4.4 there.
- **Indexing at cutover (decision 2026-10-17):** every page, including every city, is indexed and in the sitemap after the cutover. So every go-live gate in `new-landing-page-plan/04-qa-and-go-live.md` blocks the cutover; the `noindex` on the new pages only lasts until then.
- **After cutover:** delete the phase-1 second Vercel project; consider removing `/api/contact` once nothing external uses it; upgrade Swiper past 11.

Plans and history: `svelte-migration-plan/` (README has the decisions log, `known-issues.md` the KI list) and `new-landing-page-plan/`.

## Commands

Package manager is **bun**.

| Command                                               | What it does                                                                                                                            |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `bun run dev`                                         | Dev server on :5173                                                                                                                     |
| `bun run build` / `bun run preview`                   | Production build / serve on :4173                                                                                                       |
| `bun run check`                                       | svelte-check (types)                                                                                                                    |
| `bun run lint` / `bun run format`                     | Prettier + ESLint                                                                                                                       |
| `bun run test:unit`                                   | Vitest (`src/**/*.test.ts`, `*.svelte.test.ts` for rune classes)                                                                        |
| `bun run test:e2e`                                    | Playwright (`e2e/*.e2e.ts`): builds, serves on :4173 with `KITCHEN_SINK=1` and a local webhook sink on :4199                            |
| `bunx playwright test -c playwright.parity.config.ts` | Parity smoke/visual checks (`e2e/parity/`), `BASE_URL` selects the target; `VERCEL_AUTOMATION_BYPASS_SECRET` reaches protected previews |
| `bun run slicemachine`                                | Prismic Slice Machine                                                                                                                   |

- The landing signup e2e tests need the local Postgres from `DATABASE_URL` (`127.0.0.1:54322`) with the `leads` table.
- CI (`.github/workflows/web.yml`): `check`, `lint`, `build`, and fails on any `next`/`react`/`react-dom` import in `src`.
- `bun scripts/extract-city.ts <design.html> <slug>|--germany` turns a saved city design into `cities/<slug>.ts`, `<slug>-map.ts` and its photos (strict; keeps the hand-written `seo`/`links`). The designs aren't in the repo; save one with the Artifact tool's `read` action.
- Other scripts: `scripts/layout-diff.ts` (compares text-element boxes between two deployments; its header lists the known deliberate diffs), `scripts/compare-endpoints.ts` (webhook payload parity).

## Layout

```
src/
  routes/
    +layout.svelte              root: app.css, Exo 2 font, the single <Seo>
    [[preview=preview]]/        Prismic preview prefix (/preview/…), matcher in src/params/preview.ts
      (base)/                   site Header/Footer/ChatBot; layout loads nav blog teaser + sets cache-control
      (service)/fragebogen/     questionnaire, FragebogenHeader
    (landing-page)/             standalone landing pages (own header/footer, Geist font, tokens.css): messdienstwechsel, messdienstanbieter (+ [city=city], matcher in src/params/city.ts), upgrade-now, ueber-uns, karriere, hilfe, selbstabrechnung, vorgehen, funktionen, mieterportal
    api/                        +server.ts JSON/streaming endpoints (chat, slack, contact, fragebogen, leads, send-email, preview)
    robots.txt/, sitemap.xml/, slice-simulator/
  lib/
    components/<Area>/          ported components, PascalCase.svelte
    attachments/                {@attach} helpers: swiper, lottie, clickOutside, slideToggle, scrollToBottom
    landing/                    landing pages: tokens.css, motion.ts, cta.ts, chrome.ts (header texts per page), faqJsonLd.ts (FAQPage JSON-LD), autoTabs.svelte.ts (auto-advancing WAI-ARIA tabs)
      pages/<landing>/sections/ every section of a page, one file each (thin wrappers where shared); page data
      sections/                 shared section implementations (LogoStrip, Faq (default/split/cards), FinalCta, CtaCard, Testimonials, Trust, TrustCards, TrustSeals, People, FloatingCta; region/ = city/Germany template)
      components/               building blocks: LandingHeader/Footer, SignupForm, DemoCard, EasyChecks, SectionHead, ArrowLink, Segmented (radiogroup), Eyebrow (the designs' sparkle pill), icons (incl. StrokeIcon)
      deadline/                 retrofit deadline: deadline.ts (pure date logic) + clock.svelte.ts (DeadlineClock), used by upgrade-now and ueber-uns
      pages/messdienstanbieter-city/cities/  index.ts (CITIES, live flags), <slug>.ts + <slug>-map.ts (generated), cities.test.ts
      pages/upgrade-now/        content.ts, calculator.ts, sections/
      pages/ueber-uns/          content.ts, sections/
      pages/karriere/           content.ts (copy + jobs), application.svelte.ts (chosen role context), icons.ts, components/ (ApplyLink, Icon), sections/
      pages/hilfe/              content.ts (copy + the 22 answers), search.ts (pure search + highlight), search.svelte.ts (HelpSearch context), icons.ts, components/Icon, sections/
      pages/selbstabrechnung/   content.ts (copy + example data), distribution.ts (pure § 7 split), icons.ts, components/Icon, sections/
      pages/vorgehen/           content.ts (copy + KPIs), icons.ts, components/ (Icon, Head), sections/
      pages/funktionen/         content.ts (copy, example data, faqItems), icons.ts, components/ (Icon, IconPaths, Section, CardGrid), sections/
      pages/mieterportal/       content.ts (copy, example data), curve.ts (pure: the mini dashboard's line paths), icons.ts, components/ (Icon, Tick), sections/ (+ tiles/)
      attachments/ data/        landing attachments (inView, countUp, reveal, loopInView …); customer logos, testimonials; confetti.ts (canvas burst)
    server/                     server-only: db (drizzle), blog (Prismic queries), contact, leads, switchSignup (landing signup action), application (/karriere action), helpFeedback (/hilfe vote action), rateLimit, slack, webhooks, ai/personas
    chat/                       SlackChat + chat context, businessHours
    fragebogen/                 Questionnaire rune class + zod schema (shared client/server)
    forms/                      superforms schemas (contact, switchInquiry, application, helpFeedback)
    seo/                        Seo.svelte, site.ts (defaults, SeoData)
    slices/                     Prismic slices ($slices alias)
    assets/icons.ts             image imports (`?enhanced`)
    routes.ts                   ROUTE_* constants
```

## Conventions

### Svelte 5, runes only

- Runes mode is forced for project files in `svelte.config.js`. Never use `export let`, `$:`, `on:click`, `<slot>`, or `svelte/store`.
- Props: `let { a, b = 1, class: className = "", ...rest }: Props = $props();` → `class={["base", className]}`, `<div {...rest}>`. Type props with an interface.
- Children: `children?: Snippet` → `{@render children?.()}`. Render props become snippet props.
- State: `$state` and direct mutation (`list.push(x)`). Computed values: `$derived` / `$derived.by`. **Never use an `$effect` to sync derived state.**
- `$effect` for side effects only, always returning cleanup for timers/listeners. `onMount` for mount-only work. Non-reactive mutable values are plain `let`.
- Class lists: `class={["a", on && "b"]}`. Styles: `style:font-size="3em"`. Events: `onclick={fn}`. Inputs: `bind:value`, `bind:checked`.
- Global listeners: `<svelte:window>` / `<svelte:document>` or an attachment. Reusable DOM behaviour is an **attachment** (`{@attach thing(opts)}`) in `$lib/attachments/` (or `$lib/landing/attachments/`), not an action.
- `{@html}` only for trusted content.
- Browser-only code: `browser` from `$app/environment`, or `onMount`. Never `typeof window` checks inside `$state` initialisers (hydration mismatch). `localStorage`/`sessionStorage` reads happen in `onMount` or a `restore()` method.
- Shared state: a class with `$state` fields in a `*.svelte.ts` file, provided via `setContext`/`getContext` with exported `setX()`/`getX()` helpers (see `$lib/fragebogen/questionnaire.svelte.ts`, `$lib/chat/context.ts`). Per-page context resets state per visit and avoids SSR leaks. Module-level singletons only for truly client-only global state (e.g. `Header/menu.svelte.ts`).
- Don't destructure reactive objects (`const { messages } = chat` breaks reactivity); read `chat.messages` directly.
- Heavy client-only code is lazy: `import()` on first use (the ChatBot panel loads on first open via `ChatBot/lazy.ts`), Lottie via `LazyLottie`.

### Files and naming

- Components `PascalCase.svelte` under `src/lib/components/<Area>/`. Modules that use runes must be `*.svelte.ts`.
- **No umlauts in file or type names** (`GeraeteangebotSwiper`, `Geraete/`).
- Server-only code lives in `src/lib/server/**` (enforced by SvelteKit). Imports use `$lib/…`, never `@/`.
- Route paths come from `$lib/routes.ts`. Plain `<a href>` for links (`svelte/no-navigation-without-resolve` is off; there's no `paths.base`). `page` from `$app/state`, `goto` from `$app/navigation`.

### Formatting

Prettier with tabs, double quotes, semicolons, trailing commas, `prettier-plugin-tailwindcss` (stylesheet `src/app.css`). Run `bun run format` rather than hand-formatting.

### Styling

- Tailwind v4 via `@tailwindcss/vite`; theme tokens and breakpoints in the `@theme` block of `src/app.css`. `app.css` is the one global stylesheet (there is no `service.css`).
- The site font is registered as `"Exo 2"` (manual `@font-face` in the root layout, not fontsource's CSS), because existing CSS rules use that name.
- **Swiper is pinned to 11.2.10**: ~100 rules in `app.css` target Swiper 11 markup. Swiper markup mirrors what `swiper/react` rendered (slides directly in `.swiper-wrapper`, nav/pagination elements after it); the `swiper` attachment picks those up for `navigation: true` / `pagination: true` and defers init of hidden loop swipers until they have a size (KI-29).
- Accordions use `slideToggle` / `$lib/utils/slide.ts`, not `transition:slide`, so closed content stays in the HTML.
- Landing pages: port design CSS as **component-scoped `<style>` blocks** with tokens as CSS custom properties (`$lib/landing/tokens.css`, imported only in the landing layout). Keep the design's own breakpoints; don't map them to the site's. Tailwind only for simple layout utilities. Every animation respects `prefersReducedMotion()` from `$lib/landing/motion.ts` (render the end state, no loops/counting); timers/observers are created only in the browser and cleaned up on teardown. No new runtime dependencies for interactions. A landing page returns `landing` (banner text, CTA label) from its `load`; the layout passes it to the header. On the region pages, nothing city-specific goes into a component: it lives in the content module, and a design change is re-imported with the extraction script.

### Images and assets

- Local images: import from `$lib/assets/…?enhanced` (registered in `icons.ts`) and render with `$lib/components/Basic/Image/Image.svelte` (`<Image src={icon} width height sizes priority class>`), which mirrors `next/image` (bare `<img>`, Next's deviceSizes srcset, `priority` adds a preload). `enhanced:img` needs a static import; props carrying images are typed `Picture` from `vite-imagetools`. A `?enhanced` import's URL is `x.img.src`.
- SVGs are plain URL imports rendered with `<img>`.
- Prismic images: `CmsImage.svelte` (imgix srcset, `fit=max`, reserves aspect ratio). Pages using them preconnect to `images.prismic.io`.
- `static/` holds only what's referenced (favicon, `admin_logo.png` for JSON-LD, `videos/`, `landing/`). Videos use absolute `/videos/…` paths, `preload="none"` and a poster; keep them at 720p.
- `LazyLottie` takes a `size` and renders a same-size placeholder to avoid CLS; it is keyed on `animationName`.

### SEO

- `<Seo>` is rendered **once**, in the root layout. It reads `page.data.seo` (`SeoData`, `$lib/seo/site.ts`). A page overrides tags by returning `seo` from its `load`; never add `<svelte:head>` meta tags per page.
- Canonical / `og:url` / hreflang are per path. Preview URLs and error pages get `noindex`.
- New public pages go into `src/routes/sitemap.xml/+server.ts`. `robots.txt` disallows `/fragebogen`, `/preview/`, `/slice-simulator`.

### Data loading, caching and Prismic

- Data comes from `+page.server.ts` / `+layout.server.ts` `load`. No client-side fetching for content.
- Always pass SvelteKit's `fetch` (and `cookies`) from `load`/`RequestEvent` to Prismic queries in `$lib/server/blog.ts`.
- Caching is SSR + CDN: the `(base)` and `(landing-page)` layouts set `cache-control: s-maxage=60, stale-while-revalidate=600` (`private, no-store` on preview URLs). **Pages inside those groups must not set `cache-control` themselves.** There is no revalidate webhook.
- Prismic previews use `/preview/…` URLs (the `[[preview=preview]]` segment), not a cookie on public URLs, so drafts never share a CDN cache entry. `<PrismicPreview>` renders only on preview URLs. Pages without Prismic content (landing pages) live outside `[[preview=preview]]`.
- Pages get trimmed post summaries (`PostSummary`), not full documents. Blog tag filter is `?tag=` handled in `load`.
- Prismic route resolver: `blogpost` → `/blog/:uid`.
- **Don't push Slice Machine models before cutover**: the Prismic repo is shared with the live Next site. `src/lib/slices/index.ts` is in the adapter's generated format.
- Failures of non-essential data (nav blog teaser) are caught and degrade gracefully (hide the Blog group) instead of failing the page.

### Server code, forms and endpoints

- Env: server secrets from `$env/dynamic/private`, read **inside** functions (no module-level constants); public values as `PUBLIC_*` from `$env/static/public`. The DB client is created lazily (`getDb()`) so builds don't need env.
- Simple forms are SvelteKit **form actions** with `sveltekit-superforms` + zod (schemas in `$lib/forms/`); they must work without JS. JSON or streaming goes through `+server.ts` (`json()`, `RequestHandler`).
- Validate on the server with the same zod schema the client uses (e.g. `$lib/fragebogen/schema.ts`). German error messages live in the schema.
- Contact spam pipeline order: honeypot → timing (`_t`, re-stamped on mount because the page is CDN-cached) → zod → gibberish → rate limit. A bot that trips any layer gets a silent success.
- Client IP: `getClientAddress()`. Function timeouts: `export const config = { maxDuration: 30 }`.
- Rate limiter is in-memory, per warm Vercel instance (best effort).
- Slack calls go through `slackPost()` with `fetch` and `application/x-www-form-urlencoded`.
- Make.com webhooks (`$lib/server/webhooks.ts`) keep payloads identical to what Next sent. Tests point `MAKE_WEBHOOK_UNIFIED` at the local sink, never at the real scenario.
- Leads are stored with a `source` (e.g. `"messdienstwechsel"`).
- Form feedback stays inline (`role="alert"` / inline text / the footer modal); forms don't use toasts. Validation timing matches the old site: Fragebogen and newsletter show errors only after the first submit.

### Chat widget

- One `SlackChat` instance and one AI `Chat` (`@ai-sdk/svelte`) shared through `$lib/chat/context.ts`; `ChatBot.svelte` calls `setChatContext()`, children call `getChatContext()`.
- The polling `$effect` depends only on `threadTs` and the waiting flag; the in-flight flag is a non-reactive private field. Timers read live state when they fire.
- AI chat uses a model string through the Vercel AI Gateway (OIDC on Vercel, `AI_GATEWAY_API_KEY` locally). Keep `ai` aligned with `@ai-sdk/svelte`'s peer range.

### Porting and parity rules (still apply to changes on ported pages)

- Legal and marketing copy must match word for word; known typos are tracked in KI-36 and only fixed with content-owner sign-off.
- Don't port bugs: record a found bug in `svelte-migration-plan/known-issues.md` with an ID, phase and fix, and tick it when fixed.
- Deliberate visual/layout deviations from the old site get listed in the `scripts/layout-diff.ts` header.
- Check visual changes at 375 / 768 / 992 / 1200 / 1640 px (landing pages: the design's widths, 1440 / 1100 / 980 / 700 / 375).
- Shared header/footer link data lives in modules (`Header/navGroups.ts`, `Footer/footerLinks.ts`) used by both the site and landing headers/footers; don't copy links. Exception: the landing footer is the landing design's own (business decision 2026-10-12); its groups are in `$lib/landing/footerLinks.ts` (no `href` = plain text until the page exists), while address, legal links and social URLs still come from `Footer/footerLinks.ts`.
- No hydration warnings or console errors on any page.
- Kit stays on 2.x (`^2.70`) until `@prismicio/svelte`, `sveltekit-superforms` and `@slicemachine/adapter-sveltekit` support Kit 3.
- `/kitchen-sink` renders every shared component; it 404s in production unless `KITCHEN_SINK=1`.
