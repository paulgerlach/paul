# Next.js → SvelteKit (Svelte 5) Migration Plan

Migration of the **heidisystems.com marketing site** (`hs-web`) from Next.js 16 / React 19 to SvelteKit 2 / Svelte 5 (runes).

The landlord/tenant app has already moved to `platform.heidisystems.com`, so what remains is small: about 15.7k lines, 9 public pages, a blog backed by Prismic, a multi-step questionnaire, a chat widget (AI and Slack), and 10 API routes.

## Strategy

**Build the new site side by side, then cut over in one switch.** It is not an incremental hybrid.

- Scaffold the SvelteKit app in `web/` inside this repo while the Next app stays at the root and keeps deploying.
- Port in the phase order below. Every phase ends with the Svelte routes for that phase rendering identically to the Next routes. Compare them by running both dev servers (Next on `:3000`, Svelte on `:5173`).
- When all phases are done, promote `web/` to the repo root, delete the Next code, and switch the Vercel project's framework preset. That happens in one PR.

Why not a strangler or proxy setup: the site is small, it is mostly static marketing pages, and the two apps share no runtime state. A proxy layer would cost more than the port itself.

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 0 | [00-inventory.md](00-inventory.md) | Full inventory: routes, components, dependency mapping. Doubles as a progress checklist | n/a |
| 1 | [01-scaffold.md](01-scaffold.md) | Create SvelteKit project, tooling, Tailwind v4, env, adapter | S |
| 2 | [02-foundation.md](02-foundation.md) | Root and group layouts, global CSS, fonts, images/assets, SEO/meta, error page, robots/sitemap | M |
| 3 | [03-shared-components.md](03-shared-components.md) | Header/Nav, Footer, FAQ, Kostenfrei, Lottie, Swipers, Tickers, Toaster | L |
| 4 | [04-pages.md](04-pages.md) | Static pages: impressum, datenschutz, preise, geraete, funktionen, kontakt, home | M |
| 5 | [05-blog-prismic.md](05-blog-prismic.md) | Prismic client, slices, blog list/detail, previews, Slice Machine | M |
| 6 | [06-server-endpoints.md](06-server-endpoints.md) | API routes → `+server.ts` / form actions, DB, webhooks, rate limit | S |
| 7 | [07-forms-and-fragebogen.md](07-forms-and-fragebogen.md) | Contact/newsletter forms, Fragebogen wizard, Zustand → runes | M |
| 8 | [08-chatbot.md](08-chatbot.md) | AI chat (`@ai-sdk/svelte`) and Slack live-chat widget | M |
| 9 | [09-emails.md](09-emails.md) | Delete the React Email templates. **Do this first**, as a small PR on the Next codebase, before phase 3 | XS |
| 10 | [10-qa-and-cutover.md](10-qa-and-cutover.md) | Playwright, visual diff, SEO parity, Lighthouse, deploy and cutover | M |

Reference:
- [known-issues.md](known-issues.md): bugs found in the current code (KI-01…KI-27). Each is assigned to a phase and fixed there instead of being ported.
- [patterns.md](patterns.md): React/Next → Svelte 5 translation cheat sheet for everyone doing the port.

## Key decisions

