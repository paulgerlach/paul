/**
 * Every text and the example data of /verbrauchsinformation, word for word
 * from the design, in the shapes of the shared `uv` template. Components hold
 * markup and behaviour only.
 *
 * The legal statements, the product description, the example data and the
 * expired texts need sign-off before the cutover (plan §4.4).
 */
import { DEMO_HREF } from "$lib/landing/cta";
import type { Testimonial } from "$lib/landing/data/testimonials";
import { isExpired, MONTHS } from "$lib/landing/deadline/deadline";
import type { FaqItem } from "$lib/landing/faqJsonLd";
import type {
	AppNavItem,
	BillTile,
	CalendarTile,
	DocTile,
	Figure,
	Link,
	PhoneTile,
	Row,
} from "$lib/landing/sections/uv/types";
import { deadlineFigure } from "$lib/landing/sections/uv/deadlineFigure";
import {
	ROUTE_HAUSVERWALTUNG,
	ROUTE_HEIZKOSTENABRECHNUNG_PRUEFEN,
	ROUTE_MIETERPORTAL,
	ROUTE_UPGRADE_NOW,
} from "$lib/routes";

const NB = " ";

export const hero = {
	srTitle: "uVI: Unterjährige Verbrauchsinformation mit Heidi",
	word: "uVI",
	// The soft hyphen is the design's.
	lead: "Unterjährige Verbrauchs­information. Jeden Monat automatisch bei Ihren Mietern.",
	primary: { text: "Demo buchen", href: DEMO_HREF } satisfies Link,
	secondary: { text: "Mehr erfahren", href: "#inhalt" } satisfies Link,
};

/** The hero's tenant-portal mock. */
export const mock = {
	label: "Beispiel: uVI im Mieterportal",
	brand: "Heidi",
	nav: [
		{ icon: "chart", text: "Verbrauch" },
		{ icon: "doc", text: "Dokumente" },
		{ icon: "bell", text: "Mitteilungen" },
	] satisfies AppNavItem[] as AppNavItem[],
	navFoot: "Mieterportal",
	tag: "Beispieldaten",
	title: "Ihr Verbrauch im",
	month: "September",
	sub: "Heizung · Wohnung 2. OG links",
	unit: "kWh",
	kpis: [
		{ label: "Letzter Monat", value: 131 },
		{ label: "Vormonat", value: 96 },
		{ label: "Vorjahresmonat", value: 148 },
		{ label: "Durchschnitt", value: 142 },
	],
	/** Heating per month, October to September; the last is highlighted. */
	bars: [62, 128, 171, 184, 162, 131, 74, 22, 15, 14, 96, 131],
	/** The bars' full height, as designed. */
	barMax: 190,
	monthLabels: ["Okt", "Jan", "Apr", "Jul", "Sep"],
};

export const statement = {
	label: "Worum es geht",
	text: "Seit 2022 müssen Mieter mit fernablesbaren Zählern jeden Monat über ihren Verbrauch informiert werden. Heidi übernimmt das für Sie. Jeden Monat, für jede Wohnung, mit allem, was die Heizkostenverordnung verlangt. Ihre Mieter sehen, wo sie stehen. Ihr Team hat damit keine Arbeit.",
};

export type TileKind = "calendar" | "doc" | "phone" | "bill";

