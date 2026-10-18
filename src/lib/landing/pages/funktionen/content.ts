/**
 * Every text and the example data of /funktionen, word for word from the
 * design. Components hold markup and behaviour only.
 *
 * The legal statements, the company claims and the example data need
 * sign-off before the cutover (plan §4.4). The KPIs (92 %, 14 Tage, 1 bis 2
 * Stunden) were confirmed on 2026-10-12.
 */
import { DEMO_HREF } from "$lib/landing/cta";
import { isExpired } from "$lib/landing/deadline/deadline";
import type { Testimonial } from "$lib/landing/data/testimonials";
import type { FaqItem } from "$lib/landing/faqJsonLd";
import type { SplitHeading } from "$lib/landing/types";
import { ROUTE_SCHNITTSTELLEN, ROUTE_VORGEHEN } from "$lib/routes";
import type { IconName } from "./icons";

const NB = " ";

/** Confirmed KPIs, used in the steps and the FAQ. */
export const KPI = {
	firstVisit: `92${NB}%`,
	notice: `14${NB}Tage`,
	window: `1${NB}bis 2${NB}Stunden`,
};

export const hero = {
	eyebrow: "Funktionen",
	eyebrowIcon: "spark" as IconName,
	h1: { text: "Daten mit höchster ", accent: "Effizienz bearbeiten." },
	lead: "Umstellung auf gesetzlich vorgeschriebene, fernablesbare Zähler und digitale Ablesung aller Verbräuche. Von der Installation bis zur fertigen Abrechnung.",
	primary: { text: "Demo buchen", href: DEMO_HREF },
	secondary: { text: "So gehen wir vor", href: ROUTE_VORGEHEN },
};

export type SeriesKey = "hz" | "ww" | "kw";
export type Series = {
	key: SeriesKey;
	label: string;
	unit: string;
	delta: string;
	decimals: number;
	/** January to December; the months still to come are 0. */
	values: number[];
};

export const chart = {
	title: `Lindenallee 12 · Whg.${NB}7`,
	sub: "Verbrauch 2026",
	tag: "Beispieldaten",
	label: "Sparte",
	/** Under the bars, every second month. */
	axis: ["Jan", "Mär", "Mai", "Jul", "Sep", "Nov"],
	/** The highlighted month (October), whose value the number shows. */
	current: 9,
	/** For the screen-reader sentence ("Januar bis Oktober 2026"). */
	range: "Januar bis Oktober 2026",
	series: [
		{
			key: "hz",
			label: "Heizung",
			unit: "kWh",
			delta: `−8${NB}% zum Vorjahr`,
			decimals: 0,
			values: [171, 184, 162, 118, 61, 19, 12, 14, 74, 131, 0, 0],
		},
		{
			key: "ww",
			label: "Warmwasser",
			unit: "m³",
			delta: `−4${NB}% zum Vorjahr`,
			decimals: 1,
			values: [2.4, 2.2, 2.3, 2.1, 2.0, 1.8, 1.7, 1.7, 2.0, 2.1, 0, 0],
		},
		{
			key: "kw",
			label: "Kaltwasser",
			unit: "m³",
			delta: `−2${NB}% zum Vorjahr`,
			decimals: 1,
			values: [3.6, 3.3, 3.5, 3.4, 3.6, 3.9, 4.1, 4.0, 3.5, 3.4, 0, 0],
		},
	] satisfies Series[] as Series[],
};

export const badges = {
	label: "Sicherheit und Rechtskonformität",
	items: [
		{
			icon: "check",
			title: "Gesetzeskonform",
			sub: "Nach Heizkostenverordnung",
		},
		{ icon: "lock", title: "Datenschutzkonform", sub: "Nach DSGVO" },
		{
			icon: "key",
			title: "SSL-Verschlüsselung",
			sub: "Für alle Verbindungen",
		},
		{
			icon: "server",
			title: "Server in Deutschland",
			sub: "Alle Daten bleiben hier",
		},
	] satisfies { icon: IconName; title: string; sub: string }[],
};

