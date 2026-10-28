import { DEFAULT_CHROME } from "$lib/landing/chrome";
import { LAUNCHED } from "$lib/landing/launch";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
	seo: {
		// The business's URL list (url-changes.csv): drafts for the content
		// owner (go-live gate §2).
		title: "Kundenreferenzen | Heidi",
		description: "Was Hausverwaltungen über Heidi sagen.",
		// Until its go-live gate is done (§2).
		noindex: !LAUNCHED,
		keepCanonical: true,
	},
	landing: DEFAULT_CHROME,
});
