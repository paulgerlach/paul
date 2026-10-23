/**
 * Texts of /datenschutz, word for word from the design
 * (https://claude.ai/artifact/Xd6h87fFYLF5hYyiqCT3By), generated from
 * its HTML. The strings may hold trusted markup (`<br>`, `<a>`, `<b>`). The
 * legal statements await sign-off (ongoing-tasks/go-live-gates.md §1).
 */
import type { LegalPage } from "./types";

export const page: LegalPage = {
	pill: "Datenschutz",
	h1: "Datenschutz\u00aderklärung",
	lead: "Wie Heidi Systems personenbezogene Daten verarbeitet, wenn Sie diese Website nutzen oder mit uns Kontakt aufnehmen.",
	label: "Datenschutz",
	articles: [
		{
			id: "s-verantwortlicher",
			num: "01",
			title: "Verantwortlicher",
			law: "Art. 4 Nr. 7 DSGVO",
			body: [
				{
					p: 'Heidi Systems GmbH<br>Monbijouplatz 4<br>10178 Berlin<br>Telefon: +49 30 80098852<br>E-Mail: <a href="mailto:info@heidisystems.com">info@heidisystems.com</a>',
				},
			],
		},
		{
			id: "s-grundsaetze",
			num: "02",
			title: "Unsere Grundsätze",
			body: [
				{
					p: "Heidi verarbeitet alle Daten nach den Vorgaben der Datenschutz-Grundverordnung (DSGVO) und des Bundesdatenschutzgesetzes (BDSG). Alle Daten liegen auf Servern in Deutschland. Verbindungen zu dieser Website sind per SSL/TLS verschlüsselt.",
				},
			],
		},
		{
			id: "s-logfiles",
			num: "03",
			title: "Aufruf der Website",
			law: "Art. 6 Abs. 1 lit. f DSGVO",
			body: [
				{
					p: "Beim Aufruf dieser Website verarbeitet der Hosting-Anbieter technisch notwendige Daten, etwa IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite und Browsertyp. Die Verarbeitung ist erforderlich, um die Website sicher und stabil bereitzustellen.",
				},
				{
					p: "Diese Website wird bei der Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen, gehostet, auf Servern in Deutschland. Mit Hetzner besteht ein Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO.",
				},
				{
					p: "Die Logdaten werden nach 14 Tagen gelöscht. Länger speichern wir sie nur, wenn sie zur Aufklärung eines konkreten Sicherheitsvorfalls benötigt werden.",
				},
			],
		},
		{
			id: "s-kontakt",
			num: "04",
			title: "Kontaktformular, Demo und Angebot",
			law: "Art. 6 Abs. 1 lit. a DSGVO",
			body: [
				{
					p: "Wenn Sie uns per Formular, E-Mail oder Telefon kontaktieren, eine Demo buchen oder ein Angebot anfragen, verarbeiten wir Ihre Angaben wie Name, Unternehmen, E-Mail-Adresse, Telefonnummer und Ihre Nachricht, um Ihre Anfrage zu bearbeiten und Ihnen zu antworten. Zur schnellen Bearbeitung leiten wir die Angaben an einen internen Slack-Kanal unseres Teams weiter (siehe Empfänger).",
				},
				{
					p: "Die Daten löschen wir, sobald sie für diesen Zweck nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten entgegenstehen. Ohne Ihre ausdrückliche Zustimmung geben wir diese Daten nicht an Dritte weiter. Ihre Einwilligung können Sie jederzeit widerrufen.",
				},
			],
		},
		{
			id: "s-newsletter",
			num: "05",
			title: "Newsletter",
			law: "Art. 6 Abs. 1 lit. a DSGVO",
			body: [
				{
					p: "Wenn Sie unseren Newsletter abonnieren, verwenden wir Ihre E-Mail-Adresse, um Ihnen den Newsletter zu senden. Sie können das Abonnement jederzeit abbestellen, zum Beispiel über den Link im Newsletter oder per E-Mail an info@heidisystems.com. Die Anmeldung wird zur Bearbeitung an einen internen Slack-Kanal unseres Teams übermittelt (siehe Empfänger).",
				},
			],
		},
		{
			id: "s-rechner",
			num: "06",
			title: "Online-Rechner und Checks",
			law: "Art. 6 Abs. 1 lit. a und b DSGVO",
			body: [
				{
					p: "Wenn Sie unsere Online-Rechner und Checks nutzen, etwa den Portfolio-Checker oder den Einsparrechner, verarbeiten wir die eingegebenen Angaben, um Ihnen das Ergebnis anzuzeigen und, falls gewünscht, Ihre Anfrage zu bearbeiten.",
				},
			],
		},
		{
			id: "s-leistung",
			num: "07",
			title: "Verbrauchsdaten im Messdienst",
			law: "Art. 6 Abs. 1 lit. b und c DSGVO, Art. 28 DSGVO",
			body: [
				{
					p: "Im Rahmen unserer Messdienstleistungen verarbeiten wir Verbrauchsdaten der Funkzähler sowie die für die Heizkostenabrechnung und die monatliche Verbrauchsinformation erforderlichen Daten. Grundlage sind die Heizkostenverordnung und die Verträge mit Eigentümern und Verwaltungen.",
				},
				{
					p: "Für die Verbrauchs- und Abrechnungsdaten der Nutzer, Bewohner und Mieter ist der jeweilige Eigentümer oder die Verwaltung Verantwortlicher im Sinne der DSGVO. Heidi verarbeitet diese Daten als Auftragsverarbeiter nach Art. 28 DSGVO, auf Grundlage einer Vereinbarung zur Auftragsverarbeitung und nur auf Weisung des Verantwortlichen. Für Daten von Besuchern dieser Website, von Interessenten und von Ansprechpartnern unserer Kunden ist Heidi selbst Verantwortlicher.",
				},
			],
		},
		{
			id: "s-cookies",
			num: "08",
			title: "Cookies und Analyse",
			body: [
				{
					p: "Technisch notwendige Cookies setzen wir ein, damit die Website funktioniert. Cookies, die nicht technisch notwendig sind, setzen wir nur mit Ihrer Einwilligung. Ihre Einwilligung verwalten wir mit dem Consent-Tool Cookiebot. Sie können Ihre Auswahl jederzeit ändern oder widerrufen.",
				},
				{ h3: "Google Ads Conversion-Tracking" },
				{
					p: "Mit Ihrer Einwilligung nutzen wir das Conversion-Tracking von Google Ads (Google). Damit messen wir, ob eine Anzeige zu einer Anfrage auf unserer Website geführt hat. Dabei kann eine Übermittlung von Daten in die USA erfolgen. Rechtsgrundlage ist Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO.",
				},
			],
		},
		{
			id: "s-empfaenger",
			num: "09",
			title: "Empfänger und Drittlandübermittlung",
			body: [
				{
					p: "Wir geben personenbezogene Daten nur weiter, wenn dies für die genannten Zwecke erforderlich ist, etwa an technische Dienstleister, die wir sorgfältig auswählen und vertraglich verpflichten. Empfänger sind insbesondere:",
				},
				{
					list: [
						"<b>Hosting und Infrastruktur:</b> Hetzner Online GmbH, Gunzenhausen (Deutschland)",
						"<b>Datenbank und Backend:</b> Supabase Pte. Ltd., Singapur, Verarbeitung in Deutschland (Frankfurt)",
						"<b>E-Mail, Dokumente und Terminbuchung:</b> Google Ireland Ltd. und Google LLC (Google Workspace), EU-Datenregion",
						"<b>Kundenkommunikation und CRM:</b> Monday.com Ltd., Tel Aviv (Israel), EU-Datenregion",
						"<b>Interne Kommunikation:</b> Slack Technologies, LLC (USA)",
						"<b>Projekt- und Kundendokumentation:</b> Notion Labs, Inc. (USA)",
						"<b>Montage:</b> von Heidi geschulte und zertifizierte Installationsbetriebe, soweit für die Montage erforderlich",
					],
				},
				{
					p: "Soweit Daten in Länder außerhalb der EU übermittelt werden, stützen wir uns auf einen Angemessenheitsbeschluss der EU-Kommission (etwa für Israel oder das EU-US Data Privacy Framework) oder auf EU-Standardvertragsklauseln.",
				},
			],
		},
		{
			id: "s-rechte",
			num: "10",
			title: "Ihre Rechte",
			law: "Art. 15 bis 21 DSGVO",
			body: [
				{
					p: "Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Eine erteilte Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen.",
				},
				{
					p: "Sie haben außerdem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77 DSGVO), zum Beispiel bei der Berliner Beauftragten für Datenschutz und Informationsfreiheit.",
				},
			],
		},
		{
			id: "s-stand",
			num: "11",
			title: "Stand dieser Erklärung",
			body: [
				{
					p: "Stand: 21. Oktober 2026. Wir passen diese Erklärung an, wenn sich unsere Verarbeitung oder die Rechtslage ändert.",
				},
			],
		},
	],
};
