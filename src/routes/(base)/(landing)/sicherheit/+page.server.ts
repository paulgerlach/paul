import { LAUNCHED } from "$lib/landing/launch";
import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { faq } from "$lib/landing/pages/sicherheit/content";
import { ROUTE_SICHERHEIT } from "$lib/routes";
import { emptySwitchForm, handleSwitchSignup } from "$lib/server/switchSignup";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"Sicherheit & Datenschutz: Ihre Daten bleiben in Deutschland | Heidi Systems",
		description:
			"Heidi speichert Verbrauchs-, Stamm- und Mieterdaten auf Servern in Deutschland und verarbeitet sie nach DSGVO und BDSG. Welche Daten wo liegen und wer Ihr Vertragspartner ist.",
		ogTitle: "Ihre Daten bleiben in Deutschland.",
		// Until its go-live gate is done (plan §4.4). Then also add it to the sitemap.
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
	faq: faq.items,
	finalForm: await emptySwitchForm("final"),
});

export const actions: Actions = {
	default: (event) =>
		handleSwitchSignup(event, {
			source: "sicherheit",
			page: ROUTE_SICHERHEIT,
		}),
};
