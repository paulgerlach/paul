import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { faq } from "$lib/landing/pages/softwarepartner/content";
import { ROUTE_MESSDIENSTWECHSEL, ROUTE_SOFTWAREPARTNER } from "$lib/routes";
import {
	emptySoftwarePartnerForm,
	handleSoftwarePartnerInquiry,
} from "$lib/server/softwarePartnerInquiry";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"Softwarepartner werden: Messdienstdaten in Ihrer Software | Heidi Systems",
		description:
			"Werden Sie Softwarepartner von Heidi Systems: Verbräuche, Heizkostenabrechnungen und Stammdaten fließen direkt in Ihre ERP-, CRM- oder Abrechnungssoftware. Eine Anbindung, keine doppelte Pflege für Ihre Kunden.",
		ogTitle: "Softwarepartner von Heidi Systems",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: true,
		keepCanonical: true,
	},
	// No signup form here: the nav CTA goes to /messdienstwechsel's (open question 1).
	landing: { ...DEFAULT_CHROME, ctaHref: ROUTE_MESSDIENSTWECHSEL },
	faq: faq.items,
	partnerForm: await emptySoftwarePartnerForm(),
});

export const actions: Actions = {
	default: (event) =>
		handleSoftwarePartnerInquiry(event, { page: ROUTE_SOFTWAREPARTNER }),
};
