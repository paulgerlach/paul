# Phase 2: Route, content model, SEO and assets

## 2.1 Files

```
src/params/city.ts                                       # matcher
src/routes/(landing-page)/messdienstanbieter/[city=city]/
├── +page.server.ts                                      # forms + action
├── +page.ts                                             # city content, seo, landing (header props)
└── +page.svelte                                         # composes the sections (phase 3)
src/lib/landing/sections/region/types.ts                 # RegionContent, RegionMap (shared with the Germany page)
src/lib/landing/pages/messdienstanbieter-city/
├── cities/index.ts
├── cities/berlin.ts
└── cities/berlin-map.ts
```

`$lib/routes.ts`: add `ROUTE_MESSDIENSTANBIETER = "/messdienstanbieter"` and `cityRoute(slug) => \`${ROUTE_MESSDIENSTANBIETER}/${slug}\``.

No collision: `messdienstanbieter` doesn't match the `preview` matcher, and there's no other dynamic top-level route.

## 2.2 Matcher and city index

```ts
// cities/index.ts: tiny on purpose, it's bundled into the client router
export const CITIES = [{ slug: "berlin", name: "Berlin", state: "Berlin", live: true }] as const;   // phase 7 adds the others
// `state` (Bundesland) is used by the Germany map (phase 8)
export type CitySlug = (typeof CITIES)[number]["slug"];
export const isCitySlug = (s: string): s is CitySlug => CITIES.some((c) => c.slug === s);

// src/params/city.ts
export const match = ((param: string): param is CitySlug => isCitySlug(param)) satisfies ParamMatcher;
```

Adding a city = one entry here + `cities/<slug>.ts` (+ map, photos). The sitemap, the footer "Städte" group and the e2e tests all read `CITIES`.

## 2.3 Loads

`+page.ts` (universal):

```ts
const modules = import.meta.glob<{ default: RegionContent }>(
  "/src/lib/landing/pages/messdienstanbieter-city/cities/*.ts",   // excludes index.ts and *-map.ts by a filter
);
export const load = async ({ params, data }) => {
  const city = (await modules[`…/cities/${params.city}.ts`]()).default;
  return { ...data, city, seo: city.seo, landing: { bannerText: city.bannerText, ctaLabel: "Bestand prüfen" } };
};
```

`+page.server.ts`: `load` returns `heroForm` / `finalForm` from `emptySwitchForm()`. `actions.default` calls `handleSwitchSignup(event, { source: \`messdienstanbieter-${params.city}\`, page: cityRoute(params.city), extra: { city: params.city } })`.

The `(landing-page)` layout sets the cache header. The page must not set its own.

## 2.4 Content model (`$lib/landing/sections/region/types.ts`)

The 21 readable city designs (phase 7) show what varies: **the copy of every section**, not only the city name. Bremen's "Kein Warten" section, for example, has its own eyebrow, H2, intro and check bullets. So the model holds every visible text of every section, **written out in full** (German inflection also makes templating like "`${name}er` Bestand" fragile: "Berliner", "Münchner", "Kölner"). Only what is identical in all 21 designs stays in the components: the nav, the references copy, the partner logos, the KPI numbers, the timeline's structure, the hero loop texts and the trio demo texts.

The model is designed against all 22 designs (21 cities + Germany), not just Berlin, so phases 7 and 8 don't have to change it. It's called `RegionContent` because the Germany page implements it too; `slug` is optional there.

```ts
export interface RegionContent {
  slug?: CitySlug;                    // unset on the Germany page
  name: string;                       // "Berlin"
  seo: { title: string; description: string; ogTitle: string };   // required, unique per page (README core requirement)
  links: { nearby: CitySlug[] };      // 2–4 nearby cities, rendered only when live; empty on the Germany page
  bannerText: string;
  hero: {
    tag: string; title: string; lede: string;   // "Messdienst für Hausverwaltungen in Berlin" / "Messdienst wechseln in Berlin. Ohne Wartezeit." / …
    checks: [string, string, string];
    photo: Picture; photoAlt: string; // "Berliner Altbau-Mehrfamilienhaus"
    property: { address: string; area: string; units: number };   // Kastanienallee 12 · Prenzlauer Berg · Altbau · 24 WE
    contractUntil: number;            // 2029
  };
  logoStrip: { text: string; logos: LogoKey[] };   // order differs per city; München adds "Landeshauptstadt München"
  noWait: SectionHead & { notes: [string, string, string] };
  allInOne: SectionHead & { cards: [Card, Card, Card, Card] };   // H3 + text per card; visuals use `example`
  example: { address: string; units: number };   // reused in AllInOne, billing, duo, trio
  map: RegionMap;
  billing: SectionHead & { checks: string[]; rows: [string, string][] };   // the dark "Auf Knopfdruck" section
  service: SectionHead;               // "Service aus Berlin" / "Service für München" …
  duo: { uvi: CardHead; portfolio: CardHead };
  uviPhone: { unit: string; months: string[]; values: number[]; previous: number[] };
  portfolio: { title: string; tabs: PortfolioTab[] };   // "Portfolio Berlin", counts + table rows per tab
  trio: [CardHead, CardHead, CardHead];
  referencesPhoto: Picture;           // the quotes are shared, the background photo is per city
  faq: FaqItem[];                     // 5 per city
  final: { title: string; sub: string };
}

type SectionHead = { eyebrow: string; title: string; text: string };

export interface RegionMap {
  eyebrow: string; title: string; sub: string;   // "In ganz Berlin" / "Von Spandau bis Köpenick. Wir sind vor Ort." / …
  ariaLabel: string;                  // "Karte der Berliner Bezirke"
  viewBox: string;
  outline?: string;                   // non-interactive city outline (`.bz-out`), drawn under the districts
  areaLabel: string;                  // info panel key: "Bezirk", "Stadtbezirk", "Bundesland" …
  districts: {
    name: string;
    href?: string;                    // Germany page: city dots link to the city pages (phase 8)
    shape: { kind: "path"; d: string } | { kind: "dot"; cx: number; cy: number; r: number };
    label: { x: number; y: number; lines: string[]; small?: boolean };   // `small` = the design's `.sm` labels, hidden below 560 px
    stock: string; hint: string;      // "Typischer Bestand" + hint, from the design's `BZ` object
  }[];
  defaultDistrict: string;            // "Pankow"
  marker?: { x: number; y: number };   // the pulsing example property; none on the Germany map
  legend: string;                     // "Beispielobjekt Kastanienallee 12" / "Städte mit eigener Heidi-Seite (anklicken)"
  style?: { strokeWidth?: number; labelSize?: number };   // München: 1.6 / 10.5 px
}
```

