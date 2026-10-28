import { describe, expect, it } from "vitest";
import {
	CONNECTION_ERRORS,
	SOFTWARE_TYPES,
	connectionInquirySchema,
} from "./connectionInquiry";

const valid = {
	company: "Muster Software GmbH",
	name: "Erika Musterfrau",
	email: "erika@beispiel.de",
	software: "CRM",
	message: "",
	consent: true,
	website: "",
	_t: 0,
};

const parse = (data: Partial<typeof valid>) =>
	connectionInquirySchema.safeParse({ ...valid, ...data });
const errorsOf = (data: Partial<typeof valid>) =>
	Object.fromEntries(
		(parse(data).error?.issues ?? []).map((i) => [i.path[0], i.message]),
	);

describe("connectionInquirySchema", () => {
	it("accepts the required fields alone, without a message", () => {
		expect(parse({}).success).toBe(true);
	});

	it("accepts every kind of software and trims the text fields", () => {
		for (const software of SOFTWARE_TYPES)
			expect(parse({ software }).success, software).toBe(true);
		const result = parse({
			company: "  Muster GmbH ",
			name: " Erika ",
			email: " erika@beispiel.de ",
			message: " Verbräuche ",
		});
		expect(result.data).toMatchObject({
			company: "Muster GmbH",
			name: "Erika",
			email: "erika@beispiel.de",
			message: "Verbräuche",
		});
	});

	it("has the design's options", () => {
		expect(SOFTWARE_TYPES).toEqual([
			"ERP für die Immobilienwirtschaft",
			"CRM",
			"Abrechnungssoftware",
			"Mieter-App oder Portal",
			"Andere Software",
		]);
	});

	it("requires every field the design marks, with German messages", () => {
		expect(
			errorsOf({
				company: "",
				name: " ",
				email: "erika@",
				software: "",
				consent: false,
			}),
		).toEqual({
			company: CONNECTION_ERRORS.company,
			name: CONNECTION_ERRORS.name,
			email: CONNECTION_ERRORS.email,
			software: CONNECTION_ERRORS.software,
			consent: CONNECTION_ERRORS.consent,
		});
	});

	it("rejects software that isn't one of the design's options", () => {
		expect(errorsOf({ software: "ERP" })).toEqual({
			software: CONNECTION_ERRORS.software,
		});
	});

	it("caps the message at 2000 characters", () => {
		expect(errorsOf({ message: "a ".repeat(1001) })).toEqual({
			message: CONNECTION_ERRORS.message,
		});
	});
});
