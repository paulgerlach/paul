import { describe, expect, it } from "vitest";
import { CLAUSE_KEYS, FIELD_KEYS, generator, letterText } from "./content";
import {
	buildLetter,
	fileName,
	germanDay,
	isoToGerman,
	lineText,
	plainText,
	type LetterInput,
} from "./letter";

const emptyFields = () =>
	Object.fromEntries(FIELD_KEYS.map((k) => [k, ""])) as LetterInput["fields"];
const defaultClauses = () =>
	Object.fromEntries(
		generator.clauses.items.map((c) => [c.key, c.checked]),
	) as LetterInput["clauses"];

const input = (over: Partial<LetterInput> = {}): LetterInput => ({
	fields: emptyFields(),
	clauses: defaultClauses(),
	term: "next",
	today: "19.10.2026",
	...over,
});

const texts = (input: LetterInput) =>
	buildLetter(input).map((p) => p.lines.map(lineText));

describe("buildLetter", () => {
	it("shows every placeholder for an empty form", () => {
		const letter = buildLetter(input());
		expect(letter.map((p) => p.kind)).toEqual([
			"ab",
			"to",
			"dt",
			"bt",
			"p",
			"p",
			"p",
			"p",
			"p",
			"p",
			"p",
			"sg",
		]);
		expect(plainText(letter)).toBe(
			[
				"[Name der Verwaltung]\n[Straße, Hausnummer]\n[PLZ Ort]",
				"[Name des Messdienstleisters]\n[Anschrift]",
				"[Ort], 19.10.2026",
				"Kündigung des Messdienstvertrags",
				"Liegenschaft: \n[Adresse der Liegenschaft]",
				"Sehr geehrte Damen und Herren,",
				"hiermit kündigen wir den bestehenden Vertrag über Messdienstleistungen (insbesondere Ablesung, Abrechnung sowie Miete und Wartung der Messgeräte) für die oben genannte Liegenschaft fristgerecht zum nächstmöglichen Zeitpunkt.",
				letterText.clauses.ende,
				letterText.clauses.ablesung,
				letterText.clauses.geraete,
				"Mit freundlichen Grüßen",
				"[Vor- und Nachname]",
			].join("\n\n"),
		);
		const placeholders = letter
			.flatMap((p) => p.lines.flat())
			.filter((s) => s.placeholder)
			.map((s) => s.text);
		expect(placeholders).toHaveLength(8);
	});

	it("writes a filled form", () => {
		const fields = {
			...emptyFields(),
			sName: " Muster Hausverwaltung GmbH ",
			sStr: "Beispielstraße 1",
			sOrt: "10115 Berlin",
			sPers: "Erika Muster",
			sFunk: "Geschäftsführung",
			mName: "Alt-Messdienst AG",
			mAdr: "Hauptstraße 5, 20095 Hamburg",
			mNr: "12345678",
			lieg: "Lindenallee 12, 10115 Berlin\n\n  Ahornweg 3, 10117 Berlin  \n",
		};
		const t = texts(input({ fields }));
		expect(t[0]).toEqual([
			"Muster Hausverwaltung GmbH",
			"Beispielstraße 1",
			"10115 Berlin",
		]);
		expect(t[2]).toEqual(["Berlin, 19.10.2026"]);
		expect(t[3]).toEqual([
			"Kündigung des Messdienstvertrags · Vertrags-/Kundennr. 12345678",
		]);
		expect(t[4]).toEqual([
			"Liegenschaften: ",
			"Lindenallee 12, 10115 Berlin",
			"Ahornweg 3, 10117 Berlin",
		]);
		expect(t[6][0]).toContain(
			"für die oben genannten Liegenschaften fristgerecht zum nächstmöglichen Zeitpunkt.",
		);
		expect(t.at(-1)).toEqual([
			"Erika Muster",
			"Geschäftsführung",
			"Muster Hausverwaltung GmbH",
		]);
		const flat = buildLetter(input({ fields })).flatMap((p) => p.lines.flat());
		expect(flat.some((s) => s.placeholder)).toBe(false);
	});

	it("cancels to a date, with a placeholder until one is set", () => {
		const noDate = texts(input({ term: "date" }))[6][0];
		expect(noDate).toMatch(/Liegenschaft zum \[Datum\]\.$/);
		const withDate = texts(
			input({
				term: "date",
				fields: { ...emptyFields(), datum: "2027-12-31" },
			}),
		)[6][0];
		expect(withDate).toMatch(/Liegenschaft zum 31\.12\.2027\.$/);
		// The date only counts with the switch on "Zu einem Datum".
		const next = texts(
			input({ fields: { ...emptyFields(), datum: "2027-12-31" } }),
		)[6][0];
		expect(next).toMatch(/nächstmöglichen Zeitpunkt\.$/);
	});

	it("adds the clauses in the letter's order", () => {
		const all = Object.fromEntries(CLAUSE_KEYS.map((k) => [k, true])) as Record<
			(typeof CLAUSE_KEYS)[number],
			boolean
		>;
		const body = plainText(buildLetter(input({ clauses: all })));
		const order = [
			"vollmacht",
			"ende",
			"ablesung",
			"geraete",
			"daten",
		] as const;
		const at = order.map((k) => body.indexOf(letterText.clauses[k]));
		for (const i of at) expect(i).toBeGreaterThan(0);
		expect([...at].sort((a, b) => a - b)).toEqual(at);
		const none = Object.fromEntries(
			CLAUSE_KEYS.map((k) => [k, false]),
		) as typeof all;
		expect(buildLetter(input({ clauses: none }))).toHaveLength(9);
	});

	it("keeps the place without its postcode", () => {
		const t = texts(
			input({ fields: { ...emptyFields(), sOrt: "80331 München" } }),
		);
		expect(t[2]).toEqual(["München, 19.10.2026"]);
	});
});

describe("helpers", () => {
	it("formats dates", () => {
		expect(isoToGerman("2027-01-05")).toBe("05.01.2027");
		expect(isoToGerman("")).toBe("");
		// 23:30 UTC on 19 Oct is already the 20th in Berlin.
		expect(germanDay(Date.UTC(2026, 9, 19, 23, 30))).toBe("20.10.2026");
		expect(germanDay(Date.UTC(2026, 0, 1, 12))).toBe("01.01.2026");
	});

	it("names the files after the provider", () => {
		expect(fileName("Alt-Messdienst AG", "docx")).toBe(
			"Kuendigung-Alt-Messdienst-AG.docx",
		);
		expect(fileName("  Müller & Söhne GmbH ", "pdf")).toBe(
			"Kuendigung-Müller-Söhne-GmbH.pdf",
		);
		expect(fileName("", "pdf")).toBe("Kuendigung-Messdienst.pdf");
		expect(fileName("&&&", "docx")).toBe("Kuendigung-Messdienst.docx");
	});
});
