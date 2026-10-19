<script lang="ts">
	import { reveal } from "$lib/landing/attachments/reveal";
	import PvMain from "$lib/landing/pages/private-vermieter/PvMain.svelte";
	import Benefits from "$lib/landing/pages/private-vermieter/sections/Benefits.svelte";
	import Closing from "$lib/landing/pages/private-vermieter/sections/Closing.svelte";
	import Compare from "$lib/landing/pages/private-vermieter/sections/Compare.svelte";
	import Duo from "$lib/landing/pages/private-vermieter/sections/Duo.svelte";
	import Faq from "$lib/landing/pages/private-vermieter/sections/Faq.svelte";
	import FloatingCta from "$lib/landing/pages/private-vermieter/sections/FloatingCta.svelte";
	import Flow from "$lib/landing/pages/private-vermieter/sections/Flow.svelte";
	import Hero from "$lib/landing/pages/private-vermieter/sections/Hero.svelte";
	import Quotes from "$lib/landing/pages/private-vermieter/sections/Quotes.svelte";
	import Scene from "$lib/landing/pages/private-vermieter/sections/Scene.svelte";
	import Stats from "$lib/landing/pages/private-vermieter/sections/Stats.svelte";
	import Trust from "$lib/landing/pages/private-vermieter/sections/Trust.svelte";

	let { data } = $props();
</script>

<main id="content" class="pv" {@attach reveal()}>
	<PvMain>
		<Hero />
		<Scene />
		<Stats />
		<Flow />
		<Duo />
		<Benefits />
		<Compare />
		<Quotes />
		<Faq items={data.faq} />
		<Closing form={data.finalForm} />
	</PvMain>
	<Trust />
</main>
<FloatingCta />

<style>
	/* The design's page tokens for the white mock-ups */
	.pv {
		--bg: #f6f7f6;
		--hair: #e5e9e7;
	}
	.pv :global(.rv.rv-anim) {
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.pv :global(.rv.rv-wait) {
		opacity: 0;
		transform: translateY(16px);
	}
	/* #hs-css: the H1 and every section H2 with an id (the design has no
	   exception here), between 621 and 1040 px and below. */
	@media (max-width: 1040px) and (min-width: 621px) {
		.pv :global(h1[data-hs]) {
			font-size: clamp(48px, 7.4vw, 68px);
			line-height: 1.02;
		}
		.pv :global(section h2[id]) {
			font-size: clamp(36px, 5.6vw, 52px);
			line-height: 1.06;
		}
	}
	@media (max-width: 620px) {
		.pv :global(h1[data-hs]) {
			font-size: clamp(36px, 10vw, 48px);
			line-height: 1.04;
			overflow-wrap: break-word;
			hyphens: auto;
		}
		.pv :global(section h2[id]) {
			font-size: clamp(30px, 8.4vw, 40px);
			line-height: 1.08;
		}
	}
</style>
