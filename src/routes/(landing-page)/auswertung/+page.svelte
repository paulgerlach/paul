<script lang="ts">
	import Closing from "$lib/landing/pages/auswertung/sections/Closing.svelte";
	import Hero from "$lib/landing/pages/auswertung/sections/Hero.svelte";
	import FloatingCta from "$lib/landing/pages/dashboard/sections/FloatingCta.svelte";
	import LogoStrip from "$lib/landing/pages/dashboard/sections/LogoStrip.svelte";
	import Quote from "$lib/landing/pages/dashboard/sections/Quote.svelte";
	import Trust from "$lib/landing/pages/dashboard/sections/Trust.svelte";
	// Last, so its rules come after the sections' (as when they lived here):
	// some tie with a section's own rule and win by order.
	import DbMain from "$lib/landing/pages/dashboard/DbMain.svelte";

	let { data } = $props();
</script>

<DbMain>
	<Hero />
	<LogoStrip />
	<Quote />
	<Closing form={data.finalForm} />
	<Trust />
</DbMain>
<FloatingCta />
