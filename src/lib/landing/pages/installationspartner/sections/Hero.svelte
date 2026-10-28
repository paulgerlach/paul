<script lang="ts">
	import facade from "$lib/assets/landing/installationspartner/facade.webp?enhanced";
	import fitter from "$lib/assets/landing/installationspartner/fitter.webp?enhanced";
	import Hero from "$lib/landing/sections/uv/Hero.svelte";
	import ListMock from "$lib/landing/sections/uv/ListMock.svelte";
	import { hero, list } from "../content";
</script>

<Hero
	id="ip-h1"
	size="lg"
	{...hero}
	photos={[
		{ src: facade, sizes: "25vw" },
		{ src: fitter, sizes: "35vw", objectPosition: "42% 50%" },
	]}
>
	{#snippet mock()}<ListMock {...list} />{/snippet}
</Hero>
