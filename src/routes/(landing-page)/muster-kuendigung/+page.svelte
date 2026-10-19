<script lang="ts">
	import Closing from "$lib/landing/pages/muster-kuendigung/sections/Closing.svelte";
	import FloatingCta from "$lib/landing/pages/muster-kuendigung/sections/FloatingCta.svelte";
	import Trust from "$lib/landing/pages/muster-kuendigung/sections/Trust.svelte";

	let { data } = $props();
</script>

<main id="content" class="mk">
	<Closing form={data.finalForm} />
	<Trust />
</main>
<FloatingCta />
