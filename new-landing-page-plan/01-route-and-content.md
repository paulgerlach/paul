# Phase 1: Route, links, content and the signup action

## 1.1 Route and links

In one commit:

- `ROUTE_INSTALLATIONSTOOL = "/installationstool"` in `$lib/routes.ts`, after `ROUTE_AUSWERTUNG` (the "Plattform" pages).
- The landing footer's "Installationstool" (`$lib/landing/footerLinks.ts`, group "Plattform") gets `href: ROUTE_INSTALLATIONSTOOL`.
- `/installationspartner`'s FAQ 3: `more: { text: "Mehr zum Installationstool", href: ROUTE_INSTALLATIONSTOOL }` (the comment "no page yet" goes); its `content.test.ts` and `e2e/installationspartner.e2e.ts` ("Mehr zum Installationstool waits for its page") change with it.
- `/neuigkeiten`'s story "Installationstool: …" gets `more: { text: "Mehr erfahren", href: ROUTE_INSTALLATIONSTOOL }` (the design's link text, in place of the comment); its `content.test.ts` ("has the design's link texts") and `e2e/neuigkeiten.e2e.ts` ("stories and rows link only where a page exists") change with it.
- `/vorgehen`'s feature card "Installationstool" gets `href: ROUTE_INSTALLATIONSTOOL` (the card renders as a link once it has one); its tests change where they list the cards' targets.
- `src/routes/(landing-page)/installationstool/+page.server.ts`:

```ts
seo: {
	// Drafts for the content owner (plan §4.4).
	title: "Heidi Installationstool: Zähler tauschen und digital dokumentieren | Heidi Systems",
	description:
		"Ein Link, ein digitaler Zwilling, zwei Fotos pro Zähler: Mit dem Heidi Installationstool ist jeder Zählertausch beim ersten Termin dokumentiert. Danach liest Heidi die Funkzähler aus der Ferne ab.",
	ogTitle: "Das Heidi Installationstool: Einmal in die Wohnung, dann nie wieder.",
	noindex: true,
	keepCanonical: true,
},
landing: DEFAULT_CHROME,
faq: faq.items,
finalForm: await emptySwitchForm("final"),
```

  The default action: `handleSwitchSignup(event, { source: "installationstool", page: ROUTE_INSTALLATIONSTOOL })`, as `/verbaende`. No `cache-control`.
- Sitemap: no entry until the cutover (gate §4.4).

## 1.2 Content module

`$lib/landing/pages/installationstool/content.ts`, word for word from the design, in the `uv` template's shapes (`$lib/landing/sections/uv/types.ts`):

