<script lang="ts">
	import { reveal } from "$lib/landing/attachments/reveal";
	import Boilerplate from "$lib/landing/pages/presse/sections/Boilerplate.svelte";
	import Closing from "$lib/landing/pages/presse/sections/Closing.svelte";
	import Contact from "$lib/landing/pages/presse/sections/Contact.svelte";
	import Facts from "$lib/landing/pages/presse/sections/Facts.svelte";
	import FloatingCta from "$lib/landing/pages/presse/sections/FloatingCta.svelte";
	import Hero from "$lib/landing/pages/presse/sections/Hero.svelte";
	import Name from "$lib/landing/pages/presse/sections/Name.svelte";
	import PressContact from "$lib/landing/pages/presse/sections/PressContact.svelte";
	import Trust from "$lib/landing/pages/presse/sections/Trust.svelte";

	let { data } = $props();
</script>

<main id="content" class="pr" {@attach reveal()}>
	<Hero />
	<Contact />
	<Name />
	<Facts />
	<Boilerplate />
	<PressContact />
	<Closing form={data.finalForm} />
	<Trust />
</main>
<FloatingCta />

<style>
	/* The design's page tokens (its `.dm` wrapper) */
	.pr {
		--bg: #f6f7f6;
		--hair: #e5e9e7;
	}
	/* .pr-h: the section headings of Name, Facts and Boilerplate */
	.pr :global(h2.pr-h) {
		font-size: clamp(30px, 3.4vw, 46px);
		font-weight: 400;
		letter-spacing: -0.035em;
		line-height: 1.05;
	}
	.pr :global(.rv.rv-anim) {
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.pr :global(.rv.rv-wait) {
		opacity: 0;
		transform: translateY(16px);
	}
	/* #hs-css: the H1 and the section H2s with an id (not the closing card's)
	   between 621 and 1040 px and below; `!important` as in the design, so it
	   beats the sections' own sizes (the giant H1 shrinks there). */
	@media (max-width: 1040px) and (min-width: 621px) {
		.pr :global(h1[data-hs]) {
			font-size: clamp(48px, 7.4vw, 68px) !important;
			line-height: 1.02 !important;
		}
		.pr :global(section:not(.end) h2[id]) {
			font-size: clamp(36px, 5.6vw, 52px) !important;
			line-height: 1.06 !important;
		}
	}
	@media (max-width: 620px) {
		.pr :global(h1[data-hs]) {
			font-size: clamp(36px, 10vw, 48px) !important;
			line-height: 1.04 !important;
			overflow-wrap: break-word;
			hyphens: auto;
		}
		.pr :global(section:not(.end) h2[id]) {
			font-size: clamp(30px, 8.4vw, 40px) !important;
			line-height: 1.08 !important;
		}
	}
</style>
