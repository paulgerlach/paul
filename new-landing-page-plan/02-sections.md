# Phase 2: sections (static markup and CSS)

Goal: the page matches the design at 1440 / 1100 / 980 / 700 / 375 px with static, server-rendered content. Behaviour comes in phase 3, so every dynamic number is rendered from the SSR `now` already here (the functions of `deadline.ts` can be written first, see §3.1).

## 2.1 Porting rules

- CSS from the design's `#umr-css` goes into the section that uses it, as a scoped `<style>` block; class names keep the design's `um-` prefix so the two can be diffed. Shared `.dm-*` primitives (`dm-in`, `dm-h2`, `dm-pill`, `bk-next`) come from `tokens.css` and the shared sections; check each against `tokens.css` before copying anything.
- The design's reveal-on-scroll (`.rv` → `.in`) is the existing `inView` attachment.
- Inline SVG icons stay inline in the section (as in the design), except icons that already exist in `$lib/landing/components/icons/` (check, chevron, verified badge).
- No umlauts in file names: `Deadlines.svelte` (Fristen), `Consequences.svelte` (Folgen), `WhyHeidi.svelte`.

## 2.2 The sections, in page order

| # | Section (design comment) | File | Reuse | Notes |
|---|---|---|---|---|
| 1 | HERO + COUNTDOWN | `Hero.svelte`, `Countdown.svelte`, `YearBand.svelte` | new | Pill with a pulsing dot, H1 with a dynamic `<em>` ("knapp drei Monate"), lede, 4-unit countdown (`role="timer"`, `aria-live="off"`), two CTAs, the 12-month year band, 3 fact checks. Hidden "expired" paragraph (phase 3.2) |
| 2 | LOGOS | `LogoStrip.svelte`* | `sections/LogoStrip` | Text from content, default logo order |
| 3 | FRISTEN | `Deadlines.svelte` | new | `<ol>` timeline, 4 entries; state classes `done` / `now` / future from `deadline.ts`, not hard-coded. The `now` entry shows "Noch N Tage" |
| 4 | FOLGEN | `Consequences.svelte` | new | 3 cards with big numbers (count up, phase 3), the first one highlighted (`hot`), § source under each; the WEG note |
| 5 | RECHNER (`#risiko`) | `RiskCalculator.svelte` | new | Two range inputs, a 4-button segment (radiogroup), a switch, the result card with bar and two sub-values, CTA. Phase 3.5 |
| 6 | ZEIT | `TimeWindow.svelte`, `MonthCalendar.svelte`, `Steps.svelte` | new | 3 KPIs (Werktage, Wochen, Feiertage), the month calendars from the current month to December, a legend, the 5-step `<ol>` |
| 7 | WARUM HEIDI | `WhyHeidi.svelte` | new | Bento: one big card with the radio-wave animation (CSS only), four small cards |
| 8 | STIMMEN | `Testimonials.svelte`* | new shared `sections/Testimonials` | See §2.3 |
| 9 | FAQ | `Faq.svelte`* | `sections/Faq` | Needs a `lead` prop (§2.3) |
| 10 | ABSCHLUSS | `FinalCta.svelte`* | `sections/FinalCta` | Needs a kicker ("Noch N Tage") and gets the form (phase 4) |
| 11 | Partner und Verbände | `Trust.svelte`* | `sections/Trust` (moved) | Unchanged |

The design's nav, banner and footer are replaced by `LandingHeader` / `LandingFooter`.

## 2.3 Changes to shared code

Each change keeps the existing pages pixel-identical (check `/messdienstwechsel`, `/messdienstanbieter`, `/messdienstanbieter/berlin` at the five widths before and after).

- **`Faq`:** optional `lead?: string` rendered under the title, as in the design's `.dm-faq-g` left column (`dm-lead`). Check that the existing two-column FAQ layout is the same as the design's; if the design differs, add a variant prop rather than a copy.
- **`FinalCta`:** optional `kicker?: Snippet` above the title (the design's `um-cta-k`, which shows the live day count). Check whether the design's `um-cta` layout (text left, button right) differs from the existing final CTA with form; phase 4 decides the final layout because the form is added.
- **Testimonials:** move the quotes out of `region/References.svelte` into `$lib/landing/data/testimonials.ts` (Werne, Vitolus, Gerhard: quote, name, role, badge). New `sections/Testimonials.svelte` renders the design's three-card row (`tm2 um-tm3`: verified badge, quote, initials avatar, name and role). `References` reads its two mini quotes from the same module. Copy stays word for word.
- **`Trust`:** move `sections/region/Trust.svelte` to `sections/Trust.svelte` and update the region wrappers' imports. It's now used by two page families, so it no longer belongs in `region/`.
- **`confetti.ts`:** this design's burst differs (120 pieces, slower fall, white instead of ink in the palette, fade from 3.4 s). Add options (`count`, `colors`, `gravity`/`maxFall`, `fadeAfter`) with the current values as defaults, so the city pages don't change.

## 2.4 Layout and accessibility details from the design

- The countdown digits are `<span>`s inside a fixed-width box, so a digit change never shifts the layout. Use `font-variant-numeric: tabular-nums` as the design does.
- The calculator's labels are real `<label>`s; the segment buttons get `role="radio"` and `aria-checked` (the design adds them in JS; render them in markup).
- Calendar day cells carry `title` attributes ("Heute", the holiday name, "Frist: 31.12.2026"); also give them an `aria-label` with the date, and give each month grid a heading (the design's `<h3>` with "N Werktage übrig").
- Exactly one `<h1>`. Section headings are `<h2>`, card titles `<h3>`, as in the design.

## Done when

- All 11 sections render server-side with the design's spacing at the five widths, with JS disabled too (numbers from the SSR `now`).
- The other landing pages are unchanged after the shared-code changes.
- No hydration warnings.
