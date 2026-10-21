import { ROUTE_DATENSCHUTZHINWEISE, ROUTE_IMPRESSUM } from "$lib/routes";

/** Heidi Systems' address, phone, profiles and legal links, used site-wide. */
export const ADDRESS = {
	company: "Heidi Systems GmbH",
	street: "Monbijoupl. 4",
	city: "10178 Berlin",
};

export const PHONE = "+49 30 52001352";
export const PHONE_HREF = "tel:+493052001352";

/** The platform's sign-in ("Anmelden" in the nav). */
export const LOGIN_URL = "https://platform.heidisystems.com/";

/** The social profiles, in the landing footer's order. */
export const SOCIALS = [
	{
		label: "YouTube",
		href: "https://www.youtube.com/channel/UCv0HIBEJGgD_vNRIkNg6--Q",
	},
	{ label: "X", href: "https://x.com/Heidisystems" },
	{ label: "LinkedIn", href: "https://www.linkedin.com/company/heidisystems/" },
	{ label: "Instagram", href: "https://www.instagram.com/heidisystems/" },
] as const;

/** The footer's legal line, in the design's order. AGB has no page of its own. */
export const LEGAL_LINKS = [
	{ text: "Impressum", href: ROUTE_IMPRESSUM },
	{ text: "Datenschutz", href: ROUTE_DATENSCHUTZHINWEISE },
	{ text: "AGB", href: ROUTE_DATENSCHUTZHINWEISE },
];
