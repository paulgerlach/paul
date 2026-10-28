<script lang="ts">
	import { SendHorizontal, Square } from "@lucide/svelte";
	import { getChatContext } from "$lib/chat/context";

	const { ai } = getChatContext();
	let input = $state("");
	const busy = $derived(ai.status === "submitted" || ai.status === "streaming");
	// Next stayed disabled forever after an error; allow a retry
	const canType = $derived(ai.status === "ready" || ai.status === "error");

	function onsubmit(e: SubmitEvent) {
		e.preventDefault();
		if (input.trim()) {
			void ai.sendMessage({ text: input });
			input = "";
		}
	}
</script>

<form {onsubmit} class="flex w-full gap-2">
	<input
		bind:value={input}
		disabled={!canType}
		placeholder="Nachricht schreiben..."
		class="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-100 focus:outline-none disabled:opacity-50"
	/>

	{#if busy}
		<button
			title="Stop generation"
			type="button"
			onclick={() => ai.stop()}
			class="cursor-pointer rounded-full bg-white p-3 shadow-lg transition-colors hover:bg-gray-100"
		>
			<Square class="text-green-600" size={18} />
		</button>
	{:else}
		<button
			title="Send message"
			type="submit"
			disabled={!canType || !input.trim()}
			class="rounded-full bg-dark_green p-3 text-white shadow-lg transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
		>
			<SendHorizontal size={18} />
		</button>
	{/if}
</form>
