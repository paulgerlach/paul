/**
 * Every text of /ueber-uns ("Über uns"), word for word from the design.
 * Components hold markup and behaviour only; the day count comes from
 * `$lib/landing/deadline/deadline.ts`.
 *
 * The company claims, the founder's role and the careers target need sign-off
 * before go-live (plan §4.5). The `expired` texts are placeholders until the
 * content owner writes them.
 */
import { CAREERS_HREF, CAREERS_JOBS_HREF, DEMO_HREF } from "$lib/landing/cta";
import type { Testimonial } from "$lib/landing/data/testimonials";
import type { SplitHeading } from "$lib/landing/types";
import { ROUTE_UPGRADE_NOW } from "$lib/routes";

const nbsp = " ";

export type Link = { text: string; href: string };

export const hero = {
	pill: "Über Heidi Systems",
	/** H1: text + the green `<em>` part. */
	h1: { text: "Messdienst, wie er heute", em: "sein sollte." },
	lead: "Heidi Systems ist ein PropTech aus Berlin. Wir übernehmen für Hausverwaltungen den kompletten Messdienst aus einer Hand: eigene Funkzähler, kostenlose Installation, Ablesung per Funk und die Heizkostenabrechnung auf Knopfdruck.",
	cta: { text: "Demo buchen", href: DEMO_HREF } satisfies Link,
	careers: { text: "Karriere bei Heidi", href: CAREERS_HREF } satisfies Link,
	ticks: [
		"Sitz in Berlin",
		"Kunden in ganz Deutschland",
		"Hardware und Software aus einer Hand",
	],
};

export type ServiceIcon = "meter" | "install" | "radio" | "bell" | "invoice";

export const services = {
	label: "Alles, was Heidi übernimmt",
	title: "Was Heidi übernimmt",
	replay: "Animation wiederholen",
	items: [
		{
			icon: "meter",
			title: "Funkzähler",
			sub: "Heizkostenverteiler, Wärme- und Wasserzähler",
		},
		{
			icon: "install",
			title: "Installation",
			sub: "Kostenlos, Mieter 14 Tage vorher informiert",
		},
		{
			icon: "radio",
			title: "Ablesung",
			sub: "Per Funk, ohne Termin in der Wohnung",
		},
		{
			icon: "bell",
			title: "Verbrauchsinfo",
			sub: "Jeden Monat automatisch an alle Mieter",
		},
		{
			icon: "invoice",
			title: "Heizkostenabrechnung",
			sub: "Per Klick, nach HKVO",
		},
	] satisfies { icon: ServiceIcon; title: string; sub: string }[],
	one: {
		title: "Ein Partner für alles",
		sub: "Ein Ansprechpartner, ein Dashboard",
	},
};

export const logoStripText =
	"Hausverwaltungen in ganz Deutschland arbeiten bereits mit Heidi.";

export const mission = {
	eyebrow: "Unsere Mission",
	h2: {
		text: "Jeder Zähler fernablesbar. ",
		muted: "Ohne Aufwand für die Verwaltung.",
	} satisfies SplitHeading,
	lead: `Ab dem 1.${nbsp}Januar 2027 müssen Zähler und Heizkostenverteiler aus der Ferne ablesbar sein. Für viele Verwaltungen heißt das: Bestände umrüsten, Verträge prüfen, Mieter informieren. Wir haben Heidi gebaut, damit dieser Umstieg mit einer Unterschrift erledigt ist.`,
	/** Placeholder (plan §3.2): replaces `lead` once the deadline has passed. */
	leadExpired: `Seit dem 1.${nbsp}Januar 2027 müssen Zähler und Heizkostenverteiler aus der Ferne ablesbar sein. Wer noch nicht umgerüstet hat, riskiert Kürzungen bei jeder Abrechnung. Mit Heidi ist der Umstieg weiterhin mit einer Unterschrift erledigt.`,
	link: {
		text: "Mehr zur Umrüstpflicht",
		href: ROUTE_UPGRADE_NOW,
	} satisfies Link,
	card: {
		label: "Bis zur Fernablesepflicht",
		unit: "Tage",
		/** Shown instead of "0 Tage" on 31.12.2026. */
		lastDay: "Letzter Tag",
		from: "Heute",
		to: "1.1.2027",
		/** Placeholder (plan §3.2): replaces the label and number once expired. */
		expired: "Seit 1.1.2027 Pflicht",
	},
};

export type Principle = {
	title: string;
	sub: string;
	text: string;
	points: [string, string, string];
	/** Link after the text; the design's links have no page yet (README). */
	link?: Link;
};

