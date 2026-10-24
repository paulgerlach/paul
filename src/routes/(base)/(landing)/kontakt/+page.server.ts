import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { LAUNCHED } from "$lib/landing/launch";
import { ROUTE_KONTAKT } from "$lib/routes";
import {
	emptyContactForm,
	handleContactInquiry,
} from "$lib/server/contactInquiry";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (go-live gate §4).
		title: "Kontakt: Sprechen Sie mit uns | Heidi Systems",
		description:
			"Angebot, Wechsel, laufender Vertrag oder Partnerschaft: Schreiben Sie Heidi Systems oder buchen Sie einen Termin. Ihr persönlicher Ansprechpartner meldet sich bei Ihnen.",
		ogTitle: "Kontakt zu Heidi: persönlich und direkt",
		// Until its go-live gate is done (§4).
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	contactForm: await emptyContactForm(),
});

export const actions: Actions = {
	default: (event) => handleContactInquiry(event, { page: ROUTE_KONTAKT }),
};
