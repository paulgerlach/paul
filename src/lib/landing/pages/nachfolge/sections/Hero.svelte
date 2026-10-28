<script lang="ts">
	import building from "$lib/assets/landing/vorgehen/building-wide.webp?enhanced";
	import consultation from "$lib/assets/landing/selbstabrechnung/beratung.webp?enhanced";
	import Hero from "$lib/landing/sections/uv/Hero.svelte";
	import ListMock from "$lib/landing/sections/uv/ListMock.svelte";
	import { hero, list } from "../content";
</script>

<Hero
	id="nf-h1"
	size="lg"
	{...hero}
	photos={[
		{ src: building, sizes: "25vw" },
		{ src: consultation, sizes: "35vw", objectPosition: "60% 30%" },
	]}
>
	{#snippet mock()}<ListMock {...list} />{/snippet}
</Hero>
