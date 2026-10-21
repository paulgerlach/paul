/**
 * Texts of /api-dokumentation, word for word from the design
 * (https://claude.ai/artifact/3AZnpE4apaUo694utixF1d): the copy, the code
 * samples and the tables. The API as described, the draft's placeholders,
 * the bved facts and the example values await sign-off (plan §4.4).
 */
import { DEMO_HREF } from "$lib/landing/cta";
import { ROUTE_SOFTWAREPARTNER } from "$lib/routes";
import type { IconName } from "./icons";

const NB = " ";

export const PARTNER_HREF = ROUTE_SOFTWAREPARTNER;

/** A run of text with inline code, bold text, the "Pflicht" mark or a status code. */
export type RichPart =
	| string
	| { code: string }
	| { b: string }
	| { req: string }
	| { status: string; tone?: "ok" | "er" };
export type Rich = string | RichPart[];

export type CodeSample = {
	label: string;
	/** The yellow "Platzhalter" mark or the green status code in the head. */
	badge?: { kind: "ph" | "ok"; text: string };
	code: string;
};

export type Table = { head: string[]; rows: Rich[][] };

/** The articles' ids, in their order (the design's anchors). */
export const ARTICLE = {
	overview: "ueberblick",
	quickStart: "schnellstart",
	auth: "auth",
	baseUrl: "basis",
	consumption: "verbrauch",
	userChange: "wechsel",
	documents: "dokumente",
	fileExchange: "datei",
	status: "status",
	versions: "versionen",
	access: "zugang",
} as const;

export const hero = {
	pill: "API-Dokumentation",
	pillIcon: "rack" satisfies IconName as IconName,
	h1: "Verbrauchsdaten direkt in Ihre Software.",
	h1Accent: "Nach bved-Standard.",
	lead: "Heidi stellt Verbrauchsdaten, Nutzerwechsel und Dokumente über Webservices nach den Spezifikationen des bved bereit. Ihre ERP- oder Verwaltungssoftware ruft die Daten ab, ohne Dateiversand und ohne doppelte Pflege.",
	primary: { text: "Schnellstart", href: `#${ARTICLE.quickStart}` },
	secondary: { text: "Softwarepartner werden", href: PARTNER_HREF },
	ticks: ["bved-konform", "JSON über HTTPS", "Hosting in Deutschland"],
};

/** A run in the terminal: plain text or a coloured token. */
export type TermPart =
	string | { kind: "m" | "v" | "c" | "st" | "k" | "s"; text: string };

/** The hero's terminal: a call and its answer, line by line. */
export const terminal = {
	title: "consumption-data · v1",
	lines: [
		[
			{ kind: "m", text: "GET" },
			" /billingunits/",
			{ kind: "v", text: "123456789" },
			"/consumptions/periods",
		],
		[{ kind: "c", text: "Authorization: Basic ••••••••" }],
		[
			{ kind: "st", text: "200 OK" },
			{ kind: "c", text: " · application/json" },
		],
		["{"],
		["  ", { kind: "k", text: '"billingunit"' }, ": {"],
		[
			"    ",
			{ kind: "k", text: '"reference"' },
			": { ",
			{ kind: "k", text: '"mscnumber"' },
			": ",
			{ kind: "s", text: '"123456789"' },
			" },",
		],
		[
			"    ",
			{ kind: "k", text: '"periods"' },
			": [ { ",
			{ kind: "k", text: '"period"' },
			": ",
			{ kind: "s", text: '"2021-06"' },
			" } ]",
		],
		["  }"],
		["}"],
	] satisfies TermPart[][] as TermPart[][],
};

type TocGroup = { title: string; links: { id: string; text: string }[] };

export const docs = {
	label: "Dokumentation",
	navLabel: "Inhalt der Dokumentation",
	groups: [
		{
			title: "Einführung",
			links: [
				{ id: ARTICLE.overview, text: "Überblick" },
				{ id: ARTICLE.quickStart, text: "Schnellstart" },
				{ id: ARTICLE.auth, text: "Authentifizierung" },
				{ id: ARTICLE.baseUrl, text: "Basis-URL und Versionen" },
			],
		},
		{
			title: "Webservices",
			links: [
				{ id: ARTICLE.consumption, text: "Verbrauchsdaten (uVI)" },
				{ id: ARTICLE.userChange, text: "Nutzerwechsel" },
				{ id: ARTICLE.documents, text: "Dokumente" },
				{ id: ARTICLE.fileExchange, text: "Datenaustausch V 3.10" },
			],
		},
		{
			title: "Referenz",
			links: [
				{ id: ARTICLE.status, text: "Statuscodes" },
				{ id: ARTICLE.versions, text: "Versionen" },
				{ id: ARTICLE.access, text: "Zugang anfragen" },
			],
		},
	] satisfies TocGroup[] as TocGroup[],
	note: {
		title: "Entwurf.",
		text: "Diese Dokumentation beschreibt die geplante Heidi-Schnittstelle auf Basis der veröffentlichten bved-Spezifikationen. Basis-URL und Beispielwerte sind Platzhalter. Verbindlich sind die Zugangsdaten und Details, die Sie von Ihrem persönlichen Ansprechpartner erhalten.",
	},
};

