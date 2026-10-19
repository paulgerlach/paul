/**
 * Texts of /muster-kuendigung, word for word from the design
 * (https://claude.ai/artifact/4WYU5hjVsWSLrxuo7wsdm6): the page, the form's
 * fields and clauses, and the letter's sentences (`letter.ts` puts them
 * together). The letter, the checklist and the FAQ await legal sign-off
 * (plan §4.4).
 */
import { DEMO_HREF } from "$lib/landing/cta";
import type { FaqItem } from "$lib/landing/faqJsonLd";
import type { SplitHeading } from "$lib/landing/types";
import { ROUTE_MESSDIENSTWECHSEL, ROUTE_PORTFOLIO_CHECKER } from "$lib/routes";

/** The generator's section, the target of "Kündigung erstellen ↓". */
export const GENERATOR_ID = "vorlage";

export const hero = {
	pill: "Muster-Kündigung · kostenlos",
	h1: "Messdienst kündigen.",
	h1Accent: "In zwei Minuten.",
	lead: "Füllen Sie ein paar Felder aus, und Sie bekommen eine fertige Kündigung für Ihren bisherigen Messdienstleister. Als Word-Datei oder PDF, zum Unterschreiben und Versenden.",
	create: { text: "Kündigung erstellen", href: `#${GENERATOR_ID}` },
	// JMrh8PhRG78mcMBK2LDkbS ("Heidi Anbieterwechsel")
	takeover: { text: "Heidi kündigt für Sie", href: ROUTE_MESSDIENSTWECHSEL },
	ticks: ["Word und PDF", "Mehrere Liegenschaften", "Ohne Anmeldung"],
	sheetTitle: "Kündigung des Messdienstvertrags",
	badges: ["DOCX", "PDF"],
};

/** The form's text fields, in the order `letter.ts` reads them. */
export const FIELD_KEYS = [
	"sName",
	"sStr",
	"sOrt",
	"sPers",
	"sFunk",
	"mName",
	"mAdr",
	"mNr",
	"lieg",
	"datum",
] as const;
export type FieldKey = (typeof FIELD_KEYS)[number];

export const CLAUSE_KEYS = [
	"ende",
	"ablesung",
	"geraete",
	"vollmacht",
	"daten",
] as const;
export type ClauseKey = (typeof CLAUSE_KEYS)[number];

export type Field = {
	key: Exclude<FieldKey, "datum">;
	label: string;
	placeholder: string;
	optional?: boolean;
	/** Small text after the label ("eine pro Zeile"). */
	hint?: string;
	multiline?: boolean;
};

export type Term = "next" | "date";

