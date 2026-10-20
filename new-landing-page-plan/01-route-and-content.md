# Phase 1: Route, links, content and the shared frame

## 1.1 Route and links

In one commit:

- `ROUTE_AUSWERTUNG = "/auswertung"` in `$lib/routes.ts`, after `ROUTE_DASHBOARD`.
- The landing footer's "Auswertung" (`$lib/landing/footerLinks.ts`, group "Plattform") gets `href: ROUTE_AUSWERTUNG`.
- `/neuigkeiten`'s featured story "Heidi Auswertung: Verbrauch, Kosten und Auffälligkeiten auf einen Blick" gets `more: { text: "Zur Auswertung", href: ROUTE_AUSWERTUNG }` (the design's link text, in place of the comment "no page yet"); its `content.test.ts` ("has the design's link texts") and `e2e/neuigkeiten.e2e.ts` ("stories and rows link only where a page exists": "The featured Auswertung has no page yet") change with it.
- `src/routes/(landing-page)/auswertung/+page.server.ts`, as `/dashboard`'s:

```ts
seo: {
	// Drafts for the content owner (plan §4.4).
	title: "Heidi Auswertung: Verbräuche Ihres Bestands klar ausgewertet | Heidi Systems",
	description:
		"Heidi wertet die Funkdaten aller Zähler für jede Liegenschaft aus: geprüfte Werte, Vergleich im Portfolio, Jahresverlauf zum Vorjahr, Hinweise mit nächsten Schritten und Berichte für Eigentümer.",
	ogTitle: "Ihre Verbräuche. Klar ausgewertet.",
	noindex: true,
	keepCanonical: true,
},
landing: DEFAULT_CHROME,
finalForm: await emptySwitchForm("final"),
```

  and the default action `handleSwitchSignup(event, { source: "auswertung", page: ROUTE_AUSWERTUNG })`. No `cache-control`.
- Sitemap: no entry until the cutover (gate §4.4).

## 1.2 `/dashboard`'s frame, hero frame and closing

