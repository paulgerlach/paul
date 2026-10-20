/**
 * Every text and the example data of /partnerschaften, word for word from
 * the design, in the shapes of the shared `uv` template and the shared
 * partner section. Components hold markup and behaviour only.
 *
 * The partnerships as described, the memberships, the data-protection
 * statements, the company claims, both forms' texts and options, and the
 * example data need sign-off before the cutover (plan §4.4).
 */
import { PHONE, PHONE_HREF } from "$lib/components/Header/navGroups";
import type { Testimonial } from "$lib/landing/data/testimonials";
import type { FaqItem } from "$lib/landing/faqJsonLd";
import type {
	ApplyContent,
	FormTexts,
} from "$lib/landing/sections/partner/types";
import type {
	AppNavItem,
	BillTile,
	CalendarTile,
	DocTile,
	Figure,
	Link,
	ListEntry,
	PhoneTile,
	Row,
} from "$lib/landing/sections/uv/types";
import {
	ROUTE_API_DOKUMENTATION,
	ROUTE_INSTALLATIONSPARTNER,
	ROUTE_NACHFOLGE,
	ROUTE_SICHERHEIT,
	ROUTE_SOFTWAREPARTNER,
} from "$lib/routes";

/** The contact form's section (the design's id). */
export const APPLY_ID = "kontakt";
/**
 * Every CTA to the form: the design's "Partnerschaft anfragen" and also its
 * "Demo buchen" and "Erstgespräch vereinbaren", which point at the
 * demo-booking design (plan, open question 1).
 */
export const KONTAKT_HREF = `#${APPLY_ID}`;
/** The first audience card with the form "Anbindung anfragen" (no-JS posts land here). */
export const CONNECTION_ID = "anbindung";

export const hero = {
	srTitle: "Partnerschaften mit Heidi Systems",
	word: "Partnerschaften",
	/** The design's #ipf-css, as on the other partner pages. */
	wordSize: "clamp(34px, 8.6vw, 130px)",
	lead: "Sie haben ein Produkt, ein Netzwerk oder eine Idee, die zu Heidi passt? Lassen Sie uns zusammenarbeiten.",
	primary: { text: "Kontakt aufnehmen", href: KONTAKT_HREF } satisfies Link,
	secondary: { text: "Mehr erfahren", href: "#inhalt" } satisfies Link,
};

/** The hero's app window: the four kinds of partner. */
export const list = {
	label: "Beispiel: Heidi Dashboard",
	brand: "Heidi",
	nav: [
		{ icon: "users", text: "Partner" },
		{ icon: "doc", text: "Dokumente" },
		{ icon: "users", text: "Kontakt" },
	] satisfies AppNavItem[] as AppNavItem[],
	navFoot: "Heidi Dashboard",
	head: "Heidi Partner",
	tag: "Beispieldaten",
	title: "Gemeinsam mit Heidi",
	sub: "Partnerschaften · Beispiel",
	entries: [
		{
			icon: "plug",
			title: "Softwareanbieter",
			sub: "Schnittstelle nach bved-Standard",
			before: "In Abstimmung",
			after: "Verbunden",
		},
		{
			icon: "tool",
			title: "Installationsbetriebe",
			sub: "Geschult und zertifiziert",
			before: "In Schulung",
			after: "Zertifiziert",
		},
		{
			icon: "users",
			title: "Verbände und Netzwerke",
			sub: "VDIV und DEUMESS",
			before: "Im Austausch",
			after: "Vernetzt",
		},
		{
			icon: "building",
			title: "Messdienstanbieter",
			sub: "Nachfolge und Zusammenarbeit",
			before: "Im Gespräch",
			after: "Vereinbart",
		},
	] satisfies ListEntry[] as ListEntry[],
};