- `demoLink` "Demo buchen" → `DEMO_HREF` (open question 1).
- `hero`: `srTitle` "Das Heidi Installationstool für Installateure", `word` "Installationstool", the lead, `primary` `demoLink`, `secondary` "Mehr erfahren" → `#inhalt`.
- `list`: label "Beispiel: Heidi Installationstool", brand "Heidi", nav (`tool` "Gebäude", `doc` "Fotos", `users` "Übergabe"), navFoot "Installationstool", head "Heidi Installationstool", tag "Beispieldaten", title "Lindenallee 12", sub "Digitaler Zwilling · Beispiel"; four entries (`home` "EG links" / "2 Heizkostenverteiler · 1 Wasserzähler" "Wird fotografiert" → "Digitalisiert"; `home` "EG rechts" / "3 Heizkostenverteiler · 1 Wasserzähler" "Offen" → "Digitalisiert"; `home` "1. OG links" / "2 Heizkostenverteiler · 2 Wasserzähler" "Offen" → "Digitalisiert"; `doc` "Übergabeprotokoll" / "Lindenallee 12" "Wird erstellt" → "Fertig").
- `statement`: label "Worum es geht", the text.
- `KPI`: `notice` 14, `window` "1–2 h" (no-break space), as `/installationspartner`'s (confirmed 2026-10-12).
- `rows`: label "So arbeitet Heidi", `primary` `demoLink`, `secondary` "Häufige Fragen" → `#faq`; four items (tag, the two-line title, two paragraphs, tile `phone` / `camera` / `calendar` / `bill`, tone `ink` / `ink` / `mint` / `mint`).
- `phone` (`PhoneTile`): "9:41", "Heidi", "Neuer Auftrag: Lindenallee 12", "Link öffnen und loslegen", label "Digitaler Zwilling", value "12 Wohnungen", comparisons ["Alle Zähler angelegt · Beispiel"].
- `camera`: time "9:41", app "Heidi", labels "Alter Zähler · Foto 1 von 2" / "Neuer Zähler · Foto 2 von 2", done "2. OG links digitalisiert", the new meter's reading "00047".
- `calendar` (`CalendarTile`): the twelve flats ("EG li", "EG re", "1. OG li" … "4. OG re", "DG li", "DG re"), current 8, done "digitalisiert", doing "in Arbeit", open "offen", noteDone "{x} digitalisiert", noteDoing "{x} in Arbeit".
- `bill` (`BillTile`): "Ohne Tool" / "Mit Heidi", the four rows, sum "Termine in der Wohnung" "mehrere" → "einer".
- `rotator`: label "Was Heidi übernimmt", lead "Mit dem Installationstool:", the four phrases, 2300 ms.
- `numbers`: H2 "Installation in Zahlen"; first "92" "%" (count 92); rest "2" (count 2), "1" (count 1), "14" "Tage" (count `KPI.notice`), "1–2 h" (compact).
- `audience`: label "Ihr Wechsel"; "Sie sind Verwalter?" (`demoLink`, image `building`), "Sie sind Installationsbetrieb?" ("Partner werden" → `ROUTE_INSTALLATIONSPARTNER`, image `installer`).
- `quotes`: the H2's two lines, keys `gerhard`, `werne`, `vitolus`.
- `picture`: label "Heidi", caption "Einmal installiert." / "Für immer digital.".
- `faq`: title "Häufige Fragen", six items; 5 with `more` "Installationspartner werden" → `ROUTE_INSTALLATIONSPARTNER`, 6 with `more` "Mehr zu Sicherheit" → `ROUTE_SICHERHEIT`.
- `closing`: H2 "Einmal in die Wohnung. Dann nie wieder.", text "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.", submitLabel "Demo buchen".

`content.test.ts`, modelled on `/verbaende`'s: the hero's texts; four rows with the design's tags and tile kinds; every `href` is a route or one of the page's anchors (`#start`, `#inhalt`, `#faq`); every "Demo buchen" leads to `#start`; the twelve flats and current 8; the list's four entries end "Digitalisiert" ×3, "Fertig"; the figures' counts equal their values and 14 / "1–2 h" equal `/installationspartner`'s `KPI`; the quotes' keys exist; six FAQ items, two `more` links; no empty, doubled-space or untrimmed text.

## 1.3 Pure logic

`$lib/landing/pages/installationstool/camera.ts`: the design's camera loop as data.

- `CAMERA_STEPS`: `{ at, state }[]` with the design's timeline (0 empty; 700 focus; 1500 focus, flash, thumb 1; 2100 thumb 1; 2600 photo 2, thumb 1; 3300 photo 2, focus, thumb 1; 4100 photo 2, focus, flash, thumbs 1–2; 4700 done, thumbs 1–2), `CAMERA_EVERY` 9500 ms.
- `CameraState`: `{ photo: 1 | 2 | 3; focus: boolean; flash: boolean; thumbs: 0 | 1 | 2 }` (the design's class sets `s2` / `s3`, `fx`, `fl`, `t1` / `t2`), `CAMERA_END` the last step's state.

`camera.test.ts`: the steps are in time order and before `CAMERA_EVERY`; the first state is empty, the last is `CAMERA_END` (photo 3, both thumbs, no focus, no flash); every flash comes with focus; the thumbs never go back within a pass.

## 1.4 Images

`src/lib/assets/landing/installationstool/facade.webp`: the design's bytes (1400×933). The other photos are the repo's (README). All rendered with `alt=""` (decorative), as the template does.
