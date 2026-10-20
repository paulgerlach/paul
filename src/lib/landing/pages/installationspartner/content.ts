/**
 * Every text and the example data of /installationspartner, word for word
 * from the design, in the shapes of the shared `uv` template where it uses
 * it. Components hold markup and behaviour only.
 *
 * The partner programme and the Installationstool as described, the company
 * claims, the form's texts and options, and the example data need sign-off
 * before the cutover (plan §4.4). The KPIs 14 Tage and 1–2 h were confirmed
 * on 2026-10-12.
 */
import { PHONE, PHONE_HREF } from "$lib/components/Header/navGroups";
import { START_HREF } from "$lib/landing/cta";
import type { Testimonial } from "$lib/landing/data/testimonials";
import type { FaqItem } from "$lib/landing/faqJsonLd";
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
	ROUTE_INSTALLATIONSTOOL,
	ROUTE_MESSDIENSTWECHSEL,
	ROUTE_VORGEHEN,
} from "$lib/routes";

const NB = " ";

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
	srTitle: "Installationspartner von Heidi Systems",
	word: "Installationspartner",
	/** The design's #ipf-css: the long word is smaller than the template's. */
	wordSize: "clamp(34px, 8.6vw, 130px)",
	lead: "Geschulte Teams, ein digitaler Zwilling jeder Liegenschaft und eine saubere Übergabe. Deutschlandweit, ohne Klemmbrett.",
	primary: partnerLink,
	secondary: { text: "Mehr erfahren", href: "#inhalt" } satisfies Link,
};

/** The example property of the mocks. */
const PROPERTY = "Lindenallee 12";

/** The hero's app window: the Installationstool with the day's entries. */
export const list = {
	label: "Beispiel: Heidi Installationstool",
	brand: "Heidi",
	nav: [
		{ icon: "tool", text: "Liegenschaft" },
		{ icon: "doc", text: "Wohnungen" },
		{ icon: "users", text: "Übergabe" },
	] satisfies AppNavItem[] as AppNavItem[],
	navFoot: "Installationstool",
	head: "Heidi Installationstool",
	tag: "Beispieldaten",
	title: "Guten Morgen, Team Nord.",
	sub: `${PROPERTY} · Beispiel`,
	entries: [
		{
			icon: "home",
			title: "WE 01 · EG links",
			sub: "Alt- und Neuzähler",
			before: "Offen",
			after: "Fotografiert",
		},
		{
			icon: "home",
			title: "WE 02 · EG rechts",
			sub: "Alt- und Neuzähler",
			before: "Offen",
			after: "Fotografiert",
		},
		{
			icon: "bell",
			title: "Mieter WE 03",
			sub: "Zeitfenster 10:00 bis 11:30",
			before: "Informiert",
			after: "Zu Hause",
		},
		{
			icon: "doc",
			title: "Übergabeprotokoll",
			sub: PROPERTY,
			before: "Wird erstellt",
			after: "Übergeben",
		},
	] satisfies ListEntry[] as ListEntry[],
};

export const statement = {
	label: "Worum es geht",
	text: "Eine gute Installation entscheidet sich vor Ort. Darum arbeitet Heidi nur mit geschulten und von uns zertifizierten Teams: mit unserer eigenen Flotte und mit regionalen Installationsbetrieben in ganz Deutschland. Jedes Team bekommt von uns ein Tool, das den Wechsel leicht macht. Vom alten Zähler bis zur fertigen Übergabe.",
};

/** Confirmed KPIs (2026-10-12), in the numbers and the FAQ. */
export const KPI = {
	notice: 14,
	window: `1–2${NB}h`,
};

export type TileKind = "doc" | "twin" | "calendar" | "tracking" | "bill";

