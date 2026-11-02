import { writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
	calc,
	fresh,
	makeOffer,
	newGroup,
	offerParts,
	positions,
	type State,
} from "./model";
import { offerPdf } from "./offerPdf";

function building(rows = 1): State {
	const s = fresh();
	Object.assign(s, {
		abr: "ja",
		liste: "nein",
		bestand: "nein",
		devs: ["kwz"],
		heiz: ["gas"],
		leist: "a",
		kauf: "miete",
		units: "6",
	});
	s.groups.kwz = Array.from({ length: rows }, (_, i) => ({
		...newGroup(`g${i + 1}`),
		n: "6",
		einbau: "ap",
		bl: "andere",
		blx: "95",
		absv: "ja",
	}));
	s.k = {
		vn: "Eva",
		nn: "Muster",
		firma: "Łódź (Haus) GmbH",
		mail: "eva@example.com",
		tel: "",
		ok: true,
	};
	s.adr.l = { ...s.adr.l, str: "Hauptstraße 1", plz: "10115", ort: "Berlin" };
	return s;
}

const latin1 = (bytes: Uint8Array) => Buffer.from(bytes).toString("latin1");

function parts(s: State) {
	const offer = makeOffer(Date.UTC(2026, 10, 2), 0.5);
	return {
		offer,
		list: offerParts(positions(calc(s)), offer),
	};
}

describe("offerPdf", () => {
	it("writes a valid PDF with an exact xref table", () => {
		const s = building();
		const { offer, list } = parts(s);
		for (const part of list) {
			const pdf = latin1(offerPdf(s, offer, part));
			if (process.env.OFFER_PDF_OUT)
				writeFileSync(
					`${process.env.OFFER_PDF_OUT}/${part.kind}.pdf`,
					pdf,
					"latin1",
				);
			expect(pdf.startsWith("%PDF-1.4")).toBe(true);
			expect(pdf).toContain(`Angebotsnummer: ${part.nr}`);
			const start = Number(/startxref\n(\d+)/.exec(pdf)?.[1]);
			expect(pdf.slice(start, start + 4)).toBe("xref");
			const entries = pdf
				.slice(start)
				.split("\n")
				.filter((l) => / 00000 n $/.test(l));
			entries.forEach((line, i) =>
				expect(
					pdf.slice(Number(line.slice(0, 10))).startsWith(`${i + 1} 0 obj`),
				).toBe(true),
			);
		}
	});

	it("gives the devices and the billing their own files and page counts", () => {
		const s = building();
		const { offer, list } = parts(s);
		expect(list.map((p) => p.kind)).toEqual(["g", "a"]);
		const count = (kind: string) => {
			const part = list.find((p) => p.kind === kind)!;
			return Number(
				/\/Count (\d+)/.exec(latin1(offerPdf(s, offer, part)))?.[1],
			);
		};
		expect(count("g")).toBe(4);
		expect(count("a")).toBe(3);
	});

	it("keeps every page's number right when the tables overflow", () => {
		const s = building(40);
		const { offer, list } = parts(s);
		const pdf = latin1(offerPdf(s, offer, list[0]));
		const total = Number(/\/Count (\d+)/.exec(pdf)?.[1]);
		for (let n = 1; n <= total; n++)
			expect(pdf).toContain(`(Seite ${n} von ${total})`);
	});

	it("replaces what Helvetica can't write and escapes brackets", () => {
		const s = building();
		const { offer, list } = parts(s);
		const pdf = latin1(offerPdf(s, offer, list[0]));
		expect(pdf).toContain(
			"(L\\363d\\237 \\(Haus\\) GmbH)".replace("\\237", "z"),
		);
		// "CO₂" keeps its figure.
		expect(pdf).toContain("CO2");
	});
});
