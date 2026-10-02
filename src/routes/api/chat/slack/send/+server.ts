import { json } from "@sveltejs/kit";
import { z } from "zod";
import { env } from "$env/dynamic/private";
import { slackPost } from "$lib/server/slack";
import type { RequestHandler } from "./$types";

const sendSchema = z.object({
	message: z.string().trim().min(1).max(4000),
	threadTs: z
		.string()
		.regex(/^\d+\.\d+$/)
		.nullable(),
});

/** Posts a visitor message to the support channel, starting a thread if needed. */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const parsed = sendSchema.safeParse(await request.json());
		if (!parsed.success) {
			return json({ error: "Invalid message" }, { status: 400 });
		}
		const { message, threadTs } = parsed.data;

		const res = await slackPost<{ ts: string }>("chat.postMessage", {
			channel: env.SLACK_CHANNEL_ID,
			text: message,
			thread_ts: threadTs ?? undefined,
			unfurl_links: false,
		});
		if (!res.ok) {
			console.error("Slack error:", res);
			throw new Error("Slack chat.postMessage failed");
		}

		// `ts` is the parent thread; `messageTs` is the message just posted
		return json({ ts: threadTs ?? res.ts, messageTs: res.ts });
	} catch (error) {
		console.error("Error sending Slack message:", error);
		return json({ error: "Failed to send message" }, { status: 500 });
	}
};
