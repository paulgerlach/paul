/**
 * The Zählercheck's model, pure (the design's `#ss-js` without the DOM): the
 * state, the step list, each step's check, the device list and the cost
 * estimate (`calc`), the offer's positions and the text the server sends to
 * Make.com. Shared by the wizard in the browser and the endpoint, which
 * validates the state and builds the notification itself.
 */
import {
	DEVICES,
	EXTRAS,
	GROUP_DEVS,
	OFFER_DEVICE,
	OFFER_VALID_DAYS,
	ORDER,
	PRICES,
	SERVICES,
	TERMS_BY_DEVICE,
	type DevKey,
	type GroupDev,
	type SizeKey,
} from "./data";

/** One group of identical devices. Every field is the raw form value. */
export type Group = {
	id: string;
	n: string;
	inst: string;
	funk: string;
	her: string;
	mod: string;
	jahr: string;
	std: string;
	key: string;
	einbau: string;
	ksys: string;
	ksysx: string;
	wtyp: string;
	fg: string;
	art: string;
	was: string;
	fuehler: string;
	absv: string;
	bem: string;
	bl: string;
	blx: string;
	dn: string;
	dnx: string;
	gew: string;
	gewx: string;
	qp: string;
	qpx: string;
	q3: string;
	q3x: string;
};

export type Address = {
	str: string;
	zus: string;
	plz: string;
	ort: string;
	hin: string;
};
export type BillingAddress = {
	firma: string;
	name: string;
	str: string;
	zus: string;
	plz: string;
	ort: string;
	ust: string;
};

/**
 * The offer once made: its number and when (ms); `noted` once Heidi heard of
 * it, `sent` once requested by email.
 */
export type Offer = {
	id: string;
	nr: string;
	ts: number;
	noted?: boolean;
	sent?: boolean;
};

export type State = {
	abr: string;
	abrNote: string;
	liste: string;
	listeNote: string;
	bestand: string;
	pref: string;
	devs: string[];
	heiz: string[];
	ww: string;
	leist: string;
	kauf: string;
	units: string;
	groups: Record<GroupDev, Group[]>;
	rwm: {
		n: string;
		mont: string[];
		sz: string;
		kz: string;
		fl: string;
		art: string;
		bem: string;
	};
	mont: {
		abs: string;
		eat: string;
		err: string;
		wer: string;
		san: string;
		bem: string;
	};
	zusatz: string[];
	k: {
		vn: string;
		nn: string;
		firma: string;
		mail: string;
		tel: string;
		ok: boolean;
	};
	adr: { l: Address; same: boolean; r: BillingAddress };
	ang: Offer | null;
	cur: number;
};

export function fresh(): State {
	return {
		abr: "",
		abrNote: "",
		liste: "",
		listeNote: "",
		bestand: "",
		pref: "",
		devs: [],
		heiz: [],
		ww: "",
		leist: "",
		kauf: "",
		units: "",
		groups: { kwz: [], wwz: [], wmz: [], hkv: [], weitere: [] },
		rwm: { n: "", mont: [], sz: "", kz: "", fl: "", art: "", bem: "" },
		mont: { abs: "", eat: "", err: "", wer: "eigen", san: "", bem: "" },
		zusatz: [],
		k: { vn: "", nn: "", firma: "", mail: "", tel: "", ok: false },
		adr: {
			l: { str: "", zus: "", plz: "", ort: "", hin: "" },
			same: true,
			r: { firma: "", name: "", str: "", zus: "", plz: "", ort: "", ust: "" },
		},
		ang: null,
		cur: 0,
	};
}

export function newGroup(id: string): Group {
	return {
		id,
		n: "1",
		inst: "",
		funk: "",
		her: "",
		mod: "",
		jahr: "",
		std: "",
		key: "",
		einbau: "",
		ksys: "",
		ksysx: "",
		wtyp: "",
		fg: "",
		art: "",
		was: "",
		fuehler: "",
		absv: "",
		bem: "",
		bl: "",
		blx: "",
		dn: "",
		dnx: "",
		gew: "",
		gewx: "",
		qp: "",
		qpx: "",
		q3: "",
		q3x: "",
	};
}

