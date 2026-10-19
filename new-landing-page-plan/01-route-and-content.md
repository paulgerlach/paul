# Phase 1: Route, links, content and the forms

## 1.1 Route and links

In one commit:

- `ROUTE_PARTNERSCHAFTEN = "/partnerschaften"` in `$lib/routes.ts`, after `ROUTE_NACHFOLGE`.
- The landing footer's "Partnerschaften" (`$lib/landing/footerLinks.ts`, group "Partner") gets `href: ROUTE_PARTNERSCHAFTEN`, so every "Partner" entry has a page.
- `/neuigkeiten`'s story "Partnerschaften: Mit Heidi zusammenarbeiten" gets `more: { text: "Mehr erfahren", href: ROUTE_PARTNERSCHAFTEN }` (the design's link text); its `content.test.ts` ("has the design's link texts") and `e2e/neuigkeiten.e2e.ts` ("stories and rows link only where a page exists") pin it.
- `/nachfolge`'s second audience card "Mehr Partnerschaften?" gets `cta: { text: "Zu den Partnerschaften", href: ROUTE_PARTNERSCHAFTEN }`, so its button shows; `nachfolge/content.test.ts` and `e2e/nachfolge.e2e.ts` ("the second audience card without a button") change with it.
- `src/routes/(landing-page)/partnerschaften/+page.server.ts`, as `/nachfolge`'s:

```ts
seo: {
	// Drafts for the content owner (plan §4.4).
	title: "Partnerschaften: Mit Heidi zusammenarbeiten | Heidi Systems",
	description:
		"Sie haben ein Produkt, ein Netzwerk oder eine Idee, die zu Heidi passt? Heidi Systems arbeitet mit Softwareanbietern, Installationsbetrieben, Verbänden und Messdienstanbietern zusammen. Lassen Sie uns sprechen.",
	ogTitle: "Partnerschaften mit Heidi Systems",
	noindex: true,
	keepCanonical: true,
},
// No signup form here: the nav CTA goes to /messdienstwechsel's.
landing: { ...DEFAULT_CHROME, ctaHref: ROUTE_MESSDIENSTWECHSEL },
faq: faq.items,
partnershipForm: await emptyPartnershipForm(),
connectionForm: await emptyConnectionForm(),
```

  and two named actions: `partnership: (event) => handlePartnershipInquiry(event, { page: ROUTE_PARTNERSCHAFTEN })`, `connection: (event) => handleConnectionInquiry(event, { page: ROUTE_PARTNERSCHAFTEN })`. No default action, no `cache-control`.
- Sitemap: no entry until the cutover (gate §4.4).

## 1.2 Content module

`$lib/landing/pages/partnerschaften/content.ts`, word for word from the design, in the shapes of `uv/types.ts` and `partner/types.ts`:

- `APPLY_ID = "kontakt"` (the design's id); `KONTAKT_HREF` for every CTA that leads to the form (open question 1). `CONNECTION_ID = "anbindung"`: the first audience card's anchor, where the card form posts without JS.
- `hero`: `srTitle` "Partnerschaften mit Heidi Systems", `word` "Partnerschaften", `wordSize` "clamp(34px, 8.6vw, 130px)", the lead "Sie haben ein Produkt, ein Netzwerk oder eine Idee, die zu Heidi passt? Lassen Sie uns zusammenarbeiten.", `primary` "Kontakt aufnehmen" → `#kontakt`, `secondary` "Mehr erfahren" → `#inhalt`.
- `list` (the hero's app window, `ListMock`): label "Beispiel: Heidi Dashboard", brand "Heidi", nav `users` "Partner", `doc` "Dokumente", `users` "Kontakt", foot "Heidi Dashboard", head "Heidi Partner", tag "Beispieldaten", title "Gemeinsam mit Heidi", sub "Partnerschaften · Beispiel"; entries `plug` "Softwareanbieter" / "Schnittstelle nach bved-Standard" ("In Abstimmung" → "Verbunden"), `tool` "Installationsbetriebe" / "Geschult und zertifiziert" ("In Schulung" → "Zertifiziert"), `users` "Verbände und Netzwerke" / "VDIV und DEUMESS" ("Im Austausch" → "Vernetzt"), `building` "Messdienstanbieter" / "Nachfolge und Zusammenarbeit" ("Im Gespräch" → "Vereinbart").
- `statement`: label "Worum es geht", the text ("Heidi macht den Messdienst einfacher, und das schaffen wir nicht allein. … Wenn Sie eine Idee haben, die zu uns passt, melden Sie sich.").
- `rows`: label "So arbeitet Heidi", primary "Partnerschaft anfragen" → `#kontakt`, secondary "Häufige Fragen" → `#faq`; four `Row<TileKind>` (`TileKind = "doc" | "phone" | "calendar" | "bill"`): "Software" ("Eine Anbindung." / "Alle Kunden.", stone, `doc`; the second paragraph "Nach bved-Standard oder über die Heidi API." plain), "Installation" ("Regional stark." / "Bundesweit vernetzt.", ink, `phone`; the second paragraph the link "Mehr für Installationsbetriebe" → `ROUTE_INSTALLATIONSPARTNER`), "Netzwerk" ("Verbände und" / "Messdienste.", mint, `calendar`; the second paragraph ends in "Mehr zur Nachfolge" → `ROUTE_NACHFOLGE`), "Gemeinsam" ("Partnerschaft" / "auf Augenhöhe.", mint, `bill`), each with its two paragraphs.
- `doc` (`DocTile`): "Schnittstelle", "Softwarepartner · Beispiel", the check rows "Verbrauchsdaten", "Nutzerwechsel", "Dokumente" and the value row "Standard" "bved", the result "Verbunden".
- `phone` (`PhoneTile`): time "9:41", app "Heidi", the notification "Neuer Auftrag in Ihrer Region" / "Link öffnen und loslegen", label "Digitaler Zwilling", value "12 Wohnungen", comparisons ["Alle Zähler angelegt · Beispiel"].
- `calendar` (`CalendarTile`): the cells "VDIV", "DEUMESS", "bved", "Software", "Installation", "Messdienst", "Verwaltung", "Verband", "Ihre Idee", `current` 8, `done` "dabei", `doing` "im Gespräch", `open` "offen", `noteDone` "{x} dabei", `noteDoing` "{x} im Gespräch".
- `bill` (`BillTile`): "Allein" / "Mit Heidi"; rows `cut` "Eigene Schnittstellen je Messdienst" "aufwendig", `cut` "Kunden einzeln versorgen" "manuell", `ok` "Eine Anbindung für alle Kunden", `ok` "Persönlicher Ansprechpartner"; sum "Aufwand" "hoch" → "gering".
- `rotator`: label "Was Heidi übernimmt", lead "Partner bei Heidi:", the four phrases ("Softwareanbieter", "Installationsbetriebe", "Verbände", "Messdienstanbieter"), 2300 ms.
- `numbers`: "Partnerschaften in Zahlen"; first "VDIV" "Kooperationspartner Bund"; then "DEUMESS" "Im Verband vernetzt", "bved" "Webservices nach bved-Standard", "15.000+" "Geräte bereits installiert", "DE" "Alle Daten auf Servern in Deutschland" (all compact). No deadline figure, so no `figures(now)`.
- `audience`: label "Ihr Wechsel"; "Sie sind Softwareanbieter?" (text, "Softwarepartner werden" → `ROUTE_SOFTWAREPARTNER`, the card form as its panel), "Sie sind Installationsbetrieb?" (text, "Installationspartner werden" → `ROUTE_INSTALLATIONSPARTNER`, image `installer`).
- `quotes`: h2 "Gemeinsam besser." / "Unsere Kunden sagen es selbst.", keys `werne`, `vitolus`, `gerhard`.
- `picture`: label "Heidi", caption "Gemeinsam bauen wir" / "den Messdienst von morgen.".
- `apply` (`ApplyContent` + the form's texts): pill "Partnerschaft", h2 "Lassen Sie uns über" / "Zusammenarbeit reden.", the text "Erzählen Sie uns kurz, wer Sie sind und welche Partnerschaft Sie sich vorstellen. Wir melden uns persönlich.", three steps ("Formular senden" / "Wir melden uns bei Ihnen.", "Kennenlernen" / "Wir verstehen Ihr Geschäft.", "Loslegen" / "Mit klaren Absprachen."); the form's labels ("Unternehmen", "Ihr Name", "E-Mail", "Telefon", "Art der Partnerschaft" with "Bitte wählen", "Nachricht" + "(optional)", the consent "Ich bin einverstanden, dass Heidi Systems meine Angaben zur Kontaktaufnahme verarbeitet."), the button "Partnerschaft anfragen", "Wird gesendet …", `missing` "Bitte füllen Sie die markierten Felder aus.", `success(name)` "Danke, <name>! Wir melden uns bei Ihnen.", `sendError` "Das hat gerade nicht geklappt. Bitte versuchen Sie es noch einmal oder rufen Sie uns an:" + `PHONE` (the same texts as `/nachfolge`'s). The options' texts live in the schema module (1.3).
- `connection` (the card form): label "Anfrage Softwarepartner" (the form's accessible name), head "Anbindung anfragen" / "Wir melden uns persönlich bei Ihnen.", labels "Unternehmen", "Ihr Name", "E-Mail", "Ihre Software" with "Bitte wählen", "Nachricht (optional)" with the placeholder "Was möchten Sie anbinden?", the same consent, the button "Anfrage senden", "Wird gesendet …", `missing` (as above), the thank-you "Danke für Ihre Anfrage." / "Ihr persönlicher Ansprechpartner meldet sich bei Ihnen.", `sendError` (as above).
- `faq`: title "Häufige Fragen", five items: 1 and 2 plain; 3 "In der API-Dokumentation. Mehr zur Zusammenarbeit lesen Sie auf der Seite für <a>Softwarepartner</a>." (→ `ROUTE_SOFTWAREPARTNER`; "API-Dokumentation" plain); 4 "Dann lesen Sie mehr auf unserer Seite zur <a>Nachfolge</a>." (→ `ROUTE_NACHFOLGE`); 5 with `more: { text: "Mehr zu Sicherheit", href: ROUTE_SICHERHEIT }`.
- `closing`: h2 "Lassen Sie uns zusammenarbeiten.", text "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.", the button "Demo buchen" / "Mit Ihrem Ansprechpartner" → `#kontakt`.

`content.test.ts`: the H1's two texts; four list entries with known icons; four rows with distinct tags and tiles, every row with two paragraphs; the doc's four rows with one value; the phone's one chip; nine grid cells, `current` the last; the bill's rows; four rotator phrases; six figures, none counting; two audience cards with their targets, the first without an image; the quote keys exist in the shared testimonials; five FAQ items, every `<a>` in an answer a route; three steps; every `href` a route or an anchor on the page (`#kontakt`, `#inhalt`, `#faq`); the form texts equal `/nachfolge`'s where the designs agree; no empty, doubled-space or untrimmed text.

## 1.3 The forms: schemas and actions

`$lib/forms/partnershipInquiry.ts` (shared client/server, German messages in the schema):

- `PARTNERSHIP_KINDS = ["Softwareanbieter", "Installationsbetrieb", "Verband oder Netzwerk", "Messdienstanbieter", "Immobilienunternehmen", "Sonstiges"]` (the design's options, word for word).
- `partnershipInquirySchema`: `company` (2–200), `name` (2–100), `email` (≤ 254, valid), `phone` ("" or 6–40 with digits, spaces and `+ ( ) / -`, at least six digits), `kind` (one of `PARTNERSHIP_KINDS`; required, as the design's select), `message` (≤ 2000, optional), `consent` (boolean, must be true), `website` (honeypot), `_t` (render time).

`$lib/forms/connectionInquiry.ts`:

- `SOFTWARE_TYPES = ["ERP für die Immobilienwirtschaft", "CRM", "Abrechnungssoftware", "Mieter-App oder Portal", "Andere Software"]` (the design's options, word for word).
- `connectionInquirySchema`: `company`, `name`, `email` (as above), `software` (one of `SOFTWARE_TYPES`, required), `message` (≤ 2000, optional), `consent`, `website`, `_t`.

`$lib/server/partnershipInquiry.ts` and `$lib/server/connectionInquiry.ts`, modelled on `$lib/server/successionInquiry.ts`:

- `emptyPartnershipForm()` / `emptyConnectionForm()` stamp `_t` and set the superforms ids `partnership` / `connection` (two forms on one page).
- `handlePartnershipInquiry(event, { page })`: honeypot and timing (`spamTrapReason`) → `fail(400)` on invalid fields → gibberish (name, message) → `checkIPRateLimit("partnerschaften:<ip>", KITCHEN_SINK ? 50 : 3, 600)` → `sendWebhookEventOrThrow("partnershipinquiry", email, { company, name, phone, kind, message, page })` (an empty phone or message left out); a trap gets the success message and sends nothing; a failed send returns the error message with status 502 and keeps the values. Log lines carry the kind of partnership only.
- `handleConnectionInquiry(event, { page })`: the same with `checkIPRateLimit("anbindung:<ip>", …)` and `sendWebhookEventOrThrow("connectioninquiry", email, { company, name, software, message, page })`; log lines carry the kind of software only.
- `webhooks.ts`: the new `EventType`s `"partnershipinquiry"` and `"connectioninquiry"` with their payloads in the comment.

Tests: `partnershipInquiry.test.ts` and `connectionInquiry.test.ts` in `$lib/forms/` (a valid inquiry, trimming, every required field's message, the optional phone and its pattern, the selects' unknown and empty options, consent false) and in `$lib/server/` (the payload without the spam fields, empty optional fields left out, honeypot and timing answered with success, invalid → 400, the 502 on a failed send, the rate limit), with the webhook mocked as `/nachfolge`'s.

## 1.4 Images

- New: `$lib/assets/landing/partnerschaften/facade.webp`, the design's file as it is (1075×1080 WebP, 155 KB), imported `?enhanced`.
- Reused: `installationspartner/facade.webp`, `vorgehen/consultation.webp`, `vorgehen/kitchen-meters.webp`, `vorgehen/installer.webp`; the video button's `region/demo-poster.jpg` and `/landing/region-demo.webm` / `.mp4` through `DemoVideoButton`'s defaults (README).
