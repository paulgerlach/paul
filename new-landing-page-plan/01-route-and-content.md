# Phase 1: Route, link, content and the logic

## 1.1 Route and link

In one commit:

- `ROUTE_ENERGIEAUSWEIS = "/energieausweis"` in `$lib/routes.ts`, after `ROUTE_MUSTER_KUENDIGUNG`.
- The landing footer's "Energieausweis" (`$lib/landing/footerLinks.ts`, group "Ressourcen") gets `href: ROUTE_ENERGIEAUSWEIS`. No other page links to the design (README).
- `src/routes/(landing-page)/energieausweis/+page.server.ts`, as `/muster-kuendigung`'s:

```ts
seo: {
	// Drafts for the content owner (plan §4.4).
	title: "Energieausweis online beantragen: Verbrauchs- und Bedarfsausweis | Heidi Systems",
	description:
		"Verbrauchsausweis ab 69,95 €, Bedarfsausweis ab 99,95 €: rechtsgültig nach GEG, online selbst erfasst oder mit unserem Expertenteam per Video-Call oder vor Ort. Der Check zeigt in vier Fragen, welchen Ausweis Sie brauchen.",
	ogTitle: "Der Energieausweis für Ihre Liegenschaft.",
	noindex: true,
	keepCanonical: true,
},
landing: DEFAULT_CHROME,
finalForm: await emptySwitchForm("final"),
```

  and `handleSwitchSignup(event, { source: "energieausweis", page: ROUTE_ENERGIEAUSWEIS })`. No `now`: nothing on the page depends on the date. No `cache-control`.
- Sitemap: no entry until the cutover (gate §4.4).

## 1.2 Content module

`$lib/landing/pages/energieausweis/content.ts`, word for word from the design:

- `CHECK_ID = "check"`, `OFFERS_ID = "produkte"`.
- `hero`: pill "Energieausweis von Heidi", H1 "Der Energieausweis für Ihre Liegenschaft." + accent "Einfach online beantragen.", lead "Verbrauchs- oder Bedarfsausweis, rechtsgültig nach Gebäudeenergiegesetz. Online selbst erfasst oder mit unserem Expertenteam per Video-Call oder vor Ort.", CTAs "Welchen Ausweis brauche ich?" → `#check` and "Preise ansehen" → `#produkte`, ticks "Rechtsgültig nach GEG", "Schnell und einfach".
- `scale`: the card's label "Illustration einer Energieeffizienzskala", title "Energieausweis", sub "für Wohngebäude · gemäß GEG", badge "10 Jahre gültig", the unit "kWh/(m²·a)", the tag "Beispielwerte", the class labels "A+" … "H", two types `{ key: "v" | "b", title, sub, value }` ("Verbrauchsausweis" / "auf Basis gemessener Verbräuche" / 118, "Bedarfsausweis" / "auf Basis der Gebäudesubstanz" / 142), the `sr-only` template "{value} kWh/(m²·a), Effizienzklasse {class}" (ours).
- `check`: pill "Welchen Ausweis benötige ich?", H2 "Vier Fragen. " + muted "Dann wissen Sie es.", lead "Ob Verbrauchs- oder Bedarfsausweis hängt vom Gebäude ab: …", the source "Grundlage: Gebäudeenergiegesetz (GEG). Keine Rechtsberatung.", the wizard's label "Ausweis-Check" (ours, the card's `aria-label`), the step "Frage {n} von {total}", "Ergebnis", "Zurück", four questions `{ key, title, hint, answers: { value, label }[] }` (the design's `Q`), four results `{ key: "new" | "must" | "maybe" | "free", kind: "must" | "free", title, text }` (the design's `R`), the badges "Pflicht" / "Wahlfreiheit", "Passende Angebote ansehen" → `#produkte`, "Neu starten".
- `offers`: pill "Unsere Angebote", H2 "Vier Wege zum Energieausweis. " + muted "Transparente Preise.", the filter (label "Angebote filtern", ours; "Alle", "Verbrauchsausweis", "Bedarfsausweis"), four offers `{ type: "v" | "b", tier, recommended?, title, points: { lead, text }[], price, cta }` (tiers "Self Service" / "Full Service", "Empfehlung", "ab", "inkl. MwSt.", "Jetzt anfragen" → `DEMO_HREF`), the note "Alle Preise inklusive MwSt.".
- `compare`: pill "Verbrauch oder Bedarf?", H2 "Zwei Ausweise, " + muted "zwei Grundlagen.", the two columns' titles, five rows `{ label, v, b, strong? }` ("Grundlage", "Benötigte Daten", "Pflicht für", "Preis" with the offers' lowest prices, "Gültigkeit").
- `heidi`: pill "Mit Heidi", H2 "Die Verbräuche haben Sie schon.", text, CTA "Zum Dashboard" → `ROUTE_DASHBOARD`, three years `{ label, height }` ("Jahr 1" 72 %, "Jahr 2" 64 %, "Jahr 3" 58 %), the sum "36 Monate".
- `faq`: title "Häufige Fragen zum Energieausweis", four items (plain text answers).
- `closing`: H2 "Ihr Energieausweis, rechtsgültig nach GEG.", submit label "Jetzt anfragen".

`content.test.ts`: the H1; four questions with unique keys, the answer values `check.ts` reads; four results, the `kind` of each; four offers, one recommended, the types; the comparison's prices equal the cheapest offer of each type; every `href` a route or an anchor; no empty, doubled-space or untrimmed text (the split headings' first parts excepted); the FAQ's four questions.

## 1.3 Pure logic

- **`scale.ts`**: `CLASS_LIMITS = [30, 50, 75, 100, 130, 160, 200, 250]`, `scaleClass(value)` (0–8, the design's `cls()`), `markerLeft(value)` (percent of the bar: `(class + (value − lower) / (upper − lower)) / 9 × 100`, the upper bound of H 300, clamped to 0–100), `formatKwh(value)` (`de-DE`, no decimals). `scale.test.ts`: the limits (29 → A+, 30 → A, 249 → G, 250 → H), 118 → D at 51.1 %, 142 → E at 60 %, 0 → 0 %, 400 → 100 %, the format.
- **`check.ts`**: `type Step = { kind: "question"; index: number } | { kind: "result"; result: ResultKey }`, `answer(index, value)` → `Step` (the design's `next()`), `progress(step, total)` (percent: index / total, 100 at a result), `resultOffers(result, offers)` (the design's `rpick`: every offer on "free", the Bedarfsausweise otherwise; the first marked), `filterFor(result)` ("all" on "free", "b" otherwise). `check.test.ts`: every path through the four questions and its result, the progress, the offers and the filter of each result.

## 1.4 Images and files

None new. The floating CTA's avatars are the shared ones.
