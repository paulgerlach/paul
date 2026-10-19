import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { faq } from "$lib/landing/pages/partnerschaften/content";
import { ROUTE_MESSDIENSTWECHSEL, ROUTE_PARTNERSCHAFTEN } from "$lib/routes";
import {
	emptyConnectionForm,
	handleConnectionInquiry,
} from "$lib/server/connectionInquiry";
import {
	emptyPartnershipForm,
	handlePartnershipInquiry,
} from "$lib/server/partnershipInquiry";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title: "Partnerschaften: Mit Heidi zusammenarbeiten | Heidi Systems",
		description:
			"Sie haben ein Produkt, ein Netzwerk oder eine Idee, die zu Heidi passt? Heidi Systems arbeitet mit Softwareanbietern, Installationsbetrieben, Verbänden und Messdienstanbietern zusammen. Lassen Sie uns sprechen.",
		ogTitle: "Partnerschaften mit Heidi Systems",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: true,
		keepCanonical: true,
	},
	// No signup form here: the nav CTA goes to /messdienstwechsel's.
	landing: { ...DEFAULT_CHROME, ctaHref: ROUTE_MESSDIENSTWECHSEL },
	faq: faq.items,
	// Two forms, two actions (plan 01 §1.3).
	partnershipForm: await emptyPartnershipForm(),
	connectionForm: await emptyConnectionForm(),
});

export const actions: Actions = {
	partnership: (event) =>
		handlePartnershipInquiry(event, { page: ROUTE_PARTNERSCHAFTEN }),
	connection: (event) =>
		handleConnectionInquiry(event, { page: ROUTE_PARTNERSCHAFTEN }),
};
