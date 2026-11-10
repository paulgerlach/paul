/**
 * Texts of /hydraulischer-abgleich, word for word from the design
 * (https://claude.ai/artifact/W6ADiuaHVAPgheeznXGZFi): the page, the
 * example heat map, the check's questions and results, the law, the steps
 * and the FAQ. The product, its price and the GModG statements need sign-off
 * before the cutover (go-live gate §2).
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
	ROUTE_KONTAKT,
	ROUTE_LEGIONELLENPRUEFUNG,
	ROUTE_SELF_SERVICE,
} from "$lib/routes";

/** The check's section, the target of "Bin ich verpflichtet? ↓". */
export const CHECK_ID = "check";
/** The steps' section, the target of "So läuft der Abgleich ab". */
export const STEPS_ID = "ablauf";

export const hero = {
	pill: "Hydraulischer Abgleich von Heidi",
	h1: "Jeder Heizkörper bekommt, was er braucht.",
	h1Accent: "Der hydraulische Abgleich.",
	lead: "Seit Oktober 2024 ist der hydraulische Abgleich nach dem Einbau einer Heizungsanlage in Gebäuden ab sechs Wohnungen Pflicht. Heidi organisiert ihn für Ihre Liegenschaften, mit raumweiser Heizlastberechnung und schriftlicher Bestätigung.",
	check: { text: "Bin ich verpflichtet?", href: `#${CHECK_ID}` },
	steps: { text: "So läuft der Abgleich ab", href: `#${STEPS_ID}` },
	ticks: ["Nach § 60c GModG", "Verfahren B mit Heizlastberechnung"],
} satisfies HeroContent;

export const heatmap = {
	label: "Illustration eines Gebäudes vor und nach dem hydraulischen Abgleich",
	title: "Wärmebild",
	sub: "Lindenallee 12 · fünf Etagen",
	status: {
		before: "Vorher",
		load: "Heizlast",
		setting: "Einstellung",
		done: "Abgeglichen",
	},
	phases: ["Heizlast", "Einstellung", "Ergebnis"],
	replay: "Ablauf ansehen",
	kpi: {
		flow: "Vorlauf",
		pump: "Pumpe",
		/** "Stufe 3" */
		stage: "Stufe",
		spread: "Spreizung Raumtemperatur",
	},
	/** Top to bottom. */
	floors: ["4. OG", "3. OG", "2. OG", "1. OG", "EG"],
	boiler: "Heizung",
	legend: {
		cold: "zu kalt",
		ok: "behaglich",
		hot: "zu warm",
		flow: "Durchfluss",
	},
	captions: {
		before: "Ungleich verteilt: unten zu warm, oben zu kalt",
		load: "Heizlast je Raum nach DIN EN 12831",
		setting: "Ventile voreinstellen, Pumpe anpassen",
		done: "Gleichmäßig warm bei niedrigerer Vorlauftemperatur",
	},
	tag: "Beispielwerte",
};

export const urgency = {
	kicker: "Pflicht nach § 60c GModG",
	h2: { text: "Neue Heizung ohne Abgleich? ", muted: "Das ist ein Verstoß." },
	text: "In Gebäuden ab sechs Wohnungen muss jede neu eingebaute Heizungsanlage mit Wasser als Wärmeträger hydraulisch abgeglichen werden. Die Pflicht stand bis Juli 2026 im GEG und gilt im Gebäudemodernisierungsgesetz weiter.",
	risks: [
		"Verfahren B mit raumweiser Heizlastberechnung",
		"Ohne Verfahren B keine BEG-Förderung",
		"Schriftliche Bestätigung des Abgleichs",
	],
	// 2eHVk9HEFKh1F7pWbMnkWb (the Kontakt page)
	cta: { text: "Abgleich anfragen", href: ROUTE_KONTAKT },
	note: "Gebäudemodernisierungsgesetz (vormals GEG), §§ 60b, 60c und 108. Keine Rechtsberatung.",
	cards: [
		{
			label: "Wohnungen im Gebäude",
			value: "6+",
			sub: "ab dann gilt die Pflicht zum Abgleich",
		},
		{
			label: "Bußgeld bis zu",
			value: "5.000 €",
			sub: "bei Verstoß gegen § 60c",
			hot: true,
		},
	],
	/** The third card: its figure is the days left until `INSPECTION_DEADLINE` (see `urgencyCards`). */
	countdown: {
		label: "Bis zur Frist am 30.9.2027",
		suffix: " Tage",
		sub: "Heizungsprüfung für Anlagen, die vor Oktober 2009 eingebaut wurden (§ 60b)",
	},
};

