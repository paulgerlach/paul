/**
 * Every text of /heizkostenabrechnung, word for word from the design
 * (https://claude.ai/artifact/H4cZtgYCsvL4h7HGxZaHBs). Components hold markup
 * and behaviour only.
 *
 * The product as described, the legal statements, the example data and the
 * FAQ need sign-off before the cutover (go-live gate §2).
 */
import { DEMO_HREF } from "$lib/landing/cta";
import type { FaqItem } from "$lib/landing/faqJsonLd";
import {
	ROUTE_DASHBOARD,
	ROUTE_SCHNITTSTELLEN,
	ROUTE_SELBSTABRECHNUNG,
	ROUTE_VERBRAUCHSINFORMATION,
} from "$lib/routes";

/** The DocuScan section (the design's id); "DocuScan ausprobieren" leads here. */
export const SCAN_ID = "scan";

export const hero = {
	pill: "Heizkostenabrechnung",
	/** "Heizkosten&shy;abrechnung …" */
	h1: "Heizkosten­abrechnung auf Knopfdruck.",
	h1Accent: "Nicht in 6 bis 9 Monaten.",
	lead: "Rechnung hochladen, DocuScan liest sie aus, Heidi verteilt die Kosten nach HKVO. Alle Verbräuche liegen per Funk vor, die Abrechnung entsteht mit einem Klick.",
	// 44SBXKXJaSp6bvGMnbpZj6 (the booking page): /demo.
	demo: { text: "Demo buchen", href: DEMO_HREF },
	scan: { text: "DocuScan ausprobieren", href: `#${SCAN_ID}` },
};

export const timeline = {
	h2: "Wie lange dauert Ihre Heizkostenabrechnung?",
	old: {
		label: "Klassischer Messdienst",
		steps: [
			"Ablesung",
			"Rechnungen sammeln",
			"Händisch erfassen",
			"Rückfragen",
		],
		result: "6–9 Monate",
	},
	heidi: { label: "Heidi", result: "Auf Knopfdruck" },
	axis: ["Ende Abrechnungszeitraum", "+3 Monate", "+6 Monate", "+9 Monate"],
	note: "Erfahrungswert aus dem Markt. Die gesetzliche Frist für die Betriebskostenabrechnung beträgt 12 Monate nach Ende des Abrechnungszeitraums.",
};

/** The invoice's fields that the scan lights (the design's `data-f`). */
export type InvoiceField = "nr" | "dat" | "zr" | "gas" | "gp" | "str" | "sum";

/** One result card (example data): a cost type read from the invoice. */
export type ScanCard = {
	key: "gas" | "str";
	icon: "flame" | "bolt";
	kind: string;
	/** The amount as the design writes it, without "€". */
	amount: string;
	/** The invoice's fields lit while the amount field has focus. */
	amountFields: InvoiceField[];
	purpose: string;
};

