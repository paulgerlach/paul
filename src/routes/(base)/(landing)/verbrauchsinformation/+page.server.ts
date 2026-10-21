import { LAUNCHED } from "$lib/landing/launch";
import { DEFAULT_CHROME } from "$lib/landing/chrome";
import {
	faqItems,
	figures,
} from "$lib/landing/pages/verbrauchsinformation/content";
import { ROUTE_VERBRAUCHSINFORMATION } from "$lib/routes";
import { emptySwitchForm, handleSwitchSignup } from "$lib/server/switchSignup";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const now = Date.now();
	return {
		seo: {
			// Drafts for the content owner (plan §4.4).
			title:
				"uVI: unterjährige Verbrauchsinformation für Ihre Mieter | Heidi Systems",
			description:
				"Heidi stellt die monatliche Verbrauchsinformation nach § 6a HeizkostenV automatisch für jede Wohnung bereit: Verbrauch in kWh, Vergleich mit Vormonat, Vorjahresmonat und Durchschnitt. Ohne Aufwand für Ihr Team.",
			ogTitle: "uVI: Unterjährige Verbrauchsinformation mit Heidi",
			// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
			noindex: !LAUNCHED,
			keepCanonical: true,
		},
		landing: DEFAULT_CHROME,
		faq: faqItems(now),
		figures: figures(now),
		finalForm: await emptySwitchForm("final"),
	};
};

export const actions: Actions = {
	default: (event) =>
		handleSwitchSignup(event, {
			source: "verbrauchsinformation",
			page: ROUTE_VERBRAUCHSINFORMATION,
		}),
};
