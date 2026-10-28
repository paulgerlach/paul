import { describe, expect, it } from "vitest";
import { fresh, makeOffer, newGroup, type State } from "./model";
import { sheet, sheetSlots, type Sheet } from "./sheet";

/** 6 flats, 6 cold water meters on the wall, a bill with a note. */
function building(): State {
	const s = fresh();
	Object.assign(s, {
		abr: "ja",
		abrNote: "Zwei Häuser",
		liste: "nein",
		bestand: "nein",
		devs: ["kwz"],
		heiz: ["gas", "fw"],
		leist: "a",
		kauf: "miete",
		units: "6",
	});
	s.groups.kwz = [
		{
			...newGroup("g1"),
			n: "6",
			einbau: "ap",
			bl: "andere",
			blx: "95",
			absv: "ja",
		},
	];
	s.k = {
		vn: "Eva",
		nn: "Muster",
		firma: "",
		mail: "eva@example.com",
		tel: "",
		ok: true,
	};
	s.adr.l = {
		str: "Hauptstraße 1",
		zus: "",
		plz: "10115",
		ort: "Berlin",
		hin: "",
	};
	s.ang = makeOffer(Date.UTC(2026, 9, 22), 0);
	return s;
}

const answer = (sh: Sheet, title: string, q: string) =>
	sh.find((x) => x.title === title)?.items.find((i) => i.q === q);

describe("sheet", () => {
	it("lists the steps with the answers as labels", () => {
		const sh = sheet(building());
		expect(sh.map((x) => x.title)).toEqual([
			"Liegt eine Heizkostenabrechnung vor?",
			"Haben Sie eine Geräteliste?",
			"Sind bereits Funkzähler vorhanden?",
			"Welche Geräte benötigen Sie?",
			"Heizung und gewünschte Leistungen",
			"Wie viele Einheiten hat die Liegenschaft?",
			"Kaltwasserzähler · Gruppe 1",
			"Montage",
			"Weitere Leistungen",
			"Ihre Kontaktdaten",
			"Liegenschaftsadresse",
			"Rechnungsadresse",
			"Ihr Angebot",
		]);
		const abr = sh[0].items;
		expect(abr).toEqual([
			{
				q: "Liegt eine Heizkostenabrechnung vor?",
				a: "Ja, ich habe eine Heizkostenabrechnung",
			},
			{ q: "Abrechnung hochladen", a: "", files: "abr" },
			{ q: "Anmerkung", a: "Zwei Häuser" },
		]);
		expect(
			answer(
				sh,
				"Heizung und gewünschte Leistungen",
				"Welche Heizungsart ist vorhanden?",
			)?.a,
		).toBe("Zentrale Gasheizung, Fernwärme");
		expect(answer(sh, "Kaltwasserzähler · Gruppe 1", "Einbaulänge")?.a).toBe(
			"95",
		);
		expect(
			answer(
				sh,
				"Kaltwasserzähler · Gruppe 1",
				"Wie ist der Wasserzähler eingebaut?",
			)?.a,
		).toBe("Aufputz");
		expect(answer(sh, "Ihr Angebot", "Angebotsnummer")?.a).toBe(
			"2026-AN100000",
		);
		expect(answer(sh, "Ihr Angebot", "Geräte")?.a).toContain(
			"6 × Funk Kaltwasserzähler\n1 × Funk-Gateway",
		);
	});

	it("leaves out what the visitor didn't see", () => {
		const s = building();
		s.abr = "nein";
		s.groups.kwz[0].inst = "nein";
		s.groups.kwz[0].her = "Alt GmbH";
		const sh = sheet(s);
		expect(sh[0].items.map((i) => i.q)).toEqual([
			"Liegt eine Heizkostenabrechnung vor?",
		]);
		expect(
			sh
				.flatMap((x) => x.items)
				.some((i) => i.q === "Hersteller oder Messdienst"),
		).toBe(false);
		// A new meter: photos of the place, not of the meter.
		expect(sheetSlots(sh)).toEqual(new Set(["g1"]));
	});
});
