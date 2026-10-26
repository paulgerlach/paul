/**
 * The Zählercheck's data, word for word from the design's `#ss-js`: the
 * devices and prices, the questions' options, every step's title, lead and
 * explanation, the tooltips, the check points' owners and the offer's texts.
 * The explanations (`info`) are trusted markup rendered with `{@html}`.
 */
import { DEVICE_ICONS, ICONS, SKETCHES } from "./svg";

export type DevKey = "kwz" | "wwz" | "wmz" | "hkv" | "rwm" | "weitere";
/** The devices captured as groups (every one but the smoke alarms). */
export type GroupDev = Exclude<DevKey, "rwm">;
export type Option = readonly [value: string, label: string];

export const DEVICES: Record<
	DevKey,
	{ name: string; price: number; icon: string; info: string }
> = {
	kwz: {
		name: "Kaltwasserzähler",
		price: 27,
		icon: DEVICE_ICONS.kwz,
		info: "erfassen den Kaltwasserverbrauch.",
	},
	wwz: {
		name: "Warmwasserzähler",
		price: 27,
		icon: DEVICE_ICONS.wwz,
		info: "erfassen den Warmwasserverbrauch.",
	},
	wmz: {
		name: "Wärmemengenzähler",
		price: 79,
		icon: DEVICE_ICONS.wmz,
		info: "misst Wärmeenergie in einem Heiz- oder Warmwasserkreis.",
	},
	hkv: {
		name: "Heizkostenverteiler",
		price: 9,
		icon: DEVICE_ICONS.hkv,
		info: "misst relative Verbrauchseinheiten am Heizkörper, keine kWh.",
	},
	weitere: {
		name: "Weitere Zähler",
		price: 0,
		icon: DEVICE_ICONS.weitere,
		info: "zum Beispiel Strom- oder Gaszähler. Preis auf Anfrage.",
	},
	rwm: {
		name: "Rauchwarnmelder",
		price: 6,
		icon: DEVICE_ICONS.rwm,
		info: "für die vorgeschriebene Ausstattung der Wohnräume.",
	},
};

export const ORDER: DevKey[] = ["kwz", "wwz", "wmz", "hkv", "rwm", "weitere"];
export const GROUP_DEVS: GroupDev[] = ["kwz", "wwz", "wmz", "hkv", "weitere"];

/** Prices, net (€): maintenance per device and year, billing per unit and
 * year, installation flat rate, commissioning per device, gateway per year. */
export const PRICES = { wart: 5, abr: 27.5, inst: 999, ibn: 3, gw: 39 };

export const SERVICES: Record<string, string> = {
	a: "Funkzähler, Fernauslesung und Heizkostenabrechnung",
	b: "Funkzähler und Fernauslesung ohne Abrechnung",
	c: "Vorhandene Funkzähler auslesen und abrechnen",
	d: "Beratung zum passenden Leistungsumfang",
};

export const YES_NO_UNKNOWN: Option[] = [
	["ja", "Ja"],
	["nein", "Nein"],
	["unbekannt", "Unbekannt"],
];

export const HEATING: Option[] = [
	["gas", "Zentrale Gasheizung"],
	["wp", "Zentrale Wärmepumpe"],
	["fw", "Fernwärme"],
	["oel", "Zentrale Ölheizung"],
	["pellet", "Pellet oder Biomasse"],
	["etage", "Etagenheizung"],
	["elektro", "Elektrische Heizung"],
	["sonst", "Sonstige"],
	["unbekannt", "Unbekannt"],
];

export const HOT_WATER: Option[] = [
	["zentral", "Zentral"],
	["dezentral", "Dezentral (z. B. Durchlauferhitzer)"],
	["teils", "Teilweise zentral, teilweise dezentral"],
	["unbekannt", "Unbekannt"],
];

/**
 * "Weitere Leistungen": the offers on request, each with its starting price
 * (`ZP`: net, a guide; `per` its unit).
 */
export const EXTRAS = [
	{
		v: "ea",
		price: "ab 69,95 €",
		per: "",
		title: "Energieausweis",
		icon: ICONS.energy,
		small: "Verbrauchs- oder Bedarfsausweis",
		text: "Pflicht bei Verkauf, Neuvermietung und Verpachtung eines Gebäudes. Es gibt den Verbrauchsausweis auf Basis der Verbrauchswerte und den Bedarfsausweis auf Basis der Gebäudedaten.",
	},
	{
		v: "ha",
		price: "ab 800 €",
		per: "pro Gebäude",
		title: "Hydraulischer Abgleich",
		icon: ICONS.balance,
		small: "Heizung optimal einstellen",
		text: "Stellt die Heizungsanlage so ein, dass jeder Heizkörper die passende Wassermenge erhält. Das spart Energie und ist für viele Mehrfamilienhäuser gesetzlich vorgeschrieben.",
	},
	{
		v: "blei",
		price: "ab 55 €",
		per: "pro Probe",
		title: "Bleimessung",
		icon: ICONS.lead,
		small: "Trinkwasser auf Blei prüfen",
		text: "Prüft das Trinkwasser auf Blei. Sinnvoll vor allem in älteren Gebäuden, in denen noch Bleileitungen verbaut sein können.",
	},
	{
		v: "leg",
		price: "ab 300 €",
		per: "pro Gebäude",
		title: "Legionellenprüfung",
		icon: ICONS.legionella,
		small: "Warmwasser auf Legionellen prüfen",
		text: "Für Großanlagen zur Trinkwassererwärmung in vermieteten Gebäuden ist eine regelmäßige Untersuchung auf Legionellen vorgeschrieben, in der Regel alle drei Jahre.",
	},
] as const;

