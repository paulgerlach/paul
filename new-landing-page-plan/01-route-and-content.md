# Phase 1: Route, links, content and SEO

## 1.1 Route and links

In one commit (after the template commit of 02 §2.1, since the content uses its new shapes):

- `ROUTE_WEG_VERWALTUNG = "/weg-verwaltung"` in `$lib/routes.ts`, after `ROUTE_MIETVERWALTUNG`.
- The landing footer's "WEG-Verwaltung" (`$lib/landing/footerLinks.ts`, group "Kunden") gets `href: ROUTE_WEG_VERWALTUNG`. The other "Kunden" entries without a page stay plain text.
- `src/routes/(landing-page)/weg-verwaltung/+page.server.ts`, a copy of `hausverwaltung/+page.server.ts`:

```ts
export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title: "Heizkostenabrechnung für WEG-Verwaltungen: rechtzeitig vor der ETV | Heidi Systems",
		description:
			"Heidi liefert WEG-Verwaltungen die Heizkostenabrechnung rechtzeitig vor der Eigentümerversammlung, nachvollziehbar für jede Einheit. Der Wechsel des Messdienstes passt zur ETV, mit einer Vollmacht statt vieler Termine.",
		ogTitle: "Heizkostenabrechnung für WEG-Verwaltungen mit Heidi",
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
		handleSwitchSignup(event, { source: "weg-verwaltung", page: ROUTE_WEG_VERWALTUNG }),
};
```

  No `cache-control` (the layout sets it). `leads.source` is free text: no migration.
- **Other links to the page:** none. Searched every saved design (landing pages, cities, segment siblings) for `WorTAiGvpRbkiEg1Lee25D`: the designs' nav and footer, and the segment tabs of the Wohnungsunternehmen and Asset-Manager designs (not built).
- **Tests that see the change:** the footer-link specs (every internal footer link resolves) now include `/weg-verwaltung`.
- `+page.svelte`: `<main id="content" class="wv" {@attach reveal()}>` with `UvMain` around sections 1–10, `Trust` after it, `FloatingCta` after `</main>`; reveal styles and the `#hs-css` H2 sizes as on `/hausverwaltung`.
- Sitemap: no entry until the cutover (gate §4.4).

## 1.2 Content module

`$lib/landing/pages/weg-verwaltung/content.ts`, word for word from the design, in the `uv` shapes. `NB` between figures and units, after "§". Soft hyphens where the design has `&shy;`.

