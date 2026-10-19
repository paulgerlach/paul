/**
 * Every text and the example data of /hausverwaltung, word for word from the
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
	ROUTE_FRISTENRECHNER,
	ROUTE_SCHNITTSTELLEN,
	ROUTE_VERBRAUCHSINFORMATION,
} from "$lib/routes";

const NB = " ";

export const hero = {
	srTitle: "Messdienst für Hausverwaltungen mit Heidi",
	word: "Hausverwaltung",
	// The soft hyphen is the design's.
	lead: "Zähler, Ablesung und Heizkosten­abrechnung für Ihre Mietobjekte. Aus einer Hand.",
	primary: { text: "Demo buchen", href: DEMO_HREF } satisfies Link,
	secondary: { text: "Mehr erfahren", href: "#inhalt" } satisfies Link,
};

/** The hero's dashboard mock: the buildings and their status. */
export const list = {
	label: "Beispiel: Heidi Dashboard",
	brand: "Heidi",
	nav: [
		{ icon: "building", text: "Liegenschaften" },
		{ icon: "doc", text: "Abrechnungen" },
		{ icon: "users", text: "Mieter" },
	] satisfies AppNavItem[] as AppNavItem[],
	navFoot: "Heidi Dashboard",
	head: "24 Objekte",
	tag: "Beispieldaten",
	title: "Ihre Liegenschaften.",
	sub: "Heizperiode 2025 · alle Objekte",
	entries: [
		{ title: "Lindenallee 12", sub: "18 Einheiten · per Funk" },
		{ title: "Parkstraße 4", sub: "12 Einheiten · per Funk" },
		{ title: "Am Markt 7", sub: "26 Einheiten · per Funk" },
		{ title: "Gartenweg 21", sub: "9 Einheiten · per Funk" },
	].map((entry): ListEntry => ({
		icon: "building",
		...entry,
		before: "Ablesung läuft",
		after: "Abrechnung fertig",
	})),
};

export const statement = {
	label: "Worum es geht",
	text: "Als Hausverwaltung koordinieren Sie heute Ablesetermine, beantworten Fragen zur Abrechnung und tippen Werte ab. Heidi nimmt Ihnen das ab. Funkzähler statt Termine, Abrechnung per Klick, Daten direkt in Ihrer Software. Sie unterschreiben einmal, wir kümmern uns um den Rest.",
};

export type TileKind = "calendar" | "doc" | "phone" | "bill";

/** Confirmed KPIs (2026-10-12), in the phone and the numbers. */
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
			tag: "Ablesung",
			title: ["Abgelesen.", "Ohne Termin."],
			paragraphs: [
				"Heidi verbaut Funkzähler und liest jede Wohnung aus der Ferne ab.",
				"Keine Ablesetermine, keine Zettel im Treppenhaus, keine fehlenden Werte.",
			],
			tile: "calendar",
			tone: "mint",
		},
		{
			tag: "Abrechnung",
			// The soft hyphen is the design's.
			title: ["Heizkosten­abrechnung.", "Per Klick."],
			paragraphs: [
				"Weil alle Verbräuche vorliegen, entsteht die Abrechnung nach HKVO für jede Einheit per Klick.",
				"Sie prüfen nur noch, was auffällt.",
			],
			tile: "doc",
			tone: "stone",
		},
		{
			tag: "Mieter",
			title: ["Mieter informiert.", "Automatisch."],
			paragraphs: [
				`Heidi kündigt die Montage ${KPI.notice} Tage vorher an, mit einem Zeitfenster von 1 bis 2 Stunden.`,
				"Danach bekommen Ihre Mieter jeden Monat ihre Verbrauchsinfo. Ihr Team hat damit keine Arbeit.",
			],
			tile: "phone",
			tone: "ink",
		},
		{
			tag: "Software",
			title: ["Direkt in", "Ihrer Software."],
			paragraphs: [
				"Verbrauchsdaten und Abrechnungen landen direkt in Ihrem ERP- oder CRM-System.",
				"Kein Abtippen, keine Exporte per E-Mail, keine doppelte Pflege.",
			],
			tile: "bill",
			tone: "mint",
		},
	] satisfies Row<TileKind>[] as Row<TileKind>[],
};

