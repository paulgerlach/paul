<script lang="ts">
	import type { UIMessage } from "ai";
	import ChatMarkdown from "../ChatMarkdown.svelte";
	import Avatar from "./Avatar.svelte";

	let { message }: { message: UIMessage } = $props();
	const isUser = $derived(message.role === "user");
</script>

<div class={["flex gap-2", isUser ? "justify-end" : "justify-start"]}>
	{#if !isUser}
		<div><Avatar /></div>
	{/if}
	<div
		class={[
			"max-w-[85%] rounded-2xl px-4 py-2",
			isUser
				? "rounded-br-sm bg-dark_green text-white"
				: "rounded-bl-sm bg-white text-gray-700",
		]}
	>
		{#each message.parts as part, i (i)}
			{#if part.type === "text"}
				<div class="break-words"><ChatMarkdown md={part.text} /></div>
			{/if}
		{/each}
	</div>
</div>