- `hero`: `srTitle` "Heizkostenabrechnung für WEG-Verwaltungen mit Heidi", `word` "WEG‑Verwaltung" (U+2011, the design's `&#8209;`, so the word never breaks), `lead` "Heizkosten­abrechnung für Eigentümer­gemeinschaften. Rechtzeitig vor der ETV." (two soft hyphens), `primary` "Demo buchen" → `DEMO_HREF`, `secondary` "Mehr erfahren" → `#inhalt`. Photos: left `vorgehen/facade.webp`, right the new `weg-verwaltung/manager.webp` with `object-position: 58% 30%`.
- `list` (`uv/ListMock`): label "Beispiel: Heidi Dashboard", brand "Heidi", nav Gemeinschaften (active, `users`) / Abrechnungen (`doc`) / Eigentümer (`users`), navFoot "Heidi Dashboard", head "4 Gemeinschaften", tag "Beispieldaten", title "Ihre Gemeinschaften.", sub "Wirtschaftsjahr 2025", entries `{ icon: "users", before: "Abrechnung offen", after: "Vor ETV fertig" }`: "WEG Lindenallee 12" – "18 Einheiten · ETV im Mai"; "WEG Parkstraße 4" – "12 Einheiten · ETV im Juni"; "WEG Am Markt 7" – "26 Einheiten · ETV im April"; "WEG Gartenweg 21" – "9 Einheiten · ETV im Mai".
- `statement`: label "Worum es geht", text "Für WEG-Verwaltungen zählt Planbarkeit. Ein Wechsel, der zur Eigentümerversammlung passt. Eine Heizkostenabrechnung, die rechtzeitig vor der ETV vorliegt und die Eigentümer nachvollziehen können. Und eine Vollmacht statt vieler Unterschriften."
- `rows`: label "So arbeitet Heidi", CTAs "Demo buchen" / "Häufige Fragen" → `#faq`:
  - "ETV" / "Passend zur" "Eigentümer­versammlung." / "Vertragsende, Kündigungsfrist und Eigentümerversammlung auf einer Zeitleiste." + "So beschließen Sie den Wechsel rechtzeitig und nicht erst, wenn sich der Vertrag schon verlängert hat." / `calendar`, stone.
  - "Vollmacht" / "Eine Vollmacht." "Statt vieler Termine." / "Nach dem Beschluss genügt eine Unterschrift der Verwaltung." + "Heidi kündigt beim bisherigen Messdienst, plant die Montage und informiert die Bewohner." / `bill`, mint.
  - "Abrechnung" / "Nachvollziehbar." "Für jede Einheit." / "Heidi verteilt die Heizkosten nach HKVO: einen Teil nach Fläche, 50 bis 70 % nach Verbrauch." + "Jede Einheit bekommt eine Abrechnung, die Eigentümer und Mieter verstehen." / `doc`, stone.
  - "Eigentümer" / "Transparenz für" "alle Eigentümer." / "Selbstnutzer und Mieter sehen ihren Verbrauch jeden Monat im Portal." + "Die Verwaltung sieht alle Einheiten im Dashboard. Fragen in der ETV beantworten Sie mit Zahlen." / `phone`, ink.
- `calendar` (02 §2.1): months "Jan" … "Dez", `current: 11`, open "offen", `cells`: placeholders except three milestones, Mai `{ label: "ETV", note: "Mai: ETV beschließt den Wechsel" }`, Sep `{ label: "Kündigung", note: "Sep: Heidi kündigt per Vollmacht" }`, Dez `{ label: "Vertragsende", note: "Dez: Heidi übernimmt" }`. No `done` / `doing` / notes of its own (the design's are empty). End state: Jan–Nov done (Mai and Sep lime with their labels, the others without tick or label), Dez current "Vertragsende", note "Dez: Heidi übernimmt".
- `bill` (before/after, text values): without "Ohne Heidi", with "Mit Heidi", rows `cut` "Kündigung und Fristen prüfen" "Sie", `cut` "Montage mit Bewohnern abstimmen" "Sie", `ok` "Vollmacht unterschreiben" (tick), `ok` "Kündigung, Montage, Information" "Heidi" (02 §2.1), sum "Ihr Aufwand" "hoch" → "eine Unterschrift".
- `doc` (bar rows and check rows): title "Kostenverteilung 2025", sub "WEG Lindenallee 12 · Beispiel", rows Grundkosten "30 %" (bar 30), Verbrauchskosten "70 %" (bar 70), "Verteilschlüssel nach Beschluss" (tick), "Pflichtangaben nach HKVO" (tick), result "Rechtzeitig vor der ETV".
- `phone` (bars): time "9:41", app "Heidi", title "Ihre Verbrauchsinfo September", sub "WEG Lindenallee 12 · Einheit 7", label "Heizung im September", value "96 kWh", comparisons ["Vergleich zum Vormonat"], bars 162, 171, 150, 118, 61, 19, 12, 14, 74, 96.
- `rotator`: label "Was Heidi übernimmt", lead "Heidi übernimmt:", phrases "Kündigung per Vollmacht", "Montage und Ablesung", "Abrechnung vor der ETV", "Verbrauchsinfo für alle Einheiten", 2300 ms.
- `numbers`: as on `/hausverwaltung` (92 %, the photo, 14 Tage, "1–2 h", 1, the deadline figure), the photo `vorgehen/kitchen-meters.webp`.
- `audience`: label "Ihr Wechsel"; "Wann muss die WEG kündigen?" – "Mit dem Fristenrechner sehen Sie, bis wann gekündigt werden muss. So planen Sie den Beschluss in der richtigen ETV." (cta "Zum Fristenrechner" without `href`, image `mieterportal/building.webp`); "Muster-Kündigung für den Messdienst" – "Die Vorlage für den bisherigen Anbieter. Oder Heidi kündigt für Sie per Vollmacht." (cta "Zur Muster-Kündigung" without `href`, image `cities/berlin/references.jpg`).
- `quotes`: H2 ["Verwaltungen arbeiten mit Heidi.", "Unsere Kunden sagen es selbst."], keys `werne`, `vitolus`, `gerhard` (the design's order).
- `picture`: label "Heidi", caption ["Ruhige ETV.", "Klare Zahlen."], photo `mieterportal/facade-white.webp`.
- `faq`: title "Häufige Fragen":
  - "Braucht es einen Beschluss der Eigentümer?" – "Für den Wechsel des Messdienstes sollte ein Beschluss oder eine Vollmacht vorliegen. Mit dem Fristenrechner sehen Sie, welche ETV rechtzeitig vor dem Vertragsende liegt."
  - "Können wir mitten in der Laufzeit wechseln?" – "Heidi übernimmt bestehende Zähler und wertet sie sofort aus, auch bei laufendem Vertrag. Die Kündigung beim bisherigen Anbieter erledigen wir per Vollmacht."
  - "Wie werden die Heizkosten verteilt?" – "Nach Heizkostenverordnung wird ein Teil der Kosten nach Fläche verteilt und 50 bis 70 % nach Verbrauch. Den genauen Schlüssel legt die Gemeinschaft fest."
  - "Was kostet Heidi?" – as `/hausverwaltung`.
  - "Müssen wir auf das Vertragsende warten?" – as `/hausverwaltung` ("Fristenrechner" plain text).
  - "Ist die monatliche Verbrauchsinformation inklusive?" – as `/hausverwaltung`, `more` "Mehr zur uVI".
- `closing`: H2 "Planbar wechseln. Vor der nächsten ETV.", text "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.", submit "Demo buchen".

`content.test.ts`: the H1 and word; every `href` a route or an anchor on the page; no empty or untrimmed text; four rows of two lines and two paragraphs; the list's four WEGs match the head "4 Gemeinschaften" and are `/hausverwaltung`'s buildings with the same unit counts; the doc's building is the list's first; the year grid has twelve months, the current one the last, and every milestone with a label and a note naming its month; the ETV milestone's month is the first WEG's "ETV im Mai"; the doc's bar shares add up to 100 and match their values, the consumption share within the "50 bis 70 %" of the row and the FAQ; the bill switches both manual rows for Heidi's; the quotes word for word from `testimonials.ts`; six questions; `figures(now)` switches at `DEADLINE`.

## 1.3 The deadline figure

`deadlineFigure(now)` from `uv/deadlineFigure.ts`, as on `/hausverwaltung`. The expired text is still a placeholder (gate §4.4, shared with §4.5, §4.6 and §4.8).

## 1.4 Images

| Use | Import | Notes |
|---|---|---|
| Hero left | `vorgehen/facade.webp?enhanced` | `sizes="25vw"` |
| Hero right | `weg-verwaltung/manager.webp?enhanced` (new, 1448×1086, 85 KB) | `sizes="35vw"`, `object-position: 58% 30%` |
| Bento | `vorgehen/kitchen-meters.webp?enhanced` | cover |
| "Wann muss die WEG kündigen?" | `mieterportal/building.webp?enhanced` | |
| "Muster-Kündigung" | `cities/berlin/references.jpg?enhanced` | |
| Picture | `mieterportal/facade-white.webp?enhanced` | |

All decorative (`alt=""`).

## 1.5 Link mapping

| Design link | Here |
|---|---|
| `44SBXKXJaSp6bvGMnbpZj6` ("Demo buchen" ×5, the video button, the floating CTA) | `DEMO_HREF` (`#start`, the closing form) |
| `#inhalt`, `#faq` (×4) | the same anchors |
| `LWEbZPCoSDLT1D59BaULyE` ("Zum Fristenrechner", answer 5's "Fristenrechner") | none: hidden / plain text (open question 2) |
| `4WYU5hjVsWSLrxuo7wsdm6` ("Zur Muster-Kündigung") | none: hidden (open question 2) |
| `JjGPJV7zurEwiwEMn4hJv9` (answer 6's "Mehr zur uVI") | `ROUTE_VERBRAUCHSINFORMATION` (`more`) |
| `Jp8tqY82m7FZqMnWU4z9x9` (banner) | `ROUTE_UPGRADE_NOW` (`DEFAULT_CHROME`) |
| The trust block's "Mehr zu Sicherheit" | `ROUTE_SICHERHEIT` (`TrustSeals`) |
