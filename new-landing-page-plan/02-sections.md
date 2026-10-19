# Phase 2: The sections

## 2.1 The page

Page-only components in `$lib/landing/pages/private-vermieter/`. `PvMain` holds the dark page (the design's `.pv`): background ink, the tokens `--card`, `--card2`, `--mute`, `--line`, `--top`, the shared `.pv-h2`, `.pv-btn` (w, l, d), `.pv-ctas`, the reveal transition and `#hs-css`'s heading sizes.

| # | Section | Design | Component | Notes |
|---|---|---|---|---|
| 1 | Hero | `.pv-hero` | `Hero` | `Eyebrow`, H1 with `<br>`s and `<em>`, the lead and two buttons on the right (`.pv-hr`) |
| 2 | Scroll scene | `.pv-scene` | `Scene` + `InfoCard` | 340 vh (300 vh ≤ 620 px), sticky frame; layers sized by CSS (container units) so the server's frame is right |
| 3 | Figures | `.pv-stats` | `Stats` | Three cards with photo crops (`.th` → `.crop`) |
| 4 | Flow | `.pv-flow#so` | `Flow` + `FlowPanel` | 420 vh above 900 px, sticky; five steps (buttons), five panels |
| 5 | Duo | `.pv-duo` | `Duo` | Photo `owner.jpg`, text card with a crop of the flat |
| 6 | Advantages | `.pv-all` | `Benefits` | Six cards with icons |
| 7 | Comparison | `.pv-tb` | `Compare` | `role="table"` as the design, the Heidi column highlighted |
| 8 | Quotes | `.pv-q` | `Quotes` | The marquee: three quotes and three photo tiles, then the same again `aria-hidden` |
| 9 | FAQ | `.pv-faq#faq` | `Faq` | Six `<details>`, the JSON-LD |
| 10 | Closing | `.pv-end` | `Closing` | `id="start"`, `final`; the `SignupForm` styled for the dark card; photo `talk.jpg` |
| 11 | Trust | `.trust` | shared `TrustSeals` | After `PvMain`, light |
| — | Floating CTA | `.ctab` | shared `FloatingCta` | |

## 2.2 End states (server, no JS, reduced motion)

- Scene: see 03 §3.2 (the design's reduced-motion state; with JS and motion the start state).
- Flow: step 1 on, panel 1 shown with its rows and bar.
- Comparison: every mark shown.
- Quotes: the row standing (no marquee with reduced motion).

Overflow checks at 320 px: the H1, the info card, the tags, the comparison's four columns (13.5 px below 900 px), the panels, the closing form.
