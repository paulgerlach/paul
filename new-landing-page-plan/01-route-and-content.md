# Phase 1: Route, links, content and the form

## 1.1 Route and links

In one commit:

- `ROUTE_NACHFOLGE = "/nachfolge"` in `$lib/routes.ts`, after `ROUTE_VERBAENDE`.
- The landing footer's "Nachfolge" (`$lib/landing/footerLinks.ts`, group "Partner") gets `href: ROUTE_NACHFOLGE`. "Partnerschaften" stays plain text.
- `/neuigkeiten`'s story "Nachfolge: Messdienstanbieter finden mit Heidi einen seriösen Nachfolger" gets `more: { text: "Mehr erfahren", href: ROUTE_NACHFOLGE }` (the design's link text); its `content.test.ts` ("has the design's link texts") and `e2e/neuigkeiten.e2e.ts` ("stories and rows link only where a page exists") pin it.
- `src/routes/(landing-page)/nachfolge/+page.server.ts`, as `/softwarepartner`'s:

```ts
seo: {
	// Drafts for the content owner (plan §4.4).
	title: "Nachfolge für Messdienstanbieter: Ihr Messdienst in guten Händen | Heidi Systems",
	description:
		"Sie führen einen Messdienst und suchen eine Nachfolge? Heidi Systems führt Kunden, Geräte und Verträge verlässlich weiter. Vertraulich, persönlich und mit Respekt vor dem, was Sie aufgebaut haben.",
	ogTitle: "Nachfolge für Messdienstanbieter mit Heidi",
	noindex: true,
	keepCanonical: true,
},
// No signup form here: the nav CTA goes to /messdienstwechsel's.
landing: { ...DEFAULT_CHROME, ctaHref: ROUTE_MESSDIENSTWECHSEL },
faq: faq.items,
figures: figures(Date.now()),
successionForm: await emptySuccessionForm(),
```

  and the default action `handleSuccessionInquiry(event, { page: ROUTE_NACHFOLGE })`. No `cache-control`.
- Sitemap: no entry until the cutover (gate §4.4).

## 1.2 Content module

`$lib/landing/pages/nachfolge/content.ts`, word for word from the design, in the shapes of `uv/types.ts` and `partner/types.ts`:

- `APPLY_ID = "kontakt"` (the design's id); `KONTAKT_HREF` for every CTA that leads to the form (open question 1).
- `hero`: `srTitle` "Nachfolge für Messdienstanbieter mit Heidi", `word` "Nachfolge", `wordSize` "clamp(34px, 8.6vw, 130px)", the lead "Sie führen einen Messdienst und suchen eine Nachfolge? Heidi führt Kunden, Geräte und Verträge verlässlich weiter.", `primary` "Kontakt aufnehmen" → `#kontakt`, `secondary` "Mehr erfahren" → `#inhalt`.
- `list` (the hero's app window, `ListMock`): label "Beispiel: Heidi Dashboard", brand "Heidi", nav `users` "Übergabe", `doc` "Dokumente", `users` "Kunden", foot "Heidi Dashboard", head "Heidi Nachfolge", tag "Beispieldaten", title "Ihr Messdienst", sub "Übergabe · Beispiel"; entries `users` "Kundenbeziehungen" / "Persönlich übergeben" ("In Vorbereitung" → "Übergeben"), `meter` "Geräte und Zähler" / "Bestand übernommen" ("Wird geprüft" → "Übernommen"), `doc` "Laufende Verträge" / "Laufzeiten geprüft" ("Wird geprüft" → "Geklärt"), `check` "Abrechnungen" / "Nahtlos weitergeführt" ("Wird erstellt" → "Weitergeführt").
- `statement`: label "Worum es geht", the text ("Ihre Kunden verlassen sich seit Jahren auf Sie. … Diskret, persönlich und mit Respekt vor dem, was Sie aufgebaut haben.").
- `rows`: label "So arbeitet Heidi", primary "Gespräch anfragen" → `#kontakt`, secondary "Häufige Fragen" → `#faq`; four `Row<TileKind>` (`TileKind = "phone" | "doc" | "calendar" | "bill"`): "Vertraulich" ("Erst sprechen." / "Dann entscheiden.", ink, `phone`), "Übernahme" ("Kunden, Geräte" / "und Verträge.", stone, `doc`), "Zukunft" ("Fernablesbar" / "bis 2027.", mint, `calendar`), "Gemeinsam" ("Ihr Modell." / "Ihr Zeitpunkt.", mint, `bill`), each with its two paragraphs.
- `phone` (`PhoneTile`): time "9:41", app "Heidi", the notification "Erstgespräch vereinbart" / "Vertraulich · unverbindlich", label "Ihr Ansprechpartner", value "Persönlich", comparisons ["Ein fester Kontakt von Anfang an"].
- `doc` (`DocTile`): "Übergabe Ihres Messdienstes", "Beispiel", the check rows "Kundenbeziehungen", "Geräte und Zählerbestand", "Laufende Verträge", "Offene Abrechnungen", the result "Nahtlos weitergeführt".
- `calendar` (`CalendarTile`): the cells "Liegensch. 1" … "Liegensch. 9", `current` 6, `done` "umgerüstet", `doing` "in Planung", `open` "offen", `noteDone` "{x} umgerüstet", `noteDoing` "{x} in Planung".
- `bill` (`BillTile`): "Ohne Nachfolge" / "Mit Heidi"; rows `cut` "Kunden suchen selbst neuen Anbieter" "unsicher", `cut` "Umrüstung bis 2027 offen" "offen", `ok` "Kunden persönlich übergeben", `ok` "Abrechnungen laufen weiter"; sum "Ihr Lebenswerk" "offen" → "in guten Händen".
- `rotator`: label "Was Heidi übernimmt", lead "Heidi übernimmt:", the four phrases ("Kundenbeziehungen", "Geräte und Zähler", "Laufende Verträge", "Abrechnungen"), 2300 ms.
- `numbers`: "Nachfolge mit Heidi"; first "1:1" "persönlicher Ansprechpartner für den ganzen Prozess" (compact); then "15.000+" "Geräte hat Heidi bereits installiert", "DE" "Alle Daten auf Servern in Deutschland", the deadline figure, "Diskret" "Vertraulich bis zu Ihrer Entscheidung" (all compact). `DEADLINE` (the design's "1.1.2027" "Ab dann müssen alle Zähler fernablesbar sein") and `figures(now)`: the figures after the photo, the deadline figure replaced by `DEADLINE_FIGURE.expired` once `isExpired(now)`.
- `audience`: label "Ihr Wechsel"; "Sie sind Messdienstanbieter?" (text, "Gespräch anfragen" → `#kontakt`, image `technician`), "Mehr Partnerschaften?" (text, "Zu den Partnerschaften" without `href`, image `consultation`).
- `quotes`: h2 "Verlässlicher Messdienst." / "Unsere Kunden sagen es selbst.", keys `werne`, `vitolus`, `gerhard`.
- `picture`: label "Heidi", caption "Ihr Lebenswerk." / "In guten Händen.".
- `apply` (`ApplyContent` + the form's texts): pill "Für Messdienstanbieter", h2 "Lassen Sie uns" / "vertraulich sprechen.", the text "Erzählen Sie uns kurz von Ihrem Betrieb. Ihr persönlicher Ansprechpartner meldet sich bei Ihnen.", three steps ("Formular senden" / "Vertraulich, ohne Verpflichtung.", "Erstgespräch" / "Wir lernen uns und Ihren Betrieb kennen.", "Modell finden" / "Übernahme, Zeitplan und Übergang."); the form's labels ("Unternehmen", "Ihr Name", "E-Mail", "Telefon", "Betreute Liegenschaften" and "Gewünschter Zeitraum" with "Bitte wählen", "Nachricht" + "(optional)", the consent "Ich bin einverstanden, dass Heidi Systems meine Angaben zur Kontaktaufnahme verarbeitet."), the button "Gespräch anfragen", "Wird gesendet …", `missing` "Bitte füllen Sie die markierten Felder aus.", `success(name)` "Danke, <name>! Wir melden uns bei Ihnen.", `sendError` "Das hat gerade nicht geklappt. Bitte versuchen Sie es noch einmal oder rufen Sie uns an:" + `PHONE` (the same texts as `/softwarepartner`'s). The options' texts live in the schema module (1.3).
- `faq`: title "Häufige Fragen", five items (plain-text answers; FAQ 5 with `more: { text: "Mehr zu Sicherheit", href: ROUTE_SICHERHEIT }`).
- `closing`: h2 "Ihr Lebenswerk. In guten Händen.", text "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.", the button "Demo buchen" / "Mit Ihrem Ansprechpartner" → `#kontakt`.

`content.test.ts`: the H1's two texts; four list entries with known icons; four rows with distinct tags and tiles, every row with two paragraphs; the phone's one chip; the doc's four rows; nine grid cells, `current` in range; the bill's rows; four rotator phrases equal the list's entry titles (the design repeats them); five figures before the deadline and the expired one after it; two audience cards, the second without a target; the quote keys exist in the shared testimonials; five FAQ items; three steps; every `href` a route or an anchor on the page (`#kontakt`, `#inhalt`, `#faq`); the form texts equal `/softwarepartner`'s where the designs agree; no empty, doubled-space or untrimmed text.

## 1.3 The form: schema and action

`$lib/forms/successionInquiry.ts` (shared client/server, German messages in the schema):

- `PROPERTY_COUNTS = ["bis 100", "100 bis 500", "500 bis 2.000", "über 2.000"]`, `TIMEFRAMES = ["so bald wie möglich", "in 6 bis 12 Monaten", "in 1 bis 2 Jahren", "noch offen"]` (the design's options, word for word).
- `successionInquirySchema`: `company` (2–200), `name` (2–100), `email` (≤ 254, valid), `phone` ("" or 6–40 with digits, spaces and `+ ( ) / -`, at least six digits), `properties` ("" or one of `PROPERTY_COUNTS`), `timeframe` ("" or one of `TIMEFRAMES`), `message` (≤ 2000, optional), `consent` (boolean, must be true), `website` (honeypot), `_t` (render time).

`$lib/server/successionInquiry.ts`, modelled on `$lib/server/softwarePartnerInquiry.ts`:

- `emptySuccessionForm()` stamps `_t`.
- `handleSuccessionInquiry(event, { page })`: honeypot and timing (`spamTrapReason`) → `fail(400)` on invalid fields → gibberish (name, message) → `checkIPRateLimit("nachfolge:<ip>", KITCHEN_SINK ? 50 : 3, 600)` → `sendWebhookEventOrThrow("successioninquiry", email, { company, name, phone, properties, timeframe, message, page })` (an empty phone, choice or message left out); a trap gets the success message and sends nothing; a failed send returns the error message with status 502 and keeps the values. Log lines carry the business size only.
- `webhooks.ts`: the new `EventType` `"successioninquiry"` with its payload in the comment.

Tests: `successionInquiry.test.ts` (forms: a valid inquiry, trimming, every required field's message, the optional phone and its pattern, the optional selects and unknown options, consent false) and `$lib/server/successionInquiry.test.ts` (the payload without the spam fields, empty optional fields left out, honeypot and timing answered with success, invalid → 400, the 502 on a failed send, the rate limit), with the webhook mocked as `/softwarepartner`'s.

## 1.4 Images

- New: `$lib/assets/landing/nachfolge/technician.webp`, the design's file as it is (1000×936 WebP, 74 KB), imported `?enhanced`.
- Reused: `vorgehen/building-wide.webp`, `selbstabrechnung/beratung.webp`, `vorgehen/kitchen-meters.webp`, `vorgehen/consultation.webp`, `mieterportal/facade-white.webp`; the video button's `region/demo-poster.jpg` (`?url`) and `/landing/region-demo.webm` / `.mp4` (README).
