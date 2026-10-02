# Phase 2: Foundation

**Goal:** layouts, global styles, font, assets, SEO plumbing and error handling are in place, so that pages can be dropped in.

## 2.1 Route skeleton

```
web/src/
├── app.html
├── app.css                      # merged globals (see 2.3)
├── routes/
│   ├── +layout.svelte           # imports app.css, font, default <Seo>
│   ├── +error.svelte            # replaces error.tsx + not-found.tsx
│   ├── (base)/
│   │   ├── +layout.svelte       # Header, Footer, Toaster
│   │   └── +layout.server.ts    # nav blog posts (phase 5)
│   ├── (service)/
│   │   ├── +layout.svelte       # FragebogenHeader, ChatBot
│   │   └── service.css
│   ├── robots.txt/+server.ts
│   └── sitemap.xml/+server.ts
└── lib/
    ├── assets/                  # ← src/asset/*
    ├── animations/              # ← src/animations/*
    ├── components/
    ├── server/
    └── seo/Seo.svelte
```

Route groups `(base)` and `(service)` behave exactly as they do in Next: they add no URL segment.

## 2.2 `app.html`

```html
<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="%sveltekit.assets%/favicon.ico" />
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

`data-sveltekit-preload-data="hover"` gives roughly the same behaviour as `next/link` prefetching.

## 2.3 Global CSS

1. Diff `app/(base)/globals.css` (1194 lines) against `app/(service)/globals.css` (840 lines). Put shared rules plus the `@theme` block in `src/app.css`. Put only what is unique to Fragebogen in `routes/(service)/service.css`, imported from the service layout.
2. Keep the top imports:
   ```css
   @import "tailwindcss";
   @import "swiper/css";
   @import "swiper/css/navigation";
   @import "swiper/css/pagination";
   ```
   Consider moving the Swiper CSS imports into the swiper attachment module so pages without a carousel don't load it.
3. Keep the `@theme` tokens **verbatim**, including `--breakpoint-*: initial` and the custom `small/medium/large/megalarge/xl` breakpoints. All `max-medium:` and similar classes depend on them.
4. Tailwind v4 auto-detects sources. If any class names are built dynamically in TS, add `@source "../src/lib/**/*.ts";`.

## 2.4 Font (replaces `next/font/google`)

```ts
// src/routes/+layout.svelte
import '@fontsource-variable/exo-2';
import exo2Woff2 from '@fontsource-variable/exo-2/files/exo-2-latin-wght-normal.woff2?url';
```
```svelte
<svelte:head>
  <link rel="preload" as="font" type="font/woff2" href={exo2Woff2} crossorigin="anonymous" />
