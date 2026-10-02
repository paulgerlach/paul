<script lang="ts">
	import "./AIChatBot.css";
	import type { ChatState } from "$lib/chat/chatState.svelte";
	import { setChatContext } from "$lib/chat/context";
	import { clickOutside } from "$lib/attachments/clickOutside";
	import ChatHeader from "./ChatHeader.svelte";
	import AiMessagesContainer from "./Messages/AiMessagesContainer.svelte";
	import SlackMessagesContainer from "./Messages/SlackMessagesContainer.svelte";
	import VisitorEmailFormContainer from "./VisitorEmailFormContainer.svelte";

	let { chat, onclose }: { chat: ChatState; onclose: () => void } = $props();

	// The instance never changes, so capturing the initial prop is intended
	// svelte-ignore state_referenced_locally
	setChatContext(chat);

	// Slack polling only runs while the panel is open
	$effect(() => {
		chat.slack.active = true;
		return () => (chat.slack.active = false);
	});
</script>

<div class="chat-window opacity-[95%]!" {@attach clickOutside(onclose)}>
	<div
		class="animate-from-right relative flex h-[100vh] max-w-full flex-col rounded-md bg-slate-100 p-4 shadow-lg"
	>
		<button
			type="button"
			aria-label="Chat minimieren"
			onclick={onclose}
			class="absolute h-4 w-4 cursor-pointer self-end transition ease-in-out hover:-translate-y-1"
		>
			<svg
				class="block h-4 w-4"
				viewBox="0 0 512 512"
				fill="currentColor"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M480 480H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h448c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
				/>
			</svg>
		</button>
		<ChatHeader headerText="Kundenservice" subHeaderText="Max Sommerfeld" />
		{#if chat.isSlackChat}
			<SlackMessagesContainer />
		{:else}
			<AiMessagesContainer />
		{/if}
		{#if !chat.isChatStarted && !chat.isExistingClient && !chat.anonymousUserEmail}
			<VisitorEmailFormContainer />
		{/if}
	</div>
</div>
