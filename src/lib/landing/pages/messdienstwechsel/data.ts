/**
 * Content of the /messdienstwechsel landing page, ported from the design
 * artifact. It's kept as typed constants (not Prismic), so the section
 * components stay small and the copy can move to a CMS later.
 */
import type { FaqItem } from "$lib/landing/sections/Faq.svelte";

/* Steps (Portfolio-Checker) */

export type Step = { title: string; text: string };

export const steps: Step[] = [
	{
		title: "Portfolio analysieren",
		text: "Der Portfolio-Checker erfasst alle Liegenschaften, Zähler und Messdienstverträge.",
	},
	{
		title: "Vertragsenden verstehen",
		text: "Wir sehen, wann welcher Vertrag endet oder ob wir vorerst nur die Abrechnung übernehmen.",
	},
	{
		title: "Kündigen oder übernehmen",
		text: "Wir kündigen mit Ihrer Vollmacht oder übernehmen bestehende Verträge.",
	},
	{
		title: "Abrechnung auf Knopfdruck",
		text: "Die Heizkostenabrechnung erstellt Heidi auf Knopfdruck, rechtssicher und pünktlich.",
	},
	{
		title: "Nahtlos integriert",
		text: "Heidi ist nahtlos in Ihre bestehenden ERP- und CRM-Systeme integriert.",
	},
];

/* Old way: issues and bad reviews that pop up one by one */

export type OldWayTile = {
	/** Position inside the box, in % of its width and height. */
	left: number;
	top: number;
} & (
	| {
			kind: "issue";
			property: string;
			source: string;
			text: string;
			color: string;
	  }
	| { kind: "review"; author: string; text: string; stars: number }
);

export const oldWayTiles: OldWayTile[] = [
	{
		kind: "issue",
		property: "Hofstraße 21",
		source: "Mieteranfrage",
		text: "Wann wird endlich abgelesen?",
		color: "#7A8FA6",
		left: -4,
		top: 4,
	},
	{
		kind: "review",
		author: "M. Krüger",
		text: "Heizkostenabrechnung kam 8 Monate zu spät.",
		stars: 2,
		left: 40,
		top: 0,
	},
	{
		kind: "issue",
		property: "Gartenweg 3",
		source: "Frist",
		text: "Kündigungsfrist verpasst",
		color: "#8E9B7A",
		left: 66,
		top: 12,
	},
	{
		kind: "issue",
		property: "Am Markt 4",
		source: "Mieteranfrage",
		text: "Ablesetermin schon wieder verschoben?",
		color: "#A6847A",
		left: -8,
		top: 28,
	},
	{
		kind: "review",
		author: "S. Yilmaz",
		text: "Niemand erreichbar, drei Mal umsonst zu Hause geblieben.",
		stars: 1,
		left: 30,
		top: 30,
	},
	{
		kind: "issue",
		property: "Lindenallee 8",
		source: "Anbieter",
		text: "Rückruf seit 3 Wochen offen",
		color: "#6E8C84",
		left: 70,
		top: 44,
	},
	{
		kind: "issue",
		property: "Uferweg 12",
		source: "Mieteranfrage",
		text: "Warum ist meine Nachzahlung so hoch?",
		color: "#9A8AA6",
		left: -6,
		top: 52,
	},
	{
		kind: "review",
		author: "Familie Hoffmann",
		text: "Verbrauchswerte falsch, Abrechnung nicht nachvollziehbar.",
		stars: 1,
		left: 34,
		top: 60,
	},
	{
		kind: "issue",
		property: "Schillerstr. 7",
		source: "Frist",
		text: "Eichfrist Wasserzähler abgelaufen",
		color: "#A69A6E",
		left: 64,
		top: 70,
	},
	{
		kind: "issue",
		property: "Parkring 2",
		source: "Mieteranfrage",
		text: "Bekomme keine monatliche Verbrauchsinfo",
		color: "#7A9AA6",
		left: -4,
		top: 78,
	},
	{
		kind: "review",
		author: "J. Becker",
		text: "Hausverwaltung schiebt alles auf den Messdienst.",
		stars: 2,
		left: 36,
		top: 86,
	},
	{
		kind: "issue",
		property: "Kastanienweg 9",
		source: "Anbieter",
		text: "Zähler nicht fernablesbar",
		color: "#6E7E9A",
		left: 66,
		top: 92,
	},
];

