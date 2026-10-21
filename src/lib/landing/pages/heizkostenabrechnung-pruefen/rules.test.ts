import { describe, expect, it } from "vitest";
import { day } from "$lib/landing/pages/fristenrechner/fristen";
import {
	emptyValues,
	evaluate,
	exampleValues,
	formatEuro,
	letterText,
	parseAmount,
	paywallRows,
	pointFigure,
	resultHead,
	teaser,
	type Values,
} from "./rules";

const TODAY = day(2026, 9, 19);
const values = (patch: Partial<Values>): Values => ({
	...emptyValues(),
	...patch,
});
const keys = (v: Values, today = TODAY) =>
	evaluate(v, today).points.map((p) => `${p.status}:${p.key}`);

describe("amounts", () => {
	it("reads German and plain notation", () => {
		expect(parseAmount("1.240,00")).toBe(1240);
		expect(parseAmount("1.240")).toBe(1240);
		expect(parseAmount("310 €")).toBe(310);
		expect(parseAmount("12,5")).toBe(12.5);
		expect(parseAmount("12.5")).toBe(12.5);
		expect(parseAmount("  ")).toBeNaN();
	});

	it("formats euros without decimals for whole amounts", () => {
		expect(formatEuro(310)).toBe("310 €");
		expect(formatEuro(37.2)).toBe("37,20 €");
		expect(formatEuro(1240)).toBe("1.240 €");
	});
});

describe("the example", () => {
	it("is received on 20.01.2026, or 40 days back early in 2026", () => {
		expect(exampleValues(TODAY).received).toBe("2026-01-20");
		expect(exampleValues(day(2026, 1, 1)).received).toBe("2025-12-23");
	});

	it("drops the late back payment and cuts for CO₂ and the uVI", () => {
		const result = evaluate(exampleValues(TODAY), TODAY);
		expect(result.points.map((p) => `${p.status}:${p.key}`)).toEqual([
			"fail:late",
			"fail:co2",
			"fail:uvi",
			"warn:found",
			"info:objection",
			"ok:shareOk",
		]);
		const [late, co2, uvi] = result.points;
		expect(late.text).toContain("nach dem 31.12.2025");
		expect(late.amount).toBe(310);
		expect(co2.amount).toBe(37.2);
		expect(uvi.amount).toBe(37.2);
		expect(result.points[4].title).toBe("Einwendungen möglich bis 20.01.2027");
		expect(result.points[5].title).toBe("70 % nach Verbrauch verteilt");
		expect(result.cut).toBe(74.4);
		expect(result.sum).toBe(310);
		const head = resultHead(result);
		expect(head).toMatchObject({
			label: "Mögliche Ersparnis",
			value: 310,
			unit: "€",
			upTo: true,
			letter: true,
		});
		expect(head.sub).toBe(
			"Die Beträge überschneiden sich, deshalb zählt der höhere. 3 Punkte sprechen für Sie. Erstellen Sie jetzt Ihr Musterschreiben.",
		);
		expect(teaser(result.points)).toBe("3 Fehler und 3 weitere Punkte");
	});

	it("names the failed points, the sum and the dates in the letter", () => {
		const text = letterText(evaluate(exampleValues(TODAY), TODAY));
		expect(text).toContain(
			"Einwendungen gegen die Heizkostenabrechnung für den Zeitraum 01.01.2024 bis 31.12.2024",
		);
		expect(text).toContain("die mir am 20.01.2026 zugegangen ist,");
		expect(text).toContain(
			"1. Abrechnung zu spät zugestellt: Die Abrechnung ist mir erst nach Ablauf der Zwölfmonatsfrist zugegangen. Eine Nachforderung ist damit ausgeschlossen. (§ 556 Abs. 3 BGB) Betrag: 310 €.",
		);
		expect(text).toContain("3. Keine monatliche Verbrauchsinformation:");
		expect(text).not.toContain("4. ");
		expect(text).toContain("Ich mache daher einen Betrag von 310 € geltend.");
		expect(text.endsWith("Mit freundlichen Grüßen\n\n[Unterschrift]")).toBe(
			true,
		);
	});

	it("marks the failed rows of the paywall's document", () => {
		const v = exampleValues(TODAY);
		const rows = paywallRows(v, evaluate(v, TODAY).points);
		expect(rows.map((r) => [r.label, r.value, r.bad])).toEqual([
			["Abrechnungszeitraum", "01.01.2024 – 31.12.2024", false],
			["Erhalten am", "20.01.2026", true],
			["Ihre Heizkosten", "1.240,00 €", false],
			["Verteilung nach Verbrauch", "70 %", false],
			["CO₂-Kostenaufteilung", "nicht ausgewiesen", true],
			["Monatliche Verbrauchsinfo", "fehlt", true],
			["Nachzahlung", "310,00 €", true],
		]);
	});
});

