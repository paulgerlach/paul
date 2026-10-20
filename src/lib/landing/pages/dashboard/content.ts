/**
 * Every text and the example data of /dashboard outside the preview, word for
 * word from the design (the preview's data is in `demo/data.ts`). Components
 * hold markup and behaviour only.
 *
 * The product description, the legal statements, the company claims and the
 * example data need sign-off before the cutover (plan §4.4).
 */
import { DEMO_HREF, START_HREF } from "$lib/landing/cta";
import type { LogoKey } from "$lib/landing/data/logos";
import type { Testimonial } from "$lib/landing/data/testimonials";
import type { IconName } from "./icons";
import { nextSteps } from "$lib/landing/data/nextSteps";

const NB = " ";

export const hero = {
	pill: "Heidi Dashboard",
	h1: ["Ihr ganzer Bestand.", "In einem Dashboard."],
	line1:
		"Verbräuche, Kosten und Abrechnungen aller Objekte auf einer Plattform.",
	line2: "Mit den Kennzahlen, die zählen:",
	chips: {
		usage: {
			icon: "flame" as IconName,
			text: "Verbrauch",
			bars: [70, 55, 40, 30, 35, 48],
			caption: "kWh pro Monat",
		},
		costs: {
			icon: "euro" as IconName,
			text: "Kosten",
			count: 18420,
			caption: "Heizkosten 2026 · Beispiel",
		},
		alerts: {
			icon: "bell" as IconName,
			text: "Benachrichtigungen",
			title: "Auffälliger Verbrauch",
			sub: "Lindenallee 12 · WE 07",
		},
	},
	primary: { text: "Demo buchen", href: DEMO_HREF },
	secondary: { text: "Bestand kostenlos prüfen", href: START_HREF },
	hint: "Probieren Sie es aus: Das Dashboard ist voll bedienbar.",
	previewLabel: "Bedienbare Vorschau des Heidi Dashboards mit Beispieldaten",
};

export const logos = {
	text: "Im Einsatz bei",
	strong: "Hausverwaltungen in ganz Deutschland",
};

export type ScrubCard = {
	title: string;
	text: string;
	unit: string;
	/** Name of the mode switch and its two options. */
	modesLabel: string;
	modes: [{ value: string; label: string }, { value: string; label: string }];
	chartLabel: string;
};

export const kpis = {
	pill: "Kennzahlen",
	h2: "Verstehen Sie Ihren Bestand auf einen Blick",
	lead: "Die wichtigsten Kennzahlen jeder Liegenschaft, automatisch aus den Funkwerten erfasst.",
	usage: {
		title: "Verbrauch",
		text: "Kaltwasser, Warmwasser, Heizung und Strom je Objekt, täglich, wöchentlich oder monatlich.",
		value: "104",
		unit: "kWh/m²",
		delta: `↓ 6,8${NB}%`,
		spark: [62, 58, 61, 55, 57, 52, 54, 49, 50, 47, 46, 44],
	},
	costs: {
		title: "Kosten",
		text: "Gesamtkosten und Heizkosten je Monat auf einen Blick, damit Ausreißer früh auffallen.",
		unit: "€/m²",
		modesLabel: "Kostenart",
		modes: [
			{ value: "all", label: "Gesamt" },
			{ value: "heat", label: "Heizung" },
		],
		chartLabel:
			"Kosten je Monat. Mit Maus, Finger oder Pfeiltasten einen Monat wählen.",
		caption: { all: "Gesamtkosten", heat: "Heizkosten" },
		tip: { heat: "Heizung", rest: "Übrige Kosten", total: "Gesamt" },
	},
	savings: {
		title: "Einsparung",
		text: "Sehen Sie, wie viel CO₂ Ihr Bestand im gewählten Zeitraum einspart.",
		unit: "t CO₂",
		modesLabel: "Darstellung",
		modes: [
			{ value: "cum", label: "Kumuliert" },
			{ value: "mon", label: "Je Monat" },
		],
		chartLabel:
			"CO₂-Einsparung je Monat. Mit Maus, Finger oder Pfeiltasten einen Monat wählen.",
		caption: "eingespart Jan – Sep",
		monthCaption: { cum: "bis Ende", mon: "im" },
		tip: { cum: "Kumuliert", mon: "Im Monat", ofWhich: "davon im Monat" },
	},
};

