<!--
  A manufacturer's mark: a coloured shape in a 16 × 16 box (the design's
  brand badges and .iq-sh). `size` in px; without it the box sizes it.
-->
<script lang="ts">
	import { BRANDS } from "../content";

	let {
		brand,
		size,
		class: className = "",
	}: { brand: number; size?: number; class?: string } = $props();

	const mark = $derived(BRANDS[brand % BRANDS.length]);
</script>

<svg
	class={className}
	viewBox="0 0 16 16"
	width={size}
	height={size}
	fill={mark.color}
	aria-hidden="true"
>
	{#if mark.shape === "circle"}<circle cx="8" cy="8" r="6" />
	{:else if mark.shape === "triangle"}<path d="M8 2l6.5 11.5h-13z" />
	{:else if mark.shape === "square"}<rect
			x="2.5"
			y="2.5"
			width="11"
			height="11"
			rx="2"
		/>
	{:else if mark.shape === "diamond"}<path d="M8 1.5l6.5 6.5L8 14.5 1.5 8z" />
	{:else if mark.shape === "hexagon"}<path
			d="M8 1.5l5.6 3.2v6.6L8 14.5l-5.6-3.2V4.7z"
		/>
	{:else}<circle
			cx="8"
			cy="8"
			r="5.2"
			fill="none"
			stroke-width="3"
			stroke={mark.color}
		/>{/if}
</svg>
