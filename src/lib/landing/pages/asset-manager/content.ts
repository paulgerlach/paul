/**
 * Every text and the example data of /kunden/asset-manager, word for word from the
 * design (plan 01 §1.2), in the shapes of the shared `sg` template. Apart
 * from the hero, the benefits, the quotes and FAQ 1–2 the texts are
 * /kunden/wohnungsunternehmen's (its design shares them; content.test.ts checks).
 * Components hold markup only. The product claims, the pricing statements
 * and the example data need sign-off before the cutover (plan §4.4).
 */
import { DEMO_HREF } from "$lib/landing/cta";
import { DEFAULT_LOGO_ORDER } from "$lib/landing/data/logos";
import type { Testimonial } from "$lib/landing/data/testimonials";
import type { FaqItem } from "$lib/landing/faqJsonLd";
import type {
	Benefits,
	Features,
	LargeStock,
	PainPicker,
	SegmentTabs,
	SgHero,
	Steps,
	UnitCalc,
} from "$lib/landing/sections/sg/types";
import {
	ROUTE_ASSET_MANAGER,
	ROUTE_DASHBOARD,
	ROUTE_HAUSVERWALTUNG,
	ROUTE_MIETERPORTAL,
	ROUTE_MIETVERWALTUNG,
	ROUTE_SCHNITTSTELLEN,
	ROUTE_SELBSTABRECHNUNG,
	ROUTE_VORGEHEN,
	ROUTE_WEG_VERWALTUNG,
	ROUTE_WOHNUNGSUNTERNEHMEN,
	ROUTE_MUSTER_KUENDIGUNG,
	ROUTE_PORTFOLIO_CHECKER,
	ROUTE_MESSDIENSTANBIETER_VERGLEICH,
	ROUTE_HEIZKOSTENABRECHNUNG_PRUEFEN,
} from "$lib/routes";

const NB = " ";
const SHY = "­";

/** Anchor of the problem picker (the hero's second button). */
export const PAIN_ID = "wechsel";

export const hero = {
	pill: { icon: "bars", text: "Für Asset Manager & Fonds" },
	h1: "Verbräuche im ganzen Portfolio.",
	h1Accent: "Auf einen Blick.",
	lead: "Für Asset Manager und Fonds liefert Heidi eine einheitliche Datenbasis über alle Objekte und Verwaltungen hinweg: fernablesbare Zähler, monatliche Verbräuche und Abrechnungen nach HKVO.",
	primary: { text: "Demo buchen", href: DEMO_HREF },
	secondary: {
		text: "Unzufrieden mit Ihrem Messdienst?",
		href: `#${PAIN_ID}`,
	},
	ticks: [
		"Alles aus einer Hand",
		"Wechsel auch bei laufendem Vertrag",
		"Fester Ansprechpartner",
	],
} satisfies SgHero;

export const calc = {
	title: "Wie viele Einheiten betreuen Sie?",
	hint: "Ziehen Sie den Regler",
	unit: "Einheiten",
	label: "Anzahl Einheiten",
	start: 12000,
	scale: ["10", "1.000", "20.000+"],
	standard: {
		tag: "Ihr Angebot",
		ticks: [
			"Zähler, Ablesung und Abrechnung aus einer Hand",
			"Heizkostenabrechnung per Klick",
			"Abrechnung pro installiertem Zähler",
		],
	},
	large: {
		tag: `Ab 1.000${NB}Einheiten`,
		icon: "star",
		title: "Wir machen Ihnen ein passendes Angebot.",
		ticks: [
			"Konditionen für Ihren Bestand",
			"Kostenloser Portfolio-Check",
			"Rollout im Cluster mit festem Ansprechpartner",
		],
		cta: { text: "Angebot anfragen", href: DEMO_HREF },
	},
} satisfies UnitCalc;

/** The customer types. */
export const tabs = {
	label: "Zielgruppen",
	items: [
		{ icon: "building", text: "Hausverwaltung", href: ROUTE_HAUSVERWALTUNG },
		{ icon: "key", text: "Mietverwaltung", href: ROUTE_MIETVERWALTUNG },
		{ icon: "users", text: "WEG-Verwaltung", href: ROUTE_WEG_VERWALTUNG },
		{
			icon: "house",
			text: "Wohnungsunternehmen",
			href: ROUTE_WOHNUNGSUNTERNEHMEN,
		},
		{
			icon: "bars",
			text: "Asset Manager & Fonds",
			href: ROUTE_ASSET_MANAGER,
			current: true,
		},
	],
} satisfies SegmentTabs;

