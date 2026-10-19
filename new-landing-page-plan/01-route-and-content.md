# Phase 1: Route, links, content and SEO

## 1.1 Route and links

In one commit:

- `ROUTE_HAUSVERWALTUNG = "/hausverwaltung"` in `$lib/routes.ts`, after `ROUTE_SCHNITTSTELLEN`.
- The landing footer's "Hausverwaltung" (`$lib/landing/footerLinks.ts`, group "Kunden") gets `href: ROUTE_HAUSVERWALTUNG` (today plain text). Every landing page renders this footer. The site footer (`Footer/footerLinks.ts`) has no "Hausverwaltung" entry and stays as it is. The other "Kunden" entries (Mietverwaltung, WEG-Verwaltung, …) stay plain text until their pages exist.
- `src/routes/(landing-page)/hausverwaltung/+page.server.ts`, modelled on `verbrauchsinformation/+page.server.ts`:

```ts
export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title: "Messdienst für Hausverwaltungen: Zähler, Ablesung und Heizkostenabrechnung | Heidi Systems",
		description:
			"Heidi übernimmt für Hausverwaltungen Funkzähler, Fernablesung und Heizkostenabrechnung aus einer Hand. Ohne Ablesetermine, mit Verbrauchsinfo für Ihre Mieter und Daten direkt in Ihrer Software.",
		ogTitle: "Messdienst für Hausverwaltungen mit Heidi",
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
		handleSwitchSignup(event, {
			source: "hausverwaltung",
			page: ROUTE_HAUSVERWALTUNG,
		}),
};
```

  The page sets no `cache-control`, because the layout does. `leads.source` is free text, so the new source needs no migration; check that the Make.com `switchinquiry` scenario doesn't filter on known `page` values (gate §4.4).
