# 00 — Inventory & Progress Checklist

Tick items as they are ported **and** verified against the Next version.

## Routes

| Next.js path | URL | Kind | SvelteKit target | Done |
|---|---|---|---|---|
| `app/layout.tsx` | – | root layout, global meta, font | `src/routes/+layout.svelte` + `src/app.html` | [x] |
| `app/(base)/layout.tsx` | – | Header, Footer, Toaster, QueryProvider | `src/routes/(base)/+layout.svelte` (+ `+layout.server.ts` for nav posts) | [x] |
| `app/(service)/layout.tsx` | – | FragebogenHeader, ChatBot, Suspense | `src/routes/(service)/+layout.svelte` | [x] |
| `app/(base)/page.tsx` (713 lines) | `/` | static, heavy | `(base)/+page.svelte` | [x] |
| `app/(base)/funktionen/page.tsx` | `/funktionen` | static | `(landing-page)/funktionen/+page.svelte` (a new design replaced the port, `new-landing-page-plan/`; the port is in git history) | [x] |
| `app/(base)/geraete/page.tsx` | `/geraete` | static | `(base)/geraete/+page.svelte` | [x] |
| `app/(base)/preise/page.tsx` | `/preise` | static | `(base)/preise/+page.svelte` | [x] |
| `app/(base)/kontakt/page.tsx` | `/kontakt` | static + form | `(base)/kontakt/+page.svelte` + `+page.server.ts` (action) | page [x], action phase 7 [x] |
| `app/(base)/impressum/page.tsx` | `/impressum` | static text | `(base)/impressum/+page.svelte` | [x] |
| `app/(base)/datenschutzhinweise/page.tsx` | `/datenschutzhinweise` | static text | `(base)/datenschutzhinweise/+page.svelte` | [x] |
| `app/(base)/blog/page.tsx` | `/blog` | Prismic list + tag filter | `(base)/blog/+page.svelte` + `+page.server.ts` | [x] |
| `app/(base)/blog/[uid]/page.tsx` | `/blog/:uid` | Prismic SliceZone + metadata | `(base)/blog/[uid]/+page.svelte` + `+page.server.ts` | [x] |
| `app/(service)/fragebogen/page.tsx` | `/fragebogen` | client wizard | `(service)/fragebogen/+page.svelte` | [x] |
| `app/emails/preview/page.tsx` | `/emails/preview` | React Email preview | **deleted** (phase 9) | [ ] |
| `app/error.tsx` / `app/not-found.tsx` | – | error UI | `src/routes/+error.svelte` | [x] |
| `app/robots.ts` | `/robots.txt` | metadata route | `src/routes/robots.txt/+server.ts` | [x] |
| `app/sitemap.ts` | `/sitemap.xml` | metadata route | `src/routes/sitemap.xml/+server.ts` | [x] |
| `public/slice-simulator/page.tsx` | `/slice-simulator` | Slice Machine | `src/routes/slice-simulator/+page.svelte` | [x] |

### New pages (no Next counterpart)

