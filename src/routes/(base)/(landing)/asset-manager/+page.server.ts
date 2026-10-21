import { LAUNCHED } from "$lib/landing/launch";
import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { faq } from "$lib/landing/pages/asset-manager/content";
import { ROUTE_ASSET_MANAGER } from "$lib/routes";
import { emptySwitchForm, handleSwitchSignup } from "$lib/server/switchSignup";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
	seo: {
		// Drafts for the content owner (plan §4.4).
		title:
			"Verbrauchsdaten für Asset Manager und Fonds: das ganze Portfolio auf einen Blick | Heidi Systems",
		description:
			"Heidi liefert Asset Managern und Fonds eine einheitliche Datenbasis über alle Objekte und Verwaltungen: fernablesbare Zähler, monatliche Verbräuche und Abrechnungen nach HKVO in einem Dashboard.",
		ogTitle: "Verbräuche im ganzen Portfolio. Auf einen Blick.",
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
			source: "asset-manager",
			page: ROUTE_ASSET_MANAGER,
		}),
};
