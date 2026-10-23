/**
 * Copy of /neuigkeiten, word for word from the design
 * (https://claude.ai/artifact/NYTT6YZc4aDeDZiWTfd6yG).
 *
 * A story or row whose target has no page yet has no `more` / `href`: it
 * renders without a link. Every item names its target's design id in a
 * comment, so the job that builds that page finds it here and links it
 * (plan README, Links).
 */
import { DEMO_HREF } from "$lib/landing/cta";
import type { SplitHeading } from "$lib/landing/types";
import {
	ROUTE_API_DOKUMENTATION,
	ROUTE_AUSWERTUNG,
	ROUTE_BLOG,
	ROUTE_DASHBOARD,
	ROUTE_FRISTENRECHNER,
	ROUTE_FUNKTIONEN,
	ROUTE_GERAETE,
	ROUTE_INSTALLATIONSTOOL,
	ROUTE_MIETERPORTAL,
	ROUTE_NACHFOLGE,
	ROUTE_PARTNERSCHAFTEN,
	ROUTE_UPGRADE_NOW,
	ROUTE_VERBRAUCHSINFORMATION,
	ROUTE_PORTFOLIO_CHECKER,
} from "$lib/routes";

/** The filter's topics (the design's `data-t`). */
export type Topic = "p" | "w" | "u";

/** Keys of the story photos (`photos.ts`). */
export type PhotoKey =
	| "office"
	| "kitchenMeters"
	| "installer"
	| "consultation"
	| "buildingWide"
	| "portalTenant"
	| "uviTenant"
	| "portfolioChecker"
	| "beratung"
	| "manager";

export type Story = {
	topic: Topic;
	title: string;
	/** Only the featured story has a text. */
	text?: string;
	photo: PhotoKey;
	/** The "more" line and the card's link; none while the page is missing. */
	more?: { text: string; href: string };
};

export const TOPIC_LABELS: Record<Topic, string> = {
	p: "Produkt",
	w: "Werkzeuge",
	u: "Unternehmen",
};

const featuredStory: Story = {
	topic: "p",
	title:
		"Heidi Auswertung: Verbrauch, Kosten und Auffälligkeiten auf einen Blick",
	text: "Kennzahlen je Liegenschaft, Vergleich zum Vorjahr und Hinweise wie der Leckage-Wächter, direkt aus den Funkdaten.",
	photo: "office",
	more: { text: "Zur Auswertung", href: ROUTE_AUSWERTUNG },
};

export const hero = {
	pill: "Neuigkeiten",
	h1: "Neuigkeiten",
	h1Accent: "von Heidi.",
	lead: "Neue Funktionen, kostenlose Werkzeuge und Partnerschaften auf einen Blick. Damit Sie wissen, was sich für Ihre Verwaltung ändert.",
	featured: {
		badge: "Neu",
		story: featuredStory,
	},
};

