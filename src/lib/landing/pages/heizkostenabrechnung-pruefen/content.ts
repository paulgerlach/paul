/**
 * Texts of /heizkostenabrechnung-pruefen, word for word from the design
 * (https://claude.ai/artifact/FQ6egKN8KrFwGUMZDUaavJ): the page, the check
 * card's labels and messages, the paywall, the letter section, the scan
 * demo's sample bill, the studies, the stats, the eleven errors, the
 * timeline and the FAQ. The rules' own texts (each point, the letter's
 * sentences) are `rules.ts`'. Legal statements, the paywall and the reading
 * of bills await sign-off (plan §4.4).
 */
import { DEMO_HREF } from "$lib/landing/cta";
import type { FaqItem } from "$lib/landing/faqJsonLd";
import type { SplitHeading } from "$lib/landing/types";
import { ROUTE_FUNKTIONEN } from "$lib/routes";
import type { Answer, Share } from "./rules";

const NB = " ";

/** The hero with the check card (the design's `#start`). */
export const CHECKER_ID = "checker";
/** The letter section, shown once a letter is made. */
export const LETTER_ID = "schreiben";
/** The scan demo. */
export const SCAN_ID = "pruefung";
/** The figures, the target of "Zu den Zahlen ↓". */
export const NUMBERS_ID = "zahlen";
/** The eleven errors. */
export const ERRORS_ID = "fehler";

/**
 * The payment page of the paywall. The design has none (`PAY = ''`), so its
 * button reads "Zahlung wird gerade eingerichtet" and is disabled (plan
 * README, open question 3).
 */
export const PAY_HREF: string | undefined = undefined;

export const hero = {
	pill: "Für Mieter · kostenlos",
	/** With the design's soft hyphen. */
	h1: "Heizkosten­abrechnung",
	h1Accent: "jetzt überprüfen.",
	lead: "Laden Sie Ihre Heizkostenabrechnung hoch. Wir lesen die Werte aus, prüfen sie gegen Heizkostenverordnung und BGB und zeigen Ihnen, ob Sie kürzen dürfen oder eine Nachzahlung entfällt.",
	ticks: [
		"Foto oder PDF genügt",
		"Ergebnis in etwa einer Minute",
		"Musterschreiben inklusive",
	],
	stat: {
		before: "Laut Verbraucherzentralen waren rund ",
		figure: "2 von 3",
		after:
			" geprüften Heizkostenabrechnungen fehlerhaft oder klärungsbedürftig.",
		link: { text: "Zu den Zahlen ↓", href: `#${NUMBERS_ID}` },
	},
};

export const ANSWERS: { value: Answer; label: string }[] = [
	{ value: "ja", label: "Ja" },
	{ value: "nein", label: "Nein" },
	{ value: "?", label: "Weiß nicht" },
];

export const card = {
	tabs: { label: "Eingabe", upload: "Hochladen", values: "Werte eingeben" },
	upload: {
		drop: "Abrechnung hierher ziehen",
		more: "Weitere Seite hinzufügen",
		or: "oder ",
		pick: "Datei auswählen",
		formats: " · PDF, JPG oder PNG",
		accept: "image/jpeg,image/png,image/webp,application/pdf",
		pdf: "PDF",
		remove: "Entfernen",
		wrongType: "Bitte ein PDF oder ein Foto (JPG, PNG) hochladen.",
		privacy:
			"Ihre Abrechnung wird nur für diese Prüfung ausgewertet und von dieser Seite nicht gespeichert. Name und Adresse dürfen Sie vorher schwärzen.",
		example: "Beispiel ansehen",
		/**
		 * The design's text where its AI reading isn't available: here
		 * always (plan README, "Reading the bill").
		 */
		noReading:
			"Die automatische Erkennung ist in dieser Ansicht nicht verfügbar. Geben Sie die Werte aus Ihrer Abrechnung einfach selbst ein, das dauert etwa eine Minute.",
	},
	flow: {
		step: (n: number) => `Schritt ${n} von 5`,
		received: "Wann haben Sie die Abrechnung erhalten?",
		receivedHint:
			"Wichtig für die Frist: Einwendungen sind bis zwölf Monate nach Erhalt möglich.",
		unknown: "Weiß ich nicht",
		next: "Weiter →",
		remote:
			"Werden Ihre Zähler per Funk abgelesen, ohne Termin in der Wohnung?",
		uvi: "Bekommen Sie jeden Monat eine Verbrauchsinformation?",
		ready: "Alles bereit",
		summary: {
			bill: "Abrechnung",
			received: "Erhalten am",
			notGiven: "nicht angegeben",
			remote: "Funkablesung",
			uvi: "Monatliche Verbrauchsinfo",
			change: "Ändern",
		},
		check: "Abrechnung prüfen",
		back: "← Zurück",
	},
	values: {
		heating: "Ihre Heizkosten",
		heatingNote: "Heizung + Warmwasser",
		heatingPlaceholder: "z. B. 1.240",
		result: "Ergebnis der Abrechnung",
		resultPlaceholder: "z. B. 310",
		backPayment: "Nachzahlung",
		credit: "Guthaben",
		from: "Abrechnungszeitraum von",
		to: "bis",
		received: "Erhalten am",
		share: "Anteil nach Verbrauch",
		shareNote: "Heizung",
		shares: [
			{ value: "", label: "Weiß nicht" },
			{ value: "70", label: "70 %" },
			{ value: "60", label: "60 %" },
			{ value: "50", label: "50 %" },
			{ value: "40", label: "unter 50 %" },
			{ value: "0", label: "nur nach Fläche" },
		] satisfies { value: Share; label: string }[],
		co2: "Sind die CO₂-Kosten zwischen Vermieter und Mieter aufgeteilt?",
		remote: "Zähler per Funk abgelesen?",
		uvi: "Monatliche Verbrauchsinformation erhalten?",
		show: "Ergebnis anzeigen",
	},
	result: {
		upTo: "bis zu",
		letter: "Musterschreiben erstellen",
		edit: "Werte ändern",
		again: "Neue Abrechnung prüfen",
		example: "Beispiel",
		teaserNote: "mit Begründung, Paragraf und Betrag je Punkt",
		open: "Gründe und Details ansehen",
	},
};

