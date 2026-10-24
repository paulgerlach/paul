/**
 * The checker's logic (the design's `#mc-js` and `#pw-js`), pure: the
 * amounts, the rules and their texts, the result's head, the paywall's
 * teaser and document, the letter, the guided flow's summary and the
 * example. Dates are calendar days (`Day`, UTC midnights) from the
 * Fristenrechner's helpers; "today" is the Berlin day of the page's clock,
 * passed in by the caller. Legal texts await sign-off (plan §4.4).
 */
import {
	addDays,
	addMonths,
	day,
	formatDate,
	parseIso,
	toIso,
	type Day,
} from "$lib/landing/pages/fristenrechner/fristen";

export type Answer = "ja" | "nein" | "?";
/** The values pane's "Anteil nach Verbrauch": "" is "Weiß nicht", "40" "unter 50 %", "0" "nur nach Fläche". */
export type Share = "" | "70" | "60" | "50" | "40" | "0";
/** 1: a back payment ("Nachzahlung"), −1: a credit ("Guthaben"). */
export type Sign = 1 | -1;

/** A finding read from the bill (the design's `befunde`; here only the example's). */
export type Finding = {
	title: string;
	status: "fehler" | "hinweis" | "ok";
	text: string;
};

/** The values pane's fields as typed (ISO dates, German amounts). */
export type Values = {
	heating: string;
	result: string;
	sign: Sign;
	from: string;
	to: string;
	received: string;
	share: Share;
	co2: Answer;
	remote: Answer;
	uvi: Answer;
	found: Finding[];
};

export const emptyValues = (): Values => ({
	heating: "",
	result: "",
	sign: 1,
	from: "",
	to: "",
	received: "",
	share: "",
	co2: "?",
	remote: "?",
	uvi: "?",
	found: [],
});

export type Status = "fail" | "warn" | "info" | "ok";

export type PointKey =
	| "late"
	| "lateCredit"
	| "inTime"
	| "noDelivery"
	| "period"
	| "shareUnknown"
	| "share"
	| "shareOk"
	| "co2"
	| "co2Check"
	| "co2Ok"
	| "uvi"
	| "remote"
	| "uviCheck"
	| "uviOk"
	| "found"
	| "objection";

export type Point = {
	key: PointKey;
	status: Status;
	title: string;
	text: string;
	law: string;
	/** The amount this point is worth, in euros. */
	amount?: number;
	/** The cut's share, shown without heating costs. */
	cut?: "15 %" | "3 %";
	/** The letter's sentence for a failed point. */
	letter?: string;
};

export type Result = {
	points: Point[];
	sum: number;
	/** The share the tenant may cut (0.15, 0.03 …). */
	share: number;
	/** The cuts in euros. */
	cut: number;
	/** The back payment that drops when the bill came late. */
	lateSum: number;
	hasHeating: boolean;
	from: Day | null;
	to: Day | null;
	received: Day | null;
	expired: boolean;
};

// Number formatting -------------------------------------------------------

const formats = new Map<number, Intl.NumberFormat>();

/** `n` in German notation with `digits` decimals. */
export function formatNumber(n: number, digits = 0): string {
	let format = formats.get(digits);
	if (!format) {
		format = new Intl.NumberFormat("de-DE", {
			minimumFractionDigits: digits,
			maximumFractionDigits: digits,
		});
		formats.set(digits, format);
	}
	return format.format(n);
}

/** "310 €", "37,20 €": no decimals for whole euros. */
export const formatEuro = (n: number): string =>
	`${formatNumber(n, Math.round(n) === n ? 0 : 2)} €`;

/**
 * A typed amount (the design's `num()`): "1.240,00", "1.240", "310 €",
 * "12,5" or "12.5"; NaN when empty.
 */
export function parseAmount(text: string): number {
	let v = text.trim().replace(/[€\s]/g, "");
	if (!v) return NaN;
	if (v.includes(",")) v = v.replace(/\./g, "").replace(",", ".");
	else if (/^\d{1,3}(\.\d{3})+$/.test(v)) v = v.replace(/\./g, "");
	return Number.parseFloat(v);
}

// The rules ---------------------------------------------------------------