/** The check's results; `kind` picks the badge. */
export type ResultKey = "must" | "old" | "small" | "nowater";

export const check = {
	pill: "Bin ich verpflichtet?",
	h2: { text: "Drei Fragen. ", muted: "Dann wissen Sie es." },
	lead: "Ob ein hydraulischer Abgleich vorgeschrieben ist, hängt vom Einbau der Anlage, der Größe des Gebäudes und der Art der Heizung ab.",
	source:
		"Grundlage: Gebäudemodernisierungsgesetz (GModG, vormals GEG). Keine Rechtsberatung.",
	label: "Check: Bin ich verpflichtet?",
	step: "Frage {n}",
	resultStep: "Ergebnis",
	back: "Zurück",
	questions: [
		{
			title:
				"Wird eine Heizungsanlage neu eingebaut, oder wurde sie nach dem 1. Oktober 2024 eingebaut?",
			hint: "Die Pflicht nach § 60c GModG knüpft an den Einbau einer Heizungsanlage an.",
			answers: [
				{ value: "ja", label: "Ja" },
				{ value: "alt", label: "Nein, die Anlage ist älter" },
			],
		},
		{
			title: "Wie viele Wohnungen oder Nutzungseinheiten hat das Gebäude?",
			hint: "Gemeint sind Wohnungen oder sonstige selbstständige Nutzungseinheiten.",
			answers: [
				{ value: "g", label: "6 oder mehr" },
				{ value: "k", label: "Bis zu 5" },
			],
		},
		{
			title:
				"Wird mit Wasser geheizt, also über Heizkörper oder Fußbodenheizung?",
			hint: "Die Pflicht gilt für wassergeführte Heizungssysteme.",
			answers: [
				{ value: "ja", label: "Ja" },
				{ value: "nein", label: "Nein" },
			],
		},
	],
	results: [
		{
			key: "must",
			kind: "must",
			title: "Hydraulischer Abgleich ist Pflicht",
			text: "Nach § 60c GModG muss die Anlage hydraulisch abgeglichen werden: nach Verfahren B, mit raumweiser Heizlastberechnung und schriftlicher Bestätigung.",
		},
		{
			key: "old",
			kind: "info",
			title: "Keine Pflicht nach § 60c, aber Heizungsprüfung beachten",
			text: "§ 60c gilt nach dem Einbau einer Anlage. In Gebäuden ab sechs Wohnungen kann für bestehende Anlagen die Heizungsprüfung nach § 60b fällig sein. Ein freiwilliger Abgleich kann den Verbrauch senken.",
		},
		{
			key: "small",
			kind: "free",
			title: "Keine Pflicht nach § 60c",
			text: "In Gebäuden mit bis zu fünf Wohnungen ist der Abgleich nicht vorgeschrieben. Ein freiwilliger Abgleich kann dort gefördert werden.",
		},
		{
			key: "nowater",
			kind: "free",
			title: "Keine Pflicht nach § 60c",
			text: "Die Pflicht betrifft wassergeführte Heizungssysteme.",
		},
	] satisfies (CheckResult & { key: ResultKey })[],
	badges: { must: "Pflicht", info: "Empfehlung", free: "Keine Pflicht" },
	go: { text: "So läuft der Abgleich ab", href: `#${STEPS_ID}` },
	again: "Neu starten",
} satisfies CheckContent;

