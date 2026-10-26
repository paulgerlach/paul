/**
 * Every text of /vorgehen, word for word from the design. Components hold
 * markup, photos and behaviour only.
 *
 * The legal statements, the company claims and the example data need
 * sign-off before go-live (plan §4.4). The KPIs (92 %, 14 Tage, 1 bis 2
 * Stunden) were confirmed on 2026-10-12.
 */
import { DEMO_HREF } from "$lib/landing/cta";
import type { Testimonial } from "$lib/landing/data/testimonials";
import type { FaqItem } from "$lib/landing/faqJsonLd";
import {
	ROUTE_AUSWERTUNG,
	ROUTE_DASHBOARD,
	ROUTE_FRAGEBOGEN,
	ROUTE_FUNKTIONEN,
	ROUTE_GERAETE,
	ROUTE_HKVO_LEITFADEN,
	ROUTE_INSTALLATIONSPARTNER,
	ROUTE_INSTALLATIONSTOOL,
	ROUTE_MESSDIENSTWECHSEL,
	ROUTE_MIETERPORTAL,
	ROUTE_MUSTER_KUENDIGUNG,
	ROUTE_PORTFOLIO_CHECKER,
	ROUTE_SICHERHEIT,
	ROUTE_VERBRAUCHSINFORMATION,
} from "$lib/routes";
import type { IconName } from "./icons";

const NB = " ";

/** Confirmed KPIs, used in the stats, the steps and the FAQ. */
export const KPI = {
	firstVisit: `92${NB}%`,
	notice: `14${NB}Tage`,
	window: `1${NB}bis 2${NB}Stunden`,
};

/**
 * The hero's and the contact card's two buttons: "Angebot einholen" (the
 * design's QiDTuWCBDWB3ApgGdcYJCz, the questionnaire as in the nav) and the
 * video button "Demo buchen".
 */
export const ctas = {
	offer: { text: "Angebot einholen", href: ROUTE_FRAGEBOGEN },
	demo: { text: "Demo buchen", href: DEMO_HREF },
};

export const hero = {
	eyebrow: "Vorgehen",
	h1: "So geht Heidi vor. In drei Schritten digital.",
	lead: "Heidi erfasst alle Verbrauchsdaten digital, bündelt die Energiedaten Ihres Portfolios und vereinfacht Ihre Betriebs- und Heizkostenabrechnung. Alles aus einer Hand.",
};

export const wide = {
	caption: "Lindenallee 12 · Umrüstung abgeschlossen · Beispiel",
	objectPosition: "50% 60%",
};

export const stats = [
	{
		figure: KPI.firstVisit,
		text: "der Installationen gelingen beim ersten Termin",
	},
	{
		figure: KPI.notice,
		text: "vorher informiert Heidi Ihre Mieter über die Montage",
	},
	{
		figure: "3-in-1",
		text: "Installation, Ablesung und Abrechnung aus einer Hand",
	},
];

/**
 * Target of "Zum HKVO-Leitfaden →" (the design's SJbSeTYRqntQxpZQ8RVNf7):
 * /heizkostenverordnung. Without a target the link isn't rendered.
 */
export const HKVO_GUIDE_HREF: string | undefined = ROUTE_HKVO_LEITFADEN;

export const remoteDuty = {
	eyebrow: "Fernablesepflicht",
	h2: "Bis 2027 muss jeder Zähler fernablesbar sein.",
	law: "Die EU-Energieeffizienzrichtlinie und die Heizkostenverordnung verlangen, dass Zähler und Heizkostenverteiler ab dem 1. Januar 2027 aus der Ferne ablesbar sind.",
	text: "Heidi rüstet Ihren Bestand rechtzeitig um: effizient, transparent und zukunftssicher.",
	countLabel: "Tage bis zum 1. Januar 2027",
	link: { text: "Zum HKVO-Leitfaden", href: HKVO_GUIDE_HREF },
	// Placeholders until the content owner writes them (plan §4.4).
	h2Expired: "Seit 2027 muss jeder Zähler fernablesbar sein.",
	textExpired:
		"Heidi rüstet Ihren Bestand um: effizient, transparent und zukunftssicher.",
};

