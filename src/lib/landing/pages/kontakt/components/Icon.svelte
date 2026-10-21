<!-- The design's line icons (20×20, stroke 1.6), by name. -->
<script lang="ts">
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";

	export type IconName =
		"mail" | "users" | "doc" | "calendar" | "info" | "plug" | "lock";

	let { name }: { name: IconName } = $props();
</script>

<StrokeIcon>
	{#if name === "mail"}
		<rect x="2.5" y="4.5" width="15" height="11" rx="2" /><path
			d="M3 5.5l7 5.5 7-5.5"
		/>
	{:else if name === "users"}
		<circle cx="8" cy="7" r="3" /><path
			d="M2.5 17c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5M13.5 4.5a3 3 0 0 1 0 5.6M15.5 12.8c1 .7 1.7 2 2 4.2"
		/>
	{:else if name === "doc"}
		<path d="M5 2.5h7l3.5 3.5v11.5H5z" /><path
			d="M12 2.5V6h3.5M8 10h5M8 13h5"
		/>
	{:else if name === "calendar"}
		<rect x="3" y="4" width="14" height="13" rx="2" /><path
			d="M3 8h14M7 2.5v3M13 2.5v3"
		/>
	{:else if name === "info"}
		<circle cx="10" cy="10" r="7" /><path d="M10 9v5M10 6.2v.1" />
	{:else if name === "plug"}
		<path d="M7 2.5v4M13 2.5v4M5 6.5h10v3a5 5 0 0 1-10 0zM10 14.5v3" />
	{:else if name === "lock"}
		<rect x="4.5" y="9" width="11" height="8" rx="2" /><path
			d="M7 9V6.5a3 3 0 0 1 6 0V9"
		/>
	{/if}
</StrokeIcon>
