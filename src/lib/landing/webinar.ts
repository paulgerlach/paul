/**
 * The webinar banner above every page (`WebinarBanner`, in the `(base)`
 * layout). It shows until the webinar ends; closing it hides it until the
 * next full page load.
 */
export const WEBINAR = {
	/** The webinar's end; from then on the layout's `load` drops the banner. */
	endsAt: Date.parse("2026-11-24T15:00:00+01:00"),
	label: "Live Webinar",
	when: "24. November | 14:00 – 15:00 Uhr",
	title: "Messdienstleister richtig wählen:",
	highlight: "Worauf Hausverwaltungen jetzt achten sollten",
	speaker: "Martin Kaßler",
	speakerRole: "Geschäftsführer VDIV",
	cta: "Jetzt anmelden",
	href: "https://luma.com/f7g25xu1?tk=GbFhFL",
} as const;

export const isWebinarOpen = (now: number) => now < WEBINAR.endsAt;
