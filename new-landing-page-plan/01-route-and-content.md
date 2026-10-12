# Phase 1: Route, content, search, the feedback backend and the footer entry

## 1.1 Route

- `ROUTE_HILFE = "/hilfe"` in `$lib/routes.ts`.
- `src/routes/(landing-page)/hilfe/+page.server.ts`, modelled on `karriere/+page.server.ts`:

```ts
export const load: PageServerLoad = async ({ url }) => {
	const q = readQuery(url); // trimmed, max 100 chars, "" when absent
	return {
		seo: {
			// Drafts for the content owner (plan §4.4).
			title: "Hilfe-Center: Antworten zu Messdienst und Heizkostenabrechnung",
			description:
				"Antworten zu Messdienstwechsel, Montage, Funkablesung, unterjähriger Verbrauchsinformation und Heizkostenabrechnung. Finden Sie Ihre Frage oder sprechen Sie mit Ihrem Ansprechpartner.",
			ogTitle: "Wie können wir helfen?",
			// Until its go-live gate is done (plan §4.4). Then also add it to
			// the sitemap. A search URL (?q=) stays noindex after that.
			noindex: true,
			keepCanonical: true,
		},
		// No signup form here: the nav CTA goes to /messdienstwechsel's (open question 6).
		landing: { ...DEFAULT_CHROME, ctaHref: ROUTE_MESSDIENSTWECHSEL },
		now: Date.now(),
		q,
		feedbackForm: await superValidate(zod4(helpFeedbackSchema)),
	};
};

export const actions: Actions = {
	feedback: (event) => handleHelpFeedback(event, { page: ROUTE_HILFE }),
};
```

  `Seo.svelte` builds the canonical from the path alone, so `/hilfe?q=uvi` has the canonical `/hilfe`. The page sets no `cache-control`, because the layout does.
- `+page.svelte`: `setHelpSearch(...)` (1.5), then the sections in design order inside `<main id="content" class="hc" {@attach reveal()}>`, with the page tokens (`--bg`, `--hair`) as on `/karriere`. The FAQPage JSON-LD (1.4) is rendered here.

## 1.2 Footer and header

- `$lib/landing/footerLinks.ts`: `{ text: "Hilfe-Center", href: ROUTE_HILFE }`.
- Header: `ctaHref: ROUTE_MESSDIENSTWECHSEL` (above). `LandingChrome.ctaHref` already exists since `/karriere`.

These and the route ship in one commit (README, phases).

## 1.3 Content module

`$lib/landing/pages/hilfe/content.ts` holds every text of the page, word for word from the design. The H1 keeps its `<em>` part as a separate field (`h1: { text, em }`).