Pure moves, so `/dashboard` renders the same HTML and CSS (the class names change only in Svelte's scoping hashes):

- `$lib/landing/pages/dashboard/DbMain.svelte`: `<main id="content" class="db" {@attach reveal(".rv", { threshold: 0.18 })}>{@render children()}</main>` with the whole `<style>` block of `routes/(landing-page)/dashboard/+page.svelte` (tokens, `.sec`, the reveal, `.db-h2`, `.db-lead`, `.db-c`, `.db-btn`, `.okb`, `.badge`, `#hs-css`). The route's `+page.svelte` renders its sections inside `DbMain`.
- `$lib/landing/pages/dashboard/components/HeroFrame.svelte`: the hero's `<section class="sec hero" aria-labelledby="db-h1">`, `.wrap.in`, `Pill` (live), the H1 (`data-hs`, two parts), the `.sub` paragraph (a `line` snippet), the `.ctas` with the two `.db-btn` (`primary`, `secondary`, both with `focusSignup`) and `children` (the visual); the styles of those elements move with it (`.hero`, `.in`, `h1`, `h1 span`, `.sub`, `.l1`/`.l2` above 1000 px, `.ctas`, the 640 px padding). `dashboard/sections/Hero.svelte` keeps its chips, hint and preview and passes them in.
- `dashboard/sections/Closing.svelte`: a `content` prop (`ClosingContent`: `h2`, `h2Accent`, `text`, `submitLabel`, `chart`), default `closing` from `dashboard/content.ts`.

## 1.3 Content module

`$lib/landing/pages/auswertung/content.ts`, word for word from the design:

- `hero`: pill "Heidi Auswertung", `h1` ["Ihre Verbräuche.", "Klar ausgewertet."], `line` "Heidi wertet die Funkdaten aller Zähler für jede Liegenschaft aus.", `primary` "Demo buchen" → `DEMO_HREF`, `secondary` "Angebot einholen" → `START_HREF` (open question 1).
- `properties`: the seven example properties with their units: "Lindenallee 12" 36, "Gartenweg 3" 12, "Bergmannstraße 4" 24, "Am Stadtpark 7" 32, "Mühlenstraße 18" 18, "Schillerhöfe" 48, "Hofstraße 21" 18 (188 in all).
- `metrics` (the design's `MET`): `heiz` "Heizung" "kWh/m²" `[118, 96, 142, 104, 88, 131, 99]` 0 decimals; `ww` "Warmwasser" "m³/WE" `[14.2, 11.8, 17.6, 12.9, 10.4, 16.1, 13.0]` 1; `kw` "Kaltwasser" "m³/WE" `[31.5, 28.0, 38.2, 30.1, 26.4, 35.7, 29.8]` 1. `period` "Jan – Okt".
- `mock`: label "Beispiel: Auswertung eines Portfolios mit Vergleich und Hinweisen", title "Auswertung", sub "Portfolio · 7 Liegenschaften · 188 Einheiten", chip "Jan – Okt", tag "Beispieldaten", export "Report exportieren"; the KPIs ("Heizung im Schnitt" 111 "kWh/m²" "−7 % zum Vorjahr" green, "Warmwasser im Schnitt" 13,7 "m³/WE" "−4 % zum Vorjahr" green, "Hinweise offen" 3 "1 dringend" orange); the chart head "Heizung je m² im Vergleich" and "Ø Portfolio 111"; three notes (`o` "!" "Bergmannstraße 4" "28 % über dem Portfolio-Schnitt", "↓" "Mühlenstraße 18" "Niedrigster Verbrauch je m²", "↗" "Schillerhöfe" "Warmwasser seit Februar über Vorjahr").
- `steps`: pill "So entsteht die Auswertung" (`sparkle`), h2 "Von der Funkablesung zur Kennzahl. Automatisch.", lead; three cards "01" `signal` "Funkwerte" (text, tickers "HKV 0412 · 2.180", "WWZ 0081 · 18,4 m³"), "02" `check` "Plausibel geprüft" ("12.480 Werte plausibel", warn "3 Werte markiert"), "03" `chart` "Kennzahlen und Berichte" ("111 kWh/m² Heizung", "Report Q3 bereit").
- `compare`: pill "Vergleich" (`building`), h2 "Welche Liegenschaft fällt aus der Reihe?", the text, the list ("Heizung je m², Wasser je Wohneinheit", "Vergleich mit dem Schnitt Ihres Portfolios", "Sortiert nach Abweichung"), the switch's name "Kennzahl", legend "über Ø" / "unter Ø", "Beispieldaten".
- `heatmap`: pill "Jahresverlauf" (`clock`), h2 "Das ganze Jahr auf einen Blick", lead, `months` "Jan" … "Dez", `rows` (per property the twelve deviations in %, the design's `data-v`), legend "weniger als Vorjahr" / "mehr als Vorjahr", "Beispieldaten", `tip` "{v} zum Vorjahr", the `sr-only` table's caption "Heizverbrauch je Monat im Vergleich zum Vorjahr (Beispieldaten)".
- `hints`: pill "Hinweise" (`bell`), h2 "Nicht nur Zahlen. Konkrete nächste Schritte.", the text, the list ("Leckageverdacht aus dem Nachtverbrauch", "Abweichungen zum Vorjahr", "Zähler ohne Funksignal"); the card's title "Hinweise", the filter's name "Filter" and chips (`all` "Alle" with the count, `w` "Wasser", `h` "Heizung", `t` "Technik"); five notes (kind, tone, place line, title, text, action), word for word: "Wasser · Gartenweg 3 · WE 04" "Leckageverdacht" "An 3 Tagen lief nachts durchgehend Wasser." "Spülkasten prüfen lassen" (`w`, `o`); "Heizung · Bergmannstraße 4 · November" "Verbrauch deutlich höher" "24 % mehr als im Vorjahresmonat." "Heizungseinstellung prüfen" (`h`, `o`); "Technik · Schillerhöfe · WE 17" "Zähler ohne Signal" "Seit 6 Tagen keine Funkwerte." "Heidi plant einen Termin" (`t`, `b`); "Wasser · Schillerhöfe" "Warmwasser über Vorjahr" "Seit Februar über dem Vorjahreswert." "Verlauf beobachten" (`w`, `y`); "Heizung · Mühlenstraße 18" "Verbrauch gesunken" "13 % weniger als im Vorjahr." "Kein Handlungsbedarf" (`h`, `g`); the count line "{n} Hinweise".
- `report`: pill "Berichte" (`file`), h2 "Ein Bericht für Eigentümer. In wenigen Klicks.", the text, the formats (`file` "PDF", `chart` "Excel", `link` "ERP und CRM"); the document ("Verbrauchsbericht Q3", "Lindenallee 12 · 36 Einheiten", "Heizung" "104" "kWh/m²", "Warmwasser" "12,9" "m³/WE", "zum Vorjahr" "−7 %", the nine bar heights `[82, 74, 60, 44, 28, 18, 15, 17, 30]`, "Keine offenen Hinweise", "Alle 112 Zähler übertragen", "Beispieldaten"), the badge "Bericht erstellt".
- `closing` (`ClosingContent`): h2 "Sehen Sie, was in Ihren" / accent "Verbräuchen steckt.", text "Wir zeigen Ihnen in einer Demo, wie Ihr Bestand in der Heidi Auswertung aussieht.", `submitLabel` "Bestand kostenlos prüfen", `chart` `/dashboard`'s.

`content.test.ts`: the H1's two texts; seven properties with 188 units in all, every metric with seven values; the mock-up's "Ø Portfolio 111" and its note "28 %" agree with `metrics.ts` on the heating values; three steps with two tickers each; seven heatmap rows of twelve values, months twelve; five notes, every kind in the filter, the count "Alle 5"; nine report bars; every icon in `dashboard/icons.ts`; every `href` a route or `#start`; no empty, doubled-space or untrimmed text.

## 1.4 Pure logic

`$lib/landing/pages/auswertung/metrics.ts`:

- `average(values)`, `barScale(values, headroom)` (the design's maximum × 1.1 in the mock-up, × 1.08 in the comparison), `share(value, max)` in %.
- `ranking(values)`: each row's rank by value, highest first (stable).
- `deviation(value, avg)`: `Math.round((value / avg − 1) × 100)` and its text (`+28 %`, `−21 %`, `±0 %`, with `NB` before `%` as the other pages' and the design's U+2212 minus).
- `isHigh(value, avg, factor)`: the mock-up's `> avg × 1.1`, the comparison's `> 0`.
- `heatColor(v)`: `#3E9A57` (≤ −10), `#8AD68F` (≤ −4), `#E7ECE9` (< 4), `#F2C79B` (< 12), `#D9622B`; `heatTip(v)`: "−4 % zum Vorjahr", "+7 % …", "±0 % …".
- `filterHints(hints, filter)`.

`metrics.test.ts`: the average 111,1 and Bergmannstraße's +28 %, the order of each metric, the signs and `±0`, the colour steps at their borders (−10, −4, 4, 12), the filter.

## 1.5 Images

None new. The logos and the Werne logo come from `$lib/landing/data/logos` through `/dashboard`'s `LogoStrip` and `Quote`.
