<script lang="ts">
	import { onMount, untrack } from "svelte";
	import { setDeadlineClock } from "$lib/landing/deadline/clock.svelte";
	import Analysis from "$lib/landing/pages/bleimessung/sections/Analysis.svelte";
	import Check from "$lib/landing/pages/bleimessung/sections/Check.svelte";
	import Closing from "$lib/landing/pages/bleimessung/sections/Closing.svelte";
	import Duties from "$lib/landing/pages/bleimessung/sections/Duties.svelte";
	import Faq from "$lib/landing/pages/bleimessung/sections/Faq.svelte";
	import Heidi from "$lib/landing/pages/bleimessung/sections/Heidi.svelte";
	import Hero from "$lib/landing/pages/bleimessung/sections/Hero.svelte";
	import Picture from "$lib/landing/pages/bleimessung/sections/Picture.svelte";
	import Steps from "$lib/landing/pages/bleimessung/sections/Steps.svelte";
	import Urgency from "$lib/landing/pages/bleimessung/sections/Urgency.svelte";
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
	<Analysis />
	<Duties />
	<Steps />
	<Picture />
	<Heidi />
	<Faq />
	<Closing />
	<TrustSeals />
</SvcMain>
<FloatingCta />
