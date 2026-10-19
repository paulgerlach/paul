# Phase 2: The `sg` template and the sections

## 2.1 The template (`$lib/landing/sections/sg/`)

New, shared with the Asset-Manager page. Components take their content as props (shapes in `sg/types.ts`); every page wraps them in its own `sections/`. The design CSS is component-scoped; `#pg-common-css` rules a section needs (`.pg-sec`, `.pg-head`, the pills, `.pg-ghost`, `.pg-ticks`, `.dbm-demo`) are copied into that section. `SgMain` holds what spans sections (as `UvMain` does for `uv`): the page tokens `--bg` / `--hair` (the design's `.dm`), `.pg-sec` and `.pg-sec.alt`, the 18 px H2 margin the landing heading reset eats, the reveal transition, `#hs-css`'s heading sizes, and `#demo-css`'s two-quote row (as on `/schnittstellen`).

| # | Section | Design | Component | Notes |
|---|---|---|---|---|
| 1 | Hero | `.pg-hero` + `.sg-calc` | `sg/Hero` + `sg/UnitCalc` | Pill, H1 with `<em>`, lead, two CTAs, three ticks; the calculator in its start state (4.800, the dark card) |
| 2 | Tabs | `.sg-tabs-w` | `sg/Tabs` | `<nav aria-label="Zielgruppen">`; a tab without `href` is a `<span>` |
| 3 | Logos | `.dm-logos` | shared `LogoStrip` | |
| 4 | 1000+ | `.pg-sec` > `.sg-k` | `sg/LargeStock` | "1.000" server-rendered; the secondary link only with `href` |
| 5 | Problems | `.pg-sec.alt#wechsel` > `.sg-pain`, `.sg-links` | `sg/Pain` | Chips as `<button aria-pressed>`, the panel `aria-live="polite"`; `.sg-links` only for links with `href` (none here) |
| 6 | Benefits | `.pg-sec` > `.sg-get` | `sg/Benefits` | Four cards, the first dark |
| 7 | Feature rows | `.fr-sec` | `sg/Features` → `FeatureRow` + `features/*` | Five rows alternating (`rev` on 2 and 4); each tile in its end state (02 §2.2) |
| 8 | Steps | `.pg-sec.alt` > `.sg-steps` | `sg/Steps` | Every step `on` + `done`, the bar full |
| 9 | Quotes | `.dm-tm` | shared `Testimonials` | Two quotes side by side down to 641 px (`SgMain`) |
| 10 | FAQ | `.dm-faq` | shared `Faq` `variant="split"` | `id="faq"` not needed (no link to it) |
| 11 | Closing | `.dm-end` | shared `CtaCard` | `sectionId="start"`, `final`, the `SignupForm` |
| 12 | Trust | `.trust` | shared `TrustSeals` | |
| — | Floating CTA | `.ctab` | shared `FloatingCta` | |

## 2.2 The feature tiles' end states (server, no JS, reduced motion)

- `Meter` (fr1): both cards and the tick in place; "1.650" and "31.12."; the hover effects (CSS) and the re-count on hover (03 §3.4).
- `Billing` (fr2): "24 / 24", "Fertig für alle Einheiten" in green (the design's reduced-motion state).
- `Monthly` (fr3): the design's reduced-motion state `s1 s2 s4`: the three rows with 142, 318 and 96 kWh and their bars, WE 07 orange with "Über Vormonat" and its flag lit; no cursor, no toast.
- `Hub` (fr4): the four tiles and the hub, none lit.
- `Rollout` (fr5): the design's markup: two done, "Montage läuft" at 64 %, "Mieter informiert" at 12 %, "2 von 4 Liegenschaften fertig".

Overflow checks at 320 px: the calculator's "20.000+" figure, the tabs (they scroll sideways, scrollbar hidden), the chips, "Lindenallee 12 · WE 04" (ellipsis), "Heizkostenabrechnung 2025" (wraps below 480 px), the monthly rows (four columns below 480 px), the rollout rows ("Mieter informiert"), the step texts.

## 2.3 What the Asset-Manager design needs from the template

Diffed against this design (every `<style>` / `<script>` block and all 17 media identical by MD5; markup identical apart from):

| Where | Wohnungsunternehmen | Asset Manager & Fonds |
|---|---|---|
| `main[data-seg]` | `WU` | `AM` |
| Hero pill | house icon, "Für Wohnungsunternehmen" | bars icon, "Für Asset Manager & Fonds" |
| H1 | "Große Bestände. *Strukturiert umgestellt.*" | "Verbräuche im ganzen Portfolio. *Auf einen Blick.*" |
| Lead | "Für Wohnungsunternehmen planen wir …" | "Für Asset Manager und Fonds liefert Heidi eine einheitliche Datenbasis …" |
| Slider start (`data-units`) | 4800 | 12000 |
| Current tab | Wohnungsunternehmen (`#start`) | Asset Manager & Fonds; Wohnungsunternehmen links to this design |
| Benefits pill | "Für Wohnungsunternehmen" | "Für Asset Manager & Fonds" |
| Benefits | Portfolio-Analyse (bars), Rollout im Cluster (calendar), Montage mit Plan (wrench), Angebunden an Ihr ERP (erp) | Ein Dashboard (bars), Monatliche Daten (trend), Pflichten im Griff (alert), Daten, wo Sie sie brauchen (erp) |
| Quotes | `vitolus`, `gerhard` | `gerhard`, `werne` |
| FAQ 1–2 | "Wie läuft der Wechsel bei mehreren tausend Einheiten?", "Gibt es Konditionen für große Bestände?" | "Welche Daten sehen wir?", "Wie schnell sind alle Objekte fernablesbar?" |

Everything else (calculator texts, logos, 1000+, problems, feature rows, steps, FAQ 3–4, closing) is the same text. So the template takes all of it as content; the Asset-Manager page needs one more icon (`trend`, `M3 14l4.5-4.5 3 3L17 6M12.5 6H17v4.5`), which comes with the template's icon set now so `sg/` doesn't change for it.
