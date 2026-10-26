import { describe, expect, it } from "vitest";
import { selfServiceStateSchema } from "$lib/forms/selfServiceOffer";
import {
	billingLines,
	calc,
	fresh,
	gateways,
	liveRows,
	makeOffer,
	newGroup,
	nextGroupId,
	offerDates,
	offerFileName,
	offerParts,
	offerSummary,
	positions,
	steps,
	validate,
	type State,
} from "./model";

/** A small building: 6 flats, 6 cold water meters, 20 heat cost allocators. */
function building(): State {
	const s = fresh();
	Object.assign(s, {
		abr: "nein",
		liste: "nein",
		bestand: "nein",
		devs: ["kwz", "hkv"],
		leist: "a",
		kauf: "miete",
		units: "6",
	});
	s.groups.kwz = [{ ...newGroup("g1"), n: "6", einbau: "ap", absv: "ja" }];
	s.groups.hkv = [{ ...newGroup("g2"), n: "20", art: "platte" }];
	return s;
}

const none = () => 0;

describe("steps", () => {
	it("asks for the devices one by one without a device list", () => {
		expect(steps(building())).toEqual([
			"abr",
			"liste",
			"bestand",
			"geraete",
			"heiz",
			"einheiten",
			"dev:kwz",
			"dev:hkv",
			"mont",
			"zusatz",
			"kontakt",
			"res",
			"adr",
			"ang",
		]);
	});

	it("skips the device questions with a device list", () => {
		const s = building();
		s.liste = "liste";
		expect(steps(s)).toEqual([
			"abr",
			"liste",
			"heiz",
			"einheiten",
			"zusatz",
			"kontakt",
			"res",
			"adr",
			"ang",
		]);
	});

	it("has no step for “not sure”", () => {
		const s = building();
		s.devs = ["unsicher"];
		expect(steps(s).filter((x) => x.startsWith("dev:"))).toEqual([]);
	});
});

describe("validate", () => {
	it("asks for the bill when one is announced", () => {
		const s = fresh();
		expect(validate("abr", s, none)?.message).toBe(
			"Bitte wählen Sie eine Antwort.",
		);
		s.abr = "ja";
		expect(validate("abr", s, none)?.message).toMatch(/Abrechnung hoch/);
		expect(validate("abr", s, () => 1)).toBeNull();
	});

	it("names the missing sizes of a surface-mounted water meter", () => {
		const s = building();
		s.groups.kwz[0].bl = "";
		expect(validate("dev:kwz", s, none)).toEqual({
			message:
				"Bitte ergänzen Sie: Einbaulänge, Dauerdurchfluss Q3/Qn, Anschlussgewinde.",
			group: "g1",
		});
		Object.assign(s.groups.kwz[0], {
			bl: "andere",
			blx: "110",
			q3: "unbekannt",
			gew: "G ¾",
		});
		// "Unbekannt" counts as missing for these three.
		expect(validate("dev:kwz", s, none)?.message).toBe(
			"Bitte ergänzen Sie: Dauerdurchfluss Q3/Qn.",
		);
	});

	it("asks for the capsule's norm only for an installed meter, and no valve", () => {
		const s = building();
		s.groups.kwz[0] = { ...newGroup("g1"), n: "6", einbau: "up", inst: "ja" };
		expect(validate("dev:kwz", s, none)?.message).toBe(
			"Bitte ergänzen Sie: MID-Norm der Messkapsel (oder „Andere / unklar“).",
		);
		s.groups.kwz[0].inst = "nein";
		expect(validate("dev:kwz", s, none)).toBeNull();
		s.groups.kwz[0].einbau = "neu";
		expect(validate("dev:kwz", s, none)?.message).toBe(
			"Bitte ergänzen Sie: Absperrventil vorhanden?.",
		);
	});

	it("prefixes the group when there are several", () => {
		const s = building();
		s.groups.hkv.push({ ...newGroup("g3"), n: "2" });
		expect(validate("dev:hkv", s, none)).toEqual({
			message: "Gruppe 2: Bitte wählen Sie die Heizkörperbauart.",
			group: "g3",
		});
	});

	it("checks the contact and the addresses", () => {
		const s = building();
		s.k = {
			vn: "Eva",
			nn: "Muster",
			firma: "",
			mail: "eva@",
			tel: "",
			ok: true,
		};
		expect(validate("kontakt", s, none)?.message).toMatch(/E-Mail/);
		s.k.mail = "eva@example.com";
		expect(validate("kontakt", s, none)).toBeNull();
		s.adr.l = {
			str: "Hauptstraße 1",
			zus: "",
			plz: "1234",
			ort: "Berlin",
			hin: "",
		};
		expect(validate("adr", s, none)?.message).toMatch(/fünfstellige PLZ/);
		s.adr.l.plz = "10115";
		expect(validate("adr", s, none)).toBeNull();
	});
});

