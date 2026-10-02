import { Chat } from "@ai-sdk/svelte";
import { DefaultChatTransport } from "ai";
import { SlackChat } from "./slackChat.svelte";

const EMAIL_KEY = "anonymousUserEmail";

/**
 * Everything the chat widget remembers between openings. Created on the first
 * open (client only) and kept by the launcher, so closing the panel loses
 * nothing.
 */
export class ChatState {
	slack: SlackChat;
	ai = new Chat({ transport: new DefaultChatTransport({ api: "/api/chat" }) });
	/** Slack inside office hours, AI outside (KI-22) */
	isSlackChat = $state(true);
	anonymousUserEmail = $state("");
	isChatStarted = $state(false);

	constructor(
		readonly isExistingClient: boolean,
		userId?: string,
	) {
		this.slack = new SlackChat(userId);
		this.isSlackChat = !this.slack.isOutOfOffice;
		this.anonymousUserEmail = sessionStorage.getItem(EMAIL_KEY) ?? "";
		this.isChatStarted = !!this.anonymousUserEmail;
		void this.slack.restore();
	}

	toggleChatType = () => {
		this.isSlackChat = !this.isSlackChat;
	};

	startWithEmail(email: string) {
		sessionStorage.setItem(EMAIL_KEY, email);
		this.isChatStarted = true;
		this.isSlackChat = true;
		this.anonymousUserEmail = email;
	}

	/** "Andere E-Mail verwenden": also forgets the Slack thread (KI-23). */
	clearSessionEmail = () => {
		sessionStorage.removeItem(EMAIL_KEY);
		this.slack.reset();
		this.anonymousUserEmail = "";
		this.isChatStarted = false;
	};

	destroy() {
		this.slack.destroy();
	}
}
