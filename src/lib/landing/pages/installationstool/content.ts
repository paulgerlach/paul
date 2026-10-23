/**
 * Every text and the example data of /plattform/installationstool, word for word from
 * the design, in the shapes of the shared `uv` template. Components hold
 * markup and behaviour only.
 *
 * The product as described, "Einmal in die Wohnung. Dann nie wieder.", the
 * company claims and the example data need sign-off before the cutover
 * (plan §4.4). The KPIs 14 Tage and 1–2 h were confirmed on 2026-10-12.
 */
import { DEMO_HREF } from "$lib/landing/cta";
import type { Testimonial } from "$lib/landing/data/testimonials";
import type { FaqItem } from "$lib/landing/faqJsonLd";
import type {
	AppNavItem,
	BillTile,
	CalendarTile,
	Figure,
	Link,
	ListEntry,
	PhoneTile,
	Row,
} from "$lib/landing/sections/uv/types";
import { ROUTE_INSTALLATIONSPARTNER, ROUTE_SICHERHEIT } from "$lib/routes";

const NB = " ";

/** Every "Demo buchen" leads to the booking page. */
const demoLink: Link = { text: "Demo buchen", href: DEMO_HREF };

// 6hhBpn794w5tbp9t8Rk7CH
const partnerLink: Link = {
	text: "Partner werden",
	href: ROUTE_INSTALLATIONSPARTNER,
};

export const hero = {
	srTitle: "Das Heidi Installationstool für Installateure",
	word: "Installationstool",
	lead: "Ein Link, ein digitaler Zwilling, zwei Fotos pro Zähler. Einmal in die Wohnung, dann nie wieder.",
	primary: demoLink,
	secondary: { text: "Mehr erfahren", href: "#inhalt" } satisfies Link,
};

/** The example building of the mocks. */
const PROPERTY = "Lindenallee 12";

/** The hero's app window: the building's flats being digitised. */
export const list = {
	label: "Beispiel: Heidi Installationstool",
	brand: "Heidi",
	nav: [
		{ icon: "tool", text: "Gebäude" },
		{ icon: "doc", text: "Fotos" },
		{ icon: "users", text: "Übergabe" },
	] satisfies AppNavItem[] as AppNavItem[],
	navFoot: "Installationstool",
	head: "Heidi Installationstool",
	tag: "Beispieldaten",
	title: PROPERTY,
	sub: "Digitaler Zwilling · Beispiel",
	entries: [
		{
			icon: "home",
			title: "EG links",
			sub: "2 Heizkostenverteiler · 1 Wasserzähler",
			before: "Wird fotografiert",
			after: "Digitalisiert",
		},
		{
			icon: "home",
			title: "EG rechts",
			sub: "3 Heizkostenverteiler · 1 Wasserzähler",
			before: "Offen",
			after: "Digitalisiert",
		},
		{
			icon: "home",
			title: "1. OG links",
			sub: "2 Heizkostenverteiler · 2 Wasserzähler",
			before: "Offen",
			after: "Digitalisiert",
		},
		{
			icon: "doc",
			title: "Übergabeprotokoll",
			sub: PROPERTY,
			before: "Wird erstellt",
			after: "Fertig",
		},
	] satisfies ListEntry[] as ListEntry[],
};

export const statement = {
	label: "Worum es geht",
	text: "Eine Montage soll schnell gehen und sauber dokumentiert sein. Mit dem Heidi Installationstool öffnet der Installateur einen Link und sieht das Gebäude als digitalen Zwilling. Ein Foto vom alten Zähler, ein Foto vom neuen, und alles ist digitalisiert. Einmal in die Wohnung, dann nie wieder.",
};

/** Confirmed KPIs (2026-10-12), as /partner/installationspartner's. */
export const KPI = {
	notice: 14,
	window: `1–2${NB}h`,
};

export type TileKind = "phone" | "camera" | "calendar" | "bill";

