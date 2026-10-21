/**
 * Every text and the example data of /funkzaehler, word for word from the
 * design, in the shapes of the shared `uv` template and of the page's device
 * gallery. Components hold markup and behaviour only.
 *
 * The devices and their properties, the company claims and the example data
 * need sign-off before the cutover (go-live gate §2).
 */
import { DEMO_HREF } from "$lib/landing/cta";
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
	PhoneTile,
	Row,
} from "$lib/landing/sections/uv/types";
import {
	ROUTE_INSTALLATIONSTOOL,
	ROUTE_MESSDIENSTWECHSEL,
	ROUTE_SICHERHEIT,
	ROUTE_UPGRADE_NOW,
} from "$lib/routes";

const SHY = "­";

/** Every "Demo buchen" leads to the closing card's signup form. */
const demoLink: Link = { text: "Demo buchen", href: DEMO_HREF };

export const hero = {
	srTitle:
		"Funkzähler von Heidi: Heizkostenverteiler, Wasserzähler und Rauchwarnmelder",
	word: "Funkzähler",
	lead: "Heizkostenverteiler, Wärme- und Wasserzähler und Rauchwarnmelder. Fernablesbar, ohne Termin in der Wohnung.",
	primary: demoLink,
	secondary: { text: "Mehr erfahren", href: "#inhalt" } satisfies Link,
};

/** The example building of the mocks. */
const PROPERTY = "Lindenallee 12";

/** The hero's app window: the building's devices sending their values. */
export const list = {
	label: "Beispiel: Heidi Dashboard",
	brand: "Heidi",
	nav: [
		{ icon: "meter", text: "Geräte" },
		{ icon: "doc", text: "Dokumente" },
		{ icon: "users", text: "Mieter" },
	] satisfies AppNavItem[] as AppNavItem[],
	navFoot: "Heidi Dashboard",
	head: "Heidi Dashboard",
	tag: "Beispieldaten",
	title: "Ihre Geräte",
	sub: `${PROPERTY} · Beispiel`,
	entries: [
		{
			icon: "radiator",
			title: "Heizkostenverteiler",
			sub: "36 Geräte · per Funk",
			before: "Wird übertragen",
			after: "Empfangen",
		},
		{
			icon: "tap",
			title: "Warmwasserzähler",
			sub: "12 Geräte · in Echtzeit",
			before: "Wird übertragen",
			after: "Empfangen",
		},
		{
			icon: "drop",
			title: "Kaltwasserzähler",
			sub: "12 Geräte · per Funk",
			before: "Wird übertragen",
			after: "Empfangen",
		},
		{
			icon: "smoke",
			title: "Rauchwarnmelder",
			sub: "24 Geräte · vernetzt",
			before: "Wird geprüft",
			after: "Bereit",
		},
	] satisfies ListEntry[] as ListEntry[],
};

export const statement = {
	label: "Worum es geht",
	text: "Ab 2027 müssen Zähler fernablesbar sein. Heidi stattet Ihre Liegenschaften mit Funkzählern für Heizung, Warm- und Kaltwasser aus, dazu mit vernetzten Rauchwarnmeldern. Die Werte kommen verschlüsselt per Funk in Ihr Dashboard. Zum Ablesen muss niemand mehr in die Wohnung.",
};

export type DeviceKey =
	| "heizkostenverteiler"
	| "waermemengenzaehler"
	| "kaltwasserzaehler"
	| "warmwasserzaehler"
	| "rauchwarnmelder"
	| "gateway";

export type Device = {
	key: DeviceKey;
	/** The category: the tab's small line and the panel's chip. */
	category: string;
	name: string;
	text: string;
	points: [string, string, string];
};

