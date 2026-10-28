/**
 * Every text and the example data of /messdienst-wechseln, word for word from
 * the design, in the shapes of the shared `uv` template, plus the switch
 * planner's and the Vollmacht's texts. Components hold markup and behaviour
 * only.
 *
 * The product as described, the planner, the Vollmacht's text, the company
 * claims and the example data need sign-off before the cutover
 * (`ongoing-tasks/go-live-gates.md` §46). The KPIs 14 Tage, 1–2 h and 92 %
 * were confirmed on 2026-10-12.
 */
import { DEMO_HREF } from "$lib/landing/cta";
import type { Testimonial } from "$lib/landing/data/testimonials";
import type { FaqItem } from "$lib/landing/faqJsonLd";
import type { GeneratorTexts } from "$lib/landing/pages/muster-kuendigung/components/types";
import type {
	AppNavItem,
	BillTile,
	CalendarTile,
	DocTile,
	Figure,
	Link,
	ListEntry,
	PhoneListItem,
	PhoneTile,
	Row,
} from "$lib/landing/sections/uv/types";
import type { SplitHeading } from "$lib/landing/types";
import {
	ROUTE_FRISTENRECHNER,
	ROUTE_MUSTER_KUENDIGUNG,
	ROUTE_PORTFOLIO_CHECKER,
} from "$lib/routes";

const NB = " ";

/** Every "Demo buchen" leads to the booking page. */
const demoLink: Link = { text: "Demo buchen", href: DEMO_HREF };

/** The switch planner's section (the design's id). */
export const PLANNER_ID = "planer";
/** The Vollmacht's section (the design's id). */
export const VOLLMACHT_ID = "vollmacht";

export const hero = {
	srTitle: "Messdienst-Anbieterwechsel mit Heidi",
	word: "Anbieterwechsel",
	/** The design's `#aw-css` size, at every width. */
	wordSize: "clamp(34px, 8.6vw, 130px)",
	lead: "Wechseln Sie Ihren Messdienst, auch wenn der Vertrag noch läuft. Eine Vollmacht, und Heidi erledigt den Rest.",
	primary: demoLink,
	secondary: { text: "Wechsel planen", href: `#${PLANNER_ID}` } satisfies Link,
};

/** The example building of the mocks. */
const PROPERTY = "Lindenallee 12";

/** The hero's app window: the switch, step by step. */
export const list = {
	label: "Beispiel: Heidi Wechsel",
	brand: "Heidi",
	nav: [
		{ icon: "swap", text: "Wechsel" },
		{ icon: "doc", text: "Fristen" },
		{ icon: "users", text: "Montage" },
	] satisfies AppNavItem[] as AppNavItem[],
	navFoot: "Wechsel",
	head: "Heidi Wechsel",
	tag: "Beispieldaten",
	title: "Ihr Wechsel läuft.",
	sub: `${PROPERTY} · Beispiel`,
	entries: [
		{
			icon: "doc",
			title: "Vollmacht",
			sub: "Unterschrieben",
			before: "Offen",
			after: "Erteilt",
		},
		{
			icon: "swap",
			title: "Kündigung Messdienst A",
			sub: "Fristgerecht zum 31.12.",
			before: "Wird versendet",
			after: "Versendet",
		},
		{
			icon: "device",
			title: "Bestandszähler",
			sub: "Ablesung ab sofort über Heidi",
			before: "Wird übernommen",
			after: "Übernommen",
		},
		{
			icon: "calendar",
			title: "Funkzähler-Montage",
			sub: "Zum Vertragsende",
			before: "Wird geplant",
			after: "Geplant",
		},
	] satisfies ListEntry[] as ListEntry[],
};

export const statement = {
	label: "Worum es geht",
	text: "Ein Messdienstwechsel klingt nach Aufwand: Fristen, Kündigungen, neue Zähler, Mieter informieren. Mit Heidi ist es eine Unterschrift. Wir übernehmen Ihre vorhandenen Zähler sofort, kündigen fristgerecht beim bisherigen Anbieter und tauschen zum Vertragsende auf Heidi-Funkzähler.",
};

/** Confirmed KPIs (2026-10-12). */
export const KPI = {
	notice: 14,
	window: `1–2${NB}h`,
	firstVisit: 92,
};

export type TileKind = "bill" | "doc" | "phone" | "calendar";

