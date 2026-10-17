<!-- One of the design's 20×20 line icons on /selbstabrechnung, by name ("heidi" is the logo's three bars). -->
<script lang="ts">
	import HeidiMark from "$lib/landing/components/icons/HeidiMark.svelte";
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";
	import type { IconName } from "../icons";

	let { name, class: className = "" }: { name: IconName; class?: string } =
		$props();
</script>

{#if name === "heidi"}
	<HeidiMark class={["heidi", className].join(" ")} />
{:else}
	<StrokeIcon class={className}>
		{#if name === "calc"}
			<rect x="4.5" y="2.5" width="11" height="15" rx="2" /><path
				d="M7.5 6h5M7.5 10h.01M10 10h.01M12.5 10h.01M7.5 13h.01M10 13h.01M12.5 13h.01"
			/>
		{:else if name === "file"}
			<path d="M5 2.5h7l3.5 3.5v11.5H5z" /><path
				d="M12 2.5V6h3.5M8 10h5M8 13h5"
			/>
		{:else if name === "sparkle"}
			<path
				d="M10 2.5l1.6 4.4 4.4 1.6-4.4 1.6L10 14.5l-1.6-4.4L4 8.5l4.4-1.6zM15.5 13.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"
			/>
		{:else if name === "swap"}
			<path d="M4 7h12M13 4l3 3-3 3M16 13H4M7 10l-3 3 3 3" />
		{:else if name === "user"}
			<circle cx="10" cy="7" r="3.2" /><path
				d="M4 17c.8-3.2 3.1-4.8 6-4.8s5.2 1.6 6 4.8"
			/>
		{:else if name === "users"}
			<circle cx="8" cy="7" r="3" /><path
				d="M2.5 17c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5M13.5 4.5a3 3 0 0 1 0 5.6M15.5 12.8c1 .7 1.7 2 2 4.2"
			/>
		{:else if name === "info"}
			<circle cx="10" cy="10" r="7" /><path d="M10 9v5M10 6.2v.1" />
		{:else if name === "signal"}
			<path
				d="M3 8a10 10 0 0 1 14 0M5.5 10.8a6.5 6.5 0 0 1 9 0M8 13.6a3 3 0 0 1 4 0"
			/><circle cx="10" cy="16" r=".8" fill="currentColor" />
		{:else if name === "meter"}
			<rect x="5" y="2.5" width="10" height="15" rx="2" /><path
				d="M7.5 5.5h5v3h-5zM8 12h4M8 14.5h4"
			/>
		{:else if name === "server"}
			<rect x="3" y="3.5" width="14" height="5" rx="1.5" /><rect
				x="3"
				y="11.5"
				width="14"
				height="5"
				rx="1.5"
			/><path d="M6 6h.01M6 14h.01" />
		{:else if name === "chart"}
			<path d="M3 17h14M6 14V9M10 14V5M14 14v-3" />
		{:else if name === "bell"}
			<path
				d="M5 14V9a5 5 0 0 1 10 0v5l1.5 1.5h-13zM8.5 17.5a1.6 1.6 0 0 0 3 0"
			/>
		{:else if name === "flame"}
			<path
				d="M10 2.5c.5 3 4.5 4.6 4.5 9a4.5 4.5 0 0 1-9 0c0-2.2 1.2-3.6 2.3-4.6.3 1.6 1 2.4 2 2.8C9.4 7.6 9.3 5 10 2.5z"
			/>
		{:else if name === "drop"}
			<path
				d="M10 2.5S4.5 8.6 4.5 12.2a5.5 5.5 0 0 0 11 0C15.5 8.6 10 2.5 10 2.5z"
			/>
		{:else if name === "tap"}
			<path d="M3 8h8a3 3 0 0 1 3 3v1M6 8V5h4v3" /><path
				d="M14 14.5s1.3 1.5 1.3 2.3a1.3 1.3 0 0 1-2.6 0c0-.8 1.3-2.3 1.3-2.3z"
			/>
		{/if}
	</StrokeIcon>
{/if}
