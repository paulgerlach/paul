import { describe, expect, it } from "vitest";
import {
	CONTACT_TOPICS,
	contactInquirySchema,
	DEFAULT_TOPIC,
	MAILBOX_KEYS,
} from "$lib/forms/contactInquiry";
import { LOGIN_URL } from "$lib/company";
import {
	ROUTE_DATENSCHUTZHINWEISE,
	ROUTE_HILFE,
	ROUTE_PARTNERSCHAFTEN,
} from "$lib/routes";
import * as content from "./content";

const { MAILBOXES, BOOKING_HREF, hero, ways, write, form, faq, closing } =
	content;

describe("kontakt content", () => {
	it("has the design's three mailboxes", () => {
		expect(Object.keys(MAILBOXES)).toEqual([...MAILBOX_KEYS]);
		expect(Object.values(MAILBOXES)).toEqual([
			"vertrieb@heidisystems.com",
			"info@heidisystems.com",
			"presse@heidisystems.com",
		]);
		expect(hero.mailboxes.map((m) => m.key)).toEqual([...MAILBOX_KEYS]);
	});

	it("sends every booking link to /messdienstwechsel's signup", () => {
		expect(BOOKING_HREF).toBe("/messdienstwechsel#start");
		expect(hero.book.href).toBe(BOOKING_HREF);
		expect(write.alt.link.href).toBe(BOOKING_HREF);
		expect(closing.button.href).toBe(BOOKING_HREF);
		expect(ways.items[1].links).toEqual([
			{ text: "Demo buchen →", href: BOOKING_HREF },
		]);
	});

	it("links the design's pages that exist and hides the others", () => {
		expect(hero.write.href).toBe("#schreiben");
		expect(ways.items.flatMap((w) => w.links)).toEqual([
			{
				text: "vertrieb@heidisystems.com",
				href: "mailto:vertrieb@heidisystems.com",
			},
			{ text: "Selbst erfassen im Self-Service →" },
			{ text: "Demo buchen →", href: BOOKING_HREF },
			{ text: "Zum Hilfe-Center →", href: ROUTE_HILFE },
			{ text: "info@heidisystems.com", href: "mailto:info@heidisystems.com" },
			{ text: "Partnerschaften →", href: ROUTE_PARTNERSCHAFTEN },
			{
				text: "presse@heidisystems.com",
				href: "mailto:presse@heidisystems.com",
			},
		]);
		expect(form.consent.link.href).toBe(ROUTE_DATENSCHUTZHINWEISE);
		expect(faq.items[0].answer).toContain(`href="${LOGIN_URL}"`);
		expect(faq.items[0].answer).toContain(`href="${ROUTE_HILFE}"`);
		expect(faq.items[3].answer).toContain(`href="${ROUTE_HILFE}"`);
	});

	it("keeps the FAQ answers to plain text and links", () => {
		for (const item of faq.items)
			expect(
				item.answer.replace(/<a href="[^"]+">[^<]+<\/a>/g, ""),
			).not.toMatch(/[<>]/);
	});
});

describe("contact schema", () => {
	const valid = {
		topic: DEFAULT_TOPIC,
		firstName: "Erika",
		lastName: "Musterfrau",
		email: "erika@example.com",
		phone: "",
		company: "",
		units: "",
		message: "Hallo",
		consent: true,
		website: "",
		_t: 0,
	};

	it("takes the design's topics, the first by default", () => {
		expect(CONTACT_TOPICS.map((t) => t.label)).toEqual([
			"Angebot anfragen",
			"Wechsel zu Heidi",
			"Ich bin Kunde",
			"Partnerschaft",
			"Presse",
			"Sonstiges",
		]);
		expect(DEFAULT_TOPIC).toBe("Angebot anfragen");
		expect(contactInquirySchema.safeParse(valid).success).toBe(true);
		expect(
			contactInquirySchema.safeParse({ ...valid, topic: "Anderes" }).success,
		).toBe(false);
	});

	it("requires names, email, message and consent", () => {
		for (const patch of [
			{ firstName: " " },
			{ lastName: "" },
			{ email: "erika@" },
			{ message: "" },
			{ consent: false },
			{ units: "12a" },
		])
			expect(
				contactInquirySchema.safeParse({ ...valid, ...patch }).success,
			).toBe(false);
		expect(
			contactInquirySchema.safeParse({ ...valid, units: "120", phone: "030 1" })
				.success,
		).toBe(true);
	});
});
