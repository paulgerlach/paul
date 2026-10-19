/**
 * Texts of /hkvo-leitfaden, word for word from the design
 * (https://claude.ai/artifact/SJbSeTYRqntQxpZQ8RVNf7). The legal statements
 * and the product claims await sign-off (plan §4.4).
 */
import { DEMO_HREF } from "$lib/landing/cta";
import type { FaqItem } from "$lib/landing/faqJsonLd";
import type { SplitHeading } from "$lib/landing/types";
import {
	ROUTE_HEIZKOSTENABRECHNUNG_PRUEFEN,
	ROUTE_MIETERPORTAL,
	ROUTE_UPGRADE_NOW,
} from "$lib/routes";

export const GUIDE_ID = "leitfaden";
export const PENALTIES_ID = "kuerzung";

export const hero = {
	pill: "HKVO-Leitfaden",
	// The design's soft hyphen in "Heizkosten­verordnung".
	h1: "Die Heizkosten­verordnung.",
	h1Accent: "Einfach erklärt.",
	lead: "Welche Pflichten haben Eigentümer und Verwaltungen? Was gilt für Fernablesung, Verbrauchsinformation und Kostenverteilung? Und wann dürfen Mieter kürzen? Der Überblick mit Paragrafen, ohne Juristendeutsch.",
	read: { text: "Leitfaden lesen", href: `#${GUIDE_ID}` },
	penalties: { text: "Kürzungsrechte", href: `#${PENALTIES_ID}` },
	ticks: ["9 Themen", "Mit Paragrafen", "Schnell-Check"],
};

export type QuestionKey = "erf" | "fern" | "uvi" | "vert" | "frist";

export type Question = {
	key: QuestionKey;
	question: string;
	/** The paragraph under the question, also shown with its risk. */
	law: string;
	/** What a "Nein" risks. */
	risk: string;
};

export const check = {
	label: "Schnell-Check Heizkostenverordnung",
	title: "Schnell-Check",
	sub: "Wie gut ist Ihr Bestand aufgestellt?",
	yes: "Ja",
	no: "Nein",
	questions: [
		{
			key: "erf",
			question: "Wird der Verbrauch jeder Wohnung erfasst?",
			law: "§ 4",
			risk: "Kürzungsrecht bis 15 %",
		},
		{
			key: "fern",
			question: "Sind alle Geräte fernablesbar?",
			law: "§ 5",
			risk: "Ab 2027: Kürzungsrecht 3 %",
		},
		{
			key: "uvi",
			question: "Erhalten Mieter jeden Monat ihre Verbrauchsinfo?",
			law: "§ 6a",
			risk: "Kürzungsrecht 3 %",
		},
		{
			key: "vert",
			question: "Werden 50 bis 70 % nach Verbrauch verteilt?",
			law: "§ 7",
			risk: "Abrechnung angreifbar",
		},
		{
			key: "frist",
			question: "Ist die Abrechnung nach spätestens 12 Monaten beim Mieter?",
			law: "§ 556 BGB",
			risk: "Nachzahlung entfällt",
		},
	] satisfies Question[] as Question[],
	hint: "Beantworten Sie die Fragen mit Ja oder Nein.",
	ok: "Alles erfüllt. Ihr Bestand ist HKVO-konform aufgestellt.",
	risks: "Mögliche Risiken",
	// 44SBXKXJaSp6bvGMnbpZj6 (the design's demo booking): the closing form.
	link: { text: "Mit Heidi alle Punkte erfüllen", href: DEMO_HREF },
};

/** A block of an article: a paragraph (may hold <a>), a list or a note. */
export type Block = { p: string } | { list: string[] } | { note: string };

export type Article = {
	id: string;
	num: string;
	/** The paragraph chip. */
	law: string;
	/** The H2, also the table of contents' text. */
	title: string;
	body: Block[];
};