export const docuscan = {
	pill: "DocuScan",
	h2: "Rechnung hochladen. Den Rest liest DocuScan.",
	sub: "DocuScan erkennt Rechnungen, die für die Heizkostenabrechnung relevant sind, liest Kostenart, Datum und Betrag aus und überträgt sie direkt in die Abrechnung.",
	note: "Demo mit einem Beispieldokument. Firmen- und Rechnungsdaten sind fiktiv.",
	invoice: {
		supplier: "Musterwerke Energie GmbH",
		address: "Musterstraße 1 · 12345 Musterstadt",
		title: "RECHNUNG",
		recipientLabel: "Rechnungsempfänger",
		recipient: ["WEG Lindenallee 12", "c/o Hausverwaltung"],
		meta: [
			{ label: "Rechnungs-Nr.", value: "EN-2026-0412", field: "nr" },
			{ label: "Rechnungsdatum", value: "12.12.2026", field: "dat" },
			{ label: "Zeitraum", value: "01.01.–31.12.2026", field: "zr" },
		] satisfies { label: string; value: string; field: InvoiceField }[],
		head: ["Position", "Menge", "Betrag"],
		rows: [
			{ cells: ["Erdgas, Heizung", "48.210 kWh", "3.984,12 €"], field: "gas" },
			{ cells: ["Grundpreis Gas", "12 Mon.", "387,77 €"], field: "gp" },
			{
				cells: ["Betriebsstrom Heizanlage", "1.020 kWh", "312,40 €"],
				field: "str",
			},
		] satisfies { cells: string[]; field: InvoiceField }[],
		sumLabel: "Gesamtbetrag",
		sum: "4.684,29 €",
		tag: "Beispieldokument",
	},
	uploaded: "Hochgeladenes Dokument: Energierechnung 12.12.2026",
	loading: "Dokument wird gescannt …",
	steps: [
		"Dokument lesen",
		"Rechnungsart erkennen",
		"Kostenarten zuordnen",
		"Beträge und Zeiträume übernehmen",
	],
	/** The status line while each step runs, then when done. */
	stepLines: [
		"Dokument wird gelesen …",
		"Rechnungsart erkannt: Energierechnung",
		"Kostenarten werden zugeordnet …",
		"Beträge werden übernommen …",
	],
	finished: "Fertig: 2 Kostenarten erkannt",
	/** The invoice's fields each step lights. */
	stepFields: [
		["dat", "nr", "zr"],
		["gas", "gp"],
		["str"],
		["sum"],
	] satisfies InvoiceField[][],
	cardPrefix: "Kostenart erkannt: ",
	cards: [
		{
			key: "gas",
			icon: "flame",
			kind: "Brennstoff (Gas)",
			amount: "4.371,89",
			amountFields: ["gas", "gp"],
			purpose: "Brennstoffkosten Heizung",
		},
		{
			key: "str",
			icon: "bolt",
			kind: "Betriebsstrom",
			amount: "312,40",
			amountFields: ["str"],
			purpose: "Betriebsstrom Heizanlage",
		},
	] satisfies ScanCard[] as ScanCard[],
	date: {
		label: "Rechnungsdatum",
		value: "12.12.2026",
		placeholder: "tt.mm.jjjj",
	},
	amount: {
		label: "Gesamtbetrag *",
		aria: "Gesamtbetrag",
		placeholder: "0,00",
	},
	period: {
		label: "Leistungszeitraum",
		value: "01.01.–31.12.2026",
		placeholder: "tt.mm.–tt.mm.jjjj",
		group: "Leistungszeitraum übernehmen",
		no: "Nein",
		yes: "Ja",
		/** "Leistungszeitraum 01.01.–31.12.2026 übernommen" */
		taken: (period: string) => `Leistungszeitraum ${period} übernommen`,
		own: "Leistungszeitraum selbst eingeben",
	},
	scope: {
		label: "Umlage auf",
		options: ["Alle Mieter der Liegenschaft", "Einzelne Einheiten"],
	},
	purpose: {
		label: "Zweck *",
		aria: "Zweck",
		empty: "Bitte wählen",
		options: [
			"Brennstoffkosten Heizung",
			"Betriebsstrom Heizanlage",
			"Wartung Heizanlage",
			"Reinigung Heizanlage",
			"Schornsteinfeger / Abgasmessung",
			"Miete Messgeräte",
			"Ablesung und Abrechnung",
		],
	},
	again: "Neu scannen",
	save: "Speichern ✦",
	/** "2 Kostenarten übernommen · 4.684,29 €" */
	saved: (count: number, sum: string) =>
		`${count} Kostenarten übernommen · ${sum} €`,
	savedText: "In die Heizkostenabrechnung Lindenallee 12 übertragen",
};

