/**
 * Texts of /messdienstanbieter-vergleich, word for word from the design
 * (https://claude.ai/artifact/Tms67Y5GnupQ4MPsxm8ux6), including the eight
 * criteria the design builds in its script, the score's verdicts and the
 * calculator's start values. The comparison, the criteria and the legal
 * statements await sign-off (plan §4.4).
 */
import { DEMO_HREF } from "$lib/landing/cta";
import { DEFAULT_LOGO_ORDER } from "$lib/landing/data/logos";
import type { Testimonial } from "$lib/landing/data/testimonials";
import type { FaqItem } from "$lib/landing/faqJsonLd";
import type { SplitHeading } from "$lib/landing/types";
import { ROUTE_MESSDIENSTWECHSEL, ROUTE_UPGRADE_NOW } from "$lib/routes";
import type { IconName } from "./icons";

/**
 * Target of every "Demo buchen" and offer link: the design's booking page
 * (44SBXKXJaSp6bvGMnbpZj6), /demo-buchen.
 */
export const BOOKING_HREF = DEMO_HREF;

/** Step 1's section, the target of "Vergleich starten ↓". */
export const COMPARE_ID = "vergleich";
/** Step 2's section, the target of "Zum Kostenrechner →". */
export const COSTS_ID = "kosten";

export const hero = {
	pill: "Messdienstanbieter-Vergleich",
	h1: "Wie gut ist Ihr Messdienst",
	h1Accent: "wirklich?",
	lead: "Stellen Sie Ihren heutigen Anbieter in acht Kriterien neben Heidi und rechnen Sie aus, was Sie pro Wohnung zahlen. Mit dieser Zahl gehen Sie in jedes Angebotsgespräch.",
	start: { text: "Vergleich starten", href: `#${COMPARE_ID}` },
	// 44SBXKXJaSp6bvGMnbpZj6 ("Demo buchen")
	demo: { text: "Demo buchen", href: BOOKING_HREF },
	ticks: [
		"8 Kriterien",
		"Kostenrechner pro Wohnung",
		"Keine Daten gespeichert",
	],
	/** The preview card (.mv-peek), hidden from screen readers like the design. */
	peek: {
		you: "Ihr Anbieter",
		heidi: "Heidi",
		rows: [
			"Fernablesung per Funk",
			"Alles aus einer Hand",
			"Verbrauchsinfo jeden Monat",
			"Abrechnung per Klick",
			"Direkt im ERP",
		],
		result: "Ergebnis",
		unknown: "? / 8",
		full: "8 / 8",
	},
};

export const logos = {
	text: "Hausverwaltungen in ganz Deutschland rechnen bereits mit Heidi ab.",
	order: DEFAULT_LOGO_ORDER,
};

export type Criterion = {
	key: string;
	icon: IconName;
	title: string;
	text: string;
};

export const criteria = {
	pill: "Schritt 1 · Leistungen",
	h2: {
		text: "Was leistet Ihr Anbieter? ",
		muted: "Kreuzen Sie an.",
	} satisfies SplitHeading,
	items: [
		{
			key: "signal",
			icon: "signal",
			title: "Fernablesung per Funk",
			text: "Alle Geräte werden ohne Termin in der Wohnung abgelesen.",
		},
		{
			key: "tool",
			icon: "tool",
			title: "Alles aus einer Hand",
			text: "Zähler, Montage, Ablesung und Abrechnung von einem Anbieter.",
		},
		{
			key: "bell",
			icon: "bell",
			title: "Monatliche Verbrauchsinfo",
			text: "Geht automatisch an alle Mieter, wie es § 6a HeizkostenV verlangt.",
		},
		{
			key: "calc",
			icon: "calc",
			title: "Abrechnung per Klick",
			text: "Die Heizkostenabrechnung entsteht direkt im Dashboard.",
		},
		{
			key: "chart",
			icon: "chart",
			title: "Dashboard für alle Objekte",
			text: "Verbräuche aller Liegenschaften auf einen Blick.",
		},
		{
			key: "server",
			icon: "server",
			title: "Direkt in Ihrem ERP",
			text: "Verbrauchsdaten und Abrechnungen fließen in Ihr ERP- oder CRM-System.",
		},
		{
			key: "euro",
			icon: "euro",
			title: "Klare Preise",
			text: "Abgerechnet wird pro installiertem Zähler plus Abrechnungspauschale.",
		},
		{
			key: "user",
			icon: "user",
			title: "Feste Ansprechperson",
			text: "Eine Person bei Heidi, die Ihr Portfolio kennt.",
		},
	] satisfies Criterion[],
	/** The toggle's buttons, in the design's order. */
	answers: [
		{ value: "y", label: "Ja" },
		{ value: "n", label: "Nein" },
		{ value: "u", label: "?" },
	],
	/** The toggle group's label; `{title}` is the criterion. */
	groupLabel: "{title} bei Ihrem Anbieter",
	/** Title of Heidi's tick. */
	heidi: "Heidi",
};