export const statement = {
	label: "Worum es geht",
	text: "Heidi macht den Messdienst einfacher, und das schaffen wir nicht allein. Wir arbeiten mit Softwareanbietern, Installationsbetrieben, Verbänden und Messdienstanbietern zusammen. Wenn Sie eine Idee haben, die zu uns passt, melden Sie sich.",
};

export type TileKind = "doc" | "phone" | "calendar" | "bill";

export const rows = {
	label: "So arbeitet Heidi",
	primary: {
		text: "Partnerschaft anfragen",
		href: KONTAKT_HREF,
	} satisfies Link,
	secondary: { text: "Häufige Fragen", href: "#faq" } satisfies Link,
	items: [
		{
			tag: "Software",
			title: ["Eine Anbindung.", "Alle Kunden."],
			paragraphs: [
				"ERP- und Verwaltungssoftware binden Heidi einmal an und versorgen ihre Kunden mit Verbrauchsdaten, Abrechnungen und Dokumenten.",
				[
					"Nach bved-Standard oder über die ",
					{ text: "Heidi API", href: ROUTE_API_DOKUMENTATION },
					".",
				],
			],
			tile: "doc",
			tone: "stone",
		},
		{
			tag: "Installation",
			title: ["Regional stark.", "Bundesweit vernetzt."],
			paragraphs: [
				"Installationsbetriebe werden zertifizierte Heidi-Partner. Wir schulen Ihr Team, stellen das Installationstool und planen die Einsätze in Ihrer Region.",
				// 6hhBpn794w5tbp9t8Rk7CH
				[
					{
						text: "Mehr für Installationsbetriebe",
						href: ROUTE_INSTALLATIONSPARTNER,
					},
				],
			],
			tile: "phone",
			tone: "ink",
		},
		{
			tag: "Netzwerk",
			title: ["Verbände und", "Messdienste."],
			paragraphs: [
				"Heidi ist Kooperationspartner Bund des VDIV und im Verband DEUMESS vernetzt. Wir freuen uns über den Austausch mit weiteren Verbänden.",
				// L4T9Q3Z4f84fJhLMXjnkms
				[
					"Messdienstanbieter, die eine Nachfolge suchen, finden bei uns einen verlässlichen Partner. ",
					{ text: "Mehr zur Nachfolge", href: ROUTE_NACHFOLGE },
				],
			],
			tile: "calendar",
			tone: "mint",
		},
		{
			tag: "Gemeinsam",
			title: ["Partnerschaft", "auf Augenhöhe."],
			paragraphs: [
				"Jede Partnerschaft beginnt mit einem Gespräch. Wir verstehen Ihr Geschäft und suchen das Modell, das für beide Seiten passt.",
				"Sie bekommen einen persönlichen Ansprechpartner und klare Absprachen. Alle Daten liegen auf Servern in Deutschland.",
			],
			tile: "bill",
			tone: "mint",
		},
	] satisfies Row<TileKind>[] as Row<TileKind>[],
};

/** Row 1: what a software partner receives. */
export const doc = {
	title: "Schnittstelle",
	sub: "Softwarepartner · Beispiel",
	rows: [
		{ label: "Verbrauchsdaten" },
		{ label: "Nutzerwechsel" },
		{ label: "Dokumente" },
		{ label: "Standard", value: "bved" },
	],
	result: "Verbunden",
} satisfies DocTile;

/** Row 2: an installation job in the partner's region. */
export const phone = {
	time: "9:41",
	app: "Heidi",
	title: "Neuer Auftrag in Ihrer Region",
	sub: "Link öffnen und loslegen",
	label: "Digitaler Zwilling",
	value: "12 Wohnungen",
	comparisons: ["Alle Zähler angelegt · Beispiel"],
} satisfies PhoneTile;

/** Row 3: the network, with the visitor's idea last. */
export const calendar: CalendarTile = {
	months: [
		"VDIV",
		"DEUMESS",
		"bved",
		"Software",
		"Installation",
		"Messdienst",
		"Verwaltung",
		"Verband",
		"Ihre Idee",
	],
	current: 8,
	done: "dabei",
	doing: "im Gespräch",
	open: "offen",
	noteDone: "{x} dabei",
	noteDoing: "{x} im Gespräch",
};