/** The next free group id (`g1`, `g2` …) in a state. */
export function nextGroupId(s: State): string {
	const used = GROUP_DEVS.flatMap((d) => s.groups[d]).map(
		(g) => Number(g.id.slice(1)) || 0,
	);
	return `g${Math.max(0, ...used) + 1}`;
}

export const num = (v: unknown) => {
	const n = parseFloat(String(v ?? "").replace(",", "."));
	return Number.isNaN(n) ? 0 : n;
};

/** The devices are captured one by one (no device list or bill uploaded). */
export const tech = (s: State) => !(s.liste && s.liste !== "nein");
/** Every meter is replaced. */
export const swapAll = (s: State) => s.pref === "neu";

/** A standard size's value: the free one for "andere", none if unknown. */
export function sizeValue(g: Group, k: SizeKey): string {
	if (g[k] === "andere") return String(g[`${k}x`] ?? "").trim();
	if (g[k] === "unbekannt") return "";
	return String(g[k] ?? "").trim();
}

export type DevStep = `dev:${DevKey}`;
export type StepId =
	| "abr"
	| "liste"
	| "bestand"
	| "geraete"
	| "heiz"
	| "einheiten"
	| DevStep
	| "mont"
	| "zusatz"
	| "kontakt"
	| "res"
	| "adr"
	| "ang";

export function steps(s: State): StepId[] {
	const list: StepId[] = ["abr", "liste"];
	if (tech(s)) list.push("bestand", "geraete");
	list.push("heiz", "einheiten");
	if (tech(s))
		for (const d of s.devs)
			if (d !== "unsicher") list.push(`dev:${d as DevKey}`);
	if (tech(s)) list.push("mont");
	list.push("zusatz", "kontakt", "res", "adr", "ang");
	return list;
}

/** Steps that can be skipped ("Überspringen"). */
export const isOptional = (id: StepId) =>
	id === "mont" || id === "zusatz" || id === "dev:rwm";

export const devOf = (id: StepId): DevKey | null =>
	id.startsWith("dev:") ? (id.slice(4) as DevKey) : null;

/** Smoke alarms: the given total or the minimum from the rooms. */
export function smokeAlarms(s: State) {
	const r = s.rwm;
	return num(r.n) || num(r.sz) + num(r.kz) + num(r.fl);
}

/** Gateways planned for the units: one up to 10, two above. */
export function gateways(s: State) {
	const u = num(s.units);
	return u ? (u <= 10 ? 1 : 2) : 0;
}

export type Row = {
	d: DevKey;
	key: string;
	n: number;
	/** Price per device and year. */
	p: number;
	/** "Weitere Zähler": price on request. */
	req?: boolean;
	sub: string;
	tag: string;
	/** The tag is a check ("prüfen"). */
	ck: boolean;
	rent: number;
	grp?: number;
	take?: boolean;
	/** A water meter under plaster: shown as its capsule. */
	capsule?: boolean;
};

export type Calc = ReturnType<typeof calc>;

const OTHER_METERS: Record<string, string> = {
	strom: "Stromzähler",
	gas: "Gaszähler",
	sonst: "Sonstiger Zähler",
};
const MOUNTING: Record<string, string> = {
	decke: "normale Decke",
	schraege: "Dachschräge",
	hoch: "hohe Decke",
};

