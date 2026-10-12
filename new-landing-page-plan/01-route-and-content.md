# Phase 1: Route, content, the form backend and the career links

## 1.1 Route

- `ROUTE_KARRIERE = "/karriere"` in `$lib/routes.ts`.
- `src/routes/(landing-page)/karriere/+page.server.ts`, modelled on `ueber-uns/+page.server.ts`:

```ts
export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title: "Karriere: Jobs bei Heidi Systems in Berlin",
		description:
			"Bauen Sie mit uns den Messdienst von morgen: Funkzähler, Software und Service aus Berlin. Offene Stellen in Engineering, Operations, Kundenservice und Vertrieb, Initiativbewerbungen willkommen.",
		ogTitle: "Bauen Sie mit uns den Messdienst von morgen.",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: true,
		keepCanonical: true,
	},
	landing: { ...DEFAULT_CHROME, ctaHref: ROUTE_MESSDIENSTWECHSEL },
	applicationForm: await emptyApplicationForm(),
});

export const actions: Actions = {
	default: (event) => handleApplication(event, { page: ROUTE_KARRIERE }),
};
```

  The page sets no `cache-control`, because the layout does.
- `+page.svelte`: `setApplication(...)` (1.5), then the sections in design order inside `<main id="content" class="kr" {@attach reveal()}>`, with the page tokens (`--bg`, `--hair`) as on `/ueber-uns`.

## 1.2 Footer, career links, header CTA

- `$lib/landing/footerLinks.ts`: `{ text: "Karriere", href: ROUTE_KARRIERE }`.
- `$lib/landing/cta.ts`: `CAREERS_HREF = ROUTE_KARRIERE` (update the comment) and the new `CAREERS_JOBS_HREF = \`${ROUTE_KARRIERE}#stellen\``. `/ueber-uns`: its team "Offene Stellen" uses `CAREERS_JOBS_HREF`, and the hero, team and careers links drop `target="_blank" rel="noopener"`. `e2e/ueber-uns.e2e.ts`: the career links expect `/karriere` and `/karriere#stellen`, without `rel`.
- `$lib/landing/chrome.ts`: `ctaHref?: string` (default `START_HREF`). In `LandingHeader`, both CTAs (desktop and mobile) use it, and `focusSignup()` only runs when the target is `START_HREF`.

These three changes and the route ship in one commit (README, phases).

## 1.3 Content module

`$lib/landing/pages/karriere/content.ts` holds every text of the page, word for word from the design. Headings use the `SplitHeading` type from `$lib/landing/types.ts`.

- `hero`: pill "Karriere bei Heidi", H1 "Bauen Sie mit uns den Messdienst" + em "von morgen.", lead, CTAs "Offene Stellen" (`#stellen`, arrow ↓) and "Initiativ bewerben" (role `initiative`).
- `feed`: title "Ein Tag bei Heidi", badge "Beispiel", aria label "Beispiel: Ein Tag bei Heidi", 7 events `{ icon, title, sub, area }` from the design's `EV` array. Area labels: Operations, Engineering, Service, Vertrieb. The feed says "Service" where the areas say "Kundenservice", so keep the label per event and don't derive it.
- `reasons`: pill "Warum Heidi", H2 "Arbeit, die man sieht." / "In jedem Gebäude.", 4 × `{ icon, title, text, dark? }`.
- `areas`: pill "Bereiche", H2 "Wo Sie bei Heidi" / "mitwirken können.", the control's label "Bereich", 4 × `{ id: "eng" | "ops" | "cs" | "sales", label, title, text, points: { icon, text }[3] }` from the design's `A` object. The links "1 offene Stelle · ansehen" (→ `#stellen`) and "Initiativbewerbung willkommen · bewerben" (→ role `initiative`) come from functions of the job count (`n === 1 ? "1 offene Stelle" : \`${n} offene Stellen\``).
- `jobs`: pill "Offene Stellen", H2 "Aktuell suchen wir." / "Und freuen uns auf Initiative.", `list: Job[]` with one job:
  `{ id: "frontend-engineer", title: "Frontend Engineer", sub: "SvelteKit · TypeScript", area: "eng", location: "Berlin", formLabel: "Frontend Engineer (SvelteKit, TypeScript)", build: [3], bring: [3], applyLabel: "Auf diese Stelle bewerben" }`,
  headings "Was Sie bauen" / "Was Sie mitbringen". There's also `initiative`: `{ id: "initiative", title: "Initiativbewerbung", sub: "Ihre Stelle ist nicht dabei?", tag: "Alle Bereiche", location: "Berlin", text, formLabel: "Initiativbewerbung", applyLabel: "Initiativ bewerben" }`.
