/**
 * Every text of /hilfe ("Hilfe-Center"), word for word from the design.
 * Components hold markup and behaviour only.
 *
 * The articles live here: adding a question is a change to `topics`. The
 * topic cards' counts, the search strings and the feedback form's question
 * ids are derived from it. Question ids end up in URLs (`#q-<id>`), so they
 * are lowercase ASCII and never change once live.
 *
 * Answers are plain text: the search, the FAQ JSON-LD and the page read the
 * same string. A `more` link without `href` points to a page that doesn't
 * exist yet and renders nothing; when the page exists, its `href` is the only
 * change (plan 01 §1.3).
 *
 * The legal statements, the company claims and the expired deadline answer
 * need sign-off before go-live (plan §4.5).
 */
import { isExpired } from "$lib/landing/deadline/deadline";
import {
	ROUTE_DASHBOARD,
	ROUTE_FUNKTIONEN,
	ROUTE_KONTAKT,
	ROUTE_SELBSTABRECHNUNG,
	ROUTE_SICHERHEIT,
	ROUTE_UEBER_UNS,
	ROUTE_UPGRADE_NOW,
} from "$lib/routes";
import type { IconName } from "./icons";

export type Question = {
	id: string;
	question: string;
	answer: string;
	/** The answer from the retrofit deadline on (only where it turns false). */
	answerExpired?: string;
	more?: { text: string; href?: string };
};

export type Topic = {
	id: string;
	title: string;
	/** The topic card's subline. */
	sub: string;
	icon: IconName;
	questions: Question[];
};

export const hero = {
	pill: "Hilfe-Center",
	/** H1: text + the green `<em>` part. */
	h1: { text: "Wie können wir", em: "helfen?" },
	lead: "Antworten zu Wechsel, Montage, Ablesung und Heizkostenabrechnung.",
	search: {
		placeholder: "Frage eingeben, z. B. „Vertrag läuft noch“",
		label: "Hilfe-Center durchsuchen",
		/** Visually hidden; the submit for visitors without JS. */
		submit: "Suchen",
	},
};

export const popular = {
	label: "Häufig gesucht:",
	/** The links' text is the question itself. */
	ids: ["laufender-vertrag", "installation-kosten", "uvi", "abrechnung-frist"],
};

export const results = {
	text: (count: number, query: string) =>
		`${count} ${count === 1 ? "Ergebnis" : "Ergebnisse"} für „${query}“`,
};

export const toc = { label: "Themen" };

export const articlesText = (count: number) => `${count} Artikel`;

