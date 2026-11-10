<!--
  The service template's page frame (the designs' `.dm.svc` main): the page
  tokens, the sections' padding (.pg-sec, .pg-sec.alt), the pills' hover
  (#pillfx), the reveal's timing and #hs-css's heading sizes.
-->
<script lang="ts">
	import type { Snippet } from "svelte";
	import { reveal } from "$lib/landing/attachments/reveal";

	let { children }: { children: Snippet } = $props();
</script>

<main id="content" class="svc" {@attach reveal()}>
	{@render children()}
</main>

<style>
	/* The design's page tokens (its `.dm` wrapper) */
	.svc {
		--bg: #f6f7f6;
		--hair: #e5e9e7;
	}
	/* The design's sections (.pg-sec, .pg-sec.alt) */
	.svc :global(.pg-sec) {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
		scroll-margin-top: 72px;
	}
	.svc :global(.pg-sec.alt) {
		background: var(--bg);
	}
	@media (max-width: 640px) {
		.svc :global(.pg-sec) {
			padding: 72px 0;
		}
	}
	/* #pillfx on the section pills (SectionHead) */
	.svc :global(.pg-sec .pill svg) {
		transform-origin: 50% 50%;
		transition:
			color 0.3s,
			transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	.svc :global(.pg-sec .pill:hover svg) {
		transform: scale(1.12);
		color: var(--ok);
	}
	.svc :global(.rv.rv-anim) {
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.svc :global(.rv.rv-wait) {
		opacity: 0;
		transform: translateY(16px);
	}
	/* #hs-css: the H1 and the section H2s (not the closing card's) between
	   621 and 1040 px and below. */
	@media (max-width: 1040px) and (min-width: 621px) {
		.svc :global(h1[data-hs]) {
			font-size: clamp(48px, 7.4vw, 68px);
			line-height: 1.02;
		}
		.svc :global(section:not(.end) h2[id]) {
			font-size: clamp(36px, 5.6vw, 52px);
			line-height: 1.06;
		}
	}
	@media (max-width: 620px) {
		.svc :global(h1[data-hs]) {
			font-size: clamp(36px, 10vw, 48px);
			line-height: 1.04;
			overflow-wrap: break-word;
			hyphens: auto;
		}
		.svc :global(section:not(.end) h2[id]) {
			font-size: clamp(30px, 8.4vw, 40px);
			line-height: 1.08;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.svc :global(.pg-sec .pill:hover svg) {
			transform: none;
		}
	}
</style>
