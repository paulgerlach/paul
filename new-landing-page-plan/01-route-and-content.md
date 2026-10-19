# Phase 1: Route, links, content and SEO

## 1.1 Route and links

In one commit:

- `ROUTE_EINSPARRECHNER = "/einsparrechner"` in `$lib/routes.ts`, after `ROUTE_HKVO_LEITFADEN`.
- The landing footer's "Einsparrechner" (`$lib/landing/footerLinks.ts`, group "Ressourcen") gets `href: ROUTE_EINSPARRECHNER`.
- **Other links to the page** (README, Links): the second audience card's "Zum Einsparrechner" on `/hausverwaltung` and `/mietverwaltung` gets `href: ROUTE_EINSPARRECHNER` (design id comment `S3p5jbNkohWnWeZpfR75j9`, as the Fristenrechner card has its id), so `uv/Audience` renders the button. `e2e/hausverwaltung.e2e.ts` and `e2e/mietverwaltung.e2e.ts` check the link instead of its absence.
- `src/routes/(landing-page)/einsparrechner/+page.server.ts`, as `/hkvo-leitfaden`'s:

```ts
seo: {
	// Drafts for the content owner (plan §4.4).
	title: "Einsparrechner: Was der Messdienstwechsel Ihrem Bestand bringt | Heidi Systems",
	description:
		"Rechnen Sie mit Ihren eigenen Zahlen: wie viel Arbeitszeit Heidi Ihrem Team bei Ablesung, Mieterfragen und Heizkostenabrechnung abnimmt und welches Kürzungsrisiko nach § 12 HeizkostenV Sie vermeiden.",
	ogTitle: "Was der Wechsel Ihrem Bestand bringt.",
	noindex: true,
	keepCanonical: true,
},
landing: DEFAULT_CHROME,
finalForm: await emptySwitchForm("final"),
```

  and `handleSwitchSignup(event, { source: "einsparrechner", page: ROUTE_EINSPARRECHNER })`. No `cache-control`.
- Sitemap: no entry until the cutover (gate §4.4).

## 1.2 Content module

`$lib/landing/pages/einsparrechner/content.ts`, word for word from the design:

- `hero`: pill "Einsparrechner" (the euro icon), H1 "Was der Wechsel" + accent "Ihrem Bestand bringt.", lead "Rechnen Sie mit Ihren eigenen Zahlen: wie viel Arbeitszeit Heidi Ihrem Team abnimmt und welches Kürzungsrisiko nach Heizkostenverordnung Sie vermeiden."
- `CALC_ID = "rechner"`.
- `calculator.groups`: three groups `{ num, title, sub? }` ("Ihr Bestand"; "Ihr Aufwand pro Liegenschaft und Jahr" with "Was Ihr Team heute selbst erledigt und Heidi übernimmt."; "Status nach Heizkostenverordnung").
- `calculator.fields`: seven sliders `{ id, group, label, unit, min, max, step, default }`, the design's: `we` "Wohneinheiten" 2–3.000 (1) 240 "WE"; `lg` "Liegenschaften" 1–300 (1) 12 (no unit); `hk` "Heiz- und Warmwasserkosten pro Einheit" 300–3.000 (10) 1.000 "€ / Jahr"; `ss` "Stundensatz Ihres Teams" 20–120 (1) 45 "€ / h"; `a1` "Ablesetermine koordinieren und Mieter informieren" 0–20 (0,5) 4 "h"; `a2` "Rückfragen von Mietern zu Verbrauch und Abrechnung" 0–20 (0,5) 3 "h"; `a3` "Heizkostenabrechnung prüfen, nacharbeiten, übertragen" 0–30 (0,5) 6 "h".
- `calculator.toggles`: `fern` "Zähler noch nicht fernablesbar" / "Ab 2027: Kürzungsrecht 3 %"; `uvi` "Keine monatliche Verbrauchsinfo" / "Kürzungsrecht 3 %".
- `calculator.result`: "Ihr Vorteil pro Jahr", the bars "Arbeitszeit, die Heidi übernimmt" and "Vermiedenes Kürzungsrisiko", "Stunden pro Jahr", "Kein Risiko ausgewählt", the risk line's parts ("× 3 % Kürzungsrecht auf", "€ Heizkosten"), the figures "Arbeitstage pro Jahr" and "pro Einheit und Jahr", the button "Angebot für Ihren Bestand" → `DEMO_HREF` (design id `44SBXKXJaSp6bvGMnbpZj6`), the note "Ergebnis auf Basis Ihrer Angaben, ohne Heidi-Kosten. Ihr individuelles Angebot erhalten Sie in der Demo.", and the `sr-only` status template (README, Live region).
- `method`: pill "Transparent gerechnet" (calculator icon), H2 "So entsteht das Ergebnis.", three cards `{ icon, title, text, formula }`: "Arbeitszeit" (`Stunden × Liegenschaften × Stundensatz`), "Kürzungsrisiko" (`Heizkosten × Einheiten × 3 %`), "Was Heidi übernimmt" (`Ihr Team: nur noch prüfen`).
- `faq`: title "Häufige Fragen", four items (`FaqItem`); answer 4's "Kündigungsfrist berechnen →" as `more` → `ROUTE_FRISTENRECHNER` (design id `LWEbZPCoSDLT1D59BaULyE`).
- `closing`: H2 "Ihre Zahlen. Ihr Angebot.", text "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands." (the same as `/fristenrechner`'s and `/hkvo-leitfaden`'s), submit label "Demo buchen".

`content.test.ts`: the H1; seven fields with unique ids in three groups, each default inside its range and on its step; two toggles; three cards; four FAQ items; every `href` a route or `#start`; no empty or untrimmed text; the closing text equal to `/fristenrechner`'s; the method cards' formulas name the inputs they use (README, Math).

## 1.3 Pure logic

**`savings.ts`** (the design's `calc()`): `type Inputs = Record<FieldId, number>`, `savings(inputs, risks)` (risks = the number of toggles on) →

```ts
{ hours, time, risk, total, days, perUnit, bars: { time, risk } }   // bars in percent, 0–100
```

with `perUnit = 0` for no units (the design's guard; the slider's minimum is 2), `riskBase = we × hk`, the constant `CUT_RATE = 0.03` (shared with `/upgrade-now`'s `calculator.ts`). Formatting helpers: `formatValue(n)` (one decimal only for a fraction, German), `hoursText(hours)`, `riskText(count, base)` ("2 × 3 % Kürzungsrecht auf 240.000 € Heizkosten", or "Kein Risiko ausgewählt").

`savings.test.ts`: the defaults (156 h, 7.020 €, 0 €, 7.020 €, 19,5 days shown as 20, 29,25 € shown as 29), one and two toggles (7.200 / 14.400 € risk), zero hours (time bar 0 %, risk bar 100 %), all zero (both bars 0 %, the 1 € floor), half hours ("4,5"), the texts.

## 1.4 Images

None new: the page has no photo. The floating CTA's avatars and the closing card's video are the repo's (README table).