/** Standard sizes with a free value (`NG`); the key's free input placeholder. */
export const SIZES = {
	bl: {
		options: [
			["80", "80 mm"],
			["110", "110 mm"],
			["130", "130 mm"],
			["165", "165 mm"],
			["190", "190 mm"],
			["260", "260 mm"],
			["300", "300 mm"],
		],
		placeholder: "Einbaulänge in mm",
	},
	dn: {
		options: [
			["15", "DN 15"],
			["20", "DN 20"],
			["25", "DN 25"],
			["32", "DN 32"],
			["40", "DN 40"],
			["50", "DN 50"],
		],
		placeholder: "z. B. DN 65",
	},
	gew: {
		options: [
			["G ½", "G ½"],
			["G ¾", "G ¾"],
			["G 1", "G 1"],
			["G 1¼", "G 1¼"],
			["G 1½", "G 1½"],
			["G 2", "G 2"],
		],
		placeholder: "z. B. G 2½",
	},
	qp: {
		options: [
			["0,6", "0,6 m³/h"],
			["1,0", "1,0 m³/h"],
			["1,5", "1,5 m³/h"],
			["2,5", "2,5 m³/h"],
			["3,5", "3,5 m³/h"],
			["6,0", "6,0 m³/h"],
			["10", "10 m³/h"],
			["15", "15 m³/h"],
		],
		placeholder: "qp in m³/h",
	},
	q3: {
		options: [
			["1,6", "Q3 1,6 m³/h"],
			["2,5", "Q3 2,5 m³/h"],
			["4", "Q3 4 m³/h"],
			["6,3", "Q3 6,3 m³/h"],
			["10", "Q3 10 m³/h"],
			["16", "Q3 16 m³/h"],
		],
		placeholder: "Q3 in m³/h",
	},
} satisfies Record<string, { options: Option[]; placeholder: string }>;
export type SizeKey = keyof typeof SIZES;

/** The MID standards of a measuring capsule. */
export const MID_NORMS = [
	"A34",
	"DM1",
	"HT2",
	"IST",
	"MB2",
	"MB3",
	"MET",
	"MOC",
	"MUK",
	"TE1",
	"WE1",
	"WGU",
	"andere",
];

/** The installation questions' tooltips (`TT`). */
export const MOUNT_TIPS = {
	abs: "Lassen sich die Leitungen vor dem Zähler absperren, kann der Zähler ohne Ablassen von Wasser oder Heizung getauscht werden. Sonst sind Vorarbeiten nötig.",
	eat: "Einbausätze und Zählerstrecken sind die Anschlussstücke, in die der Zähler eingesetzt wird. Passen sie zum neuen Gerät, reicht ein direkter Tausch. Diese Angabe ergibt sich aus der Absperrbarkeit: Ja dort bedeutet Ja hier, Nein dort bedeutet Nein hier.",
	err: "Sitzen die Zähler im Keller oder Treppenhaus, braucht es keinen Wohnungstermin. Wichtig: Der Eigentümer oder die Verwaltung ist dafür zuständig, die Mieter über den Einbau zu informieren und sicherzustellen, dass der Einbau durchgeführt werden kann.",
	san: "Müssen Leitungen angepasst oder Absperrventile ergänzt werden, braucht es einen Sanitärbetrieb. Heidi kann das koordinieren, oder Ihr eigener Betrieb übernimmt es.",
	wer: "Selbst montieren ist bevorzugt: Es sind keine Vorkenntnisse erforderlich, jeder Hausinstallateur kann die Geräte bequem einbauen. Die Installationspauschale entfällt dann.",
};

