/**
 * Every text of /upgrade-now ("Jetzt noch umrüsten"), word for word from the
 * design. Components hold markup and behaviour only. Date-dependent words
 * ("knapp drei Monate", "Noch 85 Tage") come from `deadline.ts`.
 *
 * Every legal statement here (dates, §§, 3 %, 15 %, the WEG note, the FAQ)
 * needs legal sign-off before go-live (plan §5.4). The `expired` texts are
 * placeholders until the content owner writes them (plan open question 3).
 */
import type { FaqItem } from "$lib/landing/sections/Faq.svelte";

/** A heading with a muted second part (`<span>` in the design). */
export type SplitHeading = { text: string; muted?: string };

const nbsp = "\u00a0";

export const hero = {
	pill: "Heizkostenverordnung · Nachrüstpflicht nach § 5 Abs. 3",
	/** H1: before + the dynamic `<em>` (monthsText) + after. */
	h1Before: "Nur noch",
	h1After: "bis zur Umrüstpflicht.",
	/** May contain <b>. */
	lede: `Bis zum <b>31. Dezember 2026</b> müssen alle Heizkostenverteiler, Wärme- und Warmwasserzähler fernablesbar sein. Danach dürfen Mieter ihren Anteil an den Heizkosten um 3${nbsp}% kürzen, Jahr für Jahr.`,
	countdownLabel: "Countdown bis zum 31. Dezember 2026, 24 Uhr",
	units: ["Tage", "Stunden", "Minuten", "Sekunden"],
	yearLabel: "Jahresfortschritt 2026",
	cta: "Umrüstung anfragen",
	ctaRisk: "Kürzungsrisiko berechnen",
	facts: [
		"Installation kostenlos",
		`92${nbsp}% der Montagen beim ersten Termin`,
		"Mieter 14 Tage vorher informiert",
	],
	expired: {
		/** Placeholder (open question 3). */
		h1: "Die Umrüstpflicht gilt jetzt.",
		/** Placeholder (open question 3). May contain <b>. */
		lede: `Seit dem <b>1. Januar 2027</b> müssen alle Heizkostenverteiler, Wärme- und Warmwasserzähler fernablesbar sein. Ohne fernablesbare Geräte dürfen Mieter ihren Anteil an den Heizkosten um 3${nbsp}% kürzen, Jahr für Jahr.`,
		/** The design's `um-over` paragraph. */
		note: "Die Frist ist abgelaufen. Jeder Abrechnungszeitraum ohne fernablesbare Geräte kann jetzt gekürzt werden. Umrüsten lohnt sich trotzdem sofort.",
	},
};

export const logoStripText =
	"Hausverwaltungen in ganz Deutschland rechnen bereits mit Heidi ab.";

export type DeadlineEntry = {
	date: string;
	/** From this instant on the entry is `done`. */
	from: number;
	title: string;
	text: string;
	/** The retrofit deadline itself: highlighted, with the day count. */
	current?: boolean;
};

export const deadlines = {
	eyebrow: "Was die Heizkostenverordnung verlangt",
	h2: { text: "Vier Fristen. Eine davon läuft ", muted: "gerade ab." },
	/** Placeholder (open question 3). */
	h2Expired: {
		text: "Vier Fristen. Eine davon ist ",
		muted: "gerade abgelaufen.",
	},
	entries: [
		{
			date: "01.12.2021",
			from: Date.UTC(2021, 10, 30, 23),
			title: "Neue Geräte fernablesbar",
			text: "Was seitdem neu eingebaut wird, muss ohne Zutritt zur Wohnung ablesbar sein.",
		},
		{
			date: "01.01.2022",
			from: Date.UTC(2021, 11, 31, 23),
			title: "Monatliche Verbrauchsinfo",
			text: "Bei fernablesbaren Geräten erhalten Mieter jeden Monat ihren Verbrauch, mit Vormonats- und Vorjahresvergleich.",
		},
		{
			date: "31.12.2026",
			from: Date.UTC(2026, 11, 31, 23),
			title: "Nachrüstpflicht für den Bestand",
			text: "Alle noch nicht fernablesbaren Heizkostenverteiler und Zähler müssen nachgerüstet oder ausgetauscht sein.",
			current: true,
		},
		{
			date: "31.12.2031",
			from: Date.UTC(2031, 11, 31, 23),
			title: "Anbindung an Smart-Meter-Gateway",
			text: "Fernablesbare Geräte müssen dann auch an ein Smart-Meter-Gateway angebunden werden können.",
		},
	] satisfies DeadlineEntry[],
};

export type ConsequenceCard = {
	value: number;
	prefix?: string;
	suffix: string;
	title: string;
	text: string;
	source: string;
	/** The dark, highlighted card. */
	hot?: boolean;
};