/** The device list, the costs and the check points (`calc`). */
export function calc(s: State) {
	const rows: Row[] = [];
	const checks: string[] = [];
	let dev = 0;
	let rent = 0;
	let keep = 0;
	if (tech(s)) {
		for (const d of s.devs) {
			if (d === "unsicher") {
				checks.push("Gerätebedarf gemeinsam mit Heidi klären");
				continue;
			}
			if (d === "weitere") {
				s.groups.weitere.forEach((g, i) => {
					const n = num(g.n);
					if (!n) return;
					rows.push({
						d,
						key: g.id,
						n,
						p: 0,
						req: true,
						sub: OTHER_METERS[g.art] || "Zählerart offen",
						tag: "Preis auf Anfrage",
						ck: true,
						rent: 0,
						grp: i + 1,
					});
					checks.push(
						`Weitere Zähler (${OTHER_METERS[g.art] || "Art offen"}): Angebot erstellen`,
					);
				});
				continue;
			}
			if (d === "rwm") {
				const r = s.rwm;
				const n = smokeAlarms(s);
				if (!n) continue;
				const price = DEVICES.rwm.price;
				dev += n;
				rent += n * price;
				const min = num(r.sz) + num(r.kz) + num(r.fl);
				rows.push({
					d,
					key: "rwm",
					n,
					p: price,
					sub:
						"Montage: " +
						(r.mont.length
							? r.mont.map((m) => MOUNTING[m]).join(", ")
							: "offen"),
					tag: "Neu",
					ck: false,
					rent: n * price,
				});
				if (min && n < min)
					checks.push(
						"Rauchwarnmelder: Gesamtzahl unter der Mindestzahl aus den Räumen",
					);
				if (r.mont.includes("schraege") || r.mont.includes("hoch"))
					checks.push(
						"Rauchwarnmelder: Montage an Dachschräge oder hoher Decke prüfen",
					);
				continue;
			}
			const dv = d as Exclude<GroupDev, "weitere">;
			s.groups[dv].forEach((g, i) => {
				const n = num(g.n);
				if (!n) return;
				const lab = `${DEVICES[dv].name} · Gruppe ${i + 1}`;
				dev += n;
				const exFunk = g.inst === "ja" && g.funk === "funk" && !swapAll(s);
				const take = exFunk && (s.leist === "c" || s.pref === "behalten");
				const p = take ? 0 : DEVICES[dv].price;
				const r = n * p;
				rent += r;
				if (take) keep += n;
				const sub: string[] = [];
				let tag = "Neu";
				let ck = false;
				if (g.inst === "ja") tag = take ? "Übernahme prüfen" : "Austausch";
				if (g.inst === "unbekannt") {
					tag = "Vor Ort prüfen";
					ck = true;
					checks.push(`${lab}: Bestand nicht eindeutig`);
				}
				if (dv === "kwz" || dv === "wwz") {
					sub.push(
						(
							{
								up: "Unterputz",
								ap: "Aufputz",
								neu: "neuer Einbauplatz",
								unbekannt: "Einbau unbekannt",
							} as Record<string, string>
						)[g.einbau] || "Einbau offen",
					);
					if (g.einbau === "up" && g.ksys)
						sub.push(
							g.ksys === "andere"
								? g.ksysx
									? `Aufschrift ${g.ksysx}`
									: "Norm unklar"
								: `MID ${g.ksys}`,
						);
					if (!g.einbau || g.einbau === "unbekannt") {
						ck = true;
						checks.push(`${lab}: Einbauart prüfen`);
					}
					if (g.einbau === "up" && (!g.ksys || g.ksys === "andere"))
						checks.push(`${lab}: MID-Norm der Messkapsel bestimmen`);
					if (g.einbau === "neu")
						checks.push(`${lab}: neuen Einbauplatz vorbereiten`);
				}
				if (dv === "wmz") {
					sub.push(
						(
							{ ap: "Aufputz", up: "Unterputz/Kapsel" } as Record<
								string,
								string
							>
						)[g.wtyp] || "Bauart offen",
					);
					if (sizeValue(g, "qp")) sub.push(`qp ${sizeValue(g, "qp")} m³/h`);
					if (g.wtyp === "ap" && sizeValue(g, "bl"))
						sub.push(`${sizeValue(g, "bl")} mm`);
					if (g.fg && g.fg !== "unbekannt")
						sub.push(`Fühler ${g.fg.replace(".", ",")} mm`);
					if (g.fg === "unbekannt") {
						ck = true;
						checks.push(`${lab}: Temperaturfühlergröße bestimmen`);
					}
					if (!g.fuehler || g.fuehler === "unbekannt")
						checks.push(`${lab}: Fühleraufnahme vor Ort prüfen`);
				}
				if (dv === "hkv")
					sub.push(
						(
							{
								platte: "Plattenheizkörper",
								glieder: "Röhren-, Glieder- oder Rippenheizkörper",
							} as Record<string, string>
						)[g.art] || "Bauart offen",
					);
				if (exFunk)
					checks.push(
						`${lab}: Funkprotokoll und Zugangsschlüssel für Übernahme prüfen`,
					);
				if (g.absv === "nein")
					checks.push(
						`${lab}: kein Absperrventil, Ventil vor dem Tausch setzen`,
					);
				rows.push({
					d: dv,
					key: g.id,
					n,
					p,
					take,
					sub: sub.join(" · "),
					tag,
					ck,
					rent: r,
					grp: i + 1,
					capsule:
						(dv === "kwz" || dv === "wwz") && g.einbau === "up"
							? true
							: undefined,
				});
			});
		}
	}
	const units = num(s.units);
	const gw = gateways(s);
	const withAbr = s.leist === "a" || s.leist === "c";
	const m = s.mont;
	if (tech(s)) {
		if (m.abs === "nein" || m.abs === "unbekannt")
			checks.push("Absperrbarkeit der Leitungen prüfen");
		if (m.eat === "nein" || m.eat === "pruefen" || m.eat === "teils")
			checks.push("Einbausätze und Rohrpassstücke klären");
		if (!m.wer || m.wer === "offen")
			checks.push("Montage klären: selbst oder durch Heidi");
		if (m.err === "schwer")
			checks.push("Zugang zu schwer erreichbaren Zählern klären");
		if (m.san === "heidi" && (m.eat === "nein" || m.err === "schwer"))
			checks.push(
				"Sanitärvorarbeiten durch Heidi koordinieren, Aufwandspauschale im Angebot",
			);
	} else
		checks.unshift(
			"Zählerbestand aus Ihren Unterlagen übernehmen und bestätigen",
		);
	if (s.leist === "d") checks.push("Leistungsumfang in der Beratung festlegen");
	if (units > 30)
		checks.push("Gateway-Anzahl für die Gebäudegröße technisch prüfen");
	const wart = dev * PRICES.wart;
	const abr = withAbr ? units * PRICES.abr : 0;
	let gwc = gw * PRICES.gw;
	const ibn = dev * PRICES.ibn;
	const self = m.wer === "eigen";
	const inst = tech(s) && m.wer === "heidi" && dev ? PRICES.inst : 0;
	const buy = s.kauf === "kauf";
	if (buy) {
		rent = 0;
		gwc = 0;
		checks.push(
			"Kauf gewünscht: Kaufpreise für Geräte und Gateway ergänzt Heidi im Angebot",
		);
	}
	if (s.kauf === "offen") checks.push("Kauf oder Miete in der Beratung klären");
	const extras = EXTRAS.filter((z) => s.zusatz.includes(z.v)).map(
		(z) => z.title,
	);
	for (const z of extras) checks.push(`${z}: Angebot erstellen`);
	return {
		buy,
		extras,
		rows,
		dev,
		rent,
		keep,
		wart,
		abr,
		withAbr,
		gw,
		gwc,
		ibn,
		inst,
		self,
		units,
		checks,
		yearly: rent + wart + abr + gwc,
		once: inst + ibn,
	};
}

