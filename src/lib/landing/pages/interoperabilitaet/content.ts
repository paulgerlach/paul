/**
 * Every text and the example data of /geraete/herstellerunabhaengig
 * (Zähler-Interoperabilität), word for word from the design, in the shapes of
 * the shared `uv` template and of the page's own blocks (the hero's hub, the
 * rows' decoder and check tiles, the software orb, "Jeder Hersteller. Ein
 * Dashboard." and the legal frame). Components hold markup and behaviour only.
 *
 * The product as described, the legal statements, the company claims and the
 * example data need sign-off before the cutover (go-live gate §2).
 */
import { DEMO_HREF } from "$lib/landing/cta";
import type { Testimonial } from "$lib/landing/data/testimonials";
import type { FaqItem } from "$lib/landing/faqJsonLd";
import type {
	BillTile,
	CalendarTile,
	Figure,
	Link,
	Row,
} from "$lib/landing/sections/uv/types";
import {
	ROUTE_API_DOKUMENTATION,
	ROUTE_DASHBOARD,
	ROUTE_HKVO_LEITFADEN,
	ROUTE_MESSDIENSTWECHSEL,
	ROUTE_SICHERHEIT,
	ROUTE_UPGRADE_NOW,
} from "$lib/routes";

const SHY = "­";

/** Every "Demo buchen" leads to the booking page. */
const demoLink: Link = { text: "Demo buchen", href: DEMO_HREF };

/** The example building of the mocks. */
const PROPERTY = "Lindenallee 12";

export const hero = {
	srTitle:
		"Ein Dashboard. Jeder Hersteller. Zähler-Interoperabilität: Heidi liest Zähler jedes Herstellers aus und erstellt die Abrechnung",
	word: ["Ein Dashboard.", "Jeder Hersteller."] as [string, string],
	lead: "Heidi setzt auf Ihre bestehende Zählerinfrastruktur auf. Egal, von welchem Zählerhersteller Ihre Zähler stammen: Wir lesen sie aus, solange sie funkfähig sind, und erstellen daraus die Abrechnung.",
	primary: demoLink,
	secondary: { text: "Mehr erfahren", href: "#inhalt" } satisfies Link,
};

/**
 * A device photo: the four `/geraete` photos and the design's three water
 * meters (the design's .ipim-* classes).
 */
export type DeviceImage =
	"hkv" | "kwz" | "wwz" | "wmz" | "wasser" | "messkapsel" | "aufputz";

/**
 * The manufacturers' marks: colour and shape (16 × 16 SVG markup). The
 * design's hub gives its devices the six in turn; the cards use the first
 * three as "Hersteller A / B / C".
 */
export const BRANDS = [
	{ color: "#3B7DD8", shape: "circle" },
	{ color: "#E07A2E", shape: "triangle" },
	{ color: "#7C5CD6", shape: "square" },
	{ color: "#D9485F", shape: "diamond" },
	{ color: "#1FA39A", shape: "hexagon" },
	{ color: "#C99A1B", shape: "ring" },
] as const;

export type BrandShape = (typeof BRANDS)[number]["shape"];

/**
 * The hero's hub: devices of every manufacturer on the left (four shown,
 * moving up one row every fifth packet) send their values to the dashboard
 * on the right, whose groups fill up to the building's 102 devices.
 */
export const hub = {
	label:
		"Beispiel: Funkzähler verschiedener Hersteller senden ihre Werte an Heidi",
	any: "Jeder Hersteller",
	signal: "funkfähig",
	brandTitle: "Marke des Herstellers",
	/** `group`: the dashboard row it reports to. */
	devices: [
		{ name: `Heizkosten${SHY}verteiler`, image: "hkv", group: 0 },
		{ name: `Kaltwasser${SHY}zähler`, image: "kwz", group: 1 },
		{ name: `Warmwasser${SHY}zähler`, image: "wwz", group: 2 },
		{ name: `Wärme${SHY}zähler`, image: "wmz", group: 3 },
		{ name: `Wasser${SHY}zähler`, image: "wasser", group: 1 },
		{ name: `Messkapsel${SHY}zähler`, image: "messkapsel", group: 2 },
		{ name: `Aufputz-Wasser${SHY}zähler`, image: "aufputz", group: 1 },
	] satisfies { name: string; image: DeviceImage; group: number }[],
	brand: "Heidi",
	app: "Dashboard",
	live: "Live",
	property: PROPERTY,
	example: "Beispiel",
	united: "Alle Zähler vereint",
	read: "Geräte ausgelesen",
	groups: [
		{ name: "Heizkostenverteiler", image: "hkv", total: 48 },
		{ name: "Kaltwasserzähler", image: "kwz", total: 24 },
		{ name: "Warmwasserzähler", image: "wwz", total: 24 },
		{ name: "Wärmezähler", image: "wmz", total: 6 },
	] satisfies { name: string; image: DeviceImage; total: number }[],
};

