/**
 * Every text and the example data of /schnittstellen, word for word from the
 * design (plan 01 §1.2). Components hold markup only. The product claims,
 * the calculator's defaults and the example data need sign-off before the
 * cutover (plan §4.4).
 */
import { DEMO_HREF } from "$lib/landing/cta";
import { DEFAULT_LOGO_ORDER } from "$lib/landing/data/logos";
import type { Testimonial } from "$lib/landing/data/testimonials";
import type { FaqItem } from "$lib/landing/faqJsonLd";
import type { SplitHeading } from "$lib/landing/types";
import { ROUTE_DASHBOARD, ROUTE_SELBSTABRECHNUNG } from "$lib/routes";
import type { Inputs } from "./doppelpflege";
import type { IconName } from "./icons";

const NB = " ";

/** Anchor of the calculator section ("Doppelpflege berechnen ↓"). */
export const CALC_ID = "doppelpflege";

export const hero = {
	pill: "Schnittstellen zu ERP und CRM",
	h1: "Eine Plattform pflegen.",
	h1Accent: "Nicht zwei.",
	lead: "Heidi ist in Ihr bestehendes ERP- oder CRM-System integriert. Verbrauchsdaten und fertige Abrechnungen landen direkt in Ihrer Software. Sie arbeiten weiter dort, wo Sie heute schon arbeiten.",
	demo: { text: "Demo buchen", href: DEMO_HREF },
	calc: { text: "Doppelpflege berechnen", href: `#${CALC_ID}` },
	ticks: ["Kein Abtippen", "Keine Dateien hin und her", "Kein Softwarewechsel"],
};

export type Mode = "two" | "one";

export const stage = {
	label: "Vergleich: zwei Plattformen oder eine",
	modesLabel: "Ansicht",
	modes: [
		{ value: "two", label: "Zwei Plattformen" },
		{ value: "one", label: "Mit Heidi" },
	] as { value: Mode; label: string }[],
	tag: "Beispieldaten",
	portal: {
		title: "Messdienst-Portal",
		sub: "Eigener Login",
		files: ["Verbrauchswerte.csv", "Abrechnung_2025.pdf", "Nutzerliste.xlsx"],
		synced: { title: "Heidi", sub: "synchronisiert" },
	},
	erp: {
		title: "Ihr ERP / CRM",
		sub: `Lindenallee 12 · 6${NB}Wohnungen`,
		items: [
			{
				icon: "bars",
				title: "Verbrauchswerte 2025",
				sub: `18${NB}Werte · WE 01–06`,
			},
			{
				icon: "doc",
				title: "Heizkostenabrechnung 2025",
				sub: `6${NB}Einzelabrechnungen`,
			},
			{
				icon: "bell",
				title: "Verbrauchsinfo September",
				sub: "An alle Mieter versendet",
			},
		] as { icon: IconName; title: string; sub: string }[],
	},
	status: {
		man: "Manuell nachtragen",
		pending: "…",
		ok: "Synchronisiert",
	},
	steps: {
		two: {
			n: 4,
			text: "Handgriffe je Liegenschaft: einloggen, exportieren, weiterleiten, abtippen",
		},
		one: {
			n: 0,
			text: "Handgriffe: Die Daten liegen direkt in Ihrer Software",
		},
	} satisfies Record<Mode, { n: number; text: string }>,
};

export const logos = {
	text: "Hausverwaltungen in ganz Deutschland arbeiten bereits mit Heidi.",
	order: DEFAULT_LOGO_ORDER,
};

type Step = { title: string; sub: string };

