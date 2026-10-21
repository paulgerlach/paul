# Phase 5: delete the old site's code

After phases 1–3 nothing renders the old home, `/preise`, `/geraete`, `/kontakt`, `/kitchen-sink` or the old header/footer. Delete what only they used. Decide by the reachability check, not by folder names: the blog, the Fragebogen, the legal pages, the chat and the slices still use some old components.

## How to find what's unused

`bun cutover/reach.ts` prints every file under `src/lib` that no route, hook, param matcher or slice imports (directly or through other files). It doesn't follow `import.meta.glob` (the city modules, `cities/*.ts`, are loaded that way: never delete those) or CSS `@import`. Run it after each deletion round until it prints only known false positives.

A dry run on 2026-10-21, with the dropped routes and old layouts excluded, listed (re-run it; this is only the expected shape):

- `Header/*` (all of it, once 3.2 moved `LOGIN_URL`, `PHONE`, `PHONE_HREF`), `Footer/*` (once 3.2 moved the constants)
- `Home/*` (incl. `structuredData.ts` once 4.5 moved the Organization block), `Hero/HomeHero`, `Hero/GeraeteHero`, `Hero/FunktionenHero`, `Funktionen/*`, `Geraete/*`, `Preise/*`, `Kontakt/*`
- `Swipers/*` except `ReviewsSwiper.svelte` (the legal pages use it), with `functionSlides.ts`, `newsSlides.ts`
- `Basic/Ticker/*`, `Basic/MobileDifference`, `Basic/Loading`
- `src/lib/forms/contact.ts` (the `/kontakt` form action's schema)
- `src/lib/index.ts` (empty SvelteKit stub; delete if it's empty)

Expected to stay (reachable): `Basic/Image/*`, `Basic/CopyLinkButton`, `Basic/RichTextBlockImage`, `Basic/Subscription` + `Basic/NewsletterForm` (blog and legal pages), `Basic/FAQ` if a kept page or slice uses it, `Blog/*`, `Hero/BlogHero`, `Fragebogen/*`, `Lottie/*`, `Common/ChatBot/*`, `Swipers/ReviewsSwiper`.

## Steps

- [ ] **5.1** Run `bun cutover/reach.ts`, `git rm` what it lists (minus the false positives above), re-run until stable.
- [ ] **5.2 Server code.** `src/lib/server/blog.ts`: `getNavPosts` (the old header's Blog teaser, KI-07) has no caller now; delete it and its `PostSummary` fields only it needed. `src/lib/server/contact.ts` + `/api/contact` stay (`ongoing-tasks/cutover.md` §5: removed after the cutover once nothing external uses it). Check every other `src/lib/server/*` export for callers (`grep -rn "<name>" src`); the `/kontakt` form action's helpers go if only it used them.
- [ ] **5.3 Assets.** Images in `src/lib/assets/icons.ts` and their files that only deleted components imported. List `icons.ts`'s exports, grep each name in `src/` (outside `icons.ts`), delete the unused exports and then the files nothing imports any more (`git ls-files src/lib/assets | while read f; do …; done` with a grep on the basename). `static/`: delete what only the old pages referenced (videos of the home, Lottie JSON only `Home`/`Geraete` used, …); `static/admin_logo.png` stays (JSON-LD), `static/landing/` stays, the Fragebogen's Lottie files stay. Grep each file's name in `src/` before deleting.
- [ ] **5.4 `app.css`** (1246 lines): delete rules that only target deleted markup (the old header and mobile menu, footer, home sections, Swiper rules of the deleted swipers, `svelte-sonner` toaster rules, price table, …). Keep the `@theme` block, the base rules, and every rule the blog, Fragebogen, legal pages, `ReviewsSwiper`, chat and slices need. Work by selector: grep each class name in `src/` (outside `app.css`); a rule whose classes appear nowhere goes. Re-check the four kept pages and two landing pages visually afterwards (the landing pages also live under `app.css`; a deleted global rule can change them).
- [ ] **5.5 Dependencies.** `svelte-sonner` (only the old layout's `Toaster`): `bun remove svelte-sonner`. `swiper` stays (`ReviewsSwiper`), still pinned at 11.2.10; `lottie-web` stays (Fragebogen). `@fontsource-variable/exo-2` stays (blog, Fragebogen, legal pages are Exo 2). Re-run a dependency check: for each name in `package.json` `dependencies`, `grep -rlF "\"<name>" src` must find a user.
- [ ] **5.6 Prismic.** Slices in `src/lib/slices/` render blog posts; keep them all, even if no current post uses one (the Prismic repo is shared with the live Next site until cutover; don't push Slice Machine models). Custom types in `customtypes/` stay.
- [ ] **5.7 Kitchen sink.** The route is gone (phase 1). The `KITCHEN_SINK=1` env var stays: the e2e server uses it to raise the rate limits (`application.ts`, `helpFeedback.ts`, the partner inquiry actions). Fix the comments that say it enables `/kitchen-sink`, and `playwright.config.ts`'s comment if it says so.
- [ ] **5.8** `bun run check && bun run lint && bun run test:unit && bun run build`; then `bun run format`.