const stories: Story[] = [
	{
		topic: "p",
		title:
			"Leckage-Wächter im Dashboard: Auffälliger Wasserverbrauch wird gemeldet",
		photo: "kitchenMeters",
		// Hnv5z6cFcw3DyXPkw9nQx1
		more: { text: "Zum Dashboard", href: ROUTE_DASHBOARD },
	},
	{
		topic: "p",
		title:
			"Installationstool: Ein Termin in der Wohnung, alles digital dokumentiert",
		photo: "installer",
		// JevEa3P3wSURqiTTH4R39n
		more: { text: "Mehr erfahren", href: ROUTE_INSTALLATIONSTOOL },
	},
	{
		topic: "p",
		title: "Heizkostenabrechnung auf Knopfdruck, Rechnungen per DocuScan",
		photo: "consultation",
		// H4cZtgYCsvL4h7HGxZaHBs, as the landing footer's "Heizkostenabrechnung".
		more: { text: "Mehr erfahren", href: ROUTE_FUNKTIONEN },
	},
	{
		topic: "p",
		title:
			"Funkzähler im Überblick: Heizkostenverteiler, Wasserzähler und Rauchwarnmelder",
		photo: "buildingWide",
		more: { text: "Mehr erfahren", href: ROUTE_GERAETE },
	},
	{
		topic: "p",
		title: "Mieterportal: Verbrauch und Termine für Ihre Mieter an einem Ort",
		photo: "portalTenant",
		// 5HTo3o7mYMjqUxPXcEyuEy
		more: { text: "Mehr erfahren", href: ROUTE_MIETERPORTAL },
	},
	{
		topic: "p",
		title: "Heidi API: Die Dokumentation für Softwarepartner",
		photo: "uviTenant",
		// 3AZnpE4apaUo694utixF1d
		more: { text: "Zur API-Dokumentation", href: ROUTE_API_DOKUMENTATION },
	},
	{
		topic: "w",
		title: "Portfolio-Checker: Vertragsenden im ganzen Bestand prüfen",
		photo: "portfolioChecker",
		// UFviBtC2mkneFNeWnfHAWp
		more: { text: "Bestand prüfen", href: ROUTE_PORTFOLIO_CHECKER },
	},
	{
		topic: "u",
		title:
			"Nachfolge: Messdienstanbieter finden mit Heidi einen seriösen Nachfolger",
		photo: "beratung",
		// L4T9Q3Z4f84fJhLMXjnkms
		more: { text: "Mehr erfahren", href: ROUTE_NACHFOLGE },
	},
	{
		topic: "u",
		title: "Partnerschaften: Mit Heidi zusammenarbeiten",
		photo: "manager",
		// 9dRgZ8Vw3ictqCvi3C7MAF
		more: { text: "Mehr erfahren", href: ROUTE_PARTNERSCHAFTEN },
	},
];

export const news = {
	h2: "Neueste Meldungen",
	filterLabel: "Thema filtern",
	allLabel: "Alle",
	stories,
	// 6M1zyvE5ffoRT8imqjw6Ae
	blog: { text: "Zum Blog mit allen Artikeln", href: ROUTE_BLOG },
};

export type DeadlineIcon = "wifi" | "doc" | "calc" | "clock";

export const deadlines: {
	pill: string;
	h2: SplitHeading;
	rows: { icon: DeadlineIcon; title: string; text: string; href?: string }[];
} = {
	pill: "Gesetz & Fristen",
	h2: {
		text: "Was die Heizkostenverordnung verlangt. ",
		muted: "Und bis wann.",
	},
	rows: [
		{
			icon: "wifi",
			title: "Fernablesbar bis Ende 2026",
			text: "Zähler und Heizkostenverteiler, § 5 HeizkostenV",
			// Jp8tqY82m7FZqMnWU4z9x9
			href: ROUTE_UPGRADE_NOW,
		},
		{
			icon: "doc",
			title: "Monatliche Verbrauchsinformation",
			text: "Seit 2022 bei fernablesbaren Geräten, § 6a HeizkostenV",
			// JjGPJV7zurEwiwEMn4hJv9
			href: ROUTE_VERBRAUCHSINFORMATION,
		},
		{
			icon: "calc",
			title: "CO₂-Kosten aufteilen",
			text: "Seit 2023 zwischen Vermieter und Mieter, CO2KostAufG",
			// H4cZtgYCsvL4h7HGxZaHBs, as the landing footer's "Heizkostenabrechnung".
			href: ROUTE_FUNKTIONEN,
		},
		{
			icon: "clock",
			title: "Fristenrechner",
			text: "Kündigungs- und Eichfristen berechnen",
			// LWEbZPCoSDLT1D59BaULyE
			href: ROUTE_FRISTENRECHNER,
		},
	],
};

export const closing = {
	h2: "Neugierig, wie Heidi für Ihren Bestand aussieht?",
	text: "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.",
	/** The video button (the design's .dcta-b) → the booking page. */
	button: {
		text: "Live Demo buchen",
		sub: "Mit Ihrem Ansprechpartner",
		href: DEMO_HREF,
	},
};
