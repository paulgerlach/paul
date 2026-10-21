<script lang="ts">
	import { reveal } from "$lib/landing/attachments/reveal";
	import Benefits from "$lib/landing/pages/asset-manager/sections/Benefits.svelte";
	import Closing from "$lib/landing/pages/asset-manager/sections/Closing.svelte";
	import Faq from "$lib/landing/pages/asset-manager/sections/Faq.svelte";
	import Features from "$lib/landing/pages/asset-manager/sections/Features.svelte";
	import FloatingCta from "$lib/landing/pages/asset-manager/sections/FloatingCta.svelte";
	import Hero from "$lib/landing/pages/asset-manager/sections/Hero.svelte";
	import LargeStock from "$lib/landing/pages/asset-manager/sections/LargeStock.svelte";
	import LogoStrip from "$lib/landing/pages/asset-manager/sections/LogoStrip.svelte";
	import Pain from "$lib/landing/pages/asset-manager/sections/Pain.svelte";
	import Steps from "$lib/landing/pages/asset-manager/sections/Steps.svelte";
	import Tabs from "$lib/landing/pages/asset-manager/sections/Tabs.svelte";
	import Testimonials from "$lib/landing/pages/asset-manager/sections/Testimonials.svelte";
	import Trust from "$lib/landing/pages/asset-manager/sections/Trust.svelte";
	import SgMain from "$lib/landing/sections/sg/SgMain.svelte";

	let { data } = $props();
</script>

<main id="content" class="am" {@attach reveal()}>
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
		<Closing form={data.finalForm} />
		<Trust />
	</SgMain>
</main>
<FloatingCta />
