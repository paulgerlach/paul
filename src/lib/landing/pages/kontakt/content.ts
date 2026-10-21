/**
 * Every text of /kontakt, word for word from the design
 * (https://claude.ai/artifact/2eHVk9HEFKh1F7pWbMnkWb). Components hold markup
 * and behaviour only.
 *
 * The mailboxes, the promises ("Ein fester Ansprechpartner", "Daten auf
 * Servern in Deutschland"), the form's texts and the FAQ need sign-off
 * before the cutover (go-live gate §4).
 */
import { LOGIN_URL } from "$lib/company";
import { DEMO_HREF } from "$lib/landing/cta";
import type { FaqItem } from "$lib/landing/faqJsonLd";
import type { MailboxKey } from "$lib/forms/contactInquiry";
import {
	ROUTE_DATENSCHUTZHINWEISE,
	ROUTE_HILFE,
	ROUTE_PARTNERSCHAFTEN,
} from "$lib/routes";

export const MAILBOXES: Record<MailboxKey, string> = {
	vertrieb: "vertrieb@heidisystems.com",
	info: "info@heidisystems.com",
	presse: "presse@heidisystems.com",
};

/** The form's section (the design's id); "Nachricht schreiben" leads here. */
export const FORM_ID = "schreiben";

/**
 * Every "Termin buchen" / "Demo buchen": the design's booking page
 * (44SBXKXJaSp6bvGMnbpZj6), /demo-buchen.
 */
export const BOOKING_HREF = DEMO_HREF;

const mailto = (key: MailboxKey) => `mailto:${MAILBOXES[key]}`;

export type Link = { text: string; href?: string };

export const hero = {
	pill: "Kontakt",
	h1: "Sprechen Sie mit uns.",
	h1Accent: "Persönlich und direkt.",
	lead: "Ob Angebot, Wechsel, laufender Vertrag oder Partnerschaft: Schreiben Sie uns oder buchen Sie direkt einen Termin. Ihr persönlicher Ansprechpartner meldet sich bei Ihnen.",
	write: { text: "Nachricht schreiben", href: `#${FORM_ID}` },
	book: { text: "Termin buchen", href: BOOKING_HREF },
	ticks: [
		"Ein fester Ansprechpartner",
		"Antwort per E-Mail",
		"Daten auf Servern in Deutschland",
	],
	photoAlt: "Das Heidi-Team im Gespräch",
	/** The card over the photo. */
	mailboxes: [
		{ label: "Vertrieb und Angebote", key: "vertrieb" },
		{ label: "Allgemeine Fragen", key: "info" },
		{ label: "Presse", key: "presse" },
	] satisfies { label: string; key: MailboxKey }[],
};

export type Way = {
	icon: "doc" | "calendar" | "info" | "plug";
	title: string;
	text: string;
	links: Link[];
};

export const ways = {
	pill: "Ihr Anliegen",
	h2: "Der kürzeste Weg zu uns.",
	h2Accent: "Je nachdem, worum es geht.",
	items: [
		{
			icon: "doc",
			title: "Angebot und Wechsel",
			text: "Sie möchten zu Heidi wechseln oder Ihren Bestand ausstatten? Wir erstellen Ihnen ein Angebot.",
			links: [
				{ text: MAILBOXES.vertrieb, href: mailto("vertrieb") },
				// The "Self-Service" design (42U8uYryb6qXPWKZCWgkaZ) isn't built:
				// hidden until its page exists.
				{ text: "Selbst erfassen im Self-Service →" },
			],
		},
		{
			icon: "calendar",
			title: "Termin vereinbaren",
			text: "Lernen Sie Heidi in einer persönlichen Demo kennen. Sie wählen den Termin, der Ihnen passt.",
			links: [{ text: "Demo buchen →", href: BOOKING_HREF }],
		},
		{
			icon: "info",
			title: "Fragen als Kunde",
			text: "Antworten auf häufige Fragen zu Ablesung, Abrechnung und Mieterportal finden Sie im Hilfe-Center.",
			links: [
				{ text: "Zum Hilfe-Center →", href: ROUTE_HILFE },
				{ text: MAILBOXES.info, href: mailto("info") },
			],
		},
		{
			icon: "plug",
			title: "Partner und Presse",
			text: "Für Softwareanbieter, Installationsbetriebe, Verbände und Journalistinnen und Journalisten.",
			links: [
				{ text: "Partnerschaften →", href: ROUTE_PARTNERSCHAFTEN },
				{ text: MAILBOXES.presse, href: mailto("presse") },
			],
		},
	] satisfies Way[],
};

