/**
 * Customer quotes of the landing pages, word for word from the designs.
 * Used by the region pages' References and /upgrade-now's Testimonials.
 * Copy and roles need the content owner's sign-off (go-live gates).
 */
export type Testimonial = {
	key: "werne" | "vitolus" | "gerhard";
	badge: string;
	quote: string;
	name: string;
	role: string;
	initials: string;
};

export const testimonials: Testimonial[] = [
	{
		key: "werne",
		badge: "Verifizierter Heidi-Kunde",
		quote:
			"„Die Ablesungen und Verbrauchserfassungen laufen reibungslos und pünktlich ab – sowohl für uns als Hausverwaltung als auch für unsere Mieter.“",
		name: "Gotthard Werne",
		role: "Geschäftsführer, Werne Immobilien GmbH",
		initials: "GW",
	},
	{
		key: "vitolus",
		badge: "Verifizierter Heidi-Kunde",
		quote:
			"„Mit Heidi Systems erfassen wir den Verbrauch vollautomatisch – das spart Aufwand und schafft Transparenz für uns und unsere Bewohner.“",
		name: "Fabian Höhne",
		role: "Geschäftsführer & Gesellschafter, Vitolus GmbH",
		initials: "FH",
	},
	{
		key: "gerhard",
		badge: "Verifizierter Gewerbekunde",
		quote:
			"„Heidi hat uns bei der Sanierung einer Gewerbefläche durch die Installation einer zuverlässigen Verbrauchserfassung optimal unterstützt.“",
		name: "Klaus Gerhard",
		role: "Immobilienmanager, Gerhard Real Estate Management",
		initials: "KG",
	},
];

export const testimonial = (key: Testimonial["key"]) =>
	testimonials.find((t) => t.key === key)!;
