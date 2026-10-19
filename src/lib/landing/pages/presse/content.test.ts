import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ADDRESS } from "$lib/components/Footer/footerLinks";
import { START_HREF } from "$lib/landing/cta";
import { closing as einsparrechnerClosing } from "$lib/landing/pages/einsparrechner/content";
import * as routes from "$lib/routes";
import * as content from "./content";

const {
	boilerplate,
	closing,
	COMPANY,
	contact,
	DOWNLOAD_BASE,
	facts,
	hero,
	kit,
	PRESS_MAILTO,
	pressContact,
} = content;

const routeValues = Object.values(routes).filter((v) => typeof v === "string");

/** Every string in a value, deep. */
const strings = (value: unknown): string[] =>
	typeof value === "string"
		? [value]
		: value && typeof value === "object"
			? Object.values(value).flatMap(strings)
			: [];

const staticFile = (file: string) =>
	readFileSync(`static${DOWNLOAD_BASE}${file}`, "utf8");

/** The `d` attributes of an SVG's paths. */
const paths = (svg: string) =>
	[...svg.matchAll(/\bd="([^"]+)"/g)].map((m) => m[1].trim());

describe("/presse content", () => {
	it("has the design's H1", () => {
		expect(`${hero.h1} ${hero.h1Accent}`).toBe("Hallo, Presse.");
	});

	it("has four downloads, each a file in static/", () => {
		expect(kit.downloads).toHaveLength(4);
		const files = kit.downloads.map((d) => d.file);
		expect(new Set(files).size).toBe(4);
		for (const file of files)
			expect(existsSync(`static${DOWNLOAD_BASE}${file}`), file).toBe(true);
	});

	it("keeps the profile in step with the page", () => {
		const profile = staticFile("Heidi-Systems-Unternehmensprofil.txt");
		const [title, paragraph] = profile.split("\n\n");
		expect(title).toBe(`${COMPANY.name}: Unternehmensprofil`);
		expect(paragraph).toBe(boilerplate.text);
		expect(profile).toContain(`Sitz: ${COMPANY.street}, ${COMPANY.city}`);
		expect(profile).toContain("92 % der Montagen gelingen beim ersten Termin");
		expect(profile).toContain("14 Tage vor der Montage");
		expect(profile).toContain("Kooperationspartner des VDIV");
		for (const name of ["DEUMESS", "bved"]) expect(profile).toContain(name);
	});

	it("draws the logo files with the header's paths", () => {
		const logo = paths(
			readFileSync("src/lib/landing/components/icons/HeidiLogo.svelte", "utf8"),
		);
		const mark = paths(
			readFileSync("src/lib/landing/components/icons/HeidiMark.svelte", "utf8"),
		);
		expect(paths(staticFile("Heidi-Logo-dunkel.svg"))).toEqual(logo);
		expect(paths(staticFile("Heidi-Logo-hell.svg"))).toEqual(logo);
		expect(paths(staticFile("Heidi-Bildmarke.svg"))).toEqual(mark);
		expect(staticFile("Heidi-Logo-dunkel.svg")).toContain('fill="#1E322D"');
		expect(staticFile("Heidi-Logo-hell.svg")).toContain('fill="#FFFFFF"');
	});

	it("has six facts, two of them counted", () => {
		expect(facts.items).toHaveLength(6);
		const counted = facts.items.flatMap((f) =>
			typeof f.value === "string" ? [] : [f.value],
		);
		expect(counted).toEqual([
			{ count: 92, unit: "%" },
			{ count: 14, unit: "Tage" },
		]);
	});

	it("writes the company as the footer's address", () => {
		expect(COMPANY.name).toBe(ADDRESS.company);
		expect(COMPANY.city).toBe(ADDRESS.city);
		expect(COMPANY.street).toBe(ADDRESS.street.replace("pl.", "platz"));
		expect(pressContact.address).toEqual([
			ADDRESS.company,
			`${COMPANY.street}, ${ADDRESS.city}`,
		]);
	});

	it("links only to routes, the closing form and the press mailbox", () => {
		for (const href of [contact.cta.href, pressContact.cta.href])
			expect([...routeValues, START_HREF, PRESS_MAILTO]).toContain(href);
		expect(contact.cta.href).toBe(START_HREF);
		expect(pressContact.cta.href).toBe("mailto:presse@heidisystems.com");
	});

	it("has the closing text of the other pages", () => {
		expect(closing.text).toBe(einsparrechnerClosing.text);
	});

	it("has no empty or untrimmed text", () => {
		const texts = strings(content);
		expect(texts.length).toBeGreaterThan(40);
		for (const t of texts) {
			// The big line's parts and the "Gespeichert: " prefix end in a space.
			if (t === "zungen " || t === kit.saved) continue;
			expect(t.trim(), JSON.stringify(t)).toBe(t);
			expect(t.length).toBeGreaterThan(0);
		}
	});
});
