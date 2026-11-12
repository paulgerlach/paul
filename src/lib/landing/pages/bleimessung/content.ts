/**
 * Texts of /bleimessung, word for word from the design
 * (https://claude.ai/artifact/CUfAbZdQaBvnSBFxgLLWGU): the page, the
 * example measurement, the check's questions and results, the rules, the
 * steps and the FAQ. The product, its price and the TrinkwV statements need
 * sign-off before the cutover (go-live gate §2).
 */
import type {
	BundleItem,
	CheckContent,
	CheckResult,
	DutiesContent,
	FaqContent,
	HeidiContent,
	HeroContent,
	PictureContent,
	SplitContent,
	StepsContent,
} from "$lib/landing/sections/svc/types";
import {
	ROUTE_ENERGIEAUSWEIS,
	ROUTE_GERAETE,
	ROUTE_HEIZKOSTENABRECHNUNG,
	ROUTE_HYDRAULISCHER_ABGLEICH,
	ROUTE_KONTAKT,
	ROUTE_LEGIONELLENPRUEFUNG,
	ROUTE_SELF_SERVICE,
} from "$lib/routes";
import type { Verdict } from "./messung";

/** The check's section, the target of "Muss ich handeln? ↓". */
export const CHECK_ID = "check";
/** The rules' section, the target of "Was gilt". */
export const DUTIES_ID = "pflichten";

export const hero = {
	pill: "Bleimessung von Heidi",
	h1: "Blei im Trinkwasser?",
	h1Accent: "Messen statt vermuten.",
	lead: "In vielen Altbauten stecken noch Bleileitungen oder Teilstücke. Seit Januar 2026 müssen sie entfernt sein, ab 2028 sinkt der Grenzwert auf 5 µg/l. Eine Bleimessung zeigt, wie es um Ihre Liegenschaft steht.",
	check: { text: "Muss ich handeln?", href: `#${CHECK_ID}` },
	steps: { text: "Was gilt", href: `#${DUTIES_ID}` },
	ticks: ["Nach Trinkwasserverordnung", "Zugelassene Untersuchungsstelle"],
} satisfies HeroContent;

/** The hero's card (the design's .pb-card, #pb-js). */
export const messung = {
	label: "Illustration einer Bleimessung",
	title: "Bleiwert im Trinkwasser",
	sub: "Zapfstelle Küche · µg/l",
	status: {
		sampling: "Probenahme",
		lab: "Im Labor",
		ok: "Unauffällig",
		warn: "Ab 2028 zu hoch",
		bad: "Grenzwert überschritten",
	} satisfies Record<Verdict | "sampling" | "lab", string>,
	phases: ["Probe", "Labor", "Ergebnis"],
	replay: "Ablauf ansehen",
	captions: {
		sampling: "Probe wird genommen",
		lab: "Analyse in der Untersuchungsstelle",
		result: "Ergebnis · Zapfstelle Küche",
	},
	unit: "µg/l",
	result: {
		pending: "Messung läuft …",
		ok: "Unter dem Grenzwert von heute und ab 2028",
		warn: "Heute zulässig, ab 12. Januar 2028 über dem Grenzwert von 5 µg/l",
		bad: "Über dem Grenzwert von 10 µg/l: Bewohner und Gesundheitsamt informieren",
	} satisfies Record<Verdict | "pending", string>,
	/** The scale's marks, at their place in percent of 0–20 µg/l. */
	marks: [
		{ value: "5", text: "ab 2028", left: 25, cls: "m5" },
		{ value: "10", text: "Grenzwert heute", left: 50, cls: "m10" },
	],
	ends: ["0", "20+ µg/l"],
	/** The three examples; the second is the start. */
	examples: [
		{ value: 2, title: "2 µg/l", sub: "unauffällig" },
		{ value: 7, title: "7 µg/l", sub: "ab 2028 zu hoch" },
		{ value: 18, title: "18 µg/l", sub: "überschritten" },
	],
	tag: "Beispielwerte",
};

