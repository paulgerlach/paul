/**
 * Texts of /portfolio-checker, word for word from the design
 * (https://claude.ai/artifact/UFviBtC2mkneFNeWnfHAWp): the page, the tool,
 * the five example files and the evaluation's labels. The example
 * properties with their dates are `checker.ts`'; the per-property list's
 * texts are the shared `data/nextSteps.ts`. The product and the privacy
 * promise await sign-off (plan §4.4).
 */
import { DEMO_HREF } from "$lib/landing/cta";
import type { LogoKey } from "$lib/landing/data/logos";
import type { Testimonial } from "$lib/landing/data/testimonials";
import type { FaqItem } from "$lib/landing/faqJsonLd";
import type { SplitHeading } from "$lib/landing/types";
import type { FileKind } from "./checker";
import type { IconName } from "./icons";

/** The hero's tool, the target of the nav CTA "Bestand prüfen". */
export const CHECKER_ID = "checker";
/** The evaluation's section (the design's `#pc-res-sec`). */
export const RESULT_ID = "auswertung";

export const hero = {
	pill: "Portfolio-Checker",
	h1: "Vertragsunterlagen hochladen.",
	h1Accent: "Heidi liest den Rest.",
	lead: "Messdienstverträge, Nachträge, Preisblätter oder Gerätemietverträge: Heidi prüft jedes Dokument, analysiert Laufzeiten und Fristen und zieht die wichtigsten Daten heraus. Für jede Liegenschaft, auf einen Blick.",
	ticks: [
		"Alle Vertragsarten",
		"Geprüft und analysiert",
		"Kerndaten auf einen Blick",
	],
	steps: ["Hochladen", "Prüfen", "Analysieren", "Extrahieren"],
};

export const tool = {
	drop: "Vertragsunterlagen hier ablegen",
	or: "oder ",
	pick: "Dateien auswählen",
	formats: " · PDF, Scan oder Foto",
	accept: ".pdf,.jpg,.jpeg,.png,.tif,.tiff,.heic,.docx",
	example: "Mit Beispielunterlagen testen",
	run: "Unterlagen prüfen",
	privacy: "Ihre Dateien bleiben in Ihrem Browser.",
	/** The four status dots of a file. */
	status: ["Hochgeladen", "Geprüft", "Analysiert", "Extrahiert"],
	remove: "Entfernen",
	badge: { pdf: "PDF", img: "IMG", doc: "DOC" } satisfies Record<
		FileKind,
		string
	>,
	/** Tags of the visitor's own files after the format check. */
	own: {
		img: "Scan oder Foto",
		pdf: "PDF-Dokument",
		checked: "Format geprüft",
		tooBig: "Datei zu groß",
		unsupported: "Format nicht unterstützt",
	},
};

export type ExampleFile = {
	name: string;
	kind: FileKind;
	size: number;
	/** The recognised document type. */
	type: string;
	/** Pages and legibility. */
	ok: string;
	warn?: string;
};

/** The design's `EX`: five fictitious files for three properties. */
export const exampleFiles: ExampleFile[] = [
	{
		name: "Messdienstvertrag_Lindenallee12.pdf",
		kind: "pdf",
		size: 842e3,
		type: "Messdienstvertrag",
		ok: "6 Seiten, lesbar",
	},
	{
		name: "Nachtrag_Laufzeit_Lindenallee12.pdf",
		kind: "pdf",
		size: 214e3,
		type: "Nachtrag",
		ok: "2 Seiten, lesbar",
	},
	{
		name: "Preisblatt_Messdienst_A.pdf",
		kind: "pdf",
		size: 156e3,
		type: "Preisblatt",
		ok: "1 Seite, lesbar",
	},
	{
		name: "Geraetemietvertrag_Parkstrasse4.pdf",
		kind: "pdf",
		size: 1.21e6,
		type: "Gerätemietvertrag",
		ok: "8 Seiten, lesbar",
	},
	{
		name: "Scan_Vertrag_AmMarkt7.jpg",
		kind: "img",
		size: 2.4e6,
		type: "Messdienstvertrag (Scan)",
		ok: "Scan, 3 Seiten",
		warn: "Seite 2 unscharf, Werte geprüft",
	},
];