/** "Die Geräte": six tabs, each a device with its photo, text and three points. */
export const devices = {
	pill: "Die Geräte",
	h2: "Sechs Geräte. Ein System.",
	lead: "Alles, was Heidi in Ihren Liegenschaften verbaut, ist fernablesbar und spricht dieselbe Sprache: Funk.",
	label: "Geräte",
	/** A tab's time before the next one while auto-advancing. */
	intervalMs: 6000,
	items: [
		{
			key: "heizkostenverteiler",
			category: "Heizung",
			name: "Heizkostenverteiler",
			text: "Sitzt direkt am Heizkörper und erfasst, wie viel Wärme er abgibt. Den Wert sendet er per Funk, ohne dass jemand die Wohnung betreten muss.",
			points: [
				"Direkt am Heizkörper",
				"Fernablesbar per Funk",
				"Speichert Manipulationsversuche",
			],
		},
		{
			key: "waermemengenzaehler",
			category: "Heizung",
			name: "Wärmemengenzähler",
			text: "Misst die verbrauchte Wärmeenergie, etwa für eine Wohnung oder einen Heizkreis. Für zentrale Heizungsanlagen misst er eichrechtskonform und erkennt Leckagen.",
			points: ["Wärmeenergie in MWh", "Eichrechtskonform", "Erkennt Leckagen"],
		},
		{
			key: "kaltwasserzaehler",
			category: "Wasser",
			name: "Kaltwasserzähler",
			text: "Misst den Kaltwasserverbrauch per Ultraschall und sendet den Zählerstand per Funk. Eine akustische Leckageerkennung meldet, wenn Wasser läuft, wo es nicht laufen sollte.",
			points: [
				"Ultraschallmessung",
				"Schutzklasse IP68",
				"Akustische Leckageerkennung",
			],
		},
		{
			key: "warmwasserzaehler",
			category: "Wasser",
			name: "Warmwasserzähler",
			text: "Misst den Warmwasserverbrauch per Ultraschall. Den Verbrauch sehen Sie in Echtzeit im Dashboard, Ihre Mieter monatlich in ihrer Verbrauchsinformation.",
			points: [
				"Ultraschallmessung",
				"Schutzklasse IP68",
				"Verbrauch in Echtzeit",
			],
		},
		{
			key: "rauchwarnmelder",
			category: "Sicherheit",
			name: "Rauchwarnmelder",
			text: "Photoelektrische Rauchwarnmelder, untereinander vernetzt. Erkennt einer Rauch, schlagen alle gemeinsam Alarm.",
			points: [
				"Photoelektrisch",
				"Vernetzt, gemeinsamer Alarm",
				"Batterie bis zu 10 Jahre",
			],
		},
		{
			key: "gateway",
			category: "Übertragung",
			name: "Funk-Gateway",
			text: "Empfängt die Funkwerte der Geräte im Gebäude und überträgt sie verschlüsselt an Heidi. So landen die Daten ohne Ablesetermin in Ihrem Dashboard.",
			points: [
				"Empfängt alle Funkwerte",
				"Verschlüsselte Übertragung",
				"Daten auf Servern in Deutschland",
			],
		},
	] satisfies Device[] as Device[],
};

export type TileKind = "doc" | "phone" | "calendar" | "bill";

