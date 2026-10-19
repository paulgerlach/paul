<!--
  The design's section head (.pg-head): the pill with its icon and the H2
  with the muted part, through the shared SectionHead, and an optional lead
  (.dm-lead).
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
	}: {
		id: string;
		pill: string;
		/** The pill's icon. */
		symbol: IconName;
		heading: SplitHeading;
		lead?: string;
	} = $props();
</script>

<div class="head">
	<SectionHead {id} eyebrow={pill} {heading}>
		{#snippet icon()}<Shapes name={symbol} />{/snippet}
	</SectionHead>
	{#if lead}<p class="lead rv">{lead}</p>{/if}
</div>

<style>
	.head {
		max-width: 760px;
	}
	/* The landing heading reset takes SectionHead's 18 px top margin and
	   its letter-spacing. */
	.head :global(h2) {
		margin-top: 18px;
		letter-spacing: -0.03em;
	}
	/* .dm-pill:hover svg (#pillfx) */
	.head :global(.pill svg) {
		transform-origin: 50% 50%;
		transition:
			color 0.3s,
			transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	.head :global(.pill:hover svg) {
		transform: scale(1.12);
		color: var(--ok);
	}
	/* .dm-lead */
	.lead {
		color: var(--muted);
		font-size: clamp(16px, 1.5vw, 19px);
		margin-top: 16px;
		max-width: 52ch;
	}
	@media (prefers-reduced-motion: reduce) {
		.head :global(.pill:hover svg) {
			transform: none;
		}
	}
</style>