/** The fields' tooltips (`TIPF`), by `<step>.<field>` or `<field>`. */
const FIELD_TIPS: Record<string, string> = {
	fg: "Der Durchmesser der Temperaturfühler. Er steht meist auf dem Fühlerkabel, dem Typenschild oder im Datenblatt. Üblich sind 5,0 mm, 5,2 mm und 6,0 mm.",
	"wmz.dn":
		"Die Nennweite des Rohranschlusses, zum Beispiel DN 15 oder DN 20. Alternativ reicht das Anschlussgewinde.",
	"wmz.gew":
		"Das Gewinde am Zähler, zum Beispiel G ¾ oder G 1. Alternativ reicht die Nennweite DN.",
	n: "Baugleich sind Geräte mit gleichem Typ, gleicher Größe und gleicher Einbausituation. Zählen Sie diese zusammen. Unterscheiden sie sich, legen Sie eine weitere Gruppe an.",
	inst: "Wählen Sie „Ja“, wenn an dieser Stelle bereits ein Zähler verbaut ist, der getauscht oder übernommen werden soll. Wählen Sie „Nein“, wenn dort noch kein Zähler verbaut ist.",
	funk: "Funkfähige Zähler haben ein Funkmodul, oft erkennbar an einem Funksymbol oder einem Aufdruck wie „radio“ oder „wM-Bus“. Im Zweifel wählen Sie „Unbekannt“.",
	her: "Den Hersteller finden Sie meist auf dem Zählwerk oder dem Typenschild. Alternativ steht Ihr bisheriger Messdienst auf der Abrechnung.",
	mod: "Die Typ- oder Modellbezeichnung steht auf dem Typenschild, oft in der Nähe der Seriennummer.",
	jahr: "Zähler müssen nach Ablauf der Eichfrist getauscht werden. Das Jahr steht oft auf einer Plombe oder als Aufdruck auf dem Zähler.",
	std: "Das Funkprotokoll, über das der Zähler sendet. Steht es nicht auf dem Gerät, wählen Sie „Unbekannt“.",
	key: "Damit Heidi vorhandene Funkzähler auslesen kann, braucht es die digitalen Zugangsschlüssel. Diese stellt in der Regel der bisherige Messdienst bereit.",
	q3: "Der Dauerdurchfluss Q3 (früher Qn) in m³/h steht auf dem Zählwerk, zum Beispiel „Q3 2,5“.",
	bl: "Die Länge des Zählers von Dichtfläche zu Dichtfläche, ohne Verschraubungen, in Millimetern.",
	dn: "Die Nennweite des Rohranschlusses, zum Beispiel DN 15 oder DN 20. Sie steht oft auf dem Zähler.",
	gew: "Das Gewinde am Zähler, an dem die Verschraubung sitzt, zum Beispiel G ¾ oder G 1.",
	was: "Wird Wärme für die Heizung, Wärme für das Warmwasser oder Kälte gemessen?",
	qp: "Der Nenndurchfluss qp in m³/h steht auf dem Typenschild des Wärmezählers, zum Beispiel „qp 1,5“.",
	fuehler:
		"Die beiden Temperaturfühler messen Vor- und Rücklauf. Sie sitzen entweder direkt im Rohr (Direktfühler) oder in einer Tauchhülse.",
	bem: "Alles, was beim Einbau wichtig sein könnte, zum Beispiel enge Schächte, Verkleidungen oder Abweichungen innerhalb der Gruppe.",
	"weitere.art":
		"Um welche Zählerart handelt es sich: Strom, Gas oder eine andere?",
	"weitere.n": "Die Anzahl der Zähler dieser Art in der Liegenschaft.",
	"rwm.sz": "Die Zahl der Schlafzimmer in allen Wohnungen zusammen.",
	"rwm.kz": "Die Zahl der Kinderzimmer in allen Wohnungen zusammen.",
	"rwm.fl":
		"Flure, über die man aus Schlaf- oder Kinderzimmern nach draußen gelangt, in allen Wohnungen zusammen.",
	"rwm.n":
		"Die Gesamtzahl der benötigten Rauchwarnmelder. Lassen Sie das Feld leer, übernehmen wir die Mindestzahl aus Ihren Raumangaben.",
	"rwm.art":
		"Neu montieren, wenn bisher keine Melder hängen. Ersetzen, wenn vorhandene Melder getauscht werden.",
	"rwm.bem":
		"Zum Beispiel Räume mit Dachschräge, Galerien oder besonders hohe Decken.",
	ww: "Zentral: Das Warmwasser kommt aus der gemeinsamen Heizungsanlage. Dezentral: Jede Wohnung erwärmt ihr Wasser selbst, etwa mit einem Durchlauferhitzer.",
	"mont.bem":
		"Besonderheiten der Liegenschaft, die für die Montage wichtig sind, zum Beispiel mehrere Gebäude oder eine geplante Sanierung.",
	"adr.hin":
		"Zum Beispiel, wer die Lieferung annimmt oder wo die Pakete abgestellt werden können.",
	"adr.ust":
		"Nur nötig, wenn die Rechnung an ein Unternehmen mit Umsatzsteuer-Identifikationsnummer geht.",
};

/**
 * A field's tooltip on a step (the design's `autoTips`, which adds them only
 * on steps with more than one question: the heating, installation, address
 * and device steps).
 */
export const fieldTip = (step: string, key: string): string | undefined =>
	FIELD_TIPS[`${step}.${key}`] ?? FIELD_TIPS[key];