export const rows = {
	label: "So arbeitet Heidi",
	primary: demoLink,
	secondary: { text: "Häufige Fragen", href: "#faq" } satisfies Link,
	items: [
		{
			tag: "Ein Link",
			title: ["Ein Link.", "Alles dabei."],
			paragraphs: [
				"Der Installateur bekommt für den Auftrag einen Link von Heidi. Darüber sieht er das Gebäude als digitalen Zwilling.",
				"Jede Wohnung und jeder Zähler sind dort schon angelegt. Er geht sie einfach der Reihe nach ab.",
			],
			tile: "phone",
			tone: "ink",
		},
		{
			tag: "Zwei Fotos",
			title: ["Foto vom alten.", "Foto vom neuen."],
			paragraphs: [
				"In der Wohnung fotografiert der Installateur den alten Zähler mit seinem Endstand und danach den neuen Zähler.",
				"Damit ist der Tausch dokumentiert und digital erfasst. Ohne Klemmbrett und ohne Abtippen im Büro.",
			],
			tile: "camera",
			tone: "ink",
		},
		{
			tag: "Digitaler Zwilling",
			title: ["Wohnung für Wohnung", "digitalisiert."],
			paragraphs: [
				"Mit jedem Foto füllt sich der digitale Zwilling. Sie sehen, welche Wohnungen schon fertig sind.",
				"Am Ende entsteht daraus das Übergabeprotokoll.",
			],
			tile: "calendar",
			tone: "mint",
		},
		{
			tag: "Einmal",
			title: ["Einmal in die Wohnung.", "Dann nie wieder."],
			paragraphs: [
				"Alles ist beim ersten Termin dokumentiert. Danach liest Heidi die Funkzähler aus der Ferne ab.",
				"Für die Ablesung muss niemand mehr in die Wohnung. Das freut Ihre Mieter und spart Ihnen Termine.",
			],
			tile: "bill",
			tone: "mint",
		},
	] satisfies Row<TileKind>[] as Row<TileKind>[],
};

/** Row 1's phone: the new job with its digital twin. */
export const phone = {
	time: "9:41",
	app: "Heidi",
	title: `Neuer Auftrag: ${PROPERTY}`,
	sub: "Link öffnen und loslegen",
	label: "Digitaler Zwilling",
	value: "12 Wohnungen",
	comparisons: ["Alle Zähler angelegt · Beispiel"],
} satisfies PhoneTile;

/** Row 2's phone: the camera takes the old and the new meter. */
export const camera = {
	time: "9:41",
	app: "Heidi",
	labels: ["Alter Zähler · Foto 1 von 2", "Neuer Zähler · Foto 2 von 2"] as [
		string,
		string,
	],
	/** The new meter's display. */
	reading: "00047",
	done: "2. OG links digitalisiert",
};

const FLOORS = ["EG", "1. OG", "2. OG", "3. OG", "4. OG", "DG"];

/** Row 3: the twelve flats, digitised one by one. */
export const calendar: CalendarTile = {
	months: FLOORS.flatMap((floor) => [`${floor} li`, `${floor} re`]),
	current: 8,
	done: "digitalisiert",
	doing: "in Arbeit",
	open: "offen",
	noteDone: "{x} digitalisiert",
	noteDoing: "{x} in Arbeit",
};

/** Row 4: without the tool against with Heidi. */
export const bill = {
	without: "Ohne Tool",
	with: "Mit Heidi",
	rows: [
		{ kind: "cut", label: "Zählerstände per Hand notieren", value: "manuell" },
		{ kind: "cut", label: "Fotos später zuordnen", value: "manuell" },
		{ kind: "ok", label: "Alter und neuer Zähler fotografiert" },
		{ kind: "ok", label: "Übergabeprotokoll digital" },
	],
	sum: { label: "Termine in der Wohnung", before: "mehrere", after: "einer" },
} satisfies BillTile;

export const rotator = {
	label: "Was Heidi übernimmt",
	lead: "Mit dem Installationstool:",
	phrases: [
		"Digitaler Zwilling",
		"Foto vom alten Zähler",
		"Foto vom neuen Zähler",
		"Übergabeprotokoll",
	],
	intervalMs: 2300,
};

