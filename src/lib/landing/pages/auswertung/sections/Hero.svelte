<!-- The hero (`.db-hero`): /dashboard's frame with one line and the mock-up. -->
<script lang="ts">
	import HeroFrame from "$lib/landing/pages/dashboard/components/HeroFrame.svelte";
	import { hero } from "../content";
	import PortfolioMock from "./PortfolioMock.svelte";
</script>

<div class="aw-hero">
	<HeroFrame
		pill={hero.pill}
		h1={hero.h1}
		primary={hero.primary}
		secondary={hero.secondary}
	>
		{#snippet line()}
			<span class="l1">{hero.line}</span>
		{/snippet}
		<PortfolioMock />
	</HeroFrame>
</div>

<style>
	/* The design's hero ends with the mock-up: no `.lp .sec` bottom padding */
	.aw-hero :global(.hero) {
		padding-bottom: 0;
	}
</style>