export const guide = {
	label: "Leitfaden",
	toc: "Inhalt",
	articles: [
		{
			id: "s-geltung",
			num: "01",
			law: "§§ 1, 2, 11",
			title: "Für wen gilt die Heizkostenverordnung?",
			body: [
				{
					p: "Die Heizkostenverordnung gilt für Gebäude, in denen eine zentrale Heizungs- oder Warmwasseranlage mehrere Nutzer versorgt. Das gilt auch, wenn Wärme oder Warmwasser von außen geliefert wird, etwa als Fernwärme.",
				},
				{
					p: "Sie geht vertraglichen Vereinbarungen vor. Ausgenommen sind Gebäude mit nicht mehr als zwei Wohnungen, von denen der Vermieter eine selbst bewohnt.",
				},
				{
					note: "Für einige Fälle sieht § 11 Ausnahmen vor, zum Beispiel wenn die Ausstattung zur Verbrauchserfassung nur mit unverhältnismäßig hohen Kosten möglich wäre.",
				},
			],
		},
		{
			id: "s-erfassung",
			num: "02",
			law: "§§ 4, 5",
			title: "Pflicht zur Verbrauchserfassung",
			body: [
				{
					p: "Der Gebäudeeigentümer muss den anteiligen Verbrauch der Nutzer an Wärme und Warmwasser erfassen. Dafür werden Heizkostenverteiler, Wärmezähler und Warmwasserzähler eingesetzt.",
				},
				{
					p: "Die Kosten für die Anmietung der Geräte können umgelegt werden, wenn die Anmietung vorher angekündigt wurde und die Mehrheit der Nutzer nicht innerhalb eines Monats widerspricht.",
				},
			],
		},
		{
			id: "s-fern",
			num: "03",
			law: "§ 5",
			title: "Fernablesbare Geräte",
			body: [
				{
					p: "Seit dem 1. Dezember 2021 müssen neu eingebaute Zähler und Heizkostenverteiler fernablesbar sein. Bestehende Geräte müssen bis zum 31. Dezember 2026 nachgerüstet oder ersetzt werden.",
				},
				{
					p: "Neue fernablesbare Geräte müssen zudem mit Geräten anderer Hersteller zusammenarbeiten können und sicher an ein Smart-Meter-Gateway anbindbar sein.",
				},
				{
					note: "Heidi baut ausschließlich fernablesbare Funkzähler ein. Bestehende Zähler übernimmt Heidi bis zum Austausch.",
				},
			],
		},
		{
			id: "s-verteilung",
			num: "04",
			law: "§§ 7, 8",
			title: "Wie die Kosten verteilt werden",
			body: [
				{
					p: "Mindestens 50 % und höchstens 70 % der Heizkosten werden nach dem erfassten Verbrauch verteilt. Der Rest wird nach Wohn- oder Nutzfläche beziehungsweise umbautem Raum verteilt. Für Warmwasser gilt dieselbe Spanne.",
				},
				{
					p: "70 % nach Verbrauch sind Pflicht, wenn das Gebäude nicht die Anforderungen der Wärmeschutzverordnung von 1994 erfüllt, mit Öl oder Gas beheizt wird und die frei liegenden Leitungen überwiegend gedämmt sind.",
				},
			],
		},
		{
			id: "s-kosten",
			num: "05",
			law: "§ 7 Abs. 2",
			title: "Welche Kosten umlagefähig sind",
			body: [
				{
					list: [
						"Brennstoff und seine Lieferung",
						"Betriebsstrom der Anlage",
						"Bedienung, Überwachung und Pflege der Anlage",
						"Regelmäßige Prüfung und Einstellung durch eine Fachkraft",
						"Reinigung der Anlage und des Betriebsraums",
						"Messungen nach dem Bundes-Immissionsschutzgesetz",
						"Anmietung oder andere Arten der Gebrauchsüberlassung der Erfassungsgeräte",
						"Verwendung der Geräte einschließlich Eichung sowie Berechnung und Aufteilung",
					],
				},
			],
		},
		{
			id: "s-uvi",
			num: "06",
			law: "§ 6a",
			title: "Monatliche Verbrauchsinformation",
			body: [
				{
					p: "Sind fernablesbare Geräte eingebaut, müssen Nutzer seit dem 1. Januar 2022 jeden Monat über ihren Verbrauch informiert werden. Die Information enthält den Verbrauch des letzten Monats in Kilowattstunden, einen Vergleich mit dem Vormonat und dem Vorjahresmonat sowie mit einem Durchschnittsnutzer derselben Kategorie.",
				},
				{
					note: "Heidi stellt die Verbrauchsinformation jeden Monat automatisch bereit.",
				},
			],
		},
		{
			id: "s-abrechnung",
			num: "07",
			law: "§ 6a Abs. 3",
			title: "Pflichtangaben in der Abrechnung",
			body: [
				{
					p: "Die Abrechnung muss zusätzliche Informationen enthalten, unter anderem den Energieträgermix, erhobene Steuern und Abgaben, einen Vergleich mit dem Vorjahr und Kontaktinformationen zu Verbraucherorganisationen.",
				},
				{
					p: "Die Abrechnung muss dem Mieter spätestens zwölf Monate nach Ende des Abrechnungszeitraums vorliegen (§ 556 Abs. 3 BGB).",
				},
			],
		},
		{
			id: "s-co2",
			num: "08",
			law: "CO2KostAufG",
			title: "CO₂-Kosten aufteilen",
			body: [
				{
					p: "Seit 2023 werden die CO₂-Kosten für Wohngebäude nach dem Kohlendioxidkostenaufteilungsgesetz zwischen Vermieter und Mieter aufgeteilt. Wer welchen Anteil trägt, hängt vom CO₂-Ausstoß des Gebäudes pro Quadratmeter ab: Je schlechter die Energiebilanz, desto höher der Anteil des Vermieters.",
				},
				{
					note: "Das CO2KostAufG ist ein eigenes Gesetz, wird aber zusammen mit der Heizkostenabrechnung umgesetzt.",
				},
			],
		},
		{
			id: "s-kuerzung-kurz",
			num: "09",
			law: "§ 12",
			title: "Was bei Verstößen droht",
			body: [
				{
					p: "Mieter dürfen ihren Kostenanteil kürzen, wenn Pflichten aus der Verordnung nicht erfüllt sind: um 15 % bei nicht verbrauchsabhängiger Abrechnung, um jeweils 3 % bei fehlender Fernablesbarkeit oder fehlenden Verbrauchsinformationen.",
				},
				{
					p: `<a href="#${PENALTIES_ID}">Zur Übersicht der Kürzungsrechte ↓</a>`,
				},
			],
		},
	] satisfies Article[] as Article[],
};

