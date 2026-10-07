<!-- Eyebrow pill with an icon, and the H2 with its muted second part (the design's dm-pill + dm-h2). -->
<script lang="ts">
	import type { Snippet } from "svelte";
	import type { SplitHeading } from "../content";

	let {
		id,
		eyebrow,
		icon,
		heading,
		center = false,
	}: {
		/** Id of the H2, for the section's aria-labelledby. */
		id: string;
		eyebrow?: string;
		/** 20×20 stroke icon paths, rendered in the pill's SVG. */
		icon?: Snippet;
		heading: SplitHeading;
		center?: boolean;
	} = $props();
</script>

{#if eyebrow}
	<span class="pill rv">
		{#if icon}
			<svg
				width="16"
				height="16"
				viewBox="0 0 20 20"
				fill="none"
				stroke="currentColor"
				stroke-width="1.6"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true">{@render icon()}</svg
			>
		{/if}
		{eyebrow}
	</span>
{/if}
<h2 class={["rv", center && "c"]} {id}>
	{heading.text}{#if heading.muted}<span>{heading.muted}</span>{/if}
</h2>

<style>
	.pill {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 9px;
		padding: 6px 12px;
		font-size: 14px;
		font-weight: 500;
		box-shadow: 0 1px 2px rgba(30, 50, 45, 0.06);
	}
	.pill svg {
		width: 15px;
		height: 15px;
		color: var(--faint);
	}
	h2 {
		font-size: clamp(30px, 3.6vw, 48px);
		line-height: 1.08;
		letter-spacing: -0.03em;
		font-weight: 500;
		margin-top: 18px;
		text-wrap: balance;
	}
	h2 span {
		color: #8a9792;
	}
	h2.c {
		text-align: center;
	}
</style>