export const topics: Topic[] = [
	{
		id: "wechsel",
		title: "Wechsel & Vertrag",
		sub: "Kündigung, Vollmacht, laufende Verträge",
		icon: "swap",
		questions: [
			{
				id: "laufender-vertrag",
				question: "Kann ich wechseln, obwohl mein Vertrag noch läuft?",
				answer:
					"Ja. Heidi übernimmt bestehende Zähler und wertet sie sofort aus, unabhängig davon, wie lange der bisherige Vertrag noch läuft.",
			},
			{
				id: "kuendigung",
				question: "Wer kündigt beim bisherigen Messdienst?",
				answer:
					"Auf Wunsch Heidi. Mit einer Vollmacht kündigen wir fristgerecht in Ihrem Namen. Alternativ erstellen Sie die Kündigung selbst mit unserer Vorlage.",
				more: { text: "Muster-Kündigung" },
			},
			{
				id: "vertragsende",
				question: "Woher weiß ich, wann meine Verträge enden?",
				answer:
					"Der kostenlose Portfolio-Checker prüft die Vertragsenden in Ihrem ganzen Bestand und zeigt, wann Sie handeln sollten.",
				more: { text: "Portfolio-Checker" },
			},
			{
				id: "ab-wie-vielen-einheiten",
				question: "Ab wie vielen Einheiten lohnt sich Heidi?",
				answer:
					"Heidi arbeitet schon ab zwei Wohneinheiten. Für Bestände mit mehr als 1.000 Einheiten erstellen wir ein individuelles Angebot.",
			},
		],
	},
	{
		id: "montage",
		title: "Montage & Geräte",
		sub: "Termine, Funkzähler, Fernablesbarkeit",
		icon: "tool",
		questions: [
			{
				id: "installation-kosten",
				question: "Was kostet die Installation?",
				answer:
					"Nichts. Die Installation der Funkzähler ist kostenlos. Abgerechnet wird pro tatsächlich installiertem Zähler plus Abrechnungspauschale.",
			},
			{
				id: "mieter-information",
				question: "Wie werden meine Mieter informiert?",
				answer:
					"Heidi informiert Ihre Mieter 14 Tage vor der Montage. Am Termin gibt es ein Zeitfenster von 1 bis 2 Stunden.",
			},
			{
				id: "mieter-nicht-da",
				question: "Was passiert, wenn ein Mieter nicht da ist?",
				answer:
					"92 % der Montagen gelingen beim ersten Termin. Für die übrigen vereinbaren wir einen neuen Termin direkt mit dem Mieter.",
			},
			{
				id: "fernablesbar-frist",
				question: "Bis wann müssen Zähler fernablesbar sein?",
				answer:
					"Bestehende Zähler und Heizkostenverteiler müssen bis zum 31. Dezember 2026 fernablesbar sein. Heidi baut ausschließlich fernablesbare Funkzähler ein.",
				// Draft for the content owner (plan §4.5).
				answerExpired:
					"Seit dem 1. Januar 2027 müssen Zähler und Heizkostenverteiler fernablesbar sein. Heidi baut ausschließlich fernablesbare Funkzähler ein und rüstet Ihren Bestand um.",
				more: { text: "Jetzt noch umrüsten", href: ROUTE_UPGRADE_NOW },
			},
		],
	},
	{
		id: "ablesung",
		title: "Ablesung & uVI",
		sub: "Funk, monatliche Verbrauchsinformation",
		icon: "signal",
		questions: [
			{
				id: "ablesung-wohnung",
				question: "Muss jemand zur Ablesung in die Wohnung?",
				answer:
					"Nein. Die Funkzähler übertragen ihre Werte aus der Ferne. Es gibt keinen Ablesetermin in der Wohnung.",
			},
			{
				id: "uvi",
				question: "Was ist die unterjährige Verbrauchsinformation (uVI)?",
				answer:
					"Mieter mit fernablesbaren Zählern müssen jeden Monat über ihren Verbrauch informiert werden (§ 6a HeizkostenV). Heidi stellt die uVI automatisch bereit.",
				more: { text: "Mehr zur uVI", href: ROUTE_FUNKTIONEN },
			},
			{
				id: "uvi-fehlt",
				question: "Was passiert, wenn die uVI fehlt?",
				answer:
					"Mieter dürfen ihren Anteil an den Heizkosten dann um 3 % kürzen (§ 12 HeizkostenV). Mit Heidi ist jede Information dokumentiert.",
			},
			{
				id: "verbraeuche-sehen",
				question: "Wie oft sehe ich die Verbräuche?",
				answer:
					"Monatlich. Im Heidi Dashboard sehen Sie die Verbräuche aller Liegenschaften und erkennen Auffälligkeiten früh.",
				more: { text: "Dashboard ansehen", href: ROUTE_DASHBOARD },
			},
		],
	},
	{
		id: "abrechnung",
		title: "Heizkostenabrechnung",
		sub: "Erstellung, Fristen, Nachfragen",
		icon: "file",
		questions: [
			{
				id: "abrechnung-entstehung",
				question: "Wie entsteht die Heizkostenabrechnung?",
				answer:
					"Alle Verbräuche liegen per Funk vor. Die Heizkostenabrechnung nach HKVO entsteht per Klick, für jede Einheit einzeln. Rechnungen liest DocuScan automatisch aus.",
				more: { text: "Heizkostenabrechnung", href: ROUTE_FUNKTIONEN },
			},
			{
				id: "abrechnung-frist",
				question: "Bis wann muss die Abrechnung beim Mieter sein?",
				answer:
					"Spätestens zwölf Monate nach Ende des Abrechnungszeitraums. Danach kann keine Nachzahlung mehr verlangt werden.",
			},
			{
				id: "selbst-abrechnen",
				question: "Kann ich selbst abrechnen?",
				answer:
					"Ja. Mit der Selbstabrechnung liefert Heidi die Verbrauchsdaten, und Sie erstellen die Abrechnung selbst.",
				more: { text: "Selbstabrechnung", href: ROUTE_SELBSTABRECHNUNG },
			},
			{
				id: "abrechnung-pruefen",
				question: "Kann Heidi eine bestehende Abrechnung prüfen?",
				answer:
					"Ja. Mit dem kostenlosen Heizkostenabrechnungs-Checker prüfen Sie eine vorhandene Abrechnung.",
				more: { text: "Abrechnung prüfen" },
			},
		],
	},
	{
		id: "software",
		title: "Dashboard & Schnittstellen",
		sub: "ERP, CRM, Datenübergabe",
		icon: "server",
		questions: [
			{
				id: "zweite-software",
				question: "Muss ich eine zweite Software pflegen?",
				answer:
					"Nein. Heidi ist an Ihr ERP- oder CRM-System angebunden. Verbrauchsdaten und Abrechnungen landen direkt dort.",
				more: { text: "Schnittstellen" },
			},
			{
				id: "dashboard",
				question: "Was zeigt das Heidi Dashboard?",
				answer:
					"Verbräuche, Kosten und Benachrichtigungen aller Objekte auf einer Plattform, dazu den Status jeder Liegenschaft.",
				more: { text: "Dashboard ansehen", href: ROUTE_DASHBOARD },
			},
			{
				id: "datenverarbeitung",
				question: "Wo werden meine Daten verarbeitet?",
				answer:
					"Heidi verarbeitet die Daten von Ihnen und Ihren Mietern nach DSGVO und BDSG und speichert alle Daten auf Servern in Deutschland.",
				more: { text: "Sicherheit & Datenschutz", href: ROUTE_SICHERHEIT },
			},
		],
	},
	{
		id: "mieter",
		title: "Für Mieter",
		sub: "Fragen zur eigenen Abrechnung",
		icon: "users",
		questions: [
			{
				id: "mieter-verbrauch",
				question: "Ich bin Mieter. Wo sehe ich meinen Verbrauch?",
				answer:
					"Ihre Hausverwaltung stellt Ihnen die monatliche Verbrauchsinformation bereit. Bei Fragen dazu wenden Sie sich an Ihre Verwaltung.",
			},
			{
				id: "mieter-abrechnung-pruefen",
				question: "Wie prüfe ich meine Heizkostenabrechnung?",
				answer:
					"Mit dem kostenlosen Mieter-Check laden Sie Ihre Abrechnung hoch und sehen, ob ein Anspruch auf Kürzung bestehen könnte.",
				more: { text: "Zum Mieter-Check" },
			},
			{
				id: "monteure",
				question: "Wann kommen die Monteure?",
				answer:
					"Sie werden 14 Tage vor der Montage informiert. Am Termin gibt es ein Zeitfenster von 1 bis 2 Stunden.",
			},
		],
	},
];

