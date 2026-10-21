<script lang="ts">
	import { onMount, untrack } from "svelte";
	import { reveal } from "$lib/landing/attachments/reveal";
	import { setDeadlineClock } from "$lib/landing/deadline/clock.svelte";
	import Careers from "$lib/landing/pages/ueber-uns/sections/Careers.svelte";
	import FinalCta from "$lib/landing/pages/ueber-uns/sections/FinalCta.svelte";
	import Hero from "$lib/landing/pages/ueber-uns/sections/Hero.svelte";
	import LogoStrip from "$lib/landing/pages/ueber-uns/sections/LogoStrip.svelte";
	import Mission from "$lib/landing/pages/ueber-uns/sections/Mission.svelte";
	import Numbers from "$lib/landing/pages/ueber-uns/sections/Numbers.svelte";
	import Principles from "$lib/landing/pages/ueber-uns/sections/Principles.svelte";
	import Team from "$lib/landing/pages/ueber-uns/sections/Team.svelte";
	import Testimonials from "$lib/landing/pages/ueber-uns/sections/Testimonials.svelte";
	import Trust from "$lib/landing/pages/ueber-uns/sections/Trust.svelte";

	let { data } = $props();

	// SSR and hydration render from the server's time; the browser's clock
	// takes over on mount.
	const clock = setDeadlineClock(untrack(() => data.now));
	onMount(() => clock.start());
</script>

<main id="content" class="ub" {@attach reveal()}>
	<Hero />
	<LogoStrip />
	<Mission />
	<Principles />
	<Numbers />
	<Team />
	<Testimonials />
	<Careers />
	<FinalCta form={data.finalForm} />
	<Trust />
</main>

<style>
	/* The design's page tokens (its `.dm` wrapper) */
	.ub {
		--bg: #f6f7f6;
		--hair: #e5e9e7;
	}
	.ub :global(.rv.rv-anim) {
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.ub :global(.rv.rv-wait) {
		opacity: 0;
		transform: translateY(16px);
	}
</style>