export const logos = {
	text: "Hausverwaltungen in ganz Deutschland arbeiten bereits mit Heidi.",
	order: DEFAULT_LOGO_ORDER,
};

export const large = {
	figure: 1000,
	plus: "+",
	unit: "Einheiten",
	pill: { icon: "building", text: "Für große Bestände" },
	h2: {
		text: `Sie betreuen mehr als 1.000${NB}Einheiten? `,
		muted: "Dann haben wir ein passendes Angebot.",
	},
	text: "Je größer der Bestand, desto mehr zählt ein Wechsel mit Plan. Wir analysieren Ihre Verträge, planen den Rollout Objekt für Objekt und machen Ihnen ein Angebot, das zu Ihrem Bestand passt.",
	cta: { text: "Angebot anfragen", href: DEMO_HREF },
	// UFviBtC2mkneFNeWnfHAWp (the Portfolio-Checker)
	secondary: {
		text: "Portfolio kostenlos prüfen",
		href: ROUTE_PORTFOLIO_CHECKER,
	},
} satisfies LargeStock;

export const pain = {
	id: PAIN_ID,
	pill: { icon: "alert", text: "Unzufrieden mit Ihrem Messdienst?" },
	h2: { text: "Was stört Sie heute? ", muted: "Klicken Sie an, was zutrifft." },
	groupLabel: "Probleme mit dem bisherigen Messdienst",
	empty: {
		title: "Wählen Sie links, was Sie stört.",
		text: "Wir zeigen Ihnen, wie Heidi das löst.",
	},
	count: {
		one: "1 Grund für den Wechsel",
		many: "{n} Gründe für den Wechsel",
	},
	cta: { text: "Wechsel besprechen", href: DEMO_HREF },
	celebrateFrom: 3,
	items: [
		{
			problem: "Ablesetermine mit Mietern koordinieren",
			title: "Ablesung per Funk",
			text: "Keine Ablesetermine mehr. Die Werte kommen aus der Ferne, ohne Termin in der Wohnung.",
		},
		{
			problem: "Abrechnung kommt spät",
			title: "Abrechnung per Klick",
			text: "Alle Verbräuche liegen per Funk vor. Die Heizkostenabrechnung nach HKVO entsteht direkt im Dashboard.",
		},
		{
			problem: "Niemand ist erreichbar",
			title: "Fester Ansprechpartner",
			text: "Eine Person, die Ihren Bestand kennt, statt wechselnder Hotline-Kontakte.",
		},
		{
			problem: "Beschwerden von Mietern",
			title: "Mieter gut informiert",
			text: `Montageankündigung 14${NB}Tage vorher, 1 bis 2${NB}Stunden Zeitfenster, monatliche Verbrauchsinfo.`,
		},
		{
			problem: "Daten nur als PDF oder Export",
			title: "Daten in Ihrer Software",
			text: "Verbrauchsdaten und Abrechnungen landen direkt in Ihrem ERP- oder CRM-System.",
		},
		{
			problem: "Vertrag läuft noch Jahre",
			title: "Wechsel ohne Warten",
			text: "Heidi übernimmt bestehende Zähler und wertet sie sofort aus, egal wie lange Ihr Vertrag noch läuft.",
		},
		{
			problem: "Unklar, ob alles HKVO-konform ist",
			title: "Abrechnung nach HKVO",
			text: "Verbrauchsabhängige Verteilung, monatliche Verbrauchsinfo und CO₂-Kostenaufteilung, für jede Einheit.",
		},
		{
			problem: "Umrüstung bis 2027 offen",
			title: "Fernablesbar bis 2027",
			text: "Heidi installiert fernablesbare Funkzähler, rechtzeitig vor der Pflicht ab 1.1.2027.",
		},
	],
	links: [
		{
			icon: "doc",
			text: "Muster-Kündigung herunterladen",
			href: ROUTE_MUSTER_KUENDIGUNG,
		},
		{
			icon: "swap",
			text: "Messdienstanbieter vergleichen",
			href: ROUTE_MESSDIENSTANBIETER_VERGLEICH,
		},
		{
			icon: "check",
			text: "Bisherige Abrechnung prüfen",
			href: ROUTE_HEIZKOSTENABRECHNUNG_PRUEFEN,
		},
	],
} satisfies PainPicker;

