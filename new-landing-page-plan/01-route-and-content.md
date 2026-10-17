# Phase 1: Route, content, signup, photos and shared pieces

## 1.1 Route

- `ROUTE_MIETERPORTAL = "/mieterportal"` in `$lib/routes.ts` and the landing footer's "Mieterportal" `href` exist since the planning commit.
- `src/routes/(landing-page)/mieterportal/+page.server.ts`, modelled on `funktionen/+page.server.ts`:

```ts
export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title: "Mieterportal: monatliche Verbrauchsinformation für Ihre Mieter | Heidi Systems",
		description:
			"Im Heidi Mieterportal sehen Ihre Mieter ihren Verbrauch jeden Monat, mit Vergleich zu Vormonat, Vorjahr und Durchschnitt. Nach § 6a HeizkostenV, ohne Aufwand für Ihr Team.",
		ogTitle: "Das Heidi Mieterportal für Ihre Mieter",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: true,
	},
	landing: DEFAULT_CHROME,
	finalForm: await emptySwitchForm("final"),
});

export const actions: Actions = {
	default: (event) =>
		handleSwitchSignup(event, { source: "mieterportal", page: ROUTE_MIETERPORTAL }),
};
```

  The page sets no `cache-control`, because the layout does. The `leads.source` column is free text, so the new source needs no migration; check that the Make.com `switchinquiry` scenario doesn't filter on known `page` values (gate §4.4).
- `+page.svelte`: `<main id="content" class="mp" {@attach reveal()}>` with `<div class="uv">` around sections 1–12 (README, Dark page), then `Trust`; `FloatingCta` after `</main>`. The wrapper sets the page tokens and the `#hs-css` sizes, scoped: `.uv :global(section h2[id])` with the design's two media queries (621–1040 and ≤620), and the same for `Trust`'s H2 (it has an id), as on `/funktionen`. The reveal styles (`.rv`, threshold 0.15, `opacity`/`translateY` over 0.7 s) as on `/funktionen`'s `+page.svelte`.
- `/vorgehen`'s feature card "Mieterportal" gets `href: ROUTE_MIETERPORTAL` (its `content.test.ts` accepts any route constant).
- Sitemap: no entry until the cutover (gate §4.4).

## 1.2 Photos

Into `src/lib/assets/landing/mieterportal/`, saved from the design as they are (no re-encode; `?enhanced` builds the sizes):

| File | From | Used in |
|---|---|---|
| `tenant.jpg` | hero, right panel (1122×1402) | `Hero`, `object-position: 45% 35%` |
| `building.webp` | Verwalter card (1400×788) | `Audience` |
| `facade-white.webp` | full-width photo (1232×928) | `Picture` |

The hero's left panel imports `$lib/assets/landing/vorgehen/facade.webp` and the Mieter card `vorgehen/office.webp` (same bytes as the design's); the floating CTA uses the shared region avatars. Register the new imports in `$lib/assets/icons.ts` if the other landing photos are registered there; otherwise import them where used, as `/vorgehen` does. All photos `alt=""` (decorative, as in the design). No `priority`: the hero's side panels are hidden below 620 px, and the LCP is the H1 or the mock (measure, §4.1).

## 1.3 Content module

`$lib/landing/pages/mieterportal/content.ts` holds every text and the example data of the page, word for word from the design. Non-breaking spaces before `%` and units ("131 kWh", "14 Tage", "1–2 h", "11 % weniger").

- `hero`: `srTitle` "Das Heidi Mieterportal für Ihre Mieter", `word` "Mieterportal", lead "Verbrauch, Verbrauchs­information und Termine. Für jede Wohnung an einem Ort." (keep the soft hyphen), `primary` "Demo buchen" (→ `DEMO_HREF`), `secondary` "Mehr erfahren" (→ `#inhalt`).
- `portal` (the hero mock): label "Beispiel: Heidi Mieterportal", side nav `["Verbrauch", "Dokumente", "Mitteilungen"]` (first active), side footer "Mieterportal", head "Mieterportal", tag "Beispieldaten", greeting "Willkommen zurück.", sub "Wohnung 2. OG links · Beispiel", four entries `{ icon, title, sub, before, after }`:

| title | sub | before | after |
|---|---|---|---|
| Verbrauchsinfo September | Heizung · 131 kWh | Neu | Bereitgestellt |
| Montage Funkzähler | Do, 9 bis 11 Uhr | Angekündigt | Termin steht |
| Vergleich Vorjahresmonat | 11 % weniger verbraucht | Wird berechnet | Aktuell |
| Verbrauchsinfo August | Heizung · 96 kWh | Neu | Bereitgestellt |

- `statement`: label "Worum es geht", text "Ihre Mieter wollen wissen, wo sie stehen. Im Heidi Mieterportal sehen sie ihren Verbrauch jeden Monat, verglichen mit dem Vormonat, dem Vorjahr und dem Durchschnitt. Mit allem, was die Heizkostenverordnung verlangt. Für Ihr Team entsteht dabei keine Arbeit."
- `rows`: label "So arbeitet Heidi", the shared CTAs (`DEMO_HREF` "Demo buchen", `#faq` "Häufige Fragen"), four `{ tag, title: [line1, line2], paragraphs: [p1, p2], tile }`:
  1. "Monatlich", "Jeden Monat / ein neuer Stand.", "Heidi liest die Funkzähler aus der Ferne ab und stellt den Verbrauch jeden Monat im Portal bereit." / "Ohne Termin in der Wohnung und ohne Aufwand für Ihr Team.", tile `calendar`.
  2. "Mitteilung", "Mieter erfahren / es zuerst.", "Sobald eine neue Verbrauchsinformation da ist, bekommen Ihre Mieter eine Mitteilung." / "Ein Tipp genügt, und sie sehen ihren Verbrauch im Portal.", tile `phone`.
  3. "Vergleich", "Klar statt / Zahlenkolonne.", "Jede Information zeigt den Verbrauch des letzten Monats und vergleicht ihn mit Vormonat, Vorjahresmonat und einem Durchschnittsnutzer." / "So, wie es § 6a HeizkostenV verlangt.", tile `statement`.
  4. "Verwaltung", "Weniger Rückfragen / bei Ihnen.", "Wer seinen Verbrauch kennt, wird von der Jahresabrechnung nicht überrascht." / "Fragen, die sonst bei Ihrem Team landen, beantwortet das Portal.", tile `before`.
