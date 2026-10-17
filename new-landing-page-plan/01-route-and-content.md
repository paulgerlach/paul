# Phase 1: Route, content, the day count, signup, photos and the shared bits

## 1.1 Route

- `ROUTE_VORGEHEN = "/vorgehen"` in `$lib/routes.ts`.
- `src/routes/(landing-page)/vorgehen/+page.server.ts`, modelled on `selbstabrechnung/+page.server.ts`:

```ts
export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title: "So geht Heidi vor: in drei Schritten zum digitalen Messdienst | Heidi Systems",
		description:
			"Bedarfsanalyse, Installation der Funktechnik, Verbrauchsanalyse und Abrechnung: So rüstet Heidi Ihren Bestand auf fernablesbare Zähler um. Alles aus einer Hand.",
		ogTitle: "So geht Heidi vor. In drei Schritten digital.",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: true,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	// The day count to 1.1.2027 (plan 01 §1.4).
	now: Date.now(),
	finalForm: await emptySwitchForm("final"),
});

export const actions: Actions = {
	default: (event) =>
		handleSwitchSignup(event, { source: "vorgehen", page: ROUTE_VORGEHEN }),
};
```

  The page sets no `cache-control`, because the layout does. The `leads.source` column is free text, so the new source needs no migration; check that the Make.com `switchinquiry` scenario doesn't filter on known `page` values (gate §4.4).
- `+page.svelte`: the sections in design order inside `<main id="content" class="vg" {@attach reveal()}>`, with the page tokens (`--soft: #f3f4f2`, `--soft2: #eceeeb`, and `--bg`/`--hair` as on `/selbstabrechnung`), `setDeadlineClock(untrack(() => data.now))` (as on `/ueber-uns`), `FloatingCta` after `</main>`.

## 1.2 Footer

`$lib/landing/footerLinks.ts`: `{ text: "Vorgehen", href: ROUTE_VORGEHEN }` (the entry is already there as plain text, first in "Produkt"). It ships with the route in one commit (README, phases).

## 1.3 Content module

`$lib/landing/pages/vorgehen/content.ts` holds every text of the page, word for word from the design.

- `hero`: eyebrow "Vorgehen", H1 "So geht Heidi vor. In drei Schritten digital.", lead "Heidi erfasst alle Verbrauchsdaten digital, bündelt die Energiedaten Ihres Portfolios und vereinfacht Ihre Betriebs- und Heizkostenabrechnung. Alles aus einer Hand.", CTAs "Angebot einholen" (→ `START_HREF`, dark) and "Demo buchen" (→ `DEMO_HREF`, light).
- `wide`: caption "Lindenallee 12 · Umrüstung abgeschlossen · Beispiel", photo `object-position: 50% 60%`.
- `stats`: `{ figure, text, photo }` × 3: "92 %" / "der Installationen gelingen beim ersten Termin", "14 Tage" / "vorher informiert Heidi Ihre Mieter über die Montage", "3-in-1" / "Installation, Ablesung und Abrechnung aus einer Hand". Non-breaking space in "92 %" and "14 Tage".
- `remoteDuty`: eyebrow "Fernablesepflicht", H2 "Bis 2027 muss jeder Zähler fernablesbar sein.", the two paragraphs, count label "Tage bis zum 1. Januar 2027", link text "Zum HKVO-Leitfaden" with `HKVO_GUIDE_HREF: string | undefined = undefined` (not rendered while undefined), and `h2Expired` / `textExpired` placeholders (README, open question 4).
- `steps`: eyebrow "So funktioniert der Umstieg", H2 "Drei Schritte. Heidi übernimmt den Rest.", three `{ title, text, photo, chip: { title, sub } }`: "Bedarfsanalyse" (chip "Lindenallee 12" / "36 Einheiten · Planung fertig · Beispiel"), "Installation der Funktechnik" ("Montage Di, 10:00 bis 11:30" / "Mieter informiert · Beispiel"), "Verbrauchsanalyse und Abrechnung" ("Abrechnung erstellt" / "Nach HKVO · Beispiel"). The numbers "01"–"03" are derived from the index. `intervalMs: 6000`.
- `features`: eyebrow "Funktionen", H2 "Mehr als Ablesung.", six `{ icon, title, text, href? }`:

| Card | Design target | Our `href` |
|---|---|---|
| Digitale Funkablesung | Funkzähler | `ROUTE_GERAETE` |
| Dashboard | Dashboard | none |
| Dokumenten-Management | Funktionen | `ROUTE_FUNKTIONEN` |
| Heizkostenabrechnung | Heizkostenabrechnung | `ROUTE_FUNKTIONEN` (as in the footer) |
| Mieterportal | Mieterportal | none |
| Installationstool | Installationstool | none |