export const numbers = {
	h2: "Installation in Zahlen",
	/** The figure before the photo. */
	first: {
		value: "92",
		unit: "%",
		text: "der Installationen gelingen beim ersten Termin",
		count: 92,
	} satisfies Figure as Figure,
	/** The figures after the photo. */
	rest: [
		{
			value: "2",
			text: "Fotos pro Zähler: alt mit Endstand, neu nach Montage",
			count: 2,
		},
		{ value: "1", text: "Termin in der Wohnung", count: 1 },
		{
			value: String(KPI.notice),
			unit: "Tage",
			text: "vorher informiert Heidi Ihre Mieter",
			count: KPI.notice,
		},
		{
			value: KPI.window,
			text: "Zeitfenster für Ihre Mieter am Montagetag",
			compact: true,
		},
	] satisfies Figure[] as Figure[],
};

export type AudienceKey = "building" | "installer";

export const audience = {
	label: "Ihr Wechsel",
	cards: [
		{
			title: "Sie sind Verwalter?",
			text: "Heidi plant die Montage, informiert Ihre Mieter und dokumentiert jeden Zähler mit dem Installationstool. Sie haben einen persönlichen Ansprechpartner für Ihren ganzen Bestand.",
			cta: demoLink,
			image: "building",
		},
		{
			title: "Sie sind Installationsbetrieb?",
			text: "Werden Sie zertifizierter Heidi-Partner. Wir schulen Ihr Team und stellen Ihnen das Installationstool.",
			cta: partnerLink,
			image: "installer",
		},
	] satisfies {
		title: string;
		text: string;
		cta: Link;
		image: AudienceKey;
	}[],
};

export const quotes = {
	h2: ["Saubere Installation.", "Unsere Kunden sagen es selbst."] as [
		string,
		string,
	],
	keys: [
		"gerhard",
		"werne",
		"vitolus",
	] satisfies Testimonial["key"][] as Testimonial["key"][],
};

export const picture = {
	label: "Heidi",
	caption: ["Einmal installiert.", "Für immer digital."] as [string, string],
};

export const faq = {
	title: "Häufige Fragen",
	items: [
		{
			question: "Was ist das Heidi Installationstool?",
			answer:
				"Das Werkzeug, mit dem Heidi-Installateure Zähler tauschen und dokumentieren. Es zeigt das Gebäude als digitalen Zwilling mit allen Wohnungen und Zählern.",
		},
		{
			question: "Wie kommt der Installateur ins Tool?",
			answer:
				"Er bekommt für den Auftrag einen Link von Heidi. Darüber öffnet er den digitalen Zwilling des Gebäudes.",
		},
		{
			question: "Was wird dokumentiert?",
			answer:
				"Pro Zähler ein Foto vom alten Zähler mit Endstand und ein Foto vom neuen Zähler nach der Montage. Daraus entsteht das Übergabeprotokoll.",
		},
		{
			question: "Muss danach noch jemand in die Wohnung?",
			answer:
				"Für die Ablesung nicht. Heidi liest die Funkzähler aus der Ferne ab.",
		},
		{
			question: "Wer arbeitet mit dem Tool?",
			answer:
				"Heidis eigene Installationsflotte und regionale Installationsbetriebe, die Heidi schult und zertifiziert.",
			// 6hhBpn794w5tbp9t8Rk7CH
			more: {
				text: "Installationspartner werden",
				href: ROUTE_INSTALLATIONSPARTNER,
			},
		},
		{
			question: "Wo liegen die Daten?",
			answer: "Auf Servern in Deutschland, verarbeitet nach DSGVO und BDSG.",
			// Sb54rDQd5WS2r82skPe7UQ
			more: { text: "Mehr zu Sicherheit", href: ROUTE_SICHERHEIT },
		},
	] satisfies FaqItem[] as FaqItem[],
};

/** The glass closing card with the design's video button. */
export const closing = {
	h2: "Einmal in die Wohnung. Dann nie wieder.",
	text: "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.",
	/** The video button (the design's .dcta-b) → the booking page. */
	button: {
		text: "Live Demo buchen",
		sub: "Mit Ihrem Ansprechpartner",
		href: DEMO_HREF,
	},
};
