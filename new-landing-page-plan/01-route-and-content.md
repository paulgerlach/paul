# Phase 1: Route, links, content and SEO

## 1.1 Route and links

In one commit:

- `ROUTE_SCHNITTSTELLEN = "/schnittstellen"` in `$lib/routes.ts`, after `ROUTE_VERBRAUCHSINFORMATION`.
- The landing footer's "Schnittstellen" (`$lib/landing/footerLinks.ts`, group "Plattform") gets `href: ROUTE_SCHNITTSTELLEN` (today plain text). Every landing page renders this footer. The site footer (`Footer/footerLinks.ts`) has no "Schnittstellen" entry and stays as it is.
- `src/routes/(landing-page)/schnittstellen/+page.server.ts`, modelled on `sicherheit/+page.server.ts`:

```ts
export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"Schnittstellen zu ERP und CRM: Verbrauchsdaten direkt in Ihrer Software | Heidi Systems",
		description:
			"Heidi ist in Ihr ERP- oder CRM-System integriert: Verbrauchsdaten und fertige Heizkostenabrechnungen landen direkt in Ihrer Software. Kein Abtippen, keine Dateien, kein Softwarewechsel.",
		ogTitle: "Eine Plattform pflegen. Nicht zwei.",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: true,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	faq: faq.items,
	finalForm: await emptySwitchForm("final"),
});

export const actions: Actions = {
	default: (event) =>
		handleSwitchSignup(event, {
			source: "schnittstellen",
			page: ROUTE_SCHNITTSTELLEN,
		}),
};
```

  The page sets no `cache-control`, because the layout does. `leads.source` is free text, so the new source needs no migration; check that the Make.com `switchinquiry` scenario doesn't filter on known `page` values (gate §4.4).
