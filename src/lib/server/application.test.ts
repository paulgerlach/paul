import type { RequestEvent } from "@sveltejs/kit";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { handleApplication } from "./application";
import { sendWebhookEventOrThrow } from "./webhooks";

vi.mock("./webhooks", () => ({ sendWebhookEventOrThrow: vi.fn() }));
const send = vi.mocked(sendWebhookEventOrThrow);

let ip = 0;

/** A form post from a new IP each time, so the rate limit doesn't interfere. */
function post(fields: Record<string, string>) {
	const body = new FormData();
	const all = {
		role: "frontend-engineer",
		name: "Max Mustermann",
		email: "max@beispiel.de",
		link: "https://github.com/max",
		message: "Ich baue gerne Oberflächen.",
		website: "",
		_t: String(Date.now() - 10_000),
		...fields,
	};
	for (const [key, value] of Object.entries(all)) body.set(key, value);
	const event = {
		request: new Request("http://localhost/karriere", {
			method: "POST",
			body,
		}),
		getClientAddress: () => `10.0.0.${++ip}`,
	} as unknown as RequestEvent;
	return handleApplication(event, { page: "/karriere" });
}

/** The status of a `fail()` / error `message()`, or 200. */
const statusOf = (result: unknown) =>
	(result as { status?: number }).status ?? 200;
const formOf = (result: unknown) =>
	((result as { data?: unknown }).data ?? result) as {
		form: { message?: { type: string; text: string }; data: object };
	};

describe("handleApplication", () => {
	beforeEach(() => send.mockReset());

	it("sends the application without the spam fields", async () => {
		const result = await post({});
		expect(statusOf(result)).toBe(200);
		expect(formOf(result).form.message).toEqual({
			type: "success",
			text: "Ihre Bewerbung als „Frontend Engineer (SvelteKit, TypeScript)“ ist angekommen. Wir melden uns bei Ihnen.",
		});
		expect(send).toHaveBeenCalledOnce();
		const [event, email, payload] = send.mock.calls[0];
		expect(event).toBe("jobapplication");
		expect(email).toBe("max@beispiel.de");
		expect(payload).toEqual({
			role: "frontend-engineer",
			role_title: "Frontend Engineer (SvelteKit, TypeScript)",
			name: "Max Mustermann",
			link: "https://github.com/max",
			message: "Ich baue gerne Oberflächen.",
			page: "/karriere",
		});
	});

	it("leaves out an empty link and message", async () => {
		await post({ role: "initiative", link: "", message: "" });
		expect(send.mock.calls[0][2]).toMatchObject({
			role: "initiative",
			role_title: "Initiativbewerbung",
			link: undefined,
			message: undefined,
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

	it("fails with 400 on invalid input", async () => {
		const result = await post({ name: "", email: "max" });
		expect(statusOf(result)).toBe(400);
		expect(send).not.toHaveBeenCalled();
	});

	it("reports a failed send with the fallback address and keeps the values", async () => {
		send.mockRejectedValueOnce(new Error("500"));
		const result = await post({});
		expect(statusOf(result)).toBe(502);
		const { form } = formOf(result);
		expect(form.message?.type).toBe("error");
		expect(form.message?.text).toContain("jobs@heidisystems.com");
		expect(form.data).toMatchObject({ name: "Max Mustermann" });
	});
});
