# Phase 2: The template's new variants and the sections

## 2.1 The shared `uv` template grows (one commit, before any section of this page)

What this design draws that `uv/` can't render yet. Every change is opt-in through content, so `/mieterportal`, `/verbrauchsinformation`, `/hausverwaltung` and `/mietverwaltung` keep rendering the same:

| Change | Design | How |
|---|---|---|
| Placeholder cells in the grid | `.uv-cal span.pl`: no label at any step, the tick circle invisible, a done placeholder keeps the faint colour; `#uv-js` doesn't move the note for it | `CalendarTile.cells?: CalendarCell[]`, one per month; `{ kind: "placeholder" }`. While only placeholders are done, the note keeps the last pass's final note, as the design's note does (it never resets) |
| Milestone cells | `.uv-cal span.tag` with `data-e` (its label in place of done/doing) and `data-n` (its note in place of the templates): label in ink, lime background and an ink tick circle when done | `{ kind: "milestone", label, note }`; `label` / `note` also work on a plain cell |
| A milestone as the current cell | The design paints its label ink on the ink "now" background (unreadable) | The current cell keeps the accent label (open question 4) |
| `done`, `doing`, `noteDone`, `noteDoing` | The design's `data-done=""` etc. | Optional (default empty) when every cell brings its own label and note |
| An `ok` bill row with a text value | `.uv-bl.ok b.t`: green `#2F7A3C`, 13 px, no circle | `Bill`'s `ok` rows with `value` render it so (no built page has one) |

Check before committing: the four pages' e2e specs pass; production-build screenshots at 1440 and 375 px with reduced motion before/after identical.

## 2.2 Sections

Static markup, every block in its end state. Section ids: `wv-h1`, `inhalt`, `wv-num-h`, `wv-q-h`, `faq`, `start` (closing card).

| # | Section | Notes |
|---|---|---|
| 1 | `Hero` | `uv/Hero` `size="lg"`, the word "WEG‑Verwaltung", `ListMock` between the photos |
| 2 | `Statement` | `uv/Statement` |
| 3 | `Rows` | `Calendar` (stone, Jan–Dez with three milestones), `Bill` (mint, Ohne / Mit Heidi), `Doc` (stone, Kostenverteilung), `Phone` (ink, bars) |
| 4 | `Rotator` | `uv/Rotator` |
| 5 | `Numbers` | `uv/Numbers` with the kitchen photo |
| 6 | `Audience` | `uv/Audience`; two photos, no buttons |
| 7 | `Quotes` | `uv/Quotes` |
| 8 | `Picture` | `uv/Picture` |
| 9 | `Faq` | `uv/Faq` |
| 10 | `CtaCard` | shared `CtaCard` `tone="glass"` with the `SignupForm` |
| 11 | `Trust` | `TrustSeals` |
| — | `FloatingCta` | shared |

Overflow checks at 320 px: the word "WEG‑Verwaltung" (one line, `nowrap`), the list's "Vor ETV fertig" next to an ellipsed name, "Vertragsende" in a grid cell, "Kündigung, Montage, Information" next to "Heidi", "eine Unterschrift" as the bill's sum, "Verteilschlüssel nach Beschluss".
