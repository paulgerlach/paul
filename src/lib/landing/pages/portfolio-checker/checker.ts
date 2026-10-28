/**
 * The Portfolio-Checker's logic (the design's `#pc-js`), pure: the check of a
 * chosen file (only its name and size: nothing is read), the example
 * evaluation of the five example files for a calendar day, its key figures
 * and its CSV. Days are `fristenrechner/fristen.ts`' calendar days (UTC
 * midnight), "today" the Berlin date of the page's `DeadlineClock`.
 */
import {
	day,
	daysBetween,
	formatDate,
	type Day,
} from "$lib/landing/pages/fristenrechner/fristen";

export type FileKind = "pdf" | "img" | "doc";

/** The design's `t`: an image by its extension, a PDF, anything else a document. */
export function fileKind(name: string): FileKind {
	const ext = (name.split(".").pop() ?? "").toLowerCase();
	if (/jpe?g|png|tiff?|heic/.test(ext)) return "img";
	return ext === "pdf" ? "pdf" : "doc";
}

/** Files above this size aren't checked (the design's 25 MB). */
export const MAX_BYTES = 25e6;

/** The design's `OKX` and size limit: a PDF, a photo or a scan under 25 MB. */
export function isAccepted(name: string, size: number): boolean {
	return /\.(pdf|jpe?g|png|tiff?|heic)$/i.test(name) && size < MAX_BYTES;
}

/** 842000 → "842 KB", 2400000 → "2,4 MB" (the design's `size()`). */
export function formatSize(bytes: number): string {
	if (bytes >= 1e6)
		return `${(bytes / 1e6).toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MB`;
	return `${Math.max(1, Math.round(bytes / 1e3))} KB`;
}

/** "1 Dokument", "5 Dokumente". */
export const documentCount = (n: number) =>
	`${n} ${n === 1 ? "Dokument" : "Dokumente"}`;

const yearOf = (t: Day) => new Date(t).getUTCFullYear();
const monthOf = (t: Day) => new Date(t).getUTCMonth();

/** The last day of `month` (0-based, may run over) in `year`. */
export const lastOfMonth = (year: number, month: number): Day =>
	day(year, month + 1, 0);

/** The last day of the month `months` before `end`'s month (the design's `minusMonths`). */
export const noticeDate = (end: Day, months: number): Day =>
	lastOfMonth(yearOf(end), monthOf(end) - months);

/**
 * A contract ending on `end` with `notice` months' notice, renewed by
 * `renewal` months whenever its notice date has passed: its next end and the
 * date by which it must be terminated, from `today` on (the design's `next()`).
 */
export function rollForward(
	end: Day,
	notice: number,
	renewal: number,
	today: Day,
): { end: Day; by: Day; rolled: boolean } {
	let e = end;
	let by = noticeDate(e, notice);
	let rolled = false;
	while (by < today) {
		e = lastOfMonth(yearOf(e), monthOf(e) + renewal);
		by = noticeDate(e, notice);
		rolled = true;
	}
	return { end: e, by, rolled };
}

export type Tone = "hl" | "ok";
export type Field = { label: string; value: string; tone?: Tone };
/** g: noted, y: to watch, r: high priority. */
export type Hint = { tone: "g" | "y" | "r"; text: string };
export type Recommendation = {
	kind: "take" | "cancel";
	title: string;
	text: string;
};
export type Property = {
	key: "A" | "B" | "C";
	name: string;
	sub: string;
	fields: Field[];
	hints: Hint[];
	recommendation: Recommendation;
	/** The date by which the contract must be terminated. */
	by: Day;
};

/** The obligation to read meters remotely starts on this day. */
const REMOTE_DUTY: Day = day(2027, 0, 1);

const TAKE: Recommendation = {
	kind: "take",
	title: "Vertrag direkt übernehmen",
	text: "Heidi übernimmt die vorhandenen Zähler sofort, unabhängig von der Restlaufzeit.",
};
const cancel = (text: string): Recommendation => ({
	kind: "cancel",
	title: "Vertrag kündigen",
	text,
});

/**
 * The three example properties the five example files describe, as of
 * `today` (fictitious contracts; the design's `props()`).
 */
