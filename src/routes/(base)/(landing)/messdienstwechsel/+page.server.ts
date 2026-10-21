import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { ROUTE_MESSDIENSTWECHSEL } from "$lib/routes";
import { emptySwitchForm, handleSwitchSignup } from "$lib/server/switchSignup";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => ({
	seo: {
		title: "Messdienstleister wechseln | Heidi Systems",
		description:
			"Sie schicken uns Ihren Vertrag, Heidi erledigt den Rest. Auch mit laufendem Vertrag: Wir werten Ihre bestehenden Zähler sofort aus.",
		ogTitle: "Messdienstleister wechseln. So einfach wie nie.",
	},
	landing: DEFAULT_CHROME,
	heroForm: await emptySwitchForm("hero"),
	finalForm: await emptySwitchForm("final"),
});

export const actions: Actions = {
	default: (event) =>
		handleSwitchSignup(event, {
			source: "messdienstwechsel",
			page: ROUTE_MESSDIENSTWECHSEL,
		}),
};
