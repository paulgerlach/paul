# Phase 1: Route, links, content and SEO

## 1.1 Route and links

In one commit:

- `ROUTE_NEUIGKEITEN = "/neuigkeiten"` in `$lib/routes.ts`, after `ROUTE_PRIVATE_VERMIETER`.
- The landing footer's "Neuigkeiten" (`$lib/landing/footerLinks.ts`, group "Ressourcen") gets `href: ROUTE_NEUIGKEITEN`.
- `src/routes/(landing-page)/neuigkeiten/+page.server.ts`, as `/schnittstellen`'s:

```ts
seo: {
	// Drafts for the content owner (plan §4.4).
	title: "Neuigkeiten von Heidi: Produkt-Updates, Werkzeuge und Fristen | Heidi Systems",
	description:
		"Neue Funktionen, kostenlose Werkzeuge und Partnerschaften von Heidi auf einen Blick, dazu die Fristen der Heizkostenverordnung. Damit Sie wissen, was sich für Ihre Verwaltung ändert.",
	ogTitle: "Neuigkeiten von Heidi.",
	noindex: true,
	keepCanonical: true,
},
```

  and `handleSwitchSignup(event, { source: "neuigkeiten", page: ROUTE_NEUIGKEITEN })`. No `cache-control`, no FAQ (the design has none, so no FAQPage JSON-LD).
- **Other links to the page:** none (README, Links).
- Sitemap: no entry until the cutover (gate §4.4).

## 1.2 Content module

`$lib/landing/pages/neuigkeiten/content.ts`, word for word from the design:

- `hero`: pill "Neuigkeiten" (the sparkle icon), H1 "Neuigkeiten" + accent "von Heidi.", lead, `featured` (a story, below).
- A story: `{ topic, title, text?, image, more?: { text, href } }` with `topic` one of `p` / `w` / `u` (Produkt, Werkzeuge, Unternehmen). `more` only where the target exists (README, Links), with the design id of the target in a comment either way. The featured story: badge "Neu", topic "Produkt", title, text, "Zur Auswertung" (no page yet).
- `news`: H2 "Neueste Meldungen", the filter's label "Thema filtern" and its options (Alle, Produkt, Werkzeuge, Unternehmen), nine stories in the design's order, the blog link "Zum Blog mit allen Artikeln" → `ROUTE_BLOG`.
- `deadlines`: pill "Gesetz & Fristen" (calendar icon), H2 "Was die Heizkostenverordnung verlangt." + muted "Und bis wann.", four rows `{ icon, title, text, href? }`.
- `closing`: H2 "Neugierig, wie Heidi für Ihren Bestand aussieht?", text "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands." (the same as `/schnittstellen`'s), submit label "Demo buchen".

`filter.ts` (pure): `TOPICS` (`all`, `p`, `w`, `u` with their labels), `shows(topic, story)`, `countText(n)` ("9 Meldungen", "1 Meldung").

`content.test.ts`: the H1; every `href` a route or an anchor on the page; no empty or untrimmed text; nine stories (six Produkt, one Werkzeuge, two Unternehmen); four rows; each story's topic among the filter's; the closing text equal to `/schnittstellen`'s; the more-link texts word for word. `filter.test.ts`: the counts per topic, `countText`.

## 1.3 Images

One new file, the design's own bytes: `portfolio-checker.webp` (1300×1300) in `src/lib/assets/landing/neuigkeiten/`. The rest from the repo (README table).