/** The questions' tooltips (`TIPQ`), by the question's text. */
export const QUESTION_TIPS = {
	heatType:
		"Aufputz: Der ganze Zähler sitzt sichtbar in der Rohrleitung, mit Verschraubungen links und rechts. Unterputz/Kapsel: Nur das Rechenwerk ist zu sehen, die Messkapsel steckt in einem fest eingebauten Anschlussgehäuse.",
	buy: "Mieten: Die Gerätemiete zählt zu den Betriebskosten und kann auf die Mieter umgelegt werden. Kaufen: Die Kosten für gekaufte Geräte können nicht auf die Miete umgelegt werden.",
	radiator:
		"Wählen Sie die Bauform, die Ihren Heizkörpern am ehesten entspricht. Unterschiedliche Bauarten erfassen Sie als eigene Gruppen.",
	waterMount:
		"Unterputz: Nur eine runde Abdeckung mit Zählwerk schaut aus der Wand. Aufputz: Der ganze Zähler sitzt sichtbar in der Leitung, mit Verschraubungen links und rechts.",
	connections:
		"Diese Angaben bestimmen, welcher neue Zähler mechanisch passt. Unbekanntes darf offen bleiben.",
	sitePhotos:
		"Fotografieren Sie den Zähler so, dass Zählwerk, Typenschild und die Anschlüsse links und rechts gut zu erkennen sind. Ein zweites Foto aus etwas Abstand zeigt, wo der Zähler sitzt.",
	meterPhotos:
		"Ein Foto vom Zähler mit gut lesbarem Typenschild und eines aus etwas Abstand, das zeigt, wo der Zähler sitzt.",
	mounting:
		"An Dachschrägen und hohen Decken gelten besondere Regeln für den Montageort. Heidi prüft das für Sie.",
	heating:
		"Die Heizungsart bestimmt mit, welche Zähler und welches Messkonzept passen. Mehrere Arten können Sie gemeinsam auswählen.",
	services:
		"Mit Abrechnung übernimmt Heidi auch die jährliche Heizkostenabrechnung. Ohne Abrechnung erhalten Sie Funkzähler und Fernauslesung.",
	property:
		"Die Adresse der Liegenschaft, für die das Angebot gilt. Dorthin liefern wir die Geräte.",
	billing:
		"An diese Adresse richten wir Angebot und Rechnung, zum Beispiel an Ihre Hausverwaltung.",
};

/** "Fotos der Einbausituation": the device's own tooltip (`FOTO_T`). */
export const SITE_PHOTO_TIPS: Partial<Record<DevKey, string>> = {
	hkv: "Ein Foto des Heizkörpers von vorne und eines von der Seite, damit Bauart und Tiefe zu erkennen sind.",
	wmz: "Fotografieren Sie den Zähler mit Rechenwerk, die Einbausituation und die Stellen der beiden Temperaturfühler.",
};

export type StepText = { title: string; lead: string; info: string };