export const paywall = {
	pill: "Ihre Auswertung",
	title: "Heizkostenabrechnung geprüft",
	close: "Schließen",
	points: "Gefundene Punkte",
	count: (n: number) => `${n} Punkte`,
	doc: {
		title: "Ihre Heizkostenabrechnung",
		sub: "Geprüfte Angaben",
		example: "Beispiel",
		imageAlt: "Ihre hochgeladene Abrechnung",
	},
	lock: {
		title: "Vollständige Auswertung freischalten",
		text: "Sehen Sie genau, was in Ihrer Abrechnung richtig und was falsch ist.",
		includes: [
			"Jeder Punkt mit Begründung und Paragraf",
			"Betrag, den Sie je Punkt kürzen können",
			"Fertiges Musterschreiben an Ihren Vermieter",
			"Frist für Ihre Einwendungen",
		],
		price: `39,99${NB}€`,
		priceNote: "einmalig, inkl. MwSt.",
		pay: "Jetzt für 39,99 € freischalten",
		payOff: "Zahlung wird gerade eingerichtet",
		example: "Beispiel kostenlos freischalten",
		wait: "Die Zahlung öffnet sich in einem neuen Fenster. Danach erscheint Ihre Auswertung hier automatisch.",
		secure: "Sichere Zahlung · Ihre Daten bleiben bei Ihnen",
	},
};

export const letter = {
	pill: "Musterschreiben",
	h2: {
		text: "Ihre Einwendung. ",
		muted: "Zum Anpassen und Versenden.",
	} satisfies SplitHeading,
	lead: "Ergänzen Sie Name, Adresse und Datum und schicken Sie das Schreiben innerhalb von zwölf Monaten nach Erhalt der Abrechnung an Ihren Vermieter, am besten per Einschreiben.",
	note: "Vorlage ohne Gewähr, keine Rechtsberatung. Bei Streit hilft Ihr örtlicher Mieterverein.",
	label: "Musterschreiben",
	copy: "Text kopieren",
	copied: "Kopiert",
	selected: "Text markiert, bitte mit Strg+C kopieren",
};

/** A marked row of the sample bill and its finding share a key. */
export type FindingKey = "e1" | "e2" | "e3" | "e4";

