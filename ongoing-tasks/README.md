# Ongoing tasks

What is still open on this repo, and the decisions you need to understand it. Everything finished (the per-phase migration plan, the per-page landing plans, their QA results) is in git history; `CLAUDE.md` has the current state of every page and the conventions.

| File | What's in it |
|---|---|
| [cutover.md](cutover.md) | What blocks the Next.js → SvelteKit cutover (PR #440), the cutover steps, post-deploy checks, rollback and the after-cutover list. The site restructure (landing pages as the whole site) is done |
| [go-live-gates.md](go-live-gates.md) | The go-live gate of every new landing page (§1–47): business, legal and content sign-offs and the open manual checks. All of them block the cutover |
| [known-issues.md](known-issues.md) | The KI list: bugs found in the Next code and fixed instead of ported (the code cites the IDs). None open |

## Where the old plans are

All at `6138407c` (`git show 6138407c:<path>`):

- `svelte-migration-plan/`: the migration (README with the strategy and decisions, `00-inventory.md`, phases `01`–`10`, `patterns.md`).
- `new-landing-page-plan/`: the `/plattform/installationstool` plan, the last page plan. Every earlier page's plan is at the commit named in its `CLAUDE.md` paragraph and its gate.

## Decisions to keep in mind

Migration (the full table was in `svelte-migration-plan/README.md`):

| Topic | Decision |
|---|---|
| Strategy | Build the Svelte app side by side, cut over in one switch; no proxy or strangler (small, mostly static site, no shared runtime state) |
| Hosting | Vercel, `adapter-vercel`. The in-memory rate limiter is per instance, best effort |
| Caching | SSR + CDN (`s-maxage=60, stale-while-revalidate=600`), no revalidate webhook: a published post shows up within ~60 s. Switching to Vercel ISR with an on-demand bypass token later is contained to the two blog `+page.server.ts` files; revisit only if editors complain |
| Prismic previews | `/preview/…` URLs (the `[[preview=preview]]` segment), `private, no-store` + `noindex`, so drafts never share a CDN entry with public URLs |
| SvelteKit version | Kit 2 (`^2.70`) until `@prismicio/svelte`, `sveltekit-superforms` and `@slicemachine/adapter-sveltekit` support Kit 3 |
| Email templates | Deleted (nothing sent email) |
| Parity | Legal and marketing copy word for word (typos only with sign-off, KI-36); bugs not ported but recorded as KI. Since the site cutover only the copy of the kept pages (blog, Fragebogen) is compared with Next; the visual run and `layout-diff.ts` are retired |

Site cutover (2026-10-21; the landing pages become the site):

| Topic | Decision |
|---|---|
| Kept old pages | Only `/blog` (+ posts and previews) and `/fragebogen`; `/preise` too from its restore (2026-10-23) until its landing design replaced it (2026-10-24, gate §5). They get the landing header and footer; their content keeps its Exo 2 / Tailwind styling, outside `.lp`. `/impressum` and `/datenschutzhinweise` were kept too until the legal pages' designs replaced them (2026-10-21, gate §1; the Datenschutzerklärung moved from `/datenschutz` back to `/datenschutzhinweise` on 2026-10-23) |
| Home | `/` was a **307** to the Germany hub; since the new URLs (2026-10-23) the hub is `/` itself |
| Dropped URLs | None since 2026-10-23: every old URL is a page (`/preise` restored, a landing page since 2026-10-24, the Funkzähler page at `/geraete`, the Datenschutzerklärung at `/datenschutzhinweise`). Until then `/preise` → `/messdienst-wechseln#start` and `/geraete` → `/funkzaehler` 301ed. `/kontakt` did the same until its own design was built there (2026-10-21, gate §9). No link may rely on a redirect (`$lib/landing/links.test.ts`) |
| Go-live gates | Unchanged; `LAUNCHED` (`$lib/landing/launch.ts`) is the one switch for the gated pages' indexing |

Landing pages:

- **Indexing (2026-10-17):** after the cutover every page, every city included, is indexed and in the sitemap. That's why every gate blocks the cutover; until then the new pages are `noindex` and out of the sitemap (cities: only `live: true` ones, Berlin so far).
- **KPIs (confirmed by the business 2026-10-12):** 92 % of installations at the first appointment, 14 days' notice, a 1–2 h window.
- **Landing footer (2026-10-12):** the landing design's own footer (`$lib/landing/footerLinks.ts`), on every page since the site cutover; an entry without `href` is plain text until its page exists.
- **"Demo buchen" (2026-10-21):** every "Demo buchen", and every other link the designs point at the booking design, goes to `/demo` (`DEMO_HREF`, gate §7), which books through Google Calendar. The closing cards whose signup form said "Demo buchen" have their design's video button again and no form; pages whose form has its own label (the city pages, `/messdienst-wechseln`, `/fernablesung-umruesten` …) keep it.
- **Shared sign-offs:** quotes, customer logos and the security block (`TrustSeals`) are the same on every page; they're settled once in the region pages' gate (§46).

## Building a new landing page

The process the earlier pages followed: plan the page in a folder here (README with design reference, links, key decisions, open questions; route and content; sections; interactions; QA), build it in the commits the plan lists (the route goes into `src/routes/(base)/(landing)/`, its `seo` returns `noindex: !LAUNCHED` while its gate is open), add it to `SITE_PAGES` (`$lib/sitePages.ts`, `gated: true`; `sitePages.test.ts` fails without it), add a `CLAUDE.md` paragraph and the Layout entry, add it to the cutover's post-deploy checks if it has a new form or route, then move its go-live gate into [go-live-gates.md](go-live-gates.md) and delete the plan folder (git history keeps it; name the commit in `CLAUDE.md`).
