/**
 * Texts of /impressum, word for word from the design
 * (https://claude.ai/artifact/9JbCY6LgLwUC7NQNSh58o1), generated from
 * its HTML. The strings may hold trusted markup (`<br>`, `<a>`, `<b>`). The
 * legal statements await sign-off (ongoing-tasks/go-live-gates.md §1).
 */
import type { LegalPage } from "./types";

export const page: LegalPage = {
	pill: "Impressum",
	h1: "Impressum",
	lead: "Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG).",
	label: "Impressum",
	articles: [
		{
			id: "s-anbieter",
			num: "01",
			title: "Anbieter",
			body: [{ p: "Heidi Systems GmbH<br>Monbijouplatz 4<br>10178 Berlin" }],
		},
		{
			id: "s-vertretung",
			num: "02",
			title: "Vertreten durch",
			body: [{ p: "Geschäftsführer: Paul Gerlach" }],
		},
		{
			id: "s-kontakt",
			num: "03",
			title: "Kontakt",
			body: [
				{
					p: 'Telefon: <a href="tel:+493080098852">+49 30 80098852</a><br>E-Mail: <a href="mailto:info@heidisystems.com">info@heidisystems.com</a><br>Presse: <a href="mailto:presse@heidisystems.com">presse@heidisystems.com</a>',
				},
			],
		},
		{
			id: "s-register",
			num: "04",
			title: "Registereintrag",
			body: [
				{
					p: "Registergericht: Amtsgericht Berlin-Charlottenburg<br>Registernummer: HRB 259535 B",
				},
			],
		},
		{
			id: "s-ust",
			num: "05",
			title: "Umsatzsteuer",
			body: [
				{
					p: "Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: DE365219727",
				},
			],
		},
		{
			id: "s-verantwortlich",
			num: "06",
			title: "Verantwortlich für den Inhalt",
			law: "§ 18 Abs. 2 MStV",
			body: [{ p: "Paul Gerlach<br>Anschrift wie oben" }],
		},
		{
			id: "s-streit",
			num: "07",
			title: "Verbraucherstreitbeilegung",
			body: [
				{
					p: "Bei Streitigkeiten über die Belieferung mit Strom oder Gas können Verbraucher ein Schlichtungsverfahren bei der Schlichtungsstelle Energie e.V., Berlin, beantragen. Voraussetzung ist, dass zuvor der Kundenservice des Unternehmens angerufen und keine beidseitig zufriedenstellende Lösung gefunden wurde. Die Heidi Systems GmbH ist zur Teilnahme an diesem Verfahren verpflichtet.",
				},
				{
					p: "Im Übrigen ist die Heidi Systems GmbH nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle nach dem Verbraucherstreitbeilegungsgesetz teilzunehmen.",
				},
			],
		},
		{
			id: "s-haftung",
			num: "08",
			title: "Haftung für Inhalte und Links",
			body: [
				{
					p: "Die Inhalte dieser Website werden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte übernehmen wir jedoch keine Gewähr. Verbindliche Aussagen zu Leistungen, Preisen und technischen Spezifikationen ergeben sich ausschließlich aus individuellen Vertragsverhältnissen.",
				},
				{
					p: "Der Nutzung der im Impressum veröffentlichten Kontaktdaten zur Übersendung nicht ausdrücklich angeforderter Werbung wird widersprochen. Rechtliche Schritte im Fall unverlangt zugesandter Werbeinformationen behalten wir uns vor.",
				},
				{
					p: "Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich.",
				},
			],
		},
		{
			id: "s-urheber",
			num: "09",
			title: "Urheberrecht",
			body: [
				{
					p: "Die auf dieser Website verwendeten Texte, Marken, Darstellungen und technischen Inhalte sind urheberrechtlich geschützt. Eine Verwendung außerhalb der Grenzen des Urheberrechts bedarf der vorherigen schriftlichen Zustimmung der Heidi Systems GmbH. Teilweise werden Bilder Dritter verwendet. Auf dieser Website genannte Marken sind, soweit nicht anders angegeben, eingetragene Marken der Heidi Systems GmbH.",
				},
			],
		},
	],
};
