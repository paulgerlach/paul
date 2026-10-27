import {
	ROUTE_API_DOKUMENTATION,
	ROUTE_ASSET_MANAGER,
	ROUTE_AUSWERTUNG,
	ROUTE_BLOG,
	ROUTE_DASHBOARD,
	ROUTE_EINSPARRECHNER,
	ROUTE_ENERGIEAUSWEIS,
	ROUTE_FRISTENRECHNER,
	ROUTE_FUNKTIONEN,
	ROUTE_GERAETE,
	ROUTE_HAUSVERWALTUNG,
	ROUTE_HEIZKOSTENABRECHNUNG,
	ROUTE_HEIZKOSTENABRECHNUNG_PRUEFEN,
	ROUTE_HKVO_LEITFADEN,
	ROUTE_INTEROPERABILITAET,
	ROUTE_INSTALLATIONSPARTNER,
	ROUTE_INSTALLATIONSTOOL,
	ROUTE_KONTAKT,
	ROUTE_KUNDENREFERENZEN,
	ROUTE_MESSDIENSTANBIETER_VERGLEICH,
	ROUTE_MESSDIENSTWECHSEL,
	ROUTE_MIETERPORTAL,
	ROUTE_MIETVERWALTUNG,
	ROUTE_MUSTER_KUENDIGUNG,
	ROUTE_NACHFOLGE,
	ROUTE_NEUIGKEITEN,
	ROUTE_PARTNERSCHAFTEN,
	ROUTE_PORTFOLIO_CHECKER,
	ROUTE_PREISE,
	ROUTE_PRESSE,
	ROUTE_PRIVATE_VERMIETER,
	ROUTE_SCHNITTSTELLEN,
	ROUTE_SELBSTABRECHNUNG,
	ROUTE_SELF_SERVICE,
	ROUTE_SICHERHEIT,
	ROUTE_SOFTWAREPARTNER,
	ROUTE_UPGRADE_NOW,
	ROUTE_VERBAENDE,
	ROUTE_VERBRAUCHSINFORMATION,
	ROUTE_VORGEHEN,
	ROUTE_WEG_VERWALTUNG,
	ROUTE_WOHNUNGSUNTERNEHMEN,
} from "$lib/routes";

/**
 * Top nav of the landing pages, the designs' own (the same in every design).
 * It links only to landing pages, the blog and the questionnaire.
 *
 * An entry without `href` has no landing page yet and isn't shown; its
 * comment names the design id of its target, so building that page means
 * searching the repo for the id and adding the link. `soon` entries are the
 * design's greyed-out "bald" items.
 */
export type LandingNavItem = {
	title: string;
	text: string;
	href?: string;
	soon?: boolean;
};
export type LandingNavColumn = { title?: string; items: LandingNavItem[] };
export type LandingNavGroup = {
	title: string;
	/** `list`: one column (.nv-list); `mega`: three columns; `res`: two. */
	layout: "list" | "mega" | "res";
	columns: LandingNavColumn[];
};