export type Step = {
	title: string;
	text: string;
	/** The photo's example chip; a step without one shows the dashboard demo. */
	chip?: { title: string; sub: string };
};

export const steps = {
	eyebrow: "So funktioniert der Umstieg",
	h2: "Drei Schritte. Heidi übernimmt den Rest.",
	/** Auto-advance interval of each tab (step 3 plays its demo). */
	intervalMs: [6000, 6000, 8500],
	items: [
		{
			title: "Bedarfsanalyse",
			text: "Sie nennen uns Ihre Liegenschaften und welche Zähler benötigt werden. Heidi prüft Bestand und Verträge, plant die passenden Geräte je Liegenschaft und stimmt die Umsetzung mit Ihnen ab. Sie haben dabei einen festen Ansprechpartner.",
			chip: {
				title: "Lindenallee 12",
				sub: "36 Einheiten · Planung fertig · Beispiel",
			},
		},
		{
			title: "Installation der Funktechnik",
			text: `Unsere Monteure rüsten Heizung, Warm- und Kaltwasser mit Funktechnik aus. Ihre Mieter werden ${KPI.notice} vorher informiert und bekommen am Montagetag ein Zeitfenster von ${KPI.window}. ${KPI.firstVisit} der Installationen gelingen beim ersten Termin.`,
			chip: {
				title: "Montage Di, 10:00 bis 11:30",
				sub: "Mieter informiert · Beispiel",
			},
		},
		{
			title: "Verbrauchsanalyse und Abrechnung",
			text: "Im Dashboard sehen Sie die Verbräuche jeder Liegenschaft. Ihre Mieter erhalten monatlich die Verbrauchsinformation, und die Heizkostenabrechnung erstellen Sie auf Knopfdruck.",
		},
	] satisfies Step[] as Step[],
	/** Step 3's dashboard demo (example data). */
	demo: {
		property: "Lindenallee 12",
		units: "24 Einheiten",
		period: "Jan – Okt",
		tag: "Beispieldaten",
		/** `to` is the design's figure; a dot groups thousands. */
		kpis: [
			{ label: "Heizung", to: "551", unit: "MWh", delta: "−9 % zum Vorjahr" },
			{
				label: "Warmwasser",
				to: "1.284",
				unit: "m³",
				delta: "−6 % zum Vorjahr",
			},
			{
				label: "Kaltwasser",
				to: "3.912",
				unit: "m³",
				delta: "−4 % zum Vorjahr",
			},
		],
		chart: {
			title: "Heizung",
			current: "2026",
			previous: "Vorjahr",
			months: [
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
			],
		},
		meters: {
			title: "Zähler",
			rows: [
				{ count: "740", label: "Heizkostenverteiler" },
				{ count: "370", label: "Warmwasserzähler" },
				{ count: "370", label: "Kaltwasserzähler" },
				{ count: "7", label: "Wärmemengenzähler" },
			],
		},
		button: ["Abrechnung erstellen", "Wird erstellt …", "Erstellt"],
		toast: {
			title: "Heizkostenabrechnung erstellt",
			sub: "24 Einheiten · nach HKVO · Beispiel",
		},
	},
};

/** A station's visual, drawn by `sections/journey/Visual.svelte`. */
export type StationVisual =
	| "portfolio"
	| "proxy"
	| "notice"
	| "takeover"
	| "tenant"
	| "twin"
	| "photos"
	| "readings"
	| "report"
	| "uvi"
	| "billing";

export type Station = {
	visual: StationVisual;
	phase: string;
	name: string;
	h3: string;
	text: string;
	/** No `href`: the link isn't rendered until its page exists. */
	link?: { text: string; href?: string };
};

