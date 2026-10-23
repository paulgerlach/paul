/**
 * Texts of /einsparrechner, word for word from the design
 * (https://claude.ai/artifact/S3p5jbNkohWnWeZpfR75j9), and the calculator's
 * sliders with the design's ranges and example values. The risk figure, the
 * result and the product claims await sign-off (plan §4.4).
 */
import { DEMO_HREF } from "$lib/landing/cta";
import type { FaqItem } from "$lib/landing/faqJsonLd";
import { ROUTE_FRISTENRECHNER } from "$lib/routes";

export const CALC_ID = "rechner";

export const hero = {
	pill: "Einsparrechner",
	h1: "Was der Wechsel",
	h1Accent: "Ihrem Bestand bringt.",
	lead: "Rechnen Sie mit Ihren eigenen Zahlen: wie viel Arbeitszeit Heidi Ihrem Team abnimmt und welches Kürzungsrisiko nach Heizkostenverordnung Sie vermeiden.",
};

export type FieldId = "we" | "lg" | "hk" | "ss" | "a1" | "a2" | "a3";
export type ToggleId = "fern" | "uvi";

export type Field = {
	id: FieldId;
	/** The group's number (1 or 2). */
	group: number;
	label: string;
	/** Shown after the value; empty for none. */
	unit: string;
	min: number;
	max: number;
	step: number;
	default: number;
};

export const calculator = {
	groups: [
		{ num: 1, title: "Ihr Bestand" },
		{
			num: 2,
			title: "Ihr Aufwand pro Liegenschaft und Jahr",
			sub: "Was Ihr Team heute selbst erledigt und Heidi übernimmt.",
		},
		{ num: 3, title: "Status nach Heizkostenverordnung" },
	] satisfies { num: number; title: string; sub?: string }[] as {
		num: number;
		title: string;
		sub?: string;
	}[],
	fields: [
		{
			id: "we",
			group: 1,
			label: "Wohneinheiten",
			unit: "WE",
			min: 2,
			max: 3000,
			step: 1,
			default: 240,
		},
		{
			id: "lg",
			group: 1,
			label: "Liegenschaften",
			unit: "",
			min: 1,
			max: 300,
			step: 1,
			default: 12,
		},
		{
			id: "hk",
			group: 1,
			label: "Heiz- und Warmwasserkosten pro Einheit",
			unit: "€ / Jahr",
			min: 300,
			max: 3000,
			step: 10,
			default: 1000,
		},
		{
			id: "ss",
			group: 1,
			label: "Stundensatz Ihres Teams",
			unit: "€ / h",
			min: 20,
			max: 120,
			step: 1,
			default: 45,
		},
		{
			id: "a1",
			group: 2,
			label: "Ablesetermine koordinieren und Mieter informieren",
			unit: "h",
			min: 0,
			max: 20,
			step: 0.5,
			default: 4,
		},
		{
			id: "a2",
			group: 2,
			label: "Rückfragen von Mietern zu Verbrauch und Abrechnung",
			unit: "h",
			min: 0,
			max: 20,
			step: 0.5,
			default: 3,
		},
		{
			id: "a3",
			group: 2,
			label: "Heizkostenabrechnung prüfen, nacharbeiten, übertragen",
			unit: "h",
			min: 0,
			max: 30,
			step: 0.5,
			default: 6,
		},
	] satisfies Field[] as Field[],
	toggles: [
		{
			id: "fern",
			title: "Zähler noch nicht fernablesbar",
			note: "Ab 2027: Kürzungsrecht 3 %",
		},
		{
			id: "uvi",
			title: "Keine monatliche Verbrauchsinfo",
			note: "Kürzungsrecht 3 %",
		},
	] satisfies { id: ToggleId; title: string; note: string }[] as {
		id: ToggleId;
		title: string;
		note: string;
	}[],
	result: {
		label: "Ihr Vorteil pro Jahr",
		time: "Arbeitszeit, die Heidi übernimmt",
		risk: "Vermiedenes Kürzungsrisiko",
		hours: "Stunden pro Jahr",
		noRisk: "Kein Risiko ausgewählt",
		/** "2 × 3 % Kürzungsrecht auf 240.000 € Heizkosten" */
		riskLine: { cut: "× 3 % Kürzungsrecht auf", base: "€ Heizkosten" },
		days: "Arbeitstage pro Jahr",
		perUnit: "pro Einheit und Jahr",
		// 44SBXKXJaSp6bvGMnbpZj6 ("Demo buchen"): /demo.
		cta: { text: "Angebot für Ihren Bestand", href: DEMO_HREF },
		note: "Ergebnis auf Basis Ihrer Angaben, ohne Heidi-Kosten. Ihr individuelles Angebot erhalten Sie in der Demo.",
		/** The screen reader's status line (not in the design, plan README). */
		status: {
			of: "davon",
			time: "Arbeitszeit und",
			risk: "vermiedenes Kürzungsrisiko",
		},
	},
};