export const overview = {
	h2: "Überblick",
	text: "Der Bundesverband für Energie- und Wasserdatenmanagement (bved) legt einheitliche Webservices für den Datenaustausch zwischen Messdienstleistern und Verwaltungssoftware fest. Heidi richtet seine Schnittstelle an diesen Spezifikationen aus. Wer bereits einen bved-Webservice angebunden hat, kann Heidi mit wenig Aufwand ergänzen.",
	roles: [
		{
			icon: "rack",
			title: "Heidi Systems",
			text: "Messdienstleister (MSC). Stellt den Server bereit und liefert die Daten.",
		},
		{
			icon: "building",
			title: "Ihre Software",
			text: "Verwaltung oder ERP (PM). Ruft die Daten als Client ab oder übermittelt Wechsel.",
		},
	] satisfies { icon: IconName; title: string; text: string }[],
	services: [
		{
			icon: "bars",
			name: "consumption-data",
			text: "Monatliche Verbrauchsdaten je Nutzeinheit für die unterjährige Verbrauchsinformation.",
			version: "v1.2.1",
			href: `#${ARTICLE.consumption}`,
		},
		{
			icon: "swap",
			name: "on-site-roles",
			text: "Tagesaktuelle Übermittlung von Nutzer- und Bewohnerwechseln an Heidi.",
			version: "v2.0",
			href: `#${ARTICLE.userChange}`,
		},
		{
			icon: "doc",
			name: "documents",
			text: "Abrechnungen und weitere Dokumente automatisiert hoch- und herunterladen.",
			version: "v1.3",
			href: `#${ARTICLE.documents}`,
		},
		{
			icon: "list",
			name: "Datenaustausch",
			text: "Dateibasierter Austausch für die Heizkostenabrechnung.",
			version: "V 3.10",
			href: `#${ARTICLE.fileExchange}`,
		},
	] satisfies {
		icon: IconName;
		name: string;
		text: string;
		version: string;
		href: string;
	}[],
};

/** The placeholder base URL of the consumption-data service (plan §4.4). */
export const BASE_URL = "https://api.heidisystems.example/bved/consumptions/v1";

export const quickStart = {
	h2: "Schnellstart",
	steps: [
		{
			title: "Zugang anfragen",
			text: "Ihr persönlicher Ansprechpartner bei Heidi richtet den Zugang für Ihre Verwaltung oder Ihr Softwareunternehmen ein.",
		},
		{
			title: "Zugangsdaten erhalten",
			text: "Sie erhalten Benutzername und Passwort sowie die Zuordnung Ihrer Liegenschaften zu Heidi-Abrechnungsnummern.",
		},
		{
			title: "Ersten Abruf senden",
			text: "Fragen Sie die verfügbaren Abrechnungszeiträume einer Liegenschaft ab.",
		},
	],
	sample: {
		label: "cURL",
		code: `curl ${BASE_URL}/billingunits/123456789/consumptions/periods \\
  -u "BENUTZER:PASSWORT" \\
  -H "accept: application/json"`,
	} satisfies CodeSample,
};

export const auth = {
	h2: "Authentifizierung",
	text: [
		"Alle Anfragen laufen ausschließlich verschlüsselt über HTTPS. Die bved-Webservices sehen Basic Auth und OAuth 2.0 vor. Jede Anfrage enthält einen ",
		{ code: "Authorization" },
		"-Header und ",
		{ code: "accept: application/json" },
		".",
	] satisfies Rich,
	table: {
		head: ["Verfahren", "Header", "Hinweis"],
		rows: [
			[
				[{ b: "Basic Auth" }],
				[{ code: "Authorization: Basic <base64(user:pass)>" }],
				"Standard laut bved-Spezifikation",
			],
			[
				[{ b: "OAuth 2.0" }],
				[{ code: "Authorization: Bearer <token>" }],
				"Laut bved vorgesehen, Freischaltung auf Anfrage",
			],
		],
	} satisfies Table,
};

export const baseUrl = {
	h2: "Basis-URL und Versionen",
	text: "Die Hauptversion steht im Pfad. Kleinere, abwärtskompatible Erweiterungen der Spezifikation ändern den Pfad nicht.",
	sample: {
		label: "Basis-URL",
		badge: { kind: "ph", text: "Platzhalter" },
		code: BASE_URL,
	} satisfies CodeSample,
	list: [
		"Format: JSON, Zeichensatz UTF-8",
		[
			`Zeitstempel: ISO 8601 in UTC, z.${NB}B. `,
			{ code: "2022-05-09T09:04:55.772Z" },
		],
		[
			"Abrechnungszeitraum: ",
			{ code: "YYYY-MM" },
			`, z.${NB}B. `,
			{ code: "2021-06" },
		],
	] satisfies Rich[],
};