export const generator = {
	pill: "Vorlage ausfüllen",
	h2: { text: "Ihre Kündigung. ", muted: "Live in der Vorschau." },
	optional: "optional",
	sender: {
		legend: "Absender",
		fields: [
			{
				key: "sName",
				label: "Hausverwaltung oder Eigentümer",
				placeholder: "Muster Hausverwaltung GmbH",
			},
			{
				key: "sStr",
				label: "Straße und Hausnummer",
				placeholder: "Beispielstraße 1",
			},
			{ key: "sOrt", label: "PLZ und Ort", placeholder: "10115 Berlin" },
		],
		// Side by side (.kd-2)
		pair: [
			{
				key: "sPers",
				label: "Ansprechpartner",
				placeholder: "Vor- und Nachname",
			},
			{
				key: "sFunk",
				label: "Funktion",
				placeholder: "Geschäftsführung",
				optional: true,
			},
		],
	},
	provider: {
		legend: "Bisheriger Messdienst",
		fields: [
			{
				key: "mName",
				label: "Name des Messdienstleisters",
				placeholder: "Name des Unternehmens",
			},
			{ key: "mAdr", label: "Anschrift", placeholder: "Straße, PLZ Ort" },
			{
				key: "mNr",
				label: "Vertrags- oder Kundennummer",
				placeholder: "z. B. 12345678",
				optional: true,
			},
		],
	},
	properties: {
		legend: "Liegenschaften und Termin",
		field: {
			key: "lieg",
			label: "Liegenschaften",
			hint: "eine pro Zeile",
			placeholder: "Lindenallee 12, 10115 Berlin",
			multiline: true,
		},
		termLabel: "Kündigungstermin",
		terms: [
			{ value: "next", label: "Zum nächstmöglichen Zeitpunkt" },
			{ value: "date", label: "Zu einem Datum" },
		],
		dateLabel: "Kündigen zum",
	},
	clauses: {
		legend: "Was soll noch rein?",
		items: [
			{
				key: "ende",
				title: "Vertragsende bestätigen lassen",
				text: "Eingang und genaues Vertragsende schriftlich",
				checked: true,
			},
			{
				key: "ablesung",
				title: "Ablesung zum Vertragsende",
				text: "Werte aller Geräte zum Stichtag anfordern",
				checked: true,
			},
			{
				key: "geraete",
				title: "Geräte klären",
				text: "Gemietet oder gekauft, Abbau abstimmen",
				checked: true,
			},
			{
				key: "vollmacht",
				title: "Im Auftrag der Eigentümer",
				text: "Hinweis, dass die Verwaltung bevollmächtigt handelt",
				checked: false,
			},
			{
				key: "daten",
				title: "Datenlöschung",
				text: "Löschung nach Vertragsende, soweit zulässig",
				checked: false,
			},
		] satisfies {
			key: ClauseKey;
			title: string;
			text: string;
			checked: boolean;
		}[],
	},
	// Ours: the preview's accessible name (the design has none).
	previewLabel: "Vorschau der Kündigung",
	signature: "Unterschrift",
	buttons: {
		docx: "Word herunterladen",
		pdf: "PDF",
		copy: "Text kopieren",
		busy: "Wird erstellt …",
		copied: "Kopiert",
	},
	messages: {
		started: "Download gestartet: ",
		failed:
			"Der Download ist hier gerade nicht möglich. Nutzen Sie „Text kopieren“ und fügen Sie ihn in Ihre Textverarbeitung ein.",
		copyFailed:
			"Kopieren nicht möglich. Markieren Sie den Text in der Vorschau.",
	},
	legal:
		"Vorlage ohne Gewähr, keine Rechtsberatung. Prüfen Sie Laufzeit, Kündigungsfrist und Form in Ihrem Vertrag.",
} satisfies {
	pill: string;
	h2: SplitHeading;
	sender: { legend: string; fields: Field[]; pair: Field[] };
	provider: { legend: string; fields: Field[] };
	properties: {
		legend: string;
		field: Field;
		termLabel: string;
		terms: { value: Term; label: string }[];
		dateLabel: string;
	};
	[key: string]: unknown;
};

/** The letter's sentences and placeholders (the design's `build()`). */
export const letterText = {
	subject: "Kündigung des Messdienstvertrags",
	contractNo: " · Vertrags-/Kundennr. ",
	property: "Liegenschaft",
	properties: "Liegenschaften",
	salutation: "Sehr geehrte Damen und Herren,",
	termination:
		"hiermit kündigen wir den bestehenden Vertrag über Messdienstleistungen (insbesondere Ablesung, Abrechnung sowie Miete und Wartung der Messgeräte) für die oben genannte",
	/** The termination sentence's ending for one / several properties. */
	terminationOne: " Liegenschaft ",
	terminationMany: "n Liegenschaften ",
	next: "fristgerecht zum nächstmöglichen Zeitpunkt",
	on: "zum ",
	clauses: {
		vollmacht:
			"Wir handeln als Verwaltung im Namen und im Auftrag der Eigentümer. Eine entsprechende Vollmacht reichen wir auf Wunsch nach.",
		ende: "Bitte bestätigen Sie uns den Eingang dieser Kündigung und das genaue Vertragsende schriftlich.",
		ablesung:
			"Zum Vertragsende bitten wir um eine Ablesung aller Geräte und die Übermittlung der Werte, damit die Abrechnung für den laufenden Zeitraum vollständig erstellt werden kann.",
		geraete:
			"Bitte teilen Sie uns mit, ob die installierten Geräte gemietet oder gekauft wurden, und stimmen Sie einen etwaigen Abbau rechtzeitig mit uns ab.",
		daten:
			"Bitte löschen Sie die im Rahmen des Vertrags gespeicherten personenbezogenen Daten nach Vertragsende, soweit keine gesetzlichen Aufbewahrungspflichten entgegenstehen.",
	} satisfies Record<ClauseKey, string>,
	closing: "Mit freundlichen Grüßen",
	placeholders: {
		sName: "Name der Verwaltung",
		sStr: "Straße, Hausnummer",
		sOrt: "PLZ Ort",
		mName: "Name des Messdienstleisters",
		mAdr: "Anschrift",
		place: "Ort",
		lieg: "Adresse der Liegenschaft",
		datum: "Datum",
		sPers: "Vor- und Nachname",
	},
	/** The file name's stem when the provider field is empty. */
	fileFallback: "Messdienst",
};

