import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { ROUTE_UPGRADE_NOW } from "$lib/routes";
import { emptySwitchForm, handleSwitchSignup } from "$lib/server/switchSignup";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
	seo: {
		title: "Umrüstpflicht 2026: Zähler fernablesbar machen | Heidi Systems",
		description:
			"Bis 31.12.2026 müssen Heizkostenverteiler und Wärmezähler fernablesbar sein, sonst dürfen Mieter um 3\u00a0% kürzen. Heidi rüstet um, die Installation ist kostenlos.",
		ogTitle: "Nur noch wenige Monate bis zur Umrüstpflicht.",
		// Until its go-live gate is done (plan §5.4). Then also add it to the sitemap.
		noindex: true,
		keepCanonical: true,
	},
	landing: {
		...DEFAULT_CHROME,
		bannerHref: "#risiko",
		ctaLabel: "Bestand prüfen",
	},
	// The single time source of the page: SSR renders every date-dependent
	// number from it, the client clock takes over on mount.
	now: Date.now(),
	finalForm: await emptySwitchForm("final"),
});

export const actions: Actions = {
	default: (event) =>
		handleSwitchSignup(event, {
			source: "upgrade-now",
			page: ROUTE_UPGRADE_NOW,
		}),
};