export const score = {
	label: "Ihr Ergebnis",
	you: "Ihr Anbieter",
	heidi: "Heidi",
	heidiCount: "8 / 8",
	/** `{n}` is a number; `one` is used for 1. */
	verdicts: {
		empty: "Kreuzen Sie links an, was Ihr Anbieter heute leistet.",
		open: { one: "1 Kriterium noch offen.", many: "{n} Kriterien noch offen." },
		all: "Ihr Anbieter erfüllt alle acht Kriterien. Dann lohnt der Blick auf die Kosten pro Wohnung.",
		ahead: {
			one: "Heidi liegt bei 1 Kriterium vorn.",
			many: "Heidi liegt bei {n} Kriterien vorn.",
		},
	},
	gapsLabel: "Hier liegt Heidi vorn",
	unsure: "bei Ihnen unklar",
	// 44SBXKXJaSp6bvGMnbpZj6
	cta: { text: "Mit Heidi vergleichen", href: BOOKING_HREF },
};

export type CostKey = "we" | "hkv" | "wz" | "phkv" | "pwz" | "pabr";

export type CostField = {
	key: CostKey;
	label: string;
	/** The start value (the design's placeholders). */
	value: string;
	/** A whole-number field (`type="number"`) with its bounds. */
	min?: number;
	max?: number;
	/** A euro amount (`type="text"`, `inputmode="decimal"`, "€" after it). */
	euro?: boolean;
};

export type CostGroup = { title: string; small?: string; fields: CostField[] };

export const costs = {
	pill: "Schritt 2 · Kosten",
	h2: {
		text: "Was zahlen Sie heute ",
		muted: "pro Wohnung?",
	} satisfies SplitHeading,
	lead: "Messdienstkosten stehen oft verteilt über Gerätemiete, Ablesung und Abrechnung. Tragen Sie die Werte aus Ihrer letzten Abrechnung ein. Die Startwerte sind nur Platzhalter.",
	groups: [
		{
			title: "Ihr Bestand",
			fields: [
				{ key: "we", label: "Wohnungen", value: "120", min: 1, max: 20000 },
				{
					key: "hkv",
					label: "Heizkostenverteiler je Wohnung",
					value: "5",
					min: 0,
					max: 30,
				},
				{
					key: "wz",
					label: "Wasserzähler je Wohnung",
					value: "2",
					min: 0,
					max: 10,
				},
			],
		},
		{
			title: "Ihre Kosten",
			small: "pro Jahr",
			fields: [
				{
					key: "phkv",
					label: "Miete je Heizkostenverteiler",
					value: "8",
					euro: true,
				},
				{
					key: "pwz",
					label: "Miete je Wasserzähler",
					value: "12",
					euro: true,
				},
				{
					key: "pabr",
					label: "Ablesung und Abrechnung je Wohnung",
					value: "25",
					euro: true,
				},
			],
		},
	] as CostGroup[],
	result: {
		label: "Ihre Messdienstkosten",
		unit: "€ pro Wohnung und Jahr",
		legend: ["Heizkostenverteiler", "Wasserzähler", "Ablesung & Abrechnung"],
		year: "Pro Jahr, ganzer Bestand",
		six: "Über 6 Jahre",
		tip: "6 Jahre = Eichfrist für Wasser- und Wärmezähler",
		// 44SBXKXJaSp6bvGMnbpZj6
		cta: { text: "Heidi-Angebot für diesen Bestand", href: BOOKING_HREF },
	},
	note: "Vereinfachte Rechnung ohne Wärmezähler, Rauchmelder und Sonderleistungen. Ihre Angaben bleiben in Ihrem Browser.",
};

