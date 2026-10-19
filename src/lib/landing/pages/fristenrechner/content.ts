/**
 * Texts of /fristenrechner, word for word from the design
 * (https://claude.ai/artifact/LWEbZPCoSDLT1D59BaULyE). Legal statements,
 * product claims and the example data await sign-off (plan §4.4).
 */
import type { FaqItem } from "$lib/landing/faqJsonLd";
import type { SplitHeading } from "$lib/landing/types";
import { ROUTE_MESSDIENSTWECHSEL, ROUTE_MUSTER_KUENDIGUNG } from "$lib/routes";

const NB = "\u00a0";

export const RECHNER_ID = "rechner";
export const STICHTAGE_ID = "stichtage";

export const hero = {
	pill: "Fristenrechner",
	h1: "Jede Frist im Messdienst.",
	h1Accent: "Auf den Tag genau.",
	lead: "Wann können Sie Ihren Messdienstvertrag kündigen? Wann läuft die Eichfrist Ihrer Zähler ab? Bis wann muss die Abrechnung beim Mieter sein? Ein paar Angaben genügen.",
	calc: { text: "Frist berechnen", href: `#${RECHNER_ID}` },
	dates: { text: "Wichtige Stichtage", href: `#${STICHTAGE_ID}` },
	ticks: ["Kostenlos", "Ohne Anmeldung", "Mit Rechtsgrundlage"],
};

export type Tab = "vertrag" | "eich" | "abr";

type Option = { value: number; label: string };

export const calculator = {
	label: "Fristenrechner",
	tabs: [
		{ value: "vertrag", label: "Vertrag" },
		{ value: "eich", label: "Eichfrist" },
		{ value: "abr", label: "Abrechnung" },
	] satisfies { value: Tab; label: string }[] as {
		value: Tab;
		label: string;
	}[],
	note: "Maßgeblich sind Ihr Vertrag und die jeweilige Rechtslage. Keine Rechtsberatung.",
	contract: {
		start: "Vertragsbeginn",
		term: {
			label: "Erstlaufzeit",
			options: [
				{ value: 1, label: "1 Jahr" },
				{ value: 2, label: "2 Jahre" },
				{ value: 3, label: "3 Jahre" },
				{ value: 5, label: "5 Jahre" },
				{ value: 8, label: "8 Jahre" },
				{ value: 10, label: "10 Jahre" },
			] satisfies Option[] as Option[],
			default: 10,
		},
		renewal: {
			label: "Verlängerung danach",
			options: [
				{ value: 1, label: "um 1 Jahr" },
				{ value: 2, label: "um 2 Jahre" },
				{ value: 3, label: "um 3 Jahre" },
				{ value: 5, label: "um 5 Jahre" },
			] satisfies Option[] as Option[],
			default: 1,
		},
		notice: {
			label: "Kündigungsfrist",
			options: [
				{ value: 1, label: "1 Monat" },
				{ value: 3, label: "3 Monate" },
				{ value: 6, label: "6 Monate" },
				{ value: 12, label: "12 Monate" },
			] satisfies Option[] as Option[],
			default: 3,
		},
		result: "Spätestens kündigen bis",
		end: "Nächstmögliches Vertragsende",
		timeline: { today: "Heute", cancel: "Kündigung", end: "Vertragsende" },
		hint: "Zu knapp? Mit Heidi müssen Sie nicht aufs Vertragsende warten. Heidi übernimmt Ihre bestehenden Zähler sofort und wertet sie aus.",
		// JMrh8PhRG78mcMBK2LDkbS ("Heidi Anbieterwechsel")
		hintLink: {
			text: "So funktioniert der Wechsel",
			href: ROUTE_MESSDIENSTWECHSEL,
		},
	},
	calibration: {
		type: {
			label: "Zählerart",
			// Years of the calibration period; the design's "5w" (Wärmezähler) is 5 too.
			options: [
				{ key: "kalt", years: 6, label: "Kaltwasserzähler (6 Jahre)" },
				{ key: "warm", years: 5, label: "Warmwasserzähler (5 Jahre)" },
				{ key: "waerme", years: 5, label: "Wärmezähler (5 Jahre)" },
			],
		},
		year: "Jahr der Eichung",
		result: "Eichfrist läuft ab am",
		plan: "Austausch einplanen bis",
		hint: "Die Eichfrist endet mit Ablauf des Kalenderjahres. Heizkostenverteiler sind nicht eichpflichtig.",
	},
	billing: {
		periodEnd: "Ende des Abrechnungszeitraums",
		received: "Abrechnung beim Mieter am",
		optional: "optional",
		result: "Abrechnung muss beim Mieter sein bis",
		objections: "Einwendungen des Mieters möglich bis",
		objectionsUnknown: "12 Monate nach Erhalt",
		hint: `Nach Ablauf der Frist kann keine Nachzahlung mehr verlangt werden, außer der Vermieter hat die Verspätung nicht zu vertreten (§${NB}556 Abs.${NB}3 BGB).`,
	},
};

export type Milestone = {
	/** ISO date, for the badge. */
	date: string;
	dateText: string;
	title: string;
	text: string;
	law: string;
	/** The highlighted (dark) card. */
	hot?: boolean;
};