- **Other links to the page.** Searched every saved design (all landing pages, the 26 city designs, the five segment siblings) for this design's id `EzsbDRGnCk2Z11QnjE3NgX`. Apart from the designs' nav ("Hausverwaltung · Verwaltung von Beständen jeder Größe") and footer, which the landing header doesn't have and the footer link covers, one link:
  - `pages/verbrauchsinformation/content.ts`: the audience card "Sie sind Verwalter?", cta "Erfahren Sie mehr" (no `href` until now: that page's open question 3) → `href: ROUTE_HAUSVERWALTUNG`. Its button now shows; `e2e/verbrauchsinformation.e2e.ts` asserted it's absent and changes to assert the link. The tenant card ("Zum Mieter-Check") stays without a button.
  - Not changed: `/mieterportal`'s "Sie sind Verwalter?" card (its design links it to the demo, as built).
- **Tests that see the change:** the footer-link specs (every internal footer link resolves) now include `/hausverwaltung`; `e2e/verbrauchsinformation.e2e.ts` (above).
- `+page.svelte`: `<main id="content" class="hv" {@attach reveal()}>` with `UvMain` around sections 1–10 in design order, `Trust` after it, and `FloatingCta` after `</main>`. The wrapper sets the reveal styles (`.rv`, the design's threshold 0.15) and the `#hs-css` H2 sizes, scoped as on `/verbrauchsinformation` (`section h2[id]` in the 621–1040 and ≤ 620 queries, except the rows, the audience cards and the closing card).
- Sitemap: no entry until the cutover (gate §4.4).

## 1.2 Content module

`$lib/landing/pages/hausverwaltung/content.ts` holds every text and the example data, word for word from the design, in the shapes the shared `uv` components take (02 §2.1). `NB` (non-breaking space) between figures and units ("92 %", "1–2 h") and after "§", as on the two built pages. Soft hyphens where the design has `&shy;`.

- `hero`: `srTitle` "Messdienst für Hausverwaltungen mit Heidi", `word` "Hausverwaltung", `lead` "Zähler, Ablesung und Heizkosten­abrechnung für Ihre Mietobjekte. Aus einer Hand." (soft hyphen), `primary` "Demo buchen" → `DEMO_HREF`, `secondary` "Mehr erfahren" → `#inhalt`. Photos: left `essen/hero.jpg`, right `vorgehen/consultation.webp` with `object-position: 64% 30%` (§1.4).
- `list` (the hero's middle panel, `uv/ListMock`): `label` "Beispiel: Heidi Dashboard", `brand` "Heidi", `nav` Liegenschaften (active, `building`) / Abrechnungen (`doc`) / Mieter (`users`), `navFoot` "Heidi Dashboard", `head` "24 Objekte", `tag` "Beispieldaten", `title` "Ihre Liegenschaften.", `sub` "Heizperiode 2025 · alle Objekte", four `entries` `{ icon: "building", title, sub, before: "Ablesung läuft", after: "Abrechnung fertig" }`: "Lindenallee 12" – "18 Einheiten · per Funk"; "Parkstraße 4" – "12 Einheiten · per Funk"; "Am Markt 7" – "26 Einheiten · per Funk"; "Gartenweg 21" – "9 Einheiten · per Funk".
- `statement`: label "Worum es geht", text "Als Hausverwaltung koordinieren Sie heute Ablesetermine, beantworten Fragen zur Abrechnung und tippen Werte ab. Heidi nimmt Ihnen das ab. Funkzähler statt Termine, Abrechnung per Klick, Daten direkt in Ihrer Software. Sie unterschreiben einmal, wir kümmern uns um den Rest."
- `rows`: label "So arbeitet Heidi", default CTAs "Demo buchen" → `DEMO_HREF` and "Häufige Fragen" → `#faq`, four items `{ tag, title: [a, b], paragraphs, tile, tone }`:
  - "Ablesung" / "Abgelesen." "Ohne Termin." / "Heidi verbaut Funkzähler und liest jede Wohnung aus der Ferne ab." + "Keine Ablesetermine, keine Zettel im Treppenhaus, keine fehlenden Werte." / `calendar`, mint.
  - "Abrechnung" / "Heizkosten­abrechnung." "Per Klick." (soft hyphen) / "Weil alle Verbräuche vorliegen, entsteht die Abrechnung nach HKVO für jede Einheit per Klick." + "Sie prüfen nur noch, was auffällt." / `doc`, stone.
  - "Mieter" / "Mieter informiert." "Automatisch." / "Heidi kündigt die Montage 14 Tage vorher an, mit einem Zeitfenster von 1 bis 2 Stunden." + "Danach bekommen Ihre Mieter jeden Monat ihre Verbrauchsinfo. Ihr Team hat damit keine Arbeit." / `phone`, ink.
  - "Software" / "Direkt in" "Ihrer Software." / "Verbrauchsdaten und Abrechnungen landen direkt in Ihrem ERP- oder CRM-System." + "Kein Abtippen, keine Exporte per E-Mail, keine doppelte Pflege." / `bill`, mint.
- `calendar` (the units grid, the shared `Calendar` tile): `months` "WE 01" … "WE 12" (the cells' labels; the field keeps its name, its doc comment says "cells"), `current: 11` (the design's `data-now`: WE 01–11 done, WE 12 in progress), `done` "per Funk", `doing` "wird abgelesen", `open` "offen", `noteDone` "{x} abgelesen", `noteDoing` "{x} wird abgelesen". End state: eleven ticked "per Funk", WE 12 dark "wird abgelesen", note "WE 12 wird abgelesen".
- `doc` (check rows, 02 §2.1): title "Heizkostenabrechnung 2025", sub "Lindenallee 12 · 18 Einheiten · Beispiel", rows (labels only, each with a tick) "Verbräuche aller Einheiten", "Kosten aus Ihren Rechnungen übernommen", "Verteilung nach HKVO", "CO₂-Kostenaufteilung", result "Abrechnung fertig".
- `phone` (appointment rows, no bars): time "9:41", app "Heidi", title "Montage Ihrer Funkzähler", sub "In 14 Tagen · Zeitfenster 1 bis 2 Stunden", label "Ihr Termin", value "Do, 9 bis 11 Uhr", `comparisons` ["14 Tage vorher angekündigt"], `details` Wohnung "2. OG links" / Geräte "Heizung, Wasser" / Dauer "1 bis 2 Stunden".
- `bill` (text values): `without` "Heute", `with` "Mit Heidi", rows `[{ kind: "cut", label: "Ablesewerte als PDF", value: "manuell" }, { kind: "cut", label: "Werte ins ERP abtippen", value: "manuell" }, { kind: "ok", label: "Verbräuche automatisch im ERP" }, { kind: "ok", label: "Abrechnung als Datensatz" }, { kind: "base", label: "Liegenschaften", value: "24" }]`, `sum` `{ label: "Doppelte Pflege", before: "ja", after: "nein" }`.
- `rotator`: label "Was Heidi übernimmt", lead "Heidi übernimmt:", phrases "Zähler und Montage", "Ablesung per Funk", "Heizkostenabrechnung", "Verbrauchsinfo für Mieter", 2300 ms.
- `numbers`: H2 "Heidi in Zahlen"; `first` 92 "%" "der Montagen gelingen beim ersten Termin" (count); the photo second (alt ""); `rest`: 14 "Tage" "vorher informieren wir Ihre Mieter über die Montage" (count); "1–2 h" compact "Zeitfenster für Ihre Mieter am Montagetag"; 1 "fester Ansprechpartner für Ihren ganzen Bestand" (count); `null` for the deadline figure (§1.3).
- `audience`: label "Ihr Wechsel"; "Ihr Vertrag läuft noch?" / "Heidi übernimmt Ihre bestehenden Zähler sofort. Mit dem Fristenrechner sehen Sie, bis wann Sie beim bisherigen Messdienst kündigen müssen." / cta "Zum Fristenrechner" without `href` / image `facade-white`; "Was bringt der Wechsel?" / "Rechnen Sie mit Ihren eigenen Zahlen: wie viel Arbeitszeit Heidi Ihrem Team abnimmt und welches Kürzungsrisiko Sie vermeiden." / cta "Zum Einsparrechner" without `href` / image `berlin` (open question 3).
- `quotes`: H2 ["Hausverwaltungen arbeiten mit Heidi.", "Unsere Kunden sagen es selbst."], keys `werne`, `vitolus`, `gerhard` (the design's order; quotes, names, roles and initials match `$lib/landing/data/testimonials.ts`, checked in `content.test.ts`).
- `picture`: label "Heidi", caption ["Ihre Objekte.", "Unser Aufwand."].
- `faq`: title "Häufige Fragen", six `FaqItem`s:
  - "Wir verwalten viele kleine Objekte. Lohnt sich das?" – "Ja. Heidi rechnet jedes Objekt einzeln ab. Abgerechnet wird pro tatsächlich installiertem Zähler."
  - "Was ist mit Objekten, deren Vertrag noch läuft?" – "Heidi übernimmt bestehende Zähler und wertet sie sofort aus, unabhängig davon, wie lange der bisherige Vertrag noch läuft."
  - "Welche Software können wir anbinden?" – `Heidi übergibt Verbrauchsdaten und Abrechnungen an Ihr ERP- oder CRM-System. Welche Systeme wir anbinden, sehen Sie unter <a href="${ROUTE_SCHNITTSTELLEN}">Schnittstellen</a>.`
  - "Was kostet Heidi?" – "Abgerechnet wird pro tatsächlich installiertem Zähler plus Abrechnungspauschale. Ab 1.000 Einheiten erstellen wir ein Angebot für Ihren Bestand."
  - "Müssen wir auf das Vertragsende warten?" – "Nein. Heidi übernimmt bestehende Zähler und wertet sie sofort aus, egal wie lange Ihr aktueller Vertrag noch läuft. Bis wann Sie kündigen müssen, zeigt der Fristenrechner." ("Fristenrechner" plain text, open question 3)
  - "Ist die monatliche Verbrauchsinformation inklusive?" – "Ja. Heidi stellt Ihren Mietern die unterjährige Verbrauchsinformation jeden Monat automatisch bereit, so wie es § 6a HeizkostenV verlangt." `more` "Mehr zur uVI" → `ROUTE_VERBRAUCHSINFORMATION`.
- `closing`: H2 "Ihr Bestand. Unser Messdienst.", text "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.", `submitLabel` "Demo buchen".

`content.test.ts`:
- the H1's hidden text and the word; four rows with two title lines and two paragraphs each; six questions, none empty; every `href` is a route constant or an anchor that exists on the page (`#inhalt`, `#faq`, `#start`);
- the example data agree: the list shows four of its "24 Objekte", the bill's "Liegenschaften 24" is the list's head; the doc's "Lindenallee 12 · 18 Einheiten" is the list's first entry; the grid has twelve cells and `current` is the last; the phone's "14 Tage" and "1 bis 2 Stunden" match row 3's text and the figures (14, "1–2 h"); the bill's `cut` rows come before its `ok` rows;
- the quotes: `werne`, `vitolus`, `gerhard` exist in `testimonials.ts` and their text is the design's;
- `figures(now)` returns the current deadline figure before `DEADLINE` and the expired one from it on.

## 1.3 The deadline figure

The bento's last figure, "31.12.2026" / "Bis dahin müssen alle Zähler fernablesbar sein", is the same on `/verbrauchsinformation` and in both sibling designs. It moves from `/verbrauchsinformation`'s content into `uv/deadlineFigure.ts` (02 §2.1):

```ts
/** The retrofit deadline's figure for `now`: the date, or (placeholder) the expired text. */
export function deadlineFigure(now: number): Figure;
```

with the current figure and the expired placeholder (value "1.1.2027", text "Seitdem müssen alle Zähler fernablesbar sein") as today. Each page's `figures(now)` fills its `null` slot with it. The expired text is still a placeholder until the content owner writes it (gate §4.4; the same text on `/verbrauchsinformation`, §4.6). Nothing else on this page depends on `now` (the FAQ has no date).

## 1.4 Images

Imported from where they are (no copies), as `/verbrauchsinformation` imports from `vorgehen/` and the city folders:

| Use | Import | Notes |
|---|---|---|
| Hero left | `$lib/assets/landing/cities/essen/hero.jpg?enhanced` | `sizes="25vw"`, eager (above the fold, but hidden ≤ 620 px) |
| Hero right | `$lib/assets/landing/vorgehen/consultation.webp?enhanced` | `sizes="35vw"`, `object-position: 64% 30%` (the design's) |
| Bento | `$lib/assets/landing/vorgehen/kitchen-meters.webp?enhanced` | cover |
| "Ihr Vertrag läuft noch?" | `$lib/assets/landing/mieterportal/facade-white.webp?enhanced` | |
| "Was bringt der Wechsel?" | `$lib/assets/landing/cities/berlin/references.jpg?enhanced` | |
| Picture | `$lib/assets/landing/mieterportal/building.webp?enhanced` | |

All decorative (`alt=""`), as in the design.

## 1.5 Link mapping

| Design link | Here |
|---|---|
| `44SBXKXJaSp6bvGMnbpZj6` ("Demo buchen" ×5, the video button, the floating CTA "Erstgespräch vereinbaren") | `DEMO_HREF` (`#start`, the closing form); the floating CTA as on the other pages |
| `#inhalt` ("Mehr erfahren"), `#faq` ("Häufige Fragen" ×4) | the same anchors |
| `KE95icU8eKWX7TNfLerbSZ` (answer 3's "Schnittstellen") | `ROUTE_SCHNITTSTELLEN` |
| `JjGPJV7zurEwiwEMn4hJv9` (answer 6's "Mehr zur uVI") | `ROUTE_VERBRAUCHSINFORMATION` (as the answer's `more`) |
| `LWEbZPCoSDLT1D59BaULyE` ("Zum Fristenrechner", answer 5's "Fristenrechner") | none: button hidden, plain text (open question 3) |
| `S3p5jbNkohWnWeZpfR75j9` ("Zum Einsparrechner") | none: button hidden (open question 3) |
| `Jp8tqY82m7FZqMnWU4z9x9` (banner "Mehr erfahren") | `ROUTE_UPGRADE_NOW` (through `DEFAULT_CHROME.bannerHref`) |
| The trust block's "Mehr zu Sicherheit" | `ROUTE_SICHERHEIT` (the shared `TrustSeals`) |
| `#` / this design in the nav ("Hausverwaltung") | the footer's "Hausverwaltung" → this page; the landing header has no such item |
| Logo, nav, the design's footer | the shared landing header and footer |
