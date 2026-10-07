import { insta, linkedin, xIcon, youtube } from "$lib/assets/icons";
import {
	ROUTE_BLOG,
	ROUTE_DATENSCHUTZHINWEISE,
	ROUTE_FUNKTIONEN,
	ROUTE_GERAETE,
	ROUTE_HOME,
	ROUTE_IMPRESSUM,
	ROUTE_UPGRADE_NOW,
} from "$lib/routes";
import type { FooterLinkGroupType } from "$lib/types";

export const gerateLinksGroup: FooterLinkGroupType = {
	title: "Geräte",
	mainUrl: ROUTE_GERAETE,
	groupLinks: [
		{
			url: ROUTE_GERAETE,
			text: "Kaltwasser",
			isNeu: false,
		},
		{
			url: ROUTE_GERAETE,
			text: "Warmwasser",
			isNeu: false,
		},
		{
			url: ROUTE_GERAETE,
			text: "Heizung",
			isNeu: false,
		},
		{
			url: ROUTE_GERAETE,
			text: "Rauchmelder",
			isNeu: false,
		},
		{
			url: ROUTE_GERAETE,
			text: "Gas",
			isNeu: false,
		},
	],
};

/** Landing footer only (the site footer keeps its own groups). */
export const produktLinksGroup: FooterLinkGroupType = {
	title: "Produkt",
	mainUrl: ROUTE_FUNKTIONEN,
	groupLinks: [
		{
			url: ROUTE_UPGRADE_NOW,
			text: "Jetzt noch umrüsten",
			isNeu: false,
		},
	],
};

export const DienstleistungenLinksGroup: FooterLinkGroupType = {
	title: "Dienstleistungenen",
	mainUrl: ROUTE_FUNKTIONEN,
	groupLinks: [
		{
			url: ROUTE_FUNKTIONEN,
			text: "Unterjährige Verbrauchserfassung",
			isNeu: false,
		},
		{
			url: ROUTE_FUNKTIONEN,
			text: "Heizkostenabrechnung",
			isNeu: false,
		},
		{
			url: ROUTE_FUNKTIONEN,
			text: "Verbrauchsinformation",
			isNeu: false,
		},
		{
			url: ROUTE_FUNKTIONEN,
			text: "Energieausweis",
			isNeu: false,
		},
		{
			url: ROUTE_FUNKTIONEN,
			text: "Großprojekte",
			isNeu: false,
		},
	],
};

export const standorteLinksGroup: FooterLinkGroupType = {
	title: "Standorte",
	mainUrl: ROUTE_FUNKTIONEN,
	groupLinks: [
		{
			url: ROUTE_FUNKTIONEN,
			text: "Berlin",
			isNeu: false,
		},
		{
			url: ROUTE_FUNKTIONEN,
			text: "Hamburg",
			isNeu: false,
		},
		{
			url: ROUTE_FUNKTIONEN,
			text: "München",
			isNeu: false,
		},
		{
			url: ROUTE_FUNKTIONEN,
			text: "Frankfurt",
			isNeu: false,
		},
		{
			url: ROUTE_FUNKTIONEN,
			text: "Leipzig",
			isNeu: true,
		},
		{
			url: ROUTE_FUNKTIONEN,
			text: "Stuttgart",
			isNeu: false,
		},
		{
			url: ROUTE_FUNKTIONEN,
			text: "Hannover",
			isNeu: false,
		},
		{
			url: ROUTE_FUNKTIONEN,
			text: "Bielefeld",
			isNeu: false,
		},
		{
			url: ROUTE_FUNKTIONEN,
			text: "Wolfsburg",
			isNeu: true,
		},
		{
			url: ROUTE_FUNKTIONEN,
			text: "Gera",
			isBeliebt: true,
		},
		{
			url: ROUTE_FUNKTIONEN,
			text: "Köln",
			isNeu: false,
		},
		{
			url: ROUTE_FUNKTIONEN,
			text: "Ihre Stadt",
			isNeu: false,
		},
	],
};