/** How many answers are "unknown" (three or more ask for more detail). */
export function unknownCount(s: State) {
	let n = 0;
	if (s.bestand === "unbekannt") n++;
	if (s.devs.includes("unsicher")) n++;
	if (s.heiz.includes("unbekannt")) n++;
	if (s.ww === "unbekannt") n++;
	if (s.leist === "d") n++;
	if (s.kauf === "offen") n++;
	const m = s.mont as Record<string, string>;
	for (const k of ["abs", "eat", "err", "san", "wer"])
		if (["unbekannt", "offen", "pruefen"].includes(m[k])) n++;
	for (const d of GROUP_DEVS) {
		if (!s.devs.includes(d)) continue;
		for (const g of s.groups[d])
			for (const v of Object.values(g)) if (v === "unbekannt") n++;
	}
	return n;
}

export type Problem = { message: string; group?: string };

const MAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const PLZ = /^\d{5}$/;

/**
 * A step's check before "Weiter" (`check`): the message, and the group to
 * scroll to. `files(id)` counts a drop zone's files.
 */
export function validate(
	id: StepId,
	s: State,
	files: (id: string) => number,
): Problem | null {
	const fail = (message: string, group?: string): Problem => ({
		message,
		group,
	});
	switch (id) {
		case "abr":
			if (!s.abr) return fail("Bitte wählen Sie eine Antwort.");
			if (s.abr === "ja" && !files("abr"))
				return fail(
					"Bitte laden Sie Ihre Abrechnung hoch oder wählen Sie eine andere Antwort.",
				);
			return null;
		case "liste":
			if (!s.liste) return fail("Bitte wählen Sie eine Antwort.");
			if (s.liste !== "nein" && !files("liste"))
				return fail(
					"Bitte laden Sie die Unterlagen hoch oder wählen Sie „Nein, habe ich nicht“.",
				);
			return null;
		case "bestand":
			return s.bestand ? null : fail("Bitte wählen Sie eine Antwort.");
		case "geraete":
			return s.devs.length
				? null
				: fail("Bitte wählen Sie mindestens einen Gerätetyp.");
		case "heiz":
			if (!s.leist)
				return fail("Bitte wählen Sie den gewünschten Leistungsumfang.");
			if (!s.kauf)
				return fail(
					"Bitte wählen Sie, ob Sie die Geräte mieten oder kaufen möchten.",
				);
			return null;
		case "einheiten":
			return num(s.units) < 1
				? fail("Bitte geben Sie die Anzahl der Einheiten an.")
				: null;
		case "kontakt": {
			const k = s.k;
			if (!k.vn.trim() || !k.nn.trim())
				return fail("Bitte geben Sie Vor- und Nachnamen an.");
			if (!MAIL.test(k.mail.trim()))
				return fail("Bitte geben Sie eine gültige E-Mail-Adresse an.");
			if (!k.ok) return fail("Bitte bestätigen Sie den Hinweis.");
			return null;
		}
		case "adr": {
			const a = s.adr;
			const ok = (x: { str: string; plz: string; ort: string }) =>
				x.str.trim() && PLZ.test(x.plz.trim()) && x.ort.trim();
			if (!ok(a.l))
				return fail(
					"Bitte geben Sie die Liegenschaftsadresse vollständig an (Straße, fünfstellige PLZ und Ort).",
				);
			if (!a.same && (!ok(a.r) || !(a.r.firma.trim() || a.r.name.trim())))
				return fail(
					"Bitte geben Sie die Rechnungsadresse vollständig an (Name oder Firma, Straße, PLZ und Ort).",
				);
			return null;
		}
	}
	const d = devOf(id);
	if (!d || d === "rwm") return null;
	const groups = s.groups[d];
	if (groups.some((g) => num(g.n) < 1))
		return fail("Bitte geben Sie für jede Gruppe eine Stückzahl an.");
	const pre = (i: number) => (groups.length > 1 ? `Gruppe ${i + 1}: ` : "");
	for (const [i, g] of groups.entries()) {
		if (d === "hkv" && !g.art)
			return fail(`${pre(i)}Bitte wählen Sie die Heizkörperbauart.`, g.id);
		const miss: string[] = [];
		if (d === "kwz" || d === "wwz") {
			if (g.einbau === "ap") {
				if (!sizeValue(g, "bl")) miss.push("Einbaulänge");
				if (!sizeValue(g, "q3")) miss.push("Dauerdurchfluss Q3/Qn");
				if (!sizeValue(g, "gew")) miss.push("Anschlussgewinde");
			}
			if (!g.absv) miss.push("Absperrventil vorhanden?");
		}
		if (d === "wmz") {
			if (!g.wtyp)
				return fail(
					`${pre(i)}Bitte wählen Sie, ob es ein Aufputz- oder ein Unterputz-/Kapsel-Wärmezähler ist.`,
				);
			if (g.wtyp === "ap") {
				if (!sizeValue(g, "bl")) miss.push("Einbaulänge");
				if (!sizeValue(g, "qp")) miss.push("Nenndurchfluss qp");
				if (!sizeValue(g, "dn") && !sizeValue(g, "gew"))
					miss.push("Nennweite DN oder Anschlussgewinde");
				if (!g.fg) miss.push("Temperaturfühlergröße");
			} else {
				if (!sizeValue(g, "qp")) miss.push("Nenndurchfluss qp");
				if (!g.fg) miss.push("Temperaturfühlergröße");
			}
			if (!g.absv) miss.push("Absperrventil vorhanden?");
		}
		if (miss.length)
			return fail(`${pre(i)}Bitte ergänzen Sie: ${miss.join(", ")}.`, g.id);
	}
	return null;
}

