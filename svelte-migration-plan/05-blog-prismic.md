# Phase 5: Blog & Prismic

**Goal:** blog list with tag filter, blog detail rendered from slices, Prismic previews, and the Slice Machine simulator, all on `@prismicio/svelte`.

## 5.1 Slice Machine adapter

`web/slicemachine.config.json`:
```json
{
  "repositoryName": "heidisystems",
  "adapter": "@slicemachine/adapter-sveltekit",
  "libraries": ["./src/lib/slices"],
  "localSliceSimulatorURL": "http://localhost:5173/slice-simulator"
}
```
- Copy `customtypes/` and each slice's `model.json` + `mocks.json` unchanged. They are framework-agnostic.
- Run `bun run slicemachine` once. It regenerates `src/lib/slices/index.ts` (the Svelte component map) and `prismicio-types.d.ts`.
- Don't push models from the new app until cutover. Both apps share the same Prismic repository, so a model change affects the live site.

## 5.2 Prismic client

```ts
// src/lib/prismicio.ts
import { createClient as baseCreateClient, type ClientConfig, type Route } from '@prismicio/client';
import { enableAutoPreviews, type CreateClientConfig } from '@prismicio/svelte/kit';
import { PUBLIC_PRISMIC_ENVIRONMENT } from '$env/static/public';
import sm from '../../slicemachine.config.json';

export const repositoryName = PUBLIC_PRISMIC_ENVIRONMENT || sm.repositoryName;

const routes: Route[] = [{ type: 'blogpost', path: '/blog/:uid' }];   // fills the TODO left in Next

export const createClient = ({ cookies, ...config }: CreateClientConfig = {}) => {
  const client = baseCreateClient(repositoryName, { routes, ...config });
  enableAutoPreviews({ client, cookies });
  return client;
};
```
- Always pass SvelteKit's `fetch` (from `load`/`RequestEvent`) so requests are deduped and inlined into the SSR payload.
- The client is **server-only in practice**: `Nav` and `BlogFilters` no longer call Prismic from the browser.

## 5.3 Caching and revalidation

Today, production uses `next: { tags: ['prismic'], revalidate: 0 }`, so every request hits Prismic, and `/api/revalidate` busts a tag cache that effectively isn't used.