The map comes in 3 variants in the designs (phase 7.3): district polygons (Berlin), outline + polygons, outline + dots. All of them fit this one model. `cities/berlin-map.ts` holds Berlin's 12 Bezirke (about 15 KB). It's imported by `berlin.ts`, so it lands in the Berlin chunk only.

Vitest (`types.test.ts` or `cities.test.ts`): every `CITIES` entry has a module, `defaultDistrict` exists in `districts`, `uviPhone` arrays have equal length, portfolio counts add up for the "Alle" tab.

## 2.5 SEO

`berlin.ts`:

```ts
seo: {
  title: "Messdienstanbieter Berlin: Messdienst wechseln ohne Wartezeit | Heidi Systems",
  description: "Messdienst für Hausverwaltungen in Berlin: Heidi übernimmt Ihre bestehenden Zähler sofort und kümmert sich um Installation, Mieterkommunikation, Ablesung und Heizkostenabrechnung.",
  ogTitle: "Messdienst wechseln in Berlin. Ohne Wartezeit.",
}
```

(The title is a proposal; the design has none beyond "Heidi Berlin". Confirm in the gate.) Every city gets its own title and description written the same way: the city name, the service, the main benefit of that city's copy. They are not generated from a template string; the uniqueness and length checks in phase 6.2 catch accidental copies.

Canonical: `<Seo>` builds it from `page.url.pathname`, so each city canonicalizes to itself. Don't pass a `canonical` override in `seo`, and keep it self-referencing on `noindex` pages too.

- `<Seo>` in the root layout handles canonical (`https://heidisystems.com/messdienstanbieter/berlin`), OG and robots.
- JSON-LD: the shared `Faq` adds `FAQPage`. Add one `Service` block (`serviceType: "Messdienst / Heizkostenabrechnung"`, `provider` = the organisation, `areaServed: { "@type": "City", name: "Berlin" }`) in the page. **No phone number** in it until KI-34 is resolved.
- Sitemap (`src/routes/sitemap.xml/+server.ts`): add `...CITIES.map((c) => ({ path: cityRoute(c.slug), changefreq: "monthly", priority: 0.8 }))`. It goes live only at cutover, and the go-live gate decides whether Berlin stays in it.

## 2.6 Assets

The embedded files were extracted and hashed against the repo (the extraction script stays in the scratchpad, not the repo):

| Asset | Status | Target |
|---|---|---|
| 12 customer logos | **Identical** to `$lib/assets/landing/logos/*.png` | reuse `customerLogos` |
| Demo poster + video (webm/mp4) | **Identical** to `demo-poster.jpg` and `static/landing/demo.*` | reuse via `DemoCard` |
| Hero photo, "Berliner Altbau" (jpeg, 158 KB) | new | `$lib/assets/landing/cities/berlin/hero.jpg`, `?enhanced`, `priority` (it's the LCP image) with `sizes` |
| References background (jpeg, 376 KB) | new, **different in every city design** | `$lib/assets/landing/cities/berlin/references.jpg`, `?enhanced`, lazy |
| Partner logos DEUMESS, VDIV, bved (webp) | new | `$lib/assets/landing/partners/*.webp`, `?enhanced`. Check whether the site footer's VDIV badge is the same file and reuse it if so |
| Werne logo in the references card | the design clones it from the logo strip | reuse `werne.png`, white via `filter: brightness(0) invert(1)` as in the design |
| Inline SVGs (icons, map paths, phone UI, charts) | keep inline | repeated icons → `components/icons/` (Check, Chevron and Arrow already exist) |

## Done when

- `/messdienstanbieter/berlin` renders with the landing header (Berlin banner, "Bestand prüfen") and footer (Städte: Berlin), and an empty main area. `/messdienstanbieter/foo` returns 404, and so does `/messdienstanbieter` until phase 8.
- `/messdienstanbieter/berlin/` redirects to the URL without the slash.
- View source shows the Berlin title, description, canonical and OG tags. The sitemap lists the Berlin URL.
- `bun run check` and `bun run test:unit` pass.
