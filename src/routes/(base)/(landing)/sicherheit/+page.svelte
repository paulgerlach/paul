<script lang="ts">
	import { reveal } from "$lib/landing/attachments/reveal";
	import Closing from "$lib/landing/pages/sicherheit/sections/Closing.svelte";
	import DataPath from "$lib/landing/pages/sicherheit/sections/DataPath.svelte";
	import DataTable from "$lib/landing/pages/sicherheit/sections/DataTable.svelte";
	import Faq from "$lib/landing/pages/sicherheit/sections/Faq.svelte";
	import FloatingCta from "$lib/landing/pages/sicherheit/sections/FloatingCta.svelte";
	import Hero from "$lib/landing/pages/sicherheit/sections/Hero.svelte";
	import Principles from "$lib/landing/pages/sicherheit/sections/Principles.svelte";
	import Trust from "$lib/landing/pages/sicherheit/sections/Trust.svelte";

	let { data } = $props();
</script>

<main id="content" class="sc" {@attach reveal()}>
	<Hero />
	<Principles />
	<DataPath />
	<DataTable />
	<Faq items={data.faq} />
	<Closing />
	<Trust />
</main>
<FloatingCta />

<style>
	/* The design's page tokens */
	.sc {
		--bg: #f6f7f6;
		--hair: #e5e9e7;
	}
	/* The design's sections (.pg-sec, .dm-h2.c, .sc-sub); `.head` and `.sub`
	   through the section, to beat the landing heading reset. */
	.sc :global(.pg-sec) {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
	}
	.sc :global(.pg-sec.alt) {
		background: var(--bg);
	}
	.sc :global(.pg-sec .head) {
		font-size: clamp(30px, 3.6vw, 48px);
		line-height: 1.08;
		letter-spacing: -0.03em;
		font-weight: 500;
		margin-top: 18px;
		text-align: center;
		text-wrap: balance;
	}
	.sc :global(.pg-sec .sub) {
		text-align: center;
		color: var(--muted);
		font-size: 17px;
		line-height: 1.55;
		max-width: 62ch;
		margin: 16px auto 0;
	}
	@media (max-width: 640px) {
		.sc :global(.pg-sec) {
			padding: 72px 0;
		}
	}
	.sc :global(.rv.rv-anim) {
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.sc :global(.rv.rv-wait) {
		opacity: 0;
		transform: translateY(16px);
	}
	/* #hs-css: the H1 and the section H2s (not the closing card's) between
	   621 and 1040 px and below. The FAQ's H2 gets them in its wrapper. */
	@media (max-width: 1040px) and (min-width: 621px) {
		.sc :global(h1[data-hs]) {
			font-size: clamp(48px, 7.4vw, 68px);
			line-height: 1.02;
		}
		.sc :global(section:not(.end) h2[id]) {
			font-size: clamp(36px, 5.6vw, 52px);
			line-height: 1.06;
		}
	}
	@media (max-width: 620px) {
		.sc :global(h1[data-hs]) {
			font-size: clamp(36px, 10vw, 48px);
			line-height: 1.04;
			overflow-wrap: break-word;
			hyphens: auto;
		}
		.sc :global(section:not(.end) h2[id]) {
			font-size: clamp(30px, 8.4vw, 40px);
			line-height: 1.08;
		}
	}
</style>
