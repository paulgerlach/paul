/**
 * Every text and the example data of /verbaende, word for word from the
 * design, in the shapes of the shared `uv` template. Components hold markup
 * and behaviour only.
 *
 * The memberships, the associations' descriptions and logos, the
 * data-protection statements and the company claims need sign-off before the
 * cutover (plan §4.4).
 */
import { DEMO_HREF } from "$lib/landing/cta";
import type { Testimonial } from "$lib/landing/data/testimonials";
import type { FaqItem } from "$lib/landing/faqJsonLd";
import type {
	AppNavItem,
	DocTile,
	Figure,
	Link,
	ListEntry,
	Row,
} from "$lib/landing/sections/uv/types";
import { ROUTE_PRESSE, ROUTE_SICHERHEIT } from "$lib/routes";

/** Every "Demo buchen" leads to the closing card's signup form (plan, open question 1). */
const demoLink: Link = { text: "Demo buchen", href: DEMO_HREF };

export const hero = {
	srTitle: "Heidi Systems in den Verbänden der Branche",
	word: "Verbände",
	/**
	 * The design's #vb-css repeats the template's `lg` size after the template's
	 * rules, so it also holds below 620 px, where the template shrinks the word.
	 */
	wordSize: "clamp(40px, 11.4vw, 172px)",
	lead: "Heidi ist Kooperationspartner des VDIV und in den Verbänden DEUMESS und bved vernetzt.",
	primary: demoLink,
	secondary: { text: "Mehr erfahren", href: "#inhalt" } satisfies Link,
};

/** The associations' lines, as the design repeats them in the list and on the logo cards. */
const LINES = {
	vdiv: "Kooperationspartner Bund",
	deumess: "Verband unabhängiger Messdienstleister",
	bved: "Energie- und Wasserdatenmanagement",
};

/**
 * The hero's app window: the associations and data protection. Each status
 * is the same before and after (the design's data-a / data-b), so the loop
 * only turns the pills green.
 */
export const list = {
	label: "Heidi in den Verbänden",
	brand: "Heidi",
	nav: [
		{ icon: "users", text: "Verbände" },
		{ icon: "doc", text: "Datenschutz" },
		{ icon: "users", text: "Presse" },
	] satisfies AppNavItem[] as AppNavItem[],
	navFoot: "Verbände",
	head: "Verbände",
	tag: "Beispieldaten",
	title: "Gut vernetzt.",
	sub: "Heidi Systems · Berlin",
	entries: [
		{
			icon: "building",
			title: "VDIV",
			sub: LINES.vdiv,
			before: "Partner",
			after: "Partner",
		},
		{
			icon: "users",
			title: "DEUMESS",
			sub: LINES.deumess,
			before: "Vernetzt",
			after: "Vernetzt",
		},
		{
			icon: "chart",
			title: "bved",
			sub: LINES.bved,
			before: "Vernetzt",
			after: "Vernetzt",
		},
		{
			icon: "check",
			title: "Datenschutz",
			sub: "Verarbeitung nach DSGVO",
			before: "Konform",
			after: "Konform",
		},
	] satisfies ListEntry[] as ListEntry[],
};

export const statement = {
	label: "Worum es geht",
	text: "Messdienst lebt von Vertrauen: in korrekte Daten, faire Abrechnungen und verlässliche Partner. Darum ist Heidi in den Verbänden der Immobilien- und Messdienstbranche aktiv. Als Kooperationspartner des VDIV und vernetzt in DEUMESS und bved.",
};

export type LogoKey = keyof typeof LINES;
export type TileKind = LogoKey | "doc";

export const rows = {
	label: "So arbeitet Heidi",
	primary: demoLink,
	secondary: { text: "Häufige Fragen", href: "#faq" } satisfies Link,
	items: [
		{
			tag: "VDIV",
			title: ["Kooperationspartner", "des VDIV."],
			paragraphs: [
				"Der VDIV ist der Verband der Immobilienverwalter Deutschland. Heidi ist dort Kooperationspartner auf Bundesebene.",
				"So sind wir nah an den Fragen, die Verwaltungen im Alltag beschäftigen.",
			],
			tile: "vdiv",
			tone: "stone",
		},
		{
			tag: "DEUMESS",
			title: ["Vernetzt mit den", "Messdienstleistern."],
			paragraphs: [
				"DEUMESS ist der Verband unabhängiger Messdienstleister.",
				"Hier geht es um die Themen, die die ganze Branche betreffen, von der Heizkostenverordnung bis zur Fernablesung.",
			],
			tile: "deumess",
			tone: "stone",
		},
		{
			tag: "bved",
			title: ["Energie- und", "Wasserdaten."],
			paragraphs: [
				"Der bved ist der Bundesverband für Energie- und Wasserdatenmanagement.",
				"Ein Verband für alle, die Verbrauchsdaten erfassen, verarbeiten und abrechnen.",
			],
			tile: "bved",
			tone: "stone",
		},
		{
			tag: "Datenschutz",
			title: ["Sicher", "nach DSGVO."],
			paragraphs: [
				"Heidi verarbeitet die Daten Ihrer Liegenschaften und Mieter nach DSGVO.",
				"Alle Daten liegen auf Servern in Deutschland.",
			],
			tile: "doc",
			tone: "stone",
		},
	] satisfies Row<TileKind>[] as Row<TileKind>[],
};

