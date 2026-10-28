<script lang="ts">
	import facade from "$lib/assets/landing/vorgehen/facade.webp?enhanced";
	import meters from "$lib/assets/landing/vorgehen/kitchen-meters.webp?enhanced";
	import Hero from "$lib/landing/sections/uv/Hero.svelte";
	import { hero } from "../content";
	import Hub from "./Hub.svelte";
</script>

<!-- The design's #ip-h1 sets the two-line word's size at every width. -->
<Hero
	id="iop-h1"
	size="lg"
	{...hero}
	wordSize="clamp(34px, 9.6vw, 150px)"
	photos={[
		{ src: facade, sizes: "25vw" },
		{ src: meters, sizes: "35vw", objectPosition: "100% 55%" },
	]}
>
	{#snippet mock()}<Hub />{/snippet}
</Hero>
