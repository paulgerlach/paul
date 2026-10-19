/**
 * Every text and every example number of /selbstabrechnung, word for word
 * from the design. Components hold markup and behaviour only; counts the
 * page shows ("5 Aufgaben", "18/18", "6 Einzelabrechnungen") are derived
 * from the data here.
 *
 * The legal statements, the company claims and the example data need
 * sign-off before go-live (plan §4.4).
 */
import { DEMO_HREF } from "$lib/landing/cta";
import type { SplitHeading } from "$lib/landing/types";
import { formatNumber } from "$lib/landing/pages/upgrade-now/calculator";
import { ROUTE_HEIZKOSTENABRECHNUNG_PRUEFEN } from "$lib/routes";
import type { Flat, Range } from "./distribution";
import type { IconName } from "./icons";

const NB = " ";

/** "1 Aufgabe" / "5 Aufgaben". */
export const tasksText = (n: number) =>
	`${n} ${n === 1 ? "Aufgabe" : "Aufgaben"}`;

export const hero = {
	pill: "Selbstabrechnung",
	h1: { text: "Sie rechnen ab.", em: `Heidi liefert die${NB}Daten.` },
	lead: "Für Verwaltungen, die ihre Heizkostenabrechnung selbst erstellen: Heidi installiert die Funkzähler, liest alle Zählerdaten aus der Ferne aus und spielt sie direkt in Ihre Software. So wird die Heizkostenabrechnung zur Sache eines Knopfdrucks.",
	cta: { text: "Demo buchen", href: DEMO_HREF },
	calcLink: { text: "Kostenverteilung ausprobieren", href: "#rechner" },
	ticks: [
		"Alles aus einer Hand",
		"Alle Zählerdaten per Funk",
		"Direkt in Ihr ERP",
	],
};

/** The hero's example building. */
const building = { name: "Lindenallee 12", flats: 6, meters: 18 };

export type DemoResult = { flat: string; area: string; amount: number };

export const demo = {
	label: "Beispiel: Heizkostenabrechnung auf Knopfdruck",
	title: "Heizkostenabrechnung 2025",
	building,
	subline: `${building.name} · ${building.flats} Wohnungen · ${building.meters} Zähler`,
	checks: {
		meters: {
			title: "Alle Zählerdaten ausgelesen",
			sub: "Heizkörper, Wärme, Warm- und Kaltwasser · per Funk",
		},
		costs: {
			title: "Kosten erfasst",
			sub: "Brennstoff, Wartung, Betriebsstrom",
			value: `12.480${NB}€`,
		},
		key: {
			title: "Verteilschlüssel gesetzt",
			sub: `70${NB}% nach Verbrauch · 30${NB}% nach Fläche`,
			value: "70/30",
		},
	},
	/** Negative = Guthaben, positive = Nachzahlung. */
	results: [
		{ flat: "WE 01", area: `74${NB}m²`, amount: -48.2 },
		{ flat: "WE 02", area: `91${NB}m²`, amount: 112.6 },
		{ flat: "WE 03", area: `58${NB}m²`, amount: -96.4 },
		{ flat: "WE 04", area: `103${NB}m²`, amount: 185.3 },
		{ flat: "WE 05", area: `66${NB}m²`, amount: -21.7 },
		{ flat: "WE 06", area: `72${NB}m²`, amount: 38.9 },
	] satisfies DemoResult[],
	credit: "Guthaben",
	due: "Nachzahlung",
	status: { idle: "Daten kommen", ready: "Bereit", done: "Erstellt" },
	button: {
		idle: "Abrechnung erstellen",
		making: "Wird erstellt …",
		done: "Erneut ansehen",
	},
	hint: {
		idle: "Ein Klick, sobald alle Werte da sind.",
		ready: "Alle Daten vollständig. Jetzt erstellen.",
		done: (n: number) => `${n} Abrechnungen · Beispieldaten`,
	},
	toast: {
		title: (n: number) => `${n} Einzelabrechnungen erstellt`,
		text: "Bereit zum Versand an Ihre Mieter.",
	},
};

export const logoStripText =
	"Hausverwaltungen in ganz Deutschland arbeiten bereits mit Heidi.";

export type TaskKey =
	"inst" | "read" | "uvi" | "data" | "dash" | "abr" | "key" | "send" | "ask";