export const strike = {
	label: "Was Ihnen das Dashboard abnimmt",
	lines: [
		"Ablesewerte per Excel einsammeln",
		"Mieter für jeden Ablesetermin anschreiben",
		"Verbräuche aus PDFs abtippen",
		"Monatelang auf die Abrechnung warten",
		"Leckagen erst mit der Jahresrechnung bemerken",
	],
	final: "Alles auf einen Blick.",
	finalAccent: "Mit Heidi.",
};

export type FeatureId =
	"add" | "notifications" | "takeOver" | "leak" | "billing" | "share";

export const features = {
	pill: "Funktionen",
	h2: "Aus Verbrauchsdaten werden klare Entscheidungen",
	lead: "Objekte anlegen, Benachrichtigungen erhalten, Funktionen auf Knopfdruck nutzen und das Dashboard mit Ihrem Team teilen.",
	cards: [
		{
			id: "add",
			size: 7,
			title: "Objekte anlegen",
			text: "Legen Sie Ihren Bestand einmal an. Danach laufen Verbräuche, Dokumente und Abrechnungen je Objekt im Dashboard zusammen.",
		},
		{
			id: "notifications",
			size: 5,
			title: "Benachrichtigungen",
			text: "Heidi meldet, was in Ihren Objekten passiert: von Einzügen und Verbrauchsänderungen bis zur Bestätigung, dass alle Zähler sauber übertragen haben.",
		},
		{
			id: "takeOver",
			size: 5,
			title: "Bestandszähler übernehmen",
			text: "Vorhandene Zähler laufen im selben Dashboard mit, bis der alte Messdienstvertrag endet.",
		},
		{
			id: "leak",
			size: 7,
			title: "Leckage-Wächter",
			text: "Heidi vergleicht den täglichen Kaltwasserverbrauch jeder Wohnung mit ihrem Normalwert und meldet Auffälligkeiten, bevor sie teuer werden.",
		},
		{
			id: "billing",
			size: 7,
			title: "Heizkostenabrechnung per Klick",
			text: "Alle Verbräuche liegen per Funk vor. Ein Klick, und Heidi erstellt die Abrechnungen, rechtssicher nach HKVO und mit Plausibilitätsprüfung.",
		},
		{
			id: "share",
			size: 5,
			title: "Dashboard teilen",
			text: "Mit einem Klick teilen Sie das Dashboard mit Kolleginnen und Kollegen, ohne Dateien zu verschicken.",
		},
	] satisfies { id: FeatureId; size: 5 | 7; title: string; text: string }[],
};

export const addObject = {
	placeholder: "Adresse der Liegenschaft …",
	tags: ["Mehrfamilienhaus", "Funk"],
	button: "Hinzufügen",
	entries: [
		["Bergmannstraße 4", "24 WE"],
		["Lindenallee 12", "18 WE"],
		["Gartenweg 3", "12 WE"],
		["Am Stadtpark 7", "32 WE"],
		["Mühlenstraße 18", "18 WE"],
	] as [string, string][],
};

export const notifications: {
	tone: "ok" | "in";
	title: string;
	sub: string;
}[] = [
	{ tone: "ok", title: "Mieter eingezogen", sub: "WE PL12VH3DGr" },
	{
		tone: "in",
		title: `32${NB}% höherer Verbrauch`,
		sub: "WE SH39LF10Gl · Warmwasser",
	},
	{
		tone: "ok",
		title: "Alle Zähler in Ordnung",
		sub: "Bergmannstraße 4 · heute übertragen",
	},
	{
		tone: "ok",
		title: `12${NB}% weniger Heizverbrauch`,
		sub: "Gartenweg 3 · zum Vorjahr",
	},
	{
		tone: "ok",
		title: "Funkablesung abgeschlossen",
		sub: "370 Wohnungen · 05.10.2026",
	},
];

