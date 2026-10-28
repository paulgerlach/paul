import { crc32 as nodeCrc32 } from "node:zlib";
import { describe, expect, it } from "vitest";
import { FIELD_KEYS } from "./content";
import { crc32, documentXml, escapeXml, makeDocx, zipStore } from "./docx";
import { buildLetter, type LetterInput } from "./letter";

const letter = (fields: Partial<LetterInput["fields"]> = {}) =>
	buildLetter({
		fields: {
			...(Object.fromEntries(
				FIELD_KEYS.map((k) => [k, ""]),
			) as LetterInput["fields"]),
			...fields,
		},
		clauses: {
			ende: true,
			ablesung: false,
			geraete: false,
			vollmacht: false,
			daten: false,
		},
		term: "next",
		today: "19.10.2026",
	});

/** Reads a stored ZIP back from its central directory. */
function unzip(bytes: Uint8Array) {
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	const end = bytes.length - 22;
	expect(view.getUint32(end, true)).toBe(0x06054b50);
	const count = view.getUint16(end + 10, true);
	const size = view.getUint32(end + 12, true);
	let at = view.getUint32(end + 16, true);
	expect(at + size).toBe(end);
	const dec = new TextDecoder();
	const files: Record<string, { data: Uint8Array; crc: number }> = {};
	for (let i = 0; i < count; i++) {
		expect(view.getUint32(at, true)).toBe(0x02014b50);
		const crc = view.getUint32(at + 16, true);
		const length = view.getUint32(at + 20, true);
		const nameLength = view.getUint16(at + 28, true);
		const local = view.getUint32(at + 42, true);
		const name = dec.decode(bytes.subarray(at + 46, at + 46 + nameLength));
		expect(view.getUint32(local, true)).toBe(0x04034b50);
		expect(view.getUint16(local + 8, true)).toBe(0); // stored
		expect(view.getUint32(local + 14, true)).toBe(crc);
		const start = local + 30 + view.getUint16(local + 26, true);
		files[name] = { data: bytes.subarray(start, start + length), crc };
		at += 46 + nameLength;
	}
	return files;
}

describe("documentXml", () => {
	it("writes the design's runs and paragraphs", () => {
		const xml = documentXml(letter({ sName: "Muster GmbH" }));
		expect(xml).toMatch(
			/^<\?xml version="1\.0" encoding="UTF-8" standalone="yes"\?><w:document /,
		);
		// The sender block: three lines with breaks, 480 after.
		expect(xml).toContain(
			'<w:p><w:pPr><w:spacing w:after="480" w:line="300" w:lineRule="auto"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:sz w:val="22"/></w:rPr><w:t xml:space="preserve">Muster GmbH</w:t></w:r><w:r><w:br/></w:r>',
		);
		// The date right-aligned, 360 after.
		expect(xml).toContain(
			'<w:spacing w:after="360" w:line="300" w:lineRule="auto"/><w:jc w:val="right"/></w:pPr>',
		);
		// The subject bold.
		expect(xml).toContain(
			'<w:b/><w:sz w:val="22"/></w:rPr><w:t xml:space="preserve">Kündigung des Messdienstvertrags</w:t>',
		);
		// Room for the signature.
		expect(xml).toContain(
			'<w:p><w:pPr><w:spacing w:after="600"/></w:pPr></w:p><w:p>',
		);
		expect(xml).toMatch(
			/<w:sectPr><w:pgSz w:w="11906" w:h="16838"\/><w:pgMar w:top="1418" w:right="1418" w:bottom="1134" w:left="1418" w:header="709" w:footer="709" w:gutter="0"\/><\/w:sectPr><\/w:body><\/w:document>$/,
		);
	});

	it("escapes the input and drops what XML forbids", () => {
		expect(escapeXml("A & B <C>\u0001\u000b")).toBe("A &amp; B &lt;C&gt;");
		expect(escapeXml("Tab\tok")).toBe("Tab\tok");
		const xml = documentXml(letter({ mName: "<Müller & Co>" }));
		expect(xml).toContain("&lt;Müller &amp; Co&gt;");
	});
});

describe("zipStore", () => {
	it("computes the CRC-32 as zlib does", () => {
		const enc = new TextEncoder();
		for (const s of ["", "a", "Heizungen digitalisieren", "äöüß".repeat(500)])
			expect(crc32(enc.encode(s))).toBe(nodeCrc32(enc.encode(s)));
	});

	it("writes a readable archive", () => {
		const enc = new TextEncoder();
		const zip = zipStore(
			[
				{ name: "a.txt", data: enc.encode("Hallo") },
				{ name: "dir/b.xml", data: enc.encode("<x>ü</x>") },
			],
			Date.UTC(2026, 9, 19, 12),
		);
		const files = unzip(zip);
		expect(Object.keys(files)).toEqual(["a.txt", "dir/b.xml"]);
		expect(new TextDecoder().decode(files["dir/b.xml"].data)).toBe("<x>ü</x>");
		for (const file of Object.values(files))
			expect(file.crc).toBe(nodeCrc32(file.data));
		// DOS date 19.10.2026
		const view = new DataView(zip.buffer);
		expect(view.getUint16(12, true)).toBe(
			((2026 - 1980) << 9) | (10 << 5) | 19,
		);
	});
});

describe("makeDocx", () => {
	it("holds the three parts with the letter", () => {
		const files = unzip(makeDocx(letter({ mName: "Alt-Messdienst AG" }), 0));
		expect(Object.keys(files)).toEqual([
			"[Content_Types].xml",
			"_rels/.rels",
			"word/document.xml",
		]);
		const doc = new TextDecoder().decode(files["word/document.xml"].data);
		expect(doc).toContain("Alt-Messdienst AG");
		expect(new TextDecoder().decode(files["_rels/.rels"].data)).toContain(
			'Target="word/document.xml"',
		);
	});
});