export const landingNav: LandingNavGroup[] = [
	{
		title: "Produkt",
		layout: "list",
		columns: [
			{
				items: [
					{
						title: "Vorgehen",
						text: "In drei Schritten zum digitalen Messdienst",
						href: ROUTE_VORGEHEN,
					},
					{
						title: "Funktionen",
						text: "Funkablesung, Dashboard und Abrechnung im Überblick",
						href: ROUTE_FUNKTIONEN,
					},
					{
						title: "Funkzähler",
						text: "Heizkostenverteiler, Wasserzähler und Rauchwarnmelder mit Fernablesung",
						href: ROUTE_GERAETE,
					},
					{
						title: "Herstellerunabhängig",
						text: "Vorhandene Zähler jedes Herstellers auswerten und abrechnen",
						href: ROUTE_INTEROPERABILITAET,
					},
					{
						title: "Self-Service",
						text: "Zählerbedarf selbst erfassen, Kostenvoranschlag sofort",
						href: ROUTE_SELF_SERVICE,
					},
					{
						title: "Heizkostenabrechnung",
						text: "Auf Knopfdruck, Rechnungen per DocuScan",
						href: ROUTE_HEIZKOSTENABRECHNUNG,
					},
					{
						title: "Preise",
						text: "Nach installierten Zählern plus Abrechnungspauschale",
						href: ROUTE_PREISE,
					},
					{
						title: "Sicherheit & Datenschutz",
						text: "Alle Daten auf Servern in Deutschland",
						href: ROUTE_SICHERHEIT,
					},
				],
			},
		],
	},
	{
		title: "Lösungen",
		layout: "mega",
		columns: [
			{
				title: "Wechsel & Umstieg",
				items: [
					{
						title: "Messdienstleister wechseln",
						text: "Ohne Warten aufs Vertragsende",
						href: ROUTE_MESSDIENSTWECHSEL,
					},
					// PSGCmHdZHDQWjWNLsDCmVT
					{
						title: "Anbieterwechsel",
						text: "Schritt für Schritt mit Wechsel-Planer",
					},
					{
						title: "Jetzt noch umrüsten",
						text: "Fernablesbar bis 1.1.2027",
						href: ROUTE_UPGRADE_NOW,
					},
					{
						title: "Selbstabrechnung",
						text: "Abrechnung selbst erstellen, Heidi liefert die Daten",
						href: ROUTE_SELBSTABRECHNUNG,
					},
					{
						title: "Self-Service",
						text: "Zählerbedarf selbst erfassen und online bestellen",
						href: ROUTE_SELF_SERVICE,
					},
				],
			},
			{
				title: "Kostenlose Checks",
				items: [
					{
						title: "Portfolio-Checker",
						text: "Vertragsenden im ganzen Bestand prüfen",
						href: ROUTE_PORTFOLIO_CHECKER,
					},
					{
						title: "Heizkostenabrechnungs-Checker",
						text: "Heizkostenabrechnung kostenlos prüfen",
						href: ROUTE_HEIZKOSTENABRECHNUNG_PRUEFEN,
					},
					{
						title: "Messdienstanbieter-Vergleich",
						text: "Anbieter im Vergleich",
						href: ROUTE_MESSDIENSTANBIETER_VERGLEICH,
					},
				],
			},
			{
				title: "Plattform",
				items: [
					{
						title: "Dashboard",
						text: "Alle Liegenschaften im Überblick",
						href: ROUTE_DASHBOARD,
					},
					{
						title: "Auswertung",
						text: "Verbrauch, Kosten und Auffälligkeiten ausgewertet",
						href: ROUTE_AUSWERTUNG,
					},
					{
						title: "Schnittstellen",
						text: "ERP und CRM angebunden, nur eine Plattform pflegen",
						href: ROUTE_SCHNITTSTELLEN,
					},
					{
						title: "Verbrauchsinformation (uVI)",
						text: "Monatlich automatisch an Ihre Mieter",
						href: ROUTE_VERBRAUCHSINFORMATION,
					},
					{
						title: "Mieterportal",
						text: "Verbrauch und Termine für Ihre Mieter",
						href: ROUTE_MIETERPORTAL,
					},
					{
						title: "Installationstool",
						text: "Ein Termin, alles digital dokumentiert",
						href: ROUTE_INSTALLATIONSTOOL,
					},
					{
						title: "Demo-Sandbox",
						text: "Heidi selbst ausprobieren",
						soon: true,
					},
				],
			},
		],
	},
	{
		title: "Kunden",
		layout: "list",
		columns: [
			{
				items: [
					{
						title: "Hausverwaltung",
						text: "Verwaltung von Beständen jeder Größe",
						href: ROUTE_HAUSVERWALTUNG,
					},
					{
						title: "Mietverwaltung",
						text: "Mietshäuser und Sondereigentum für Eigentümer",
						href: ROUTE_MIETVERWALTUNG,
					},
					{
						title: "WEG-Verwaltung",
						text: "Heizkostenabrechnung für Eigentümergemeinschaften",
						href: ROUTE_WEG_VERWALTUNG,
					},
					{
						title: "Wohnungsunternehmen",
						text: "Große Portfolios, Rollout im Cluster",
						href: ROUTE_WOHNUNGSUNTERNEHMEN,
					},
					{
						title: "Private Vermieter",
						text: "Schon ab 2 Wohneinheiten",
						href: ROUTE_PRIVATE_VERMIETER,
					},
					{
						title: "Asset Manager & Fonds",
						text: "Transparenz über Verbräuche im ganzen Portfolio",
						href: ROUTE_ASSET_MANAGER,
					},
				],
			},
		],
	},
	{
		title: "Ressourcen",
		layout: "res",
		columns: [
			{
				title: "Wissen & Werkzeuge",
				items: [
					{
						title: "Blog",
						text: "Wissen rund um Messdienst, Heizkosten und HKVO",
						href: ROUTE_BLOG,
					},
					{
						title: "Neuigkeiten",
						text: "Produkt-Updates, Werkzeuge und Fristen",
						href: ROUTE_NEUIGKEITEN,
					},
					// 5ubDwM7Gi1CZFkyZuSfHvd
					{
						title: "Live-Webinar",
						text: "Fernablesung bis 2027: live am 5. November",
					},
					{
						title: "HKVO-Leitfaden",
						text: "Pflichten nach Heizkostenverordnung erklärt",
						href: ROUTE_HKVO_LEITFADEN,
					},
					{
						title: "Fristenrechner",
						text: "Kündigungs- und Eichfristen berechnen",
						href: ROUTE_FRISTENRECHNER,
					},
					{
						title: "Portfolio-Checker",
						text: "Bestand automatisch auf Vertragsenden prüfen",
						href: ROUTE_PORTFOLIO_CHECKER,
					},
					{
						title: "Einsparrechner",
						text: "Was der Wechsel Ihrem Bestand spart",
						href: ROUTE_EINSPARRECHNER,
					},
					{
						title: "Muster-Kündigung",
						text: "Vorlage für den bisherigen Messdienst",
						href: ROUTE_MUSTER_KUENDIGUNG,
					},
					{
						title: "Energieausweis",
						text: "Verbrauchs- oder Bedarfsausweis, rechtsgültig nach GEG",
						href: ROUTE_ENERGIEAUSWEIS,
					},
				],
			},
			{
				title: "Unternehmen & Partner",
				items: [
					{
						title: "Kundenreferenzen",
						text: "Was Verwaltungen über Heidi sagen",
						href: ROUTE_KUNDENREFERENZEN,
					},
					{
						title: "Presse",
						text: "Media Kit, Fakten und Pressekontakt",
						href: ROUTE_PRESSE,
					},
					{
						title: "Installationspartner",
						text: "Für Installationsbetriebe: Partner werden",
						href: ROUTE_INSTALLATIONSPARTNER,
					},
					{
						title: "Softwarepartner",
						text: "Für Softwareanbieter: Daten direkt anbinden",
						href: ROUTE_SOFTWAREPARTNER,
					},
					{
						title: "Kontakt",
						text: "Persönlich, per Telefon oder E-Mail",
						href: ROUTE_KONTAKT,
					},
					{
						title: "API-Dokumentation",
						text: "Heidi API und BVED-Standard",
						href: ROUTE_API_DOKUMENTATION,
					},
					{
						title: "Verbände",
						text: "VDIV, DEUMESS und bved",
						href: ROUTE_VERBAENDE,
					},
					{
						title: "Partnerschaften",
						text: "Mit Heidi zusammenarbeiten",
						href: ROUTE_PARTNERSCHAFTEN,
					},
					{
						title: "Nachfolge",
						text: "Für Messdienste: eine seriöse Nachfolge",
						href: ROUTE_NACHFOLGE,
					},
				],
			},
		],
	},
];

/** The entries shown: those with a page and the "bald" ones. */
export const shownItems = (column: LandingNavColumn) =>
	column.items.filter((item) => item.href || item.soon);