export const journey = {
	eyebrow: "Der ganze Weg",
	h2: "Vom ersten Check bis zur Abrechnung. Alles aus einer Hand.",
	lead: "Elf Stationen, ein Ansprechpartner. So begleitet Heidi Ihren Bestand vom Wechsel über die Installation bis zur Heizkostenabrechnung.",
	navLabel: "Stationen",
	phases: [
		{ name: "Wechsel", sub: "Vom Check bis zum Vertrag", count: 4 },
		{ name: "Installation", sub: "Montage und Dokumentation", count: 3 },
		{ name: "Betrieb", sub: "Daten, Mieter, Abrechnung", count: 4 },
	],
	stations: [
		{
			visual: "portfolio",
			phase: "Wechsel",
			name: "Portfolio-Check",
			h3: "Vertragsenden auf einen Blick.",
			text: "Der Portfolio-Checker prüft automatisch, wann die Messdienstverträge Ihrer Liegenschaften enden. Für jede Liegenschaft sehen Sie den nächsten Schritt: kündigen, übernehmen oder direkt abrechnen.",
			link: { text: "Zum Portfolio-Checker", href: ROUTE_PORTFOLIO_CHECKER },
		},
		{
			visual: "proxy",
			phase: "Wechsel",
			name: "Vollmacht",
			h3: "Eine Unterschrift genügt.",
			text: "Mit einer Vollmacht beauftragen Sie Heidi, den Wechsel für Sie abzuwickeln. Die Vorlage füllen Sie online aus, laden sie herunter und senden sie unterschrieben an uns zurück.",
			// PSGCmHdZHDQWjWNLsDCmVT ("Vollmacht-Vorlage"): no page yet
			link: { text: "Zur Vollmacht-Vorlage" },
		},
		{
			visual: "notice",
			phase: "Wechsel",
			name: "Kündigung",
			h3: "Fristgerecht gekündigt.",
			text: "Heidi kündigt den bisherigen Messdienstvertrag fristgerecht zum nächstmöglichen Zeitpunkt, lässt das Vertragsende bestätigen und fordert die Ablesewerte zum Stichtag an.",
			link: { text: "Zur Muster-Kündigung", href: ROUTE_MUSTER_KUENDIGUNG },
		},
		{
			visual: "takeover",
			phase: "Wechsel",
			name: "Vertragsübernahme",
			h3: "Kein Warten aufs Vertragsende.",
			text: "Läuft Ihr Vertrag noch, übernimmt Heidi die bestehenden Zähler und wertet sie aus, egal wie lange der Vertrag noch läuft. Die Umrüstung auf Funk planen wir gemeinsam mit Ihnen.",
			// JMrh8PhRG78mcMBK2LDkbS ("Heidi Anbieterwechsel")
			link: {
				text: "Messdienstleister wechseln",
				href: ROUTE_MESSDIENSTWECHSEL,
			},
		},
		{
			visual: "tenant",
			phase: "Installation",
			name: "Mieterinformation",
			h3: "Ihre Mieter wissen rechtzeitig Bescheid.",
			text: `Heidi informiert Ihre Mieter ${KPI.notice} vor der Montage. Am Montagetag bekommen sie ein Zeitfenster von ${KPI.window}, Ihr Team muss nichts koordinieren.`,
		},
		{
			visual: "twin",
			phase: "Installation",
			name: "Installationstool",
			h3: "Jede Wohnung ist vorab geplant.",
			text: `Unsere Monteure und zertifizierten Partnerbetriebe arbeiten mit dem Heidi Installationstool. Jede Liegenschaft ist als digitaler Zwilling angelegt, jede Wohnung und jeder Zähler vorab geplant. So gelingen ${KPI.firstVisit} der Installationen beim ersten Termin.`,
			link: { text: "Zum Installationstool", href: ROUTE_INSTALLATIONSTOOL },
		},
		{
			visual: "photos",
			phase: "Installation",
			name: "Fotodokumentation",
			h3: "Zwei Fotos pro Zähler.",
			text: "Für jeden Zähler macht der Monteur zwei Fotos, direkt im Installationstool. Daraus entsteht ein sauberes Übergabeprotokoll, das Sie jederzeit einsehen können.",
			link: {
				text: "Für Installationsbetriebe",
				href: ROUTE_INSTALLATIONSPARTNER,
			},
		},
		{
			visual: "readings",
			phase: "Betrieb",
			name: "Auswertung der Zählerdaten",
			h3: "Daten per Funk, automatisch geprüft.",
			text: "Die Zähler senden ihre Werte per Funk, ohne Termin in der Wohnung. Heidi wertet sie aus und macht Auffälligkeiten sichtbar, etwa einen ungewöhnlich hohen Verbrauch.",
			link: { text: "Zur Auswertung", href: ROUTE_AUSWERTUNG },
		},
		{
			visual: "report",
			phase: "Betrieb",
			name: "Reports und Dashboards",
			h3: "Jede Liegenschaft im Überblick.",
			text: "Im Dashboard sehen Sie Heizung, Warm- und Kaltwasser je Liegenschaft und für Ihr ganzes Portfolio. Reports für Eigentümer erstellen Sie mit wenigen Klicks, Ihr ERP oder CRM ist angebunden.",
			link: { text: "Zum Dashboard", href: ROUTE_DASHBOARD },
		},
		{
			visual: "uvi",
			phase: "Betrieb",
			name: "Verbrauchsinformation (uVI)",
			h3: "Jeden Monat bei Ihren Mietern.",
			text: "Ihre Mieter erhalten jeden Monat automatisch ihre unterjährige Verbrauchsinformation, wie es die Heizkostenverordnung verlangt. Im Mieterportal sehen sie ihren Verbrauch jederzeit.",
			link: { text: "Zur uVI", href: ROUTE_VERBRAUCHSINFORMATION },
		},
		{
			visual: "billing",
			phase: "Betrieb",
			name: "Heizkostenabrechnung",
			h3: "Am Ende: auf Knopfdruck.",
			text: "Die Heizkostenabrechnung nach HKVO entsteht für jede Einheit einzeln und auf Knopfdruck. DocuScan liest die abrechnungsrelevanten Rechnungen aus und übernimmt die Daten.",
			// H4cZtgYCsvL4h7HGxZaHBs, as the landing footer's "Heizkostenabrechnung"
			link: { text: "Zur Heizkostenabrechnung", href: ROUTE_FUNKTIONEN },
		},
	] satisfies Station[] as Station[],
};

