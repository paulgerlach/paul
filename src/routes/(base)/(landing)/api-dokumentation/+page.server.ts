import { LAUNCHED } from "$lib/landing/launch";
import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { MANAGER_SIGNUP_HREF } from "$lib/landing/pages/api-dokumentation/content";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"API-Dokumentation: Verbrauchsdaten nach bved-Standard | Heidi Systems",
		description:
			"Die Heidi-Schnittstelle nach bved-Standard: Verbrauchsdaten für die unterjährige Verbrauchsinformation, Nutzerwechsel und Dokumente per Webservice in Ihrer ERP- oder Verwaltungssoftware. Mit Schnellstart, Authentifizierung, Endpunkten und Statuscodes.",
		ogTitle: "Verbrauchsdaten direkt in Ihre Software. Nach bved-Standard.",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	// No signup form here: the nav's "Demo buchen" goes to /messdienstwechsel's.
	landing: { ...DEFAULT_CHROME, demoHref: MANAGER_SIGNUP_HREF },
});
