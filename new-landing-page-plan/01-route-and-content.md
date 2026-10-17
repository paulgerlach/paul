# Phase 1: Route, content, signup, the old page and the shared tabs logic

## 1.1 Route

- `ROUTE_FUNKTIONEN = "/funktionen"` already exists in `$lib/routes.ts`.
- Delete `src/routes/[[preview=preview]]/(base)/funktionen/` (only `+page.svelte`, no `load`) in the same commit that adds the new route (README, phases).
- `src/routes/(landing-page)/funktionen/+page.server.ts`, modelled on `vorgehen/+page.server.ts`:

```ts
export const load: PageServerLoad = async () => {
	const now = Date.now();
	return {
		seo: {
			// Drafts for the content owner (plan §4.4). Indexed from the start:
			// the page replaces a live URL (plan README, Indexing).
			title: "Funktionen: Funkzähler, Dashboard und Heizkostenabrechnung | Heidi Systems",
			description:
				"Fernablesbare Funkzähler, alle Verbräuche je Wohnung im Dashboard und die Heizkostenabrechnung nach HKVO. Von der Installation bis zur fertigen Abrechnung aus einer Hand.",
			ogTitle: "Daten mit höchster Effizienz bearbeiten.",
		},
		landing: DEFAULT_CHROME,
		// The FAQ's first answer has an expired variant (plan 01 §1.3).
		faq: faqItems(now),
		finalForm: await emptySwitchForm("final"),
	};
};

export const actions: Actions = {
	default: (event) =>
		handleSwitchSignup(event, { source: "funktionen", page: ROUTE_FUNKTIONEN }),
};
```

  The page sets no `cache-control`, because the layout does. The `leads.source` column is free text, so the new source needs no migration; check that the Make.com `switchinquiry` scenario doesn't filter on known `page` values (gate §4.4).
- `+page.svelte`: the sections in design order inside `<main id="content" class="fk" {@attach reveal()}>`, with the page tokens `--bg: #f6f7f6` (the `.alt` sections) and `--hair: #e5e9e7`, as on `/vorgehen` (the design defines them in `#demo-css`, which is otherwise out of scope; `--ink`, `--accent`, `--muted`, `--faint`, `--ok` match `tokens.css`) and the `#hs-css` sizes scoped to the page: `.fk :global(h1[data-hs])` and `.fk :global(section h2[id])` with the design's two media queries (621–1040 and ≤620). `Trust` sits inside `<main>` as on the other pages, so its H2 (`id`) gets the same sizes, as in the design. `FloatingCta` after `</main>`.
- Sitemap: the `/funktionen` entry in `src/routes/sitemap.xml/+server.ts` stays as it is.

## 1.2 The old page's leftovers

