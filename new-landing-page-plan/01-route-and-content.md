# Phase 1: Route, links, content and SEO

## 1.1 Route and links

In one commit:

- `ROUTE_WOHNUNGSUNTERNEHMEN = "/wohnungsunternehmen"` in `$lib/routes.ts`, after `ROUTE_WEG_VERWALTUNG`.
- The landing footer's "Wohnungsunternehmen" (`$lib/landing/footerLinks.ts`, group "Kunden") gets `href: ROUTE_WOHNUNGSUNTERNEHMEN`. "Private Vermieter" and "Asset Manager & Fonds" stay plain text.
- `src/routes/(landing-page)/wohnungsunternehmen/+page.server.ts`, a copy of `schnittstellen/+page.server.ts`:

```ts
export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title: "Messdienst für Wohnungsunternehmen: der Wechsel als Rollout im Cluster | Heidi Systems",
		description:
			"Heidi stellt große Bestände strukturiert um: Portfolio-Check, Pilotobjekt, Rollout im Cluster, mit einem festen Ansprechpartner. Ab 1.000 Einheiten mit einem Angebot für Ihren Bestand.",
		ogTitle: "Große Bestände. Strukturiert umgestellt.",
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
		handleSwitchSignup(event, { source: "wohnungsunternehmen", page: ROUTE_WOHNUNGSUNTERNEHMEN }),
};
```

  No `cache-control` (the layout sets it). `leads.source` is free text: no migration.
- **Other links to the page:** none. Searched every saved design (landing pages, cities, segment siblings) for `2XwVWrEs9cvcDpBtQxzGnt`: the designs' nav and footer, and the Asset-Manager design's segment tab (not built).
- **Tests that see the change:** the footer-link specs (every internal footer link resolves) now include `/wohnungsunternehmen`.
- `+page.svelte`: `<main id="content" class="wu" {@attach reveal()}>` with `SgMain` around every section, `FloatingCta` after `</main>`.
- Sitemap: no entry until the cutover (gate §4.4).

## 1.2 Content module

`$lib/landing/pages/wohnungsunternehmen/content.ts`, word for word from the design, in the `sg` shapes (`sg/types.ts`). As on the other pages, a non-breaking space (`NB`) between a figure and its unit (`92 %`, `14 Tage`, `1 bis 2 Stunden`, `1.000 Einheiten`; `content.test.ts` checks it). Soft hyphen where the design has `&shy;`.

