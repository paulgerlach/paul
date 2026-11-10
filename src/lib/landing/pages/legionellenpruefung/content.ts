/**
 * Texts of /legionellenpruefung, word for word from the design
 * (https://claude.ai/artifact/TLDxdkxj1GgdgrHWaAzWvF): the page, the
 * example lab result, the check's questions and results, the duties, the
 * steps and the FAQ. The product, its price and the TrinkwV statements need
 * sign-off before the cutover (go-live gate §4).
 */
import type { FaqItem } from "$lib/landing/faqJsonLd";
import type {
	BundleItem,
	CheckResult,
	HeidiContent,
	HeroContent,
	UrgencyCard,
} from "$lib/landing/sections/svc/types";
import type { SplitHeading } from "$lib/landing/types";
import {
	ROUTE_BLEIMESSUNG,
	ROUTE_ENERGIEAUSWEIS,
	ROUTE_GERAETE,
	ROUTE_HEIZKOSTENABRECHNUNG,
	ROUTE_HYDRAULISCHER_ABGLEICH,
	ROUTE_KONTAKT,
	ROUTE_SELF_SERVICE,
} from "$lib/routes";

/** The check's section, the target of "Bin ich prüfpflichtig? ↓". */
export const CHECK_ID = "check";
/** The steps' section, the target of "So läuft die Prüfung ab". */
export const STEPS_ID = "ablauf";

export const hero = {
	pill: "Legionellenprüfung von Heidi",
	h1: "Die Legionellenprüfung für Ihren Bestand.",
	h1Accent: "Fristgerecht und dokumentiert.",
	lead: "Vermietete Mehrfamilienhäuser mit zentraler Warmwasserbereitung müssen mindestens alle drei Jahre auf Legionellen untersucht werden. Heidi organisiert die Prüfung für Ihre Liegenschaften.",
	check: { text: "Bin ich prüfpflichtig?", href: `#${CHECK_ID}` },
	steps: { text: "So läuft die Prüfung ab", href: `#${STEPS_ID}` },
	ticks: ["Nach § 31 TrinkwV", "Zugelassene Untersuchungsstelle"],
} satisfies HeroContent;

/** The two example results of the hero card. */
export type SampleSet = "ok" | "tmw";

export const befund = {
	label: "Illustration eines Legionellen-Befunds",
	title: "Befund Trinkwasser",
	sub: "Legionellen · KBE pro 100 ml",
	status: {
		sampling: "Probenahme",
		lab: "Im Labor",
		pending: "Wird ausgewertet",
		ok: "Unauffällig",
		bad: "Maßnahmenwert erreicht",
	},
	phases: ["Probenahme", "Labor", "Befund"],
	replay: "Ablauf ansehen",
	/** The schematic's labels. */
	net: {
		heater: "Erwärmer",
		risers: ["Strang 1", "Strang 2"],
		circulation: "Zirkulation",
	},
	captions: {
		start: "Probenahme an vier Stellen",
		/** `{n}`: the sample's number. */
		sample: "Probe {n} von 4",
		lab: "Analyse in der Untersuchungsstelle",
		report: "Befund wird erstellt",
	},
	scale: { min: "0", threshold: "Maßnahmenwert 100", max: "200+" },
	points: [
		"Austritt Trinkwassererwärmer",
		"Eintritt Zirkulation",
		"Steigstrang 1 · Endpunkt",
		"Steigstrang 2 · Endpunkt",
	],
	result: {
		pending: "Proben werden ausgewertet …",
		ok: "Alle Proben unter dem technischen Maßnahmenwert",
		bad: "Anzeige an das Gesundheitsamt und Ursachenuntersuchung nötig",
	},
	types: [
		{ key: "ok", title: "Unauffällig", sub: "alle Proben unter 100" },
		{ key: "tmw", title: "Auffällig", sub: "mindestens eine Probe ab 100" },
	] satisfies { key: SampleSet; title: string; sub: string }[],
	tag: "Beispielwerte",
};

export const urgency = {
	kicker: "Pflicht nach § 31 TrinkwV",
	h2: { text: "Prüfung verpasst? ", muted: "Das kann teuer werden." },
	text: "Wer vermietet und eine Großanlage zur Trinkwassererwärmung betreibt, muss das Trinkwasser mindestens alle drei Jahre auf Legionellen untersuchen lassen. Bleibt die Prüfung aus, ist das eine Ordnungswidrigkeit, und bei Legionellen im Wasser haftet der Vermieter.",
	risks: [
		"Bußgeld als Ordnungswidrigkeit",
		"Mietminderung und Schadenersatz bei Befall",
		"Pflicht zur Anzeige und Information der Bewohner",
	],
	// 2eHVk9HEFKh1F7pWbMnkWb (the Kontakt page)
	cta: { text: "Prüfung beauftragen", href: ROUTE_KONTAKT },
	note: "Trinkwasserverordnung und Infektionsschutzgesetz. Keine Rechtsberatung.",
	cards: [
		{
			label: "Längstes Prüfintervall",
			value: "3 Jahre",
			sub: "bei Vermietung, nach Neuinbetriebnahme schon nach 3 bis 12 Monaten",
		},
		{
			label: "Bußgeld bis zu",
			value: "25.000 €",
			sub: "wenn die Untersuchung versäumt wird",
			hot: true,
		},
		{
			label: "Technischer Maßnahmenwert",
			value: "100 KBE",
			sub: "pro 100 ml, ab dann Anzeige beim Gesundheitsamt",
		},
	] as UrgencyCard[],
};