export const scan = {
	pill: "So prüft der Checker",
	h2: {
		text: "Abrechnung scannen. ",
		muted: "Fehler sehen.",
	} satisfies SplitHeading,
	lead: "Der Checker liest jede Zeile Ihrer Heizkostenabrechnung und gleicht sie mit Heizkostenverordnung, CO₂-Kostenaufteilungsgesetz und BGB ab. Was nicht passt, steht rechts, mit der möglichen Folge für Sie.",
	label:
		"Beispiel: Eine Heizkostenabrechnung wird gescannt und Fehler werden aufgelistet",
	bill: {
		sender: "Muster Messdienst GmbH · Beispielweg 1 · 12345 Musterstadt",
		name: "Max Mustermann",
		address: ["Musterstraße 12, WE 08", "10115 Berlin"],
		title: "Heizkostenabrechnung",
		number: "Nutzernummer 0008",
		period: {
			key: "e1" as FindingKey,
			label: "Abrechnungszeitraum",
			value: "01.01.2024 – 31.03.2025",
		},
		rows: [
			{ label: "Brennstoff", value: "Erdgas, 412.600 kWh" },
			{ label: "Gesamtkosten Heizung", value: "48.210,00 €" },
		],
		split: {
			key: "e2" as FindingKey,
			head: ["Kostenverteilung", "Anteil", "Betrag"],
			rows: [
				["Grundkosten (Wohnfläche)", "70 %", "33.747,00 €"],
				["Verbrauchskosten", "30 %", "14.463,00 €"],
			],
		},
		co2: {
			key: "e3" as FindingKey,
			label: "CO₂-Kosten",
			value: "keine Angabe",
		},
		readings: {
			key: "e4" as FindingKey,
			head: ["Ablesung", "Einheiten", "Art"],
			rows: [
				["Wohnzimmer", "2.180", "Funk"],
				["Schlafzimmer", "960", "Funk"],
				["Küche", "1.240", "Schätzung"],
			],
		},
		sum: [
			{ label: "Ihr Anteil Heizung", value: "1.012,40 €" },
			{ label: "Vorauszahlungen", value: "840,00 €" },
			{ label: "Nachzahlung", value: "172,40 €", total: true },
		],
	},
	note: "Beispieldaten",
	result: "Prüfergebnis",
	reading: "Abrechnung wird gelesen …",
	found: "gefunden",
	done: (n: number) => `${n} Auffälligkeiten in dieser Abrechnung`,
	findings: [
		{
			key: "e1",
			tone: "bad",
			title: "Abrechnungszeitraum über 12 Monate",
			text: "15 Monate abgerechnet. Heizkosten sind jährlich abzurechnen.",
			tag: "Formfehler",
		},
		{
			key: "e2",
			tone: "bad",
			title: "Zu wenig nach Verbrauch verteilt",
			text: "Nur 30 % nach Verbrauch. Vorgeschrieben sind 50 bis 70 %.",
			tag: "Kürzung 15 %",
		},
		{
			key: "e3",
			tone: "bad",
			title: "CO₂-Kosten nicht aufgeteilt",
			text: "Keine Aufteilung zwischen Vermieter und Mieter ausgewiesen.",
			tag: "Kürzung 3 %",
		},
		{
			key: "e4",
			tone: "warn",
			title: "Ablesewert geschätzt",
			text: "Heizkörper Küche mit „Schätzung“ markiert. Grund erfragen.",
			tag: "Nachfragen",
		},
	] satisfies {
		key: FindingKey;
		tone: "bad" | "warn";
		title: string;
		text: string;
		tag: string;
	}[],
	footer: "Ein Musterschreiben mit allen Punkten wird für Sie vorbereitet.",
	cta: { text: "Eigene Abrechnung prüfen", href: `#${CHECKER_ID}` },
};

export type StudyKey = "vz" | "co";

export const numbers = {
	pill: "Wie oft Abrechnungen falsch sind",
	h2: {
		text: "Fehler sind die Regel. ",
		muted: "Nicht die Ausnahme.",
	} satisfies SplitHeading,
	switchLabel: "Studie",
	of: "von 100",
	sourcePrefix: "Quelle: ",
	studies: [
		{
			key: "vz",
			label: "Verbraucherzentralen",
			value: 67,
			text: "Rund zwei Drittel der geprüften Heizkostenabrechnungen waren fehlerhaft oder klärungsbedürftig.",
			source:
				"Marktwächter Energie der Verbraucherzentralen, 1.046 Abrechnungen aus den Jahren 2011 bis 2017 (vzbv, 2018)",
		},
		{
			key: "co",
			label: "co2online & Finanztip",
			value: 80,
			text: "Bei vier von fünf geprüften Heizkostenabrechnungen gab es Mängel oder Auffälligkeiten.",
			source: "Stichprobe von co2online und Finanztip (2019)",
		},
	] satisfies {
		key: StudyKey;
		label: string;
		value: number;
		text: string;
		source: string;
	}[],
	/** `count`: the figure counts up to it, `unit` follows it. */
	stats: [
		{
			count: 60,
			unit: "%",
			text: "der Abrechnungen mit auffälliger Berechnung des Warmwasseranteils",
			source: "Stichprobe co2online & Finanztip, 2019",
		},
		{
			value: "1 von 5",
			text: "Abrechnungen mit auffällig hohen Kosten für den Betriebsstrom der Heizung",
			source: "Stichprobe co2online & Finanztip, 2019",
		},
		{
			count: 565,
			unit: `${NB}€`,
			text: "zahlten Mieter im Schnitt zu viel, deren Nebenkostenabrechnung fehlerhaft war",
			source:
				"Mineko, eingereichte Abrechnungen, nicht repräsentativ (via Finanztip, 2026)",
			dark: true,
		},
		{
			value: "jede 2.",
			text: "Nebenkostenabrechnung ist nach Schätzung des Deutschen Mieterbunds fehlerhaft",
			source: "Deutscher Mieterbund, zitiert von DAHAG, 2019",
		},
	] satisfies {
		count?: number;
		unit?: string;
		value?: string;
		text: string;
		source: string;
		dark?: boolean;
	}[],
};