const BGB_556 = "§ 556 Abs. 3 BGB";
const CO2_FROM = day(2023, 0, 1);
const CO2_TO = day(2023, 11, 31);
const REMOTE_DUE = day(2027, 0, 1);
const ORDER: Record<Status, number> = { fail: 0, warn: 1, info: 2, ok: 3 };

/** The rules for the values on `today` (the design's `rules()` and its sort). */
export function evaluate(values: Values, today: Day): Result {
	const heating = parseAmount(values.heating);
	const amount = parseAmount(values.result);
	let from = parseIso(values.from);
	let to = parseIso(values.to);
	const received = parseIso(values.received);
	const share = values.share === "" ? null : Number(values.share);
	const hasHeating = Number.isFinite(heating) && heating > 0;
	const points: Point[] = [];
	let cutShare = 0;
	let lateSum = 0;

	if (to === null && from !== null) to = addMonths(from, 12);
	if (from === null && to !== null) from = addMonths(to, -12);
	const part = (p: number) =>
		hasHeating ? Math.round(heating * p * 100) / 100 : undefined;

	// The landlord's deadline
	if (to !== null && received !== null) {
		const deadline = addMonths(to, 12);
		if (received > deadline) {
			if (values.sign === 1 && Number.isFinite(amount) && amount > 0) {
				lateSum = amount;
				points.push({
					key: "late",
					status: "fail",
					title: "Abrechnung zu spät zugestellt",
					text: `Sie kam nach dem ${formatDate(deadline)}. Die Nachzahlung müssen Sie in der Regel nicht leisten, sofern der Vermieter die Verspätung zu vertreten hat.`,
					law: BGB_556,
					amount,
					letter:
						"Die Abrechnung ist mir erst nach Ablauf der Zwölfmonatsfrist zugegangen. Eine Nachforderung ist damit ausgeschlossen.",
				});
			} else
				points.push({
					key: "lateCredit",
					status: "info",
					title: "Abrechnung zu spät zugestellt",
					text: "Ein Guthaben steht Ihnen trotzdem zu. Nachforderungen darf der Vermieter nicht mehr stellen.",
					law: BGB_556,
				});
		} else
			points.push({
				key: "inTime",
				status: "ok",
				title: "Rechtzeitig zugestellt",
				text: `Frist bis ${formatDate(deadline)} eingehalten.`,
				law: BGB_556,
			});
	} else
		points.push({
			key: "noDelivery",
			status: "warn",
			title: "Zustellfrist nicht prüfbar",
			text: "Geben Sie Abrechnungszeitraum und Erhaltsdatum an.",
			law: BGB_556,
		});

	// The period
	if (from !== null && to !== null && (to - from) / 86_400_000 > 366)
		points.push({
			key: "period",
			status: "fail",
			title: "Abrechnungszeitraum länger als 12 Monate",
			text: "Abgerechnet werden muss jährlich. Ein längerer Zeitraum macht die Abrechnung angreifbar.",
			law: BGB_556,
			letter:
				"Der Abrechnungszeitraum umfasst mehr als zwölf Monate. Es ist jedoch jährlich abzurechnen.",
		});

	// The share by consumption
	if (share === null)
		points.push({
			key: "shareUnknown",
			status: "warn",
			title: "Verteilung nach Verbrauch unklar",
			text: "Mindestens 50 % der Heizkosten müssen nach Verbrauch verteilt werden. Schauen Sie nach dem Verteilerschlüssel, z. B. 70/30.",
			law: "§ 7 HeizkostenV",
		});
	else if (share < 50) {
		cutShare += 0.15;
		points.push({
			key: "share",
			status: "fail",
			title:
				share === 0
					? "Nur nach Fläche abgerechnet"
					: "Weniger als 50 % nach Verbrauch",
			text: "Werden Heizkosten nicht nach der Heizkostenverordnung verteilt, dürfen Sie Ihren Anteil um 15 % kürzen.",
			law: "§ 12 Abs. 1 HeizkostenV",
			amount: part(0.15),
			cut: "15 %",
			letter:
				"Die Heizkosten wurden nicht zu mindestens 50 % nach Verbrauch verteilt. Ich kürze meinen Anteil daher um 15 %.",
		});
	} else
		points.push({
			key: "shareOk",
			status: "ok",
			title: `${share} % nach Verbrauch verteilt`,
			text: "Zulässig sind 50 bis 70 %.",
			law: "§ 7 HeizkostenV",
		});

	// The CO₂ costs
	const co2Due =
		from !== null ? from >= CO2_FROM : to !== null ? to >= CO2_TO : false;
	if (co2Due) {
		if (values.co2 === "nein") {
			cutShare += 0.03;
			points.push({
				key: "co2",
				status: "fail",
				title: "CO₂-Kosten nicht aufgeteilt",
				text: "Fehlt die Aufteilung der CO₂-Kosten, dürfen Sie Ihren Heizkostenanteil um 3 % kürzen. Gilt bei Heizöl, Erdgas und Fernwärme.",
				law: "§ 7 Abs. 4 CO2KostAufG",
				amount: part(0.03),
				cut: "3 %",
				letter:
					"Die Abrechnung weist keine Aufteilung der CO₂-Kosten zwischen Vermieter und Mieter aus. Ich kürze meinen Heizkostenanteil daher um 3 %.",
			});
		} else if (values.co2 === "?")
			points.push({
				key: "co2Check",
				status: "warn",
				title: "CO₂-Aufteilung prüfen",
				text: "Seit 2023 muss die Abrechnung ausweisen, wie die CO₂-Kosten zwischen Vermieter und Mieter aufgeteilt werden.",
				law: "CO2KostAufG",
			});
		else
			points.push({
				key: "co2Ok",
				status: "ok",
				title: "CO₂-Kosten aufgeteilt",
				text: "Die Aufteilung ist ausgewiesen.",
				law: "CO2KostAufG",
			});
	}

	// Remote reading and the monthly consumption information
	const after2027 = to !== null && to >= REMOTE_DUE;
	if (values.remote === "ja" && values.uvi === "nein") {
		cutShare += 0.03;
		points.push({
			key: "uvi",
			status: "fail",
			title: "Keine monatliche Verbrauchsinformation",
			text: "Bei fernablesbaren Zählern muss der Vermieter Sie jeden Monat über Ihren Verbrauch informieren. Fehlt das, dürfen Sie um 3 % kürzen.",
			law: "§§ 6a, 12 Abs. 1 HeizkostenV",
			amount: part(0.03),
			cut: "3 %",
			letter:
				"Trotz fernablesbarer Zähler habe ich keine monatliche Verbrauchsinformation erhalten. Ich kürze meinen Anteil daher um 3 %.",
		});
	} else if (after2027 && values.remote === "nein") {
		cutShare += 0.03;
		points.push({
			key: "remote",
			status: "fail",
			title: "Keine fernablesbaren Zähler",
			text: "Ab 2027 müssen Zähler aus der Ferne ablesbar sein. Fehlen sie, dürfen Sie um 3 % kürzen.",
			law: "§§ 5, 12 Abs. 1 HeizkostenV",
			amount: part(0.03),
			cut: "3 %",
			letter:
				"Die Zähler sind nicht fernablesbar. Ich kürze meinen Anteil daher um 3 %.",
		});
	} else if (values.remote === "?" || values.uvi === "?")
		points.push({
			key: "uviCheck",
			status: "warn",
			title: "Verbrauchsinformation prüfen",
			text: "Werden Ihre Zähler per Funk abgelesen, steht Ihnen jeden Monat eine Verbrauchsinformation zu.",
			law: "§ 6a HeizkostenV",
		});
	else
		points.push({
			key: "uviOk",
			status: "ok",
			title: "Verbrauchsinformation in Ordnung",
			text: "Nach Ihren Angaben sind die Pflichten erfüllt.",
			law: "§ 6a HeizkostenV",
		});

	// What was found in the bill
	for (const finding of values.found) {
		if (!finding.title) continue;
		points.push({
			key: "found",
			status:
				finding.status === "fehler"
					? "fail"
					: finding.status === "ok"
						? "ok"
						: "warn",
			title: finding.title.slice(0, 80),
			text: finding.text.slice(0, 200),
			law: "In Ihrer Abrechnung erkannt",
		});
	}

	// The tenant's deadline
	const objectionEnd = received !== null ? addMonths(received, 12) : null;
	const expired = objectionEnd !== null && today > objectionEnd;
	if (objectionEnd !== null)
		points.push({
			key: "objection",
			status: expired ? "warn" : "info",
			title: expired
				? "Einwendungsfrist abgelaufen"
				: `Einwendungen möglich bis ${formatDate(objectionEnd)}`,
			text: expired
				? "Einwendungen sind in der Regel nur 12 Monate nach Erhalt möglich."
				: "Bis dahin müssen Ihre Einwendungen beim Vermieter sein.",
			law: BGB_556,
		});

	const cut = hasHeating
		? Math.min(heating, Math.round(heating * Math.min(cutShare, 1) * 100) / 100)
		: 0;
	const sum = lateSum > 0 ? Math.max(lateSum, cut) : cut;
	// Stable: equal statuses keep their order.
	points.sort((a, b) => ORDER[a.status] - ORDER[b.status]);
	return {
		points,
		sum,
		share: cutShare,
		cut,
		lateSum,
		hasHeating,
		from,
		to,
		received,
		expired,
	};
}

