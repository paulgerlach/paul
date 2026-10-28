/**
 * Every text and the example data of /partner/nachfolge, word for word from the
 * design, in the shapes of the shared `uv` template and the shared partner
 * section. Components hold markup and behaviour only.
 *
 * The succession offer as described, the confidentiality, the legal and
 * data-protection statements, the company claims, the form's texts and
 * options, and the example data need sign-off before the cutover (plan §4.4).
 */
import { PHONE, PHONE_HREF } from "$lib/company";
import { isExpired } from "$lib/landing/deadline/deadline";
import { DEMO_HREF } from "$lib/landing/cta";
import type { Testimonial } from "$lib/landing/data/testimonials";
import type { FaqItem } from "$lib/landing/faqJsonLd";
import type {
	ApplyContent,
	FormTexts,
} from "$lib/landing/sections/partner/types";
import { DEADLINE_FIGURE } from "$lib/landing/sections/uv/deadlineFigure";
import type {
	AppNavItem,
	BillTile,
	CalendarTile,
	DocTile,
	Figure,
	Link,
	ListEntry,
	PhoneTile,
	Row,
} from "$lib/landing/sections/uv/types";
import { ROUTE_PARTNERSCHAFTEN, ROUTE_SICHERHEIT } from "$lib/routes";

/** The contact form's section (the design's id). */
export const APPLY_ID = "kontakt";
/**
 * Every CTA to the form: the design's "Gespräch anfragen", but
 * not its "Demo buchen" and "Erstgespräch vereinbaren", which point at the
 * demo-booking design and so lead to /demo (`DEMO_HREF`).
 */
export const KONTAKT_HREF = `#${APPLY_ID}`;

const talkLink: Link = { text: "Gespräch anfragen", href: KONTAKT_HREF };

export const hero = {
	srTitle: "Nachfolge für Messdienstanbieter mit Heidi",
	word: "Nachfolge",
	/** The design's #ipf-css, as on the other partner pages. */
	wordSize: "clamp(34px, 8.6vw, 130px)",
	lead: "Sie führen einen Messdienst und suchen eine Nachfolge? Heidi führt Kunden, Geräte und Verträge verlässlich weiter.",
	primary: { text: "Kontakt aufnehmen", href: KONTAKT_HREF } satisfies Link,
	secondary: { text: "Mehr erfahren", href: "#inhalt" } satisfies Link,
};

/** The hero's app window: the hand-over of a metering business. */
export const list = {
	label: "Beispiel: Heidi Dashboard",
	brand: "Heidi",
	nav: [
		{ icon: "users", text: "Übergabe" },
		{ icon: "doc", text: "Dokumente" },
		{ icon: "users", text: "Kunden" },
	] satisfies AppNavItem[] as AppNavItem[],
	navFoot: "Heidi Dashboard",
	head: "Heidi Nachfolge",
	tag: "Beispieldaten",
	title: "Ihr Messdienst",
	sub: "Übergabe · Beispiel",
	entries: [
		{
			icon: "users",
			title: "Kundenbeziehungen",
			sub: "Persönlich übergeben",
			before: "In Vorbereitung",
			after: "Übergeben",
		},
		{
			icon: "meter",
			title: "Geräte und Zähler",
			sub: "Bestand übernommen",
			before: "Wird geprüft",
			after: "Übernommen",
		},
		{
			icon: "doc",
			title: "Laufende Verträge",
			sub: "Laufzeiten geprüft",
			before: "Wird geprüft",
			after: "Geklärt",
		},
		{
			icon: "check",
			title: "Abrechnungen",
			sub: "Nahtlos weitergeführt",
			before: "Wird erstellt",
			after: "Weitergeführt",
		},
	] satisfies ListEntry[] as ListEntry[],
};

export const statement = {
	label: "Worum es geht",
	text: "Ihre Kunden verlassen sich seit Jahren auf Sie. Wenn Sie eine Nachfolge suchen, führt Heidi Ihren Messdienst verlässlich weiter: Kunden, Geräte und Verträge. Diskret, persönlich und mit Respekt vor dem, was Sie aufgebaut haben.",
};

export type TileKind = "phone" | "doc" | "calendar" | "bill";

