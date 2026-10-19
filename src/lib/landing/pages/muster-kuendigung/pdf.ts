/**
 * The PDF of /muster-kuendigung: the design's `makePdf()` (jsPDF, A4 in mm,
 * Helvetica 11 pt) written directly as a PDF 1.4 with the standard fonts
 * Helvetica and Helvetica-Bold (WinAnsiEncoding, not embedded, as jsPDF's),
 * uncompressed content streams and an exact xref table. Lines break as
 * jsPDF's `splitTextToSize` does, by the fonts' AFM widths. Pure; loaded on
 * the first click.
 */
import { letterText } from "./content";
import { FIRST_CHAR, HELVETICA, HELVETICA_BOLD, winAnsi } from "./helvetica";
import { lineText, type Paragraph } from "./letter";

export const PDF_TYPE = "application/pdf";

/** The design's layout, in mm. */
const LAYOUT = {
	top: 28,
	x: 25,
	width: 160,
	lineHeight: 5.6,
	/** A line below this starts a new page … */
	bottom: 275,
	/** … at this height. */
	newPageTop: 25,
	fontSize: 11,
};
const K = 72 / 25.4; // pt per mm
const PAGE_W = 595.28; // A4, pt
const PAGE_H = 841.89;
const QUESTION = 63; // "?" for a character WinAnsi lacks

export type Font = "regular" | "bold";

const codeOf = (char: string) =>
	char === "\t" ? 32 : (winAnsi(char) ?? QUESTION);

/** Width of `text` in mm at `size` pt. */
export function textWidth(text: string, font: Font, size = LAYOUT.fontSize) {
	const widths = font === "bold" ? HELVETICA_BOLD : HELVETICA;
	let units = 0;
	for (const char of text) units += widths[codeOf(char) - FIRST_CHAR] ?? 0;
	return (units / 1000) * size * (1 / K);
}

/**
 * Breaks `text` into lines no wider than `width` mm (jsPDF's
 * `splitTextToSize`): words by spaces, a word wider than a line by characters.
 */
export function splitText(text: string, width: number, font: Font) {
	const lines: string[] = [];
	let line = "";
	const fits = (s: string) => textWidth(s, font) <= width;
	for (const word of text.split(" ")) {
		const next = line ? `${line} ${word}` : word;
		if (fits(next)) {
			line = next;
			continue;
		}
		if (line) lines.push(line);
		// A word too long for a whole line: by characters.
		let rest = word;
		while (!fits(rest)) {
			let cut = 1;
			const chars = [...rest];
			while (cut < chars.length && fits(chars.slice(0, cut + 1).join("")))
				cut++;
			lines.push(chars.slice(0, cut).join(""));
			rest = chars.slice(cut).join("");
		}
		line = rest;
	}
	lines.push(line);
	return lines;
}

/** A PDF string literal in WinAnsi, escaped, bytes above 127 as octal. */
export function pdfString(text: string) {
	let out = "(";
	for (const char of text) {
		const code = codeOf(char);
		if (code === 0x28 || code === 0x29 || code === 0x5c)
			out += `\\${String.fromCharCode(code)}`;
		else if (code > 126) out += `\\${code.toString(8).padStart(3, "0")}`;
		else out += String.fromCharCode(code);
	}
	return `${out})`;
}

const n = (v: number) => String(Math.round(v * 100) / 100);

/** The content streams of the letter's pages (the design's loop). */
export function pageContents(letter: Paragraph[]) {
	const L = LAYOUT;
	const pages: string[][] = [[]];
	let y = L.top;
	for (const p of letter) {
		if (p.kind === "sg") y += 14;
		const font: Font = p.kind === "bt" ? "bold" : "regular";
		for (const line of p.lines) {
			for (const part of splitText(lineText(line), L.width, font)) {
				if (y > L.bottom) {
					pages.push([]);
					y = L.newPageTop;
				}
				const x = p.kind === "dt" ? L.x + L.width - textWidth(part, font) : L.x;
				pages[pages.length - 1].push(
					`BT /${font === "bold" ? "F2" : "F1"} ${L.fontSize} Tf ${n(x * K)} ${n(PAGE_H - y * K)} Td ${pdfString(part)} Tj ET`,
				);
				y += L.lineHeight;
			}
		}
		y += p.kind === "ab" || p.kind === "to" ? 9 : p.kind === "dt" ? 6 : 3.5;
	}
	return pages.map((ops) => ["0 g", ...ops].join("\n"));
}

/** The PDF bytes of the letter. */
export function makePdf(letter: Paragraph[]) {
	const contents = pageContents(letter);
	// 1 catalog, 2 pages, 3–4 fonts, 5 info, then a page and its content each.
	const pageIds = contents.map((_, i) => 6 + i * 2);
	const objects: string[] = [
		"<< /Type /Catalog /Pages 2 0 R >>",
		`<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${contents.length} >>`,
		"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
		"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
		`<< /Title ${pdfString(letterText.subject)} /Producer (Heidi Systems) >>`,
	];
	for (const [i, content] of contents.entries()) {
		objects.push(
			`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${pageIds[i] + 1} 0 R >>`,
			`<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
		);
	}

	// Every character below is one byte (ASCII, plus the binary comment).
	let out = "%PDF-1.4\n%âãÏÓ\n";
	const offsets: number[] = [];
	for (const [i, body] of objects.entries()) {
		offsets.push(out.length);
		out += `${i + 1} 0 obj\n${body}\nendobj\n`;
	}
	const xref = out.length;
	out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
	for (const offset of offsets)
		out += `${String(offset).padStart(10, "0")} 00000 n \n`;
	out += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info 5 0 R >>\nstartxref\n${xref}\n%%EOF\n`;

	const bytes = new Uint8Array(out.length);
	for (let i = 0; i < out.length; i++) bytes[i] = out.charCodeAt(i) & 0xff;
	return bytes;
}
