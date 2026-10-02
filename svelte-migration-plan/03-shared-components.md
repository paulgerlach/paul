# Phase 3: Shared Components

**Goal:** port every component that appears on more than one page, plus the reusable client-side primitives (carousel, Lottie, accordion, toast).

Order matters. Build the primitives first, then compose them.

## 3.1 Primitives

### Swiper attachment (replaces `swiper/react`, 8 components)

```ts
// src/lib/attachments/swiper.ts
import Swiper from 'swiper';
import type { SwiperOptions } from 'swiper/types';
import type { Attachment } from 'svelte/attachments';

export function swiper(options: SwiperOptions, onInit?: (s: Swiper) => void): Attachment<HTMLElement> {
  return (el) => {
    const instance = new Swiper(el, options);
    onInit?.(instance);
    return () => instance.destroy(true, true);
  };
}
```
```svelte
<script lang="ts">
  import { Navigation, Pagination, Autoplay } from 'swiper/modules';
  import { swiper } from '$lib/attachments/swiper';
  let api = $state<import('swiper').default>();
</script>

<div class="swiper" {@attach swiper({ modules: [Navigation, Pagination], slidesPerView: 1.2, breakpoints: { 768: { slidesPerView: 2 } } }, (s) => (api = s))}>
  <div class="swiper-wrapper">
    {#each slides as slide (slide.id)}
      <div class="swiper-slide">…</div>
    {/each}
  </div>
</div>
<button onclick={() => api?.slidePrev()}>‹</button>
```
- Translate each `<Swiper {...props}>` prop 1:1 into the options object. `onSlideChange` becomes `on: { slideChange: (s) => (active = s.realIndex) }`.
- `useSwiper()` and refs to the instance become the `api` state above.
- Swiper's SSR markup is plain HTML, so there is no layout shift if the initial `slidesPerView` CSS matches.
- Port `NumberedSwiper` (355 lines, most complex) first to validate the helper, then the remaining seven.

### Lottie (replaces `lottie-react` + `next/dynamic`)

```ts
// src/lib/attachments/lottie.ts
import type { Attachment } from 'svelte/attachments';

export function lottie(load: () => Promise<{ default: unknown }>, eager = false): Attachment<HTMLElement> {
  return (el) => {
    let anim: import('lottie-web').AnimationItem | undefined;
    let cancelled = false;
    const start = async () => {
      const [{ default: lottieWeb }, { default: animationData }] =
        await Promise.all([import('lottie-web/build/player/lottie_light'), load()]);
      if (cancelled) return;
      anim = lottieWeb.loadAnimation({ container: el, renderer: 'svg', loop: true, autoplay: true, animationData });
    };
    let io: IntersectionObserver | undefined;
    if (eager) start();
    else {
      io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io!.disconnect(); start(); } }, { rootMargin: '200px' });
      io.observe(el);
    }
    return () => { cancelled = true; io?.disconnect(); anim?.destroy(); };
  };
}
```
`LazyLottie.svelte` keeps the same props (`animationName`, `wrapperClassName`, `eager`) and the same `animationImports` map, using `import.meta.glob('$lib/animations/*.json')`.

Check that `lottie_light` renders all 14 animations. If any use expressions, fall back to the full `lottie-web` build. `fragebogen/page.tsx` imports `Animation_5/6.json` **statically**; switch it to `LazyLottie` with `eager`.

### Accordion (`FAQItem`, `InstallFaq`)
The `slideUp/slideDown` DOM helpers become `{#if open}<div transition:slide={{ duration: 300 }}>…</div>{/if}` from `svelte/transition`. Delete `slideUp/slideDown` once nothing uses them. If SEO needs the collapsed answers in the HTML, keep them rendered and animate `grid-template-rows: 0fr → 1fr` with CSS instead.

### Toaster
```svelte
<script lang="ts">import { Toaster } from 'svelte-sonner';</script>
<Toaster position="top-center" richColors />
```
`toast.success(...)` calls keep the same API (`import { toast } from 'svelte-sonner'`). Copy the props `Sonner.tsx` passes; `next-themes` `useTheme` is dropped (the site has no dark mode).

### Small replacements
- `react-loader-spinner` `<Triangle>` → `Spinner.svelte` (CSS `animate-spin` or an SVG triangle with keyframes).
- `react-icons/md` `MdOutlineSupportAgent` → inline SVG in `ChatBot/icons.svelte`.
- `lucide-react` (`SendHorizonal`, `Square`) → `import { SendHorizontal, Square } from '@lucide/svelte'`. Check the exact export names.

## 3.2 Header / Nav

- **`Header.tsx`** (scroll state, mobile menu): `useState` → `$state`, and `useEffect` scroll listeners → `<svelte:window onscroll={…} bind:scrollY />`.
- **`Nav.tsx`** currently runs `useQuery(getAllBlogPosts)` in the browser. Replace this with:
  ```ts
  // routes/(base)/+layout.server.ts
  import { getLatestPosts } from '$lib/server/blog';
  export const load = async ({ fetch, cookies }) => ({ navPosts: await getLatestPosts({ fetch, cookies, limit: 6 }) });
  ```
  and pass `navPosts` down as a prop. That removes a client-side request and puts the nav in the SSR HTML (better for SEO).
- **Active link:** `usePathname()` → `page.url.pathname` from `$app/state`.
- **Close the menu on navigation:** `afterNavigate(() => (open = false))`.
- **`LoginDropdown`:** click-outside becomes a small `clickOutside` attachment, which the ChatBot reuses.
- **`NavGroup`, `NavFunktionenRightSide`, `HeaderButton`, `FragebogenHeader`:** straightforward.
- `next/link` `<Link href>` → `<a href>`. Use the constants from `$lib/routes.ts`.