export const consequences = {
	eyebrow: "Ab 1. Januar 2027",
	eyebrowExpired: "Seit 1. Januar 2027",
	h2: { text: "Was passiert, wenn nicht ", muted: "umgerüstet ist." },
	cards: [
		{
			value: 3,
			suffix: "%",
			title: "Kürzungsrecht für Mieter",
			text: `Fehlen fernablesbare Geräte, dürfen Mieter ihren Anteil an den Heiz- und Warmwasserkosten um 3${nbsp}% kürzen. Für jeden Abrechnungszeitraum, bis umgerüstet ist.`,
			source: "§ 12 Abs. 1 HeizkostenV",
			hot: true,
		},
		{
			value: 12,
			suffix: "×",
			title: "Verbrauchsinfo pro Jahr",
			text: `Mieter mit fernablesbaren Geräten müssen monatlich über ihren Verbrauch informiert werden. Fehlt die Information, greift ebenfalls das Kürzungsrecht von 3${nbsp}%.`,
			source: "§ 6a HeizkostenV",
		},
		{
			value: 15,
			prefix: "+",
			suffix: "%",
			title: "Kürzungen addieren sich",
			text: `Wird zusätzlich nicht verbrauchsabhängig abgerechnet, kommen weitere 15${nbsp}% hinzu. Die Kürzungsrechte können nebeneinander bestehen.`,
			source: "§ 12 Abs. 1 HeizkostenV",
		},
	] satisfies ConsequenceCard[],
	weg: {
		lead: "Für WEG-Verwaltungen:",
		text: "Die Nachrüstpflicht trifft die Eigentümergemeinschaft. Das Kürzungsrecht besteht zwischen Mieter und Vermieter, betrifft also vor allem vermietende Eigentümer.",
	},
};

export const calculator = {
	eyebrow: "Kürzungsrisiko",
	h2: { text: "Was Warten Ihren Bestand ", muted: "kosten kann." },
	units: "Wohneinheiten",
	cost: "Heiz- und Warmwasserkosten je Wohnung und Jahr",
	costAria: "Heizkosten je Wohnung und Jahr",
	costHint: "Ihr Durchschnittswert aus der letzten Abrechnung",
	share: "Davon noch nicht fernablesbar",
	shareAria: "Anteil nicht fernablesbar",
	switchLabel: "Vor dem 31.12. mit Heidi umgerüstet",
	/** Placeholder (open question 3). */
	switchLabelExpired: "Mit Heidi umgerüstet",
	switchHint: "Und sehen, was dann übrig bleibt.",
	risk: {
		label: "Mögliche Kürzung je Abrechnungszeitraum",
		text: "Diesen Betrag können Sie nicht umlegen, jedes Jahr aufs Neue, bis umgerüstet ist.",
	},
	safe: {
		label: "Kürzung wegen fehlender Fernablesbarkeit",
		text: "Rechtzeitig fernablesbar: Dieses Kürzungsrecht greift nicht. Die monatliche Verbrauchsinfo verschickt Heidi automatisch.",
	},
	base: "Betroffene Heizkosten",
	perUnit: "Je betroffener Wohnung",
	cta: "Kürzung vermeiden",
	note: `Vereinfachte Rechnung: 3${nbsp}% der Heiz- und Warmwasserkosten der betroffenen Wohnungen. Keine Rechtsberatung.`,
};

export type Step = {
	title: string;
	text: string;
	timing: string;
	/** Replaces `timing` once the deadline has passed. */
	timingExpired?: string;
};

export const timeWindow = {
	eyebrow: "Ihr Zeitfenster",
	h2: { text: "Jeder Werktag zählt. ", muted: "So viele sind es noch." },
	kpis: {
		workdays: "Werktage",
		weeks: "Wochen",
		holidays: "bundesweite Feiertage",
	},
	weekdays: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
	/** "N Werktage übrig" under each month. */
	workdaysLeft: (n: number) => `${n} Werktage übrig`,
	legend: {
		past: "vergangen",
		today: "heute",
		workday: "Werktag",
		holiday: "Feiertag",
		deadline: "Frist",
	},
	steps: [
		{
			title: "Bestand prüfen",
			text: "Der kostenlose Portfolio-Check zeigt, welche Liegenschaften noch nicht fernablesbar sind und wann Ihre Messdienstverträge enden.",
			timing: "Heute",
		},
		{
			title: "Angebot erhalten",
			text: "Abgerechnet wird pro tatsächlich installiertem Zähler, dazu eine Abrechnungspauschale. Die Installation ist kostenlos.",
			timing: "Nach dem Check",
		},
		{
			title: "Mieter informieren",
			text: "Heidi kündigt jeden Montagetermin 14 Tage vorher an und stimmt den Zugang mit Ihnen oder dem Hausmeister ab.",
			timing: "14 Tage vor Montage",
		},
		{
			title: "Montage",
			text: `Mieter erhalten ein Zeitfenster von 1–2 Stunden. 92${nbsp}% der Installationen gelingen beim ersten Termin.`,
			timing: "Vor dem 31.12.",
			/** Placeholder (open question 3). */
			timingExpired: "So bald wie möglich",
		},
	] satisfies Step[],
	final: {
		title: "Fernablesbar",
		text: "Ablesung per Funk, monatliche Verbrauchsinfo automatisch an alle Mieter, Heizkostenabrechnung per Klick.",
		timing: "Pflicht erfüllt",
	},
};