export const urgency = {
	kicker: "Frist abgelaufen am 12. Januar 2026",
	h2: { text: "Bleileitungen ", muted: "müssen raus. Jetzt." },
	text: "Bleileitungen und Teilstücke mussten bis zum 12. Januar 2026 entfernt oder stillgelegt sein. Seit dem 13. Januar 2026 müssen Betreiber den Bewohnern in Textform nachweisen, dass sie das erledigt haben (§ 17 TrinkwV).",
	risks: [
		"Bewohner informieren, sobald Blei bekannt oder anzunehmen ist",
		"Fristverlängerung nur auf Antrag beim Gesundheitsamt",
		"Grenzwert halbiert sich ab 2028",
	],
	// 2eHVk9HEFKh1F7pWbMnkWb (the Kontakt page)
	cta: { text: "Bleimessung anfragen", href: ROUTE_KONTAKT },
	note: "Trinkwasserverordnung, insbesondere § 17. Keine Rechtsberatung.",
	/** The first card: its figure is the days since `LEAD_DEADLINE` (see `Urgency.svelte`). */
	since: {
		label: "Seit Ablauf der Frist",
		suffix: " Tage",
		sub: "am 12. Januar 2026",
	},
	cards: [
		{
			label: "Grenzwert heute",
			value: "10 µg/l",
			sub: "ab 2028 nur noch 5 µg/l",
		},
		{
			label: "Nachweis an die Bewohner",
			value: "Textform",
			sub: "Pflicht seit dem 13. Januar 2026",
		},
	],
};

/** The check's results; `kind` picks the badge. */
export type ResultKey = "lead" | "check" | "renov" | "new";

export const check = {
	pill: "Muss ich handeln?",
	h2: { text: "Drei Fragen. ", muted: "Eine Einschätzung." },
	lead: "Ob Blei im Trinkwasser ein Thema ist, hängt vor allem vom Baujahr und vom Zustand der Leitungen ab.",
	source: "Grundlage: Trinkwasserverordnung (TrinkwV). Keine Rechtsberatung.",
	label: "Check: Muss ich handeln?",
	step: "Frage {n}",
	resultStep: "Ergebnis",
	back: "Zurück",
	questions: [
		{
			title: "Wurde das Gebäude vor 1973 gebaut?",
			hint: "Bleirohre finden sich vor allem in Gebäuden, die vor 1973 gebaut und nicht saniert wurden.",
			answers: [
				{ value: "alt", label: "Ja, vor 1973" },
				{ value: "neu", label: "Nein, danach" },
			],
		},
		{
			title: "Wurden die Trinkwasserleitungen seitdem vollständig erneuert?",
			hint: "Gemeint sind alle Leitungen bis zur Zapfstelle, auch kurze Teilstücke.",
			answers: [
				{ value: "ja", label: "Ja, nachweislich vollständig" },
				{ value: "nein", label: "Nein oder nicht sicher" },
			],
		},
		{
			title: "Sind Bleileitungen im Gebäude bekannt?",
			hint: "Zum Beispiel aus einem Befund, von einem Installateur oder aus alten Unterlagen.",
			answers: [
				{ value: "ja", label: "Ja" },
				{ value: "nein", label: "Nein oder nicht sicher" },
			],
		},
	],
	results: [
		{
			key: "lead",
			kind: "must",
			title: "Bleileitungen müssen entfernt werden",
			text: "Seit dem 12. Januar 2026 müssen Bleileitungen entfernt oder stillgelegt sein (§ 17 TrinkwV). Informieren Sie die Bewohner und lassen Sie die Leitungen austauschen. Eine Bleimessung zeigt die aktuelle Belastung.",
		},
		{
			key: "check",
			kind: "info",
			title: "Bleimessung empfohlen",
			text: "In Gebäuden vor 1973 ohne vollständig erneuerte Leitungen können Bleileitungen oder Teilstücke vorhanden sein. Eine Messung schafft Klarheit.",
		},
		{
			key: "renov",
			kind: "free",
			title: "Bleileitungen unwahrscheinlich",
			text: "Sind alle Leitungen nachweislich erneuert, ist Blei aus der Hausinstallation unwahrscheinlich. Bewahren Sie den Nachweis auf.",
		},
		{
			key: "new",
			kind: "free",
			title: "Bleileitungen unwahrscheinlich",
			text: "Bleirohre finden sich vor allem in Gebäuden, die vor 1973 gebaut wurden. Eine Messung kann trotzdem Gewissheit geben.",
		},
	] satisfies (CheckResult & { key: ResultKey })[],
	badges: { must: "Pflicht", info: "Empfehlung", free: "Geringes Risiko" },
	go: { text: "Was gilt", href: `#${DUTIES_ID}` },
	again: "Neu starten",
} satisfies CheckContent;