/** "Bisher erfasst": the summary beside the steps (`live`). */
export function liveRows(s: State, listFiles: number): [string, string][] {
	const c = calc(s);
	const list = steps(s);
	const cur = s.cur;
	const units = list.indexOf("einheiten");
	let lastDev = units;
	list.forEach((x, i) => {
		if (x.startsWith("dev:")) lastDev = i;
	});
	const rows: [string, string][] = [];
	if (tech(s))
		for (const d of ORDER) {
			if (!s.devs.includes(d)) continue;
			const di = list.indexOf(`dev:${d}`);
			const seen = di > -1 && cur >= di;
			const n = !seen
				? 0
				: d === "rwm"
					? smokeAlarms(s)
					: s.groups[d].reduce((a, g) => a + num(g.n), 0);
			rows.push([DEVICES[d].name, n ? String(n) : "–"]);
		}
	else rows.push(["Unterlagen", `${listFiles} Datei(en)`]);
	if (c.units && cur >= units)
		rows.push(["Einheiten", String(c.units)], ["Funk-Gateways", String(c.gw)]);
	if (c.yearly && cur > lastDev) rows.push(["Laufend pro Jahr", eur(c.yearly)]);
	return rows;
}

const de2 = new Intl.NumberFormat("de-DE", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});
export const n2 = (n: number) => de2.format(n);
export const eur = (n: number) => `${n2(n)} €`;
/** Gross, with 19 % VAT. */
export const gross = (x: number) => Math.round(x * 119) / 100;

