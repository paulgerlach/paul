/**
 * The letter of /messdienst-wechseln/muster-kuendigung (the design's `build()` in `#kd-js`):
 * paragraphs of lines of segments, built from the form's fields. A segment
 * of an empty field is its placeholder in brackets, marked so the preview can
 * highlight it. Pure: the preview, the plain text, the Word file and the PDF
 * all read the same paragraphs.
 */
import { berlinDate } from "$lib/landing/deadline/deadline";
import {
	letterText as T,
	type ClauseKey,
	type FieldKey,
	type Term,
} from "./content";

export type Segment = { text: string; placeholder?: true };
export type Line = Segment[];
/**
 * `ab` sender, `to` recipient, `dt` place and date (right-aligned), `bt`
 * subject (bold), `p` body, `sg` signature.
 */
export type ParagraphKind = "ab" | "to" | "dt" | "bt" | "p" | "sg";
export type Paragraph = { kind: ParagraphKind; lines: Line[] };

export type LetterInput = {
	fields: Record<FieldKey, string>;
	clauses: Record<ClauseKey, boolean>;
	term: Term;
	/** The letter's date, "19.10.2026". */
	today: string;
};

/** The clauses in the letter's order (the design's, not the form's). */
const CLAUSE_ORDER: ClauseKey[] = [
	"vollmacht",
	"ende",
	"ablesung",
	"geraete",
	"daten",
];

const text = (value: string): Segment => ({ text: value });
/** The value, or its placeholder in brackets when empty. */
const field = (value: string, placeholder: string): Segment =>
	value ? { text: value } : { text: `[${placeholder}]`, placeholder: true };

/** "2027-01-31" → "31.01.2027"; anything else as it is. */
export function isoToGerman(iso: string) {
	const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
	return m ? `${m[3]}.${m[2]}.${m[1]}` : iso;
}

/** The Berlin calendar date of `ms` as "19.10.2026". */
export function germanDay(ms: number) {
	const { year, month, day } = berlinDate(ms);
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${pad(day)}.${pad(month + 1)}.${year}`;
}

/** The properties, one per non-empty line. */
export const propertyList = (value: string) =>
	value
		.split(/\n+/)
		.map((s) => s.trim())
		.filter(Boolean);

export function buildLetter({
	fields: raw,
	clauses,
	term,
	today,
}: LetterInput): Paragraph[] {
	const v = (key: FieldKey) => raw[key].trim();
	const P = T.placeholders;
	const properties = propertyList(raw.lieg);
	const many = properties.length > 1;
	// The place of the date line: the town without its postcode.
	const place = v("sOrt").replace(/^\d{4,5}\s*/, "");
	const L: Paragraph[] = [];

	L.push({
		kind: "ab",
		lines: [
			[field(v("sName"), P.sName)],
			[field(v("sStr"), P.sStr)],
			[field(v("sOrt"), P.sOrt)],
		],
	});
	L.push({
		kind: "to",
		lines: [[field(v("mName"), P.mName)], [field(v("mAdr"), P.mAdr)]],
	});
	L.push({
		kind: "dt",
		lines: [[field(place, P.place), text(`, ${today}`)]],
	});
	L.push({
		kind: "bt",
		lines: [
			[text(T.subject), ...(v("mNr") ? [text(T.contractNo + v("mNr"))] : [])],
		],
	});
	L.push({
		kind: "p",
		lines: [
			[text(`${many ? T.properties : T.property}: `)],
			...(properties.length
				? properties.map((p) => [text(p)])
				: [[field("", P.lieg)]]),
		],
	});
	L.push({ kind: "p", lines: [[text(T.salutation)]] });

	const date = v("datum");
	const when: Segment[] =
		term === "date"
			? date
				? [text(T.on + isoToGerman(date))]
				: [text(T.on), field("", P.datum)]
			: [text(T.next)];
	L.push({
		kind: "p",
		lines: [
			[
				text(T.termination + (many ? T.terminationMany : T.terminationOne)),
				...when,
				text("."),
			],
		],
	});

	for (const key of CLAUSE_ORDER)
		if (clauses[key]) L.push({ kind: "p", lines: [[text(T.clauses[key])]] });

	L.push({ kind: "p", lines: [[text(T.closing)]] });
	L.push({
		kind: "sg",
		lines: [
			[field(v("sPers"), P.sPers)],
			...(v("sFunk") ? [[text(v("sFunk"))]] : []),
			...(v("sName") ? [[text(v("sName"))]] : []),
		],
	});
	return L;
}

/** A line's text. */
export const lineText = (line: Line) => line.map((s) => s.text).join("");

/** The letter as plain text: lines by a line break, paragraphs by a blank line. */
export const plainText = (letter: Paragraph[]) =>
	letter.map((p) => p.lines.map(lineText).join("\n")).join("\n\n");

/**
 * "Kuendigung-<provider>.<ext>": the provider's name without special
 * characters, spaces as dashes; "Messdienst" when nothing is left.
 */
export function fileName(provider: string, ext: "docx" | "pdf") {
	return `Kuendigung-${fileStem(provider) || T.fileFallback}.${ext}`;
}

/** `value` for a file name: no special characters, spaces as dashes; may be "". */
export const fileStem = (value: string) =>
	value
		.trim()
		.replace(/[^\wäöüÄÖÜß\- ]+/g, "")
		.trim()
		.replace(/\s+/g, "-");
