/**
 * Texts of /energieausweis, word for word from the design
 * (https://claude.ai/artifact/Xk6APwMsadTT7axHzbuPA4): the page, the scale's
 * examples, the check's questions and results, the offers and the
 * comparison. The product, its prices and the GEG statements await sign-off
 * (plan §4.4).
 */
import type { FaqItem } from "$lib/landing/faqJsonLd";
import type { SplitHeading } from "$lib/landing/types";
import { ROUTE_DASHBOARD } from "$lib/routes";

/** The check's section, the target of "Welchen Ausweis brauche ich? ↓". */
export const CHECK_ID = "check";
/** The offers' section, the target of "Preise ansehen →". */
export const OFFERS_ID = "produkte";

/** The two kinds of certificate: Verbrauchsausweis, Bedarfsausweis. */
export type AusweisType = "v" | "b";

export const hero = {
	pill: "Energieausweis von Heidi",
	h1: "Der Energieausweis für Ihre Liegenschaft.",
	h1Accent: "Einfach online beantragen.",
	lead: "Verbrauchs- oder Bedarfsausweis, rechtsgültig nach Gebäudeenergiegesetz. Online selbst erfasst oder mit unserem Expertenteam per Video-Call oder vor Ort.",
	check: { text: "Welchen Ausweis brauche ich?", href: `#${CHECK_ID}` },
	prices: { text: "Preise ansehen", href: `#${OFFERS_ID}` },
	ticks: ["Rechtsgültig nach GEG", "Schnell und einfach"],
};

export const scale = {
	label: "Illustration einer Energieeffizienzskala",
	title: "Energieausweis",
	sub: "für Wohngebäude · gemäß GEG",
	valid: "10 Jahre gültig",
	unit: "kWh/(m²·a)",
	tag: "Beispielwerte",
	classes: ["A+", "A", "B", "C", "D", "E", "F", "G", "H"],
	types: [
		{
			key: "v",
			title: "Verbrauchsausweis",
			sub: "auf Basis gemessener Verbräuche",
			value: 118,
		},
		{
			key: "b",
			title: "Bedarfsausweis",
			sub: "auf Basis der Gebäudesubstanz",
			value: 142,
		},
	] satisfies { key: AusweisType; title: string; sub: string; value: number }[],
	/** Ours: what a screen reader hears instead of the counting figure. */
	srValue: "{value} kWh/(m²·a), Effizienzklasse {class}",
};

export type QuestionKey = "neubau" | "wohnungen" | "bauantrag" | "wschv";
export type Question = {
	key: QuestionKey;
	title: string;
	hint: string;
	answers: { value: string; label: string }[];
};

export type ResultKey = "new" | "must" | "maybe" | "free";
export type Result = {
	key: ResultKey;
	/** The badge: "Pflicht" or "Wahlfreiheit". */
	kind: "must" | "free";
	title: string;
	text: string;
};

