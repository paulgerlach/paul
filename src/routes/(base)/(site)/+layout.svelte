<script lang="ts">
	import { dev } from "$app/environment";
	import LandingFooter from "$lib/landing/components/LandingFooter.svelte";
	import LandingHeader from "$lib/landing/components/LandingHeader.svelte";
	import { DEFAULT_CHROME } from "$lib/landing/chrome";

	let { children } = $props();

	const chrome = DEFAULT_CHROME;
</script>

<!--
  The blog, the Fragebogen and the legal pages keep their Exo 2 / Tailwind
  content, so it must not sit inside .lp (which restyles every element). The
  header and footer get their own .lp wrappers with `display: contents`: no
  box of their own, so the sticky nav sticks against <body>, while the tokens
  and .lp selectors still apply.
-->
<div class="lp lp-chrome" data-dev={dev || undefined}>
	<LandingHeader
		bannerText={chrome.bannerText}
		bannerHref={chrome.bannerHref}
	/>
</div>
{@render children()}
<div class="lp lp-chrome">
	<LandingFooter />
</div>

<style>
	.lp-chrome {
		display: contents;
	}
</style>