export const beforeAfter = {
	pill: "Vorher und nachher",
	h2: {
		text: "Derselbe Vorgang. ",
		muted: "Einmal doppelt, einmal einfach.",
	} satisfies SplitHeading,
	two: {
		title: "Zwei Plattformen",
		sub: "Messdienst-Portal und Ihre Software",
		steps: [
			{
				title: "Im Portal des Messdienstes einloggen",
				sub: "Separater Zugang, eigene Oberfläche",
			},
			{
				title: "Werte und Abrechnung herunterladen",
				sub: "CSV, PDF oder Excel, je nach Anbieter",
			},
			{
				title: "Dateien per E-Mail weiterreichen",
				sub: "An Kolleginnen, Buchhaltung, Eigentümer",
			},
			{
				title: "Werte in die eigene Software übertragen",
				sub: "Von Hand, Zeile für Zeile",
			},
			{
				title: "Beide Systeme aktuell halten",
				sub: "Jede Änderung zweimal pflegen",
			},
		] satisfies Step[],
	},
	one: {
		title: "Eine Plattform",
		sub: "Ihre Software, mit Heidi angebunden",
		steps: [
			{
				title: "Verbrauchsdaten kommen von selbst",
				sub: "Per Funk abgelesen, direkt in Ihrer Software",
			},
			{
				title: "Fertige Abrechnungen ebenso",
				sub: "Dort, wo Sie Ihre Mieter ohnehin verwalten",
			},
			{
				title: "Sie arbeiten in Ihrem gewohnten System",
				sub: "Kein zweiter Login im Alltag",
			},
		] satisfies Step[],
		note: "Das Heidi Dashboard bleibt trotzdem für Sie da, wenn Sie Verbräuche auswerten möchten.",
		link: { text: "Dashboard ansehen", href: ROUTE_DASHBOARD },
	},
};

export type CalcField = {
	id: keyof Inputs;
	label: string;
	min: number;
	max: number;
	step: number;
	default: number;
	unit?: string;
	help?: string;
};

export const calculator = {
	pill: "Doppelpflege-Rechner",
	h2: {
		text: "Was kostet Sie die zweite Plattform? ",
		muted: "Rechnen Sie mit Ihren Zahlen.",
	} satisfies SplitHeading,
	lead: "Alle Werte sind Ihre eigenen Annahmen. Stellen Sie ein, wie oft Daten heute von einem System ins andere wandern und wie lange das dauert.",
	fields: [
		{
			id: "l",
			label: "Liegenschaften",
			min: 1,
			max: 300,
			step: 1,
			default: 40,
		},
		{
			id: "u",
			label: "Übertragungen je Liegenschaft und Jahr",
			min: 1,
			max: 24,
			step: 1,
			default: 4,
			help: "Zum Beispiel Abrechnung, Zwischenablesung, Nachfragen von Eigentümern",
		},
		{
			id: "m",
			label: "Minuten je Übertragung",
			min: 5,
			max: 90,
			step: 5,
			default: 20,
			unit: "Min.",
			help: "Einloggen, herunterladen, weiterleiten, eintragen, prüfen",
		},
		{
			id: "s",
			label: "Interner Stundensatz",
			min: 20,
			max: 120,
			step: 5,
			default: 45,
			unit: "€",
		},
	] satisfies CalcField[],
	result: {
		label: "Zeit für Doppelpflege pro Jahr",
		unit: "Std.",
		days: "Arbeitstage à 8 Stunden",
		costLabel: "Entspricht internen Kosten von",
		note: "Eigene Annahmen, kein Angebot. Wie viel davon mit Heidi entfällt, hängt von Ihrer Software ab. Das klären wir in der Demo.",
	},
	cells: 60,
};

export const dataPath = {
	pill: "Datenweg",
	h2: {
		text: "Vom Zähler in Ihre Software. ",
		muted: "Ohne Umweg.",
	} satisfies SplitHeading,
	label: "Der Weg der Daten",
	nodes: [
		{ icon: "meter", title: "Funkzähler", sub: "In jeder Wohnung" },
		{ icon: "signal", title: "Fernablesung", sub: "Ohne Termin vor Ort" },
		{
			icon: "heidi",
			title: "Heidi",
			sub: "Prüft und bereitet auf",
			kind: "hub",
		},
		{
			icon: "erp",
			title: "Ihr ERP / CRM",
			sub: "Hier arbeiten Sie",
			kind: "end",
		},
	] as { icon: IconName; title: string; sub: string; kind?: "hub" | "end" }[],
	cards: [
		{
			icon: "bars",
			title: "Verbrauchsdaten",
			text: "Heizung, Warm- und Kaltwasser je Wohnung, so wie die Funkzähler sie liefern.",
		},
		{
			icon: "doc",
			title: "Heizkostenabrechnungen",
			text: "Fertig erstellt, direkt bei der Liegenschaft in Ihrer Software.",
		},
		{
			icon: "calc",
			title: "Grundlage für die Selbstabrechnung",
			text: "Sie rechnen selbst ab? Dann liegen die Werte genau dort, wo Sie abrechnen.",
			link: {
				text: "Mehr zur Selbstabrechnung",
				href: ROUTE_SELBSTABRECHNUNG,
			},
		},
	] as {
		icon: IconName;
		title: string;
		text: string;
		link?: { text: string; href: string };
	}[],
};

