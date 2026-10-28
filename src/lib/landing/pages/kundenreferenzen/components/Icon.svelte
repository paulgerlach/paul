<!-- The design's line icons (20×20, stroke 1.6), by name. -->
<script lang="ts">
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";

	export type IconName =
		| "star"
		| "building"
		| "people"
		| "chart"
		| "globe"
		| "search"
		| "prev"
		| "next";

	let { name }: { name: IconName } = $props();
</script>

<StrokeIcon>
	{#if name === "star"}
		<path
			d="M10 2.8l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L2.8 8.1l5-.7z"
		/>
	{:else if name === "building"}
		<path d="M4 17V4h8v13M12 8h4v9M2 17h16M7 7h2M7 10h2M7 13h2" />
	{:else if name === "people"}
		<circle cx="8" cy="7" r="3" /><path
			d="M2.5 17c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5M13.5 4.5a3 3 0 0 1 0 5.6M15.5 12.8c1 .7 1.7 2 2 4.2"
		/>
	{:else if name === "chart"}
		<path d="M3 17h14M6 14V9M10 14V5M14 14v-3" />
	{:else if name === "globe"}
		<circle cx="10" cy="10" r="7" /><path
			d="M3.5 8h4l1.5 2-1 3 1.5 2.5M13 4.2l-1.5 2.3 1.5 2 3.5.3"
		/>
	{:else if name === "search"}
		<circle cx="9" cy="9" r="5.5" /><path d="M13 13l4 4" />
	{:else if name === "prev"}
		<path d="M12 5l-5 5 5 5" />
	{:else if name === "next"}
		<path d="M8 5l5 5-5 5" />
	{/if}
</StrokeIcon>