/** Rows 1–3: the line under each association's logo. */
export const logos: Record<LogoKey, string> = LINES;

/** Row 4: the data processing. */
export const doc = {
	title: "Datenverarbeitung",
	sub: "Heidi Plattform",
	rows: [
		{ label: "Server in Deutschland" },
		{ label: "Verarbeitung nach DSGVO" },
		{ label: "Verschlüsselte Übertragung" },
	],
	result: "DSGVO-konform",
} satisfies DocTile;

export const rotator = {
	// The design's aria-label, as on the other `uv` pages.
	label: "Was Heidi übernimmt",
	lead: "Heidi ist vernetzt mit:",
	phrases: ["VDIV", "DEUMESS", "bved"],
	intervalMs: 2300,
};

export const numbers = {
	h2: "Heidi auf einen Blick",
	/** The figure before the photo. */
	first: {
		value: "3",
		text: "Verbände der Immobilien- und Messdienstbranche",
		count: 3,
	} satisfies Figure as Figure,
	/** The figures after the photo, all words (the design's .dt). */
	rest: [
		{ value: "Bund", text: "Kooperationspartner des VDIV", compact: true },
		{ value: "DE", text: "Server in Deutschland", compact: true },
		{ value: "DSGVO", text: "konforme Verarbeitung", compact: true },
		{ value: "Berlin", text: "Sitz von Heidi Systems", compact: true },
	] satisfies Figure[] as Figure[],
};

export type AudienceKey = "conference" | "building";

export const audience = {
	label: "Ihr Wechsel",
	cards: [
		{
			title: "Sie sind ein Verband?",
			text: "Sprechen Sie uns an. Wir freuen uns über den Austausch zu Messdienst, Fernablesung und Heizkostenverordnung.",
			// 2HKfqpmyVhcXiJWmoomtHP
			cta: { text: "Zur Presseseite", href: ROUTE_PRESSE },
			image: "conference",
		},
		{
			title: "Sie sind Verwaltung?",
			text: "Lernen Sie Heidi kennen. In einer Demo zeigen wir Ihnen, wie der Messdienst aus einer Hand funktioniert.",
			cta: demoLink,
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
	h2: ["Verlässlich.", "Unsere Kunden sagen es selbst."] as [string, string],
	keys: [
		"werne",
		"vitolus",
		"gerhard",
	] satisfies Testimonial["key"][] as Testimonial["key"][],
};

export const picture = {
	label: "Heidi",
	caption: ["Gut vernetzt.", "Sicher aufgestellt."] as [string, string],
};

export const faq = {
	title: "Häufige Fragen",
	items: [
		{
			question: "In welchen Verbänden ist Heidi?",
			answer:
				"Heidi ist Kooperationspartner des VDIV auf Bundesebene und in den Verbänden DEUMESS und bved vernetzt.",
		},
		{
			question: "Was ist der VDIV?",
			answer: "Der Verband der Immobilienverwalter Deutschland.",
		},
		{
			question: "Was ist DEUMESS?",
			answer: "Der Verband unabhängiger Messdienstleister.",
		},
		{
			question: "Was ist der bved?",
			answer: "Der Bundesverband für Energie- und Wasserdatenmanagement.",
		},
		{
			question: "Wie verarbeitet Heidi Daten?",
			answer: "Nach DSGVO und auf Servern in Deutschland.",
			// Sb54rDQd5WS2r82skPe7UQ
			more: { text: "Mehr zu Sicherheit", href: ROUTE_SICHERHEIT },
		},
	] satisfies FaqItem[] as FaqItem[],
};

/** The glass closing card; the signup form takes the design's video button's place. */
export const closing = {
	h2: "Ein verlässlicher Partner für Ihren Messdienst.",
	text: "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.",
	submitLabel: "Demo buchen",
};
