/**
 * Texts of /presse, word for word from the design
 * (https://claude.ai/artifact/2HKfqpmyVhcXiJWmoomtHP), and its four
 * downloads. The company claims, the boilerplate and the press mailbox await
 * sign-off (plan §4.4).
 */
import { DEMO_HREF } from "$lib/landing/cta";

export const PRESS_EMAIL = "presse@heidisystems.com";
export const PRESS_MAILTO = `mailto:${PRESS_EMAIL}`;

export const hero = {
	h1: "Hallo,",
	h1Accent: "Presse.",
	lead: "Heidi Systems ist ein Messdienst aus Berlin. Wir digitalisieren die Heizkostenabrechnung für Hausverwaltungen in ganz Deutschland: mit eigenen Funkzählern, einem persönlichen Ansprechpartner und einer Abrechnung per Klick. Hier finden Sie alles für Ihre Berichterstattung.",
};

export const contact = {
	tag: "Sag Hallo",
	h2: "Sprechen Sie mit uns.",
	text: "Interviews, Hintergrundgespräche, Zahlen und Bilder: Wir melden uns schnell und persönlich.",
	mailLabel: "Presseanfragen",
	// 44SBXKXJaSp6bvGMnbpZj6 ("Demo buchen"): /demo-buchen.
	cta: { text: "Gespräch vereinbaren", href: DEMO_HREF },
};

export type Download = {
	title: string;
	note: string;
	/** File name in `static/landing/presse/`, also the saved name. */
	file: string;
};

/** Where the downloads are served (`static/landing/presse/`). */
export const DOWNLOAD_BASE = "/landing/presse/";

export const kit = {
	tag: "Media Kit",
	h2: "Material für Ihre Berichterstattung.",
	text: "Logo, Bildmarke und Unternehmensprofil, sofort nutzbar.",
	downloads: [
		{
			title: "Heidi Logo, dunkel",
			note: "SVG · für helle Hintergründe",
			file: "Heidi-Logo-dunkel.svg",
		},
		{
			title: "Heidi Logo, hell",
			note: "SVG · für dunkle Hintergründe",
			file: "Heidi-Logo-hell.svg",
		},
		{
			title: "Bildmarke",
			note: "SVG · der Röhrenheizkörper",
			file: "Heidi-Bildmarke.svg",
		},
		{
			title: "Unternehmensprofil",
			note: "TXT · Kurztext und Fakten",
			file: "Heidi-Systems-Unternehmensprofil.txt",
		},
	] satisfies Download[],
	/** Followed by the file name once a download starts. */
	saved: "Gespeichert: ",
};

export const name = {
	h2: "Name und Logo.",
	/** "Heizungen digitalisieren.": the parts, the accented ones marked. */
	big: [
		{ text: "Hei", accent: true },
		{ text: "zungen " },
		{ text: "di", accent: true },
		{ text: "gitalisieren." },
	],
	text: "Der Name Heidi ist eine Abkürzung und zugleich unser Auftrag: Heizungen digitalisieren. Das Logo zeigt einen alten Röhrenheizkörper. Er steht für den Bestand, den wir modernisieren, ohne dass jemand umbauen muss.",
	markLabel: "Röhrenheizkörper",
};

export type Fact = {
	label: string;
	/** The figure as text, or a number that counts up, with its unit. */
	value: string | { count: number; unit: string };
	text: string;
};

/** The company, as the design writes it (`content.test.ts` checks it against the footer's `ADDRESS`). */
export const COMPANY = {
	name: "Heidi Systems GmbH",
	street: "Monbijouplatz 4",
	city: "10178 Berlin",
};
const address = `${COMPANY.street}, ${COMPANY.city}`;

export const facts = {
	h2: "Heidi auf einen Blick.",
	items: [
		{ label: "Unternehmen", value: COMPANY.name, text: address },
		{
			label: "Leistung",
			value: "Messdienst",
			text: "Funkzähler, Ablesung, monatliche Verbrauchsinfo und Heizkostenabrechnung aus einer Hand",
		},
		{
			label: "Montage",
			value: { count: 92, unit: "%" },
			text: "der Montagen gelingen beim ersten Termin",
		},
		{
			label: "Mieter",
			value: { count: 14, unit: "Tage" },
			text: "vorher über die Montage informiert, mit 1 bis 2 Stunden Zeitfenster",
		},
		{
			label: "Daten",
			value: "Deutschland",
			text: "Verarbeitung nach DSGVO und BDSG, gespeichert auf Servern in Deutschland",
		},
		{
			label: "Netzwerk",
			value: "VDIV · DEUMESS · bved",
			text: "Kooperationspartner des VDIV, vernetzt in den Verbänden DEUMESS und bved",
		},
	] satisfies Fact[],
};

export const boilerplate = {
	h2: "Über Heidi Systems.",
	copy: "Text kopieren",
	copied: "Kopiert",
	/** The screen reader's status after copying (not in the design). */
	status: "Text kopiert",
	text: "Die Heidi Systems GmbH mit Sitz in Berlin ist ein digitaler Messdienst für Hausverwaltungen in ganz Deutschland. Heidi installiert eigene Funkzähler, liest sie aus der Ferne ab, stellt Mietern jeden Monat ihre Verbrauchsinformation bereit und erstellt die Heizkostenabrechnung nach Heizkostenverordnung per Klick. Bestehende Zähler übernimmt Heidi sofort, auch wenn der bisherige Vertrag noch läuft. Alle Daten werden nach DSGVO verarbeitet und auf Servern in Deutschland gespeichert. Der Name steht für „Heizungen digitalisieren“.",
};

export const pressContact = {
	tag: "Pressekontakt",
	h2: "Für Interviews, Material und Anfragen.",
	address: [COMPANY.name, address],
	cta: { text: "E-Mail senden", href: PRESS_MAILTO },
};

export const closing = {
	h2: "Heidi live erleben?",
	text: "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.",
	/** The video button (the design's .dcta-b) → the booking page. */
	button: {
		text: "Live Demo buchen",
		sub: "Mit Ihrem Ansprechpartner",
		href: DEMO_HREF,
	},
};