export const check = {
	pill: "Welchen Ausweis benötige ich?",
	h2: {
		text: "Vier Fragen. ",
		muted: "Dann wissen Sie es.",
	} satisfies SplitHeading,
	lead: "Ob Verbrauchs- oder Bedarfsausweis hängt vom Gebäude ab: Neubau, Anzahl der Wohnungen, Baujahr und Wärmeschutz. Der Check zeigt, ob Sie frei wählen können.",
	source: "Grundlage: Gebäudeenergiegesetz (GEG). Keine Rechtsberatung.",
	/** Ours: the wizard card's accessible name. */
	label: "Ausweis-Check",
	step: "Frage {n} von {total}",
	resultStep: "Ergebnis",
	back: "Zurück",
	questions: [
		{
			key: "neubau",
			title: "Ist das Gebäude ein Neubau?",
			hint: "Für neu errichtete Gebäude gelten eigene Regeln.",
			answers: [
				{ value: "ja", label: "Ja, Neubau" },
				{ value: "nein", label: "Nein, Bestandsgebäude" },
			],
		},
		{
			key: "wohnungen",
			title: "Wie viele Wohnungen hat das Gebäude?",
			hint: "Gemeint sind Wohneinheiten im gesamten Gebäude.",
			answers: [
				{ value: "k", label: "1 bis 4 Wohnungen" },
				{ value: "g", label: "5 oder mehr Wohnungen" },
			],
		},
		{
			key: "bauantrag",
			title: "Wurde der Bauantrag vor dem 1. November 1977 gestellt?",
			hint: "Maßgeblich ist das Datum des ursprünglichen Bauantrags.",
			answers: [
				{ value: "ja", label: "Ja, vor dem 1.11.1977" },
				{ value: "nein", label: "Nein, danach" },
			],
		},
		{
			key: "wschv",
			title:
				"Erfüllt das Gebäude mindestens die Wärmeschutzverordnung von 1977?",
			hint: "Entweder schon bei Fertigstellung oder durch spätere Sanierung.",
			answers: [
				{ value: "ja", label: "Ja" },
				{ value: "nein", label: "Nein" },
				{ value: "u", label: "Weiß nicht" },
			],
		},
	] satisfies Question[],
	results: [
		{
			key: "new",
			kind: "must",
			title: "Bedarfsausweis",
			text: "Für Neubauten wird ein Bedarfsausweis ausgestellt.",
		},
		{
			key: "must",
			kind: "must",
			title: "Bedarfsausweis",
			text: "Weniger als fünf Wohnungen, Bauantrag vor dem 1.11.1977 und kein Wärmeschutz nach WSchV 1977: Hier ist der Bedarfsausweis Pflicht.",
		},
		{
			key: "maybe",
			kind: "must",
			title: "Voraussichtlich Bedarfsausweis",
			text: "Ohne Nachweis über den Wärmeschutz nach WSchV 1977 sollten Sie von einer Bedarfsausweis-Pflicht ausgehen. Unser Expertenteam klärt das gern mit Ihnen.",
		},
		{
			key: "free",
			kind: "free",
			title: "Sie haben die Wahl",
			text: "Für Ihr Gebäude ist kein Bedarfsausweis vorgeschrieben. Der Verbrauchsausweis ist die günstigere Variante, der Bedarfsausweis die genauere Analyse.",
		},
	] satisfies Result[],
	badges: { must: "Pflicht", free: "Wahlfreiheit" },
	go: { text: "Passende Angebote ansehen", href: `#${OFFERS_ID}` },
	again: "Neu starten",
};

export type Offer = {
	type: AusweisType;
	tier: string;
	recommended?: boolean;
	title: string;
	points: { lead: string; text: string }[];
	/** "69,95 €" (with a no-break space). */
	price: string;
	/** The order page at heidi.energieausweis48.de, opened in a new tab. */
	href: string;
};

const selfService = [
	{
		lead: "Einfach und bequem:",
		text: "eigenständige Online-Dateneingabe mit Unterstützung vom Support-Team",
	},
	{
		lead: "Flexibel und selbstbestimmt:",
		text: "Energieausweis nach eigenem Zeitplan erstellen",
	},
];

export const offers = {
	pill: "Unsere Angebote",
	h2: {
		text: "Vier Wege zum Energieausweis. ",
		muted: "Transparente Preise.",
	} satisfies SplitHeading,
	filter: {
		/** Ours: the radiogroup's accessible name. */
		label: "Angebote filtern",
		options: [
			{ value: "all", label: "Alle" },
			{ value: "v", label: "Verbrauchsausweis" },
			{ value: "b", label: "Bedarfsausweis" },
		] satisfies { value: OfferFilter; label: string }[],
	},
	recommended: "Empfehlung",
	from: "ab",
	vat: "inkl. MwSt.",
	cta: "Jetzt bestellen",
	items: [
		{
			type: "v",
			tier: "Self Service",
			title: "Verbrauchsausweis",
			points: selfService,
			price: "69,95 €",
			href: "https://heidi.energieausweis48.de/verbrauchsausweis?servicelevel=selfservice",
		},
		{
			type: "b",
			tier: "Self Service",
			title: "Bedarfsausweis",
			points: [
				...selfService,
				{ lead: "Präzise:", text: "fundierte Analyse des Energiebedarfs" },
			],
			price: "99,95 €",
			href: "https://heidi.energieausweis48.de/bedarfsausweis?servicelevel=selfservice",
		},
		{
			type: "b",
			tier: "Full Service",
			recommended: true,
			title: "Bedarfsausweis Video",
			points: [
				{
					lead: "Komfortable Expertenberatung:",
					text: "professionelle Unterstützung per Video-Call",
				},
				{
					lead: "Flexibel:",
					text: "Termine innerhalb von 24 Stunden, bequem per Smartphone",
				},
				{
					lead: "Sicher:",
					text: "zusätzliche Qualitätssicherung durch Expertenteam",
				},
			],
			price: "249,95 €",
			href: "https://heidi.energieausweis48.de/bedarfsausweis?servicelevel=videoservice",
		},
		{
			type: "b",
			tier: "Full Service",
			title: "Bedarfsausweis vor Ort",
			points: [
				{
					lead: "Vor-Ort-Besichtigung:",
					text: "ein geschulter Objektbesichtiger kümmert sich um alles",
				},
				{
					lead: "Detaillierte Analyse:",
					text: "Experten wissen, wo sie die wichtigsten Informationen finden",
				},
				{
					lead: "Transparenz:",
					text: "keine versteckten Kosten, keine Anfahrtskosten",
				},
			],
			// The design's figure (plan README, open question 3).
			price: "349,96 €",
			href: "https://heidi.energieausweis48.de/bedarfsausweis?servicelevel=fullservice",
		},
	] satisfies Offer[],
	note: "Alle Preise inklusive MwSt.",
};