describe("calc", () => {
	it("prices rental, service, gateway and billing", () => {
		const c = calc(building());
		expect(c.dev).toBe(26);
		expect(c.rent).toBe(6 * 27 + 20 * 9);
		expect(c.wart).toBe(26 * 5);
		expect(c.gw).toBe(1);
		expect(c.gwc).toBe(39);
		expect(c.abr).toBe(6 * 27.5);
		expect(c.yearly).toBe(342 + 130 + 39 + 165);
		// Self-installation: no flat rate, only commissioning.
		expect(c.inst).toBe(0);
		expect(c.once).toBe(26 * 3);
	});

	it("plans two gateways from 11 units", () => {
		const s = building();
		s.units = "11";
		expect(gateways(s)).toBe(2);
		s.units = "";
		expect(gateways(s)).toBe(0);
	});

	it("takes over radio meters for free when wanted", () => {
		const s = building();
		s.pref = "behalten";
		Object.assign(s.groups.kwz[0], { inst: "ja", funk: "funk" });
		const c = calc(s);
		expect(c.keep).toBe(6);
		expect(c.rows[0]).toMatchObject({ tag: "Übernahme prüfen", p: 0 });
		expect(c.checks).toContain(
			"Kaltwasserzähler · Gruppe 1: Funkprotokoll und Zugangsschlüssel für Übernahme prüfen",
		);
	});

	it("leaves the rental out when buying", () => {
		const s = building();
		s.kauf = "kauf";
		const c = calc(s);
		expect(c.rent).toBe(0);
		expect(c.gwc).toBe(0);
		const p = positions(c);
		expect(p.rental.every((r) => r.kauf && r.ep === 0)).toBe(true);
	});
});

describe("further services", () => {
	it("name their starting prices and become check points", () => {
		const s = building();
		s.zusatz = ["ea", "ha"];
		const c = calc(s);
		expect(c.extras).toEqual([
			"Energieausweis (ab 69,95 €)",
			"Hydraulischer Abgleich (ab 800 € pro Gebäude)",
		]);
		expect(c.checks).toContain("Energieausweis: Angebot erstellen");
	});
});

describe("positions", () => {
	it("lays out the offer as the Heidi template", () => {
		const s = building();
		s.mont.wer = "heidi";
		const p = positions(calc(s));
		expect(p.svc.map((r) => r.t)).toEqual([
			"Einzelabrechnung",
			"Wartungs- und Funktionsdienst für Funkgeräte",
		]);
		expect(p.rental.map((r) => [r.t, r.lz, r.n])).toEqual([
			["Funk Kaltwasserzähler", "6 Jahre", 6],
			["Funk Heizkostenverteiler", "10 Jahre", 20],
			["Funk-Gateway", "6 Jahre", 1],
		]);
		expect(p.once.map((r) => r.t)).toEqual([
			"Inbetriebnahme Funksystem / OMS",
			"Installationspauschale",
		]);
		expect(p.sO).toBe(26 * 3 + 999);
		expect(p.year).toBe(p.sS + p.sM);
	});
});