/** The fixed steps' titles, leads and explanations. */
export const STEPS = {
	abr: {
		title: "Liegt eine Heizkostenabrechnung vor?",
		lead: "Mit Ihrer letzten Heizkostenabrechnung sehen wir, wie Ihre Liegenschaft heute abgerechnet wird und welche Zählerarten erfasst werden.",
		info: "<h4>Wofür brauchen wir die Abrechnung?</h4><p>Die Heizkostenabrechnung zeigt uns <b>Abrechnungseinheiten, Kostenaufteilung und erfasste Zählerarten</b>.</p><p>Genaue technische Angaben zu den Zählern, etwa Baulänge oder Anschlussgröße, stehen dort in aller Regel nicht. Deshalb fragen wir im nächsten Schritt nach einer Geräteliste oder Rechnung.</p>",
	},
	liste: {
		title: "Haben Sie eine Geräteliste?",
		lead: "Die Geräteliste enthält alle Informationen zu Ihren installierten Zählern. Mit ihr oder einer Rechnung über die Zähler müssen Sie die Geräte nicht einzeln erfassen.",
		info: "<h4>Woher bekomme ich die Geräteliste?</h4><p>Die <b>Geräteliste</b> enthält alle Informationen zu den installierten Geräten, etwa Zählerart, Gerätenummer, Einbauort und Eichjahr.</p><p><b>Zähler bisher gemietet:</b> Die Angaben stehen in der technischen Dokumentation oder der Geräteliste Ihres Messdienstes. Liegt sie Ihnen nicht vor, fordern Sie sie dort an.</p><p><b>Zähler selbst gekauft und installiert:</b> Dann genügt eine Kopie der damaligen Rechnung.</p><p><b>Ohne Unterlagen</b> erfassen Sie Ihre Zähler in den nächsten Schritten selbst.</p>",
	},
	bestand: {
		title: "Sind bereits Funkzähler vorhanden?",
		lead: "Wir prüfen zuerst, ob Ihre bestehenden Geräte übernommen, direkt getauscht oder neu eingebaut werden.",
		info: "<h4>Austauschen oder übernehmen?</h4><p>Wir prüfen drei Optionen: <b>Weiterverwendung</b> funkfähiger Geräte, <b>Austausch</b> vorhandener Zähler oder <b>Neuinstallation</b>.</p><p>Vorhandene Funkzähler sind nicht automatisch mit Heidi kompatibel. Funkprotokoll und Zugangsschlüssel prüft Heidi je Gerätegruppe.</p>",
	},
	geraete: {
		title: "Welche Geräte benötigen Sie?",
		lead: "Wählen Sie alle Gerätetypen aus, die neu installiert, ausgetauscht oder über Heidi ausgelesen werden sollen.",
		info:
			"<h4>Welche Geräte gibt es?</h4><p><b>Nicht ganz sicher?</b> Kein Problem. Wählen Sie, was Sie wissen, und ergänzen Sie „Ich bin mir nicht ganz sicher“. Heidi klärt den Rest mit Ihnen.</p>" +
			ORDER.map(
				(k) => `<p><b>${DEVICES[k].name}:</b> ${DEVICES[k].info}</p>`,
			).join(""),
	},
	heiz: {
		title: "Heizung und gewünschte Leistungen",
		lead: "Diese Angaben helfen uns, den passenden Gerätebedarf und den Leistungsumfang zu bestimmen.",
		info: "<h4>Wofür brauchen wir diese Angaben?</h4><p>Heizungsart und Warmwasserbereitung entscheiden mit, welche Zählerarten und welches Messkonzept passen.</p><p><b>Mieten oder kaufen:</b> Die Gerätemiete kann auf die Mieter umgelegt werden, gekaufte Geräte nicht.</p>",
	},
	einheiten: {
		title: "Wie viele Einheiten hat die Liegenschaft?",
		lead: "Zählen Sie alle Wohn- und Gewerbeeinheiten, die abgerechnet werden.",
		info: "<h4>Wofür brauchen wir die Einheiten?</h4><p>Aus der Anzahl der Einheiten planen wir die <b>Funk-Gateways</b>, die die Zähler im Gebäude auslesen. Bei einer Heizkostenabrechnung durch Heidi berechnen sich daraus auch die <b>Abrechnungskosten</b>.</p><p>Bei mehreren Gebäuden geben Sie bitte die Summe an und ergänzen später einen Hinweis.</p>",
	},
	mont: {
		title: "Montage",
		lead: "Nur noch ein paar Angaben zur Montage. Damit schätzen wir Einbausätze und Zusatzarbeiten besser ein.",
		info: "<h4>Einbausatz oder direkter Wechsel?</h4><p>Je nach Zählertyp ist der Austausch in vorhandenen Anschlussstücken möglich, oder es sind neue Einbausätze, Rohrpassstücke oder Fühleraufnahmen nötig.</p><p>Die Zahl der Funk-Gateways hängt von Gebäudegröße, Bauweise und Lage der Zähler ab. Wir planen sie vorläufig und prüfen sie später.</p><p><b>Selbst montieren ist bevorzugt:</b> Dafür sind keine Vorkenntnisse erforderlich, jeder Hausinstallateur kann die Arbeiten bequem selbst vornehmen. Die Installationspauschale entfällt dann.</p>",
	},
	zusatz: {
		title: "Weitere Leistungen",
		lead: "Für viele Liegenschaften gelten weitere Prüf- und Nachweispflichten. Wählen Sie aus, wofür Sie zusätzlich ein Angebot wünschen.",
		info: "<h4>Alles aus einer Hand</h4><p>Die Preise für diese Leistungen ergänzen wir in Ihrem Angebot.</p><p>Nichts davon nötig? Dann gehen Sie einfach weiter.</p>",
	},
	kontakt: {
		title: "Ihre Kontaktdaten",
		lead: "Für wen dürfen wir die Geräteliste und den vorläufigen Kostenvoranschlag erstellen?",
		info: "<h4>Wann erhält Heidi meine Angaben?</h4><p>Sobald Ihr Angebot erstellt ist, übermitteln wir Ihre Angaben an Heidi. Dateien und Fotos bleiben auf Ihrem Gerät, bis Sie sie uns schicken.</p>",
	},
	res: {
		title: "Ihr persönlicher Zählercheck",
		// "Vielen Dank, <Vorname>. " goes before it.
		lead: "Aus Ihren Angaben haben wir eine vorläufige Geräteliste und einen Kostenvoranschlag erstellt. Im nächsten Schritt ergänzen Sie Liegenschafts- und Rechnungsadresse, dann erstellen wir Ihr Angebot.",
		info: "<h4>Wie verbindlich ist das?</h4><p>Gerätefamilien und Kosten sind eine <b>technische Vorauswahl</b>. Die genaue Geräteauswahl und die Montage bestätigt Heidi nach Prüfung.</p><p>Im nächsten Schritt erstellen wir daraus Ihr Angebot.</p>",
	},
	adr: {
		title: "Liegenschafts- und Rechnungsadresse",
		lead: "Für welche Liegenschaft gilt das Angebot, und an wen geht die Rechnung?",
		info: "<h4>Liegenschaft und Rechnung</h4><p>Die Liegenschaftsadresse ist die Adresse des Gebäudes, für das das Angebot gilt. Dorthin liefern wir in der Regel auch die Geräte.</p><p><b>Rechnungsadresse:</b> zum Beispiel Ihre Hausverwaltung oder die Eigentümergemeinschaft. An diese Adresse richten wir das Angebot.</p>",
	},
	ang: {
		title: "Ihr Angebot",
		lead: "Prüfen Sie Ihr Angebot und lassen Sie es sich als PDF per E-Mail zusenden.",
		info: "<h4>Wie geht es weiter?</h4><p>Ihr Angebot enthält alle Positionen, Laufzeiten und Preise. Nach dem Senden prüft Heidi die offenen technischen Punkte und stimmt das finale Angebot, Lieferung und Inbetriebnahme mit Ihnen ab.</p><p>Fragen? Schreiben Sie an vertrieb@heidisystems.com.</p>",
	},
} satisfies Record<string, StepText>;

