/**
 * Every text of /preise, word for word from the design
 * (https://claude.ai/artifact/WHpiUFyHmiPCopWMGtwwJD). Components hold markup
 * and behaviour only.
 *
 * The pricing model, the statements on § 2 BetrKV, the example and the FAQ
 * need sign-off before the cutover (go-live gate §2).
 */
import { DEMO_HREF } from "$lib/landing/cta";
import type { FaqItem } from "$lib/landing/faqJsonLd";
import {
	ROUTE_KONTAKT,
	ROUTE_SELBSTABRECHNUNG,
	ROUTE_SELF_SERVICE,
} from "$lib/routes";

/** The request section (the design's id); "Preise anfragen" leads here. */
export const REQUEST_ID = "anfrage";
/** The two contracts (the design's id); "So rechnen wir ab" leads here. */
export const CONTRACTS_ID = "preise";

export const SALES_MAIL = "vertrieb@heidisystems.com";

export const hero = {
	pill: "Preise",
	h1: "Sie zahlen pro verbautem Gerät.",
	h1Accent: "Und reichen es an die Mieter weiter.",
	lead: "Heidi rechnet nach den tatsächlich installierten Geräten ab und pro Wohnung für die Heizkostenabrechnung. Gerätemiete, Wartung und Abrechnung sind laufende Betriebskosten und lassen sich auf die Mieter umlegen.",
	request: { text: "Preise anfragen", href: `#${REQUEST_ID}` },
	contracts: { text: "So rechnen wir ab", href: `#${CONTRACTS_ID}` },
	ticks: [
		"Nur verbaute Geräte zählen",
		"Verbrauchsinformation inklusive",
		"Mieterzugang ohne Aufpreis",
	],
};

/**
 * The hero's example bill. A line is its text with the count in bold:
 * `before`, `count`, `after`.
 */
export type BillLine = {
	before?: string;
	count: string;
	after?: string;
	unit: string;
};

export const bill = {
	label: "Beispiel: So setzt sich die Rechnung zusammen",
	eyebrow: "Beispiel",
	title: "Mehrfamilienhaus, 12 Wohnungen",
	tag: "Laufend pro Jahr",
	lines: [
		{ count: "48", after: " Heizkostenverteiler", unit: "pro Gerät" },
		{ count: "12", after: " Kaltwasserzähler", unit: "pro Gerät" },
		{ count: "12", after: " Warmwasserzähler", unit: "pro Gerät" },
		{ count: "2", after: " Funk-Gateways", unit: "pro Gerät" },
		{ before: "Wartung ", count: "72", after: " Geräte", unit: "pro Gerät" },
		{
			before: "Heizkostenabrechnung ",
			count: "12",
			after: " Wohnungen",
			unit: "pro Wohnung",
		},
	] satisfies BillLine[],
	sumLabel: "Umlegbar auf die Mieter",
	sum: "Laufende Kosten",
	flow: ["Heidi", "Betriebs­kosten", "Mieter"],
};

export type Device =
	| "heizkostenverteiler"
	| "kaltwasserzaehler"
	| "warmwasserzaehler"
	| "waermemengenzaehler"
	| "gateway";

export const contracts = {
	pill: "So rechnen wir ab",
	h2: "Zwei Positionen. Beide nachvollziehbar.",
	h2Accent:
		"Gerätemiete und Abrechnung schließen Sie als getrennte Verträge ab.",
	rental: {
		eyebrow: "Vertrag 1",
		title: "Gerätemiete und Wartung",
		text: "Pro tatsächlich verbautem Gerät und Jahr. Nicht verbaute Geräte zahlen Sie nicht.",
		devices: [
			{ key: "heizkostenverteiler", name: "Heizkostenverteiler" },
			{ key: "kaltwasserzaehler", name: "Kaltwasserzähler" },
			{ key: "warmwasserzaehler", name: "Warmwasserzähler" },
			{ key: "waermemengenzaehler", name: "Wärmemengenzähler" },
			{ key: "gateway", name: "Funk-Gateway" },
		] satisfies { key: Device; name: string }[],
		note: "Abgerechnet wird jährlich pro Gerät, inklusive Wartung. Die Zahl der Funk-Gateways richtet sich nach der Größe des Gebäudes.",
	},
	billing: {
		eyebrow: "Vertrag 2",
		title: "Heizkostenabrechnung",
		text: "Pro Wohnung und Jahr, egal wie viele Geräte verbaut sind.",
		big: "Pro Wohnung",
		bigSub: "und Jahr, unabhängig von der Zahl der Geräte",
		included: [
			"Abrechnung nach Heizkostenverordnung, auf Knopfdruck",
			"Unterjährige Verbrauchsinformation nach EED inklusive",
			"Rechnungen erfasst DocuScan automatisch",
			"Eigener Mieterzugang ohne Aufpreis",
		],
		note: {
			before: "Sie erstellen die Abrechnung lieber selbst? Mit der ",
			link: { text: "Selbstabrechnung", href: ROUTE_SELBSTABRECHNUNG },
			after: " liefert Heidi nur die Verbrauchsdaten.",
		},
	},
};

