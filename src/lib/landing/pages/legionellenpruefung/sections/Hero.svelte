<!-- The template's hero with the example lab result card. -->
<script lang="ts">
	import SvcHero from "$lib/landing/sections/svc/Hero.svelte";
	import { hero } from "../content";
	import BefundCard from "./BefundCard.svelte";
</script>

<SvcHero {hero} id="lg-h1">
	{#snippet icon()}
		<path d="M10 2.5s5 5.6 5 9.3a5 5 0 0 1-10 0c0-3.7 5-9.3 5-9.3z" />
	{/snippet}
	{#snippet card()}<BefundCard />{/snippet}
</SvcHero>