export const planning = {
	pill: "Fachgerecht",
	h2: { text: "Berechnet statt geschätzt. ", muted: "Raum für Raum." },
	lead: "Grundlage jedes Einstellwerts ist die raumweise Heizlastberechnung nach DIN EN 12831-1. Erst danach werden Ventile, Pumpe und Vorlauftemperatur eingestellt.",
	alt: "Durchflussanzeiger und Ventile an einem Heizkreisverteiler",
	points: [
		"Heizlast für jeden Raum",
		"Voreinstellung der Thermostatventile",
		"Pumpe und Vorlauftemperatur angepasst",
	],
	source: "§ 60c GModG",
} satisfies SplitContent;

export const duties = {
	pill: "Gebäudemodernisierungsgesetz",
	h2: { text: "Was das Gesetz verlangt. ", muted: "Auf einen Blick." },
	rows: [
		{
			label: "Wer",
			text: "Eigentümer von Gebäuden mit mindestens sechs Wohnungen oder sonstigen selbstständigen Nutzungseinheiten.",
		},
		{
			label: "Wann",
			text: "Nach dem Einbau oder der Aufstellung einer wassergeführten Heizungsanlage. Die Pflicht gilt seit dem 1. Oktober 2024.",
		},
		{
			label: "Was",
			text: "Raumweise Heizlastberechnung nach DIN EN 12831-1, Prüfung und bei Bedarf Optimierung der Heizflächen für eine möglichst niedrige Vorlauftemperatur, Anpassung der Vorlauftemperaturregelung.",
		},
		{
			label: "Verfahren",
			text: "Verfahren B der ZVSHK-Fachregel „Optimierung von Heizungsanlagen im Bestand“ oder ein gleichwertiges Verfahren.",
		},
		{
			label: "Nachweis",
			text: "Schriftliche Bestätigung mit Einstellwerten, Heizlast des Gebäudes, Leistung des Wärmeerzeugers, raumweisen Heizlasten, Auslegungstemperatur, Regelungseinstellung und Vordruck des Ausdehnungsgefäßes. Mieter können sie verlangen.",
		},
		{
			label: "Bestandsanlagen",
			text: "Für bestehende Anlagen in Gebäuden ab sechs Wohnungen gilt die Heizungsprüfung nach § 60b GModG. Anlagen, die vor dem 1. Oktober 2009 eingebaut wurden, müssen bis zum 30. September 2027 geprüft sein.",
		},
		{
			label: "Verstoß",
			text: "Wer den Abgleich nicht rechtzeitig durchführt, handelt ordnungswidrig.",
		},
	],
	source: "§§ 60b, 60c GEG. Keine Rechtsberatung.",
} satisfies DutiesContent;

export const steps = {
	pill: "Ablauf",
	h2: { text: "Vier Schritte. ", muted: "Ein Ansprechpartner." },
	items: [
		{
			title: "Bestand erfassen",
			text: "Heizkörper, Ventile und Räume werden aufgenommen. Wir klären, ob die Pflicht greift.",
		},
		{
			title: "Heizlast berechnen",
			text: "Für jeden Raum wird die Heizlast nach DIN EN 12831 berechnet. Sie ist die Grundlage aller Einstellwerte.",
		},
		{
			title: "Einstellen",
			text: "Die Thermostatventile werden voreingestellt, Pumpe und Vorlauftemperatur werden angepasst.",
		},
		{
			title: "Bestätigen",
			text: "Sie erhalten die schriftliche Bestätigung mit allen Einstellwerten für Ihre Unterlagen.",
		},
	],
} satisfies StepsContent;

/** The pictures' words (decorative, hidden from screen readers). */
export const stepVisuals = {
	captured: ["4 von 4", "erfasst"],
	loads: ["820 W", "1,1 kW", "1,4 kW", "540 W"],
	norm: "DIN 12831",
	flow: "Vorlauf",
	temps: ["70°", "55°"],
	report: "Bestätigung Abgleich",
	settings: ["Stufe 3", "Stufe 4", "Stufe 2"],
	stamp: "Bestätigt",
};

