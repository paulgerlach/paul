import { LAUNCHED } from "$lib/landing/launch";
import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { ROUTE_NEUIGKEITEN } from "$lib/routes";
import { emptySwitchForm, handleSwitchSignup } from "$lib/server/switchSignup";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"Neuigkeiten von Heidi: Produkt-Updates, Werkzeuge und Fristen | Heidi Systems",
		description:
			"Neue Funktionen, kostenlose Werkzeuge und Partnerschaften von Heidi auf einen Blick, dazu die Fristen der Heizkostenverordnung. Damit Sie wissen, was sich für Ihre Verwaltung ändert.",
		ogTitle: "Neuigkeiten von Heidi.",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	finalForm: await emptySwitchForm("final"),
});

export const actions: Actions = {
	default: (event) =>
		handleSwitchSignup(event, {
			source: "neuigkeiten",
			page: ROUTE_NEUIGKEITEN,
		}),
};