/** A point's figure on the right: its amount, or its share without heating costs. */
export function pointFigure(point: Point, hasHeating: boolean): string {
	if (point.amount) return formatEuro(point.amount);
	if (point.cut && !hasHeating) return point.cut;
	return "";
}

export const MARKS: Record<Status, string> = {
	fail: "!",
	warn: "?",
	info: "i",
	ok: "✓",
};

const count = (points: Point[], status: Status) =>
	points.filter((p) => p.status === status).length;

/** The dark head of the result (the design's `compute()`). */
export function resultHead(result: Result) {
	const fails = count(result.points, "fail");
	const warns = count(result.points, "warn");
	const shareOnly = result.share > 0 && !result.hasHeating;
	let label: string;
	let sub: string;
	if (result.sum > 0) {
		label = "Mögliche Ersparnis";
		sub = `${result.lateSum > 0 && result.cut > 0 ? "Die Beträge überschneiden sich, deshalb zählt der höhere. " : ""}${fails}${fails === 1 ? " Punkt spricht" : " Punkte sprechen"} für Sie. Erstellen Sie jetzt Ihr Musterschreiben.`;
	} else if (shareOnly) {
		label = "Kürzung möglich";
		sub = `Sie dürfen um ${Math.round(result.share * 100)} % kürzen. Tragen Sie Ihre Heizkosten ein, um den Betrag zu sehen.`;
	} else if (fails || warns) {
		label = "Kein sicherer Anspruch gefunden";
		sub = `${fails ? `${fails} Fehler und ` : ""}${warns} offene Punkte. Klären Sie diese mit Ihrem Vermieter.`;
	} else {
		label = "Kein Anspruch gefunden";
		sub = "In den geprüften Punkten sieht Ihre Abrechnung korrekt aus.";
	}
	if (result.expired)
		sub += " Achtung: Die Einwendungsfrist ist wahrscheinlich abgelaufen.";
	return {
		label,
		sub,
		/** The figure the head counts to (whole euros or the share in %). */
		value: shareOnly ? Math.round(result.share * 100) : result.sum,
		unit: shareOnly ? "%" : "€",
		/** "bis zu" before the figure. */
		upTo: result.sum > 0,
		zero: result.sum <= 0,
		/** "Musterschreiben erstellen" only with a failed point. */
		letter: fails > 0,
	};
}

