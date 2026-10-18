# Phase 1: Route, links, content and SEO

## 1.1 Route and links

Done in the planning commit: `ROUTE_VERBRAUCHSINFORMATION = "/verbrauchsinformation"` in `$lib/routes.ts`, and the landing footer's "Verbrauchsinformation (uVI)" (`$lib/landing/footerLinks.ts`, group "Produkt") points at it instead of `ROUTE_FUNKTIONEN`. Every landing page renders this footer. The site footer (`Footer/footerLinks.ts`) has no uVI entry and stays as it is.

Phase 1, in one commit with the route:

- `src/routes/(landing-page)/verbrauchsinformation/+page.server.ts`, modelled on `mieterportal/+page.server.ts`:

```ts
export const load: PageServerLoad = async () => {
	const now = Date.now();
	return {
		seo: {
			// Drafts for the content owner (plan §4.4).
			title:
				"uVI: unterjährige Verbrauchsinformation für Ihre Mieter | Heidi Systems",
			description:
				"Heidi stellt die monatliche Verbrauchsinformation nach § 6a HeizkostenV automatisch für jede Wohnung bereit: Verbrauch in kWh, Vergleich mit Vormonat, Vorjahresmonat und Durchschnitt. Ohne Aufwand für Ihr Team.",
			ogTitle: "uVI: Unterjährige Verbrauchsinformation mit Heidi",
			// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
			noindex: true,
			keepCanonical: true,
		},
		landing: DEFAULT_CHROME,
		faq: faqItems(now),
		figures: figures(now),
		finalForm: await emptySwitchForm("final"),
	};
};

export const actions: Actions = {
	default: (event) =>
		handleSwitchSignup(event, {
			source: "verbrauchsinformation",
			page: ROUTE_VERBRAUCHSINFORMATION,
		}),
};
```

  The page sets no `cache-control`, because the layout does. `leads.source` is free text, so the new source needs no migration; check that the Make.com `switchinquiry` scenario doesn't filter on known `page` values (gate §4.4).
- **Other links to the page:**
  - `pages/mieterportal/content.ts`: the FAQ's "Mehr zur uVI" → `ROUTE_VERBRAUCHSINFORMATION` (the `/mieterportal` design links it to this page's design).
  - `pages/hilfe/content.ts`: answer `uvi`'s "Mehr zur uVI" → `ROUTE_VERBRAUCHSINFORMATION`. Its `content.test.ts` accepts any route constant (check). `uvi-fehlt` has no `more` and gets none (not in the `/hilfe` design).
  - `sections/region/Duo.svelte`: the uVI card's "Mehr erfahren" (today `ROUTE_FUNKTIONEN`, both cards). Read the saved Berlin design first: if its uVI card links to the uVI design, it gets `ROUTE_VERBRAUCHSINFORMATION`; the portfolio card stays. Template change, so every city and the Germany page at once.
  - Not changed: `/funktionen`'s "Benachrichtigungen" card (no `href` until that page's open question 1); "Heizkostenabrechnung" in the footer (still `/funktionen`, no page of its own).
