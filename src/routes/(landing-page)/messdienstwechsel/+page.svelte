<script lang="ts">
	import Automation from "$lib/landing/pages/messdienstwechsel/sections/Automation.svelte";
	import Faq from "$lib/landing/pages/messdienstwechsel/sections/Faq.svelte";
	import FinalCta from "$lib/landing/pages/messdienstwechsel/sections/FinalCta.svelte";
	import Hero from "$lib/landing/pages/messdienstwechsel/sections/Hero.svelte";
	import Insights from "$lib/landing/pages/messdienstwechsel/sections/Insights.svelte";
	import LogoStrip from "$lib/landing/pages/messdienstwechsel/sections/LogoStrip.svelte";
	import OldVsNewWay from "$lib/landing/pages/messdienstwechsel/sections/OldVsNewWay.svelte";
	import Rollout from "$lib/landing/pages/messdienstwechsel/sections/Rollout.svelte";
	import Service from "$lib/landing/pages/messdienstwechsel/sections/Service.svelte";
	import Steps from "$lib/landing/pages/messdienstwechsel/sections/Steps.svelte";
	import TestimonialBanner from "$lib/landing/pages/messdienstwechsel/sections/TestimonialBanner.svelte";

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
