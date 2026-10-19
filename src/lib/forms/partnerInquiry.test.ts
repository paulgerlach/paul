import { describe, expect, it } from "vitest";
import { PARTNER_ERRORS, partnerInquirySchema } from "./partnerInquiry";

const valid = {
	company: "Muster Haustechnik GmbH",
	name: "Max Mustermann",
	email: "max@beispiel.de",
	phone: "+49 30 1234567",
	region: "10115",
	crew: "1 bis 2",
	trades: [] as string[],
	experience: "",
	message: "",
	consent: true,
	website: "",
	_t: 0,
};

const parse = (data: Partial<typeof valid>) =>
	partnerInquirySchema.safeParse({ ...valid, ...data });
const errorsOf = (data: Partial<typeof valid>) =>
	Object.fromEntries(
		(parse(data).error?.issues ?? []).map((i) => [i.path[0], i.message]),
	);

describe("partnerInquirySchema", () => {
	it("accepts the required fields alone", () => {
		expect(parse({}).success).toBe(true);
	});

	it("accepts every option and trims the text fields", () => {
		const result = parse({
			company: "  Muster GmbH ",
			name: " Max ",
			email: " max@beispiel.de ",
			region: " Raum Leipzig ",
			trades: ["Heizung", "Sanitär", "Messtechnik", "Elektro"],
			experience: "nein",
			crew: "Mehr als 15",
		});
		expect(result.data).toMatchObject({
			company: "Muster GmbH",
			name: "Max",
			email: "max@beispiel.de",
			region: "Raum Leipzig",
		});
	});

	it("requires every field the design marks, with German messages", () => {
		expect(
			errorsOf({
				company: "",
				name: " ",
				email: "max@",
				phone: "",
				region: "",
				crew: "",
				consent: false,
			}),
		).toEqual({
			company: PARTNER_ERRORS.company,
			name: PARTNER_ERRORS.name,
			email: PARTNER_ERRORS.email,
			phone: PARTNER_ERRORS.phone,
			region: PARTNER_ERRORS.region,
			crew: PARTNER_ERRORS.crew,
			consent: PARTNER_ERRORS.consent,
		});
	});

	it("takes phone numbers with + ( ) / - and at least six digits", () => {
		for (const phone of ["030 123456", "+49 (30) 1234-567", "0171/2345678"])
			expect(parse({ phone }).success, phone).toBe(true);
		for (const phone of ["12345", "call me", "+49 30 abc 1234"])
			expect(parse({ phone }).success, phone).toBe(false);
	});

	it("rejects options that aren't the design's", () => {
		expect(parse({ crew: "100" }).success).toBe(false);
		expect(parse({ experience: "vielleicht" }).success).toBe(false);
		expect(parse({ trades: ["Dach"] }).success).toBe(false);
	});

	it("caps the message at 2000 characters", () => {
		expect(errorsOf({ message: "a ".repeat(1001) })).toEqual({
			message: PARTNER_ERRORS.message,
		});
	});
});