export type Task = {
	icon: IconName;
	title: string;
	sub: string;
	/** The sub in Vollservice, where it differs. */
	subFull?: string;
};

export const tasks: Record<TaskKey, Task> = {
	inst: {
		icon: "meter",
		title: "Funkzähler installieren",
		sub: "Mit Ankündigung 14 Tage vorher",
	},
	read: {
		icon: "signal",
		title: "Ablesung per Funk",
		sub: "Ohne Termin in der Wohnung",
	},
	uvi: {
		icon: "bell",
		title: "Monatliche Verbrauchsinfo",
		sub: "Automatisch an alle Mieter",
	},
	data: {
		icon: "server",
		title: "Daten bereitstellen",
		sub: "Im Dashboard und direkt in Ihrem ERP oder CRM",
	},
	dash: {
		icon: "chart",
		title: "Überblick im Dashboard",
		sub: "Verbräuche aller Liegenschaften an einem Ort",
	},
	abr: {
		icon: "file",
		title: "Heizkostenabrechnung erstellen",
		sub: "In Ihrer gewohnten Software",
		subFull: "Per Klick, direkt im Dashboard",
	},
	key: {
		icon: "calc",
		title: "Verteilschlüssel festlegen",
		sub: `50 bis 70${NB}% nach Verbrauch`,
	},
	send: {
		icon: "users",
		title: "Abrechnung an Mieter senden",
		sub: "Spätestens 12 Monate nach Ende des Zeitraums",
	},
	ask: {
		icon: "user",
		title: "Rückfragen beantworten",
		sub: "Zu Ihrer Abrechnung",
	},
};

export type Mode = "self" | "full";

/** Who does which task in a mode; every task is in one column. */
export type ModeSplit = {
	label: string;
	heidi: TaskKey[];
	you: TaskKey[];
	note: string;
};

const modes: Record<Mode, ModeSplit> = {
	self: {
		label: "Selbstabrechnung",
		heidi: ["inst", "read", "uvi", "data", "dash"],
		you: ["abr", "key", "send", "ask"],
		note: "Selbstabrechnung: Die Heizkostenabrechnung erstellen Sie in Ihrer eigenen Software.",
	},
	full: {
		label: "Vollservice",
		heidi: ["inst", "read", "uvi", "data", "dash", "abr"],
		you: ["key", "send", "ask"],
		note: "Vollservice: Heidi erstellt die Heizkostenabrechnung per Klick, direkt im Dashboard.",
	},
};

export const taskSplit = {
	pill: "Aufgabenteilung",
	h2: {
		text: "Sie entscheiden, ",
		muted: "wie viel Heidi übernimmt.",
	} satisfies SplitHeading,
	modeLabel: "Modell",
	heidi: "Heidi übernimmt",
	you: "Sie behalten",
	modes,
};

const flats: Flat[] = [
	{ id: "WE 01", area: 62, units: 1100 },
	{ id: "WE 02", area: 78, units: 1420 },
	{ id: "WE 03", area: 55, units: 760 },
	{ id: "WE 04", area: 91, units: 1650 },
	{ id: "WE 05", area: 70, units: 980 },
	{ id: "WE 06", area: 94, units: 1090 },
];
const totalArea = flats.reduce((sum, f) => sum + f.area, 0);

export const calculator = {
	pill: "Kostenverteilung nach HeizkostenV",
	h2: {
		text: "So verteilen Sie die Heizkosten. ",
		muted: "Probieren Sie es aus.",
	} satisfies SplitHeading,
	lead: `Zwischen 50 und 70${NB}% der Heizkosten werden nach Verbrauch verteilt, der Rest nach Fläche (§ 7 HeizkostenV). Die Verbrauchswerte liefert Heidi.`,
	costs: {
		label: "Heizkosten des Gebäudes",
		min: 6000,
		max: 80000,
		step: 500,
		default: 24000,
	} satisfies Range & {
		label: string;
		default: number;
	},
	share: {
		label: "Verbrauchsanteil",
		min: 50,
		max: 70,
		step: 5,
		default: 70,
	} satisfies Range & {
		label: string;
		default: number;
	},
	baseLabel: "Grundkosten nach Fläche",
	consumptionLabel: "Verbrauchskosten",
	hint: `Pflicht sind 70${NB}%, wenn das Gebäude die Wärmeschutzverordnung von 1994 nicht erfüllt, mit Öl oder Gas beheizt wird und die freiliegenden Leitungen überwiegend gedämmt sind (§ 7 Abs. 1).`,
	flats,
	tableTitle: `Beispielhaus · ${flats.length} Wohnungen · ${formatNumber(totalArea)}${NB}m²`,
	caption: "Verteilung je Wohnung",
	legend: { base: "Fläche", consumption: "Verbrauch" },
	columns: {
		flat: "Wohnung",
		area: "m²",
		units: "Einh.",
		bar: "Anteil Fläche / Verbrauch",
		total: "Kosten",
	},
	sum: "Summe",
	foot: "Vereinfachtes Beispiel ohne Warmwasser (§ 8) und ohne CO₂-Kostenaufteilung. Keine Rechtsberatung.",
};

