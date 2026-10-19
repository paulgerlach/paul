# Phase 1: Route, links, content and the files

## 1.1 Route and links

In one commit:

- `ROUTE_MUSTER_KUENDIGUNG = "/muster-kuendigung"` in `$lib/routes.ts`, after `ROUTE_PRESSE`.
- The landing footer's "Muster-Kündigung" (`$lib/landing/footerLinks.ts`, group "Ressourcen") gets `href: ROUTE_MUSTER_KUENDIGUNG`.
- **Other links to the page** (README, Links), each a `href` on an entry that waits for it, and their tests turned round (the link is there and resolves):
  - `/fristenrechner` `portfolio.ctas[1]` ("Muster-Kündigung"; its comment `4WYU5…`). `Portfolio.svelte` picks each CTA's look by its place in the design (`bk` for the first, `ghost` for the second), not by its place among the shown ones, so the Muster-Kündigung stays the light button while "Zum Portfolio-Checker" is hidden. `content.test.ts` and `e2e/fristenrechner.e2e.ts`.
  - `/weg-verwaltung` `audience[1].cta` ("Zur Muster-Kündigung"). `e2e/weg-verwaltung.e2e.ts`.
  - `/wohnungsunternehmen` and `/asset-manager` `pain.links[0]` ("Muster-Kündigung herunterladen", icon `doc`): the `.sg-links` row renders with this one link. Both `content.ts` (the shared texts agree, `asset-manager/content.test.ts`) and both e2e tests.
  - `/hilfe` the answer `kuendigung`'s `more` ("Muster-Kündigung").
- `src/routes/(landing-page)/muster-kuendigung/+page.server.ts`, as `/fristenrechner`'s:

```ts
seo: {
	// Drafts for the content owner (plan §4.4).
	title: "Muster-Kündigung Messdienst: Vorlage als Word und PDF | Heidi Systems",
	description:
		"Kostenlos und ohne Anmeldung: Erstellen Sie die Kündigung für Ihren bisherigen Messdienstleister in zwei Minuten, für mehrere Liegenschaften, als Word-Datei oder PDF. Ihre Eingaben bleiben in Ihrem Browser.",
	ogTitle: "Messdienst kündigen. In zwei Minuten.",
	noindex: true,
	keepCanonical: true,
},
landing: DEFAULT_CHROME,
now: Date.now(), // the letter's date (DeadlineClock)
finalForm: await emptySwitchForm("final"),
```

  and `handleSwitchSignup(event, { source: "muster-kuendigung", page: ROUTE_MUSTER_KUENDIGUNG })`. No `cache-control`.
- Sitemap: no entry until the cutover (gate §4.4).

## 1.2 Content module

`$lib/landing/pages/muster-kuendigung/content.ts`, word for word from the design:

