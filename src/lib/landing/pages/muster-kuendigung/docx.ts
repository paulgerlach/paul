/**
 * The Word file of /muster-kuendigung: the design's three parts (its
 * `makeDocx()`, which builds them with JSZip) in a ZIP with stored entries
 * (JSZip's default, no compression) and their CRC-32. Pure; loaded on the
 * first click.
 */
import { berlinDate } from "$lib/landing/deadline/deadline";
import { lineText, type Paragraph } from "./letter";

export const DOCX_TYPE =
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const XML_HEAD = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';

const CONTENT_TYPES = `${XML_HEAD}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`;

const RELS = `${XML_HEAD}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;

/** Escapes `&`, `<`, `>` and drops the characters XML 1.0 forbids. */
export const escapeXml = (s: string) =>
	s
		// eslint-disable-next-line no-control-regex -- the forbidden range itself
		.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g, "")
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");

/** A run in Arial 11 pt, bold if asked. */
const run = (t: string, bold: boolean) =>
	`<w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>${bold ? "<w:b/>" : ""}<w:sz w:val="22"/></w:rPr><w:t xml:space="preserve">${escapeXml(t)}</w:t></w:r>`;

/** `word/document.xml`, as the design writes it. */
export function documentXml(letter: Paragraph[]) {
	const body = letter
		.map((p) => {
			const after =
				p.kind === "ab" || p.kind === "to"
					? "480"
					: p.kind === "dt"
						? "360"
						: "200";
			const jc = p.kind === "dt" ? '<w:jc w:val="right"/>' : "";
			// Room for the handwritten signature.
			const pre =
				p.kind === "sg"
					? '<w:p><w:pPr><w:spacing w:after="600"/></w:pPr></w:p>'
					: "";
			const runs = p.lines
				.map(
					(line, i) =>
						(i ? "<w:r><w:br/></w:r>" : "") +
						run(lineText(line), p.kind === "bt"),
				)
				.join("");
			return `${pre}<w:p><w:pPr><w:spacing w:after="${after}" w:line="300" w:lineRule="auto"/>${jc}</w:pPr>${runs}</w:p>`;
		})
		.join("");
	return `${XML_HEAD}<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1418" w:right="1418" w:bottom="1134" w:left="1418" w:header="709" w:footer="709" w:gutter="0"/></w:sectPr></w:body></w:document>`;
}

const CRC_TABLE = (() => {
	const table = new Uint32Array(256);
	for (let n = 0; n < 256; n++) {
		let c = n;
		for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		table[n] = c >>> 0;
	}
	return table;
})();

/** CRC-32 (ISO 3309, as ZIP uses it). */
export function crc32(bytes: Uint8Array) {
	let c = 0xffffffff;
	for (const b of bytes) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
	return (c ^ 0xffffffff) >>> 0;
}

/** A ZIP archive of `files` with stored (uncompressed) entries, dated `ms` (Berlin). */
export function zipStore(
	files: { name: string; data: Uint8Array }[],
	ms: number,
) {
	const enc = new TextEncoder();
	const { year, month, day } = berlinDate(ms);
	const dosDate =
		((Math.max(year, 1980) - 1980) << 9) | ((month + 1) << 5) | day;
	const dosTime = 0;

	const parts: Uint8Array[] = [];
	const central: Uint8Array[] = [];
	let offset = 0;
	for (const file of files) {
		const name = enc.encode(file.name);
		const crc = crc32(file.data);
		const size = file.data.length;

		const local = new DataView(new ArrayBuffer(30));
		local.setUint32(0, 0x04034b50, true);
		local.setUint16(4, 10, true); // version needed: 1.0 (stored)
		local.setUint16(6, 0, true); // flags
		local.setUint16(8, 0, true); // method: stored
		local.setUint16(10, dosTime, true);
		local.setUint16(12, dosDate, true);
		local.setUint32(14, crc, true);
		local.setUint32(18, size, true);
		local.setUint32(22, size, true);
		local.setUint16(26, name.length, true);
		local.setUint16(28, 0, true);
		parts.push(new Uint8Array(local.buffer), name, file.data);

		const entry = new DataView(new ArrayBuffer(46));
		entry.setUint32(0, 0x02014b50, true);
		entry.setUint16(4, 20, true); // made by: 2.0
		entry.setUint16(6, 10, true);
		entry.setUint16(8, 0, true);
		entry.setUint16(10, 0, true);
		entry.setUint16(12, dosTime, true);
		entry.setUint16(14, dosDate, true);
		entry.setUint32(16, crc, true);
		entry.setUint32(20, size, true);
		entry.setUint32(24, size, true);
		entry.setUint16(28, name.length, true);
		// extra, comment, disk, internal and external attributes: 0
		entry.setUint32(42, offset, true);
		central.push(new Uint8Array(entry.buffer), name);

		offset += 30 + name.length + size;
	}
	const centralSize = central.reduce((n, b) => n + b.length, 0);
	const end = new DataView(new ArrayBuffer(22));
	end.setUint32(0, 0x06054b50, true);
	end.setUint16(8, files.length, true);
	end.setUint16(10, files.length, true);
	end.setUint32(12, centralSize, true);
	end.setUint32(16, offset, true);

	const all = [...parts, ...central, new Uint8Array(end.buffer)];
	const out = new Uint8Array(all.reduce((n, b) => n + b.length, 0));
	let at = 0;
	for (const b of all) {
		out.set(b, at);
		at += b.length;
	}
	return out;
}

/** The .docx bytes of the letter. */
export function makeDocx(letter: Paragraph[], ms: number) {
	const enc = new TextEncoder();
	return zipStore(
		[
			{ name: "[Content_Types].xml", data: enc.encode(CONTENT_TYPES) },
			{ name: "_rels/.rels", data: enc.encode(RELS) },
			{ name: "word/document.xml", data: enc.encode(documentXml(letter)) },
		],
		ms,
	);
}
