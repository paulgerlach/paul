<script lang="ts">
	import fitter from "$lib/assets/landing/installationspartner/fitter.webp?enhanced";
	import building from "$lib/assets/landing/vorgehen/building-wide.webp?enhanced";
	import Hero from "$lib/landing/sections/uv/Hero.svelte";
	import ListMock from "$lib/landing/sections/uv/ListMock.svelte";
	import { hero, list } from "../content";
</script>

<Hero
	id="it-h1"
	size="lg"
	{...hero}
	photos={[
		{ src: building, sizes: "25vw" },
		{ src: fitter, sizes: "35vw", objectPosition: "42% 50%" },
	]}
>
	{#snippet mock()}<ListMock {...list} />{/snippet}
</Hero>