/** The stations' example data (all marked "Beispiel" in the visuals). */
export const journeyData = {
	portfolio: {
		title: "Portfolio-Checker",
		sub: "3 Liegenschaften",
		rows: [
			{
				name: "Lindenallee 12",
				sub: "Vertrag läuft bis 03/2029",
				step: "Übernehmen",
				kind: "take",
			},
			{
				name: "Gartenweg 3",
				sub: "Vertrag endet 12/2026",
				step: "Kündigen",
				kind: "cancel",
			},
			{
				name: "Hofstraße 21",
				sub: "Heidi-Funkzähler aktiv",
				step: "Abrechnen",
				kind: "bill",
			},
		],
	},
	proxy: {
		title: "Vollmacht zum Wechsel des Messdienstes",
		signature: "Unterschrift",
		stamp: "Unterschrieben",
	},
	notice: {
		title: "Kündigung",
		sub: "Gartenweg 3 · Beispiel",
		steps: [
			{
				title: "Kündigung versendet",
				sub: "fristgerecht zum nächstmöglichen Termin",
			},
			{ title: "Eingang bestätigt", sub: "vom bisherigen Messdienst" },
			{
				title: "Vertragsende bestätigt",
				sub: "Ablesewerte zum Stichtag angefordert",
			},
		],
	},
	takeover: {
		title: "Bestandsgeräte übernommen",
		sub: "Lindenallee 12 · Beispiel",
		rows: [
			{ label: "Heizkostenverteiler", count: 96 },
			{ label: "Wasserzähler", count: 48 },
			{ label: "Wärmemengenzähler", count: 2 },
		],
		pills: ["Vertrag läuft weiter", "Auswertung durch Heidi"],
	},
	tenant: {
		title: "Montage in Ihrer Wohnung",
		when: "Di, 12. März · 9 bis 11 Uhr",
		now: "jetzt",
		flat: "Lindenallee 12, WE 08",
		h: "Ihr Termin für die neuen Funkzähler",
		text: "Bitte sorgen Sie dafür, dass Heizkörper und Wasserzähler zugänglich sind.",
		figure: "14",
		figureText: ["Tage vorher", "informiert"],
	},
	twin: {
		title: "Lindenallee 12",
		sub: "Digitaler Zwilling · 12 WE · Beispiel",
		flats: 12,
		progress: "Montage",
		unit: "Wohnungen",
	},
	photos: {
		before: "Foto 1 · Zählerplatz",
		after: "Foto 2 · Neues Gerät",
		chip: "Übergabeprotokoll erstellt",
	},
	readings: {
		title: "Funkablesung",
		sub: "heute, 06:00 · Beispiel",
		rows: [
			{ id: "HKV 0412", room: "Wohnzimmer", value: "2.180", ok: true },
			{ id: "HKV 0413", room: "Schlafzimmer", value: "960", ok: true },
			{ id: "WWZ 0081", room: "Bad", value: "18,4 m³", ok: true },
			{ id: "HKV 0415", room: "Küche", value: "4.920", ok: false },
			{ id: "KWZ 0082", room: "Bad", value: "31,2 m³", ok: true },
		],
		ok: "plausibel",
		warn: "Auffällig",
	},
	report: {
		title: "Portfolio · Heizung",
		sub: "Jan bis Okt · Beispiel",
		bars: [62, 48, 40, 30, 22, 18, 16, 20, 34, 56],
		kpis: [
			{ label: "Liegenschaften", value: "12" },
			{ label: "Einheiten", value: "248" },
			{ label: "zum Vorjahr", value: "−8 %", good: true },
		],
		pdf: "Report Q3.pdf erstellt",
	},
	uvi: {
		label: "Ihr Verbrauch im Oktober",
		value: "412",
		unit: "Einheiten",
		tag: "Heizung · WE 08",
		bars: [70, 64, 52, 38, 24, 16, 14, 15, 26, 44],
		months: ["Jan", "Okt"],
		figure: "1×",
		figureText: ["pro Monat", "automatisch"],
	},
	billing: {
		title: "Heizkostenabrechnung",
		sub: "WE 01 bis WE 24",
		sum: "Nach HKVO",
		button: ["Abrechnung erstellen", "24 Abrechnungen erstellt"],
		note: "DocuScan hat 14 Rechnungen übernommen · Beispiel",
	},
};