- `hero`: pill "Für Wohnungsunternehmen" (icon `house`), H1 "Große Bestände." + accent "Strukturiert umgestellt.", lead "Für Wohnungsunternehmen planen wir den Wechsel als Rollout im Cluster: erst Analyse, dann Pilotobjekt, dann der ganze Bestand. Mit klaren Übergaben und einem festen Ansprechpartner.", primary "Demo buchen" → `DEMO_HREF`, ghost "Unzufrieden mit Ihrem Messdienst?" ↓ → `#wechsel`, ticks "Alles aus einer Hand", "Wechsel auch bei laufendem Vertrag", "Fester Ansprechpartner".
- `calc`: title "Wie viele Einheiten betreuen Sie?", hint "Ziehen Sie den Regler", unit "Einheiten", slider label "Anzahl Einheiten", start `4800`, scale "10" / "1.000" / "20.000+"; standard: tag "Ihr Angebot", ticks "Zähler, Ablesung und Abrechnung aus einer Hand", "Heizkostenabrechnung per Klick", "Abrechnung pro installiertem Zähler"; large: tag "Ab 1.000 Einheiten" (icon `star`), title "Wir machen Ihnen ein passendes Angebot.", ticks "Konditionen für Ihren Bestand", "Kostenloser Portfolio-Check", "Rollout im Cluster mit festem Ansprechpartner", CTA "Angebot anfragen" → `DEMO_HREF`.
- `tabs`: label "Zielgruppen"; Hausverwaltung (`building`) → `ROUTE_HAUSVERWALTUNG`, Mietverwaltung (`key`) → `ROUTE_MIETVERWALTUNG`, WEG-Verwaltung (`users`) → `ROUTE_WEG_VERWALTUNG`, Wohnungsunternehmen (`house`, current) → `ROUTE_WOHNUNGSUNTERNEHMEN`, Asset Manager & Fonds (`bars`) without `href`.
- `logos`: "Hausverwaltungen in ganz Deutschland arbeiten bereits mit Heidi.", `DEFAULT_LOGO_ORDER`.
- `large`: figure 1000 with "+" and "Einheiten", pill "Für große Bestände" (`building`), H2 "Sie betreuen mehr als 1.000 Einheiten?" + muted "Dann haben wir ein passendes Angebot.", text "Je größer der Bestand, desto mehr zählt ein Wechsel mit Plan. Wir analysieren Ihre Verträge, planen den Rollout Objekt für Objekt und machen Ihnen ein Angebot, das zu Ihrem Bestand passt.", CTA "Angebot anfragen" → `DEMO_HREF`, secondary "Portfolio kostenlos prüfen" without `href` (hidden).
- `pain`: pill "Unzufrieden mit Ihrem Messdienst?" (`alert`), H2 "Was stört Sie heute?" + muted "Klicken Sie an, was zutrifft.", group label "Probleme mit dem bisherigen Messdienst", empty state "Wählen Sie links, was Sie stört." / "Wir zeigen Ihnen, wie Heidi das löst.", the count "1 Grund für den Wechsel" / "{n} Gründe für den Wechsel", CTA "Wechsel besprechen" → `DEMO_HREF`; eight items `{ problem, title, text }` from the markup and `#sg-js`'s `A` (e.g. "Ablesetermine mit Mietern koordinieren" → "Ablesung per Funk" – "Keine Ablesetermine mehr. Die Werte kommen aus der Ferne, ohne Termin in der Wohnung."); links "Muster-Kündigung herunterladen" (`doc`), "Messdienstanbieter vergleichen" (`swap`), "Bisherige Abrechnung prüfen" (`check`), all without `href`.
- `benefits`: pill "Für Wohnungsunternehmen" (`sparkle`), H2 "Was Sie mit Heidi" + muted "bekommen."; "Portfolio-Analyse" (`bars`, dark), "Rollout im Cluster" (`calendar`), "Montage mit Plan" (`wrench`), "Angebunden an Ihr ERP" (`erp`) with the design's texts.
- `features` (section label "So arbeitet Heidi"), five rows `{ title, text, link? }` and their tiles' data:
  1. "Verbräuche lückenlos erfasst" – link "Dashboard ansehen" → `ROUTE_DASHBOARD`; tile `meter`: "Lindenallee 12 · WE 04", 1650 "Einheiten", "Stichtag" "31.12.", "Heizkosten­verteiler", "per Funk".
  2. "Abrechnung ohne Handarbeit" – link "Selbst abrechnen?" → `ROUTE_SELBSTABRECHNUNG`; tile `billing`: "Heizkostenabrechnung 2025", 24, "Wird erstellt …" → "Fertig für alle Einheiten".
  3. "Verbräuche jeden Monat im Blick" – link "Zum Dashboard" → `ROUTE_DASHBOARD`; tile `monthly`: rows WE "03" 142 (Vormonat 138), "07" 318 (131, the outlier), "12" 96 (101), scale 340 kWh, "Wie im Vormonat" / "Über Vormonat", cursor "Verwaltung", toast "Zur Prüfung markiert", tag "Beispieldaten".
  4. "Wächst mit Ihrem Bestand" – text with the inline link "Mieterportal" → `ROUTE_MIETERPORTAL`, link "Schnittstellen" → `ROUTE_SCHNITTSTELLEN`; tile `hub`: "Ihr ERP" / "Abrechnung übergeben", "Ihr CRM" / "Kontakte aktuell", "Heidi Dashboard" / "Verbräuche neu", "Mieterportal" / "Verbrauchsinfo bereit".
  5. "Rollout Liegenschaft für Liegenschaft" – link "So gehen wir vor" → `ROUTE_VORGEHEN`; tile `rollout`: "Rollout Bestand Nord", tag "Beispieldaten", Lindenallee 12 (100, Fertig), Gartenweg 3 (100, Fertig), Am Stadtpark 7 (64, Montage läuft), Hofstraße 21 (12, Mieter informiert), the count "{n} von 4 Liegenschaften fertig" / "Alle 4 Liegenschaften fertig", badge "92 % beim ersten Termin", "Ihr Ansprechpartner koordiniert"; the loop's steps (03 §3.6).
