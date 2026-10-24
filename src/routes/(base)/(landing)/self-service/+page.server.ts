import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { LAUNCHED } from "$lib/landing/launch";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
	seo: {
		// Drafts for the content owner (go-live gate §2).
		title: "Self-Service: Zählerbedarf selbst erfassen | Heidi Systems",
		description:
			"Zählerbedarf in wenigen Minuten erfassen: Fragen beantworten oder Heizkostenabrechnung hochladen und sofort Geräteliste, Gateway-Planung und vorläufigen Kostenvoranschlag erhalten. Kostenlos und unverbindlich.",
		ogTitle: "Heidi Self-Service: Ihr Zählerbedarf in wenigen Minuten",
		// Until its go-live gate is done (§2).
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
});
