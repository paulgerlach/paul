# Phase 5: QA, and how this fits the migration cutover

## 5.1 Before the localhost demo
- [ ] `cd web && bun dev` → `http://localhost:5173/messdienstwechsel`
- [ ] The visual match with the design artifact at 1440, 1100, 980, 700 and 375 px. The page is compared against the design, not against Next, because Next has no such page
- [ ] Chrome, Safari and Firefox on desktop, and iOS Safari through the network URL (`bun dev --host`)
- [ ] Keyboard-only walkthrough: nav, burger, forms, Gantt rows, chart tabs and bars, FAQ
- [ ] Reduced-motion emulation
- [ ] Lighthouse (mobile) on the local `bun run build && bun run preview`: Performance ≥ 90, Accessibility ≥ 95, CLS ≤ 0.05
- [ ] Placeholders are left as in the design (decided). Nothing to do before the demo
- [ ] Regression check of the site header and footer on `/`, `/funktionen` and `/blog` after the nav-data refactor (phase 1.3)

## 5.2 Tests (`web/tests/`)
- Playwright: `messdienstwechsel.spec.ts`:
  - The page returns 200, has one `<h1>`, and doesn't render the site header or footer (assert that `#header` is absent).
  - **Link parity:** collect every `href` in the landing `<nav>` and `<footer>`, and compare them with the same set collected on `/`. They must match, apart from the landing-only `#start`/`#faq` anchors and the CTA differences (Wechsel starten vs. Angebot einholen).
  - Both signup forms: valid, invalid, honeypot. Mock the webhook, and assert the action response and the success state.
  - The Gantt tooltip appears on row focus. The budget tabs switch the sums. The risk bar focus changes the tag text.
  - At 375 px there's no horizontal document overflow: `document.documentElement.scrollWidth <= innerWidth`.
- Vitest: data integrity for `data.ts`. Gantt spans are within W1–laufend. Chart series have 12 values. The risk average is computed correctly.

## 5.3 Changes to `svelte-migration-plan/` (do these in the same PR as the page)
1. **`00-inventory.md`:** add a "New pages (no Next counterpart)" section with a row for `/messdienstwechsel` → `src/routes/(landing-page)/messdienstwechsel/+page.svelte`.
2. **`10-qa-and-cutover.md`:**
   - §10.1 visual regression: **exclude** `/messdienstwechsel` from the Next-baseline loop. Without a Next baseline the run would fail. Give it its own Svelte-generated snapshots after the design is signed off.
   - §10.1 SEO diff: list `/messdienstwechsel` as an allowed addition (it isn't in `seo-baseline/`).
   - §10.4 step 6, post-deploy checks: "the landing-page form creates a lead and the `switchinquiry` webhook reaches Make.com".
3. **Sitemap:** add `{ path: "/messdienstwechsel", changefreq: "monthly", priority: 0.8 }` to `web/src/routes/sitemap.xml/+server.ts`. It only goes live at cutover, so adding it now is harmless.

## 5.4 Go-live gate (at the cutover)
The page goes live when `web/` is promoted. The placeholders are intentionally left as in the design for now, so these must be resolved **before** the cutover PR is merged. If they aren't, set `seo.noindex = true` and remove the page from the sitemap until they are:
- [ ] Real KPI numbers instead of `XX`
- [ ] Approved testimonial photo, name and company
- [ ] Permission to show the 12 customer logos, and the "Über 200" claim confirmed
- [ ] The real demo video
- [ ] The Make.com `switchinquiry` route is live
