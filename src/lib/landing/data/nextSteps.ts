/**
 * The per-property list "Für jede Liegenschaft der nächste Schritt" (the
 * designs' `.pl` card): its seven example rows, the three recommendations'
 * explanations and labels, and its filter (pure). /plattform/dashboard and
 * /portfolio-check show it through `$lib/landing/sections/NextSteps.svelte`;
 * both designs carry the same texts and thumbnails.
 */

export const NEXT_STEP_KINDS = ["take", "cancel", "bill"] as const;
export type NextStepKind = (typeof NEXT_STEP_KINDS)[number];
export type NextStepFilter = "all" | NextStepKind;

export type NextStep = {
	name: string;
	units: string;
	status: string;
	detail: string;
	kind: NextStepKind;
	/** Thumbnail number, `dashboard/property-<n>.jpg`. */
	photo: number;
};

export const nextSteps = {
	filterLabel: "Empfehlungen filtern",
	filters: {
		all: "Alle",
		take: "Vertrag direkt übernehmen",
		cancel: "Vertrag kündigen",
		bill: "Heizkostenabrechnung",
	},
	search: "Liegenschaft suchen",
	columns: ["Liegenschaft", "Status", "Empfehlung"],
	checking: "Wird geprüft",
	running: "Bestand wird geprüft …",
	done: (n: number) => `${n} Liegenschaften geprüft`,
	results: (n: number) => (n === 1 ? "1 Liegenschaft" : `${n} Liegenschaften`),
	badge: "Beispieldaten",
	rows: [
		{
			name: "Lindenallee 12",
			units: "36 Einheiten",
			status: "Vertrag läuft bis 03/2029",
			detail: "Heidi übernimmt die Zähler sofort",
			kind: "take",
			photo: 1,
		},
		{
			name: "Gartenweg 3",
			units: "12 Einheiten",
			status: "Vertrag endet 12/2026",
			detail: "Kündigung per Vollmacht",
			kind: "cancel",
			photo: 2,
		},
		{
			name: "Bergmannstraße 4",
			units: "24 Einheiten",
			status: "Heidi-Funkzähler aktiv",
			detail: "Abrechnung 2026 bereit",
			kind: "bill",
			photo: 3,
		},
		{
			name: "Am Stadtpark 7",
			units: "32 Einheiten",
			status: "Vertrag endet 08/2027",
			detail: "Rechtzeitig kündigen",
			kind: "cancel",
			photo: 4,
		},
		{
			name: "Mühlenstraße 18",
			units: "18 Einheiten",
			status: "Vertrag läuft bis 2030",
			detail: "Heidi übernimmt die Zähler sofort",
			kind: "take",
			photo: 5,
		},
		{
			name: "Schillerhöfe",
			units: "48 Einheiten",
			status: "Heidi-Funkzähler aktiv",
			detail: "Abrechnung 2026 bereit",
			kind: "bill",
			photo: 6,
		},
		{
			name: "Hofstraße 21",
			units: "18 Einheiten",
			status: "Vertrag endet 01/2027",
			detail: "Kündigung per Vollmacht",
			kind: "cancel",
			photo: 7,
		},
	] satisfies NextStep[] as NextStep[],
	info: {
		take: {
			title: "Vertrag direkt übernehmen",
			text: "Der bisherige Vertrag läuft noch länger. Heidi übernimmt die vorhandenen Zähler und wertet sie sofort aus, unabhängig von der Restlaufzeit.",
			steps: [
				"Vollmacht unterschreiben",
				"Heidi übernimmt die Zähler",
				"Abrechnung ab sofort über Heidi",
			],
			note: "Kein Warten auf das Vertragsende",
		},
		cancel: {
			title: "Vertrag kündigen",
			text: "Der Vertrag endet bald. Heidi kündigt fristgerecht beim bisherigen Messdienst und plant den Einbau der Funkzähler zum Vertragsende.",
			steps: [
				"Vollmacht unterschreiben",
				"Heidi kündigt fristgerecht",
				"Funkzähler zum Vertragsende",
			],
			note: "Mieter werden 14 Tage vor der Montage informiert",
		},
		bill: {
			title: "Heizkostenabrechnung",
			text: "Die Heidi-Funkzähler senden alle Verbräuche. Die Abrechnung nach HKVO ist bereit und entsteht per Klick.",
			steps: [
				"Verbräuche geprüft",
				"Kosten nach HKVO verteilt",
				"Abrechnung an Ihre Software",
			],
			note: "Für jede Einheit einzeln",
		},
	} satisfies Record<
		NextStepKind,
		{ title: string; text: string; steps: string[]; note: string }
	>,
};

export type NextStepsContent = typeof nextSteps;

/** The rows with the given kind (or every kind) whose name contains `query`. */
export function filterNextSteps<T extends { name: string; kind: NextStepKind }>(
	rows: readonly T[],
	kind: NextStepFilter,
	query: string,
): T[] {
	const q = query.trim().toLowerCase();
	return rows.filter(
		(row) =>
			(kind === "all" || row.kind === kind) &&
			(!q || row.name.toLowerCase().includes(q)),
	);
}

/** How many rows there are per kind, and in total. */
export function countByKind(
	rows: readonly { kind: NextStepKind }[],
): Record<NextStepFilter, number> {
	const counts = { all: rows.length, take: 0, cancel: 0, bill: 0 };
	for (const row of rows) counts[row.kind]++;
	return counts;
}
