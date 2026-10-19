# Phase 1: Route, links, content and SEO

## 1.1 Route and links

In one commit:

- `ROUTE_PRESSE = "/presse"` in `$lib/routes.ts`, after `ROUTE_EINSPARRECHNER`.
- The landing footer's "Presse" (`$lib/landing/footerLinks.ts`, group "Ressourcen") gets `href: ROUTE_PRESSE`.
- **Other links to the page** (README, Links): none; no built page names the press design.
- `src/routes/(landing-page)/presse/+page.server.ts`, as `/einsparrechner`'s:

```ts
seo: {
	// Drafts for the content owner (plan §4.4).
	title: "Presse: Kontakt, Media Kit und Fakten | Heidi Systems",
	description:
		"Pressekontakt, Logos, Unternehmensprofil und die wichtigsten Fakten zu Heidi Systems, dem digitalen Messdienst aus Berlin für Hausverwaltungen in ganz Deutschland.",
	ogTitle: "Hallo, Presse.",
	noindex: true,
	keepCanonical: true,
},
landing: DEFAULT_CHROME,
finalForm: await emptySwitchForm("final"),
```

  and `handleSwitchSignup(event, { source: "presse", page: ROUTE_PRESSE })`. No `cache-control`.
- Sitemap: no entry until the cutover (gate §4.4).

## 1.2 Content module

`$lib/landing/pages/presse/content.ts`, word for word from the design:

- `PRESS_EMAIL = "presse@heidisystems.com"`.
- `hero`: H1 "Hallo," + accent "Presse." (a line break between), lead "Heidi Systems ist ein Messdienst aus Berlin. Wir digitalisieren die Heizkostenabrechnung für Hausverwaltungen in ganz Deutschland: mit eigenen Funkzählern, einem persönlichen Ansprechpartner und einer Abrechnung per Klick. Hier finden Sie alles für Ihre Berichterstattung."
- `contact`: tag "Sag Hallo", H2 "Sprechen Sie mit uns.", text "Interviews, Hintergrundgespräche, Zahlen und Bilder: Wir melden uns schnell und persönlich.", the label "Presseanfragen", the CTA "Gespräch vereinbaren" → `DEMO_HREF` (design id `44SBXKXJaSp6bvGMnbpZj6`).
- `kit`: tag "Media Kit", H2 "Material für Ihre Berichterstattung.", text "Logo, Bildmarke und Unternehmensprofil, sofort nutzbar.", four `downloads` `{ title, note, file }`: "Heidi Logo, dunkel" / "SVG · für helle Hintergründe" / `Heidi-Logo-dunkel.svg`; "Heidi Logo, hell" / "SVG · für dunkle Hintergründe" / `Heidi-Logo-hell.svg`; "Bildmarke" / "SVG · der Röhrenheizkörper" / `Heidi-Bildmarke.svg`; "Unternehmensprofil" / "TXT · Kurztext und Fakten" / `Heidi-Systems-Unternehmensprofil.txt`; `DOWNLOAD_BASE = "/landing/presse/"`; the message template "Gespeichert: ".
- `name`: H2 "Name und Logo.", the big line ("Hei" accent, "zungen ", "di" accent, "gitalisieren."), the text "Der Name Heidi ist eine Abkürzung und zugleich unser Auftrag: Heizungen digitalisieren. Das Logo zeigt einen alten Röhrenheizkörper. Er steht für den Bestand, den wir modernisieren, ohne dass jemand umbauen muss.", the mark's label "Röhrenheizkörper".
- `facts`: H2 "Heidi auf einen Blick.", six tiles `{ label, value, count?, unit?, text }`: "Unternehmen" "Heidi Systems GmbH" "Monbijouplatz 4, 10178 Berlin"; "Leistung" "Messdienst" "Funkzähler, Ablesung, monatliche Verbrauchsinfo und Heizkostenabrechnung aus einer Hand"; "Montage" 92 "%" "der Montagen gelingen beim ersten Termin"; "Mieter" 14 "Tage" "vorher über die Montage informiert, mit 1 bis 2 Stunden Zeitfenster"; "Daten" "Deutschland" "Verarbeitung nach DSGVO und BDSG, gespeichert auf Servern in Deutschland"; "Netzwerk" "VDIV · DEUMESS · bved" "Kooperationspartner des VDIV, vernetzt in den Verbänden DEUMESS und bved".
- `boilerplate`: H2 "Über Heidi Systems.", the button "Text kopieren" / "Kopiert", the status "Text kopiert", the text "Die Heidi Systems GmbH mit Sitz in Berlin ist ein digitaler Messdienst … Der Name steht für „Heizungen digitalisieren“."
- `pressContact`: tag "Pressekontakt", H2 "Für Interviews, Material und Anfragen.", the address lines "Heidi Systems GmbH" / "Monbijouplatz 4, 10178 Berlin", the CTA "E-Mail senden" → `mailto:` + `PRESS_EMAIL`.
- `closing`: H2 "Heidi live erleben?", text "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands." (the same as `/einsparrechner`'s), submit label "Demo buchen".

`content.test.ts`: the H1; four downloads with unique files, each in `static/landing/presse/`; the profile's paragraph equal to the boilerplate, its title line "Heidi Systems GmbH: Unternehmensprofil", its facts naming "92 %", "14 Tage", VDIV, DEUMESS and bved as the tiles do; the logo files' path data equal to `HeidiLogo.svelte`'s; six facts with the two counted ones; the company and street equal to `ADDRESS` (written out); every `href` a route, `#start` or the `mailto:`; no empty or untrimmed text; the closing text equal to `/einsparrechner`'s.

## 1.3 Pure logic

None: the page has no calculation. The download message and the copy state are a few lines in their components.

## 1.4 Images and files

- The press card's photo is `vorgehen/building-wide.webp` (README table), rendered with `Image` (`?enhanced`, `sizes` for the card's column, lazy).
- **New:** `static/landing/presse/` with the four download files, byte for byte the design's `F` data (the SVGs with their `fill`s `#1E322D` / `#FFFFFF`, the TXT in UTF-8 with its trailing newline).
