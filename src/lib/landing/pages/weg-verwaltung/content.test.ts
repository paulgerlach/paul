import { describe, expect, it } from "vitest";
import { testimonial, testimonials } from "$lib/landing/data/testimonials";
import { DEADLINE } from "$lib/landing/deadline/deadline";
import { list as hausverwaltungList } from "$lib/landing/pages/hausverwaltung/content";
import * as routes from "$lib/routes";
import * as content from "./content";

const {
	bill,
	calendar,
	doc,
	faq,
	figures,
	hero,
	list,
	numbers,
	phone,
	quotes,
	rotator,
	rows,
} = content;

/** Every string in a value, deeply. */
function strings(value: unknown): string[] {
	if (typeof value === "string") return [value];
	if (Array.isArray(value)) return value.flatMap(strings);
	if (value && typeof value === "object")
		return Object.values(value).flatMap(strings);
	return [];
}

/** Every `href` in a value, deeply (also inside FAQ answers). */
function hrefs(value: unknown): string[] {
	if (typeof value === "string")
		return [...value.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
	if (Array.isArray(value)) return value.flatMap(hrefs);
	if (value && typeof value === "object")
		return Object.entries(value).flatMap(([key, v]) =>
			key === "href" && typeof v === "string" ? [v] : hrefs(v),
		);
	return [];
}

const routeValues = new Set(
	Object.values(routes).filter((v) => typeof v === "string"),
);
const ANCHORS = ["#inhalt", "#faq", "#start"];

/** The design's quotes, word for word. */
const DESIGN_QUOTES = {
	werne:
		"„Die Ablesungen und Verbrauchserfassungen laufen reibungslos und pünktlich ab – sowohl für uns als Hausverwaltung als auch für unsere Mieter.“",
	vitolus:
		"„Mit Heidi Systems erfassen wir den Verbrauch vollautomatisch – das spart Aufwand und schafft Transparenz für uns und unsere Bewohner.“",
	gerhard:
		"„Heidi hat uns bei der Sanierung einer Gewerbefläche durch die Installation einer zuverlässigen Verbrauchserfassung optimal unterstützt.“",
};

describe("weg-verwaltung content", () => {
	it("has the design's H1 and word", () => {
		expect(hero.srTitle).toBe(
			"Heizkostenabrechnung für WEG-Verwaltungen mit Heidi",
		);
		// With a non-breaking hyphen, so the huge word stays on one line.
		expect(hero.word).toBe("WEG\u2011Verwaltung");
	});

	it("links only to routes and anchors on the page", () => {
		for (const href of hrefs(content)) {
			if (href.startsWith("#")) expect(ANCHORS).toContain(href);
			else expect(routeValues, href).toContain(href);
		}
	});

	it("has no empty or untrimmed text", () => {
		for (const s of strings(content)) {
			expect(s.trim()).not.toBe("");
			expect(s).toBe(s.trim());
		}
	});

	it("has four rows, each with a two-line title and two paragraphs", () => {
		expect(rows.items).toHaveLength(4);
		expect(new Set(rows.items.map((r) => r.tile)).size).toBe(4);
		for (const row of rows.items) {
			expect(row.title).toHaveLength(2);
			expect(row.paragraphs).toHaveLength(2);
		}
	});

	it("lists four associations: /hausverwaltung's buildings with their unit counts", () => {
		expect(list.entries).toHaveLength(4);
		expect(list.head).toBe(`${list.entries.length} Gemeinschaften`);
		list.entries.forEach((entry, i) => {
			const building = hausverwaltungList.entries[i];
			expect(entry.title).toBe(`WEG ${building.title}`);
			expect(entry.sub.split(" · ")[0]).toBe(building.sub.split(" · ")[0]);
			expect(entry.sub).toMatch(/ · ETV im \S+$/);
			expect(entry.before).not.toBe(entry.after);
		});
	});

	it("shows the first association in the doc and the phone", () => {
		const [first] = list.entries;
		expect(doc.sub).toBe(`${first.title} · Beispiel`);
		expect(phone.sub.startsWith(`${first.title} · `)).toBe(true);
	});

	it("plans a year with three milestones, the last one in progress", () => {
		expect(calendar.months).toHaveLength(12);
		expect(calendar.current).toBe(calendar.months.length - 1);
		expect(calendar.cells).toHaveLength(calendar.months.length);
		const milestones = calendar.months.flatMap((month, i) => {
			const cell = calendar.cells?.[i];
			return cell?.kind === "milestone" ? [{ month, ...cell }] : [];
		});
		expect(milestones.map((m) => m.label)).toEqual([
			"ETV",
			"Kündigung",
			"Vertragsende",
		]);
		for (const m of milestones) expect(m.note).toMatch(`${m.month}: `);
		// The last cell is the one in progress: the takeover.
		expect(calendar.cells?.at(-1)?.kind).toBe("milestone");
		// The other months are placeholders without a label or note.
		for (const cell of calendar.cells ?? [])
			if (cell.kind !== "milestone")
				expect(cell).toEqual({ kind: "placeholder" });
	});

	it("holds the ETV in the month the first association has it", () => {
		const etv = calendar.months.find(
			(_, i) => calendar.cells?.[i]?.label === "ETV",
		);
		expect(list.entries[0].sub).toBe("18 Einheiten · ETV im Mai");
		expect(etv).toBe("Mai");
	});

	it("splits the costs as the row and the FAQ say", () => {
		const bars = doc.rows.flatMap((r) =>
			r.share === undefined ? [] : [{ value: r.value, share: r.share }],
		);
		expect(bars).toHaveLength(2);
		expect(bars.reduce((sum, r) => sum + r.share, 0)).toBe(100);
		for (const r of bars) expect(r.value).toBe(`${r.share}\u00a0%`);
		const consumption = bars[1].share;
		expect(consumption).toBeGreaterThanOrEqual(50);
		expect(consumption).toBeLessThanOrEqual(70);
		expect(rows.items[2].paragraphs[0]).toContain(
			"50 bis 70\u00a0% nach Verbrauch",
		);
		expect(faq.items[2].answer).toContain("50 bis 70\u00a0% nach Verbrauch");
		// The bars come before the check rows.
		expect(doc.rows.findIndex((r) => r.share === undefined)).toBe(bars.length);
	});

	it("switches both manual rows for one signature", () => {
		const kinds = bill.rows.map((r) => r.kind);
		expect(kinds).toEqual(["cut", "cut", "ok", "ok"]);
		expect(
			bill.rows.filter((r) => r.kind === "cut").map((r) => r.value),
		).toEqual(["Sie", "Sie"]);
		expect(bill.sum).toEqual({
			label: "Ihr Aufwand",
			before: "hoch",
			after: "eine Unterschrift",
		});
	});

	it("shows the month's value as the phone's last bar", () => {
		expect(phone.bars.at(-1)).toBe(Number.parseInt(phone.value, 10));
		expect(phone).not.toHaveProperty("details");
	});

	it("has four rotating phrases", () => {
		expect(rotator.phrases).toHaveLength(4);
	});

	it("counts only figures whose value is the count", () => {
		for (const f of [numbers.first, ...figures(0), ...figures(DEADLINE)])
			if (f.count !== undefined) expect(f.value).toBe(String(f.count));
	});

	it("uses the design's quotes, word for word", () => {
		const keys = testimonials.map((t) => t.key);
		expect(quotes.keys).toEqual(["werne", "vitolus", "gerhard"]);
		for (const key of quotes.keys) {
			expect(keys).toContain(key);
			expect(testimonial(key).quote).toBe(DESIGN_QUOTES[key]);
		}
	});

	it("has six questions", () => {
		expect(faq.items).toHaveLength(6);
		for (const item of faq.items) expect(item.answer.trim()).not.toBe("");
	});

	it("switches the deadline figure at the deadline", () => {
		const before = DEADLINE - 1;
		expect(figures(before)).toHaveLength(4);
		expect(figures(before).at(-1)?.value).toBe("31.12.2026");
		expect(figures(DEADLINE).map((f) => f.value)).not.toContain("31.12.2026");
	});
});
