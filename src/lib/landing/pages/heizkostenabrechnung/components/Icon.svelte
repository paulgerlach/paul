<!-- The design's 20 × 20 line icons (decorative). -->
<script lang="ts" module>
	export type IconName =
		"doc" | "sparkle" | "flame" | "bolt" | "calendar" | "building";
</script>

<script lang="ts">
	let { name, size = 16 }: { name: IconName; size?: number } = $props();
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 20 20"
	fill="none"
	stroke="currentColor"
	stroke-width="1.6"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	{#if name === "doc"}
		<path d="M5 2.5h7l3.5 3.5v11.5H5z" /><path
			d="M12 2.5V6h3.5M8 10h5M8 13h5"
		/>
	{:else if name === "sparkle"}
		<path
			d="M10 2.5l1.6 4.4 4.4 1.6-4.4 1.6L10 14.5l-1.6-4.4L4 8.5l4.4-1.6zM15.5 13.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"
		/>
	{:else if name === "flame"}
		<path
			d="M10 2.5c.5 3 4.5 4.6 4.5 9a4.5 4.5 0 0 1-9 0c0-2.2 1.2-3.6 2.3-4.6.3 1.6 1 2.4 2 2.8C9.4 7.6 9.3 5 10 2.5z"
		/>
	{:else if name === "bolt"}
		<path d="M11 2.5L4.5 11h5l-1 6.5L15.5 9h-5z" />
	{:else if name === "calendar"}
		<rect x="3" y="4" width="14" height="13" rx="2" /><path
			d="M3 8h14M7 2.5v3M13 2.5v3"
		/>
	{:else if name === "building"}
		<path d="M4 17V4h8v13M12 8h4v9M2 17h16M7 7h2M7 10h2M7 13h2" />
	{/if}
</svg>