/** Up to two capitals of a name, for the avatar ("Hofstraße 21" → "H", "M. Krüger" → "MK"). */
export const initials = (name: string) =>
	name.replace(/[^A-ZÄÖÜ]/g, "").slice(0, 2);

/* Rollout Gantt */

export type GanttKind = "op" | "co" | "uvi";

export const ganttKindLabels: Record<GanttKind, string> = {
	op: "Heidi übernimmt",
	co: "Gemeinsam mit der Verwaltung",
	uvi: "Automatisch durch Heidi",
};

/** Columns of the timeline: W1–W8, then "laufend" (index 8). */
export const ganttColumns = [
	"W1",
	"W2",
	"W3",
	"W4",
	"W5",
	"W6",
	"W7",
	"W8",
	"laufend",
];

/** Phase band of each timeline column, for the column shading. */
export const ganttColumnPhase = [0, 1, 1, 2, 2, 2, 2, 2, 3];

export type GanttRow = {
	label: string;
	kind: GanttKind;
	bar: string;
	/** First and last timeline column of the bar, 1-based and inclusive. */
	from: number;
	to: number;
	/** Bar runs on past its end (open-ended arrow shape). */
	arrow?: boolean;
	/** Small dots on the bar for recurring events. */
	ticks?: number;
	/** Milestone label at the end of the bar. */
	milestone?: string;
	/** Tooltip */
	title: string;
	weeks: string;
	points: string[];
};

export const ganttRows: GanttRow[] = [
	{
		label: "Portfolio-Check",
		kind: "op",
		bar: "Analyse",
		from: 1,
		to: 1,
		milestone: "Portfolio bewertet",
		title: "Portfolio-Check",
		weeks: "Woche 1",
		points: [
			"Der Portfolio-Checker liest Liegenschaften, Zähler und Messdienstverträge ein",
			"Vertragsenden und Eichfristen je Objekt werden sichtbar",
			"Gemeinsame Auswahl des Pilotobjekts",
		],
	},
	{
		label: "Pilotobjekt",
		kind: "op",
		bar: "Montage & Test",
		from: 2,
		to: 3,
		milestone: "Pilot freigegeben",
		title: "Pilotobjekt",
		weeks: "Woche 2–3",
		points: [
			"Montage oder Übernahme der Zähler in einem Objekt",
			"Erste Fernablesung und Datenprüfung",
			"Sie sehen den kompletten Ablauf, bevor der Bestand folgt",
		],
	},
	{
		label: "Rollout-Planung",
		kind: "co",
		bar: "Planung",
		from: 4,
		to: 4,
		title: "Rollout-Planung",
		weeks: "Woche 4",
		points: [
			"Reihenfolge der Objekte und Wechseltermine festlegen",
			"Vollmacht für Kündigungen abstimmen",
			"Mieterinformation und Montagefenster planen",
		],
	},
	{
		label: "Installation",
		kind: "op",
		bar: "Montage im Bestand",
		from: 5,
		to: 7,
		milestone: "Hardware installiert",
		title: "Installation",
		weeks: "Woche 5–7",
		points: [
			"Kündigung per Vollmacht oder Übernahme bestehender Verträge",
			"Montage durch zertifizierte Heidi-Monteure",
			"Heidi koordiniert Termine mit Mietern und Hausmeistern",
		],
	},
	{
		label: "Inbetriebnahme",
		kind: "co",
		bar: "Daten & Go-live",
		from: 7,
		to: 8,
		milestone: "Dashboard aktiv",
		title: "Inbetriebnahme",
		weeks: "Woche 7–8",
		points: [
			"Stichtagswerte vom Altanbieter übernehmen",
			"Zähler im Dashboard prüfen und freigeben",
			"Anbindung an Ihr ERP- und CRM-System",
		],
	},
	{
		label: "uVI an Mieter",
		kind: "uvi",
		bar: "Monatlich, automatisch",
		from: 8,
		to: 9,
		arrow: true,
		ticks: 5,
		title: "Unterjährige Verbrauchsinformation (uVI)",
		weeks: "ab Woche 8, monatlich",
		points: [
			"Pflicht nach Heizkostenverordnung für fernablesbare Zähler",
			"Heidi versendet die uVI jeden Monat automatisch an alle Mieter",
			"Fehlende Kontaktdaten fordert Heidi selbst an",
		],
	},
	{
		label: "Abrechnung & Service",
		kind: "op",
		bar: "Laufend",
		from: 9,
		to: 9,
		arrow: true,
		title: "Abrechnung & Service",
		weeks: "laufend",
		points: [
			"Heizkostenabrechnung auf Knopfdruck",
			"Laufendes Monitoring aller Funkzähler",
			"Ihr fester Ansprechpartner bleibt derselbe",
		],
	},
];