- **Other links to the page.** Save the designs of `/dashboard` (`Hnv5z6cFcw3DyXPkw9nQx1`), `/funktionen` (`LLDy7uV51zMeq2LbyHwngP`) and the Berlin city page with the Artifact tool's `read` action and search them for this design's id `KE95icU8eKWX7TNfLerbSZ`. Change only what a design links here:
  - `pages/dashboard/content.ts`: `integration.link` ("Anbindung besprechen →", today `START_HREF`).
  - `pages/funktionen/content.ts`: the "Immobilienmanagement" card ("Anbindung an Ihr ERP- oder CRM-System …", no `href` today; that page's open question 1 lists the cards without a page).
  - `sections/region/Compare.svelte`: the row "Anbindung an Ihr ERP oder CRM" (no link today; city designs only, through the extraction script's data if it's a link there).
  - Not changed: the many sentences about ERP/CRM on `/messdienstwechsel`, `/selbstabrechnung`, `/upgrade-now`, `/ueber-uns`, `/messdienstanbieter` (plain text in their designs).
  Record what was found in the README's implementation notes.
- **Tests that see the change:** the footer-link specs (every internal footer link resolves) now include `/schnittstellen`; the `/dashboard` and `/funktionen` specs if a link there changes.
- `+page.svelte`: `<main id="content" class="si" {@attach reveal()}>` with sections 1–11 in design order, then `FloatingCta` after `</main>`. As on `/sicherheit`, the page holds the design's page tokens (`--bg: #f6f7f6`, `--hair: #e5e9e7`), the section frame (`.pg-sec`, `.pg-sec.alt`: 104 px padding, 72 px ≤ 640 px, a top hair line, the grey band), the reveal styles (`.rv-anim`/`.rv-wait`, threshold 0.15) and the `#hs-css` sizes (`h1[data-hs]`, `section:not(.end) h2[id]` in the 621–1040 and ≤ 620 queries, specific enough to beat the `tokens.css` heading reset).
- Sitemap: no entry until the cutover (gate §4.4).

## 1.2 Content module

`$lib/landing/pages/schnittstellen/content.ts` holds every text and the example data, word for word from the design. `NB` (non-breaking space) between figures and units ("20 Min.", "45 €", "53 Std."), as on the other pages. Section heads are `SplitHeading`s (`$lib/landing/types`): the main text and the muted `<span>`.

- `hero`: `pill` "Schnittstellen zu ERP und CRM" (icon: the design's link/plug icon), `h1` "Eine Plattform pflegen." + `h1Accent` "Nicht zwei." (on its own line, `<em>`), `lead` "Heidi ist in Ihr bestehendes ERP- oder CRM-System integriert. Verbrauchsdaten und fertige Abrechnungen landen direkt in Ihrer Software. Sie arbeiten weiter dort, wo Sie heute schon arbeiten.", `demo` "Demo buchen" → `DEMO_HREF`, `calc` "Doppelpflege berechnen" → `#doppelpflege`, `ticks` "Kein Abtippen" / "Keine Dateien hin und her" / "Kein Softwarewechsel".
- `stage`: `label` "Vergleich: zwei Plattformen oder eine", `modes` `[{ value: "two", label: "Zwei Plattformen" }, { value: "one", label: "Mit Heidi" }]` with the group label "Ansicht", `tag` "Beispieldaten";
  - `portal`: title "Messdienst-Portal", sub "Eigener Login", `files` "Verbrauchswerte.csv" / "Abrechnung_2025.pdf" / "Nutzerliste.xlsx" (icons: table, document, people), `synced` "Heidi" / "synchronisiert" (the panel's "Mit Heidi" face);
  - `erp`: title "Ihr ERP / CRM", sub "Lindenallee 12 · 6 Wohnungen", `items` `[{ icon, title: "Verbrauchswerte 2025", sub: "18 Werte · WE 01–06" }, { "Heizkostenabrechnung 2025", "6 Einzelabrechnungen" }, { "Verbrauchsinfo September", "An alle Mieter versendet" }]`;
  - `status`: `manual` "Manuell nachtragen", `pending` "…", `synced` "Synchronisiert";
  - `steps`: `two` `{ n: 4, text: "Handgriffe je Liegenschaft: einloggen, exportieren, weiterleiten, abtippen" }`, `one` `{ n: 0, text: "Handgriffe: Die Daten liegen direkt in Ihrer Software" }`.
- `logos`: text "Hausverwaltungen in ganz Deutschland arbeiten bereits mit Heidi.", `DEFAULT_LOGO_ORDER`.
- `beforeAfter`: pill "Vorher und nachher", H2 "Derselbe Vorgang." + "Einmal doppelt, einmal einfach." (centred);
  - `two`: "Zwei Plattformen" / "Messdienst-Portal und Ihre Software", five steps `{ title, sub }`: "Im Portal des Messdienstes einloggen" – "Separater Zugang, eigene Oberfläche"; "Werte und Abrechnung herunterladen" – "CSV, PDF oder Excel, je nach Anbieter"; "Dateien per E-Mail weiterreichen" – "An Kolleginnen, Buchhaltung, Eigentümer"; "Werte in die eigene Software übertragen" – "Von Hand, Zeile für Zeile"; "Beide Systeme aktuell halten" – "Jede Änderung zweimal pflegen";
  - `one`: "Eine Plattform" / "Ihre Software, mit Heidi angebunden", three steps: "Verbrauchsdaten kommen von selbst" – "Per Funk abgelesen, direkt in Ihrer Software"; "Fertige Abrechnungen ebenso" – "Dort, wo Sie Ihre Mieter ohnehin verwalten"; "Sie arbeiten in Ihrem gewohnten System" – "Kein zweiter Login im Alltag"; `note` "Das Heidi Dashboard bleibt trotzdem für Sie da, wenn Sie Verbräuche auswerten möchten." + link "Dashboard ansehen →" → `ROUTE_DASHBOARD`.
- `calculator`: pill "Doppelpflege-Rechner", H2 "Was kostet Sie die zweite Plattform?" + "Rechnen Sie mit Ihren Zahlen." (left-aligned), lead "Alle Werte sind Ihre eigenen Annahmen. Stellen Sie ein, wie oft Daten heute von einem System ins andere wandern und wie lange das dauert.";
  - `inputs` (id, label, min, max, step, default, unit, help): `l` "Liegenschaften" 1–300 / 1 / 40; `u` "Übertragungen je Liegenschaft und Jahr" 1–24 / 1 / 4, help "Zum Beispiel Abrechnung, Zwischenablesung, Nachfragen von Eigentümern"; `m` "Minuten je Übertragung" 5–90 / 5 / 20, unit "Min.", help "Einloggen, herunterladen, weiterleiten, eintragen, prüfen"; `s` "Interner Stundensatz" 20–120 / 5 / 45, unit "€";
  - `result`: label "Zeit für Doppelpflege pro Jahr", unit "Std.", days "{x} Arbeitstage à 8 Stunden", cost label "Entspricht internen Kosten von", note "Eigene Annahmen, kein Angebot. Wie viel davon mit Heidi entfällt, hängt von Ihrer Software ab. Das klären wir in der Demo.", `cells: 60`.
- `dataPath`: pill "Datenweg", H2 "Vom Zähler in Ihre Software." + "Ohne Umweg." (centred), `nodes` "Funkzähler" – "In jeder Wohnung"; "Fernablesung" – "Ohne Termin vor Ort"; "Heidi" – "Prüft und bereitet auf" (`hub`, the Heidi mark); "Ihr ERP / CRM" – "Hier arbeiten Sie" (`end`, dark); `cards`: "Verbrauchsdaten" – "Heizung, Warm- und Kaltwasser je Wohnung, so wie die Funkzähler sie liefern."; "Heizkostenabrechnungen" – "Fertig erstellt, direkt bei der Liegenschaft in Ihrer Software."; "Grundlage für die Selbstabrechnung" – "Sie rechnen selbst ab? Dann liegen die Werte genau dort, wo Sie abrechnen." + link "Mehr zur Selbstabrechnung →" → `ROUTE_SELBSTABRECHNUNG`.
- `benefits`: pill "Warum eine Plattform", H2 "Weniger Systeme." + "Weniger Fehlerquellen." (left-aligned), four `{ title, text }` (the first `dark`): "Eine Wahrheit" – "Ihre Daten liegen an einem Ort. Niemand fragt sich, welche Version die aktuelle ist."; "Kein Abtippen" – "Was nicht von Hand übertragen wird, kann auch nicht falsch übertragen werden."; "Keine Dateien im Postfach" – "Kein Hin- und Herschicken von Exporten zwischen Messdienst, Verwaltung und Buchhaltung."; "Kein Umlernen" – "Ihr Team arbeitet weiter in der Software, die es kennt. Heidi kommt dazu, nicht obendrauf."
- `steps`: pill "So starten Sie", H2 "Drei Schritte" + "bis zur einen Plattform." (centred), three: "Demo buchen" – "Sie nennen uns die Software, mit der Sie heute arbeiten. Wir zeigen Ihnen, wie Heidi dort ankommt."; "Anbindung einrichten" – "Heidi verbindet sich mit Ihrem ERP- oder CRM-System. Sie müssen dafür nichts neu aufsetzen."; "Daten fließen" – "Ab der ersten Ablesung landen Verbrauchswerte und Abrechnungen direkt in Ihrer Software."
- `quotes`: title "Was Verwaltungen über Heidi sagen", keys `vitolus`, `werne`.
- `faq`: title "Häufige Fragen zu den Schnittstellen", five `FaqItem`s:
  - "Muss ich meine Software wechseln?" – "Nein. Heidi ist in bestehende ERP- und CRM-Systeme integriert. Sie arbeiten weiter in Ihrer gewohnten Software."
  - "Welche Daten kommen in meinem System an?" – "Die Verbrauchsdaten Ihrer Liegenschaften und die fertigen Heizkostenabrechnungen. Kein Abtippen, kein Hin- und Herschicken von Dateien."
  - "Wird meine Software unterstützt?" – "Nennen Sie uns Ihr System in der Demo. Wir zeigen Ihnen dann konkret, wie die Anbindung bei Ihnen aussieht."
  - "Brauche ich das Heidi Dashboard dann noch?" – "Für die tägliche Arbeit nicht. Das Dashboard steht Ihnen aber weiter zur Verfügung, etwa um Verbräuche über alle Liegenschaften auszuwerten."
  - "Funktioniert das auch, wenn ich selbst abrechne?" – "Ja. Bei der Selbstabrechnung liefert Heidi die Verbrauchswerte direkt in die Software, in der Sie Ihre Abrechnung erstellen."
- `closing`: H2 "Ihre Software bleibt. Die Doppelpflege geht.", text "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.", `submitLabel` "Demo buchen".

`content.test.ts`:
- the H1 and its accent; 5 + 3 comparison steps and 3 ERP items, none empty; four benefits, three steps, five questions; every `href` is a route constant or an anchor that exists on the page (`#doppelpflege`, `#start`);
- the calculator's inputs: `min ≤ default ≤ max`, `(default − min)` a multiple of `step`, and the defaults give the design's result through `doppelpflege.ts` (53 Std., "6,7", "2.400 €", 7 cells);
- the example data agree: "18 Werte · WE 01–06" is 6 units × 3 (Heizung, Warm-, Kaltwasser, as the data card says), "6 Einzelabrechnungen" matches "6 Wohnungen", the steps line's `two.n` is the number of verbs in its text (4);
- the quotes: `vitolus` and `werne` exist in `testimonials.ts`, and their text is the design's.

## 1.3 The calculator's math

`$lib/landing/pages/schnittstellen/doppelpflege.ts`, pure, no DOM, like `selbstabrechnung/distribution.ts`:

```ts
export type Inputs = { l: number; u: number; m: number; s: number };
export type Result = { hours: number; days: number; cost: number; lit: number };

export function doppelpflege({ l, u, m, s }: Inputs, cells = 60): Result {
	const hours = (l * u * m) / 60;
	return {
		hours,
		days: hours / 8,
		cost: Math.round((hours * s) / 10) * 10,
		lit: Math.min(cells, Math.round(hours / 8)),
	};
}
```

Formatting stays in the component with the landing pages' `de-DE` helpers: hours with 0 decimals ("53", "10.800"), days with 1 ("6,7"), cost with 0 + " €" ("2.400 €", "1.296.000 €"). The design rounds the cost to 10 € *after* the tween on every frame; here the tween runs on the rounded target and each frame is rounded to 10 € the same way, so it lands on the same text. `doppelpflege.test.ts`: the defaults (53.33 h → "53", 6.67 → "6,7", 2,400, 7), the minimum (1 × 1 × 5 min: 0.08 h → "0", 0 cells, cost 0), the maximum (300 × 24 × 90: 10,800 h, 1,350 days, 1,296,000 €, 60 cells, capped), and a rounding edge (cost 2,405 → 2,410).

## 1.4 Images

None besides the shared ones: the customer logos (`LogoStrip`) and the floating CTA's avatars (`FloatingCta`). The closing card's poster and videos aren't used (open question 2).

## 1.5 Link mapping

| Design link | Here |
|---|---|
| `44SBXKXJaSp6bvGMnbpZj6` ("Demo buchen" in the hero, the closing card's video button, the trust block, the floating CTA "Erstgespräch vereinbaren") | `DEMO_HREF` (`#start`, the closing form); the trust block and the floating CTA as on the other pages |
| `#doppelpflege` ("Doppelpflege berechnen ↓") | the same anchor, on the calculator section |
| `Hnv5z6cFcw3DyXPkw9nQx1` ("Dashboard ansehen →") | `ROUTE_DASHBOARD` |
| `8mPPRD6tVjMYFencN8YvWX` ("Mehr zur Selbstabrechnung →") | `ROUTE_SELBSTABRECHNUNG` |
| `Jp8tqY82m7FZqMnWU4z9x9` (banner "Mehr erfahren") | `ROUTE_UPGRADE_NOW` (through `DEFAULT_CHROME.bannerHref`) |
| `Sb54rDQd5WS2r82skPe7UQ` (the trust block's "Mehr zu Sicherheit") | `ROUTE_SICHERHEIT` (the shared `TrustSeals`) |
| `#` (the nav's "Schnittstellen", the current page) | the footer's "Schnittstellen" → this page; the landing header has no such item |
| Logo, nav, the design's footer | the shared landing header and footer |
