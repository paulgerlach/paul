import { json } from "@sveltejs/kit";
import { z } from "zod";
import { env } from "$env/dynamic/private";
import { slackPost } from "$lib/server/slack";
import type { SlackMessage } from "$lib/chat/types";
import type { RequestHandler } from "./$types";

const messagesSchema = z.object({
	threadTs: z.string().regex(/^\d+\.\d+$/),
});

type SlackReply = { ts: string; bot_id?: string; text?: string };

/** Returns every message in a support thread. */
export const POST: RequestHandler = async ({ request }) => {
	const parsed = messagesSchema.safeParse(
		await request.json().catch(() => null),
	);
	if (!parsed.success) return json({ messages: [] });

	try {
		const res = await slackPost<{ messages?: SlackReply[] }>(
			"conversations.replies",
			{
				channel: env.SLACK_CHANNEL_ID,
				ts: parsed.data.threadTs,
				inclusive: true,
			},
		);
		if (!res.ok) {
			console.error("Slack error:", res);
			return json({ messages: [] });
		}

		const messages: SlackMessage[] = (res.messages ?? []).map((msg) => ({
			id: msg.ts,
			role: msg.bot_id ? "assistant" : "human_reply",
			text: msg.text ?? "",
			timestamp: new Date(Number(msg.ts) * 1000),
		}));
		return json({ messages });
	} catch (error) {
		console.error("Error fetching Slack thread:", error);
		return json({ messages: [] });
	}
};
