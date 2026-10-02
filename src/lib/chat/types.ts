export type SlackMessage = {
	/** Slack `ts`. Missing on an optimistic message that Slack hasn't confirmed yet. */
	id?: string;
	/**
	 * `assistant`: posted by the bot, i.e. sent from the website by the visitor.
	 * `human_reply`: written by a team member in Slack.
	 */
	role: "user" | "assistant" | "human_reply";
	text: string;
	timestamp: Date;
};
