<!--
  The design's section head (.pg-head, centred with `.c`): the pill with its
  icon and the H2 with the muted part, through the shared SectionHead, and
  an optional lead (.dm-lead, or the scan's .ms-lead with `wideLead`).
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
		wideLead = false,
		center = false,
	}: {
		id: string;
		pill: string;
		/** The pill's icon. */
		symbol: IconName;
		heading: SplitHeading;
		lead?: string;
		/** The scan's lead (.ms-lead: 17 px, 62ch, 18 px above). */
		wideLead?: boolean;
		center?: boolean;
	} = $props();
</script>

<div class={["head", center && "c"]}>
	<SectionHead {id} eyebrow={pill} {heading} {center}>
		{#snippet icon()}<Shapes name={symbol} />{/snippet}
	</SectionHead>
	{#if lead}<p class={["lead rv", wideLead && "wide"]}>
			{lead}
		</p>{/if}
</div>

<style>
	.head {
		max-width: 760px;
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
	/* .ms-lead */
	.lead.wide {
		font-size: 17px;
		line-height: 1.6;
		margin-top: 18px;
		max-width: 62ch;
	}
	@media (prefers-reduced-motion: reduce) {
		.head :global(.pill:hover svg) {
			transform: none;
		}
	}
</style>
