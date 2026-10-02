# Phase 4: Static Pages

**Goal:** port the 7 marketing pages. All are server-rendered with no data dependencies (kontakt's form logic comes in phase 7), so every one of them can be **prerendered**.

## Order (simplest → most complex, to build momentum and shake out conventions)

| # | Route | Lines | Main dependencies | Notes |
|---|---|---|---|---|
| 1 | `/impressum` | 155 | text, few images | Validates the page template + `<Seo>` |
| 2 | `/datenschutzhinweise` | 330 | text | Long legal copy. Diff the text programmatically (see below) |
| 3 | `/preise` | 139 | `PriceCards`, `PriceTable` (client toggle), FAQ, Kostenfrei | |
| 4 | `/geraete` | 101 | `GeraeteHero`, `GeraeteHeroTicker`, `ChessSection`, `Eigenschaften`, `GeräteangebotSwiper` | |
| 5 | `/funktionen` | 139 | `FunktionenHero`, `AnimationsSection` (Lottie), `Grid`, `FunctionsSwiper` | |
| 6 | `/kontakt` | 212 | `ContactForm` (UI only here) | Form wiring in phase 7 |
| 7 | `/` | 713 | `HomeHero`, `HeroTicker`, 6+ swipers, Lottie, `ReviewsSwiper` videos | Biggest page. Consider splitting it into `lib/components/Home/*` sections while porting |

## Per-page recipe

1. Create `src/routes/(base)/<route>/+page.svelte`.
2. Add `export const prerender = true;` in `+page.ts`. Leave it out for `/kontakt` if it gets a form action (actions require a non-prerendered page).
3. Add `<Seo title=… description=… />` with values from the **effective** metadata baseline (phase 2.6).
4. Copy the JSX and apply the mechanical transforms from [patterns.md](patterns.md):
   - `className` → `class`, `htmlFor` → `for`, `{/* */}` → `<!-- -->`
   - `{cond && <X/>}` → `{#if cond}<X/>{/if}`; `{list.map(x => <X key={x.id}/>)}` → `{#each list as x (x.id)}<X/>{/each}`
   - `<Image>` → `<enhanced:img>` (phase 2.5); `<Link>` → `<a>`
   - `style={{ fontSize: '3em' }}` → `style="font-size: 3em"` (or better, a Tailwind class)
5. Move constant arrays and objects (slide data, feature lists, price tiers) into a `<script module>` block or a `*.ts` data file next to the page.
6. Visually diff against Next (phase 10 tooling can already be used here).

## Text diffing for legal pages
```bash
for p in impressum datenschutzhinweise; do
  diff <(curl -s localhost:3000/$p | npx html-to-text --wordwrap=false) \
       <(curl -s localhost:5173/$p | npx html-to-text --wordwrap=false)
done
```
Legal copy must match word for word.

## Videos (`ReviewsSwiper`)
The paths are relative (`videos/video1.mp4`). Make them absolute (`/videos/video1.mp4`) so they resolve on nested routes. Keep `preload="none"` plus a poster so the home page doesn't download 4 videos up front.

## Known issues fixed in this phase
Details are in [known-issues.md](known-issues.md). Tick them there as well.

- [ ] **KI-09** (Med): Review videos use relative paths; make them absolute and add `preload="none"`

## Exit criteria
- All 7 routes render visually identical at 375 / 768 / 992 / 1200 / 1640 px.
- Every page is prerendered, except kontakt if it uses an action. `bun run build` output lists them.
- Head tags match the baseline.
- All known issues listed above are fixed.
