/**
 * Every text and the example data of /kunden/private-vermieter, word for word from
 * the design (plan 01 §1.2). Components hold markup only. The product
 * claims, the comparison, the legal statements and the example data need
 * sign-off before the cutover (plan §4.4).
 */
import { DEMO_HREF } from "$lib/landing/cta";
import type { Testimonial } from "$lib/landing/data/testimonials";
import type { FaqItem } from "$lib/landing/faqJsonLd";
import { ROUTE_VERBRAUCHSINFORMATION } from "$lib/routes";
import type { IconName } from "./icons";

const NB = " ";

/** Anchors on the page. */
export const FLOW_ID = "so";
export const FAQ_ID = "faq";

export type Link = { text: string; href: string };

export const hero = {
	eyebrow: "Für private Vermieter",
	h1: ["Ihre Wohnungen.", "Unser Messdienst."],
	h1Accent: "Ihre Ruhe.",
	lead: "Heidi übernimmt Zähler, Ablesung und Heizkostenabrechnung für Ihr Mehrfamilienhaus. Schon ab zwei Wohneinheiten, mit festem Ansprechpartner und ohne Ablesetermine.",
	primary: { text: "Angebot anfragen", href: DEMO_HREF },
	secondary: { text: "So funktioniert’s", href: `#${FLOW_ID}` },
};

export type InfoEntry = {
	kind: string;
	title: string;
	text: string;
	points: string[];
};

/** The scroll scene: the flat, the cabinet with the meters, its three points. */
export const scene = {
	label: "Funkzähler in Ihrer Wohnung",
	room: "Helle Altbauwohnung mit offener Küche",
	meter: "Geöffneter Küchenschrank mit Funkzählern",
	captions: [
		{
			title: "Ihr Mehrfamilienhaus.",
			text: "Ab zwei Wohneinheiten gilt die Heizkostenverordnung.",
		},
		{
			title: "Ein Blick hinter die Küchenfront.",
			text: "Funkzähler sitzen unauffällig an den Leitungen.",
		},
		{
			title: "Abgelesen per Funk.",
			text: "Kein Termin, kein Zettel im Treppenhaus. Werte jeden Monat.",
		},
	],
	/** The signal points' accessible names, in the info entries' order. */
	points: [
		"Wasserzähler: mehr erfahren",
		"Funk-Gateway: mehr erfahren",
		"Wärmezähler: mehr erfahren",
	],
	tags: ["Wasserzähler · per Funk", "Funk-Gateway", "Wärmezähler · per Funk"],
	hint: "Punkte antippen für Details",
	close: "Schließen",
	info: [
		{
			kind: "Wasserzähler",
			title: "Funk-Wasserzähler",
			text: "Misst den Kalt- oder Warmwasserverbrauch der Wohnung und sendet den Zählerstand per Funk.",
			points: [
				"Keine Ablesung vor Ort",
				"Werte jeden Monat",
				"Grundlage für Wasser- und Warmwasserkosten",
			],
		},
		{
			kind: "Gateway",
			title: "Funk-Gateway",
			text: "Empfängt die Funksignale der Zähler im Haus und überträgt die Werte an Heidi.",
			points: [
				"Sammelt alle Zähler eines Hauses",
				"Werte landen direkt im Heidi-Dashboard",
				"Kein Zugang zur Wohnung nötig",
			],
		},
		{
			kind: "Wärmezähler",
			title: "Funk-Wärmezähler",
			text: "Erfasst die verbrauchte Heizenergie in kWh und überträgt sie per Funk.",
			points: [
				"Grundlage für die Heizkostenabrechnung nach HKVO",
				"Monatliche Verbrauchsinfo für Ihre Mieter",
				"Fernablesbar, wie ab 2027 vorgeschrieben",
			],
		},
	] satisfies InfoEntry[],
};

