<!-- The design's line icons (20×20, stroke 1.6), by name. -->
<script lang="ts">
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";

	export type IconName = "spark" | "list" | "clock" | "check";

	let { name }: { name: IconName } = $props();
</script>

<StrokeIcon>
	{#if name === "spark"}
		<path
			d="M10 2.5l1.6 4.4 4.4 1.6-4.4 1.6L10 14.5l-1.6-4.4L4 8.5l4.4-1.6zM15.5 13.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"
		/>
	{:else if name === "list"}
		<path d="M7 5.5h10M7 10h10M7 14.5h10M3.5 5.5h.01M3.5 10h.01M3.5 14.5h.01" />
	{:else if name === "clock"}
		<circle cx="10" cy="10" r="7" /><path d="M10 6v4l3 2" />
	{:else if name === "check"}
		<path d="M5 10.5l3.2 3L15 7" />
	{/if}
</StrokeIcon>