export type BentoIcon = "tools" | "switch" | "bell" | "calculator";

export const whyHeidi = {
	h2: {
		text: "Umrüsten mit Heidi. ",
		muted: "Ohne Aufwand für Ihre Verwaltung.",
	},
	big: {
		title: "Funkzähler, fernablesbar nach HeizkostenV",
		text: "Alle Heidi-Geräte werden per Funk abgelesen. Damit sind fernablesbare Ausstattung und monatliche Verbrauchsinformation abgedeckt.",
	},
	cards: [
		{
			icon: "tools",
			title: "Kostenlose Installation",
			text: "Sie zahlen nur für installierte Zähler und die Abrechnungspauschale.",
		},
		{
			icon: "switch",
			title: "Wechsel inklusive",
			text: "Wir prüfen Ihre Vertragsenden, kündigen mit Ihrer Vollmacht oder übernehmen bestehende Verträge.",
		},
		{
			icon: "bell",
			title: "Verbrauchsinfo automatisch",
			text: "Heidi versendet die monatliche Verbrauchsinformation an alle Mieter.",
		},
		{
			icon: "calculator",
			title: "Abrechnung per Klick",
			text: "Direkt in Ihre ERP- und CRM-Systeme, ohne Softwarewechsel.",
		},
	] satisfies { icon: BentoIcon; title: string; text: string }[],
};

export const testimonialsTitle = "Was Verwaltungen über Heidi sagen";

export const faq: { title: string; lead: string; items: FaqItem[] } = {
	title: "Häufige Fragen zur Umrüstpflicht",
	lead: "Rechtsgrundlage ist die Heizkostenverordnung in der Fassung vom 1. Dezember 2021, insbesondere §§ 5, 6a und 12. Diese Seite ersetzt keine Rechtsberatung.",
	items: [
		{
			question: "Was bedeutet „fernablesbar“?",
			answer:
				"Ein Gerät ist fernablesbar, wenn es ohne Zugang zu den einzelnen Wohnungen abgelesen werden kann (§ 5 Abs. 2 HeizkostenV). Heidi-Geräte werden per Funk abgelesen.",
		},
		{
			question: "Welche Geräte sind betroffen?",
			answer:
				"Die Pflicht betrifft die Ausstattung zur Verbrauchserfassung von Wärme und Warmwasser, also Heizkostenverteiler, Wärmezähler und Warmwasserzähler.",
		},
		{
			question: "Was passiert, wenn wir die Frist verpassen?",
			answer: `Ab dem 1. Januar 2027 dürfen Mieter ihren Anteil an den Heiz- und Warmwasserkosten um 3${nbsp}% kürzen, für jeden Abrechnungszeitraum, in dem die Geräte nicht fernablesbar sind (§ 12 Abs. 1 HeizkostenV).`,
		},
		{
			question: "Gibt es Ausnahmen?",
			answer:
				"Nur wenn die Nachrüstung im Einzelfall technisch nicht möglich ist oder wegen besonderer Umstände eine unbillige Härte wäre (§ 5 Abs. 3 HeizkostenV). Die Ausnahmen werden eng ausgelegt.",
		},
		{
			question: "Gilt die Pflicht auch für WEGs?",
			answer:
				"Ja, die Nachrüstpflicht trifft die Eigentümergemeinschaft. Das Kürzungsrecht besteht allerdings nur zwischen Mieter und Vermieter, nicht zwischen Eigentümer und Gemeinschaft.",
		},
		{
			question: "Unser Messdienstvertrag läuft noch. Was nun?",
			answer:
				"Im kostenlosen Portfolio-Check sehen wir, wann Ihre Verträge enden und welche Liegenschaften betroffen sind. Danach kündigen wir mit Ihrer Vollmacht oder übernehmen bestehende Verträge.",
		},
		{
			question: "Was kostet die Umrüstung mit Heidi?",
			answer:
				"Die Installation ist kostenlos. Abgerechnet wird pro tatsächlich installiertem Zähler, dazu eine Abrechnungspauschale. Ein konkretes Angebot erhalten Sie nach dem Portfolio-Check.",
		},
	],
};

export const finalCta = {
	title: "Genug Zeit, wenn Sie jetzt anfangen.",
	/** Placeholder (open question 3). */
	titleExpired: "Umrüsten lohnt sich trotzdem sofort.",
	submitLabel: "Umrüstung anfragen",
};