export const rows = {
	label: "So funktioniert die uVI mit Heidi",
	primary: { text: "Demo buchen", href: DEMO_HREF } satisfies Link,
	secondary: { text: "Häufige Fragen", href: "#faq" } satisfies Link,
	items: [
		{
			tag: "Pflicht",
			title: ["Jeden Monat.", "Für jede Wohnung."],
			paragraphs: [
				`Sind fernablesbare Zähler verbaut, ist die monatliche Verbrauchsinformation Pflicht (§${NB}6a HeizkostenV).`,
				"Heidi liest die Zähler per Funk aus und stellt die uVI jeden Monat automatisch bereit. Ohne Termin, ohne Aufwand für Sie.",
			],
			tile: "calendar",
			tone: "mint",
		},
		{
			tag: "Inhalt",
			title: ["Alles drin, was", `§${NB}6a verlangt.`],
			paragraphs: [
				"Jede Information zeigt den Verbrauch des letzten Monats in Kilowattstunden und vergleicht ihn mit dem Vormonat, dem Vorjahresmonat und einem Durchschnittsnutzer.",
				"Vollständig, verständlich und für jede Wohnung einzeln.",
			],
			tile: "doc",
			tone: "stone",
		},
		{
			tag: "Mieter",
			title: ["Verständlich statt", "Zahlenkolonne."],
			paragraphs: [
				[
					"Ihre Mieter bekommen eine Mitteilung und sehen ihren Verbrauch im ",
					{ text: "Mieterportal", href: ROUTE_MIETERPORTAL },
					". Mit klaren Vergleichen statt Ablesewerten.",
				],
				"Wer seinen Verbrauch kennt, wird von der Jahresabrechnung nicht überrascht. Das spart Rückfragen bei Ihnen.",
			],
			tile: "phone",
			tone: "ink",
			secondary: { text: "Zum Mieterportal", href: ROUTE_MIETERPORTAL },
		},
		{
			tag: "Rechtssicher",
			title: ["Kein Kürzungsrecht.", "Keine Diskussion."],
			paragraphs: [
				`Fehlt die Verbrauchsinformation, dürfen Mieter ihren Anteil an den Heizkosten um 3${NB}% kürzen (§${NB}12 HeizkostenV).`,
				"Mit Heidi ist jede Information dokumentiert. In der Abrechnung gibt es dafür keinen Abzug.",
			],
			tile: "bill",
			tone: "mint",
		},
	] satisfies Row<TileKind>[] as Row<TileKind>[],
};

export const calendar: CalendarTile = {
	months: MONTHS.map((m) => m.slice(0, 3)),
	long: MONTHS,
	current: 9,
	done: "bereitgestellt",
	doing: "wird erstellt",
	open: "offen",
	noteDone: "{x} bereitgestellt",
	noteDoing: "{x} wird erstellt",
};

export const doc = {
	title: `Verbrauchsinformation ${mock.month}`,
	sub: "Heizung · in kWh",
	rows: [
		{ label: "Letzter Monat", value: "131", share: 82 },
		{ label: "Vormonat", value: "96", share: 60 },
		{ label: "Vorjahresmonat", value: "148", share: 92 },
		{ label: "Durchschnittsnutzer", value: "142", share: 89 },
	],
	result: "Alle Pflichtangaben enthalten",
} satisfies DocTile;

export const phone = {
	time: "9:41",
	app: "Heidi",
	title: `Ihre Verbrauchsinfo ${mock.month}`,
	sub: "Jetzt im Mieterportal ansehen",
	label: `Heizung im ${mock.month}`,
	value: `131${NB}kWh`,
	comparisons: [`11${NB}% unter Vorjahresmonat`, `8${NB}% unter Durchschnitt`],
	// The mock's last ten months, on its scale.
	bars: mock.bars.slice(2),
	max: mock.barMax,
} satisfies PhoneTile;

export const bill: BillTile = {
	without: "Ohne uVI",
	with: "Mit Heidi",
	rows: [
		{ kind: "base", label: "Heizkosten, Ihr Anteil", value: `1.240,00${NB}€` },
		{
			kind: "cut",
			label: `Kürzung §${NB}12 HeizkostenV (3${NB}%)`,
			value: `−37,20${NB}€`,
		},
		{ kind: "ok", label: "uVI monatlich bereitgestellt" },
	],
	sum: { label: "Abgerechnet", from: 1202.8, to: 1240 },
};

export const rotator = {
	label: "Inhalte der uVI",
	lead: "Jeden Monat neu:",
	phrases: [
		"Ihr Verbrauch in kWh",
		"Vergleich zum Vormonat",
		"Vergleich zum Vorjahresmonat",
		"Vergleich zum Durchschnitt",
	],
	intervalMs: 2300,
};

export const numbers = {
	h2: "Die uVI in Zahlen",
	/** The figure before the photo (second in the bento). */
	first: {
		value: "12",
		unit: "×",
		text: "Verbrauchsinformationen pro Jahr und Wohnung",
		count: 12,
	} satisfies Figure as Figure,
	/** The figures after the photo; `null` is the deadline's figure. */
	rest: [
		{
			value: "3",
			unit: "%",
			text: `Kürzungsrecht für Mieter, wenn die uVI fehlt (§${NB}12 HeizkostenV)`,
			count: 3,
		},
		{
			value: "3",
			text: "Vergleiche je Information: Vormonat, Vorjahresmonat, Durchschnitt",
			count: 3,
		},
		null,
		{ value: "0", text: "Handgriffe für Ihr Team" },
	] satisfies (Figure | null)[] as (Figure | null)[],
};

