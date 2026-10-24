import { LAUNCHED } from "$lib/landing/launch";
import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { faq } from "$lib/landing/pages/installationspartner/content";
import { ROUTE_INSTALLATIONSPARTNER } from "$lib/routes";
import {
	emptyPartnerForm,
	handlePartnerInquiry,
} from "$lib/server/partnerInquiry";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"Installationspartner werden: Zähler montieren mit Heidi | Heidi Systems",
		description:
			"Werden Sie zertifizierter Installationspartner von Heidi Systems: Wir schulen Ihr Team auf Funkzähler und das Installationstool, informieren die Mieter und planen die Einsätze in Ihrer Region. Deutschlandweit, ohne Klemmbrett.",
		ogTitle: "Installationspartner von Heidi Systems",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	faq: faq.items,
	partnerForm: await emptyPartnerForm(),
});

export const actions: Actions = {
	default: (event) =>
		handlePartnerInquiry(event, { page: ROUTE_INSTALLATIONSPARTNER }),
};
