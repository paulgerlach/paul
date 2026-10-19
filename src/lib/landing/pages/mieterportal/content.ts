/**
 * Every text and the example data of /mieterportal, word for word from the
 * design. Components hold markup and behaviour only.
 *
 * The product description, the legal statements, the company claims and the
 * example data need sign-off before the cutover (plan §4.4). The KPIs (14 Tage,
 * 1–2 h) were confirmed on 2026-10-12.
 */
import { DEMO_HREF } from "$lib/landing/cta";
import type { Testimonial } from "$lib/landing/data/testimonials";
import type { FaqItem } from "$lib/landing/faqJsonLd";
import {
	ROUTE_HEIZKOSTENABRECHNUNG_PRUEFEN,
	ROUTE_SICHERHEIT,
	ROUTE_VERBRAUCHSINFORMATION,
} from "$lib/routes";
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

const NB = "\u00a0";

/** Confirmed KPIs, used in the numbers. */
export const KPI = {
	notice: "14",
	noticeUnit: "Tage",
	window: `1–2${NB}h`,
};

export const hero = {
	srTitle: "Das Heidi Mieterportal für Ihre Mieter",
	word: "Mieterportal",
	// The soft hyphen is the design's.
	lead: "Verbrauch, Verbrauchs­information und Termine. Für jede Wohnung an einem Ort.",
	primary: { text: "Demo buchen", href: DEMO_HREF } satisfies Link,
	secondary: { text: "Mehr erfahren", href: "#inhalt" } satisfies Link,
};

export const portal = {
	label: "Beispiel: Heidi Mieterportal",
	brand: "Heidi",
	nav: [
		{ icon: "chart", text: "Verbrauch" },
		{ icon: "doc", text: "Dokumente" },
		{ icon: "users", text: "Mitteilungen" },
	] satisfies AppNavItem[] as AppNavItem[],
	navFoot: "Mieterportal",
	head: "Mieterportal",
	tag: "Beispieldaten",
	title: "Willkommen zurück.",
	sub: "Wohnung 2. OG links · Beispiel",
	entries: [
		{
			icon: "chart",
			title: "Verbrauchsinfo September",
			sub: `Heizung · 131${NB}kWh`,
			before: "Neu",
			after: "Bereitgestellt",
		},
		{
			icon: "bell",
			title: "Montage Funkzähler",
			sub: "Do, 9 bis 11 Uhr",
			before: "Angekündigt",
			after: "Termin steht",
		},
		{
			icon: "trend",
			title: "Vergleich Vorjahresmonat",
			sub: `11${NB}% weniger verbraucht`,
			before: "Wird berechnet",
			after: "Aktuell",
		},
		{
			icon: "doc",
			title: "Verbrauchsinfo August",
			sub: `Heizung · 96${NB}kWh`,
			before: "Neu",
			after: "Bereitgestellt",
		},
	] satisfies ListEntry[] as ListEntry[],
};

export const statement = {
	label: "Worum es geht",
	text: "Ihre Mieter wollen wissen, wo sie stehen. Im Heidi Mieterportal sehen sie ihren Verbrauch jeden Monat, verglichen mit dem Vormonat, dem Vorjahr und dem Durchschnitt. Mit allem, was die Heizkostenverordnung verlangt. Für Ihr Team entsteht dabei keine Arbeit.",
};

export type TileKind = "calendar" | "phone" | "doc" | "bill";

