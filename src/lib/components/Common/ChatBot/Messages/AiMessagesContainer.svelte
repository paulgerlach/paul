<script lang="ts">
	import { getChatContext } from "$lib/chat/context";
	import { scrollToBottom } from "$lib/attachments/scrollToBottom.svelte";
	import AIChatInput from "../AIChatInput.svelte";
	import AnonymousChatBanner from "../AnonymousChatBanner.svelte";
	import SupportAgentIcon from "../SupportAgentIcon.svelte";
	import DefaultChatMessage from "./DefaultChatMessage.svelte";
	import LoadingMessage from "./LoadingMessage.svelte";
	import Message from "./Message.svelte";

	const chat = getChatContext();
	const { ai } = chat;
	const busy = $derived(ai.status === "submitted" || ai.status === "streaming");
</script>

<div class="animate-from-right flex min-h-0 flex-1 flex-col">
	<div
		class="h-full max-h-full flex-1 overflow-scroll overflow-y-auto pb-4"
		{@attach scrollToBottom(() => [
			ai.messages.length,
			ai.messages.at(-1)?.parts.length,
			busy,
		])}
	>
		<div class="flex flex-col gap-3">
			{#if chat.isChatStarted && chat.anonymousUserEmail && !chat.isExistingClient}
				<AnonymousChatBanner />
			{/if}

			{#if ai.messages.length === 0}
				<DefaultChatMessage />
			{/if}

			{#each ai.messages as message (message.id)}
				<Message {message} />
			{/each}

			{#if busy}
				<LoadingMessage />
			{/if}
		</div>
	</div>

	<div
		class="flex w-full flex-col items-start justify-center gap-3 border-gray-200 pt-4"
	>
		<button
			title="Send message"
			onclick={chat.toggleChatType}
			class="cursor-pointer rounded-full bg-dark_green p-2 text-white shadow-lg transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
		>
			<SupportAgentIcon size={30} class="text-white" />
		</button>

		<!-- Clear session button for anonymous users -->
		{#if !chat.isExistingClient && chat.isChatStarted}
			<div class="mb-2 flex w-full justify-end">
				<button
					onclick={chat.clearSessionEmail}
					class="text-xs text-gray-600 underline hover:text-red-600"
					title="Chat mit anderer E-Mail fortsetzen"
				>
					Andere E-Mail verwenden
				</button>
			</div>
		{/if}

		<AIChatInput />
	</div>
</div>
