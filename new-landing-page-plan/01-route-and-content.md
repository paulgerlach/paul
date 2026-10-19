# Phase 1: Route, links, content and the logic

## 1.1 Route and links

In one commit:

- `ROUTE_HEIZKOSTENABRECHNUNG_PRUEFEN = "/heizkostenabrechnung-pruefen"` in `$lib/routes.ts`, after `ROUTE_PORTFOLIO_CHECKER`.
- The landing footer's "Heizkostenabrechnungs-Checker" (`$lib/landing/footerLinks.ts`, group "Ressourcen") gets `href: ROUTE_HEIZKOSTENABRECHNUNG_PRUEFEN`.
- The three waiting links (README) get the route, with their content tests and e2e assertions updated: `/hkvo-leitfaden`'s `penalties.cta.link.href` (the line renders once it has an `href`; check it in the design's look), `/selbstabrechnung`'s `CHECKER_HREF` (its duties block's CTA row renders once set; check it against the `/selbstabrechnung` design's row) and `/hilfe`'s `abrechnung-pruefen` (`more.href`).
- `src/routes/(landing-page)/heizkostenabrechnung-pruefen/+page.server.ts`, as `/energieausweis`'s:

```ts
seo: {
	// Drafts for the content owner (plan §4.4).
	title: "Heizkostenabrechnung prüfen: kostenloser Checker für Mieter | Heidi Systems",
	description:
		"Laden Sie Ihre Heizkostenabrechnung hoch oder geben Sie die Werte ein: Der Checker prüft sie gegen Heizkostenverordnung und BGB und zeigt, ob Sie kürzen dürfen oder eine Nachzahlung entfällt. Mit Musterschreiben.",
	ogTitle: "Heizkostenabrechnung jetzt überprüfen.",
	noindex: true,
	keepCanonical: true,
},
landing: DEFAULT_CHROME,
now: Date.now(),
finalForm: await emptySwitchForm("final"),
```

  and `handleSwitchSignup(event, { source: "heizkostenabrechnung-pruefen", page: ROUTE_HEIZKOSTENABRECHNUNG_PRUEFEN })`. `now` is the page's single time source (the rules' "today", the example's receipt date). No `cache-control`.
- Sitemap: no entry until the cutover (gate §4.4).

## 1.2 Content module

`$lib/landing/pages/heizkostenabrechnung-pruefen/content.ts`, word for word from the design:

- `CHECKER_ID = "checker"`, `LETTER_ID = "schreiben"`, `SCAN_ID = "pruefung"`, `NUMBERS_ID = "zahlen"`, `ERRORS_ID = "fehler"` (the design's ids, `checker` ours for its `#start`), `PAY_HREF: string | undefined = undefined`.
- `hero`: pill "Für Mieter · kostenlos", H1 "Heizkosten­abrechnung" (with the soft hyphen) + accent "jetzt überprüfen.", the lead, ticks "Foto oder PDF genügt", "Ergebnis in etwa einer Minute", "Musterschreiben inklusive", the note ("Laut Verbraucherzentralen waren rund " + "2 von 3" + " geprüften Heizkostenabrechnungen fehlerhaft oder klärungsbedürftig." and "Zu den Zahlen ↓").
- `card`: the tabs ("Eingabe", "Hochladen", "Werte eingeben"); the drop zone ("Abrechnung hierher ziehen" / "Weitere Seite hinzufügen", "oder " + "Datei auswählen" + " · PDF, JPG oder PNG", `accept`), "Entfernen", the wrong-type message; the flow ("Schritt <n> von 5", the date question and its hint, "Weiß ich nicht", "Weiter →", the two questions, "Alles bereit", the summary labels "Abrechnung", "Erhalten am", "nicht angegeben", "Funkablesung", "Monatliche Verbrauchsinfo", "Ändern", "Abrechnung prüfen", "← Zurück"); the privacy note; "Beispiel ansehen"; the fallback note ("Die automatische Erkennung ist in dieser Ansicht nicht verfügbar. …"); the values pane's labels and placeholders, "Nachzahlung" / "Guthaben", the share options ("Weiß nicht", "70 %", "60 %", "50 %", "unter 50 %", "nur nach Fläche"), the three questions in their short and long forms, "Ja" / "Nein" / "Weiß nicht", "Ergebnis anzeigen"; the result pane's "bis zu", "Musterschreiben erstellen", "Werte ändern", "Neue Abrechnung prüfen", "Beispiel"; the teaser ("mit Begründung, Paragraf und Betrag je Punkt", "Gründe und Details ansehen").
- `paywall`: "Ihre Auswertung", "Heizkostenabrechnung geprüft", "Gefundene Punkte", "<n> Punkte", "Ihre Heizkostenabrechnung", "Geprüfte Angaben", "Ihre hochgeladene Abrechnung" (the image's alt), "Vollständige Auswertung freischalten", its text, the four inclusions, "39,99 €", "einmalig, inkl. MwSt.", "Jetzt für 39,99 € freischalten", "Zahlung wird gerade eingerichtet", "Beispiel kostenlos freischalten", the wait note, "Sichere Zahlung · Ihre Daten bleiben bei Ihnen", "Schließen".
- `letter`: pill "Musterschreiben", H2 "Ihre Einwendung. " + muted "Zum Anpassen und Versenden.", the lead, the note, "Musterschreiben" (the textarea's label), "Text kopieren", "Kopiert", "Text markiert, bitte mit Strg+C kopieren".
- `scan`: pill "So prüft der Checker", H2 "Abrechnung scannen. " + muted "Fehler sehen.", the lead, the group's label, the sample bill (sender line, name, address, "Heizkostenabrechnung", "Nutzernummer 0008", the rows, the two tables, the sum), "Beispieldaten", "Prüfergebnis", "Abrechnung wird gelesen …", "gefunden", "<n> Auffälligkeiten in dieser Abrechnung", the four findings `{ key, tone, title, text, tag }`, the footer and "Eigene Abrechnung prüfen".
- `numbers`: pill "Wie oft Abrechnungen falsch sind", H2 "Fehler sind die Regel. " + muted "Nicht die Ausnahme.", the switch's label "Studie", the two studies `{ key, label, value, text, source }` ("Quelle: " before the source), "von 100", four stats `{ value, count?, unit?, text, source, dark? }`.
- `errors`: pill "Die häufigsten Fehler", H2 "Elf Fehler, die Sie " + muted "bares Geld kosten.", the filter's label "Filter" and options, the eleven `{ kind: "k" | "f" | "r", title, text, effect, law }`.
- `deadlines`: pill "Ihre Fristen", H2 "Zweimal zwölf Monate. " + muted "Die wichtigsten Daten.", three points `{ title, text }`.
- `managers`: pill "Für Verwaltungen und Vermieter", H2, text, "Heizkostenabrechnung mit Heidi" → `ROUTE_FUNKTIONEN`, "Demo buchen" → `DEMO_HREF`.
- `faq`: title "Häufige Fragen", five items (plain text answers).
- `closing`: H2 "Ihre Abrechnung in einer Minute geprüft.", submit label "Demo buchen".

The rules' own texts (each point's title, text, reference, the letter sentence) live in `rules.ts` next to their conditions, as the design keeps them; the content test reads them through the exported `RULE_TEXTS`.

`content.test.ts`: the H1; two tabs, three ticks; the five share options; the sample bill's four marked rows match the four findings by key; two studies (67, 80), four stats (the second and fourth without a count); eleven errors (three `k`, two `f`, six `r`), three timeline points, five FAQ items; every `href` a route or an anchor; no empty, doubled-space or untrimmed text (the split headings' first parts excepted).

## 1.3 Pure logic

`rules.ts`, on calendar days (`Day` from `fristenrechner/fristen.ts`):

- `parseAmount(text)` (the design's `num()`: "1.240,00" → 1240, "1.240" → 1240, "310" → 310, "12,5" → 12.5, "" → NaN), `formatNumber(n, digits)` (`de-DE`), `formatEuro(n)` (no decimals for whole numbers, else two, + " €").
- `type Answer = "ja" | "nein" | "?"`, `type Values = { heating, result, sign (1 | -1), from, to, received (ISO strings or ""), share ("" | "70" | "60" | "50" | "40" | "0"), co2, remote, uvi (Answer), found: Finding[] }`.
- `evaluate(values, today)` → `{ points: Point[] (sorted), sum, share, cut, lateSum, hasHeating, from, to, received, expired }` with `Point = { key, status: "fail" | "warn" | "info" | "ok", title, text, law, amount?, cutLabel?, letter? }` (the design's `rules()` and its sort).
- `resultHead(result)` → `{ label, value, unit ("€" | "%"), upTo, zero, sub }` (the design's `compute()`).
- `teaser(points)` ("<f> Fehler und <n−f> weitere Punkte" / "<n> geprüfte Punkte"), `paywallRows(values, points)` (the seven rows with their red flags by key), `letterText(result)` (the design's text), `flowSummary(...)`.
- `exampleValues(today)`: the design's example (1.240,00 €, 310,00 € back payment, 01.01.–31.12.2024, 70 %, CO₂ "nein", Funk "ja", uVI "nein", the finding "Verbrauch geschätzt"), received on the earlier of 20.01.2026 and 40 days before today.

`rules.test.ts`: `parseAmount`, `formatEuro`; `evaluate` for the example on 19.10.2026 (received 20.01.2026, after the 31.12.2025 deadline: the 310 € back payment drops; CO₂ and uVI fail with 37,20 € each, the share ok, objections until 20.01.2027; the sum 310 € as the higher amount, "Die Beträge überschneiden sich, deshalb zählt der höhere." in the head; the order fail → warn → info → ok), a bill in time (the sum is the cuts), a share under 50 % without heating costs (the head in %: "Kürzung möglich", 15), a period of 15 months, a period ending after 1.1.2027 without remote meters, an expired objection deadline, nothing filled ("Zustellfrist nicht prüfbar", "Verteilung nach Verbrauch unklar"); `teaser`; `paywallRows`' red flags; `letterText` (the points numbered, the sum, the receipt date); `exampleValues` before and after 1.3.2026.

## 1.4 Images and files

None new. The floating CTA's avatars are the shared ones.
