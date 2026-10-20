/**
 * Every text and the example data of /softwarepartner, word for word from
 * the design, in the shapes of the shared `uv` template and the shared
 * partner section. Components hold markup and behaviour only.
 *
 * The integration programme as described, the data-protection statements,
 * the company claims, the form's texts and options, and the example data
 * need sign-off before the cutover (plan §4.4).
 */
import { PHONE, PHONE_HREF } from "$lib/components/Header/navGroups";
import { START_HREF } from "$lib/landing/cta";
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
	Row,
} from "$lib/landing/sections/uv/types";
import {
	ROUTE_API_DOKUMENTATION,
	ROUTE_MESSDIENSTWECHSEL,
	ROUTE_SCHNITTSTELLEN,
	ROUTE_SICHERHEIT,
} from "$lib/routes";

/** The partner form's section (the design's id). */
export const APPLY_ID = "bewerben";
const APPLY_HREF = `#${APPLY_ID}`;

/**
 * Target of the managers' "Demo buchen" (the trust block, the floating CTA):
 * this page has no signup form, so they lead to /messdienstwechsel's (plan,
 * open question 1).
 */
export const MANAGER_SIGNUP_HREF = `${ROUTE_MESSDIENSTWECHSEL}${START_HREF}`;

const partnerLink: Link = { text: "Partner werden", href: APPLY_HREF };

export const hero = {
	srTitle: "Softwarepartner von Heidi Systems",
	word: "Softwarepartner",
	/** The design's #ipf-css: the long word is smaller than the template's. */
	wordSize: "clamp(34px, 8.6vw, 130px)",
	lead: "Heidi liefert Verbrauchs- und Abrechnungsdaten direkt in die Software Ihrer Kunden. Eine Anbindung, keine doppelte Pflege.",
	primary: partnerLink,
	secondary: { text: "API-Dokumentation", href: ROUTE_API_DOKUMENTATION },
};

/** The hero's app window: the interface handing data over. */
export const list = {
	label: "Beispiel: Heidi Schnittstelle",
	brand: "Heidi",
	nav: [
		{ icon: "server", text: "Schnittstellen" },
		{ icon: "doc", text: "Datenfluss" },
		{ icon: "users", text: "Partner" },
	] satisfies AppNavItem[] as AppNavItem[],
	navFoot: "Schnittstelle",
	head: "Heidi Schnittstelle",
	tag: "Beispieldaten",
	title: "Datenübergabe läuft.",
	sub: "ERP-Anbindung · Beispiel",
	entries: [
		{
			icon: "server",
			title: "Verbrauchsdaten",
			sub: "Monatlich je Einheit",
			before: "Wird übertragen",
			after: "Übertragen",
		},
		{
			icon: "doc",
			title: "Heizkostenabrechnung 2026",
			sub: "Als Datensatz",
			before: "Wird erstellt",
			after: "Übergeben",
		},
		{
			icon: "building",
			title: "Liegenschaften",
			sub: "Stammdaten",
			before: "Abgleich",
			after: "Aktuell",
		},
		{
			icon: "bell",
			title: "Mieterportal",
			sub: "Verbrauchsinfo September",
			before: "Wird bereitgestellt",
			after: "Bereit",
		},
	] satisfies ListEntry[] as ListEntry[],
};

export const statement = {
	label: "Worum es geht",
	text: "Hausverwaltungen arbeiten in ihrer eigenen Software. Darum bringt Heidi die Daten dorthin: Verbräuche, Abrechnungen und Stammdaten fließen direkt ins ERP- oder CRM-System. Für Softwareanbieter heißt das: Ihre Kunden bekommen Messdienstdaten, ohne Ihre Software zu verlassen.",
};

export type TileKind = "bill" | "calendar" | "doc" | "phone";

