# Page `/sicherheit` ("Sicherheit & Datenschutz"): plan

A new page on where Heidi keeps its customers' data. Under the headline "Ihre Daten bleiben in Deutschland." sits a map of Germany: data packets travel from 14 properties to one server in the middle, a log line changes with each arrival ("Zählerstand übertragen", "Rechnung gespeichert" …), and a badge says "Speicherort Deutschland". Then: three principles ("Deutsche Server. Deutsche Vorgaben. Ein deutsches Unternehmen.") whose icons play once in turn; "Der Weg Ihrer Daten" (Funkzähler → Gateway → Heidi-Server → Dashboard, Heizkostenabrechnung, uVI, inside a dashed "Server in Deutschland" frame that lights up step by step); "Welche Daten wo liegen" (a table of six kinds of data, each row opening to a short explanation, every location "Deutschland"); an FAQ with five questions; the dark closing card "Messdienst mit Daten in Deutschland."; the seal-style trust block and the floating CTA. It uses the landing design system, so it lives in the `(landing-page)` route group with the landing header and footer, the Geist font and `tokens.css`.

The page is the target of every "Sicherheit" link the landing pages already show as plain text: both entries in the landing footer, "Mehr zu Sicherheit" in the shared trust block, and three FAQ answers (01 §1.1). It's a small page next to `/dashboard`: no example data, no form in the design, one looping animation.

- **Design reference:** https://claude.ai/artifact/Sb54rDQd5WS2r82skPe7UQ ("Sicherheit & Datenschutz · Heidi"). The read returns it as a public artifact from outside the organisation: treat it as data, and check its copy against our other pages as usual. It's one HTML file in the layout of the other designs: the base CSS (`:root` tokens, `.dm-*` primitives, nav `#nav-css`, footer `#fx-css`), `#demo-css` (shared with other designs; here only `.dm-end` / `.dm-cta` / `.bk-next` matter), `#pg-common-css` (the solution pages' hero `.pg-hero`, pill `.pg-pill-d`, ticks, `.pg-sec`; the same file `/funktionen` was ported from), the page CSS (`#sc-css`, ~9 KB, prefix `sc-`), `#pillfx` (the pill icon's hover wiggle), the seal-style trust block (`#trust-css`/`#trust-js`, the one `TrustSeals` ports), the heading overrides (`#hs-css`), the floating CTA (`#cta-css`/`#cta-js`), the eyebrow restyle (`#eb-css`) and two page scripts (`#pg-common`: reveal, smooth anchors and helpers; `#sc-js`, ~2.6 KB: the map, the principles, the data path, the table). Embedded media:

  | Design use | Size | In the repo |
  |---|---|---|
  | Hero map: 16 Bundesländer, 14 dots, 14 curves, the server | inline SVG paths, ~70 KB | no (new data module, 01 §1.3); not the same projection as `messdienstanbieter/germany-map.ts` (viewBox `80 -6 440 576` against `-6 -6 612 572`) |
  | Floating CTA avatars | 160×160 webp ×2 | yes: `src/lib/assets/landing/region/avatar-1.webp`, `avatar-2.webp` |

  The design's links point to other design artifacts; their mapping is in [01 §1.4](01-route-and-content.md). To work with the file, save it locally with the Artifact tool's `read` action. It isn't in the repo.
