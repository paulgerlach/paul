/**
 * The Zählercheck as sales read it on the result page
 * (/self-service-result/<token>): every step that was shown, its questions
 * as asked and the answers as labels, the notes, and where the files were
 * added (`files`: the drop zone's id). Pure; the server builds it from the
 * validated state and stores it with the result, so a result keeps the
 * questions of its day when the wizard changes. The question texts are the
 * steps' (`steps/`), the options' labels come from `data.ts`; the conditions
 * follow the steps' markup.
 */
import {
	catalogOf,
	catLabel,
	FIELD_LABELS,
	FIELDS,
	type CatKey,
} from "./catalog";
import {
	BILL_OPTIONS,
	BUY_OPTIONS,
	DEVICES,
	deviceStep,
	EXTRAS,
	COUNT_LABELS,
	fitterOptions,
	FITTING_OPTIONS,
	MONT_UPLOAD,
	ORDER,
	HEAT_METER_OPTIONS,
	HEATING,
	HOT_WATER,
	INSTALLED_OPTIONS,
	LIST_OPTIONS,
	MEASURED_OPTIONS,
	optionLabel,
	OTHER_METER_OPTIONS,
	PLUMBING_OPTIONS,
	PREF_OPTIONS,
	RADIATOR_OPTIONS,
	RADIO_OPTIONS,
	RADIO_STANDARD_OPTIONS,
	REACH_OPTIONS,
	SENSOR_MOUNT_OPTIONS,
	SERVICES,
	SHUTOFF_CIRCUIT_OPTIONS,
	SHUTOFF_OPTIONS,
	SMOKE_KIND_OPTIONS,
	SMOKE_MOUNT_OPTIONS,
	STEPS,
	STOCK_OPTIONS,
	UNSURE_DEVICES,
	WATER_MOUNT_OPTIONS,
	YES_NO_UNKNOWN,
	type DevKey,
	type GroupDev,
	type Option,
} from "./data";
import {
	askYear,
	asBought,
	calc,
	capsuleMeter,
	devOf,
	fitterFee,
	n2,
	needsShutoff,
	noFiles,
	offerDates,
	positions,
	steps,
	swapAll,
	tech,
	yearOptions,
	type Files,
	type Group,
	type State,
} from "./model";

/** One question: its answer (`""` unanswered) and, for a drop zone, its id. */
export type SheetItem = { q: string; a: string; files?: string };
export type SheetSection = { title: string; items: SheetItem[] };
export type Sheet = SheetSection[];

/** The answer to question `q`, "" if it wasn't asked. */
export const sheetAnswer = (sheet: Sheet, q: string) =>
	sheet.flatMap((x) => x.items).find((x) => x.q === q)?.a ?? "";

const yesNo = (v: boolean) => (v ? "Ja" : "Nein");
const many = (options: readonly Option[], vs: string[]) =>
	vs.map((v) => optionLabel(options, v)).join(", ");

/** A size: the free value for "andere", the label otherwise. */
function size(g: Group, k: CatKey): string {
	if (g[k] === "andere") return g[`${k}x`].trim() || "Anderer Wert";
	if (g[k] === "unbekannt") return k === "fg" ? "Weiß ich nicht" : "Unbekannt";
	return g[k] ? catLabel(k, g[k]) : "";
}