/** `k`: a right to cut, `f`: form and deadline, `r`: the invoice. */
export type ErrorKind = "k" | "f" | "r";
export type ErrorFilter = "all" | ErrorKind;

export const errors = {
	pill: "Die häufigsten Fehler",
	h2: {
		text: "Elf Fehler, die Sie ",
		muted: "bares Geld kosten.",
	} satisfies SplitHeading,
	filterLabel: "Filter",
	filters: [
		{ value: "all", label: "Alle" },
		{ value: "k", label: "Kürzungsrecht" },
		{ value: "f", label: "Form & Frist" },
		{ value: "r", label: "Rechnung" },
	] satisfies { value: ErrorFilter; label: string }[],
	items: [
		{
			kind: "k",
			title: "Nicht nach Verbrauch abgerechnet",
			text: "Heizkosten nur nach Wohnfläche oder zu weniger als 50 % nach Verbrauch verteilt.",
			effect: "Kürzung um 15 %",
			law: "§§ 7, 12 HeizkostenV",
		},
		{
			kind: "f",
			title: "Abrechnung zu spät",
			text: "Die Abrechnung muss spätestens zwölf Monate nach Ende des Abrechnungszeitraums bei Ihnen sein.",
			effect: "Nachzahlung entfällt",
			law: "§ 556 Abs. 3 BGB",
		},
		{
			kind: "k",
			title: "CO₂-Kosten nicht aufgeteilt",
			text: "Seit 2023 tragen Vermieter je nach Energiebilanz des Gebäudes einen Teil der CO₂-Kosten. Fehlt die Aufteilung, dürfen Sie kürzen.",
			effect: "Kürzung um 3 %",
			law: "§ 7 Abs. 4 CO2KostAufG",
		},
		{
			kind: "k",
			title: "Keine monatliche Verbrauchsinfo",
			text: "Bei fernablesbaren Zählern steht Ihnen jeden Monat eine Information über Ihren Verbrauch zu.",
			effect: "Kürzung um 3 %",
			law: "§§ 6a, 12 HeizkostenV",
		},
		{
			kind: "r",
			title: "Warmwasseranteil falsch berechnet",
			text: "Der Energieanteil für Warmwasser wird oft geschätzt oder falsch berechnet. In einer Stichprobe war das bei 60 % der Abrechnungen auffällig.",
			effect: "Kosten falsch verteilt",
			law: "§ 9 HeizkostenV",
		},
		{
			kind: "r",
			title: "Betriebsstrom zu hoch",
			text: "Strom für Pumpen und Regelung darf umgelegt werden, aber in plausibler Höhe. In jeder fünften Abrechnung einer Stichprobe war er auffällig hoch.",
			effect: "Belege anfordern",
			law: "§ 7 Abs. 2 HeizkostenV",
		},
		{
			kind: "r",
			title: "Verbrauch geschätzt oder unplausibel",
			text: "Schätzungen sind nur zulässig, wenn ein Zähler ausfällt oder nicht abgelesen werden konnte. Sprünge ohne Grund sollten Sie hinterfragen.",
			effect: "Korrektur verlangen",
			law: "§ 9a HeizkostenV",
		},
		{
			kind: "f",
			title: "Falscher Abrechnungszeitraum",
			text: "Länger als zwölf Monate abgerechnet, oder Monate berechnet, in denen Sie noch nicht oder nicht mehr dort gewohnt haben.",
			effect: "Abrechnung angreifbar",
			law: "§ 556 Abs. 3 BGB",
		},
		{
			kind: "r",
			title: "Vorauszahlungen fehlen",
			text: "Nicht alle gezahlten Abschläge sind angerechnet. Dann fällt die Nachzahlung zu hoch aus.",
			effect: "Nachzahlung zu hoch",
			law: "§ 556 BGB",
		},
		{
			kind: "r",
			title: "Falsche Wohnfläche",
			text: "Der Anteil nach Fläche wird mit der falschen Quadratmeterzahl berechnet.",
			effect: "Kosten falsch verteilt",
			law: "§ 7 HeizkostenV",
		},
		{
			kind: "r",
			title: "Reparaturen umgelegt",
			text: "Reparaturen und Instandhaltung trägt der Vermieter. Umlegen darf er nur laufende Kosten wie die Wartung.",
			effect: "Nicht umlagefähig",
			law: "§ 7 Abs. 2 HeizkostenV",
		},
	] satisfies {
		kind: ErrorKind;
		title: string;
		text: string;
		effect: string;
		law: string;
	}[],
};