export const analysis = {
	pill: "Analyse",
	h2: { text: "Probe an der Zapfstelle. ", muted: "Analyse im Labor." },
	lead: "Die Probe wird an der Zapfstelle genommen und in einer zugelassenen Untersuchungsstelle auf Blei analysiert.",
	alt: "Laborfachkräfte in Schutzkleidung an einem Mikroskop im Labor",
	points: [
		"Probe an der Zapfstelle",
		"Analyse auf Blei im Labor",
		"Vergleich mit dem Grenzwert von heute und ab 2028",
	],
	source: "Trinkwasserverordnung",
} satisfies SplitContent;

export const duties = {
	pill: "Trinkwasserverordnung",
	h2: { text: "Was für Blei gilt. ", muted: "Auf einen Blick." },
	rows: [
		{
			label: "Grenzwert",
			text: "10 µg Blei pro Liter. Ab dem 12. Januar 2028 gilt ein Grenzwert von 5 µg/l.",
		},
		{
			label: "Bleileitungen",
			text: "Mussten bis zum 12. Januar 2026 entfernt oder stillgelegt werden, auch Teilstücke und innen beschichtete Leitungen (§ 17 TrinkwV). Ausnahmen gibt es nur in engen Grenzen und nach Antrag beim Gesundheitsamt.",
		},
		{
			label: "Information",
			text: "Ist bekannt oder anzunehmen, dass Blei in der Installation ist, müssen die versorgten Personen unverzüglich informiert werden, mit dem voraussichtlichen Zeitpunkt der Entfernung.",
		},
		{
			label: "Anzeige",
			text: "Stellt ein Installationsunternehmen Bleileitungen fest, zeigt es das dem Gesundheitsamt an.",
		},
		{
			label: "Untersuchung",
			text: "Verbindliche Untersuchungen dürfen nur zugelassene Untersuchungsstellen durchführen. Selbst genommene Proben sind nur orientierend.",
		},
		{
			label: "Gesundheit",
			text: "Blei ist neurotoxisch. Besonders gefährdet sind Ungeborene, Schwangere und kleine Kinder. Filter oder Abkochen helfen nicht.",
		},
	],
	source: "Trinkwasserverordnung, insbesondere § 17. Keine Rechtsberatung.",
} satisfies DutiesContent;

export const steps = {
	pill: "Ablauf",
	h2: { text: "Vier Schritte. ", muted: "Ein Ansprechpartner." },
	items: [
		{
			title: "Objekt prüfen",
			text: "Baujahr und Leitungen: Wir klären mit Ihnen, wo Blei vorkommen kann und wo gemessen wird.",
		},
		{
			title: "Probe nehmen",
			text: "Eine zugelassene Untersuchungsstelle nimmt die Probe an der Zapfstelle.",
		},
		{
			title: "Analysieren",
			text: "Die Probe wird im Labor auf Blei untersucht, verglichen mit dem Grenzwert von heute und ab 2028.",
		},
		{
			title: "Ergebnis erhalten",
			text: "Sie erhalten den Befund. Liegt der Wert zu hoch, sagen wir Ihnen, was jetzt zu tun ist.",
		},
	],
} satisfies StepsContent;

/** The pictures' words (decorative, hidden from screen readers). */
export const stepVisuals = {
	year: "Bj. 1968",
	lead: "Blei?",
	value: "Pb · 7 µg/l",
	report: "Befund Blei",
	result: "7 µg/l",
	pill: "Befund",
};