- `e2e/parity/pages.ts`: `/funktionen` no longer matches Next, so it leaves the visual run (`visual.parity.ts`). The smoke run (`smoke.parity.ts`, same `PAGES`) still applies (200, title, canonical): split the list into `PAGES` (smoke) and `VISUAL_PAGES` (without `/funktionen`), with a comment why.
- `scripts/layout-diff.ts`: drop `/funktionen` from the default `PAGES` and its "AnimationsSection `h-full`" line from the header.
- Keep `Funktionen/AnimationsSection.svelte`, `Funktionen/Grid.svelte`, `Hero/FunktionenHero.svelte` (and its kitchen-sink entry) until go-live (README, Old page). Lint/check must stay green with them unused by routes (they're imported by nothing but the kitchen sink, which is fine for Svelte components).
- `svelte-migration-plan/` changes: §4.3.

## 1.3 Content module

`$lib/landing/pages/funktionen/content.ts` holds every text and the example data of the page, word for word from the design.

- `hero`: eyebrow "Funktionen" (icon from the design's pill), H1 "Daten mit höchster" + accent part "Effizienz bearbeiten." (the design's `<em>`, in `--ok`), lead "Umstellung auf gesetzlich vorgeschriebene, fernablesbare Zähler und digitale Ablesung aller Verbräuche. Von der Installation bis zur fertigen Abrechnung.", `primary` "Demo buchen" (→ `DEMO_HREF`), `secondary` "So gehen wir vor" (→ `ROUTE_VORGEHEN`).
- `chart`: title "Lindenallee 12 · Whg. 7", sub "Verbrauch 2026", tag "Beispieldaten", the segmented label "Sparte", months axis `["Jan", "Mär", "Mai", "Jul", "Sep", "Nov"]`, `current: 9` (October, the highlighted bar), and three series:

| key | label | unit | delta | decimals | 12 values (Nov, Dec = 0) |
|---|---|---|---|---|---|
| `hz` | Heizung | kWh | "−8 % zum Vorjahr" | 0 | 171, 184, 162, 118, 61, 19, 12, 14, 74, 131, 0, 0 |
| `ww` | Warmwasser | m³ | "−4 % zum Vorjahr" | 1 | 2.4, 2.2, 2.3, 2.1, 2.0, 1.8, 1.7, 1.7, 2.0, 2.1, 0, 0 |
| `kw` | Kaltwasser | m³ | "−2 % zum Vorjahr" | 1 | 3.6, 3.3, 3.5, 3.4, 3.6, 3.9, 4.1, 4.0, 3.5, 3.4, 0, 0 |

  The KPI shown is `values[current]`, formatted `de-DE` with `decimals` (131 / 2,1 / 3,4). Bar heights are `value / max(values) * 100 %`, computed in the component.
- `badges`: four `{ icon, title, sub }`: "Gesetzeskonform" / "Nach Heizkostenverordnung", "Datenschutzkonform" / "Nach DSGVO", "SSL-Verschlüsselung" / "Für alle Verbindungen", "Server in Deutschland" / "Alle Daten bleiben hier". Section label (visually hidden heading or `aria-label`) "Sicherheit und Rechtskonformität".
- `services`: eyebrow "Was Heidi übernimmt", H2 "Vom Zähler bis zur Abrechnung." + muted "Alles aus einer Hand.", three `{ icon, title, text }`: Betriebskostenabrechnung, Regelmäßige Wartung, Service aus einer Hand.
- `dashboard`: eyebrow "Dashboard", H2 "Alle Verbräuche einer Wohnung" + muted "als Übersicht.", tablist label "Funktionen im Dashboard", `intervalMs: 6000`, three tabs `{ title, text }` ("Ihr Verbrauch auf einen Blick", "Datenbasierte Analyse", "Effiziente Betriebskostenabrechnung") and their panels:
  - `usage`: title "Whg. 7 · September", rows `{ label, share, value }`: Heizung 72 % "131 kWh", Warmwasser 44 % "2,1 m³", Kaltwasser 58 % "3,4 m³". (The design says September here and highlights October in the hero with the same values; content owner, gate §4.4.)
  - `analysis`: title "Liegenschaften · Heizung", rows `{ name, delta, up?, note? }`: Lindenallee 12 "−6 %", Gartenweg 3 "−3 %", Am Stadtpark 7 "+18 %" up with "Auffällig: Strang prüfen", Hofstraße 21 "−9 %".
  - `billing`: title "Heizkostenabrechnung 2026", four checklist lines ("Verbräuche aller Einheiten geprüft", "Rechnungen per DocuScan übernommen", "Kosten nach HKVO verteilt", "An Ihre Software übergeben"), result "Abrechnung erstellt".
  - Every panel carries the tag "Beispieldaten".
- `features`: eyebrow "Alle Funktionen", H2 "Was die Plattform" + muted "für Sie erledigt.", six `{ icon, title, text, href? }`, all without `href` today (README, open question 1):

| Card | Design target | Our `href` |
|---|---|---|
| Betriebskostenabrechnung | Heizkostenabrechnung | none (footer maps it to this page) |
| Heizkostenabrechnung | Heizkostenabrechnung | none (same) |
| Laufende Verbrauchsdaten | Dashboard | none |
| Dashboard | Dashboard | none |
| Immobilienmanagement | Schnittstellen | none |
| Benachrichtigungen | Verbrauchsinformation (uVI) | none (footer maps it to this page) |

- `steps`: eyebrow "Installation der Funkgeräte", H2 "Fünf Schritte." + muted "Ein Ansprechpartner.", five `{ title, text }`: Bedarfsanalyse / "Bestand prüfen, Geräte passend planen", Installation / "Mieter 14 Tage vorher informiert", Ablesen / "Per Funk, ohne Termin", Verbrauchsanalyse / "Im Dashboard je Einheit", Wartung / "Für zuverlässige Daten". Numbers derived from the index.
- `quote`: `key: "vitolus"`, section label "Kundenstimme".
- `faq`: title "Häufige Fragen zu den Funktionen", eight `{ question, answer, answerExpired? }` (plain text), the first with `answerExpired` (placeholder, README open question 3). `faqItems(now)` returns the items with the current answer, as `/hilfe`'s `content.ts` does with `isExpired`.
- `closing`: H2 "Jetzt auf digitale Funkzähler umstellen.", text "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.", submit label "Demo buchen". The video button's texts ("Demo buchen", "Mit Ihrem Ansprechpartner") are not in content until the button comes back (open question 2).

The design's links and where they go:

| Design link | Our target |
|---|---|
| Logo, nav, "Anmelden", header "Demo buchen" / "Angebot einholen" | The shared `LandingHeader` |
| Banner "Mehr erfahren" | `/upgrade-now` (`DEFAULT_CHROME`) |
| "Demo buchen" (hero, trust), floating "Erstgespräch vereinbaren" | `DEMO_HREF` (`#start`, the closing card's form) |
| "So gehen wir vor →" (hero) | `ROUTE_VORGEHEN` |
| Closing card's video button "Demo buchen" | Replaced by the signup form (open question 2) |
| Feature cards | none (table above) |
| "Mehr zu Sicherheit" (trust) | none yet (`TrustSeals` leaves it out) |

`content.test.ts`: no empty strings, no `XX`; each chart series has 12 values, `current` within range and a non-zero value at `current`; the dashboard has three tabs and three panels; every row `share` is in 0–100; six features, every `href` is undefined or a route constant from `$lib/routes.ts`; five steps; the quote key exists in the shared data; FAQ has 8 entries and `faqItems` swaps exactly the first answer from 1.1.2027 00:00 Berlin (`DEADLINE`); the KPI strings match the confirmed ones ("92 %", "14 Tage", "1 bis 2 Stunden" in the FAQ, "14 Tage" in step 2), so a changed KPI changes everywhere.

## 1.4 Icons

The design's inline stroke SVGs (pills: 5; badges: 4; service cards: 3; feature cards: 6; the checklist tick and the "Abrechnung erstellt" icon; the quote's verified badge) become `StrokeIcon` paths in `pages/funktionen/icons.ts`, drawn by `components/Icon.svelte` (as on `/vorgehen`). The pill icons go into `SectionHead`'s `icon` snippet. Check the shared icons first (`$lib/landing/components/icons/`): a tick or a shield that's already there is reused, not copied.

## 1.5 Shared pieces

- **`$lib/landing/autoTabs.svelte.ts`**: a class `AutoTabs` with the state and logic now in `vorgehen/sections/Steps.svelte` (`active`, `auto`, `seen`/`hovered`/`focused`/`hidden`, `running` as `$derived`, the one-timer `$effect`, `select(i, focus)`, `onkeydown` with the vertical key map, and an `attach` attachment arming auto-advance and the pause listeners). Constructor options: `count`, `intervalMs`, `threshold` (0.35 on `/vorgehen`, 0.15 here, the design's `onShow`), and an id prefix for focusing tabs. The `$effect` lives in the constructor (rune classes may create effects when constructed during component init). `Steps.svelte` switches to it with no change in behaviour; `e2e/vorgehen.e2e.ts` must pass unchanged. A `autoTabs.svelte.test.ts` covers the step timing with fake timers (advance, pause, resume restarts the interval, choice stops it).
- **`sections/CtaCard.svelte`**: optional `text?: string` (rendered as `<p>` under the H2 with the `.dcta-t p` style: `rgba(255,255,255,.66)`, 16.5 px) and optional `action?: Snippet` replacing the `ArrowLink`, plus `sectionId?` and `final?` for the `<section>` (`id="start"`, class `final` so `FloatingCta` hides there). With `text`, the left column is the design's `.dcta-t` (max 560 px, `flex: 1 1 420px`, 12 px gap) and the card's padding/gap are the `#dcta-css` ones (52 px / 28 px 40 px; 32 px 22 px below 640). Without the new props it renders exactly as today.

Update `CLAUDE.md`: a `/funktionen` bullet under "Current state" (replacing the "planned" one), the layout tree (`pages/funktionen/`, `autoTabs.svelte.ts`), `(landing-page)`'s page list, and that `(base)` no longer has `funktionen`.