/** The offer filter: every offer or one type. */
export type OfferFilter = "all" | AusweisType;

export const compare = {
	pill: "Verbrauch oder Bedarf?",
	h2: {
		text: "Zwei Ausweise, ",
		muted: "zwei Grundlagen.",
	} satisfies SplitHeading,
	/** Ours: the table's accessible name. */
	label: "Verbrauchsausweis und Bedarfsausweis im Vergleich",
	columns: { v: "Verbrauchsausweis", b: "Bedarfsausweis" },
	rows: [
		{
			label: "Grundlage",
			v: "Gemessener Energieverbrauch der Bewohner",
			b: "Berechneter Bedarf aus Bauweise und Anlagentechnik",
		},
		{
			label: "Benötigte Daten",
			v: "Verbräuche über 36 Monate, die jüngste Abrechnungsperiode höchstens 18 Monate alt",
			b: "Gebäudedaten wie Bauteile, Dämmung und Heizungsanlage",
		},
		{
			label: "Pflicht für",
			v: "Frei wählbar, wenn keine Bedarfsausweis-Pflicht besteht",
			b: "Neubauten und Gebäude mit weniger als 5 Wohnungen, Bauantrag vor 1.11.1977 und ohne Wärmeschutz nach WSchV 1977",
		},
		{ label: "Preis", v: "ab 69,95 €", b: "ab 99,95 €", strong: true },
		{ label: "Gültigkeit", v: "10 Jahre", b: "10 Jahre" },
	] as { label: string; v: string; b: string; strong?: boolean }[],
};

export const heidi = {
	pill: "Mit Heidi",
	h2: "Die Verbräuche haben Sie schon.",
	text: "Für den Verbrauchsausweis zählen die Verbräuche der letzten drei Jahre. Mit Heidi liegen die Verbrauchsdaten Ihrer Liegenschaften im Dashboard, aus den Funkzählern und den Heizkostenabrechnungen.",
	// Hnv5z6cFcw3DyXPkw9nQx1 (the dashboard page)
	cta: { text: "Zum Dashboard", href: ROUTE_DASHBOARD },
	years: [
		{ label: "Jahr 1", height: 72 },
		{ label: "Jahr 2", height: 64 },
		{ label: "Jahr 3", height: 58 },
	],
	sum: "36 Monate",
};

export const faq = {
	title: "Häufige Fragen zum Energieausweis",
	items: [
		{
			question: "Wann brauche ich einen Energieausweis?",
			answer:
				"Bei Verkauf und Vermietung. Beim Verkauf muss er spätestens bei der Besichtigung vorgelegt und nach Vertragsschluss an den Käufer übergeben werden.",
		},
		{
			question: "Wie lange ist ein Energieausweis gültig?",
			answer: "Zehn Jahre ab Ausstellung.",
		},
		{
			question: "Welche Daten braucht der Verbrauchsausweis?",
			answer:
				"Den Energieverbrauch über mindestens 36 Monate. Die jüngste Abrechnungsperiode darf dabei höchstens 18 Monate zurückliegen.",
		},
		{
			question: "Wie bestelle ich den Ausweis?",
			answer:
				"Wählen Sie das passende Angebot und fragen Sie es direkt bei Heidi an. Wenn Sie unsicher sind, welcher Ausweis passt, hilft der Check oben auf dieser Seite.",
		},
	] satisfies FaqItem[],
};

export const closing = {
	h2: "Ihr Energieausweis, rechtsgültig nach GEG.",
	// The design's "Jetzt passenden Ausweis finden ↑" (to #check) makes way
	// for the signup form (plan README, open question 1).
	submitLabel: "Jetzt anfragen",
};
