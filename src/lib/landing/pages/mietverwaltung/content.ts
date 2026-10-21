/**
 * Every text and the example data of /mietverwaltung, word for word from the
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
	CalendarTile,
	DocTile,
	Figure,
	Link,
	ListEntry,
	PhoneTile,
	Row,
} from "$lib/landing/sections/uv/types";
import {
	ROUTE_EINSPARRECHNER,
	ROUTE_FRISTENRECHNER,
	ROUTE_MIETERPORTAL,
	ROUTE_VERBRAUCHSINFORMATION,
} from "$lib/routes";

const NB = "\u00a0";

export const hero = {
	srTitle: "Messdienst für Mietverwaltungen mit Heidi",
	word: "Mietverwaltung",
	// The soft hyphens are the design's.
	lead: "Pünktlich zur Betriebs­kosten­abrechnung. Für jedes Objekt und jeden Eigentümer.",
	primary: { text: "Demo buchen", href: DEMO_HREF } satisfies Link,
	secondary: { text: "Mehr erfahren", href: "#inhalt" } satisfies Link,
};

/** The hero's dashboard mock: the owners and the status of their Abrechnung. */
export const list = {
	label: "Beispiel: Heidi Dashboard",
	brand: "Heidi",
	nav: [
		{ icon: "key", text: "Eigentümer" },
		{ icon: "doc", text: "Abrechnungen" },
		{ icon: "users", text: "Mieter" },
	] satisfies AppNavItem[] as AppNavItem[],
	navFoot: "Heidi Dashboard",
	head: "4 Eigentümer",
	tag: "Beispieldaten",
	title: "Abrechnungen nach Eigentümer.",
	sub: "Abrechnungsjahr 2025",
	entries: [
		{ title: "Eigentümer A", sub: "3 Objekte · 28 Einheiten" },
		{ title: "Eigentümer B", sub: "1 Objekt · 6 Einheiten" },
		{ title: "Eigentümer C", sub: "2 Objekte · 15 Einheiten" },
		{ title: "Eigentümer D", sub: "1 Objekt · 9 Einheiten" },
	].map((entry): ListEntry => ({
		icon: "user",
		...entry,
		before: "In Arbeit",
		after: "Bereit für BKA",
	})),
};

export const statement = {
	label: "Worum es geht",
	text: "Sie verwalten Mietshäuser und Sondereigentum im Auftrag vieler Eigentümer. Jeder erwartet eine pünktliche Betriebskostenabrechnung. Heidi liefert die Heizkostenabrechnung rechtzeitig, für jedes Objekt einzeln. Auch beim Mieterwechsel muss niemand zur Ablesung in die Wohnung.",
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
			tag: "Pünktlich",
			title: ["Fertig, bevor", "die Frist drückt."],
			paragraphs: [
				"Weil Funkzähler die Verbräuche laufend liefern, steht die Heizkostenabrechnung früh im Jahr bereit.",
				"So bleibt Zeit für die Betriebskostenabrechnung innerhalb der 12-Monats-Frist.",
			],
			tile: "calendar",
			tone: "mint",
		},
		{
			tag: "Mieterwechsel",
			title: ["Auszug.", "Ohne Termin."],
			paragraphs: [
				"Beim Mieterwechsel übernimmt Heidi die Zählerstände zum Stichtag per Funk.",
				"Keine Zwischenablesung vor Ort, keine Schätzwerte, keine Diskussion mit dem Vormieter.",
			],
			tile: "doc",
			tone: "stone",
		},
		{
			tag: "Eigentümer",
			title: ["Die Zahlen für", "jeden Eigentümer."],
			paragraphs: [
				"Im Dashboard sehen Sie die Verbräuche pro Objekt und Eigentümer.",
				"So haben Sie für Eigentümergespräche die Zahlen parat, statt sie zusammenzusuchen.",
			],
			tile: "bill",
			tone: "mint",
		},
		{
			tag: "Mieter",
			title: ["Weniger Rückfragen.", "Mehr Ruhe."],
			paragraphs: [
				[
					"Ihre Mieter sehen jeden Monat ihren Verbrauch im ",
					{ text: "Mieterportal", href: ROUTE_MIETERPORTAL },
					".",
				],
				"Wer seinen Verbrauch kennt, wird von der Abrechnung nicht überrascht. Das spart Rückfragen bei Ihnen.",
			],
			tile: "phone",
			tone: "ink",
		},
	] satisfies Row<TileKind>[] as Row<TileKind>[],
};

/** Twelve objects whose Abrechnung is finished one after another. */
export const calendar: CalendarTile = {
	months: Array.from({ length: 12 }, (_, i) => `Objekt ${i + 1}`),
	current: 11,
	done: "fertig",
	doing: "wird erstellt",
	open: "offen",
	noteDone: "{x}: Abrechnung fertig",
	noteDoing: "{x} wird erstellt",
};

/** A Zwischenablesung at a tenant's move-out: value rows, then a check row. */
export const doc = {
	title: "Zwischenablesung WE 07",
	sub: "Mieterwechsel · Beispiel",
	rows: [
		{ label: "Auszug", value: "30.09." },
		{ label: "Heizkostenverteiler", value: "per Funk" },
		{ label: "Warmwasser", value: "per Funk" },
		{ label: "Werte zum Stichtag übernommen" },
	],
	result: "Bereit für die Abrechnung",
} satisfies DocTile;

