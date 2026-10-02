# Phase 1: Route, layout, tokens and assets

## 1.1 Files

```
web/src/routes/(landing-page)/
├── +layout.server.ts          # cache header + navPosts (blog dropdown)
├── +layout.svelte             # .lp root, Geist font, LandingHeader, LandingFooter, ChatBot
└── messdienstwechsel/
    ├── +page.server.ts        # seo + superforms load, default action (phase 4)
    └── +page.svelte           # composes the section components (phase 2)

web/src/lib/landing/
├── tokens.css                 # design tokens + shared primitives (.wrap, .btn, .eyebrow, .shead, .okb, keyframes)
├── data.ts                    # typed content: steps, FAQ, gantt rows, chart series, old-way tiles
├── attachments/               # phase 3
└── components/
    ├── LandingHeader.svelte   # banner + top nav + mobile menu
    ├── LandingNavGroup.svelte # one dropdown (desktop hover panel, mobile accordion)
    ├── LandingFooter.svelte
    └── sections/…             # phase 2

web/src/lib/components/Header/
├── navGroups.ts               # NEW: nav data shared by Header and LandingHeader (§1.3)
└── highlights/                # NEW: dropdown right-side panels, moved out of Nav.svelte (§1.3)
web/src/lib/components/Footer/
└── footerLinks.ts             # existing; also gets `socials` from Footer.svelte (§1.3)

web/src/lib/assets/landing/    # logos, step thumbs, banner photo, poster (enhanced:img)
web/static/landing/            # demo video (webm + mp4)
```

There's no collision with the existing tree. `/messdienstwechsel` doesn't match the `preview` param matcher, so `[[preview=preview]]/(base)` can't claim it. Add `ROUTE_MESSDIENSTWECHSEL = "/messdienstwechsel"` to `$lib/routes.ts`.

## 1.2 Layout

`(landing-page)/+layout.server.ts`: the same as the `(base)` one, without the preview branch. It sets `cache-control: s-maxage=60, stale-while-revalidate=600` and returns `{ navPosts: await getNavPosts({ fetch, cookies }) }` for the Blog dropdown. If Prismic fails, the page should still render: `getNavPosts` already returns `[]` on error, and the Blog group is then hidden, as in the site `Nav`.

`(landing-page)/+layout.svelte`:
- It imports `$lib/landing/tokens.css`. Vite scopes it to this route's CSS chunk, so other pages don't load it.
- It wraps everything in `<div class="lp">`. All tokens are defined on `.lp`, not `:root`, so they can't leak into the global theme.
- It renders `LandingHeader`, then `{@render children()}`, then `LandingFooter`.
- It renders `<ChatBot isExistingClient={false} />` in place of the design's static `.chatfab` button. Restyle the launcher position through a prop or wrapper class if it overlaps the design.
- It renders `<Toaster>` from svelte-sonner, so the form can show errors (phase 4).

The root layout still adds `app.css` (Tailwind preflight), Exo 2 and `<Seo>`. Check that Tailwind's preflight doesn't fight the design CSS. The design assumes `box-sizing: border-box` and zero margins, which preflight already provides.

## 1.3 Shared nav and footer data

The landing header and footer show **the same links and dropdowns as the site header and footer**, with the design's styling. To keep them from drifting apart, the data moves into shared modules, and each header and footer has only its own markup:

1. **`Header/navGroups.ts`.** Move the `navGroups` array out of `Nav.svelte` into `buildNavGroups(posts: PostSummary[])`. It returns Geräte (6 device links), Funktionen (6 links), and Blog (the posts, only if there is at least one), with titles, routes, group titles and icons. It also exports the plain links `Kunden → /#kunden` and `Preise → /preise`, and `LOGIN_URL = "https://platform.heidisystems.com/"` and `PHONE = "+49 30 52001352"` (both are hard-coded in the header components today).
2. **`Header/highlights/`.** The dropdown right-side panels become components: `GeraeteHighlight.svelte`, `FunktionenHighlight.svelte` (the existing `NavFunktionenRightSide`, moved) and `BlogHighlight.svelte` (takes the latest post). `NavGroupType.rightSide: Snippet` becomes a `highlight` key (`'geraete' | 'funktionen' | 'blog'`), and each header maps the key to the component. This lets both headers render the same panels.
3. **`Nav.svelte` / `NavGroup.svelte`** are refactored to use 1 and 2. **The site header must look and behave exactly as before.** Check it at 375/768/992/1200/1640 px against `main`.
4. **`Footer/footerLinks.ts`** is already a shared module (7 link groups). Move the `socials` array from `Footer.svelte` into it, plus the VDIV partner link and the address.
5. **Mobile menu state:** `LandingHeader` reuses the existing `menu` singleton (`Header/menu.svelte.ts`), the `_lock` class on `<html>`, and `afterNavigate(() => menu.close())`. Only one header is ever mounted at a time, so sharing the singleton is safe.