export const takeOver = {
	badges: { funk: "Heidi-Funk", bestand: "Bestand" },
	rows: [
		{ type: "Heizkostenverteiler", unit: "WE 01", source: "funk" },
		{ type: "Heizkostenverteiler", unit: "WE 02", source: "bestand" },
		{ type: "Warmwasserzähler", unit: "WE 02", source: "funk" },
		{ type: "Kaltwasserzähler", unit: "WE 03", source: "bestand" },
		{ type: "Wärmemengenzähler", unit: "Keller", source: "funk" },
	] satisfies { type: string; unit: string; source: "funk" | "bestand" }[],
	note: "Getauscht wird erst zum Ende des bisherigen Vertrags.",
};

export const leak = {
	label: "Kaltwasser · WE 04 · letzte 14 Tage",
	legend: `Normalwert ~126${NB}l`,
	badge: "Auffälligkeit erkannt (3 Tage)",
	values: [
		128, 116, 142, 121, 111, 135, 148, 122, 119, 196, 208, 214, 126, 120,
	],
	/** Days (1-based) that are flagged. */
	flagged: [10, 11, 12],
	baseline: 126,
	grid: [150, 200],
	xLabels: [1, 4, 7, 10, 14],
	chartLabel:
		"Täglicher Kaltwasserverbrauch über 14 Tage, an Tag 10 bis 12 deutlich über dem Normalwert",
	litres: "Liter",
	day: "Tag",
	flaggedTip: "auffällig",
	footnote: `An 3 Tagen lief nachts durchgehend Wasser – häufigste Ursache: laufende Spülung. Ein tropfender Spülkasten kostet unbemerkt bis zu 200${NB}€ pro Jahr.`,
};

export const billingRun = {
	properties: [
		{ name: "Bergmannstraße 4", units: 24 },
		{ name: "Lindenallee 12", units: 18 },
		{ name: "Gartenweg 3", units: 12 },
	],
	status: { ready: "Bereit", working: "Wird erstellt", done: "Erstellt" },
	button: "Abrechnungen erstellen",
	reset: "Zurücksetzen",
	hint: "Abrechnungszeitraum 2025",
	working: "Plausibilitätsprüfung läuft …",
	toast: "54 Abrechnungen erstellt · zum Herunterladen bereit",
};

export const share = {
	invite: "Einladen",
	you: { initials: "HV", name: "Sie", sub: "Ihr Konto" },
	invitees: [
		["team@ihre-hausverwaltung.de", "TM"],
		["buchhaltung@ihre-hausverwaltung.de", "BH"],
		["technik@ihre-hausverwaltung.de", "TE"],
	] as [string, string][],
	status: "Eingeladen",
	button: "Dashboard teilen",
};

export const quote = {
	label: "Kundenstimme",
	logo: "werne" satisfies LogoKey as LogoKey,
	testimonial: "werne" satisfies Testimonial["key"] as Testimonial["key"],
	emphasis: "reibungslos und pünktlich",
};

export type HandoverItem = {
	icon: IconName;
	title: string;
	place: string;
};

