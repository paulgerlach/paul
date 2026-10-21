/**
 * Every text and the example data of /weg-verwaltung, word for word from the
 * design, in the shapes of the shared `uv` template. Components hold markup
 * and behaviour only.
 *
 * The product description, the company claims, the pricing, the legal
 * statements and the example data need sign-off before the cutover (plan
 * §4.4). The KPIs 14 Tage and 1–2 h were confirmed on 2026-10-12.
 */
import { DEMO_HREF } from "$lib/landing/cta";
import type { Testimonial } from "$lib/landing/data/testimonials";
import type { FaqItem } from "$lib/landing/faqJsonLd";
import { deadlineFigure } from "$lib/landing/sections/uv/deadlineFigure";
import type {
	AppNavItem,
	BillTile,
	CalendarCell,
	CalendarTile,
	DocTile,
	Figure,
	Link,
	ListEntry,
	PhoneTile,
	Row,
} from "$lib/landing/sections/uv/types";
import {
	ROUTE_FRISTENRECHNER,
	ROUTE_MUSTER_KUENDIGUNG,
	ROUTE_VERBRAUCHSINFORMATION,
} from "$lib/routes";

const NB = " ";

export const hero = {
	srTitle: "Heizkostenabrechnung für WEG-Verwaltungen mit Heidi",
	// A non-breaking hyphen (U+2011), as the design's &#8209;: the word never breaks.
	word: "WEG‑Verwaltung",
	// The soft hyphens are the design's.
	lead: "Heizkosten­abrechnung für Eigentümer­gemeinschaften. Rechtzeitig vor der ETV.",
	primary: { text: "Demo buchen", href: DEMO_HREF } satisfies Link,
	secondary: { text: "Mehr erfahren", href: "#inhalt" } satisfies Link,
};

/** The hero's dashboard mock: the owners' associations and their status. */
export const list = {
	label: "Beispiel: Heidi Dashboard",
	brand: "Heidi",
	nav: [
		{ icon: "users", text: "Gemeinschaften" },
		{ icon: "doc", text: "Abrechnungen" },
		{ icon: "users", text: "Eigentümer" },
	] satisfies AppNavItem[] as AppNavItem[],
	navFoot: "Heidi Dashboard",
	head: "4 Gemeinschaften",
	tag: "Beispieldaten",
	title: "Ihre Gemeinschaften.",
	sub: "Wirtschaftsjahr 2025",
	entries: [
		{ title: "WEG Lindenallee 12", sub: "18 Einheiten · ETV im Mai" },
		{ title: "WEG Parkstraße 4", sub: "12 Einheiten · ETV im Juni" },
		{ title: "WEG Am Markt 7", sub: "26 Einheiten · ETV im April" },
		{ title: "WEG Gartenweg 21", sub: "9 Einheiten · ETV im Mai" },
	].map((entry): ListEntry => ({
		icon: "users",
		...entry,
		before: "Abrechnung offen",
		after: "Vor ETV fertig",
	})),
};

export const statement = {
	label: "Worum es geht",
	text: "Für WEG-Verwaltungen zählt Planbarkeit. Ein Wechsel, der zur Eigentümerversammlung passt. Eine Heizkostenabrechnung, die rechtzeitig vor der ETV vorliegt und die Eigentümer nachvollziehen können. Und eine Vollmacht statt vieler Unterschriften.",
};

export type TileKind = "calendar" | "doc" | "phone" | "bill";

/** Confirmed KPIs (2026-10-12), in the numbers. */
export const KPI = {
	notice: 14,
	window: `1–2${NB}h`,
};