- `comparison`: eyebrow "Der Unterschied", H2 "Mit Heidi oder klassisch ablesen?", column heads "Mit Heidi" / "Klassisch", caption (visually hidden) "Vergleich: Heidi und klassische Ablesung", and seven rows `{ label, heidi, classic }` where a value is `true` (✓), `false` (–) or a string: Ablesung (✓ / "Termin vor Ort"), Ablesetermine in der Wohnung ("keine" / "regelmäßig"), Heizkostenabrechnung ("auf Knopfdruck" / "oft 6 bis 9 Monate"), Monatliche Verbrauchsinformation (✓ / –), Rechnungen automatisch erfassen (DocuScan) (✓ / –), Persönlicher Ansprechpartner (✓ / –), Wechsel ohne Warten aufs Vertragsende (✓ / –). Screen-reader texts for the marks: "ja" / "nein".
- `quotes`: eyebrow "Kundenstimmen", H2 "Weniger Aufwand. Mehr Überblick." + second line "Das sagen unsere Kunden." (`<br>` in the design), keys `["werne", "vitolus", "gerhard"]` (the quotes, names, roles and initials are the shared ones, identical to the design's).
- `faq`: eyebrow "FAQ", title "Echte Fragen. Klare Antworten.", five `{ question, answer }` (plain text). The fifth answer ends at "… nach DSGVO und BDSG." (no "Mehr zu Sicherheit" link, README).
- `contact`: H2 "Lassen Sie uns über Ihren Bestand sprechen.", text "Wir zeigen Ihnen, wie der Umstieg für Ihre Liegenschaften aussieht. Persönlich und unverbindlich.", caption "Ihr persönlicher Ansprechpartner bei Heidi", submit label "Angebot einholen" (the design's primary button), photo `region/contact.webp` (`object-position: 50% 30%`).

The design's links and where they go:

| Design link | Our target |
|---|---|
| Logo, nav, "Anmelden", header "Demo buchen" / "Angebot einholen" | The shared `LandingHeader` |
| Banner "Mehr erfahren" | `/upgrade-now` (`DEFAULT_CHROME`) |
| "Angebot einholen" (hero) | `START_HREF` (the form in `ContactCard`; open question 2) |
| "Demo buchen" (hero, trust), floating "Erstgespräch vereinbaren" | `DEMO_HREF` (`#start`) |
| "Angebot einholen" / "Demo buchen" (contact card) | Replaced by the signup form |
| "Zum HKVO-Leitfaden →" | none yet, not rendered |
| Feature cards | The table above |
| "Mehr zu Sicherheit" (FAQ, trust) | none yet |

`content.test.ts`: no empty strings, no `XX`; three steps, each with a photo and chip; six features, every `href` is undefined or a route constant from `$lib/routes.ts`; every comparison row has both values; the quote keys exist in the shared data; FAQ has 5 entries; the KPI strings match the confirmed ones ("92 %" in the stats, the steps text and the FAQ; "14 Tage" in the stats, the steps text and the FAQ), so a changed KPI changes everywhere.

## 1.4 Day count

`$lib/landing/deadline/deadline.ts` gets `daysUntilObligation(now)`: calendar days (Berlin) from today to 1.1.2027, i.e. `daysLeft(now) + 1`, and `-1` once expired. 2026-10-17 → 76, 31.12.2026 → 1, from 1.1.2027 00:00 Berlin → -1. Tests next to `daysLeft`'s in `deadline.test.ts`, including the DST change on 25.10.2026.

`RemoteDuty` reads the per-page clock through `getDeadlineClock()`, so the number is right after hydration even when the CDN served an older render, and it changes at Berlin midnight while the page is open.

## 1.5 Photos and the font

From the design, under `src/lib/assets/landing/vorgehen/`, imported `?enhanced` and rendered with `Image`:

| File | Design use | Size (design) |
|---|---|---|
| `building-wide.webp` | Wide image (eager, `priority`) | 1400×764, 206 KB |
| `installer.webp` | Stat "92 %", step 2 | 1200×585, 58 KB |
| `office.webp` | Stat "14 Tage" | 1148×1148, 91 KB |
| `dashboard.webp` | Stat "3-in-1", step 3 | 1600×850, 70 KB |
| `facade.webp` | RemoteDuty, left | 1400×1050, 312 KB |
| `kitchen-meters.webp` | RemoteDuty, inset | 1400×933, 65 KB |
| `consultation.webp` | Step 1 | 1400×933, 66 KB |

`region/contact.webp` (contact card) and the floating CTA's avatars are already in the repo. All photos are decorative in the design (`alt=""`); keep that for the stats, the inset and the wide image (the caption says what it shows), and give the step pictures an empty alt too (the chip beside them is text). `sizes` per use: wide `(max-width: 1280px) 100vw, 1280px`, stats `96px`, steps `(max-width: 980px) 100vw, 720px`, split `(max-width: 980px) 100vw, 640px`, inset `150px`.

Geist Mono: `bun add @fontsource-variable/geist-mono`, and in `+page.svelte` an `@font-face` for its latin `wght` file (`?url` import, the layout's pattern), `font-display: swap`, no preload. The sections use `font-family: "Geist Mono", ui-monospace, Menlo, monospace`.

## 1.6 Shared pieces

- `components/Eyebrow.svelte`: `<span class="eyebrow">` with the `#eb-css` pill (white, 1px border, 9px radius, the sparkle mask in `--faint`), `center` (auto margins) and `onDark` props. Copy the rule from `RegionMain.svelte` so it looks the same; `RegionMain` and `TrustSeals` keep theirs for now.
- `sections/Faq.svelte`: `variant: "default" | "split" | "cards"`, plus an optional `eyebrow` for `cards`. The `cards` markup: centered head (eyebrow, H2 `id="faq-h2"`), `max-width: 960px` list of `<details>` on `--soft` with 14 px radius, the plus that turns into a minus (`.ar-pl`). Keep `id="faq"` and the JSON-LD as in the other variants; the other variants don't change.

Update `CLAUDE.md`: a `/vorgehen` bullet under "Current state" (replacing the "planned" one), the layout tree (`pages/vorgehen/`, `Eyebrow`), and `(landing-page)`'s page list.