export const split = {
	eyebrow: "Aufgabenteilung",
	h2: "Sie geben den Startschuss. Heidi erledigt den Rest.",
	you: {
		label: "Ihr Teil",
		unit: "Schritte",
		steps: [
			{
				title: "Liegenschaften nennen",
				text: "Eine Liste genügt, den Bestand prüft Heidi.",
			},
			{
				title: "Vollmacht unterschreiben",
				text: "Online ausfüllen, unterschreiben, zurücksenden.",
			},
			{
				title: "Abrechnung erstellen",
				text: "Einmal im Jahr, auf Knopfdruck.",
			},
		],
	},
	heidi: {
		label: "Heidis Teil",
		unit: "Aufgaben",
		tasks: [
			"Vertragsenden prüfen",
			"Kündigen oder Verträge übernehmen",
			`Mieter ${KPI.notice} vorher informieren`,
			"Zähler montieren und dokumentieren",
			"Daten per Funk auslesen und prüfen",
			"Verbrauchsinformation monatlich versenden",
			"Dashboard und Reports bereitstellen",
			"Rechnungen per DocuScan erfassen",
		],
	},
};

export type Feature = {
	icon: IconName;
	title: string;
	text: string;
	/** No page yet: the card renders without a link (README, open question 3). */
	href?: string;
};

export const features = {
	eyebrow: "Funktionen",
	h2: "Mehr als Ablesung.",
	items: [
		{
			icon: "signal",
			title: "Digitale Funkablesung",
			text: "Alle Sparten ohne manuelles Ablesen und ohne Termin in der Wohnung.",
			href: ROUTE_GERAETE,
		},
		{
			icon: "chart",
			title: "Dashboard",
			text: "Warmwasser, Kaltwasser und Heizung je Liegenschaft im Überblick.",
			href: ROUTE_DASHBOARD,
		},
		{
			icon: "file",
			title: "Dokumenten-Management",
			text: "DocuScan liest abrechnungsrelevante Rechnungen aus und übernimmt die Daten.",
			href: ROUTE_FUNKTIONEN,
		},
		{
			icon: "check",
			title: "Heizkostenabrechnung",
			text: "Auf Knopfdruck, nach HKVO und für jede Einheit einzeln.",
			href: ROUTE_FUNKTIONEN,
		},
		{
			icon: "users",
			title: "Mieterportal",
			text: "Die monatliche Verbrauchsinformation für Ihre Mieter, automatisch.",
			href: ROUTE_MIETERPORTAL,
		},
		{
			icon: "tool",
			title: "Installationstool",
			text: "Digitaler Zwilling, zwei Fotos pro Zähler, sauberes Übergabeprotokoll.",
			href: ROUTE_INSTALLATIONSTOOL,
		},
	] satisfies Feature[] as Feature[],
};

