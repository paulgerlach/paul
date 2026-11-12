import { describe, expect, it } from "vitest";
import { selfServiceStateSchema } from "$lib/forms/selfServiceOffer";
import {
	billingLines,
	calc,
	fresh,
	gateways,
	hintsFor,
	liveRows,
	makeOffer,
	newGroup,
	nextGroupId,
	offerDates,
	offerFileName,
	offerParts,
	positions,
	priceList,
	progress,
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
			"anz",
			"heiz",
			"einheiten",
			"mont",
			"zusatz",
			"kontakt",
			"res",
			"adr",
			"ang",
		]);
	});

	it("shows four sections in the progress bar", () => {
		const s = building();
		s.cur = steps(s).indexOf("dev:kwz");
		const p = progress(s);
		expect(p.cur).toBe(1);
		expect(p.sections.map((x) => x.state)).toEqual(["done", "cur", "", ""]);
		// Geräte: geraete, heiz, einheiten done of five.
		expect(p.sections[1].f).toBe(3 / 5);
		s.cur = steps(s).indexOf("ang");
		expect(progress(s).sections.every((x) => x.f === 1)).toBe(true);
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
				"Bitte ergänzen Sie: Einbaulänge, Dauerdurchfluss Q3/Qn, Anschlussgewinde. Alternativ genügt ein Foto des Zählers.",
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
			"Bitte ergänzen Sie: Dauerdurchfluss Q3/Qn. Alternativ genügt ein Foto des Zählers.",
		);
	});

	it("asks for the capsule's norm only for an installed meter, and no valve", () => {
		const s = building();
		s.groups.kwz[0] = { ...newGroup("g1"), n: "6", einbau: "up", inst: "ja" };
		expect(validate("dev:kwz", s, none)?.message).toBe(
			"Bitte ergänzen Sie: MID-Norm der Messkapsel (oder „Andere / unklar“). Alternativ genügt ein Foto des Zählers.",
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
			rr: false,
			ok: true,
		};
		expect(validate("kontakt", s, none)?.message).toMatch(/E-Mail/);
		s.k.mail = "test@hv-muster.de";
		expect(validate("kontakt", s, none)?.message).toMatch(/echte E-Mail/);
		s.k.mail = "eva@example.com";
		expect(validate("kontakt", s, none)?.message).toMatch(/echte E-Mail/);
		s.k.mail = "eva@hv-muster.de";
		expect(validate("kontakt", s, none)?.message).toBe(
			"Bitte geben Sie eine Telefonnummer an.",
		);
		s.k.tel = "030 123456";
		expect(validate("kontakt", s, none)).toBeNull();
		s.adr.l = {
			str: "Hauptstraße 1",
			zus: "",
			plz: "1234",
			ort: "Berlin",
			hin: "",
		};
		expect(validate("adr", s, none)?.message).toMatch(/fünfstellige PLZ/);
		s.adr.l.plz = "11111";
		expect(validate("adr", s, none)?.message).toMatch(/echte Adresse/);
		s.adr.l = { ...s.adr.l, plz: "10115", str: "Teststraße 3" };
		expect(validate("adr", s, none)?.message).toMatch(/echte Adresse/);
		s.adr.l.str = "Musterstraße 3";
		expect(validate("adr", s, none)?.message).toMatch(/echte Adresse/);
		s.adr.l.str = "Hauptstraße 1";
		expect(validate("adr", s, none)).toBeNull();
	});

	it("asks for the heating and the hot water first", () => {
		const s = building();
		expect(validate("heiz", s, none)?.message).toBe(
			"Bitte wählen Sie die Heizungsart.",
		);
		s.heiz = ["gas"];
		expect(validate("heiz", s, none)?.message).toMatch(/Warmwasser/);
		s.ww = "zentral";
		expect(validate("heiz", s, none)).toBeNull();
		s.kauf = "offen";
		expect(validate("heiz", s, none)?.message).toMatch(/mieten oder kaufen/);
		s.kauf = "beides";
		expect(validate("heiz", s, none)).toBeNull();
	});

	it("takes a photo instead of the sizes, and asks for one when unknown", () => {
		const s = building();
		Object.assign(s.groups.kwz[0], { inst: "ja", bl: "", q3: "", gew: "" });
		expect(validate("dev:kwz", s, none)?.message).toBe(
			"Bitte ergänzen Sie: Einbaulänge, Dauerdurchfluss Q3/Qn, Anschlussgewinde. Alternativ genügt ein Foto des Zählers.",
		);
		const photo = (id: string) => (id === "g1z" ? 1 : 0);
		expect(validate("dev:kwz", s, photo)).toBeNull();
		expect(calc(s, photo).checks).toContain(
			"Kaltwasserzähler · Gruppe 1: Einbaulänge, Q3, Gewinde aus Foto bestimmen",
		);
		s.groups.kwz[0].einbau = "unbekannt";
		expect(validate("dev:kwz", s, none)).toMatchObject({
			group: "g1",
			drop: true,
			message: expect.stringMatching(/^Bei unbekannter Einbauart/),
		});
		expect(validate("dev:kwz", s, photo)).toBeNull();
	});

	it("asks for the installation year when meters are kept", () => {
		const s = building();
		Object.assign(s, { bestand: "funk", pref: "behalten" });
		expect(validate("bestand", s, none)?.message).toMatch(/eingebaut/);
		s.ejahr = "2019";
		expect(validate("bestand", s, none)).toBeNull();
		expect(calc(s).checks[0]).toMatch(
			/^Weiterverwendung gewünscht, Einbaujahr 2019: /,
		);
	});

	it("asks for at least one count with a device list", () => {
		const s = building();
		s.liste = "liste";
		expect(validate("anz", s, none)?.message).toMatch(/mindestens einen/);
		s.anz.rwm = "4";
		expect(validate("anz", s, none)).toBeNull();
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

	it("prices the purchase instead of the rental when buying", () => {
		const s = building();
		s.kauf = "kauf";
		const c = calc(s);
		expect(c.rent).toBe(0);
		expect(c.gwc).toBe(0);
		// 6 × 79 water meters, 20 × 29 allocators, a 399 gateway.
		expect(c.bought).toBe(474 + 580 + 399);
		expect(c.once).toBe(26 * 3 + c.bought);
		const p = positions(c);
		expect(p.rental.map((r) => [r.t, r.n, r.ep, r.lz])).toEqual([
			["Funk Kaltwasserzähler", 6, 79, ""],
			["Funk Heizkostenverteiler", 20, 29, ""],
			["Funk-Gateway", 1, 399, ""],
		]);
		expect(p.sK).toBe(c.bought);
		expect(p.year).toBe(p.sS);
	});

	it("leaves a large heat meter's purchase price on request", () => {
		const s = building();
		s.kauf = "kauf";
		s.devs = ["wmz"];
		s.groups.wmz = [
			{ ...newGroup("g3"), n: "1", wtyp: "ap", qp: "6,0" },
			{ ...newGroup("g4"), n: "2", wtyp: "up" },
		];
		const c = calc(s);
		expect(c.checks).toContain(
			"Kauf gewünscht: Kaufpreis für große Wärmemengenzähler ergänzt Heidi im Angebot",
		);
		expect(positions(c).rental.map((r) => [r.t, r.ep, r.ask])).toEqual([
			["Funk Wärmemengenzähler", 0, true],
			["Funk Wärmemengenzähler (Messkapsel)", 219, undefined],
			["Funk-Gateway", 399, undefined],
		]);
	});

	it("charges 499 € for fewer than 20 meters installed by Heidi", () => {
		const s = building();
		s.mont.wer = "heidi";
		s.groups.hkv[0].n = "10";
		expect(calc(s).inst).toBe(499);
		s.liste = "liste";
		expect(calc(s).inst).toBe(0);
		s.anz.kwz = "25";
		expect(calc(s).inst).toBe(999);
	});

	it("adds the consultations once", () => {
		const s = building();
		s.ber = true;
		s.rber = true;
		expect(calc(s).once).toBe(26 * 3 + 39);
		s.devs.push("rwm");
		s.rwm.n = "4";
		const c = calc(s);
		expect(c.rber).toBe(39);
		expect(positions(c).once.map((r) => r.t)).toEqual([
			"Inbetriebnahme Funksystem / OMS",
			"Beratungstermin mit Zähleridentifikation",
			"Beratung zur Rauchwarnmelderpflicht",
		]);
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

describe("priceList", () => {
	it("lists every position with its total, one per line", () => {
		const s = building();
		s.mont.wer = "heidi";
		const p = positions(calc(s));
		const lines = priceList(s).split("\n");
		expect(lines).toHaveLength(p.svc.length + p.rental.length + p.once.length);
		expect(lines).toContain("Installationspauschale: 999,00 €");
		expect(lines).toContain("Inbetriebnahme Funksystem / OMS: 78,00 €");
	});

	it("says an on-request meter's price is on request", () => {
		const s = building();
		s.devs.push("weitere");
		s.groups.weitere = [{ ...newGroup("g3"), n: "2", art: "gas" }];
		expect(priceList(s).split("\n").at(-1)).toBe("Gaszähler: auf Anfrage");
	});

	it("adds the purchase variant for both", () => {
		const s = building();
		s.kauf = "beides";
		expect(priceList(s)).toContain(
			"Kaufvariante: Gerätekauf einmalig 1.453,00 €",
		);
		expect(priceList(s)).toContain("Kauf Funk-Gateway: 399,00 €");
	});
});

describe("offerParts", () => {
	const o = makeOffer(Date.UTC(2026, 9, 22), 0);

	it("puts the billing into its own document", () => {
		const s = building();
		s.mont.wer = "heidi";
		const p = positions(calc(s));
		const [g, a] = offerParts(s, o);
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
		const parts = offerParts(s, o);
		expect(parts.map((x) => [x.kind, x.nr, x.of])).toEqual([
			["g", "2026-AN100000", "1 von 1"],
		]);
	});

	it("adds the purchase variant after the rental for both", () => {
		const s = building();
		s.kauf = "beides";
		const parts = offerParts(s, o);
		expect(parts.map((x) => [x.id, x.nr, x.of, x.title])).toEqual([
			["g", "2026-AN100000-M", "1 von 3", "Gerätemiete und Service"],
			["k", "2026-AN100000-K", "2 von 3", "Gerätekauf und Service"],
			["a", "2026-AN100000-A", "3 von 3", "Heizkostenabrechnung"],
		]);
		const k = parts[1].p;
		expect(k).toMatchObject({ buy: true, sM: 0, sK: 1453 });
		expect(k.first).toBe(k.year + k.sO + k.sK);
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
			rr: false,
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
});

describe("liveRows", () => {
	it("counts a device once its step is reached", () => {
		const s = building();
		s.cur = steps(s).indexOf("dev:kwz");
		expect(liveRows(s, none)).toEqual([
			["Kaltwasserzähler", "6"],
			["Heizkostenverteiler", "–"],
			["Einheiten", "6"],
			["Funk-Gateways", "1"],
			["Miete oder Kauf", "Miete"],
		]);
		s.cur = steps(s).indexOf("zusatz");
		s.ber = true;
		expect(liveRows(s, none).slice(2)).toEqual([
			["Beratungstermin", "39 €"],
			["Einheiten", "6"],
			["Funk-Gateways", "1"],
			["Miete oder Kauf", "Miete"],
			["Montage", "Selbst"],
		]);
	});
});

describe("hintsFor", () => {
	it("recommends a heat meter for the hot water once, before the contact", () => {
		const s = building();
		s.devs = ["wwz", "hkv"];
		expect(hintsFor("zusatz", s)).toEqual([]);
		const [h] = hintsFor("kontakt", s);
		expect(h).toMatchObject({ key: "recwmz", add: "Hinzufügen" });
		s.ack[h.key] = true;
		expect(hintsFor("kontakt", s)).toEqual([]);
		s.ack = {};
		s.devs.push("wmz");
		expect(hintsFor("kontakt", s)).toEqual([]);
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