export const benefits = {
	pill: { icon: "sparkle", text: "Für Asset Manager & Fonds" },
	h2: { text: "Was Sie mit Heidi ", muted: "bekommen." },
	items: [
		{
			icon: "bars",
			title: "Ein Dashboard",
			text: "Verbräuche aller Liegenschaften an einem Ort, statt verteilt auf Portale und PDFs.",
			dark: true,
		},
		{
			icon: "trend",
			title: "Monatliche Daten",
			text: "Verbräuche per Funk statt einmal im Jahr. Auffälligkeiten erkennen Sie früh.",
		},
		{
			icon: "alert",
			title: "Pflichten im Griff",
			text: "Fernablesbarkeit ab 2027, monatliche Verbrauchsinfo und CO₂-Kostenaufteilung, für alle Objekte gleich.",
		},
		{
			icon: "erp",
			title: "Daten, wo Sie sie brauchen",
			text: "Anbindung an bestehende Systeme statt Exporte per E-Mail.",
		},
	],
} satisfies Benefits;

export const features = {
	label: "So arbeitet Heidi",
	meter: {
		title: "Verbräuche lückenlos erfasst",
		text: "Funkzähler liefern die Werte jeder Wohnung aus der Ferne. Kein Ablesetermin, keine fehlenden Werte, keine Zettel im Treppenhaus.",
		link: { text: "Dashboard ansehen", href: ROUTE_DASHBOARD },
		tile: {
			label: "Lindenallee 12 · WE 04",
			value: 1650,
			unit: "Einheiten",
			dateLabel: "Stichtag",
			date: "31.12.",
			device: `Heizkosten${SHY}verteiler`,
			signal: "per Funk",
		},
	},
	billing: {
		title: "Abrechnung ohne Handarbeit",
		text: "Weil alle Verbräuche vorliegen, entsteht die Heizkostenabrechnung nach HKVO per Klick, für jede Einheit. Sie prüfen nur noch, was auffällt.",
		link: { text: "Selbst abrechnen?", href: ROUTE_SELBSTABRECHNUNG },
		tile: {
			title: "Heizkostenabrechnung 2025",
			total: 24,
			pending: "Wird erstellt …",
			done: "Fertig für alle Einheiten",
		},
	},
	monthly: {
		title: "Verbräuche jeden Monat im Blick",
		text: "Mit monatlichen Werten statt einer Ablesung im Jahr fallen ungewöhnliche Verbräuche früh auf, nicht erst mit der Abrechnung.",
		link: { text: "Zum Dashboard", href: ROUTE_DASHBOARD },
		tile: {
			rows: [
				{ unit: "03", value: 142, previous: 138 },
				{ unit: "07", value: 318, previous: 131, outlier: true },
				{ unit: "12", value: 96, previous: 101 },
			],
			max: 340,
			unit: "kWh",
			same: "Wie im Vormonat",
			above: "Über Vormonat",
			cursor: "Verwaltung",
			toast: "Zur Prüfung markiert",
			tag: "Beispieldaten",
		},
	},
	hub: {
		title: "Wächst mit Ihrem Bestand",
		text: [
			"Ob zehn Einheiten oder zehntausend: Verbrauchsdaten und Abrechnungen fließen dorthin, wo Sie arbeiten. Ihr ERP oder CRM, das Heidi Dashboard und das ",
			{ text: "Mieterportal", href: ROUTE_MIETERPORTAL },
			" greifen auf dieselben Daten zu.",
		],
		link: { text: "Schnittstellen", href: ROUTE_SCHNITTSTELLEN },
		tile: {
			tiles: [
				{ icon: "erp", title: "Ihr ERP", status: "Abrechnung übergeben" },
				{ icon: "users", title: "Ihr CRM", status: "Kontakte aktuell" },
				{ icon: "bars", title: "Heidi Dashboard", status: "Verbräuche neu" },
				{
					icon: "phone",
					title: "Mieterportal",
					status: "Verbrauchsinfo bereit",
				},
			],
		},
	},
	rollout: {
		title: "Rollout Liegenschaft für Liegenschaft",
		text: `Für große Bestände plant Heidi die Montage Objekt für Objekt. Mieter werden 14${NB}Tage vorher informiert, 92${NB}% der Installationen gelingen beim ersten Termin. Ein fester Ansprechpartner koordiniert den ganzen Rollout.`,
		link: { text: "So gehen wir vor", href: ROUTE_VORGEHEN },
		tile: {
			title: "Rollout Bestand Nord",
			tag: "Beispieldaten",
			rows: [
				{ name: "Lindenallee 12", progress: 100, status: "Fertig", done: true },
				{ name: "Gartenweg 3", progress: 100, status: "Fertig", done: true },
				{ name: "Am Stadtpark 7", progress: 64, status: "Montage läuft" },
				{ name: "Hofstraße 21", progress: 12, status: "Mieter informiert" },
			],
			count: {
				some: "{n} von {total} Liegenschaften fertig",
				all: "Alle {total} Liegenschaften fertig",
			},
			badge: `92${NB}% beim ersten Termin`,
			note: "Ihr Ansprechpartner koordiniert",
			timeline: [
				{
					at: 1800,
					row: 2,
					name: "Am Stadtpark 7",
					progress: 100,
					status: "Montage läuft",
				},
				{
					at: 4500,
					row: 2,
					name: "Am Stadtpark 7",
					progress: 100,
					status: "Fertig",
					done: true,
				},
				{
					at: 5600,
					row: 3,
					name: "Hofstraße 21",
					progress: 40,
					status: "Montage läuft",
				},
				{
					at: 8300,
					row: 3,
					name: "Hofstraße 21",
					progress: 100,
					status: "Montage läuft",
				},
				{
					at: 11000,
					row: 3,
					name: "Hofstraße 21",
					progress: 100,
					status: "Fertig",
					done: true,
				},
			],
			every: 15000,
		},
	},
} satisfies Features;