/** Two owners' objects: Eigentümer A's two, then Eigentümer B's one. */
export const bill = {
	without: "Eigentümer A",
	with: "Eigentümer B",
	rows: [
		{ kind: "a", label: `Lindenallee 12 · 18${NB}WE`, value: "fertig" },
		{ kind: "a", label: `Parkstraße 4 · 10${NB}WE`, value: "fertig" },
		{ kind: "b", label: `Am Markt 7 · 6${NB}WE`, value: "fertig" },
		{ kind: "base", label: "Verbrauchsinfo monatlich", value: "aktiv" },
	],
	sum: { label: "Objekte", before: "2", after: "1" },
} satisfies BillTile;

export const phone = {
	time: "9:41",
	app: "Heidi",
	title: "Ihre Verbrauchsinfo September",
	sub: "Jetzt im Mieterportal ansehen",
	label: "Heizung im September",
	value: `131${NB}kWh`,
	comparisons: ["Vergleich zum Vorjahresmonat"],
	/** Monthly heating values up to the current month (as on /mieterportal). */
	bars: [171, 184, 162, 131, 74, 22, 15, 14, 96, 131],
} satisfies PhoneTile;

export const rotator = {
	label: "Was Heidi übernimmt",
	lead: "Heidi übernimmt:",
	phrases: [
		"Zwischenablesung beim Auszug",
		"Heizkostenabrechnung",
		"Verbrauchsinfo für Mieter",
		"Zahlen für Eigentümer",
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

export const audience = {
	label: "Ihr Wechsel",
	cards: [
		{
			title: "Ihr Vertrag läuft noch?",
			text: "Heidi übernimmt Ihre bestehenden Zähler sofort. Mit dem Fristenrechner sehen Sie, bis wann Sie beim bisherigen Messdienst kündigen müssen.",
			// LWEbZPCoSDLT1D59BaULyE
			cta: { text: "Zum Fristenrechner", href: ROUTE_FRISTENRECHNER },
		},
		{
			title: "Was bringt der Wechsel?",
			text: "Rechnen Sie mit Ihren eigenen Zahlen: wie viel Arbeitszeit Heidi Ihrem Team abnimmt und welches Kürzungsrisiko Sie vermeiden.",
			// S3p5jbNkohWnWeZpfR75j9
			cta: { text: "Zum Einsparrechner", href: ROUTE_EINSPARRECHNER },
		},
	] satisfies {
		title: string;
		text: string;
		cta: { text: string; href?: string };
	}[],
};

export type CheckerTone = "take" | "cancel" | "bill";

/** The Portfolio-Checker in the first audience card (the design's #pcm). */
export const checker = {
	label: "Beispiel: Portfolio-Checker prüft Messdienstverträge",
	title: "Portfolio-Checker",
	checking: "Verträge werden geprüft …",
	done: "Für jede Liegenschaft der nächste Schritt",
	tag: "Beispieldaten",
	rows: [
		{
			name: "Lindenallee 12",
			units: "36 Einheiten",
			status: "Vertrag läuft bis 03/2029",
			action: "Vertrag übernehmen",
			tone: "take",
		},
		{
			name: "Gartenweg 3",
			units: "12 Einheiten",
			status: "Vertrag endet 12/2026",
			action: "Vertrag kündigen",
			tone: "cancel",
		},
		{
			name: "Am Stadtpark 7",
			units: "32 Einheiten",
			status: "Vertrag endet 08/2027",
			action: "Rechtzeitig kündigen",
			tone: "cancel",
		},
		{
			name: "Hofstraße 21",
			units: "18 Einheiten",
			status: "Heidi-Funkzähler aktiv",
			action: "Direkt abrechnen",
			tone: "bill",
		},
	] satisfies {
		name: string;
		/** In the markup but hidden by the design's CSS; read by screen readers. */
		units: string;
		status: string;
		action: string;
		tone: CheckerTone;
	}[],
};

export const quotes = {
	h2: [
		"Verwaltungen arbeiten mit Heidi.",
		"Unsere Kunden sagen es selbst.",
	] as [string, string],
	keys: [
		"vitolus",
		"werne",
		"gerhard",
	] satisfies Testimonial["key"][] as Testimonial["key"][],
};

export const picture = {
	label: "Heidi",
	caption: ["Pünktlich abgerechnet.", "Für jeden Eigentümer."] as [
		string,
		string,
	],
};

export const faq = {
	title: "Häufige Fragen",
	items: [
		{
			question:
				"Wir verwalten Objekte für viele verschiedene Eigentümer. Geht das?",
			answer:
				"Ja. Heidi rechnet jedes Objekt einzeln ab, und im Dashboard sehen Sie die Verbräuche pro Liegenschaft.",
		},
		{
			question: "Lohnt sich das auch für kleine Objekte?",
			answer:
				"Ja. Abgerechnet wird pro tatsächlich installiertem Zähler plus Abrechnungspauschale.",
		},
		{
			question: "Was passiert beim Mieterwechsel?",
			answer:
				"Die Zählerstände zum Auszug liegen per Funk vor. Eine Zwischenablesung vor Ort ist nicht nötig.",
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
	h2: "Pünktlich abrechnen. Jedes Jahr.",
	text: "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.",
	/** The video button (the design's .dcta-b) → the booking page. */
	button: {
		text: "Live Demo buchen",
		sub: "Mit Ihrem Ansprechpartner",
		href: DEMO_HREF,
	},
};
