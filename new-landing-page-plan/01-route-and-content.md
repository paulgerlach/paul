# Phase 1: Route, links, content and the pure logic

## 1.1 Route and links

In one commit:

- `ROUTE_API_DOKUMENTATION = "/api-dokumentation"` in `$lib/routes.ts`, after `ROUTE_SOFTWAREPARTNER`.
- The landing footer's "API-Dokumentation" (`$lib/landing/footerLinks.ts`, `companyLinks`) gets `href: ROUTE_API_DOKUMENTATION`.
- `/softwarepartner`'s hero: `secondary: { text: "API-Dokumentation", href: ROUTE_API_DOKUMENTATION }` (the `uv` hero renders the second button once it has an `href`); its `content.test.ts` and `e2e/softwarepartner.e2e.ts` ("API-Dokumentation waits for its page") change with it.
- `/partnerschaften`: row 1's second paragraph `["Nach bved-Standard oder über die ", { text: "Heidi API", href: ROUTE_API_DOKUMENTATION }, "."]` (the `uv` rows' `Inline[]`), FAQ 3's answer `In der <a href="${ROUTE_API_DOKUMENTATION}">API-Dokumentation</a>. …`; its `content.test.ts` and `e2e/partnerschaften.e2e.ts` ("Heidi API and API-Dokumentation wait for their page") change with them.
- `/neuigkeiten`'s story "Heidi API: Die Dokumentation für Softwarepartner" gets `more: { text: "Zur API-Dokumentation", href: ROUTE_API_DOKUMENTATION }` (the design's link text, in place of the comment "no page yet"); its `content.test.ts` ("has the design's link texts") and `e2e/neuigkeiten.e2e.ts` ("stories and rows link only where a page exists") change with it.
- `src/routes/(landing-page)/api-dokumentation/+page.server.ts`:

```ts
seo: {
	// Drafts for the content owner (plan §4.4).
	title: "API-Dokumentation: Verbrauchsdaten nach bved-Standard | Heidi Systems",
	description:
		"Die Heidi-Schnittstelle nach bved-Standard: Verbrauchsdaten für die unterjährige Verbrauchsinformation, Nutzerwechsel und Dokumente per Webservice in Ihrer ERP- oder Verwaltungssoftware. Mit Schnellstart, Authentifizierung, Endpunkten und Statuscodes.",
	ogTitle: "Verbrauchsdaten direkt in Ihre Software. Nach bved-Standard.",
	noindex: true,
	keepCanonical: true,
},
// No signup form here: the nav CTA goes to /messdienstwechsel's (open question 1).
landing: { ...DEFAULT_CHROME, ctaHref: ROUTE_MESSDIENSTWECHSEL },
```

  No action, no form. No `cache-control`.
- Sitemap: no entry until the cutover (gate §4.4).

## 1.2 Content module

`$lib/landing/pages/api-dokumentation/content.ts`, word for word from the design. Texts with inline code or bold runs are `Rich` (`(string | { code: string } | { b: string })[]`), rendered by `Rich.svelte`.

