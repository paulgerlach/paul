import type { RequestEvent } from "@sveltejs/kit";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { handleHelpFeedback } from "./helpFeedback";
import { sendWebhookEvent } from "./webhooks";

vi.mock("./webhooks", () => ({ sendWebhookEvent: vi.fn() }));
const send = vi.mocked(sendWebhookEvent);

let ip = 0;

function post(fields: Record<string, string>, address = `10.1.0.${++ip}`) {
	const body = new FormData();
	for (const [key, value] of Object.entries(fields)) body.set(key, value);
	const event = {
		request: new Request("http://localhost/hilfe?/feedback", {
			method: "POST",
			body,
		}),
		getClientAddress: () => address,
	} as unknown as RequestEvent;
	return handleHelpFeedback(event, { page: "/hilfe" });
}

const messageOf = (result: unknown) =>
	(result as { form: { message?: unknown } }).form.message;

describe("handleHelpFeedback", () => {
	beforeEach(() => send.mockReset());

	it("sends a valid vote without an email", async () => {
		const result = await post({ question: "uvi", vote: "yes" });
		expect(messageOf(result)).toEqual({ type: "success", question: "uvi" });
		expect(send).toHaveBeenCalledExactlyOnceWith("helpfeedback", null, {
			question: "uvi",
			vote: "yes",
			page: "/hilfe",
		});
	});

	it("thanks for an unknown id and sends nothing", async () => {
		const result = await post({ question: "gibt-es-nicht", vote: "no" });
		expect(messageOf(result)).toMatchObject({ type: "success" });
		expect(send).not.toHaveBeenCalled();
	});

	it("thanks over the rate limit and sends nothing more", async () => {
		const address = "10.2.0.1";
		for (let i = 0; i < 20; i++)
			await post({ question: "monteure", vote: "no" }, address);
		expect(send).toHaveBeenCalledTimes(20);
		const result = await post({ question: "monteure", vote: "no" }, address);
		expect(messageOf(result)).toEqual({
			type: "success",
			question: "monteure",
		});
		expect(send).toHaveBeenCalledTimes(20);
	});
});