function group(s: State, d: GroupDev, g: Group): SheetItem[] {
	const items: SheetItem[] = [];
	const add = (q: string, a: string) => items.push({ q, a: a.trim() });
	if (d === "weitere") {
		add("Welche Zählerart?", optionLabel(OTHER_METER_OPTIONS, g.art));
		add("Wie viele Zähler?", g.n);
		add("Hersteller oder Typ (falls bekannt)", g.mod);
		items.push({ q: "Fotos des Zählers", a: "", files: g.id });
		add("Besonderheiten", g.bem);
		return items;
	}
	add("Wie viele baugleiche Geräte?", g.n);
	add("Aktuell installiert?", optionLabel(INSTALLED_OPTIONS, g.inst));
	if (d === "hkv")
		add("Heizkörperbauart", optionLabel(RADIATOR_OPTIONS, g.art));
	else if (g.inst === "ja" && !swapAll(s)) {
		add("Aktueller Zähler", optionLabel(RADIO_OPTIONS, g.funk));
		add("Hersteller oder Messdienst", g.her);
		add("Typ oder Modell", g.mod);
		add("Eichfrist oder Austauschjahr", g.jahr);
		if (g.funk === "funk") {
			add("Funkstandard", optionLabel(RADIO_STANDARD_OPTIONS, g.std));
			add("Zugangsschlüssel verfügbar?", optionLabel(YES_NO_UNKNOWN, g.key));
		}
	}
	if (d === "kwz" || d === "wwz") {
		add(
			"Wie ist der Wasserzähler eingebaut?",
			optionLabel(WATER_MOUNT_OPTIONS, g.einbau),
		);
		if (g.einbau === "up" && g.inst !== "nein") {
			add(
				"MID-Norm der Messkapsel",
				g.ksys === "andere" ? "Andere / unklar" : g.ksys,
			);
			if (g.ksys === "andere") add("Aufschrift (falls lesbar)", g.ksysx);
		} else if (g.einbau === "ap")
			for (const k of FIELDS[d]) add(FIELD_LABELS[k], size(g, k));
	}
	if (d === "wmz") {
		add(
			"Bauart des Wärmemengenzählers",
			optionLabel(HEAT_METER_OPTIONS, g.wtyp),
		);
		const id = catalogOf(d, g);
		if (id) {
			for (const k of FIELDS[id]) add(FIELD_LABELS[k], size(g, k));
			add("Was wird gemessen?", optionLabel(MEASURED_OPTIONS, g.was));
			add(
				"Temperaturfühler-Aufnahme",
				optionLabel(SENSOR_MOUNT_OPTIONS, g.fuehler),
			);
		}
	}
	items.push(
		g.inst !== "nein"
			? { q: "Fotos des Zählers", a: "", files: `${g.id}z` }
			: { q: "Fotos der Einbausituation", a: "", files: g.id },
	);
	if (d !== "hkv" && !capsuleMeter(d, g))
		add("Absperrventil vorhanden?", optionLabel(SHUTOFF_OPTIONS, g.absv));
	add("Besonderheiten", g.bem);
	return items;
}

function devices(s: State, d: DevKey): SheetSection[] {
	if (d === "rwm") {
		const r = s.rwm;
		return [
			{
				title: deviceStep(d).title,
				items: [
					{ q: "Schlafzimmer", a: r.sz },
					{ q: "Kinderzimmer", a: r.kz },
					{ q: "Flure (Rettungswege)", a: r.fl },
					{ q: "Gesamtzahl Rauchwarnmelder", a: r.n },
					{
						q: "Ersetzen oder neu?",
						a: optionLabel(SMOKE_KIND_OPTIONS, r.art),
					},
					{ q: "Montageart", a: many(SMOKE_MOUNT_OPTIONS, r.mont) },
					{ q: "Besonderheiten", a: r.bem.trim() },
					{
						q: "Beratung zur Rauchwarnmelderpflicht (39 € netto)",
						a: yesNo(s.rber),
					},
				],
			},
		];
	}
	const name = DEVICES[d].name;
	return s.groups[d].map((g, i) => ({
		title: `${name} · Gruppe ${i + 1}`,
		items: group(s, d, g),
	}));
}

function offer(s: State, files: Files): SheetSection[] {
	const o = s.ang;
	if (!o) return [];
	const c = calc(s, files);
	const p = positions(c);
	const k = s.kauf === "beides" ? positions(calc(asBought(s))) : null;
	const list = [
		...p.rental.map((r) => `${r.n} × ${r.t}`),
		...p.onRequest.map((r) => `${r.n} × ${r.sub}`),
	];
	return [
		{
			title: STEPS.ang.title,
			items: [
				{ q: "Angebotsnummer", a: o.nr },
				{ q: "Gültig bis", a: offerDates(o).valid },
				{
					q: "Geräte",
					a: list.length
						? list.join("\n")
						: tech(s)
							? ""
							: "Aus Geräteliste/Rechnung, Dokumentenprüfung nötig",
				},
				{ q: "Einmalig (netto)", a: `${n2(p.sO)} €` },
				{ q: "Pro Jahr (netto)", a: `${n2(p.year)} €` },
				...(p.buy
					? [{ q: "Gerätekauf (einmalig, netto)", a: `${n2(p.sK)} €` }]
					: []),
				...(k
					? [
							{
								q: "Kaufvariante: Gerätekauf (einmalig, netto)",
								a: `${n2(k.sK)} €`,
							},
							{ q: "Kaufvariante: Pro Jahr (netto)", a: `${n2(k.year)} €` },
						]
					: []),
				{ q: "Zusätzlich angefragt", a: p.extras.join(", ") },
				{ q: "Prüfpunkte", a: c.checks.join("\n") },
			],
		},
	];
}

