<!-- The shared security block; its "Demo buchen" leads to the booking card on this page. -->
<script lang="ts">
	import { START_HREF } from "$lib/landing/cta";
	import TrustSeals from "$lib/landing/sections/TrustSeals.svelte";
</script>

<TrustSeals demoHref={START_HREF} />
