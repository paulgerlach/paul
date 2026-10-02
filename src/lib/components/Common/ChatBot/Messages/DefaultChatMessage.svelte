<script lang="ts">
	import { getChatContext } from "$lib/chat/context";
	import Avatar from "./Avatar.svelte";

	const chat = getChatContext();
</script>

<div class="flex items-center justify-start gap-2">
	<div><Avatar /></div>
	<div class="max-w-[85%] rounded-2xl bg-white px-4 py-2 text-gray-600">
		{chat.isChatStarted && chat.anonymousUserEmail
			? `Hallo! Wie kann ich Ihnen heute helfen, ${chat.anonymousUserEmail.split("@")[0]}?`
			: "Hallo, ich bin Max von Heidi Systems. Gern helfe ich Ihnen bei Fragen rund um digitale Verbrauchserfassung und Abrechnung."}
	</div>
</div>
