<!-- One of the design's 20×20 line icons on /mieterportal, by name. -->
<script lang="ts">
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";
	import type { IconName } from "../icons";

	let { name, class: className = "" }: { name: IconName; class?: string } =
		$props();
</script>

<StrokeIcon class={className}>
	{#if name === "chart"}
		<path d="M3 17h14M6 14V9M10 14V5M14 14v-3" />
	{:else if name === "doc"}
		<path d="M5 2.5h7l3.5 3.5v11.5H5z" /><path
			d="M12 2.5V6h3.5M8 10h5M8 13h5"
		/>
	{:else if name === "users"}
		<circle cx="8" cy="7" r="3" /><path
			d="M2.5 17c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5M13.5 4.5a3 3 0 0 1 0 5.6M15.5 12.8c1 .7 1.7 2 2 4.2"
		/>
	{:else if name === "bell"}
		<path
			d="M5 14V9a5 5 0 0 1 10 0v5l1.5 1.5h-13zM8.5 17.5a1.6 1.6 0 0 0 3 0"
		/>
	{:else if name === "trend"}
		<path d="M3 14l4.5-4.5 3 3L17 6M12.5 6H17v4.5" />
	{/if}
</StrokeIcon>