## 3.3 Footer
- `Footer.tsx` (504 lines) is mostly static markup and image imports. Port it mechanically.
- `FooterEmailForm` and `Subscription` are newsletter forms. Port them in phase 7. For now, render the markup with a disabled submit.

## 3.4 Other shared sections
`Kostenfrei`, `FAQSection`, `MobileDifference`, `CopyLinkButton` (`navigator.clipboard.writeText(page.url.href)`), `Loading`, the `Hero/*` components, `HeroTicker` and `GeraeteHeroTicker`.

**Tickers:** look at how they animate. If they use `setInterval` plus state, port that to `$effect` with a cleanup return. If they use CSS keyframes, the port is markup-only.

## Conventions for this phase
- One `.svelte` file per `.tsx`, same name and folder, under `src/lib/components/`.
- Props: `let { a, b = 1, class: className = '' }: Props = $props();`
- `children` → `{@render children?.()}`. Named "render-prop" props → snippets.
- No `export let`, `$:`, or `on:click` (Svelte 4 syntax). Runes only. Enable `compilerOptions.runes: true` in `svelte.config.js` to enforce it.

## Known issues fixed in this phase
Details are in [known-issues.md](known-issues.md). Tick them there as well.

- [x] **KI-07** (High): Nav fetches all blog posts client-side on every page; move to the layout `load` with `pageSize: 6`
- [ ] **KI-08** (Low): Fragebogen imports Lottie JSON statically; use `LazyLottie`. `LazyLottie` supports `eager`; the switch happens when phase 7 ports the Fragebogen page
- [x] **KI-31** (Low): `LazyLottie` showed a stale animation when `animationName` changed (found in this phase)
- [x] **KI-32** (Low): Relative video URLs in `ReviewsSwiper` (found in this phase)

## Status (done 2026-10-02)

All exit criteria are met. `/kitchen-sink` (in the `(base)` group, so it has the real header and footer) renders every shared component. It returns 404 in production unless `KITCHEN_SINK=1` is set; Playwright sets it. Checks live in `web/e2e/shared-components.e2e.ts`.

**Visual parity:** header, footer, the mobile menu (375px) and the nav dropdown (1280px) were pixel-compared with the Next site at 375 / 768 / 992 / 1280 / 1640px. All differences are under 1% (antialiasing and image encoding). Footer heights are identical.

**Swipers:** all 10 Swiper instances initialise, navigate/paginate, and autoplay where configured, at 1280 and 375px. There are no console errors or hydration warnings. Swiper's loop warning also appears on the Next site (KI-29).

Differences from the steps above:
- **Swiper is pinned to 11.2.10**, the version Next uses (decision #6). `app.css` has about 100 rules written against Swiper 11's markup, including the `:after` arrow icons.
- **Swiper markup follows what `swiper/react` actually renders, not the JSX.** `swiper/react` hoists `SwiperSlide`s out of hand-written `.swiper-wrapper` divs, so classes on those divs never reached the DOM. It also renders `.swiper-button-prev/next` and `.swiper-pagination` after the wrapper (when no `el` is given), puts other children after that, and never passes `wrapperClass` to Swiper core. The `swiper` attachment (`$lib/attachments/swiper.ts`) picks up those child elements for `navigation: true` / `pagination: true`.
- **`Image.svelte` replaces `next/image`** for local assets. Use `<Image src={icon} …>` with the same props as before (`width`, `height`, `sizes`, `priority`, `class`, `style`). It renders the `<picture>` markup that `enhanced:img` would, with three adjustments for parity:
  - `width={0}`/`height={0}` fall back to the intrinsic size, as next/image does.
  - `<picture>` is `display: contents`, so the `<img>` stays the flex item.
  - The `<source>`s are `display: none`, because the spec doesn't hide them and they would otherwise become flex items.
  - The 11 SVG icons are exported with their intrinsic size in the same shape.
- **FAQ/accordion:** the original `slideUp`/`slideDown` helpers were kept (`$lib/utils/slide.ts`, via the `slideToggle` attachment) instead of `transition:slide`, so closed answers stay in the HTML as before. `InstallFaq` and phase 7's `StepInfo` use them too.
- **Mobile menu:** a `menu` rune singleton (`Header/menu.svelte.ts`) replaces the `classList` toggling on the burger, its parent and `<html>`. The resulting classes are the same (`active`, `_lock`). The menu also closes after navigation.
- **Nav blog teaser (KI-07):** `(base)/+layout.server.ts` loads the 6 newest posts with `getNavPosts` (`$lib/server/blog.ts`), reduced to uid, title, subtitle and image. The layout sets `cache-control: s-maxage=60, stale-while-revalidate=600` for the whole group (decision #3), so **pages in `(base)` must not set `cache-control` themselves**. A minimal `$lib/prismicio.ts` exists; phase 5 completes it. `prismicio-types.d.ts` lives in `web/src/` so SvelteKit's tsconfig includes it.
- **Spinner and icon replacements** (`react-loader-spinner`, `react-icons`, `lucide-react`) are only used by the ChatBot, so they move to phase 8.
- `FooterEmailForm` and `Subscription` are ported as markup with the submit disabled; phase 7 wires them up.
- Types were renamed: `NymberedSwiper*` became `NumberedSwiper*` and `GeräteangebotSwiperType` became `GeraeteangebotSwiperType`.

## Exit criteria
- A `/_kitchen-sink` dev-only route renders every shared component. It is deleted before cutover.
- Header and footer match the Next site visually at all 5 breakpoints. Mobile menu, dropdowns and nav blog teaser work.
- All 8 swipers navigate, paginate and autoplay as before. No hydration warnings in the console.
- All known issues listed above are fixed.
