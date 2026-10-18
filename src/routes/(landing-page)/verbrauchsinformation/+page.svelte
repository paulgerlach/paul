<script lang="ts">
	import { reveal } from "$lib/landing/attachments/reveal";
	import CtaCard from "$lib/landing/pages/verbrauchsinformation/sections/CtaCard.svelte";
	import Faq from "$lib/landing/pages/verbrauchsinformation/sections/Faq.svelte";
	import FloatingCta from "$lib/landing/pages/verbrauchsinformation/sections/FloatingCta.svelte";
	import Trust from "$lib/landing/pages/verbrauchsinformation/sections/Trust.svelte";
	import UvMain from "$lib/landing/sections/uv/UvMain.svelte";

	let { data } = $props();
</script>

<main id="content" class="vi" {@attach reveal()}>
	<UvMain>
		<Faq items={data.faq} />
		<CtaCard form={data.finalForm} />
	</UvMain>
	<Trust />
</main>
<FloatingCta />

<style>
	/* The design's page tokens for the white mock-ups */
	.vi {
		--bg: #f6f7f6;
		--hair: #e5e9e7;
	}
	.vi :global(.rv.rv-anim) {
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.vi :global(.rv.rv-wait) {
		opacity: 0;
		transform: translateY(16px);
	}
</style>