export const rows = {
	label: "So arbeitet Heidi",
	primary: { text: "Demo buchen", href: DEMO_HREF } satisfies Link,
	secondary: { text: "Häufige Fragen", href: "#faq" } satisfies Link,
	items: [
		{
			tag: "Monatlich",
			title: ["Jeden Monat", "ein neuer Stand."],
			paragraphs: [
				"Heidi liest die Funkzähler aus der Ferne ab und stellt den Verbrauch jeden Monat im Portal bereit.",
				"Ohne Termin in der Wohnung und ohne Aufwand für Ihr Team.",
			],
			tile: "calendar",
			tone: "mint",
		},
		{
			tag: "Mitteilung",
			title: ["Mieter erfahren", "es zuerst."],
			paragraphs: [
				"Sobald eine neue Verbrauchsinformation da ist, bekommen Ihre Mieter eine Mitteilung.",
				"Ein Tipp genügt, und sie sehen ihren Verbrauch im Portal.",
			],
			tile: "phone",
			tone: "ink",
		},
		{
			tag: "Vergleich",
			title: ["Klar statt", "Zahlenkolonne."],
			paragraphs: [
				"Jede Information zeigt den Verbrauch des letzten Monats und vergleicht ihn mit Vormonat, Vorjahresmonat und einem Durchschnittsnutzer.",
				"So, wie es § 6a HeizkostenV verlangt.",
			],
			tile: "doc",
			tone: "stone",
		},
		{
			tag: "Verwaltung",
			title: ["Weniger Rückfragen", "bei Ihnen."],
			paragraphs: [
				"Wer seinen Verbrauch kennt, wird von der Jahresabrechnung nicht überrascht.",
				"Fragen, die sonst bei Ihrem Team landen, beantwortet das Portal.",
			],
			tile: "bill",
			tone: "mint",
		},
	] satisfies Row<TileKind>[] as Row<TileKind>[],
};

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
	/** The month being prepared (October); the ones before are done. */
	current: 9,
	done: "bereit",
	doing: "wird erstellt",
	open: "offen",
	noteDone: "{x} bereitgestellt",
	noteDoing: "{x} wird erstellt",
};

export const phone = {
	time: "9:41",
	app: "Heidi",
	title: "Ihre Verbrauchsinfo September",
	sub: "Jetzt im Mieterportal ansehen",
	label: "Heizung im September",
	value: `131${NB}kWh`,
	comparisons: [`11${NB}% unter Vorjahresmonat`],
	/** Monthly heating values up to the current month; the last is accent. */
	bars: [171, 184, 162, 131, 74, 22, 15, 14, 96, 131],
} satisfies PhoneTile;

export const doc = {
	title: "Verbrauchsinformation September",
	sub: "Heizung · in kWh · Beispiel",
	rows: [
		{ label: "Letzter Monat", value: "131", share: 82 },
		{ label: "Vormonat", value: "96", share: 60 },
		{ label: "Vorjahresmonat", value: "148", share: 92 },
		{ label: "Durchschnittsnutzer", value: "142", share: 89 },
	],
	result: "Alle Pflichtangaben enthalten",
} satisfies DocTile;

export const bill: BillTile = {
	without: "Ohne Portal",
	with: "Mit Heidi",
	rows: [
		{ kind: "cut", label: "Verbrauch erst mit der Abrechnung", value: "spät" },
		{ kind: "cut", label: "Rückfrage per Anruf bei Ihnen", value: "oft" },
		{ kind: "ok", label: "Verbrauch jeden Monat im Portal" },
		{ kind: "ok", label: "Montagetermin mit Zeitfenster" },
	],
	sum: { label: "Rückfragen an Ihr Team", before: "viele", after: "weniger" },
};

export const rotator = {
	label: "Was Heidi übernimmt",
	lead: "Im Mieterportal:",
	phrases: [
		"Verbrauch jeden Monat",
		"Vergleich zum Vorjahr",
		"Vergleich zum Durchschnitt",
		"Montagetermine",
	],
	intervalMs: 2300,
};

export const numbers = {
	h2: "Das Mieterportal in Zahlen",
	/** The figures before and after the dashboard tile (second in the bento). */
	first: {
		value: "12",
		unit: "×",
		text: "Verbrauchsinformationen pro Jahr und Wohnung",
		count: 12,
	} satisfies Figure as Figure,
	rest: [
		{
			value: "3",
			text: "Vergleiche je Information: Vormonat, Vorjahresmonat, Durchschnitt",
			count: 3,
		},
		{
			value: KPI.notice,
			unit: KPI.noticeUnit,
			text: "vorher erfahren Mieter vom Montagetermin",
			count: 14,
		},
		{ value: KPI.window, text: "Zeitfenster am Montagetag", compact: true },
		{ value: "0", text: "Handgriffe für Ihr Team" },
	] satisfies Figure[] as Figure[],
};

export type LineChart = {
	key: "kw" | "ww";
	title: string;
	unit: string;
	ticks: number[];
	max: number;
	values: number[];
};

