# Phase 1: Route, link, content, the form and the logic

## 1.1 Route and link

In one commit:

- `ROUTE_INSTALLATIONSPARTNER = "/installationspartner"` in `$lib/routes.ts`, after `ROUTE_MESSDIENSTANBIETER_VERGLEICH`.
- The landing footer's "Installationspartner" (`$lib/landing/footerLinks.ts`, group "Partner") gets `href: ROUTE_INSTALLATIONSPARTNER`. The other four "Partner" entries stay plain text.
- No other page links this design (README).
- `src/routes/(landing-page)/installationspartner/+page.server.ts`, as `/karriere`'s:

```ts
seo: {
	// Drafts for the content owner (plan §4.4).
	title: "Installationspartner werden: Zähler montieren mit Heidi | Heidi Systems",
	description:
		"Werden Sie zertifizierter Installationspartner von Heidi Systems: Wir schulen Ihr Team auf Funkzähler und das Installationstool, informieren die Mieter und planen die Einsätze in Ihrer Region. Deutschlandweit, ohne Klemmbrett.",
	ogTitle: "Installationspartner von Heidi Systems",
	noindex: true,
	keepCanonical: true,
},
// No signup form here: the nav CTA goes to /messdienstwechsel's (open question 1).
landing: { ...DEFAULT_CHROME, ctaHref: ROUTE_MESSDIENSTWECHSEL },
faq: faq.items,
partnerForm: await emptyPartnerForm(),
```

  and the default action `handlePartnerInquiry(event, { page: ROUTE_INSTALLATIONSPARTNER })`. No `now`: nothing on the page depends on the day. No `cache-control`.
- Sitemap: no entry until the cutover (gate §4.4).

## 1.2 Content module

`$lib/landing/pages/installationspartner/content.ts`, word for word from the design, in the shapes of `uv/types.ts`:

