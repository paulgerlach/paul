<script lang="ts">
	import facade from "$lib/assets/landing/vorgehen/facade.webp?enhanced";
	import installer from "$lib/assets/landing/vorgehen/installer.webp?enhanced";
	import Hero from "$lib/landing/sections/uv/Hero.svelte";
	import ListMock from "$lib/landing/sections/uv/ListMock.svelte";
	import { hero, list } from "../content";
</script>

<Hero
	id="mw-h1"
	size="lg"
	{...hero}
	photos={[
		{ src: facade, sizes: "25vw" },
		{ src: installer, sizes: "35vw", objectPosition: "48% 50%" },
	]}
>
	{#snippet mock()}<ListMock {...list} />{/snippet}
</Hero>