export const rows = {
	label: "So arbeitet Heidi",
	primary: demoLink,
	secondary: { text: "Häufige Fragen", href: "#faq" } satisfies Link,
	items: [
		{
			tag: "Heizung",
			title: [`Heizkosten${SHY}verteiler und Wärmezähler.`],
			paragraphs: [
				"Elektronische Heizkostenverteiler erfassen den Verbrauch direkt am Heizkörper und senden ihn per Funk. Manipulationsversuche speichert das Gerät.",
				"Für zentrale Heizungsanlagen misst der Wärmezähler eichrechtskonform und erkennt Leckagen.",
			],
			tile: "doc",
			tone: "stone",
		},
		{
			tag: "Wasser",
			title: ["Warm- und Kaltwasser.", "In Echtzeit."],
			paragraphs: [
				"Die Wasserzähler messen per Ultraschall, sind nach IP68 geschützt und senden ihren Stand per Funk. Den Warmwasserverbrauch sehen Sie in Echtzeit.",
				"Eine akustische Leckageerkennung meldet, wenn Wasser läuft, wo es nicht laufen sollte.",
			],
			tile: "phone",
			tone: "ink",
		},
		{
			tag: "Rauchwarnmelder",
			title: ["Vernetzte", "Rauchwarnmelder."],
			paragraphs: [
				"Photoelektrische Rauchwarnmelder mit einer Batterie für bis zu 10 Jahre.",
				"Die Melder sind vernetzt. Erkennt einer Rauch, schlagen alle gemeinsam Alarm.",
			],
			tile: "calendar",
			tone: "mint",
		},
		{
			tag: "Fernablesung",
			title: ["Ablesen ohne", "Wohnungstermin."],
			paragraphs: [
				"Alle Geräte sind fernablesbar und erfüllen damit die Pflicht, die ab dem 1.1.2027 gilt.",
				"Die Daten kommen verschlüsselt per Funk und liegen auf Servern in Deutschland.",
			],
			tile: "bill",
			tone: "mint",
		},
	] satisfies Row<TileKind>[] as Row<TileKind>[],
};

/** Row 1: a flat's heat cost allocators, received by radio. */
export const doc = {
	title: "Heizkostenverteiler",
	sub: "2. OG links · Beispiel",
	rows: [
		{ label: "Wohnzimmer", value: "Per Funk empfangen" },
		{ label: "Schlafzimmer", value: "Per Funk empfangen" },
		{ label: "Küche", value: "Per Funk empfangen" },
		{ label: "Manipulationsschutz aktiv" },
	],
	result: "Bereit für die Abrechnung",
} satisfies DocTile;

/** Row 2: the leak notice with today's cold water, high at night too. */
export const phone = {
	time: "9:41",
	app: "Heidi",
	title: "Hinweis: möglicher Wasserverlust",
	sub: "Kaltwasser · EG rechts · Beispiel",
	label: "Kaltwasser heute · EG rechts",
	value: "380 l",
	comparisons: ["Auffällig hoch, auch nachts"],
	bars: [14, 12, 16, 13, 15, 12, 14, 13, 15, 38],
} satisfies PhoneTile;

/** Row 3: the building's smoke alarms, checked flat by flat. */
export const calendar: CalendarTile = {
	months: [
		"EG li",
		"EG re",
		"1. OG li",
		"1. OG re",
		"2. OG li",
		"2. OG re",
		"3. OG li",
		"3. OG re",
		"DG",
	],
	current: 6,
	done: "bereit",
	doing: "wird geprüft",
	open: "offen",
	noteDone: "{x} bereit",
	noteDoing: "{x} wird geprüft",
};

/** Row 4: the old meters against Heidi's radio meters. */
export const bill = {
	without: "Alte Zähler",
	with: "Heidi Funkzähler",
	rows: [
		{
			kind: "cut",
			label: "Ablesetermin in jeder Wohnung",
			value: "jährlich",
		},
		{ kind: "cut", label: "Zählerstände per Hand notiert", value: "manuell" },
		{ kind: "ok", label: "Fernablesung per Funk" },
		{ kind: "ok", label: "Verbrauch im Dashboard" },
	],
	sum: { label: "Termine fürs Ablesen", before: "jedes Jahr", after: "keine" },
} satisfies BillTile;

export const rotator = {
	label: "Was Heidi übernimmt",
	lead: "Heidi Funkzähler:",
	phrases: [
		"Heizkostenverteiler",
		"Wärmezähler",
		"Warm- und Kaltwasserzähler",
		"Rauchwarnmelder",
	],
	intervalMs: 2300,
};