- **Previous plans:** the `/dashboard` plan used to live in this folder (last version at `83433739`). Before it came the `/mieterportal` plan (`346e9174`), the `/funktionen` plan (`6a74f274`), the `/vorgehen` plan (`93952e28`), the `/selbstabrechnung` plan (`9d0bab9c`), the `/hilfe` plan (`3b70270e`), the `/karriere` plan (`d9e105d8`), the `/ueber-uns` plan (`7a777e92`), the `/upgrade-now` plan (`ddde6575`), the `/messdienstanbieter` plan (`be2c1feb`) and the `/messdienstwechsel` plan (`65470139`). Their open go-live gates are in [04-qa-and-go-live.md §4.5–4.15](04-qa-and-go-live.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Route, the footer and every other "Sicherheit" link, content, the map data and the pure packet path, SEO, signup wiring, the `TrustSeals` change | S |
| 2 | [02-sections.md](02-sections.md) | The 8 sections with static markup and the design's CSS, every animated block in its end state | M |
| 3 | [03-interactions.md](03-interactions.md) | The map's packet loop, the principles' icons, the data path sequence, the table rows, reveal | S |
| 4 | [04-qa-and-go-live.md](04-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | M |

Phase 1 adds `ROUTE_SICHERHEIT`, the route and every link to it in one commit, so no link ever points at a 404. Phases 2 and 3 can run section by section.

## Target structure

```
src/routes/(landing-page)/sicherheit/
├── +page.server.ts        # load: seo (noindex), landing chrome, the FAQ, the signup form; the signup action
└── +page.svelte           # composes the sections; the page tokens, #hs-css sizes, reveal styles

src/lib/landing/
├── sections/TrustSeals.svelte           # "Mehr zu Sicherheit" links to ROUTE_SICHERHEIT; `securityLink` prop to hide it
└── pages/sicherheit/
    ├── content.ts  content.test.ts      # every text of the page, word for word
    ├── map.ts                           # the hero map: 16 state paths, 14 dots, their curves to the server, the viewBox (data from the design)
    ├── packets.ts  packets.test.ts      # pure: a point on a curve by arc length, the design's easing, the next log message
    ├── icons.ts                         # the page's stroke icons (StrokeIcon paths)
    ├── components/
    │   ├── Icon.svelte                  # draws an icon by name, as on /funktionen
    │   └── Tick.svelte                  # the hero's round check (.okb)
    └── sections/
        ├── Hero.svelte                  # dark .pg-hero: pill, H1, lead, two CTAs, three ticks, DataMap
        ├── DataMap.svelte               # the map, the badge "Speicherort Deutschland", the log line
        ├── Principles.svelte            # "Deutsche Server. Deutsche Vorgaben. Ein deutsches Unternehmen." – three cards
        ├── DataPath.svelte              # "Der Weg Ihrer Daten"
        ├── DataTable.svelte             # "Welche Daten wo liegen", id="daten"
        ├── Faq.svelte*                  # "Häufige Fragen": the shared Faq, default variant
        ├── Closing.svelte*              # the shared CtaCard with the signup form, id="start"
        ├── Trust.svelte*                # TrustSeals without its own "Mehr zu Sicherheit" link
        └── FloatingCta.svelte*          # "Erstgespräch vereinbaren"
```

`*` marks a thin wrapper around a shared section, following the rule of the other landing pages: `+page.svelte` imports only from its own `sections/` folder.

## Implementation notes (2026-10-18)

Phases 1–4 are built: the plan (`80b186ac`), the route, content, pure modules and every link (`82987889`), the sections with their motion (`a0e6b06c`), the table rows' focus ring (`2e79124f`), and `e2e/sicherheit.e2e.ts` (12 tests). The whole e2e suite passes (221 tests, signup tests included, against a throwaway Postgres container on :54322); one city signup test (`an invalid email shows the error`) failed once under full parallel load and passed 3/3 alone. Compared with the design at 1440 and 375 px section by section (hero, principles, data path and table match to the pixel); no horizontal overflow and no console errors at 320, 375, 700, 980, 1100, 1440 and 1640 px. Lighthouse (mobile, local `bun run preview`): Performance 79–88 (LCP is the hero lead; `/dashboard` scores the same 79 there), Accessibility 98, CLS 0, TBT 0 ms; the gzipped document is 43 KB with the map. Open: the manual checks of §4.1 not ticked there, and the gate §4.4. Deviations from the plan:

- **Table rows** are native `<details>` without `slideToggle` (the shared landing `Faq` doesn't use it either); the design's height transition comes from `::details-content` with `interpolate-size`, where the browser supports it, and is instant elsewhere. The closed rows keep the design's extra 14 px (its hidden detail took a grid row and gap).
- **Location text** in the table is `#2f7a3c` instead of `--ok`: `--ok` at 12.5–13.5 px has 3.5:1 contrast on white (Lighthouse `color-contrast`); `#2f7a3c` is the green other landing pages use for small labels.
- **The map** is an `<svg role="img">` with the label, not a labelled wrapper, so the badge stays readable text. Its packets are component state (one `requestAnimationFrame` loop for all in flight), started by `loopInView` every 900 ms plus a random 0–900 ms per pass, which gives the design's 0.9–1.8 s.
- **One-time entrances** (the map's fade-in, the principles' icons, the data path, the table's checks) go through `enterView`, so a block already on screen at load keeps its server state and doesn't play. The data path is dark only between mount and its entrance.
- **The hero's tick list** keeps the design's default `1em` bottom margin (the design relies on the UA margin to centre the column against the map).
- **Class names** that would collide with `tokens.css` or Tailwind were renamed (`btn-accent`/`btn-ghost` → `b-demo`/`b-data`, `.okb` → `.tk`, `grid` → `cols`).
- **The heading-order finding** in Lighthouse is the shared landing footer's `<h4>`, on every landing page; not changed here.

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/sicherheit`, `ROUTE_SICHERHEIT` in `$lib/routes.ts`. It's not the privacy notice: that stays `/datenschutzhinweise` (`ROUTE_DATENSCHUTZHINWEISE`), linked from the footer's legal links as today. Open question 1 |
| Route group | `(landing-page)`, outside `[[preview=preview]]`: a landing design, no Prismic content |
| Indexing | `seo.noindex = true` and out of the sitemap until the cutover, like the other new pages; at the cutover it's indexed and joins the sitemap (decision of 2026-10-17), so its go-live gate (§4.4) blocks the cutover PR (#440) |
| Header | The shared `LandingHeader` with `DEFAULT_CHROME` (the design's banner is the same text) |
| Footer and other links to it | The landing footer's two "Sicherheit" entries (under the logo and in "Plattform", `$lib/landing/footerLinks.ts`) get `href: ROUTE_SICHERHEIT`. The shared `TrustSeals`' "Mehr zu Sicherheit" (today `SECURITY_HREF = undefined`) links here on every page that shows the block. The FAQ answers that point at the topic get their `more` link: `/mieterportal` ("Mehr zu Sicherheit", today without `href`), `/hilfe` ("Sicherheit & Datenschutz", today without `href`) and `/vorgehen` (the design's "Mehr zu Sicherheit", left out so far). Details in 01 §1.1 |
| The trust block on this page | The design's own trust block links "Mehr zu Sicherheit" to the page it's on. Here the link is hidden on `/sicherheit` (`securityLink={false}`), so the block doesn't point at itself; "Demo buchen" stays. Open question 2 |
| Signup and CTAs | The design has no form: "Demo buchen" in the hero and the closing card, and the hero carries `id="start"`. Every "Demo buchen" goes to `DEMO_HREF` (`#start` today), which needs a form to land on. As on `/funktionen` and `/selbstabrechnung`, the closing card holds the shared `SignupForm` (`placement="final"`) in the shared `CtaCard`, and the closing section carries `id="start"` (the hero doesn't). Its button: "Demo buchen" (open question 3). "Welche Daten wo liegen ↓" → `#daten`. Leads: `source: "sicherheit"`, `switchinquiry` with `page: "/sicherheit"` |
| Content | Every text in `content.ts`, word for word from the design (`content.test.ts` pins the H1, the six table rows and the five questions). The company address of the principle card and the FAQ ("Heidi Systems GmbH, Monbijouplatz 4, 10178 Berlin") stays written out as in the design (the footer's `ADDRESS` abbreviates "Monbijoupl. 4"); `content.test.ts` checks it against `ADDRESS` (company, city, and the street with "pl." expanded), so the two can't drift |
| Hero map | The SVG is server-rendered in its end state (states, dashed curves, dots, the server with its slow pulse); only the packets, the dot pings and the server hit are added in the browser. The data (16 state paths, 14 dot positions, 14 curves, all quadratic Béziers to the server at 300,300) moves into `map.ts` as numbers, so the curves are built from their points instead of copied strings. The design moves packets with `getTotalLength()` / `getPointAtLength()`; here `packets.ts` computes the point on the quadratic curve by arc length from a small lookup table (pure, tested), so nothing reads the DOM. The map is one `role="img"` with the design's label ("Karte: Daten aus Liegenschaften in ganz Deutschland laufen auf Server in Deutschland"); the badge is visible text; the log line is `aria-hidden` |
| Loops | One JS loop (the packets: a new one every 0.9–1.8 s, each 2.6–3.8 s long) goes through `loopInView` (in view and in a visible tab only, nothing under reduced motion). The CSS loops (the badge's breathing dot, the server's outer ring, the principles' icons while hovered) are switched off under reduced motion, as the design's `.sc *{animation:none}` does |
| One-time entrances | The principles' icons play once in turn (300 ms + 700 ms each, 1.8 s long), the data path lights up node by node (550 ms steps), the table's location ticks pop in (0.15 s + 0.12 s each). Each block is server-rendered in its end state and goes through `enterView` (moved from `pages/dashboard/` to `$lib/landing/attachments/`, 01 §1.6): a block already on screen at load, reduced motion and no JS keep the end state |
| Table rows | The design's rows are `<button aria-expanded>` with the explanation inside the button (so it's part of the button's name) and nothing without JS. Here each row is a `<details>` whose `<summary>` is the grid (name, purpose, location, chevron) and whose explanation follows it, like the shared `Faq`: works without JS, closed text stays in the HTML, the name is short. The header row ("Daten", "Wofür", "Speicherort") is a visual row, `aria-hidden`; each summary carries the location as text ("Speicherort: Deutschland" for screen readers, `Deutschland` visible). Open question 4 |
| FAQ | The shared `Faq`, default variant, title "Häufige Fragen", first answer open (as designed). It brings the FAQPage JSON-LD. Its look matches `.sc-fq` (the same rules as `.xfq`, which `/funktionen`'s FAQ uses); check spacing on the `alt` background |
| Eyebrow pill | The design's `.pg-pill-d` (dark, with a lock icon and `#pillfx`' hover wiggle) as on `/funktionen`'s hero, which ports the light `.pg-pill`; the dark variant is the page's own markup in `Hero.svelte`, not a shared component |
| Headings | One `<h1>` ("Ihre Daten bleiben " + `<em>`"in Deutschland."); `<h2>` for the principles (with the design's `<br>`), the data path, the table, the FAQ and the closing card, then the trust block's two; `<h3>` for the three principle cards. The `#hs-css` sizes apply to the H1 (`data-hs`) and the H2s with an id |
| Styling | `pg-*` and `sc-*` CSS into the components' scoped `<style>` blocks, with tokens from `tokens.css`. The design's colours that aren't tokens (`#E4EFE6`, `#D3E8D6`, `#B9D9BC`, `#E3F3E4`, `#F2F4F3`, the map's `rgba(138,214,143,…)`) stay literal in the component that uses them; the design's `--ok` is `#3E9A57`, the same as `tokens.css` (`#2F9E44` appears only as a fallback in `#pillfx` and in the principle icons' LED blink). The design's breakpoints stay (1040, 900, 640, 620, 560). No section or element gets a class that is also a Tailwind utility (`CLAUDE.md`): the design's `.in`, `.on`, `.play`, `.ping`, `.hit`, `.pulse`, `.core`, `.sm`, `.alt` are fine, but check each against Tailwind (e.g. rename nothing to `grid`, `hidden`, `blur`) |
| Structured data | FAQPage through the shared `Faq` |
| Rendering | SSR with the `(landing-page)` cache header. Nothing depends on `now` |

## Open questions (the default is built unless answered)

1. **Slug.** *Default: `/sicherheit`* (the footer's label). Alternatives: `/datensicherheit` or `/sicherheit-datenschutz`. Not `/datenschutz`, which reads as the privacy notice.
2. **"Mehr zu Sicherheit" on this page.** *Default: hidden in the trust block on `/sicherheit`* (it would link to the page it's on). Alternative: link it to `#daten`.
3. **Closing card.** The design has only "Demo buchen". *Default: the signup form with the button "Demo buchen"*, since `DEMO_HREF` is `#start` and the page needs a form for it to land on. Once a booking URL exists, the card can go back to the design's single button (and the form leave the page).
4. **Table rows as disclosures.** *Default: `<details>` rows* (works without JS, accessible names stay short). The design's buttons would need JS and put the explanation into the button name.
5. **Which "Sicherheit" footer entry.** Both footer entries (company column and "Plattform") get the link. *Default: both, as designed*; drop the duplicate if the content owner prefers.

## Risks

- **Every gate is on the cutover's critical path**, since every page is indexed after the cutover: this page's and the carried-over ones (04 §4.5–4.15). Mitigation: start the sign-offs early.
- **The claims are the page.** "Alle Daten liegen auf Servern in Deutschland", "Das gilt für alle Daten: Verbräuche, Stammdaten, Mieterdaten, Rechnungen und Abrechnungen", "Heidi verarbeitet und speichert alle Daten nach deutschen Vorgaben", "Gespeichert und verarbeitet wird in Deutschland", the DSGVO/BDSG statements. They must hold for every subprocessor, not only the main database: the platform's hosting and backups, DocuScan's OCR, e-mail delivery, the gateways' transfer path, support tools. This marketing site itself sends leads to Make.com, chat messages to Slack and the AI gateway, and runs on Vercel, so if "alle Daten" is read as including what visitors type here, it isn't true today. Mitigation: legal and data-protection sign-off of every sentence in §4.4, with the subprocessor list from the DPA (AV-Vertrag) at hand; if needed, scope the copy to "Ihre Verbrauchs-, Stamm- und Mieterdaten" with the content owner. This is the gate most likely to change copy.
- **The trust seals.** "VDIV: Kooperationspartner Bund", "DEUMESS: … vernetzt", the DSGVO and "Hosting in Deutschland" seals are already open in the region pages' gate (§4.14, same `TrustSeals`); this page makes them more prominent. "DSGVO" drawn as a seal suggests a certification that doesn't exist as such (open in §4.14 too).
- **The product as described.** "Gateway im Haus" (every installation has a gateway in the building), "Rechnungen aus DocuScan", "Auf Wunsch übergibt Heidi sie an Ihre Verwaltungssoftware", the dashboard "Zugang Ihres Teams". Mitigation: listed in §4.4.
- **Links appearing on other pages.** Turning on `SECURITY_HREF` adds "Mehr zu Sicherheit" to the trust block of eight pages (every city, the Germany page, `/selbstabrechnung`, `/vorgehen`, `/funktionen`, `/mieterportal`, `/dashboard`) while this page is still `noindex`: fine for review, the footer already links `noindex` pages. `e2e/mieterportal.e2e.ts` asserts the link is absent and must be updated (01 §1.1).
- **Map weight.** ~70 KB of path data in the server HTML. Mitigation: round the coordinates to one decimal (they already are), check the gzipped size of the page against `/dashboard` (§4.1); if it hurts LCP, simplify the outlines with the extraction script's tolerance.

## Out of scope

- The design's nav (Produkt / Lösungen / Plattform / Kunden / Ressourcen), its footer (other groups, the city list, the newsletter script `#fx-js`), its chat button, `#top-js` (scroll restoration), `#mobfx` (`tokens.css` covers overflow), `#eb-js`.
- Dead code with no markup on this page: most of `#demo-css` (other designs' demos), `#pg-common-css`' `.pg-seg`, `.pg-card`, `.pg-head`, `.dbm-demo`, `canvas.cf`, `.pg-src`, `.xfq` (the shared `Faq` covers it); `#pg-common`'s `countUp`, `tween`, `confetti`, `seg`, `paintRange`; `.sc-ln b`; `#end-css` (`.uv-end`, not on this page). Not ported.
- The pages the design links to that don't exist: a booking page, "API-Dokumentation", "Neuigkeiten", "Auswertungen", "Schnittstellen".
- A certification or audit page (ISO 27001, TOMs as a download): not in the design.