- `GENERATOR_ID = "vorlage"`.
- `hero`: pill "Muster-Kündigung · kostenlos", H1 "Messdienst kündigen." + accent "In zwei Minuten.", lead "Füllen Sie ein paar Felder aus, und Sie bekommen eine fertige Kündigung für Ihren bisherigen Messdienstleister. Als Word-Datei oder PDF, zum Unterschreiben und Versenden.", CTAs "Kündigung erstellen" → `#vorlage` and "Heidi kündigt für Sie" → `ROUTE_MESSDIENSTWECHSEL`, ticks "Word und PDF", "Mehrere Liegenschaften", "Ohne Anmeldung", the sheet's title "Kündigung des Messdienstvertrags", the badges "DOCX" and "PDF".
- `generator`: pill "Vorlage ausfüllen", H2 "Ihre Kündigung." + muted "Live in der Vorschau.", four fieldsets with their legends ("Absender", "Bisheriger Messdienst", "Liegenschaften und Termin", "Was soll noch rein?") and fields `{ key, label, placeholder, optional?, hint?, multiline?, half? }` ("Hausverwaltung oder Eigentümer" / "Muster Hausverwaltung GmbH", "Straße und Hausnummer" / "Beispielstraße 1", "PLZ und Ort" / "10115 Berlin", "Ansprechpartner" / "Vor- und Nachname", "Funktion" optional / "Geschäftsführung"; "Name des Messdienstleisters" / "Name des Unternehmens", "Anschrift" / "Straße, PLZ Ort", "Vertrags- oder Kundennummer" optional / "z. B. 12345678"; "Liegenschaften" hint "eine pro Zeile" / "Lindenallee 12, 10115 Berlin"), the switch (label "Kündigungstermin", "Zum nächstmöglichen Zeitpunkt" / "Zu einem Datum"), the date label "Kündigen zum", the label "optional", five clauses `{ key, title, text, checked }` ("Vertragsende bestätigen lassen" ✓, "Ablesung zum Vertragsende" ✓, "Geräte klären" ✓, "Im Auftrag der Eigentümer", "Datenlöschung"), the buttons "Word herunterladen", "PDF", "Text kopieren", "Wird erstellt …", "Kopiert", the messages ("Download gestartet: ", the download error, "Kopieren nicht möglich. Markieren Sie den Text in der Vorschau."), the preview's label "Vorschau der Kündigung" (ours), the signature label "Unterschrift", the disclaimer "Vorlage ohne Gewähr, keine Rechtsberatung. Prüfen Sie Laufzeit, Kündigungsfrist und Form in Ihrem Vertrag."
- `letterText`: the letter's sentences and placeholders, word for word from `build()` (the subject "Kündigung des Messdienstvertrags", " · Vertrags-/Kundennr. ", "Liegenschaft" / "Liegenschaften", the salutation, the termination sentence with its two endings and "fristgerecht zum nächstmöglichen Zeitpunkt" / "zum ", the five clauses' sentences, "Mit freundlichen Grüßen", the placeholders "Name der Verwaltung", "Straße, Hausnummer", "PLZ Ort", "Name des Messdienstleisters", "Anschrift", "Ort", "Adresse der Liegenschaft", "Datum", "Vor- und Nachname").
- `checklist`: pill "Vor dem Versand", H2 "Vier Dinge, die Sie prüfen sollten." + muted "Bevor Sie unterschreiben.", four items `{ title, text }` ("Laufzeit und Frist", "Mehrere Verträge?", "Form und Versand", "Vollmacht bei WEG"), the count "{n} von {total} geprüft", the done text "Alles geprüft. Bereit zum Versand."
- `takeover`: pill "Noch einfacher", H2 "Oder Heidi kündigt für Sie.", text "Eine Unterschrift auf der Vollmacht genügt. …", CTAs "Demo buchen" → `DEMO_HREF` and "Vertragsenden prüfen" (no `href`: hidden), three steps `{ title, text }`.
- `faq`: title "Häufige Fragen zur Kündigung", four items (plain text answers).
- `closing`: H2 "Lieber gar nicht selbst kündigen?", text "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands." (the same as `/presse`'s), submit label "Demo buchen".

`content.test.ts`: the H1; the field keys unique and the ones `letter.ts` reads; three clauses on by default; four checklist items; every `href` a route or an anchor; the takeover's held-back CTA has no `href`; no empty or untrimmed text; the closing text equal to `/presse`'s; the FAQ's four questions.

## 1.3 Pure logic

- **`letter.ts`**: `type Segment = { text: string; placeholder?: true }`, `type Paragraph = { kind: "ab" | "to" | "dt" | "bt" | "p" | "sg"; lines: Segment[][] }`, `type LetterInput = { fields: Record<FieldKey, string>; clauses: Record<ClauseKey, boolean>; term: "next" | "date"; today: string }`. `buildLetter(input)` (the design's `build()`, field values trimmed, the properties split by lines, the PLZ stripped from the date's place, the clauses in the design's order `vollmacht`, `ende`, `ablesung`, `geraete`, `daten`), `plainText(paragraphs)` (lines by `\n`, paragraphs by a blank line, placeholders in brackets), `fileName(provider, ext)`, `isoToGerman("2027-01-31")` → "31.01.2027", `germanDay(ms)` (Europe/Berlin, `berlinDate` from `deadline.ts`). `letter.test.ts`: the empty letter (every placeholder), a full one, one and several properties ("Liegenschaft" / "Liegenschaften", "die oben genannte Liegenschaft" / "die oben genannten Liegenschaften"), both terms with and without a date, each clause, the contract number in the subject, the signature lines, the file names, the plain text.
- **`docx.ts`**: `documentXml(paragraphs)` (the design's runs, byte for byte), `zipStore(files, date)` (local headers, the central directory, the end record; CRC-32 from a table), `makeDocx(paragraphs, date)` → `Uint8Array`. `docx.test.ts`: the XML for a known letter, XML escaping and dropped control characters, the ZIP read back (signatures, offsets, sizes, each entry's CRC against Node's `zlib.crc32`).
- **`pdf.ts`**: `splitText(text, width, font)` (jsPDF's `splitTextToSize`: words by spaces, a word wider than the line broken by characters), `makePdf(paragraphs)` → `Uint8Array` (objects, uncompressed content streams, `/F1` Helvetica and `/F2` Helvetica-Bold with `/WinAnsiEncoding`, the xref table with exact byte offsets, the trailer). `pdf.test.ts`: the header and `%%EOF`, every xref offset pointing at its `n 0 obj`, one page for a short letter and two for one with 60 properties, the date right-aligned (its `Td` x), umlauts as WinAnsi bytes, `(`, `)` and `\` escaped, line breaking against known widths.
- **`helvetica.ts`**: the widths (1/1000 em) of Helvetica and Helvetica-Bold for the WinAnsi codes 32–255 and the map from Unicode to WinAnsi for 128–159; the values are the fonts' AFM metrics (as in jsPDF and pdf.js), checked against the system Helvetica.

## 1.4 Images and files

None new. The closing card's video isn't used (Key decisions); the floating CTA's avatars are the shared ones.
