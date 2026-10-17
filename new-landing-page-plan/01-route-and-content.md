# Phase 1: Route, content, pure modules, signup and shared pieces

## 1.1 Route and links

One commit, so the footer link never points at a 404:

- `ROUTE_DASHBOARD = "/dashboard"` in `$lib/routes.ts`.
- `$lib/landing/footerLinks.ts`: "Plattform" → `{ text: "Dashboard", href: ROUTE_DASHBOARD }`.
- `$lib/landing/pages/hilfe/content.ts`: both `more: { text: "Dashboard ansehen" }` get `href: ROUTE_DASHBOARD` (its `content.test.ts` accepts any route constant; check).
- `src/routes/(landing-page)/dashboard/+page.server.ts`, modelled on `mieterportal/+page.server.ts`:

```ts
export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title: "Heidi Dashboard: Verbrauch, Kosten und Abrechnung Ihres Bestands | Heidi Systems",
		description:
			"Alle Objekte in einem Dashboard: Verbräuche, Kosten und CO₂-Einsparung je Liegenschaft, Benachrichtigungen, Leckage-Wächter und Heizkostenabrechnung per Klick. Mit bedienbarer Vorschau.",
		ogTitle: "Ihr ganzer Bestand. In einem Dashboard.",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: true,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	finalForm: await emptySwitchForm("final"),
});

export const actions: Actions = {
	default: (event) =>
		handleSwitchSignup(event, { source: "dashboard", page: ROUTE_DASHBOARD }),
};
```

  The page sets no `cache-control`, because the layout does. `leads.source` is free text, so the new source needs no migration; check that the Make.com `switchinquiry` scenario doesn't filter on known `page` values (gate §4.4).