- `process`: pill "Bewerbungsprozess", H2 "Drei Schritte." / "Ohne Umwege.", 3 × `{ title, text }`.
- `apply`: pill "Bewerben", H2 "Erzählen Sie uns" / "von sich.", lead, the 2 ticks, field labels and placeholders, "optional", submit "Bewerbung absenden", sending "Wird gesendet …", success "Danke für Ihre Bewerbung!" + `successText(formLabel)` ("Ihre Bewerbung als „…“ ist angekommen. Wir melden uns bei Ihnen."), "Weitere Bewerbung", the privacy line (placeholder, open question 3), the error text with `fallbackEmail` (placeholder, open question 2).
- `more`: "Mehr über Heidi erfahren?", button "Über uns" → `ROUTE_UEBER_UNS`.

The role ids live in `$lib/forms/application.ts` as `ROLE_IDS = ["frontend-engineer", "initiative"] as const`, because the schema shouldn't import page content. `content.test.ts` checks that `jobs.list` plus `initiative` match them one to one, so adding a job without its id fails the tests.

## 1.4 Form schema, action and webhook

- `$lib/forms/application.ts` (shared client/server, German messages in the schema):
  - `role`: `z.enum(ROLE_IDS)`, default the first job
  - `name`: trimmed, 2–100 chars, "Bitte ergänzen Sie Ihren Namen."
  - `email`: trimmed email, "Bitte ergänzen Sie eine gültige E-Mail-Adresse."
  - `link`: optional, empty → `undefined`, otherwise `z.url()` with `http(s)` only, max 300, "Bitte geben Sie einen vollständigen Link an (https://…)." The design accepts anything here; we validate, because the link ends up in an inbox
  - `message`: optional, max 2000
  - `website` (honeypot) and `_t` (timing), as in `switchInquiry`
- `$lib/server/application.ts`: `emptyApplicationForm()` (stamps `_t`, like `emptySwitchForm`) and `handleApplication(event, { page })`, which runs honeypot/timing → `fail(400)` on invalid → gibberish (name, and the message if present) → rate limit `apply:${ip}` (3 per 600 s, 50 with `KITCHEN_SINK`) → send. A blocked bot gets the success message.
- `$lib/server/webhooks.ts`: add the event type `"jobapplication"` (payload: `role`, `role_title`, `name`, `link`, `message`, `page`), and `sendWebhookEventOrThrow()` (the same request, but it throws on a missing URL in production, a non-2xx response or a network error). `sendWebhookEvent` stays as it is for the other events. Log `[APPLICATION] Sent (role)` without PII. The existing `[WEBHOOK] Sending … for <email>` line must not run for this event.
- On a send error, the action returns `message(form, { type: "error", text }, { status: 502 })` with the fallback-address text, and the form keeps its values.

Tests (Vitest): `application.test.ts` for the schema (empty and invalid link, trimming, unknown role rejected, message too long) and `handleApplication` with a mocked webhook (honeypot → success without sending, invalid → 400, send failure → error message, success → payload without `_t`/`website`).

## 1.5 Application context

`$lib/landing/pages/karriere/application.svelte.ts`: `class Application { role = $state<RoleId>(firstJob); apply(id) }` with `setApplication()` / `getApplication()`, per the shared-state rule in `CLAUDE.md`. `apply(id)` sets the role, scrolls `#bewerben` into view (smooth, `auto` with reduced motion; the 72 px offset is `scroll-margin-top`), and focuses the name field with `preventScroll` once the scroll ends (`scrollend`, with a 600 ms fallback timer as in the design).

## 1.6 Shared segmented control

Move `/upgrade-now`'s `.seg` (`RiskCalculator.svelte`) to `$lib/landing/components/Segmented.svelte`:

- Props: `options: { value, label }[]`, `value = $bindable()`, `label` (aria), `class`.
- Semantics: `role="radiogroup"` with `role="radio"` / `aria-checked` buttons, which is what `RiskCalculator` has today. Add roving `tabindex` and arrow-key handling if it doesn't have them yet; a radiogroup without arrow keys is the same problem the `/ueber-uns` plan avoided with `aria-pressed`.
- The design's styles (`#EEF1EF` track, white `.on` pill). `RiskCalculator` uses it with no visual change (check `/upgrade-now` at 375 and 1440 px).

Update `CLAUDE.md` (the `/ueber-uns` bullet's "Career links use `CAREERS_HREF` … LinkedIn for now", the layout tree, a new `/karriere` bullet).
