import { LAUNCHED } from "$lib/landing/launch";
import { DEFAULT_CHROME } from "$lib/landing/chrome";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"Muster-Kündigung Messdienst: Vorlage als Word und PDF | Heidi Systems",
		description:
			"Kostenlos und ohne Anmeldung: Erstellen Sie die Kündigung für Ihren bisherigen Messdienstleister in zwei Minuten, für mehrere Liegenschaften, als Word-Datei oder PDF. Ihre Eingaben bleiben in Ihrem Browser.",
		ogTitle: "Messdienst kündigen. In zwei Minuten.",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	// The single time source of the page: the letter's date (SSR renders it,
	// the client clock takes over on mount).
	now: Date.now(),
});
