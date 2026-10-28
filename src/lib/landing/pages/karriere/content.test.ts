import { describe, expect, it } from "vitest";
import { ROLE_IDS } from "$lib/forms/application";
import { ICON_NAMES } from "./icons";
import * as content from "./content";

/** Every string in a value, depth first. */
function strings(value: unknown): string[] {
	if (typeof value === "string") return [value];
	if (Array.isArray(value)) return value.flatMap(strings);
	if (value && typeof value === "object")
		return Object.values(value).flatMap(strings);
	return [];
}

const AREA_IDS = content.areas.items.map((area) => area.id);

describe("/karriere content", () => {
	it("has 4 reasons, 4 areas with 3 points each and 3 steps", () => {
		expect(content.reasons.items).toHaveLength(4);
		expect(content.areas.items).toHaveLength(4);
		for (const area of content.areas.items) expect(area.points).toHaveLength(3);
		expect(content.process.steps).toHaveLength(3);
	});

	it("has 7 feed events with known icons and areas", () => {
		expect(content.feed.events).toHaveLength(7);
		for (const event of content.feed.events) {
			expect(ICON_NAMES).toContain(event.icon);
			expect(AREA_IDS).toContain(event.area);
		}
	});

	it("lists every job with 3 + 3 points in a known area", () => {
		for (const job of content.jobs.list) {
			expect(job.build).toHaveLength(3);
			expect(job.bring).toHaveLength(3);
			expect(AREA_IDS).toContain(job.area);
		}
	});

	it("has the form's role ids, one to one", () => {
		expect(content.roles.map((role) => role.id)).toEqual([...ROLE_IDS]);
	});

	it("derives the open job count per area", () => {
		expect(content.jobsInArea("eng")).toBe(1);
		expect(content.jobsInArea("ops")).toBe(0);
		expect(content.areas.openJobs(1)).toBe("1 offene Stelle");
		expect(content.areas.openJobs(2)).toBe("2 offene Stellen");
	});

	it("has no empty strings and no XX placeholders", () => {
		const all = strings(content);
		expect(all.length).toBeGreaterThan(50);
		for (const text of all) {
			expect(text.trim()).not.toBe("");
			expect(text).not.toMatch(/XX/);
		}
	});
});