- `APPLY_ID = "bewerben"`; `MANAGER_SIGNUP_HREF = ROUTE_MESSDIENSTWECHSEL + START_HREF` (open question 1).
- `hero`: `srTitle` "Installationspartner von Heidi Systems", `word` "Installationspartner", `wordSize` "clamp(34px, 8.6vw, 130px)", the lead "Geschulte Teams, ein digitaler Zwilling jeder Liegenschaft und eine saubere Übergabe. Deutschlandweit, ohne Klemmbrett.", `primary` "Partner werden" → `#bewerben`, `secondary` "Mehr erfahren" → `#inhalt`.
- `list` (the hero's app window, `ListMock`): label "Beispiel: Heidi Installationstool", brand "Heidi", nav `tool` "Liegenschaft", `doc` "Wohnungen", `users` "Übergabe", foot "Installationstool", head "Heidi Installationstool", tag "Beispieldaten", title "Guten Morgen, Team Nord.", sub "Lindenallee 12 · Beispiel"; entries `home` "WE 01 · EG links" / "Alt- und Neuzähler" ("Offen" → "Fotografiert"), `home` "WE 02 · EG rechts" (same), `bell` "Mieter WE 03" / "Zeitfenster 10:00 bis 11:30" ("Informiert" → "Zu Hause"), `doc` "Übergabeprotokoll" / "Lindenallee 12" ("Wird erstellt" → "Übergeben").
- `statement`: label "Worum es geht", the text ("Eine gute Installation entscheidet sich vor Ort. … Vom alten Zähler bis zur fertigen Übergabe.").
- `KPI` (`notice` 14, `window` "1–2 h" with a non-breaking space), as the other `uv` pages.
- `rows`: label "So arbeitet Heidi", primary "Partner werden" → `#bewerben`, secondary "Häufige Fragen" → `#faq`; five `Row<TileKind>` (`TileKind = "doc" | "twin" | "calendar" | "tracking" | "bill"`): "Zertifiziert" (stone, `doc`), "Digitaler Zwilling" (ink, `twin`), "Dokumentation" (mint, `calendar`), "Mieterinfo" (ink, `tracking`), "Übergabe" (mint, `bill`), each with its two-line title and two paragraphs.
- `doc` (`DocTile`): "Heidi-Zertifizierung", "Installationsbetrieb · Beispiel", the check rows "Schulung Funkzähler", "Schulung Installationstool", "Umgang mit Mietern", "Einsatzgebiet" with the value "Region Nord", the result "Zertifizierter Heidi-Partner".
- `twin` (row 2's phone): time "9:41", app "Heidi"; the first screen: badge "Liegenschaft", "Lindenallee 12", "Mehrfamilienhaus · Beispiel", the facts ("Heizung" "Gaszentralheizung", "Wohneinheiten" "24", "Heute offen" "3"), the button "Wohnungen ansehen"; the second: back "‹ Lindenallee 12", "24 Wohneinheiten", "Gaszentralheizung · 3 offen", four units `{ name, note, state: "ok" | "cur" | "open", badge }` ("WE 01 · EG links" / "Alt- und Neuzähler fotografiert" ✓, "WE 02 · EG rechts" ✓, "WE 03 · 1. OG links" / "Altzähler fotografiert" "1/2" current, "WE 04 · 1. OG rechts" / "Termin 10:00 bis 11:30").
- `calendar` (`CalendarTile`): the cells "WE 01" … "WE 12", `current` 9, `done` "dokumentiert", `doing` "wird erfasst", `open` "offen", `noteDone` "{x} dokumentiert", `noteDoing` "{x} wird erfasst".
- `tracking` (row 4's phone): time, app, the push ("Heidi · jetzt", "Ihr Monteur ist noch ", "2 Wohnungen", " von Ihnen entfernt."), the floors ("EG", "1. OG", "2. OG", "3. OG"), the eight unit labels "WE 01" … "WE 08" (the last is the visitor's, "Ihre WE"), the card's heading "Ihr Monteur ist im Haus" / "Gleich klingelt es", "WE 08 · 3. OG rechts · 10:00 bis 11:30", the steps "Bestätigt", "Im Haus", "Bei Ihnen", "Erledigt", the counts' texts ("Wohnungen vor Ihnen", "Wohnung vor Ihnen", "Ihr Monteur ist bei Ihnen"), the tag "Beispiel".
- `bill` (`BillTile`): "Klemmbrett" / "Heidi-Tool"; rows `cut` "Zählerstände per Hand notieren" "manuell", `cut` "Fotos später zuordnen" "manuell", `ok` "Alt- und Neuzähler pro Wohnung fotografiert", `ok` "Übergabeprotokoll automatisch"; sum "Nacharbeit im Büro" "Stunden" → "keine". `meterPhoto`: "WE 03 · Neuzähler", "Foto aufgenommen", "dem Übergabeprotokoll zugeordnet".
- `rotator`: label "Was Heidi übernimmt", lead "Heidi übernimmt für Ihr Team:", the four phrases ("Mieterinformation", "Zeitfenster von 1 bis 2 Stunden", "Digitaler Zwilling", "Übergabeprotokoll"), 2300 ms.
- `numbers`: "Installation in Zahlen"; first "14" "Tage" "vorher informiert Heidi die Mieter" (counts); rest "1–2 h" (compact) "Zeitfenster für die Mieter am Montagetag", "92" "%" "der Installationen gelingen beim ersten Termin" (counts), "2" "Fotos pro Zähler: alt mit Endstand, neu nach Montage" (counts), "0" "Klemmbretter".
- `audience`: label "Ihr Wechsel"; "Sie sind Installationsbetrieb?" (text, "Jetzt Partner werden" → `#bewerben`, image `installer`), "Sie sind Verwaltung?" (text, "So gehen wir vor" → `ROUTE_VORGEHEN`, image `team`).
- `quotes`: h2 "Saubere Installation." / "Unsere Kunden sagen es selbst.", keys `werne`, `vitolus`, `gerhard`.
- `picture`: label "Heidi", caption "Deutschlandweit." / "Eigene Flotte und Partner vor Ort.".
- `apply`: pill "Für Installationsbetriebe", h2 "Werden Sie" / "Heidi-Installationspartner.", the text, three steps `{ title, text }`; the form's labels ("Firmenname", "Ansprechpartner", "E-Mail", "Telefon", "PLZ oder Region" with the placeholder "z. B. 10115 oder Raum Leipzig", "Monteure im Team" with "Bitte wählen", "Gewerke", "Erfahrung mit Funkzählern?", "Nachricht" + "(optional)" with the placeholder "Einsatzgebiet, Kapazitäten, Fragen", the consent "Ich bin einverstanden, dass Heidi Systems meine Angaben zur Kontaktaufnahme verarbeitet."), the button "Als Partner melden", "Wird gesendet …", the messages: `missing` "Bitte füllen Sie die markierten Felder aus.", `success(name)` "Danke, <name>! Wir melden uns bei Ihnen.", `sendError` "Das hat gerade nicht geklappt. Bitte versuchen Sie es noch einmal oder rufen Sie uns an: " + `PHONE`. The options' texts live in the schema module (1.3).
- `faq`: title "Häufige Fragen", five items (plain-text answers; FAQ 3 with `more: { text: "Mehr zum Installationstool" }` without `href`).
- `closing`: h2 "Werden Sie Installationspartner von Heidi.", the link "Partner werden" → `#bewerben`.

`content.test.ts`: the H1's two texts; four list entries; five rows with distinct tags and tiles, every row with two paragraphs; the doc's four rows; twelve calendar cells and `current` in range; eight tracking units; four rotator phrases; five figures; two audience cards, both with a target; the quote keys exist in the shared testimonials; five FAQ items; three steps; every `href` a route or an anchor on the page (`#bewerben`, `#inhalt`, `#faq`, `/messdienstwechsel#start`); no empty, doubled-space or untrimmed text.

## 1.3 The form: schema and action

`$lib/forms/partnerInquiry.ts` (shared client/server, German messages in the schema):

- `CREW_SIZES = ["1 bis 2", "3 bis 5", "6 bis 15", "Mehr als 15"]`, `TRADES = ["Heizung", "Sanitär", "Messtechnik", "Elektro"]`, `EXPERIENCE = [{ value: "ja", label: "Ja" }, { value: "teilweise", label: "Teilweise" }, { value: "nein", label: "Noch nicht" }]` (the design's options and values).
- `partnerInquirySchema`: `company` (2–200), `name` (2–100), `email` (≤ 254, valid), `phone` (6–40, digits, spaces and `+ ( ) / -`, at least six digits), `region` (2–100), `crew` (one of `CREW_SIZES`, "" invalid), `trades` (array of `TRADES`, default `[]`), `experience` (one of the values or "", default ""), `message` (≤ 2000, optional), `consent` (boolean, must be true), `website` (honeypot), `_t` (render time).

`$lib/server/partnerInquiry.ts`, modelled on `$lib/server/application.ts`:

- `emptyPartnerForm()` stamps `_t`.
- `handlePartnerInquiry(event, { page })`: honeypot and timing (`spamTrapReason`) → `fail(400)` on invalid fields → gibberish (company, name, message) → `checkIPRateLimit("partner:<ip>", KITCHEN_SINK ? 50 : 3, 600)` → `sendWebhookEventOrThrow("partnerinquiry", email, { company, name, phone, region, crew, trades, experience, message, page })`; a trap gets the success message and sends nothing; a failed send returns the error message with status 502 and keeps the values. Log lines carry the crew size only.
- `webhooks.ts`: the new `EventType` `"partnerinquiry"` with its payload in the comment.

Tests: `partnerInquiry.test.ts` (forms: a valid inquiry, trimming, every required field's message, the phone pattern, unknown options, consent false) and `$lib/server/partnerInquiry.test.ts` (the payload without the spam fields, empty optional fields left out, honeypot and timing answered with success, invalid → 400, the 502 on a failed send, the rate limit), with the webhook mocked as `/karriere`'s.

## 1.4 Pure logic

`tracking.ts` (the design's "Tracking im Haus"):

- `UNIT_POSITIONS`: the eight units' anchor points in the house drawing (the design's `data-pos`), the marker drawn 20 px to the right.
- `TRACKING_STEPS`: the pass as data, `{ at, done, current, count, label, heading, bar, here, push }` per step (0 ms: four done, at WE 05, "3 Wohnungen vor Ihnen", 33.3 %; 1600: five done, WE 06, 2, push on; 4200: push off; 4600: six done, WE 07, "1 Wohnung vor Ihnen"; 7000: seven done, WE 08, no count, "Ihr Monteur ist bei Ihnen", "Gleich klingelt es", 66.6 %, "Bei Ihnen" on); the pass is 12.5 s.
- `RESTING_STEP`: the server's and reduced motion's state (the design's `RM` branch: five done, WE 06, 2, the push on).
- `countLabel(n)` ("1 Wohnung" / "n Wohnungen vor Ihnen").

`tracking.test.ts`: the steps are ordered in time and within the pass; `done` grows by one per move; the marker's units exist; the resting step is the 1600 ms step; `countLabel`.

## 1.5 Images

Four new files from the design in `$lib/assets/landing/installationspartner/` (`facade.webp`, `fitter.webp`, `meter.jpg`, `team.jpg`, the design's bytes), imported `?enhanced`; the other photos are the repo's (README).
