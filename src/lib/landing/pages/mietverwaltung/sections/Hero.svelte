<script lang="ts">
	import consultation from "$lib/assets/landing/selbstabrechnung/beratung.webp?enhanced";
	import facade from "$lib/assets/landing/cities/muenchen/hero.jpg?enhanced";
	import Hero from "$lib/landing/sections/uv/Hero.svelte";
	import ListMock from "$lib/landing/sections/uv/ListMock.svelte";
	import { hero, list } from "../content";
</script>

<Hero
	id="mv-h1"
	size="lg"
	{...hero}
	photos={[
		{ src: facade, sizes: "25vw" },
		{ src: consultation, sizes: "35vw", objectPosition: "58% 30%" },
	]}
>
	{#snippet mock()}<ListMock {...list} />{/snippet}
</Hero>
