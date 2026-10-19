<script lang="ts">
	import Closing from "$lib/landing/pages/energieausweis/sections/Closing.svelte";
	import Faq from "$lib/landing/pages/energieausweis/sections/Faq.svelte";
	import FloatingCta from "$lib/landing/pages/energieausweis/sections/FloatingCta.svelte";
	import Trust from "$lib/landing/pages/energieausweis/sections/Trust.svelte";

	let { data } = $props();
</script>

<main id="content" class="ea">
	<Faq />
	<Closing form={data.finalForm} />
	<Trust />
</main>
<FloatingCta />
