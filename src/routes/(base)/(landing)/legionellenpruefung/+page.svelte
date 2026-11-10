<script lang="ts">
	import Check from "$lib/landing/pages/legionellenpruefung/sections/Check.svelte";
	import Closing from "$lib/landing/pages/legionellenpruefung/sections/Closing.svelte";
	import Duties from "$lib/landing/pages/legionellenpruefung/sections/Duties.svelte";
	import Faq from "$lib/landing/pages/legionellenpruefung/sections/Faq.svelte";
	import Heidi from "$lib/landing/pages/legionellenpruefung/sections/Heidi.svelte";
	import Hero from "$lib/landing/pages/legionellenpruefung/sections/Hero.svelte";
	import LabPicture from "$lib/landing/pages/legionellenpruefung/sections/LabPicture.svelte";
	import Sampling from "$lib/landing/pages/legionellenpruefung/sections/Sampling.svelte";
	import Steps from "$lib/landing/pages/legionellenpruefung/sections/Steps.svelte";
	import Urgency from "$lib/landing/pages/legionellenpruefung/sections/Urgency.svelte";
	import FloatingCta from "$lib/landing/sections/FloatingCta.svelte";
	import SvcMain from "$lib/landing/sections/svc/SvcMain.svelte";
	import TrustSeals from "$lib/landing/sections/TrustSeals.svelte";
</script>

<SvcMain>
	<Hero />
	<Urgency />
	<Check />
	<Sampling />
	<Duties />
	<Steps />
	<LabPicture />
	<Heidi />
	<Faq />
	<Closing />
	<TrustSeals />
</SvcMain>
<FloatingCta />