/** `true` = ✓, `false` = –, a string = that text. */
export type CompareValue = boolean | string;

export const comparison = {
	eyebrow: "Der Unterschied",
	h2: "Mit Heidi oder klassisch ablesen?",
	caption: "Vergleich: Heidi und klassische Ablesung",
	heads: { heidi: "Mit Heidi", classic: "Klassisch" },
	/** Screen-reader texts of the ✓ and – marks. */
	yes: "ja",
	no: "nein",
	rows: [
		{ label: "Ablesung", heidi: true, classic: "Termin vor Ort" },
		{
			label: "Ablesetermine in der Wohnung",
			heidi: "keine",
			classic: "regelmäßig",
		},
		{
			label: "Heizkostenabrechnung",
			heidi: "auf Knopfdruck",
			classic: `oft 6${NB}bis 9${NB}Monate`,
		},
		{ label: "Monatliche Verbrauchsinformation", heidi: true, classic: false },
		{
			label: "Rechnungen automatisch erfassen (DocuScan)",
			heidi: true,
			classic: false,
		},
		{ label: "Persönlicher Ansprechpartner", heidi: true, classic: false },
		{
			label: "Wechsel ohne Warten aufs Vertragsende",
			heidi: true,
			classic: false,
		},
	] satisfies { label: string; heidi: CompareValue; classic: CompareValue }[],
};

export const quotes = {
	eyebrow: "Kundenstimmen",
	h2: ["Weniger Aufwand. Mehr Überblick.", "Das sagen unsere Kunden."],
	keys: ["werne", "vitolus", "gerhard"] satisfies Testimonial["key"][],
};

export const faq = {
	eyebrow: "FAQ",
	title: "Echte Fragen. Klare Antworten.",
	items: [
		{
			question: "Wie lange dauert der Umstieg?",
			answer: `Das hängt von der Größe Ihres Bestands ab. Nach der Bedarfsanalyse planen wir die Installation gemeinsam mit Ihnen und informieren Ihre Mieter ${KPI.notice} vorher.`,
		},
		{
			question: "Müssen wir auf das Vertragsende warten?",
			answer:
				"Nein. Heidi übernimmt bestehende Zähler und wertet sie aus, egal wie lange Ihr aktueller Vertrag noch läuft.",
		},
		{
			question: "Was kostet Heidi?",
			answer: `Abgerechnet wird pro tatsächlich installiertem Zähler plus Abrechnungspauschale. Ab 1.000${NB}Einheiten erstellen wir ein individuelles Angebot.`,
		},
		{
			question: "Wie viele Installationen klappen beim ersten Termin?",
			answer: `${KPI.firstVisit} der Installationen gelingen beim ersten Termin. Ihre Mieter bekommen ein Zeitfenster von ${KPI.window}.`,
		},
		{
			question: "Wo liegen unsere Daten?",
			answer: "Auf Servern in Deutschland, verarbeitet nach DSGVO und BDSG.",
			more: { text: "Mehr zu Sicherheit", href: ROUTE_SICHERHEIT },
		},
	] satisfies FaqItem[],
};

export const contact = {
	h2: "Lassen Sie uns über Ihren Bestand sprechen.",
	text: "Wir zeigen Ihnen, wie der Umstieg für Ihre Liegenschaften aussieht. Persönlich und unverbindlich.",
	caption: "Ihr persönlicher Ansprechpartner bei Heidi",
	objectPosition: "50% 30%",
};