export const rows = {
	label: "So arbeitet Heidi",
	primary: partnerLink,
	secondary: { text: "Häufige Fragen", href: "#faq" } satisfies Link,
	items: [
		{
			tag: "Zertifiziert",
			title: ["Geschult.", "Zertifiziert."],
			paragraphs: [
				"Heidi schult jedes Installationsteam auf unsere Funkzähler, unsere Abläufe und den Umgang mit Mietern.",
				"Erst danach montiert ein Team in Heidi-Liegenschaften. So bleibt die Qualität überall gleich hoch.",
			],
			tile: "doc",
			tone: "stone",
		},
		{
			tag: "Digitaler Zwilling",
			title: ["Jede Wohnung.", "Auf dem Handy."],
			paragraphs: [
				"Im Installationstool sehen die Monteure die Liegenschaft als digitalen Zwilling: jede Wohneinheit, jeden Zähler, jeden Termin.",
				"So gehen sie die Wohnungen gezielt ab, statt Listen zu suchen.",
			],
			tile: "twin",
			tone: "ink",
		},
		{
			tag: "Dokumentation",
			title: ["Alter Zähler raus.", "Neuer rein. Mit Foto."],
			paragraphs: [
				"In jeder Wohnung fotografieren die Monteure den alten Zähler mit Endstand und den neuen Zähler nach der Montage.",
				"Ohne Klemmbrett unterm Arm und ohne Abtippen. Die Daten landen direkt bei Heidi.",
			],
			tile: "calendar",
			tone: "mint",
		},
		{
			tag: "Mieterinfo",
			title: ["Noch zwei Wohnungen.", "Dann klingelt es."],
			paragraphs: [
				"Am Montagetag sehen die Mieter, wo das Team im Haus gerade ist: Heidi benachrichtigt sie, sobald nur noch zwei Wohnungen vor ihrer eigenen dran sind.",
				"So sind die Mieter zu Hause, wenn es klingelt. Und Ihr Team steht nicht vor verschlossenen Türen.",
			],
			tile: "tracking",
			tone: "ink",
		},
		{
			tag: "Übergabe",
			title: ["Ordnungsgemäß", "übergeben."],
			paragraphs: [
				"Aus den Fotos und Zählerständen entsteht das Übergabeprotokoll. Vollständig, nachvollziehbar und ohne Nacharbeit im Büro.",
				"Fehlt in einer Wohnung etwas, sieht das Team es noch vor Ort.",
			],
			tile: "bill",
			tone: "mint",
		},
	] satisfies Row<TileKind>[] as Row<TileKind>[],
};

/** Row 1: the certificate. */
export const doc = {
	title: "Heidi-Zertifizierung",
	sub: "Installationsbetrieb · Beispiel",
	rows: [
		{ label: "Schulung Funkzähler" },
		{ label: "Schulung Installationstool" },
		{ label: "Umgang mit Mietern" },
		{ label: "Einsatzgebiet", value: "Region Nord" },
	],
	result: "Zertifizierter Heidi-Partner",
} satisfies DocTile;

export type TwinUnit = {
	name: string;
	note: string;
	/** Done (✓), being photographed (its badge), or still open (no badge). */
	state: "ok" | "cur" | "open";
	badge?: string;
};

/** Row 2's phone: the building, then its flats. */
export const twin = {
	time: "9:41",
	app: "Heidi",
	badge: "Liegenschaft",
	title: PROPERTY,
	sub: "Mehrfamilienhaus · Beispiel",
	facts: [
		{ label: "Heizung", value: "Gaszentralheizung" },
		{ label: "Wohneinheiten", value: "24" },
		{ label: "Heute offen", value: "3" },
	],
	button: "Wohnungen ansehen",
	back: `‹ ${PROPERTY}`,
	noteTitle: "24 Wohneinheiten",
	noteSub: "Gaszentralheizung · 3 offen",
	units: [
		{
			name: "WE 01 · EG links",
			note: "Alt- und Neuzähler fotografiert",
			state: "ok",
			badge: "✓",
		},
		{
			name: "WE 02 · EG rechts",
			note: "Alt- und Neuzähler fotografiert",
			state: "ok",
			badge: "✓",
		},
		{
			name: "WE 03 · 1. OG links",
			note: "Altzähler fotografiert",
			state: "cur",
			badge: "1/2",
		},
		{
			name: "WE 04 · 1. OG rechts",
			note: "Termin 10:00 bis 11:30",
			state: "open",
		},
	] satisfies TwinUnit[] as TwinUnit[],
};

