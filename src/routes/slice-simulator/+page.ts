import type { SeoData } from "$lib/seo/site";

// Next shipped this as public/slice-simulator/page.tsx, which isn't a route,
// so the simulator never worked there.
export const load = () => ({ seo: { noindex: true } satisfies SeoData });