export const milestones: {
	pill: string;
	h2: SplitHeading;
	items: Milestone[];
} = {
	pill: "Stichtage",
	h2: {
		text: "Die wichtigsten Termine ",
		muted: "der Heizkostenverordnung.",
	},
	items: [
		{
			date: "2021-12-01",
			dateText: "1. Dezember 2021",
			title: "Neue Geräte fernablesbar",
			text: "Neu eingebaute Zähler und Heizkostenverteiler müssen fernablesbar sein.",
			law: `§${NB}5 HeizkostenV`,
		},
		{
			date: "2022-01-01",
			dateText: "1. Januar 2022",
			title: "Monatliche Verbrauchsinformation",
			text: "Bei fernablesbaren Geräten erhalten Mieter jeden Monat ihre Verbrauchsinformation.",
			law: `§${NB}6a HeizkostenV`,
		},
		{
			date: "2023-01-01",
			dateText: "1. Januar 2023",
			title: "CO₂-Kostenaufteilung",
			text: "CO₂-Kosten werden zwischen Vermieter und Mieter nach einem Stufenmodell aufgeteilt.",
			law: "CO2KostAufG",
		},
		{
			date: "2026-12-31",
			dateText: "31. Dezember 2026",
			title: "Bestand fernablesbar",
			text: `Auch bestehende Geräte müssen bis dahin fernablesbar sein, sonst droht ein Kürzungsrecht von 3${NB}%.`,
			law: `§${NB}5, §${NB}12 HeizkostenV`,
			hot: true,
		},
	],
};

export type ListTone = "t" | "k" | "a";

export const portfolio: {
	pill: string;
	h2: SplitHeading;
	text: string;
	ctas: { text: string; href?: string }[];
	rows: { name: string; text: string; action: string; tone: ListTone }[];
	demo: string;
} = {
	pill: "Für den ganzen Bestand",
	h2: {
		text: "Viele Verträge? ",
		muted: "Der Portfolio-Checker rechnet für alle.",
	},
	text: "Statt jede Liegenschaft einzeln: Der kostenlose Portfolio-Checker prüft die Vertragsenden in Ihrem ganzen Bestand und zeigt, wo Sie kündigen, übernehmen oder abrechnen sollten.",
	ctas: [
		// UFviBtC2mkneFNeWnfHAWp: no page yet (plan README, open question 1).
		{ text: "Zum Portfolio-Checker" },
		// 4WYU5hjVsWSLrxuo7wsdm6
		{ text: "Muster-Kündigung", href: ROUTE_MUSTER_KUENDIGUNG },
	],
	rows: [
		{
			name: "Lindenallee 12",
			text: "Vertrag läuft bis 03/2029",
			action: "Übernehmen",
			tone: "t",
		},
		{
			name: "Gartenweg 3",
			text: "Kündigen bis 30.09.2026",
			action: "Kündigen",
			tone: "k",
		},
		{
			name: "Am Stadtpark 7",
			text: "Kündigen bis 31.05.2027",
			action: "Kündigen",
			tone: "k",
		},
		{
			name: "Bergmannstraße 4",
			text: "Heidi-Funkzähler aktiv",
			action: "Abrechnen",
			tone: "a",
		},
	],
	demo: "Beispieldaten",
};

export const faq: { title: string; items: FaqItem[] } = {
	title: "Häufige Fragen",
	items: [
		{
			question:
				"Wie berechnet sich die Kündigungsfrist meines Messdienstvertrags?",
			answer:
				"Entscheidend sind Erstlaufzeit, automatische Verlängerung und Kündigungsfrist aus Ihrem Vertrag. Der Rechner ermittelt daraus das nächstmögliche Vertragsende und den letzten Tag, an dem die Kündigung beim Messdienst eingehen muss.",
		},
		{
			question:
				"Muss ich auf das Vertragsende warten, um zu Heidi zu wechseln?",
			answer:
				"Nein. Heidi übernimmt Ihre bestehenden Zähler sofort, wertet sie aus und rechnet ab, auch wenn der bisherige Vertrag noch läuft. Neue Funkzähler kommen, wenn der alte Vertrag endet.",
		},
		{
			question: "Wie lange sind Wasser- und Wärmezähler geeicht?",
			answer:
				"Kaltwasserzähler 6 Jahre, Warmwasserzähler und Wärmezähler 5 Jahre. Die Eichfrist endet jeweils mit Ablauf des Kalenderjahres. Heizkostenverteiler sind nicht eichpflichtig.",
		},
		{
			question: "Bis wann muss die Heizkostenabrechnung beim Mieter sein?",
			answer: `Spätestens zwölf Monate nach Ende des Abrechnungszeitraums (§${NB}556 Abs.${NB}3 BGB). Danach kann der Vermieter in der Regel keine Nachzahlung mehr verlangen.`,
		},
		{
			question: "Bis wann müssen bestehende Zähler fernablesbar sein?",
			answer: `Bis zum 31. Dezember 2026 (§${NB}5 HeizkostenV). Danach dürfen Mieter ihren Anteil um 3${NB}% kürzen, solange die Geräte nicht fernablesbar sind (§${NB}12 HeizkostenV).`,
		},
	],
};

export const closing = {
	h2: "Fristen im Blick. Den Rest erledigt Heidi.",
	text: "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.",
	submitLabel: "Demo buchen",
};