export const rows = {
	label: "So arbeitet Heidi",
	primary: demoLink,
	secondary: { text: "Häufige Fragen", href: "#faq" } satisfies Link,
	items: [
		{
			tag: "Ohne Warten",
			title: ["Wechseln, auch wenn", "der Vertrag noch läuft."],
			paragraphs: [
				"Heidi übernimmt Ihre vorhandenen Zähler und wertet sie sofort aus, egal wie lange der bisherige Vertrag noch läuft.",
				"Ablesung, Verbrauchsinformation und Abrechnung laufen ab sofort über Heidi.",
			],
			tile: "bill",
			tone: "mint",
		},
		{
			tag: "Vollmacht",
			title: ["Eine Unterschrift.", "Heidi kündigt."],
			paragraphs: [
				"Mit Ihrer Vollmacht kündigt Heidi fristgerecht beim bisherigen Messdienst und fordert die Daten an.",
				"Sie müssen keine Briefe schreiben und keine Fristen notieren.",
			],
			tile: "doc",
			tone: "stone",
		},
		{
			tag: "Fristen",
			title: ["Keine Frist", "verpassen."],
			paragraphs: [
				"Heidi behält die Kündigungsfristen Ihres ganzen Bestands im Blick und meldet sich rechtzeitig.",
				"Verpasste Fristen verlängern viele Verträge um ein weiteres Jahr. Das passiert mit Heidi nicht.",
			],
			tile: "phone",
			tone: "ink",
		},
		{
			tag: "Montage",
			title: ["Funkzähler", "zum Vertragsende."],
			paragraphs: [
				`Zum Vertragsende tauscht Heidi auf eigene Funkzähler. Mieter werden ${KPI.notice} Tage vorher informiert und bekommen ein Zeitfenster von 1 bis 2 Stunden.`,
				`${KPI.firstVisit}${NB}% der Installationen gelingen beim ersten Termin.`,
			],
			tile: "calendar",
			tone: "mint",
		},
	] satisfies Row<TileKind>[] as Row<TileKind>[],
};

/** Row 1: waiting for the contract's end against switching with Heidi. */
export const bill = {
	without: "Warten",
	with: "Mit Heidi",
	rows: [
		{ kind: "cut", label: "Auf das Vertragsende warten", value: "oft Jahre" },
		{ kind: "cut", label: "Fristen selbst überwachen", value: "manuell" },
		{ kind: "ok", label: "Bestandszähler sofort übernommen" },
		{ kind: "ok", label: "Abrechnung ab sofort über Heidi" },
	],
	sum: { label: "Wartezeit", before: "Jahre", after: "keine" },
} satisfies BillTile;

/** Row 2: the Vollmacht and what it covers. */
export const doc = {
	title: "Vollmacht Messdienstwechsel",
	sub: `${PROPERTY} · Beispiel`,
	rows: [
		{ label: "Kündigung beim bisherigen Anbieter" },
		{ label: "Fristgerecht zum Laufzeitende" },
		{ label: "Datenübergabe angefordert" },
		{ label: "Ihr Aufwand", value: "1 Unterschrift" },
	],
	result: "Wechsel beauftragt",
} satisfies DocTile;

/** Row 3's phone: the reminder, then the portfolio's notice periods. */
export const phone = {
	time: "9:41",
	app: "Heidi",
	title: "Kündigungsfrist in 30 Tagen",
	sub: "Parkstraße 4 · Heidi kündigt für Sie",
	items: [
		{ title: PROPERTY, sub: "Kündigung versendet", state: "ok" },
		{ title: "Gartenweg 3", sub: "Kündigung versendet", state: "ok" },
		{
			title: "Parkstraße 4",
			sub: "Frist in 30 Tagen · Heidi kündigt",
			state: "cur",
		},
		{ title: "Am Markt 7", sub: "Vertrag läuft bis 2029", state: "open" },
	] satisfies PhoneListItem[] as PhoneListItem[],
	badges: { ok: "✓", cur: "!" },
} satisfies Pick<PhoneTile, "time" | "app" | "title" | "sub"> & {
	items: PhoneListItem[];
	badges: Partial<Record<PhoneListItem["state"], string>>;
};

/** Row 4: the twelve flats, fitted one by one. */
export const calendar: CalendarTile = {
	months: Array.from(
		{ length: 12 },
		(_, i) => `WE ${String(i + 1).padStart(2, "0")}`,
	),
	current: 9,
	done: "montiert",
	doing: "wird montiert",
	open: "offen",
	noteDone: "{x} montiert",
	noteDoing: "{x} wird montiert",
};

export const rotator = {
	label: "Was Heidi übernimmt",
	lead: "Heidi übernimmt beim Wechsel:",
	phrases: [
		"Kündigung per Vollmacht",
		"Bestandszähler ab sofort",
		"Fristen im Blick",
		"Montage zum Vertragsende",
	],
	intervalMs: 2300,
};

