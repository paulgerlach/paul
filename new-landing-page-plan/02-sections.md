# Phase 2: The template's new variants and the sections

## 2.1 The shared `uv` template grows (one commit, before any section of this page)

What this design draws that `uv/` can't render yet. Every change is opt-in through content, so `/mieterportal`, `/verbrauchsinformation` and `/hausverwaltung` keep rendering the same:

| Change | Design | How |
|---|---|---|
| `Bill` rows on one side only | `.uv-bl.xa` (only while not `.good`), `.uv-bl.xb` (only while `.good`), their `b.t` values green `#2F7A3C`, 13 px | `BillRow.kind` gains `"a"` (side "without") and `"b"` (side "with"). They render with the classes `xa` / `xb` (`.a` / `.b` are already the segment labels' classes inside the tile) and fold away like `cut` / `ok`. A row without `value` still shows the tick |
| Icons `user`, `key` | the list's owner tile (`circle 10,7 r3.2` + shoulders), the nav's "Eigentümer" (a key) | Added to `uv/icons.ts` / `Icon.svelte` |
| `uv/Audience` media slot | `.uv-card .pcm-fig` (no aspect ratio, no rounding, no clipping, content centred) | `AudienceCard.image` becomes optional; new optional `media: Snippet`, rendered in a `figure.media` in place of the photo. The photo rules apply only to `figure.photo`; the hover zoom applies to every image in the card as in the design (`.uv-card:hover img`) |

Not added: the grid's `.tag` / `.pl` cells (no markup here), `.uv-ev` is already in.

Check before committing: the three pages' e2e specs pass; production-build screenshots at 1440 and 375 px with reduced motion before/after identical.

## 2.2 Sections

Static markup, every block in its end state. Section ids: `mv-h1`, `inhalt`, `mv-num-h`, `mv-q-h`, `faq`, `start` (closing card).

| # | Section | Notes |
|---|---|---|
| 1 | `Hero` | `uv/Hero` `size="lg"`, the word "Mietverwaltung", `ListMock` between the photos |
| 2 | `Statement` | `uv/Statement` |
| 3 | `Rows` | `Calendar` (mint, Objekt 1–12), `Doc` (stone, Zwischenablesung), `Bill` (mint, Eigentümer A / B), `Phone` (ink, bars) |
| 4 | `Rotator` | `uv/Rotator` |
| 5 | `Numbers` | `uv/Numbers` with the new bento photo |
| 6 | `Audience` | `uv/Audience`; card 1's media = `PortfolioChecker`, card 2's photo = Frankfurt façade; no buttons |
| 6a | `PortfolioChecker` | page-only, `#pcm-css` ported as scoped CSS: white card max 440 px, header (dark icon tile with the lime magnifier, title, status, count "4/4"), progress bar (green, 100 %), four rows (36 px thumbnail, name, status, a spinner swapped for the action pill: `take` ink, `cancel` amber, `bill` green), the "Beispieldaten" pill. ≤ 520 px smaller pills. `aria-hidden`, plus a `sr-only` list |
| 7 | `Quotes` | `uv/Quotes` |
| 8 | `Picture` | `uv/Picture` |
| 9 | `Faq` | `uv/Faq` |
| 10 | `CtaCard` | shared `CtaCard` `tone="glass"` with the `SignupForm` |
| 11 | `Trust` | `TrustSeals` |
| — | `FloatingCta` | shared |

Overflow checks at 320 px: the word "Mietverwaltung", the list's "Bereit für BKA" next to an ellipsed name, "Objekt 12" / "wird erstellt" in a grid cell, "Werte zum Stichtag übernommen", "Lindenallee 12 · 18 WE", the checker's pills ("Rechtzeitig kündigen") next to the ellipsed status.
