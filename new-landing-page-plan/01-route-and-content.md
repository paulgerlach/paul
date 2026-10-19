# Phase 1: Route, links, content and SEO

## 1.1 Route and links

In one commit:

- `ROUTE_PRIVATE_VERMIETER = "/private-vermieter"` in `$lib/routes.ts`, after `ROUTE_ASSET_MANAGER`.
- The landing footer's "Private Vermieter" (`$lib/landing/footerLinks.ts`, group "Kunden") gets `href: ROUTE_PRIVATE_VERMIETER`. Every "Kunden" entry then has a page.
- `src/routes/(landing-page)/private-vermieter/+page.server.ts`, as `/asset-manager`'s:

```ts
seo: {
	// Drafts for the content owner (plan §4.4).
	title: "Messdienst für private Vermieter: Zähler, Ablesung und Heizkostenabrechnung ab 2 Wohnungen | Heidi Systems",
	description:
		"Heidi übernimmt für private Vermieter Funkzähler, Ablesung und die Heizkostenabrechnung nach HKVO, schon ab zwei Wohneinheiten, mit festem Ansprechpartner und ohne Ablesetermine.",
	ogTitle: "Ihre Wohnungen. Unser Messdienst. Ihre Ruhe.",
	noindex: true,
	keepCanonical: true,
},
```

  and `handleSwitchSignup(event, { source: "private-vermieter", page: ROUTE_PRIVATE_VERMIETER })`. No `cache-control`.
- **Other links to the page:** none (01 README, Links).
- Sitemap: no entry until the cutover (gate §4.4).

## 1.2 Content module

`$lib/landing/pages/private-vermieter/content.ts`, word for word from the design, a non-breaking space between a figure and its unit:

- `hero`: eyebrow "Für private Vermieter", H1 lines "Ihre Wohnungen." / "Unser Messdienst." / accent "Ihre Ruhe.", lead, "Angebot anfragen" → `DEMO_HREF`, "So funktioniert’s" → `#so`.
- `scene`: label "Funkzähler in Ihrer Wohnung", the two layers' labels, three captions `{ title, text }`, three points `{ label }` ("Wasserzähler: mehr erfahren" …), three tags, the hint "Punkte antippen für Details", the info card's three entries `{ kind, title, text, points[] }`.
- `stats`: "ab 2" Wohneinheiten, "1" fester Ansprechpartner für Ihre Wohnungen, "0" Ablesetermine in der Wohnung.
- `flow`: eyebrow, H2, five steps `{ label, text }` (the design's `TX`), and the five panels' example data (Montage at "Musterstraße 5 · 6 Wohnungen" …, the readings, the bars, the Abrechnung, the messages).
- `duo`: eyebrow, H2, two paragraphs. `benefits`: eyebrow, H2 (two lines), six cards `{ icon, title, text }`. `compare`: eyebrow, H2, the column heads, eight rows `{ label, values: [self, classic, heidi] }` with `yes` / `no` / `depends` and their labels ("Ja", "Nein", "Je nach Anbieter"), the note. `quotes`: eyebrow, H2, keys `werne`, `vitolus`, `gerhard`, the companies. `faq`: eyebrow, H2, six items (answer 6 with its `more` link). `closing`: H2 (two lines), text, submit label, "Häufige Fragen" → `#faq`.

`content.test.ts`: the H1; every `href` a route or an anchor on the page; no empty or untrimmed text; non-breaking spaces; three captions, points, tags and info entries; five steps and panels; six benefits; eight comparison rows with Heidi "yes" in each; the quotes word for word from `testimonials.ts`, each company the end of its role; six questions; the "92 %", "14 Tage" and "1 bis 2 Stunden" figures as on the other pages.

## 1.3 Images

Two new files, the design's own bytes: `owner.jpg` (720×710) and `talk.jpg` (800×643) in `src/lib/assets/landing/private-vermieter/`. The rest from the repo (README table).