| Topic | Next.js today | SvelteKit target |
|---|---|---|
| Framework | Next 16 App Router, React 19 | SvelteKit 2, Svelte 5 runes, TypeScript |
| Hosting | Vercel | `@sveltejs/adapter-vercel` ✅ decided |
| Styling | Tailwind v4 via PostCSS | Tailwind v4 via `@tailwindcss/vite`, same `@theme` tokens and breakpoints |
| Font | `next/font/google` Exo 2 | `@fontsource-variable/exo-2`, self-hosted, preloaded |
| Images | `next/image` (53 files) | `@sveltejs/enhanced-img` for local assets, `<PrismicImage>` (imgix) for CMS images |
| Metadata | `metadata` / `generateMetadata` | `<Seo>` component writing to `<svelte:head>`, data from `load` |
| Data fetching | RSC + React Query (client-side Prismic calls) | `+page.server.ts` / `+layout.server.ts` `load` functions. React Query is removed |
| Mutations | `useMutation` + `/api/*` | Form actions with `sveltekit-superforms` + zod for simple forms; `+server.ts` for JSON/streaming |
| Client state | Zustand | Runes-based classes in `*.svelte.ts`, provided through context |
| CMS | `@prismicio/next`, `@prismicio/react`, `adapter-next` | `@prismicio/svelte` (+ `/kit`), `@slicemachine/adapter-sveltekit` |
| Carousels | `swiper/react` | Swiper core mounted through a Svelte `{@attach}` helper |
| Lottie | `lottie-react` | `lottie-web` (light build) through an attachment, lazy via IntersectionObserver |
| AI chat | `@ai-sdk/react` `useChat` | `@ai-sdk/svelte` `Chat` class |
| Toasts | `sonner` + `next-themes` | `svelte-sonner` (next-themes dropped; only Sonner used it) |
| Icons | `lucide-react`, `react-icons/md` | `@lucide/svelte`; replace the one `react-icons` icon with inline SVG |
| Markdown | `react-markdown` + `remark-gfm` | `svelte-exmarkdown` + `remark-gfm` |
| Spinner | `react-loader-spinner` | Small CSS spinner component |
| HTTP | `axios` | Native `fetch` (and SvelteKit's `fetch` inside `load`) |
| DB | drizzle + postgres-js | Unchanged; moved to `$lib/server/db` |
| Email | `@react-email/*` | Deleted ✅ decided (phase 9) |
| Tests | Cypress (no real specs) | Playwright (`sv add playwright`) + Vitest |

## Decisions log

| # | Question | Answer | Effect on the plan |
|---|---|---|---|
| 1 | Hosting target | **Vercel** | `adapter-vercel` (phase 1). `output: "standalone"` is dropped. The in-memory rate limiter stays per-instance best effort, the same as today (phase 6) |
| 2 | Keep the email templates? | **No, delete them** | Phase 9 becomes a deletion, done first as a small PR in the Next codebase (KI-25) |
| 3 | Prismic caching / revalidation | **Not decided. Defaulting to Option A** | SSR with `cache-control: s-maxage=60, stale-while-revalidate=600`. The `/api/revalidate` endpoint and the Prismic webhook are removed. See the reasoning below |
| 4 | Drop unused `public/` files? | **Yes** | Not copied to `static/` (phase 2, KI-06) |
| 5 | SvelteKit 2 or 3? | **Kit 2** (pinned `^2.70`) | `sv create` now scaffolds Kit 3, but `@prismicio/svelte`, `sveltekit-superforms` and `@slicemachine/adapter-sveltekit` declare `@sveltejs/kit ^2` peers. Kit 2.70 runs on Vite 8 / vite-plugin-svelte 7 / TS 6. Revisit once those libraries support Kit 3 |
| 6 | Library major versions | Latest majors installed in `web/`, **except Swiper, which is pinned to 11.2.10** like Next | `ai` 7 (Next uses 5) and `zod` 4 (Next uses 3): check for API changes when porting phases 6, 7, 8. Swiper stays on 11 because `app.css` targets Swiper 11 markup; upgrade it after cutover |

**Why Option A for #3.** Today production fetches from Prismic on *every* request (`revalidate: 0`), so the revalidate webhook does nothing (KI-11). Option A is the simplest setup that is at least as fresh for editors: a published post shows up within about 60 seconds. It also takes load off Prismic, because Vercel's CDN serves repeat hits. There are no extra tokens or webhooks to maintain. Switching to Option B (Vercel ISR with an on-demand bypass token) later is a contained change to the two blog `+page.server.ts` files. Revisit only if editors complain about the 60-second delay.

## Definition of done

- Every URL from the current sitemap returns 200 and is visually equivalent at 375 / 768 / 1280 / 1640 px.
- Title, description, OG and canonical tags match per route. `sitemap.xml` and `robots.txt` are equivalent.
- Contact, newsletter, lead capture and Fragebogen submissions reach Make.com/DB with identical payloads.
- Blog list, tag filter, detail pages and Prismic preview all work. The Slice Machine simulator works.
- AI chat streams; Slack chat sends and polls.
- Lighthouse performance and SEO are ≥ the current site. JS shipped per page is lower.
- No `react`, `next`, or `@prismicio/next|react` dependencies remain.
- Every item in [known-issues.md](known-issues.md) is ticked.
