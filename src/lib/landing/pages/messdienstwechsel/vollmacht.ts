/**
 * The Vollmacht of /messdienst-wechseln (the design's `build()` in `#av-js`):
 * paragraphs of lines of segments, built from the form's fields, in the
 * shapes of /messdienst-wechseln/muster-kuendigung's letter, so the shared
 * preview and Word and PDF writers take it as they are. A segment of an
 * empty field is its placeholder in brackets. Pure.
 */
import type { DocxLayout } from "$lib/landing/pages/muster-kuendigung/docx";
import {
	fileStem,
	propertyList,
	type Paragraph,
	type Segment,
} from "$lib/landing/pages/muster-kuendigung/letter";
import type { PdfLayout } from "$lib/landing/pages/muster-kuendigung/pdf";
import {
	POWER_KEYS,
	vollmachtText as T,
	type PowerKey,
	type VollmachtFieldKey,
} from "./content";

export type VollmachtInput = {
	fields: Record<VollmachtFieldKey, string>;
	powers: Record<PowerKey, boolean>;
	/** The date line's date, "19.10.2026". */
	today: string;
};

const text = (value: string): Segment => ({ text: value });
/** The value, or its placeholder in brackets when empty. */
const field = (value: string, placeholder: string): Segment =>
	value ? { text: value } : { text: `[${placeholder}]`, placeholder: true };

export function buildVollmacht({
	fields: raw,
	powers,
	today,
}: VollmachtInput): Paragraph[] {
	const v = (key: VollmachtFieldKey) => raw[key].trim();
	const P = T.placeholders;
	const properties = propertyList(raw.lieg);
	// The place of the date line: the town without its postcode.
	const place = v("sOrt").replace(/^\d{4,5}\s*/, "");
	const L: Paragraph[] = [];

	L.push({ kind: "bt", lines: [[text(T.title)]] });
	L.push({
		kind: "p",
		lines: [
			[text(T.principal)],
			[field(v("sName"), P.sName)],
			[field(v("sStr"), P.sStr)],
			[field(v("sOrt"), P.sOrt)],
		],
	});
	L.push({
		kind: "p",
		lines: [[text(T.agentLabel)], ...T.agent.map((line) => [text(line)])],
	});
	L.push({
		kind: "p",
		lines: [
			[
				text(T.authorise),
				field(v("mName"), P.mName),
				text(
					(v("mNr") ? T.contractNo.replace("{nr}", v("mNr")) : "") +
						T.about +
						(properties.length > 1 ? T.many : T.one) +
						T.represent,
				),
			],
		],
	});
	L.push({
		kind: "p",
		lines: properties.length
			? properties.map((p) => [text(T.bullet + p)])
			: [[text(T.bullet), field("", P.lieg)]],
	});

	const granted = POWER_KEYS.filter((key) => powers[key]).map(
		(key) => T.powers[key],
	);
	if (granted.length) {
		granted[granted.length - 1] = granted[granted.length - 1].replace(
			/,$/,
			".",
		);
		L.push({
			kind: "p",
			lines: [
				[text(T.powersIntro)],
				...granted.map((g) => [text(T.bullet + g)]),
			],
		});
	}

	L.push({ kind: "p", lines: [[text(T.validity)]] });
	L.push({
		kind: "p",
		lines: [[field(place, P.place), text(`, ${today}`)]],
	});
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

/** "Vollmacht-Messdienstwechsel-<principal>.<ext>"; "Heidi" without one. */
export const vollmachtFileName = (principal: string, ext: "docx" | "pdf") =>
	`${T.filePrefix}${fileStem(principal) || T.fileFallback}.${ext}`;

/** The design's Word layout: a 14 pt title, more room to sign. */
export const VOLLMACHT_DOCX: DocxLayout = {
	after: (kind) => (kind === "bt" ? 360 : 200),
	signatureSpace: 720,
	titleSize: 28,
	headerFooter: 708,
};

/** The design's PDF layout: a 14 pt title, more room to sign. */
export const VOLLMACHT_PDF: PdfLayout = {
	title: T.title,
	titleSize: 14,
	after: (kind) => (kind === "bt" ? 6 : 3.5),
	signatureSpace: 18,
};