export type QuestionKey =
	"zentral" | "wohnungen" | "vermietung" | "duschen" | "grossanlage";
export type Question = {
	key: QuestionKey;
	title: string;
	hint: string;
	answers: { value: string; label: string }[];
};

export type ResultKey =
	"must" | "maybe" | "small" | "dez" | "efh" | "self" | "nodu";
export type Result = CheckResult & {
	key: ResultKey;
	/** The badge: "Pflicht" or "Keine Pflicht". */
	kind: "must" | "free";
};

export const check = {
	pill: "Bin ich prüfpflichtig?",
	h2: {
		text: "Fünf Fragen. ",
		muted: "Dann wissen Sie es.",
	} satisfies SplitHeading,
	lead: "Ob ein Gebäude auf Legionellen untersucht werden muss, hängt von der Warmwasseranlage, der Größe des Gebäudes und der Nutzung ab. Der Check gibt Ihnen eine erste Einschätzung.",
	source: "Grundlage: Trinkwasserverordnung (TrinkwV). Keine Rechtsberatung.",
	/** Ours: the card's accessible name. */
	label: "Check: Bin ich prüfpflichtig?",
	/** `{n}` of `{total}`. */
	step: "Frage {n} von {total}",
	resultStep: "Ergebnis",
	back: "Zurück",
	questions: [
		{
			key: "zentral",
			title: "Wird das Warmwasser zentral erwärmt?",
			hint: "Zum Beispiel über einen Speicher im Keller, der mehrere Wohnungen versorgt.",
			answers: [
				{ value: "ja", label: "Ja, zentrale Anlage" },
				{ value: "nein", label: "Nein, dezentral in jeder Wohnung" },
			],
		},
		{
			key: "wohnungen",
			title: "Wie viele Wohnungen hat das Gebäude?",
			hint: "Ein- und Zweifamilienhäuser sind von der Pflicht ausgenommen.",
			answers: [
				{ value: "k", label: "1 oder 2 Wohnungen" },
				{ value: "g", label: "3 oder mehr Wohnungen" },
			],
		},
		{
			key: "vermietung",
			title: "Wird mindestens eine Wohnung vermietet?",
			hint: "Vermietung gilt als gewerbliche Abgabe von Trinkwasser.",
			answers: [
				{ value: "ja", label: "Ja" },
				{ value: "nein", label: "Nein, alle selbst genutzt" },
			],
		},
		{
			key: "duschen",
			title: "Gibt es Duschen im Gebäude?",
			hint: "Entscheidend ist, ob Warmwasser vernebelt wird.",
			answers: [
				{ value: "ja", label: "Ja" },
				{ value: "nein", label: "Nein" },
			],
		},
		{
			key: "grossanlage",
			title:
				"Hat der Speicher mehr als 400 Liter oder die Leitung mehr als 3 Liter Inhalt?",
			hint: "Gemeint ist der Leitungsinhalt zwischen Trinkwassererwärmer und der entferntesten Entnahmestelle, ohne Zirkulation.",
			answers: [
				{ value: "ja", label: "Ja" },
				{ value: "nein", label: "Nein" },
				{ value: "u", label: "Weiß nicht" },
			],
		},
	] satisfies Question[],
	results: [
		{
			key: "must",
			kind: "must",
			title: "Prüfpflichtig",
			text: "Großanlage, Duschen und Vermietung: Das Trinkwasser muss mindestens alle drei Jahre auf Legionellen untersucht werden.",
		},
		{
			key: "maybe",
			kind: "must",
			title: "Voraussichtlich prüfpflichtig",
			text: "In Mehrfamilienhäusern mit Zirkulation liegt der Leitungsinhalt häufig über 3 Litern. Wir prüfen das gern gemeinsam mit Ihnen.",
		},
		{
			key: "small",
			kind: "free",
			title: "Voraussichtlich keine Prüfpflicht",
			text: "Ohne Großanlage zur Trinkwassererwärmung besteht keine Untersuchungspflicht nach § 31 TrinkwV. Eine freiwillige Prüfung kann trotzdem sinnvoll sein.",
		},
		{
			key: "dez",
			kind: "free",
			title: "Voraussichtlich keine Prüfpflicht",
			text: "Bei dezentraler Warmwasserbereitung in den Wohnungen liegt in der Regel keine Großanlage vor.",
		},
		{
			key: "efh",
			kind: "free",
			title: "Keine Prüfpflicht",
			text: "Ein- und Zweifamilienhäuser sind von der Untersuchungspflicht ausgenommen.",
		},
		{
			key: "self",
			kind: "free",
			title: "Voraussichtlich keine Prüfpflicht",
			text: "Ohne Vermietung wird das Trinkwasser nicht gewerblich abgegeben. Klären Sie Sonderfälle mit dem Gesundheitsamt.",
		},
		{
			key: "nodu",
			kind: "free",
			title: "Voraussichtlich keine Prüfpflicht",
			text: "Ohne Duschen oder andere Vernebelung greift die Untersuchungspflicht nicht.",
		},
	] satisfies Result[],
	badges: { must: "Pflicht", free: "Keine Pflicht" },
	go: { text: "So läuft die Prüfung ab", href: `#${STEPS_ID}` },
	again: "Neu starten",
};

