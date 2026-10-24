import { describe, expect, it } from "vitest";
import {
	SOFTWARE_PARTNER_ERRORS,
	softwarePartnerInquirySchema,
} from "./softwarePartnerInquiry";

const valid = {
	company: "Muster Software GmbH",
	name: "Erika Musterfrau",
	email: "erika@beispiel.de",
	phone: "",
	product: "Muster ERP",
	customers: "Bis 50",
	kinds: [] as string[],
	message: "",
	consent: true,
	website: "",
	_t: 0,
};

const parse = (data: Partial<typeof valid>) =>
	softwarePartnerInquirySchema.safeParse({ ...valid, ...data });
const errorsOf = (data: Partial<typeof valid>) =>
	Object.fromEntries(
		(parse(data).error?.issues ?? []).map((i) => [i.path[0], i.message]),
	);

describe("softwarePartnerInquirySchema", () => {
	it("accepts the required fields alone, without a phone number", () => {
		expect(parse({}).success).toBe(true);
	});

	it("accepts every option and trims the text fields", () => {
		const result = parse({
			company: "  Muster GmbH ",
			name: " Erika ",
			email: " erika@beispiel.de ",
			phone: " 030 123456 ",
			product: " Muster ERP ",
			kinds: ["ERP", "CRM", "Abrechnung", "Mieterkommunikation", "Sonstiges"],
			customers: "Mehr als 1.000",
		});
		expect(result.data).toMatchObject({
			company: "Muster GmbH",
			name: "Erika",
			email: "erika@beispiel.de",
			phone: "030 123456",
			product: "Muster ERP",
		});
	});

	it("requires every field the design marks, with German messages", () => {
		expect(
			errorsOf({
				company: "",
				name: " ",
				email: "erika@",
				product: "",
				customers: "",
				consent: false,
			}),
		).toEqual({
			company: SOFTWARE_PARTNER_ERRORS.company,
			name: SOFTWARE_PARTNER_ERRORS.name,
			email: SOFTWARE_PARTNER_ERRORS.email,
			product: SOFTWARE_PARTNER_ERRORS.product,
			customers: SOFTWARE_PARTNER_ERRORS.customers,
			consent: SOFTWARE_PARTNER_ERRORS.consent,
		});
	});

	it("checks a given phone number: + ( ) / - and at least six digits", () => {
		for (const phone of ["030 123456", "+49 (30) 1234-567", "0171/2345678"])
			expect(parse({ phone }).success, phone).toBe(true);
		for (const phone of ["12345", "call me", "+49 30 abc 1234"])
			expect(errorsOf({ phone }), phone).toEqual({
				phone: SOFTWARE_PARTNER_ERRORS.phone,
			});
	});

	it("rejects options that aren't the design's", () => {
		expect(parse({ customers: "100" }).success).toBe(false);
		expect(parse({ kinds: ["Buchhaltung"] }).success).toBe(false);
	});

	it("caps the message at 2000 characters", () => {
		expect(errorsOf({ message: "a ".repeat(1001) })).toEqual({
			message: SOFTWARE_PARTNER_ERRORS.message,
		});
	});
});