const UNITS = Array.from(
	{ length: 12 },
	(_, i) => `WE ${String(i + 1).padStart(2, "0")}`,
);

/** Row 3: the flats documented one by one. */
export const calendar: CalendarTile = {
	months: UNITS,
	current: 9,
	done: "dokumentiert",
	doing: "wird erfasst",
	open: "offen",
	noteDone: "{x} dokumentiert",
	noteDoing: "{x} wird erfasst",
};

/** Row 4's phone: the tenant of WE 08 follows the fitter through the house. */
export const tracking = {
	time: "9:41",
	app: "Heidi",
	push: {
		title: "Heidi · jetzt",
		before: "Ihr Monteur ist noch ",
		strong: "2 Wohnungen",
		after: " von Ihnen entfernt.",
	},
	/** Bottom to top, as drawn. */
	floors: ["EG", "1. OG", "2. OG", "3. OG"],
	/** Two per floor, left then right, from the ground floor up. */
	units: UNITS.slice(0, 8),
	pin: "Ihre WE",
	heading: {
		house: "Ihr Monteur ist im Haus",
		here: "Gleich klingelt es",
	},
	sub: "WE 08 · 3. OG rechts · 10:00 bis 11:30",
	steps: ["Bestätigt", "Im Haus", "Bei Ihnen", "Erledigt"],
	count: {
		one: "Wohnung vor Ihnen",
		many: "Wohnungen vor Ihnen",
		here: "Ihr Monteur ist bei Ihnen",
	},
	tag: "Beispiel",
};

/** Row 5: clipboard against the tool, with the meter photo on the tool's side. */
export const bill = {
	without: "Klemmbrett",
	with: "Heidi-Tool",
	rows: [
		{ kind: "cut", label: "Zählerstände per Hand notieren", value: "manuell" },
		{ kind: "cut", label: "Fotos später zuordnen", value: "manuell" },
		{ kind: "ok", label: "Alt- und Neuzähler pro Wohnung fotografiert" },
		{ kind: "ok", label: "Übergabeprotokoll automatisch" },
	],
	sum: { label: "Nacharbeit im Büro", before: "Stunden", after: "keine" },
} satisfies BillTile;

export const meterPhoto = {
	unit: "WE 03 · Neuzähler",
	title: "Foto aufgenommen",
	done: "dem Übergabeprotokoll zugeordnet",
};

export const rotator = {
	label: "Was Heidi übernimmt",
	lead: "Heidi übernimmt für Ihr Team:",
	phrases: [
		"Mieterinformation",
		"Zeitfenster von 1 bis 2 Stunden",
		"Digitaler Zwilling",
		"Übergabeprotokoll",
	],
	intervalMs: 2300,
};

export const numbers = {
	h2: "Installation in Zahlen",
	/** The figure before the photo. */
	first: {
		value: String(KPI.notice),
		unit: "Tage",
		text: "vorher informiert Heidi die Mieter",
		count: KPI.notice,
	} satisfies Figure as Figure,
	/** The figures after the photo. "0" doesn't count, as the design's `to > 0`. */
	rest: [
		{
			value: KPI.window,
			text: "Zeitfenster für die Mieter am Montagetag",
			compact: true,
		},
		{
			value: "92",
			unit: "%",
			text: "der Installationen gelingen beim ersten Termin",
			count: 92,
		},
		{
			value: "2",
			text: "Fotos pro Zähler: alt mit Endstand, neu nach Montage",
			count: 2,
		},
		{ value: "0", text: "Klemmbretter" },
	] satisfies Figure[] as Figure[],
};

export type AudienceKey = "installer" | "team";

