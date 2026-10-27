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
import {
	ROUTE_AUSWERTUNG,
	ROUTE_DASHBOARD,
	ROUTE_GERAETE,
	ROUTE_INSTALLATIONSTOOL,
	ROUTE_MIETERPORTAL,
	ROUTE_SCHNITTSTELLEN,
	ROUTE_VERBRAUCHSINFORMATION,
	ROUTE_VORGEHEN,
} from "$lib/routes";
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
	h1: { text: "Alle Funktionen. ", accent: "Eine Plattform." },
	lead: "Funkablesung, Auswertung, Mieterinformation und Heizkostenabrechnung greifen bei Heidi ineinander. Was eine Funktion erfasst, nutzt die nächste weiter.",
	primary: { text: "Demo buchen", href: DEMO_HREF },
	secondary: { text: "So gehen wir vor", href: ROUTE_VORGEHEN },
};

/** The hero's card (.fm): the modules light up one after the other (example data). */
export const modules = {
	label: "Beispiel: Heidi Funktionen arbeiten zusammen",
	title: "Heidi Plattform",
	sub: "Lindenallee 12 · heute",
	tag: "Beispieldaten",
	items: [
		{
			icon: "signal",
			title: "Funkablesung",
			text: "12.480 Werte heute empfangen",
		},
		{ icon: "chart", title: "Auswertung", text: "3 neue Hinweise" },
		{ icon: "bell", title: "Verbrauchsinfo", text: "An 248 Mieter versendet" },
		{ icon: "file", title: "DocuScan", text: "14 Rechnungen erkannt" },
		{ icon: "users", title: "Mieterportal", text: "Montagetermin bestätigt" },
		{ icon: "calc", title: "Heizkostenabrechnung", text: "Bereit per Klick" },
	] satisfies { icon: IconName; title: string; text: string }[],
	/** The design's "#fk-js": one module every 650 ms after 300 ms, then 4.5 s hold. */
	firstMs: 300,
	stepMs: 650,
	holdMs: 4500,
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
			title: "Heizkostenabrechnung",
			text: "Auf Knopfdruck nach HKVO. DocuScan übernimmt die Rechnungsdaten, die Verbrauchswerte kommen direkt von den Funkzählern.",
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

/** A role's entry; without `href` it's plain (no arrow), as in the design. */
export type RoleItem = { title: string; text: string; href?: string };

export const roles = {
	eyebrow: "Für alle Beteiligten",
	eyebrowIcon: "users" as IconName,
	h2: {
		text: "Eine Plattform. ",
		muted: "Vier Blickwinkel.",
	} satisfies SplitHeading,
	label: "Rolle",
	/** The design's `#fk-js`: the next role every 6.5 s while in view. */
	intervalMs: 6500,
	tabs: [
		{
			icon: "building",
			name: "Verwaltung",
			text: "Ihr Team behält den Überblick und erstellt die Abrechnung selbst, per Klick.",
			items: [
				{
					title: "Dashboard",
					text: "Verbräuche aller Liegenschaften",
					href: ROUTE_DASHBOARD,
				},
				{
					title: "Auswertung",
					text: "Vergleich, Jahresverlauf, Hinweise",
					href: ROUTE_AUSWERTUNG,
				},
				// The design links these two to the Heizkostenabrechnung page
				// (H4cZtgYCsvL4h7HGxZaHBs), which doesn't exist yet.
				{ title: "DocuScan", text: "Rechnungen automatisch erfasst" },
				{ title: "Heizkostenabrechnung", text: "Nach HKVO, auf Knopfdruck" },
				{
					title: "Schnittstellen",
					text: "Daten direkt in ERP und CRM",
					href: ROUTE_SCHNITTSTELLEN,
				},
			],
		},
		{
			icon: "users",
			name: "Mieter",
			text: "Ihre Mieter sind informiert, ohne dass Ihr Team Anfragen beantworten muss.",
			items: [
				{
					title: "Verbrauchsinformation",
					text: "Jeden Monat automatisch",
					href: ROUTE_VERBRAUCHSINFORMATION,
				},
				{
					title: "Mieterportal",
					text: "Verbrauch jederzeit einsehen",
					href: ROUTE_MIETERPORTAL,
				},
				{ title: "Montagetermin", text: `${KPI.notice} vorher informiert` },
				{ title: "Kein Ablesetermin", text: "Ablesung per Funk" },
			],
		},
		{
			icon: "home",
			name: "Eigentümer",
			text: "Eigentümer sehen, was in ihrer Liegenschaft passiert, ohne dass Sie Dateien verschicken.",
			items: [
				{
					title: "Dashboard teilen",
					text: "Mit einem Klick freigeben",
					href: ROUTE_DASHBOARD,
				},
				{
					title: "Berichte",
					text: "Kennzahlen und Verlauf als PDF",
					href: ROUTE_AUSWERTUNG,
				},
				{
					title: "Auffälligkeiten",
					text: "Früh erkannt statt teuer bezahlt",
					href: ROUTE_AUSWERTUNG,
				},
			],
		},
		{
			icon: "tool",
			name: "Monteure",
			text: "Monteure und Partnerbetriebe arbeiten schneller und dokumentieren sauber.",
			items: [
				{
					title: "Installationstool",
					text: "Digitaler Zwilling jeder Liegenschaft",
					href: ROUTE_INSTALLATIONSTOOL,
				},
				{
					title: "Fotodokumentation",
					text: "Zwei Fotos pro Zähler",
					href: ROUTE_INSTALLATIONSTOOL,
				},
				{
					title: "Übergabeprotokoll",
					text: "Automatisch erstellt",
					href: ROUTE_INSTALLATIONSTOOL,
				},
			],
		},
	] satisfies {
		icon: IconName;
		name: string;
		text: string;
		items: RoleItem[];
	}[],
};

export const features = {
	eyebrow: "Alle Funktionen",
	eyebrowIcon: "list" as IconName,
	h2: {
		text: "Neun Funktionen, ",
		muted: "die zusammenarbeiten.",
	} satisfies SplitHeading,
	items: [
		{
			icon: "signal",
			title: "Funkablesung",
			text: "Per Funk erfasst, ohne Ablesetermin in der Wohnung.",
			href: ROUTE_GERAETE,
		},
		{
			icon: "chart",
			title: "Dashboard",
			text: "Alle Liegenschaften und Einheiten in einer Ansicht.",
			href: ROUTE_DASHBOARD,
		},
		{
			icon: "sparkles",
			title: "Auswertung",
			text: "Vergleich, Jahresverlauf und konkrete Hinweise.",
			href: ROUTE_AUSWERTUNG,
		},
		{
			icon: "drop",
			title: "Leckage-Wächter",
			text: "Meldet ungewöhnlichen Wasserverbrauch, auch nachts.",
			href: ROUTE_DASHBOARD,
		},
		{
			icon: "bell",
			title: "Verbrauchsinformation",
			text: "Monatlich und automatisch an Ihre Mieter.",
			href: ROUTE_VERBRAUCHSINFORMATION,
		},
		{
			icon: "users",
			title: "Mieterportal",
			text: "Mieter sehen ihren Verbrauch jederzeit.",
			href: ROUTE_MIETERPORTAL,
		},
		// The design links these two to the Heizkostenabrechnung page
		// (H4cZtgYCsvL4h7HGxZaHBs), which doesn't exist yet: plain cards.
		{
			icon: "file",
			title: "DocuScan",
			text: "Rechnungen automatisch erkannt und übernommen.",
		},
		{
			icon: "calc",
			title: "Heizkostenabrechnung",
			text: "Nach HKVO, auf Knopfdruck.",
		},
		{
			icon: "link",
			title: "Schnittstellen",
			text: "Anbindung an Ihr ERP- oder CRM-System.",
			href: ROUTE_SCHNITTSTELLEN,
		},
	] as { icon: IconName; title: string; text: string; href?: string }[],
};

/** One invoice of the DocuScan demo (example data); `skip`: not relevant for the heating costs. */
export type Invoice = {
	title: string;
	supplier: string;
	sum: string;
	skip?: boolean;
	fields: { label: string; value: string }[];
};

export const docuscan = {
	eyebrow: "DocuScan",
	eyebrowIcon: "file" as IconName,
	h2: {
		text: "Rechnungen lesen. ",
		muted: "Macht Heidi.",
	} satisfies SplitHeading,
	text: "DocuScan liest die Rechnungen, die für die Heizkostenabrechnung zählen, und übernimmt die Daten. Brennstoff, Zeitraum und Betrag landen dort, wo sie hingehören. Ohne Abtippen.",
	// "Zur Heizkostenabrechnung" (→ H4cZtgYCsvL4h7HGxZaHBs) stays hidden until
	// that page exists.
	label: "Beispiel: DocuScan erkennt Rechnungen",
	found: "Erkannt",
	tag: "Beispieldaten",
	ok: "In die Abrechnung übernommen",
	skipped: "Nicht heizkostenrelevant, nicht übernommen",
	stamp: "Nicht relevant",
	/** "Rechnung 1 von 4" */
	counter: (n: number, of: number) => `Rechnung ${n} von ${of}`,
	invoices: [
		{
			title: "Rechnung",
			supplier: "Muster Energie GmbH",
			sum: "48.210,00 €",
			fields: [
				{ label: "Lieferant", value: "Muster Energie GmbH" },
				{ label: "Leistung", value: "Erdgas, 412.600 kWh" },
				{ label: "Zeitraum", value: "01.01. – 31.12.2025" },
				{ label: "Betrag", value: "48.210,00 €" },
			],
		},
		{
			title: "Rechnung",
			supplier: "Muster Stadtwerke",
			sum: "2.946,00 €",
			fields: [
				{ label: "Lieferant", value: "Muster Stadtwerke" },
				{ label: "Leistung", value: "Allgemeinstrom, 8.420 kWh" },
				{ label: "Zeitraum", value: "01.01. – 31.12.2025" },
				{ label: "Betrag", value: "2.946,00 €" },
			],
		},
		{
			title: "Wartungsrechnung",
			supplier: "Muster Heiztechnik GmbH",
			sum: "1.180,00 €",
			fields: [
				{ label: "Lieferant", value: "Muster Heiztechnik GmbH" },
				{ label: "Leistung", value: "Wartung der Heizungsanlage" },
				{ label: "Datum", value: "14.03.2025" },
				{ label: "Betrag", value: "1.180,00 €" },
			],
		},
		{
			title: "Rechnung",
			supplier: "Muster Malerbetrieb GmbH",
			sum: "3.480,00 €",
			skip: true,
			fields: [
				{ label: "Lieferant", value: "Muster Malerbetrieb GmbH" },
				{ label: "Leistung", value: "Malerarbeiten im Treppenhaus" },
				{ label: "Datum", value: "22.05.2025" },
				{ label: "Betrag", value: "3.480,00 €" },
			],
		},
	] satisfies Invoice[] as Invoice[],
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
	/** The video button (the design's .dcta-b) → the booking page. */
	button: {
		text: "Demo buchen",
		sub: "Mit Ihrem Ansprechpartner",
		href: DEMO_HREF,
	},
};