export const rows = {
	label: "So arbeitet Heidi",
	primary: partnerLink,
	secondary: { text: "Häufige Fragen", href: "#faq" } satisfies Link,
	items: [
		{
			tag: "Schnittstelle",
			title: ["Eine Anbindung.", "Alle Daten."],
			paragraphs: [
				"Heidi übergibt Verbräuche, Heizkostenabrechnungen und Stammdaten als Datensatz an Ihre Software.",
				"Ihre Kunden tippen keine Werte mehr aus PDFs ab und pflegen nur noch eine Plattform.",
			],
			tile: "bill",
			tone: "mint",
		},
		{
			tag: "Datenfluss",
			title: ["Jeden Monat", "automatisch."],
			paragraphs: [
				"Heidi liest die Funkzähler aus der Ferne ab. Die Verbräuche stehen jeden Monat bereit, nicht nur einmal im Jahr.",
				"So arbeiten Ihre Kunden immer mit aktuellen Zahlen.",
			],
			tile: "calendar",
			tone: "mint",
		},
		{
			tag: "Sicherheit",
			title: ["Server in Deutschland.", "Nach DSGVO."],
			paragraphs: [
				"Heidi speichert alle Daten auf Servern in Deutschland und verarbeitet sie nach DSGVO.",
				"Die Übertragung zu Ihrer Software ist verschlüsselt.",
			],
			tile: "doc",
			tone: "stone",
		},
		{
			tag: "Gemeinsame Kunden",
			title: ["Mehr Wert", "für Ihre Kunden."],
			paragraphs: [
				"Messdienst ist für Verwaltungen ein großer Aufwand. Mit Heidi landet er direkt in Ihrer Software.",
				"Das macht Ihr Produkt für Verwaltungen noch wertvoller.",
			],
			tile: "phone",
			tone: "ink",
		},
	] satisfies Row<TileKind>[] as Row<TileKind>[],
};

/** Row 1: typing values off PDFs against the data set. */
export const bill = {
	without: "Heute",
	with: "Mit Heidi",
	rows: [
		{ kind: "cut", label: "Ablesewerte als PDF", value: "manuell" },
		{ kind: "cut", label: "Werte ins ERP abtippen", value: "manuell" },
		{ kind: "ok", label: "Verbräuche automatisch im ERP" },
		{ kind: "ok", label: "Abrechnung als Datensatz" },
	],
	sum: { label: "Doppelte Pflege", before: "ja", after: "nein" },
} satisfies BillTile;

/** Row 2: the year's monthly deliveries. */
export const calendar: CalendarTile = {
	months: [
		"Jan",
		"Feb",
		"Mär",
		"Apr",
		"Mai",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Okt",
		"Nov",
		"Dez",
	],
	current: 9,
	done: "übertragen",
	doing: "wird übertragen",
	open: "offen",
	noteDone: "{x} übertragen",
	noteDoing: "{x} wird übertragen",
};

/** Row 3: the data processing. */
export const doc = {
	title: "Datenverarbeitung",
	sub: "Heidi Plattform",
	rows: [
		{ label: "Server in Deutschland" },
		{ label: "Verarbeitung nach DSGVO" },
		{ label: "Verschlüsselte Übertragung" },
		{ label: "Zugriff", value: "Nur berechtigt" },
	],
	result: "Sicher übertragen",
} satisfies DocTile;

export type Transfer = {
	title: string;
	sub: string;
	/** Delivered (✓), or being transferred (…). */
	state: "ok" | "cur";
};

/** Row 4's phone: the notification, then the deliveries to the vendor's software. */
export const phone = {
	time: "9:41",
	app: "Heidi",
	title: "Neue Daten von Heidi",
	sub: "Verbräuche Oktober werden übertragen",
	transfers: [
		{
			title: "Verbräuche September",
			sub: "24 Liegenschaften · 1.650 Einheiten",
			state: "ok",
		},
		{
			title: "Heizkostenabrechnung 2026",
			sub: "Als Datensatz übergeben",
			state: "ok",
		},
		{ title: "Stammdaten", sub: "Liegenschaften abgeglichen", state: "ok" },
		{ title: "Verbräuche Oktober", sub: "Wird übertragen", state: "cur" },
	] satisfies Transfer[] as Transfer[],
	badges: { ok: "✓", cur: "…" },
};

export const rotator = {
	label: "Was Heidi übernimmt",
	lead: "Heidi liefert an Ihre Software:",
	phrases: [
		"Verbräuche je Einheit",
		"Heizkostenabrechnung",
		"Stammdaten",
		"Verbrauchsinfo für Mieter",
	],
	intervalMs: 2300,
};

export const numbers = {
	h2: "Die Anbindung in Zahlen",
	/** The figure before the photo. */
	first: {
		value: "12",
		unit: "×",
		text: "Datenlieferungen pro Jahr statt einer Ablesung",
		count: 12,
	} satisfies Figure as Figure,
	/** The figures after the photo. "0" doesn't count, as the design's `to > 0`. */
	rest: [
		{ value: "1", text: "Anbindung für alle gemeinsamen Kunden", count: 1 },
		{ value: "0", text: "Werte zum Abtippen" },
		{ value: "DE", text: "Server in Deutschland", compact: true },
		{ value: "DSGVO", text: "konforme Verarbeitung", compact: true },
	] satisfies Figure[] as Figure[],
};

export type AudienceKey = "facade" | "building";