export const integration = {
	pill: "Schnittstellen",
	// The soft hyphen is the design's.
	h2: "Direkt in Ihre Verwaltungs­software.",
	text: "Heizkostenabrechnungen und Verbrauchsdaten gehen aus dem Dashboard direkt an Ihr ERP- oder CRM-System. Kein Abtippen, kein Hin- und Herschicken von Dateien.",
	link: { text: "Anbindung besprechen →", href: START_HREF },
	handover: {
		label: "Beispiel: Heidi übergibt Dokumente an Ihre Verwaltungssoftware",
		live: "Automatische Übergabe",
		counter: "Heute übergeben",
		start: 14,
		source: { name: "Heidi", sub: "Dashboard" },
		queueLabel: "Bereit zur Übergabe",
		target: { name: "Ihre Software", sub: "ERP / CRM" },
		columns: ["Eingang", "Zeit"],
		ready: "bereit",
		moving: "wird übertragen",
		fresh: "Neu",
		now: "gerade eben",
		oneMinute: "vor 1 Min.",
		times: ["vor 4 Min.", "vor 9 Min.", "vor 16 Min.", "vor 23 Min."],
		items: [
			{
				icon: "file",
				title: "Heizkostenabrechnung",
				place: "Bergmannstraße 4",
			},
			{
				icon: "chart",
				title: "Verbrauchsdaten September",
				place: "Lindenallee 12",
			},
			{ icon: "file", title: "Heizkostenabrechnung", place: "Gartenweg 3" },
			{
				icon: "users",
				title: "Verbrauchsinfo an 32 Mieter",
				place: "Am Stadtpark 7",
			},
			{ icon: "meter", title: "Zählerstände", place: "Mühlenstraße 18" },
			{ icon: "file", title: "Heizkostenabrechnung", place: "Schillerhöfe" },
			{
				icon: "chart",
				title: "Verbrauchsdaten September",
				place: "Hofstraße 21",
			},
		] satisfies HandoverItem[] as HandoverItem[],
		badge: "Beispieldaten",
		caption:
			"Abrechnungen, Verbrauchsdaten und Verbrauchsinfos landen ohne Export und ohne Abtippen in Ihrer Software.",
	},
};

export const recommendations = {
	pill: "Auswertungen",
	h2: "Für jede Liegenschaft der nächste Schritt",
	lead: "Heidi prüft Vertragslaufzeit und Zähler jeder Liegenschaft und zeigt den nächsten Schritt: Vertrag übernehmen, Vertrag kündigen oder direkt abrechnen.",
	// The list itself is shared with /portfolio-checker.
	...nextSteps,
	cards: [
		{
			title: "Monatliche Verbrauchsinfo",
			text: "Jede Mietpartei sieht ihren Verbrauch monatlich nach HKVO, mit Vergleich zum Vorjahr.",
		},
		{
			title: "Verbrauchsprognose",
			text: "Ist-Werte, Prognose bis zum Jahresende und Unsicherheitsband in einem Diagramm.",
		},
		{
			title: "Übergabe an Ihre Software",
			text: "Abrechnungen und Verbrauchsdaten landen direkt in Ihrem ERP- oder CRM-System.",
		},
	],
};

export type Question = {
	icon: IconName;
	bg: string;
	fg: string;
	text: string;
};

