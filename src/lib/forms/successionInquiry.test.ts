import { describe, expect, it } from "vitest";
import {
	PROPERTY_COUNTS,
	SUCCESSION_ERRORS,
	TIMEFRAMES,
	successionInquirySchema,
} from "./successionInquiry";

const valid = {
	company: "Muster Messdienst GmbH",
	name: "Erika Musterfrau",
	email: "erika@beispiel.de",
	phone: "",
	properties: "",
	timeframe: "",
	message: "",
	consent: true,
	website: "",
	_t: 0,
};

const parse = (data: Partial<typeof valid>) =>
	successionInquirySchema.safeParse({ ...valid, ...data });
const errorsOf = (data: Partial<typeof valid>) =>
	Object.fromEntries(
		(parse(data).error?.issues ?? []).map((i) => [i.path[0], i.message]),
	);

describe("successionInquirySchema", () => {
	it("accepts the required fields alone, without a phone number or a choice", () => {
		expect(parse({}).success).toBe(true);
	});

	it("accepts every option and trims the text fields", () => {
		for (const properties of PROPERTY_COUNTS)
			expect(parse({ properties }).success, properties).toBe(true);
		for (const timeframe of TIMEFRAMES)
			expect(parse({ timeframe }).success, timeframe).toBe(true);
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
		expect(PROPERTY_COUNTS).toEqual([
			"bis 100",
			"100 bis 500",
			"500 bis 2.000",
			"über 2.000",
		]);
		expect(TIMEFRAMES).toEqual([
			"so bald wie möglich",
			"in 6 bis 12 Monaten",
			"in 1 bis 2 Jahren",
			"noch offen",
		]);
	});

	it("requires every field the design marks, with German messages", () => {
		expect(
			errorsOf({ company: "", name: " ", email: "erika@", consent: false }),
		).toEqual({
			company: SUCCESSION_ERRORS.company,
			name: SUCCESSION_ERRORS.name,
			email: SUCCESSION_ERRORS.email,
			consent: SUCCESSION_ERRORS.consent,
		});
	});

	it("checks a given phone number: + ( ) / - and at least six digits", () => {
		for (const phone of ["030 123456", "+49 (30) 1234-567", "0171/2345678"])
			expect(parse({ phone }).success, phone).toBe(true);
		for (const phone of ["12345", "call me", "+49 30 abc 1234"])
			expect(errorsOf({ phone }), phone).toEqual({
				phone: SUCCESSION_ERRORS.phone,
			});
	});

	it("rejects options that aren't the design's", () => {
		expect(errorsOf({ properties: "100" })).toEqual({
			properties: SUCCESSION_ERRORS.properties,
		});
		expect(errorsOf({ timeframe: "morgen" })).toEqual({
			timeframe: SUCCESSION_ERRORS.timeframe,
		});
	});

	it("caps the message at 2000 characters", () => {
		expect(errorsOf({ message: "a ".repeat(1001) })).toEqual({
			message: SUCCESSION_ERRORS.message,
		});
	});
});
