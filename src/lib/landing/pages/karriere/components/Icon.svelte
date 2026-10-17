<!-- One of the design's 20×20 line icons, by name (its `IC` map). -->
<script lang="ts">
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";
	import type { IconName } from "../icons";

	let { name, class: className = "" }: { name: IconName; class?: string } =
		$props();
</script>

<StrokeIcon class={className}>
	{#if name === "hkv"}
		<rect x="5" y="2.5" width="10" height="15" rx="2" /><path
			d="M7.5 5.5h5v3h-5zM8 12h4M8 14.5h4"
		/>
	{:else if name === "signal"}
		<path
			d="M3 8a10 10 0 0 1 14 0M5.5 10.8a6.5 6.5 0 0 1 9 0M8 13.6a3 3 0 0 1 4 0"
		/><circle cx="10" cy="16" r=".8" fill="currentColor" />
	{:else if name === "file"}
		<path d="M5 2.5h7l3.5 3.5v11.5H5z" /><path
			d="M12 2.5V6h3.5M8 10h5M8 13h5"
		/>
	{:else if name === "users"}
		<circle cx="8" cy="7" r="3" /><path
			d="M2.5 17c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5M13.5 4.5a3 3 0 0 1 0 5.6M15.5 12.8c1 .7 1.7 2 2 4.2"
		/>
	{:else if name === "chart"}
		<path d="M3 17h14M6 14V9M10 14V5M14 14v-3" />
	{:else if name === "tool"}
		<path
			d="M12.5 3.5a4 4 0 0 0-4.9 5.2L3 13.3 5.7 16l4.6-4.6a4 4 0 0 0 5.2-4.9l-2.4 2.4-2.2-.6-.6-2.2z"
		/>
	{:else if name === "bell"}
		<path
			d="M5 14V9a5 5 0 0 1 10 0v5l1.5 1.5h-13zM8.5 17.5a1.6 1.6 0 0 0 3 0"
		/>
	{:else if name === "server"}
		<rect x="3" y="3.5" width="14" height="5" rx="1.5" /><rect
			x="3"
			y="11.5"
			width="14"
			height="5"
			rx="1.5"
		/><path d="M6 6h.01M6 14h.01" />
	{:else if name === "phone"}
		<path
			d="M5 3h3l1.5 4-2 1.2a9 9 0 0 0 4.3 4.3l1.2-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A14 14 0 0 1 3.5 4.6 1.5 1.5 0 0 1 5 3z"
		/>
	{:else if name === "building"}
		<path d="M4 17V4h8v13M12 8h4v9M2 17h16M7 7h2M7 10h2M7 13h2" />
	{:else if name === "cal"}
		<rect x="3" y="4" width="14" height="13" rx="2" /><path
			d="M3 8h14M7 2.5v3M13 2.5v3"
		/>
	{:else if name === "bolt"}
		<path d="M11 2.5L4.5 11h5l-1 6.5L15.5 9h-5z" />
	{/if}
</StrokeIcon>
