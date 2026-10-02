# Landing page `/messdienstwechsel`: plan

A standalone landing page for switching meter service providers ("Messdienstleister wechseln"). It is built **only in the SvelteKit app (`web/`)**. It runs on localhost now and goes live with the Svelte cutover (`svelte-migration-plan/10-qa-and-cutover.md`). No Next.js version is built.

- **Design reference:** https://claude.ai/artifact/JMrh8PhRG78mcMBK2LDkbS ("Heidi Anbieterwechsel"). It is a single HTML file with about 45 KB of hand-written CSS, about 16 KB of vanilla JS, and embedded images and video.
- **Route:** `/messdienstwechsel`, in its own route group `(landing-page)`. It has its own header and footer and does not use the site `Header`/`Footer`.

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-layout.md](01-route-and-layout.md) | Route group, layout, landing header and footer, SEO, font, design tokens, assets | M |
| 2 | [02-sections.md](02-sections.md) | All 13 page sections as components, with static content | L |
| 3 | [03-interactions.md](03-interactions.md) | Scroll animations, the hero status loop, "old way" tiles, Gantt tooltip, charts, video hover | L |
| 4 | [04-signup-form.md](04-signup-form.md) | Email signup (hero and final CTA): form action, lead storage, notification | S |
| 5 | [05-qa-and-cutover.md](05-qa-and-cutover.md) | Checks before showing it, plus what changes in the migration's phase 10 | S |

Do phases 1 and 2 first so that a static, pixel-matched page is ready to show early. Phases 3 and 4 then add the behaviour on top of it.

## Key decisions

| Topic | Decision |
|---|---|
| Route location | `web/src/routes/(landing-page)/messdienstwechsel/`, **outside** `[[preview=preview]]`. The page has no Prismic content, so a `/preview/messdienstwechsel` URL isn't needed |
| Layout | `(landing-page)/+layout.svelte` renders `LandingHeader` (announcement banner and nav), the page, `LandingFooter`, and the existing `ChatBot`. The root `+layout.svelte` (CSS, fonts, `<Seo>`) still applies |
| Header and footer | **Same links and dropdowns as the current site header and footer, with the landing design's styling.** The link data is shared with the site `Header`/`Footer` through modules, not copied, so the two can't drift apart. The markup and CSS are the landing page's own. See [01-route-and-layout.md §1.3](01-route-and-layout.md) |
| Font | Geist from npm (`@fontsource-variable/geist`), loaded only in the landing layout |
| Styling | Port the design CSS **as component-scoped `<style>` blocks**, with the design tokens as CSS custom properties on the layout root. Don't rewrite it in Tailwind: the CSS is bespoke and animation-heavy, and a faithful port is faster and keeps the page matching the design. Tailwind stays available for simple layout utilities |
| Breakpoints | Keep the design's own breakpoints (1180/1100/980/700/560/520 px) in the scoped CSS. Don't map them to the site's `@theme` breakpoints |
| Interactivity | Svelte 5 runes and attachments (`{@attach}`). No new runtime dependencies. Charts are plain DOM/CSS, as in the design |
| Content | Hard-coded in components and small typed data modules (`$lib/landing/data.ts`). It isn't Prismic-managed. Only the Blog nav dropdown reads Prismic, the same way the site header does |
| Placeholders | The KPIs (`XX %`, `XX`), testimonial, customer logos, the "Über 200" claim and the demo video stay **as in the design for now** |
| Form | A SvelteKit form action with superforms and zod, the same pattern as `kontakt` (phase 7 of the migration). The lead is saved with `source = "messdienstwechsel"`, and a new `switchinquiry` Make.com event is sent |
| Rendering | SSR with the same CDN cache header as `(base)`. It isn't prerendered, because of the form action and the Prismic blog dropdown |

## Answered questions

| Question | Answer |
|---|---|
| Font | Geist from npm, used only on this page |
| Placeholder content | Leave it as in the design for now. It's tracked in the go-live gate in [05-qa-and-cutover.md](05-qa-and-cutover.md) |
| Nav and footer | The same links as the current home page, styled like the design. The top-nav dropdowns stay (Geräte, Funktionen, Blog) |
| Form submissions | `leads` table plus a new `switchinquiry` Make.com event. Sales is only notified once someone adds that event to the Make.com scenario |

## Still open (these defaults will be built)

1. **Header CTAs.** The site header has "Einloggen", the phone number and "Angebot einholen" (→ `/fragebogen`). The design has "Anmelden", "Demo ansehen" and "Wechsel starten". *Default: "Einloggen" and the phone number as on the site (restyled), then "Wechsel starten" as the primary button (→ `#start`), because it's the conversion action for this page. "Demo ansehen" is dropped from the nav: the hero and the testimonial banner already have it.*
2. **Footer extras.** Besides the link groups, the site footer has socials, the VDIV partner badge, the address, the legal disclaimer, the tagline "Werde Teil der Revolution …" and a newsletter form. *Default: keep everything except the tagline and the newsletter form, so the page's own signup form stays the only email form.*
3. **"Demo ansehen" / "Demo mit unserem Team buchen".** In the design these scroll to the hero form (`#start`). *Default: keep that behaviour. Use a booking URL instead if one is provided.*
4. **Banner date.** The banner says that from 1.1.2027 meters must be remotely readable. *Default: show the banner unconditionally. Review the copy after that date.*

## Out of scope
- A Next.js version of the page.
- A/B testing and analytics events. They can be added later through `data-*` attributes on the CTAs.
