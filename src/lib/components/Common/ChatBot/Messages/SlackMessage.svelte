<script lang="ts">
	import type { SlackMessage } from "$lib/chat/types";
	import { getChatContext } from "$lib/chat/context";
	import ChatMarkdown from "../ChatMarkdown.svelte";
	import SupportAgentIcon from "../SupportAgentIcon.svelte";
	import TriangleSpinner from "../TriangleSpinner.svelte";
	import Avatar from "./Avatar.svelte";

	let { message }: { message: SlackMessage } = $props();
	const { slack } = getChatContext();
	// Messages sent from the website are posted by the bot
	const isUser = $derived(message.role === "assistant");
</script>

<div class={["flex w-full gap-2", isUser ? "justify-end" : "justify-start"]}>
	{#if !isUser}
		<div>
			{#if slack.isOutOfOffice}
				<SupportAgentIcon class="h-[30px] w-[30px] text-white" />
			{:else}
				<Avatar />
			{/if}
		</div>
	{/if}
	<div
		class={[
			"max-w-[85%] rounded-2xl px-4 py-2",
			isUser
				? "rounded-br-sm bg-dark_green text-white"
				: "rounded-bl-sm bg-white text-gray-700",
		]}
	>
		<ChatMarkdown md={message.text} />
	</div>
	{#if !message.id}
		<div class="flex flex-row items-center justify-center">
			<TriangleSpinner size={14} />
		</div>
	{/if}
</div>