describe("the rules", () => {
	it("checks little without values", () => {
		const result = evaluate(emptyValues(), TODAY);
		expect(result.points.map((p) => p.title)).toEqual([
			"Zustellfrist nicht prüfbar",
			"Verteilung nach Verbrauch unklar",
			"Verbrauchsinformation prüfen",
		]);
		expect(resultHead(result)).toMatchObject({
			label: "Kein sicherer Anspruch gefunden",
			sub: "3 offene Punkte. Klären Sie diese mit Ihrem Vermieter.",
			zero: true,
			upTo: false,
			letter: false,
		});
		expect(teaser(result.points)).toBe("3 geprüfte Punkte");
		expect(paywallRows(emptyValues(), result.points)[0].value).toBe("– – –");
	});

	it("sums the cuts of a bill in time", () => {
		const v = values({
			heating: "1.000",
			to: "2025-12-31",
			received: "2026-03-01",
			share: "40",
			co2: "nein",
			remote: "ja",
			uvi: "ja",
		});
		const result = evaluate(v, TODAY);
		expect(keys(v)).toEqual([
			"fail:share",
			"fail:co2",
			"info:objection",
			"ok:inTime",
			"ok:uviOk",
		]);
		expect(result.points[0].title).toBe("Weniger als 50 % nach Verbrauch");
		expect(result.points[0].amount).toBe(150);
		expect(result.points[3].text).toBe("Frist bis 31.12.2026 eingehalten.");
		expect(result.sum).toBe(180);
		expect(resultHead(result).sub).toBe(
			"2 Punkte sprechen für Sie. Erstellen Sie jetzt Ihr Musterschreiben.",
		);
	});

	it("shows the share in % without heating costs", () => {
		const v = values({ share: "0" });
		const result = evaluate(v, TODAY);
		const point = result.points[0];
		expect(point.title).toBe("Nur nach Fläche abgerechnet");
		expect(pointFigure(point, result.hasHeating)).toBe("15 %");
		expect(resultHead(result)).toMatchObject({
			label: "Kürzung möglich",
			sub: "Sie dürfen um 15 % kürzen. Tragen Sie Ihre Heizkosten ein, um den Betrag zu sehen.",
			value: 15,
			unit: "%",
		});
	});

	it("flags a period over twelve months", () => {
		expect(keys(values({ from: "2024-01-01", to: "2025-03-31" }))).toContain(
			"fail:period",
		);
		expect(
			keys(values({ from: "2024-01-01", to: "2024-12-31" })),
		).not.toContain("fail:period");
	});

	it("credits stay due after a late bill", () => {
		const v = values({
			to: "2024-12-31",
			received: "2026-02-01",
			result: "120",
			sign: -1,
		});
		expect(keys(v)).toContain("info:lateCredit");
	});

	it("cuts for missing remote meters from 2027", () => {
		const v = values({ from: "2027-01-01", to: "2027-12-31", remote: "nein" });
		expect(keys(v, day(2028, 1, 1))).toContain("fail:remote");
		expect(
			keys(values({ to: "2026-12-31", remote: "nein", uvi: "nein" })),
		).toContain("ok:uviOk");
	});

	it("asks for the CO₂ split only from 2023", () => {
		expect(keys(values({ to: "2022-12-31" }))).not.toContain("warn:co2Check");
		// Without a start, the period starts twelve months before its end.
		expect(keys(values({ to: "2023-12-31" }))).not.toContain("warn:co2Check");
		expect(keys(values({ to: "2024-01-31" }))).toContain("warn:co2Check");
		expect(keys(values({ to: "2024-12-31", co2: "ja" }))).toContain("ok:co2Ok");
	});

	it("warns when the objection deadline has passed", () => {
		const v = values({ to: "2023-12-31", received: "2024-06-01" });
		const result = evaluate(v, TODAY);
		expect(result.expired).toBe(true);
		expect(result.points.map((p) => p.title)).toContain(
			"Einwendungsfrist abgelaufen",
		);
		expect(resultHead(result).sub).toMatch(
			/ Achtung: Die Einwendungsfrist ist wahrscheinlich abgelaufen\.$/,
		);
	});

	it("counts twelve months to the month's end", () => {
		const v = values({
			to: "2024-02-29",
			received: "2025-03-01",
			result: "90",
		});
		expect(evaluate(v, TODAY).points[0].title).toBe(
			"Abrechnung zu spät zugestellt",
		);
	});

	it("finds no claim when everything is fine", () => {
		const v = values({
			heating: "900",
			from: "2025-01-01",
			to: "2025-12-31",
			received: "2026-04-01",
			share: "70",
			co2: "ja",
			remote: "ja",
			uvi: "ja",
		});
		const result = evaluate(v, TODAY);
		expect(resultHead(result)).toMatchObject({
			label: "Kein Anspruch gefunden",
			sub: "In den geprüften Punkten sieht Ihre Abrechnung korrekt aus.",
		});
		expect(letterText(result)).toContain(
			"Bitte korrigieren Sie die Abrechnung entsprechend.",
		);
	});
});
