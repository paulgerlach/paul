# Phase 1: Route, links, content and SEO

## 1.1 Route and links

In one commit (after the template commit of 02 §2.1, since the content uses its new shapes):

- `ROUTE_MIETVERWALTUNG = "/mietverwaltung"` in `$lib/routes.ts`, after `ROUTE_HAUSVERWALTUNG`.
- The landing footer's "Mietverwaltung" (`$lib/landing/footerLinks.ts`, group "Kunden") gets `href: ROUTE_MIETVERWALTUNG`. The other "Kunden" entries stay plain text until their pages exist.
- `src/routes/(landing-page)/mietverwaltung/+page.server.ts`, a copy of `hausverwaltung/+page.server.ts`:

```ts
export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title: "Messdienst für Mietverwaltungen: Heizkostenabrechnung pünktlich zur BKA | Heidi Systems",
		description:
			"Heidi liefert Mietverwaltungen die Heizkostenabrechnung rechtzeitig zur Betriebskostenabrechnung, für jedes Objekt und jeden Eigentümer. Mit Funkzählern, Zwischenablesung per Funk beim Mieterwechsel und Verbrauchsinfo für Ihre Mieter.",
		ogTitle: "Messdienst für Mietverwaltungen mit Heidi",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: true,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	faq: faq.items,
	figures: figures(Date.now()),
	finalForm: await emptySwitchForm("final"),
});

export const actions: Actions = {
	default: (event) =>
		handleSwitchSignup(event, { source: "mietverwaltung", page: ROUTE_MIETVERWALTUNG }),
};
```

  No `cache-control` (the layout sets it). `leads.source` is free text: no migration.
- **Other links to the page:** none. Searched every saved design (landing pages, cities, segment siblings) for `NJDrQZKYRpBXGMNJJGXUqd`: the designs' nav ("Mietverwaltung · Mietshäuser und Sondereigentum für Eigentümer") and footer, and the segment tabs of the Wohnungsunternehmen and Asset-Manager designs (not built).
- **Tests that see the change:** the footer-link specs (every internal footer link resolves) now include `/mietverwaltung`.
- `+page.svelte`: `<main id="content" class="mv" {@attach reveal()}>` with `UvMain` around sections 1–10, `Trust` after it, `FloatingCta` after `</main>`; reveal styles and the `#hs-css` H2 sizes as on `/hausverwaltung`.
- Sitemap: no entry until the cutover (gate §4.4).

## 1.2 Content module

`$lib/landing/pages/mietverwaltung/content.ts`, word for word from the design, in the `uv` shapes. `NB` between figures and units, after "§". Soft hyphens where the design has `&shy;`.

- `hero`: `srTitle` "Messdienst für Mietverwaltungen mit Heidi", `word` "Mietverwaltung", `lead` "Pünktlich zur Betriebs­kosten­abrechnung. Für jedes Objekt und jeden Eigentümer." (two soft hyphens), `primary` "Demo buchen" → `DEMO_HREF`, `secondary` "Mehr erfahren" → `#inhalt`. Photos: left `cities/muenchen/hero.jpg`, right `selbstabrechnung/beratung.webp` with `object-position: 58% 30%`.
- `list` (`uv/ListMock`): label "Beispiel: Heidi Dashboard", brand "Heidi", nav Eigentümer (active, `key`) / Abrechnungen (`doc`) / Mieter (`users`), navFoot "Heidi Dashboard", head "4 Eigentümer", tag "Beispieldaten", title "Abrechnungen nach Eigentümer.", sub "Abrechnungsjahr 2025", entries `{ icon: "user", before: "In Arbeit", after: "Bereit für BKA" }`: "Eigentümer A" – "3 Objekte · 28 Einheiten"; "Eigentümer B" – "1 Objekt · 6 Einheiten"; "Eigentümer C" – "2 Objekte · 15 Einheiten"; "Eigentümer D" – "1 Objekt · 9 Einheiten".
- `statement`: label "Worum es geht", text "Sie verwalten Mietshäuser und Sondereigentum im Auftrag vieler Eigentümer. Jeder erwartet eine pünktliche Betriebskostenabrechnung. Heidi liefert die Heizkostenabrechnung rechtzeitig, für jedes Objekt einzeln. Auch beim Mieterwechsel muss niemand zur Ablesung in die Wohnung."
- `rows`: label "So arbeitet Heidi", CTAs "Demo buchen" / "Häufige Fragen" → `#faq`:
  - "Pünktlich" / "Fertig, bevor" "die Frist drückt." / "Weil Funkzähler die Verbräuche laufend liefern, steht die Heizkostenabrechnung früh im Jahr bereit." + "So bleibt Zeit für die Betriebskostenabrechnung innerhalb der 12-Monats-Frist." / `calendar`, mint.
  - "Mieterwechsel" / "Auszug." "Ohne Termin." / "Beim Mieterwechsel übernimmt Heidi die Zählerstände zum Stichtag per Funk." + "Keine Zwischenablesung vor Ort, keine Schätzwerte, keine Diskussion mit dem Vormieter." / `doc`, stone.
  - "Eigentümer" / "Die Zahlen für" "jeden Eigentümer." / "Im Dashboard sehen Sie die Verbräuche pro Objekt und Eigentümer." + "So haben Sie für Eigentümergespräche die Zahlen parat, statt sie zusammenzusuchen." / `bill`, mint.
  - "Mieter" / "Weniger Rückfragen." "Mehr Ruhe." / ["Ihre Mieter sehen jeden Monat ihren Verbrauch im ", { "Mieterportal" → `ROUTE_MIETERPORTAL` }, "."] + "Wer seinen Verbrauch kennt, wird von der Abrechnung nicht überrascht. Das spart Rückfragen bei Ihnen." / `phone`, ink.