| Route | Target | Notes | Done |
|---|---|---|---|
| `/messdienstwechsel` | `src/routes/(landing-page)/messdienstwechsel/+page.svelte` | Landing page, own header/footer. Plan: `ddde6575` (`new-landing-page-plan/`) | [x] |
| `/ueber-uns` | `src/routes/(landing-page)/ueber-uns/+page.svelte` | Company page ("Über uns"), `noindex` until its go-live gate. Plan: `7a777e92` (`new-landing-page-plan/`) | [x] |
| `/karriere` | `src/routes/(landing-page)/karriere/+page.svelte` | Careers page ("Karriere"): jobs and an application form → Make.com `jobapplication`, `noindex` until its go-live gate. Plan: `d9e105d8` (`new-landing-page-plan/`) | [x] |
| `/hilfe` | `src/routes/(landing-page)/hilfe/+page.svelte` | Help center ("Hilfe-Center"): 22 answers in 6 topics with live search (server-rendered for `?q=`) and a "War das hilfreich?" vote → Make.com `helpfeedback`, `noindex` until its go-live gate. Plan: git history at `3b70270e` | [x] |
| `/selbstabrechnung` | `src/routes/(landing-page)/selbstabrechnung/+page.svelte` | Product page for self-billing Verwaltungen ("Selbstabrechnung"): billing demo, task split, § 7 cost calculator, data path, sample statement; the shared signup form in the closing card, `noindex` until its go-live gate. Plan: git history at `9d0bab9c` | [x] |
| `/vorgehen` | `src/routes/(landing-page)/vorgehen/+page.svelte` | How Heidi works ("Vorgehen"): key figures, the remote-reading duty with a day count to 1.1.2027, three auto-advancing step tabs, feature cards, comparison with classic reading, quotes; the shared signup form in the contact card, `noindex` until its go-live gate. Plan: git history at `b973b162` | [x] |
| `/mieterportal` | `src/routes/(landing-page)/mieterportal/+page.svelte` | Tenant portal product page ("Mieterportal"), the first dark landing page: the portal mock, scroll-lit statement, four animated feature tiles, a mini dashboard, FAQ, signup in the closing card. `noindex` until its go-live gate. Plan: git history at `346e9174` | [x] |
| `/dashboard` | `src/routes/(landing-page)/dashboard/+page.svelte` | Dashboard product page ("Heidi Dashboard"): a working preview of the dashboard on example data in the hero (five views, menus, drawer, billing run; nothing leaves the browser), KPI cards, a scroll scene, a feature bento, the ERP hand-over, the recommendation list, signup in the closing card. `noindex` until its go-live gate. Plan: `83433739` (`new-landing-page-plan/`) | [x] |
| `/sicherheit` | `src/routes/(landing-page)/sicherheit/+page.svelte` | Security and data-protection page ("Sicherheit & Datenschutz"): the map of Germany with data packets travelling to one server, three principles, the data path, the table of which data lies where (disclosure rows), FAQ, signup in the closing card. Target of the landing footer's "Sicherheit" links and the trust block's "Mehr zu Sicherheit". `noindex` until its go-live gate. Plan: `new-landing-page-plan/` | [x] |
| `/verbrauchsinformation` | `src/routes/(landing-page)/verbrauchsinformation/+page.svelte` | The uVI page ("Verbrauchsinformation (uVI)"), dark like `/mieterportal` and built on the same `uv` template (`$lib/landing/sections/uv/`): the word "uVI" over a portal mock with the month's KPIs and bars, a scroll-lit statement, four feature rows with looping tiles (calendar, uVI document, phone, the bill without/with uVI), rotating line, numbers, audience cards, quotes, picture, FAQ, signup in the closing card. Target of the landing footer's "Verbrauchsinformation (uVI)" and the "Mehr zur uVI" links. `noindex` until its go-live gate. Plan: `3745dd0c` (`new-landing-page-plan/`) | [x] |
| `/schnittstellen` | `src/routes/(landing-page)/schnittstellen/+page.svelte` | ERP/CRM integration page ("Schnittstellen zu ERP und CRM"): a working switch "Zwei Plattformen / Mit Heidi" in the hero (ERP entries syncing, confetti), before/after steps, the Doppelpflege-Rechner (four sliders → hours, working days and cost), the data path, benefits, steps, quotes, FAQ, signup in the closing card. Target of the landing footer's "Schnittstellen" and `/funktionen`'s "Immobilienmanagement" card, `noindex` until its go-live gate. Plan: git history at `042eb570` | [x] |
| `/hausverwaltung` | `src/routes/(landing-page)/hausverwaltung/+page.svelte` | Segment page "Für Hausverwaltungen", dark on the shared `uv` template (`$lib/landing/sections/uv/`): the word "Hausverwaltung" over a dashboard list whose statuses loop, a scroll-lit statement, four feature rows with looping tiles (units read per Funk, the Abrechnung's checks, the installation notice, "Heute / Mit Heidi"), rotator, figures, audience cards, quotes, picture, FAQ, signup in the closing card. Target of the landing footer's "Hausverwaltung" and `/verbrauchsinformation`'s "Erfahren Sie mehr", `noindex` until its go-live gate. Plan: git history at `0b7f19b2` | [x] |
| `/mietverwaltung` | `src/routes/(landing-page)/mietverwaltung/+page.svelte` | Segment page "Für Mietverwaltungen", dark on the shared `uv` template: the word "Mietverwaltung" over a dashboard list of owners whose statuses loop, a scroll-lit statement, four feature rows with looping tiles (objects finished one by one, the Zwischenablesung at a move-out, "Eigentümer A / B", the tenant's Verbrauchsinfo), rotator, figures, the Portfolio-Checker card, quotes, picture, FAQ, signup in the closing card. Target of the landing footer's "Mietverwaltung", `noindex` until its go-live gate. Plan: git history at `a3410048` | [x] |
| `/weg-verwaltung` | `src/routes/(landing-page)/weg-verwaltung/+page.svelte` | Segment page "Für WEG-Verwaltungen", dark on the shared `uv` template: the word "WEG‑Verwaltung" over a dashboard list of owners' associations whose statuses loop, a scroll-lit statement, four feature rows with looping tiles (a year with the ETV, Kündigung and Vertragsende as milestones, "Ohne / Mit Heidi" for the Vollmacht, the Kostenverteilung, an owner's Verbrauchsinfo), rotator, figures, audience cards, quotes, picture, FAQ, signup in the closing card. Target of the landing footer's "WEG-Verwaltung", `noindex` until its go-live gate. Plan: git history at `a4de1116` | [x] |
| `/wohnungsunternehmen` | `src/routes/(landing-page)/wohnungsunternehmen/+page.svelte` | Segment page "Für Wohnungsunternehmen", light, the first on the shared `sg` template: a unit calculator on a log slider (from 1.000 the dark "Ab 1.000 Einheiten" offer, confetti on first crossing), customer-type tabs, logos, a dark "1000+" card, "Was stört Sie heute?" (eight problems to click, answered by Heidi), four benefits, five feature rows with looping tiles (a Funk reading, the Abrechnung counting to 24 / 24, monthly values with a flagged outlier, a data hub, a rollout of four properties), four steps, quotes, FAQ, signup in the closing card. Target of the landing footer's "Wohnungsunternehmen", `noindex` until its go-live gate. Plan: git history at `4f1f649e` | [x] |
| `/asset-manager` | `src/routes/(landing-page)/asset-manager/+page.svelte` | Segment page "Für Asset Manager & Fonds" on the shared light `sg` template of `/wohnungsunternehmen` (same calculator, starting at 12.000; tabs, logos, the 1000+ card, the problem picker, five feature rows with looping tiles, steps), with its own hero, benefits, quotes and FAQ 1–2; signup in the closing card. Target of the landing footer's "Asset Manager & Fonds" and `/wohnungsunternehmen`'s tab, `noindex` until its go-live gate. Plan: git history at `c4a84443` | [x] |
| `/private-vermieter` | `src/routes/(landing-page)/private-vermieter/+page.svelte` | Segment page "Für private Vermieter", dark, on its own design: hero, a sticky scroll scene (the flat zooms into the kitchen and blurs into the cabinet with the radio meters; captions, signal points and tags with an info card), three figures, a sticky five-step flow with mock-ups, a photo and text card, six advantages, a comparison table, a quote marquee, FAQ, signup in the closing card. Target of the landing footer's "Private Vermieter", `noindex` until its go-live gate. Plan: git history at `5ae8b941` | [x] |
| `/neuigkeiten` | `src/routes/(landing-page)/neuigkeiten/+page.svelte` | News page "Neuigkeiten", light, on its own design: the hero with a featured story, nine story cards with a topic filter (Alle, Produkt, Werkzeuge, Unternehmen) and the link to the blog, four "Gesetz & Fristen" rows, signup in the closing card. Stories whose page doesn't exist yet render without a link. Target of the landing footer's "Neuigkeiten", `noindex` until its go-live gate. Plan: git history at `50f63909` | [x] |
| `/fristenrechner` | `src/routes/(landing-page)/fristenrechner/+page.svelte` | Tool page "Fristenrechner", light, on its own design: the hero with a calculator card (tabs Vertrag, Eichfrist, Abrechnung: the last day to cancel a metering contract with its timeline, the end of a meter's calibration, the billing deadline and the objections), four "Stichtage" of the HeizkostenV with live badges, the portfolio block with an example list, FAQ, signup in the closing card. Target of the landing footer's "Fristenrechner", `/neuigkeiten`'s row and "Zum Fristenrechner" on the segment pages, `noindex` until its go-live gate. Plan: `new-landing-page-plan/` | [x] |
| `/hkvo-leitfaden` | `src/routes/(landing-page)/hkvo-leitfaden/+page.svelte` | Guide page "HKVO-Leitfaden", light, on its own design: the hero with the "Schnell-Check" (five yes/no questions with a score ring and the result), nine articles on the Heizkostenverordnung next to a sticky table of contents with the current article and a progress bar, three penalty cards (§ 12), FAQ, signup in the closing card. Target of the landing footer's "HKVO-Leitfaden" and `/vorgehen`'s "Zum HKVO-Leitfaden", `noindex` until its go-live gate. Plan: git history at `a480e2cc` | [x] |
| `/einsparrechner` | `src/routes/(landing-page)/einsparrechner/+page.svelte` | Tool page "Einsparrechner", light, on its own design: the hero with the calculator (seven sliders for the stock, the rate and the hours per property, two toggles for the missing HeizkostenV duties; the dark result card with the yearly total, two bars, working days and the figure per unit, counting to each new result), three cards with the formulas, FAQ, signup in the closing card. Target of the landing footer's "Einsparrechner" and "Zum Einsparrechner" on `/hausverwaltung` and `/mietverwaltung`, `noindex` until its go-live gate. Plan: git history at `f0d83e12` | [x] |
| `/presse` | `src/routes/(landing-page)/presse/+page.svelte` | Press page "Presse", light, on its own design: the giant "Hallo, Presse." hero, the contact card with the press address and the media kit (four downloads: both logos, the Bildmarke, the company profile), the name and logo card with the growing mark, six facts (two counting), the boilerplate with a copy button, the press contact card, signup in the closing card. Target of the landing footer's "Presse", `noindex` until its go-live gate. Plan: git history at `1e76f838` | [x] |
| `/muster-kuendigung` | `src/routes/(landing-page)/muster-kuendigung/+page.svelte` | Tool page "Muster-Kündigung", light, on its own design: the hero with a drawn letter, the generator (the sender, the old provider, the properties, the date and five clauses, with a live preview; Word and PDF written in the browser, copy as text), a four-point checklist with progress, the dark "Oder Heidi kündigt für Sie" card, FAQ, signup in the closing card. Target of the landing footer's "Muster-Kündigung" and the links on `/fristenrechner`, `/weg-verwaltung`, `/wohnungsunternehmen`, `/asset-manager` and `/hilfe`, `noindex` until its go-live gate. Plan: git history at `754932dc` | [x] |
| `/energieausweis` | `src/routes/(landing-page)/energieausweis/+page.svelte` | Product page "Energieausweis", light, on its own design: the hero with an efficiency scale (two example values, the marker sliding and counting), a four-question check (Verbrauchs- or Bedarfsausweis, the result with the matching offers), four offers with prices and a filter, a comparison table, the dark "Die Verbräuche haben Sie schon" card with growing bars, FAQ, signup in the closing card. Target of the landing footer's "Energieausweis", `noindex` until its go-live gate. Plan: `new-landing-page-plan/` | [x] |
| `/messdienstanbieter` | `src/routes/(landing-page)/messdienstanbieter/+page.svelte` | Germany landing page, hub of the city pages. Plan: `new-landing-page-plan/08-germany-page.md` | [x] |
| `/messdienstanbieter/[city]` | `src/routes/(landing-page)/messdienstanbieter/[city=city]/+page.svelte` | City landing pages (22 cities, only `live` ones indexed). Plan: `new-landing-page-plan/` | [x] |
| `/upgrade-now` | `src/routes/(landing-page)/upgrade-now/+page.svelte` | Retrofit-deadline landing page ("Jetzt noch umrüsten"), `noindex` until its go-live gate. Plan: `new-landing-page-plan/` | [x] |

### API routes

| Next.js | Method | Target | Done |
|---|---|---|---|
| `api/chat/route.ts` | POST (stream) | `src/routes/api/chat/+server.ts` | [x] |
| `api/chat/slack/send/route.ts` | POST | `src/routes/api/chat/slack/send/+server.ts` | [x] |
| `api/chat/slack/messages/route.ts` | POST | `src/routes/api/chat/slack/messages/+server.ts` | [x] |
| `api/contact/route.ts` | POST | `kontakt/+page.server.ts` action (keep `/api/contact` too until cutover) | `/api/contact` phase 6 [x], action phase 7 [x] |
| `api/fragebogen/route.ts` | POST | `src/routes/api/fragebogen/+server.ts` | [x] |
| `api/leads/route.ts` | POST | `src/routes/api/leads/+server.ts` | [x] |
| `api/send-email/route.ts` | POST | `src/routes/api/send-email/+server.ts` (newsletter webhook) | [x] |
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
- [x] `Basic/Subscription/Subscription` (form + mutation). Submission shared with the footer through `Basic/NewsletterForm/NewsletterForm` (phase 7)
- [x] `Basic/Ticker/HeroTicker` (295), `Basic/Ticker/GeraeteHeroTicker` (401)
- [x] `Basic/ui/Sonner` → `svelte-sonner` `<Toaster>`

**Header / Footer**
- [x] `Header/Header`, `Header/HeaderButton`, `Header/LoginDropdown`
- [x] `Header/Nav` (259; client-side Prismic fetch via React Query → layout `load`)
- [x] `Header/NavGroup`, `Header/NavFunktionenRightSide`
- [x] `Header/FragebogenHeader`
- [x] `Footer/Footer` (504), `Footer/FooterLink`, `Footer/FooterEmailForm` (form + mutation). `FooterEmailForm` submits through `NewsletterForm` (phase 7)

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
- [x] `StepWrapper`, `StepInfo`
- [x] `Steps/StepZero`, `Steps/StepOne` (pick-one card lists shared as `Steps/StepChoices`, headings as `Steps/StepHeading`)
- [x] `Steps/Over50/StepTwo…StepSixOver50` (5 files)
- [x] `Steps/Under50/StepTwo…StepFourUnder50` (3 files)

**ChatBot** (`Common/ChatBot`)
- [x] `index` (container → `ChatBot` launcher + lazy `ChatPanel`), `ChatHeader`, `AIChatInput`, `SlackChatInput`, `AnonymousChatBanner`, `VisitorEmailFormContainer`, `icons` (→ `SupportAgentIcon`, `BrainCircuitIcon`, inline SVGs), `AIChatBot.css`; `react-loader-spinner` → `TriangleSpinner`
- [x] `Messages/AiMessagesContainer`, `SlackMessagesContainer`, `Message`, `SlackMessage`, `DefaultChatMessage`, `LoadingMessage`

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
| `src/actions/slackChat.ts` | folded into `src/lib/chat/slackChat.svelte.ts` | axios → fetch (phase 8) |
| `src/hooks/useSlackChat.tsx` | `src/lib/chat/slackChat.svelte.ts` | runes class, one instance via `$lib/chat/context` (phase 8) |
| `src/store/useQuestionareStore.tsx` | `src/lib/fragebogen/questionnaire.svelte.ts` | runes class + context |
| `src/store/useAIMessagesStore.tsx` | fold into chat state | `ChatState` in `$lib/chat/chatState.svelte.ts` outlives the panel, so no store is needed (phase 8) |
| `src/types/*` | `src/lib/types/*` | `QuestionareFormData` is now `QuestionnaireInput` / `QuestionnaireData` in `$lib/fragebogen/schema.ts` (KI-18) |
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
