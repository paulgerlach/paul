import { describe, expect, it } from "vitest";
import { day, formatDate } from "$lib/landing/pages/fristenrechner/fristen";
import {
	documentCount,
	exampleEvaluation,
	fieldValue,
	fileKind,
	formatSize,
	isAccepted,
	kpis,
	noticeDate,
	OVERVIEW_FIELDS,
	rollForward,
	toCsv,
} from "./checker";

const OCT_19_2026 = day(2026, 9, 19);
const FEB_15_2027 = day(2027, 1, 15);

describe("the file check", () => {
	it("tells the kinds apart by extension", () => {
		expect(fileKind("Vertrag.PDF")).toBe("pdf");
		expect(fileKind("scan.jpeg")).toBe("img");
		expect(fileKind("foto.HEIC")).toBe("img");
		expect(fileKind("seite.tif")).toBe("img");
		expect(fileKind("Nachtrag.docx")).toBe("doc");
		expect(fileKind("ohne-endung")).toBe("doc");
	});

	it("accepts PDFs, photos and scans under 25 MB", () => {
		expect(isAccepted("a.pdf", 1)).toBe(true);
		expect(isAccepted("a.png", 24_999_999)).toBe(true);
		expect(isAccepted("a.pdf", 25e6)).toBe(false);
		// Pickable (the input's accept list) but not supported.
		expect(isAccepted("a.docx", 1000)).toBe(false);
	});

	it("formats sizes the design's way", () => {
		expect(formatSize(842e3)).toBe("842 KB");
		expect(formatSize(200)).toBe("1 KB");
		expect(formatSize(1.21e6)).toBe("1,2 MB");
		expect(formatSize(2.4e6)).toBe("2,4 MB");
	});

	it("counts documents", () => {
		expect(documentCount(1)).toBe("1 Dokument");
		expect(documentCount(5)).toBe("5 Dokumente");
	});
});

describe("contract terms", () => {
	it("takes the notice date from the month's end", () => {
		expect(formatDate(noticeDate(day(2027, 11, 31), 3))).toBe("30.09.2027");
		expect(formatDate(noticeDate(day(2026, 11, 31), 6))).toBe("30.06.2026");
		expect(formatDate(noticeDate(day(2027, 5, 30), 3))).toBe("31.03.2027");
	});

	it("renews a contract whose notice date has passed", () => {
		const open = rollForward(day(2027, 11, 31), 3, 12, OCT_19_2026);
		expect(open.rolled).toBe(false);
		expect(formatDate(open.by)).toBe("30.09.2027");

		const once = rollForward(day(2026, 11, 31), 6, 12, OCT_19_2026);
		expect(once.rolled).toBe(true);
		expect(formatDate(once.end)).toBe("31.12.2027");
		expect(formatDate(once.by)).toBe("30.06.2027");

		const twice = rollForward(day(2025, 11, 31), 6, 12, OCT_19_2026);
		expect(formatDate(twice.end)).toBe("31.12.2027");
	});

	it("counts the notice day itself as open", () => {
		const t = rollForward(day(2027, 11, 31), 3, 12, day(2027, 8, 30));
		expect(t.rolled).toBe(false);
	});
});

describe("the example evaluation", () => {
	it("dates the three contracts on 19.10.2026", () => {
		const [a, b, c] = exampleEvaluation(OCT_19_2026);
		expect(a.name).toBe("Lindenallee 12");
		expect(fieldValue(a, "Vertragsbeginn")).toBe("01.01.2021");
		expect(fieldValue(a, "Laufzeit bis")).toBe("31.12.2027");
		expect(fieldValue(a, "Kündigung bis")).toBe("30.09.2027");
		expect(a.hints[0].text).toBe(
			"Nachtrag aus 2023 berücksichtigt: Laufzeit verlängert bis 31.12.2027.",
		);
		expect(a.hints[1].text).toBe(
			"Kündigung bis 30.09.2027 möglich, in 346 Tagen.",
		);

		expect(fieldValue(b, "Laufzeit bis")).toBe("31.12.2027");
		expect(fieldValue(b, "Kündigung bis")).toBe("30.06.2027");
		expect(b.hints.map((h) => h.text)).toEqual([
			"Kündigungsfrist zum 31.12.2026 verpasst: Der Vertrag verlängert sich bis 31.12.2027.",
			"Geräte nicht fernablesbar: Nachrüstung bis 31.12.2026 vorgeschrieben.",
			"WEG: Wechsel vor der nächsten Eigentümerversammlung beschließen.",
		]);

		expect(fieldValue(c, "Kündigung bis")).toBe("31.03.2027");
		expect(fieldValue(c, "Nächste Eichfrist")).toBe(
			"Warmwasserzähler 30.06.2027",
		);
		expect(c.hints[1].text).toBe("Kündigung bis 31.03.2027, in 163 Tagen.");
	});

	it("switches the remote-reading hint on 1.1.2027 and moves with the year", () => {
		const [a, b] = exampleEvaluation(FEB_15_2027);
		expect(fieldValue(a, "Laufzeit bis")).toBe("31.12.2028");
		expect(fieldValue(b, "Laufzeit bis")).toBe("31.12.2027");
		expect(b.hints.map((h) => h.tone)).toEqual(["r", "y"]);
		expect(b.hints[0].text).toBe(
			"Geräte nicht fernablesbar: Pflicht seit 01.01.2027, Mieter können 3 % kürzen.",
		);
	});

	it("recommends taking over A and terminating B and C", () => {
		expect(
			exampleEvaluation(OCT_19_2026).map((p) => p.recommendation.kind),
		).toEqual(["take", "cancel", "cancel"]);
	});

	it("has twelve fields per property, the overview's eight among them", () => {
		for (const p of exampleEvaluation(OCT_19_2026)) {
			expect(p.fields).toHaveLength(12);
			for (const label of OVERVIEW_FIELDS)
				expect(fieldValue(p, label)).not.toBe("");
		}
	});

	it("sums up the evaluation", () => {
		const props = exampleEvaluation(OCT_19_2026);
		expect(kpis(props, OCT_19_2026, 5)).toEqual({
			documents: 5,
			properties: 3,
			next: { date: "31.03.2027", name: "Am Markt 7", days: 163 },
			urgent: 2,
		});
		expect(kpis(exampleEvaluation(FEB_15_2027), FEB_15_2027, 5).urgent).toBe(1);
	});
});

describe("the CSV", () => {
	it("writes a header and a quoted row per property", () => {
		const csv = toCsv(exampleEvaluation(OCT_19_2026));
		expect(csv.startsWith("\uFEFF")).toBe(true);
		const lines = csv.slice(1).split("\n");
		expect(lines).toHaveLength(4);
		expect(lines[0]).toBe(
			'"Liegenschaft";"Anbieter";"Vertragsnummer";"Vertragsbeginn";"Laufzeit bis";"Verlängerung";"Kündigungsfrist";"Kündigung bis";"Geräte";"Kosten";"Fernablesbar";"Nächste Eichfrist";"Abrechnungsdienst"',
		);
		expect(
			lines[1].startsWith('"Lindenallee 12";"Messdienst A";"MD-48120"'),
		).toBe(true);
	});

	it("doubles quotes", () => {
		const [p] = exampleEvaluation(OCT_19_2026);
		const csv = toCsv([{ ...p, name: 'Haus "Linde"' }]);
		expect(csv).toContain('"Haus ""Linde"""');
	});
});