export const benefits = {
	pill: "Warum eine Plattform",
	h2: {
		text: "Weniger Systeme. ",
		muted: "Weniger Fehlerquellen.",
	} satisfies SplitHeading,
	items: [
		{
			title: "Eine Wahrheit",
			text: "Ihre Daten liegen an einem Ort. Niemand fragt sich, welche Version die aktuelle ist.",
		},
		{
			title: "Kein Abtippen",
			text: "Was nicht von Hand übertragen wird, kann auch nicht falsch übertragen werden.",
		},
		{
			title: "Keine Dateien im Postfach",
			text: "Kein Hin- und Herschicken von Exporten zwischen Messdienst, Verwaltung und Buchhaltung.",
		},
		{
			title: "Kein Umlernen",
			text: "Ihr Team arbeitet weiter in der Software, die es kennt. Heidi kommt dazu, nicht obendrauf.",
		},
	],
};

export const steps = {
	pill: "So starten Sie",
	h2: {
		text: "Drei Schritte ",
		muted: "bis zur einen Plattform.",
	} satisfies SplitHeading,
	items: [
		{
			title: "Demo buchen",
			text: "Sie nennen uns die Software, mit der Sie heute arbeiten. Wir zeigen Ihnen, wie Heidi dort ankommt.",
		},
		{
			title: "Anbindung einrichten",
			text: "Heidi verbindet sich mit Ihrem ERP- oder CRM-System. Sie müssen dafür nichts neu aufsetzen.",
		},
		{
			title: "Daten fließen",
			text: "Ab der ersten Ablesung landen Verbrauchswerte und Abrechnungen direkt in Ihrer Software.",
		},
	],
};

export const quotes = {
	title: "Was Verwaltungen über Heidi sagen",
	keys: ["vitolus", "werne"] as Testimonial["key"][],
};

export const faq = {
	title: "Häufige Fragen zu den Schnittstellen",
	items: [
		{
			question: "Muss ich meine Software wechseln?",
			answer:
				"Nein. Heidi ist in bestehende ERP- und CRM-Systeme integriert. Sie arbeiten weiter in Ihrer gewohnten Software.",
		},
		{
			question: "Welche Daten kommen in meinem System an?",
			answer:
				"Die Verbrauchsdaten Ihrer Liegenschaften und die fertigen Heizkostenabrechnungen. Kein Abtippen, kein Hin- und Herschicken von Dateien.",
		},
		{
			question: "Wird meine Software unterstützt?",
			answer:
				"Nennen Sie uns Ihr System in der Demo. Wir zeigen Ihnen dann konkret, wie die Anbindung bei Ihnen aussieht.",
		},
		{
			question: "Brauche ich das Heidi Dashboard dann noch?",
			answer:
				"Für die tägliche Arbeit nicht. Das Dashboard steht Ihnen aber weiter zur Verfügung, etwa um Verbräuche über alle Liegenschaften auszuwerten.",
		},
		{
			question: "Funktioniert das auch, wenn ich selbst abrechne?",
			answer:
				"Ja. Bei der Selbstabrechnung liefert Heidi die Verbrauchswerte direkt in die Software, in der Sie Ihre Abrechnung erstellen.",
		},
	] satisfies FaqItem[],
};

export const closing = {
	h2: "Ihre Software bleibt. Die Doppelpflege geht.",
	text: "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.",
	/** The video button (the design's .dcta-b) → the booking page. */
	button: {
		text: "Live Demo buchen",
		sub: "Mit Ihrem Ansprechpartner",
		href: DEMO_HREF,
	},
};
