import { describe, expect, it } from "vitest";
import {
	PARTNERSHIP_ERRORS,
	PARTNERSHIP_KINDS,
	partnershipInquirySchema,
} from "./partnershipInquiry";

const valid = {
	company: "Muster Software GmbH",
	name: "Erika Musterfrau",
	email: "erika@beispiel.de",
	phone: "",
	kind: "Softwareanbieter",
	message: "",
	consent: true,
	website: "",
	_t: 0,
};

const parse = (data: Partial<typeof valid>) =>
	partnershipInquirySchema.safeParse({ ...valid, ...data });
const errorsOf = (data: Partial<typeof valid>) =>
	Object.fromEntries(
		(parse(data).error?.issues ?? []).map((i) => [i.path[0], i.message]),
	);

describe("partnershipInquirySchema", () => {
	it("accepts the required fields alone, without a phone number or message", () => {
		expect(parse({}).success).toBe(true);
	});

	it("accepts every kind and trims the text fields", () => {
		for (const kind of PARTNERSHIP_KINDS)
			expect(parse({ kind }).success, kind).toBe(true);
		const result = parse({
			company: "  Muster GmbH ",
			name: " Erika ",
			email: " erika@beispiel.de ",
			phone: " 030 123456 ",
			message: " Hallo ",
		});
		expect(result.data).toMatchObject({
			company: "Muster GmbH",
			name: "Erika",
			email: "erika@beispiel.de",
			phone: "030 123456",
			message: "Hallo",
		});
	});

	it("has the design's options", () => {
		expect(PARTNERSHIP_KINDS).toEqual([
			"Softwareanbieter",
			"Installationsbetrieb",
			"Verband oder Netzwerk",
			"Messdienstanbieter",
			"Immobilienunternehmen",
			"Sonstiges",
		]);
	});

	it("requires every field the design marks, with German messages", () => {
		expect(
			errorsOf({
				company: "",
				name: " ",
				email: "erika@",
				kind: "",
				consent: false,
			}),
		).toEqual({
			company: PARTNERSHIP_ERRORS.company,
			name: PARTNERSHIP_ERRORS.name,
			email: PARTNERSHIP_ERRORS.email,
			kind: PARTNERSHIP_ERRORS.kind,
			consent: PARTNERSHIP_ERRORS.consent,
		});
	});

	it("checks a given phone number: + ( ) / - and at least six digits", () => {
		for (const phone of ["030 123456", "+49 (30) 1234-567", "0171/2345678"])
			expect(parse({ phone }).success, phone).toBe(true);
		for (const phone of ["12345", "call me", "+49 30 abc 1234"])
			expect(errorsOf({ phone }), phone).toEqual({
				phone: PARTNERSHIP_ERRORS.phone,
			});
	});

	it("rejects a kind that isn't the design's", () => {
		expect(errorsOf({ kind: "Investor" })).toEqual({
			kind: PARTNERSHIP_ERRORS.kind,
		});
	});

	it("caps the message at 2000 characters", () => {
		expect(errorsOf({ message: "a ".repeat(1001) })).toEqual({
			message: PARTNERSHIP_ERRORS.message,
		});
	});
});