export const dataPath = {
	pill: "Datenweg",
	h2: {
		text: "Vom Zähler in Ihre Abrechnung. ",
		muted: "Ohne Abtippen.",
	} satisfies SplitHeading,
	stations: [
		{
			icon: "meter",
			title: "Funkzähler",
			sub: "Heizkostenverteiler, Wärme- und Wasserzähler in jeder Wohnung",
		},
		{
			icon: "signal",
			title: "Fernablesung",
			sub: "Werte kommen per Funk, ohne Termin in der Wohnung",
		},
		{
			icon: "heidi",
			title: "Heidi Dashboard",
			sub: "Alle Liegenschaften und Verbräuche an einem Ort",
		},
		{
			icon: "server",
			title: "Ihre Software",
			sub: "Verbrauchsdaten landen direkt in Ihrem ERP- oder CRM-System",
		},
		{
			icon: "file",
			title: "Ihre Abrechnung",
			sub: "Sie erstellen und versenden sie wie gewohnt",
		},
	] satisfies { icon: IconName; title: string; sub: string }[],
};

/** The Heizkostenabrechnungs-Checker: the duties block's CTA row leads there. */
export const CHECKER_HREF: string | undefined =
	ROUTE_HEIZKOSTENABRECHNUNG_PRUEFEN;

export const duties = {
	pill: "Worauf Sie achten",
	h2: {
		text: "Vier Punkte, die jede Abrechnung ",
		muted: "erfüllen muss.",
	} satisfies SplitHeading,
	cards: [
		{
			figure: `50–70${NB}%`,
			title: "Verbrauchsabhängig verteilen",
			text: `Heiz- und Warmwasserkosten zu 50 bis 70${NB}% nach Verbrauch, der Rest nach Fläche. Sonst dürfen Mieter um 15${NB}% kürzen.`,
			source: "§§ 7, 8, 12 HeizkostenV",
		},
		{
			figure: "12 Mon.",
			title: "Rechtzeitig zustellen",
			text: "Die Abrechnung muss Mietern spätestens zwölf Monate nach Ende des Abrechnungszeitraums vorliegen.",
			source: "§ 556 Abs. 3 BGB",
		},
		{
			figure: "seit 2022",
			title: "Zusatzinformationen",
			text: "Unter anderem Vergleich mit dem Vorjahr und mit einem Durchschnittsnutzer, Brennstoffmix und Kontakt zu Verbraucherstellen.",
			source: "§ 6a HeizkostenV",
		},
		{
			figure: "seit 2023",
			title: "CO₂-Kosten aufteilen",
			text: "Die CO₂-Kosten werden je nach Energiebilanz des Gebäudes zwischen Vermieter und Mieter aufgeteilt.",
			source: "CO2KostAufG",
		},
	],
	ctaText: "Unsicher, ob Ihre letzte Abrechnung alles erfüllt?",
	ctaLink: "Zum Heizkostenabrechnungs-Checker",
};

