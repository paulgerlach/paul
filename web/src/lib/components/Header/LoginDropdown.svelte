<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import { login } from "$lib/assets/icons";
	import { LOGIN_URL } from "./navGroups";

	let {
		class: className = "",
		isMobile = false,
	}: { class?: string; isMobile?: boolean } = $props();
</script>

{#if isMobile}
	<a
		href={LOGIN_URL}
		target="_blank"
		rel="noopener noreferrer"
		class="flex min-h-12 w-full items-center justify-center gap-2 rounded-halfbase border-2 border-green bg-white p-4 text-lg text-dark_text transition hover:opacity-80"
	>
		<Image
			width={20}
			height={20}
			class="max-h-5 max-w-5"
			style="width: 100%; height: auto"
			src={login}
			alt="login"
		/>
		Einloggen
	</a>
{:else}
	<!-- Desktop version - direct link -->
	<a
		href={LOGIN_URL}
		target="_blank"
		rel="noopener noreferrer"
		class="flex items-center justify-center gap-1.5 p-2 text-base text-dark_text transition hover:opacity-80 max-xl:text-sm {className}"
	>
		<Image
			width={16}
			height={16}
			class="max-h-4 max-w-4"
			style="width: 100%; height: auto"
			src={login}
			alt="login"
		/>
		Einloggen
	</a>
{/if}
