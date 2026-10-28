<script lang="ts">
	import { reveal } from "$lib/landing/attachments/reveal";
	import Audience from "$lib/landing/pages/interoperabilitaet/sections/Audience.svelte";
	import CtaCard from "$lib/landing/pages/interoperabilitaet/sections/CtaCard.svelte";
	import Dashboard from "$lib/landing/pages/interoperabilitaet/sections/Dashboard.svelte";
	import Faq from "$lib/landing/pages/interoperabilitaet/sections/Faq.svelte";
	import FloatingCta from "$lib/landing/pages/interoperabilitaet/sections/FloatingCta.svelte";
	import Hero from "$lib/landing/pages/interoperabilitaet/sections/Hero.svelte";
	import Law from "$lib/landing/pages/interoperabilitaet/sections/Law.svelte";
	import Numbers from "$lib/landing/pages/interoperabilitaet/sections/Numbers.svelte";
	import Picture from "$lib/landing/pages/interoperabilitaet/sections/Picture.svelte";
	import Quotes from "$lib/landing/pages/interoperabilitaet/sections/Quotes.svelte";
	import Rotator from "$lib/landing/pages/interoperabilitaet/sections/Rotator.svelte";
	import Rows from "$lib/landing/pages/interoperabilitaet/sections/Rows.svelte";
	import Statement from "$lib/landing/pages/interoperabilitaet/sections/Statement.svelte";
	import Trust from "$lib/landing/pages/interoperabilitaet/sections/Trust.svelte";
	import UvMain from "$lib/landing/sections/uv/UvMain.svelte";

	let { data } = $props();
</script>

<main id="content" class="iop" {@attach reveal()}>
	<UvMain>
		<Hero />
		<Statement />
		<Rows />
		<Rotator />
		<Numbers />
		<Audience />
		<Dashboard />
		<Quotes />
		<Picture />
		<Law />
		<Faq items={data.faq} />
		<CtaCard />
	</UvMain>
	<Trust />
</main>
<FloatingCta />

<style>
	/* The design's page tokens for the white mock-ups */
	.iop {
		--bg: #f6f7f6;
		--hair: #e5e9e7;
	}
	.iop :global(.rv.rv-anim) {
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.iop :global(.rv.rv-wait) {
		opacity: 0;
		transform: translateY(16px);
	}

	/* #hs-css: the section H2s with an id (Zahlen, "Jeder Hersteller", the
	   quotes, the legal frame, the security block), between 621 and 1040 px
	   and below. The FAQ's H2 gets them in its wrapper. */
	@media (max-width: 1040px) and (min-width: 621px) {
		.iop :global(section:not(.end):not(.rows):not(.who) h2[id]) {
			font-size: clamp(36px, 5.6vw, 52px);
			line-height: 1.06;
		}
	}
	@media (max-width: 620px) {
		.iop :global(section:not(.end):not(.rows):not(.who) h2[id]) {
			font-size: clamp(30px, 8.4vw, 40px);
			line-height: 1.08;
		}
	}
</style>
