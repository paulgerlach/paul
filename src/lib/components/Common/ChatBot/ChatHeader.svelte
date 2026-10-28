<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import { caract_mind, max_chat_avatar } from "$lib/assets/icons";
	import { getChatContext } from "$lib/chat/context";

	let {
		headerText,
		subHeaderText,
	}: { headerText: string; subHeaderText: string } = $props();
	const { slack } = getChatContext();
</script>

<div class="flex justify-center pb-4">
	<div
		class="animate-from-left flex w-auto flex-row items-center justify-center gap-2 rounded-full bg-white px-4 py-2 shadow-md"
	>
		<div class="relative">
			<div
				class={[
					slack.isOutOfOffice ? "bg-orange-700" : "bg-green-700",
					"absolute -top-1 -right-1 h-4 w-4 rounded-full",
				]}
			></div>
			{#if slack.isOutOfOffice}
				<Image
					alt="chat avatar"
					src={caract_mind}
					width={30}
					height={30}
					class="rounded-full"
				/>
			{:else}
				<Image
					alt="chat avatar"
					src={max_chat_avatar}
					width={40}
					height={40}
					class="rounded-full"
				/>
			{/if}
		</div>
		<div class="text-center text-lg">
			<p class="text-sm font-semibold">{headerText}</p>
			<p class="text-xs text-gray-400">{subHeaderText}</p>
		</div>
	</div>
</div>