- `calendar`: months `["Jan", …, "Dez"]`, `current: 9` (October), labels `done` "bereit", `doing` "wird erstellt", `open` "offen", note templates "{x} bereitgestellt" / "{x} wird erstellt". The end state: Jan–Sep ticked "bereit", Oct "wird erstellt", Nov–Dez "offen", note "Okt wird erstellt".
- `phone`: time "9:41", app "Heidi", notification "Ihre Verbrauchsinfo September" / "Jetzt im Mieterportal ansehen", figure label "Heizung im September", value "131 kWh", comparison "11 % unter Vorjahresmonat", mini bars `[171, 184, 162, 131, 74, 22, 15, 14, 96, 131]` (last one accent; heights `value / (max * 1.05)`).
- `statementTile`: title "Verbrauchsinformation September", sub "Heizung · in kWh · Beispiel", four rows `{ label, value, share }`: Letzter Monat 131 82 %, Vormonat 96 60 %, Vorjahresmonat 148 92 %, Durchschnittsnutzer 142 89 %; result "Alle Pflichtangaben enthalten". (The shares are the design's, not computed from the values; keep them.)
- `before`: segments "Ohne Portal" / "Mit Heidi"; rows without the portal "Verbrauch erst mit der Abrechnung" → "spät", "Rückfrage per Anruf bei Ihnen" → "oft"; with Heidi "Verbrauch jeden Monat im Portal" ✓, "Montagetermin mit Zeitfenster" ✓; sum "Rückfragen an Ihr Team" "viele" → "weniger".
- `rotator`: label "Was Heidi übernimmt", lead "Im Mieterportal:", phrases `["Verbrauch jeden Monat", "Vergleich zum Vorjahr", "Vergleich zum Durchschnitt", "Montagetermine"]`, `intervalMs: 2300`.
- `numbers`: H2 "Das Mieterportal in Zahlen", five figures `{ value, unit?, text, count }` in design order with the dashboard tile second: `12` "×" "Verbrauchsinformationen pro Jahr und Wohnung"; `3` "Vergleiche je Information: Vormonat, Vorjahresmonat, Durchschnitt"; `14` "Tage" "vorher erfahren Mieter vom Montagetermin"; "1–2 h" (no count) "Zeitfenster am Montagetag"; `0` "Handgriffe für Ihr Team" (no count: the design skips 0).
- `dashboard` (the mini dashboard): label "Animiertes Beispiel: Heidi Dashboard" (here: "Beispiel: Heidi Dashboard", it isn't animated for everyone), top bar "Mein Portfolio" / "370 Wohnungen ausgewählt", "Zeitraum" / "01. Jan. – 04. Okt.", "Datenansicht", "Dashboard teilen", "Mein Konto"; tabs "Täglich", "Wöchentlich", "Monatlich" (ends on Monatlich); toast "Alle Zähler übertragen" / "Funkablesung abgeschlossen · gerade eben"; two line cards `{ title, unit, ticks, max, values }`: Kaltwasser m³ `[0,100,200,300,400]` max 400 `[20,45,70,95,230,225,235,250,262,292]`, Warmwasser m³ `[0,25,50,75,100,125]` max 125 `[4,6,9,7,16,96,68,52,74,96]`, legend "— Vorjahr", x axis Jan–Okt; status card "Status" with four rows (740 Heizkostenverteiler, 370 Warmwasserzähler, 370 Kaltwasserzähler, 7 Wärmemengenzähler), each "Wird übertragen …" → "In Ordnung · heute übertragen"; "Heizvolumen" bars `[92, 84, 70, 46, 22, 8, 6, 7, 24, 58]` (%); empty cards "Einsparung", "Heizkörper".
- `audience`: label "Für Verwalter und Mieter" (the design's "Ihr Wechsel" doesn't fit the section), two cards `{ title, text, cta?, image }`: "Sie sind Verwalter?" / "Das Mieterportal ist für Ihren ganzen Bestand dabei. Heidi stellt die Verbrauchsinformation bereit, Ihr Team muss nichts tun." / "Demo buchen" → `DEMO_HREF`; "Sie sind Mieter?" / "Prüfen Sie Ihre Heizkostenabrechnung kostenlos. Fehlt die monatliche Verbrauchsinformation, steht Ihnen eventuell eine Kürzung zu." / `cta` "Zum Mieter-Check" without `href` (not rendered; README, open question 2).
- `quotes`: H2 "Transparenz für Bewohner." / "Unsere Kunden sagen es selbst." (two lines), keys `["vitolus", "werne", "gerhard"]`.
- `picture`: caption "Ihr Verbrauch." / "Jederzeit im Blick.", section label "Heidi".
- `faq`: title "Häufige Fragen", five `{ question, answer, more? }` (plain text): "Was ist das Heidi Mieterportal?", "Was sehen die Mieter?", "Muss unser Team etwas tun?", "Erfüllen wir damit die Pflicht zur monatlichen Verbrauchsinformation?" (`more` "Mehr zur uVI" → `ROUTE_FUNKTIONEN`), "Wo liegen die Daten?" (`more` "Mehr zu Sicherheit", no `href`).
- `closing`: H2 "Transparenz für Ihre Mieter. Ohne Aufwand.", text "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.", submit label "Demo buchen". The video button's texts aren't in content until the button comes back (open question 1).

The design's links and where they go:

| Design link | Our target |
|---|---|
| Logo, nav, "Anmelden", header "Demo buchen" / "Angebot einholen" | The shared `LandingHeader` |
| Banner "Mehr erfahren" | `/upgrade-now` (`DEFAULT_CHROME`) |
| "Demo buchen" (hero, rows, Verwalter card, trust), floating "Erstgespräch vereinbaren" | `DEMO_HREF` (`#start`, the closing card's form) |
| Hero "Mehr erfahren" | `#inhalt` |
| Rows' "Häufige Fragen" | `#faq` |
| "Zum Mieter-Check" | none (open question 2) |
| FAQ "Mehr zur uVI" | `ROUTE_FUNKTIONEN` (the footer's "Verbrauchsinformation (uVI)" goes there too) |
| FAQ and trust "Mehr zu Sicherheit" | none yet (`TrustSeals` leaves it out) |
| Closing card's video button | Replaced by the signup form (open question 1) |

`content.test.ts`: no empty strings, no `XX`; four portal entries, each with `before` ≠ `after`; four rows with two title lines and two paragraphs; `calendar.current` within 0–11; the phone bars non-empty and its value matches the last bar and the portal's "131 kWh"; the statement tile has four rows with `share` in 0–100; four rotator phrases; the numbers' KPI strings match the confirmed ones ("14 Tage", "1–2 h"); the two dashboard series have 10 values each, all within 0–`max`, and `ticks` ending at `max`; three quote keys exist in the shared data; FAQ has 5 entries, every `more.href` is undefined or a route constant from `$lib/routes.ts`.

## 1.4 Icons

The design's inline stroke SVGs (the portal's logo, nav and entry icons; the calendar tick; the phone's bell; the statement tile's check; the before/after tick; the dashboard's status and toast icons; the FAQ chevron, which `Faq` already has) become `StrokeIcon` paths in `pages/mieterportal/icons.ts`, drawn by `components/Icon.svelte` (as on `/funktionen`). Check the shared icons first (`$lib/landing/components/icons/`, `/funktionen`'s `IconPaths`): a tick, bell or document that already exists is reused, not copied. The Heidi logo in the mock comes from the landing header's logo, not a copy.

## 1.5 Shared pieces

- **`$lib/landing/attachments/loopInView.ts`**: `loopInView({ run, every, threshold = 0.15, delay = 0 })`, the design's `loop` + `onShow`. On entering the view it calls `run()` (after `delay` ms on the first enter only; the hero uses it, phase 3.1) and then every `every` ms while the element stays in view and `document.visibilityState` is `visible`; on leaving (or a hidden tab) it stops, and the next enter starts over with `run()`. Under `prefersReducedMotion()` it does nothing (the server's end state stays). `run` returns an optional cleanup that cancels its pending step timeouts, called before the next run and on teardown, so no step fires after leaving. Used by the hero list, the four tiles, the rotator and the mini dashboard (seven places, so it's shared rather than written per section).
- **`sections/Faq.svelte`**: `tone?: "light" | "dark"` (default variant only), `openFirst?: boolean` (default `true`, today's behaviour; `false` here, the design opens none) and `FaqItem.more?: { text: string; href?: string }` in `$lib/landing/faqJsonLd.ts` (rendered as a link after the answer when it has `href`; `faqJsonLd` ignores it). Without the new props it renders exactly as today.
- **`sections/CtaCard.svelte`**: `tone?: "dark" | "glass"` (default `dark`, today's look); `glass` per `#end-css`. The form-on-dark rules of `pages/funktionen/sections/CtaCard.svelte` move into it (scoped to the `action` slot); the `/funktionen` wrapper keeps only what's specific to it. `/karriere` and `/hilfe` don't change.

Update `CLAUDE.md` once built: a `/mieterportal` bullet under "Current state", the layout tree (`pages/mieterportal/`, `loopInView`), and `(landing-page)`'s page list.
