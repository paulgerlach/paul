<!-- The template's hero with the heat map card. -->
<script lang="ts">
	import SvcHero from "$lib/landing/sections/svc/Hero.svelte";
	import { hero } from "../content";
	import HeatCard from "./HeatCard.svelte";
</script>

<SvcHero {hero} id="ha-h1">
	{#snippet icon()}
		<path d="M10 3v14M5 7l5-4 5 4M5 13l5 4 5-4" />
	{/snippet}
	{#snippet card()}<HeatCard />{/snippet}
</SvcHero>
