# Phase 1: Route, links, content and the logic

## 1.1 Route and links

In one commit:

- `ROUTE_PORTFOLIO_CHECKER = "/portfolio-checker"` in `$lib/routes.ts`, after `ROUTE_ENERGIEAUSWEIS`.
- The landing footer's "Portfolio-Checker" (`$lib/landing/footerLinks.ts`, group "Ressourcen") gets `href: ROUTE_PORTFOLIO_CHECKER`.
- The six waiting links (README) get the route, with their content tests and e2e assertions updated: `/fristenrechner`'s `portfolio.ctas[0]` ("Zum Portfolio-Checker"), `/muster-kuendigung`'s `takeover.check` ("Vertragsenden prüfen"), the `/neuigkeiten` story (`more: { text: "Bestand prüfen", href }`, the design's link text), `/hilfe`'s `vertragsende` (`more.href`), and `secondary` ("Portfolio kostenlos prüfen") on `/wohnungsunternehmen` and `/asset-manager` (the `sg` template's `LargeStock` renders it once it has an `href`; check that it does, in the design's look).
- `src/routes/(landing-page)/portfolio-checker/+page.server.ts`, as `/muster-kuendigung`'s:

```ts
seo: {
	// Drafts for the content owner (plan §4.4).
	title: "Portfolio-Checker: Messdienstverträge prüfen und auswerten | Heidi Systems",
	description:
		"Kostenlos und unverbindlich: Laden Sie Messdienstverträge, Nachträge und Preisblätter hoch. Heidi prüft jedes Dokument, analysiert Laufzeiten und Fristen und zeigt für jede Liegenschaft den nächsten Schritt.",
	ogTitle: "Vertragsunterlagen hochladen. Heidi liest den Rest.",
	noindex: true,
	keepCanonical: true,
},
landing: { ...DEFAULT_CHROME, ctaHref: "#checker" },
now: Date.now(),
finalForm: await emptySwitchForm("final"),
```

  and `handleSwitchSignup(event, { source: "portfolio-checker", page: ROUTE_PORTFOLIO_CHECKER })`. `now` is the page's single time source (the example evaluation's dates). No `cache-control`.
- Sitemap: no entry until the cutover (gate §4.4).

## 1.2 The shared list (moved from `/dashboard`)

