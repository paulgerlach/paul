# 00 — Inventory & Progress Checklist

Tick items as they are ported **and** verified against the Next version.

## Routes

| Next.js path | URL | Kind | SvelteKit target | Done |
|---|---|---|---|---|
| `app/layout.tsx` | – | root layout, global meta, font | `src/routes/+layout.svelte` + `src/app.html` | [x] |
| `app/(base)/layout.tsx` | – | Header, Footer, Toaster, QueryProvider | `src/routes/(base)/+layout.svelte` (+ `+layout.server.ts` for nav posts) | [x] |
| `app/(service)/layout.tsx` | – | FragebogenHeader, ChatBot, Suspense | `src/routes/(service)/+layout.svelte` | [x] |
| `app/(base)/page.tsx` (713 lines) | `/` | static, heavy | `(base)/+page.svelte` | [x] |
| `app/(base)/funktionen/page.tsx` | `/funktionen` | static | `(base)/funktionen/+page.svelte` | [x] |
| `app/(base)/geraete/page.tsx` | `/geraete` | static | `(base)/geraete/+page.svelte` | [x] |
| `app/(base)/preise/page.tsx` | `/preise` | static | `(base)/preise/+page.svelte` | [x] |
| `app/(base)/kontakt/page.tsx` | `/kontakt` | static + form | `(base)/kontakt/+page.svelte` + `+page.server.ts` (action) | page [x], action phase 7 [ ] |
| `app/(base)/impressum/page.tsx` | `/impressum` | static text | `(base)/impressum/+page.svelte` | [x] |
| `app/(base)/datenschutzhinweise/page.tsx` | `/datenschutzhinweise` | static text | `(base)/datenschutzhinweise/+page.svelte` | [x] |
| `app/(base)/blog/page.tsx` | `/blog` | Prismic list + tag filter | `(base)/blog/+page.svelte` + `+page.server.ts` | [x] |
| `app/(base)/blog/[uid]/page.tsx` | `/blog/:uid` | Prismic SliceZone + metadata | `(base)/blog/[uid]/+page.svelte` + `+page.server.ts` | [x] |
| `app/(service)/fragebogen/page.tsx` | `/fragebogen` | client wizard | `(service)/fragebogen/+page.svelte` | [ ] |
| `app/emails/preview/page.tsx` | `/emails/preview` | React Email preview | **deleted** (phase 9) | [ ] |
| `app/error.tsx` / `app/not-found.tsx` | – | error UI | `src/routes/+error.svelte` | [x] |
| `app/robots.ts` | `/robots.txt` | metadata route | `src/routes/robots.txt/+server.ts` | [x] |
| `app/sitemap.ts` | `/sitemap.xml` | metadata route | `src/routes/sitemap.xml/+server.ts` | [x] |
| `public/slice-simulator/page.tsx` | `/slice-simulator` | Slice Machine | `src/routes/slice-simulator/+page.svelte` | [x] |

### API routes

| Next.js | Method | Target | Done |
|---|---|---|---|
| `api/chat/route.ts` | POST (stream) | `src/routes/api/chat/+server.ts` | [ ] |
| `api/chat/slack/send/route.ts` | POST | `src/routes/api/chat/slack/send/+server.ts` | [ ] |
| `api/chat/slack/messages/route.ts` | POST | `src/routes/api/chat/slack/messages/+server.ts` | [ ] |
| `api/contact/route.ts` | POST | `kontakt/+page.server.ts` action (keep `/api/contact` too until cutover) | [ ] |
| `api/fragebogen/route.ts` | POST | `src/routes/api/fragebogen/+server.ts` | [ ] |
| `api/leads/route.ts` | POST | `src/routes/api/leads/+server.ts` | [ ] |
| `api/send-email/route.ts` | POST | `src/routes/api/send-email/+server.ts` (newsletter webhook) | [ ] |
| `api/preview/route.ts` | GET | `src/routes/api/preview/+server.ts` (`redirectToPreviewURL`) | [x] |
| `api/exit-preview/route.ts` | GET | `src/routes/api/exit-preview/+server.ts` | [x] |
| `api/revalidate/route.ts` | POST | **Deleted**; replaced by a CDN cache header (phase 5) | [x] |
| `api/email-preview/route.ts` | GET | **Deleted** (phase 9) | [ ] |

## Components → `src/lib/components/`

Keep the folder structure and rename `.tsx` → `.svelte`.