/* Budget chart */

export const MONTHS = [
	"Januar",
	"Februar",
	"März",
	"April",
	"Mai",
	"Juni",
	"Juli",
	"August",
	"September",
	"Oktober",
	"November",
	"Dezember",
];

/** Months with actual readings; later months are a forecast. */
export const BUDGET_NOW = 9;

export type BudgetKey = "hz" | "ww" | "kw";

export const budgetSeries: Record<
	BudgetKey,
	{ label: string; color: string; values: number[] }
> = {
	hz: {
		label: "Heizung",
		color: "#5E7D72",
		values: [
			7200, 6400, 5100, 3200, 1500, 600, 400, 450, 1400, 3300, 5600, 6900,
		],
	},
	ww: {
		label: "Warmwasser",
		color: "#D9622B",
		values: [
			1180, 1120, 1110, 1060, 1020, 960, 900, 930, 1010, 1070, 1120, 1190,
		],
	},
	kw: {
		label: "Kaltwasser",
		color: "#6282D0",
		values: [690, 650, 700, 710, 760, 820, 860, 850, 760, 720, 690, 700],
	},
};

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

/** Sum of the actual (non-forecast) months. */
export const budgetSoFar = (values: number[]) =>
	sum(values.slice(0, BUDGET_NOW));

/** Share of the year's total already used, in whole percent. */
export const budgetShare = (values: number[]) =>
	Math.round((budgetSoFar(values) / sum(values)) * 100);

const eurFormat = new Intl.NumberFormat("de-DE");
export const eur = (n: number) => `${eurFormat.format(n)} €`;

/* Risk chart */

export type RiskProperty = {
	name: string;
	/** Heating energy in kWh/m² per year */
	value: number;
	unitsAbove: string;
	tag: string;
	action: string;
};

export const RISK_MAX = 190;

export const riskProperties: RiskProperty[] = [
	{
		name: "Gartenweg 3",
		value: 168,
		unitsAbove: "7 von 25",
		tag: "28 % der Einheiten in Gartenweg 3 liegen über dem Schnitt",
		action: "Heizungsanlage prüfen lassen",
	},
	{
		name: "Lindenallee 8",
		value: 121,
		unitsAbove: "4 von 36",
		tag: "Lindenallee 8 liegt im Schnitt des Portfolios",
		action: "Kein Handlungsbedarf",
	},
	{
		name: "Hofstraße 21",
		value: 104,
		unitsAbove: "2 von 18",
		tag: "Hofstraße 21 liegt 13 % unter dem Schnitt",
		action: "Kein Handlungsbedarf",
	},
	{
		name: "Am Markt 4",
		value: 84,
		unitsAbove: "0 von 12",
		tag: "Am Markt 4 ist das effizienteste Objekt",
		action: "Als Referenzobjekt nutzen",
	},
];

