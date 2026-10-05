<script lang="ts">
	import AllInOne from "$lib/landing/pages/messdienstanbieter-city/sections/AllInOne.svelte";
	import Duo from "$lib/landing/pages/messdienstanbieter-city/sections/Duo.svelte";
	import Faq from "$lib/landing/pages/messdienstanbieter-city/sections/Faq.svelte";
	import FinalCta from "$lib/landing/pages/messdienstanbieter-city/sections/FinalCta.svelte";
	import Hero from "$lib/landing/pages/messdienstanbieter-city/sections/Hero.svelte";
	import LocalService from "$lib/landing/pages/messdienstanbieter-city/sections/LocalService.svelte";
	import LogoStrip from "$lib/landing/pages/messdienstanbieter-city/sections/LogoStrip.svelte";
	import NoWait from "$lib/landing/pages/messdienstanbieter-city/sections/NoWait.svelte";
	import OneClickBilling from "$lib/landing/pages/messdienstanbieter-city/sections/OneClickBilling.svelte";
	import References from "$lib/landing/pages/messdienstanbieter-city/sections/References.svelte";
	import RegionMap from "$lib/landing/pages/messdienstanbieter-city/sections/RegionMap.svelte";
	import Trio from "$lib/landing/pages/messdienstanbieter-city/sections/Trio.svelte";
	import Trust from "$lib/landing/pages/messdienstanbieter-city/sections/Trust.svelte";
	import ServiceJsonLd from "$lib/landing/sections/region/ServiceJsonLd.svelte";
	import { cityRoute } from "$lib/routes";

	let { data } = $props();
	const content = $derived(data.content);
</script>

<ServiceJsonLd
	area={{ type: "City", name: content.name }}
	url={cityRoute(content.slug ?? "")}
/>

<!-- Keyed, so a client-side switch between cities resets every section's state. -->
{#key content.slug}
	<main id="content">
		<Hero {content} form={data.heroForm} />
		<LogoStrip {content} />
		<NoWait {content} />
		<AllInOne {content} />
		<RegionMap {content} />
		<OneClickBilling {content} />
		<LocalService {content} />
		<Duo {content} />
		<Trio {content} />
		<References {content} />
		<Faq {content} />
		<FinalCta {content} form={data.finalForm} />
		<Trust />
	</main>
{/key}