export const result = {
	pill: "Auswertung",
	heading: {
		text: "Die wichtigsten Daten ",
		muted: "aus Ihren Unterlagen.",
	} satisfies SplitHeading,
	tag: "Beispieldaten · fiktive Verträge",
	kpis: {
		documents: "Dokumente geprüft",
		properties: "Liegenschaften erkannt",
		next: "Nächste Kündigungsfrist",
		nextNote: (name: string, days: number) => `${name} · in ${days} Tagen`,
		urgent: "Handlungsbedarf",
		urgentNote: (n: number) =>
			`${n === 1 ? "Hinweis" : "Hinweise"} mit hoher Priorität`,
	},
	overview: {
		columns: ["Liegenschaft", "Vertrag", "Empfehlung"],
		term: "Laufzeit bis ",
		notice: "Kündigung bis ",
		badge: "Beispieldaten",
		hover: "Für Details über die Empfehlung fahren",
	},
	own: {
		title: (ok: number, all: number) =>
			`${ok} von ${all} Dokumenten sind bereit für die Auswertung.`,
		text: "Format und Lesbarkeit sind geprüft. Analyse und Extraktion übernimmt Heidi für Ihren Bestand: Laufzeiten, Fristen, Geräte und Kosten, zusammengeführt je Liegenschaft. Ihre Dateien haben dafür Ihren Browser noch nicht verlassen.",
		request: { text: "Auswertung anfragen", href: DEMO_HREF },
		example: "Beispielauswertung ansehen",
		ready: "bereit",
		check: "prüfen",
	},
	csv: "Als CSV herunterladen",
	cta: { text: "Mit eigenem Bestand auswerten", href: DEMO_HREF },
	fileName: "Heidi-Portfolio-Beispiel.csv",
	saved: "Gespeichert: ",
	failed: "Der Download ist hier gerade nicht möglich.",
};

export type Card = { icon: IconName; title: string; text: string };

export const documents = {
	pill: "Welche Unterlagen?",
	heading: {
		text: "So, wie sie bei Ihnen liegen. ",
		muted: "Auch als Scan.",
	} satisfies SplitHeading,
	items: [
		{
			icon: "doc",
			title: "Messdienstverträge",
			text: "Wärme- und Wassermessdienst, Abrechnungsdienst",
		},
		{
			icon: "clipboard",
			title: "Nachträge",
			text: "Verlängerungen, Preisänderungen, Zusatzvereinbarungen",
		},
		{
			icon: "euro",
			title: "Preisblätter",
			text: "Gerätemiete, Ablese- und Abrechnungskosten",
		},
		{
			icon: "gauge",
			title: "Gerätemiet- und Wartungsverträge",
			text: "Heizkostenverteiler, Wasser- und Wärmezähler",
		},
		{
			icon: "chart",
			title: "Heizkostenabrechnungen",
			text: "Zur Prüfung von Anbieter, Geräten und Kosten",
		},
		{
			icon: "people",
			title: "WEG-Unterlagen",
			text: "Beschlüsse und Einladungen zur Eigentümerversammlung",
		},
	] satisfies Card[] as Card[],
};

/** A chip of the steps' demo: a tick, a warning, plain, the added Nachtrag, or a value. */
export type Chip =
	| { kind: "ok" | "wn" | "plain" | "add"; text: string }
	| { kind: "kv"; label: string; value: string };

export const how = {
	pill: "So arbeitet der Checker",
	heading: {
		text: "Prüfen, analysieren, ",
		muted: "extrahieren.",
	} satisfies SplitHeading,
	steps: [
		{
			title: "Prüfen",
			text: "Welcher Dokumenttyp ist das, ist es vollständig und lesbar? Unklare Stellen markiert Heidi, statt sie zu raten.",
			chips: [
				{ kind: "ok", text: "Messdienstvertrag" },
				{ kind: "ok", text: "6 Seiten, lesbar" },
				{ kind: "wn", text: "Seite 3 unscharf" },
			],
		},
		{
			title: "Analysieren",
			text: "Verträge, Nachträge und Preisblätter werden je Liegenschaft zusammengeführt. Was später vereinbart wurde, gilt.",
			chips: [
				{ kind: "plain", text: "Vertrag 2021" },
				{ kind: "add", text: "+ Nachtrag 2023" },
				{ kind: "ok", text: "Laufzeit bis 2027" },
			],
		},
		{
			title: "Extrahieren",
			text: "Anbieter, Laufzeit, Kündigungsfrist, Geräte und Kosten als strukturierte Daten. Zum Weiterarbeiten oder als Export.",
			chips: [
				{ kind: "kv", label: "Kündigung bis", value: "30.09." },
				{ kind: "kv", label: "Geräte", value: "72" },
			],
		},
	] satisfies { title: string; text: string; chips: Chip[] }[] as {
		title: string;
		text: string;
		chips: Chip[];
	}[],
};

