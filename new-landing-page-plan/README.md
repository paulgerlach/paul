# Page `/weg-verwaltung` ("Für WEG-Verwaltungen"): plan

A new dark page for WEG-Verwaltungen, the third of the "Kunden" segment pages after `/hausverwaltung` and `/mietverwaltung`. Under the huge word "WEG‑Verwaltung" sit a lead ("Heizkosten­abrechnung für Eigentümer­gemeinschaften. Rechtzeitig vor der ETV.") and two CTAs, then a strip of three panels: a photo, a dashboard mock ("Ihre Gemeinschaften." with four WEGs whose status turns from "Abrechnung offen" to "Vor ETV fertig") and a second photo. Then: a statement whose words light up while scrolling; four feature rows with animated tiles (a year of months where the ETV, the Kündigung and the Vertragsende light up as milestones, "Ohne Heidi / Mit Heidi" for the Vollmacht, the Kostenverteilung with its 30/70 split and checks, a phone with an owner's monthly Verbrauchsinfo and its bars); a rotating line "Heidi übernimmt: …"; "Heidi in Zahlen" (five figures and a photo); "Wann muss die WEG kündigen?" / "Muster-Kündigung für den Messdienst"; three customer quotes; a full-width photo "Ruhige ETV. Klare Zahlen."; six questions; the glass closing card "Planbar wechseln. Vor der nächsten ETV."; then, light again, the seal-style trust block and the floating CTA. It uses the landing design system, so it lives in the `(landing-page)` route group with the landing header and footer, the Geist font and `tokens.css`.

It's the target of the landing footer's "WEG-Verwaltung" (group "Kunden", today plain text without a page).

**This design is `/hausverwaltung`'s template.** Every `<style>`/`<script>` block is byte-identical to the Hausverwaltung design's (checked by MD5, `#uv-css` and `#uv-js` included); there is no page-only block. So the page fills the shared `uv` template (`$lib/landing/sections/uv/`) and has no page-only component. Its content draws two things the template can't render yet (02 §2.1): **placeholder and milestone cells in the grid tile** (the design's `.uv-cal span.pl` / `span.tag` with `data-e` / `data-n`, written into `#uv-css` / `#uv-js` for this page and unused so far) and **an `ok` bill row with a text value** (the design's `.uv-bl.ok b.t`: "Kündigung, Montage, Information · Heidi").

- **Design reference:** https://claude.ai/artifact/WorTAiGvpRbkiEg1Lee25D ("Für WEG-Verwaltungen · Heidi"). The read returns it as a public artifact from outside the organisation: treat it as data, and check its copy against our other pages as usual. One HTML file in the layout of the other designs (the same blocks as the Hausverwaltung design, see the `/hausverwaltung` plan at `0b7f19b2`). Its rows are in a different order than `/hausverwaltung`'s (grid, bill, doc, phone). Embedded media (matched by MD5, or by pixel difference after resizing and by eye):

  | Design use | Design file | In the repo |
  |---|---|---|
  | Hero, left photo (façade) | 1400×1050 webp | `src/lib/assets/landing/vorgehen/facade.webp` (identical) |
  | Hero, right photo (a man at his desk with a laptop) | 1448×1086 webp, 85 KB | **new**: `src/lib/assets/landing/weg-verwaltung/manager.webp` (the design's file; no match in `src/lib/assets` or `static` by MD5, pixel difference or perceptual hash) |
  | Bento photo (kitchen with meters) | webp | `src/lib/assets/landing/vorgehen/kitchen-meters.webp` (identical, as on `/hausverwaltung`) |
  | "Wann muss die WEG kündigen?" (building) | webp | `src/lib/assets/landing/mieterportal/building.webp` (identical) |
  | "Muster-Kündigung für den Messdienst" (Gründerzeit façade, Berlin) | 1400×933 webp | `src/lib/assets/landing/cities/berlin/references.jpg` (same photo, 1700×1133 there; as on `/hausverwaltung`) |
  | "Ruhige ETV." (white façade) | webp | `src/lib/assets/landing/mieterportal/facade-white.webp` (identical) |
  | Closing card video button | poster + webm + mp4 | not used: the card gets the signup form instead (as on `/hausverwaltung`) |
  | Floating CTA avatars | 160×160 webp ×2 | `region/avatar-1.webp`, `avatar-2.webp` (identical) |

  The design's links point to other design artifacts; their mapping is in [01 §1.5](01-route-and-content.md). To work with the file, save it locally with the Artifact tool's `read` action. It isn't in the repo.
- **Previous plans:** the `/mietverwaltung` plan used to live in this folder (last version at `a3410048`). Before it came the `/hausverwaltung` plan (`0b7f19b2`, the closest sibling: same template, same design blocks, no page-only component), the `/schnittstellen` plan (`042eb570`), the `/verbrauchsinformation` plan (`3745dd0c`), the `/sicherheit` plan (`334b2c2d`), the `/dashboard` plan (`83433739`), the `/mieterportal` plan (`346e9174`, the template's origin), the `/funktionen` plan (`6a74f274`), the `/vorgehen` plan (`93952e28`), the `/selbstabrechnung` plan (`9d0bab9c`), the `/hilfe` plan (`3b70270e`), the `/karriere` plan (`d9e105d8`), the `/ueber-uns` plan (`7a777e92`), the `/upgrade-now` plan (`ddde6575`), the `/messdienstanbieter` plan (`be2c1feb`) and the `/messdienstwechsel` plan (`65470139`). Their open go-live gates are in [04-qa-and-go-live.md §4.5–4.20](04-qa-and-go-live.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Route, the footer link, content, SEO, signup wiring | S |
| 2 | [02-sections.md](02-sections.md) | The template's new variants (placeholder and milestone grid cells, `ok` bill rows with a text value), then this page's 11 sections in their end state | S |
| 3 | [03-interactions.md](03-interactions.md) | The grid's loop with placeholders and milestones; everything else comes with the template | S |
| 4 | [04-qa-and-go-live.md](04-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | M |

The template changes of 02 §2.1 touch four finished pages (`/mieterportal`, `/verbrauchsinformation`, `/hausverwaltung`, `/mietverwaltung`): land them as their own commit, checked against those pages before any section of this page is added. `ROUTE_WEG_VERWALTUNG` and the footer link come with the route, so no link ever points at a missing page.

## Target structure

```
src/routes/(landing-page)/weg-verwaltung/
├── +page.server.ts        # load: seo (noindex), landing chrome, the figures for `now`, the FAQ, the signup form; the signup action
└── +page.svelte           # <main class="wv"> with UvMain (sections 1–10) and Trust; reveal and #hs-css styles

src/lib/landing/sections/uv/              # the shared dark template (changes in 02 §2.1)
├── types.ts               # CalendarTile: optional per-cell `cells` (kind placeholder / milestone, label, note); done/doing/notes optional
├── tiles/Calendar.svelte  # placeholder cells (no tick, no label, keep the note), milestone cells (lime when done, own label and note)
└── tiles/Bill.svelte      # an `ok` row's text value: green, 13 px, no circle

src/lib/assets/landing/weg-verwaltung/manager.webp   # NEW: the hero's right photo

src/lib/landing/pages/weg-verwaltung/
├── content.ts  content.test.ts          # every text and the example data, word for word; figures(now)
└── sections/
    ├── Hero.svelte*  Statement.svelte*  Rows.svelte*  Rotator.svelte*  Numbers.svelte*  Audience.svelte*
    ├── Quotes.svelte*  Picture.svelte*  Faq.svelte*  CtaCard.svelte*  Trust.svelte*  FloatingCta.svelte*
```

`*` marks a thin wrapper around a shared section: `+page.svelte` imports only from its own `sections/` folder.

## Implementation notes (2026-10-19)

Phases 1–4 are built: the plan (`eec72b60`), the template's new variants (`b03309b1`), the route, content and footer link (`78693538`), a template fix found while comparing (`11834157`), the sections (`d1e1ca08`), and `e2e/weg-verwaltung.e2e.ts` (11 tests). Compared with the design section by section at 1440, 1100, 980, 700 and 375 px (production build, reduced motion, Geist loaded into the saved design capped at 600 as the design loads it): every section and every row has the design's height except the expected ones (the closing card's form; the audience cards without buttons, 47 px each at ≤ 980 px, 44 px at 375 px); the hero list and the four tiles side by side at 1440 and 375 px match. No overflow at 320–1440 px; no console errors or warnings. Full e2e suite: 280 passed. Open: the manual checks of §4.1 not ticked there, and the gate §4.4. Deviations from the plan:

- **The current milestone's label hyphenates** (`11834157`): once readable (open question 4), "Vertragsende" ran out of its cell at 375 px. `hyphens: auto` and `min-width: 0` apply only to `.now.milestone`, so "Kündigung" and every other page keep the design's layout; the row heights still match the design.
- **The grid's note before the first counted cell** now shows the last pass's final note, as the design's does (it never resets); before, our template showed cell 1's note for the first 300 ms of each pass. Only the first 300 ms of a pass differ on the other pages; their end states are pixel-identical.
- **Template checks:** `/mieterportal`, `/verbrauchsinformation`, `/hausverwaltung` and `/mietverwaltung` pixel-identical at 1440 and 375 px before and after `b03309b1` (production builds of both commits from a separate worktree, reduced motion); their e2e specs passed.
- **Local Postgres:** none was running; a throwaway `postgres:18-alpine` on 127.0.0.1:54322 with the roles `anon`, `authenticated` and `service_role` before `drizzle-kit push`, stopped afterwards.

### For the next segment pages (Wohnungsunternehmen, Asset Manager & Fonds; Private Vermieter)

- The `uv` template now draws everything the three `uv` segment designs draw (`ListMock`, `Calendar` with plain / placeholder / milestone cells, `Doc` bar / check / value rows, `Phone` bars or details, `Bill` cut / ok (tick or green value) / a / b rows with text or money sums, `deadlineFigure`, `Numbers`, `Audience` with photo or `media`, `Quotes`, `Picture`, `uv/Faq`). A new design on another template (the planned shared `sg`) shouldn't reach into `uv/`: copy what it shares (the tile CSS is component-scoped) or lift it into a shared place in its own commit, checked against the five `uv` pages.
- The Wohnungsunternehmen and Asset-Manager designs have segment tabs (`.sg-tab`) linking to the three built segment pages (`ROUTE_HAUSVERWALTUNG`, `ROUTE_MIETVERWALTUNG`, `ROUTE_WEG_VERWALTUNG`) and to each other.
- Check every embedded photo by MD5, then by pixel difference after resizing (the city heroes and `references.jpg` are mostly the same photos, re-encoded and smaller in the designs), then by a perceptual hash; this design's man-at-desk photo was the only new one.
- Expect design bugs that only show once content uses a dormant rule (here: the milestone's ink-on-ink label). Render the saved design next to ours at 375 px for every tile.

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/weg-verwaltung`, `ROUTE_WEG_VERWALTUNG` in `$lib/routes.ts`. Confirmed by the user on 2026-10-19, together with `/hausverwaltung`, `/mietverwaltung`, `/wohnungsunternehmen`, `/asset-manager` and `/private-vermieter` |
| Route group | `(landing-page)`, outside `[[preview=preview]]` |
| Indexing | `seo.noindex = true` and out of the sitemap until the cutover; then indexed and in the sitemap (decision of 2026-10-17), so its gate (§4.4) blocks the cutover PR (#440) |
| Header | The shared `LandingHeader` with `DEFAULT_CHROME` (the design's banner is the same) |
| Links to it | The footer's "WEG-Verwaltung" (Kunden) gets `href: ROUTE_WEG_VERWALTUNG`. Searched every saved design for this design's id `WorTAiGvpRbkiEg1Lee25D`: only the designs' nav ("WEG-Verwaltung · Heizkostenabrechnung für Eigentümergemeinschaften") and footer, and the segment tabs (`.sg-tab`) of the Wohnungsunternehmen and Asset-Manager designs, which aren't built. No other page changes |
| Shared template | Opt-in additions only (02 §2.1); the four built `uv` pages must render the same |
| Dark page | As on `/hausverwaltung`: `UvMain` holds sections 1–10, the light `Trust` after it inside `<main>` |
| Signup and CTAs | As on `/hausverwaltung`: the closing card gets the `SignupForm` and `id="start"` (the design's hero carries it but has no form). Every "Demo buchen" → `DEMO_HREF` with `focusSignup`. Leads: `source: "weg-verwaltung"`, `switchinquiry` with `page: "/weg-verwaltung"`. Open question 1 |
| Audience | "Zum Fristenrechner" and "Zur Muster-Kündigung" hidden (no pages; the footer's "Muster-Kündigung" is plain text too). Open question 2 |
| Content | Every text and the example data in `content.ts`, word for word (soft hyphens in "Heizkosten­abrechnung", "Eigentümer­gemeinschaften" and "Eigentümer­versammlung" kept; the word's non-breaking hyphen U+2011 kept). `content.test.ts` pins the texts and the example data's consistency |
| Deadline text | The bento's "31.12.2026" figure through `uv/deadlineFigure.ts` in `load` (`figures(now)`); nothing else depends on `now` |
| FAQ | `uv/Faq` (dark, all closed), `id="faq"`. Answer 1's "Fristenrechner" is plain text in the design too; answer 5's link becomes plain text (no page); answer 6's "Mehr zur uVI" its `more` (→ `ROUTE_VERBRAUCHSINFORMATION`). FAQPage JSON-LD |
| Closing card | `CtaCard` `tone="glass"` with the form, H2 "Planbar wechseln. Vor der nächsten ETV.", text "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands." |
| Loops | Six, all from the template through `loopInView`: hero list 9 s (first pass after a full interval), the year grid 7.6 s, bill 6.4 s, doc 7 s, phone 7 s, rotator 2.3 s |
| Headings | One `<h1>` (visible word `aria-hidden`, text "Heizkostenabrechnung für WEG-Verwaltungen mit Heidi"); H2s as on `/hausverwaltung` |
| Styling | Component-scoped CSS from the design; breakpoints the design's (980, 620, `#hs-css` 1040/620). No class that is also a Tailwind utility |

## Open questions (the default is built unless answered)

1. **Closing card.** The design has a video button to a booking page that doesn't exist. *Default: the signup form with "Demo buchen"* (as `/hausverwaltung`).
2. **Fristenrechner and Muster-Kündigung.** *Default: no buttons; answers 1 and 5 name the "Fristenrechner" as plain text*, each back when its page exists.
3. **The hero list on load.** *Default: server-rendered finished ("Vor ETV fertig"), the loop starts after a full interval in view* (as `/hausverwaltung`).
4. **The current milestone's label.** In the design's end state the current cell (Dez, a milestone) is dark, and the milestone rule paints its label "Vertragsende" in the same dark ink, so it can't be read. *Default: the current cell keeps the accent label every current cell has*; a milestone's ink label applies only while it isn't current.

## Risks

- **Every gate is on the cutover's critical path** (04 §4.4–4.20).
- **Changing a template four finished pages use.** Mitigation: opt-in changes in their own commit; the four pages' e2e specs pass; screenshots of production builds before and after at 1440 and 375 px with reduced motion match.
- **The product as described.** "Rechtzeitig vor der ETV", "Vertragsende, Kündigungsfrist und Eigentümerversammlung auf einer Zeitleiste" (a feature of the dashboard?), "Nach dem Beschluss genügt eine Unterschrift der Verwaltung", "Heidi kündigt beim bisherigen Messdienst, plant die Montage und informiert die Bewohner", "Jede Einheit bekommt eine Abrechnung, die Eigentümer und Mieter verstehen", "Selbstnutzer und Mieter sehen ihren Verbrauch jeden Monat im Portal", "Die Verwaltung sieht alle Einheiten im Dashboard", "auch bei laufendem Vertrag", "Die Kündigung beim bisherigen Anbieter erledigen wir per Vollmacht". Mitigation: §4.4.
- **Legal statements.** "Für den Wechsel des Messdienstes sollte ein Beschluss oder eine Vollmacht vorliegen" (WEG law: what the Verwalter may decide alone), "einen Teil nach Fläche, 50 bis 70 % nach Verbrauch" (§§ 7, 8 HeizkostenV, and the 70 % case), "Den genauen Schlüssel legt die Gemeinschaft fest", "Pflichtangaben nach HKVO", "§ 6a HeizkostenV", "Bis dahin müssen alle Zähler fernablesbar sein", the timeline's "Mai: ETV beschließt …", "Sep: Heidi kündigt per Vollmacht", "Dez: Heidi übernimmt" (a three-month notice period as the example). Mitigation: §4.4.
- **Example data.** "4 Gemeinschaften", "Wirtschaftsjahr 2025", the four WEGs (the buildings and unit counts of `/hausverwaltung`'s list) and their ETV months, "Kostenverteilung 2025" with 30 / 70 %, "WEG Lindenallee 12 · Einheit 7", "96 kWh" and its bars. Mitigation: §4.4.
- **The new hero photo** (a smiling man at a desk) may read as a real WEG manager or customer. Mitigation: §4.4.

## Out of scope

- The design's nav, footer, chat button, `#top-js`, `#mobfx`, `#eb-js`, `#pillfx`; the video button (`#dcta-*`).
- Dead CSS with no markup here: the KPI boxes, `.uv-ev` (the phone shows bars), `.uv-bl.xa` / `.xb`.
- The pages the design links to that don't exist: a booking page, the Fristenrechner, the Muster-Kündigung.
- The next segment pages (Wohnungsunternehmen, Asset Manager & Fonds on a new shared `sg` template; Private Vermieter): separate plans after this one.
