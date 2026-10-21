import { DEFAULT_CHROME } from "$lib/landing/chrome";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => ({
	seo: {
		// Drafts for the content owner (ongoing-tasks/go-live-gates.md §1).
		// Indexed: the page replaces a live URL.
		title: "Datenschutzerklärung | Heidi Systems",
		description:
			"Wie Heidi Systems personenbezogene Daten verarbeitet, wenn Sie diese Website nutzen oder mit uns Kontakt aufnehmen: Verantwortlicher, Zwecke, Empfänger und Ihre Rechte nach DSGVO.",
	},
	landing: DEFAULT_CHROME,
});
