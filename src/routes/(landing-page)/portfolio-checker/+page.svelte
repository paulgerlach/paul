<script lang="ts">
	import Closing from "$lib/landing/pages/portfolio-checker/sections/Closing.svelte";
	import Faq from "$lib/landing/pages/portfolio-checker/sections/Faq.svelte";
	import FloatingCta from "$lib/landing/pages/portfolio-checker/sections/FloatingCta.svelte";
	import Trust from "$lib/landing/pages/portfolio-checker/sections/Trust.svelte";

	let { data } = $props();
</script>

<main id="content" class="pc">
	<Faq />
	<Closing form={data.finalForm} />
	<Trust />
</main>
<FloatingCta />