export const checklist = {
	pill: "Vor dem Versand",
	h2: {
		text: "Vier Dinge, die Sie prüfen sollten. ",
		muted: "Bevor Sie unterschreiben.",
	} satisfies SplitHeading,
	items: [
		{
			title: "Laufzeit und Frist",
			text: "Viele Messdienstverträge verlängern sich automatisch, wenn die Kündigungsfrist verpasst wird. Das genaue Datum steht im Vertrag.",
		},
		{
			title: "Mehrere Verträge?",
			text: "Ablesung, Abrechnung und Gerätemiete können in getrennten Verträgen geregelt sein. Kündigen Sie jeden einzeln.",
		},
		{
			title: "Form und Versand",
			text: "Halten Sie die vereinbarte Form ein und versenden Sie nachweisbar, etwa per Einschreiben mit Rückschein.",
		},
		{
			title: "Vollmacht bei WEG",
			text: "Kündigt die Verwaltung für eine Eigentümergemeinschaft, sollte ein Beschluss oder eine Vollmacht vorliegen.",
		},
	],
	count: "{n} von {total} geprüft",
	done: "Alles geprüft. Bereit zum Versand.",
};

export const takeover = {
	pill: "Noch einfacher",
	h2: "Oder Heidi kündigt für Sie.",
	text: "Eine Unterschrift auf der Vollmacht genügt. Heidi kündigt beim bisherigen Messdienst, plant die Montage und informiert die Mieter. Bestehende Zähler werten wir sofort aus, auch wenn Ihr Vertrag noch läuft.",
	// 44SBXKXJaSp6bvGMnbpZj6 ("Demo buchen"): the closing form here.
	demo: { text: "Demo buchen", href: DEMO_HREF },
	// UFviBtC2mkneFNeWnfHAWp (the Portfolio-Checker)
	check: { text: "Vertragsenden prüfen", href: ROUTE_PORTFOLIO_CHECKER } as {
		text: string;
		href?: string;
	},
	steps: [
		{
			title: "Vollmacht unterschreiben",
			text: "Einmal, für alle Liegenschaften",
		},
		{
			title: "Heidi kündigt fristgerecht",
			text: "Und behält das Vertragsende im Blick",
		},
		{
			title: "Wechsel ohne Lücke",
			text: "Bestehende Zähler werden sofort ausgewertet",
		},
	],
};

export const faq = {
	title: "Häufige Fragen zur Kündigung",
	items: [
		{
			question:
				"Muss ich bis zum Vertragsende warten, um zu Heidi zu wechseln?",
			answer:
				"Nein. Heidi kann bestehende Zähler übernehmen und sofort auswerten, egal wie lange Ihr aktueller Vertrag noch läuft.",
		},
		{
			question: "Wo finde ich meine Kündigungsfrist?",
			answer:
				"Im Vertrag mit Ihrem Messdienstleister, oft unter Laufzeit oder Vertragsdauer. Mit dem Portfolio-Checker sehen Sie die Vertragsenden aller Liegenschaften auf einen Blick.",
		},
		{
			question: "Was passiert mit den installierten Geräten?",
			answer:
				"Das hängt davon ab, ob die Geräte gemietet oder gekauft wurden. Die Vorlage fragt das beim Messdienst ab. Beim Wechsel zu Heidi stimmen wir Austausch und Abbau mit Ihnen ab.",
		},
		{
			question: "Werden meine Eingaben gespeichert?",
			answer:
				"Nein. Das Schreiben entsteht direkt in Ihrem Browser. Diese Seite speichert und versendet nichts.",
		},
	] satisfies FaqItem[],
};

export const closing = {
	h2: "Lieber gar nicht selbst kündigen?",
	text: "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.",
	submitLabel: "Demo buchen",
};
