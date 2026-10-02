# React / Next.js → Svelte 5 Cheat Sheet (for this codebase)

Svelte 5 **runes mode only**. Don't use `export let`, `$:`, `on:click`, `<slot>`, or `svelte/store` in new code.

## Components & props

| React | Svelte 5 |
|---|---|
| `export default function X({ a, b = 1 }: Props)` | `<script lang="ts">let { a, b = 1 }: Props = $props();</script>` |
| `className` prop forwarded | `let { class: className = '' } = $props();` → `class={['base', className]}` |
| `{...rest}` spread | `let { a, ...rest } = $props();` → `<div {...rest}>` |
| `children: ReactNode` | `children?: Snippet` → `{@render children?.()}` |
| Render prop `renderItem={(x) => <Y/>}` | Snippet prop: `{#snippet item(x)}<Y/>{/snippet}` → `{@render item(x)}` |
| `FC<Props>` | the component file itself; type props with an interface |

## State & effects

| React | Svelte 5 |
|---|---|
| `const [x, setX] = useState(0)` | `let x = $state(0)`; assign directly: `x = 1`, `x++` |
| `setList(prev => [...prev, item])` | `list.push(item)` (deep reactivity) |
| `useMemo(() => f(a), [a])` | `const v = $derived(f(a))` / `$derived.by(() => {...})` |
| `useEffect(() => {...; return cleanup}, [deps])` | `$effect(() => {...; return cleanup})`. Deps are tracked automatically |
| `useEffect(..., [])` for mount | `onMount(() => {...})` or an `$effect` that reads nothing reactive |
| Effect that syncs derived state (`setIsUnder50(cat === …)`) | **Don't.** Use `$derived` |
| `useRef<HTMLDivElement>()` | `let el: HTMLDivElement; <div bind:this={el}>` |
| `useRef(value)` (mutable, non-reactive) | plain `let` |
| `useCallback` | not needed |
| `useContext` / Provider | `setContext(key, value)` / `getContext(key)`. Put class instances in context |
| Zustand store | class with `$state` fields in `*.svelte.ts`, provided through context (SSR-safe). Use a module-level singleton only for truly client-only global state |
| `typeof window !== 'undefined'` | `import { browser } from '$app/environment'`, or do it in `onMount` |

## Template

| JSX | Svelte |
|---|---|
| `{cond && <X/>}` | `{#if cond}<X/>{/if}` |
| `{a ? <X/> : <Y/>}` | `{#if a}<X/>{:else}<Y/>{/if}` |
| `{items.map(i => <X key={i.id} {...i}/>)}` | `{#each items as i (i.id)}<X {...i}/>{/each}` |
| `<>…</>` | not needed |
| `className=`, `htmlFor=` | `class=`, `for=` |
| `` className={`a ${on ? 'b' : ''}`} `` | `class={['a', on && 'b']}` |
| `style={{ fontSize: '3em' }}` | `style="font-size: 3em"` or `style:font-size="3em"` |
| `onClick={fn}` | `onclick={fn}` |
| `onChange={(e) => setV(e.target.value)}` | `bind:value={v}` |
| `checked={c} onChange=…` | `bind:checked={c}` |
| `dangerouslySetInnerHTML={{__html}}` | `{@html html}` (trusted content only) |
| `{/* comment */}` | `<!-- comment -->` |
| `document.addEventListener('mousedown', …)` | `<svelte:document onmousedown={…} />` or an attachment |
| `window.addEventListener('scroll', …)` | `<svelte:window onscroll={…} bind:scrollY={y} />` |
| Reusable DOM behaviour (custom hook + ref) | Attachment: `{@attach myThing(opts)}` |

## Next.js APIs

| Next | SvelteKit |
|---|---|
| `next/link` `<Link href>` | `<a href>` (prefetch through `data-sveltekit-preload-data`) |
| `next/image` | `<enhanced:img>` (local) / `<PrismicImage>` (CMS) / `<img>` |
| `next/font/google` | `@fontsource-variable/*` + preload link |
| `next/dynamic(() => import(...), { ssr: false })` | `{#await import('./X.svelte') then { default: X }}<X/>{/await}` inside `{#if browser}`, or an `onMount` import |
| `usePathname()` | `page.url.pathname` (`import { page } from '$app/state'`) |
| `useSearchParams()` | `page.url.searchParams` |
| `useRouter().push(x)` / `.back()` | `goto(x)` / `history.back()` |
| `notFound()` | `error(404)` from `@sveltejs/kit` |
| `redirect(x)` | `redirect(303, x)` |
| `export const metadata` / `generateMetadata` | `<svelte:head>` through `<Seo>`, data from `load` |
| async Server Component fetching data | `+page.server.ts` / `+layout.server.ts` `load`, passed as props |
| `"use client"` | delete it. Every Svelte component hydrates. Keep heavy client-only libs behind attachments or dynamic imports |
| `route.ts` `GET/POST` | `+server.ts` `GET/POST` |
| `NextResponse.json` | `json()` |
| `process.env.X` (server) | `$env/dynamic/private` (or `/static/private`) |
| `process.env.NEXT_PUBLIC_X` | `PUBLIC_X` from `$env/static/public` |
| `layout.tsx` | `+layout.svelte` with `{@render children()}` |
| `error.tsx` / `not-found.tsx` | `+error.svelte` |
| `loading.tsx` / `<Suspense>` | not needed for SSR. Use `{#await}` for client-side promises |
| `robots.ts` / `sitemap.ts` | `robots.txt/+server.ts` / `sitemap.xml/+server.ts` |
| `import x from '@/foo'` | `import x from '$lib/foo'` |

## File naming
- Components: `PascalCase.svelte`, same name as the `.tsx`.
- Rune-using modules: `*.svelte.ts`, required for `$state` outside components.
- Server-only code: `src/lib/server/**`.
- No umlauts in filenames (`GeräteangebotSwiper` → `GeraeteangebotSwiper`).