</svelte:head>
```
In `app.css`:
```css
:root { --font-exo_2-sans: 'Exo 2 Variable', system-ui, arial, sans-serif; }
```
`--font-sans: var(--font-exo_2-sans)` in `@theme` then keeps working. Remove the second `Exo_2()` instance in `ChatBot/index.tsx`; it is redundant.

## 2.5 Images and static assets

**Static files:** move `public/*` → `web/static/*` (videos, favicon, `gmail.png`, `doc_download.png`, etc.). Don't copy unused files (decided; KI-06). Before dropping each candidate (`data/*.csv`, `next.svg`, `vercel.svg`, `globe.svg`, `file.svg`, `window.svg`, `folder_icon.svg`, `pdf_icon.png`, `admin_logo.png`, `doc_download.png`), grep `src/` for its file name. Copy only what is referenced. Also skip `public/slice-simulator/` (it becomes a route in phase 5).

**Imported images** (`src/asset/*`, about 170 files, used through `static/icons.ts` plus direct imports in 53 files that use `next/image`):

1. Move them to `src/lib/assets/`.
2. Convert `icons.ts` mechanically:
   ```bash
   sed -E 's#from "@/asset/([^"]+\.(png|jpg|jpeg|webp))"#from "$lib/assets/\1?enhanced"#' icons.ts
   sed -E 's#from "@/asset/([^"]+\.svg)"#from "$lib/assets/\1"#' icons.ts   # SVGs stay plain URLs
   ```
3. Replacement rules for `<Image>`:

   | Next | Svelte |
   |---|---|
   | `<Image src={importedPng} alt="x" className="…" />` | `<enhanced:img src={importedPng} alt="x" class="…" />` |
   | `priority` (LCP/hero) | `fetchpriority="high" loading="eager"` |
   | `sizes="…"` | `sizes="…"` (also pass `?w=640;1280;1920` in the import if multiple widths are needed) |
   | `fill` | wrap in a `relative` container and give the image `class="absolute inset-0 size-full object-cover"` |
   | `width={0} height={0} sizes="100vw"` | drop the width/height props |
   | Imported SVG | `<img src={svgUrl} alt="" width=… height=… />` |
   | Remote Prismic image | `<PrismicImage field={…} />` (phase 5) |
   | `api.qrserver.com` (emails only) | plain `<img>` |

4. `enhanced:img` only works with a **static `?enhanced` import or a string literal**. Where a component receives an icon via props, type the prop as `Picture` (`import type { Picture } from 'vite-imagetools'`) and render `<enhanced:img src={icon} />`. That works because the value is still the imported object.
5. Add a lint check (grep in CI) that no `next/image` remains.

## 2.6 SEO / metadata

Next's `metadata` objects become a single `Seo.svelte` component:

```svelte
<!-- src/lib/seo/Seo.svelte -->
<script lang="ts">
  import { page } from '$app/state';
  const SITE = 'https://heidisystems.com';
  let {
    title = 'Heidi Systems | Fernablesbare Funkzähler für Warmwasser, Kaltwasser & Heizung',
    description = 'Digitale Erfassung aller Verbrauchsdaten im Gebäude. …',
    ogTitle, ogDescription, ogImage, noindex = false
  }: { title?: string; description?: string; ogTitle?: string; ogDescription?: string; ogImage?: string; noindex?: boolean } = $props();
  const canonical = $derived(SITE + page.url.pathname);
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  <link rel="alternate" hreflang="de-DE" href={canonical} />
  <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow,max-video-preview:-1,max-image-preview:large,max-snippet:-1'} />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="de_DE" />
  <meta property="og:site_name" content="Heidi Systems" />
  <meta property="og:url" content={canonical} />
  <meta property="og:title" content={ogTitle ?? title} />
  <meta property="og:description" content={ogDescription ?? description} />
  {#if ogImage}<meta property="og:image" content={ogImage} />{/if}
</svelte:head>
```

- Before porting, **snapshot the current `<head>`** of every route: `curl -s localhost:3000/<path> | grep -E '<title|<meta|<link rel="(canonical|alternate)'` → `seo-baseline/<route>.txt`. Phase 10 diffs against these files.
- Watch the layering: today the `(base)` layout overrides `title` to plain "Heidi Systems" and replaces the root description. Reproduce the **effective** values per route, not the declared ones.
- The Google `verification` meta currently holds the placeholder `"your-google-verification-code"`. Drop it, or replace it with the real code.

## 2.7 Error page

`+error.svelte` merges `error.tsx` and `not-found.tsx`:
```svelte
<script lang="ts">
  import { page } from '$app/state';
</script>
{#if page.status === 404}
  <!-- "Seite nicht gefunden" markup + link to "/" -->
{:else}
  <!-- "Ein Fehler ist aufgetreten!" + "Nochmal versuchen" (location.reload()) + "Zurück" (history.back()) -->
{/if}
```
Convert the inline `style={{…}}` objects to Tailwind classes. Log server errors in `src/hooks.server.ts` with `handleError`.

## 2.8 robots.txt and sitemap.xml

```ts
// routes/robots.txt/+server.ts
export const prerender = true;
export const GET = () => new Response(
`User-agent: *
Allow: /
Disallow: /api/
Disallow: /fragebogen

Sitemap: https://heidisystems.com/sitemap.xml
`, { headers: { 'content-type': 'text/plain' } });
```
`sitemap.xml/+server.ts` builds the same 8 URLs with `changefreq` and `priority`. **Improvement:** also add `/blog/:uid` entries from Prismic (`getAllByType('blogpost')`), and use each post's `last_publication_date` as `lastmod`.

## 2.9 Layouts

- `(base)/+layout.svelte`: `<Header posts={data.navPosts} />`, `{@render children()}`, `<Footer />`, `<Toaster />`. There is no QueryProvider.
- `(service)/+layout.svelte`: `<FragebogenHeader />`, `{@render children()}`, `<ChatBot isExistingClient={false} />`. There is no Suspense wrapper; Svelte SSR doesn't need it.

Use stub Header/Footer components until phase 3 lands.

## Known issues fixed in this phase
Details are in [known-issues.md](known-issues.md). Tick them there as well.

- [x] **KI-01** (Med): robots.txt disallows the wrong path; should be `/fragebogen`
- [x] **KI-02** (Med): `/fragebogen` loads both global stylesheets; merge into `app.css` + `service.css`
- [x] **KI-03** (Low): Placeholder Google verification meta tag
- [x] **KI-04** (Low): Exo 2 font instantiated twice
- [ ] **KI-05** (Med): Sitemap has no blog post URLs (phase 2 creates the route, phase 5 adds the Prismic entries). Route done; Prismic entries are still open
- [x] **KI-28** (High): Every page canonicalises to the home page (found while taking the SEO baseline)
- [x] **KI-06** (Low): Unused `public/` files: don't copy them to `static/`

## Status (done 2026-10-02)

All exit criteria are met. The checks live in `web/e2e/foundation.e2e.ts`. Differences from the steps above:
- **SEO baseline:** captured from a production build of the Next app in `seo-baseline/` at the repo root (one file per route, plus `robots.txt` and `sitemap.xml`).
- **`<Seo>` is rendered once, in the root layout**, not per page. It reads `page.data.seo` (type `SeoData` in `$lib/seo/site.ts`, declared on `App.PageData`), so a page overrides tags by returning `seo` from its `load`. The defaults reproduce the effective Next values: title "Heidi Systems", the `(base)` description, the root OG/Twitter texts, and keywords. Error pages fall back to the root title and description with `noindex` and no canonical. Twitter tags were added because Next emits them. Rendering it once avoids duplicate `<head>` tags from layered components.
- **Head diff against the baseline:** the only differences are the dropped verification tag (KI-03), the per-path canonical/`og:url` (KI-28), and a 404 that sends only `noindex` instead of conflicting `noindex` and `index, follow`.
- **CSS:** the `(service)` stylesheet is an older copy of the `(base)` one. All 10 blocks that differ are subsets of the base rules or target ticker/swiper markup that doesn't appear on `/fragebogen`. So `app.css` is the base stylesheet as-is, and **no `service.css` was created**. Re-check `/fragebogen` visually in phase 7.
- **Font:** `next/font` registered the family as `"Exo 2"`, and 10 CSS rules use that name. Fontsource's own CSS (`"Exo 2 Variable"`) is therefore not imported. Instead, the root layout declares `@font-face "Exo 2"` for latin and latin-ext with `?url` imports of the fontsource woff2 files and preloads the latin file. The 404 page is pixel-identical to Next at 1280px.
- **Assets:** only the 147 files `icons.ts` imports were copied to `src/lib/assets/` (`Vector.svg` is unused). `icons.ts` lives at `src/lib/assets/icons.ts`. `static/` holds only `favicon.ico`, `admin_logo.png` (used by the home JSON-LD) and `videos/`. `gmail.png` and `doc_download.png` were used only by the deleted email templates.
- **Phase 8 note:** the ChatBot uses `max_chat_avatar.src`. With `?enhanced` imports that becomes `max_chat_avatar.img.src`.
- `svelte/no-navigation-without-resolve` is turned off in `eslint.config.js`, because the site has no `paths.base`.
- CI fails if `web/src` imports `next`, `react` or `react-dom`.
- The stub `Header`, `Footer`, `FragebogenHeader` and `ChatBot` components and the placeholder home page will be replaced in phases 3, 4 and 8.

## Exit criteria
- `/does-not-exist` renders the 404 page. A thrown error renders the error page.
- `/robots.txt` and `/sitemap.xml` match the baseline (apart from the deliberate fixes).
- A test page using `<enhanced:img>` with an asset from `icons.ts` renders AVIF/WebP `<picture>`.
- Font and Tailwind theme colours match the Next site in a side-by-side check.
- All known issues listed above are fixed.