export const services = {
	eyebrow: "Was Heidi übernimmt",
	eyebrowIcon: "sparkles" as IconName,
	h2: {
		text: "Vom Zähler bis zur Abrechnung. ",
		muted: "Alles aus einer Hand.",
	} satisfies SplitHeading,
	items: [
		{
			icon: "file",
			title: "Betriebskostenabrechnung",
			text: "Automatisierte, präzise Erfassung aller relevanten Verbrauchsdaten. Die Werte stehen direkt für die Abrechnung bereit.",
		},
		{
			icon: "tool",
			title: "Regelmäßige Wartung",
			text: "Heidi wartet die Funkzähler regelmäßig, damit die Datenerfassung zuverlässig läuft.",
		},
		{
			icon: "users",
			title: "Service aus einer Hand",
			text: "Von der Installation über die Wartung bis zur digitalen Verbrauchsanalyse. Mit einem persönlichen Ansprechpartner.",
		},
	] satisfies { icon: IconName; title: string; text: string }[],
};

export const dashboard = {
	eyebrow: "Dashboard",
	eyebrowIcon: "chart" as IconName,
	h2: {
		text: "Alle Verbräuche einer Wohnung ",
		muted: "als Übersicht.",
	} satisfies SplitHeading,
	label: "Funktionen im Dashboard",
	intervalMs: 6000,
	tag: "Beispieldaten",
	tabs: [
		{
			title: "Ihr Verbrauch auf einen Blick",
			text: "Heizung, Warm- und Kaltwasser übersichtlich je Wohnung und Liegenschaft.",
		},
		{
			title: "Datenbasierte Analyse",
			text: "Trends früh erkennen und auffällige Verbräuche sehen, bevor sie teuer werden.",
		},
		{
			title: "Effiziente Betriebskostenabrechnung",
			text: "Die Funkzähler liefern die Daten, die Abrechnung entsteht per Klick.",
		},
	],
	usage: {
		title: `Whg.${NB}7 · September`,
		rows: [
			{ label: "Heizung", share: 72, value: `131${NB}kWh` },
			{ label: "Warmwasser", share: 44, value: `2,1${NB}m³` },
			{ label: "Kaltwasser", share: 58, value: `3,4${NB}m³` },
		],
	},
	analysis: {
		title: "Liegenschaften · Heizung",
		rows: [
			{ name: "Lindenallee 12", delta: `−6${NB}%` },
			{ name: "Gartenweg 3", delta: `−3${NB}%` },
			{
				name: "Am Stadtpark 7",
				delta: `+18${NB}%`,
				up: true,
				note: "Auffällig: Strang prüfen",
			},
			{ name: "Hofstraße 21", delta: `−9${NB}%` },
		] as { name: string; delta: string; up?: boolean; note?: string }[],
	},
	billing: {
		title: "Heizkostenabrechnung 2026",
		steps: [
			"Verbräuche aller Einheiten geprüft",
			"Rechnungen per DocuScan übernommen",
			"Kosten nach HKVO verteilt",
			"An Ihre Software übergeben",
		],
		result: "Abrechnung erstellt",
	},
};

export const features = {
	eyebrow: "Alle Funktionen",
	eyebrowIcon: "list" as IconName,
	h2: {
		text: "Was die Plattform ",
		muted: "für Sie erledigt.",
	} satisfies SplitHeading,
	/** No `href` yet: the design's product pages don't exist (README, open question 1). */
	items: [
		{
			icon: "file",
			title: "Betriebskostenabrechnung",
			text: "Verbrauchsdaten automatisch für die Betriebskosten bereit.",
		},
		{
			icon: "flame",
			title: "Heizkostenabrechnung",
			text: "Auf Knopfdruck nach HKVO, statt Monate zu warten.",
		},
		{
			icon: "signal",
			title: "Laufende Verbrauchsdaten",
			text: "Per Funk erfasst, ohne Ablesetermin in der Wohnung.",
		},
		{
			icon: "chart",
			title: "Dashboard",
			text: "Alle Liegenschaften und Einheiten in einer Ansicht.",
		},
		{
			icon: "building",
			title: "Immobilienmanagement",
			text: "Anbindung an Ihr ERP- oder CRM-System, nur eine Plattform pflegen.",
			href: ROUTE_SCHNITTSTELLEN,
		},
		{
			icon: "bell",
			title: "Benachrichtigungen",
			text: "Monatliche Verbrauchsinfo an Mieter, Hinweise zu Fristen und Auffälligkeiten.",
		},
	] as { icon: IconName; title: string; text: string; href?: string }[],
};

