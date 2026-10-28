import { describe, expect, it } from "vitest";
import { FIELD_KEYS } from "./content";
import { buildLetter, type LetterInput } from "./letter";
import { makePdf, pageContents, pdfString, splitText, textWidth } from "./pdf";

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
			ablesung: true,
			geraete: true,
			vollmacht: false,
			daten: false,
		},
		term: "next",
		today: "19.10.2026",
	});

const latin1 = (bytes: Uint8Array) =>
	Array.from(bytes, (b) => String.fromCharCode(b)).join("");

describe("text metrics", () => {
	it("measures with the AFM widths", () => {
		// "Hallo" in Helvetica: 722 + 556 + 222 + 222 + 556 = 2278 units
		expect(textWidth("Hallo", "regular", 1000 * (72 / 25.4))).toBeCloseTo(
			2278,
			6,
		);
		expect(textWidth("ü", "bold")).toBeGreaterThan(textWidth("ü", "regular"));
	});

	it("breaks lines by words, too long words by characters", () => {
		const text =
			"hiermit kündigen wir den bestehenden Vertrag über Messdienstleistungen (insbesondere Ablesung, Abrechnung sowie Miete und Wartung der Messgeräte) für die oben genannte Liegenschaft fristgerecht zum nächstmöglichen Zeitpunkt.";
		const lines = splitText(text, 160, "regular");
		expect(lines.length).toBeGreaterThan(1);
		expect(lines.join(" ")).toBe(text);
		for (const line of lines)
			expect(textWidth(line, "regular")).toBeLessThanOrEqual(160);
		// Each line but the last would overflow with the next word.
		for (let i = 0; i < lines.length - 1; i++) {
			const next = lines[i + 1].split(" ")[0];
			expect(textWidth(`${lines[i]} ${next}`, "regular")).toBeGreaterThan(160);
		}
		const long = "x".repeat(400);
		const parts = splitText(long, 160, "regular");
		expect(parts.join("")).toBe(long);
		for (const part of parts)
			expect(textWidth(part, "regular")).toBeLessThanOrEqual(160);
	});
});

describe("pdfString", () => {
	it("escapes and writes WinAnsi", () => {
		expect(pdfString("a(b)c\\")).toBe("(a\\(b\\)c\\\\)");
		expect(pdfString("Grüße")).toBe("(Gr\\374\\337e)");
		expect(pdfString("„x“ · €")).toBe("(\\204x\\223 \\267 \\200)");
		expect(pdfString("日")).toBe("(?)");
	});
});

describe("makePdf", () => {
	it("writes a valid file with an exact xref", () => {
		const pdf = latin1(makePdf(letter({ mName: "Alt-Messdienst AG" })));
		expect(pdf.startsWith("%PDF-1.4\n")).toBe(true);
		expect(pdf.endsWith("%%EOF\n")).toBe(true);
		const startxref = Number(/startxref\n(\d+)\n/.exec(pdf)![1]);
		expect(pdf.slice(startxref, startxref + 4)).toBe("xref");
		const offsets = [...pdf.slice(startxref).matchAll(/^(\d{10}) 00000 n $/gm)];
		expect(offsets).toHaveLength(7);
		for (const [i, m] of offsets.entries())
			expect(pdf.slice(Number(m[1])).startsWith(`${i + 1} 0 obj\n`)).toBe(true);
		for (const m of pdf.matchAll(/<< \/Length (\d+) >>\nstream\n/g)) {
			const start = m.index! + m[0].length;
			expect(pdf.slice(start + Number(m[1]), start + Number(m[1]) + 10)).toBe(
				"\nendstream",
			);
		}
		expect(pdf).toContain("/BaseFont /Helvetica /Encoding /WinAnsiEncoding");
		expect(pdf).toContain(
			"/BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding",
		);
		expect(pdf).toContain("(Alt-Messdienst AG) Tj");
		expect(pdf).toContain("/F2 11 Tf");
	});

	it("starts at 28 mm, right-aligns the date and adds pages", () => {
		const [first] = pageContents(letter());
		const ops = first.split("\n").slice(1);
		// 25 mm, 28 mm from the top of A4
		expect(ops[0]).toBe(
			"BT /F1 11 Tf 70.87 762.52 Td ([Name der Verwaltung]) Tj ET",
		);
		const date = ops.find((op) => op.includes("19.10.2026"))!;
		const x = Number(/Tf ([\d.]+) /.exec(date)![1]) / (72 / 25.4);
		expect(x + textWidth("[Ort], 19.10.2026", "regular")).toBeCloseTo(185, 1);

		expect(pageContents(letter())).toHaveLength(1);
		const many = Array.from({ length: 30 }, (_, i) => `Straße ${i + 1}`).join(
			"\n",
		);
		expect(pageContents(letter({ lieg: many }))).toHaveLength(2);
	});
});
