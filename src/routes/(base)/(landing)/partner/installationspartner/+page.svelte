<script lang="ts">
	import { reveal } from "$lib/landing/attachments/reveal";
	import Apply from "$lib/landing/pages/installationspartner/sections/Apply.svelte";
	import Audience from "$lib/landing/pages/installationspartner/sections/Audience.svelte";
	import Closing from "$lib/landing/pages/installationspartner/sections/Closing.svelte";
	import Faq from "$lib/landing/pages/installationspartner/sections/Faq.svelte";
	import FloatingCta from "$lib/landing/pages/installationspartner/sections/FloatingCta.svelte";
	import Hero from "$lib/landing/pages/installationspartner/sections/Hero.svelte";
	import Numbers from "$lib/landing/pages/installationspartner/sections/Numbers.svelte";
	import Picture from "$lib/landing/pages/installationspartner/sections/Picture.svelte";
	import Quotes from "$lib/landing/pages/installationspartner/sections/Quotes.svelte";
	import Rotator from "$lib/landing/pages/installationspartner/sections/Rotator.svelte";
	import Rows from "$lib/landing/pages/installationspartner/sections/Rows.svelte";
	import Statement from "$lib/landing/pages/installationspartner/sections/Statement.svelte";
	import Trust from "$lib/landing/pages/installationspartner/sections/Trust.svelte";
	import UvMain from "$lib/landing/sections/uv/UvMain.svelte";

	let { data } = $props();
</script>

<main id="content" class="ip" {@attach reveal()}>
	<UvMain>
		<Hero />
		<Statement />
		<Rows />
		<Rotator />
		<Numbers />
		<Audience />
		<Quotes />
		<Picture />
		<Apply form={data.partnerForm} />
		<Faq items={data.faq} />
		<Closing />
	</UvMain>
	<Trust />
</main>
<FloatingCta />

<style>
	/* The design's page tokens for the white mock-ups */
	.ip {
		--bg: #f6f7f6;
		--hair: #e5e9e7;
	}
	.ip :global(.rv.rv-anim) {
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.ip :global(.rv.rv-wait) {
		opacity: 0;
		transform: translateY(16px);
	}

	/* #hs-css: the section H2s with an id (Zahlen, quotes, the partner form,
	   the security block), between 621 and 1040 px and below. The FAQ's H2
	   gets them in its wrapper. */
	@media (max-width: 1040px) and (min-width: 621px) {
		.ip :global(section:not(.end):not(.rows):not(.who) h2[id]) {
			font-size: clamp(36px, 5.6vw, 52px);
			line-height: 1.06;
		}
	}
	@media (max-width: 620px) {
		.ip :global(section:not(.end):not(.rows):not(.who) h2[id]) {
			font-size: clamp(30px, 8.4vw, 40px);
			line-height: 1.08;
		}
	}
</style>
