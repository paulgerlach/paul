# Phase 1: Route, content, the distribution math, signup and the shared sections

## 1.1 Route

- `ROUTE_SELBSTABRECHNUNG = "/selbstabrechnung"` in `$lib/routes.ts`.
- `src/routes/(landing-page)/selbstabrechnung/+page.server.ts`, modelled on `upgrade-now/+page.server.ts`:

```ts
export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title: "Heizkostenabrechnung selbst erstellen: Zählerdaten von Heidi | Heidi Systems",
		description:
			"Sie erstellen die Heizkostenabrechnung selbst, Heidi liefert die Daten: Funkzähler, Fernablesung aller Zähler und Übergabe direkt in Ihr ERP- oder CRM-System.",
		ogTitle: "Sie rechnen ab. Heidi liefert die Daten.",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: true,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	finalForm: await emptySwitchForm("final"),
});

export const actions: Actions = {
	default: (event) =>
		handleSwitchSignup(event, {
			source: "selbstabrechnung",
			page: ROUTE_SELBSTABRECHNUNG,
		}),
};
```

  The page sets no `cache-control`, because the layout does. The `leads.source` column is free text, so the new source needs no migration; check that the Make.com `switchinquiry` scenario doesn't filter on known `page` values (gate §4.4).
- `+page.svelte`: the sections in design order inside `<main id="content" class="sa" {@attach reveal()}>`, with the page tokens as on `/hilfe`. `FloatingCta` after `Trust`, as on the region pages.

## 1.2 Footer and `/hilfe`

- `$lib/landing/footerLinks.ts`: `{ text: "Selbstabrechnung", href: ROUTE_SELBSTABRECHNUNG }`.
- `$lib/landing/pages/hilfe/content.ts`, question `selbst-abrechnen`: `more: { text: "Selbstabrechnung", href: ROUTE_SELBSTABRECHNUNG }`. Its answer now renders the link; check the card at 375 px.

These and the route ship in one commit (README, phases).

## 1.3 Content module

`$lib/landing/pages/selbstabrechnung/content.ts` holds every text and every example number of the page, word for word from the design. Headings with a second, muted part keep it as a separate field (`h2: { text, span }`), the H1 as `h1: { text, em }`.