export const audience = {
	label: "Ihr Wechsel",
	cards: [
		{
			title: "Sie sind Softwareanbieter?",
			text: "Lassen Sie uns über eine Anbindung sprechen. Wir zeigen Ihnen, welche Daten Heidi liefert und wie die Übergabe funktioniert.",
			cta: { text: "Jetzt Partner werden", href: APPLY_HREF },
			image: "facade",
		},
		{
			title: "Sie sind Verwaltung?",
			text: "Heidi bindet Ihr bestehendes ERP- oder CRM-System an. Sie pflegen nur eine Plattform.",
			// KE95icU8eKWX7TNfLerbSZ
			cta: { text: "Zu den Schnittstellen", href: ROUTE_SCHNITTSTELLEN },
			image: "building",
		},
	] satisfies {
		title: string;
		text: string;
		cta: { text: string; href?: string };
		image: AudienceKey;
	}[],
};

export const quotes = {
	h2: ["Daten, die ankommen.", "Unsere Kunden sagen es selbst."] as [
		string,
		string,
	],
	keys: [
		"vitolus",
		"werne",
		"gerhard",
	] satisfies Testimonial["key"][] as Testimonial["key"][],
};

export const picture = {
	label: "Heidi",
	caption: ["Ihre Software.", "Unsere Daten."] as [string, string],
};

/** The partner form's section: the steps beside the form. */
export const apply = {
	pill: "Für Softwareanbieter",
	h2: ["Werden Sie", "Heidi-Softwarepartner."] as [string, string],
	text: "Sie entwickeln ERP-, CRM- oder Abrechnungssoftware für die Immobilienwirtschaft? Melden Sie sich. Wir zeigen Ihnen, welche Daten Heidi liefert, und planen die Anbindung gemeinsam.",
	steps: [
		{ title: "Formular senden", text: "Wir melden uns bei Ihnen." },
		{
			title: "Technisches Kennenlernen",
			text: "Datenfelder, Formate und Übergabe.",
		},
		{
			title: "Anbindung umsetzen",
			text: "Gemeinsame Kunden bekommen die Daten direkt.",
		},
	],
	fields: {
		company: "Unternehmen",
		name: "Ansprechpartner",
		email: "E-Mail",
		phone: "Telefon",
		product: {
			label: "Software oder Produkt",
			placeholder: "Name Ihrer Lösung",
		},
		customers: {
			label: "Kunden in der Immobilienwirtschaft",
			placeholder: "Bitte wählen",
		},
		kinds: "Art der Software",
		message: {
			label: "Nachricht",
			optional: "(optional)",
			placeholder: "Schnittstellen, Anwendungsfälle, Fragen",
		},
		consent:
			"Ich bin einverstanden, dass Heidi Systems meine Angaben zur Kontaktaufnahme verarbeitet.",
	},
	submit: "Als Partner melden",
	sending: "Wird gesendet …",
	missing: "Bitte füllen Sie die markierten Felder aus.",
	/** The success line; the design's own says the sending isn't live yet (plan §4.4). */
	success: (name: string) => `Danke, ${name}! Wir melden uns bei Ihnen.`,
	sendError: {
		text: "Das hat gerade nicht geklappt. Bitte versuchen Sie es noch einmal oder rufen Sie uns an:",
		phone: PHONE,
		phoneHref: PHONE_HREF,
	},
} satisfies ApplyContent & FormTexts & Record<string, unknown>;

export const faq = {
	title: "Häufige Fragen",
	items: [
		{
			question: "Welche Daten liefert Heidi?",
			answer:
				"Verbräuche je Einheit und Monat, Heizkostenabrechnungen als Datensatz und die Stammdaten der Liegenschaften.",
		},
		{
			question: "Wie werden Softwareanbieter Partner?",
			answer:
				"Über das Formular auf dieser Seite. Wir melden uns, besprechen Datenfelder und Formate und planen die Anbindung gemeinsam.",
		},
		{
			question: "Wo liegen die Daten?",
			answer: "Auf Servern in Deutschland, verarbeitet nach DSGVO.",
			// Sb54rDQd5WS2r82skPe7UQ
			more: { text: "Mehr zu Sicherheit", href: ROUTE_SICHERHEIT },
		},
		{
			question: "Was haben Verwaltungen davon?",
			answer:
				"Sie pflegen nur eine Plattform. Verbräuche und Abrechnungen erscheinen direkt in der Software, mit der sie ohnehin arbeiten.",
		},
	] satisfies FaqItem[] as FaqItem[],
};

export const closing = {
	h2: "Werden Sie Softwarepartner von Heidi.",
	cta: partnerLink,
};
