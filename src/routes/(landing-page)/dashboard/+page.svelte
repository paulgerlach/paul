<script lang="ts">
	import { reveal } from "$lib/landing/attachments/reveal";
	import Closing from "$lib/landing/pages/dashboard/sections/Closing.svelte";
	import FloatingCta from "$lib/landing/pages/dashboard/sections/FloatingCta.svelte";
	import Trust from "$lib/landing/pages/dashboard/sections/Trust.svelte";

	let { data } = $props();
</script>

<main id="content" class="db" {@attach reveal()}>
	<h1 class="wrap">Ihr ganzer Bestand. In einem Dashboard.</h1>
	<Closing form={data.finalForm} />
	<Trust />
</main>
<FloatingCta />
