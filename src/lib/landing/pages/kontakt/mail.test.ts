import { describe, expect, it } from "vitest";
import { mailBody, mailboxFor, mailHref, mailSubject } from "./mail";

const fields = {
	topic: "Angebot anfragen",
	firstName: "Erika",
	lastName: "Musterfrau",
	email: "erika@example.com",
	phone: "",
	company: "",
	units: "",
	message: "Wir haben 120 Wohnungen.\nWas kostet das?",
};

describe("mail", () => {
	it("writes the design's body, leaving out empty details", () => {
		expect(mailBody(fields)).toBe(
			"Hallo Heidi-Team,\n\nWir haben 120 Wohnungen.\nWas kostet das?\n\n---\nAnliegen: Angebot anfragen\nName: Erika Musterfrau\nE-Mail: erika@example.com",
		);
		expect(
			mailBody({
				...fields,
				phone: "030 123456",
				company: "Muster GmbH",
				units: "120",
			}),
		).toBe(
			"Hallo Heidi-Team,\n\nWir haben 120 Wohnungen.\nWas kostet das?\n\n---\nAnliegen: Angebot anfragen\nName: Erika Musterfrau\nUnternehmen: Muster GmbH\nEinheiten: 120\nE-Mail: erika@example.com\nTelefon: 030 123456",
		);
	});

	it("names the company in the subject, else the person", () => {
		expect(mailSubject(fields)).toBe("Angebot anfragen · Erika Musterfrau");
		expect(mailSubject({ ...fields, company: "Muster GmbH" })).toBe(
			"Angebot anfragen · Muster GmbH",
		);
	});

	it("sends each topic to the design's mailbox", () => {
		expect(mailboxFor("Angebot anfragen")).toBe("vertrieb@heidisystems.com");
		expect(mailboxFor("Wechsel zu Heidi")).toBe("vertrieb@heidisystems.com");
		expect(mailboxFor("Ich bin Kunde")).toBe("info@heidisystems.com");
		expect(mailboxFor("Partnerschaft")).toBe("vertrieb@heidisystems.com");
		expect(mailboxFor("Presse")).toBe("presse@heidisystems.com");
		expect(mailboxFor("Sonstiges")).toBe("info@heidisystems.com");
	});

	it("encodes subject and body", () => {
		const href = mailHref({ ...fields, topic: "Presse" });
		expect(href.startsWith("mailto:presse@heidisystems.com?subject=")).toBe(
			true,
		);
		const url = new URL(href);
		expect(url.searchParams.get("subject")).toBe("Presse · Erika Musterfrau");
		expect(url.searchParams.get("body")).toContain("Was kostet das?");
	});
});
