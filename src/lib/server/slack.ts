import { env } from "$env/dynamic/private";

/**
 * Calls a Slack Web API method. `conversations.replies` and
 * `chat.postMessage` take form-encoded bodies; `undefined` values are dropped.
 * Throws on HTTP errors; Slack's own `ok: false` is left to the caller.
 */
export async function slackPost<T = Record<string, unknown>>(
	method: string,
	body: Record<string, string | number | boolean | undefined>,
): Promise<T & { ok: boolean; error?: string }> {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(body)) {
		if (value !== undefined) params.set(key, String(value));
	}

	const res = await fetch(`https://slack.com/api/${method}`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${env.SLACK_BOT_TOKEN}`,
			"Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
		},
		body: params,
		signal: AbortSignal.timeout(10_000),
	});
	if (!res.ok) throw new Error(`Slack ${method} failed: HTTP ${res.status}`);
	return res.json();
}