describe("offerParts", () => {
	const o = makeOffer(Date.UTC(2026, 9, 22), 0);

	it("puts the billing into its own document", () => {
		const s = building();
		s.mont.wer = "heidi";
		const p = positions(calc(s));
		const [g, a] = offerParts(p, o);
		expect([g.nr, g.of, g.title]).toEqual([
			"2026-AN100000-G",
			"1 von 2",
			"Gerätemiete und Service",
		]);
		expect(g.p.svc.map((r) => r.t)).toEqual([
			"Wartungs- und Funktionsdienst für Funkgeräte",
		]);
		expect(g.p.year).toBe(p.year - 6 * 27.5);
		expect(g.p.first).toBe(g.p.year + p.sO);
		expect([a.nr, a.of, a.title]).toEqual([
			"2026-AN100000-A",
			"2 von 2",
			"Heizkostenabrechnung",
		]);
		expect(a.p).toMatchObject({ sS: 165, sM: 0, sO: 0, year: 165, first: 165 });
	});

	it("keeps one document without billing", () => {
		const s = building();
		s.leist = "b";
		const parts = offerParts(positions(calc(s)), o);
		expect(parts.map((x) => [x.kind, x.nr, x.of])).toEqual([
			["g", "2026-AN100000", "1 von 1"],
		]);
	});
});

describe("the offer", () => {
	it("numbers and dates it in Berlin, valid for 60 days", () => {
		// 22.10.2026, 23:30 UTC is already the 23rd in Berlin.
		const o = makeOffer(Date.UTC(2026, 9, 22, 23, 30), 0.5);
		expect(o).toMatchObject({ id: "550000", nr: "2026-AN550000" });
		expect(offerDates(o)).toEqual({ date: "23.10.2026", valid: "21.12.2026" });
	});

	it("addresses the company and names the file after the street", () => {
		const s = building();
		s.k = {
			vn: "Eva",
			nn: "Muster",
			firma: "HV Muster",
			mail: "eva@example.com",
			tel: "",
			ok: true,
		};
		s.adr.l = {
			str: "Hauptstr. 1/2",
			zus: "",
			plz: "10115",
			ort: "Berlin",
			hin: "",
		};
		expect(billingLines(s)).toEqual([
			"HV Muster",
			"z. Hd. Eva Muster",
			"Hauptstr. 1/2",
			"10115 Berlin",
		]);
		const o = makeOffer(Date.UTC(2026, 9, 22), 0);
		expect(offerFileName(s, o)).toBe(
			"Heidi Systems - Angebot 100000, Hauptstr. 12.pdf",
		);
		expect(offerFileName(s, o, "Heizkostenabrechnung")).toBe(
			"Heidi Systems - Angebot Heizkostenabrechnung 100000, Hauptstr. 12.pdf",
		);
	});

	it("summarises it for Heidi", () => {
		const s = building();
		s.k = {
			vn: "Eva",
			nn: "<b>",
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
		const text = offerSummary(s, makeOffer(Date.UTC(2026, 9, 22), 0), "Neu", 2);
		expect(text).toContain("Neu · 2026-AN100000");
		expect(text).toContain("*Eva &lt;b&gt;*");
		expect(text).toContain(
			"Liegenschaft: Hauptstraße 1, 10115 Berlin · 6 Einheiten",
		);
		expect(text).toContain(
			"Geräte: 6 × Kaltwasserzähler, 20 × Heizkostenverteiler, 1 × Funk-Gateway",
		);
		expect(text).toContain(
			"Angebote: Gerätemiete und Service + Heizkostenabrechnung (zwei getrennte Dokumente)",
		);
		expect(text).toContain("Fotos/Dateien: 2 (nicht übertragen");
	});
});

describe("liveRows", () => {
	it("counts a device once its step is reached", () => {
		const s = building();
		s.cur = steps(s).indexOf("dev:kwz");
		expect(liveRows(s, 0)).toEqual([
			["Kaltwasserzähler", "6"],
			["Heizkostenverteiler", "–"],
			["Einheiten", "6"],
			["Funk-Gateways", "1"],
		]);
		s.cur = steps(s).indexOf("mont");
		expect(liveRows(s, 0).map(([label]) => label)).not.toContain(
			"Laufend pro Jahr",
		);
	});
});

describe("nextGroupId", () => {
	it("never repeats an id after a resume", () => {
		expect(nextGroupId(building())).toBe("g3");
		expect(nextGroupId(fresh())).toBe("g1");
	});
});

describe("selfServiceStateSchema", () => {
	it("accepts a state and fills what an older one lacks", () => {
		expect(selfServiceStateSchema.parse(building())).toEqual(building());
		const old = { ...fresh(), cur: 3, abr: "nein" } as Partial<State>;
		delete old.zusatz;
		expect(selfServiceStateSchema.parse(old).zusatz).toEqual([]);
	});
});