export const statement = {
	label: "Worum es geht",
	text: "Sie haben schon funkfähige Zähler im Bestand? Dann muss nichts ausgetauscht werden. Egal, von welchem Zählerhersteller Ihre Zähler stammen: Heidi liest sie aus, solange sie funkfähig sind, und erstellt daraus die Heizkostenabrechnung. Und egal, wie lange Ihr bisheriger Vertrag noch läuft.",
};

export type TileKind = "decoder" | "bill" | "check" | "calendar";

export const rows = {
	label: "So arbeitet Heidi",
	primary: demoLink,
	secondary: { text: "Häufige Fragen", href: "#faq" } satisfies Link,
	items: [
		{
			tag: "Herstellerunabhängig",
			title: ["Gemischter Bestand.", "Kein Problem."],
			paragraphs: [
				"Ob Heizkostenverteiler, Wasser- oder Wärmezähler: Heidi liest Geräte aller Hersteller aus, solange sie funkfähig sind. Alle Werte laufen in einem Dashboard zusammen.",
				"Gemischte Bestände sind kein Problem. Jede Liegenschaft, jede Gerätegruppe, ein Überblick.",
			],
			tile: "decoder",
			tone: "stone",
		},
		{
			tag: "Bestand übernehmen",
			title: ["Kein Austausch.", "Kein Warten."],
			paragraphs: [
				"Heidi übernimmt Ihre vorhandenen Zähler und wertet sie aus, egal wie lange Ihr aktueller Vertrag noch läuft. Ein vorzeitiger Gerätetausch ist nicht nötig.",
				"Steht ein Tausch ohnehin an, zum Beispiel zum Ende der Eichfrist, stattet Heidi die Liegenschaft mit eigenen Funkzählern aus.",
			],
			tile: "bill",
			tone: "mint",
		},
		{
			tag: "Prüfung",
			title: ["Wir prüfen", "jede Gerätegruppe."],
			paragraphs: [
				"Die einzige Voraussetzung an das Gerät: Es muss funkfähig sein. Der Hersteller spielt keine Rolle. Heidi prüft jede Gerätegruppe und ordnet sie Ihren Nutzeinheiten zu.",
				"Für das Auslesen brauchen wir die digitalen Zugangsschlüssel der Geräte. Diese stellt in der Regel Ihr bisheriger Messdienst bereit. Wir unterstützen Sie bei der Anfrage.",
			],
			tile: "check",
			tone: "stone",
		},
		{
			tag: "Abrechnung",
			title: ["Ihre Zähler.", "Unsere Abrechnung."],
			paragraphs: [
				"Aus den ausgelesenen Werten erstellt Heidi die Heizkostenabrechnung nach Heizkostenverordnung, inklusive unterjähriger Verbrauchsinformation für Ihre Mieter.",
				"Mieter sehen ihren Verbrauch im Mieterportal, Sie behalten alle Liegenschaften im Dashboard.",
			],
			tile: "calendar",
			tone: "mint",
		},
	] satisfies Row<TileKind>[] as Row<TileKind>[],
};

/** Row 1: radio telegrams decoded into the devices' values. */
export const decoder = {
	title: "Funktelegramme",
	sub: `${PROPERTY} · Beispiel`,
	rows: [
		{
			image: "hkv",
			name: "Heizkostenverteiler",
			place: "2. OG links",
			value: "1.248 Einheiten",
		},
		{
			image: "kwz",
			name: "Kaltwasserzähler",
			place: "EG rechts",
			value: "84,31 m³",
		},
		{
			image: "wmz",
			name: "Wärmezähler",
			place: "Heizzentrale",
			value: "312,6 MWh",
		},
		{
			image: "wwz",
			name: "Warmwasserzähler",
			place: "1. OG links",
			value: "27,04 m³",
		},
		{
			image: "hkv",
			name: "Heizkostenverteiler",
			place: "DG",
			value: "906 Einheiten",
		},
	] satisfies {
		image: DeviceImage;
		name: string;
		place: string;
		value: string;
	}[],
	/** The done line, its last words bold. */
	done: ["Alle Werte zugeordnet,", "herstellerunabhängig"] as [string, string],
};