**Basic**
- [x] `Basic/CopyLinkButton/CopyLinkButton` (`usePathname` → `page.url`)
- [x] `Basic/FAQ/FAQItem`, `Basic/FAQ/FAQSection` (uses `slideUp/slideDown` utils)
- [x] `Basic/Kostenfrei/Kostenfrei`
- [x] `Basic/Loading/Loading`
- [x] `Basic/MobileDifference/MobileDifference`
- [ ] `Basic/RichTextBlockImage/RichTextBlockImage`
- [ ] `Basic/Subscription/Subscription` (form + mutation). Markup ported in phase 3 with the submit disabled; submission is phase 7
- [x] `Basic/Ticker/HeroTicker` (295), `Basic/Ticker/GeraeteHeroTicker` (401)
- [x] `Basic/ui/Sonner` → `svelte-sonner` `<Toaster>`

**Header / Footer**
- [x] `Header/Header`, `Header/HeaderButton`, `Header/LoginDropdown`
- [x] `Header/Nav` (259; client-side Prismic fetch via React Query → layout `load`)
- [x] `Header/NavGroup`, `Header/NavFunktionenRightSide`
- [x] `Header/FragebogenHeader`
- [x] `Footer/Footer` (504), `Footer/FooterLink`, `Footer/FooterEmailForm` (form + mutation). `FooterEmailForm` is markup only until phase 7

**Hero**
- [x] `Hero/HomeHero`, `Hero/FunktionenHero`, `Hero/GeraeteHero`, `Hero/BlogHero`

**Swipers** (Swiper attachment, see phase 3)
- [x] `ChartSwiper`, `FunctionsSwiper`, `GeräteangebotSwiper` (rename to `GeraeteangebotSwiper`; avoid umlauts in filenames), `InstallFaq`, `NewsSwiper`, `NumberedSwiper` (355), `PersonSwiper`, `ReviewsSwiper` (videos)
- [x] `FunctionsList`, `NewsList` (non-swiper)

**Page sections**
- [x] `Funktionen/AnimationsSection`, `Funktionen/Grid`
- [x] `Geraete/ChessSection`, `Geraete/Eigenschaften`
- [x] `Preise/PriceCards`, `Preise/PriceTable`
- [x] `Kontakt/ContactForm` (markup only; phase 7 wires it up)
- [x] `Lottie/LazyLottie`

**Blog**
- [x] `Blog/BlogFilters` (React Query → URL `?tag=` + load), `Blog/BlogPost`, `Blog/BlogPostsList`, `Blog/NewestBlogs` (async RSC), `Blog/RecomendedPosts` (async RSC)

**Fragebogen**
- [ ] `StepWrapper`, `StepInfo`
- [ ] `Steps/StepZero`, `Steps/StepOne`
- [ ] `Steps/Over50/StepTwo…StepSixOver50` (5 files)
- [ ] `Steps/Under50/StepTwo…StepFourUnder50` (3 files)

**ChatBot** (`Common/ChatBot`)
- [ ] `index` (container), `ChatHeader`, `AIChatInput`, `SlackChatInput`, `AnonymousChatBanner`, `VisitorEmailFormContainer`, `icons`, `AIChatBot.css`
- [ ] `Messages/AiMessagesContainer`, `SlackMessagesContainer`, `Message`, `SlackMessage`, `DefaultChatMessage`, `LoadingMessage`

**Prismic slices** (`src/slices` → `src/lib/slices`)
- [x] `AuthorImage`, `AuthorName`, `BlogAuthor` (does its own Prismic fetch), `BlogImage`, `BussinessText`, `MainTitle`, `Quote`, `RichTextBlock`, `Subtitle`, plus the generated `index.ts`

**Emails**: `components/emails/*` (7 files), **deleted** (phase 9).

## Non-component modules