export type MethodIcon = "clock" | "warning" | "check";

export const method = {
	pill: "Transparent gerechnet",
	h2: "So entsteht das Ergebnis.",
	cards: [
		{
			icon: "clock",
			title: "Arbeitszeit",
			text: "Ihre Stunden pro Liegenschaft für Ablesetermine, Mieterfragen und Abrechnung, mal Anzahl der Liegenschaften, mal Ihrem Stundensatz.",
			formula: "Stunden × Liegenschaften × Stundensatz",
		},
		{
			icon: "warning",
			title: "Kürzungsrisiko",
			text: "Fehlt die Fernablesbarkeit oder die monatliche Verbrauchsinformation, dürfen Mieter um jeweils 3 % kürzen (§ 12 HeizkostenV).",
			formula: "Heizkosten × Einheiten × 3 %",
		},
		{
			icon: "check",
			title: "Was Heidi übernimmt",
			text: "Funkablesung ohne Termin, monatliche Verbrauchsinfo, Heizkostenabrechnung per Klick und ein fester Ansprechpartner für Ihre Mieter.",
			formula: "Ihr Team: nur noch prüfen",
		},
	] satisfies {
		icon: MethodIcon;
		title: string;
		text: string;
		formula: string;
	}[] as { icon: MethodIcon; title: string; text: string; formula: string }[],
};

export const faq: { title: string; items: FaqItem[] } = {
	title: "Häufige Fragen",
	items: [
		{
			question: "Sind die Werte im Rechner echte Einsparungen?",
			answer:
				"Der Rechner zeigt, wie viel Arbeitszeit Heidi Ihrem Team abnimmt und welches Kürzungsrisiko Sie vermeiden, auf Basis Ihrer eigenen Angaben. Die voreingestellten Zahlen sind Beispielwerte. Heidi-Kosten sind nicht abgezogen, Ihr Angebot erhalten Sie in der Demo.",
		},
		{
			question: "Wie wird Heidi abgerechnet?",
			answer:
				"Pro tatsächlich installiertem Zähler plus Abrechnungspauschale. Für Bestände mit mehr als 1.000 Einheiten erstellen wir ein individuelles Angebot.",
		},
		{
			question: "Woher kommt das Kürzungsrisiko von 3 %?",
			answer:
				"Aus § 12 HeizkostenV. Mieter dürfen ihren Anteil an den Heiz- und Warmwasserkosten um 3 % kürzen, wenn Geräte trotz Pflicht nicht fernablesbar sind oder die monatliche Verbrauchsinformation fehlt.",
		},
		{
			question: "Was passiert mit meinem bestehenden Vertrag?",
			answer:
				"Heidi übernimmt Ihre bestehenden Zähler sofort, auch wenn der Vertrag noch läuft.",
			// LWEbZPCoSDLT1D59BaULyE ("Fristenrechner")
			more: { text: "Kündigungsfrist berechnen →", href: ROUTE_FRISTENRECHNER },
		},
	],
};

export const closing = {
	h2: "Ihre Zahlen. Ihr Angebot.",
	text: "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.",
	/** The video button (the design's .dcta-b) → the booking page. */
	button: {
		text: "Live Demo buchen",
		sub: "Mit Ihrem Ansprechpartner",
		href: DEMO_HREF,
	},
};