/** Row 4: alone against with Heidi. */
export const bill = {
	without: "Allein",
	with: "Mit Heidi",
	rows: [
		{
			kind: "cut",
			label: "Eigene Schnittstellen je Messdienst",
			value: "aufwendig",
		},
		{ kind: "cut", label: "Kunden einzeln versorgen", value: "manuell" },
		{ kind: "ok", label: "Eine Anbindung für alle Kunden" },
		{ kind: "ok", label: "Persönlicher Ansprechpartner" },
	],
	sum: { label: "Aufwand", before: "hoch", after: "gering" },
} satisfies BillTile;

export const rotator = {
	label: "Was Heidi übernimmt",
	lead: "Partner bei Heidi:",
	phrases: [
		"Softwareanbieter",
		"Installationsbetriebe",
		"Verbände",
		"Messdienstanbieter",
	],
	intervalMs: 2300,
};

export const numbers = {
	h2: "Partnerschaften in Zahlen",
	/** The figure before the photo. None counts: every one is the design's `.dt`. */
	first: {
		value: "VDIV",
		text: "Kooperationspartner Bund",
		compact: true,
	} satisfies Figure as Figure,
	/** The figures after the photo. */
	rest: [
		{ value: "DEUMESS", text: "Im Verband vernetzt", compact: true },
		{ value: "bved", text: "Webservices nach bved-Standard", compact: true },
		{ value: "15.000+", text: "Geräte bereits installiert", compact: true },
		{
			value: "DE",
			text: "Alle Daten auf Servern in Deutschland",
			compact: true,
		},
	] satisfies Figure[] as Figure[],
};

export const audience = {
	label: "Ihr Wechsel",
	/** The first card holds the form "Anbindung anfragen" in place of a photo. */
	software: {
		title: "Sie sind Softwareanbieter?",
		text: "Binden Sie Heidi einmal an und versorgen Sie alle Kunden mit Verbrauchsdaten und Abrechnungen.",
		// Fc97HY7KUdBR38T6vPtjeY
		cta: { text: "Softwarepartner werden", href: ROUTE_SOFTWAREPARTNER },
	},
	installer: {
		title: "Sie sind Installationsbetrieb?",
		text: "Werden Sie zertifizierter Heidi-Partner. Wir schulen Ihr Team und stellen Ihnen das Installationstool.",
		// 6hhBpn794w5tbp9t8Rk7CH
		cta: {
			text: "Installationspartner werden",
			href: ROUTE_INSTALLATIONSPARTNER,
		},
	},
};

export const quotes = {
	h2: ["Gemeinsam besser.", "Unsere Kunden sagen es selbst."] as [
		string,
		string,
	],
	keys: [
		"werne",
		"vitolus",
		"gerhard",
	] satisfies Testimonial["key"][] as Testimonial["key"][],
};

export const picture = {
	label: "Heidi",
	caption: ["Gemeinsam bauen wir", "den Messdienst von morgen."] as [
		string,
		string,
	],
};

const CONSENT =
	"Ich bin einverstanden, dass Heidi Systems meine Angaben zur Kontaktaufnahme verarbeitet.";
const MISSING = "Bitte füllen Sie die markierten Felder aus.";
const SEND_ERROR = {
	text: "Das hat gerade nicht geklappt. Bitte versuchen Sie es noch einmal oder rufen Sie uns an:",
	phone: PHONE,
	phoneHref: PHONE_HREF,
};

