<!-- A section's pill and H2 (the design's .pg-head with .dm-pill and .dm-h2), through the shared SectionHead. -->
<script lang="ts">
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import type { SplitHeading } from "$lib/landing/types";
	import type { Pill } from "./types";
	import Shapes from "./Shapes.svelte";

	let {
		id,
		pill,
		heading,
		center = false,
	}: {
		id: string;
		pill: Pill;
		heading: SplitHeading;
		center?: boolean;
	} = $props();
</script>

<div class={["head", center && "c"]}>
	<SectionHead {id} eyebrow={pill.text} {heading} {center}>
		{#snippet icon()}<Shapes name={pill.icon} />{/snippet}
	</SectionHead>
</div>

<style>
	.head {
		max-width: 760px;
	}
	.head.c {
		margin: 0 auto;
		text-align: center;
	}
</style>