export const allMeters = {
	big: {
		pill: "Alle Zählerdaten",
		h2: {
			text: "Heidi liest alle Zähler aus. ",
			muted: "Vollständig, zum Stichtag.",
		} satisfies SplitHeading,
		text: "Heizkostenverteiler, Wärmemengenzähler, Warm- und Kaltwasserzähler: Heidi liest die Daten aller Zähler in Ihren Liegenschaften per Funk aus. Keine Termine, keine Zettel, keine fehlenden Werte, wenn Sie abrechnen wollen.",
		building: building.name,
		status: `${building.meters} von ${building.meters} ausgelesen`,
		meters: [
			{ icon: "meter", title: "Heizkostenverteiler", count: "12 Geräte" },
			{ icon: "flame", title: "Wärmemengenzähler", count: "1 Gerät" },
			{ icon: "drop", title: "Warmwasserzähler", count: "6 Geräte" },
			{ icon: "tap", title: "Kaltwasserzähler", count: "6 Geräte" },
		] satisfies { icon: IconName; title: string; count: string }[],
		done: "ausgelesen",
		tag: "Beispieldaten",
	},
	reading: {
		title: "Stichtagswerte ohne Nacharbeit",
		text: "Zum Stichtag liegen die Werte jeder Wohnung bereit, sauber zugeordnet zu Liegenschaft, Wohnung und Zähler.",
		rows: [
			{
				date: "31.12.",
				title: "WE 03 · Heizkörper Bad",
				sub: "Stichtagswert",
				value: "760",
			},
			{
				date: "31.12.",
				title: "WE 03 · Warmwasser",
				sub: "Stichtagswert",
				value: `12,1${NB}m³`,
			},
		],
	},
	sync: {
		title: "Direkt in Ihre Software",
		text: "Über die Schnittstelle landen die Verbrauchsdaten in Ihrem ERP-System. Sie übernehmen sie, statt sie abzutippen.",
		done: "Übertragung abgeschlossen",
		sub: `${building.meters} Werte · ${building.name}`,
	},
	steps: {
		pill: "Auf Knopfdruck",
		h2: {
			text: "Von der Ablesung zur fertigen Abrechnung. ",
			muted: "In drei Schritten.",
		} satisfies SplitHeading,
		ready: {
			title: "Daten liegen bereit",
			text: "Heidi liest alle Zähler aus und prüft, ob jeder Wert da ist.",
			label: "Zählerdaten",
			value: `${building.meters}/${building.meters}`,
			sub: "Alle Werte per Funk empfangen",
		},
		create: {
			title: "Abrechnung erstellen",
			text: "Mit vollständigen Daten erstellen Sie die Abrechnung in Ihrer Software per Knopfdruck.",
			button: "Abrechnung erstellen",
		},
		send: {
			title: "An Mieter versenden",
			text: "Die Einzelabrechnungen gehen raus, lange vor der Frist von zwölf Monaten.",
			rows: ["WE 01", "WE 02"],
			sub: "Einzelabrechnung",
		},
	},
};