/** Every question id, in page order: the feedback form's contract. */
export const QUESTION_IDS = topics.flatMap((topic) =>
	topic.questions.map((question) => question.id),
);

/**
 * The topics with each question's current answer (the expired variant from
 * the retrofit deadline on). The search, the JSON-LD and the sections all
 * read this, so they can't disagree.
 */
export function resolveTopics(now: number): Topic[] {
	const expired = isExpired(now);
	return topics.map((topic) => ({
		...topic,
		questions: topic.questions.map(({ answerExpired, ...question }) => ({
			...question,
			answer: expired && answerExpired ? answerExpired : question.answer,
		})),
	}));
}

export const feedback = {
	label: "War das hilfreich?",
	yes: "Ja",
	no: "Nein",
	thanks: "Danke für Ihr Feedback!",
};

export const noResults = {
	title: "Keine passende Antwort gefunden.",
	text: "Schreiben Sie uns, Ihr Ansprechpartner hilft gern weiter.",
	cta: { text: "Kontakt aufnehmen", href: ROUTE_KONTAKT },
};

export const endCta = {
	title: "Frage nicht dabei? Ihr Ansprechpartner hilft persönlich.",
	cta: { text: "Gespräch vereinbaren", href: ROUTE_KONTAKT },
};

export const trustMore = { text: "Mehr über Heidi", href: ROUTE_UEBER_UNS };