export const allocation = {
	pill: "Umlage",
	h2: "Laufende Kosten tragen die Mieter.",
	h2Accent: "Über die Betriebskostenabrechnung.",
	paragraphs: [
		"Die Miete der Geräte zur Verbrauchserfassung, ihre Wartung und die Kosten für Berechnung und Aufteilung zählen zu den Betriebskosten nach § 2 Betriebskostenverordnung. Sie legen sie mit der jährlichen Betriebskostenabrechnung auf die Mieter um.",
		"Voraussetzung ist, dass Ihr Mietvertrag die Umlage dieser Betriebskosten vorsieht.",
	],
	/** `yes`: the green "umlegbar" badge. */
	rows: [
		{
			text: "Gerätemiete Zähler und Heizkostenverteiler",
			badge: "umlegbar",
			yes: true,
		},
		{ text: "Miete Funk-Gateway", badge: "umlegbar", yes: true },
		{ text: "Wartung und Eichung", badge: "umlegbar", yes: true },
		{
			text: "Heizkostenabrechnung und Verbrauchsinformation",
			badge: "umlegbar",
			yes: true,
		},
		{ text: "Inbetriebnahme und Montage", badge: "einmalig, separat" },
		{ text: "Gekaufte Geräte", badge: "nicht umlegbar" },
	] satisfies { text: string; badge: string; yes?: boolean }[],
};

export type RequestAction = {
	icon: "calc" | "mail" | "calendar";
	title: string;
	text: string;
	href: string;
};

export const request = {
	pill: "Preise anfragen",
	h2: "Ihre Preise für Ihren Bestand.",
	h2Accent: "Persönlich und unverbindlich.",
	text: "Die Kosten hängen von der Zahl der Wohnungen und Geräte ab. Nennen Sie uns Ihren Bestand, wir schicken Ihnen ein Angebot mit allen Positionen.",
	steps: [
		{
			title: "Bestand angeben",
			text: "Wohnungen und vorhandene Zähler, gern mit Geräteliste.",
		},
		{
			title: "Angebot erhalten",
			text: "Alle Positionen getrennt nach Gerätemiete und Abrechnung.",
		},
		{
			title: "Mit den Mietern abrechnen",
			text: "Die laufenden Kosten legen Sie über die Betriebskosten um.",
		},
	],
	actions: [
		{
			icon: "calc",
			title: "Self-Service",
			text: "Bestand selbst erfassen, Angebot per E-Mail erhalten",
			href: ROUTE_SELF_SERVICE,
		},
		{
			icon: "mail",
			title: "Preise anfragen",
			text: "Nachricht an unser Vertriebsteam",
			href: ROUTE_KONTAKT,
		},
		{
			icon: "calendar",
			title: "Termin buchen",
			text: "Preise und Ablauf im Gespräch klären",
			href: DEMO_HREF,
		},
	] satisfies RequestAction[],
	mail: "Oder direkt per E-Mail: ",
};

export const extras = [
	{
		icon: "tool",
		title: "Inbetriebnahme",
		text: "Einmalig pro Gerät. Heidi nimmt jedes Gerät in Betrieb und verbindet es mit dem Dashboard.",
	},
	{
		icon: "home",
		title: "Montage",
		text: "Montiert Ihr Hausinstallateur, entfällt die Installationspauschale. Montiert Heidi, weisen wir die Pauschale im Angebot aus.",
	},
	{
		icon: "building",
		title: "Ab 1.000 Wohnungen",
		text: "Für große Bestände erstellen wir ein individuelles Angebot, inklusive Rollout-Planung im Cluster.",
	},
] satisfies {
	icon: "tool" | "home" | "building";
	title: string;
	text: string;
}[];

export const faq = {
	title: "Häufige Fragen zu den Preisen",
	items: [
		{
			question:
				"Kann ich die Kosten wirklich vollständig auf die Mieter umlegen?",
			answer:
				"Die laufenden Kosten für Gerätemiete, Wartung und Heizkostenabrechnung sind Betriebskosten nach § 2 Betriebskostenverordnung. Sieht Ihr Mietvertrag die Umlage der Betriebskosten vor, legen Sie diese Beträge vollständig über die Betriebskostenabrechnung um. Einmalige Kosten wie Montage und Inbetriebnahme gehören nicht dazu.",
		},
		{
			question: "Warum zwei getrennte Verträge?",
			answer:
				"Gerätemiete und Heizkostenabrechnung sind unterschiedliche Leistungen. Deshalb schließen Sie sie getrennt ab. So bleibt jede Position klar nachvollziehbar, auch in der Betriebskostenabrechnung.",
		},
		{
			question: "Zahle ich für Geräte, die nicht verbaut werden?",
			answer:
				"Nein. Abgerechnet wird pro tatsächlich installiertem Gerät. Stellt sich bei der Montage heraus, dass weniger Geräte nötig sind, zahlen Sie nur diese.",
		},
		{
			question: "Kann ich die Geräte auch kaufen?",
			answer:
				"Ja, auf Anfrage. Gekaufte Geräte können Sie allerdings nicht auf die Mieter umlegen. Deshalb empfehlen wir in den meisten Fällen die Miete.",
		},
		{
			question: "Was ist mit unseren vorhandenen Zählern?",
			answer:
				"Heidi liest funkfähige Zähler aller Hersteller aus. Dann zahlen Sie nur die Heizkostenabrechnung, keine neue Gerätemiete.",
			// The design's Interoperabilität page (FjqCR6cUXnsq1ucgpPdxX7)
			// doesn't exist yet; without `href` the link isn't shown.
			more: { text: "Mehr zur Interoperabilität" },
		},
		{
			question: "Warum stehen hier keine Preise?",
			answer: `Die Kosten hängen von Ihrem Bestand ab: Zahl der Wohnungen, Gerätearten und ob Zähler übernommen werden. Im <a href="${ROUTE_SELF_SERVICE}">Self-Service</a> oder über das <a href="${ROUTE_KONTAKT}">Kontaktformular</a> erhalten Sie ein Angebot mit allen Positionen.`,
		},
	] satisfies FaqItem[],
};

export const closing = {
	h2: "Ihre Preise für Ihren Bestand.",
	cta: { text: "Preise anfragen", href: `#${REQUEST_ID}` },
};