- `hero`: pill "Selbstabrechnung", H1 "Sie rechnen ab." + em "Heidi liefert die Daten." (non-breaking space before "Daten."), lead, CTAs "Demo buchen" (→ `DEMO_HREF`) and "Kostenverteilung ausprobieren ↓" (→ `#rechner`), ticks "Alles aus einer Hand", "Alle Zählerdaten per Funk", "Direkt in Ihr ERP".
- `demo` (the hero card): title "Heizkostenabrechnung 2025", building `{ name: "Lindenallee 12", flats: 6, meters: 18 }` (the subline "Lindenallee 12 · 6 Wohnungen · 18 Zähler" is built from it), the three checks (`{ title, sub, value }`: meters `18` as a count, costs `12.480 €`, key `70/30`), the six results `{ flat: "WE 01", area: "74 m²", amount: -48.2 }` … (negative = "Guthaben", positive = "Nachzahlung"), statuses "Daten kommen" / "Bereit" / "Erstellt", button labels "Abrechnung erstellen" / "Wird erstellt …" / "Erneut ansehen", hints "Ein Klick, sobald alle Werte da sind." / "Alle Daten vollständig. Jetzt erstellen." / "6 Abrechnungen · Beispieldaten", toast "6 Einzelabrechnungen erstellt" + "Bereit zum Versand an Ihre Mieter.", tag "Beispieldaten". The "6" in hint and toast is `results.length`.
- `logos`: "Hausverwaltungen in ganz Deutschland arbeiten bereits mit Heidi."
- `tasks`: the nine tasks by key (`inst`, `read`, `uvi`, `data`, `dash`, `abr`, `key`, `send`, `ask`) as `{ icon, title, sub, subFull? }` (`abr` has "In Ihrer gewohnten Software" and, in Vollservice, "Per Klick, direkt im Dashboard"), and `modes`: `self` (Heidi: inst, read, uvi, data, dash; you: abr, key, send, ask) and `full` (Heidi: + abr; you: key, send, ask), each with its label and note. Column heads "Heidi übernimmt" / "Sie behalten", `tasksText(n)` → "1 Aufgabe" / "n Aufgaben".
- `calculator`: pill, H2, lead; sliders `costs: { min: 6000, max: 80000, step: 500, default: 24000 }` and `share: { min: 50, max: 70, step: 5, default: 70 }`; labels; split labels "Grundkosten nach Fläche" / "Verbrauchskosten"; the § 7 Abs. 1 hint; table head "Beispielhaus · 6 Wohnungen · 450 m²" (built from `flats`), legend, column labels, "Summe"; foot "Vereinfachtes Beispiel ohne Warmwasser (§ 8) und ohne CO₂-Kostenaufteilung. Keine Rechtsberatung."; `flats`: `[["WE 01", 62, 1100], ["WE 02", 78, 1420], ["WE 03", 55, 760], ["WE 04", 91, 1650], ["WE 05", 70, 980], ["WE 06", 94, 1090]]` as `{ id, area, units }`.
- `dataPath`: pill, H2, five stations `{ icon, title, sub }`.
- `duties`: pill, H2, four cards `{ figure, title, text, source }`, the CTA row text "Unsicher, ob Ihre letzte Abrechnung alles erfüllt?" with "Zum Heizkostenabrechnungs-Checker" and `CHECKER_HREF: string | undefined = undefined` (README, open question 6).
- `allMeters`: the big card (pill "Alle Zählerdaten", H2, text, the meter list `{ icon, title, count }` with "18 von 18 ausgelesen"), the two cards (titles, texts, their mock rows), the "Auf Knopfdruck" head and the three steps `{ title, text }` with their mock rows.
- `sample`: pill, H2, lead, the four keys `{ title, sub }`, and the paper: sender line, recipient lines, title, subline, the two `<dl>`s as `[term, value][]`, intro, amount "1.248,30 €", the two notes, portal block (text, "Nutzer-ID: MUSTER-0010", "Sicherheitscode: ••••••"), the six objects, stamp "Musterabrechnung · Beispieldaten". The sender line uses the address from `Footer/footerLinks.ts` (the design writes "Monbijouplatz 4", ours is "Monbijoupl. 4"; use the design's spelling only if the content owner prefers it).
- `people`: H2 "Selbst abrechnen." / "Nicht allein.", text, checks "Ein fester Ansprechpartner", "Verbrauchsdaten aus einer Hand", "Erreichbar, wenn Fragen kommen", CTA "Demo buchen".
- `testimonials`: title "Was Verwaltungen über Heidi sagen", ids in design order (Höhne, then Werne).
- `faq`: title "Häufige Fragen zur Selbstabrechnung", the five `{ q, a }` (plain text).
- `finalCta`: title "Ihre Abrechnung. Unsere Daten.", submit label "Demo buchen" (the design's button text), `sub` none.

The design's links and where they go:

| Design link | Our target |
|---|---|
| Logo, nav, "Anmelden", "Angebot einholen" | The shared `LandingHeader` |
| Banner "Mehr erfahren" | `/upgrade-now` (`DEFAULT_CHROME`) |
| "Demo buchen" (hero, people, final, trust), floating "Erstgespräch vereinbaren" | `DEMO_HREF` (`#start`, the signup form in `FinalCta`) |
| "Kostenverteilung ausprobieren ↓" | `#rechner` |
| "Zum Heizkostenabrechnungs-Checker →" | none yet, row not rendered |
| "Mehr zu Sicherheit" | none yet (`TrustSeals`' `SECURITY_HREF`) |

`content.test.ts`: no empty strings, no `XX`; task keys in `modes` exist and every task is in exactly one column per mode; `demo.building.meters` equals the checks' meter count; `results` has `building.flats` entries; the calculator's 450 m² is the sum of `flats[].area`; slider defaults lie on their steps; FAQ has 5 entries. The 18-vs-25 mismatch of the meter list is a content question (README, Risks), so the test doesn't assert it; it asserts that the list's "18 von 18" uses `demo.building.meters`, so a fix changes one number.

## 1.4 Distribution math

`$lib/landing/pages/selbstabrechnung/distribution.ts` (pure, no runes):

- `distribute({ costs, sharePercent, flats })` → `{ base, consumption, perM2, perUnit, rows: { id, area, units, base, consumption, total }[], max, totalArea, totalUnits }`. `base = costs × (1 − share)`, `consumption = costs × share`, `perM2 = base / totalArea`, `perUnit = consumption / totalUnits`, each row `area × perM2 + units × perUnit`; `max` is the largest row total (the bars scale to it, as in the design).
- `clampStep(value, { min, max, step })` for the slider values (a crafted value from the URL or devtools can't produce 45 %).
- Formatting: `formatNumber` from `upgrade-now/calculator.ts` for whole euros; add `formatDecimal(n, 2)` (de-DE, two decimals) next to it for "16,00 €/m²" and the results' cents, and use it in `BillingDemo` too.

`distribution.test.ts`: the defaults give 7.200 / 16.800 €, 16,00 €/m², 2,40 €/Einheit; row totals sum to `costs` (within a cent); 50 % gives an even split; `clampStep(47, share)` is 50 and `clampStep(68, share)` is 70; rounding happens only in formatting.

## 1.5 Shared sections out of `region/`

Three region sections aren't city-specific and move to `$lib/landing/sections/`:

- `TrustSeals.svelte`: unchanged (it reads no `RegionContent`). Compare its markup and CSS with the design's `#trust-css` first; the cards, the split and the tray are the same block.
- `FloatingCta.svelte`: unchanged. It hides while `section.final` is in view, which `FinalCta` renders, so it behaves on this page as designed.
- `People.svelte`: today it takes `content: RegionContent` for the photo and hard-codes the title and checks ("Menschen statt Hotline.", "Alles aus einer Hand"). New props `{ title: { text, br? }, text, checks: string[], photo: Picture, photoAlt, objectPosition? }`; the region pages' wrappers pass their values (no visual change). Compare `#pp-css` with the region design's first.

Update the imports in `RegionMain.svelte` and the region wrappers; check a city page and `/messdienstanbieter` at 375 and 1440 px for no visual change.

The new photo goes to `src/lib/assets/landing/selbstabrechnung/beratung.webp` (from the design, 78 KB; `object-position: 55% 35%`), imported `?enhanced`.

Update `CLAUDE.md` (a `/selbstabrechnung` bullet under "Current state", the layout tree, and `People`/`TrustSeals`/`FloatingCta` in the shared landing sections line).