/** The sheet for a state: the steps the visitor saw, in their order. */
export function sheet(s: State, files: Files = noFiles): Sheet {
	const out: SheetSection[] = [];
	for (const id of steps(s)) {
		const d = devOf(id);
		if (d) {
			out.push(...devices(s, d));
			continue;
		}
		switch (id) {
			case "abr":
				out.push({
					title: STEPS.abr.title,
					items: [
						{ q: STEPS.abr.title, a: optionLabel(BILL_OPTIONS, s.abr) },
						...(s.abr === "ja"
							? [
									{ q: "Abrechnung hochladen", a: "", files: "abr" },
									{ q: "Anmerkung", a: s.abrNote.trim() },
								]
							: []),
					],
				});
				break;
			case "liste":
				out.push({
					title: STEPS.liste.title,
					items: [
						{ q: STEPS.liste.title, a: optionLabel(LIST_OPTIONS, s.liste) },
						...(s.liste && s.liste !== "nein"
							? [
									{ q: "Unterlagen hochladen", a: "", files: "liste" },
									{ q: "Anmerkung", a: s.listeNote.trim() },
								]
							: []),
					],
				});
				break;
			case "bestand":
				out.push({
					title: STEPS.bestand.title,
					items: [
						{
							q: STEPS.bestand.title,
							a: optionLabel(STOCK_OPTIONS, s.bestand),
						},
						...(s.bestand && s.bestand !== "nein"
							? [
									{
										q: "Was möchten Sie vorzugsweise?",
										a: optionLabel(PREF_OPTIONS, s.pref),
									},
								]
							: []),
						...(askYear(s)
							? [
									{
										q: "Wann wurden die vorhandenen Zähler eingebaut?",
										a: optionLabel(yearOptions(), s.ejahr),
									},
								]
							: []),
					],
				});
				break;
			case "geraete":
				out.push({
					title: STEPS.geraete.title,
					items: [
						{
							q: STEPS.geraete.title,
							a: s.devs
								.map((v) =>
									v === "unsicher" ? UNSURE_DEVICES : DEVICES[v as DevKey].name,
								)
								.join(", "),
						},
						{
							q: "Beratungstermin mit Zähleridentifikation (39 € netto)",
							a: yesNo(s.ber),
						},
					],
				});
				break;
			case "anz":
				out.push({
					title: STEPS.anz.title,
					items: ORDER.map((d) => ({
						q: COUNT_LABELS[d],
						a: s.anz[d].trim(),
					})),
				});
				break;
			case "heiz":
				out.push({
					title: STEPS.heiz.title,
					items: [
						{
							q: "Welche Heizungsart ist vorhanden?",
							a: many(HEATING, s.heiz),
						},
						{
							q: "Wie erfolgt die Warmwasserbereitung?",
							a: optionLabel(HOT_WATER, s.ww),
						},
						{
							q: "Welche Leistungen wünschen Sie?",
							a: SERVICES[s.leist] ?? "",
						},
						{
							q: "Möchten Sie die Geräte mieten oder kaufen?",
							a: optionLabel(BUY_OPTIONS, s.kauf),
						},
					],
				});
				break;
			case "einheiten":
				out.push({
					title: STEPS.einheiten.title,
					items: [{ q: "Anzahl der Wohn- und Gewerbeeinheiten", a: s.units }],
				});
				break;
			case "mont": {
				const m = s.mont;
				const fitter = {
					q: "Wer soll die Geräte montieren?",
					a: optionLabel(fitterOptions(fitterFee(s)), m.wer),
				};
				const advice =
					m.wer === "offen"
						? [
								{
									q: "Beratungstermin mit Zähleridentifikation dazubuchen (39 € netto)",
									a: yesNo(s.ber),
								},
							]
						: [];
				const notes = { q: "Hinweise zur Liegenschaft", a: m.bem.trim() };
				if (!tech(s)) {
					out.push({
						title: MONT_UPLOAD.title,
						items: [fitter, ...advice, notes],
					});
					break;
				}
				out.push({
					title: STEPS.mont.title,
					items: [
						...(needsShutoff(s)
							? [
									{
										q: "Sind Wasser- und Heizkreise absperrbar?",
										a: optionLabel(SHUTOFF_CIRCUIT_OPTIONS, m.abs),
									},
									{
										q: "Sind passende Einbausätze vorhanden?",
										a: optionLabel(FITTING_OPTIONS, m.eat),
									},
								]
							: []),
						{
							q: "Sind die Zähler erreichbar?",
							a: optionLabel(REACH_OPTIONS, m.err),
						},
						...(m.eat === "nein" || m.err === "schwer"
							? [
									{
										q: "Wer übernimmt Sanitärvorarbeiten?",
										a: optionLabel(PLUMBING_OPTIONS, m.san),
									},
								]
							: []),
						fitter,
						...advice,
						notes,
					],
				});
				break;
			}
			case "zusatz":
				out.push({
					title: STEPS.zusatz.title,
					items: [
						{
							q: "Wofür wünschen Sie ein Angebot?",
							a: s.zusatz
								.map((v) => EXTRAS.find((z) => z.v === v)?.title ?? v)
								.join(", "),
						},
					],
				});
				break;
			case "kontakt": {
				const k = s.k;
				out.push({
					title: STEPS.kontakt.title,
					items: [
						{ q: "Vorname", a: k.vn.trim() },
						{ q: "Nachname", a: k.nn.trim() },
						{ q: "Firma oder Hausverwaltung", a: k.firma.trim() },
						{ q: "E-Mail-Adresse", a: k.mail.trim() },
						{ q: "Telefon", a: k.tel.trim() },
						{ q: "Rückruf gewünscht", a: yesNo(k.rr) },
						{ q: "Einwilligung zur Verarbeitung", a: yesNo(k.ok) },
					],
				});
				break;
			}
			case "adr": {
				const { l, r, same } = s.adr;
				out.push({
					title: "Liegenschaftsadresse",
					items: [
						{ q: "Straße und Hausnummer", a: l.str.trim() },
						{ q: "Adresszusatz", a: l.zus.trim() },
						{ q: "PLZ", a: l.plz.trim() },
						{ q: "Ort", a: l.ort.trim() },
						{ q: "Hinweise zur Lieferung", a: l.hin.trim() },
					],
				});
				out.push({
					title: "Rechnungsadresse",
					items: [
						{
							q: "Die Rechnungsadresse entspricht der Liegenschaftsadresse.",
							a: yesNo(same),
						},
						...(same
							? []
							: [
									{ q: "Firma oder Hausverwaltung", a: r.firma.trim() },
									{ q: "Ansprechpartner", a: r.name.trim() },
									{ q: "Straße und Hausnummer", a: r.str.trim() },
									{ q: "Adresszusatz", a: r.zus.trim() },
									{ q: "PLZ", a: r.plz.trim() },
									{ q: "Ort", a: r.ort.trim() },
									{ q: "USt-IdNr.", a: r.ust.trim() },
								]),
					],
				});
				break;
			}
			case "res":
				// The result itself is summed up by the offer's section.
				out.push({
					title: STEPS.res.title,
					items: [{ q: "Anmerkungen zu Ihrer Anfrage", a: s.kom.trim() }],
				});
				break;
			case "ang":
				out.push(...offer(s, files));
				break;
		}
	}
	return out;
}

/** Every drop zone the sheet shows (files elsewhere were left behind). */
export const sheetSlots = (sh: Sheet) =>
	new Set(sh.flatMap((x) => x.items.flatMap((i) => i.files ?? [])));