export const numbers = {
	h2: "Der Wechsel in Zahlen",
	/** The figure before the photo. */
	first: {
		value: "1",
		text: "Unterschrift für den ganzen Wechsel",
		count: 1,
	} satisfies Figure as Figure,
	/** The figures after the photo. */
	rest: [
		{ value: "0", text: "Tage warten aufs Vertragsende" },
		{
			value: String(KPI.notice),
			unit: "Tage",
			text: "vorher informiert Heidi die Mieter",
			count: KPI.notice,
		},
		{ value: KPI.window, text: "Zeitfenster am Montagetag", compact: true },
		{
			value: String(KPI.firstVisit),
			unit: "%",
			text: "der Installationen beim ersten Termin",
			count: KPI.firstVisit,
		},
	] satisfies Figure[] as Figure[],
};

export type AudienceKey = "checker" | "letter";

export const audience = {
	label: "Ihr Wechsel",
	cards: [
		{
			title: "Vertragsende unbekannt?",
			text: "Laden Sie Ihre Verträge in den Portfolio-Checker. Heidi liest Laufzeiten und Kündigungsfristen für Ihren ganzen Bestand aus.",
			// UFviBtC2mkneFNeWnfHAWp
			cta: { text: "Zum Portfolio-Checker", href: ROUTE_PORTFOLIO_CHECKER },
			image: "checker",
		},
		{
			title: "Lieber selbst kündigen?",
			text: "Mit der Muster-Kündigung schreiben Sie Ihrem bisherigen Messdienst in zwei Minuten. Oder Heidi kündigt per Vollmacht.",
			// 4WYU5hjVsWSLrxuo7wsdm6
			cta: { text: "Zur Muster-Kündigung", href: ROUTE_MUSTER_KUENDIGUNG },
			image: "letter",
			objectPosition: "50% 35%",
		},
	] satisfies {
		title: string;
		text: string;
		cta: Link;
		image: AudienceKey;
		objectPosition?: string;
	}[],
};

export const quotes = {
	h2: ["Gewechselt.", "Unsere Kunden sagen es selbst."] as [string, string],
	keys: [
		"werne",
		"vitolus",
		"gerhard",
	] satisfies Testimonial["key"][] as Testimonial["key"][],
};

export const picture = {
	label: "Heidi",
	caption: ["Ein Wechsel.", "Eine Unterschrift."] as [string, string],
};

/** The switch planner (the design's `.awp`). */
export const planner = {
	pill: "Wechsel-Planer",
	h2: {
		text: "Wann können Sie wechseln?",
		muted: "Sofort. Wir zeigen Ihnen, wie.",
	},
	lead: "Geben Sie ein, wann Ihr Vertrag endet und welche Kündigungsfrist gilt. Der Planer zeigt, bis wann gekündigt sein muss und was Heidi bis dahin übernimmt.",
	endLabel: "Vertrag endet",
	// Ours: the two selects' names (the design's label holds both).
	monthLabel: "Monat",
	yearLabel: "Jahr",
	noticeLabel: "Kündigungsfrist",
	notices: [
		{ value: 3, label: "3 Monate" },
		{ value: 6, label: "6 Monate" },
		{ value: 12, label: "12 Monate" },
	],
	/** The start: December, two years on, three months' notice. */
	start: { month: 11, yearsAhead: 2, notice: 3 },
	/** How many years the year select offers, this one included. */
	years: 7,
	by: {
		label: "Kündigung spätestens bis",
		/** `{n}`: days left. */
		left: "noch {n} Tage",
		late: "Frist verpasst: Laufzeit verlängert sich meist um 12 Monate",
	},
	heidi: {
		label: "Heidi übernimmt",
		value: "ab sofort",
		note: "mit Ihren Bestandszählern",
	},
	mount: {
		label: "Funkzähler-Montage",
		note: `Mieter ${KPI.notice} Tage vorher informiert`,
	},
	timeline: {
		old: "Bisheriger Vertrag",
		heidi: "Heidi: Ablesung, uVI und Abrechnung",
		now: "Heute",
		by: "Kündigung",
		end: "Vertragsende",
	},
	/** The summary; the bold parts are the design's `<b>`. */
	message: {
		start: "Heidi übernimmt ",
		today: "ab heute",
		middle:
			" Ablesung, Verbrauchsinformation und Heizkostenabrechnung mit Ihren vorhandenen Zählern. Mit Ihrer Vollmacht kündigt Heidi bis ",
		beforeEnd: ", und zum Vertragsende im ",
		end: " tauschen wir auf Heidi-Funkzähler.",
	},
} satisfies {
	h2: SplitHeading;
	notices: { value: number; label: string }[];
	[key: string]: unknown;
};