Landing-side components:
- **`LandingHeader`:** the banner, then the logo (→ `/`), then the nav groups as `LandingNavGroup`, then Kunden and Preise, then the right side (see README "still open" 1: Einloggen, phone, "Wechsel starten" → `#start`). It is styled like the design's `nav.top`: white bar, Geist, the ink/accent buttons, and the design's chevrons in place of the site's arrow PNG.
- **`LandingNavGroup`:** on desktop, a hover **and focus-within** dropdown panel (the site version is hover-only, so keyboard users can't open it). The panel has a group title, the link list with icons and the highlight component, restyled with the design's tokens (radius, `--line` border, shadow). Below 980 px it's an accordion inside the burger panel (`aria-expanded`).
- **`LandingFooter`:** the 7 link groups in the design's column layout and typography, then the legal row (© year computed, Impressum and Datenschutz from `datenschutzLinksGroup`), the socials, the VDIV badge, the address and the disclaimer. Not included: the site tagline and newsletter form (README "still open" 2). The `isNeu`/`isBeliebt` badges are kept, restyled as small accent pills.

## 1.4 Font

The decision is Geist from npm, on this page only.

1. Run `bun add @fontsource-variable/geist` in `web/`.
2. In the landing layout, preload the latin `woff2` and inject `@font-face` the same way the root layout does for Exo 2. Set `font-family: "Geist", system-ui, sans-serif` on `.lp`.
3. The root layout preloads Exo 2 on every page, so this page downloads one unused font. That's acceptable for now. A follow-up could move the Exo 2 preload into the `(base)` and `(service)` layouts.

## 1.5 Design tokens

These come from the design's `:root`. Tokens that equal an existing `@theme` color are marked, so a later cleanup can merge them.

| Token | Value | Same as site |
|---|---|---|
| `--ink` | `#1E322D` | `--color-dark_green` |
| `--accent` | `#8AD68F` | `--color-green` |
| `--accent-deep` | `#6FC476` | |
| `--muted` / `--faint` | `#5E6B67` / `#9AA5A1` | |
| `--line` | `#E4E8E6` | |
| `--paper` / `--stone` | `#FFFFFF` / `#F3F4F2` | |
| `--ok` / `--warn` / `--bad` | `#3E9A57` / `#8C7A2E` / `#B4461E` | |
| `--orange` / `--blue` | `#D9622B` / `#6282D0` | `--blue` ≈ `--color-link` (`#6083cc`) |
| `--hero-a` / `--hero-b` | `#D7E0EF` / `#EEF2F6` | |

`tokens.css` also holds the primitives that several sections share: `.wrap`, `.btn` (`-accent`, `-ink`, `-ghost`), `.eyebrow`, `.shead`, `.okb`, `.pill-s`, and every `@keyframes` (21 of them). It also holds the `prefers-reduced-motion` block. Everything specific to one section moves into that section's `<style>`.

## 1.6 Assets

Extract the embedded `data:` URIs from the design HTML with a one-off script. Keep the script in the scratchpad, not the repo.

| Asset | Count | Target |
|---|---|---|
| Customer logos (Berlin, Dumax, Harte, HSP, raumgold, Schleicher, Vitec, Wagner, Werne, Neckar, Niesen, Pro Gera) | 12 | `$lib/assets/landing/logos/*.png` via `<enhanced:img>`. Keep each logo's `--ar`/`--h` custom properties from the design: they optically balance the logo sizes |
| Step 1 thumbnails | 3 | `$lib/assets/landing/steps/` |
| Testimonial banner photo | 1 | `$lib/assets/landing/banner.jpg` via `<enhanced:img>` with `sizes` |
| Demo-card video poster | 1 | `$lib/assets/landing/demo-poster.jpg` |
| Demo-card video (webm + mp4) | 2 | `static/landing/demo.webm` / `.mp4`, `preload="metadata"` (the design uses `auto`) |
| Inline SVGs (logo, icons, checks, chevrons, signature) | 38 | Keep inline. Repeated ones (check, chevron, arrow) become tiny components in `components/icons/` |

The Heidi logo in the nav and footer: reuse the existing site logo if it matches the design's SVG. Otherwise, use the design's SVG.

## 1.7 SEO

`messdienstwechsel/+page.server.ts` returns:

```ts
seo: {
  title: "Messdienstleister wechseln | Heidi Systems",
  description: "Sie schicken uns Ihren Vertrag, Heidi erledigt den Rest. Auch mit laufendem Vertrag: Wir werten Ihre bestehenden Zähler sofort aus.",
  ogTitle: "Messdienstleister wechseln. So einfach wie nie.",
}
```

The existing `<Seo>` handles canonical, robots and OG. Add `FAQPage` JSON-LD from the FAQ data in `data.ts` (`<svelte:head>` in `FaqSection`). This is the only page-specific structured data.

## Done when
- `bun dev` in `web/` serves `/messdienstwechsel` with the landing header and footer, and an empty main area. It doesn't render the site `Header`/`Footer`.
- The landing nav and footer have exactly the same link targets and dropdown entries as the home page.
- The site header and footer on `/` are visually and behaviourally unchanged after the data extraction.
- The other routes still render their own layouts unchanged.
- `bun run check` and `bun run lint` pass.
