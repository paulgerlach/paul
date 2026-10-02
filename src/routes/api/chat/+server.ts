import { error } from "@sveltejs/kit";
import {
	convertToModelMessages,
	createGateway,
	streamText,
	type UIMessage,
} from "ai";
import { env } from "$env/dynamic/private";
import { salesPersona } from "$lib/server/ai/personas";
import type { Config } from "@sveltejs/adapter-vercel";
import type { RequestHandler } from "./$types";

// Allow streaming responses up to 30 seconds
export const config: Config = { maxDuration: 30 };

const MODEL = "xai/grok-4.1-fast-reasoning";

export const POST: RequestHandler = async ({ request }) => {
	const { messages }: { messages: UIMessage[] } = await request.json();
	if (!Array.isArray(messages)) error(400, "messages must be an array");

	// On Vercel the AI Gateway authenticates through OIDC. Locally Vite doesn't
	// put .env into process.env, so the key has to be passed explicitly.
	const model = env.AI_GATEWAY_API_KEY
		? createGateway({ apiKey: env.AI_GATEWAY_API_KEY })(MODEL)
		: MODEL;

	const result = streamText({
		model,
		system: salesPersona,
		messages: await convertToModelMessages(messages),
	});

	return result.toUIMessageStreamResponse();
};