export const sample = {
	pill: "Musterabrechnung",
	h2: {
		text: "So sieht die Abrechnung aus. ",
		muted: "Klar und verständlich.",
	} satisfies SplitHeading,
	lead: "Auch wenn Sie selbst abrechnen: So kann eine Heizkostenabrechnung aussehen, wenn die Daten vollständig sind. Heidi liefert die Zählerdaten dafür, auf Wunsch übernimmt Heidi auch die Abrechnung.",
	keys: [
		{
			title: "Absender, Empfänger, Liegenschaft",
			sub: "Wer abrechnet, für wen und für welchen Zeitraum, auf einen Blick.",
		},
		{
			title: "Gesamtbetrag ganz oben",
			sub: "Der Betrag steht vor allen Details, direkt auf der ersten Seite.",
		},
		{
			title: "Zugang zum Nutzerportal",
			sub: "Mieter sehen dort ihre unterjährigen Verbrauchsinformationen.",
		},
		{
			title: "Alle Objekte zusammengefasst",
			sub: "Jede berücksichtigte Liegenschaft ist aufgeführt.",
		},
	],
	paper: {
		label: "Muster einer Heizkostenabrechnung mit Beispieldaten",
		sender: "Heidi Systems GmbH · Monbijouplatz 4 · 10178 Berlin",
		recipient: ["Max Mustermann", "Musterstraße 12", "10115 Berlin"],
		logo: "Heidi",
		title: "Ihre Heidi Systems Abrechnung für Heizung, Warmwasser, Kaltwasser",
		subtitle: "Zusammenstellung Ihrer Kosten",
		meta: [
			[
				[
					"Erstellt im Auftrag von",
					["Muster Hausverwaltung GmbH", "Beispielweg 3, 10117 Berlin"],
				],
				["Abrechnungszeitraum", ["01.01.2025 – 31.12.2025"]],
				["Ihr Nutzungszeitraum", ["01.01.2025 – 31.12.2025"]],
			],
			[
				["Erstellt am", ["16.03.2026"]],
				["Liegenschaft", ["Musterstraße 12 u. a.", "10115 Berlin"]],
				["Heidi Nutzernummer", ["0010"]],
			],
		] satisfies [string, string[]][][],
		intro: [
			"Sehr geehrte Damen und Herren,",
			"wir haben die Kosten, die im vergangenen Abrechnungszeitraum angefallen sind, abgerechnet. Unsere Abrechnung ist auf den folgenden Seiten detailliert beschrieben.",
		],
		amountLabel: "Betrag",
		totalLabel: "Gesamtbetrag",
		amount: `1.248,30${NB}€`,
		notesTitle: "Beachten Sie bitte folgende Hinweise:",
		notes: [
			"Bitte rechnen Sie Nachzahlungen oder Guthaben ausschließlich mit Ihrem Vermieter bzw. Ihrer Verwaltung ab.",
			"Allgemeine Hinweise und Informationen zur Abrechnung finden Sie in Ihrem Heidi Nutzerportal.",
		],
		portal: {
			title: "Ihre persönlichen Zugangsdaten für das Heidi Nutzerportal",
			text: "Mit Heidi Systems bekommen Sie Zugriff auf die unterjährigen Verbrauchsinformationen, übersichtlich und monatlich.",
			credentials: [
				["Nutzer-ID:", "MUSTER-0010"],
				["Sicherheitscode:", "••••••"],
			],
			qrCaption: "Beispiel",
		},
		objectsTitle: "Folgende Objekte sind in dieser Abrechnung berücksichtigt:",
		objects: [
			"10115 Berlin, Musterstraße 12",
			"10115 Berlin, Musterstraße 12A",
			"10115 Berlin, Musterstraße 12B",
			"10115 Berlin, Musterstraße 14",
			"10115 Berlin, Musterstraße 14A",
			"10115 Berlin, Musterstraße 16",
		],
		stamp: "Musterabrechnung · Beispieldaten",
	},
};

export const people = {
	title: ["Selbst abrechnen.", "Nicht allein."],
	text: "Sie erstellen die Heizkostenabrechnung selbst, Heidi liefert die Verbrauchsdaten. Und wenn Fragen kommen, haben Sie einen persönlichen Ansprechpartner, der Ihre Liegenschaften kennt.",
	checks: [
		"Ein fester Ansprechpartner",
		"Verbrauchsdaten aus einer Hand",
		"Erreichbar, wenn Fragen kommen",
	],
	photoPosition: "55% 35%",
};

export const testimonials = {
	title: "Was Verwaltungen über Heidi sagen",
	keys: ["vitolus", "werne"] as const,
};

export const faq = {
	title: "Häufige Fragen zur Selbstabrechnung",
	items: [
		{
			question: "Was liefert Heidi bei der Selbstabrechnung?",
			answer:
				"Heidi installiert die Funkzähler, liest sie aus der Ferne ab und stellt die Verbrauchswerte im Dashboard und in Ihrem ERP- oder CRM-System bereit. Die Heizkostenabrechnung erstellen Sie selbst.",
		},
		{
			question: "Wer verschickt die monatliche Verbrauchsinformation?",
			answer:
				"Heidi. Die unterjährige Verbrauchsinformation geht jeden Monat automatisch an alle Mieter, auch wenn Sie selbst abrechnen.",
		},
		{
			question: "Muss ich meine Software wechseln?",
			answer:
				"Nein. Heidi ist in bestehende ERP- und CRM-Systeme integriert. Die Verbrauchsdaten landen direkt dort, wo Sie heute schon abrechnen.",
		},
		{
			question: "Und wenn wir die Abrechnung doch abgeben wollen?",
			answer:
				"Dann erstellt Heidi die Heizkostenabrechnung per Klick für Sie, mit denselben Daten und im selben Dashboard.",
		},
		{
			question: "Was kostet das?",
			answer:
				"Abgerechnet wird pro tatsächlich installiertem Zähler. Ein konkretes Angebot für Ihren Bestand erhalten Sie nach dem kostenlosen Portfolio-Check.",
		},
	],
};

export const finalCta = {
	title: "Ihre Abrechnung. Unsere Daten.",
	submitLabel: "Demo buchen",
};
