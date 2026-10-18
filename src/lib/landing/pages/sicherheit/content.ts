/**
 * Every text of /sicherheit, word for word from the design (plan 01 §1.2).
 * Components hold markup only.
 */
import { DEMO_HREF } from "$lib/landing/cta";
import type { FaqItem } from "$lib/landing/faqJsonLd";
import type { IconName } from "./icons";

/** The contracting party, written out as in the design (`content.test.ts` checks it against the footer's `ADDRESS`). */
export const COMPANY = {
	name: "Heidi Systems GmbH",
	street: "Monbijouplatz 4",
	city: "10178 Berlin",
};
const address = `${COMPANY.name}, ${COMPANY.street}, ${COMPANY.city}`;

/** Anchor of the table section. */
export const DATA_ID = "daten";

export const hero = {
	pill: "Sicherheit & Datenschutz",
	h1: "Ihre Daten bleiben ",
	h1Accent: "in Deutschland.",
	lead: "Heidi verarbeitet und speichert alle Daten nach deutschen Vorgaben, auf Servern in Deutschland. Das gilt für die Daten Ihrer Verwaltung genauso wie für die Daten Ihrer Mieter.",
	demo: { text: "Demo buchen", href: DEMO_HREF },
	data: { text: "Welche Daten wo liegen", href: `#${DATA_ID}` },
	ticks: ["Server in Deutschland", "DSGVO und BDSG", "Unternehmen aus Berlin"],
};

export const map = {
	label:
		"Karte: Daten aus Liegenschaften in ganz Deutschland laufen auf Server in Deutschland",
	badgeLabel: "Speicherort",
	badgeValue: "Deutschland",
	logTag: "Server DE",
	messages: [
		"Zählerstand übertragen",
		"Verbrauchsinformation erstellt",
		"Rechnung gespeichert",
		"Abrechnung gespeichert",
	],
};

export const principles = {
	h2: ["Deutsche Server. Deutsche Vorgaben.", "Ein deutsches Unternehmen."],
	cards: [
		{
			icon: "servers",
			title: "Gespeichert in Deutschland",
			text: "Alle Daten liegen auf Servern in Deutschland. Verbräuche, Abrechnungen, Rechnungen und Stammdaten Ihrer Liegenschaften.",
		},
		{
			icon: "shield",
			title: "Verarbeitet nach deutschen Vorgaben",
			text: "Heidi verarbeitet alle Daten nach der Datenschutz-Grundverordnung (DSGVO) und dem Bundesdatenschutzgesetz (BDSG).",
		},
		{
			icon: "pin",
			title: "Ihr Partner sitzt in Berlin",
			text: `Ihr Vertragspartner ist die ${address}. Vertrag und Ansprechpartner in Deutschland.`,
		},
	] as const,
};

type PathNode = { icon: IconName; title: string; sub?: string };

export const path = {
	h2: "Der Weg Ihrer Daten",
	lead: "Vom Zähler in der Wohnung bis zur fertigen Abrechnung. Gespeichert und verarbeitet wird in Deutschland.",
	frame: "Heidi · Server in Deutschland",
	chain: [
		{ icon: "meter", title: "Funkzähler", sub: "in der Wohnung" },
		{ icon: "gateway", title: "Gateway", sub: "im Haus" },
		{ icon: "server", title: "Heidi-Server", sub: "in Deutschland" },
	] satisfies PathNode[],
	outputs: [
		{ icon: "chart", title: "Ihr Dashboard" },
		{ icon: "file", title: "Heizkostenabrechnung" },
		{ icon: "users", title: "uVI für Mieter" },
	] satisfies PathNode[],
};

export type DataRow = {
	icon: IconName;
	name: string;
	purpose: string;
	detail: string;
};

export const table = {
	h2: "Welche Daten wo liegen",
	lead: "Alles, was Heidi für Ablesung, Verbrauchsinformation und Abrechnung braucht. Klicken Sie auf eine Zeile für Details.",
	columns: ["Daten", "Wofür", "Speicherort"],
	/** Every row's location. */
	location: "Deutschland",
	/** Prefix of the location for screen readers. */
	locationLabel: "Speicherort:",
	rows: [
		{
			icon: "meter",
			name: "Verbrauchsdaten",
			purpose: "Zählerstände der Funkzähler für Heizung und Wasser",
			detail:
				"Grundlage für uVI und Heizkostenabrechnung. Die Funkzähler übertragen ihre Werte aus der Ferne, gespeichert wird auf Servern in Deutschland.",
		},
		{
			icon: "building",
			name: "Liegenschaften und Einheiten",
			purpose: "Stammdaten Ihres Bestands",
			detail:
				"Adressen, Einheiten und Zählerzuordnung. Damit jeder Verbrauch der richtigen Wohnung zugeordnet wird.",
		},
		{
			icon: "users",
			name: "Mieterdaten",
			purpose: "Für Verbrauchsinformation und Abrechnung",
			detail:
				"Was für die monatliche Verbrauchsinformation nach § 6a HeizkostenV und für die Abrechnung jeder Einheit nötig ist. Verarbeitet nach DSGVO und BDSG.",
		},
		{
			icon: "clipboard",
			name: "Rechnungen aus DocuScan",
			purpose: "Brennstoff, Betriebsstrom, Wartung",
			detail:
				"Hochgeladene Rechnungen und die daraus erkannten Werte. Sie liegen wie alle anderen Daten in Deutschland.",
		},
		{
			icon: "file",
			name: "Heizkostenabrechnungen",
			purpose: "Fertige Abrechnungen je Einheit",
			detail:
				"Die erstellten Abrechnungen und ihre Berechnungsgrundlagen. Auf Wunsch übergibt Heidi sie an Ihre Verwaltungssoftware.",
		},
		{
			icon: "chart",
			name: "Dashboard",
			purpose: "Zugang Ihres Teams",
			detail:
				"Übersicht über Verbräuche, Kosten und Benachrichtigungen aller Liegenschaften. Die Daten dahinter liegen auf Servern in Deutschland.",
		},
	] satisfies DataRow[],
};

export const faq = {
	title: "Häufige Fragen",
	items: [
		{
			question: "Wo speichert Heidi meine Daten?",
			answer:
				"Auf Servern in Deutschland. Das gilt für alle Daten: Verbräuche, Stammdaten, Mieterdaten, Rechnungen und Abrechnungen.",
		},
		{
			question: "Nach welchen Vorgaben verarbeitet Heidi die Daten?",
			answer:
				"Nach den deutschen Vorgaben, also der Datenschutz-Grundverordnung (DSGVO) und dem Bundesdatenschutzgesetz (BDSG).",
		},
		{
			question: "Welche Daten verarbeitet Heidi?",
			answer:
				"Nur was für Ablesung, Verbrauchsinformation und Heizkostenabrechnung nötig ist: Zählerstände, Stammdaten Ihrer Liegenschaften und Einheiten, Mieterdaten für uVI und Abrechnung sowie die Rechnungen, die Sie über DocuScan hochladen.",
		},
		{
			question: "Gilt das auch für die Daten meiner Mieter?",
			answer:
				"Ja. Auch die Daten Ihrer Mieter werden nach DSGVO und BDSG verarbeitet und auf Servern in Deutschland gespeichert.",
		},
		{
			question: "Wer ist mein Vertragspartner?",
			answer: `Die ${address}.`,
		},
	] satisfies FaqItem[] as FaqItem[],
};

export const closing = {
	h2: "Messdienst mit Daten in Deutschland.",
	// The design's only button; the form replaces it (plan README, open question 3).
	submitLabel: "Demo buchen",
};