- `hero`: pill "Hilfe-Center", H1 "Wie können wir" + em "helfen?", lead "Antworten zu Wechsel, Montage, Ablesung und Heizkostenabrechnung.", search placeholder "Frage eingeben, z. B. „Vertrag läuft noch“", aria label "Hilfe-Center durchsuchen", submit label "Suchen" (visually hidden, for the no-JS form).
- `popular`: label "Häufig gesucht:", 4 question ids (`laufender-vertrag`, `installation-kosten`, `uvi`, `abrechnung-frist`). The button text is the question itself, so it's looked up, not repeated.
- `results`: `resultsText(n, q)` → "1 Ergebnis für „…“" / "n Ergebnisse für „…“" (the design's wording).
- `topics: Topic[]`, `{ id, title, sub, icon, questions: Question[] }`, in design order. The card's "4 Artikel" is `articlesText(questions.length)` ("1 Artikel" / "n Artikel").
- `Question`: `{ id, question, answer, answerExpired?, more?: { text, href? } }`. Answers are plain text (no HTML), so they work for the search, the JSON-LD and the page without `{@html}`.
- `feedback`: "War das hilfreich?", "Ja", "Nein", "Danke für Ihr Feedback!".
- `noResults`: "Keine passende Antwort gefunden.", "Schreiben Sie uns, Ihr Ansprechpartner hilft gern weiter.", "Kontakt aufnehmen" → `ROUTE_KONTAKT`.
- `endCta`: "Frage nicht dabei? Ihr Ansprechpartner hilft persönlich.", "Gespräch vereinbaren" → `ROUTE_KONTAKT`.
- `trustMore`: "Mehr über Heidi" → `ROUTE_UEBER_UNS`.

Topics and question ids (`c-<topic>` and `q-<question>` in the page):

| Topic (`id`) | Card sub | Questions (`id`) |
|---|---|---|
| Wechsel & Vertrag (`wechsel`) | Kündigung, Vollmacht, laufende Verträge | `laufender-vertrag`, `kuendigung`, `vertragsende`, `ab-wie-vielen-einheiten` |
| Montage & Geräte (`montage`) | Termine, Funkzähler, Fernablesbarkeit | `installation-kosten`, `mieter-information`, `mieter-nicht-da`, `fernablesbar-frist` |
| Ablesung & uVI (`ablesung`) | Funk, monatliche Verbrauchsinformation | `ablesung-wohnung`, `uvi`, `uvi-fehlt`, `verbraeuche-sehen` |
| Heizkostenabrechnung (`abrechnung`) | Erstellung, Fristen, Nachfragen | `abrechnung-entstehung`, `abrechnung-frist`, `selbst-abrechnen`, `abrechnung-pruefen` |
| Dashboard & Schnittstellen (`software`) | ERP, CRM, Datenübergabe | `zweite-software`, `dashboard`, `datenverarbeitung` |
| Für Mieter (`mieter`) | Fragen zur eigenen Abrechnung | `mieter-verbrauch`, `mieter-abrechnung-pruefen`, `monteure` |

The answers' links (the design's `.hc-more`, all pointing to other designs):

