import { error } from "@sveltejs/kit";
import { isLiveCity } from "$lib/landing/pages/messdienstanbieter-city/cities";
import type { RegionContent } from "$lib/landing/sections/region/types";
import type { PageLoad } from "./$types";

// One lazy chunk per city, so a page loads only its own content and map.
const modules = import.meta.glob<{ default: RegionContent }>([
	"/src/lib/landing/pages/messdienstanbieter-city/cities/*.ts",
	"!**/index.ts",
	"!**/*-map.ts",
	"!**/*.test.ts",
]);

export const load: PageLoad = async ({ params, data }) => {
	const module =
		modules[
			`/src/lib/landing/pages/messdienstanbieter-city/cities/${params.city}.ts`
		];
	// The matcher only lets known cities through; this catches a missing module.
	if (!module) error(404, "Not found");
	const content = (await module()).default;
	return {
		...data,
		content,
		// A city that isn't live yet renders for review, but stays out of the
		// index. Its canonical still points to itself (built by <Seo>).
		seo: isLiveCity(params.city)
			? content.seo
			: { ...content.seo, noindex: true, keepCanonical: true },
		landing: { bannerText: content.bannerText, ctaLabel: "Bestand prüfen" },
	};
};
