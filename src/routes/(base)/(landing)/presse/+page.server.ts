import { LAUNCHED } from "$lib/landing/launch";
import { DEFAULT_CHROME } from "$lib/landing/chrome";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title: "Presse: Kontakt, Media Kit und Fakten | Heidi Systems",
		description:
			"Pressekontakt, Logos, Unternehmensprofil und die wichtigsten Fakten zu Heidi Systems, dem digitalen Messdienst aus Berlin für Hausverwaltungen in ganz Deutschland.",
		ogTitle: "Hallo, Presse.",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
});