export const audience = {
	label: "Ihr Wechsel",
	cards: [
		{
			title: "Sie sind Installationsbetrieb?",
			text: "Werden Sie zertifizierter Heidi-Partner. Wir schulen Ihr Team, stellen das Installationstool und planen die Einsätze in Ihrer Region.",
			cta: { text: "Jetzt Partner werden", href: APPLY_HREF },
			image: "installer",
		},
		{
			title: "Sie sind Verwaltung?",
			text: "Die Installation in Ihren Liegenschaften kommt mit Heidi aus einer Hand. Mit geschulten Teams und einem festen Ansprechpartner.",
			// 5BrUg7VjVK4QEhd7DiaSfj
			cta: { text: "So gehen wir vor", href: ROUTE_VORGEHEN },
			image: "team",
		},
	] satisfies {
		title: string;
		text: string;
		cta: { text: string; href?: string };
		image: AudienceKey;
	}[],
};

export const quotes = {
	h2: ["Saubere Installation.", "Unsere Kunden sagen es selbst."] as [
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
	caption: ["Deutschlandweit.", "Eigene Flotte und Partner vor Ort."] as [
		string,
		string,
	],
};

/** The partner form's section: the steps beside the form. */
export const apply = {
	pill: "Für Installationsbetriebe",
	h2: ["Werden Sie", "Heidi-Installationspartner."] as [string, string],
	text: "Sie sind Installationsbetrieb für Heizung, Sanitär oder Messtechnik? Melden Sie sich. Wir lernen Ihr Team kennen, schulen es und planen die ersten Einsätze in Ihrer Region.",
	steps: [
		{ title: "Formular senden", text: "Wir melden uns bei Ihnen." },
		{
			title: "Kennenlernen und Schulung",
			text: "Funkzähler, Abläufe und Installationstool.",
		},
		{
			title: "Zertifiziert loslegen",
			text: "Einsätze in Ihrer Region, Mieter von Heidi informiert.",
		},
	],
	fields: {
		company: "Firmenname",
		name: "Ansprechpartner",
		email: "E-Mail",
		phone: "Telefon",
		region: {
			label: "PLZ oder Region",
			placeholder: "z. B. 10115 oder Raum Leipzig",
		},
		crew: { label: "Monteure im Team", placeholder: "Bitte wählen" },
		trades: "Gewerke",
		experience: "Erfahrung mit Funkzählern?",
		message: {
			label: "Nachricht",
			optional: "(optional)",
			placeholder: "Einsatzgebiet, Kapazitäten, Fragen",
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
};

export const faq = {
	title: "Häufige Fragen",
	items: [
		{
			question: "Wer installiert bei Heidi?",
			answer:
				"Unsere eigene Installationsflotte und regionale Installationsbetriebe, die wir schulen und zertifizieren. Wir sind deutschlandweit aktiv und arbeiten mit kleineren und größeren Betrieben zusammen.",
		},
		{
			question: "Wie werden Installationsbetriebe Partner?",
			answer:
				"Über das Formular auf dieser Seite. Wir melden uns, lernen Ihr Team kennen und schulen es auf Funkzähler, Abläufe und das Installationstool.",
		},
		{
			question: "Was ist das Installationstool?",
			answer:
				"Ihr Team bekommt für jeden Auftrag einen Link. Darüber öffnet sich die Liegenschaft als digitaler Zwilling mit allen Wohneinheiten. Das Team fotografiert alte und neue Zähler direkt im Tool, daraus entsteht das Übergabeprotokoll.",
			// JevEa3P3wSURqiTTH4R39n
			more: {
				text: "Mehr zum Installationstool",
				href: ROUTE_INSTALLATIONSTOOL,
			},
		},
		{
			question: "Wer informiert die Mieter?",
			answer: `Heidi. Die Mieter erfahren ${KPI.notice} Tage vorher vom Termin und bekommen ein Zeitfenster von 1 bis 2 Stunden, damit sie zu Hause sind.`,
		},
		{
			question: "Wie viele Termine klappen beim ersten Mal?",
			answer: `92${NB}% der Installationen gelingen beim ersten Termin.`,
		},
	] satisfies FaqItem[] as FaqItem[],
};

export const closing = {
	h2: "Werden Sie Installationspartner von Heidi.",
	cta: partnerLink,
};