/** A device step's title, lead and explanation. */
export function deviceStep(d: DevKey): StepText {
	const name = DEVICES[d].name;
	const title = `${name} bestimmen`;
	if (d === "rwm")
		return {
			title,
			lead: "Wie viele Rauchwarnmelder werden gebraucht, und wo sollen sie hin?",
			info: "<h4>Wie viele Melder braucht es?</h4><p>Vorgeschrieben sind Rauchwarnmelder in <b>Schlafzimmern, Kinderzimmern und Fluren</b>, die als Rettungsweg dienen. Wir rechnen aus Ihren Raumangaben eine Mindestzahl aus und markieren auffällige Abweichungen.</p><p>Bei Dachschrägen und hohen Decken gelten besondere Montageregeln. Das prüft Heidi.</p>",
		};
	const lead = `Erfassen Sie die ${name} nach Bauart. Baugleiche Geräte fassen Sie als eine Gruppe zusammen.`;
	if (d === "weitere")
		return {
			title,
			lead,
			info: "<h4>Weitere Zähler</h4><p>Strom-, Gas- oder andere Zähler binden wir auf Anfrage ein. Tragen Sie ein, was Sie haben, wir melden uns mit einem Angebot.</p>",
		};
	let info = `<h4>${name} richtig bestimmen</h4><p><b>Eine Gruppe ist ein technischer Zählertyp.</b> Bilden Sie getrennte Gruppen, wenn ${d === "hkv" ? "Heizkörperbauart oder Größe" : "Hersteller, Anschluss, Durchfluss oder Einbaulänge"} unterschiedlich sind.</p><p>Unbekannte Angaben dürfen offen bleiben. Ihr Ergebnis bekommt dann einen Prüfhinweis, statt ein ungeeignetes Modell vorzuschlagen.</p><p>Fotos bleiben in Ihrem Browser und werden nicht hochgeladen.</p>`;
	if (d === "kwz" || d === "wwz")
		info += `<div class="ss-sk"><div>${SKETCHES.up}<p><b>Unterputz</b><span>Nur eine runde Abdeckung mit Zählwerk schaut aus der Wand, die Leitung liegt dahinter.</span></p></div><div>${SKETCHES.ap}<p><b>Aufputz</b><span>Der ganze Zähler sitzt sichtbar in der Rohrleitung, mit Verschraubungen links und rechts.</span></p></div><div>${SKETCHES.neu}<p><b>Neuer Einbauplatz</b><span>Noch kein Zählerplatz vorhanden.</span></p></div></div><p style="margin-top:12px"><b>Foto-Tipp:</b> Bei Unterputzzählern die Abdeckung, die Beschriftung und, falls sichtbar, den Einbausatz fotografieren.</p>`;
	if (d === "wmz")
		info +=
			"<p><b>Zuerst die Bauart:</b> Aufputz-Wärmezähler sitzen sichtbar in der Leitung, Unterputz- oder Kapsel-Wärmezähler stecken in einem Anschlussgehäuse.</p><p><b>Pflichtangaben Aufputz:</b> Einbaulänge, Nenndurchfluss qp, Nennweite DN oder Anschlussgewinde und Temperaturfühlergröße.</p><p><b>Pflichtangaben Unterputz/Kapsel:</b> Nenndurchfluss qp und Temperaturfühlergröße.</p>";
	if (d === "hkv")
		info +=
			"<p><b>Foto-Tipp:</b> Ein Foto von vorne und eines von der Seite reichen Heidi meist für die Heizkörperbewertung.</p>";
	return { title, lead, info };
}

/** The offer step's title and lead once the offer is requested. */
export const SENT_LEAD = "Ihre Anfrage ist bei uns eingegangen.";

