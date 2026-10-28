<script lang="ts">
	import booth from "$lib/assets/landing/verbaende/booth.webp?enhanced";
	import facade from "$lib/assets/landing/vorgehen/facade.webp?enhanced";
	import Hero from "$lib/landing/sections/uv/Hero.svelte";
	import ListMock from "$lib/landing/sections/uv/ListMock.svelte";
	import { hero, list } from "../content";
</script>

<Hero
	id="vb-h1"
	size="lg"
	{...hero}
	photos={[
		{ src: facade, sizes: "25vw" },
		{ src: booth, sizes: "35vw" },
	]}
>
	{#snippet mock()}<ListMock {...list} />{/snippet}
</Hero>
