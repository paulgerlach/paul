import { LAUNCHED } from "$lib/landing/launch";
import type { PageLoad } from "./$types";

// "Demo buchen": the Fragebogen's questions first; once the inquiry is sent
// the booking page (/demo/termin) opens.
export const load: PageLoad = () => ({
	seo: {
		// Drafts for the content owner (go-live gate §7).
		title: "Demo buchen: Heidi mit Ihrem eigenen Bestand sehen | Heidi Systems",
		description:
			"Kostenlose Demo per Video-Call oder Telefon: Live-Dashboard, Portfolio-Check Ihrer Messdienstverträge und alle Fragen zum Wechsel. Wenige Fragen beantworten, dann Wunschtermin im Kalender wählen.",
		ogTitle: "Sehen Sie Heidi mit Ihrem eigenen Bestand.",
		// Until its go-live gate is done (§7).
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
});
