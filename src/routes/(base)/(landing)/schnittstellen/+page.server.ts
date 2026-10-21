import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { faq } from "$lib/landing/pages/schnittstellen/content";
import { ROUTE_SCHNITTSTELLEN } from "$lib/routes";
import { emptySwitchForm, handleSwitchSignup } from "$lib/server/switchSignup";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"Schnittstellen zu ERP und CRM: Verbrauchsdaten direkt in Ihrer Software | Heidi Systems",
		description:
			"Heidi ist in Ihr ERP- oder CRM-System integriert: Verbrauchsdaten und fertige Heizkostenabrechnungen landen direkt in Ihrer Software. Kein Abtippen, keine Dateien, kein Softwarewechsel.",
		ogTitle: "Eine Plattform pflegen. Nicht zwei.",
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
			source: "schnittstellen",
			page: ROUTE_SCHNITTSTELLEN,
		}),
};
