import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { LAUNCHED } from "$lib/landing/launch";
import { BOOKING_HREF } from "$lib/landing/pages/kontakt/content";
import { ROUTE_KONTAKT } from "$lib/routes";
import {
	emptyContactForm,
	handleContactInquiry,
} from "$lib/server/contactInquiry";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (go-live gate §3).
		title: "Kontakt: Sprechen Sie mit uns | Heidi Systems",
		description:
			"Angebot, Wechsel, laufender Vertrag oder Partnerschaft: Schreiben Sie Heidi Systems oder buchen Sie einen Termin. Ihr persönlicher Ansprechpartner meldet sich bei Ihnen.",
		ogTitle: "Kontakt zu Heidi: persönlich und direkt",
		// Until its go-live gate is done (§3).
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	// The page's form is a contact form: the nav's "Demo buchen" goes to
	// /messdienstwechsel's signup, as every booking link on the page.
	landing: { ...DEFAULT_CHROME, demoHref: BOOKING_HREF },
	contactForm: await emptyContactForm(),
});

export const actions: Actions = {
	default: (event) => handleContactInquiry(event, { page: ROUTE_KONTAKT }),
};