export const VOLLMACHT_FIELD_KEYS = [
	"sName",
	"sStr",
	"sOrt",
	"sPers",
	"sFunk",
	"mName",
	"mNr",
	"lieg",
] as const;
export type VollmachtFieldKey = (typeof VOLLMACHT_FIELD_KEYS)[number];

/** In the design's (and the letter's) order. */
export const POWER_KEYS = ["kuend", "ende", "werte", "geraete"] as const;
export type PowerKey = (typeof POWER_KEYS)[number];

export type VollmachtField = {
	key: VollmachtFieldKey;
	label: string;
	placeholder: string;
	optional?: boolean;
	/** Small text after the label ("eine pro Zeile"). */
	hint?: string;
	multiline?: boolean;
};

/** The Vollmacht's section: the form, the preview and its buttons. */
export const vollmacht = {
	pill: "Vollmacht",
	h2: { text: "Eine Vollmacht. ", muted: "Den Wechsel übernehmen wir." },
	lead: "Mit dieser Vorlage beauftragen Sie Heidi, den Wechsel für Sie abzuwickeln: kündigen, Vertragsende bestätigen lassen und Ablesewerte anfordern. Ausfüllen, herunterladen, unterschreiben und an uns zurückschicken.",
	optional: "optional",
	principal: {
		legend: "Vollmachtgeber",
		fields: [
			{
				key: "sName",
				label: "Hausverwaltung oder Eigentümer",
				placeholder: "Muster Hausverwaltung GmbH",
			},
			{
				key: "sStr",
				label: "Straße und Hausnummer",
				placeholder: "Beispielstraße 1",
			},
			{ key: "sOrt", label: "PLZ und Ort", placeholder: "10115 Berlin" },
		],
		// Side by side (.kd-2)
		pair: [
			{
				key: "sPers",
				label: "Vertreten durch",
				placeholder: "Vor- und Nachname",
			},
			{
				key: "sFunk",
				label: "Funktion",
				placeholder: "Geschäftsführung",
				optional: true,
			},
		],
	},
	provider: {
		legend: "Bisheriger Messdienst",
		fields: [
			{
				key: "mName",
				label: "Name des Messdienstleisters",
				placeholder: "Name des Unternehmens",
			},
			{
				key: "mNr",
				label: "Vertrags- oder Kundennummer",
				placeholder: "z. B. 12345678",
				optional: true,
			},
			{
				key: "lieg",
				label: "Liegenschaften",
				hint: "eine pro Zeile",
				placeholder: "Lindenallee 12, 10115 Berlin",
				multiline: true,
			},
		],
	},
	powers: {
		legend: "Heidi darf für Sie",
		items: [
			{
				key: "kuend",
				title: "Kündigen",
				text: "Den Messdienstvertrag fristgerecht kündigen",
			},
			{
				key: "ende",
				title: "Vertragsende klären",
				text: "Laufzeit und Fristen beim Messdienst erfragen und bestätigen lassen",
			},
			{
				key: "werte",
				title: "Ablesewerte anfordern",
				text: "Werte und Abrechnungsdaten zum Stichtag anfordern",
			},
			{
				key: "geraete",
				title: "Geräte abstimmen",
				text: "Miete, Kauf oder Abbau der Bestandsgeräte klären",
			},
		] satisfies { key: PowerKey; title: string; text: string }[],
	},
	// Ours: the preview's accessible name (the design has none).
	previewLabel: "Vorschau der Vollmacht",
	signature: "Unterschrift, Stempel",
	buttons: {
		docx: "Word herunterladen",
		pdf: "PDF",
		copy: "Text kopieren",
		busy: "Wird erstellt …",
		copied: "Kopiert",
	},
	messages: {
		started: "Download gestartet: ",
		failed:
			"Der Download ist hier gerade nicht möglich. Nutzen Sie „Text kopieren“.",
		copyFailed:
			"Kopieren nicht möglich. Markieren Sie den Text in der Vorschau.",
	},
	legal:
		"Vorlage ohne Gewähr, keine Rechtsberatung. Unterschrieben an Heidi zurücksenden, wir melden uns mit den nächsten Schritten.",
} satisfies GeneratorTexts & {
	h2: SplitHeading;
	principal: {
		legend: string;
		fields: VollmachtField[];
		pair: VollmachtField[];
	};
	provider: { legend: string; fields: VollmachtField[] };
	[key: string]: unknown;
};