- `$lib/landing/data/nextSteps.ts`: `NEXT_STEP_KINDS`, the types (`NextStepKind`, `NextStepFilter`, `NextStep`), `nextSteps` (the labels "Empfehlungen filtern", the filters, "Liegenschaft suchen", the columns, "Wird geprüft", "Bestand wird geprüft …", the done line, the results line, "Beispieldaten", the seven rows, the three explanations: `/dashboard`'s `recommendations` without its head and cards), `filterNextSteps` and `countByKind` (`dashboard/recommendations.ts`, renamed). Its test is `dashboard/recommendations.test.ts`, moved.
- `/dashboard`'s `content.ts` keeps `recommendations` (pill, H2, lead, cards) and takes the rest from `nextSteps`, so its content test and e2e test stay as they are.
- `$lib/landing/sections/NextSteps.svelte` is the `.pl` card of `dashboard/sections/Recommendations.svelte` (02 §2.2), with its inline icons (take, cancel, bill, search, check) instead of `/dashboard`'s `Icon`.

## 1.3 Content module

`$lib/landing/pages/portfolio-checker/content.ts`, word for word from the design:

- `CHECKER_ID = "checker"`, `RESULT_ID = "auswertung"` (ours; the design's `#pc-res-sec`).
- `hero`: pill "Portfolio-Checker", H1 "Vertragsunterlagen hochladen." + accent "Heidi liest den Rest.", lead "Messdienstverträge, Nachträge, Preisblätter oder Gerätemietverträge: Heidi prüft jedes Dokument, analysiert Laufzeiten und Fristen und zieht die wichtigsten Daten heraus. Für jede Liegenschaft, auf einen Blick.", ticks "Alle Vertragsarten", "Geprüft und analysiert", "Kerndaten auf einen Blick", the step line "Hochladen", "Prüfen", "Analysieren", "Extrahieren".
- `tool`: the drop zone's "Vertragsunterlagen hier ablegen", "oder " + "Dateien auswählen" + " · PDF, Scan oder Foto", the input's label (ours, `sr-only`-free: the label wraps the input), `accept` ".pdf,.jpg,.jpeg,.png,.tif,.tiff,.heic,.docx", "Mit Beispielunterlagen testen", the count ("1 Dokument" / "<n> Dokumente"), "Unterlagen prüfen", "Ihre Dateien bleiben in Ihrem Browser.", the status names "Hochgeladen", "Geprüft", "Analysiert", "Extrahiert", "Entfernen", the own files' tags ("Scan oder Foto" / "PDF-Dokument" + "Format geprüft"; "Datei zu groß" / "Format nicht unterstützt"), the file badges "PDF", "IMG", "DOC".
- `exampleFiles`: the five `{ name, kind, size, type, ok, warn? }` (the design's `EX`: "Messdienstvertrag_Lindenallee12.pdf" 842 KB … "Scan_Vertrag_AmMarkt7.jpg" 2,4 MB with "Seite 2 unscharf, Werte geprüft").
- `result`: pill "Auswertung", H2 "Die wichtigsten Daten " + muted "aus Ihren Unterlagen.", the tag "Beispieldaten · fiktive Verträge", the KPI labels ("Dokumente geprüft", "Liegenschaften erkannt", "Nächste Kündigungsfrist", "Handlungsbedarf", "<name> · in <n> Tagen", "Hinweis" / "Hinweise" + " mit hoher Priorität"), the overview's columns "Liegenschaft", "Vertrag", "Empfehlung", "Laufzeit bis ", "Kündigung bis ", its footer "Beispieldaten", "Für Details über die Empfehlung fahren", the own-files panel ("<ok> von <n> Dokumenten sind bereit für die Auswertung.", its text, "Auswertung anfragen" → `DEMO_HREF`, "Beispielauswertung ansehen", "bereit" / "prüfen"), "Als CSV herunterladen", "Mit eigenem Bestand auswerten" → `DEMO_HREF`, the messages "Gespeichert: " and "Der Download ist hier gerade nicht möglich.", the file name "Heidi-Portfolio-Beispiel.csv".
- `documents`: pill "Welche Unterlagen?", H2 "So, wie sie bei Ihnen liegen. " + muted "Auch als Scan.", six `{ icon, title, text }`.
- `how`: pill "So arbeitet der Checker", H2 "Prüfen, analysieren, " + muted "extrahieren.", three steps `{ title, text, chips }` (chips `{ kind: "ok" | "wn" | "plain" | "add", text }` or `{ kind: "kv", label, value }`).
- `fields`: pill "Was herausgelesen wird", H2 "Die Daten, die Sie " + muted "sonst zusammensuchen.", eight `{ icon, title, text }`.
- `nextSteps`: pill "Auswertungen", H2 "Für jede Liegenschaft " + muted "der nächste Schritt.", the lead (the list itself from `data/nextSteps.ts`).
- `decision`: pill "Nach der Auswertung", H2 "Übernehmen oder kündigen? " + muted "Beides geht mit Heidi.", two cards `{ icon, title, text, points, dark? }`.
- `quote`: the label "Kundenstimme", testimonial `werne`, logo `werne`.
- `faq`: title "Häufige Fragen zum Portfolio-Checker", six items (plain text answers).
- `closing`: H2 "Ihre Verträge. Endlich übersichtlich.", submit label "Portfolio prüfen lassen".

`content.test.ts`: the H1; five example files, their kinds and sizes; six documents, three steps (chips per step 3 / 3 / 2), eight fields, two follow-ups (the second dark), six FAQ items; the quote's testimonial exists; every `href` a route or an anchor; no empty, doubled-space or untrimmed text (the split headings' first parts excepted).

## 1.4 Pure logic

`checker.ts`, on calendar days (`Day` from `fristenrechner/fristen.ts`):

- `fileKind(name)` ("img" for jpg/jpeg/png/tif/tiff/heic, "pdf", else "doc"), `isAccepted(name, size)` (the design's `OKX` and under 25 MB), `formatSize(bytes)` ("842 KB", "2,4 MB": the design's `size()`), `fileCount(n)`.
- `lastOfMonth(year, month)`, `noticeDate(end, months)` (the last day of the month `months` before the end's month: the design's `minusMonths`), `rollForward(end, notice, renewal, today)` → `{ end, by, rolled }` (the design's `next()`).
- `exampleEvaluation(today)` → three `Property` `{ key, name, sub, sources, fields: { label, value, tone? }[], hints: { tone: "g" | "y" | "r", text }[], recommendation: { kind: "take" | "cancel", title, text } }` with the design's values and texts, the 1.1.2027 hint by `today` (the design's `T<D(2027,1,1)`).
- `kpis(properties, today, files)` → the counts, the earliest notice date with its property and days, the red hints; `OVERVIEW_FIELDS` (the eight labels the popover shows).
- `toCsv(properties)`: "﻿" + the header row ("Liegenschaft" and the twelve labels) and one row per property, `;`, every value in quotes with `"` doubled, rows joined by `\n`.

`checker.test.ts`: the kinds and the acceptance (".docx" picked but not accepted, 25 MB rejected), the sizes; `noticeDate` (31.12. − 3 → 30.09., − 6 → 30.06., 30.06. − 3 → 31.03.), `rollForward` (not rolled, rolled once, rolled twice); `exampleEvaluation` on 19.10.2026 (Lindenallee: "Kündigung bis 30.09.2027", 346 days; Parkstraße rolled to 31.12.2027 with its "verpasst" hint and the "Nachrüstung bis 31.12.2026" hint; Am Markt: 31.03.2027) and on 15.02.2027 (the "Pflicht seit 01.01.2027" hint; every date a year later, Parkstraße not rolled and without the "verpasst" hint); `kpis` (5, 3, the earliest date and its property, 2 red hints); `toCsv` (BOM, header, quoting).

## 1.5 Images and files

None new. The thumbnails are `/dashboard`'s, the logo the shared Werne logo, the floating CTA's avatars the shared ones.
