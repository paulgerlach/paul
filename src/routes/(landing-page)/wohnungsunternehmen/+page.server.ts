import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { faq } from "$lib/landing/pages/wohnungsunternehmen/content";
import { ROUTE_WOHNUNGSUNTERNEHMEN } from "$lib/routes";
import { emptySwitchForm, handleSwitchSignup } from "$lib/server/switchSignup";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"Messdienst für Wohnungsunternehmen: der Wechsel als Rollout im Cluster | Heidi Systems",
		description:
			"Heidi stellt große Bestände strukturiert um: Portfolio-Check, Pilotobjekt, Rollout im Cluster, mit einem festen Ansprechpartner. Ab 1.000 Einheiten mit einem Angebot für Ihren Bestand.",
		ogTitle: "Große Bestände. Strukturiert umgestellt.",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: true,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	faq: faq.items,
	finalForm: await emptySwitchForm("final"),
});

export const actions: Actions = {
	default: (event) =>
		handleSwitchSignup(event, {
			source: "wohnungsunternehmen",
			page: ROUTE_WOHNUNGSUNTERNEHMEN,
		}),
};
