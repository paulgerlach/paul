import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { START_HREF } from "$lib/landing/cta";
import { LAUNCHED } from "$lib/landing/launch";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
	seo: {
		// Drafts for the content owner (go-live gate §2).
		title: "Demo buchen: Heidi mit Ihrem eigenen Bestand sehen | Heidi Systems",
		description:
			"Kostenlose Demo per Video-Call oder Telefon: Live-Dashboard, Portfolio-Check Ihrer Messdienstverträge und alle Fragen zum Wechsel. Wunschtermin direkt im Kalender wählen.",
		ogTitle: "Sehen Sie Heidi mit Ihrem eigenen Bestand.",
		// Until its go-live gate is done (§2).
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	// The nav's "Demo buchen" leads to the booking card on the page itself.
	landing: { ...DEFAULT_CHROME, demoHref: START_HREF },
	// The single time source of the page: SSR renders the booking card's
	// weekdays from it, the client clock takes over on mount.
	now: Date.now(),
});