export const dashboard = {
	label: "Beispiel: Heidi Dashboard",
	portfolio: { title: "Mein Portfolio", sub: "370 Wohnungen ausgewählt" },
	period: { title: "Zeitraum", sub: "01. Jan. – 04. Okt." },
	toggle: "Datenansicht",
	share: "Dashboard teilen",
	account: "Mein Konto",
	tabs: ["Täglich", "Wöchentlich", "Monatlich"],
	toast: {
		title: "Alle Zähler übertragen",
		sub: "Funkablesung abgeschlossen · gerade eben",
	},
	lastYear: "— Vorjahr",
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
	],
	charts: [
		{
			key: "kw",
			title: "Kaltwasser",
			unit: "m³",
			ticks: [0, 100, 200, 300, 400],
			max: 400,
			values: [20, 45, 70, 95, 230, 225, 235, 250, 262, 292],
		},
		{
			key: "ww",
			title: "Warmwasser",
			unit: "m³",
			ticks: [0, 25, 50, 75, 100, 125],
			max: 125,
			values: [4, 6, 9, 7, 16, 96, 68, 52, 74, 96],
		},
	] satisfies LineChart[] as LineChart[],
	status: {
		title: "Status",
		before: "Wird übertragen …",
		after: "In Ordnung · heute übertragen",
		rows: [
			"740 Heizkostenverteiler",
			"370 Warmwasserzähler",
			"370 Kaltwasserzähler",
			"7 Wärmemengenzähler",
		],
	},
	heating: {
		title: "Heizvolumen",
		bars: [92, 84, 70, 46, 22, 8, 6, 7, 24, 58],
	},
	empty: ["Einsparung", "Heizkörper"],
};

type AudienceEntry = {
	title: string;
	text: string;
	/** Without `href` the button isn't shown (README, open question 2). */
	cta: { text: string; href?: string };
	image: "building" | "office";
	objectPosition?: string;
};

export const audience = {
	label: "Für Verwalter und Mieter",
	cards: [
		{
			title: "Sie sind Verwalter?",
			text: "Das Mieterportal ist für Ihren ganzen Bestand dabei. Heidi stellt die Verbrauchsinformation bereit, Ihr Team muss nichts tun.",
			cta: { text: "Demo buchen", href: DEMO_HREF },
			image: "building",
		},
		{
			title: "Sie sind Mieter?",
			text: "Prüfen Sie Ihre Heizkostenabrechnung kostenlos. Fehlt die monatliche Verbrauchsinformation, steht Ihnen eventuell eine Kürzung zu.",
			cta: {
				text: "Zum Heizkostenabrechnungs-Checker",
				href: ROUTE_HEIZKOSTENABRECHNUNG_PRUEFEN,
			},
			image: "office",
			objectPosition: "50% 35%",
		},
	] satisfies AudienceEntry[] as AudienceEntry[],
};

export const quotes = {
	h2: ["Transparenz für Bewohner.", "Unsere Kunden sagen es selbst."] as [
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
	caption: ["Ihr Verbrauch.", "Jederzeit im Blick."] as [string, string],
};

export const faq = {
	title: "Häufige Fragen",
	items: [
		{
			question: "Was ist das Heidi Mieterportal?",
			answer:
				"Der Ort, an dem Ihre Mieter ihren Heiz- und Warmwasserverbrauch sehen. Heidi stellt dort jeden Monat die Verbrauchsinformation bereit und benachrichtigt Ihre Mieter.",
		},
		{
			question: "Was sehen die Mieter?",
			answer:
				"Den Verbrauch des letzten Monats in Kilowattstunden und den Vergleich mit Vormonat, Vorjahresmonat und einem Durchschnittsnutzer, wie es § 6a HeizkostenV verlangt.",
		},
		{
			question: "Muss unser Team etwas tun?",
			answer:
				"Nein. Heidi liest die Funkzähler aus der Ferne ab und stellt die Informationen automatisch bereit.",
		},
		{
			question:
				"Erfüllen wir damit die Pflicht zur monatlichen Verbrauchsinformation?",
			answer:
				"Ja. Seit 2022 müssen Mieter mit fernablesbaren Zählern monatlich informiert werden. Heidi übernimmt das über das Portal.",
			more: { text: "Mehr zur uVI", href: ROUTE_VERBRAUCHSINFORMATION },
		},
		{
			question: "Wo liegen die Daten?",
			answer: "Auf Servern in Deutschland, verarbeitet nach DSGVO und BDSG.",
			more: { text: "Mehr zu Sicherheit", href: ROUTE_SICHERHEIT },
		},
	] satisfies FaqItem[] as FaqItem[],
};

export const closing = {
	h2: "Transparenz für Ihre Mieter. Ohne Aufwand.",
	text: "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.",
	submitLabel: "Demo buchen",
};