export const rows = {
	label: "So arbeitet Heidi",
	primary: { text: "Demo buchen", href: DEMO_HREF } satisfies Link,
	secondary: { text: "Häufige Fragen", href: "#faq" } satisfies Link,
	items: [
		{
			tag: "ETV",
			// The soft hyphen is the design's.
			title: ["Passend zur", "Eigentümer­versammlung."],
			paragraphs: [
				"Vertragsende, Kündigungsfrist und Eigentümerversammlung auf einer Zeitleiste.",
				"So beschließen Sie den Wechsel rechtzeitig und nicht erst, wenn sich der Vertrag schon verlängert hat.",
			],
			tile: "calendar",
			tone: "stone",
		},
		{
			tag: "Vollmacht",
			title: ["Eine Vollmacht.", "Statt vieler Termine."],
			paragraphs: [
				"Nach dem Beschluss genügt eine Unterschrift der Verwaltung.",
				"Heidi kündigt beim bisherigen Messdienst, plant die Montage und informiert die Bewohner.",
			],
			tile: "bill",
			tone: "mint",
		},
		{
			tag: "Abrechnung",
			title: ["Nachvollziehbar.", "Für jede Einheit."],
			paragraphs: [
				`Heidi verteilt die Heizkosten nach HKVO: einen Teil nach Fläche, 50 bis 70${NB}% nach Verbrauch.`,
				"Jede Einheit bekommt eine Abrechnung, die Eigentümer und Mieter verstehen.",
			],
			tile: "doc",
			tone: "stone",
		},
		{
			tag: "Eigentümer",
			title: ["Transparenz für", "alle Eigentümer."],
			paragraphs: [
				"Selbstnutzer und Mieter sehen ihren Verbrauch jeden Monat im Portal.",
				"Die Verwaltung sieht alle Einheiten im Dashboard. Fragen in der ETV beantworten Sie mit Zahlen.",
			],
			tile: "phone",
			tone: "ink",
		},
	] satisfies Row<TileKind>[] as Row<TileKind>[],
};

const MONTHS = [
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
];

/** The year's milestones; the other months are placeholders. */
const MILESTONES: Record<string, { label: string; note: string }> = {
	Mai: { label: "ETV", note: "Mai: ETV beschließt den Wechsel" },
	Sep: { label: "Kündigung", note: "Sep: Heidi kündigt per Vollmacht" },
	Dez: { label: "Vertragsende", note: "Dez: Heidi übernimmt" },
};

/** One year: the ETV decides, Heidi gives notice, Heidi takes over. */
export const calendar: CalendarTile = {
	months: MONTHS,
	cells: MONTHS.map((month): CalendarCell =>
		month in MILESTONES
			? { kind: "milestone", ...MILESTONES[month] }
			: { kind: "placeholder" },
	),
	current: 11,
	open: "offen",
};

export const bill = {
	without: "Ohne Heidi",
	with: "Mit Heidi",
	rows: [
		{ kind: "cut", label: "Kündigung und Fristen prüfen", value: "Sie" },
		{ kind: "cut", label: "Montage mit Bewohnern abstimmen", value: "Sie" },
		{ kind: "ok", label: "Vollmacht unterschreiben" },
		{ kind: "ok", label: "Kündigung, Montage, Information", value: "Heidi" },
	],
	sum: { label: "Ihr Aufwand", before: "hoch", after: "eine Unterschrift" },
} satisfies BillTile;

export const doc = {
	title: "Kostenverteilung 2025",
	sub: `${list.entries[0].title} · Beispiel`,
	rows: [
		{ label: "Grundkosten", value: `30${NB}%`, share: 30 },
		{ label: "Verbrauchskosten", value: `70${NB}%`, share: 70 },
		{ label: "Verteilschlüssel nach Beschluss" },
		{ label: "Pflichtangaben nach HKVO" },
	],
	result: "Rechtzeitig vor der ETV",
} satisfies DocTile;

export const phone = {
	time: "9:41",
	app: "Heidi",
	title: "Ihre Verbrauchsinfo September",
	sub: `${list.entries[0].title} · Einheit 7`,
	label: "Heizung im September",
	value: `96${NB}kWh`,
	comparisons: ["Vergleich zum Vormonat"],
	/** Monthly heating values up to the current month; the last is accent. */
	bars: [162, 171, 150, 118, 61, 19, 12, 14, 74, 96],
} satisfies PhoneTile;

export const rotator = {
	label: "Was Heidi übernimmt",
	lead: "Heidi übernimmt:",
	phrases: [
		"Kündigung per Vollmacht",
		"Montage und Ablesung",
		"Abrechnung vor der ETV",
		"Verbrauchsinfo für alle Einheiten",
	],
	intervalMs: 2300,
};

export const numbers = {
	h2: "Heidi in Zahlen",
	/** The figure before the photo (second in the bento). */
	first: {
		value: "92",
		unit: "%",
		text: "der Montagen gelingen beim ersten Termin",
		count: 92,
	} satisfies Figure as Figure,
	/** The figures after the photo; `null` is the deadline's figure. */
	rest: [
		{
			value: String(KPI.notice),
			unit: "Tage",
			text: "vorher informieren wir Ihre Mieter über die Montage",
			count: KPI.notice,
		},
		{
			value: KPI.window,
			text: "Zeitfenster für Ihre Mieter am Montagetag",
			compact: true,
		},
		{
			value: "1",
			text: "fester Ansprechpartner für Ihren ganzen Bestand",
			count: 1,
		},
		null,
	] satisfies (Figure | null)[] as (Figure | null)[],
};

