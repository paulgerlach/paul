import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { ROUTE_PORTFOLIO_CHECKER } from "$lib/routes";
import { emptySwitchForm, handleSwitchSignup } from "$lib/server/switchSignup";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"Portfolio-Checker: Messdienstverträge prüfen und auswerten | Heidi Systems",
		description:
			"Kostenlos und unverbindlich: Laden Sie Messdienstverträge, Nachträge und Preisblätter hoch. Heidi prüft jedes Dokument, analysiert Laufzeiten und Fristen und zeigt für jede Liegenschaft den nächsten Schritt.",
		ogTitle: "Vertragsunterlagen hochladen. Heidi liest den Rest.",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: true,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	// The single time source of the page: the example evaluation's dates are
	// computed from it (the client clock takes over on mount).
	now: Date.now(),
	finalForm: await emptySwitchForm("final"),
});

export const actions: Actions = {
	default: (event) =>
		handleSwitchSignup(event, {
			source: "portfolio-checker",
			page: ROUTE_PORTFOLIO_CHECKER,
		}),
};
