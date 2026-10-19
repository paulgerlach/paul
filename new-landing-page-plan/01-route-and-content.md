# Phase 1: Route, link, content, the form and the shared section

## 1.1 Route and link

In one commit:

- `ROUTE_SOFTWAREPARTNER = "/softwarepartner"` in `$lib/routes.ts`, after `ROUTE_INSTALLATIONSPARTNER`.
- The landing footer's "Softwarepartner" (`$lib/landing/footerLinks.ts`, group "Partner") gets `href: ROUTE_SOFTWAREPARTNER`. "Verbände", "Nachfolge" and "Partnerschaften" stay plain text.
- No other page links this design (README).
- `src/routes/(landing-page)/softwarepartner/+page.server.ts`, as `/installationspartner`'s:

```ts
seo: {
	// Drafts for the content owner (plan §4.4).
	title: "Softwarepartner werden: Messdienstdaten in Ihrer Software | Heidi Systems",
	description:
		"Werden Sie Softwarepartner von Heidi Systems: Verbräuche, Heizkostenabrechnungen und Stammdaten fließen direkt in Ihre ERP-, CRM- oder Abrechnungssoftware. Eine Anbindung, keine doppelte Pflege für Ihre Kunden.",
	ogTitle: "Softwarepartner von Heidi Systems",
	noindex: true,
	keepCanonical: true,
},
// No signup form here: the nav CTA goes to /messdienstwechsel's (open question 1).
landing: { ...DEFAULT_CHROME, ctaHref: ROUTE_MESSDIENSTWECHSEL },
faq: faq.items,
partnerForm: await emptySoftwarePartnerForm(),
```

  and the default action `handleSoftwarePartnerInquiry(event, { page: ROUTE_SOFTWAREPARTNER })`. No `now`: nothing on the page depends on the day. No `cache-control`.
- Sitemap: no entry until the cutover (gate §4.4).

## 1.2 Content module

`$lib/landing/pages/softwarepartner/content.ts`, word for word from the design, in the shapes of `uv/types.ts` and `partner/types.ts`:

- `APPLY_ID = "bewerben"`; `MANAGER_SIGNUP_HREF = ROUTE_MESSDIENSTWECHSEL + START_HREF` (open question 1).
- `hero`: `srTitle` "Softwarepartner von Heidi Systems", `word` "Softwarepartner", `wordSize` "clamp(34px, 8.6vw, 130px)", the lead "Heidi liefert Verbrauchs- und Abrechnungsdaten direkt in die Software Ihrer Kunden. Eine Anbindung, keine doppelte Pflege.", `primary` "Partner werden" → `#bewerben`, `secondary` "API-Dokumentation" without `href` (`3AZnpE4apaUo694utixF1d`, not shown).
- `list` (the hero's app window, `ListMock`): label "Beispiel: Heidi Schnittstelle", brand "Heidi", nav `server` "Schnittstellen", `doc` "Datenfluss", `users` "Partner", foot "Schnittstelle", head "Heidi Schnittstelle", tag "Beispieldaten", title "Datenübergabe läuft.", sub "ERP-Anbindung · Beispiel"; entries `server` "Verbrauchsdaten" / "Monatlich je Einheit" ("Wird übertragen" → "Übertragen"), `doc` "Heizkostenabrechnung 2026" / "Als Datensatz" ("Wird erstellt" → "Übergeben"), `building` "Liegenschaften" / "Stammdaten" ("Abgleich" → "Aktuell"), `bell` "Mieterportal" / "Verbrauchsinfo September" ("Wird bereitgestellt" → "Bereit").
- `statement`: label "Worum es geht", the text ("Hausverwaltungen arbeiten in ihrer eigenen Software. … ohne Ihre Software zu verlassen.").
- `rows`: label "So arbeitet Heidi", primary "Partner werden" → `#bewerben`, secondary "Häufige Fragen" → `#faq`; four `Row<TileKind>` (`TileKind = "bill" | "calendar" | "doc" | "phone"`): "Schnittstelle" (mint, `bill`), "Datenfluss" (mint, `calendar`), "Sicherheit" (stone, `doc`), "Gemeinsame Kunden" (ink, `phone`), each with its two-line title and two paragraphs.
- `bill` (`BillTile`): "Heute" / "Mit Heidi"; rows `cut` "Ablesewerte als PDF" "manuell", `cut` "Werte ins ERP abtippen" "manuell", `ok` "Verbräuche automatisch im ERP", `ok` "Abrechnung als Datensatz"; sum "Doppelte Pflege" "ja" → "nein".
- `calendar` (`CalendarTile`): the months "Jan" … "Dez", `current` 9, `done` "übertragen", `doing` "wird übertragen", `open` "offen", `noteDone` "{x} übertragen", `noteDoing` "{x} wird übertragen".
- `doc` (`DocTile`): "Datenverarbeitung", "Heidi Plattform", the check rows "Server in Deutschland", "Verarbeitung nach DSGVO", "Verschlüsselte Übertragung", "Zugriff" with the value "Nur berechtigt", the result "Sicher übertragen".
- `phone` (`PhoneTile` without figure): time "9:41", app "Heidi", the notification "Neue Daten von Heidi" / "Verbräuche Oktober werden übertragen"; `transfers` (row 4's list): "Verbräuche September" / "24 Liegenschaften · 1.650 Einheiten" (done), "Heizkostenabrechnung 2026" / "Als Datensatz übergeben" (done), "Stammdaten" / "Liegenschaften abgeglichen" (done), "Verbräuche Oktober" / "Wird übertragen" (current); the badges "✓" and "…".
- `rotator`: label "Was Heidi übernimmt", lead "Heidi liefert an Ihre Software:", the four phrases ("Verbräuche je Einheit", "Heizkostenabrechnung", "Stammdaten", "Verbrauchsinfo für Mieter"), 2300 ms.
- `numbers`: "Die Anbindung in Zahlen"; first "12" "×" "Datenlieferungen pro Jahr statt einer Ablesung" (counts); rest "1" "Anbindung für alle gemeinsamen Kunden" (counts), "0" "Werte zum Abtippen", "DE" (compact) "Server in Deutschland", "DSGVO" (compact) "konforme Verarbeitung".
- `audience`: label "Ihr Wechsel"; "Sie sind Softwareanbieter?" (text, "Jetzt Partner werden" → `#bewerben`, image `facade`), "Sie sind Verwaltung?" (text, "Zu den Schnittstellen" → `ROUTE_SCHNITTSTELLEN`, image `building`).
- `quotes`: h2 "Daten, die ankommen." / "Unsere Kunden sagen es selbst.", keys `vitolus`, `werne`, `gerhard`.
- `picture`: label "Heidi", caption "Ihre Software." / "Unsere Daten.".
- `apply` (`ApplyContent` + the form's texts): pill "Für Softwareanbieter", h2 "Werden Sie" / "Heidi-Softwarepartner.", the text, three steps ("Formular senden" / "Wir melden uns bei Ihnen.", "Technisches Kennenlernen" / "Datenfelder, Formate und Übergabe.", "Anbindung umsetzen" / "Gemeinsame Kunden bekommen die Daten direkt."); the form's labels ("Unternehmen", "Ansprechpartner", "E-Mail", "Telefon", "Software oder Produkt" with the placeholder "Name Ihrer Lösung", "Kunden in der Immobilienwirtschaft" with "Bitte wählen", "Art der Software", "Nachricht" + "(optional)" with the placeholder "Schnittstellen, Anwendungsfälle, Fragen", the consent "Ich bin einverstanden, dass Heidi Systems meine Angaben zur Kontaktaufnahme verarbeitet."), the button "Als Partner melden", "Wird gesendet …", `missing` "Bitte füllen Sie die markierten Felder aus.", `success(name)` "Danke, <name>! Wir melden uns bei Ihnen.", `sendError` "Das hat gerade nicht geklappt. Bitte versuchen Sie es noch einmal oder rufen Sie uns an:" + `PHONE` (the same texts as `/installationspartner`'s). The options' texts live in the schema module (1.3).
- `faq`: title "Häufige Fragen", four items (plain-text answers; FAQ 3 with `more: { text: "Mehr zu Sicherheit", href: ROUTE_SICHERHEIT }`).
- `closing`: h2 "Werden Sie Softwarepartner von Heidi.", the link "Partner werden" → `#bewerben`.

`content.test.ts`: the H1's two texts; four list entries with known icons; four rows with distinct tags and tiles, every row with two paragraphs; the bill's rows; twelve calendar cells and `current` in range; the doc's four rows; four transfers, exactly one current; four rotator phrases; five figures; two audience cards, both with a target; the quote keys exist in the shared testimonials; four FAQ items; three steps; every `href` a route or an anchor on the page (`#bewerben`, `#faq`, `/messdienstwechsel#start`); the form texts equal `/installationspartner`'s where the designs agree; no empty, doubled-space or untrimmed text.

## 1.3 The form: schema and action

`$lib/forms/softwarePartnerInquiry.ts` (shared client/server, German messages in the schema):

- `CUSTOMER_COUNTS = ["Bis 50", "50 bis 250", "250 bis 1.000", "Mehr als 1.000"]`, `SOFTWARE_KINDS = ["ERP", "CRM", "Abrechnung", "Mieterkommunikation", "Sonstiges"]` (the design's options and values).
- `softwarePartnerInquirySchema`: `company` (2–200), `name` (2–100), `email` (≤ 254, valid), `phone` ("" or 6–40 with digits, spaces and `+ ( ) / -`, at least six digits), `product` (2–200), `customers` (one of `CUSTOMER_COUNTS`, "" invalid), `kinds` (array of `SOFTWARE_KINDS`, default `[]`), `message` (≤ 2000, optional), `consent` (boolean, must be true), `website` (honeypot), `_t` (render time).

`$lib/server/softwarePartnerInquiry.ts`, modelled on `$lib/server/partnerInquiry.ts`:

- `emptySoftwarePartnerForm()` stamps `_t`.
- `handleSoftwarePartnerInquiry(event, { page })`: honeypot and timing (`spamTrapReason`) → `fail(400)` on invalid fields → gibberish (name, message) → `checkIPRateLimit("softwarepartner:<ip>", KITCHEN_SINK ? 50 : 3, 600)` → `sendWebhookEventOrThrow("softwarepartnerinquiry", email, { company, name, phone, product, customers, kinds, message, page })` (an empty phone or message left out); a trap gets the success message and sends nothing; a failed send returns the error message with status 502 and keeps the values. Log lines carry the customer count only.
- `webhooks.ts`: the new `EventType` `"softwarepartnerinquiry"` with its payload in the comment.

Tests: `softwarePartnerInquiry.test.ts` (forms: a valid inquiry, trimming, every required field's message, the optional phone and its pattern, unknown options, consent false) and `$lib/server/softwarePartnerInquiry.test.ts` (the payload without the spam fields, empty optional fields left out, honeypot and timing answered with success, invalid → 400, the 502 on a failed send, the rate limit), with the webhook mocked as `/installationspartner`'s.

## 1.4 The shared partner section

Moved out of `$lib/landing/pages/installationspartner/sections/` into `$lib/landing/sections/partner/`, in the route commit (with no visible change on `/installationspartner`):

- `types.ts`: `ApplyContent = { pill; h2: [string, string]; text; steps: { title; text }[] }`, `FormTexts = { submit; sending; missing; sendError: { text; phone; phoneHref } }`.
- `Apply.svelte`: `/installationspartner`'s `Apply` with `id`, `headingId`, `content: ApplyContent` and a `form` snippet in place of its imports.
- `FormFrame.svelte`: the `<form>` of `/installationspartner`'s `PartnerForm` (`method="POST"`, `action="#bewerben"`, `novalidate`, the page's superforms `enhance`), the `_t` field, the honeypot, a `children` snippet for the fields, the button and the message line (`sent` → the green `role="status"` line; otherwise the `role="alert"` line with `missing`, the send error with the `tel:` link, or "Wird gesendet …"), and every style of the form, written as `.ipf-f :global(…)` rules in the same order as today so the cascade doesn't change.
- `/installationspartner`'s `Apply` becomes a wrapper; its `PartnerForm` keeps its fields and its `superForm` and renders them in `FormFrame`.

## 1.5 Images

None new: `cities/muenchen/hero.jpg`, `mietverwaltung/apartment.webp`, `mieterportal/building.webp`, `cities/berlin/references.jpg`, imported `?enhanced` (README).