/** The contact form's section: the steps beside the form. */
export const apply = {
	pill: "Partnerschaft",
	h2: ["Lassen Sie uns über", "Zusammenarbeit reden."] as [string, string],
	text: "Erzählen Sie uns kurz, wer Sie sind und welche Partnerschaft Sie sich vorstellen. Wir melden uns persönlich.",
	steps: [
		{ title: "Formular senden", text: "Wir melden uns bei Ihnen." },
		{ title: "Kennenlernen", text: "Wir verstehen Ihr Geschäft." },
		{ title: "Loslegen", text: "Mit klaren Absprachen." },
	],
	fields: {
		company: "Unternehmen",
		name: "Ihr Name",
		email: "E-Mail",
		phone: "Telefon",
		kind: { label: "Art der Partnerschaft", placeholder: "Bitte wählen" },
		message: { label: "Nachricht", optional: "(optional)" },
		consent: CONSENT,
	},
	submit: "Partnerschaft anfragen",
	sending: "Wird gesendet …",
	missing: MISSING,
	/** The success line; the design's own says the sending isn't live yet (plan §4.4). */
	success: (name: string) => `Danke, ${name}! Wir melden uns bei Ihnen.`,
	sendError: SEND_ERROR,
} satisfies ApplyContent & FormTexts & Record<string, unknown>;

/** The first audience card's form (the design's .spf). */
export const connection = {
	/** The form's accessible name (the design's aria-label). */
	label: "Anfrage Softwarepartner",
	title: "Anbindung anfragen",
	sub: "Wir melden uns persönlich bei Ihnen.",
	fields: {
		company: "Unternehmen",
		name: "Ihr Name",
		email: "E-Mail",
		software: { label: "Ihre Software", placeholder: "Bitte wählen" },
		message: {
			label: "Nachricht (optional)",
			placeholder: "Was möchten Sie anbinden?",
		},
		consent: CONSENT,
	},
	submit: "Anfrage senden",
	sending: "Wird gesendet …",
	missing: MISSING,
	done: {
		title: "Danke für Ihre Anfrage.",
		text: "Ihr persönlicher Ansprechpartner meldet sich bei Ihnen.",
	},
	sendError: SEND_ERROR,
} satisfies FormTexts & Record<string, unknown>;

export const faq = {
	title: "Häufige Fragen",
	items: [
		{
			question: "Wer kann Partner werden?",
			answer:
				"Softwareanbieter, Installationsbetriebe, Verbände, Messdienstanbieter und Immobilienunternehmen. Wenn Sie eine Idee haben, die zu Heidi passt, melden Sie sich.",
		},
		{
			question: "Wie läuft der erste Kontakt ab?",
			answer:
				"Sie schreiben uns über das Formular. Ihr persönlicher Ansprechpartner meldet sich und vereinbart ein erstes Gespräch.",
		},
		{
			question: "Wo finde ich die technische Dokumentation?",
			answer: `In der <a href="${ROUTE_API_DOKUMENTATION}">API-Dokumentation</a>. Mehr zur Zusammenarbeit lesen Sie auf der Seite für <a href="${ROUTE_SOFTWAREPARTNER}">Softwarepartner</a>.`,
		},
		{
			question: "Ich suche eine Nachfolge für meinen Messdienst.",
			answer: `Dann lesen Sie mehr auf unserer Seite zur <a href="${ROUTE_NACHFOLGE}">Nachfolge</a>.`,
		},
		{
			question: "Wo liegen die Daten?",
			answer: "Auf Servern in Deutschland, verarbeitet nach DSGVO und BDSG.",
			// Sb54rDQd5WS2r82skPe7UQ
			more: { text: "Mehr zu Sicherheit", href: ROUTE_SICHERHEIT },
		},
	] satisfies FaqItem[] as FaqItem[],
};

export const closing = {
	h2: "Lassen Sie uns zusammenarbeiten.",
	text: "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.",
	/** The video button (the design's .dcta-b) → the form (plan, open question 1). */
	button: {
		text: "Demo buchen",
		sub: "Mit Ihrem Ansprechpartner",
		href: KONTAKT_HREF,
	},
};