/** Row 2: replacing every meter against taking them over. */
export const bill = {
	without: "Austausch",
	with: "Übernahme",
	rows: [
		{ kind: "cut", label: "Alle Zähler neu montieren", value: "aufwendig" },
		{ kind: "cut", label: "Termin in jeder Wohnung", value: "nötig" },
		{ kind: "ok", label: "Vorhandene Zähler weiter nutzen" },
		{ kind: "ok", label: "Abrechnung durch Heidi" },
	],
	sum: { label: "Wohnungstermine", before: "für jedes Gerät", after: "keine" },
} satisfies BillTile;

/** Row 3: each device group checked in turn. */
export const check = {
	title: "Prüfung Gerätegruppe · Beispiel",
	groups: [
		{
			tab: "HKV",
			name: "Heizkostenverteiler",
			image: "hkv",
			count: "48 Geräte",
		},
		{
			tab: "Kaltwasser",
			name: "Kaltwasserzähler",
			image: "kwz",
			count: "24 Geräte",
		},
		{
			tab: "Warmwasser",
			name: "Warmwasserzähler",
			image: "wwz",
			count: "24 Geräte",
		},
		{ tab: "Wärme", name: "Wärmezähler", image: "wmz", count: "6 Geräte" },
	] satisfies {
		tab: string;
		name: string;
		image: DeviceImage;
		count: string;
	}[],
	items: [
		"Gerät ist funkfähig",
		"Zugangsschlüssel liegen vor",
		"Zuordnung zu den Nutzeinheiten",
	],
	result: "Wird eingebunden",
};

/** Row 4: the building's flats, billed one after another. */
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
	current: 7,
	done: "abgerechnet",
	doing: "in Arbeit",
	open: "offen",
	noteDone: "{x} abgerechnet",
	noteDoing: "{x} in Arbeit",
};

export const rotator = {
	label: "Was Heidi übernimmt",
	lead: "Heidi liest aus:",
	phrases: [
		"Heizkostenverteiler",
		"Wärmezähler",
		"Warmwasserzähler",
		"Kaltwasserzähler",
	],
	intervalMs: 2300,
};

export const numbers = {
	h2: "Interoperabilität in Zahlen",
	/** The figure before the photo. */
	first: {
		value: "1",
		text: "Dashboard für Zähler aller Hersteller",
		count: 1,
	} satisfies Figure as Figure,
	/** The figures after the photo. */
	rest: [
		{ value: "0", text: "Zähler, die Sie für den Start tauschen müssen" },
		{ value: "HKVO", text: "Konforme Heizkostenabrechnung", compact: true },
		{
			value: "bved",
			text: "Standard-Schnittstelle zu Ihrer Software",
			compact: true,
		},
		{
			value: "DE",
			text: "Alle Daten auf Servern in Deutschland",
			compact: true,
		},
	] satisfies Figure[] as Figure[],
};

export const audience = {
	label: "Ihr Wechsel",
	stock: {
		title: "Sie haben einen gemischten Bestand?",
		text: "Wir prüfen, welche Ihrer vorhandenen Zähler Heidi direkt übernehmen kann. Persönlich und mit einem festen Ansprechpartner.",
		cta: { text: "Bestand prüfen lassen", href: DEMO_HREF } satisfies Link,
		objectPosition: "55% 15%",
	},
	software: {
		title: "Sie nutzen eine Verwaltungssoftware?",
		text: "Über die Heidi API und den bved-Standard fließen Verbrauchsdaten und Abrechnungen direkt in Ihr System.",
		// 3AZnpE4apaUo694utixF1d
		cta: {
			text: "Zur API-Dokumentation",
			href: ROUTE_API_DOKUMENTATION,
		} satisfies Link,
	},
};

