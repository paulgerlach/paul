<!-- One of the design's 20×20 line icons of the `uv` template, by name. -->
<script lang="ts">
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";
	import type { IconName } from "./icons";

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
	{:else if name === "building"}
		<path d="M4 17V4h8v13M12 8h4v9M2 17h16M7 7h2M7 10h2M7 13h2" />
	{:else if name === "user"}
		<circle cx="10" cy="7" r="3.2" /><path
			d="M4 17c.8-3.2 3.1-4.8 6-4.8s5.2 1.6 6 4.8"
		/>
	{:else if name === "key"}
		<circle cx="7" cy="13" r="3.5" /><path
			d="M9.5 10.5l6-6M13 7l2 2M15.5 4.5l1.5 1.5"
		/>
	{:else if name === "home"}
		<path d="M3 9.5L10 3.5l7 6V17H3z" /><path d="M8 17v-4.5h4V17" />
	{:else if name === "tool"}
		<path
			d="M12.5 3.5a4 4 0 0 0-4.9 5.2L3 13.3 5.7 16l4.6-4.6a4 4 0 0 0 5.2-4.9l-2.4 2.4-2.2-.6-.6-2.2z"
		/>
	{:else if name === "server"}
		<rect x="3" y="3.5" width="14" height="5" rx="1.5" /><rect
			x="3"
			y="11.5"
			width="14"
			height="5"
			rx="1.5"
		/><path d="M6 6h.01M6 14h.01" />
	{:else if name === "check"}
		<path d="M5 10.5l3.2 3L15 7" />
	{:else if name === "meter"}
		<circle cx="10" cy="10" r="7" /><path d="M10 10l3-3M6.5 13.5h7" />
	{:else if name === "plug"}
		<path d="M7 2.5v4M13 2.5v4M5 6.5h10v3a5 5 0 0 1-10 0zM10 14.5v3" />
	{:else if name === "radiator"}
		<rect x="3" y="6" width="14" height="10" rx="2" /><path
			d="M7 6v10M10 6v10M13 6v10M5 16v2M15 16v2M10 2.5c-.6.8.6 1.4 0 2.2"
		/>
	{:else if name === "tap"}
		<path d="M3 8h8a3 3 0 0 1 3 3v1M6 8V5h4v3" /><path
			d="M14 14.5s1.3 1.5 1.3 2.3a1.3 1.3 0 0 1-2.6 0c0-.8 1.3-2.3 1.3-2.3zM16.5 3.5c-.6.7.6 1.3 0 2M18.5 3.5c-.6.7.6 1.3 0 2"
		/>
	{:else if name === "drop"}
		<path
			d="M10 2.5S4.5 8.6 4.5 12.2a5.5 5.5 0 0 0 11 0C15.5 8.6 10 2.5 10 2.5z"
		/>
	{:else if name === "smoke"}
		<circle cx="10" cy="10" r="7" /><circle cx="10" cy="10" r="2.5" /><path
			d="M10 3v2M10 15v2"
		/>
	{:else if name === "swap"}
		<path d="M4 7h12M13 4l3 3-3 3M16 13H4M7 10l-3 3 3 3" />
	{:else if name === "device"}
		<rect x="5" y="2.5" width="10" height="15" rx="2" /><path
			d="M7.5 5.5h5v3h-5zM8 12h4M8 14.5h4"
		/>
	{:else if name === "calendar"}
		<rect x="3" y="4" width="14" height="13" rx="2" /><path
			d="M3 8h14M7 2.5v3M13 2.5v3"
		/>
	{/if}
</StrokeIcon>
