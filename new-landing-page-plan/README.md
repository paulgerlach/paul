# Page `/hilfe` ("Hilfe-Center"): plan

The help center of Heidi Systems. A light hero ("Wie können wir helfen?") with a search field and four "Häufig gesucht" questions, six topic cards, then the articles: 22 questions in six topics (Wechsel & Vertrag, Montage & Geräte, Ablesung & uVI, Heizkostenabrechnung, Dashboard & Schnittstellen, Für Mieter) as expandable cards, with a sticky topic list on the left and a "War das hilfreich?" vote under each answer. The search filters the questions as you type and highlights the matches; with no match, a "Keine passende Antwort gefunden" box links to contact. It ends with a dark "Frage nicht dabei?" card and the partner cards. It uses the landing design system, so it lives in the `(landing-page)` route group with the landing header and footer, the Geist font and `tokens.css`. Once phase 1 is done, the landing footer's "Hilfe-Center" entry (plain text today) links here.

- **Design reference:** https://claude.ai/artifact/SqREeUtRo8jL153iMHcKyC ("Hilfe-Center · Heidi"). It's one HTML file, laid out like the "Karriere" design: the shared base CSS (`:root` tokens, `.dm-*` primitives, nav), the "Lösungsseiten" blocks (`#pg-common-css`, prefix `pg-`), the page CSS (`#hc-css`, prefix `hc-`, ~55 lines), the card-style trust block (`#trust-css`), the shared helper script (`#pg-common`: reveal, smooth anchor scroll) and the page script (`#hc-js`, ~20 lines: search, popular questions, feedback, topic scroll-spy, topic cards). The only embedded images are the 3 partner logos, which `TrustCards` already has. Every article is in the HTML (`<details class="hc-q">` with a lowercase search string in `data-s`). The design's links point to other design artifacts; their mapping to our routes is in [01 §1.3](01-route-and-content.md). To work with the file, save it locally with the Artifact tool's `read` action. It isn't in the repo.
- **Previous plans:** the `/karriere` plan used to live in this folder (last version at `d9e105d8`). Before it came the `/ueber-uns` plan (`7a777e92`), the `/upgrade-now` plan (`ddde6575`), the `/messdienstanbieter` plan (`be2c1feb`) and the `/messdienstwechsel` plan (`65470139`). Their open go-live gates are in [04-qa-and-go-live.md §4.5–4.9](04-qa-and-go-live.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Route, content module, the pure search, SEO and FAQ JSON-LD, the feedback action and `helpfeedback` webhook, the footer entry, the shared CTA card | M |
| 2 | [02-sections.md](02-sections.md) | The 5 sections with static markup and the design's CSS, server-rendered search results for `?q=` | M |
| 3 | [03-interactions.md](03-interactions.md) | Live search and highlighting, keyboard shortcuts, popular questions, topic cards, deep links, scroll-spy, the feedback vote, reveal on scroll | M |
| 4 | [04-qa-and-go-live.md](04-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | S |

Phase 1 goes first, in one commit: once the footer entry points to `/hilfe`, the e2e check "internal links resolve" needs the route. Phases 2 and 3 can overlap, since phase 3 only needs phase 2's markup.

## Target structure

```
src/routes/(landing-page)/hilfe/
├── +page.server.ts        # load: seo, landing chrome, now, q; the feedback action
└── +page.svelte           # sets the HelpSearch context, composes the sections

src/lib/forms/
└── helpFeedback.ts  helpFeedback.test.ts        # zod schema: question id, vote (shared client/server)

src/lib/server/
├── helpFeedback.ts                              # the action: zod → rate limit → helpfeedback webhook
└── webhooks.ts                                  # + "helpfeedback"

src/lib/landing/
├── faqJsonLd.ts                                 (moved out of sections/Faq.svelte: FAQPage builder)
├── sections/
│   └── CtaCard.svelte                           (moved out of pages/karriere/sections/MoreAbout.svelte)
└── pages/hilfe/
    ├── content.ts  content.test.ts              # all copy: hero, popular, 6 topics × questions, empty state, end card
    ├── search.ts  search.test.ts                # pure: normalize, match, highlight segments
    ├── search.svelte.ts                         # HelpSearch context: query, results, open questions
    ├── icons.ts                                 # the 6 topic icons (StrokeIcon paths)
    └── sections/
        ├── Hero.svelte                          # pill, H1, lead, SearchBox, Popular
        ├── SearchBox.svelte                     # <form role="search" method="get">, the "/" hint
        ├── Popular.svelte                       # "Häufig gesucht:" links
        ├── Topics.svelte                        # the 6 topic cards
        ├── Articles.svelte                      # grid: Toc + result line + TopicSection × 6 + NoResults
        ├── Toc.svelte                           # sticky "Themen" nav with scroll-spy
        ├── TopicSection.svelte                  # id="c-<topic>": heading + Question × n
        ├── Question.svelte                      # <details id="q-<id>">, answer, more link, Feedback
        ├── Feedback.svelte                      # "War das hilfreich?" Ja / Nein form
        ├── NoResults.svelte                     # "Keine passende Antwort gefunden." → /kontakt
        ├── EndCta.svelte*                       # CtaCard "Frage nicht dabei? …" → /kontakt
        └── Trust.svelte*                        # TrustCards with "Mehr über Heidi" → /ueber-uns
```

`*` marks a thin wrapper around a shared section, following the rule of the other landing pages: `+page.svelte` imports only from its own `sections/` folder.

## Implementation notes (2026-10-12)

Phases 1–3 are built, with the Vitest and Playwright tests of §4.2 (`e2e/hilfe.e2e.ts`, 15 tests) and the `svelte-migration-plan/` changes of §4.3. Open: the manual checks of §4.1 (visual comparison per width, other browsers, iOS, VoiceOver, Lighthouse, a vote reaching the sheet) and the go-live gate §4.4. Deviations from the plan:

- **Feedback form on the client:** each `Feedback` form posts with SvelteKit's `enhance` (`$app/forms`), not one superForm shared by 22 forms; the action still uses superforms + zod and only its `message.question` is read (no-JS votes come back through the page's `form` prop). So `load` returns no `feedbackForm`. An invalid vote is answered as valid (no `fail(400)`), so the page never shows an error for it.
- **`sendWebhookEvent(…, email: string | null, …)`:** `null` leaves `email` out of the payload and the log line. The other events' payloads are unchanged.
- **Result line:** the visible text and the live region are the same element, so it follows the query after the 300 ms settle (with the URL), not per keystroke.
- **Initial deep link** runs from `afterNavigate` ("enter", deferred a microtask): `replaceState` throws in `onMount`, before Kit's router has started.
- **Topic icons** are drawn by `pages/hilfe/components/Icon.svelte` by name (`icons.ts`), as on `/karriere`.
- **Reduced motion:** `tokens.css` turns off `app.css`'s smooth scrolling as `html:has(.lp)`, so the rule stays scoped to landing pages.

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/hilfe` as `ROUTE_HILFE` in `$lib/routes.ts` (short, German; open question 1) |
| Route group | `(landing-page)`, outside `[[preview=preview]]`, because the design is a landing design and there's no Prismic content |
| Header | The shared `LandingHeader` with `DEFAULT_CHROME`'s banner. The design gives the hero `id="start"`, so its nav CTA "Bestand prüfen" would land in the search field. As on `/karriere`, `ctaHref: ROUTE_MESSDIENSTWECHSEL`, and the hero gets no `id="start"` (open question 6) |
| Footer | The shared `LandingFooter`. `companyLinks` "Hilfe-Center" gets `href: ROUTE_HILFE`. The site footer's "FAQ" (→ `/blog`, as on Next) stays until after the cutover (open question 5) |
| Content | All 22 questions live in `content.ts` as `topics[]` with `questions[]` (`id`, `question`, `answer`, optional `more` link), word for word from the design. Topic card counts ("4 Artikel") and the `data-s` search strings are derived, not written. No Prismic custom type before the cutover, because the repo is shared with Next (open question 4) |
| Links in answers | The design links 12 answers to other designs. Answers link only where our page exists (`/upgrade-now`, `/funktionen` for three of them); the rest keep their `more.text` without `href` and render no link, like the landing footer's plain-text entries. A new page switches its link on with one `href` (table in [01 §1.3](01-route-and-content.md)) |
| Contact targets | "Kontakt aufnehmen" (empty state) and "Gespräch vereinbaren" (end card) go to `ROUTE_KONTAKT`. `DEMO_HREF` is `#start`, which on this page is the search, so it can't be used (open question 3) |
| Search | One pure module (`search.ts`) used on the server and in the browser: lowercase, diacritics folded (the design defines `norm()` but never calls it, so "lauft" misses "läuft"; we fold, and also `ß` → `ss`), words of 2+ letters, every word must occur in question + answer + topic title. Matches in the question title are highlighted with `<mark>`, rendered from segments, never `{@html}` |
| Search without JS | The field is a `<form role="search" method="get" action="/hilfe">` with `name="q"`. `load` reads `q` (trimmed, max 100 chars) and the page renders the filtered list, result line and auto-opened questions on the server. With JS, the list filters on every keystroke and the URL follows with `replaceState`, so reload and sharing keep the query. A `?q=` URL is `noindex` with the canonical `/hilfe` |
| Questions | Native `<details>` with stable ids (`q-<id>`), so every answer is deep-linkable (`/hilfe#q-installation-kosten`) and works without JS. With JS, opening a `#q-…` hash opens its card |
| Feedback | "War das hilfreich?" is a real form (`?/feedback`, superforms + zod, works without JS) that sends a Make.com `helpfeedback` event (question id, vote, page). Nothing is stored and nothing personal is sent. A blocked or failed send still thanks the visitor, because the vote is non-essential (open question 2) |
| Styling | The `hc-*` and `pg-*` CSS goes into the sections' scoped `<style>` blocks, with tokens from `tokens.css`. The design's breakpoints stay: 900 (topic list hidden, 2 topic columns) and 560 (1 column, no `/` hint), 640 from `#pg-common-css`, 820 for the trust cards. The `#hs-css` heading overrides apply only where the design applies them (the H1 and the trust heading); topic headings keep `clamp(22px,2vw,28px)` |
| Reuse | `ArrowLink` (`inv` on the end card, `ink` in the empty state), `TrustCards` with `more`, `StrokeIcon`, the `reveal` attachment. The dark end card is the same `.dm-cta` as `/karriere`'s "Mehr über Heidi erfahren?", so it moves to `$lib/landing/sections/CtaCard.svelte` (phase 1.7). The FAQPage JSON-LD builder of `Faq.svelte` moves to `$lib/landing/faqJsonLd.ts` (phase 1.4) |
| Structured data | FAQPage JSON-LD of all 22 questions (answers as plain text, the deadline answer in its current variant). Google shows FAQ rich results only for a few authoritative sites now, but the markup still describes the page |
| Deadline answer | "Bis wann müssen Zähler fernablesbar sein?" names 31.12.2026. Its expired variant is chosen with `isExpired(now)` from `$lib/landing/deadline/deadline.ts`, with `now` from `load`. No `Date.now()` in components |
| Indexing | `noindex` + self-canonical and out of the sitemap until the go-live gate (§4.4), like the other new landing pages |
| Rendering | SSR with the `(landing-page)` cache header. The CDN caches each `?q=` URL separately, which is fine for a GET search |

## Open questions (the default is built unless answered)

1. **Slug.** *Default: `/hilfe`.* `/hilfe-center` (matches the label) and `/faq` are the alternatives. Decide before go-live.
2. **Feedback destination.** *Default: the Make.com `helpfeedback` event, which Make writes to a sheet the content owner reads.* Alternatives: drop the vote until someone reads it (a vote nobody reads is a promise we don't keep), or a "Nein" follow-up ("Was hat gefehlt?") with a text field, which would bring the spam pipeline and PII rules of the other forms.
3. **Contact targets.** *Default: `/kontakt` for both.* Once a booking URL exists, "Gespräch vereinbaren" can go to `DEMO_HREF` (set it to that URL first). The "fester Ansprechpartner" in the copy is for customers; for prospects the contact form is the honest target.
4. **Managing articles.** *Default: `content.ts`.* After the cutover, a Prismic `help_article` type (topic, question, rich-text answer, link) would let support add answers without a deploy, and answer detail pages could follow.
5. **Discoverability.** *Default: the landing footer links here.* After the cutover, the site footer's "FAQ" could point here instead of `/blog` (a deliberate deviation from Next, to be listed in `scripts/layout-diff.ts`), and the chat widget could suggest matching answers.
6. **Header CTA.** *Default: "Bestand prüfen" → `/messdienstwechsel`.*
7. **"Für Mieter".** *Default: kept, as designed.* Tenants reach a B2B site through their bill; the two answers send them to their Verwaltung and to the Mieter-Check (no page yet, so no link).

## Risks

- **Legal statements.** The answers state law as fact: the 31.12.2026 retrofit deadline, § 6a HeizkostenV (monthly uVI), the 3 % cut under § 12, and "spätestens zwölf Monate … danach kann keine Nachzahlung mehr verlangt werden" (§ 556 Abs. 3 BGB has an exception the answer leaves out). Mitigation: legal sign-off in the gate (§4.4), and every answer stays short and general.
- **Unconfirmed claims.** "ab zwei Wohneinheiten", "mehr als 1.000 Einheiten … individuelles Angebot", the Vollmacht and the Kündigung template, DocuScan, Selbstabrechnung, ERP/CRM connection, the dashboard's features, "Servern in Deutschland" / "DSGVO und BDSG". In the gate. (92 %, 14 Tage, 1–2 h, free installation per installed meter plus Abrechnungspauschale: the KPIs were confirmed 2026-10-12; the pricing sentence is the same one gated on `/upgrade-now`.)
- **Stale answers.** The deadline answer turns false on 1.1.2027 without its expired variant; a help page with wrong answers costs more trust than one with fewer. Mitigation: the expired variant from day one, and an owner for the content in the gate.
- **Dead ends.** Nine of the design's 12 answer links have no page. Mitigation: no link until the page exists, and a content test that fails on a `more.href` that isn't a known route or anchor.
- **Feedback abuse.** A public form, cheap to spam, and each vote costs a Make.com operation. Mitigation: zod (known question ids only), and a rate limit (`helpfb:<ip>`, 20 per 10 minutes); a blocked vote gets the same "Danke".

## Out of scope

- The design's nav (Produkt / Lösungen / Kostenlose Checks / Plattform / Kunden / Ressourcen).
- Answer detail pages, a CMS, search over the blog, search analytics (queries aren't logged), and a "Nein" follow-up form (open questions 2 and 4).
- The design's pill hover wiggles (`#pillfx`), as on the other landing pages.