export const automation = {
	kicker: "Heizkostenabrechnung",
	h2: "Von Anfang bis Ende automatisiert",
	note: "Beispieldaten",
	units: 36,
	readings: {
		property: "Lindenallee 12",
		units: "36 Einheiten",
		avatars: ["01", "02", "03"],
		button: "Zählerstände abrufen",
		busy: "Wird abgerufen …",
		again: "Erneut abrufen",
		/** "0 von 36 empfangen" */
		received: " von 36 empfangen",
		h3: "Verbräuche per Funk",
		text: "Alle Zählerstände aller Einheiten auf einmal. Kein Ablesetermin, kein Nachfassen.",
	},
	costs: {
		title: "Kostenarten",
		group: "Heizung",
		/** "2 zugeordnet" */
		assigned: (n: number) => `${n} zugeordnet`,
		suggestions: "Vorschläge aus DocuScan",
		inside: ["Brennstoff (Gas)", "Betriebsstrom"],
		outside: ["Wartung", "Reinigung", "Schornsteinfeger"],
		/** The chip the pointer demo adds. */
		demo: "Wartung",
		h3: "DocuScan ordnet zu",
		text: "Rechnungen werden gelesen und den Kostenarten der Heizkostenabrechnung zugeordnet. Mit einem Klick ändern Sie die Zuordnung.",
	},
	billing: {
		head: "Einheiten prüfen · 36",
		units: [
			{ n: "01", name: "WE 01 · Müller", sum: "612,40 €" },
			{ n: "02", name: "WE 02 · Schulz", sum: "548,15 €" },
			{ n: "03", name: "WE 03 · Yilmaz", sum: "701,90 €" },
		],
		button: "Abrechnungen erstellen",
		busy: "Wird erstellt …",
		done: "36 Abrechnungen erstellt ✓",
		finished: "Fertig",
		h3: "Abrechnung per Klick",
		text: "Ein Klick erstellt die Heizkostenabrechnung nach HKVO für jede Einheit.",
	},
};

export const dashboard = {
	title: "Heizkostenabrechnung 2026",
	property: "Lindenallee 12",
	totalLabel: "Gesamtkosten Heizung",
	/** 18.420,00 € (example data) */
	total: 18420,
	units: "Verteilt auf 36 Einheiten",
	h2: "Ihre Abrechnung. Jederzeit griffbereit.",
	text: "Kosten, Verteilung und Status jeder Heizkostenabrechnung im Heidi Dashboard. Für jede Liegenschaft, ohne Excel und ohne Nachfragen beim Messdienst.",
	// Hnv5z6cFcw3DyXPkw9nQx1
	link: { text: "Dashboard ansehen", href: ROUTE_DASHBOARD },
};

export const quote = {
	label: "Kundenstimme",
	/** The shared testimonial; the design's kicker above it. */
	key: "vitolus" as const,
	kicker: "VITOLUS",
};

export const more = {
	label: "Mehr von Heidi",
	uvi: {
		/** "Monatliche Verbrauchs&shy;information …" */
		h3: "Monatliche Verbrauchs­information für jeden Mieter.",
		text: "Ihre Mieter sehen ihren Verbrauch jeden Monat nach § 6a HeizkostenV. Weniger Überraschungen bei der Abrechnung.",
		// JjGPJV7zurEwiwEMn4hJv9
		link: { text: "Mehr zur uVI", href: ROUTE_VERBRAUCHSINFORMATION },
		phone: {
			title: "Ihr Verbrauch September",
			sub: "WE 04 · Heizung",
			label: "Letzter Monat",
			value: "131 kWh",
			compare: "8 % unter Durchschnitt",
			/** Bar heights; the last is the current month. */
			bars: [70, 52, 30, 22, 26, 44],
		},
	},
	erp: {
		/** "Direkt in Ihre Verwaltungs&shy;software." */
		h3: "Direkt in Ihre Verwaltungs­software.",
		text: "Abrechnungen und Verbrauchsdaten landen per Schnittstelle in Ihrem ERP- oder CRM-System. Kein Abtippen.",
		// KE95icU8eKWX7TNfLerbSZ
		link: { text: "Schnittstellen", href: ROUTE_SCHNITTSTELLEN },
		window: {
			title: "Abrechnungen 2026",
			created: "Erstellt",
			sent: "An Software übergeben",
			total: 48,
			head: ["Liegenschaft", "Einheiten", "Status"],
			/** `at`: the count at which the row is handed over. */
			rows: [
				{ name: "Lindenallee 12", units: "36", at: 36 },
				{ name: "Gartenweg 3", units: "12", at: 48 },
			],
			done: "Übergeben",
			busy: "Wird übertragen",
		},
	},
};

