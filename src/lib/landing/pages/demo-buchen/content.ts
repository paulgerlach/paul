/**
 * /demo, word for word from its design
 * (https://claude.ai/artifact/44SBXKXJaSp6bvGMnbpZj6): the hero with the
 * booking card, the logos, the four steps, the checklist, the quotes, the FAQ
 * and the closing card. Copy and claims need sign-off (go-live gate §2).
 */
import { START_HREF } from "$lib/landing/cta";
import { DEFAULT_LOGO_ORDER } from "$lib/landing/data/logos";
import type { Testimonial } from "$lib/landing/data/testimonials";
import type { FaqItem } from "$lib/landing/faqJsonLd";

/**
 * The Google Calendar booking page (the design's `GCAL`): "Freie Termine
 * ansehen" and every day of the card open it in a new tab.
 */
export const CALENDAR_URL = "https://calendar.app.google/SoRA89i76t4W28tNA";

export const hero = {
	pill: "Demo buchen",
	h1: "Sehen Sie Heidi mit Ihrem eigenen Bestand.",
	lead: "In einem persönlichen Gespräch zeigt Ihnen unser Team das Dashboard, prüft kostenlos die Vertragslaufzeiten Ihres Bestands und beantwortet alle Fragen zum Wechsel.",
	gets: [
		{
			title: "Live-Demo des Dashboards",
			text: "Verbräuche, Kosten und Abrechnungen Ihrer Objekte an einem Ort.",
		},
		{
			title: "Kostenloser Portfolio-Check",
			text: "Wir sehen gemeinsam, wann Ihre Messdienstverträge enden.",
		},
		{
			title: "Wechsel ohne Wartezeit",
			text: "Heidi übernimmt Ihre vorhandenen Zähler, egal wie lange der Vertrag noch läuft.",
		},
		{
			title: "Klare Kosten",
			text: "Abgerechnet wird pro installiertem Zähler plus Abrechnungspauschale.",
		},
	],
};

export const booking = {
	label: "Demo-Termin buchen",
	avatarAlt: "Ihre Ansprechpartnerin bei Heidi",
	title: "Demo mit dem Heidi-Team",
	mode: "Video-Call oder Telefon · kostenlos",
	lead: "Wählen Sie Ihren Wunschtermin direkt in unserem Kalender. Freie Zeiten sehen Sie sofort.",
	daysLabel: "Die nächsten Werktage",
	steps: [
		{ title: "Termin wählen", text: "Tag und Uhrzeit, die Ihnen passen." },
		{ title: "Angaben eintragen", text: "Name und E-Mail-Adresse." },
		{ title: "Bestätigung erhalten", text: "Per E-Mail, mit Kalendereintrag." },
	],
	cta: { text: "Freie Termine ansehen", href: CALENDAR_URL },
	note: "Die Buchung öffnet sich in einem neuen Tab über Google Kalender.",
};

export const logos = {
	text: "Hausverwaltungen in ganz Deutschland rechnen bereits mit Heidi ab.",
	order: DEFAULT_LOGO_ORDER,
};

export const flow = {
	pill: "So läuft die Demo ab",
	h2: "Kein Pitch von der Stange.",
	h2Accent: "Ein Gespräch über Ihren Bestand.",
	steps: [
		{
			title: "Kennenlernen",
			text: "Wir hören zu: Bestand, Abläufe und was Sie heute Zeit kostet.",
		},
		{
			title: "Live-Dashboard",
			text: "Verbräuche, Kosten, Zählerstatus und die Heizkostenabrechnung per Klick, live gezeigt.",
		},
		{
			title: "Portfolio-Check",
			text: "Wann enden Ihre Messdienstverträge? Wir prüfen es gemeinsam und kostenlos.",
		},
		{
			title: "Nächste Schritte",
			text: "Sie bekommen ein konkretes Angebot und einen klaren Plan für den Wechsel.",
		},
	],
	/** Step 1's chat bubble. */
	question:
		"Wie viele Objekte betreuen Sie, und mit welchem Messdienst arbeiten Sie heute?",
	/** Step 2's bars, in percent of the tile's height; the fifth is highlighted. */
	bars: [62, 48, 74, 55, 88, 66],
	highlight: 4,
	/** Step 3's contract ends (example data), the bar's width in percent. */
	contracts: [
		{ name: "Lindenallee 12", width: 46 },
		{ name: "Bergmannstr. 4", width: 32 },
		{ name: "Am Stadtpark 7", width: 86 },
	],
	offer: {
		title: "Angebot für Ihren Bestand",
		text: "pro Zähler + Abrechnungspauschale",
	},
};

export const prep = {
	pill: "Vorbereitung",
	h2: "Nichts vorbereiten müssen. Aber können.",
	lead: "Die Demo funktioniert auch ganz ohne Unterlagen. Wenn Sie diese Punkte zur Hand haben, wird der Portfolio-Check noch konkreter.",
	items: [
		{
			title: "Anzahl Objekte und Wohneinheiten",
			text: "Eine grobe Zahl reicht völlig.",
		},
		{
			title: "Ihr aktueller Messdienst",
			text: "Und, falls zur Hand, die Vertragsunterlagen.",
		},
		{
			title: "Eine letzte Heizkostenabrechnung",
			text: "Optional, hilft beim Vergleich.",
		},
		{ title: "Ihre Fragen", text: "Zu Wechsel, Montage, Mietern oder Kosten." },
	],
	/** "0 von 4 abgehakt" */
	status: (n: number, of: number) => `${n} von ${of} abgehakt`,
	done: "Alles bereit. Wir freuen uns auf Sie.",
};

export const quotes = {
	title: "Was Verwaltungen über Heidi sagen",
	keys: ["vitolus", "gerhard"] satisfies Testimonial["key"][],
};

export const faq = {
	title: "Häufige Fragen zur Demo",
	items: [
		{
			question: "Kostet die Demo etwas?",
			answer:
				"Nein. Die Demo und der Portfolio-Check sind kostenlos und unverbindlich.",
		},
		{
			question: "Müssen wir bis zum Vertragsende warten?",
			answer:
				"Nein. Heidi übernimmt Ihre vorhandenen Zähler und rechnet ab, egal wie lange Ihr Vertrag noch läuft. Die Kündigung übernehmen wir mit Ihrer Vollmacht.",
		},
		{
			question: "Wie setzen sich die Kosten zusammen?",
			answer:
				"Abgerechnet wird pro tatsächlich installiertem Zähler, dazu eine Abrechnungspauschale. Ein konkretes Angebot für Ihren Bestand bekommen Sie nach dem Portfolio-Check.",
		},
		{
			question: "Wer sollte bei der Demo dabei sein?",
			answer:
				"Alle, die bei Ihnen mit Ablesung und Heizkostenabrechnung zu tun haben. Laden Sie Kolleginnen und Kollegen gern einfach mit ein.",
		},
	] satisfies FaqItem[] as FaqItem[],
};

export const closing = {
	h2: "Finden Sie jetzt Ihren Termin.",
	cta: { text: "Jetzt Termin wählen", href: START_HREF },
};