export type Position = {
	t: string;
	me: string;
	n: number;
	ep: number;
	/** Rental term. */
	lz?: string;
	/** Bought: the price is on request. */
	kauf?: boolean;
};

/** The offer's positions in the Heidi offer's layout (`positions`). */
export function positions(c: Calc) {
	const svc: Position[] = [];
	const rental: Position[] = [];
	const once: Position[] = [];
	const onRequest = c.rows.filter((r) => r.req);
	if (c.withAbr && c.units)
		svc.push({
			t: "Einzelabrechnung",
			me: "je Nutzer",
			n: c.units,
			ep: PRICES.abr,
		});
	if (c.dev)
		svc.push({
			t: "Wartungs- und Funktionsdienst für Funkgeräte",
			me: "je Gerät",
			n: c.dev,
			ep: PRICES.wart,
		});
	const agg = new Map<string, { take: boolean; n: number; ep: number }>();
	for (const r of c.rows) {
		if (r.req) continue;
		const k = r.d + (r.take ? ":take" : "");
		const a = agg.get(k) ?? { take: Boolean(r.take), n: 0, ep: r.p };
		a.n += r.n;
		agg.set(k, a);
	}
	for (const d of ["wmz", "kwz", "wwz", "hkv", "rwm"])
		for (const k of [d, `${d}:take`]) {
			const a = agg.get(k);
			if (!a) continue;
			rental.push({
				t: (a.take ? "Übernahme vorhandener " : "") + OFFER_DEVICE[d],
				lz: a.take ? "" : TERMS_BY_DEVICE[d],
				me: "je Gerät",
				n: a.n,
				ep: a.ep,
			});
		}
	if (c.gw)
		rental.push({
			t: "Funk-Gateway",
			lz: TERMS_BY_DEVICE.gw,
			me: "je Gerät",
			n: c.gw,
			ep: PRICES.gw,
		});
	if (c.buy)
		for (const r of rental) {
			r.kauf = true;
			r.ep = 0;
			r.lz = "";
		}
	if (c.dev)
		once.push({
			t: "Inbetriebnahme Funksystem / OMS",
			me: "je Gerät",
			n: c.dev,
			ep: PRICES.ibn,
		});
	if (c.inst)
		once.push({
			t: "Installationspauschale",
			me: "einmalig",
			n: 1,
			ep: c.inst,
		});
	const sum = (a: Position[]) => a.reduce((s, x) => s + x.n * x.ep, 0);
	const sS = sum(svc);
	const sM = sum(rental);
	const sO = sum(once);
	return {
		buy: c.buy,
		extras: c.extras,
		svc,
		rental,
		once,
		onRequest,
		sS,
		sM,
		sO,
		year: sS + sM,
		first: sS + sM + sO,
	};
}
export type Positions = ReturnType<typeof positions>;