/** The bento's figures after the photo, with the deadline's figure for `now`. */
export function figures(now: number): Figure[] {
	const deadline = deadlineFigure(now);
	return numbers.rest.map((f) => f ?? deadline);
}

export type AudienceKey = "verwalter" | "mieter";

export const audience = {
	label: "Für wen",
	cards: [
		{
			title: "Sie sind Verwalter?",
			text: "Heidi stellt die uVI für Ihren ganzen Bestand bereit, rechnet nach HKVO ab und hält Ihnen die Mieterfragen vom Tisch.",
			cta: { text: "Erfahren Sie mehr", href: ROUTE_HAUSVERWALTUNG },
			image: "verwalter",
		},
		{
			title: "Sie sind Mieter?",
			text: "Prüfen Sie Ihre Heizkostenabrechnung kostenlos. Fehlt die monatliche Verbrauchsinformation, steht Ihnen eventuell eine Kürzung zu.",
			cta: {
				text: "Zur Heizkosten-Prüfung",
				href: ROUTE_HEIZKOSTENABRECHNUNG_PRUEFEN,
			},
			image: "mieter",
			objectPosition: "50% 30%",
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
	h2: ["Transparente Verbräuche.", "Unsere Kunden sagen es selbst."] as [
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
	caption: ["Klare Verbräuche,", "ruhige Mieter."] as [string, string],
};

type DeadlineFaqItem = FaqItem & { answerExpired?: string };

export const faq = {
	title: "Häufige Fragen",
	items: [
		{
			question: "Was ist die unterjährige Verbrauchsinformation (uVI)?",
			answer:
				"Eine monatliche Mitteilung an jeden Mieter über seinen Heiz- und Warmwasserverbrauch. Sie soll helfen, den eigenen Verbrauch besser einzuschätzen, nicht erst mit der Jahresabrechnung.",
		},
		{
			question: "Ab wann ist die uVI Pflicht?",
			answer: `Seit dem 1.${NB}Januar 2022 müssen Gebäudeeigentümer ihre Mieter monatlich informieren, sobald fernablesbare Zähler oder Heizkostenverteiler verbaut sind (§${NB}6a HeizkostenV).`,
		},
		{
			question: "Was muss in der uVI stehen?",
			answer:
				"Der Verbrauch des letzten Monats in Kilowattstunden, ein Vergleich mit dem Vormonat und dem Vorjahresmonat (soweit Daten vorliegen) sowie ein Vergleich mit einem Durchschnittsnutzer derselben Nutzerkategorie.",
		},
		{
			question: "Was passiert, wenn die uVI fehlt?",
			answer: `Mieter dürfen ihren Anteil an den Heizkosten in der Abrechnung um 3${NB}% kürzen (§${NB}12 HeizkostenV). Das gilt auch, wenn keine fernablesbaren Geräte verbaut sind, obwohl es Pflicht wäre.`,
		},
		{
			question: "Meine Zähler sind noch nicht fernablesbar. Was nun?",
			answer: `Bestehende Geräte müssen bis zum 31.${NB}Dezember 2026 nachgerüstet oder ersetzt werden. Heidi baut fernablesbare Funkzähler ein und übernimmt danach die uVI.`,
			// Placeholder until the content owner writes it (plan §4.4).
			answerExpired: `Seit dem 1.${NB}Januar 2027 müssen alle Zähler fernablesbar sein. Heidi baut fernablesbare Funkzähler ein und übernimmt danach die uVI.`,
			more: { text: "Jetzt noch umrüsten", href: ROUTE_UPGRADE_NOW },
		},
		{
			question: "Wie erhalten meine Mieter die uVI?",
			answer: `Heidi stellt die Verbrauchsinformation jeden Monat im <a href="${ROUTE_MIETERPORTAL}">Mieterportal</a> bereit und benachrichtigt Ihre Mieter. Für Sie entsteht dabei kein Aufwand.`,
		},
	] satisfies DeadlineFaqItem[] as DeadlineFaqItem[],
};

/** The FAQ for `now`: after the retrofit deadline, its expired answers. */
export function faqItems(now: number): FaqItem[] {
	const expired = isExpired(now);
	return faq.items.map(({ answerExpired, ...item }) => ({
		...item,
		answer: expired && answerExpired ? answerExpired : item.answer,
	}));
}

export const closing = {
	h2: "uVI abhaken. Jeden Monat.",
	text: "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.",
	submitLabel: "Demo buchen",
};