export const write = {
	pill: "Nachricht",
	h2: "Schreiben Sie uns.",
	h2Accent: "Wir melden uns persönlich.",
	steps: [
		{
			title: "Sie schildern Ihr Anliegen",
			text: "Ein paar Zeilen genügen. Je genauer, desto gezielter können wir antworten.",
		},
		{
			title: "Die richtige Person übernimmt",
			text: "Ihre Nachricht geht direkt an das passende Team bei Heidi.",
		},
		{
			title: "Wir melden uns bei Ihnen",
			text: "Per E-Mail oder, wenn Sie möchten, telefonisch.",
		},
	],
	alt: {
		title: "Lieber direkt sprechen?",
		link: { text: "Buchen Sie einen Termin", href: BOOKING_HREF },
		after: " mit Ihrem persönlichen Ansprechpartner.",
	},
	avatarAlt: "Heidi-Team",
};

export const form = {
	label: "Kontaktformular",
	title: "Ihre Nachricht an Heidi",
	sub: "Direkt an unser Team, Antwort per E-Mail oder Telefon",
	topic: "Worum geht es?",
	fields: {
		firstName: { label: "Vorname*" },
		lastName: { label: "Nachname*" },
		email: { label: "E-Mail*", placeholder: "name@ihre-verwaltung.de" },
		phone: { label: "Telefon", placeholder: "Für Rückfragen" },
		company: {
			label: "Unternehmen",
			placeholder: "z. B. Muster Hausverwaltung GmbH",
		},
		units: { label: "Anzahl Einheiten", placeholder: "z. B. 120" },
		message: {
			label: "Ihre Nachricht*",
			placeholder: "Wie können wir Ihnen helfen?",
		},
	},
	optional: "(optional)",
	consent: {
		before:
			"Ich bin einverstanden, dass Heidi Systems meine Angaben zur Bearbeitung meiner Anfrage verarbeitet. Details in der ",
		link: { text: "Datenschutzerklärung", href: ROUTE_DATENSCHUTZHINWEISE },
		after: ".",
	},
	submit: "Nachricht senden",
	sending: "Wird gesendet …",
	missing: "Bitte füllen Sie die markierten Felder aus.",
	noConsent: "Bitte bestätigen Sie die Einwilligung.",
	/** A failed send: the text, then the topic's mailbox as a link. */
	sendError:
		"Das hat gerade nicht geklappt. Bitte versuchen Sie es noch einmal oder schreiben Sie uns direkt an",
	note: "Ihre Angaben nutzen wir nur für Ihre Anfrage.",
	done: {
		h: "Nachricht gesendet.",
		/** The design's line, in parts around the email in bold. */
		text: (firstName: string) =>
			`Danke, ${firstName}. Ihre Nachricht ist bei unserem Team angekommen. Wir melden uns bei Ihnen unter `,
		phone: " oder telefonisch",
		again: "Weitere Nachricht schreiben",
		mail: "Zusätzlich per E-Mail senden",
	},
};

export const faq: { title: string; items: FaqItem[] } = {
	title: "Häufige Fragen",
	items: [
		{
			question: "Ich bin bereits Kunde. Wo melde ich mich an?",
			// The design's "Heidi-Dashboard" (7GU4n9bk3hAvPSSXCEMZZu) is where
			// customers log in: the platform.
			answer: `Im <a href="${LOGIN_URL}">Heidi-Dashboard</a>. Antworten auf häufige Fragen finden Sie im <a href="${ROUTE_HILFE}">Hilfe-Center</a>.`,
		},
		{
			question: "Kann ich auch ohne Gespräch ein Angebot bekommen?",
			// The "Self-Service" link (42U8uYryb6qXPWKZCWgkaZ) waits for its page.
			answer:
				"Ja. Im Self-Service erfassen Sie Ihren Zählerbedarf selbst und erhalten direkt ein Angebot als PDF.",
		},
		{
			question: "Unser Vertrag mit dem bisherigen Messdienst läuft noch.",
			answer:
				"Kein Problem. Heidi kann vorhandene Zähler übernehmen und auswerten, egal wie lange Ihr bisheriger Vertrag noch läuft.",
		},
		{
			question: "Ich bin Mieterin oder Mieter. An wen wende ich mich?",
			answer: `Bitte wenden Sie sich zuerst an Ihre Hausverwaltung oder Ihren Vermieter. Für Fragen zum Mieterportal hilft das <a href="${ROUTE_HILFE}">Hilfe-Center</a>.`,
		},
	],
};

export const closing = {
	h2: "Lieber gleich einen Termin?",
	text: "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.",
	button: {
		text: "Demo buchen",
		sub: "Mit Ihrem Ansprechpartner",
		href: BOOKING_HREF,
	},
};