- `calendar`: cells "Objekt 1" … "Objekt 12", `current: 11`, done "fertig", doing "wird erstellt", open "offen", noteDone "{x}: Abrechnung fertig", noteDoing "{x} wird erstellt". End state: eleven "fertig", Objekt 12 "wird erstellt", note "Objekt 12 wird erstellt".
- `doc` (value rows and a check row): title "Zwischenablesung WE 07", sub "Mieterwechsel · Beispiel", rows Auszug "30.09." / Heizkostenverteiler "per Funk" / Warmwasser "per Funk" / "Werte zum Stichtag übernommen" (tick), result "Bereit für die Abrechnung".
- `bill` (one row set per side, 02 §2.1): without "Eigentümer A", with "Eigentümer B", rows `a` "Lindenallee 12 · 18 WE" "fertig", `a` "Parkstraße 4 · 10 WE" "fertig", `b` "Am Markt 7 · 6 WE" "fertig", `base` "Verbrauchsinfo monatlich" "aktiv", sum "Objekte" "2" → "1".
- `phone` (bars): time "9:41", app "Heidi", title "Ihre Verbrauchsinfo September", sub "Jetzt im Mieterportal ansehen", label "Heizung im September", value "131 kWh", comparisons ["Vergleich zum Vorjahresmonat"], bars 171, 184, 162, 131, 74, 22, 15, 14, 96, 131 (the same as `/mieterportal`'s).
- `rotator`: label "Was Heidi übernimmt", lead "Heidi übernimmt:", phrases "Zwischenablesung beim Auszug", "Heizkostenabrechnung", "Verbrauchsinfo für Mieter", "Zahlen für Eigentümer", 2300 ms.
- `numbers`: as on `/hausverwaltung` (92 %, the photo, 14 Tage, "1–2 h", 1, the deadline figure), the photo the new `mietverwaltung/apartment.webp`.
- `audience`: label "Ihr Wechsel"; "Ihr Vertrag läuft noch?" (text as `/hausverwaltung`, cta "Zum Fristenrechner" without `href`, media: the Portfolio-Checker); "Was bringt der Wechsel?" (text as `/hausverwaltung`, cta "Zum Einsparrechner" without `href`, image `cities/frankfurt/hero.jpg`).
- `checker` (the Portfolio-Checker): label "Beispiel: Portfolio-Checker prüft Messdienstverträge", title "Portfolio-Checker", status "Verträge werden geprüft …" → "Für jede Liegenschaft der nächste Schritt", tag "Beispieldaten", rows `{ name, units, status, action, tone }`: "Lindenallee 12" "36 Einheiten" "Vertrag läuft bis 03/2029" "Vertrag übernehmen" `take`; "Gartenweg 3" "12 Einheiten" "Vertrag endet 12/2026" "Vertrag kündigen" `cancel`; "Am Stadtpark 7" "32 Einheiten" "Vertrag endet 08/2027" "Rechtzeitig kündigen" `cancel`; "Hofstraße 21" "18 Einheiten" "Heidi-Funkzähler aktiv" "Direkt abrechnen" `bill`. (The units are in the markup but hidden by the design's CSS; kept for the `sr-only` list.)
- `quotes`: H2 ["Verwaltungen arbeiten mit Heidi.", "Unsere Kunden sagen es selbst."], keys `vitolus`, `werne`, `gerhard` (the design's order).
- `picture`: label "Heidi", caption ["Pünktlich abgerechnet.", "Für jeden Eigentümer."].
- `faq`: title "Häufige Fragen":
  - "Wir verwalten Objekte für viele verschiedene Eigentümer. Geht das?" – "Ja. Heidi rechnet jedes Objekt einzeln ab, und im Dashboard sehen Sie die Verbräuche pro Liegenschaft."
  - "Lohnt sich das auch für kleine Objekte?" – "Ja. Abgerechnet wird pro tatsächlich installiertem Zähler plus Abrechnungspauschale."
  - "Was passiert beim Mieterwechsel?" – "Die Zählerstände zum Auszug liegen per Funk vor. Eine Zwischenablesung vor Ort ist nicht nötig."
  - "Was kostet Heidi?" – "Abgerechnet wird pro tatsächlich installiertem Zähler plus Abrechnungspauschale. Ab 1.000 Einheiten erstellen wir ein Angebot für Ihren Bestand."
  - "Müssen wir auf das Vertragsende warten?" – as `/hausverwaltung` ("Fristenrechner" plain text).
  - "Ist die monatliche Verbrauchsinformation inklusive?" – as `/hausverwaltung`, `more` "Mehr zur uVI".
- `closing`: H2 "Pünktlich abrechnen. Jedes Jahr.", text "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.", submit "Demo buchen".

`content.test.ts`: the H1 and word; every `href` a route or an anchor on the page; no empty or untrimmed text; four rows of two lines and two paragraphs; the list's four owners match the head "4 Eigentümer"; the bill's side-a rows are the list's Eigentümer A objects counted by the sum's `before`, the side-b rows the `after`; Eigentümer B's "1 Objekt · 6 Einheiten" is the bill's "Am Markt 7 · 6 WE"; twelve cells with the last in progress; the doc's value rows before the check row; the Portfolio-Checker's four rows with distinct names; the quotes word for word from `testimonials.ts`; six questions; `figures(now)` switches at `DEADLINE`.

## 1.3 The deadline figure

`deadlineFigure(now)` from `uv/deadlineFigure.ts`, as on `/hausverwaltung`. The expired text is still a placeholder (gate §4.4, shared with §4.5 and §4.7).

## 1.4 Images

| Use | Import | Notes |
|---|---|---|
| Hero left | `cities/muenchen/hero.jpg?enhanced` | `sizes="25vw"` |
| Hero right | `selbstabrechnung/beratung.webp?enhanced` | `sizes="35vw"`, `object-position: 58% 30%` |
| Bento | `mietverwaltung/apartment.webp?enhanced` (new, 1400×933, 74 KB) | cover |
| Portfolio-Checker | `cities/essen/hero.jpg`, `cities/muenchen/hero.jpg`, `vorgehen/facade.webp`, `cities/duesseldorf/hero.jpg` | 36×36, cover, `sizes="36px"`, lazy |
| "Was bringt der Wechsel?" | `cities/frankfurt/hero.jpg?enhanced` | |
| Picture | `vorgehen/building-wide.webp?enhanced` | |

All decorative (`alt=""`).

## 1.5 Link mapping

| Design link | Here |
|---|---|
| `44SBXKXJaSp6bvGMnbpZj6` ("Demo buchen" ×5, the video button, the floating CTA) | `DEMO_HREF` (`#start`, the closing form) |
| `#inhalt`, `#faq` (×4) | the same anchors |
| `5HTo3o7mYMjqUxPXcEyuEy` (row 4's "Mieterportal") | `ROUTE_MIETERPORTAL` |
| `JjGPJV7zurEwiwEMn4hJv9` (answer 6's "Mehr zur uVI") | `ROUTE_VERBRAUCHSINFORMATION` (`more`) |
| `LWEbZPCoSDLT1D59BaULyE` ("Zum Fristenrechner", answer 5's "Fristenrechner") | none: hidden / plain text (open question 2) |
| `S3p5jbNkohWnWeZpfR75j9` ("Zum Einsparrechner") | none: hidden (open question 2) |
| `Jp8tqY82m7FZqMnWU4z9x9` (banner) | `ROUTE_UPGRADE_NOW` (`DEFAULT_CHROME`) |
| The trust block's "Mehr zu Sicherheit" | `ROUTE_SICHERHEIT` (`TrustSeals`) |
