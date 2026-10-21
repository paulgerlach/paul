import { describe, expect, it } from "vitest";
import * as routes from "$lib/routes";
import {
	access,
	ARTICLE,
	auth,
	BASE_URL,
	baseUrl,
	consumption,
	copy,
	docs,
	documents,
	fileExchange,
	hero,
	overview,
	quickStart,
	status,
	terminal,
	userChange,
	versions,
} from "./content";
import { ICONS } from "./icons";

const routeValues = Object.values(routes).filter((v) => typeof v === "string");
const articleIds = Object.values(ARTICLE);

/** Every string in a value, deep. */
const strings = (value: unknown): string[] =>
	typeof value === "string"
		? [value]
		: value && typeof value === "object"
			? Object.values(value).flatMap(strings)
			: [];

const content = {
	hero,
	terminal,
	docs,
	overview,
	quickStart,
	auth,
	baseUrl,
	consumption,
	userChange,
	documents,
	fileExchange,
	status,
	versions,
	access,
};

describe("/api-dokumentation content", () => {
	it("has the design's H1", () => {
		expect(`${hero.h1} ${hero.h1Accent}`).toBe(
			"Verbrauchsdaten direkt in Ihre Software. Nach bved-Standard.",
		);
	});

	it("lists every article once in the table of contents, in order", () => {
		const ids = docs.groups.flatMap((g) => g.links.map((l) => l.id));
		expect(ids).toEqual(articleIds);
		expect(docs.groups.map((g) => g.links.length)).toEqual([4, 4, 3]);
	});

	it("links only to routes, the articles and the bved", () => {
		const hrefs = [
			hero.primary.href,
			hero.secondary.href,
			...overview.services.map((s) => s.href),
			access.primary.href,
			access.secondary.href,
		];
		for (const href of hrefs) {
			if (href.startsWith("#")) expect(articleIds).toContain(href.slice(1));
			else expect(routeValues).toContain(href);
		}
		expect(hero.primary.href).toBe("#schnellstart");
		expect(hero.secondary.href).toBe(routes.ROUTE_SOFTWAREPARTNER);
		expect(access.primary.href).toBe(routes.ROUTE_DEMO_BUCHEN);
		expect(versions.source.href).toBe(
			"https://bved.info/datenaustauschalt/spezifikationen/",
		);
	});

	it("names each service's version as its article and the versions table do", () => {
		const badge = {
			"consumption-data": consumption.version,
			"on-site-roles": userChange.version,
			documents: documents.version,
		} as Record<string, string>;
		for (const service of overview.services.slice(0, 3)) {
			const version = service.version.replace(/^v/, "");
			expect(badge[service.name]).toBe(`${service.name} ${version}`);
			const rows = versions.table.rows.filter((r) => r[0] === service.name);
			expect(rows.at(-1)?.[1]).toEqual([{ code: version }]);
		}
		expect(overview.services[3].version).toBe("V 3.10");
		expect(fileExchange.h2).toBe("Datenaustausch V 3.10");
	});

	it("has samples that parse and call the base URL", () => {
		const answer = consumption.endpoints[0].answer!;
		expect(JSON.parse(answer.code)).toEqual({
			billingunit: {
				reference: { mscnumber: "123456789", pmnumber: "XY-12345-00" },
				periods: [{ period: "2021-06", update: "2022-05-09T09:04:55.772Z" }],
			},
		});
		// No escaped quotes: the highlighting's strings end at the next quote.
		expect(answer.code).not.toContain('\\"');
		expect(quickStart.sample.code).toContain(
			`${BASE_URL}/billingunits/123456789/consumptions/periods`,
		);
		expect(baseUrl.sample.code).toBe(BASE_URL);
		const endpoint = consumption.endpoints[0].path.replace(
			"{mscnumber}",
			"123456789",
		);
		const call = terminal.lines[0]
			.map((p) => (typeof p === "string" ? p : p.text))
			.join("");
		expect(call).toBe(`GET ${endpoint}`);
	});

	it("has three steps, two endpoints, seven status codes and five versions", () => {
		expect(quickStart.steps).toHaveLength(3);
		expect(consumption.endpoints.map((e) => e.id)).toEqual([
			"ep-periods",
			"ep-period",
		]);
		expect(status.table.rows.map((r) => r[0])).toEqual(
			["200", "400", "401", "404", "405 / 501", "500", "503"].map((s) => [
				expect.objectContaining({ status: s }),
			]),
		);
		expect(versions.table.rows).toHaveLength(5);
		for (const table of [
			auth.table,
			status.table,
			versions.table,
			...consumption.endpoints.flatMap((e) =>
				e.fields ? [e.params, e.fields] : [e.params],
			),
		])
			for (const row of table.rows) expect(row).toHaveLength(table.head.length);
	});

	it("uses only the page's icons", () => {
		for (const name of [
			hero.pillIcon,
			...overview.roles.map((r) => r.icon),
			...overview.services.map((s) => s.icon),
		])
			expect(Object.keys(ICONS)).toContain(name);
	});

	it("has no empty, doubled-space or untrimmed text", () => {
		const codes = new Set([
			quickStart.sample.code,
			consumption.endpoints[0].answer!.code,
		]);
		for (const text of strings(content)) {
			expect(text).not.toBe("");
			if (codes.has(text)) continue;
			// The terminal's lines keep their indents.
			expect(text.trimStart()).not.toMatch(/ {2}/);
		}
		for (const text of [
			hero.h1,
			hero.lead,
			docs.note.text,
			overview.text,
			access.text,
			copy.button,
			...quickStart.steps.flatMap((s) => [s.title, s.text]),
		])
			expect(text).toBe(text.trim());
	});
});
