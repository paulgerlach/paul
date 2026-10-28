<script lang="ts">
	import AllInOne from "$lib/landing/pages/messdienstanbieter/sections/AllInOne.svelte";
	import Compare from "$lib/landing/pages/messdienstanbieter/sections/Compare.svelte";
	import Duo from "$lib/landing/pages/messdienstanbieter/sections/Duo.svelte";
	import Faq from "$lib/landing/pages/messdienstanbieter/sections/Faq.svelte";
	import FinalCta from "$lib/landing/pages/messdienstanbieter/sections/FinalCta.svelte";
	import Hero from "$lib/landing/pages/messdienstanbieter/sections/Hero.svelte";
	import LocalService from "$lib/landing/pages/messdienstanbieter/sections/LocalService.svelte";
	import LogoStrip from "$lib/landing/pages/messdienstanbieter/sections/LogoStrip.svelte";
	import NoWait from "$lib/landing/pages/messdienstanbieter/sections/NoWait.svelte";
	import OneClickBilling from "$lib/landing/pages/messdienstanbieter/sections/OneClickBilling.svelte";
	import People from "$lib/landing/pages/messdienstanbieter/sections/People.svelte";
	import Reasons from "$lib/landing/pages/messdienstanbieter/sections/Reasons.svelte";
	import References from "$lib/landing/pages/messdienstanbieter/sections/References.svelte";
	import RegionMap from "$lib/landing/pages/messdienstanbieter/sections/RegionMap.svelte";
	import Trio from "$lib/landing/pages/messdienstanbieter/sections/Trio.svelte";
	import Trust from "$lib/landing/pages/messdienstanbieter/sections/Trust.svelte";
	import RegionMain from "$lib/landing/sections/region/RegionMain.svelte";
	import ServiceJsonLd from "$lib/landing/sections/region/ServiceJsonLd.svelte";
	import { ROUTE_HOME } from "$lib/routes";
	import { organizationJsonLdScript } from "$lib/seo/organization";

	let { data } = $props();
	const content = $derived(data.content);
</script>

<!-- The new home carries the site's Organization. -->
<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- static data, "<" escaped -->
	{@html organizationJsonLdScript}
</svelte:head>

<ServiceJsonLd
	area={{ type: "Country", name: "Deutschland" }}
	url={ROUTE_HOME}
/>

<RegionMain>
	<Hero {content} form={data.heroForm} />
	<LogoStrip {content} />
	<NoWait {content} />
	<AllInOne {content} />
	<RegionMap {content} />
	<OneClickBilling {content} />
	<LocalService {content} />
	<Duo {content} />
	<Trio {content} />
	<Reasons {content} />
	<Compare {content} />
	<People {content} />
	<References {content} />
	<Faq {content} />
	<FinalCta {content} form={data.finalForm} />
	<Trust />
</RegionMain>
