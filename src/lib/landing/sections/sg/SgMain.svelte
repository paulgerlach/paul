<!--
  Wrapper of an `sg` page (/kunden/wohnungsunternehmen, next /kunden/asset-manager) inside
  its <main>: the design's page tokens (its `.dm`), the sections' `.pg-sec`
  spacing, the reveal transition, `#hs-css`'s heading sizes and `#demo-css`'s
  two-quote row, i.e. what spans the template's and the shared sections.
-->
<script lang="ts">
	import type { Snippet } from "svelte";

	let { children }: { children: Snippet } = $props();
</script>

<div class="sg">{@render children()}</div>

<style>
	.sg {
		--bg: #f6f7f6;
		--hair: #e5e9e7;
	}
	/* The design's sections (.pg-sec, .pg-sec.alt) */
	.sg :global(.pg-sec) {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
	}
	.sg :global(.pg-sec.alt) {
		background: var(--bg);
	}
	/* The design's 18 px above the section H2s (the template's and
	   Testimonials'), lost to the landing heading reset at equal specificity. */
	.sg :global(.pg-sec .head h2),
	.sg :global(section.tm h2) {
		margin-top: 18px;
	}
	/* This design keeps the two quotes side by side down to 641 px (the shared
	   Testimonials stack at 1040 px). */
	@media (max-width: 1040px) and (min-width: 641px) {
		.sg :global(.tm .tm-row) {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 640px) {
		.sg :global(.pg-sec) {
			padding: 72px 0;
		}
	}
	.sg :global(.rv.rv-anim) {
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.sg :global(.rv.rv-wait) {
		opacity: 0;
		transform: translateY(16px);
	}
	/* #hs-css: the H1 and the section H2s (not the closing card's) between
	   621 and 1040 px and below. */
	@media (max-width: 1040px) and (min-width: 621px) {
		.sg :global(h1[data-hs]) {
			font-size: clamp(48px, 7.4vw, 68px);
			line-height: 1.02;
		}
		.sg :global(section:not(.end) h2[id]) {
			font-size: clamp(36px, 5.6vw, 52px);
			line-height: 1.06;
		}
	}
	@media (max-width: 620px) {
		.sg :global(h1[data-hs]) {
			font-size: clamp(36px, 10vw, 48px);
			line-height: 1.04;
			overflow-wrap: break-word;
			hyphens: auto;
		}
		.sg :global(section:not(.end) h2[id]) {
			font-size: clamp(30px, 8.4vw, 40px);
			line-height: 1.08;
		}
	}
</style>