/** Short labels under the bars. */
export const riskLabels = [
	"Gartenweg 3",
	"Lindenallee 8",
	"Hofstr. 21",
	"Am Markt 4",
];

export const riskAverage = Math.round(
	sum(riskProperties.map((p) => p.value)) / riskProperties.length,
);

/** More than 15 % above the average is highlighted. */
export const isRiskHigh = (value: number) => value > riskAverage * 1.15;

export const askSuggestions = [
	"Wie hoch sind die Heizkosten bisher?",
	"Welche Zähler senden nicht?",
	"Mein Portfolio",
	"Wann laufen Eichfristen ab?",
	"Welche Einheiten liegen über Vorjahr?",
];

/* FAQ */

/** Answers may contain <b>; they're static strings from this file. */
export const faqItems: FaqItem[] = [
	{
		question: "Muss ich warten, bis mein Vertrag mit dem Altanbieter endet?",
		answer:
			"Nein. Heidi kann auf Ihre bestehenden Zähler zurückgreifen und sie auswerten, egal wie lange der Vertrag noch läuft. Sie wechseln also sofort zu Heidi. Der Tausch auf Heidi-Funkzähler erfolgt später, wenn der Altvertrag ausläuft.",
	},
	{
		question: "Wie läuft der Wechsel zu Heidi ab?",
		answer:
			"Der Heidi Portfolio-Checker analysiert Ihr Portfolio und zeigt, wann Ihre Messdienstverträge enden. Danach kündigen wir mit Ihrer Vollmacht oder übernehmen bestehende Verträge. Bis zum Vertragsende werten wir Ihre vorhandenen Zähler aus, die Heizkostenabrechnung erstellen wir auf Knopfdruck.",
	},
	{
		question: "Was kostet der Wechsel?",
		answer:
			"Die Installation der Funkzähler ist in allen Tarifen kostenlos. Der Tarif richtet sich nach der Zahl Ihrer Wohneinheiten: <b>Heidi</b> für 2 bis 50 Wohneinheiten ab 200 € pro Jahr, <b>HeidiPlus</b> für 50 bis 200 Wohneinheiten ab 150 € pro Jahr inklusive kostenloser Wartung sowie Verbrauchs- und Mieterinformation, <b>HeidiGroßkunde</b> ab 201 Wohneinheiten mit individuellem Angebot.",
	},
	{
		question: "Habe ich einen festen Ansprechpartner?",
		answer:
			"Ja. Ihre Verwaltung bekommt eine feste Ansprechperson bei Heidi, die Ihr Portfolio kennt und von der Analyse bis zur laufenden Abrechnung zuständig bleibt.",
	},
	{
		question: "Was passiert, wenn beim Montagetermin niemand öffnet?",
		answer:
			"Wir kündigen Termine frühzeitig an und stimmen den Zugang vorab mit Ihnen oder dem Hausmeister ab. Klappt ein Termin trotzdem nicht, organisieren wir den Ersatztermin direkt mit dem Mieter, ohne dass Sie sich darum kümmern müssen.",
	},
	{
		question: "Sind die Heidi-Zähler fernablesbar nach Heizkostenverordnung?",
		answer:
			"Ja. Alle Heidi-Geräte werden per Funk abgelesen. Damit sind die Anforderungen an fernablesbare Ausstattung und die monatliche Verbrauchsinformation für Mieter abgedeckt.",
	},
	{
		question: "Wer erstellt die Heizkostenabrechnung im Wechseljahr?",
		answer:
			"Wir stimmen den Stichtag so ab, dass jeder Abrechnungszeitraum eindeutig einem Anbieter zugeordnet ist. Die Stichtagswerte fordert Heidi beim Altanbieter an und übernimmt sie in die eigene Abrechnung.",
	},
	{
		question: "Muss ich meine Verwaltungssoftware wechseln?",
		answer:
			"Nein. Heidi ist nahtlos in bestehende ERP- und CRM-Systeme integriert. Verbrauchsdaten und fertige Abrechnungen landen direkt in Ihrer Software.",
	},
];
