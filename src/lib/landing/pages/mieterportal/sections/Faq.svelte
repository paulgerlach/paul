<!-- The shared FAQ (default variant, the design's .uv-fl) in its dark tone, all answers closed, with the design's left-aligned heading. -->
<script lang="ts">
	import Faq from "$lib/landing/sections/Faq.svelte";
	import { faq } from "../content";
</script>

<div class="mp-faq">
	<Faq items={faq.items} title={faq.title} tone="dark" openFirst={false} />
</div>

<style>
	.mp-faq :global(section.faq) {
		padding-block: 0 110px;
	}
	.mp-faq :global(section.faq h2) {
		font-size: clamp(32px, 4vw, 56px);
		font-weight: 400;
		letter-spacing: -0.04em;
		line-height: 1.05;
		text-align: left;
	}
	.mp-faq :global(.faq-list) {
		max-width: 1100px;
		margin-top: 56px;
	}
	/* #hs-css (the design's FAQ heading has an id) */
	@media (max-width: 1040px) and (min-width: 621px) {
		.mp-faq :global(section.faq h2) {
			font-size: clamp(36px, 5.6vw, 52px);
			line-height: 1.06;
		}
	}
	@media (max-width: 620px) {
		.mp-faq :global(section.faq h2) {
			font-size: clamp(30px, 8.4vw, 40px);
			line-height: 1.08;
		}
	}
</style>
