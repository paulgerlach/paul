<!-- The design's line icons (20×20, stroke 1.6), by name. -->
<script lang="ts">
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";

	export type IconName = "video" | "calendar" | "lock" | "list" | "clipboard";

	let { name }: { name: IconName } = $props();
</script>

<StrokeIcon>
	{#if name === "video"}
		<rect x="2.5" y="5" width="11" height="10" rx="2" /><path
			d="M13.5 8.5l4-2.5v8l-4-2.5"
		/>
	{:else if name === "calendar"}
		<rect x="3" y="4" width="14" height="13" rx="2" /><path
			d="M3 8h14M7 2.5v3M13 2.5v3"
		/>
	{:else if name === "lock"}
		<rect x="4.5" y="9" width="11" height="8" rx="2" /><path
			d="M7 9V6.5a3 3 0 0 1 6 0V9"
		/>
	{:else if name === "list"}
		<path d="M7 5.5h10M7 10h10M7 14.5h10M3.5 5.5h.01M3.5 10h.01M3.5 14.5h.01" />
	{:else if name === "clipboard"}
		<rect x="4.5" y="3.5" width="11" height="14" rx="2" /><path
			d="M7.5 3.5V2.5h5v1M7.5 9l1.8 1.8L13 7.5M7.5 14h5"
		/>
	{/if}
</StrokeIcon>