export function exampleEvaluation(today: Day): Property[] {
	const y = yearOf(today);
	const fmt = formatDate;
	const inDays = (t: Day) => daysBetween(today, t);
	const a = rollForward(day(y + 1, 11, 31), 3, 12, today);
	const b = rollForward(day(y, 11, 31), 6, 12, today);
	const c = rollForward(day(y + 1, 5, 30), 3, 12, today);

	const contract = (
		provider: string,
		number: string,
		start: string,
		term: { end: Day; by: Day },
		notice: string,
	): Field[] => [
		{ label: "Anbieter", value: provider },
		{ label: "Vertragsnummer", value: number },
		{ label: "Vertragsbeginn", value: start },
		{ label: "Laufzeit bis", value: fmt(term.end) },
		{ label: "Verlängerung", value: "um 12 Monate" },
		{ label: "Kündigungsfrist", value: notice },
		{ label: "Kündigung bis", value: fmt(term.by), tone: "hl" },
	];

	return [
		{
			key: "A",
			name: "Lindenallee 12",
			sub: "18 Einheiten · Mietverwaltung",
			by: a.by,
			fields: [
				...contract(
					"Messdienst A",
					"MD-48120",
					`01.01.${y - 5}`,
					a,
					"3 Monate zum Laufzeitende",
				),
				{
					label: "Geräte",
					value: "54 Heizkostenverteiler, 18 Warmwasserzähler",
				},
				{ label: "Kosten", value: "1.284 € pro Jahr" },
				{ label: "Fernablesbar", value: "Ja", tone: "ok" },
				{
					label: "Nächste Eichfrist",
					value: `Warmwasserzähler 31.12.${y + 2}`,
				},
				{ label: "Abrechnungsdienst", value: "inklusive" },
			],
			hints: [
				{
					tone: "g",
					text: `Nachtrag aus ${y - 3} berücksichtigt: Laufzeit verlängert bis ${fmt(day(y + 1, 11, 31))}.`,
				},
				{
					tone: "y",
					text: `Kündigung bis ${fmt(a.by)} möglich, in ${inDays(a.by)} Tagen.`,
				},
				{
					tone: "g",
					text: "Preisblatt zugeordnet: Gerätemiete und Ablesung pro Einheit.",
				},
			],
			recommendation: TAKE,
		},
		{
			key: "B",
			name: "Parkstraße 4",
			sub: "12 Einheiten · WEG",
			by: b.by,
			fields: [
				...contract(
					"Messdienst B",
					"GM-2017-0933",
					`01.01.${y - 9}`,
					b,
					"6 Monate zum Laufzeitende",
				),
				{
					label: "Geräte",
					value: "36 Heizkostenverteiler, 12 Kaltwasserzähler",
				},
				{ label: "Kosten", value: "968 € pro Jahr" },
				{ label: "Fernablesbar", value: "Nein", tone: "hl" },
				{
					label: "Nächste Eichfrist",
					value: `Kaltwasserzähler 31.12.${y + 1}`,
				},
				{ label: "Abrechnungsdienst", value: "separat vereinbart" },
			],
			hints: [
				...(b.rolled
					? [
							{
								tone: "r" as const,
								text: `Kündigungsfrist zum ${fmt(day(y, 11, 31))} verpasst: Der Vertrag verlängert sich bis ${fmt(b.end)}.`,
							},
						]
					: []),
				{
					tone: "r",
					text:
						today < REMOTE_DUTY
							? "Geräte nicht fernablesbar: Nachrüstung bis 31.12.2026 vorgeschrieben."
							: "Geräte nicht fernablesbar: Pflicht seit 01.01.2027, Mieter können 3 % kürzen.",
				},
				{
					tone: "y",
					text: "WEG: Wechsel vor der nächsten Eigentümerversammlung beschließen.",
				},
			],
			recommendation: cancel(
				"Geräte nicht fernablesbar. Heidi kündigt fristgerecht per Vollmacht und rüstet um.",
			),
		},
		{
			key: "C",
			name: "Am Markt 7",
			sub: "26 Einheiten · Hausverwaltung",
			by: c.by,
			fields: [
				...contract(
					"Messdienst C",
					"WM-55/1820",
					`01.07.${y - 4}`,
					c,
					"3 Monate zum Laufzeitende",
				),
				{
					label: "Geräte",
					value: "78 Heizkostenverteiler, 26 Warmwasserzähler",
				},
				{ label: "Kosten", value: "1.912 € pro Jahr" },
				{ label: "Fernablesbar", value: "Ja", tone: "ok" },
				{
					label: "Nächste Eichfrist",
					value: `Warmwasserzähler 30.06.${y + 1}`,
				},
				{ label: "Abrechnungsdienst", value: "inklusive" },
			],
			hints: [
				{
					tone: "y",
					text: "Scan: Seite 2 unscharf. Laufzeit und Frist sind auf Seite 1 und 3 bestätigt.",
				},
				{
					tone: "y",
					text: `Kündigung bis ${fmt(c.by)}, in ${inDays(c.by)} Tagen.`,
				},
			],
			recommendation: cancel(
				"Kündigungsfrist naht. Heidi kündigt fristgerecht per Vollmacht.",
			),
		},
	];
}

/** The fields the overview's popover shows, in the design's order (`KEYS`). */
export const OVERVIEW_FIELDS = [
	"Anbieter",
	"Vertragsnummer",
	"Laufzeit bis",
	"Kündigungsfrist",
	"Kündigung bis",
	"Geräte",
	"Kosten",
	"Fernablesbar",
];

/** A property's field by its label ("" if it has none). */
export const fieldValue = (p: Property, label: string) =>
	p.fields.find((f) => f.label === label)?.value ?? "";

/** The evaluation's four figures (the design's `#pc-kpis`). */
export function kpis(properties: Property[], today: Day, files: number) {
	const next = [...properties].sort((x, y) => x.by - y.by)[0];
	return {
		documents: files,
		properties: properties.length,
		next: {
			date: formatDate(next.by),
			name: next.name,
			days: daysBetween(today, next.by),
		},
		urgent: properties.reduce(
			(n, p) => n + p.hints.filter((h) => h.tone === "r").length,
			0,
		),
	};
}

/** Excel reads a UTF-8 CSV only with it. */
const BOM = "\uFEFF";

/** The example evaluation as a CSV for Excel: BOM, `;`, every value quoted. */
export function toCsv(properties: Property[]): string {
	const q = (v: string) => `"${v.replace(/"/g, '""')}"`;
	const header = ["Liegenschaft", ...properties[0].fields.map((f) => f.label)];
	const rows = properties.map((p) =>
		[p.name, ...p.fields.map((f) => f.value)].map(q).join(";"),
	);
	return `${BOM}${header.map(q).join(";")}\n${rows.join("\n")}`;
}
