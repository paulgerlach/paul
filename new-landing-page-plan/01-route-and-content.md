# Phase 1: Route, links, content and the logic

## 1.1 Route and links

In one commit:

- `ROUTE_MESSDIENSTANBIETER_VERGLEICH = "/messdienstanbieter-vergleich"` in `$lib/routes.ts`, after `ROUTE_HEIZKOSTENABRECHNUNG_PRUEFEN`.
- The landing footer's "Messdienstanbieter-Vergleich" (`$lib/landing/footerLinks.ts`, group "Ressourcen") gets `href: ROUTE_MESSDIENSTANBIETER_VERGLEICH`. Every "Ressourcen" entry has a page then.
- The waiting links (README): "Messdienstanbieter vergleichen" in `pain.links` of `/wohnungsunternehmen` and `/asset-manager` get the route, with their content tests ("hides the links whose pages don't exist yet") and e2e assertions updated; the `.sg-links` row then shows two links (check it against the `/wohnungsunternehmen` design's row).
- `src/routes/(landing-page)/messdienstanbieter-vergleich/+page.server.ts`, as `/energieausweis`'s:

```ts
seo: {
	// Drafts for the content owner (plan §4.4).
	title: "Messdienstanbieter-Vergleich: Ihren Messdienst in 8 Kriterien prüfen | Heidi Systems",
	description:
		"Stellen Sie Ihren Messdienst in acht Kriterien neben Heidi und rechnen Sie aus, was Sie pro Wohnung und Jahr zahlen: Gerätemiete, Ablesung und Abrechnung. Ohne Anmeldung, Ihre Angaben bleiben im Browser.",
	ogTitle: "Wie gut ist Ihr Messdienst wirklich?",
	noindex: true,
	keepCanonical: true,
},
landing: DEFAULT_CHROME,
finalForm: await emptySwitchForm("final"),
```

  and `handleSwitchSignup(event, { source: "messdienstanbieter-vergleich", page: ROUTE_MESSDIENSTANBIETER_VERGLEICH })`. No `now`: nothing on the page depends on the day. No `cache-control`.
- Sitemap: no entry until the cutover (gate §4.4).

## 1.2 Content module

`$lib/landing/pages/messdienstanbieter-vergleich/content.ts`, word for word from the design:

- `COMPARE_ID = "vergleich"`, `COSTS_ID = "kosten"` (the design's ids).
- `hero`: pill "Messdienstanbieter-Vergleich", H1 "Wie gut ist Ihr Messdienst" + accent "wirklich?", the lead, `start` ("Vergleich starten" → `#vergleich`), `demo` ("Demo buchen" → `DEMO_HREF`), ticks "8 Kriterien", "Kostenrechner pro Wohnung", "Keine Daten gespeichert"; `peek`: the column heads "Ihr Anbieter" / "Heidi", the five rows ("Fernablesung per Funk", "Alles aus einer Hand", "Verbrauchsinfo jeden Monat", "Abrechnung per Klick", "Direkt im ERP"), "Ergebnis", "? / 8", "8 / 8".
- `logos.text`: "Hausverwaltungen in ganz Deutschland rechnen bereits mit Heidi ab." (as `/upgrade-now`'s), the shared order.
- `criteria`: pill "Schritt 1 · Leistungen", H2 "Was leistet Ihr Anbieter? " + muted "Kreuzen Sie an.", the eight `{ key, icon, title, text }` (`signal` "Fernablesung per Funk", `tool` "Alles aus einer Hand", `bell` "Monatliche Verbrauchsinfo", `calc` "Abrechnung per Klick", `chart` "Dashboard für alle Objekte", `server` "Direkt in Ihrem ERP", `euro` "Klare Preise", `user` "Feste Ansprechperson", each with the design's line), the answers (`y` "Ja", `n` "Nein", `u` "?"), the group's label template "{title} bei Ihrem Anbieter", "Heidi" (the tick's title).
- `score`: "Ihr Ergebnis", "Ihr Anbieter", "Heidi", "8 / 8", the verdicts (`empty` "Kreuzen Sie links an, was Ihr Anbieter heute leistet.", `open` "{n} Kriterien noch offen." / "1 Kriterium noch offen.", `all` "Ihr Anbieter erfüllt alle acht Kriterien. Dann lohnt der Blick auf die Kosten pro Wohnung.", `ahead` "Heidi liegt bei {n} Kriterien vorn." / "… 1 Kriterium vorn."), "Hier liegt Heidi vorn", "bei Ihnen unklar", the button "Mit Heidi vergleichen" → `DEMO_HREF`.
- `costs`: pill "Schritt 2 · Kosten", H2 "Was zahlen Sie heute " + muted "pro Wohnung?", the lead; two groups ("Ihr Bestand"; "Ihre Kosten" + "pro Jahr") with the six fields `{ key, label, value, min?, max?, decimal?, euro? }` (`we` "Wohnungen" 120 (1–20000), `hkv` "Heizkostenverteiler je Wohnung" 5 (0–30), `wz` "Wasserzähler je Wohnung" 2 (0–10), `phkv` "Miete je Heizkostenverteiler" 8 €, `pwz` "Miete je Wasserzähler" 12 €, `pabr` "Ablesung und Abrechnung je Wohnung" 25 €); the result card: "Ihre Messdienstkosten", "€ pro Wohnung und Jahr", the legend "Heizkostenverteiler", "Wasserzähler", "Ablesung & Abrechnung", "Pro Jahr, ganzer Bestand", "Über 6 Jahre", the tooltip "6 Jahre = Eichfrist für Wasser- und Wärmezähler", the button "Heidi-Angebot für diesen Bestand" → `DEMO_HREF`; the note "Vereinfachte Rechnung ohne Wärmezähler, Rauchmelder und Sonderleistungen. Ihre Angaben bleiben in Ihrem Browser."
- `tips`: pill "Worauf Sie achten", H2 "Sechs Fragen, " + muted "bevor Sie unterschreiben.", six `{ title, text, link? }` (the second "Zur Umrüstpflicht" → `ROUTE_UPGRADE_NOW`, the fourth "Zum Kostenrechner" → `#kosten`; the numbers 01–06 from the index). The second's text keeps its non-breaking space ("3 %").
- `switching`: pill "Wechsel", H2 "Wechseln, ohne aufs Vertragsende zu warten.", the text, "So funktioniert der Wechsel" → `ROUTE_MESSDIENSTWECHSEL`, three `{ value, text }` ("92 %", "14 Tage", "1–2 Std.").
- `quotes`: title "Was Verwaltungen über Heidi sagen", keys `werne`, `gerhard`.
- `faq`: title "Häufige Fragen zum Vergleich", four items (plain text answers).
- `closing`: H2 "Vergleichen Sie mit Ihrem eigenen Bestand.", text "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.", submit label "Demo buchen".

`content.test.ts`: the H1; three ticks; five preview rows; eight criteria with distinct keys and icons; six cost fields, three of them in euros; six questions, two with links; three band figures; four FAQ items; the quote keys exist in the shared testimonials; every `href` a route or an anchor on the page; no empty, doubled-space or untrimmed text (the split headings' first parts excepted).

## 1.3 Pure logic

`score.ts`:

- `type Answer = "y" | "n" | "u" | null`; `toggle(current, picked)` (the same answer clears it).
- `tally(answers)` → `{ yes, no, unsure, answered }`.
- `verdict(answers)` → the design's text for the counts (no answer; some open, "1 Kriterium" / "<n> Kriterien noch offen."; all eight "Ja"; else "Heidi liegt bei <8 − yes> Kriterium/Kriterien vorn."), the texts from `content.ts`.
- `gaps(answers)` → the indices of every "Nein" and "?" in the criteria's order, with `unsure` for "?".

`score.test.ts`: `toggle`; `verdict` for no answer, one open, three open, all "Ja", seven "Ja" and one "Nein" ("1 Kriterium"), a mix ("Heidi liegt bei 5 Kriterien vorn."); `gaps` keeps the order and marks "?".

`cost.ts`:

- `parseField(text)` (the design's `num()`: "8" → 8, "12,5" → 12.5, "" / "abc" / "-3" → 0, "1e3" → 1000 as `parseFloat` reads it).
- `costs({ we, hkv, wz, phkv, pwz, pabr })` → `{ allocators, water, billing, perFlat, perYear, sixYears, shares: [a, b, c] }` (shares in % of the flat's cost, 0 when it's 0).
- `formatDe(n, digits = 0)` (`de-DE`, fixed digits, the design's `de()`), `euro(n, digits)` (+ " €").

`cost.test.ts`: the start values (40 + 24 + 25 = 89, 10.680 a year, 64.080 over six years; shares ≈ 44.9 / 27.0 / 28.1); a comma decimal ("8,5"); an empty or negative field counts 0; zero flats; zero cost (shares 0); `formatDe` (89 → "89,00" with two digits, 10680 → "10.680").

## 1.4 Images and files

None new. The logos, the floating CTA's avatars and the testimonials are the shared ones.
