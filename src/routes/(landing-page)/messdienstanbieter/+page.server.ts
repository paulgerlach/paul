import { ROUTE_MESSDIENSTANBIETER } from "$lib/routes";
import { emptySwitchForm, handleSwitchSignup } from "$lib/server/switchSignup";
import type { Actions, PageServerLoad } from "./$types";

// Content, SEO and header texts come from the universal load (+page.ts).
export const load: PageServerLoad = async () => ({
	heroForm: await emptySwitchForm("hero"),
	finalForm: await emptySwitchForm("final"),
});

export const actions: Actions = {
	default: (event) =>
		handleSwitchSignup(event, {
			source: "messdienstanbieter",
			page: ROUTE_MESSDIENSTANBIETER,
		}),
};