export const sampling = {
	pill: "Probenahme",
	h2: {
		text: "Nach den Regeln der Technik. ",
		muted: "An jeder vorgeschriebenen Stelle.",
	} satisfies SplitHeading,
	lead: "Die Proben werden an mehreren repräsentativen Stellen der Anlage genommen und in einer zugelassenen Untersuchungsstelle ausgewertet.",
	alt: "Fachkraft in Schutzkleidung bei der Arbeit in einem Labor",
	points: [
		"Austritt des Trinkwassererwärmers",
		"Eintritt der Zirkulation",
		"Endpunkte der Steigstränge",
	],
	source: "§§ 39, 41, 43 Trinkwasserverordnung",
};

export const duties = {
	pill: "Trinkwasserverordnung",
	h2: {
		text: "Was die Verordnung verlangt. ",
		muted: "Auf einen Blick.",
	} satisfies SplitHeading,
	rows: [
		{
			label: "Wer",
			text: "Betreiber von Trinkwasseranlagen, die Wasser im Rahmen einer gewerblichen oder öffentlichen Tätigkeit abgeben. Dazu zählt die Vermietung.",
		},
		{
			label: "Welche Anlagen",
			text: "Großanlagen zur Trinkwassererwärmung: Speicher über 400 Liter oder über 3 Liter Leitungsinhalt zwischen Erwärmer und Entnahmestelle (ohne Zirkulation), dazu Duschen oder andere Vernebelung.",
		},
		{
			label: "Intervall",
			text: "Bei Vermietung mindestens alle drei Jahre. Nach Neuinbetriebnahme erstmals innerhalb von 3 bis 12 Monaten.",
		},
		{
			label: "Maßnahmenwert",
			text: "100 KBE Legionellen pro 100 ml in mindestens einer Probe.",
		},
		{
			label: "Probenahme",
			text: "Durch eine zugelassene Untersuchungsstelle, mindestens am Austritt des Trinkwassererwärmers, am Eintritt der Zirkulation und an den Endpunkten der Steigstränge.",
		},
		{
			label: "Bei Erreichen",
			text: "Anzeige beim Gesundheitsamt, Information der Bewohner, Ursachenuntersuchung mit Ortsbesichtigung und Risikoabschätzung, Schutzmaßnahmen.",
		},
	],
	source: "§§ 31, 39, 51 Trinkwasserverordnung. Keine Rechtsberatung.",
};

export const steps = {
	pill: "Ablauf",
	h2: {
		text: "Vier Schritte. ",
		muted: "Ein Ansprechpartner.",
	} satisfies SplitHeading,
	items: [
		{
			title: "Bestand erfassen",
			text: "Sie nennen uns die Liegenschaften. Wir klären, welche Anlagen prüfpflichtig sind und wann die nächste Untersuchung fällig ist.",
		},
		{
			title: "Termin planen",
			text: "Wir stimmen den Termin für die Probenahme ab und informieren die Bewohner rechtzeitig.",
		},
		{
			title: "Proben nehmen",
			text: "Eine zugelassene Untersuchungsstelle nimmt die Proben an den vorgeschriebenen Stellen.",
		},
		{
			title: "Befund erhalten",
			text: "Sie erhalten den Befund. Ist der Maßnahmenwert erreicht, sagen wir Ihnen, was jetzt zu tun ist.",
		},
	],
	/** The pictures' words (decorative, hidden from screen readers). */
	visuals: {
		due: "Prüfpflichtig",
		day: "14",
		informed: "Informiert",
		taps: ["Vorlauf", "Rücklauf", "Strang"],
		report: "Befund Legionellen",
		limit: "100",
		value: "230",
		unit: "KBE/100 ml",
		action: "Maßnahme",
	},
};

