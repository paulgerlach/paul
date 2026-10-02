<script lang="ts">
	import FragebogenHeader from "$lib/components/Header/FragebogenHeader.svelte";
	import ChatBot from "$lib/components/Common/ChatBot/ChatBot.svelte";

	let { children } = $props();
</script>

<FragebogenHeader />
{@render children()}
<ChatBot isExistingClient={false} />