const PARAM_HEAD = ["Parameter", "Ort", "Beschreibung"];
const REQUIRED = { req: "Pflicht" };

export type Endpoint = {
	id: string;
	method: string;
	path: string;
	text: string;
	params: Table;
	answer?: CodeSample;
	fields?: Table;
	list?: Rich[];
	small?: string;
};

export const consumption = {
	h2: "Verbrauchsdaten (uVI)",
	version: "consumption-data 1.2.1",
	text: "Liefert monatliche Verbrauchsdaten auf Ebene der Nutzeinheit. Damit stellen Sie Bewohnern die unterjährige Verbrauchsinformation nach EED und HKVO in Ihrem eigenen Portal bereit. Der Webservice ging aus der ARGE HeiWaKo hervor und wird heute vom bved gepflegt.",
	endpoints: [
		{
			id: "ep-periods",
			method: "GET",
			path: "/billingunits/{mscnumber}/consumptions/periods",
			text: "Gibt alle Abrechnungszeiträume einer Abrechnungseinheit zurück, für die Verbrauchsdaten vorliegen, jeweils mit dem Zeitpunkt der letzten Aktualisierung.",
			params: {
				head: PARAM_HEAD,
				rows: [
					[
						[{ code: "mscnumber" }, " ", REQUIRED],
						"Pfad",
						"Nummer der Abrechnungseinheit beim Messdienstleister. 9 Zeichen, alphanumerisch, führende Nullen möglich.",
					],
				],
			},
			answer: {
				label: "Antwort",
				badge: { kind: "ok", text: "200" },
				code: `{
  "billingunit": {
    "reference": {
      "mscnumber": "123456789",
      "pmnumber": "XY-12345-00"
    },
    "periods": [
      {
        "period": "2021-06",
        "update": "2022-05-09T09:04:55.772Z"
      }
    ]
  }
}`,
			},
			fields: {
				head: ["Feld", "Typ", "Beschreibung"],
				rows: [
					[
						[{ code: "reference.mscnumber" }],
						"string",
						"Nummer der Abrechnungseinheit bei Heidi",
					],
					[
						[{ code: "reference.pmnumber" }],
						"string",
						"Ihre eigene Objektnummer aus der Verwaltungssoftware",
					],
					[
						[{ code: "periods[].period" }],
						"string",
						["Abrechnungszeitraum im Format ", { code: "YYYY-MM" }],
					],
					[
						[{ code: "periods[].update" }],
						"string",
						"Letzte Aktualisierung der Daten, ISO 8601",
					],
				],
			},
		},
		{
			id: "ep-period",
			method: "GET",
			path: "/billingunits/{mscnumber}/consumptions/periods/{period}",
			text: "Gibt die Verbrauchsdaten eines Zeitraums für alle Nutzeinheiten der Abrechnungseinheit zurück. Das Antwortschema folgt der bved-Spezifikation consumption-data 1.2.1 und enthält unter anderem:",
			params: {
				head: PARAM_HEAD,
				rows: [
					[
						[{ code: "mscnumber" }, " ", REQUIRED],
						"Pfad",
						"Nummer der Abrechnungseinheit, wie oben",
					],
					[
						[{ code: "period" }, " ", REQUIRED],
						"Pfad",
						[
							"Zeitraum im Format ",
							{ code: "YYYY-MM" },
							`, z.${NB}B. `,
							{ code: "2021-06" },
						],
					],
				],
			},
			list: [
				"Verbräuche je Nutzeinheit für den angefragten Monat",
				[
					"Vergleichswert (",
					{ code: "benchmark" },
					") für die Verbrauchsinformation, seit Version 1.1",
				],
				[
					"Kennzeichen ",
					{ code: "converted" },
					" für umgerechnete Verbräuche, zusammen mit der Einheit ",
					{ code: "unitofmeasure" },
					", seit Version 1.1",
				],
				"Bemerkungen je Nutzeinheit, seit Version 1.2",
			],
			small:
				"Das vollständige Feldschema ergänzen wir in der finalen Fassung dieser Dokumentation.",
		},
	] satisfies Endpoint[] as Endpoint[],
};

