<script lang="ts">
	import facade from "$lib/assets/landing/vorgehen/facade.webp?enhanced";
	import manager from "$lib/assets/landing/weg-verwaltung/manager.webp?enhanced";
	import Hero from "$lib/landing/sections/uv/Hero.svelte";
	import ListMock from "$lib/landing/sections/uv/ListMock.svelte";
	import { hero, list } from "../content";
</script>

<Hero
	id="wv-h1"
	size="lg"
	{...hero}
	photos={[
		{ src: facade, sizes: "25vw" },
		{ src: manager, sizes: "35vw", objectPosition: "58% 30%" },
	]}
>
	{#snippet mock()}<ListMock {...list} />{/snippet}
</Hero>
