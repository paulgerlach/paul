# Phase 1: Route, links, content and SEO

## 1.1 Route and links

In one commit:

- `ROUTE_HKVO_LEITFADEN = "/hkvo-leitfaden"` in `$lib/routes.ts`, after `ROUTE_FRISTENRECHNER`.
- The landing footer's "HKVO-Leitfaden" (`$lib/landing/footerLinks.ts`, group "Ressourcen") gets `href: ROUTE_HKVO_LEITFADEN`.
- **Other links to the page** (README, Links): `/vorgehen`'s `HKVO_GUIDE_HREF` becomes `ROUTE_HKVO_LEITFADEN`, so `RemoteDuty` renders "Zum HKVO-Leitfaden →" (its type stays `string | undefined`, the `{#if}` stays). `e2e/vorgehen.e2e.ts` checks the link.
- `src/routes/(landing-page)/hkvo-leitfaden/+page.server.ts`, as `/fristenrechner`'s without `now`:

```ts
seo: {
	// Drafts for the content owner (plan §4.4).
	title: "HKVO-Leitfaden: Die Heizkostenverordnung einfach erklärt | Heidi Systems",
	description:
		"Pflichten nach der Heizkostenverordnung im Überblick: Verbrauchserfassung, Fernablesbarkeit, monatliche Verbrauchsinformation, Kostenverteilung, CO₂-Kosten und Kürzungsrechte der Mieter. Mit Paragrafen und Schnell-Check.",
	ogTitle: "Die Heizkostenverordnung. Einfach erklärt.",
	noindex: true,
	keepCanonical: true,
},
landing: DEFAULT_CHROME,
finalForm: await emptySwitchForm("final"),
```

  and `handleSwitchSignup(event, { source: "hkvo-leitfaden", page: ROUTE_HKVO_LEITFADEN })`. No `cache-control`.
- Sitemap: no entry until the cutover (gate §4.4).

## 1.2 Content module

`$lib/landing/pages/hkvo-leitfaden/content.ts`, word for word from the design:

- `hero`: pill "HKVO-Leitfaden" (document icon), H1 "Die Heizkosten­verordnung." (soft hyphen) + accent "Einfach erklärt.", lead, CTAs "Leitfaden lesen" → `#leitfaden`, "Kürzungsrechte" → `#kuerzung` (both with ↓), ticks "9 Themen", "Mit Paragrafen", "Schnell-Check".
- `check`: title "Schnell-Check", sub "Wie gut ist Ihr Bestand aufgestellt?", the card's label "Schnell-Check Heizkostenverordnung", "Ja" / "Nein", five questions `{ key, question, law, risk }` (`erf` § 4 "Kürzungsrecht bis 15 %", `fern` § 5 "Ab 2027: Kürzungsrecht 3 %", `uvi` § 6a "Kürzungsrecht 3 %", `vert` § 7 "Abrechnung angreifbar", `frist` § 556 BGB "Nachzahlung entfällt"), the texts `hint` "Beantworten Sie die Fragen mit Ja oder Nein.", `ok` "Alles erfüllt. Ihr Bestand ist HKVO-konform aufgestellt.", `risks` "Mögliche Risiken", `open(n)` "Noch N Fragen offen." / "Noch 1 Frage offen.", the link "Mit Heidi alle Punkte erfüllen" → `DEMO_HREF` (design id `44SBXKXJaSp6bvGMnbpZj6`).
- `guide`: the label "Leitfaden", the TOC's "Inhalt", nine articles `{ id, num, short, law, title, body: Block[] }` with `short` the TOC text (the article's H2; "Was bei Verstößen droht" etc.) and blocks `{ p }` (may hold `<a>`), `{ list: string[] }`, `{ note }`; article 09's last paragraph is the link "Zur Übersicht der Kürzungsrechte ↓" → `#kuerzung`.
- `penalties`: pill "§ 12 HeizkostenV" (warning icon), H2 "Wann Mieter kürzen dürfen.", three cards `{ value, title, text }`, the line `cta` "Prüfen Sie, ob Ihre Mieter kürzen könnten:" with "Heizkostenabrechnung prüfen" without `href` (design id `FQ6egKN8KrFwGUMZDUaavJ`).
- `faq`: title "Häufige Fragen", five items (`FaqItem`); answer 2's "Jetzt noch umrüsten →" as `more` → `ROUTE_UPGRADE_NOW`; answer 3's "Heidi Mieterportal" as `<a href>` → `ROUTE_MIETERPORTAL`.
- `closing`: H2 "HKVO-konform. Ohne Mehraufwand.", text "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands." (the same as `/schnittstellen`'s and `/fristenrechner`'s), submit label "Demo buchen".

`content.test.ts`: the H1; every `href` a route or an anchor on the page (the TOC's anchors are the article ids, in order); no empty or untrimmed text; five questions with unique keys, nine articles numbered 01–09 with unique ids and the hero tick "9 Themen" matching their count, three penalties, five FAQ items; every TOC text equals its article's H2; the closing text equal to `/fristenrechner`'s; the hidden CTA without `href`.

## 1.3 Pure logic

**`check.ts`** (the design's `upd()`): `type Answer = boolean | undefined`; `score(answers)` → the number of "Ja"; `outcome(questions, answers)` →

- `{ kind: "hint" }` while nothing is answered,
- `{ kind: "ok" }` when all are "Ja",
- `{ kind: "risks", risks: { risk, law }[] }` as soon as one is "Nein" (in question order, also while others are open),
- `{ kind: "open", left }` when only "Ja" answers so far;

`ringDash(score, total)` → the ring's `stroke-dasharray` ("40 100"); `openText(left)` with the singular.

**`toc.ts`** (the design's `spy()`): `activeIndex(tops, line)` → the last index whose top is above `line` (0 when none); `readProgress(bodyTop, bodyHeight, line)` → `(line − bodyTop) / bodyHeight` clamped to 0–1; the line is 30 % of the viewport height.

`check.test.ts` and `toc.test.ts`: every branch and boundary (nothing answered, one "Nein" first, all "Ja", four "Ja" and one open, the singular; `activeIndex` with no top above the line, every top above it, a top exactly on it; `readProgress` before, inside and after the body, a zero height).

## 1.4 Images

None new: the page has no photo. The floating CTA's avatars and the closing card's video are the repo's (README table).