/** Three figures, each with a crop of a photo (`room` or `meter`). */
export const stats = {
	label: "Auf einen Blick",
	items: [
		{ value: "ab 2", text: "Wohneinheiten", crop: 1 },
		{ value: "1", text: "fester Ansprechpartner für Ihre Wohnungen", crop: 2 },
		{ value: "0", text: "Ablesetermine in der Wohnung", crop: 3 },
	],
};

export type PanelRow = {
	text: string;
	/** Right-aligned value or note. */
	note: string;
	/** A status dot (done or running) or an icon. */
	dot?: "ok" | "run";
	icon?: IconName;
	/** The note as a figure (bold, tabular). */
	value?: boolean;
};

export type Panel = {
	title: string;
	sub: string;
	/** The "Beispiel" badge. */
	badge?: string;
	rows: PanelRow[];
	/** The progress bar, 0–100. */
	meter?: number;
	/** The monthly bars, 0–100; the last one is the current month. */
	bars?: number[];
	/** The button pressed in the mock-up. */
	button?: string;
	/** The green confirmation line. */
	ok?: string;
	/** A question and its answer. */
	messages?: [string, string];
};

/** "So funktioniert’s": five steps, each with a mock-up. */
export const flow = {
	id: FLOW_ID,
	eyebrow: "So funktioniert’s",
	h2: "Vom Zähler bis zur Abrechnung. Alles bei Heidi.",
	steps: [
		{
			label: "Montage",
			text: `Heidi kündigt die Montage 14${NB}Tage vorher bei Ihren Mietern an. Am Termin gibt es ein Zeitfenster von 1 bis 2${NB}Stunden, 92${NB}% der Montagen klappen beim ersten Termin.`,
		},
		{
			label: "Ablesung per Funk",
			text: "Die Funkzähler übertragen ihre Werte aus der Ferne. Niemand muss zur Ablesung in die Wohnung, auch nicht beim Mieterwechsel.",
		},
		{
			label: "Monatliche Verbrauchsinfo",
			text: `Ihre Mieter erhalten jeden Monat ihre Verbrauchsinformation nach §${NB}6a HeizkostenV. So vermeiden Sie das Kürzungsrecht von 3${NB}%.`,
		},
		{
			label: "Heizkostenabrechnung",
			text: "Alle Verbräuche liegen vor, die Heizkostenabrechnung nach HKVO entsteht per Klick. Für jede Wohnung einzeln und nachvollziehbar.",
		},
		{
			label: "Fragen Ihrer Mieter",
			text: "Fragen Ihrer Mieter zur Abrechnung? Ihr fester Ansprechpartner bei Heidi kennt Ihr Haus und hilft weiter.",
		},
	],
	panels: [
		{
			title: "Montage",
			sub: `Musterstraße 5 · 6${NB}Wohnungen`,
			badge: "Beispiel",
			rows: [
				{ dot: "ok", text: "Mieter informiert", note: `vor 14${NB}Tagen` },
				{ dot: "ok", text: "Termin bestätigt", note: "Di, 9:00–11:00" },
				{ dot: "run", text: "Funkzähler werden montiert", note: "4 von 6" },
			],
			meter: 66,
		},
		{
			title: "Zählerstände",
			sub: "per Funk empfangen",
			rows: [
				{
					icon: "drop",
					text: "Kaltwasser · WE 01",
					note: `48,2${NB}m³`,
					value: true,
				},
				{
					icon: "flame",
					text: "Heizung · WE 01",
					note: `1.284${NB}kWh`,
					value: true,
				},
				{
					icon: "drop",
					text: "Warmwasser · WE 02",
					note: `21,7${NB}m³`,
					value: true,
				},
			],
			ok: "Alle Werte heute übertragen",
		},
		{
			title: "Verbrauchsinfo September",
			sub: "an alle Mieter versendet",
			bars: [62, 48, 30, 22, 26, 40],
			rows: [
				{ dot: "ok", text: "6 von 6 Mietern informiert", note: "monatlich" },
			],
		},
		{
			title: "Heizkostenabrechnung 2026",
			sub: "nach Heizkostenverordnung",
			rows: [
				{
					dot: "ok",
					text: "Verbräuche vollständig",
					note: `6${NB}Einheiten`,
				},
				{ dot: "ok", text: "Kosten verteilt", note: "nach HKVO" },
			],
			button: "Abrechnung erstellen",
			ok: "6 Abrechnungen fertig",
		},
		{
			title: "Ihr Ansprechpartner",
			sub: "Heidi Systems · erreichbar",
			rows: [],
			messages: [
				"Ein Mieter fragt nach seiner Abrechnung. Was nun?",
				"Leiten Sie ihn gern an uns weiter, wir erklären ihm jede Position.",
			],
		},
	] satisfies Panel[],
};

