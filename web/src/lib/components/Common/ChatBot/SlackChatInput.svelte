<script lang="ts">
	import { SendHorizontal } from "@lucide/svelte";
	import { getChatContext } from "$lib/chat/context";

	const { slack } = getChatContext();

	function onsubmit(e: SubmitEvent) {
		e.preventDefault();
		void slack.send(slack.input);
	}
</script>

<form {onsubmit} class="flex w-full gap-2">
	<input
		bind:value={slack.input}
		placeholder="Nachricht schreiben..."
		class="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-100 focus:outline-none disabled:opacity-50"
	/>

	<button
		title="Send message"
		type="submit"
		disabled={!slack.input.trim()}
		class="rounded-full bg-dark_green p-3 text-white shadow-lg transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
	>
		<SendHorizontal size={18} />
	</button>
</form>
