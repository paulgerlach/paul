import { describe, expect, it } from "vitest";
import { calculator } from "./content";
import {
	euros,
	formatValue,
	hoursText,
	riskText,
	savings,
	type Inputs,
} from "./savings";

const defaults = Object.fromEntries(
	calculator.fields.map((f) => [f.id, f.default]),
) as Inputs;
const { riskLine, noRisk, hours: hoursLabel } = calculator.result;
const nb = (s: string) => s.replaceAll(" ", " ");

describe("savings", () => {
	it("gives the design's figures for its defaults", () => {
		const r = savings(defaults, 0);
		expect(r.hours).toBe(156);
		expect(r.time).toBe(7020);
		expect(r.risk).toBe(0);
		expect(r.total).toBe(7020);
		expect(r.days).toBe(19.5);
		expect(r.perUnit).toBe(29.25);
		expect(r.bars).toEqual({ time: 100, risk: 0 });
		expect(nb(euros(r.total))).toBe("7.020 €");
		expect(nb(euros(r.perUnit))).toBe("29 €");
		expect(formatValue(Math.round(r.days))).toBe("20");
	});

	it("adds 3 % of the heating costs per toggle", () => {
		expect(savings(defaults, 1).risk).toBeCloseTo(7200);
		const both = savings(defaults, 2);
		expect(both.risk).toBeCloseTo(14400);
		expect(both.total).toBeCloseTo(21420);
		expect(both.bars.risk).toBe(100);
		expect(both.bars.time).toBeCloseTo((7020 / 14400) * 100);
	});

	it("keeps the bars at 0 without any figure and guards the units", () => {
		const zero = { ...defaults, a1: 0, a2: 0, a3: 0 };
		expect(savings(zero, 0).bars).toEqual({ time: 0, risk: 0 });
		expect(savings(zero, 1).bars).toEqual({ time: 0, risk: 100 });
		expect(savings({ ...defaults, we: 0 }, 0).perUnit).toBe(0);
	});

	it("reaches its largest total at every maximum", () => {
		const max = Object.fromEntries(
			calculator.fields.map((f) => [f.id, f.max]),
		) as Inputs;
		expect(savings(max, 2).total).toBeCloseTo(3_060_000);
	});
});

describe("texts", () => {
	it("shows a decimal only for fractions", () => {
		expect(formatValue(4)).toBe("4");
		expect(formatValue(4.5)).toBe("4,5");
		expect(formatValue(1000)).toBe("1.000");
		expect(nb(hoursText(156, hoursLabel))).toBe("156 Stunden pro Jahr");
		expect(nb(hoursText(13.5, hoursLabel))).toBe("13,5 Stunden pro Jahr");
	});

	it("names the risk or none", () => {
		expect(riskText(0, 240000, riskLine, noRisk)).toBe(
			"Kein Risiko ausgewählt",
		);
		expect(nb(riskText(2, 240000, riskLine, noRisk))).toBe(
			"2 × 3 % Kürzungsrecht auf 240.000 € Heizkosten",
		);
	});
});