/** The bento's figures after the photo, with the deadline's figure for `now`. */
export function figures(now: number): Figure[] {
	const deadline = deadlineFigure(now);
	return numbers.rest.map((f) => f ?? deadline);
}

export type AudienceKey = "notice" | "template";

export const audience = {
	label: "Ihr Wechsel",
	cards: [
		{
			title: "Wann muss die WEG kündigen?",
			text: "Mit dem Fristenrechner sehen Sie, bis wann gekündigt werden muss. So planen Sie den Beschluss in der richtigen ETV.",
			// LWEbZPCoSDLT1D59BaULyE
			cta: { text: "Zum Fristenrechner", href: ROUTE_FRISTENRECHNER },
			image: "notice",
		},
		{
			title: "Muster-Kündigung für den Messdienst",
			text: "Die Vorlage für den bisherigen Anbieter. Oder Heidi kündigt für Sie per Vollmacht.",
			// 4WYU5hjVsWSLrxuo7wsdm6
			cta: { text: "Zur Muster-Kündigung", href: ROUTE_MUSTER_KUENDIGUNG },
			image: "template",
		},
	] satisfies {
		title: string;
		text: string;
		cta: { text: string; href?: string };
		image: AudienceKey;
		objectPosition?: string;
	}[],
};

export const quotes = {
	h2: [
		"Verwaltungen arbeiten mit Heidi.",
		"Unsere Kunden sagen es selbst.",
	] as [string, string],
	keys: [
		"werne",
		"vitolus",
		"gerhard",
	] satisfies Testimonial["key"][] as Testimonial["key"][],
};

export const picture = {
	label: "Heidi",
	caption: ["Ruhige ETV.", "Klare Zahlen."] as [string, string],
};

export const faq = {
	title: "Häufige Fragen",
	items: [
		{
			question: "Braucht es einen Beschluss der Eigentümer?",
			// "Fristenrechner" is plain text in the design too.
			answer:
				"Für den Wechsel des Messdienstes sollte ein Beschluss oder eine Vollmacht vorliegen. Mit dem Fristenrechner sehen Sie, welche ETV rechtzeitig vor dem Vertragsende liegt.",
		},
		{
			question: "Können wir mitten in der Laufzeit wechseln?",
			answer:
				"Heidi übernimmt bestehende Zähler und wertet sie sofort aus, auch bei laufendem Vertrag. Die Kündigung beim bisherigen Anbieter erledigen wir per Vollmacht.",
		},
		{
			question: "Wie werden die Heizkosten verteilt?",
			answer: `Nach Heizkostenverordnung wird ein Teil der Kosten nach Fläche verteilt und 50 bis 70${NB}% nach Verbrauch. Den genauen Schlüssel legt die Gemeinschaft fest.`,
		},
		{
			question: "Was kostet Heidi?",
			answer:
				"Abgerechnet wird pro tatsächlich installiertem Zähler plus Abrechnungspauschale. Ab 1.000 Einheiten erstellen wir ein Angebot für Ihren Bestand.",
		},
		{
			question: "Müssen wir auf das Vertragsende warten?",
			// "Fristenrechner": LWEbZPCoSDLT1D59BaULyE
			answer: `Nein. Heidi übernimmt bestehende Zähler und wertet sie sofort aus, egal wie lange Ihr aktueller Vertrag noch läuft. Bis wann Sie kündigen müssen, zeigt der <a href="${ROUTE_FRISTENRECHNER}">Fristenrechner</a>.`,
		},
		{
			question: "Ist die monatliche Verbrauchsinformation inklusive?",
			answer: `Ja. Heidi stellt Ihren Mietern die unterjährige Verbrauchsinformation jeden Monat automatisch bereit, so wie es §${NB}6a HeizkostenV verlangt.`,
			more: { text: "Mehr zur uVI", href: ROUTE_VERBRAUCHSINFORMATION },
		},
	] satisfies FaqItem[] as FaqItem[],
};

export const closing = {
	h2: "Planbar wechseln. Vor der nächsten ETV.",
	text: "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.",
	/** The video button (the design's .dcta-b) → the booking page. */
	button: {
		text: "Live Demo buchen",
		sub: "Mit Ihrem Ansprechpartner",
		href: DEMO_HREF,
	},
};