export const steps = {
	eyebrow: "Installation der Funkgeräte",
	eyebrowIcon: "tool" as IconName,
	h2: {
		text: "Fünf Schritte. ",
		muted: "Ein Ansprechpartner.",
	} satisfies SplitHeading,
	items: [
		{
			title: "Bedarfsanalyse",
			text: "Bestand prüfen, Geräte passend planen",
		},
		{
			title: "Installation",
			text: `Mieter ${KPI.notice} vorher informiert`,
		},
		{ title: "Ablesen", text: "Per Funk, ohne Termin" },
		{ title: "Verbrauchsanalyse", text: "Im Dashboard je Einheit" },
		{ title: "Wartung", text: "Für zuverlässige Daten" },
	],
};

export const quote = {
	key: "vitolus" satisfies Testimonial["key"] as Testimonial["key"],
	label: "Kundenstimme",
};

type FaqEntry = FaqItem & {
	/** From the retrofit deadline on (README, open question 3). */
	answerExpired?: string;
};

export const faq = {
	title: "Häufige Fragen zu den Funktionen",
	items: [
		{
			question: "Bis wann müssen Zähler fernablesbar sein?",
			answer:
				"Nach der Heizkostenverordnung müssen Zähler und Heizkostenverteiler ab dem 1. Januar 2027 fernablesbar sein. Heidi rüstet Ihren Bestand rechtzeitig um.",
			// Placeholder until the content owner writes it (plan §4.4).
			answerExpired:
				"Nach der Heizkostenverordnung müssen Zähler und Heizkostenverteiler seit dem 1. Januar 2027 fernablesbar sein. Heidi rüstet Ihren Bestand um.",
		},
		{
			question: "Wie werden die Daten übertragen?",
			answer:
				"Die Funkzähler senden ihre Werte per Funk. Niemand muss für die Ablesung in die Wohnung.",
		},
		{
			question: "Kann ich meine Verbräuche laufend abrufen?",
			answer:
				"Ja. Im Dashboard sehen Sie die Verbräuche je Liegenschaft und Einheit, und Ihre Mieter erhalten jeden Monat ihre Verbrauchsinformation.",
		},
		{
			question: "Wie läuft die Installation ab?",
			answer: `Heidi plant die Montage und informiert Ihre Mieter ${KPI.notice} vorher. Am Montagetag gibt es ein Zeitfenster von ${KPI.window}, und ${KPI.firstVisit} der Installationen gelingen beim ersten Termin.`,
		},
		{
			question: "Wer kümmert sich um die Wartung?",
			answer:
				"Heidi. Die Funkzähler werden regelmäßig gewartet, damit die Datenerfassung zuverlässig läuft.",
		},
		{
			question: "Was kostet Heidi?",
			answer: `Abgerechnet wird pro tatsächlich installiertem Zähler plus eine Abrechnungspauschale. Ab 1.000${NB}Einheiten erhalten Sie ein individuelles Angebot.`,
		},
		{
			question: "Erstellt Heidi auch die Betriebskostenabrechnung?",
			answer:
				"Heidi liefert alle Verbrauchsdaten und erstellt die Heizkostenabrechnung nach HKVO auf Knopfdruck. Die Daten übergeben wir direkt an Ihr ERP- oder CRM-System.",
		},
		{
			question: "Welche Geräte bietet Heidi an?",
			answer:
				"Heizkostenverteiler, Wärmezähler sowie Warm- und Kaltwasserzähler mit Funk.",
		},
	] satisfies FaqEntry[] as FaqEntry[],
};

/** The FAQ with each question's current answer (the expired variant from the retrofit deadline on). */
export function faqItems(now: number): FaqItem[] {
	const expired = isExpired(now);
	return faq.items.map(({ answerExpired, ...item }) => ({
		...item,
		answer: expired && answerExpired ? answerExpired : item.answer,
	}));
}

export const closing = {
	h2: "Jetzt auf digitale Funkzähler umstellen.",
	text: "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.",
	submitLabel: "Demo buchen",
};