/** The orb in the software card: Heidi in the middle, eight systems around it. */
export const orb = {
	label: "Heidi verbindet sich mit Ihrer Verwaltungssoftware",
	brand: "Heidi",
	status: "verbunden",
	/** Clockwise from the top, with the design's colours. */
	systems: [
		{ name: "ERP", icon: "building", color: "#5B6CD8" },
		{ name: "CRM", icon: "people", color: "#E0607E" },
		{ name: "Buchhaltung", icon: "ledger", color: "#2FA37A" },
		{ name: "bved", icon: "exchange", color: "#E58B2C" },
		{ name: "Mieterportal", icon: "phone", color: "#3E9BD6" },
		{ name: "Dokumente", icon: "doc", color: "#8B62D9" },
		{ name: "Rechnungen", icon: "receipt", color: "#D9534F" },
		{ name: "Kalender", icon: "calendar", color: "#1FA39A" },
	] as const,
};

export type OrbIcon = (typeof orb.systems)[number]["icon"];

/** "Jeder Hersteller. Ein Dashboard.": four light cards with a scene each. */
export const dashboard = {
	h2: ["Jeder Hersteller.", "Ein Dashboard."] as [string, string],
	lead: "Die Heizkostenverordnung verpflichtet zur Interoperabilität. Damit lassen sich Zähler verschiedener Hersteller und Messdienste auslesen und in einem Dashboard zusammenführen.",
	more: "Mehr erfahren",
	cards: {
		reading: {
			title: ["Alle Zählerdaten.", "Herstellerunabhängig ausgelesen."],
			text: "Heizkostenverteiler, Wasser- und Wärmezähler: Heidi liest jedes funkfähige Gerät aus, für das die Zugangsschlüssel vorliegen.",
			// Hnv5z6cFcw3DyXPkw9nQx1
			href: ROUTE_DASHBOARD,
		},
		merge: {
			title: ["Alle Werte.", "In einem Dashboard vereint."],
			text: "Die Daten aller Hersteller laufen in einem Dashboard zusammen. Eine Übersicht für jede Liegenschaft, egal welche Geräte verbaut sind.",
			href: ROUTE_DASHBOARD,
		},
		law: {
			title: ["Rechtlich abgesichert.", "Durch die Heizkostenverordnung."],
			text: "Seit dem 1. Dezember 2022 müssen neu eingebaute fernablesbare Geräte mit Geräten anderer Hersteller zusammenarbeiten. Ein Wechsel der Ablesung muss möglich sein.",
			href: "#recht",
		},
		keys: {
			title: ["Offene Geräte.", "Ein Anbieter für Ihren Bestand."],
			text: "Das Schlüsselmaterial steht dem Gebäudeeigentümer zu. So lassen sich Bestände verschiedener Messdienste bei einem Anbieter bündeln.",
			// JMrh8PhRG78mcMBK2LDkbS
			href: ROUTE_MESSDIENSTWECHSEL,
		},
	} satisfies Record<
		string,
		{ title: [string, string]; text: string; href: string }
	>,
};

/** Card 1's phone: five devices of three manufacturers read one by one. */
export const reading = {
	title: "Funkablesung",
	sub: `${PROPERTY} · Beispieldaten`,
	/** `brand`: an index into `BRANDS`; `decimals` of the value. */
	rows: [
		{
			name: "Heizkostenverteiler",
			sub: "WE 01 · Hersteller A",
			brand: 0,
			value: 312,
			decimals: 0,
			unit: "Einh.",
		},
		{
			name: "Kaltwasserzähler",
			sub: "WE 01 · Hersteller B",
			brand: 1,
			value: 48.2,
			decimals: 1,
			unit: "m³",
		},
		{
			name: "Heizkostenverteiler",
			sub: "WE 02 · Hersteller C",
			brand: 2,
			value: 276,
			decimals: 0,
			unit: "Einh.",
		},
		{
			name: "Warmwasserzähler",
			sub: "WE 02 · Hersteller B",
			brand: 1,
			value: 21.7,
			decimals: 1,
			unit: "m³",
		},
		{
			name: "Wärmezähler",
			sub: "Keller · Hersteller A",
			brand: 0,
			value: 8412,
			decimals: 0,
			unit: "kWh",
		},
	],
};

/** Card 2's diagram: three manufacturers' values flowing into the dashboard. */
export const merge = {
	sources: [
		{
			key: "A",
			name: "Hersteller A",
			device: "Heizkostenverteiler",
			total: 48,
		},
		{ key: "B", name: "Hersteller B", device: "Wasserzähler", total: 36 },
		{ key: "C", name: "Hersteller C", device: "Wärmezähler", total: 18 },
	],
	/** Devices one packet adds. */
	step: 6,
	app: "Heidi Dashboard",
	united: "Zähler vereint",
};

