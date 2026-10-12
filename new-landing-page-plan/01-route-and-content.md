# Phase 1: Route, content and shared pieces

## 1.1 Route

- `ROUTE_UEBER_UNS = "/ueber-uns"` in `$lib/routes.ts`.
- `src/routes/(landing-page)/ueber-uns/+page.server.ts`, modelled on `upgrade-now/+page.server.ts`:

```ts
export const load: PageServerLoad = async () => ({
	seo: {
		title: "Über uns: Messdienst aus Berlin | Heidi Systems",
		description:
			"Heidi Systems übernimmt für Hausverwaltungen den kompletten Messdienst: eigene Funkzähler, kostenlose Installation, Ablesung per Funk und die Heizkostenabrechnung auf Knopfdruck.",
		ogTitle: "Messdienst, wie er heute sein sollte.",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: true,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	now: Date.now(),
	finalForm: await emptySwitchForm("final"),
});

export const actions: Actions = {
	default: (event) =>
		handleSwitchSignup(event, { source: "ueber-uns", page: ROUTE_UEBER_UNS }),
};
```

  SEO title and description are drafts for the content owner (gate §4.4). No `cache-control` here (the layout sets it).
- `+page.svelte`: `setDeadlineClock(data.now)`, `onMount(() => clock.start())` (as on `/upgrade-now`), then the sections in design order.

## 1.2 Footer link

`$lib/landing/footerLinks.ts`: `{ text: "Über uns", href: ROUTE_UEBER_UNS }`. With this, the landing footer on every landing page links here, so the route has to exist in the same commit.

## 1.3 Content module

`$lib/landing/pages/ueber-uns/content.ts` holds every text of the page, word for word from the design (headings as the existing `SplitHeading` type: main part + muted `<span>` part):

- `hero`: pill "Über Heidi Systems", H1 "Messdienst, wie er heute" + em "sein sollte.", lead, CTAs ("Demo buchen", "Karriere bei Heidi"), ticks (Sitz in Berlin / Kunden in ganz Deutschland / Hardware und Software aus einer Hand).
- `services`: card title "Was Heidi übernimmt", the 5 items (title + sub), the closing "Ein Partner für alles" / "Ein Ansprechpartner, ein Dashboard".
- `logos`: "Hausverwaltungen in ganz Deutschland arbeiten bereits mit Heidi." (same 12 logos, `DEFAULT_LOGO_ORDER`).
- `mission`: pill, H2, lead, `leadExpired` (placeholder), link "Mehr zur Umrüstpflicht" → `ROUTE_UPGRADE_NOW`, card texts ("Bis zur Fernablesepflicht", "Tage", "Heute", "1.1.2027", `expired` placeholder).
- `principles`: pill "Wofür wir stehen", H2 "Vier Grundsätze." / "Jeden Tag.", 4 × `{ title, sub, text, points[3], link? }` (texts from the design's `V` array).
- `numbers`: pill, H2 "Weniger Aufwand am Montagetag." / "Für alle.", 4 × `{ value, unit, label, dark?, countTo? }` (92 %, 14 Tage, "1–2" Std., 0 €).
- `team`: name, role, location, initials, pill "Das Team", H2, lead, links ("Kundenstimmen lesen" → `#stimmen`, "Offene Stellen" → `CAREERS_HREF`).
- `testimonials`: title "Was Verwaltungen über Heidi sagen", keys `["werne", "gerhard"]` (quotes come from `data/testimonials.ts`; the wording in the design is identical).
- `careers`: `show: true`, pill "Wir wachsen", title, text, button "Zur Karriereseite".
- `finalCta`: title "Lernen Sie Heidi kennen.", submit label "Demo buchen".

Placeholders (expired texts) are marked with `data-placeholder` in dev, as on `/upgrade-now`.

## 1.4 Shared pieces (moves, no behaviour change)

| From | To | Why |
|---|---|---|
| `pages/upgrade-now/deadline.ts`, `deadline.test.ts`, `clock.svelte.ts` | `$lib/landing/deadline/` | Second page uses the deadline. Add `retrofitProgress(now)`: share of 1.1.2022 00:00 → `DEADLINE` (Berlin), clamped to 0…1, with tests (start, mid, last day, expired = 1) |
| `pages/upgrade-now/components/SectionHead.svelte`, `ArrowLink.svelte` | `$lib/landing/components/` | Same pill + split H2 and the `bk-next` button. `SplitHeading` moves with them (into the component's module script or `$lib/landing/types.ts`) |
| `pages/messdienstwechsel/sections/Trust.svelte` (cards) | `$lib/landing/sections/TrustCards.svelte` | Same DEUMESS/VDIV/bved cards. Prop `more?: { text, href }`; `/messdienstwechsel` passes "Mehr über Heidi" → `ROUTE_UEBER_UNS`, this page passes nothing |
| — | `$lib/landing/sections/Testimonials.svelte` gets `id?` | Anchor `#stimmen` for "Kundenstimmen lesen" |
| — | `$lib/landing/cta.ts` gets `CAREERS_HREF` | One place for the career links (README, open question 2) |

Update `CLAUDE.md` (the `/upgrade-now` bullet names `pages/upgrade-now/deadline.ts`) and the layout tree.