/** The units of one building, read by radio one after another. */
export const calendar: CalendarTile = {
	months: Array.from(
		{ length: 12 },
		(_, i) => `WE ${String(i + 1).padStart(2, "0")}`,
	),
	current: 11,
	done: "per Funk",
	doing: "wird abgelesen",
	open: "offen",
	noteDone: "{x} abgelesen",
	noteDoing: "{x} wird abgelesen",
};

export const doc = {
	title: "Heizkostenabrechnung 2025",
	sub: `${list.entries[0].title} · 18 Einheiten · Beispiel`,
	rows: [
		{ label: "Verbräuche aller Einheiten" },
		{ label: "Kosten aus Ihren Rechnungen übernommen" },
		{ label: "Verteilung nach HKVO" },
		{ label: "CO₂-Kostenaufteilung" },
	],
	result: "Abrechnung fertig",
} satisfies DocTile;

export const phone = {
	time: "9:41",
	app: "Heidi",
	title: "Montage Ihrer Funkzähler",
	sub: `In ${KPI.notice} Tagen · Zeitfenster 1 bis 2 Stunden`,
	label: "Ihr Termin",
	value: "Do, 9 bis 11 Uhr",
	comparisons: [`${KPI.notice} Tage vorher angekündigt`],
	details: [
		{ label: "Wohnung", value: "2. OG links" },
		{ label: "Geräte", value: "Heizung, Wasser" },
		{ label: "Dauer", value: "1 bis 2 Stunden" },
	],
} satisfies PhoneTile;

export const bill = {
	without: "Heute",
	with: "Mit Heidi",
	rows: [
		{ kind: "cut", label: "Ablesewerte als PDF", value: "manuell" },
		{ kind: "cut", label: "Werte ins ERP abtippen", value: "manuell" },
		{ kind: "ok", label: "Verbräuche automatisch im ERP" },
		{ kind: "ok", label: "Abrechnung als Datensatz" },
		{ kind: "base", label: "Liegenschaften", value: "24" },
	],
	sum: { label: "Doppelte Pflege", before: "ja", after: "nein" },
} satisfies BillTile;

export const rotator = {
	label: "Was Heidi übernimmt",
	lead: "Heidi übernimmt:",
	phrases: [
		"Zähler und Montage",
		"Ablesung per Funk",
		"Heizkostenabrechnung",
		"Verbrauchsinfo für Mieter",
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

export type AudienceKey = "contract" | "savings";

export const audience = {
	label: "Ihr Wechsel",
	cards: [
		{
			title: "Ihr Vertrag läuft noch?",
			text: "Heidi übernimmt Ihre bestehenden Zähler sofort. Mit dem Fristenrechner sehen Sie, bis wann Sie beim bisherigen Messdienst kündigen müssen.",
			// LWEbZPCoSDLT1D59BaULyE
			cta: { text: "Zum Fristenrechner", href: ROUTE_FRISTENRECHNER },
			image: "contract",
		},
		{
			title: "Was bringt der Wechsel?",
			text: "Rechnen Sie mit Ihren eigenen Zahlen: wie viel Arbeitszeit Heidi Ihrem Team abnimmt und welches Kürzungsrisiko Sie vermeiden.",
			// No Einsparrechner yet (plan README, open question 3).
			cta: { text: "Zum Einsparrechner" },
			image: "savings",
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
		"Hausverwaltungen arbeiten mit Heidi.",
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
	caption: ["Ihre Objekte.", "Unser Aufwand."] as [string, string],
};

export const faq = {
	title: "Häufige Fragen",
	items: [
		{
			question: "Wir verwalten viele kleine Objekte. Lohnt sich das?",
			answer:
				"Ja. Heidi rechnet jedes Objekt einzeln ab. Abgerechnet wird pro tatsächlich installiertem Zähler.",
		},
		{
			question: "Was ist mit Objekten, deren Vertrag noch läuft?",
			answer:
				"Heidi übernimmt bestehende Zähler und wertet sie sofort aus, unabhängig davon, wie lange der bisherige Vertrag noch läuft.",
		},
		{
			question: "Welche Software können wir anbinden?",
			answer: `Heidi übergibt Verbrauchsdaten und Abrechnungen an Ihr ERP- oder CRM-System. Welche Systeme wir anbinden, sehen Sie unter <a href="${ROUTE_SCHNITTSTELLEN}">Schnittstellen</a>.`,
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
	h2: "Ihr Bestand. Unser Messdienst.",
	text: "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.",
	submitLabel: "Demo buchen",
};
