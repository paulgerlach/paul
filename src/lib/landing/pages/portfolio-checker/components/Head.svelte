<!--
  The design's section head (.pg-head, centred with `.c`): the pill with its
  icon and the H2 with the muted part, through the shared SectionHead, and
  an optional lead (.dm-lead).
-->
<script lang="ts">
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import type { SplitHeading } from "$lib/landing/types";
	import type { IconName } from "../icons";
	import Shapes from "./Shapes.svelte";

	let {
		id,
		pill,
		symbol,
		heading,
		lead,
		center = false,
		wide = false,
	}: {
		id: string;
		pill: string;
		/** The pill's icon. */
		symbol: IconName;
		heading: SplitHeading;
		lead?: string;
		center?: boolean;
		/** Without the .pg-head's 760 px limit (the result's plain head). */
		wide?: boolean;
	} = $props();
</script>

<div class={["head", center && "c", wide && "wide"]}>
	<SectionHead {id} eyebrow={pill} {heading} {center}>
		{#snippet icon()}<Shapes name={symbol} />{/snippet}
	</SectionHead>
	{#if lead}<p class="lead rv">{lead}</p>{/if}
</div>

<style>
	.head {
		max-width: 760px;
	}
	.head.wide {
		max-width: none;
	}
	.head.c {
		margin: 0 auto;
		text-align: center;
	}
	/* The landing heading reset takes SectionHead's 18 px top margin and
	   its letter-spacing. */
	.head :global(h2) {
		margin-top: 18px;
		letter-spacing: -0.03em;
	}
	/* .dm-lead: its 52ch box stays at the start, the text centred in it. */
	.lead {
		color: var(--muted);
		font-size: clamp(16px, 1.5vw, 19px);
		margin-top: 16px;
		max-width: 52ch;
	}
</style>