/** "So geht es weiter" beside the last steps: the four next steps. */
export const NEXT_STEPS = [
	"Zählercheck ansehen",
	"Adresse ergänzen",
	"Angebot per E-Mail erhalten",
	"Heidi meldet sich",
] as const;

/** The step each of the last steps is at in "So geht es weiter" (`sideNext`). */
export const NEXT_STEP_AT: Record<string, number> = {
	kontakt: 0,
	res: 1,
	adr: 1,
	ang: 2,
};

/** Who handles a check point and how (`chkInfo`). */
const CHECK_OWNERS: [RegExp, string, string][] = [
	[
		/Einbauart prüfen/,
		"Heidi",
		"Wir klären anhand Ihrer Fotos, ob der Zähler auf oder unter Putz sitzt. Falls nötig, fragen wir kurz nach.",
	],
	[
		/MID-Norm/,
		"Heidi",
		"Am Foto des Zählers erkennen wir die Norm des Einbausatzes und wählen die passende Messkapsel.",
	],
	[
		/Einbaulänge und Nennweite/,
		"Sie",
		"Bitte messen Sie die Länge des Zählers zwischen den Verschraubungen oder lesen Sie sie vom Typenschild ab. Ein Foto genügt auch.",
	],
	[
		/neuen Einbauplatz/,
		"Ihr Sanitärbetrieb",
		"Wo noch kein Zähler sitzt, muss vorab ein Anschlussstück in die Leitung eingebaut werden.",
	],
	[
		/Temperaturfühlergröße|Fühleraufnahme/,
		"Heidi",
		"Wir prüfen, ob die vorhandene Aufnahme für den Temperaturfühler passt. Ein Foto der Fühler hilft uns dabei.",
	],
	[
		/Fußbodenheizung/,
		"Heidi",
		"Bei Fußbodenheizung erfasst ein Wärmezähler den Verbrauch statt Heizkostenverteilern. Wir planen das passend.",
	],
	[
		/Heizkörpermaße/,
		"Sie",
		"Höhe, Länge und Tiefe der Heizkörper, gern auch als Foto. Damit wählen wir die richtige Befestigung.",
	],
	[
		/Zugangsschlüssel/,
		"Heidi",
		"Die digitalen Zugangsschlüssel fragen wir gemeinsam mit Ihnen beim bisherigen Messdienst an.",
	],
	[
		/Absperrbarkeit|kein Absperrventil/,
		"Ihr Sanitärbetrieb",
		"Vor dem Tausch muss sich die Leitung absperren lassen. Ist das nicht möglich, sind kleine Vorarbeiten nötig.",
	],
	[
		/Einbausätze und Rohrpassstücke/,
		"Heidi",
		"Einbausätze sind die Anschlussstücke, in die der Zähler eingeschraubt wird. Passen die vorhandenen nicht, liefern wir passende mit. Wir klären das anhand Ihrer Angaben und Fotos.",
	],
	[
		/Montage klären/,
		"Sie",
		"Entscheiden Sie, ob Ihr Hausinstallateur montiert oder Heidi. Gern beraten wir Sie dazu.",
	],
	[
		/schwer erreichbaren/,
		"Sie",
		"Bitte sorgen Sie für Zugang zu den Zählern, etwa über Schächte oder Revisionsöffnungen.",
	],
	[
		/Sanitärvorarbeiten durch Heidi/,
		"Heidi",
		"Wir suchen einen Sanitärbetrieb, stimmen Termine ab und weisen ihn ein.",
	],
	[
		/aus Ihren Unterlagen/,
		"Heidi",
		"Wir übernehmen die Zähler aus Ihren Unterlagen und schicken Ihnen die Liste zur Bestätigung.",
	],
	[
		/Leistungsumfang/,
		"Heidi",
		"Wir besprechen mit Ihnen, welche Leistungen Sie brauchen.",
	],
	[
		/Gateway-Anzahl/,
		"Heidi",
		"Bei größeren Gebäuden prüfen wir die Funkabdeckung und planen die Gateways.",
	],
	[/Kauf gewünscht/, "Heidi", "Die Kaufpreise ergänzen wir in Ihrem Angebot."],
	[
		/Kauf oder Miete/,
		"Heidi",
		"Wir zeigen Ihnen beide Varianten im Vergleich.",
	],
	[
		/Angebot erstellen/,
		"Heidi",
		"Wir ergänzen diese Leistung mit Preis in Ihrem Angebot.",
	],
];

export function checkOwner(point: string): [who: string, text: string] {
	const hit = CHECK_OWNERS.find(([re]) => re.test(point));
	return hit
		? [hit[1], hit[2]]
		: ["Heidi", "Wir klären diesen Punkt mit Ihnen."];
}

/** The offer: its validity (days, "wie im Muster: 19.10. bis einschließlich 18.12."). */
export const OFFER_VALID_DAYS = 60;