export const sample = {
	pill: "Musterabrechnung",
	h2: "So sieht die Abrechnung aus.",
	h2Muted: "Klar und verständlich.",
	lead: "Ein Beispiel mit Musterdaten: Die Abrechnung beginnt mit dem Wichtigsten und führt Mieter Schritt für Schritt zu den Details.",
	keys: [
		{
			title: "Absender, Empfänger, Liegenschaft",
			text: "Wer abrechnet, für wen und für welchen Zeitraum, auf einen Blick.",
		},
		{
			title: "Gesamtbetrag ganz oben",
			text: "Der Betrag steht vor allen Details, direkt auf der ersten Seite.",
		},
		{
			title: "Zugang zum Nutzerportal",
			text: "Mieter sehen dort ihre unterjährigen Verbrauchsinformationen.",
		},
		{
			title: "Alle Objekte zusammengefasst",
			text: "Jede berücksichtigte Liegenschaft ist aufgeführt.",
		},
	],
	paper: {
		label: "Muster einer Heizkostenabrechnung mit Beispieldaten",
		sender: "Heidi Systems GmbH · Monbijouplatz 4 · 10178 Berlin",
		recipient: ["Max Mustermann", "Musterstraße 12", "10115 Berlin"],
		logo: "Heidi",
		title: "Ihre Heidi Systems Abrechnung für Heizung, Warmwasser, Kaltwasser",
		subtitle: "Zusammenstellung Ihrer Kosten",
		meta: [
			[
				[
					"Erstellt im Auftrag von",
					"Muster Hausverwaltung GmbH\nBeispielweg 3, 10117 Berlin",
				],
				["Abrechnungszeitraum", "01.01.2025 – 31.12.2025"],
				["Ihr Nutzungszeitraum", "01.01.2025 – 31.12.2025"],
			],
			[
				["Erstellt am", "16.03.2026"],
				["Liegenschaft", "Musterstraße 12 u. a.\n10115 Berlin"],
				["Heidi Nutzernummer", "0010"],
			],
		],
		intro: [
			"Sehr geehrte Damen und Herren,",
			"wir haben die Kosten, die im vergangenen Abrechnungszeitraum angefallen sind, abgerechnet. Unsere Abrechnung ist auf den folgenden Seiten detailliert beschrieben.",
		],
		sum: { small: "Betrag", label: "Gesamtbetrag", value: "1.248,30 €" },
		notes: {
			title: "Beachten Sie bitte folgende Hinweise:",
			items: [
				"Bitte rechnen Sie Nachzahlungen oder Guthaben ausschließlich mit Ihrem Vermieter bzw. Ihrer Verwaltung ab.",
				"Allgemeine Hinweise und Informationen zur Abrechnung finden Sie in Ihrem Heidi Nutzerportal.",
			],
		},
		portal: {
			title: "Ihre persönlichen Zugangsdaten für das Heidi Nutzerportal",
			text: "Mit Heidi Systems bekommen Sie Zugriff auf die unterjährigen Verbrauchsinformationen, übersichtlich und monatlich.",
			credentials: [
				["Nutzer-ID: ", "MUSTER-0010"],
				["Sicherheitscode: ", "••••••"],
			],
			qr: "Beispiel",
		},
		objects: {
			title: "Folgende Objekte sind in dieser Abrechnung berücksichtigt:",
			items: [
				"10115 Berlin, Musterstraße 12",
				"10115 Berlin, Musterstraße 12A",
				"10115 Berlin, Musterstraße 12B",
				"10115 Berlin, Musterstraße 14",
				"10115 Berlin, Musterstraße 14A",
				"10115 Berlin, Musterstraße 16",
			],
		},
		stamp: "Musterabrechnung · Beispieldaten",
	},
};

