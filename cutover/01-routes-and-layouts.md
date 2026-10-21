# Phase 1: routes and layouts

Move every page into `(base)`, give every page the landing header and footer, delete the old routes. Target tree: [README.md](README.md#target-route-tree).

## Today

| Where                                                     | What                                                                                                                                                                              |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/routes/(landing-page)/+layout.svelte`                | tokens.css, Geist `@font-face` + preload, `<div class="lp">` with `LandingHeader` (texts from `page.data.landing ?? DEFAULT_CHROME`) · children · `LandingFooter`, then `ChatBot` |
| `src/routes/(landing-page)/+layout.server.ts`             | `cache-control: s-maxage=60, stale-while-revalidate=600`                                                                                                                          |
| `src/routes/[[preview=preview]]/(base)/+layout.svelte`    | old `Header` (with the Prismic blog teaser), `Footer`, `svelte-sonner` `Toaster`                                                                                                  |
| `src/routes/[[preview=preview]]/(base)/+layout.server.ts` | cache-control (`private, no-store` on `/preview/…`) + `getNavPosts` for the old header's Blog dropdown                                                                            |
| `src/routes/[[preview=preview]]/(service)/+layout.svelte` | `FragebogenHeader`, `ChatBot`                                                                                                                                                     |
| `[[preview=preview]]/(base)/` pages                       | `+page.svelte` (home), `blog/`, `blog/[uid]/`, `datenschutzhinweise/`, `geraete/`, `impressum/`, `kitchen-sink/`, `kontakt/`, `preise/`                                           |
| `[[preview=preview]]/(service)/fragebogen/`               | the questionnaire                                                                                                                                                                 |

Only the blog reads Prismic, so only the blog needs the `[[preview=preview]]` segment. `fragebogen`, `impressum` and `datenschutzhinweise` don't (checked: no Prismic imports); moving them out of the segment drops the meaningless `/preview/fragebogen` etc. URLs.

## Why two inner groups

`LandingHeader`'s `nav.top` is `position: sticky`, so it only sticks while its parent box is on screen. Today that parent is the one `.lp` div around header, page and footer. The kept old pages must not sit inside `.lp` (it restyles everything, see README decisions), so for them the header and footer each get their own `.lp` wrapper with `display: contents`: the wrapper creates no box (sticky then works against `<body>`), but custom properties (`--ink`, `--line`, `--lp-font` …) and `.lp …` selectors still apply, since inheritance and selector matching follow the DOM, not the boxes. The landing pages keep exactly today's single wrapper.

## Steps

- [ ] **1.1 Branch.** `git switch -c feat/site-cutover`.
- [ ] **1.2 Create `(base)` and move the landing routes.**
  ```sh
  mkdir -p "src/routes/(base)"
  git mv "src/routes/(landing-page)" "src/routes/(base)/(landing)"
  ```
  Every landing route and `messdienstanbieter/[city=city]` now lives in `(base)/(landing)/`. Its `+layout.svelte` stays (rework in 1.4); delete its `+layout.server.ts` (`git rm`), the cache header moves up in 1.3. SvelteKit throws if two loads set the same header, so there must be exactly one `cache-control` writer.
- [ ] **1.3 `(base)/+layout.server.ts`**: the one cache-control for the whole site:
  ```ts
  export const load = async ({ params, setHeaders }) => {
  	// Pages in this group must not set cache-control themselves. Preview URLs
  	// (/preview/…, only the blog has them) show drafts and are never cached.
  	setHeaders({
  		"cache-control": params.preview
  			? "private, no-store"
  			: "s-maxage=60, stale-while-revalidate=600",
  	});
  };
  ```
  Layout loads receive the matched route's params, so `params.preview` is set on `/preview/blog/…` even though the segment sits below this layout. The existing e2e test "preview URLs are private, noindex and load the Prismic toolbar" (`e2e/blog.e2e.ts`) proves it; if `params.preview` turns out undefined there, use `url.pathname.startsWith("/preview/")`. No `getNavPosts`: the landing nav reads no Prismic data (`CLAUDE.md`).
- [ ] **1.4 `(base)/+layout.svelte`**: what both groups share, taken from the old landing layout: the `tokens.css` import, the Geist `@font-face` string + preload `<link>`, and `<ChatBot isExistingClient={false} />` after `{@render children()}`. No wrapper markup. Then `(base)/(landing)/+layout.svelte` keeps only the `.lp` div with header · children · footer and the `chrome` derivation (`page.data.landing ?? DEFAULT_CHROME`), as today. Its comments move with the code they describe.
- [ ] **1.5 `(base)/(site)/+layout.svelte`** for the kept old pages:
  ```svelte
  <div class="lp lp-chrome" data-dev={dev || undefined}>
  	<LandingHeader
  		bannerText={chrome.bannerText}
  		bannerHref={chrome.bannerHref}
  		demoHref={chrome.demoHref}
  	/>
  </div>
  {@render children()}
  <div class="lp lp-chrome">
  	<LandingFooter />
  </div>
  ```
  `.lp-chrome { display: contents; }` in a `<style>` block (`:global` not needed, the class is on this component's own elements). These pages return no `landing`, so the header shows `DEFAULT_CHROME`: its "Demo buchen" defaults to `DEMO_HREF` = `#start`, which doesn't exist on these pages. Leave `DEFAULT_CHROME` as it is (it's also the error fallback); instead set the site layout's `demoHref` to `` `${ROUTE_MESSDIENSTWECHSEL}#start` `` (the same fallback `/karriere` and the partner pages use). Check the footer's "Demo buchen" (`footerGroups` → `DEMO_HREF`) and the newsletter on these pages too: a `#start` link that goes nowhere must point to `/messdienstwechsel#start` here (pass a prop to `LandingFooter` if needed, the way `TrustSeals` got `demoHref`).
  Check the footer's `margin-top: -28px` overlap (it pulls the dark footer over the page's last 28 px): on the old pages the last block is Exo 2 content (`Subscription` on blog/legal, the questionnaire's `main` with `pb-24`); if the overlap cuts content, add bottom padding on the site layout side, not in `LandingFooter`.
- [ ] **1.6 Move the kept old pages.**
  ```sh
  B="src/routes/[[preview=preview]]/(base)"
  S="src/routes/(base)/(site)"
  mkdir -p "$S/[[preview=preview]]"
  git mv "$B/blog" "$S/[[preview=preview]]/blog"
  git mv "$B/impressum" "$S/impressum"
  git mv "$B/datenschutzhinweise" "$S/datenschutzhinweise"
  git mv "src/routes/[[preview=preview]]/(service)/fragebogen" "$S/fragebogen"
  ```
- [ ] **1.7 Delete the old routes.** `git rm -r` the home `+page.svelte`, `geraete/`, `kontakt/`, `preise/`, `kitchen-sink/`, both old layouts and `+layout.server.ts`, then the now-empty `[[preview=preview]]/` tree at the routes root. `/` then has no page: phase 2 redirects it before routing, so it never 404s. Until phase 2 lands, `/` 404s; commit phases 1 and 2 close together.
- [ ] **1.8 Error page.** `src/routes/+error.svelte` stays at the root (unknown URLs match no group and render only with the root layout). Change its "Zur Startseite" `href="/"` to `ROUTE_MESSDIENSTANBIETER`. Giving 404s the landing chrome is out of scope; note it as a follow-up in `ongoing-tasks/cutover.md` §5.
- [ ] **1.9 SEO defaults.** The old `(base)` / `(service)` layouts are mentioned in `$lib/seo/site.ts` ("Values the `(base)` and `(service)` layouts override …"); `Seo.svelte` picks `DEFAULT_TITLE` itself, so nothing breaks; fix the comment. Detailed SEO work is phase 4.
- [ ] **1.10 Check the four kept pages at 375 / 768 / 1440 px** (`bun run dev`): header sticky while scrolling, mega menu opens over the content (z-index 50 vs. anything in `app.css`), mobile menu opens and locks scrolling, footer intact, page content unchanged except where the old header/footer were. `app.css` has global rules for the old header (e.g. `body` padding or offsets for a fixed header): search `app.css` for rules that only made sense with the old `Header` and remove them in phase 5, but fix here anything that visibly breaks.
- [ ] **1.11 Fragebogen specifics.** `FragebogenHeader` linked the logo to `/` and may show a phone/close button; the landing header replaces it. The questionnaire's `main` had `pt-8` under a short header; check its spacing under the taller landing header (banner + 64 px nav). Lottie animations still start (`LazyLottie`). The final "done" state still renders. `/fragebogen` stays out of the sitemap and disallowed in robots.
- [ ] **1.12 Blog specifics.** Blog list, `?tag=` filter, a post, an unknown post (404), `/preview/blog/<uid>` with the Prismic toolbar. The old header's Blog dropdown (KI-07, the server-rendered teaser) is gone with it; the landing nav's "Blog" entry links `/blog`.
- [ ] **1.13** `bun run check && bun run lint && bun run build`, then `bunx playwright test e2e/blog.e2e.ts e2e/messdienstanbieter.e2e.ts e2e/messdienstwechsel.e2e.ts`. Old-page tests that now fail (foundation, shared-components) are handled in phase 6; don't delete them yet unless they block the commit, and say so in the commit message.