| Question | Link text | `href` |
|---|---|---|
| `kuendigung` | Muster-Kündigung → | none yet |
| `vertragsende` | Portfolio-Checker → | none yet |
| `fernablesbar-frist` | Jetzt noch umrüsten → | `ROUTE_UPGRADE_NOW` |
| `uvi` | Mehr zur uVI → | `ROUTE_FUNKTIONEN` (the landing footer's "Verbrauchsinformation (uVI)" target) |
| `verbraeuche-sehen`, `dashboard` | Dashboard ansehen → | none yet |
| `abrechnung-entstehung` | Heizkostenabrechnung → | `ROUTE_FUNKTIONEN` (the landing footer's target) |
| `selbst-abrechnen` | Selbstabrechnung → | none yet |
| `abrechnung-pruefen` | Abrechnung prüfen → | none yet |
| `zweite-software` | Schnittstellen → | none yet |
| `datenverarbeitung` | Sicherheit & Datenschutz → | none yet |
| `mieter-abrechnung-pruefen` | Zum Mieter-Check → | none yet |

A `more` without `href` renders nothing (the answer reads fine without it). When one of these pages exists, its `href` is the only change.

`fernablesbar-frist` gets `answerExpired` (draft for the content owner, placeholder until §4.4: "Seit dem 1. Januar 2027 müssen Zähler und Heizkostenverteiler fernablesbar sein. Heidi baut ausschließlich fernablesbare Funkzähler ein und rüstet Ihren Bestand um."). `resolveTopics(now)` returns the topics with each question's current `answer`, and everything else (search, JSON-LD, sections) reads that, so the two variants can't disagree.

`content.test.ts`: 6 topics, 22 questions, unique question ids, ids are lowercase ASCII slugs (no umlauts, they end up in URLs), popular ids exist, no empty strings, no `XX`, every `more.href` is a route constant or starts with `/` and has a route in `src/routes` (checked against the known route list), the expired variant differs from the current one.

## 1.4 Structured data

Move the FAQPage builder out of `$lib/landing/sections/Faq.svelte` into `$lib/landing/faqJsonLd.ts` (`faqJsonLd(items: FaqItem[]): string`, including the `</script>`-safe escaping it has today). `Faq.svelte` uses it unchanged; `/hilfe`'s `+page.svelte` renders `faqJsonLd` of all 22 resolved questions (the answer text without the `more` link). Check `/messdienstwechsel` and `/upgrade-now` still output byte-identical JSON-LD.

## 1.5 Search module and context

`$lib/landing/pages/hilfe/search.ts` (pure, no runes, shared by `load` and the browser):

- `normalize(s)`: lowercase, `NFD` + strip combining marks, `ß` → `ss`.
- `terms(q)`: `normalize(q)` split on whitespace, words of 2+ characters.
- `matches(question, topicTitle, terms)`: every term occurs in `normalize(question + " " + answer + " " + topicTitle)`. No terms = everything matches.
- `search(topics, q)` → `{ terms, ids: Set<string>, count, autoOpen: boolean }`. `autoOpen` when there are terms and 1–3 results (the design's rule).
- `highlight(text, terms)` → `{ text: string; hit: boolean }[]`: case- and diacritics-insensitive, so it maps positions back to the original string (normalise per character and keep an index map; `ß` → `ss` changes the length, so the map is needed). Overlapping matches merge.

`$lib/landing/pages/hilfe/search.svelte.ts`: `class HelpSearch { query = $state(""); results = $derived(search(topics, this.query)); open = new SvelteSet<string>(); }` with `setHelpSearch(topics, initialQuery)` / `getHelpSearch()`, per the shared-state rule in `CLAUDE.md`. The initial query is `data.q`, so the server and the first client render agree. `open` starts with the auto-opened ids when `autoOpen`.

`search.test.ts`: "lauft" finds "läuft", "strasse" finds "Straße", "uVI" and "UVI" match, one-letter words are ignored, two words must both match, the topic title counts ("mieter" finds the whole "Für Mieter" topic), `highlight` on "Kündigung" for "kundigung" marks the whole word, overlapping terms merge, no match → no segments with `hit`.

## 1.6 Feedback schema, action and webhook

- `$lib/forms/helpFeedback.ts`: `{ question: z.enum(QUESTION_IDS), vote: z.enum(["yes", "no"]) }`. `QUESTION_IDS` is exported from `content.ts`'s topics (the schema may import page content here: it's plain data, and the ids are the contract). Add a test that unknown ids and votes fail.
- `$lib/server/helpFeedback.ts`: `handleHelpFeedback(event, { page })`: zod → rate limit `helpfb:${ip}` (20 per 600 s, 200 with `KITCHEN_SINK`) → `sendWebhookEvent("helpfeedback", { question, vote, page })` (the non-throwing send: a lost vote doesn't matter) → `message(form, { type: "success", question })`. Invalid or rate-limited requests return the same success, so the UI never shows an error for a vote.
- `$lib/server/webhooks.ts`: the event type `"helpfeedback"`. Its payload has no email, so the `[WEBHOOK] Sending … for <email>` log line must handle a missing email (log the event type only).

Tests (Vitest): the action with a mocked webhook (valid → one payload, unknown id → success without sending, rate limit → success without sending).

## 1.7 Shared CTA card

Move the dark card of `/karriere`'s `MoreAbout.svelte` to `$lib/landing/sections/CtaCard.svelte` (props: `id` for `aria-labelledby`, `title`, `cta: { text, href }`). Compare its CSS with the Hilfe design's `.dm-end` / `.dm-cta` first; the base CSS is the same in both designs. `MoreAbout.svelte` becomes a thin wrapper; check `/karriere` at 375 and 1440 px for no visual change.

Update `CLAUDE.md` (a `/hilfe` bullet under "Current state", the layout tree, `faqJsonLd.ts` and `CtaCard` in the landing lines).