/** Card 3: § 5 Abs. 5 checked clause by clause. */
export const lawCard = {
	sub: "Heizkostenverordnung",
	title: "§ 5 Abs. 5",
	stamp: ["Pflicht seit", "1.12.2022"] as [string, string],
	clauses: [
		"Interoperabel mit Geräten anderer Hersteller",
		"Wechsel der Ablesung muss möglich sein",
		"Schlüsselmaterial steht dem Eigentümer zu",
	],
	meter: { name: "Zähler", sub: "Hersteller A" },
	reader: { name: "Ablesung", sub: "Anbieter B" },
	note: "Zähler und Ablesung müssen nicht vom selben Anbieter kommen.",
};

/** Card 4's phone: three metering services' keys handed to the owner. */
export const keys = {
	title: "Ihr Bestand",
	before: "3 Messdienste",
	after: "1 Anbieter",
	services: [
		{ name: "Messdienst A", brand: 0 },
		{ name: "Messdienst B", brand: 1 },
		{ name: "Messdienst C", brand: 2 },
	],
	locked: "Geräte verschlüsselt",
	open: "Schlüssel übergeben",
	owner: "Eigentümer",
	material: "Schlüsselmaterial",
	logo: "Heidi",
	merged: "Ein Dashboard",
	mergedSub: "Messdienst A, B und C gebündelt",
};