export const fields = {
	pill: "Was herausgelesen wird",
	heading: {
		text: "Die Daten, die Sie ",
		muted: "sonst zusammensuchen.",
	} satisfies SplitHeading,
	items: [
		{ icon: "gauge", title: "Messdienstanbieter", text: "und Vertragsnummer" },
		{ icon: "building", title: "Liegenschaft", text: "Adresse und Einheiten" },
		{
			icon: "calendar",
			title: "Laufzeit",
			text: "Beginn, Ende, Verlängerung",
		},
		{
			icon: "clock",
			title: "Kündigungsfrist",
			text: "und das Datum, bis wann gekündigt sein muss",
		},
		{ icon: "meter", title: "Geräte", text: "Art, Anzahl, Fernablesbarkeit" },
		{
			icon: "euro",
			title: "Kosten",
			text: "Gerätemiete, Ablesung, Abrechnung",
		},
		{
			icon: "warning",
			title: "Eichfristen",
			text: "Wann Zähler getauscht werden müssen",
		},
		{
			icon: "tick",
			title: "Hinweise",
			text: "Fristen, Pflichten, Widersprüche",
		},
	] satisfies Card[] as Card[],
};

export const nextStepsHead = {
	pill: "Auswertungen",
	heading: {
		text: "Für jede Liegenschaft ",
		muted: "der nächste Schritt.",
	} satisfies SplitHeading,
	lead: "Heidi prüft Vertragslaufzeit und Zähler jeder Liegenschaft und zeigt den nächsten Schritt: Vertrag übernehmen, Vertrag kündigen oder direkt abrechnen.",
};

export const decision = {
	pill: "Nach der Auswertung",
	heading: {
		text: "Übernehmen oder kündigen? ",
		muted: "Beides geht mit Heidi.",
	} satisfies SplitHeading,
	cards: [
		{
			icon: "swap",
			title: "Bestehenden Vertrag übernehmen",
			text: "Heidi übernimmt bestehende Verträge und wertet Ihre vorhandenen Zähler aus, egal wie lange der Vertrag noch läuft.",
			points: [
				"Sofort zu Heidi wechseln",
				"Vorhandene Zähler weiter nutzen",
				"Abrechnung per Klick ab dem Stichtag",
			],
		},
		{
			icon: "doc",
			title: "Fristgerecht kündigen",
			text: "Steht das Vertragsende bevor, kündigt Heidi mit Ihrer Vollmacht beim bisherigen Anbieter und plant die Montage rechtzeitig.",
			points: [
				"Kündigung per Vollmacht",
				"Alles aus einer Hand",
				"Mieter 14 Tage vorher informiert",
			],
			dark: true,
		},
	] satisfies {
		icon: IconName;
		title: string;
		text: string;
		points: string[];
		dark?: boolean;
	}[] as {
		icon: IconName;
		title: string;
		text: string;
		points: string[];
		dark?: boolean;
	}[],
};

export const quote: { label: string; key: Testimonial["key"]; logo: LogoKey } =
	{
		label: "Kundenstimme",
		key: "werne",
		logo: "werne",
	};

export const faq: { title: string; items: FaqItem[] } = {
	title: "Häufige Fragen zum Portfolio-Checker",
	items: [
		{
			question: "Welche Unterlagen kann ich hochladen?",
			answer:
				"Messdienstverträge, Nachträge, Preisblätter, Gerätemiet- und Wartungsverträge, Heizkostenabrechnungen und WEG-Unterlagen. Als PDF, Scan oder Foto.",
		},
		{
			question: "Was wird geprüft?",
			answer:
				"Dokumenttyp, Vollständigkeit und Lesbarkeit. Unklare Stellen, zum Beispiel eine unscharfe Seite, markiert Heidi, statt Werte zu raten.",
		},
		{
			question: "Welche Daten werden extrahiert?",
			answer:
				"Messdienstanbieter und Vertragsnummer, Liegenschaft, Laufzeit und Verlängerung, Kündigungsfrist und das Datum, bis wann gekündigt sein muss, Geräte, Kosten und Eichfristen.",
		},
		{
			question: "Was passiert, wenn es Nachträge gibt?",
			answer:
				"Heidi führt Vertrag, Nachträge und Preisblätter je Liegenschaft zusammen. Was später vereinbart wurde, gilt, und das sehen Sie in der Auswertung.",
		},
		{
			question: "Was kostet der Portfolio-Check?",
			answer: "Nichts. Der Portfolio-Check ist kostenlos und unverbindlich.",
		},
		{
			question: "Was passiert nach der Auswertung?",
			answer:
				"Sie entscheiden je Liegenschaft: Heidi kündigt mit Ihrer Vollmacht oder übernimmt bestehende Verträge und wertet Ihre vorhandenen Zähler aus, egal wie lange der Vertrag noch läuft.",
		},
	],
};

export const closing = {
	h2: "Ihre Verträge. Endlich übersichtlich.",
	/** The design's link "Portfolio prüfen lassen →", now the form's button. */
	submitLabel: "Portfolio prüfen lassen",
};
