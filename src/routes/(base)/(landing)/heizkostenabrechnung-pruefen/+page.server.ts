import { LAUNCHED } from "$lib/landing/launch";
import { DEFAULT_CHROME } from "$lib/landing/chrome";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"Heizkostenabrechnung prüfen: kostenloser Checker für Mieter | Heidi Systems",
		description:
			"Laden Sie Ihre Heizkostenabrechnung hoch oder geben Sie die Werte ein: Der Checker prüft sie gegen Heizkostenverordnung und BGB und zeigt, ob Sie kürzen dürfen oder eine Nachzahlung entfällt. Mit Musterschreiben.",
		ogTitle: "Heizkostenabrechnung jetzt überprüfen.",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	// The single time source of the page: the rules' "today" and the
	// example's receipt date (the client clock takes over on mount).
	now: Date.now(),
});