export const quotes = {
	h2: ["Mit Heidi abrechnen.", "Unsere Kunden sagen es selbst."] as [
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
	caption: ["Herstellerunabhängig.", "In jeder Liegenschaft."] as [
		string,
		string,
	],
};

/** "Interoperabilität ist Pflicht." (#recht): the timeline, four cards, the summary. */
export const law = {
	h2: [
		"Interoperabilität ist Pflicht.",
		"Das regelt die Heizkostenverordnung.",
	] as [string, string],
	lead: "Seit dem 1. Dezember 2022 dürfen nur noch fernablesbare Geräte eingebaut werden, die mit Geräten anderer Hersteller zusammenarbeiten. So bleibt der Wechsel des Messdienstes jederzeit möglich.",
	/** `next`: the design's .nx with its "Nächste Frist" badge. */
	timeline: [
		{
			date: "1. Dez. 2021",
			text: "Neu eingebaute Zähler und Heizkostenverteiler müssen fernablesbar sein.",
			source: "§ 5 Abs. 2 HeizkostenV",
		},
		{
			date: "1. Dez. 2022",
			text: "Neue Geräte müssen mit Geräten anderer Hersteller interoperabel und sicher an ein Smart-Meter-Gateway anbindbar sein.",
			source: "§ 5 Abs. 2, 5 HeizkostenV",
		},
		{
			date: "31. Dez. 2026",
			badge: "Nächste Frist",
			text: "Nicht fernablesbare Geräte im Bestand müssen nachgerüstet oder ersetzt sein.",
			source: "§ 5 Abs. 3 HeizkostenV",
		},
		{
			date: "31. Dez. 2031",
			text: "Auch fernablesbare Geräte, die bis 1. Dez. 2022 eingebaut wurden, müssen dann interoperabel und an ein Smart-Meter-Gateway anbindbar sein.",
			source: "§ 5 Abs. 4 HeizkostenV",
		},
	] satisfies { date: string; badge?: string; text: string; source: string }[],
	/** Deadlines passed: the line reaches the first two dots (the design's 49 %). */
	passed: 2,
	cards: [
		{
			source: "§ 5 Abs. 5 HeizkostenV",
			title: "Geräte anderer Hersteller",
			text: "Fernablesbare Geräte müssen samt ihrer Schnittstellen mit gleichartigen Geräten anderer Hersteller zusammenarbeiten.",
		},
		{
			source: "§ 5 Abs. 5 HeizkostenV",
			title: "Der Wechsel bleibt möglich",
			text: "Übernimmt ein anderer Dienstleister die Ablesung, muss er die Geräte selbst fernablesen können.",
		},
		{
			source: "§ 5 Abs. 5 HeizkostenV",
			title: "Schlüssel für den Eigentümer",
			text: "Das Schlüsselmaterial der Geräte ist dem Gebäudeeigentümer kostenfrei zur Verfügung zu stellen.",
		},
		{
			source: "§ 12 HeizkostenV",
			title: "3 % Kürzungsrecht",
			text: "Sind die Geräte nach Ablauf der Frist nicht fernablesbar, dürfen Mieter ihren Kostenanteil um 3 % kürzen.",
		},
	],
	summary: {
		title: "Was das für Sie heißt",
		text: "Heidi liest Ihre fernablesbaren Zähler herstellerunabhängig aus. Die Zugangsschlüssel fragen wir gemeinsam mit Ihnen beim bisherigen Messdienst an. Nicht fernablesbare Geräte rüstet Heidi auf eigene Funkzähler um.",
		// SJbSeTYRqntQxpZQ8RVNf7
		guide: {
			text: "HKVO-Leitfaden lesen",
			href: ROUTE_HKVO_LEITFADEN,
		} satisfies Link,
		// Jp8tqY82m7FZqMnWU4z9x9
		upgrade: {
			text: "Jetzt noch umrüsten",
			href: ROUTE_UPGRADE_NOW,
		} satisfies Link,
	},
	note: "Überblick über § 5 und § 12 der Heizkostenverordnung, keine Rechtsberatung.",
};

export const faq = {
	title: "Häufige Fragen",
	items: [
		{
			question:
				"Spielt es eine Rolle, von welchem Zählerhersteller unsere Zähler stammen?",
			answer:
				"Nein. Heidi ist herstellerunabhängig und liest Zähler jedes Zählerherstellers aus, solange die Geräte funkfähig sind. Für das Auslesen brauchen wir die digitalen Zugangsschlüssel, die wir gemeinsam mit Ihnen beim bisherigen Messdienst anfragen.",
		},
		{
			question: "Welche Zähler kann Heidi einbinden?",
			answer:
				"Heizkostenverteiler, Wärme-, Warm- und Kaltwasserzähler aller Hersteller, solange die Geräte funkfähig sind. Für das Auslesen brauchen wir die digitalen Zugangsschlüssel, die Heidi gemeinsam mit Ihnen beim bisherigen Messdienst anfragt.",
		},
		{
			question: "Müssen wir unsere Zähler austauschen?",
			answer:
				"Nein. Heidi übernimmt vorhandene Zähler und wertet sie aus, egal wie lange Ihr bisheriger Vertrag noch läuft.",
			// JMrh8PhRG78mcMBK2LDkbS ("Heidi Anbieterwechsel")
			more: { text: "Mehr zum Wechsel", href: ROUTE_MESSDIENSTWECHSEL },
		},
		{
			question: "Ist Interoperabilität gesetzlich vorgeschrieben?",
			answer:
				"Ja. Seit dem 1. Dezember 2022 dürfen nach § 5 Abs. 5 HeizkostenV nur fernablesbare Geräte eingebaut werden, die mit Geräten anderer Hersteller interoperabel sind. Fernablesbare Geräte, die bis dahin eingebaut wurden, müssen diese Anforderung nach dem 31. Dezember 2031 erfüllen.",
			more: { text: "Zum rechtlichen Rahmen", href: "#recht" },
		},
		{
			question: "Was ist mit Zählern, die nicht funkfähig sind?",
			answer:
				"Ab dem 1.1.2027 müssen Zähler und Heizkostenverteiler fernablesbar sein. Nicht funkfähige Geräte rüstet Heidi auf eigene Funkzähler um.",
			// Jp8tqY82m7FZqMnWU4z9x9 ("Jetzt noch umrüsten")
			more: { text: "Jetzt noch umrüsten", href: ROUTE_UPGRADE_NOW },
		},
		{
			question: "Woher kommen die Zugangsschlüssel?",
			answer:
				"In der Regel von Ihrem bisherigen Messdienst. Heidi unterstützt Sie bei der Anfrage.",
		},
		{
			question: "Wer erstellt die Heizkostenabrechnung?",
			answer:
				"Heidi. Aus den ausgelesenen Werten entsteht die Abrechnung nach Heizkostenverordnung, auf Knopfdruck statt nach Monaten.",
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
	h2: "Ihre Zähler. Unsere Abrechnung.",
	text: "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.",
	/** The video button (the design's .dcta-b) → the booking page. */
	button: {
		text: "Live Demo buchen",
		sub: "Mit Ihrem Ansprechpartner",
		href: DEMO_HREF,
	},
};