/** The rental term per device kind. */
export const TERMS_BY_DEVICE: Record<string, string> = {
	kwz: "6 Jahre",
	wwz: "6 Jahre",
	wmz: "6 Jahre",
	rwm: "10 Jahre",
	hkv: "10 Jahre",
	gw: "6 Jahre",
};

/** The offer's device names. */
export const OFFER_DEVICE: Record<string, string> = {
	kwz: "Funk Kaltwasserzähler",
	wwz: "Funk Warmwasserzähler",
	wmz: "Funk Wärmemengenzähler",
	hkv: "Funk Heizkostenverteiler",
	rwm: "Funk Rauchwarnmelder",
};

export type Feature = {
	img: "statement" | "dashboard" | "meter";
	h: string;
	p: string;
	b: string[];
};

/** The offer's first page: what's included (`feat`), for self-installation or not. */
export function features(self: boolean): Feature[] {
	return [
		{
			img: "statement",
			h: "Automatisierte Abrechnung und digitales Management",
			p: self
				? "Bestandsaufnahme, Gerätelieferung, Fernauslesung und Abrechnung kommen von uns. Die Montage übernehmen Sie oder Ihr Hausinstallateur, ganz ohne Vorkenntnisse. Die Heiz- und Wasserkostenabrechnung läuft vollständig digital und rechtssicher."
				: "Bestandsaufnahme, Gerätelieferung, Installation, Fernauslesung und Abrechnung kommen von uns. Ein Ansprechpartner, ein Installationstermin. Die Heiz- und Wasserkostenabrechnung läuft vollständig digital und rechtssicher.",
			b: [
				self
					? "Alles aus einer Hand, von der Lieferung bis zum laufenden Service"
					: "Alles aus einer Hand, von der Montage bis zum laufenden Service",
				"Gesetzeskonform nach Heizkostenverordnung, uVi nach EED bereits im Preis",
				"Heizkostenabrechnung auf Knopfdruck statt nach Monaten",
				self
					? "Montage durch Ihren Hausinstallateur, wir unterstützen bei Fragen"
					: "Wir übernehmen Installationstermin und Mieterkommunikation",
			],
		},
		{
			img: "dashboard",
			h: "Transparente Verbrauchs- und Mieterinformation",
			p: "Verwaltung, Eigentümer und Mieter sehen den Verbrauch für Heizung, Warm- und Kaltwasser tagesaktuell im Heidi-Portal. Das macht den Verbrauch bewusster und Einsparpotenziale sichtbar.",
			b: [
				"Tagesaktuelle Verbrauchsdaten für alle Beteiligten",
				"Eigener Mieterzugang ohne Aufpreis, mit persönlichem Login",
				"Übersicht zu Verbrauch, Kosten und CO₂-Ersparnis",
				"Automatische Hinweise bei Auffälligkeiten",
			],
		},
		{
			img: "meter",
			h: "Digitale Verbrauchserfassung und Frühwarnsystem",
			p: "Alle Geräte werden per Funk ausgelesen, tagesaktuell und ohne Wohnungszutritt. Unser KI-Monitoring erkennt Leckagen und auffällige Verbrauchsmuster früh, bevor aus einem unbemerkten Wasserschaden ein Vielfaches der Servicekosten wird.",
			b: [
				"Ablesung per Funk, ohne Termine, Zweitbesuche oder Schätzungen",
				"KI-Monitoring durch tägliche Auslesung",
				"Integrierte Leckageerkennung mit Benachrichtigung",
				"Schutz vor Wasserschäden und Folgekosten",
			],
		},
	];
}

/** The offer's terms. */
export const OFFER_TERMS = [
	"Die Vertragslaufzeit der gerätebezogenen Servicedienstleistungen entspricht jeweils der Mietlaufzeit des zugehörigen Geräts gemäß Geräteliste.",
	"Die Vertragslaufzeit der Abrechnungsdienstleistungen beträgt zwei Jahre.",
	"Dem Angebot liegen unsere Allgemeinen Geschäftsbedingungen (AGB) für die Gerätemiete sowie unseren Abrechnungsservice zugrunde.",
];

/** The sender block, the footer's four columns and the signatory. */
export const OFFER_COMPANY = {
	sender: ["Heidi Systems GmbH", "Monbijoupl. 4", "10178 Berlin"],
	footer: [
		["Heidi Systems GmbH", "Monbijoupl. 4", "10178 Berlin"],
		["www.heidisystems.com", "vertrieb@heidisystems.com", "Tel: 030 80098852"],
		[
			"Qonto Bank",
			"BANKVERBINDUNG",
			"IBAN: DE78100101232333630281",
			"BIC: QNTODEB2XXX",
		],
		[
			"Handelsregister: Berlin-Charlottenburg",
			"HRB 259535 B",
			"UST-IDNR: DE365219727",
			"Geschäftsführer: Paul Gerlach",
		],
	],
	signatory: "Paul Gerlach",
	mailbox: "vertrieb@heidisystems.com",
};