**Decision: Option A** (README decisions log #3). Option B is kept below for reference in case editors need instant publishing later.

- **Option A (chosen):** SSR the blog routes and set CDN caching in `load`:
  ```ts
  setHeaders({ 'cache-control': 'public, s-maxage=60, stale-while-revalidate=600' });
  ```
  Drop `/api/revalidate` and remove the Prismic webhook.
- **Option B (Vercel ISR; not chosen, fallback):** set `export const config = { isr: { expiration: false, bypassToken: ISR_BYPASS_TOKEN } }` in the blog `+page.server.ts`. Point the Prismic webhook at a `+server.ts` that re-requests the affected paths with the `x-prerender-revalidate` header.

Both options are strictly fresher-or-equal to today's behaviour, apart from the ≤60s staleness in Option A.

## 5.4 Data layer

```ts
// src/lib/server/blog.ts
import * as prismic from '@prismicio/client';
import { createClient } from '$lib/prismicio';

type Ctx = { fetch: typeof fetch; cookies?: import('@sveltejs/kit').Cookies };

export const getAllBlogPosts = ({ fetch, cookies }: Ctx, tags?: string[]) =>
  createClient({ fetch, cookies }).getAllByType('blogpost', {
    orderings: { field: 'document.first_publication_date', direction: 'desc' },
    filters: tags?.length ? [prismic.filter.any('document.tags', tags)] : []
  });

export const getLatestPosts = async (ctx: Ctx & { limit: number }) =>
  (await createClient(ctx).getByType('blogpost', {
    pageSize: ctx.limit,
    orderings: { field: 'document.first_publication_date', direction: 'desc' }
  })).results;
```

## 5.5 Routes

**`/blog`** (`+page.server.ts`)
```ts
export const load = async ({ fetch, cookies, url }) => {
  const tag = url.searchParams.get('tag');
  const [newest, filtered] = await Promise.all([
    getLatestPosts({ fetch, cookies, limit: 3 }),
    getAllBlogPosts({ fetch, cookies }, tag ? [tag] : undefined)
  ]);
  return { newest, filtered, activeTag: tag ?? 'Alle' };
};
```
- `NewestBlogs` (an async RSC) becomes a plain component that receives `newest` as a prop.
- `BlogFilters` (React Query plus a `cachedPosts` state hack) renders the tags as `<a href="?tag=X" data-sveltekit-noscroll data-sveltekit-replacestate>`. Filtering then works without JS, gives shareable URLs, and re-runs `load` on click. The tag list itself can be derived from all posts' `tags`.

**`/blog/[uid]`** (`+page.server.ts`)
```ts
import { error } from '@sveltejs/kit';
export const load = async ({ params, fetch, cookies }) => {
  const client = createClient({ fetch, cookies });
  const page = await client.getByUID('blogpost', params.uid).catch(() => error(404));
  const recommended = (await getLatestPosts({ fetch, cookies, limit: 4 })).filter(p => p.uid !== params.uid).slice(0, 3);
  return { page, recommended };
};
```
`+page.svelte`:
```svelte
<script lang="ts">
  import { SliceZone } from '@prismicio/svelte';
  import { components } from '$lib/slices';
  import { asImageSrc } from '@prismicio/client';
  let { data } = $props();
</script>
<Seo title="Heidi Systems" description={data.page.data.meta_description ?? undefined} ogImage={asImageSrc(data.page.data.meta_image) ?? undefined} />
<main id="content" class="relative">
  <SliceZone slices={data.page.data.slices} {components} context={data.page} />
  <RecommendedPosts posts={data.recommended} />
</main>
```
Also fix the title: use the post title instead of the generic "Heidi Systems". It is free SEO.


## 5.6 Slices (9)

For each `src/slices/X/index.tsx` → `src/lib/slices/X/index.svelte`:
```svelte
<script lang="ts">
  import type { Content } from '@prismicio/client';
  import type { SliceComponentProps } from '@prismicio/svelte';
  type Props = SliceComponentProps<Content.BlogImageSlice>;
  let { slice, context }: Props = $props();
</script>
```
- `<PrismicRichText field>` → the Svelte `PrismicRichText` with a `components` map for custom serializers (`RichTextBlockImage`).
- `next/image` on Prismic URLs → `<PrismicImage field={slice.primary.blogMainImage} class="…" />`.
- **`BlogAuthor`** fetches the author document inside the slice and calls `notFound()`. Slices can't do async server work in Svelte. Resolve the author in the page `load` instead, either with `graphQuery`/`fetchLinks` on `getByUID` or a second query. Pass it through `context`.
- `context.tags` usage in `BlogImage` keeps working because `context={data.page}`.
- Rename `BussinessText` only if the Prismic slice ID is renamed too. Otherwise keep the typo.

## 5.7 Previews

```ts
// routes/api/preview/+server.ts
import { redirectToPreviewURL } from '@prismicio/svelte/kit';
export const GET = (event) => redirectToPreviewURL({ client: createClient(event), event });
```
```ts
// routes/api/exit-preview/+server.ts: delete the preview cookie, then redirect to "/"
```
Add `<PrismicPreview {repositoryName} />` to the root layout. Responses must not be CDN-cached when the preview cookie is present: in the blog `load` functions, set `cache-control: private, no-store` instead of the `s-maxage` header when `cookies.get('io.prismic.preview')` exists. Put this in a shared `setBlogCacheHeaders(event)` helper.

Update the preview URL in the Prismic dashboard at cutover.

## 5.8 Slice simulator

`src/routes/slice-simulator/+page.svelte` using `SliceSimulator` from `@slicemachine/adapter-sveltekit/simulator`. Add `noindex`.

## Known issues fixed in this phase
Details are in [known-issues.md](known-issues.md). Tick them there as well.

- [x] **KI-05** (Med): Sitemap has no blog post URLs (phase 2 creates the route, phase 5 adds the Prismic entries)
- [x] **KI-10** (Med): Empty Prismic route resolver; add the `blogpost` → `/blog/:uid` route
- [x] **KI-11** (Low): No-op revalidate endpoint; replace with a CDN cache header and delete it
- [x] **KI-12** (Med): Generic `<title>` on every blog post; use the post title
- [x] **KI-13** (Low): `id="content relative"` on the blog post `<main>`
- [x] **KI-14** (Low): `BlogFilters` `cachedPosts` hack; filter with `?tag=` + `load`

## Status (done 2026-10-02)

Blog list, tag filter, post pages, all 9 slices, previews and the slice simulator are ported. Data comes from `$lib/server/blog.ts`. Prismic images use `$lib/components/Basic/Image/CmsImage.svelte`.

**Verification** (against the live Prismic repo: 236 posts, 2 authors):
- **Text:** the visible text of `/blog` and two sample posts matches Next word for word. Next's list is filled client-side, so I compared the rendered DOM in a browser.
- **Layout:** post pages match Next's layout boxes at 375 / 768 / 992 / 1200 / 1640px.
  - On `/blog`, cards match once their images have loaded (same heights and natural size).
  - Before loading, Next's remote images are `width="0" height="0"` and take no space, so the page shifts as they arrive. `CmsImage` reserves the aspect ratio up front (no layout shift).
- **Tag filter:** `?tag=Produkt` returns 51 posts, the same count as the Prismic query. The scroll position is kept, and "Alle" goes back to all 236.
- **Slice simulator:** a harness drives `/slice-simulator` with `SimulatorClient` from `@prismicio/simulator`, the same protocol Slice Machine uses, sending every slice's `mocks.json`. All 9 slices render with no console errors.
- **e2e:** `e2e/blog.e2e.ts` covers the tag filter, meta title, document links, 404, preview headers and toolbar, and the simulator. `bunx playwright test` passes (16 tests).
- **Not tested end to end:** opening a real draft from the Prismic dashboard. That needs an editor session and the dashboard's preview URL pointing at a Svelte deployment. Do it on the first preview deployment (exit criterion).

**Differences from the steps above:**
- **Previews use `/preview/…` URLs instead of only a cookie** (decisions log #7). The route groups live under `src/routes/[[preview=preview]]/` (matcher in `src/params/preview.ts`). `redirectToPreviewURL` sends editors to `/preview/blog/<uid>`, and `<PrismicPreview>` keeps them there while they navigate.
  - The `(base)` layout sets `private, no-store` for preview URLs and `s-maxage=60` otherwise. `Seo.svelte` adds `noindex` for preview URLs.
  - The cookie-only design in 5.7 can't work behind the CDN: Vercel caches by URL, so a cached public page would be served to an editor holding the preview cookie.
  - `<PrismicPreview>` (and its toolbar script) is rendered only on preview URLs, so regular visitors don't load it. Next had no `<PrismicPreview>` at all.
- **Pages get post summaries, not documents** (`PostSummary`: uid, title, subtitle, date, tags, image). `/blog` needs one query: newest 3, the tag list (from all posts, so it doesn't shrink while filtering) and the filtered list. Payload: 118 KB raw / 24 KB gzipped for all 236 posts. Next fetched full documents, rich text included, in the browser.
- **Post title** is `meta_title` (filled on all 236 posts), falling back to "Heidi Systems". og/twitter title and description follow the page, as in Next.
- **Rich-text links to other posts** now resolve (`/blog/<uid>`). In Next they render as `href=""` because of the empty route resolver (KI-10).
- **BlogAuthor:** the author is resolved in `getBlogPost` and passed in `context` with the post's tags. A broken author link skips the section instead of 404-ing the whole post as Next did. With no context (slice simulator), it renders a labelled placeholder.
- **Images:** `CmsImage` builds an imgix srcset with Next's `deviceSizes` and `fit=max` (no upscaling, like Next's optimizer), so natural sizes, and with them layouts, match next/image. GIFs in rich text are served as-is, as with Next's `unoptimized`.
- **Slice simulator:** Next's `public/slice-simulator/page.tsx` was never a route, so the simulator didn't work there. The Svelte route uses the adapter's `SliceSimulator`; its slot props reach a Svelte 5 `children` snippet through Svelte's slot interop.
- **`/api/revalidate` is not ported (KI-11).** Remove the Prismic webhook that calls it at cutover.
- **`robots.txt`** also disallows `/preview/` and `/slice-simulator`. The sitemap caches for an hour (`s-maxage=3600`).
- **Slice Machine:** `customtypes/` and the slice models/mocks are copied unchanged. `src/lib/slices/index.ts` was written by hand in the adapter's generated format; running Slice Machine regenerates the same file. Models were not pushed.
- **`foundation.e2e.ts` was failing since phase 4.** It asserted `<picture><source type="image/avif">`, which the `Image.svelte` rework removed, and the e2e suite wasn't run before that commit. It now asserts the WebP `<img>`. The sitemap test now expects blog URLs.

## Exit criteria
- `/blog`, `/blog?tag=X`, and every existing `/blog/:uid` render with the same content. 404 for unknown UIDs.
- The nav blog teaser shows the latest posts from SSR.
- A preview from the Prismic dashboard opens a draft on the Svelte preview deployment.
- The Slice Machine simulator renders all 9 slices from mocks.
- All known issues listed above are fixed.
