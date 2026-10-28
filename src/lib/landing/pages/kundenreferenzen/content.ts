/**
 * Every text of /kunden/referenzen, word for word from the design
 * (https://claude.ai/artifact/WcCFaQRPZKfbE5zFHQnnYd). Components hold markup
 * and behaviour only. The quotes are the shared `testimonials`, the logos the
 * shared `customerLogos` and the cities `CITIES`.
 *
 * The topics, the "Dahinter bei Heidi" lines and the figures need sign-off
 * before the cutover (go-live gate §2).
 */
import { DEMO_HREF } from "$lib/landing/cta";
import type { Testimonial } from "$lib/landing/data/testimonials";
import { ROUTE_HOME } from "$lib/routes";

/** The detail section; the hero's "Alle Stimmen lesen" leads here. */
export const VOICES_ID = "stimmen";

export const hero = {
	pill: "Kundenreferenzen",
	h1: "Was Verwaltungen über Heidi",
	h1Accent: "sagen.",
	lead: "Hausverwaltungen in ganz Deutschland rechnen mit Heidi ab. Hier kommen sie selbst zu Wort.",
	demo: { text: "Demo buchen", href: DEMO_HREF },
	voices: { text: "Alle Stimmen lesen", href: `#${VOICES_ID}` },
};

/** The hero's carousel (the design's `#rf-rot`). */
export const carousel = {
	label: "Kundenstimmen",
	badge: "Verifizierte Kundenstimme",
	dot: (n: number) => `Stimme ${n}`,
	prev: "Vorherige Stimme",
	next: "Nächste Stimme",
	/** Each quote's time before the next, ms. */
	duration: 7000,
	order: ["werne", "vitolus", "gerhard"] satisfies Testimonial["key"][],
};

export const wall = {
	pill: "Unsere Kunden",
	h2: "Sie rechnen bereits",
	h2Accent: "mit Heidi ab.",
};

export type Case = {
	key: Testimonial["key"];
	/** The company's name in the card's head; Werne shows its logo instead. */
	name?: string;
	topic: string;
	how: string[];
	dark?: boolean;
};

export const cases = {
	pill: "Stimmen im Detail",
	h2: "Drei Verwaltungen,",
	h2Accent: "drei Gründe.",
	howLabel: "Dahinter bei Heidi",
	items: [
		{
			key: "werne",
			topic: "Ablesung",
			how: [
				"Ablesung per Funk, ohne Termin in der Wohnung",
				"Mieter werden 14 Tage vor der Montage informiert",
			],
		},
		{
			key: "vitolus",
			name: "Vitolus GmbH",
			topic: "Transparenz",
			how: [
				"Dashboard mit allen Verbräuchen",
				"Monatliche Verbrauchsinfo automatisch an alle Mieter",
			],
			dark: true,
		},
		{
			key: "gerhard",
			name: "Gerhard Real Estate Management",
			topic: "Gewerbe",
			how: ["Alles aus einer Hand", "92 % der Montagen beim ersten Termin"],
		},
	] satisfies Case[],
};

export type Figure = {
	/** Counted up from 0 when it comes into view; `text` stays as written. */
	to?: number;
	text?: string;
	unit?: string;
	label: string;
	dark?: boolean;
};

export const figures = {
	pill: "Worauf sich Kunden verlassen",
	h2: "Weniger Aufwand am Montagetag.",
	h2Accent: "Für alle.",
	items: [
		{
			to: 92,
			unit: "%",
			label: "der Montagen gelingen beim ersten Termin",
			dark: true,
		},
		{ to: 14, unit: "Tage", label: "vorher werden die Mieter informiert" },
		{
			text: "1–2",
			unit: "Std.",
			label: "Zeitfenster für Mieter am Montagetag",
		},
		{ to: 1, label: "fester Ansprechpartner für Ihre Verwaltung" },
	] satisfies Figure[],
};

export const cities = {
	pill: "Heidi in Ihrer Stadt",
	h2: "Für Hausverwaltungen",
	h2Accent: "in ganz Deutschland.",
	search: "Stadt suchen",
	newBadge: "neu",
	/** The last tile: the Germany hub. */
	all: { text: "Ganz Deutschland", href: ROUTE_HOME },
	none: "Keine eigene Seite für diese Stadt. Heidi ist trotzdem für Sie da:",
	noneLink: { text: "Demo buchen", href: DEMO_HREF },
};

export const closing = {
	h2: "Werden Sie unsere nächste Referenz.",
	text: "Sehen Sie in einer Demo, wie Heidi mit Ihrem Bestand arbeitet.",
	cta: { text: "Demo buchen", href: DEMO_HREF },
};