export const rechtlichesLinksGroup: FooterLinkGroupType = {
	title: "Rechtliches",
	mainUrl: ROUTE_BLOG,
	groupLinks: [
		{
			url: ROUTE_BLOG,
			text: "Die Neuerung",
			isNeu: true,
		},
		{
			url: ROUTE_BLOG,
			text: "Rohrwärme (VDI 2077)",
			isNeu: false,
		},
		{
			url: ROUTE_BLOG,
			text: "Rauchmelderpflicht",
			isNeu: false,
		},
		{
			url: ROUTE_BLOG,
			text: "Mess- und Eichverordnung",
			isNeu: false,
		},
		{
			url: ROUTE_BLOG,
			text: "Der CO2- Kostenrechner",
			isNeu: false,
		},
		{
			url: ROUTE_BLOG,
			text: "BAFA Förderantrag",
			isNeu: false,
		},
		{
			url: ROUTE_BLOG,
			text: "Kostenaufteilungsrechner",
			isNeu: false,
		},
		{
			url: ROUTE_BLOG,
			text: "Heizkostenverordnung",
			isNeu: false,
		},
		{
			url: ROUTE_BLOG,
			text: "Funkmesserpflicht",
			isNeu: false,
		},
		{
			url: ROUTE_BLOG,
			text: "Eichverordnung",
			isNeu: false,
		},
		{
			url: ROUTE_BLOG,
			text: "Energieausweis",
			isNeu: false,
		},
	],
};

export const kundenLinksGroup: FooterLinkGroupType = {
	title: "Kunden",
	mainUrl: ROUTE_HOME,
	groupLinks: [
		{
			url: ROUTE_HOME,
			text: "Hausverwaltungen",
			isNeu: false,
		},
		{
			url: ROUTE_HOME,
			text: "Private Equity",
			isNeu: false,
		},
		{
			url: ROUTE_HOME,
			text: "Wohnungsgesellschaften",
			isNeu: false,
		},
		{
			url: ROUTE_HOME,
			text: "Hauseigentümer",
			isNeu: false,
		},
	],
};

export const datenschutzLinksGroup: FooterLinkGroupType = {
	title: "Datenschutz",
	mainUrl: ROUTE_DATENSCHUTZHINWEISE,
	groupLinks: [
		{
			url: ROUTE_DATENSCHUTZHINWEISE,
			text: "AGB",
			isNeu: false,
		},
		{
			url: ROUTE_IMPRESSUM,
			text: "Impressum",
			isNeu: false,
		},
		{
			url: ROUTE_DATENSCHUTZHINWEISE,
			text: "Datenschutz",
			isNeu: false,
		},
	],
};

export const newsInfoLinksGroup: FooterLinkGroupType = {
	title: "News & Info",
	mainUrl: ROUTE_BLOG,
	groupLinks: [
		{
			url: ROUTE_BLOG,
			text: "Blog",
			isBeliebt: true,
		},
		{
			url: ROUTE_BLOG,
			text: "Newsletter",
			isNeu: false,
		},
		{
			url: ROUTE_BLOG,
			text: "Webinare",
			isNeu: false,
		},
		{
			url: ROUTE_BLOG,
			text: "Vororttermin",
			isNeu: true,
		},
		{
			url: ROUTE_BLOG,
			text: "Downloads",
			isNeu: false,
		},
		{
			url: ROUTE_BLOG,
			text: "FAQ",
			isNeu: false,
		},
	],
};

export const socials = [
	{
		href: "https://www.youtube.com/channel/UCv0HIBEJGgD_vNRIkNg6--Q",
		icon: youtube,
		alt: "youtube",
	},
	{ href: "https://x.com/Heidisystems", icon: xIcon, alt: "x" },
	{
		href: "https://www.linkedin.com/company/heidisystems/",
		icon: linkedin,
		alt: "linkedin",
	},
	{
		href: "https://www.instagram.com/heidisystems/",
		icon: insta,
		alt: "insta",
	},
];

export const VDIV_PARTNER_URL =
	"https://vdiv.de/partneruebersicht/heidi-systems";

export const ADDRESS = {
	company: "Heidi Systems GmbH",
	street: "Monbijoupl. 4",
	city: "10178 Berlin",
};