export const steps = {
	pill: { icon: "arrow", text: "So läuft der Wechsel" },
	h2: { text: "Vier Schritte. ", muted: "Eine Unterschrift." },
	items: [
		{
			title: "Portfolio-Check",
			text: "Wir prüfen Verträge und Vertragsenden in Ihrem Bestand.",
		},
		{
			title: "Vollmacht",
			text: "Eine Unterschrift genügt. Heidi kündigt beim bisherigen Anbieter.",
		},
		{
			title: "Montage",
			text: `Mieter 14${NB}Tage vorher informiert, 1 bis 2${NB}Stunden Zeitfenster.`,
		},
		{
			title: "Abrechnung",
			text: "Per Klick nach HKVO, monatliche Verbrauchsinfo inklusive.",
		},
	],
} satisfies Steps;

export const quotes = {
	title: "Was Verwaltungen über Heidi sagen",
	keys: ["gerhard", "werne"] as Testimonial["key"][],
};

export const faq = {
	title: "Häufige Fragen",
	items: [
		{
			question: "Welche Daten sehen wir?",
			answer:
				"Die Verbräuche aller angebundenen Liegenschaften, monatlich per Funk, und die fertigen Heizkostenabrechnungen. Auf Wunsch direkt in Ihrem System.",
		},
		{
			question: "Wie schnell sind alle Objekte fernablesbar?",
			answer:
				"Das hängt von Bestand und Vertragslage ab. Mit dem Portfolio-Check planen wir einen Rollout, der zu Ihren Fristen passt.",
		},
		{
			question: "Was kostet Heidi?",
			answer: `Abgerechnet wird pro tatsächlich installiertem Zähler plus Abrechnungspauschale. Ab 1.000${NB}Einheiten erstellen wir ein Angebot für Ihren Bestand.`,
		},
		{
			question: "Müssen wir auf das Vertragsende warten?",
			answer:
				"Nein. Heidi übernimmt bestehende Zähler und wertet sie sofort aus, egal wie lange Ihr aktueller Vertrag noch läuft.",
		},
	] satisfies FaqItem[],
};

export const closing = {
	h2: "Bereit für einen Messdienst, der mitdenkt?",
	text: "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.",
	/** The video button (the design's .dcta-b) → the booking page. */
	button: {
		text: "Live Demo buchen",
		sub: "Mit Ihrem Ansprechpartner",
		href: DEMO_HREF,
	},
};
