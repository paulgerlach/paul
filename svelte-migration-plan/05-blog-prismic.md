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

- [ ] **KI-05** (Med): Sitemap has no blog post URLs (phase 2 creates the route, phase 5 adds the Prismic entries)
- [ ] **KI-10** (Med): Empty Prismic route resolver; add the `blogpost` → `/blog/:uid` route
- [ ] **KI-11** (Low): No-op revalidate endpoint; replace with a CDN cache header and delete it
- [ ] **KI-12** (Med): Generic `<title>` on every blog post; use the post title
- [ ] **KI-13** (Low): `id="content relative"` on the blog post `<main>`
- [ ] **KI-14** (Low): `BlogFilters` `cachedPosts` hack; filter with `?tag=` + `load`

## Exit criteria
- `/blog`, `/blog?tag=X`, and every existing `/blog/:uid` render with the same content. 404 for unknown UIDs.
- The nav blog teaser shows the latest posts from SSR.
- A preview from the Prismic dashboard opens a draft on the Svelte preview deployment.
- The Slice Machine simulator renders all 9 slices from mocks.
- All known issues listed above are fixed.
