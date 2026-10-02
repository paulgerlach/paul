<script lang="ts">
	import type { Snippet } from "svelte";

	let {
		desktopComponent,
		mobileComponent,
	}: { desktopComponent: Snippet; mobileComponent: Snippet } = $props();

	// Undefined during SSR, so the server renders the desktop variant (as in Next).
	let innerWidth = $state<number>();
	const isMobile = $derived(innerWidth !== undefined && innerWidth <= 768);
</script>

<svelte:window bind:innerWidth />

{#if isMobile}
	{@render mobileComponent()}
{:else}
	{@render desktopComponent()}
{/if}
