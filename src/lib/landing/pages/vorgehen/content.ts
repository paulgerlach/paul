/**
 * Every text of /vorgehen, word for word from the design. Components hold
 * markup, photos and behaviour only.
 *
 * The legal statements, the company claims and the example data need
 * sign-off before go-live (plan §4.4). The KPIs (92 %, 14 Tage, 1 bis 2
 * Stunden) were confirmed on 2026-10-12.
 */
import { DEMO_HREF, START_HREF } from "$lib/landing/cta";
import type { Testimonial } from "$lib/landing/data/testimonials";
import type { FaqItem } from "$lib/landing/faqJsonLd";
import {
	ROUTE_FUNKTIONEN,
	ROUTE_HKVO_LEITFADEN,
	ROUTE_INSTALLATIONSTOOL,
	ROUTE_MIETERPORTAL,
	ROUTE_SICHERHEIT,
} from "$lib/routes";
import type { IconName } from "./icons";

const NB = " ";

/** Confirmed KPIs, used in the stats, the steps and the FAQ. */
export const KPI = {
	firstVisit: `92${NB}%`,
	notice: `14${NB}Tage`,
	window: `1${NB}bis 2${NB}Stunden`,
};

export const hero = {
	eyebrow: "Vorgehen",
	h1: "So geht Heidi vor. In drei Schritten digital.",
	lead: "Heidi erfasst alle Verbrauchsdaten digital, bündelt die Energiedaten Ihres Portfolios und vereinfacht Ihre Betriebs- und Heizkostenabrechnung. Alles aus einer Hand.",
	/** Dark, then light (README, open question 2). */
	ctas: [
		{ text: "Angebot einholen", href: START_HREF, dark: true },
		{ text: "Demo buchen", href: DEMO_HREF, dark: false },
	],
};

export const wide = {
	caption: "Lindenallee 12 · Umrüstung abgeschlossen · Beispiel",
	objectPosition: "50% 60%",
};

export const stats = [
	{
		figure: KPI.firstVisit,
		text: "der Installationen gelingen beim ersten Termin",
	},
	{
		figure: KPI.notice,
		text: "vorher informiert Heidi Ihre Mieter über die Montage",
	},
	{
		figure: "3-in-1",
		text: "Installation, Ablesung und Abrechnung aus einer Hand",
	},
];

/**
 * Target of "Zum HKVO-Leitfaden →" (the design's SJbSeTYRqntQxpZQ8RVNf7):
 * /hkvo-leitfaden. Without a target the link isn't rendered.
 */
export const HKVO_GUIDE_HREF: string | undefined = ROUTE_HKVO_LEITFADEN;

export const remoteDuty = {
	eyebrow: "Fernablesepflicht",
	h2: "Bis 2027 muss jeder Zähler fernablesbar sein.",
	law: "Die EU-Energieeffizienzrichtlinie und die Heizkostenverordnung verlangen, dass Zähler und Heizkostenverteiler ab dem 1. Januar 2027 aus der Ferne ablesbar sind.",
	text: "Heidi rüstet Ihren Bestand rechtzeitig um: effizient, transparent und zukunftssicher.",
	countLabel: "Tage bis zum 1. Januar 2027",
	link: { text: "Zum HKVO-Leitfaden", href: HKVO_GUIDE_HREF },
	// Placeholders until the content owner writes them (plan §4.4).
	h2Expired: "Seit 2027 muss jeder Zähler fernablesbar sein.",
	textExpired:
		"Heidi rüstet Ihren Bestand um: effizient, transparent und zukunftssicher.",
};

export const steps = {
	eyebrow: "So funktioniert der Umstieg",
	h2: "Drei Schritte. Heidi übernimmt den Rest.",
	/** Auto-advance interval of the tabs. */
	intervalMs: 6000,
	items: [
		{
			title: "Bedarfsanalyse",
			text: "Sie nennen uns Ihre Liegenschaften und welche Zähler benötigt werden. Heidi prüft Bestand und Verträge, plant die passenden Geräte je Liegenschaft und stimmt die Umsetzung mit Ihnen ab. Sie haben dabei einen festen Ansprechpartner.",
			chip: {
				title: "Lindenallee 12",
				sub: "36 Einheiten · Planung fertig · Beispiel",
			},
		},
		{
			title: "Installation der Funktechnik",
			text: `Unsere Monteure rüsten Heizung, Warm- und Kaltwasser mit Funktechnik aus. Ihre Mieter werden ${KPI.notice} vorher informiert und bekommen am Montagetag ein Zeitfenster von ${KPI.window}. ${KPI.firstVisit} der Installationen gelingen beim ersten Termin.`,
			chip: {
				title: "Montage Di, 10:00 bis 11:30",
				sub: "Mieter informiert · Beispiel",
			},
		},
		{
			title: "Verbrauchsanalyse und Abrechnung",
			text: "Im Dashboard sehen Sie die Verbräuche jeder Liegenschaft. Ihre Mieter erhalten monatlich die Verbrauchsinformation, und die Heizkostenabrechnung erstellen Sie auf Knopfdruck.",
			chip: { title: "Abrechnung erstellt", sub: "Nach HKVO · Beispiel" },
		},
	],
};