export const numbers = {
	h2: "Funkzähler in Zahlen",
	/** The figure before the photo. */
	first: {
		value: "15.000+",
		text: "Geräte erfolgreich installiert",
		compact: true,
	} satisfies Figure as Figure,
	/** The figures after the photo. */
	rest: [
		{ value: "IP68", text: "Schutzklasse der Wasserzähler", compact: true },
		{
			value: "10",
			unit: "Jahre",
			text: "Batterie bei Rauchwarnmeldern, bis zu",
			count: 10,
		},
		{ value: "0", text: "Ablesetermine in der Wohnung" },
		{
			value: "1.1.2027",
			text: "Ab dann müssen Zähler fernablesbar sein",
			compact: true,
		},
	] satisfies Figure[] as Figure[],
};

export type AudienceKey = "team" | "installer";

export const audience = {
	label: "Ihr Wechsel",
	cards: [
		{
			title: "Sie sind Verwalter?",
			text: "Heidi stattet Ihren ganzen Bestand mit Funkzählern aus. Alles aus einer Hand, mit einem persönlichen Ansprechpartner.",
			cta: demoLink,
			image: "team",
			objectPosition: "55% 15%",
		},
		{
			title: "So installieren wir.",
			text: "Unsere Installateure dokumentieren jeden Zähler mit dem Installationstool: ein Foto vom alten, eins vom neuen. Einmal in die Wohnung, dann nie wieder.",
			// JevEa3P3wSURqiTTH4R39n
			cta: { text: "Zum Installationstool", href: ROUTE_INSTALLATIONSTOOL },
			image: "installer",
		},
	] satisfies {
		title: string;
		text: string;
		cta: Link;
		image: AudienceKey;
		objectPosition?: string;
	}[],
};

export const quotes = {
	h2: ["Funkzähler im Einsatz.", "Unsere Kunden sagen es selbst."] as [
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
	caption: ["Fernablesbar.", "In jeder Liegenschaft."] as [string, string],
};

export const faq = {
	title: "Häufige Fragen",
	items: [
		{
			question: "Welche Geräte bietet Heidi an?",
			answer:
				"Elektronische Heizkostenverteiler, Wärmezähler, Warm- und Kaltwasserzähler sowie vernetzte Rauchwarnmelder. Alle Geräte werden per Funk abgelesen.",
		},
		{
			question: "Muss zum Ablesen noch jemand in die Wohnung?",
			answer:
				"Nein. Die Geräte senden ihre Werte per Funk. Heidi liest aus der Ferne ab, ohne Termin bei Ihren Mietern.",
		},
		{
			question: "Bis wann müssen Zähler fernablesbar sein?",
			answer:
				"Nach der Heizkostenverordnung müssen Zähler und Heizkostenverteiler ab dem 1.1.2027 fernablesbar sein.",
			// Jp8tqY82m7FZqMnWU4z9x9 ("Jetzt noch umrüsten")
			more: { text: "Jetzt noch umrüsten", href: ROUTE_UPGRADE_NOW },
		},
		{
			question: "Können wir bestehende Zähler behalten?",
			answer:
				"Heidi übernimmt bestehende Zähler und wertet sie aus, egal wie lange Ihr aktueller Vertrag noch läuft.",
			// JMrh8PhRG78mcMBK2LDkbS ("Heidi Anbieterwechsel")
			more: { text: "Mehr zum Wechsel", href: ROUTE_MESSDIENSTWECHSEL },
		},
		{
			question: "Wie lange hält die Batterie der Rauchwarnmelder?",
			answer: "Bis zu 10 Jahre.",
		},
		{
			question: "Wo liegen die Daten?",
			answer: "Auf Servern in Deutschland, verarbeitet nach DSGVO und BDSG.",
			// Sb54rDQd5WS2r82skPe7UQ
			more: { text: "Mehr zu Sicherheit", href: ROUTE_SICHERHEIT },
		},
	] satisfies FaqItem[] as FaqItem[],
};

/** The glass closing card; the signup form takes the design's video button's place. */
export const closing = {
	h2: "Funkzähler für Ihren ganzen Bestand.",
	text: "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.",
	submitLabel: "Demo buchen",
};