- **Tests that see the change:** the footer-link specs (every internal footer link resolves) now include `/verbrauchsinformation`; `e2e/mieterportal.e2e.ts` and `e2e/hilfe.e2e.ts` if they assert `/funktionen` for "Mehr zur uVI" (search `e2e/` for "uVI" and `/funktionen`).
- `+page.svelte`: `<main id="content" class="vi" {@attach reveal()}>` with `UvMain` around sections 1–12 in design order, `Trust` after it, and `FloatingCta` after `</main>`. The wrapper sets the reveal styles (`.rv`, the design's threshold 0.15) and the `#hs-css` H2 sizes, scoped as on `/mieterportal` (`section h2[id]` in the 621–1040 and ≤ 620 queries, specific enough to beat the `tokens.css` heading reset; the rows and the audience cards keep their own sizes).
- Sitemap: no entry until the cutover (gate §4.4).

## 1.2 Content module

`$lib/landing/pages/verbrauchsinformation/content.ts` holds every text and the example data, word for word from the design, in the shapes the shared `uv` components take (02 §2.1). `NB` (non-breaking space) between figures and units ("131 kWh", "11 %", "3 %") and after "§", as on `/mieterportal`.

- `hero`: `srTitle` "uVI: Unterjährige Verbrauchsinformation mit Heidi", `word` "uVI", `lead` "Unterjährige Verbrauchs­information. Jeden Monat automatisch bei Ihren Mietern." (soft hyphen as designed), `primary` "Demo buchen" → `DEMO_HREF`, `secondary` "Mehr erfahren" → `#inhalt`.
- `mock` (the hero's middle panel): `label` "Beispiel: uVI im Mieterportal", `brand` "Heidi", `nav` Verbrauch (active) / Dokumente / Mitteilungen with icons, `navFoot` "Mieterportal", `tag` "Beispieldaten", `title` "Ihr Verbrauch im " + `month` "September" + ".", `sub` "Heizung · Wohnung 2. OG links", `kpis` `[{ label: "Letzter Monat", value: 131 }, { "Vormonat", 96 }, { "Vorjahresmonat", 148 }, { "Durchschnitt", 142 }]` with `unit` "kWh", `bars` `[62, 128, 171, 184, 162, 131, 74, 22, 15, 14, 96, 131]` (October to September, the last one highlighted) on a fixed scale `barMax: 190`, `monthLabels` Okt / Jan / Apr / Jul / Sep.
- `statement`: label "Worum es geht", text "Seit 2022 müssen Mieter mit fernablesbaren Zählern jeden Monat über ihren Verbrauch informiert werden. Heidi übernimmt das für Sie. Jeden Monat, für jede Wohnung, mit allem, was die Heizkostenverordnung verlangt. Ihre Mieter sehen, wo sie stehen. Ihr Team hat damit keine Arbeit."
- `rows`: label "So funktioniert die uVI mit Heidi", default CTAs "Demo buchen" → `DEMO_HREF` and "Häufige Fragen" → `#faq`, four items `{ tag, title: [a, b], paragraphs, tile, tone, secondary? }`:
  - "Pflicht" / "Jeden Monat." "Für jede Wohnung." / "Sind fernablesbare Zähler verbaut, ist die monatliche Verbrauchsinformation Pflicht (§ 6a HeizkostenV)." + "Heidi liest die Zähler per Funk aus und stellt die uVI jeden Monat automatisch bereit. Ohne Termin, ohne Aufwand für Sie." / `calendar`, mint.
  - "Inhalt" / "Alles drin, was" "§ 6a verlangt." / "Jede Information zeigt den Verbrauch des letzten Monats in Kilowattstunden und vergleicht ihn mit dem Vormonat, dem Vorjahresmonat und einem Durchschnittsnutzer." + "Vollständig, verständlich und für jede Wohnung einzeln." / `doc`, stone.
  - "Mieter" / "Verständlich statt" "Zahlenkolonne." / ["Ihre Mieter bekommen eine Mitteilung und sehen ihren Verbrauch im ", { text: "Mieterportal", href: ROUTE_MIETERPORTAL }, ". Mit klaren Vergleichen statt Ablesewerten."] + "Wer seinen Verbrauch kennt, wird von der Jahresabrechnung nicht überrascht. Das spart Rückfragen bei Ihnen." / `phone`, ink / `secondary` "Zum Mieterportal" → `ROUTE_MIETERPORTAL`.
  - "Rechtssicher" / "Kein Kürzungsrecht." "Keine Diskussion." / "Fehlt die Verbrauchsinformation, dürfen Mieter ihren Anteil an den Heizkosten um 3 % kürzen (§ 12 HeizkostenV)." + "Mit Heidi ist jede Information dokumentiert. In der Abrechnung gibt es dafür keinen Abzug." / `bill`, mint.
- `calendar`: short labels "Jan" … "Dez", long names "Januar" … "Dezember" for the note (`MONTHS` from `deadline.ts` if it holds the German names; check), `current: 9` (October), `done` "bereitgestellt", `doing` "wird erstellt", `open` "offen", `noteDone` "{x} bereitgestellt", `noteDoing` "{x} wird erstellt". The note uses the long names here ("Oktober wird erstellt"), the short ones on `/mieterportal` (the `long` field is optional, 02 §2.1).
- `doc`: title "Verbrauchsinformation September", sub "Heizung · in kWh", rows Letzter Monat 131 (82 %), Vormonat 96 (60 %), Vorjahresmonat 148 (92 %), Durchschnittsnutzer 142 (89 %), result "Alle Pflichtangaben enthalten". Same rows as `/mieterportal`'s tile; the widths are the design's, not computed.
- `phone`: time "9:41", app "Heidi", title "Ihre Verbrauchsinfo September", sub "Jetzt im Mieterportal ansehen", label "Heizung im September", value "131 kWh", `comparisons` ["11 % unter Vorjahresmonat", "8 % unter Durchschnitt"], bars = the mock's last ten (`mock.bars.slice(2)`, derived, not repeated) on the scale 190.
- `bill`: `without` "Ohne uVI", `with` "Mit Heidi", rows `[{ kind: "base", label: "Heizkosten, Ihr Anteil", value: "1.240,00 €" }, { kind: "cut", label: "Kürzung § 12 HeizkostenV (3 %)", value: "−37,20 €" }, { kind: "ok", label: "uVI monatlich bereitgestellt" }]`, `sum` `{ label: "Abgerechnet", from: 1202.8, to: 1240 }` (formatted `de-DE` with two decimals and " €"). The base row shows in both states (on `/mieterportal` every row belongs to one side).
- `rotator`: label "Inhalte der uVI", lead "Jeden Monat neu:", phrases "Ihr Verbrauch in kWh", "Vergleich zum Vormonat", "Vergleich zum Vorjahresmonat", "Vergleich zum Durchschnitt", 2300 ms.
- `numbers`: H2 "Die uVI in Zahlen"; `first` 12 "×" "Verbrauchsinformationen pro Jahr und Wohnung" (count); the photo second (alt ""); `rest`: 3 "%" "Kürzungsrecht für Mieter, wenn die uVI fehlt (§ 12 HeizkostenV)" (count); 3 "Vergleiche je Information: Vormonat, Vorjahresmonat, Durchschnitt" (count); "31.12.2026" compact "Bis dahin müssen alle Zähler fernablesbar sein" (`expired` variant, §1.3); 0 "Handgriffe für Ihr Team" (no count).
- `audience`: label "Für wen"; "Sie sind Verwalter?" / "Heidi stellt die uVI für Ihren ganzen Bestand bereit, rechnet nach HKVO ab und hält Ihnen die Mieterfragen vom Tisch." / cta "Erfahren Sie mehr" without `href` / image `koeln` (Verwalter) ; "Sie sind Mieter?" / "Prüfen Sie Ihre Heizkostenabrechnung kostenlos. Fehlt die monatliche Verbrauchsinformation, steht Ihnen eventuell eine Kürzung zu." / cta "Zum Mieter-Check" without `href` / image `contact` (open question 3). The second text is `/mieterportal`'s word for word.
- `quotes`: H2 ["Transparente Verbräuche.", "Unsere Kunden sagen es selbst."], keys `vitolus`, `werne`, `gerhard` (the design's quotes, names, roles and initials match `$lib/landing/data/testimonials.ts`; `content.test.ts` checks the three quotes against the design's text).
- `picture`: label "Heidi", caption ["Klare Verbräuche,", "ruhige Mieter."].
- `faq`: title "Häufige Fragen", six `FaqItem`s (answer 5 with `answerExpired`, §1.3):
  - "Was ist die unterjährige Verbrauchsinformation (uVI)?" – "Eine monatliche Mitteilung an jeden Mieter über seinen Heiz- und Warmwasserverbrauch. Sie soll helfen, den eigenen Verbrauch besser einzuschätzen, nicht erst mit der Jahresabrechnung."
  - "Ab wann ist die uVI Pflicht?" – "Seit dem 1. Januar 2022 müssen Gebäudeeigentümer ihre Mieter monatlich informieren, sobald fernablesbare Zähler oder Heizkostenverteiler verbaut sind (§ 6a HeizkostenV)."
  - "Was muss in der uVI stehen?" – "Der Verbrauch des letzten Monats in Kilowattstunden, ein Vergleich mit dem Vormonat und dem Vorjahresmonat (soweit Daten vorliegen) sowie ein Vergleich mit einem Durchschnittsnutzer derselben Nutzerkategorie."
  - "Was passiert, wenn die uVI fehlt?" – "Mieter dürfen ihren Anteil an den Heizkosten in der Abrechnung um 3 % kürzen (§ 12 HeizkostenV). Das gilt auch, wenn keine fernablesbaren Geräte verbaut sind, obwohl es Pflicht wäre."
  - "Meine Zähler sind noch nicht fernablesbar. Was nun?" – "Bestehende Geräte müssen bis zum 31. Dezember 2026 nachgerüstet oder ersetzt werden. Heidi baut fernablesbare Funkzähler ein und übernimmt danach die uVI." `more` "Jetzt noch umrüsten" → `ROUTE_UPGRADE_NOW`.
  - "Wie erhalten meine Mieter die uVI?" – `Heidi stellt die Verbrauchsinformation jeden Monat im <a href="${ROUTE_MIETERPORTAL}">Mieterportal</a> bereit und benachrichtigt Ihre Mieter. Für Sie entsteht dabei kein Aufwand.` (open question 5).
- `closing`: H2 "uVI abhaken. Jeden Monat.", text "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.", `submitLabel` "Demo buchen".

`content.test.ts`:
- the H1's hidden text and the word; four rows with two title lines and two paragraphs each; six questions, none empty; every `href` is a route constant or an anchor that exists on the page (`#inhalt`, `#faq`, `#start`);
- the example data agree: the mock's last bar and first KPI are the phone's value and the doc's "Letzter Monat" (131), the second-last bar is "Vormonat" (96), the KPIs equal the doc's four values, the phone's percentages round from them (131 vs 148 → 11 %, 131 vs 142 → 8 %), the bill's cut is 3 % of the base and `sum.from = base − cut`, the calendar's `current` is the month after the mock's month;
- `faqItems(now)` and `figures(now)` return the current texts before `DEADLINE` and the expired ones from it on.

## 1.3 The deadline texts

Both are chosen on the server from `now`, like `/funktionen`'s FAQ:

- `faqItems(now: number): FaqItem[]`: the six items, answer 5 replaced by `answerExpired` when `isExpired(now)`. Placeholder until the content owner writes it (gate §4.4), e.g. "Seit dem 1. Januar 2027 müssen alle Zähler fernablesbar sein. Heidi baut fernablesbare Funkzähler ein und übernimmt danach die uVI." Its `more` stays.
- `figures(now: number)`: the bento's five figures, the date figure with its `expired` text when `isExpired(now)` (placeholder, e.g. value "1.1.2027", text "Seitdem müssen alle Zähler fernablesbar sein").

The rest of the copy is deadline-independent ("Seit 2022 …", "Seit dem 1. Januar 2022 …").

## 1.4 Images

Imported from where they are (no copies), as `/mieterportal` imports from `vorgehen/`:

| Use | Import | Notes |
|---|---|---|
| Hero left | `$lib/assets/landing/vorgehen/building-wide.webp?enhanced` | `sizes="25vw"`, eager (above the fold, but hidden ≤ 620 px) |
| Hero right | `$lib/assets/landing/vorgehen/office.webp?enhanced` | the design shows a taller crop of the same photo: set `object-position` so the face sits where the design has it at 1440 px |
| Bento | `$lib/assets/landing/cities/leipzig/references.jpg?enhanced` | cover |
| Verwalter | `$lib/assets/landing/cities/koeln/hero.jpg?enhanced` | |
| Mieter | `$lib/assets/landing/region/contact.webp?enhanced` | square crop in the design: `object-position` to match |
| Picture | `$lib/assets/landing/cities/gera/references.jpg?enhanced` | |

All decorative (`alt=""`), as in the design. The shared `uv` components take images as `Picture` props.

## 1.5 Link mapping

| Design link | Here |
|---|---|
| `44SBXKXJaSp6bvGMnbpZj6` ("Demo buchen" ×5, the video button, the floating CTA "Erstgespräch vereinbaren") | `DEMO_HREF` (`#start`, the closing form); the floating CTA as on the other pages |
| `#inhalt` ("Mehr erfahren"), `#faq` ("Häufige Fragen" ×3) | the same anchors |
| `5HTo3o7mYMjqUxPXcEyuEy` (row 3's inline "Mieterportal" and "Zum Mieterportal", answer 6's "Mieterportal") | `ROUTE_MIETERPORTAL` |
| `Jp8tqY82m7FZqMnWU4z9x9` (answer 5's "Jetzt noch umrüsten", banner "Mehr erfahren") | `ROUTE_UPGRADE_NOW` (the banner through `DEFAULT_CHROME.bannerHref`) |
| `EzsbDRGnCk2Z11QnjE3NgX` ("Erfahren Sie mehr": the Hausverwaltung page) | none: button hidden (open question 3) |
| `FQ6egKN8KrFwGUMZDUaavJ` ("Zum Mieter-Check") | none: button hidden (open question 3) |
| The trust block's "Mehr zu Sicherheit" | `ROUTE_SICHERHEIT` (the shared `TrustSeals`) |
| Logo, nav, the design's footer | the shared landing header and footer |