/** The paywall teaser's count. */
export function teaser(points: Point[]): string {
	const fails = count(points, "fail");
	return fails
		? `${fails} Fehler und ${points.length - fails} weitere Punkte`
		: `${points.length} geprüfte Punkte`;
}

/** "2024-01-01" → "01.01.2024", "" → "–" (the design's `fdt()`). */
const shownDate = (iso: string) => {
	const t = parseIso(iso);
	return t === null ? "–" : formatDate(t);
};

/**
 * The paywall's document: the checked values, a row red when its rule
 * failed (by the rules' keys; the design looks for words in the titles).
 */
export function paywallRows(values: Values, points: Point[]) {
	const failed = new Set(
		points.filter((p) => p.status === "fail").map((p) => p.key),
	);
	return [
		{
			label: "Abrechnungszeitraum",
			value: `${shownDate(values.from)} – ${shownDate(values.to)}`,
			bad: failed.has("period"),
		},
		{
			label: "Erhalten am",
			value: shownDate(values.received),
			bad: failed.has("late"),
		},
		{
			label: "Ihre Heizkosten",
			value: values.heating ? `${values.heating} €` : "–",
			bad: false,
		},
		{
			label: "Verteilung nach Verbrauch",
			value: values.share !== "" ? `${values.share} %` : "unklar",
			bad: failed.has("share"),
		},
		{
			label: "CO₂-Kostenaufteilung",
			value: failed.has("co2") ? "nicht ausgewiesen" : "geprüft",
			bad: failed.has("co2"),
		},
		{
			label: "Monatliche Verbrauchsinfo",
			value: failed.has("uvi") ? "fehlt" : "geprüft",
			bad: failed.has("uvi"),
		},
		{
			label: "Nachzahlung",
			value: values.result ? `${values.result} €` : "–",
			bad: failed.has("late"),
		},
	];
}

