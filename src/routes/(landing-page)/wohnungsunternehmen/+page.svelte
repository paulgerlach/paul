<script lang="ts">
	import { reveal } from "$lib/landing/attachments/reveal";
	import Closing from "$lib/landing/pages/wohnungsunternehmen/sections/Closing.svelte";
	import Faq from "$lib/landing/pages/wohnungsunternehmen/sections/Faq.svelte";
	import FloatingCta from "$lib/landing/pages/wohnungsunternehmen/sections/FloatingCta.svelte";
	import LogoStrip from "$lib/landing/pages/wohnungsunternehmen/sections/LogoStrip.svelte";
	import Testimonials from "$lib/landing/pages/wohnungsunternehmen/sections/Testimonials.svelte";
	import Trust from "$lib/landing/pages/wohnungsunternehmen/sections/Trust.svelte";
	import SgMain from "$lib/landing/sections/sg/SgMain.svelte";

	let { data } = $props();
</script>

<main id="content" class="wu" {@attach reveal()}>
	<SgMain>
		<LogoStrip />
		<Testimonials />
		<Faq items={data.faq} />
		<Closing form={data.finalForm} />
		<Trust />
	</SgMain>
</main>
<FloatingCta />