/** The Vollmacht's sentences (the design's `build()`), for `vollmacht.ts`. */
export const vollmachtText = {
	title: "Vollmacht zum Wechsel des Messdienstes",
	principal: "Vollmachtgeber:",
	agentLabel: "Bevollmächtigte:",
	/** Heidi as the design writes it (`ADDRESS` abbreviates the street). */
	agent: ["Heidi Systems GmbH", "Monbijouplatz 4, 10178 Berlin"],
	authorise:
		"Hiermit bevollmächtigen wir die Heidi Systems GmbH, uns gegenüber unserem bisherigen Messdienstleister ",
	/** `{nr}`: the contract or customer number. */
	contractNo: " (Vertrags-/Kundennr. {nr})",
	about: " im Zusammenhang mit dem Wechsel des Messdienstes für die folgende",
	one: " Liegenschaft",
	many: "n Liegenschaften",
	represent: " zu vertreten:",
	bullet: "• ",
	powersIntro: "Die Vollmacht umfasst insbesondere, in unserem Namen",
	/** Each ends in a comma; the last one's becomes a full stop. */
	powers: {
		kuend:
			"den bestehenden Vertrag über Messdienstleistungen fristgerecht zum nächstmöglichen Zeitpunkt zu kündigen,",
		ende: "Auskünfte über Vertragslaufzeit und Kündigungsfristen einzuholen und das Vertragsende bestätigen zu lassen,",
		werte:
			"Ablese- und Verbrauchswerte sowie die für die Abrechnung notwendigen Daten zum Stichtag anzufordern und entgegenzunehmen,",
		geraete:
			"Fragen zu Miete, Kauf und Abbau der installierten Messgeräte zu klären und Termine abzustimmen,",
	} satisfies Record<PowerKey, string>,
	validity:
		"Die Vollmacht gilt bis auf schriftlichen Widerruf. Wir bitten den bisherigen Messdienstleister, Schriftverkehr zum Wechsel direkt mit der Heidi Systems GmbH zu führen.",
	placeholders: {
		sName: "Name der Verwaltung oder des Eigentümers",
		sStr: "Straße, Hausnummer",
		sOrt: "PLZ Ort",
		mName: "Name des Messdienstleisters",
		lieg: "Adresse der Liegenschaft",
		place: "Ort",
		sPers: "Vor- und Nachname",
	},
	filePrefix: "Vollmacht-Messdienstwechsel-",
	/** The file name's end when no principal is given. */
	fileFallback: "Heidi",
};

export const faq = {
	title: "Häufige Fragen",
	items: [
		{
			question: "Kann ich wechseln, obwohl mein Vertrag noch läuft?",
			answer:
				"Ja. Heidi übernimmt Ihre vorhandenen Zähler und wertet sie sofort aus, unabhängig von der Restlaufzeit. Getauscht wird erst zum Vertragsende.",
		},
		{
			question: "Wer kündigt beim bisherigen Messdienst?",
			// 4WYU5hjVsWSLrxuo7wsdm6
			answer: `Heidi, mit Ihrer Vollmacht und fristgerecht. Wenn Sie lieber selbst kündigen, nutzen Sie unsere <a href="${ROUTE_MUSTER_KUENDIGUNG}">Muster-Kündigung</a>.`,
		},
		{
			question: "Was passiert, wenn ich die Kündigungsfrist verpasse?",
			answer:
				"Viele Messdienstverträge verlängern sich dann automatisch, oft um 12 Monate. Heidi übernimmt Ihre Zähler trotzdem sofort, und wir kündigen zum nächsten möglichen Termin.",
		},
		{
			question: "Wie erfahren die Mieter vom Wechsel?",
			answer: `Heidi informiert die Mieter ${KPI.notice} Tage vor der Montage und gibt ein Zeitfenster von 1 bis 2 Stunden vor.`,
		},
		{
			question: "Woher weiß ich, wann meine Verträge enden?",
			// UFviBtC2mkneFNeWnfHAWp, LWEbZPCoSDLT1D59BaULyE
			answer: `Mit dem <a href="${ROUTE_PORTFOLIO_CHECKER}">Portfolio-Checker</a> oder dem <a href="${ROUTE_FRISTENRECHNER}">Fristenrechner</a>.`,
		},
	] satisfies FaqItem[] as FaqItem[],
};

/** The glass closing card with the design's video button. */
export const closing = {
	h2: "Wechseln Sie jetzt. Wir kümmern uns um den Rest.",
	text: "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.",
	/** The video button (the design's .dcta-b) → the booking page. */
	button: {
		text: "Demo buchen",
		sub: "Mit Ihrem Ansprechpartner",
		href: DEMO_HREF,
	},
};