export const picture = {
	kicker: "Dokumentation",
	h2: "Jeder Einstellwert wird schriftlich bestätigt.",
	source: "§ 60c GModG",
	alt: "Fachkraft stellt Stellantriebe an einem Heizkreisverteiler ein",
} satisfies PictureContent;

export const heidi = {
	pill: "Mit Heidi",
	h2: "Alles rund um Ihre Liegenschaft. Aus einer Hand.",
	text: "Funkzähler, Heizkostenabrechnung und Prüfungen wie der hydraulische Abgleich: Mit Heidi haben Sie für alles einen festen Ansprechpartner.",
	// 42U8uYryb6qXPWKZCWgkaZ (the Self-Service page)
	cta: { text: "Im Self-Service anfragen", href: ROUTE_SELF_SERVICE },
	price: { from: "ab", value: "800 €", unit: "netto pro Gebäude" },
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
		{ text: "Hydraulischer Abgleich", current: true },
		// No page yet: CUfAbZdQaBvnSBFxgLLWGU (Bleimessung)
		{ text: "Bleimessung" },
	] satisfies BundleItem[],
} satisfies HeidiContent;

export const faq = {
	title: "Häufige Fragen zum hydraulischen Abgleich",
	items: [
		{
			question: "Was ist ein hydraulischer Abgleich?",
			answer:
				"Jeder Heizkörper bekommt genau die Wassermenge, die er für seinen Raum braucht. Heizkörper nahe der Pumpe werden nicht mehr überversorgt, entfernte Räume werden nicht mehr zu kalt.",
		},
		{
			question: "Wer ist verpflichtet?",
			answer:
				"Eigentümer von Gebäuden mit mindestens sechs Wohnungen oder Nutzungseinheiten, nachdem dort eine wassergeführte Heizungsanlage eingebaut wurde (§ 60c GModG).",
		},
		{
			question: "Was bringt der Abgleich?",
			answer:
				"Ein gleichmäßig warmes Gebäude bei niedrigerer Vorlauftemperatur. Laut VdZ lässt sich der Energieverbrauch um bis zu 15 Prozent senken.",
		},
		{
			question: "Gilt die Pflicht auch für bestehende Heizungen?",
			answer:
				"§ 60c knüpft an den Einbau einer Anlage an. Für bestehende Anlagen in Gebäuden ab sechs Wohnungen gilt die Heizungsprüfung nach § 60b GModG mit eigenen Fristen.",
		},
		{
			question: "Was ist Verfahren B?",
			answer:
				"Beim Verfahren B werden die Einstellwerte auf Grundlage einer raumweisen Heizlastberechnung ermittelt. Das Verfahren ist für die Pflicht nach § 60c vorgeschrieben, sofern kein gleichwertiges Verfahren angewendet wird.",
		},
		{
			question: "Wird der Abgleich gefördert?",
			answer:
				"Gefördert wird er nur, wenn er nicht ohnehin gesetzlich vorgeschrieben ist, zum Beispiel in Gebäuden mit bis zu fünf Wohnungen. Das BAFA bezuschusst die Heizungsoptimierung mit 15 Prozent, mit individuellem Sanierungsfahrplan mit 20 Prozent.",
		},
		{
			question: "Ersetzt diese Seite eine Rechtsberatung?",
			answer:
				"Nein. Sie gibt einen Überblick über das Gebäudemodernisierungsgesetz (bis Juli 2026: Gebäudeenergiegesetz). Maßgeblich ist die jeweils geltende Fassung.",
		},
	],
} satisfies FaqContent;

export const closing = {
	h2: "Ist Ihre Anlage abgleichpflichtig? Wir klären das mit Ihnen.",
	// 2eHVk9HEFKh1F7pWbMnkWb (the Kontakt page)
	cta: { text: "Abgleich anfragen", href: ROUTE_KONTAKT },
};
