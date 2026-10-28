<!-- One of the design's 20×20 line icons on /hilfe, by name. -->
<script lang="ts">
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";
	import type { IconName } from "../icons";

	let { name, class: className = "" }: { name: IconName; class?: string } =
		$props();
</script>

<StrokeIcon class={className}>
	{#if name === "info"}
		<circle cx="10" cy="10" r="7" /><path d="M10 9v5M10 6.2v.1" />
	{:else if name === "search"}
		<circle cx="9" cy="9" r="5.5" /><path d="M13 13l4 4" />
	{:else if name === "swap"}
		<path d="M4 7h12M13 4l3 3-3 3M16 13H4M7 10l-3 3 3 3" />
	{:else if name === "tool"}
		<path
			d="M12.5 3.5a4 4 0 0 0-4.9 5.2L3 13.3 5.7 16l4.6-4.6a4 4 0 0 0 5.2-4.9l-2.4 2.4-2.2-.6-.6-2.2z"
		/>
	{:else if name === "signal"}
		<path
			d="M3 8a10 10 0 0 1 14 0M5.5 10.8a6.5 6.5 0 0 1 9 0M8 13.6a3 3 0 0 1 4 0"
		/><circle cx="10" cy="16" r=".8" fill="currentColor" />
	{:else if name === "file"}
		<path d="M5 2.5h7l3.5 3.5v11.5H5z" /><path
			d="M12 2.5V6h3.5M8 10h5M8 13h5"
		/>
	{:else if name === "server"}
		<rect x="3" y="3.5" width="14" height="5" rx="1.5" /><rect
			x="3"
			y="11.5"
			width="14"
			height="5"
			rx="1.5"
		/><path d="M6 6h.01M6 14h.01" />
	{:else if name === "users"}
		<circle cx="8" cy="7" r="3" /><path
			d="M2.5 17c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5M13.5 4.5a3 3 0 0 1 0 5.6M15.5 12.8c1 .7 1.7 2 2 4.2"
		/>
	{/if}
</StrokeIcon>
