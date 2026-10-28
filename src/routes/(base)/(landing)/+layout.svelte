<script lang="ts">
	import { dev } from "$app/environment";
	import { page } from "$app/state";
	import LandingFooter from "$lib/landing/components/LandingFooter.svelte";
	import LandingHeader from "$lib/landing/components/LandingHeader.svelte";
	import { DEFAULT_CHROME } from "$lib/landing/chrome";

	let { children } = $props();

	// Each page returns its header texts from its load as `landing`.
	const chrome = $derived(page.data.landing ?? DEFAULT_CHROME);
</script>

<div class="lp" data-dev={dev || undefined}>
	<LandingHeader
		bannerText={chrome.bannerText}
		bannerHref={chrome.bannerHref}
		demoHref={chrome.demoHref}
	/>
	{@render children()}
	<LandingFooter demoHref={chrome.demoHref} />
</div>
