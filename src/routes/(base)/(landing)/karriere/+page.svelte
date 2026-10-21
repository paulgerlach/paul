<script lang="ts">
	import { reveal } from "$lib/landing/attachments/reveal";
	import { setApplication } from "$lib/landing/pages/karriere/application.svelte";
	import Apply from "$lib/landing/pages/karriere/sections/Apply.svelte";
	import Areas from "$lib/landing/pages/karriere/sections/Areas.svelte";
	import Hero from "$lib/landing/pages/karriere/sections/Hero.svelte";
	import Jobs from "$lib/landing/pages/karriere/sections/Jobs.svelte";
	import MoreAbout from "$lib/landing/pages/karriere/sections/MoreAbout.svelte";
	import Process from "$lib/landing/pages/karriere/sections/Process.svelte";
	import Reasons from "$lib/landing/pages/karriere/sections/Reasons.svelte";
	import Trust from "$lib/landing/pages/karriere/sections/Trust.svelte";

	let { data } = $props();

	// The role chosen by any "bewerben" link, read by the form's select.
	setApplication();
</script>

<main id="content" class="kr" {@attach reveal()}>
	<Hero />
	<Reasons />
	<Areas />
	<Jobs />
	<Process />
	<Apply form={data.applicationForm} />
	<MoreAbout />
	<Trust />
</main>

<style>
	/* The design's page tokens (its `.dm` wrapper) */
	.kr {
		--bg: #f6f7f6;
		--hair: #e5e9e7;
	}
	.kr :global(.rv.rv-anim) {
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.kr :global(.rv.rv-wait) {
		opacity: 0;
		transform: translateY(16px);
	}
</style>
