# Phase 1: Route, link, content and the signup

## 1.1 Route and link

In one commit:

- `ROUTE_VERBAENDE = "/verbaende"` in `$lib/routes.ts`, after `ROUTE_SOFTWAREPARTNER`.
- The landing footer's "Verbände" (`$lib/landing/footerLinks.ts`, group "Partner") gets `href: ROUTE_VERBAENDE`. "Nachfolge" and "Partnerschaften" stay plain text.
- No other page links this design (README).
- `src/routes/(landing-page)/verbaende/+page.server.ts`, as `/weg-verwaltung`'s:

```ts
seo: {
	// Drafts for the content owner (plan §4.4).
	title: "Heidi Systems in den Verbänden: VDIV, DEUMESS und bved | Heidi Systems",
	description:
		"Heidi Systems ist Kooperationspartner des VDIV und in den Verbänden DEUMESS und bved vernetzt. Für korrekte Daten, faire Abrechnungen und verlässliche Partner im Messdienst.",
	ogTitle: "Heidi Systems in den Verbänden der Branche",
	noindex: true,
	keepCanonical: true,
},
landing: DEFAULT_CHROME,
faq: faq.items,
finalForm: await emptySwitchForm("final"),
```

  and the default action `handleSwitchSignup(event, { source: "verbaende", page: ROUTE_VERBAENDE })`. No `now`: nothing on the page depends on the day. No `cache-control`.
- Sitemap: no entry until the cutover (gate §4.4).

## 1.2 Content module

`$lib/landing/pages/verbaende/content.ts`, word for word from the design, in the shapes of `uv/types.ts`:

- `hero`: `srTitle` "Heidi Systems in den Verbänden der Branche", `word` "Verbände", the lead "Heidi ist Kooperationspartner des VDIV und in den Verbänden DEUMESS und bved vernetzt.", `primary` "Demo buchen" → `DEMO_HREF`, `secondary` "Mehr erfahren" → `#inhalt`.
- `list` (the hero's app window, `ListMock`): label "Heidi in den Verbänden" (the design's `aria-label`), brand "Heidi", nav `users` "Verbände", `doc` "Datenschutz", `users` "Presse", foot "Verbände", head "Verbände", tag "Beispieldaten", title "Gut vernetzt.", sub "Heidi Systems · Berlin"; entries `building` "VDIV" / "Kooperationspartner Bund" ("Partner"), `users` "DEUMESS" / "Verband unabhängiger Messdienstleister" ("Vernetzt"), `chart` "bved" / "Energie- und Wasserdatenmanagement" ("Vernetzt"), `check` "Datenschutz" / "Verarbeitung nach DSGVO" ("Konform"); `before` equals `after` on each, as the design's `data-a` / `data-b`.
- `statement`: label "Worum es geht", the text ("Messdienst lebt von Vertrauen: in korrekte Daten, faire Abrechnungen und verlässliche Partner. … Als Kooperationspartner des VDIV und vernetzt in DEUMESS und bved.").
- `rows`: label "So arbeitet Heidi", primary "Demo buchen" → `DEMO_HREF`, secondary "Häufige Fragen" → `#faq`; four `Row<TileKind>` (`TileKind = "vdiv" | "deumess" | "bved" | "doc"`, all `stone`): "VDIV" ("Kooperationspartner" / "des VDIV."), "DEUMESS" ("Vernetzt mit den" / "Messdienstleistern."), "bved" ("Energie- und" / "Wasserdaten."), "Datenschutz" ("Sicher" / "nach DSGVO."), each with its two paragraphs.
- `logos` (rows 1–3's cards): `vdiv` "Kooperationspartner Bund", `deumess` "Verband unabhängiger Messdienstleister", `bved` "Energie- und Wasserdatenmanagement" (the line under the logo; the images are imported in the tile's wrapper).
- `doc` (`DocTile`): "Datenverarbeitung", "Heidi Plattform", the check rows "Server in Deutschland", "Verarbeitung nach DSGVO", "Verschlüsselte Übertragung", the result "DSGVO-konform".
- `rotator`: label "Was Heidi übernimmt", lead "Heidi ist vernetzt mit:", the three phrases ("VDIV", "DEUMESS", "bved"), 2300 ms.
- `numbers`: "Heidi auf einen Blick"; first "3" "Verbände der Immobilien- und Messdienstbranche" (counts); rest "Bund" "Kooperationspartner des VDIV", "DE" "Server in Deutschland", "DSGVO" "konforme Verarbeitung", "Berlin" "Sitz von Heidi Systems" (all compact).
- `audience`: label "Ihr Wechsel"; "Sie sind ein Verband?" (text, "Zur Presseseite" → `ROUTE_PRESSE`, image `conference`), "Sie sind Verwaltung?" (text, "Demo buchen" → `DEMO_HREF`, image `building`).
- `quotes`: h2 "Verlässlich." / "Unsere Kunden sagen es selbst.", keys `werne`, `vitolus`, `gerhard`.
- `picture`: label "Heidi", caption "Gut vernetzt." / "Sicher aufgestellt.".
- `faq`: title "Häufige Fragen", five items (plain-text answers; FAQ 5 with `more: { text: "Mehr zu Sicherheit", href: ROUTE_SICHERHEIT }`).
- `closing`: h2 "Ein verlässlicher Partner für Ihren Messdienst.", text "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.", `submitLabel` "Demo buchen".

`content.test.ts`: the H1's two texts; four list entries with known icons, each with equal statuses; four rows with distinct tags, three logo tiles and the doc, every row with two paragraphs; a line for every logo tile; the doc's three rows; three rotator phrases naming the three associations; five figures; two audience cards, both with a target; the quote keys exist in the shared testimonials; five FAQ items; the associations' lines agree between the list, the logo cards and the FAQ answers (the design repeats them); every `href` a route or an anchor on the page (`#start`, `#inhalt`, `#faq`); no empty, doubled-space or untrimmed text.

## 1.3 Images

- New: `$lib/assets/landing/verbaende/booth.webp` and `conference.webp`, the design's files as they are (1681×936 WebP, 148 and 168 KB), imported `?enhanced`.
- Reused: `vorgehen/facade.webp`, `partners/vdiv.webp`, `partners/deumess.webp`, `partners/bved.webp`, `vorgehen/kitchen-meters.webp`, `mieterportal/building.webp`, `vorgehen/building-wide.webp` (README).