- `+page.svelte`: `<main id="content" class="db" {@attach reveal()}>` with the sections in design order and `FloatingCta` after `</main>`. The wrapper defines the page tokens (README, Styling), the section background (`--bg`) and the hairline between sections (`.db-sec + .db-sec`), the `#hs-css` sizes scoped as on `/mieterportal` (`h1[data-hs]` and `section h2[id]` in the 621–1040 and ≤620 queries, with selectors specific enough to beat the `tokens.css` heading reset), and the reveal styles (`.rv`: `opacity`/`translateY(18px)` over 0.7 s; the design's threshold is 0.18 with a −40 px bottom margin: use them if `reveal()` takes options, otherwise its defaults).
- Sitemap: no entry until the cutover (gate §4.4).

## 1.2 Thumbnails

The recommendation list's seven building photos (96×96 jpeg, ~3 KB each, embedded in `#dash-js` as `PLIMG`) go into `src/lib/assets/landing/dashboard/property-1.jpg` … `property-7.jpg`, saved as they are. They're imported where used (`?enhanced` makes no sense at 96 px: plain URL imports rendered with `<img width="48" height="48" loading="lazy" alt="">`, as the design draws them at 48 px; check the exact size in `.pl-n .ic`). Logos come from `customerLogos`, the floating CTA's avatars from the shared region assets.

## 1.3 Content module

`$lib/landing/pages/dashboard/content.ts` holds every text and the example data outside the preview, word for word from the design. Non-breaking spaces before `%`, `€` and units ("6,8 %", "12,48 €/m²", "bis zu 200 € pro Jahr", "126 l").

- `hero`: pill "Heidi Dashboard" (live dot), H1 "Ihr ganzer Bestand." / "In einem Dashboard.", line 1 "Verbräuche, Kosten und Abrechnungen aller Objekte auf einer Plattform.", line 2 "Mit den Kennzahlen, die zählen:" + three chips `{ icon, text, pop }`: "Verbrauch" (bars `[70, 55, 40, 30, 35, 48]` %, the last highlighted, caption "kWh pro Monat"), "Kosten" (`count: 18420`, caption "Heizkosten 2026 · Beispiel"), "Benachrichtigungen" ("Auffälliger Verbrauch" / "Lindenallee 12 · WE 07"); CTAs "Demo buchen" (→ `DEMO_HREF`) and "Bestand kostenlos prüfen" (→ `START_HREF`); hint "Probieren Sie es aus: Das Dashboard ist voll bedienbar."; preview label "Bedienbare Vorschau des Heidi Dashboards mit Beispieldaten".
- `logos`: text "Im Einsatz bei", strong "Hausverwaltungen in ganz Deutschland" (the default logo order; check it is the design's: Berlin, Dumax, Harte, HSP, raumgold, Schleicher, Vitec, Wagner, Werne, Neckar, Niesen, Pro Gera).
- `kpis`: pill "Kennzahlen", H2 "Verstehen Sie Ihren Bestand auf einen Blick", lead "Die wichtigsten Kennzahlen jeder Liegenschaft, automatisch aus den Funkwerten erfasst.", three cards:
  - "Verbrauch": "Kaltwasser, Warmwasser, Heizung und Strom je Objekt, täglich, wöchentlich oder monatlich.", figure `104` "kWh/m²", delta "↓ 6,8 %", sparkline `[62, 58, 61, 55, 57, 52, 54, 49, 50, 47, 46, 44]` (y range 35–70, as the design's `(y − 35) / 35`).
  - "Kosten": "Gesamtkosten und Heizkosten je Monat auf einen Blick, damit Ausreißer früh auffallen.", unit "€/m²", modes "Gesamt" / "Heizung" (group label "Kostenart"), captions "Gesamtkosten 2025" / "Heizkosten 2025", per month "Gesamtkosten {Monat}" / "Heizkosten {Monat}", tooltip rows "Heizung", "Übrige Kosten", "Gesamt", chart label "Kosten je Monat. Mit Maus, Finger oder Pfeiltasten einen Monat wählen." Data from `kpi.ts`.
  - "Einsparung": "Sehen Sie, wie viel CO₂ Ihr Bestand im gewählten Zeitraum einspart.", unit "t CO₂", modes "Kumuliert" / "Je Monat" (group label "Darstellung"), caption "eingespart Jan – Sep", per month "bis Ende {Monat}" / "im {Monat}", tooltip rows "Kumuliert" / "Im Monat", "davon im Monat", chart label "CO₂-Einsparung je Monat. Mit Maus, Finger oder Pfeiltasten einen Monat wählen." Data from `kpi.ts`.
- `strike`: label "Was Ihnen das Dashboard abnimmt", five lines "Ablesewerte per Excel einsammeln", "Mieter für jeden Ablesetermin anschreiben", "Verbräuche aus PDFs abtippen", "Monatelang auf die Abrechnung warten", "Leckagen erst mit der Jahresrechnung bemerken", final "Alles auf einen Blick." + accent "Mit Heidi.".
- `features`: pill "Funktionen", H2 "Aus Verbrauchsdaten werden klare Entscheidungen", lead "Objekte anlegen, Benachrichtigungen erhalten, Funktionen auf Knopfdruck nutzen und das Dashboard mit Ihrem Team teilen.", six cards `{ id, size: 7 | 5, title, text }` in design order (Objekte anlegen 7, Benachrichtigungen 5, Bestandszähler übernehmen 5, Leckage-Wächter 7, Heizkostenabrechnung per Klick 7, Dashboard teilen 5), each with its demo data:
  - `addObject`: placeholder "Adresse der Liegenschaft …", tags "Mehrfamilienhaus", "Funk", button "Hinzufügen", entries `[Bergmannstraße 4, 24 WE]`, `[Lindenallee 12, 18 WE]`, `[Gartenweg 3, 12 WE]`, `[Am Stadtpark 7, 32 WE]`, `[Mühlenstraße 18, 18 WE]`; the list shows three, newest first; the server shows the first two (Bergmannstraße on top).
  - `notifications`: five `{ tone: "ok" | "in", title, sub }`: Mieter eingezogen / WE PL12VH3DGr; 32 % höherer Verbrauch / WE SH39LF10Gl · Warmwasser (`in`); Alle Zähler in Ordnung / Bergmannstraße 4 · heute übertragen; 12 % weniger Heizverbrauch / Gartenweg 3 · zum Vorjahr; Funkablesung abgeschlossen / 370 Wohnungen · 05.10.2026.
  - `takeOver`: five rows `{ type, unit, source: "funk" | "bestand" }` (Heizkostenverteiler WE 01 funk, Heizkostenverteiler WE 02 bestand, Warmwasserzähler WE 02 funk, Kaltwasserzähler WE 03 bestand, Wärmemengenzähler Keller funk), badges "Heidi-Funk" / "Bestand", note "Getauscht wird erst zum Ende des bisherigen Vertrags."
  - `leak`: label "Kaltwasser · WE 04 · letzte 14 Tage", legend "Normalwert ~126 l", badge "Auffälligkeit erkannt (3 Tage)", 14 daily values `[128, 116, 142, 121, 111, 135, 148, 122, 119, 196, 208, 214, 126, 120]` with days 10–12 flagged, baseline 126, gridlines 150 l and 200 l, x labels Tag 1, 4, 7, 10, 14, tooltip "{v} Liter" / "Tag {t}" (+ " · auffällig"), the chart's label "Täglicher Kaltwasserverbrauch über 14 Tage, an Tag 10 bis 12 deutlich über dem Normalwert", the footnote "An 3 Tagen lief nachts durchgehend Wasser – häufigste Ursache: laufende Spülung. Ein tropfender Spülkasten kostet unbemerkt bis zu 200 € pro Jahr." Coordinates are computed (`chart.ts`), not copied: x = 48 + i × 492 / 13, y = 141.4 − (v − 126) × 1.186, which reproduces the design's points (128 → 139.0, 214 → 37.0) and gridlines (150 l at 112.9, 200 l at 53.6); the highlight band spans days 10–12.
  - `billingRun`: three properties (Bergmannstraße 4 · 24 WE, Lindenallee 12 · 18 WE, Gartenweg 3 · 12 WE), statuses "Bereit" / "Wird erstellt" / "Erstellt", button "Abrechnungen erstellen" / "Zurücksetzen", hint "Abrechnungszeitraum 2025" / "Plausibilitätsprüfung läuft …", toast "54 Abrechnungen erstellt · zum Herunterladen bereit" (54 = the sum of the WE: test).
  - `share`: field placeholder (typed), "Einladen", "Sie" / "Ihr Konto" (initials "HV"), invitees `[team@ihre-hausverwaltung.de, TM]`, `[buchhaltung@…, BH]`, `[technik@…, TE]`, status "Eingeladen", button "Dashboard teilen".
- `quote`: logo key `werne`, testimonial key `werne`, emphasis "reibungslos und pünktlich".
- `integration`: pill "Schnittstellen", H2 "Direkt in Ihre Verwaltungs­software." (soft hyphen), text "Heizkostenabrechnungen und Verbrauchsdaten gehen aus dem Dashboard direkt an Ihr ERP- oder CRM-System. Kein Abtippen, kein Hin- und Herschicken von Dateien.", link "Anbindung besprechen →" (→ `START_HREF`); the hand-over: label "Beispiel: Heidi übergibt Dokumente an Ihre Verwaltungssoftware", "Automatische Übergabe", "Heute übergeben" starting at `14`, "Heidi" / "Dashboard", "Bereit zur Übergabe", "Ihre Software" / "ERP / CRM", columns "Eingang" / "Zeit", seven items `{ icon, title, place }` (Heizkostenabrechnung Bergmannstraße 4, Verbrauchsdaten September Lindenallee 12, Heizkostenabrechnung Gartenweg 3, Verbrauchsinfo an 32 Mieter Am Stadtpark 7, Zählerstände Mühlenstraße 18, Heizkostenabrechnung Schillerhöfe, Verbrauchsdaten September Hofstraße 21), times "vor 4 Min.", "vor 9 Min.", "vor 16 Min.", "vor 23 Min.", "vor 1 Min.", "gerade eben", labels "bereit", "wird übertragen", "Neu", badge "Beispieldaten", caption "Abrechnungen, Verbrauchsdaten und Verbrauchsinfos landen ohne Export und ohne Abtippen in Ihrer Software."
- `recommendations`: pill "Auswertungen", H2 "Für jede Liegenschaft der nächste Schritt", lead "Heidi prüft Vertragslaufzeit und Zähler jeder Liegenschaft und zeigt den nächsten Schritt: Vertrag übernehmen, Vertrag kündigen oder direkt abrechnen.", filters (group label "Empfehlungen filtern") "Alle", "Vertrag direkt übernehmen", "Vertrag kündigen", "Heizkostenabrechnung", search "Liegenschaft suchen", columns "Liegenschaft" / "Status" / "Empfehlung", "Wird geprüft", "Bestand wird geprüft …", "{n} Liegenschaften geprüft", badge "Beispieldaten"; seven rows `{ name, units, status, detail, kind, photo }` (Lindenallee 12 · 36 Einheiten · Vertrag läuft bis 03/2029 · Heidi übernimmt die Zähler sofort · take; Gartenweg 3 · 12 · Vertrag endet 12/2026 · Kündigung per Vollmacht · cancel; Bergmannstraße 4 · 24 · Heidi-Funkzähler aktiv · Abrechnung 2026 bereit · bill; Am Stadtpark 7 · 32 · Vertrag endet 08/2027 · Rechtzeitig kündigen · cancel; Mühlenstraße 18 · 18 · Vertrag läuft bis 2030 · Heidi übernimmt die Zähler sofort · take; Schillerhöfe · 48 · Heidi-Funkzähler aktiv · Abrechnung 2026 bereit · bill; Hofstraße 21 · 18 · Vertrag endet 01/2027 · Kündigung per Vollmacht · cancel); per kind the popover `{ title, text, steps[3], note }` (the design's `INFO`, word for word); the three small cards (Monatliche Verbrauchsinfo, Verbrauchsprognose, Übergabe an Ihre Software) with their texts.
- `questions`: H2 "Hausverwaltungen stellen jeden Tag dieselben Fragen. Im Dashboard stehen die Antworten.", three rows of four `{ icon, bg, fg, text }` (the design's `R1`–`R3`), durations 70 s, 84 s (reversed), 76 s; pause labels "Anhalten" / "Abspielen" (open question 4).
- `testimonials`: pill "Kundenstimmen", H2 "Was Verwaltungen über Heidi sagen", keys `["vitolus", "gerhard"]`.
- `roadmap`: pill "Produkt-Updates & Roadmap", H2 "Sie bestimmen mit, was als Nächstes kommt.", text "Teilen Sie uns direkt im Dashboard Ihre Wünsche mit und geben Sie an, welche Funktionen Sie sich zukünftig wünschen.", button "Feedback geben →" (→ `START_HREF`, open question 3), items Betriebskosten / Rauchmelder hinzufügen / Feuerlöscher hinzufügen ("Im Funktionsmenü", "Verfügbar") and "Ihr Wunsch" / "Was soll Heidi als Nächstes können?" ("Feedback").
- `closing`: H2 "Sehen Sie Ihren Bestand" + span "in einem Dashboard.", text "Wir prüfen Ihren Bestand kostenlos und zeigen Ihnen, wie er in Heidi aussieht.", submit "Bestand kostenlos prüfen", chart `{ current: [150, 120, 135, 96, 110, 82, 90, 70, 76, 58, 64, 46], previous: [140, 150, 128, 140, 124, 132, 118, 126, 112, 118, 108, 112] }` (SVG y in a 1000×210 box, lower is better). The demo link's text "Lieber direkt eine Demo buchen →" isn't in content until it comes back (open question 2).

The design's links and where they go:

| Design link | Our target |
|---|---|
| Logo, nav, "Anmelden", header "Demo buchen" / "Angebot einholen" | The shared `LandingHeader` |
| Banner "Mehr erfahren" | `/upgrade-now` (`DEFAULT_CHROME`) |
| "Demo buchen" (hero, trust), floating "Erstgespräch vereinbaren" | `DEMO_HREF` (`#start`, the closing card's form) |
| "Bestand kostenlos prüfen", "Anbindung besprechen →", "Feedback geben →" | `START_HREF` |
| "Lieber direkt eine Demo buchen →" | left out (open question 2) |
| Trust "Mehr zu Sicherheit" | none yet (`TrustSeals` leaves it out) |
| The preview's "Impressum" / "Datenschutz" (plain text in the design's side nav) | plain text, as designed (part of the mock) |

`content.test.ts`: no empty strings, no `XX`; three chips; the sparkline has 12 values; six feature cards with sizes summing to 12 per row pair (7 + 5); the leak series has 14 values, exactly the flagged days above 1.4 × the baseline; the billing toast's 54 equals the sum of the three WE; seven recommendations with kinds and the counts 2 / 3 / 2; seven photos; every filter kind has a popover; three question rows of four; the testimonial keys exist and the Werne quote contains the emphasis; every `href` is `DEMO_HREF`, `START_HREF` or a route constant.

## 1.4 Pure modules

All without DOM access, so the server and the browser draw the same thing, and unit-tested:

- **`chart.ts`**: `niceScale(max)` (the design's `nice()`: steps of 0.25/0.5/1/2 × 10ⁿ, returns `{ max, step, ticks }`), `smoothPath(points)` (the design's Catmull-Rom-to-Bézier `smooth()`), `areaPath(points, baseline)`, `toBox(values, max, { x0, x1 })` (values → points in a 0–100 box, bars and points centred in their slot as the design's `X(i) = pad + (i + .5) · w / n`), `expand(values, granularity, seed)` (the design's month → 4 weeks / 7 days spread with its sine wobble), `formatNumber(v)` (the design's `fmtN`: `de-DE`, no decimals from 10, one below, thousands grouped). The closing chart's simpler `smooth()` (horizontal tangents) is `stepCurve(values, width)`.
- **`kpi.ts`**: costs 2025 (`heat = [48, 62, 78, 84, 70, 55, 34, 22, 16, 15, 15, 30] × 6.72 / 529`, `rest = 0.48`, `all = heat + rest`; totals 6,72 and 12,48 €/m²); CO₂ 2026 (`monthly = [1.85, 1.70, 1.55, 1.25, 1.05, 0.95, 0.90, 0.95, 1.10]`, cumulative, total 11,3 t); month names short and long. Tests: the totals, `cumulative.at(-1) === 11.3`, twelve and nine months.
- **`recommendations.ts`**: `filterRecommendations(rows, kind, query)` (kind `all` or one kind; query trimmed, lower-case, substring of the name) and `countByKind(rows)`. Tests: "Vertrag kündigen" gives 3, "garten" gives Gartenweg 3, both combined, an empty result.
- **`demo/data.ts`**: the preview's data, from `#dash-js` ("Echtes Dashboard", v3): the seven objects `{ id, name, units, radioShare, delta }` (370 units in total), the meter types `{ label, short, icon }` (Heizkostenverteiler HKV, Warmwasserzähler WWZ, Kaltwasserzähler KWZ, Wärmemengenzähler WMZ), `BASE` (2026) and `PREV` (2025) monthly series for kalt, warm, heiz, hk (and strom, unused by any tile: leave it out), the forecast's actual / forecast / low / high values, the three periods (`ytd` "01. Jan. – 04. Okt." months 0–10 of 2026, `q3` "01. Jul. – 30. Sep.", `y25` "01. Jan. – 31. Dez. 2025", with their menu names "Dieses Jahr", "Letztes Quartal", "Vorjahr"), the documents (seven, with category, object, date, detail), the functions of the Abrechnung view (Betriebskosten, uVI hinzufügen, Heizkostenabrechnung, Rauchmelder hinzufügen, Feuerlöscher hinzufügen) with the cost types and amounts, the rooms and locations, the per-floor labels, the account menu entries, every note text. The meters are generated as in the design (up to eight units per object, two HKV + WWZ + KWZ per unit, one WMZ per object, ids like `HKV-4400-01`) with `mulberry32` seeded by the design's seeds instead of `rnd()`.
- **`demo/model.ts`**: given the state (`scope`, `period`, `granularity`, `previousYear` per tile) the functions the views draw from: `series(key, state, previous?)` (period slice × scope factor), `expanded(…)`, `typeCounts(scope)` (all objects: 740 HKV, 370 WWZ, 370 KWZ, 7 WMZ), `co2(scope, period)` (11,3 / 2,4 / 13,9 t × scope share), `perObjectRows(scope, period)` (top five objects by units, or five floors of the chosen object), `tileSummary(key, state)` (sum, mean, change to the previous year, for the enlarged chart), `metersFor(type, scope, query)`, `documentsFor(category, scope)`, `pointLabel(i, labels, state)` ("Mär 2026", "KW 12", "Mär, Tag 3"), and `describeChart(key, state)` for the charts' text summaries (phase 3A.8). Tests: totals and counts above, period lengths (10, 3, 12 months), expand lengths (×4, ×7), a scope reduces the counts to that object, the meter ids are unique, `describeChart` names the range and the min/max.

## 1.5 Shared pieces

- **`sections/LogoStrip.svelte`**: an optional `strong?: string`, rendered after `text` in `<b>` (the design's "Im Einsatz bei **Hausverwaltungen in ganz Deutschland**"). Without it, it renders as today.
- **`sections/CtaCard.svelte`**: an optional `visual?: Snippet`, rendered after the action, full width at the bottom of the card (the design's `.cta-vis`). Without it, it renders as today; `/funktionen`, `/mieterportal`, `/karriere` and `/hilfe` don't change.
- **`attachments/countUp.ts`**: an optional `format?: (n: number) => string` (default today's `String(Math.round(n))`), so the hero chip can count to "18.420 €" and the CO₂ card to "11,3". Existing callers don't change.
- `loopInView`, `inView`, `reveal`, `Segmented`, `confetti.ts` (`burst`), `clickOutside` and `TrustSeals` are used as they are.

## 1.6 Icons

The design's inline stroke SVGs (the preview's `IC` set: HKV, radiator, tap, hot tap, alert, check, search, building, file, file-plus, euro, smoke, extinguisher, meter, plus, download, link, arrow, bolt, user; the page's `ICON` set: drop, flame, calendar, users, signal, chart, tool; the chip, pill, bento, hand-over and recommendation icons; the Heidi mark in the preview's top bar) become `StrokeIcon` paths in `pages/dashboard/icons.ts`, drawn by `components/Icon.svelte`. Check the shared icons first (`$lib/landing/components/icons/`, `/funktionen`'s and `/mieterportal`'s `icons.ts`): an icon that already exists is imported, not copied. The Heidi mark comes from the landing header's logo.

Update `CLAUDE.md` once built: the `/dashboard` bullet under "Current state" (from "planned" to "built"), the layout tree (`pages/dashboard/`), and `(landing-page)`'s page list.