export const penalties = {
	pill: "§ 12 HeizkostenV",
	h2: { text: "Wann Mieter kürzen dürfen." } satisfies SplitHeading,
	cards: [
		{
			value: "15 %",
			title: "Nicht verbrauchsabhängig abgerechnet",
			text: "Werden die Kosten entgegen der Verordnung nicht nach Verbrauch verteilt, dürfen Mieter ihren Anteil um 15 % kürzen.",
		},
		{
			value: "3 %",
			title: "Geräte nicht fernablesbar",
			text: "Sind die Geräte nach Ablauf der Frist nicht fernablesbar, besteht ein Kürzungsrecht von 3 %.",
		},
		{
			value: "3 %",
			title: "Verbrauchsinformation fehlt",
			text: "Fehlen die monatliche Verbrauchsinformation oder die Pflichtangaben in der Abrechnung, sind ebenfalls 3 % möglich.",
		},
	],
	// FQ6egKN8KrFwGUMZDUaavJ: the Heizkostenabrechnungs-Checker.
	cta: {
		text: "Prüfen Sie, ob Ihre Mieter kürzen könnten:",
		link: {
			text: "Heizkostenabrechnung prüfen",
			href: ROUTE_HEIZKOSTENABRECHNUNG_PRUEFEN as string | undefined,
		},
	},
};

export const faq: { title: string; items: FaqItem[] } = {
	title: "Häufige Fragen",
	items: [
		{
			question:
				"Gilt die Heizkostenverordnung auch für Eigentümergemeinschaften?",
			answer:
				"Ja. Sie gilt für alle Gebäude mit zentraler Heizungs- oder Warmwasserversorgung und mehreren Nutzern, auch für Wohnungseigentum. Ausgenommen sind Gebäude mit höchstens zwei Wohnungen, von denen der Vermieter eine selbst bewohnt.",
		},
		{
			question:
				"Was passiert, wenn meine Zähler Ende 2026 nicht fernablesbar sind?",
			answer:
				"Mieter dürfen ihren Anteil an den Heiz- und Warmwasserkosten dann um 3 % kürzen, solange die Geräte nicht fernablesbar sind (§ 12 HeizkostenV). Heidi rüstet Bestände mit fernablesbaren Funkzählern aus.",
			// Jp8tqY82m7FZqMnWU4z9x9 ("Jetzt noch umrüsten")
			more: { text: "Jetzt noch umrüsten →", href: ROUTE_UPGRADE_NOW },
		},
		{
			question: "Muss die Verbrauchsinformation per Post kommen?",
			// 5HTo3o7mYMjqUxPXcEyuEy ("Mieterportal")
			answer: `Nein. Sie kann auch elektronisch bereitgestellt werden, zum Beispiel über ein Mieterportal wie das <a href="${ROUTE_MIETERPORTAL}">Heidi Mieterportal</a> oder per E-Mail.`,
		},
		{
			question: "Darf ich 100 % nach Verbrauch abrechnen?",
			answer:
				"Nein. Die Verordnung schreibt eine Spanne von 50 bis 70 % nach Verbrauch vor. Der Rest wird nach Fläche oder umbautem Raum verteilt.",
		},
		{
			question: "Ersetzt der Leitfaden eine Rechtsberatung?",
			answer:
				"Nein. Der Leitfaden gibt einen Überblick über die wichtigsten Regeln. Für Ihren konkreten Fall wenden Sie sich an eine Rechtsberatung oder Ihren Verband.",
		},
	],
};

export const closing = {
	h2: "HKVO-konform. Ohne Mehraufwand.",
	text: "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.",
	submitLabel: "Demo buchen",
};