export const duo = {
	eyebrow: "Für Eigentümer",
	h2: "Vermieten, statt Zählerständen hinterherlaufen.",
	text: [
		"Als privater Vermieter haben Sie keine Verwaltungsabteilung. Heidi übernimmt deshalb den ganzen Messdienst: Funkzähler einbauen, monatlich ablesen, Mieter informieren und die Heizkostenabrechnung erstellen.",
		"Sie bekommen fertige Abrechnungen und haben einen festen Ansprechpartner, der Ihr Haus kennt.",
	],
};

export const benefits = {
	eyebrow: "Ihre Vorteile",
	h2: ["Alles aus einer Hand.", "Ein Ansprechpartner. Volle Kontrolle."],
	items: [
		{
			icon: "house",
			title: `Schon ab 2${NB}Wohneinheiten`,
			text: "Auch für kleine Mehrfamilienhäuser. Jedes Objekt wird einzeln abgerechnet.",
		},
		{
			icon: "wrench",
			title: "Alles aus einer Hand",
			text: "Zähler, Montage, Ablesung und Abrechnung von einem Anbieter. Sie zahlen pro installiertem Zähler plus Abrechnungspauschale.",
		},
		{
			icon: "signal",
			title: "Ablesung per Funk",
			text: "Kein Termin in der Wohnung, keine fehlenden Werte bei Mieterwechsel.",
		},
		{
			icon: "bell",
			title: "uVI automatisch",
			text: `Ihre Mieter erhalten die monatliche Verbrauchsinformation nach §${NB}6a HeizkostenV.`,
		},
		{
			icon: "doc",
			title: "Abrechnung nach HKVO",
			text: "Fertige Heizkostenabrechnung für jede Wohnung, pünktlich und nachvollziehbar.",
		},
		{
			icon: "swap",
			title: "Wechsel jederzeit",
			text: "Heidi übernimmt bestehende Zähler, auch wenn Ihr bisheriger Vertrag noch läuft.",
		},
	] satisfies { icon: IconName; title: string; text: string }[],
};

export type Mark = "yes" | "no" | "depends";

export const compare = {
	eyebrow: "Im Vergleich",
	h2: "Selbst machen, klassischer Messdienst oder Heidi?",
	label: "Vergleich",
	columns: ["Selbst machen", "Klassischer Messdienst", "Heidi"],
	marks: { yes: "Ja", no: "Nein", depends: "Je nach Anbieter" },
	rows: [
		{ label: "Fernablesbare Funkzähler", values: ["no", "yes", "yes"] },
		{ label: "Alles aus einer Hand", values: ["no", "depends", "yes"] },
		{
			label: "Ablesung ohne Termin in der Wohnung",
			values: ["no", "depends", "yes"],
		},
		{
			label: "Monatliche Verbrauchsinfo automatisch",
			values: ["no", "depends", "yes"],
		},
		{
			label: "Heizkostenabrechnung nach HKVO",
			values: ["depends", "yes", "yes"],
		},
		{
			label: "Fester persönlicher Ansprechpartner",
			values: ["no", "depends", "yes"],
		},
		{ label: "Wechsel bei laufendem Vertrag", values: ["no", "no", "yes"] },
		{
			label: "Abrechnung pro installiertem Zähler",
			values: ["no", "depends", "yes"],
		},
	] satisfies { label: string; values: [Mark, Mark, Mark] }[],
	note: "Allgemeine Einordnung nach üblichem Leistungsumfang. Der konkrete Umfang hängt vom jeweiligen Anbieter und Vertrag ab.",
};

