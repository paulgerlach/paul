# Phase 1: Route, links, content, map data and shared pieces

## 1.1 Route and links

One commit, so no link ever points at a 404:

- `ROUTE_SICHERHEIT = "/sicherheit"` in `$lib/routes.ts`.
- **Footer** (`$lib/landing/footerLinks.ts`): both `{ text: "Sicherheit" }` entries get `href: ROUTE_SICHERHEIT`: the one in `companyLinks` (under the logo) and the one in the "Plattform" group. Every landing page renders this footer, so the link works from all of them at once. The site footer (`Footer/footerLinks.ts`) has no "Sicherheit" entry and stays as it is.
- **Trust block** (`$lib/landing/sections/TrustSeals.svelte`): `SECURITY_HREF` becomes `ROUTE_SICHERHEIT` (and its comment goes). A new prop `securityLink = true`; `false` hides the link (this page's wrapper, open question 2). The eight pages that use the block show "Mehr zu Sicherheit" from then on.
- **FAQ answers:**
  - `pages/mieterportal/content.ts`: "Wo liegen die Daten?" → `more: { text: "Mehr zu Sicherheit", href: ROUTE_SICHERHEIT }` (drop the "No security page yet" comment).
  - `pages/hilfe/content.ts`: "Wo werden meine Daten verarbeitet?" → `more: { text: "Sicherheit & Datenschutz", href: ROUTE_SICHERHEIT }`. Its `content.test.ts` accepts any route constant in `$lib/routes.ts` (check).
  - `pages/vorgehen/content.ts`: "Wo liegen unsere Daten?" gets the design's `more: { text: "Mehr zu Sicherheit", href: ROUTE_SICHERHEIT }` (drop the comment). `/vorgehen` uses the shared `Faq`'s `cards` variant, which doesn't render `more` today: add it there, styled like the default variant's `.more` (check against the `/vorgehen` design's link in the card; if the design has none, the link is the plain `.more` under the answer).
- **Tests that assert the missing link:** `e2e/mieterportal.e2e.ts` (`getByText("Mehr zu Sicherheit")` → count 0) now expects the FAQ's link and the trust block's link, both to `/sicherheit`. Search `e2e/` for other "Sicherheit" assertions (the region and `/dashboard` specs check that every footer link resolves: they now include `/sicherheit`, which must return 200).
- `src/routes/(landing-page)/sicherheit/+page.server.ts`, modelled on `funktionen/+page.server.ts`:

```ts
export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title: "Sicherheit & Datenschutz: Ihre Daten bleiben in Deutschland | Heidi Systems",
		description:
			"Heidi speichert Verbrauchs-, Stamm- und Mieterdaten auf Servern in Deutschland und verarbeitet sie nach DSGVO und BDSG. Welche Daten wo liegen und wer Ihr Vertragspartner ist.",
		ogTitle: "Ihre Daten bleiben in Deutschland.",
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
		handleSwitchSignup(event, { source: "sicherheit", page: ROUTE_SICHERHEIT }),
};
```

  The page sets no `cache-control`, because the layout does. `leads.source` is free text, so the new source needs no migration; check that the Make.com `switchinquiry` scenario doesn't filter on known `page` values (gate §4.4).
- `+page.svelte`: `<main id="content" class="sc" {@attach reveal()}>` with the sections in design order and `FloatingCta` after `</main>`. The wrapper sets the section background, the hairline between sections (`.pg-sec` has `border-top`), the `#hs-css` sizes scoped as on `/dashboard` (`h1[data-hs]` and `section h2[id]` in the 621–1040 and ≤620 queries, with selectors specific enough to beat the `tokens.css` heading reset), and the reveal styles (`.rv`, the design's threshold 0.15).
- Sitemap: no entry until the cutover (gate §4.4).

## 1.2 Content module

`$lib/landing/pages/sicherheit/content.ts` holds every text, word for word from the design. "§ 6a HeizkostenV" with a non-breaking space after "§".

- `hero`: pill "Sicherheit & Datenschutz" (lock icon), H1 "Ihre Daten bleiben " + em "in Deutschland.", lead "Heidi verarbeitet und speichert alle Daten nach deutschen Vorgaben, auf Servern in Deutschland. Das gilt für die Daten Ihrer Verwaltung genauso wie für die Daten Ihrer Mieter.", CTAs "Demo buchen" (→ `DEMO_HREF`) and "Welche Daten wo liegen" (→ `#daten`, arrow ↓), ticks "Server in Deutschland", "DSGVO und BDSG", "Unternehmen aus Berlin".
- `map`: label "Karte: Daten aus Liegenschaften in ganz Deutschland laufen auf Server in Deutschland", badge "Speicherort" / "Deutschland", log tag "Server DE", messages `["Zählerstand übertragen", "Verbrauchsinformation erstellt", "Rechnung gespeichert", "Abrechnung gespeichert"]` (the design's list repeats the first at the end; the cycle in `packets.ts` makes that unnecessary). The server shows the first.
- `principles`: H2 "Deutsche Server. Deutsche Vorgaben." / "Ein deutsches Unternehmen." (two lines, the `<br>` stays), three cards `{ icon: "servers" | "shield" | "pin", title, text }`:
  - "Gespeichert in Deutschland": "Alle Daten liegen auf Servern in Deutschland. Verbräuche, Abrechnungen, Rechnungen und Stammdaten Ihrer Liegenschaften."
  - "Verarbeitet nach deutschen Vorgaben": "Heidi verarbeitet alle Daten nach der Datenschutz-Grundverordnung (DSGVO) und dem Bundesdatenschutzgesetz (BDSG)."
  - "Ihr Partner sitzt in Berlin": "Ihr Vertragspartner ist die Heidi Systems GmbH, Monbijouplatz 4, 10178 Berlin. Vertrag und Ansprechpartner in Deutschland."
- `path`: H2 "Der Weg Ihrer Daten", lead "Vom Zähler in der Wohnung bis zur fertigen Abrechnung. Gespeichert und verarbeitet wird in Deutschland.", frame label "Heidi · Server in Deutschland", nodes `{ icon, title, sub? }`: Funkzähler / in der Wohnung; Gateway / im Haus; Heidi-Server / in Deutschland (`core`); outputs Ihr Dashboard, Heizkostenabrechnung, uVI für Mieter.
- `table`: H2 "Welche Daten wo liegen", lead "Alles, was Heidi für Ablesung, Verbrauchsinformation und Abrechnung braucht. Klicken Sie auf eine Zeile für Details.", columns "Daten", "Wofür", "Speicherort", the location "Deutschland" (one constant, used by every row), six rows `{ icon, name, purpose, detail }`:
  - Verbrauchsdaten / Zählerstände der Funkzähler für Heizung und Wasser / "Grundlage für uVI und Heizkostenabrechnung. Die Funkzähler übertragen ihre Werte aus der Ferne, gespeichert wird auf Servern in Deutschland."
  - Liegenschaften und Einheiten / Stammdaten Ihres Bestands / "Adressen, Einheiten und Zählerzuordnung. Damit jeder Verbrauch der richtigen Wohnung zugeordnet wird."
  - Mieterdaten / Für Verbrauchsinformation und Abrechnung / "Was für die monatliche Verbrauchsinformation nach § 6a HeizkostenV und für die Abrechnung jeder Einheit nötig ist. Verarbeitet nach DSGVO und BDSG."
  - Rechnungen aus DocuScan / Brennstoff, Betriebsstrom, Wartung / "Hochgeladene Rechnungen und die daraus erkannten Werte. Sie liegen wie alle anderen Daten in Deutschland."
  - Heizkostenabrechnungen / Fertige Abrechnungen je Einheit / "Die erstellten Abrechnungen und ihre Berechnungsgrundlagen. Auf Wunsch übergibt Heidi sie an Ihre Verwaltungssoftware."
  - Dashboard / Zugang Ihres Teams / "Übersicht über Verbräuche, Kosten und Benachrichtigungen aller Liegenschaften. Die Daten dahinter liegen auf Servern in Deutschland."
- `faq`: title "Häufige Fragen", five `FaqItem`s:
  - "Wo speichert Heidi meine Daten?" – "Auf Servern in Deutschland. Das gilt für alle Daten: Verbräuche, Stammdaten, Mieterdaten, Rechnungen und Abrechnungen."
  - "Nach welchen Vorgaben verarbeitet Heidi die Daten?" – "Nach den deutschen Vorgaben, also der Datenschutz-Grundverordnung (DSGVO) und dem Bundesdatenschutzgesetz (BDSG)."
  - "Welche Daten verarbeitet Heidi?" – "Nur was für Ablesung, Verbrauchsinformation und Heizkostenabrechnung nötig ist: Zählerstände, Stammdaten Ihrer Liegenschaften und Einheiten, Mieterdaten für uVI und Abrechnung sowie die Rechnungen, die Sie über DocuScan hochladen."
  - "Gilt das auch für die Daten meiner Mieter?" – "Ja. Auch die Daten Ihrer Mieter werden nach DSGVO und BDSG verarbeitet und auf Servern in Deutschland gespeichert."
  - "Wer ist mein Vertragspartner?" – "Die Heidi Systems GmbH, Monbijouplatz 4, 10178 Berlin."
- `closing`: H2 "Messdienst mit Daten in Deutschland.", `submitLabel` "Demo buchen" (open question 3).

The address appears twice (principle card, last answer): one `COMPANY` constant (`"Heidi Systems GmbH"`, `"Monbijouplatz 4"`, `"10178 Berlin"`) builds both.

`content.test.ts`: the H1; six rows, each with name, purpose and detail, unique icons per row except where the design reuses one (Funkzähler/Verbrauchsdaten, Heizkostenabrechnung, Dashboard, Mieterdaten/uVI share icons with the path: fine); five questions, none empty; `COMPANY` against `ADDRESS` from `Footer/footerLinks.ts` (company and city equal, street equal after expanding "pl." to "platz"); every `href` in the module is a route constant or an in-page anchor that exists (`#daten`, `#start`).

## 1.3 The map data

`$lib/landing/pages/sicherheit/map.ts`, taken from the design's `.sc-svg` (the `viewBox="80 -6 440 576"`):

- `states: string[]`: the 16 `path.st` outlines as they are (`M … L … Z` strings, one decimal). They're decorative outlines, not labelled, and don't need names; keep the design's order.
- `server: { x: 300, y: 300 }`.
- `dots: { x, y, c: { x, y } }[]`: the 14 `g.cy` circles with the control point of their curve (`path.ln`, `M x y Q cx cy 300 300`), so the curve is rebuilt from numbers: `M ${x} ${y} Q ${c.x} ${c.y} ${server.x} ${server.y}`.

A short note in the module says where the numbers come from and that they're not the projection of `messdienstanbieter/germany-map.ts` (different viewBox; the two maps don't share data). No extraction script: the data doesn't change per city and is copied once (a one-off Python/TS snippet in the scratchpad, not in the repo).

## 1.4 Link mapping

| Design link | Here |
|---|---|
| `44SBXKXJaSp6bvGMnbpZj6` ("Demo buchen", the floating CTA "Erstgespräch vereinbaren") | `DEMO_HREF` (`#start` today); the floating CTA as on the other pages |
| `#daten` ("Welche Daten wo liegen ↓") | `#daten` on the table's section |
| `Sb54rDQd5WS2r82skPe7UQ` (this page: "Mehr zu Sicherheit", the footer's "Sicherheit") | `ROUTE_SICHERHEIT`, hidden in the trust block on this page (open question 2) |
| `Jp8tqY82m7FZqMnWU4z9x9` (banner "Mehr erfahren") | `DEFAULT_CHROME.bannerHref` (`/upgrade-now`) |
| Logo, nav, the design's footer artifacts | the shared landing header and footer |

## 1.5 The pure packet path

`$lib/landing/pages/sicherheit/packets.ts`, no DOM:

- `quadPoint(p0, c, p1, t)`: the point on a quadratic Bézier at parameter `t`.
- `arcTable(p0, c, p1, n = 32)`: cumulative lengths at `n` samples; `pointAtLength(table, curve, s)` maps a fraction `s` of the total length to a point by interpolating `t` between samples. Matches what `getPointAtLength(L × s)` returns to within ~0.5 px on these curves (test against two curves measured in a browser once and pinned).
- `ease(p)`: the design's ease-in-out-quad (`p < .5 ? 2p² : 1 − (−2p + 2)² / 2`).
- `opacity(p)`: the fade at both ends (`p < .1 ? 10p : p > .9 ? 10(1 − p) : 1`).
- `nextMessage(i, n)`: `(i + 1) % n`.

`packets.test.ts`: `quadPoint` at 0 and 1 is the end points; `pointAtLength` at 0, 0.5 and 1 (0.5 on a straight "curve" is the midpoint); `ease` at 0, 0.5, 1 and symmetric; `opacity` at 0, 0.05, 0.5, 0.95, 1; `nextMessage` wraps.

## 1.6 Shared changes

- **`enterView`** moves from `pages/dashboard/enterView.ts` to `$lib/landing/attachments/enterView.ts` (now used by two pages); `/dashboard`'s imports follow. No behaviour change.
- **`TrustSeals`**: `securityLink` prop and the live `SECURITY_HREF` (§1.1).
- **`Faq`**: the `cards` variant renders `more` (§1.1, for `/vorgehen`).
- `icons.ts` holds the page's stroke icons (lock, check, servers with LEDs, shield with tick, pin, meter, gateway, server, chart, document, people, building, clipboard), drawn through `StrokeIcon` as on `/funktionen`. The principle icons keep their animated parts as separate paths with classes (`.led`, `.tick` with `pathLength="1"`, `.pin`), so they're inline in `Principles.svelte` rather than in `icons.ts`.
