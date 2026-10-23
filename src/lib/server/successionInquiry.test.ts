import type { RequestEvent } from "@sveltejs/kit";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { handleSuccessionInquiry } from "./successionInquiry";
import { sendWebhookEventOrThrow } from "./webhooks";

vi.mock("./webhooks", () => ({ sendWebhookEventOrThrow: vi.fn() }));
const send = vi.mocked(sendWebhookEventOrThrow);

let ip = 0;

/** A form post, from a new IP each time unless `from` is given. */
function post(
	fields: Record<string, string | string[]>,
	from = `10.5.0.${++ip}`,
) {
	const body = new FormData();
	const all: Record<string, string | string[]> = {
		company: "Muster Messdienst GmbH",
		name: "Erika Musterfrau",
		email: "erika@beispiel.de",
		phone: "+49 30 1234567",
		properties: "100 bis 500",
		timeframe: "in 1 bis 2 Jahren",
		message: "Wir suchen eine Nachfolge für unsere Kunden.",
		consent: "on",
		website: "",
		_t: String(Date.now() - 10_000),
		...fields,
	};
	for (const [key, value] of Object.entries(all))
		for (const v of Array.isArray(value) ? value : [value]) body.append(key, v);
	const event = {
		request: new Request("http://localhost/nachfolge", {
			method: "POST",
			body,
		}),
		getClientAddress: () => from,
	} as unknown as RequestEvent;
	return handleSuccessionInquiry(event, { page: "/partner/nachfolge" });
}

/** The status of a `fail()` / error `message()`, or 200. */
const statusOf = (result: unknown) =>
	(result as { status?: number }).status ?? 200;
const formOf = (result: unknown) =>
	((result as { data?: unknown }).data ?? result) as {
		form: {
			message?: { type: string; text: string };
			data: object;
			errors: Record<string, unknown>;
		};
	};

describe("handleSuccessionInquiry", () => {
	beforeEach(() => send.mockReset());

	it("sends the inquiry without the spam fields", async () => {
		const result = await post({});
		expect(statusOf(result)).toBe(200);
		expect(formOf(result).form.message).toEqual({
			type: "success",
			text: "Danke, Erika Musterfrau! Wir melden uns bei Ihnen.",
		});
		expect(send).toHaveBeenCalledOnce();
		const [event, email, payload] = send.mock.calls[0];
		expect(event).toBe("successioninquiry");
		expect(email).toBe("erika@beispiel.de");
		expect(payload).toEqual({
			company: "Muster Messdienst GmbH",
			name: "Erika Musterfrau",
			phone: "+49 30 1234567",
			properties: "100 bis 500",
			timeframe: "in 1 bis 2 Jahren",
			message: "Wir suchen eine Nachfolge für unsere Kunden.",
			page: "/partner/nachfolge",
		});
	});

	it("leaves out an empty phone, choice and message", async () => {
		await post({ phone: "", properties: "", timeframe: "", message: "" });
		expect(send.mock.calls[0][2]).toEqual({
			company: "Muster Messdienst GmbH",
			name: "Erika Musterfrau",
			phone: undefined,
			properties: undefined,
			timeframe: undefined,
			message: undefined,
			page: "/partner/nachfolge",
		});
	});

	it("answers a filled honeypot with success and sends nothing", async () => {
		const result = await post({ website: "https://spam.example" });
		expect(formOf(result).form.message?.type).toBe("success");
		expect(send).not.toHaveBeenCalled();
	});

	it("answers a too fast submission with success and sends nothing", async () => {
		const result = await post({ _t: String(Date.now()) });
		expect(formOf(result).form.message?.type).toBe("success");
		expect(send).not.toHaveBeenCalled();
	});

	it("answers gibberish with success and sends nothing", async () => {
		const result = await post({ name: "wyichtvxKjBGMhTz" });
		expect(formOf(result).form.message?.type).toBe("success");
		expect(send).not.toHaveBeenCalled();
	});

	it("fails with 400 on missing fields, naming each", async () => {
		const result = await post({
			company: "",
			name: "",
			email: "",
			consent: [],
		});
		expect(statusOf(result)).toBe(400);
		expect(Object.keys(formOf(result).form.errors).sort()).toEqual([
			"company",
			"consent",
			"email",
			"name",
		]);
		expect(send).not.toHaveBeenCalled();
	});

	it("reports a failed send with the phone number and keeps the values", async () => {
		send.mockRejectedValueOnce(new Error("500"));
		const result = await post({});
		expect(statusOf(result)).toBe(502);
		const { form } = formOf(result);
		expect(form.message?.type).toBe("error");
		expect(form.message?.text).toContain("+49 30 52001352");
		expect(form.data).toMatchObject({ company: "Muster Messdienst GmbH" });
	});

	it("limits valid inquiries per IP, answering the extra one with success", async () => {
		const from = "10.6.0.1";
		for (let i = 0; i < 4; i++) {
			const result = await post({}, from);
			expect(formOf(result).form.message?.type).toBe("success");
		}
		expect(send).toHaveBeenCalledTimes(3);
	});
});