export const userChange = {
	h2: "Nutzerwechsel",
	version: "on-site-roles 2.0",
	text: "Übermittelt Nutzer- und Bewohnerwechsel tagesaktuell aus Ihrer Software an Heidi. Das ist nötig, damit die unterjährige Verbrauchsinformation den richtigen Bewohnern zugeordnet wird und Zwischenablesungen korrekt in die Abrechnung einfließen.",
	direction: { from: "Ihre Software", to: "Heidi" },
	small:
		"Für neue Anbindungen empfiehlt der bved Version 2.0. Version 1.2 bleibt für bestehende Integrationen gültig. Endpunkte und Feldschema folgen in der finalen Fassung.",
};

export const documents = {
	h2: "Dokumente",
	version: "documents 1.3",
	text: "Automatisiert das Hoch- und Herunterladen von Dokumenten zwischen Ihrer Software und Heidi, zum Beispiel Heizkostenabrechnungen. Mit Version 1.3 arbeitet der Webservice nur noch mit JSON.",
	list: [
		[
			"Endpunkt ",
			{ code: "setStatus" },
			", um den Empfang vieler Dokumente auf einmal zu bestätigen",
		],
		["Neuer Dokumenttyp ", { code: "P" }, " und optionaler Info-Block"],
		["Referenztyp ", { code: "order" }, " für Bestellnummern"],
	] satisfies Rich[],
	small: "Endpunkte und Feldschema folgen in der finalen Fassung.",
};

export const fileExchange = {
	h2: "Datenaustausch V 3.10",
	version: "Dateiformat",
	text: "Für Software, die noch keine Webservices nutzt, unterstützt Heidi den dateibasierten bved-Standard-Datenaustausch für die Heizkostenabrechnung. Angaben zum CO2-Kostenaufteilungsgesetz sind ab Version 3.10 enthalten.",
	small:
		"Der E-Satz für den Volldatenaustausch wird vom bved nicht weiterentwickelt. Für neue Anbindungen empfehlen wir die Webservices.",
};

export const status = {
	h2: "Statuscodes",
	text: "Antworten sind entweder leer oder ein JSON-Objekt.",
	table: {
		head: ["Code", "Bedeutung"],
		rows: [
			[
				[{ status: "200", tone: "ok" }],
				"Erfolgreich. Die angefragten Daten stehen im Antworttext.",
			],
			[
				[{ status: "400" }],
				[
					"Ungültige Anfrage, zum Beispiel ein falsches Format bei ",
					{ code: "period" },
					".",
				],
			],
			[[{ status: "401" }], "Fehlende oder ungültige Zugangsdaten."],
			[[{ status: "404" }], "Abrechnungseinheit oder Zeitraum nicht gefunden."],
			[[{ status: "405 / 501" }], "HTTP-Methode wird nicht unterstützt."],
			[[{ status: "500", tone: "er" }], "Interner Fehler auf Serverseite."],
			[
				[{ status: "503", tone: "er" }],
				"Dienst vorübergehend nicht verfügbar.",
			],
		],
	} satisfies Table,
};

export const versions = {
	h2: "Versionen",
	table: {
		head: ["Webservice", "Version", "Änderungen"],
		rows: [
			[
				"consumption-data",
				[{ code: "1.1" }],
				"Vergleichswert und Kennzeichen für umgerechnete Verbräuche",
			],
			[
				"consumption-data",
				[{ code: "1.2" }],
				"Freischaltung des Dienstes je Abrechnungseinheit, Bemerkungen je Nutzeinheit",
			],
			[
				"consumption-data",
				[{ code: "1.2.1" }],
				"Anzahl der Abrechnungseinheiten mit Freischaltungsinformation",
			],
			["on-site-roles", [{ code: "2.0" }], "Empfohlen für neue Anbindungen"],
			[
				"documents",
				[{ code: "1.3" }],
				"setStatus, Dokumenttyp P, Info-Block, Referenztyp order, nur JSON",
			],
		],
	} satisfies Table,
	source: {
		label: "Grundlage:",
		text: "bved-Spezifikationen",
		href: "https://bved.info/datenaustauschalt/spezifikationen/",
		/** For screen readers: the link opens a new tab. */
		newTab: "(öffnet in neuem Tab)",
	},
};

export const access = {
	h2: "Zugang anfragen",
	text: "Ihr persönlicher Ansprechpartner richtet den Zugang ein und begleitet die Anbindung bis zum ersten erfolgreichen Abruf. Softwareanbieter binden Heidi einmal an und versorgen damit alle Verwaltungen unter ihren Kunden.",
	primary: { text: "Erstgespräch vereinbaren", href: DEMO_HREF },
	secondary: { text: "Softwarepartner werden", href: PARTNER_HREF },
};

export const copy = {
	button: "Kopieren",
	done: "Kopiert",
	status: "Code kopiert",
	/** Names of the scrolling code frames and tables (keyboard scrolling). */
	codeLabel: (label: string) => `Codebeispiel: ${label}`,
	tableLabel: (title: string) => `Tabelle: ${title}`,
};
