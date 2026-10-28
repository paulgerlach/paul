<script lang="ts">
	import facade from "$lib/assets/landing/vorgehen/facade.webp?enhanced";
	import meters from "$lib/assets/landing/vorgehen/kitchen-meters.webp?enhanced";
	import Hero from "$lib/landing/sections/uv/Hero.svelte";
	import ListMock from "$lib/landing/sections/uv/ListMock.svelte";
	import { hero, list } from "../content";
</script>

<Hero
	id="fz-h1"
	size="lg"
	{...hero}
	photos={[
		{ src: facade, sizes: "25vw" },
		{ src: meters, sizes: "35vw", objectPosition: "100% 55%" },
	]}
>
	{#snippet mock()}<ListMock {...list} />{/snippet}
</Hero>