/** The sample's QR code, row by row ("1" = dark), from the design's SVG. */
export const SAMPLE_QR = [
	"111111111100011111111",
	"100000100100101000001",
	"101110110001101011101",
	"101110111101011011101",
	"101110111001001011101",
	"100000101110111000001",
	"111111110011001111111",
	"011011000101001001101",
	"111111010111110010010",
	"100100010001111101110",
	"001110111000101111001",
	"011111111000000110100",
	"100000100000000011111",
	"000000100000101110100",
	"111111101000001110101",
	"100000111000100010100",
	"101110110001110101001",
	"101110100001001100111",
	"101110110100100011100",
	"100000111111010110110",
	"111111100000001000011",
];

export const steps = {
	h2: "Vier Schritte. Eine fertige Abrechnung.",
	items: [
		{
			icon: "radio",
			title: "Verbräuche per Funk",
			text: "Alle Zählerstände liegen monatlich vor. Kein Ablesetermin, keine fehlenden Werte.",
		},
		{
			icon: "sparkle",
			title: "Rechnungen per DocuScan",
			text: "Brennstoff-, Strom- und Wartungsrechnungen hochladen. DocuScan erkennt Kostenart, Datum und Betrag.",
		},
		{
			icon: "calc",
			title: "Verteilung nach HKVO",
			text: "Heidi verteilt die Kosten nach Heizkostenverordnung auf jede Einheit, inklusive CO₂-Kostenaufteilung.",
		},
		{
			icon: "doc",
			title: "Abrechnung auf Knopfdruck",
			text: "Ein Klick, und die Heizkostenabrechnung steht für jede Einheit. Auf Wunsch direkt in Ihrer Software.",
		},
	] satisfies {
		icon: "radio" | "sparkle" | "calc" | "doc";
		title: string;
		text: string;
	}[],
};

export const faq = {
	title: "Häufige Fragen",
	items: [
		{
			question: "Welche Rechnungen erkennt DocuScan?",
			answer:
				"Rechnungen, die für die Heizkostenabrechnung relevant sind, zum Beispiel für Brennstoff, Betriebsstrom oder Wartung. DocuScan schlägt die Kostenart vor, Sie prüfen und speichern.",
		},
		{
			question: "Muss ich die erkannten Werte prüfen?",
			answer:
				"Sie sehen jeden erkannten Wert neben dem Dokument und können ihn vor dem Speichern anpassen. Erst mit „Speichern“ werden die Werte übernommen.",
		},
		{
			question: "Wie schnell ist die Abrechnung fertig?",
			answer:
				"Sobald alle Rechnungen erfasst sind, entsteht die Heizkostenabrechnung per Klick. Die Verbräuche liegen per Funk ohnehin vor.",
		},
		{
			question: "Bis wann muss die Abrechnung beim Mieter sein?",
			answer:
				"Spätestens zwölf Monate nach Ende des Abrechnungszeitraums. Danach kann keine Nachzahlung mehr verlangt werden.",
		},
		{
			question: "Kann ich die Abrechnung auch selbst erstellen?",
			answer:
				"Ja. Mit der Selbstabrechnung liefert Heidi die Verbrauchsdaten, und Sie rechnen selbst ab.",
			// 8mPPRD6tVjMYFencN8YvWX
			more: { text: "Zur Selbstabrechnung", href: ROUTE_SELBSTABRECHNUNG },
		},
	] satisfies FaqItem[],
};

export const closing = {
	/** "Ihre nächste Heizkosten&shy;abrechnung. …" */
	h2: "Ihre nächste Heizkosten­abrechnung. Auf Knopfdruck.",
	text: "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.",
	button: {
		text: "Demo buchen",
		sub: "Mit Ihrem Ansprechpartner",
		href: DEMO_HREF,
	},
};
