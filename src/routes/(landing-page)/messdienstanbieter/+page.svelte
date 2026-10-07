<script lang="ts">
	import AllInOne from "$lib/landing/pages/messdienstanbieter/sections/AllInOne.svelte";
	import Duo from "$lib/landing/pages/messdienstanbieter/sections/Duo.svelte";
	import Faq from "$lib/landing/pages/messdienstanbieter/sections/Faq.svelte";
	import FinalCta from "$lib/landing/pages/messdienstanbieter/sections/FinalCta.svelte";
	import Hero from "$lib/landing/pages/messdienstanbieter/sections/Hero.svelte";
	import LocalService from "$lib/landing/pages/messdienstanbieter/sections/LocalService.svelte";
	import LogoStrip from "$lib/landing/pages/messdienstanbieter/sections/LogoStrip.svelte";
	import NoWait from "$lib/landing/pages/messdienstanbieter/sections/NoWait.svelte";
	import OneClickBilling from "$lib/landing/pages/messdienstanbieter/sections/OneClickBilling.svelte";
	import References from "$lib/landing/pages/messdienstanbieter/sections/References.svelte";
	import RegionMap from "$lib/landing/pages/messdienstanbieter/sections/RegionMap.svelte";
	import Trio from "$lib/landing/pages/messdienstanbieter/sections/Trio.svelte";
	import Trust from "$lib/landing/pages/messdienstanbieter/sections/Trust.svelte";
	import ServiceJsonLd from "$lib/landing/sections/region/ServiceJsonLd.svelte";
	import { ROUTE_MESSDIENSTANBIETER } from "$lib/routes";

	let { data } = $props();
	const content = $derived(data.content);
</script>

<ServiceJsonLd
	area={{ type: "Country", name: "Deutschland" }}
	url={ROUTE_MESSDIENSTANBIETER}
/>

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
