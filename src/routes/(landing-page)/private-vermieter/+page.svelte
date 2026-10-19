<script lang="ts">
	import { reveal } from "$lib/landing/attachments/reveal";
	import FloatingCta from "$lib/landing/pages/private-vermieter/sections/FloatingCta.svelte";
	import Trust from "$lib/landing/pages/private-vermieter/sections/Trust.svelte";
</script>

<main id="content" class="pv" {@attach reveal()}>
	<Trust />
</main>
<FloatingCta />