export const lab = {
	kicker: "Untersuchungsstelle",
	h2: "Jede Probe wird in einer zugelassenen Untersuchungsstelle analysiert.",
	source: "§ 39 Trinkwasserverordnung",
	alt: "Wasserproben in Röhrchen in einem Laborständer, gehalten von einer Hand im blauen Laborhandschuh",
};

export const heidi = {
	pill: "Mit Heidi",
	h2: "Alles rund um Ihre Liegenschaft. Aus einer Hand.",
	text: "Funkzähler, Heizkostenabrechnung, Energieausweis und Legionellenprüfung: Mit Heidi haben Sie für alles einen festen Ansprechpartner.",
	// 42U8uYryb6qXPWKZCWgkaZ (the Self-Service page)
	cta: { text: "Im Self-Service anfragen", href: ROUTE_SELF_SERVICE },
	price: { from: "ab", value: "300 €", unit: "netto pro Gebäude" },
	label: "Leistungen von Heidi",
	current: "Diese Seite",
	bundle: [
		// 3SRjNA9CRSPQEU3cWdAkbt
		{ text: "Funkzähler", href: ROUTE_GERAETE },
		// H4cZtgYCsvL4h7HGxZaHBs
		{ text: "Heizkostenabrechnung", href: ROUTE_HEIZKOSTENABRECHNUNG },
		// Xk6APwMsadTT7axHzbuPA4
		{ text: "Energieausweis", href: ROUTE_ENERGIEAUSWEIS },
		{ text: "Legionellenprüfung", current: true },
		// W6ADiuaHVAPgheeznXGZFi
		{ text: "Hydraulischer Abgleich", href: ROUTE_HYDRAULISCHER_ABGLEICH },
		// CUfAbZdQaBvnSBFxgLLWGU
		{ text: "Bleimessung", href: ROUTE_BLEIMESSUNG },
	] satisfies BundleItem[],
} satisfies HeidiContent;

export const faq = {
	title: "Häufige Fragen zur Legionellenprüfung",
	items: [
		{
			question: "Wer muss die Legionellenprüfung veranlassen?",
			answer:
				"Der Betreiber der Trinkwasseranlage. Bei vermieteten Mehrfamilienhäusern ist das in der Regel der Eigentümer, die Organisation übernimmt meist die Verwaltung.",
		},
		{
			question: "Wie oft muss geprüft werden?",
			answer:
				"Bei gewerblicher Abgabe, also zum Beispiel bei Vermietung, mindestens alle drei Jahre (§ 31 TrinkwV). Wird eine Anlage neu in Betrieb genommen, ist die erste Untersuchung innerhalb von 3 bis 12 Monaten fällig.",
		},
		{
			question: "Gilt die Pflicht auch für Ein- und Zweifamilienhäuser?",
			answer:
				"Nein. Anlagen in Ein- und Zweifamilienhäusern sind von der Untersuchungspflicht ausgenommen.",
		},
		{
			question: "Was ist der technische Maßnahmenwert?",
			answer:
				"100 koloniebildende Einheiten Legionellen pro 100 ml Trinkwasser. Wird dieser Wert in mindestens einer Probe erreicht, muss gehandelt werden.",
		},
		{
			question: "Was passiert, wenn der Maßnahmenwert erreicht ist?",
			answer:
				"Der Betreiber zeigt das dem Gesundheitsamt an, informiert die Bewohner und lässt unverzüglich die Ursache untersuchen, mit Ortsbesichtigung und Risikoabschätzung. Danach folgen die nötigen Schutzmaßnahmen (§ 51 TrinkwV).",
		},
		{
			question: "Wer darf die Proben nehmen und untersuchen?",
			answer:
				"Nur eine zugelassene Untersuchungsstelle (§ 39 TrinkwV). Die Proben werden an mehreren repräsentativen Stellen nach den anerkannten Regeln der Technik genommen.",
		},
		{
			question: "Was, wenn keine Probenahmeventile vorhanden sind?",
			answer:
				"Dann müssen sie vor der ersten Untersuchung eingebaut werden, in der Regel durch einen Installateur.",
		},
		{
			question: "Ersetzt diese Seite eine Rechtsberatung?",
			answer:
				"Nein. Sie gibt einen Überblick über die Trinkwasserverordnung. Für Ihren Einzelfall ist das zuständige Gesundheitsamt Ansprechpartner.",
		},
	] satisfies FaqItem[],
};

export const closing = {
	h2: "Ist Ihr Bestand prüfpflichtig? Wir klären das mit Ihnen.",
	// 2eHVk9HEFKh1F7pWbMnkWb (the Kontakt page)
	cta: { text: "Prüfung anfragen", href: ROUTE_KONTAKT },
};
