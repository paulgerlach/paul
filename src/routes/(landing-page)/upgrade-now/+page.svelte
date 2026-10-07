<script lang="ts">
	import { onMount, untrack } from "svelte";
	import { reveal } from "$lib/landing/attachments/reveal";
	import { setDeadlineClock } from "$lib/landing/pages/upgrade-now/clock.svelte";
	import Consequences from "$lib/landing/pages/upgrade-now/sections/Consequences.svelte";
	import Deadlines from "$lib/landing/pages/upgrade-now/sections/Deadlines.svelte";
	import Faq from "$lib/landing/pages/upgrade-now/sections/Faq.svelte";
	import FinalCta from "$lib/landing/pages/upgrade-now/sections/FinalCta.svelte";
	import Hero from "$lib/landing/pages/upgrade-now/sections/Hero.svelte";
	import LogoStrip from "$lib/landing/pages/upgrade-now/sections/LogoStrip.svelte";
	import RiskCalculator from "$lib/landing/pages/upgrade-now/sections/RiskCalculator.svelte";
	import Testimonials from "$lib/landing/pages/upgrade-now/sections/Testimonials.svelte";
	import TimeWindow from "$lib/landing/pages/upgrade-now/sections/TimeWindow.svelte";
	import Trust from "$lib/landing/pages/upgrade-now/sections/Trust.svelte";
	import WhyHeidi from "$lib/landing/pages/upgrade-now/sections/WhyHeidi.svelte";

	let { data } = $props();

	// SSR and hydration render from the server's time; the browser's clock
	// takes over on mount.
	const clock = setDeadlineClock(untrack(() => data.now));
	onMount(() => clock.start());
</script>

<main id="content" class="um" {@attach reveal()}>
	<Hero />
	<LogoStrip />
	<Deadlines />
	<Consequences />
	<RiskCalculator />
	<TimeWindow />
	<WhyHeidi />
	<Testimonials />
	<Faq />
	<FinalCta form={data.finalForm} />
	<Trust />
</main>

<style>
	/* The design's page tokens (its `.dm` wrapper) */
	.um {
		--bg: #f6f7f6;
		--hair: #e5e9e7;
	}
	.um :global(.rv.rv-anim) {
		transition:
			opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.um :global(.rv.rv-wait) {
		opacity: 0;
		transform: translateY(16px);
	}
</style>