- `steps`: pill "So läuft der Wechsel" (`arrow`), H2 "Vier Schritte." + muted "Eine Unterschrift.", "Portfolio-Check", "Vollmacht", "Montage", "Abrechnung" with the design's texts.
- `quotes`: H2 "Was Verwaltungen über Heidi sagen", keys `vitolus`, `gerhard` (the design's order).
- `faq`: title "Häufige Fragen": "Wie läuft der Wechsel bei mehreren tausend Einheiten?", "Gibt es Konditionen für große Bestände?", "Was kostet Heidi?" (as `/hausverwaltung`), "Müssen wir auf das Vertragsende warten?" ("… egal wie lange Ihr aktueller Vertrag noch läuft.").
- `closing`: H2 "Bereit für einen Messdienst, der mitdenkt?", text "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.", submit "Demo buchen".

`content.test.ts`: the H1; every `href` a route or an anchor on the page; no empty or untrimmed text; the tabs (five, one current, the built segment routes); eight problems with eight answers; four benefits and four steps; five rows, three with a tile number that matches the copy (24 Abrechnungen; 4 Liegenschaften, two of them done in the start state; the outlier above its Vormonat and every bar within the scale); the "92 %" and "14 Tage" figures the same as on the other pages; the quotes word for word from `testimonials.ts`; four questions; "Ab 1.000 Einheiten" agrees with `units.ts`'s threshold.

## 1.3 Images

None new: the logos come with the shared `LogoStrip`, the floating CTA's avatars with the shared `FloatingCta`.

## 1.4 Hero and the `#start` anchor

The design's hero is `#start`; here the closing card is (`DEMO_HREF`), as on `/schnittstellen`. The hero section gets `aria-labelledby="wu-h1"` and no id; the current tab links to the page itself.

## 1.5 Link mapping

| Design link | Here |
|---|---|
| `44SBXKXJaSp6bvGMnbpZj6` ("Demo buchen", "Angebot anfragen" ×2, "Wechsel besprechen", the video button, the floating CTA) | `DEMO_HREF` (`#start`, the closing form) |
| `#wechsel` | the same anchor |
| `#start` (the current tab) | `ROUTE_WOHNUNGSUNTERNEHMEN` with `aria-current="page"` |
| `EzsbDRGnCk2Z11QnjE3NgX`, `NJDrQZKYRpBXGMNJJGXUqd`, `WorTAiGvpRbkiEg1Lee25D` (tabs) | `ROUTE_HAUSVERWALTUNG`, `ROUTE_MIETVERWALTUNG`, `ROUTE_WEG_VERWALTUNG` |
| `AEn4zzY1ZEwShZW7cUf5fF` (tab "Asset Manager & Fonds") | none yet: plain text (open question 3) |
| `UFviBtC2mkneFNeWnfHAWp` ("Portfolio kostenlos prüfen") | none: hidden (open question 2) |
| `4WYU5hjVsWSLrxuo7wsdm6`, `Tms67Y5GnupQ4MPsxm8ux6`, `FQ6egKN8KrFwGUMZDUaavJ` (the three `.sg-links`) | none: hidden (open question 2) |
| `Hnv5z6cFcw3DyXPkw9nQx1` ("Dashboard ansehen", "Zum Dashboard") | `ROUTE_DASHBOARD` |
| `8mPPRD6tVjMYFencN8YvWX` ("Selbst abrechnen?") | `ROUTE_SELBSTABRECHNUNG` |
| `5HTo3o7mYMjqUxPXcEyuEy` (inline "Mieterportal") | `ROUTE_MIETERPORTAL` |
| `KE95icU8eKWX7TNfLerbSZ` ("Schnittstellen") | `ROUTE_SCHNITTSTELLEN` |
| `5BrUg7VjVK4QEhd7DiaSfj` ("So gehen wir vor") | `ROUTE_VORGEHEN` |
| `Jp8tqY82m7FZqMnWU4z9x9` (banner) | `ROUTE_UPGRADE_NOW` (`DEFAULT_CHROME`) |
| The trust block's "Mehr zu Sicherheit" | `ROUTE_SICHERHEIT` (`TrustSeals`) |

The design has no city links outside its footer; the landing footer's "Städte" already links every city.
