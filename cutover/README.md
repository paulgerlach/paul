# Site cutover: the landing pages become the website

Plan for turning the `(landing-page)` collection into the whole marketing site. Written 2026-10-21 on `feat/landing-pages` (`2c988932`). A new context should read this file, then work through the phase files in order. Tick the checkboxes in the phase files as you go and commit them with the work.

## Goal

- Every page under `src/routes/(landing-page)/` becomes part of the main site, in the `(base)` route group.
- Of the old (ported Next) pages only **`/blog`** (list + `/blog/[uid]`, with Prismic previews), **`/fragebogen`**, **`/impressum`** and **`/datenschutzhinweise`** stay. Everything else is deleted: the old home, `/preise`, `/geraete`, `/kontakt`, `/kitchen-sink` (the old `/funktionen` is already replaced by the landing `/funktionen`).
- `/` redirects to **`/messdienstanbieter`**.
- Every page, kept old ones included, gets the **landing header and footer** (`LandingHeader` / `LandingFooter`). The old `Header`, `Footer` and `FragebogenHeader` go away.

## Decisions (made with the user, 2026-10-21)

| Topic                      | Decision                                                                                                                                                                                                                                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Legal pages                | `/impressum` and `/datenschutzhinweise` stay (§ 5 DDG / Art. 13 DSGVO; the landing footer and the forms link them). Copy unchanged word for word; they render inside the landing header/footer                                                                                                    |
| Dropped URLs               | 301 to the closest new page: `/preise` → `/messdienstwechsel#start`, `/geraete` → `/funktionen`, `/kontakt` → `/messdienstwechsel#start`. Links in landing content to these URLs are repointed to the same targets (no link may rely on a redirect)                                               |
| Home                       | `/` → `/messdienstanbieter` with **307** (temporary: browsers don't cache it forever, so `/` can become a real page again). Everything else that is dropped: **301**                                                                                                                              |
| Fragebogen                 | Gets the landing header + footer like every other page; its own body is unchanged                                                                                                                                                                                                                 |
| Look of the kept old pages | Only the header and footer change. Their content keeps its Exo 2 / Tailwind styling: it must **not** sit inside the `.lp` wrapper (`.lp *` forces Geist on every element and `.lp` resets headings, buttons, `.sec`, `.wrap`, `.btn` …). See [01-routes-and-layouts.md](01-routes-and-layouts.md) |
| Go-live gates              | Unchanged. This restructure doesn't flip `noindex`; that stays the last cutover step (`ongoing-tasks/cutover.md` §3 step 5), gated by `ongoing-tasks/go-live-gates.md`. Phase 4 prepares it so it's a one-line change                                                                             |
| Parity with Next           | No longer the target for anything but the copy of the kept pages. The visual parity run and `scripts/layout-diff.ts` are retired (every kept page's header/footer changes, every other page is new); the smoke run stays with the new URL list                                                    |

## Target route tree

```
src/routes/
  +layout.svelte            root, unchanged: app.css, Exo 2, <Seo>, <PrismicPreview> on /preview/…
  +error.svelte             root error page ("Zur Startseite" → /messdienstanbieter)
  (base)/
    +layout.svelte          shared: tokens.css, Geist font, ChatBot (no markup of its own)
    +layout.server.ts       the one cache-control (private, no-store on /preview/…)
    (landing)/
      +layout.svelte        today's (landing-page) layout markup: <div class="lp"> header · page · footer
      messdienstwechsel/ … installationstool/   (all 38 landing routes, moved as they are)
      messdienstanbieter/[city=city]/
    (site)/
      +layout.svelte        landing header + footer in `display: contents` .lp wrappers, page content outside .lp
      impressum/
      datenschutzhinweise/
      fragebogen/
      [[preview=preview]]/blog/  (+page, [uid]/)
  api/  robots.txt/  sitemap.xml/  slice-simulator/   unchanged locations
```

`(landing)` and `(site)` are nested groups inside `(base)`: URLs don't change, and the landing pages keep exactly today's DOM (no visual risk for 38 pages and 26 cities). The redirects live in `src/hooks.server.ts`, not in route files.

## Phases

| #   | File                                                 | What                                                                                                                       | Commit(s)                                                     |
| --- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 1   | [01-routes-and-layouts.md](01-routes-and-layouts.md) | Move every route into `(base)/(landing)` or `(base)/(site)`, write the layouts, delete the old routes                      | "Move the site into (base) with the landing layout"           |
| 2   | [02-redirects.md](02-redirects.md)                   | `/` and the dropped URLs redirect, in `hooks.server.ts` from a pure map                                                    | "Redirect the home page and the dropped pages"                |
| 3   | [03-links-and-content.md](03-links-and-content.md)   | Repoint every link to a dropped page, the logo, `/#kunden`; move the constants still needed out of `Header/` and `Footer/` | "Point every link at the new site"                            |
| 4   | [04-seo.md](04-seo.md)                               | Sitemap, robots, SEO defaults, the home JSON-LD, the central noindex switch                                                | "Rebuild the sitemap for the new site"                        |
| 5   | [05-delete-old-code.md](05-delete-old-code.md)       | Delete the old components, styles, forms, assets and dependencies nothing uses                                             | "Delete the old site's code" (may be several)                 |
| 6   | [06-tests-and-tooling.md](06-tests-and-tooling.md)   | e2e, unit tests, parity tooling, CI                                                                                        | with each phase where it breaks, plus "Test the site cutover" |
| 7   | [07-docs.md](07-docs.md)                             | `CLAUDE.md`, `ongoing-tasks/`, delete this folder                                                                          | "Record the site cutover"                                     |
| 8   | [08-qa.md](08-qa.md)                                 | Checks before handing over                                                                                                 | —                                                             |

`reach.ts` is a helper for phase 5 (`bun cutover/reach.ts` lists every `src/lib` file nothing imports).

Each phase ends with `bun run check`, `bun run lint`, `bun run test:unit` and `bun run build` green. Run the affected e2e specs (`bunx playwright test e2e/<spec>`) where the phase touches a page; the full `bun run test:e2e` at the end of phases 1, 3 and 6.

## Working rules

- Branch `feat/site-cutover` off `feat/landing-pages`. Don't push or open a PR without asking.
- Move files with `git mv` so history follows them. Route files import `./$types`; the generated types follow the move after `bun run check` (or `svelte-kit sync`).
- Restart the dev server after moving routes (a running one reports stale hydration errors).
- Follow `CLAUDE.md` conventions (runes only, no `$effect` for derived state, `ROUTE_*` constants, no per-page `cache-control`, `<Seo>` only in the root layout).
- Don't change landing page markup or styles beyond what a phase lists. Don't change legal copy.
- Unsure whether a file is still used: run the reachability check in [05-delete-old-code.md](05-delete-old-code.md) instead of guessing.

## Definition of done

- [ ] `/` answers 307 → `/messdienstanbieter`; `/preise`, `/geraete`, `/kontakt` answer 301 → their targets (also with a trailing slash and a query string)
- [ ] Every landing page, every city, `/blog`, a blog post, `/preview/blog/<uid>`, `/fragebogen`, `/impressum`, `/datenschutzhinweise` answer 200 with the landing header and footer, and nothing else under `src/routes` renders a page except `/slice-simulator`
- [ ] No link in `src/` points at `/`, `/preise`, `/geraete`, `/kontakt` or `/#…` (checked by a test, [06](06-tests-and-tooling.md))
- [ ] No file under `src/lib/components/Header`, `src/lib/components/Footer`, nor any other component only the dropped pages used
- [ ] `check`, `lint`, `test:unit`, `build`, `test:e2e` green; no hydration warnings or console errors on any page
- [ ] `CLAUDE.md` and `ongoing-tasks/` describe the new structure; this folder is deleted in the last commit