- `MANAGER_SIGNUP_HREF` = `/messdienstwechsel#start` (open question 1), `PARTNER_HREF` = `ROUTE_SOFTWAREPARTNER`.
- `hero`: pill "API-Dokumentation" (`rack`), `h1` "Verbrauchsdaten direkt in Ihre Software." with the accent "Nach bved-Standard.", the lead "Heidi stellt Verbrauchsdaten, Nutzerwechsel und Dokumente über Webservices nach den Spezifikationen des bved bereit. Ihre ERP- oder Verwaltungssoftware ruft die Daten ab, ohne Dateiversand und ohne doppelte Pflege.", `primary` "Schnellstart" → `#schnellstart`, `secondary` "Softwarepartner werden" → `PARTNER_HREF`, `ticks` "bved-konform", "JSON über HTTPS", "Hosting in Deutschland".
- `terminal`: title "consumption-data · v1"; nine lines as tokens (`m` method, `v` value, `c` comment, `st` status, `k` key, `s` string, plain): `GET /billingunits/123456789/consumptions/periods`, `Authorization: Basic ••••••••`, `200 OK · application/json`, then the five JSON lines with the design's indentation.
- `docs`: the section's name "Dokumentation", the table of contents' name "Inhalt der Dokumentation" and its three groups ("Einführung": Überblick, Schnellstart, Authentifizierung, Basis-URL und Versionen; "Webservices": Verbrauchsdaten (uVI), Nutzerwechsel, Dokumente, Datenaustausch V 3.10; "Referenz": Statuscodes, Versionen, Zugang anfragen), each entry `{ id, text }`; `note`: "Entwurf." and "Diese Dokumentation beschreibt die geplante Heidi-Schnittstelle auf Basis der veröffentlichten bved-Spezifikationen. Basis-URL und Beispielwerte sind Platzhalter. Verbindlich sind die Zugangsdaten und Details, die Sie von Ihrem persönlichen Ansprechpartner erhalten."
- `overview`: H2 "Überblick", the text; two roles ("Heidi Systems" / "Messdienstleister (MSC). Stellt den Server bereit und liefert die Daten.", `rack`; "Ihre Software" / "Verwaltung oder ERP (PM). Ruft die Daten als Client ab oder übermittelt Wechsel.", `building`); four services (`consumption-data` "Monatliche Verbrauchsdaten je Nutzeinheit für die unterjährige Verbrauchsinformation." `v1.2.1` → `#verbrauch`, `bars`; `on-site-roles` "Tagesaktuelle Übermittlung von Nutzer- und Bewohnerwechseln an Heidi." `v2.0` → `#wechsel`, `swap`; `documents` "Abrechnungen und weitere Dokumente automatisiert hoch- und herunterladen." `v1.3` → `#dokumente`, `doc`; `Datenaustausch` "Dateibasierter Austausch für die Heizkostenabrechnung." `V 3.10` → `#datei`, `list`).
- `quickStart`: H2 "Schnellstart", three steps ("Zugang anfragen" …, "Zugangsdaten erhalten" …, "Ersten Abruf senden" …), the code block "cURL" with the design's three lines (the trailing backslashes kept).
- `auth`: H2 "Authentifizierung", the text (`Rich`: `Authorization`, `accept: application/json`), the table head "Verfahren" / "Header" / "Hinweis" and its two rows.
- `baseUrl`: H2 "Basis-URL und Versionen", the text, the code block "Basis-URL" with the badge "Platzhalter" and `https://api.heidisystems.example/bved/consumptions/v1`, the three list items (`Rich`, with the design's `z. B.` and its no-break space).
- `consumption`: H2 "Verbrauchsdaten (uVI)", version "consumption-data 1.2.1", the text; two endpoints (`ep-periods`, `ep-period`): method "GET", path, text, the parameter table ("Parameter" / "Ort" / "Beschreibung"; "Pflicht"), for the first the answer "Antwort" `200` with the design's JSON and the field table ("Feld" / "Typ" / "Beschreibung", four rows), for the second the four list items and the small line "Das vollständige Feldschema ergänzen wir in der finalen Fassung dieser Dokumentation."
- `userChange`: H2 "Nutzerwechsel", version "on-site-roles 2.0", the text, the direction "Ihre Software" → "Heidi", the small line.
- `documents`: H2 "Dokumente", version "documents 1.3", the text, three list items, the small line.
- `fileExchange`: H2 "Datenaustausch V 3.10", version "Dateiformat", the text, the small line.
- `status`: H2 "Statuscodes", the text, the head "Code" / "Bedeutung", seven rows with their tone (`ok` 200, plain 400, 401, 404, "405 / 501", `er` 500, 503).
- `versions`: H2 "Versionen", the head "Webservice" / "Version" / "Änderungen", five rows; the source line "Grundlage:" with "bved-Spezifikationen" → `https://bved.info/datenaustauschalt/spezifikationen/`.
- `access`: H2 "Zugang anfragen", the text, "Erstgespräch vereinbaren" → `MANAGER_SIGNUP_HREF`, "Softwarepartner werden" → `PARTNER_HREF`.
- `copy`: "Kopieren", "Kopiert", the polite line "Code kopiert", the code frames' name "Codebeispiel: {label}" and the tables' "Tabelle: {H2}".

`content.test.ts`: the H1's two texts; the table of contents lists every article once, in the article order, with the ids of the eleven articles; every `href` is a route, an article's id or the bved URL; the services link their articles; the JSON samples parse (`JSON.parse`) and the cURL sample calls the base URL; seven status codes, five versions, and every service version in the overview matches its article's badge and the versions table's last row for it; no empty, doubled-space or untrimmed text.

## 1.3 Pure logic

`$lib/landing/pages/api-dokumentation/highlight.ts`:

- `jsonTokens(code)`: `[]`-free tokens `{ text, kind?: "k" | "s" }` that join back to `code`. Only for code whose trimmed text starts with `{` (the design's check); otherwise one plain token. The design's two rules: a quoted string followed by optional whitespace and `:` is a key (`k`); a quoted string after `:` and optional whitespace is a value (`s`).

`highlight.test.ts`: the tokens join back to the input; the answer's keys and values (`"mscnumber"` `k`, `"123456789"` `s`, `"period"` `k`, `"2021-06"` `s`); the cURL sample stays one plain token; a key whose value is an object or array; escaped quotes don't occur in the samples (asserted in `content.test.ts`).

The scroll spy reuses `activeIndex(tops, line)` from `$lib/landing/pages/hkvo-leitfaden/toc.ts` (its tests cover it).

## 1.4 The code font

Geist Mono for the code, the terminal, the service names and the version badges, as `/vorgehen` registers it: `@fontsource-variable/geist-mono`'s latin file through `?url` in an `@font-face` in `<svelte:head>`. Unlike `/vorgehen` it's used above the fold (the terminal), so the route also preloads it (`<link rel="preload" as="font" type="font/woff2" crossorigin>`).

## 1.5 Images

None. The floating CTA's portraits come with the shared `FloatingCta`.