export type Feature = {
	icon: IconName;
	title: string;
	text: string;
	/** No page yet: the card renders without a link (README, open question 3). */
	href?: string;
};

export const features = {
	eyebrow: "Funktionen",
	h2: "Mehr als Ablesung.",
	items: [
		{
			icon: "signal",
			title: "Digitale Funkablesung",
			text: "Alle Sparten ohne manuelles Ablesen und ohne Termin in der Wohnung.",
			// No link until the "Funkzähler" page (3SRjNA9CRSPQEU3cWdAkbt) exists.
		},
		{
			icon: "chart",
			title: "Dashboard",
			text: "Warmwasser, Kaltwasser und Heizung je Liegenschaft im Überblick.",
		},
		{
			icon: "file",
			title: "Dokumenten-Management",
			text: "DocuScan liest abrechnungsrelevante Rechnungen aus und übernimmt die Daten.",
			href: ROUTE_FUNKTIONEN,
		},
		{
			icon: "check",
			title: "Heizkostenabrechnung",
			text: "Auf Knopfdruck, nach HKVO und für jede Einheit einzeln.",
			href: ROUTE_FUNKTIONEN,
		},
		{
			icon: "users",
			title: "Mieterportal",
			text: "Die monatliche Verbrauchsinformation für Ihre Mieter, automatisch.",
			href: ROUTE_MIETERPORTAL,
		},
		{
			icon: "tool",
			title: "Installationstool",
			text: "Digitaler Zwilling, zwei Fotos pro Zähler, sauberes Übergabeprotokoll.",
			href: ROUTE_INSTALLATIONSTOOL,
		},
	] satisfies Feature[] as Feature[],
};

/** `true` = ✓, `false` = –, a string = that text. */
export type CompareValue = boolean | string;

export const comparison = {
	eyebrow: "Der Unterschied",
	h2: "Mit Heidi oder klassisch ablesen?",
	caption: "Vergleich: Heidi und klassische Ablesung",
	heads: { heidi: "Mit Heidi", classic: "Klassisch" },
	/** Screen-reader texts of the ✓ and – marks. */
	yes: "ja",
	no: "nein",
	rows: [
		{ label: "Ablesung", heidi: true, classic: "Termin vor Ort" },
		{
			label: "Ablesetermine in der Wohnung",
			heidi: "keine",
			classic: "regelmäßig",
		},
		{
			label: "Heizkostenabrechnung",
			heidi: "auf Knopfdruck",
			classic: `oft 6${NB}bis 9${NB}Monate`,
		},
		{ label: "Monatliche Verbrauchsinformation", heidi: true, classic: false },
		{
			label: "Rechnungen automatisch erfassen (DocuScan)",
			heidi: true,
			classic: false,
		},
		{ label: "Persönlicher Ansprechpartner", heidi: true, classic: false },
		{
			label: "Wechsel ohne Warten aufs Vertragsende",
			heidi: true,
			classic: false,
		},
	] satisfies { label: string; heidi: CompareValue; classic: CompareValue }[],
};

export const quotes = {
	eyebrow: "Kundenstimmen",
	h2: ["Weniger Aufwand. Mehr Überblick.", "Das sagen unsere Kunden."],
	keys: ["werne", "vitolus", "gerhard"] satisfies Testimonial["key"][],
};

export const faq = {
	eyebrow: "FAQ",
	title: "Echte Fragen. Klare Antworten.",
	items: [
		{
			question: "Wie lange dauert der Umstieg?",
			answer: `Das hängt von der Größe Ihres Bestands ab. Nach der Bedarfsanalyse planen wir die Installation gemeinsam mit Ihnen und informieren Ihre Mieter ${KPI.notice} vorher.`,
		},
		{
			question: "Müssen wir auf das Vertragsende warten?",
			answer:
				"Nein. Heidi übernimmt bestehende Zähler und wertet sie aus, egal wie lange Ihr aktueller Vertrag noch läuft.",
		},
		{
			question: "Was kostet Heidi?",
			answer: `Abgerechnet wird pro tatsächlich installiertem Zähler plus Abrechnungspauschale. Ab 1.000${NB}Einheiten erstellen wir ein individuelles Angebot.`,
		},
		{
			question: "Wie viele Installationen klappen beim ersten Termin?",
			answer: `${KPI.firstVisit} der Installationen gelingen beim ersten Termin. Ihre Mieter bekommen ein Zeitfenster von ${KPI.window}.`,
		},
		{
			question: "Wo liegen unsere Daten?",
			answer: "Auf Servern in Deutschland, verarbeitet nach DSGVO und BDSG.",
			more: { text: "Mehr zu Sicherheit", href: ROUTE_SICHERHEIT },
		},
	] satisfies FaqItem[],
};

export const contact = {
	h2: "Lassen Sie uns über Ihren Bestand sprechen.",
	text: "Wir zeigen Ihnen, wie der Umstieg für Ihre Liegenschaften aussieht. Persönlich und unverbindlich.",
	caption: "Ihr persönlicher Ansprechpartner bei Heidi",
	submitLabel: "Angebot einholen",
	objectPosition: "50% 30%",
};
