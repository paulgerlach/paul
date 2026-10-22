/**
 * /self-service's copy, word for word from the design (Self-Service,
 * 42U8uYryb6qXPWKZCWgkaZ). The Zählercheck's own texts are in
 * `wizard/data.ts`.
 */
import { DEMO_HREF } from "$lib/landing/cta";
import type { FaqItem } from "$lib/landing/faqJsonLd";

export const hero = {
	pill: "Self-Service · kostenlos und unverbindlich",
	h1: "Ihr Zählerbedarf.",
	h1Accent: "In wenigen Minuten erfasst.",
	lead: "Für kleinere Bestände: Sie beantworten ein paar einfache Fragen oder laden Ihre letzte Heizkostenabrechnung hoch. Heidi stellt daraus Ihre Geräteliste, die Gateway-Planung und einen vorläufigen Kostenvoranschlag zusammen.",
	start: { text: "Zählercheck starten", href: "#check" },
	how: { text: "So funktioniert es", href: "#so" },
	ticks: [
		"Keine Zählermodelle nötig",
		"Fotos statt Fachbegriffe",
		"Ergebnis sofort",
	],
};

/** The hero's example check: its rows and the photo each one counts into. */
export const heroCheck = {
	title: "Ihr Zählercheck",
	badge: "Beispiel",
	rows: [
		{ label: "Kaltwasserzähler", n: 12, photo: "kwz" },
		{ label: "Warmwasserzähler", n: 1 },
		{ label: "Wärmemengenzähler", n: 6, photo: "wmz" },
		{ label: "Heizkostenverteiler", n: 54, photo: "hkv" },
		{ label: "Funk-Gateway", n: 1, gateway: true },
	],
	done: "Geräteliste und Kostenvoranschlag erstellt",
} as const;

export const ways = {
	pill: "So funktioniert es",
	h2: "Zwei Wege, ein Ergebnis.",
	h2Accent: "Sie wählen, was Ihnen leichter fällt.",
	items: [
		{
			kicker: "Weg A",
			title: "Abrechnung hochladen",
			text: "Sie haben Ihre letzte Heizkostenabrechnung? Dann laden Sie sie als PDF oder Foto hoch. Heidi übernimmt die Angaben zu Ihren Zählern daraus, Sie ergänzen nur noch wenige Punkte.",
			time: "etwa 2 Minuten",
			icon: "clock",
		},
		{
			kicker: "Weg B",
			title: "Fragen beantworten",
			text: "Keine Abrechnung zur Hand? Wir führen Sie Schritt für Schritt durch Ihre Geräte und die Einbausituation, mit Skizzen und optionalen Fotos statt Fachbegriffen.",
			time: "etwa 5 bis 8 Minuten",
			icon: "clock",
		},
		{
			kicker: "Ergebnis",
			title: "Ihr persönlicher Zählercheck",
			text: "Geräteliste mit Stückzahlen, Gateway-Planung, vorläufiger Kostenvoranschlag und die offenen Prüfpunkte. Auf Wunsch schicken Sie alles direkt an Heidi.",
			time: "sofort sichtbar",
			icon: "check",
			end: true,
		},
	],
} as const;

export const faq: { title: string; items: FaqItem[] } = {
	title: "Häufige Fragen zum Self-Service",
	items: [
		{
			question: "Ist das Ergebnis verbindlich?",
			answer:
				"Nein. Der Zählercheck ist eine technische Vorauswahl mit vorläufigen Preisen. Die genaue Geräteauswahl und die Montage bestätigt Heidi nach Prüfung.",
		},
		{
			question: "Was passiert mit meinen Angaben?",
			answer:
				"Sobald Ihr Angebot erstellt ist, übermitteln wir Ihre Angaben an Heidi, damit wir es prüfen können. Dateien und Fotos bleiben auf Ihrem Gerät, bis Sie sie uns schicken.",
		},
		{
			question: "Ich habe schon Funkzähler. Kann Heidi sie übernehmen?",
			answer:
				"Oft ja. Ob vorhandene Funkzähler übernommen werden können, hängt unter anderem von Funkprotokoll, Zugangsschlüsseln und Vertragslage ab. Das prüft Heidi für jede Gerätegruppe.",
		},
		{
			question: "Mein Vertrag mit dem bisherigen Messdienst läuft noch.",
			answer:
				"Kein Problem. Heidi kann vorhandene Zähler übernehmen und auswerten, egal wie lange der bisherige Vertrag noch läuft. Tragen Sie Ihre Vertragsenden einfach im Zählercheck ein, falls bekannt.",
		},
		{
			question: "Muss ich technische Begriffe kennen?",
			answer:
				"Nein. Unbekannte Angaben dürfen offen bleiben. Skizzen und Fotos helfen, den Rest klärt Heidi mit Ihnen.",
		},
	],
};

export const closing = {
	h2: "Lieber persönlich über Ihren Bestand sprechen?",
	text: "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands.",
	button: {
		text: "Demo buchen",
		sub: "Mit Ihrem Ansprechpartner",
		href: DEMO_HREF,
	},
};