export const deadlines = {
	pill: "Ihre Fristen",
	h2: {
		text: "Zweimal zwölf Monate. ",
		muted: "Die wichtigsten Daten.",
	} satisfies SplitHeading,
	points: [
		{
			title: "Ende des Abrechnungszeitraums",
			text: "Meist der 31. Dezember",
		},
		{
			title: "Spätestens 12 Monate danach",
			text: "muss Ihnen die Abrechnung vorliegen. Kommt sie später, müssen Sie keine Nachzahlung leisten, sofern der Vermieter die Verspätung zu vertreten hat (§ 556 Abs. 3 BGB).",
		},
		{
			title: "12 Monate nach Erhalt",
			text: "haben Sie Zeit für Einwendungen. Danach können Sie Fehler in der Regel nicht mehr geltend machen (§ 556 Abs. 3 BGB).",
		},
	],
};

export const managers = {
	pill: "Für Verwaltungen und Vermieter",
	h2: "Mit Heidi entstehen diese Fehler gar nicht erst.",
	text: "Funkzähler, monatliche Verbrauchsinformation und eine Heizkostenabrechnung nach HKVO, per Klick. So entsteht die nächste Abrechnung ohne diese Fehler.",
	// H4cZtgYCsvL4h7HGxZaHBs, as the landing footer's "Heizkostenabrechnung".
	billing: { text: "Heizkostenabrechnung mit Heidi", href: ROUTE_FUNKTIONEN },
	// 44SBXKXJaSp6bvGMnbpZj6 (the booking page): the closing form here.
	demo: { text: "Demo buchen", href: DEMO_HREF },
};

export const faq: { title: string; items: FaqItem[] } = {
	title: "Häufige Fragen",
	items: [
		{
			question: "Kostet die Prüfung etwas?",
			answer: "Nein. Die Prüfung ist kostenlos und unverbindlich.",
		},
		{
			question: "Was passiert mit meiner Abrechnung?",
			answer:
				"Die hochgeladenen Seiten werden nur ausgewertet, um die Werte zu erkennen. Diese Seite speichert sie nicht. Name und Adresse können Sie vor dem Hochladen schwärzen, für die Prüfung werden sie nicht gebraucht.",
		},
		{
			question: "Wie sicher ist das Ergebnis?",
			answer:
				"Die Prüfung zeigt, wo eine Kürzung oder ein Wegfall der Nachzahlung naheliegt, und nennt die Rechtsgrundlage. Sie ersetzt keine Rechtsberatung. Prüfen Sie die erkannten Werte und lassen Sie sich im Zweifel von Ihrem Mieterverein beraten.",
		},
		{
			question: "Wie bekomme ich mein Geld zurück?",
			answer:
				"Erheben Sie schriftlich Einwendungen gegen die Abrechnung, innerhalb von zwölf Monaten nach Erhalt. Das Musterschreiben aus der Prüfung hilft Ihnen dabei. Haben Sie bereits gezahlt, können Sie den zu viel gezahlten Betrag zurückfordern.",
		},
		{
			question: "Darf ich Belege einsehen?",
			answer:
				"Ja. Mieter dürfen die Rechnungen und Verträge hinter der Abrechnung einsehen. Das lohnt sich vor allem bei hohen Kosten für Wartung, Betriebsstrom oder Messdienst.",
		},
	],
};

export const closing = {
	h2: "Ihre Abrechnung in einer Minute geprüft.",
	// The design's "Jetzt prüfen ↑" (to the card) makes way for the signup
	// form that the page's "Demo buchen" links need (plan README, open
	// question 1).
	submitLabel: "Demo buchen",
};
