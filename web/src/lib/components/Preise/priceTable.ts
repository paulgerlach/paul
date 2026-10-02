export type PlanKey = "heidi" | "plus" | "grosskunde";

export type Feature = { label: string } & Record<PlanKey, boolean>;

export type Section = {
	title: string;
	features: Feature[];
};

// prettier-ignore
export const sections: Section[] = [
	{
		title: "Technologie & Digitalisierung",
		features: [
			{ label: "Automatisierte digitale Fernauslesung", heidi: true, plus: true, grosskunde: true },
			{ label: "Online-Plattform für alle Messdaten", heidi: true, plus: true, grosskunde: true },
			{ label: "Interoperable OMS-Standards", heidi: true, plus: true, grosskunde: true },
			{ label: "Monatliche Verbrauchsinformationen", heidi: true, plus: true, grosskunde: true },
			{ label: "Nutzerfreundliches Dashboard", heidi: true, plus: true, grosskunde: true },
			{ label: "Systemwechsel durch offener Standards", heidi: true, plus: true, grosskunde: true },
			{ label: "Visualisierung von Verbrauchstrends", heidi: false, plus: true, grosskunde: true },
			{ label: "Echtzeit-Datenverfügbarkeit im Dashboard", heidi: false, plus: false, grosskunde: true },
			{ label: "API-Integrationen", heidi: false, plus: false, grosskunde: true },
		],
	},
	{
		title: "Wirtschaftlichkeit & Effizienz",
		features: [
			{ label: "Kostenfreie Installation der Funkzähler", heidi: true, plus: true, grosskunde: true },
			{ label: "Weniger Fehlerquellen", heidi: true, plus: true, grosskunde: true },
			{ label: "Zeitersparnis durch Automatisierung", heidi: true, plus: true, grosskunde: true },
			{ label: "Planbare Festkosten ohne versteckte Gebühren", heidi: true, plus: true, grosskunde: true },
			{ label: "Kein Vor-Ort-Termin für Ableser notwendig", heidi: true, plus: true, grosskunde: true },
			{ label: "Weniger Verwaltungsaufwand in der Abrechnung", heidi: false, plus: true, grosskunde: true },
			{ label: "Reduktion von Rückfragen durch klare Daten", heidi: false, plus: true, grosskunde: true },
			{ label: "Frühzeitige Erkennung ineffizienter Verbräuche", heidi: false, plus: false, grosskunde: true },
		],
	},
	{
		title: "Recht, Sicherheit & Service",
		features: [
			{ label: "Volle Transparenz für Verwalter", heidi: true, plus: true, grosskunde: true },
			{ label: "DSGVO-konforme Datenverarbeitung", heidi: true, plus: true, grosskunde: true },
			{ label: "Revisionssichere Datenhaltung", heidi: true, plus: true, grosskunde: true },
			{ label: "Erfüllung aller gesetzlichen Vorgaben", heidi: true, plus: true, grosskunde: true },
			{ label: "Rechtssichere Abrechnung", heidi: true, plus: true, grosskunde: true },
			{ label: "Rund-um-Service", heidi: false, plus: true, grosskunde: true },
			{ label: "Wartung & Fristenmanagement", heidi: false, plus: true, grosskunde: true },
			{ label: "Regionale Umsetzung", heidi: false, plus: false, grosskunde: true },
			{ label: "Installation durch Meisterbetrieb", heidi: false, plus: false, grosskunde: true },
		],
	},
	{
		title: "Kommunikation",
		features: [
			{ label: "Unterjährige Verbrauchsanalyse", heidi: true, plus: true, grosskunde: true },
			{ label: "Mieterinformation", heidi: false, plus: true, grosskunde: true },
			{ label: "Persönlicher Ansprechpartner", heidi: false, plus: false, grosskunde: true },
		],
	},
];

// prettier-ignore
export const plans: {
	key: PlanKey;
	name: string;
	tab: string;
	subtitle: string;
	buttonBg: string;
}[] = [
	{ key: "heidi", name: "Heidi", tab: "Heidi", subtitle: "2-50 Wohneinheiten", buttonBg: "bg-dark_green" },
	{ key: "plus", name: "Heidi Plus", tab: "Plus", subtitle: "50-200 Wohneinheiten", buttonBg: "bg-green" },
	{ key: "grosskunde", name: "Großkunde", tab: "Großkunde", subtitle: "+201 Wohneinheiten", buttonBg: "bg-green" },
];
