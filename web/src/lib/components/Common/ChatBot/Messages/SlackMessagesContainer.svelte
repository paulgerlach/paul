<script lang="ts">
	import { getChatContext } from "$lib/chat/context";
	import { scrollToBottom } from "$lib/attachments/scrollToBottom.svelte";
	import BrainCircuitIcon from "../BrainCircuitIcon.svelte";
	import SlackChatInput from "../SlackChatInput.svelte";
	import TriangleSpinner from "../TriangleSpinner.svelte";
	import Avatar from "./Avatar.svelte";
	import SlackMessage from "./SlackMessage.svelte";

	const chat = getChatContext();
	const { slack } = chat;
	// Polls don't show the spinner (Next flashed it every 2s); waiting for a
	// human reply doesn't either
	const loading = $derived(
		slack.status === "sending" || slack.status === "fetching_messages",
	);
</script>

<div class="animate-from-right flex min-h-0 w-full flex-1 flex-col">
	<div
		class="flex h-full max-h-full w-full flex-col items-start justify-start gap-3 overflow-scroll border-gray-200 pt-4"
		{@attach scrollToBottom(() => [slack.messages.length, loading])}
	>
		{#if slack.messages.length === 0 && slack.status === "ready"}
			<div class="flex items-center justify-end gap-2">
				<Avatar />
				<div class="max-w-[85%] rounded-2xl bg-white px-4 py-2 text-gray-600">
					Hallo, ich bin Max von Heidi Systems. Gern helfe ich Ihnen bei Fragen
					rund um digitale Verbrauchserfassung und Abrechnung.
				</div>
			</div>
		{/if}
		{#each slack.messages as message, i (message.id ?? `pending-${i}`)}
			<SlackMessage {message} />
		{/each}
		{#if loading}
			<div class="flex flex-row items-center justify-center">
				<TriangleSpinner size={28} />
				{slack.status === "sending"
					? "Nachricht senden"
					: "Nachrichten laden..."}
			</div>
		{/if}
	</div>
	<div
		class="flex w-full flex-col items-start justify-center gap-3 border-gray-200 pt-4"
	>
		<button
			title="Send message"
			onclick={chat.toggleChatType}
			class="cursor-pointer rounded-full bg-dark_green p-2 text-white shadow-lg transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
		>
			<BrainCircuitIcon class="h-[30px] w-[30px] text-white" />
		</button>
		<SlackChatInput />
	</div>
</div>
