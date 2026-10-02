<script lang="ts">
	import { getChatContext } from "$lib/chat/context";

	const chat = getChatContext();
</script>

<div class="mb-2 rounded-lg bg-gray-100 p-3 text-sm text-gray-600">
	<div class="flex items-center justify-between">
		<span>Angemeldet als: <strong>{chat.anonymousUserEmail}</strong></span>
		<button
			onclick={chat.clearSessionEmail}
			class="ml-2 text-xs text-red-600 underline hover:text-red-800"
			title="Andere E-Mail verwenden"
		>
			Ändern
		</button>
	</div>
</div>