export const principles = {
	eyebrow: "Wofür wir stehen",
	h2: { text: "Vier Grundsätze. ", muted: "Jeden Tag." } satisfies SplitHeading,
	items: [
		{
			title: "Einfach",
			sub: "Eine Unterschrift genügt",
			text: "Ein Messdienst darf keine Projektarbeit sein. Eine Unterschrift von Eigentümer oder Verwaltung genügt, um den Rest kümmern wir uns.",
			points: [
				"Kündigung beim bisherigen Anbieter per Vollmacht",
				"Montage und Mieterinformation organisiert Heidi",
				"Heizkostenabrechnung per Klick",
			],
		},
		{
			title: "Persönlich",
			sub: "Ein fester Ansprechpartner",
			text: "Sie sprechen mit Menschen, die Ihre Liegenschaften kennen. Ein fester Ansprechpartner begleitet Sie vom ersten Objekt bis zur laufenden Abrechnung.",
			points: [
				"Fester Kontakt für Ihre Verwaltung",
				"Mieter werden 14 Tage vor der Montage informiert",
				"Zeitfenster von 1 bis 2 Stunden am Montagetag",
			],
		},
		{
			title: "Transparent",
			sub: "Alle Verbräuche im Blick",
			text: "Verbräuche gehören nicht in Aktenordner. Im Heidi Dashboard sehen Sie alle Liegenschaften, und Ihre Mieter bekommen jeden Monat ihre Verbrauchsinformation.",
			points: [
				"Alle Liegenschaften in einem Dashboard",
				"Monatliche Verbrauchsinfo automatisch an alle Mieter",
				"Daten direkt in Ihrem ERP- oder CRM-System",
			],
		},
		{
			title: "Ohne Warten",
			sub: "Wechsel auch bei laufendem Vertrag",
			text: "Niemand sollte auf ein Vertragsende warten müssen. Heidi übernimmt und wertet bestehende Zähler aus, egal wie lange Ihr aktueller Vertrag noch läuft.",
			points: [
				"Bestehende Zähler werden sofort ausgewertet",
				"Wechsel unabhängig vom Vertragsende",
				"Vertragsenden im ganzen Bestand prüfen",
			],
		},
	] satisfies Principle[] as Principle[],
};

export type NumberTile = {
	/** Shown as is (SSR, no JS, reduced motion). */
	value: string;
	unit: string;
	label: string;
	dark?: boolean;
	/** Counted up from 0 on view. */
	countTo?: number;
};

export const numbers = {
	eyebrow: "Worauf Sie sich verlassen",
	h2: {
		text: "Weniger Aufwand am Montagetag. ",
		muted: "Für alle.",
	} satisfies SplitHeading,
	items: [
		{
			value: "92",
			unit: "%",
			label: "der Montagen gelingen beim ersten Termin",
			dark: true,
			countTo: 92,
		},
		{
			value: "14",
			unit: "Tage",
			label: "vorher werden die Mieter informiert",
			countTo: 14,
		},
		{
			value: "1–2",
			unit: "Std.",
			label: "Zeitfenster für Mieter am Montagetag",
		},
		{ value: "0", unit: "€", label: "Installationskosten für die Funkzähler" },
	] satisfies NumberTile[] as NumberTile[],
};

export const team = {
	name: "Paul Gerlach",
	/** Needs confirmation (plan open question 4). */
	role: "Gründer und Geschäftsführer",
	initials: "PG",
	location: "Berlin",
	eyebrow: "Das Team",
	h2: {
		text: "Aus Berlin. ",
		muted: "Für Verwaltungen in ganz Deutschland.",
	} satisfies SplitHeading,
	lead: "Heidi Systems wird von Gründer und Geschäftsführer Paul Gerlach geführt. Unser Team in Berlin entwickelt Zähler-Anbindung, Dashboard und Abrechnung selbst. Vor Ort arbeiten wir mit Installationspartnern, damit Montagen planbar und pünktlich laufen.",
	testimonials: {
		text: "Kundenstimmen lesen",
		href: "#stimmen",
	} satisfies Link,
	jobs: { text: "Offene Stellen", href: CAREERS_JOBS_HREF } satisfies Link,
};

export const testimonials = {
	title: "Was Verwaltungen über Heidi sagen",
	keys: [
		"werne",
		"gerhard",
	] satisfies Testimonial["key"][] as Testimonial["key"][],
};

export const careers = {
	/** Hide the teaser and the career links if there are no open positions (open question 2). */
	show: true,
	eyebrow: "Wir wachsen",
	title: "Lust, den Messdienst mit uns neu zu bauen?",
	text: "Wir suchen Menschen, die Software, Hardware und Service zusammenbringen wollen.",
	cta: { text: "Zur Karriereseite", href: CAREERS_HREF } satisfies Link,
};

export const finalCta = {
	title: "Lernen Sie Heidi kennen.",
	submitLabel: "Demo buchen",
};
