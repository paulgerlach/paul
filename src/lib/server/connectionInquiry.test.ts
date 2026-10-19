import type { RequestEvent } from "@sveltejs/kit";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { handleConnectionInquiry } from "./connectionInquiry";
import { sendWebhookEventOrThrow } from "./webhooks";

vi.mock("./webhooks", () => ({ sendWebhookEventOrThrow: vi.fn() }));
const send = vi.mocked(sendWebhookEventOrThrow);

let ip = 0;

/** A form post, from a new IP each time unless `from` is given. */
function post(
	fields: Record<string, string | string[]>,
	from = `10.9.0.${++ip}`,
) {
	const body = new FormData();
	const all: Record<string, string | string[]> = {
		company: "Muster Software GmbH",
		name: "Erika Musterfrau",
		email: "erika@beispiel.de",
		software: "CRM",
		message: "Verbräuche und Dokumente",
		consent: "on",
		website: "",
		_t: String(Date.now() - 10_000),
		...fields,
	};
	for (const [key, value] of Object.entries(all))
		for (const v of Array.isArray(value) ? value : [value]) body.append(key, v);
	const event = {
		request: new Request("http://localhost/partnerschaften?/connection", {
			method: "POST",
			body,
		}),
		getClientAddress: () => from,
	} as unknown as RequestEvent;
	return handleConnectionInquiry(event, { page: "/partnerschaften" });
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

describe("handleConnectionInquiry", () => {
	beforeEach(() => send.mockReset());

	it("sends the inquiry without the spam fields", async () => {
		const result = await post({});
		expect(statusOf(result)).toBe(200);
		expect(formOf(result).form.message).toEqual({
			type: "success",
			text: "Danke für Ihre Anfrage.",
		});
		expect(send).toHaveBeenCalledOnce();
		const [event, email, payload] = send.mock.calls[0];
		expect(event).toBe("connectioninquiry");
		expect(email).toBe("erika@beispiel.de");
		expect(payload).toEqual({
			company: "Muster Software GmbH",
			name: "Erika Musterfrau",
			software: "CRM",
			message: "Verbräuche und Dokumente",
			page: "/partnerschaften",
		});
	});

	it("leaves out an empty message", async () => {
		await post({ message: "" });
		expect(send.mock.calls[0][2]).toEqual({
			company: "Muster Software GmbH",
			name: "Erika Musterfrau",
			software: "CRM",
			message: undefined,
			page: "/partnerschaften",
		});
	});

	it("answers with its own form id, apart from the contact form's", async () => {
		const result = await post({});
		expect((formOf(result).form as { id?: string }).id).toBe("connection");
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
			software: "",
			consent: [],
		});
		expect(statusOf(result)).toBe(400);
		expect(Object.keys(formOf(result).form.errors).sort()).toEqual([
			"company",
			"consent",
			"email",
			"name",
			"software",
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
		expect(form.data).toMatchObject({ company: "Muster Software GmbH" });
	});

	it("limits valid inquiries per IP, answering the extra one with success", async () => {
		const from = "10.10.0.1";
		for (let i = 0; i < 4; i++) {
			const result = await post({}, from);
			expect(formOf(result).form.message?.type).toBe("success");
		}
		expect(send).toHaveBeenCalledTimes(3);
	});
});