export const rows = {
	label: "So arbeitet Heidi",
	primary: talkLink,
	secondary: { text: "Häufige Fragen", href: "#faq" } satisfies Link,
	items: [
		{
			tag: "Vertraulich",
			title: ["Erst sprechen.", "Dann entscheiden."],
			paragraphs: [
				"Im ersten Gespräch hören wir zu: Wo steht Ihr Betrieb, was ist Ihnen wichtig, welchen Zeitrahmen haben Sie im Kopf?",
				"Das Gespräch ist unverbindlich und bleibt vertraulich. Ihre Kunden erfahren erst davon, wenn Sie es möchten.",
			],
			tile: "phone",
			tone: "ink",
		},
		{
			tag: "Übernahme",
			title: ["Kunden, Geräte", "und Verträge."],
			paragraphs: [
				"Heidi übernimmt bestehende Zähler und wertet sie aus. Laufende Verträge prüfen wir und führen sie geordnet weiter.",
				"So geht für Ihre Kunden kein Termin und keine Abrechnung verloren.",
			],
			tile: "doc",
			tone: "stone",
		},
		{
			tag: "Zukunft",
			title: ["Fernablesbar", "bis 2027."],
			paragraphs: [
				"Ab dem 1.1.2027 muss jeder Zähler fernablesbar sein. Wir planen die Umrüstung gemeinsam, Liegenschaft für Liegenschaft.",
				"Ihre Kunden bekommen Mieterportal, Dashboard und Heizkostenabrechnung auf Knopfdruck.",
			],
			tile: "calendar",
			tone: "mint",
		},
		{
			tag: "Gemeinsam",
			title: ["Ihr Modell.", "Ihr Zeitpunkt."],
			paragraphs: [
				"Ob einzelne Kundenbeziehungen, die Verträge oder der ganze Betrieb: Wir finden das Modell, das zu Ihnen passt.",
				"Und wir sprechen offen über das, was Ihnen wichtig ist, auch über Ihr Team.",
			],
			tile: "bill",
			tone: "mint",
		},
	] satisfies Row<TileKind>[] as Row<TileKind>[],
};

/** Row 1: the first conversation, booked. */
export const phone = {
	time: "9:41",
	app: "Heidi",
	title: "Erstgespräch vereinbart",
	sub: "Vertraulich · unverbindlich",
	label: "Ihr Ansprechpartner",
	value: "Persönlich",
	comparisons: ["Ein fester Kontakt von Anfang an"],
} satisfies PhoneTile;

/** Row 2: what the hand-over covers. */
export const doc = {
	title: "Übergabe Ihres Messdienstes",
	sub: "Beispiel",
	rows: [
		{ label: "Kundenbeziehungen" },
		{ label: "Geräte und Zählerbestand" },
		{ label: "Laufende Verträge" },
		{ label: "Offene Abrechnungen" },
	],
	result: "Nahtlos weitergeführt",
} satisfies DocTile;

/** Row 3: the properties retrofitted one by one. */
export const calendar: CalendarTile = {
	months: Array.from({ length: 9 }, (_, i) => `Liegensch. ${i + 1}`),
	current: 6,
	done: "umgerüstet",
	doing: "in Planung",
	open: "offen",
	noteDone: "{x} umgerüstet",
	noteDoing: "{x} in Planung",
};

/** Row 4: without a successor against with Heidi. */
export const bill = {
	without: "Ohne Nachfolge",
	with: "Mit Heidi",
	rows: [
		{
			kind: "cut",
			label: "Kunden suchen selbst neuen Anbieter",
			value: "unsicher",
		},
		{ kind: "cut", label: "Umrüstung bis 2027 offen", value: "offen" },
		{ kind: "ok", label: "Kunden persönlich übergeben" },
		{ kind: "ok", label: "Abrechnungen laufen weiter" },
	],
	sum: { label: "Ihr Lebenswerk", before: "offen", after: "in guten Händen" },
} satisfies BillTile;

export const rotator = {
	label: "Was Heidi übernimmt",
	lead: "Heidi übernimmt:",
	phrases: [
		"Kundenbeziehungen",
		"Geräte und Zähler",
		"Laufende Verträge",
		"Abrechnungen",
	],
	intervalMs: 2300,
};

/** The design's deadline figure; after the deadline the shared placeholder (plan §4.4). */
export const DEADLINE_CURRENT: Figure = {
	value: "1.1.2027",
	text: "Ab dann müssen alle Zähler fernablesbar sein",
	compact: true,
};

const REST: (Figure | null)[] = [
	{
		value: "15.000+",
		text: "Geräte hat Heidi bereits installiert",
		compact: true,
	},
	{ value: "DE", text: "Alle Daten auf Servern in Deutschland", compact: true },
	null,
	{
		value: "Diskret",
		text: "Vertraulich bis zu Ihrer Entscheidung",
		compact: true,
	},
];

export const numbers = {
	h2: "Nachfolge mit Heidi",
	/** The figure before the photo. None counts: every one is the design's `.dt`. */
	first: {
		value: "1:1",
		text: "persönlicher Ansprechpartner für den ganzen Prozess",
		compact: true,
	} satisfies Figure as Figure,
};

/** The bento's figures after the photo, with the deadline's figure for `now`. */
export function figures(now: number): Figure[] {
	const deadline = isExpired(now) ? DEADLINE_FIGURE.expired : DEADLINE_CURRENT;
	return REST.map((f) => f ?? deadline);
}

export type AudienceKey = "technician" | "consultation";