export const tips = {
	pill: "Worauf Sie achten",
	h2: {
		text: "Sechs Fragen, ",
		muted: "bevor Sie unterschreiben.",
	} satisfies SplitHeading,
	items: [
		{
			title: "Wann endet mein Vertrag?",
			text: "Laufzeiten und Kündigungsfristen unterscheiden sich je Liegenschaft. Der Portfolio-Checker von Heidi zeigt, wann Ihre Verträge enden.",
		},
		{
			title: "Sind alle Geräte fernablesbar?",
			text: "Bis 31.12.2026 müssen Heizkostenverteiler, Wärme- und Warmwasserzähler fernablesbar sein. Sonst dürfen Mieter um 3 % kürzen.",
			// Jp8tqY82m7FZqMnWU4z9x9 ("Jetzt noch umrüsten")
			link: { text: "Zur Umrüstpflicht", href: ROUTE_UPGRADE_NOW },
		},
		{
			title: "Wann stehen Eichungen an?",
			text: "Wasser- und Wärmezähler müssen alle sechs Jahre getauscht oder geeicht werden. Heizkostenverteiler sind nicht eichpflichtig.",
		},
		{
			title: "Was kostet es pro Wohnung?",
			text: "Einzelpreise sind schwer zu vergleichen. Rechnen Sie alle Posten auf eine Wohnung und ein Jahr um.",
			link: { text: "Zum Kostenrechner", href: `#${COSTS_ID}` },
		},
		{
			title: "Passt es zu meiner Software?",
			text: "Fragen Sie, ob Verbrauchsdaten und Abrechnungen direkt in Ihr ERP- oder CRM-System fließen, oder ob Sie Dateien abtippen.",
		},
		{
			title: "Wie läuft die Montage?",
			text: "Ankündigungsfrist, Zeitfenster für Mieter und Quote beim ersten Termin entscheiden, wie viel Aufwand bei Ihnen landet.",
		},
	] satisfies {
		title: string;
		text: string;
		link?: { text: string; href: string };
	}[],
};

export const switching = {
	pill: "Wechsel",
	h2: "Wechseln, ohne aufs Vertragsende zu warten.",
	text: "Heidi wertet Ihre vorhandenen Zähler aus, egal wie lange der Vertrag noch läuft. Die Kündigung übernehmen wir mit Ihrer Vollmacht.",
	// JMrh8PhRG78mcMBK2LDkbS ("Heidi Anbieterwechsel")
	cta: { text: "So funktioniert der Wechsel", href: ROUTE_MESSDIENSTWECHSEL },
	// Company claims (plan §4.4); 14 Tage and 1–2 Std. confirmed on 2026-10-12.
	figures: [
		{ value: "92 %", text: "der Montagen gelingen beim ersten Termin" },
		{ value: "14 Tage", text: "vorher informieren wir Ihre Mieter" },
		{ value: "1–2 Std.", text: "Zeitfenster für Mieter am Montagetag" },
	],
};

export const quotes = {
	title: "Was Verwaltungen über Heidi sagen",
	keys: ["werne", "gerhard"] satisfies Testimonial["key"][],
};

export const faq = {
	title: "Häufige Fragen zum Vergleich",
	items: [
		{
			question: "Warum stehen hier keine anderen Anbieter mit Preisen?",
			answer:
				"Preise und Leistungen anderer Messdienste ändern sich und hängen vom Vertrag ab. Deshalb bewerten Sie Ihren Anbieter selbst, anhand Ihrer eigenen Unterlagen.",
		},
		{
			question: "Wo finde ich meine aktuellen Kosten?",
			answer:
				"In Ihrer letzten Heizkostenabrechnung und im Messdienstvertrag. Gerätemiete, Ablesung und Abrechnung sind dort meist als eigene Posten ausgewiesen.",
		},
		{
			question: "Was kostet Heidi?",
			answer:
				"Abgerechnet wird pro tatsächlich installiertem Zähler, dazu eine Abrechnungspauschale. Ein konkretes Angebot erhalten Sie nach dem kostenlosen Portfolio-Check.",
		},
		{
			question: "Kann ich vor Vertragsende wechseln?",
			answer:
				"Ja. Heidi kann Ihre bestehenden Zähler auswerten, egal wie lange der Vertrag noch läuft, und übernimmt die Kündigung mit Ihrer Vollmacht.",
		},
	] satisfies FaqItem[],
};

export const closing = {
	h2: "Vergleichen Sie mit Ihrem eigenen Bestand.",
	text: "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.",
	button: {
		text: "Demo buchen",
		sub: "Mit Ihrem Ansprechpartner",
		href: BOOKING_HREF,
	},
};
