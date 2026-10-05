# Phase 7: The other cities

Goal: every city linked in the Berlin design's footer gets its page at `/messdienstanbieter/<slug>`, built from the **same template** as Berlin and filled from its own design. This starts once Berlin (phases 1–6) is complete. No new section components should be needed: phases 2 and 3 already model everything the other designs vary.

## 7.1 Inventory

Footer order of the Berlin design, which is also the order of `CITIES` and the footer "Städte" group. Slugs are ASCII (umlauts → `ae`/`oe`/`ue`), names keep the umlauts.

| # | City | Slug | Design | Map variant | Districts | Example property (hero) | H1 |
|---|---|---|---|---|---|---|---|---|
| 1 | Berlin | `berlin` | [FxQX9JtVueXdSSvCBRoEoW](https://claude.ai/artifact/FxQX9JtVueXdSSvCBRoEoW) | polygons | 12 | Kastanienallee 12 · Prenzlauer Berg · Altbau | Messdienst wechseln in Berlin. Ohne Wartezeit. |
| 2 | München | `muenchen` | [CySgA2PkPfXBCS1VV37mg8](https://claude.ai/artifact/CySgA2PkPfXBCS1VV37mg8) | polygons (small labels) | 25 | Clemensstraße 12 · Schwabing-West · Altbau | Messdienst wechseln in München. Ohne Hürden. |
| 3 | Hamburg | `hamburg` | [JaHqbeaXHPcw8PiHZJ7Wr1](https://claude.ai/artifact/JaHqbeaXHPcw8PiHZJ7Wr1) | polygons | 7 | Isestraße 12 · Harvestehude · Altbau | Messdienst wechseln in Hamburg. Ohne Umwege. |
| 4 | Köln | `koeln` | [9tTTuZrVurirZYAiwUcXkC](https://claude.ai/artifact/9tTTuZrVurirZYAiwUcXkC) | polygons | 9 | Brüsseler Straße 12 · Belgisches Viertel · Altbau | Messdienst wechseln in Köln. Ohne Aufwand. |
| 5 | Frankfurt | `frankfurt` | [Ju5jKgyBLCEAvKDTi6aroi](https://claude.ai/artifact/Ju5jKgyBLCEAvKDTi6aroi) | polygons (small labels) | 16 | Oeder Weg 12 · Nordend · Altbau | Messdienst wechseln in Frankfurt. Ganz einfach. |
| 6 | Düsseldorf | `duesseldorf` | [7ngcmkonN51an61Sggtk5V](https://claude.ai/artifact/7ngcmkonN51an61Sggtk5V) | polygons | 10 | Lindemannstraße 12 · Düsseltal · Altbau | Messdienst wechseln in Düsseldorf. Ohne Stillstand. |
| 7 | Stuttgart | `stuttgart` | [DekEEb4PakhMsvKoyj6WGr](https://claude.ai/artifact/DekEEb4PakhMsvKoyj6WGr) | polygons | 23 | Gutenbergstraße 12 · Stuttgart-West · Altbau | Messdienst wechseln in Stuttgart. Ohne Umstände. |
| 8 | Leipzig | `leipzig` | [JUGSY11MVCRzTksHBxekh5](https://claude.ai/artifact/JUGSY11MVCRzTksHBxekh5) | polygons | 10 | Karl-Heine-Straße 12 · Plagwitz · Altbau | Messdienst wechseln in Leipzig. Ohne Warten. |
| 9 | Dortmund | `dortmund` | [Ayt6qb2Tkq8ecvycLCyxBv](https://claude.ai/artifact/Ayt6qb2Tkq8ecvycLCyxBv) | outline + dots | 12 | Kreuzstraße 12 · Kreuzviertel · Altbau | Messdienst wechseln in Dortmund. Ohne Zeitverlust. |
| 10 | Bremen | `bremen` | [CKZrdZ17CsAYGHKw9p2Xjn](https://claude.ai/artifact/CKZrdZ17CsAYGHKw9p2Xjn) | polygons | 5 | Humboldtstraße 12 · Ostertor · Altbau | Messdienst wechseln in Bremen. Ganz unkompliziert. |
| 11 | Essen | `essen` | [1MbdSxSc269m8kUiGGkkN2](https://claude.ai/artifact/1MbdSxSc269m8kUiGGkkN2) | polygons | 9 | Isenbergstraße 12 · Rüttenscheid · Altbau | Messdienst wechseln in Essen. Ohne Stress. |
| 12 | Dresden | `dresden` | [SYu9TxSWW911G6gQhcS1Tf](https://claude.ai/artifact/SYu9TxSWW911G6gQhcS1Tf) | polygons | 10 | Alaunstraße 12 · Äußere Neustadt · Altbau | Messdienst wechseln in Dresden. Ohne Verzögerung. |
| 13 | Nürnberg | `nuernberg` | [67f9j2BeUxhg3UzoPpC7ED](https://claude.ai/artifact/67f9j2BeUxhg3UzoPpC7ED) | outline + dots | 10 | Johannisstraße 12 · St. Johannis · Altbau | Messdienst wechseln in Nürnberg. Mit einer Unterschrift. |
| 14 | Hannover | `hannover` | [WNCTYA7PL2AWpkuq8Zqmfw](https://claude.ai/artifact/WNCTYA7PL2AWpkuq8Zqmfw) | polygons | 13 | Lister Meile 12 · List · Altbau | Messdienst wechseln in Hannover. Ohne Mehraufwand. |
| 15 | Duisburg | `duisburg` | [Wc5UvjnShyWJFgEacKLgJg](https://claude.ai/artifact/Wc5UvjnShyWJFgEacKLgJg) | polygons | 7 | Düsseldorfer Straße 12 · Dellviertel · Altbau | Messdienst wechseln in Duisburg. Einfach und sofort. |
| 16 | Bochum | `bochum` | [Lry9uHketBLVcK5WySqFgc](https://claude.ai/artifact/Lry9uHketBLVcK5WySqFgc) | outline + polygons | 6 | Königsallee 12 · Ehrenfeld · Altbau | Messdienst wechseln in Bochum. Ohne Hin und Her. |
| 17 | Wuppertal | `wuppertal` | [YRuLTCNL2JvvsPruVWQm88](https://claude.ai/artifact/YRuLTCNL2JvvsPruVWQm88) | outline + dots | 10 | Luisenstraße 12 · Luisenviertel · Altbau | Messdienst wechseln in Wuppertal. Ganz entspannt. |
| 18 | Bielefeld | `bielefeld` | [15RHkomTT9avFUktxTLfxq](https://claude.ai/artifact/15RHkomTT9avFUktxTLfxq) | outline + polygons | 10 | Arndtstraße 12 · Bielefelder Westen · Altbau | Messdienst wechseln in Bielefeld. Ohne Mehrarbeit. |
| 19 | Bonn | `bonn` | [Q8yednsFZXxuxXWeCs5H2F](https://claude.ai/artifact/Q8yednsFZXxuxXWeCs5H2F) | outline + polygons | 4 | Poppelsdorfer Allee 12 · Südstadt · Altbau | Messdienst wechseln in Bonn. Ohne Reibungsverluste. |
| 20 | Münster | `muenster` | [UxpTtkZ1K96qYD1SS6AxJw](https://claude.ai/artifact/UxpTtkZ1K96qYD1SS6AxJw) | outline + polygons | 6 | Hammer Straße 12 · Südviertel · Altbau | Messdienst wechseln in Münster. Reibungslos und sofort. |
| 21 | Mannheim | `mannheim` | [UeybWQRF9M3rP6YQqdNmfd](https://claude.ai/artifact/UeybWQRF9M3rP6YQqdNmfd) | outline + polygons | 17 | Augartenstraße 12 · Schwetzingerstadt · Altbau | Messdienst wechseln in Mannheim. Ohne Doppelarbeit. |
| 22 | Karlsruhe | `karlsruhe` | [8zwAuPCW3dTwpmYyNabXkt](https://claude.ai/artifact/8zwAuPCW3dTwpmYyNabXkt) | outline + polygons (small labels) | 27 | Kaiserallee 12 · Weststadt · Altbau | Messdienst wechseln in Karlsruhe. Schnell und einfach. |
| 23 | Augsburg | `augsburg` | [JogTwYnwDSBC1DUqoAj6sQ](https://claude.ai/artifact/JogTwYnwDSBC1DUqoAj6sQ) | outline + dots | 10 | Bismarckstraße 12 · Bismarckviertel · Altbau | Messdienst wechseln in Augsburg. Ohne Umstellungsstress. |
| 24 | Wiesbaden | `wiesbaden` | [8mrFdsr3SJfoHf64Yj89QN](https://claude.ai/artifact/8mrFdsr3SJfoHf64Yj89QN) | outline + polygons (small labels) | 25 | Adolfsallee 12 · Rheingauviertel · Altbau | Messdienst wechseln in Wiesbaden. Ohne Aufschub. |
| 25 | Mönchengladbach | `moenchengladbach` | [NtMY9A4dVsx3wvW3iNv5TF](https://claude.ai/artifact/NtMY9A4dVsx3wvW3iNv5TF) | outline + dots | 10 | Bismarckstraße 12 · Gladbach · Altbau | Messdienst wechseln in Mönchengladbach. Ohne Zusatzaufwand. |

**Scope:** the 20 readable cities besides Berlin. Hamburg, Nürnberg and Münster are skipped: their artifacts return "not found" (deleted or not shared). They get added with the same script (§7.4) once their links work. "Ganz Deutschland" in the footer is the Germany page ([08-germany-page.md](08-germany-page.md)).

## 7.2 What's shared and what's per city (checked in all 21 city designs and the Germany design)

**Identical in all designs** (stays in the components):
- The section order and markup (13 sections), the 4 page scripts' logic, the nav, the footer.
- The CSS, apart from the map rules (§7.3) and a comment.
- The references quotes and names, the partner logos (DEUMESS, VDIV, bved), the KPI numbers (92 / 14 / 1–2), the timeline's years and bars (contract until 2029), the hero loop texts, 5 FAQ items, 3 portfolio tabs.

**Different per city** (goes into `cities/<slug>.ts`, model in phase 2.4):
- **The copy of every section.** The designer rewrote each one: text similarity to Berlin (after removing the city name) is only 30–70 % per section. For example, the logo strip says "Hausverwaltungen in ganz Deutschland rechnen bereits mit Heidi ab." in München and "Bundesweit rechnen Hausverwaltungen schon mit Heidi ab." in Augsburg. Only Berlin claims a local team ("Heidi sitzt in Berlin"); the others say "Service für <Stadt>" with a fixed contact person.
- The example property (address, area, units), used in the hero, AllInOne, billing, duo and trio visuals.
- The map: shape, variant, districts with their "Typischer Bestand" and hint texts, the default district, the marker.
- **Two photos:** the hero photo and the references background, each unique per city (22 + 22 files; the hero photos total 3.7 MB, the backgrounds 4.9 MB as embedded JPEGs).
- The logo order in the strip. München also swaps one logo for "Landeshauptstadt München" (a new asset).
- The portfolio tab names and table rows, and the uVI phone values.

**Copy errors found in the designs.** The FAQ question about switching before the contract ends was reworded per city, but in 10 designs the answer still starts with "Nein", which now contradicts the question. For example, Karlsruhe: "Können wir wechseln, obwohl der Vertrag noch läuft?" → "Nein. Heidi übernimmt ab sofort …". Affected: Bochum, Bremen, Dortmund, Duisburg, Düsseldorf, Karlsruhe, Mönchengladbach, Münster, Stuttgart and the Germany page. *Default: import them as designed, list them for the content owner with a proposed fix ("Ja." or dropping the first word), and change them only after sign-off.* The extraction script warns about any FAQ answer that starts with "Nein" when its question doesn't start with "Müssen".

## 7.3 Map variants

The `RegionMap` component (phase 3) handles all of them from the start, so it is built once:

| Variant | Cities | Markup in the design |
|---|---|---|
| polygons | Berlin, München, Köln, Frankfurt, Düsseldorf, Stuttgart, Leipzig, Bremen, Essen, Dresden, Hannover, Duisburg, Hamburg | `path.bz` per district |
| outline + polygons | Bochum, Bielefeld, Bonn, Mannheim, Karlsruhe, Wiesbaden, Münster | `path.bz-out` (non-interactive city outline) under `path.bz` districts that don't cover the whole city |
| outline + dots | Dortmund, Wuppertal, Augsburg, Mönchengladbach, Nürnberg | `path.bz-out` plus `circle.bz.dot` per district, labels as `text.dl` |

CSS: the later designs add rules Berlin doesn't have. Port the **union** into `RegionMap`'s `<style>`: `.bz-out`, `.bz.dot` (+ hover/focus/`.on`), `.bz-l .sm` (8.5 px, hidden below 560 px), `.bm-copy { min-width: 0 }`, `.bm-n { overflow-wrap: anywhere }` (long names like "Thalkirchen-Obersendling-Forstenried-Fürstenried-Solln"), `.bm-map svg { max-height: 600px }` (tall maps: Duisburg's viewBox is 612 × 1080) and `.bm-map { padding-bottom: 44px }` (46 px in München). Apply them to Berlin too and check that Berlin still matches its design. If it doesn't, the padding becomes a `style` override. München's thinner strokes (1.6) and smaller labels (10.5 px) go through `map.style`.

Dots must be focusable and labelled the same way as polygons (`role="button"`, `aria-label`, `aria-pressed`).

## 7.4 Extraction script

20 cities × about 60 text fields, a map and 2 photos each is too much to copy by hand without mistakes. A script converts a design file into a content module:

- **`scripts/extract-city.ts`** (run with `bun`; kept in the repo next to `layout-diff.ts`, because the 3 missing cities and any design revision need it again). Input: the saved design HTML and the slug. It uses Bun's built-in `HTMLRewriter`, so there's no new dependency.
- Output:
  - `cities/<slug>.ts`: every text field of `RegionContent`, the example property, the portfolio and phone data (from the markup and the `data-*` attributes), the FAQ.
  - `cities/<slug>-map.ts`: viewBox, outline, districts (shapes from the SVG, `stock`/`hint` from the design's `BZ` script object), labels, marker, default district.
  - `$lib/assets/landing/cities/<slug>/hero.jpg` and `references.jpg` (the embedded `data:` URIs, decoded).
  - The logo order as `LogoKey[]` (matched by `alt`); an unknown logo (e.g. "Landeshauptstadt München") stops the script with a message, and is added to `customerLogos` by hand.
- **Germany:** the same script handles the Germany design (`--germany`), writing `pages/messdienstanbieter/content.ts` and `germany-map.ts` instead (phase 8).
- **Strict:** every selector the script reads must match exactly once (and the 5 FAQ items exactly 5 times). Otherwise it fails with the selector name, so a design that changed structure isn't imported half-right.
- The generated files are formatted with Prettier, checked in and reviewed like code. The script prints a summary per city (field count, districts, map variant, photo sizes) for the PR.
- **Berlin** is generated with the script too, once it exists, and diffed against the hand-made `berlin.ts` from phase 2. That's the script's test: any difference is either a script bug or a mistake in the hand-made file.

The designs themselves aren't committed (they're 1–1.5 MB each and contain the same photos). Download them into the scratchpad with the Artifact tool's `read` action when running the script.

## 7.5 Per-city work and checks

For each city:
1. Download the design and run `bun scripts/extract-city.ts <design.html> <slug>`.
2. Write the city's own `seo.title` and `seo.description` and choose 2–4 `links.nearby` cities (not in the design; the script leaves them as `TODO` and the type check fails until they're filled).
3. Review the generated module: copy matches the design word for word, umlauts and `&shy;` kept, no `claude.ai` links.
4. Add the entry to `CITIES` with `live: false`.
5. Compare `/messdienstanbieter/<slug>` with its design at **1440 and 375 px** (Berlin covered all 6 widths; the template is the same, so 2 widths catch content problems: long words, label overlap on the map, line breaks in the H1). Check the map at 980 and 560 px as well when the city has small labels or more than 20 districts.
6. Hover/focus 3 districts, including the longest name.
7. Lighthouse mobile on the built preview: the hero photo stays the LCP element and LCP doesn't regress against Berlin. Photos larger than Berlin's (Bochum 330 KB, Leipzig 320 KB, Hannover 286 KB, Augsburg 283 KB, Bremen 281 KB) are resized before import if they don't.
8. Run the e2e smoke loop and the standalone-page checks (phase 6.2), which cover every city in `CITIES`.

## 7.6 Rollout and status

Batches, so the variants get tested before the bulk:

1. **Batch A, one city per map variant:** München (polygons, small labels, the extra logo), Bonn (outline + polygons), Dortmund (outline + dots). This proves the script and the map component on all variants.
2. **Batch B:** the other polygon cities (Köln, Frankfurt, Düsseldorf, Stuttgart, Leipzig, Bremen, Essen, Dresden, Hannover, Duisburg).
3. **Batch C:** the other outline cities (Bochum, Bielefeld, Mannheim, Karlsruhe, Wiesbaden, Wuppertal, Augsburg, Mönchengladbach).

One commit per city (generated module + map + photos + `CITIES` entry) keeps each reviewable. Setting `live: true` is a separate change, made after the city's go-live items (phase 6.4) are done.

Status table (update while working). "Reviewed" = the script's strict checks plus the section-height comparison with the design; copy sign-off, photo licences and claims are business items (§6.4). Only Berlin is `live`; the others render with `noindex` for review:

| City | Generated | SEO title/desc + links written | Reviewed | Visual check | Copy sign-off | Photos licensed | On-site claims confirmed | Live |
|---|---|---|---|---|---|---|---|
| Berlin | ✓ | ✓ (proposal) | ✓ | ✓ all 6 widths | | | | yes |
| München | ✓ | ✓ (proposal) | ✓ | ✓ 1440/375 | | | |  |
| Köln | ✓ | ✓ (proposal) | ✓ | ✓ 1440/375 | | | |  |
| Frankfurt | ✓ | ✓ (proposal) | ✓ | ✓ 1440/375 | | | |  |
| Düsseldorf | ✓ | ✓ (proposal) | ✓ | ✓ 1440/375 | | | |  |
| Stuttgart | ✓ | ✓ (proposal) | ✓ | ✓ 1440/375 | | | |  |
| Leipzig | ✓ | ✓ (proposal) | ✓ | ✓ 1440/375 | | | |  |
| Dortmund | ✓ | ✓ (proposal) | ✓ | ✓ 1440/375 | | | |  |
| Bremen | ✓ | ✓ (proposal) | ✓ | ✓ 1440/375 | | | |  |
| Essen | ✓ | ✓ (proposal) | ✓ | ✓ 1440/375 | | | |  |
| Dresden | ✓ | ✓ (proposal) | ✓ | ✓ 1440/375 | | | |  |
| Hannover | ✓ | ✓ (proposal) | ✓ | ✓ 1440/375 | | | |  |
| Duisburg | ✓ | ✓ (proposal) | ✓ | ✓ 1440/375 | | | |  |
| Bochum | ✓ | ✓ (proposal) | ✓ | ✓ 1440/375 | | | |  |
| Wuppertal | ✓ | ✓ (proposal) | ✓ | ✓ 1440/375 | | | |  |
| Bielefeld | ✓ | ✓ (proposal) | ✓ | ✓ 1440/375 | | | |  |
| Bonn | ✓ | ✓ (proposal) | ✓ | ✓ 1440/375 | | | |  |
| Mannheim | ✓ | ✓ (proposal) | ✓ | ✓ 1440/375 | | | |  |
| Karlsruhe | ✓ | ✓ (proposal) | ✓ | ✓ 1440/375 | | | |  |
| Augsburg | ✓ | ✓ (proposal) | ✓ | ✓ 1440/375 | | | |  |
| Wiesbaden | ✓ | ✓ (proposal) | ✓ | ✓ 1440/375 | | | |  |
| Mönchengladbach | ✓ | ✓ (proposal) | ✓ | ✓ 1440/375 | | | |  |
| Hamburg | ✓ | ✓ (proposal) | ✓ | ✓ 1440/375 | | | |  |
| Nürnberg | ✓ | ✓ (proposal) | ✓ | ✓ 1440/375 | | | |  |
| Münster | ✓ | ✓ (proposal) | ✓ | ✓ 1440/375 | | | |  |

## 7.7 Build and bundle impact

- Each city's content and map are a separate lazy chunk (phase 2.3), so a page loads only its own city. The `CITIES` index (slugs, names, `live`) is the only part in every landing page's bundle, a few hundred bytes.
- 42 new photos go through `?enhanced`, which generates several sizes and formats for each one. Check the build time and the size of the Vercel output after batch A. If either grows too much, limit the generated widths for these imports (hero: up to 1280 px, references: up to 1440 px).
- The sitemap grows to 25 city entries once all are live.

## 7.8 Hamburg, Nürnberg and Münster (2026-10-05)

Their links became readable later. Compared with the designs of the same map variant (Köln, Bonn, Dortmund): the CSS and the markup skeleton (tags, classes, attributes) are identical, and the scripts differ only in the default district. So only the data differs, and the three were added with the script and no component change:

- **Hamburg:** polygons, the 7 Bezirke, default Eimsbüttel. **Nürnberg:** outline + dots, 10 Stadtteile, default St. Johannis. **Münster:** outline + polygons, the 6 Stadtbezirke, default Mitte.
- New logo order in each strip, no new logo. Photos: Hamburg 121 + 203 KB, Nürnberg 83 + 215 KB, Münster 296 + 107 KB (Münster's hero photo is among the larger ones, see §7.5 step 7).
- Münster's FAQ "Ist ein Wechsel vor Vertragsende möglich?" answers "Nein. …" (the copy error of §7.2). The ledes of Hamburg (no place) and Münster (Kreuzviertel and Kinderhaus, not on the map of Stadtbezirke) are in `LEDE_WITHOUT_MAP_PLACE`.
- SEO titles/descriptions and nearby links are proposals: Hamburg → Bremen, Hannover; Nürnberg → Augsburg, München; Münster → Bielefeld, Dortmund, Bochum. The other cities' `links.nearby` weren't changed (Bremen/Hannover could link Hamburg, Augsburg/München Nürnberg, Bielefeld/Dortmund Münster; for the SEO sign-off).
- On the Germany map their dots appear once they're live; until then Hamburg uses its fallback hint. The 404 tests now use `potsdam` as the unknown city.

## Done when

- All 24 cities besides Berlin render at `/messdienstanbieter/<slug>`, match their designs at 1440 and 375 px, and pass the e2e smoke loop.
- No section component was copied for a single city. Everything city-specific is in `cities/<slug>.ts`, `cities/<slug>-map.ts` and `$lib/assets/landing/cities/<slug>/`.
- The sitemap lists exactly the cities with `live: true`; the footer "Städte" group lists every city.
- Hamburg, Nürnberg and Münster are added once their designs can be read (done 2026-10-05, §7.8).
