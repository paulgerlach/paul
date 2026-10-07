# Phase 1: route skeleton, content, SEO

Goal: `/upgrade-now` exists and returns 200 with the landing header and footer, its own SEO, and an H1. The rest is filled in by phases 2–4.

## 1.1 Route

- `ROUTE_UPGRADE_NOW = "/upgrade-now"` is already in `$lib/routes.ts` (added with the footer link).
- `src/routes/(landing-page)/upgrade-now/+page.server.ts`:
  - `load` returns `seo`, `landing` (header chrome), `now: Date.now()` (the single time source for SSR, phase 3.1) and `finalForm: await emptySwitchForm("final")` (phase 4).
  - `actions.default` calls `handleSwitchSignup(event, { source: "upgrade-now", page: ROUTE_UPGRADE_NOW })` (phase 4).
  - No `cache-control`: the `(landing-page)` layout sets it.
- `+page.svelte` composes the sections from `$lib/landing/pages/upgrade-now/sections/` (phase 2). For phase 1 a minimal hero with the H1 is enough.
- Outside `[[preview=preview]]`: no Prismic content.

## 1.2 Content module

`src/lib/landing/pages/upgrade-now/content.ts` holds every text of the page, copied word for word from the design (German, typographic quotes, `&nbsp;` before `%` as ` `). Components hold markup and behaviour only, as on the other landing pages. Typed exports, one per section:

| Export | Content |
|---|---|
| `hero` | pill ("Heizkostenverordnung · Nachrüstpflicht nach § 5 Abs. 3"), H1 parts ("Nur noch", the dynamic `<em>`, "bis zur Umrüstpflicht."), lede, the 3 facts, CTA labels, the expired-state texts (open question 3) |
| `logoStripText` | "Hausverwaltungen in ganz Deutschland rechnen bereits mit Heidi ab." (logo order = `DEFAULT_LOGO_ORDER`) |
| `deadlines` | eyebrow, H2, the 4 timeline entries (date, title, text) |
| `consequences` | eyebrow "Ab 1. Januar 2027", H2, the 3 cards (number, prefix/suffix, title, text, § source), the WEG note |
| `calculator` | eyebrow, H2, labels, the two result texts, the note "Vereinfachte Rechnung … Keine Rechtsberatung." |
| `timeWindow` | eyebrow, H2, KPI labels, legend, the 5 steps (title, text, timing) |
| `whyHeidi` | H2 and the 5 bento cards |
| `faq` | title "Häufige Fragen zur Umrüstpflicht", the lead (legal basis, "ersetzt keine Rechtsberatung"), the 7 Q&As |
| `finalCta` | H2 "Genug Zeit, wenn Sie jetzt anfangen.", CTA label |

The 2026 holidays and the deadline constants live in `deadline.ts`, not here (phase 3).

## 1.3 SEO

Returned from `load` as `seo` (never `<svelte:head>` meta in the page). The design has no title beyond "Jetzt noch umrüsten · Heidi", so these are proposals for sign-off:

- `title`: "Umrüstpflicht 2026: Zähler fernablesbar machen | Heidi Systems" (62 characters; the city-page rule is 30–60, so shorten if the content owner agrees, e.g. without "Systems")
- `description`: "Bis 31.12.2026 müssen Heizkostenverteiler und Wärmezähler fernablesbar sein, sonst dürfen Mieter um 3 % kürzen. Heidi rüstet um, die Installation ist kostenlos." (160)
- `ogTitle`: "Nur noch wenige Monate bis zur Umrüstpflicht."
- Canonical and `og:url` come from the path (`<Seo>`).
- JSON-LD: the shared `Faq` already emits `FAQPage`. Nothing else.
- Sitemap: add `{ path: ROUTE_UPGRADE_NOW, changefreq: "weekly", priority: 0.8 }` to `src/routes/sitemap.xml/+server.ts` **only at go-live** (§5.4). Until then the page sets `seo.noindex = true`, like the non-live cities.

## 1.4 Header chrome

- `LandingChrome` gets an optional `bannerHref` (default `#faq`); `LandingHeader` uses it for the banner's "Mehr erfahren" link. This page returns `{ ...DEFAULT_CHROME, bannerHref: "#risiko", ctaLabel: "Bestand prüfen" }` (the design's nav CTA label).
- The other landing pages are unchanged (they don't pass `bannerHref`).

## 1.5 Assets

- Customer logos: `$lib/landing/data/logos.ts` (same 12 logos, same order as the design).
- Partner logos: the existing `Trust` section's webp files (DEUMESS, VDIV, bved).
- No photos, no video. Every other visual is inline SVG or CSS, so the page adds no image files.

## Done when

- `/upgrade-now` renders 200 with header, footer and H1; `/upgrade-now/` redirects.
- The footer link resolves; `e2e/messdienstanbieter.e2e.ts` "internal links resolve" passes again.
- `bun run check` and `bun run lint` pass.
