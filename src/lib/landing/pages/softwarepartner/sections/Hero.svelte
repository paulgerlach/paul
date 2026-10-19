<script lang="ts">
	import facade from "$lib/assets/landing/cities/muenchen/hero.jpg?enhanced";
	import apartment from "$lib/assets/landing/mietverwaltung/apartment.webp?enhanced";
	import Hero from "$lib/landing/sections/uv/Hero.svelte";
	import ListMock from "$lib/landing/sections/uv/ListMock.svelte";
	import { hero, list } from "../content";
</script>

<Hero
	id="sp-h1"
	size="lg"
	{...hero}
	photos={[
		{ src: facade, sizes: "25vw" },
		{ src: apartment, sizes: "35vw" },
	]}
>
	{#snippet mock()}<ListMock {...list} />{/snippet}
</Hero>
