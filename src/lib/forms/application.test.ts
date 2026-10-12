import { describe, expect, it } from "vitest";
import { APPLICATION_ERRORS, applicationSchema } from "./application";

const valid = {
	role: "frontend-engineer",
	name: "Max Mustermann",
	email: "max@beispiel.de",
	link: "",
	message: "",
	website: "",
	_t: 0,
};

const parse = (data: Partial<typeof valid>) =>
	applicationSchema.safeParse({ ...valid, ...data });
const firstError = (data: Partial<typeof valid>) =>
	parse(data).error?.issues[0]?.message;

describe("applicationSchema", () => {
	it("accepts a minimal application with an empty link and message", () => {
		expect(parse({}).success).toBe(true);
	});

	it("trims name, email and link", () => {
		const result = parse({
			name: "  Max  ",
			email: " max@beispiel.de ",
			link: " https://github.com/max ",
		});
		expect(result.data).toMatchObject({
			name: "Max",
			email: "max@beispiel.de",
			link: "https://github.com/max",
		});
	});

	it("requires a name and a valid email, with German messages", () => {
		expect(firstError({ name: " a " })).toBe(APPLICATION_ERRORS.name);
		expect(firstError({ email: "max@" })).toBe(APPLICATION_ERRORS.email);
	});

	it.each([
		"linkedin.com/in/max",
		"javascript:alert(1)",
		"ftp://example.com",
		"https://localhost",
	])("rejects the link %s", (link) => {
		expect(firstError({ link })).toBe(APPLICATION_ERRORS.link);
	});

	it("rejects a link over 300 characters", () => {
		const link = `https://example.com/${"a".repeat(300)}`;
		expect(firstError({ link })).toBe(APPLICATION_ERRORS.link);
	});

	it("rejects an unknown role", () => {
		expect(parse({ role: "ceo" }).success).toBe(false);
	});

	it("rejects a message over 2000 characters", () => {
		expect(firstError({ message: "Wort ".repeat(401) })).toBe(
			APPLICATION_ERRORS.message,
		);
	});
});