/** The objection letter from the failed points (the design's text). */
export function letterText(result: Result): string {
	const fails = result.points.filter((p) => p.status === "fail");
	const period =
		result.from !== null && result.to !== null
			? ` für den Zeitraum ${formatDate(result.from)} bis ${formatDate(result.to)}`
			: "";
	const points = fails
		.map((p, i) => {
			let line = `${i + 1}. ${p.title}: ${p.letter ?? `In der Abrechnung ist mir Folgendes aufgefallen: ${p.text} Bitte erläutern bzw. korrigieren Sie diesen Punkt.`} (${p.law})`;
			if (p.amount) line += ` Betrag: ${formatEuro(p.amount)}.`;
			return line;
		})
		.join("\n\n");
	const received =
		result.received !== null
			? `, die mir am ${formatDate(result.received)} zugegangen ist,`
			: "";
	const claim =
		result.sum > 0
			? `Ich mache daher einen Betrag von ${formatEuro(result.sum)} geltend. Bitte korrigieren Sie die Abrechnung entsprechend und erstatten Sie mir zu viel gezahlte Beträge auf mein Konto [IBAN].\n\n`
			: "Bitte korrigieren Sie die Abrechnung entsprechend.\n\n";
	return `[Ihr Name]\n[Straße, Hausnummer]\n[PLZ Ort]\n\n[Name des Vermieters / der Verwaltung]\n[Anschrift]\n\n[Ort], [Datum]\n\nEinwendungen gegen die Heizkostenabrechnung${period}\nWohnung: [Adresse, Lage]\n\nSehr geehrte Damen und Herren,\n\nhiermit erhebe ich gegen die oben genannte Heizkostenabrechnung${received} folgende Einwendungen:\n\n${points}\n\n${claim}Bis zur Klärung behalte ich mir vor, eine Nachzahlung nicht zu leisten. Zudem bitte ich um Einsicht in die der Abrechnung zugrunde liegenden Belege.\n\nMit freundlichen Grüßen\n\n[Unterschrift]`;
}

/** "02.01.2026" for the flow's summary, or `null` without a date. */
export const flowDate = (iso: string): string | null => {
	const t = parseIso(iso);
	return t === null ? null : formatDate(t);
};

const EXAMPLE_RECEIVED = day(2026, 0, 20);

/**
 * The design's example ("Beispiel ansehen"): received on the earlier of
 * 20.01.2026 and 40 days before today.
 */
export function exampleValues(today: Day): Values {
	return {
		heating: "1.240,00",
		result: "310,00",
		sign: 1,
		from: "2024-01-01",
		to: "2024-12-31",
		received: toIso(Math.min(addDays(today, -40), EXAMPLE_RECEIVED)),
		share: "70",
		co2: "nein",
		remote: "ja",
		uvi: "nein",
		found: [
			{
				title: "Verbrauch geschätzt",
				status: "hinweis",
				text: "Ein Heizkörper ist mit „Schätzung“ markiert. Fragen Sie nach dem Grund, Schätzungen sind nur in Ausnahmefällen zulässig.",
			},
		],
	};
}
