<!--
  The <main> of the city and Germany pages, with the design's page-wide
  overrides: eyebrows as small pills with a sparkle (`#eb-css`), and larger
  H1/H2 between 621 and 1040 px and below (`#hs-css`, which applies to the
  H1 and to every section H2 with an id). Also renders the floating CTA.
-->
<script lang="ts">
	import type { Snippet } from "svelte";
	import FloatingCta from "./FloatingCta.svelte";

	let { children }: { children: Snippet } = $props();
</script>

<main id="content" class="region">
	{@render children()}
</main>
<FloatingCta />

<style>
	.region :global(.eyebrow) {
		display: flex;
		align-items: center;
		gap: 8px;
		width: fit-content;
		max-width: 100%;
		background: #fff;
		color: #1e322d;
		border: 1px solid #e4e8e6;
		border-radius: 9px;
		padding: 6px 12px;
		font-size: 14px;
		font-weight: 500;
		letter-spacing: 0;
		text-transform: none;
		line-height: 1.3;
		box-shadow: 0 1px 2px rgba(30, 50, 45, 0.06);
		margin-top: 0;
		margin-bottom: 18px;
	}
	.region :global(.eyebrow::before) {
		content: "";
		width: 15px;
		height: 15px;
		flex: none;
		background: #9aa5a1;
		mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='black' stroke-width='1.5' stroke-linejoin='round'%3E%3Cpath d='M8.5 2.5l1.4 4.1 4.1 1.4-4.1 1.4-1.4 4.1-1.4-4.1-4.1-1.4 4.1-1.4z'/%3E%3Cpath d='M15 11.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z'/%3E%3C/svg%3E")
			center/contain no-repeat;
	}
	.region :global(.eyebrow.on-dark) {
		background: rgba(255, 255, 255, 0.06);
		color: #fff;
		border-color: rgba(255, 255, 255, 0.18);
		box-shadow: none;
	}
	.region :global(.eyebrow.on-dark::before) {
		background: #8ad68f;
	}
	/* Centred where its parent centres it (the design decides this in JS) */
	.region :global(.shead .eyebrow),
	.region :global(.eyebrow.c) {
		margin-inline: auto;
	}

	@media (max-width: 1040px) and (min-width: 621px) {
		.region :global(h1) {
			font-size: clamp(48px, 7.4vw, 68px) !important;
			line-height: 1.02 !important;
		}
		.region :global(section h2[id]) {
			font-size: clamp(36px, 5.6vw, 52px) !important;
			line-height: 1.06 !important;
		}
	}
	@media (max-width: 620px) {
		.region :global(h1) {
			font-size: clamp(36px, 10vw, 48px) !important;
			line-height: 1.04 !important;
			overflow-wrap: break-word;
			hyphens: auto;
		}
		.region :global(section h2[id]) {
			font-size: clamp(30px, 8.4vw, 40px) !important;
			line-height: 1.08 !important;
		}
	}
</style>
