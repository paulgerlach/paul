<script lang="ts">
	import { onMount, untrack } from "svelte";
	import { setDeadlineClock } from "$lib/landing/deadline/clock.svelte";
	import Check from "$lib/landing/pages/hydraulischer-abgleich/sections/Check.svelte";
	import Closing from "$lib/landing/pages/hydraulischer-abgleich/sections/Closing.svelte";
	import Duties from "$lib/landing/pages/hydraulischer-abgleich/sections/Duties.svelte";
	import Faq from "$lib/landing/pages/hydraulischer-abgleich/sections/Faq.svelte";
	import Heidi from "$lib/landing/pages/hydraulischer-abgleich/sections/Heidi.svelte";
	import Hero from "$lib/landing/pages/hydraulischer-abgleich/sections/Hero.svelte";
	import Picture from "$lib/landing/pages/hydraulischer-abgleich/sections/Picture.svelte";
	import Planning from "$lib/landing/pages/hydraulischer-abgleich/sections/Planning.svelte";
	import Steps from "$lib/landing/pages/hydraulischer-abgleich/sections/Steps.svelte";
	import Urgency from "$lib/landing/pages/hydraulischer-abgleich/sections/Urgency.svelte";
	import FloatingCta from "$lib/landing/sections/FloatingCta.svelte";
	import SvcMain from "$lib/landing/sections/svc/SvcMain.svelte";
	import TrustSeals from "$lib/landing/sections/TrustSeals.svelte";

	let { data } = $props();

	// SSR and hydration render from the server's time; the browser's clock
	// takes over on mount.
	const clock = setDeadlineClock(untrack(() => data.now));
	onMount(() => clock.start());
</script>

<SvcMain>
	<Hero />
	<Urgency />
	<Check />
	<Planning />
	<Duties />
	<Steps />
	<Picture />
	<Heidi />
	<Faq />
	<Closing />
	<TrustSeals />
</SvcMain>
<FloatingCta />
