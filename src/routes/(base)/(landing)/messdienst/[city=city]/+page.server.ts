import { cityRoute } from "$lib/routes";
import { emptySwitchForm, handleSwitchSignup } from "$lib/server/switchSignup";
import type { Actions, PageServerLoad } from "./$types";

// The city content, SEO and header texts come from the universal load
// (+page.ts), so the city module isn't serialized into the page twice.
export const load: PageServerLoad = async () => ({
	heroForm: await emptySwitchForm("hero"),
	finalForm: await emptySwitchForm("final"),
});

export const actions: Actions = {
	// Source and page come from the route, never from form input.
	default: (event) =>
		handleSwitchSignup(event, {
			source: `messdienstanbieter-${event.params.city}`,
			page: cityRoute(event.params.city),
			extra: { city: event.params.city },
		}),
};