export const audience = {
	label: "Ihr Wechsel",
	cards: [
		{
			title: "Sie sind Messdienstanbieter?",
			text: "Lassen Sie uns vertraulich über Ihre Nachfolge sprechen. Ihr persönlicher Ansprechpartner meldet sich bei Ihnen.",
			cta: talkLink,
			image: "technician",
		},
		{
			title: "Mehr Partnerschaften?",
			text: "Softwareanbieter, Installationsbetriebe und Verbände arbeiten bereits mit Heidi zusammen.",
			// 9dRgZ8Vw3ictqCvi3C7MAF
			cta: { text: "Zu den Partnerschaften", href: ROUTE_PARTNERSCHAFTEN },
			image: "consultation",
		},
	] satisfies {
		title: string;
		text: string;
		cta: { text: string; href?: string };
		image: AudienceKey;
	}[],
};

export const quotes = {
	h2: ["Verlässlicher Messdienst.", "Unsere Kunden sagen es selbst."] as [
		string,
		string,
	],
	keys: [
		"werne",
		"vitolus",
		"gerhard",
	] satisfies Testimonial["key"][] as Testimonial["key"][],
};

export const picture = {
	label: "Heidi",
	caption: ["Ihr Lebenswerk.", "In guten Händen."] as [string, string],
};

/** The contact form's section: the steps beside the form. */
export const apply = {
	pill: "Für Messdienstanbieter",
	h2: ["Lassen Sie uns", "vertraulich sprechen."] as [string, string],
	text: "Erzählen Sie uns kurz von Ihrem Betrieb. Ihr persönlicher Ansprechpartner meldet sich bei Ihnen.",
	steps: [
		{ title: "Formular senden", text: "Vertraulich, ohne Verpflichtung." },
		{ title: "Erstgespräch", text: "Wir lernen uns und Ihren Betrieb kennen." },
		{ title: "Modell finden", text: "Übernahme, Zeitplan und Übergang." },
	],
	fields: {
		company: "Unternehmen",
		name: "Ihr Name",
		email: "E-Mail",
		phone: "Telefon",
		properties: {
			label: "Betreute Liegenschaften",
			placeholder: "Bitte wählen",
		},
		timeframe: { label: "Gewünschter Zeitraum", placeholder: "Bitte wählen" },
		message: { label: "Nachricht", optional: "(optional)" },
		consent:
			"Ich bin einverstanden, dass Heidi Systems meine Angaben zur Kontaktaufnahme verarbeitet.",
	},
	submit: "Gespräch anfragen",
	sending: "Wird gesendet …",
	missing: "Bitte füllen Sie die markierten Felder aus.",
	/** The success line; the design's own says the sending isn't live yet (plan §4.4). */
	success: (name: string) => `Danke, ${name}! Wir melden uns bei Ihnen.`,
	sendError: {
		text: "Das hat gerade nicht geklappt. Bitte versuchen Sie es noch einmal oder rufen Sie uns an:",
		phone: PHONE,
		phoneHref: PHONE_HREF,
	},
} satisfies ApplyContent & FormTexts & Record<string, unknown>;

export const faq = {
	title: "Häufige Fragen",
	items: [
		{
			question: "Bleibt unser Gespräch vertraulich?",
			answer:
				"Ja. Ihre Kunden und Ihr Umfeld erfahren erst davon, wenn Sie es möchten.",
		},
		{
			question: "Für welche Betriebe ist das interessant?",
			answer:
				"Für Messdienstanbieter, die eine Nachfolge für ihre Kunden suchen. Sprechen Sie uns an, ganz gleich, wie groß Ihr Betrieb ist.",
		},
		{
			question: "Was passiert mit den Geräten meiner Kunden?",
			answer:
				"Heidi übernimmt bestehende Zähler und wertet sie aus. Die Umrüstung auf fernablesbare Geräte planen wir gemeinsam.",
		},
		{
			question: "Wie lange dauert eine Nachfolge?",
			answer:
				"Das hängt von Ihrem Betrieb und Ihrem Wunschtermin ab. Im Erstgespräch klären wir einen realistischen Zeitplan.",
		},
		{
			question: "Wo liegen die Daten meiner Kunden?",
			answer: "Auf Servern in Deutschland, verarbeitet nach DSGVO und BDSG.",
			// Sb54rDQd5WS2r82skPe7UQ
			more: { text: "Mehr zu Sicherheit", href: ROUTE_SICHERHEIT },
		},
	] satisfies FaqItem[] as FaqItem[],
};

export const closing = {
	h2: "Ihr Lebenswerk. In guten Händen.",
	text: "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.",
	/** The video button (the design's .dcta-b) → the booking page. */
	button: {
		text: "Demo buchen",
		sub: "Mit Ihrem Ansprechpartner",
		href: DEMO_HREF,
	},
};