| Current | Target | Notes |
|---|---|---|
| `src/prismicio.ts` | `src/lib/prismicio.ts` | Drop `next` fetch options; pass SvelteKit `fetch` + `cookies` |
| `prismicio-types.d.ts` | keep at root (generated) | Regenerated by Slice Machine |
| `src/utils/getAllBlogPosts.ts` | `src/lib/server/blog.ts` | Server-only from now on |
| `src/utils/index.ts` | `src/lib/utils/index.ts` | `slideUp/slideDown` could become `svelte/transition` `slide`; `formatDate` unchanged |
| `src/utils/webhooks.ts` | `src/lib/server/webhooks.ts` | `$env/dynamic/private` |
| `src/utils/email/renderEmail.tsx` | **deleted** (phase 9) | |
| `src/lib/rateLimit.ts` | `src/lib/server/rateLimit.ts` | unchanged |
| `src/lib/slackHttp.ts` | `src/lib/server/slack.ts` | axios → fetch |
| `src/lib/constants/ai/personas.ts` | `src/lib/server/ai/personas.ts` | unchanged |
| `src/db/*` | `src/lib/server/db/*` | unchanged |
| `src/services/leadsService.ts` | `src/lib/server/leads.ts` | unchanged |
| `src/actions/slackChat.ts` | `src/lib/chat/slackClient.ts` | axios → fetch |
| `src/hooks/useSlackChat.tsx` | `src/lib/chat/slackChat.svelte.ts` | runes class |
| `src/store/useQuestionareStore.tsx` | `src/lib/fragebogen/questionnaire.svelte.ts` | runes class + context |
| `src/store/useAIMessagesStore.tsx` | fold into chat state | |
| `src/types/*` | `src/lib/types/*` | `QuestionareFormData` currently imported from a **page file**; move it into types |
| `src/routes/routes.ts` | `src/lib/routes.ts` | rename to avoid confusion with `src/routes/` |
| `src/static/icons.ts` (300 lines, 148 asset imports) | `src/lib/assets/icons.ts` | append `?enhanced` (phase 2) |
| `src/asset/*` (~170 images) | `src/lib/assets/*` | processed by Vite / enhanced-img |
| `src/animations/*.json` (14) | `src/lib/animations/*` | lazy-imported |
| `public/*` | `static/*` | videos, favicons, gmail.png, etc. Unused files are dropped (KI-06) |

## Dependency mapping

| Remove | Replace with |
|---|---|
| `next`, `react`, `react-dom`, `@types/react*`, `eslint-config-next` | `@sveltejs/kit`, `svelte`, `@sveltejs/vite-plugin-svelte`, `eslint-plugin-svelte` |
| `@prismicio/next`, `@prismicio/react`, `@slicemachine/adapter-next` | `@prismicio/svelte`, `@slicemachine/adapter-sveltekit` |
| `@tanstack/react-query` | – (`load` functions) |
| `react-hook-form`, `@hookform/resolvers` | `sveltekit-superforms` (+ zod adapter) or plain runes |
| `zustand` | – (runes) |
| `@ai-sdk/react` | `@ai-sdk/svelte` |
| `swiper/react` | `swiper` core (keep the `swiper` package) |
| `lottie-react` | `lottie-web` |
| `lucide-react` | `@lucide/svelte` |
| `react-icons` | inline SVG |
| `react-loader-spinner` | CSS spinner |
| `react-markdown` | `svelte-exmarkdown` (keep `remark-gfm`) |
| `sonner`, `next-themes` | `svelte-sonner` |
| `axios` | `fetch` |
| `@tailwindcss/postcss` | `@tailwindcss/vite` |
| `cypress` | `@playwright/test`, `vitest` |
| `dotenv` | – (Vite loads `.env`; keep only for `drizzle.config.ts` if needed) |
| `@react-email/*` | – (deleted) |

**Keep:** `@prismicio/client`, `ai`, `drizzle-orm`, `drizzle-kit`, `postgres`, `zod`, `swiper`, `remark-gfm`, `tailwindcss`, `typescript`, `slice-machine-ui`.

## Environment variables

| Current | SvelteKit | Module |
|---|---|---|
| `DATABASE_URL` | same | `$env/dynamic/private` |
| `DB_HOST/PORT/USER/PASSWORD` | same (drizzle-kit only) | – |
| `MAKE_WEBHOOK_UNIFIED` | same | `$env/dynamic/private` |
| `SLACK_BOT_TOKEN`, `SLACK_CHANNEL_ID` | same | `$env/dynamic/private` |
| `NEXT_PUBLIC_PRISMIC_ENVIRONMENT` | `PUBLIC_PRISMIC_ENVIRONMENT` | `$env/static/public` |
| (implicit) `AI_GATEWAY_API_KEY` / Vercel OIDC | same | needed by `streamText({ model: "xai/…" })` |

## Known issues

See [known-issues.md](known-issues.md). Every bug found in the survey is listed there with its owning phase.
