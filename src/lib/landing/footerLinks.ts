import { socials as siteSocials } from "$lib/components/Footer/footerLinks";
import {
	ROUTE_ASSET_MANAGER,
	ROUTE_BLOG,
	ROUTE_DASHBOARD,
	ROUTE_FRISTENRECHNER,
	ROUTE_FUNKTIONEN,
	ROUTE_GERAETE,
	ROUTE_HAUSVERWALTUNG,
	ROUTE_HILFE,
	ROUTE_HKVO_LEITFADEN,
	ROUTE_KARRIERE,
	ROUTE_MESSDIENSTWECHSEL,
	ROUTE_MIETERPORTAL,
	ROUTE_MIETVERWALTUNG,
	ROUTE_NEUIGKEITEN,
	ROUTE_PRIVATE_VERMIETER,
	ROUTE_SCHNITTSTELLEN,
	ROUTE_SELBSTABRECHNUNG,
	ROUTE_SICHERHEIT,
	ROUTE_UEBER_UNS,
	ROUTE_UPGRADE_NOW,
	ROUTE_VERBRAUCHSINFORMATION,
	ROUTE_VORGEHEN,
	ROUTE_WEG_VERWALTUNG,
	ROUTE_WOHNUNGSUNTERNEHMEN,
} from "$lib/routes";
import { DEMO_HREF } from "./cta";

/**
 * Link groups of the landing footer (the landing design's footer, which
 * differs from the site footer). An entry without `href` has no page yet and
 * renders as plain text, as in the design.
 */
export type LandingFooterLink = { text: string; href?: string };
export type LandingFooterGroup = { title: string; links: LandingFooterLink[] };

/** Under the logo, in the first column. */
export const companyLinks: LandingFooterLink[] = [
	{ text: "Über uns", href: ROUTE_UEBER_UNS },
	{ text: "Karriere", href: ROUTE_KARRIERE },
	{ text: "Kunden", href: "/#kunden" },
	{ text: "Hilfe-Center", href: ROUTE_HILFE },
	{ text: "Sicherheit", href: ROUTE_SICHERHEIT },
	{ text: "API-Dokumentation" },
];

export const footerGroups: LandingFooterGroup[] = [
	{
		title: "Produkt",
		links: [
			{ text: "Vorgehen", href: ROUTE_VORGEHEN },
			{ text: "Funktionen", href: ROUTE_FUNKTIONEN },
			{ text: "Funkzähler", href: ROUTE_GERAETE },
			{ text: "Heizkostenabrechnung", href: ROUTE_FUNKTIONEN },
			{ text: "Anbieterwechsel", href: ROUTE_MESSDIENSTWECHSEL },
			{ text: "Jetzt noch umrüsten", href: ROUTE_UPGRADE_NOW },
			{ text: "Selbstabrechnung", href: ROUTE_SELBSTABRECHNUNG },
			{
				text: "Verbrauchsinformation (uVI)",
				href: ROUTE_VERBRAUCHSINFORMATION,
			},
			{ text: "Mieterportal", href: ROUTE_MIETERPORTAL },
		],
	},
	{
		title: "Plattform",
		links: [
			{ text: "Dashboard", href: ROUTE_DASHBOARD },
			{ text: "Demo buchen", href: DEMO_HREF },
			{ text: "Auswertung" },
			{ text: "Schnittstellen", href: ROUTE_SCHNITTSTELLEN },
			{ text: "Installationstool" },
		],
	},
	{
		title: "Partner",
		links: [
			{ text: "Installationspartner" },
			{ text: "Softwarepartner" },
			{ text: "Verbände" },
			{ text: "Nachfolge" },
			{ text: "Partnerschaften" },
		],
	},
	{
		title: "Kunden",
		links: [
			{ text: "Hausverwaltung", href: ROUTE_HAUSVERWALTUNG },
			{ text: "Mietverwaltung", href: ROUTE_MIETVERWALTUNG },
			{ text: "WEG-Verwaltung", href: ROUTE_WEG_VERWALTUNG },
			{ text: "Wohnungsunternehmen", href: ROUTE_WOHNUNGSUNTERNEHMEN },
			{ text: "Private Vermieter", href: ROUTE_PRIVATE_VERMIETER },
			{ text: "Asset Manager & Fonds", href: ROUTE_ASSET_MANAGER },
		],
	},
	{
		title: "Ressourcen",
		links: [
			{ text: "Blog", href: ROUTE_BLOG },
			{ text: "Neuigkeiten", href: ROUTE_NEUIGKEITEN },
			{ text: "Fristenrechner", href: ROUTE_FRISTENRECHNER },
			{ text: "HKVO-Leitfaden", href: ROUTE_HKVO_LEITFADEN },
			{ text: "Einsparrechner" },
			{ text: "Presse" },
			{ text: "Muster-Kündigung" },
			{ text: "Energieausweis" },
			{ text: "Portfolio-Checker" },
			{ text: "Heizkostenabrechnungs-Checker" },
			{ text: "Messdienstanbieter-Vergleich" },
		],
	},
];

const socialHref = (alt: string) =>
	siteSocials.find((social) => social.alt === alt)?.href ?? "";

/** The site's social profiles, drawn with the design's line icons. */
export const footerSocials = [
	{ label: "YouTube", href: socialHref("youtube") },
	{ label: "X", href: socialHref("x") },
	{ label: "LinkedIn", href: socialHref("linkedin") },
	{ label: "Instagram", href: socialHref("insta") },
] as const;
