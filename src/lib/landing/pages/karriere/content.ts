/**
 * Every text of /karriere ("Karriere"), word for word from the design.
 * Components hold markup and behaviour only.
 *
 * The jobs live here too: opening or closing a position is a change to
 * `jobs.list` (plus its id in `ROLE_IDS`, `$lib/forms/application.ts`). Every
 * count and option on the page is derived from that list.
 *
 * The company claims, the jobs, the privacy line and the fallback address need
 * sign-off before go-live (plan §4.4).
 */
import type { RoleId } from "$lib/forms/application";
import type { SplitHeading } from "$lib/landing/types";
import { ROUTE_DATENSCHUTZHINWEISE, ROUTE_UEBER_UNS } from "$lib/routes";
import type { IconName } from "./icons";

export type AreaId = "eng" | "ops" | "cs" | "sales";

export const hero = {
	pill: "Karriere bei Heidi",
	/** H1: text + the green `<em>` part. */
	h1: { text: "Bauen Sie mit uns den Messdienst", em: "von morgen." },
	lead: "Ab 2027 muss jeder Zähler in Deutschland aus der Ferne ablesbar sein. Wir sorgen dafür, dass Hausverwaltungen diesen Umstieg mit einer Unterschrift erledigen. Dafür bringen wir Funkzähler, Software und Service zusammen, von Berlin aus.",
	jobs: { text: "Offene Stellen", href: "#stellen" },
	initiative: "Initiativ bewerben",
};

export type FeedEvent = {
	icon: IconName;
	title: string;
	sub: string;
	/** Badge colour. */
	area: AreaId;
	/** Badge text: the feed says "Service" where the areas say "Kundenservice". */
	label: string;
};

export const feed = {
	title: "Ein Tag bei Heidi",
	badge: "Beispiel",
	label: "Beispiel: Ein Tag bei Heidi",
	pause: "Animation anhalten",
	resume: "Animation fortsetzen",
	/** In the order they appear; the newest is on top. */
	events: [
		{
			icon: "tool",
			title: "Montage abgeschlossen",
			sub: "Funkzähler in 24 Wohnungen installiert",
			area: "ops",
			label: "Operations",
		},
		{
			icon: "server",
			title: "Neues Release live",
			sub: "Dashboard: Filter für Liegenschaften",
			area: "eng",
			label: "Engineering",
		},
		{
			icon: "phone",
			title: "Rückfrage beantwortet",
			sub: "Hausverwaltung fragt nach Montagetermin",
			area: "cs",
			label: "Service",
		},
		{
			icon: "file",
			title: "Abrechnungen erstellt",
			sub: "Per Klick für ein ganzes Objekt",
			area: "eng",
			label: "Engineering",
		},
		{
			icon: "building",
			title: "Neue Verwaltung an Bord",
			sub: "Bestand wird übernommen",
			area: "sales",
			label: "Vertrieb",
		},
		{
			icon: "bell",
			title: "Verbrauchsinfo versendet",
			sub: "Monatlich an alle Mieter",
			area: "cs",
			label: "Service",
		},
		{
			icon: "cal",
			title: "Rollout geplant",
			sub: "Reihenfolge der Objekte festgelegt",
			area: "ops",
			label: "Operations",
		},
	] satisfies FeedEvent[] as FeedEvent[],
};

export const reasons = {
	eyebrow: "Warum Heidi",
	h2: {
		text: "Arbeit, die man sieht. ",
		muted: "In jedem Gebäude.",
	} satisfies SplitHeading,
	items: [
		{
			icon: "cal",
			title: "Eine klare Deadline",
			text: "Die Fernablesepflicht ab 2027 betrifft Bestände in ganz Deutschland. Was wir bauen, wird gebraucht, und zwar jetzt.",
			dark: true,
		},
		{
			icon: "hkv",
			title: "Hardware trifft Software",
			text: "Funkzähler, Montage, Dashboard und Abrechnung gehören bei uns zusammen. Sie sehen, wie Ihr Code im echten Gebäude ankommt.",
		},
		{
			icon: "users",
			title: "Kurze Wege",
			text: "Ein kleines Team in Berlin. Entscheidungen fallen am selben Tisch, an dem die Arbeit passiert.",
		},
		{
			icon: "bolt",
			title: "Echte Wirkung",
			text: "Mieter sehen jeden Monat ihren Verbrauch. Verwaltungen sparen sich Termine, Papier und Abtippen.",
		},
	] satisfies { icon: IconName; title: string; text: string; dark?: boolean }[],
};

