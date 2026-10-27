import {
	ROUTE_API_DOKUMENTATION,
	ROUTE_ASSET_MANAGER,
	ROUTE_BLOG,
	ROUTE_AUSWERTUNG,
	ROUTE_DASHBOARD,
	ROUTE_EINSPARRECHNER,
	ROUTE_ENERGIEAUSWEIS,
	ROUTE_FRISTENRECHNER,
	ROUTE_FUNKTIONEN,
	ROUTE_GERAETE,
	ROUTE_HAUSVERWALTUNG,
	ROUTE_HEIZKOSTENABRECHNUNG_PRUEFEN,
	ROUTE_MESSDIENSTANBIETER_VERGLEICH,
	ROUTE_HILFE,
	ROUTE_HKVO_LEITFADEN,
	ROUTE_INSTALLATIONSPARTNER,
	ROUTE_INTEROPERABILITAET,
	ROUTE_INSTALLATIONSTOOL,
	ROUTE_KONTAKT,
	ROUTE_KUNDENREFERENZEN,
	ROUTE_KARRIERE,
	ROUTE_MESSDIENSTWECHSEL,
	ROUTE_MIETERPORTAL,
	ROUTE_MIETVERWALTUNG,
	ROUTE_NEUIGKEITEN,
	ROUTE_MUSTER_KUENDIGUNG,
	ROUTE_PRESSE,
	ROUTE_PRIVATE_VERMIETER,
	ROUTE_SCHNITTSTELLEN,
	ROUTE_SELBSTABRECHNUNG,
	ROUTE_SELF_SERVICE,
	ROUTE_SICHERHEIT,
	ROUTE_SOFTWAREPARTNER,
	ROUTE_UEBER_UNS,
	ROUTE_UPGRADE_NOW,
	ROUTE_VERBAENDE,
	ROUTE_NACHFOLGE,
	ROUTE_PARTNERSCHAFTEN,
	ROUTE_VERBRAUCHSINFORMATION,
	ROUTE_VORGEHEN,
	ROUTE_WEG_VERWALTUNG,
	ROUTE_WOHNUNGSUNTERNEHMEN,
	ROUTE_PORTFOLIO_CHECKER,
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
	{ text: "Kunden", href: ROUTE_KUNDENREFERENZEN },
	{ text: "Hilfe-Center", href: ROUTE_HILFE },
	{ text: "Sicherheit", href: ROUTE_SICHERHEIT },
	{ text: "Kontakt", href: ROUTE_KONTAKT },
	{ text: "API-Dokumentation", href: ROUTE_API_DOKUMENTATION },
];

export const footerGroups: LandingFooterGroup[] = [
	{
		title: "Produkt",
		links: [
			{ text: "Vorgehen", href: ROUTE_VORGEHEN },
			{ text: "Funktionen", href: ROUTE_FUNKTIONEN },
			{ text: "Funkzähler", href: ROUTE_GERAETE },
			{ text: "Zähler-Interoperabilität", href: ROUTE_INTEROPERABILITAET },
			{ text: "Heizkostenabrechnung", href: ROUTE_FUNKTIONEN },
			{ text: "Anbieterwechsel", href: ROUTE_MESSDIENSTWECHSEL },
			{ text: "Jetzt noch umrüsten", href: ROUTE_UPGRADE_NOW },
			{ text: "Selbstabrechnung", href: ROUTE_SELBSTABRECHNUNG },
			{ text: "Self-Service", href: ROUTE_SELF_SERVICE },
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
			{ text: "Auswertung", href: ROUTE_AUSWERTUNG },
			{ text: "Schnittstellen", href: ROUTE_SCHNITTSTELLEN },
			{ text: "Installationstool", href: ROUTE_INSTALLATIONSTOOL },
		],
	},
	{
		title: "Partner",
		links: [
			{ text: "Installationspartner", href: ROUTE_INSTALLATIONSPARTNER },
			{ text: "Softwarepartner", href: ROUTE_SOFTWAREPARTNER },
			{ text: "Verbände", href: ROUTE_VERBAENDE },
			{ text: "Nachfolge", href: ROUTE_NACHFOLGE },
			{ text: "Partnerschaften", href: ROUTE_PARTNERSCHAFTEN },
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
			{ text: "Einsparrechner", href: ROUTE_EINSPARRECHNER },
			{ text: "Presse", href: ROUTE_PRESSE },
			{ text: "Muster-Kündigung", href: ROUTE_MUSTER_KUENDIGUNG },
			{ text: "Energieausweis", href: ROUTE_ENERGIEAUSWEIS },
			{ text: "Portfolio-Checker", href: ROUTE_PORTFOLIO_CHECKER },
			{
				text: "Heizkostenabrechnungs-Checker",
				href: ROUTE_HEIZKOSTENABRECHNUNG_PRUEFEN,
			},
			{
				text: "Messdienstanbieter-Vergleich",
				href: ROUTE_MESSDIENSTANBIETER_VERGLEICH,
			},
		],
	},
];
