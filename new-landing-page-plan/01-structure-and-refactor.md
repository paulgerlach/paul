# Phase 1: Structure and refactor

Goal: `$lib/landing` gets the `pages/<landing>/sections/` layout, the parts both designs share are extracted, and **`/messdienstwechsel` looks and behaves exactly as before**. This phase adds no Berlin page yet. Ship it as its own commit(s), so the refactor can be reviewed apart from the new page.

## 1.1 Moves (`git mv`, so history follows)

| From | To |
|---|---|
| `$lib/landing/components/sections/*.svelte` (all 14) | `$lib/landing/pages/messdienstwechsel/sections/` |
| `$lib/landing/data.ts`, `data.test.ts` | `$lib/landing/pages/messdienstwechsel/data.ts`, `data.test.ts` |
| `customerLogos` + `CustomerLogo` type (from `data.ts`) | `$lib/landing/data/logos.ts` (used by both pages) |
| `FaqItem` type (from `data.ts`) | `$lib/landing/sections/Faq.svelte` exports it (`<script module>`) |

Then update the imports in `messdienstwechsel/+page.svelte` and in the moved files (they use relative `../../data` today; switch to `$lib/landing/…` so they don't break on the next move).

## 1.2 Shared sections (`$lib/landing/sections/`)

Both designs use the same CSS for these, so they become prop-driven components. The `/messdienstwechsel` wrappers pass today's copy, so the rendered HTML stays the same.

| Shared component | Props | `/messdienstwechsel` wrapper | Berlin wrapper (phase 3) |
|---|---|---|---|
| `LogoStrip` | `text: string`, `placeholder?: boolean` (keeps `data-placeholder` on the claim) | "Über 200 Hausverwaltungen rechnen bereits mit Heidi ab.", `placeholder` | "Hausverwaltungen in Berlin und ganz Deutschland rechnen bereits mit Heidi ab." |
| `Faq` | `items: FaqItem[]`, `title = "FAQ"`. It keeps the FAQPage JSON-LD in `<svelte:head>` | `faqItems` from its `data.ts` | `city.faq` |
| `FinalCta` | `title`, `sub`, `form`, `submitLabel?` | today's copy | "Wechseln Sie Ihren Messdienst in Berlin. Heute." / "Eine Unterschrift. Um den Rest kümmern wir uns." |

Each page keeps a file of the same name in its own `sections/` folder (e.g. `pages/messdienstwechsel/sections/Faq.svelte`), which only renders the shared component with that page's props. `+page.svelte` imports the wrapper, never `$lib/landing/sections/…` directly.

## 1.3 Shared building blocks (`$lib/landing/components/`)

- **`DemoCard.svelte`** (new, extracted from the `/messdienstwechsel` `Hero`): the link with the hover/focus/touch video, poster, "Demo mit unserem Team buchen" and the arrow. Props: `href = DEMO_HREF`, `label?`. Berlin's demo card is the same element.
- **`SignupForm.svelte`**: new prop `submitLabel = "Wechsel kostenlos prüfen"`. Nothing else changes.
- **`LandingHeader.svelte`**: new props `bannerText` and `ctaLabel = "Wechsel starten"`. The banner keeps the "Mehr erfahren" link to `#faq`. The landing layout gets these from `page.data.landing` (`{ bannerText, ctaLabel }`), which each page returns from its load, so the layout itself stays generic. `/messdienstwechsel` returns today's banner text.
- **`LandingFooter.svelte`**: new "Städte" group (links from `cities/index.ts`, phase 2). It is added in this phase with an empty list and renders nothing until a city exists, so `/messdienstwechsel` doesn't change yet.
- **`cta.ts`**: add `DEMO_HREF = START_HREF` (one place to switch every demo CTA to a booking URL).
- **`confetti.ts`** (new): `burst(canvas, origin, opts)` ported from the design's two identical confetti functions (60 particles, 6 colours, about 3.8 s, cleared at the end). It returns a cancel function for teardown. It does nothing with reduced motion. Only the city page uses it, but it lives here because two sections share it.

## 1.4 Shared signup server code

The `/messdienstwechsel` `+page.server.ts` holds `emptyForm`, `blocked` and the action body. Move them into `$lib/server/switchSignup.ts`:

```ts
export function emptySwitchForm(placement: SwitchPlacement): Promise<SuperValidated<SwitchInquiry>>;
export function handleSwitchSignup(
  event: RequestEvent,
  opts: { source: string; page: string; extra?: Record<string, string> },
): Promise<ActionFailure | { form }>;
```

The logic stays exactly as it is now: spam traps before validation errors, a separate `switch:<ip>` rate limit, lead saved, webhook failures swallowed. `/messdienstwechsel/+page.server.ts` becomes `load` (seo + forms + `landing`) and `actions.default = (e) => handleSwitchSignup(e, { source: "messdienstwechsel", page: ROUTE_MESSDIENSTWECHSEL })`. The existing e2e tests cover it.

## 1.5 Docs

- `CLAUDE.md` Layout block: replace the `landing/` line with the new structure (`pages/<landing>/sections`, shared `sections/`, `components/`).
- `CLAUDE.md` Current state: point to this plan for the city pages and to §6.5 for the `/messdienstwechsel` gate.

## Done when

- `/messdienstwechsel` is pixel-identical at 1440 / 1100 / 980 / 700 / 375 px (screenshots before and after the refactor) and has the same HTML apart from Svelte's hydration markers.
- `bun run check`, `bun run lint`, `bun run test:unit` and `bun run test:e2e` (including the signup tests with the local Postgres) pass.
- `rg "components/sections" src` returns nothing.