export type Area = {
	id: AreaId;
	/** Label in the segmented control. */
	label: string;
	title: string;
	text: string;
	points: { icon: IconName; text: string }[];
};

export const areas = {
	eyebrow: "Bereiche",
	h2: {
		text: "Wo Sie bei Heidi ",
		muted: "mitwirken können.",
	} satisfies SplitHeading,
	/** Accessible name of the segmented control. */
	control: "Bereich",
	/** Link after an area's text when it has open positions. */
	openJobs: (n: number) =>
		n === 1 ? "1 offene Stelle" : `${n} offene Stellen`,
	openJobsLink: "ansehen",
	/** … and when it has none. */
	initiative: "Initiativbewerbung willkommen",
	initiativeLink: "bewerben",
	items: [
		{
			id: "eng",
			label: "Engineering",
			title: "Engineering",
			text: "Sie bauen die Software hinter Heidi: von der Anbindung der Funkzähler über das Dashboard bis zur Abrechnung auf Knopfdruck.",
			points: [
				{ icon: "signal", text: "Zählerdaten per Funk empfangen und prüfen" },
				{ icon: "chart", text: "Dashboard für Verwaltungen und Mieter" },
				{ icon: "file", text: "Heizkostenabrechnung nach HKVO automatisieren" },
			],
		},
		{
			id: "ops",
			label: "Operations",
			title: "Operations",
			text: "Sie sorgen dafür, dass Montagen planbar laufen: vom Rolloutplan über die Mieterinformation bis zur Abnahme vor Ort mit unseren Installationspartnern.",
			points: [
				{ icon: "cal", text: "Rollouts für ganze Bestände planen" },
				{
					icon: "tool",
					text: "Montagen mit Installationspartnern koordinieren",
				},
				{ icon: "users", text: "Mieter rechtzeitig informieren" },
			],
		},
		{
			id: "cs",
			label: "Kundenservice",
			title: "Kundenservice",
			text: "Sie sind der persönliche Ansprechpartner für Hausverwaltungen und ihre Mieter, von der ersten Frage bis zur fertigen Abrechnung.",
			points: [
				{ icon: "phone", text: "Fester Kontakt für Verwaltungen" },
				{ icon: "bell", text: "Fragen zur Verbrauchsinformation klären" },
				{ icon: "file", text: "Bei Abrechnungen unterstützen" },
			],
		},
		{
			id: "sales",
			label: "Vertrieb",
			title: "Vertrieb",
			text: "Sie zeigen Hausverwaltungen, wie einfach der Wechsel zu Heidi ist, und begleiten sie vom Portfolio-Check bis zum Start.",
			points: [
				{
					icon: "building",
					text: "Hausverwaltungen in ganz Deutschland gewinnen",
				},
				{ icon: "chart", text: "Bestände und Vertragsenden analysieren" },
				{ icon: "users", text: "Demos und Erstgespräche führen" },
			],
		},
	] satisfies Area[] as Area[],
};

export type Job = {
	id: RoleId;
	title: string;
	sub: string;
	area: AreaId;
	location: string;
	/** Option text in the form's role select and in the success message. */
	formLabel: string;
	build: string[];
	bring: string[];
	applyLabel: string;
};

/** The open application: always listed after the jobs, and a form option. */
export type OpenApplication = {
	id: RoleId;
	title: string;
	sub: string;
	/** Its tag instead of an area. */
	tag: string;
	location: string;
	text: string;
	formLabel: string;
	applyLabel: string;
};

