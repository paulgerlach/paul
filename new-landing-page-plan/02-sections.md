# Phase 2: Sections

Static markup and CSS of every section, ported from the design with its class names shortened to the component's scope (`ub-` / `pg-` prefixes dropped where the scope makes them unique). Icons: the design's inline 20×20 stroke SVGs stay inline (passed to `SectionHead` as the `icon` snippet), the check marks use `icons/Check.svelte`, the logo mark `icons/HeidiMark.svelte`. Every revealable element keeps the design's `rv` class for phase 3.

| # | Section | Design | Implementation |
|---|---|---|---|
| 1 | `Hero` | `.pg-hero` two-column grid (`minmax(0,1fr) minmax(0,560px)`, 64 px gap), H1 `clamp(38px,4.6vw,62px)` | Pill, H1 with `<em>` in `--ok`, lead, CTAs: `ArrowLink` "Demo buchen" (`DEMO_HREF`) + ghost link "Karriere bei Heidi" (`CAREERS_HREF`), the ticks list. Right column: `ServiceStack`. One column at 1040 px (44 px gap), from `#pg-common-css` |
| 1a | `ServiceStack` | `.ub-stack` card | Header "Was Heidi übernimmt" + replay button (`aria-label="Animation wiederholen"`, rendered only after mount, see 3.1), `<ol>` of 5 items (icon tile, title, sub, check circle), dark "Ein Partner für alles" row. Server markup = final state |
| 2 | `LogoStrip` | `.dm-logos` | Wrapper around the shared `LogoStrip` with `content.logos` |
| 3 | `Mission` | `.ub-ms` grid 1.2fr/.8fr | `SectionHead` + lead + ghost link to `/upgrade-now`; right: `DeadlineCard` (dark card, day number `clamp(64px,7vw,96px)` in `--accent`, 6 px bar, labels "Heute" / "1.1.2027") |
| 4 | `Principles` | `.pg-sec.alt`, `.ub-val` 4-col buttons + `.ub-vd` panel | 4 `<button type="button" aria-pressed>` with number, title, sub; the panel (`aria-live="polite"`) with text and 3 check points. 2 columns at 1040 px, panel one column at 640 px |
| 5 | `Numbers` | `.ub-nums` 4 tiles, first dark | `SectionHead center`, tiles from `content.numbers`. 2 cols at 1040, 1 at 640 |
| 6 | `Team` | `.ub-team` .7fr/1.3fr | Founder card (96 px initials avatar, name, role, "Berlin" pin pill with `icons/Pin.svelte`), text column with `SectionHead`, lead and the two outline links |
| 7 | `Testimonials` | `.dm-tm` with `.tm2` (2 cards) | Shared `Testimonials` with `id="stimmen"` and the two items; the shared `--n` column count handles 2 |
| 8 | `Careers` | `.ub-kt` dark rounded card | Dark pill ("Wir wachsen"), H2, text, `ArrowLink` "Zur Karriereseite" (`CAREERS_HREF`, external). Rendered only if `content.careers.show` |
| 9 | `FinalCta` | `.dm-end` dark card | Shared `FinalCta` with `id="start"`, `content.finalCta`, the form (README, open question 3) |
| 10 | `Trust` | `.trust` cards | Shared `TrustCards` without `more` |

Notes:

- Section order and backgrounds follow the design: hero (`--bg`), logos, mission (white), principles (`alt`), numbers (white), team (`alt`), testimonials, careers (white), CTA, trust (`#F6F7F6`).
- Headings: one `<h1>`; every section has `aria-labelledby` on its H2 as in the design (unique ids: the design uses `tm-h` for the team and `tm-h2` for the testimonials; rename the team's to `team-h`).
- The hero ticks and principle points use `<ul>`; the services `<ol>` (ordered, as designed).
- Text that the design truncates with `text-overflow: ellipsis` (service subs) must fit at 375 px; check, and allow wrapping below 640 px instead of cutting German text.