export const questions = {
	h2: "Hausverwaltungen stellen jeden Tag dieselben Fragen. Im Dashboard stehen die Antworten.",
	pause: "Anhalten",
	play: "Abspielen",
	rows: [
		{
			seconds: 70,
			reverse: false,
			items: [
				{
					icon: "drop",
					bg: "#EEF1F6",
					fg: "#6282D0",
					text: "Wie hat sich der Kaltwasserverbrauch zum Vorjahr entwickelt?",
				},
				{
					icon: "flame",
					bg: "#FBE6DA",
					fg: "#D9622B",
					text: "Welches Objekt hat die höchsten Heizkosten?",
				},
				{
					icon: "signal",
					bg: "#E6F5E7",
					fg: "#3E9A57",
					text: "Sind alle Zähler in Ordnung?",
				},
				{
					icon: "file",
					bg: "#F1F3F2",
					fg: "#1E322D",
					text: "Ist die Heizkostenabrechnung 2025 fertig?",
				},
			],
		},
		{
			seconds: 84,
			reverse: true,
			items: [
				{
					icon: "users",
					bg: "#E6F5E7",
					fg: "#3E9A57",
					text: "Welche Mieter sind neu eingezogen?",
				},
				{
					icon: "drop",
					bg: "#FBE6DA",
					fg: "#D9622B",
					text: "Wo liegt der Warmwasserverbrauch über dem Vorjahr?",
				},
				{
					icon: "euro",
					bg: "#EEF1F6",
					fg: "#6282D0",
					text: "Wie hoch sind die Gesamtkosten in diesem Quartal?",
				},
				{
					icon: "signal",
					bg: "#E6F5E7",
					fg: "#3E9A57",
					text: "Wie viel CO₂ spart unser Bestand?",
				},
			],
		},
		{
			seconds: 76,
			reverse: false,
			items: [
				{
					icon: "file",
					bg: "#F1F3F2",
					fg: "#1E322D",
					text: "Haben alle Mieter ihre Verbrauchsinformation erhalten?",
				},
				{
					icon: "building",
					bg: "#EEF1F6",
					fg: "#6282D0",
					text: "Welche Objekte laufen noch beim alten Messdienst?",
				},
				{
					icon: "chart",
					bg: "#F8F0D6",
					fg: "#9A7B12",
					text: "Wo liegt der Verbrauch über dem Durchschnitt?",
				},
				{
					icon: "meter",
					bg: "#E6F5E7",
					fg: "#3E9A57",
					text: "Haben heute alle Zähler übertragen?",
				},
			],
		},
	] satisfies { seconds: number; reverse: boolean; items: Question[] }[] as {
		seconds: number;
		reverse: boolean;
		items: Question[];
	}[],
};

export const testimonials = {
	pill: "Kundenstimmen",
	h2: "Was Verwaltungen über Heidi sagen",
	keys: [
		"vitolus",
		"gerhard",
	] satisfies Testimonial["key"][] as Testimonial["key"][],
};

export const roadmap = {
	pill: "Produkt-Updates & Roadmap",
	h2: "Sie bestimmen mit, was als Nächstes kommt.",
	text: "Teilen Sie uns direkt im Dashboard Ihre Wünsche mit und geben Sie an, welche Funktionen Sie sich zukünftig wünschen.",
	button: { text: "Feedback geben", href: START_HREF },
	items: [
		{
			icon: "euro",
			title: "Betriebskosten",
			sub: "Im Funktionsmenü",
			status: "Verfügbar",
		},
		{
			icon: "smoke",
			title: "Rauchmelder hinzufügen",
			sub: "Im Funktionsmenü",
			status: "Verfügbar",
		},
		{
			icon: "extinguisher",
			title: "Feuerlöscher hinzufügen",
			sub: "Im Funktionsmenü",
			status: "Verfügbar",
		},
	] satisfies { icon: IconName; title: string; sub: string; status: string }[],
	wish: {
		icon: "sparkle" satisfies IconName as IconName,
		title: "Ihr Wunsch",
		sub: "Was soll Heidi als Nächstes können?",
		status: "Feedback",
	},
};

export type ClosingContent = {
	h2: string;
	h2Accent: string;
	text: string;
	submitLabel: string;
	/** SVG y in a 1000×210 box (lower is better). */
	chart: { current: number[]; previous: number[] };
};

export const closing: ClosingContent = {
	h2: "Sehen Sie Ihren Bestand",
	h2Accent: "in einem Dashboard.",
	text: "Wir prüfen Ihren Bestand kostenlos und zeigen Ihnen, wie er in Heidi aussieht.",
	submitLabel: "Bestand kostenlos prüfen",
	chart: {
		current: [150, 120, 135, 96, 110, 82, 90, 70, 76, 58, 64, 46],
		previous: [140, 150, 128, 140, 124, 132, 118, 126, 112, 118, 108, 112],
	},
};
