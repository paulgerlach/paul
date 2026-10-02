<script lang="ts">
	import Automation from "$lib/landing/components/sections/Automation.svelte";
	import Faq from "$lib/landing/components/sections/Faq.svelte";
	import FinalCta from "$lib/landing/components/sections/FinalCta.svelte";
	import Hero from "$lib/landing/components/sections/Hero.svelte";
	import Insights from "$lib/landing/components/sections/Insights.svelte";
	import LogoStrip from "$lib/landing/components/sections/LogoStrip.svelte";
	import OldVsNewWay from "$lib/landing/components/sections/OldVsNewWay.svelte";
	import Rollout from "$lib/landing/components/sections/Rollout.svelte";
	import Service from "$lib/landing/components/sections/Service.svelte";
	import Steps from "$lib/landing/components/sections/Steps.svelte";
	import TestimonialBanner from "$lib/landing/components/sections/TestimonialBanner.svelte";

	let { data } = $props();
</script>

<main id="content">
	<Hero form={data.heroForm} />
	<LogoStrip />
	<Steps />
	<OldVsNewWay />
	<Rollout />
	<Service />
	<Automation />
	<Insights />
	<TestimonialBanner />
	<Faq />
	<FinalCta form={data.finalForm} />
</main>
