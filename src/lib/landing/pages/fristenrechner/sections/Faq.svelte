<!-- The shared FAQ (default variant, the design's .xfq) on the white band (.pg-sec), with the design's centred section heading. -->
<script lang="ts">
	import Faq from "$lib/landing/sections/Faq.svelte";
	import { faq } from "../content";
</script>

<div class="band">
	<Faq items={faq.items} title={faq.title} />
</div>

<style>
	.band {
		border-top: 1px solid var(--hair);
	}
	.band :global(section.faq) {
		padding-block: 104px;
	}
	.band :global(.faq h2) {
		margin-top: 18px;
		text-align: center;
		font-size: clamp(30px, 3.6vw, 48px);
		line-height: 1.08;
		letter-spacing: -0.03em;
		font-weight: 500;
		text-wrap: balance;
	}
	.band :global(.faq-list) {
		max-width: 1100px;
		margin: 56px auto 0;
	}
	.band :global(.tg) {
		background: #fff;
	}
	.band :global(.ans) {
		line-height: 1.55;
	}
	/* #hs-css (the design's FAQ heading has an id) */
	@media (max-width: 1040px) and (min-width: 621px) {
		.band :global(.faq h2) {
			font-size: clamp(36px, 5.6vw, 52px);
			line-height: 1.06;
		}
	}
	@media (max-width: 640px) {
		.band :global(section.faq) {
			padding-block: 72px;
		}
	}
	@media (max-width: 620px) {
		.band :global(.faq h2) {
			font-size: clamp(30px, 8.4vw, 40px);
		}
	}
</style>
