# Phase 2: redirects

`/` and the dropped pages redirect before routing, from one pure map in `src/hooks.server.ts`. A `handle` hook (not `+page.server.ts` files) because the routes no longer exist and because one map is easy to test and to extend.

## Map

| From       | To                         | Status | Why                                                                                                                       |
| ---------- | -------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------- |
| `/`        | `/messdienstanbieter`      | 307    | The new home. Temporary so browsers don't cache it forever (`/` may become a page again)                                  |
| `/preise`  | `/messdienstwechsel#start` | 301    | No pricing page; the signup form gets the offer (the city FAQ's "Angebot" link did the same)                              |
| `/geraete` | `/funktionen`              | 301    | The devices are described there ("Digitale Funkablesung"); the "Funkzähler" design (`3SRjNA9CRSPQEU3cWdAkbt`) isn't built |
| `/kontakt` | `/messdienstwechsel#start` | 301    | The contact design (`2eHVk9HEFKh1F7pWbMnkWb`) isn't built; the signup form is the contact route of every landing page     |

When the Funkzähler or Kontakt page gets built, change its row here (and the links in phase 3) to the new page.

Old Next URLs beyond these: the baseline sitemap (`seo-baseline/sitemap.xml`) lists only `/`, `/funktionen`, `/preise`, `/geraete`, `/kontakt`, `/blog`, `/impressum`, `/datenschutzhinweise` and blog posts, so the map covers every indexed URL. `/kitchen-sink` already 404s in production; let it 404.

## Steps

- [ ] **2.1 `src/lib/server/redirects.ts`** (pure, no SvelteKit imports):
  ```ts
  /** Old URLs of the site and where they live now (phase 2 of the site cutover). */
  export const REDIRECTS: Record<string, { to: string; status: 301 | 307 }> = {
  	"/": { to: ROUTE_MESSDIENSTANBIETER, status: 307 },
  	[ROUTE_PREISE]: { to: `${ROUTE_MESSDIENSTWECHSEL}#start`, status: 301 },
  	…
  };
  /** The redirect for a path, ignoring one trailing slash; null if none. */
  export function redirectFor(pathname: string): { to: string; status: number } | null
  ```
  Normalise a trailing slash (`/preise/` → `/preise`, but `/` stays `/`). Keep the visitor's query string (`?utm_source=…`) on the target, inserted **before** the `#fragment`: `/preise?x=1` → `/messdienstwechsel?x=1#start`. `ROUTE_PREISE`, `ROUTE_GERAETE`, `ROUTE_KONTAKT` stay in `$lib/routes.ts` for this map only; give them a comment saying so (they're no pages any more).
- [ ] **2.2 `src/hooks.server.ts`**: add `handle` next to the existing `handleError`:
  ```ts
  export const handle: Handle = ({ event, resolve }) => {
  	const hit = redirectFor(event.url.pathname);
  	if (!hit) return resolve(event);
  	return new Response(null, {
  		status: hit.status,
  		headers: {
  			location: withQuery(hit.to, event.url.search),
  			"cache-control": "s-maxage=3600, stale-while-revalidate=86400",
  		},
  	});
  };
  ```
  Return a `Response` instead of throwing `redirect()`: the hook runs outside load, and this sets the CDN cache header explicitly (redirects are as cacheable as the sitemap). Only `GET` and `HEAD` redirect; other methods fall through to `resolve` (a `POST /kontakt` from a stale cached old page then gets SvelteKit's 404/405, which is fine).
- [ ] **2.3 `src/lib/server/redirects.test.ts`**: every row, a trailing slash, a query string with and without a fragment target, an unknown path (null), `/preview` and `/blog` (null).
- [ ] **2.4 e2e** (in a new `e2e/site.e2e.ts`, see phase 6): `request.get(path, { maxRedirects: 0 })` for every row asserts status and `location`; `page.goto("/")` ends on `/messdienstanbieter` with 200.
- [ ] **2.5 Vercel**: nothing in `vercel.json` (there is none); the redirect is served by the function and then by the CDN. Check on the preview deployment (phase 8) that a cached `/` still redirects and that `/messdienstanbieter`'s own `cache-control` is untouched.
