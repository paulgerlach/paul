# Phase 2: The sections

## 2.1 What differs from the Wohnungsunternehmen design

Diffed against it (every `<style>` / `<script>` block and all 17 media identical by MD5; markup identical apart from):

| Where | Wohnungsunternehmen | Asset Manager & Fonds |
|---|---|---|
| `main[data-seg]` | `WU` | `AM` |
| Hero pill | house icon, "Für Wohnungsunternehmen" | bars icon, "Für Asset Manager & Fonds" |
| H1 | "Große Bestände. *Strukturiert umgestellt.*" | "Verbräuche im ganzen Portfolio. *Auf einen Blick.*" |
| Lead | "Für Wohnungsunternehmen planen wir …" | "Für Asset Manager und Fonds liefert Heidi eine einheitliche Datenbasis …" |
| Slider start (`data-units`) | 4800 | 12000 |
| Current tab | Wohnungsunternehmen | Asset Manager & Fonds; Wohnungsunternehmen links to its design |
| Benefits pill | "Für Wohnungsunternehmen" | "Für Asset Manager & Fonds" |
| Benefits | Portfolio-Analyse, Rollout im Cluster, Montage mit Plan, Angebunden an Ihr ERP | Ein Dashboard (bars), Monatliche Daten (trend), Pflichten im Griff (alert), Daten, wo Sie sie brauchen (erp) |
| Quotes | `vitolus`, `gerhard` | `gerhard`, `werne` |
| FAQ 1–2 | "Wie läuft der Wechsel bei mehreren tausend Einheiten?", "Gibt es Konditionen für große Bestände?" | "Welche Daten sehen wir?", "Wie schnell sind alle Objekte fernablesbar?" |

## 2.2 The page

The 13 wrappers of `/wohnungsunternehmen`'s `sections/`, each importing this page's `content.ts`; `+page.svelte` in the same order (Hero, Tabs, LogoStrip, LargeStock, Pain, Benefits, Features, Steps, Testimonials, Faq, Closing, Trust inside `SgMain`, FloatingCta after `</main>`). The closing card's heading id `am-closing-h`.

Every block in its end state as on `/wohnungsunternehmen` (its plan, 02 §2.2), with the calculator at 12.000. Overflow checks at 320 px: the benefits' titles ("Daten, wo Sie sie brauchen"), the H1 ("Verbräuche im ganzen Portfolio." at 36 px), "12.000".
