import { readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DEADLINE } from "$lib/landing/deadline/deadline";
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

/** The public paths of `src/routes`, without groups and optional segments. */
function routePaths(dir = "src/routes", prefix = ""): string[] {
	const paths: string[] = [];
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		if (!entry.isDirectory()) {
			if (entry.name === "+page.svelte") paths.push(prefix || "/");
			continue;
		}
		const segment = /^\(.*\)$|^\[\[.*\]\]$/.test(entry.name)
			? ""
			: `/${entry.name}`;
		paths.push(...routePaths(`${dir}/${entry.name}`, prefix + segment));
	}
	return paths;
}

const questions = content.topics.flatMap((topic) => topic.questions);

describe("/hilfe content", () => {
	it("has 6 topics with 22 questions and known icons", () => {
		expect(content.topics).toHaveLength(6);
		expect(questions).toHaveLength(22);
		for (const topic of content.topics)
			expect(ICON_NAMES).toContain(topic.icon);
	});

	it("has unique, URL-safe ids", () => {
		const ids = [
			...content.topics.map((topic) => `c-${topic.id}`),
			...questions.map((question) => `q-${question.id}`),
		];
		expect(new Set(ids).size).toBe(ids.length);
		for (const id of ids) expect(id).toMatch(/^[a-z]-[a-z0-9]+(-[a-z0-9]+)*$/);
		expect(content.QUESTION_IDS).toEqual(questions.map((q) => q.id));
	});

	it("lists known popular questions", () => {
		for (const id of content.popular.ids)
			expect(content.QUESTION_IDS).toContain(id);
	});

	it("links answers only to existing pages", () => {
		const routes = routePaths();
		for (const { more } of questions)
			if (more?.href) expect(routes, more.href).toContain(more.href);
	});

	it("switches the deadline answer at the deadline", () => {
		const answer = (now: number) =>
			content
				.resolveTopics(now)
				.flatMap((topic) => topic.questions)
				.find((question) => question.id === "fernablesbar-frist")!.answer;
		expect(answer(DEADLINE - 1)).toContain("31. Dezember 2026");
		expect(answer(DEADLINE)).not.toBe(answer(DEADLINE - 1));
		expect(answer(DEADLINE)).toContain("1. Januar 2027");
		// The resolved topics carry no second variant.
		for (const question of content
			.resolveTopics(DEADLINE)
			.flatMap((t) => t.questions))
			expect(question).not.toHaveProperty("answerExpired");
	});

	it("derives counts and the result line", () => {
		expect(content.articlesText(4)).toBe("4 Artikel");
		expect(content.results.text(1, "lauft")).toBe("1 Ergebnis für „lauft“");
		expect(content.results.text(3, "uvi")).toBe("3 Ergebnisse für „uvi“");
	});

	it("has no empty strings and no XX placeholders", () => {
		const all = strings(content);
		expect(all.length).toBeGreaterThan(80);
		for (const text of all) {
			expect(text.trim()).not.toBe("");
			expect(text).not.toMatch(/XX/);
		}
	});
});