export const picture = {
	kicker: "Untersuchungsstelle",
	h2: "Verbindliche Bleimessungen führt nur eine zugelassene Untersuchungsstelle durch.",
	source: "Trinkwasserverordnung",
	alt: "Laborfachkraft in Schutzkleidung mit Schutzbrille am Mikroskop",
} satisfies PictureContent;

export const heidi = {
	pill: "Mit Heidi",
	h2: "Alles rund um Ihre Liegenschaft. Aus einer Hand.",
	text: "Funkzähler, Heizkostenabrechnung und Prüfungen wie die Bleimessung: Mit Heidi haben Sie für alles einen festen Ansprechpartner.",
	// 42U8uYryb6qXPWKZCWgkaZ (the Self-Service page)
	cta: { text: "Im Self-Service anfragen", href: ROUTE_SELF_SERVICE },
	price: { from: "ab", value: "55 €", unit: "netto pro Probe" },
	label: "Leistungen von Heidi",
	current: "Diese Seite",
	bundle: [
		// 3SRjNA9CRSPQEU3cWdAkbt
		{ text: "Funkzähler", href: ROUTE_GERAETE },
		// H4cZtgYCsvL4h7HGxZaHBs
		{ text: "Heizkostenabrechnung", href: ROUTE_HEIZKOSTENABRECHNUNG },
		// Xk6APwMsadTT7axHzbuPA4
		{ text: "Energieausweis", href: ROUTE_ENERGIEAUSWEIS },
		// TLDxdkxj1GgdgrHWaAzWvF
		{ text: "Legionellenprüfung", href: ROUTE_LEGIONELLENPRUEFUNG },
		// W6ADiuaHVAPgheeznXGZFi
		{ text: "Hydraulischer Abgleich", href: ROUTE_HYDRAULISCHER_ABGLEICH },
		{ text: "Bleimessung", current: true },
	] satisfies BundleItem[],
} satisfies HeidiContent;

export const faq = {
	title: "Häufige Fragen zur Bleimessung",
	items: [
		{
			question: "Woran erkenne ich, ob Bleileitungen vorhanden sein könnten?",
			answer:
				"Bleirohre finden sich vor allem in Gebäuden, die vor 1973 gebaut und seitdem nicht saniert wurden. Sicherheit gibt eine Bleimessung oder die Prüfung durch einen Installateur.",
		},
		{
			question: "Welcher Grenzwert gilt?",
			answer:
				"Derzeit 10 µg Blei pro Liter Trinkwasser. Ab dem 12. Januar 2028 sinkt der Grenzwert auf 5 µg/l.",
		},
		{
			question: "Bis wann mussten Bleileitungen raus?",
			answer:
				"Bis zum 12. Januar 2026. Bleileitungen und Teilstücke müssen entfernt oder stillgelegt sein (§ 17 TrinkwV).",
		},
		{
			question: "Helfen Filter oder Abkochen?",
			answer:
				"Nein. Weder Filter noch Abkochen schützen zuverlässig vor Blei aus der Leitung.",
		},
		{
			question: "Wer ist besonders gefährdet?",
			answer:
				"Ungeborene, Schwangere und kleine Kinder. Blei kann das Gehirn schädigen.",
		},
		{
			question: "Was passiert, wenn der Grenzwert überschritten ist?",
			answer:
				"Das Gesundheitsamt wird informiert, die Bewohner ebenfalls. Die Ursache, meist alte Leitungen oder Teilstücke, muss beseitigt werden.",
		},
		{
			question: "Ersetzt diese Seite eine Rechtsberatung?",
			answer:
				"Nein. Sie gibt einen Überblick über die Trinkwasserverordnung. Für Ihren Einzelfall ist das zuständige Gesundheitsamt Ansprechpartner.",
		},
	],
} satisfies FaqContent;

export const closing = {
	h2: "Klarheit über Blei in Ihrem Bestand.",
	// 2eHVk9HEFKh1F7pWbMnkWb (the Kontakt page)
	cta: { text: "Bleimessung anfragen", href: ROUTE_KONTAKT },
};