export const jobs = {
	eyebrow: "Offene Stellen",
	h2: {
		text: "Aktuell suchen wir. ",
		muted: "Und freuen uns auf Initiative.",
	} satisfies SplitHeading,
	buildTitle: "Was Sie bauen",
	bringTitle: "Was Sie mitbringen",
	list: [
		{
			id: "frontend-engineer",
			title: "Frontend Engineer",
			sub: "SvelteKit · TypeScript",
			area: "eng",
			location: "Berlin",
			formLabel: "Frontend Engineer (SvelteKit, TypeScript)",
			build: [
				"Das Dashboard, in dem Verwaltungen alle Liegenschaften und Verbräuche sehen",
				"Oberflächen für Abrechnung, Mieterkommunikation und Montageplanung",
				"Schnelle, verständliche Werkzeuge für Menschen ohne Technikhintergrund",
			],
			bring: [
				"Erfahrung mit SvelteKit und TypeScript",
				"Freude an sauberen, gut bedienbaren Oberflächen",
				"Lust, eng mit Kundenservice und Operations zu arbeiten",
			],
			applyLabel: "Auf diese Stelle bewerben",
		},
	] satisfies Job[] as Job[],
	initiative: {
		id: "initiative",
		title: "Initiativbewerbung",
		sub: "Ihre Stelle ist nicht dabei?",
		tag: "Alle Bereiche",
		location: "Berlin",
		text: "Sie wollen den Messdienst mit uns neu bauen, egal ob in Engineering, Operations, Kundenservice oder Vertrieb? Schreiben Sie uns, was Sie können und was Sie bei Heidi bewegen möchten.",
		formLabel: "Initiativbewerbung",
		applyLabel: "Initiativ bewerben",
	} satisfies OpenApplication as OpenApplication,
};

/** The jobs and the open application, in the form's order. */
export const roles: { id: RoleId; formLabel: string }[] = [
	...jobs.list,
	jobs.initiative,
];

export const roleLabel = (id: RoleId) =>
	roles.find((role) => role.id === id)?.formLabel ?? "";

export const jobsInArea = (area: AreaId) =>
	jobs.list.filter((job) => job.area === area).length;

export const process = {
	eyebrow: "Bewerbungsprozess",
	h2: { text: "Drei Schritte. ", muted: "Ohne Umwege." } satisfies SplitHeading,
	steps: [
		{
			title: "Kennenlernen",
			text: "Ein kurzes Gespräch: Wer sind Sie, was suchen Sie, was macht Heidi?",
		},
		{
			title: "Fachliches Gespräch",
			text: "Wir sprechen über konkrete Aufgaben aus Ihrem Bereich, mit den Menschen, mit denen Sie arbeiten würden.",
		},
		{
			title: "Entscheidung",
			text: "Sie bekommen eine klare Rückmeldung. Passt es, starten wir gemeinsam.",
		},
	],
};

export const apply = {
	eyebrow: "Bewerben",
	h2: { text: "Erzählen Sie uns ", muted: "von sich." } satisfies SplitHeading,
	lead: "Ein Lebenslauf ist schön, ein paar ehrliche Sätze sind uns wichtiger. Wir melden uns bei Ihnen.",
	ticks: [
		"Kein Anschreiben nötig",
		"Link zu LinkedIn, GitHub oder Portfolio genügt",
	],
	fields: {
		role: "Stelle",
		name: { label: "Name", placeholder: "Vor- und Nachname" },
		email: { label: "E-Mail", placeholder: "name@beispiel.de" },
		link: {
			label: "Link",
			optional: "optional",
			placeholder: "LinkedIn, GitHub oder Portfolio",
		},
		message: {
			label: "Ein paar Sätze zu Ihnen",
			placeholder: "Was können Sie, und was möchten Sie bei Heidi bewegen?",
		},
	},
	/** The design's one-line error: "Bitte ergänzen Sie " + the missing parts joined by " und ". */
	missing: {
		prefix: "Bitte ergänzen Sie ",
		name: "Ihren Namen",
		email: "eine gültige E-Mail-Adresse",
		join: " und ",
	},
	submit: "Bewerbung absenden",
	sending: "Wird gesendet …",
	successTitle: "Danke für Ihre Bewerbung!",
	successText: (formLabel: string) =>
		`Ihre Bewerbung als „${formLabel}“ ist angekommen. Wir melden uns bei Ihnen.`,
	again: "Weitere Bewerbung",
	// Draft, not a consent line: the final text comes from legal (open question 3).
	privacy: {
		before: "Wie wir mit Ihren Daten umgehen, lesen Sie in den ",
		link: "Datenschutzhinweisen",
		href: ROUTE_DATENSCHUTZHINWEISE,
		after: ".",
	},
	// The address is a placeholder until business names one (open question 2).
	fallbackEmail: "jobs@heidisystems.com",
	sendError: {
		before:
			"Ihre Bewerbung konnte gerade nicht gesendet werden. Bitte versuchen Sie es erneut oder schreiben Sie uns an ",
		after: ".",
	},
};

export const more = {
	title: "Mehr über Heidi erfahren?",
	cta: { text: "Über uns", href: ROUTE_UEBER_UNS },
};

export const trustMore = { text: "Mehr über Heidi", href: ROUTE_UEBER_UNS };
