<script lang="ts">
	import { reveal } from "$lib/landing/attachments/reveal";
	import Benefits from "$lib/landing/pages/wohnungsunternehmen/sections/Benefits.svelte";
	import Closing from "$lib/landing/pages/wohnungsunternehmen/sections/Closing.svelte";
	import Faq from "$lib/landing/pages/wohnungsunternehmen/sections/Faq.svelte";
	import Features from "$lib/landing/pages/wohnungsunternehmen/sections/Features.svelte";
	import FloatingCta from "$lib/landing/pages/wohnungsunternehmen/sections/FloatingCta.svelte";
	import Hero from "$lib/landing/pages/wohnungsunternehmen/sections/Hero.svelte";
	import LargeStock from "$lib/landing/pages/wohnungsunternehmen/sections/LargeStock.svelte";
	import LogoStrip from "$lib/landing/pages/wohnungsunternehmen/sections/LogoStrip.svelte";
	import Pain from "$lib/landing/pages/wohnungsunternehmen/sections/Pain.svelte";
	import Steps from "$lib/landing/pages/wohnungsunternehmen/sections/Steps.svelte";
	import Tabs from "$lib/landing/pages/wohnungsunternehmen/sections/Tabs.svelte";
	import Testimonials from "$lib/landing/pages/wohnungsunternehmen/sections/Testimonials.svelte";
	import Trust from "$lib/landing/pages/wohnungsunternehmen/sections/Trust.svelte";
	import SgMain from "$lib/landing/sections/sg/SgMain.svelte";

	let { data } = $props();
</script>

<main id="content" class="wu" {@attach reveal()}>
	<SgMain>
		<Hero />
		<Tabs />
		<LogoStrip />
		<LargeStock />
		<Pain />
		<Benefits />
		<Features />
		<Steps />
		<Testimonials />
		<Faq items={data.faq} />
		<Closing />
		<Trust />
	</SgMain>
</main>
<FloatingCta />