/** The marquee's quotes, each followed by a photo tile. */
export const quotes = {
	eyebrow: "Kunden",
	h2: "Erst Vertrauen. Dann Ruhe.",
	label: "Kundenstimmen",
	items: [
		{ key: "werne", company: "Werne Immobilien GmbH", tile: "room" },
		{ key: "vitolus", company: "Vitolus GmbH", tile: "meter" },
		{
			key: "gerhard",
			company: "Gerhard Real Estate Management",
			tile: "facade",
		},
	] satisfies {
		key: Testimonial["key"];
		company: string;
		tile: "room" | "meter" | "facade";
	}[],
};

export const faq = {
	id: FAQ_ID,
	eyebrow: "FAQ",
	h2: "Echte Fragen. Klare Antworten.",
	items: [
		{
			question:
				"Brauche ich als privater Vermieter überhaupt einen Messdienst?",
			answer: `Sobald ein Gebäude mindestens zwei Wohnungen mit zentraler Heizung oder Warmwasser hat, gilt die Heizkostenverordnung. Die Kosten müssen dann zu 50 bis 70${NB}% nach Verbrauch verteilt werden. Dafür braucht es Zähler, Ablesung und eine Abrechnung. Eine Ausnahme gilt für Zweifamilienhäuser, in denen Sie selbst eine der Wohnungen bewohnen: Dann können Sie mit Ihrem Mieter etwas anderes vereinbaren.`,
		},
		{
			question: "Was kostet Heidi?",
			answer:
				"Abgerechnet wird pro tatsächlich installiertem Zähler plus eine Abrechnungspauschale. Ein konkretes Angebot bekommen Sie nach einem kurzen Gespräch.",
		},
		{
			question: "Meine Zähler sind noch nicht fernablesbar. Was jetzt?",
			answer: `Bestehende Zähler und Heizkostenverteiler müssen bis zum 31.${NB}Dezember 2026 fernablesbar sein. Heidi baut fernablesbare Funkzähler ein, kündigt die Montage 14${NB}Tage vorher bei Ihren Mietern an und übernimmt danach Ablesung und Abrechnung.`,
		},
		{
			question:
				"Mein Vertrag mit dem bisherigen Messdienst läuft noch. Kann ich trotzdem wechseln?",
			answer:
				"Ja. Heidi übernimmt bestehende Zähler und wertet sie aus, unabhängig davon, wie lange der bisherige Vertrag noch läuft. Die Kündigung erledigen wir auf Wunsch per Vollmacht.",
		},
		{
			question: "Was passiert, wenn die Abrechnung zu spät kommt?",
			answer:
				"Die Betriebskostenabrechnung muss Ihren Mietern spätestens zwölf Monate nach Ende des Abrechnungszeitraums vorliegen. Danach können Sie keine Nachzahlung mehr verlangen. Mit Heidi liegen die Verbräuche jederzeit vor, die Heizkostenabrechnung ist schnell erstellt.",
		},
		{
			question: "Was ist die monatliche Verbrauchsinformation?",
			answer: `Mieter mit fernablesbaren Zählern müssen jeden Monat über ihren Verbrauch informiert werden. Fehlt diese Information, dürfen sie ihren Anteil an den Heizkosten um 3${NB}% kürzen. Heidi verschickt die uVI automatisch.`,
			more: { text: "Mehr zur uVI", href: ROUTE_VERBRAUCHSINFORMATION },
		},
	] satisfies (FaqItem & { more?: Link })[],
};

export const closing = {
	h2: ["Ein kurzes Gespräch.", "Alle Antworten."],
	text: "Wir schauen uns Ihr Haus an, klären Zähler, Vertrag und Abrechnung und machen Ihnen ein Angebot.",
	submitLabel: "Gespräch vereinbaren",
	faq: { text: "Häufige Fragen", href: `#${FAQ_ID}` },
};
