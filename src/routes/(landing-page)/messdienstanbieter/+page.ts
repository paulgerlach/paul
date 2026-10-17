import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ data }) => {
	// Its own chunk, like the city modules (the map data is large).
	const content = (
		await import("$lib/landing/pages/messdienstanbieter/content")
	).default;
	return {
		...data,
		content,
		seo: content.seo,
		landing: { bannerText: content.bannerText, ctaLabel: "Bestand prüfen" },
	};
};