/** A position's unit price and total ("auf Anfrage" when bought). */
export const unitPrice = (r: Position) => (r.kauf ? "auf Anfrage" : n2(r.ep));
export const totalPrice = (r: Position) =>
	r.kauf ? "auf Anfrage" : n2(r.n * r.ep);
export const amount = (x: number | string) =>
	typeof x === "number" ? n2(x) : x;

/** A new offer: a six-digit id and its number (`angMeta`). */
export function makeOffer(now: number, random: number): Offer {
	const id = String(100000 + Math.floor(random * 900000));
	return { id, nr: `${berlinDay(now).y}-AN${id}`, ts: now };
}

function berlinDay(ts: number) {
	const parts = new Intl.DateTimeFormat("en-CA", {
		timeZone: "Europe/Berlin",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).formatToParts(new Date(ts));
	const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
	return { y: get("year"), m: get("month"), d: get("day") };
}

const dmy = (y: number, m: number, d: number) => {
	const t = new Date(Date.UTC(y, m - 1, d));
	const p = (n: number) => String(n).padStart(2, "0");
	return `${p(t.getUTCDate())}.${p(t.getUTCMonth() + 1)}.${t.getUTCFullYear()}`;
};

/** The offer's date and last valid day (60 days including the first), in Berlin. */
export function offerDates(o: Offer) {
	const { y, m, d } = berlinDay(o.ts);
	return { date: dmy(y, m, d), valid: dmy(y, m, d + OFFER_VALID_DAYS - 1) };
}

/** The property's address lines. */
export function propertyLines(s: State): string[] {
	const l = s.adr.l;
	return [l.str, l.zus, `${l.plz} ${l.ort}`.trim()].filter(
		(x) => x && x.trim(),
	);
}

/** The billing address's lines (the property's when the same). */
export function billingLines(s: State): string[] {
	const { adr: a, k } = s;
	const person = `${k.vn} ${k.nn}`.trim();
	if (a.same)
		return [
			k.firma || person,
			k.firma ? `z. Hd. ${person}` : "",
			...propertyLines(s),
		].filter(Boolean);
	const r = a.r;
	return [
		r.firma || r.name,
		r.firma && r.name ? `z. Hd. ${r.name}` : "",
		r.str,
		r.zus,
		`${r.plz} ${r.ort}`.trim(),
	].filter((x) => x && String(x).trim());
}

/** The offer's scope ("Leistungsumfang"). */
export function scope(s: State): string[] {
	const m: Record<string, string> = {
		kwz: "Kaltwasser",
		wwz: "Warmwasser",
		wmz: "Heizung",
		hkv: "Heizung",
		rwm: "Rauchwarnmelder",
	};
	const o: string[] = [];
	for (const d of ["hkv", "wmz", "kwz", "wwz", "rwm"])
		if (s.devs.includes(d) && !o.includes(m[d])) o.push(m[d]);
	if (!tech(s) && s.heiz.length && !o.includes("Heizung")) o.unshift("Heizung");
	return o;
}

/** The offer's file name, as the preview's bar shows it. */
export function offerFileName(s: State, o: Offer) {
	const st = (s.adr.l.str || "").replace(/[\\/:*?"<>|]+/g, "").trim();
	return `Heidi Systems - Angebot ${o.id}${st ? `, ${st}` : ""}.pdf`;
}

const slackEscape = (v: unknown) =>
	String(v ?? "").replace(
		/[&<>]/g,
		(c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] as string,
	);

/**
 * The notification about an offer (the design's Slack text): `head` names the
 * event, `files` counts the photos and documents left in the browser.
 */
export function offerSummary(
	s: State,
	o: Offer,
	head: string,
	files: number,
): string {
	const c = calc(s);
	const P = positions(c);
	const k = s.k;
	const L: string[] = [];
	L.push(`${head} · ${o.nr}`);
	L.push(
		`*${slackEscape(`${k.vn} ${k.nn}`.trim())}*${k.firma ? ` · ${slackEscape(k.firma)}` : ""}`,
	);
	L.push(slackEscape(k.mail) + (k.tel ? ` · ${slackEscape(k.tel)}` : ""));
	L.push(
		`Liegenschaft: ${slackEscape(propertyLines(s).join(", "))}${c.units ? ` · ${c.units} Einheiten` : ""}`,
	);
	if (!s.adr.same)
		L.push(`Rechnung an: ${slackEscape(billingLines(s).join(", "))}`);
	const devices = [
		...P.rental.map((r) => `${r.n} × ${r.t.replace("Funk ", "")}`),
		...P.onRequest.map((r) => `${r.n} × ${r.sub}`),
	];
	if (devices.length) L.push(`Geräte: ${slackEscape(devices.join(", "))}`);
	else if (!tech(s))
		L.push("Geräte: aus Geräteliste/Rechnung, Dokumentenprüfung nötig");
	L.push(
		`Leistung: ${slackEscape(SERVICES[s.leist] || "offen")} · ${({ miete: "Mieten", kauf: "Kaufen", offen: "Kauf/Miete offen" } as Record<string, string>)[s.kauf] || ""} · Montage: ${({ eigen: "selbst", heidi: "durch Heidi", offen: "offen" } as Record<string, string>)[s.mont.wer] || "offen"}`,
	);
	L.push(
		`Einmalig: ${n2(P.sO)} € · Pro Jahr: ${n2(P.year)} € (netto)${P.buy ? " · Gerätekauf auf Anfrage" : ""}`,
	);
	if (P.extras.length)
		L.push(`Zusätzlich angefragt: ${slackEscape(P.extras.join(", "))}`);
	if (files)
		L.push(`Fotos/Dateien: ${files} (nicht übertragen, beim Kunden anfordern)`);
	if (c.checks.length)
		L.push(`Prüfpunkte:\n• ${slackEscape(c.checks.slice(0, 8).join("\n• "))}`);
	return L.join("\n");
}
