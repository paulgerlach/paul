<script lang="ts">
	import Closing from "$lib/landing/pages/dashboard/sections/Closing.svelte";
	import Features from "$lib/landing/pages/dashboard/sections/Features.svelte";
	import FloatingCta from "$lib/landing/pages/dashboard/sections/FloatingCta.svelte";
	import Hero from "$lib/landing/pages/dashboard/sections/Hero.svelte";
	import Integration from "$lib/landing/pages/dashboard/sections/Integration.svelte";
	import Kpis from "$lib/landing/pages/dashboard/sections/Kpis.svelte";
	import LogoStrip from "$lib/landing/pages/dashboard/sections/LogoStrip.svelte";
	import Questions from "$lib/landing/pages/dashboard/sections/Questions.svelte";
	import Quote from "$lib/landing/pages/dashboard/sections/Quote.svelte";
	import Recommendations from "$lib/landing/pages/dashboard/sections/Recommendations.svelte";
	import Roadmap from "$lib/landing/pages/dashboard/sections/Roadmap.svelte";
	import Strike from "$lib/landing/pages/dashboard/sections/Strike.svelte";
	import Testimonials from "$lib/landing/pages/dashboard/sections/Testimonials.svelte";
	import Trust from "$lib/landing/pages/dashboard/sections/Trust.svelte";
	// Last, so its rules come after the sections' (as when they lived here):
	// some tie with a section's own rule and win by order.
	import DbMain from "$lib/landing/pages/dashboard/DbMain.svelte";

	let { data } = $props();
</script>

<DbMain>
	<Hero />
	<LogoStrip />
	<Kpis />
	<Strike />
	<Features />
	<Quote />
	<Integration />
	<Recommendations />
	<Questions />
	<Testimonials />
	<Roadmap />
	<Closing form={data.finalForm} />
	<Trust />
</DbMain>
<FloatingCta />
